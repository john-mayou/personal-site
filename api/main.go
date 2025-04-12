package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type Metric string

const (
	PageViewTotal    Metric = "page_view_total"
	FileClickTotal   Metric = "file_click_total"
	SocialClickTotal Metric = "social_click_total"
)

type MetricsHandler struct {
	PageViewCounter    prometheus.Counter
	FileClickCounter   *prometheus.CounterVec
	SocialClickCounter *prometheus.CounterVec
}

func NewMetricsHandler() *MetricsHandler {
	return &MetricsHandler{
		PageViewCounter: promauto.NewCounter(prometheus.CounterOpts{
			Name: string(PageViewTotal),
			Help: "Total number of page views",
		}),
		FileClickCounter: promauto.NewCounterVec(prometheus.CounterOpts{
			Name: string(FileClickTotal),
			Help: "Total number of file clicks",
		}, []string{"file"}),
		SocialClickCounter: promauto.NewCounterVec(prometheus.CounterOpts{
			Name: string(SocialClickTotal),
			Help: "Total number of social link clicks",
		}, []string{"platform"}),
	}
}

func NewTestMetricsHandler() *MetricsHandler {
	return &MetricsHandler{
		PageViewCounter:    prometheus.NewCounter(prometheus.CounterOpts{Name: string(PageViewTotal)}),
		FileClickCounter:   prometheus.NewCounterVec(prometheus.CounterOpts{Name: string(FileClickTotal)}, []string{"file"}),
		SocialClickCounter: prometheus.NewCounterVec(prometheus.CounterOpts{Name: string(SocialClickTotal)}, []string{"platform"}),
	}
}

type MetricsTrackBody struct {
	Name   string            `json:"name"`
	Count  int               `json:"count"`
	Labels map[string]string `json:"labels"`
}

func (h *MetricsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var body MetricsTrackBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding JSON body: %v", err.Error()), http.StatusBadRequest)
		return
	}

	switch body.Name {
	case string(PageViewTotal):
		h.PageViewCounter.Add(float64(body.Count))
	case string(FileClickTotal):
		file, ok := body.Labels["file"]
		if !ok {
			http.Error(w, "Missing 'file' label for file_click_total metric", http.StatusBadRequest)
			return
		}
		h.FileClickCounter.WithLabelValues(file).Add(float64(body.Count))
	case string(SocialClickTotal):
		platform, ok := body.Labels["platform"]
		if !ok {
			http.Error(w, "Missing 'platform' label for social_click metric", http.StatusBadRequest)
			return
		}
		h.SocialClickCounter.WithLabelValues(platform).Add(float64(body.Count))
	default:
		http.Error(w, fmt.Sprintf("Invalid name parameter: %v", body.Name), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "healthy"}`))
}

func main() {
	metricsHandler := NewMetricsHandler()
	http.Handle("/api/metrics", promhttp.Handler())
	http.HandleFunc("/api/metrics/track", metricsHandler.ServeHTTP)
	http.HandleFunc("/api/health", healthHandler)

	cwd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Failure to get current working directory: %v", err.Error())
	}
	compilerPath := filepath.Join(cwd, "../compiler")
	http.Handle("/api/ruby/", http.StripPrefix("/api/ruby/", http.FileServer(http.Dir(compilerPath))))

	port := 8080
	fmt.Printf("Server running at http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), nil))
}

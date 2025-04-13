package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/prometheus/client_golang/prometheus/testutil"
	"github.com/stretchr/testify/assert"
)

func TestMetricsHandler(t *testing.T) {
	tests := map[string]struct {
		name   string
		body   MetricsTrackBody
		assert func(t *testing.T, h *MetricsHandler)
	}{
		"page_view_total increments": {
			body: MetricsTrackBody{
				Name:  string(PageViewTotal),
				Count: 1,
			},
			assert: func(t *testing.T, h *MetricsHandler) {
				assert.Equal(t, 1.0, testutil.ToFloat64(h.PageViewCounter))
			},
		},
		"file_click_total increments with category label": {
			body: MetricsTrackBody{
				Name:  string(FileClickTotal),
				Count: 1,
				Labels: map[string]string{
					"category": "resume.pdf",
				},
			},
			assert: func(t *testing.T, h *MetricsHandler) {
				assert.Equal(t, 1.0, testutil.ToFloat64(h.FileClickCounter.WithLabelValues("resume.pdf")))
			},
		},
		"social_click_total increments with platform label": {
			body: MetricsTrackBody{
				Name:  string(SocialClickTotal),
				Count: 1,
				Labels: map[string]string{
					"platform": "github",
				},
			},
			assert: func(t *testing.T, h *MetricsHandler) {
				assert.Equal(t, 1.0, testutil.ToFloat64(h.SocialClickCounter.WithLabelValues("github")))
			},
		},
	}

	for tcname, tc := range tests {
		t.Run(tcname, func(t *testing.T) {
			data, err := json.Marshal(tc.body)
			assert.NoError(t, err)
			req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(data))
			w := httptest.NewRecorder()

			handler := NewTestMetricsHandler()
			handler.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)
			tc.assert(t, handler)
		})
	}

	t.Run("invalid name returns 400", func(t *testing.T) {
		data, err := json.Marshal(MetricsTrackBody{Name: "random"})
		assert.NoError(t, err)
		req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(data))
		w := httptest.NewRecorder()

		handler := NewTestMetricsHandler()
		handler.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestHealthHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(healthHandler)
	handler.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Equal(t, `{"status": "healthy"}`, rr.Body.String())
}

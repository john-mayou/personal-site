FROM golang:1.23
WORKDIR /app
COPY api/go.mod api/go.sum ./
RUN go mod download
COPY api/*.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o main.exe
EXPOSE 8080
CMD ["./main.exe"]
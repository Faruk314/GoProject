package main

import (
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	fmt.Println("Server 1.22.4 starting on :8080")

	mux.HandleFunc("GET /api/status", getStatusHandler)

	http.ListenAndServe(":8080", mux)
}

func getStatusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Content-Type", "application/json")

	fmt.Fprint(w, `{"text": "Backend is healthy", "status": 200}`)
}

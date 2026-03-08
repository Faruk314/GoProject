package routes

import (
	"net/http"
)

func NewRouter() http.Handler {
	mux := http.NewServeMux()

	registerAuthRoutes(mux)

	return mux
}

package routes

import (
	"backend/internals/handlers"
	"backend/internals/middlewares"
	"net/http"
)

func NewRouter() http.Handler {
	mux := http.NewServeMux()

	registerAuthRoutes(mux)

	wsHandler := http.HandlerFunc(handlers.HandleWS)
	mux.Handle("/api/ws", middlewares.AuthMiddleware(wsHandler))

	return mux
}

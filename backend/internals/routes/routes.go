package routes

import (
	"backend/internals/middlewares"
	"backend/internals/ws"
	"net/http"
)

func NewRouter(cm *ws.ConnectionManager) http.Handler {
	mux := http.NewServeMux()

	registerAuthRoutes(mux)

	wsHandler := http.HandlerFunc(cm.HandleWS)
	mux.Handle("/api/ws", middlewares.AuthMiddleware(wsHandler))

	return mux
}

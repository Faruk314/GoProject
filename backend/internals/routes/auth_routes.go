package routes

import (
	"backend/internals/handlers"
	"backend/internals/middlewares"
	"net/http"
)

func registerAuthRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/auth/login", handlers.LoginHandler)
	mux.HandleFunc("POST /api/auth/register", handlers.RegisterHandler)

	meHandler := http.HandlerFunc(handlers.GetMeHandler)
	mux.Handle("GET /api/auth/me", middlewares.AuthMiddleware(meHandler))

	logoutHandler := http.HandlerFunc(handlers.LogoutHandler)
	mux.Handle("POST /api/auth/logout", middlewares.AuthMiddleware(logoutHandler))
}

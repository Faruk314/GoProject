package middlewares

import (
	"backend/internals/repository"
	"backend/internals/response"
	"context"
	"net/http"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_id")
		if err != nil {
			response.SendError(w, http.StatusUnauthorized, "Not authenticated")
			return
		}

		userID, err := repository.GetUserIDBySession(cookie.Value)
		if err != nil {

			response.SendError(w, http.StatusUnauthorized, "Session expired")
			return
		}

		ctx := context.WithValue(r.Context(), "user_id", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

package response

import (
	"net/http"
	"os"
)

func SetSessionCookie(w http.ResponseWriter, token string, maxAge int) {
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   os.Getenv("APP_ENV") == "production",
		SameSite: http.SameSiteLaxMode,
		MaxAge:   maxAge,
	})
}

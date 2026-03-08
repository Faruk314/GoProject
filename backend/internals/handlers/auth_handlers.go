package handlers

import (
	"backend/internals/models"
	"backend/internals/repository"
	"backend/internals/response"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var input models.LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.SendError(w, http.StatusBadRequest, "Invalid JSON format")
		return
	}

	user, err := repository.GetUserByEmail(input.Email)
	if err != nil {
		response.SendError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		response.SendError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	sessionToken := uuid.New().String()

	err = repository.CreateSession(sessionToken, user.ID, 24*time.Hour)
	if err != nil {
		response.SendError(w, http.StatusInternalServerError, "Could not create session")
		return
	}

	response.SetSessionCookie(w, sessionToken, 86400)

	userInfo := models.User{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}

	resp := models.LoginResponse{
		Message:  "Login successful",
		Success:  true,
		UserInfo: userInfo,
	}

	response.SendJSON(w, http.StatusOK, resp)
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var input models.RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.SendError(w, http.StatusBadRequest, "Invalid JSON format")
		return
	}

	if len(input.Password) < 8 {
		response.SendError(w, http.StatusBadRequest, "Password must be at least 8 characters")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 12)
	if err != nil {
		response.SendError(w, http.StatusInternalServerError, "Failed to process password")
		return
	}

	userID, err := repository.CreateUser(input.Username, input.Email, string(hashedPassword))
	if err != nil {

		response.SendError(w, http.StatusConflict, "Email already in use")
		return
	}

	sessionToken := uuid.New().String()

	err = repository.CreateSession(sessionToken, userID, 24*time.Hour)
	if err != nil {

		log.Printf("Failed to create Redis session for user %d: %v", userID, err)

		response.SendJSON(w, http.StatusCreated, models.GenericResponse{
			Success: true,
			Message: "Account created successfully, but session initiation failed. Please log in manually.",
			Data: map[string]any{
				"userId": userID,
			},
		})
		return
	}

	response.SetSessionCookie(w, sessionToken, 86400)

	response.SendJSON(w, http.StatusCreated, models.LoginResponse{
		Message: "Registration successful",
		Success: true,
		UserInfo: models.User{
			ID:       userID,
			Username: input.Username,
			Email:    input.Email,
		},
	})
}

func GetMeHandler(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(int)
	if !ok {
		response.SendError(w, http.StatusUnauthorized, "Invalid session context")
		return
	}

	user, err := repository.GetUserByID(userID)
	if err != nil {
		response.SendError(w, http.StatusNotFound, "User profile not found")
		return
	}

	response.SendJSON(w, http.StatusOK, models.LoginResponse{
		Success: true,
		Message: "Session is active",
		UserInfo: models.User{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
		},
	})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_id")
	if err != nil {

		response.SendJSON(w, http.StatusOK, models.GenericResponse{
			Success: true,
			Message: "Already logged out",
		})
		return
	}

	err = repository.DeleteSession(cookie.Value)
	if err != nil {
		log.Printf("Logout Error (Redis): %v", err)
	}

	response.SetSessionCookie(w, "", -1)

	response.SendJSON(w, http.StatusOK, models.GenericResponse{
		Success: true,
		Message: "Successfully logged out",
	})
}

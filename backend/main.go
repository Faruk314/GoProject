package main

import (
	"backend/internals/database"
	"backend/internals/middlewares"
	"backend/internals/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	database.InitDB()
	defer database.Pool.Close()

	if err := database.InitRedis(); err != nil {
		log.Fatal("Could not connect to Redis: ", err)
	}

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	addr := ":" + port

	router := routes.NewRouter()
	handler := middlewares.CORSMiddleware(router)

	log.Printf("Server is running on http://localhost%s\n", addr)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}

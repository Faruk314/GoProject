package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func InitDB() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL is not set in environment")
	}

	var err error
	Pool, err = pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}

	err = Pool.Ping(context.Background())
	if err != nil {
		log.Fatalf("Database connection failed: %v\n", err)
	}

	log.Println("Connected to PostgreSQL successfully!")
}

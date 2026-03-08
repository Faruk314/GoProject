package repository

import (
	"backend/internals/database"
	"backend/internals/models"
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

func GetUserByEmail(email string) (*models.User, error) {
	user := &models.User{}

	query := `
        SELECT id, username, email, password 
        FROM users 
        WHERE email = $1
    `

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := database.Pool.QueryRow(ctx, query, email).
		Scan(&user.ID, &user.Username, &user.Email, &user.Password)
	if err != nil {

		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}

	return user, nil
}

func GetUserByID(id int) (*models.User, error) {
	user := &models.User{}

	query := `
        SELECT id, username, email 
        FROM users 
        WHERE id = $1
    `

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := database.Pool.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}

	return user, nil
}

func CreateUser(username, email, passwordHash string) (int, error) {
	var id int
	query := `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`

	err := database.Pool.QueryRow(context.Background(), query, username, email, passwordHash).Scan(&id)
	return id, err
}

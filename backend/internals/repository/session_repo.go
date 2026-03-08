package repository

import (
	"backend/internals/database"
	"context"
	"fmt"
	"strconv"
	"time"
)

const (
	sessionPrefix = "session:"
	redisTimeout  = 3 * time.Second
)

func CreateSession(token string, userID int, duration time.Duration) error {
	ctx, cancel := context.WithTimeout(context.Background(), redisTimeout)
	defer cancel()

	return database.RDB.Set(ctx, sessionPrefix+token, userID, duration).Err()
}

func GetUserIDBySession(token string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), redisTimeout)
	defer cancel()

	val, err := database.RDB.Get(ctx, sessionPrefix+token).Result()
	if err != nil {
		return 0, err
	}

	userID, err := strconv.Atoi(val)
	if err != nil {
		return 0, fmt.Errorf("invalid userID in session: %v", err)
	}

	return userID, nil
}

func DeleteSession(token string) error {
	ctx, cancel := context.WithTimeout(context.Background(), redisTimeout)
	defer cancel()

	return database.RDB.Del(ctx, sessionPrefix+token).Err()
}

package database

import (
	"context"
	"os"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client

func InitRedis() error {
	addr := os.Getenv("REDIS_URL")
	pass := os.Getenv("REDIS_PASSWORD")

	if addr == "" {
		addr = "localhost:6379"
	}

	RDB = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pass,
		DB:       0,
	})

	ctx := context.Background()

	_, err := RDB.Ping(ctx).Result()
	return err
}

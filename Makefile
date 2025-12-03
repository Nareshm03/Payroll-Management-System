# Makefile for PayrollPulse Docker Operations

.PHONY: help build up down restart logs clean dev prod test

# Default target
help:
	@echo "PayrollPulse Docker Commands:"
	@echo "  make build     - Build Docker images"
	@echo "  make up        - Start services (production)"
	@echo "  make down      - Stop services"
	@echo "  make restart   - Restart services"
	@echo "  make logs      - View logs"
	@echo "  make dev       - Start development environment"
	@echo "  make prod      - Start production environment"
	@echo "  make clean     - Remove containers and volumes"
	@echo "  make test      - Run tests"
	@echo "  make ps        - Show running containers"
	@echo "  make stats     - Show resource usage"

# Build images
build:
	docker-compose build

# Start production
up:
	docker-compose up -d

prod: up

# Start development
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop services
down:
	docker-compose down

# Restart services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

# Show status
ps:
	docker-compose ps

# Show stats
stats:
	docker stats

# Clean up
clean:
	docker-compose down -v
	docker system prune -f

# Run tests
test:
	docker-compose exec backend pytest

# Backup database
backup:
	docker-compose exec backend cp /app/payroll.db /app/data/payroll_backup_$(shell date +%Y%m%d_%H%M%S).db

# Update and restart
update:
	git pull
	docker-compose build
	docker-compose up -d

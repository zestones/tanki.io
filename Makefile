# Makefile for Tanki Project

# Variables
CLIENT_DIR := client
SERVER_DIR := server
NODE := node
NPM := npm

# Default target
.PHONY: all
all: help

# Help command to show available targets
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies for both client and server"
	@echo "  make dev           - Run both client and server in development mode"
	@echo "  make start         - Start the production build of client and server"
	@echo "  make clean         - Remove node_modules and build artifacts"
	@echo "  make update        - Update npm packages for both client and server"
	@echo "  make lint          - Run ESLint on both client and server"
	@echo "  make build         - Build production versions of client and server"

# Install dependencies
.PHONY: install
install:
	@echo "Installing client dependencies..."
	cd $(CLIENT_DIR) && $(NPM) install
	@echo "Installing server dependencies..."
	cd $(SERVER_DIR) && $(NPM) install

# Development mode
.PHONY: dev
dev:
	@echo "Starting development servers..."
	@tmux new-session -d -s tanki-dev \
		'cd $(CLIENT_DIR) && $(NPM) run dev' \; \
		split-window -h \
		'cd $(SERVER_DIR) && $(NPM) run dev' \; \
		attach

# Stop Session
stop:
	@echo "Stopping development session..."
	@tmux kill-session -t tanki-dev

# Production start
.PHONY: start
start:
	@echo "Starting production servers..."
	@tmux new-session -d -s tanki-prod \
		'cd $(CLIENT_DIR) && $(NPM) run build && $(NPM) run preview' \; \
		split-window -h \
		'cd $(SERVER_DIR) && $(NPM) start' \; \
		attach

# Clean up
.PHONY: clean
clean:
	@echo "Removing client node_modules..."
	cd $(CLIENT_DIR) && rm -rf node_modules
	@echo "Removing server node_modules..."
	cd $(SERVER_DIR) && rm -rf node_modules
	@echo "Removing client build artifacts..."
	cd $(CLIENT_DIR) && rm -rf dist
	@echo "Removing server build artifacts..."
	cd $(SERVER_DIR) && rm -rf build

# Update packages
.PHONY: update
update:
	@echo "Updating client packages..."
	cd $(CLIENT_DIR) && $(NPM) update
	@echo "Updating server packages..."
	cd $(SERVER_DIR) && $(NPM) update

# Lint code
.PHONY: lint
lint:
	@echo "Linting client code..."
	cd $(CLIENT_DIR) && $(NPM) run lint
	@echo "Linting server code..."
	cd $(SERVER_DIR) && $(NPM) run lint

# Build for production
.PHONY: build
build:
	@echo "Building client..."
	cd $(CLIENT_DIR) && $(NPM) run build
	@echo "Building server..."
	cd $(SERVER_DIR) && $(NPM) run build
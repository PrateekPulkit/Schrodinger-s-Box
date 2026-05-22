.PHONY: dev build train benchmark clean

dev:
	@echo "Starting Schrödinger's Box in development mode..."
	docker-compose up -d redis
	@echo "Starting backend..."
	cd backend && uvicorn main:app --reload --port 8000 &
	@echo "Starting frontend..."
	cd frontend && npm run dev &
	wait

build:
	@echo "Building Docker images..."
	docker-compose build

train:
	@echo "Training ML Models..."
	cd backend && python -m ml.train

benchmark:
	@echo "Running PQC Benchmarks..."
	# Normally triggered via API, but can be simulated or called via curl here
	curl -X POST http://localhost:8000/api/benchmark/run

clean:
	@echo "Cleaning up..."
	docker-compose down
	killall uvicorn node || true
	rm -rf backend/venv
	rm -rf backend/__pycache__
	rm -rf frontend/node_modules
	rm -f backend/db/schrodinger.db

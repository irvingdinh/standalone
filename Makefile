.PHONY: dev kill check

check:
	cd api && npm run format && npm run lint && npm run build

kill:
	@lsof -ti :25710 | xargs kill -9 2>/dev/null || true

dev: kill
	cd api && npm run start:dev

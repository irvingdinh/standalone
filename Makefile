.PHONY: install dev kill check api.seed

install:
	cd api && npm install
	cd admin && bun install

check:
	cd api && npm run format && npm run lint && npm run build
	cd admin && bun run check

kill:
	@lsof -ti :25710 | xargs kill -9 2>/dev/null || true
	@lsof -ti :25702 | xargs kill -9 2>/dev/null || true

dev: kill
	trap '(lsof -ti :25710; lsof -ti :25702) | xargs kill 2>/dev/null; wait' INT TERM EXIT; \
	(cd api && npm run start:dev) & \
	(cd admin && bun run dev) & \
	wait

api.seed:
	cd api && npx nest start --entryFile scripts/seed.script

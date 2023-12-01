install:
	npm i
	cd web && npm i
	cd web/frontend && npm i
clean-install:
	npm ci
	cd web && npm ci
	cd web/frontend && npm ci

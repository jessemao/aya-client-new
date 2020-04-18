.PHONY: build

install:
	cnpm install

build: install
	npm run build

build-image:
	docker build -f Dockerfile.dev -t ncp/admin-client:dev .
.PHONY: build

install:
	yarn install

build: install
	npm run build

build-image: build
	docker build -f Dockerfile -t aya/aya-client:latest .
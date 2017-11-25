SHELL := /bin/bash

.PHONY: pre-program server


install:|pre-program

define require_install
	if test "$(shell which $(1))" = ""; \
	then \
		brew install $(2); \
	else \
		echo $(1) is exists. skip install; \
	fi
endef

pre-program:
	@$(call require_install,mongod,mongo)
	mkdir -p ./db/
	if [ "${shell pgrep mongod}" = "" ]; then mongod --bind_ip 127.0.0.1 --fork --dbpath ./db/ --logpath ./db/mongod.log; fi
	@echo "start mongod success!"

# 开发模式
server:
	npm install && npm run dev
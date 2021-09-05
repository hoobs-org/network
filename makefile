network: $(eval VERSION := $(shell project version))
network: lint paths
	npm pack
	mv hoobs-network-$(VERSION).tgz builds/

lint:
	@echo $(VERSION)
	node_modules/.bin/eslint '*.js'

paths:
	mkdir -p builds

publish:
	npm adduser
	npm publish --access public

clean:
	rm -f *.tgz

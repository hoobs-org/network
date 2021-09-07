network: lint paths
	npm pack
	mv hoobs-network-$(shell project version).tgz builds/
	rm -f *.tgz

lint:
	node_modules/.bin/eslint '*.js'

paths:
	mkdir -p builds

publish:
	../node_modules/.bin/yarn publish --access public --new-version $(shell project version)

clean:
	rm -f *.tgz

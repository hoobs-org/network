network: lint paths
	npm pack
	mv hoobs-network-$(shell project version).tgz builds/

lint:
	node_modules/.bin/eslint '*.js'

paths:
	mkdir -p builds

publish:
	npm adduser
	npm publish --access public

clean:
	rm -f *.tgz

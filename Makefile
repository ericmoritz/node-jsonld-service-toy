all:
	mkdir -p dist
	./node_modules/.bin/babel-node ./bin/mock.js dist/
	@make dist/graph.svg

dist/graph.svg:
	@node_modules/.bin/jsonld format -q dist/vocab.json | node_modules/.bin/babel-node bin/graphHATEOAS.js | dot -Tsvg > dist/graph.svg

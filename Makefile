dev:
	./node_modules/.bin/coffee -w -o lib/ -c src/

docs:
	./node_modules/.bin/docco src/*.coffee

example:
	./node_modules/.bin/coffee ./example/console.coffee

example-debug:
	./node_modules/.bin/coffee ./example/console.coffee -d

clean:
	rm -Rf node_modules/ npm-debug.log
	npm install

test:
	make clean
	make example
	make example-debug

.PHONY: dev docs example example-debug clean test
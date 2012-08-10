# If you change something here, be sure to change it in package.json's scripts as well

dev:
	./node_modules/.bin/coffee -w -o out/ -c src/

compile:
	./node_modules/.bin/coffee -o out/ -c src/

clean:
	rm -Rf lib node_modules/ npm-debug.log
	npm install

example:
	./node_modules/.bin/coffee ./example/console.coffee

example-debug:
	./node_modules/.bin/coffee ./example/console.coffee -d

.PHONY: dev compile clean example example-debug
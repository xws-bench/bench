../js/bench.min.js: obstacles.js critical.js units.js iaunits.js pilots.js upgrades.js upgcards.js team.js resample.js avatar.js proba.js replay.js xwings.js
	cat $^ > ../js/bench.js
	java -jar compiler.jar --js ../js/bench.js --js_output_file $@ --language_in ECMASCRIPT5 -O SIMPLE
	git add ../js/bench.min.js

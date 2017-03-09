../js/bench.min.js: ../src/obstacles.js ../src/critical.js ../src/units.js ../src/iaunits.js ../src/pilots.js ../src/upgrades.js ../src/upgcards.js ../src/team.js ../src/resample.js ../src/avatar.js ../src/proba.js ../src/replay.js ../src/xwings.js ../src/util.js
#   updated to pull the source .js files in directly (rather than cat'ing into bench.js
#   also include the creation of a source map
	java -jar compiler.jar --js $^ --js_output_file $@ --create_source_map ../js/bench.js.map --output_wrapper "%output%//@ sourceMappingURL=bench.js.map" --language_in ECMASCRIPT5 -O SIMPLE
	git add ../js/bench.min.js
	git add ../js/bench.js.map

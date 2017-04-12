../js/bench.min.js: obstacles.js critical.js condition.js units.js metaunits.js iaunits.js pilots.js upgrades.js upgcards.js team.js proba.js replay.js xwings.js page_manage.js page_create.js page_combat.js
	java -jar closure-compiler-v20170218.jar -W QUIET --create_source_map ../js/bench.js.map --js $^ --js_output_file $@ --output_wrapper "%output%//@ sourceMappingURL=bench.js.map"  -O SIMPLE
#	git add ../js/bench.min.js

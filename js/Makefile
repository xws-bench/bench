all: all.min.js bench.min.js
SRCS=obstacles.js critical.js condition.js units.js iaunits.js metaunits.js pilots.js upgrades.js upgcards.js team.js proba.js replay.js xwings.js page_manage.js page_create.js page_combat.js
JSSRCS=api.js snap.svg-min-0.4.1.js jwerty.min.js mustache.min.js jquery-3.1.1.min.js jquery.a-tools-1.4.1.js jquery.asuggest.js lz-string.min.js howler2.0.2.min.js hammer2.0.8.min.js sheetrock.min.js

all.min.js: ${JSSRCS} ${SRCS:%=../src/%} 
	java -jar compiler.jar  -W QUIET --js $^ --js_output_file $@ -O SIMPLE

bench.min.js: ${SRCS:%=../src/%}
	java -jar compiler.jar  -W QUIET --js $^ --js_output_file $@ -O SIMPLE

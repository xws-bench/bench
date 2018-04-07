all: js/all.min.js css/xwing.css
COMPILER=src/compiler.jar
SRCS=obstacles.js critical.js condition.js  units.js  upgrades.js iaunits.js metaunits.js pilots.js upgcards.js team.js proba.js replay.js xwings.js page_manage.js page_create.js page_combat.js
JSSRCS=api.js snap.svg-min-0.4.1.js jwerty.min.js mustache.min.js jquery-3.1.1.min.js jquery.a-tools-1.4.1.js jquery.asuggest.js lz-string.min.js howler2.0.2.min.js hammer2.0.8.min.js sheetrock.min.js

js/all.min.js: ${JSSRCS:%=js/%} ${SRCS:%=src/%}
	java -jar ${COMPILER}  -W QUIET --js $^ --js_output_file $@ -O SIMPLE
	git add $@

css/xwing.css: css/xwings.scss
	sass -E utf-8 --style compressed $^ > $@

SHIPS=ARC-170 exhaust tie-advanced tie-bomber tie-defender-red tie-defender a-wing-1 ghost tie-fo a-wing-2 hwk290 tie-interceptor-1 tie-interceptor-2 jumpmaster5000 tie-phantom tie-punisher kihraxz tie-sabine b-wing-1 tie-sf b-wing-2 m3a tie-striker protectorate	tie turbolaser quadjumper x-wing-2 x-wing starviper y-wing-1 e-wing t70 z95hunter-1 tie-advanced-prototype z95hunter-2
LARGESHIPS=YT1300 YT2400 YV666 decimator g1a k-wing lancer shuttle slave u-wing upsilon vcx100 
png/shipsheet.png: ${SHIPS:%=png/%.png}
	convert $^ -append $@
png/largeshipsheet.png: ${LARGESHIPS:%=png/%.png}
	convert $^ -append $@

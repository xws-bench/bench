all.min.js: snap.svg-min-0.4.1.js jwerty.min.js jquery-1.11.3.min.js jquery.dataTables.min.js jquery.a-tools-1.4.1.js jquery.asuggest.js lz-string.min.js howler.min.js hammer.min.js sheetrock.min.js mustache.min.js
	cat $^ > all.js
	java -jar compiler.jar --js all.js --js_output_file $@ --language_in ECMASCRIPT5 -O SIMPLE
b.min.js: jquery-1.11.3.min.js jquery.dataTables.min.js mustache.min.js
	cat $^ > b.js
	java -jar compiler.jar --js b.js --js_output_file $@ --language_in ECMASCRIPT5 -O SIMPLE

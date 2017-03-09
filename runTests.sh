#!/bin/bash

#change the browser parameter to the location of your browser executable

java -jar test/helpers/JsTestDriver-1.3.5.jar --port 9898 --browser /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --config bench.jstd --tests all --testOutput test/results/

importScripts("obstacles.js","critical.js","units.js","iaunits.js","pilots.js","upgrades.js","team.js");
onmessage = function(e) {
    if (e.data[0]=="SQUADRON") {
	console.log('Posting message back to main script');
	postMessage(e.data[1]);
    }
}
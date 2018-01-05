var phase=1;
var subphase=0;
var round=1;
var skillturn=0;
var tabskill;
const VERSION="v0.99.2";
var LANG="en";
var FILTER="none";
var DECLOAK_PHASE=1;
const WEBSITE="http://baranidlo.github.io/bench/index.html";
const DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];
const SETUP_PHASE=2,PLANNING_PHASE=3,ACTIVATION_PHASE=4,COMBAT_PHASE=5,SELECT_PHASE=1,CREATION_PHASE=6,XP_PHASE=7,MAIN_PHASE=0;
var BOMBS=[];
var ROCKDATA="";
var WINCOND=0;
var INREPLAY=false;
var allunits=[];
var PILOT_translation,SHIP_translation,CRIT_translation,UI_translation,UPGRADE_translation,PILOT_dict,UPGRADE_dict,RATINGS_upgrades,RATINGS_ships,RATING_pilots,TOP_squads,CC;
var actionr=[];
var actionrlock;
var HISTORY=[];
var replayid=0;
var dice=1;
var ATTACK=[];
var DEFENSE=[];
var SEARCHINGSQUAD;
const FACTIONS={"rebel":"REBEL","empire":"EMPIRE","scum":"SCUM"};
var SQUADLIST,SCENARIOLIST;
const TEAMS=[new Team(0),new Team(1),new Team(2),new Team(3)];
var currentteam=TEAMS[0];
var teamtarget=0;
var VIEWPORT;
var ANIM="";
var SETUP;
var SHOWDIAL=[];
var TRACE=false;
var TEMPLATES={};

var HEADER="";
var SCENARIOTITLE="";
var WAVEFILTER="0";
var UNITFILTER={};
var ACTIONFILTER={};
var MOVEFILTER={};
var TEXTFILTER="";
var COSTFILTER=50;

var UNIQUE=[];
var stype="";
var REPLAY="";
var PERMALINK="";

var Unit=window.Unit || {};
var metaUnit=window.metaUnit || {};
var PILOTS = window.PILOTS || {};
var UPGRADES = window.UPGRADES || {};
var Mustache = window.Mustache || {};
/*

<script src="src/condition.js"></script>
<script src="src/critical.js"></script>
<script src="src/obstacles.js"></script>
<script src="src/units.js"></script>
<script src="src/iaunits.js"></script>
<script src="src/metaunits.js"></script>
<script src="src/pilots.js"></script>
<script src="src/proba.js"></script>
<script src="src/replay.js"></script>
<script src="src/team.js"></script>
<script src="src/upgrades.js"></script>
<script src="src/upgcards.js"></script>
<script src="src/xwings.js"></script>
<script src="src/page_combat.js"></script>
<script src="src/page_create.js"></script>
<script src="src/page_manage.js"></script>

	<span style="float:left;width:30%;padding-right:1em;">
	<h2 class="squadbg"><span>!</span> Squad Building</h2>
	<div>Build your squad in a few clicks:
	<ul>
	  <li>All units to Wave 10</li>
	  <li>Integrated <a href="https://community.fantasyflightgames.com/topic/196321-x-wing-beginners-guide/">Beginner Strategy Guide v4.5</a> from Flipperoverlord with advices on upgrades and units.</li>
	  <li>Pilot filter by upgrade type, wave, action type, cost or search for keywords in the pilot text.</li>
	  <li>Pilot Hitmap:  Displays the % to hit for your best weapon, first shoot to an Academy Pilot after one maneuver and one action.</li>
	  <li>Move map: Shows where the pilot can go with one maneuver and one action from action bar.</li>
	  <li>Save your list as a weblink, print them.</li>
	  <li>All your squads are saved in your browser. Edit, re-edit your lists and test them in the simulator.</li>
	</ul></div></span><span style="float:left;width:30%;padding-right:1em">
	<h2 class="squadbg"><span>$</span> Combat Simulation</h2>
	Play in 15 min a combat between chosen squads:
	<ul>
	  <li>The simulator handles collisions, triggered actions and effects, and most of the rules. </li>
	  <li>Take takes both sides or against an AI.</li>
	  <li>Play scenarios or make a free combat. Play the Battle of Yavin, test your maneuverability, play with moving obstacles !</li>
	  <li>Save your combat at any turn, export it as an URL.</li> 
	  <li>Share the combats you have played on Facebook, Tweeter, email to your friends and to forums.</li> 
	</ul>
</span><span style="float:left; width:30%;">
	<h2 class="squadbg"><span>W</span> Hangar</h2>
	Direct access to squad lists, ready to be played:
	<ul>
	  <li>All your builds,</li>
	  <li>The <a href="http://miniranker.xwingjunkies.com/">Top 10 lists</a> in used in recent competitions.</li>
	  <li>The 20 most recently played lists by players in Squadron Benchmark.</li>
	</ul>
	All lists can be reedited, printed and played. 
      </div></span>






*/
const SCENARIOS= {
    "Battle of Yavin, the final":{
	text:"Here you are, Red 5, in the trench leading to the exhaust port. Destroy it ! Beware of the Imperial squad on your tail and of the ionization turrets. You have less than 12 turns.",
	link:"GQVgNAjA7AbAXBATFCZEA4AsYC0BOABgG5wDJYF0U1lcJ1jTz4II9EwQBmbYxcCCCiQuwvBDi1EXGGEJF+kISLETFXLmXm0Q6JcIii5EqOAzh58ZDGzI9+YsGAAzAIYAbAM4BTYABcAJwBXXwARb1c-AAtPP1cApwAhSL93bwACAHtndIBNVwA3AEsAOzB06IznUo9gAAlvAIyAT0yg9PjvcoAlbwATdPB00oqojMDvEoBjKPS01z7SgHMKzNGM7wAPKNcg2PSAB0yAvwA6dPDYgMzm4b90gEJ0xO8Ad06snMr0gEkAWwOjSKHnSngAjkEFlkSulWkEAhVXEV3B0SgNsuthpkSkUAF6RIrYirwpp+TznXJtdI7AoZNKeTyjVwwpDEgIlcnpACyrlu32cxymGQARhlXkVorCqQ9gEggA",
	wincond:12
    },
    "A secret trench":{
	text:"A new death star has been built! There's a secret trench that leads to an exhaust port. You must destroy it before turn 10, take your best pilot with an agile ship.",
	link:"GQVgNAjALAHAXAZgAwCYwJWgnEg3OaeEKANjBCTAFod9JY4B2GRsKLa2ghhV2GMF3rwIJNIyisqUELhJwYINIrQ08wYADMAhgBsAzgFNgAFwBOAV2MARQ9pMALfSe1mUGgIIACIwGMzhiZe5oYAdr4OwN6hhgDuXgAmdo4+LmZeDtr6XgBGhmG5FgCWuiYAhF4AKg6GAQDk2do+hv6BwQHhDsGZQbp2CdkmAPZe2qFehgAemRbOXgAOQ2YmAHReAJpDFl4AtrNBSc5mQwCeXkVBeZpLhsEWZuMcwdoA1rcnW+l5c-MlQ0GxC5dMajADmJVu+gcRXmawAstozo5btczL5bnkvICUh9tmVgBAkEA",
	wincond:10
    },
    "The Pirate Magic Roundabout":{
	link:"GQRgTAzANCAsAcMAMEBcBWJBOKmDsUAtCBOgNzjRyIgqoRYhQNhSzmUwLJrvQR4kULEgqQuNOuybowOQiLLAIYWMxVtWo2INy6sOeGVkF0cGDjDGAbAVhJryKNbIQSbLFUewysLIjlDHHRgADMAQwAbAGcAU2AAFwAnAFd4gBFY0NiAOwATWKTgYAAVAAtYgAIABQBLJPCEqoBZcIBzWoBjSoAlAHsU-PCAIwGE4ABBUKakyvDKyL6ctsqywYSoSoBPAcrQ2pyoyK29gfzKhIrKgAd6xqqc2OiEgDpKzOekvpPL2IBbOaRSIAQkqACFYgB3cJJKp9UIXK7hZ6FPq1PLRF7AJBAA",
	text:"After a long hunt, you finally find the pirate nest. Destroy all of them!",
	wincond:0
    },
    "Asteroid Field":{
	link:"GQFgHANCAMEEwHYBcYFwgZgKwEYIFoBOaAbnClkRThHkMIOLMhnmTBqh3SNODlR1a+AGy1SGaJA4iCI9CJJYQ6BGFn4wtOEpwIo9AoLAkBsEdB4h9cHErhYIOMBgJYb0YADMAhgBsAZwBTYAAXACcAVxCAYT8fAICASwBjAEJgYABBANCg8IB7JIATAAIvJKC-YuAYqICAC1LQhqSA0oAHSIA7AE9S8KCAIyrygvCUoIA6UoAVBqD+1uKg0qTu5oXShLzCktKhyNDSgBlxsoA1HxXw0oB3H27Q9u6C0qCADxTI4IzoIA",
	text:"Crush this puny rebel force. They hide in the asteroid but Lord Vader wants no excuse!",
	wincond:0
    }
};
const SETUPS={
     "Classic": {
	"background":"css/playmat10.jpg",
	 "zone1":"M 0 0 L 100 0 100 914.4 0 914.4 Z",
	 "zone2":"M 814.4 0 L 914.4 0 914.4 914.4 814.4 914.4 Z",
	 "playzone1":"M 0 0 L 914.4 0 914.4 914.4 0 914.4 Z",
         "asteroids":6
    },
    "Cloud City": {
	"background":"css/playmat6.jpg",
	"zone1":"M 0 0 L 100 0 100 914.4 0 914.4 Z",
	"zone2":"M 814.4 0 L 914.4 0 914.4 914.4 814.4 914.4 Z",
	"playzone1":"M 0 0 L 914.4 0 914.4 914.4 0 914.4 Z",
        "asteroids":6
    },
    "Blue Sky": {
	"background":"css/playmat13.jpg",
	"zone1":"M 0 0 L 100 0 100 914.4 0 914.4 Z",
	"zone2":"M 814.4 0 L 914.4 0 914.4 914.4 814.4 914.4 Z",
	"playzone1":"M 0 0 L 914.4 0 914.4 914.4 0 914.4 Z",
        "asteroids":0
    },
    "Blue Planet": {
	"background":"css/playmat11.jpg",
	"zone1":"M 0 0 L 100 0 100 914.4 0 914.4 Z",
	"zone2":"M 814.4 0 L 914.4 0 914.4 914.4 814.4 914.4 Z",
	"playzone1":"M 0 0 L 914.4 0 914.4 914.4 0 914.4 Z",
        "asteroids":6
    },
    "Mars": {
	"background":"css/playmat14.jpg",
	"zone1":"M 0 0 L 100 0 100 914.4 0 914.4 Z",
	"zone2":"M 814.4 0 L 914.4 0 914.4 914.4 814.4 914.4 Z",
	"playzone1":"M 0 0 L 914.4 0 914.4 914.4 0 914.4 Z",
        "asteroids":6
    },
    "Defender":{
        "playzone1":"M 0 0 L 914.4 0 914.4 914.4 0 914.4 Z",
        "playzone2":"M340,450a110,110 0 1,0 220,0a110,110 0 1,0 -220,0",//"M280,450a170,170 0 1,0 340,0a170,170 0 1,0 -340,0",
        "background":"css/playmat10.jpg",
        "zone2":"M340,450a110,110 0 1,0 220,0a110,110 0 1,0 -220,0",//"M280,450a170,170 0 1,0 340,0a170,170 0 1,0 -340,0",
        "zone1":"M 0 0 L 100 0 100 914.4 0 914.4 Z",
        "asteroids":12
    },
    "Deathstar":{
        "playzone1":"M 0 200 L 1300 200 1300 400 1800 400 1800 200 2800 200 2800 360 1960 360 1960 560 1100 560 1100 360 0 360 Z",
        "background":"css/deathstar.png",
        "pattern":"css/deathstar2.png",
        "zone2":"M 0 200 L 100 200 100 360 0 360 Z",
        "zone1":"M 500 200 L 600  200 600 360 500 360 Z",
        "asteroids":0
    },
    "Deathstar2":{
	"playzone1":"M 12.241 24.907 L 803.813 24.907 C 861.372 36.696 884.737 73.238 873.908 134.534 C 867.964 168.18 604.249 421.618 188.337 459.88 C 57.346 471.931 307.368 724.082 701.233 804.672 C 746.071 813.845 823.307 826.148 873.908 822.354 C 883.509 821.635 888.068 844.03 887.586 889.544 C 887.569 891.228 727.43 885.923 407.173 873.629 C 243.345 867.341 68.391 771.86 15.662 523.532 C -7.502 414.436 60.669 277.644 241.335 293.67 C 518.775 318.28 758.698 119.655 747.395 113.317 C 747.395 113.317 509.751 112.728 34.467 111.549 C 6.27 111.48 -1.138 82.599 12.241 24.907 Z",
        "background":"css/deathstar.png",
        "pattern":"css/deathstar2.png",
        "zone1":"M 12 24 L 140 24 140 110 12 110 Z",
        "zone2":"M 0 0",
        "asteroids":0
    },

}

function setSetup(n) {
    if (typeof SETUPS[n]!="undefined") {
	SETUP=SETUPS[n];
	SETUP.name=n;
    } else {
	SETUP=SETUPS["Classic"];
	SETUP.name="Classic";
    }
    if (typeof SETUP.playzone2=="undefined") SETUP.playzone2=SETUP.playzone1;
}


function changeimage(input) {
    if (input.files && input.files[0]) {
	var reader=new FileReader();
	reader.onload=function(e) {
	    var bb=ZONE[0].getBBox();
	    var BACKGROUND = s.image(e.target.result,0,0,bb.w,bb.h).pattern(0,0,bb.w,bb.h);
	    ZONE[0].attr({fill:BACKGROUND,fillOpacity:1});

	};
	reader.readAsDataURL(input.files[0]);
    }
}
function center() {
    var bbox=activeunit.g.getBBox();
    var xx=(bbox.x+bbox.width/2);
    var yy=(bbox.y+bbox.height/2)
    var w=$("#svgout").width();
    var h=$("#svgout").height();
    var startX=0;
    var startY=0;
    if (h>w) startY=(h-w)/2;
    else startX=(w-h)/2;
    var min=Math.min(w/GW,h/GH);
    var x=startX+VIEWPORT.m.x(xx,yy)*min;
    var y=startY+VIEWPORT.m.y(xx,yy)*min
    if (x<0||x>w) VIEWPORT.m=MT((-x+w/2-startX)/min,0).add(VIEWPORT.m);
    if (y<0||y>h) VIEWPORT.m=MT(0,(-y+h/2-startY)/min).add(VIEWPORT.m);

    VIEWPORT.transform(VIEWPORT.m);
    activeunit.show();
}


var save=function() {
    movelog("W");
    var url=WEBSITE+"?"+permalink(false);
    $(".social").html(Mustache.render(TEMPLATES["social"],{ 
	url:url,
	name:"save this link",
	encodedurl:encodeURI(url)}));
    if (typeof gapi!="undefined"
	&&typeof gapi.client!="undefined"
	&&typeof gapi.client.urlshortener!="undefined") {
	var request = gapi.client.urlshortener.url.insert({
            'longUrl': url
	});    
	request.then(function(response) {
	    var url=response.result.id;
	    $(".tweet").show();
	    $('#submission').contents().find('#entry_245821581').val(url);
	    $('#submission').contents().find("#ss-form").submit();  
	    $(".social").html(Mustache.render(TEMPLATES["social"],{ 
		url:url,
		name:url,
		encodedurl:encodeURI(url) }));
	}, function(reason) {
	    $('#submission').contents().find("#ss-form").submit();
            console.log('Error: ' + reason.result.error.message);
	});
    } else {
	$('#submission').contents().find("#ss-form").submit();
    }
}


function translate(a) {
    if (typeof PILOT_translation[a]!="undefined"
	&&typeof PILOT_translation[a].name!="undefined") 
	return PILOT_translation[a].name;
    if (typeof PILOT_translation[a+" (Scum)"]!="undefined"
	&&typeof PILOT_translation[a+" (Scum)"].name!="undefined") 
	return PILOT_translation[a+" (Scum)"].name;
    if (typeof UPGRADE_translation[a]!="undefined"
	&&typeof UPGRADE_translation[a].name!="undefined") 
	return UPGRADE_translation[a].name;
    if (typeof UPGRADE_translation[a+"(Crew)"]!="undefined"
	&&typeof UPGRADE_translation[a+"(Crew)"].name!="undefined") 
	return UPGRADE_translation[a+"(Crew)"].name;
    if (typeof CRIT_translation[a]!="undefined"
	&&typeof CRIT_translation[a].name!="undefined")
	return CRIT_translation[a].name;
    return a;
}
function formatstring(s) {
    return s.replace(/%HIT%/g,"<code class='hit'></code>")
	.replace(/%ACTION%/g,"<b>Action:</b>")
	.replace(/%STRESS%/g,"<code class='xstresstoken'></code>")
	.replace(/%CRIT%/g,"<code class='critical'></code>")
	.replace(/%EVADE%/g,"<code class='symbols'>e</code>")
	.replace(/%FOCUS%/g,"<code class='symbols'>f</code>")
	.replace(/%SHIELD%/g,"<code class='cshield'></code>")
	.replace(/%HULL%/g,"<code class='chull'></code>")
	.replace(/%ROLL%/g,"<code class='symbols'>r</code>")
	.replace(/%TURNLEFT%/g,"<code class='symbols'>4</code>")
	.replace(/%TURNRIGHT%/g,"<code class='symbols'>6</code>")
	.replace(/%BOOST%/g,"<code class='symbols'>b</code>")
        .replace(/%ELITE%/g,"<code class='symbols'>E</code>")
	.replace(/%ION%/g,"<code class='xionizedtoken'></code>")
 	.replace(/%BOMB%/g,"<code class='symbols'>B</code>")
	.replace(/%STRAIGHT%/g,"<code class='symbols'>8</code>")
        .replace(/%STOP%/g,"<code class='symbols'>5</code>")
        .replace(/%TARGET%/g,"<code class='symbols'>l</code>")
        .replace(/%TORPEDO%/g,"<code class='symbols'>P</code>")
 	.replace(/%CANNON%/g,"<code class='symbols'>C</code>")
	.replace(/%SYSTEM%/g,"<code class='symbols'>S</code>")
	.replace(/%ILLICIT%/g,"<code class='symbols'>I</code>")
        .replace(/%MISSILE%/g,"<code class='symbols'>M</code>")
        .replace(/%TURRET%/g,"<code class='symbols'>U</code>")
        .replace(/%BANKLEFT%/g,"<code class='symbols'>7</code>")
        .replace(/%BANKRIGHT%/g,"<code class='symbols'>9</code>")
        .replace(/%UTURN%/g,"<code class='symbols'>2</code>")
        .replace(/%SLOOPLEFT%/g,"<code class='symbols'>1</code>")
        .replace(/%SLOOPRIGHT%/g,"<code class='symbols'>3</code>")
        .replace(/%TALONLEFT%/g,"<code class='symbols'>;</code>")
        .replace(/%TALONRIGHT%/g,"<code class='symbols'>:</code>")
        .replace(/%ASTROMECH%/g,"<code class='symbols'>A</code>")
	.replace(/%CREW%/g,"<code class='symbols'>W</code>")
	.replace(/%MOD%/g,"<code class='symbols'>m</code>")
	.replace(/%SLAM%/g,"<code class='symbols'>s</code>")
    ;
}
function displayplayertype(team,img) {
    var hname=localStorage["name"];
    //var name=localStorage["playername"];
    //if (typeof name!="undefined") hname=name;
    var t={"REBEL":"x","EMPIRE":"y","SCUM":"z"};
    if (!TEAMS[team].isia) {
	$("#player"+team+" option[value='human']").prop("selected",true); 
	$("#player"+team+" option[value='human']").text(UI_translation["human"]);
    } else {
	$("#player"+team+" option[value='computer']").prop("selected",true);	
	$("#player"+team+" option[value='computer']").text(UI_translation["computer"]);
 
    } 
    $("#playerteam"+team).text(t[TEAMS[team].faction]);
}
function nextunit(cando, changeturn,changephase,activenext) {
    var i,sk=false,last=0;
    if (skillturn<0||skillturn>12) return changephase();
    for (i=0; i<tabskill[skillturn].length; i++) {
	var u=tabskill[skillturn][i];
	if (cando(u)&&u.isdocked!=true) { sk=true; last=i; break;} 
    };
    if (!sk) {
	do {
	    changeturn(tabskill);
	    last=0;
	    if (skillturn>=0 && skillturn<=12) {
		while (last<tabskill[skillturn].length&&(tabskill[skillturn][last].isdocked==true||!cando(tabskill[skillturn][last]))) last++;
		if (last==tabskill[skillturn].length) last=-1;
	    }
	} while (skillturn>=0 && skillturn<=12 && last==-1);
    } 
    if (skillturn<0||skillturn>12||last==-1) return changephase();
    barrier(function() {
	//active=last; 
	tabskill[skillturn][last].select();
	activenext();
    });
}
function endphase() {
    var i;
    for (i in squadron) squadron[i].endphase();
    for (i in OBSTACLES) if (typeof OBSTACLES[i].endphase!="undefined") OBSTACLES[i].endphase();
}
function nextcombat() {
    nextunit(function(t) { return t.canfire(); },
	     function(list) { 
		 var dead=false;
		 if (skillturn>=0) skillturn--;
		 for (var i=0; i<list[skillturn+1].length; i++) {
		     var u=list[skillturn+1][i];
		     if (u.canbedestroyed(skillturn))
			 if (u.checkdead()) dead=true;
		 }
		 if (dead) {
		     var t1=TEAMS[1].checkdead();
		     var t2=TEAMS[2].checkdead();
		     if (t1&&t2) win(0);
		     else if (t1) win(1);
		     else if (t2) win(2);
		 }
	     },
	     function() {
		 return enablenextphase();
	     },
	     function() {
		 activeunit.beginattack();
		 activeunit.doattack();
	     });
}
function nextactivation() {
    nextunit(function(t) { return t.candomaneuver(); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { 
		 //barrier(endphase); 
		 return enablenextphase(); },
	     function() {    
		 activeunit.beginactivation();
		 activeunit.doactivation();
	     });
}
function nextdecloak() {
    nextunit(function(t) { return t.candecloak(); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { return enablenextphase(); },
	     function() { activeunit.dodecloak(); });
}
function nextplanning() {
    nextunit(function(t) { return (t.maneuver==-1); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { return enablenextphase(); },
	     function() {
		 activeunit.select();
		 activeunit.doplan();
	     });
}
function getattackresult() {
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    return Unit.FCH_CRIT*c+Unit.FCH_HIT*h;
}
function getdefenseresult() {
    return $(".evadegreendice").length+$(".evadegreen").length;
}
function addattackdie(type,n) {
    for (var i=0; i<n; i++) 
	$("#attack").append("<td class="+type+"reddice'></td>");
}
function adddefensedie(type,n) {
    for (var i=0; i<n; i++) 
	$("#defense").append("<td class="+type+"greendice'></td>");
}
function getattackdice() {
    return $(".focusreddice").length+$(".criticalreddice").length+$(".hitreddice").length+$(".blankreddice").length;
}
function getattackvalue() {
    return $(".focusreddice").length*Unit.FCH_FOCUS+$(".criticalreddice").length*Unit.FCH_CRIT+$(".hitreddice").length*Unit.FCH_HIT;
}
function getdefensedice() {
    return $(".focusgreendice").length+$(".blankgreendice").length+$(".evadegreendice").length; 
}
function displaycombatdial() {
    $("#attackdial").empty();
    $("#dtokens").empty();
    $("#defense").empty();
    $("#combatdial").show();
}
function addredclickchange() {
    var change=function() { 
	if ($(this).hasClass("focusreddice")) {
	    $(this).removeClass("focusreddice"); $(this).addClass("hitreddice");
	}  else if ($(this).hasClass("blankreddice")) {
	    $(this).removeClass("blankreddice"); $(this).addClass("focusreddice");
	} else if ($(this).hasClass("hitreddice")) {
	    $(this).removeClass("hitreddice"); $(this).addClass("criticalreddice");
	} else if ($(this).hasClass("criticalreddice")) {
	    $(this).removeClass("criticalreddice"); $(this).addClass("blankreddice");
	}
    }
    $(".focusreddice").click(change);
    $(".hitreddice").click(change);
    $(".blankreddice").click(change);
    $(".criticalreddice").click(change);
}
function displayattackroll(m,n) {
    var i,j=0;
    for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
    $("#attack").empty();
    for (i=0; i<Math.floor(m/100)%10; i++,j++)
	$("#attack").append("<td class='focusreddice'></td>");
    for (i=0; i<(Math.floor(m/10))%10; i++,j++)
	$("#attack").append("<td class='criticalreddice'></td>");
    for (i=0; i<m%10; i++,j++)
	$("#attack").append("<td class='hitreddice'></td>");
    for (i=j; i<n; i++)
	$("#attack").append("<td class='blankreddice'></td>");
    addredclickchange();
}
function displayattacktokens(u,f) {
    $("#atokens").empty();
    var dm=targetunit.getresultmodifiers(u.ar,u.ad,Unit.DEFENSE_M,Unit.ATTACK_M);
    if (dm.length>0) {
	$("#atokens").append(dm);
	$("#atokens").append($("<button>").addClass("m-done").click(function() {
	    displayattacktokens2(u,f);
	}))
    } else displayattacktokens2(u,f);
}
function displayattacktokens2(u,f) {
    if (typeof f!="function") f=u.lastaf;
    else u.lastaf=f;
    $("#atokens").empty();
    var am=u.getresultmodifiers(u.ar,u.ad,Unit.ATTACK_M,Unit.ATTACK_M);
    if (am.length>0) {
	$("#atokens").append(am);
	$("#atokens").append($("<button>").addClass("m-done").click(function() {
	    $("#atokens").empty();
	    this.endmodifyattackstep();
	    f(this);}.bind(u)));
    } else f(u);
}
function displaydefensetokens(u,f) {
    $("#dtokens").empty();
    var dm=activeunit.getresultmodifiers(u.dr,u.dd,Unit.ATTACK_M,Unit.DEFENSE_M);
    if (dm.length>0) {
	$("#dtokens").append(dm);
	//$("#dtokens td").click(function() { displaydefensetokens(u,f); });
	$("#dtokens").append($("<button>").addClass("m-done").click(function() {
	    displaydefensetokens2(u,f);
	}));
    } else displaydefensetokens2(u,f);
}
function displaydefensetokens2(u,f) {
    if (typeof f!="function") f=u.lastdf;
    u.lastdf=f;
    $("#dtokens").empty();
    var dm=u.getresultmodifiers(u.dr,u.dd,Unit.DEFENSE_M,Unit.DEFENSE_M);
    if (FAST) { 	    
	//$("#combatdial").hide(); 
	displaycompareresults(u,f);
	//f(); 
    } else {
	$("#dtokens").append(dm);
	$("#dtokens").append($("<button>").addClass("m-fire").click(function() {
	    //$("#combatdial").hide();
	    //f();
	    this.endmodifydefensestep();
	    displaycompareresults(activeunit,f);
	}.bind(u)));
    }
}
function displaycompareresults(u,f) {
    if (typeof f!="function") f=u.lastdf;
    u.lastdf=f;
    $("#dtokens").empty();
    var dm=targetunit.getresultmodifiers(targetunit.dr,targetunit.dd,Unit.ATTACKCOMPARE_M,Unit.DEFENSE_M);
    var am=u.getresultmodifiers(u.ar,u.ad,Unit.ATTACKCOMPARE_M,Unit.ATTACK_M);
    if (FAST||(dm.length==0&&am.length==0)) {
	$("#combatdial").hide();
	//log("hiding combat dial compare");
	f();
    } else {
	$("#dtokens").append(dm).append(am);
	$("#dtokens").append($("<button>").addClass("m-fire").click(function() {
	    $("#combatdial").hide();
	    //log("hiding combat dial finally");
	    f();}.bind(u)));
    }
}

function costfilter(s) {
    if (typeof s=="undefined") COSTFILTER=10;
    else COSTFILTER=parseInt(s,10);
    displayfactionunits(true);
}
function wavefilter(s) {
    WAVEFILTER=s;
    displayfactionunits(true);
}
function unitfilter(s) {
    var i,j;
    if (typeof UNITFILTER[s]!="undefined") delete UNITFILTER[s];
    else UNITFILTER[s]=true;
    displayfactionunits(true);
}
function actionfilter(s) {
    var i,j;
    if (typeof ACTIONFILTER[s]!="undefined") delete ACTIONFILTER[s];
    else ACTIONFILTER[s]=true;
    displayfactionunits(true);
}
function textfilter(s) {
    TEXTFILTER=s;
    displayfactionunits(true);
}

function addroll(f,id,to) {
    if (to==Unit.DEFENSE_M) return addrolld(f,id);
    var n=getattackdice();
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var t=f(100*foc+10*c+h,n);
    displayattackroll(t.m,t.n);
    $("#atokens #mod"+id).remove();
}
function addrolld(f,id) {
    var n=getdefensedice();
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var t=f(10*foc+e,n);
    displaydefenseroll(t.m,t.n);
    $("#dtokens #mod"+id).remove();
}
function modroll(f,id,to) {
    if (to==Unit.DEFENSE_M) return modrolld(f,id);
    var n=getattackdice();
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var r=f(100*foc+10*c+h,n);
    displayattackroll(r,n);
    $("#atokens #mod"+id).remove();
}
function modrolld(f,id) {
    var n=getdefensedice();
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var r=f(10*foc+e,n);
    displaydefenseroll(r,n);
    $("#dtokens #mod"+id).remove();
}
function addgreenclickchange() {
    var change=function() { 
	if ($(this).hasClass("focusgreendice")) {
	    $(this).removeClass("focusgreendice"); $(this).addClass("evadegreendice");
	} else if ($(this).hasClass("blankgreendice")) {
	    $(this).removeClass("blankgreendice"); $(this).addClass("focusgreendice");
	} else if ($(this).hasClass("evadegreendice")) {
	    $(this).removeClass("evadegreendice"); $(this).addClass("blankgreendice");
	}
    }
    $(".focusgreendice").click(change);
    $(".evadegreendice").click(change);
    $(".blankgreendice").click(change);
}
function displaydefenseroll(r,n) {
    var i,j=0;
    $("#defense").empty();
    for (i=0; i<Math.floor(r/10); i++,j++)
	$("#defense").append("<td class='focusgreendice'></td>");
    for (i=0; i<r%10; i++,j++)
	$("#defense").append("<td class='evadegreendice'></td>");
    for (i=j; i<n; i++)
	$("#defense").append("<td class='blankgreendice'></td>");
    addgreenclickchange();
}

function reroll(n,from,to,a,id) {
    var i,l,m=0;
    var attackroll=["blank","focus","hit","critical"];
    var attackcode=[" ","%FOCUS%","%HIT%","%CRIT%"];
    var defenseroll=["blank","focus","evade"];
    if (typeof a.f=="function") a.f();
    var str="";
    if (to==Unit.ATTACK_M) {
	for (i=0; i<4; i++) {
	    // Do not reroll focus
	    if (activeunit.hasnorerollmodifiers(from,to,getattackvalue(),getattackdice(),"focus")&&typeof a.mustreroll=="undefined"&&attackroll[i]=="focus") continue;
	    if (a.dice.indexOf(attackroll[i])>-1) {
		l=$("."+attackroll[i]+"reddice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    str+=("<span class='"+attackroll[i]+"reddice'></span>").repeat(l.length);
		    m+=l.length;
		    n-=l.length;
		} else {
		    $("."+attackroll[i]+"reddice:lt("+n+"):not([noreroll])").remove();
		    str+=("<span class='"+attackroll[i]+"reddice'></span>").repeat(n);
		    m+=n;
		    n=0;
		    break;
		}
	    }
	}
	str+=" -> ";
	$("#atokens #reroll"+id).remove();
	var r=activeunit.rollattackdie(m);
	for (i=0; i<m; i++) {
	    //$("#attack").prepend("<td noreroll='true' class='"+r[i]+"reddice'></td>");
	    str+="<span class='"+r[i]+"reddice'></span>";
	    $("#attack").append("<td class='"+r[i]+"reddice' noreroll></td>");
	}
	//activeunit.log("reroll: "+str);
	addredclickchange();
    } else { 
	for (i=0; i<3; i++) {
	    // Do not reroll focus
	    if (typeof a.mustreroll=="undefined"&&targetunit.hasnorerollmodifiers(from,to,getattackvalue(),getattackdice(),"focus")&&attackroll[i]=="focus") continue;
	    if (a.dice.indexOf(defenseroll[i])>-1) {
		l=$("."+defenseroll[i]+"greendice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;
		    n-=l.length;
		} else {
		    $("."+attackroll[i]+"greendice:lt("+n+"):not([noreroll])").remove();
		    m+=n;
		    n=0;
		    break;
		}
	    }
	}
	$("#dtokens #reroll"+id).remove();
	activeunit.defenseroll(m).done(function(r) {
	    var i;
	    for (i=0; i<Unit.FE_evade(r.roll); i++)
		$("#defense").append("<td class='evadegreendice'></td>");
	    for (i=0; i<Unit.FE_focus(r.roll); i++)
		$("#defense").append("<td class='focusgreendice'></td>");
	    for (i=0; i<Unit.FE_blank(r.roll,r.dice); i++)
		$("#defense").append("<td class='blankgreendice'></td>");
	    addgreenclickchange();
	});
    }
}
function next_replay() {
    var p=[];
    if (REPLAY.length>0) p=REPLAY[replayid].split("_");
    return p;
}

function enablenextphase() {
    var i;
    var ready=true;
    switch(phase) {
     case SELECT_PHASE:
	var n1=parseInt($("#squad1points").text(),10);
	var n2=parseInt($("#squad2points").text(),10);
	if ((mode==FREECOMBAT&&(n1==0||n2==0))
	    ||(mode==SCENARIO&&(n1==0||$("#scenariolist tr.selected").length==0))
	    ||(mode==SCENARIOCREATOR&&(n2==0||SCENARIOTITLE==""||HEADER==""))) {
		ready=false;
		$(".nextphase").addClass("disabled");
	    }
	break;
    case PLANNING_PHASE:
	for (i in squadron)
	    if (squadron[i].maneuver<0&&!squadron[i].isdocked) { ready=false; break; }
	if (ready&&$(".nextphase").hasClass("disabled")) log(UI_translation["All units have planned a maneuver, ready to end phase"]);
	break;
    case ACTIVATION_PHASE:
	if (subphase!=ACTIVATION_PHASE) {
	    subphase=ACTIVATION_PHASE; 
	    skillturn=0; 
	    ready=false;
	    for (i in squadron) squadron[i].enddecloak().done(nextactivation);
	    barrier(nextactivation);
	} else {
	    for (i in squadron)
		if (squadron[i].maneuver>-1&&!squadron[i].isdocked) { ready=false; break; }
	    if (ready&&$(".nextphase").hasClass("disabled")) log(UI_translation["All units have been activated, ready to end phase"]);
	}
	break;
    case COMBAT_PHASE: 
	if (skillturn<0) {
	    $("#attackdial").hide();
	    for (var i in squadron) squadron[i].endcombatphase();
	    log(UI_translation["No more firing units, ready to end phase."]);
	    barrier(endphase);
	    ready=true; 
	} else ready=false;
	break;
    }
    
    if (ready) $(".nextphase").removeClass("disabled");
    if (ready&&FAST&&phase>=SETUP_PHASE) 
	return nextphase();
    // Replay
    /*var p=next_replay();
    if (REPLAY.length>0&&next_replay()[0]=="nextphase") {
	log("<div style='color:white;background:blue'>##"+p[0]+":"+p[1]+"</div>");
	replayid++;
	if (phase>=PLANNING_PHASE) return nextphase();
    } else log("<div style='color:white;background:green'>##"+p[0]+":"+p[1]+"</div>");
    */
    return ready;
}

function win(destroyed) {
    log("Squad "+destroyed+" is destroyed!");
    movelog("W");
    var title="m-draw";
    var i;
    var s1="",s2="";
    var defaults="<tr><td class='m-nocasualty'></td><td>0</td></tr>";
    var score1=0,score2=0;
    var saved1=false,saved2=false;
    for (i=0; i<allunits.length; i++) {
	var u=allunits[i];
	if (!u.dead&&u.team==1) saved1=true;
	if (!u.dead&&u.team==2) saved2=true;
	if (u.dead||(u.islarge&&u.shield+u.hull<(u.ship.hull+u.ship.shield)/2)) {
	    var p=u.dead?u.points:(u.points/2);
	    if (u.team==1) {
		s2+="<tr><td>"+u.name+(!u.dead?" (1/2 points)":"")+"</td><td>"+p+"</td></tr>";
		score2+=p;
	    } else {
		s1+="<tr><td>"+u.name+(!u.dead?" (1/2 points)":"")+"</td><td>"+p+"</td></tr>";
		score1+=p;
	    }
	}
    }
    if (saved1==false) score2=100;
    if (saved2==false) score1=100;
    if (s1=="") s1=defaults;
    if (s2=="") s2=defaults;
    var d=score1 - score2;
    score1 = d + 100;
    score2 = 100 - d;
//    var meanhit=Math.floor(1000*TEAMS[1].allhits/TEAMS[1].allred)/1000;
//    var meancrit=Math.floor(1000*TEAMS[1].allcrits/TEAMS[1].allred)/1000;
//    var str="<td rowspan='2' class='probacell' >";
//    str+="<div style='font-size:smaller'>Average <span class='hit'></span>/die:"+meanhit+" (norm:0.375)</div><div>Average <span class='critical'></span>/die:"+meancrit+" (norm:0.125)</div></td>";

    $(".victory-table").empty();
    $(".victory-table").append("<tr><th class='m-squad1'></th><th>"+score1+"</th></tr>");
    $(".victory-table").append(s1);
//    meanhit=Math.floor(1000*TEAMS[2].allhits/TEAMS[2].allred)/1000;
//    meancrit=Math.floor(1000*TEAMS[2].allcrits/TEAMS[2].allred)/1000;
//    var str="<td rowspan='2' class='probacell' >";
//    str+="<div style='font-size:smaller'>Average <span class='hit'></span>/die:"+meanhit+" (norm:0.375)</div><div>Average <span class='critical'></span>:"+meancrit+" (norm: 0.125)</div>/die</td>";
    $(".victory-table").append("<tr><th class='m-squad2'></th><th>"+score2+"</th></tr>");
    $(".victory-table").append(s2);
    if ((d>0&&WINCOND<0)||(destroyed==2&&(WINCOND>round||WINCOND==0))) title="m-1win";
    else if ((d<0&&WINCOND<0)||(destroyed==1&&(WINCOND>round||WINCOND==0))) title="m-2win";
    
    $(".victory").addClass(title);
    var titl = (TEAMS[1].isia?"Computer":"Player")+":"+score1+" "+(TEAMS[2].isia?"Computer":"Player")+":"+score2;
    var note=TEAMS[1].toJuggler(false);
    note+="VS"+TEAMS[2].toJuggler(false);
    note=note.replace(/\n/g,".");
    note=note.replace(/ \+ /g,"*");
    note=note.replace(/ /g,"_");
    var url=encodeURI(WEBSITE+"?"+permalink(false));
    $("#submission").contents().find('#entry_209965003').val(titl);
    $('#submission').contents().find('#entry_390767903').val(note);
    $('#submission').contents().find('#entry_245821581').val("no short url");
    $('#submission').contents().find('#entry_1690611500').val(url);
    $(".tweet").hide();
    save();
    for (i in ["email","facebook","tweet","googlep"]) {
	(function(n) {
	    $("."+n).click(function() {
		ga("send","event",{
		    eventCategory: 'social',
		    eventAction: 'send',
		    eventLabel: n
		});
	    });
	})(i);
    }
    $(".victory-link").attr("href",url);
    /*var y1=0,y2=0;
    var t1=TEAMS[1].history;
    var t2=TEAMS[2].history;
    var val1=[],val2=[];
    var y1=0,y2=0;
    var scalex=$('#svgLine').height()/round;
    for (i=0; i<=round; i++) {
	if (typeof t1.rawdata[i]!="undefined") { y1+=t1.rawdata[i].hits;}
	val1[i]=y1;
	if (typeof t2.rawdata[i]!="undefined") { y2+=t2.rawdata[i].hits;}
	val2[i]=y2;
    }
    var scaley=$('#svgLine').height()/Math.max(Math.max.apply(null,val1),Math.max.apply(null,val2));
    for (i=0; i<=round; i++) { val1[i]*=scaley; val2[i]*=scaley; }

    sl = Snap('#svgLine');*/
    //sl.path("M 0 0 L "+val1);
    //sl.polyline(val2);
    //makeGrid();
    //makePath(val1,'red');
    //makePath(val2,'blue');
    window.location="#modal";
}
//document.addEventListener("win",win,false);

function page_creation() {
    $("#selectphase").hide();
    $(".headlines").hide();
    $("#creation").show();
}
function page_main() {
    $("#addcomment").hide();
    $(".buttonbar .share-buttons").hide();
    $(".h2 .share-buttons").show();
    $(".permalink").hide();
    $(".activeunit").prop("disabled",true);
    $("#rightpanel").hide();
    $("#leftpanel").hide();
    $("#game").hide();
    $("nav").hide();
    $(".mainarticle").hide();
    $(".headlines").show();
    HEADER="";
    SCENARIOTITLE="";
    currentteam.setfaction(Unit.REBEL);
    window.location="index.html";
}
function page_select() {
    $("#creation").hide();
    $("nav").hide();
    $("#game").hide();
    $("#rightpanel").hide();
    $("#leftpanel").hide();
    $("#selectphase").show();
    $(".nextphase").addClass("disabled");
    enablenextphase();
    phase=SELECT_PHASE;
}
function createsquad(f) {
    page_creation();
    var faction=currentteam.faction;
    if (typeof f!="undefined") faction=f;
    $(".activeunit").prop("disabled",true);
    //$("#selectphase").hide();
    //$("#addcomment").hide();
    /*ga('send','event', {
	eventCategory: 'interaction',
	eventAction: 'create',
	eventLabel: 'create'
    });*/
    //phase=CREATION_PHASE;
    //$("footer").hide();
    $('#consolecb').removeAttr('Checked');
    //$(".nextphase").prop("disabled",false);
    currentteam.changefaction(faction);
    $(".factionselect selected").val(faction);
    //$("#creation").show();
    var u={};
    u.getdial=function() {
	return 	[
	    {"move":"TL1","difficulty":"WHITE"},
	    {"move":"BL1","difficulty":"WHITE"},
	    {"move":"F1","difficulty":"WHITE"},
	    {"move":"SL2","difficulty":"WHITE"},
	    {"move":"TL2","difficulty":"WHITE"},
	    {"move":"BL2","difficulty":"WHITE"},
	    {"move":"F2","difficulty":"WHITE"},
	    {"move":"K2","difficulty":"WHITE"},
	    {"move":"SL3","difficulty":"WHITE"},
	    {"move":"TL3","difficulty":"WHITE"},
	    {"move":"BL3","difficulty":"WHITE"},
	    {"move":"F3","difficulty":"WHITE"},
	    {"move":"K3","difficulty":"WHITE"},
	    {"move":"F4","difficulty":"WHITE"},
	    {"move":"K4","difficulty":"WHITE"},
	    {"move":"F5","difficulty":"WHITE"},
	    {"move":"K5","difficulty":"WHITE"}
	];
    };
    //$(".m-create").hide();
    //$(".title").html("Squad Building");
    $(".dialfilter").html(Unit.prototype.getdialstring.call(u));
    $(".dialfilter td[move]").click(function() { 
	var m=$(this).attr("move"); 
	if (typeof MOVEFILTER[m]!="undefined") {
	    delete MOVEFILTER[m];
	    $(this).removeClass("selected");
	} else { 
	    MOVEFILTER[m]=true;
	    $(this).addClass("selected");
	}
	displayfactionunits(true);
    });
    displayfactionunits(false);
    for (var i in generics) {
	var u=generics[i];
	if (u.team==currentteam.team) {
	    addunit(u.pilotid,currentteam.faction,u);
	    for (var j=0; j<u.upgradetype.length; j++) {
		var upg=u.upg[j];
		if (upg>-1) {
		    addupgrade(u,upg,j);
		}
	    }
	}
    }
}
function switchdialimg(b) {
    if (b==true) {
	$("#caroussel .shipimg").css("display","none");
	$("#caroussel .shipdial").css("display","table-cell");
    } else {
	$("#caroussel .shipdial").css("display","none");
	$("#caroussel .shipimg").css("display","table-cell");
    }
}

function selectrocks() {
    var ROCKSHAPES=[1,2,3,4,5,6];
    $(".aster img").click(function(e) {
	var i=parseInt(e.target.id.substr(1),10);
	if (ROCKSHAPES.indexOf(i)>-1) {
	    ROCKSHAPES[i]=null;
	} else {
	    var j;
	    for (j=0; j<6; j++) if (ROCKSHAPES[j]==null) break; 
	    if (j<6) {
		ROCKSHAPES[j]=i;
		$("#a"+i).addClass("selected");
	    }
	}
    }.bind(this))
}


function dial2JSON(dial) {
    var m=[];
    var j,k;
    for (j=0; j<=5; j++) m[j]={item:"",moves:null};
    for (j=0; j<dial.length; j++) {
	var d=dial[j];
	var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
	m[5-cx].item=cx;
	if (m[5-cx].moves==null) {
	    m[5-cx].moves=[];
	    for (k=0; k<=6; k++) m[5-cx].moves[k]={difficulty:"",key:""};
	}
	m[5-cx].moves[cy]={difficulty:d.difficulty,key:P[d.move].key};
    }
    return m;
}

function selectweapon(weapons) {
    $("#attackdial").html(Mustache.render(TEMPLATES["selectweapon"],weapons)).show();
}
function getpilottexttranslation(u,faction) {
    var idxn=u.name+(faction==Unit.SCUM?" (Scum)":"");
    if (typeof u.edition!="undefined") {
	var i=u.name+"("+u.edition+")";
	if (typeof PILOT_translation[i]!="undefined"&&typeof PILOT_translation[i].text!="undefined") return formatstring(PILOT_translation[i].text);
    }
    if (typeof PILOT_translation[idxn]!="undefined"&&typeof PILOT_translation[idxn].text!="undefined") return formatstring(PILOT_translation[idxn].text);
    return "";
}
function getupgtxttranslation(name,type) {
    var v=name+(type==Unit.CREW?"(Crew)":"");
    if (typeof UPGRADE_translation[v]!="undefined") {
	/*var faq=UPGRADE_translation[v].faq;
	if (typeof faq=="undefined") faq=""; else faq="<div style='color:grey'><strong>FAQ:</strong>"+faq+"</div>";*/
	if (typeof UPGRADE_translation[v].text!="undefined") return formatstring(UPGRADE_translation[v].text);
    }
    return "";
}
function importsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    currentteam.name="SQUAD."+currentteam.toASCII();
    var jug=currentteam.toJuggler(true);
    currentteam.toJSON(); // just for points
    $("#squad"+t+"points").html(currentteam.points);
    localStorage[currentteam.name]=JSON.stringify({"pts":currentteam.points,"faction":currentteam.faction,"jug":currentteam.toJuggler(false)});
    SQUADLIST.addrow(t,currentteam.name,currentteam.points,currentteam.faction,jug);
    enablenextphase();
}

function startcombat() {
}
function filltabskill() {
    var i;
    tabskill=[];
    for (i=0; i<=12; i++) tabskill[i]=[];
    for (i in squadron) tabskill[squadron[i].getskill()].push(squadron[i]);
    for (i=0; i<=12; i++) tabskill[i].sort(function(a,b) {
	var xa=0,xb=0;
	if (TEAMS[a.team].initiative==true) xa=1; 
	if (TEAMS[b.team].initiative==true) xb=1;
	if (xb-xa==0) return (b.id-a.id);
	return xb-xa;
    });
}

var ZONE=[];
function movelog(s) {
    ANIM+="_-"+s;
}
function endsetupphase() {
    $(".buttonbar .share-buttons").hide();
    $("#leftpanel").show();
    $(".bigbutton").hide();
    $(".playertype").prop("disabled",true);
    ZONE[2].remove();
    ZONE[3].remove();
    TEAMS[1].endsetup();
    TEAMS[2].endsetup();
    PERMALINK=permalink(true);
    $("#turnselector").append("<option value='0'>"+UI_translation["phase"+SETUP_PHASE]+"</option>");
    $(".playerselect").remove();
    $(".nextphase").addClass("disabled");
    $(".unit").css("cursor","pointer");
    $("#positiondial").hide();
    for (var i=0; i<OBSTACLES.length; i++) OBSTACLES[i].unDrag();
    HISTORY=[];
    for (var i in squadron) squadron[i].endsetupphase();
}
function nextphase() {
    var i;
    //$("#savebtn").hide();
    //log("phase current "+phase+" mode "+mode+"/"+SCENARIOCREATOR);
    // End of phases
    //if (!enablenextphase()) return;
    window.location="#";
    switch(phase) {
    case SELECT_PHASE:
	if (mode==SCENARIO) {
	    var id=$("#scenariolist tr.selected").attr("id");
	    var row=parseInt(id.replace(/sc([0-9]+)/,"$1"),10);
	    SCENARIOLIST.checkrow(row);
	}
	$(".mainarticle").hide();
	$(".permalink").show();
	$("nav").show();
	$("#game").show();
	$("#rightpanel").show();
	$("#leftpanel").show();
 	break;
    case SETUP_PHASE:
	if (mode==SCENARIOCREATOR) {
	    phase=SELECT_PHASE-1;
	    SCENARIOLIST.addrow(SCENARIOTITLE,HEADER,WINCOND,permalink(true));
	    break;
	}
	var ending=true;
	for (var i in squadron) if  (squadron[i].areactionspending()) ending=false;
	if (ending==false) return;
	if ($("#player1 option:checked").val()=="human") 
	    TEAMS[1].isia=false; else TEAMS[1].isia=true;
	if ($("#player2 option:checked").val()=="human") 
	    TEAMS[2].isia=false; else TEAMS[2].isia=true;
	if (TEAMS[1].isia==true) TEAMS[1].setia();
	if (TEAMS[2].isia==true) TEAMS[2].setia();
	/*ZONE[0].attr({fillOpacity:0});*/
	/*ZONE[1].attr({fillOpacity:0});*/
	$(".imagebg").hide();
	endsetupphase();
	/*
	if (REPLAY.length>0) {
	    replayid=0;
	    for (var i=0; i<this.squadron.length; i++) 
		$.extend(this.squadron[i],ReplayUnit.prototype);

	}*/
	//$(".permalink").hide();
	break;
    case PLANNING_PHASE:
	$("#maneuverdial").hide();
	for (i in squadron) {
	    squadron[i].endplanningphase();
	}
	break;
    case ACTIVATION_PHASE:
	$("#activationdial").hide();
	for (i in squadron) {
	    squadron[i].hasmoved=false; 
	    squadron[i].hasdecloaked=false;
	    squadron[i].actiondone=false;
	    squadron[i].endactivationphase();
	}
	var b=[];
	for (i=0; i<BOMBS.length; i++) b[i]=BOMBS[i];
	for (i=0; i<b.length; i++) b[i].explode();
	break;
    case COMBAT_PHASE:
	$("#attackdial").hide();
	$("#listunits").html("");
	for (i in squadron) squadron[i].endround();
	$("#turnselector").append("<option value='"+round+"'>"+UI_translation["turn #"]+round+"</option>");
	round++;
	if (WINCOND<round&&WINCOND>0) win(0);
	if (-WINCOND<round&&WINCOND<0) win(0);
	break;
    }
    if (phase>=SELECT_PHASE) {
	phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;
	movelog("P-"+round+"-"+(phase));
	if (phase<=1) $("#phase").empty();
	else if (phase<3) $("#phase").html(UI_translation["phase"+phase]);
	else $("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
	$("#combatdial").hide();
	//if (phase>SELECT_PHASE) for (i in squadron) {squadron[i].unselect();}
	// Init new phase
	
	$(".nextphase").removeClass("disabled");
    }
    setphase();
}

function setphase(cannotreplay) {
    $(".imagebg").hide();

    switch(phase) {
    case SELECT_PHASE:
	page_select();
	$(".nextphase").addClass("disabled");
	break;
	//$(".title").html("Squadron Benchmark");
	//createsquad();
	//window.location="#creation";
    case SETUP_PHASE:
	$(".imagebg").show();
	$("#addcomment").show();

	var t=["bomb","weapon","upgrade","social","condition","squad-display"];
	for (var i=0;i<t.length; i++) {
	    TEMPLATES[t[i]]=$("#"+t[i]).html();
	    Mustache.parse(TEMPLATES[t[i]]);
	}
	var name=UI_translation["human"];
	var computer=UI_translation["computer"];
	$("#player1").html("<option selected value='human'>"+name+"</option>");
	$("#player1").append("<option value='computer'>"+computer+"</option>");
	$("#player2").html("<option selected value='human'>"+name+"</option>");
	$("#player2").append("<option value='computer'>"+computer+"</option>");
	$("#player1").change(function() {
	    TEAMS[1].isia=!TEAMS[1].isia;
	    displayplayertype(1);
	});
	$("#player2").change(function() {
	    TEAMS[2].isia=!TEAMS[2].isia;
	    displayplayertype(2);
	});
	TEAMS[1].isia=false;
	displayplayertype(1);
	TEAMS[2].isia=true;
	displayplayertype(2);
	$(".playertype").removeProp("disabled");
	$(".bigbutton").show();
	$(".bigbutton2").prop("disabled",false);

	$(".buttonbar .share-buttons").show();
	$("#team2").css("top",$("nav").height()+2);
	$("#team1").css("top",$("nav").height()+2);
	$(".ctrl").css("display","block");
	
	ZONE[0]=s.path(SETUP.playzone1).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		id:'ZONE1',
	        fillOpacity:1,
	    filter: "drop-shadow( 5px 5px 5px #000 )",
		pointerEvents:"none"
	    });
	if (SETUP.playzone1!=SETUP.playzone2) { 
	    ZONE[1]=s.path(SETUP.playzone2).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		id:'ZONE2',
	        fillOpacity:0,
		pointerEvents:"none"
	    });
	    ZONE[1].appendTo(VIEWPORT);
	} else ZONE[1]=ZONE[0];
	$("#imagebg").change(function() {
	    changeimage(this);
	});
	if (SETUP.background!="") $(".playmat").css({background:"url("+SETUP.background+") no-repeat",backgroundSize:"100% 100%"});
	if (SETUP.pattern=="") ZONE[0].attr("fillOpacity",0);
	else {
            var pattern = s.image(SETUP.pattern,0,0,360,360).pattern(0,0,360,360);
            ZONE[0].attr("fill",pattern);
        }
	ZONE[0].appendTo(VIEWPORT);
	ZONE[2]=s.path(SETUP.zone1).attr({
		fill: TEAMS[1].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[2].appendTo(VIEWPORT);
	ZONE[3]=s.path(SETUP.zone2).attr({
		fill: TEAMS[2].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[3].appendTo(VIEWPORT);
	TEAMS[1].endselection(s);
	TEAMS[2].endselection(s);
	loadsound();

	if (HEADER!=""&&round<2) {
	    $("footer").hide();
	    $("#titlecontent").html("<h1>"+SCENARIOTITLE+"</h1>"+HEADER);
	}
	if (TEAMS[1].points<TEAMS[2].points) TEAMS[2].initiative=true;
	else if (TEAMS[2].points<TEAMS[1].points) TEAMS[1].initiative=true;
	else TEAMS[1].initiative=true;
	if (TEAMS[1].initiative==true) log("TEAM #1 has initiative");
	else log("TEAM #2 has initiative");
	$(".activeunit").prop("disabled",false);
	var i;

	for (i in squadron) if (!squadron[i].isdocked) break;
	activeunit=squadron[i];
	activeunit.select();
	activeunit.show();

	jwerty.key("f",function() {
	    //console.log("SETUP:"+SETUP.name);
	});


	var zoom=function(centerx,centery,z) {
	    var w=$("#svgout").width();
	    var h=$("#svgout").height();
	    var startX=0;
	    var startY=0;
	    if (h>w) startY=(h-w)/2;
	    else startX=(w-h)/2;
	    var max=Math.max(GW/w,GH/h);
	    var offsetX=(centerx-startX)*max;
	    var offsetY=(centery-startY)*max;
	    var vm=VIEWPORT.m.clone().invert();
	    var x=vm.x(offsetX,offsetY);
	    var y=vm.y(offsetX,offsetY);
	    VIEWPORT.m.translate(x,y).scale(z).translate(-x,-y);
	    VIEWPORT.transform(VIEWPORT.m);
	    activeunit.show();
	}

	$("#svgout").bind('mousewheel DOMMouseScroll', function(event){
	    var e = event.originalEvent; // old IE support
	    var delta;
	    if (typeof e.wheelDelta != "undefined") 
		delta=e.wheelDelta / 360.;
	    else delta = e.detail/ -9.;
	    var z=Math.pow(1.1, delta);
	    zoom(e.clientX-$("#team1").width(),e.clientY-$("nav").height(),z);
	});

	$("#svgout").mousedown(function(event) { dragstart(event);});
	$("#svgout").mousemove(function(e) {dragmove(e);});
	$("#svgout").mouseup(function(e) {dragstop(e);});

	jwerty.key("escape", nextphase);

	/* By-passes */
	jwerty.key("alt+p",function() {
	    activeunit.showpositions(activeunit.getdial());
	},{});
	jwerty.key("alt+g",function() {
	    if (TEAMS[activeunit.team].isia) activeunit.showgrouppositions();
	    else console.log("not an IA");
	},{});
	jwerty.key("alt+m",function() {
	    activeunit.showmeanposition();
	});
	jwerty.key("alt+shift+p",function() {
	    $(".possible").remove();
	});
	jwerty.key("alt+1", function() { activeunit.addfocustoken();activeunit.show();});
	jwerty.key("alt+2", function() { activeunit.addevadetoken();activeunit.show();});
	jwerty.key("alt+3", function() { if (!activeunit.iscloaked) {activeunit.addcloaktoken();activeunit.show();}});
	jwerty.key("alt+4", function() { activeunit.addstress();activeunit.show();});
	jwerty.key("alt+5", function() { activeunit.addiontoken();activeunit.show();});
	jwerty.key("alt+6", function() { activeunit.addtractorbeamtoken();activeunit.show();});
	jwerty.key("alt+shift+1", function() { if (activeunit.focus>0) activeunit.removefocustoken();activeunit.show();});
	jwerty.key("alt+shift+2", function() { if (activeunit.evade>0) activeunit.removeevadetoken();activeunit.show();});
	jwerty.key("alt+shift+3", function() { if (activeunit.iscloaked) {activeunit.removecloaktoken();activeunit.show();}});
	jwerty.key("alt+shift+4", function() { if (activeunit.stress>0) activeunit.removestresstoken();activeunit.show();});
	jwerty.key("alt+shift+5", function() { if (activeunit.ionized>0) activeunit.removeiontoken();});
	jwerty.key("alt+shift+6", function() { if (activeunit.tractorbeam>0) activeunit.removetractorbeamtoken();});
	jwerty.key("alt+d",function() { activeunit.resolvehit(1);});
	jwerty.key("alt+c",function() { activeunit.resolvecritical(1);});
	jwerty.key("alt+shift+d",function() { 
	    if (activeunit.hull<activeunit.ship.hull) activeunit.addhull(1); 
	    else if (activeunit.shield<activeunit.ship.shield) activeunit.addshield(1); 
	    activeunit.show();
	});

	if (SETUP.asteroids>0) {
	    loadrock(s,ROCKDATA);
	}

	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$("footer").show();
	$(".unit").css("cursor","move");
	$("#positiondial").show();
	$(".permalink").show();
	$("#savebtn").hide();
	for (i in squadron) squadron[i].beginsetupphase();
	if (cannotreplay!=true) startreplayall();
	break;
    case PLANNING_PHASE: 
	active=0;
	/* For actions of all ships */
	actionr = [$.Deferred().resolve()];
	/* For phase */
	actionrlock=$.Deferred().resolve();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").addClass("disabled");
	$("#maneuverdial").show();
	skillturn=0;
	filltabskill();
	$("#savebtn").show();
	for (i in squadron) {
	    squadron[i].newm=squadron[i].m;
	    squadron[i].beginplanningphase().progress(nextplanning);
	}
	nextplanning();
	break;
    case ACTIVATION_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").addClass("disabled");
	$("#activationdial").show();
	for (i in squadron) squadron[i].beginactivationphase().done(nextdecloak);
	
	filltabskill();
	subphase=DECLOAK_PHASE;
	skillturn=0;
	barrier(nextdecloak);
	break;
    case COMBAT_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$("#attackdial").show();
	skillturn=12;
	$(".nextphase").addClass("disabled");

	for (i in squadron) squadron[i].begincombatphase().done(nextcombat);
	barrier(nextcombat);
	break;
    }
}
function barrier(f) {
    //for (var i=0; i<actionr.length; i++) 
    //	log(i+":"+actionr[i].state());
    $.when.apply(null,actionr).done(f);
}
function log(str) {
    $("#log").append("<div>"+str+"<div>");
    $("#log").scrollTop(10000);
}
function permalink(reset) {
    var r="";
    if (!reset) { /*if (REPLAY!="") r=REPLAY; else*/ r=ANIM; } 
    return LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+SETUP.name+(MOVING_ASTER?"!":"")+"&"+r+"&"+SCENARIOTITLE+"&"+HEADER+"&"+WINCOND);
}
function savesquad() {
    return LZString.compressToEncodedURIComponent(TEAMS[3].toASCII()+"&&");
}
function resetlink(home,setup,round) {
    switch (phase) {
    case SETUP_PHASE:
    case SELECT_PHASE: 
	document.location.search="";
	var uri=document.location.href;
	if (uri.indexOf("?") > 0) {
	    var clean_uri = uri.substring(0, uri.indexOf("?"));
	    window.history.replaceState({}, document.title, clean_uri);
	}
	location.reload();
	break;
    default: 
	if (home==true) {
	    if (document.location.search!="") document.location.search="";
	    else document.location.reload();
	} else {
	    if (setup==true) ANIM="";
	    else if (round==true) {
		$("#turnselector option:selected").each(function() {
		    var r=$(this).val();
		    if (r==-1) return;
		    if (r==0) ANIM=""; else {
			var idx=ANIM.search('_-P-'+r+'-3');
			ANIM=ANIM.slice(0,ANIM.indexOf("_",idx+1));
		    }
		});
	    } else {
		var idx=ANIM.search('_-P-'+round+'-3');
		if (ANIM.indexOf("_",idx+1)==-1) {
		    idx=ANIM.search('_-P-'+(round-1)+'-3');
		}
		ANIM=ANIM.slice(0,ANIM.indexOf("_",idx+1));
	    }	
	    var arg=LZString.decompressFromEncodedURIComponent(decodeURI(PERMALINK));
	    args=arg.split("&");
	    args[2]=saverock();
	    args[6]=ANIM;
	    args[7]=SCENARIOTITLE;
	    args[8]=HEADER;
	    args[9]=WINCOND;
	    arg=args.join("&");
	    document.location.search="?"+LZString.compressToEncodedURIComponent(arg);
	}
    }
}

function record(id,val,str) {
    //HISTORY.push({s:str,v:val,id:id});
    //log("<div style='background-color:red;color:white'>"+id+"."+str+":"+val+"<div>");
}
function history_toASCII() {
    var str="";
    for (var i=0; i<HISTORY.length; i++) 
	str+=HISTORY[i].s+"_"+HISTORY[i].id+";";
    return str;
}
function select(id) {
    var i;
    for (i in squadron) {
	if (squadron[i].id==id) break;
    }
    squadron[i].select();
    //$("#"+u.id).attr({color:"black",background:"white"});
    $("#"+activeunit.id).attr({color:"white",background:"tomato"});
}


function probatable(attacker,defender) {
    var i,j;
    var str="";
    for (i=0; i<=5; i++) {
	str+="<tr><td>"+i+"</td>";
	for (j=0; j<=5; j++) {
	    var k=j;
	    if (defender.adddice>0) k+=defender.adddice;
	    var th=tohitproba(attacker,{modifyattackroll:function(n,a,d) { return n;}},defender,ATTACK[i],DEFENSE[k],i,k);
	    str+="<td class='probacell' style='background:hsl("+(1.2*(100-th.tohit))+",100%,80%)'>";
	    str+="<div>"+th.tohit+"%</div><div><code class='symbols'>d</code>"+th.meanhit+"</div><div><code class='symbols'>c</code>"+th.meancritical+"</div></td>";
	}
	str+="</tr>";
    }
    return str;
}
function fillprobatable() {
    var attacker={focus:$("#focusA").prop("checked")?1:0,
		  reroll:$("#targetA").prop("checked")?5:0};
    var defender={focus:$("#focusD").prop("checked")?1:0,
		  evade:$("#evadeD").prop("checked")?1:0,
		  adddice:$("#cloakD").prop("checked")?2:0,
		  reroll:0};
    //log("REROLL1:"+attacker.reroll);
    var ra;
    ra=parseInt($("#rerollA").val(),10);
    var rd=parseInt($("#rerollD").val(),10);
    //log("REROLL2:"+ra+"-"+$("#rerollA").val());
    if (attacker.reroll==0||(ra>0&&ra<attacker.reroll)) attacker.reroll=ra;
    if (defender.reroll==0||(rd>0&&rd<defender.reroll)) defender.reroll=rd;

    //log("REROLL "+ra);
    var str="<tr><th>Rolls</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>"+probatable(attacker,defender);
    $("#probatable").html(str);
}


function modal_dragstart(event) {
    var style = window.getComputedStyle(event.originalEvent.target, null);
    event.originalEvent.dataTransfer.setData("text/plain",
					     event.target.parentElement.id+","+
					     (parseInt(style.getPropertyValue("left"),10) - event.originalEvent.clientX) + ',' +
					     (parseInt(style.getPropertyValue("top"),10) - event.originalEvent.clientY));
} 
function modal_dragover(event) { 
    event.originalEvent.preventDefault(); 
    return false; 
} 
function modal_drop(event) { 
    var offset = event.originalEvent.dataTransfer.getData("text/plain").split(',');
    var id = offset[0];
    $("#"+id+" > div").css("left", (event.originalEvent.clientX + parseInt(offset[1],10)) + 'px');
    $("#"+id+" > div").css("top", (event.originalEvent.clientY + parseInt(offset[2],10)) + 'px');
    event.originalEvent.preventDefault();
    return false;
} 
var viewport_translate=function(dx,dy) {
    VIEWPORT.m=MT(dx,dy).add(VIEWPORT.m);
    $(".phasepanel").hide();
    VIEWPORT.transform(VIEWPORT.m);
};
    var viewport_zoom=function(z) {
	var offsetX=activeunit.m.x(0,0);
	var offsetY=activeunit.m.y(0,0);
	var vm=VIEWPORT.m.clone().invert();
	var x=vm.x(offsetX,offsetY);
	var y=vm.y(offsetX,offsetY);

	VIEWPORT.m.translate(x,y).scale(z).translate(-x,-y);
	VIEWPORT.transform(VIEWPORT.m);
	activeunit.show();
    };
	var dragmove=function(event) {
	    if (activeunit.dragged==true) return;
	    var e = event; // old IE support
	    if (VIEWPORT.dragged) {
		var w=$("#svgout").width();
		var h=$("#svgout").height();
		var max=Math.max(GW/w,GH/h);
		var ddx=(e.offsetX-VIEWPORT.x0)*max;
		var ddy=(e.offsetY-VIEWPORT.y0)*max;
		VIEWPORT.dragMatrix=MT(ddx,ddy).add(VIEWPORT.m);
		VIEWPORT.dragged=true;
		$(".phasepanel").hide();
		VIEWPORT.transform(VIEWPORT.dragMatrix);
	    }
	};
var dragstart=function(event) { 
    var e = event; // old IE support
    VIEWPORT.dragged=true;
    if (e.originalEvent.target.id == "svgout") {
	VIEWPORT.x0=e.offsetX;
	VIEWPORT.y0=e.offsetY;
	VIEWPORT.dragged=true; 
	VIEWPORT.dragMatrix=VIEWPORT.m;
    } else VIEWPORT.dragged=false;
}
var   dragstop= function(e) { 
    if (VIEWPORT.dragged) { 
	VIEWPORT.m=VIEWPORT.dragMatrix;
	VIEWPORT.m.clone();
	VIEWPORT.transform(VIEWPORT.m);
	activeunit.show();
    }
    VIEWPORT.dragged=false;
}
var scrolloverflow=function(event) {
    //var id=event.target.id;
    var id=event.currentTarget.id;
    $("#"+id+" .outoverflow").each(function(index) { 
	if ($(this).css("top")!="auto") {
	    $(this).css("top",$(this).parent().offset().top+"px");
	}
    });
}

var changelanguage= function(l) {
    localStorage['LANG']=l;
    //log("reloading "+l);
    location.reload();
}

// This function actually initializes everything, once the page is loaded
$(document).ready(function() {
    var i;
    s= Snap("#svgout");

    VIEWPORT = s.g().attr({id:"viewport"});
    VIEWPORT.m=new Snap.Matrix();
    FILTER = s.filter(Snap.filter.blur(5,5));
    P = { F0:{path:s.path("M 0 0 L 0 0"), speed: 0, key:"5"},
	  F1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"8"},
	  RF1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"|"},
	  F2:{path:s.path("M 0 0 L 0 -120"), speed: 2, key:"8"},
	  F3:{path:s.path("M 0 0 L 0 -160"), speed: 3, key:"8"},
	  F4:{path:s.path("M 0 0 L 0 -200"), speed: 4, key:"8"},
	  F5:{path:s.path("M 0 0 L 0 -240"), speed: 5, key: "8" },
	  // Turn right
	  TR1:{path:s.path("M0 0 C 0 -40 15 -55 55 -55"), speed: 1, key:"6"},// 35 -35
	  TR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83"), speed:2, key:"6"},// 63 -63
	  TRR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83"), speed:2, key:";"},// 63 -63
	  TR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105"), speed:3, key:"6"}, // 85 -85
	  TRR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105"), speed:3, key:";"}, // 85 -85
	  // Turn left
	  TL1:{path:s.path("M0 0 C 0 -40 -15 -55 -55 -55"), speed:1, key:"4"}, // -35 -35
	  TL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83"), speed:2, key:"4"},// -63 -63
	  TRL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83"), speed:2, key:":"},// -63 -63
	  TL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105"), speed:3, key:"4"}, // -85 -85
	  TRL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105"), speed:3, key:":"}, // -85 -85
	  // Bank right
	  BR1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92"), speed:1, key:"9"}, // 24 -58 (+/-14.14)
	  RL1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92"), speed:1, key:"}"}, // 24 -58 (+/-14.14)
	  BR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"9"}, // 40 -92 (+/-14.14)
	  SR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"3"}, // 40 -92 (+/-14.14)
	  BR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"9"}, // 55 -126 (+/-14.14)
	  SR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"3"}, // 55 -126 (+/-14.14)
	  // Bank left
	  BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"7"}, // 24 -58 (+/-14.14)
	  RR1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"{"}, // 24 -58 (+/-14.14)
	  BL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126"), speed:2, key:"7"}, // 40 -92 (+/-14.14)
	  SL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126"), speed:2, key:"1"}, // 40 -92 (+/-14.14)
	  BL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"7"}, // 55 -126 (+/-14.14)
	  SL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"1"}, // 55 -126 (+/-14.14)
	  // K turns (similar to straight line, special treatment in move function)
	  K1:{path:s.path("M 0 0 L 0 -80"), speed:1, key:"2"},
	  K2:{path:s.path("M 0 0 L 0 -120"), speed:2, key:"2"},
	  K3:{path:s.path("M 0 0 L 0 -160"), speed:3, key:"2"},
	  K4:{path:s.path("M 0 0 L 0 -200"), speed:4, key:"2"},
	  K5:{path:s.path("M 0 0 L 0 -240"), speed:5, key: "2" }
	};
    for (i in P)
	P[i].path.attr({display:"none"});
    $(".menu").mouseover(function() {
	$(".menu ul").css({display:'block',visibility:'visible'});
    }).mouseout(function() {
	$('nav ul').css({display:'none',visibility:'hidden'});
    });
    $("footer").hide();

    var initgapi=function() {
        gapi.client.setApiKey('AIzaSyBN2T9d2ZuWaT0Vj6EanYb5IgWzLlhy7Zo');
        gapi.client.load('urlshortener', 'v1');
    };
    //if (typeof gapi!="undefined") gapi.load('client', initgapi);

    $("#squad1").on("paste",function() {
	setTimeout(function(){
	    currentteam=TEAMS[1];importsquad(1);}, 4);
    });
    $("#squad2").on("paste",function() {
	setTimeout(function(){
	    currentteam=TEAMS[2];importsquad(2);}, 4);
    });

    /*
    jwerty.key("alt+i",function() {
	hello('google').login()
    });
    jwerty.key("alt+j",function() {
	hello('facebook').login()
    });
    hello.on('auth.login', function(auth) {
	// Call user information, for the given network
	hello(auth.network).api('me').then(function(r) {
	    // Inject it into the container
	    console.log(r.thumbnail+" hello "+r.name);
	});
    });
    hello.init({
	facebook: "1615235965440706",
	windows: "",
	google: "896425822430-lv5gd4lk9c88hc47cp5eeigsb1h8rbio.apps.googleusercontent.com"
    }, {redirect_uri: 'http://baranidlo.github.io/bench/index.html'});
    */    
    /*hello('facebook').api('me').then(function(r) {
	console.log("my name is (facebook) "+r.name);
    });
    hello('google').api('me').then(function(r) {
	console.log("my name is (google) "+r.name);
    });
*/
    // Load unit data



    var availlanguages=["en","fr","de","es","it","pl"];
    LANG = localStorage['LANG'] || window.navigator.userLanguage || window.navigator.language;
    LANG=LANG.substring(0,2);
    $.ajaxSetup({
	beforeSend: function(xhr){
	    if (xhr.overrideMimeType) xhr.overrideMimeType("application/json");
	},
	isLocal:true
    });
    if (availlanguages.indexOf(LANG)==-1) LANG="en";
    $("#langselect").val(LANG);
    $.when(
	$.ajax("data/ships.json",{error:function(xhr,status,error) {
	    console.log("**Error loading ships.json\n"+status+" "+error);
	}}),
	$.ajax("data/strings."+LANG+".json",{error:function(xhr,status,error) {
	    console.log("**Error loading strings."+LANG+".json\n"+status+" "+error);
	}}),
	$.ajax("data/xws.json",{error:function(xhr,status,error) {
	    console.log("**Error loading xws.json\n"+status+" "+error);
	}}),
	$.ajax("data/strings.en.json",{error:function(xhr,status,error) {
	    console.log("**Error loading strings."+LANG+".json\n"+status+" "+error);
	}}),
	$.ajax("data/ratings.json",{error:function(xhr,status,error) {
	    console.log("**Error loading ratings.json\n"+status+" "+error);
	}}),
	$.ajax("data/countrycodes.json",{error:function(xhr,status,error) {
	    console.log("**Error loading countrycodes.json\n"+status+" "+error);
	}})
    ).done(function(result1,result2,result3,r4,r5,r6) {
	var process=setInterval(function() {
	    ATTACK[dice]=attackproba(dice);
	    DEFENSE[dice]=defenseproba(dice);
	    dice++;
	    if (dice==8) {
		fillprobatable();
		$("#showproba").prop("disabled",false);
		clearInterval(process);}
	},500);
	
	unitlist=result1[0];
	ENSHIP_translation=r4[0].ships;
	ENPILOT_translation=r4[0].pilots;
	ENUPGRADE_translation=r4[0].upgrades;
	SHIP_translation=result2[0].ships;
	PILOT_translation=result2[0].pilots;
	UPGRADE_translation=result2[0].upgrades;
	RATINGS_upgrades=r5[0].upgrades;
	RATINGS_ships=r5[0].ships;
	RATINGS_pilots=r5[0].pilots;
	CC = r6[0];

	UI_translation=result2[0].ui;
	CRIT_translation=result2[0].criticals;
	var css_translation=result2[0].css;
	var str="";

	if (LANG!="en") {
	    for (i in ENUPGRADE_translation) {
		var u=ENUPGRADE_translation[i];
		var v=UPGRADE_translation[i];
		var t=u.text;
		if (typeof v=="undefined") {
		    //console.log("no translation for "+i);
		    UPGRADE_translation[i]=u;
		}
	    }
	    for (i in ENPILOT_translation) {
		var u=ENPILOT_translation[i];
		var v=PILOT_translation[i];
		var t=u.text;
		if (typeof v=="undefined") {
		    //console.log("no translation for "+i);
		    PILOT_translation[i]=u;
		}
	    }
	}

	for (i in css_translation) {
	    str+="."+i+"::after { content:\""+css_translation[i]+"\";}\n";
	}
	$("#localstrings").html(str);

	UPGRADE_dict=result3[0].upgrades;
	PILOT_dict=result3[0].pilots;

	for (j in PILOT_dict) {
	    for (i=0; i<PILOTS.length; i++) 
		if (PILOTS[i].name==PILOT_dict[j]) PILOTS[i].dict=j;
	    for (i in unitlist) 
		if (i==PILOT_dict[j]) unitlist[i].dict=j;
	}
	for (i=0; i<UPGRADES.length; i++) {
	    u=UPGRADES[i];
	    if (u.type==Unit.TITLE) {
		unitlist[u.ship].hastitle=true;
	    }
	}

	/*Sanity check */
	for (i=0; i<PILOTS.length; i++) {
	    var found=false;
	    for (var j in PILOT_dict) 
		if (PILOTS[i].name==PILOT_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+PILOTS[i].name);
	}
	for (i=0; i<UPGRADES.length; i++) {
	    found=false;
	    for (var j in UPGRADE_dict) 
		if (UPGRADES[i].name==UPGRADE_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+UPGRADES[i].name);
	}

	var e=0;
	squadron=[];

	s.attr({width:"100%",height:"100%",viewBox:"0 0 914.4 914.4"});
	//TEAMS[1].selectrocks();
	//TEAMS[2].selectrocks();
	/*UPGRADES.sort(function(a,b) {
	    var an=a.name;
	    var bn=b.name;
	    if (typeof UI_translation[an]!="undefined"&&typeof UI_translation[an].name!="undefined") an=UI_translation[a.name].name;
	    if (typeof UI_translation[bn]!="undefined"&&typeof UI_translation[bn].name!="undefined") bn=UI_translation[b.name].name;
	    var u1=an+a.type;
	    var u2=bn+b.name;
	    return u1.localeCompare(u2);
	});
	PILOTS.sort(function(a,b) { 
		var d=a.points-b.points;
		if (d==0) return a.name.localeCompare(b.name);
		else return d;
	    });*/	

	var n=0,u=0,ut=0,ntot=0;
	var str="";
	for (i=0; i<PILOTS.length; i++) {
	    if (PILOTS[i].done==true) { if (PILOTS[i].unique) u++; n++; }
	    if (!PILOTS[i].done) { 
		if (PILOTS[i].unique) str+=", ."; else str+=", ";
		str+=PILOTS[i].name; 
	    }
	}
	console.log(n+"/"+PILOTS.length+" pilots with full effect");
	log(n+"/"+PILOTS.length+" pilots with full effect<br/>");
	if (str!="") log("Pilots NOT working yet:"+str+"<br/>");
	n=0;
	str="";
	for (i=0; i<UPGRADES.length; i++) {
	    if (UPGRADES[i].invisible) continue; 
	    if (UPGRADES[i].done==true) n++;
	    else str+=(str==""?"":", ")+(UPGRADES[i].unique?".":"")+UPGRADES[i].name;
	    ntot++;
	}
	$(".ver").html(VERSION);
	console.log(n+"/"+ntot+" upgrades with full effect");
	log(n+"/"+ntot+" upgrades with full effect<br/>");
	if (str!="") log("Upgrades NOT working yet:"+str+"<br/>");
	$("#showproba").prop("disabled",true);
	new Date();


	if (typeof localStorage.volume=="undefined") localStorage.volume=0.8;

	//Howler.volume(localStorage.volume);
	//$("#vol").val(localStorage.volume*100);

	var mc= new Hammer(document.getElementById('svgout'));
	mc.get("pinch").set({enable:true});
	mc.get('pan').set({direction:Hammer.DIRECTION_ALL});
	mc.on("panleft panright panup pandown",function(ev) {
	    if (ev.target.id!="svgout") return;
	    if (activeunit.dragged==true) return;
	    viewport_translate(ev.velocityX*50,ev.velocityY*50);
	});
	var tmpl = ["unit-creation","combat-display","unit-printable","unit-combat","upglist-creation","faction","usabletokens","selectweapon"];
	for (i in tmpl) {
	    TEMPLATES[tmpl[i]]=$("#"+tmpl[i]).html();
	    Mustache.parse(TEMPLATES[tmpl[i]]);  
	}

	$('body').on('mousedown', 'footer', function() {
            $(this).addClass('draggable').parents().on('mousemove', function(e) {
		$('.draggable').offset({
                    top: e.pageY - $('.draggable').outerHeight() / 2,
                    left: e.pageX - $('.draggable').outerWidth() / 2
		}).on('mouseup', function() {
                    $(this).removeClass('draggable');
		});
            });
            if (typeof e.preventDefault=="function") e.preventDefault();
	}).on("mouseup",function() {
	    $(".draggable").removeClass("draggable");
	});

	mc.zoom=1;
	mc.on("pinch",function(ev) {
	    if (ev.target.id!="svgout") { return;}
	    if (activeunit.dragged==true) return;
	    var vm=VIEWPORT.m.clone().invert();
	    var x=vm.x(ev.center.x,ev.center.y);
	    var y=vm.y(ev.center.x,ev.center.y);
	    VIEWPORT.m.translate(x,y).scale(ev.scale).scale(1/mc.zoom).translate(-x,-y);
	    mc.zoom=ev.scale;
	    VIEWPORT.transform(VIEWPORT.m);
	    activeunit.show();
	    if (ev.final) mc.zoom=1;
	});
	$("aside").on("scroll touchmove touchstart mousewheel", scrolloverflow);

	scenariomode(FREECOMBAT);	
	if (localStorage['mode']=="CREATION") {
	    delete localStorage['mode'];
	    page_creation();
	} else {
	    page_select();
	}
	var arg=LZString.decompressFromEncodedURIComponent(decodeURI(window.location.search.substr(1)));
	var args=[];
	if (arg!=null) args= arg.split('&');

	if (args.length>1) {
	    log("Loading permalink...");
	    ROCKDATA=args[2];
	    //phase=CREATION_PHASE;
	    TEAMS[1].parseASCII(args[0]);
	    TEAMS[1].toJSON(); // Just for points
	    if (args[1]=="") {
		TEAMS[3].parseASCII(args[0]);
		currentteam=TEAMS[3];
		currentteam.team=3;
		createsquad(currentteam.faction);
		for (var j in generics) {
		    var u=generics[j];
		    if (u.team==3) {
			for (var i in metaUnit.prototype) u[i]=metaUnit.prototype[i];
		    }
		}
	    } else {
		TEAMS[2].parseASCII(args[1]);
		TEAMS[2].toJSON(); // Just for points
		TEAMS[1].isia=false;
		TEAMS[2].isia=false;
		//console.log("player name and image:"+args[8]+"<>"+args[7]+"<>");
		if (args[3]=="true") TEAMS[1].isia=true;	
		else { 
		    //localStorage["playername"]=args[8];
		}
		if (args[4]=="true") TEAMS[2].isia=true;
		else { 
		    //localStorage["playername"]=args[8];
		}
		MOVING_ASTER=false;
		if (typeof args[5]!="undefined") {
		    var name=args[5];
		    if (name.substr(-1,1)=="!") {
			MOVING_ASTER=true;
			name=name.substr(0,name.len-1);
		    }
		    setSetup(name);
		}
		phase=SELECT_PHASE;
		HEADERS="";SCENARIOTITLE="";
		if (args.length>6&args[6]!="") { REPLAY=args[6]; }
		if (args.length>8) { HEADER=args[8]; SCENARIOTITLE=args[7]; }
		if (args.length>9) WINCOND=parseInt(args[9],10);
		else WINCOND=0;
		PERMALINK=LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+args[5]+"&&"+SCENARIOTITLE+"&"+HEADERS+"&"+WINCOND);
		return nextphase();
	    }
	}
	delete localStorage["imageplayer"];
	delete localStorage["playername"];
	phase=SELECT_PHASE;
	//nextphase();
	
	setSetup("Classic");

	SQUADLIST = new Squadlist("#squadlist");
	SQUADLIST.latest();
	SCENARIOLIST = new Scenariolist("#scenariolist");
	SCENARIOLIST.user();
	for (i in squadron) {
	    delete squadron[i];
	}
	$("#caroussel").hover(function() {
	    $(this).scrollLeft(10);
	});
	squadron=[];
	generics=[];
	TEAMS[3].changefaction(Unit.REBEL,true);
	var pilots=[];
	for (i=0; i<PILOTS.length; i++) {
	    var n=i;
	    var name=translate(PILOTS[i].name);
	    if (PILOTS[i].ambiguous==true
		&&typeof PILOTS[i].edition!="undefined") 
		name+="("+PILOTS[i].edition+")";
	    pilots.push(name.replace(/\'/g,"").replace(/\(Scum\)/g,""));
	}
	var upgrades=[];
	for (i in UPGRADE_translation) {
	    upgrades.push(' '+translate(i).replace(/\'/g,"").replace(/\(Crew\)/g,""));
	}
	$(".squadbg > textarea").asuggest(pilots, { 'delimiters': '^\n', 'cycleOnTab': true });
	$(".squadbg > textarea").asuggest(upgrades, { 'delimiters': '+', 'cycleOnTab':true});
	return true;
    });
});
function printunits() {
    var str="";
    var alltot=0;
    for (var i in generics) {
	var u=generics[i];
	if (u.team==currentteam.team) {
	    var tot=0;
	    for (var j in u.upgrades) {
		var upg=u.upgrades[j];
		if (typeof upg.points=="undefined") {
		    upg.points=u.points;
		    upg.name="Ship:"+u.ship.name;
		}
		tot+=parseInt(upg.points,10);
	    }
	    u.totpoints=tot;
	    alltot+=tot;
	    str+=Mustache.render(TEMPLATES["unit-printable"],u);
	}
    }
    $("#factionname").addClass(currentteam.faction.toUpperCase());
    $("#pointsname").html(alltot);
    $("#printunits").html(str);
}

/* 
   * Wes Janson FAQ
*/
var phase=1;
var subphase=0;
var round=1;
var skillturn=0;
var tabskill;
var VERSION="v0.9.1";
var LANG="en";
var ENGAGED=false;
var FILTER="none";
var DECLOAK_PHASE=1;
var DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];
var SETUP_PHASE=2,PLANNING_PHASE=3,ACTIVATION_PHASE=4,COMBAT_PHASE=5,SELECT_PHASE=1,CREATION_PHASE=6,XP_PHASE=7;
var BOMBS=[];
var ROCKDATA="";
var WINCOND=0;
var INREPLAY=false;
var allunits=[];
var PILOT_translation,SHIP_translation,CRIT_translation,UI_translation,UPGRADE_translation,PILOT_dict,UPGRADE_dict;
var actionr=[];
var actionrlock;
var HISTORY=[];
var replayid=0;
var dice=1;
var ATTACK=[]
var DEFENSE=[]
var SEARCHINGSQUAD;
var FACTIONS={"rebel":"REBEL","empire":"EMPIRE","scum":"SCUM"};
var SQUADLIST,SQUADBATTLE;
var COMBATLIST;
var TEAMS=[new Team(0),new Team(1),new Team(2)];
var currentteam=TEAMS[0];
var teamtarget=0;
var VIEWPORT;
var ANIM="";
var SETUP;
var SHOWDIAL=[];
var TRACE=false;
var TEMPLATES={"bomb":"","upgrade":"","weapon":"","social":""};
//var sl;
//var increment=1;
var UNIQUE=[];
var stype="";
var REPLAY="";
var PERMALINK="";
/*



    <script src="src/obstacles.js"></script>
    <script src="src/team.js"></script>
    <script src="src/units.js"></script>
    <script src="src/upgrades.js"></script>
    <script src="src/upgcards.js"></script>
    <script src="src/critical.js"></script>
    <script src="src/pilots.js"></script>
    <script src="src/iaunits.js"></script>
<script src="src/replay.js"></script>
<script src="src/proba.js"></script>
    <script src="src/xwings.js"></script>

		 <button onclick='$("#replay")[0].contentWindow.stopreplay();'>Stop</button>

*/
//jQuery.event.props.push('dataTransfer');

/*window.onerror = function(message, source, lineno, colno, error) {
    log("<b>ERROR: "+error+"</b>");
 };
*/
var SETUPS={
    "playzone":"M 0 0 L 900 0 900 900 0 900 Z",
    "zone1":"M 0 0 L 100 0 100 900 0 900 Z",
    "zone2":"M 800 0 L 900 0 900 900 800 900 Z",
    "asteroids":6,
     "Classic Map": {
	"name":"Classic",
	"background":"css/playmat10.jpg",
    },
    "Cloud City Map": {
	"name":"Cloud City",
	"background":"css/playmat6.jpg",
    },
    "Blue Sky Map": {
	"name":"Blue Sky",
	"background":"css/playmat13.jpg",
    },
    "Blue Planet Map": {
	"name":"Blue Planet",
	"background":"css/playmat11.jpg",
    },
    "Mars Map": {
	"name":"Mars",
	"background":"css/playmat14.jpg",
    }
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function changeimage(input) {
    if (input.files && input.files[0]) {
	var reader=new FileReader();
	reader.onload=function(e) {
	    var bb=ZONE[0].getBBox();
	    var BACKGROUND = s.image(e.target.result,0,0,bb.w,bb.h).pattern(0,0,bb.w,bb.h);
	    ZONE[0].attr({fill:BACKGROUND,fillOpacity:1});

	}
	reader.readAsDataURL(input.files[0]);
    }
}
//?GwdgXAHAjANAnAVngBgNxQEwygFgmECbBJONTGYJKAZmrwKRuBXTxho9kxrAxYhYyqAGQ0QlfBBCcSSALTDcRGtwycZkHLAwT5UCGhBwO2Chiw5kkKEkEnFaERgg4OJGPolocbjLEVsNBpkSk8DP1R5CA1wlxhyDygJBAkoNHl+GH4HWjsRADMAQwAbAGcAU0LSypEAYRKisrKASwBjESA#
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
    var min=Math.min(w/900.,h/900.);
    var x=startX+VIEWPORT.m.x(xx,yy)*min;
    var y=startY+VIEWPORT.m.y(xx,yy)*min
    var mm=VIEWPORT.m.invert();
    if (x<0||x>w) VIEWPORT.m=MT((-x+w/2-startX)/min,0).add(VIEWPORT.m);
    if (y<0||y>h) VIEWPORT.m=MT(0,(-y+h/2-startY)/min).add(VIEWPORT.m);

    VIEWPORT.transform(VIEWPORT.m);
    activeunit.show();
}
var AIstats = function(error,options, response) {
    if (typeof response.rows!="undefined") {
	//log("rows: "+response.rows.length);
    	for (var i=1; i<response.rows.length; i+=200) {
	    var scorec=0;
	    var n=0;
	    var median=0;
	    for (var j=1; j<200&&j+i<response.rows.length; j++) {
		var t=response.rows[i+j].cellsArray[0].split(" ");
		var ts1=t[0].split(":");
		var type1=ts1[0];
		var score1=ts1[1];
		var ts2=t[1].split(":");
		var type2=ts2[0];
		var score2=ts2[1];
		var scoreco=0;
		var scoreh=0;
		if (type2!=type1) {
		    if (type2=="Human") scoreh+=parseInt(score2,10);
		    else scoreco+=parseInt(score2,10);
		    if (type1=="Human") scoreh+=parseInt(score1,10);
		    else scoreco+=parseInt(score1,10);
		    median+=Math.floor((scoreco)/(scoreco+scoreh)*100);
		    n++;
		}
	    }
	    console.log(median/n);
	}
    }
}
var mk2split = function(t) {
    var tt=t.split("\.");
    var r=[];
    var missing=false;
    for (var i=1; i<tt.length; i++) {
	if (tt[i].match(/_II.*/)) { r.push(tt[i-1]+"."+tt[i]); tt[i]=null; missing=false;} 
	else { if (tt[i-1]) r.push(tt[i-1]); missing=true; }
    }
    if (missing) r.push(tt[tt.length-1]);
    return r;
}
var save=function() {
    movelog("W");
    var url="http://xws-bench.github.io/bench/?"+permalink(false);
    $(".social").html(Mustache.render(TEMPLATES["social"],{ 
	url:url,
	name:"save this link",
	encodedurl:encodeURI(url)}));
    if (typeof gapi!="undefined"&&typeof gapi.client.urlshortener!="undefined") {
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
var myCallback = function (error, options, response) {
   if (response!=null&&typeof response.rows!="undefined") {
       ga('send','event', {
	   eventCategory: 'interaction',
	   eventAction: 'battlelog',
	   eventLabel: 'battlelog',
	   eventValue:response.rows.length
       });

	//console.log("found "+response.rows.length);
	var t=SEARCHINGSQUAD,t1="",s1="";
	var tt=mk2split(t);
	for (var i=0; i<tt.length; i++) {
	    t1+=tt[i].replace(/\*/g," + ").replace(/_/g," ")+"<br>";
	    s1+=tt[i].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	}
	stype="";
	TEAMS[1].parseJuggler(s1,false);
	for (var i=1; i<response.rows.length; i++) {
	    myTemplate(i,response.rows[i].cellsArray,null,null);
	}
	SQUADBATTLE.columns.adjust().draw();
    }
};

var myTemplate = function(num,cells,cellarrays,labels) {
    var s="";
    var t=cells[0].split(" ");
    var ts1=t[0].split(":");
    var type1=ts1[0];
    var score1=ts1[1];
    var ts2=t[1].split(":");
    var type2=ts2[0];
    var score2=ts2[1];
    var squad=cells[1];
    var tt=squad.split("VS");
    var team1=mk2split(tt[0]);
    var team2=mk2split(tt[1]);
    var t1="",s1="";

    if (tt[0]==SEARCHINGSQUAD) { var sc=score2,ts=type2; team1=team2; score2=score1; type2=type1; score1=sc; type1=ts; }
    for (var j=0; j<team1.length-1; j++) {
	s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	t1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"<br>";
    }
    TEAMS[2].parseJuggler(s1,false);
    if (LANG!="en") {
	t1=TEAMS[2].toJuggler(true).replace(/\n/g,"<br>");
    }
    score1=""+score1;
    score2=""+score2;
    for (var i=0; i<3; i++) {
	if (score1.length<3) score1="0"+score1;
	if (score2.length<3) score2="0"+score2;
    }
    if (type2=="Human") score2="<b>"+score2+"</b>";
    if (type1=="Human") score1="<b>"+score1+"</b>";

    SQUADBATTLE.row.add([score2+"-"+score1,"<span onclick='$(\".replay\").attr(\"src\",\""+cells[2]+"\")'>"+t1+"</span>"]).draw(false);
}
var computeurl=function(error, options,response) {
    //console.log(error,options,response);
    var scoreh=0;
    var scorec=0;
    var n=0;
    var histogram=[];
    if (typeof response.rows!="undefined") {
    	for (var i=1; i<response.rows.length; i++) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    var team1=mk2split(tt[0]);
	    var team2=mk2split(tt[1]);
	    var s1="",s2="";

	    for (var j=0; j<team1.length-1; j++) {
		s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    }
	    try {
	    TEAMS[1].parseJuggler(s1,false);
	    for (var j=0; j<team2.length-1; j++) 
	    	s2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    TEAMS[2].parseJuggler(s2,false);
	    } catch (e) {
	    }
	    for (var j in generics) {
		if (typeof histogram[generics[j].pilotid]=="undefined") 
		    histogram[generics[j].pilotid]=0;
		histogram[generics[j].pilotid]++;
	    }
	    //console.log(TEAMS[1].toKey());

	    //var longurl = response.rows[i].cellsArray[2];
	    //var curl=longurl.split("?")[1];
	    //var arg=LZString.decompressFromEncodedURIComponent(decodeURI(curl));
	    //var args=[];
	    //args= arg.split('&');
	    //log(LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+args[2]+"&"+args[3]+"&"+args[4]+"&"+args[5]+"&"+args[6]));
	}
    }
    for (var i in histogram) {
	console.log(PILOTS[i].name+":"+histogram[i]);
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
	.replace(/%SLAM%/g,"<code class='symbols'>s</code>")
    ;
}
function displayplayertype(team,img) {
    var himg=localStorage["image"];
    var pimg=localStorage["imageplayer"];
    var hname=localStorage["name"];
    var name=localStorage["playername"];
    if (typeof name!="undefined") hname=name;
    if (typeof img!="undefined") himg=img; 
    if (typeof pimg!="undefined") himg=pimg; 
    if (typeof himg=="undefined") himg="css/human.png";
    if (!TEAMS[team].isia) {
	$("#player"+team+" option[value='human']").prop("selected",true); 
	$("#player"+team+"img").attr("src",himg);
	$("#player"+team+" option[value='human']").text(hname);
    } else {
	$("#player"+team+" option[value='computer']").prop("selected",true); 
	$("#player"+team+"img").attr("src","css/computer.png");
    } 
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
	active=last; 
	tabskill[skillturn][last].select();
	activenext();
    });
}
function endphase() {
    for (var i in squadron) squadron[i].endphase();
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
		 if (dead&&TEAMS[1].checkdead()&&TEAMS[2].checkdead()) win(0);
		 if (dead&&TEAMS[1].checkdead()) win(1);
		 if (dead&&TEAMS[2].checkdead())  win(2);
	     },
	     function() {
		 $("#attackdial").hide();
		 for (var i in squadron) squadron[i].endcombatphase();
		 log(UI_translation["No more firing units, ready to end phase."]);
		 barrier(endphase);
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
		 //activeunit.log("next activation");
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
    return FCH_CRIT*c+FCH_HIT*h;
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
    return $(".focusreddice").length*FCH_FOCUS+$(".criticalreddice").length*FCH_CRIT+$(".hitreddice").length*FCH_HIT;
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
    var dm=targetunit.getresultmodifiers(u.ar,u.ad,DEFENSE_M,ATTACK_M);
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
    var am=u.getresultmodifiers(u.ar,u.ad,ATTACK_M,ATTACK_M);
    if (am.length>0) {
	$("#atokens").append(am);
	$("#atokens").append($("<button>").addClass("m-done").click(function() {
	    $("#atokens").empty();
	    f();}.bind(u)));
    } else f();
}
function displaydefensetokens(u,f) {
    $("#dtokens").empty();
    var dm=activeunit.getresultmodifiers(u.dr,u.dd,ATTACK_M,DEFENSE_M);
    if (dm.length>0) {
	$("#dtokens").append(dm);
	//$("#dtokens td").click(function() { displaydefensetokens(u,f); });
	$("#dtokens").append($("<button>").addClass("m-done").click(function() {
	    displaydefensetokens2(u,f);
	}))
    } else displaydefensetokens2(u,f);
}
function displaydefensetokens2(u,f) {
    if (typeof f!="function") f=u.lastdf;
    u.lastdf=f;
    $("#dtokens").empty();
    var dm=u.getresultmodifiers(u.dr,u.dd,DEFENSE_M,DEFENSE_M);
    if (FAST) { 	    
	//$("#combatdial").hide(); 
	displaycompareresults(u,f);
	//f(); 
    } else {
	$("#dtokens").append(dm);
	$("#dtokens").append($("<button>").addClass("m-fire").click(function() {
	    //$("#combatdial").hide();
	    //f();
	    displaycompareresults(activeunit,f);
	}.bind(u)));
    }
}
function displaycompareresults(u,f) {
    if (typeof f!="function") f=u.lastdf;
    u.lastdf=f;
    $("#dtokens").empty();
    dm=u.getresultmodifiers(targetunit.dr,targetunit.dd,ATTACKCOMPARE_M,DEFENSE_M);
    am=u.getresultmodifiers(u.ar,u.ad,ATTACKCOMPARE_M,ATTACK_M);
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
function FE_focus(r) {
    return Math.floor(r/10)%10;
}
function FE_evade(r) {
    return r%10;
}
function FE_blank(r,n) {
    return n-FE_evade(r)-FE_focus(r);
}
function FCH_hit(r) {
    return r%10;
}
function FCH_focus(r) {
    return Math.floor(r/100)%10;
}
function FCH_crit(r) {
    return Math.floor(r/10)%10;
}
function FCH_blank(r,n) {
    return n-FCH_crit(r)-FCH_focus(r) - FCH_hit(r);
}
var FE_EVADE=1;
var FE_FOCUS=10;
var FCH_HIT=1;
var FCH_FOCUS=100;
var FCH_CRIT=10;

var UNITFILTER={};
var ACTIONFILTER={};
var MOVEFILTER={};
var TEXTFILTER="";
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
    log(TEXTFILTER);
    displayfactionunits(true);
}

function addroll(f,id,to) {
    if (to==DEFENSE_M) return addrolld(f,id);
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
    if (to==DEFENSE_M) return modrolld(f,id);
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
    if (to==ATTACK_M) {
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
	    for (i=0; i<FE_evade(r.roll); i++)
		$("#defense").append("<td class='evadegreendice'></td>");
	    for (i=0; i<FE_focus(r.roll); i++)
		$("#defense").append("<td class='focusgreendice'></td>");
	    for (i=0; i<FE_blank(r.roll,r.dice); i++)
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
	var n1=$("#squad1").attr("data-name");
	var n2=$("#squad2").attr("data-name");
	if (typeof n1=="undefined"||typeof n2=="undefined") {
	    ready=false;
	    $(".nextphase").prop("disabled",true);
	}
	break;
    case PLANNING_PHASE:
	for (i in squadron)
	    if (squadron[i].maneuver<0&&!squadron[i].isdocked) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) log(UI_translation["All units have planned a maneuver, ready to end phase"]);
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
	    if (ready&&$(".nextphase").prop("disabled")) log(UI_translation["All units have been activated, ready to end phase"]);
	}
	break;	
    }
    if (ready) $(".nextphase").prop("disabled",false);
    //log("ready "+ready);
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
    
    $(".victory").attr("class",title);
    var titl = (TEAMS[1].isia?"Computer":"Human")+":"+score1+" "+(TEAMS[2].isia?"Computer":"Human")+":"+score2;
    var note=TEAMS[1].toJuggler(false);
    note+="VS"+TEAMS[2].toJuggler(false);
    note=note.replace(/\n/g,".");
    note=note.replace(/ \+ /g,"*");
    note=note.replace(/ /g,"_");
    //console.log("note:"+encodeURI(note));
    var url=encodeURI("http://xws-bench.github.io/bench/index.html?"+permalink(false));
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
document.addEventListener("win",win,false);

function battlelog(t) {
    var row=SQUADLIST.row(t.parents("tr"));
    var data = row.data()[3];
    if (LANG!="en") TEAMS[0].parseJuggler(data,false);
    else TEAMS[0].parseJuggler(data,false);
    data=TEAMS[0].toJuggler(false);
    displaycombats(data);
    window.location="#battlelog";
}
function createsquad() {
    $(".activeunit").prop("disabled",true);
    $("#selectphase").hide();
    $("#addcomment").hide();
    ga('send','event', {
	eventCategory: 'interaction',
	eventAction: 'create',
	eventLabel: 'create'
    });
    phase=CREATION_PHASE;
    $("footer").hide();
    $('#consolecb').removeAttr('Checked');
    $(".nextphase").prop("disabled",false);
    currentteam.changefaction("REBEL");
    $(".factionselect selected").val("REBEL");
    $("#creation").show();
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
    $("#dialfilter").html(Unit.prototype.getdialstring.call(u));
    $("#dialfilter td[move]").click(function() { 
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
    for (var i in generics) {
	var u=generics[i];
	if (u.team==targetteam) {
	    currentteam.faction=u.faction;
	    break;
	}
    }
    displayfactionunits();
    for (var i in generics) {
	var u=generics[i];
	if (u.team==targetteam) {
	    currentteam.faction=u.faction;
	    log("adding one unit "+u.pilotid+" "+u.faction);
	    addunit(u.pilotid,u);
	    for (var j=0; j<u.upgradetype.length; j++) {
		var upg=u.upg[j];
		log("upgtype:"+j+" "+u.upgradetype[j]);
		if (upg>-1) {
		    log("upg "+UPGRADES[upg].name+" "+j+" "+u.upgradetype[j]);
		    addupgrade(u,upg,j);
		}
	    }
	}
    }
    log(TEAMS[1].toJuggler(false));
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
var mySpreadsheets=[
/*"https://docs.google.com/spreadsheets/d/1n35IFydakSJf9N9b9byLog2MooaWXk_w8-GQdipGe8I/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1Jzigt2slBhygjcylCsy4UywpsEJEjejvtCfixNoa_z4/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1dkvDxaH3mJhps9pi-R5L_ttK_EmDKUZwaCE9RZUYueg/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1IoViAKvpZFRlmzBXeY6S9jYX4Ju9ccL5boNxhLwUXiY/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1D2UbgrM6V7KJcRmyUQBxn5jxT-Nj8UGlpvLYlasH6TQ/edit#gid=0",
"https://docs.google.com/spreadsheets/d/15pAnwcBlp4l01eJgyNXW9uGu5jYDhxk3oSveBIQhJFc/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1P64wZXXV_3gJE0wdLTDWW2pdOliInCRlTXm1lgYNumc/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1zlqDnXJ9J-k4apP1DadPx_vdv6Asdp_b9QvaytKI9ek/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1hK3niJbtDIE8xxv-9vQGcqd5eQ1D6dP5hQ7GicDVh-A/edit#gid=0",*/
"https://docs.google.com/spreadsheets/d/1KR1uc7QgbiDkxCU5J1rm9qBMMjwKC0WyfAuDhnrbgAA/edit#gid=0"
];

function displayAIperformance() {
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadbattlediv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select B",// where C ends with '"+t+"' or C starts with '"+t+"'",
	    callback:AIstats,
	    rowTemplate:function () { return "";},
	    labels:["Score"]
	});
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


function recomputeurl() {
    $('#squadbattlediv').sheetrock({
	url: mySpreadsheets[0],
	query:"select C",
	callback:computeurl,
	rowTemplate:function () { return "";},
	labels:["ascii","short","long"]
    }); 
}
function displaycombats(t) {
    var s1=t;
    t=t.replace(/\n/g,".");
    t=t.replace(/ \+ /g,"*");
    //t=t.replace(/-/g,"\\-");
    t=t.replace(/ /g,"_");
    $(".replay").attr("src","");

    if (t.slice(-1)!=".") t=t+".";
    SEARCHINGSQUAD=t;
    //console.log("asking for "+t);

    var t1="";
    if (LANG!="en") {
	TEAMS[0].parseJuggler(s1,false);
	s1=TEAMS[0].toJuggler(true);
    }
    t1=s1.replace(/\n/g,"<br>");

    $("#battlingsquad").html(t1);
    SQUADBATTLE.clear().draw();;
 
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadbattlediv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select B,C,E where C contains '"+t+"'",
	    callback:myCallback,
	    fetchSize:100,
	    rowTemplate:function () { return "";},
	    labels:["Score","Squadlist","URL"]
	});
    }   
}
function dial2JSON(dial) {
    var m=[];
    var j,k;
    for (j=0; j<=5; j++) m[j]={item:"",moves:null};
    for (j=0; j<dial.length; j++) {
	d=dial[j];
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
function displayfactionunits(noreset) {
    var count=0;
    var n=0;
    var i,j,k;
    var faction=currentteam.faction;
    var p={};
    var t={};
    var uu=[];
    if (phase!=CREATION_PHASE) return;

    if (faction=="REBEL") $("#dialfilter td[move='SL3']").text(P['TRL3'].key).attr("move","TRL3"); else  $("#dialfilter td[move='TRL3']").text(P['SL3'].key).attr("move","SL3");

    for (i in unitlist) if (unitlist[i].faction.indexOf(faction)>-1) count++;

    //var tz = Math.round( ( 186 / 2 ) / Math.tan( Math.PI / count ) );
    if (noreset==true) $("#caroussel").html(""); else $(".caroussel").html("");
    //increment = 360. / count;
    var str;
    for (i=0; i<PILOTS.length; i++) {
	var u=PILOTS[i].unit;
	if (PILOTS[i].faction==faction) {
	    if (typeof p[u]=="undefined") p[u]=[];
	    /* should go elsewhere */
	    if (PILOTS[i].upgrades.indexOf(ELITE)>-1) PILOTS[i].haselite=true;
	    var text=getpilottexttranslation(PILOTS[i],faction);
	    if (text!="")
		text+=(PILOTS[i].done==true?"":"<div><strong class='m-notimplemented'></strong></div>");
	    PILOTS[i].tooltip=text;
	    PILOTS[i].trname=translate(PILOTS[i].name);
	    p[u].push(PILOTS[i]);
	    //PILOTS[i].pilotid=i;
	}
    }
    for (u in p) p[u].sort(function(a,b) { return a.points - b.points; });
    for (i=0; i<UPGRADES.length; i++) {
	var u=UPGRADES[i];
	if (u.type==TITLE) unitlist[u.ship].hastitle=true;
    }
    for (i in unitlist) 
	if (unitlist[i].faction.indexOf(faction)>-1) { 
	    unitlist[i].trname=SHIP_translation[i]; 
	    unitlist[i].name=i;
	    if (typeof unitlist[i].trname=="undefined") unitlist[i].trname=i;
	    uu.push(unitlist[i]);
	}
    uu.sort(function(a,b) { return a.trname > b.trname; });
    for (i=0; i<uu.length; i++) {
	str="";
	n++;
	var u=uu[i];
	var q=p[u.name];
	var filter=p[u.name][0].upgrades;
	var filtered=true;
	for (j in UNITFILTER)
	    if (filter.indexOf(j)==-1) filtered=false;
	for (j in ACTIONFILTER) 
	    if (u.actionList.indexOf(j)==-1) filtered=false;
	if (TEXTFILTER!="") {
	    q=[];
	    for (k in p[u.name]) {
		var v=p[u.name][k];
		var ttext=getpilottexttranslation(v,faction);
		var tname=translate(v.name);
		var r=new RegExp(TEXTFILTER,'i');
		if (ttext.match(r)||tname.match(r)) q.push(v);
	    }
	    if (q.length==0) filtered=false;
	}
	for (j in MOVEFILTER) {
	    var found=false;
	    for (k=0; k<u.dial.length; k++)
		if (u.dial[k].move==j) found=true;
	    if (!found) filtered=false;
	}
	if (filtered) {
	    var rendered=Mustache.render(TEMPLATES["faction"], {
		shipimg:u.img[0],
		fire:repeat('u',u.fire),
		evade:repeat('u',u.evade),
		hull:repeat('u',u.hull),
		shield:repeat('u',u.shield),
		diallist:dial2JSON(u.dial),
		shipname:u.trname,
		actionlist:function() {
		    var al=[];
		    for (j=0; j<u.actionList.length; j++) al[j]=A[u.actionList[j]].key;
		    return al;
		},
	hastitle:u.hastitle,
		shipupgrades:p[u.name][0].upgrades,
		pilots:q
	    });
	    $("#caroussel").append("<li>"+rendered+"</li>");	    
	}
    }
}
function selectweapon(weapons) {
    $("#attackdial").html(Mustache.render(TEMPLATES["selectweapon"],weapons)).show();
}
function getpilottexttranslation(u,faction) {
    var idxn=u.name+(faction=="SCUM"?" (Scum)":"");
    if (typeof u.edition!="undefined") {
	var i=u.name+"("+u.edition+")";
	if (typeof PILOT_translation[i]!="undefined"&&typeof PILOT_translation[i].text!="undefined") return formatstring(PILOT_translation[i].text);
    }
    if (typeof PILOT_translation[idxn]!="undefined"&&typeof PILOT_translation[idxn].text!="undefined") return formatstring(PILOT_translation[idxn].text);
    return "";
}
function getupgtxttranslation(name,type) {
    var v=name+(type==CREW?"(Crew)":"");
    if (typeof UPGRADE_translation[v]!="undefined") {
	/*var faq=UPGRADE_translation[v].faq;
	if (typeof faq=="undefined") faq=""; else faq="<div style='color:grey'><strong>FAQ:</strong>"+faq+"</div>";*/
	if (typeof UPGRADE_translation[v].text!="undefined") return formatstring(UPGRADE_translation[v].text);
    }
    return "";
}
function addunique(name) {
    UNIQUE[name]=true;
    for (var i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",true);
    }
    for (var i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",true);
    }
}
function removeunique(name) {
    UNIQUE[name]=false;
    for (var i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",false);
    }
    for (var i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",false);
    }
}
function addlimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",true);
}
function removelimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",false);
}
function addupgradeaddhandler(u) {
    $("#unit"+u.id+" button.upgrades").click(function(e) {
	var org=e.currentTarget.getAttribute("class").split(" ")[1];
	var num=e.currentTarget./*parentElement.*/getAttribute("num");
	var p=this.getupgradelist(org);
	$("#unit"+this.id+" .upgs .upgavail").hide();
	$("#unit"+this.id+" .upgs .upg").hide();
	//$("#unit"+this.id+" .upglist").append("<tr><td></td><td colspan='3'><input class='textfilter' type='search'></td></tr>");

	if (typeof this.upgbonus[org]=="undefined") this.upgbonus[org]=0;

	var q=[];
	for (var i=0; i<p.length; i++) {
	    var upg=UPGRADES[p[i]];
	    var disabled;
	    var attacks=[];
	    if (upg.invisible) continue;
	    disabled=(UNIQUE[upg.name]==true)
		||((upg.limited==true||this.exclupg[upg.type]==true)&&$("#unit"+this.id+" .upg tr[data="+p[i]+"]").length>0);
	    var pts=upg.points+this.upgbonus[org];
	    if (upg.points>0&&pts<0) pts=0;
	    var text=formatstring(getupgtxttranslation(upg.name,upg.type));
	    if (upg.done!=true) text+="<div><strong class='m-notimplemented'></strong></div>";
	    if (typeof upg.attack!="undefined") attacks=[{attack:upg.attack,lrange:upg.range[0],hrange:upg.range[1]}];
	    //log(pts+" "+text+" disabled"+disabled+" num"+num+" data"+p[i]+" name"+translate(upg.name)+" attacks"+attacks[0].attack);
	    q.push({
		pts:pts,
		tooltip:[text],
		text:text,
		isdisabled:disabled,
		num:num,
		data:p[i],
		name:translate(upg.name).replace(/\(Crew\)/g,""),
		attacks:attacks
	    });
	}
	$("#unit"+this.id+" .upglist").html(Mustache.render(TEMPLATES["upglist-creation"],{upglist:q}));

	$("#unit"+this.id+" .upglist button").click(function(e) {
	    var data=e.currentTarget.getAttribute("data");
	    var num=e.currentTarget.getAttribute("num");
	    $("#unit"+this.id+" .upgs .upgavail").show();
	    $("#unit"+this.id+" .upgs .upg").show();
	    addupgrade(this,data,num);
	}.bind(this));
    }.bind(u));
}
function addunit(n,u) {
    if (typeof u=="undefined") var u=new Unit(currentteam.team,n);
    $("#listunits").append("<li id='unit"+u.id+"'></li>");
    u.show();
    $("li#unit"+u.id).hover(function() { $(".highlighted").removeClass("highlighted"); 
					 $(this).addClass("highlighted"); },
			 function() { });
    if (u.unique==true) addunique(u.name);
    $("#unit"+u.id+" .close").click(function() {
	var data=$(this).attr("data");
	var u=generics["u"+data];
	$("#unit"+data+" .upg tr[data]").each(function() {
	    var d=$(this).attr("data");
	    if (UPGRADES[d].unique==true) removeunique(UPGRADES[d].name);
	});
	if (PILOTS[u.pilotid].unique==true) removeunique(u.name);
	$("#unit"+data).remove();
	delete generics["u"+data];
	currentteam.updatepoints();
    });
    $("#unit"+u.id+" .duplicate").click(function() {
	var data=$(this).attr("data");
	var u=generics["u"+data];
	var self=addunit(u.pilotid);
	$("#unit"+data+" .upg tr[data]").each(function() {
	    var d=$(this).attr("data");
	    var num=$(this).attr("num");
	    if (UPGRADES[d].unique!=true&&u.upgnocopy!=d) addupgrade(self,d,num);
	});
    });
    currentteam.updatepoints();
    addupgradeaddhandler(u);
    return u;
}
function addupgrade(self,data,num,noremove) {
    var org=UPGRADES[data];
    $("#unit"+self.id+" .upglist").empty();
    if (typeof org=="undefined") return;
    log("upgrade identified");
    if (org.unique==true) addunique(org.name);
    if (org.limited==true) addlimited(self,data);
    $("#unit"+self.id+" .upgavail span[num="+num+"]").css("display","none");
    var text=translate(org.name).replace(/\(Crew\)/g,"").replace(/\'/g,"");
    if (typeof self.upgbonus[org.type]=="undefined") self.upgbonus[org.type]=0;
    var pts=org.points+self.upgbonus[org.type];
    if (org.points>=0&&pts<0) pts=0;
    var tt="";
    var tttext=formatstring(getupgtxttranslation(org.name,org.type));
    if (tttext!="") tt="<div class='tooltip'>"+tttext+(org.done==true?"":"<div><strong class='m-notimplemented'></strong></div></div>");
    //log("adding to unit "+self.id);
    $("#unit"+self.id+" .upg").append("<tr data="+data+" num="+num+"><td><code class='upgrades "+org.type+"'></code></td><td>"+text+tt+"</td><td class='pts'>"+pts+"<button>-</button></td></tr>");
    //alert("is shown ?");
    self.upg[num]=data;
    Upgrade.prototype.install.call(org,self);
    if (typeof org.install!="undefined") org.install(self);
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();
    if (typeof noremove=="undefined") { 
	$("#unit"+self.id+" .upg tr[num="+num+"] button").click(function(e) {
	    var num=e.currentTarget.parentElement.parentElement.getAttribute("num");
	    var data=e.currentTarget.parentElement.parentElement.getAttribute("data");
	    $("#unit"+self.id+" .upglist").empty();
	    removeupgrade(self,num,data);
	}.bind(self));
    } else self.upgnocopy=data;

}
function removeupgrade(self,num,data) {
    var org=UPGRADES[data];
    $("#unit"+self.id+" .upgavail span[num="+num+"]").css("display","block");
    $("#unit"+self.id+" .upg tr[num="+num+"]").remove();
    if (org.unique==true) removeunique(org.name);
    if (org.limited==true) removelimited(self,data);
    self.upg[num]=-1;
    if (typeof org.uninstall!="undefined") {
	org.uninstall(self);
    }
    Upgrade.prototype.uninstall.call(org,self);
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();
}
function setselectedunit(n,td) {
    var jug=td; 
    currentteam=TEAMS[n];
    try {
	currentteam.parseJuggler(jug,true);
    } catch(e) {
	currentteam.parseJuggler(jug,false);
    }
    currentteam.name=currentteam.toASCII();
    currentteam.toJSON(); // Just for score
    addrow(n,currentteam.name,currentteam.points,currentteam.faction,currentteam.toJuggler(true));
}
function addrow(team,name,pts,faction,jug,fill,isselection) {
    if (team==1) {$("#squad1").val(jug); $("#squad1points").html(pts); $("#squad1").attr("data-name",name);}
    if (team==2) {$("#squad2").val(jug); $("#squad2points").html(pts); $("#squad2").attr("data-name",name);}
    if (isselection!=true) enablenextphase();
    var n=faction.toUpperCase();
    if (typeof localStorage[name]=="undefined"||fill==true)
	SQUADLIST.row.add(["",n,""+pts,jug,name,"",""]).draw(false);
}
//function addrowcombat(link,team1,team2,n) {
    //var clicks="https://api-ssl.bitly.com/v3/link/clicks?access_token=ceb626e1d1831b8830f707af14556fc4e4e1cb4c&link="+encodeURI(link);
    //$.when($.ajax(clicks)).done(function(result1) {
//    COMBATLIST.row.add(["",link,n,team1,team2]).draw(false);
    //});
//}

function endselection() {
    var team;
    $("#creation").hide();
    //$(".title").html("Squadron Benchmark");
    $("#selectphase").show();
    currentteam.name="SQUAD."+currentteam.toASCII();
    currentteam.toJSON();// Just for points
    var jug=currentteam.toJuggler(false);
    TEAMS[targetteam].parseJuggler(jug,false);
    if (typeof localStorage[currentteam.name]=="undefined") {
	localStorage[currentteam.name]=JSON.stringify({"pts":currentteam.points,"faction":currentteam.faction,"jug":jug,"rocks":currentteam.rocks});
    }
    addrow(targetteam,currentteam.name,currentteam.points,currentteam.faction,currentteam.toJuggler(true),true);
}
function removerow(t) {
    var row = SQUADLIST.row(t.parents("tr"));
    var data = row.data()[4];
    delete localStorage[data];
    row.remove().draw(false);
}

function checkrow(n,t) {
   var row=SQUADLIST.row(t.parents("tr"));
    var data = row.data()[3];
    var name=row.data()[4];
    if (name.match("SQUAD")) {
	TEAMS[n].setrocks($.parseJSON(localStorage[name]).rocks);
    }
    setselectedunit(n,data);
}
function importsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    currentteam.name="SQUAD."+currentteam.toASCII();
    var jug=currentteam.toJuggler(true);
    currentteam.toJSON(); // just for points
    localStorage[currentteam.name]=JSON.stringify({"pts":currentteam.points,"faction":currentteam.faction,"jug":currentteam.toJuggler(false)});
    addrow(t,currentteam.name,currentteam.points,currentteam.faction,jug);
}
function findsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    var jug=currentteam.toJuggler(false);
    var pattern=jug.replace(/ \+.*/g,"").replace(/\n/g,".*\.").replace(/ /g,"_");
    $('#squad'+t).sheetrock({
	url: mySpreadsheets[0],
	query:"select C where C matches '.*VS"+pattern+"'",
	callback:matchsquad,
	fetchSize:100,
	rowTemplate:function () { return "";},
	labels:["squad"]
    }); 
}
function matchsquad(error, options,response) {
    if (response!=null&&typeof response.rows!="undefined") {
	response.rows.sort(function(a,b) { return a.cellsArray[0]<b.cellsArray[0]; });
	var str="<ol>";
	var oldsquad="";
   	for (var i in response.rows) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    if (tt[1]==oldsquad) continue;
	    str+="<li>"+tt[1]+"</li>";
	    oldsquad=tt[1];
	}
	str+="</ol>";
    }
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
    $(".bigbutton2").prop("disabled",true);
    ZONE[1].remove();
    ZONE[2].remove();
    TEAMS[1].endsetup();
    TEAMS[2].endsetup();
    PERMALINK=permalink(true);
    $("#turnselector").append("<option value='0'>"+UI_translation["phase"+SETUP_PHASE]+"</option>");
    $(".playerselect").remove();
    $(".nextphase").prop("disabled",true);
    $(".unit").css("cursor","pointer");
    $("#positiondial").hide();
    for (var i=0; i<OBSTACLES.length; i++) OBSTACLES[i].unDrag();
    HISTORY=[];
}
function nextphase() {
    var i;
    $("#savebtn").hide();
    //log("nextphase "+phase);
    // End of phases
    //if (!enablenextphase()) return;
    window.location="#";
    switch(phase) {
    case SELECT_PHASE:
	$(".mainbutton").hide();
	$("#game").show();
	$("#selectphase").hide();
	$("#creation").hide();
	//$(".title").html("Squadron Benchmark");
	$("#rightpanel").show();
	$("#leftpanel").show();
	//for (var i in squadron) console.log("--squadron["+i+"]:"+squadron[i].name+" "+squadron[i].id);
	
 	break;
    case CREATION_PHASE:
	endselection();
	phase=SELECT_PHASE;
	return;
    case SETUP_PHASE: 
	if ($("#player1 option:checked").val()=="human") 
	    TEAMS[1].isia=false; else TEAMS[1].isia=true;
	if ($("#player2 option:checked").val()=="human") 
	    TEAMS[2].isia=false; else TEAMS[2].isia=true;
	if (TEAMS[1].isia==true) TEAMS[1].setia();
	if (TEAMS[2].isia==true) TEAMS[2].setia();
	ZONE[0].attr({fillOpacity:0});
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
    phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;
    movelog("P-"+round+"-"+(phase));
    if (phase==1) $("#phase").empty();
    else if (phase<3) $("#phase").html(UI_translation["phase"+phase]);
    else $("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
    $("#combatdial").hide();
    //if (phase>SELECT_PHASE) for (i in squadron) {squadron[i].unselect();}
    // Init new phase

    $(".nextphase").prop("disabled",false);
    setphase();
}
function setphase(cannotreplay) {
    $(".imagebg").hide();

    //log("setphase "+phase+" "+cannotreplay);
    switch(phase) {
    case SELECT_PHASE:
	$("#addcomment").hide();
	$(".mainbutton").show();
	$(".buttonbar .share-buttons").hide();
	$(".h2 .share-buttons").show();
	$(".permalink").hide();
	$(".activeunit").prop("disabled",true);
	$("#rightpanel").hide();
	$("#leftpanel").hide();
	$("#game").hide();
	$("#selectphase").show();
	$("#creation").hide();
	//$(".title").html("Squadron Benchmark");
	currentteam.setfaction("REBEL");
	$(".nextphase").prop("disabled",true);
	//window.location="#creation";
	break;
    case SETUP_PHASE:
	$(".imagebg").show();
	$("#addcomment").show();

	var t=["bomb","weapon","upgrade","social"];
	for (var i=0;i<t.length; i++) {
	    TEMPLATES[t[i]]=$("#"+t[i]).html();
	    Mustache.parse(TEMPLATES[t[i]]);
	}
	var name=localStorage.name;
	if (typeof name=="undefined"||name==null) name=UI_translation["human"];
	$("#player1").html("<option selected value='human'>"+name+"</option>");
	$("#player1").append("<option value='computer'>"+UI_translation["computer"]+"</option>");
	$("#player2").html("<option selected value='human'>"+name+"</option>");
	$("#player2").append("<option value='computer'>"+UI_translation["computer"]+"</option>");
	$("#player1").change(function() {
	    TEAMS[1].isia=!TEAMS[1].isia;
	    displayplayertype(1);
	});
	$("#player2").change(function() {
	    TEAMS[2].isia=!TEAMS[2].isia;
	    displayplayertype(2);
	});
	displayplayertype(1);
	displayplayertype(2);
	$(".bigbutton").show();
	$(".bigbutton2").prop("disabled",false);

	$(".buttonbar .share-buttons").show();
	$("#team2").css("top",$("nav").height()+2);
	$("#team1").css("top",$("nav").height()+2);
	$(".ctrl").css("display","block");
	
	ZONE[0]=s.path(SETUPS.playzone).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		id:'ZONE',
	        fillOpacity:0,
		pointerEvents:"none"
	    });
	$("#imagebg").change(function() {
	    changeimage(this);
	});
	if (SETUP.background!="") $(".playmat").css({background:"url("+SETUP.background+") no-repeat",backgroundSize:"100% 100%"});
	ZONE[0].appendTo(VIEWPORT);
	ZONE[1]=s.path(SETUPS.zone1).attr({
		fill: TEAMS[1].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[1].appendTo(VIEWPORT);
	ZONE[2]=s.path(SETUPS.zone2).attr({
		fill: TEAMS[2].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[2].appendTo(VIEWPORT);
	TEAMS[1].endselection(s);
	TEAMS[2].endselection(s);
	loadsound();

	if (TEAMS[1].points>TEAMS[2].points) TEAMS[2].initiative=true;
	else if (TEAMS[2].points>TEAMS[1].points) TEAMS[1].initiative=true;
	else TEAMS[1].initiative=true;
	if (TEAMS[1].initiative==true) log("TEAM #1 has initiative");
	else log("TEAM #2 has initiative");
	$(".activeunit").prop("disabled",false);
	var i;

	for (i in squadron) if (!squadron[i].isdocked) break;
	activeunit=squadron[i];
	activeunit.select();
	activeunit.show();

	var zoom=function(centerx,centery,z) {
	    var w=$("#svgout").width();
	    var h=$("#svgout").height();
	    var startX=0;
	    var startY=0;
	    if (h>w) startY=(h-w)/2;
	    else startX=(w-h)/2;
	    var max=Math.max(900./w,900./h);
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
	    activeunit.showpossiblepositions();
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
	jwerty.key("alt+f",function() { 
	    var s=""; 
	    for(i in activeunit.actionsdone) s+=activeunit.actionsdone[i]+" ";
	    activeunit.log("actions done:"+s);
	});
	jwerty.key("alt+d",function() { activeunit.resolvehit(1);});
	jwerty.key("alt+c",function() { activeunit.resolvecritical(1);});
	jwerty.key("alt+shift+d",function() { 
	    if (activeunit.hull<activeunit.ship.hull) activeunit.addhull(1); 
	    else if (activeunit.shield<activeunit.ship.shield) activeunit.addshield(1); 
	    activeunit.show();
	});

	if (SETUPS.asteroids>0) {
	    loadrock(s,ROCKDATA);
	}

	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".unit").css("cursor","move");
	$("#positiondial").show();
	$(".permalink").show();
	$("#savebtn").hide();
	if (cannotreplay!=true) startreplayall();
	break;
    case PLANNING_PHASE: 
	active=0;
	/* For actions of all ships */
	actionr = [$.Deferred().resolve()];
	/* For phase */
	actionrlock=$.Deferred().resolve();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").prop("disabled",true);
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
	$(".nextphase").prop("disabled",true);
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
    var himg=localStorage["image"];
    var name=localStorage["name"];
    if (typeof himg=="undefined") himg="";
    if (typeof name=="undefined") name="";
    return LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+SETUP.name+"&"+r+"&"+himg+"&"+name);
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
    case CREATION_PHASE: 
	phase=0; 
	document.location.search=""; 
	nextphase(); 
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
	str+=HISTORY[i].s+"_"+HISTORY[i].id+";"
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
	    var th=tohitproba(attacker,{},defender,ATTACK[i],DEFENSE[k],i,k);
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
		  reroll:0}
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
}
    var viewport_zoom=function(z) {
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var offsetX=activeunit.m.x(0,0);
	var offsetY=activeunit.m.y(0,0);
	var vm=VIEWPORT.m.clone().invert();
	var x=vm.x(offsetX,offsetY);
	var y=vm.y(offsetX,offsetY);

	VIEWPORT.m.translate(x,y).scale(z).translate(-x,-y);
	VIEWPORT.transform(VIEWPORT.m);
	activeunit.show();
    }
	var dragmove=function(event) {
	    if (activeunit.dragged==true) return;
	    var e = event; // old IE support
	    var x=e.offsetX,y=e.offsetY;
	    if (VIEWPORT.dragged) {
		var w=$("#svgout").width();
		var h=$("#svgout").height();
		var max=Math.max(900./w,900./h);
		var ddx=(e.offsetX-VIEWPORT.x0)*max;
		var ddy=(e.offsetY-VIEWPORT.y0)*max;
		VIEWPORT.dragMatrix=MT(ddx,ddy).add(VIEWPORT.m);
		VIEWPORT.dragged=true;
		$(".phasepanel").hide();
		VIEWPORT.transform(VIEWPORT.dragMatrix);
	    }
	}
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
    var id=event.target.id;
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
$(document).ready(function() {
    var i;
    s= Snap("#svgout")

    VIEWPORT = s.g().attr({id:"viewport"});
    VIEWPORT.m=new Snap.Matrix();
    FILTER = s.filter(Snap.filter.blur(5,5));
    P = { F0:{path:s.path("M 0 0 L 0 0"), speed: 0, key:"5"},
	  F1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"8"},
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
	  BR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"9"}, // 40 -92 (+/-14.14)
	  SR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"3"}, // 40 -92 (+/-14.14)
	  BR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"9"}, // 55 -126 (+/-14.14)
	  SR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"3"}, // 55 -126 (+/-14.14)
	  // Bank left
	  BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"7"}, // 24 -58 (+/-14.14)
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
	$(".menu ul").css({display:'block',visibility:'visible'})
    }).mouseout(function() {
	$('nav ul').css({display:'none',visibility:'hidden'})
    });

    var initgapi=function() {
        gapi.client.setApiKey('AIzaSyBN2T9d2ZuWaT0Vj6EanYb5IgWzLlhy7Zo');
        gapi.client.load('urlshortener', 'v1');
    }
    if (typeof gapi!="undefined") gapi.load('client', initgapi);
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
    }, {redirect_uri: 'http://xws-bench.github.io/bench/index.html'});
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
	}})
    ).done(function(result1,result2,result3,r4) {
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
	UI_translation=result2[0].ui;
	CRIT_translation=result2[0].criticals;
	var css_translation=result2[0].css;
	var str="";

	if (LANG!="en") {
	    for (i in ENUPGRADE_translation) {
		var u=ENUPGRADE_translation[i];
		var v=UPGRADE_translation[i];
		var t=u.text;
		if (typeof v=="undefined") UPGRADE_translation[i]=u;
	    }
	    for (i in ENPILOT_translation) {
		var u=ENPILOT_translation[i];
		var v=PILOT_translation[i];
		var t=u.text;
		if (typeof v=="undefined") {
		    PILOT_translation[i]=u;
		}
	    }
	}

	for (var i in css_translation) {
	    str+="."+i+"::after { content:\""+css_translation[i]+"\";}\n";
	}
	$("#localstrings").html(str);

	UPGRADE_dict=result3[0].upgrades;
	PILOT_dict=result3[0].pilots;

	for (var j in PILOT_dict) {
	    for (var i=0; i<PILOTS.length; i++) 
		if (PILOTS[i].name==PILOT_dict[j]) PILOTS[i].dict=j;
	    for (var i in unitlist) 
		if (i==PILOT_dict[j]) unitlist[i].dict=j;
	}
	/*Sanity check */
	
	for (var i=0; i<PILOTS.length; i++) {
	    var found=false;
	    for (var j in PILOT_dict) 
		if (PILOTS[i].name==PILOT_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+PILOTS[i].name);
	}
	for (var i=0; i<UPGRADES.length; i++) {
	    var found=false;
	    for (var j in UPGRADE_dict) 
		if (UPGRADES[i].name==UPGRADE_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+UPGRADES[i].name);
	}

	var r=0,e=0,i;
	squadron=[];

	s.attr({width:"100%",height:"100%",viewBox:"0 0 900 900"});
	TEAMS[1].setfaction("REBEL");
	TEAMS[2].setfaction("EMPIRE");
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
	log(n+"/"+PILOTS.length+" pilots with full effect");
	if (str!="") log("Pilots NOT implemented"+str);
	n=0;
	str="";
	for (i=0; i<UPGRADES.length; i++) {
	    if (UPGRADES[i].invisible) continue; 
	    if (UPGRADES[i].done==true) n++;
	    else str+=(str==""?"":", ")+(UPGRADES[i].unique?".":"")+UPGRADES[i].name;
	    ntot++;
	}
	$(".ver").html(VERSION);
	log(n+"/"+ntot+" upgrades with full effect");
	log("Upgrades NOT working yet:"+str);
	$("#showproba").prop("disabled",true);
	var d=new Date();

	if (typeof localStorage.volume=="undefined") localStorage.volume=0.8;
	if (typeof localStorage.image!="undefined") $("#profile-avatar").attr("src",localStorage.image);
	if (typeof localStorage.name!="undefined") $("#nameinput").val(localStorage.name); else $("#nameinput").val("Human");

	Howler.volume(localStorage.volume);
	$("#vol").val(localStorage.volume*100);

	var mc= new Hammer(document.getElementById('svgout'));
	mc.get("pinch").set({enable:true});
	mc.get('pan').set({direction:Hammer.DIRECTION_ALL});
	mc.on("panleft panright panup pandown",function(ev) {
	    if (ev.target.id!="svgout") {return;}
	    if (activeunit.dragged==true) return;
	    viewport_translate(-ev.velocityX*50,-ev.velocityY*50);
	});


	TEMPLATES["unit-creation"]=$("#unit-creation").html();
	Mustache.parse(TEMPLATES["unit-creation"]);  
	TEMPLATES["upglist-creation"]=$("#upglist-creation").html();
	Mustache.parse(TEMPLATES["upglist-creation"]);  
	TEMPLATES["faction"]=$("#faction").html();
	Mustache.parse(TEMPLATES["faction"]);  
	TEMPLATES["usabletokens"]=$("#usabletokens").html();
	Mustache.parse(TEMPLATES["usabletokens"]);  
	TEMPLATES["selectweapon"]=$("#selectweapon").html();
	Mustache.parse(TEMPLATES["selectweapon"]);  

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

    $("#squadbattle").html("<thead><tr><th><span class='m-score'></span></th><th><span class='m-opponent'></span></th></tr></thead>");
    SQUADBATTLE=$("#squadbattle").DataTable({
	"language": {
	    "search":UI_translation["Search"],
	    "lengthMenu": UI_translation["Display _MENU_ records per page"],
	    "zeroRecords": UI_translation["Nothing found - sorry"],
	    "info": UI_translation["Showing page _PAGE_ of _PAGES_"],
	    "infoEmpty": UI_translation["No records available"],
	    "infoFiltered": UI_translation["(filtered from _MAX_ total records)"]
	},
	"autoWidth": true,
	"scrollY": "20em",
	"scrollX":true,
	"deferRender": true,
	"scrollCollapse": true,
	"ordering":true,
	"processing":true,
	"info":true,
	"paging":         true});

	$('#squadbattle tbody').on('click','tr', function () {
            if ( $(this).hasClass('selected') ) {
		$(this).removeClass('selected');
            }
            else {
		$("#squadbattle tr.selected").removeClass("selected");
		$(this).addClass('selected');
            }
	} );

	var arg=LZString.decompressFromEncodedURIComponent(decodeURI(window.location.search.substr(1)));
	var args=[];
	if (arg!=null) args= arg.split('&');
	if (args.length>1) {
	    log("Loading permalink...");
	    ROCKDATA=args[2];
	    phase=CREATION_PHASE;
	    TEAMS[1].parseASCII(args[0]);
	    TEAMS[1].toJSON(); // Just for points
	    TEAMS[2].parseASCII(args[1]);
	    TEAMS[2].toJSON(); // Just for points
	    TEAMS[1].isia=false;
	    TEAMS[2].isia=false;
	    //console.log("player name and image:"+args[8]+"<>"+args[7]+"<>");
	    if (args[3]=="true") TEAMS[1].isia=true;	
	    else { 
		localStorage["imageplayer"]=args[7];
		localStorage["playername"]=args[8];
	    }
	    if (args[4]=="true") TEAMS[2].isia=true;
	    else { 
		localStorage["imageplayer"]=args[7];
		localStorage["playername"]=args[8];
	    }
	    SETUP=SETUPS[args[5]+" Map"];
	    phase=SELECT_PHASE;
	    if (args.length>6&args[6]!="") { REPLAY=args[6]; }
	    PERMALINK=LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+args[5]);
	    return nextphase();
	} else {
	    delete localStorage["imageplayer"];
	    delete localStorage["playername"];
	    phase=0;
	    nextphase();
	    if (localStorage.getItem("import")) {
		log("Importing from another Squad Builder...");
		if ($("#squad1").val()=="") currentteam=TEAMS[1];
		else currentteam=TEAMS[2];
		currentteam.parseJSON(sessionStorage.getItem("import"));
		sessionStorage.clear();
		endselection();
	    }

	    SETUP = SETUPS["Classic Map"];

	    $("#squadlist").html("<thead><tr><th></th><th>"+UI_translation["type"]+"</th><th><span class='m-points'></span></th><th><span class='m-units'></span></th><th></th><th></th><th></th></tr></thead>");
	    $.fn.dataTable.ext.search.push(
		function( settings, data, dataIndex ) {
		    return data[1].search(stype)>-1;
		}
	    );
	    var first=0;
	    SQUADLIST=$("#squadlist").DataTable({
		"language": {
		    "search":UI_translation["Search"],
		    "lengthMenu": UI_translation["Display _MENU_ records per page"],
		    "zeroRecords": UI_translation["Nothing found - sorry"],
		    "info": UI_translation["Showing page _PAGE_ of _PAGES_"],
		    "infoEmpty": UI_translation["No records available"],
		    "infoFiltered": UI_translation["(filtered from _MAX_ total records)"]
		},
		"autoWidth": true,
		"columnDefs": [
		    { "targets": [0],
		      "render":function() {
			  return "<span class='closemiddle' onclick='removerow($(this))'>&times;</span> "
		      },
		      "sortable":false
		    },
		    { "targets":[6],
		      "width":"2em",
		      "render":function() {
			  return "<span class='squadtop'><span class='squadmiddle' onclick='checkrow(1,$(this))'>1</span>&nbsp;<span class='squadmiddle right' onclick='checkrow(2,$(this))'>2</span></span>";
		      },
		      "sortable":false
		    },
		    { "targets":[5],
		      "render":function(d,c,row) {
			  return "<span class='logmiddle symbols' onclick='battlelog($(this));'>&#xE9;</span>";
		      },
		      "sortable":false
		    },
		    { "targets":[1],
		      "sortable":false,
		      "render":function(data,type,row) {
			  if (row[4].search("SQUAD")>-1)
			      return "<span style='display:none'>"+data+" USER</span><span class='"+data+"'></span>";
			  else if (row[4]=="ELITE") 
			      return "<span style='display:none'>"+data+" ELITE</span><span class='"+data+"'></span><span style='font-size:larger'></span><code style='color:orange' class='symbols'>ï</code>";
			  return "<span style='display:none'>"+data+" PREBUILT</span><span class='"+data+"'></span><code style='font-size:larger' class='symbols'>ì</code>";
			  
		      }
		    },
		    {
			"targets": [ 4 ],
			"visible": false,
			"searchable": false
		    },
		    {   "targets":[3],
			"render": function ( data, type, row ) {
			    if (LANG!="en"&&phase==SELECT_PHASE) 
				if (row[4].search("SQUAD")==-1) {
				    TEAMS[0].parseJuggler(data,false);
				    data=TEAMS[0].toJuggler(true);
				}
			    return data.replace(/\n/g,"<br>");
			}
		    }],   
		"ajax": "data/full4b.json",
		"scrollY":        "20em",
		"scrollCollapse": true,
		"deferRender": true,
		"ordering":true,
		"info":true,
		"paging":         true});

	    for (i in localStorage) {
		if (typeof localStorage[i]=="string"&&i.match(/SQUAD.*/)) {
		    //delete localStorage[i];
		    
		    var l=$.parseJSON(localStorage[i]);
		    if (typeof l.jug=="undefined"||typeof l.pts=="undefined")
			delete localStorage[i]
		    else {
			if (LANG!="en") { 
			    TEAMS[0].parseJuggler(l.jug,false); 
			    addrow(0,i,l.pts,l.faction,TEAMS[0].toJuggler(true),true); 
			} else {
			    addrow(0,i,l.pts,l.faction,l.jug,true);
			}
		    }
		}
	    }
	    $("#squadlist tr:first-child .squadtop").attr("data-intro","Select squad").attr("data-position","bottom");
	    $("#squadlist tr:first-child .logmiddle").attr("data-intro",'Battle log').attr("data-position",'left'); 
	}
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
    });
});

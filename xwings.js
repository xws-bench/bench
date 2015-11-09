var phase=1;
var subphase=0;
var round=1;
var skillturn=0;
var tabskill;
var VERSION="v0.6.99";
var LANG="en";
var DECLOAK_PHASE=1;
var SETUP_PHASE=2,PLANNING_PHASE=3,ACTIVATION_PHASE=4,COMBAT_PHASE=5,SELECT_PHASE=1,CREATION_PHASE=6;
var DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];
var BOMBS=[];
var ROCKDATA="";
var allunits=[];
var PILOT_translation,SHIP_translation,CRIT_translation,UI_translation,UPGRADE_translation,PILOT_dict,UPGRADE_dict;
var actionr=[];
var actionrlock;
var HISTORY=[];
var REPLAY=[];
var replayid=0;
var dice=1;
var ATTACK=[]
var DEFENSE=[]
var FACTIONS={"rebels":"REBEL","empire":"EMPIRE","scum":"SCUM"};
var SQUADLIST;
var TEAMS=[new Team(0),new Team(1),new Team(2)];
var currentteam=TEAMS[0];
var VIEWPORT;

Base64 = {
    _Rixits :
//   0       8       16      24      32      40      48      56     63
//   v       v       v       v       v       v       v       v      v
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_",
    fromNumber : function(number) {
        if (isNaN(Number(number)) || number === null ||
            number === Number.POSITIVE_INFINITY)
            throw "The input is not valid";
        if (number < 0)
            throw "Can't represent negative numbers now";

        var rixit; // like 'digit', only in some non-decimal radix 
        var residual = Math.floor(number);
        var result = '';
        while (true) {
            rixit = residual % 64
            result = this._Rixits.charAt(rixit) + result;
            residual = Math.floor(residual / 64);
            if (residual == 0) break;
	}
        return result;
    },
    toNumber : function(rixits) {
        var result = 0;
        rixits = rixits.split('');
        for (e in rixits) result = (result * 64) + this._Rixits.indexOf(rixits[e]);
        return result;
    },
    fromCoord: function(c) {	
	return Base64.fromNumber((Math.floor(c[0]+900)+(2000*Math.floor(c[1]+900))+(4000000*Math.floor(180+c[2]))));
    },
    toCoord: function(c) {
	var x=Base64.toNumber(c);
	var y=[x%2000-900,
	       Math.floor(x/2000)%2000-900,
	       Math.floor(x/4000000)-180];
	return y;
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
    var min=Math.min(w/900.,h/900.);
    var x=startX+VIEWPORT.m.x(xx,yy)*min;
    var y=startY+VIEWPORT.m.y(xx,yy)*min
    var mm=VIEWPORT.m.invert();
    if (x<0||x>w) VIEWPORT.m=MT((-x+w/2-startX)/min,0).add(VIEWPORT.m);
    if (y<0||y>h) VIEWPORT.m=MT(0,(-y+h/2-startY)/min).add(VIEWPORT.m);

    VIEWPORT.transform(VIEWPORT.m);
    activeunit.show();
}

function hitrangetostr(r) {
    var str="";
    var i,j,k,h;
    var wn=[];
    for (h=0; h<squadron.length; h++) if (squadron[h]==activeunit) break;
    for (i=1; i<=3; i++) {
	if (r[i].length>0) {
	    for (j=0; j<r[i].length; j++) {
		var k=r[i][j].unit;
		var sh=squadron[k];
		str+="<tr>";
		str+="<td class='tohit'>"+i+"</td>";
		str+="<td>"+sh.name+"</td>";		
		for (w=0; w<r[i][j].wp.length; w++) {
		    var wp=activeunit.weapons[w];
		    var p=activeunit.evaluatetohit(w,sh);
		    if (p==undefined) break;
		    var kill=p.tokill[sh.hull+sh.shield];
		    if (typeof kill=="undefined") kill=0; else 
			kill=Math.floor(kill*10000)/100;
		    // Add type to possible weapons
		    if (wn.indexOf(wp.type)==-1) wn.push(wp.type);
		    str+="<td class='probacell' style='background:hsl("+(1.2*(100-p.tohit))+",100%,80%)'";
		    if (phase==COMBAT_PHASE && skillturn==activeunit.skill&&activeunit.canfire()) str+=" onclick='activeunit.incombat=true; activeunit.declareattack("+w+",squadron["+k+"]); activeunit.resolveattack("+w+",squadron["+k+"])'>"; else str+=">";
		    str+="<div class='reddice'>"+activeunit.getattackstrength(w,sh)+"</div><div class='greendice'>"+sh.getdefensestrength(w,activeunit)+"</div>"
		    str+="<div>"+p.tohit+"%</div><div><code class='symbols' style='border:0'>d</code>"+p.meanhit+"</div><div><code class='symbols'  style='border:0'>c</code>"+p.meancritical+"</div><div>"+kill+"% kill</div>"
		    str+="</td>";
		}   
		str+="</tr>";
	    }
	}
    }
    if (str=="") { str="No unit in range of "+activeunit.name; 
		   activeunit.istargeting=false; }
    else {
	var s="";
	s="<table><tr><th>Range</th><th>Name</th>";
	for (i=0; i<wn.length; i++) {
	    s+="<th style='width:2em;border:0'><div class='"+wn[i]+"' style='width:100px;border:0;background:white;color:black'></div></th>"
	}
	str=s+"</tr>"+str+"</table>"
    }
    return str;
}
function inhitrange() {
    $("#listtitle").html("Units in weapon range of "+activeunit.name);
    $("#listunits").html(hitrangetostr(activeunit.gethitrangeallunits()));
    window.location="#modal";
}
function formatstring(s) {
    return s.replace(/%HIT%/g,"<code class='hit'></code>")
	.replace(/%ACTION%/g,"<b>Action:</b>")
	.replace(/%CRIT%/g,"<code class='critical'></code>")
	.replace(/%EVADE%/g,"<code class='symbols'>e</code>")
	.replace(/%FOCUS%/g,"<code class='symbols'>f</code>")
	.replace(/%BARRELROLL%/g,"<code class='symbols'>r</code>")
	.replace(/%TURNLEFT%/g,"<code class='symbols'>4</code>")
	.replace(/%TURNRIGHT%/g,"<code class='symbols'>6</code>")
	.replace(/%BOOST%/g,"<code class='symbols'>b</code>")
	.replace(/%BARRELROLL%/g,"<code class='symbols'>r</code>")
        .replace(/%ELITE%/g,"<code class='symbols'>E</code>")
 	.replace(/%BOMB%/g,"<code class='symbols'>B</code>")
	.replace(/%STRAIGHT%/g,"<code class='symbols'>8</code>")
        .replace(/%STOP%/g,"<code class='symbols'>5</code>")
        .replace(/%TARGETLOCK%/g,"<code class='symbols'>l</code>")
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
	.replace(/%CREW%/g,"<code class='symbols'>W</code>");
}
function unitstostr() {
    var s;
    var i,j;
    var sobj=["","",""];
    for (i=0; i<squadron.length; i++) {
	var sh=squadron[i];
	sobj[sh.team]+=sh;
    }
    s="<div id='squad1n'><div>Stats</div><div>Names</div><div>Ship</div><div>Points</div><div>Description</div></div>"+sobj[1]
	+"<div id='squad2n'><div>Stats</div><div>Names</div><div>Ship</div><div>Points</div><div>Description</div></div>"+ sobj[2];
    return s;
}
function allunitlist() {
    $("#listtitle").html("List of units");
    $("#listunits").html(unitstostr()); 
    window.location="#modal";
}
function nextunit(cando, changeturn,changephase,activenext) {
    var i,sk=false,last=0;
    for (i=0; i<tabskill[skillturn].length; i++) {
	if (cando(tabskill[skillturn][i])) { sk=true; last=i; break;} 
    };
    if (!sk) {
	do changeturn(tabskill);
	while (skillturn>=0 && skillturn<=12&& tabskill[skillturn].length==0);
    }
    if (skillturn==-1||skillturn==13) return changephase();
    active=last; 
    tabskill[skillturn][last].select();
    activenext();
}
function endphase() {
    for (var i=0; i<squadron.length; i++) squadron[i].endphase();
}
function nextcombat() {
    nextunit(function(t) { return t.canfire(); },
	     function(list) { 
		 var dead=false;
		 skillturn--;
		 for (i=0; i<list[skillturn+1].length; i++) {
		     var u=list[skillturn+1][i];
		     if (u.canbedestroyed(skillturn))
			 if (u.checkdead()) dead=true;
		 }
		 if (dead&&(TEAMS[1].checkdead()||TEAMS[2].checkdead())) win();
	     },
	     function() {
		 log(UI_translation["No more firing units, ready to end phase."]); 
		 for (var i=0; i<squadron.length; i++) squadron[i].endcombatphase();
		 barrier(endphase);
		 enablenextphase();
	     },
	     function() {
		 activeunit.beginattack();
		 activeunit.doattack(false);
	     });
}
function nextactivation() {
    nextunit(function(t) { return t.candomaneuver(); },
	     function() { skillturn++; },
	     function() { return enablenextphase(); },
	     function() {     
		 activeunit.beginactivation();
		 //activeunit.actionbarrier();
		 activeunit.doactivation();
	     });
}
function nextdecloak() {
    nextunit(function(t) { return t.candecloak(); },
	     function() { skillturn++; },
	     function() { return enablenextphase(); },
	     function() { activeunit.dodecloak(); });
}
function nextplanning() {
    nextunit(function(t) { return (t.maneuver==-1); },
	     function() { skillturn++; },
	     function() { return enablenextphase(); },
	     function() {
		 activeunit.select();
		 activeunit.doplan();
	     });
/*
    var current=active;
    for (var i=0; i<squadron.length; i++,active=(active+1)%squadron.length) {
	if (squadron[active].maneuver==-1) break;
    }
    if (squadron[active].maneuver>-1) { active=current; enablenextphase(); }
    else {
	log("PLANNING "+squadron[active].name);
	squadron[active].select();
	activeunit.doplan();
    }
*/
}
function addattackdie(type,n) {
    for (var i=0; i<n; i++) 
	$("#attack").append("<td class="+type+"reddice'></td>");
}
function adddefensedie(type,n) {
    for (var i=0; i<n; i++) 
	$("#defense").append("<td class="+type+"greendice'></td>");
}

function displayattackroll(m,n) {
    var i,j=0;
    $("#attack").empty();
    for (i=0; i<Math.floor(m/100)%10; i++,j++)
	$("#attack").append("<td class='focusreddice'></td>");
    for (i=0; i<(Math.floor(m/10))%10; i++,j++)
	$("#attack").append("<td class='criticalreddice'></td>");
    for (i=0; i<m%10; i++,j++)
	$("#attack").append("<td class='hitreddice'></td>");
    for (i=j; i<n; i++)
	$("#attack").append("<td class='blankreddice'></td>");
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
function addroll(f,n,id) {
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var t=f(100*foc+10*c+h,n);
    displayattackroll(t.m,t.n);
    $("#moda"+id).remove();
}
function addrolld(f,n,id) {
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var t=f(10*foc+e,n);
    displaydefenseroll(t.m,t.n);
    $("#modd"+id).remove();
}
function modroll(f,n,id) {
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var r=f(100*foc+10*c+h,n);
    displayattackroll(r,n);
    $("#moda"+id).remove();
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
    var change=function() { 
	if ($(this).hasClass("focusgreendice")) {
	    $(this).removeClass("focusgreendice"); $(this).addClass("evadegreendice");
	} else if ($(this).hasClass("blankgreendice")) {
	    $(this).removeClass("blankgreendice"); $(this).addClass("focusgreendice");
	} else if ($(this).hasClass("evadegreendice")) {
	    $(this).removeClass("evadegreendice"); $(this).addClass("blankgreendice");
	}
    }	//log("defense roll: f"+f+" e"+e+" b"+(dd-e-f));
    $(".focusgreendice").click(change);
    $(".evadegreendice").click(change);
    $(".blankgreendice").click(change);
}
function modrolld(f,n,id) {
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var r=f(10*foc+e,n);
    displaydefenseroll(r,n);
    $("#modd"+id).remove();
}
function reroll(n,forattack,type,id) {
    var i;
    var l;
    var m=0;
    var attackroll=["blank","focus","hit","critical"];
    var defenseroll=["blank","focus","evade"];
    if (forattack) {
	for (i=0; i<4; i++) {
	    var t=type;
	    type=Math.floor(type/10);
	    // Do not reroll focus
	    if (activeunit.canusefocus()&&activeunit.candofocus()&&i==1) continue;
	    if (t%10>=1) {
		l=$("."+attackroll[i]+"reddice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;n-=l.length;
		} else {
		    $("."+attackroll[i]+"reddice:lt("+n+"):not([noreroll])").remove();
		    m+=n;n=0;
		}
	    }
	}
	//console.log("rerolling "+m+" dices");
	$("#rerolla"+id).remove();
	var r=activeunit.rollattackdie(m);
	for (i=0; i<m; i++) {
	    $("#attack").prepend("<td noreroll='true' class='"+r[i]+"reddice'></td>");
	}
    } else { 
	for (i=0; i<3; i++) {
	    var t=type;
	    type=Math.floor(type/10);
	    // Do not reroll focus
	    if (targetunit.canusefocus()&&targetunit.candofocus()&&i==1) continue;
	    if (t%10>=1) {
		l=$("."+defenseroll[i]+"greendice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;n-=l.length;
		} else {
		    $("."+attackroll[i]+"greendice:lt("+n+"):not([noreroll])").remove();
		    m+=n;n=0;
		}
	    }
	}
	$("#rerolld"+id).remove();
	activeunit.defenseroll(m).done(function(r) {
	    var i;
	    for (i=0; i<activeunit.getevadegreendice(r); i++)
		$("#defense").prepend("<td noreroll='true' class='evadegreendice'></td>");
	    for (i=0; i<activeunit.getfocusgreendice(r); i++)
		$("#defense").prepend("<td noreroll='true' class='focusgreendice'></td>");
	    for (i=0; i<r-activeunit.getevadegreendice(r)-activeunit.getfocusgreendice(r); i++)
		$("#defense").prepend("<td noreroll='true' class='blankgreendice'></td>");
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
	var n=$("#squadlist tr.selected").length
	ready=(n==2);
	if (ready) ; //log("2 units selected for combat");
	else {   
	    $(".nextphase").prop("disabled",true);
	    //log("select 2 units for combat ("+n+" selected)");
	}
	break;
    case PLANNING_PHASE:
	for (i=0; i<squadron.length; i++)
	    if (squadron[i].maneuver<0&&!squadron[i].isdead) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) {
	    log(UI_translation["All units have planned a maneuver, ready to end phase"]);
	}
	break;
    case ACTIVATION_PHASE:
	if (subphase!=ACTIVATION_PHASE) {
	    subphase=ACTIVATION_PHASE; 
	    skillturn=0; 
	    ready=false;
	    for (i=0; i<squadron.length; i++) squadron[i].enddecloak().done(nextactivation);
	    barrier(nextactivation);
	} else {
	    for (i=0; i<squadron.length; i++)
		if (squadron[i].maneuver>-1&&!squadron[i].isdead) { ready=false; break; }
	    if (ready&&$(".nextphase").prop("disabled")) log(UI_translation["All units have been activated, ready to end phase"]);
	}
	break;	

    }
    if (ready) $(".nextphase").prop("disabled",false);
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

var keybindings={
    phase0:[],
    phase1:[],
    phase2:[
	{k:'t',f:function() { activeunit.turn(45);}},
	{k:"shift+t",f:function() {activeunit.turn(-45); }},
	{k:"b",f:function() { activeunit.turn(5);}},
	{k:"shift+b",f:function() { activeunit.turn(-5,0,0);}}],
    phase3:[
	{k:"m",f: function () { activeunit.nextmaneuver(); }},
	{k:"shift+m",f:function() {activeunit.prevmaneuver(); }}
    ],
    phase4:[],
    phase5:[{k:'enter',f:function() {inhitrange(); window.location='#modal' }}],
    action:[
	{k:"a", f:function() { 
	    if (!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn)   {
		activeunit.nextaction(); 
	    }
	}},
	{k:"shift+a", f:function() { 
	    if (!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn)  {
		activeunit.prevaction(); 
	    }
	}},
	{k:"enter",f:function() {
	    if (phase==ACTIVATION_PHASE&&!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn) {
		resolveaction();
	    }
	}}
    ],
    select:[
    ]
};

function win() {
    var title="";
    var i;
    if (TEAMS[1].checkdead()&&!TEAMS[2].checkdead()) title="Team #2 wins !";
    if (TEAMS[2].checkdead()&&!TEAMS[1].checkdead()) title="Team #1 wins !";
    if (TEAMS[1].checkdead()&&TEAMS[2].checkdead()) title="Draw !";
    $(".victory").html(title);
    var y1=0,y2=0;
    var t1=TEAMS[1].history;
    var t2=TEAMS[2].history;
    for (i=1; i<=round; i++) {
	var s1="",s2="";
	if (typeof t1.rawdata[i]!="undefined") { y1+=t1.rawdata[i].hits; s1=t1.rawdata[i].dead;}
	if (typeof t2.rawdata[i]!="undefined") {y2+=t2.rawdata[i].hits;s2=t2.rawdata[i].dead;}
	    t1.data[0].dataPoints.push({x:i,y:y1,indexLabelMaxWidth: "60",indexLabelWrap: "true", indexLabel:s1});
	t2.data[0].dataPoints.push({x:i,y:y2,indexLabelMaxWidth: "60",indexLabelWrap: "true", indexLabel:s2});
    }
    var chart1 = new CanvasJS.Chart("t1",TEAMS[1].history);
    var chart2 = new CanvasJS.Chart("t2",TEAMS[2].history);
    chart1.render();
    chart2.render();
    window.location="#modal";
}
document.addEventListener("win",win,false);

function createsquad() {
    $(".activeunit").prop("disabled",true);
    $("#selectphase").hide();
    phase=CREATION_PHASE;
    $(".nextphase").prop("disabled",false);
    currentteam.changefaction("REBEL");
    $("#factionselect selected").val("REBEL");
    $("#creation").show();
}
function addunit() {
    currentteam.addunit(0);
}
function displaysquad(n) {
    var s=$("#squad"+n).val();
    TEAMS[n].parseJSON(localStorage[s]);
    $("#display"+n).html(TEAMS[n].toJuggler());
    $("#displayxws"+n).html(JSON.stringify(TEAMS[n]));
    $("#faction"+n).attr("class",TEAMS[n].faction);
}

function makeGrid(points1,points2){    
    var dataLength = points1.length;
    var allData = points1.concat(points2);
    var maxValue = Math.max.apply(null, allData);
    var minValue = Math.min.apply(null, allData);
    if (maxValue > $('#svgLine').height()){ 
      $('#svgLine').height(maxValue+10);
    }
    
    // Creates the vertical lines in the graph
    for (var i=0; i<dataLength; i++) {
      var x = i*100;
      var xLine = s.line(x, minValue-10, x, maxValue+10).attr({
        stroke: "#ccc",
        strokeWidth: 0.25
      });
    }
    
    // Creates the horizontal lines in the graph
    var w = dataLength*100;
    var delimiter = 5;
    var values = (maxValue+10)-(minValue-10);
    var offset = ((maxValue+10)%delimiter);
    for (var i=values; i > 0; i--){
      if ((i-offset) % delimiter === 0){ // Change where lines appear by changing the delimiter (10 for every 10 units, 50 for 50, etc.)
        var yLine = s.line(0, i, w, i).attr({
          stroke: '#ccc',
          strokeWidth: 0.25
        });
      }
    }
  
  }
  
  function convertToPath(points){
    var path = '';
    
    for (var i=0; i<points.length; i++){
      var x = i*100;
      var y = -points[i]+$('#svgLine').height(); // Convert points to how we like to view graphs
      if (i===0){
        path += 'M'+x+','+y+' R';
      }
      else if (i===points.length-1){
        path += x+','+y;
      }
      else {
        path += x+','+y+',';
      }
    }
    return path;
  }
 
  function makePath(data, color){
    var pathString = convertToPath(data);
    var graphHeight = $('#svgLine').height();
    var fillString = pathString+' V'+graphHeight+' H0 Z';
    
    function getDefaultPath(isFill){
      var defaultPathString = 'M0,'+graphHeight+' H';
      
      
      for (var i=0; i<data.length; i++) {
        if (i!==0){ 
          defaultPathString += i*100+' ';
        }
      }
      
      if(isFill){
        defaultPathString += 'V'+graphHeight+' H0 Z';
      }
      return defaultPathString;
    }
    
    var path = s.path(getDefaultPath()).attr({
      stroke: color,
      strokeWidth: 2,
      fill: 'transparent'
    });
  
    var fill = s.path(getDefaultPath(true)).attr({
      fill: color,
      fillOpacity: 0.25    
    });
  
    path.animate({ path: pathString },500);
    fill.animate({ path: fillString },500);
    
  }
function endselection() {
    $("#creation").hide();
    $("#selectphase").show();
    currentteam.name="SQUAD."+currentteam.toASCII();
    localStorage[currentteam.name]=JSON.stringify(currentteam);
    SQUADLIST.row.add(["<span class='close'>&#xd7;</span>","<span class='player human'></span>","<span class='"+currentteam.faction+"'></span>",""+currentteam.points,"<pre>"+currentteam.toJuggler()+"</pre>",id]).draw(false);
    refreshsquadlist();
}
function refreshsquadlist() {
    $("#squadlist td").off("click");
    $("#squadlist td:first-child").click(function() { 
	var row = SQUADLIST.row($(this).parents("tr"));
	var data = row.data()[5];
	delete localStorage[data];
	row.remove().draw(); });
    $('#squadlist td:nth-child(n+2)').click(function () {
        $(this).parents("tr").toggleClass('selected');
	enablenextphase();
    } );
    enablenextphase();
}
function importsquad() {
    currentteam.parseJSON($("#importtext").val());
    currentteam.name="SQUAD."+currentteam.toASCII();
    localStorage[currentteam.name]=JSON.stringify(currentteam);
    SQUADLIST.row.add(["<span class='close'>&#xd7;</span>","<span class='player human'></span>","<span class='"+currentteam.faction+"'></span>",""+currentteam.points,"<pre>"+currentteam.toJuggler()+"</pre>",id]).draw(false);
    window.location="#";
    refreshsquadlist();
}
function startcombat() {
}
function bind(name,c,f) { $(document.body).bind('keydown.'+name,jwerty.event(c,f)); }
function unbind(name) { $(document.body).unbind('keydown.'+name); } 
function bindall(name) {
    var kb=keybindings[name];
    var j;
    for (j=0; j<kb.length; j++) {
	bind(name,kb[j].k,kb[j].f);
    }	    
}

function filltabskill() {
    tabskill=[];
    for (i=0; i<=12; i++) tabskill[i]=[];
    for (i=0; i<squadron.length; i++) tabskill[squadron[i].skill].push(squadron[i]);
}

var ZONE=[];

function nextphase() {
    var i;
    if (REPLAY.length==0) record("nextphase",phase);
    // End of phases
    //if (!enablenextphase()) return;
    window.location="#";
    switch(phase) {
    case SELECT_PHASE:	
	$("#game").show();
	$("#selectphase").hide();
	$("#creation").hide();
	$("#rightpanel").show();
	$("#leftpanel").show();
	$('#squadlist tr.selected').each(function(index) {
	    if (index<2) {
		TEAMS[index+1].parseJSON(localStorage[SQUADLIST.row($(this)).data()[5]]);
		if ($(this).find(".human").length>0) TEAMS[index+1].isia=false;
		else TEAMS[index+1].isia=true;
	    }
	} );
	break;
    case CREATION_PHASE:
	endselection();
	phase=SELECT_PHASE;
	return;
    case SETUP_PHASE: 
	ZONE[1].remove();
	ZONE[2].remove();
	TEAMS[1].endsetup();
	TEAMS[2].endsetup();
	$(".playerselect").remove();
	$(".nextphase").prop("disabled",true);
	$(".unit").css("cursor","pointer");
	$("#positiondial").hide();
	for (i=0; i<OBSTACLES.length; i++) OBSTACLES[i].g.undrag();
	HISTORY=[];
	if (REPLAY.length>0) {
	    replayid=0;
	    for (var i=0; i<this.squadron.length; i++) 
		$.extend(this.squadron[i],ReplayUnit.prototype);

	}
	break;
    case PLANNING_PHASE:
	$("#maneuverdial").hide();
	break;
    case ACTIVATION_PHASE:
	$("#activationdial").hide();
	for (i=0; i<squadron.length; i++) {
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
	for (i=0; i<squadron.length; i++) squadron[i].endround();
	round++;
	break;
    }
    phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;
 
    if (phase<3) $("#phase").html(UI_translation["phase"+phase]);
    else $("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
    $("#combatdial").hide();
    if (phase>SELECT_PHASE) for (i=0; i<squadron.length; i++) {squadron[i].unselect();}
    // Init new phase
    for (i=SELECT_PHASE; i<=COMBAT_PHASE; i++) {
	if (i!=phase) unbind("phase"+i);
	else bindall("phase"+i);
    }
    $(".nextphase").prop("disabled",false);
    switch(phase) {
    case SELECT_PHASE:
	$(".permalink").hide();
	$(".activeunit").prop("disabled",true);
	$("#rightpanel").hide();
	$("#leftpanel").hide();
	$("#game").hide();
	$("#selectphase").show();
	$("#creation").hide();
	currentteam.setfaction("REBEL");
	$(".nextphase").prop("disabled",true);
	//window.location="#creation";
	break;
    case SETUP_PHASE:
	$("#team2").css("top",$("nav").height()+2);
	$("#team1").css("top",$("nav").height()+2);
	$(".ctrl").css("display","block");
	ZONE[3]=s.rect(0,0,900,900).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		fillOpacity: 0,
		id:'ZONE',
		pointerEvents:"none"
	    });
	ZONE[3].appendTo(VIEWPORT);
	ZONE[1]=s.rect(0,0,100,900).attr({
		fill: TEAMS[1].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[1].appendTo(VIEWPORT);
	ZONE[2]=s.rect(800,0,100,900).attr({
		fill: TEAMS[2].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[2].appendTo(VIEWPORT);
	TEAMS[1].endselection(s);
	TEAMS[2].endselection(s);

	$(".activeunit").prop("disabled",false);
	activeunit=squadron[0];
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

	jwerty.key('l', allunitlist);
	jwerty.key('w', inhitrange);
	jwerty.key("x", function() { window.location="#";});
	jwerty.key("escape", nextphase);
	jwerty.key("c", center);
	/* By-passes */
	jwerty.key("0", function() { console.log("active:"+activeunit.name+" pending actions:"+waitingforaction.isexecuting+" can fire:"+activeunit.canfire()+" has damaged:"+activeunit.damage+" m:"+activeunit.maneuver+" a:"+activeunit.action+" skillturn"+skillturn+" faction"+activeunit.faction); });
	jwerty.key("9", function() { 
		console.log("active:"+activeunit.name+" in hit range:"+activeunit.weapons[0].name);
		var w=activeunit.weapons[0];
		for (var i=0; i<squadron.length; i++) {
		    console.log("      "+squadron[i].name+":"+w.getrange(squadron[i]));
		}
	    });
	jwerty.key("p",function() {
	    activeunit.showpossiblepositions();
	});
	jwerty.key("shift+p",function() {
	    $(".possible").remove();
	});
	jwerty.key("1", function() { activeunit.focus++;activeunit.show();});
	jwerty.key("2", function() { activeunit.evade++;activeunit.show();});
	jwerty.key("3", function() { if (!activeunit.iscloaked) {activeunit.iscloaked=true;activeunit.agility+=2;activeunit.show();}});
	jwerty.key("4", function() { activeunit.stress++;activeunit.show();});
	jwerty.key("5", function() { activeunit.ionized++;activeunit.show();});
	jwerty.key("shift+1", function() { if (activeunit.focus>0) activeunit.focus--;activeunit.show();});
	jwerty.key("shift+2", function() { if (activeunit.evade>0) activeunit.evade--;activeunit.show();});
	jwerty.key("shift+3", function() { if (activeunit.iscloaked) {activeunit.iscloaked=false;activeunit.agility-=2;activeunit.show();}});
	jwerty.key("shift+4", function() { if (activeunit.stress>0) activeunit.stress--;activeunit.show();});
	jwerty.key("shift+5", function() { if (activeunit.ionized>0) activeunit.ionized--;activeunit.show();});
	jwerty.key("f",function() { activeunit.doattack(true);});
	jwerty.key("d",function() { activeunit.resolvecritical(1);});
	jwerty.key("shift+d",function() { 
	    if (activeunit.hull<activeunit.ship.hull) activeunit.hull++; 
	    else if (activeunit.shield<activeunit.ship.shield) activeunit.shield++; 
	    activeunit.show();
	});
	loadrock(s,ROCKDATA);
	if (OBSTACLES.length>0) showrock();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".unit").css("cursor","move");
	$("#positiondial").show();
	bindall("select");
	$(".permalink").show()
	break;
    case PLANNING_PHASE: 
	active=0;
	/* For actions of all ships */
	actionr = [$.Deferred().resolve()];
	/* For phase */
	actionrlock=$.Deferred().resolve();
	//$(".permalink").hide();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").prop("disabled",true);
	$("#maneuverdial").show();
	squadron[0].select();
	skillturn=0;
	filltabskill();
	for (i=0; i<squadron.length; i++) {
	    //squadron[i].evaluatepositions(false,false);
	    squadron[i].newm=squadron[i].m;
	    squadron[i].beginplanningphase().progress(nextplanning);
	}
	nextplanning();
	break;
    case ACTIVATION_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").prop("disabled",true);
	$("#activationdial").show();
	for (i=0; i<squadron.length; i++) squadron[i].beginactivationphase().done(nextdecloak);
	
	filltabskill();
	//subphase=ACTIVATION_PHASE;
	subphase=DECLOAK_PHASE;
	skillturn=0;
	barrier(nextdecloak);
	break;
    case COMBAT_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$("#attackdial").show();
	skillturn=12;
	for (i=0; i<squadron.length; i++) squadron[i].begincombatphase().done(nextcombat);
	
	barrier(nextcombat);
	break;
    }
}
function barrier(f) {
    $.when.apply(null,actionr).done(f);
}
function log(str) {
    $("#log").append("<div>"+str+"<div>");
    $("#log").scrollTop(10000);
}
function permalink() {
    var s="?"+TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+history_toASCII();
    document.location.search = s;
}
function resetlink() {
    document.location.search="";
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
function select(name) {
    var i;
    for (i=0; i<squadron.length; i++) {
	if (squadron[i].id==name) break;
    }
    squadron[i].select();
    $("#"+u.id).attr({color:"black",background:"white"});
    $("#"+activeunit.id).attr({color:"white",background:"tomato"});
}

var a1 = [];
a1[0]=2/8; // blank
a1[1]=3/8; // hit
a1[10]=1/8; // crit
a1[100]=2/8; // focus
var d1 = [];
d1[0]=3/8; // blank
d1[1]=3/8; // evade
d1[10]=2/8; // focus

// Add one dice to already existing roll of n dices
function addattackdice(n,proba) {
    var f,c,h,i;
    var p=[];
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++)
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
		p[i+1]=0;
		p[i+10]=0;
		p[i+100]=0;
	    }
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++) 
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]+=proba[i]*a1[0];
		p[i+1]+=proba[i]*a1[1];
		p[i+10]+=proba[i]*a1[10];
		p[i+100]+=proba[i]*a1[100];
	    }
    return p;
}
function adddefensedice(n,proba) {
    var f,e,i;
    var p=[];
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]=0;
	    p[i+1]=0;
	    p[i+10]=0;	   
	}
    }
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]+=proba[i]*d1[0];
	    p[i+1]+=proba[i]*d1[1];
	    p[i+10]+=proba[i]*d1[10];
	}
    }
    return p;
}

function attackproba(n) {
    var i;
    var proba=[];
    proba[0]=a1[0];
    proba[1]=a1[1];
    proba[10]=a1[10];
    proba[100]=a1[100];
    for (i=2; i<=n; i++) {
	proba=addattackdice(i,proba);
    }

    return proba;
}
function defenseproba(n) {
    var i;
    var proba=[];
    proba[0]=d1[0];
    proba[1]=d1[1];
    proba[10]=d1[10];
    for (i=2; i<=n; i++) {
	proba=adddefensedice(i,proba);
    }
    return proba;
}
function attackwithreroll(tokensA,at,attack) {
    var f,h,c,f2,h2,c2,i,j,b;
    var p=[];
    if (tokensA.reroll==0) return at;
    if (typeof tokensA.reroll=="undefined") return at;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++)
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
	    }
    var newf=0, r;
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++) 
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		b=attack-h-c-f; // blanks
		r=tokensA.reroll;
		newf=f;
		if (tokensA.reroll>b) { // more reroll than blanks
		    if (tokensA.focus==0) {
			if (tokensA.reroll>f+b) { // more rerolls than blanks+focus
			    r=f+b;
			    newf=0; // no more focus in results
			} else newf=f-(r-b);
		    } else r=b;
		} 
		//log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
		if (r==0) p[i]+=at[i];
		else {
		    var tot=0;
		    for (f2=0; f2<=r; f2++) 
			for (h2=0; h2<=r-f2; h2++)
			    for (c2=0; c2<=r-f2-h2; c2++) {
				j=100*f2+h2+10*c2;
				k=100*(newf+f2)+h+h2+10*(c+c2);
				p[k]+=at[i]*ATTACK[r][j];
//				if (tokensA.reroll>0) log(attack+" at["+f+" "+h+" "+c+"]:"+at[i]+"*A["+r+"]["+f2+" "+h2+" "+c2+"]:"+ATTACK[r][j]);
			    }
		}
	    }
    return p;
}
function defendwithreroll(tokensD,dt,defense) {
    var f,e,f2,e2,i,j,b;
    var p=[];
    if (tokensD.reroll==0) return dt;
    if (typeof tokensD.reroll=="undefined") return dt;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=defense; f++) for (e=0; e<=defense-f; e++) p[10*f+e]=0;
    var newf=0, r;
    for (f=0; f<=defense; f++) 
	for (e=0; e<=defense-f; e++) {
	    i=10*f+e;
	    b=defense-e-f; // blanks
	    r=tokensD.reroll;
	    newf=f;
	    if (tokensD.reroll>b) { // more reroll than blanks
		if (tokensD.focus==0) {
		    if (tokensD.reroll>f+b) { // more rerolls than blanks+focus
			r=f+b;
			newf=0; // no more focus in results
		    } else newf=f-(r-b);
		} else r=b;
	    } 
	    //log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
	    if (r==0) p[i]+=dt[i];
	    else {
		for (f2=0; f2<=r; f2++) 
		    for (e2=0; e2<=r-f2; e2++) {
			j=10*f2+e2;
			k=10*(newf+f2)+e+e2;
			p[k]+=dt[i]*DEFENSE[r][j];
		    }
	    }
	}
    return p;
}

function tohitproba(tokensA,tokensD,at,dt,attack,defense) {
    var p=[];
    var k=[];
    var f,h,c,d,fd,e,i,j,hit,evade;
    var tot=0,mean=0,meanc=0;
    var ATable=at;
    var DTable=dt;
    var rr=tokensA.reroll;
    var dt=(defense==0)?[]:dt;
    for (h=0; h<=attack; h++) {
	for (c=0; c<=attack-h; c++) {
	    i=h+10*c;
	    p[i]=0;
	}
    }
    
    if (typeof ATable=="undefined") return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    ATable=attackwithreroll(tokensA,at,attack);
    //log("Attack "+attack+" Defense "+defense);
    if (defense>0) DTable=defendwithreroll(tokensD,dt,defense);
    for (j=0; j<=20; j++) { k[j]=0; }
    for (f=0; f<=attack; f++) {
	for (h=0; h<=attack-f; h++) {
	    for (c=0; c<=attack-h-f; c++) {
		var n=100*f+10*c+h;
		var fa,ca,ha,ff,e;
		var a=ATable[100*f+h+10*c]; // attack index
		if (typeof tokensA.modifyattackroll!="undefined")
		    n=tokensA.modifyattackroll(n,tokensD);
		fa=Math.floor(n/100);
		ca=Math.floor((n-100*fa)/10);
		ha=n-100*fa-10*ca;
		for (ff=0; ff<=defense; ff++) {
		    for (ef=0; ef<=defense-ff; ef++) {
			var fd;
			var m=10*ff+ef
			if (typeof tokensD.modifydefenseroll!="undefined") 
			    m=tokensD.modifydefenseroll(m);
			fd=Math.floor(m/10);
			evade=m-10*fd;
			if (defense==0) d=1; else d=DTable[m]
			hit=ha;
			i=0;
			if (tokensD.evade>0) { evade+=1; }
			if (tokensD.focus>0) { evade+=fd; }
			if (tokensA.focus>0) { hit+=fa; }
			if (hit>evade) { i = hit-evade; evade=0; } 
			else { evade=evade-hit; }
			if (ca>evade) { i+= 10*(ca-evade); }
			p[i]+=a*d;
		    }
		}
	    }
	}
    }
    for (h=0; h<=attack; h++) {
	for (c=0; c<=attack-h; c++) {
	    i=h+10*c;
	    if (c+h>0) tot+=p[i];
	    //log("c"+c+" h"+h+" "+p[i]);
	    mean+=h*p[i];
	    meanc+=c*p[i];
	    // Max 3 criticals leading to 2 damages each...Proba too low anyway after that.
	    switch(c) {
	    case 0:
		for(j=1; j<=c+h; j++) k[j]+=p[i];
		break;
	    case 1:
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33;
		for(j=2; j<=c+h+1; j++) k[j]+=p[i]*7/33;
		break;
	    default: 
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33*(32-7)/32;
		for (j=2; j<=c+h+1; j++) k[j]+=p[i]*(7/33*(1-6/32)+(1-7/33)*7/32);
		for (j=3; j<=c+h+2; j++) k[j]+=p[i]*7/33*6/32;
	    }
	}
    }
    return {proba:p, tohit:Math.floor(tot*10000)/100, meanhit:tot==0?0:Math.floor(mean * 100) / 100,
	    meancritical:tot==0?0:Math.floor(meanc*100)/100,tokill:k} ;
}

function probatable(attacker,defender) {
    var i,j;
    var str="";
    for (i=0; i<=5; i++) {
	str+="<tr><td>"+i+"</td>";
	for (j=0; j<=5; j++) {
	    var k=j;
	    if (defender.adddice>0) k+=defender.adddice;
	    var th=tohitproba(attacker,defender,ATTACK[i],DEFENSE[k],i,k);
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

$(document).ready(function() {
    s= Snap("#svgout")
    VIEWPORT = s.g().attr({id:"viewport"});
    VIEWPORT.m=new Snap.Matrix();

    P = { F0:{path:s.path("M 0 0 L 0 0").attr({display:"none"}), speed: 0, key:"5"},
	  F1:{path:s.path("M 0 0 L 0 -80").attr({display:"none"}), speed: 1, key:"8"},
	  F2:{path:s.path("M 0 0 L 0 -120").attr({display:"none"}), speed: 2, key:"8"},
	  F3:{path:s.path("M 0 0 L 0 -160").attr({display:"none"}), speed: 3, key:"8"},
	  F4:{path:s.path("M 0 0 L 0 -200").attr({display:"none"}), speed: 4, key:"8"},
	  F5:{path:s.path("M 0 0 L 0 -240").attr({display:"none"}), speed: 5, key: "8" },
	  // Turn right
	  TR1:{path:s.path("M0 0 C 0 -40 15 -55 55 -55").attr({display:"none"}), speed: 1, key:"6"},// 35 -35
	  TR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83").attr({display:"none"}), speed:2, key:"6"},// 63 -63
	  TR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105").attr({display:"none"}), speed:3, key:"6"}, // 85 -85
	  TRR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105").attr({display:"none"}), speed:3, key:";"}, // 85 -85
	  // Turn left
	  TL1:{path:s.path("M0 0 C 0 -40 -15 -55 -55 -55").attr({display:"none"}), speed:1, key:"4"}, // -35 -35
	  TL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83").attr({display:"none"}), speed:2, key:"4"},// -63 -63
	  TL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105").attr({display:"none"}), speed:3, key:"4"}, // -85 -85
	  TRL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105").attr({display:"none"}), speed:3, key:":"}, // -85 -85
	  // Bank right
	  BR1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92").attr({display:"none"}), speed:1, key:"9"}, // 24 -58 (+/-14.14)
	  BR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126").attr({display:"none"}), speed:2, key:"9"}, // 40 -92 (+/-14.14)
	  SR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126").attr({display:"none"}), speed:2, key:"3"}, // 40 -92 (+/-14.14)
	  BR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160").attr({display:"none"}), speed:3, key:"9"}, // 55 -126 (+/-14.14)
	  SR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160").attr({display:"none"}), speed:3, key:"3"}, // 55 -126 (+/-14.14)
	  // Bank left
	  BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92").attr({display:"none"}), speed:1, key:"7"}, // 24 -58 (+/-14.14)
	  BL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126").attr({display:"none"}), speed:2, key:"7"}, // 40 -92 (+/-14.14)
	  SL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126").attr({display:"none"}), speed:2, key:"1"}, // 40 -92 (+/-14.14)
	  BL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160").attr({display:"none"}), speed:3, key:"7"}, // 55 -126 (+/-14.14)
	  SL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160").attr({display:"none"}), speed:3, key:"1"}, // 55 -126 (+/-14.14)
	  // K turns (similar to straight line, special treatment in move function)
	  K1:{path:s.path("M 0 0 L 0 -80").attr({display:"none"}), speed: 1, key:"2"},
	  K2:{path:s.path("M 0 0 L 0 -120").attr({display:"none"}), speed: 2, key:"2"},
	  K3:{path:s.path("M 0 0 L 0 -160").attr({display:"none"}), speed: 3, key:"2"},
	  K4:{path:s.path("M 0 0 L 0 -200").attr({display:"none"}), speed: 4, key:"2"},
	  K5:{path:s.path("M 0 0 L 0 -240").attr({display:"none"}), speed: 5, key: "2" }
	};
    // Load unit data
    $.ajaxSetup({beforeSend: function(xhr){
	if (xhr.overrideMimeType)
	    xhr.overrideMimeType("application/json");
    }});
    var availlanguages={"en":"🇬🇧","fr":"🇫🇷"};
    var language = localStorage['LANG'] || window.navigator.userLanguage || window.navigator.language;
    if (typeof availlanguages[language.substring(0,2)]!="undefined") LANG=language.substring(0,2);
    for (var i in availlanguages) {
	$("#language").append("<option value='"+i+"'"+(i==LANG?"selected":"")+">"+availlanguages[i]+"</option>");
    }
    $("#language").change(function() { 
	LANG=$(this).val();
	log("change for language "+LANG);
	$.ajax("data/strings."+LANG+".json",{
	    success:function(data) {
		localStorage['LANG']=LANG;
		log("reloading "+LANG);
		location.reload();
	    }}); 
    });
    $.when(
	$.ajax("data/ships.json"),$.ajax("data/strings."+LANG+".json"),$.ajax("data/xws.json")
    ).done(function(result1,result2,result3) {
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
	SHIP_translation=result2[0].ships;
	PILOT_translation=result2[0].pilots;
	UPGRADE_translation=result2[0].upgrades;
	UI_translation=result2[0].ui;
	CRIT_translation=result2[0].criticals;
	var css_translation=result2[0].css;
	var str="";
	for (var i in css_translation) {
	    log("css:"+i);
	    str+="."+i+"::after { content:\""+css_translation[i]+"\";}\n";
	}
	$("#localstrings").html(str);
	var factions=["rebel","empire","scum"];
	for (var i in factions) {
	    var f=UI_translation[factions[i]];
	    $(".factionselect").append("<option value='"+factions[i].toUpperCase()+"'>"+f+"</option>");
	}
	UPGRADE_dict=result3[0].upgrades;
	PILOT_dict=result3[0].pilots;
	var r=0,e=0,i;
	squadron=[];

	s.attr({width:"100%",height:"100%",viewBox:"0 0 900 900"});
	TEAMS[1].setfaction("REBEL");
	TEAMS[2].setfaction("EMPIRE");
	UPGRADES.sort(function(a,b) {
	    var u1=a.name+a.type;
	    var u2=b.name+b.name;
	    return u1.localeCompare(u2);
	});
	PILOTS.sort(function(a,b) { 
		var d=a.points-b.points;
		if (d==0) return a.name.localeCompare(b.name);
		else return d;
	    });
	var n=0,u=0,ut=0;
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
	    if (UPGRADES[i].done==true) n++;
	    else str+=", "+(UPGRADES[i].unique?".":"")+UPGRADES[i].name;
	}
	$(".ver").html(VERSION);
	log(n+"/"+UPGRADES.length+" upgrades implemented");
	log("Upgrades NOT implemented"+str);
	$("#showproba").prop("disabled",true);


	var d=new Date();
	for (i=0; i<d.getMinutes(); i++) Math.random();
	loadsound();
	var mousewheel=function(t,event) {
	    var min=$("nav").height()+2;
	    var e = event.originalEvent; // old IE support
	    //var delta = Math.max(-100, Math.min(100, (e.wheelDelta || -e.detail)));
	    var top=parseInt($("#team1").css("top"),10);//+delta;
	    
	};
	var scrolloverflow=function(event) {
	    var id=event.target.id;
	    $("#"+id+" .outoverflow").each(function(index) { 
		    if ($(this).css("top")!="auto") {
			$(this).css("top",$(this).parent().offset().top+"px");
		    }
		    });
	}
	var mc= new Hammer(document.getElementById('svgout'));
	mc.get("pinch").set({enable:true});
	mc.get('pan').set({direction:Hammer.DIRECTION_ALL});
	mc.on("panleft panright panup pandown",function(ev) {
	    if (ev.target.id!="svgout") {return;}
	    if (activeunit.dragged==true) return;
	    viewport_translate(-ev.velocityX*50,-ev.velocityY*50);
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

	var args= window.location.search.substr(1).split('&');
	if (args.length>1) {
	    log("Loading permalink...");
	    ROCKDATA=args[2];
	    phase=CREATION_PHASE;
	    TEAMS[1].parseASCII(args[0]);
	    TEAMS[2].parseASCII(args[1]);
	    if (args.length>3) REPLAY=args[3].split(";");
	    phase=SELECT_PHASE;
	    return nextphase();
	} else {
	    phase=0;
	    nextphase();
	    var newt;
	    newt="<thead><tr><th></th><th></th><th><span class='m-faction'></span></th><th><span class='m-points'></span></th><th><span class='m-units'></span></th><th></th></tr></thead>";
	    for (i in localStorage) {
		if (typeof localStorage[i]=="string"&&i.match(/SQUAD.*/)) {
		    //delete localStorage[i];
		    TEAMS[0].parseJSON(localStorage[i]);
		    newt+="<tr>"
		    newt+="<td><span class='close'>&#xd7;</span></td>";
		    newt+="<td><span class='player human'></span></td>";
		    newt+="<td><span class='"+TEAMS[0].faction+"'></span></td>";
		    newt+="<td>"+TEAMS[0].points+"</td>";
		    newt+="<td><pre>"+TEAMS[0].toJuggler()+"</pre></td>";			
		    newt+="<td>"+i+"</td></tr>";		
	    }
	    }
	    $("#squadlist").html(newt);
	    SQUADLIST=$("#squadlist").DataTable({ 
		"language": {
		    "search":UI_translation["Search"],
		    "lengthMenu": UI_translation["Display _MENU_ records per page"],
		    "zeroRecords": UI_translation["Nothing found - sorry"],
		    "info": UI_translation["Showing page _PAGE_ of _PAGES_"],
		    "infoEmpty": UI_translation["No records available"],
		    "infoFiltered": UI_translation["(filtered from _MAX_ total records)"]
		},
		"columnDefs": [
		    {
			"targets": [ 5 ],
			"visible": false,
			"searchable": false
		    }],       
		"scrollY":        "20em",
		"scrollCollapse": true,
		"ordering":true,
		"info":true,
		"paging":         false});
	    $("#squadlist td:first-child").click(function() { 
		var row = SQUADLIST.row($(this).parents("tr"));
		var data = row.data()[5];
		delete localStorage[data];
		row.remove().draw(); });
	    $("#squadlist td:nth-child(2)").click(function() { 
		$(this).children().toggleClass('human'); });
	    $('#squadlist td:nth-child(n+3)').click(function () {
		$(this).parents("tr").toggleClass('selected');
		enablenextphase();
	    } );
	    
	}
	/*md = new Hammer(document.getElementById('leftpanel'));
	  md.get('pan').set({direction:Hammer.DIRECTION_VERTICAL});
	  md.on("panup pandown",function(ev) {
	  log(ev.type);
	  });*/
    });
});

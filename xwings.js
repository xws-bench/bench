var phase=0;
var skillturn=0;
var waitingforaction=false;
var tabskill;
var SETUP_PHASE=0,PLANNING_PHASE=1,ACTIVATION_PHASE=2,COMBAT_PHASE=3;

function center(unit) {
    var bbox=unit.g.getBBox();
    $("#playmat").scrollLeft(bbox.x-window.innerWidth/2+bbox.width/2);
    $("#playmat").scrollTop(bbox.y-window.innerHeight/2+bbox.height/2);
}

function prevselect() {
    if(waitingforaction) { return; }
    var old=activeunit;
    if (phase==ACTIVATION_PHASE||phase==COMBAT_PHASE) {
	if (skillturn==-1) return;
	active=(active==0)?tabskill[skillturn].length-1:active-1;
	tabskill[skillturn][active].select();
    } else { 
	active=(active==0)?squadron.length-1:active-1; 
	squadron[active].select();
    }
    old.unselect() ;
}
function nextselect() {
    if (waitingforaction) { return; }
    var old=activeunit;
    if (phase==ACTIVATION_PHASE||phase==COMBAT_PHASE) {
	if (skillturn==-1) return;
	active=(active==tabskill[skillturn].length-1)?0:active+1;
	tabskill[skillturn][active].select();
    } else {
	console.log("activate "+active+"/"+squadron.length);
	active=(active==squadron.length-1)?0:active+1;
	squadron[active].select();
    }
    old.unselect() ; 
}
function unittostr(sh) {
    str="<td>"+sh.name+"</td><td>";
    str+="<p class='statskill'>"+sh.skill+"</p>";
    str+="<p class='statfire'>"+sh.ship.fire+"</p>";
    str+="<p class='statevade'>"+sh.ship.evade+"</p>";
    str+="<p class='stathull'>"+sh.hull+"</p>";
    str+="<p class='statshield'>"+sh.shield+"</p>";
    str+="</td><td>";
    if (sh.focus>0) { str+="<b title='"+sh.focus+" focus token' onclick='usefocus()' class='focustoken'></b>"; }
    if (sh.evade>0) { str+="<b title='"+sh.evade+" evade token' onclick='useevade()' class='evadetoken'></b>"; }
    if (sh.target>0) { str+="<b title='targeting "+sh.targeting+"' onclick='usetarget()' class='targettoken'></b>"; }
    if (sh.stress>0) { str+="<b title='"+sh.stress+" stress token' onclick='usestress()' class='stresstoken'></b>"; }
    str+="</td>";
    return str;
}
function hitrangetostr(r,hit) {
    var str="";
    var i,j,k;
    for (i=1; i<=3; i++) {
	if (r[i].length>0) {
	    for (j=0; j<r[i].length; j++) {
		if (hit) {
		    var p=activeunit.evaluatetohit(r[i][j]);
		    if (p==undefined) break;
		} 
		var sh=r[i][j];
		for (k=0; k<squadron.length; k++) if (squadron[k]==sh) break;
		str+="<tr><td><p>"+i+"</p></td>";
		str+=unittostr(sh);
		if (hit) {
		    str+="<td>"+p.tohit
			+"</td><td>"+p.meanhit
			+"</td><td>"+p.meancritical
			+"</td><td>"+(Math.round(p.tokill[r[i][j].hull+r[i][j].shield]*10000)/100)+"</td><td>";
		    if (phase==COMBAT_PHASE && skillturn==activeunit.skill)
			str+="<a href='#combatmodal' onclick=\"$('#attacker').html(unittostr(activeunit)); $('#defender').html(unittostr(squadron["+k+"])); resolvecombat("+k+")\" class='button2'>Fire!</a>";			
		    str+="</td>";
		}   else if (activeunit.istargeting&&activeunit.ship.faction!=squadron[k].ship.faction) 
		    str+="<td><a href='#' onclick=\"activeunit.resolvetarget("+k+");\" class='button2'>Target!</a></td>";

		str+="</tr>";
	    }
	}
    }
    if (str=="") { str="No unit in range of "+activeunit.name; 
		   activeunit.istargeting=false; }
    else {
	var head="<table style='display:block;font-size:6px;width:100%'><tr><th>Range</th><th>Name</th><th>Stats</th><th>Tokens</th>";
	if (hit) head+="<th>% to hit</th><th>avg. dmg</th><th>avg. crit.</th><th>% to kill</th>";
	str=head+"<th></th></tr>"+str+"</table>";
    }
    return str;
}
function resolvecombat(k) {
    console.log("Resolve combat for "+activeunit.name);
    targetunit=squadron[k];
    activeunit.resolvefire();
}
function inrange() {
    $("#listtitle").html("Units in range of "+activeunit.name);
    $("#listunits").html(hitrangetostr(activeunit.getrangeallunits(), false));
}
function inhitrange() {
    $("#listtitle").html("Units in primary weapon range of "+activeunit.name);
    $("#listunits").html(hitrangetostr(activeunit.gethitrangeallunits(), true));
}
function help() {
    $("#listtitle").html("This is the help page");
    $("#listunits").html("");
}
function unitstostr() {
    var s;
    var i,j;
    var sobj={REBEL:"",EMPIRE:""};
    for (i=0; i<squadron.length; i++) {
	var sh=squadron[i];
	var str="";
	str+="<tr><td><p class='"+sh.ship.faction+"'></p></td>";
	str+=unittostr(sh);
	str+="</tr>";
	sobj[sh.ship.faction]+=str;
    }
    s="<table style='display:block;font-size:6px;width:100%'><tr><th></th><th>Names</th><th>Stats</th><th>Points</th><th>Tokens</th></tr>"+sobj["REBEL"]+sobj["EMPIRE"]+"</table>";
    return s;
}
function allunitlist() {
    $("#listtitle").html("List of units");
    $("#listunits").html(unitstostr()); 
}
function usefocus() {
    activeunit.focus--;
    activeunit.show();
    var l=$(".focusreddice").length;
    $(".focusreddice").remove();
    for (i=0; i<l; i++) { 	
	$("#attack").append("<b class='hitreddice'></b>");
    }
}
function usetarget() {
    if (targetunit==activeunit.targeting) {
	var l=$(".blankreddice").length;
	$(".blankreddice").remove();
	activeunit.target--;
	activeunit.show();
	targetunit.istargeted--;
	targetunit.show();
	if(activeunit.focus==0) {
	    l+=$(".focusreddice").length;
	    $(".focusreddice").remove();
	}
	reroll(l,true);
    }
}
function tusetarget() {
}
function tusefocus() {
    targetunit.focus--;
    targetunit.show();
    var l=$(".focusgreendice").length;
    $(".focusgreendice").remove();
    for (i=0; i<l; i++) { 	
	$("#defense").append("<b class='evadegreendice'></b>");
    }
}
function tuseevade() {
    targetunit.evade--;
    targetunit.show();
    $("#defense").append("<b class='evadegreendice'></b>");
}
function nextcombat() {
    var i,sk=0,last=0;
    var old=activeunit;
    console.log("Begin nextfire");
    while (sk==0 && skillturn>=0) {
	for (i=0; i<tabskill[skillturn].length; i++) {
	    if (tabskill[skillturn][i].canfire()) { sk++; last=i; break;} 
	};
	if (sk==0) { 
	    console.log("no more fire for units of skill "+skillturn);
	    skillturn--;
	    while (skillturn>=0 && tabskill[skillturn].length==0) { skillturn--; }
	} 
    }
    if (skillturn==-1) { return; }
    sk=tabskill[skillturn].length;
    console.log("found "+sk+" firing units of skill "+skillturn);
    active=last; 
    tabskill[skillturn][last].select();
    activeunit.show();
    old.unselect();
    console.log("SHOWING "+activeunit.name);
    activeunit.showtarget=true;
    console.log("End nextcombat "+activeunit.name);
    // More than one ? Select manually
    //if (sk>1) { bindall("select"); }
    //bindall("phase3");
    //if (sk==1) { activeunit.resolvefire(); }
}
function nextactivation() {
    var sk=0,last=0,i;
    if (skillturn>12) { return; }
    // Counts how many remaining units with same skill
    for (i=0; i<tabskill[skillturn].length; i++) {
	if (tabskill[skillturn][i].maneuver!=-1) { sk++; last=i; } 
    }
    console.log("resolving nextactivation, starting with "+activeunit.name);
    console.log(""+sk+" pilots remainings of skill "+skillturn);
    if (sk==0) { 
	console.log("no more pilots at skill "+skillturn);
	skillturn++;
	while (skillturn<13 && tabskill[skillturn].length==0) { skillturn++; }
	if (skillturn==13) { waitingforaction=true; return; }
	sk=tabskill[skillturn].length;
	last=0;
	console.log("found "+sk+" pilots at skill "+skillturn);
    }
    var old=activeunit;
    active=last; 
    tabskill[skillturn][last].select(); 
    old.unselect();
    console.log("selecting automatically "+activeunit.name);
    // More than one ? Select manually
    if (sk==1) { activeunit.resolvemaneuver();}
    else { activeunit.show(); }
}
function resolveaction() {
    console.log("resolveing action for "+activeunit.name);
    if (activeunit.resolveaction()) { unbind("action"); }
}
function nextaction() {
    activeunit.updateactionlist(); 
    activeunit.maneuver=-1;
    if (activeunit.actionList.length==1) {
	activeunit.action=0;
	resolveaction();
    } else { waitingforaction=true; bindall("action"); }
}
function showfire(ar,dr) {
    var i;
    $(".focusreddice").remove();
    $(".hitreddice").remove();
    $(".criticalreddice").remove();
    $(".blankreddice").remove();
    $(".focusgreendice").remove();
    $(".evadegreendice").remove();
    $(".blankgreendice").remove();

    for (i=0; i<ar.length; i++) {
	$("#attack").append("<b class='"+ar[i]+"reddice'></b>");
    }
    for (i=0; i<dr.length; i++) {
	$("#defense").append("<b class='"+dr[i]+"greendice'></b>");
    }
}
function hidefire() {
}
function reroll(n,attack) {
    var i;
    for (i=0; i<n; i++) {
	var r=Math.floor(Math.random()*7);
	if (attack) {  
	    $("#attack").append("<b class='"+FACE[ATTACKDICE[r]]+"reddice'></b>");
	} else { 
	    $("#defense").append("<b class='"+FACE[ATTACKDICE[r]]+"reddice'></b>"); }
    }
}

function enablenextphase() {
    var i;
    var ready=true;
    switch(phase) {
    case PLANNING_PHASE:
	for (i=0; i<squadron.length; i++) {
	    if (squadron[i].maneuver<0) { ready=false; break; }
	};
	break;
    case ACTIVATION_PHASE:
	for (i=0; i<squadron.length; i++) {
	    if (squadron[i].maneuver>=0) { ready=false; break; }
	};
	break;	
    }
    if (ready) { $("#nextphase").prop("disabled",false)
	       }
    return ready;
}
function resolvedamage() {
    window.location="#";
    $("#listunits").html("");
    if (activeunit.hasfired&&!activeunit.hasdamaged) {
	activeunit.resolvedamage();
	nextcombat();
    }
}
var keybindings={
    phase0:[
	{k:'t',f:function() { activeunit.turn(5);}},
	{k:"shift+t",f:function() {activeunit.turn(-5); }},
	{k:"b",f:function() { activeunit.turn(45);}},
	{k:"shift+b",f:function() { activeunit.turn(-45,0,0);}}],
    phase1:[
	{k:"m",f: function () { activeunit.nextmaneuver(); }},
	{k:"shift+m",f:function() {activeunit.prevmaneuver(); }}
    ],
    phase2:[
	{k:"enter",f:function() {
	    if (activeunit.maneuver>-1&&activeunit.skill==skillturn) {
		waitingforaction=true;// forbids unit cycling
		unbind('phase2'); // Remove all handlers
		activeunit.resolvemaneuver();
	    }
	}}],
    phase3:[
	{k:'enter',f:function() {
	    resolvedamage();
	}},
    ],
    action:[
	{k:"a", f:function() { 
	    if (!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn)   {
		activeunit.nextaction(); 
		activeunit.showaction();
	    }
	}},
	{k:"shift+a", f:function() { 
	    if (!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn)  {
		activeunit.prevaction(); 
		activeunit.showaction();
	    }
	}},
	{k:"enter",f:function() {
	    if (!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn) {
		resolveaction();
	    }
	}}
    ],
    select:[
	{k:'n', f:nextselect},
	{k:'shift+n',f:prevselect}
    ]
};

document.addEventListener("actioncomplete", function() { 
    bindall("phase2");  
    enablenextphase(); 
    waitingforaction=false; 
    activeunit.actiondone=true;
    nextactivation(); }, 
			  false);
document.addEventListener("maneuvercomplete", function() { 
    activeunit.hasmoved=true;
    nextaction(); 
    activeunit.showaction();
}, false);
document.addEventListener("firecomplete", function(e) { 
    showfire(e.detail.ar,e.detail.dr); 
}, false);

function bind(name,c,f) { $(document.body).bind('keydown.'+name,jwerty.event(c,f)); }
function unbind(name) { $(document.body).unbind('keydown.'+name); console.log("Removing binding phase "+name);} 
function bindall(name) {
    var kb=keybindings[name];
    var j;
    console.log("Installing binding "+name);
    for (j=0; j<kb.length; j++) {
	bind(name,kb[j].k,kb[j].f);
    }	    
}
var phasetext = ["End setup","End planning","End activation","End combat","Next round"];
function targetselection() {
    var i;
    for (i=0; i<squadron.length; i++) {
	squadron[i].setclickhandler(function () {
	    targetunit=this;
	    this.show();
	}.bind(squadron[i]));
    }
}
function normalselection() {
    var i;
    for (i=0; i<squadron.length; i++) {
	squadron[i].setdefaultclickhandler();
    }
}
function nextphase() {
    var i;
    // End of phases
    if (!enablenextphase()) return;
    switch(phase) {
    case SETUP_PHASE: activeunit.g.undrag(); 
	console.log("loading sounds...");
	$("#xwing_fire").trigger("load");
	$("#xwing_fly").trigger("load");
	$("#ywing_fly").trigger("load");
	$("#tie_fire").trigger("load");
	$("#tie_fly").trigger("load");
	$("#isd_fly").trigger("load");
	$("#slave_fire").trigger("load");
	$("#slave_fly").trigger("load");
	$("#falcon_fire").trigger("load");
	$("#falcon_fly").trigger("load");
	$("#yt2400_fly").trigger("load");
	console.log("done");
	$("#nextphase").prop("disabled",true);
	$(".xwingship").css("cursor","pointer");
	$("#panel_SETUP").hide();
	break;
    case PLANNING_PHASE:
	$("#nextphase").prop("disabled",true);
	break;
    case ACTIVATION_PHASE:
	$("#panel_ACTIVATION").hide();
	for (i=0; i<squadron.length; i++) {
	    squadron[i].hasmoved=false; squadron[i].actiondone=false;
	}
	break;
    case COMBAT_PHASE:
	$("#panel_COMBAT").hide();
	$("#listunits").html("");
	// Clean up phase
	for (i=0; i<squadron.length; i++) {
	    squadron[i].focus=squadron[i].evade=0;
	    squadron[i].hasfired=false;
	    squadron[i].showinfo();
	}
	break;
    }
    waitingforaction=false;
    phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;

    $("#nextphase").html(phasetext[phase]);
    for (i=0; i<squadron.length; i++) {squadron[i].unselect();}
    // Init new phase
    for (i=SETUP_PHASE; i<=COMBAT_PHASE; i++) {
	if (i!=phase) unbind("phase"+i);
	else bindall("phase"+i);
    }
    switch(phase) {
    case SETUP_PHASE:
	$(".xwingship").css("cursor","move");
	$("#panel_SETUP").show();
	bindall("select");
	var old=activeunit;
	squadron[0].select();
	old.unselect();
	break;
    case PLANNING_PHASE: 
	$("#panel_ACTIVATION").show();
	$("#actionbutton").prop("disabled",true);
	var old=activeunit;
	squadron[0].select();
	old.unselect();
	break;
    case ACTIVATION_PHASE:
	$("#panel_ACTIVATION").show();
	tabskill=[];
	for (i=0; i<=12; i++) tabskill[i]=[];
	for (i=0; i<squadron.length; i++) tabskill[squadron[i].skill].push(squadron[i]);
	skillturn=0;
	nextactivation();
	break;
    case COMBAT_PHASE:
	$("#panel_COMBAT").show();
	skillturn=12;
	nextcombat();
	break;
    }
    activeunit.show();
}

function importsquadron() {
    var s=jQuery.parseJSON($("#jsonimport").val());
    var r=0,e=0;
    window.location="#";
    for (i=0; i<squadron.length; i++) squadron[i].g.remove();
    squadron=[];
    for (i=0; i<s.pilots.length; i++) {
	squadron[i]=Pilot(PILOT_dict[s.pilots[i].name]);
	if (squadron[i].ship.faction=="REBEL") {
	    squadron[i].m.add(MT(80,70+82*r)).add(MR(90,0,0));
	    r++;
	} else {
	    squadron[i].m.add(MT(800,70+82*e)).add(MR(-90,0,0));
	    e++;
	}
	squadron[i].show();
    }
    squadron.sort(function(a,b) {
	return a.skill-b.skill;
    });
    squadron[0].select();
}

//$(document.body).bind('keydown.test',jwerty.event('i', function() {  activeunit.resolveroll(); } ));
//$(document.body).bind('keydown.test',jwerty.event('b', function() {  activeunit.resolveboost(); } ));
// All phases keys
jwerty.key('l', function() { allunitlist(); window.location="#modal"; });
jwerty.key('r', function() { inrange(); window.location="#modal"; });
jwerty.key('p', function() { inhitrange(); window.location="#modal"; });
jwerty.key('s', function() {activeunit.togglehitsector();})
jwerty.key("x", function() { window.location="#";});
jwerty.key("shift+e", function() { window.location="#";nextphase();});
jwerty.key("c", function() { center(activeunit);});


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
function attackreroll(n,reroll,proba) {
    var f,h,c,f2,h2,c2,i,b;
    var p=[];
    for (f=0; f<=n; f++) 
	for (h=0; h<=n-f; h++)
	    for (c=0; c<=n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
	    }
    for (f=0; f<=n; f++) 
	for (h=0; h<=n-f; h++) 
	    for (c=0; c<=n-h-f; c++) {
		var r;
		i=100*f+h+10*c;
		b=n-h-c-f; // do not reroll focus
		if (b<reroll) r=b; else r=reroll;
		if (r==0) p[i]+=proba[i];
		else for (f2=0; f2<=r; f2++) 
		    for (h2=0; h2<=r-f2; h2++)
			for (c2=0; c2<=r-f2-h2; c2++) {
			    j=100*f2+h2+10*c2;
			    k=100*(f+f2)+h+h2+10*(c+c2);
			    p[k]+=proba[i]*ATTACK[r][j];
			}
	    }
    var tmp=0,cmp=0;
    for (f=0; f<=n; f++) 
	for (h=0; h<=n-f; h++) 
	    for (c=0; c<=n-h-f; c++) {
		i=100*f+h+10*c;
		if (h+c+f>0) tmp+=p[i];
		if (c>0) cmp+=p[i];
	    }
    console.log("To hit with focus and reroll: "+cmp+"/"+tmp);
    return p;
}
function attackrerollwithfocus(n,reroll,proba) {
    var f,h,c,f2,h2,c2,i,b;
    var p=[];
    for (f=0; f<=n; f++) 
	for (h=0; h<=n-f; h++)
	    for (c=0; c<=n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
	    }
    var newf=0, r=reroll;
    for (f=0; f<=n; f++) 
	for (h=0; h<=n-f; h++) 
	    for (c=0; c<=n-h-f; c++) {
		i=100*f+h+10*c;
		b=n-h-c-f; // blanks
		r=reroll;
		console.log("b="+b+" f="+f+" reroll="+reroll);
		if (reroll>b) { // more reroll than blanks
		    if (reroll>f+b) { // more rerolls than blanks+focus
			r=f+b;
			newf=0; // no more focus in results
		    } else {
			newf=f-(r-b);
		    }
		} else newf=f;
		if (r==0) { p[i]+=proba[i];
			    //  console.log("h"+(h)+" c"+(c)+" f"+(f)+" "+p[i]);
			    
			  }
		else for (f2=0; f2<=r; f2++) 
		    for (h2=0; h2<=r-f2; h2++)
			for (c2=0; c2<=r-f2-h2; c2++) {
			    j=100*f2+h2+10*c2;
			    k=100*(newf+f2)+h+h2+10*(c+c2);
			    p[k]+=proba[i]*ATTACK[r][j];
			    //   console.log(" h"+h+"/"+h2+" f"+f+"/"+f2+" c"+c+"/"+c2+":"+proba[i]+"*"+ATTACK[r][j]);
			}
	    }
    var tmp=0,cmp=0;
    for (f=0; f<=n; f++) 
	for (h=0; h<=n-f; h++) 
	    for (c=0; c<=n-h-f; c++) {
		i=100*f+h+10*c;
		if (h+c>0) tmp+=p[i];
		if (c>0) cmp+=p[i];
	    }
    console.log("To hit with reroll, nofocus: "+cmp+"/"+tmp);
    tmp=0;cmp=0;var hit=0;
    for (f=0; f<=n; f++) 
	for (h=0; h<=n-f; h++) 
	    for (c=0; c<=n-h-f; c++) {
		i=100*f+h+10*c;
		if (c>0) cmp+=ATTACK[n][i];
		if (c+h+f>0) tmp+=ATTACK[n][i];
		if (c+h>0) hit+=ATTACK[n][i];
	    }
    console.log("To hit with focus: "+cmp+"/"+tmp);
    console.log("To hit no focus, no reroll: "+cmp+"/"+hit);
    return p;
}
var dice=1;
var ATTACK=[]
var DEFENSE=[]
var process=setInterval(function() {
    console.log("computing probability for "+dice+" dices");
    ATTACK[dice]=attackproba(dice);
    DEFENSE[dice]=defenseproba(dice);
    dice++;
    if (dice==6) {
	attackrerollwithfocus(2,1,ATTACK[2]);
	attackreroll(2,1,ATTACK[2]);
	
	clearInterval(process);}
    //
},1000);

var squadnames = ["Academy Pilot", "Academy Pilot", "Captain Kagi", "Chewbacca","Eaden Vrill", "Jan Ors"];//[ "Garven Dreis", "Arvel Crynyd", "Biggs Darklighter", "Howlrunner", ,"Academy Pilot","Academy Pilot" ];

$(document).ready(function() {
s = Snap("#svgout");
P = { F0:{path:s.path("M 0 0 L 0 0"), speed: 0, key:"5"},
      F1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"8"},
      F2:{path:s.path("M 0 0 L 0 -120"), speed: 2, key:"8"},
      F3:{path:s.path("M 0 0 L 0 -160"), speed: 3, key:"8"},
      F4:{path:s.path("M 0 0 L 0 -200"), speed: 4, key:"8"},
      F5:{path:s.path("M 0 0 L 0 -240"), speed: 5, key: "8" },
      // Turn right
      TR1:{path:s.path("M0 0 C 0 -40 15 -55 55 -55"), speed: 1, key:"6"},// 35 -35
      TR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83"), speed:2, key:"6"},// 63 -63
      TR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105"), speed:3, key:"6"}, // 85 -85
      // Turn left
      TL1:{path:s.path("M0 0 C 0 -40 -15 -55 -55 -55"), speed:1, key:"4"}, // -35 -35
      TL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83"), speed:2, key:"4"},// -63 -63
      TL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105"), speed:3, key:"4"}, // -85 -85
      // Bank right
      BR1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92"), speed:1, key:"9"}, // 24 -58 (+/-14.14)
      BR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"9"}, // 40 -92 (+/-14.14)
      BR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"9"}, // 55 -126 (+/-14.14)
      // Bank left
      BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"7"}, // 24 -58 (+/-14.14)
      BL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126"), speed:2, key:"7"}, // 40 -92 (+/-14.14)
      BL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"7"}, // 55 -126 (+/-14.14)
      // K turns (similar to straight line, special treatment in move function)
      K1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"2"},
      K2:{path:s.path("M 0 0 L 0 -120"), speed: 2, key:"2"},
      K3:{path:s.path("M 0 0 L 0 -160"), speed: 3, key:"2"},
      K4:{path:s.path("M 0 0 L 0 -200"), speed: 4, key:"2"},
      K5:{path:s.path("M 0 0 L 0 -240"), speed: 5, key: "2" }
    };
// Load unit data 
$.ajax({
    dataType: "json",
    url: "data/ships.json",
    mimeType: "application/json",
    success: function(result1) {
	unitlist=result1;
	var r=0,e=0,i;
	for(i=0; i<squadnames.length; i++) {
	    squadron[i] = Pilot(squadnames[i]);
	    if (squadron[i].ship.faction=="REBEL") {
		squadron[i].m.add(MT(80,70+82*r)).add(MR(90,0,0));
		r++;
	    } else {
		squadron[i].m.add(MT(800,70+82*e)).add(MR(-90,0,0));
		e++;
	    }
	    squadron[i].show();
	}
	squadron.sort(function(a,b) {
	    return a.skill-b.skill;
	});
	phase=-1;
	squadron[0].select();
	$("#panel_ACTIVATION").hide();
	$("#panel_COMBAT").hide();
	nextphase();
    },
    fail: function() {
	console.log("failing loading ajax");
    }
});

//var mypath;
//mypath=P[12].path.attr({
//    id: "squiggle",
//    fill: "none",
//    strokeWidth: "20",
//    stroke: "#fff"});
//mypath.transform(ship[0].m);
});

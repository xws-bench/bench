var phase=0;
var round=1;
var skillturn=0;
var waitingforaction=false;
var tabskill;
var SETUP_PHASE=0,PLANNING_PHASE=1,ACTIVATION_PHASE=2,COMBAT_PHASE=3;
var DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];


var ROCKS=[];
var PATTERN;

function loadrock() {
    PATTERN = s.image("img/asteroid.jpg",0,0,200,200).pattern(0,0,200,200);
    var i;
    for (i=1; i<=6; i++) {
	Snap.load("data/rock"+i+".svg", function(fragment) {
	    ROCKS.push(new Rock(i,fragment));
	});
    }
}
function Rock(i,fragment) {    
    var k;
    this.g=fragment.select("path");
    this.g.attr({
	fill: PATTERN,
	strokeWidth: 0,
	stroke: "#F00",
    });
    this.name="Asteroid #"+i;
    this.arraypts=[];
    for (k=0; k<this.g.getTotalLength(); k+=5) {
	this.arraypts.push(this.g.getPointAtLength(k));
    }
    this.dragged=false;
    this.m=(new Snap.Matrix()).add(MT(300+Math.random()*300,100+600*Math.random())).add(MS(0.5,0.5));
    this.g.drag(this.dragmove.bind(this), 
		this.dragstart.bind(this),
		this.dragstop.bind(this));
    this.path="";
    this.g.hover(function() {this.g.attr({strokeWidth:4});}.bind(this),
		 function()  {this.g.attr({strokeWidth:0});}.bind(this));
    this.show();
}

Rock.prototype = {
    getrangeallunits: function () { return Unit.prototype.getrangeallunits.call(this);},
    getrange: function(sh) { return Unit.prototype.getrange.call(this,sh); },
    gethitrangeallunits: function () {return [[],[],[],[]]},
    togglehitsector: function() {},
    togglerange: function() {},
    getOutlinePoints: function () {
	var k;
	var pts=[];
	for (k=0; k<this.arraypts.length; k++)
	    pts.push(transformPoint(this.m,this.arraypts[k]));
	return pts;
    },
    getOutline: function() {
	var k;
	this.path="M ";
	for (k=0; k<this.arraypts.length; k++) {
	    var p=transformPoint(this.m,this.arraypts[k]);
	    this.path+=p.x+" "+p.y+" ";
	    if (k==0) this.path+=" L ";
	}
	this.path+="Z";
	var out= s.path(this.path).attr({display:"none"});
	out.appendTo(s);
	return out;
    },
    turn: function(n) {
	this.m.add(MR(n,0,0));
	this.show();
    },
    unselect: function() {
    },
    select: function() {
    },
    dragmove: function(dx,dy,x,y) {
	this.dragMatrix=MT(dx,dy).add(this.m);
	this.dragged=true;
	this.g.transform(this.dragMatrix);
    },
    dragstart:function(x,y,a) { 
	this.dragged=false; 
	var a=activeunit;
	activeunit=this; 
	this.select();
	a.unselect();
    },
    dragstop: function(a) { 
	var k;
	if (this.dragged) { this.m=this.dragMatrix;} 
	this.dragged=false;
    },
    show: function() {
	this.g.transform(this.m);
	this.g.appendTo(s); // Put to front
    }
}


function center() {
    var bbox=activeunit.g.getBBox();
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
	active=(active==squadron.length-1)?0:active+1;
	squadron[active].select();
    }
    old.unselect() ; 
}
function hitrangetostr(r,hit) {
    var str="";
    var i,j,k,h;
    for (h=0; h<squadron.length; h++) if (squadron[h]==activeunit) break;
    for (i=1; i<=3; i++) {
	if (r[i].length>0) {
	    for (j=0; j<r[i].length; j++) {
		var k=r[i][j].unit;
		str+="<div><div>"+i+"</div>";
		str+=squadron[k];
		if (hit) {
		    str+="<div></div><div></div><div></div></div>";
		    for (w=0; w<r[i][j].wp.length; w++) {
			var wp=activeunit.weapons[w];
			str+="<div><div></div><div>Weapon</div>";
			//log("["+activeunit.name+"] evaluate "+squadron[k].name+" w. "+wp.name);
		  	var p=activeunit.evaluatetohit(w,squadron[k]);
			if (p==undefined) break;
			var code;
			if (wp.isprimary) { 
			    if (wp.type=="Turret") code="<p class='Turretlaser'></p>";
			    else code="<p class='Laser'></p>";
			} else code="<p class='"+wp.type+"'></p>"; 
			var kill=p.tokill[r[i][j].hull+r[i][j].shield];
			if (typeof kill=="undefined") kill=0; else 
			    kill=Math.round(kill*10000)/100;
			str+="<div>"+code+wp.name+"</div>";
			str+="<div>"+p.tohit
			    +"% to hit</div><div>"+p.meanhit+"<p class='hit'></p>"
			    +"</div><div>"+p.meancritical+"<p class='critical'></p>"
			    +"</div><div>"+kill+"% to kill</div>";
			if (phase==COMBAT_PHASE && skillturn==activeunit.skill&&activeunit.canfire()) 
			    str+="<div><a href='#combatmodal' onclick=\"resolvecombat("+k+","+w+")\" class='bigbutton'>Fire!</a></div>";
			else str+="<div></div>";
			str+="</div>";
		    }   
		} else str+="</div>";
	    }
	}
    }
    if (str=="") { str="No unit in range of "+activeunit.name; 
		   activeunit.istargeting=false; }
    else {
	var head="<div><div>Range</div><div>Name</div><div>Stats</div><div>Points</div><div>Tokens</div>";
	if (hit) head+="<div></div><div></div>";
	str=head+"<div></div></div>"+str;
    }
    return str;
}
function resolvecombat(k,w) {
    targetunit=squadron[k];
    activeunit.weapons[w].fire(targetunit);
    $('#attacker').html(""+activeunit); 
    $('#defender').html(""+targetunit);
    activeunit.resolvefire(w);
}
function inrange() {
    $("#listtitle").html("Units in range of "+activeunit.name);
    $("#listunits").html(hitrangetostr(activeunit.getrangeallunits(), false));
    window.location="#modal";
}
function inhitrange() {
    $("#listtitle").html("Units in weapon range of "+activeunit.name);
    $("#listunits").html(hitrangetostr(activeunit.gethitrangeallunits(), true));
    window.location="#modal";
}
function help() {
    $("#listtitle").html("This is the help page");
    $("#listunits").html("");
}
function unitstostr() {
    var s;
    var i,j;
    var sobj={REBEL:"",EMPIRE:"",SCUM:""};
    for (i=0; i<squadron.length; i++) {
	var sh=squadron[i];
	sobj[sh.faction]+="<div><div><p class='"+sh.faction+"'></p></div>"+sh+"</div>";
    }
    s="<div><div></div><div>Names</div><div>Stats</div><div>Points</div><div>Tokens</div></div>"+sobj["REBEL"]+sobj["EMPIRE"]+sobj["SCUM"];
    return s;
}
function allunitlist() {
    $("#listtitle").html("List of units");
    $("#listunits").html(unitstostr()); 
    window.location="#modal";
}
function usecloak() {
    if ((phase==ACTIVATION_PHASE)&&(activeunit.stress==0)&&!activeunit.hasmoved) {
	activeunit.resolveuncloak();
	activeunit.show();
    }
}
function usefocus(i) {
    if (phase==COMBAT_PHASE&&activeunit.hasfired) {
	if (activeunit==squadron[i]) {
	    activeunit.resolvefocus();
	    activeunit.show();
	    var l=$(".focusreddice").length;
	    $(".focusreddice").remove();
	    for (i=0; i<l; i++) { 	
		$("#attack").append("<b class='hitreddice'></b>");
	    }
	} else {
	    targetunit.resolvefocus();
	    targetunit.show();
	    var l=$(".focusgreendice").length;
	    $(".focusgreendice").remove();
	    for (i=0; i<l; i++) { 	
		$("#defense").append("<b class='evadegreendice'></b>");
	    }
	}
    }
}
function usetarget(i) {
    if (phase==COMBAT_PHASE&&activeunit.hasfired&&squadron[i]==activeunit) {
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
}
function useevade(i) {
    if (phase==COMBAT_PHASE&&activeunit.hasfired&&squadron[i]==targetunit) {
	targetunit.evade--;
	targetunit.show();
	$("#defense").append("<b class='evadegreendice'></b>");
    }
}
function nextcombat() {
    var i,sk=0,last=0;
    var old=activeunit;
    while (sk==0 && skillturn>=0) {
	for (i=0; i<tabskill[skillturn].length; i++) {
	    if (tabskill[skillturn][i].canfire()) { sk++; last=i; break;} 
	};
	if (sk==0) { 
	    skillturn--;
	    while (skillturn>=0 && tabskill[skillturn].length==0) { skillturn--; }
	} 
    }
    if (skillturn==-1) { log("No more firing units, ready to end phase."); return; }
    sk=tabskill[skillturn].length;
    //console.log("found "+sk+" firing units of skill "+skillturn);
    active=last; 
    tabskill[skillturn][last].select();
    activeunit.show();
    old.unselect();
    //console.log("End nextcombat "+activeunit.name);
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
    //console.log("resolving nextactivation, starting with "+activeunit.name);
    //console.log(""+sk+" pilots remainings of skill "+skillturn);
    if (sk==0) { 
	//console.log("no more pilots at skill "+skillturn);
	skillturn++;
	while (skillturn<13 && tabskill[skillturn].length==0) { skillturn++; }
	if (skillturn==13) { waitingforaction=true; return; }
	sk=tabskill[skillturn].length;
	last=0;
	//console.log("found "+sk+" pilots at skill "+skillturn);
    }
    var old=activeunit;
    active=last; 
    tabskill[skillturn][last].select(); 
    old.unselect();
    //console.log("selecting automatically "+activeunit.name);
    // More than one ? Select manually
//    if (sk==1) { activeunit.resolvemaneuver();}
    activeunit.show(); 
}
function resolveaction() {
    //console.log("resolving action for "+activeunit.name);
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
    for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
    for (i=0; i<ar.length; i++) {
	$("#attack").append("<b class='"+ar[i]+"reddice'></b>");
    }
    for (i=0; i<dr.length; i++) {
	$("#defense").append("<b class='"+dr[i]+"greendice'></b>");
    }
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
	for (i=0; i<squadron.length; i++)
	    if (squadron[i].maneuver<0) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) log("All units have planned a maneuver, ready to end phase");
	break;
    case ACTIVATION_PHASE:
	for (i=0; i<squadron.length; i++)
	    if (squadron[i].maneuver>=0) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) log("All units have been activated, ready to end phase");
	break;	
    }
    if (ready) { $(".nextphase").prop("disabled",false);
	       }
    return ready;
}
function resolvedamage() {
    window.location="#";
    $("#listunits").html("");
    if (activeunit.hasfired&&!activeunit.hasdamaged) {
	activeunit.resolvedamage();
	nextcombat();
    } else {
	//console.log("bad resolvedamage "+activeunit.hasfired+" "+activeunit.hasdamaged);
    }
}
function applymaneuver() {
    if (activeunit.maneuver>-1&&activeunit.skill==skillturn) {
	waitingforaction=true;// forbids unit cycling
	unbind('phase2'); // Remove all handlers
	activeunit.resolvemaneuver();
    }
}
var keybindings={
    phase0:[
	{k:'t',f:function() { activeunit.turn(45);}},
	{k:"shift+t",f:function() {activeunit.turn(-45); }},
	{k:"b",f:function() { activeunit.turn(5);}},
	{k:"shift+b",f:function() { activeunit.turn(-5,0,0);}}],
    phase1:[
	{k:"m",f: function () { activeunit.nextmaneuver(); }},
	{k:"shift+m",f:function() {activeunit.prevmaneuver(); }}
    ],
    phase2:[{k:"enter",f:applymaneuver}],
    phase3:[{k:'enter',f:resolvedamage}],
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
	    if (phase==ACTIVATION_PHASE&&!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn) {
		resolveaction();
	    }
	}}
    ],
    select:[
	{k:'tab', f:nextselect},
	{k:'shift+tab',f:prevselect}
    ]
};
function actioncomplete() {
    bindall("phase2");
    $("#actionbutton").prop("disabled",true);
    enablenextphase(); 
    waitingforaction=false; 
    activeunit.actiondone=true;
    nextactivation(); 
}
function maneuvercomplete() {
    activeunit.hasmoved=true;
    $("#manbutton").prop("disabled",true);
    nextaction();
    activeunit.showaction();
}
function firecomplete(e) {
    $("#primary").prop("disabled",true);
    showfire(e.detail.ar,e.detail.dr); 
}
document.addEventListener("actioncomplete", actioncomplete, false);
document.addEventListener("maneuvercomplete", maneuvercomplete, false);
document.addEventListener("firecomplete",firecomplete, false);

function bind(name,c,f) { $(document.body).bind('keydown.'+name,jwerty.event(c,f)); }
function unbind(name) { $(document.body).unbind('keydown.'+name); } 
function bindall(name) {
    var kb=keybindings[name];
    var j;
    for (j=0; j<kb.length; j++) {
	bind(name,kb[j].k,kb[j].f);
    }	    
}
var phasetext = ["End setup","End planning","End activation","End combat","Next round"];

SOUNDS=["xwing_fire","xwing_fly","ywing_fly","tie_fire","tie_fly","isd_fly","slave_fire","slave_fly","falcon_fire","falcon_fly","yt2400_fly"];

function nextphase() {
    var i;
    // End of phases
    if (!enablenextphase()) return;
    window.location="#"
    switch(phase) {
    case SETUP_PHASE: 
	activeunit.g.undrag(); 
	for (i=0; i<SOUNDS.length; i++) $("#"+SOUNDS[i]).trigger("load");
	$(".nextphase").prop("disabled",true);
	$(".xwingship").css("cursor","pointer");
	$("#panel_SETUP").hide();
	for (i=0; i<ROCKS.length; i++) ROCKS[i].g.undrag();
	break;
    case PLANNING_PHASE:
	$(".nextphase").prop("disabled",true);
	$("#panel_PLANNING").hide();
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
	round++;
	break;
    }
    waitingforaction=false;
    phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;
 
    //$(".nextphase").html(phasetext[phase]);
    for (i=0; i<squadron.length; i++) {squadron[i].unselect();}
    // Init new phase
    for (i=SETUP_PHASE; i<=COMBAT_PHASE; i++) {
	if (i!=phase) unbind("phase"+i);
	else bindall("phase"+i);
    }
    switch(phase) {
    case SETUP_PHASE:
	log("<div>[turn "+round+"] Setup phase</div>");
	$(".xwingship").css("cursor","move");
	$("#panel_SETUP").show();
	bindall("select");
	var old=activeunit;
	squadron[0].select();
	old.unselect();
	break;
    case PLANNING_PHASE: 
	log("<div>[turn "+round+"] Planning phase</div>");
	$("#manbutton").attr({"onclick":"activeunit.nextmaneuver();"});
	$("#msg").html("Set maneuver for each unit.");
	$("#panel_PLANNING").show();
	$("#actionbutton").prop("disabled",true);
	var old=activeunit;
	squadron[0].select();
	old.unselect();
	break;
    case ACTIVATION_PHASE:
	log("<div>[turn "+round+"] Activation phase</div>");
	$("#manbutton").attr({"onclick":"applymaneuver();"});
	$("#msg").html("Launch maneuver, select action and resolve it.");
	$("#panel_ACTIVATION").show();
	tabskill=[];
	for (i=0; i<=12; i++) tabskill[i]=[];
	for (i=0; i<squadron.length; i++) tabskill[squadron[i].skill].push(squadron[i]);
	skillturn=0;
	nextactivation();
	break;
    case COMBAT_PHASE:
	log("<div>[turn "+round+"] Combat phase</div>");
	$("#panel_COMBAT").show();
	skillturn=12;
	nextcombat();
	break;
    }
    activeunit.show();
}
function log(str) {
    $("footer").append("<div>"+str+"<div>").scrollTop(10000);
}
function importonesquadron(s,team) {
    var upg_type=["turret","torpedo","mod","title","elite","astromech","missile","crew","cannon","bomb","system","illicit","salvaged"];
    var i,j,k;
    var r=0;
    for (i=0; i<s.pilots.length; i++) {
	var pilot=s.pilots[i];
	var p;
	p=Pilot(PILOT_dict[pilot.name]);
	p.team=1;
	squadron.push(p);
	if (typeof pilot.upgrades!="undefined")  {
	    for (j=0; j<upg_type.length; j++) { 
		var upg=pilot.upgrades[upg_type[j]];
		if (typeof upg!="undefined") 
		    for (k=0; k<upg.length; k++) 
			Upgrade(p,UPGRADE_dict[upg[k]]);
		    
	    }
	}
	if (team==1) {
	    p.m.add(MT(80,70+82*r)).add(MR(90,0,0));
	} else {
	    p.m.add(MT(800,70+82*r)).add(MR(-90,0,0));
	}
	r++;
	p.show();
    }
}
function importsquadron(str,str2) {
    var s,s2;
    try {
	s=$.parseJSON(str);
    } catch(err) {
	alert("JSON error for 1st squad:"+err.message);
	return;
    }
    try {
	s2=$.parseJSON(str2);
    } catch(err) {
	alert("JSON error for 2nd squad:"+err.message);
	return;
    }
    var i,j,k;
    if (squadron.length>0) {
	for (i=0; i<squadron.length; i++) {
	    squadron[i].g.remove();
	}
    }
    squadron=[];

    importonesquadron(s,1);
    importonesquadron(s2,2);

    squadron.sort(function(a,b) {
	return a.skill-b.skill;
    });
    squadron[0].select();
}

//$(document.body).bind('keydown.test',jwerty.event('i', function() {  activeunit.resolveroll(); } ));
//$(document.body).bind('keydown.test',jwerty.event('b', function() {  activeunit.resolveboost(); } ));
// All phases keys
jwerty.key('l', allunitlist);
jwerty.key('r', inrange);
jwerty.key('w', inhitrange);
jwerty.key('s', function() {activeunit.togglehitsector();})
jwerty.key('shift+s', function() {activeunit.togglerange();})
jwerty.key("x", function() { window.location="#";});
jwerty.key("escape", nextphase);
jwerty.key("c", center);
/* By-passes */
jwerty.key("1", function() { activeunit.focus++;activeunit.show();});
jwerty.key("2", function() { activeunit.evade++;activeunit.show();});
jwerty.key("3", function() { if (!activeunit.iscloaked) {activeunit.iscloaked=true;activeunit.ship.evade+=2;activeunit.show();}});
jwerty.key("4", function() { activeunit.stress++;activeunit.show();});


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
    if (tokensA.istargeting) this.reroll=this.weapon[0].attack;
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

function tohitproba(tokensA,tokensD,at,dt,attack,defense) {
    var p=[];
    var k=[];
    var f,h,c,d,fd,e,i,j,hit,evade;
    var tot=0,mean=0,meanc=0;
    var ATable=at;
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

    for (j=0; j<10; j++) { k[j]=0; }
    for (f=0; f<=attack; f++) {
	for (h=0; h<=attack-f; h++) {
	    for (c=0; c<=attack-h-f; c++) {
		var a=ATable[100*f+h+10*c]; // attack index
		//if (tokensA.reroll>0) log("["+attack+","+defense+"] h"+h+" c"+c+" f"+f+":"+a);
		for (fd=0; fd<=defense; fd++) {
		    for (e=0; e<=defense-fd; e++) {
			if (defense==0) d=1; else d=dt[10*fd+e]; 
			evade=e;
			hit=h;
			i=0;
			if (tokensD.evade>0) { evade+=1; }
			if (tokensD.focus>0) { evade+=fd; }
			if (tokensA.focus>0) { hit+=f; }
			if (hit>evade) { i = hit-evade; evade=0; } 
			else { evade=evade-hit; }
			if (c>evade) { i+= 10*(c-evade); }
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
	    //log("mean+="+h+" * p["+i+"] ("+p[i]+")")
	    mean+=h*p[i];
	    meanc+=c*p[i];
	    for (j=1; j<=c+h; j++) k[j]+=p[i];
	}
    }
    //log("tokill"+k);
    //log("tohit"+mean/tot);
    return {proba:p, tohit:Math.round(tot*10000)/100, meanhit:tot==0?0:Math.round(mean * 100/tot) / 100,meancritical:tot==0?0:Math.round(meanc/tot*100)/100,tokill:k} ;
}

function probatable(attacker,defender) {
    var i,j;
    var str="";
    for (i=1; i<=5; i++) {
	str+="<tr><td>"+i+"</td>";
	for (j=0; j<=5; j++) {
	    var k=j;
	    if (defender.adddice>0) k+=defender.adddice;
	    var th=tohitproba(attacker,defender,ATTACK[i],DEFENSE[k],i,k);
	    str+="<td class='probacell' style='background:hsl("+(1.2*(100-th.tohit))+",100%,80%)'>";
	    str+="<div>"+th.tohit+"%</div><div><b class='symbols'>d</b>"+th.meanhit+"</div><div><b class='symbols'>c</b>"+th.meancritical+"</div></td>";
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
    ra=parseInt("0"+$("#rerollA",10).val());
    var rd=parseInt($("0"+"#rerollD",10).val());
    //log("REROLL2:"+ra+"-"+$("#rerollA").val());
    if (attacker.reroll==0||(ra>0&&ra<attacker.reroll)) attacker.reroll=ra;
    if (defender.reroll==0||(rd>0&&rd<defender.reroll)) defender.reroll=rd;

    //log("REROLL "+ra);
    var str="<tr><th>Rolls</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>"+probatable(attacker,defender);
    $("#probatable").html(str);
}


var dice=1;
var ATTACK=[]
var DEFENSE=[]


	 

var SQUAD=['{"description":"xwings/awings","faction":"rebels","name":"Unnamed Squadron","pilots":[{"name":"tychocelchu","points":24,"ship":"awing","upgrades":{"missile":["chardaanrefit"]}},{"name":"lukeskywalker","points":32,"ship":"xwing","upgrades":{"torpedo":["protontorpedoes"]}},{"name":"wedgeantilles","points":29,"ship":"xwing"},{"name":"prototypepilot","points":15,"ship":"awing","upgrades":{"missile":["chardaanrefit"]}}],"points":100,"vendor":{"yasb":{"builder":"(Yet Another) X-Wing Miniatures Squad Builder","builder_url":"http://geordanr.github.io/xwing/","link":"http://geordanr.github.io/xwing/?f=Rebel%20Alliance&d=v3!s!29:-1,72:-1:-1:;5:-1,1,-1:-1:-1:;0:-1,-1,-1:-1:-1:;32:72:-1:-1:"}},"version":"0.2.0"}',
	   '{"description":"","faction":"empire","name":"Unnamed Squadron","pilots":[{"name":"maulermithel","points":17,"ship":"tiefighter"},{"name":"backstabber","points":16,"ship":"tiefighter"},{"name":"howlrunner","points":18,"ship":"tiefighter"},{"name":"academypilot","points":12,"ship":"tiefighter"},{"name":"bountyhunter","points":37,"ship":"firespray31","upgrades":{"cannon":["manglercannon"]}}],"points":100,"vendor":{"yasb":{"builder":"(Yet Another) X-Wing Miniatures Squad Builder","builder_url":"http://geordanr.github.io/xwing/","link":"http://geordanr.github.io/xwing/?f=Galactic%20Empire&d=v3!s!17:-1:-1:-1:;15::-1:-1:;18:-1:-1:-1:;10::-1:-1:;40:110,-1,-1,-1:-1:-1:"}},"version":"0.2.0"}'
];

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
	  SR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"3"}, // 55 -126 (+/-14.14)
	  // Bank left
	  BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"7"}, // 24 -58 (+/-14.14)
	  BL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126"), speed:2, key:"7"}, // 40 -92 (+/-14.14)
	  BL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"7"}, // 55 -126 (+/-14.14)
	  SL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"1"}, // 55 -126 (+/-14.14)
	  // K turns (similar to straight line, special treatment in move function)
	  K1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"2"},
	  K2:{path:s.path("M 0 0 L 0 -120"), speed: 2, key:"2"},
	  K3:{path:s.path("M 0 0 L 0 -160"), speed: 3, key:"2"},
	  K4:{path:s.path("M 0 0 L 0 -200"), speed: 4, key:"2"},
	  K5:{path:s.path("M 0 0 L 0 -240"), speed: 5, key: "2" }
	};
    // Load unit data 
    loadrock();
    $.ajax({
	dataType: "json",
	url: "data/ships.json",
	mimeType: "application/json",
	success: function(result1) {
var process=setInterval(function() {
	//log("computing for dice"+dice);
    ATTACK[dice]=attackproba(dice);
    DEFENSE[dice]=defenseproba(dice);
    dice++;
    if (dice==8) {
	fillprobatable();
	$("#showproba").prop("disabled",false);
	clearInterval(process);}
},500);
	    unitlist=result1;
	    var r=0,e=0,i;
	    squadron=[];
	    importsquadron(SQUAD[0],SQUAD[1]);
	    phase=-1;
	    $("#panel_ACTIVATION").hide();
	    $("#panel_COMBAT").hide();
	    $("#showproba").prop("disabled",true);
	    nextphase();
	},
	fail: function() {
	    //console.log("failing loading ajax");
	}
    });
});
//var mypath;
//mypath=P[12].path.attr({
//    id: "squiggle",
//    fill: "none",
//    strokeWidth: "20",
//    stroke: "#fff"});
//mypath.transform(ship[0].m);


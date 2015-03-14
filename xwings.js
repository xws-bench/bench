var phase=0;
var skillturn=0;
var waitingforaction=false;
var tabskill;
function center(unit) {
    var bbox=unit.g.getBBox();
    $("#playmat").scrollLeft(bbox.x-window.innerWidth/2+bbox.width/2);
    $("#playmat").scrollTop(bbox.y-window.innerHeight/2+bbox.height/2);
}

function prevselect() {
    if(waitingforaction) { return; }
    var old=activeunit;
    if (phase==2||phase==3) {
	active=(active==0)?tabskill[skillturn].length-1:active-1;
	activeunit=tabskill[skillturn][active];
    } else { 
	active=(active==0)?squadron.length-1:active-1; 
	activeunit=squadron[active];
    }
    old.show();
    old.undrag();
    activeunit.select();
}
function nextselect() {
    if (waitingforaction) { return; }
    var old=activeunit;
    if (phase==2||phase==3) {
	active=(active==tabskill[skillturn].length-1)?0:active+1;
	activeunit=tabskill[skillturn][active];
    } else {     
	active=(active==squadron.length-1)?0:active+1;
	activeunit=squadron[active];
    }
    old.show();
    old.undrag();
    activeunit.select();
}
function rangetostr(r) {
    var str="";
    for (i=1; i<=3; i++) {
	if (r[i].length>0) {
	    str+="<b>In range "+i+"</b><ul>"
	    for (j=0; j<r[i].length; j++) {
		str+="<li>"+r[i][j].name+"</li>";
	    }
	    str+="</ul>"
	}
    }
    if (str=="") { str="No unit in range of "+activeunit.name; }
    return str;
}
function inrange() {
    $("#listtitle").html("Units in range of "+activeunit.name);
    $("#listunits").html(rangetostr(activeunit.getrangeallunits()));
}
function inhitrange() {
    $("#listtitle").html("Units in primary weapon range of "+activeunit.name);
    $("#listunits").html(rangetostr(activeunit.gethitrangeallunits()));
}
function usefocus() {
    activeunit.focus--;
    activeunit.show();
    var n=$(".focusreddice").length;
    $(".focusreddice").remove();
    for(i=0; i<n;i++) {
	$("#attack").append("<a href='#' class='hitreddice'></a>");
    }
}
function tusefocus() {
    targetunit.focus--;
    targetunit.show();
    var n=$(".focusgreendice").length;
    $(".focusgreendice").remove();
    for(i=0; i<n;i++) {
	$("#defense").append("<a href='#' class='evadegreendice'></a>");
    }
}
function tuseevade() {
    targetunit.evade--;
    targetunit.show();
    $("#defense").append("<a href='#' class='evadegreendice'></a>");
}

function nextfire() {
    var i,sk=0,last=0;
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
    if (skillturn==-1) { console.log("cease fire!");return; }
    sk=tabskill[skillturn].length;
    console.log("found "+sk+" firing units of skill "+skillturn);
    var old=activeunit;
    active=last; 
    activeunit=tabskill[skillturn][last];
    old.show();
    activeunit.select();
    activeunit.showtarget=true;
    // More than one ? Select manually
    //if (sk>1) { bindall("select"); }
    //bindall("phase3");
    //if (sk==1) { activeunit.resolvefire(); }
}
function nextmaneuver() {
    var sk=0,last=0,i;
    if (skillturn>12) { return; }
    // Counts how many remaining units with same skill
    for (i=0; i<tabskill[skillturn].length; i++) {
	if (tabskill[skillturn][i].maneuver!=-1) { sk++; last=i; } 
    }
    if (sk==0) { 
	skillturn++;
	while (skillturn<13 && tabskill[skillturn].length==0) { skillturn++; }
	if (skillturn==13) { waitingforaction=true; return; }
	sk=tabskill[skillturn].length;
	last=0;
    }
    var old=activeunit;
    active=last; 
    activeunit=tabskill[skillturn][last];
    old.show();
    activeunit.select(true); 
    // More than one ? Select manually
    if (sk>1) { bindall("select"); bindall("phase2");}
    if (sk==1) { activeunit.resolvemaneuver(); }
}
function resolveaction() {
    console.log("resolveing action for "+activeunit.name);
    waitingforaction=false;
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
	$("#attack").append("<a href='#' class='"+ar[i]+"reddice'></a>");
    }
    for (i=0; i<ar.length; i++) {
	$("#defense").append("<a href='#' class='"+dr[i]+"greendice'></a>");
    }
}
function hidefire() {
    var j;
}
function reroll(n,attack) {
    var r=Math.floor(Math.random()*7);
    if (attack) {  $("#dice"+n).html(FACE[ATTACKDICE[r]]); }
    else {  $("#dice"+n).html(FACE[DEFENSEDICE[r]]); }
}

var keybindings={
    phase0:[
	{k:'r',f:function() { activeunit.turn(5);}},
	{k:"shift+r",f:function() {activeunit.turn(-5); }},
	{k:"q",f:function() { activeunit.turn(45);}},
	{k:"shift+q",f:function() { activeunit.turn(-45,0,0);}}],
    phase1:[
	{k:"a",f:function() { 
	    activeunit.nextManeuver();
	    activeunit.showdial(true);
	}},
	{k:"shift+a",f:function() { 
	    activeunit.prevManeuver();
	    activeunit.showdial(true);
	}}],
    phase2:[
	{k:"enter",f:function() {
	    if (activeunit.maneuver>-1) {
		waitingforaction=true;// forbids unit cycling
		unbind('phase2'); // Remove all handlers
		unbind('select');
		activeunit.resolvemaneuver();
	    }
	}}],
    phase3:[
	{k:'enter',f:function() {
	    activeunit.resolvefire();
	    $("#"+activeunit.unit.faction+"fire").trigger('play');
	}},
    ],
    action:[
	{k:"a", f:function() { 
	    activeunit.nextaction(); 
	    activeunit.showaction(true);
	}},
	{k:"shift+a", f:function() { 
		activeunit.prevaction(); 
		activeunit.showaction(true);
	}},
	{k:"enter",f:function() {
	    if (activeunit.action>=0) {
		resolveaction();
	    }
	}}
    ],
    select:[
	{k:'n', f:nextselect},
	{k:'shift+n',f:prevselect}
    ]
};

document.addEventListener("actioncomplete", function() { nextmaneuver(); }, false);
document.addEventListener("maneuvercomplete", function() { nextaction(); }, false);
document.addEventListener("firecomplete", function(e) { 
    showfire(e.detail.ar,e.detail.dr); 
}, false);

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

function nextphase() {
    var i;
    // Before changing phase: last checks
    $("#warning-message").html("Ok");
    // End of phases
    switch(phase) {
    case 0: activeunit.g.undrag(); break;
    case 1:
	var allset=true;
	var str='',i;
	for (i=0; i<squadron.length; i++) {
	    var unit=squadron[i];
	    if (unit.maneuver==-1) {
		str+="<li>"+unit.name+"</li>";
		allset=false;
	    }
	}
	if (!allset) {
	    $("#warning-message").html("The following units have no maneuver defined:<ul>"+str+"</ul>Define a maneuver for each unit using the <m>/<M> keys.");
	    return;
	}
	// Remove click handler
	for (i=0; i<squadron.length; i++) {
	    squadron[i].setclickhandler(function () {
		var b=(this==activeunit);
		targetunit.unselect(false);
		targetunit=this;
		this.select(!activeunit.showtarget);
	    }.bind(squadron[i]));
	}
	break;
    case 3:
	for (i=0; i<squadron.length; i++) {
	    squadron[i].focus=squadron[i].evade=0;
	    squadron[i].hasfired=false;
	    squadron[i].showinfo();
	    squadron[i].setdefaultclickhandler();
	}
	break;
    }
    waitingforaction=false;
    phase=(phase==3)?1:phase+1;
    // Change panels specific to phase
    for (i=0; i<4; i++) {
	if (i!=phase) { 
	    $("#panel"+i).hide();
	    unbind('phase'+i);
	} else { 
	    $("#panel"+i).show();
	    bindall("phase"+i);
	}
    }
    $("#nextphase").html(phasetext[phase]);
    for (i=0; i<squadron.length; i++) {squadron[i].unselect(true);}
    switch(phase) {
    case 0:
    case 1: 
	active=0;
	activeunit=squadron[0];
	bindall("select");
	break;
    case 2:
	var i;
	tabskill=[];
	activeunit.unselect(true);
	for (i=0; i<=12; i++) {
	    tabskill[i]=[];
	}
	for (i=0; i<squadron.length; i++) {
	    var sk=squadron[i].skill;
	    var t=tabskill[sk];
	    tabskill[sk][tabskill[sk].length]=squadron[i];
	}
	skillturn=0;
	nextmaneuver();
	break;
    case 3:
	skillturn=12;
	nextfire();
	break;
    }
    activeunit.select(true);

}


//bind("key.ctrlm",'ctrl+m', function() { activeunit.resolvemaneuver(); });
$(document.body).bind('keydown.test',jwerty.event('i', function() {  activeunit.resolveroll(); } ));
$(document.body).bind('keydown.test',jwerty.event('h', function() {  activeunit.canhit(); } ));
$(document.body).bind('keydown.test',jwerty.event('b', function() {  activeunit.resolveboost(); } ));
//Phase 3 keys

// All phases keys

jwerty.key('s', function() {activeunit.togglehitsector();})
jwerty.key("x", function() { window.location="#";});
jwerty.key("escape", function() { window.location="#";nextphase();});
jwerty.key("c", function() { center(activeunit);});

$("#REBELfire").trigger("load");
$("#EMPIREfire").trigger("load");

var squadnames = [ "Garven Dreis", "Arvel Crynyd", "Biggs Darklighter", "Howlrunner", "Academy Pilot" ];

// Load unit data 
$.ajax({
    dataType: "json",
    url: "data/ships.json",
    mimeType: "application/json",
    success: function(result1) {
	$.ajax({
	    dataType: "json",
	    url: "data/pilot.json",
	    mimeType: "application/json",
	    success: function(result2) {
		unitlist=result1;
		pilotlist=result2;
		var r=0,e=0,i;
		for(i=0; i<squadnames.length; i++) {
		    squadron[i] = new Unit(squadnames[i]);
		    if (squadron[i].unit.faction=="REBEL") {
			squadron[i].m.add(MT(40,30+42*r)).add(MR(90,0,0));
			r++;
		    } else {
			squadron[i].m.add(MT(820,30+42*e)).add(MR(-90,0,0));
			e++;
		    }
		    squadron[i].show();
		    squadron[i].unselect(true); 
		}
		squadron.sort(function(a,b) {
		    return a.skill-b.skill;
		});
		phase=-1;
		nextphase();
	    }
	});
    }
});

//var mypath;
//mypath=P[12].path.attr({
//    id: "squiggle",
//    fill: "none",
//    strokeWidth: "20",
//    stroke: "#fff"});
//mypath.transform(ship[0].m);


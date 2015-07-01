var phase=0;
var round=1;
var skillturn=0;
var tabskill;
var VERSION="v0.5";

var SETUP_PHASE=2,PLANNING_PHASE=3,ACTIVATION_PHASE=4,COMBAT_PHASE=5,SELECT_PHASE1=0,SELECT_PHASE2=1;
var DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];
var BOMBS=[];

var allunits=[];

function ActionQueue() {
    this.queue=[];
    this.isexecuting=false;
}
ActionQueue.prototype= {
    add: function(f) {
	/*if (!this.isexecuting&&!activeunit.incombat) {
	    this.isexecuting=true;
	    activeunit.show();
	    f.call()
	} else*/ this.queue.push(f);
    },
    next: function() {
	if (this.queue.length>0) {
	    var f;
	    f=this.queue.shift();
	    this.isexecuting=true;
	    activeunit.show();
	    f.call();
	} else this.isexecuting=false;
    },
}
waitingforaction=new ActionQueue();

function nextstep() {
    var i;
    if (activeunit.incombat) return;
    waitingforaction.next();
    if (!waitingforaction.isexecuting&&waitingforaction.queue.length==0) {
	waitingforaction.isexecuting=false;
	if (phase==ACTIVATION_PHASE) {
	    enablenextphase();
	    activeunit.show();
	    nextactivation();
	}
	if (phase==COMBAT_PHASE) nextcombat();
    }
}
function center() {
    var bbox=activeunit.g.getBBox();
    $("#playmat").scrollLeft(bbox.x-window.innerWidth/2+bbox.width/2);
    $("#playmat").scrollTop(bbox.y-window.innerHeight/2+bbox.height/2);
}

function prevselect() {
    if(waitingforaction.isexecuting) { return; }
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
		//str+="<div>";
		//for (h=0; h<7; h++) str+="<div><hr></div>";
		//str+="</div>";
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
		    if (phase==COMBAT_PHASE && skillturn==activeunit.skill&&activeunit.canfire()) str+=" onclick='resolvecombat("+k+","+w+")'>"; else str+=">";
		    str+="<div class='reddice'>"+activeunit.getattackstrength(w,sh)+"</div><div class='greendice'>"+sh.getdefensestrength(w,activeunit)+"</div>"
		    str+="<div>"+p.tohit+"%</div><div><code class='symbols' style='border:0'>d</code>"+p.meanhit+"</div><div><code class='symbols'  style='border:0'>c</code>"+p.meancritical+"</div><div>"+kill+"% kill</div>"
		    str+="</td>";
		    //
			//str+="<div><a href='#combatmodal' onclick=\"resolvecombat("+k+","+w+")\" class='bigbutton'>Fire!</a></div>";
		    //else 
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

function unitstostr() {
    var s;
    var i,j;
    var sobj=["","",""];
    for (i=0; i<squadron.length; i++) {
	var sh=squadron[i];
	sobj[sh.team]+=sh;
    }
    s="<div id='squad1'><div>Stats</div><div>Names</div><div>Ship</div><div>Points</div><div>Description</div></div>"+sobj[1]
	+"<div id='squad2'><div>Stats</div><div>Names</div><div>Ship</div><div>Points</div><div>Description</div></div>"+ sobj[2];
    return s;
}
function allunitlist() {
    $("#listtitle").html("List of units");
    $("#listunits").html(unitstostr()); 
    window.location="#modal";
}

function nextcombat() {
    var i,sk=0,last=0;
    var old=activeunit;
    while (sk==0 && skillturn>=0) {
	for (i=0; i<tabskill[skillturn].length; i++) {
	    if (tabskill[skillturn][i].canfire()) { sk++; last=i; break;} 
	};
	if (sk==0) {
	    var dead=false;
	    skillturn--;
	    for (i=0; i<tabskill[skillturn+1].length; i++) {
		var u=tabskill[skillturn+1][i];
		if (u.canbedestroyed(skillturn))
		    if (u.checkdead()) dead=true;
	    }
	    if (dead&&(TEAMS[1].checkdead()||TEAMS[2].checkdead())) win();
	    // Change PS. Check deads here. 
	    while (skillturn>=0 && tabskill[skillturn].length==0) { skillturn--; }
	} 
    }
    if (skillturn==-1) { 
	log("No more firing units, ready to end phase."); 	
	// Clean up phase
	for (i=0; i<squadron.length; i++) squadron[i].endcombatphase();
	return; 
    }
    sk=tabskill[skillturn].length;
    //console.log("found "+sk+" firing units of skill "+skillturn);
    active=last; 
    tabskill[skillturn][last].select();
    old.unselect();
    activeunit.beginattack();
    activeunit.show();
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
	if (skillturn==13) { return; }
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
    activeunit.beginactivation(); 
}
function modroll(f,n,id) {
    var i,j=0;
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var r=f(100*foc+10*c+h,n);
    $("#attack").empty();
    for (i=0; i<Math.floor(r/100)%10; i++,j++)
	$("#attack").append("<td class='focusreddice'></td>");
    for (i=0; i<(Math.floor(r/10))%10; i++,j++)
	$("#attack").append("<td class='criticalreddice'></td>");
    for (i=0; i<r%10; i++,j++)
	$("#attack").append("<td class='hitreddice'></td>");
    for (i=j; i<n; i++)
	$("#attack").append("<td class='blankreddice'></td>");
    $("#moda"+id).remove();
}
function modrolld(f,n,id) {
    var i,j=0;
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    //log("mod roll before "+foc+" "+e+" "+(n-foc-e));
    var r=f(10*foc+e,n);
    var a=Math.floor(r/10);
    var b=r%10;
    var c=n-a-b;
    //log("mod roll after "+a+" "+b+" "+c);
    $("#defense").empty();
    for (i=0; i<Math.floor(r/10); i++,j++)
	$("#defense").append("<td class='focusgreendice'></td>");
    for (i=0; i<r%10; i++,j++)
	$("#defense").append("<td class='evadegreendice'></td>");
    for (i=j; i<n; i++)
	$("#defense").append("<td class='blankgreendice'></td>");
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
	    if (type%10>=1) {
		l=$("."+attackroll[i]+"reddice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;n-=l.length;
		} else {
		    $("."+attackroll[i]+"reddice:lt("+n+"):not([noreroll])").remove();
		    m+=n;n=0;
		}
		type=Math.floor(type/10);
	    }
	}
	$("#rerolla"+id).remove();
	for (i=0; i<m; i++) {
	    var r=Math.floor(Math.random()*7);
	    $("#attack").prepend("<td noreroll='true' class='"+FACE[ATTACKDICE[r]]+"reddice'></td>");
	}
    } else { 
	for (i=0; i<3; i++) {
	    if (type%10>=1) {
		l=$("."+defenseroll[i]+"greendice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;n-=l.length;
		} else {
		    $("."+attackroll[i]+"greendice:lt("+n+"):not([noreroll])").remove();
		    m+=n;n=0;
		}
		type=Math.floor(type/10);
	    }
	}
	$("#rerolld"+id).remove();
	for (i=0; i<m; i++) {
	    var r=Math.floor(Math.random()*7);
	    $("#defense").prepend("<td noreroll='true' class='"+FACE[DEFENSEDICE[r]]+"greendice'></td>");
	}
    }
}

function enablenextphase() {
    var i;
    var ready=true;
    switch(phase) {
    case PLANNING_PHASE:
	for (i=0; i<squadron.length; i++)
	    if (squadron[i].maneuver<0&&!squadron[i].isdead) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) log("All units have planned a maneuver, ready to end phase");
	break;
    case ACTIVATION_PHASE:
	for (i=0; i<squadron.length; i++)
	    if (squadron[i].maneuver>=0&&!squadron[i].isdead) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) log("All units have been activated, ready to end phase");
	break;	
    }
    if (ready) $(".nextphase").prop("disabled",false);
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
	{k:'n', f:nextselect},
	{k:'shift+n',f:prevselect}
    ]
};

function win() {
    var title="";
    var str=[]
    if (TEAMS[1].checkdead()&&!TEAMS[2].checkdead()) title="Team #2 wins !";
    if (TEAMS[2].checkdead()&&!TEAMS[1].checkdead()) title="Team #1 wins !";
    if (TEAMS[1].checkdead()&&TEAMS[2].checkdead()) title="Draw !";
    $("#listtitle").html(title);
    str[1]=""; str[2]="";
    for (i=0; i<allunits.length;i++) {
	var u=allunits[i];
	str[u.team]+="<tr><td>"+u.name+"</td><td>"+Math.floor(100*u.hitresolved/round)/100+"</td><td>"+Math.floor(100*u.criticalresolved/round)/100+"</td></tr>"
    }
    str[1]="<table><tr><th>Name</th><th>Avg. Hits/round</th><th>Avg. Crit./round</th></tr>"+str[1]+"</table>";
    str[2]="<table><tr><th>Name</th><th>Avg. Hits/round</th><th>Avg. Crit./round</th></tr>"+str[2]+"</table>";    
    $("#listunits").html(str[1]+str[2]);
    window.location="#modal";
}
document.addEventListener("win",win,false);

function bind(name,c,f) { $(document.body).bind('keydown.'+name,jwerty.event(c,f)); }
function unbind(name) { $(document.body).unbind('keydown.'+name); } 
function bindall(name) {
    var kb=keybindings[name];
    var j;
    for (j=0; j<kb.length; j++) {
	bind(name,kb[j].k,kb[j].f);
    }	    
}
var phasetext = ["Build squad #1", "Build squad #2", "Setup","Planning","Activation","Combat"];

function filltabskill() {
    tabskill=[];
    for (i=0; i<=12; i++) tabskill[i]=[];
    for (i=0; i<squadron.length; i++) tabskill[squadron[i].skill].push(squadron[i]);
}

var zone=[];
function nextphase() {
    var i;
    // End of phases
    //if (!enablenextphase()) return;
    window.location="#"
    switch(phase) {
    case SELECT_PHASE1:
	$("#rightpanel").show();
	zone[1]=s.rect(0,0,100,900).attr({
            fill: TEAMS[1].color,
            strokeWidth: 2,
	    opacity: 0.3,
	    pointerEvents:"none"
	});
	zone[1].appendTo(s);
	break;
    case SELECT_PHASE2:
	zone[2]=s.rect(800,0,900,900).attr({
            fill: TEAMS[2].color,
            strokeWidth: 2,
	    opacity: 0.3,
	    pointerEvents:"none"
	});
	zone[2].appendTo(s);
	break;
    case SETUP_PHASE: 
	zone[1].remove();
	zone[2].remove();

	$(".nextphase").prop("disabled",true);
	$(".unit").css("cursor","pointer");
	$("#positiondial").hide();
	for (i=0; i<OBSTACLES.length; i++) OBSTACLES[i].g.undrag();
	for (i=0; i<squadron.length; i++) squadron[i].g.undrag();
	break;
    case PLANNING_PHASE:
	$("#maneuverdial").hide();
	break;
    case ACTIVATION_PHASE:
	$("#actiondial").hide();
	$("#activationdial").hide();
	for (i=0; i<squadron.length; i++) {
	    squadron[i].hasmoved=false; squadron[i].actiondone=false;
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
 
    if (phase<3) $("#phase").html(phasetext[phase]);
    else $("#phase").html("Turn #"+round+" "+phasetext[phase]);
    $("#combatdial").hide();
    if (phase>SELECT_PHASE2) for (i=0; i<squadron.length; i++) {squadron[i].unselect();}
    // Init new phase
    for (i=SELECT_PHASE1; i<=COMBAT_PHASE; i++) {
	if (i!=phase) unbind("phase"+i);
	else bindall("phase"+i);
    }
    switch(phase) {
    case SELECT_PHASE1:
	$(".permalink").hide()
	$(".activeunit").prop("disabled",true);
	$("#rightpanel").hide();
	break;
    case SELECT_PHASE2:
	TEAMS[1].endselection(s);
	break;
    case SETUP_PHASE:
	TEAMS[2].endselection(s);
	$(".activeunit").prop("disabled",false);
	loadrock(s);
	activeunit=squadron[0];
	activeunit.select();
	activeunit.show();
	jwerty.key('l', allunitlist);
	jwerty.key('w', inhitrange);
	jwerty.key('s', nextstep);
	jwerty.key("x", function() { window.location="#";});
	jwerty.key("escape", nextphase);
	jwerty.key("c", center);
	/* By-passes */
	jwerty.key("0", function() { log("active:"+activeunit.name+" pending actions:"+waitingforaction.isexecuting+" can fire:"+activeunit.canfire()+" has damaged:"+activeunit.damage+" m:"+activeunit.maneuver+" a:"+activeunit.action+" skillturn"+skillturn+" ad"+activeunit.actiondone); });
	jwerty.key("1", function() { activeunit.focus++;activeunit.show();});
	jwerty.key("2", function() { activeunit.evade++;activeunit.show();});
	jwerty.key("3", function() { if (!activeunit.iscloaked) {activeunit.iscloaked=true;activeunit.agility+=2;activeunit.show();}});
	jwerty.key("4", function() { activeunit.stress++;activeunit.show();});

	log("<div>[turn "+round+"] Setup phase</div>");
	$(".unit").css("cursor","move");
	$("#positiondial").show();
	bindall("select");
	$(".permalink").show()
	break;
    case PLANNING_PHASE: 
	$(".permalink").hide();
	log("<div>[turn "+round+"] Planning phase</div>");
	$(".nextphase").prop("disabled",true);
	$("#maneuverdial").show();
	var old=activeunit;
	squadron[0].select();
	old.unselect();
	for (i=0; i<squadron.length; i++) {
	    squadron[i].beginplanningphase();
	}
	break;
    case ACTIVATION_PHASE:
	log("<div>[turn "+round+"] Activation phase</div>");
	$(".nextphase").prop("disabled",true);
	$("#activationdial").show();
	for (i=0; i<squadron.length; i++) {
	    squadron[i].beginactivationphase();
	}
	filltabskill();
	skillturn=0;
	nextstep();
	break;
    case COMBAT_PHASE:
	log("<div>[turn "+round+"] Combat phase</div>");
	$("#attackdial").show();
	skillturn=12;
	for (i=0; i<squadron.length; i++) squadron[i].begincombatphase();
	nextstep();
	break;
    }
    if (phase>SELECT_PHASE2) activeunit.show();
}
function log(str) {
    $("#log").append("<div>"+str+"<div>");
    $("footer > div").scrollTop(10000);
}
function permalink() {
    var s="?"+TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII();
    document.location.search = s;
}
function resetlink() {
    document.location.search="";
}
function record(id,str) {
    //$("#log").append("<div style='color:red'>allunits["+id+"]."+str+"<div>");
    //$("footer").scrollTop(10000);
}
function select(name) {
    var i;
    for (i=0; i<squadron.length; i++) {
	if (squadron[i].id==name) break;
    }
    var u=activeunit;
    activeunit=squadron[i];
    activeunit.select();
    $("#"+u.id).attr({color:"black",background:"white"});
    $("#"+activeunit.id).attr({color:"white",background:"tomato"});
    u.unselect();
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
		//log("n"+n+" f"+f+" c"+c+" h"+h);
		//log("fa"+fa+" ca"+ca+" ha"+ha);
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
			//log("i "+i+" "+a+"*"+d);
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
    return {proba:p, tohit:Math.floor(tot*10000)/100, meanhit:tot==0?0:Math.floor(mean * 100/tot) / 100,
	    meancritical:tot==0?0:Math.floor(meanc/tot*100)/100,tokill:k} ;
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


var dice=1;
var ATTACK=[]
var DEFENSE=[]

var TEAMS=[0,new Team(1),new Team(2)];

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
		if (dice==7) {
		    fillprobatable();
		    $("#showproba").prop("disabled",false);
		    clearInterval(process);}
	    },500);
	    unitlist=result1;
	    var r=0,e=0,i;
	    squadron=[];
	    s.attr({width:"100%",height:"100%",viewBox:"0 0 900 900"});
	    TEAMS[1].setfaction("REBEL");
	    TEAMS[2].setfaction("EMPIRE");
	    UPGRADES.sort(function(a,b) { if (a.name<b.name) return -1; if (a.name>b.name) return 1; return 0; });
	    PILOTS.sort(function(a,b) { return (a.points-b.points); });
	    var n=0,u=0,ut=0;
	    var str="";
	    for (i=0; i<PILOTS.length; i++) {
		if (PILOTS[i].done==true) { if (PILOTS[i].unique) u++; n++; }
		if (!PILOTS[i].done) { 
		    if (PILOTS[i].unique) str+=", ."; else str+=", ";
		    str+=PILOTS[i].name; 
		}
	    }
	    log("<b>X-Wings Squadron Benchmark "+VERSION+"</b>");
	    log(n+"/"+PILOTS.length+" pilots with full effect");
	    log("Pilots NOT implemented"+str);
	    n=0;
	    str="";
	    for (i=0; i<UPGRADES.length; i++) {
		if (UPGRADES[i].done==true) n++;
		else str+=", "+(UPGRADES[i].unique?".":"")+UPGRADES[i].name;
	    }
	    log(n+"/"+UPGRADES.length+" upgrades implemented");
	    log("Upgrades NOT implemented"+str);
	    $("#leftpanel").prepend("<div id='importexport1'><button onclick='currentteam=1;window.location=\"#import\"' class='bigbutton'>Import Squadron</button><button class='bigbutton' onclick='$(\"#jsonexport\").val(JSON.stringify(TEAMS[1])); window.location=\"#export\"'>Export Squadron</button></div>");
	    $("#rightpanel").prepend("<div id='importexport2'><button onclick='currentteam=2;window.location=\"#import\"' class='bigbutton'>Import Squadron</button><button class='bigbutton' onclick='$(\"#jsonexport\").val(JSON.stringify(TEAMS[2])); window.location=\"#export\"'>Export Squadron</button></div>");
	    phase=-1;
	    $("#showproba").prop("disabled",true);
	    var args= window.location.search.substr(1).split('&');
	    nextphase();
	    if (args[0]!="") {
		log("Loading permalink...");
		TEAMS[1].parseASCII(s,args[0]);
		TEAMS[2].parseASCII(s,args[1]);
	    } 
	    loadsound();
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


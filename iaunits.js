var IACOMPUTING=0;
function IAUnit() {
}

IAUnit.prototype= {
    computemaneuver: function() {
	var i,j,k,d=0;
	var p=[],q=[],possible=-1;
	this.evaluatepositions(true,true);
	var gd=this.getdial();
	//log("computing all enemy positions");
	// Find all possible future positions of enemies
	for (i=0; i<squadron.length; i++) 
	    if (squadron[i].team!=this.team) {
		var u=squadron[i];
		var sgd=u.getdial();
		for (j=0; j<sgd.length; j++)
		    if (sgd[j].color==GREEN)
			p.push(u.getOutlinePoints(sgd[j].m));
	    }
	// Find all possible moves, with no collision and units in range 
	var COLOR=[GREEN,WHITE,YELLOW];
	for (c=0; c<COLOR.length&&q.length==0; c++) {
	    //log("find positions with color "+c);
	    for (i=0; i<gd.length; i++) {
		var d=gd[i];
		if (d.color==COLOR[c]) {
		    var n=0;
		    if (possible<0) possible=i;
		    if (d.difficulty=="GREEN") possible=i;
		    //var mm=this.getpathmatrix(this.m,gd[i].move);
		    //if (gd[i].move.match(/K\d|SL\d|SR\d/)) mm=mm.rotate(180,0,0);
		    var s=this.getSectorString(3,gd[i].m);
		    for (j=0; j<p.length; j++) if (this.isPointInside(s,p[j])) n++;
		    if (n>0) q.push({n:n,m:i});
		}
	    }
	    if (q.length>=0) break;
	}
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    d=q[0].m;
	    //if (typeof gd[d] == "undefined") log("GD NON DEFINI POUR "+this.name+" "+gd.length+" "+d);	    
	} else {
	    d=possible;
	    if (possible==-1) {
		for (i=0; i<gd.length; i++) 
		    if (gd[i].difficulty!="RED"||this.stress>0) break;
		d=i;
	    }
	    //if (typeof gd[d] == "undefined") log("(q=vide) UNDEFINED GD FOR "+this.name+" "+gd.length+" "+possible);

	}
	log("Maneuver set for "+this.name);//+":"+d+"/"+gd.length+"->"+gd[d].move);
	return d;
    },
    freeaction: function(endfree) {
	endfree(); // Does nothing when given a free action...
    },
    resolveactionselection: function(units,cleanup) {
	cleanup(0);
    },
    selectcritical: function(crits,endselect) {
	for (var i=0; i<crits.length; i++) {
	    if (CRITICAL_DECK[crits[i]].lethal==false) {
		endselect(crits[i]); return;
	    }
	}
	endselect(crits[0]);
    },
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var i;
	var p=[];
	var ready=false;
	for (i=0; i<moves.length; i++) {
	    p[i]=this.getpossibleoutline(moves[i]);
	    p[i].ol.remove();
	}
	for (i=0; i<moves.length; i++) {
	    if (p[i].b||possible) { ready=true; break; }
	}
	if (ready) { this.m=moves[i]; cleanup(this,i); }
	else cleanup(this,-1);
    },
    timetoshowmaneuver: function() {
	return this.maneuver>-1 && phase==ACTIVATION_PHASE&&skillturn==this.skill;
    },
    doplan: function() {
	$("#move").css({display:"none"});
	$("#maneuverdial").empty();
	if (phase==PLANNING_PHASE&&this.maneuver==-1) {
	    IACOMPUTING++;
	    if (IACOMPUTING==1) {
		$("#npimg").empty();
		$("#npimg").append("<img style='width:10px' src='img/waiting.gif'/>");
	    }
	    var process=setInterval(function() {
		    var m=this.computemaneuver();	
		    IACOMPUTING--;
		    if (IACOMPUTING==0) {
			$("#npimg").empty();
			$("#npimg").append("&#9658;");
		    }
		    this.setmaneuver(m);
		    clearInterval(process);
		}.bind(this),1000);
	}

    },
    showdial: function() { 	
	$("#maneuverdial").empty();
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.dialspeed.attr({text:""});
		this.dialdirection.attr({text:""});
		return;
	    };
	}
    },
    showactivation: function() {
	$("#activationdial").empty();
	if (phase>PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.dialspeed.attr({text:""});
		this.dialdirection.attr({text:""});
		return;
	    };
	    d = this.getdial()[this.maneuver];
	    var c  =C[d.difficulty];
	    if (!(activeunit==this)) {
		c = halftone(c);
	    }
            this.dialspeed.attr({text:P[d.move].speed,fill:c});
            this.dialdirection.attr({text:P[d.move].key,fill:c});
	}
    },
    doactivation: function() {
	var ad=this.updateactivationdial();
	if (this.timeformaneuver()) this.resolvemaneuver();
    },
    showaction: function() {
	$("#actiondial").empty();
	if (this.action>-1&&this.action<this.actionList.length) {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});	
    },
    doaction: function() {
	this.updateactionlist();
	if (this.candoaction()&&!waitingforaction.isexecuting&&skillturn==this.skill&&this.action==-1) {
	    var focus=this.actionList.indexOf("FOCUS");
	    var evade=this.actionList.indexOf("EVADE");
	    var critical=this.actionList.indexOf("CRITICAL");
	    var grlu=this.gethitrangeallunits();
	    if (critical>0) { 
		this.action=this.getshipactionlist().length+this.getupgactionlist().length;
	    } else if (evade>-1&&grlu[1].length==0&&grlu[2].length==0&&grlu[3].length==0&&this.candoevade()) {
		this.action=evade;
	    }else if (focus>-1&&this.candofocus()) { 
		this.action=focus;
	    } else if (evade>-1&&this.candoevade()) { 
		this.action=evade;
	    } else this.action=-1;
	    this.resolveaction();
	}
    },
    showattack: function() {
	$("#attackdial").empty();
    },
    addaction: function(org,timeforaction,action) {
	if (timeforaction()) action();
    },
    doattack: function(forced) {
	if (forced||(phase==COMBAT_PHASE&&!waitingforaction.isexecuting&&skillturn==this.skill&&this.canfire())) {
	    var r=this.gethitrangeallunits();
	    //console.log("ia/doattack:"+this.name);
	    var wn=[];
	    var i,j,w;
	    for (i=1; i<=3; i++) {
		for (j=0; j<r[i].length; j++) {
		    for (w=0; w<r[i][j].wp.length; w++) {
			var wp=r[i][j].wp[w];
			if (wn.indexOf(wp)==-1) wn.push(wp);
		    }
		}
	    }
	    if (wn.length>0) {
		//console.log("ia/doattack "+this.name+">select target");
		this.selecttargetforattack(wn[0]);
		//console.log("ia/doattack "+this.name+"<select target");
	    } else {
		//console.log("ia/doattack:no target");
		this.hasfired++; nextstep();
	    }
	}   
    },
    doattackroll: function(ar,da,defense,me) {
	var i,j,str="";
	$("#attackdial").empty();
	$("#defense").empty();
	$("#dtokens").empty();
	//console.log("ia/doattackroll:"+this.name+" with "+da+" dices");
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	var f=Math.floor(ar/100);
	for (i=0; i<f; i++) $("#attack").prepend("<td class='focusreddice'></td>");
	var c=Math.floor(ar/10)%10;
	for (i=0; i<c; i++) $("#attack").prepend("<td class='criticalreddice'></td>");
	var h=ar%10;
	for (i=0; i<h; i++) $("#attack").prepend("<td class='hitreddice'></td>");
	//console.log("ia/doattackroll:"+this.name+" with "+(da-h-c-f)+"("+da+"-"+(h+c+f)+") blank dices")
	for (i=0; i<da-h-c-f; i++) $("#attack").prepend("<td class='blankreddice'></td>");
	// Add modifiers
	if (this.canusefocus()) this.usefocus();
	if (this.canusetarget(targetunit)) this.usetarget(); 
	var doreroll=function(a,i) {
	    var s=0;
	    var n=a.n();
	    if (a.type.indexOf("blank")>-1) s+=n;
	    if (a.type.indexOf("focus")>-1) s+=10*n;
	    if (a.type.indexOf("hit")>-1) s+=100*n;
	    if (a.type.indexOf("critical")>-1) s+=1000*n;
	    reroll(n,true,s,i);
	}
	// Do all possible rerolls 
	for (var i=0; i<ATTACKREROLLA.length; i++) {
	    var a=ATTACKREROLLA[i];
	    if (a.req(this,this.weapons[this.activeweapon],targetunit)) 
		doreroll(a,i);
	}   
	for (var i=0; i<this.ATTACKREROLLA.length; i++) {
	    var a=this.ATTACKREROLLA[i];
	    if (a.req(this.weapons[this.activeweapon],targetunit)) 
		doreroll(a,i+ATTACKREROLLA.length);
	}   
	// Do all possible modifications
	for (i=0; i<ATTACKMODA.length; i++) {
	    var a=ATTACKMODA[i];
	    if (a.req(ar,da)) modroll(a.f,da,i);
	}   
	for (i=0; i<ATTACKMODD.length; i++) {
	    var a=ATTACKMODD[i];
	    if (a.req(ar,da)) {
		//log("adding attackmodd");
		str+="<td id='moda"+(i+ATTACKMODA.length)+"' class='"+a.str+"modtokend' onclick='modroll(ATTACKMODD["+i+"].f,"+da+","+(i+ATTACKMODA.length)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length+ATTACKMODD.length;
	for (j=0; j<this.ATTACKMODA.length; j++) {
	    var a=this.ATTACKMODA[j];
	    if (a.req(ar,da)) modroll(a.f,da,(i+j));
	}   
	for (j=0; j<this.ATTACKADD.length; j++) {
	    var a=this.ATTACKADD[j];
	    if (a.req(ar,da)) addroll(a.f,ar,(i+j+this.ATTACKMODA.length));
	}   
	if (str!="") {
	    $("#atokens").html(str);
	    $("#atokens").append("<button onclick='$(\"#atokens\").empty(); targetunit.dodefenseroll(targetunit.defenseroll("+defense+")"+","+defense+","+me+"'>Done</button>");
	} else {
	    $("#atokens").empty(); targetunit.dodefenseroll(targetunit.defenseroll(defense),defense,me);
	}
    },
    dodefenseroll: function(dr,dd,me) {
	var i,j;
	var f=Math.floor(dr/10);
	//console.log("ia/dodefenseroll:"+this.name);
	for (i=0; i<f; i++) $("#defense").prepend("<td class='focusgreendice'></td>");
	var e=dr%10;
	for (i=0; i<e; i++) $("#defense").prepend("<td class='evadegreendice'></td>");
	for (i=0; i<dd-e-f; i++) $("#defense").prepend("<td class='blankgreendice'></td>");
	for (j=0; j<squadron.length; j++) if (squadron[j]==this) break;
	// Add modifiers
	if (this.canusefocus()) this.usefocus();
	if (this.canuseevade()) this.useevade();
 	var doreroll=function(a,i) {
	    var s=0;
	    var n=a.n();
	    if (a.type.indexOf("blank")>-1) s+=n;
	    if (a.type.indexOf("focus")>-1) s+=10*n;
	    if (a.type.indexOf("evade")>-1) s+=100*n;
	    reroll(n,false,s,i);
	};
	for (var i=0; i<DEFENSEREROLLD.length; i++) {
	    var a=DEFENSEREROLLD[i];
	    if (a.req(activeunit,activeunit.weapons[activeunit.activeweapon],this)) 
		doreroll(a,i);
	}   
	for (var i=0; i<targetunit.DEFENSEREROLLD.length; i++) {
	    var a=targetunit.DEFENSEREROLLD[i];
	    if (a.req(activeunit.weapons[activeunit.activeweapon],this)) 
		doreroll(a,i+DEFENSEREROLLD.length);
	}   
	for (i=0; i<DEFENSEMODD.length; i++) {
	    var a=DEFENSEMODD[i];
	    if (a.req(dr,dd)) modrolld(a.f,dr,i);
	}   
	for (j=0; j<this.DEFENSEMODD.length; j++) {
	    var a=this.DEFENSEMODD[j];
	    if (a.req(dr,dd)) modrolld(a.f,dr,i+j);
	}   
	$("#dtokens").append("<button onclick='$(\"#combatdial\").hide();squadron["+me+"].resolvedamage()'>Fire!</button>");
	//log("defense roll: f"+f+" e"+e+" b"+(dd-e-f));
    },
};

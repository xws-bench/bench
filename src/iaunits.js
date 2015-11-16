var IACOMPUTING=0;
function IAUnit() {
}

IAUnit.prototype= {
    computemaneuver: function() {
	var i,j,k,d=0;
	var q=[],possible=-1;
	var gd=this.getdial();
	var enemies=[];
	//log("computing all enemy positions");
	// Find all possible future positions of enemies
	var k=0;
	for (i=0; i<squadron.length; i++) {
	    var u=squadron[i];
	    var mind=-1;
	    if (u.team!=this.team) {
		enemies[k]=u;
		var sgd=u.getdial();
		d=-1;
		for (j=0; j<sgd.length; j++)
		    if (sgd[j].difficulty=="GREEN"&&sgd[j].move.match(/F\d/)) {
			mind=j;
			break;
		    }
		if (mind==-1) 
		    for (j=0; j<sgd.length; j++)
			if (sgd[j].difficulty=="WHITE"&&sgd[j].move.match(/F\d/)) {
			    mind=j;
			    break;
			}
		enemies[k].oldm=enemies[k].m;
		enemies[k].m=u.getpathmatrix(u.m,sgd[mind].move);
		k++;
	    }
	}
	var findpositions=function(gd) {
	    var q=[],c,j,i;
	// Find all possible moves, with no collision and with units in range 
	    var COLOR=[GREEN,WHITE,YELLOW];
	    this.evaluatepositions(true,true);
	    //log("find positions with color "+c);
	    for (i=0; i<gd.length; i++) {
		var d=gd[i];
		if (d.color==RED) continue;
		var mm=this.getpathmatrix(this.m,gd[i].move);
		//log(this.name+":"+d.move+":"+(d.difficulty=="RED"));
		var n=60-30*COLOR.indexOf(d.color);
		
		var maxenemy=0;
		var inrange=0;
		var oldm=this.m;
		this.m=mm;
		var s="";
		for (j=0; j<enemies.length; j++) {
		    var x=enemies[j].weapons[0].getrange(this);
		    if (x>0) { maxenemy+=4-x; s+=" "+enemies[j].name+":"+x; }
		    var y=this.weapons[0].getrange(enemies[j]);
		    if (y>0) inrange=Math.min(inrange,y);
		}
		
		this.m=oldm;
		n+=inrange*4-2*maxenemy/enemies.length;
		var dist=0;
		for (j=0; j<enemies.length; j++)
		    dist-=this.getdist(mm,enemies[j])/90000;
		n+=dist;
		//this.log(d.move+": "+n+"= +"+(inrange)+"-"+s+" "+(dist*2));

		if (d.difficulty=="RED") n=n-3;
		q.push({n:n,m:i});
	    }
	    return q;
	}.bind(this);
	q=findpositions(gd);
	// Restore position
	for (k=0; k<enemies.length; k++) enemies[k].m=enemies[k].oldm;
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    //for (i=0; i<q.length; i++) this.log(">"+q[i].n+" "+gd[q[i].m].move);
	    d=q[0].m;
	    //if (typeof gd[d] == "undefined") log("GD NON DEFINI POUR "+this.name+" "+gd.length+" "+d);	    
	} else {
	    for (i=0; i<gd.length; i++) 
		if (gd[i].difficulty!="RED"||gd[i].move.match(/F\d/)) break;
	    d=i;
	    //if (typeof gd[d] == "undefined") log("(q=vide) UNDEFINED GD FOR "+this.name+" "+gd.length+" "+possible);

	}
	this.log("Maneuver set");//+":"+d+"/"+q.length+" possible?"+possible+"->"+gd[d].move);
	return d;
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
	var ready=false;
	for (i=0; i<moves.length&&!ready; i++) 
	    if (possible||this.getmovecolor(moves[i],true,true)==GREEN) ready=true;
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
	    if  (IACOMPUTING==1) {
		$("#npimg").html("<img style='width:10px' src='png/waiting.gif'/>");
	    }
	    var p;
	    p=setInterval(function() {
		var m=this.computemaneuver(); 
		IACOMPUTING--;
		if (IACOMPUTING==0) $("#npimg").html("&#9658;");
		this.newm=this.getpathmatrix(this.m,this.getdial()[m].move);
		this.setmaneuver(m);
		clearInterval(p);
	    }.bind(this),1);
	}
	return this.deferred;
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
    donoaction:function(list,str) {
	var cmp=function(a,b) {
	    if (a.type=="CRITICAL") return -1;
	    if (b.type=="CRITICAL") return 1;
	    if (a.type=="EVADE") return -1;
	    if (b.type=="EVADE") return 1;
	    if (a.type=="FOCUS") return -1;
	    if (b.type=="FOCUS") return 1;
	    return 0;
	}
	list.sort(cmp);
	return this.enqueueaction(function(n) {
		this.select();
		if (typeof str!="undefined") this.log(str);
		var grlu=this.gethitrangeallunits();
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="EVADE") {
			if (grlu[1].length==0&&grlu[2].length==0&&grlu[3].length==0&&this.candoevade()) { a=list[i]; break; }
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		this.resolvenoaction(a,n);
	    }.bind(this),"donoaction ia");
    },
    doaction: function(list,str) {
	var cmp=function(a,b) {
	    if (a.type=="CRITICAL") return -1;
	    if (b.type=="CRITICAL") return 1;
	    if (a.type=="EVADE") return -1;
	    if (b.type=="EVADE") return 1;
	    if (a.type=="FOCUS") return -1;
	    if (b.type=="FOCUS") return 1;
	    return 0;
	}
	list.sort(cmp);
	return this.enqueueaction(function(n) {
	    if (this.candoaction()) {
		this.select();
		if (typeof str!="undefined") this.log(str);
		var grlu=this.gethitrangeallunits();
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="EVADE") {
			if (grlu[1].length==0&&grlu[2].length==0&&grlu[3].length==0&&this.candoevade()) { a=list[i]; break; }
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		this.resolveaction(a,n);
	    } else {
		this.endaction(n);
	    }
	    }.bind(this),"doaction ia");
    },
    showattack: function() {
	$("#attackdial").empty();
    },
    doattack: function(forced) {
	//this.log("attack?"+forced+" "+(skillturn==this.skill)+" "+this.canfire());
	if (forced==true||(phase==COMBAT_PHASE&&skillturn==this.skill)) {
	    var r=this.gethitrangeallunits();
	    //this.log("ia/doattack");
	    var wn=[];
	    var i,j,w;
	    if (this.canfire()) {
		for (i=1; i<=3; i++) {
		    for (j=0; j<r[i].length; j++) {
			for (w=0; w<r[i][j].wp.length; w++) {
			    var wp=r[i][j].wp[w];
			    if (wn.indexOf(wp)==-1) wn.push(wp);
			}
		    }
		}
	    }
	    if (wn.length>0) {
		this.activeweapon=0;
		//this.log("ia/doattack >"+wn[0].name);
      		this.selecttargetforattack(wn[0]);
		//console.log("ia/doattack "+this.name+"<select target");
	    } else {
		//console.log("ia/doattack:no target");
		this.hasfired++; this.deferred.resolve();
	    }
	}   
    },
    doattackroll: function(ar,da,defense,me,n) {
	var i,j,str="";
	$("#attackdial").empty().show();
	$("#defense").empty();
	$("#dtokens").empty();
	displayattackroll(ar,da);
	var doreroll=function(a,i) {
	    var s=0;
	    var nn=a.n();
	    if (a.type.indexOf("blank")>-1) s+=nn;
	    if (a.type.indexOf("focus")>-1) s+=10*nn;
	    if (a.type.indexOf("hit")>-1) s+=100*nn;
	    if (a.type.indexOf("critical")>-1) s+=1000*nn;
	    reroll(nn,true,s,i);
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
		//modroll(ATTACKMODD[i].f,da,i+ATTACKMODA.length);
		//log("adding attackmodd");
		//str+="<td id='moda"+(i+ATTACKMODA.length)+"' class='"+a.str+"modtokend' onclick='modroll(ATTACKMODD["+i+"].f,"+da+","+(i+ATTACKMODA.length)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length;//+ATTACKMODD.length;
	for (j=0; j<this.ATTACKMODA.length; j++) {
	    var a=this.ATTACKMODA[j];
	    if (a.req(ar,da)) modroll(a.f,da,(i+j));
	}   
	for (j=0; j<this.ATTACKADD.length; j++) {
	    var a=this.ATTACKADD[j];
	    if (a.req(ar,da)) addroll(a.f,da,(i+j+this.ATTACKMODA.length));
	}   
	if (str!="") {
	    $("#atokens").html(str).show();
	    $("#atokens").append("<button class='m-done' onclick='$(\"#atokens\").empty(); targetunit.defenseroll("+defense+").done(function(roll) { targetunit.dodefenseroll(roll,"+defense+","+me+","+n+")})'></button>");
	} else {
	    $("#atokens").empty(); 
	    targetunit.defenseroll(defense).done(function(roll) {targetunit.dodefenseroll(roll,defense,me,n);});
	}
    },
    dodefenseroll: function(dr,dd,me,n) {
	var i,j;
	displaydefenseroll(dr,dd);
	for (j=0; j<squadron.length; j++) if (squadron[j]==this) break;
	// Add modifiers
 	var doreroll=function(a,i) {
	    var s=0;
	    var nn=a.n();
	    if (a.type.indexOf("blank")>-1) s+=nn;
	    if (a.type.indexOf("focus")>-1) s+=10*nn;
	    if (a.type.indexOf("evade")>-1) s+=100*nn;
	    reroll(nn,false,s,i);
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
	    if (a.req(dr,dd)) modrolld(a.f,dd,i);
	}   
	for (j=0; j<this.DEFENSEMODD.length; j++) {
	    var a=this.DEFENSEMODD[j];
	    if (a.req(dr,dd)) modrolld(a.f,dd,i+j);
	}   
	$("#dtokens").append("<button>");
	$("#dtokens > button").addClass("m-fire").click(function() {
		$("#combatdial").hide();
		this.resolvedamage();
		this.endnoaction(incombat);
		this.incombat=-1;
	    }.bind(squadron[me])).show();
	//log("defense roll: f"+f+" e"+e+" b"+(dd-e-f));
    },
};

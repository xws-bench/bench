function ReplayUnit() {
}

ReplayUnit.prototype= {
    next: function() {
	var p=REPLAY[0].split("_")[1];
	REPLAY=REPLAY.splice(0,1);
	return p;
    },
    resolveactionselection: function(units,cleanup) {
	cleanup(this.next());
    },
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    for (i=0; i<this.pos.length; i++) this.pos[i].ol.remove();
	    if (automove) this.m=m;
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    OBSTACLES[mine[i]].detonate(this)
		}
	    f(this,k);
	    this.show();
	}.bind(this);
	for (i=0; i<moves.length; i++) {
	    if (possible||this.getmovecolor(moves[i],true,true)==GREEN) {
		p=this.getOutline(moves[i]).attr({display:"block"}).appendTo(VIEWPORT);
		this.pos.push({ol:p,k:i});
	    }
	}
	var n=next();
	if (n==-1) resolve(this.m,-1,cleanup);
	else resolve(moves[this.pos[n].k],this.pos[n].k,cleanup);
    },
    selectcritical: function(crits,endselect) {
	endselect(crits[this.next()]);
    },
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var n=this.next();
	if (n>-1) { this.m=moves[n]; cleanup(this,n); }
	else cleanup(this,-1);
    },
    showdial: function() {
	if (phase==PLANNING_PHASE||phase==SELECT_PHASE1||phase==SELECT_PHASE2) {
	    this.setmaneuver(this.next());
	}
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
	if (!this.timeformaneuver())  return;
	var ad=this.updateactivationdial();
	for (var n=this.next();n>=0; n=this.next()) {
	    ad[i].action();
	}
	this.resolvemaneuver();
    },
    attackroll:function(n) {
	var i,f,h,c;
	var P=this.getattacktable(n);
	var ptot=0;
	var r=this.next();
	record("attackroll",r);
	if (n==0) return 0;
	for (f=0; f<=n; f++) {
	    for (h=0; h<=n-f; h++) {
		for (c=0; c<=n-f-h; c++) {
		    i=f*100+h+10*c;
		    ptot+=P[i];
		    if (ptot>r) return 100*f+c*10+h; 
		}
	    }
	}
	return 0;
    },
    rand: function(n) { return this.next(); },
    defenseroll:function(n) {
	var i,e,f;
	var lock=$.Deferred();
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=this.next();
	if (n==0) return lock.resolve(0).promise();
	if (typeof P=="undefined") {
	    //console.log("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*10+e;
		ptot+=P[i];
		if (ptot>r) return lock.resolve(10*f+e).promise();
	    }
	}
	return lock.resolve(0).promise();
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
	return this.enqueueaction(function(n) {
	    var nn=this.next();
	    if (nn==-1) this.resolvenoaction(null,n) 
	    else this.resolvenoaction(this.next(),n);
	}.bind(this);
    },
    doaction: function(list,str) {
	return this.enqueueaction(function(n) {
	    var nn=this.next();
	    if (nn==-1) this.resolvenoaction(null,n) 
	    else this.resolvenoaction(this.next(),n);
	}.bind(this);
    },
    showattack: function() {
	$("#attackdial").empty();
	if (forced==true || (phase==COMBAT_PHASE&&skillturn==this.skill)) {
	    if (this.canfire()) {
		var r=this.gethitrangeallunits();
		$("#attackdial").empty();
		for (i=1; i<=3; i++) {
		    for (j=0; j<r[i].length; j++) {
			for (w=0; w<r[i][j].wp.length; w++) {
			    var wp=r[i][j].wp[w];
			    if (wn.indexOf(wp)==-1) wn.push(wp);
			}
		    }
		}
		var n=this.next();
		if (n>-1) this.selecttargetforattack(wn[n]);
		else {
		    this.hasfired+=; this.show(); this.deferred.resolve();
		}
	    } else if (!this.hasfired) {
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
		//log("adding attackmodd");
		//str+="<td id='moda"+(i+ATTACKMODA.length)+"' class='"+a.str+"modtokend' onclick='modroll(ATTACKMODD["+i+"].f,"+da+","+(i+ATTACKMODA.length)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length//+ATTACKMODD.length;
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
	    $("#atokens").append("<button onclick='$(\"#atokens\").empty(); targetunit.defenseroll("+defense+").done(function(roll) { targetunit.dodefenseroll(roll,"+defense+","+me+","+n+")})'>Done</button>");
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
	i=DEFENSEMODD.length+this.DEFENSEMODD.length
	for (j=0; j<this.DEFENSEADD.length; j++) {
	    var a=this.DEFENSEADD[j];
	    if (a.req(dr,dd)) adddefensedie(a.f,dd,i+j);
	}   
	$("#dtokens").append("<button>");
	$("#dtokens > button").text("Fire!").click(function() {
		$("#combatdial").hide();
		this.resolvedamage();
		this.endnoaction(incombat);
		this.incombat=-1;
	    }.bind(squadron[me])).show();
	//log("defense roll: f"+f+" e"+e+" b"+(dd-e-f));
    },
};

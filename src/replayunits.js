function ReplayUnit() {
}

ReplayUnit.prototype= {
    next: function() {
	var p=REPLAY[replayid++].split("_");
	if (p[0]=="select") {
	    for (var i=0; i<squadron.length; i++) 
		if (squadron[i].id==p[1]) {
		    squadron[i].select(); return this.next(); 
		}
	}
	this.log("<span style='color:white;background:blue'>"+p[0]+":"+p[1]+"</span>");
	return p;
    },
    resolveactionselection: function(units,cleanup) {
	cleanup(this.next()[1]);
    },
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var resolve=function(m,k,f) {
	    if (automove) this.m=m;
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (var i=0; i<mine.length; i++) {
		    OBSTACLES[mine[i]].detonate(this)
		}
	    f(this,k);
	    this.show();
	}.bind(this);
	var n=next()[1];
	if (n==-1) resolve(this.m,-1,cleanup);
	else resolve(moves[n],n,cleanup);
    },
    selectcritical: function(crits,endselect) {
	endselect(crits[this.next()[1]]);
    },
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var n=this.next()[1];
	if (n>-1) { this.m=moves[n]; cleanup(this,n); }
	else cleanup(this,-1);
    },
    timetoshowmaneuver: function() {
	return this.maneuver>-1 && phase==ACTIVATION_PHASE&&skillturn==this.skill;
    },
    doplan: function() {
	this.setmaneuver(this.next()[1]);
    },
    showdial: function() {
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.dialspeed.attr({text:""});
		this.dialdirection.attr({text:""});
		return;
	    }
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
    doactivation:function() {
	this.log("REPLAY: doactivation");
	if (!this.timeformaneuver())  return;
	var ad=this.updateactivationdial();
	for (var n=this.next()[1];n>=0; n=this.next()[1]) {
	    ad[i].action();
	}
	this.log("RESOLVEMANEUVER");
	this.resolvemaneuver();
    },
    attackroll:function(n) {
	var i,f,h,c;
	var P=this.getattacktable(n);
	var ptot=0;
	var r=this.next()[1];
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
    rand: function(n) { return this.next()[1]; },
    defenseroll:function(n) {
	var i,e,f;
	var lock=$.Deferred();
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=this.next()[1];
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
	    var nn=this.next()[1];
	    this.select();
	    if (nn==-1) this.resolvenoaction(null,n) 
	    else this.resolvenoaction(list[nn],n);
	}.bind(this));
    },
    doaction: function(list,str) {
	return this.enqueueaction(function(n) {
	    var nn=this.next()[1];
	    this.select();
	    if (nn==-1) this.resolvenoaction(null,n) 
	    else this.resolvenoaction(list[nn],n);
	}.bind(this));
    },
    showattack: function() {
	$("#attackdial").empty();
    },
    doattack: function(forced) {
	if (forced==true || (phase==COMBAT_PHASE&&skillturn==this.skill)) {
	    if (this.canfire()) {
		var wn=[];
		var r=this.gethitrangeallunits();
		for (i=1; i<=3; i++) {
		    for (j=0; j<r[i].length; j++) {
			for (w=0; w<r[i][j].wp.length; w++) {
			    var wp=r[i][j].wp[w];
			    if (wn.indexOf(wp)==-1) wn.push(wp);
			}
		    }
		}
		this.log("DOATTACK");
		var n=this.next()[1];
		if (n>-1) { 
		    this.activeweapon=n;
		    this.log("SELECTFORATTACK")
		    this.selecttargetforattack(wn[n]);
		} else {
		    this.log("NOSELECTFORATTACK");
		    this.hasfired++; this.show(); this.deferred.resolve();
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
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	displayattackroll(ar,da);
	var p=this.next();
	while (p[0]!="doattackroll") {
	    if (p[0]=="attackreroll") {
		var ar=ATTACKREROLLA.concat(this.ATTACKREROLLA);
		var a=ar[p[1]];
		var n=a.n();
		var s=0;
		var n=a.n();
		if (a.type.indexOf("blank")>-1) s+=n;
		if (a.type.indexOf("focus")>-1) s+=10*n;
		if (a.type.indexOf("hit")>-1) s+=100*n;
		if (a.type.indexOf("critical")>-1) s+=1000*n;
		reroll(n,true,s,p[1]);
	    } else if (p[0]=="attackmod") {
		var mods=ATTACKMODA.concat(ATTACKMODD).concat(this.ATTACKMODA);
		modroll(mods[p[1]].f,n,p[1]);
	    } else if (p[0]=="attackadd") {
		addroll(this.ATTACKADD[p[1]],n,p[1]);
	    }
	    p=this.next();
	}
	$("#atokens").empty();
	targetunit.defenseroll(defense).done(function(roll) {
	    targetunit.dodefenseroll(roll,defense,me,n);
	});
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
	var p=this.next();
	while (p[0]!="dodefenseroll") {
	    if (p[0]=="defensererolld") {
		var l=DEFENSEREROLLD.concat(this.DEFENSEREROLLD);
		doreroll(l[p[1]],p[1]);
	    } else if (p[0]=="defensemodd") {
		var mods=DEFENSEMODD.concat(this.DEFENSEMODD);
		modrolld(mods[p[1]].f,n,p[1]);
	    } else if (p[0]=="defenseadd") {
		addrolld(this.DEFENSEADD[p[1]].f,n,p[1]);
	    }
	    p=this.next();
	}
	$("#combatdial").hide();
	squadron[me].resolvedamage();
	squadron[me].endnoaction(incombat);
	squadron[me].incombat=-1;
    }
};

function IAUnit() {
}

IAUnit.prototype= {
    computemaneuver: function() {
	var i,j,k,d;
	var p=[];
	var q=[];
	var possible=[];
	var gd=this.getdial();
	log("Moves for "+this.name);
	// Find all possible future positions of enemies
	for (i=0; i<squadron.length; i++) 
	    if (squadron[i].team!=this.team) {
		var u=squadron[i];
		var sgd=u.getdial();
		for (j=0; j<sgd.length; j++) 
		    p.push(u.getOutlinePoints(u.getpathmatrix(u.m.clone(),sgd[j].move)));
	    }
	// Find all possible moves, with no collision and units in range 
	for (i=0; i<gd.length; i++) { 
	    var n=0;
	    var c=this.m.clone();
	    if (gd[i].move.match(/K\d|SL\d|SR\d/)) c=c.add(MR(180,0,0));
	    var mm=this.getpathmatrix(c,gd[i].move);
	    var collision=false;
	    if (!this.isinzone(mm)) collision=true;
	    if (!collision) {
		var o1=this.getOutline(mm);
		// Overlapping obstacle ? 
		for (k=0; k<OBSTACLES.length; k++){
		    if (this.isintersecting(OBSTACLES[k].getOutlinePoints(),o1)) { 
			collision=true; 
			break;
		    }
		}
		o1.remove();
	    }
	    if (!collision) {
		possible.push(i);
		var s=this.getSectorString(3,mm);
		for (j=0; j<p.length; j++) if (this.isintersecting(p[j],s)) n++;
		if (n>0) q.push({n:n,m:i});
	    } 
	}
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    d=q[0].m;
	    log("finding best out of "+(gd.length*p.length)+" positions:"+gd[d].move)
	} else {
	    for (d=0; d<possible.length; d++) {
		if (gd[possible[d]].move.match(/F\d/)) break;
	    }
	    if (d==possible.length) d=0;
	    //log("finding by default "+gd[possible[d]].move);
	    d=possible[d];
	}
	return d;
    },
    freeaction: function(endfree) {
	endfree(); // Does nothing when given a free action...
    },
    resolveactionselection: function(units,cleanup) {
	cleanup(0);
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
    beginplanningphase: function() {
	if (this.maneuver==-1) {
	    var process=setInterval(function() {
		this.maneuver=this.computemaneuver();	
		nextstep();
		clearInterval(process);
	    }.bind(this),200);
	}
    },
    timetoshowmaneuver: function() {
	return this.maneuver>-1 && phase==ACTIVATION_PHASE;
    },
    showdial: function() {
	$("#move").css({display:"none"});
	$("#maneuverdial").empty();
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
    beginactivation: function() {
	this.resolvemaneuver();
    },
    showactivation: function() {
	$("#activationdial").empty();
	if (this.timeformaneuver()) this.resolvemaneuver();
    },
    endmaneuver: function() {
	this.ionized=0;
	this.action=-1;
	this.updateactionlist();
	$("#actiondial").empty();
	if (this.canuncloak()) {
	    // this.usecloack() ?
	}
	if (this.candoaction()&&!this.actiondone) {
	    this.actiondone=true;
	    var focus=this.actionList.indexOf("FOCUS");
	    var evade=this.actionList.indexOf("EVADE");
	    if (focus>-1&&this.candofocus()) { this.actionsdone.push("FOCUS"); this.addfocus();}
	    else if (evade>-1&&this.candoevade()) { this.actionsdone.push("EVADE"); this.addevade();  }
	    else this.endaction();
	}  else this.endaction();
    },
    showaction: function() {
	$("#actiondial").empty();
	this.updateactionlist();
	if (this.action<this.actionList.length && this.action>-1) {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});	
    },
    selecttargetforattack: function(wp) {
	var p=this.weapons[wp].getrangeallunits(); 
	var i;
	var q=[];
	for (i=0; i<p.length; i++) if (p[i].team!=this.team) q.push(p[i]);
	if (q.length==0) return false;
	/* Selects first unit available */
	this.declareattack(wp,q[0]); 
	this.resolveattack(wp,q[0]);
	return true;
    },
    beginattack: function() {
	var wn=[];
	var i,j,w;
	if (this.canfire()) {
	    var r=this.gethitrangeallunits();
	    for (i=1; i<=3; i++) {
		for (j=0; j<r[i].length; j++) {
		    for (w=0; w<r[i][j].wp.length; w++) {
			var wp=r[i][j].wp[w];
			if (wn.indexOf(wp)==-1) wn.push(wp);
		    }
		}
	    }
	    this.selecttargetforattack(wn[0]);
	}
    },
    showattack: function() {
	$("#attackdial").empty();
    },
    getusabletokens: function(i,isforcombat) {
	var str=""; var targets="";
	targets="";
	if (this.focus>0) str+="<td title='"+this.focus+" focus token(s)' class='xfocustoken'></td>";
	if (this.evade>0) str+="<td title='"+this.evade+" evade token(s)' class='xevadetoken'></td>";
	for (var j=0; j<this.targeting.length; j++) targets+=this.targeting[j].name+" ";
	if (targets!="") str+="<td title='targeting "+targets.replace(/\'/g,"&#39;")+"' class='xtargettoken'></td>";
	targets="";
	for (var j=0; j<this.istargeted.length; j++) targets+=this.istargeted[j].name+" ";
	if (targets!="") str+="<td title='targeted by "+targets.replace(/\'/g,"&#39;")+"' class='xtargetedtoken'></td>";
	if (this.stress>0) str+="<td title='"+this.stress+" stress token(s)' class='xstresstoken'></td>";	
	if (this.ionized>0) str+="<td title='"+this.ionized+" ionization token(s)' class='xionizedtoken'></td>";	
	return str;
    },
    attackroll: function(n) {
	var i,f,h,c;
	var P=this.getattacktable(n);
	var ptot=0;
	var r=Math.random();
	for (f=0; f<=n; f++) {
	    for (h=0; h<=n-f; h++) {
		for (c=0; c<=n-f-h; c++) {
		    i=f*100+h+10*c;
		    ptot+=P[i];
		    if (ptot>r) {
			if (this.canusefocus() && f>0) { 
			    this.usefocus(); 
			    return c*10+h+f;
			}
			return f*100+c*10+h;
		    }
		}
	    }
	}
	return 0;
    },
    defenseroll: function(n) {
	var i,e,f;
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=Math.random();
	if (n==0) return 0;
	if (typeof P=="undefined") {
	    //console.log("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*10+e;
		ptot+=P[i];
		if (ptot>r) { 
		    if (this.canuseevade()) { this.useevade(); e++; }
		    if (this.canusefocus()) return f+e;
		    return 10*f+e;
		}
	    }
	}
	return 0;
    },
};

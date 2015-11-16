function Robots() {
}

Robots.prototype= {
    resolveactionselection: function(units,cleanup) {
	// read k
	if (units.length==0) cleanup(-1);
	else cleanup(k);
    },
    resolveactionmove: function(moves,cleanup,automove,possible) {
	// read k;
	for (i=0; i<moves.length; i++) {
	    var p=this.getpossibleoutline(moves[i]);
	    if (possible||p.b) {
		p.ol.attr({display:"block"});
		this.pos.push({ol:p.ol,k:i});
	    } else p.ol.remove();
	}
	if (this.pos.length>0) {
	    var m=moves[k];
	    if (automove) {
		this.m=m;
	    }
	    cleanup(this,k);
	    this.show();
	} else { cleanup(this,-1); this.show();}
    },
    beginplanningphase: function() {
	if (this.maneuver==-1) {
	    var process=setInterval(function() {
		this.maneuver=this.getmaneuver();	
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

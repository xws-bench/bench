Iaunit.prototype= {
    showdial: function() {
	var gd=this.getdial();
	$("#move").css({display:"none"});
	$("#maneuverdial").empty();
	if (phase==PLANNING_PHASE&&activeunit==this&&this.maneuver==-1) {
	    log("IA show dial");
	    var d=Math.floor(Math.random()*gd.length);
	    this.setmaneuver(d);
	}
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.dialspeed.attr({text:""});
		this.dialdirection.attr({text:""});
		return;
	    };
	    d = gd[this.maneuver];
	    var c  =C[d.difficulty];
	    if (!(activeunit==this)) {
		c = halftone(c);
	    }
            this.dialspeed.attr({text:P[d.move].speed,fill:c});
            this.dialdirection.attr({text:P[d.move].key,fill:c});
	}
    },
    showaction: function() {
	var str="";
	var name;
	this.updateactionlist();
	$("#actiondial").empty();
	if (this.canuncloak()) {
	    // this.usecloack() ?
	}
	if (this.candoaction()) {
	    var focus=this.actionList.indexOf("FOCUS");
	    var evade=this.actionList.indexOf("EVADE");
	    if (focus>-1&&this.candofocus()) this.action=focus;
	    else if (evade>-1&&this.candoevade()) this.action=evade;
	    resolveaction();
	} else this.endaction();
	if (this.action>this.actionList.length && this.action>-1) {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});	
    },
    showattack: function() {
	var wn=[];
	var i,j,w;
	$("#attackdial").empty();
	if (phase==COMBAT_PHASE&&waitingforaction==0&&skillturn==this.skill&&this.canfire()) {
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
    getusabletokens: function(i,isforcombat) {
	var str=""; var targets="";
	targets="";
	for (var j=0; j<this.istargeted.length; j++) targets+=this.istargeted[j].name+" ";
	if (targets!="") str+="<div title='targeted by "+targets.replace(/\'/g,"&#39;")+"' class='xtargetedtoken'></div>";
	if (this.stress>0) str+="<div title='"+this.stress+" stress token(s)' class='xstresstoken'></div>";	
	if (this.ionized>0) str+="<div title='"+this.ionized+" ionization token(s)' class='xionizedtoken'></div>";	
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

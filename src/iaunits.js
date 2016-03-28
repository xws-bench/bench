var IACOMPUTING=0;
function IAUnit() {
}

IAUnit.prototype= {
    computemaneuver: function() {
	var i,j,k,d=0;
	var q=[],possible=-1;
	var gd=this.getdial();
	//var enemies=[];
	var s=this.getskill();
	for (i in squadron) {
	    var u=squadron[i];
	    var us=u.getskill();
	    u.oldm=u.m;
	    //console.log("setting oldm");
	    if (us<s) {
		if (u.team!=this.team) {
		    if (u.meanmround!=round) u.evaluatemoves(false,false);
		    u.m=u.meanm;
		} else {
		    //Be safe
		    if (typeof u.futurem=="undefined") u.futurem=u.m;
		    u.m=u.futurem;
		}
	    }
	}
	this.evaluatemoves(true,true);
	//console.log(this.name+"end evaluates move");
	//log("computing all enemy positions");
	// Find all possible future positions of enemies
	var k=0;
	/*for (i in squadron) {
	    var u=squadron[i];
	    if (u.team!=this.team) {
		if (u.meanmround!=round) u.evaluatemoves(false,false);
		u.oldm=u.m;
		u.m=u.meanm;
		enemies.push(u);
	    }
	}*/
	var findpositions=function(gd) {
	    var q=[],c,j,i;
	// Find all possible moves, with no collision and with units in range 
	    var COLOR=[GREEN,WHITE,YELLOW];
	    //log("find positions with color "+c);
	    for (i=0; i<gd.length; i++) {
		var d=gd[i];
		if (d.color==BLACK) continue;
		var mm=this.getpathmatrix(this.m,gd[i].move);
		var n=12-4*COLOR.indexOf(d.color);
		if (d.color==RED) n-=20;
		var n0=n;
		var oldm=this.m;
		this.m=mm;
		n+=this.evaluateposition();
		if (d.difficulty=="RED") n=n-1.5;
		//this.log(d.move+" "+d.color+" "+n);
		this.m=oldm;
		//this.log(d.move+":"+n+"/"+n0+" "+d.color);
		q.push({n:n,m:i});
	    }
	    return q;
	}.bind(this);
	q=findpositions(gd);
	// Restore position
	for (i in squadron) squadron[i].m=squadron[i].oldm;
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
	this.futurem=this.getpathmatrix(this.m,gd[d].move);
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
	var score=-1000;
	var scorei=-1;
	var old=this.m;
	for (i=0; i<moves.length; i++) {
	    var c=this.getmovecolor(moves[i],true,true);
	    if (c==GREEN) {
		ready=true;
		this.m=moves[i];
		var e=this.evaluateposition();
		if (score<e) { score=e; scorei=i; }
	    }
	}
	this.m=old;
	if (ready&&scorei>-1) { 
	    if (automove) {
		var gpm=moves[scorei].split();
		var tpm=this.m.split();
		s.path("M "+tpm.dx+" "+tpm.dy+" L "+gpm.dx+" "+gpm.dy).attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",strokeLinecap:"round",strokeDasharray:"1, 30",opacity:0.2,fill:"rgba(0,0,0,0)"}).addClass("trace");//.appendTo(VIEWPORT);

	    	this.m=moves[scorei]; 
		gpm=this.m.split();
		this.movelog("am-"+Math.floor(300+gpm.dx)+"-"+Math.floor(300+gpm.dy)+"-"+Math.floor((360+Math.floor(gpm.rotate))%360));
	    }
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    if (typeof OBSTACLES[mine[i]].detonate=="function") 
			OBSTACLES[mine[i]].detonate(this)
		    else {
			this.log("colliding with obstacle");
			this.resolveocollision(1,0);
		    }
		}
	    cleanup(this,scorei); 
	}
	else { this.m=old; cleanup(this,-1); }
    },
    timetoshowmaneuver: function() {
	/*if (phase==ACTIVATION_PHASE&&this.maneuver>-1) 
	    this.log("show ? "+(skillturn==this.skill)+" "+this.skill+" "+skillturn);*/
	return this.maneuver>-1 && phase==ACTIVATION_PHASE&&skillturn==this.getskill();
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
	    //p=($.Deferred()).resolve()
	    p=setInterval(function() {
		var m=this.computemaneuver(); 
		IACOMPUTING--;
		if (IACOMPUTING==0) $("#npimg").html("&#10097;");
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
		this.clearmaneuver();
		return;
	    };
	}
    },
    resolvedecloak: function() {
	this.resolveactionmove(this.getdecloakmatrix(this.m),
			       function(t,k) {
				   if (k>0) {
				       t.agility-=2; t.iscloaked=false;
				       SOUNDS.decloak.play();
				   }
				   this.hasdecloaked=true;
			       }.bind(this),true);
    },
    showactivation: function() {
    },
    doactivation: function() {
	var ad=this.updateactivationdial();
	if (this.timeformaneuver()) {
	    //this.log("resolvemaneuver");
	    this.resolvemaneuver();
	} //else this.log("no resolvemaneuver");
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
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="EVADE"&&this.candoevade()) {
			var noone=true;
			var grlu=this.getenemiesinrange();
			for (i=0; i<grlu.length; i++) 
			    if (grlu[i].length>0) { noone=false; break; }
			if (noone) { a=list[i]; break; }
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		this.resolvenoaction(a,n);
	    }.bind(this),"donoaction ia");
    },
    setpriority:function(action) {
	var PRIORITIES={"FOCUS":3,"EVADE":1,"CLOAK":4,"TARGET":2,"CRITICAL":10};
	var p=PRIORITIES[action.type];
	if (typeof p=="undefined") p=0;
	action.priority=p;
	var pl=[];
	if (action.type=="BOOST") pl=this.getboostmatrix(this.m);
	if (action.type=="ROLL") pl=this.getrollmatrix(this.m);
	if (pl.length>0) {
	    var old=this.m;
	    var e=this.evaluateposition();
	    var emove=e-1;
	    for (i=0; i<pl.length; i++) {
		this.m=pl[i];
		emove=Math.max(emove,this.evaluateposition());
	    }
	    this.m=old;
	    if (emove>e) action.priority=2*(emove-e);
	}
	//log(this.name+": priority for "+action.type+":"+action.priority);
    }, 
    doaction: function(list,str) {
	var cmp=function(a,b) { return b.priority-a.priority; }

	for (i=0; i<list.length; i++) {
	    this.setpriority(list[i]);
	}
	list.sort(cmp);

	//this.log("inside doaction "+list.length);
	if (list.length==0) return this.enqueueaction(function(n) {
	    this.endnoaction(n);
	}.bind(this));
	return this.enqueueaction(function(n) {
	    if (this.candoaction()) {
		this.select();
		if (typeof str!="undefined") this.log(str);
		var a=null;
		for (i=0; i<list.length; i++) {
		    //this.log("action possible:"+list[i].type);
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="CLOAK"&&this.candocloak()) {
			a=list[i]; break;
		    } else if (list[i].type=="EVADE"&&this.candoevade()) {
			var noone=true;
			var grlu=this.getenemiesinrange();
			for (i=0; i<grlu.length; i++) 
			    if (grlu[i].length>0) { noone=false; break; }
			if (noone) { a=list[i]; break; }
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		if (a==null) this.log("no possible action");
		//if (a!=null) this.log("action chosen: "+a.type);
		//else this.log("null action chosen");
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
	//this.log("attack?"+forced+" "+skillturn+" "+this.skill+" "+this.canfire());
	if (forced==true||(phase==COMBAT_PHASE&&skillturn==this.getskill())) {
	    var power=0,t=null;
	    var i,w;
	    if (this.canfire()) {
		NOLOG=true;
		var r=this.getenemiesinrange();
		for (w=0; w<this.weapons.length; w++) {
		    var el=r[w];
		    for (i=0;i<el.length; i++) {
			var p=this.getattackstrength(w,el[i]);
			if (p>power&&!el[i].isdocked) { 
			    //this.log("power "+power+" "+el[i]);
			    t=el[i]; power=p; this.activeweapon=w; 
			}
		    }
		}
		NOLOG=false;
		//this.log("ia/doattack >"+wn[0].name+" "+t.name);
      		if (t!=null) return this.selecttargetforattack(this.activeweapon,t);
		//console.log("ia/doattack "+this.name+"<select target");
	    }
	    //console.log("ia/doattack:no target");
	    this.hasfired++; this.deferred.resolve();
	}
    },
    getresultmodifiers: function(m,n,from,to) {
	var mods=this.getdicemodifiers(); 
	var lm=[];
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to) {
		if (d.type==MOD_M&&d.req(m,n)) {
		    modroll(d.f,i,to);
		} if (d.type==ADD_M&&d.req(m,n)) {
		    addroll(d.f,i,to); 
		} if (d.type==REROLL_M&&d.req(activeunit,activeunit.weapons[activeunit.activeweapon],targetunit)) {
		    if (typeof d.f=="function") d.f();
		    reroll(n,(to==ATTACK_M),d,i);
		}
	    }
	}
	return lm;	
    }
};

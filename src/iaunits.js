var IACOMPUTING=0;
function IAUnit() {
}
/* TODO: getmaneuverlist instead of getdial */
IAUnit.prototype= {
    confirm: function(a) {
	return true;
    },

    guessevades: function(roll,promise) {
	if (this.rand(roll.dice+1)==FE_evade(roll.roll)) {
	    this.log("guessed correctly the number of evades ! +1 %EVADE% [%0]",self.name);
	    roll.roll+=FE_EVADE;
	    roll.dice+=1;
	}
	promise.resolve(roll);
    },

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
	    var COLOR=[GREEN,WHITE,YELLOW,RED];
	    //log("find positions with color "+c);
	    for (i=0; i<gd.length; i++) {
		var d=gd[i];
		if (d.color==BLACK) continue;
		var mm=this.getpathmatrix(this.m,gd[i].move);
		var n=24-8*COLOR.indexOf(d.color);
		if (d.color==RED) n-=20;
		if (d.color==BLACK) n=-100;
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

    resolveactionmove: function(moves,cleanup,automove,possible,scoring) {
	var i;
	var ready=false;
	var score=-1000;
	var scorei=-1;
	var old=this.m;
	for (i=0; i<moves.length; i++) {
	    var c=this.getmovecolor(moves[i],true,true);
	    if (c==GREEN) {
		var e;
		ready=true;
		if (typeof scoring=="array") e=scoring[i];  
		else {
		    this.m=moves[i];
		    e=this.evaluateposition();
		}
		if (score<e) { score=e; scorei=i; }
	    }
	}
	this.m=old;
	if (ready&&scorei>-1) { 
	    if (automove) {
		var gpm=moves[scorei].split();
		var tpm=this.m.split();
		s.path("M "+tpm.dx+" "+tpm.dy+" L "+gpm.dx+" "+gpm.dy).appendTo(VIEWPORT).attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",strokeLinecap:"round",strokeDasharray:"1, 30",opacity:0.2,fill:"rgba(0,0,0,0)"}).addClass("trace");
		this.show();

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
			this.resolveocollision(1,[]);
		    }
		}
	    cleanup(this,scorei); 
	}
	else { this.m=old; cleanup(this,-1); }
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
		if (IACOMPUTING==0) $("#npimg").html("&gt;");
		this.newm=this.getpathmatrix(this.m,this.getdial()[m].move);
		this.setmaneuver(m);
		clearInterval(p);
	    }.bind(this),0);
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
	var p=this.getdecloakmatrix(this.m);
	var move=this.getdial()[this.maneuver].move;
	var scoring=[];
	var old=this.m;
	for (var i=0; i<p.length; i++) {
	    this.m=this.getpathmatrix(p[i],move);
	    scoring[i]=this.evaluateposition();
	}
	this.m=old;
	this.resolveactionmove(p,
			       function(t,k) {
				   if (k>0) {
				       this.removecloaktoken();
				       t.show();
				   }
				   this.hasdecloaked=true;
			       }.bind(this),true,scoring);
    },

    showactivation: function() {
    },
    timetoshowmaneuver: function() {
	//this.log("this.maneuver "+this.maneuver)
	return this.maneuver>-1&&skillturn>=this.getskill()&&phase==ACTIVATION_PHASE&&subphase==ACTIVATION_PHASE;
    },

    doactivation: function() {
	var ad=this.updateactivationdial();
	if (this.timeformaneuver()) {
	    //this.log("resolvemaneuver");
	    this.resolvemaneuver();
	} else this.log("no resolvemaneuver");
    },

    showaction: function() {
	//this.log($("#actiondial").empty());
	$("#actiondial").empty();
	//this.log("this.action "+this.action);
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
		if (typeof str!="undefined"&&str!="") this.log(str);
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

    doaction: function(list,str,cando) {
	var i;
	var cmp=function(a,b) { return b.priority-a.priority; }
	if (typeof cando=="undefined") cando=this.candoaction;

	for (i=0; i<list.length; i++) {
	    this.setpriority(list[i]);
	}
	list.sort(cmp);
	if (list.length==0) return this.enqueueaction(function(n) {
	    this.endnoaction(n);
	}.bind(this));
	return this.enqueueaction(function(n) {
	    var i;
	    if (cando.call(this)) {
		this.select();
		if (typeof str!="undefined"&&str!="") this.log(str);
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="CLOAK"&&this.candocloak()) {
			a=list[i]; break;
		    } else if (list[i].type=="EVADE"&&this.candoevade()) {
			/*var noone=true;
			var grlu=this.getenemiesinrange();
			for (i=0; i<grlu.length; i++) 
			    if (grlu[i].length>0) { noone=false; break; }
			if (noone) { */
			    a=list[i]; break; //}
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		if (a==null) this.log("no possible action");
		if (a!=null) this.log("action chosen: "+a.type);
		else this.log("null action chosen");
		this.resolveaction(a,n);
	    } else {
		this.endaction(n);
	    }
	}.bind(this),"doaction ia");
    },

    showattack: function() {
	//$("#attackdial").empty();
	//this.log("showattack");
    },

    doattack: function(weaponlist,enemies) {
	//this.log("ia/attack?"+this.id+" forced:"+forced+" turn:"+(skillturn==this.skill));
	var power=0,tp=null;
	var i,w;
	var wp=null
	//this.log(this.id+" readytofire?"+this.canfire());
	//NOLOG=true;
	if (typeof weaponlist=="undefined") weaponlist=this.weapons;

	var r=this.getenemiesinrange(weaponlist,enemies);
	for (w=0; w<weaponlist.length; w++) {
	    var el=r[w];
	    var wp=this.weapons.indexOf(weaponlist[w]);
	    for (i=0;i<el.length; i++) {
		var p=this.evaluatetohit(wp,el[i]).tohit;
		//this.log("power "+p+" "+el[i].name);
		if (p>power&&!el[i].isdocked) {
		    tp=el[i]; power=p; this.activeweapon=wp; 
		}
	    }
	}
	//NOLOG=false;
   	if (tp!=null) return this.selecttargetforattack(this.activeweapon,[tp]);
	this.addhasfired(); 
	this.cleanupattack();
	return false;
    },

    getresultmodifiers: function(m,n,from,to) {
	var mods=this.getdicemodifiers(); 
	var lm=[];
	//var mm;
	NOLOG=false;
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to) {
		if (d.type==MOD_M&&d.req(m,n)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) 
			modroll(d.f,i,to);
		} if (d.type==ADD_M&&d.req(m,n)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) 
			addroll(d.f,i,to);
		} if (d.type==REROLL_M&&d.req(activeunit,activeunit.weapons[activeunit.activeweapon],targetunit)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) {
			if (typeof d.f=="function") d.f();
			reroll(n,from,to,d,i);
		    }
		}
	    }
	}
	return lm;	
    }
};

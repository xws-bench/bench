var IACOMPUTING=0;
var JOUSTER=0,ALONE=1;
function IAUnit() {
};
IAUnit.prototype = {
    /* TODO: getmaneuverlist instead of getdial */
    IAinit:function() {
	// create environment
        // N.B.: these values are only used by IAunits2.js code; modifying the
        // default init object instead of overriding it prevents breaking some
        // upgrades like IG-2000/IG-88D/Nashtah Pup Pilot that explicitly call .init()
        if(typeof this.init!=="undefined"){
            this.init.shield=this.shield;
            this.init.hull=this.hull;
            this.init.m=this.m;
        }
	else{
            this.init={
                shield:this.shield,
                hull:this.hull,
                m:this.m
            };
        }
        this.ia = true;
    },
	/*
	 if (this.team==1) return;
	     this.env = {};
	     this.env.getNumStates = function() { return OBSTACLES.length*2+squadron.length*3; }
	     this.env.getMaxNumActions = function() { return this.getdial().length; }.bind(this);
	     
	// create the agent, yay!
	     this.spec={ update : 'qlearn', // qlearn | sarsa
	     gamma : 0.9, // discount factor, [0, 1)
	     epsilon : 0.2, // initial epsilon for epsilon-greedy policy, [0, 1)
	     alpha : 0.01, // value function learning rate
	     experience_add_every : 10, // number of time steps before we add another experience to replay memory
	     experience_size : 5000, // size of experience replay memory
	     learning_steps_per_iteration : 20,
	     tderror_clamp : 1.0, // for robustness
	     num_hidden_units : 100 // number of neurons in hidden layer
	     }
	     this.agent = new RL.DQNAgent(this.env, this.spec); 
	     var self=this;
	     this.wrap_before("applydamage",this,function(n) {
	     console.log("reward -"+n);
	     this.reward-=n;
	     });
	this.wrap_before("applycritical",this,function(n) {
	     console.log("reward -"+n);
	     this.reward-=n;
	     });
	     this.wrap_after("hashit",this,function(t,b) {
	     if (b) {
	     this.reward+=this.hitresolved*2+this.criticalresolved*4;
	     console.log("reward +"+(this.hitresolved*2+this.criticalresolved*4));
	     }
	     return b;
	});
	     this.wrap_before("endround",this,function(c,h,t) {
	     console.log("learn: "+this.reward);
	     this.agent.learn(this.reward);
	     });
	*/
    confirm(a) { return true;},
    chooseBombDrop(positions){
        //Note: Snap.Matrix.e = dx from 0; Snap.Matrix.f = dy from 0
        if(positions.length<=1) return positions;
        var index,tempDist,distance=9999.9,dx,dy,ship,centroid,victims=[];
        // Get all enemies within 3 of this ship; farther ships don't really matter
        for(i in squadron){
            ship=squadron[i];
            if(this.isenemy(ship) && this.getrange(ship)<=3) 
                victims.push(ship.m);
        }
        // Find the average center point amongst all victims (or just the .m if 1 victim)
        if(victims.length===1) centroid=victims[0];
        else{
            var x=0,y=0;
            for (v in victims){
                x+=victims[v].e;
                y+=victims[v].f;
            }
            x=x*1.0/victims.length;
            y=y*1.0/victims.length;
            centroid=new Snap.Matrix(1,0,0,1,x,y);
        }
        // Find the closest bomb position to the centroid.  This cuts down cycles used
        for(var pos in positions){
            dx=Math.abs(positions[pos].e - centroid.e);
            dy=Math.abs(positions[pos].f - centroid.f);
            tempDist=Math.sqrt(dx*dx+dy*dy);
            if(tempDist<distance){
                index=pos;
                distance=tempDist;
            }
        }
        return [positions[index]];  // Return a length 1 array for easy handling
        
    },
    guessevades(roll,promise) {
	if (this.rand(roll.dice+1)==Unit.FE_evade(roll.roll)) {
	    this.log("guessed correctly the number of evades ! +1 %EVADE% [%0]",self.name);
	    roll.roll+=Unit.FE_EVADE;
	    roll.dice+=1;
	}
	promise.resolve(roll);
    },
    findpositions(gd) {
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
	    var oldm=this.m;
	    this.m=mm;
	    var ep=this.evaluateposition();
	    n+=ep.self-ep.enemy-ep.dist;
	    if (d.difficulty=="RED") n=n-1.5;
	    //this.log(d.move+" "+d.color+" "+n);
	    this.m=oldm;
	    //this.log(d.move+":"+n+"/"+n0+" "+d.color);
	    q.push({n:n,m:i});
	}
	return q;
    },
    findallpositions(gd) {
	var i,j,n,q=[];
	var COLOR=[GREEN,WHITE,YELLOW,RED,BLACK];

	for (j=0;j<gd.length; j++) {
	    var d=gd[j];
	    n=24-8*COLOR.indexOf(d.color);
	    if (d.color==WHITE) n+=8;
	    if (d.color==RED) n-=20;
	    if (d.color==BLACK) n=-100;
	    if (d.difficulty=="RED") n=n-1.5;
	    //var nn=0;
	    //var nnn=0;
	    n=n*this.squad.length;
	    for (i=0; i<this.squad.length; i++) {
		var u=this.squad[i];
		var mm=u.getpathmatrix(u.m,gd[j].move);
		var oldm=u.m;
		u.m=mm;
		var ep=u.evaluateposition();
		n+=ep.self-1.0*ep.enemy-ep.dist;// TODO: enemy attacks all members of a team...
		//nn+=ep.dist;
		//nnn+=ep.self-ep.enemy;
		u.m=oldm;
	    }
	    //console.log(gd[j].move+"->"+n+" "+d.color+" dist:"+nn+" "+nnn);
	    q.push({n:n,m:j});
	}
	return q;
    },
    computeallmaneuvers() {
	var i,j,k,d=0;
	var q=[],possible=-1;
	var s=this.getskill();
	for (i in squadron) {
	    var u=squadron[i];
	    var us=u.getskill();
	    u.oldm=u.m;
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
	this.evaluategroupmoves();
	q=this.findallpositions(this.captaingd);
	// Restore position
	for (i in squadron) squadron[i].m=squadron[i].oldm;
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    var mm=this.captaingd[q[0].m].idx;
	    var move=this.captaingd[q[0].m].move;
	    for (i=0; i<mm.length; i++) {
		u=this.squad[i];
		u.lastmaneuver=u.maneuver;
		u.maneuver=mm[i];
		u.futurem=u.getpathmatrix(u.m,move);
	    }
	    nextplanning();
	} else {
	    console.log("(q=vide) UNDEFINED GD FOR "+this.name);
	}
	this.log("Group maneuver set");//+":"+d+"/"+q.length+" possible?"+possible+"->"+gd[d].move);
    },
    computemaneuver() {
	var i,j;
	var gd=this.getdial();
	var s=this.getskill();
	for (i in squadron) {
	    var u=squadron[i];
	    var us=u.getskill();
	    u.oldm=u.m;
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
	var q=this.findpositions(gd);
	// Find all possible future positions of enemies
	var d;
	// Restore position
	for (i in squadron) squadron[i].m=squadron[i].oldm;
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    d=q[0].m;
	} else {
	    for (i=0; i<gd.length; i++) 
		if (gd[i].difficulty!="RED"||gd[i].move.match(/F\d/)) break;
	    d=i;
	}
	this.futurem=this.getpathmatrix(this.m,gd[d].move);
	this.log("Maneuver set");//+":"+d+"/"+q.length+" possible?"+possible+"->"+gd[d].move);
	return d;
    },
    resolveactionselection(units,cleanup) {
	cleanup(0);
    },
    selectcritical(crits,endselect) {
	for (var i=0; i<crits.length; i++) {
	    if (CRITICAL_DECK[crits[i]].lethal==false) {
		endselect(crits[i]); return;
	    }
	}
	endselect(crits[0]);
    },
    resolveactionmove(moves,cleanup,automove,possible,scoring) {
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
		    var ep=this.evaluateposition();
		    e=ep.self-ep.enemy-ep.dist;
		    //e=this.evaluateposition();
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
    doplan() {
	$("#move").css({display:"none"});
	$("#maneuverdial").empty();
	this.squad=[];
	if (this.behavior==JOUSTER) {
	    var sq=this.squad;
	    for (var i in sq) {
		sq[i].captain=null;
		sq[i].squad=[];
	    }
	    this.electcaptain(); // reelects a new captain each turn
	}
	/*if (this.group==-1) {
	    this.group=TEAMS[this.team].groups++;
	    p=this.selectnearbyally(1,function(s,t) {
		if (s.group>-1||s.group<t.group) t.group=s.group;
	    });
	}*/
	if (this.behavior==JOUSTER) {
	    if (this==this.captain) {
		console.log("captain for team "+this.team+" is:"+this.name);
		console.log("surrounded by "+this.selectnearbyally(3).length+" units");
		IACOMPUTING++;
		if (IACOMPUTING==1) {
		    $("#npimg").hide();
		    $("#npimgwait").show();
		}
		var p;
		p=setInterval(function() {
		    this.computeallmaneuvers();
		    IACOMPUTING--;
		    if (IACOMPUTING==0) {
			$("#npimg").show();
			$("#npimgwait").hide();
		    }
		    clearInterval(p);
		}.bind(this),0);
	    } else {
		if (this.maneuver==-1) this.maneuver=0;
		nextplanning();
	    }
	}else {
	/* Not for captain management. */
	    if (phase==PLANNING_PHASE&&this.maneuver==-1) {
		IACOMPUTING++;
		if  (IACOMPUTING==1) {
		    $("#npimg").hide();
		    $("#npimgwait").show();
		}
		var p;
		p=setInterval(function() {
		    var m=this.computemaneuver(); 
		    IACOMPUTING--;
		    if (IACOMPUTING==0) {
			$("#npimg").show();
			$("#npimgwait").hide();
		    }
		    this.newm=this.getpathmatrix(this.m,this.getdial()[m].move);
		    this.setmaneuver(m);
		    clearInterval(p);
		}.bind(this),0);
	    }
	}
	    /*else { 
	    if (this.maneuver==-1) this.maneuver=0;
	    nextplanning();
	}*/
	return this.deferred;
    },
    showdial() { 	
	$("#maneuverdial").empty();
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.clearmaneuver();
		return;
	    };
	}
    },
    resolvedecloak() {
	var p=this.getdecloakmatrix(this.m);
	var move=this.getdial()[this.maneuver].move;
	var scoring=[];
	var old=this.m;
	for (var i=0; i<p.length; i++) {
	    this.m=this.getpathmatrix(p[i],move);
	    var ep=this.evaluateposition();
	    scoring[i]=ep.self-ep.enemy-ep.dist;
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
    showactivation() {
    },
    timetoshowmaneuver() {
	return this.maneuver>-1&&skillturn>=this.getskill()&&phase==ACTIVATION_PHASE&&subphase==ACTIVATION_PHASE;
    },
    updateactivationdial: function() { //IAUnits-specific version
	var self=this;
	this.activationdial=[]; // We treat this like an action list for donoaction()
	if (this.candropbomb()&&(this.hasionizationeffect())) {
	    //this.log("ionized, cannot drop bombs");
	} else if (self.lastdrop!=round) {
	    switch(this.bombs.length) { // Assumes max of 3 bomb types
	    case 3: if (this.bombs[2].canbedropped()) 
                this.activationdial.push({action:self.bombs[2].actiondrop,
                    org:self.bombs[2],
                    type:self.bombs[2].type,
                    name:self.bombs[2].name});
	    case 2:if (this.bombs[1].canbedropped()) 
                this.activationdial.push({action:self.bombs[1].actiondrop,
                    org:self.bombs[1],
                    type:self.bombs[1].type,
                    name:self.bombs[1].name});
	    case 1:if (this.bombs[0].canbedropped()) 
                this.activationdial.push({action:self.bombs[0].actiondrop,
                    org:self.bombs[0],
                    type:self.bombs[0].type,
                    name:self.bombs[0].name});
	    }
	}
	return this.activationdial;
    },
    doactivation() {
	var ad=this.updateactivationdial(); // Warning: list of actions, not dial texts
        if(ad.length>0){
            this.donoaction(ad);
        }
	if (this.timeformaneuver()) {
	    //this.log("resolvemaneuver");
	    this.resolvemaneuver();
	} //else this.log("no resolvemaneuver");
    },
    showaction() {
	$("#actiondial").empty();
	if (this.action>-1&&this.action<this.actionList.length) {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});	
    },
    donoaction(list,str) {
	var cmp=function(a,b) {
	    if (a.type=="CRITICAL") return -1;
	    if (b.type=="CRITICAL") return 1;
	    if (a.type=="EVADE") return -1;
	    if (b.type=="EVADE") return 1;
	    if (a.type=="FOCUS") return -1;
	    if (b.type=="FOCUS") return 1;
	    return 0;
	};
	list.sort(cmp);
	return this.enqueueaction(function(n) {
		this.select();
		if (typeof str!="undefined"&&str!="") this.log(str);
		var a=null;
		for (var i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="EVADE"&&this.candoevade()) {
			var noone=true;
			var grlu=this.getenemiesinrange();
			for (j=0; j<grlu.length; j++) 
			    if (grlu[j].length>0) { noone=false; break; }
			if (noone) { a=list[i]; break; }
                        else if(this.focus>=1) { a=list[i]; break;}
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
                    } else if (typeof list[i].org.aiactivate !== "undefined"){
                        if (list[i].org.aiactivate()) {a = list[i]; break; }
		    } else { a = list[i]; break; }
		}
		this.resolvenoaction(a,n);
	    }.bind(this),"donoaction ia");
    },
    doaction(list,str,cando) {
	var i;
	var cmp=function(a,b) { return b.priority-a.priority; };
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
		    }
                    else if (list[i].type=="TARGET"&&this.candotarget()) {
                        a=list[i];
                        break;
                    }
                    else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
                    } else if (typeof list[i].org.aiactivate !== "undefined"){
                        if (list[i].org.aiactivate()) {a = list[i]; break; }
		    } else { a = list[i]; break }
		}
		/*if (a==null) this.log("no possible action");
		if (a!=null) this.log("action chosen: "+a.type);
		else this.log("null action chosen");*/
		this.resolveaction(a,n);
	    } else {
		this.endaction(n);
	    }
	}.bind(this),"doaction ia");
    },
    showattack() {
	//$("#attackdial").empty();
    },
    doattack(weaponlist,enemies) {
	var power=0,tp=null;
	var i,w;
	var wp;
	//this.log(this.id+" readytofire?"+this.canfire());
	NOLOG=true;
	if (typeof weaponlist=="undefined") weaponlist=this.weapons;

	var r=this.getenemiesinrange(weaponlist,enemies);
	for (w=0; w<weaponlist.length; w++) {
	    var el=r[w];
	    wp=this.weapons.indexOf(weaponlist[w]);
	    for (i=0;i<el.length; i++) {
		var p=this.evaluatetohit(wp,el[i]).tohit;
		//this.log("power "+p+" "+el[i].name);
		if (p>power&&!el[i].isdocked) {
		    tp=el[i]; power=p; this.activeweapon=wp; 
		}
	    }
	}
	NOLOG=false;
	//if (t!=null) this.log("ia/doattack "+this.id+":"+this.weapons[this.activeweapon].name+" "+t.name);
      	if (tp!=null) return this.selecttargetforattack(this.activeweapon,[tp]);
	//this.log("ia/doattack:canfire but no target");
	//this.log("ia/doattack "+this.id+":cannot fire");
	this.addhasfired(); 
	this.cleanupattack();
	return false;
    },
    getresultmodifiers(m,n,from,to) {
	var mods=this.getdicemodifiers(); 
	var lm=[];
	NOLOG=false;
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to) {
		if (d.type==Unit.MOD_M&&d.req(m,n)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) 
			modroll(d.f,i,to);
		} if (d.type==Unit.ADD_M&&d.req(m,n)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) 
			addroll(d.f,i,to);
		} if (d.type==Unit.REROLL_M&&d.req(activeunit,activeunit.weapons[activeunit.activeweapon],targetunit)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) {
                        if( $(".blankreddice").length > 0 || ($(".focusreddice").length > 0 && this.focuses.length == 0 )){ // Attempt to make TL-spending smarter
                            if (typeof d.f=="function") d.f();
                            reroll(n,from,to,d,i);
                        }
		    }
		}
	    }
	}
	return lm;	
    }
};

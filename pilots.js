
function Pilot(name) {
    var i;
    var id=PILOT_dict[name];
    for (i=0; i<PILOTS.length; i++) {
	if (PILOTS[i].name==id) {
	    return Pilotfromid(i);
	}
    }
    log("Could not find pilot "+name);
}
function Pilotfromid(i) {
    var p=new Unit(PILOTS[i]);
    p.id=name;
    if (!p.unique) { p.id=""+p.id+(globalid++); }
    if (p.init != undefined) p.init();
    return p;
}

var PILOTS = [
    {
        name: "Wedge Antilles",    
	done:true,
        unique: true,
	faction:REBEL,
        unit: "X-Wing",
        skill: 9,
	init: function() {
	    var unit=this;
	    var ds=Unit.prototype.getagility;
	    Unit.prototype.getagility=function() {
		var a=ds.call(this);
		if (activeunit==unit&&a>0&&this==targetunit) {
		    //this.log("-1 defense [%0]",unit.name);
		    return a-1; 
		}
		else return a;
	    };
	},
        points: 29,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "Garven Dreis",
	done:true,
	faction:REBEL,
        unique: true,
        unit: "X-Wing",
	removefocustoken: function() {
	    this.focus--;
	    this.show();
	    var p=[]; 
	    p=this.selectnearbyunits(2,function(a,b) { return (a.team==b.team&&a!=b);});
	    if (p.length>0) {
		this.log("select unit for free %FOCUS%");
		this.doselection(function(n) {
		    this.resolveactionselection(p,function (k) { 
			p[k].log("+1 %FOCUS%");
			p[k].addfocustoken();
			this.endnoaction(n,"FOCUS");
		    }.bind(this));
		}.bind(this),"Garven focus");
	    } 
	},
        skill: 6,
        points: 26,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Red Squadron Pilot",
	done:true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 4,
        points: 23,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Rookie Pilot",
	done:true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 2,
        points: 21,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Biggs Darklighter",
	done:true,
        init: function() {
	    var biggs=this;
	    var gr=Weapon.prototype.getrangeallunits;
	    Weapon.prototype.getrangeallunits=function() {
		var r=gr.call(this);
		if (this.unit.team!=biggs.team&&r.indexOf(biggs)>-1) {
		    return [biggs];
		}
		return r;
	    }
	},
        unique: true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 5,
        points: 25,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Luke Skywalker",
	done:true,
	faction:REBEL,
	init: function() {
	    this.adddefensemodd(this,function(m,n) {
		return true;
	    }, function(m,n) {
		var f=Math.floor(m/10);
		var e=m-f*10;
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %EVADE%");
		    return m-9;
		} 
		return m;
	    }.bind(this),false,"focus");
	},        
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 28,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "Gray Squadron Pilot",
	done:true,
	faction:REBEL,
        unit: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "'Dutch' Vander",
	done:true,
        addtarget: function(t) {
	    var unit=this;
	    Unit.prototype.addtarget.call(this,t);
	    this.doselection(function(n) {
		var p=this.selectnearbyunits(2,function(a,b) { return a.team==b.team&&a!=b; });
		if (p.length>0) {
		    p.push(this);
		    this.log("select unit for free %TARGET% (or self to cancel)");
		    this.resolveactionselection(p,function(k) {
			if (k<p.length-1) { 
			    var lu=p[k].gettargetableunits(3);
			    p[k].log("select target to lock");
			    p[k].resolveactionselection(lu,function(kk) { 
				if (kk>=0) this.addtarget(lu[kk]);
				unit.endnoaction(n,"TARGET");
			    }.bind(p[k]));
 			} else unit.endnoaction(n,"TARGET");	
		    });
		} else this.endnoaction(n,"TARGET");
	    }.bind(this));
	},
	faction:REBEL,
        unique: true,
        unit: "Y-Wing",
        skill: 6,
        points: 23,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Horton Salm",
	done:true,
	faction:REBEL,
        unique: true,
        unit: "Y-Wing",
        skill: 8,
        points: 25,
	init: function() {
	    unit=this;
	    this.addattackrerolla(
		this,
		["blank"],
		function() { return 9;	},
		function(w,defender) {
		    var r=this.getrange(defender);
		    if (r>=2&&r<=3) {
			this.log("reroll any blank result");
			return true;
		    }
		    return false;
		}.bind(this)
	    )
	},
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Gold Squadron Pilot",
	done:true,
        unit: "Y-Wing",
	faction:REBEL,
        skill: 2,
        points: 18,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Academy Pilot",
	done:true,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 1,
        points: 12,
        upgrades: [],
    },
    {
        name: "Obsidian Squadron Pilot",
	done:true,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 3,
        points: 13,
        upgrades: [],
    },
    {
        name: "Black Squadron Pilot",
	done:true,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 4,
        points: 14,
        upgrades: [ELITE],
    },
    {
        name: "'Scourge'",
	unique:true,
	beta:true,
	done:true,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 7,
        points: 17,
	getattackstrength: function(i,sh) {
	    var gas=Unit.prototype.getattackstrength.call(this,i,sh);
	    if (sh.criticals.length>0) {
		this.log("+1 attack die for attacking damaged unit");
		return gas+1;
	    }
	    return gas;
	},
        upgrades: [ELITE],
    },
    {
        name: "'Winged Gundark'",
        faction:EMPIRE,
        init:  function() {
	    this.addattackmoda(this,function(m,n) { 
		return (this.getrange(targetunit)==1);
	    }.bind(this),function(m,n) {
		var c=Math.floor(m/10);
		var h=(m-c*10)%100;
		if (h>0) {
		    this.log("1 %HIT% -> 1 %CRIT%");
		    return m+9;
		}
		return m;
	    }.bind(this),false,"hit");
	},        
	done:true,
        unique: true,
        unit: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: "'Night Beast'",
        faction:EMPIRE,
	done:true,
	handledifficulty: function(difficulty) {
	    Unit.prototype.handledifficulty.call(this,difficulty);
	    if (difficulty=="GREEN"&&this.candofocus()&&this.candoaction()) 
		this.doaction([this.newaction(this.addfocus,"FOCUS")],
			      "green maneuver -> free focus action");
	},
        unique: true,
        unit: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: "'Backstabber'",
        unique: true,
	done:true,
        faction:EMPIRE,
	init: function() {
	    var gas=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=gas.call(this,w,sh);
		if (!sh.isinfiringarc(this)) {
		    a=a+1;
		    this.log("+1 attack against %0",sh.name);
		}
		return a;
	    };
	},
        unit: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: "'Dark Curse'",
	done:true,
        faction:EMPIRE,
        unique: true,
	init: function() {
	    var gart=Unit.prototype.getattackrerolltokens;
	    var cuf=Unit.prototype.canusefocus;
	    var cut=Unit.prototype.canusetarget;
	    var unit=this;
	    Unit.prototype.getattackrerolltokens=function() {
		if (targetunit==unit&&this.team!=unit.team) return "";
		return gart.call(this);
	    };
	    Unit.prototype.canusefocus=function() {
		// Am I attacking darkcurse?
		if (targetunit==unit&&this.team!=unit.team) return false;
		return cuf.call(this);
	    };
	    Unit.prototype.canusetarget=function() {
		if (targetunit==unit&&this.team!=unit.team) return false;
		return cut.call(this);
	    };
	},
        unit: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: "'Mauler Mithel'",
        faction:EMPIRE,
	done:true,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		if (this.gethitrange(w,sh)==1) { 
		    this.log("+1 attack against %0",sh.name);
		    return a+1;
		}
		return a;
	    }.bind(this);
	},
        unique: true,
        unit: "TIE Fighter",
        skill: 7,
        points: 17,
        upgrades: [ELITE],
    },
    {
        name: "'Howlrunner'",
        unique: true,
	done:true,
        faction:EMPIRE,
        unit: "TIE Fighter",
        skill: 8,
	init: function() {
	    this.addglobalattackrerolla(
		this,
		["blank","focus"],
		function() { return 1; },
		function(attacker,w,defender) {
		    // Howlrunner dead ? 
		    if (!this.dead&&attacker!=this
			&&attacker.getrange(this)==1
			&&attacker.team==this.team&&w.isprimary) {
			attacker.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    )
	},
        points: 18,
        upgrades: [ELITE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 7,
        points: 27,
	init: function() {
	    var unit=this;
	    this.ac=Unit.prototype.applycritical;
	    Unit.prototype.applycritical=function(n) {
		if (activeunit==unit&&targetunit!=unit) {
		    for (var j=0; j<n; j++) {
			var s1=this.selectdamage();
			CRITICAL_DECK[s1].count--;
			var s2=this.selectdamage();
			CRITICAL_DECK[s2].count--;
			var s3=this.selectdamage();
			CRITICAL_DECK[s3].count--;
			sc=[s1,s2,s3];
			unit.log("select one critical");
			unit.selectcritical(sc,function(m) { 
			    CRITICAL_DECK[m].count++;
			    if (this.faceup(new Critical(this,m))) this.removehull(1);
			    this.checkdead();
			    this.show();
			}.bind(this));
		    }
		    this.show();
		} else unit.ac.call(this,n);
	    }
	},
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Tempest Squadron Pilot",
        faction:EMPIRE,
	done:true,
        unit: "TIE Advanced",
        skill: 2,
        points: 21,
        upgrades: [MISSILE],
    },
    {
        name: "Storm Squadron Pilot",
        faction:EMPIRE,
	done:true,
        unit: "TIE Advanced",
        skill: 4,
        points: 23,
        upgrades: [MISSILE],
    },
    {
        name: "Darth Vader",
        faction:EMPIRE,
        unique: true,
	done:true,
        unit: "TIE Advanced",
        skill: 9,
	doendmaneuveraction: function() {
	    if (this.candoaction()) {
		var x=this.doaction(this.getactionlist(),"1st action");
		//this.log("action:"+x);
		x.done(function() {
		    if (this.candoaction()) {
			this.doaction(this.getactionlist(),"2nd action");
		    } else { this.action=-1; this.actiondone=true; this.deferred.resolve(); }
		}.bind(this))
	    } else { this.action=-1; this.actiondone=true; this.deferred.resolve(); }
 	},
	secaction:-1,
        points: 29,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Alpha Squadron Pilot",
        faction:EMPIRE,
	done:true,
        unit: "TIE Interceptor",
        skill: 1,
        points: 18,
        upgrades: [ ],
    },
    {
        name: "Avenger Squadron Pilot",
        faction:EMPIRE,
	done:true,
        unit: "TIE Interceptor",
        skill: 3,
        points: 20,
        upgrades: [ ],
    },
    {
        name: "Saber Squadron Pilot",
        faction:EMPIRE,
	done:true,
        unit: "TIE Interceptor",
        skill: 4,
        points: 21,
        upgrades: ["Elite"],
    },
    {
        name: "'Fel\'s Wrath'",
        faction:EMPIRE,
        unique: true,
        unit: "TIE Interceptor",
	skill: 5,
	done:true,
	endcombatphase: function() {
	    this.hasfired=0;
	    this.checkdead();
	},
	canbedestroyed: function(skillturn) {
	    if (skillturn==-1) return true;
	    return false;
	},
        points: 23,
        upgrades: [],
    },
    {
        name: "Turr Phennir",
        faction:EMPIRE,
        unique: true,
	done:true,
        unit: "TIE Interceptor",
        skill: 7,
	cleanupattack: function() {
	    this.doaction([this.newaction(this.resolveboost,"BOOST"),
			   this.newaction(this.resolveroll,"ROLL")],
			  "free boost or barrel roll action");
	    Unit.prototype.cleanupattack.call(this);
	},
        points: 25,
        upgrades: [ELITE],
    },
    {
        name: "Soontir Fel",
        faction:EMPIRE,
        unique: true,
	done:true,
        addstress: function () {
	    this.stress++;
	    this.log("+1 %STRESS% -> +1 %FOCUS%");
	    this.addfocustoken();
	},
        unit: "TIE Interceptor",
        skill: 9,
        points: 27,
        upgrades: [ELITE],
    },
    {
        name: "Tycho Celchu",
	faction:REBEL,
        unique: true,
	done:true,
        candoaction:function() {
	    return (this.collision==0&&this.ocollision.template.length==0&&this.ocollision.overlap==-1);
	},
        unit: "A-Wing",
        skill: 8,
        points: 26,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Arvel Crynyd",
	faction:REBEL,
        unique: true,
	done:true,
        unit: "A-Wing",
	checkcollision: function(sh) {
	    return false;
	},
        skill: 6,
        points: 23,
        upgrades: [MISSILE],
    },
    {
        name: "Green Squadron Pilot",
	faction:REBEL,
	done:true,
        unit: "A-Wing",
        skill: 3,
        points: 19,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Prototype Pilot",
	faction:REBEL,
	done:true,
        unit: "A-Wing",
        skill: 1,
        points: 17,
        upgrades: [MISSILE],
    },
    {
        name: "Outer Rim Smuggler",
	faction:REBEL,
        unit: "YT-1300",
	done:true,
	install: function() {
	    this.hull=6;
	    this.shield=4;
	    this.fire=2;
	},
	uninstall: function() {
	    this.hull=8;
	    this.shield=5;
	    this.fire=5;
	},
        skill: 1,
        points: 27,
        upgrades: [CREW,CREW],
    },
    {
        name: "Chewbacca",
        unique: true,
	done:true,
	faction:REBEL,
        unit: "YT-1300",
        skill: 5,
        points: 42,
	faceup: function(c) {
	    this.log("ignore critical %0",c.name);
	    return true;
	},
        upgrades: [ELITE,MISSILE,CREW,CREW]
    },
    {
        name: "Lando Calrissian",
	faction:REBEL,
        unique: true,
        unit: "YT-1300",
        skill: 7,
        points: 44,
	handledifficulty: function(d) {
	    var unit=this;
	    var p=this.selectnearbyunits(1,function(t,s) { return t.team==s.team&&t!=s; })
	    if (p.length>0&&d=="GREEN") {
		this.doselection(function(n) {
		    this.log("select unit for a free action");
		    this.resolveactionselection(p,function(k) {
			p[k].doaction(p[k].getactionbarlist()).done(function() {
			    this.select();
			    p[k].log("+1 action [%0]",unit);
			    this.endnoaction(n,"");
			}.bind(this));
		    }.bind(this))
		}.bind(this))
	    }
	    Unit.prototype.handledifficulty.call(this,d);
	},
	done:true,
        upgrades: [ELITE,MISSILE,CREW,CREW],
    },
    {
        name: "Han Solo",
        unique: true,
	done:true,
	faction:REBEL,
        unit: "YT-1300",
        skill: 9,
        points: 46,
	init: function() {
	    this.addattackrerolla(
		this,
		["blank","focus","hit","critical"],
		function() { return 9; },
		function(w,defender) {
		    return true;
		}.bind(this)
	    )
	},
        upgrades: [ELITE,MISSILE,CREW,CREW],
    },
    {
        name: "Kath Scarlet",
        unique: true,
        faction:EMPIRE,
        unit: "Firespray-31",
        skill: 7,
	done:true,
	init: function() {
	    var unit=this;
	    var cc=Unit.prototype.cancelcritical;
	    Unit.prototype.cancelcritical=function(c,e,sh) {
		var ce=cc.call(this,c,e,sh);
		if (c>ce&&sh!=this&&activeunit.name=="Kath Scarlet") {
		    this.log("+1 %STRESS for cancelling %CRIT%");
		    this.addstress();
		}
		return ce;
	    }
	},
        points: 38,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Boba Fett",
        unique: true,
	done:true,
        faction:EMPIRE,
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial.match("BL3|BL2|BL1")) {
		this.log("select %BANKLEFT% speed");
		var newdial=dial.replace(/L/,"R");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,realdial),
		     this.getpathmatrix(this.m,newdial)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,newdial,newdial,difficulty);
		    }.bind(this),false,true);
	    } else if (dial.match("BR3|BR2|BR1")) {
		this.log("select %BANKRIGHT% speed");
		var newdial=dial.replace(/R/,"L");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,dial),
		     this.getpathmatrix(this.m,newdial)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,dial,newdial,difficulty);
		    }.bind(this),false,true);
	    } else Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
	},
        unit: "Firespray-31",
        skill: 8,
        points: 39,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Krassis Trelix",
        unique: true,
	done:true,
        faction:EMPIRE,
        unit: "Firespray-31",
	init: function() {
	    this.addattackrerolla(
		this,
		["blank","focus"],
		function() { return 1; },
		function(w,defender) {
		    if (!w.isprimary) {
			w.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    )
	},
        skill: 5,
        points: 36,
        upgrades: [CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Bounty Hunter",
        unit: "Firespray-31",
        skill: 3,
	done:true,
        faction:EMPIRE,
        points: 33,
        upgrades: [CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Ten Numb",
	faction:REBEL,
        unique: true,
	done:true,
        unit: "B-Wing",
        skill: 8,
	init: function() {
	    this.shipimg="b-wing-1.png";
	    var cc=Unit.prototype.cancelcritical;
	    Unit.prototype.cancelcritical=function(c,h,sh) {
		var ce=cc.call(this,c,h,sh);
		if (activeunit.name=="Ten Numb"&&c>1 && ce==0) return 1;
		return ce;
	    }
	},
        points: 31,
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Ibtisam",
        unique: true,
	done:true,
	faction:REBEL,
        unit: "B-Wing",
        skill: 6,
        points: 28,
	init: function() {
	    this.shipimg="b-wing-1.png";
	    this.addattackrerolla(
		this,
		["blank","focus"],
		function() { return 1; },
		function(w,defender) {
		    if (this.stress>0) {
			this.log("+%0 reroll",1);
			return true;
		    }
		    return false;
		}.bind(this)
	    );
	    this.adddefensererolld(
		this,
		["blank","focus"],
		function() { return 1; },
		function(w,attacker) {
		    if (this.stress>0) {
			this.log("+%0 reroll",1);
			return true;
		    }
		    return false;
		}.bind(this)
	    );
	},
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Dagger Squadron Pilot",
        unit: "B-Wing",
	done:true,
	faction:REBEL,
        skill: 4,
        points: 24,
        upgrades: [SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Blue Squadron Pilot",
        unit: "B-Wing",
	done:true,
	faction:REBEL,
        skill: 2,
        points: 22,
        upgrades: [SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Rebel Operative",
        unit: "HWK-290",
	done:true,
	faction:REBEL,
        skill: 2,
        points: 16,
        upgrades: [TURRET,CREW],
    },
    {
        name: "Roark Garnet",
        unique: true,
	faction:REBEL,
        unit: "HWK-290",
        skill: 4,
	begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(3,function(t,s) { return t.team==s.team&&t!=s; })
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit for 12 PS");
			this.resolveactionselection(p,function(k) {
			    if (k>-1) {
				p[k].oldskill=p[k].skill;
				p[k].skill=12;
				filltabskill();
				p[k].showstats();
				this.log("has PS of 12");
				p[k].endcombatphase=function() {
				    this.skill=this.oldskill;
				    filltabskill();
				    this.hasfired=0;
				    this.showstats();
				}.bind(p[k]);
			    }
			    this.endnoaction(n,"");
			}.bind(this));
		    }.bind(this));
		};
	    }
	    return Unit.prototype.begincombatphase.call(this);
	},     
	done:true,
        points: 19,
        upgrades: [TURRET,CREW],
    },
    {
        name: "Kyle Katarn",
	faction:REBEL,
        unique: true,
	done:true,
        unit: "HWK-290",
        skill: 6,
        points: 21,
	begincombatphase: function() {
	    if (this.canusefocus()) {
		var p=this.selectnearbyunits(3,function(t,s) { return s.team==t.team&&s!=t; });
		if (p.length>0) {
		    this.doselection(function(n) {
			p.push(this);
			this.log("select unit for free %FOCUS% (or self to cancel)");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				this.removefocustoken();
				p[k].addfocustoken();
				p[k].log("+1 %FOCUS%");
			    }
			    this.endnoaction(n,"FOCUS");
			}.bind(this));
		    }.bind(this));
		}
	    }
	    return Unit.prototype.begincombatphase.call(this);
	},
        upgrades: [ELITE,TURRET,CREW],
    },
    {
        name: "Jan Ors",
	faction:REBEL,
        unique: true,
	done:true,
        unit: "HWK-290",
        skill: 8,
	init: function() {
	    // TODO : add a type of modifier: add a die/dices
	    var unit=this;
	    this.addattackmoda(this, function(m,n) {
		return (unit.stress==0)&&
			(activeunit.team==unit.team)&&(activeunit!=unit)
			&&(unit.getrange(activeunit)<=3);
	    }.bind(this), function(m,n) {
		var f=unit.rollattackdie(1)[0];
		unit.addstress();
		unit.log("+1 attack die");
		if (f=="focus") return m+100;
		if (f=="hit") return m+1;
		if (f=="critical") return m+10;
		return m;
	    }.bind(this),true,"hit");
	},
        points: 25,
        upgrades: [ELITE,TURRET,CREW],
    },
    {
        name: "Scimitar Squadron Pilot",
        done:true,
        unit: "TIE Bomber",
        skill: 2,
        faction:EMPIRE,
        points: 16,
        upgrades: [TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Gamma Squadron Pilot",
	done:true,
        unit: "TIE Bomber",
        faction:EMPIRE,
        skill: 4,
        points: 18,
        upgrades: [TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Captain Jonus",
        faction:EMPIRE,
	done:true,
        init: function() {
	    this.addattackrerolla(
		this,
		["blank","focus"],
		function() { return 2; },
		function(attacker,w,defender) {
		    // Jonus dead ? 
		    if (!this.dead&&attacker!=this
			&&attacker.getrange(this)==1
			&&attacker.team==this.team
			&&w.isprimary!=true) {
			attacker.log("+2 rerolls [%0]",this.name);
			return true;
		    }
		    return false;
		}.bind(this)
	    )
	},
        unique: true,
        unit: "TIE Bomber",
        skill: 6,
        points: 22,
        upgrades: [ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Major Rhymer",
	done:true,
        faction:EMPIRE,
        init: function() {
	    for (var i=0; i<this.weapons.length; i++) {
		var r0=this.weapons[i].range[0];
		var r1=this.weapons[i].range[1];
		if (r0>1) this.weapons[i].range[0]--;
		if (r1<3) this.weapons[i].range[1]++;
	    }
	    this.log("extending weapon ranges");
	},
        unique: true,
        unit: "TIE Bomber",
        skill: 7,
        points: 26,
        upgrades: [ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Captain Kagi",
        faction:EMPIRE,
        unique: true,
	done:true,
	init: function() {
	    var rt=Unit.prototype.gettargetableunits;
	    Unit.prototype.gettargetableunits=function(n) {
		var p=rt.call(this,n);
		for (var i=0; i<p.length; i++) 
		    if (p[i].name=="Captain Kagi") return [p[i]];
		return p;
	    };
	},
        unit: "Lambda-Class Shuttle",
        skill: 8,
        points: 27,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Colonel Jendon",
        faction:EMPIRE,
        begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(1,function(s,t) { return s.team==t.team&&s!=t; });
		if (p.length>0&&this.targeting.length) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("select unit to move %TARGET% (or self to cancel)");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				var t=this.targeting[0];
				p[k].addtarget(t);
				this.removetarget(t);
				p[k].log("+%1 %TARGET% / %0",t.name,1);
			    }
			    this.endnoaction(n,"TARGET");
			}.bind(this));
		    }.bind(this));
		}
	    }
	    return Unit.prototype.begincombatphase.call(this);
	},       
	done:true,
        unique: true,
        unit: "Lambda-Class Shuttle",
        skill: 6,
        points: 26,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Captain Yorr",
        faction:EMPIRE,
        unique: true,
	done:true,
        unit: "Lambda-Class Shuttle",
        skill: 4,
	init: function() {
	    var as=Unit.prototype.addstress;
	    var unit=this;
	    Unit.prototype.addstress=function() {
		if (this!=unit&&this.getrange(unit)<=2&&unit.stress<=2) {
		    this.log("-1 %STRESS% [%0]",unit.name);
		    unit.log("+1 %STRESS%");
		    unit.addstress();
		    unit.showinfo();
		} else this.stress++;
	    };
	},
        points: 24,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Omicron Group Pilot",
        faction:EMPIRE,
        done:true,
        unit: "Lambda-Class Shuttle",
        skill: 2,
        points: 21,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Lieutenant Lorrir",
        faction:EMPIRE,
        unique: true,
	done:true,
        unit: "TIE Interceptor",
        skill: 5,
        points: 23,
	resolveroll: function(n) {
	    var p=this.getrollmatrix(this.m);
	    for (var i=-20; i<=20; i+=20) {
		var mm=this.m.clone().translate(0,i).rotate(90,0,0);
		var mn=this.m.clone().translate(0,i).rotate(-90,0,0);
		p=p.concat([this.getpathmatrix(mm,"BR1").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BR1").rotate(90,0,0),
			    this.getpathmatrix(mm,"BL1").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BL1").rotate(90,0,0)]);
	    }
	    this.resolveactionmove(p,
		function(t,k) {
		    if (k>5) t.addstress();
		    t.endaction(n,"ROLL");
		},true);
	    return true;
	},
        upgrades: [ ],
    },
    {
        name: "Royal Guard Pilot",
        faction:EMPIRE,
        done:true,
        unit: "TIE Interceptor",
        skill: 6,
        points: 22,
        upgrades: [ELITE],
    },
    {
        name: "Tetran Cowall",
        faction:EMPIRE,
        unique: true,
	done:true,
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial.match("K5|K3")) {
		this.log("select %UTURN% speed");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,"K1"),
		     this.getpathmatrix(this.m,"K3"),
		     this.getpathmatrix(this.m,"K5")],
		    function(t,k) {
			var m="K5";
			if (k==0) m="K1";
			if (k==1) m="K3";
			Unit.prototype.completemaneuver.call(t,dial,m,difficulty);
		    },false,true);
	    } else Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
	},
        unit: "TIE Interceptor",
        skill: 7,
        points: 24,
        upgrades: [ELITE],
    },
    {
        name: "Kir Kanos",
        faction:EMPIRE,
        init:  function() {
	    /* TO TEST */
	    this.addattackadd(this,function(m,n) {
		var r=this.getrange(targetunit);
		this.log("Kir Kanos "+r+" "+this.canuseevade());
		return (r<=3&&r>=2&&this.canuseevade());
	    }.bind(this),function(m,n) {
		this.removeevadetoken();
		this.log("+1 %HIT% for attacking at range 2-3");
		return {m:m+1,n:n+1};
	    }.bind(this),"evade");
	},   
	done:true,
        unique: true,
        unit: "TIE Interceptor",
        skill: 6,
        points: 24,
        upgrades: [ ],
    },
    {
        name: "Carnor Jax",
        faction:EMPIRE,
        init: function() {
	    var cuf=Unit.prototype.canusefocus;
	    var cue=Unit.prototype.canuseevade;
	    var cdf=Unit.prototype.candofocus;
	    var cde=Unit.prototype.candoevade;
	    var unit=this;
	    Unit.prototype.canusefocus=function() {
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return cuf.call(this);
	    };
	    Unit.prototype.canuseevade=function() {
		// Am I attacking Carnor Jax?
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return cue.call(this);
	    };
	    Unit.prototype.candofocus=function() {
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return cdf.call(this);
	    }
	    Unit.prototype.candoevade=function() {
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return cde.call(this);
	    }
	},
        unique: true,
	done:true,
        unit: "TIE Interceptor",
        skill: 8,
        points: 26,
        upgrades: [ELITE],
    },
    {
        name: "Bandit Squadron Pilot",
	faction:REBEL,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 2,
        points: 12,
        upgrades: [MISSILE],
    },
    {
        name: "Tala Squadron Pilot",
	faction:REBEL,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 4,
        points: 13,
        upgrades: [MISSILE],
    },
    {
        name: "Lieutenant Blount",
	faction:REBEL,
        done:true,
	hashit: function(t) {
	    if (this.criticalresolved+this.hitresolved==0) this.log("%0 is hit",targetunit.name);
	    return true;
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 6,
        points: 17,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Airen Cracken",
	faction:REBEL,
	done:true,
        endattack: function() {
	    Unit.prototype.endattack.call(this);
	    var p=this.selectnearbyunits(1,function(t,s) { return (t.team==s.team)&&(s!=t)&&(s.candoaction()); });
	    if (p.length>0) {
		var unit=this;
		this.doselection(function(n) {
		    this.log("select unit for a free action");
		    this.resolveactionselection(p,function(k) {
			var al=p[k].getactionlist();
			//log("selected "+p[k].name+" "+al.length);
			if (al.length>0) {
			    p[k].doaction(al).done(function() { 
				//log("endaction");
				this.select();
			    }.bind(this));
			    this.endnoaction(n,"");
			} else { //log("no action");
			    this.select(); this.endnoaction(n,""); }
		    }.bind(this));
		}.bind(this));
	    }
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 8,
        points: 19,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Delta Squadron Pilot",
        faction:EMPIRE,
        done:true,
        
        unit: "TIE Defender",
        skill: 1,
        points: 30,
        upgrades: [CANNON,MISSILE],
    },
    {
        name: "Onyx Squadron Pilot",
        done:true,
        faction:EMPIRE,
        
        unit: "TIE Defender",
        skill: 3,
        points: 32,
        upgrades: [CANNON,MISSILE],
    },
    {
        name: "Colonel Vessery",
        done:true,
        faction:EMPIRE,
        attackroll:function(n) {
	    var ar=Unit.prototype.attackroll;
	    var r=ar.call(this,n);
	    if (targetunit.istargeted.length>0&&this.target==0) {
		this.addtarget(targetunit);
		this.log("+%1 %TARGET% / %0",targetunit.name,1);	
	    }
	    return r;
	},
        unique: true,
        unit: "TIE Defender",
        skill: 6,
        points: 35,
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Rexler Brath",
        faction:EMPIRE,
	done:true,
        endattack: function(c,h) {
	    Unit.prototype.endattack.call(this,c,h);
	    if (this.canusefocus()&&this.hitresolved>0) {
		this.log("-1 %FOCUS%, %0 damage -> %0 critical(s)",h);
		this.donoaction([{name:this.name,org:this,type:"FOCUS",action:function(n) {
		    var i,l=targetunit.criticals.length-1;
		    this.removefocustoken();
		    for (i=0; i<this.hitresolved; i++) {
			this.log(targetunit.criticals[l-i-this.criticalresolved].name);
			targetunit.faceup(targetunit.criticals[l-i-this.criticalresolved])
		    }
		    targetunit.checkdead();
		    targetunit.show();
		    this.endnoaction(n,"");
		}.bind(this)}]);
	    }
	},
        unique: true,
        unit: "TIE Defender",
        skill: 8,
        points: 37,
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Knave Squadron Pilot",
	faction:REBEL,
        done:true,
        unit: "E-Wing",
        skill: 1,
        points: 27,
        upgrades: [SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Blackmoon Squadron Pilot",
        
	faction:REBEL,
        done:true,
        unit: "E-Wing",
        skill: 3,
        points: 29,
        upgrades: [SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Etahn A'baht",
	done:true,
	faction:REBEL,
        init:  function() {
	    var unit=this;
	    this.addattackmoda(this, function(m,n) {
		return (targetunit.team!=unit.team)
		    &&unit.isinfiringarc(targetunit);
	    }.bind(this), function(m,n) {
		var c=Math.floor(m/10);
		var h=(m-c*10)%100;
		if (h>0) {
		    unit.log("1 %HIT% -> 1 %CRIT%");
		    return m+9;
		} 
		return m;
	    }.bind(this),true,"hit");
	},        

        
        unique: true,
        unit: "E-Wing",
        skill: 5,
        points: 32,
        upgrades: [ELITE,SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Corran Horn",
	faction:REBEL,
	done:true,
	init: function() {
	    this.doublefire=-2;
	    this.lasttry=-1;
	},
	canfire: function() {
	    return ((this.hasfired==0)||((this.hasfired==1)&&(this.lasttry==round)))&&!this.iscloaked&&!this.isfireobstructed()&&(this.doublefire<round-1);
	},
	cleanupattack: function() {
	    if (this.hasfired==2) {
		if (this.hasdamaged) {
		    this.doublefire=round;
		    this.log("no attack next round");
		} 
		Unit.prototype.endcombatphase.call(this);
	    }
	    Unit.prototype.cleanupattack.call(this);
	},
        endcombatphase: function() {
	    this.lasttry=round;
	    if (this.canfire()) {
		this.log("new attack possible (no attack next turn)");
		this.hasdamaged=false;
		this.select();
		this.doattack(true);
	    } 
	},
        unique: true,
        unit: "E-Wing",
        skill: 8,
        points: 35,
        upgrades: [ELITE,SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Sigma Squadron Pilot",
        faction:EMPIRE,
        done:true,
        
        unit: "TIE Phantom",
        skill: 3,
        points: 25,
        upgrades: [SYSTEM,CREW],
    },
    {
        name: "Shadow Squadron Pilot",
        done:true,
        faction:EMPIRE,
        
        unit: "TIE Phantom",
        skill: 5,
        points: 27,
        upgrades: [SYSTEM,CREW],
    },
    {
        name: "'Echo'",
        faction:EMPIRE,
	done:true,
	getdecloakmatrix: function(m) {
	    var i=0;
	    var m0=this.getpathmatrix(m,"BL2");
	    var m1=this.getpathmatrix(m,"BR2");
	    var p=[this.m,m0,m1];
	    for (i=-20; i<=20; i+=20) {
		var mm=m.clone().translate(0,i).rotate(90,0,0);
		var mn=m.clone().translate(0,i).rotate(-90,0,0);
		p=p.concat([this.getpathmatrix(mm,"BL2").rotate(-90,0,0),
			    this.getpathmatrix(mm,"BR2").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BL2").rotate(90,0,0),
			    this.getpathmatrix(mn,"BR2").rotate(90,0,0)]);
	    }
	    return p;
	},          
        unique: true,
        unit: "TIE Phantom",
        skill: 6,
        points: 30,
        upgrades: [ELITE,SYSTEM,CREW],
    },
    {
        name: "'Whisper'",
        faction:EMPIRE,
	done:true,
	hashit:function(t) {
	    var hh=Unit.prototype.hashit.call(t);
	    if (hh) {
		this.log("+1 %FOCUS%");
		this.addfocustoken();
	    }
	    return hh;
	},
        unique: true,
        unit: "TIE Phantom",
        skill: 7,
        points: 32,
        upgrades: [ELITE,SYSTEM,CREW],
    },
    {
        name: "Wes Janson",
	done:true,
	endattack:function(c,h) {
	    if (targetunit.targeting.length>0) {
		targetunit.log("-1 %TARGET% [%0]",this.name);
		targetunit.removetarget(targetunit.targeting[0]);
	    } else if (targetunit.focus>0) {
		targetunit.log("-1 %FOCUS% [%0]",this.name);
		targetunit.removefocustoken();
	    } else if (targetunit.evade>0) {
		targetunit.log("-1 %EVADE% [%0]",this.name);
		targetunit.removeevadetoken();
	    }
	    Unit.prototype.endattack.call(this,c,h);
	},
	faction:REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 29,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "Jek Porkins",
	done:true,
	addstress:function() {
	    // Automatic removal of stress
	    var roll=this.rollattackdie(1)[0];
	    this.log("-1 %STRESS%, roll 1 attack dice")
	    if (roll=="hit") { this.resolvehit(1); this.checkdead(); }
	},
	faction:REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 7,
        points: 26,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "'Hobbie' Klivian",
	faction:REBEL,
	done:true,
        removetarget: function(t) {
	    if (this.stress) { 	    
		this.log("-1 %TARGET% -> -1 %STRESS%");
		this.removestresstoken();
	    }
	    Unit.prototype.removetarget.call(this,t);
	},
        addtarget: function(t) {
	    if (this.stress) { 
		this.removestresstoken();
		this.log("+1 %TARGET% -> -1 %STRESS%");
	    }
	    Unit.prototype.addtarget.call(this,t);
	},
        unique: true,
        unit: "X-Wing",
        skill: 5,
        points: 25,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Tarn Mison",
	done:true,
        isattackedby: function(w,a) {
	    if (this.target==0||this.skill<a.skill) { // TODO:Priority to define
		this.log("+%1 %TARGET% / %0",a.name,1);
		this.addtarget(a);
	    }
	},
	faction:REBEL,
        
        unique: true,
        unit: "X-Wing",
        skill: 3,
        points: 23,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Jake Farrell",
       	faction:REBEL,
	done:true,
        freemove: function() {
	    return this.doaction([this.newaction(this.resolveboost,"BOOST"),
				  this.newaction(this.resolveroll,"ROLL")],
				 "free %BOOST% or %BARRELROLL% action");
	},
	addfocustoken: function() {
	    if (this.candoaction()) this.freemove();
	    Unit.prototype.addfocustoken.call(this);
	},
	removefocustoken: function(id) {
	    Unit.prototype.removefocustoken.call(this,id);
	    this.show();
	    if (this.candoaction()) {
		this.freemove();
	    }
	},
        unique: true,
        unit: "A-Wing",
        skill: 7,
        points: 24,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Gemmer Sojan",
	done:true,
        getdefensestrength: function(w,sh) {
	    var d=Unit.prototype.getdefensestrength.call(this,w,sh);
	    var r=this.getrangeallunits();
	    var i;
	    for (i=0; i<r[1].length; i++) {
		if (squadron[r[1][i].unit].team!=this.team) {
		    this.log("+1 defense due to ennemy at range 1");
		    return d+1;
		}
	    }
	    return d;
	},
	faction:REBEL,
        unique: true,
        unit: "A-Wing",
        skill: 5,
        points: 22,
        upgrades: [MISSILE],
    },
    {
        name: "Keyan Farlander",
	faction:REBEL,
	done:true,
	init: function() {
	    this.shipimg="b-wing-1.png";
	    this.addattackmoda(this,function(m,n) {
		return (this.stress>0&&Math.floor(m/100%10>0)); 
	    }.bind(this),function(m,n) {
		var f=Math.floor(m/100)%10;
		if (f>0) {
		    this.removestresstoken();
		    this.log("%0 %FOCUS% -> %0 %HIT%, -1 %STRESS%",f);
		    return m-100*f+f;
		}
		return m;
	    }.bind(this),false,"stress",true);
	},
        unique: true,
        unit: "B-Wing",
        skill: 7,
        points: 29,
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Nera Dantels",
	faction:REBEL,
	done:true,
	init: function() {
	    this.shipimg="b-wing-1.png";
	    this.log("can fire %TORPEDO% at 360 degrees");
	},
        isTurret: function(w) {
	    if (w.type=="Torpedo") {
		return true;
	    }
	    return false;
	},
        unique: true,
        unit: "B-Wing",
        skill: 5,
        points: 26,
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },

    {
        name: "Wild Space Fringer",
        done:true,
	faction:REBEL,
        
        unit: "YT-2400",
        skill: 2,
        points: 30,
        upgrades: [CANNON,MISSILE,CREW],
    },
    {
        name: "Eaden Vrill",
	done:true,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		if (sh.stress>0&&this.weapons[w].isprimary) { 
		    this.log("+1 attack die");
		    return a+1;
		}
		return a;
	    }.bind(this);
	},
        
	faction:REBEL,
        
        unit: "YT-2400",
        unique: true,
        skill: 3,
        points: 32,
        upgrades: [CANNON,MISSILE,CREW],
    },
    {
        name: "'Leebo'",
	faction:REBEL,
	done:true,
        applycritical: function(n) {
	    var j,s;
	    for (j=0; j<n; j++) {
		var s1=this.selectdamage();
		CRITICAL_DECK[s1].count--;
		var s2=this.selectdamage();
		CRITICAL_DECK[s2].count--;
		var sc=[s1,s2];
		this.log("select one critical");
		this.selectcritical(sc,function(m) { 
		    CRITICAL_DECK[m].count++;
		    if (this.faceup(new Critical(this,m))) this.removehull(1);
		    this.checkdead();
		}.bind(this));
	    }
	    this.show();
   	},
        unit: "YT-2400",
        unique: true,
        skill: 5,
        points: 34,
        upgrades: [ELITE,CANNON,MISSILE,CREW],
    },
    {
        name: "Dash Rendar",
	faction:REBEL,
        unit: "YT-2400",
        unique: true,
        skill: 7,
	done:true,
	getocollisions: function(mbegin,mend,path,len) { 
	    return {overlap:-1,template:[],mine:[]};
	},
        points: 36,
        upgrades: [ELITE,CANNON,MISSILE,CREW],
    },
    {
        name: "Patrol Leader",
        
        faction:EMPIRE,
	done:true,
        unit: "VT-49 Decimator",
        skill: 3,
        points: 40,
        upgrades: [TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Captain Oicunn",
        faction:EMPIRE,
        unit: "VT-49 Decimator",
        skill: 4,
        points: 42,
        unique: true,
	done:true,
	resolvecollision: function() {
	    var i;
	    for (i=0; i<this.touching.length; i++) {
		var u=this.touching[i];
		if (u.team!=this.team) {
		    u.log("+1 %HIT% [%0]",this.name);
		    u.resolvehit(1);
		    u.checkdead();
		}
	    }
	    Unit.prototype.resolvecollision.call(this);
	},
        upgrades: [ELITE,TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Commander Kenkirk",
        faction:EMPIRE,
        getagility: function() {
	    if (this.shield==0&&this.hull<this.ship.hull) return this.agility+1;
	    return this.agility;
	},
	done:true,
        unit: "VT-49 Decimator",
        skill: 6,
        points: 44,
        unique: true,
        upgrades: [ELITE,TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Rear Admiral Chiraneau",
        init:  function() {
	    this.addattackmoda(this,function(m,n) {
		return  (this.getrange(targetunit)<=2);
	    }.bind(this),function(m,n) {
		var f=Math.floor(m/100)%10;
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %CRIT%");
		    return m-90;
		}
		return m;
	    }.bind(this),false,"hit");
	},        

        faction:EMPIRE,
        unit: "VT-49 Decimator",
        skill: 8,
        points: 46,
	done:true,
        unique: true,
        upgrades: [ELITE,TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Prince Xizor",
        faction:SCUM,
        modifydamageassigned: function(ch,attacker) {
	    var i;
	    var p=[];
	    if (ch==0) return 0;
	    var p=this.selectnearbyunits(1,function(t,s) { return t.team==s.team&&t!=s; })
	    if (p.length>0) {
		p.sort(function(a,b) { 
		    hpa=a.hull+a.shield; hpb=b.hull+b.shield;
		    if (hpa<hpb) return 1; 
		    if (hpa>hpb) return -1; 
		    return 0; });
		if (ch>=10) {
		    p[0].resolvecritical(1);
		    this.log("-1 %CRIT%");
		    p[0].log("+1 %CRIT% [%0]",this.name);
		    return ch-10;
		} 
		p[0].resolvehit(1);
		p[0].checkdead();
		this.log("-1 %HIT%");
		p[0].log("+%1 %HIT% [%0]",this.name,1);
		return ch-1;
	    }
	    return ch;
	},
        unique: true,
	done:true,
        unit: "StarViper",
        skill: 7,
        points: 31,
        upgrades: [ELITE,TORPEDO],
    },
    {
        name: "Guri",
        faction:SCUM,
	/* TODO : may only do the action */
	begincombatphase: function() {
	    if (!this.dead) {
		var p=this.gettargetableunits(1);
		if (p.length>0) {
		    this.log("+1 %FOCUS%, ennemy at range 1");
		    this.addfocustoken();
		}
	    }
	    return Unit.prototype.begincombatphase.call(this);
	},       
	done:true,
        unique: true,
        unit: "StarViper",
        skill: 5,
        points: 30,
        upgrades: [ELITE,TORPEDO],
    },
    {
        name: "Black Sun Vigo",
        faction:SCUM,
        done:true,
        unit: "StarViper",
        skill: 3,
        points: 27,
        upgrades: [TORPEDO],
    },
    {
        name: "Black Sun Enforcer",
        faction:SCUM,
        done:true,
        unit: "StarViper",
        skill: 1,
        points: 25,
        upgrades: [TORPEDO],
    },
    {
        name: "Serissu",
        faction:SCUM,
	done:true,
        init: function() {
	    this.addglobaldefensererolld(
		this,
		["blank","focus"],
		function() { return 1 },
		function(attacker,w,defender) {
		    // Serissu dead ? 
		    if (this.dead) return false;
		    if (defender!=this&&defender.getrange(this)==1&&defender.team==this.team) {
			defender.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    )
	},
        unit: "M3-A Interceptor",
        skill: 8,
        points: 20,
        unique: true,
        upgrades: [ELITE],
    },
    {
        name: "Laetin A'shera",
        faction:SCUM,
        endbeingattacked: function(c,h) {
	    Unit.prototype.endbeingattacked.call(this,c,h);
	    if (c+h==0) {
		this.log("no hit, +1 %EVADE%");
		this.addevadetoken();
	    }
	},        
	done:true,
        unit: "M3-A Interceptor",
        skill: 6,
        points: 18,
        unique: true,
        upgrades: [ ],
    },
    {
        name: "Tansarii Point Veteran",
        faction:SCUM,
        done:true,
        unit: "M3-A Interceptor",
        skill: 5,
        points: 17,
        upgrades: [ELITE],
    },
    {
        name: "Cartel Spacer",
        faction:SCUM,
        done:true,
        unit: "M3-A Interceptor",
        skill: 2,
        points: 14,
        upgrades: [ ],
    },
    {
        name: "IG-88A",
	faction:SCUM,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
	cleanupattack: function(c,h) {
	    if (targetunit.dead&&(this.shield<this.ship.shield)) {
		this.shield++;
		this.showstats();
		this.log("+1 %SHIELD% for a kill");
	    }
	    Unit.prototype.cleanupattack.call(this);
	},
	done:true,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "IG-88B",
	faction:SCUM,
	done:true,
	endattack: function(c,h) {
	    if ((c+h==0)&&this.hasfired<2) {
		for (var i=0; i<this.weapons.length; i++) {
		    var w=this.weapons[i];
		    if (w.type=="Cannon"&&w.isWeapon()&&w.getrangeallunits().length>0) {
			this.log("2nd attack with %0",w.name);
			this.selecttargetforattack(i); 
			break;
		    }
		}
	    } else Unit.prototype.endattack.call(this,c,h);
	},
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "IG-88C",
	faction:SCUM,
        resolveboost: function(n) {
	    Unit.prototype.resolveboost.call(this,n);
	    this.doaction([this.newaction(this.addevade,"EVADE")],"free evade action");
	},
        done:true,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "IG-88D",
	faction:SCUM,  
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial=="SL3") {
		this.log("select %SLOOPLEFT% or %TURNLEFT% maneuver");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,"SL3"),
		     this.getpathmatrix(this.m,"TL3").rotate(180,0,0)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,dial,"TL3",difficulty);
		    }.bind(this),false,true);
	    } else if (dial=="SR3") {
		this.log("select %SLOOPRIGHT% or %TURNRIGHT% maneuver");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,"SR3"),
		     this.getpathmatrix(this.m,"TR3").rotate(180,0,0)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,dial,"TR3",difficulty);
		    }.bind(this),false,true);
	    } else Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
	},
        unique: true,
	done:true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "N'Dru Suhlak",
        unique: true,
	done:true,
	faction:SCUM,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		var p=this.selectnearbyunits(2,function(a,b) {return a.team==b.team&&a!=b });
		if (p.length==0) {
		    this.log("+1 attack against %0, at range >=3 of friendly ships",sh.name);
		    return a+1;
		} return a;
	    }.bind(this);
	},
        unit: "Z-95 Headhunter",
        skill: 7,
        points: 17,
        upgrades: [ELITE,MISSILE,ILLICIT],
    },
    {
        name: "Kaa'To Leeachos",
        unique: true,
	faction:SCUM,
	done:true,
        begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(2,function(a,b) {return a.team==b.team&&a!=b });
		if (p.length>0) {
		    this.doselection(function(n) {
			p.push(this)
			this.log("select %FOCUS%/%EVADE% to take (or self to cancel)");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) { 
				if (p[k].evade>0) { 
				    p[k].removeevadetoken(); this.addevadetoken(); 
				    p[k].log("-1 %EVADE% [%0]",this.name);
				    this.log("+1 %EVADE%");
				} else if (p[k].focus>0) { 
				    p[k].removefocustoken(); this.addfocustoken(); 
				    p[k].log("-1 %FOCUS% [%0]",this.name);
				    this.log("+1 %FOCUS%");
				}
			    }
			    this.endnoaction(n,"");
			}.bind(this));
		    }.bind(this));
		}
	    }
	    return Unit.prototype.begincombatphase.call(this);
	    
	},    
        unit: "Z-95 Headhunter",
        skill: 5,
        points: 15,
        upgrades: [ELITE,MISSILE,ILLICIT],
    },
    {
        name: "Black Sun Soldier",
        faction:SCUM,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 3,
        points: 13,
        upgrades: [MISSILE,ILLICIT],
    },
    {
        name: "Binayre Pirate",
	faction:SCUM,
        done:true,        
        unit: "Z-95 Headhunter",
        skill: 1,
        points: 12,
        upgrades: [MISSILE,ILLICIT],
    },
    {
        name: "Boba Fett",
	faction:SCUM,
        unit: "Firespray-31",
        skill: 8,
        points: 39,
	init: function() {
	    var nrerolls=function() {
		var n=0;
		for (var i=0; i<squadron.length; i++) {
		    var s=squadron[i];
		    if (this.getrange(s)==1&&this.team!=s.team) n++;
		}
		return n;
	    }.bind(this);
	    this.addattackrerolla(this,
				  ["blank","focus"],
				  nrerolls, 
				  function(w,defender) { return true; }
				 );
	    this.adddefensererolld(this,
				   ["blank","focus"], 
				   nrerolls, 
				   function(w,defender) { return true; }
				  );
	},
	done:true,
        unique: true,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Kath Scarlet",
	done:true,
        getattackstrength:  function(w,sh) {
	    var a=Unit.prototype.getattackstrength.call(this,w,sh);
	    if (this.isinfiringarc(sh)&&this.getprimarysector(sh)==4) { 
		this.log("+1 attack die against %0 in auxiliary arc",sh.name);
		a=a+1;
	    }
	    return a;
	},
        unique: true,
	faction:SCUM,      
        unit: "Firespray-31",
        skill: 7,
        points: 38,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Emon Azzameen",
	done:true,
	unique:true,
	getbomblocation:function() {  return ["F1","TL3","TR3","F3"]; },
	faction:SCUM,
        unit: "Firespray-31",
        skill: 6,
        points: 36,
        upgrades: [CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Mandalorian Mercenary",
	faction:SCUM,       
        done:true,
        unit: "Firespray-31",
        skill: 5,
        points: 35,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Kavil",
        unique: true,
	done:true,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		if (!this.isinfiringarc(sh)) { 
		    this.log("+1 attack die against %0 outside firing arc",sh.name);
		    return a+1;
		}
		return a;
	    }.bind(this);
	},       
	faction:SCUM,     
        unit: "Y-Wing",
        skill: 7,
        points: 24,
        upgrades: [ELITE,TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Drea Renthal",
        unique: true,
	faction:SCUM,
        unit: "Y-Wing",
        skill: 5,
	done:true,
	removetarget: function(t) {
	    var p=this.gettargetableunits(3);
	    if (p.length>0) {
		p.push(this);
		this.doselection(function(n) {
		    this.log("select unit to target, +1 %STRESS% (or self to cancel)");
		    this.resolveactionselection(p,function(k) { 
			if (k<p.length-1&&k>-1&&this.targeting.indexOf(p[k])==-1) { 
			    this.addtarget(p[k]);
			    this.addstress();
			}
			this.endnoaction(n,"TARGET");
		    }.bind(this));
		}.bind(this));
	    }
	    Unit.prototype.removetarget.call(this,t);
	},
        points: 22,
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Hired Gun",
	faction:SCUM,
	done:true,
        unit: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Syndicate Thug",
	faction:SCUM,
	done:true,
        unit: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Dace Bonearm",
        unique: true,
	faction:SCUM,
        unit: "HWK-290",
	done:true,
	init: function() {
	    var unit=this;
	    var ai=Unit.prototype.addiontoken;
	    Unit.prototype.addiontoken=function() {
		ai.call(this);
		if (this.getrange(unit)<=3 &&unit.team!=this.team&&unit.stress==0) {
		    unit.addstress();
		    this.resolvehit(1);
		    unit.log("+1 %STRESS%");
		    this.log("+%1 %HIT [%0]",unit.name,1);
		    this.checkdead();
		}
	    }
},
        skill: 7,
        points: 23,
        upgrades: [ELITE,TURRET,CREW,ILLICIT],
    },
    {
        name: "Palob Godalhi",
        unique: true,
	faction:SCUM,
        unit: "HWK-290",
        begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(2,function(a,b) {return a.team!=b.team; });
		if (p.length>0) {
		    this.doselection(function(n) {
			p.push(this)
			this.log("select %FOCUS%/%EVADE% to take (or self to cancel)");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) { 
				if (p[k].evade>0) { 
				    p[k].removeevadetoken(); this.addevadetoken(); 
				    p[k].log("-1 %EVADE% [%0]",this.name);
				    this.log("+1 %EVADE%");
				} else if (p[k].focus>0) { 
				    p[k].removefocustoken(); this.addfocustoken(); 
				    p[k].log("-1 %FOCUS% [%0]",this.name);
				    this.log("+1 %FOCUS%");
				}
			    }
			    this.endnoaction(n,"");
			}.bind(this));
		    }.bind(this));
		}
	    }
	    return Unit.prototype.begincombatphase.call(this);

	},    
	done:true,
        skill: 5,
        points: 20,
        upgrades: [ELITE,TURRET,CREW,ILLICIT],
    },
    {
        name: "Torkil Mux",
        unique: true,
	done:true,
        endactivationphase: function() {
	    if (!this.dead) {
		var p=this.gettargetableunits(2);
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit for a 0 PS");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				var ecp=p[k].endcombatphase;
				p[k].oldskill=p[k].skill;
				p[k].skill=0;
				filltabskill();
				p[k].show();
				p[k].log("PS set to 0 for this combat");
				p[k].endcombatphase=function() {
				    this.skill=this.oldskill;
				    filltabskill();
				    this.show();
				    ecp.call(this);
				};
			    }
			    this.endnoaction(n,"");
			}.bind(this));
		    }.bind(this));
		}
	    }
	},  
	faction:SCUM,
        unit: "HWK-290",
        skill: 3,
        points: 19,
        upgrades: [TURRET,CREW,ILLICIT],
    },
    {
        name: "Spice Runner",
	faction:SCUM,
	done:true,
        unit: "HWK-290",
        skill: 1,
        points: 16,
        upgrades: [TURRET,CREW,ILLICIT],
    },
    {
        name: "Commander Alozen",
        faction:EMPIRE,
        unit: "TIE Advanced",
        unique: true,
	done:true,
        skill: 5,
        points: 25,
	begincombatphase: function() {
	    this.doselection(function(n) {
		var p=this.gettargetableunits(1);
		var i;
		if (p.length>0) { 
		    p.push(this);
		    this.log("select unit to lock (or self to cancel)");
		    this.resolveactionselection(p,function(k) {
			if (this!=p[k]) {
			    this.addtarget(p[k]);
			    this.log("+%1 %TARGET% / %0",p[k].name,1);
			}
			this.endnoaction(n,"TARGET");
		    }.bind(this));
		} else this.endnoaction(n,"TARGET");
	    }.bind(this));
	    return Unit.prototype.begincombatphase.call(this);
	},
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Juno Eclipse",
        unique: true,
	done:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 8,
        points: 28,
	completemaneuver: function(dial,realdial,difficulty) {
	    var speed=parseInt(realdial.substr(-1),10);
	    var p=[];
	    var q=[];
	    for (var i=-1; i<=1; i++) {
		var r=realdial.replace(/\d/,(speed+i)+"");
		if (typeof P[r]!="undefined") {
		    q.push(r);
		    p.push(this.getpathmatrix(this.m,r));
		}
	    }
	    this.log("select maneuver speed");
	    this.resolveactionmove(p,function(t,k) {
		Unit.prototype.completemaneuver.call(t,dial,q[k],difficulty);
	    },false,true);
	},
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Zertik Strom",
        unique: true,
	done:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 6,
	init: function() {
	    var unit=this;
	    Weapon.prototype.wrap_after("getrangeattackbonus",this,function(sh,g) {
		this.unit.log("GETRANGEATTACK"+g);
		if (this.unit.team!=unit.team&&unit.getrange(this.unit)==1) {
		    this.unit.log("0 attack range bonus [%0]",unit.name);
		    return 0;
		}
		return g;
	    });
	    Weapon.prototype.wrap_after("getrangedefensebonus",this,function(sh,g) {
		this.unit.log("GETDEFENSEATTACK"+g);
		if (this.unit.team!=unit.team&&unit.getrange(this.unit)==1) {
		    this.unit.log("0 defense range bonus [%0]",unit.name);
		    return 0;
		}
		return g;
	    });
	},
        points: 26,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Lieutenant Colzet",
        unique: true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 3,
        points: 23,
        upgrades: [ELITE,MISSILE],
	done:true,
	endcombatphase: function() {
	    this.doselection(function(n) {
		var p=[this].concat(this.targeting);
		this.resolveactionselection(p,function(k) {
		    if (k>0&&this.canusetarget(p[k])) {
			var c=p[k].criticals;
			this.removetarget(p[k]);
			if (c.length>0) p[k].faceup(c[rand(c.length)])
		    }
		    this.endnoaction(n,"TARGET");
		}.bind(this));
	    }.bind(this));
	}
    },
    {
        name: "Bossk",
        faction: SCUM,
        unit: "YV-666",
        unique: true,
        skill: 7,
        points: 35,
	done:true,
	hashit: function(t) {
	    var h=Unit.prototype.hashit.call(this,t);
	    var p=this.criticalresolved+this.hitresolved;
	    if (h&&this.criticalresolved>0) {
		if (p<=t.shield||(t.hull<=2&&p>t.shield)) { 
		    this.criticalresolved--;
		    this.hitresolved+=2;
		    this.log("1 %CRIT% -> 2 %HIT%");
		} else this.log(t.name+" shields are down, more than 2 hulls: keeping critical");
	    }
	},
        upgrades: [ELITE,CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Moralo Eval",
        faction: SCUM,
        unit: "YV-666",
        unique: true,
        skill: 6,
        points: 34,
	done:true,
	init: function() {
	    for (var i=0; i<this.weapons.length; i++) {
		if (this.weapons[i].type=="Cannon") {
		    this.log("can fire %0 in auxiliary firing arc",this.weapons[i].name);
		    this.weapons[i].auxiliary=this.weapons[0].auxiliary;
		    this.weapons[i].subauxiliary=this.weapons[0].subauxiliary;
		}
	    }
	},
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Latts Razzi",
        faction: SCUM,
        unit: "YV-666",
        unique: true,
        skill: 5,
        points: 33,
	done:true,
	init: function() {
	    var self=this;
	    var da=Unit.prototype.declareattack;
	    Unit.prototype.declareattack=function(wp,t) {
		da.call(this,wp,t);
		if (self.team==this.team&&self.canusetarget(t))
		    self.donoaction([this.newaction(function(n) {
			this.removetarget(t);
			var eba=t.endbeingattacked
			var gds=t.getdefensestrength;
			t.endbeingattacked=function(c,h) {
			    this.endbeingattacked=eba;
			    this.getdefensestrength=gds;
			}.bind(t);
			t.getdefensestrength=function(i,sh) {
			    return gds.call(t,i,sh)-1;
			}.bind(t);
			this.endnoaction(n,"TARGET");
		    }.bind(self),"TARGET")],self.name+": -1 agility for "+t.name,true);
	    }
	},
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Trandoshan Slaver",
        faction: SCUM,
        unit: "YV-666",
	done:true,
        skill: 2,
        points: 29,
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Talonbane Cobra",
        unique: true,
        faction: SCUM,
        unit: "Kihraxz Fighter",
        skill: 9,
        upgrades: [ELITE,MISSILE,ILLICIT],
	done:true,
	getattackbonus: function(sh) {
	    var att=this.weapons[i].getattack();
	    return att+2*this.weapons[i].getrangeattackbonus(sh);
	},
	getdefensestrength: function(i,sh) {
	    var def=this.getagility();
	    var obstacledef=sh.getobstructiondef(this);
	    if (obstacledef>0) this.log("+%0 defense for obstacle",obstacledef);
	    return def+2*sh.weapons[i].getrangedefensebonus(this)+obstacledef;
	},
        points: 28,
    },
    {
        name: "Graz the Hunter",
        unique: true,
        faction: SCUM,
        unit: "Kihraxz Fighter",
        skill: 6,
            upgrades: [MISSILE,ILLICIT],
	getattackstrength: function(i,sh) {
	    var a=0;
	    if (this.weapons[i].getsector(sh)<=3) {
		a=1;
		this.log("+1 attack die for attacking in firing arc");
	    }
	    return Unit.prototype.getattackstrength.call(this,i,sh)+a;
	},
	done:true,
        points: 25
    },
    {
        name: "Black Sun Ace",
        faction: SCUM,
        unit: "Kihraxz Fighter",
	done:true,
            skill: 5,
            upgrades: [ELITE,MISSILE,ILLICIT],
            points: 23
        },
        {
            name: "Cartel Marauder",
	    done:true,
            faction: SCUM,
            unit: "Kihraxz Fighter",
            skill: 2,
            upgrades: [MISSILE,ILLICIT],
            points: 20
        },
        {
            name: "Miranda Doni",
            unique: true,
	    done:true,
            faction: REBEL,
            unit: "K-Wing",
            skill: 8,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
	    beginattack: function() {
		this.donoaction([
		    {org:this,name:this.name,type:"SHIELD",action:function(n) {
			this.getattackstrength=function(i,sh){
			    var a= this.weapons[i].getattack()-1;
			    return this.weapons[i].getrangeattackbonus(sh)+(a>0)?a:0;
			};
			if (this.shield<this.ship.shield) this.shield++; 
			this.endattack=function(c,h) {
			    this.getattackstrength=Unit.prototype.getattackstrength;
			    this.endattack=Unit.prototype.endattack;
			    Unit.prototype.endattack.call(this,c,h);
			};
			this.endnoaction(n,"SHIELD");
		    }.bind(this)},
		    {org:this,name:this.name,type:"HIT",action:function(n) {
			//this.log("action "+n);
			this.getattackstrength=function(i,sh){
			    return 1+Unit.prototype.getattackstrength.call(this,i,sh);
			};
			this.removeshield(1); 
			this.endattack=function(c,h) {
			    this.getattackstrength=Unit.prototype.getattackstrength;
			    this.endattack=Unit.prototype.endattack;
			    Unit.prototype.endattack.call(this,c,h);
			};
			//this.log("calling noaction "+n);
			this.endnoaction(n,"HIT");
		    }.bind(this)}],"choose to add shield/roll 1 fewer die or remove shield/roll 1 additional die");
	    },
            points: 29,
        },
        {
            name: "Esege Tuketu",
            unique: true,
            faction: REBEL,
            unit: "K-Wing",
            skill: 6,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 28,
	    done:true,
	    init: function() {
		var self=this;
		var cuf=Unit.prototype.canusefocus;
		var rft=Unit.prototype.removefocustoken;
		Unit.prototype.canusefocus=function() {
		    return (cuf.call(this)||(this.incombat>-1&&this!=self&&this.getrange(self)<=2&&self.canusefocus()));
		}
		Unit.prototype.removefocustoken=function() {
		    if (this.focus>0) rft.call(this);
		    else if (this.incombat>-1&&this!=self&&this.getrange(self)<=2&&self.canusefocus()) rft.call(self);
		}
	    }
        },
        {
            name: "Guardian Squadron Pilot",
            faction: REBEL,
	    done:true,
            unit: "K-Wing",
            skill: 4,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 25
        },
        {
            name: "Warden Squadron Pilot",
            faction: REBEL,
	    done:true,
            unit: "K-Wing",
            skill: 2,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 23
        },
        {
            name: "'Redline'",
            unique: true,
            faction: EMPIRE,
            unit: "TIE Punisher",
            skill: 7,
	    done:true,
	    /* TODO: A bit too automatic */
	    boundtargets: function(sh) {
		if (this.targeting.indexOf(sh)>-1) return true;
		for (var i=0; i<this.targeting.length-1; i++) this.removetarget(this.targeting[i]);
		return false;
	    },
	    addtarget: function(sh) {
		if (this.boundtargets()) return;
		this.log("+%1 %TARGET% / %0",sh.name,2);
		this.targeting.push(sh);
		this.targeting.push(sh);
		sh.istargeted.push(this);
		sh.istargeted.push(this);
		sh.show();
		this.show();
	    },
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 27
        },
        {
            name: "'Deathrain'",
            unique: true,
            faction: EMPIRE,
            unit: "TIE Punisher",
            skill: 6,
	    done:true,
	    bombdropped: function() {
		this.doaction([this.newaction(this.resolveroll,"ROLL")],
				  this.name+": free %BARRELROLL%");
	    },
	    getbombposition: function(lm,size) {
		var p=Unit.prototype.getbombposition.call(this,lm,size);
		for (var i=0; i<lm.length; i++)
		    p.push(this.getpathmatrix(this.m,lm[i]).translate(0,-size))
		return p;
	    },
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 26
        },
        {
            name: "Black Eight Squadron Pilot",
            faction: EMPIRE,
	    done:true,
            unit: "TIE Punisher",
            skill: 4,
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 23
        },
        {
            name: "Cutlass Squadron Pilot",
            faction: EMPIRE,
	    done:true,
            unit: "TIE Punisher",
            skill: 2,
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 21
        },
        {
            name: "Poe Dameron",
            faction: REBEL,
            unit: "T-70 X-Wing",
	    unique:true,
	    done:true,
            skill: 8,
            upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	    init: function() {
		this.addattackmoda(this,function(m,n) { 
			return this.focus>0;
		    }.bind(this),function(m,n) {
			var f=Math.floor(m/100)%10;		
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %HIT%");
			    return m-99;
			}
			return m;
		    }.bind(this),false,"focus");
		this.adddefensemodd(this,function(m,n) { 
			return this.focus>0;
		    }.bind(this),function(m,n) {
			var f=Math.floor(m/10)%10;		
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %EVADE%");
			    return m-9;
			}
			return m;
		    }.bind(this),false,"focus");
	    },
            points: 31
        },
      {
	  name: "'Blue Ace'",
	  faction: REBEL,
	  done:true,
	  unit: "T-70 X-Wing",
	  skill: 5,
	  unique:true,
	  getboostmatrix:function(m) {
	      return [this.getpathmatrix(this.m,"TR1"),
		this.getpathmatrix(this.m,"TL1")]
	      .concat(Unit.prototype.getboostmatrix.call(this,m));
	  },
	  upgrades: [TORPEDO,ASTROMECH,TECH],
	  points: 27
      },
      {
	  name: "'Red Ace'",
	  faction: REBEL,
	  done:true,
	  beta:true,
	  unit: "T-70 X-Wing",
	  skill: 5,
	  unique:true,
	  init: function() { this.sr=-1; },
	  removeshield:function(n) {
	      if (this.sr<round) {
		  this.log("+1 %SHIELD%");
		  this.sr=round; this.addevadetoken();
	      }
	      Unit.prototype.removeshield.call(this,n);
	  },
	  upgrades: [TORPEDO,ASTROMECH,TECH],
	  points: 29
      },
      {
	  name: "Blue Squadron Novice",
	  faction: REBEL,
	  done:true,
	  unit: "T-70 X-Wing",
	  skill: 2,
	  upgrades: [TORPEDO,ASTROMECH,TECH],
	  points: 24
      },
     {
	  name: "Red Squadron Veteran",
	  faction: REBEL,
	  done:true,
	  unit: "T-70 X-Wing",
	  skill: 4,
	 upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	  points: 26
      },
    {
	  name: "Omega Squadron Pilot",
	  faction: EMPIRE,
	  done:true,
	  unit: "TIE/FO Fighter",
	  skill: 4,
	upgrades: [TECH,ELITE],
	  points: 17
      },
   {
	  name: "Zeta Squadron Pilot",
	  faction: EMPIRE,
	  done:true,
	  unit: "TIE/FO Fighter",
	  skill: 3,
       upgrades: [TECH],
	  points: 16
      },
   {
	  name: "Epsilon Squadron Pilot",
	  faction: EMPIRE,
	  done:true,
	  unit: "TIE/FO Fighter",
	  skill: 1,
       upgrades: [TECH],
	  points: 15
      },
   {
	  name: "'Zeta Ace'",
	  faction: EMPIRE,
	  done:true,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 5,
	  getrollmatrix:function(m) {
	var m0=this.getpathmatrix(this.m.clone().rotate(90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(this.m.clone().rotate(-90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	return [m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20),
		m1.clone().translate(0,-20),
		m1,
		m1.clone().translate(0,20)]
	.concat(Unit.prototype.getrollmatrix.call(this,m));
    },
       upgrades: [ELITE,TECH],
	  points: 18
      },
   {
	  name: "'Epsilon Leader'",
	  faction: EMPIRE,
	  done:true,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 6,
	  begincombatphase: function() {
	   var p=this.selectnearbyunits(1,function(a,b) { return (a.team==b.team);});
	   for (var i=0; i<p.length; i++) 
	       this.removestresstoken();
	   return Unit.prototype.begincombatphase.call(this);
       },
       upgrades: [ELITE,TECH],
	  points: 19
      },
   {
	  name: "'Omega Ace'",
	  faction: EMPIRE,
	  done:true,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 7,
	  init: function() {
		this.addattackmoda(this,function(m,n) { 
			return this.focus>0||this.targeting.indexOf(targetunit)>-1;
		    }.bind(this),function(m,n) {
			this.removefocustoken();
			this.removetarget(targetunit);
			this.log("all results are %CRIT%");
			return n*10;
		    }.bind(this),false,"critical");
       },
       upgrades: [ELITE,TECH],
	  points: 20
      },
   {
       name: "'Omega Leader'",
       faction: EMPIRE,
       beta:true,
       unique:true,
       unit: "TIE/FO Fighter",
       skill: 8,
       upgrades: [ELITE,TECH],
       points: 21,
       done:true,
       canblockattackmod:function(u) {
	   return (u.istargeted.indexOf(this)>-1&&u.team!=this.team&&
		   this==targetunit&&u==activeunit);
       },
       canblockdefensemod:function(u) {
	   return (u.istargeted.indexOf(this)>-1&&u.team!=this.team&&
		   u==targetunit&&this==activeunit);
       },
       init: function() {
	   var gart=Unit.prototype.getattackrerolltokens;
	   var gdrt=Unit.prototype.getdefensererolltokens;
	   var gamt=Unit.prototype.getattackmodtokens;
	   var gdmt=Unit.prototype.getdefensemodtokens;
	   var unit=this;
	   Unit.prototype.getattackrerolltokens=function() {
	       if (unit.canblockattackmod(this)) return "";
	       return gart.call(this);
	   };
	   Unit.prototype.getdefensererolltokens=function() {
	       if (unit.canblockdefensemod(this)) return "";
	       return gdrt.call(this);
	   };
	   Unit.prototype.getattackmodtokens=function(m,n) {
	       if (unit.canblockattackmod(this)) return "";
	       return gamt.call(this,m,n);
	   }
	   Unit.prototype.getdefensemodtokens=function(m,n) {
	       if (unit.canblockdefensemod(this)) return "";
	       return gdmt.call(this,m,n);
	   }
       }
   }
];

var maarek_fct = function() {
    var unit=this;
    var newdeal=function(c,f,p) {
	var pp=$.Deferred();
	p.then(function(cf) {
	    var crit=cf.crit;
	    if (cf.face==FACEUP&&activeunit==unit&&targetunit==this) {
		var s1=this.selectdamage();
		CRITICAL_DECK[s1].count--;
		var s2=this.selectdamage();
		CRITICAL_DECK[s2].count--;
		var s3=this.selectdamage();
		CRITICAL_DECK[s3].count--;
		sc=[s1,s2,s3];
		unit.log("select one critical");
		unit.selectcritical(sc,function(m) { 
		    pp.resolve({crit:new Critical(this,m),face:FACEUP})
		}.bind(this));
	    } else pp.resolve(cf);
	}.bind(this));
	return pp.promise();
    };
    Unit.prototype.wrap_after("deal",this,newdeal);
};
var hera_fct=function() {
    var m=this.getmaneuver();
    var p={};
    var gd=this.getdial();
    p[m.move]=m;
    if ((m.difficulty=="RED"||m.difficulty=="GREEN")&&this.ionized==false) {
	for (var i=0; i<gd.length; i++) 
	    if (gd[i].difficulty==m.difficulty
		&&typeof p[gd[i].move]=="undefined") {
		p[gd[i].move]=gd[i];
	    }
	    }
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
	    this.wrap_after("declareattack",this,function(w,target) {
		target.log("-1 defense [%0]",this.name);
		target.wrap_after("getagility",this,function(a) {
		    if (a>0) return a-1; 
		    return a;
		}).unwrapper("endbeingattacked");
		target.showstats();
	    });
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
	init: function() {
	    this.wrap_after("removefocustoken",this,function() {
		var p=this.selectnearbyally(2);
		if (p.length>0) {
		    this.doselection(function(n) {
			this.resolveactionselection(p,function (k) { 
			    p[k].log("+1 %FOCUS%");
			    p[k].addfocustoken();
			    this.endnoaction(n,"FOCUS");
			}.bind(this));
		    }.bind(this),"select unit for free %FOCUS%");
		} 
	    });
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
    { name:"Turbolaser",
      done:true,
      unit:"Turbolaser",
      faction:EMPIRE,
      skill:0,
      points:5,
      upgrades:[],
    },
    { name:"Thermal Exhaust Port",
      done:true,
      unit:"Exhaust Port",
      faction:EMPIRE,
      skill:0,
      points:100,
      upgrades:[],
    },
    {
        name: "Biggs Darklighter",
	done:true,
        init: function() {
	    var biggs=this;
	    Weapon.prototype.wrap_after("getenemiesinrange",this,function(r) {
		if (r.indexOf(biggs)>-1) {
		    var p=[];
		    for (var i=0; i<r.length; i++) {
			var u=r[i];
			if (u==biggs||u.getrange(biggs)>1) p.push(u);
		    }
		    r=p;
		}
		return r;
	    });
	    Unit.prototype.wrap_after("getenemiesinrange",this,function(r) {
		var found=false;
		var p=[];
		for (var i=0; i<this.weapons.length; i++) {
		    p[i]=[];
		    if (r[i].indexOf(biggs)>-1) {
			for (var j=0; j<r[i].length; j++) {
			    var u=r[i][j];
			    if (u==biggs||u.getrange(biggs)>1) p[i].push(u);
			}
		    } else p[i]=r[i];
		}
		return p;
	    });
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
		var f=FE_focus(m);
		var e=FE_evade(m);
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %EVADE%");
		    return m-FE_FOCUS+FE_EVADE;
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
	init: function() {
            this.wrap_after("addtarget",this,function(t) {
		var unit=this;
		this.doselection(function(n) {
		    var p=this.selectnearbyally(2);
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
	    });
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
	init: function() {
	    this.wrap_after("getattackstrength",this,function(i,sh,gas) {
		if (sh.criticals.length>0) {
		    this.log("+1 attack die for attacking damaged unit");
		    return gas+1;
		}
		return gas;
	    })
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
		var c=FCH_crit(m);
		var h=FCH_hit(m);
		if (h>0) {
		    this.log("1 %HIT% -> 1 %CRIT%");
		    return m-FCH_HIT+FCH_CRIT;
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
	init: function() {
	    this.wrap_after("handledifficulty",this,function(difficulty) {
		if (difficulty=="GREEN"&&this.candofocus()&&this.candoaction()) 
		    this.doaction([this.newaction(this.addfocus,"FOCUS")],
				  "green maneuver -> free focus action");
	    })
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
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (!sh.isinfiringarc(this)) {
		    a=a+1;
		    this.log("+1 attack against %0",sh.name);
		}
		return a;
	    });
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
	    var unit=this;
	    Unit.prototype.wrap_after("getattackrerolltokens",this,function(a) {
		if (targetunit==unit&&this.team!=unit.team) return "";
		return a;
	    });
	    Unit.prototype.wrap_after("canusefocus",this,function(b) {
		// Am I attacking darkcurse?
		if (targetunit==unit&&this.team!=unit.team) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("canusetarget",this,function(b) {
		if (targetunit==unit&&this.team!=unit.team) return false;
		return b;
	    });
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
	ambiguous:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 7,
        points: 27,
	init: maarek_fct,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
	ambiguous:true,
        faction:EMPIRE,
	unit: "TIE Defender",
        skill: 7,
        points: 36,
	init: maarek_fct,
        upgrades: [ELITE,CANNON,MISSILE],
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
			  "free %BOOST% or %ROLL% action");
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
	    this.weapons[0].attack=2;
	},
	uninstall: function() {
	    this.hull=8;
	    this.shield=5;
	    this.weapons[0].attack=3;
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
	deal: function(c,f) {
	    var p=$.Deferred();
	    if (f==FACEUP) return p.resolve({crit:c,face:DISCARD}).promise();
	    else return p.resolve({crit:c,face:f}).promise();
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
	    var p=this.selectnearbyally(1);
	    if (p.length>0&&d=="GREEN") {
		this.doselection(function(n) {
		    this.resolveactionselection(p,function(k) {
			p[k].log("+1 action [%0]",this.name);
			p[k].doaction(p[k].getactionbarlist());
			this.endnoaction(n,"");
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
	declareattack: function(w,target) {
	    var self=this;
	    target.wrap_after("cancelcritical",self,function(r,org,r2) {
		if (FCH_crit(r.ch)>FCH_crit(r2.ch)) {
		    this.log("+1 %STRESS% for cancelling %CRIT% [%0]",self.name);
		    this.addstress();
		}
		return r2;
	    }).unwrapper("endbeingattacked");
	    Unit.prototype.declareattack.call(this,w,target);
	},
        points: 38,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Boba Fett",
        unique: true,
	done:true,
        faction:EMPIRE,
        getmaneuverlist: function() {
	    var p=Unit.prototype.getmaneuverlist.call(this);
	    for (var i=1; i<=3; i++) {
		if (typeof p["BL"+i]!="undefined") {
		    this.log("select %BANKLEFT% or %BANKRIGHT% turn");
		    p["BR"+i]={move:"BR"+i,difficulty:p["BL"+i].difficulty};
		} else if (typeof p["BR"+i]!="undefined") {
		    this.log("select %BANKLEFT% or %BANKRIGHT% turn");
		    p["BL"+i]={move:"BL"+i,difficulty:p["BR"+i].difficulty};
		}
	    }
	    return p;
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
			this.log("+%1 reroll(s) [%0]",this.name,1);
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
	    var self=this;
	    this.shipimg="b-wing-1.png";
	},
	declareattack: function(w,target) {
	    target.wrap_after("cancelcritical",self,function(r,org,r2) {
		if (FCH_crit(r.ch)>0) {
		    if (FCH_crit(r2.ch)==0) {
			target.log("cannot cancel 1 %CRIT% [%0]",this.name)
			return {ch:r2.ch+FCH_CRIT,e:r2.e+1};
		    }
		    return r2;
		}
	    }.bind(this)).unwrapper("endbeingattacked");
	    Unit.prototype.declareattack.call(this,w,target);
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
	    var self=this;
	    var p=this.selectnearbyally(3);
	    if (p.length>0) {
		this.doselection(function(n) {
		    this.log("select unit for 12 PS");
		    this.resolveactionselection(p,function(k) {
			if (k>-1) {
			    p[k].log("has PS of 12");
			    p[k].wrap_after("getskill",self,function(s) {
				return 12;
			    }).unwrapper("endcombatphase");
			}
			this.endnoaction(n,"");
		    }.bind(this));
		}.bind(this));
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
		var p=this.selectnearbyally(3);
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
	    var self=this;
	    this.addglobalattackadd(this, function(m,n) {
		return (self.stress==0)&&
			(activeunit.team==self.team)&&(activeunit!=self)
			&&(self.getrange(activeunit)<=3);
	    }, function(m,n) {
		var f=self.rollattackdie(1)[0];
		self.addstress();
		activeunit.log("+1 attack die [%0]",self.name);
		if (f=="focus") return {m:m+FCH_FOCUS,n:n+1};
		if (f=="hit") return {m:m+FCH_HIT,n:n+1};
		if (f=="critical") return {m:m+FCH_CRIT,n:n+1};
		return {m:m,n:n+1};
	    },"hit");
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
	    this.addglobalattackrerolla(
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
	    Unit.prototype.wrap_after("gettargetableunits",this,function(n,p) {
		for (var i=0; i<p.length; i++) 
		    if (p[i].name=="Captain Kagi") return [p[i]];
		return p;
	    });
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
		var p=this.selectnearbyally(1);
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
	    var unit=this;
	    Unit.prototype.wrap_after("addstress",this,function() {
		if (this!=unit&&this.getrange(unit)<=2&&unit.stress<=2) {
		    this.log("-1 %STRESS% [%0]",unit.name);
		    unit.log("+1 %STRESS%");
		    this.removestressstoken();
		    this.showinfo();
		    unit.addstress();
		    unit.showinfo();
		}
	    });
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
        getmaneuverlist: function() {
	    var m=this.getmaneuver();
	    var p={};
	    p[m.move]=m;
	    if (m.move.match("K5|K3")&&this.ionized==false) {
		this.log("select %UTURN% speed");
		for (var i=1; i<=5; i+=2) {
		    if (typeof p["K"+i]=="undefined") {
			this.log("difficulty "+i+" "+m.difficulty);
			p["K"+i]={move:"K"+i,difficulty:m.difficulty,halfturn:false};
		    }
		}
	    }
	    return p;
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
		return {m:m+FCH_HIT,n:n+1};
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
        name: "Glaive Squadron Pilot",
        faction:EMPIRE,
        done:true,
        unit: "TIE Defender",
        skill: 6,
        points: 34,
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
	init: function() {
	    this.wrap_after("attackroll",this,function(n,r) {
		if (targetunit.istargeted.length>0&&this.targeting.length==0) {
		    this.addtarget(targetunit);
		    this.log("+%1 %TARGET% / %0",targetunit.name,1);	
		}
		return r;
	    });
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
			targetunit.criticals[l-i-this.criticalresolved].faceup();
		    }
		    targetunit.checkdead();
		    targetunit.show();
		    this.endnoaction(n,"");
		}.bind(this)}],"",true);
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
		var c=FCH_crit(m);
		var h=FCH_hit(m);
		if (h>0) {
		    unit.log("1 %HIT% -> 1 %CRIT%");
		    return m+FCH_CRIT-FCH_HIT;
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
	init: function() {
	    this.wrap_after("hashit",this,function(t,h) {
		if (h) {
		    this.log("+1 %FOCUS%");
		    this.addfocustoken();
		}
		return h;
	    });
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
	init: function() {
	    this.wrap_before("endattack",this,function(c,h) {
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
	    });
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
	init: function() {
	    this.wrap_before("removetarget",this,function(t) {
		if (this.stress) { 	    
		    this.log("-1 %TARGET% -> -1 %STRESS%");
		    this.removestresstoken();
		}
	    });
            this.wrap_before("addtarget",this,function(t) {
		if (this.stress) { 
		    this.removestresstoken();
		    this.log("+1 %TARGET% -> -1 %STRESS%");
		}
	    });
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
	    if (this.targeting.length==0||this.getskill()<a.getskill()) { // TODO:Priority to define
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
				 "free %BOOST% or %ROLL% action");
	},
	addfocustoken: function() {
	    if (this.candoaction()) this.freemove();
	    Unit.prototype.addfocustoken.call(this);
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
		return this.stress>0; 
	    }.bind(this),function(m,n) {
		var f=FCH_focus(m);
		this.removestresstoken();
		if (f>0) {
		    this.log("%0 %FOCUS% -> %0 %HIT%, -1 %STRESS%",f);
		    return m-FCH_FOCUS*f+FCH_HIT*f;
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
	init: function() {
	    var newdeal=function(c,f,p) {
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.face==FACEUP) {
			var s1=this.selectdamage();
			CRITICAL_DECK[s1].count--;
			var s2=this.selectdamage();
			CRITICAL_DECK[s2].count--;
			var sc=[s1,s2];
			this.log("select one critical");
			this.selectcritical(sc,function(m) {
			    pp.resolve({crit:new Critical(this,m),face:FACEUP});
			}.bind(this));
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    this.wrap_after("deal",this,newdeal);
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
	    if (this.criticals.length>0) return this.agility+1;
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
		var f=FCH_focus(m);
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %CRIT%");
		    return m-FCH_FOCUS+FCH_CRIT;
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
	    var p=this.selectnearbyally(1);
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
		var p=this.selectnearbyenemy(1);
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
	    this.addglobaldefensereroll(
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
        getmaneuverlist: function() {
	    var gm=this.getmaneuver();
	    var dial=gm.move;
	    if (dial=="SL3") {
		this.log("%SLOOPLEFT% or %TURNLEFT% maneuver");
		return {"SL3":gm,"TL3":{move:"TL3",halfturn:true,difficulty:gm.difficulty}}
	    } else if (dial=="SR3") {
		this.log("%SLOOPRIGHT% or %TURNRIGHT% maneuver");
		return {"SR3":gm,"TR3":{move:"TR3",halfturn:true,difficulty:gm.difficulty}}
	    } else return {dial:gm}
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
		var p=this.selectnearbyally(2);
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
		var p=this.selectnearbyally(2);
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
		for (var i in squadron) {
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
	    Unit.prototype.wrap_after("addiontoken",this,function() {
		if (this.getrange(unit)<=3 &&unit.team!=this.team&&unit.stress==0) {
		    unit.addstress();
		    this.resolvehit(1);
		    unit.log("+1 %cSTRESS%");
		    this.log("+%1 %HIT [%0]",unit.name,1);
		    this.checkdead();
		}
	    });
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
		var p=this.selectnearbyenemy(2);
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
	    var self=this;
	    var p=this.selectnearbyenemy(2);
	    if (p.length>0) {
		this.doselection(function(n) {
		    this.log("select unit for a 0 PS");
		    this.resolveactionselection(p,function(k) {
			p[k].wrap_after("getskill",self,function(s) {
			    return 0;
			}).unwrapper("endcombatphase");
			this.endnoaction(n,"");
		    }.bind(this));
		}.bind(this));
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
	    this.doselection(function(n,org) {
		var p=this.gettargetableunits(1);
		var i;
		this.log("gettargetableunits"+p.length);
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
	getmaneuverlist: function() {
	    var m=this.getmaneuver();
	    var p={};
	    p[m.move]=m;
	    var speed = parseInt(m.move.substr(-1),10);
	    for (var i=-1; i<=1; i++) {
		var r=m.move.replace(/\d/,(speed+i)+"");
		if (typeof P[r]!="undefined") {
		    p[r]={move:r,difficulty:m.difficulty,halfturn:m.halfturn};
		}
	    }
	    return p;
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
		if (this.unit.team!=unit.team&&unit.getrange(this.unit)==1) {
		    this.unit.log("0 attack range bonus [%0]",unit.name);
		    return 0;
		}
		return g;
	    });
	    Weapon.prototype.wrap_after("getrangedefensebonus",this,function(sh,g) {
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
			if (c.length>0) c[rand(c.length)].faceup();
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
	init: function() {
	    this.wrap_after("hashit",this,function(t,b) {
		var p=this.criticalresolved+this.hitresolved;
		if (b&&this.criticalresolved>0) {
		    if (p<=t.shield||(t.hull<=2&&p>t.shield)) { 
			this.criticalresolved--;
			this.hitresolved+=2;
			this.log("1 %CRIT% -> 2 %HIT%");
		    } else this.log("%0 %SHIELD% are down, more than 2 %HULL%: keeping critical",t.name);
		}
		return b;
	    })
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
	getattackstrength: function(i,sh) {
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
	getdefensestrength: function(i,sh) {
	    var a=0;
	    if (this.weapons[i].getsector(sh)<=3) {
		a=1;
		this.log("+1 defense die for defending in firing arc");
	    }
	    return Unit.prototype.getdefensestrength.call(this,i,sh)+a;
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
	    mirandaturn:-1,
	    preattackroll: function(w,t) {
		if (this.mirandaturn!=round) {
		    var a1={org:this,name:this.name,type:"SHIELD",action:function(n) {
			this.mirandaturn=round;
			this.log("-1 attack die");
			this.wrap_after("getattackstrength",this,function(i,sh){
			    var a= this.weapons[i].getattack()-1;
			    return this.weapons[i].getrangeattackbonus(sh)+(a>0)?a:0;
			}).unwrapper("attackroll");
			if (this.shield<this.ship.shield) {
			    this.shield++; 
			    this.log("+1 %SHIELD%");
			}
			this.endnoaction(n,"SHIELD");
		    }.bind(this)};
		    var a2={org:this,name:this.name,type:"HIT",action:function(n) {
			this.log("-1 %SHIELD%");
			this.log("+1 attack die");
			this.mirandaturn=round;
			this.wrap_after("getattackstrength",this,function(i,sh){
			    return 1+Unit.prototype.getattackstrength.call(this,i,sh);
			}).unwrapper("attackroll");
			this.removeshield(1); 
			this.endnoaction(n,"HIT");
		    }.bind(this)};
		    var list=[];
		    if (this.shield>0) list.push(a2);
		    if (this.shield<this.ship.shield) list.push(a1);
		    this.donoaction(list,"select to add shield/roll 1 fewer die or remove shield/roll 1 additional die",true);
		}
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
		Unit.prototype.wrap_before("beginattack",this,function() {
		    if (this!=self&&this.team==self.team) {
			this.wrap_after("canusefocus",self,function(b) {
			    return b||(self.canusefocus()&&this.getrange(self)<=2);
			}).unwrapper("endattack");
			this.wrap_before("removefocustoken",self,function() {
			    if (this.getrange(self)<=2) {
				this.focus++; // compensate
				self.log("-1 %FOCUS% [%0]",this.name);
				self.removefocustoken();
			    }
			}).unwrapper("endattack");
		    }
		})
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
	    init: function() {
		this.wrap_after("addtarget",this,function(sh) {
		    this.log("+%1 %TARGET% / %0",sh.name,2);
		    this.targeting.push(sh);
		    sh.istargeted.push(this);
		    this.movelog("T-"+sh.id);
		    sh.show();
		    this.show();
		});
	    },
	    /* TODO: A bit too automatic */
	    boundtargets: function(sh) {
		if (this.targeting.indexOf(sh)>-1) return true;
		for (var i=0; i<this.targeting.length-1; i++) this.removetarget(this.targeting[i]);
		return false;
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
				  "free %ROLL% action");
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
			var f=FCH_focus(m);
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %HIT%");
			    return m-FCH_FOCUS+FCH_HIT;
			}
			return m;
		    }.bind(this),false,"focus");
		this.adddefensemodd(this,function(m,n) { 
			return this.focus>0;
		    }.bind(this),function(m,n) {
			var f=FE_focus(m);
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %EVADE%");
			    return m-FE_FOCUS+FE_EVADE;
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
	  name: "Ello Asty",
	  faction: REBEL,
	  done:true,
	  beta:true,
	  unit: "T-70 X-Wing",
	  skill: 7,
	  unique:true,
	  getdial:function() {
	      var save=[];
	      var gd=Unit.prototype.getdial.call(this);
	      for (var i=0; i<gd.length; i++) {
		  var move=gd[i].move;
		  var d=gd[i].difficulty;
		  if (move.match(/TR[RL]\d/)&&this.stress==0) d="WHITE";
		  save[i]={move:move,difficulty:d};
	      }
	      return save;
	  },
	  upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	  points: 30
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
	   var p=this.selectnearbyally(1);
	   p.push(this);
	   for (var i=0; i<p.length; i++) p[i].removestresstoken();
	   return Unit.prototype.begincombatphase.call(this);
       },
       upgrades: [TECH],
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
			return this.canusefocus()&&this.targeting.indexOf(targetunit)>-1;
		    }.bind(this),function(m,n) {
			this.removefocustoken();
			this.removetarget(targetunit);
			this.log("all results are %CRIT%");
			return n*FCH_CRIT;
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
   },
    {
	name:"Hera Syndulla",
	unique:true,
	faction:REBEL,
	unit:"VCX-100",
	skill:7,
	ambiguous:true,
	points:40,
	done:true,
        getmaneuverlist: hera_fct,
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW]
    },
    {
	name:"'Chopper'",
	unique:true,
	faction:REBEL,
	unit:"VCX-100",
	skill:4,
	points:37,
	done:true,
	begincombatphase: function() {
	    for (var i=0; i<this.touching.length; i++) {
		if (this.touching[i].team!=this.team) {
		    this.touching[i].addstress();
		    this.touching[i].log("+1 %STRESS% [%0]",this.name);
		}
	    }
	    return Unit.prototype.begincombatphase.call(this);
	},
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW]
    },
    {
	name:"Ezra Bridger",
	faction:REBEL,
	unique:true,
	done:true,
	unit:"Attack Shuttle",
	skill:4,
	points:20,
	init: function() {
	    this.adddefensemodd(this,function(m,n) {
		return this.stress>0;
	    }.bind(this), function(m,n) {
		var f=FE_focus(m);
		if (f>2) f=2;
		if (f>0) {
		    this.log("%0 %FOCUS% -> %0 %EVADE%",f);
		    return m-f*FE_FOCUS+f*FE_EVADE;
		} 
		return m;
	    }.bind(this),false,"focus");
	},        
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"Hera Syndulla",
	faction:REBEL,
	unique:true,
	done:true,
	unit:"Attack Shuttle",
	skill:7,
	ambiguous:true,
	points:22,
        getmaneuverlist: hera_fct,
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"Sabine Wren",
	faction:REBEL,
	unique:true,
	done:true,
	unit:"Attack Shuttle",
	skill:5,
	points:21,
	beginactivation: function() {
	    if (this.candoaction()) 
		this.doaction([this.newaction(this.resolveboost,"BOOST"),
			       this.newaction(this.resolveroll,"ROLL")],
			      "free %BOOST% or %ROLL% action");
	},
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"'Zeb' Orrelios",
	faction:REBEL,
	unique:true,
	unit:"Attack Shuttle",
	skill:3,
	points:18,
	done:true,
	cancelhit:function(r,t) {
	    // first, cancel criticals
	    this.log("cancel %CRIT% first");
	    r=this.cancelcritical(r,t);
	    r=Unit.prototype.cancelhit(r,t);
	    return r;
	},
	upgrades:[TURRET,CREW]
    },
    {
	name:"Kanan Jarrus",
	faction:REBEL,
	unique:true,
	unit:"VCX-100",
	skill:4,
	points:38,
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW]
    },
    {
	name:"'Wampa'",
	faction:EMPIRE,
	unique:true,
	unit:"TIE Fighter",
	skill:4,
	points:14,
	done:true,
	init: function() {
	    this.addattackadd(this,function(m,n) { 
		return true; 
	    },function(m,n) {
		this.log("cancel all dice");
		if (FCH_crit(m)>0) {
		    targetunit.log("+1 damage card [%0]",this.name);
		    targetunit.applydamage(1);
		}
		return {m:0,n:0};
	    }.bind(this),"critical");
	},
	upgrades:[]
    },
    { 
	name:"'Youngster'",
	faction:EMPIRE,
	unique:true,
	unit:"TIE Fighter",
	skill:6,
	points:15,
	done:true,
	init: function() {
	    var elite=null;
	    var self=this;
	    for (i=0; i<this.upgrades.length; i++) {
		if (this.upgrades[i].type==ELITE&&(typeof this.upgrades[i].action=="function")){ 
		    elite=$.extend({}, this.upgrades[i]);
		    elite.clone=true;
		    elite.isactive=true;
		}
	    }
	    if (elite==null) return;
	    this.log("share %0 upgrade",elite.name);
	    Unit.prototype.wrap_after("getupgactionlist",self,function(l) {
		var p=this.selectnearbyally(3);
		if (this.ship.name.match(/.*TIE.*Fighter.*/)&&p.indexOf(self)>-1&&elite.candoaction()&&elite.isactive) {
		    this.log("elite action from %0 available",self.name);
		    elite.unit=this;
		    l.push({org:elite,action:elite.action,type:elite.type.toUpperCase(),name:elite.name});
		}
		return l;
	    });
	},
	upgrades:[ELITE]
    },
    {
	name:"'Chaser'",
	faction:EMPIRE,
	unique:true,
	done:true,
	unit:"TIE Fighter",
	skill:3,
	points:14,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("removefocustoken",this,function() {
		if (this.team==self.team&&this!=self&&this.getrange(self)<=1) {
		    self.log("+1 %FOCUS%");
		    self.addfocustoken();
		}
	    });
	},
	upgrades:[]
    },
    {
	name:"Gamma Squadron Veteran",
	faction:EMPIRE,
	done:true,
	unit:"TIE Bomber",
	skill:5,
	points:19,
	upgrades:[ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB]
    },
    {
	name:"The Inquisitor",
	faction:EMPIRE,
	unit:"TIE Adv. Prototype",
	skill:8,
	unique:true,
	done:true,
	points:25,
	getattackstrength: function(i,sh) {
	    if (i==0) {
		var att=this.weapons[i].getattack();
		if (this.weapons[i].getrange(sh)>1) {
		    this.log("+1 attack die with primary weapon [%0]",this.name);
		    return att+1;
		}
	    } 
	    return Unit.prototype.getattackstrength.call(this,i,sh);
	},
	upgrades:[ELITE,MISSILE]
    },
    {
	name:"Valen Rudor",
	faction:EMPIRE,
	unique:true,
	unit:"TIE Adv. Prototype",
	skill:6,
	points:22,
	done:true,
	init: function() {
	    this.wrap_after("endbeingattacked",this,function(c,h) {
		if (this.candoaction()) {
		    this.log("+1 free action [%0]",this.name);
		    this.doaction(this.getactionlist());
		}
	    });
	},
	upgrades:[ELITE,MISSILE]
    },
   {
       name:"Sienar Test Pilot",
       faction:EMPIRE,
       done:true,
       unit:"TIE Adv. Prototype",
       skill:2,
       points:16,
       upgrades:[MISSILE]
    },
   {
       name:"Zuckuss",
       faction:SCUM,
       unique:true,
       unit:"G-1A Starfighter",
       skill:7,
       points:28,
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT]
    },
   {
       name:"4-LOM",
       faction:SCUM,
       unique:true,
       done:true,
       unit:"G-1A Starfighter",
       skill:6,
       points:26,
       init: function() {
	   this.wrap_before("endphase",this,function() {
	       var p=this.selectnearbyunits(1,function() {return true;});
	       if (this.stress>0&&p.length>1) {
		   this.log("select unit (or self to cancel) [%0]",this.name);
		   this.doselection(function(n) {
		       this.resolveactionselection(p,function(k) {
			   if (p[k]!=this) {
			       p[k].addstress();
			       this.removestresstoken();
			       p[k].log("+1 %STRESS% [%0]",this.name);
			       this.log("-1 %STRESS%");
			   }
			   this.endnoaction(n,"HIT");
		       }.bind(this));
		   }.bind(this));
	       }
	   });
       },
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT]
    }
];

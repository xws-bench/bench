(function() {
    var Critical=window.Critical || {};
    var Unit=window.Unit || {};
    var sabine_fct=function() {
    var p=[];
    if (this.hasionizationeffect()) return;
    if (this.candoaction()) {
	if (this.candoboost()) 
	    p.push(this.newaction(this.resolveboost,"BOOST"));
	if (this.candoroll()) 
	    p.push(this.newaction(this.resolveroll,"ROLL"));
	this.doaction(p,"free %BOOST% or %ROLL% action");
    }
}
var kylo_fct = function() {
	this.firstroundhit=-1;
	this.wrap_after("resolveishit",this,function(t) {
		if (this.firstroundhit<round) {
			this.firstroundhit=round;
			new Condition(t,this,"I'll Show You The Dark Side");
		}
	});
}

var ezra_fct = function() {
    this.adddicemodifier(Unit.DEFENSE_M,Unit.MOD_M,Unit.DEFENSE_M,this,{
	req:function(m,n) {
	    return this.stress>0;
	}.bind(this), 
	f:function(m,n) {
	    var f=Unit.FE_focus(m);
	    if (f>2) f=2;
	    if (f>0) {
		this.log("%0 %FOCUS% -> %0 %EVADE%",f);
		return m-f*Unit.FE_FOCUS+f*Unit.FE_EVADE;
	    } 
	    return m;
	}.bind(this),str:"focus"});
}


var zeb_fct = function(r,t) {
    // first, cancel criticals
    this.log("cancel %CRIT% first");
    r=this.cancelcritical(r,t);
    r=Unit.prototype.cancelhit(r,t);
    return r;
}
var maarek_fct = function() {
    var unit=this;
    var newdeal=function(c,f,p) {
	var pp=$.Deferred();
	p.then(function(cf) {
	    var crit=cf.crit;
	    if (cf.face==Critical.FACEUP&&attackunit==unit&&targetunit==this) {
		var s1=this.selectdamage();
		Critical.CRITICAL_DECK[s1].count--;
		var s2=this.selectdamage();
		Critical.CRITICAL_DECK[s2].count--;
		var s3=this.selectdamage();
		Critical.CRITICAL_DECK[s3].count--;
		var sc=[s1,s2,s3];
		unit.log("select one critical");
		unit.selectcritical(sc,function(m) { 
		    pp.resolve({crit:new Critical(this,m),face:Critical.FACEUP});
		}.bind(this));
	    } else pp.resolve(cf);
	}.bind(this));
	return pp.promise();
    };
    Unit.prototype.wrap_after("deal",this,newdeal);
};
var poe_fct=function() {
    this.wrap_after("modifyattackroll",this,function(m,n,d,mm) {
	if (Unit.FCH_focus(mm)>0) mm=mm-Unit.FCH_FOCUS+Unit.FCH_HIT;
	return mm;
    }.bind(this));
    this.adddicemodifier(Unit.ATTACK_M,Unit.MOD_M,Unit.ATTACK_M,this,{
	req:function(m,n) { 
	    return this.focus>0;
	}.bind(this),
	aiactivate: function(m,n) {
	    return Unit.FCH_focus(m)>0;
	},
	f:function(m,n) {
	    var f=Unit.FCH_focus(m);
	    if (f>0) {
		this.log("1 %FOCUS% -> 1 %HIT%");
		return m-Unit.FCH_FOCUS+Unit.FCH_HIT;
	    }
	    return m;
	}.bind(this),str:"focus"});
    this.adddicemodifier(Unit.DEFENSE_M,Unit.MOD_M,Unit.DEFENSE_M,this,{
	req:function(m,n) { 
	    return this.focus>0;
	}.bind(this),
	aiactivate: function(m,n) {
	    return Unit.FE_focus(m)>0;
	},
	f:function(m,n) {
	    var f=Unit.FE_focus(m);
	    if (f>0) {
		this.log("1 %FOCUS% -> 1 %EVADE%");
		return m-Unit.FE_FOCUS+Unit.FE_EVADE;
	    }
	    return m;
	}.bind(this), str:"focus"});
}
var hera_fct=function(p) {
    var m;
    var gd=this.getdial();
    for (var i in p) {
	m=p[i];
	if ((m.difficulty=="RED"||m.difficulty=="GREEN")&&!this.hasionizationeffect()) {
	    for (var i=0; i<gd.length; i++) 
		if (gd[i].difficulty==m.difficulty) p[gd[i].move]=gd[i];
	}
    }
    return p;
}
window.PILOTS = [
    {
	name:"Contracted Scout",
	faction:Unit.SCUM,
	pilotid:0,
	done:true,
	unit:"JumpMaster 5000",
	skill:3,
	points:25,
	upgrades:[Unit.ELITE,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Wedge Antilles",    
	done:true,
        unique: true,
	faction:Unit.REBEL,
        unit: "X-Wing",
        skill: 9,
	init: function() {
	    this.wrap_before("resolveattack",this,function(w,target) {
		target.log("-1 defense [%0]",this.name);
		target.wrap_after("getagility",this,(a) => (a>0)?a-1:a).unwrapper("cleanupattack");
		target.showstats();
	    });
	},
	pilotid:1,
        points: 29,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Garven Dreis",
	done:true,
	faction:Unit.REBEL,
        unique: true,
        unit: "X-Wing",
	init: function() {
	    this.wrap_after("removefocustoken",this,function() {
                this.selectunit(this.selectnearbyally(2),function (p,k) { 
                    p[k].log("+1 %FOCUS%");
                    p[k].addfocustoken();
                }.bind(this),["select unit for free %FOCUS%"],false);
	    });
	},
	pilotid:2,
        skill: 6,
        points: 26,
        upgrades: [Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "Red Squadron Pilot",
	done:true,
        unit: "X-Wing",
	faction:Unit.REBEL,
        skill: 4,
        points: 23,
	pilotid:3,
        upgrades: [Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Rookie Pilot",
	done:true,
        unit: "X-Wing",
	faction:Unit.REBEL,
        skill: 2,
        points: 21,
	pilotid:4,
        upgrades: [Unit.TORPEDO,Unit.ASTROMECH]
    },
    { name:"Turbolaser",
      done:true,
      unit:"Turbolaser",
      faction:Unit.EMPIRE,
      skill:0,
      points:4,
      pilotid:5,
      upgrades:[Unit.MISSILE,Unit.MISSILE,Unit.TORPEDO,Unit.TORPEDO,Unit.TURRET]
    },
    { name:"Thermal Exhaust Port",
      done:true,
      unit:"Exhaust Port",
      faction:Unit.EMPIRE,
      skill:0,
      points:49,
      pilotid:6,
      upgrades:[],
      init: function() {
	  this.wrap_before("dies",this,function() {
	      for (var i in squadron) {
		  if (squadron[i].team==this.team) Unit.prototype.dies.call(squadron[i]);
	      }
	  });
      }
    },
    {
        name: "Biggs Darklighter",
	done:true,
	pilotid:7,
        init: function() {
	    var biggs=this;
	    Weapon.prototype.wrap_after("getenemiesinrange",this,function(enemylist,r) {
		if (typeof r=="undefined") {
		    r=enemylist;
		    enemylist=this.unit.selectnearbyenemy(3);
		}
		if (this.unit.foundbiggs==true) {
		    var p=[];
		    for (var i=0; i<r.length; i++) {
			var u=r[i];
			if (u==biggs||u.getrange(biggs)>1) p.push(u);
		    }
		    r=p;
		}
		return r;
	    });
	    Unit.prototype.wrap_after("getenemiesinrange",this,function(weaponlist,enemies,r) {

		this.foundbiggs=false;
		var p=[];
		for (var i=0; i<weaponlist.length; i++) {
		    if (r[i].indexOf(biggs)>-1) { this.foundbiggs=true; break; }
		}
		if (this.foundbiggs) {
		    for (var i=0; i<weaponlist.length; i++) {
			p[i]=[];
			for (var j=0; j<r[i].length; j++) {
			    var u=r[i][j];
			    if (u==biggs||u.getrange(biggs)>1) {
				p[i].push(u);
			    }
			}
		    }
		} else p=r;
		return p;
	    });
	},
        unique: true,
        unit: "X-Wing",
	faction:Unit.REBEL,
        skill: 5,
        points: 25,
        upgrades: [Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "Luke Skywalker",
	done:true,
	pilotid:8,
	faction:Unit.REBEL,
	init: function() {
	    this.adddicemodifier(Unit.DEFENSE_M,Unit.MOD_M,Unit.DEFENSE_M,this,{
		req: (m,n) => true,
		aiactivate:(m,n) => Unit.FE_focus(m)>0,
		f:function(m,n) {
		    if (Unit.FE_focus(m)>0) {
			this.log("1 %FOCUS% -> 1 %EVADE%");
			m=m-Unit.FE_FOCUS+Unit.FE_EVADE;
		    } 
		    return m;
		}.bind(this),
		str:"focus"});
	},        
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 28,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "Gray Squadron Pilot",
	done:true,
	faction:Unit.REBEL,
        unit: "Y-Wing",
        skill: 4,
	pilotid:9,
        points: 20,
        upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "'Dutch' Vander",
	done:true,
	pilotid:10,
	init: function() {
            this.wrap_after("addtarget",this,function(t) {
		this.selectunit(this.selectnearbyally(2),function(p,k) {
		    p[k].selectunit(p[k].gettargetableunits(3),function(pp,kk) {
			if (this.gettargetableunits(3).indexOf(pp[kk])>-1) 
			    this.addtarget(pp[kk]);
		    },["select target to lock"],false);
		},["select unit for free %TARGET% (or self to cancel)"],true);
	    });
	},
	faction:Unit.REBEL,
        unique: true,
        unit: "Y-Wing",
        skill: 6,
        points: 23,
        upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "Horton Salm",
	done:true,
	pilotid:11,
	faction:Unit.REBEL,
        unique: true,
        unit: "Y-Wing",
        skill: 8,
        points: 25,
	init: function() {
	    this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
		dice:["blank"],
		n:() => 9,
		req:function(attack,w,defender) {
		    var r=this.getrange(defender);
		    if (r>=2&&r<=3) {
			this.log("reroll any blank result");
			return true;
		    }
		    return false;
		}.bind(this)
	    });
	},
        upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "Gold Squadron Pilot",
	done:true,
	pilotid:12,
        unit: "Y-Wing",
	faction:Unit.REBEL,
        skill: 2,
        points: 18,
        upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "Academy Pilot",
	done:true,
	pilotid:13,
        unit: "TIE Fighter",
        faction:Unit.EMPIRE,
        skill: 1,
        points: 12,
        upgrades: [],
    },
    {
        name: "Obsidian Squadron Pilot",
	done:true,
	pilotid:14,
        unit: "TIE Fighter",
        faction:Unit.EMPIRE,
        skill: 3,
        points: 13,
        upgrades: [],
    },
    {
        name: "Black Squadron Pilot",
	done:true,
	pilotid:15,
        unit: "TIE Fighter",
        faction:Unit.EMPIRE,
        skill: 4,
        points: 14,
        upgrades: [Unit.ELITE],
    },
    {
        name: "'Scourge'",
	unique:true,
	beta:true,
	done:true,
	pilotid:16,
        unit: "TIE Fighter",
        faction:Unit.EMPIRE,
        skill: 7,
	wave:["epic"],
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
        upgrades: [Unit.ELITE],
    },
    {
        name: "'Winged Gundark'",
        faction:Unit.EMPIRE,
	pilotid:17,
        init:  function() {
	    this.wrap_after("modifyattackroll",this,function(m,n,d,mm) {
		if (Unit.FCH_hit(mm)>0) mm=mm-Unit.FCH_HIT+Unit.FCH_CRIT;
		return mm;
	    });
	    this.adddicemodifier(Unit.ATTACK_M,Unit.MOD_M,Unit.ATTACK_M,this,{
		req:function(m,n) { 
		    return (this.getrange(targetunit)==1);
		}.bind(this),
		aiactivate: (m,n) => Unit.FCH_hit(m)>0,
		f:function(m,n) {
		    if (Unit.FCH_hit(m)>0) {
			this.log("1 %HIT% -> 1 %CRIT%");
			m= m-Unit.FCH_HIT+Unit.FCH_CRIT;
		    }
		    return m;
		}.bind(this),str:"hit"});
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
        faction:Unit.EMPIRE,
	done:true,
	pilotid:18,
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
	pilotid:19,
        faction:Unit.EMPIRE,
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
	pilotid:20,
        faction:Unit.EMPIRE,
        unique: true,
	init: function() {
	    var self=this;
	    this.wrap_after("isattackedby",this,function(w,a) {
		a.wrap_after("canusefocus",self,() => false).unwrapper("afterdefenseeffect");
		a.wrap_after("canusetarget",self,() => false).unwrapper("afterdefenseeffect");
		a.wrap_after("getdicemodifiers",self,function(mods) {
		    var p=[];
		    for (var i=0; i<mods.length; i++)
			if (mods[i].type!=Unit.REROLL_M) p.push(mods[i]);
		    return p;
		}).unwrapper("afterdefenseeffect");
	    })
	},
        unit: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: "'Mauler Mithel'",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:21,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (this.gethitrange(w,sh)==1) { 
		    this.log("+1 attack against %0",sh.name);
		    a=a+1;
		}
		return a;
	    });
	},
        unique: true,
        unit: "TIE Fighter",
        skill: 7,
        points: 17,
        upgrades: [Unit.ELITE],
    },
    {
        name: "'Howlrunner'",
        unique: true,
	done:true,
	pilotid:22,
        faction:Unit.EMPIRE,
        unit: "TIE Fighter",
        skill: 8,
	init: function() {
	    Unit.prototype.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
		dice:["blank","focus"],
		n:() => 1,
		req:function(attacker,w,defender) {
		    // Howlrunner dead ? 
		    if (attacker!=this&&!this.dead
			&&attacker.getrange(this)==1
			&&attacker.isally(this)&&w.isprimary) {
			attacker.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    });
	},
        points: 18,
        upgrades: [Unit.ELITE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
	pilotid:23,
	ambiguous:true,
        faction:Unit.EMPIRE,
	edition:"TIE Advanced",
	unit: "TIE Advanced",
        skill: 7,
        points: 27,
	init: maarek_fct,
        upgrades: [Unit.ELITE,Unit.MISSILE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
	pilotid:24,
	ambiguous:true,
	edition:"TIE Defender",
        faction:Unit.EMPIRE,
	unit: "TIE Defender",
        skill: 7,
        points: 35,
	init: maarek_fct,
	shipimg:"tie-defender-red",
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.MISSILE],
    },
    {
        name: "Tempest Squadron Pilot",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:25,
        unit: "TIE Advanced",
        skill: 2,
        points: 21,
        upgrades: [Unit.MISSILE],
    },
    {
        name: "Storm Squadron Pilot",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:26,
        unit: "TIE Advanced",
        skill: 4,
        points: 23,
        upgrades: [Unit.MISSILE],
    },
    {
        name: "Darth Vader",
        faction:Unit.EMPIRE,
        unique: true,
	done:true,
	pilotid:27,
        unit: "TIE Advanced",
        skill: 9,
	init: function() {
	    this.wrap_before("doendmaneuveraction",this,function() {
		this.log("+1 action [%0]",this.name);
		this.doaction(this.getactionlist(),"",this.candoendmaneuveraction);
	    });
	},
	secaction:-1,
        points: 29,
        upgrades: [Unit.ELITE,Unit.MISSILE],
    },
    {
        name: "Alpha Squadron Pilot",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:28,
        unit: "TIE Interceptor",
        skill: 1,
        points: 18,
        upgrades: [ ],
    },
    {
        name: "Avenger Squadron Pilot",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:29,
        unit: "TIE Interceptor",
        skill: 3,
        points: 20,
        upgrades: [ ],
    },
    {
        name: "Saber Squadron Pilot",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:30,
        unit: "TIE Interceptor",
        skill: 4,
        points: 21,
	wave:["aces",2],
        upgrades: ["Elite"],
    },
    {
        name: "'Fel's Wrath'",
        faction:Unit.EMPIRE,
        unique: true,
        unit: "TIE Interceptor",
	skill: 5,
	pilotid:31,
	done:true,
	init: function() {
	    this.wrap_after("endcombatphase",this,function() {
		this.hasfired=0;
		this.checkdead();
	    });
	    this.wrap_after("canbedestroyed",this,function(skillturn,b) {
		return (skillturn==-1);
	    });
	},
        points: 23,
        upgrades: [],
    },
    {
        name: "Turr Phennir",
        faction:Unit.EMPIRE,
        unique: true,
	done:true,
	pilotid:32,
        unit: "TIE Interceptor",
        skill: 7,
	init: function() {
	    this.addafterattackeffect(this,function() {
		var p=[];/*TODO: should not test before performing the action */
		if (this.candoboost()) 
		    p.push(this.newaction(this.resolveboost,"BOOST"));
		if (this.candoroll()) 
		    p.push(this.newaction(this.resolveroll,"ROLL"));
		this.doaction(p,"free %BOOST% or %ROLL% action");
	    });
	},
        points: 25,
        upgrades: [Unit.ELITE],
    },
    {
        name: "Soontir Fel",
        faction:Unit.EMPIRE,
        unique: true,
	done:true,
	pilotid:33,
	init: function() {
	    this.wrap_after("addstress",this,function () {
		this.log("+1 %STRESS% -> +1 %FOCUS%");
		this.addfocustoken();
	    });
	},
        unit: "TIE Interceptor",
        skill: 9,
        points: 27,
        upgrades: [Unit.ELITE],
    },
    {
        name: "Tycho Celchu",
	faction:Unit.REBEL,
        unique: true,
	pilotid:34,
	done:true,
	init: function() {
	    this.wrap_after("hasnostresseffect",this,function() {
		return true;
	    });
	},
        unit: "A-Wing",
        skill: 8,
        points: 26,
        upgrades: [Unit.ELITE,Unit.MISSILE],
    },
    {
        name: "Arvel Crynyd",
	faction:Unit.REBEL,
	pilotid:35,
        unique: true,
	done:true,
        unit: "A-Wing",
	init: function() {
	    this.wrap_after("checkcollision",this,function(sh) {
		return false;
	    });
	},
        skill: 6,
        points: 23,
        upgrades: [Unit.MISSILE],
    },
    {
        name: "Green Squadron Pilot",
	faction:Unit.REBEL,
	done:true,
	wave:["aces",2],
        unit: "A-Wing",
        skill: 3,
	pilotid:36,
        points: 19,
        upgrades: [Unit.ELITE,Unit.MISSILE],
    },
    {
        name: "Prototype Pilot",
	faction:Unit.REBEL,
	done:true,
	pilotid:37,
	wave:["aces",2],
        unit: "A-Wing",
        skill: 1,
        points: 17,
        upgrades: [Unit.MISSILE],
    },
    {
        name: "Outer Rim Smuggler",
	faction:Unit.REBEL,
        unit: "YT-1300",
	done:true,
	pilotid:38,
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
        upgrades: [Unit.CREW,Unit.CREW],
    },
    {
        name: "Chewbacca",
        unique: true,
	done:true,
	ambiguous:true,
	faction:Unit.REBEL,
        unit: "YT-1300",
        skill: 5,
	pilotid:39,
        points: 42,
	deal: function(c,f) {
	    var p=$.Deferred();
	    if (f==Critical.FACEUP) {
		this.log("turn faceup damage facedown");
		return p.resolve({crit:c,face:Critical.FACEDOWN}).promise();
	    } else return p.resolve({crit:c,face:f}).promise();
	},
        upgrades: [Unit.ELITE,Unit.MISSILE,Unit.CREW,Unit.CREW]
    },
    {
        name: "Lando Calrissian",
	faction:Unit.REBEL,
        unique: true,
        unit: "YT-1300",
        skill: 7,
	pilotid:40,
        points: 44,
	init: function() {
	    this.wrap_after("handledifficulty",this,function(d) {
		if (d=="GREEN") {
		    this.selectunit(this.selectnearbyally(1),function(p,k) {
			p[k].log("+1 action [%0]",this.name);
			p[k].doaction(p[k].getactionbarlist(),"");
		    }.bind(this),["select unit (or self to cancel) [%0]",this.name],true);
		}
	    });
	},
	done:true,
        upgrades: [Unit.ELITE,Unit.MISSILE,Unit.CREW,Unit.CREW],
    },
    {
        name: "Han Solo",
        unique: true,
	done:true,
	faction:Unit.REBEL,
        unit: "YT-1300",
        skill: 9,
	pilotid:41,
        points: 46,
	init: function() {
	    this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
		dice:["blank","focus","hit","critical"],
		n:function() { return 9; },
		req:function(attack,w,defender) { return true; },
		mustreroll:true,
	    });
	},
        upgrades: [Unit.ELITE,Unit.MISSILE,Unit.CREW,Unit.CREW],
    },
    {
        name: "Kath Scarlet",
        unique: true,
        faction:Unit.EMPIRE,
        unit: "Firespray-31",
        skill: 7,
	pilotid:42,
	done:true,
	init: function() {
	    this.wrap_before("resolveattack",this,function(w,target) {
		var self=this;
		target.wrap_after("cancelcritical",self,function(r,org,r2) {
		    if (Unit.FCH_crit(r.ch)>Unit.FCH_crit(r2.ch)) {
			this.log("+1 %STRESS% for cancelling %CRIT% [%0]",self.name);
			this.addstress();
		    }
		    return r2;
		}).unwrapper("afterdefenseeffect");
	    });
	},
        points: 38,
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE]
    },
    {
        name: "Boba Fett",
        unique: true,
	done:true,
	pilotid:43,
        faction:Unit.EMPIRE,
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		if (this.hasionizationeffect()) return p;
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
	    });
	},
        unit: "Firespray-31",
        skill: 8,
        points: 39,
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE]
    },
    {
        name: "Krassis Trelix",
        unique: true,
	done:true,
	pilotid:44,
        faction:Unit.EMPIRE,
        unit: "Firespray-31",
	attackrerolls:function(w,d) {
	    if(!w.isprimary) return 1;
	    return 0;
	},
	init: function() {
	    this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attack,w,defender) {
		    if (!w.isprimary) {
			attack.log("+%1 reroll(s) [%0]",attack.name,1);
			return true;
		    }
		    return false;
		}
	    });
	},
        skill: 5,
        points: 36,
        upgrades: [Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE],
    },
    {
        name: "Bounty Hunter",
        unit: "Firespray-31",
        skill: 3,
	pilotid:45,
	done:true,
        faction:Unit.EMPIRE,
        points: 33,
        upgrades: [Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE],
    },
    {
        name: "Ten Numb",
	faction:Unit.REBEL,
        unique: true,
	done:true,
	pilotid:46,
        unit: "B-Wing",
        skill: 8,
	shipimg:"b-wing-1",
	init: function() {
	    var self=this;
	    this.wrap_before("resolveattack",this,function(w,target) {
		target.wrap_after("cancelcritical",self,function(r,org,r2) {
		    if (Unit.FCH_crit(r.ch)>0) {
			if (Unit.FCH_crit(r2.ch)==0) {
			    target.log("cannot cancel 1 %CRIT% [%0]",this.name)
			    return {ch:r2.ch+Unit.FCH_CRIT,e:r2.e+1};
			}
			return r2;
		    } else return r2;
		}.bind(this)).unwrapper("afterdefenseeffect");
	    });
	},
        points: 31,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.TORPEDO,Unit.TORPEDO],
    },
    {
        name: "Ibtisam",
        unique: true,
	done:true,
	faction:Unit.REBEL,
        unit: "B-Wing",
        skill: 6,
	pilotid:47,
        points: 28,
	shipimg:"b-wing-1",
	attackrerolls:function(t) {
	    if (this.stress>0) return 1;
	    return 0;
	},
	init: function() {
	    var m={
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attacker,w,defender) {
		    if (this.stress>0) {
			this.log("+%0 reroll",1);
			return true;
		    }
		    return false;
		}.bind(this)
	    };
	    this.adddicemodifier(Unit.DEFENSE_M,Unit.REROLL_M,Unit.DEFENSE_M,this,m);
	    this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,$.extend({},m));
	},
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.TORPEDO,Unit.TORPEDO],
    },
    {
        name: "Dagger Squadron Pilot",
        unit: "B-Wing",
	done:true,
	wave:["aces",3],
	pilotid:48,
	faction:Unit.REBEL,
        skill: 4,
        points: 24,
        upgrades: [Unit.SYSTEM,Unit.CANNON,Unit.TORPEDO,Unit.TORPEDO]
    },
    {
        name: "Blue Squadron Pilot",
        unit: "B-Wing",
	done:true,
	wave:["aces",3],
	faction:Unit.REBEL,
        skill: 2,
	pilotid:49,
        points: 22,
        upgrades: [Unit.SYSTEM,Unit.CANNON,Unit.TORPEDO,Unit.TORPEDO]
    },
    {
        name: "Rebel Operative",
        unit: "HWK-290",
	done:true,
	faction:Unit.REBEL,
        skill: 2,
	pilotid:50,
        points: 16,
        upgrades: [Unit.TURRET,Unit.CREW]
    },
    {
        name: "Roark Garnet",
        unique: true,
	faction:Unit.REBEL,
        unit: "HWK-290",
        skill: 4,
	pilotid:51,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		var self=this;
		this.selectunit(this.selectnearbyally(3),function(p,k) {
		    p[k].log("has PS of 12");
		    p[k].wrap_after("getskill",self,function(s) {
			return 12;
		    }).unwrapper("endcombatphase");
		},["select unit [%0]",this.name],false);
		return l;
	    });
	},     
	done:true,
        points: 19,
        upgrades: [Unit.TURRET,Unit.CREW]
    },
    {
        name: "Kyle Katarn",
	faction:Unit.REBEL,
        unique: true,
	done:true,
        unit: "HWK-290",
        skill: 6,
	pilotid:52,
        points: 21,
	init: function() {
	    var self=this;
	    this.wrap_after("begincombatphase",this,function(l) {
		if (this.canusefocus()) {
		    this.selectunit(this.selectnearbyally(3),function(p,k) {
			this.removefocustoken();
			p[k].addfocustoken();
			p[k].log("+1 %FOCUS%");
		    },["select unit for free %FOCUS% (or self to cancel)"],true);
		}
		return l;
	    });
	},
        upgrades: [Unit.ELITE,Unit.TURRET,Unit.CREW]
    },
    {
        name: "Jan Ors",
	faction:Unit.REBEL,
        unique: true,
	done:true,
	pilotid:53,
        unit: "HWK-290",
        skill: 8,
	init: function() {
	    var self=this;
	    Unit.prototype.adddicemodifier(Unit.ATTACK_M,Unit.ADD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    return (self.stress==0)&&(!self.dead)&&
			activeunit.isally(self)&(activeunit!=self)
			&&(self.getrange(activeunit)<=3);
		}, 
		f:function(m,n) {
		    var f=self.rollattackdie(1,self,"critical")[0];
		    self.addstress();
		    activeunit.log("+1 attack die [%0]",self.name);
		    if (f=="focus") return {m:m+Unit.FCH_FOCUS,n:n+1};
		    if (f=="hit") return {m:m+Unit.FCH_HIT,n:n+1};
		    if (f=="critical") return {m:m+Unit.FCH_CRIT,n:n+1};
		    return {m:m,n:n+1};
		},str:"hit"});
	},
        points: 25,
        upgrades: [Unit.ELITE,Unit.TURRET,Unit.CREW]
    },
    {
        name: "Scimitar Squadron Pilot",
        done:true,
        unit: "TIE Bomber",
        skill: 2,
	pilotid:54,
        faction:Unit.EMPIRE,
        points: 16,
        upgrades: [Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB],
    },
    {
        name: "Gamma Squadron Pilot",
	done:true,
	pilotid:55,
        unit: "TIE Bomber",
        faction:Unit.EMPIRE,
        skill: 4,
        points: 18,
        upgrades: [Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB]
    },
    {
        name: "Captain Jonus",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:56,
        init: function() {
	    Unit.prototype.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 2; },
		req:function(attacker,w,defender) {
		    // Jonus dead ? 
		    if (attacker!=this&&!this.dead
			&&attacker.getrange(this)==1
			&&attacker.isally(this)
			&&w.isprimary!=true) {
			attacker.log("+%1 reroll(s) [%0]",this.name,2);
			return true;
		    }
		    return false;
		}.bind(this)});
	},
        unique: true,
        unit: "TIE Bomber",
        skill: 6,
        points: 22,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB]
    },
    {
        name: "Major Rhymer",
	done:true,
	pilotid:57,
        faction:Unit.EMPIRE,
        init: function() {
	    for (var i=0; i<this.weapons.length; i++) {
		this.weapons[i].wrap_after("getlowrange",this,function(n) {
		    if (n>1) n= n-1;
		    return n;
		});
		this.weapons[i].wrap_after("gethighrange",this,function(n) {
		    if (n<3) n=n+1;
		    return n;
		});
	    }
	    this.log("extending weapon ranges");
	},
        unique: true,
        unit: "TIE Bomber",
        skill: 7,
        points: 26,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB]
    },
    {
        name: "Captain Kagi",
        faction:Unit.EMPIRE,
        unique: true,
	done:true,
	pilotid:58,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("gettargetableunits",this,function(n,p) {
		if (p.indexOf(self)>-1&&!self.dead) p=[self];
		return p;
	    });
	},
        unit: "Lambda-Class Shuttle",
        skill: 8,
        points: 27,
        upgrades: [Unit.SYSTEM,Unit.CANNON,Unit.CREW,Unit.CREW],
    },
    {
        name: "Colonel Jendon",
        faction:Unit.EMPIRE,
	pilotid:59,
	init: function() {
	    var self=this;
	    this.wrap_after("begincombatphase",this,function(l) {
		if (this.targeting.length>0) {
		    this.selectunit(this.selectnearbyally(1),function(p,k) {
			var t=this.targeting[0];
			p[k].addtarget(t);
			this.removetarget(t);
			p[k].log("+%1 %TARGET% / %0",t.name,1);
		    },["select unit to move %TARGET% (or self to cancel)"],true);
		}
		return l;
	    });
	},       
	done:true,
        unique: true,
        unit: "Lambda-Class Shuttle",
        skill: 6,
        points: 26,
        upgrades: [Unit.SYSTEM,Unit.CANNON,Unit.CREW,Unit.CREW],
    },
    {
        name: "Captain Yorr",
        faction:Unit.EMPIRE,
	pilotid:60,
        unique: true,
	done:true,
        unit: "Lambda-Class Shuttle",
        skill: 4,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("addstress",this,function() {
		var p=this.selectnearbyally(2);
		if (p.indexOf(self)>-1&&self.stress<=2&&!self.dead) {
		    this.log("%STRESS% -> %0 [%0]",self.name);
		    this.removestresstoken();
		    this.showinfo();
		    self.addstress();
		    self.showinfo();
		}
	    });
	},
        points: 24,
        upgrades: [Unit.SYSTEM,Unit.CANNON,Unit.CREW,Unit.CREW]
    },
    {
        name: "Omicron Group Pilot",
        faction:Unit.EMPIRE,
        done:true,
        unit: "Lambda-Class Shuttle",
        skill: 2,
	pilotid:61,
        points: 21,
        upgrades: [Unit.SYSTEM,Unit.CANNON,Unit.CREW,Unit.CREW]
    },
    {
        name: "Lieutenant Lorrir",
        faction:Unit.EMPIRE,
        unique: true,
	done:true,
	pilotid:62,
	wave:["aces"],
        unit: "TIE Interceptor",
        skill: 5,
        points: 23,
	init: function() {
	    this.wrap_after("getrollmatrix",this,function(m,p) {
		for (var i=-20; i<=20; i+=20) {
		    var mm=this.m.clone().translate(0,i).rotate(90,0,0);
		    var mn=this.m.clone().translate(0,i).rotate(-90,0,0);
		    p=p.concat([this.getpathmatrix(mm,"BR1").rotate(-90,0,0),
				this.getpathmatrix(mn,"BR1").rotate(90,0,0),
				this.getpathmatrix(mm,"BL1").rotate(-90,0,0),
				this.getpathmatrix(mn,"BL1").rotate(90,0,0)]);
		}
		return p;
	    });
	    this.wrap_before("endaction",this,function(n,type) {
		if (type=="ROLL") this.addstress();
	    });
	},
        upgrades: [ ]
    },
    {
        name: "Royal Guard Pilot",
        faction:Unit.EMPIRE,
        done:true,
	pilotid:63,
        unit: "TIE Interceptor",
        skill: 6,
        points: 22,
	wave:["aces"],
        upgrades: [Unit.ELITE]
    },
    {
        name: "Tetran Cowall",
        faction:Unit.EMPIRE,
        unique: true,
	done:true,
	pilotid:64,
	wave:["aces"],
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		var found=false;
		var m;
		for (var i in p) if (i.match(/K/)) {found=true; m=p[i]; break; }
		if (found&&!this.hasionizationeffect()) {
		    this.log("select %UTURN% speed");
		    for (var i=1; i<=5; i+=2) {
			if (typeof p["K"+i]=="undefined") {
			    p["K"+i]={move:"K"+i,difficulty:m.difficulty,halfturn:false};
			}
		    }
		} 
	    return p;
	    });
	},
        unit: "TIE Interceptor",
        skill: 7,
        points: 24,
        upgrades: [Unit.ELITE]
    },
    {
        name: "Kir Kanos",
        faction:Unit.EMPIRE,
	pilotid:65,
	wave:["aces"],
	shipimg:"tie-interceptor-1",
        init:  function() {
	    this.wrap_after("modifyattackroll",this,function(m,n,d,mm) {
		if (this.evade>0) mm= mm+Unit.FCH_HIT;
		return mm;
	    });
	    this.adddicemodifier(Unit.ATTACK_M,Unit.ADD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    var r=this.getrange(targetunit);
		    return (r<=3&&r>=2&&this.canuseevade());
		}.bind(this),
		f:function(m,n) {
		    this.removeevadetoken();
		    this.log("+1 %HIT% for attacking at range 2-3");
		    return {m:m+Unit.FCH_HIT,n:n+1};
		}.bind(this),str:"evade"});
	},   
	done:true,
        unique: true,
        unit: "TIE Interceptor",
        skill: 6,
        points: 24,
        upgrades: [ ]
    },
    {
        name: "Carnor Jax",
        faction:Unit.EMPIRE,
	pilotid:66,
	wave:["aces"],
        init: function() {
	    var unit=this;
	    Unit.prototype.wrap_after("canusefocus",this,function(b) {
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("canuseevade",this,function(b) {
		// Am I attacking Carnor Jax?
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("candofocus",this,function(b) {
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("candoevade",this,function(b) {
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b;
	    });
	},
        unique: true,
	done:true,
        unit: "TIE Interceptor",
        skill: 8,
        points: 26,
        upgrades: [Unit.ELITE]
    },
    {
        name: "Bandit Squadron Pilot",
	faction:Unit.REBEL,
	pilotid:67,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 2,
        points: 12,
        upgrades: [Unit.MISSILE]
    },
    {
        name: "Tala Squadron Pilot",
	faction:Unit.REBEL,
	pilotid:68,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 4,
        points: 13,
        upgrades: [Unit.MISSILE]
    },
    {
        name: "Lieutenant Blount",
	faction:Unit.REBEL,
	pilotid:69,
        done:true,
	init: function() {
	    this.wrap_after("hashit",this,function(t,b) {
		if (this.criticalresolved+this.hitresolved==0) 
		    this.log("%0 is hit",targetunit.name);
		return true;
	    });
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 6,
        points: 17,
        upgrades: [Unit.ELITE,Unit.MISSILE]
    },
    {
        name: "Airen Cracken",
	faction:Unit.REBEL,
	pilotid:70,
	done:true,
	init: function() {
	    this.addafterattackeffect(this,function() {
		var p=this.selectnearbyally(1,function(t,s) { return s.candoaction(); });
		if (p.length>0) {
		    var unit=this;
		    this.doselection(function(n) {
			this.log("select unit for a free action"+p.length);
			this.resolveactionselection(p,function(k) {
			    var al=p[k].getactionlist();
			    //log("selected "+p[k].name+" "+al.length);
			    if (al.length>0) {
				p[k].doaction(al,"").done(function() { 
				    //log("endaction");
				    this.select();
				}.bind(this));
				this.endnoaction(n,"");
			    } else { 
				this.select(); this.endnoaction(n,""); }
			}.bind(this));
		    }.bind(this));
		}
	    });
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 8,
        points: 19,
        upgrades: [Unit.ELITE,Unit.MISSILE]
    },
    {
        name: "Delta Squadron Pilot",
        faction:Unit.EMPIRE,
	pilotid:71,
        done:true,
        unit: "TIE Defender",
        skill: 1,
        points: 30,
        upgrades: [Unit.CANNON,Unit.MISSILE]
    },
    {
        name: "Glaive Squadron Pilot",
        faction:Unit.EMPIRE,
        done:true,
	pilotid:72,
        unit: "TIE Defender",
        skill: 6,
        points: 34,
	wave:["aces"],
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.MISSILE],
	shipimg:"tie-defender-red"
    },
    {
        name: "Onyx Squadron Pilot",
        done:true,
        faction:Unit.EMPIRE,
        pilotid:73,
        unit: "TIE Defender",
        skill: 3,
        points: 32,
        upgrades: [Unit.CANNON,Unit.MISSILE]
    },
    {
        name: "Colonel Vessery",
        done:true,
	pilotid:74,
        faction:Unit.EMPIRE,
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
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.MISSILE]
    },
    {
        name: "Rexler Brath",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:75,
	init: function() {
	    this.addafterattackeffect(this,function(c,h) {
		if (this.canusefocus()&&this.hitresolved>0) {
		    this.log("-1 %FOCUS%, %0 damage -> %0 critical(s)",h);
		    this.donoaction([{name:this.name,org:this,type:"FOCUS",action:function(n) {
			var l=targetunit.criticals.length-1;
			this.removefocustoken();
			for (var i=0; i<this.hitresolved; i++) {
			    this.log(targetunit.criticals[l-i-this.criticalresolved].name);
			    targetunit.criticals[l-i-this.criticalresolved].faceup();
			}
			targetunit.checkdead();
			targetunit.show();
			this.endnoaction(n,"");
		    }.bind(this)}],"",true);
		}
	    });
	},
        unique: true,
        unit: "TIE Defender",
        skill: 8,
	wave:["aces"],
        points: 37,
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.MISSILE]
    },
    {
        name: "Knave Squadron Pilot",
	faction:Unit.REBEL,
        done:true,
	pilotid:76,
        unit: "E-Wing",
        skill: 1,
        points: 27,
        upgrades: [Unit.SYSTEM,Unit.TORPEDO,Unit.ASTROMECH],
    },
    {
        name: "Blackmoon Squadron Pilot",
        pilotid:77,
	faction:Unit.REBEL,
        done:true,
        unit: "E-Wing",
        skill: 3,
        points: 29,
        upgrades: [Unit.SYSTEM,Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Etahn A'baht",
	done:true,
	pilotid:78,
	faction:Unit.REBEL,
        init:  function() {
	    var self=this;
	    Unit.prototype.adddicemodifier(Unit.ATTACK_M,Unit.MOD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    return self.isally(activeunit)&&!self.dead&&self.isinfiringarc(targetunit);
		}, 
		aiactivate: function(m,n) { return Unit.FCH_hit(m); },
		f:function(m,n) {
		    if (Unit.FCH_hit(m)>0) {
			this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
			return m+Unit.FCH_CRIT-Unit.FCH_HIT;
		    } 
		    return m;
		},str:"hit"});
	},        
        unique: true,
        unit: "E-Wing",
        skill: 5,
        points: 32,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Corran Horn",
	faction:Unit.REBEL,
	done:true,
	pilotid:79,
	init: function() {
	    this.addattack(function() { return true; },
			   this,this.weapons,
			   function() { 
			       this.log("no attack next round"); 
			       this.noattack=round+1; }.bind(this),
			   null,
			   "endcombatphase");
	},
        unique: true,
        unit: "E-Wing",
        skill: 8,
        points: 35,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Sigma Squadron Pilot",
        faction:Unit.EMPIRE,
	pilotid:80,
        done:true,
        
        unit: "TIE Phantom",
        skill: 3,
        points: 25,
        upgrades: [Unit.SYSTEM,Unit.CREW]
    },
    {
        name: "Shadow Squadron Pilot",
        done:true,
        faction:Unit.EMPIRE,
        pilotid:81,
        unit: "TIE Phantom",
        skill: 5,
        points: 27,
        upgrades: [Unit.SYSTEM,Unit.CREW]
    },
    {
        name: "'Echo'",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:82,
	getdecloakmatrix: function(m) {
	    var i=0;
	    var m0=this.getpathmatrix(m,"BL2");
	    var m1=this.getpathmatrix(m,"BR2");
	    var p=[m,m0,m1];
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
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CREW]
    },
    {
        name: "'Whisper'",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:83,
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
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CREW]
    },
    {
        name: "Wes Janson",
	done:true,
	wave:["epic"],
	pilotid:84,
	init: function() {
	    this.wrap_before("cleanupattack",this,function() {
                if(targetunit !== undefined){
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
                }
	    });
	},
	faction:Unit.REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 29,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Jek Porkins",
	done:true,
	pilotid:85,
	wave:["epic"],
	init: function() {
	    this.wrap_after("addstress",this,function() {
		// Automatic removal of stress
		this.removestresstoken();
		var roll=this.rollattackdie(1,this,"blank")[0];
		this.log("-1 %STRESS%, roll 1 attack dice")
		if (roll=="hit") { this.applydamage(1); this.checkdead(); }
	    });
	},
	faction:Unit.REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 7,
        points: 26,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "'Hobbie' Klivian",
	faction:Unit.REBEL,
	done:true,
	wave:["epic"],
	pilotid:86,
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
        upgrades: [Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Tarn Mison",
	done:true,
	pilotid:87,
	wave:["epic"],
	init:function() {
            this.wrap_after("isattackedby",this,function(w,a) {
		if (this.targeting.length==0||this.getskill()<a.getskill()) { // TODO:Priority to define
		    this.log("+%1 %TARGET% / %0",a.name,1);
		    this.addtarget(a);
		}
	    });
	},
	faction:Unit.REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 3,
        points: 23,
        upgrades: [Unit.TORPEDO,Unit.ASTROMECH]
    },
    {
        name: "Jake Farrell",
       	faction:Unit.REBEL,
	done:true,
	pilotid:88,
	wave:["aces"],
        freemove: function() {
	    var p=[];
	    if (this.candoboost()) 
		p.push(this.newaction(this.resolveboost,"BOOST"));
	    if (this.candoroll())
		p.push(this.newaction(this.resolveroll,"ROLL"));
	    this.doaction(p,"free %BOOST% or %ROLL% action");
	},
	init: function() {
	    this.wrap_before("addfocustoken",this,function() {
		if (this.candoaction()) this.freemove();
	    });
	},
        unique: true,
        unit: "A-Wing",
        skill: 7,
        points: 24,
        upgrades: [Unit.ELITE,Unit.MISSILE]
    },
    {
        name: "Gemmer Sojan",
	done:true,
	pilotid:89,
	wave:["aces"],
	init: function() {
            this.wrap_after("getagility",this,function(a) {
		var r=this.selectnearbyenemy(1);
		if (r.length>0) {
		    a=a+1;
		}
		return a;
	    });
	},
	faction:Unit.REBEL,
        unique: true,
        unit: "A-Wing",
        skill: 5,
        points: 22,
        upgrades: [Unit.MISSILE]
    },
    {
        name: "Keyan Farlander",
	faction:Unit.REBEL,
	done:true,
	pilotid:90,
	wave:["aces"],
	shipimg:"b-wing-1",
	init: function() {
	    this.wrap_after("modifyattackroll",this,function(m,n,d,mm) {
		var f=Unit.FCH_focus(mm);
		if (this.stress>0) mm=mm-Unit.FCH_FOCUS*f+Unit.FCH_HIT*f;
		return mm;
	    });
	    this.adddicemodifier(Unit.ATTACK_M,Unit.MOD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    return this.stress>0; 
		}.bind(this),
		aiactivate: function(m,n) {
		    return true;
		},
		f:function(m,n) {
		    var f=Unit.FCH_focus(m);
		    this.removestresstoken();
		    if (f>0) {
			this.log("%0 %FOCUS% -> %0 %HIT%, -1 %STRESS%",f);
			return m-Unit.FCH_FOCUS*f+Unit.FCH_HIT*f;
		    }
		    return m;
		}.bind(this),str:"stress",noreroll:"focus"
	    });
	},
        unique: true,
        unit: "B-Wing",
        skill: 7,
        points: 29,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.TORPEDO,Unit.TORPEDO]
    },
    {
        name: "Nera Dantels",
	faction:Unit.REBEL,
	done:true,
	pilotid:91,
	wave:["aces"],
	shipimg:"b-wing-1",
	init: function() {
	    this.log("can fire %Unit.TORPEDO% at 360 degrees");
	    this.wrap_after("isTurret",this,function(w,b) {
		if (w.type==Unit.TORPEDO) return true;
		return b;
	    })
	},
        unique: true,
        unit: "B-Wing",
        skill: 5,
        points: 26,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.TORPEDO,Unit.TORPEDO]
    },

    {
        name: "Wild Space Fringer",
        done:true,
	pilotid:92,
	faction:Unit.REBEL,
        unit: "YT-2400",
        skill: 2,
        points: 30,
        upgrades: [Unit.CANNON,Unit.MISSILE,Unit.CREW]
    },
    {
        name: "Eaden Vrill",
	done:true,
	pilotid:93,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (sh.stress>0&&this.weapons[w].isprimary) { 
		    this.log("+1 attack die");
		    a=a+1;
		}
		return a;
	    });
	},       
	faction:Unit.REBEL,       
        unit: "YT-2400",
        unique: true,
        skill: 3,
        points: 32,
        upgrades: [Unit.CANNON,Unit.MISSILE,Unit.CREW]
    },
    {
        name: "'Leebo'",
	faction:Unit.REBEL,
	done:true,
	pilotid:94,
	init: function() {
	    var newdeal=function(c,f,p) {
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.face==Critical.FACEUP) {
			var s1=this.selectdamage();
			Critical.CRITICAL_DECK[s1].count--;
			var s2=this.selectdamage();
			Critical.CRITICAL_DECK[s2].count--;
			var sc=[s1,s2];
			this.log("select one critical");
			this.selectcritical(sc,function(m) {
			    pp.resolve({crit:new Critical(this,m),face:Critical.FACEUP});
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
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.MISSILE,Unit.CREW]
    },
    {
        name: "Dash Rendar",
	faction:Unit.REBEL,
	pilotid:95,
        unit: "YT-2400",
        unique: true,
        skill: 7,
	done:true,
	init: function() {
	    this.wrap_after("hascollidedobstacle",this,function(b) { 
		return false;
	    });
	    this.wrap_after("canmoveonobstacles",this,function() {
		return true;
	    });
	},
        points: 36,
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.MISSILE,Unit.CREW]
    },
    {
        name: "Patrol Leader",
        faction:Unit.EMPIRE,
	done:true,
	pilotid:96,
        unit: "VT-49 Decimator",
        skill: 3,
        points: 40,
        upgrades: [Unit.TORPEDO,Unit.CREW,Unit.CREW,Unit.CREW,Unit.BOMB]
    },
    {
        name: "Captain Oicunn",
        faction:Unit.EMPIRE,
        unit: "VT-49 Decimator",
        skill: 4,
        points: 42,
	pilotid:97,
        unique: true,
	done:true,
	init: function() {
	    this.wrap_before("resolvecollision",this,function() {
		for (var i=0; i<this.touching.length; i++) {
		    var u=this.touching[i];
		    if (u.isenemy(this)) {
			u.log("+1 %HIT% [%0]",this.name);
			u.resolvehit(1);
			u.checkdead();
		    }
		}
	    })
	},
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.CREW,Unit.CREW,Unit.CREW,Unit.BOMB]
    },
    {
        name: "Commander Kenkirk",
        faction:Unit.EMPIRE,
	pilotid:98,
	init: function() {
	    this.wrap_after("getagility",this,function(a) {
		if (this.criticals.length>0) a=a+1;
		return a;
	    });
	},
	done:true,
        unit: "VT-49 Decimator",
        skill: 6,
        points: 44,
        unique: true,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.CREW,Unit.CREW,Unit.CREW,Unit.BOMB]
    },
    {
        name: "Rear Admiral Chiraneau",
	pilotid:99,
        init:  function() {
	    this.wrap_after("modifyattackroll",this,function(m,n,dd,mm) {
		if (Unit.FCH_focus(mm)>0&&this.range<=2) mm=mm-Unit.FCH_FOCUS+Unit.FCH_CRIT;
		return mm;
	    });
	    this.adddicemodifier(Unit.ATTACK_M,Unit.MOD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    return  (this.getrange(targetunit)<=2);
		}.bind(this),
		aiactivate: function(m,n) {
		    return Unit.FCH_focus(m);
		},
		f:function(m,n) {
		    var f=Unit.FCH_focus(m);
		    if (f>0) {
			this.log("1 %FOCUS% -> 1 %CRIT%");
			return m-Unit.FCH_FOCUS+Unit.FCH_CRIT;
		    }
		    return m;
		}.bind(this),str:"hit"});
	},        

        faction:Unit.EMPIRE,
        unit: "VT-49 Decimator",
        skill: 8,
        points: 46,
	done:true,
        unique: true,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.CREW,Unit.CREW,Unit.CREW,Unit.BOMB]
    },
    {
        name: "Prince Xizor",
        faction:Unit.SCUM,
	pilotid:100,
        modifydamageassigned: function(ch,attacker) {
	    var i;
	    if (ch==0) return 0;
	    var p=this.selectnearbyally(1);
	    if (p.length>0) {
		p.sort(function(a,b) { 
		    var hpa=a.hull+a.shield; var hpb=b.hull+b.shield;
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
        upgrades: [Unit.ELITE,Unit.TORPEDO]
    },
    {
        name: "Guri",
        faction:Unit.SCUM,
	pilotid:101,
	modifyattackroll: function(m,n,d) {
	    if (this.getrange(targetunit)==1) m+=Unit.FCH_FOCUS;
	    return m;
	},
	/* TODO : may only do the action */
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		var p=this.selectnearbyenemy(1);
		if (p.length>0) {
		    this.log("+1 %FOCUS%, ennemy at range 1");
		    this.addfocustoken();
		}
		return l;
	    });
	},       
	done:true,
        unique: true,
        unit: "StarViper",
        skill: 5,
        points: 30,
        upgrades: [Unit.ELITE,Unit.TORPEDO]
    },
    {
        name: "Black Sun Vigo",
        faction:Unit.SCUM,
        done:true,
	pilotid:102,
        unit: "StarViper",
        skill: 3,
        points: 27,
        upgrades: [Unit.TORPEDO]
    },
    {
        name: "Black Sun Enforcer",
        faction:Unit.SCUM,
	pilotid:103,
        done:true,
        unit: "StarViper",
        skill: 1,
        points: 25,
        upgrades: [Unit.TORPEDO]
    },
    {
        name: "Serissu",
        faction:Unit.SCUM,
	pilotid:104,
	done:true,
        init: function() {
	    var self=this;
	    Unit.prototype.adddicemodifier(Unit.DEFENSE_M,Unit.REROLL_M,Unit.DEFENSE_M,this,{
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attacker,w,defender) {
		    // Serissu dead ? 
		    if (defender!=this&&!self.dead
			&&!this.dead&&defender.getrange(this)==1
			&&defender.isally(this)) {
			defender.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    });
	},
        unit: "M3-A Interceptor",
        skill: 8,
        points: 20,
        unique: true,
        upgrades: [Unit.ELITE]
    },
    {
        name: "Laetin A'shera",
        faction:Unit.SCUM,
	pilotid:105,
	init: function() {
            this.addafterdefenseeffect(this,function(c,h,t) {
		if (c+h==0) {
		    this.log("0 %HIT%, +1 %EVADE%");
		    this.addevadetoken();
		}
	    })
	},        
	done:true,
        unit: "M3-A Interceptor",
        skill: 6,
        points: 18,
        unique: true,
        upgrades: [ ]
    },
    {
        name: "Tansarii Point Veteran",
        faction:Unit.SCUM,
	pilotid:106,
        done:true,
        unit: "M3-A Interceptor",
        skill: 5,
        points: 17,
        upgrades: [Unit.ELITE]
    },
    {
        name: "Cartel Spacer",
        faction:Unit.SCUM,
	pilotid:107,
        done:true,
        unit: "M3-A Interceptor",
        skill: 2,
        points: 14,
        upgrades: [ ]
    },
    {
        name: "IG-88A",
	faction:Unit.SCUM,
	pilotid:108,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
	init: function(from) {
	    this.addafterattackeffect(this,function(c,h) {
		if ((typeof from=="undefined"||!from.dead)
		    &&targetunit.dead&&(this.shield<this.ship.shield)) {
		    this.addshield(1);
		    this.showstats();
		    this.log("+1 %SHIELD% for a kill");
		}
	    });
	},
	done:true,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.CANNON,Unit.BOMB,Unit.ILLICIT]
    },
    {
        name: "IG-88B",
	faction:Unit.SCUM,
	pilotid:109,
	done:true,
	init: function(from) {
	    var wn=[];
	    this.ig88battack=-1;
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type=="Cannon"&&w.isWeapon()) wn.push(w);
	    }
	    if (wn.length==0) return;
	    var wp=this.weapons.indexOf(wn[0]);
	    for (var i in this.weapons) 
		// TODO: immediateattack unused ?
		//this.weapons[i].immediateattack={pred:function(k) { return k==0; },weapon:function() { return wp;}};
	    this.addattack(function(c,h) { 
		return (c+h==0)&&(this.ig88battack<round)&&(typeof from=="undefined"||!from.dead);
	    },{name:"IG-88B"},wn,function () {
		this.ig88battack=round;
	    },function() { return squadron });
	},
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.CANNON,Unit.BOMB,Unit.ILLICIT]
    },
    {
        name: "IG-88C",
	faction:Unit.SCUM,
	pilotid:110,
	init: function(from) {
            this.wrap_before("resolveboost",this,function() {
		if (typeof from=="undefined"||!from.dead) {
		    this.log("free %EVADE% action [%0]","IG-88C");
		    this.doselection(function(n) { this.addevade(n); }.bind(this));
		}
	    })
	},
        done:true,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.CANNON,Unit.BOMB,Unit.ILLICIT]
    },
    {
        name: "IG-88D",
	faction:Unit.SCUM, 
	pilotid:111,
        init: function(from) {
	    this.wrap_after("getmaneuverlist",this,function(dial) {
		if (typeof dial["SL3"]!="undefined"&&(typeof from=="undefined"||!from.dead)) {
		    this.log("%SLOOPLEFT% or %TURNLEFT% maneuver");
		    dial["TL3"]={move:"TL3",halfturn:true,difficulty:dial["SL3"].difficulty};
		} 
		if (typeof dial["SR3"]!="undefined") {
		    this.log("%SLOOPRIGHT% or %TURNRIGHT% maneuver");
		    dial["TR3"]={move:"TR3",halfturn:true,difficulty:dial["SR3"].difficulty};
		} 
		return dial;
	    })
	},
        unique: true,
	done:true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.CANNON,Unit.CANNON,Unit.BOMB,Unit.ILLICIT],
    },
    {
        name: "N'Dru Suhlak",
        unique: true,
	done:true,
	wave:["6"],
	pilotid:112,
	faction:Unit.SCUM,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		var p=this.selectnearbyally(2);
		if (p.length==0) {
		    if (typeof sh!="undefined") this.log("+1 attack against %0, at range >=3 of friendly ships",sh.name);
		    a=a+1;
		} 
		return a;
	    }.bind(this);
	},
        unit: "Z-95 Headhunter",
        skill: 7,
        points: 17,
        upgrades: [Unit.ELITE,Unit.MISSILE,Unit.ILLICIT],
    },
    {
        name: "Kaa'To Leeachos",
        unique: true,
	pilotid:113,
	faction:Unit.SCUM,
	done:true,
	wave:["6"],
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		var p=this.selectnearbyally(2);
		this.selectunit(p,function(p,k) {
		    if (p[k].evade>0) { 
			p[k].removeevadetoken(); this.addevadetoken(); 
			p[k].log("-1 %EVADE% [%0]",this.name);
			this.log("+1 %EVADE%");
		    } else if (p[k].focus>0) { 
			p[k].removefocustoken(); this.addfocustoken(); 
			p[k].log("-1 %FOCUS% [%0]",this.name);
			this.log("+1 %FOCUS%");
		    }
		},["select %FOCUS%/%EVADE% to take (or self to cancel)"],true);
		return l;
	    });
	},    
        unit: "Z-95 Headhunter",
        skill: 5,
        points: 15,
        upgrades: [Unit.ELITE,Unit.MISSILE,Unit.ILLICIT],
    },
    {
        name: "Black Sun Soldier",
        faction:Unit.SCUM,
	pilotid:114,
        done:true,
	wave:["6"],
        unit: "Z-95 Headhunter",
        skill: 3,
        points: 13,
        upgrades: [Unit.MISSILE,Unit.ILLICIT],
    },
    {
        name: "Binayre Pirate",
	faction:Unit.SCUM,
	pilotid:115,
        done:true, 
	wave:["6"],
        unit: "Z-95 Headhunter",
        skill: 1,
        points: 12,
        upgrades: [Unit.MISSILE,Unit.ILLICIT],
    },
    {
        name: "Boba Fett",
	faction:Unit.SCUM,
	pilotid:116,
	wave:["6"],
        unit: "Firespray-31",
        skill: 8,
        points: 39,
	modifyattackroll:function(n,a,d) {
	    if (this.getrange(targetunit)==1) n=n+1;
	    return n;
	},
	init: function() {
	    var nrerolls=function() {
		var n=0;
		for (var i in squadron) {
		    var s=squadron[i];
		    if (this.getrange(s)==1&&this.isenemy(s)) n++;
		}
		return n;
	    }.bind(this);
	    var m={
		dice:["blank","focus"], 
		n: nrerolls, 
		req:function(attacker,w,defender) { return true; }
	    };
	    this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,m);
	    this.adddicemodifier(Unit.DEFENSE_M,Unit.REROLL_M,Unit.DEFENSE_M,this,$.extend({},m));
	},
	done:true,
        unique: true,
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE,Unit.ILLICIT]
    },
    {
        name: "Kath Scarlet",
	done:true,
	wave:["6"],
	pilotid:117,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (this.weapons[w].getauxiliarysector(sh)<4) { 
		    this.log("+1 attack die against %0 in auxiliary arc",sh.name);
		    a=a+1;
		}
		return a;
	    });
	},
        unique: true,
	faction:Unit.SCUM,      
        unit: "Firespray-31",
        skill: 7,
        points: 38,
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE,Unit.ILLICIT]
    },
    {
        name: "Emon Azzameen",
	done:true,
	unique:true,
	wave:["6"],
	pilotid:118,
	getbomblocation:function() {  return ["F1","TL3","TR3","F3"]; },
	faction:Unit.SCUM,
        unit: "Firespray-31",
        skill: 6,
        points: 36,
        upgrades: [Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE,Unit.ILLICIT],
    },
    {
        name: "Mandalorian Mercenary",
	faction:Unit.SCUM,  
	pilotid:119,
        done:true,
        unit: "Firespray-31",
        skill: 5,
        points: 35,
	wave:["6"],
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.BOMB,Unit.CREW,Unit.MISSILE,Unit.ILLICIT],
    },
    {
        name: "Kavil",
        unique: true,
	done:true,
	wave:["6"],
	pilotid:120,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (!this.isinprimaryfiringarc(sh)) { /* firing arc = primary sector... */
		    this.log("+1 attack die against %0 outside firing arc",sh.name);
		    a=a+1;
		}
		return a;
	    });
	},       
	faction:Unit.SCUM,     
        unit: "Y-Wing",
        skill: 7,
        points: 24,
        upgrades: [Unit.ELITE,Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.SALVAGED],
    },
    {
        name: "Drea Renthal",
        unique: true,
	pilotid:121,
	faction:Unit.SCUM,
        unit: "Y-Wing",
        skill: 5,
	done:true,
	wave:["6"],
	init: function() {
	    this.wrap_before("removetarget",this,function(t) {
		this.selectunit(this.gettargetableunits(3),function(p,k) {
		    if (this.targeting.indexOf(p[k])==-1) { 
			this.addtarget(p[k]);
			this.addstress();
		    }
		}, ["select unit to target, +1 %STRESS% (or self to cancel)"],true);
	    });
	},
        points: 22,
        upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.SALVAGED],
    },
    {
        name: "Hired Gun",
	faction:Unit.SCUM,
	pilotid:122,
	done:true,
        unit: "Y-Wing",
        skill: 4,
        points: 20,
	wave:["6"],
        upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.SALVAGED],
    },
    {
        name: "Syndicate Thug",
	faction:Unit.SCUM,
	pilotid:123,
	done:true,
	wave:["6"],
        unit: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.SALVAGED],
    },
    {
        name: "Dace Bonearm",
        unique: true,
	pilotid:124,
	faction:Unit.SCUM,
        unit: "HWK-290",
	done:true,
	wave:["6"],
	init: function() {
	    var unit=this;
	    Unit.prototype.wrap_after("addiontoken",this,function() {
		if (!unit.dead&&this.getrange(unit)<=3 &&unit.isenemy(this)&&unit.stress==0) {
		    unit.addstress();
		    this.resolvehit(1);
		    unit.log("+1 %STRESS%");
		    this.log("+%1 %HIT% [%0]",unit.name,1);
		    this.checkdead();
		}
	    });
	},
        skill: 7,
        points: 23,
        upgrades: [Unit.ELITE,Unit.TURRET,Unit.CREW,Unit.ILLICIT],
    },
    {
        name: "Palob Godalhi",
        unique: true,
	pilotid:125,
	wave:["6"],
	faction:Unit.SCUM,
        unit: "HWK-290",
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		this.selectunit(this.selectnearbyenemy(2),function(p,k) {
		    if (p[k].evade>0) { 
			p[k].removeevadetoken(); this.addevadetoken(); 
			p[k].log("-1 %EVADE% [%0]",this.name);
			this.log("+1 %EVADE%");
		    } else if (p[k].focus>0) { 
			p[k].removefocustoken(); this.addfocustoken(); 
			p[k].log("-1 %FOCUS% [%0]",this.name);
			this.log("+1 %FOCUS%");
		    }
		}, ["select %FOCUS%/%EVADE% to take (or self to cancel)"],true);
		return l;
	    });
	},    
	done:true,
        skill: 5,
        points: 20,
        upgrades: [Unit.ELITE,Unit.TURRET,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Torkil Mux",
        unique: true,
	pilotid:126,
	done:true,
	wave:["6"],
	init: function() {
            this.wrap_after("endactivationphase",this,function() {
		this.selectunit(this.selectnearbyenemy(2),function(p,k) {
		    p[k].wrap_after("getskill",this,function(s) {
			return 0;
		    }).unwrapper("endcombatphase");
		},["select unit for a 0 PS"],false);
	    });
	},  
	faction:Unit.SCUM,
        unit: "HWK-290",
        skill: 3,
        points: 19,
        upgrades: [Unit.TURRET,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Spice Runner",
	faction:Unit.SCUM,
	pilotid:127,
	done:true,
        unit: "HWK-290",
        skill: 1,
        points: 16,
	wave:["6"],
        upgrades: [Unit.TURRET,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Commander Alozen",
        faction:Unit.EMPIRE,
	pilotid:128,
        unit: "TIE Advanced",
        unique: true,
	done:true,
        skill: 5,
	wave:["epic"],
        points: 25,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		this.selectunit(this.gettargetableunits(1),function(p,k) {
		    this.addtarget(p[k]);
		    this.log("+%1 %TARGET% / %0",p[k].name,1);
		},["select unit to lock (or self to cancel)"],true);
		return l;
	    });
	},
        upgrades: [Unit.ELITE,Unit.MISSILE]
    },
    {
        name: "Juno Eclipse",
        unique: true,
	pilotid:129,
	done:true,
        faction:Unit.EMPIRE,
	unit: "TIE Advanced",
        skill: 8,
	wave:["epic"],
        points: 28,
	init: function() {
	    var cmp=function(a,b) {
		if (a=="GREEN") return true;
		if (a=="WHITE") {
		    if (b=="GREEN") return false;
		    return true;
		}
		return false;
	    }
	    this.wrap_after("getmaneuverlist",this,function(p) {
		if (this.hasionizationeffect()) return p;
		var q={},i,pp=[];
		for (i in p) {
		    var m=p[i];
		    var speed = parseInt(m.move.substr(-1),10);
		    for (var j=-1; j<=1; j++) {
			var r=m.move.replace(/\d/,(speed+j)+"");
			if (typeof P[r]!="undefined") {
			    if (typeof q[r]=="undefined"||cmp(m.difficulty,q[r].difficulty)) 
				q[r]={move:r,difficulty:m.difficulty,halfturn:m.halfturn};			
			}
		    }
		}
		for (i in q) pp.push(q[i]);
		return pp;
	    });
	},
        upgrades: [Unit.ELITE,Unit.MISSILE]
    },
    {
        name: "Zertik Strom",
        unique: true,
	pilotid:130,
	done:true,
        faction:Unit.EMPIRE,
	unit: "TIE Advanced",
        skill: 6,
	wave:["epic"],
	init: function() {
	    var self=this;
	    Weapon.prototype.wrap_after("getrangeattackbonus",this,function(sh,g) {
		if (this.unit.isenemy(self)&&self.getrange(this.unit)==1) {
		    this.unit.log("0 attack range bonus [%0]",self.name);
		    g=0;
		}
		return g;
	    });
	},
        points: 26,
        upgrades: [Unit.ELITE,Unit.MISSILE]
    },
    {
        name: "Lieutenant Colzet",
        unique: true,
	pilotid:131,
        faction:Unit.EMPIRE,
	unit: "TIE Advanced",
        skill: 3,
        points: 23,
        upgrades: [Unit.MISSILE],
	done:true,
	wave:["epic"],
	init: function() {
	    this.wrap_before("endphase",this,function() {
		this.selectunit(this.targeting,function(p,k) {
		    if (this.canusetarget(p[k])) {
			var c=p[k].criticals;
			this.removetarget(p[k]);
			if (c.length>0) c[rand(c.length)].faceup();
		    }
		},["select unit (or self to cancel)"],true);
	    });
	}
    },
    {
        name: "Bossk",
        faction: Unit.SCUM,
	pilotid:132,
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
        upgrades: [Unit.ELITE,Unit.CANNON,Unit.MISSILE,Unit.CREW,Unit.CREW,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Moralo Eval",
        faction: Unit.SCUM,
	pilotid:133,
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
        upgrades: [Unit.CANNON,Unit.MISSILE,Unit.CREW,Unit.CREW,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Latts Razzi",
        faction: Unit.SCUM,
	pilotid:134,
        unit: "YV-666",
        unique: true,
        skill: 5,
        points: 33,
	done:true,
	init: function() {
	    var self=this;
	    /* TODO: twice */
	    Unit.prototype.wrap_after("declareattack",this,function(wp,t,b) {
		if (!b) return b;
		if (!self.dead&&self.isally(this)&&self.canusetarget(t))
		    self.donoaction([this.newaction(function(n) {
			this.removetarget(t);
			t.wrap_after("getdefensestrength",self,function(i,sh,d) {
			    return (d>0)?d-1:d;
			}).unwrapper("afterdefenseeffect");
			this.endnoaction(n,"TARGET");
		    }.bind(self),"TARGET")],self.name+": -1 agility for "+t.name,true);
		return b;
	    });
	},
        upgrades: [Unit.CANNON,Unit.MISSILE,Unit.CREW,Unit.CREW,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Trandoshan Slaver",
        faction: Unit.SCUM,
	pilotid:135,
        unit: "YV-666",
	done:true,
        skill: 2,
        points: 29,
        upgrades: [Unit.CANNON,Unit.MISSILE,Unit.CREW,Unit.CREW,Unit.CREW,Unit.ILLICIT]
    },
    {
        name: "Talonbane Cobra",
        unique: true,
        faction: Unit.SCUM,
	pilotid:136,
        unit: "Kihraxz Fighter",
        skill: 9,
        upgrades: [Unit.ELITE,Unit.MISSILE,Unit.ILLICIT],
	done:true,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(i,sh,a) {
		return a+this.weapons[i].getrangeattackbonus(sh);
	    });
	    this.wrap_after("getdefensestrength",this,function(i,sh,a) {
		return a+sh.weapons[i].getrangedefensebonus(this);
	    });
	},
        points: 28
    },
    {
        name: "Graz the Hunter",
        unique: true,
	pilotid:137,
        faction: Unit.SCUM,
        unit: "Kihraxz Fighter",
        skill: 6,
        upgrades: [Unit.MISSILE,Unit.ILLICIT],
	init: function() {
	    this.wrap_after("getdefensestrength",this,function(i,sh,a) {
		if (this.weapons[i].getsector(sh)<=3) {
		    a=a+1;
		    this.log("+1 defense die for defending in firing arc");
		}
		return a;
	    });
	},
	done:true,
        points: 25
    },
    {
        name: "Black Sun Ace",
        faction: Unit.SCUM,
	pilotid:138,
        unit: "Kihraxz Fighter",
	done:true,
            skill: 5,
            upgrades: [Unit.ELITE,Unit.MISSILE,Unit.ILLICIT],
            points: 23
        },
        {
            name: "Cartel Marauder",
	    done:true,
	    pilotid:139,
            faction: Unit.SCUM,
            unit: "Kihraxz Fighter",
            skill: 2,
            upgrades: [Unit.MISSILE,Unit.ILLICIT],
            points: 20
        },
        {
            name: "Miranda Doni",
            unique: true,
	    pilotid:140,
	    done:true,
            faction: Unit.REBEL,
            unit: "K-Wing",
            skill: 8,
            upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB],
	    mirandaturn:-1,
	    preattackroll: function(w,t) {
		if (this.mirandaturn!=round) {
		    var a1={org:this,name:this.name,type:"SHIELD",action:function(n) {
			this.mirandaturn=round;
			this.log("-1 attack die");
			this.wrap_after("getattackstrength",this,function(i,sh,a){
			    var ra= this.weapons[i].getrangeattackbonus(sh);
			    if (a-ra>0) a=a-1;			    
			    return a;
			}).unwrapper("attackroll");
			if (this.shield<this.ship.shield) {
			    this.addshield(1); 
			    this.log("+1 %SHIELD%");
			}
			this.endnoaction(n,"SHIELD");
		    }.bind(this)};
		    var a2={org:this,name:this.name,type:"HIT",action:function(n) {
			this.log("-1 %SHIELD%");
			this.log("+1 attack die");
			this.mirandaturn=round;
			this.wrap_after("getattackstrength",this,function(i,sh,a){
			    return 1+a;
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
	    pilotid:141,
            faction: Unit.REBEL,
            unit: "K-Wing",
            skill: 6,
            upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB],
            points: 28,
	    done:true,
	    init: function() {
		var self=this;
		Unit.prototype.wrap_before("beginattack",this,function() {
		    if (!self.dead&&this!=self&&this.isally(self)) {
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
            faction: Unit.REBEL,
	    pilotid:142,
	    done:true,
            unit: "K-Wing",
            skill: 4,
            upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB],
            points: 25
        },
        {
            name: "Warden Squadron Pilot",
            faction: Unit.REBEL,
	    pilotid:143,
	    done:true,
            unit: "K-Wing",
            skill: 2,
            upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB],
            points: 23
        },
        {
            name: "'Redline'",
            unique: true,
	    pilotid:144,
            faction: Unit.EMPIRE,
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
		var p=this.targeting;
		if (this.targeting.indexOf(sh)>-1) return true;
		for (var i=p.length-2;i>=0; i++) this.removetarget(p[i]);
		return false;
	    },
            upgrades: [Unit.SYSTEM,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB,Unit.BOMB],
            points: 27
        },
        {
            name: "'Deathrain'",
            unique: true,
	    pilotid:145,
            faction: Unit.EMPIRE,
            unit: "TIE Punisher",
            skill: 6,
	    done:true,
	    init: function() {
		this.wrap_after("getbombposition",this,function(lm,size,p) {
		    this.log("positions:"+p.length);
		    for (var i=0; i<lm.length; i++) {
			p.push(this.getpathmatrix(this.m.clone().translate(0,20-size),lm[i]));
		    }
		    return p;
		});
		this.wrap_after("bombdropped",this,function() {
		    if (this.candoroll()&&this.candoaction()) {
			$("#activationdial").hide();
			this.doaction([this.newaction(this.resolveroll,"ROLL")],"free %ROLL% action");
		    }
		});
	    },
            upgrades: [Unit.SYSTEM,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB,Unit.BOMB],
            points: 26
        },
        {
            name: "Black Eight Squadron Pilot",
            faction: Unit.EMPIRE,
	    pilotid:146,
	    done:true,
            unit: "TIE Punisher",
            skill: 4,
            upgrades: [Unit.SYSTEM,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB,Unit.BOMB],
            points: 23
        },
        {
            name: "Cutlass Squadron Pilot",
            faction: Unit.EMPIRE,
	    done:true,
	    pilotid:147,
            unit: "TIE Punisher",
            skill: 2,
            upgrades: [Unit.SYSTEM,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB,Unit.BOMB],
            points: 21
        },
        {
            name: "Poe Dameron",
            faction: Unit.REBEL,
	    pilotid:148,
            unit: "T-70 X-Wing",
	    unique:true,
	    done:true,
	    ambiguous:true,
            skill: 8,
            upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
	    init: poe_fct,
            points: 31
        },
      {
	  name: "'Blue Ace'",
	  faction: Unit.REBEL,
	  done:true,
	  pilotid:149,
	  unit: "T-70 X-Wing",
	  skill: 5,
	  unique:true,
	  getboostmatrix:function(m) {
	      return [this.getpathmatrix(m,"TR1"),
		this.getpathmatrix(m,"TL1")]
	      .concat(Unit.prototype.getboostmatrix.call(this,m));
	  },
	  upgrades: [Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
	  points: 27
      },
      {
	  name: "Ello Asty",
	  faction: Unit.REBEL,
	  done:true,
	  pilotid:150,
	  beta:true,
	  unit: "T-70 X-Wing",
	  skill: 7,
	  unique:true,
	  init: function() {
	      var save=[];
	      this.wrap_after("getdial",this,function(gd) {
		  if (save.length==0)
		      for (var i=0; i<gd.length; i++) {
			  var move=gd[i].move;
			  var d=gd[i].difficulty;
			  if (move.match(/TR[RL]\d/)) d="WHITE";
			  save[i]={move:move,difficulty:d};
		      }
		  if (this.stress==0) return save; else return gd;
	      });
	  },
	  upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
	  points: 30
      },
      {
	  name: "'Red Ace'",
	  faction: Unit.REBEL,
	  done:true,
	  pilotid:151,
	  beta:true,
	  unit: "T-70 X-Wing",
	  skill: 6,
	  unique:true,
	  init: function() { 
	      this.sr=-1;
	      this.wrap_after("removeshield",this,function(n) {
		  if (this.sr<round) {
		      this.log("+1 %SHIELD%");
		      this.sr=round; 
		      this.addevadetoken();
		  }
	      });
	  },
	  upgrades: [Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
	  points: 29
      },
      {
	  name: "Blue Squadron Novice",
	  faction: Unit.REBEL,
	  done:true,
	  unit: "T-70 X-Wing",
	  wave:["aces",8],
	  skill: 2,
	  pilotid:152,
	  upgrades: [Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
	  points: 24
      },
     {
	  name: "Red Squadron Veteran",
	  faction: Unit.REBEL,
	 pilotid:153,
	  done:true,
	  unit: "T-70 X-Wing",
	 wave:["aces",8],
	  skill: 4,
	 upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
	  points: 26
      },
    {
	name: "Omega Squadron Pilot",
	faction: Unit.EMPIRE,
	done:true,
	pilotid:154,
	unit: "TIE/FO Fighter",
	skill: 4,
	upgrades: [Unit.TECH,Unit.ELITE],
	points: 17
      },
    {
	name: "Zeta Squadron Pilot",
	faction: Unit.EMPIRE,
	done:true,
	pilotid:155,
	unit: "TIE/FO Fighter",
	skill: 3,
	upgrades: [Unit.TECH],
	points: 16
      },
   {
	  name: "Epsilon Squadron Pilot",
	  faction: Unit.EMPIRE,
	  done:true,
       pilotid:156,
	  unit: "TIE/FO Fighter",
	  skill: 1,
       upgrades: [Unit.TECH],
	  points: 15
      },
   {
	  name: "'Zeta Ace'",
	  faction: Unit.EMPIRE,
	  done:true,
       pilotid:157,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 5,
	  getrollmatrix:function(m) {
	var m0=this.getpathmatrix(m.clone().rotate(90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(m.clone().rotate(-90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	return [m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20),
		m1.clone().translate(0,-20),
		m1,
		m1.clone().translate(0,20)]
	.concat(Unit.prototype.getrollmatrix.call(this,m));
    },
       upgrades: [Unit.ELITE,Unit.TECH],
	  points: 18
      },
   {
       name: "'Epsilon Leader'",
       faction: Unit.EMPIRE,
       done:true,
       pilotid:158,
       unique:true,
       unit: "TIE/FO Fighter",
       skill: 6,
       init: function() {
	   this.wrap_after("begincombatphase",this,function(l) {
	       var p=this.selectnearbyally(1);
	       p.push(this);
	       for (var i=0; i<p.length; i++) p[i].removestresstoken();
	       return l;
	   });
       },
       upgrades: [Unit.TECH],
       points: 19
   },
   {
       name:"'Epsilon Ace'",
       faction:Unit.EMPIRE,
       done:true,
       pilotid:159,
       unique:true,
       unit:"TIE/FO Fighter",
       skill:4,
       init: function() {
	   this.wrap_after("getskill",this,function(s) {
	       if (this.criticals.length==0) return 12;
	       return s;
	   });
       },
       upgrades:[Unit.TECH],
       points:17
   },
   {
	  name: "'Omega Ace'",
	  faction: Unit.EMPIRE,
	  done:true,
       pilotid:160,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 7,
	  init: function() {
	      this.wrap_after("modifyattackroll",this,function(m,n,d,mm) {
		  if (this.focus>0&&this.targeting.length>0) mm=n*Unit.FCH_CRIT;
		  return mm;
	      });
	      this.adddicemodifier(Unit.ATTACK_M,Unit.MOD_M,Unit.ATTACK_M,this,{
		  req:function(m,n) { 
		      return this.canusefocus()&&this.targeting.indexOf(targetunit)>-1;
		  }.bind(this),
		  f:function(m,n) {
		      this.removefocustoken();
		      this.removetarget(targetunit);
		      this.log("all results are %CRIT%");
		      return n*Unit.FCH_CRIT;
		  }.bind(this),str:"critical"});
       },
       upgrades: [Unit.ELITE,Unit.TECH],
	  points: 20
      },
   {
       name: "'Omega Leader'",
       faction: Unit.EMPIRE,
       beta:true,
       pilotid:161,
       unique:true,
       unit: "TIE/FO Fighter",
       skill: 8,
       upgrades: [Unit.ELITE,Unit.TECH],
       points: 21,
       done:true,
       init: function() {
	   var self=this;
	    this.wrap_after("isattackedby",this,function(w,a) {
		if (self.targeting.indexOf(a)>-1) 
		    a.wrap_after("getdicemodifiers",self,function(mods) {
			var p=[];
			for (var i=0; i<mods.length; i++)
			    if (mods[i].from!=Unit.ATTACK_M) p.push(mods[i]);
			return mods;
		    }).unwrapper("endattack");
	    });
	    this.wrap_before("resolveattack",this,function(w,t) {
		if (this.targeting.indexOf(t)>-1) 
		    t.wrap_after("getdicemodifiers",this,function(mods) {
			var p=[];
			for (var i=0; i<mods.length; i++)
			    if (mods[i].from!=Unit.DEFENSE_M) p.push(mods[i]);
			
			return mods;
		    }).unwrapper("endbeingattacked");
	    });
	   this.wrap_after("setpriority",this,function(a) {
	       if (a.type=="TARGET"&&this.candotarget()&&this.targeting.length==0) 
		   a.priority+=10;
	   });
       }
   },
    {
	name:"Hera Syndulla",
	unique:true,
	faction:Unit.REBEL,
	unit:"VCX-100",
	skill:7,
	pilotid:162,
	ambiguous:true,
	edition:"VCX-100",
	points:40,
	done:true,
	upgrades:[Unit.SYSTEM,Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.CREW,Unit.CREW],
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		return hera_fct.call(this,p); 
	    });
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type==Unit.TORPEDO) {
		    w.auxiliary=AUXILIARY,
		    w.subauxiliary=SUBAUXILIARY
		};
	    }
	}
   },
    {
	name:"'Chopper'",
	unique:true,
	pilotid:163,
	faction:Unit.REBEL,
	unit:"VCX-100",
	skill:4,
	points:37,
	done:true,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		for (var i=0; i<this.touching.length; i++) {
		    if (this.touching[i].isenemy(this.team)) {
			this.touching[i].addstress();
			this.touching[i].log("+1 %STRESS% [%0]",this.name);
		    }
		}
		return l;
	    });
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type==Unit.TORPEDO) {
		    w.auxiliary=AUXILIARY,
		    w.subauxiliary=SUBAUXILIARY
		}
	    }
	},
	upgrades:[Unit.SYSTEM,Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.CREW,Unit.CREW]
    },
    {
	name:"Ezra Bridger",
	faction:Unit.REBEL,
	unique:true,
	done:true,
	pilotid:164,
	ambiguous:true,
	edition:"Attack Shuttle",
        unit:"Attack Shuttle",
	skill:4,
	points:20,
	init: ezra_fct,        
	upgrades:[Unit.ELITE,Unit.TURRET,Unit.CREW]
    },
    {
	name:"Hera Syndulla",
	faction:Unit.REBEL,
	unique:true,
	done:true,
	pilotid:165,
	unit:"Attack Shuttle",
	skill:7,
	ambiguous:true,
	edition:"Attack Shuttle",
	points:22,
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		return hera_fct.call(this,p); 
	    });
	},
	upgrades:[Unit.ELITE,Unit.TURRET,Unit.CREW]
    },
    {
	name:"Sabine Wren",
	faction:Unit.REBEL,
	unique:true,
	done:true,
	pilotid:166,
	unit:"Attack Shuttle",
	skill:5,
	points:21,
	ambiguous:true,
	edition:"Attack Shuttle",
	init: function() {
	    this.wrap_after("beginactivation",this,sabine_fct);
	},
	upgrades:[Unit.ELITE,Unit.TURRET,Unit.CREW]
    },
    {
	name:"'Zeb' Orrelios",
	faction:Unit.REBEL,
	unique:true,
	ambiguous:true,
	edition:"Attack Shuttle",
	unit:"Attack Shuttle",
	skill:3,
	pilotid:167,
	points:18,
	done:true,
	cancelhit:zeb_fct,
	upgrades:[Unit.TURRET,Unit.CREW]
    },
    {
	name:"Kanan Jarrus",
	faction:Unit.REBEL,
	unique:true,
	pilotid:168,
	unit:"VCX-100",
	skill:5,
	points:38,
	upgrades:[Unit.SYSTEM,Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.CREW,Unit.CREW],
	done:true,
	init:function() {
	    var self=this;
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type==Unit.TORPEDO) {
		    w.auxiliary=AUXILIARY,
		    w.subauxiliary=SUBAUXILIARY
		}
	    }
	    Unit.prototype.wrap_after("preattackroll",this,function(w,t) {
		var p=this.selectnearbyenemy(2);
		var attacker=this;
		if (self.canusefocus()&&p.indexOf(self)>-1&&!self.dead) { 
		    self.donoaction([{org:self,name:self.name,type:"FOCUS",action:function(n) {
			this.wrap_after("getattackstrength",self,function(i,t,a) {
			    NOLOG=true;
			    var ra= this.weapons[i].getrangeattackbonus(t);
			    a=a-ra;
			    NOLOG=false;
			    if (a>0) a=a-1;			    
			    return a+ra;
			}).unwrapper("attackroll");
			self.removefocustoken();
			this.log("-1 attack against %0",self.name);
			this.select();
			self.endnoaction(n,"FOCUS");
		    }.bind(this)}],"",true);
		}
	    });
	}
    },
    {
	name:"'Wampa'",
	faction:Unit.EMPIRE,
	unique:true,
	pilotid:169,
	unit:"TIE Fighter",
	wave:["epic"],
	skill:4,
	points:14,
	done:true,
	init: function() {
	    this.adddicemodifier(Unit.ATTACKCOMPARE_M,Unit.ADD_M,Unit.ATTACK_M,this,{
		req:function(m,n) { return n>0; },
		f:function(m,n) { // AI section needs to save original values
                    if(activeunit.ia){
                        var om = m;
                        var on = n;
                        if (Unit.FCH_crit(m)>0) {
                            this.log("cancel all dice");
                            targetunit.log("+1 damage card [%0]",this.name);
                            targetunit.applydamage(1);
                            return {m:0,n:0};
                        }
                        else return {m:om,n:on};
                    }
                    else{
                        this.log("cancel all dice");
                        if (Unit.FCH_crit(m)>0) {
                            targetunit.log("+1 damage card [%0]",this.name);
                            targetunit.applydamage(1);
                        }
                        return {m:0,n:0};
                    }
		}.bind(this),str:"critical"});
	},
	upgrades:[]
    },
    { 
	name:"'Youngster'",
	faction:Unit.EMPIRE,
	unique:true,
	pilotid:170,
	unit:"TIE Fighter",
	skill:6,
	wave:["epic"],
	points:15,
	done:true,
	init: function() {
	    var elite=null;
	    var self=this;
	    for (var i=0; i<this.upgrades.length; i++) {
		if (this.upgrades[i].type==Unit.ELITE&&(typeof this.upgrades[i].action=="function")){ 
		    elite=$.extend({}, this.upgrades[i]);
		    elite.clone=true;
		    elite.isactive=true;
		}
	    }
	    if (elite==null) return;
	    this.log("share %0 upgrade",elite.name);
	    Unit.prototype.wrap_after("getupgactionlist",self,function(l) {
		var p=this.selectnearbyally(3);
		if (!self.dead&&this.ship.name.match(/.*TIE.*Fighter.*/)&&p.indexOf(self)>-1&&elite.candoaction()&&elite.isactive) {
		    this.log("elite action from %0 available",self.name);
		    elite.unit=this;
		    l.push({org:elite,action:elite.action,type:elite.type.toUpperCase(),name:elite.name});
		}
		return l;
	    });
	},
	upgrades:[Unit.ELITE]
    },
    {
	name:"'Chaser'",
	faction:Unit.EMPIRE,
	unique:true,
	pilotid:171,
	done:true,
	unit:"TIE Fighter",
	skill:3,
	wave:["epic"],
	points:14,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("removefocustoken",this,function() {
		if (!self.dead&&this.isally(self)&&this!=self&&this.getrange(self)<=1) {
		    self.log("+1 %FOCUS%");
		    self.addfocustoken();
		}
	    });
	},
	upgrades:[]
    },
    {
	name:"Gamma Squadron Veteran",
	faction:Unit.EMPIRE,
	pilotid:172,
	done:true,
	unit:"TIE Bomber",
	skill:5,
	wave:["aces"],
	points:19,
	upgrades:[Unit.ELITE,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB]
    },
    {
	name:"The Inquisitor",
	faction:Unit.EMPIRE,
	pilotid:173,
	unit:"TIE Adv. Prototype",
	skill:8,
	unique:true,
	done:true,
	points:25,
	init: function() {
	    var self=this;
	    //0 is primary
	    this.weapons[0].wrap_after("getrangedefensebonus",this,function(sh,b) {
		if (b==1) this.unit.log("defense range nullified");
		return 0;
	    });
	    this.wrap_after("getattackstrength",this,function(i,sh,a) {
		if (i==0) {
		    if (this.weapons[0].getrange(sh)>1) {
			this.log("+1 attack die with primary weapon [%0]",this.name);
			a=a+1;
		    }
		} 
		return a;
	    });
	},
	upgrades:[Unit.ELITE,Unit.MISSILE]
    },
    {
	name:"Valen Rudor",
	faction:Unit.EMPIRE,
	unique:true,
	pilotid:174,
	unit:"TIE Adv. Prototype",
	skill:6,
	points:22,
	done:true,
	init: function() {
	    this.addafterdefenseeffect(this,function(c,h,t) {
		if (this.candoaction()) {
		    this.log("+1 free action [%0]",this.name);
		    this.doaction(this.getactionlist(),"");
		}
	    });
	},
	upgrades:[Unit.ELITE,Unit.MISSILE]
    },
   {
       name:"Sienar Test Pilot",
       faction:Unit.EMPIRE,
       pilotid:175,
       done:true,
       unit:"TIE Adv. Prototype",
       skill:2,
       points:16,
       upgrades:[Unit.MISSILE]
    },
   {
       name:"Zuckuss",
       faction:Unit.SCUM,
       pilotid:176,
       unique:true,
       unit:"G-1A Starfighter",
       skill:7,
       points:28,
       done:true,
       upgrades:[Unit.ELITE,Unit.CREW,Unit.SYSTEM,Unit.ILLICIT],
       init: function() {
	   this.wrap_after("modifyattackdefense",this,function(a,d,w,t,ad) {
	       ad.a=ad.a+1;
	       ad.d=ad.d+1;
	       return ad;
	   });
       },
       preattackroll: function(w,t) {
	   var a1={org:this,name:this.name,type:"HIT",action:function(n) {
	       this.log("+1 attack die");
	       this.wrap_after("getattackstrength",this,function(i,sh,a){
		   return 1+a;
	       }).unwrapper("attackroll");
	       targetunit.wrap_after("getdefensestrength",this,function(i,sh,d) {
		   return 1+d;
	       }).unwrapper("defenseroll");
	       this.endnoaction(n,"HIT");
	   }.bind(this)};
	   this.donoaction([a1],"select to add +1 attack roll",true);
       }
    },
   {
       name:"4-LOM",
       faction:Unit.SCUM,
       pilotid:177,
       unique:true,
       done:true,
       unit:"G-1A Starfighter",
       skill:6,
       points:27,
       init: function() {
	   this.wrap_before("endphase",this,function() {
	       var p=this.selectnearbyunits(1,function() {return true;});
	       if (this.stress>0)
		   this.selectunit(p,function(p,k) {
		       p[k].addstress();
		       this.removestresstoken();
		       p[k].log("+1 %STRESS% [%0]",this.name);
		       this.log("-1 %STRESS%");		   
		   },["select unit (or self to cancel)"],true);
	   });
       },
       upgrades:[Unit.ELITE,Unit.CREW,Unit.SYSTEM,Unit.ILLICIT]
    },
    {
        name: "Nashtah Pup Pilot",
	faction:Unit.SCUM,
        done:true,
	pilotid:178,
	unique:true,
        unit: "Z-95 Headhunter",
        skill: 2,
	wave:["8"],
        points: 0,
        upgrades: [],
    },
    {
	name:"Dengar",
	faction:Unit.SCUM,
	unique:true,
	pilotid:179,
	unit:"JumpMaster 5000",
	skill:9,
	points:33,
	done:true,
	init: function() {
	    var self=this;
	    this.dengarattack=-1;
	    this.addattack(function(c,h,t) { 
		// Side effect ! 
		this.retaliationtarget=t;
		return self.dengarattack<round&&t!=self
		    &&self.isinprimaryfiringarc(t); 
	    }, this,this.weapons,function() {
		this.dengarattack=round;
	    },function() {
		return [this.retaliationtarget];
	    },"endbeingattacked");
	},
	upgrades:[Unit.ELITE,Unit.CREW,Unit.ILLICIT]
    },
    {
	name:"Tel Trevura",
	faction:Unit.SCUM,
	unique:true,
	pilotid:180,
	unit:"JumpMaster 5000",
	skill:7,
	points:30,
	done:true,
	init: function() {
	    this.resurrected=false;
	    this.wrap_before("checkdead",this,function() {
		if (this.hull<=0&&!this.dead&&!this.resurrected) {
		    this.addhull(this.ship.hull-this.hull);
		    this.criticals=[];
		    SOUNDS.explode.play();
		    this.resurrected=true;
		    this.log("resists!");
		    this.applydamage(4);
		    this.showoverflow();
		}
	    });
	},
	upgrades:[Unit.ELITE,Unit.CREW,Unit.ILLICIT]
    },
    {
	name:"Manaroo",
	faction:Unit.SCUM,
	pilotid:181,
	unit:"JumpMaster 5000",
	skill:4,
	unique:true,
	points:27,
	done:true,
	init: function() {
	    var self=this;/* FAQ v4.3 */
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyally(1),function(p,k) {
		    var f=this.focus,e=this.evade
		    for (var i=0; i<f; i++) {
			this.removefocustoken();
			p[k].addfocustoken();
		    }
		    for (var i=0; i<e; i++) {
			this.removeevadetoken();
			p[k].addevadetoken();
		    }
		    var t=this.targeting;
		    for (var i=t.length-1;i>=0; i--) {
			var u=t[i];
			this.removetarget(u);
			p[k].addtarget(u);
		    }
		    var t=this.istargeted;
		    for (var i=t.length-1;i>=0; i--) {
			var u=t[i];
			u.removetarget(this);
			u.addtarget(p[k]);
		    }
		},["select unit (or self to cancel) [%0]",this.name],true);
	    });
	},
	upgrades:[Unit.ELITE,Unit.CREW,Unit.ILLICIT]
    },
    { name:"Tomax Bren",
      faction:Unit.EMPIRE,
      pilotid:182,
      unit:"TIE Bomber",
      skill:8,
      wave:["aces"],
      unique:true,
      done:true,
      points:24,
      upgrades:[Unit.ELITE,Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB],
      init: function() {
	  var self=this;
	  self.flip=-1;
	  for (var i=0; i<this.upgrades.length; i++) {
	      var upg=this.upgrades[i];
	      if (upg.type==Unit.ELITE) (function(upg) {
		  upg.wrap_after("desactivate",this,function() {
		      if (self.flip<round) { 
			  self.donoaction([{org:self,name:self.name,type:"Unit.ELITE",
					    action:function(n) {
						upg.isactive=true;
						self.log("name reactivated:"+upg.name);
						//if (typeof upg.init=="function") upg.init(self);
						self.flip=round;
						self.endnoaction(n,"Unit.ELITE");
					    }}],"Choose to reactivate an elite upgrade (or not)",true);
		      }
		  });
	      })(upg);
	  }
      },
    },
    { name:"Lothal Rebel",
      faction:Unit.REBEL,
      done:true,
      unit:"VCX-100",
      skill:3,
      pilotid:183,
      points:35,
      upgrades:[Unit.SYSTEM,Unit.TURRET,Unit.TORPEDO,Unit.TORPEDO,Unit.CREW,Unit.CREW],
      init: function() {
	  for (var i=0; i<this.weapons.length; i++) {
	      var w=this.weapons[i];
	      if (w.type==Unit.TORPEDO) {
		  w.auxiliary=AUXILIARY,
		  w.subauxiliary=SUBAUXILIARY
	      }
	  }
      }
    },
   {
       name:"Baron of the Empire",
       faction:Unit.EMPIRE,
       pilotid:184,
       done:true,
       unit:"TIE Adv. Prototype",
       skill:4,
       points:19,
       upgrades:[Unit.ELITE,Unit.MISSILE]
    },
   {
       name:"Gand Findsman",
       faction:Unit.SCUM,
       pilotid:185,
       done:true,
       unit:"G-1A Starfighter",
       skill:5,
       points:25,
       upgrades:[Unit.ELITE,Unit.CREW,Unit.SYSTEM,Unit.ILLICIT]
    },
    {
       name:"Ruthless Freelancer",
       faction:Unit.SCUM,
       pilotid:186,
       done:true,
       unit:"G-1A Starfighter",
       skill:3,
       points:23,
       upgrades:[Unit.CREW,Unit.SYSTEM,Unit.ILLICIT]
    },
    {
	name:"'Zeta Leader'",
	faction:Unit.EMPIRE,
	pilotid:187,
	done:true,
	unique:true,
	unit:"TIE/FO Fighter",
	skill:7,
	points:20,
	upgrades:[Unit.ELITE,Unit.TECH],
	modifyattackdefense:function(a,d,t,w) {
	    if (this.stress==0) {
		this.addstress();
		a=a+1;
	    }
	    return {a:a,d:d};
	},
	preattackroll: function(w,t) {
	    var a1={org:this,name:this.name,type:"STRESS",action:function(n) {
		this.log("+1 attack die");
		this.wrap_after("getattackstrength",this,function(i,sh,a){
		    return 1+a;
		}).unwrapper("attackroll");
		this.addstress();
		this.endnoaction(n,"STRESS");
	    }.bind(this)};
	    if (this.stress==0) 
		this.donoaction([a1],"select to add +1 attack roll",true);
	}
    },
    {
	name:"Countess Ryad",
	faction:Unit.EMPIRE,
	pilotid:188,
	done:true,
	unique:true,
	unit:"TIE Defender",
	skill:5,
	wave:["aces"],
	points:34,
	shipimg:"tie-defender-red",
	upgrades:[Unit.ELITE,Unit.CANNON,Unit.MISSILE],
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		if (this.hasionizationeffect()) return p;
		for (var i=1; i<=5; i++) {
		    if (typeof p["F"+i]!="undefined") {
			p["K"+i]={move:"K"+i,difficulty:p["F"+i].difficulty};
		    }
		}
		return p;
	    });
	}
    },
    {
	name:"'Deathfire'",
	faction:Unit.EMPIRE,
	pilotid:189,
	done:true,
	unique:true,
	unit:"TIE Bomber",
	skill:3,
	wave:["aces"],
	points:17,
	upgrades:[Unit.TORPEDO,Unit.TORPEDO,Unit.MISSILE,Unit.MISSILE,Unit.BOMB],
	init: function() {
	    var i;
	    for (i=0; i<this.upgrades.length; i++) {
		var upg=this.upgrades[i];
		if (typeof upg.action=="function"&&upg.type==Unit.BOMB) {
		    upg.wrap_after("canbedropped",this,Bomb.prototype.canbedropped);
		}
	    }
	}
    },
    {
	name:"Rey",
	faction:Unit.REBEL,
	pilotid:190,
	done:true,
	unique:true,
        unit: "YT-1300",
        skill: 8,
	wave:["aces"],
        points: 45,
        upgrades: [Unit.ELITE,Unit.MISSILE,Unit.CREW,Unit.CREW],
	init: function() {
	    this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
		dice:["blank"],
		n:function() { return 2; },
		req:function(attacker,w,defender) {
		    return attacker.isinfiringarc(defender);
		}
	    });
	    this.adddicemodifier(Unit.DEFENSE_M,Unit.REROLL_M,Unit.DEFENSE_M,this,{
		dice:["blank"],
		n:function() { return 2; },
		req:function(attacker,w,defender) {
		    return defender.isinfiringarc(attacker);
		}
	    });
	}
    },
    {
        name: "Poe Dameron",
        faction: Unit.REBEL,
	pilotid:191,
        unit: "T-70 X-Wing",
	unique:true,
	done:true,
	ambiguous:true,
	edition:"HoR",
	init: poe_fct,
        skill: 9,
	wave:["aces"],
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
	points:33
    },
    {
        name: "'Quickdraw'",
        faction: Unit.EMPIRE,
	pilotid:192,
        unit: "TIE/SF Fighter",
	unique:true,
	done:true,
        skill: 9,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.MISSILE,Unit.TECH],
	points:29,
	init:function() {
	    this.qdattack=-1;
	    this.addattack(function(c,h) { 
		return this.qdattack<round;
	    }, this,[this.weapons[0]],function() {
		this.qdattack=round;
	    },function() {
		return squadron;
	    },"removeshield");
	}
    },
    {
        name: "'Backdraft'",
        faction: Unit.EMPIRE,
	pilotid:193,
        unit: "TIE/SF Fighter",
	unique:true,
	done:true,
        skill: 7,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.MISSILE,Unit.TECH],
	points:27,
	init: function() {
	    this.wrap_after("modifyattackroll",this,function(m,n,d,mm) {
		 if (this.weapons[0].getauxiliarysector(d)<=3)  
		    mm+=Unit.FCH_CRIT;
		return mm;
	    });
	    this.adddicemodifier(Unit.ATTACK_M,Unit.ADD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    return !targetunit.dead&&this.activeweapon==0&&this.weapons[0].getauxiliarysector(targetunit)<=3;
		}.bind(this),
		f:function(m,n) {
		    this.log("%0 in auxiliary arc -> +1 %CRIT%",targetunit.name);
		    return {m:m+Unit.FCH_CRIT,n:n+1};
		}.bind(this),str:"critical"});
	}
    },
    {
        name: "Zeta Specialist",
        faction: Unit.EMPIRE,
	pilotid:194,
	done:true,
        unit: "TIE/SF Fighter",
        skill: 3,
        upgrades: [Unit.SYSTEM,Unit.MISSILE,Unit.TECH],
	points:23
    },
    {
        name: "Ketsu Onyo",
        faction: Unit.SCUM,
	pilotid:195,
        unit: "Lancer-class Pursuit Craft",
	unique:true,
        skill: 7,
	done:true,
        upgrades: [Unit.ELITE,Unit.CREW,Unit.ILLICIT,Unit.ILLICIT],
	points:38,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyenemy(1,function(s,t) { 
		    var w=self.weapons[0];
		    return w.getprimarysector(t)<=3&&w.getauxiliarysector(t)<=3; 
		}),function(p,k) {
		    p[k].log("+1 tractor beam token [%0]",self.name);
		    p[k].addtractorbeam(self);
		},["select unit for tractor beam token [%0]",self.name],false);
	    });
	}
    },
    {
        name: "Asajj Ventress",
        faction: Unit.SCUM,
	pilotid:196,
        unit: "Lancer-class Pursuit Craft",
	unique:true,
	done:true,
        skill: 6,
        upgrades: [Unit.ELITE,Unit.CREW,Unit.ILLICIT,Unit.ILLICIT],
	points:37,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyenemy(2,function(s,t) { 
		    return self.weapons[0].getauxiliarysector(t)<=3; 
		}),function(p,k) {
		    p[k].log("+1 stress [%0]",self.name);
		    p[k].addstress(self);
		},["select unit [%0]",self.name],false);
	    });	    
	}
    },
    {
        name: "Sabine Wren",
        faction: Unit.SCUM,
	pilotid:197,
        unit: "Lancer-class Pursuit Craft",
	unique:true,
	done:true,
        skill: 5,
        upgrades: [Unit.CREW,Unit.ILLICIT,Unit.ILLICIT],
	points:35,
	init: function() {
	    this.adddicemodifier(Unit.DEFENSE_M,Unit.ADD_M,Unit.DEFENSE_M,this,{
		req:function(m,n) {
		    return this.weapons[0].getauxiliarysector(activeunit)<=2;
		}.bind(this),
		f:function(m,n) {
		    this.log("Attacker inside Range 1-2 of mobile arc -> +1 %FOCUS%");
		    return {m:m+Unit.FE_FOCUS,n:n+1};
		}.bind(this),str:"focus"});
	}
    },
    {
        name: "Shadowport Hunter",
        faction: Unit.SCUM,
	pilotid:198,
	done:true,
        unit: "Lancer-class Pursuit Craft",
        skill: 2,
        upgrades: [Unit.CREW,Unit.ILLICIT,Unit.ILLICIT],
	points:33
    },
    {
        name: "Zealous Recruit",
        faction: Unit.SCUM,
	pilotid:199,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 1,
        upgrades: [Unit.TORPEDO],
	points:20
    },
    {
        name: "Concord Dawn Veteran",
        faction: Unit.SCUM,
	pilotid:200,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 3,
        upgrades: [Unit.ELITE,Unit.TORPEDO],
	points:22
    },
    {
        name: "Concord Dawn Ace",
        faction: Unit.SCUM,
	pilotid:201,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 5,
        upgrades: [Unit.ELITE,Unit.TORPEDO],
	points:23
    },
    {
        name: "Kad Solus",
        faction: Unit.SCUM,
	pilotid:202,
	unique:true,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 6,
        upgrades: [Unit.ELITE,Unit.TORPEDO],
	points:25,
	init: function() {
	    this.wrap_after("handledifficulty",this,function(difficulty) {
		if (difficulty=="RED") {
		    this.addfocustoken(); 
		    this.addfocustoken();
		    this.log("red maneuver -> +2 %FOCUS% [%0]",this.name);
		}
	    });

	}
    },
    {
        name: "Old Teroch",
        faction: Unit.SCUM,
	pilotid:203,
	unique:true,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 7,
        upgrades: [Unit.ELITE,Unit.TORPEDO],
	points:26,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyenemy(1,function(s,t) { 
		    return true; }),
				function(p,k) {
				    var i;
				    var f=p[k].focus;
				    var e=p[k].evade;
				    if (f>0) {
					p[k].log("-%0 %FOCUS% [%1]",f,self.name);
					for (i=0; i<f; i++) p[k].removefocustoken();
				    }
				    if (e>0)  {
					p[k].log("-%0 %EVADE% [%1]",f,self.name);
					for (i=0; i<e; i++) p[k].removeevadetoken();
				    }
				},["select unit [%0]",self.name],false);
	    });
	}
    },
    {
        name: "Fenn Rau",
        faction: Unit.SCUM,
	pilotid:204,
	unique:true,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 9,
        upgrades: [Unit.ELITE,Unit.TORPEDO],
	points:28,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (this.getrange(sh)==1) {
		    this.log("+1 attack die");
		    a=a+1;
		}
		return a;
	    });
	    this.wrap_after("getdefensestrength",this,function(w,sh,a) {
		if (this.getrange(sh)==1) { 
		    this.log("+1 defense die");
		    a=a+1;
		}
		return a;
	    });
	}
    },
    {
        name: "Norra Wexley",
        faction: Unit.REBEL,
	pilotid:205,
	unique:true,
        unit: "ARC-170",
        skill: 7,
	done:true,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.CREW,Unit.ASTROMECH],
	points:29,
        init:  function() {
	    this.wrap_after("modifyattackroll",this,function(m,n,d,mm) {
		if (this.targeting.length==1) 
		    mm+=Unit.FCH_FOCUS;
		return mm;
	    });
	    this.adddicemodifier(Unit.ATTACK_M,Unit.ADD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    return this.canusetarget(targetunit);
		}.bind(this),
		f:function(m,n) {
		    this.removetarget(targetunit);
		    this.log("1 %TARGET% -> 1 %FOCUS%");
		    return {m:m+Unit.FCH_FOCUS,n:n+1};
		}.bind(this),str:"target"});
	    this.adddicemodifier(Unit.DEFENSE_M,Unit.ADD_M,Unit.DEFENSE_M,this,{
		req:function(m,n) {
		    return this.canusetarget(activeunit);
		}.bind(this),
		f:function(m,n) {
		    this.removetarget(activeunit);
		    this.log("1 %TARGET% -> 1 %FOCUS%");
		    return {m:m+Unit.FE_FOCUS,n:n+1};
		}.bind(this),str:"target"});
	},   
    },
    {
        name: "Shara Bey",
        faction: Unit.REBEL,
	pilotid:206,
	unique:true,
	done:true,
        unit: "ARC-170",
        skill: 6,
        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.CREW,Unit.ASTROMECH],
	points:28,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("declareattack",self,function(w,target,b) {
		if (b&&self!=this&&self.isally(this)) {
		    this.wrap_after("canusetarget",self,function(sh,r) {
			if (self.getrange(this)<=2&&self.targeting.indexOf(sh)>-1) {
			    return true;
			}
			return r;
		    }).unwrap("cleanupattack");
		    this.wrap_before("removetarget",self,function(t) {
			if (self.getrange(this)<=2
			    &&this.targeting.indexOf(t)==-1
			    &&self.targeting.indexOf(t)>-1) {
			    self.removetarget(t);
			}
		    }).unwrap("cleanupattack");
		}
		return b;
	    });
	}
    },
    {
        name: "Thane Kyrell",
        faction: Unit.REBEL,
	pilotid:207,
	unique:true,
	done:true,
        unit: "ARC-170",
        skill: 4,
        upgrades: [Unit.TORPEDO,Unit.CREW,Unit.ASTROMECH],
	points:26,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("afterdefenseeffect",this,function(c,h) {
		if (self!=this
		    &&this.isally(self)
		    &&self.getrange(this)<=3
		    &&self.candoaction()) {
		    self.log("+1 free action [%0]",self.name);
		    self.doaction(self.getactionlist(),"");
		}
	    });
	}
    },
    {
        name: "Braylen Stramm",
        faction: Unit.REBEL,
	pilotid:208,
	unique:true,
	done:true,
        unit: "ARC-170",
        skill: 3,
        upgrades: [Unit.TORPEDO,Unit.CREW,Unit.ASTROMECH],
	points:25,
	init: function() {
	    this.wrap_before("endmaneuver",this,function() {
		if (this.stress>0) {
		    var roll=this.rollattackdie(1,this,"hit")[0];
		    if (roll=="hit"||roll=="critical") {
			this.log("-1 stress [%0]",this.name);
			this.removestresstoken();
		    }
		}
	    });
	}
    },
    {
        name: "Omega Specialist",
        faction: Unit.EMPIRE,
	pilotid:209,
	done:true,
        unit: "TIE/SF Fighter",
        skill: 5,
        upgrades: [Unit.ELITE,Unit.SYSTEM,Unit.MISSILE,Unit.TECH],
	points:25
    },
    {
        name: "Sabine Wren",
        faction: Unit.REBEL,
	pilotid:210,
	done:true,
	unique:true,
        unit: "TIE Fighter",
        skill: 5,
	ambiguous:true,
	edition:"TIE Fighter",
        upgrades: [Unit.ELITE],
	points:15,
	wave:["10"],
	init: function() {
	    this.wrap_after("beginactivation",this,sabine_fct);
	}
    },
    { name:"Chewbacca",
      unit:"YT-1300",
      skill:5,
      unique:true,
      edition:"HoR",
      wave:["aces"],
      ambiguous:true,
      done:true,
      pilotid:211,
      faction:Unit.REBEL,
      upgrades:[Unit.ELITE,Unit.MISSILE,Unit.CREW,Unit.CREW],
      points:42,
      init:function() {
	  var self=this;
	  this.addattack(function(c,h,t) { 
	      return c+h<=0&&self.getrange(t)<=3;
	    }, this,this.weapons,function() {
	    },function() {
		return squadron;
	    },"warndeath");
      }
    },
    { name:"Han Solo",
      unit:"YT-1300",
      skill:9,
      done:true,
      unique:true,
      edition:"HoR",
      wave:["aces"],
      ambiguous:true,
      pilotid:212,
      faction:Unit.REBEL,
      upgrades:[Unit.ELITE,Unit.MISSILE,Unit.CREW,Unit.CREW],
      points:46
    },
    {name:"Nien Nunb",
     unit:"T-70 X-Wing",
     unique:true,
     wave:["aces"],
     done:true,
     pilotid:213,
     faction:Unit.REBEL,
     upgrades:[Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
     init:function() {
	 this.wrap_after("addstress",this,function() {
	     var p=this.selectnearbyenemy(1,function(s,t) {
		 return s.isinprimaryfiringarc(t);
	     });
	     if (p.length>0)  this.removestresstoken();
	 });
     },
     points:29,
     skill:7
    },
    /* TODO: check timing */
    {name:"'Snap' Wexley",
     unit:"T-70 X-Wing",
     unique:true,
     done:true,
     pilotid:214,
     faction:Unit.REBEL,
     upgrades:[Unit.ELITE,Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
     points:28,
     wave:["aces"],
     skill:6,
     init:function() {
	 this.wrap_before("endmaneuver",this,function() {
	     var p=this.moves;
	     for (var i in p) {
		 var m=p[i].move;
		 if (m.match(/\w+[234]/)&&!this.collision&&this.candoboost()) {
		     this.doaction([this.newaction(this.resolveboost,"BOOST")],"free %BOOST%");
		 }
	     }
	 });
	 
     }
    },
    {name:"Jess Pava",
     unit:"T-70 X-Wing",
     unique:true,
     done:true,
     pilotid:215,
     faction:Unit.REBEL,
     upgrades:[Unit.TORPEDO,Unit.ASTROMECH,Unit.TECH],
     points:25,
     skill:3,
     wave:["aces"],
     init: function() {
	 var self=this;
	 var f=function() {
	     return self.selectnearbyally(1,function(s,t) { return s!=t; }).length;
	 };
	 this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
	     dice:["blank","focus"],
	     n:f,
	     req:function(attack,w,defender) { return true; }
	 });
	 this.adddicemodifier(Unit.DEFENSE_M,Unit.REROLL_M,Unit.DEFENSE_M,this,{
	     dice:["blank","focus"],
	     n:f,
	     req:function(attack,w,defender) { return true; }
	 });
     }
    },
    {
        name: "Ahsoka Tano",
        faction: Unit.REBEL,
	pilotid:216,
	unique:true,
        unit: "TIE Fighter",
        skill: 7,
        upgrades: [Unit.ELITE],
	points:17,
	wave:["10"],
	done:true,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		if (this.canusefocus()) {
		    var p=this.selectnearbyally(1);
		    p.push(this);
		    this.selectunit(p,function(p,k) {
			if (p[k]!=self) {
			    self.removefocustoken();
			    p[k].log("+1 free action [%0]",self.name);
			    p[k].doaction(p[k].getactionlist(),"");
			}
		    },["select unit, self to cancel [%0]",self.name],false);
		}
	    });
	}
    },    
    {
        name: "Captain Rex",
        faction: Unit.REBEL,
	pilotid:217,
	unique:true,
	done:true,
        unit: "TIE Fighter",
        skill: 4,
	wave:["10"],
        upgrades: [],
	points:14,
	init: function() {
	    this.wrap_after("endattack",this,function(c,h,t) {
		c=new Condition(t,this,"Suppressive Fire");
	    });
	}
    },  
    {
	name:"Constable Zuvio",
	faction:Unit.SCUM,
	pilotid:218,
	unique:true,
	unit:"Quadjumper",
	skill:7,
	upgrades:[Unit.ELITE,Unit.CREW,Unit.BOMB,Unit.TECH,Unit.ILLICIT],
	points:19,
	done:true,
	init: function() {
	    /* when you reveal a reverse maneuver */
	    this.wrap_after("getbombposition",this,function(lm,size,p) {
		var m=this.maneuver;
		if (this.getdial()[m].move.match(/R/)) {
		    for (var i=0; i<lm.length; i++)
			p.push(this.getpathmatrix(this.m.clone(),lm[i]).translate(0,-size+20));
		}
		return p;
	    });
	    for (var i=0; i<this.bombs.length; i++) {
		var b=this.bombs[i];
		b.wrap_after("canbedropped",this,function(b) { 
		    var u=this.unit;
		    return b||this.unit.getdial()[this.unit.maneuver].move.match(/R/); 
		});
	    }
	}
    },
    { name:"Unkar Plutt",
      faction:Unit.SCUM,
      pilotid:219,
      unique:true,
      unit:"Quadjumper",
      skill:3,
      upgrades:[Unit.CREW,Unit.BOMB,Unit.TECH,Unit.ILLICIT],
      points:17,
      done:true,
      init: function() {
	  this.wrap_after("endactivationphase",this,function() {
	      for (var i in this.touching) {
		  var u=this.touching[i];
		  this.log("+1 tractor beam for %0",u.name);
		  u.addtractorbeam(this);
	      }
	  });
      }
    },
    { name:"Jakku Gunrunner",
      faction:Unit.SCUM,
      pilotid:220,
      done:true,
      unit:"Quadjumper",
      skill:1,
      upgrades:[Unit.CREW,Unit.BOMB,Unit.TECH,Unit.ILLICIT],
      points:15
    },
    { name:"Heff Tobber",
      faction:Unit.REBEL,
      pilotid:221,
      unique:true,
      unit:"U-Wing",
      skill:3,
      upgrades:[Unit.SYSTEM,Unit.TORPEDO,Unit.CREW,Unit.CREW],
      points:24,
      done:true,
      init:function() {
	  this.wrap_after("collidedby",this,function(u) {
	      this.doaction(this.getactionlist(),"");
	  });
      }
    },
    { name:"Blue Squadron Pathfinder",
      faction:Unit.REBEL,
      pilotid:222,
      unit:"U-Wing",
      done:true,
      skill:2,
      upgrades:[Unit.SYSTEM,Unit.TORPEDO,Unit.CREW,Unit.CREW],
      points:23
    },
    { name:"Bodhi Rook",
      faction:Unit.REBEL,
      unique:true,
      pilotid:223,
      unit:"U-Wing",
      skill:4,
      done:true,
      upgrades:[Unit.SYSTEM,Unit.TORPEDO,Unit.CREW,Unit.CREW],
      points:25,
      init: function() {
	  var self=this;
	  Unit.prototype.wrap_after("gettargetableunits",this,function(r,t) {
	      if (self.isally(this)) {
		  var p=[];
		  for (var i in squadron) {
		      var u=squadron[i];
		      if (u.isally(self)) p=p.concat(Unit.prototype.gettargetableunits.vanilla.call(u,3));
		  }
		  return p;
	      } 
	      return t;
	  });
      }
    },
    { name:"'Duchess'",
      faction:Unit.EMPIRE,
      unique:true,
      done:true,
      pilotid:224,
      unit:"TIE Striker",
      skill:8,
      upgrades:[Unit.ELITE],
      points:23,
      init: function() {
	  this.facultativeailerons=true;
      }
    },
    { name:"'Countdown'",
      faction:Unit.EMPIRE,
      unique:true,
      pilotid:225,
      unit:"TIE Striker",
      skill:5,
      upgrades:[],
      done:true,
      points:20,
      init: function() {
	    this.adddicemodifier(Unit.ATTACKCOMPARE_M,Unit.ADD_M,Unit.ATTACK_M,this,{
		req:function(m,n) { return this.stress==0&&n>0; }.bind(this),
		f:function(m,n) {
		    if (this.stress==0) {
			this.log("cancel all dice results");
			this.applydamage(1);
			this.endattack(); /* Not the end of the attack, just no dice */
			this.addstress();
			return {m:0,n:0};
		    } else return {m:m,n:n};
		}.bind(this),str:"hit"});

      }
    },
    { name:"'Pure Sabacc'",
      faction:Unit.EMPIRE,
      unique:true,
      pilotid:226,
      unit:"TIE Striker",
      skill:6,
      upgrades:[Unit.ELITE],
      points:22,
      done:true,
      init: function() {
	  this.wrap_after("getattackstrength",this,function(i,t,a) {
	      if (this.criticals.length<=1) a=a+1;
	      return a;
	  });
      }
    },
    { name:"Imperial Trainee",
      faction:Unit.EMPIRE,
      pilotid:227,
      done:true,
      unit:"TIE Striker",
      skill:1,
      upgrades:[],
      points:17
    },
    { name:"Black Squadron Scout",
      faction:Unit.EMPIRE,
      pilotid:228,
      done:true,
      unit:"TIE Striker",
      skill:4,
      upgrades:[Unit.ELITE],
      points:20
    },
    { name:"Scarif Defender",
      faction:Unit.EMPIRE,
      pilotid:229,
      done:true,
      unit:"TIE Striker",
      skill:3,
      upgrades:[],
      points:18
    },
    { name:"Cassian Andor",
      faction:Unit.REBEL,
      pilotid:230,
      unit:"U-Wing",
      skill:6,
      unique:true,
      done:true,
      upgrades:[Unit.ELITE,Unit.SYSTEM,Unit.TORPEDO,Unit.CREW,Unit.CREW],
      points:27,
      init: function() {
	  var self=this;
	  this.wrap_after("beginactivationphase",this,function(l) {
	      var p=this.selectnearbyally(2,function(s,t) {
		  if (t.stress>0) return true; else return false; 
	      });
	      if (p.length>0) {
		  this.doselection(function(n) {
		      this.log("select unit for -1 stress");
		      this.resolveactionselection(p,function(k) {
			  p[k].removestresstoken();
			  self.endnoaction(n);
		      });
		  }.bind(this));
	      }
	      return l;
	  });
      }
    },
    {name:"Kylo Ren",
     faction:Unit.EMPIRE,
     pilotid:231,
     unique:true,
     unit:"Upsilon-Class Shuttle",
     skill:6,
     done:true,
     upgrades:[Unit.ELITE,Unit.SYSTEM,Unit.CREW,Unit.CREW,Unit.TECH,Unit.TECH],
     points:34,
     init: kylo_fct
    },
    {name:"Major Stridan",
     faction:Unit.EMPIRE,
     pilotid:232,
     unique:true,
     done:true,
     unit:"Upsilon-Class Shuttle",
     skill:4,
     upgrades:[Unit.SYSTEM,Unit.CREW,Unit.CREW,Unit.TECH,Unit.TECH],
     points:32,
     init: function() {
	 this.wrap_after("selectnearbyally",this,function(r,f,t) {
	     if (typeof t=="undefined") { t=f; f=undefined; }
	     if (r>1) return t;
	     var t2 = Unit.prototype.selectnearbyally.call(this,3,f);
	     return t2;
	 });
     }
    },
   {name:"Lieutenant Dormitz",
     faction:Unit.EMPIRE,
     pilotid:233,
    unique:true,
    done:true,
     unit:"Upsilon-Class Shuttle",
     skill:3,
     upgrades:[Unit.SYSTEM,Unit.CREW,Unit.CREW,Unit.TECH,Unit.TECH],
     points:31
    },
   {name:"Starkiller Base Pilot",
     faction:Unit.EMPIRE,
     pilotid:234,
    done:true,
     unit:"Upsilon-Class Shuttle",
     skill:2,
     upgrades:[Unit.SYSTEM,Unit.CREW,Unit.CREW,Unit.TECH,Unit.TECH],
     points:30
    },
    {
        name: "'Zeb' Orrelios",
        faction: Unit.REBEL,
	pilotid:235,
	unique:true,
	done:true,
	ambiguous:true,
	edition:"TIE Fighter",
        unit: "TIE Fighter",
        skill: 3,
	wave:["10"],
        upgrades: [],
	points:13,
	cancelhit:zeb_fct
    },  
    { 
	name: "Resistance Sympathizer",
	faction:Unit.REBEL,
	pilotid:236,
	done:true,
	unit:"YT-1300",
	skill:3,
	wave:["aces"],
	upgrades:[Unit.MISSILE,Unit.CREW,Unit.CREW],
	points:38
    },
    { 
	name: "Sarco Plank",
	faction:Unit.SCUM,
	pilotid:237,
	done:true,
	unique:true,
	unit:"Quadjumper",
	skill:5,
	upgrades:[Unit.ELITE,Unit.CREW,Unit.BOMB,Unit.TECH,Unit.ILLICIT],
	points:18,
	init: function() {
	    var self=this;
	    this.wrap_after("getdefensestrength",this,function(i,sh,d) {
		var s=0;
		var a=this.getagility();
		if (this.lastmaneuver>=0) 
		    s=P[this.getdial()[this.lastmaneuver].move].speed;
		if (a<s)  d=d-a+s;
		return d;
	    });
	}
   },
   { name:"Inaldra",
     faction:Unit.SCUM,
     pilotid:238,
     unique:true,
     done:true,
     unit:"M3-A Interceptor",
     skill:3,
     wave:["epic"],
     upgrades:[Unit.ELITE],
     points:15,
     init: function() {
	 this.adddicemodifier(Unit.ATTACK_M,Unit.REROLL_M,Unit.ATTACK_M,this,{
	     dice:["blank","focus"],
	     n:function() { return 9; },
	     req:function(attack,w,defender) {
		 if (this.shield>0) return true;
		 return false;
	     }.bind(this),
	     side:function() {
		 this.removeshield(1);
	     }.bind(this)
	 });
	 this.adddicemodifier(Unit.DEFENSE_M,Unit.REROLL_M,Unit.DEFENSE_M,this,{
	     dice:["blank","focus"],
	     n:function() { return 9; },
	     req:function(attack,w,defender) {
		 if (this.shield>0) return true;
		 return false;
	     }.bind(this),
	     side:function() {
		 this.removeshield(1);
	     }.bind(this)
	 });
     }
   },
   { name:"Genesis Red",
     faction:Unit.SCUM,
     pilotid:239,
     unique:true,
     done:true,
     unit:"M3-A Interceptor",
     skill:7,
     wave:["epic"],
     upgrades:[Unit.ELITE],
     points:19,
     init: function() {
	 this.wrap_after("addtarget",this,function(t) {
	     var df=t.focus-this.focus;
	     var de=t.evade-this.evade;
	     if (df>0||de>0) this.log("balance %FOCUS% and %EVADE% with %0",t.name);
	     if (t.focus>this.focus) while (t.focus>this.focus) this.addfocustoken();
	     if (t.evade>this.evade) while (t.evade>this.evade) this.addevadetoken();
	 });
     }
   },
   { name:"Sunny Bounder",
     faction:Unit.SCUM,
     pilotid:240,
     unique:true,
     unit:"M3-A Interceptor",
     skill:1,
     wave:["epic"],
     upgrades:[],
     points:14
   },
   { name:"Quinn Jast",
     faction:Unit.SCUM,
     pilotid:241,
     unique:true,
     wave:["epic"],
     unit:"M3-A Interceptor",
     skill:6,
     upgrades:[Unit.ELITE],
     points:18,
     done:true,
     init: function() {
	 this.wrap_before("begincombatphase",this,function() {
	     this.donoaction([{action:function(n) {
		 this.noattack=round;
		 for (var i in this.upgrades) {
		     var u=this.upgrades[i];
		     if ((u.type==Unit.TORPEDO||u.type==Unit.MISSILE)&&u.isactive==false) {
			 u.isactive=true;
		     }
		 }
		 this.endnoaction(n,"");
	     }.bind(this),type:"Unit.TORPEDO",name:this.name}],"",true);
	    });
     }
   },
    {
	name:"Senator's Shuttle",
	faction:Unit.REBEL,
	pilotid:242,
	unit:"Corellian Star Shuttle",
	skill:0,
	done:true,
	upgrades:[],
	points:2,
	init:function() {
	    this.wrap_before("begincombatphase",this,function() {
		this.noattack=round;
	    });
	    var self=this;
	    for (var i in squadron) {
		var u=squadron[i];
		if (u.team==this.team&&this.getrange(u)==1) {
		    u.wrap_after("getupgactionlist",this,function(l) {
			var p=this.selectnearbyally(1);
			if (!self.dead&&p.indexOf(self)>-1) {
			    l.push({org:self,action:function(n) {
				self.addevadetoken();
				this.endaction(n);
			    },type:"REINFORCE",name:"Protect"});
			}
			return l;
		    });	
		}
	    }
	}
    },
	{
		name: "Lieutenant Kestal",
		faction: Unit.EMPIRE,
		unique: true,
		done: false,
		pilotid: 243,
		unit: "TIE Aggressor",
		skill: 7,
		points: 22,
		upgrades: [Unit.ELITE, Unit.TURRET, Unit.MISSILE, Unit.MISSILE]
	},
	{
		name: "'Double Edge'",
		faction: Unit.EMPIRE,
		unique: true,
		done: false,
		pilotid: 244,
		unit: "TIE Aggressor",
		skill: 4,
		points: 19,
		upgrades: [Unit.ELITE, Unit.TURRET, Unit.MISSILE, Unit.MISSILE]
	},
	{
		name: "Onyx Squadron Escort",
		faction: Unit.EMPIRE,
		unique: false,
		done: true,
		pilotid: 245,
		unit: "TIE Aggressor",
		skill: 5,
		points: 19,
		upgrades: [Unit.TURRET, Unit.MISSILE, Unit.MISSILE]
	},
	{
		name: "Sienar Specialist",
		faction: Unit.EMPIRE,
		unique: false,
		done: true,
		pilotid: 246,
		unit: "TIE Aggressor",
		skill: 2,
		points: 17,
		upgrades: [Unit.TURRET, Unit.MISSILE, Unit.MISSILE]
	},
	{
		name: "Wullffwarro",
		faction: Unit.REBEL,
		unique: true,
		done: false,
		pilotid: 247,
		unit: "Auzituck Gunship",
		skill: 7,
		points: 30,
		upgrades: [Unit.ELITE,Unit.CREW,Unit.CREW]
	},
	{
		name: "Lowhhrick",
		faction: Unit.REBEL,
		unique: true,
		done: false,
		pilotid: 248,
		unit: "Auzituck Gunship",
		skill: 5,
		points: 28,
		upgrades: [Unit.ELITE,Unit.CREW,Unit.CREW]
	},
	{
		name: "Wookiee Liberator",
		faction: Unit.REBEL,
		unique: false,
		done: true,
		pilotid: 249,
		unit: "Auzituck Gunship",
		skill: 3,
		points: 26,
		upgrades: [Unit.ELITE,Unit.CREW,Unit.CREW]
	},
	{
		name: "Kashyyyk Defender",
		faction: Unit.REBEL,
		unique: false,
		done: true,
		pilotid: 250,
		unit: "Auzituck Gunship",
		skill: 1,
		points: 24,
		upgrades: [Unit.CREW,Unit.CREW]
	},
	{
		name: "Captain Nym",
		faction: Unit.SCUM,
		unique: true,
		done: false,
		pilotid: 251,
		unit: "Scurrg H-6 Bomber",
		skill: 8,
		points: 30,
		upgrades: [Unit.ELITE,Unit.TURRET,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB]
	},
	{
		name: "Sol Sixxa",
		faction: Unit.SCUM,
		unique: true,
		done: false,
		pilotid: 252,
		unit: "Scurrg H-6 Bomber",
		skill: 6,
		points: 28,
		upgrades: [Unit.ELITE,Unit.TURRET,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB]
	},
	{
		name: "Lok Revenant",
		faction: Unit.SCUM,
		unique: false,
		done: true,
		pilotid: 253,
		unit: "Scurrg H-6 Bomber",
		skill: 3,
		points: 26,
		upgrades: [Unit.ELITE,Unit.TURRET,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB]
	},
	{
		name: "Karthakk Pirate",
		faction: Unit.SCUM,
		unique: false,
		done: true,
		pilotid: 254,
		unit: "Scurrg H-6 Bomber",
		skill: 1,
		points: 24,
		upgrades: [Unit.TURRET,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB]
	},
	{
		name: "Captain Nym",
		faction: Unit.REBEL,
		unique: true,
		done: false,
		pilotid: 255,
		unit: "Scurrg H-6 Bomber",
		skill: 8,
		points: 30,
		upgrades: [Unit.ELITE,Unit.TURRET,Unit.TORPEDO,Unit.MISSILE,Unit.CREW,Unit.BOMB,Unit.BOMB]
	},
	{
        	name: "Dalan Oberos",
	        faction:Unit.SCUM,
	        done:false,
		unique:true,
		pilotid:256,
	        unit: "StarViper",
	        skill: 6,
	        points: 30,
	        upgrades: [Unit.ELITE,Unit.TORPEDO]
	},
	{
            name: "Thweek",
            faction:Unit.SCUM,
            done:false,
            unique:true,
            pilotid:257,
            unit: "StarViper",
            skill: 4,
            points: 28,
            upgrades: [Unit.TORPEDO],
            init: function() {
                var self=this;
                this.wrap_after("endsetupphase",this,function() {
                    var p=[];
                    for (var i in squadron){
                        if (squadron[i].team!=this.team) 
                            p.push(squadron[i]);
                    };
                    var lock=$.Deferred();
                    this.selectunit( //Gives us skip functionality
                        p,
			function(p,k) {
                            this.log("select unit for condition [%0]","Shadowed");
                            new Condition(p[k],this,"Shadowed");
                            lock.resolve();
                        }.bind(this),
                        ["select unit for condition (or self to cancel) [%0]",self.name],
                        true); //somehow, "noskip" == allow skip
                });
//                this.wrap_after("endsetupphase",this,function() {
//                    var p=[];
//                    for (var i in squadron)
//                        if (squadron[i].team!=this.team) p.push(squadron[i]);
//                    if (p.length>0) {
//                        this.log("select unit for condition [%0]","Shadowed");
//                        this.resolveactionselection(p,function(k) {
//                            new Condition(p[k],this,"Shadowed");
//                        }.bind(this));
//                    }
//                });
            }
	},
	{
        	name: "Black Sun Assassin",
	        faction:Unit.SCUM,
	        done:true,
		pilotid:258,
	        unit: "StarViper",
	        skill: 5,
	        points: 28,
	        upgrades: [Unit.ELITE,Unit.TORPEDO]
	},
	{
        	name: "Viktor Hel",
		unique:true,
	        faction: Unit.SCUM,
		pilotid:259,
	        unit: "Kihraxz Fighter",
		done:false,
	        skill: 7,
        	upgrades: [Unit.ELITE,Unit.MISSILE,Unit.ILLICIT],
		points: 25
        },
	{
        	name: "Captain Jostero",
		unique:true,
	        faction: Unit.SCUM,
		pilotid:260,
	        unit: "Kihraxz Fighter",
		done:false,
	        skill: 4,
        	upgrades: [Unit.ELITE,Unit.MISSILE,Unit.ILLICIT],
		points: 24
        },
	{
        	name: "Major Vynder",
	        faction:Unit.EMPIRE,
	        unique: true,
		done:false,
		pilotid:261,
	        unit: "Alpha-class Star Wing",
	        skill: 7,
	        points: 26,
	        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.MISSILE]
	},
	{
        	name: "Lieutenant Karsabi",
	        faction:Unit.EMPIRE,
	        unique: true,
		done:false,
		pilotid:262,
	        unit: "Alpha-class Star Wing",
	        skill: 5,
	        points: 24,
	        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.MISSILE]
	},
	{
        	name: "Rho Squadron Veteran",
	        faction:Unit.EMPIRE,
		done:true,
		pilotid:263,
	        unit: "Alpha-class Star Wing",
	        skill: 4,
	        points: 21,
	        upgrades: [Unit.ELITE,Unit.TORPEDO,Unit.MISSILE]
	},
	{
        	name: "Nu Squadron Pilot",
	        faction:Unit.EMPIRE,
		done:true,
		pilotid:264,
	        unit: "Alpha-class Star Wing",
	        skill: 2,
	        points: 18,
	        upgrades: [Unit.TORPEDO,Unit.MISSILE]
	},
	{
	       name:"Torani Kulda",
	       faction:Unit.SCUM,
	       pilotid:265,
	       unique:true,
	       done:false,
	       unit:"M12-L Kimogila Fighter",
	       skill:8,
	       points:27,
	       upgrades:[Unit.ELITE,Unit.TORPEDO,Unit.MISSILE,Unit.SALVAGED,Unit.ILLICIT]
	},
	{
	       name:"Dalan Oberos",
	       faction:Unit.SCUM,
	       pilotid:266,
	       unique:true,
	       done:false,
	       unit:"M12-L Kimogila Fighter",
		   ambiguous:true,
		   edition:"Kimogila Fighter",
	       skill:7,
	       points:25,
	       upgrades:[Unit.ELITE,Unit.TORPEDO,Unit.MISSILE,Unit.SALVAGED,Unit.ILLICIT]
	},
	{
	       name:"Cartel Executioner",
	       faction:Unit.SCUM,
	       pilotid:267,
	       unique:false,
	       done:false,
	       unit:"M12-L Kimogila Fighter",
	       skill:5,
	       points:24,
	       upgrades:[Unit.ELITE,Unit.TORPEDO,Unit.MISSILE,Unit.SALVAGED,Unit.ILLICIT]
	},
	{
	       name:"Cartel Brute",
	       faction:Unit.SCUM,
	       pilotid:268,
	       unique:false,
	       done:false,
	       unit:"M12-L Kimogila Fighter",
	       skill:3,
	       points:22,
	       upgrades:[Unit.TORPEDO,Unit.MISSILE,Unit.SALVAGED,Unit.ILLICIT]
	},
	{
		name:"Fenn Rau",
		faction:Unit.REBEL,
		unique:true,
    	    	unit:"Sheathipede-class Shuttle",
    	    	skill:9,
                edition:"Sheathipede-class Shuttle",
                ambiguous:true,
		pilotid:269,
		points:20,
		done:false,
		upgrades:[Unit.ELITE,Unit.CREW,Unit.ASTROMECH]
	},
	{
		name:"Ezra Bridger",
		faction:Unit.REBEL,
		unique:true,
		ambiguous:true,
		edition:"Sheathipede-class Shuttle",
    	    	unit:"Sheathipede-class Shuttle",
    	    	skill:5,
		pilotid:270,
		points:17,
		done:true,
		init: ezra_fct,        
		upgrades:[Unit.ELITE,Unit.CREW,Unit.ASTROMECH]
	},
	{
		name:"'Zeb' Orrelios",
		faction:Unit.REBEL,
		unique:true,
		ambiguous:true,
		edition:"Sheathipede-class Shuttle",
		unit:"Sheathipede-class Shuttle",
    	    	skill:3,
		pilotid:271,
		points:16,
		done:true,
		cancelhit:zeb_fct,
		upgrades:[Unit.CREW,Unit.ASTROMECH]
	},
	{
		name:"AP-5",
		faction:Unit.REBEL,
		unique:true,
    	    	unit:"Sheathipede-class Shuttle",
    	    	skill:1,
		pilotid:272,
		points:15,
		done:false,
		upgrades:[Unit.CREW,Unit.ASTROMECH]
	},
	{
		name:"Kylo Ren",
		faction:Unit.EMPIRE,
		pilotid:273,
		unique:true,
		unit:"TIE Silencer",
                edition:"TIE Silencer",
                ambiguous:true,
		skill:9,
		done:true,
		upgrades:[Unit.ELITE,Unit.SYSTEM,Unit.TECH],
		points:35,
		init: kylo_fct
	},
	{
		name:"Test Pilot 'Blackout'",
		faction:Unit.EMPIRE,
		pilotid:274,
		unique:true,
		unit:"TIE Silencer",
		skill:7,
		done:false,
		upgrades:[Unit.ELITE,Unit.SYSTEM,Unit.TECH],
		points:31
	},
	{
		name:"First Order Test Pilot",
		faction:Unit.EMPIRE,
		pilotid:275,
		unique:false,
		unit:"TIE Silencer",
		skill:6,
		done:true,
		upgrades:[Unit.ELITE,Unit.SYSTEM,Unit.TECH],
		points:29
	},
	{
		name:"Sienar-Jaemus Analyst",
		faction:Unit.EMPIRE,
		pilotid:276,
		unique:false,
		unit:"TIE Silencer",
		skill:4,
		done:true,
		upgrades:[Unit.SYSTEM,Unit.TECH],
		points:26
	},
	{
		name:"'Crimson Leader'",
		faction:Unit.REBEL,
		pilotid:277,
		unit:"B/SF-17 Bomber",
		skill:7,
		unique:true,
		done:false,
		upgrades:[Unit.SYSTEM,Unit.BOMB,Unit.BOMB,Unit.TECH],
		points:29
	},
	{
		name:"'Cobalt Leader'",
		faction:Unit.REBEL,
		pilotid:278,
		unit:"B/SF-17 Bomber",
		skill:6,
		unique:true,
		done:false,
		upgrades:[Unit.SYSTEM,Unit.BOMB,Unit.BOMB,Unit.TECH],
		points:28
	},
	{
		name:"'Crimson Specialist'",
		faction:Unit.REBEL,
		pilotid:279,
		unit:"B/SF-17 Bomber",
		skill:4,
		unique:true,
		done:false,
		upgrades:[Unit.SYSTEM,Unit.BOMB,Unit.BOMB,Unit.TECH],
		points:27
	},
	{
		name:"Crimson Squadron Pilot",
		faction:Unit.REBEL,
		pilotid:280,
		unit:"B/SF-17 Bomber",
		skill:1,
		unique:false,
		done:true,
		upgrades:[Unit.SYSTEM,Unit.BOMB,Unit.BOMB,Unit.TECH],
		points:25
	}
];

})();

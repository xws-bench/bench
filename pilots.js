var REBEL="Rebel Alliance",EMPIRE="Galactic Empire",SCUM="Scum and Villainy";

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
	faction:"REBEL",
        unit: "X-Wing",
        skill: 9,
	init: function() {
	    var unit=this;
	    var ds=Unit.prototype.getagility;
	    Unit.prototype.getagility=function() {
		var a=ds.call(this);
		if (activeunit==unit&&a>0&&this==targetunit) {
		    this.log("defense reduced from "+a+" to "+(a-1)+" by "+unit.name);
		    return a-1; 
		}
		else return a;
	    };
	},
        points: 29,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Garven Dreis",
	done:true,
	faction:"REBEL",
        unique: true,
        unit: "X-Wing",
	removefocustoken: function() {
	    this.focus--;
	    this.show();
	    var p=[]; 
	    p=this.selectnearbyunits(2,function(a,b) { return (a.team==b.team&&a!=b);});
	    if (p.length>0) {
		this.log("<code class='xfocustoken'></code> -> other friendly ship");
		this.resolveactionselection_sync(p,function(k) {
		    p[k].log("+1 <code class='xfocustoken'></code> from "+this.name);
		    p[k].addfocustoken();
		}.bind(this));
	    } 
	},
        skill: 6,
        points: 26,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Red Squadron Pilot",
	done:true,
        unit: "X-Wing",
	faction:"REBEL",
        skill: 4,
        points: 23,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Rookie Pilot",
	done:true,
        unit: "X-Wing",
	faction:"REBEL",
        skill: 2,
        points: 21,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
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
	faction:"REBEL",
        skill: 5,
        points: 25,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Luke Skywalker",
	done:true,
	faction:"REBEL",
	init: function() {
	    this.adddefensemodd(this,function(m,n) {
		return true;
	    }, function(m,n) {
		var f=Math.floor(m/10);
		var e=m-f*10;
		if (f>0) {
		    this.log("1 <code class='xfocustoken'></code>-> 1 <code class='xevadetoken'></code>");
		    return m-9;
		} 
		return m;
	    }.bind(this),false,"focus");
	},        
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 28,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Gray Squadron Pilot",
	done:true,
	faction:"REBEL",
        unit: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
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
		    log("<b>select ship that may acquire target lock ("+this.name+" to cancel)</b>");
		    this.resolveactionselection(p,function(k) {
			if (k<p.length-1) { 
			    var lu=p[k].gettargetableunits(3);
			    p[k].log("<b>select target to lock</b>");
			    p[k].resolveactionselection(lu,function(kk) { 
				if (kk>=0) this.addtarget(lu[kk]);
				unit.endnoaction(n,"TARGET");
			    }.bind(p[k]));
 			} else unit.endnoaction(n,"TARGET");	
		    });
		} else this.endnoaction(n,"TARGET");
	    }.bind(this));
	},
	faction:"REBEL",
        unique: true,
        unit: "Y-Wing",
        skill: 6,
        points: 23,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Horton Salm",
	done:true,
	faction:"REBEL",
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
		}.bind(this),
		false
	    )
	},
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Gold Squadron Pilot",
	done:true,
        unit: "Y-Wing",
	faction:"REBEL",
        skill: 2,
        points: 18,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Academy Pilot",
	done:true,
        unit: "TIE Fighter",
        faction:"EMPIRE",
        skill: 1,
        points: 12,
        upgrades: [],
    },
    {
        name: "Obsidian Squadron Pilot",
	done:true,
        unit: "TIE Fighter",
        faction:"EMPIRE",
        skill: 3,
        points: 13,
        upgrades: [],
    },
    {
        name: "Black Squadron Pilot",
	done:true,
        unit: "TIE Fighter",
        faction:"EMPIRE",
        skill: 4,
        points: 14,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "'Winged Gundark'",
        faction:"EMPIRE",
        init:  function() {
	    this.addattackmoda(this,function(m,n) { 
		return (this.getrange(targetunit)==1);
	    }.bind(this),function(m,n) {
		var c=Math.floor(m/10);
		var h=(m-c*10)%100;
		if (h>0) {
		    this.log("1 <code class='hit'></code> -> 1 <code class='critical'></code>");
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
        faction:"EMPIRE",
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
        faction:"EMPIRE",
	init: function() {
	    var gas=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=gas.call(this,w,sh);
		if (!sh.isinfiringarc(this)) {
		    a=a+1;
		    this.log("+1 attack against "+sh.name);
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
        faction:"EMPIRE",
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
        faction:"EMPIRE",
	done:true,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		if (this.gethitrange(w,sh)==1) { 
		    this.log("+1 attack against "+sh.name);
		    return a+1;
		}
		return a;
	    }.bind(this);
	},
        unique: true,
        unit: "TIE Fighter",
        skill: 7,
        points: 17,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "'Howlrunner'",
        unique: true,
	done:true,
        faction:"EMPIRE",
        unit: "TIE Fighter",
        skill: 8,
	init: function() {
	    this.addattackrerolla(
		this,
		["blank","focus"],
		function() { return 1; },
		function(attacker,w,defender) {
		    // Howlrunner dead ? 
		    if (!this.dead&&attacker!=this
			&&attacker.getrange(this)==1
			&&attacker.team==this.team&&w.isprimary) {
			attacker.log("+1 reroll given by "+this.name);
			return true;
		    }
		    return false;
		}.bind(this),
		true
	    )
	},
        points: 18,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
        faction:"EMPIRE",
	unit: "TIE Advanced",
        skill: 7,
        points: 27,
	init: function() {
	    var unit=this;
	    this.ac=Unit.prototype.applycritical;
	    Unit.prototype.applycritical=function(n) {
		if (activeunit==unit&&targetunit!=unit) {
		    for (var j=0; j<n; j++) {
			var s1=this.selectdamage(true);
			CRITICAL_DECK[s1].count--;
			var s2=this.selectdamage(true);
			CRITICAL_DECK[s2].count--;
			var s3=this.selectdamage(true);
			CRITICAL_DECK[s3].count--;
			sc=[s1,s2,s3];
			log("<b>"+unit.name+" selects one of 3 criticals</b>");
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
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Tempest Squadron Pilot",
        faction:"EMPIRE",
	done:true,
        unit: "TIE Advanced",
        skill: 2,
        points: 21,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Storm Squadron Pilot",
        faction:"EMPIRE",
	done:true,
        unit: "TIE Advanced",
        skill: 4,
        points: 23,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Darth Vader",
        faction:"EMPIRE",
        unique: true,
	done:true,
        unit: "TIE Advanced",
        skill: 9,
	doendmaneuveraction: function() {
	    if (this.candoaction()) {
		var x=this.doaction(this.getactionlist(),"1st action")
		    x.done(function() {
		    if (this.candoaction()) {
			this.doaction(this.getactionlist(),"2nd action");
		    } else { this.action=-1; this.actiondone=true; this.deferred.resolve(); }
		}.bind(this))
	    } else { this.action=-1; this.actiondone=true; this.deferred.resolve(); }
 	},
	secaction:-1,
        points: 29,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Alpha Squadron Pilot",
        faction:"EMPIRE",
	done:true,
        unit: "TIE Interceptor",
        skill: 1,
        points: 18,
        upgrades: [ ],
    },
    {
        name: "Avenger Squadron Pilot",
        faction:"EMPIRE",
	done:true,
        unit: "TIE Interceptor",
        skill: 3,
        points: 20,
        upgrades: [ ],
    },
    {
        name: "Saber Squadron Pilot",
        faction:"EMPIRE",
	done:true,
        unit: "TIE Interceptor",
        skill: 4,
        points: 21,
        upgrades: ["Elite"],
    },
    {
        name: "'Fel\'s Wrath'",
        faction:"EMPIRE",
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
        faction:"EMPIRE",
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
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Soontir Fel",
        faction:"EMPIRE",
        unique: true,
	done:true,
        addstress: function () {
	    this.stress++;
	    this.log("stress token -> free focus token");
	    this.addfocustoken();
	},
        unit: "TIE Interceptor",
        skill: 9,
        points: 27,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Tycho Celchu",
	faction:"REBEL",
        unique: true,
	done:true,
        candoaction:function() {
	    if (this.collision>0||this.ocollision.template>0||this.ocollision.overlap>-1) return false;
	    return  true;
	},
        unit: "A-Wing",
        skill: 8,
        points: 26,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Arvel Crynyd",
	faction:"REBEL",
        unique: true,
	done:true,
        unit: "A-Wing",
	checkcollision: function(sh) {
	    return false;
	},
        skill: 6,
        points: 23,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Green Squadron Pilot",
	faction:"REBEL",
	done:true,
        unit: "A-Wing",
        skill: 3,
        points: 19,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Prototype Pilot",
	faction:"REBEL",
	done:true,
        unit: "A-Wing",
        skill: 1,
        points: 17,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Outer Rim Smuggler",
	faction:"REBEL",
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
        upgrades: [
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Chewbacca",
        unique: true,
	done:true,
	faction:"REBEL",
        unit: "YT-1300",
        skill: 5,
        points: 42,
	faceup: function(c) {
	    this.log("ignores critical "+c.name);
	    return true;
	},
        upgrades: [
            "Elite",
            "Missile",
            "Crew",
            "Crew",
        ]
    },
    {
        name: "Lando Calrissian",
	faction:"REBEL",
        unique: true,
        unit: "YT-1300",
        skill: 7,
        points: 44,
	handledifficulty: function(d) {
	    var unit=this;
	    var p=this.selectnearbyunits(1,function(t,s) { return t.team==s.team&&t!=s; })
	    if (p.length>0) {
		this.doselection(function(n) {
		    this.log("<b>select a pilot for a free action</b>");
		    this.resolveactionselection(p,function(k) {
			p[k].doaction(p[k].getactionbarlist()).done(function() {
			    this.select();
			    this.endnoaction(n,"");
			}.bind(this));
		    }.bind(this))
		}.bind(this))
	    }
	    Unit.prototype.handledifficulty.call(this,d);
	},
	done:true,
        upgrades: [
            "Elite",
            "Missile",
            "Crew",
            "Crew",
        ],
        attack: 3,
        agility: 1,
        hull: 8,
        shields: 5,
    },
    {
        name: "Han Solo",
        unique: true,
	done:true,
	faction:"REBEL",
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
		}.bind(this),
		false
	    )
	},
        upgrades: [
            "Elite",
            "Missile",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Kath Scarlet",
        unique: true,
        faction:"EMPIRE",
        unit: "Firespray-31",
        skill: 7,
	done:true,
	init: function() {
	    var unit=this;
	    var cc=Unit.prototype.cancelcritical;
	    Unit.prototype.cancelcritical=function(c,e,sh) {
		var ce=cc.call(this,c,e,sh);
		if (c>ce&&sh!=this&&activeunit.name=="Kath Scarlet") {
		    this.log("+1 stress for cancelling <code class='critical'></code> given by "+unit.name);
		    this.addstress();
		}
		return ce;
	    }
	},
        points: 38,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Boba Fett",
        unique: true,
	done:true,
        faction:"EMPIRE",
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial.match("BL3|BL2|BL1")) {
		this.log("change bank turn speed");
		var newdial=dial.replace(/L/,"R");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,realdial),
		     this.getpathmatrix(this.m,newdial)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,newdial,newdial,difficulty);
		    }.bind(this),false,true);
	    } else if (dial.match("BR3|BR2|BR1")) {
		this.log("change bank turn speed");
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
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Krassis Trelix",
        unique: true,
	done:true,
        faction:"EMPIRE",
        unit: "Firespray-31",
	init: function() {
	    this.addattackrerolla(
		this,
		["blank","focus"],
		function() { return 1; },
		function(w,defender) {
		    if (!w.isprimary) {
			this.log("+1 reroll for secondary weapon");
			return true;
		    }
		    return false;
		}.bind(this),
		false
	    )
	},
        skill: 5,
        points: 36,
        upgrades: [
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Bounty Hunter",
        unit: "Firespray-31",
        skill: 3,
	done:true,
        faction:"EMPIRE",
        points: 33,
        upgrades: [
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Ten Numb",
	faction:"REBEL",
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
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Ibtisam",
        unique: true,
	done:true,
	faction:"REBEL",
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
			this.log("+1 attack reroll (stressed)");
			return true;
		    }
		    return false;
		}.bind(this),
		false
	    );
	    this.adddefensererolld(
		this,
		["blank","focus"],
		function() { return 1; },
		function(w,attacker) {
		    if (this.stress>0) {
			this.log("+1 defense reroll (stressed)");
			return true;
		    }
		    return false;
		}.bind(this),
		false
	    );
	},
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Dagger Squadron Pilot",
        unit: "B-Wing",
	done:true,
	faction:"REBEL",
        skill: 4,
        points: 24,
        upgrades: [
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Blue Squadron Pilot",
        unit: "B-Wing",
	done:true,
	faction:"REBEL",
        skill: 2,
        points: 22,
        upgrades: [
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Rebel Operative",
        unit: "HWK-290",
	done:true,
	faction:"REBEL",
        skill: 2,
        points: 16,
        upgrades: [
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Roark Garnet",
        unique: true,
	faction:"REBEL",
        unit: "HWK-290",
        skill: 4,
	begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(3,function(t,s) { return t.team==s.team&&t!=s; })
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("<b>select a pilot for a PS of 12</b>");
			this.resolveactionselection(p,function(k) {
			    if (k>-1) {
				p[k].oldskill=p[k].skill;
				p[k].skill=12;
				filltabskill();
				p[k].showstats();
				this.log("pilot skill of 12");
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
        upgrades: [
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Kyle Katarn",
	faction:"REBEL",
        unique: true,
	done:true,
        unit: "HWK-290",
        skill: 6,
        points: 21,
	begincombatphase: function() {
	    if (this.focus>0) {
		var p=this.selectnearbyunits(3,function(t,s) { return s.team==t.team&&s!=t; });
		if (p.length>0) {
		    this.doselection(function(n) {
			p.push(this);
			this.log("<b>assign one focus token to a friendly unit (self to cancel)</b>");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				this.removefocustoken();
				p[k].addfocustoken();
				p[k].log("+1 <code class='xcodetoken'></code> token");
			    }
			    this.endnoaction();
			}.bind(this));
		    }.bind(this));
		}
	    }
	    return Unit.prototype.begincombatphase.call(this);
	},
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Jan Ors",
	faction:"REBEL",
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
		var r=Math.floor(Math.random()*8);
		var f=FACE[ATTACKDICE[r]];
		unit.addstress();
		unit.log("+1 attack die");
		if (f=="focus") return m+100;
		if (f=="hit") return m+1;
		if (f=="critical") return m+10;
		return m;
	    }.bind(this),true,"hit");
	},
        points: 25,
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Scimitar Squadron Pilot",
        done:true,
        unit: "TIE Bomber",
        skill: 2,
        faction:"EMPIRE",
        points: 16,
        upgrades: [
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Gamma Squadron Pilot",
	done:true,
        unit: "TIE Bomber",
        faction:"EMPIRE",
        skill: 4,
        points: 18,
        upgrades: [
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Captain Jonus",
        faction:"EMPIRE",
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
			attacker.log("+2 rerolls given by "+this.name);
			return true;
		    }
		    return false;
		}.bind(this),
		true
	    )
	},
        unique: true,
        unit: "TIE Bomber",
        skill: 6,
        points: 22,
        upgrades: [
            "Elite",
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Major Rhymer",
	done:true,
        faction:"EMPIRE",
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
        upgrades: [
            "Elite",
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Captain Kagi",
        faction:"EMPIRE",
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
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Colonel Jendon",
        faction:"EMPIRE",
        begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(1,function(s,t) { return s.team==t.team&&s!=t; });
		if (p.length>0&&this.targeting.length) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("<b>move target lock to a friendly unit (self to cancel)</b>");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				var t=this.targeting[0];
				p[k].addtarget(t);
				this.removetarget(t);
				p[k].log("targets "+t.name);
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
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Captain Yorr",
        faction:"EMPIRE",
        unique: true,
	done:true,
        unit: "Lambda-Class Shuttle",
        skill: 4,
	init: function() {
	    var as=Unit.prototype.addstress;
	    var unit=this;
	    Unit.prototype.addstress=function() {
		if (this!=unit&&this.getrange(unit)<=2&&unit.stress<=2) {
		    this.log("transferred stress to "+unit.name); 
		    unit.addstress();
		    unit.showinfo();
		} else this.stress++;
	    };
	},
        points: 24,
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Omicron Group Pilot",
        faction:"EMPIRE",
        done:true,
        unit: "Lambda-Class Shuttle",
        skill: 2,
        points: 21,
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Lieutenant Lorrir",
        faction:"EMPIRE",
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
        faction:"EMPIRE",
        done:true,
        unit: "TIE Interceptor",
        skill: 6,
        points: 22,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Tetran Cowall",
        faction:"EMPIRE",
        unique: true,
	done:true,
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial.match("K5|K3")) {
		this.log("select one K-turn");
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
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Kir Kanos",
        faction:"EMPIRE",
        useevade:  function() {
	    var ue=Unit.prototype.useevade;
	    var r=this.getrange(targetunit);
	    ue.call(this);
	    if (phase==COMBAT_PHASE&&this.canuseevade()&&this==activeunit&&r<=3&&r>=2) {
		this.removeevadetoken();
		$("#atokens .xevadetoken").remove();
		$("#attack").append("<td class='hitreddice'></td>");
		this.log("+1 <code class='hit'></code> for attacking at range 2-3");
	    }
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
        faction:"EMPIRE",
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
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Bandit Squadron Pilot",
	faction:"REBEL",
        done:true,
        unit: "Z-95 Headhunter",
        skill: 2,
        points: 12,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Tala Squadron Pilot",
	faction:"REBEL",
        done:true,
        unit: "Z-95 Headhunter",
        skill: 4,
        points: 13,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Lieutenant Blount",
	faction:"REBEL",
        done:true,
	endattack: function(c,h) {
	    if (c+h==0) {
		this.log(targetunit.name+" is hit");
		targetunit.ishit(this);
	    }
	    Unit.prototype.endattack.call(this,c,h);
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 6,
        points: 17,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Airen Cracken",
	faction:"REBEL",
	done:true,
        endattack: function() {
	    Unit.prototype.endattack.call(this);
	    var p=this.selectnearbyunits(1,function(t,s) { return (t.team==s.team)&&(s!=t)&&(s.candoaction()); });
	    if (p.length>0) {
		var unit=this;
		this.doselection(function(n) {
		    this.log("<b>assign a free action to friendly unit</b>");
		    this.resolveactionselection(p,function(k) {
			p[k].doaction(p[k].getactionlist()).done(function() { 
			    this.select();
			    this.endnoaction(n);
			}.bind(this));
		    }.bind(this));
		}.bind(this));
	    }
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 8,
        points: 19,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Delta Squadron Pilot",
        faction:"EMPIRE",
        done:true,
        
        unit: "TIE Defender",
        skill: 1,
        points: 30,
        upgrades: [
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Onyx Squadron Pilot",
        done:true,
        faction:"EMPIRE",
        
        unit: "TIE Defender",
        skill: 3,
        points: 32,
        upgrades: [
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Colonel Vessery",
        done:true,
        faction:"EMPIRE",
        attackroll:function(n) {
	    var ar=Unit.prototype.attackroll;
	    var r=ar.call(this,n);
	    if (targetunit.istargeted.length>0&&this.target==0) {
		this.addtarget(targetunit);
		this.log("target locks "+targetunit.name);	
	    }
	    return r;
	},
        unique: true,
        unit: "TIE Defender",
        skill: 6,
        points: 35,
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Rexler Brath",
        faction:"EMPIRE",
	done:true,
        endattack: function(c,h) {
	    Unit.prototype.endattack.call(this,c,h);
	    if (this.canusefocus()&&this.hitresolved>0) {
		this.log("can turn "+h+" damage(s) into critical(s)");
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
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Knave Squadron Pilot",
        
	faction:"REBEL",
        done:true,
        unit: "E-Wing",
        skill: 1,
        points: 27,
        upgrades: [
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Blackmoon Squadron Pilot",
        
	faction:"REBEL",
        done:true,
        unit: "E-Wing",
        skill: 3,
        points: 29,
        upgrades: [
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Etahn A'baht",
	done:true,
	faction:"REBEL",
        init:  function() {
	    var unit=this;
	    this.addattackmoda(this, function(m,n) {
		return (targetunit.team!=unit.team)
		    &&unit.isinfiringarc(targetunit);
	    }.bind(this), function(m,n) {
		var c=Math.floor(m/10);
		var h=(m-c*10)%100;
		if (h>0) {
		    unit.log("1 <code class='hit'></code>-> 1 <code class='critical'></code>");
		    return m+9;
		} 
		return m;
	    }.bind(this),true,"hit");
	},        

        
        unique: true,
        unit: "E-Wing",
        skill: 5,
        points: 32,
        upgrades: [
            "Elite",
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Corran Horn",
	faction:"REBEL",
	done:true,
	init: function() {
	    this.hasdoubledfired=-1;
	    this.endc=0;
	},
	canfire: function() {
	    var r=this.gethitrangeallunits();
	    var b= ((this.endc==0&&this.hasfired==0)||(this.hasfired==1&&this.endc==1))&&(this.hasdoubledfired<round-1)&&((r[1].length>0||r[2].length>0||r[3].length>0)&&!this.iscloaked&&!this.isfireobstructed());
	    //log("[canfire]"+this.name+" "+b+"="+this.hasfired+"& r=["+r[1].length+", "+r[2].length+", "+r[3].length+"] &"+this.iscloaked+" &"+this.ocollision.overlap)
	    return b;
	},
        endcombatphase: function() {
	    this.endc++;
	    //this.log("fired:"+this.hasfired+" hasdamaged"+this.hasdamaged+" doubledfired:"+this.hasdoubledfired+"/"+(round-1)+" canfire?"+this.canfire());
	    if (this.canfire()) {
		//Unit.prototype.endcombatphase.call(this);
		var old=activeunit;
		activeunit=this;
		if (old!=this) {
		    this.select();
		    old.unselect();
		}
		this.log("new attack possible (no attack next turn)");
		this.hasdamaged=false;
		this.doattack(true);
	    } else {
		if (this.hasfired==2&&this.hasdamaged) {
		    this.hasdoubledfired=round;
		    this.log("no attack next turn");
		} else this.log("can attack next turn");
		this.endc=0;
		this.hasdamaged=false;
		this.hasfired=0;
		Unit.prototype.endcombatphase.call(this);
	    }
	},
        unique: true,
        unit: "E-Wing",
        skill: 8,
        points: 35,
        upgrades: [
            "Elite",
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Sigma Squadron Pilot",
        faction:"EMPIRE",
        done:true,
        
        unit: "TIE Phantom",
        skill: 3,
        points: 25,
        upgrades: [
            "System",
            "Crew",
        ],
    },
    {
        name: "Shadow Squadron Pilot",
        done:true,
        faction:"EMPIRE",
        
        unit: "TIE Phantom",
        skill: 5,
        points: 27,
        upgrades: [
            "System",
            "Crew",
        ],
    },
    {
        name: "'Echo'",
        faction:"EMPIRE",
	done:true,
	getdecloakmatrix: function(m) {
	    var i=0;
	    var m0=this.getpathmatrix(m,"BL2");
	    var m1=this.getpathmatrix(m,"BR2");
	    var p=[m0,m1];
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
        upgrades: [
            "Elite",
            "System",
            "Crew",
        ],
    },
    {
        name: "'Whisper'",
        faction:"EMPIRE",
	done:true,
	resolvedamage:function() {
	    var ch=targetunit.evadeattack(this);
	    Unit.prototype.resolvedamage.call(this);
	    if (ch.c+ch.h>0) {
		this.log("+1 <code class='xfocustoken'></code>");
		this.addfocustoken();
	    }
	},
        unique: true,
        unit: "TIE Phantom",
        skill: 7,
        points: 32,
        upgrades: [
            "Elite",
            "System",
            "Crew",
        ],
    },
    {
        name: "Wes Janson",
	done:true,
	endattack:function(c,h) {
	    if (targetunit.targeting.length+targetunit.focus+targetunit.evade>0)
		this.log("remove token from "+targetunit.name);
	    if (targetunit.targeting.length>0) targetunit.removetarget(targetunit.targeting[0]);
	    else if (targetunit.focus>0) targetunit.removefocustoken();
	    else if (targetunit.evade>0) targetunit.removeevadetoken();
	    Unit.prototype.endattack.call(this,c,h);
	},
	faction:"REBEL",
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 29,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Jek Porkins",
	done:true,
	addstress:function() {
	    // Automatic removal of stress
	    var r=Math.floor(Math.random()*8);
	    var roll=FACE[ATTACKDICE[r]];
	    this.log("remove 1 stress token, roll 1 attack dice")
	    if (roll=="hit") { this.resolvehit(1); this.checkdead(); }
	},
	faction:"REBEL",
        unique: true,
        unit: "X-Wing",
        skill: 7,
        points: 26,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "'Hobbie' Klivian",
	faction:"REBEL",
	done:true,
        removetarget: function(t) {
	    if (this.stress) { 	    
		this.log("using target -> removes a stress token");
		this.removestresstoken();
	    }
	    Unit.prototype.removetarget.call(this,t);
	},
        addtarget: function(t) {
	    if (this.stress) { 
		this.removestresstoken();
		this.log("targeting -> removes a stress token");
	    }
	    Unit.prototype.addtarget.call(this,t);
	},
        unique: true,
        unit: "X-Wing",
        skill: 5,
        points: 25,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Tarn Mison",
	done:true,
        isattackedby: function(w,a) {
	    if (this.target==0||this.skill<a.skill) { // Priority to define
		this.log("free target token on "+a.name);
		this.addtarget(a);
	    }
	},
	faction:"REBEL",
        
        unique: true,
        unit: "X-Wing",
        skill: 3,
        points: 23,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Jake Farrell",
       	faction:"REBEL",
	done:true,
        freemove: function() {
	    return this.doaction([this.newaction(this.resolveboost,"BOOST"),
				  this.newaction(this.resolveroll,"ROLL")],
				 "free boost or barrel roll action");
	},
	addfocustoken: function() {
	    if (this.candoaction()) this.freemove();
	    Unit.prototype.addfocustoken.call(this);
	},
	usefocus: function(id) {
	    this.log("usefocus");
	    Unit.prototype.usefocus.call(this,id);
	    this.show();
	    if (this.candoaction()) {
		this.log("freemove");
		this.freemove();
	    }
	},
        unique: true,
        unit: "A-Wing",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
            "Missile",
        ],
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
	faction:"REBEL",
        unique: true,
        unit: "A-Wing",
        skill: 5,
        points: 22,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Keyan Farlander",
	faction:"REBEL",
	done:true,
	init: function() {
	    this.shipimg="b-wing-1.png";
	},
        usestress: function() {
	    if (phase==COMBAT_PHASE&&this.hasfired>0&&this==activeunit) {
		if (this==activeunit&&this.stress>0) {
		    this.removestresstoken();
		    var l=$(".focusreddice").length;
		    $(".focusreddice").remove();
		    for (i=0; i<l; i++) { 	
			$("#attack").append("<td class='hitreddice'></td>");
		    }
		    this.log("focus -> hit, removing all stress");
		    $("#atokens .xstresstoken").remove();
		} 
	    }
	},
        unique: true,
        unit: "B-Wing",
        skill: 7,
        points: 29,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Nera Dantels",
	faction:"REBEL",
	done:true,
	init: function() {
	    this.shipimg="b-wing-1.png";
	},
        isTurret: function(w) {
	    if (w.type=="Torpedo") {
		this.log("can fire torpedos at 360 degrees");
		return true;
	    }
	    return false;
	},
        unique: true,
        unit: "B-Wing",
        skill: 5,
        points: 26,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },

    {
        name: "Wild Space Fringer",
        done:true,
	faction:"REBEL",
        
        unit: "YT-2400",
        skill: 2,
        points: 30,
        upgrades: [
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: "Eaden Vrill",
	done:true,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		if (sh.stress>0&&this.weapons[w].isprimary) { 
		    this.log("+1 attack roll against "+sh.name);
		    return a+1;
		}
		return a;
	    }.bind(this);
	},
        
	faction:"REBEL",
        
        unit: "YT-2400",
        unique: true,
        skill: 3,
        points: 32,
        upgrades: [
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: "'Leebo'",
	faction:"REBEL",
	done:true,
        applycritical: function(n) {
	    var j,s;
	    for (j=0; j<n; j++) {
		var s1=this.selectdamage(true);
		CRITICAL_DECK[s1].count--;
		var s2=this.selectdamage(true);
		CRITICAL_DECK[s2].count--;
		var sc=[s1,s2];
		this.log("<b>select one out of 2 criticals</b>");
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
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: "Dash Rendar",
	faction:"REBEL",
        unit: "YT-2400",
        unique: true,
        skill: 7,
	done:true,
	getocollisions: function(mbegin,mend,path,len) { 
	    //this.log("dash rendar getocollision");
	    return {overlap:-1,template:0};
	},
        points: 36,
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: "Patrol Leader",
        
        faction:"EMPIRE",
	done:true,
        unit: "VT-49 Decimator",
        skill: 3,
        points: 40,
        upgrades: [
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Captain Oicunn",
        faction:"EMPIRE",
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
		    this.log("touching "+u.name+" -> 1 <code class='hit'></code>");
		    u.resolvehit(1);
		    u.checkdead();
		}
	    }
	    Unit.prototype.resolvecollision.call(this);
	},
        upgrades: [
            "Elite",
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Commander Kenkirk",
        faction:"EMPIRE",
        getagility: function() {
	    if (this.shield==0&&this.hull<this.ship.hull) return this.agility+1;
	    return this.agility;
	},
	done:true,
        unit: "VT-49 Decimator",
        skill: 6,
        points: 44,
        unique: true,
        upgrades: [
            "Elite",
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Rear Admiral Chiraneau",
        init:  function() {
	    this.addattackmoda(this,function(m,n) {
		return  (this.getrange(targetunit)<=2);
	    }.bind(this),function(m,n) {
		var f=Math.floor(m/100)%10;
		if (f>0) {
		    this.log("1 <code class='xfocustoken'></code> -> 1 <code class='critical'></code>");
		    return m+99;
		}
		return m;
	    }.bind(this),false,"hit");
	},        

        faction:"EMPIRE",
        unit: "VT-49 Decimator",
        skill: 8,
        points: 46,
	done:true,
        unique: true,
        upgrades: [
            "Elite",
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Prince Xizor",
        faction:"SCUM",
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
		    this.log("1 critical transferred to "+p[0].name);
		    return ch-10;
		} 
		p[0].resolvehit(1);
		p[0].checkdead();
		this.log("1 hit transferred to "+p[0].name);
		return ch-1;
	    }
	    return ch;
	},
        unique: true,
	done:true,
        unit: "StarViper",
        skill: 7,
        points: 31,
        upgrades: [
            "Elite",
            "Torpedo",
        ],
    },
    {
        name: "Guri",
        faction:"SCUM",
	/* TODO : may only do the action */
	begincombatphase: function() {
	    if (!this.dead) {
		var p=this.gettargetableunits(1);
		if (p.length>0) {
		    this.log("+1 <code class='xfocustoken'></code>, ennemy at range 1");
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
        upgrades: [
            "Elite",
            "Torpedo",
        ],
    },
    {
        name: "Black Sun Vigo",
        faction:"SCUM",
        done:true,
        unit: "StarViper",
        skill: 3,
        points: 27,
        upgrades: [
            "Torpedo",
        ],
    },
    {
        name: "Black Sun Enforcer",
        faction:"SCUM",
        done:true,
        
        unit: "StarViper",
        skill: 1,
        points: 25,
        upgrades: [
            "Torpedo",
        ],
    },
    {
        name: "Serissu",
        faction:"SCUM",
	done:true,
        init: function() {
	    this.adddefensererolld(
		this,
		["blank","focus"],
		function() { return 1 },
		function(attacker,w,defender) {
		    // Serissu dead ? 
		    if (this.dead) return false;
		    if (defender!=this&&defender.getrange(this)==1&&defender.team==this.team) {
			defender.log("+1 reroll from "+this.name);
			return true;
		    }
		    return false;
		}.bind(this),
		true
	    )
	},
        unit: "M3-A Interceptor",
        skill: 8,
        points: 20,
        unique: true,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Laetin A'shera",
        faction:"SCUM",
        endbeingattacked: function(c,h) {
	    Unit.prototype.endbeingattacked.call(this,c,h);
	    if (c+h==0) {
		this.log("no hit, +1 <code class='xevadetoken'></code>");
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
        faction:"SCUM",
        done:true,
        unit: "M3-A Interceptor",
        skill: 5,
        points: 17,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Cartel Spacer",
        faction:"SCUM",
        done:true,
        unit: "M3-A Interceptor",
        skill: 2,
        points: 14,
        upgrades: [ ],
    },
    {
        name: "IG-88A",
	faction:"SCUM",
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
	endattack: function(c,h) {
	    Unit.prototype.endattack.call(this,c,h);
	    if (targetunit.hull<=0&&(this.shield<this.ship.shield)) {
		this.shield++;
		this.showstats();
		this.log("+1 <code class='cshield'></code> for a kill");
	    }
	},
	done:true,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "IG-88B",
	faction:"SCUM",/*
        init: function() {
	    var i;
	    for (i=0; i<sh.weapons.length; i++) if (sh.weapons[i].type=="Cannon") break;
	    if (i==sh.weapons.length) return;
	    sh.endattack=function(c,h) {
		var i;
		Unit.prototype.endattack.call(this,c,h);
		for (i=0; i<this.weapons.length; i++) if (this.weapons[i].type=="Cannon") break;
		
		if (i<this.weapons.length&&this.hasfired<2) {
		    log("[IG-88B] "+this.name+" attacks again with secondary weapon");
		    //waitingforaction.add(function(){ 
		    this.selecttargetforattack(i);//}.bind(this))
		} 

	    };
	},
	done:true,*/
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "IG-88C",
	faction:"SCUM",
        resolveboost: function(n) {
	    Unit.prototype.resolveboost.call(this,n);
	    this.doaction([this.newaction(this.addevade,"EVADE")],"free evade action");
	},
        done:true,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "IG-88D",
	faction:"SCUM",  
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial=="SL3") {
		this.log("pick a Sengor turn");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,"SL3"),
		     this.getpathmatrix(this.m,"TL3").rotate(180,0,0)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,dial,"TL3",difficulty);
		    }.bind(this),false,true);
	    } else if (dial=="SR3") {
		this.log("pick a Sengor turn");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,"SR3"),
		     this.getpathmatrix(this.m,"TR3").rotate(180,0,0)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realpath,difficulty);
			else Unit.prototype.completemaneuver.call(this,dial,"TR3",difficulty);
		    }.bind(this),false,true);
	    } else Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
	},
        unique: true,
	done:true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "N'Dru Suhlak",
        unique: true,
	done:true,
	faction:"SCUM",
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		var p=this.selectnearbyunits(2,function(a,b) {return a.team==b.team&&a!=b });
		if (p.length==0) {
		    this.log("+1 attacking "+sh.name+" at range >=3 of friendly ships");
		    return a+1;
		} return a;
	    }.bind(this);
	},
        unit: "Z-95 Headhunter",
        skill: 7,
        points: 17,
        upgrades: [
            "Elite",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Kaa'To Leeachos",
        unique: true,
	faction:"SCUM",
	done:true,
        begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(2,function(a,b) {return a.team==b.team&&a!=b });
		if (p.length>0) {
		    this.doselection(function(n) {
			p.push(this)
			this.log("<b>select a focus/evade token to take (self to cancel)</b>");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) { 
				if (p[k].evade>0) { 
				    p[k].removeevadetoken(); this.addevadetoken(); 
				    this.log("evade taken from "+p[k].name);
				} else if (p[k].focus>0) { 
				    p[k].removefocustoken(); this.addfocustoken(); 
				    this.log("focus taken from "+p[k].name);
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
        upgrades: [
            "Elite",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Black Sun Soldier",
        faction:"SCUM",
        done:true,
        unit: "Z-95 Headhunter",
        skill: 3,
        points: 13,
        upgrades: [
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Binayre Pirate",
	faction:"SCUM",
        done:true,        
        unit: "Z-95 Headhunter",
        skill: 1,
        points: 12,
        upgrades: [
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Boba Fett",
	faction:"SCUM",
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
				  function(w,defender) { return true; },
				  false
				 );
	    this.adddefensererolld(this,
				   ["blank","focus"], 
				   nrerolls, 
				   function(w,defender) { return true; },
				   false
				  );
	},
	done:true,
        unique: true,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Kath Scarlet",
	done:true,
        getattackstrength:  function(w,sh) {
	    var a=Unit.prototype.getattackstrength.call(this,w,sh);
	    var m=this.m.clone();
	    this.m.rotate(180,0,0);
	    if (this.isinfiringarc(sh)) { 
		this.log("+1 attack roll against "+sh.name+" in auxiliary arc");
		a=a+1;
	    }
	    this.m=m;
	    return a;
	},
        unique: true,
	faction:"SCUM",      
        unit: "Firespray-31",
        skill: 7,
        points: 38,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Emon Azzameen",
	done:true,
	unique:true,
	getbomblocation:function() {  return ["F1","TL3","TR3","F3"]; },
	faction:"SCUM",
        unit: "Firespray-31",
        skill: 6,
        points: 36,
        upgrades: [
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Mandalorian Mercenary",
	faction:"SCUM",       
        done:true,
        unit: "Firespray-31",
        skill: 5,
        points: 35,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
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
		    this.log("+1 attack roll against "+sh.name+" outside firing arc");
		    return a+1;
		}
		return a;
	    }.bind(this);
	},       
	faction:"SCUM",     
        unit: "Y-Wing",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged",
        ],
    },
    {
        name: "Drea Renthal",
        unique: true,
	faction:"SCUM",
        unit: "Y-Wing",
        skill: 5,
	done:true,
	removetarget: function(t) {
	    var p=this.gettargetableunits(3);
	    if (p.length>0) {
		p.push(this);
		this.doselection(function(n) {
		    this.log("<b>select new target to lock at the cost of 1 stress (self to cancel)</b>");
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
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged",
        ],
    },
    {
        name: "Hired Gun",
	faction:"SCUM",
	done:true,
        unit: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged",
        ],
    },
    {
        name: "Syndicate Thug",
	faction:"SCUM",
	done:true,
        unit: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged",
        ],
    },
    {
        name: "Dace Bonearm",
        unique: true,
	faction:"SCUM",
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
		    unit.log("+1 stress for +1 <code class='hit'></code> to "+this.name);
		    this.checkdead();
		}
	    }
},
        skill: 7,
        points: 23,
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
            "Illicit",
        ],
    },
    {
        name: "Palob Godalhi",
        unique: true,
	faction:"SCUM",
        unit: "HWK-290",
        begincombatphase: function() {
	    if (!this.dead) {
		var p=this.selectnearbyunits(2,function(a,b) {return a.team!=b.team; });
		if (p.length>0) {
		    this.doselection(function(n) {
			p.push(this)
			this.log("<b>select a focus/evade token to take (self to cancel)</b>");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) { 
				if (p[k].evade>0) { 
				    p[k].removeevadetoken(); this.addevadetoken(); 
				    this.log("evade taken from "+p[k].name);
				} else if (p[k].focus>0) { 
				    p[k].removefocustoken(); this.addfocustoken(); 
				    this.log("focus taken from "+p[k].name);
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
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
            "Illicit",
        ],
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
			this.log("<b>select a pilot to set its skill to 0.</b>");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				var ecp=p[k].ecp;
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
	faction:"SCUM",
        unit: "HWK-290",
        skill: 3,
        points: 19,
        upgrades: [
            "Turret",
            "Crew",
            "Illicit",
        ],
    },
    {
        name: "Spice Runner",
	faction:"SCUM",
	done:true,
        unit: "HWK-290",
        skill: 1,
        points: 16,
        upgrades: [
            "Turret",
            "Crew",
            "Illicit",
        ],
    },
    {
        name: "Commander Alozen",
        faction:"EMPIRE",
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
		    this.log("<b>select target to lock (self to cancel)</b>");
		    this.resolveactionselection(p,function(k) {
			if (this!=p[k]) {
			    this.addtarget(p[k]);
			    this.log("target locks "+p[k].name);
			}
			this.endnoaction(n,"TARGET");
		    }.bind(this));
		} else this.endnoaction(n,"TARGET");
	    }.bind(this));
	    return Unit.prototype.begincombatphase.call(this);
	},
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Juno Eclipse",
        unique: true,
	done:true,
        faction:"EMPIRE",
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
	    this.log("<b>choose speed for maneuver</b>");
	    this.resolveactionmove(p,function(t,k) {
		Unit.prototype.completemaneuver.call(t,dial,q[k],difficulty);
	    },false,true);
	},
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Zertik Strom",
        unique: true,
	done:true,
        faction:"EMPIRE",
	unit: "TIE Advanced",
        skill: 6,
	init: function() {
	    var unit=this;
	    this.gras=Weapon.prototype.getrangeattackbonus;
	    Weapon.prototype.getrangeattackbonus=function(sh) {
		if (this.unit.team!=unit.team&&unit.getrange(this.unit)==1) {
		    unit.log("no attack range bonus for "+this.unit.name);
		    return 0;
		}
		return this.unit.gras.call(this,sh);
	    };
	    this.grds=Weapon.prototype.getrangedefensebonus;
	    Weapon.prototype.getrangedefensebonus=function(sh) {
		if (this.unit.team!=unit.team&&unit.getrange(this.unit)==1) {
		    unit.log("no defense range bonus due to "+this.unit.name);
		    return 0;
		}
		return this.unit.grds.call(this,sh);
	    };
	},
        points: 26,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Lieutenant Colzet",
        unique: true,
        faction:"EMPIRE",
	unit: "TIE Advanced",
        skill: 3,
        points: 23,
        upgrades: [
            "Elite",
            "Missile",
        ],
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
        faction: "SCUM",
        unit: "YV-666",
        unique: true,
        skill: 7,
        points: 35,
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
            "Crew",
            "Crew",
            "Crew",
            "Illicit"
        ]
    },
    {
        name: "Moralo Eval",
        faction: "SCUM",
        unit: "YV-666",
        unique: true,
        skill: 6,
        points: 34,
        upgrades: [
            "Cannon",
            "Missile",
            "Crew",
            "Crew",
            "Crew",
            "Illicit"
        ]
    },
    {
        name: "Latts Razzi",
        faction: "SCUM",
        unit: "YV-666",
        unique: true,
        skill: 5,
        points: 33,
        upgrades: [
            "Cannon",
            "Missile",
            "Crew",
            "Crew",
            "Crew",
            "Illicit"
        ]
    },
    {
        name: "Trandoshan Slaver",
        faction: "SCUM",
        unit: "YV-666",
	done:true,
        skill: 2,
        points: 29,
        upgrades: [
            "Cannon",
            "Missile",
            "Crew",
            "Crew",
            "Crew",
            "Illicit"
        ]
    },
    {
        name: "Talonbane Cobra",
        unique: true,
        faction: "SCUM",
        unit: "Kihraxz Fighter",
        skill: 9,
        upgrades: [
            "Elite",
            "Missile",
            "Illicit",
        ],
	done:true,
	getattackbonus: function(sh) {
	    var att=this.weapons[i].getattack();
	    return att+2*this.weapons[i].getrangeattackbonus(sh);
	},
	getdefensestrength: function(i,sh) {
	    var def=this.getagility();
	    var obstacledef=sh.getobstructiondef(this);
	    if (obstacledef>0) this.log("+"+obstacledef+" defense for obstacle");
	    return def+2*sh.weapons[i].getrangedefensebonus(this)+obstacledef;
	},
        points: 28,
    },
    {
        name: "Graz the Hunter",
        unique: true,
        faction: "SCUM",
        unit: "Kihraxz Fighter",
        skill: 6,
            upgrades: [
                "Missile",
                "Illicit",
            ],
	getattackstrength: function(i,sh) {
	    var a=0;
	    if (this.isinfiringarc(sh)) {
		a=1;
		this.log("+1 attack die for attacking "+sh.name+" in firing arc");
	    }
	    return Unit.prototype.getattackstrength.call(this,i,sh)+a;
	},
	done:true,
        points: 25
    },
    {
        name: "Black Sun Ace",
        faction: "SCUM",
        unit: "Kihraxz Fighter",
	done:true,
            skill: 5,
            upgrades: [
                "Elite",
                "Missile",
                "Illicit",
            ],
            points: 23
        },
        {
            name: "Cartel Marauder",
	    done:true,
            faction: "SCUM",
            unit: "Kihraxz Fighter",
            skill: 2,
            upgrades: [
                "Missile",
                "Illicit",
            ],
            points: 20
        },
        {
            name: "Miranda Doni",
            unique: true,
            faction: "REBEL",
            unit: "K-Wing",
            skill: 8,
            upgrades: [
                "Turret",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Crew",
                "Bomb",
                "Bomb",
            ],
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
			this.actionr[n].resolve("SHIELD");
		    }.bind(this)},
		    {org:this,name:this.name,type:"HIT",action:function(n) {
			this.log("action "+n);
			this.getattackstrength=function(i,sh){
			    return 1+Unit.prototype.getattackstrength.call(this,i,sh);
			};
			this.removeshield(1); 
			this.endattack=function(c,h) {
			    this.getattackstrength=Unit.prototype.getattackstrength;
			    this.endattack=Unit.prototype.endattack;
			    Unit.prototype.endattack.call(this,c,h);
			};
			this.log("calling noaction "+n);
			this.actionr[n].resolve("HIT");
		    }.bind(this)}],"choose to add shield/roll 1 fewer die or remove shield/roll 1 additional die");
	    },
            points: 29,
        },
        {
            name: "Esege Tuketu",
            unique: true,
            faction: "REBEL",
            unit: "K-Wing",
            skill: 6,
            upgrades: [
                "Turret",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Crew",
                "Bomb",
                "Bomb",
            ],
            points: 28
        },
        {
            name: "Guardian Squadron Pilot",
            faction: "REBEL",
	    done:true,
            unit: "K-Wing",
            skill: 4,
            upgrades: [
                "Turret",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Crew",
                "Bomb",
                "Bomb",
            ],
            points: 25
        },
        {
            name: "Warden Squadron Pilot",
            faction: "REBEL",
	    done:true,
            unit: "K-Wing",
            skill: 2,
            upgrades: [
                "Turret",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Crew",
                "Bomb",
                "Bomb",
            ],
            points: 23
        },
        {
            name: "'Redline'",
            unique: true,
            faction: "EMPIRE",
            unit: "TIE Punisher",
            skill: 7,
            upgrades: [
                "System",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Missile",
                "Bomb",
                "Bomb",
            ],
            points: 27
        },
        {
            name: "'Deathrain'",
            unique: true,
            id: 144,
            faction: "EMPIRE",
            unit: "TIE Punisher",
            skill: 6,
            upgrades: [
                "System",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Missile",
                "Bomb",
                "Bomb",
            ],
            points: 26
        },
        {
            name: "Black Eight Squadron Pilot",
            faction: "EMPIRE",
	    done:true,
            id: 145,
            unit: "TIE Punisher",
            skill: 4,
            upgrades: [
                "System",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Missile",
                "Bomb",
                "Bomb",
            ],
            points: 23
        },
        {
            name: "Cutlass Squadron Pilot",
            faction: "EMPIRE",
	    done:true,
            id: 146,
            unit: "TIE Punisher",
            skill: 2,
            upgrades: [
                "System",
                "Torpedo",
                "Torpedo",
                "Missile",
                "Missile",
                "Bomb",
                "Bomb",
            ],
            points: 21
        },

];

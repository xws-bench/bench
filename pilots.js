var REBEL="Rebel Alliance",EMPIRE="Galactic Empire",SCUM="Scum and Villainy";

function Pilot(name) {
    var i;
    var id=PILOT_dict[name];
    for (i=0; i<PILOTS.length; i++) {
	if (PILOTS[i].name==id) {
	    var p=new Unit(PILOTS[i]);
	    p.id=name;
	    if (!p.unique) { p.id=""+p.id+(globalid++); }
	    if (p.init != undefined) p.init();
	    return p;
	}
    }
    console.log("Could not find pilot "+name);
}


var PILOTS = [
    {
        name: "Wedge Antilles",       
        unique: true,
	faction:"REBEL",
        ship: "X-Wing",
        skill: 9,
	init: function() {
	    var ds=Unit.prototype.getdefensestrength;
	    Unit.prototype.getdefensestrength=function(w,sh) {
		var defense=ds.call(this,w,sh);
		if (sh.name=="Wedge Antilles"&&defense>0) {
		    log("["+sh.name+"] defense reduced from "+defense+" to "+(defense-1)+" for "+this.name);
		    return defense-1; 
		}
		else return defense;
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
	faction:"REBEL",
        unique: true,
        ship: "X-Wing",
	resolvefocus: function() {
	    this.focus--;
	    var p=[]; 
	    var i;
	    for (i=0; i<squadron.length; i++) {
		if (squadron[i].faction==this.faction
		    &&this!=squadron[i]
		    &&this.getrange(squadron[i])<=2) {
		    p.push(squadron[i]);
		}
	    }
	    this.show();
	    waitingforaction=true;
	    log("["+this.name+"] focus -> other friendly ship");
	    this.resolveactionselection(p,function(k) {
		waitingforaction=false;
		log(p[k].name+"  selected by Garven");
		p[k].focus++;p[k].show();  });
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
        ship: "X-Wing",
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
        ship: "X-Wing",
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
        init: function() {
	    var ghr=Unit.prototype.gethitrangeallunits;
	    Unit.prototype.gethitrangeallunits=function() {
		var r=ghr.call(this);
		var newr=[[],[],[],[],[]];
		for (i=1; i<r.length; i++) {
		    for (j=0; j<r[i].length; j++) {
			if (squadron[r[i][j].unit].name=="Biggs Darklighter") {
			    log("[Biggs Darklighter] is the target");
			    newr[i][0]=r[i][j]; // return only Biggs...
			    return newr;
			}
		    }
		}
		return r;
	    }
	},
        unique: true,
        ship: "X-Wing",
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
	faction:"REBEL",
	getdefensetable: function(n) {
	    var f,e;
	    var p=[];
	    log("["+this.name+"] modified defense table: 1 focus=>evade");
	    for (f=0; f<=n; f++) 
		for (e=0; e<=n-f; e++)
		    p[f*10+e]=0;
	    for (f=0; f<=n; f++) 
		for (e=0; e<=n-f; e++) {
		    p[f+e]+=DEFENSE[n][f*10+e];
		}
	    return p;
	},
        unique: true,
        ship: "X-Wing",
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
	faction:"REBEL",
        ship: "Y-Wing",
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
        
        
	faction:"REBEL",
        unique: true,
        ship: "Y-Wing",
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
        
        
	faction:"REBEL",
        unique: true,
        ship: "Y-Wing",
        skill: 8,
        points: 25,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Gold Squadron Pilot",
        ship: "Y-Wing",
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
        ship: "TIE Fighter",
        faction:"EMPIRE",
        skill: 1,
        points: 12,
        upgrades: [],
    },
    {
        name: "Obsidian Squadron Pilot",
        ship: "TIE Fighter",
        faction:"EMPIRE",
        skill: 3,
        points: 13,
        upgrades: [],
    },
    {
        name: "Black Squadron Pilot",
        ship: "TIE Fighter",
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
	    var a=this.getattacktable;
	    this.getattacktable=function(n) {
		var i,f,h,c;
		var p=[];
		var result=ar.call(this,n);
		if (this.gethitrange(0,targetunit)==1) {
		    for (f=0; f<=n; f++) 
			for (h=0; h<=n-f; h++)
			    for (c=0; c<=n-f-h; c++) 
				p[f*100+h+c*10]=0;
		    for (f=0; f<=n; f++) 
			for (h=0; h<=n-f; h++)
			    for (c=0; c<=n-f-h; c++) {
				i=f*100+h+c*10;
				if (h>0) p[i+9]+=result[i];
				else p[i]+=result[i];
			    }
		    return p;
		} else return result;
	    }.bind(this);
	},        
        unique: true,
        ship: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: "'Night Beast'",
        faction:"EMPIRE",
        init: function () {
	    var r=this.handledifficulty;
	    this.handledifficulty=function(difficulty) {
		r.call(this,difficulty);
		if (difficulty=="GREEN") {
		    log("["+this.name+"] green maneuver -> free focus action");
		    this.addfocus();
		}
	    }.bind(this);
	},
        unique: true,
        ship: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: "'Backstabber'",
        unique: true,
        faction:"EMPIRE",
	init: function() {
	    this.getattackstrength=function(w,sh) {
		var a=Unit.prototype.getattackstrength.call(this,w,sh);
		if (sh.gethitsector(this)>3) {
		    a=a+1;
		    log("["+this.name+"] "+a+" attack dices against "+sh.name);
		}
		return a;
	    }.bind(this);
	},
        ship: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: "'Dark Curse'",
        faction:"EMPIRE",
        unique: true,
        ship: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: "'Mauler Mithel'",
        faction:"EMPIRE",
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		if (this.gethitrange(w,sh)==1) { 
		    a=a+1;
		    log("["+this.name+"] +1 attack dice when attacking "+sh.name);
		}
		return a;
	    }.bind(this);
	},
        unique: true,
        ship: "TIE Fighter",
        skill: 7,
        points: 17,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "'Howlrunner'",
        unique: true,
        faction:"EMPIRE",
        ship: "TIE Fighter",
        skill: 8,
	init: function() {
	    ar=Unit.prototype.getattacktable;
	    Unit.prototype.getattacktable=function(n) {
		var i;
		var sh;
		var result=ar(n);
		for (i=0; i<squadron.length; i++) 
		    if (squadron[i].name=="'Howlrunner'") break;
		// Howlrunner dead ? 
		if (i==squadron.length) return result;
		var howlrunner=squadron[i];
		if (this!=howlrunner&&this.getrange(howlrunner)==1&&this.faction==howlrunner.faction) {
		    var p;
		    this.reroll=1;
		    p=attackwithreroll(this,result,n);
		    log("["+howlrunner.name+"] 1 reroll for "+this.name);
		    return p;
		}
		return result;
	    }
	},
        points: 18,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Maarek Stele",
        unique: true,
        faction:"EMPIRE",
	ship: "TIE Advanced",
        skill: 7,
        points: 27,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Tempest Squadron Pilot",
        faction:"EMPIRE",
        ship: "TIE Advanced",
        skill: 2,
        points: 21,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Storm Squadron Pilot",
        faction:"EMPIRE",
        ship: "TIE Advanced",
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
        ship: "TIE Advanced",
        skill: 9,
        points: 29,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Alpha Squadron Pilot",
        faction:"EMPIRE",
        ship: "TIE Interceptor",
        skill: 1,
        points: 18,
        upgrades: [ ],
    },
    {
        name: "Avenger Squadron Pilot",
        faction:"EMPIRE",
        ship: "TIE Interceptor",
        skill: 3,
        points: 20,
        upgrades: [ ],
    },
    {
        name: "Saber Squadron Pilot",
        faction:"EMPIRE",
        ship: "TIE Interceptor",
        skill: 4,
        points: 21,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "'Fel's Wrath'",
        faction:"EMPIRE",
        unique: true,
        ship: "TIE Interceptor",
	skill: 5,
        points: 23,
        upgrades: [ ],
    },
    {
        name: "Turr Phennir",
        faction:"EMPIRE",
        unique: true,
        ship: "TIE Interceptor",
        skill: 7,
	cleancombat: function() {
	    Unit.prototype.cleancombat.call(this);
	    console.log("["+this.name+"] free boost or roll action");
	    var m0=this.getpathmatrix(this.m.clone().add(MR(90,0,0)).add(MT(0,(this.islarge?-20:0))),"F1").add(MR(-90,0,0)).add(MT(0,-20));
	    var m1=this.getpathmatrix(this.m.clone().add(MR(-90,0,0)).add(MT(0,(this.islarge?-20:0))),"F1").add(MR(90,0,0)).add(MT(0,-20));
	    this.resolveactionmove(
		[m0.clone().add(MT(0,0)),
		 m0.clone().add(MT(0,20)),
		 m0.clone().add(MT(0,40)),
		 m1.clone().add(MT(0,0)),
		 m1.clone().add(MT(0,20)),
		 m1.clone().add(MT(0,40)),
		 this.m,
		 this.getpathmatrix(this.m.clone(),"F1"),
		 this.getpathmatrix(this.m.clone(),"BL1"),
		 this.getpathmatrix(this.m.clone(),"BR1")],
		function(t) {
		    t.show();
		});
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
        addstress: function () {
	    this.stress++;
	    log("["+this.name+"] stress -> free focus action");
	    this.focus++;
	    this.show();
	},
        ship: "TIE Interceptor",
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
        updateactionlist:function() {
	    if (this.collision>0) {
		this.actionList=["NOTHING"];
	    } else {
		this.actionList=this.ship.actionList.slice(0);
		this.actionList.push("NOTHING");
	    }
	},
        ship: "A-Wing",
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
        ship: "A-Wing",
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
        ship: "A-Wing",
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
        ship: "A-Wing",
        skill: 1,
        points: 17,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Outer Rim Smuggler",
	faction:"REBEL",
        ship: "YT-1300",
	init: function() {
	    this.weapons[0].fire=2;
	    this.hull=6;
	    this.shield=4;
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
	faction:"REBEL",
        ship: "YT-1300",
        skill: 5,
        points: 42,
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
        name: "Lando Calrissian",
	faction:"REBEL",
        unique: true,
        ship: "YT-1300",
        skill: 7,
        points: 44,
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
	faction:"REBEL",
        ship: "YT-1300",
        skill: 9,
        points: 46,
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
        name: "Kath Scarlet",
        unique: true,
        faction:"EMPIRE",
        ship: "Firespray-31",
        skill: 7,
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
        faction:"EMPIRE",
        ship: "Firespray-31",
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
        faction:"EMPIRE",
        ship: "Firespray-31",
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
        ship: "Firespray-31",
        skill: 3,
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
        ship: "B-Wing",
        skill: 8,
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
	faction:"REBEL",
        ship: "B-Wing",
        skill: 6,
        points: 28,
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
        ship: "B-Wing",
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
        ship: "B-Wing",
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
        ship: "HWK-290",
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
        ship: "HWK-290",
        skill: 4,
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
        ship: "HWK-290",
        skill: 6,
        points: 21,
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
        ship: "HWK-290",
        skill: 8,
        points: 25,
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Scimitar Squadron Pilot",
        
        
        ship: "TIE Bomber",
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
        
        
        ship: "TIE Bomber",
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
        
        
        unique: true,
        ship: "TIE Bomber",
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
        faction:"EMPIRE",
        
        
        unique: true,
        ship: "TIE Bomber",
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
        ship: "Lambda-Class Shuttle",
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
        
        
        unique: true,
        ship: "Lambda-Class Shuttle",
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
        ship: "Lambda-Class Shuttle",
        skill: 4,
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
        
        
        ship: "Lambda-Class Shuttle",
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
        ship: "TIE Interceptor",
        skill: 5,
        points: 23,
        upgrades: [ ],
    },
    {
        name: "Royal Guard Pilot",
        faction:"EMPIRE",
        
        
        ship: "TIE Interceptor",
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
        ship: "TIE Interceptor",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Kir Kanos",
        faction:"EMPIRE",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 6,
        points: 24,
        upgrades: [ ],
    },
    {
        name: "Carnor Jax",
        faction:"EMPIRE",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 8,
        points: 26,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "GR-75 Medium Transport",
        
	faction:"REBEL",
        
        epic: true,
        ship: "GR-75 Medium Transport",
        skill: 3,
        points: 30,
        upgrades: [
            "Crew",
            "Crew",
            "Cargo",
            "Cargo",
            "Cargo",
        ],
    },
    {
        name: "Bandit Squadron Pilot",
	faction:"REBEL",
        
        
        ship: "Z-95 Headhunter",
        skill: 2,
        points: 12,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Tala Squadron Pilot",
	faction:"REBEL",
        
        
        ship: "Z-95 Headhunter",
        skill: 4,
        points: 13,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Lieutenant Blount",
	faction:"REBEL",
        
        
        unique: true,
        ship: "Z-95 Headhunter",
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
        
        
        unique: true,
        ship: "Z-95 Headhunter",
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
        
        
        ship: "TIE Defender",
        skill: 1,
        points: 30,
        upgrades: [
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Onyx Squadron Pilot",
        
        faction:"EMPIRE",
        
        ship: "TIE Defender",
        skill: 3,
        points: 32,
        upgrades: [
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Colonel Vessery",
        
        faction:"EMPIRE",
        
        unique: true,
        ship: "TIE Defender",
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
        
        unique: true,
        ship: "TIE Defender",
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
        
        ship: "E-Wing",
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
        
        ship: "E-Wing",
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
	faction:"REBEL",
        
        
        unique: true,
        ship: "E-Wing",
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
        
        unique: true,
        ship: "E-Wing",
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
        
        
        ship: "TIE Phantom",
        skill: 3,
        points: 25,
        upgrades: [
            "System",
            "Crew",
        ],
    },
    {
        name: "Shadow Squadron Pilot",
        
        faction:"EMPIRE",
        
        ship: "TIE Phantom",
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
        
        
        unique: true,
        ship: "TIE Phantom",
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
	resolvedamage:function() {
	    var ch=targetunit.ishitbyattack(this);
	    Unit.prototype.resolvedamage.call(this);
	    if (ch.c+ch.h>0) {
		log("["+this.name+"] +1 focus token when hitting "+targetunit.name);
		this.focus++;
	    }
	},
        unique: true,
        ship: "TIE Phantom",
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
	cleancombat:function() {
	    log("["+this.name+"] removing token from "+targetunit.name);
	    if (targetunit.target>0) targetunit.target--;
	    else if (targetunit.focus>0) targetunit.focus--;
	    else if (targetunit.evade>0) targetunit.evade--;
	    Unit.prototype.cleancombat.call(this);
	},
	faction:"REBEL",
        unique: true,
        ship: "X-Wing",
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
	addstress:function() {
	    // Automatic removal of stress
	    var r=Math.floor(Math.random()*7);
	    var roll=FACE[ATTACKDICE[r]];
	    log("["+this.name+"] remove 1 stress token, roll 1 attack dice")
	    if (roll=="hit") { this.resolvehit(1); this.checkdead(); }
	},
	faction:"REBEL",
        unique: true,
        ship: "X-Wing",
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
        usetarget: function() {
	    if (this.stress) { 	    
		log("["+this.name+"] using target -> removes a stress token");
		this.stress--;
	    }
	},
        resolvetarget: function(k) {
	    if (this.stress) { 
		this.stress--;
		log("["+this.name+"] targeting -> removes a stress token");
	    }
	    return Unit.prototype.resolvetarget.call(this,k);
	},
        unique: true,
        ship: "X-Wing",
        skill: 5,
        points: 25,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Tarn Mison",
        ishitbyattack: function(a) {
	    if (this.target==0||this.skill<a.skill) { // Priority to define
		log("["+this.name+"] free target token on "+a.name);
		this.target=1;
		this.targeting=a;
		this.show();
	    }
	},
	faction:"REBEL",
        
        unique: true,
        ship: "X-Wing",
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
        
        unique: true,
        ship: "A-Wing",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Gemmer Sojan",
        
	faction:"REBEL",
        
        unique: true,
        ship: "A-Wing",
        skill: 5,
        points: 22,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Keyan Farlander",
        
	faction:"REBEL",
        
        unique: true,
        ship: "B-Wing",
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
        
        unique: true,
        ship: "B-Wing",
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
        
	faction:"REBEL",
        
        ship: "YT-2400",
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
        
	faction:"REBEL",
        
        ship: "YT-2400",
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
        
        ship: "YT-2400",
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
        
        
        ship: "YT-2400",
        unique: true,
        skill: 7,
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
	
        ship: "VT-49 Decimator",
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
        
        ship: "VT-49 Decimator",
        skill: 4,
        points: 42,
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
        name: "Commander Kenkirk",
        
        faction:"EMPIRE",
        
        ship: "VT-49 Decimator",
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
        
        faction:"EMPIRE",
        
        ship: "VT-49 Decimator",
        skill: 8,
        points: 46,
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
        
        
        unique: true,
        ship: "StarViper",
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
	
        
        unique: true,
        ship: "StarViper",
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
        
        
        ship: "StarViper",
        skill: 3,
        points: 27,
        upgrades: [
            "Torpedo",
        ],
    },
    {
        name: "Black Sun Enforcer",
        faction:"SCUM",
        
        
        ship: "StarViper",
        skill: 1,
        points: 25,
        upgrades: [
            "Torpedo",
        ],
    },
    {
        name: "Serissu",
        faction:"SCUM",
        
        
        ship: "M3-A Interceptor",
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
        
        
        ship: "M3-A Interceptor",
        skill: 6,
        points: 18,
        unique: true,
        upgrades: [ ],
    },
    {
        name: "Tansarii Point Veteran",
        
        faction:"SCUM",
        
        ship: "M3-A Interceptor",
        skill: 5,
        points: 17,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Cartel Spacer",
        faction:"SCUM",
        
        
        ship: "M3-A Interceptor",
        skill: 2,
        points: 14,
        upgrades: [ ],
    },
    {
        name: "IG-88A",
	faction:"SCUM",
        
        
        unique: true,
        ship: "Aggressor",
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
        name: "IG-88B",
	faction:"SCUM",
        
        
        unique: true,
        ship: "Aggressor",
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
        
        
        unique: true,
        ship: "Aggressor",
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
        
        
        unique: true,
        ship: "Aggressor",
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
	faction:"SCUM",
        
        
        ship: "Z-95 Headhunter",
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
        
        ship: "Z-95 Headhunter",
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
        
        ship: "Z-95 Headhunter",
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
        
        
        ship: "Z-95 Headhunter",
        skill: 1,
        points: 12,
        upgrades: [
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Boba Fett (Scum)",
	faction:"SCUM",
        
        
        
        ship: "Firespray-31",
        skill: 8,
        points: 39,
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
        name: "Kath Scarlet (Scum)",
        
        unique: true,
	faction:"SCUM",
        
        
        ship: "Firespray-31",
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
        unique: true,
	faction:"SCUM",
        
        
        ship: "Firespray-31",
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
        
        
        ship: "Firespray-31",
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
        
	faction:"SCUM",
        
        ship: "Y-Wing",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Drea Renthal",
        unique: true,
	faction:"SCUM",
        
        
        ship: "Y-Wing",
        skill: 5,
        points: 22,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Hired Gun",
	faction:"SCUM",
        
        
        ship: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Syndicate Thug",
        
        
        ship: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Dace Bonearm",
        unique: true,
        
	faction:"SCUM",
        
        ship: "HWK-290",
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
        
        
        ship: "HWK-290",
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
        
	faction:"SCUM",
        
        ship: "HWK-290",
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
        
        
        ship: "HWK-290",
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
        
        ship: "TIE Advanced",
        unique: true,
        skill: 5,
        points: 25,
        upgrades: [
            "Elite",
            "Missile",
        ],
    }
];

var REBEL="Rebel Alliance",EMPIRE="Galactic Empire",SCUM="Scum and Villainy";

function Laser(u,type,fire) {
    return new Weapon(u,{
	type: type,
	name:"Laser",
	attack: fire,
	range: [1,3],
	isprimary: true
    });
}

function Weapon(p,wdesc) {
    $.extend(this,wdesc);
    this.unit=p;
}
Weapon.prototype = {
    isinrange: function(r) {
	return (r>=this.range[0]&&r<=this.range[1]);
    },
    canfire: function(sh) {
	return true;
    },
    getrerolldices: function(sh) {
	if (this.unit.targeting==sh) return 10;
	else return 0;
    },
    canfirewithtarget:function(sh) { 
	if (this.hasfired) return false;
	if (typeof this.unit.targeting=="undefined") return false; 
	return (this.unit.targeting==sh);  
    },
    firewithtarget:function(sh) { 
	this.unit.istargeting=false;
	this.unit.target--;
	sh.istargeted--;
	sh.show();
	this.unit.show();
	this.hasfired=true;
    },
    getattackbonus: function(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==1) return 1;
	}
	return 0;
    },
    fire: function(sh) { },
    getdefensebonus: function(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==3) return 1;
	}
	return 0;
    },
    getrange: function(sh) {
	if (this.type=="Turret")  {
	    var r=this.unit.getrange(sh);
	    if (this.canfire(r)) return r;
	    else return 0;
	}
	for (i=this.range[0]; i<=this.range[1]; i++) {
	    if (this.unit.isinsector(this.unit.m,i,sh)) return i; 
	}
	if (this.type=="bilaser") {
	    var m=this.unit.m.clone();
	    m.add(MR(180,0,0));
	    for (i=this.range[0]; i<=this.range[i]; i++) {
		if (this.unit.isinsector(m,i,sh)) { return i; }
	    }
	}
	return 0;
    }
};

function Pilot(name) {
    var i;
    for (i=0; i<PILOTS.length; i++) {
	if (PILOTS[i].name==name) {
	   var p=new Unit(PILOTS[i]);
	    if (p.init != undefined) p.init();
	    return p;
	}
    }
    console.log("Could not find pilot "+name);
}
function Upgrade(sh,name) {
    var i;
    for (i=0; i<UPGRADES.length; i++) {
	if (UPGRADES[i].name==name) {
	    var upg=$.extend({},UPGRADES[i]);
	    sh.upgrades.push(upg);
	    console.log("installed upgrade "+name+" ["+upg.type+"]");
	    if (upg.init != undefined) upg.init(sh);
	    return;
	}
    }
    console.log("Could not find upgrade "+name);
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
        name: '"Dutch" Vander',
        
        
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
        name: '"Winged Gundark"',
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
        name: '"Night Beast"',
        faction:"EMPIRE",
        init: function () {
	    var r=this.handledifficulty;
	    this.handledifficulty=function(difficulty) {
		r.call(this,difficulty);
		if (difficulty=="GREEN") {
		    log("["+this.name+"] green maneuver -> free focus action");
		    this.focus++;
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
        name: '"Backstabber"',
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
        name: '"Dark Curse"',
        faction:"EMPIRE",
        unique: true,
        ship: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: '"Mauler Mithel"',
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
        name: '"Howlrunner"',
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
		    if (squadron[i].name=='"Howlrunner"') break;
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
        name: "\"Fel's Wrath\"",
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
        name: '"Echo"',
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
        name: '"Whisper"',
        
        faction:"EMPIRE",
        
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
        name: '"Hobbie" Klivian',
	faction:"REBEL",
        
        
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
        name: '"Leebo"',
        
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

var UPGRADES= [
    {
        name: "Ion Cannon Turret",
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Turret",
        points: 5,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Proton Torpedoes",
        init: function(sh) {sh.weapons.push(new Weapon(sh,this)); },
	canfire: function(sh) {return this.canfirewithtarget(sh)},
	fire: function(sh) {return this.firewithtarget(sh)},
	getrerolldices: function(sh) { return 0; },
        type: "Torpedo",
	hasfired:false,
        points: 4,
        attack: 4,
        range: [2,3],
    },
    {
        name: "R2 Astromech",
        
        type: "Astromech",
        points: 1,
    },
    {
        name: "R2-D2",
        aka: [ "R2-D2 (Crew)" ],
        
        
        unique: true,
        type: "Astromech",
        points: 4,
    },
    {
        name: "R2-F2",
        
        unique: true,
        type: "Astromech",
        points: 3,
    },
    {
        name: "R5-D8",
        
        unique: true,
        type: "Astromech",
        points: 3,
    },
    {
        name: "R5-K6",
        
        unique: true,
        type: "Astromech",
        points: 2,
    },
    {
        name: "R5 Astromech",
        
        type: "Astromech",
        points: 1,
    },
    {
        name: "Determination",
        
        type: "Elite",
        points: 1,
    },
    {
        name: "Swarm Tactics",
        
        type: "Elite",
        points: 2,
    },
    {
        name: "Squad Leader",
        
        unique: true,
        type: "Elite",
        points: 2,
    },
    {
        name: "Expert Handling",
        
        type: "Elite",
        points: 2,
    },
    {
        name: "Marksmanship",
        
        type: "Elite",
        points: 3,
    },
    {
        name: "Concussion Missiles",
        
        type: "Missile",
        points: 4,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        
        type: "Missile",
        points: 4,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Daredevil",
        
        type: "Elite",
        points: 3,
    },
    {
        name: "Elusiveness",
        
        type: "Elite",
        points: 2,
    },
    {
        name: "Homing Missiles",
        
        type: "Missile",
        attack: 4,
        range: [2,3],
        points: 5,
    },
    {
        name: "Push the Limit",
        
        type: "Elite",
        points: 3,
    },
    {
        name: "Deadeye",
        
        type: "Elite",
        points: 1,
    },
    {
        name: "Expose",
        
        type: "Elite",
        points: 4,
    },
    {
        name: "Gunner",
        
        type: "Crew",
        points: 5,
    },
    {
        name: "Ion Cannon",
        init:function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Cannon",
        points: 3,
        attack: 3,
        range: [1,3],
    },
    {
        name: "Heavy Laser Cannon",
        init:function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Cannon",
        points: 7,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Seismic Charges",
        
        type: "Bomb",
        points: 2,
    },
    {
        name: "Mercenary Copilot",
        
        type: "Crew",
        points: 2,
    },
    {
        name: "Assault Missiles",
        
        type: "Missile",
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Veteran Instincts",
        
        type: "Elite",
        points: 1,
    },
    {
        name: "Proximity Mines",
        
        type: "Bomb",
        points: 3,
    },
    {
        name: "Weapons Engineer",
        
        type: "Crew",
        points: 3,
    },
    {
        name: "Draw Their Fire",
        
        type: "Elite",
        points: 1,
    },
    {
        name: "Luke Skywalker",
        
        unique: true,
        
        type: "Crew",
        points: 7,
    },
    {
        name: "Nien Nunb",
        
        unique: true,
        
        type: "Crew",
        points: 1,

    },
    {
        name: "Chewbacca",
        
        unique: true,
        
        type: "Crew",
        points: 4,
    },
    {
        name: "Advanced Proton Torpedoes",
        
        
        type: "Torpedo",
        attack: 5,
        range: [1,1],
        points: 6,
    },
    {
        name: "Autoblaster",
        init:function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Cannon",
        attack: 3,
        range: [1,1],
        points: 5,
    },
    {
        name: "Fire-Control System",
        
        type: "System",
        points: 2,
    },
    {
        name: "Blaster Turret",
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Turret",
        points: 4,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Recon Specialist",
        
        type: "Crew",
        points: 3,
    },
    {
        name: "Saboteur",
        
        type: "Crew",
        points: 2,
    },
    {
        name: "Intelligence Agent",
        
        type: "Crew",
        points: 1,
    },
    {
        name: "Proton Bombs",
        
        type: "Bomb",
        points: 5,
    },
    {
        name: "Adrenaline Rush",
        
        type: "Elite",
        points: 1,
    },
    {
        name: "Advanced Sensors",
        
        type: "System",
        points: 3,
    },
    {
        name: "Sensor Jammer",
        
        type: "System",
        points: 4,
    },
    {
        name: "Darth Vader",
        
        unique: true,
        
        type: "Crew",
        points: 3,
    },
    {
        name: "Rebel Captive",
        
        unique: true,
        
        type: "Crew",
        points: 3,
    },
    {
        name: "Flight Instructor",
        
        type: "Crew",
        points: 4,
    },
    {
        name: "Navigator",
        
        type: "Crew",
        points: 3,
    },
    {
        name: "Opportunist",
        
        type: "Elite",
        points: 4,
    },
    {
        name: "Comms Booster",
        
        type: "Cargo",
        points: 4,
    },
    {
        name: "Slicer Tools",
        
        type: "Cargo",
        points: 7,
    },
    {
        name: "Shield Projector",
        
        type: "Cargo",
        points: 4,
    },
    {
        name: "Ion Pulse Missiles",
        
        type: "Missile",
        points: 3,
        attack: 3,
        range: [2,3],
    },
    {
        name: "Wingman",
        
        type: "Elite",
        points: 2,
    },
    {
        name: "Decoy",
        
        type: "Elite",
        points: 2,
    },
    {
        name: "Outmaneuver",
        
        type: "Elite",
        points: 3,
    },
    {
        name: "Predator",
        
        type: "Elite",
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
        
        type: "Torpedo",
        points: 2,
        attack: 3,
        range: [2,3],
    },
    {
        name: "R7 Astromech",
        
        type: "Astromech",
        points: 2,
    },
    {
        name: "R7-T1",
        
        unique: true,
        type: "Astromech",
        points: 3,
    },
    {
        name: "Tactician",
        
        type: "Crew",
        points: 2,
    },
    {
        name: "R2-D2 (Crew)",
        aka: [ "R2-D2" ],
        
        
        unique: true,
        type: "Crew",
        points: 4,
        
    },
    {
        name: "C-3PO",
        unique: true,
        
        type: "Crew",
        points: 3,
        
    },
    {
        name: "Tibanna Gas Supplies",
        
        type: "Cargo",
        points: 4,
        limited: true,
    },
    {
        name: "Ionization Reactor",
        
        type: "Cargo",
        points: 4,
        energy: 5,
        limited: true,
    },
    {
        name: "Engine Booster",
        
        type: "Cargo",
        points: 3,
        limited: true,
    },
    {
        name: "R3-A2",
        
        unique: true,
        type: "Astromech",
        points: 2,
    },
    {
        name: "R2-D6",
        
        unique: true,
        type: "Astromech",
        points: 1,
    },
    {
        name: "Enhanced Scopes",
        
        type: "System",
        points: 1,
    },
    {
        name: "Chardaan Refit",
        
        type: "Missile",
        points: -2,
        ship: "A-Wing",
    },
    {
        name: "Proton Rockets",
        
        type: "Missile",
        points: 3,
        attack: 2,
        range: [1,1],
    },
    {
        name: "Kyle Katarn",
        
        unique: true,
        type: "Crew",
        points: 3,
        
    },
    {
        name: "Jan Ors",
        
        unique: true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Toryn Farr",
        
        unique: true,
        type: "Crew",
        points: 6,
    },
    {
        name: "R4-D6",
        
        unique: true,
        type: "Astromech",
        points: 1,
    },
    {
        name: "R5-P9",
        
        unique: true,
        type: "Astromech",
        points: 3,
    },
    {
        name: "WED-15 Repair Droid",
        
        type: "Crew",
        points: 2,
    },
    {
        name: "Carlist Rieekan",
        
        unique: true,
        type: "Crew",
        points: 3,
        
    },
    {
        name: "Jan Dodonna",
        
        unique: true,
        type: "Crew",
        points: 6,
        
    },
    {
        name: "Expanded Cargo Hold",
        
        type: "Cargo",
        points: 1,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Backup Shield Generator",
        
        type: "Cargo",
        limited: true,
        points: 3,
    },
    {
        name: "EM Emitter",
        
        type: "Cargo",
        limited: true,
        points: 3,
    },
    {
        name: "Frequency Jammer",
        
        type: "Cargo",
        limited: true,
        points: 4,
    },
    {
        name: "Han Solo",
        
        type: "Crew",
        unique: true,
        
        points: 2,
    },
    {
        name: "Leia Organa",
        
        type: "Crew",
        unique: true,
        
        points: 4,
    },
    {
        name: "Targeting Coordinator",
        
        type: "Crew",
        limited: true,
        points: 4,
    },
    {
        name: "Raymus Antilles",
        
        type: "Crew",
        unique: true,
        
        points: 6,
    },
    {
        name: "Gunnery Team",
        
        type: "Team",
        limited: true,
        points: 4,
    },
    {
        name: "Sensor Team",
        
        type: "Team",
        points: 4,
    },
    {
        name: "Engineering Team",
        
        type: "Team",
        limited: true,
        points: 4,
    },
    {
        name: "Lando Calrissian",
        
        type: "Crew",
        unique: true,
        
        points: 3,
    },
    {
        name: "Mara Jade",
        
        type: "Crew",
        unique: true,
        
        points: 3,
    },
    {
        name: "Fleet Officer",
        
        type: "Crew",
        
        points: 3,
    },
    {
        name: "Stay On Target",
        
        type: "Elite",
        points: 2,
    },
    {
        name: "Dash Rendar",
        
        unique: true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Lone Wolf",
        
        unique: true,
        type: "Elite",
        points: 2,
    },
    {
        name: '"Leebo"',
        
        unique: true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Ruthlessness",
        
        type: "Elite",
        points: 3,
        
    },
    {
        name: "Intimidation",
        
        type: "Elite",
        points: 2,
    },
    {
        name: "Ysanne Isard",
        
        unique: true,
        type: "Crew",
        points: 4,
        
    },
    {
        name: "Moff Jerjerrod",
        
        unique: true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Ion Torpedoes",
        
        type: "Torpedo",
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Bodyguard",
        
        unique: true,
        type: "Elite",
        points: 2,
        
    },
    {
        name: "Calculation",
        
        type: "Elite",
        points: 1,
    },
    {
        name: "Accuracy Corrector",
        
        type: "System",
        points: 3,
    },
    {
        name: "Inertial Dampeners",
        
        type: "Illicit",
        points: 1,
    },
    {
        name: "Flechette Cannon",
        init:function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Cannon",
        points: 2,
        attack: 3,
        range: [1,3],
    },
    {
        name: '"Mangler" Cannon',
        init:function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Cannon",
        points: 4,
        attack: 3,
        range: [1,3],
    },
    {
        name: "Dead Man's Switch",
        
        type: "Illicit",
        points: 2,
    },
    {
        name: "Feedback Array",
        
        type: "Illicit",
        points: 2,
    },
    {
        name: '"Hot Shot" Blaster',
        
        type: "Illicit",
        points: 3,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Greedo",
        
        unique: true,
        type: "Crew",
        
        points: 1,
    },
    {
        name: "Salvaged Astromech",
        
        type: "Salvaged Astromech",
        points: 2,
    },
    {
        name: "Bomb Loadout",
        
        limited: true,
        type: "Torpedo",
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: '"Genius"',
        
        unique: true,
        type: "Salvaged Astromech",
        points: 0,
    },
    {
        name: "Unhinged Astromech",
        
        type: "Salvaged Astromech",
        points: 1,
    },
    {
        name: "R4-B11",
        
        unique: true,
        type: "Salvaged Astromech",
        points: 3,
    },
    {
        name: "Autoblaster Turret",
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
        type: "Turret",
        points: 2,
        attack: 2,
        range: [1,1],
    },
    {
        name: "R4 Agromech",
        
        type: "Salvaged Astromech",
        points: 2,
    },
    {
        name: "K4 Security Droid",
        
        type: "Crew",
        
        points: 3,
    },
    {
        name: "Outlaw Tech",
        
        limited: true,
        type: "Crew",
        
        points: 2,
    },
    {
        name: 'Advanced Targeting Computer',
        
        
        type: "System",
        points: 5,
        ship: "TIE Advanced",
    },
];

var MODS=[
    {
        name: "Stealth Device",
        
        points: 3,
    },
    {
        name: "Shield Upgrade",
        
        points: 4,
    },
    {
        name: "Engine Upgrade",
        
        points: 4,
    },
    {
        name: "Anti-Pursuit Lasers",
        
        points: 2,
    },
    {
        name: "Targeting Computer",
        
        points: 2,
    },
    {
        name: "Hull Upgrade",
        
        points: 3,
    },
    {
        name: "Munitions Failsafe",
        
        points: 1,
    },
    {
        name: "Stygium Particle Accelerator",
        
        points: 2,
    },
    {
        name: "Advanced Cloaking Device",
        
        points: 4,
        ship: "TIE Phantom",
    },
    {
        name: "Combat Retrofit",
        
        points: 10,
        ship: "GR-75 Medium Transport",
        huge: true,
    },
    {
        name: "B-Wing/E2",
        
        points: 1,
        ship: "B-Wing",

    },
    {
        name: "Countermeasures",
        
        points: 3,
    },
    {
        name: "Experimental Interface",
        
        unique: true,
        points: 3,
    },
    {
        name: "Tactical Jammer",
        
        points: 1,
    },
    {
        name: "Autothrusters",
        
        points: 2,
    },
    ,
];

var TITLES= [
    {
        name: "Slave I",
        
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: "Millennium Falcon",
        
        unique: true,
        points: 1,
        ship: "YT-1300",
        actions: "Evade",
    },
    {
        name: "Moldy Crow",
        
        unique: true,
        points: 3,
        ship: "HWK-290",
    },
    {
        name: "ST-321",
        
        unique: true,
        points: 3,
        ship: "Lambda-Class Shuttle",
    },
    {
        name: "Royal Guard TIE",
        
        points: 0,
        ship: "TIE Interceptor",
    },
    {
        name: "Dodonna's Pride",
        
        unique: true,
        points: 4,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "A-Wing Test Pilot",
        
        points: 0,
        ship: "A-Wing",
        special_case: "A-Wing Test Pilot",
    },
    {
        name: "Tantive IV",
        
        unique: true,
        points: 4,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "Bright Hope",
        
        energy: "+2",
        unique: true,
        points: 5,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Quantum Storm",
        
        energy: "+1",
        unique: true,
        points: 4,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Dutyfree",
        
        energy: "+0",
        unique: true,
        points: 2,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Jaina's Light",
        
        unique: true,
        points: 2,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "Outrider",
        
        unique: true,
        points: 5,
        ship: "YT-2400",
    },
    {
        name: "Dauntless",
        
        unique: true,
        points: 2,
        ship: "VT-49 Decimator",
    },
    {
        name: "Virago",
        
        unique: true,
        points: 1,
        ship: "StarViper",
    },
    {
        name: '"Heavy Scyk" Interceptor (Cannon)',
        
        
        points: 2,
        ship: "M3-A Interceptor",

    },
    {
        name: '"Heavy Scyk" Interceptor (Torpedo)',
        
        
        points: 2,
        ship: "M3-A Interceptor",
    },
    {
        name: '"Heavy Scyk" Interceptor (Missile)',
        
        
        points: 2,
        ship: "M3-A Interceptor",
    },
    {
        name: 'IG-2000',
        
        points: 0,
        ship: "Aggressor",
    },
    {
        name: "BTL-A4 Y-Wing",
        
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "Andrasta",
        
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: 'TIE/x1',
        
        points: 0,
        ship: "TIE Advanced",
    },
];

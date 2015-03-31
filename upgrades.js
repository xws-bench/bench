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
	if (typeof this.unit.target==0) return false; 
	return (this.unit.targeting==sh);  
    },
    firewithtarget:function(sh) { 
	this.unit.usetarget();
	sh.istargeted--;
	sh.show();
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
	    for (i=this.range[0]; i<=this.range[1]; i++) {
		if (this.unit.isinsector(m,i,sh)) { return i; }
	    }
	}
	return 0;
    }
};

function Upgrade(sh,name) {
    var i;
    for (i=0; i<UPGRADES.length; i++) {
	if (UPGRADES[i].name==name) {
	    var upg=$.extend({},UPGRADES[i]);
	    sh.upgrades.push(upg);
	    log("installed upgrade "+name+" ["+upg.type+"]");
	    upg.isactive=true;
	    if (upg.init != undefined) upg.init(sh);
	    return;
	}
    }
    console.log("Could not find upgrade "+name);
}

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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
        type: "Missile",
        points: 4,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
        type: "Missile",
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Veteran Instincts",
        init: function(sh) {
	    sh.skill+=2;
	},
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
        init: function(sh) {
	    var i;
	    for (i=0; i<sh.dial.length; i++) {
		if (sh.dial[i].move=="F1"
		    ||sh.dial[i].move=="F2"
		    ||sh.dial[i].move=="F3"
		    ||sh.dial[i].move=="F4"
		    ||sh.dial[i].move=="F5") sh.dial[i].difficulty="GREEN";
	    }
	},
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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
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
        init: function(sh) {
	    sh.candoaction=function() {
		activeunit.updateactionlist(); 
		log("[Advanced Sensors] action before maneuver for "+this.name);
		return (this==activeunit&&!this.actiondone&&phase==ACTIVATION_PHASE);
	    }
	},
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
        init: function(sh) {
	    sh.rebelcaptive=0;
	    sh.ishitbyattack=function(a) {
		if (this.rebelcaptive!=round) {//First attack this turn
		    log("[Rebel Captive] +1 stress for "+a.name);
		    a.addstress();
		    this.rebelcaptive=round;
		}
		return Unit.prototype.ishitbyattack.call(this,a);
	    };
	},
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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
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
        init: function(sh) {
	    sh.getbonuslone=function() {
		var i,lone=true;
		for (i=0; i<squadron.length; i++) {
		    var r=this.getrange(squadron[i]);
		    if (squadron[i].team==this.team&&r>=1&&r<=2) {
			lone=false; break
		    }
		}
		if (lone) return 1; else return 0;
	    };
	    sh.getattackstrength=function(w,t) {
		var a=this.getbonuslone();
		if (a>0) log("["+this.name+"] +1 attack for Lone Wolf");
		return Unit.prototype.getattackstrength.call(this,w,t)+a;
	    };
	    sh.getdefensestrength=function(w,t) {
		var d=this.getbonuslone();
		if (d>0) log("["+this.name+"] +1 defense for Lone Wolf");
		return Unit.prototype.getdefensestrength.call(this,w,t)+ d;
	    }
	},
        unique: true,
        type: "Elite",
        points: 2,
    },
    {
        name: "'Leebo'",
        
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
        init: function(sh) { sh.weapons.push(new Weapon(sh,this)); },
	
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
        name: "'Mangler' Cannon",
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
        name: "'Hot Shot' Blaster",
        
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
        name: "'Genius'",
        
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
        name: "Advanced Targeting Computer",
        
        
        type: "System",
        points: 5,
        ship: "TIE Advanced",
    },
    {
        name: "Stealth Device",
	type:"Mod",
	init: function(sh) {
	    sh.agility++;
	    log("["+this.name+"] +1 agility for "+sh.name)
	    sh.ishitbyattack=function(sh2) {
		log("Stealth Device of "+this.name+" is hit by "+sh2.name+"=> equipment destroyed");
		var ch=Unit.prototype.ishitbyattack.call(this,sh2);
		var i;
		for (i=0;i<this.upgrades.length; i++) 
		    if (this.upgrades[i].name=="Stealth Device") break;
		if (ch.c+ch.h>0&&this.upgrades[i].isactive) { 
		    this.upgrades[i].isactive=false; 
		    this.agility--;
		    this.show();
		}
		return ch;
	    };
	},
        points: 3,
    },
    {
        name: "Shield Upgrade",
	type:"Mod",    
	init: function(sh) {
	    sh.shield++;
	},
        points: 4,
    },
    {
        name: "Engine Upgrade",
	type:"Mod",
        init: function(sh) {
	    sh.shipactionList.push("BOOST");
	},
        points: 4,
    },
    {
        name: "Anti-Pursuit Lasers",
	type:"Mod",
        
        points: 2,
    },
    {
        name: "Targeting Computer",
	type:"Mod",
        init: function(sh) {
	    sh.shipactionList.push("TARGET");
	},
        points: 2,
    },
    {
        name: "Hull Upgrade",
	type:"Mod",
        init: function(sh) {
	    this.hull++;
	},        
        points: 3,
    },
    {
        name: "Munitions Failsafe",
	type:"Mod",
        
        points: 1,
    },
    {
        name: "Stygium Particle Accelerator",
	type:"Mod",
        init: function(sh) {
	    sh.resolvecloak=function() {
		this.focus++;
		log("[Stygium P.A.] free focus for "+this.name);
		return Unit.prototype.resolvecloak.call(this);
	    };
	    sh.resolveuncloak=function() {
		this.focus++;
		log("[Stygium P.A.] free focus for "+this.name);
		return Unit.prototype.resolveuncloak.call(this);
	    };
	},
        points: 2,
    },
    {
        name: "Advanced Cloaking Device",
	type:"Mod",
        
        points: 4,
        ship: "TIE Phantom",
    },
    {
        name: "Combat Retrofit",
	type:"Mod",
        
        points: 10,
        ship: "GR-75 Medium Transport",
        huge: true,
    },
    {
        name: "B-Wing/E2",
	type:"Mod",
        
        points: 1,
        ship: "B-Wing",

    },
    {
        name: "Countermeasures",
	type:"Mod",
        
        points: 3,
    },
    {
        name: "Experimental Interface",
	type:"Mod",
        
        unique: true,
        points: 3,
    },
    {
        name: "Tactical Jammer",
	type:"Mod",
        
        points: 1,
    },
    {
        name: "Autothrusters",
	type:"Mod",
        
        points: 2,
    },
    {
        name: "Slave I",
        type:"Title",
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: "Millennium Falcon",
        type:"Title",
        init:function(sh) {
	    sh.shipactionList.push("EVADE");
	},
        unique: true,
        points: 1,
        ship: "YT-1300",
        actions: "Evade",
    },
    {
        name: "Moldy Crow",
        type:"Title",
        
        unique: true,
        points: 3,
        ship: "HWK-290",
    },
    {
        name: "ST-321",
        type:"Title",
        
        unique: true,
        points: 3,
        ship: "Lambda-Class Shuttle",
    },
    {
        name: "Royal Guard TIE",
        type:"Title",
        
        points: 0,
        ship: "TIE Interceptor",
    },
    {
        name: "Dodonna's Pride",
        type:"Title",
        
        unique: true,
        points: 4,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "A-Wing Test Pilot",
        type:"Title",
        
        points: 0,
        ship: "A-Wing",
        special_case: "A-Wing Test Pilot",
    },
    {
        name: "Tantive IV",
        type:"Title",
        
        unique: true,
        points: 4,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "Bright Hope",
        type:"Title",
        
        energy: "+2",
        unique: true,
        points: 5,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Quantum Storm",
        
        type:"Title",
        energy: "+1",
        unique: true,
        points: 4,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Dutyfree",
        
        type:"Title",
        energy: "+0",
        unique: true,
        points: 2,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Jaina's Light",
        type:"Title",
        
        unique: true,
        points: 2,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "Outrider",
        type:"Title",
        
        unique: true,
        points: 5,
        ship: "YT-2400",
    },
    {
        name: "Dauntless",
        type:"Title",
        
        unique: true,
        points: 2,
        ship: "VT-49 Decimator",
    },
    {
        name: "Virago",
        type:"Title",
        
        unique: true,
        points: 1,
        ship: "StarViper",
    },
    {
        name: "'Heavy Scyk' Interceptor (Cannon)",
        
        type:"Title",
        
        points: 2,
        ship: "M3-A Interceptor",

    },
    {
        name: "'Heavy Scyk' Interceptor (Torpedo)",
        type:"Title",
        
        
        points: 2,
        ship: "M3-A Interceptor",
    },
    {
        name: "'Heavy Scyk' Interceptor (Missile)",
        
        type:"Title",
        
        points: 2,
        ship: "M3-A Interceptor",
    },
    {
        name: 'IG-2000',
        type:"Title",
        
        points: 0,
        ship: "Aggressor",
    },
    {
        name: "BTL-A4 Y-Wing",
        type:"Title",
        
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "Andrasta",
        type:"Title",
        
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: 'TIE/x1',
        type:"Title",
        
        points: 0,
        ship: "TIE Advanced",
    },
];

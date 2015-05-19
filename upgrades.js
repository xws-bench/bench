
var UPGRADE_TYPES={
Elite:"ept",Torpedo:"torpedo",Astromech:"amd",Turret:"turret",Missile:"missile",Crew:"crew",Cannon:"cannon",Bomb:"bomb",Title:"title",Mod:"mod",System:"system",Illicit:"illicit",Salvaged:"salvaged"
};
function Laser(u,type,fire) {
    return new Weapon(u,{
	type: type,
	name:"Laser",
	isactive:true,
	attack: fire,
	range: [1,3],
	isprimary: true
    });
}

function Weapon(p,wdesc) {
    this.isprimary=false;
    $.extend(this,wdesc);
    this.unit=p;
}
Weapon.prototype = {
    toString: function() {
	var a,b,str="";
	var c="";
	if (!this.isactive) c="class='inactive'"
	else {
	    var r=this.getrangeallunits();
	    if (r.length==0) c="class='nofire'"
	}
	a="<td class='statfire'>"+this.attack+"<span class='symbols'>"+A[this.type.toUpperCase()].key+"</span></td>";
	b="<td class='tdstat'>"+this.name+" <span style='font-size:x-small'>"
	    +((typeof this.requires!="undefined")?
	      "<code class='symbols'>"+A[this.requires.toUpperCase()].key+"</code>":"")
	    +"["+this.range[0]+"-"+this.range[1]+"]</span></td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+"</tr>"; 
	else return "<tr "+c+">"+a+b+"</tr>";

    },
    isTurret: function() {
	return this.type=="Turret";
    },
    isinrange: function(r) {
	return (r>=this.range[0]&&r<=this.range[1]);
    },
    modifydamagegiven: function(ch) { return ch; },
    modifydamageassigned: function(ch,t) { return ch; },
    canfire: function(sh) {
	if (!this.isactive) return false;
	if (typeof this.requires!="undefined") {
	    if (this.requires=="Target"&&this.unit.canusetarget(sh))
		return true;
	    if (this.requires=="Focus"&&this.unit.canusefocus(sh)) return true;
	    return false;
	}
	return true;
    },
    getattackreroll: function(sh) {
	return 0;
    },
    modifyattackroll: function(n,sh) {
	return n;
    },
    getattackbonus: function(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==1) {
		log(this.unit.name+" +1 attack for range 1");
		return 1;
	    }
	}
	return 0;
    },

    declareattack: function(sh) { 
	if (typeof this.requires!="undefined") {
	    if (this.requires=="Target") {
		this.unit.removetargettoken();
		sh.istargeted--;
		sh.show();
	    } else if (this.requires=="Focus") {
		this.unit.removefocustoken();
	    }
	    this.unit.show();
	}
    },
    getdefensebonus: function(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==3) {
		log(sh.name+" +1 defense for range 3 against "+this.unit.name);
		return 1;
	    }
	}
	return 0;
    },
    getrange: function(sh) {
	var i;
	if (!this.canfire(sh)) return 0;
	var r=this.unit.getrange(sh);
	if (this.isTurret()||this.unit.isTurret(this)) 
	    if (r>=this.range[0]&&r<=this.range[1]) return r;
	    else return 0;
	for (i=this.range[0]; i<=this.range[1]; i++) 
	    if (this.unit.isinsector(this.unit.m,i,sh)
		&&r==i) return i; 
	if (this.type=="Bilaser") {
	    var m=this.unit.m.clone();
	    m.add(MR(180,0,0));
	    for (i=this.range[0]; i<=this.range[1]; i++)
		if (this.unit.isinsector(m,i,sh)&& r==i) return i; 
	}
	return 0;
    },
    endattack: function(c,h) {
	if (this.type.match("Torpedo|Missile")) {
	    this.isactive=false;
	    log("["+this.name+"] inactive");
	}
    },
    getrangeallunits: function() {
	var i;
	var r=[];
	for (i=0; i<squadron.length; i++) {
	    var s=squadron[i];
	    if (this.unit.team!=s.team&&this.getrange(s)>0) r.push(s);
	}
	return r;
    }
};
function Upgrade(sh,i) {
    $.extend(this,UPGRADES[i]);
    sh.upgrades.push(this);
    log("going to install "+UPGRADES[i].name);
    log("installed upgrade "+this.name+" ["+this.type+"]");
    this.isactive=true;
    if (this.isWeapon()) sh.weapons.push(new Weapon(sh,this));
    if (this.init != undefined) this.init(sh);
}
function Upgradefromname(sh,name) {
    var i;
    for (i=0; i<UPGRADES.length; i++) {
	if (UPGRADES[i].name==name) {
	    return new Upgrade(sh,i);
	}
    }
    console.log("Could not find upgrade "+name);
}
Upgrade.prototype = {
    isWeapon: function() {
	if (this.type.match("Cannon|Turret|Missile|Torpedo")) return true;
	return false;
    }
}

var rebelonly=function(p) {
    var i;
    for (i=0; i<PILOTS.length; i++) 
	if (p==PILOTS[i].name&&PILOTS[i].faction=="REBEL") return true;
    return false;
}
var empireonly=function(p) {
    var i;
    for (i=0; i<PILOTS.length; i++) 
	if (p==PILOTS[i].name&&PILOTS[i].faction=="EMPIRE") return true;
    return false;
}
var UPGRADES= [
    {
        name: "Ion Cannon Turret",
        type: "Turret",
	firesnd:"falcon_fire",
        points: 5,
        attack: 3,
	done:1,
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		log("["+this.name+"] 1<p class='hit'></p> + 1 ion token assigned to "+target.name);
		target.addiontoken();
	    }
	    return ch;
	},
        range: [1,2],
    },
    {
        name: "Proton Torpedoes",
	requires: "Target",
        type: "Torpedo",
	firesnd:"missile",
        points: 4,
        attack: 4,
        range: [2,3],
    },
    {
        name: "R2 Astromech",
	done:true,
        install: function(sh) {
	    var i;
	    sh.gdr2=sh.getdial;
	    sh.getdial=function() {
		var m=sh.gdr2();
		var n=[];
		for (var i=0; i<m.length; i++) {
		    var s=P[m[i].move].speed;
		    var d=m[i].difficulty;
		    if (s==1||s==2) d="GREEN";
		    n.push({ move:m[i].move,difficulty:d});
		}
		return n;
	    }.bind(sh);
	    log("["+this.name+"] 1, 2 speed maneuvers of "+sh.name+" are green");
	},
	uninstall: function(sh) {
	    sh.getdial=sh.gdr2;
	    log("["+this.name+"] uninstalling effect");
	},
        type: "Astromech",
        points: 1,
    },
    {
        name: "R2-D2",
	done:true,
        init: function(sh) {
	    var hd=sh.handledifficulty;
	    sh.handledifficulty=function(d) {
		hd.call(this,d);
		if (d=="GREEN"&&this.shield<this.ship.shield){ 
		    this.shield++;
		    log("[R2-D2] "+this.name+" recovers 1 shield");
		}
	    }
	},
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
	requires:"Target",
        type: "Missile",
	firesnd:"missile",
        points: 4,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        type: "Missile",
	firesnd:"missile",
	requires:"Target",
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
	requires:"Target",
        type: "Missile",
	firesnd:"missile",
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
        type: "Cannon",
	firesnd:"slave_fire",
	done:true,
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		log("["+this.name+"] 1<p class='hit'></p> + 1 ion token assigned to "+target.name);
		target.addiontoken();
	    }
	    return ch;
	},
        points: 3,
        attack: 3,
        range: [1,3],
    },
    {
        name: "Heavy Laser Cannon",
        type: "Cannon",
	firesnd:"slave_fire",
	done:true,
	modifydamagegiven: function(ch) {
	    if (ch>10) {
		var c=Math.round(ch/10);
		var h=ch-10*c;
		log("["+this.name+"] "+c+"<p class='critical'></p>-> "+c+"<p class='hit'></p>");
		ch=c+h;
	    }
	    return ch;
	},
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
	requires:"Target",
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		log("["+this.name+"] 1 damage assigned to all units at range 1 of "+t.name);
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].resolvehit(1);
		}
	    }
	    return ch;
	},
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Veteran Instincts",
	done:true,
        install: function(sh) {
	    sh.skill+=2;
	},
	uninstall: function(sh) {
	    sh.skill-=2;
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
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 7,
    },
    {
        name: "Nien Nunb",
	faction:"REBEL",
	done:true,
        install: function(sh) {
	    var i;
	    sh.getdial=function() {
		var m=Unit.prototype.getdial.call(this);
		var n=[];
		for (var i=0; i<m.length; i++) {
		    var move=m[i].move;
		    var d=m[i].difficulty;
		    if (move.match("F1|F2|F3|F4|F5")) d="GREEN";
		    n.push({move:move,difficulty:d});
		}
		return n;
	    }.bind(sh);
	},
	uninstall:function(sh) {
	    sh.getdial=Unit.prototype.getdial;
	},
        unique: true,
        type: "Crew",
        points: 1,
    },
    {
        name: "Chewbacca",
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 4,
    },
    {
        name: "Advanced Proton Torpedoes",
	requires:"Target",
        type: "Torpedo",
	firesnd:"missile",
        attack: 5,
        range: [1,1],
        points: 6,
    },
    {
        name: "Autoblaster",
        type: "Cannon",
	firesnd:"slave_fire",
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
        type: "Turret",
	firesnd:"falcon_fire",
	requires:"Focus",
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
	done:true,
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
        faction:"EMPIRE",
        unique: true,
        
        type: "Crew",
        points: 3,
    },
    {
        name: "Rebel Captive",
	faction:"EMPIRE",
	done:true,
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
	done:true,
        init: function(sh) {
	    var gas=sh.getattackstrength;
	    sh.getattackstrength=function(w,t) {
		var a=gas.call(this.unit,w,t);
		if (t.focus+t.evade==0) {
		    a=a+1;
		    this.unit.addstress();
		    log("["+this.name+"] +1 attack against "+t.name+", 1 stress more");
		}
		return a;
	    }.bind(this);
	},

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
	requires:"Target",
        type: "Missile",
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		log("["+this.name+"] 2<p class='hit'></p> + 1 ion token assigned by "+t.name);
		ch=2;
		t.ionized+=2;
	    }
	    return ch;
	},
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
	done:true,
        init: function(sh) {
	    sh.addattackrerolla(
		this,
		["blank","focus"],
		function() { if (targetunit.skill<=2) return 2; return 1; },
		function(w,defender) {
		    log("[Predator] "+(targetunit.skill<=2?2:1)+" reroll(s)");
		    return true;
		},
		false
	    )
	},
        type: "Elite",
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
	requires:"Target",
        type: "Torpedo",
	firesnd:"missile",
	done:true,
	endattack: function(c,h) {
	    if (targetunit.hull<=4) targetunit.addstress();
	    this.isactive=false;
	},
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
        name: "R2-D2",
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 4,
        
    },
    {
        name: "C-3PO",
        unique: true,
        faction:"REBEL",
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
        upgrades:["Elite"],
	noupgrades:"Elite",
	skillmin:3,
	done:true,
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
	done:true,
	isWeapon: function() { return false; },
        points: -2,
        ship: "A-Wing",
    },
    {
        name: "Proton Rockets",
        type: "Missile",
	firesnd:"missile",
	requires:"Focus",
        points: 3,
        attack: 2,
	done:true,
        init: function(sh) {
	    var gas=sh.getattackstrength;
	    sh.getattackstrength=function(w,t) {
		var a=gas.call(this.unit,w,t);
		if (this.unit.weapons[w]==this) {
		    if (this.agility<=3) a+=this.agility;
		    else a+=3;
		    log("["+this.name+"] +"+(this.agility>3?3:this.agility)+" attack for agility");
		}
		return a;
	    }.bind(this);
	},
        range: [1,1],
    },
    {
        name: "Kyle Katarn",
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 3,
        
    },
    {
        name: "Jan Ors",
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 2,
    },
    {
        name: "Toryn Farr",
        unique: true,
	ishuge:true,
	faction:"REBEL",
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
        ishuge:true,
        type: "Crew",
        points: 2,
    },
    {
        name: "Carlist Rieekan",
        ishuge:true,
	faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 3,
        
    },
    {
        name: "Jan Dodonna",
        ishuge:true,
	faction:"REBEL",
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
        faction:"REBEL",
        type: "Crew",
        unique: true,
        
        points: 2,
    },
    {
        name: "Leia Organa",
        faction:"REBEL",
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
        ishuge:true,
	faction:"REBEL",
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
        faction:"REBEL",
        type: "Crew",
        unique: true,
        
        points: 3,
    },
    {
        name: "Mara Jade",
        faction:"EMPIRE",
        type: "Crew",
        unique: true,
        
        points: 3,
    },
    {
        name: "Fleet Officer",
        faction:"EMPIRE",
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
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Lone Wolf",
	done:true,
	init: function(sh) {
	    sh.addattackrerolla(
		this,
		["blank"],
		function() { return 1; },
		function(w,defender) {
		    var r=this.unit.getrangeallunits();
		    for (var i=0; i<squadron.length; i++) 
			if (squadron[i].getrange(this.unit)<=2
			    &&squadron[i].team==this.unit.team) return false;
		    log("[Lone Wolf] 1 reroll");
		    return true;
		},
		false
	    )
	},
        unique: true,
        type: "Elite",
        points: 2,
    },
    {
        name: "'Leebo'",
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Ruthlessness",
        faction:"EMPIRE",
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
        faction:"EMPIRE",
        unique: true,
        type: "Crew",
        points: 4,
        
    },
    {
        name: "Moff Jerjerrod",
        faction:"EMPIRE",
        unique: true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Ion Torpedoes",
	requires:"Target",
        type: "Torpedo",
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		log("["+this.name+"] 1 ion token for all units at range 1 of "+t.name);
		t.addiontoken();
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].addiontoken();
		}
	    }
	    return ch;
	},
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Bodyguard",
        faction:"SCUM",
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
        type: "Cannon",
	firesnd:"slave_fire",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		ch=1;
		log("["+this.name+"] 1<p class='hit'></p> and stress token for "+t.name);
		if (t.stress==0) t.addstress();
	    }
	    return ch;
	},
        points: 2,
        attack: 3,
        range: [1,3],
    },
    {
        name: "'Mangler' Cannon",
        type: "Cannon",
	firesnd:"slave_fire",
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
	done:true,
        isWeapon: function() { return true;},
	isTurret:function() { return true;},
	endattack: function(c,h) { this.isactive=false; },
        type: "Illicit",
	firesnd:"xwing_fire",
        points: 3,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Greedo",
        faction:"SCUM",
        unique: true,
        type: "Crew",
        
        points: 1,
    },
    {
        name: "Salvaged Astromech",   
        type: "Salvaged",
        points: 2,
    },
    {
        name: "Bomb Loadout",
        upgrades:["Bomb"],
	done:true,
	isWeapon: function() { return false; },
        limited: true,
        type: "Torpedo",
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "'Genius'",
        unique: true,
        type: "Salvaged",
        points: 0,
    },
    {
        name: "Unhinged Astromech",
        type: "Salvaged",
	done:true,
        install: function(sh) {
	    var i;
	    sh.gd=sh.getdial;
	    sh.getdial=function() {
		var m=sh.gd();
		var n=[];
		for (i=0; i<m.length; i++) {
		    var d=m[i].difficulty;
		    var move=m[i].move;
		    if (move.match("F3|TL3|TR3|BL3|BR3|SR3|SR3|K3")) 
			d="GREEN";
		    n.push({move:move,difficulty:d});
		}
		return n;
	    };
	},
	uninstall:function(sh) {
	    sh.getdial=sh.gd;
	},
        points: 1,
    },
    {
        name: "R4-B11",
        unique: true,
        type: "Salvaged",
        points: 3,
    },
    {
        name: "Autoblaster Turret",
        type: "Turret",
	firesnd:"falcon_fire",
        points: 2,
        attack: 2,
        range: [1,1],
    },
    {
        name: "R4 Agromech",
        
        type: "Salvaged",
        points: 2,
    },
    {
        name: "K4 Security Droid",
        faction:"SCUM",
        type: "Crew",
        points: 3,
    },
    {
        name: "Outlaw Tech",
        faction:"SCUM",
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
	done:true,
	install:function(sh) {
	    sh.agility++;
	},
	uninstall:function(sh) {
	    sh.agility--;
	},
	init: function(sh) {
	    log("["+this.name+"] +1 agility for "+sh.name)
	    sh.evadeattack=function(sh2) {
		log("Stealth Device of "+this.name+" is hit by "+sh2.name+"=> equipment destroyed");
		var ch=Unit.prototype.evadeattack.call(this,sh2);
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
	done:true,
	install: function(sh) {
	    sh.shield++;
	},
	uninstall:function(sh) {
	    sh.shield--;
	},
        points: 4,
    },
    {
        name: "Engine Upgrade",
	type:"Mod",
	done:true,
	addedaction:"Boost",
        points: 4,
    },
    {
        name: "Anti-Pursuit Lasers",
	type:"Mod",
        islarge:true,
        points: 2,
    },
    {
        name: "Targeting Computer",
	type:"Mod",
	done:true,
	addedaction:"Target",
        points: 2,
    },
    {
        name: "Hull Upgrade",
	type:"Mod",
	done:true,
        install: function(sh) {
	    sh.hull++;
	},     
	uninstall:function(sh) {
	    sh.hull--;
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
	done:true,
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
	done:true,
        upgrades:["Crew"],
        points: 1,
        ship: "B-Wing",

    },
    {
        name: "Countermeasures",
	type:"Mod",
        islarge:true,
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
        islarge:true,
        points: 1,
    },
    {
        name: "Autothrusters",
	type:"Mod",
        actionrequired:"Boost",
        points: 2,
    },
    {
        name: "Slave I",
        type:"Title",
        unique: true,
        points: 0,
	done:true,
        ship: "Firespray-31",
	upgrades:["Torpedo"],
    },
    {
        name: "Millennium Falcon",
        type:"Title",
	done:true,
	addedaction:"Evade",
        unique: true,
        points: 1,
        ship: "YT-1300",
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
	done:true,
        upgrades:["Mod"],
	skillmin:5,
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
	done:true,
        upgrades:["Elite"],
	skillmin:2,
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
	done:true,
        upgrades:["Illicit","System"],
        unique: true,
        points: 1,
	skillmin:4,
        ship: "StarViper",
    },
    {
        name: "'Heavy Scyk' Interceptor",
	done:true,
        upgrades:["Cannon|Torpedo|Missile"],
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
	done:true,
        upgrades:["Bomb","Bomb"],
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: "TIE/x1",
        type:"Title",
	done:true,
        upgrades:["System"],
	pointsupg:-4,
        points: 0,
        ship: "TIE Advanced",
    },
];

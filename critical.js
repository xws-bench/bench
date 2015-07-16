var CRITICAL_DECK=[
    {
	type:"ship",
	count: 2,
	name:"Structural Damage",
	init: function(sh) {
	    this.isactive=true;
	    var ga=sh.getagility;
	    sh.getagility=function() {
		var a=ga.call(this);
		if (a>0) return a-1; else return a;
	    }
	    this.unit=sh;
	    log("["+this.name+"] -1 agility");
	    sh.activecriticals.push(this);
	},
	setinactive:function() {
	    this.unit.agility++;
	    this.isactive=false;
	    this.unit.activecriticals.splice(this,1);
	    log("["+this.name+"] Structural damage repaired");
	},
	action: function() {
	    if (Math.random()<3/8) {
		this.setinactive();
	    } else log("["+this.name+"] Structural damage not repaired");
	},
    },
    {
	type:"ship",
	name:"Damage Engine",
	count: 1,
	init: function(sh) {
	    var i;
	    var gd=sh.getdial;
	    this.unit=sh;
	    this.active=true;
	    this.getdial=sh.getdial;
	    sh.getdial=function() {
		var i;
		var a=gd.call(this);
		for (i=0; i<a.length; i++) {
		    if (a[i].move=="TL1"||a[i].move=="TL2"
		    ||a[i].move=="TL3"||a[i].move=="TR1"
		    ||a[i].move=="TR2"||a[i].move=="TR3")
		    a.difficulty="RED";
		}
		return a;
	    }
	    log("["+this.name+"] all turn maneuvers are red");
	}
	setinactive: function() {
	    this.unit.getdial=this.getdial;
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	name:"Console Fire",
	count: 2,
	init: function(sh) {
	    this.unit=this;
	    this.unit.bcp=sh.begincombatphase;
	    sh.begincombatphase=function() {
		if (Math.random()<3/8) {
		    log("["+this.name+"] console in fire, 1 <code class='hit'></code>");
		    this.resolvehit(1); this.checkdead();
		}
		this.consoleinfire();
	    }.bind(sh);
	    sh.activecriticals.push(this)
	},
	action: function() {
	    log("["+this.name+"] console no longer in fire");		
	    this.unit.begincombatphase=this.consoleinfire;
	}
    },
    {
	type:"ship",
	name:"Weapon Malfunction",
	effect:function(sh) {
	    if (sh.weapons[0].attack>0) sh.weapons[0].attack--;
	    sh.activecriticals.push(function() {
		sh.weapons[0].attack++;
	    }.bind(sh));
	}
    }
];
/*
    Structural Damage x2

Reduce your agility value by 1 (to a minimum of "0").

Action: Roll 1 attack die, on a (hit) result, flip this card facedown.

    Damaged Engine x2

Treat all turn maneuvers (sharp left OR sharp right) as red maneuvers.

    Console Fire x2

At the start of each combat phase, roll 1 attack die.  On a (hit) result, suffer 1 damage.

Action: Flip this card facedown.

    Weapon Malfunction x2

Reduce your primary weapon value by 1 (to a minimum of "0").

Action: Roll 1 attack die. On a (hit) or (critical hit) result, flip this card facedown.

     Damaged Sensor Array x2

You cannot perform the actions listed in your action bar.

Action: Roll 1 attack die.  On a (hit) result, flip this card facedown.

    Minor Explosion x2

Immediately roll 1 attack die.  On a (hit) result, suffer 1 damage.  Then flip this card facedown.

    Thrust Control Fire x2

Immediately receive 1 stress token.  Then flip this card facedown.

    Direct Hit! x7

This card counts as 2 damage against your hull.

    Munitions Failure x2

Immediately choose 1 of your secondary weapon upgrade cards and discard it.  Then flip this card facedown.

    Minor Hull Breach x2

After executing a red maneuver, roll 1 attack die.  On a (hit) result, suffer 1 damage.

PILOT

     Damaged Cockpit x2

After the round in which you receive this card, treat your pilot skill value as "0"

    Blinded Pilot x2

The next time you attack, do not roll any attack dice.  The flip this card facedown.

    Injured Pilot x2

All players must ignore your pilot ability and all of your <code class='Elite'></code> upgrade cards.

    Stunned Pilot x2

After you execute a maneuver that causes you to overlap either another ship or obstacle token, suffer 1 damage.
*/

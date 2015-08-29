function Critical(sh,i) {
    this.lethal=false;
    $.extend(this,CRITICAL_DECK[i]);
    this.no=i;
    sh.criticals.push(this);
    this.isactive=false;
    this.unit=sh;
}

Critical.prototype= {
    toString: function() {
	var a,b,str="";
	var c="";
	if (!this.isactive) return "";
	var n=this.name;
	if (typeof CRIT_translation[this.name].name!="undefined") n=CRIT_translation[this.name].name;
	a="<td><code class='Criticalupg upgrades'></code></td>"; 
	b="<td class='tdstat'>"+n+"</td>";
	n="";
	if (typeof CRIT_translation[this.name].text!="undefined") n=formatstring(CRIT_translation[this.name].text)
	d="<td class='tooltip'>"+n+"</td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
}
// TODO: a facedown for all effects
var CRITICAL_DECK=[
    {
	type:"ship",
	count: 2,
	name:"Structural Damage",
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.ga=this.unit.getagility;
	    this.unit.getagility=function() {
		    var a=this.ga.call(this.unit);
		    if (a>0) return a-1; else return a;
	    }.bind(this);
	},
	facedown:function() {
	    if (this.isactive) {
		this.unit.getagility=this.ga;
		//this.unit.criticals.splice(this,1);
		log(this.name+" repaired, +1 agility for "+this.unit.name);
		this.unit.showstats();
	    }
	    this.isactive=false;
	},
	action: function() {
	    if (Math.random()<3/8) {
		this.facedown();
	    } else log(this.name+" not repaired for "+this.unit.name);
	    this.unit.endaction();
	},
    },
    {
	type:"ship",
	name:"Damaged Engine",
	count: 1,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.gd=this.unit.getdial;
	    this.unit.getdial=function() {
		var i;
		var b=[];
		var a=this.gd.call(this.unit);
		for (i=0; i<a.length; i++) {
		    b[i]={move:a[i].move,difficulty:a[i].difficulty};
		    if (a[i].move=="TL1"||a[i].move=="TL2"
		    ||a[i].move=="TL3"||a[i].move=="TR1"
		    ||a[i].move=="TR2"||a[i].move=="TR3")
			b[i].difficulty="RED";
		}
		return b;
	    }.bind(this);
	},
	facedown: function() {
	    if (this.isactive) this.unit.getdial=this.gd;
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	name:"Console Fire",
	count: 2,
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.bcp=this.unit.begincombatphase;
	    this.unit.begincombatphase=function() {
		var r=Math.floor(Math.random()*8);
		var roll=FACE[ATTACKDICE[r]];
		if (roll=="hit") {
		    log("Console in fire for "+this.unit.name+": 1 <code class='hit'></code>");
		    this.unit.resolvehit(1); this.unit.checkdead();
		}
		this.bcp.call(this);
	    }.bind(this);
	},
	action: function() {
	    this.facedown();
	    this.unit.endaction();
	},
	facedown: function() {
	    if (this.isactive) {
		log("Console no longer in fire for "+this.unit.name);		
		this.unit.begincombatphase=this.bcp;
	    }
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	count: 2,
	name:"Weapon Malfunction",
	faceup:function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    var i;
	    for (i=0; i<this.unit.weapons.length;i++) 
		if (this.unit.weapons[i].isprimary) break;
	    this.i=i;
	    this.w=this.unit.weapons[i];
	    this.ga=this.w.getattack;
	    this.w.getattack=function() {
		var a=this.ga.call(this.w);
		if (a>0) return a-1; else a;
	    }.bind(this);
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.weapons[this.i].getattack=this.ga;
		log("Primary weapon for "+this.unit.name+" functioning again.");
		this.isactive=false;
	    }
	},
	action: function() {
	    var r=Math.floor(Math.random()*8);
	    var roll=FACE[ATTACKDICE[r]];
	    if (roll=="critical"||roll=="hit") this.facedown();
	    else log("Primary weapon for "+this.unit.name+" not functioning.");
	    this.unit.endaction();
	}
    },
    {
	type:"ship",
	count:2,
	name:"Damaged Sensor Array",
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.gsal=this.unit.getshipactionlist;
	    this.unit.getshipactionlist=function() { return [];};
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.getshipactionlist=this.gsal;
		log("Sensor array for "+this.unit.name+" functioning again.");
		this.isactive=false;
	    }
	},
	action: function() {
	    var r=Math.floor(Math.random()*8);
	    var roll=FACE[ATTACKDICE[r]];
	    if (roll=="hit") this.facedown();
	    else log("Sensor array still damaged for "+this.unit.name);
	    this.unit.endaction();
	}
    },
    { 
	name:"Minor Explosion",
	count: 2,
	type:"ship",
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    var r=Math.floor(Math.random()*8);
	    var roll=FACE[ATTACKDICE[r]];
	    this.isactive=false;
	    if (roll=="hit") this.unit.removehull(1); 
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    {
	name:"Thrust Control Fire",
	count: 2,
	type:"ship",
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.unit.addstress();
	    this.isactive=false;
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    { 
	name:"Direct Hit!",
	count:7,
	type:"ship",
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=false;
	    this.unit.removehull(1);
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    {
	name:"Munitions Failure",
	count:2,
	type:"ship",
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    var m=[];
	    for (i=0; i<this.unit.weapons.length; i++) {
		if (!this.unit.weapons[i].isprimary) m.push(this.unit.weapons[i]);
	    }
	    this.isactive=false;
	    if (m.length==0) return;
	    var w=Math.floor(Math.random()*m.length);
	    this.wp=m[w];
	    this.wp.isactive=false;
	    log(this.wp.name+" not functioning anymore for "+this.unit.name);
	    this.unit.show();
	},
	facedown: function() { this.isactive=false;
	}
    },
    {
	name:"Minor Hull Breach",
	count:2,
	type:"ship",
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.hd=this.unit.handledifficulty;
	    this.unit.handledifficulty=function(d) {
		this.hd.call(this.unit,d);
		var r=Math.floor(Math.random()*8);
		var roll=FACE[ATTACKDICE[r]];
		if (roll=="hit"&&d=="RED") {
		    log(this.name+" causes 1 <code class='hit'></code> for "+this.unit.name);
		    this.unit.removehull(1);
		}
	    }.bind(this);
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.handledifficulty=this.hd;
		this.isactive=false;
		log(this.name+" repaired for "+this.unit.name);
	    }
	}
    },
    { 
	name:"Damaged Cockpit",
	count:2,
	type:"pilot",
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.er=this.unit.endround;
	    this.skill=this.unit.skill;
	    this.unit.endround=function() {
		this.er.call(this.unit);
		this.unit.skill=0;
		filltabskill();
		this.unit.showstats();
		this.unit.endround=function() {
		    this.er.call(this.unit);
		    this.unit.endround=this.er;
		    this.unit.skill=this.skill;
		    filltabskill();
		    this.unit.showstats();
		}.bind(this);
	    }.bind(this);
	},
	facedown: function() {
	    if (this.isactive) {
		this.isactive=false;
		this.unit.endround=this.er;
		this.unit.skill=this.skill;
		filltabskill();
		this.unit.showstats();
	    }
	}
    },
    { 
	name:"Blinded Pilot",
	count:2,
	type:"pilot",
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.gas=this.unit.getattackstrength;
	    this.cua=this.unit.cleanupattack;
	    this.unit.getattackstrength=function(w,t) { return 0; }
	    this.unit.cleanupattack=function() {
		this.cua.call(this.unit);
		this.unit.cleanupattack=this.cua;
		this.unit.getattackstrength=this.gas;
		this.isactive=false;
	    }.bind(this);
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    { 
	name:"Injured Pilot",
	count:2,
	type:"pilot",
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    var i;
	    this.isactive=true;
	    for (i=0; i<this.unit.upgrades.length; i++) {
		var upg=this.unit.upgrades[i];
		if (upg.type=="Elite") upg.isactive=false;
	    }
	    this.old={}
	    for (i in this.unit) {
		if (typeof this.unit[i]=="function") {
		    this.old[i]=this.unit[i];
		    delete this.unit[i];
		}
	    }
	    // Do not loose IA control on the unit !
	    if (TEAMS[this.unit.team].isia) $.extend(this.unit,IAUnit.prototype);
	    this.unit.show();
	},
	facedown: function() {
	    if (this.isactive) {
		var i;
		for (i in this.old) {
		    if (typeof this.old[i]=="function") this.unit[i]=this.old[i];
		}
		for (i=0; i<this.unit.upgrades.length; i++) {
		    var upg=this.unit.upgrades[i];
		    if (upg.type=="Elite") upg.isactive=true;
		}
		this.unit.show();
	    }
	    this.isactive=false;
	}
    },
    { 
	name:"Stunned Pilot",
	count:2,
	type:"pilot",
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: "+this.name.replace(/\'/g,"&#39;"));
	    this.isactive=true;
	    this.rc=this.unit.resolvecollision;
	    this.roc=this.unit.resolveocollision;
	    this.unit.resolvecollision=function() {
		this.unit.removehull(1);
		log("Stunned pilot: 1 <code class='hit'></code>");
		this.rc.call(this);
	    }.bind(this);
	    this.unit.resolveocollision=function() {
		this.unit.removehull(1);
		log("Stunned pilot: 1 <code class='hit'></code>");
		this.roc.call(this);
	    }.bind(this);
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.resolvecollision=this.rc;
		this.unit.resolveocollision=this.roc;
		log(this.unit.name+" not longer stunned");
	    }
	}
    }
];

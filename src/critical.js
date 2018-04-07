/* jshint esversion: 6 */
const V1="v1",V2="v2";
var CURRENT_DECK=V2;
function Critical(sh,i) {
	this.lethal=false;
	$.extend(this,CRITICAL_DECK[i]);
	this.no=this.name+i;
	sh.criticals.push(this);
	this.isactive=false;
	this.unit=sh;
    };
Critical.FACEUP=1;
Critical.FACEDOWN=2;
Critical.DISCARD=0;
Critical.V1="v1";
Critical.V2="v2";
Critical.prototype = {
    toString() {
	var a,b,d;
	var c="";
	if (!this.isactive) return "";
	var n=this.name;
	if (typeof CRIT_translation[this.name].name!="undefined") n=CRIT_translation[this.name].name;
	a="<td><code class='Criticalupg upgrades'></code></td>"; 
	b="<td class='tdstat'>"+n+"</td>";
	n="";
	if (typeof CRIT_translation[this.name].text!="undefined") n=formatstring(CRIT_translation[this.name].text);
	d="<td class='tooltip outoverflow'>"+n+"</td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    log() {
	this.unit.log("Critical: %0",this.name);
	var n="";
	if (typeof CRIT_translation[this.name].text!="undefined") {
	    n=formatstring(CRIT_translation[this.name].text);
	    log("<ul><li>"+n+"</li></ul>");
	} else log("no translation:"+this.name);
    }
};
var CRITICAL_DECK=[
    {
	type:"ship",
	count: 2,
	init:2,
	name:"Structural Damage",
	version:[V2],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getagility",this,function(a) {
		if (a>0) return a-1; else return a;
	    });
	},
	facedown:function() {
	    if (this.isactive) {
		this.unit.getagility.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.unit.showstats();
	    }
	    this.isactive=false;
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit"||roll=="critical") {
		this.facedown();
	    } else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	},
    },
    {
	type:"ship",
	count: 2,
	init:2,
	name:"Structural Damage (original)",
	version:[V1],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getagility",this,function(a) {
		if (a>0) return a-1; else return a;
	    });
	},
	facedown:function() {
	    if (this.isactive) {
		this.unit.getagility.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.unit.showstats();
	    }
	    this.isactive=false;
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit") {
		this.facedown();
	    } else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	},
    },
    {
	type:"ship",
	name:"Damaged Engine",
	version:[V1,V2],
	count: 2,
	init:2,
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    var save=[];
	    this.unit.wrap_after("getdial",this,function(a) {
		if (save.length===0) {
		    for (var i=0; i<a.length; i++) {
			save[i]={move:a[i].move,difficulty:a[i].difficulty};
			if (a[i].move.match(/TL\d|TR\d/)) save[i].difficulty="RED";
		    }
		}
		return save;
	    });
	},
	facedown: function() {
	    if (this.isactive) this.unit.getdial.unwrap(this);
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	name:"Console Fire",
	count: 2,
	init:2,
	version:[V1,V2],
	lethal:true,
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_before("begincombatphase",this,function() {
		var roll=this.rollattackdie(1,self,"blank")[0];
		if (roll=="hit") {
		    this.log("+1 %HIT% [%0]",this.name);
		    this.resolvehit(1); this.checkdead();
		}
	    });
	},
	action: function(n) {
	    this.facedown();
	    this.unit.endaction(n,"CRITICAL");
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.log("%0 repaired",this.name);		
		this.unit.begincombatphase.unwrap(this);
	    }
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	count: 2,
	name:"Weapon Malfunction",
	version:[V1],
	faceup:function() {
	    this.log();
	    this.isactive=true;
	    for (var i=0; i<this.unit.weapons.length;i++) 
		if (this.unit.weapons[i].isprimary) break;
	    this.w=i;
	    this.unit.weapons[i].wrap_after("getattack",this,function(a) {
		if (a>0) return a-1; else return a;
	    });	    
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.weapons[this.w].getattack.unwrap(this);
		this.unit.log("%0 repaired",this.unit.weapons[this.w].name);
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="critical"||roll=="hit") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    {
	type:"ship",
	count:2,
	init:2,
	name:"Damaged Sensor Array (original)",
	version:[V1],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getactionbarlist",this,function() { return [];});
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.getactionbarlist.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    {
	type:"ship",
	count:2,
	init:2,
	name:"Damaged Sensor Array",
	version:[V2],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getactionbarlist",this,function() { return [];});
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.getactionbarlist.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit"||roll=="critical") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    { 
	name:"Minor Explosion",
	count: 2,
	init:2,
	type:"ship",
	lethal:true,
	version:[V1],
	faceup: function() {
	    this.log();
	    var roll=this.unit.rollattackdie(1,this,"blank")[0];
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
	init:2,
	version:[V1,V2],
	type:"ship",
	faceup: function() {
	    this.log();
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
	init:2,
	version:[V1,V2],
	type:"ship",
	lethal:true,
	faceup: function() {
	    this.log();
	    //this.isactive=false;
	    this.unit.removehull(1);
	},
	facedown: function() {
	    this.isactive=false;
	    this.unit.hull++;
	}
    },
    {
	name:"Munitions Failure",
	count:2,
	init:2,
	type:"ship",
	version:[V1],
	lethal:true,
	faceup: function() {
	    this.log();
	    var m=[];
	    for (var i=0; i<this.unit.weapons.length; i++) {
		if (this.unit.weapons[i].issecondary) m.push(this.unit.weapons[i]);
	    }
	    this.isactive=false;
	    if (m.length===0) return;
	    var w=this.unit.rand(m.length);
	    this.wp=m[w];
	    this.wp.isactive=false;
	    this.unit.log(this.wp.name+" not functioning anymore");
	    this.unit.show();
	},
	facedown: function() { this.isactive=false;
	}
    },
    {
	name:"Minor Hull Breach",
	count:2,
	init:2,
	type:"ship",
	lethal:true,
	version:[V1],
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.hd=this.unit.handledifficulty;
	    this.unit.wrap_after("handledifficulty",this,function(d) {
		var roll=this.rollattackdie(1,self,"blank")[0];
		if (roll=="hit"&&d=="RED") {
		    this.log("+1 %HIT% [%0]",self.name);
		    this.removehull(1);
		}
	    });
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.handledifficulty.unwrap(this);
		this.isactive=false;
		this.unit.log("%0 repaired",this.name);
	    }
	}
    },
    { 
	name:"Damaged Cockpit",
	count:2,
	init:2,
	type:"pilot",
	version:[V1,V2],
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_before("endround",this,function() {
		this.wrap_after("getskill",self,function() {
		    return 0;
		});
		filltabskill();
		this.showstats();
	    }.bind(this.unit));
	},
	facedown: function() {
	    if (this.isactive) {
		this.isactive=false;
		this.unit.getskill.unwrap(this);
		filltabskill();
		this.unit.showstats();
	    }
	}
    },
    { 
	name:"Blinded Pilot",
	count:2,
	init:2,
	version:[V1],
	type:"pilot",
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getattackstrength",this,function(w,t,a) { this.getattackstrength.unwrap(self); self.isactive=false; return 0; });
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    { 
	name:"Blinded Pilot",
	count:2,
	init:2,
	version:[V2],
	type:"pilot",
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("canfire",this,function(b) { this.isactive=false; return false; }).unwrapper("endcombatphase");
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    { 
	name:"Injured Pilot",
	count:2,
	init:2,
	type:"pilot",
	lethal:true,
	version:[V1],
	faceup: function() {
	    this.log();
	    var i;
	    this.isactive=true;
	    for (i=0; i<this.unit.upgrades.length; i++) {
		var upg=this.unit.upgrades[i];
		if (upg.type==Unit.ELITE) upg.desactivate();
	    }
	    this.unit.desactivate();
	    this.unit.show();
	},
	facedown: function() {
	    if (this.isactive) {
		var i;
		if (typeof this.unit.init!="undefined") this.unit.init();
		for (i=0; i<this.unit.upgrades.length; i++) {
		    var upg=this.unit.upgrades[i];
		    if (upg.type==Unit.ELITE) {
			upg.isactive=true;
			if (typeof upg.init!="undefined") upg.init(this.unit);
		    }
		}
		this.unit.show();
	    }
	    this.isactive=false;
	}
    },
    { 
	name:"Stunned Pilot",
	count:2,
	init:2,
	version:[V1,V2],
	type:"pilot",
	lethal:true,
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_before("resolvecollision",this,function() {
		this.log("+1 %HIT% [%0]",self.name);
		this.resolvehit(1);
	    });
	    this.unit.wrap_before("resolveocollision",this,function() {
		this.log("+1 %HIT% [%0]",self.name);
		this.resolvehit(1);
	    });
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.resolvecollision.unwrap(this);
		this.unit.resolveocollision.unwrap(this);
		this.unit.log("no longer stunned");
	    }
	    this.isactive=false;
	}
    },
    {
	name:"Loose Stabilizer",
	count:2,
	init:2,
	type:"ship",
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("handledifficulty",this,function(d) {
		if (d=="WHITE") this.addstress();
	    });
	},
	action: function(n) {
	    this.facedown();
	    this.unit.endaction(n,"CRITICAL");
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.handledifficulty.unwrap(this);
		this.unit.log("%0 repaired",this.name);
	    }
	    this.isactive=false;
	},
	version:[V2]
    },
    {
	name:"Major Explosion",
	count:2,
	init:2,
	type:"ship",
	lethal:true,
	faceup:function() {
	    var self=this;
	    this.log();
	    var roll=this.unit.rollattackdie(1,this,"blank")[0];
	    if (roll=="hit") {
		this.unit.log("+1 %CRIT% [%0]",this.name);
		this.unit.resolvecritical(1);
	    }
	    this.isactive=false;
	},
	facedown:function() {},
	version:[V2]
    },
    { 
	name:"Major Hull Breach",
	count:2,
	init:2,
	type:"ship",
	lethal:true,
	version:[V2],
	faceup:function() {
	    var myround=round;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("deal",this,function(crit,face,p) {
		if (round==myround) return p;
		var dd=$.Deferred();
		p.done(function(c) {
		    c.face=Critical.FACEUP;
		    dd.resolve(c);
		});
		return dd.promise();
	    });
	},
	facedown: function() {
	    if (this.isactive) this.unit.deal.unwrap(this);
	    this.isactive=false;
	},
	action: function(n) {
	    this.facedown();
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    {
	name:"Shaken Pilot",
	count:2,
	init:2,
	type:"pilot",
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    var save=[];
	    var self=this;
	    this.unit.wrap_after("getdial",this,function(a) {
                // Special handling for Ionized; see FAQ
                // N.B. hasionizationeffect() forces dial to just White F1;
                // without an escape here, this combo returns a blank dial
                // and causes an infinite loop for the effected ship's planning phase
                if(this.hasionizationeffect()){
                    return a;
                }
                
		if (save.length===0) {
		    for (var i=0; i<a.length; i++) {
			if (!a[i].move.match(/F1|F2|F3|F4|F5/)) 
			    save.push({move:a[i].move,difficulty:a[i].difficulty});
		    }
		}
		return save;
	    });
	    this.unit.wrap_after("timeformaneuver",this,function(t) {
		if (t&&!this.hasionizationeffect()) self.facedown();
		return t;
	    });	    
	},
	facedown: function() {
	    if (this.isactive) {
		this.isactive=false;
		this.unit.getdial.unwrap(this);
		this.unit.timeformaneuver.unwrap(this);
	    }
	},
	version:[V2]
    },
    {
	name:"Weapons Failure",
	count:2,
	init:2,
	type:"ship",
	faceup: function() {
	    for (var i in this.weapons) 
		this.weapons[i].wrap_after("getattack",this,function(a) { return (a>0)?a-1:a; }); 
	},
	facedown: function() {
	    for (var i in this.weapons) 
		this.weapons[i].getattack.unwrap(this);
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit"||roll=="critical") {
		this.facedown();
	    } else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	},
	version:[V2]
    }
];
Critical.CRITICAL_DECK=CRITICAL_DECK;

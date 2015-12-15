var ROCKIMG="png/asteroid.jpg";
var OBSTACLES=[];
var PX=[300,500,300,500,300,500];
var PY=[250,250,400,400,550,550];
var id=0;
function loadrock(s,str) {
    var i;
    var coord=[],o;
    PATTERN = s.image(ROCKIMG,0,0,200,200).pattern(0,0,200,200);
    if (str !="") {
	o=str.split(";");
	for (i=0; i<6; i++) coord[i]=Base64.toCoord(o[i]);
    } else for (i=0; i<6; i++) coord[i]=[0,0,0];
    for (i=1; i<=6; i++) {
	(function(i) {
	Snap.load("data/rock"+i+".svg", function(fragment) {
	    OBSTACLES.push(new Rock(fragment,coord[i-1]));
	});
	})(i)
    }
}
function saverock() {
    var i;
    var str=OBSTACLES[0].toASCII();
    for (i=1; i<6; i++) 
	str+=";"+OBSTACLES[i].toASCII();
    return str;
}
function getid() {
    return id++;
}

function Rock(fragment,coord) {    
    var k;
    var i=getid();
    this.g=fragment.select("path");
    this.g.attr({
	fill: PATTERN,
	strokeWidth: 0,
	stroke: "#F00",
    });
    this.o=[];
    this.name="Asteroid #"+i;
    this.arraypts=[];
    for (k=0; k<this.g.getTotalLength(); k+=5) 
	this.arraypts.push(this.g.getPointAtLength(k));
    this.dragged=false;
    this.tx=coord[0];
    this.ty=coord[1];
    this.alpha=coord[2];
    this.m=(new Snap.Matrix()).translate(coord[0]+PX[i],coord[1]+PY[i]).rotate(coord[2],0,0).scale(0.5,0.5);
    this.g.drag(this.dragmove.bind(this), 
		this.dragstart.bind(this),
		this.dragstop.bind(this));
    this.path="";
    this.g.hover(function() {this.g.attr({strokeWidth:4});}.bind(this),
		 function()  {this.g.attr({strokeWidth:0});}.bind(this));
    this.g.addClass("unit");
    var b=this.g.getBBox();
    this.o=[];
    for (k=1; k<4; k++) {
	this.o[k]=s.ellipse(b.x+b.width/2,b.y+b.height/2,200*k+b.width/2,200*k+b.height/2).attr({pointerEvents:"none",display:"none",fill:WHITE,opacity:0.3,strokeWidth:2});
    }
    this.g.transform('t '+(-b.width/2)+" "+(-b.height/2));
    this.getOutlineString();
    this.show();
}

Rock.prototype = {
    toASCII: function() {
	var s=Base64.fromCoord([this.tx,this.ty,this.alpha]);;
	return s;
    },
    getrangeallunits: function () { return Unit.prototype.getrangeallunits.call(this);},
    getrange: function(sh) { return Unit.prototype.getrange.call(this,sh); },
    gethitrangeallunits: function () {return [[],[],[],[]]},
    togglehitsector: function() {},
    togglerange: function() { },
    getOutlinePoints: function () {
	var k;
	var pts=[];
	for (k=0; k<this.arraypts.length; k+=5)
	    pts.push(transformPoint(this.m,this.arraypts[k]));
	pts.obstacle=true;
	return pts;
    },
    getBox: function() { },
    getOutline: function() {
	var out= s.path(this.path); 
	out.appendTo(s);
	return out;
    },
    getOutlineString: function() {
	var k;
	var pts=[];
	this.path="M ";
	for (k=0; k<this.arraypts.length; k+=5) {
	    var p=transformPoint(this.m,this.arraypts[k]);
	    pts.push(p);
	    this.path+=p.x+" "+p.y+" ";
	    if (k==0) this.path+="L ";
	}
	this.path+="Z";
	//s.path(this.path).attr({fill:WHITE,opacity:0.5,class:"possible"});
	return {s:this.path,p:pts};
    },
    turn: function(n) {
	this.m.add(MR(n,0,0));
	this.alpha+=n
	this.show();
    },
    unselect: function() {
    },
    select: function() { 
	if (phase==SETUP_PHASE) {
	    var old=activeunit;
	    activeunit=this;
	    old.unselect();
	    this.showpanel();
	}
    },
    showpanel: function() { Unit.prototype.showpanel.call(this); },
    dragmove: function(dx,dy,x,y) { Unit.prototype.dragmove.call(this,dx,dy,x,y); },
    dragstart: function(x,y,a) {
	var old=activeunit;
	activeunit=this;
	old.unselect();
	Unit.prototype.dragstart.call(this,x,y,a);
	this.dragshow(); 
    },
    dragshow: function() {
	for (var k=1; k<4; k++) 
	    this.o[k].transform(this.dragMatrix).attr({display:"block"}).appendTo(VIEWPORT);
	this.g.transform(this.dragMatrix);
	this.g.appendTo(VIEWPORT);
    },
    showhitsector: function() {},
    dragstop: function(a) { 
	for (var k=1; k<4; k++) 
	    this.o[k].attr({display:"none"});
	Unit.prototype.dragstop.call(this,a);
    },
    show: function() {
	this.g.transform(this.m);
	this.g.appendTo(VIEWPORT);
    }
}
function Critical(sh,i) {
    this.lethal=false;
    $.extend(this,CRITICAL_DECK[i]);
    this.no=this.name+i;
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
	d="<td class='tooltip outoverflow'>"+n+"</td>";
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
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.unit.wrap_after("getagility",this,function(a) {
		if (a>0) return a-1; else return a;
	    });
	},
	facedown:function() {
	    if (this.isactive) {
		this.unit.getagility.unwrap();
		//this.unit.criticals.splice(this,1);
		log(this.name+" repaired, +1 agility for "+this.unit.name);
		this.unit.showstats();
	    }
	    this.isactive=false;
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1)[0];
	    if (roll=="hit") {
		this.facedown();
	    } else log(this.name+" not repaired for "+this.unit.name);
	    this.unit.endaction(n,"CRITICAL");
	},
    },
    {
	type:"ship",
	name:"Damaged Engine",
	count: 1,
	faceup: function() {
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.gd=this.unit.getdial;
	    this.unit.wrap_after("getdial",this,function(a) {
		var b=[];
		for (var i=0; i<a.length; i++) {
		    b[i]={move:a[i].move,difficulty:a[i].difficulty};
		    if (a[i].move.match("TL\d|TR\d")) b[i].difficulty="RED";
		}
		return b;
	    });
	},
	facedown: function() {
	    if (this.isactive) this.unit.getdial.unwrap();
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	name:"Console Fire",
	count: 2,
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.unit.wrap_before("begincombatphase",this,function() {
		var roll=this.rollattackdie(1)[0];
		if (roll=="hit") {
		    log("Console in fire for "+this.name+": 1 <code class='hit'></code>");
		    this.resolvehit(1); this.checkdead();
		}
	    }.bind(this.unit));
	},
	action: function(n) {
	    this.facedown();
	    this.unit.endaction(n,"CRITICAL");
	},
	facedown: function() {
	    if (this.isactive) {
		log("Console no longer in fire for "+this.unit.name);		
		this.unit.begincombatphase.unwrap();
	    }
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	count: 2,
	name:"Weapon Malfunction",
	faceup:function() {
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    var i;
	    for (i=0; i<this.unit.weapons.length;i++) 
		if (this.unit.weapons[i].isprimary) break;
	    this.i=i;
	    this.w=this.unit.weapons[i];
	    this.ga=this.w.getattack;
	    this.w.getattack=function() {
		var a=this.ga.call(this.w);
		if (a>0) return a-1; else return a;
	    }.bind(this);
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.weapons[this.i].getattack=this.ga;
		log("Primary weapon for "+this.unit.name+" functioning again.");
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1)[0];
	    if (roll=="critical"||roll=="hit") this.facedown();
	    else log("Primary weapon for "+this.unit.name+" not functioning.");
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    {
	type:"ship",
	count:2,
	name:"Damaged Sensor Array",
	faceup: function() {
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.gsal=this.unit.getactionbarlist;
	    this.unit.getactionbarlist=function() { return [];};
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.getshipactionlist=this.gsal;
		log("Sensor array for "+this.unit.name+" functioning again.");
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1)[0];
	    if (roll=="hit") this.facedown();
	    else log("Sensor array still damaged for "+this.unit.name);
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    { 
	name:"Minor Explosion",
	count: 2,
	type:"ship",
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: %0",this.name);
	    var roll=this.unit.rollattackdie(1)[0]
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
	    this.unit.log("Critical: %0",this.name);
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
	    this.unit.log("Critical: %0",this.name);
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
	    this.unit.log("Critical: %0",this.name);
	    var m=[];
	    for (i=0; i<this.unit.weapons.length; i++) {
		if (!this.unit.weapons[i].isprimary) m.push(this.unit.weapons[i]);
	    }
	    this.isactive=false;
	    if (m.length==0) return;
	    var w=this.unit.rand(m.length);
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
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.hd=this.unit.handledifficulty;
	    this.unit.handledifficulty=function(d) {
		this.hd.call(this.unit,d);
		var roll=this.unit.rollattackdie(1)[0];
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
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.skill=this.unit.skill;
	    this.unit.wrap_before_once("endround",this,function() {
		this.skill=0;
		filltabskill();
		this.showstats();
	    }.bind(this.unit));
	},
	facedown: function() {
	    if (this.isactive) {
		this.isactive=false;
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
	    this.unit.log("Critical: %0",this.name);
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
	    this.unit.log("Critical: %0",this.name);
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
	    this.unit.log("Critical: %0",this.name);
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
/*
  Juno
  Chiraneau
  Jake
  K4 Droid
  french translation

  remaining:
  Genius
  Biggs
  Advanced targeting system 
 */
var s;
var GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0",GREY="#888";
var HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880",HALFGREY="#444";
var TIMEANIM=1000;
var FACE=["focus","hit","critical","evade","blank"];
var ATTACKDICE= [0,0,1,1,1,2,4,4];
var DEFENSEDICE=[0,0,3,3,3,4,4,4];
var MPOS={ F0:[0,3],F1:[1,3],F2:[2,3],F3:[3,3],F4:[4,3],F5:[5,3],	
	   BL1:[1,2],BL2:[2,2],BL3:[3,2],
	   TL1:[1,1],TL2:[2,1],TL3:[3,1],
	   BR1:[1,4],BR2:[2,4],BR3:[3,4],
	   TR1:[1,5],TR2:[2,5],TR3:[3,5],
	   K1:[1,6],K2:[2,6],K3:[3,6],K4:[4,5],K5:[5,5],
	   SL2:[2,0],SL3:[3,0],
	   SR2:[2,6],SR3:[3,6],
	   TRL3:[3,0],TRR3:[3,6]
	 };
var REBEL="REBEL",EMPIRE="EMPIRE",SCUM="SCUM";
var ILLICIT="Illicit",ELITE="Elite",TURRET="Turret",MISSILE="Missile",ASTROMECH="Astromech",TORPEDO="Torpedo",CANNON="Cannon",BOMB="Bomb",TECH="Tech",CREW="Crew",SYSTEM="System",SALVAGED="Salvaged",MOD="Mod",TITLE="Title";
var NOLOG=false;
var generics=[];
var gid=0;
var UNIQUE=[[],[],[]];
var ATTACKREROLLA=[];
var DEFENSEREROLLD=[];
var ATTACKMODA=[];
var ATTACKMODD=[];
var DEFENSEMODD=[];
var DEFENSEADD=[];
var xws_lookup=function(s) {
    for (var i in PILOT_dict) {
	if (PILOT_dict[i]==s) return i;
    }
    return "";
}
var upg_lookup=function(s) {
    for (var i in UPGRADE_dict) {
	if (UPGRADE_dict[i]==s) return i;
    }
    return "";
}
	  
var activeunit;
var unitlist;
var pilotlist;
var squadron=[];
var active=0;
var globalid=1;
var targetunit;
var PATTERN;
var SOUND_FILES=[
    "ogg/EXPLODE3",
    "ogg/KX9_laser_cannon",
    "ogg/TIE-Fire",
    "ogg/Slave1-Guns",
    "ogg/Falcon-Guns",
    "ogg/XWing-Fly1",
    "ogg/TIE-Fly2",
    "ogg/Slave1-Fly1",
    "ogg/Falcon-Fly1",
    "ogg/Falcon-Fly3",
    "ogg/YWing-Fly2",
    "ogg/ISD-Fly",
    "ogg/missile",
    "ogg/XWing-Fly2",
    "ogg/DStar-Gun4",
    "ogg/TIE-Fly6",
    "ogg/Slave1-Fly2",
    "ogg/ghost"
];
var SOUNDS={};
var SOUND_NAMES=["explode","xwing_fire","tie_fire","slave_fire","falcon_fire","xwing_fly","tie_fly","slave_fly","falcon_fly","yt2400_fly","ywing_fly","isd_fly","missile","xwing2_fly","dstar_gun","tie2_fly","slave2_fly","ghost"];
function loadsound() {
    var i;
    var sound;
    for (i=0; i<SOUND_FILES.length; i++) {
	SOUNDS[SOUND_NAMES[i]]=new buzz.sound( SOUND_FILES[i], {
	    formats: [ "ogg","wav" ],
	    preload: true
	});
    }
    SOUNDS["cloak"] = new buzz.sound( "ogg/cloak_romulan", {
	formats: [ "ogg","mp3" ],
	preload: true
    });
    SOUNDS["decloak"] = new buzz.sound( "ogg/decloak_romulan", {
	formats: [ "ogg","mp3" ],
	preload: true
    });
}
function transformPoint(matrix,point)  {
    var dx = point.x * matrix.a + point.y * matrix.c + matrix.e;
    var dy = point.x * matrix.b + point.y * matrix.d + matrix.f;
    return { x: dx, y: dy };
} 

function halftone(c) {
    if( c==GREEN) return HALFGREEN;
    if (c==RED) return HALFRED;
    if (c==WHITE) return HALFWHITE;
    if (c==BLUE) return HALFBLUE;
    if (c==YELLOW) return HALFYELLOW;
    if (c==GREY) return HALFGREY;
    return c;
}

var MS = function(x,y) { return (new Snap.Matrix().scale(x,y));}
var MT = function(x,y) { return (new Snap.Matrix()).translate(x,y); }
var MR = function(a,x,y) { return (new Snap.Matrix()).rotate(a,x,y); }
var C = { GREEN:"#0F0",RED:"#F00",WHITE:"#FFF" };
var P;
// Table of actions
var A = {
    ROLL:{key:"r",color:GREEN},
    SLAM:{key:"s",color:BLUE},
    FOCUS:{key:"f",color:GREEN},
    TARGET:{key:"l",color:BLUE},
    EVADE:{key:"e",color:GREEN},
    BOOST:{key:"b",color:GREEN},
    STRESS:{key:"?",color:RED},
    CLOAK:{key:"k",color:BLUE},
    ISTARGETED:{key:"l",color:RED},
    ASTROMECH:{key:"A",color:YELLOW},
    CANNON:{key:"C",color:YELLOW},
    CREW:{key:"W",color:YELLOW},
    MISSILE:{key:"M",color:YELLOW},
    TORPEDO:{key:"P",color:YELLOW},
    ELITE:{key:"E",color:YELLOW},
    TURRET:{key:"U",color:YELLOW},
    UPGRADE:{key:"S",color:YELLOW},
    CRITICAL:{key:"c",color:RED},
    SALVAGED:{key:"V",color:YELLOW},
    BOMB:{key:"B",color:YELLOW},
    TITLE:{key:"t",color:YELLOW},
    MOD:{key:"m",color:YELLOW},
    SYSTEM:{key:"S",color:YELLOW},
    ILLICIT:{key:"I",color:YELLOW},
    LASER:{key:"%",color:RED},
    TURRETLASER:{key:"$",color:RED},
    BILASER:{key:"%",color:RED},
    LASER180:{key:"%",color:RED},
    NOTHING:{key:"&nbsp;",color:WHITE},
    HIT:{key:"d",color:WHITE},
    SHIELD:{key:"v",color:YELLOW},
    TECH:{key:"X",color:WHITE},
};
var AINDEX = ["ROLL","FOCUS","TARGET","EVADE","BOOST","STRESS","CLOAK","ISTARGETED","ASTRO","CANNON","CREW","MISSILE","TORPEDO","ELITE","TURRET","UPGRADE","CRITICAL","NOTHING"];

function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
}

function dist(p1,p2) {
    return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
}
function Unit(team) {
    var i;
    this.dead=false;
    this.hull=this.agility=this.skill=this.shield=0;
    this.ship={name:"",select:""};
    this.id=gid;
    this.pilotid=-1;
    var id=this.id;
    generics["u"+gid]=this;
    gid++;
    this.ship.select="<select id='select"+id+"' onchange='generics[\"u"+id+"\"].selectship()'>";
    this.team=team;
    this.faction=TEAMS[team].faction;
    this.ship.select+="<option disabled selected>"+UI_translation.selectu+"</option>";
    for (var s in unitlist) {
	if (unitlist[s].faction.indexOf(this.faction)>=0) {
	    var n=s;
	    if (typeof SHIP_translation[n]!="undefined") n=SHIP_translation[n];
	    this.ship.select+="<option value=\""+s+"\">"+n+"</option>"
	}
    } 
    this.ship.select+="</select>";
    this.shipactionList=[];
    this.dial=[];
    this.ordnance=false;
    this.dialselect="<table class='dial' id='dial"+id+"'></table>";
    this.pts="<td class='pts' id='pts"+id+"'></td>";
    this.text="<span id='text"+id+"' class='details'></span>";
    this.pilotselect="";
    this.name="";
    this.upgradesno=0;
    this.upgrades=[];
    this.removeupg=[];
    this.criticals=[];
    for (i=0; i<10; i++) this.removeupg[i]=Unit.prototype.defaultremoveupg;
    this.stats="<td class='stats' id='stats"+id+"'></td>";
    this.actions="<td class='actions' id='actions"+id+"'></td>";
    this.DEFENSEREROLLD=[];
    this.ATTACKREROLLA=[];
    this.ATTACKMODA=[];
    this.ATTACKADD=[];
    this.DEFENSEMODD=[];
    this.DEFENSEADD=[];
    this.tx=this.ty=this.alpha=0.;
}
Unit.prototype = {
    tosquadron: function(s) {
	var upgs=this.upg;
	//log(this.name+" has touching");
	this.touching=[];
	this.maneuver=-1;
	this.action=-1;
	this.actionsdone=[];
	this.hasmoved=false;
	this.hasdecloaked=false;
	this.actiondone=false;
	this.reroll=0;
	this.focus=0;
	this.lastmaneuver=-1;
	this.iscloaked=false;
	this.target=0;
	this.istargeted=[];
	this.targeting=[];
	this.stress=0;
	this.ionized=0;
	this.evade=0;
	this.hasfired=0;
	this.hitresolved=0;
	this.criticalresolved=0;
	this.m=new Snap.Matrix(); 
	this.collision=false;
	this.ocollision={overlap:-1,template:[],mine:[]};
	for (j in upgs) if (upgs[j]>-1) Upgradefromid(this,upgs[j])
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	var img=this.ship.img[0];

	if (!(this.islarge)) {
	    if (typeof this.shipimg!="undefined") {
		this.log("alternative image");
		img=this.shipimg;
	    }
	    if (typeof img=="undefined") 
		this.img=s.text(-10,10,this.ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction=="SCUM")?'r -1 1':'')).attr({
		class:"xwingship",
	    }); else 	    this.img=s.image("png/"+img,-20*this.scale,-20*this.scale,40*this.scale,40*this.scale).transform('r 90 0 0');


	    this.imgsmoke= s.image("png/smoke.gif",-20,-60,30,50).transform('r 180 0 0').attr({display:"none"});
	    this.imgflame=s.image("png/out.gif",-15,-40,20,40).transform('r 180 0 0').attr({display:"none"});
	} else {
	    if (typeof img=="undefined") 
	    this.img=s.text(0,0,this.ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction=="SCUM")?'s 2 -2':'s 2 2')+'t -15 5').attr({
		class:"xwingship",
	    });
	    else this.img=s.image("png/"+this.ship.img[0],-50*this.scale,-50*this.scale,100*this.scale,100*this.scale).transform('r 90 0 0');
	    this.imgsmoke= s.image("png/smoke.gif",-20,-60,30,50).transform('r 180 0 0').attr({display:"none"});
	    this.imgflame=s.image("png/out.gif",-15,-40,20,40).transform('r 180 0 0').attr({display:"none"});
	    
	}
	var w=(this.islarge)?40:20;
	this.outline = s.rect(-w,-w,2*w,2*w).attr({
            fill: "rgba(8,8,8,0.5)",
            strokeWidth: 2,
	});
	this.skillbar=s.text(1-w,3-w,repeat('u',this.skill))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#fa0",
	    });
	this.firebar=s.text(1-w,5-w,repeat('u',this.weapons[0].attack))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#f00",
	    });
	this.evadebar=s.text(1-w,7-w,repeat('u',this.agility))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#0f0",
	    });
	this.hullbar=s.text(1-w,9-w,repeat('u',this.hull))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#cc0",
	    });
	this.shieldbar=s.text(1-w,9-w,repeat('u',this.shield+this.hull))
	    .transform('r -90 0 0').attr({
	    class: "xsymbols",
		fill:"#0af",
	    });
	this.gstat=s.group(this.skillbar,this.firebar,this.evadebar,this.shieldbar,this.hullbar);
	this.dialspeed = s.text(2+w,3-w,"").attr({class: "dialspeed"});
	this.dialdirection = s.text(w+8,3-w,"").attr({class: "symbols" });
	this.actionicon = s.text(w+2,-7,"").attr({class: "symbols",strokeWidth:0});
	this.sector = s.polygon(3-w,-w,0,0,w-3,-w).attr({
	    fill: this.color,
	    opacity:0.5,
	    strokeWidth: 0
	});
	this.ranges=[];
	this.sectors=[];
	this.infoicon=[];

	var i;
	for(i=0; i<4; i++) {
	    this.infoicon[i]=s.text(w-7,6-w+7*i,A[AINDEX[i+2]].key)
		.attr({class: "xsymbols",fill:A[AINDEX[i+2]].color,strokeWidth: 0
		      });
	}
	this.geffect=s.group(this.imgflame,this.imgsmoke);
	// Order in the group is important. Latest is on top of stacked layers
	this.g=s.group(this.sector,this.outline,this.img,this.dialspeed,this.dialdirection,this.actionicon,this.infoicon[0],this.infoicon[1],this.infoicon[2],this.infoicon[3],this.gstat);
	VIEWPORT.add(this.g);
	VIEWPORT.add(this.geffect);
	this.g.addClass("unit");
	this.g.hover(
	    function () { 
		var m=VIEWPORT.m.clone();
		var w=$("#svgout").width();
		var h=$("#svgout").height();
		var startX=0;
		var startY=0;
		if (h>w) startY=(h-w)/2;
		else startX=(w-h)/2;
		var max=Math.max(900./w,900./h);
		
		var bbox=this.g.getBBox();
		var p=$("#svgout").position();
		var min=Math.min($("#playmat").width(),$("#playmat").height());
		var x=m.x(bbox.x,bbox.y-20)/max;
		x+=p.left+startX;
		var y=m.y(bbox.x,bbox.y-20)/max;
		y+=p.top+startY;
		var name=this.name;
		var text=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
		if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
		$(".info").css({left:x,top:y}).html(name).appendTo("body").show();
	    }.bind(this),
	    function() { $(".info").hide(); 
		       }.bind(this));
	this.setdefaultclickhandler();

	this.upgrades.sort(function(a,b) { 
	    var pa=(a.isWeapon()?4:0)+(a.isBomb()?1:0); 
	    var pb=(b.isWeapon()?4:0)+(b.isBomb()?1:0);
	    return pb-pa;;
	});
	this.g.drag(this.dragmove.bind(this),
		    this.dragstart.bind(this),
		    this.dragstop.bind(this));
	this.addstdmod();
    },
    wrap_after: function (name,org,after) {
	var self=this;
	var save=self[name];
	var f=function () {
            var args = Array.prototype.slice.call(arguments),
            result;
            result = save.apply( this, args);
            result=after.apply( this, args.concat([result]));
	    return result;
	}
	f.save=save;
	f.org=org;
	f.unwrapper=function(name2) {
	    var uw=self.wrap_before(name2,self,function(a) {
		f.unwrap();
		uw.unwrap();
		return a;
	    });
	}
	f.unwrap=function(o) { self[name]=f.save; }
	this[name]=f;
	return f;
    },
    wrap_before_once: function(name,org,before) {
	var self=this;
	var save=self[name];
	var f=function () {
            var args = Array.prototype.slice.call(arguments),
            result;
	    f.unwrap();
            before.apply( this, args);
            result = save.apply( this, args);
	    return result;
	}
	f.save=save;
	f.org=org;
	f.unwrap=function() { self[name]=f.save; }
	this[name]=f;
	return f;
    },
    wrap_before: function(name,org,before) {
	var self=this;
	var save=self[name];
	var f=function () {
            var args = Array.prototype.slice.call(arguments),
            result;
            before.apply( this, args);
            result = save.apply( this, args);
	    return result;
	}
	f.save=save;
	f.org=org;
	f.unwrapper=function(name2) {
	    var uw=self.wrap_before(name2,self,function() {
		f.unwrap();
		uw.unwrap();
	    });
	}
	f.unwrap=function(o) { self[name]=f.save; }
	this[name]=f;
	return f;
    },
    defaultremoveupg: function(upgid,init) {
	var id=this.upg[upgid];
	$("#upgradetext"+this.id+"_"+upgid+" td:nth-child(3)").html("");
	$("#pts"+this.id+"_"+upgid).html("");
	if (id==-1) return;
	if (typeof UPGRADES[id].unique!="undefined") delete UNIQUE[this.team][UPGRADES[id].name];
	if (typeof UPGRADES[id].uninstall!="undefined") UPGRADES[id].uninstall(this);
	this.showdial();
	this.showstats();
	this.showactions();
	this.upg[upgid]=-1;
	if (init) {
	    $("#upgrade"+this.id+"_"+upgid+" option").prop("selected",false);
	    $("#upgrade"+this.id+"_"+upgid+" option[val=-1]").prop("selected",true);
	}
    },
    toJSON: function() {
	var s={};
	s.name=xws_lookup(this.name);
	s.points=PILOTS[this.pilotid].points;
	s.ship=xws_lookup(this.ship.name)
	var upgpt={};
	var pointsreduction={};
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u!=-1) {
		var up=UPGRADES[u];
		if (typeof upgpt[upg_lookup(up.type)]=="undefined") upgpt[upg_lookup(up.type)]=[];
		s.points+=up.points;
		if (typeof UPGRADES[u].pointsupg!="undefined") {
		    for (var j=0; j<UPGRADES[u].upgrades.length; j++)
			pointsreduction[UPGRADES[u].upgrades[j]]=UPGRADES[u].pointsupg;
		}
		upgpt[upg_lookup(up.type)].push(upg_lookup(up.name))
	    }
	}
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u!=-1) {
		if (typeof pointsreduction[UPGRADES[u].type]!="undefined") {
		    var r=pointsreduction[UPGRADES[u].type];
		    if (UPGRADES[u].points+r>0) s.points+=r;
		    else s.points-=UPGRADES[u].points;
		}
	    }
	}
	this.points=s.points;
	s.upgrades=upgpt;
	return s;
    },
    toJuggler: function(translated) {
	var s="";
	s=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (translated!=true||typeof s=="undefined"||typeof s.name=="undefined") 
	    s=this.name.replace(/\'/g,""); 
	else s=s.name.replace(/\'/g,"");
	for (var i=0; i<this.upg.length; i++) {
	    var upg=this.upg[i];
	    if (upg>-1) {
		var v=UPGRADES[upg].name+(UPGRADES[upg].type=="Crew"?"(Crew)":"");
		if (translated==true&&typeof UPGRADE_translation[v]!="undefined"&&typeof UPGRADE_translation[v].name!="undefined")
		  s += " + "+UPGRADE_translation[v].name.replace(/\(Crew\)/g,"").replace(/\'/g,"");
		else s += " + "+v.replace(/\(Crew\)/g,"").replace(/\'/g,"");
		
	    }
	}
	return s;
    },
    toASCII: function() {
	var s="";
	s+=Base64.fromNumber(this.pilotid);
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u>-1) { 
		s+=","+Base64.fromNumber(u);
	    }
	}
	s+="%"+Base64.fromCoord([this.tx,this.ty,this.alpha]);
	return s;
    },
    remove: function() {
	$("#unit"+this.id).remove();
	delete generics["u"+this.id];
	TEAMS[this.team].updatepoints();
    },
    toString2: function() {
	var i;
	var str2="";

	str2+="<table>";
	var text=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof text=="undefined"||typeof text.text=="undefined") text=""; else text="<span>"+formatstring(text.text)+"</span>";
	str2+="<tr>"+this.pts+"<td class='name'>"+this.pilotselect+"</td><td id='text"+this.id+"' class='upgtxt details' rowspan='3'>"+text+"</td></tr>";
	str2+="<tr><td></td>"+this.stats+"<td></td></tr>";
	str2+="<tr><td></td>"+this.actions+"<td></td></tr>";
	str2+="<tbody id='upgrade"+this.id+"'></tbody>";
	str2+="</table>";

	var str="<tbody class='generic' id='unit"+this.id+"'>";
	str+="<tr id='ship"+this.id+"' class='shipname'><td class='remover' onclick='generics[\"u"+this.id+"\"].remove();'>&#xd7;</td><td class='shipselection'>"+this.ship.select+"</td><td rowspan='2'>"+str2+"</td></tr>";
	str+="<tr><td></td><td>"+this.dialselect+"</td></tr></tbody>";
	$("#ship"+this.id+" .remover").click(function() {

		    }.bind(this));

	return str;
    },
    getagility: function() {
	return this.agility;
    },
    getdial: function() {
	if ((this.ionized>0&&!this.islarge) || this.ionized>1) {
	    return [{move:"F1",difficulty:"WHITE"}];
	}
	return this.dial;
    },
    doplan: function() { this.showdial(); return this.deferred; },
    showdial: function() {
	var m=[],i,j,d;
	var gd=this.getdial();
	if (phase==PLANNING_PHASE||phase==SELECT_PHASE||phase==CREATION_PHASE) {
	    for (i=0; i<=5; i++) {
		m[i]=[];
		for (j=0; j<=6; j++) m[i][j]="<td></td>";
	    }
	    var ship=$("#select"+this.id).val();
	    for (i=0; i<gd.length; i++) {
		d=gd[i];
		var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
		if (d.difficulty=="RED"&&this.stress>0) m[cx][cy]="<td></td>";
		else {
		    m[cx][cy]="<td";
		    if (phase==PLANNING_PHASE) 
			m[cx][cy]+=" onclick='activeunit.setmaneuver("+i+")'";
		    m[cx][cy]+=" class='symbols maneuver "+d.difficulty;
		    if (this.maneuver==i) m[cx][cy]+=" selected";
		    m[cx][cy]+="' >"+P[d.move].key+"</td>";
		}
	    }
	    var str="";
	    for (i=5; i>=0; i--) {
		str+="<tr>";
		if (i>0&&i<5) str+="<td>"+i+"</td>"; else str+="<td></td>";
		for (j=0; j<=6; j++) str+=m[i][j];
		str+="</tr>\n";
	    }
	    if (phase==SELECT_PHASE||phase==CREATION_PHASE) $("#dial"+this.id).html(str);
	    else $("#maneuverdial").html(str);
	}  
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.dialspeed.attr({text:""});
		this.dialdirection.attr({text:""});
		return;
	    };

	}
    },
    removepilot:function(all) {
	if (this.pilotid!=-1) {
	    for (k=0; k<10; k++) this.removeupg[k].call(this,k,true);
	    this.uninstall();
	    if (typeof UNIQUE[this.team][this.name]!= "undefined") {
		UNIQUE[this.team][this.name](this.name,false);
	    }
	}
	if (all==true) $("#name"+this.id).empty();
    },
    getpilotlist: function() {
	var i;
	var selected=-1;
	var ship=$("#select"+this.id).val();
	var ml=0;
	var p=[];
	for (i=0; i<PILOTS.length; i++) {
	    if (PILOTS[i].unit==ship && PILOTS[i].faction==this.faction) {
		var n=PILOTS[i].name;
		var idxn=n+(this.faction=="SCUM"?" (Scum)":"");
		if (typeof PILOT_translation[idxn]!="undefined"&& typeof PILOT_translation[idxn].name!="undefined") n=PILOT_translation[idxn].name;
		if (selected==-1&&PILOTS[i].unique!=true) selected=i;
		p.push({n:n,name:PILOTS[i].name,c:PILOTS[i].points,s:(selected==i)});
		var e=$("<span style='font-weight: bold;'>").html(n).appendTo("body");
		if (ml<e.width()) ml=e.width();
		e.remove();
	    }
	}
	if (ml<200) ml=200;
	for (i=0; i<p.length; i++) {
	    var j;
	    do {
		var e=$("<span>").html(p[i].n).appendTo("body");
		j=e.width();
		p[i].n+="&nbsp;";
		e.remove();
	    } while (j<ml);
	    $("#name"+this.id).append("<option"+(p[i].s?" selected":"")+" value=\""+p[i].name+"\">"+p[i].n+p[i].c+"</option>");
	}
    },
    selectship:function(vship,vname) {
	var i,k;
	var s=this.id;
	var selected=-1;
	var ship=vship;
	if (this.pilotselect=="") {
	    this.pilotselect="<select onchange='generics[\"u"+this.id+"\"].selectpilot()' id='name"+this.id+"'></select>";
	    $("#unit"+this.id+" .name").append(this.pilotselect);
	}
	if (typeof vship=="undefined") ship=$("#select"+this.id).val();
	var u=unitlist[ship];
	this.ship.firesnd=u.firesnd;
	this.ship.flysnd=u.flysnd;
	this.ship.code=u.code;
	this.ship.img=u.img;
	this.ship.hull=u.hull;
	this.ship.shield=u.shield;
	this.scale=u.scale;
	this.islarge=(u.islarge==true)?true:false;
	this.agility=u.evade;
	this.hull=u.hull;
	this.shield=u.shield;
	this.ship.name=ship;
	for (i=0; i<u.dial.length; i++) {
	    this.dial[i]={move:u.dial[i].move, difficulty:u.dial[i].difficulty};
	}
	this.shipactionList=u.actionList.slice(0);
	this.weapons=[];
	this.upgrades=[];
	this.criticals=[];
	this.bombs=[];
	this.lastdrop=-1;
	Laser(this,u.weapon_type,u.fire);
	$("#text"+this.id).html("");
	this.showdial();
	this.showactions();
	this.removepilot(true);
	this.getpilotlist();
	this.selectpilot(vname);
    },
    initupgradelist:function(type,upgid) {
	var p=PILOTS[this.pilotid];
	var str="";
	for (var j=0; j<UPGRADES.length; j++) {
	    var u=UPGRADES[j];
	    if (typeof u.faction != "undefined" 
		&& u.faction!=p.faction) continue;
	    if (typeof u.ship != "undefined" 
		&& p.unit.search(u.ship)==-1) continue;
	    if (typeof u.ishuge != "undefined") continue;
	    if (typeof u.islarge != "undefined" 
		&& this.islarge!=true) continue;
	    if (typeof u.skillmin != "undefined" 
		&& this.skill<u.skillmin) continue;
	    if (typeof u.noupgrades != "undefined" 
		&& p.upgrades.indexOf(u.noupgrades)>-1) continue;
	    if (typeof u.actionrequired != "undefined"
		&& this.shipactionList.indexOf(u.actionrequired.toUpperCase())==-1) continue;
	    if (type.match(u.type)) {
		var n=u.name;
		var n2=u.name+((u.type=="Crew")?"(Crew)":"")
		if (u.takesdouble==true && p.upgrades.indexOf(u.type)==p.upgrades.lastIndexOf(u.type)) continue;
		if (typeof UPGRADE_translation[n2]!="undefined"&&typeof UPGRADE_translation[n2].name!="undefined") n=UPGRADE_translation[n2].name;
		str+="<option value='"+j+"'>"+n+"</option>";
	    }
	}
	return str;
    },
    addupgradetype:function(type,upgid,bonus) {
	var str,head,bs=0;
	if (typeof bonus!="undefined") bs=bonus;
	head="<tr id='upgradetext"+this.id+"_"+upgid+"' class='upgrade'>";
	head+="<td><div class='pts' id='pts"+this.id+"_"+upgid+"'></div></td>";
	head+="<td><a href='#' class='upgrades "+(type=="Cannon|Torpedo|Missile"?"CannonTorpedoMissile":type)+"'></a>"; /* type.replace(/|/g,'')*/
	head+="<select id='upgrade"+this.id+"_"+upgid+"' onchange='generics[\"u"+this.id+"\"].selectupgrade(\""+type+"\","+upgid+","+bs+")'>";
	head+="<option value='-1' selected>"+UI_translation.none+"</option>";
	str=this.initupgradelist(type,upgid);
	if (str!="") {
	    head+=str+"</select></td><td class='details'></td></tr>";
	    $("#upgrade"+this.id).append(head);
	} else $("#upgrade"+this.id).append("<tr id='upgradetext"+this.id+"_"+upgid+"'><td></td><td></td><td></td></tr>");
    },
    showactions:function() {
	var str="";
	for (var i=0; i<this.shipactionList.length; i++) {
	    str+="<span class='symbols'>"+A[this.shipactionList[i]].key+"</span>";
	}
	$("#actions"+this.id).html(str);

    },
    selectpilot:function(vname) {
	var i,j,k;
	this.removepilot(false);
	var name=vname;
	if (typeof vname=="undefined") name=$("#name"+this.id).val();
	for (i=0; i<PILOTS.length; i++) {
	    if (name.indexOf(PILOTS[i].name)==0&&this.faction==PILOTS[i].faction) break;
	}
	this.name=PILOTS[i].name;
	if (i==PILOTS.length) return;
	this.pilotid=i;
	this.unique=PILOTS[i].unique==true?true:false;
	this.skill=PILOTS[i].skill;
	this.install=(typeof PILOTS[i].install!="undefined")?PILOTS[i].install:function() {};
	this.uninstall=(typeof PILOTS[i].uninstall!="undefined")?PILOTS[i].uninstall:function() {};
	var up=PILOTS[i].upgrades;
	this.upg=[];
	for (j=0; j<10; j++) {this.upg[j]=-1};
	$("#upgrade"+this.id).html("");
	for (k=0; k<up.length; k++) 
	    this.addupgradetype(up[k],k);
	this.addupgradetype("Mod",up.length);
	this.addupgradetype("Title",up.length+1);
	this.upgradesno=up.length+2;
	this.install(this);

	if (this.unique&&typeof vname=="undefined") {
	    //log(this.name+" is a unique pilot");
	    var up=UNIQUE[this.team][this.name];
	    if (typeof up != "undefined") UNIQUE[this.team][this.name](this.name,true);
	    UNIQUE[this.team][this.name]=function(name,other) {
		if (other) {
		    this.removepilot(true);
		    this.getpilotlist();
		    log("UNIQUE selectpilot");
		    this.selectpilot();
		} else delete UNIQUE[this.team][name];
	    }.bind(this);
	}
 
	var up=PILOTS[this.pilotid].upg;
	var text=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof text=="undefined"||typeof text.text=="undefined") text=""; else text="<span>"+formatstring(text.text)+"</span>";
	$("#text"+this.id).html(text);
	this.showstats();
	$("#pts"+this.id).html(PILOTS[this.pilotid].points);
	TEAMS[this.team].updatepoints();
   },
    selectupgrade: function(type,upgid,bonus) {
	/* Remove previous upgrade */
	this.removeupg[upgid].call(this,upgid,false);
	/* Add new upgrade */
	var upgrade=$("#upgrade"+this.id+"_"+upgid).val();
	this.upg[upgid]=upgrade;
	if (upgrade==-1) { 
	    $("#upgrade"+this.id+"_"+upgid).css({margin:"0px"});
	    $("#pts"+this.id+"_"+upgid).html("");
	    TEAMS[this.team].updatepoints();
	    return; 
	}
	$("#upgrade"+this.id+"_"+upgid).css({margin:"0 0 30px 0"});

	if (typeof UPGRADES[upgrade].install != "undefined") {
	    UPGRADES[upgrade].install(this);
	}
	if (UPGRADES[upgrade].unique==true) {
	    var up=UPGRADES[upgrade];
	    //log(up.name+" is a unique upgrade");
	    if (typeof UNIQUE[this.team][up.name] != "undefined") UNIQUE[this.team][up.name](up.name,true);
	    UNIQUE[this.team][up.name]=function(name,reset) {
		//log("Removing unique upgrade "+name);
		this.obj.removeupg[this.key].call(this.obj,this.key,reset);
		delete UNIQUE[this.team][name];
	    }.bind({key:upgid,obj:this});
	}
	var pts=UPGRADES[upgrade].points+bonus;
	if (UPGRADES[upgrade].points>0&&pts<0) pts=0;
	$("#pts"+this.id+"_"+upgid).html(pts);
	var u=UPGRADES[upgrade];
	var text=UPGRADE_translation[u.name+(type=="Crew"?"(Crew)":"")];
	if (typeof text=="undefined"||typeof text.text=="undefined") text=""; else text="<span>"+formatstring(text.text)+"</span>";
	$("#upgradetext"+this.id+"_"+upgid+" td:last-child").html((u.attack?"<span><b class='statfire'>"+u.attack+"</b>["+u.range[0]+"-"+u.range[1]+"], </span>":"")+text);

	/* Add action */
	var addedaction=UPGRADES[upgrade].addedaction;
	if (typeof addedaction!="undefined") {
	    var added=addedaction.toUpperCase();
	    this.shipactionList.push(added);
	    this.removeupg[upgid]=function(upgid,reset) {
		var upgrade=this.upg[upgid];
		var x=this.shipactionList.indexOf(UPGRADES[upgrade].addedaction.toUpperCase());
		if (x>-1) this.shipactionList.splice(x,1);
		this.defaultremoveupg(upgid,reset);
		this.removeupg[upgid]=this.defaultremoveupg;
	    }.bind(this);
	}
	/* Emperor */
	if (UPGRADES[upgrade].takesdouble==true) {
	    var rupg=[];
	    var j;
	    for (j=0; j<10; j++) if (upgid!=j&&$("#upgradetext"+this.id+"_"+j+" ."+type).length>0) rupg.push(j);
	    $("#upgrade"+this.id+"_"+rupg[0]).val(-1).change();
	    $("#upgrade"+this.id+"_"+rupg[0]).prop("disabled",true);
	    this.removeupg[upgid]=function(upgid,reset) {
		for (j=0; j<10; j++) {
		    if (upgid!=j&&$("#upgrade"+this.id+"_"+j).is(":disabled")) {
			$("#upgrade"+this.id+"_"+j).prop("disabled",false);
		    }
		}
		this.removeupg[upgid]=this.defaultremoveupg;
		this.defaultremoveupg.call(this,upgid,reset);
	    }.bind(this);
	}

	var upgaddons=UPGRADES[upgrade].upgrades;
	/* Adds more upgrade types */
	if (typeof upgaddons!="undefined") {
	    for (var j=0; j<upgaddons.length; j++)
		this.addupgradetype(upgaddons[j],this.upgradesno+j,UPGRADES[upgrade].pointsupg);
	    $("#upgrade"+this.id+"_"+upgid).prop("start",this.upgradesno);
	    this.removeupg[upgid]=function(upgid,reset) {
		var upgrade=this.upg[upgid];
		var upgaddons=UPGRADES[upgrade].upgrades;
		var start=$("#upgrade"+this.id+"_"+upgid).prop("start");
		for (var j=start; j<start+upgaddons.length; j++) { 
		    $("#upgradetext"+this.id+"_"+j).remove();
		    this.removeupg[j].call(this,j,true);
		}
		this.upgradesno-=upgaddons.length;
		this.defaultremoveupg(upgid,reset);
		this.removeupg[upgid]=this.defaultremoveupg;
	    }.bind(this);
	    this.upgradesno+=upgaddons.length;
	}
	this.showdial();
	this.showactions();
	this.showstats();
	
	TEAMS[this.team].updatepoints();
    },
    // Rolls results are deducted from probabilistic repartition...
    getattacktable: function(n) { return ATTACK[n]; },
    attackroll: function(n) {
	var i,f,h,c;
	var P=this.getattacktable(n);
	var ptot=0;
	var r=Math.random();
	record(this.id,r,"attackroll");
	if (n==0) return 0;
	for (f=0; f<=n; f++) {
	    for (h=0; h<=n-f; h++) {
		for (c=0; c<=n-f-h; c++) {
		    i=f*100+h+10*c;
		    ptot+=P[i];
		    if (ptot>r) return 100*f+c*10+h; 
		}
	    }
	}
	return 0;
    },
    rollattackdie: function(n) { var p=[]; for (var i=0; i<n; i++) p.push(FACE[ATTACKDICE[this.rand(8)]]); return p; },
    rolldefensedie: function(n) { var p=[]; for (var i=0; i<n; i++) p.push(FACE[DEFENSEDICE[this.rand(8)]]); return p; },
    rand: function(n) { return Math.floor(Math.random()*n); },
    getdefensetable: function(n) { return DEFENSE[n]; },
    gethitreddice: function(r) { return r%10; },
    getcritreddice: function(r) { return (Math.floor(r/10))%10; },
    getfocusreddice:function(r) { return (Math.floor(r/100))%10; },
    getblankreddice:function(r,n) { return n-Math.floor(r/100)%10-Math.floor(r/10)%10-(r%10); }, 
    getevadegreendice:function(r) { return r%10; },
    getfocusgreendice:function(r) { return (Math.floor(r/10))%10; },
    defenseroll: function(n) {
	var i,e,f;
	var lock=$.Deferred();
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=Math.random();
	record(this.id,r,"defenseroll");
	if (n==0) return lock.resolve({dice:n,roll:0}).promise();
	if (typeof P=="undefined") {
	    console.log("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*10+e;
		ptot+=P[i];
		if (ptot>r) return lock.resolve({dice:n,roll:10*f+e}).promise();
	    }
	}
	return lock.resolve({dice:n,roll:0}).promise();
    },
    // org:origin, type: list of die type to reroll, n:number of
    // rerolls (function), req: prerequisite check
    addattackrerolla: function(org,t,n,require) {
	this.ATTACKREROLLA.push({org:org,type:t,n:n,req:require});
    },
    addglobalattackrerolla: function(org,t,n,require) {
	ATTACKREROLLA.push({org:org,type:t,n:n,req:require});
    },
    adddefensererolld: function(org,t,n,require) {
	this.DEFENSEREROLLD.push({org:org,type:t,n:n,req:require});	
    },
    addglobaldefensereroll:function(org,t,n,require) {
	DEFENSEREROLLD.push({org:org,type:t,n:n,req:require});
    },
    addattackmoda: function(org,require,f,global,str,token) {
	if (global) ATTACKMODA.push({org:org,req:require,f:f,str:str,token:token});
	else this.ATTACKMODA.push({org:org,req:require,f:f,str:str,token:token});
    },
    addattackmodd: function(org,require,f,str) {
	ATTACKMODD.push({org:org,req:require,f:f,str:str});
    },
    addattackadd: function(org,require,f,str) {
	this.ATTACKADD.push({org:org,req:require,f:f,str:str});
    },
    adddefenseadd: function(org,require,f,str,token) {
	this.DEFENSEADD.push({org:org,req:require,f:f,str:str,token:token});
    },
    adddefensemodd: function(org,require,f,global,str,token) {
	if (global) DEFENSEMODD.push({org:org,req:require,f:f,str:str,token:token});
	else this.DEFENSEMODD.push({org:org,req:require,f:f,str:str,token:token});
    },
    setclickhandler: function(f) {
	this.g.unmousedown();
	this.g.mousedown(f);
    },
    setdefaultclickhandler: function() {
	this.g.unmousedown();
	this.g.mousedown(function() { this.select();}.bind(this));
    },
    dragshow: function() {
	this.g.transform(this.dragMatrix);
	this.geffect.transform(this.dragMatrix);
    },
    dragmove: function(dx,dy,x,y) {
	// scaling factor
	var spl=VIEWPORT.m.split();
	var max=Math.max(900./$("#svgout").width(),900./$("#svgout").height());
	var ddx=dx*max/spl.scalex;
	var ddy=dy*max/spl.scalex;
	this.dragMatrix=MT(ddx,ddy).add(this.m);
	this.dx=ddx;
	this.dy=ddy;
	this.dragged=true;
	$(".phasepanel").hide();
	this.dragshow();
    },
    dragstart:function(x,y,a) { this.showhitsector(false); this.dragMatrix=this.m; this.dragged=false; },
    dragstop: function(a) { 
	if (this.dragged) { 
	    this.m=this.dragMatrix; this.showpanel();
	    this.tx+=this.dx; this.ty+=this.dy;
	}
	this.dragged=false;
    },
    isinzone: function(m) {
	var op=this.getOutlinePoints(m);
	var zone;
	var i;
	if (typeof SETUP.playzone1!="undefined"&&this.team==1) 
	    zone=SETUP.playzone1;
	else zone=SETUP.playzone;
	for (i=0; i<4; i++)
	    //if (op[i].x<0||op[i].x>900||op[i].y<0||op[i].y>900) return false;
	    if (!Snap.path.isPointInside(zone,op[i].x,op[i].y)) return false;
	return true;
    },
    getOutlinePoints: function(m) {
	var w=(this.islarge)?40:20;
	if (typeof m=="undefined") m=this.m;
	var p1={x:m.x(-w,-w),y:m.y(-w,-w)};
	var p2={x:m.x(w,-w),y:m.y(w,-w)};
	var p3={x:m.x(w,w),y:m.y(w,w)};
	var p4={x:m.x(-w,w),y:m.y(-w,w)};
	var op=[p1,p2,p3,p4];
	return op;
    },
    getOutlineString: function(m) {
	var p=this.getOutlinePoints(m);
	return {s:"M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+" "+p[2].x+" "+p[2].y+" "+p[3].x+" "+p[3].y+" Z",p:p};  
    },
    getOutline: function(m) {
	var w=(this.islarge)?40:20;
	var p=s.rect(-w,-w,2*w,2*w);
	var t=s.text(w+8,3-w,"8").attr({class: "symbols",fontSize:"1.3em"});
	var g=s.g(t,p).transform(m).attr({fill:this.color,opacity:0.3,display:"none"});
	return g;
    },
    getRangeString: function(n,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 1 ";
	var p1=transformPoint(m,{x:-w,y:-100*n-w});
	var p2=transformPoint(m,{x:w,y:-100*n-w});	
	var p3=transformPoint(m,{x:100*n+1+w,y:-w});
	var p4=transformPoint(m,{x:100*n+1+w,y:w});
	var p5=transformPoint(m,{x:w,y:100*n+1+w});
	var p6=transformPoint(m,{x:-w,y:100*n+1+w});
	var p7=transformPoint(m,{x:-100*n-w-1,y:w});
	var p8=transformPoint(m,{x:-100*n-w-1,y:-w});
	return ("M "+p2.x+" "+p2.y+circle+p3.x+" "+p3.y+" L "+p4.x+" "+p4.y+circle+p5.x+" "+p5.y+" L "+p6.x+" "+p6.y+circle+p7.x+" "+p7.y+" L "+p8.x+" "+p8.y+circle+p1.x+" "+p1.y+" Z");
    },
    getHalfRangeString: function(n,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 0 ";
	var p3=transformPoint(m,{x:100*n+1+w,y:0});
	var p4=transformPoint(m,{x:100*n+1+w,y:-w});
	var p5=transformPoint(m,{x:w,y:-100*n-1-w});
	var p6=transformPoint(m,{x:-w,y:-100*n-1-w});
	var p7=transformPoint(m,{x:-100*n-w-1,y:-w});
	var p8=transformPoint(m,{x:-100*n-w-1,y:0});
	return ("M "+p3.x+" "+p3.y+" L "+p4.x+" "+p4.y+circle+p5.x+" "+p5.y+" L "+p6.x+" "+p6.y+circle+p7.x+" "+p7.y+" L "+p8.x+" "+p8.y+" "+p3.x+" "+p3.y);
    },
    getSubRangeString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 1 ";
	var p1=transformPoint(m,{x:-w,y:-100*n1-w});
	var p2=transformPoint(m,{x:w,y:-100*n1-w});	
	var p9=transformPoint(m,{x:50*n1+w,y:-100*n1-w});
	var p10=transformPoint(m,{x:100*n1+w,y:-50*n1-w});
	var p3=transformPoint(m,{x:100*n1+w,y:-w});
	var p4=transformPoint(m,{x:100*n1+w,y:w});
	var p5=transformPoint(m,{x:w,y:100*n1+w});
	var p6=transformPoint(m,{x:-w,y:100*n1+w});
	var p7=transformPoint(m,{x:-100*n1-w,y:w});
	var p8=transformPoint(m,{x:-100*n1-w,y:-w});
	var str="M "+p1.x+" "+p1.y+" L "+p2.x+" "+p2.y+circle+p3.x+" "+p3.y+" L "+p4.x+" "+p4.y+circle+p5.x+" "+p5.y+" L "+p6.x+" "+p6.y+circle+p7.x+" "+p7.y+" L "+p8.x+" "+p8.y+circle+p1.x+" "+p1.y;
	circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 0 ";
	p1=transformPoint(m,{x:-w,y:-100*n2-w});
	p2=transformPoint(m,{x:w,y:-100*n2-w});	
	p3=transformPoint(m,{x:100*n2+w,y:-w});
	p4=transformPoint(m,{x:100*n2+w,y:w});
	p5=transformPoint(m,{x:w,y:100*n2+w});
	p6=transformPoint(m,{x:-w,y:100*n2+w});
	p7=transformPoint(m,{x:-100*n2-w,y:w});
	p8=transformPoint(m,{x:-100*n2-w,y:-w});
	str+=" L "+p1.x+" "+p1.y+circle+p8.x+" "+p8.y+" L "+p7.x+" "+p7.y+circle+p6.x+" "+p6.y+" L "+p5.x+" "+p5.y+circle+p4.x+" "+p4.y+" L "+p3.x+" "+p3.y+circle+p2.x+" "+p2.y+" L "+p1.x+" "+p1.y;
	return str;
    },
    getHalfSubRangeString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 0 ";
	var p3=transformPoint(m,{x:100*n1+w,y:0});
	var p4=transformPoint(m,{x:100*n1+w,y:-w});
	var p5=transformPoint(m,{x:w,y:-100*n1-w});
	var p6=transformPoint(m,{x:-w,y:-100*n1-w});
	var p7=transformPoint(m,{x:-100*n1-w,y:-w});
	var p8=transformPoint(m,{x:-100*n1-w,y:0});
	var str="M "+p3.x+" "+p3.y+" L "+p4.x+" "+p4.y+circle+p5.x+" "+p5.y+" L "+p6.x+" "+p6.y+circle+p7.x+" "+p7.y+" L "+p8.x+" "+p8.y;
	var circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 1 ";
	p3=transformPoint(m,{x:100*n2+w,y:0});
	p4=transformPoint(m,{x:100*n2+w,y:-w});
	p5=transformPoint(m,{x:w,y:-100*n2-w});
	p6=transformPoint(m,{x:-w,y:-100*n2-w});
	p7=transformPoint(m,{x:-100*n2-w,y:-w});
	p8=transformPoint(m,{x:-100*n2-w,y:0});
	str+=" L "+p8.x+" "+p8.y+" L "+p7.x+" "+p7.y+circle+p6.x+" "+p6.y+" L "+p5.x+" "+p5.y+circle+p4.x+" "+p4.y+" L "+p3.x+" "+p3.y+" Z";
	return str;
    },
    getPrimarySectorString: function(n,m) {
	var w=(this.islarge)?40:20;
	var p=this.getSectorPoints(n,m);
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 1 ";
	var o=transformPoint(m,{x:0,y:0});
	return "M "+o.x+" "+o.y+" L "+p[0].x+" "+p[0].y+circle+p[1].x+" "+p[1].y+" L "+p[2].x+" "+p[2].y+circle+p[3].x+" "+p[3].y+" Z";
    },
    getPrimarySubSectorString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 1 ";
	var p=this.getSectorPoints(n1,m);
	var str="M "+p[0].x+" "+p[0].y+circle+p[1].x+" "+p[1].y+" L "+p[2].x+" "+p[2].y+circle+p[3].x+" "+p[3].y;
	p=this.getSectorPoints(n2,m);
	var circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 0 ";
	str+="L "+p[3].x+" "+p[3].y+circle+p[2].x+" "+p[2].y+" L "+p[1].x+" "+p[1].y+circle+p[0].x+" "+p[0].y+" Z";
	return str;
	
    },
    getSectorPoints: function(n,m) {
	var w=(this.islarge)?40:20;
	var socle=Math.sqrt((w-3)*(w-3)+w*w);
	var p1 = transformPoint(m,{x:-(socle+100*n)/Math.sqrt(1+w*w/(w-3)/(w-3)),
		  y:-(socle+100*n)/Math.sqrt(1+(w-3)*(w-3)/w/w)});
	var p2 = transformPoint(m,{x:-w+3,y:-w-100*n-1});
	var p3 = transformPoint(m,{x:w-3,y:-w-100*n-1});
	var p4 = transformPoint(m,{x:(socle+100*n)/Math.sqrt(1+w*w/(w-3)/(w-3)),
		  y:-(socle+2+100*n)/Math.sqrt(1+(w-3)*(w-3)/w/w)});
	return [p1,p2,p3,p4];
    },
    setmaneuver: function(i) {
	this.lastmaneuver=this.maneuver;
	this.maneuver=i;
	record(this.id,i,"setmaneuver");
	this.showdial();
	this.showmaneuver();
	if (typeof this.deferred == "undefined") this.log("undefined deferred");
	this.deferred.notify();
    },
    nextmaneuver: function() {
	if (this.maneuver<0) { this.maneuver=0; }
        else { this.maneuver=(this.maneuver==this.dial.length-1)?0:this.maneuver+1; }
	if (this.getmaneuver().difficulty=="RED"&&this.stress>0) {
	    this.nextmaneuver();
	}
	enablenextphase();
	this.showdial();
    },
    prevmaneuver: function() {
	if (this.maneuver<0) { this.maneuver=this.dial.length-1; } 
        else {this.maneuver=(this.maneuver==0)?this.dial.length-1:this.maneuver-1; }
	if (this.getmaneuver().difficulty=="RED"&&this.stress>0) {
	    this.prevmaneuver();
	}
	enablenextphase();
	this.showdial();
    },
    nextaction: function() {
	if (this.action==-1) { this.action=0; } 
	else {this.action=(this.action==this.actionList.length-1)?0:this.action+1;}
	//	var a = this.actionList[this.action];
	//	this.actionicon.attr({text:A[a].key, fill:A[a].color});
	//this.showaction();
    },
    prevaction: function() {
	if (this.action==-1) { this.action=0; } 
	else { this.action=(this.action==0)?this.actionList.length-1:this.action-1;}
	//	var a = this.actionList[this.action];
	//	this.actionicon.attr({text:A[a].key, fill:A[a].color});
	//this.showaction();
    },
    turn: function(n) {
	this.m.rotate(n,0,0);
	this.alpha+=n;
	this.show();
    },
    select: function() {
	/* TODO */
	if (this.dead) return activeunit;
	if (phase<ACTIVATION_PHASE
	    ||(phase==ACTIVATION_PHASE)
	    ||(phase==COMBAT_PHASE)) {
	    //if (this!=activeunit) $("#activationdial").hide();
	    //else $("#activationdial").show();
	    var old=activeunit;
	    activeunit=this;
	    if (old!=this) old.unselect();
	    $("#"+this.id).addClass("selected");
	    record(this.id,0,"select");
	    this.show();
	    center(this);
	}
	return activeunit;
    },
    unselect: function() {
	if (this==activeunit) return;
	$("#"+this.id).removeClass("selected");
	this.showoutline();
	this.showmaneuver();
	//if (phase==SETUP_PHASE&&typeof this.g!="undefined") { this.g.undrag(); }
    },
    getmcollisions: function(m) {
	var k,i,j;
	var pathpts=[],os=[],op=[];
	var mine=[];
	// Overlapping obstacle ? 
	var so=this.getOutlineString(m);
	os=so.s;
	op=so.p;
	for (k=6; k<OBSTACLES.length; k++){
	    var ob=OBSTACLES[k].getOutlineString();
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.isPointInside(ob.s,op)
		||this.isPointInside(os,ob.p)) {
		mine.push(k); 
		break;
	    }
	}
	return mine;
    },
    getocollisions: function(mbegin,mend,path,len) {
	var k,i,j;
	var pathpts=[],os=[],op=[];
	var collision={overlap:-1,template:[],mine:[]};
	// Overlapping obstacle ? 
	var so=this.getOutlineString(mend);
	os=so.s;
	op=so.p;
	for (k=0; k<OBSTACLES.length; k++){
	    var ob=OBSTACLES[k].getOutlineString();
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.isPointInside(ob.s,op)
		||this.isPointInside(os,ob.p)) {
		if (k<6) collision.overlap=k; else collision.mine.push(OBSTACLES[k]); 
		break;
	    }
	}
	if (typeof path!="undefined") {
	    // Template overlaps ? 
	    for (i=0; i<=len; i++) {
		var p=path.getPointAtLength(i);
		pathpts.push({x:mbegin.x(p.x,p.y),y:mbegin.y(p.x,p.y)});
	    }
	    for (j=0; j<pathpts.length; j++) {
		for (k=0; k<OBSTACLES.length; k++) {
		    if (k!=collision.overlap&&collision.template.indexOf(k)==-1&&collision.mine.indexOf(OBSTACLES[k])==-1) { // Do not count overlapped obstacle twice
			var o2=OBSTACLES[k].getOutlineString().p;
			for(i=0; i<o2.length; i++) {
			    var dx=(o2[i].x-pathpts[j].x);
			    var dy=(o2[i].y-pathpts[j].y);
			    if (dx*dx+dy*dy<=100) { 
				if (k<6) collision.template.push(k); 
				else collision.mine.push(OBSTACLES[k]);
				break } 
			}
		    }
		}
	    }
	}	   
	return collision;
    },
    iscollidingunit: function(m,sh) {
	var o1=this.getOutlineString(m).s;
	var o2=sh.getOutlineString(sh.m).s; 
	var inter=Snap.path.intersection(o1, o2);
	var collision=(inter.length>0);
	// If unit is large, add another check
	if (this.islarge) { collision=collision||this.isinoutline(o1,sh,sh.m); }
	if (sh.islarge)  { collision = collision||sh.isinoutline(o2,this,m); }
	return collision;
    },
    getcollidingunits: function(m) {
	var i;
	var c=[];
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if (sh!=this)
		if (this.iscollidingunit(m,sh)) c.push(sh);
	};
	return c;
    },
    getpathmatrix: function(m,maneuver) {
	var path=P[maneuver].path;
	var len=path.getTotalLength();
	if (this.islarge) len+=40;
	var mm=this.getmatrixwithmove(m, path, len);
	if (maneuver.match(/K\d|SR\d|SL\d/)) mm.rotate(180,0,0);
	if (maneuver.match(/TRL\d/)) mm.rotate(-90,0,0);
	if (maneuver.match(/TRR\d/)) mm.rotate(90,0,0);
	path.remove();
	return mm;
    },
    /* TODO: should prevent collision with obstacles if collision with
     * unit shortens path */
    getmovecolor: function(m,withcollisions,withobstacles,path,len) {
	var i,k;
	if (!this.isinzone(m)) return RED;
	var so=this.getOutlineString(m);
	if (withobstacles) {
	    var c=this.getocollisions(this.m,m,path,len);
	    if (c.overlap>-1||c.mine.length>0||c.template.length>0) return YELLOW;
	}
 	if (withcollisions) {
	    for (k=0; k<squadron.length; k++) {
		var u=squadron[k];
		var um=u.m;
		if (u==this) continue;
		/*if (typeof u.newm!="undefined") {
		    um=u.newm;
		}*/
		var su=u.getOutlineString(um);
		if (Snap.path.intersection(su.s,so.s).length>0
		    ||((this.islarge&&!u.islarge&&this.isPointInside(so.s,su.p)))
		    ||((!this.islarge&&u.islarge)&&this.isPointInside(su.s,so.p))) 
		{
		    return WHITE;
		    }
	    }
	}
	return GREEN;
    },
    isTurret: function(w) {
	return (w.type=="Turretlaser");
    },
    candoactivation:function() {
	return this.maneuver!=-1;
    },
    newaction:function(a,str) {
	return {action:a,org:this,type:str,name:str};
    },
    getactionbarlist: function() {
	var i,al=[];
	var ftrue=function() { return true; }
	for (i=0; i<this.shipactionList.length; i++) {
	    var a=this.shipactionList[i];
	    /* TODO actionsdone */
	    if (this.actionsdone.indexOf(a)==-1) {
		switch(a) {
		    case "CLOAK": if (this.candocloak()) 
			al.push(this.newaction(this.addcloak,"CLOAK")); break;
		    case "FOCUS": if (this.candofocus()) 
			al.push(this.newaction(this.addfocus,"FOCUS")); break;
		    case "EVADE": if (this.candoevade()) 
			al.push(this.newaction(this.addevade,"EVADE")); break;
		    case "TARGET":if (this.candotarget()) 
			al.push(this.newaction(this.resolvetarget,"TARGET"));break;
		    case "BOOST":al.push(this.newaction(this.resolveboost,"BOOST"));break;
		    case "ROLL":al.push(this.newaction(this.resolveroll,"ROLL"));break;
		    case "SLAM":al.push(this.newaction(this.resolveslam,"SLAM"));
		}
	    }
	}
	return al;
    },
    getupgactionlist: function() {
	var i,al=[];
	for (i=0; i<this.upgrades.length; i++) {
	    var upg=this.upgrades[i];
	    if ((this.actionsdone.indexOf(upg.name)==-1)
		&&upg.isactive&&typeof upg.action=="function"&&upg.candoaction()) 
		al.push({org:upg,action:upg.action,type:upg.type.toUpperCase(),name:upg.name});
	}
	return al;
    },
    getcritactionlist: function() {
	var i,al=[];
	for (i=0; i<this.criticals.length; i++) {
	    var crit=this.criticals[i];
	    if ((this.actionsdone.indexOf(crit.name)==-1)
		&&crit.isactive&&typeof crit.action=="function") {
		crit.type="CRITICAL"; crit.org=crit;
		al.push(crit);
	    }
	}
	return al;
    },
    getactionlist: function() {
	var sal=this.getactionbarlist();
	var ual=this.getupgactionlist();
	var cal=this.getcritactionlist();
	return sal.concat(ual).concat(cal);
    },
    addevadetoken: function() {
	this.evade++;
	this.show();
    },
    addevade: function(n) { 
	this.addevadetoken(); 
	this.endaction(n,"EVADE");
    },
    addfocustoken: function() {
	this.focus++;
	this.show();
    },
    addfocus: function(n) { 
	this.addfocustoken(); 
	this.endaction(n,"FOCUS");
    },
    addstress: function() {
	this.stress++;
	this.show();
    },
    addiontoken: function() {
	this.ionized++;
	this.show();
    },
    removeiontoken: function() {
	this.ionized--;
	this.show();
   },
    dies: function() {
	var i;
	$("#"+this.id).attr("onclick","");
	$("#"+this.id).addClass("dead");
	$("#"+this.id).html(""+this)
	for (i=0; i<squadron.length; i++) {
	    if (squadron[i]==this) {
		squadron.splice(i,1); break;
	    }
	}
	/* Remove targets of dead unit */
	for (i=0; i<this.targeting.length; i++) {
	    var t=this.targeting[i];
	    n=t.istargeted.indexOf(this);
	    if (n>-1) t.istargeted.splice(n,1);
	    t.show();
	}
	/* Remove locks on dead unit */
	for (i=0; i<this.istargeted.length; i++) {
	    var t=this.istargeted[i];
	    n=t.targeting.indexOf(this);
	    if (n>-1) t.targeting.splice(n,1);
	    t.show();
	}
	this.targeting=[];

	this.dead=true;
	this.m=MT(-60,-60);
	this.g.attr({display:"none"});
	this.geffect.attr({display:"none"});
	this.log("has exploded!");
	this.show();
	squadron[0].select();
	if (TEAMS[this.team].checkdead()) win();	
	SOUNDS.explode.play();
    },
    canbedestroyed: function() {
	if (skillturn!=this.skill) return true;
	return false;
    },
    checkdead: function() {
	if (!this.dead&&(this.hull<=0||!this.isinzone(this.m))) {
	    this.dies();
	    var r=TEAMS[this.team].history.rawdata
	    if (typeof r[round]=="undefined") r[round]={hits:0,dead:""}
	    r[round].dead+=this.name+" ";
	    return true;
	}	
	return false;
    },
    // TODO: should be only for defense dice, not evades
    cancelhit:function(h,e,sh){
	if (h>e) return h-e; else return 0;
    }, 
    cancelcritical:function(c,e,sh) {
	if (c>e) return c-e; else return 0;
    },
    evadeattack: function(sh) {
	var h=$(".hitreddice").length;
	var c=$(".criticalreddice").length;
	var e=$(".evadegreendice").length;
	var ee=$(".evadegreen").length;
	var ch=sh.weapons[sh.activeweapon].modifydamagegiven(10*c+h);
	c=Math.floor(ch/10);
	h=ch-c*10;
	var he=h;
	h=this.cancelhit(h,e,sh);
	e=e-(he-h);
	he=h;
	if (h>=ee) h=h-ee; else h=0; // evade tokens
	ee=ee-(he-h);
	c=this.cancelcritical(c,e,sh);
	if (c>=ee) c=c-ee; else c=0; // evade tokens
	return 10*c+h;
    },
    declareattack:function(w,target) {
	//console.log("declareattack:"+this.name)
	targetunit=target;
	this.activeweapon=w;
	this.weapons[w].declareattack(target);
	this.log("attacks %0 with %1",target.name,this.weapons[w].name);
	target.isattackedby(w,this);
    },
    isattackedby:function(k,a) {},
    modifydamageassigned: function(ch,attacker) {
	return ch;
    },
    resolveishit:function() {},
    hashit:function(t) { return this.criticalresolved+this.hitresolved>0;},
    resolvedamage: function() {
	this.fireline.remove();
	this.playfiresnd();
	var ch=targetunit.evadeattack(this);
	ch=this.weapons[this.activeweapon].modifydamageassigned(ch,targetunit);
	ch=targetunit.modifydamageassigned(ch,this);
	var c=Math.floor(ch/10);
	var h=ch-c*10;;
	this.hasdamaged=true;
	this.hitresolved=h;
	this.criticalresolved=c;
	if (this.hashit(targetunit)) {
	    if (this.hitresolved+this.criticalresolved<targetunit.shield) 
		targetunit.log("-%0 %SHIELD%",(this.criticalresolved+this.hitresolved));
	    else if (targetunit.shield>0) targetunit.log("-%0 %SHIELD%",targetunit.shield)
	    targetunit.resolveishit(this);
	    this.weapons[this.activeweapon].prehit(targetunit,c,h);
	    this.hitresolved=targetunit.resolvehit(this.hitresolved);
	    this.criticalresolved=targetunit.resolvecritical(this.criticalresolved);
	    this.weapons[this.activeweapon].posthit(targetunit,c,h);
	} 
	targetunit.endbeingattacked(c,h);
	this.weapons[this.activeweapon].endattack(c,h);
	this.endattack(c,h);
	if (targetunit.canbedestroyed(skillturn)) targetunit.checkdead();
	this.cleanupattack();
    },
    cleanupattack: function() {
	//this.log("cleanupattack");
	this.actionbarrier();
    },
    endround: function() {
	this.focus=this.evade=0;
	this.hasfired=0;
	this.ocollision.overlap=-1;
	this.ocollision.template=[];
	this.ocollision.mine=[];
	this.collision=false;
	this.touching=[];
	this.showinfo();
    },
    playfiresnd: function() {
	var bb=targetunit.g.getBBox();
	var start=transformPoint(this.m,{x:0,y:-(this.islarge?40:20)});
	var p=s.path("M "+start.x+" "+start.y+" L "+(bb.x+bb.w/2)+" "+(bb.y+bb.h/2)).appendTo(VIEWPORT).attr({stroke:this.color,strokeWidth:2});
	var process=setInterval(function() { p.remove(); clearInterval(process);
	},200);
	if (typeof this.weapons[this.activeweapon].firesnd!="undefined") 
	    SOUNDS[this.weapons[this.activeweapon].firesnd].play();
	else SOUNDS[this.ship.firesnd].play();		
    },
    endattack: function(c,h) {
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	this.show();
    },
    endbeingattacked: function(c,h) {
	this.show();
    },
    showpositions:function(gd) {
	var i;
	var o=[];
	for (i=0; i<gd.length; i++) 
	{
	    var mm=gd[i].m;
	    o[i]=this.getOutline(mm).attr({title:gd[i].move,opacity:0.4,fill:halftone(gd[i].color),display:"block",class:'possible'}).appendTo(VIEWPORT);
	    (function(i) {o[i].hover(function() { o[i].attr({stroke:gd[i].color,strokeWidth:4})}.bind(this),
				     function() { o[i].attr({strokeWidth:0})}.bind(this)); }.bind(this))(i);
	}	
    },
    showmeanposition: function() {
	var gd=this.getdial();
	var o;
	this.evaluatemoves(true,true);
	this.showpositions([{color:GREEN,move:"mean",m:this.meanm}]);
    },
    shownextpositions: function() {
	var gd=this.getdial();
	var o;
	this.evaluatemoves(true,true);
	var n=[];
	for (i=0; i<gd.length; i++) n[i]=gd[i].next;
	this.showpositions(n);
    },
    showpossiblepositions:function() {
	this.evaluatemoves(true,true);
	var gd=this.getdial();
	this.showpositions(gd);
    },
    evaluateposition: function() {
	var enemies=0;
	var attackenemy=0;
	var attack=0;
	var n=0;
	var i,j;
	var dist=0;
	NOLOG=true;
	
	for (j=0; j<squadron.length; j++) {
	    var u=squadron[j];
	    if (u.team!=this.team) {
		var a=0;
		var old=u.m;
		u.m=u.meanm;
		for (i=0; i<u.weapons.length; i++) { 
		    var x=u.weapons[i].getrange(this);
		    if (x>0&&x<4) a=Math.max(a,u.getattackstrength(i,this));
		}
		attackenemy+=a;
		for (i=0; i<this.weapons.length; i++) {
		    var y=this.weapons[i].getrange(u);
		    if (y>0&&y<4) attack=Math.max(attack,this.getattackstrength(i,u));
		}
		dist+=this.getdist(this.m,u)/90000;
		u.m=old;
		n++;
		
	    }
	}
	NOLOG=false;
	//this.log("  >"+attack+" "+attackenemy+" "+(dist/n));
	return attack - attackenemy - (dist/n) ;
    },
    evaluatemoves: function(withcollisions,withobstacles) {
	this.meanmround=round;
	//this.log("evaluatemoves "+withcollisions+" "+withobstacles);
	var gd=this.getdial();
	var mx=0,my=0,ma=0;
	var g=0;
	var i;
	var cmax=function(a,b) {
	    if (a==RED||(a==YELLOW&&(b==GREEN||b==WHITE))||(a==WHITE&&b==GREEN))
		return a;
	    return b;
	}
	var cmin=function(a,b) {
	    if (cmax(a,b)==a) return b;
	    return a;
	}
	NOLOG=true;
	for (i=0; i<gd.length; i++) {
	    var next=[];
	    var mm = this.getpathmatrix(this.m,gd[i].move);
	    gd[i].m=mm;
	    if (gd[i].difficulty=="RED"&&this.stress>0) gd[i].color=RED; 
	    else {
		var c=RED;
		gd[i].color=this.getmovecolor(mm,withcollisions,withobstacles);
		if (gd[i].color!=RED&&withcollisions&&withobstacles) {
		    for (j=0; j<gd.length; j++) {
			if (gd[j].move=="F0"||(gd[j].difficulty=="RED"&&
			    ((this.stress>0&&gd[i].difficulty!="GREEN")
			 ||gd[i].difficulty=="RED"))) continue;
			var mmm=this.getpathmatrix(mm,gd[j].move);
			c=cmin(c,this.getmovecolor(mmm,false,false));
		    }
		    if (gd[i].move!="F0") gd[i].color=cmax(c,gd[i].color);
		}
		//this.log(">"+gd[i].move+" "+gd[i].color);
	    }
	    
	    if ((gd[i].color==GREEN)&&!gd[i].move.match(/K\d|SR\d|SL\d|TRL\d|TRR\d/)) {
		var gpm=mm.split();
		g++;
		mx+=gpm.dx; my+=gpm.dy; ma+=(gpm.rotate+360)%360;
	    }
	}
	if (g==0) g=1;
	mx=mx/g; my=my/g; ma=ma/g;
	this.meanm= (new Snap.Matrix()).translate(mx,my).rotate(ma,0,0);
	NOLOG=false;
    },
    
    usestress: function(id) {
    },
    removetarget: function(t) {
	var n;
	n=t.istargeted.indexOf(this);
	if (n>-1) t.istargeted.splice(n,1);
	this.targeting.splice(t);
	t.show();
	this.show();
	if (this.targeting.length==0) $("#atokens > .xtargettoken").remove();
    },
    usetarget:function() {
	if (phase==COMBAT_PHASE&&activeunit==this&&this.targeting.indexOf(targetunit)>-1) {
	    this.removetarget(targetunit);
	    reroll(10,true,99,""); /* Focus and blank rerolls */
	    return true;
	}
	return false;
    },
    useevade:function() {
	if (phase==COMBAT_PHASE&&this==targetunit) {
	    this.removeevadetoken();
	    this.show();
	    $("#dtokens > .xevadetoken").remove();
	    $("#defense").prepend("<td class='evadegreen'></td>");
	}
    },
    removeevadetoken: function() { this.evade--; this.show();},
    removefocustoken: function() { this.focus--; this.show();},
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    record(this.id,k,"resolveactionmove");
	    for (i=0; i<this.pos.length; i++) this.pos[i].ol.remove();
	    if (automove) this.m=m;
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    OBSTACLES[mine[i]].detonate(this)
		}
	    if (automove) this.movelog({"move":m.toTransformString()});
	    f(this,k);
	    this.show();
	}.bind(this);
	if (typeof possible=="undefined") possible=false;
	for (i=0; i<moves.length; i++) {
	    if (possible||this.getmovecolor(moves[i],true,true)==GREEN) {
		p=this.getOutline(moves[i]).attr({display:"block"}).appendTo(VIEWPORT);
		this.pos.push({ol:p,k:i});
	    }
	}
	if (this.pos.length>0) {
	    if (this.pos.length==1) {
		resolve(moves[this.pos[0].k],this.pos[0].k,cleanup);
	    } else for (i=0; i<this.pos.length; i++) {
		(function(i) {
		var p=this.pos[i];
		p.ol.hover(function() { this.pos[i].ol.attr({stroke:this.color,strokeWidth:4})}.bind(this),
			   function() { this.pos[i].ol.attr({strokeWidth:0})}.bind(this));
		    p.ol.click(function() { resolve(moves[this.pos[i].k],this.pos[i].k,cleanup); }.bind(this));
		    }.bind(this))(i);
	    }
	} else resolve(this.m,-1,cleanup);
    },
    resolveactionselection: function(units,cleanup) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(k) {
	    record(this.id,k,"resolveactionselection");
	    for (i=0; i<units.length; i++) {
		units[i].outline.attr({fill:"rgba(8,8,8,0.5)"});
		units[i].setdefaultclickhandler();
	    }
	    cleanup(k);
	}.bind(this);
	if (units.length==0) resolve(-1);
	else if (units.length==1) resolve(0);
	else for (i=0; i<units.length; i++) {
	    units[i].outline.attr({fill:"rgba(100,100,100,0.8)"});
	    (function(k) { units[k].setclickhandler(function() { resolve(k);}); })(i);
	}
    },
    getboostmatrix:function(m) {
	return [this.getpathmatrix(this.m,"F1"),
		this.getpathmatrix(this.m,"BL1"),
		this.getpathmatrix(this.m,"BR1")];
    },
    resolveboost: function(n) {
	this.resolveactionmove(this.getboostmatrix(this.m),
	    function (t,k) { t.endaction(n,"BOOST"); },true,false);
    },
    getdecloakmatrix: function(m) {
	var m0=this.getpathmatrix(this.m.clone().rotate(90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(this.m.clone().rotate(-90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	return [m.clone(),
		m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20),
		m1.clone().translate(0,-20),
		m1,
		m1.clone().translate(0,20),
		this.getpathmatrix(m.clone(),"F2")];
    },
    resolvedecloak: function() {
	//this.log("do selection resolvedecloak");
	this.doselection(function(n) {
	    this.resolveactionmove(this.getdecloakmatrix(this.m),
				   function (t,k) {
				       if (k>0) {
					   t.agility-=2; t.iscloaked=false;
					   SOUNDS.decloak.play();
				       }
				       this.hasdecloaked=true;
				       this.endnoaction(n,"");
				   }.bind(this),true,false);
	}.bind(this))/*.done(function() {
	    this.unlock();
	}.bind(this))*/
	return true;
    },
    getrollmatrix:function(m) {
	var m0=this.getpathmatrix(this.m.clone().rotate(90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(this.m.clone().rotate(-90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	return [m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20),
		m1.clone().translate(0,-20),
		m1,
		m1.clone().translate(0,20)]
    },
    resolveroll: function(n) {
	this.resolveactionmove(this.getrollmatrix(this.m),
	    function(t,k) { t.endaction(n,"ROLL");},true,false);
    },
    boundtargets:function(sh) {
	if (this.targeting.indexOf(sh)>-1) return true;
	for (var i=0; i<this.targeting.length; i++) this.removetarget(this.targeting[i]);
	return false;
    },
    addtarget: function(sh) {
	if (this.boundtargets(sh)) return;
	this.targeting.push(sh);
	sh.istargeted.push(this);
	sh.show();
	this.show();
    },
    gettargetableunits: function(n) {
	var p=[];
	var i;
	for (i=0; i<squadron.length; i++) {
	    if (squadron[i].team!=this.team
		&&this.getrange(squadron[i])<=n) {
		    p.push(squadron[i]);
	    }
	}
	return p;
    },
    selectnearbyunits: function(n,f) {
	var p=[];
	for (var i=0; i<squadron.length; i++) {
	    //log(this.name+":"+squadron[i].name+" "+f(this,squadron[i])+" "+(this.getrange(squadron[i])<=n));
	    if (f(this,squadron[i])&&(this.getrange(squadron[i])<=n)) p.push(squadron[i]);
	}
	return p;
    },
    resolvetarget: function(n) {
	var p=this.gettargetableunits(3);
	//this.log("select target to lock");
	this.resolveactionselection(p,function(k) { 
	    if (k>=0) this.addtarget(p[k]);
	    this.endaction(n,"TARGET");
	}.bind(this));
    },
    addcloaktoken: function() {
	this.iscloaked=true;
	this.agility+=2;
	SOUNDS.cloak.play();
    },
    addcloak: function(n) {
	this.addcloaktoken();
	this.endaction(n,"CLOAK");
    },
    resolveslam: function(n) {
	var gd=this.getdial();
	if (gd.length<=this.lastmaneuver) this.lastmaneuver=0;
	var realdial=gd[this.lastmaneuver].move;
	var speed=realdial.substr(-1);
	var p=[];
	var q=[];
	for (var i=0; i<gd.length; i++) 
	    if (gd[i].move.substr(-1)==speed) { 
		p.push(this.getpathmatrix(this.m,gd[i].move));
		q.push(i);
	    }
	this.log("select maneuver for SLAM");
	var em=this.endmaneuver;
	var tfm=this.timeformaneuver;
	this.timeformaneuver=function() { return true; }
	this.endmaneuver=function() {
	    this.endaction(n,"SLAM");
	    this.endmaneuver=em;
	    this.timeformaneuver=tfm;
	};
	var cf=this.canfire;
	this.canfire=function() { this.canfire=cf; return false; };
	this.resolveactionmove(p,function(t,k) {
	    this.maneuver=q[k];
	    this.doactivation();
	}.bind(this),false,true);
    },
    enqueueaction: function(callback,org) {
	actionr.push($.Deferred());
	var n=actionr.length-1;
	if (typeof org=="undefined") org="undefined";
	//log("enqueueaction "+n+":"+org.name);
	actionr[n-1].done(function() { 
	    //log("|| "+n+" execute"); 
	    callback(n) }.bind(this));
	return actionr[n];
    },
    endnoaction: function(n,type) {
	this.show();
	//this.log("*** "+n+" "+(actionr.length-1));
	actionr[n].resolve(type);
	if (n==actionr.length-1) actionrlock.resolve();
    },
    endaction: function(n,type) {
	//this.log("endaction "+n+" "+type);
	this.actiondone=true; this.clearaction();
	this.endnoaction(n,type);
    },
    resolveaction: function(a,n) {
	$("#actiondial").empty();
	if (a==null) { this.endaction(n,null); }
	else {
	    this.actionsdone.push(a.name);
	    a.action.call(a.org,n);
	}
    },
    resolvenoaction: function(a,n) {
	$("#actiondial").empty();
	if (a==null) { this.endnoaction(n,null); }
	else {
	    a.action.call(a.org,n);
	}
    },
    evaluatetohit: function(w,sh) {
	var r=this.gethitrange(w,sh);
	if (sh!=this&&r<=3&&r>0) {
	    var attack=this.getattackstrength(w,sh);
	    var defense=sh.getdefensestrength(w,this);
	    if (this.targeting.indexOf(sh)>-1) this.reroll=10;
	    else this.reroll=0;
	    return tohitproba(this,sh,
			      this.getattacktable(attack),
			      sh.getdefensetable(defense),
			      attack,
			      defense);
	} else return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    },
    isfireobstructed: function() {
	return this.ocollision.overlap>-1;
    },
    canfire: function() {
 	var b= (this.hasfired==0)/*&&((r[1].length>0||r[2].length>0||r[3].length>0)*/&&!this.iscloaked&&!this.isfireobstructed();
        return b;
    },
    getattackstrength: function(i,sh) {
	var att=this.weapons[i].getattack();
	return att+this.weapons[i].getrangeattackbonus(sh);
    },
    getobstructiondef: function(sh) {
	return this.getoutlinerange(this.m,sh).o?1:0;
    },
    getdefensestrength: function(i,sh) {
	var def=this.getagility();
	var obstacledef=sh.getobstructiondef(this);
	if (obstacledef>0) this.log("+%0 defense for obstacle",obstacledef);
	return def+sh.weapons[i].getrangedefensebonus(this)+obstacledef;
    },
    getattackmodtokens: function(m,n) {
	var str="";
	var i,j;
	for (me=0; me<squadron.length; me++) if (squadron[me]==this) break;
	for (i=0; i<ATTACKMODA.length; i++) {
	    var a=ATTACKMODA[i];
	    if (a.req(m,n)) {
		str+="<td id='moda"+i+"' class='"+a.str+"modtokena' onclick='record("+this.id+","+i+",\"attackmodag_"+n+"\"); modroll(ATTACKMODA["+i+"].f,"+n+","+i+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	j=ATTACKMODA.length
	for (i=0; i<ATTACKMODD.length; i++) {
	    var a=ATTACKMODD[i];
	    if (a.req(m,n)) {
		str+="<td id='moda"+(i+ATTACKMODA.length)+"' class='"+a.str+"modtokend' onclick='record("+this.id+","+i+",\"attackmodd_"+n+"\"); modroll(ATTACKMODD["+i+"].f,"+n+","+(i+ATTACKMODA.length)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length+ATTACKMODD.length;
	for (j=0; j<this.ATTACKMODA.length; j++) {
	    var a=this.ATTACKMODA[j];
	    if (a.req(m,n)) {
		var cl=a.str+"modtokena"
		if (typeof a.token!="undefined") cl="x"+a.str+"token";
		str+="<td id='moda"+(i+j)+"' class='"+cl+"' onclick='record("+this.id+","+j+",\"attackmoda_"+n+"\"); modroll(squadron["+me+"].ATTACKMODA["+j+"].f,"+n+","+(i+j)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length+ATTACKMODD.length+this.ATTACKMODA.length
	for (j=0; j<this.ATTACKADD.length; j++) {
	    var a=this.ATTACKADD[j];
	    if (a.req(m,n)) {
		str+="<td id='moda"+(j+i)+"' class='"+a.str+"modtokena' onclick='addroll(squadron["+me+"].ATTACKADD["+j+"].f,"+n+","+(i+j)+")' title='add roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	return str;
    },
    getdefensemodtokens: function(m,n) {
	var str="";
	var i,j;
	for (me=0; me<squadron.length; me++) if (squadron[me]==this) break;
	for (i=0; i<DEFENSEMODD.length; i++) {
	    var a=DEFENSEMODD[i];
	    if (a.req(m,n)) {
		str+="<td id='modd"+i+"' class='"+a.str+"modtokend' onclick='record("+this.id+","+i+",\"defensemoddg_"+n+"\"); modrolld(DEFENSEMODD["+i+"].f,"+n+","+i+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	for (j=0; j<this.DEFENSEMODD.length; j++) {
	    var a=this.DEFENSEMODD[j];
	    if (a.req(m,n)) {
		var cl=a.str+"modtokend"
		if (typeof a.token!="undefined") cl="x"+a.str+"token"; 
		str+="<td id='modd"+(i+j)+"' class='"+cl+"' onclick='record("+this.id+","+j+",\"defensemodd_"+n+"\"); modrolld(squadron["+me+"].DEFENSEMODD["+j+"].f,"+n+","+(i+j)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=DEFENSEMODD.length+this.DEFENSEMODD.length
	for (j=0; j<this.DEFENSEADD.length; j++) {
	    var a=this.DEFENSEADD[j];
	    if (a.req(m,n)) {
		var cl=a.str+"modtokend";
		if (typeof a.token!="undefined") cl="x"+a.str+"token";
		str+="<td id='modd"+(j+i)+"' class='"+cl+"' onclick='record("+this.id+","+j+",\"defenseadd_"+n+"\"); addrolld(squadron["+me+"].DEFENSEADD["+j+"].f,"+n+","+(i+j)+")' title='add result ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	return str;
    },
    getattackrerolltokens: function() {
	var str="";
	var getstr=function(a,i) {
	    var s=0;
	    var n=a.n();
	    if (a.type.indexOf("blank")>-1) s+=n;
	    if (a.type.indexOf("focus")>-1) s+=10*n;
	    if (a.type.indexOf("hit")>-1) s+=100*n;
	    if (a.type.indexOf("critical")>-1) s+=1000*n;
	    return "<td id='rerolla"+i+"' class='tokens' onclick='reroll("+n+",true,"+s+","+i+")' title='"+n+" rerolls ["+a.org.name.replace(/\'/g,"&#39;")+"]'>R"+n+"</td>";
	};
	for (var i=0; i<ATTACKREROLLA.length; i++) {
	    var a=ATTACKREROLLA[i];
	    if (a.req(this,this.weapons[this.activeweapon],targetunit)) 
		str+=getstr(a,i);
	}   
	for (var i=0; i<this.ATTACKREROLLA.length; i++) {
	    var a=this.ATTACKREROLLA[i];
	    if (a.req(this.weapons[this.activeweapon],targetunit)) 
		str+=getstr(a,i+ATTACKREROLLA.length);
	}   
	return str;
    },
    getdefensererolltokens: function() {
	var str="";
	var getstr=function(a,i) {
	    var s=0;
	    var n=a.n();
	    if (a.type.indexOf("blank")>-1) s+=n;
	    if (a.type.indexOf("focus")>-1) s+=10*n;
	    if (a.type.indexOf("evade")>-1) s+=100*n;
	    return "<td id='rerolld"+i+"' class='tokens' onclick='record(\"defensererolld\","+i+"); reroll("+n+",false,"+s+","+i+")' title='"+n+" rerolls ["+a.org.name.replace(/\'/g,"&#39;")+"]'>R"+n+"</td>";
	};
	for (var i=0; i<DEFENSEREROLLD.length; i++) {
	    var a=DEFENSEREROLLD[i];
	    if (a.req(activeunit,activeunit.weapons[activeunit.activeweapon],this)) 
		str+=getstr(a,i);
	}   
	for (var i=0; i<this.DEFENSEREROLLD.length; i++) {
	    var a=this.DEFENSEREROLLD[i];
	    if (a.req(activeunit.weapons[activeunit.activeweapon],activeunit)) 
		str+=getstr(a,i+DEFENSEREROLLD.length);
	}   
	return str;
    },
    resolveattack: function(w,targetunit) {
	var i;
	var r=this.gethitrange(w,targetunit);
	this.hasfired++;
	this.hasdamaged=false;
	$("#combatdial").show();
	var bb=targetunit.g.getBBox();
	var start=transformPoint(this.m,{x:0,y:-(this.islarge?40:20)});
	this.fireline=s.path("M "+start.x+" "+start.y+" L "+(bb.x+bb.w/2)+" "+(bb.y+bb.h/2))
	    .attr({stroke:this.color,
		   strokeWidth:2,
		   strokeDasharray:100,
		   "class":"animated"}).appendTo(VIEWPORT);
	//console.log("resolveattack:"+this.name+" "+attack+"/"+defense);
	this.select();	
	for (i=0; i<squadron.length; i++) if (squadron[i]==this) break;
	this.preattackroll(w,targetunit);
	//this.log("do selection resolveattack");
	this.doselection(function(n) {
	    var attack=this.getattackstrength(w,targetunit);
	    var defense=targetunit.getdefensestrength(w,this);
	    this.doattackroll(this.attackroll(attack),attack,defense,i,n);
	    //this.show();
	}.bind(this),this.name+" attack")
	//this.show();
    },
    preattackroll:function(w,targetunit) {
    },
    doattack: function(forced) {
	this.showattack(forced);
    },
    doattackroll: function(ar,da,defense,me,n) {
	var i,j;
	$("#attackdial").empty();
	$("#dtokens").empty();
	$("#defense").empty();
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	displayattackroll(ar,da);
	$("#atokens").html(this.getattackrerolltokens()+this.getattackmodtokens(ar,da));
	$("#atokens").append("<button>");
	$("#atokens > button").addClass("m-done").click(function() {
	    $("#atokens").empty();
	    record("doattackroll",-1);
	    targetunit.defenseroll(defense).done(function(r) {
		targetunit.dodefenseroll(r.roll,r.dice,me,n);
	    });
	});
    },
    dodefenseroll: function(dr,dd,me,n) {
	var i,j;
	displaydefenseroll(dr,dd);
	for (j=0; j<squadron.length; j++) if (squadron[j]==this) break;
	$("#dtokens").html(this.getdefensererolltokens()+this.getdefensemodtokens(dr,dd));
	$("#dtokens").append("<button>");
	$("#dtokens > button").addClass("m-fire")
	    .click(function() {
		record("dodefenseroll",1);
		$("#combatdial").hide();
		this.resolvedamage();
		this.endnoaction(n,"incombat");
	    }.bind(squadron[me]));
	//console.log("showdefenseroll:"+this.name);
    },
    getmatrixwithmove: function(mm,path, len) {
	var lenC = path.getTotalLength();
	var m = mm.clone();
	if (this.islarge) {
	    if (len<=20) m.translate(0,-len);
	    else {
		var over=(len>lenC+20)?len-lenC-20:0;
		var movePoint = path.getPointAtLength( len-over-20 );
		m.translate(movePoint.x,-20+movePoint.y).rotate(movePoint.alpha-90,0,0).translate(0,-over);
	    }
	} else {
	    var movePoint = path.getPointAtLength( len );
	    m.translate(movePoint.x,movePoint.y).rotate(movePoint.alpha-90,0,0);
	}
	return m
    },
    removestresstoken: function() {
	this.stress--;
	this.show();
    },
    handledifficulty: function(difficulty) {
	if (difficulty=="RED") {
	    this.addstress();
	} else if (difficulty=="GREEN" && this.stress>0) {
	    this.removestresstoken();
	}
    },
    completemaneuver: function(dial,realdial,difficulty) {
	var path=P[realdial].path;
	var m,oldm;
	if (dial=="F0") {
	    //this.log("performing F0");
	    this.hasmoved=true;
	    this.handledifficulty(difficulty);
	    this.lastmaneuver=this.maneuver;
	    this.maneuver=-1;
	    this.show();
	    this.endmaneuver();
	    this.touching=[];
	    return;
	}
	var lenC = path.getTotalLength();
	this.collision=false; // Any collision with other units ?
	this.showhitsector(false);
	movePoint = path.getPointAtLength( lenC );
	if (this.islarge) lenC+=40;
	oldm=this.m;
	m = this.getmatrixwithmove(this.m,path,lenC);

	var c=this.getcollidingunits(m);
	var col=[];
	if (c.length>0) {
	    this.log("collides with %0: no action",c[0].name);
	    this.collision=true;
	    while (lenC>0 && c.length>0) {
		col=c;
		lenC=lenC-1;
		m=this.getmatrixwithmove(this.m,path,lenC);
		c=this.getcollidingunits(m);
	    }
	}
	// Handle collision: removes old collisions
	for (i=0; i<this.touching.length; i++) {
	    var sh=this.touching[i];
	    sh.touching.splice(sh.touching.indexOf(this),1);
	}
	this.touching=col;
	
   
	this.ocollision=this.getocollisions(oldm,m,path,lenC);
	if (this.isfireobstructed()) { this.log("overlaps obstacle: no action, cannot attack"); }
	if (this.ocollision.template.length>0) { this.log("template overlaps obstacle: no action"); }
	if (lenC>0) this.movelog({"len":lenC,"path":$(path.outerSVG()).attr("d")});;
	if (lenC>0) this.m=m;
	// Animate movement
	if (lenC>0) {
	    $("#activationdial > div").empty()
	    SOUNDS[this.ship.flysnd].play();
	    Snap.animate(0, lenC, function( value ) {
		m = this.getmatrixwithmove(oldm,path,value);
		this.g.transform(m);
		this.geffect.transform(m);
	    }.bind(this), TIMEANIM*lenC/200,mina.linear, function(){
		this.hasmoved=true;
		if (!this.collision) { 
		    // Special handling of K turns: half turn at end of movement. Straight line if collision.
		    if (dial.match(/K\d|SR\d|SL\d/)) {
			this.movelog({"move":"r180 0 0"});
			this.m.rotate(180,0,0);
		    } else if (dial.match(/TRL\d/)) {
			this.movelog({"move":"r-90 0 0"});
			this.m.rotate(-90,0,0);
		    } else if (dial.match(/TRR\d/)) {
			this.movelog({"move":"r90 0 0"});
			this.m.rotate(90,0,0);
		    } else {
		    }
		} 
		else { 
		}
		this.handledifficulty(difficulty);
		this.lastmaneuver=this.maneuver;
		this.maneuver=-1;
		path.remove();
		if (this.ocollision.overlap>-1||this.ocollision.template.length>0) this.resolveocollision();
		if (this.ocollision.mine.length>0) 
		    for (i=0; i<this.ocollision.mine.length; i++) {
			this.ocollision.mine[i].detonate(this)
		    }
		if (this.collision) this.resolvecollision();
		this.endmaneuver();
		this.show();
	    }.bind(this));
	} else {
	    this.hasmoved=true;
	    this.log("cannot move");
	    this.handledifficulty(difficulty);
	    this.lastmaneuver=this.maneuver;
	    this.maneuver=-1;
	    this.show();
	    path.remove();
	    if (this.collision) this.resolvecollision();
	    this.endmaneuver();
	}
    },
    resolvemaneuver: function() {
	$("#activationdial").empty();
	// -1: No maneuver
	if (this.maneuver<0) return;
	var dial=this.getmaneuver().move;
	var difficulty=this.getmaneuver().difficulty;
	if (typeof this.forceddifficulty!="undefined") difficulty=this.forceddifficulty;
	// Move = forward 0. No movement. 
	this.completemaneuver(dial,dial,difficulty);
    },
    endmaneuver: function() {
	this.ionized=0;
	this.hasmoved=true;
	if (this.checkdead()) { this.hull=0; this.shield=0; } 
	else this.doendmaneuveraction();
	//this.log("endmaneuver");
	this.actionbarrier();
    },
    unlock:function(v) {
	this.deferred.resolve(v);
    },
    newlock:function() {
	this.deferred=$.Deferred();
	return this.deferred.promise();
    },
    enddecloak: function() {
	return this.newlock();
    },
    candomaneuver: function() {
	return this.maneuver>-1;
    },
    candoendmaneuveraction: function() { return this.candoaction(); },
    doendmaneuveraction: function() {
	if (this.candoendmaneuveraction()) {
	    //this.log("do action endmaneuver");
	    this.doaction(this.getactionlist());
	}
	else { this.action=-1; this.actiondone=true; }
    },
    doselection: function(f,org) {
	return this.enqueueaction(function(n) {
	    f(n);
	}.bind(this),org);  
    },
    doaction: function(list,str) {
	//this.log("do action "+list.length);
	if (list.length==0) return this.enqueueaction(function(n) {
	    this.endnoaction(n);
	}.bind(this)); 
	return this.enqueueaction(function(n) {
	    var i;
	    $("#actiondial").empty();
	    if (this.candoaction()) {
		this.select();
 		if (typeof str!="undefined") this.log(str);
		$("#actiondial").html($("<div>"));
		for (i=0; i<list.length; i++) {
		    if (this.actionsdone.indexOf(list[i].name)==-1) {
			(function(k,h) {
			    var e=$("<div>").addClass("symbols").text(A[k.type].key)
				.click(function () { record(this.id,h,"doaction"); this.resolveaction(k,n) }.bind(this));
			    $("#actiondial > div").append(e);
			}.bind(this))(list[i],i);
		    }
		}
		var e=$("<button>").addClass("m-skip").click(function() { record(this.id,-1,"skipaction"); this.resolveaction(null,n); }.bind(this));
		$("#actiondial > div").append(e);
	    } else this.endaction(n);
	}.bind(this),list[0].name);  
    },
    donoaction: function(list,str,noskip) {
	return this.enqueueaction(function(n) {
	    var i;
 	    if (typeof str!="undefined") this.log(str);
	    this.select();
	    $("#actiondial").html($("<div>"));
	    for (i=0; i<list.length; i++) {
		(function(k,h) {
		    //log("type : "+k.type);
		    var e=$("<div>").addClass("symbols").text(A[k.type].key)
			.click(function () { record(this.id,h,"donoaction"); this.resolvenoaction(k,n) }.bind(this));
		    $("#actiondial > div").append(e);
		}.bind(this))(list[i],i);
	    }
	    if (noskip==true) {
		var e=$("<button>").addClass("m-skip").click(function() { record(this.id,-1,"skipnoaction"); this.resolvenoaction(null,n); }.bind(this));
		$("#actiondial > div").append(e);
	    }
	}.bind(this),list[0].name);  
    },
    candoaction: function() {
	//log("stress:"+this.stress+" collision:"+this.collision+" template"+this.ocollision.template+" overlap"+this.ocollision.overlap);
	if (this.stress>0||this.collision||this.ocollision.template.length>0||this.ocollision.overlap>-1) return false;
	return  true;
    },
    candecloak: function() {
	return (this.iscloaked&&phase==ACTIVATION_PHASE&&!this.hasdecloaked);
    },
    selecttargetforattack: function(wp,target) {
	if (typeof target!="undefined") { 
	    this.declareattack(wp,target); 
	    this.resolveattack(wp,target);
	    return true;
	} 
	var grau=this.weapons[wp].getrangeallunits();
	var i;
	var p=[];
	    //console.log("selecttargetforattack:"+this.name+":")
	for (i=0; i<grau.length; i++) {
	    //console.log("    "+grau[i].name+":"+this.getrange(grau[i])+" teams:"+grau[i].team+" "+this.team);
	    if (grau[i].team!=this.team) p.push(grau[i]);
	}
	if (p.length==0) {
	    this.log("no target for %0",this.weapons[wp].name);
	    this.cleanupattack();
	    return false;
	}
	this.resolveactionselection(p,function(k) { 
	    if (k>=0) {
		this.declareattack(wp,p[k]); 
		this.resolveattack(wp,p[k]);
	    } 
	}.bind(this));
	return true;
    },
    showattack: function(forced) {
	var str="";
	var wn=[];
	var i,j,w;
	$("#attackdial").hide();
	if (forced==true || (phase==COMBAT_PHASE&&skillturn==this.skill)) {
	    if (this.canfire()) {
		var r=this.gethitrangeallunits();
		$("#attackdial").empty();
		for (i=1; i<=3; i++) {
		    for (j=0; j<r[i].length; j++) {
			for (w=0; w<r[i][j].wp.length; w++) {
			    var wp=r[i][j].wp[w];
			    if (wn.indexOf(wp)==-1) wn.push(wp);
			}
		    }
		}
		for (i=0; i<wn.length; i++) {
		    var w=A[this.weapons[wn[i]].type.toUpperCase()];
		    str+="<div class='symbols "+w.color+"' onclick='record("+this.id+","+i+",\"selecttargetforattack\"); activeunit.selecttargetforattack("+wn[i]+")'>"+w.key+"</div>"
			}
		// activeunit.hasfired++ ?
		str+="<button class='m-skip' onclick='record("+this.id+",-1,\"skiptargetforattack\"); activeunit.hasfired++;activeunit.show();activeunit.deferred.resolve();'></button>";
		$("#attackdial").html("<div>"+str+"</div>").show();
	    } else if (!this.hasfired) {
		this.hasfired++; this.deferred.resolve(); 
	    }
	}
    },
    candotarget: function() {
	var l=this.gettargetableunits(3).length;
	return l>0;
    },
    candofocus: function() {
	return true;
    },
    candoevade: function() {
	return true;
    },
    candropbomb: function() {
	return (this.lastdrop!=round&&this.skill==skillturn);
    },
    addactivationdial: function(pred,action,html,elt) {
	this.activationdial.push({pred:pred,action:action,html:html,elt:elt});
    },
    actionbarrier:function() {
	var i=0;
	actionrlock=$.Deferred();
	for (i=0; i<actionr.length; i++) 
	    if (actionr[i].state()=="pending") break;
	if (i<actionr.length) {
	    actionrlock.done(function() { this.unlock() }.bind(this));
	} else {
	    actionrlock.resolve();
	    this.unlock();
	}
    },
    dodecloak: function() {
	if (this.iscloaked) {
	    this.resolvedecloak();
	} else {
	    this.hasdecloaked=true;
	}
	this.actionbarrier();
    },
    getbomblocation: function() {
	return ["F1"];
    },
    getbombposition: function(lm,size) {
	var p=[];
	for (var i=0; i<lm.length; i++) 
	    p.push(this.getpathmatrix(this.m.clone().rotate(180,0,0),lm[i]).translate(0,(this.islarge?-20:0)-size))
	return p;
    },
    bombdropped: function() {},
    updateactivationdial: function() {
	this.activationdial=[];
	if (this.candropbomb()) 
	    for (var i=0; i<this.bombs.length; i++) {
		var bomb=this.bombs[i];
		this.addactivationdial(function() {return bomb.canbedropped()},
				       function() {return bomb.actiondrop()},
		    A["BOMB"].key,
		    $("<div>").attr({class:"symbols"}));
	    }
	return this.activationdial;
    },
    doactivation: function() { this.showactivation(); },
    showactivation: function() {
	$("#activationdial").html("<div></div>");
	if (!this.timeformaneuver())  return;
	var ad=this.updateactivationdial();
	for (var i=0; i<ad.length; i++) {
	    var adi=ad[i];
	    if (adi.pred()) { 
		adi.elt.appendTo("#activationdial > div").click(function() { 
		    //record(0,0,(function(i){return function() {this.updateactivationdial()[i].action();}})(i)) 
		    adi.action();
		}).html(adi.html);
	    }
	}
	$("<button>").addClass("m-move").click(function() { this.resolvemaneuver(); }.bind(this)).appendTo("#activationdial > div");

    },
    movelog: function(obj) {
	obj.id=this.id;
	ANIM.push(obj)
    },
    computepoints: function() {

    },
    log: function(str,a,b,c) {
	if (NOLOG) return;
	var translate=function(a) {
	    if (typeof PILOT_translation[a]!="undefined"
		&&typeof PILOT_translation[a].name!="undefined") 
		return PILOT_translation[a].name;
	    if (typeof PILOT_translation[a+" (Scum)"]!="undefined"
		&&typeof PILOT_translation[a+" (Scum)"].name!="undefined") 
		return PILOT_translation[a+" (Scum)"].name;
	    if (typeof UPGRADE_translation[a]!="undefined"
		&&typeof UPGRADE_translation[a].name!="undefined") 
		return UPGRADE_translation[a].name;
	    if (typeof CRIT_translation[a]!="undefined"
		&&typeof CRIT_translation[a].name!="undefined")
		return CRIT_translation[a].name;
	    return a;
	}
	if (typeof UI_translation[str]!="undefined") str=UI_translation[str];
	if (typeof a=="string") a=translate(a);
	str=str.replace(/%0/g,a)
	if (typeof b=="string") b=translate(b);
	str=str.replace(/%1/g,b)
	if (typeof c=="string") c=translate(c);
	str=str.replace(/%2/g,c)
	str=str.replace(/%HIT%/g,"<code class='hit'></code>")
	.replace(/%STRESS%/g,"<code class='xstresstoken'></code>")
	.replace(/%CRIT%/g,"<code class='critical'></code>")
	.replace(/%EVADE%/g,"<code class='xevadetoken'></code>")
	.replace(/%FOCUS%/g,"<code class='xfocustoken'></code>")
	.replace(/%SHIELD%/g,"<code class='cshield'></code>")
	.replace(/%HULL%/g,"<code class='chull'></code>")
	.replace(/%ROLL%/g,"<code class='symbols'>r</code>")
	.replace(/%TURNLEFT%/g,"<code class='symbols'>4</code>")
	.replace(/%TURNRIGHT%/g,"<code class='symbols'>6</code>")
	.replace(/%BOOST%/g,"<code class='symbols'>b</code>")
        .replace(/%ELITE%/g,"<code class='symbols'>E</code>")
 	.replace(/%BOMB%/g,"<code class='symbols'>B</code>")
	.replace(/%STRAIGHT%/g,"<code class='symbols'>8</code>")
	.replace(/%CREW%/g,"<code class='symbols'>C</code>")
        .replace(/%STOP%/g,"<code class='symbols'>5</code>")
        .replace(/%TARGET%/g,"<code class='symbols'>l</code>")
        .replace(/%TORPEDO%/g,"<code class='symbols'>P</code>")
 	.replace(/%CANNON%/g,"<code class='symbols'>C</code>")
	.replace(/%SYSTEM%/g,"<code class='symbols'>S</code>")
	.replace(/%ILLICIT%/g,"<code class='symbols'>I</code>")
        .replace(/%MISSILE%/g,"<code class='symbols'>M</code>")
        .replace(/%TURRET%/g,"<code class='symbols'>U</code>")
        .replace(/%BANKLEFT%/g,"<code class='symbols'>7</code>")
        .replace(/%BANKRIGHT%/g,"<code class='symbols'>9</code>")
        .replace(/%UTURN%/g,"<code class='symbols'>2</code>")
        .replace(/%SLOOPLEFT%/g,"<code class='symbols'>1</code>")
        .replace(/%SLOOPRIGHT%/g,"<code class='symbols'>3</code>");
	log("<div><span style='color:"+this.color+"'>["+this.name+"]</span> "+str+"</div>");
    },
    candocloak: function() {
	return !this.iscloaked;
    },
    clearaction: function() { this.action=-1; },
    showaction:function() {
	if (this.action<this.actionList.length && this.action>-1) {
	    var a = this.actionList[this.action];
	    var c=A[a.type].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});
    },
    showinfo: function() {
	var i=0,j;
	if (this.focus>0) {
	    this.infoicon[i++].attr({text:A.FOCUS.key,fill:A.FOCUS.color});}
	if (this.evade>0) {
	    this.infoicon[i++].attr({text:A.EVADE.key,fill:A.EVADE.color});}
	if (this.iscloaked==true) {
	    this.infoicon[i++].attr({text:A.CLOAK.key,fill:A.CLOAK.color});}
	if (this.targeting.length>0) {
	    this.infoicon[i++].attr({text:A.TARGET.key,fill:A.TARGET.color});}
	if (this.istargeted.length>0) {
	    this.infoicon[i++].attr({text:A.ISTARGETED.key,fill:A.ISTARGETED.color});}
	if (this.stress>0) {
	    this.infoicon[i++].attr({text:A.STRESS.key,fill:A.STRESS.color});}
	if (this.ionized>0) {
	    this.infoicon[i++].attr({text:"Z",fill:A.STRESS.color});}
	for (j=i; j<4; j++) {
	    this.infoicon[i++].attr({text:""});}	    
    },
    showoutline: function() {
        this.outline.attr({ stroke:((activeunit==this)?this.color:halftone(this.color)) }); 
    }, 
    endcombatphase:function() {},
    endphase: function() {},
//?28;36;&56;#
    beginplanningphase: function() {
	return this.newlock();
    },
    beginactivationphase: function() {
	return this.newlock();
    },
    timetoshowmaneuver: function() {
	return this.maneuver>-1;
    },
    getmaneuver: function() {
	if (this.ionized>0) return this.getdial()[0];
	return this.getdial()[this.maneuver];
    },
    showmaneuver: function() {
	if (this.timetoshowmaneuver()) {
	    var d = this.getmaneuver();
	    var c  =C[(typeof this.forceddifficulty!="undefined")?this.forceddifficulty:d.difficulty];
	    if (!(activeunit==this)) c = halftone(c);
            this.dialspeed.attr({text:P[d.move].speed,fill:c});
            this.dialdirection.attr({text:P[d.move].key,fill:c});
	}
    },
    beginactivation: function() {
	this.showmaneuver();
	this.show();
    },
    endactivationphase: function() {
	this.actionsdone=[];
	this.forceddifficulty=undefined;
    },
    begincombatphase: function() {
        return this.newlock();
    },
    beginattack: function() { },
    toString: function() {
	if (phase==SELECT_PHASE||phase==CREATION_PHASE) return this.toString2();
	var i;
	var n=8;
	for (i=0; i<squadron.length; i++) if (this==squadron[i]) break;
	if (i==squadron.length) i=-1;;
	if (i==-1) str="<div class='dead '>"; else str="<div>";
	n+=this.upgrades.length*2;
	if (this.hull+this.shield<=n) {
	    str+="<div class='vertical outoverflow stat'>";
	    str+="<div class='hull'>"+repeat("u ",this.hull)+"</div>";
	    str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
	} else {
	    if (this.hull>n) {
		str+="<div class='vertical outoverflow stat'>";
		str+="<div class='hull'>"+repeat("u ",n)+"</div></div>";
		if (this.hull<=n*2) {
		    str+="<div class='vertical outoverflow stat2'>";
		    str+="<div class='hull'>"+repeat("u ",this.hull-n)+"</div>";
		    if (this.shield+this.hull<=n*2) 
			str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
		    else { 
			str+="<div class='shield'>"+repeat("u ",n*2-this.hull)+"</div></div>";
			str+="<div class='vertical outoverflow stat3'>";
			str+="<div class='shield'>"+repeat("u ",this.shield-n*2+this.hull)+"</div></div>";
		    }
		} else {
		    str+="<div class='vertical outoverflow stat2'><div class='hull'>"+repeat("u ",n)+"</div></div>";
		    str+="<div class='vertical outoverflow stat3'><div class='hull'>"+repeat("u ",this.hull-n*2)+"</div>";
		    str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
		}
	    } else { // No more than 8 shields ? 
		str+="<div class='vertical outoverflow stat'><div class='hull'>"+repeat("u ",this.hull)+"</div>";
		str+="<div class='shield'>"+repeat("u ",n-this.hull)+"</div></div>";
		str+="<div class='vertical outoverflow stat2'><div class='shield'>"+repeat("u ",this.shield-n+this.hull)+"</div></div>";
	    }    
	}
	str+="<div><div class='statskill'>"+this.skill+"</div>";
	var text=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	var t=text;
	var name;
	if (typeof text=="undefined"||typeof text.text=="undefined") t=""; else t="<span>"+formatstring(text.text)+"</span>"; 
	if (typeof text=="undefined"||typeof text.name=="undefined") name=this.name; else name=text.name;
	str+="<div class='name'><div class='tooltip outoverflow'>"+t+"</div><div>"+name+"</div></div>";
	text=SHIP_translation[this.ship.name];
	if (typeof text=="undefined") text=this.ship.name;
	str+="<div><div style='font-size:small'><code class='"+this.faction+"'></code>"+text+"</div></div>";
	str+="<div class='vertical'><div>";
	if (i>-1) str+="<div><table style='width:100%'><tr style='width:100%'>"+this.getusabletokens()+"</tr></table></div>";
	str+="</div></div>";
	var a;
	var b;
	var strw="",stru="",strc="";
	
	a="<td><button class='statevade' onclick='if (!squadron["+i+"].dead) squadron["+i+"].togglerange();'>"+this.getagility()+"<span class='symbols'>^</span></button></td>";
	b="<td></td>";
	if (this.team==1) strw+="<tr>"+b+a+"</tr>"; else strw+="<tr>"+a+b+"</tr>";

	//for (i=0; i<this.weapons.length; i++) strw+=this.weapons[i];
	for (i=0; i<this.upgrades.length;i++) stru+=this.upgrades[i];
	for (i=0; i<this.criticals.length;i++) strc+=this.criticals[i];

	str+="<table class='details' style='width:100%'>"+strw+stru+strc+"</table></div>"
	return str;
    },
    canusefocus: function() {
	return this.focus>0; 
    },
    canuseevade: function() {
	return this.evade>0;
    },
    canusetarget:function(sh) {
	return this.targeting.length>0
	    &&(typeof sh=="undefined" || this.targeting.indexOf(sh)>-1);
    },
    addstdmod: function() {
	/* Target for attack */
	this.addattackmoda(this,function(m,n) { 
	    return this.canusetarget(targetunit);
	}.bind(this),function(m,n) { 
	    this.removetarget(targetunit);
	    var f;
	    if (!this.canusefocus()) f=Math.floor(m/100)%10; else f=0;
	    var b=n-Math.floor(m/100)%10-Math.floor(m/10)%10-m%10;
	    var r=this.rollattackdie(b+f);
	    m=m-f*100;
	    for (i=0; i<r.length; i++) {
		if (r[i]=="hit") m+=1;
		if (r[i]=="critical") m+=10;
		if (r[i]=="focus") m+=100;
	    }
	    return m;
	}.bind(this),false,"target",true);
	/* Focus for attack */
	this.addattackmoda(this,function(m,n) { 
	    return this.canusefocus(); 
	}.bind(this),function(m,n) {
	    this.removefocustoken();
	    var f=Math.floor(m/100)%10;
	    if (f>0) return m-f*100+f
	    return m;
	}.bind(this),false,"focus",true);
	/* Focus for defense */
	this.adddefensemodd(this,function(m,n) { 
	    return this.canusefocus(); 
	}.bind(this),function(m,n) {
	    this.removefocustoken();
	    var f=Math.floor(m/10)%10;
	    if (f>0)  return m-10*f+f;
	    return m;    
	}.bind(this),false,"focus",true);
	/* Evade */
	this.adddefenseadd(this,function(m,n) { 
	    return this.canuseevade(); 
	}.bind(this),function(m,n) { 
	    this.removeevadetoken(); 
	    return {m:m+1,n:n+1} 
	}.bind(this),"evade",true);
    },
    getusabletokens: function() {
	var str=""; var targets=""
	if (this.focus>0) str+="<td title='"+this.focus+" focus token(s)' class='xfocustoken'></td>";
	if (this.evade>0) str+="<td title='"+this.evade+" evade token(s)' class='xevadetoken'></td>";
	for (var j=0; j<this.targeting.length; j++) targets+=this.targeting[j].name+" ";
	if (this.targeting.length>0) str+="<td title='targeting "+targets.replace(/\'/g,"&#39;")+"' class='xtargettoken'></td>";
	targets="";
	for (var j=0; j<this.istargeted.length; j++) targets+=this.istargeted[j].name+" ";
	if (this.istargeted.length>0) str+="<td title='targeted by "+targets.replace(/\'/g,"&#39;")+"' class='xtargetedtoken'></td>";
	if (this.iscloaked) str+="<td class='xcloaktoken'></td>";
	if (this.stress>0) str+="<td title='"+this.stress+" stress token(s)' class='xstresstoken'></td>";	
	if (this.ionized>0) str+="<td title='"+this.ionized+" ionization token(s)' class='xionizedtoken'></td>";	
	return str;
    },
    showstats: function() {
	if (phase==SELECT_PHASE||phase==CREATION_PHASE) {
	    $("#stats"+this.id).html(
		"<div class='PS'>"+this.skill+"</div>"
		    +"<div class='statfire'>"+this.weapons[0].getattack()+"</div>"
		    +"<div class='statevade'>"+this.getagility()+"</div>"
		    +"<div class='statshield'>"+this.shield+"</div>"
		    +"<div class='stathull'>"+this.hull+"</div>");
	} else {
	    if (typeof this.skillbar=="undefined") {
		console.trace();
		this.log("undefined skillbar?");
		return;
	    }
	    this.skillbar.attr({text:repeat('u',this.skill)});
	    this.firebar.attr({text:repeat('u',this.weapons[0].getattack())});
	    this.evadebar.attr({text:repeat('u',this.getagility())});
	    this.hullbar.attr({text:repeat('u',this.hull)});
	    this.shieldbar.attr({text:repeat('u',this.shield+this.hull)});
	    $("#"+this.id).html(""+this);
	}
    },
    showpanel: function() {
	var m=VIEWPORT.m.clone();
	var bbox=this.g.getBBox();
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var startX=0;
	var startY=0;
	if (h>w) startY=(h-w)/2;
	else startX=(w-h)/2;
	var min=Math.min(w/900.,h/900.);
	var x=startX+(m.x(bbox.x,bbox.y)+bbox.width/2)*min;
	var y=startY+(m.y(bbox.x,bbox.y))*min
	var mm=m.split();
	var d=mm.scalex;
	$(".phasepanel").css({left:x+d*(this.islarge?40:20),top:y}).show();
    },
    timeforaction: function() {
	//log("waiting ?"+waitingforaction.isexecuting+" active?"+(this==activeunit)+" moved?"+this.hasmoved+" actiondone?"+this.actiondone);
	return (this==activeunit&&this.hasmoved&&!this.actiondone&&phase==ACTIVATION_PHASE);
    },
    timeformaneuver: function() {
	return (this==activeunit&&this.maneuver>-1&&!this.hasmoved&&this.skill==skillturn&&subphase==ACTIVATION_PHASE);
    },
    show: function() {
	var i;
	if (typeof this.g=="undefined") return;
	if (typeof this.skillbar=="undefined") {
	    this.log("show:skillbar undefined");
	    for (i=0; i<squadron.length; i++) {
		squadron[i].log("im here");
	    }
	}
	this.g.transform(this.m);
	this.g.appendTo(VIEWPORT); // Put to front
	this.geffect.transform(this.m);
	this.geffect.appendTo(VIEWPORT);
	this.showoutline();
	this.flameno++;
	this.showstats();
	this.showinfo();
	if (activeunit!=this) return;

	this.showpanel();
	this.showdial();
	this.showmaneuver();
	if (phase==ACTIVATION_PHASE) this.showactivation();
	this.showattack();
	if (!this.dead) { 
	    $("#"+this.id).html(""+this);
	    //$("#"+this.id).addClass("selected");
	}
    },
    showhitsector: function(b,name) {
        var opacity=(b)?"inline":"none";
	this.select();
	if (!b) {
	    for (i=0; i<this.sectors.length; i++) this.sectors[i].remove();
	    for (i=0; i<this.ranges.length; i++) this.ranges[i].remove();
	    this.ranges=[];
	    this.sectors=[];
	    return;
	}
	for (k=0; k<this.weapons.length;k++) {
	    if (this.weapons[k].name==name) break;
	} 
	if (k==this.weapons.length) return;

	var r0=this.weapons[k].range[0], r1=this.weapons[k].range[1];
	if (this.weapons[k].isTurret()||this.isTurret(this.weapons[k])) {
	    this.showrange(b,r0,r1);
	} else {
	    var i,k;
	    if (r0==1) {
		for (i=r0;i<=r1; i++) { 
		    this.sectors.push(s.path(this.getPrimarySectorString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof this.weapons[k].auxiliary!="undefined") {
		    var aux=this.weapons[k].auxiliary;
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(aux.call(this,i,this.m.clone())).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		} 
	    } else {
		for (i=r0; i<=r1; i++) {
		    this.sectors.push(s.path(this.getPrimarySubSectorString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof this.weapons[k].subauxiliary!="undefined") {
		    var aux=this.weapons[k].subauxiliary;
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(aux.call(this,r0-1,i,this.m.clone())).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		}

	    }
	}
    },
    showrange: function(b,r0,r1) {
        var opacity=(b)?"inline":"none";
	var i;
	this.select();
	if (!b) {
	    for (i=0; i<this.ranges.length; i++) 
		this.ranges[i].remove();
	    this.ranges=[];
	    return; 
	}
	if (r0==1) {
	    for (i=r0; i<=r1; i++) 
		this.ranges.push(s.path(this.getRangeString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
	} else {
	    for (i=r0; i<=r1; i++) 
		this.ranges.push(s.path(this.getSubRangeString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
	}  
    },
    togglehitsector: function(name) {
	var b;
	if (this.sectors.length+this.ranges.length>0) b=false; else b=true;
	this.showhitsector(b,name);
    },
    togglerange: function() {
	var b;
	if (this.ranges.length>0) b=false; else b=true;
	this.showrange(b,1,3);
    },
    isPointInside:function(path,op) {
	var i;
	for (i=0; i<op.length; i++) 
	    if (Snap.path.isPointInside(path,op[i].x,op[i].y)) return true;
	return false;
    },
    isinsector: function(m,n,sh,getSubSectorString,getSectorString,flag) {
	var o1;
	var o2=sh.getOutlineString(sh.m);
	if (n>1) o1=getSubSectorString.call(this,n-1,n,m); else o1=getSectorString.call(this,n,m);
	return (o1!=null&&(Snap.path.intersection(o2.s,o1).length>0
	       		   ||this.isPointInside(o1,o2.p)))
    },
    isinfiringarc: function(sh) {
	return this.getsector(sh)<=3;
    },
    /* Primary and auxiliary */
    getsector: function(sh,m) {
	return this.weapons[0].getsector(sh);
    },
    /* Primary only */
    getprimarysector: function(sh,m) {
	var i;
	if (typeof m=="undefined") m=this.m;
	var n=this.getoutlinerange(m,sh).d
	if (this.isinsector(m,n,sh,this.getPrimarySubSectorString,this.getPrimarySectorString)) return n;
	return 4;
    },
    isinoutline: function(o1,sh,m) {
	return this.isPointInside(o1,sh.getOutlinePoints(m));
    },
    checkcollision: function(sh) {
	return (this.touching.indexOf(sh)>-1);
    },
    resolvecollision: function() {
	var i;
	if (typeof this.touching == "undefined") this.touching=[];
	for (i=0; i<this.touching.length; i++) {
	    var u=this.touching[i];
	    if (u.touching.indexOf(this)==-1) {
		u.touching.push(this);
		u.collidedby(this);
	    }
	}   
    },
    collidedby: function(sh) {
    },
    resolveocollision: function() {
	var i;
	var n=this.ocollision.template.length;
	if (this.ocollision.overlap>-1) n++;
	for (i=0; i<n; i++) {
	    var roll=this.rollattackdie(1)[0];
	    if (roll=="hit") { this.resolvehit(1); this.checkdead(); }
	    else if (roll=="critical") { this.resolvecritical(1);
					 this.checkdead();
				       }
	}
    },
    removeshield: function(n) {
	this.shield=this.shield-n;
	if (this.shield<0) this.shield=0;
	var r=TEAMS[this.team].history.rawdata
	if (typeof r[round]=="undefined") r[round]={hits:0,dead:""}
	r[round].hits+=n;
    },
    resolvehit: function(n) {
	var s=0;
	if (n==0) return 0;
	if (this.shield>n) this.removeshield(n);
	else {
	    var s=n-this.shield;
	    this.removeshield(this.shield);
	    if (s>0) this.applydamage(s);
	}	    
	if (typeof this.skillbar=="undefined") {
	    this.log("hit: undefined skillbar?");
	    return;
	}

	this.showstats();
	return s;
    },
    resolvecritical: function(n) {
	var s=0;
	if (n==0) return 0;
	if (this.shield>n) this.removeshield(n);
	else {
	    var s=n-this.shield;
	    this.removeshield(this.shield)
	    if (s>0) this.applycritical(s);
	}
	if (typeof this.skillbar=="undefined") {
	    this.log("critical: undefined skillbar?");
	    return;
	}

	this.showstats();
	return s;
    },
    removehull: function(n) {
	this.hull=this.hull-n;
	var r=TEAMS[this.team].history.rawdata
	if (typeof r[round]=="undefined") r[round]={hits:0,dead:""}
	r[round].hits+=n;
	this.log("-%0 %HULL%",n);
	if (this.hull<=this.ship.hull/2) this.imgsmoke.attr({display:"block"});
	if (this.hull==1) {
	    this.imgsmoke.attr({display:"none"});
	    this.imgflame.attr({display:"block"});
	}
    },
    selectcritical: function(crits,endselect) {
	var resolve=function(c,n) {
	    $("#actiondial").empty();
	    endselect(c);
	    this.endnoaction(n,"CRITICAL");
	}.bind(this);
	this.doselection(function(n) {
	    var i,str="";
	    $("#actiondial").empty();
	    for (var i=0; i<crits.length; i++) {
		(function(k) {
		    var e=$("<button>").text(CRITICAL_DECK[crits[k]].name)
			.click(function() { record(this.id,k,"selectcritical");resolve(crits[k],n);}.bind(this));
		    $("#actiondial").append(e);
		}.bind(this))(i);
	    }
	    $("#actiondial").show();
	}.bind(this),"critical");
    },
    selectdamage: function() {
	var i,s=0,m,j;
	for (i=0; i<CRITICAL_DECK.length; i++) s+=CRITICAL_DECK[i].count;
	var r=this.rand(s);
	m=0;
	for (i=0; i<CRITICAL_DECK.length; i++) {
	    m+=CRITICAL_DECK[i].count;
	    if (m>r) return i;
	}
	return 0;	
    },
    applydamage: function(n) {
	var s,j;
	for (j=0; j<n; j++) {
	    s=this.selectdamage();
	    CRITICAL_DECK[s].count--;
	    new Critical(this,s);
	}
	this.removehull(n);
	this.show();
    },
    applycritical: function(n) {
	var s,j;
	for (j=0; j<n; j++) {
	    s=this.selectdamage();
	    CRITICAL_DECK[s].count--;
	    if(this.faceup(new Critical(this,s))) this.removehull(1);
	}
	this.show();
    },
    faceup: function(crit) {
	crit.faceup();
	return true;
    },
    gethitrange: function(w,sh) {
	if (sh.team==this.team) return 0;
	var gr=this.weapons[w].getrange(sh);
	return gr;
    },
    gethitrangeallunits: function() {
	var str='';
	var k,i;
	var range=[[],[],[],[],[]];
	for(i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if (sh!=this) 
		for (k=0; k<this.weapons.length; k++){
		    var r=this.gethitrange(k,sh);
		    //log("ghrau "+sh.name+" in range "+r+" with "+this.weapons[k].name);
		    if (r>0) {
			for (j=0; j<range[r].length; j++) if (range[r][j].unit==i) break;
			//log("["+this.name+"] can fire "+sh.name+"/"+this.weapons[k].name);
			if (j<range[r].length) range[r][j].wp.push(k);
			else range[r].push({unit:i,wp:[k]});
		    }
		}
	};
	return range;
    },
    getrange: function(sh) {
	return this.getoutlinerange(this.m,sh).d;
    },
    getdist:function(mm,sh) {
	var ro=this.getOutlinePoints(mm);
	var rsh = sh.getOutlinePoints(sh.m);
	var min=-1;
	var i,j,k;
	var minobs=false,mini,minj;
	for (i=0; i<4; i++) {
	    for (j=0; j<4; j++) {
		var d=dist(rsh[j],ro[i]);
		if (d<min||min==-1) { min=d;}
	    }
	}
	return min;
    },
    // Returns the range separating both units and if an obstacle is inbetween
    getoutlinerange:function(m,sh) {
	var ro=this.getOutlinePoints(m);
	var rsh = sh.getOutlinePoints(sh.m);
	var min=90001;
	var i,j,k;
	var str="";
	var obs=false;
	var minobs=false,mini,minj;
	for (i=0; i<4; i++) {
	    for (j=0; j<4; j++) {
		var d=dist(rsh[j],ro[i]);
		if (d<min) { min=d; mini=i; minj=j;}
	    }
	}
	if (min>90000) return {d:4,o:false};
	var dx=rsh[minj].x-ro[mini].x;
	var dy=rsh[minj].y-ro[mini].y;
	var a=-ro[mini].x*dy+ro[mini].y*dx; //(x-x0)*dy-(y-y0)*dx>0
	if (OBSTACLES.length>0) 
	for (k=0; k<6; k++) {
	    var op=OBSTACLES[k].getOutlineString().p;
	    var s=op[0].x*dy-op[0].y*dx+a;
	    var v=s;
	    for (i=1; i<op.length; i++) {
		if (dist(rsh[minj],op[i])<1.2*min&&
		    dist(ro[mini],op[i])<1.2*min) {
		    v=op[i].x*dy-op[i].y*dx+a;
		    if (v*s<0) break; 
		}
	    }
	    if (v*s<0) break;
	}
	if (k<6) obs=true;
	if (min<=10000) {return {d:1,o:obs}; }
	if (min<=40000) { return {d:2,o:obs}; }
	return {d:3,o:obs};
    },

    getrangeallunits: function() {
	var range=[[],[],[],[],[]],i;
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if (sh!=this) {
		var k=this.getrange(sh);
		range[k].push({unit:i});
	    }
	};
	return range;
    }
};
var IACOMPUTING=0;
function IAUnit() {
}

IAUnit.prototype= {
    computemaneuver: function() {
	var i,j,k,d=0;
	var q=[],possible=-1;
	var gd=this.getdial();
	var enemies=[];
	this.evaluatemoves(true,true);
	//log("computing all enemy positions");
	// Find all possible future positions of enemies
	var k=0;
	for (i=0; i<squadron.length; i++) {
	    var u=squadron[i];
	    if (u.team!=this.team) {
		if (u.meanmround!=round) u.evaluatemoves(false,false);
		u.oldm=u.m;
		u.m=u.meanm;
		enemies.push(u);
	    }
	}
	var findpositions=function(gd) {
	    var q=[],c,j,i;
	// Find all possible moves, with no collision and with units in range 
	    var COLOR=[GREEN,WHITE,YELLOW];
	    //log("find positions with color "+c);
	    for (i=0; i<gd.length; i++) {
		var d=gd[i];
		if (d.color==RED) continue;
		var mm=this.getpathmatrix(this.m,gd[i].move);
		var n=12-4*COLOR.indexOf(d.color);
		var n0=n;
		var oldm=this.m;
		this.m=mm;
		n+=this.evaluateposition();
		if (d.difficulty=="RED") n=n-1.5;
		//this.log(d.move+" "+d.difficulty+" "+n);
		this.m=oldm;
		//this.log(d.move+":"+n+"/"+n0+" "+d.color);
		q.push({n:n,m:i});
	    }
	    return q;
	}.bind(this);
	q=findpositions(gd);
	// Restore position
	for (k=0; k<enemies.length; k++) enemies[k].m=enemies[k].oldm;
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    //for (i=0; i<q.length; i++) this.log(">"+q[i].n+" "+gd[q[i].m].move);
	    d=q[0].m;
	    //if (typeof gd[d] == "undefined") log("GD NON DEFINI POUR "+this.name+" "+gd.length+" "+d);	    
	} else {
	    for (i=0; i<gd.length; i++) 
		if (gd[i].difficulty!="RED"||gd[i].move.match(/F\d/)) break;
	    d=i;
	    //if (typeof gd[d] == "undefined") log("(q=vide) UNDEFINED GD FOR "+this.name+" "+gd.length+" "+possible);

	}
	this.log("Maneuver set");//+":"+d+"/"+q.length+" possible?"+possible+"->"+gd[d].move);
	return d;
    },
    resolveactionselection: function(units,cleanup) {
	cleanup(0);
    },
    selectcritical: function(crits,endselect) {
	for (var i=0; i<crits.length; i++) {
	    if (CRITICAL_DECK[crits[i]].lethal==false) {
		endselect(crits[i]); return;
	    }
	}
	endselect(crits[0]);
    },
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var i;
	var ready=false;
	var score=-1000;
	var scorei=-1;
	var old=this.m;
	for (i=0; i<moves.length; i++) {
	    var c=this.getmovecolor(moves[i],true,true);
	    if (c==GREEN) {
		ready=true;
		this.m=moves[i];
		var e=this.evaluateposition();
		if (score<e) { score=e; scorei=i; }
	    }
	}
	this.m=old;
	if (ready&&scorei>-1) { 
	    if (automove) this.m=moves[scorei]; 
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    OBSTACLES[mine[i]].detonate(this)
		}
	    cleanup(this,scorei); 
	}
	else { this.m=old; cleanup(this,-1); }
    },
    timetoshowmaneuver: function() {
	/*if (phase==ACTIVATION_PHASE&&this.maneuver>-1) 
	    this.log("show ? "+(skillturn==this.skill)+" "+this.skill+" "+skillturn);*/
	return this.maneuver>-1 && phase==ACTIVATION_PHASE&&skillturn==this.skill;
    },
    doplan: function() {
	$("#move").css({display:"none"});
	$("#maneuverdial").empty();
	if (phase==PLANNING_PHASE&&this.maneuver==-1) {
	    IACOMPUTING++;
	    if  (IACOMPUTING==1) {
		$("#npimg").html("<img style='width:10px' src='png/waiting.gif'/>");
	    }
	    var p;
	    p=setInterval(function() {
		var m=this.computemaneuver(); 
		IACOMPUTING--;
		if (IACOMPUTING==0) $("#npimg").html("&#9658;");
		this.newm=this.getpathmatrix(this.m,this.getdial()[m].move);
		this.setmaneuver(m);
		clearInterval(p);
	    }.bind(this),1);
	}
	return this.deferred;
    },
    showdial: function() { 	
	$("#maneuverdial").empty();
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.dialspeed.attr({text:""});
		this.dialdirection.attr({text:""});
		return;
	    };
	}
    },
    resolvedecloak: function() {
	this.resolveactionmove(this.getdecloakmatrix(this.m),
			       function(t,k) {
				   if (k>0) {
				       t.agility-=2; t.iscloaked=false;
				       SOUNDS.decloak.play();
				   }
				   this.hasdecloaked=true;
			       }.bind(this),true);
    },
    showactivation: function() {
	//$("#activationdial").empty();
	/*
	if (phase>PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.dialspeed.attr({text:""});
		this.dialdirection.attr({text:""});
		return;
	    };
	    d = this.getdial()[this.maneuver];
	    var c  =C[d.difficulty];
	    if (!(activeunit==this)) {
		c = halftone(c);
	    }
            this.dialspeed.attr({text:P[d.move].speed,fill:c});
            this.dialdirection.attr({text:P[d.move].key,fill:c});
	}*/
    },
    doactivation: function() {
	var ad=this.updateactivationdial();
	if (this.timeformaneuver()) {
	    //this.log("resolvemaneuver");
	    this.resolvemaneuver();
	} //else this.log("no resolvemaneuver");
    },
    showaction: function() {
	$("#actiondial").empty();
	if (this.action>-1&&this.action<this.actionList.length) {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});	
    },
    donoaction:function(list,str) {
	var cmp=function(a,b) {
	    if (a.type=="CRITICAL") return -1;
	    if (b.type=="CRITICAL") return 1;
	    if (a.type=="EVADE") return -1;
	    if (b.type=="EVADE") return 1;
	    if (a.type=="FOCUS") return -1;
	    if (b.type=="FOCUS") return 1;
	    return 0;
	}
	list.sort(cmp);
	return this.enqueueaction(function(n) {
		this.select();
		if (typeof str!="undefined") this.log(str);
		var grlu=this.gethitrangeallunits();
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="EVADE") {
			if (grlu[1].length==0&&grlu[2].length==0&&grlu[3].length==0&&this.candoevade()) { a=list[i]; break; }
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		this.resolvenoaction(a,n);
	    }.bind(this),"donoaction ia");
    },
    setpriority:function(action) {
	var PRIORITIES={"FOCUS":3,"EVADE":1,"CLOAK":4,"TARGET":2,"CRITICAL":10};
	var p=PRIORITIES[action.type];
	if (typeof p=="undefined") p=0;
	action.priority=p;
	var pl=[];
	if (action.type=="BOOST") pl=this.getboostmatrix(this.m);
	if (action.type=="ROLL") pl=this.getrollmatrix(this.m);
	if (pl.length>0) {
	    var old=this.m;
	    var e=this.evaluateposition();
	    var emove=e-1;
	    for (i=0; i<pl.length; i++) {
		this.m=pl[i];
		emove=Math.max(emove,this.evaluateposition());
	    }
	    this.m=old;
	    if (emove>e) action.priority=2*(emove-e);
	}
	//log(this.name+": priority for "+action.type+":"+action.priority);
    }, 
    doaction: function(list,str) {
	var cmp=function(a,b) { return b.priority-a.priority; }

	for (i=0; i<list.length; i++) {
	    this.setpriority(list[i]);
	}
	list.sort(cmp);

	//this.log("inside doaction "+list.length);
	if (list.length==0) return this.enqueueaction(function(n) {
	    this.endnoaction(n);
	}.bind(this));
	return this.enqueueaction(function(n) {
	    if (this.candoaction()) {
		this.select();
		if (typeof str!="undefined") this.log(str);
		var grlu=this.gethitrangeallunits();
		var a=null;
		for (i=0; i<list.length; i++) {
		    //this.log("action possible:"+list[i].type);
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="CLOAK"&&this.candocloak()) {
			a=list[i]; break;
		    } else if (list[i].type=="EVADE") {
			if (grlu[1].length==0&&grlu[2].length==0&&grlu[3].length==0&&this.candoevade()) { a=list[i]; break; }
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		if (a==null) this.log("no possible action");
		//if (a!=null) this.log("action chosen: "+a.type);
		//else this.log("null action chosen");
		this.resolveaction(a,n);
	    } else {
		this.endaction(n);
	    }
	}.bind(this),"doaction ia");
    },
    showattack: function() {
	$("#attackdial").empty();
    },
    doattack: function(forced) {
	//this.log("attack?"+forced+" "+(skillturn==this.skill)+" "+this.canfire());
	if (forced==true||(phase==COMBAT_PHASE&&skillturn==this.skill)) {
	    var r=this.gethitrangeallunits();
	    //this.log("ia/doattack");
	    var power=0,p,t=null;
	    var i,j,w;
	    if (this.canfire()) {
		NOLOG=true;
		for (j=0; j<squadron.length; j++) {
		    var u=squadron[j];
		    if (u.team!=this.team) {
			for (i=0; i<this.weapons.length; i++) {
			    var x=this.weapons[i].getrange(u);
			    if (x>0&&x<4) {
				var p=this.getattackstrength(i,u);
				if (p>power) { t = u; power=p; this.activeweapon=i; }
			    }
			}
		    }
		}
		NOLOG=false;
		//this.log("ia/doattack >"+wn[0].name);
      		if (t!=null) return this.selecttargetforattack(this.activeweapon,t);
		//console.log("ia/doattack "+this.name+"<select target");
	    }
		//console.log("ia/doattack:no target");
	    this.hasfired++; this.deferred.resolve();
	}
    },
    doattackroll: function(ar,da,defense,me,n) {
	var i,j,str="";
	$("#attackdial").empty().show();
	$("#defense").empty();
	$("#dtokens").empty();
	displayattackroll(ar,da);
	var doreroll=function(a,i) {
	    var s=0;
	    var nn=a.n();
	    if (a.type.indexOf("blank")>-1) s+=nn;
	    if (a.type.indexOf("focus")>-1) s+=10*nn;
	    if (a.type.indexOf("hit")>-1) s+=100*nn;
	    if (a.type.indexOf("critical")>-1) s+=1000*nn;
	    reroll(nn,true,s,i);
	}
	// Do all possible rerolls 
	for (var i=0; i<ATTACKREROLLA.length; i++) {
	    var a=ATTACKREROLLA[i];
	    if (a.req(this,this.weapons[this.activeweapon],targetunit)) 
		doreroll(a,i);
	}   
	for (var i=0; i<this.ATTACKREROLLA.length; i++) {
	    var a=this.ATTACKREROLLA[i];
	    if (a.req(this.weapons[this.activeweapon],targetunit)) 
		doreroll(a,i+ATTACKREROLLA.length);
	}   

	// Do all possible modifications
	for (i=0; i<ATTACKMODA.length; i++) {
	    var a=ATTACKMODA[i];
	    if (a.req(ar,da)) modroll(a.f,da,i);
	}   
	for (i=0; i<ATTACKMODD.length; i++) {
	    var a=ATTACKMODD[i];
	    if (a.req(ar,da)) {
		//modroll(ATTACKMODD[i].f,da,i+ATTACKMODA.length);
		//log("adding attackmodd");
		//str+="<td id='moda"+(i+ATTACKMODA.length)+"' class='"+a.str+"modtokend' onclick='modroll(ATTACKMODD["+i+"].f,"+da+","+(i+ATTACKMODA.length)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length;//+ATTACKMODD.length;
	for (j=0; j<this.ATTACKMODA.length; j++) {
	    var a=this.ATTACKMODA[j];
	    if (a.req(ar,da)) modroll(a.f,da,(i+j));
	}   
	for (j=0; j<this.ATTACKADD.length; j++) {
	    var a=this.ATTACKADD[j];
	    if (a.req(ar,da)) addroll(a.f,da,(i+j+this.ATTACKMODA.length));
	}   
	if (str!="") {
	    $("#atokens").html(str).show();
	    $("#atokens").append("<button class='m-done' onclick='$(\"#atokens\").empty(); targetunit.defenseroll("+defense+").done(function(roll) { targetunit.dodefenseroll(roll,"+defense+","+me+","+n+")})'></button>");
	} else {
	    $("#atokens").empty(); 
	    targetunit.defenseroll(defense).done(function(roll) {targetunit.dodefenseroll(roll.roll,roll.dice,me,n);});
	}
    },
    dodefenseroll: function(dr,dd,me,n) {
	var i,j;
	displaydefenseroll(dr,dd);
	for (j=0; j<squadron.length; j++) if (squadron[j]==this) break;
	// Add modifiers
 	var doreroll=function(a,i) {
	    var s=0;
	    var nn=a.n();
	    if (a.type.indexOf("blank")>-1) s+=nn;
	    if (a.type.indexOf("focus")>-1) s+=10*nn;
	    if (a.type.indexOf("evade")>-1) s+=100*nn;
	    reroll(nn,false,s,i);
	};
	for (var i=0; i<DEFENSEREROLLD.length; i++) {
	    var a=DEFENSEREROLLD[i];
	    if (a.req(activeunit,activeunit.weapons[activeunit.activeweapon],this)) 
		doreroll(a,i);
	}   
	for (var i=0; i<targetunit.DEFENSEREROLLD.length; i++) {
	    var a=targetunit.DEFENSEREROLLD[i];
	    if (a.req(activeunit.weapons[activeunit.activeweapon],this)) 
		doreroll(a,i+DEFENSEREROLLD.length);
	}   
	for (i=0; i<DEFENSEMODD.length; i++) {
	    var a=DEFENSEMODD[i];
	    if (a.req(dr,dd)) modrolld(a.f,dd,i);
	}   
	for (j=0; j<this.DEFENSEMODD.length; j++) {
	    var a=this.DEFENSEMODD[j];
	    if (a.req(dr,dd)) modrolld(a.f,dd,i+j);
	}   
	$("#dtokens").append("<button>");

	$("#dtokens > button").addClass("m-fire").click(function() {
	    $("#combatdial").hide();
	    this.resolvedamage();
	    this.endnoaction(n,"incombat");
	}.bind(squadron[me])).show();
	//log("defense roll: f"+f+" e"+e+" b"+(dd-e-f));
    },
};

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
	faction:REBEL,
        unit: "X-Wing",
        skill: 9,
	init: function() {
	    var unit=this;
	    var ds=Unit.prototype.getagility;
	    Unit.prototype.getagility=function() {
		var a=ds.call(this);
		if (activeunit==unit&&a>0&&this==targetunit) {
		    //this.log("-1 defense [%0]",unit.name);
		    return a-1; 
		}
		else return a;
	    };
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
	removefocustoken: function() {
	    this.focus--;
	    this.show();
	    var p=[]; 
	    p=this.selectnearbyunits(2,function(a,b) { return (a.team==b.team&&a!=b);});
	    if (p.length>0) {
		this.log("select unit for free %FOCUS%");
		this.doselection(function(n) {
		    this.resolveactionselection(p,function (k) { 
			p[k].log("+1 %FOCUS%");
			p[k].addfocustoken();
			this.endnoaction(n,"FOCUS");
		    }.bind(this));
		}.bind(this),"Garven focus");
	    } 
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
		var f=Math.floor(m/10);
		var e=m-f*10;
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %EVADE%");
		    return m-9;
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
        addtarget: function(t) {
	    var unit=this;
	    Unit.prototype.addtarget.call(this,t);
	    this.doselection(function(n) {
		var p=this.selectnearbyunits(2,function(a,b) { return a.team==b.team&&a!=b; });
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
	getattackstrength: function(i,sh) {
	    var gas=Unit.prototype.getattackstrength.call(this,i,sh);
	    if (sh.criticals.length>0) {
		this.log("+1 attack die for attacking damaged unit");
		return gas+1;
	    }
	    return gas;
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
		var c=Math.floor(m/10);
		var h=(m-c*10)%100;
		if (h>0) {
		    this.log("1 %HIT% -> 1 %CRIT%");
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
        faction:EMPIRE,
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
        faction:EMPIRE,
	init: function() {
	    var gas=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=gas.call(this,w,sh);
		if (!sh.isinfiringarc(this)) {
		    a=a+1;
		    this.log("+1 attack against %0",sh.name);
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
        faction:EMPIRE,
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
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 7,
        points: 27,
	init: function() {
	    var unit=this;
	    this.ac=Unit.prototype.applycritical;
	    Unit.prototype.applycritical=function(n) {
		if (activeunit==unit&&targetunit!=unit) {
		    for (var j=0; j<n; j++) {
			var s1=this.selectdamage();
			CRITICAL_DECK[s1].count--;
			var s2=this.selectdamage();
			CRITICAL_DECK[s2].count--;
			var s3=this.selectdamage();
			CRITICAL_DECK[s3].count--;
			sc=[s1,s2,s3];
			unit.log("select one critical");
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
        upgrades: [ELITE,MISSILE],
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
	    this.fire=2;
	},
	uninstall: function() {
	    this.hull=8;
	    this.shield=5;
	    this.fire=5;
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
	faceup: function(c) {
	    this.log("ignore critical %0",c.name);
	    return true;
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
	    var p=this.selectnearbyunits(1,function(t,s) { return t.team==s.team&&t!=s; })
	    if (p.length>0&&d=="GREEN") {
		this.doselection(function(n) {
		    this.log("select unit for a free action"+p.length);
		    this.resolveactionselection(p,function(k) {
			p[k].log("unit chosen for free action");
			p[k].log("actions "+p[k].getactionbarlist().length);
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
	init: function() {
	    var unit=this;
	    var cc=Unit.prototype.cancelcritical;
	    Unit.prototype.cancelcritical=function(c,e,sh) {
		var ce=cc.call(this,c,e,sh);
		if (c>ce&&sh!=this&&activeunit.name=="Kath Scarlet") {
		    this.log("+1 %STRESS for cancelling %CRIT%");
		    this.addstress();
		}
		return ce;
	    }
	},
        points: 38,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Boba Fett",
        unique: true,
	done:true,
        faction:EMPIRE,
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial.match("BL3|BL2|BL1")) {
		this.log("select %BANKLEFT% or %BANKRIGHT% turn");
		var newdial=dial.replace(/L/,"R");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,realdial),
		     this.getpathmatrix(this.m,newdial)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,newdial,newdial,difficulty);
		    }.bind(this),false,true);
	    } else if (dial.match("BR3|BR2|BR1")) {
		this.log("select %BANKLEFT% or %BANKRIGHT% turn");
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
	    this.shipimg="b-wing-1.png";
	    var cc=Unit.prototype.cancelcritical;
	    Unit.prototype.cancelcritical=function(c,h,sh) {
		var ce=cc.call(this,c,h,sh);
		if (activeunit.name=="Ten Numb"&&c>1 && ce==0) return 1;
		return ce;
	    }
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
	    if (!this.dead) {
		var p=this.selectnearbyunits(3,function(t,s) { return t.team==s.team&&t!=s; })
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit for 12 PS");
			this.resolveactionselection(p,function(k) {
			    if (k>-1) {
				p[k].oldskill=p[k].skill;
				p[k].skill=12;
				filltabskill();
				p[k].showstats();
				this.log("has PS of 12");
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
		var p=this.selectnearbyunits(3,function(t,s) { return s.team==t.team&&s!=t; });
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
	    // TODO : add a type of modifier: add a die/dices
	    var unit=this;
	    this.addattackmoda(this, function(m,n) {
		return (unit.stress==0)&&
			(activeunit.team==unit.team)&&(activeunit!=unit)
			&&(unit.getrange(activeunit)<=3);
	    }.bind(this), function(m,n) {
		var f=unit.rollattackdie(1)[0];
		unit.addstress();
		unit.log("+1 attack die");
		if (f=="focus") return m+100;
		if (f=="hit") return m+1;
		if (f=="critical") return m+10;
		return m;
	    }.bind(this),true,"hit");
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
		var p=this.selectnearbyunits(1,function(s,t) { return s.team==t.team&&s!=t; });
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
		    this.stress--;
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
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial.match("K5|K3")) {
		this.log("select %UTURN% speed");
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
		return {m:m+1,n:n+1};
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
        attackroll:function(n) {
	    var ar=Unit.prototype.attackroll;
	    var r=ar.call(this,n);
	    if (targetunit.istargeted.length>0&&this.target==0) {
		this.addtarget(targetunit);
		this.log("+%1 %TARGET% / %0",targetunit.name,1);	
	    }
	    return r;
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
			targetunit.faceup(targetunit.criticals[l-i-this.criticalresolved])
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
		var c=Math.floor(m/10);
		var h=(m-c*10)%100;
		if (h>0) {
		    unit.log("1 %HIT% -> 1 %CRIT%");
		    return m+9;
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
	hashit:function(t) {
	    var hh=Unit.prototype.hashit.call(t);
	    if (hh) {
		this.log("+1 %FOCUS%");
		this.addfocustoken();
	    }
	    return hh;
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
	endattack:function(c,h) {
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
	    Unit.prototype.endattack.call(this,c,h);
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
        removetarget: function(t) {
	    if (this.stress) { 	    
		this.log("-1 %TARGET% -> -1 %STRESS%");
		this.removestresstoken();
	    }
	    Unit.prototype.removetarget.call(this,t);
	},
        addtarget: function(t) {
	    if (this.stress) { 
		this.removestresstoken();
		this.log("+1 %TARGET% -> -1 %STRESS%");
	    }
	    Unit.prototype.addtarget.call(this,t);
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
	    if (this.target==0||this.skill<a.skill) { // TODO:Priority to define
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
		return (this.stress>0&&Math.floor(m/100%10>0)); 
	    }.bind(this),function(m,n) {
		var f=Math.floor(m/100)%10;
		if (f>0) {
		    this.removestresstoken();
		    this.log("%0 %FOCUS% -> %0 %HIT%, -1 %STRESS%",f);
		    return m-100*f+f;
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
        applycritical: function(n) {
	    var j,s;
	    for (j=0; j<n; j++) {
		var s1=this.selectdamage();
		CRITICAL_DECK[s1].count--;
		var s2=this.selectdamage();
		CRITICAL_DECK[s2].count--;
		var sc=[s1,s2];
		this.log("select one critical");
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
	    if (this.shield==0&&this.hull<this.ship.hull) return this.agility+1;
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
		var f=Math.floor(m/100)%10;
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %CRIT%");
		    return m-90;
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
	    var p=this.selectnearbyunits(1,function(t,s) { return t.team==s.team&&t!=s; })
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
		var p=this.gettargetableunits(1);
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
        completemaneuver: function(dial,realdial,difficulty) {
	    if (dial=="SL3") {
		this.log("select %SLOOPLEFT% or %TURNLEFT% maneuver");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,"SL3"),
		     this.getpathmatrix(this.m,"TL3").rotate(180,0,0)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,dial,"TL3",difficulty);
		    }.bind(this),false,true);
	    } else if (dial=="SR3") {
		this.log("select %SLOOPRIGHT% or %TURNRIGHT% maneuver");
		this.resolveactionmove(
		    [this.getpathmatrix(this.m,"SR3"),
		     this.getpathmatrix(this.m,"TR3").rotate(180,0,0)],
		    function(t,k) {
			if (k==0) Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
			else Unit.prototype.completemaneuver.call(this,dial,"TR3",difficulty);
		    }.bind(this),false,true);
	    } else Unit.prototype.completemaneuver.call(this,dial,realdial,difficulty);
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
		var p=this.selectnearbyunits(2,function(a,b) {return a.team==b.team&&a!=b });
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
		var p=this.selectnearbyunits(2,function(a,b) {return a.team==b.team&&a!=b });
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
		for (var i=0; i<squadron.length; i++) {
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
	    var ai=Unit.prototype.addiontoken;
	    Unit.prototype.addiontoken=function() {
		ai.call(this);
		if (this.getrange(unit)<=3 &&unit.team!=this.team&&unit.stress==0) {
		    unit.addstress();
		    this.resolvehit(1);
		    unit.log("+1 %STRESS%");
		    this.log("+%1 %HIT [%0]",unit.name,1);
		    this.checkdead();
		}
	    }
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
		var p=this.selectnearbyunits(2,function(a,b) {return a.team!=b.team; });
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
	    if (!this.dead) {
		var p=this.gettargetableunits(2);
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit for a 0 PS");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				var ecp=p[k].endcombatphase;
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
	    this.doselection(function(n) {
		var p=this.gettargetableunits(1);
		var i;
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
	completemaneuver: function(dial,realdial,difficulty) {
	    var speed=parseInt(realdial.substr(-1),10);
	    var p=[];
	    var q=[];
	    for (var i=-1; i<=1; i++) {
		var r=realdial.replace(/\d/,(speed+i)+"");
		if (typeof P[r]!="undefined") {
		    q.push(r);
		    this.log("pushing "+r);
		    p.push(this.getpathmatrix(this.m,r));
		}
	    }
	    this.log("select maneuver speed"+p.length);
	    this.resolveactionmove(p,function(t,k) {
		if (k<0) k=0;
		Unit.prototype.completemaneuver.call(t,dial,q[k],difficulty);
	    },false,true);
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
			if (c.length>0) p[k].faceup(c[rand(c.length)])
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
	hashit: function(t) {
	    var h=Unit.prototype.hashit.call(this,t);
	    var p=this.criticalresolved+this.hitresolved;
	    if (h&&this.criticalresolved>0) {
		if (p<=t.shield||(t.hull<=2&&p>t.shield)) { 
		    this.criticalresolved--;
		    this.hitresolved+=2;
		    this.log("1 %CRIT% -> 2 %HIT%");
		} else this.log(t.name+" shields are down, more than 2 hulls: keeping critical");
	    }
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
	getattackbonus: function(sh) {
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
			this.getattackstrength=function(i,sh){
			    var a= this.weapons[i].getattack()-1;
				return this.weapons[i].getrangeattackbonus(sh)+(a>0)?a:0;
			};
			if (this.shield<this.ship.shield) {
			    this.shield++; 
			    this.log("+1 %SHIELD%");
			}
			this.wrap_before_once("hashit",this,function(c,h) {
			    this.getattackstrength=Unit.prototype.getattackstrength;
			});
			this.endnoaction(n,"SHIELD");
		    }.bind(this)};
		    var a2={org:this,name:this.name,type:"HIT",action:function(n) {
			this.log("-1 %SHIELD%");
			this.log("+1 attack die");
			this.mirandaturn=round;
			this.getattackstrength=function(i,sh){
			    return 1+Unit.prototype.getattackstrength.call(this,i,sh);
			};
			this.removeshield(1); 
			this.wrap_before_once("hashit",this,function(c,h) {
			    this.getattackstrength=Unit.prototype.getattackstrength;
			});
			//this.log("calling noaction "+n);
			this.endnoaction(n,"HIT");
		    }.bind(this)};
		    var list=[a2];
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
		var cuf=Unit.prototype.canusefocus;
		var rft=Unit.prototype.removefocustoken;
		Unit.prototype.canusefocus=function() {
		    return (cuf.call(this)||(this.incombat>-1&&this!=self&&this.getrange(self)<=2&&self.canusefocus()));
		}
		Unit.prototype.removefocustoken=function() {
		    if (this.focus>0) rft.call(this);
		    else if (this.incombat>-1&&this!=self&&this.getrange(self)<=2&&self.canusefocus()) rft.call(self);
		}
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
	    /* TODO: A bit too automatic */
	    boundtargets: function(sh) {
		if (this.targeting.indexOf(sh)>-1) return true;
		for (var i=0; i<this.targeting.length-1; i++) this.removetarget(this.targeting[i]);
		return false;
	    },
	    addtarget: function(sh) {
		if (this.boundtargets()) return;
		this.log("+%1 %TARGET% / %0",sh.name,2);
		this.targeting.push(sh);
		this.targeting.push(sh);
		sh.istargeted.push(this);
		sh.istargeted.push(this);
		sh.show();
		this.show();
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
			var f=Math.floor(m/100)%10;		
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %HIT%");
			    return m-99;
			}
			return m;
		    }.bind(this),false,"focus");
		this.adddefensemodd(this,function(m,n) { 
			return this.focus>0;
		    }.bind(this),function(m,n) {
			var f=Math.floor(m/10)%10;		
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %EVADE%");
			    return m-9;
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
	   var p=this.selectnearbyunits(1,function(a,b) { return (a.team==b.team);});
	   for (var i=0; i<p.length; i++) 
	       this.removestresstoken();
	   return Unit.prototype.begincombatphase.call(this);
       },
       upgrades: [ELITE,TECH],
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
			return this.focus>0||this.targeting.indexOf(targetunit)>-1;
		    }.bind(this),function(m,n) {
			this.removefocustoken();
			this.removetarget(targetunit);
			this.log("all results are %CRIT%");
			return n*10;
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
	points:40,
	done:true,
        completemaneuver: function(dial,realdial,difficulty) {
	    var gd=this.getdial();
	    var p=[this.getpathmatrix(this.m,realdial)];
	    var q=[realdial];
	    for (i=0; i<gd.length; i++) 
		if (gd[i].difficulty==difficulty&&gd[i].move!=dial) {
		    p.push(this.getpathmatrix(this.m,gd[i].move));
		    q.push(gd[i].move);
		}
	    this.log("select maneuver of the same difficulty");
	    this.resolveactionmove(
		p,
		function(t,k) {
		    Unit.prototype.completemaneuver.call(this,q[k],q[k],difficulty);
		}.bind(this),false,true);
	},
	upgrades:[SYSTEM,CANNON,TORPEDO,TORPEDO,CREW,CREW]
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
	upgrades:[SYSTEM,CANNON,TORPEDO,TORPEDO,CREW,CREW]
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
		var f=Math.floor(m/10);
		if (f>2) f=2;
		if (f>0) {
		    this.log("%0 %FOCUS% -> %0 %EVADE%",f);
		    return m-9*f;
		} 
		return m;
	    }.bind(this),false,"focus");
	},        
	upgrades:[ELITE,CANNON,CREW]
    },
    {
	name:"Hera Syndulla (A.S.)",
	faction:REBEL,
	unique:true,
	done:true,
	unit:"Attack Shuttle",
	skill:7,
	points:22,
        completemaneuver: function(dial,realdial,difficulty) {
	    var gd=this.getdial();
	    var p=[this.getpathmatrix(this.m,realdial)];
	    var q=[realdial];
	    for (var i=0; i<gd.length; i++) 
		if (gd[i].difficulty==difficulty&&gd[i].move!=dial) {
		    p.push(this.getpathmatrix(this.m,gd[i].move));
		    q.push(gd[i].move);
		}
	    this.log("select move of the same difficulty");
	    this.resolveactionmove(
		p,
		function(t,k) {
		    Unit.prototype.completemaneuver.call(this,q[k],q[k],difficulty);
		}.bind(this),false,true);
	},
	upgrades:[ELITE,CANNON,CREW]
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
	upgrades:[ELITE,CANNON,CREW]
    },
    {
	name:"'Zeb' Orrelios",
	faction:REBEL,
	unique:true,
	unit:"Attack Shuttle",
	skill:3,
	points:18,
	upgrades:[CANNON,CREW]
    },
    {
	name:"Kanan Jarrus",
	faction:REBEL,
	unique:true,
	unit:"VCX-100",
	skill:4,
	points:38,
	upgrades:[SYSTEM,CANNON,TORPEDO,TORPEDO,CREW,CREW]
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
		this.log("cancel all dice, +1 damage card");
		targetunit.applydamage(1);
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
		if (this.upgrades[i].type==ELITE&&(typeof this.upgrades[i].action=="function")) 
		    elite=this.upgrades[i];
	    }
	    if (elite==null) return;
	    this.log("share %0 upgrade",elite.name);
	    Unit.prototype.wrap_after("getupgactionlist",self,function(l) {
		if (this.team==self.team&&self!=this
		    &&this.getrange(self)<=3
		    &&this.ship.name.match(/.*TIE.*Fighter.*/)) {
		    this.log("elite action from %0 available",self.name);
		    return l.concat({org:self,action:elite.action,type:elite.type.toUpperCase(),name:elite.name});
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
    }
];
/* 31/06/15: XW FAQ with Garven Dreis 
*/

var UPGRADE_TYPES={
    Elite:"ept",Torpedo:TORPEDO,Astromech:"amd",Turret:"turret",Missile:"missile",Crew:"crew",Cannon:"cannon",Bomb:"bomb",Title:"title",Mod:"mod",System:"system",Illicit:"illicit",Salvaged:"salvaged",Tech:"tech"
};
function Laser(u,type,fire) {
    if (type=="Bilaser") 
	return new Weapon(u,{
	    type: type,
	    name:"Laser",
	    isactive:true,
	    attack: fire,
	    range: [1,3],
	    isprimary: true,
	    auxiliary: function(i,m) { return this.getPrimarySectorString(i,m.clone().rotate(180,0,0)); },
	    subauxiliary: function(i,j,m) { return this.getPrimarySubSectorString(i,j,m.clone().rotate(180,0,0)); }
	});
    else if (type=="Laser180") {
	return new Weapon(u,{
	    type: type,
	    name:"Laser",
	    isactive:true,
	    attack: fire,
	    range: [1,3],
	    isprimary: true,
	    auxiliary: function(i,m) { return this.getHalfRangeString(i,m); },
	    subauxiliary: function(i,j,m) { return this.getHalfSubRangeString(i,j,m); }
	});	
    } else return new Weapon(u,{
	type: type,
	name:"Laser",
	isactive:true,
	attack: fire,
	range: [1,3],
	isprimary: true,
    });
}
function Bomb(sh,bdesc) {
    $.extend(this,bdesc);
    sh.upgrades.push(this);
    //log("Installing bomb "+this.name);
    this.isactive=true;
    this.ordnance=sh.ordnance;
    this.unit=sh;
    sh.bombs.push(this);
    this.exploded=false;
    if (this.init != undefined) this.init(sh);
}
Bomb.prototype = {
    isWeapon: function() { return false; },
    isBomb: function() { return true; },
    canbedropped: function() { return this.isactive&&!this.unit.hasmoved; },
    actiondrop: function(n) {
	this.unit.lastdrop=round;
	$(".bombs").remove(); 
	this.drop(this.unit.getbomblocation());
	this.unit.showactivation();
	this.unit.endaction(n);
    },
    toString: function() {
	var a,b,d,str="";
	var c="";
	if (!this.isactive) c="class='inactive'"
	a="<td><code class='"+this.type+" upgrades'></code>";
	//if (this.ordnance) a+=
	a+="</td>";
	var text=UPGRADE_translation[this.name];
	var name=this.name;
	var ord="";
	if (this.ordnance) ord="<sup style=\"padding:1px;color:white;background-color:red;border-radius:100%;\">x2</sup>";
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'><span>"+name.replace(/\'/g,"&#39;")+ord+"</span></td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	d="<td class='tooltip outoverflow'><span>"+formatstring(text)+"</span></td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    getrangeallunits: function () { 
	var range=[[],[],[],[],[]],i;
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    var k=this.getrange(sh);
	    if (k>0) range[k].push({unit:i});
	};
	return range;
    },
    getcollisions: function() {
	var ob=this.getOutlineString();
	var p=[];
	for (i=0; i<squadron.length; i++) {
	    var u=squadron[i];
	    var so=u.getOutlineString(u.m);
	    os=so.s;
	    op=so.p;
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.unit.isPointInside(ob.s,op)
		||this.unit.isPointInside(os,ob.p)) {
		p.push(u); 
	    }
	}
	return p;
    },
    getrange: function(sh) { 
	var ro=this.getOutlineString(this.m).p;
	var rsh = sh.getOutlinePoints(sh.m);
	var min=90001;
	var i,j;
	var mini,minj;
	for (i=0; i<ro.length; i++) {
	    for (j=0; j<4; j++) {
		var d=dist(rsh[j],ro[i]);
		if (d<min) min=d
	    }
	}
	if (min>90000) return 4;
	if (min<=10000) return 1; 
	if (min<=40000) return 2;
	return 3;
    },
    resolveactionmove: function(moves,cleanup) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    for (i=0; i<moves.length; i++) this.pos[i].remove();
	    this.m=m;
	    f(this,k);
	}.bind(this);
	if (moves.length==1) {
	    this.pos[0]=this.getOutline(moves[0]).attr({fill:this.unit.color,opacity:0.7});
	    resolve(moves[0],0,cleanup);
	} else for (i=0; i<moves.length; i++) {
	    this.pos[i]=this.getOutline(moves[i]).attr({fill:this.unit.color,opacity:0.7});
	    (function(k) {
		this.pos[k].hover(
		    function() {this.pos[k].attr({stroke:this.unit.color,strokeWidth:"4px"})}.bind(this),
		    function() {this.pos[k].attr({strokeWidth:"0"})}.bind(this));
		
		this.pos[k].click(
		    function() { resolve(moves[k],k,cleanup); });}.bind(this)
	    )(i);
	}
    },
    drop: function(lm) {
	var dropped=this;
	if (this.ordnance) { 
	    this.ordnance=false; 
	    dropped=$.extend({},this);
	} else this.isactive=false;
	dropped.img1=s.image("png/"+this.img,-this.width/2,-this.height/2,this.width,this.height);
	dropped.outline=this.getOutline(new Snap.matrix())
	    .attr({display:"block","class":"outline",stroke:halftone(GREY),strokeWidth:2,fill:"rgba(8,8,8,0.3)"});
	if (this.repeatx) {
	    dropped.img2=s.image("png/"+this.img,-this.width/2-this.repeatx,-this.height/2,this.width,this.height);
	    dropped.img3=s.image("png/"+this.img,-this.width/2+this.repeatx,-this.height/2,this.width,this.height);
	    dropped.g=s.group(dropped.outline,dropped.img1,dropped.img2,dropped.img3);
	} else dropped.g=s.group(dropped.outline,dropped.img1);
	dropped.g.hover(
	    function () { 
		var m=VIEWPORT.m.clone();
		var w=$("#svgout").width();
		var h=$("#svgout").height();
		var startX=0;
		var startY=0;
		if (h>w) startY=(h-w)/2;
		else startX=(w-h)/2;
		var max=Math.max(900./w,900./h);
		
		var bbox=this.g.getBBox();
		var p=$("#svgout").position();
		var min=Math.min($("#playmat").width(),$("#playmat").height());
		var x=m.x(bbox.x,bbox.y-20)/max;
		x+=p.left+startX;
		var y=m.y(bbox.x,bbox.y-20)/max;
		y+=p.top+startY;
		this.outline.attr({stroke:GREY});
		$(".info").css({left:x,top:y}).html(this.name).appendTo("body").show();
	    }.bind(dropped), function() { 
		$(".info").hide(); 
		this.outline.attr({stroke:halftone(GREY)});
	    }.bind(dropped));
	dropped.resolveactionmove(this.unit.getbombposition(lm,this.size), function(k) { 
	    this.g.transform(this.m);
	    this.g.appendTo(VIEWPORT);
	    BOMBS.push(this);
	    if (this.stay) {
		OBSTACLES.push(this);
		var p=this.getcollisions();
		if (p.length>0) this.unit.resolveactionselection(p,function(k) {
		    this.detonate(p[k]);
		}.bind(this));
	    }
	    this.unit.bombdropped(this);
	}.bind(dropped));
    },
    getOutline: function(m) {
	var path=s.path(this.getOutlineString(m).s);
	path.appendTo(VIEWPORT);
	return path;
    },
    getOutlineString: function(m) {
	var w=15;
	if (typeof m=="undefined") m=this.m;
	var p1=transformPoint(m,{x:-w-1,y:-w});
	var p2=transformPoint(m,{x:w+1,y:-w});
	var p3=transformPoint(m,{x:w+1,y:w});
	var p4=transformPoint(m,{x:-w-1,y:w});	
	this.op=[p1,p2,p3,p4];
	var p=this.op;
	return {s:"M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+" "+p[2].x+" "+p[2].y+" "+p[3].x+" "+p[3].y+" Z",p:p}; 
    },
    explode: function() {
	this.exploded=true;
	this.unit.log("%0 explodes",this.name);
	SOUNDS[this.snd].play();
	this.g.remove();
	BOMBS.splice(BOMBS.indexOf(this),1);
    },
    detonate: function() {
	OBSTACLES.splice(OBSTACLES.indexOf(this),1);
	Bomb.prototype.explode.call(this);
    }
}
function Weapon(sh,wdesc) {
    this.isprimary=false;
    $.extend(this,wdesc);
    sh.upgrades.push(this);
    //log("Installing weapon "+this.name+" ["+this.type+"]");
    this.isactive=true;
    if (this.type.match("Missile|Torpedo")) this.ordnance=sh.ordnance;
    this.unit=sh;
    sh.weapons.push(this);
    if (this.init != undefined) this.init(sh);
}
Weapon.prototype = {
    isBomb: function() { return false; },
    isWeapon: function() { return true; },
    hasauxiliaryfiringarc: function() { return false; },
    toString: function() {
	var a,b,d,str="";
	var c="";
	if (!this.isactive) c="class='inactive'"
	else {
	    var i,r=this.getrangeallunits();
	    for (i=0; i<r.length; i++) if (r[i].team!=this.unit.team) break;
	    if (i==r.length) c="class='nofire'"
	}
	for (var i=0; i<squadron.length; i++) if (squadron[i]==this.unit) break;
	a="<td><button class='statfire'";
	a+=" onclick='if (!squadron["+i+"].dead) squadron["+i+"].togglehitsector(\""+this.name.replace(/\'/g,"&#39;")+"\")'";
	a+=">"+this.getattack()+"<span class='symbols'>"+A[this.type.toUpperCase()].key+"</span>"
	a+="</button></td>";
	var text=UPGRADE_translation[this.name];
	var name=this.name;
	var ord="";
	if (this.ordnance) ord="<sup style=\"padding:1px;color:white;background-color:red;border-radius:100%;\">x2</sup>";
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'><span>"+name.replace(/\'/g,"&#39;")+ord+" <span style='font-size:x-small'>";
	if ((typeof this.getrequirements()!="undefined")) {
	    if ("Target".match(this.getrequirements())) b+="<code class='symbols'>"+A["TARGET"].key+"</code>"
	    if ("Focus".match(this.getrequirements())) b+=(this.getrequirements().length>5?"/":"")+"<code class='symbols'>"+A["FOCUS"].key+"</code>"
	}
	b+="["+this.range[0]+"-"+this.range[1]+"]</span></span></td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	d="<td class='tooltip outoverflow'><span>"+formatstring(text)+"</span></td>";

	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    prehit: function(t,c,h) {},
    posthit:function(t,c,h) {},
    getrequirements: function() {
	return this.requires;
    },
    getattack: function() {
	return this.attack;
    },
    isTurret: function() {
	return this.type==TURRET;
    },
    isinrange: function(r) {
	return (r>=this.range[0]&&r<=this.range[1]);
    },
    modifydamagegiven: function(ch) { return ch; },
    modifydamageassigned: function(ch,t) { return ch; },
    canfire: function(sh) {
	if (!this.isactive) return false;
	if (this.unit.checkcollision(sh)) return false;
	if (typeof this.getrequirements()!="undefined") {
	    var s="Target";
	    if (s.match(this.getrequirements())&&this.unit.canusetarget(sh))
		return true;
	    s="Focus";
	    if (s.match(this.getrequirements())&&this.unit.canusefocus(sh)) return true;
	    return false;
	}
	return true;
    },
    getrangeattackbonus: function(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==1) {
		this.unit.log("+1 attack for range 1");
		return 1;
	    }
	}
	return 0;
    },

    declareattack: function(sh) { 
	if (typeof this.getrequirements()!="undefined") {
	    var s="Target";
	    var u="Focus";
	    if (s.match(this.getrequirements())&&this.unit.canusetarget(sh)) 
		this.unit.removetarget(sh);
	    else if (u.match(this.getrequirements())&&this.unit.canusefocus(sh)) 
		this.unit.removefocustoken();
	    this.unit.show();
	}
    },
    getrangedefensebonus: function(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==3) {
		sh.log("+1 defense for range 3");
		return 1;
	    }
	}
	return 0;
    },
    getsector: function(sh) {
	var m=this.unit.m;
	var n=this.unit.getoutlinerange(m,sh).d;
	if (this.unit.isinsector(m,n,sh,this.unit.getPrimarySubSectorString,this.unit.getPrimarySectorString)) return n;
	if (typeof this.auxiliary=="undefined") return 4;
	if (this.unit.isinsector(m,n,sh,this.subauxiliary,this.auxiliary)) return n;
	return 4;
    },
    getrange: function(sh) {
	var i;
	if (!this.canfire(sh)) return 0;
	if (this.isTurret()||this.unit.isTurret(this)) {
	    var r=this.unit.getrange(sh);
	    if (this.isinrange(r)) return r;
	    else return 0;
	}
	var ghs=this.getsector(sh);
	if (ghs>=this.range[0]&&ghs<=this.range[1]) return ghs;
	return 0;
    },
    endattack: function(c,h) {
	if (this.type.match("Torpedo|Missile")) {
	    if (this.ordnance) this.ordnance=false; else this.isactive=false;
	}
    },
    getrangeallenemies: function() {
	var i;
	var r=[];
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if ((this.team!=sh.team)&&(this.getrange(sh)>0)) r.push(sh);
	}
	return r;
    },
    getrangeallunits: function() {
	var i;
	var r=[];
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if ((this.unit!=sh)&&(this.getrange(sh)>0)) r.push(sh);
	}
	return r;
    },
    wrap_after: function (name,org,after) {
	var self=this;
	var save=self[name];
	var f=function () {
            var args = Array.prototype.slice.call(arguments),
            result;
            result = save.apply( this, args);
            result=after.apply( this, args.concat(result));
	    return result;
	}
	f.save=save;
	f.org=org;
	f.unwrapper=function(name2) {
	    var uw=self.wrap_before(name2,self,function(a) {
		f.unwrap();
		uw.unwrap();
		return a;
	    });
	}
	f.unwrap=function(o) { self[name]=f.save; }
	this[name]=f;
	return f;
    },
};
function Upgrade(sh,i) {
    $.extend(this,UPGRADES[i]);
    sh.upgrades.push(this);
    this.isactive=true;
    this.unit=sh;
    var addedaction=this.addedaction;
    if (typeof addedaction!="undefined") {
	var added=addedaction.toUpperCase();
	sh.shipactionList.push(added);
    }
    if (typeof this.init != "undefined") this.init(sh);
}
function Upgradefromid(sh,i) {
    var upg=UPGRADES[i];
    upg.id=i;
    if (upg.type==BOMB) return new Bomb(sh,upg);
    if (typeof upg.isWeapon != "undefined") 
	if (upg.isWeapon()) return new Weapon(sh,upg);
    else return new Upgrade(sh,i);
    if (upg.type.match("Turretlaser|Bilaser|Laser180|Laser|Torpedo|Cannon|Missile|Turret")||upg.isweapon==true) return new Weapon(sh,upg);
    return new Upgrade(sh,i);
}
Upgrade.prototype = {
    toString: function() {
	var a,b,str="";
	var c="";
	var d;
	if (!this.isactive) c="class='inactive'"
	a="<td><code class='"+this.type+" upgrades'></code></td>"; 
	var text=UPGRADE_translation[this.name+(this.type==CREW?"(Crew)":"")];
	var name=this.name;
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'>"+name.replace(/\'/g,"&#39;")+"</td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	d="<td class='tooltip outoverflow'><span>"+formatstring(text)+"</span></td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    isWeapon: function() { return false; },
    isBomb: function() { return false; }
}

var rebelonly=function(p) {
    var i;
    for (i=0; i<PILOTS.length; i++) 
	if (p==PILOTS[i].name&&PILOTS[i].faction==REBEL) return true;
    return false;
}
var empireonly=function(p) {
    var i;
    for (i=0; i<PILOTS.length; i++) 
	if (p==PILOTS[i].name&&PILOTS[i].faction==EMPIRE) return true;
    return false;
}
var UPGRADES= [
    {
        name: "Ion Cannon Turret",
        type: TURRET,
	firesnd:"falcon_fire",
        points: 5,
        attack: 3,
	done:true,
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
		target.addiontoken();
	    }
	    return ch;
	},
        range: [1,2],
    },
    {
        name: "Proton Torpedoes",
	requires: "Target",
        type: TORPEDO,
	firesnd:"missile",
        points: 4,
	done:true,
        attack: 4,
	init: function(sh) {
	    var self=this;
	    sh.addattackmoda(this,function(m,n) {
		return (sh.weapons[sh.activeweapon]==this);
	    }.bind(this),function(m,n) {
		var f=this.unit.getfocusreddice(m);
		if (f>0) {
		    this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
		    return m-90;
		}
		return m;
	    }.bind(this),false,"focus");
	},        
        range: [2,3],
    },
    {
        name: "R2 Astromech",
	done:true,
        install: function(sh) {
	    var i;
	    var self=this;
	    var save=[];
	    sh.wrap_before("getdial",this,function() {
		if (save.length==0) { 
		    for (var i=0; i<this.dial.length; i++) {
			var s=P[this.dial[i].move].speed;
			var d=this.dial[i].difficulty;
			if (s==1||s==2) d="GREEN";
			save[i]={move:this.dial[i].move,difficulty:d};
		    }
		    sh.log("1, 2 speed maneuvers are green [%0]",self.name);
		}
		return save;
	    });
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap();
	    sh.log("uninstalling effect [%0]",this.name);
	},
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "R2-D2",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("handledifficulty",this,function(d) {
		if (d=="GREEN"&&this.shield<this.ship.shield){ 
		    this.shield++;
		    this.log("+1 %SHIELD% [%0]",self.name);
		}
	    });
	},
        unique: true,
        type: ASTROMECH,
        points: 4,
    },
    {
        name: "R2-F2",
        done:true,
	candoaction: function() { return true; },
	action: function(n) {
	    var self=this.unit;
	    this.unit.log("+1 agility until end of round [%0]",self.name);
	    self.wrap_after("getagility",this,function(a) {
		return a+1;
	    }).unwrapper("endround");
	    self.showstats();
	    self.endaction(n,ASTROMECH);
	    return true;
	},
        unique: true,
        type: ASTROMECH,
        points: 3,
    },
    {
        name: "R5-D8",
	done:true,
        candoaction: function() {
	    for (var i=0; i<this.unit.criticals.length; i++) 
		if (this.unit.criticals[i].isactive==false) return true;
	    return false;
	},
	action: function(n) {
	    var c=-1,cl=-1;
	    var self=this;
	    this.unit.defenseroll(1).done(function(roll) {
		if (this.getfocusgreendice(roll)+this.getevadegreendice(roll)>0) {
		    for (i=0; i<this.criticals.length; i++) {
			var cr=this.criticals[i];
			if (cr[i].isactive==false) {
			    c=i;
			    break;
			}
		    }		    if (c>-1) {
			this.log("-1 %HIT% [%0]",self.name);
			this.criticals.slice(c,1);
		    }
		}
		this.endaction(n,ASTROMECH);
	    }.bind(this.unit));
	},
        unique: true,
        type: ASTROMECH,
        points: 3,
    },
    { name: "R5-X3",
      unique:true,
      type:ASTROMECH,
      points:1,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.wrap_after("updateactivationdial",this,function() {
	      this.addactivationdial(function() { 
		    return self.isactive;
	      },function() {
		  this.log("ignore obstacles [%0]",self.name);
		  self.isactive=false;
		  this.wrap_after("getocollisions",self,function(mbegin,mend,path,len) { 
		      return {overlap:-1,template:[],mine:[]};
		  }).unwrapper("endround");
		  this.show();
	      }.bind(this), A[ASTROMECH.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
	      return sh.activationdial;
	  });
      }
    },
    { name: "BB-8",
      unique:true,
      done:true,
      type:ASTROMECH,
      points:2,
      init: function(sh) {
	  var self=this;
	  self.bb=-1;
	  sh.wrap_after("updateactivationdial",this,function() {
	      self.unit.addactivationdial(function() { 
		  return self.bb!=round&&self.isactive&&!self.unit.hasmoved&&self.unit.maneuver>-1&&(self.unit.getmaneuver().difficulty=="GREEN"); 
	      },function() {
		  self.bb=round;
		  self.unit.doaction([self.unit.newaction(self.unit.resolveroll,"ROLL")],self.name+" free roll for green maneuver.");
	      }, A[ASTROMECH.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
	      return sh.activationdial;
	  }.bind(this))
      }
    },
    {name:"Integrated Astromech",
     points:0,
     type:MOD,
     ship:"X-Wing",
     done:false,
     init: function(sh) {
	 var upg=this;
	 var ac=sh.applycritical;
	 var ad=sh.applydamage;
	 sh.applydamage=function(n) {
	     if (n>0&&this.hull==1) {
		 upg.isactive=false;
		 this.applydamage=ad;
		 this.log("-1 damage [%0]",upg.name);
		 if (n>1) ad.call(this,n-1);
	     } else ad.call(this,n);
	 }
	 sh.applycritical=function(n) {
	     if (n>0) {
		 s=this.selectdamage();
		 CRITICAL_DECK[s].count--;
		 if (this.hull==1||CRITICAL_DECK[s].lethal) {
		     upg.isactive=false;
      		     this.log("-1 damage [%0]",upg.name);
		     this.applycritical=ac;
		 } else {
		     if (this.faceup(new Critical(this,s))) this.removehull(1);
		 }
		 if (n>1) ac.call(this,n-1);
	     }
	 }
     }
    },
    {name:"Weapons Guidance",
     points:2,
     type:TECH,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.addattackmoda(this,function(m,n) { 
	     return true; 
	 }, function(m,n) {
	     var b=this.getblankreddice(m);
	     if (b>0&&this.canusefocus()&&self.isactive) {		
		 this.log("1 blank -> 1 %HIT% [%0]",self.name);
		 this.removefocustoken();
		 return m+1; 
	     } 
	     return m;
	 }.bind(sh),false,"focus");
     }
    },
    {
        name: "R5-K6",
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("removetarget",this,function(t) {
		this.defenseroll(1).done(function(roll) {
		    if (this.getevadegreendice(roll)>0) {
			this.addtarget(t);
			this.log("+1 %TARGET% / %1 [%0]",self.name,t.name);
		    }
		}.bind(this));
	    });
	},
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 2,
    },
    {
        name: "R5 Astromech",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("endround",this,function() {
		var c=-1,cl=-1;
		for (i=0; i<this.criticals.length; i++) {
		    var cr=this.criticals[i];
		    if (cr[i].isactive&&cr[i].type=="ship") {
			c=i;
			if (cr[i].lethal) { cl=i; break; }
		    }
		}
		if (cl>-1) {
		    this.log("repairing critical %1 [%0]",self.name,this.criticals[cl].name);
		    this.criticals[cl].facedown();
		} else if (c>-1) {
		    this.log("repairing critical %1 [%0]",self.name,this.criticals[c].name);
		    this.criticals[c].facedown();
		}
	    });
	},
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "Determination",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("faceup",this,function(c,fu) {
		if (c.type!="pilot") return fu;
		this.log("discarding critical %1 [%0]",self.name,c.name);
		this.criticals.slice(this.criticals.indexOf(c),1);
		return false;
	    });
	},
        type: ELITE,
        points: 1,
    },
    {
        name: "Swarm Tactics",
        type: ELITE,
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		var p=sh.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.skill>b.skill; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    var u=p[k];
			    u.log("PS set to %1 [%0]",self.name,this.skill);
			    this.u=u;
			    this.oldskill=u.skill;
			    u.skill=this.skill;
			    filltabskill();
			    u.show();
			    this.wrap_before_once("endcombatphase",this,function() {
				this.u.skill=this.oldskill;
				filltabskill();
				this.u.show();
			    });
			    this.endnoaction(n,"ELITE");
			}.bind(this));
		    }.bind(this));
		} 
	    });
	}
    },
    {
        name: "Squad Leader",
        unique: true,
	done:true,
        type: ELITE,
        points: 2,
	candoaction: function() {  
	    var p=this.unit.selectnearbyunits(2,function(t,s) { return t.team==s.team&&s!=t&&s.skill<t.skill&&s.candoaction();});
	    return (p.length>0);
	},
	action: function(n) {
	    var unit=this.unit;
	    var p=this.unit.selectnearbyunits(2,function(t,s) { return t.team==s.team&&s!=t&&s.skill<t.skill&&s.candoaction();});
	    this.unit.resolveactionselection(p,function(k) {
		p[k].select();
		p[k].doaction(p[k].getactionlist()).done(function() {
		    this.select();
		    this.endaction(n,"ELITE");
		}.bind(this));
	    }.bind(this.unit));
	},
    },
    {
        name: "Expert Handling",
	candoaction: function() { return this.unit.actionsdone.indexOf("ROLL")==-1; },
	action: function(n) {
	    if (this.unit.shipactionList.indexOf("ROLL")==-1) this.unit.addstress();
	    if (this.unit.istargeted.length>0) {
		this.unit.log("select target to lock [%0]",this.name);
		this.unit.resolveactionselection(this.unit.istargeted,function(k) {
		    var unit=this.istargeted[k];
		    unit.removetarget(this);
		    this.resolveroll(n);
		}.bind(this.unit));
	    } else this.unit.resolveroll(n);
	},        
        type: ELITE,
	done:true,
        points: 2,
    },
    {
        name: "Marksmanship",
	init: function(sh) {
	    this.mark=-1;
	    var self=this;
	    sh.addattackmoda(this,function(m,n) {
		    return (this.mark==round);
		}.bind(this),function(m,n) {
		    var f=this.getfocusreddice(m);
		    if (f>0&&this.mark==round) {	
			if (f>1) this.unit.log("%0 %FOCUS% -> 1 %CRIT%, %1 %HIT% [%2]",f,f-1,self.name); else this.unit.log("%0 %FOCUS% -> 1 %CRIT% [%1]",f,self.name);
			return m-100*f+10+(f-1); 
		    } 
		    return m;
		}.bind(this),false,"focus");
	},
	candoaction: function() { return true; },
	action: function(n) {
	    this.mark=round;
	    this.unit.endaction(n,ELITE);
	},
        done:true,
        type: ELITE,
        points: 3,
    },
    {
        name: "Concussion Missiles",
	requires:"Target",
        type: MISSILE,
	firesnd:"missile",
        points: 4,
        attack: 4,
	done:true,
	init: function(sh) {
	    var missile=this;
	    sh.addattackmoda(this,function(m,n) {
		return sh.weapons[sh.activeweapon]==this;
	    }.bind(this), function(m,n) {
		var b=this.getblankreddice(m,n);
		if (b>0) return m+1; else return m;
	    }.bind(this),false,"blank");
	},
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        type: MISSILE,
	firesnd:"missile",
	requires:"Target",
        points: 4,
        attack: 3,
	done:true,
	init: function(sh) {
	    var m=this;
	    var r=-1;
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		if (r<round&&this.weapons[this.activeweapon]==m) {
		    this.log("2nd attack with %0 [%1]",m.name,m.name);
		    r=round;
		    this.resolveattack(this.activeweapon,targetunit); 
		} else ea.call(this);
	    };
	},
        range: [1,2],
    },
    {
        name: "Daredevil",
	done:true,
        candoaction: function() { return true; },
	action: function(n) {
	    var self=this;
	    this.unit.log("select maneuver [%0]",this.name);
	    this.unit.resolveactionmove(
		[this.unit.getpathmatrix(this.unit.m,"TL1"),
		 this.unit.getpathmatrix(this.unit.m,"TR1")],
		function(t,k) { 
		    if (k==-1) return t.endaction(n,ELITE);
		    t.addstress(); 
		    if (t.shipactionList.indexOf("BOOST")==-1) {
			t.log("2 rolls for damage [%0]",self.name);
			var roll=t.rollattackdie(2);
			for (var i=0; i<2; i++) {
			    if (roll[i]=="hit") { t.resolvehit(1); t.checkdead(); }
			    else if (roll[i]=="critical") { 
				t.resolvecritical(1);
				t.checkdead();
			    }
			}
		    }
		    t.endaction(n,ELITE);
		},true,true);
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Elusiveness",
	done:true,
        init:function(sh) {
	    sh.addattackmodd(this,function(m,n) {
		return this.stress==0&&targetunit==this;
	    }.bind(sh),function(m,n) {
		this.unit.addstress();
		if (activeunit.getcritreddice(m)>0) {
		    this.unit.log("1 %CRIT% rerolled [%0]",this.name);
		    m=m-10+activeunit.attackroll(1);
		} else if (activeunit.gethitreddice(m)>0) {
		    this.unit.log("1 %HIT% rerolled [%0]",this.name);
		    m=m-1+activeunit.attackroll(1);
		}
		return m;
	    }.bind(this),"critical");
	},
        type: ELITE,
        points:2,
    },
    {
        name: "Homing Missiles",
	requires:"Target",
        type: MISSILE,
	firesnd:"missile",
        attack: 4,
        range: [2,3],
	done:true,
	declareattack: function(target) {
	    Weapon.prototype.declareattack.call(this,target);
	    targetunit.wrap("canuseevade",function() { return false; });
	    targetunit.log("cannot use evade tokens [%0]",this.name);
	},
	endattack: function(c,h) {
	    Weapon.prototype.endattack.call(this,c,h);
	    targetunit.canuseevade.unwrap();
	},
        points: 5,
    },
    {
        name: "Push the Limit",
	init: function(sh) {
	    var ptl=this;
	    ptl.r=-1;
	    var da=sh.doaction;
	    var ea=sh.endaction;
	    sh.doaction= function(la,str) {
		var dar=da.call(this,la,str);
		var df=$.Deferred();
		dar.then(function(r) {
		    if (ptl.r<round) {
			ptl.r=round;		
			var dac=da.call(this,this.getactionbarlist(),ptl.name+": 1 free action");
			dac.done(function(rr) { 
			    if (rr!=null) this.addstress();
			    else ptl.r=-1;
			    df.resolve(rr);
			}.bind(this));
		    }
		}.bind(this));
		return df;
	    }
	},
	done:true,
        type: ELITE,
        points: 3,
    },
    {
        name: "Deadeye",
        init: function(sh) {
	    var gr=Weapon.prototype.getrequirements;
	    Weapon.prototype.getrequirements=function() {
		var g=gr.call(this);
		if (this.unit==sh&&g=="Target") return "Target|Focus";
		return g;
	    }
	},
	done:true,
        type: ELITE,
        points: 1,
    },
    {
        name: "Expose",
        candoaction: function() { return true; },
	action: function(n) {
	    var w=this.unit.weapons[0];
	    var gat=w.getattack;
	    this.unit.log("-1 agility, +1 primary attack until end of turn [%0]",this.name);
	    this.unit.wrap_after("getagility",this,function(a) {
		var a=a-1;
		if (a>=0) return a; else return 0;
	    });
	    w.getattack=function() {
		return gat.call(w)+1;
	    };
	    this.unit.wrap_before_once("endround",this,function() {
		this.getagility.unwrap();
		w.getattack=gat;
	    })
	    this.unit.showstats();
	    this.unit.endaction(n,ELITE);
	},
	done:true,
        type: ELITE,
        points: 4,
    },
    {
        name: "Gunner",
	done:true,
        init: function(sh) {
	    var self=this;
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		if ((c+h==0)&&this.hasfired<2) {
		    this.log("2nd attack with %0 [%1]",sh.weapons[0].name,self.name);
		    this.selecttargetforattack(0); 
		} else ea.call(this);
	    };
	},
        type: CREW,
        points: 5,
    },
    {
        name: "Ion Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
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
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	modifydamagegiven: function(ch) {
	    if (ch>10) {
		var c=this.unit.getcritreddice(ch);
		this.unit.log("%0 %CRIT%-> %0 %HIT% [%1]",c,this.name);
		ch=ch-10*c+c;
	    }
	    return ch;
	},
        points: 7,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Seismic Charges",
	done:true,
	img:"seismic.png",
	snd:"explode",
	width: 16,
	height:8,
	size:15,
        explode: function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		var i;
		Bomb.prototype.explode.call(this);
		for (i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].resolvehit(1);
		    squadron[r[1][i].unit].checkdead();
		}
	    }
	},
        type: BOMB,
        points: 2,
    },
    {
        name: "Mercenary Copilot",
        init: function(sh) {
	    sh.addattackmoda(this,function(m,n) {
		if (this.getrange(targetunit)==3) return true;
		return false;
	    }.bind(sh),function(m,n) {
		if (this.gethitreddice(m)>0) return m+1+10; else return m;
	    }.bind(sh),false,"hit");
	},
	done:true,
        type: CREW,
        points: 2,
    },
    {
        name: "Assault Missiles",
        type: MISSILE,
	requires:"Target",
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].log("+1 %HIT% [%0]",this.name);
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
        type: ELITE,
        points: 1,
    },
    {
        name: "Proximity Mines",
	img: "proximity.png",
	snd:"explode",
	width: 18,
	height:18,
	size:35,
	done:true,
	stay: true,
	candoaction: function() { return this.isactive; },
	action: function(n) { this.actiondrop(n); },
	canbedropped:function() { return false; },
        explode: function() {},
	detonate:function(t) {
	    if (!this.exploded) {
		var roll=this.unit.rollattackdie(3);
		for (var i=0; i<3; i++) {
		    if (roll[i]=="hit") { t.resolvehit(1); t.checkdead(); }
		    else if (roll[i]=="critical") { 
			t.resolvecritical(1);
			t.checkdead();
		    }
		}
		Bomb.prototype.detonate.call(this);
	    }
	},
        getOutlineString: function(m) {
	    var N=30;
	    var s="M ";
	    this.op=[];
	    if (typeof m=="undefined") m=this.m;
	    for (var i=0; i<N; i++){ 
		var p=transformPoint(m,{
		    x:this.size*Math.sin(2*i*Math.PI/N),
		    y:this.size*Math.cos(2*i*Math.PI/N)});
		this.op.push(p);
		s+=p.x+" "+p.y+" ";
		if (i==0) s+="L ";
	    }
	    s+="Z";
	    return {s:s,p:this.op};
	},
        type: BOMB,
        points: 3,
    },
    {
        name: "Weapons Engineer",
        type: CREW,
        points: 3,
    },
    { /* TODO: a ship is still hit if crit is transferred ? */
        name: "Draw Their Fire",
        init: function(sh) {
	    var self=this;
	    var ea=Unit.prototype.resolvecritical;
	    Unit.prototype.resolvecritical=function(c) {
		if (c>0&&this.team==sh.team&&sh!=this&&this.getrange(sh)==1){
		    this.log("select unit [%0]",self.name);
		    this.doselection(function(n) {
			this.resolveactionselection([this,sh],function(k) {
			    if (k==0) { ea.call(this,1); }
			    else { ea.call(sh,1);}
			    this.endnoaction(n,"CREW");

			}.bind(this));
		    }.bind(this));
		    ea.call(this,c-1);
		} else ea.call(this,c);
		return c;
	    }
	}, 
	done:true,
        type: ELITE,
        points: 1,
    },
    {
        name: "Luke Skywalker",
        faction:REBEL,
        unique: true,
	done:true,
        init: function(sh) {
	    var ea=sh.endattack;
	    var self=this;
	    sh.endattack=function(c,h) {
		if ((c+h==0)&&this.hasfired<2) {
		    this.log("+1 attack with primary weapon [%0]",self.name);
		    this.selecttargetforattack(0);
		} else ea.call(this);
	    };
	    sh.addattackmoda(this,function(m,n) {
		return (this.hasfired==2);
	    }.bind(sh),function(m,n) {
		if (m>100) return m-99; else return m;
	    },false,"focus");
	},
        type: CREW,
        points: 7,
    },
    {
        name: "Nien Nunb",
	faction:REBEL,
	done:true,
        install: function(sh) {
	    var i;
	    var save=[];
	    sh.wrap_before("getdial",this,function() {
		if (save.length==0) 
		    for (var i=0; i<this.dial.length; i++) {
			var move=this.dial[i].move;
			var d=this.dial[i].difficulty;
			if (move.match(/F[1-5]/)) d="GREEN";
			save[i]={move:move,difficulty:d};
		    }
		return save;
	    });
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap();
	},
        unique: true,
        type: CREW,
        points: 1,
    },
    {
        name: "Chewbacca",
        faction:REBEL,
        unique: true,
	done:true,
        type: CREW,
	init: function(sh) {
	    var upg=this;
	    var ac=sh.applycritical;
	    var ad=sh.applydamage;
	    sh.applydamage=function(n) {
		if (n>0&&this.hull==1) {
		    upg.isactive=false;
		    if (this.shield<this.ship.shield) this.shield++;
		    this.log("+1 %SHIELD%, -1 %HIT% [%0]",upg.name);
		    this.applydamage=ad;
		    if (n>1) ad.call(this,n-1);
		} else ad.call(this,n);
	    }
	    sh.applycritical=function(n) {
		if (n>0) {
		    s=this.selectdamage();
		    CRITICAL_DECK[s].count--;
		    if (this.hull==1||CRITICAL_DECK[s].lethal) {
			upg.isactive=false;
			if (this.shield<this.ship.shield) this.shield++;
      			this.log("+1 %SHIELD%, -1 %CRIT% %0 [%1]",CRITICAL_DECK[s].name,upg.name);
			this.applycritical=ac;
		    } else {
			if (this.faceup(new Critical(this,s))) this.removehull(1);
		    }
		    if (n>1) ac.call(this,n-1);
		    //this.show();
		}
	    }
	},
        points: 4,
    },
    {
        name: "Advanced Proton Torpedoes",
	requires:"Target",
        type: TORPEDO,
	firesnd:"missile",
        attack: 5,
	done:true,
        range: [1,1],
	init: function(sh) {
	    var self=this;
	    sh.addattackmoda(this,function(m,n) {
		return (sh.weapons[sh.activeweapon]==this);
	    }.bind(this),function(m,n) {
		var r=m%10+(Math.floor(m/10)%10)+(Math.floor(m/100)%10);
		if (n-r>0) {
		    this.unit.log("%0 blanks -> %0 %FOCUS% [%1]",n-r,self.name);
		    if (n-r<3) m+=(n-r)*100; else m+=300;
		}
		return m;
	    }.bind(this),false,"blank");
	},        
        points: 6,
    },
    {
        name: "Autoblaster",
        type: CANNON,
	done:true,
	firesnd:"slave_fire",
        attack: 3,
	init: function(sh) {
	    var self=this;
	    var ch=Unit.prototype.cancelhit;
	    Unit.prototype.cancelhit=function(h,e,u) {
		if (u.weapons[u.activeweapon]==this) {
		    this.log("Hits cannot be cancelled by defense dice [%0]",self.name);
		    return h;
		}
		return ch.call(this,h,e,u);
	    };
	},
        range: [1,1],
        points: 5,
    },
    {
        name: "Fire-Control System",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("cleanupattack",this,function() {
		this.log("+1 %TARGET% / %1 [%0]",self.name,targetunit.name);
		this.addtarget(targetunit);
	    });
	},
        type: SYSTEM,
        points: 2,
    },
    {
        name: "Blaster Turret",
        type: TURRET,
	done:true,
	firesnd:"falcon_fire",
	requires:"Focus",
        points: 4,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Recon Specialist",
        init: function(sh) {
	    sh.wrap_before("addfocus",this,function(n) {
		sh.addfocustoken();
	    });
	},
	done:true,
        type: CREW,
        points: 3,
    },
    {
        name: "Saboteur",
        type: CREW,
	done:true,
	candoaction:function() { 
	    var a=this.unit.selectnearbyunits(1,function(a,b) { return a.team!=b.team; });
	    return a.length>0;
	}, 
	action: function(n) {
	    var self=this;
	    var p=this.unit.selectnearbyunits(1,function(a,b) { return a.team!=b.team; });
	    if (p.length>0) {		
		this.unit.log("select unit [%0]",this.name);
		this.unit.resolveactionselection(p,function(k) {
		    var i,q=[];
		    for (i=0; i<p[k].criticals.length; i++) 
			if (p[k].criticals[i].isactive==false) q.push(p[k].criticals[i]);
		    if (q.length>0) {
			var r=p[k].rand(q.length);
			p[k].log("turn faceup one damage card [%0]",self.name);
			p[k].faceup(q[r]);
			p[k].show();
		    } else p[k].log("no damage card [%0]",self.name);
		    this.endaction(n,"CREW");
		}.bind(this));
	    } else this.endaction(n,"CREW");
	},
        points: 2,
    },
    {
        name: "Intelligence Agent",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("beginactivationphase",this,function() {
		var p=this.selectnearbyunits(2,function(a,b) { return a.team!=b.team; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    p[k].showmaneuver();
			    this.endnoaction(n,"CREW");
			}.bind(this));
		    }.bind(this));
		}
	    });
	},
        type: CREW,
        points: 1,
    },
    {
        name: "Proton Bombs",
        done:true,
	width: 32,
	height:30,
	size:15,
	snd:"explode",
	img:"proton.png",
        explode: function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		Bomb.prototype.explode.call(this);
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].applycritical(1);
		    squadron[r[1][i].unit].checkdead();
		}
	    }
	},
        type: BOMB,
        points: 5,
    },
    {
        name: "Adrenaline Rush",
	done:true,
        init: function(sh) {
	    var upg=this;
	    sh.wrap_after("updateactivationdial",this,function() {
		this.addactivationdial(function() { 
		    return !upg.unit.hasmoved&&upg.isactive&&upg.unit.maneuver>-1&&(upg.unit.getmaneuver().difficulty=="RED"); 
		},function() {
		    upg.unit.log("red into white maneuver [%0]",upg.name);
		    var d=upg.unit.getmaneuver(); 
		    upg.isactive=false;
		    var c  =C["WHITE"];
		    if (!(activeunit==this)) c = halftone(c);
		    upg.unit.dialspeed.attr({text:P[d.move].speed,fill:c});
		    upg.unit.dialdirection.attr({text:P[d.move].key,fill:c});
		    upg.unit.completemaneuver(d.move,d.move,"WHITE");
		}, A[ELITE.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
		return sh.activationdial;
	    })
	},        
        type: ELITE,
        points: 1,
    },
    {
        name: "Advanced Sensors",
	done:true,
        init: function(sh) {
	    var ba=sh.beginactivation;
	    var dema=sh.doendmaneuveraction;
	    var upg=this;
	    sh.wrap_before("beginactivation",this,function() {
		if (this.candoaction()) 
		    this.doaction(this.getactionlist()).done(function(r) {
			if (r==null) sh.doendmaneuveraction=dema; 
			else this.doendmaneuveraction=function() { }
		    }.bind(this))
	    });
	},
        type: SYSTEM,
        points: 3,
    },
    {
        name: "Sensor Jammer",
        init: function(sh) {
	    var self=this;
	    sh.addattackmodd(this,function(m,n) {
		return (targetunit==this);
	    }.bind(sh),function(m,n) {
		var h=this.gethitreddice(m);
		if (h>0) {
		    this.unit.log("1 %HIT% -> 1 %FOCUS% [%0]",self.name);
		    return m+99;
		}
		return m;
	    }.bind(this),"hit");
	},
	done:true,
        type: SYSTEM,
        points: 4,
    },
    {
        name: "Darth Vader",
        faction:EMPIRE,
        unique: true,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("cleanupattack",this,function() {
		if (this.hasfired) 
		    this.donoaction([{org:self,type:"CREW",name:self.name,action:function(n) {
			self.unit.log("+%1 %HIT% [%0]",self.name,2);
			targetunit.log("+1 %CRIT% [%0]",self.name); 
			this.resolvehit(2);
			SOUNDS.explode.play();
			targetunit.resolvecritical(1);
			this.checkdead();
			targetunit.checkdead();
			this.endnoaction(n,"CREW");
		    }.bind(this)}],"",true);
	    });
	},
        type: CREW,
        points: 3,
    },
    {
        name: "Rebel Captive",
	faction:EMPIRE,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.rebelcaptive=0;
	    sh.wrap_before("isattackedby",this,function(w,t) {
		if (this.rebelcaptive!=round) {//First attack this turn
		    this.unit.log("+1 %STRESS% [%0]",self.name);
		    this.unit.addstress();
		    this.rebelcaptive=round;
		}
	    }.bind(this));
	},
        unique: true,
        type: CREW,
        points: 3,
    },
    {
        name: "Flight Instructor",
        init: function(sh) {
	    var self=this;
	    sh.adddefensererolld(
		this,
		["focus"],
		function() { if (activeunit.skill<=2) return 2; return 1; },
		function(w,attacker) {
		    this.unit.log("+%1 %FOCUS% reroll(s) [%0]",self.name,(activeunit.skill<=2?2:1));
		    return true;
		}.bind(this)
	    )
	},
	done:true,
        type: CREW,
        points: 4,
    },
    {
        name: "Navigator",
        init: function(sh) {
	    var self=this;
	    var cm=sh.completemaneuver;
            sh.completemaneuver= function(dial,realdial,difficulty) {
		var bearing=realdial.replace(/\d/,'');
		var gd=this.getdial();
		var p=[];
		var q=[];
		q.push(realdial);
		p.push(this.getpathmatrix(this.m,realdial));
		for (i=0; i<gd.length; i++) 
		    if (gd[i].move.match(bearing)&&gd[i].move!=realdial&&(gd[i].difficulty!="RED"||this.stress==0)) { 
			p.push(this.getpathmatrix(this.m,gd[i].move));
			q.push(gd[i].move);
		    }
		if (p.length>1) {
		    this.log("select maneuver of bearing %0 [%1]",bearing,self.name);
		    this.resolveactionmove(p,
		    function(t,k) {
			cm.call(t,q[k],q[k],difficulty);
		    },false,true);
		} else cm.call(this,dial,realdial,difficulty);
	    }
	},
	done:true,
        type: CREW,
        points: 3,
    },
    {
        name: "Opportunist",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("getattackstrength",this,function(w,t,a) {
		if (t.focus+t.evade==0) {
		    a=a+1;
		    /* DONOACTION*/
		    this.addstress();
		    this.log("+1 attack against %1, +1 %STRESS% [%0]",self.name,t.name);
		}
		return a;
	    })
	},
        type: ELITE,
        points: 4,
    },
    {
        name: "Ion Pulse Missiles",
	requires:"Target",
        type: MISSILE,
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		this.unit.log("+%1 %HIT%, +1 ion token [%0]",this.name,2);
		ch=2;
		t.addiontoken(); t.addiontoken();
	    }
	    return ch;
	},
        points: 3,
        attack: 3,
        range: [2,3],
    },
    {
        name: "Wingman",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		var p=this.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&b.stress>0; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit [%0]",self.name);
		    	this.resolveactionselection(p,function(k) {
			    p[k].removestresstoken();
			    this.endnoaction(n,ELITE);
			}.bind(this));
		    }.bind(this));
		} 
	    });
	},
        type: ELITE,
        points: 2,
    },
    {
        name: "Decoy",
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		var p=this.selectnearbyunits(2,function(a,b) { return a.team==b.team&&a!=b; });
		if (p.length>0) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("select unit (or self to cancel) [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    if (p[k]!=this) {
				var s=this.skill;
				this.skill=p[k].skill;
				p[k].skill=s;
				filltabskill();
				p[k].showstats();
				this.showstats();
				this.wrap_before_once("endcombatphase",self,function() {
				    var s=this.skill;
				    this.skill=p[k].skill;
				    p[k].skill=s;
				    this.showstats();
				    p[k].showstats();
				});
			    }
			    this.endnoaction(n,ELITE);
			}.bind(this));
		    }.bind(this));
		}
	    });
	},
	done:true,
        type: ELITE,
        points: 2,
    },
    {
        name: "Outmaneuver",
	done:true,
        init: function(sh) {
	    var self=this;
	    var gds=Unit.prototype.getdefensestrength; 
	    Unit.prototype.getdefensestrength=function(i,t) {
		var d=gds.call(this,i,t);
		if (t==sh) {
		    if(!this.isinfiringarc(t)&&t.isinfiringarc(this)&&d>0) {
			this.log("-1 defense [%0]",self.name);
			return d-1;
		    } 
		}
		return d;
	    }
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Predator",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.addattackrerolla(
		this,
		["blank","focus"],
		function() { if (targetunit.skill<=2) return 2; return 1; },
		function(w,defender) {
		    this.log("+%1 reroll(s) [%0]",self.name,(targetunit.skill<=2?2:1));
		    return true;
		}.bind(sh)
	    )
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
	requires:"Target",
        type: TORPEDO,
	firesnd:"missile",
	done:true,
	endattack: function(c,h) {
	    if (targetunit.hull<=4) targetunit.addstress();
	},
        points: 2,
        attack: 3,
        range: [2,3],
    },
    {
        name: "R7 Astromech",
        type: ASTROMECH,
        points: 2,
    },
    {
        name: "R7-T1",
	candoaction: function() { return true; },	    
	action: function(n) {
	    var self=this;
	    var p=this.unit.selectnearbyunits(2,function(a,b) { return a.team!=b.team; });
	    if (p.length>0) {
		p.push(this.unit);
		this.unit.log("select unit (or self to cancel) [%0]",self.name);
		    this.unit.resolveactionselection(p,function(k) {
			if (p[k]!=this) { 
			    if (p[k].isinfiringarc(this)) this.addtarget(p[k]);
			    this.resolveboost(n);
			} else this.endaction(n,"ASTROMECH");
		    }.bind(this.unit));
		} else this.unit.endaction(n,"ASTROMECH");
	},
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 3,
    },
    {
        name: "Tactician",
        type: CREW,
	limited:true,
        points: 2,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("endattack",this,function(c,h) {
		if (this.getsector(targetunit)==2) {
		    targetunit.addstress();
		    targetunit.log("+1 %STRESS% [%0]",self.name);
		}
	    });
	}
    },
    {
        name: "R2-D2",
        faction:REBEL,
        unique: true,
        type: CREW,
        points: 4,
	done:true,
	init: function(sh) {
	    var x=this;
	    sh.wrap_after("endphase",this,function() {
		var p=[];
		var c=this.criticals;
		for (var i=0; i<c.length; i++) 
		    if (!c[i].isactive) p.push(c[i]);
		if (this.shield==0&&this.ship.shield>0) {
		    this.log("+1 %SHIELD% [%0]",x.name);
		    this.shield++; 
		    this.show();
		    if (p.length>0) {
			var crit=p[this.rand(p.length)]
			if (this.attackroll(1)%10>0)
			    this.faceup(crit);
		   } 
		}
	    });
	}        
    },
    {
        name: "C-3PO",
        unique: true,
        faction:REBEL,
        type: CREW,
        points: 3,
	done:true,
	init:function(sh) {
	    var rdd=sh.defenseroll;
	    var self=this;
	    sh.defenseroll=function(r) {
		var lock=$.Deferred();
		rdd.call(this,r).done(function(roll) {
		    var resolve=function(k) {
			this.log("roll "+roll.roll+"/"+k+" ("+roll.dice+" dice)");
			if (k==this.getevadegreendice(roll.roll)) {
			    this.log("guessed correctly ! +1 %EVADE% [%0]",self.name);
			    roll.roll+=1;
			    roll.dice+=1;
			}
			this.log("roll "+roll.roll+"("+roll.dice+" dice)");
			$("#actiondial").empty();
			lock.resolve(roll);
		    }.bind(this);

		    this.log("guess the number of evades out of %0 dice [%1]",r,self.name);
		    $("#actiondial").empty();
		    for (var i=0; i<roll.dice; i++) {
			(function(k) {
			    var e=$("<button>").html(k+" <code class='xevadetoken'></code>")
				.click(function() { resolve(k);}.bind(this));
			    $("#actiondial").append(e);
			}.bind(this))(i);
		    }
		}.bind(this));
		return lock.promise();
	    }
	},
    },
    {
        name: "R3-A2",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("declareattack",this,function(w,target) {
		if (this.isinfiringarc(target)) {
		    this.donoaction([{org:self,name:self.name,type:"ASTROMECH",action:function(n) {
			this.addstress();
			this.log("+1 %STRESS% [%0]",self.name);
			target.log("+1 %STRESS% [%0]",self.name);
			target.addstress();
			this.endnoaction(n,"ASTROMECH");
		    }.bind(this)}],"",true);
		}
	    })
	},
        unique: true,
        type: ASTROMECH,
        points: 2,
    },
    {
        name: "R2-D6",
        upgrades:[ELITE],
	noupgrades:ELITE,
	skillmin:3,
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "Enhanced Scopes",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("beginactivationphase",this,function() {
		this.oldskill=this.skill;
		this.log("PS set to %1 [%0]",self.name,0); 
		this.skill=0;
	    });
	    sh.wrap_before("endactivationphase",this,function() {
		this.skill=this.oldskill;
	    });
	},
        type: SYSTEM,
        points: 1,
    },
    {
        name: "Chardaan Refit",
        type: MISSILE,
	done:true,
	isWeapon: function() { return false; },
        points: -2,
        ship: "A-Wing",
    },
    {
        name: "Proton Rockets",
        type: MISSILE,
	firesnd:"missile",
	requires:"Focus",
        points: 3,
        attack: 2,
	done:true,
	getattack: function() {
	    a=this.attack;
	    if (this.unit.agility<=3) a+=this.unit.agility;
	    else a+=3;
	    return a;
	},
        range: [1,1],
    },
    {
        name: "Kyle Katarn",
        faction:REBEL,
        unique: true,
	done:true,
        type: CREW,
        points: 3,
	init: function(sh) {
	    sh.wrap_after("removestresstoken",this,function() {
		this.addfocustoken();
	    });
	}
        
    },
    {
        name: "Jan Ors",
        faction:REBEL,
        unique: true,
        type: CREW,
        points: 2,
	done:true,
	test:"?E,1D%10W5_b;k%10VhdJ;1M%10VHlq;&0%LayHI;&h1Sx4;h1Sx4;h1Sx4;h1Sx4;h1Sx4;h1Sx4#",
	init: function(sh) {
	    var u=sh;
	    u.jan=-1;
	    var aft=Unit.prototype.addfocustoken;
	    Unit.prototype.addfocustoken=function() {
		if (this.getrange(u)<=3&&this.faction==u.faction&&u.jan<round) {
		    this.donoaction(
			[{name:u.name,org:u,type:"FOCUS",action:function(n) { 
			    aft.call(this); 
			    this.endnoaction(n,"FOCUS"); }.bind(this)},
			 {name:u.name,org:u,type:"EVADE",action:function(n) { 
			     this.addevadetoken(); 
			     u.jan=round; 
			     this.endnoaction(n,"EVADE"); }.bind(this)}],
			"select %FOCUS% or %EVADE% token",true);
		} else aft.call(this);
	    }
	},
    },

    {
        name: "R4-D6",
        init: function(sh) {
	    sh.wrap_after("cancelhit",this,function(h,e,org,hh) {
		if (hh>=3) {
		    var d=hh-2;
		    for (var i=0; i<d; i++) sh.addstress();
		    return d;
		}
		return hh;
	    })
	},
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "R5-P9",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("endcombatphase",this,function() {
		if (this.canusefocus()&&this.shield<this.ship.shield) {
		    this.shield++;
		    this.log("1 %FOCUS% -> 1 %SHIELD% [%0]",self.name);
		    this.removefocustoken();
		}
	    });
	},        
        unique: true,
        type: ASTROMECH,
        points: 3,
    },
    {
        name: "Han Solo",
        faction:REBEL,
	init: function(sh) {
	    var self=this;
	    sh.addattackmoda(this,function(m,n) { 
		return this.targeting.indexOf(targetunit)>-1;
	    }.bind(sh), function(m,n) {
		var f=this.getfocusreddice(m);
		this.log("%0 %FOCUS% -> %0 %HIT% [%1]",f,self.name);
		this.removetarget(targetunit);
		return m-100*f+f;
	    }.bind(sh),false,"target");
	},
        type: CREW,
        unique: true,
        done:true,
        points: 2,
    },
    { 
        name: "Leia Organa",
        faction:REBEL,
        type: CREW,
        unique: true,
	done:true,
	init: function(sh) {
	    var mod=this;
	    var bap=sh.beginactivationphase;
	    sh.wrap_before("beginactivationphase",this,function() {
		this.donoaction([{type:MOD,org:mod,name:mod.name,action:function(n) {
		    mod.isactive=false;
		    for (var i=0; i<squadron.length; i++) {
			var u=squadron[i];
			u.oldmaneuver=u.maneuver;
			if (u.team==this.team&&u.getmaneuver().difficulty=="RED") {
			    u.forceddifficulty="WHITE";
			    u.showmaneuver();
			}
		    }
		    this.beginactivationphase.unwrap();
		    this.endnoaction(n,"MOD");
		}.bind(this)}],"",true);
	    })
	},
        points: 4,
    },
    {
        name: "Targeting Coordinator",
        type: CREW,
        limited: true,
        points: 4,
    },

    {
        name: "Lando Calrissian",
        faction:REBEL,
        type: CREW,
        unique: true,
	done:true,
	candoaction: function() { return true; },
	action: function(n) {
	    var str="";		
	    this.unit.defenseroll(2).done(function(roll) {
		var f=this.getfocusgreendice(roll);
		var e=this.getevadegreendice(roll);
		for (var i=0; i<f; i++) this.unit.addfocustoken(); 
		if (f>0) str+=" +"+f+" %FOCUS%"; 
		for (var i=0; i<e; i++) this.unit.addevadetoken(); 
		if (e>0) str+=" +"+e+" %EVADE%"; 
		if (str=="") this.unit.log("no effect [%0]",this.name); else this.unit.log(str+" [%0]",this.name);
		this.unit.endaction(n,"CREW");
	    }.bind(this));
	},
        points: 3,
    },
    {
        name: "Mara Jade",
        faction:EMPIRE,
        type: CREW,
        unique: true,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("endcombatphase",this,function() {
		var p=this.gettargetableunits(1);
		for (var i=0; i<p.length; i++) 
		    if (p[i].stress==0) {
			p[i].log("+1 %STRESS [%0]",self.name);
			p[i].addstress();
		    }
	    });
	},
        points: 3,
    },
    {
        name: "Fleet Officer",
        faction:EMPIRE,
        type: CREW,
	done:true,
        candoaction: function() { return true;	},
	action: function(n) {
	    var self=this;
	    var p=this.unit.selectnearbyunits(2,function(s,t) { return (s.team==t.team)&&s!=t; });
	    if (p.length>0) {
		if (p.length==2) {
		    p[0].addfocustoken(); p[1].addfocustoken();
		    this.unit.addstress();
		    this.unit.endaction(n,CREW);
		} else {
		    this.unit.log("select 2 units [%0]",self.name);
		    this.unit.resolveactionselection(p,function(k) {
			p[k].addfocustoken();
			p.splice(k,1);
			if (p.length>0) 
			    this.resolveactionselection(p,function(l) {
				p[l].addfocustoken();
				this.addstress();
				this.endaction(n,CREW);
			    }.bind(this));
			else this.endaction(n,CREW);
		    }.bind(this.unit))
		}
	    } else this.unit.endaction(n,CREW);
	},
        points: 3,
    },
    {
        name: "Stay On Target",
        type: ELITE,
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    var cm=sh.completemaneuver;
            sh.completemaneuver= function(dial,realdial,difficulty) {
		var speed=realdial.substr(-1);
		var gd=this.getdial();
		var p=[];
		var q=[];
		q.push(realdial);
		p.push(this.getpathmatrix(this.m,realdial));
		for (var i=0; i<gd.length; i++) 
		    if (gd[i].move.substr(-1)==speed&&gd[i].move!=realdial) { 
			p.push(this.getpathmatrix(this.m,gd[i].move));
			q.push(gd[i].move);
		    }
		if (p.length>1) {
		    this.log("select maneuver of speed %0 [%1]",speed,self.name);
		    this.resolveactionmove(p,function(t,k) {
			cm.call(t,q[k],q[k],(k==0)?difficulty:"RED");
		    },false,true);
		} else cm.call(this,dial,realdial,difficulty);
	    }
	}
    },
    {
        name: "Dash Rendar",
        faction:REBEL,
        unique: true,
	done:true,
	init: function(sh) {
	    sh.isfireobstructed=function() { return false; }
	    sh.getobstructiondef=function() { return 0; }
	},
        type: CREW,
        points: 2,
        
    },
    {
        name: "Lone Wolf",
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.addattackrerolla(
		this,
		["blank"],
		function() { return 1;},
		function(w,defender) {
		    var p=this.unit.selectnearbyunits(2,function(s,t) { return s.team==t.team&&s!=t; });
		    if (p.length==0) {
			this.unit.log("+1 blank reroll [%0]",self.name);
		    }
		    return p.length==0; 
		}.bind(this)
	    )
	},
        unique: true,
        type: ELITE,
        points: 2,
    },
    {
        name: "'Leebo'",
        faction:REBEL,
        unique: true,
	candoaction: function() { return true; },
	action: function(n) {
	    this.unit.log("free %BOOST% and ion token [%0]",this.name);
	    this.unit.addiontoken();
	    this.unit.resolveboost(n);
	},
	done:true,
        type: CREW,
        points: 2,
        
    },
    {
        name: "Ruthlessness",
        faction:EMPIRE,
        type: ELITE,
        points: 3,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("endattack",this,function(c,h) {
		var p=targetunit.selectnearbyunits(1,function(t,o) { return true; });
		if (p.length>0) {
		    this.resolveactionselection(p,function(k) {
			p[k].log("+%1 %HIT% [%0]",self.name,1);
			p[k].resolvehit(1); p[k].checkdead();
		    });
		}
	    });
	}
    },
    {
        name: "Intimidation",
	done:true,
        init: function(sh) {
	    var unit=this.unit;
	    var self=this;
	    var ga=Unit.prototype.getagility;
	    Unit.prototype.getagility=function() {
		var a=ga.call(this);
		if (this.team!=unit.team&&a>0&&(typeof this.touching!="undefined")) 
		    if (this.touching.indexOf(unit)>-1) {
			this.log("-1 agility [%0]",self.name);
			return a-1;
		    }
		return a;
	    }
	},
        type: ELITE,
        points: 2,
    },
    {
        name: "Ysanne Isard",
        faction:EMPIRE,
        unique: true,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		if (this.shield==0&&this.hull<this.ship.hull&&this.candoevade()) {
		    this.addevadetoken();
		    this.log("+1 %EVADE% [%0]",self.name);
		}
	    });
	},
	done:true,
        type: CREW,
        points: 4,
        
    },
    {
        name: "Moff Jerjerrod",
        faction:EMPIRE,
        unique: true,
	done:true,
        type: CREW,
        points: 2,
	init: function(sh) {
	    var fu=sh.faceup;
	    var crew=this;
	    sh.faceup=function(c) {
		var i,cr=[];
		if (c.lethal||this.hull==1) {
		    for (i=0; i<this.upgrades.length; i++) {
			var upg=this.upgrades[i];
			if (upg.type==CREW&&upg!=crew) cr.push(upg);
		    }
		    cr.push(crew);
		    for (i=0; i<cr.length; i++) {
			if (cr[i].isactive) {
			    cr[i].isactive=false;
			    this.log("discard %0 to remove critical %1 [%2]",cr[i].name,c.name,crew.name);
			    this.criticals.slice(this.criticals.indexOf(c),1);
			    return false;
			}
		    }
		}
		return fu.call(this,c);
	    }
	}
    },
    {
        name: "Ion Torpedoes",
	requires:"Target",
        type: TORPEDO,
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		t.addiontoken();
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].log("+1 ion token [%0]",this.name);
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
        faction:SCUM,
        unique: true,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		var p=this.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.skill<b.skill; });
		p.push(this);
		if (p.length>1&&this.canusefocus()) {
		    this.doselection(function(n) {
			this.log("select unit (or self to cancel) [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				p[k].wrap_after("getagility",self,function(a) { return a+1; }).unwrapper("endcombatphase"); 
				this.removefocustoken();
			    }
			    this.endnoaction(n,ELITE);
			}.bind(this));
		    }.bind(sh));
		}
	    });
	},
        type: ELITE,
        points: 2,
        
    },
    {
        name: "Calculation",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.addattackmoda(this,function(m,n) {
		return this.canusefocus();
	    }.bind(sh),function(m,n) {
		var f=this.getfocusreddice(m);
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
		    return m-100+10;
		}
		return m;
	    }.bind(sh),false,"focus");
	},   
        type: ELITE,
        points: 1,
    },
    {
        name: "Accuracy Corrector",
	init: function(sh) {
	    var self=this;
	    sh.addattackadd(this,function(m,n) { 
		return true; 
	    },function(m,n) {
		this.log("replace all dice by 2 %HIT% [%0]",self.name);
		return {m:2,n:2};
	    }.bind(sh),"hit");
	},                
	done:true,
        type: SYSTEM,
        points: 3,
    },
    {
        name: "Inertial Dampeners",
	done:true,
        init: function(sh) {
	    var upg=this;
	    sh.wrap_after("updateactivationdial",this,function() {
		this.addactivationdial(function() { 
		    return !upg.unit.hasmoved&&upg.isactive; 
		},function() {
		    upg.isactive=false;
		    upg.unit.addstress();
		    upg.unit.completemaneuver("F0","F0","WHITE");
		}, A[ILLICIT.toUpperCase()].key,$("<div>").attr({class:"symbols"}));
		return sh.activationdial;
	    });
	},
        type: ILLICIT,
        points: 1,
    },
    { name:"Tractor Beam",
      type:CANNON,
      points:1,
      attack:3,
      range:[1,3]
    },
    {
        name: "Flechette Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		ch=1;
		t.log("+1 %HIT%, +1 %STRESS% [%0]",this.name);
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
        type: CANNON,
	firesnd:"slave_fire",
        points: 4,
        attack: 3,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.addattackmoda(this,function(m,n) {
		if (sh.weapons[sh.activeweapon]==this) return true;
		return false;
	    }.bind(this),function(m,n) {
		var h=m%10;
		if (h>0) {
		    this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
		    return m+9;
		}
		return m;
	    }.bind(sh),false,"hit");
	},
        range: [1,3],
    },
    {
        name: "Dead Man's Switch",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("dies",this,function() {
		var r=sh.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].log("+%1 %HIT% [%0]",self.name,1);
		    squadron[r[1][i].unit].applydamage(1);
		}
	    });
	},
        type: ILLICIT,
        points: 2,
    },
    {
        name: "Feedback Array",
        type: ILLICIT,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		var p=this.selectnearbyunits(1,function(s,t) { return s.team!=t.team; });
		if (p.length>0) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("select unit (or self to cancel) [%0]",self.name)
			this.resolveactionselection(p,function(k) {
			    if (p[k]!=this) {
				this.resolvehit(1);
				this.addiontoken();
				SOUNDS.explode.play();
				p[k].resolvehit(1);
				p[k].checkdead();
				this.checkdead();
				this.hasfired=true;this.hasdamaged=true;
			    }
			    this.endnoaction(n,ILLICIT);
			}.bind(this))
		    }.bind(this));
		}
	    });
	},
        points: 2,
    },
    {
        name: "'Hot Shot' Blaster",
	done:true,
        isWeapon: function() { return true;},
	isTurret:function() { return true;},
	endattack: function(c,h) { this.isactive=false; },
        type: ILLICIT,
	firesnd:"xwing_fire",
        points: 3,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Greedo",
        faction:SCUM,
        unique: true,
	done:true,
        type: CREW,
	init: function (sh) {
	    sh.greedoa=-1;
	    sh.greedod=-1;
	    var greedo=this;
            sh.wrap_after("hashit",this,function(t,h) {
		var d=this.hitresolved+this.criticalresolved-t.shield;
		if (this.greedoa<round&&d>0) {
		    if (this.hitresolved>t.shield) {
			this.log("first damage is a faceup damage [%0]",self.name);
			this.hitresolved--;
			this.criticalresolved++;
			this.greedoa=round;
		    }
		}
		return h;
	    });
	    sh.wrap_after("resolveishit",this,function(t) {
		var d=t.criticalresolved+t.hitresolved-this.shield;
		if (this.greedod<round&&d>0) {
		    if (t.hitresolved>this.shield) {
			this.log("first damage is a faceup damage [%0]",self.name);
			t.hitresolved--;
			t.criticalresolved++;
			this.greedod=round;
		    }
		}
	    });
	},
        points: 1,
    },
    {
        name: "Salvaged Astromech",   
        type: SALVAGED,
	done:true,
        points: 2,
	init: function(sh) {
	    var fu=sh.faceup;
	    var upg=this;
	    sh.faceup=function(c) {
		var i,cr=[];
		if ((c.lethal||this.hull==1)&&c.type=="ship") {
		    upg.isactive=false;
		    sh.faceup=fu;
		    this.log("remove critical %0 [%1]",c.name,self.name);
		    this.criticals.slice(this.criticals.indexOf(c),1);
		    return false;
		}
		return fu.call(this,c);
	    }
	}
    },
    {
        name: "Bomb Loadout",
        upgrades:[BOMB],
	done:true,
	isWeapon: function() { return false; },
        limited: true,
        type: TORPEDO,
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "'Genius'",
        unique: true,
	done:true,
	init: function(sh) {
	    sh.candropbomb=function() {
		return phase==ACTIVATION_PHASE;
	    }
	},
        type: SALVAGED,
        points: 0,
    },
    {
        name: "Unhinged Astromech",
        type: SALVAGED,
	done:true,
        install: function(sh) {
	    var i;
	    var save=[];
	    sh.wrap_before("getdial",this,function() {
		if (save.length==0) {
		    for (var i=0; i<this.dial.length; i++) {
			var d=this.dial[i].difficulty;
			var move=this.dial[i].move;
			if (move.match(/[A-Z]+3/)) d="GREEN";
			save[i]={move:move,difficulty:d};
		    }
		}
		return save;
	    });
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap();
	},
        points: 1,
    },
    {
        name: "R4-B11",
        unique: true,
        type: SALVAGED,
        points: 3,
    },
    {
        name: "Autoblaster Turret",
        type: TURRET,
	firesnd:"falcon_fire",
	done:true,
        points: 2,
        attack: 2,
	init: function(sh) {
	    var self=this;
	    var ch=Unit.prototype.cancelhit;
	    Unit.prototype.cancelhit=function(h,e,u) {
		if (u.weapons[u.activeweapon]==self) {
		    this.log("%HIT% cannot be cancelled by defense dice [%0]",self.name);
		    return h;
		}
		return ch.call(this,h,e,u);
	    };
	},
        range: [1,1],
    },
    {
        name: "R4 Agromech",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("removefocustoken",this,function(id) {
		if (this.target==0&&this.incombat==true) {
		    this.log("+1 %TARGET% / %1 [%0]",self.name,targetunit.name);
		    this.addtarget(targetunit);
		}
	    });
	},
        type: SALVAGED,
        points: 2,
    },
    {
        name: "K4 Security Droid",
        faction:SCUM,
        type: CREW,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("handledifficulty",this,function(d) {
		if (d=="GREEN") {
		    var p=this.gettargetableunits(3);
		    if (p.length>0) {
			p.push(this);
			this.log("select unit (or self to cancel) [%0]",self.name);
			this.doselection(function(n) {
			    this.resolveactionselection(p,function(k) {
				if (this!=p[k]) {
				    this.addtarget(p[k]);
				    this.log("+1 %TARGET% / %1 [%0]",self.name,p[k].name);
				}
				this.endnoaction(n,CREW);
			    }.bind(this));
			}.bind(this));
		    }  else {
			this.log("no available target [%0]",self.name);
		    }
		}
	    });
	},
        points: 3,
    },
    {
        name: "Outlaw Tech",
        faction:SCUM,
	beta:true,
        limited: true,
	done:true,
        type: CREW,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("handledifficulty",this,function(d) {
		if (d=="RED") {
		    sh.log("+1 %FOCUS% [%0]",self.name);
		    sh.addfocustoken();
		}
	    });
	},
        points: 2,
    },
    {
        name: "Advanced Targeting Computer",
        type: SYSTEM,
        points: 5,
	init: function(sh) {
	    var self=this;
	    sh.addattackadd(this,function(m,n) { 
		return this.targeting.indexOf(targetunit)>-1; 
	    }.bind(sh),function(m,n) {
		if (this.targeting.indexOf(targetunit)>-1) {
		    this.log("+1 %CRIT% [%0]",self.name);
		    $("#atokens > .xtargettoken").remove();
		    return {m:m+10,n:n+1};
		} else return {m:m,n:n};
	    }.bind(sh),"critical")
	},
        ship: "TIE Advanced",
	done:true
    },
    {
        name: "Stealth Device",
	type:MOD,
	done:true,
	install:function(sh) {
	    sh.wrap_after("getagility",this,function(a) { return a+1;});
	},
	uninstall:function(sh) {
	    sh.getagility.unwrap(this);
	},
	init: function(sh) {
	    var upg=this;
	    sh.log("+1 agility [%0]",upg.name)
	    sh.wrap_before("resolveishit",this,function(t) {
		if (upg.isactive) { 
		    upg.isactive=false; 
		    this.getagility.unwrap(upg);
		    this.log("%0 is hit => destroyed",upg.name);
		    this.show();
		    this.resolveishit.unwrap(upg);
		}
	    })
	},
        points: 3,
    },
    {
        name: "Shield Upgrade",
	type:MOD,    
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
	type:MOD,
	done:true,
	addedaction:"Boost",
        points: 4,
    },
    {
        name: "Anti-Pursuit Lasers",
	type:MOD,
        islarge:true,
	done:true,
        points: 2,
	init: function(sh) {
	    var upg=this;
	    sh.wrap_before("collidedby",this,function(t) {
		if (upg.isactive) {
		    var roll=this.rollattackdie(1)[0];
		    if (roll=="hit"||roll=="critical") {
			t.log("+%1 %HIT% [%0]",upg.name,1) 
			t.resolvehit(1);
			t.checkdead();
		    }
		}
	    });
	}
    },
    {
        name: "Targeting Computer",
	type:MOD,
	done:true,
	addedaction:"Target",
        points: 2,
    },
    {
        name: "Hull Upgrade",
	type:MOD,
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
	type:MOD,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("endattack",this,function(c,h) {
		if (!this.weapons[this.activeweapon].isprimary&&(c+h==0)) {
		    this.log("%0 still active [%1]",this.weapons[this.activeweapon].name,self.name);
		    this.weapons[this.activeweapon].isactive=true;
		    this.show();
		}
	    })
	},
	done:true,
        points: 1,
    },
    {
        name: "Stygium Particle Accelerator",
	type:MOD,
	done:true,
        init: function(sh) {
	    sh.wrap_after("resolvedecloak",this,function() {
		if (this.candoevade()) {
		    this.doaction([this.newaction(this.addevade,"EVADE")],
				  "Stygium P.A.: +1 %EVADE%");
		}
	    });
	    sh.wrap_after("addcloak",this,function(n) {
		if (this.candoevade()) 
		    this.doaction([this.newaction(this.addevade,"EVADE")],
				  "Stygium P.A.: +1 %EVADE%");
	    })
	},
        points: 2,
    }, 
   {
        name: "Advanced Cloaking Device",
	type:MOD,
        points: 4,
	done:true,
	init: function(sh) {
	    var upg=this;
	    sh.wrap_before("cleanupattack",this,function() {
		if (this.candoaction()&&this.candocloak()) {
		    this.doaction([this.newaction(this.addcloak,"CLOAK")],upg.name+": free cloack action");
		}
	    });
	},
        ship: "TIE Phantom",
    },
    {
        name: "B-Wing/E2",
	type:MOD,
	done:true,
        upgrades:[CREW],
        points: 1,
        ship: "B-Wing",

    },
    {
        name: "Countermeasures",
	type:MOD,
        islarge:true,
	done:true,
	init: function(sh) {
	    var mod=this;
	    sh.wrap_before("begincombatphase",this,function() {
		if (mod.isactive) {
		    this.donoaction([{action:function(n) {
			mod.isactive=false;
			this.wrap_after("getagility",mod,function(a) {
			    return a+1;
			}).unwrapper("endround");
			if (this.istargeted.length>0) {
			    this.log("select a lock to remove [%0]",mod.name);
			    this.resolveactionselection(this.istargeted,function(k) { 
				this.istargeted[k].removetarget(this);
				this.endnoaction(n,"MOD");
			    }.bind(this));
			} else this.endnoaction(n,"MOD");
		    }.bind(this),type:mod.type.toUpperCase(),name:mod.name}],"",true);
		}
	    });
	},
        points: 3,
    },
    {
        name: "Experimental Interface",
	type:MOD,
        unique: true,
        points: 3,
	init: function(sh) {
	    var upg=this;
	    upg.r=-1;
	    sh.wrap_before("endaction",this,function(n,type) {
		if (upg.r!=round) {
		    upg.r=round;
		    this.log("select an action or Skip to cancel [%0]",upg.name);
		    this.doaction(this.getupgactionlist()).done(function(type) {
			if (type!=null) this.addstress(); else upg.r=-1;
		    }.bind(this));
		}
	    });
	},
	done:true
    },
    {
        name: "Tactical Jammer",
	type:MOD,
        islarge:true,
        points: 1,
    },
    {
        name: "Autothrusters",
	type:MOD,
        actionrequired:"Boost",
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddefensemodd(this,function(m,n) {
		if (activeunit.getsector(this)>2) return true;
		return false;
	    }.bind(sh),function(m,n) {
		var b=n-Math.floor(m/10)%10-m%10;
		if (b>0) {
		    this.log("1 blank -> 1 %EVADE% [%0]",self.name);
		    return m+1;
		}
		return m;
	    }.bind(sh),false,"blank");
	    
	}
    },
    {
        name: "Slave I",
        type:TITLE,
        unique: true,
        points: 0,
	done:true,
        ship: "Firespray-31",
	upgrades:[TORPEDO],
    },
    {
        name: "Millennium Falcon",
        type:TITLE,
	done:true,
	addedaction:"Evade",
        unique: true,
        points: 1,
        ship: "YT-1300",
    },
    {
        name: "Moldy Crow",
        type:TITLE,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("endround",this,function() {
		this.evade=0;
		if (this.focus>0) this.log("keep focus tokens [%0]",self.name);
		this.showinfo();
	    });
	},
        unique: true,
	done:true,
        points: 3,
        ship: "HWK-290",
    },
    {
        name: "ST-321",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("candotarget",this,function() {return true;});
	    sh.resolvetarget=function(n) {
		var i; var p=[];
		for (i=0; i<squadron.length; i++) 
		    if (squadron[i].team!=this.team) p.push(squadron[i]);
		if (p.length>0) {
		    this.log("target any unit in area [%0]",self.name);
		    this.resolveactionselection(p,function(k) { 
			this.addtarget(p[k]);
			this.endaction(n,"TITLE");
		    }.bind(this));
		    return true;
		} else { return false; }
	    }
	},
        unique: true,
        points: 3,
        ship: "Lambda-Class Shuttle",
    },
    {
        name: "Royal Guard TIE",
        type:TITLE,
	done:true,
        upgrades:[MOD],
	skillmin:5,
        points: 0,
	install: function(sh) {
	    sh.shipimg="tie-interceptor-1.png";
	},
	uninstall: function(sh) {
	    sh.shipimg="tie-interceptor-2.png";
	},
        ship: "TIE Interceptor",
    },
    {
        name: "A-Wing Test Pilot",
        type:TITLE,
	done:true,
        upgrades:[ELITE],
	skillmin:2,
        points: 0,
        ship: "A-Wing",
	install: function(sh) {
	    sh.shipimg="a-wing-1.png";
	},
	uninstall:function(sh) {
	    sh.shipimg="a-wing-2.png";
	},
        special_case: "A-Wing Test Pilot",
    },
    {
        name: "Outrider",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var i;
	    for (i=0; i<sh.weapons.length; i++) {
		if (sh.weapons[i].type==CANNON) {
		    sh.weapons[0].isactive=false;
		    sh.log("primary weapon inactive [%0]",this.name);
		    sh.weapons[i].isTurret= function() { return true; };
		    sh.log("%0 can fire in 360 degrees [%0]",sh.weapons[i].name,this.name);
		    break;
		}
	    }
	},
        unique: true,
        points: 5,
        ship: "YT-2400",
    },
    {
        name: "Dauntless",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var self=this;
	    var hd=sh.handledifficulty;
	    sh.handledifficulty=function(difficulty) {
		if (this.collision) {
		    this.log("+1 free action [%0]",self.name);
		    this.wrap_after("candoaction",self,function(cda) {
			// no collision test
			if (this.stress>0||this.ocollision.template.length>0||this.ocollision.overlap>-1) return false;
			return  true;

		    });
		    this.doaction(this.getactionlist(),"").done(function() {
			this.stress++;
			this.candoaction.unwrap();
			hd.call(this,difficulty);
		    }.bind(this));
		}
	    }
	},
        unique: true,
        points: 2,
        ship: "VT-49 Decimator",
    },
    {
        name: "Virago",
        type:TITLE,
	done:true,
        upgrades:[ILLICIT,SYSTEM],
        unique: true,
        points: 1,
	skillmin:4,
        ship: "StarViper",
    },
    {
        name: "'Heavy Scyk' Interceptor",
	done:true,
        upgrades:["Cannon|Torpedo|Missile"],
        type:TITLE,
        points: 2,
        ship: "M3-A Interceptor",

    },
    {
        name: 'IG-2000',
        type:TITLE,
	done:true,
        install:function(sh) { sh.ig2000=true;	},
	uninstall:function(sh) { sh.ig2000=false; },
	init: function(sh) {
	    sh.init=function() {
		var i;
		for (i=0; i<squadron.length; i++) {
		    var u=squadron[i];
		    if (u!=sh&&u.ig2000==true&&u.faction==sh.faction) {
			if (u.name=="IG-88A") {
			    sh.cleanupattack=u.cleanupattack;}
			if (u.name=="IG-88B") { 
			    sh.endattack=u.endattack;
			}
			if (u.name=="IG-88C") {
			    sh.resolveboost=u.resolveboost;
			}
			if (u.name=="IG-88D") {
			    sh.completemaneuver=u.completemaneuver;
			}
		    }
		}
	    }
	},
        points: 0,
        ship: "Aggressor",
    },
    {
        name: "BTL-A4 Y-Wing",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var i;
	    var self=this;
	    for (i=0; i<sh.weapons.length; i++) if (sh.weapons[i].type==TURRET) break;
	    if (i==sh.weapons.length) return;
	    sh.weapons[i].isTurret=function() { return false; };
	    sh.isTurret=function(w) {
		if (w==sh.weapons[i]) return false;
		return Unit.prototype.isTurret(w);
	    };
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		var i;
		for (i=0; i<this.weapons.length; i++) if (this.weapons[i].type==TURRET) break;
		
		if (i<this.weapons.length&&this.weapons[this.activeweapon].isprimary) {
		    this.log("2nd attack with %0 [%1]",this.weapons[i].name,self.name);
		    this.selecttargetforattack(i);
		}else ea.call(this,c,h);
	    };
	},
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "Andrasta",
        type:TITLE,
	done:true,
        upgrades:[BOMB,BOMB],
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: "TIE/x1",
        type:TITLE,
	done:true,
        upgrades:[SYSTEM],
	pointsupg:-4,
        points: 0,
        ship: "TIE Advanced",
    },
    {
        name: "Emperor Palpatine",
        type:CREW,
	unique:true,
	takesdouble:true,
        points: 8,
        faction: EMPIRE
    },
        {
            name: "Extra Munitions",
            type: TORPEDO,
            limited: true,
	    isWeapon: function() { return false; },
            points: 2,
	    done:true,
	    install: function(sh) {
		sh.ordnance=true;
	    },
	    uninstall: function(sh) {
		sh.ordnance=false;
	    }
        },
        {
            name: "Cluster Mines",
            type: BOMB,
	    snd:"explode",
	    img:"cluster.png",
	    width: 15,
	    height:10,
	    repeatx:42,
	    size:22,
	    stay:true,
	    done:true,
	    candoaction: function() { return this.isactive; },
	    action: function(n) {   this.actiondrop(n);  },
	    canbedropped: function() { return false; },
            explode: function() {},
	    detonate: function(t) {
		if (!this.exploded) {
		    var roll=this.unit.rollattackdie(2);
		    for (var i=0; i<2; i++) {
			if (roll[i]=="hit") { t.resolvehit(1); t.checkdead(); }
			else if (roll[i]=="critical") { 
			    t.resolvecritical(1);
			    t.checkdead();
			}
		    }
		    Bomb.prototype.detonate.call(this);
		}
	    },
	    init: function(u) {
		var p=s.path("M41.844,-21 C54.632,-21 65,-11.15 65,1 C65,13.15 54.632,23 41.844,23 C33.853,22.912 25.752,18.903 21.904,12.169 C17.975,18.963 10.014,22.806 1.964,23 C-7.439,22.934 -14.635,18.059 -18.94,10.466 C-22.908,18.116 -30.804,22.783 -39.845,23 C-52.633,23 -63,13.15 -63,1 C-63,-11.15 -52.633,-21 -39.845,-21 C-30.441,-20.935 -23.246,-16.06 -18.94,-8.466 C-14.972,-16.116 -7.076,-20.783 1.964,-21 C9.956,-20.913 18.055,-16.902 21.904,-10.17 C25.832,-16.964 33.795,-20.807 41.844,-21 z").attr({display:"none"});
		var l=p.getTotalLength();
		this.op0=[];
		for (var i=0; i<60; i++) {
		    this.op0[i]=p.getPointAtLength(i*l/60);
		}
	    },
	    getOutlineString: function(m) {
		var N=60;
		var s="M ";
		this.op=[];
		if (typeof m=="undefined") m=this.m;
		for (var i=0; i<N; i++){ 
		    var p=transformPoint(m,this.op0[i]);
		    this.op.push(p);
		    s+=p.x+" "+p.y+" ";
		    if (i==0) s+="L ";
		}
		s+="Z";
		return {s:s,p:this.op};
	    },
            points: 4,
        },
        {
            name: "Glitterstim",
            type: ILLICIT,
            points: 2,
	    activated: false,
	    done:true,
	    init: function(sh) {
		var self=this;
		var par = sh.preattackroll;
		sh.wrap_after("preattackroll",this,function(w,t) {
		    if (self.isactive) {
			this.donoaction([
			    {org:self,name:self.name,type:"ILLICIT",action:function(n) {
				this.addstress();
				self.isactive=false;
				self.activated=round;
				this.preattackroll.unwrap();
				this.endnoaction(n,"ILLICIT");
			    }.bind(this)}],"",true);
		    }
		});
		sh.addattackmoda(this,function(m,n) {
		    return self.activated==round;
		},function(m,n) {
		    var f=this.unit.getfocusreddice(m);
		    if (f>0) {
			this.unit.log("%FOCUS% -> %HIT% [%0]",self.name);
			return m-99*f;
		    }
		    return m;
		}.bind(this),false,"illicit");
		sh.adddefensemodd(this,function(m,n) {
		    return self.activated==round;
		},function(m,n) {
		    var f=this.unit.getfocusgreendice(m);
		    if (f>0) {
			this.unit.log("%FOCUS% -> %EVADE% [%0]",self.name);
			return m-9*f;
		    }
		    return m;
		}.bind(this),false,"illicit");
	    }
        },
    {
        name: "Cloaking Device",
	type:ILLICIT,
	islarge:false,
        points: 2,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this.unit;
	    self.log("cloaked [%0]",this.name);
	    self.addcloak(n);
	},
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("endround",this,function() {
		var roll=this.rollattackdie(1)[0];
		if (roll=="focus"&&this.iscloaked) {
		    this.log("decloaked [%0]",self.name);
		    self.isactive=false;
		    this.wrap_after("getdecloakmatrix",self,function(m,l) {
			return l.concat(m);
		    });
		    this.resolvedecloak();
		}
	    });
	}
    },
    
    {
        name: "Bossk",
        unique: true,
        faction: SCUM,
        type: CREW,
        points: 2,
	done:true,
	init: function(sh) {
	    sh.wrap_after("hashit",this,function(t,b) {
		if (!b) {
		    if (this.stress==0) this.addstress();
		    this.addtarget(t);
		    this.addfocustoken();
		}
		return b;
	    });
	},
    },
    { name:"Wired",
      type: ELITE,
      init: function(sh) {
	  var self=this;
	  sh.addattackrerolla(
	      this,
	      ["focus"],
	      function() { return 9; },
	      function(w,defender) {
		  if (this.stress>0&&this.canusefocus()) {
		      this.log("+%1 %FOCUS% reroll(s) [%0]",self.name,this.focus);
		      return true;
		  } else return false;
		}.bind(sh)
	  );
	  sh.adddefensererolld(
	      this,
	      ["focus"],
	      function() { if (activeunit.skill<=2) return 2; return 1; },
	      function(w,attacker) {
		  if (this.stress>0&&this.canusefocus()) {
		      this.log("+%1 %FOCUS% reroll(s) [%0]",self.name,this.focus);
		      return true;
		  } else return false;
	      }.bind(this)
	  )
      },
      done:true,
      points:1,
    },
    { name:"Cool Hand",
      type: ELITE,
      points:1,
      done:true,
      init: function(sh) {
	  var as=sh.addstress;
	  var self=this;
	  sh.wrap_after("addstress",this,function() {
	      /* No stress action ? as.call(this);*/
	      this.stress++;
	      this.donoaction([{type:FOCUS,name:self.name,org:self,
				action:function(n) {
				    self.isactive=false;
				    this.addfocustoken();
				    this.endnoaction(n,"ELITE");
				}.bind(this)},
			       {type:EVADE,name:self.name,org:self,
				action:function(n) {
				    self.isactive=false;
				    this.addevadetoken();
				    this.endnoaction(n,"ELITE");
				}.bind(this)}],
			      "Add %EVADE% or %FOCUS% instead of %STRESS% token",
			      true);
	  });
      }
    },
    { name:"Juke",
      type: ELITE,
      points:2,
      islarge:false,
    },
        {
            name: "Lightning Reflexes",
            type: ELITE,
            points: 1,
	    done:true,
	    init: function(sh) {
		var u=this;
		sh.wrap_after("handledifficulty",this,function(d) {
		    if (d=="WHITE"||d=="GREEN"&&u.isactive) {
			this.donoaction([{type:ELITE,name:u.name,org:u,action:function(n) {
			    u.isactive=false;
			    this.addstress(1);
			    this.m=this.m.rotate(180,0,0);
			    this.show();
			    this.endnoaction(n,ELITE);
			}.bind(this)}],"",true);
		    };
		});
	    },
	    islarge:false,
        },
    {
	name: "Twin Laser Turret",
	type: TURRET,
	points: 6,
	done:true,
	attack: 3,
	range: [2,3],
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		target.log("+%1 %HIT% [%0]",this.name,1);
	    }
	    return ch;
	},	
	init: function(sh) {
	    var self=this;
	    var tlt=-1;
	    sh.wrap_after("cleanupattack",this,function() {
		if (tlt<round&&this.weapons[this.activeweapon]==self) {
		    this.log("2nd attack with %0 [%1]",self.name,self.name);
		    tlt=round;
		    this.resolveattack(this.activeweapon,targetunit); 
		}
	    }.bind(sh));
	}
    },
        {
            name: "Plasma Torpedoes",
            type: TORPEDO,
            points: 3,
            attack: 4,
	    requires:"Target",
	    done:true,
	    posthit: function(t,c,h) {
		if (t.shield>0) t.log("-1 %SHIELD% [%0]",self.name);
		t.removeshield(1);
	    },
            range: [2,3]
        },
    {
	name: "Ion Bombs",
	type: BOMB,
	points: 2,
	width: 14,
	height:14,
	size:15,
	done:true,
	snd:"explode",
	img:"ion.png",
	explode: function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		Bomb.prototype.explode.call(this);
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].addiontoken();
		    squadron[r[1][i].unit].addiontoken();
		}
	    }
	}
    },
        {
            name: "Conner Net",
            type: BOMB,
	    snd:"explode",
	    img:"conner-net3.png",
	    width:40,
	    height:60,
	    size:40,
	    done:true,
	    init: function() {
		var p=s.path("M-11.379,-0.26 C-11.241,-6.344 -16.969,-14.641 -19.247,-20.448 C-21.524,-26.255 -24.216,-38.147 -20.213,-39.46 C-16.21,-40.774 -8.619,-37.594 2.424,-37.663 C13.466,-37.732 22.162,-41.327 23.68,-39.322 C25.198,-37.317 26.716,-30.404 22.714,-21.278 C18.711,-12.152 14.156,-6.828 14.087,0.293 C14.018,7.414 19.47,15.364 22.3,22.555 C25.129,29.745 25.681,39.908 23.128,41.429 C20.574,42.95 13.673,41.29 4.218,41.29 C-5.237,41.29 -19.316,42.742 -20.903,41.29 C-22.49,39.839 -24.354,34.446 -20.213,23.108 C-16.072,11.769 -11.448,11.424 -11.379,1.606 C-11.322,-6.487 -11.514,5.685 -11.379,-0.26 z").attr({display:"none"});
		var l=p.getTotalLength();
		this.op0=[];
		for (var i=0; i<60; i++) {
		    this.op0[i]=p.getPointAtLength(i*l/60);
		}
	    },
	    getOutlineString: function(m) {
		var N=60;
		var s="M ";
		this.op=[];
		if (typeof m=="undefined") m=this.m;
		for (var i=0; i<N; i++){ 
		    var p=transformPoint(m,this.op0[i]);
		    this.op.push(p);
		    s+=p.x+" "+p.y+" ";
		    if (i==0) s+="L ";
		}
		s+="Z";
		return {s:s,p:this.op};
	    },
	    stay:true,
	    candoaction: function() { return this.isactive; },
	    action: function(n) {   this.actiondrop(n);  },
	    canbedropped: function() { return false; },
	    explode: function() {},
	    detonate:function(t) {
		t.log("makes detonation");
		if (!this.exploded) {
		    var roll=this.unit.rollattackdie(1)[0];
		    if (roll=="hit") { t.resolvehit(1); t.checkdead(); }
		    else if (roll=="critical") { 
			t.resolvecritical(1);
			t.checkdead();
		    }
		    t.addiontoken();
		    t.addiontoken();
		    this.unit.log("%1 skips action phase [%0]",self.name,t.name);
		    var cdema=t.candoendmaneuveraction;
		    t.candoendmaneuveraction=function() {
			t.candoendmaneuveraction=cdema;
			return false;
		    }
		    Bomb.prototype.detonate.call(this);
		}
	    },       
	    points: 4,
        },
    {
	name: "Bombardier",
	type: CREW,
	points: 1,
	done:true,
	init:function(sh) {
	    sh.wrap_after("getbomblocation",this,function(d) {
		if (d.indexOf("F1")>-1) return d.concat("F2");
		return d;
	    })
	}
    },
    {name:"Agent Kallus",
     type:CREW,
     faction:EMPIRE,
     points:2,
    },
        {
            name: "'Crack Shot'",
            type: ELITE,
            points: 1,
        },
        {
            name: "Advanced Homing Missiles",
            type: MISSILE,
            points: 3,
	    requires:"Target",
            attack: 3,
            range: [2,2],
	    done:true,
	    init: function(sh) {
		var ahm=this;
		sh.wrap_after("hashit",this,function(t,hh) {
		    if (hh&&ahm==activeunit.activeweapon) {
			this.log("+1 %CRIT% [%0]",ahm.name);
			t.applycritical(1);
			this.hitresolved=0;
			this.criticalresolved=0;
		    }
		    return hh;
		})
	    }
        },
   {
       name: "Advanced SLAM",
       type:MOD,
       done:true,
       points: 2,
       init: function(sh) {
	   var da=sh.doaction;
	   sh.doaction= function(la) {
	       var dar=da.call(this,la)
	       dar.then(function(r) {
		       if (r=="SLAM"&&this.ocollision.overlap==-1
			   &&this.ocollision.template.length==0
			   &&!this.collision) {
			   return da.call(this,this.getactionbarlist());
		       } else return dar;
		   }.bind(this));
	   }
       }
   },
        {
            name: "Twin Ion Engine Mk. II",
	    type:MOD,
            points: 1,
	    ship: "TIE",
	    done:true,
            install: function(sh) {
		var save=[];
		sh.wrap_before("getdial",this,function(m) {
		    if (save.length==0) 
			for (var i=0; i<this.dial.length; i++) {
			    var move=this.dial[i].move;
			    var d=this.dial[i].difficulty;
			    if (move.match(/BL\d|BR\d/)) d="GREEN";
			    save[i]={move:move,difficulty:d};
			}
		    return save;
		})
	    },
	    uninstall:function(sh) {
		sh.getdial.unwrap();
	    }
	},
        {
            name: "Maneuvering Fins",
	    type:MOD,
            points: 1,
            ship: "YV-666",
	    done:true,
	    init: function(sh) {
		var self=this;
		var cm=sh.completemaneuver;
		sh.completemaneuver= function(dial,realdial,difficulty) {
		    if (dial.match(/TR\d|TL\d/)) {
			this.log("change turn into a bank [%0]",self.name);
			var newdial=dial.replace(/T/,"B");
			this.resolveactionmove(
			    [this.getpathmatrix(this.m,realdial),
			     this.getpathmatrix(this.m,newdial)],
			    function(t,k) {
				if (k==0) cm.call(this,dial,realdial,difficulty);
				else cm.call(this,newdial,newdial,difficulty);
			    }.bind(this),false,true);
		    } else cm.call(this,dial,realdial,difficulty);
		}
	    }
	},
       {
            name: "Hound's Tooth",
            points: 6,
	    type:TITLE,
            unique: true,
            ship: "YV-666",
        },
    {
	name: "XX-23 S-Thread Tracers",
	points:1,
	type:MISSILE,
	range:[1,3],
	attack:3,
	done:true,
	requires:"Focus",
	prehit:function(t,c,h) {
	    var p=this.unit.selectnearbyunits(2,function(a,b) { return a.team==b.team;});
	    var s="";
	    if (p.length>0) {
		for (var i=0; i<p.length; i++) {
		    s+=p[i].name+" ";
		    p[i].addtarget(t);
		}
		this.unit.log("all dice cancelled, %0 now targeted by %1",t,s);
		this.unit.hitresolved=0;
		this.unit.criticalresolved=0;
	    }
	}
    },
    { 
	name:"Comm Relay",
	points: 3,
	type:TECH,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("addevadetoken",this,function() {
		if (this.evade>1) {
		    this.log("1 %FOCUS% max [%0]",self.name);
		    this.evade=1;
		}
		this.showinfo();
	    })
	    var er=sh.endround;
	    sh.endround=function() {
		var e=this.evade;
		er.call(sh);
		this.evade=e;
		if (e>0) this.log("keep %FOCUS% [%0]",self.name);
		this.showinfo();
	    };
	},
    },
    {
	name: "Dorsal Turret",
	type: TURRET,
	points: 3,
	attack: 2,
	range: [1,2],
    },
    { name:"'Chopper'",
      type:CREW,
      points:0,
      faction:REBEL,
      unique:true
    },
    { name:"Hera Syndulla",
      type:CREW,
      points:1,
      faction:REBEL,
      unique:true
    },
    { name:"'Zeb' Orrelios",
      type:CREW,
      points:1,
      faction:REBEL,
      unique:true
    },
    { name:"Ezra Bridger",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true
    },
    { name:"Kanan Jarrus",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true
    },
    { name:"Sabine Wren",
      type:CREW,
      points:2,
      upgrades:[BOMB],
      faction:REBEL,
      unique:true
    }
];
var factions=["REBEL","EMPIRE"];
var allunits=[];
function winevent() {
    return new CustomEvent(
	"win", {
	    detail: {
		time: new Date(),
	    },
	    bubbles: true,
	    cancelable: true
	});
}

function Team(team) {
    if (typeof isia=="undefined") isia=false;
    this.team=team;
    this.isdead=false;
    this.isia=false;
    this.units=[];
}
Team.prototype = {
    setfaction: function(faction) {
	$(".listunits .generic").remove();
	this.faction=faction;
	$("#"+faction+"select").prop("checked",true);
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;	
    },
    changefaction: function(faction) {
	var i;
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		delete generics[i];
	    }
	}
	this.setfaction(faction);
    },
    checkdead: function() {
	var i;
	var alldead=true;
	for (i=0; i<this.units.length; i++) 
	    if (!this.units[i].dead) { alldead=false; break; }
	this.isdead=alldead;
	return alldead;
    },
    toggleplayer: function(name) {
	this.isia=!this.isia;
    },
    updatepoints: function() {
	var score1=$(".listunits .pts").map(function() {
	    return parseInt($(this).text());}).get();
	var i,s=0;
	for (i=0; i<score1.length; i++) {
	    if (!isNaN(score1[i])) {
		s+=score1[i];
	    }
	}
	$("#totalpts").html(s);
    },
    addunit:function() {
	$(".listunits").append(""+(new Unit(this.team)));
	this.updatepoints();
    },
    tosquadron:function(s) {
	var i;
	var team=this.team;
	for (i in generics) {
	    if (generics[i].team==this.team) {
		u=generics[i];
		/* Copy all functions for manual inheritance.  */
		for (var i in PILOTS[u.pilotid]) {
		    var p=PILOTS[u.pilotid];
		    if (typeof p[i]=="function") u[i]=p[i];
		}
		u.tosquadron(s);
		allunits.push(u);
		squadron.push(u);
		this.units.push(u);
	    }
	}	
	// knockout
	//ko.applyBindings({squad:ko.observableArray(squadron)});

	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		if (typeof u.init!="undefined") u.init();
		if (this.isia) u=$.extend(u,IAUnit.prototype);
	    }
	}
	this.units.sort(function(a,b) {return b.skill-a.skill;});
	squadron.sort(function(a,b) {return b.skill-a.skill;});
	this.history={title: {text: UI_translation["Damage taken per turn"]},
		      axisX:{  interval: 1,title: UI_translation["Turns"]},
		      axisY: {	title: UI_translation["Cumulated damage"]},
		      rawdata:[],
		      data: [{        
		    indexLabelFontColor: "darkSlateGray",
		    name: "views",
		    type: "area",
		    color: "rgba(200,10,10,0.8)",
		    markerSize:8,
		    dataPoints: []}]
	};
	return this.units;
    },
    endsetup: function() {
	if (this.isia)
	    for (i=0; i<this.units.length; i++) 
		$.extend(this.units[i],IAUnit.prototype);
	for (i=0; i<this.units.length; i++) { 
	    this.units[i].g.undrag();
	}

    },
    endselection:function(s) {
	var i;
	var team=this.team;
	this.name=$("#teamname"+this.team).val();
	if (this.name=="") this.name="Squad #"+team;
	
	$("#team"+team).empty();
	$("#importexport"+team).remove();
	sq=this.tosquadron(s);
	for (i=0; i<sq.length; i++) {
	    if (team==1) {
		if (sq[i].tx<=0||sq[i].ty<=0) {
		    sq[i].tx=80-(sq[i].islarge?20:0);
		    sq[i].ty=70+82*i;
		    sq[i].alpha=90;
		}
		$("#team1").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    } else {
		if (sq[i].tx<=0||sq[i].ty<=0) {
		    sq[i].tx=820+(sq[i].islarge?20:0);
		    sq[i].ty=70+82*i;
		    sq[i].alpha=-90;
		}
		$("#team2").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    }
	    sq[i].m.translate(sq[i].tx,sq[i].ty).rotate(sq[i].alpha,0,0);
	    sq[i].show();
	}
	$("#team"+team).css("top",$("nav").height()+2);
	activeunit=sq[0];
    },
    toASCII: function() {
	var s="";
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		s+=generics[i].toASCII()+";";
	    }
	}
	return s;
    },
    toJSON:function() {
	var s={};
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	s.description="";
	s.faction=f[this.faction];
	s.name=this.name;
	var sq=[];
	var pts=0;
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		var jp=generics[i].toJSON();
		pts+=jp.points;
		sq.push(jp);
	    }
	}
	s.pilots=sq;
	s.points=pts;
	// update also the number of points
	this.points=pts;
	s.vendor={xwsbenchmark:{builder:"X-Wings Squadron Benchmark",builder_url:"http://xws-bench.github.io/bench/"}};
	s.version="0.3.0";
	return s;
    },
    toJuggler:function(translated) {
	var s="";
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		s=s+generics[i].toJuggler(translated)+"\n";
	    }
	}
	return s;
    },
    parseJuggler : function(str,translated) {
	var f,i,j,k;
	var pid;
	var getf=function(f) {
	    if (f=="REBEL") return 1;
	    if (f=="SCUM") return 2;
	    return 4;
	};
	var f=7;
	var pilots=str.trim().split("\n");
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    var lf=0;
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var vn=v+(PILOTS[j].faction==SCUM?" (Scum)":"");
		if ((translated==true&&typeof PILOT_translation[vn]!="undefined"&&typeof PILOT_translation[vn].name!="undefined"
		    &&PILOT_translation[vn].name.replace(/\'/g,"")==pstr[0])
		    ||(v.replace(/\'/g,"")==pstr[0]))
		    lf=lf|getf(PILOTS[j].faction);
	    }
	    f=f&lf;
	}
	if ((f&1)==1) this.faction="REBEL"; else if ((f&2)==2) this.faction="SCUM"; else this.faction="EMPIRE";
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;

	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var vn=v+(PILOTS[j].faction==SCUM?" (Scum)":"");
		if (PILOTS[j].faction==this.faction
		    &&(translated==true&&typeof PILOT_translation[vn]!="undefined"&&typeof PILOT_translation[vn].name!="undefined"
		       &&PILOT_translation[vn].name.replace(/\'/g,"")==pstr[0])
		    ||(v.replace(/\'/g,"")==pstr[0])) { pid=j; break; } 
	    }
	    var p=new Unit(this.team);
	    p.upg=[];
	    if (typeof PILOTS[pid]=="undefined") {
		log("PILOT undefined: "+pstr[0]+" "+this.faction);
		return; 
	    }
	    //log("PILOTS unit "+PILOTS[pid].unit+" "+PILOTS[pid].name);
	    p.selectship(PILOTS[pid].unit,PILOTS[pid].name);
	    var authupg=[MOD,TITLE].concat(PILOTS[p.pilotid].upgrades);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) {
		    var v=UPGRADES[k].name+(UPGRADES[k].type=="Crew"?"(Crew)":"");
		    if ((translated==true&&typeof UPGRADE_translation[v]!="undefined"
			 &&typeof UPGRADE_translation[v].name!="undefined"
			 &&UPGRADE_translation[v].name.replace(/\'/g,"").replace(/\(Crew\)/g,"")==pstr[j])
			||(UPGRADES[k].name.replace(/\'/g,"")==pstr[j]))
			if (authupg.indexOf(UPGRADES[k].type)>-1) {
			    p.upg[j-1]=k;
			    if (typeof UPGRADES[k].upgrades!="undefined") 
				if (UPGRADES[k].upgrades[0]=="Cannon|Torpedo|Missile")
				    authupg=authupg.concat(["Cannon","Torpedo","Missile"]);
				else authupg=authupg.concat(UPGRADES[k].upgrades);
			    if (typeof UPGRADES[k].install!= "undefined") 
				UPGRADES[k].install(p);
			    break;
			} else log("UPGRADE not listed: "+UPGRADES[k].type);
		if (k==UPGRADES.length) log("UPGRADE undefined: "+pstr[j]);
		}
	    }
	}
	//nextphase();
	
    },
    parseASCII: function(str) {
	var pilots=str.split(";");
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<pilots.length-1; i++) {
	    var coord=pilots[i].split("%");
	    var updstr=coord[0].split(",");
	    var pid=Base64.toNumber(updstr[0]);
	    this.faction=PILOTS[pid].faction;
	    this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	    var p=new Unit(this.team);
	    p.upg=[];
	    p.selectship(PILOTS[pid].unit,PILOTS[pid].name);
	    for (j=1; j<updstr.length; j++) {
		var n=Base64.toNumber(updstr[j]);
		p.upg[j-1]=n;
	        if (typeof UPGRADES[n].install!="undefined") UPGRADES[n].install(p);
	    }
	    if (coord.length>1) {
		var c=Base64.toCoord(coord[1]);
		p.tx=c[0];
		p.ty=c[1];
		p.alpha=c[2];
	    }
	}
	//nextphase();
    },
    parseJSON:function(str,translated) {
	var s;
	var f={"rebels":"REBEL","scum":"SCUM","empire":"EMPIRE"};
	try {
	    s=$.parseJSON(str);
	} catch(err) {
	    return this.parseJuggler(str,translated);
	}
	var i,j,k;
	this.name=s.name;
	this.points=s.points;
	this.faction=f[s.faction];
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<s.pilots.length; i++) {
	    var pilot=s.pilots[i];
	    var p;
	    pilot.team=this.team;
	    p=new Unit(this.team);
	    if (pilot.ship=="") pilot.ship="tiefofighter";
	    p.selectship(PILOT_dict[pilot.ship],PILOT_dict[pilot.name]);
	    /* Copy all functions for manual inheritance. Call init. */
	    for (k in PILOTS[this.pilotid]) {
		var u=PILOTS[this.pilotpid];
		if (typeof u[k]=="function") p[k]=u[k];
	    }
	    if (typeof pilot.upgrades!="undefined")  {
		var nupg=0;
		for (j in pilot.upgrades) { 
		    var upg=pilot.upgrades[j];
		    for (k=0; k<upg.length; k++) {
			nupg++;
			for (var z=0; z<UPGRADES.length; z++) 
			    if (UPGRADES[z].name==UPGRADE_dict[upg[k]]) {
				p.upg[nupg]=z;
				if (typeof UPGRADES[z].install != "undefined") UPGRADES[z].install(p);
				break;
			    }
		    }
		}
	    }
	}
	//nextphase();
    }
}
var phase=1;
var subphase=0;
var round=1;
var skillturn=0;
var tabskill;
var VERSION="v0.7.3";
var LANG="en";
var DECLOAK_PHASE=1;
var SETUP_PHASE=2,PLANNING_PHASE=3,ACTIVATION_PHASE=4,COMBAT_PHASE=5,SELECT_PHASE=1,CREATION_PHASE=6;
var DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];
var BOMBS=[];
var ROCKDATA="";
var allunits=[];
var PILOT_translation,SHIP_translation,CRIT_translation,UI_translation,UPGRADE_translation,PILOT_dict,UPGRADE_dict;
var actionr=[];
var actionrlock;
var HISTORY=[];
var REPLAY=[];
var replayid=0;
var dice=1;
var ATTACK=[]
var DEFENSE=[]
var FACTIONS={"rebel":"REBEL","empire":"EMPIRE","scum":"SCUM"};
var SQUADLIST;
var TEAMS=[new Team(0),new Team(1),new Team(2)];
var currentteam=TEAMS[0];
var VIEWPORT;
var ANIM=[];
var SETUPS={};
var SETUP;
//var sl;

/*
       <table id="setuplist" style="color:black;font-size:x-small" class="compact stripe hover order-column row-border">
       </table>

	    <span href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fxws-bench.github.io%2Fbench%2F@&t=My%20combat%20setup%20for%20Squadron%20Benchmark" title="Share on Facebook" onclick="permalink($(this))"><img src="css/Facebook.png">
</span>
	    <span href="https://twitter.com/intent/tweet?source=http%3A%2F%2Fxws-bench.github.io%2Fbench%2F&text=Combat%20Setup%20for%20Squadron%20Benchmark:%20http%3A%2F%2Fxws-bench.github.io%2Fbench%2F@"  onclick="permalink($(this))" title="Tweet"><img src="css/Twitter.png"></span>
	    <span href="https://plus.google.com/share?url=http%3A%2F%2Fxws-bench.github.io%2Fbench%2F@" onclick="permalink($(this))" title="Share on Google+"><img src="css/Google+.png"></span>
	    <span href="http://www.reddit.com/submit?url=http%3A%2F%2Fxws-bench.github.io%2Fbench%2F@&title=Combat%20Setup%20for%20Squadron%20Benchmark" onclick="permalink($(this))" title="Submit to Reddit"><img src="css/Reddit.png"></span>


    <script src="src/obstacles.js"></script>
    <script src="src/critical.js"></script>
    <script src="src/units.js"></script>
    <script src="src/iaunits.js"></script>
    <script src="src/pilots.js"></script>
    <script src="src/upgrades.js"></script>
    <script src="src/team.js"></script>
    <script src="src/xwings.js"></script>
*/
Base64 = {
    _Rixits :
//   0       8       16      24      32      40      48      56     63
//   v       v       v       v       v       v       v       v      v
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_",
    fromNumber : function(number) {
        if (isNaN(Number(number)) || number === null ||
            number === Number.POSITIVE_INFINITY)
            throw "The input is not valid";
        if (number < 0)
            throw "Can't represent negative numbers now";

        var rixit; // like 'digit', only in some non-decimal radix 
        var residual = Math.floor(number);
        var result = '';
        while (true) {
            rixit = residual % 64
            result = this._Rixits.charAt(rixit) + result;
            residual = Math.floor(residual / 64);
            if (residual == 0) break;
	}
        return result;
    },
    toNumber : function(rixits) {
        var result = 0;
        rixits = rixits.split('');
        for (e in rixits) result = (result * 64) + this._Rixits.indexOf(rixits[e]);
        return result;
    },
    fromCoord: function(c) {	
	return Base64.fromNumber((Math.floor(c[0]+900)+(2000*Math.floor(c[1]+900))+(4000000*Math.floor(180+c[2]))));
    },
    toCoord: function(c) {
	var x=Base64.toNumber(c);
	var y=[x%2000-900,
	       Math.floor(x/2000)%2000-900,
	       Math.floor(x/4000000)-180];
	return y;
    }
}
function center() {
    var bbox=activeunit.g.getBBox();
    var xx=(bbox.x+bbox.width/2);
    var yy=(bbox.y+bbox.height/2)
    var w=$("#svgout").width();
    var h=$("#svgout").height();
    var startX=0;
    var startY=0;
    if (h>w) startY=(h-w)/2;
    else startX=(w-h)/2;
    var min=Math.min(w/900.,h/900.);
    var x=startX+VIEWPORT.m.x(xx,yy)*min;
    var y=startY+VIEWPORT.m.y(xx,yy)*min
    var mm=VIEWPORT.m.invert();
    if (x<0||x>w) VIEWPORT.m=MT((-x+w/2-startX)/min,0).add(VIEWPORT.m);
    if (y<0||y>h) VIEWPORT.m=MT(0,(-y+h/2-startY)/min).add(VIEWPORT.m);

    VIEWPORT.transform(VIEWPORT.m);
    activeunit.show();
}

function hitrangetostr(r) {
    var str="";
    var i,j,k,h;
    var wn=[];
    for (h=0; h<squadron.length; h++) if (squadron[h]==activeunit) break;
    for (i=1; i<=3; i++) {
	if (r[i].length>0) {
	    for (j=0; j<r[i].length; j++) {
		var k=r[i][j].unit;
		var sh=squadron[k];
		str+="<tr>";
		str+="<td class='tohit'>"+i+"</td>";
		str+="<td>"+sh.name+"</td>";		
		for (w=0; w<r[i][j].wp.length; w++) {
		    var wp=activeunit.weapons[w];
		    var p=activeunit.evaluatetohit(w,sh);
		    if (p==undefined) break;
		    var kill=p.tokill[sh.hull+sh.shield];
		    if (typeof kill=="undefined") kill=0; else 
			kill=Math.floor(kill*10000)/100;
		    // Add type to possible weapons
		    if (wn.indexOf(wp.type)==-1) wn.push(wp.type);
		    str+="<td class='probacell' style='background:hsl("+(1.2*(100-p.tohit))+",100%,80%)'";
		    if (phase==COMBAT_PHASE && skillturn==activeunit.skill&&activeunit.canfire()) str+=" onclick='activeunit.incombat=true; activeunit.declareattack("+w+",squadron["+k+"]); activeunit.resolveattack("+w+",squadron["+k+"])'>"; else str+=">";
		    str+="<div class='reddice'>"+activeunit.getattackstrength(w,sh)+"</div><div class='greendice'>"+sh.getdefensestrength(w,activeunit)+"</div>"
		    str+="<div>"+p.tohit+"%</div><div><code class='symbols' style='border:0'>d</code>"+p.meanhit+"</div><div><code class='symbols'  style='border:0'>c</code>"+p.meancritical+"</div><div>"+kill+"% kill</div>"
		    str+="</td>";
		}   
		str+="</tr>";
	    }
	}
    }
    if (str=="") { str="No unit in range of "+activeunit.name; 
		   activeunit.istargeting=false; }
    else {
	var s="";
	s="<table><tr><th>Range</th><th>Name</th>";
	for (i=0; i<wn.length; i++) {
	    s+="<th style='width:2em;border:0'><div class='"+wn[i]+"' style='width:100px;border:0;background:white;color:black'></div></th>"
	}
	str=s+"</tr>"+str+"</table>"
    }
    return str;
}
function inhitrange() {
    $("#listtitle").html("Units in weapon range of "+activeunit.name);
    $("#listunits").html(hitrangetostr(activeunit.gethitrangeallunits()));
    window.location="#modal";
}
function formatstring(s) {
    return s.replace(/%HIT%/g,"<code class='hit'></code>")
	.replace(/%ACTION%/g,"<b>Action:</b>")
	.replace(/%CRIT%/g,"<code class='critical'></code>")
	.replace(/%EVADE%/g,"<code class='symbols'>e</code>")
	.replace(/%FOCUS%/g,"<code class='symbols'>f</code>")
	.replace(/%ROLL%/g,"<code class='symbols'>r</code>")
	.replace(/%TURNLEFT%/g,"<code class='symbols'>4</code>")
	.replace(/%TURNRIGHT%/g,"<code class='symbols'>6</code>")
	.replace(/%BOOST%/g,"<code class='symbols'>b</code>")
        .replace(/%ELITE%/g,"<code class='symbols'>E</code>")
 	.replace(/%BOMB%/g,"<code class='symbols'>B</code>")
	.replace(/%STRAIGHT%/g,"<code class='symbols'>8</code>")
        .replace(/%STOP%/g,"<code class='symbols'>5</code>")
        .replace(/%TARGET%/g,"<code class='symbols'>l</code>")
        .replace(/%TORPEDO%/g,"<code class='symbols'>P</code>")
 	.replace(/%CANNON%/g,"<code class='symbols'>C</code>")
	.replace(/%SYSTEM%/g,"<code class='symbols'>S</code>")
	.replace(/%ILLICIT%/g,"<code class='symbols'>I</code>")
        .replace(/%MISSILE%/g,"<code class='symbols'>M</code>")
        .replace(/%TURRET%/g,"<code class='symbols'>U</code>")
        .replace(/%BANKLEFT%/g,"<code class='symbols'>7</code>")
        .replace(/%BANKRIGHT%/g,"<code class='symbols'>9</code>")
        .replace(/%UTURN%/g,"<code class='symbols'>2</code>")
        .replace(/%SLOOPLEFT%/g,"<code class='symbols'>1</code>")
        .replace(/%SLOOPRIGHT%/g,"<code class='symbols'>3</code>")
	.replace(/%CREW%/g,"<code class='symbols'>W</code>");
}
function nextunit(cando, changeturn,changephase,activenext) {
    var i,sk=false,last=0;
    if (skillturn<0||skillturn>12) return changephase();
    for (i=0; i<tabskill[skillturn].length; i++) {
	if (cando(tabskill[skillturn][i])) { sk=true; last=i; break;} 
    };
    if (!sk) {
	do changeturn(tabskill);
	while (skillturn>=0 && skillturn<=12&& tabskill[skillturn].length==0);
    } 
    if (skillturn<0||skillturn>12) return changephase();
    active=last; 
    tabskill[skillturn][last].select();
    activenext();
}
function endphase() {
    for (var i=0; i<squadron.length; i++) squadron[i].endphase();
}
function nextcombat() {
    nextunit(function(t) { return t.canfire(); },
	     function(list) { 
		 var dead=false;
		 if (skillturn>=0) skillturn--;
		 for (i=0; i<list[skillturn+1].length; i++) {
		     var u=list[skillturn+1][i];
		     if (u.canbedestroyed(skillturn))
			 if (u.checkdead()) dead=true;
		 }
		 if (dead&&(TEAMS[1].checkdead()||TEAMS[2].checkdead())) win();
	     },
	     function() {
		 log(UI_translation["No more firing units, ready to end phase."]); 
		 for (var i=0; i<squadron.length; i++) squadron[i].endcombatphase();
		 barrier(endphase);
		 enablenextphase();
	     },
	     function() {
		 activeunit.beginattack();
		 activeunit.doattack(false);
	     });
}
function nextactivation() {
    nextunit(function(t) { return t.candomaneuver(); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { return enablenextphase(); },
	     function() {     
		 activeunit.beginactivation();
		 activeunit.doactivation();
	     });
}
function nextdecloak() {
    nextunit(function(t) { return t.candecloak(); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { return enablenextphase(); },
	     function() { activeunit.dodecloak(); });
}
function nextplanning() {
    nextunit(function(t) { return (t.maneuver==-1); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { return enablenextphase(); },
	     function() {
		 activeunit.select();
		 activeunit.doplan();
	     });
}
function addattackdie(type,n) {
    for (var i=0; i<n; i++) 
	$("#attack").append("<td class="+type+"reddice'></td>");
}
function adddefensedie(type,n) {
    for (var i=0; i<n; i++) 
	$("#defense").append("<td class="+type+"greendice'></td>");
}

function displayattackroll(m,n) {
    var i,j=0;
    $("#attack").empty();
    for (i=0; i<Math.floor(m/100)%10; i++,j++)
	$("#attack").append("<td class='focusreddice'></td>");
    for (i=0; i<(Math.floor(m/10))%10; i++,j++)
	$("#attack").append("<td class='criticalreddice'></td>");
    for (i=0; i<m%10; i++,j++)
	$("#attack").append("<td class='hitreddice'></td>");
    for (i=j; i<n; i++)
	$("#attack").append("<td class='blankreddice'></td>");
    var change=function() { 
	if ($(this).hasClass("focusreddice")) {
	    $(this).removeClass("focusreddice"); $(this).addClass("hitreddice");
	}  else if ($(this).hasClass("blankreddice")) {
	    $(this).removeClass("blankreddice"); $(this).addClass("focusreddice");
	} else if ($(this).hasClass("hitreddice")) {
	    $(this).removeClass("hitreddice"); $(this).addClass("criticalreddice");
	} else if ($(this).hasClass("criticalreddice")) {
	    $(this).removeClass("criticalreddice"); $(this).addClass("blankreddice");
	}
    }
    $(".focusreddice").click(change);
    $(".hitreddice").click(change);
    $(".blankreddice").click(change);
    $(".criticalreddice").click(change);
}
function addroll(f,n,id) {
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var t=f(100*foc+10*c+h,n);
    displayattackroll(t.m,t.n);
    $("#moda"+id).remove();
}
function addrolld(f,n,id) {
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var t=f(10*foc+e,n);
    displaydefenseroll(t.m,t.n);
    $("#modd"+id).remove();
}
function modroll(f,n,id) {
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var r=f(100*foc+10*c+h,n);
    displayattackroll(r,n);
    $("#moda"+id).remove();
}
function displaydefenseroll(r,n) {
    var i,j=0;
    $("#defense").empty();
    for (i=0; i<Math.floor(r/10); i++,j++)
	$("#defense").append("<td class='focusgreendice'></td>");
    for (i=0; i<r%10; i++,j++)
	$("#defense").append("<td class='evadegreendice'></td>");
    for (i=j; i<n; i++)
	$("#defense").append("<td class='blankgreendice'></td>");
    var change=function() { 
	if ($(this).hasClass("focusgreendice")) {
	    $(this).removeClass("focusgreendice"); $(this).addClass("evadegreendice");
	} else if ($(this).hasClass("blankgreendice")) {
	    $(this).removeClass("blankgreendice"); $(this).addClass("focusgreendice");
	} else if ($(this).hasClass("evadegreendice")) {
	    $(this).removeClass("evadegreendice"); $(this).addClass("blankgreendice");
	}
    }
    $(".focusgreendice").click(change);
    $(".evadegreendice").click(change);
    $(".blankgreendice").click(change);
}
function modrolld(f,n,id) {
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var r=f(10*foc+e,n);
    displaydefenseroll(r,n);
    $("#modd"+id).remove();
}
function reroll(n,forattack,type,id) {
    var i;
    var l;
    var m=0;
    var attackroll=["blank","focus","hit","critical"];
    var defenseroll=["blank","focus","evade"];
    if (forattack) {
	for (i=0; i<4; i++) {
	    var t=type;
	    type=Math.floor(type/10);
	    // Do not reroll focus
	    if (activeunit.canusefocus()&&activeunit.candofocus()&&i==1) continue;
	    if (t%10>=1) {
		l=$("."+attackroll[i]+"reddice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;n-=l.length;
		} else {
		    $("."+attackroll[i]+"reddice:lt("+n+"):not([noreroll])").remove();
		    m+=n;n=0;
		}
	    }
	}
	//console.log("rerolling "+m+" dices");
	$("#rerolla"+id).remove();
	var r=activeunit.rollattackdie(m);
	for (i=0; i<m; i++) {
	    $("#attack").prepend("<td noreroll='true' class='"+r[i]+"reddice'></td>");
	}
    } else { 
	for (i=0; i<3; i++) {
	    var t=type;
	    type=Math.floor(type/10);
	    // Do not reroll focus
	    if (targetunit.canusefocus()&&targetunit.candofocus()&&i==1) continue;
	    if (t%10>=1) {
		l=$("."+defenseroll[i]+"greendice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;n-=l.length;
		} else {
		    $("."+attackroll[i]+"greendice:lt("+n+"):not([noreroll])").remove();
		    m+=n;n=0;
		}
	    }
	}
	$("#rerolld"+id).remove();
	activeunit.defenseroll(m).done(function(r) {
	    var i;
	    for (i=0; i<activeunit.getevadegreendice(r); i++)
		$("#defense").prepend("<td noreroll='true' class='evadegreendice'></td>");
	    for (i=0; i<activeunit.getfocusgreendice(r); i++)
		$("#defense").prepend("<td noreroll='true' class='focusgreendice'></td>");
	    for (i=0; i<r-activeunit.getevadegreendice(r)-activeunit.getfocusgreendice(r); i++)
		$("#defense").prepend("<td noreroll='true' class='blankgreendice'></td>");
	});
    }
}
function next_replay() {
    var p=[];
    if (REPLAY.length>0) p=REPLAY[replayid].split("_");
    return p;
}

function enablenextphase() {
    var i;
    var ready=true;

    switch(phase) {
    case SELECT_PHASE:
	var n1=$("#squad1").attr("data-name");
	var n2=$("#squad2").attr("data-name");
	if (typeof n1=="undefined"||typeof n2=="undefined") {
	    ready=false;
	    $(".nextphase").prop("disabled",true);
	}
	break;
    case PLANNING_PHASE:
	for (i=0; i<squadron.length; i++)
	    if (squadron[i].maneuver<0&&!squadron[i].isdead) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) {
	    log(UI_translation["All units have planned a maneuver, ready to end phase"]);
	}
	break;
    case ACTIVATION_PHASE:
	if (subphase!=ACTIVATION_PHASE) {
	    subphase=ACTIVATION_PHASE; 
	    skillturn=0; 
	    ready=false;
	    for (i=0; i<squadron.length; i++) squadron[i].enddecloak().done(nextactivation);
	    barrier(nextactivation);
	} else {
	    for (i=0; i<squadron.length; i++)
		if (squadron[i].maneuver>-1&&!squadron[i].isdead) { ready=false; break; }
	    if (ready&&$(".nextphase").prop("disabled")) log(UI_translation["All units have been activated, ready to end phase"]);
	}
	break;	

    }
    if (ready) $(".nextphase").prop("disabled",false);
    // Replay
    /*var p=next_replay();
    if (REPLAY.length>0&&next_replay()[0]=="nextphase") {
	log("<div style='color:white;background:blue'>##"+p[0]+":"+p[1]+"</div>");
	replayid++;
	if (phase>=PLANNING_PHASE) return nextphase();
    } else log("<div style='color:white;background:green'>##"+p[0]+":"+p[1]+"</div>");
    */
    return ready;
}

var keybindings={
    phase0:[],
    phase1:[],
    phase2:[
	{k:'t',f:function() { activeunit.turn(45);}},
	{k:"shift+t",f:function() {activeunit.turn(-45); }},
	{k:"b",f:function() { activeunit.turn(5);}},
	{k:"shift+b",f:function() { activeunit.turn(-5,0,0);}}],
    phase3:[
	{k:"m",f: function () { activeunit.nextmaneuver(); }},
	{k:"shift+m",f:function() {activeunit.prevmaneuver(); }}
    ],
    phase4:[],
    phase5:[{k:'enter',f:function() {inhitrange(); window.location='#modal' }}],
    action:[
	{k:"a", f:function() { 
	    if (!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn)   {
		activeunit.nextaction(); 
	    }
	}},
	{k:"shift+a", f:function() { 
	    if (!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn)  {
		activeunit.prevaction(); 
	    }
	}},
	{k:"enter",f:function() {
	    if (phase==ACTIVATION_PHASE&&!activeunit.actiondone
		&&activeunit.hasmoved
		&&activeunit.skill==skillturn) {
		resolveaction();
	    }
	}}
    ],
    select:[
    ]
};

function win() {
    var title="m-draw";
    var i;
    //log("ANIM:"+JSON.stringify(ANIM));
    var s1="",s2="";
    var defaults="<tr><td class='m-nocasualty'></td><td>0</td></tr>";
    var score1=0,score2=0;
    for (i=0; i<allunits.length; i++) {
	var u=allunits[i];
	if (u.dead) {
	    if (u.team==1) {
		s2+="<tr><td>"+u.name+"</td><td>"+u.points+"</td></tr>";
		score2+=u.points;
	    } else {
		s1+="<tr><td>"+u.name+"</td><td>"+u.points+"</td></tr>";
		score1+=u.points;
	    }
	}
    }
    if (s1=="") s1=defaults;
    if (s2=="") s2=defaults;
    var d=score1 - score2;
    score1 = d + 100;
    score2 = 100 - d;
    $(".victory-table").empty();
    $(".victory-table").append("<tr><th class='m-squad1'></th><th>"+score1+"</th></tr>");
    $(".victory-table").append(s1);
    $(".victory-table").append("<tr><th class='m-squad2'></th><th>"+score2+"</th></tr>");
    $(".victory-table").append(s2);
    if (d>0) title="m-1win";
    else if (d<0) title="m-2win";
    $(".victory").attr("class",title);
    /*var y1=0,y2=0;
    var t1=TEAMS[1].history;
    var t2=TEAMS[2].history;
    var val1=[],val2=[];
    var y1=0,y2=0;
    var scalex=$('#svgLine').height()/round;
    for (i=0; i<=round; i++) {
	if (typeof t1.rawdata[i]!="undefined") { y1+=t1.rawdata[i].hits;}
	val1[i]=y1;
	if (typeof t2.rawdata[i]!="undefined") { y2+=t2.rawdata[i].hits;}
	val2[i]=y2;
    }
    var scaley=$('#svgLine').height()/Math.max(Math.max.apply(null,val1),Math.max.apply(null,val2));
    for (i=0; i<=round; i++) { val1[i]*=scaley; val2[i]*=scaley; }

    sl = Snap('#svgLine');*/
    //sl.path("M 0 0 L "+val1);
    //sl.polyline(val2);
    //makeGrid();
    //makePath(val1,'red');
    //makePath(val2,'blue');
    window.location="#modal";
}
document.addEventListener("win",win,false);

function createsquad() {
    $(".activeunit").prop("disabled",true);
    $("#selectphase").hide();
    phase=CREATION_PHASE;
    $(".nextphase").prop("disabled",false);
    currentteam.changefaction("REBEL");
    $("#factionselect selected").val("REBEL");
    $("#creation").show();
}
function addunit() {
    currentteam.addunit(0);
}
function setselectedunit(n,td) {
    var jug=td.parent().first().contents().text().slice(0,-2);
    currentteam=TEAMS[n];
    currentteam.parseJuggler(jug,true);
    currentteam.name=currentteam.toASCII();
    currentteam.toJSON(); // Just for score
    addrow(n,currentteam.name,0,currentteam.faction,jug);
}
function displaysquad(n) {
    var s=$("#squad"+n).val();
    TEAMS[n].parseJSON(localStorage[s],false);
    $("#display"+n).html(TEAMS[n].toJuggler());
    $("#displayxws"+n).html(JSON.stringify(TEAMS[n]));
    $("#faction"+n).attr("class",TEAMS[n].faction);
}
function addrow(team,name,pts,faction,jug) {
    if (team==1) {$("#squad1").val(jug); $("#squad1").attr("data-name",name);}
    if (team==2) {$("#squad2").val(jug); $("#squad2").attr("data-name",name);}
    enablenextphase();
    var n=faction.toUpperCase();
    if (typeof localStorage[name]!="undefined")
	SQUADLIST.row.add(["",n,""+pts,jug,name,"",""]).draw(false);
}
function makeGrid(points1,points2){    
    var dataLength = points1.length;
    var allData = points1.concat(points2);
    var maxValue = Math.max.apply(null, allData);
    var minValue = Math.min.apply(null, allData);
    if (maxValue > $('#svgLine').height()){ 
      $('#svgLine').height(maxValue+10);
    }
    
    // Creates the vertical lines in the graph
    for (var i=0; i<dataLength; i++) {
      var x = i*100;
      var xLine = sl.line(x, minValue-10, x, maxValue+10).attr({
        stroke: "#ccc",
        strokeWidth: 0.25
      });
    }
    
    // Creates the horizontal lines in the graph
    var w = dataLength*100;
    var delimiter = 5;
    var values = (maxValue+10)-(minValue-10);
    var offset = ((maxValue+10)%delimiter);
    for (var i=values; i > 0; i--){
      if ((i-offset) % delimiter === 0){ // Change where lines appear by changing the delimiter (10 for every 10 units, 50 for 50, etc.)
        var yLine = sl.line(0, i, w, i).attr({
          stroke: '#ccc',
          strokeWidth: 0.25
        });
      }
    }
  
  }
  
  function convertToPath(points){
    var path = '';
    
    for (var i=0; i<points.length; i++){
      var x = i*100;
      var y = -points[i]+$('#svgLine').height(); // Convert points to how we like to view graphs
      if (i===0){
        path += 'M'+x+','+y+' S';
      }
      else if (i===points.length-1){
        path += x+','+y;
      }
      else {
        path += x+','+y+',';
      }
    }
    return path;
  }
 
  function makePath(data, color){
    var pathString = convertToPath(data);
    var graphHeight = $('#svgLine').height();
    var fillString = pathString+' V'+graphHeight+' H0 Z';
    
    function getDefaultPath(isFill){
      var defaultPathString = 'M0,'+graphHeight+' H';
      
      
      for (var i=0; i<data.length; i++) {
        if (i!==0){ 
          defaultPathString += i*100+' ';
        }
      }
      
      if(isFill){
        defaultPathString += 'V'+graphHeight+' H0 Z';
      }
      return defaultPathString;
    }
    
    var path = sl.path(getDefaultPath()).attr({
      stroke: color,
      strokeWidth: 2,
      fill: 'transparent'
    });
  
    var fill = sl.path(getDefaultPath(true)).attr({
      fill: color,
      fillOpacity: 0.25    
    });
  
    path.animate({ path: pathString },500);
    fill.animate({ path: fillString },500);
    
  }
function endselection() {
    var team;
    $("#creation").hide();
    $("#selectphase").show();
    currentteam.name="SQUAD."+currentteam.toASCII();
    currentteam.toJSON();// Just for points
    var jug=currentteam.toJuggler(false);
    localStorage[currentteam.name]=JSON.stringify({"pts":currentteam.points,"faction":currentteam.faction,"jug":jug});
    if (currentteam==TEAMS[1]) team=1; else if (currentteam==TEAMS[2]) team=2;
    addrow(team,currentteam.name,currentteam.points,currentteam.faction,currentteam.toJuggler(true));
    refreshsquadlist();
}
function refreshsquadlist() {
    $("#squadlist td:first-child").click(function() { 
	var row = SQUADLIST.row($(this).parents("tr"));
	var data = row.data()[4];
	delete localStorage[data];
	row.remove().draw(false); });
}
function importsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    currentteam.name="SQUAD."+currentteam.toASCII();
    var jug=currentteam.toJuggler(true);
    currentteam.toJSON(); // just for points
    //log(currentteam.toJuggler(false));
    localStorage[currentteam.name]=JSON.stringify({"pts":currentteam.points,"faction":currentteam.faction,"jug":currentteam.toJuggler(false)});
    addrow(t,currentteam.name,currentteam.points,currentteam.faction,jug);
    refreshsquadlist();
}
function startcombat() {
}
function bind(name,c,f) { $(document.body).bind('keydown.'+name,jwerty.event(c,f)); }
function unbind(name) { $(document.body).unbind('keydown.'+name); } 
function bindall(name) {
    var kb=keybindings[name];
    var j;
    for (j=0; j<kb.length; j++) {
	bind(name,kb[j].k,kb[j].f);
    }	    
}

function filltabskill() {
    tabskill=[];
    for (i=0; i<=12; i++) tabskill[i]=[];
    for (i=0; i<squadron.length; i++) tabskill[squadron[i].skill].push(squadron[i]);
}

var ZONE=[];

function nextphase() {
    var i;
    if (REPLAY.length==0) record("nextphase",phase,phase);
    // End of phases
    //if (!enablenextphase()) return;
    window.location="#";
    switch(phase) {
    case SELECT_PHASE:
	$(".h2 .share-buttons").hide();
	$("#game").show();
	$("#selectphase").hide();
	$("#creation").hide();
	$("#rightpanel").show();
	$("#leftpanel").show();
	if ($("input[name='player1']:checked").val()=="human") 
	    TEAMS[1].isia=false; else TEAMS[1].isia=true;
	if ($("input[name='player2']:checked").val()=="human") 
	    TEAMS[2].isia=false; else TEAMS[2].isia=true;
 	break;
    case CREATION_PHASE:
	$(".h2 .share-buttons").hide();
	endselection();
	phase=SELECT_PHASE;
	return;
    case SETUP_PHASE: 
	$(".buttonbar .share-buttons").hide();
	$("#leftpanel").show();
	ZONE[1].remove();
	ZONE[2].remove();
	TEAMS[1].endsetup();
	TEAMS[2].endsetup();
	$(".playerselect").remove();
	$(".nextphase").prop("disabled",true);
	$(".unit").css("cursor","pointer");
	$("#positiondial").hide();
	for (i=0; i<OBSTACLES.length; i++) OBSTACLES[i].g.undrag();
	HISTORY=[];
	/*
	if (REPLAY.length>0) {
	    replayid=0;
	    for (var i=0; i<this.squadron.length; i++) 
		$.extend(this.squadron[i],ReplayUnit.prototype);

	}*/
	$(".permalink").hide();
	break;
    case PLANNING_PHASE:
	$("#maneuverdial").hide();
	break;
    case ACTIVATION_PHASE:
	$("#activationdial").hide();
	for (i=0; i<squadron.length; i++) {
	    squadron[i].hasmoved=false; 
	    squadron[i].hasdecloaked=false;
	    squadron[i].actiondone=false;
	    squadron[i].endactivationphase();
	}
	var b=[];
	for (i=0; i<BOMBS.length; i++) b[i]=BOMBS[i];
	for (i=0; i<b.length; i++) b[i].explode();
	break;
    case COMBAT_PHASE:
	$("#attackdial").hide();
	$("#listunits").html("");
	for (i=0; i<squadron.length; i++) squadron[i].endround();
	round++;
	break;
    }
    phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;
 
    if (phase<3) $("#phase").html(UI_translation["phase"+phase]);
    else $("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
    $("#combatdial").hide();
    if (phase>SELECT_PHASE) for (i=0; i<squadron.length; i++) {squadron[i].unselect();}
    // Init new phase
    for (i=SELECT_PHASE; i<=COMBAT_PHASE; i++) {
	if (i!=phase) unbind("phase"+i);
	else bindall("phase"+i);
    }
    $(".nextphase").prop("disabled",false);
    switch(phase) {
    case SELECT_PHASE:
	$(".buttonbar .share-buttons").hide();
	$(".h2 .share-buttons").show();
	$(".permalink").hide();
	$(".activeunit").prop("disabled",true);
	$("#rightpanel").hide();
	$("#leftpanel").hide();
	$("#game").hide();
	$("#selectphase").show();
	$("#creation").hide();
	currentteam.setfaction("REBEL");
	$(".nextphase").prop("disabled",true);
	//window.location="#creation";
	break;
    case SETUP_PHASE:
	$(".buttonbar .share-buttons").show();
	$("#team2").css("top",$("nav").height()+2);
	$("#team1").css("top",$("nav").height()+2);
	$(".ctrl").css("display","block");

	ZONE[0]=s.path(SETUP.playzone).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		id:'ZONE',
		pointerEvents:"none"
	    });
	if (SETUP.background!="") $(".playmat").css("background","url("+SETUP.background+")");
	if (SETUP.pattern=="") ZONE[0].attr("fillOpacity",0);
	else {
	    var pattern = s.image(SETUP.pattern,0,0,360,360).pattern(0,0,360,360);
	    ZONE[0].attr("fill",pattern);
	}
	ZONE[0].appendTo(VIEWPORT);
	ZONE[1]=s.path(SETUP.zone1).attr({
		fill: TEAMS[1].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[1].appendTo(VIEWPORT);
	ZONE[2]=s.path(SETUP.zone2).attr({
		fill: TEAMS[2].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[2].appendTo(VIEWPORT);
	if (typeof SETUP.playzone1!="undefined"){ 
	    ZONE[3]=s.path(SETUP.playzone1).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		id:'ZONE',
		fillOpacity:0,
		pointerEvents:"none"
	    });
	    ZONE[3].appendTo(VIEWPORT);
	}
	TEAMS[1].endselection(s);
	TEAMS[2].endselection(s);

	$(".activeunit").prop("disabled",false);
	activeunit=squadron[0];
	activeunit.select();
	activeunit.show();
	var zoom=function(centerx,centery,z) {
	    var w=$("#svgout").width();
	    var h=$("#svgout").height();
	    var startX=0;
	    var startY=0;
	    if (h>w) startY=(h-w)/2;
	    else startX=(w-h)/2;
	    var max=Math.max(900./w,900./h);
	    var offsetX=(centerx-startX)*max;
	    var offsetY=(centery-startY)*max;
	    var vm=VIEWPORT.m.clone().invert();
	    var x=vm.x(offsetX,offsetY);
	    var y=vm.y(offsetX,offsetY);
	    VIEWPORT.m.translate(x,y).scale(z).translate(-x,-y);
	    VIEWPORT.transform(VIEWPORT.m);
	    activeunit.show();
	}
	$("#svgout").bind('mousewheel DOMMouseScroll', function(event){
	    var e = event.originalEvent; // old IE support
	    var delta;
	    if (typeof e.wheelDelta != "undefined") 
		delta=e.wheelDelta / 360.;
	    else delta = e.detail/ -9.;
	    var z=Math.pow(1.1, delta);
	    zoom(e.clientX-$("#team1").width(),e.clientY-$("nav").height(),z);
	});

	$("#svgout").mousedown(function(event) { dragstart(event);});
	$("#svgout").mousemove(function(e) {dragmove(e);});
	$("#svgout").mouseup(function(e) {dragstop(e);});

	jwerty.key('w', inhitrange);
	jwerty.key("x", function() { window.location="#";});
	jwerty.key("escape", nextphase);
	jwerty.key("c", center);
	/* By-passes */
	jwerty.key("9", function() { 
		console.log("active:"+activeunit.name+" in hit range:"+activeunit.weapons[0].name);
		var w=activeunit.weapons[0];
		for (var i=0; i<squadron.length; i++) {
		    console.log("      "+squadron[i].name+":"+w.getrange(squadron[i]));
		}
	    });
	jwerty.key("p",function() {
	    activeunit.showpossiblepositions();
	    //activeunit.evaluateposition();
	});
	jwerty.key("m",function() {
	    activeunit.showmeanposition();
	    //activeunit.evaluateposition();
	});
	jwerty.key("shift+m",function() {
	    activeunit.shownextpositions();
	    //activeunit.evaluateposition();
	});
	jwerty.key("shift+p",function() {
	    $(".possible").remove();
	});
	jwerty.key("1", function() { activeunit.focus++;activeunit.show();});
	jwerty.key("2", function() { activeunit.evade++;activeunit.show();});
	jwerty.key("3", function() { if (!activeunit.iscloaked) {activeunit.iscloaked=true;activeunit.agility+=2;activeunit.show();}});
	jwerty.key("4", function() { activeunit.stress++;activeunit.show();});
	jwerty.key("5", function() { activeunit.ionized++;activeunit.show();});
	jwerty.key("shift+1", function() { if (activeunit.focus>0) activeunit.focus--;activeunit.show();});
	jwerty.key("shift+2", function() { if (activeunit.evade>0) activeunit.evade--;activeunit.show();});
	jwerty.key("shift+3", function() { if (activeunit.iscloaked) {activeunit.iscloaked=false;activeunit.agility-=2;activeunit.show();}});
	jwerty.key("shift+4", function() { if (activeunit.stress>0) activeunit.stress--;activeunit.show();});
	jwerty.key("shift+5", function() { if (activeunit.ionized>0) activeunit.ionized--;activeunit.show();});
	jwerty.key("f",function() { activeunit.doattack(true);});
	jwerty.key("d",function() { activeunit.resolvecritical(1);});
	jwerty.key("shift+d",function() { 
	    if (activeunit.hull<activeunit.ship.hull) activeunit.hull++; 
	    else if (activeunit.shield<activeunit.ship.shield) activeunit.shield++; 
	    activeunit.show();
	});
	if (SETUP.asteroids>0) loadrock(s,ROCKDATA);
	if (OBSTACLES.length>0) showrock();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".unit").css("cursor","move");
	$("#positiondial").show();
	bindall("select");
	$(".permalink").show()
	break;
    case PLANNING_PHASE: 
	active=0;
	/* For actions of all ships */
	actionr = [$.Deferred().resolve()];
	/* For phase */
	actionrlock=$.Deferred().resolve();
	//$(".permalink").hide();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").prop("disabled",true);
	$("#maneuverdial").show();
	squadron[0].select();
	skillturn=0;
	filltabskill();
	for (i=0; i<squadron.length; i++) {
	    //squadron[i].evaluatepositions(false,false);
	    squadron[i].newm=squadron[i].m;
	    squadron[i].beginplanningphase().progress(nextplanning);
	}
	nextplanning();
	break;
    case ACTIVATION_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").prop("disabled",true);
	$("#activationdial").show();
	for (i=0; i<squadron.length; i++) squadron[i].beginactivationphase().done(nextdecloak);
	
	filltabskill();
	//subphase=ACTIVATION_PHASE;
	subphase=DECLOAK_PHASE;
	skillturn=0;
	barrier(nextdecloak);
	break;
    case COMBAT_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$("#attackdial").show();
	skillturn=12;
	for (i=0; i<squadron.length; i++) squadron[i].begincombatphase().done(nextcombat);
	
	barrier(nextcombat);
	break;
    }
}
function barrier(f) {
    $.when.apply(null,actionr).done(f);
}
function log(str) {
    $("#log").append("<div>"+str+"<div>");
    $("#log").scrollTop(10000);
}
function permalink(t) {
    var s="?"+TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock(); //+"&"+JSON.stringify(ANIM);
    var h=t.attr("href");
    document.location.search=s; 
    /*else {
	h=h.replace("@",encodeURIComponent(s));
	window.open(h, '_blank');
    }*/
}
function resetlink() {
    document.location.search="";
}
function record(id,val,str) {
    //HISTORY.push({s:str,v:val,id:id});
    //log("<div style='background-color:red;color:white'>"+id+"."+str+":"+val+"<div>");
}
function history_toASCII() {
    var str="";
    for (var i=0; i<HISTORY.length; i++) 
	str+=HISTORY[i].s+"_"+HISTORY[i].id+";"
    return str;
}
function select(name) {
    var i;
    for (i=0; i<squadron.length; i++) {
	if (squadron[i].id==name) break;
    }
    squadron[i].select();
    $("#"+u.id).attr({color:"black",background:"white"});
    $("#"+activeunit.id).attr({color:"white",background:"tomato"});
}

var a1 = [];
a1[0]=2/8; // blank
a1[1]=3/8; // hit
a1[10]=1/8; // crit
a1[100]=2/8; // focus
var d1 = [];
d1[0]=3/8; // blank
d1[1]=3/8; // evade
d1[10]=2/8; // focus

// Add one dice to already existing roll of n dices
function addattackdice(n,proba) {
    var f,c,h,i;
    var p=[];
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++)
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
		p[i+1]=0;
		p[i+10]=0;
		p[i+100]=0;
	    }
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++) 
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]+=proba[i]*a1[0];
		p[i+1]+=proba[i]*a1[1];
		p[i+10]+=proba[i]*a1[10];
		p[i+100]+=proba[i]*a1[100];
	    }
    return p;
}
function adddefensedice(n,proba) {
    var f,e,i;
    var p=[];
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]=0;
	    p[i+1]=0;
	    p[i+10]=0;	   
	}
    }
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]+=proba[i]*d1[0];
	    p[i+1]+=proba[i]*d1[1];
	    p[i+10]+=proba[i]*d1[10];
	}
    }
    return p;
}

function attackproba(n) {
    var i;
    var proba=[];
    proba[0]=a1[0];
    proba[1]=a1[1];
    proba[10]=a1[10];
    proba[100]=a1[100];
    for (i=2; i<=n; i++) {
	proba=addattackdice(i,proba);
    }

    return proba;
}
function defenseproba(n) {
    var i;
    var proba=[];
    proba[0]=d1[0];
    proba[1]=d1[1];
    proba[10]=d1[10];
    for (i=2; i<=n; i++) {
	proba=adddefensedice(i,proba);
    }
    return proba;
}
function attackwithreroll(tokensA,at,attack) {
    var f,h,c,f2,h2,c2,i,j,b;
    var p=[];
    if (tokensA.reroll==0) return at;
    if (typeof tokensA.reroll=="undefined") return at;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++)
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
	    }
    var newf=0, r;
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++) 
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		b=attack-h-c-f; // blanks
		r=tokensA.reroll;
		newf=f;
		if (tokensA.reroll>b) { // more reroll than blanks
		    if (tokensA.focus==0) {
			if (tokensA.reroll>f+b) { // more rerolls than blanks+focus
			    r=f+b;
			    newf=0; // no more focus in results
			} else newf=f-(r-b);
		    } else r=b;
		} 
		//log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
		if (r==0) p[i]+=at[i];
		else {
		    var tot=0;
		    for (f2=0; f2<=r; f2++) 
			for (h2=0; h2<=r-f2; h2++)
			    for (c2=0; c2<=r-f2-h2; c2++) {
				j=100*f2+h2+10*c2;
				k=100*(newf+f2)+h+h2+10*(c+c2);
				p[k]+=at[i]*ATTACK[r][j];
//				if (tokensA.reroll>0) log(attack+" at["+f+" "+h+" "+c+"]:"+at[i]+"*A["+r+"]["+f2+" "+h2+" "+c2+"]:"+ATTACK[r][j]);
			    }
		}
	    }
    return p;
}
function defendwithreroll(tokensD,dt,defense) {
    var f,e,f2,e2,i,j,b;
    var p=[];
    if (tokensD.reroll==0) return dt;
    if (typeof tokensD.reroll=="undefined") return dt;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=defense; f++) for (e=0; e<=defense-f; e++) p[10*f+e]=0;
    var newf=0, r;
    for (f=0; f<=defense; f++) 
	for (e=0; e<=defense-f; e++) {
	    i=10*f+e;
	    b=defense-e-f; // blanks
	    r=tokensD.reroll;
	    newf=f;
	    if (tokensD.reroll>b) { // more reroll than blanks
		if (tokensD.focus==0) {
		    if (tokensD.reroll>f+b) { // more rerolls than blanks+focus
			r=f+b;
			newf=0; // no more focus in results
		    } else newf=f-(r-b);
		} else r=b;
	    } 
	    //log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
	    if (r==0) p[i]+=dt[i];
	    else {
		for (f2=0; f2<=r; f2++) 
		    for (e2=0; e2<=r-f2; e2++) {
			j=10*f2+e2;
			k=10*(newf+f2)+e+e2;
			p[k]+=dt[i]*DEFENSE[r][j];
		    }
	    }
	}
    return p;
}

function tohitproba(tokensA,tokensD,at,dt,attack,defense) {
    var p=[];
    var k=[];
    var f,h,c,d,fd,e,i,j,hit,evade;
    var tot=0,mean=0,meanc=0;
    var ATable=at;
    var DTable=dt;
    var rr=tokensA.reroll;
    var dt=(defense==0)?[]:dt;
    for (h=0; h<=attack; h++) {
	for (c=0; c<=attack-h; c++) {
	    i=h+10*c;
	    p[i]=0;
	}
    }
    
    if (typeof ATable=="undefined") return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    ATable=attackwithreroll(tokensA,at,attack);
    //log("Attack "+attack+" Defense "+defense);
    if (defense>0) DTable=defendwithreroll(tokensD,dt,defense);
    for (j=0; j<=20; j++) { k[j]=0; }
    for (f=0; f<=attack; f++) {
	for (h=0; h<=attack-f; h++) {
	    for (c=0; c<=attack-h-f; c++) {
		var n=100*f+10*c+h;
		var fa,ca,ha,ff,e;
		var a=ATable[100*f+h+10*c]; // attack index
		if (typeof tokensA.modifyattackroll!="undefined")
		    n=tokensA.modifyattackroll(n,tokensD);
		fa=Math.floor(n/100);
		ca=Math.floor((n-100*fa)/10);
		ha=n-100*fa-10*ca;
		for (ff=0; ff<=defense; ff++) {
		    for (ef=0; ef<=defense-ff; ef++) {
			var fd;
			var m=10*ff+ef
			if (typeof tokensD.modifydefenseroll!="undefined") 
			    m=tokensD.modifydefenseroll(m);
			fd=Math.floor(m/10);
			evade=m-10*fd;
			if (defense==0) d=1; else d=DTable[m]
			hit=ha;
			i=0;
			if (tokensD.evade>0) { evade+=1; }
			if (tokensD.focus>0) { evade+=fd; }
			if (tokensA.focus>0) { hit+=fa; }
			if (hit>evade) { i = hit-evade; evade=0; } 
			else { evade=evade-hit; }
			if (ca>evade) { i+= 10*(ca-evade); }
			p[i]+=a*d;
		    }
		}
	    }
	}
    }
    for (h=0; h<=attack; h++) {
	for (c=0; c<=attack-h; c++) {
	    i=h+10*c;
	    if (c+h>0) tot+=p[i];
	    //log("c"+c+" h"+h+" "+p[i]);
	    mean+=h*p[i];
	    meanc+=c*p[i];
	    // Max 3 criticals leading to 2 damages each...Proba too low anyway after that.
	    switch(c) {
	    case 0:
		for(j=1; j<=c+h; j++) k[j]+=p[i];
		break;
	    case 1:
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33;
		for(j=2; j<=c+h+1; j++) k[j]+=p[i]*7/33;
		break;
	    default: 
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33*(32-7)/32;
		for (j=2; j<=c+h+1; j++) k[j]+=p[i]*(7/33*(1-6/32)+(1-7/33)*7/32);
		for (j=3; j<=c+h+2; j++) k[j]+=p[i]*7/33*6/32;
	    }
	}
    }
    return {proba:p, tohit:Math.floor(tot*10000)/100, meanhit:tot==0?0:Math.floor(mean * 100) / 100,
	    meancritical:tot==0?0:Math.floor(meanc*100)/100,tokill:k} ;
}

function probatable(attacker,defender) {
    var i,j;
    var str="";
    for (i=0; i<=5; i++) {
	str+="<tr><td>"+i+"</td>";
	for (j=0; j<=5; j++) {
	    var k=j;
	    if (defender.adddice>0) k+=defender.adddice;
	    var th=tohitproba(attacker,defender,ATTACK[i],DEFENSE[k],i,k);
	    str+="<td class='probacell' style='background:hsl("+(1.2*(100-th.tohit))+",100%,80%)'>";
	    str+="<div>"+th.tohit+"%</div><div><code class='symbols'>d</code>"+th.meanhit+"</div><div><code class='symbols'>c</code>"+th.meancritical+"</div></td>";
	}
	str+="</tr>";
    }
    return str;
}
function fillprobatable() {
    var attacker={focus:$("#focusA").prop("checked")?1:0,
		  reroll:$("#targetA").prop("checked")?5:0};
    var defender={focus:$("#focusD").prop("checked")?1:0,
		  evade:$("#evadeD").prop("checked")?1:0,
		  adddice:$("#cloakD").prop("checked")?2:0,
		  reroll:0}
    //log("REROLL1:"+attacker.reroll);
    var ra;
    ra=parseInt($("#rerollA").val(),10);
    var rd=parseInt($("#rerollD").val(),10);
    //log("REROLL2:"+ra+"-"+$("#rerollA").val());
    if (attacker.reroll==0||(ra>0&&ra<attacker.reroll)) attacker.reroll=ra;
    if (defender.reroll==0||(rd>0&&rd<defender.reroll)) defender.reroll=rd;

    //log("REROLL "+ra);
    var str="<tr><th>Rolls</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>"+probatable(attacker,defender);
    $("#probatable").html(str);
}


function modal_dragstart(event) {
    var style = window.getComputedStyle(event.originalEvent.target, null);
    event.originalEvent.dataTransfer.setData("text/plain",
					     event.target.parentElement.id+","+
					     (parseInt(style.getPropertyValue("left"),10) - event.originalEvent.clientX) + ',' +
					     (parseInt(style.getPropertyValue("top"),10) - event.originalEvent.clientY));
} 
function modal_dragover(event) { 
    event.originalEvent.preventDefault(); 
    return false; 
} 
function modal_drop(event) { 
    var offset = event.originalEvent.dataTransfer.getData("text/plain").split(',');
    var id = offset[0];
    $("#"+id+" > div").css("left", (event.originalEvent.clientX + parseInt(offset[1],10)) + 'px');
    $("#"+id+" > div").css("top", (event.originalEvent.clientY + parseInt(offset[2],10)) + 'px');
    event.originalEvent.preventDefault();
    return false;
} 
var viewport_translate=function(dx,dy) {
    VIEWPORT.m=MT(dx,dy).add(VIEWPORT.m);
    $(".phasepanel").hide();
    VIEWPORT.transform(VIEWPORT.m);
}
    var viewport_zoom=function(z) {
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var offsetX=activeunit.m.x(0,0);
	var offsetY=activeunit.m.y(0,0);
	var vm=VIEWPORT.m.clone().invert();
	var x=vm.x(offsetX,offsetY);
	var y=vm.y(offsetX,offsetY);

	VIEWPORT.m.translate(x,y).scale(z).translate(-x,-y);
	VIEWPORT.transform(VIEWPORT.m);
	activeunit.show();
    }
	var dragmove=function(event) {
	    if (activeunit.dragged==true) return;
	    var e = event; // old IE support
	    var x=e.offsetX,y=e.offsetY;
	    if (VIEWPORT.dragged) {
		var w=$("#svgout").width();
		var h=$("#svgout").height();
		var max=Math.max(900./w,900./h);
		var ddx=(e.offsetX-VIEWPORT.x0)*max;
		var ddy=(e.offsetY-VIEWPORT.y0)*max;
		VIEWPORT.dragMatrix=MT(ddx,ddy).add(VIEWPORT.m);
		VIEWPORT.dragged=true;
		$(".phasepanel").hide();
		VIEWPORT.transform(VIEWPORT.dragMatrix);
	    }
	}
var dragstart=function(event) { 
    var e = event; // old IE support
    VIEWPORT.dragged=true;
    if (e.originalEvent.target.id == "svgout") {
	VIEWPORT.x0=e.offsetX;
	VIEWPORT.y0=e.offsetY;
	VIEWPORT.dragged=true; 
	VIEWPORT.dragMatrix=VIEWPORT.m;
    } else VIEWPORT.dragged=false;
}
var   dragstop= function(e) { 
    if (VIEWPORT.dragged) { 
	VIEWPORT.m=VIEWPORT.dragMatrix;
	VIEWPORT.m.clone();
	VIEWPORT.transform(VIEWPORT.m);
	activeunit.show();
    }
    VIEWPORT.dragged=false;
}
var changelanguage= function(l) {
    localStorage['LANG']=l;
    log("reloading "+l);
    location.reload();
}
var changesetup=function() {
    SETUP = SETUPS[$("#setuplist select").val()];
    var desc=UI_translation[SETUP.description];
    if (typeof desc=="undefined") desc=SETUP.description;
    $("#setuplist span").html(desc);
    $("#setuplist img").attr("src",SETUP.img);
}
$(document).ready(function() {
    s= Snap("#svgout")
    VIEWPORT = s.g().attr({id:"viewport"});
    VIEWPORT.m=new Snap.Matrix();

    P = { F0:{path:s.path("M 0 0 L 0 0").attr({display:"none"}), speed: 0, key:"5"},
	  F1:{path:s.path("M 0 0 L 0 -80").attr({display:"none"}), speed: 1, key:"8"},
	  F2:{path:s.path("M 0 0 L 0 -120").attr({display:"none"}), speed: 2, key:"8"},
	  F3:{path:s.path("M 0 0 L 0 -160").attr({display:"none"}), speed: 3, key:"8"},
	  F4:{path:s.path("M 0 0 L 0 -200").attr({display:"none"}), speed: 4, key:"8"},
	  F5:{path:s.path("M 0 0 L 0 -240").attr({display:"none"}), speed: 5, key: "8" },
	  // Turn right
	  TR1:{path:s.path("M0 0 C 0 -40 15 -55 55 -55").attr({display:"none"}), speed: 1, key:"6"},// 35 -35
	  TR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83").attr({display:"none"}), speed:2, key:"6"},// 63 -63
	  TR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105").attr({display:"none"}), speed:3, key:"6"}, // 85 -85
	  TRR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105").attr({display:"none"}), speed:3, key:";"}, // 85 -85
	  // Turn left
	  TL1:{path:s.path("M0 0 C 0 -40 -15 -55 -55 -55").attr({display:"none"}), speed:1, key:"4"}, // -35 -35
	  TL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83").attr({display:"none"}), speed:2, key:"4"},// -63 -63
	  TL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105").attr({display:"none"}), speed:3, key:"4"}, // -85 -85
	  TRL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105").attr({display:"none"}), speed:3, key:":"}, // -85 -85
	  // Bank right
	  BR1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92").attr({display:"none"}), speed:1, key:"9"}, // 24 -58 (+/-14.14)
	  BR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126").attr({display:"none"}), speed:2, key:"9"}, // 40 -92 (+/-14.14)
	  SR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126").attr({display:"none"}), speed:2, key:"3"}, // 40 -92 (+/-14.14)
	  BR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160").attr({display:"none"}), speed:3, key:"9"}, // 55 -126 (+/-14.14)
	  SR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160").attr({display:"none"}), speed:3, key:"3"}, // 55 -126 (+/-14.14)
	  // Bank left
	  BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92").attr({display:"none"}), speed:1, key:"7"}, // 24 -58 (+/-14.14)
	  BL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126").attr({display:"none"}), speed:2, key:"7"}, // 40 -92 (+/-14.14)
	  SL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126").attr({display:"none"}), speed:2, key:"1"}, // 40 -92 (+/-14.14)
	  BL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160").attr({display:"none"}), speed:3, key:"7"}, // 55 -126 (+/-14.14)
	  SL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160").attr({display:"none"}), speed:3, key:"1"}, // 55 -126 (+/-14.14)
	  // K turns (similar to straight line, special treatment in move function)
	  K1:{path:s.path("M 0 0 L 0 -80").attr({display:"none"}), speed: 1, key:"2"},
	  K2:{path:s.path("M 0 0 L 0 -120").attr({display:"none"}), speed: 2, key:"2"},
	  K3:{path:s.path("M 0 0 L 0 -160").attr({display:"none"}), speed: 3, key:"2"},
	  K4:{path:s.path("M 0 0 L 0 -200").attr({display:"none"}), speed: 4, key:"2"},
	  K5:{path:s.path("M 0 0 L 0 -240").attr({display:"none"}), speed: 5, key: "2" }
	};
    // Load unit data
    $.ajaxSetup({beforeSend: function(xhr){
	if (xhr.overrideMimeType)
	    xhr.overrideMimeType("application/json");
    }});
    var availlanguages={"en":"🇬🇧","fr":"🇫🇷"};
    LANG = localStorage['LANG'] || window.navigator.userLanguage || window.navigator.language;
    
    log("language = "+LANG);
    $.when(
	$.ajax("data/ships.json"),$.ajax("data/strings."+LANG+".json"),$.ajax("data/xws.json"),$.ajax("data/setups.json")
    ).done(function(result1,result2,result3,result4) {
	var process=setInterval(function() {
	    ATTACK[dice]=attackproba(dice);
	    DEFENSE[dice]=defenseproba(dice);
	    dice++;
	    if (dice==8) {
		fillprobatable();
		$("#showproba").prop("disabled",false);
		clearInterval(process);}
	},500);
	unitlist=result1[0];
	SHIP_translation=result2[0].ships;
	PILOT_translation=result2[0].pilots;
	UPGRADE_translation=result2[0].upgrades;
	UI_translation=result2[0].ui;
	CRIT_translation=result2[0].criticals;
	var css_translation=result2[0].css;
	var str="";
	for (var i in css_translation) {
	    str+="."+i+"::after { content:\""+css_translation[i]+"\";}\n";
	}
	$("#localstrings").html(str);
	var factions=["rebel","empire","scum"];
	for (var i in factions) {
	    var f=UI_translation[factions[i]];
	    $(".factionselect").append("<option value='"+factions[i].toUpperCase()+"'>"+f+"</option>");
	}
	UPGRADE_dict=result3[0].upgrades;
	PILOT_dict=result3[0].pilots;
	for (i in result4[0].data) {
	    var st=result4[0].data[i];
	    SETUPS[i]=st;
	}
	var r=0,e=0,i;
	squadron=[];

	s.attr({width:"100%",height:"100%",viewBox:"0 0 900 900"});
	TEAMS[1].setfaction("REBEL");
	TEAMS[2].setfaction("EMPIRE");
	UPGRADES.sort(function(a,b) {
	    var an=a.name;
	    var bn=b.name;
	    if (typeof UI_translation[an]!="undefined"&&typeof UI_translation[an].name!="undefined") an=UI_translation[a.name].name;
	    if (typeof UI_translation[bn]!="undefined"&&typeof UI_translation[bn].name!="undefined") bn=UI_translation[b.name].name;
	    var u1=an+a.type;
	    var u2=bn+b.name;
	    return u1.localeCompare(u2);
	});
	PILOTS.sort(function(a,b) { 
		var d=a.points-b.points;
		if (d==0) return a.name.localeCompare(b.name);
		else return d;
	    });
	var n=0,u=0,ut=0;
	var str="";
	for (i=0; i<PILOTS.length; i++) {
	    if (PILOTS[i].done==true) { if (PILOTS[i].unique) u++; n++; }
	    if (!PILOTS[i].done) { 
		if (PILOTS[i].unique) str+=", ."; else str+=", ";
		str+=PILOTS[i].name; 
	    }
	}
	log(n+"/"+PILOTS.length+" pilots with full effect");
	if (str!="") log("Pilots NOT implemented"+str);
	n=0;
	str="";
	for (i=0; i<UPGRADES.length; i++) {
	    if (UPGRADES[i].done==true) n++;
	    else str+=", "+(UPGRADES[i].unique?".":"")+UPGRADES[i].name;
	}
	$(".ver").html(VERSION);
	log(n+"/"+UPGRADES.length+" upgrades implemented");
	log("Upgrades NOT implemented"+str);
	$("#showproba").prop("disabled",true);
	var d=new Date();
	//for (i=0; i<d.getMinutes(); i++) Math.random();
	loadsound();
	var mousewheel=function(t,event) {
	    var min=$("nav").height()+2;
	    var e = event.originalEvent; // old IE support
	    //var delta = Math.max(-100, Math.min(100, (e.wheelDelta || -e.detail)));
	    var top=parseInt($("#team1").css("top"),10);//+delta;
	    
	};
	var scrolloverflow=function(event) {
	    var id=event.target.id;
	    $("#"+id+" .outoverflow").each(function(index) { 
		    if ($(this).css("top")!="auto") {
			$(this).css("top",$(this).parent().offset().top+"px");
		    }
		    });
	}
	var mc= new Hammer(document.getElementById('svgout'));
	mc.get("pinch").set({enable:true});
	mc.get('pan').set({direction:Hammer.DIRECTION_ALL});
	mc.on("panleft panright panup pandown",function(ev) {
	    if (ev.target.id!="svgout") {return;}
	    if (activeunit.dragged==true) return;
	    viewport_translate(-ev.velocityX*50,-ev.velocityY*50);
	});
	
	mc.zoom=1;
	mc.on("pinch",function(ev) {
	    if (ev.target.id!="svgout") { return;}
	    if (activeunit.dragged==true) return;
	    var vm=VIEWPORT.m.clone().invert();
	    var x=vm.x(ev.center.x,ev.center.y);
	    var y=vm.y(ev.center.x,ev.center.y);
	    VIEWPORT.m.translate(x,y).scale(ev.scale).scale(1/mc.zoom).translate(-x,-y);
	    mc.zoom=ev.scale;
	    VIEWPORT.transform(VIEWPORT.m);
	    activeunit.show();
	    if (ev.final) mc.zoom=1;
	});
	$("aside").on("scroll touchmove touchstart mousewheel", scrolloverflow);

	var args= window.location.search.substr(1).split('&');
	if (args.length>1) {
	    log("Loading permalink...");
	    ROCKDATA=args[2];
	    phase=CREATION_PHASE;
	    TEAMS[1].parseASCII(args[0]);
	    TEAMS[1].toJSON(); // Just for points
	    TEAMS[2].parseASCII(args[1]);
	    TEAMS[2].toJSON(); // Just for points
	    SETUP=SETUPS["Classic Map"];
	    //if (args.length>3) ANIM=$.parseJSON(args[3]);
	    phase=SELECT_PHASE;
	    return nextphase();
	} else {
	    phase=0;
	    nextphase();
	    
	    for (i in SETUPS) {
		var j=i;
		if (typeof UI_translation[i]!="undefined") j=UI_translation[i];
		$("#setuplist select").append("<option value='"+i+"'>"+j+"</option>");
	    }
	    SETUP = SETUPS["Classic Map"];
	    changesetup();

	    $("#squadlist").html("<thead><tr><th></th><th>"+UI_translation["type"]+"</th><th><span class='m-points'></span></th><th><span class='m-units'></span></th><th></th><th></th></tr></thead>");
	    var stype="";
	    $.fn.dataTable.ext.search.push(
		function( settings, data, dataIndex ) {
		    return data[1].search(stype)>-1;
		}
	    );
	    $("#uselector").html($("<span>").html(UI_translation["empire"]).click(function() { stype="EMPIRE";SQUADLIST.draw();refreshsquadlist(); }));
	    $("#uselector").append($("<span>").html(UI_translation["scum"]).click(function() { stype="SCUM";SQUADLIST.draw();refreshsquadlist(); }));
	    $("#uselector").append($("<span>").html(UI_translation["rebel"]).click(function() { stype="REBEL";SQUADLIST.draw();refreshsquadlist(); }));
	    $("#uselector").append($("<span>").html(UI_translation["My builds"]).click(function() { stype="USER";SQUADLIST.draw();refreshsquadlist(); }));
	    $("#uselector").append($("<span>").html(UI_translation["Prebuilt"]).click(function() { stype="PREBUILT";SQUADLIST.draw();refreshsquadlist(); }));

	    SQUADLIST=$("#squadlist").DataTable({
		"language": {
		    "search":UI_translation["Search"],
		    "lengthMenu": UI_translation["Display _MENU_ records per page"],
		    "zeroRecords": UI_translation["Nothing found - sorry"],
		    "info": UI_translation["Showing page _PAGE_ of _PAGES_"],
		    "infoEmpty": UI_translation["No records available"],
		    "infoFiltered": UI_translation["(filtered from _MAX_ total records)"]
		},
		"columnDefs": [
		    { "targets": [0],
		      "render":function() {
			  return "<span class='close'>&#xd7;</span>";
		      },
		      "sortable":false
		    },
		    { "targets":[1],
		      "sortable":false,
		      "render":function(data,type,row) {
			  if (row[4].search("SQUAD")>-1)
			      return "<span style='display:none'>"+data+" USER</span><span class='"+data+"'></span>";
			  return "<span style='display:none'>"+data+" PREBUILT</span><span class='"+data+"'></span><span class='prebuilt'></span>";
			  
		      }
		    },
		    {
			"targets": [ 4 ],
			"visible": false,
			"searchable": false
		    },
		    {   "targets":[3],
			"render": function ( data, type, row ) {
			    if (LANG!="en"&&phase==SELECT_PHASE) 
				if (row[4].search("SQUAD")==-1) {
				    TEAMS[0].parseJuggler(data,true);
				    data=TEAMS[0].toJuggler(true);
				}
			    return "<pre>"+data+"</pre><button class='m-squad1' onclick='setselectedunit(1,$(this))'>&#x27a1;</button><button class='m-squad2' onclick='setselectedunit(2,$(this))'>&#x27a1;</button>";
			}
		    }],    
		"ajax": "data/full4b.json",
		"scrollY":        "20em",
		"scrollCollapse": true,
		"ordering":true,
		"info":true,
		"paging":         false});

	    for (i in localStorage) {
		if (typeof localStorage[i]=="string"&&i.match(/SQUAD.*/)) {
		    //delete localStorage[i];
		    var l=$.parseJSON(localStorage[i]);
		    if (typeof l.jug=="undefined"||typeof l.pts=="undefined")
			delete localStorage[i]
		    else if (LANG!="en") { TEAMS[0].parseJuggler(l.jug,true); addrow(0,i,l.pts,l.faction,TEAMS[0].toJuggler(true)); }
		    else addrow(0,i,l.pts,l.faction,l.jug);
		}
	    }
	    refreshsquadlist();
	}
	var pilots=[];
	for (i in PILOT_translation) {
	    var n=i;
	    if (typeof PILOT_translation[i].name!="undefined") n=PILOT_translation[i].name;
	    pilots.push(n.replace(/\'/g,"").replace(/\(Scum\)/g,""));
	}
	var upgrades=[];
	for (i in UPGRADE_translation) {
	    var n=i;
	    if (typeof UPGRADE_translation[n].name!="undefined") n=UPGRADE_translation[i].name;
	    upgrades.push(n.replace(/\'/g,"").replace(/\(Crew\)/g,""));
	}
	$(".squadbg > textarea").asuggest(pilots, { 'delimiters': '\n', 'cycleOnTab': true });
	$(".squadbg > textarea").asuggest(upgrades, { 'delimiters': '+ ', 'cycleOnTab':true});
	/*md = new Hammer(document.getElementById('leftpanel'));
	  md.get('pan').set({direction:Hammer.DIRECTION_VERTICAL});
	  md.on("panup pandown",function(ev) {
	  log(ev.type);
	  });*/
    });
});

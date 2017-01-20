var ROCKIMG="png/asteroid.png";
var OBSTACLES=[];
var PX=[300,500,300,500,300,500];
var PY=[250,250,400,400,550,550];
var id=0;
function loadrock(s,str) {
    var i,j;
    var coord=[],o,ob;
    PATTERN = s.image(ROCKIMG,0,0,200,200).pattern(0,0,200,200);
    if (str !="") {
	o=str.split(";");
	for (i=0; i<6; i++) {
	    ob=o[i].split(",");
	    coord[i]=[parseInt(ob[0],10),parseInt(ob[1],10),parseInt(ob[2],10)];
	}
    } else for (i=0; i<6; i++) coord[i]=[Math.random()*150-75,Math.random()*150-50,Math.random()*45];
    for (i=0; i<6; i++) {
	OBSTACLES[i]=new Rock(i,coord[i]);
    }

}
function saverock() {
    if (OBSTACLES.length==0) return "";
    var str=OBSTACLES[0].toASCII();
    for (var i=1; i<6; i++) 
	str+=";"+OBSTACLES[i].toASCII();
    return str;
}
function getid() {
    return id++;
}

function Rock(frag,coord) {    
    var k;
    var i=getid();
    this.o=[];
    this.name="Asteroid #"+i;
    this.arraypts=[];
    this.dragged=false;
    this.tx=coord[0];
    this.ty=coord[1];
    this.alpha=coord[2];
    this.m=(new Snap.Matrix()).translate(coord[0]+PX[i],coord[1]+PY[i]).rotate(coord[2],0,0).scale(0.5,0.5);
    Snap.load("data/rock"+(frag+1)+".svg",function(fragment) {
	this.g=fragment.select("path");
	this.g.attr({
	    fill: PATTERN,
	    strokeWidth: 0,
	    stroke: "#F00",
	});
	for (k=0; k<this.g.getTotalLength(); k+=5) 
	    this.arraypts.push(this.g.getPointAtLength(k));
	if (REPLAY.length==0) 
	    this.g.drag(this.dragmove.bind(this), 
			this.dragstart.bind(this),
			this.dragstop.bind(this));
	this.path="";
	this.g.hover(function() { this.g.attr({strokeWidth:4});}.bind(this),
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
    }.bind(this));
}

Rock.prototype = {
    toASCII: function() {
	return Math.floor(this.tx)+","+Math.floor(this.ty)+","+Math.floor(this.alpha);
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
		this.unit.getagility.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.unit.showstats();
	    }
	    this.isactive=false;
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1)[0];
	    if (roll=="hit") {
		this.facedown();
	    } else this.unit.log("%0 not repaired ",this.name);
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
	    var save=[];
	    this.unit.wrap_after("getdial",this,function(a) {
		if (save.length==0) {
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
	lethal:true,
	faceup: function() {
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.unit.wrap_before("begincombatphase",this,function() {
		var roll=this.rollattackdie(1)[0];
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
	faceup:function() {
	    this.unit.log("Critical: %0",this.name);
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
	    var roll=this.unit.rollattackdie(1)[0];
	    if (roll=="critical"||roll=="hit") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
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
	    var roll=this.unit.rollattackdie(1)[0];
	    if (roll=="hit") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
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
	    this.unit.log(this.wp.name+" not functioning anymore");
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
	    var self=this;
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.hd=this.unit.handledifficulty;
	    this.unit.wrap_after("handledifficulty",this,function(d) {
		var roll=this.rollattackdie(1)[0];
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
	type:"pilot",
	faceup: function() {
	    var self=this;
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.unit.wrap_before("endround",this,function() {
		this.wrap_after("getagility",self,function() {
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
	type:"pilot",
	faceup: function() {
	    var self=this;
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.unit.wrap_after("getattackstrength",this,function(w,t,a) { this.getattackstrength.unwrap(self); self.isactive=false; return 0; });
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
		if (upg.type==ELITE) upg.desactivate();
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
		    if (upg.type==ELITE) {
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
	type:"pilot",
	lethal:true,
	faceup: function() {
	    var self=this;
	    this.unit.log("Critical: %0",this.name);
	    this.isactive=true;
	    this.unit.wrap_before("resolvecollision",this,function() {
		this.removehull(1);
		this.log("+1 %HIT% [%0]",self.name);
	    });
	    this.unit.wrap_before("resolveocollision",this,function() {
		this.removehull(1);
		this.log("+1 %HIT% [%0]",self.name);
	    });
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.unwrap("resolvecollision",this);
		this.unit.unwrap("resolveocollision",this);
		this.unit.log("no longer stunned");
	    }
	}
    }
];
/*



 */
var s;
var BLACK="#111",GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0",GREY="#888";
var HALFBLACK="#222",HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880",HALFGREY="#444";
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
var REROLL_M=0,ADD_M=1,MOD_M=2
var ATTACK_M=0,DEFENSE_M=1;
var FACEUP=1,FACEDOWN=2,DISCARD=0;
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
	SOUNDS[SOUND_NAMES[i]]=new Howl({
	    urls: [SOUND_FILES[i]+".ogg", SOUND_FILES[i]+".m4a", SOUND_FILES[i]+".wav"],
	    autoplay:false,
	    loop:false
	});
    }
    SOUNDS["cloak"] = new Howl({
	urls: ["ogg/cloak_romulan.ogg","ogg/cloak_romulan.mp3"],
	autoplay:false,
	loop:false
    });
    SOUNDS["decloak"] = new Howl({
	urls: ["ogg/decloak_romulan.ogg","ogg/decloak_romulan.mp3"],
	autoplay:false,
	loop:false
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
function Unit(team,pilotid) {
    var i;
    this.dead=false;
    this.isdocked=false;
    this.ship={};
    this.id=gid;
    this.life=1;
    this.wrapping=[];
    var id=this.id;
    generics["u"+gid]=this;
    gid++;
    this.maxupg=[];
    this.exclupg=[];
    this.team=team;
    this.faction=TEAMS[team].faction;
    this.shipactionList=[];
    this.dial=[];
    this.ordnance=false;
    this.dialselect="<table class='dial' id='dial"+id+"'></table>";
    this.text="<span id='text"+id+"' class='details'></span>";
    this.upgradesno=0;
    this.upgrades=[];
    this.criticals=[];
    this.DEFENSEREROLLD=[];
    this.ATTACKREROLLA=[];
    this.ATTACKMODA=[];
    this.ATTACKADD=[];
    this.DEFENSEMODD=[];
    this.DEFENSEADD=[];
    this.tx=this.ty=this.alpha=0.;
    if (typeof PILOTS[pilotid]=="undefined") {
	this.error("pilot does not exists "+pilotid);
	return;
    }
    var u=unitlist[PILOTS[pilotid].unit];
    this.ship={
	shield:u.shield,
	hull:u.hull,
	firesnd:u.firesnd,
	flysnd:u.flysnd,
	name:PILOTS[pilotid].unit,
	hastitle:u.hastitle,
    };
    this.shipimg=u.img[0];
    this.scale=u.scale;
    this.islarge=(u.islarge==true)?true:false;
    this.hull=u.hull;
    this.shield=u.shield;
    this.agility=u.evade;
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
    /*
    this.showdial();
    this.showactions();
    this.removepilot(true);
    this.getpilotlist();*/
    this.name=PILOTS[pilotid].name;
    this.pilotid=pilotid;
    this.unique=PILOTS[pilotid].unique==true?true:false;
    this.skill=PILOTS[pilotid].skill;
    this.install=(typeof PILOTS[pilotid].install!="undefined")?PILOTS[pilotid].install:function() {};
    this.uninstall=(typeof PILOTS[pilotid].uninstall!="undefined")?PILOTS[pilotid].uninstall:function() {};
    var up=PILOTS[pilotid].upgrades;
    this.upg=[];
    this.upgbonus=[];
    for (j=0; j<10; j++) {this.upg[j]=-1};
    this.upgradetype=[];
    for (k=0; k<up.length; k++) this.upgradetype[k]=up[k];
    this.upgradetype[k++]=MOD;
    if (unitlist[this.ship.name].hastitle) {
	this.upgradetype[k++]=TITLE;
    }
    this.upgradesno=k;
    this.points=PILOTS[pilotid].points;
    this.install(this);
    TEAMS[this.team].updatepoints();
}
Unit.prototype = {
    tosquadron: function(s) {
	var upgs=this.upg;
	//log(this.name+" has touching");
	this.usedweapon=-1;
	this.activeweapon=-1;
	this.touching=[];
	this.maneuver=-1;
	this.action=-1;
	this.actionsdone=[];
	this.hasmoved=false;
	this.hasdecloaked=false;
	this.actiondone=false;
	this.reroll=0;
	this.focus=0;
	this.tractorbeam=0;
	this.lastmaneuver=-1;
	this.iscloaked=false;
	this.istargeted=[];
	this.targeting=[];
	this.stress=0;
	this.ionized=0;
	this.removeionized=false;
	this.evade=0;
	this.hasfired=0;
	this.hitresolved=0;
	this.criticalresolved=0;
	this.m=new Snap.Matrix(); 
	this.collision=false;
	this.ocollision={overlap:-1,template:[],mine:[]};
	var uu=[];
	for (j in upgs) if (upgs[j]>-1) uu.push(Upgradefromid(this,upgs[j]));
	//for (j=0;j<uu.length; j++) if (typeof uu[j].init=="function") uu[j].init(this);
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	var img=this.shipimg;

	if (!(this.islarge)) {
	    if (typeof this.shipimg!="undefined") {
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
	    else this.img=s.image("png/"+this.shipimg,-50*this.scale,-50*this.scale,100*this.scale,100*this.scale).transform('r 90 0 0');
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
	for(i=0; i<6; i++) {
	    this.infoicon[i]=s.text(w-7,6-w+7*i,A[AINDEX[i+2]].key)
		.attr({class: "xsymbols",fill:A[AINDEX[i+2]].color,strokeWidth: 0
		      });
	}
	this.geffect=s.group(this.imgflame,this.imgsmoke);
	// Order in the group is important. Latest is on top of stacked layers
	this.g=s.group(this.sector,this.outline,this.img,this.dialspeed,this.dialdirection,this.actionicon,this.infoicon[0],this.infoicon[1],this.infoicon[2],this.infoicon[3],this.infoicon[4],this.infoicon[5],this.gstat);
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
		var p=$("#svgout").offset();
		var min=Math.min($("#playmat").width(),$("#playmat").height());
		var x=m.x(bbox.x,bbox.y-20)/max;
		x+=p.left+startX;
		var y=m.y(bbox.x,bbox.y-20)/max;
		y+=p.top+startY;
		$(".info").css({left:x,top:y}).html(translate(this.name))
		    .appendTo("body").show();
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
    },
    wrap_after: function (name,org,after,unwrap) {
	var self=this;
	var save=self[name];
	if (typeof save=="undefined") this.error("name"+name+" undefined");
	var global=false;
	if (typeof save.org=="undefined"&&this!=Bomb.prototype&&this!=Unit.prototype&&this!=Weapon.prototype) global=true;
	var f=function () {
            var args = Array.prototype.slice.call(arguments),
            result;
	    if (global) {
		result=this.__proto__[name].apply(this,args);
            } else result=save.apply( this, args);
            result=after.apply( this, args.concat([result]));
	    return result;
	}
	f.save=save;
	f.org=org;
	if (typeof org.wrapping=="undefined") org.wrapping=[];
	org.wrapping.push({name:name,wrap:this});
	f.unwrapper=function(name2) {
	    var uw=self.wrap_before(name2,org,function(a) {
		f.unwrap(org);
		uw.unwrap(org);
		return a;
	    });
	}
	f.unwrap=function(o) { 
	    if (f.org==o) {
		if (global) self[name]=self.__proto__[name];
		else self[name]=f.save;
		if (name=="getskill") {
		    filltabskill();
		}
		self.show();
	    } else if (typeof f.save.unwrap=="function") f.save=f.save.unwrap(o);
	    self.show();
	    return self[name];
	}
	this[name]=f;
	if (name=="getskill") {
	    filltabskill();
	}
	return f;
    },
    desactivate:function() {
	for (var i in this.wrapping) {
	    var w=this.wrapping[i];
	    if (typeof w.wrap[w.name].unwrap=="function") {
		w.wrap[w.name].unwrap(this);
	    }
	}
	this.isactive=false; 
    },
    wrap_before: function(name,org,before,unwrap) {
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
	if (typeof save=="undefined") console.error("org:"+org.name+" "+name);
	if (typeof org.wrapping=="undefined") org.wrapping=[];
	org.wrapping.push({name:name,wrap:this});
	if (typeof save.vanilla!="undefined") f.vanilla=save.vanilla;
	else f.vanilla=save;
	f.unwrapper=function(name2) {
	    var uw=self.wrap_before(name2,org,function() {
		f.unwrap(org);
		uw.unwrap(org);
	    });
	}
	f.unwrap=function(o) {
	    if (f.org==o||typeof f.save.unwrap!="function") {
		self[name]=f.save;
		if (typeof unwrap=="function") unwrap.call(self);
		self.show();
	    } else f.save=f.save.unwrap(o);
	    return f.save;
	}
	this[name]=f;
	return f;
    },
    toJSON: function() {
	var s={};
	s.name=xws_lookup(this.name);
	s.points=PILOTS[this.pilotid].points;
	s.ship=xws_lookup(this.ship.name);
	var upgpt={};
	var pointsreduction={};
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u!=-1&&typeof u!="undefined") {
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
	    if (u!=-1&&typeof u!="undefined") {
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
	var s=this.name;

	if (translated==true) s=translate(this.name);
	s=s.replace(/\'/g,""); 
	if (PILOTS[this.pilotid].ambiguous==true) s=s+"("+this.ship.name+")";
	for (var i=0; i<this.upg.length; i++) {
	    var upg=this.upg[i];
	    if (upg>-1) {
		var v=UPGRADES[upg].name;
		if (translated==true) v=translate(UPGRADES[upg].name);
		s += " + "+v.replace(/\(Crew\)/g,"").replace(/\'/g,"");		
	    }
	}
	return s;
    },
    toASCII: function() {
	var s=this.pilotid;
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u>-1) s+=","+u;
	}
	s+=":"+Math.floor(this.tx)+","+Math.floor(this.ty)+","+Math.floor(this.alpha);
	return s;
    },
    toString2: function() {
	var n=0;
	var i,j,k;
	//var faction=currentteam.faction;
	var str="";
	var template = $('#unit-creation').html();
	Mustache.parse(template);   // optional, speeds up future uses
	var img=PILOTS[this.pilotid].dict;
	if (PILOTS[this.pilotid].ambiguous==true) img+="-"+unitlist[this.ship.name].dict;
	var rendered = Mustache.render(template, {
	    imgname:img,
	    faction:currentteam.faction,
	    skill:this.getskill(),
	    name:translate(this.name),
	    points:this.points,
	    unique:(PILOTS[this.pilotid].unique==true?false:true),
	    id:this.id,
	    evade:repeat('u',this.evade),
	    hull:repeat('u',this.hull),
	    shield:repeat('u',this.shield),
	    fire:repeat('u',this.weapons[0].getattack()),
	    shipimg:this.shipimg,
	    dialstring:this.getdialstring(),
	    shipname:SHIP_translation[this.ship.name],
	    actionstring:this.getactionstring(),
	    upgradeaddstring:this.getupgradeaddstring()
	});
	return rendered;
    },
    getstatstring:function() {
	var str="";
	str+="<div class='xsymbols RED'>"+repeat('u',this.weapons[0].getattack())+"</div>"
	str+="<div class='xsymbols GREEN'>"+repeat('u',this.getagility())+"</div>"
	str+="<div class='xsymbols YELLOW'>"+repeat('u',this.hull)+"</div>"
	str+="<div class='xsymbols BLUE'>"+repeat('u',this.shield)+"</div>";
	return str;
    },
    getupgradeaddstring:function() {
	var str="";
	for (var j=0; j<this.upgradetype.length; j++)
	    if (this.upg[j]==-1)
		str+="<button num="+j+" class='upgrades "+(this.upgradetype[j]).replace(/\|/g,"")+"'>+</button>";
	return str;
    },
    showskill: function() {
	$("#unit"+this.id+" .statskill").html(this.getskill());
    },
    showupgradeadd:function() {
	$("#unit"+this.id+" .upgavail").html(this.getupgradeaddstring());
	addupgradeaddhandler(this);
    },
    getagility: function() {
	return this.agility;
    },
    getskill: function() {
	return this.skill;
    },
    getdial: function() {
	if ((this.ionized>0&&!this.islarge) || this.ionized>1) {
	    return [{move:"F1",difficulty:"WHITE"}];
	}
	return this.dial;
    },
    doplan: function() { this.showdial(); return this.deferred; },
    getdialstring: function() {
	var m=[];
	var str="";
	for (j=0; j<=5; j++) {
	    m[j]=[];
	    for (k=0; k<=6; k++) m[j][k]="<td></td>";
	}
	var gd=this.getdial();
	for (j=0; j<gd.length; j++) {
	    d=gd[j];
	    var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
	    m[cx][cy]="<td class='symbols "+d.difficulty+"' >"+P[d.move].key+"</td>";
	}
	for (j=5; j>=0; j--) {
	    str+="<tr>";
	    if (j>0&&j<5) str+="<td>"+j+"</td>"; else str+="<td></td>";
	    for (k=0; k<=6; k++) str+=m[j][k];
	    str+="</tr>\n";
	}
	return str;
    },
    canreveal: function(d) {
	return d.difficulty!="RED"||this.stress==0;
    },
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
		if (!this.canreveal(d)) m[cx][cy]="<td></td>";
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
		this.clearmaneuver();
		return;
	    };

	}
    },
    getupgradelist:function(type) {
	var p=[];
	for (var j=0; j<UPGRADES.length; j++) {
	    var u=UPGRADES[j];
	    if (typeof u.faction != "undefined" 
		&& u.faction!=this.faction) continue;
	    if (typeof u.ship != "undefined" 
		&& this.ship.name.search(u.ship)==-1) continue;
	    if (typeof u.ishuge != "undefined") continue;
	    if (typeof u.islarge != "undefined"
		&& this.islarge!=u.islarge) continue;
	    if (typeof u.skillmin != "undefined" 
		&& this.getskill()<u.skillmin) continue;
	    if (typeof u.noupgrades != "undefined" 
		&& this.upgradetype.indexOf(u.noupgrades)>-1) continue;
	    if (typeof u.actionrequired != "undefined"
		&& this.shipactionList.indexOf(u.actionrequired.toUpperCase())==-1) continue;
	    if (typeof this.maxupg[u.type]!="undefined") {
		if (this.maxupg[u.type]<u.points) continue;
	    }
	    if (typeof u.requiredupg!="undefined") {
		for (var i=0; i<u.requiredupg.length; i++)
		    if (this.upgradetype.indexOf(u.requiredupg[i])==-1) continue;
	    }
	    if (type.match(u.type)) {
		var n=u.name;
		var n2=u.name+((u.type=="Crew")?"(Crew)":"")
		if (u.takesdouble==true && this.upgradetype.indexOf(u.type)==this.upgradetype.lastIndexOf(u.type)) continue;
		p.push(j);
	    }
	}
	p.sort(function(a,b) { return translate(UPGRADES[a].name)>translate(UPGRADES[b].name);    });
	return p;
    },
    turn: function(n) {
	this.alpha+=n;
	this.m.rotate(n,0,0); 
	this.show();
    },
    getactionstring: function() {
	var str="";
	for (var i=0; i<this.shipactionList.length; i++) {
	    str+="<span class='GREEN symbols'>"+A[this.shipactionList[i]].key+"</span>&nbsp;";
	}
	return str;
    },
    showactionlist:function() {
	var str=this.getactionstring();
	$("#unit"+this.id+" .actionlist").html(str);
    },
    // Rolls results are deducted from probabilistic repartition...
    getattacktable: function(n) { return ATTACK[n]; },
    attackroll: function(n) {
	var i,f,h,c;
	var P=this.getattacktable(n);
	var ptot=0;
	var r=Math.random();
	if (n==0) return 0;
	for (f=0; f<=n; f++) {
	    for (h=0; h<=n-f; h++) {
		for (c=0; c<=n-f-h; c++) {
		    i=f*FCH_FOCUS+h+FCH_CRIT*c;
		    ptot+=P[i];
		    if (ptot>r) return FCH_FOCUS*f+c*FCH_CRIT+h;
		}
	    }
	}
	return 0;
    },
    rollattackdie: function(n) { var p=[]; for (var i=0; i<n; i++) p.push(FACE[ATTACKDICE[this.rand(8)]]); return p; },
    rolldefensedie: function(n) { var p=[]; for (var i=0; i<n; i++) p.push(FACE[DEFENSEDICE[this.rand(8)]]); return p; },
    rand: function(n) { return Math.floor(Math.random()*n); },
    getdefensetable: function(n) { return DEFENSE[n]; },
    defenseroll: function(n) {
	var i,e,f;
	var lock=$.Deferred();
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=Math.random();
	if (n==0) return lock.resolve({dice:n,roll:0}).promise();
	if (typeof P=="undefined") {
	    this.error("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*FE_FOCUS+e*FE_EVADE;
		ptot+=P[i];
		if (ptot>r) return lock.resolve({dice:n,roll:FE_FOCUS*f+e*FE_EVADE}).promise();
	    }
	}
	return lock.resolve({dice:n,roll:0}).promise();
    },
    getdicemodifiers: function() {
	return [{from:ATTACK_M,type:MOD_M,to:ATTACK_M,org:this,
		 req:function() {return this.canusefocus();}.bind(this),
		 f:function(m,n) {
		     this.removefocustoken();
		     var f=FCH_focus(m);
		     if (f>0)  m=m-FCH_FOCUS*f+FCH_HIT*f;
		     return m;    
		 }.bind(this),str:"focus",token:true},
		{from:ATTACK_M,type:REROLL_M,to:ATTACK_M,org:this,
		 req:function(a,w,t) {return this.canusetarget(t);}.bind(this),
		 n:function() { return 9; },
		 dice:["blank","focus"],
		 f:function() {
		     activeunit.removetarget(targetunit);
		 },
		 str:"target",token:true},
		{from:DEFENSE_M,type:MOD_M,to:DEFENSE_M,org:this,
		 req:function() {return this.canusefocus();}.bind(this),
		 f:function(m,n) {
		     this.removefocustoken();
		     var f=FE_focus(m);
		     if (f>0)  m=m-FE_FOCUS*f+FE_EVADE*f;
		     return m;    
		 }.bind(this),str:"focus",token:true},
		{from:DEFENSE_M,type:ADD_M,to:DEFENSE_M,org:this,
		 req:function() {return this.canuseevade(); }.bind(this),
		 f: function(m,n) {	    
		     this.removeevadetoken(); 
		     return {m:m+FE_EVADE,n:n+1} 
		 }.bind(this),str:"evade",token:true},
	       ];
    },
    adddicemodifier: function(from,type,to,org,mod) {
	mod.org=org;
	mod.type=type;
	mod.from=from;
	mod.to=to;
	this.wrap_after("getdicemodifiers",org,function(m) {
	    return m.concat(mod);
	});
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
	this.showdial();
	this.showmaneuver();
	if (typeof this.deferred == "undefined") this.error("undefined deferred");
	this.deferred.notify();
    },
    select: function() {
	if (this.dead||this.isdocked) return activeunit;
	if (phase<ACTIVATION_PHASE
	    ||(phase==ACTIVATION_PHASE)
	    ||(phase==COMBAT_PHASE)) {
	    var old=activeunit;
	    activeunit=this;
	    if (old!=this) old.unselect();
	    $("#"+this.id).addClass("selected");
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
	for (k=0; k<OBSTACLES.length; k++){
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
	for (i in squadron) {
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
	    for (k in squadron) {
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
    candoroll:function() {
	var moves=this.getrollmatrix(this.m);
	var b=false;
	for (var i=0; i<moves.length; i++) 
	    b=b||(this.getmovecolor(moves[i],true,true)==GREEN);
	return b;
    },
    candoboost:function() {
	var moves=this.getboostmatrix(this.m);
	var b=false;
	for (var i=0; i<moves.length; i++) 
	    b=b||(this.getmovecolor(moves[i],true,true)==GREEN);
	return b;
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
		    case "BOOST":if (this.candoboost())
			al.push(this.newaction(this.resolveboost,"BOOST"));break;
		    case "ROLL":if (this.candoroll()) 
			al.push(this.newaction(this.resolveroll,"ROLL"));break;
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
	    if ((this.actionsdone.indexOf(upg.name+"/2")==-1)
		&&upg.isactive&&typeof upg.action2=="function"&&upg.candoaction2()) 
		al.push({org:upg,action:upg.action2,type:upg.type.toUpperCase(),name:upg.name+"/2"});
	    
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
	this.animateaddtoken("xevadetoken");
	this.movelog("E");
	this.show();
    },
    addevade: function(n) { 
	this.addevadetoken(); 
	this.endaction(n,"EVADE");
    },
    addfocustoken: function() {
	this.focus++;
	this.animateaddtoken("xfocustoken");
	this.movelog("FO");
	this.show();
    },
    addtractorbeam:function(upg) {
	var u=upg.unit;
	this.addtractorbeamtoken();
	this.wrap_after("getagility",upg,function(a) {
	    if (a>0) return a-1; else return a;
	}).unwrapper("endphase");
	if (this.tractorbeam==1) {
	    p=Unit.prototype.getrollmatrix.call(this,this.m).concat(this.getpathmatrix(this.m,"F1"));
	    u.doselection(function(n) {
		u.resolveactionmove.call(
		    this,p,
		    function (t,k) { t.endnoaction(n,"BOOST"); },true,true);
	    }.bind(this));
	}
    },
    addtractorbeamtoken: function() {
	this.tractorbeam++;
	this.movelog("TB");
	this.show();
    },
    removetractorbeamtoken: function() {
	this.tractorbeam--;
	this.movelog("tb");
	this.show();
    },
    addfocus: function(n) { 
	this.addfocustoken(); 
	this.endaction(n,"FOCUS");
    },
    addstress: function() {
	this.stress++;
	this.animateaddtoken("xstresstoken");
	this.movelog("ST");
	this.show();
    },
    addiontoken: function() {
	this.ionized++;
	this.animateaddtoken("xionizedtoken");
	this.movelog("I");
	this.show();
    },
    removeiontoken: function() {
	this.ionized--;
	this.animateremovetoken("xionizedtoken");
	this.movelog("i");
	this.show();
   },
    dies: function() {
	var i;

	this.movelog("d-0");
	$("#"+this.id).attr("onclick","");
	$("#"+this.id).addClass("dead");
	$("#"+this.id).html(""+this)
	i=squadron.indexOf(this);
	for (i in squadron) {
	    if (squadron[i]==this) {
		delete squadron[i]; break;
	    }
	}
	filltabskill();
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
	this.g.attr({display:"none"});
	this.imgsmoke.attr("display","none");
	this.imgflame.attr("display","none");
	if (this.islarge) this.imgexplosion= s.image("png/explosion3.gif",-80,-80,160,160);
	else this.imgexplosion= s.image("png/explosion3.gif#"+Math.random(),-40,-40,80,80);
	this.geffect.add(this.imgexplosion);
	this.show();
	SOUNDS.explode.play();
	this.dead=true;
	
	this.log("has exploded!");
	setTimeout(function(){ 
	    //this.m=MT(-60,-60);
	    this.geffect.attr({display:"none"});
	    this.show();
	    if (TEAMS[this.team].checkdead()) win();	
	    //squadron[0].select();
	}.bind(this), 1000); // 29 images * 4 1/100th s
    },
    canbedestroyed: function() {
	if (skillturn!=this.getskill()) return true;
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
    cancelhit:function(r,sh){
	var h=FCH_hit(r.ch);
	if (h>=r.e) return {ch:r.ch-r.e*FCH_HIT,e:0}; 
	else return {ch:r.ch-h*FCH_HIT, e:r.e-h};
    }, 
    cancelcritical:function(r,sh) {
	var c=FCH_crit(r.ch);
	if (c>=r.e) return {ch:r.ch-r.e*FCH_CRIT,e:0}; 
	else return {ch:r.ch-c*FCH_CRIT, e:r.e-c};
    },
    evadeattack: function(sh) {
	var e=getdefenseresult();
	var ch=sh.weapons[sh.activeweapon].modifydamagegiven(getattackresult());
	displayattackroll(getattackdice(),ch);
	var r=this.cancelhit({ch:ch,e:e},sh);
	r=this.cancelcritical(r,sh);
	if (typeof r=="undefined") this.error("undefined cancel critical");
	return r.ch;
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
	$(".fireline").remove();
	this.playfiresnd();
	var ch=targetunit.evadeattack(this);
	ch=this.weapons[this.activeweapon].modifydamageassigned(ch,targetunit);
	ch=targetunit.modifydamageassigned(ch,this);
	TEAMS[this.team].allred+=getattackdice();
	TEAMS[targetunit.team].allgreen+=getdefensedice();
	TEAMS[this.team].allhits+=FCH_hit(ch);
	TEAMS[this.team].allcrits+=FCH_crit(ch);
	TEAMS[targetunit.team].allevade+=FE_evade(getdefenseresult());
	var c=FCH_crit(ch);
	var h=FCH_hit(ch);
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
	targetunit.endbeingattacked(c,h,this);
	this.weapons[this.activeweapon].endattack(c,h);
	this.usedweapon=this.activeweapon;
	this.endattack(c,h);
	if (targetunit.canbedestroyed(skillturn)) targetunit.checkdead();
	this.cleanupattack();
    },
    cleanupattack: function() {
	this.actionbarrier();
    },
    endround: function() {
	for (var i=0; i<this.upgrades.length; i++) 
	    this.upgrades[i].endround();
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
	this.movelog("f-"+targetunit.id+"-"+this.activeweapon);
	if (typeof this.weapons[this.activeweapon]!="undefined" && typeof this.weapons[this.activeweapon].firesnd!="undefined") 
	    SOUNDS[this.weapons[this.activeweapon].firesnd].play();
	else SOUNDS[this.ship.firesnd].play();		
    },
    endattack: function(c,h) {
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	this.show();
    },
    endbeingattacked: function(c,h,t) {
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
	
	for (j in squadron) {
	    var u=squadron[j];
	    if (u.team!=this.team) {
		var a=0;
		//var old=u.m;
		//u.m=u.meanm;
		//console.log(u.name+" "+u.m);
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
		//u.m=old;
		n++;
		
	    }
	}
	NOLOG=false;
	//this.log("  >"+attack+" "+attackenemy+" "+(dist/n));
	return attack - attackenemy - (dist/n) ;
    },
    evaluatemoves: function(withcollisions,withobstacles) {
	this.meanmround=round;
	var gd=this.getdial();
	var mx=0,my=0,ma=0;
	var g=0;
	var i;
	var cmax=function(a,b) {
	    if (a==BLACK||a==RED||(a==YELLOW&&(b==GREEN||b==WHITE))||(a==WHITE&&b==GREEN))
		return a;
	    return b;
	}
	var cmin=function(a,b) {
	    if (cmax(a,b)==a) return b;
	    return a;
	}
	NOLOG=false;
	var ref=(this.m.split().rotate+360+180)%360-180;

	for (i=0; i<gd.length; i++) {
	    var next=[];
	    var mm = this.getpathmatrix(this.m,gd[i].move);
	    gd[i].m=mm;
	    if (!this.canreveal(gd[i])) gd[i].color=BLACK; 
	    else {
		var c=RED;
		gd[i].color=this.getmovecolor(mm,withcollisions,withobstacles);
		if (gd[i].color!=RED&&gd[i].color!=BLACK&&withcollisions&&withobstacles) {
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
	    if ((gd[i].color==GREEN||gd[i].color==WHITE)&&!gd[i].move.match(/K\d|SR\d|SL\d|TRL\d|TRR\d/)) {
		var gpm=mm.split();
		g++;
		gpm.rotate=(gpm.rotate-ref+180)%360-180;
		mx+=gpm.dx; my+=gpm.dy; ma+=gpm.rotate;
	    }
	}
	if (g==0) g=1;
	mx=mx/g; my=my/g; ma=ma/g;
	//this.log("ROTATE >"+(ma+ref));
	this.meanm= (new Snap.Matrix()).translate(mx,my).rotate(ma+ref,0,0);
	NOLOG=false;
    },
    removetarget: function(t) {
	var n;
	n=t.istargeted.indexOf(this);
	if (n>-1) t.istargeted.splice(n,1);
	n=this.targeting.indexOf(t);
	this.targeting.splice(n,1);
	this.movelog("t-"+t.id);
	t.show();
	this.show();
	if (this.targeting.length==0) $("#atokens > .xtargettoken").remove();
    },
    removeevadetoken: function() { this.animateremovetoken("xevadetoken"); this.evade--; this.movelog("e"); this.show();},
    removefocustoken: function() { this.animateremovetoken("xfocustoken"); this.focus--; this.movelog("fo"); this.show();},
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    for (i=0; i<this.pos.length; i++) this.pos[i].ol.remove();
	    if (automove) {
		var gpm=m.split();
		var tpm=this.m.split();
		s.path("M "+tpm.dx+" "+tpm.dy+" L "+gpm.dx+" "+gpm.dy).attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",strokeLinecap:"round",strokeDasharray:"1, 30",opacity:0.2,fill:"rgba(0,0,0,0)"}).addClass("trace").appendTo(VIEWPORT);
		this.m=m;
	    }
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    if (typeof OBSTACLES[mine[i]].detonate=="function") 
			OBSTACLES[mine[i]].detonate(this)
		    else {
			this.log("colliding with obstacle");
			this.resolveocollision(1,0);
		    }
		}
	    if (automove) {
		var gpm=m.split();
		this.movelog("am-"+Math.floor(300+gpm.dx)+"-"+Math.floor(300+gpm.dy)+"-"+Math.floor((360+Math.floor(gpm.rotate))%360));
	    }
	    f(this,k);
	    this.show();
	}.bind(this);
	if (typeof possible=="undefined") possible=false;
	for (i=moves.length-1; i>=0; i--) {
	    var c=this.getmovecolor(moves[i],true,true);
	    if ((possible&&(c==YELLOW||c==RED))||c==GREEN) {
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
		    p.ol.touchend(function() { resolve(moves[this.pos[i].k],this.pos[i].k,cleanup); }.bind(this));
		    }.bind(this))(i);
	    }
	} else resolve(this.m,-1,cleanup);
    },
    resolveactionselection: function(units,cleanup) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(k) {
	    for (i=0; i<units.length; i++) {
		units[i].outline.removeClass("outline");
		units[i].outline.attr({fill:"rgba(8,8,8,0.5)"});
		units[i].setdefaultclickhandler();
	    }
	    cleanup(k);
	}.bind(this);
	if (units.length==0) resolve(-1);
	else if (units.length==1) resolve(0);
	else for (i=0; i<units.length; i++) {
	    units[i].outline.attr({fill:"rgba(100,100,100,0.8)"});
	    units[i].outline.addClass("outline");
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
    removecloaktoken: function() {
	this.agility-=2; 
	this.iscloaked=false;
	this.movelog("ct");
	SOUNDS.decloak.play();
    },
    resolvedecloak: function() {
	//this.log("do selection resolvedecloak");
	this.doselection(function(n) {
	    this.resolveactionmove(this.getdecloakmatrix(this.m),
				   function (t,k) {
				       if (k>0) this.removecloaktoken();
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
	p=[m0.clone().translate(0,-20),
	   m0,
	   m0.clone().translate(0,20),
	   m1.clone().translate(0,-20),
	   m1,
	   m1.clone().translate(0,20)];
	if (this.islarge) 	p=p.concat([m0.clone().translate(0,-40),
				   m0.clone().translate(0,40),
				   m1.clone().translate(0,-40),
				   m1.clone().translate(0,40)]);
	return p;
	
    },
    resolveroll: function(n) {
	this.resolveactionmove(this.getrollmatrix(this.m),
	    function(t,k) { t.endaction(n,"ROLL");},true,false);
    },
    boundtargets:function(sh) {
	if (this.targeting.indexOf(sh)>-1) return true;
	for (var i=this.targeting.length-1; i>=0; i--) this.removetarget(this.targeting[i]);
	return false;
    },
    addtarget: function(sh) {
	if (this.boundtargets(sh)) return;
	this.targeting.push(sh);
	this.animateaddtoken("xtargettoken");
	sh.istargeted.push(this);
	sh.animateaddtoken("xtargetedtoken");
	this.movelog("T-"+sh.id);
	sh.show();
	this.show();
    },
    gettargetableunits: function(n) {
	var p=[];
	var i;
	for (i in squadron) {
	    if (squadron[i].team!=this.team
		&&this.getrange(squadron[i])<=n) {
		    p.push(squadron[i]);
	    }
	}
	return p;
    },
    selectnearbyunits: function(n,f) {
	var p=[];
	for (var i in squadron) {
	    if (f(this,squadron[i])&&(this.getrange(squadron[i])<=n)) p.push(squadron[i]);
	}
	return p;
    },
    selectnearbyally: function(n,f) {
	return this.selectnearbyunits(n,function(s,t) {
	    var b=true;
	    if (typeof f=="function") b=f(s,t);
	    return s.team==t.team&&s!=t&&b; });
    },
    selectnearbyenemy: function(n) {
	return this.selectnearbyunits(n,function(s,t) { 
	    return s.team!=t.team; });
    },
    resolvetargetnoaction: function(n,noaction) {
 	var p=this.gettargetableunits(3);
	//this.log("select target to lock");
	this.resolveactionselection(p,function(k) { 
	    if (k>=0) this.addtarget(p[k]);
	    if (noaction==true) this.endnoaction(n,"TARGET"); else this.endaction(n,"TARGET");
	}.bind(this));
   },
    resolvetarget: function(n) {
	this.resolvetargetnoaction(n,false);
    },
    addcloaktoken: function() {
	this.iscloaked=true;
	this.agility+=2;
	this.movelog("CT");
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
	this.wrap_after("canfire",this,function() { return false;});
	this.wrap_after("endmaneuver",this,function() {
	    this.endaction(n,"SLAM");
	    this.endmaneuver.unwrap();
	    this.canfire.unwrap();
	});

	this.resolveactionmove(p,function(t,k) {
	    this.maneuver=q[k];
	    this.resolvemaneuver();
	}.bind(this),false,true);
    },
    enqueueaction: function(callback,org) {
	actionr.push($.Deferred());
	var n=actionr.length-1;
	if (typeof org=="undefined") org="undefined";
	//this.log("enqueueaction "+n+":"+org.name);
	actionr[n-1].done(function() { 
	    //this.log("|| "+n+" execute"); 
	    callback(n) 
	}.bind(this));
	return actionr[n];
    },
    endnoaction: function(n,type) {
	this.show();
	//this.log("*** "+n+" "+(actionr.length-1));
	actionr[n].resolve(type);
	//this.log("n="+n+" "+(actionr.length-1));
	if (n==actionr.length-1) actionrlock.resolve();
    },
    endaction: function(n,type) {
	//this.log("endaction "+n+" "+type);
	if (phase==ACTIVATION_PHASE) $("#activationdial").show();
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
    getresultmodifiers: function(m,n,from,to) {
	var str="";
	var i,j;
	/* TODO: n,m should be removed */

	var getmod=function(a,i) {
	    var cl=a.str+(from==DEFENSE_M?"modtokend":"modtokena");
	    if (typeof a.token!="undefined") cl="x"+a.str+"token";
	    var e=$("<td>").addClass(cl).attr({id:"mod"+i,title:"modify roll ["+a.org.name+"]"}).html("");
		// should be from /to instead of just to.
	    e.click(function() { modroll(this.f,i,to); }.bind(a));
	    return e;
	};
	var getadd=function(a,i) {
	    var cl=a.str+(from==DEFENSE_M?"modtokend":"modtokena");
	    if (typeof a.token!="undefined") cl="x"+a.str+"token";
	    var e=$("<td>").addClass(cl).attr({id:"mod"+i,title:"add result ["+a.org.name+"]"}).html("");
		// should be from /to instead of just to.
	    e.click(function() { addroll(this.f,i,to); }.bind(a));
	    return e;
	}
	var getreroll=function(a,i) {
	    var n=a.n();
	    var s="R"+n;
	    var cl="tokens";
	    if (a.str) { cl="x"+a.str+"token"; s=""; }
	    var e=$("<td>").addClass(cl).attr({id:"reroll"+i,title:n+" rerolls["+a.org.name+"]"}).html(s);
	    e.click(function() { if (typeof a.f=="function") a.f(); 
				 reroll(n,(to==ATTACK_M),a,i); });
	    return e;
	};
	var mods=this.getdicemodifiers(); 
	var lm=[];
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to) {
		if (d.type==MOD_M&&d.req(m,n)) lm.push(getmod(d,i));
		if (d.type==ADD_M&&d.req(m,n)) lm.push(getadd(d,i)); 
		// should be from /to instead of just to.
		if (d.type==REROLL_M&&d.req(activeunit,activeunit.weapons[activeunit.activeweapon],targetunit)) lm.push(getreroll(d,i)); 
	    }
	}
	return lm;

    },
    addhasfired: function() { this.hasfired++; },
    resolveattack: function(w,targetunit) {
	var i;
	var r=this.gethitrange(w,targetunit);
	this.addhasfired();
	this.hasdamaged=false;
	displaycombatdial();
	var bb=targetunit.g.getBBox();
	var start=transformPoint(this.m,{x:0,y:-(this.islarge?40:20)});
	s.path("M "+start.x+" "+start.y+" L "+(bb.x+bb.w/2)+" "+(bb.y+bb.h/2))
	    .appendTo(VIEWPORT)
	    .attr({stroke:this.color,
		   strokeWidth:2,
		   strokeDasharray:100,
		   "class":"animated fireline"});
	//this.log("resolveattack:"+attack+"/"+defense);
	this.select();	
	for (i in squadron) if (squadron[i]==this) break;
	this.preattackroll(w,targetunit);
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
	displayattackroll(ar,da);
	this.ar=ar; this.da=da;
	displayattacktokens(this,function() {
	    targetunit.defenseroll(defense).done(function(r) {
		targetunit.dodefenseroll(r.roll,r.dice,me,n);
	    });
	});
    },
    dodefenseroll: function(dr,dd,me,n) {
	var i,j;
	this.dr=dr; this.dd=dd;
	displaydefenseroll(dr,dd);
	displaydefensetokens(this,function() {
	    this.resolvedamage();
	    this.endnoaction(n,"incombat");
	}.bind(squadron[me]));
    },
    drawpathmove:function(mm,path,lenC) {
	if (this.islarge) {
	    var m=mm.clone();
	    s.path('M 0 0 l 0 -20')
		.transform(m)
		.appendTo(VIEWPORT)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace");
	    var p=s.path(path.getSubpath(0,lenC-40)).attr("display","none");
	    p.clone()
		.transform(m.translate(0,-20))
		.appendTo(VIEWPORT)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace");
	    s.path('M 0 0 l 0 -20')
		.transform(this.getmatrixwithmove(mm,p,lenC-20))
		.appendTo(VIEWPORT)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace");
	} else {
	    s.path(path.getSubpath(0,lenC))
		.transform(mm)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace")
		.appendTo(VIEWPORT);

	}	    
	this.show();
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
	if (this.stress>0) {
	    this.stress--;
	    this.animateremovetoken("xstresstoken");
	}
	this.movelog("st");
	this.show();
    },
    handledifficulty: function(difficulty) {
	if (difficulty=="RED") {
	    this.addstress();
	} else if (difficulty=="GREEN" && this.stress>0) {
	    this.removestresstoken();
	}
    },
    completemaneuver: function(dial,difficulty,halfturn) {
	var path=P[dial].path;
	var m,oldm;
	if (dial=="F0") {
	    //this.log("performing F0");
	    this.hasmoved=true;
	    this.handledifficulty(difficulty);
	    this.lastmaneuver=this.maneuver;
	    this.endmaneuver();
	    this.touching=[];
	    return;
	}
	var lenC = path.getTotalLength();
	this.collision=false; // Any collision with other units ?
	this.showhitsector(false);
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
	this.drawpathmove(this.m,path,lenC);
	
	// Handle collision: removes old collisions
	for (i=0; i<this.touching.length; i++) {
	    var sh=this.touching[i];
	    sh.touching.splice(sh.touching.indexOf(this),1);
	}
	this.touching=col;
	
   
	this.ocollision=this.getocollisions(oldm,m,path,lenC);
	if (this.isfireobstructed()) { this.log("overlaps obstacle: no action, cannot attack"); }
	if (this.ocollision.template.length>0) { this.log("template overlaps obstacle: no action"); }
	if (lenC>0) this.m=m;
	var turn=0;
	// Animate movement
	if (lenC>0) {
	    this.hasmoved=true;
	    $("#activationdial").empty()
	    SOUNDS[this.ship.flysnd].play();
	    Snap.animate(0, lenC, function( value ) {
		m = this.getmatrixwithmove(oldm,path,value);
		this.g.transform(m);
		this.geffect.transform(m);
	    }.bind(this), TIMEANIM*lenC/200,mina.linear, function(){
		if (!this.collision) { 
		    // Special handling of K turns: half turn at end of movement. Straight line if collision.
		    if (dial.match(/K\d|SR\d|SL\d/)||halfturn==true) {
			this.m.rotate(180,0,0);
			turn=180;
		    } else if (dial.match(/TRL\d/)) {
			this.m.rotate(-90,0,0);
			turn=-90;
		    } else if (dial.match(/TRR\d/)) {
			this.m.rotate(90,0,0);
			turn=90;
		    } else {
		    }
		} 
		else { 
		}
		this.movelog("m-"+dial+"-"+(360+turn)%360+"-"+Math.floor(lenC));
		this.handledifficulty(difficulty);
		this.lastmaneuver=this.maneuver;
		//path.remove();
		if (this.ocollision.overlap>-1||this.ocollision.template.length>0) 
		    this.resolveocollision(this.ocollision.overlap,this.ocollision.template.length);
		if (this.ocollision.mine.length>0) 
		    for (i=0; i<this.ocollision.mine.length; i++) {
			this.ocollision.mine[i].detonate(this)
		    }
		if (this.collision) this.resolvecollision();
		this.endmaneuver();
	    }.bind(this));
	} else {
	    this.hasmoved=true;
	    this.log("cannot move");
	    this.handledifficulty(difficulty);
	    this.lastmaneuver=this.maneuver;
	    //path.remove();
	    if (this.collision) this.resolvecollision();
	    this.endmaneuver();
	}
    },
    getmaneuverlist: function() {
	var m=this.getmaneuver();
	var rm={};
	rm[m.move]=m;
	if (typeof m!="undefined") return rm;
	return {};
    },
    resolvemaneuver: function() {
	$("#activationdial").empty();
	// -1: No maneuver
	if (this.maneuver<0) return;
	var p=[],q=[];
	var ml=this.getmaneuverlist();
	for (var i in ml) {
	    q.push(ml[i]);
	    p.push(this.getpathmatrix(this.m,ml[i].move));
	}
	this.resolveactionmove(p,function(t,k) {
	    if (k==-1) k=0;
	    var dial=q[k].move;
	    var difficulty=q[k].difficulty;
	    if (q[k].halfturn!=true) q[k].halfturn=false; 
	    this.completemaneuver(dial,difficulty,q[k].halfturn);
	}.bind(this), false,true);
    },
    endmaneuver: function() {
	if (this.removeionized==true) this.ionized=0;
	this.removeionized=false;
	this.maneuver=-1;
	this.hasmoved=true;
	this.show();
	if (this.checkdead()) { this.hull=0; this.shield=0; } 
	else this.doendmaneuveraction();
	//this.log("endmaneuver");
	this.cleanupmaneuver();
    },
    cleanupmaneuver: function() {
	this.actionbarrier();
    },
    unlock:function(v) {
	//this.log("unlock");
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
    candoendmaneuveraction: function() { 
	return this.candoaction()
	    &&!this.collision
	    &&this.ocollision.template.length==0
	    &&this.ocollision.overlap==-1; },
    doendmaneuveraction: function() {
	if (this.candoendmaneuveraction()) return this.doaction(this.getactionlist());
	this.action=-1; this.actiondone=true;
	return this.deferred.resolve();
    },
    doselection: function(f,org) {
	return this.enqueueaction(function(n) {
	    f(n);
	}.bind(this),org);  
    },
    doaction: function(list,str) {
	if (list.length==0) {
	    this.log("no action available");
	    return this.enqueueaction(function(n) {
		this.endnoaction(n);
	    }.bind(this),this.name);
	} 
	return this.enqueueaction(function(n) {
	    var i;
	    $("#actiondial").empty();
	    if (this.candoaction()) {
		this.select();
 		if (typeof str!="undefined"&&str!="") this.log(str);
		$("#actiondial").html($("<div>"));
		for (i=0; i<list.length; i++) {
		    if (this.actionsdone.indexOf(list[i].name)==-1) {
			(function(k,h) {
			    var e=$("<div>").addClass("symbols").text(A[k.type].key)
				.click(function () { this.resolveaction(k,n) }.bind(this));
			    e.attr("title",list[i].name);
			    if (list[i].name.slice(-2)=="/2") {
				e.css("color","yellow");
			    }
			    $("#actiondial > div").append(e);
			}.bind(this))(list[i],i);
		    }
		}
		var e=$("<button>").addClass("m-skip").click(function() { this.resolveaction(null,n); }.bind(this));
		$("#actiondial > div").append(e);
	    } else this.endaction(n);
	}.bind(this),list[0].name);  
    },
    donoaction: function(list,str,noskip) {
	return this.enqueueaction(function(n) {
	    var i;
 	    if (typeof str!="undefined"&&str!="") this.log(str);
	    this.select();
	    $("#actiondial").html($("<div>"));
	    for (i=0; i<list.length; i++) {
		(function(k,h) {
		    //log("type : "+k.type);
		    var e=$("<div title='"+k.name+"'>").addClass("symbols").text(A[k.type].key)
			.click(function () { this.resolvenoaction(k,n) }.bind(this));
		    $("#actiondial > div").append(e);
		}.bind(this))(list[i],i);
	    }
	    if (noskip==true) {
		var e=$("<button>").addClass("m-skip").click(function() { this.resolvenoaction(null,n); }.bind(this));
		$("#actiondial > div").append(e);
	    }
	}.bind(this),list[0].name);  
    },
    candoaction: function() {
	return this.stress==0;
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
	var p=this.weapons[wp].getenemiesinrange();
	if (p.length==0) {
	    this.log("no target for %0",this.weapons[wp].name);
	    this.cleanupattack();
	    return false;
	} else {
	    $("#attackdial").empty();
	    this.selectunit(p,function(p,k) {
		this.declareattack(wp,p[k]); 
		this.resolveattack(wp,p[k]);
	    },[""],false);
	}
	return true;
    },
    showattack: function(forced) {
	var str="";
	var wn=[];
	var i,j,w;
	$("#attackdial").hide();
	if (forced==true || (phase==COMBAT_PHASE&&skillturn==this.getskill())) {
	    if (this.canfire()) {
		var r=this.getenemiesinrange();
		$("#attackdial").empty();
		for (w=0; w<this.weapons.length; w++) if (r[w].length>0) wn.push(w);
		for (i=0; i<wn.length; i++) {
		    var w=A[this.weapons[wn[i]].type.toUpperCase()];
		    str+="<div class='symbols "+w.color+"' onclick='activeunit.selecttargetforattack("+wn[i]+")'>"+w.key+"</div>"
		}
		// activeunit.hasfired++ ?
		str+="<button class='m-skip' onclick='activeunit.hasfired++;activeunit.show();activeunit.unlock();'></button>";
		$("#attackdial").html("<div>"+str+"</div>").show();
	    } else if (!this.hasfired) {
		//this.log("showattack, has not fired");
		this.hasfired++; this.unlock(); 
	    } //else this.log("showattack, no fire, has fired");
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
	return (this.lastdrop!=round&&this.getskill()==skillturn);
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
	for (var i=0; i<lm.length; i++) {
	    p.push(this.getpathmatrix(this.m.clone().rotate(180,0,0),lm[i]).translate(0,(this.islarge?40:20)-size))
	}
	return p;
    },
    bombdropped: function() {},
    updateactivationdial: function() {
	var self=this;
	this.activationdial=[];
	if (this.candropbomb()&&this.ionized!=0) {
	    this.log("ionized, cannot drop bombs");
	}
	if (this.candropbomb()&&this.ionized==0) {
	    switch(this.bombs.length) {
	    case 3: if (this.bombs[2].canbedropped()) 
		this.addactivationdial(
		    function() { return self.bombs[2].canbedropped(); },
		    function() { self.doselection(function(n) {
			self.bombs[2].actiondrop(n);
		    })}, A["BOMB"].key,
		    $("<div>").attr({class:"symbols",title:self.bombs[2].name}));
	    case 2:if (this.bombs[1].canbedropped()) 
		this.addactivationdial(
		    function() { return self.bombs[1].canbedropped(); },
		    function() { self.doselection(function(n) {
			self.bombs[1].actiondrop(n);
		    })}, A["BOMB"].key,
		    $("<div>").attr({class:"symbols",title:self.bombs[1].name}));
	    case 1:if (this.bombs[0].canbedropped()) 
		this.addactivationdial(
		    function() { return self.bombs[0].canbedropped(); },
		    function() { self.doselection(function(n) {
			self.bombs[0].actiondrop(n);
		    })}, A["BOMB"].key,
		    $("<div>").attr({class:"symbols",title:self.bombs[0].name}));
	    }
	}
	return this.activationdial;
    },
    doactivation: function() { this.showactivation(); },
    showactivation: function() {
	$("#activationdial").html("<div></div>");
	if (!this.timeformaneuver())  return;
	var ad=this.updateactivationdial();
	for (var i=0; i<ad.length; i++) {
	    (function(k) {
		var adi=ad[k];
		if (adi.pred()) { 
		    adi.elt.appendTo("#activationdial > div").click(function() { 
			$("#activationdial").html("<div></div>");
			adi.action();
		    }).html(adi.html);
		}
	    })(i);
	}
	$("<button>").addClass("m-move").click(function() { this.resolvemaneuver(); }.bind(this)).appendTo("#activationdial > div");

    },
    movelog: function(s) {
	//console.log("REGISTER:"+this.id+"-"+s)
	ANIM+="_"+this.id+"-"+s
    },
    computepoints: function() {
    },
    error: function(str) {
	str=formatstring(str);
	log("<div><span style='color:red;font-weight:bold;'>**ERROR** ["+this.name+"]</span> "+str+"</div>");	
    },
    log: function(str,a,b,c) {
	if (NOLOG) return;
	if (typeof UI_translation[str]!="undefined") str=UI_translation[str];
	if (typeof a=="string") a=translate(a);
	str=str.replace(/%0/g,a)
	if (typeof b=="string") b=translate(b);
	str=str.replace(/%1/g,b)
	if (typeof c=="string") c=translate(c);
	str=str.replace(/%2/g,c)
	str=formatstring(str);
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
	var i=0;
	if (this.focus>0) {
	    this.infoicon[i++].attr({text:A.FOCUS.key,fill:A.FOCUS.color});}
	if (this.evade>0) {
	    this.infoicon[i++].attr({text:A.EVADE.key,fill:A.EVADE.color});}
	if (this.iscloaked==true) {
	    this.infoicon[i++].attr({text:A.CLOAK.key,fill:A.CLOAK.color});}
	if (this.targeting.length>0&&i<6) {
	    this.infoicon[i++].attr({text:A.TARGET.key,fill:A.TARGET.color});}
	if (this.istargeted.length>0) {
	    this.infoicon[i++].attr({text:A.ISTARGETED.key,fill:A.ISTARGETED.color});}
	if (this.stress>0&&i<6) {
	    this.infoicon[i++].attr({text:A.STRESS.key,fill:A.STRESS.color});}
	if (this.ionized>0&&i<6) {
	    this.infoicon[i++].attr({text:"Z",fill:A.STRESS.color});}
	if (this.tractorbeam>0&&i<6) {
	    this.infoicon[i++].attr({text:"T",fill:A.STRESS.color});}
	for (var j=i; j<6; j++) {
	    this.infoicon[i++].attr({text:""});}	    
    },
    showoutline: function() {
        this.outline.attr({ stroke:((activeunit==this)?this.color:halftone(this.color)) }); 
    }, 
    dock:function(parent) {
	this.isdocked=true;
	$("#"+this.id).attr("onclick","");
	$("#"+this.id).addClass("docked");
	$("#"+this.id).html(""+this);
	this.g.attr({display:"none"});
	this.geffect.attr({display:"none"});
	this.log("docked on %0",parent.name);
	this.show();
	parent.docked=this;
    },
    deploy: function(parent,dm) {
	this.movelog("DPY");
	$("#"+this.id).removeClass("docked");
	$("#"+this.id).html(""+this)
	$("#"+this.id).click(function() { this.select(); }.bind(this));
	this.g.attr({display:"block"});
	this.geffect.attr({display:"block"});
	this.m=parent.m.clone();
	this.isdocked=false;
	this.log("deploying from %0",parent.name);
	this.show();
	parent.docked=null;
	this.log("select maneuver for deployment");
	//this.wrap_after("timeformaneuver",this,function() { return true; }).unwrapper("endcombatphase");
	//this.wrap_after("canfire",this,function(t) { return false; }).unwrapper("endcombatphase");
	parent.doselection(function(n) {
	    this.resolveactionmove(dm,function(t,k) {
		var half=this.getdial().length;
		if (k>=half) { this.m.translate(0,-20); k=k-half; }
		else this.m.translate(0,20).rotate(180,0,0);
		this.maneuver=k;
		this.resolvemaneuver();
		//this.show();
	    }.bind(this),false,true);
	    parent.endnoaction(n,"DEPLOY");
	}.bind(this));
    },
    endcombatphase:function() { $(".fireline").remove(); },
    endphase: function() { this.tractorbeam=0;},
    beginplanningphase: function() {
	this.actionsdone=[];
	return this.newlock();
    },
    beginactivationphase: function() {
	return this.newlock();
    },
    timetoshowmaneuver: function() {
	return this.maneuver>-1;
    },
    getmaneuver: function() {
	if (this.ionized>0) {
	    return {move:"F1",difficulty:"WHITE"};
	}
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
    clearmaneuver: function() {
	this.dialspeed.attr({text:""});
	this.dialdirection.attr({text:""});
    },
    beginactivation: function() {
	if (this.ionized>0) this.removeionized=true;
	this.showmaneuver();
	this.show();
    },
    endactivationphase: function() {
    },
    begincombatphase: function() {
        return this.newlock();
    },
    beginattack: function() { },
    toString: function() {
	if (phase==SELECT_PHASE||phase==CREATION_PHASE) return this.toString2();
	var i;
	var n=8;
	i = squadron.indexOf(this);
	if (i==-1) str="<div class='dead '>"; 
	else if (this.isdocked) str="<div class='docked'>"; else str="<div>";
	n+=this.upgrades.length*2;
	if (this.hull+this.shield<=n) {
	    str+="<div class='outoverflow stat'>";
	    str+="<div class='hull'>"+repeat("u ",this.hull)+"</div>";
	    str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
	} else {
	    if (this.hull>n) {
		str+="<div class='outoverflow stat'>";
		str+="<div class='hull'>"+repeat("u ",n)+"</div></div>";
		if (this.hull<=n*2) {
		    str+="<div class='outoverflow stat2'>";
		    str+="<div class='hull'>"+repeat("u ",this.hull-n)+"</div>";
		    if (this.shield+this.hull<=n*2) 
			str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
		    else { 
			str+="<div class='shield'>"+repeat("u ",n*2-this.hull)+"</div></div>";
			str+="<div class='outoverflow stat3'>";
			str+="<div class='shield'>"+repeat("u ",this.shield-n*2+this.hull)+"</div></div>";
		    }
		} else {
		    str+="<div class='outoverflow stat2'><div class='hull'>"+repeat("u ",n)+"</div></div>";
		    str+="<div class='outoverflow stat3'><div class='hull'>"+repeat("u ",this.hull-n*2)+"</div>";
		    str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
		}
	    } else { // No more than 8 shields ? 
		str+="<div class='outoverflow stat'><div class='hull'>"+repeat("u ",this.hull)+"</div>";
		str+="<div class='shield'>"+repeat("u ",n-this.hull)+"</div></div>";
		str+="<div class='outoverflow stat2'><div class='shield'>"+repeat("u ",this.shield-n+this.hull)+"</div></div>";
	    }    
	}
	str+="<div><div class='statskill'>"+this.getskill()+"</div>";
	t=formatstring(getpilottexttranslation(this.name,this.faction));
	str+="<div class='name'>";
	if (t!="") str+="<div class='tooltip outoverflow'><span>"+t+"</span></div>"
	str+="<div>"+translate(this.name)+"</div></div>";
	text=SHIP_translation[this.ship.name];
	if (typeof text=="undefined") text=this.ship.name;
	str+="<div><div style='font-size:smaller'><code class='"+this.faction+"'></code>&nbsp;"+text+"</div></div>";
	str+="<div><div>";
	if (i>-1) str+="<div><table style='width:100%'><tr style='width:100%'>"+this.getusabletokens()+"</tr></table></div>";
	str+="</div></div>";
	var a;
	var b;
	var strw="",stru="",strc="";
	
	a="<td><button class='statevade' onclick='if (!squadron["+i+"].dead&&!squadron["+i+"].isdocked) squadron["+i+"].togglerange();'>"+this.getagility()+"<span class='symbols'>^</span></button></td>";
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
	    $("#unit"+this.id+" .shipimg").html(this.getstatstring());
	    $("#unit"+this.id+" .shipimg").css("background-image",
					       "url(png/"+this.shipimg+")");
	} else {
	    if (typeof this.skillbar=="undefined") {
		console.trace();
		this.error("undefined skillbar?");
		return;
	    }
	    this.skillbar.attr({text:repeat('u',this.getskill())});
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
	return (this==activeunit&&this.maneuver>-1&&!this.hasmoved&&this.getskill()==skillturn&&subphase==ACTIVATION_PHASE);
    },
    show: function() {
	var i;
	if (phase==CREATION_PHASE) {
	    $("#unit"+this.id).html(this.toString2());
	    return;
	}
	if (typeof this.g=="undefined") return;

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
    showhitsector: function(b,wp) {
        var opacity=(b)?"inline":"none";
	this.select();
	if (!b) {
	    for (i=0; i<this.sectors.length; i++) this.sectors[i].remove();
	    for (i=0; i<this.ranges.length; i++) this.ranges[i].remove();
	    this.ranges=[];
	    this.sectors=[];
	    return;
	}
	if (b==false) return;
	var w=this.weapons[wp];
	var r0=w.getlowrange(), r1=w.gethighrange();
	if (w.isTurret()||this.isTurret(w)) {
	    this.showrange(b,r0,r1);
	} else {
	    var i,k;
	    if (r0==1) {
		for (i=r0;i<=r1; i++) { 
		    this.sectors.push(s.path(this.getPrimarySectorString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof w.auxiliary!="undefined") {
		    var aux=w.auxiliary;
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(aux.call(this,i,this.m.clone())).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		} 
	    } else {
		for (i=r0; i<=r1; i++) {
		    this.sectors.push(s.path(this.getPrimarySubSectorString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof w.subauxiliary!="undefined") {
		    var aux=w.subauxiliary;
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
    togglehitsector: function(w) {
	var b;
	if (this.sectors.length+this.ranges.length>0) b=false; else b=true;
	this.showhitsector(b,w);
    },
    togglerange: function() {
	var b;
	if (this.ranges.length>0) b=false; else b=true;
	this.showrange(b,1,3);
    },
    isPointInside:function(path,op) {
	for (var i=0; i<op.length; i++) 
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
    resolveocollision: function(o,n) {
	var i;
	if (o>-1) n++;
	for (i=0; i<n; i++) {
	    var roll=this.rollattackdie(1)[0];
	    if (roll=="hit") { 
		this.log("+1 %HIT% [collision]"); 
		this.resolvehit(1); 
		this.checkdead(); 
	    }
	    else if (roll=="critical") { 
		this.log("+1 %CRITICAL% [collision]"); 
		this.resolvecritical(1);
		this.checkdead();
	    }
	}
    },
    addshield: function(n) {
	this.movelog("S-"+n);
	if (this.shield<this.ship.shield) this.animateaddtoken("cshield");
	this.shield+=n;
	if (this.shield>this.ship.shield) this.shield=this.ship.shield;
    },
    addhull: function(n) {
	this.movelog("H-"+n);
	if (this.hull<this.ship.hull) this.animateaddtoken("chull");
	this.hull+=n;
	if (this.hull>this.ship.hull) this.hull=this.ship.hull;
    },
    animateremovetoken: function(type) {
	var m=VIEWPORT.m.clone();
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var startX=0;
	var startY=0;
	if (h>w) startY=(h-w)/2;
	else startX=(w-h)/2;
	var max=Math.max(900./w,900./h);
	var bbox=this.g.getBBox();
	var p=$("#svgout").offset();
	var min=Math.min($("#playmat").width(),$("#playmat").height());
	var x=m.x(bbox.x,bbox.y)/max;
	x+=p.left+startX;
	var y=m.y(bbox.x,bbox.y)/max;
	y+=p.top+startY;
	$("<div>").addClass("upanim").css({left:x,top:y}).html("<code class='"+type+"'></code>").appendTo("body").show();
    },
    animateaddtoken: function(type) {
	var m=VIEWPORT.m.clone();
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var startX=0;
	var startY=0;
	if (h>w) startY=(h-w)/2;
	else startX=(w-h)/2;
	var max=Math.max(900./w,900./h);
	var bbox=this.g.getBBox();
	var p=$("#svgout").offset();
	var min=Math.min($("#playmat").width(),$("#playmat").height());
	var x=m.x(bbox.x,bbox.y)/max;
	x+=p.left+startX;
	var y=m.y(bbox.x,bbox.y)/max;
	y+=p.top+startY;
	$("<div>").addClass("downanim").css({left:x,top:y}).html("<code class='"+type+"'></code>").appendTo("body").show();
    },
    removeshield: function(n) {
	if (this.shield>0) this.animateremovetoken("cshield");
	this.shield=this.shield-n;
	this.movelog("s-"+n);
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
	this.showstats();
	return s;
    },
    removehull: function(n) {
	if (this.hull>0) this.animateremovetoken("chull");
	this.hull=this.hull-n;
	this.movelog("h-"+n);
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
    selectunit: function(p,f,astr,cancellable) {
	if (cancellable) p.push(this);
	if (p.length>0) {
	    this.doselection(function(n) {
		if (typeof astr!="undefined") this.log.apply(this,astr);
		this.resolveactionselection(p,function(k) {
		    if (!cancellable||this!=p[k]) f.call(this,p,k);
		    this.endnoaction(n,"SELECT");
		}.bind(this));
	    }.bind(this));
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
			.click(function() { resolve(crits[k],n);}.bind(this));
		    $("#actiondial").append(e);
		}.bind(this))(i);
	    }
	    $("#actiondial").show();
	}.bind(this),"critical");
    },
    selectupgradetodesactivate: function(upglist,self) {
	var resolve=function(u,n) {
	    $("#actiondial").empty();
	    if (u!=null) {
		u.desactivate();
		u.unit.show();
		self.desactivate();
		this.log("desactivating %0 [%1]",u.name,this.name);
	    }
	    this.endnoaction(n,"CREW");
	}.bind(this);
	this.doselection(function(n) {
	    var i,str="";
	    $("#actiondial").empty();
	    for (var i=0; i<upglist.length; i++) {
		(function(k) {
		    var e=$("<button>").text(upglist[k].name)
			.click(function() { resolve(upglist[k],n);});
		    $("#actiondial").append(e);
		}.bind(this))(i);
	    }
	    var e=$("<button>").addClass("m-skip").click(function() { resolve(null,n); });
	    $("#actiondial").append(e);
	    $("#actiondial").show();
	}.bind(this),"upgrade");
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
	    var cr=new Critical(this,s);
	    this.deal(cr,FACEDOWN).then(function(c) {
		switch(c.face) {
		case FACEUP: c.crit.faceup(); this.movelog("c-"+s);
		case FACEDOWN: this.removehull(1); break;
		case DISCARD: this.criticals.slice(this.criticals.indexOf(cr),1);
		}
		this.show();
	    }.bind(this));
	}
    },
    applycritical: function(n) {
	var s,j;
	for (j=0; j<n; j++) {
	    s=this.selectdamage();
	    CRITICAL_DECK[s].count--;
	    var cr=new Critical(this,s);
	    this.deal(cr,FACEUP).then(function(c) {
		switch(c.face) {
		case FACEUP: c.crit.faceup(); this.movelog("c-"+s);
		case FACEDOWN: this.removehull(1); break;
		case DISCARD: this.criticals.slice(this.criticals.indexOf(cr),1);
		}
		this.show();
	    }.bind(this));
	}
    },
    deal: function(crit,face) {
	var dd=$.Deferred();
	return dd.resolve({crit:crit,face:face}).promise();
    },

    gethitrange: function(w,sh) {
	if (sh.team==this.team) return 0;
	var gr=this.weapons[w].getrange(sh);
	return gr;
    },
    getenemiesinrange: function() {
	var str='';
	var k,i;
	var range=[];
	for(i=0; i<this.weapons.length; i++) {
	    range[i]=this.weapons[i].getenemiesinrange();
	}
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
	for (i in squadron) {
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
	//var enemies=[];
	var s=this.getskill();
	for (i in squadron) {
	    var u=squadron[i];
	    var us=u.getskill();
	    u.oldm=u.m;
	    //console.log("setting oldm");
	    if (us<s) {
		if (u.team!=this.team) {
		    if (u.meanmround!=round) u.evaluatemoves(false,false);
		    u.m=u.meanm;
		} else {
		    //Be safe
		    if (typeof u.futurem=="undefined") u.futurem=u.m;
		    u.m=u.futurem;
		}
	    }
	}
	this.evaluatemoves(true,true);
	//console.log(this.name+"end evaluates move");
	//log("computing all enemy positions");
	// Find all possible future positions of enemies
	var k=0;
	/*for (i in squadron) {
	    var u=squadron[i];
	    if (u.team!=this.team) {
		if (u.meanmround!=round) u.evaluatemoves(false,false);
		u.oldm=u.m;
		u.m=u.meanm;
		enemies.push(u);
	    }
	}*/
	var findpositions=function(gd) {
	    var q=[],c,j,i;
	// Find all possible moves, with no collision and with units in range 
	    var COLOR=[GREEN,WHITE,YELLOW];
	    //log("find positions with color "+c);
	    for (i=0; i<gd.length; i++) {
		var d=gd[i];
		if (d.color==BLACK) continue;
		var mm=this.getpathmatrix(this.m,gd[i].move);
		var n=12-4*COLOR.indexOf(d.color);
		if (d.color==RED) n-=20;
		var n0=n;
		var oldm=this.m;
		this.m=mm;
		n+=this.evaluateposition();
		if (d.difficulty=="RED") n=n-1.5;
		//this.log(d.move+" "+d.color+" "+n);
		this.m=oldm;
		//this.log(d.move+":"+n+"/"+n0+" "+d.color);
		q.push({n:n,m:i});
	    }
	    return q;
	}.bind(this);
	q=findpositions(gd);
	// Restore position
	for (i in squadron) squadron[i].m=squadron[i].oldm;
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
	this.futurem=this.getpathmatrix(this.m,gd[d].move);
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
	    if (automove) {
		var gpm=moves[scorei].split();
		var tpm=this.m.split();
		s.path("M "+tpm.dx+" "+tpm.dy+" L "+gpm.dx+" "+gpm.dy).appendTo(VIEWPORT).attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",strokeLinecap:"round",strokeDasharray:"1, 30",opacity:0.2,fill:"rgba(0,0,0,0)"}).addClass("trace");
		this.show();

	    	this.m=moves[scorei]; 
		gpm=this.m.split();
		this.movelog("am-"+Math.floor(300+gpm.dx)+"-"+Math.floor(300+gpm.dy)+"-"+Math.floor((360+Math.floor(gpm.rotate))%360));
	    }
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    if (typeof OBSTACLES[mine[i]].detonate=="function") 
			OBSTACLES[mine[i]].detonate(this)
		    else {
			this.log("colliding with obstacle");
			this.resolveocollision(1,0);
		    }
		}
	    cleanup(this,scorei); 
	}
	else { this.m=old; cleanup(this,-1); }
    },
    timetoshowmaneuver: function() {
	/*if (phase==ACTIVATION_PHASE&&this.maneuver>-1) 
	    this.log("show ? "+(skillturn==this.skill)+" "+this.skill+" "+skillturn);*/
	return this.maneuver>-1 && phase==ACTIVATION_PHASE&&skillturn==this.getskill();
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
	    //p=($.Deferred()).resolve()
	    p=setInterval(function() {
		var m=this.computemaneuver(); 
		IACOMPUTING--;
		if (IACOMPUTING==0) $("#npimg").html("&#10097;");
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
		this.clearmaneuver();
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
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="EVADE"&&this.candoevade()) {
			var noone=true;
			var grlu=this.getenemiesinrange();
			for (i=0; i<grlu.length; i++) 
			    if (grlu[i].length>0) { noone=false; break; }
			if (noone) { a=list[i]; break; }
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
		var a=null;
		for (i=0; i<list.length; i++) {
		    //this.log("action possible:"+list[i].type);
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="CLOAK"&&this.candocloak()) {
			a=list[i]; break;
		    } else if (list[i].type=="EVADE"&&this.candoevade()) {
			var noone=true;
			var grlu=this.getenemiesinrange();
			for (i=0; i<grlu.length; i++) 
			    if (grlu[i].length>0) { noone=false; break; }
			if (noone) { a=list[i]; break; }
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
	//this.log("attack?"+forced+" "+skillturn+" "+this.skill+" "+this.canfire());
	if (forced==true||(phase==COMBAT_PHASE&&skillturn==this.getskill())) {
	    var power=0,t=null;
	    var i,w;
	    if (this.canfire()) {
		NOLOG=true;
		var r=this.getenemiesinrange();
		for (w=0; w<this.weapons.length; w++) {
		    var el=r[w];
		    for (i=0;i<el.length; i++) {
			var p=this.getattackstrength(w,el[i]);
			if (p>power&&!el[i].isdocked) { 
			    //this.log("power "+power+" "+el[i]);
			    t=el[i]; power=p; this.activeweapon=w; 
			}
		    }
		}
		NOLOG=false;
		//this.log("ia/doattack >"+wn[0].name+" "+t.name);
      		if (t!=null) return this.selecttargetforattack(this.activeweapon,t);
		//console.log("ia/doattack "+this.name+"<select target");
	    }
	    //console.log("ia/doattack:no target");
	    this.hasfired++; this.deferred.resolve();
	}
    },
    getresultmodifiers: function(m,n,from,to) {
	var mods=this.getdicemodifiers(); 
	var lm=[];
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to) {
		if (d.type==MOD_M&&d.req(m,n)) {
		    modroll(d.f,i,to);
		} if (d.type==ADD_M&&d.req(m,n)) {
		    addroll(d.f,i,to); 
		} if (d.type==REROLL_M&&d.req(activeunit,activeunit.weapons[activeunit.activeweapon],targetunit)) {
		    if (typeof d.f=="function") d.f();
		    reroll(n,(to==ATTACK_M),d,i);
		}
	    }
	}
	return lm;	
    }
};
var maarek_fct = function() {
    var unit=this;
    var newdeal=function(c,f,p) {
	var pp=$.Deferred();
	p.then(function(cf) {
	    var crit=cf.crit;
	    if (cf.face==FACEUP&&activeunit==unit&&targetunit==this) {
		var s1=this.selectdamage();
		CRITICAL_DECK[s1].count--;
		var s2=this.selectdamage();
		CRITICAL_DECK[s2].count--;
		var s3=this.selectdamage();
		CRITICAL_DECK[s3].count--;
		sc=[s1,s2,s3];
		unit.log("select one critical");
		unit.selectcritical(sc,function(m) { 
		    pp.resolve({crit:new Critical(this,m),face:FACEUP})
		}.bind(this));
	    } else pp.resolve(cf);
	}.bind(this));
	return pp.promise();
    };
    Unit.prototype.wrap_after("deal",this,newdeal);
};
var hera_fct=function() {
    var m=this.getmaneuver();
    var p={};
    var gd=this.getdial();
    p[m.move]=m;
    if ((m.difficulty=="RED"||m.difficulty=="GREEN")&&this.ionized==false) {
	for (var i=0; i<gd.length; i++) 
	    if (gd[i].difficulty==m.difficulty
		&&typeof p[gd[i].move]=="undefined") {
		p[gd[i].move]=gd[i];
	    }
	    }
    return p;
}
var PILOTS = [
    {
	name:"Contracted Scout",
	faction:SCUM,
	pilotid:0,
	done:true,
	unit:"JumpMaster 5000",
	skill:3,
	points:25,
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    {
        name: "Wedge Antilles",    
	done:true,
        unique: true,
	faction:REBEL,
        unit: "X-Wing",
        skill: 9,
	init: function() {
	    this.wrap_after("declareattack",this,function(w,target) {
		target.log("-1 defense [%0]",this.name);
		target.wrap_after("getagility",this,function(a) {
		    if (a>0) return a-1; 
		    return a;
		}).unwrapper("endbeingattacked");
		target.showstats();
	    });
	},
	pilotid:1,
        points: 29,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "Garven Dreis",
	done:true,
	faction:REBEL,
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
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Red Squadron Pilot",
	done:true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 4,
        points: 23,
	pilotid:3,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Rookie Pilot",
	done:true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 2,
        points: 21,
	pilotid:4,
        upgrades: [TORPEDO,ASTROMECH],
    },
    { name:"Turbolaser",
      done:true,
      unit:"Turbolaser",
      faction:EMPIRE,
      skill:0,
      points:5,
      pilotid:5,
      upgrades:[],
    },
    { name:"Thermal Exhaust Port",
      done:true,
      unit:"Exhaust Port",
      faction:EMPIRE,
      skill:0,
      points:100,
      pilotid:6,
      upgrades:[],
    },
    {
        name: "Biggs Darklighter",
	done:true,
	pilotid:7,
        init: function() {
	    var biggs=this;
	    Weapon.prototype.wrap_after("getenemiesinrange",this,function(r) {
		if (r.indexOf(biggs)>-1) {
		    var p=[];
		    for (var i=0; i<r.length; i++) {
			var u=r[i];
			if (u==biggs||u.getrange(biggs)>1) p.push(u);
		    }
		    r=p;
		}
		return r;
	    });
	    Unit.prototype.wrap_after("getenemiesinrange",this,function(r) {
		var found=false;
		var p=[];
		for (var i=0; i<this.weapons.length; i++) {
		    p[i]=[];
		    if (r[i].indexOf(biggs)>-1) {
			for (var j=0; j<r[i].length; j++) {
			    var u=r[i][j];
			    if (u==biggs||u.getrange(biggs)>1) p[i].push(u);
			}
		    } else p[i]=r[i];
		}
		return p;
	    });
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
	pilotid:8,
	faction:REBEL,
	init: function() {
	    this.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req: function(m,n) {
		    return true;
		}, 
		f:function(m,n) {
		    var f=FE_focus(m);
		    var e=FE_evade(m);
		    if (f>0) {
			this.log("1 %FOCUS% -> 1 %EVADE%");
			return m-FE_FOCUS+FE_EVADE;
		    } 
		    return m;
		}.bind(this),
		str:"focus"});
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
	pilotid:9,
        points: 20,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "'Dutch' Vander",
	done:true,
	pilotid:10,
	init: function() {
            this.wrap_after("addtarget",this,function(t) {
		this.selectunit(this.selectnearbyally(2),function(p,k) {
		    p[k].selectunit(p[k].gettargetableunits(3),function(pp,kk) {
			this.addtarget(pp[kk]);
		    },["select target to lock"],false);
		},["select unit for free %TARGET% (or self to cancel)"],true);
	    });
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
	pilotid:11,
	faction:REBEL,
        unique: true,
        unit: "Y-Wing",
        skill: 8,
        points: 25,
	init: function() {
	    unit=this;
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank"],
		n:function() { return 9; },
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
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Gold Squadron Pilot",
	done:true,
	pilotid:12,
        unit: "Y-Wing",
	faction:REBEL,
        skill: 2,
        points: 18,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Academy Pilot",
	done:true,
	pilotid:13,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 1,
        points: 12,
        upgrades: [],
    },
    {
        name: "Obsidian Squadron Pilot",
	done:true,
	pilotid:14,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 3,
        points: 13,
        upgrades: [],
    },
    {
        name: "Black Squadron Pilot",
	done:true,
	pilotid:15,
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
	pilotid:16,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 7,
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
        upgrades: [ELITE],
    },
    {
        name: "'Winged Gundark'",
        faction:EMPIRE,
	pilotid:17,
        init:  function() {
	    this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return (this.getrange(targetunit)==1);
		}.bind(this),
		f:function(m,n) {
		    var h=FCH_hit(m);
		    if (h>0) {
			this.log("1 %HIT% -> 1 %CRIT%");
			m= m-FCH_HIT+FCH_CRIT;
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
        faction:EMPIRE,
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
        faction:EMPIRE,
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
        faction:EMPIRE,
        unique: true,
	init: function() {
	    var self=this;
	    this.wrap_after("isattackedby",this,function(w,a) {
		a.wrap_after("canusefocus",self,function() { return false; }).unwrapper("endbeingattacked");
		a.wrap_after("canusetarget",self,function(t) { return false; }).unwrapper("endbeingattacked");
		a.wrap_after("getdicemodifiers",self,function(mods) {
		    var p=[];
		    for (var i=0; i<mods.length; i++)
			if (mods[i].type!=REROLL_M) p.push(mods[i]);
		    return p;
		}).unwrapper("endbeingattacked");
	    })
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
        upgrades: [ELITE],
    },
    {
        name: "'Howlrunner'",
        unique: true,
	done:true,
	pilotid:22,
        faction:EMPIRE,
        unit: "TIE Fighter",
        skill: 8,
	init: function() {
	    Unit.prototype.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attacker,w,defender) {
		    // Howlrunner dead ? 
		    if (attacker!=this
			&&attacker.getrange(this)==1
			&&attacker.team==this.team&&w.isprimary) {
			attacker.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    });
	},
        points: 18,
        upgrades: [ELITE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
	pilotid:23,
	ambiguous:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 7,
        points: 27,
	init: maarek_fct,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
	pilotid:24,
	ambiguous:true,
        faction:EMPIRE,
	unit: "TIE Defender",
        skill: 7,
        points: 36,
	init: maarek_fct,
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Tempest Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:25,
        unit: "TIE Advanced",
        skill: 2,
        points: 21,
        upgrades: [MISSILE],
    },
    {
        name: "Storm Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:26,
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
	pilotid:27,
        unit: "TIE Advanced",
        skill: 9,
	doendmaneuveraction: function() {
	    if (this.candoendmaneuveraction()) {
		var x=this.doaction(this.getactionlist(),"1st action");
		//this.log("action:"+x);
		x.done(function() {
		    if (this.candoaction()) {
			this.doaction(this.getactionlist(),"2nd action");
		    } else { this.action=-1; this.actiondone=true; this.deferred.resolve(); }
		}.bind(this))
	    } else { this.action=-1; this.actiondone=true; this.deferred.resolve(); }
	    return this.deferred;
 	},
	secaction:-1,
        points: 29,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Alpha Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:28,
        unit: "TIE Interceptor",
        skill: 1,
        points: 18,
        upgrades: [ ],
    },
    {
        name: "Avenger Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:29,
        unit: "TIE Interceptor",
        skill: 3,
        points: 20,
        upgrades: [ ],
    },
    {
        name: "Saber Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:30,
        unit: "TIE Interceptor",
        skill: 4,
        points: 21,
        upgrades: ["Elite"],
    },
    {
        name: "'Fel's Wrath'",
        faction:EMPIRE,
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
		if (skillturn==-1) return true;
		return false;
	    });
	},
        points: 23,
        upgrades: [],
    },
    {
        name: "Turr Phennir",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:32,
        unit: "TIE Interceptor",
        skill: 7,
	init: function() {
	    this.wrap_after("cleanupattack",this,function() {
		var p=[];
		if (this.candoboost()) 
		    p.push(this.newaction(this.resolveboost,"BOOST"));
		if (this.candoroll()) 
		    p.push(this.newaction(this.resolveroll,"ROLL"))
		this.doaction(p,"free %BOOST% or %ROLL% action");
	    });
	},
        points: 25,
        upgrades: [ELITE],
    },
    {
        name: "Soontir Fel",
        faction:EMPIRE,
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
        upgrades: [ELITE],
    },
    {
        name: "Tycho Celchu",
	faction:REBEL,
        unique: true,
	pilotid:34,
	done:true,
	init: function() {
	    this.wrap_after("candoaction",this,function() {
		return (this.collision==0&&this.ocollision.template.length==0&&this.ocollision.overlap==-1);
	    });
	},
        unit: "A-Wing",
        skill: 8,
        points: 26,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Arvel Crynyd",
	faction:REBEL,
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
        upgrades: [MISSILE],
    },
    {
        name: "Green Squadron Pilot",
	faction:REBEL,
	done:true,
        unit: "A-Wing",
        skill: 3,
	pilotid:36,
        points: 19,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Prototype Pilot",
	faction:REBEL,
	done:true,
	pilotid:37,
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
        upgrades: [CREW,CREW],
    },
    {
        name: "Chewbacca",
        unique: true,
	done:true,
	faction:REBEL,
        unit: "YT-1300",
        skill: 5,
	pilotid:39,
        points: 42,
	deal: function(c,f) {
	    var p=$.Deferred();
	    if (f==FACEUP) {
		this.log("turn faceup damage facedown");
		return p.resolve({crit:c,face:FACEDOWN}).promise();
	    } else return p.resolve({crit:c,face:f}).promise();
	},
        upgrades: [ELITE,MISSILE,CREW,CREW]
    },
    {
        name: "Lando Calrissian",
	faction:REBEL,
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
			p[k].doaction(p[k].getactionbarlist());
		    }.bind(this),["select unit (or self to cancel) [%0]",this.name],true);
		}
	    });
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
	pilotid:41,
        points: 46,
	init: function() {
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus","hit","critical"],
		n:function() { return 9; },
		req:function(attack,w,defender) { return true; }
	    });
	},
        upgrades: [ELITE,MISSILE,CREW,CREW],
    },
    {
        name: "Kath Scarlet",
        unique: true,
        faction:EMPIRE,
        unit: "Firespray-31",
        skill: 7,
	pilotid:42,
	done:true,
	init: function() {
	    this.wrap_after("declareattack",this,function(w,target) {
		var self=this;
		target.wrap_after("cancelcritical",self,function(r,org,r2) {
		    if (FCH_crit(r.ch)>FCH_crit(r2.ch)) {
			this.log("+1 %STRESS% for cancelling %CRIT% [%0]",self.name);
			this.addstress();
		    }
		    return r2;
		}).unwrapper("endbeingattacked");
	    });
	},
        points: 38,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Boba Fett",
        unique: true,
	done:true,
	pilotid:43,
        faction:EMPIRE,
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
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
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Krassis Trelix",
        unique: true,
	done:true,
	pilotid:44,
        faction:EMPIRE,
        unit: "Firespray-31",
	init: function() {
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
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
        upgrades: [CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Bounty Hunter",
        unit: "Firespray-31",
        skill: 3,
	pilotid:45,
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
	pilotid:46,
        unit: "B-Wing",
        skill: 8,
	init: function() {
	    var self=this;
	    this.shipimg="b-wing-1.png";
	    this.wrap_after("declareattack",this,function(w,target) {
		target.wrap_after("cancelcritical",self,function(r,org,r2) {
		    if (FCH_crit(r.ch)>0) {
			if (FCH_crit(r2.ch)==0) {
			    target.log("cannot cancel 1 %CRIT% [%0]",this.name)
			    return {ch:r2.ch+FCH_CRIT,e:r2.e+1};
			}
			return r2;
		    }
		}.bind(this)).unwrapper("endbeingattacked");
	    });
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
	pilotid:47,
        points: 28,
	init: function() {
	    this.shipimg="b-wing-1.png";
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
	    this.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,m);
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,$.extend({},m));
	},
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Dagger Squadron Pilot",
        unit: "B-Wing",
	done:true,
	pilotid:48,
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
	pilotid:49,
        points: 22,
        upgrades: [SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Rebel Operative",
        unit: "HWK-290",
	done:true,
	faction:REBEL,
        skill: 2,
	pilotid:50,
        points: 16,
        upgrades: [TURRET,CREW],
    },
    {
        name: "Roark Garnet",
        unique: true,
	faction:REBEL,
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
        upgrades: [TURRET,CREW],
    },
    {
        name: "Kyle Katarn",
	faction:REBEL,
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
        upgrades: [ELITE,TURRET,CREW],
    },
    {
        name: "Jan Ors",
	faction:REBEL,
        unique: true,
	done:true,
	pilotid:53,
        unit: "HWK-290",
        skill: 8,
	init: function() {
	    var self=this;
	    Unit.prototype.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (self.stress==0)&&
			(activeunit.team==self.team)&&(activeunit!=self)
			&&(self.getrange(activeunit)<=3);
		}, 
		f:function(m,n) {
		    var f=self.rollattackdie(1)[0];
		    self.addstress();
		    activeunit.log("+1 attack die [%0]",self.name);
		    if (f=="focus") return {m:m+FCH_FOCUS,n:n+1};
		    if (f=="hit") return {m:m+FCH_HIT,n:n+1};
		    if (f=="critical") return {m:m+FCH_CRIT,n:n+1};
		    return {m:m,n:n+1};
		},str:"hit"});
	},
        points: 25,
        upgrades: [ELITE,TURRET,CREW],
    },
    {
        name: "Scimitar Squadron Pilot",
        done:true,
        unit: "TIE Bomber",
        skill: 2,
	pilotid:54,
        faction:EMPIRE,
        points: 16,
        upgrades: [TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Gamma Squadron Pilot",
	done:true,
	pilotid:55,
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
	pilotid:56,
        init: function() {
	    Unit.prototype.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 2; },
		req:function(attacker,w,defender) {
		    // Jonus dead ? 
		    if (attacker!=this
			&&attacker.getrange(this)==1
			&&attacker.team==this.team
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
        upgrades: [ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Major Rhymer",
	done:true,
	pilotid:57,
        faction:EMPIRE,
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
        upgrades: [ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Captain Kagi",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:58,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("gettargetableunits",this,function(n,p) {
		if (p.indexOf(self)>-1) p=[self];
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
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Captain Yorr",
        faction:EMPIRE,
	pilotid:60,
        unique: true,
	done:true,
        unit: "Lambda-Class Shuttle",
        skill: 4,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("addstress",this,function() {
		var p=this.selectnearbyally(2);
		if (p.indexOf(self)>-1&&self.stress<=2) {
		    this.log("%STRESS% -> %0 [%0]",self.name);
		    this.removestresstoken();
		    this.showinfo();
		    self.addstress();
		    self.showinfo();
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
	pilotid:61,
        points: 21,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Lieutenant Lorrir",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:62,
        unit: "TIE Interceptor",
        skill: 5,
        points: 23,
	resolveroll: function(n) {
	    var p=[];
	    for (var i=-20; i<=20; i+=20) {
		var mm=this.m.clone().translate(0,i).rotate(90,0,0);
		var mn=this.m.clone().translate(0,i).rotate(-90,0,0);
		p=p.concat([this.getpathmatrix(mm,"BR1").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BR1").rotate(90,0,0),
			    this.getpathmatrix(mm,"BL1").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BL1").rotate(90,0,0)]);
	    }
	    p=p.concat(this.getrollmatrix(this.m));
	    this.resolveactionmove(p,
		function(t,k) {
		    if (k<12) t.addstress();
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
	pilotid:63,
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
	pilotid:64,
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		var found=false;
		var m;
		for (var i in p) if (i.match(/K/)) {found=true; m=p[i]; break; }
		if (found&&this.ionized==false) {
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
        upgrades: [ELITE],
    },
    {
        name: "Kir Kanos",
        faction:EMPIRE,
	pilotid:65,
        init:  function() {
	    this.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) {
		    var r=this.getrange(targetunit);
		    return (r<=3&&r>=2&&this.canuseevade());
		}.bind(this),
		f:function(m,n) {
		    this.removeevadetoken();
		    this.log("+1 %HIT% for attacking at range 2-3");
		    return {m:m+FCH_HIT,n:n+1};
		}.bind(this),str:"evade"});
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
	pilotid:66,
        init: function() {
	    var unit=this;
	    Unit.prototype.wrap_after("canusefocus",this,function(b) {
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return b
	    });
	    Unit.prototype.wrap_after("canuseevade",this,function(b) {
		// Am I attacking Carnor Jax?
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("candofocus",this,function(b) {
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("candoevade",this,function(b) {
		if (this.getrange(unit)==1&&this.team!=unit.team) return false;
		return b;
	    });
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
	pilotid:67,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 2,
        points: 12,
        upgrades: [MISSILE],
    },
    {
        name: "Tala Squadron Pilot",
	faction:REBEL,
	pilotid:68,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 4,
        points: 13,
        upgrades: [MISSILE],
    },
    {
        name: "Lieutenant Blount",
	faction:REBEL,
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
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Airen Cracken",
	faction:REBEL,
	pilotid:70,
	done:true,
	init: function() {
	    this.wrap_after("endattack",this,function() {
		var p=this.selectnearbyally(1,function(t,s) { return s.candoaction(); });
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
				this.select();this.endnoaction(n,"");

				}.bind(this));
			    } else { //log("no action");
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
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Delta Squadron Pilot",
        faction:EMPIRE,
	pilotid:71,
        done:true,
        unit: "TIE Defender",
        skill: 1,
        points: 30,
        upgrades: [CANNON,MISSILE],
    },
    {
        name: "Glaive Squadron Pilot",
        faction:EMPIRE,
        done:true,
	pilotid:72,
        unit: "TIE Defender",
        skill: 6,
        points: 34,
        upgrades: [CANNON,MISSILE],
    },
    {
        name: "Onyx Squadron Pilot",
        done:true,
        faction:EMPIRE,
        pilotid:73,
        unit: "TIE Defender",
        skill: 3,
        points: 32,
        upgrades: [CANNON,MISSILE],
    },
    {
        name: "Colonel Vessery",
        done:true,
	pilotid:74,
        faction:EMPIRE,
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
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Rexler Brath",
        faction:EMPIRE,
	done:true,
	pilotid:75,
	init: function() {
	    this.wrap_after("endattack",this,function(c,h) {
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
        points: 37,
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Knave Squadron Pilot",
	faction:REBEL,
        done:true,
	pilotid:76,
        unit: "E-Wing",
        skill: 1,
        points: 27,
        upgrades: [SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Blackmoon Squadron Pilot",
        pilotid:77,
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
	pilotid:78,
	faction:REBEL,
        init:  function() {
	    Unit.prototype.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return this.isinfiringarc(targetunit);
		}.bind(this), 
		f:function(m,n) {
		    var h=FCH_hit(m);
		    if (h>0) {
			activeunit.log("1 %HIT% -> 1 %CRIT% [%0]",this.name);
			return m+FCH_CRIT-FCH_HIT;
		    } 
		    return m;
		}.bind(this),str:"hit"});
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
	pilotid:79,
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
	pilotid:80,
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
        pilotid:81,
        unit: "TIE Phantom",
        skill: 5,
        points: 27,
        upgrades: [SYSTEM,CREW],
    },
    {
        name: "'Echo'",
        faction:EMPIRE,
	done:true,
	pilotid:82,
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
        upgrades: [ELITE,SYSTEM,CREW],
    },
    {
        name: "Wes Janson",
	done:true,
	pilotid:84,
	init: function() {
	    this.wrap_before("endattack",this,function(c,h) {
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
	    });
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
	pilotid:85,
	init: function() {
	    this.wrap_after("addstress",this,function() {
		// Automatic removal of stress
		this.removestresstoken();
		var roll=this.rollattackdie(1)[0];
		this.log("-1 %STRESS%, roll 1 attack dice")
		if (roll=="hit") { this.resolvehit(1); this.checkdead(); }
	    });
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
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Tarn Mison",
	done:true,
	pilotid:87,
	init:function() {
            this.wrap_after("isattackedby",this,function(w,a) {
		if (this.targeting.length==0||this.getskill()<a.getskill()) { // TODO:Priority to define
		    this.log("+%1 %TARGET% / %0",a.name,1);
		    this.addtarget(a);
		}
	    });
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
	pilotid:88,
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
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Gemmer Sojan",
	done:true,
	pilotid:89,
	init: function() {
            this.wrap_after("getagility",this,function(a) {
		var r=this.selectnearbyenemy(1);
		if (r.length>0) {
		    return a+1;
		}
		return a;
	    });
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
	pilotid:90,
	init: function() {
	    this.shipimg="b-wing-1.png";
	    this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return this.stress>0; 
		}.bind(this),
		f:function(m,n) {
		    var f=FCH_focus(m);
		    this.removestresstoken();
		    if (f>0) {
			this.log("%0 %FOCUS% -> %0 %HIT%, -1 %STRESS%",f);
			return m-FCH_FOCUS*f+FCH_HIT*f;
		    }
		    return m;
		}.bind(this),str:"stress"});
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
	pilotid:91,
	init: function() {
	    this.shipimg="b-wing-1.png";
	    this.log("can fire %TORPEDO% at 360 degrees");
	    this.wrap_after("isTurret",this,function(w,b) {
		if (w.type=="Torpedo") return true;
		return b;
	    })
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
	pilotid:92,
	faction:REBEL,
        unit: "YT-2400",
        skill: 2,
        points: 30,
        upgrades: [CANNON,MISSILE,CREW],
    },
    {
        name: "Eaden Vrill",
	done:true,
	pilotid:93,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (sh.stress>0&&this.weapons[w].isprimary) { 
		    this.log("+1 attack die");
		    return a+1;
		}
		return a;
	    });
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
	pilotid:94,
	init: function() {
	    var newdeal=function(c,f,p) {
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.face==FACEUP) {
			var s1=this.selectdamage();
			CRITICAL_DECK[s1].count--;
			var s2=this.selectdamage();
			CRITICAL_DECK[s2].count--;
			var sc=[s1,s2];
			this.log("select one critical");
			this.selectcritical(sc,function(m) {
			    pp.resolve({crit:new Critical(this,m),face:FACEUP});
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
        upgrades: [ELITE,CANNON,MISSILE,CREW],
    },
    {
        name: "Dash Rendar",
	faction:REBEL,
	pilotid:95,
        unit: "YT-2400",
        unique: true,
        skill: 7,
	done:true,
	init: function() {
	    this.wrap_after("getocollisions",this,function(mbegin,mend,path,len) { 
		return {overlap:-1,template:[],mine:[]};
	    });
	},
        points: 36,
        upgrades: [ELITE,CANNON,MISSILE,CREW],
    },
    {
        name: "Patrol Leader",
        faction:EMPIRE,
	done:true,
	pilotid:96,
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
	pilotid:97,
        unique: true,
	done:true,
	init: function() {
	    this.wrap_before("resolvecollision",this,function() {
		for (var i=0; i<this.touching.length; i++) {
		    var u=this.touching[i];
		    if (u.team!=this.team) {
			u.log("+1 %HIT% [%0]",this.name);
			u.resolvehit(1);
			u.checkdead();
		    }
		}
	    })
	},
        upgrades: [ELITE,TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Commander Kenkirk",
        faction:EMPIRE,
	pilotid:98,
	init: function() {
	    this.wrap_after("getagility",this,function(a) {
		if (this.criticals.length>0) return a+1;
		return a;
	    });
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
	pilotid:99,
        init:  function() {
	    this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return  (this.getrange(targetunit)<=2);
		}.bind(this),
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.log("1 %FOCUS% -> 1 %CRIT%");
			return m-FCH_FOCUS+FCH_CRIT;
		    }
		    return m;
		}.bind(this),str:"hit"});
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
	pilotid:100,
        modifydamageassigned: function(ch,attacker) {
	    var i;
	    var p=[];
	    if (ch==0) return 0;
	    var p=this.selectnearbyally(1);
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
	pilotid:101,
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
        upgrades: [ELITE,TORPEDO],
    },
    {
        name: "Black Sun Vigo",
        faction:SCUM,
        done:true,
	pilotid:102,
        unit: "StarViper",
        skill: 3,
        points: 27,
        upgrades: [TORPEDO],
    },
    {
        name: "Black Sun Enforcer",
        faction:SCUM,
	pilotid:103,
        done:true,
        unit: "StarViper",
        skill: 1,
        points: 25,
        upgrades: [TORPEDO],
    },
    {
        name: "Serissu",
        faction:SCUM,
	pilotid:104,
	done:true,
        init: function() {
	    Unit.prototype.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attacker,w,defender) {
		    // Serissu dead ? 
		    if (defender!=this&&defender.getrange(this)==1&&defender.team==this.team) {
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
        upgrades: [ELITE],
    },
    {
        name: "Laetin A'shera",
        faction:SCUM,
	pilotid:105,
	init: function() {
            this.wrap_after("endbeingattacked",this,function(c,h,t) {
		if (c+h==0) {
		    this.log("no hit, +1 %EVADE%");
		    this.addevadetoken();
		}
	    })
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
	pilotid:106,
        done:true,
        unit: "M3-A Interceptor",
        skill: 5,
        points: 17,
        upgrades: [ELITE],
    },
    {
        name: "Cartel Spacer",
        faction:SCUM,
	pilotid:107,
        done:true,
        unit: "M3-A Interceptor",
        skill: 2,
        points: 14,
        upgrades: [ ],
    },
    {
        name: "IG-88A",
	faction:SCUM,
	pilotid:108,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
	init: function() {
	    this.wrap_before("cleanupattack",this,function(c,h) {
		if (targetunit.dead&&(this.shield<this.ship.shield)) {
		    this.addshield(1);
		    this.showstats();
		    this.log("+1 %SHIELD% for a kill");
		}
	    });
	},
	done:true,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "IG-88B",
	faction:SCUM,
	pilotid:109,
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
	pilotid:110,
	init: function() {
            this.wrap_after("resolveboost",this,function(n) {
		this.doaction([this.newaction(this.addevade,"EVADE")],"free evade action");
	    })
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
	pilotid:111,
        getmaneuverlist: function() {
	    var gm=this.getmaneuver();
	    var dial=gm.move;
	    if (dial=="SL3") {
		this.log("%SLOOPLEFT% or %TURNLEFT% maneuver");
		return {"SL3":gm,"TL3":{move:"TL3",halfturn:true,difficulty:gm.difficulty}}
	    } else if (dial=="SR3") {
		this.log("%SLOOPRIGHT% or %TURNRIGHT% maneuver");
		return {"SR3":gm,"TR3":{move:"TR3",halfturn:true,difficulty:gm.difficulty}}
	    } else return {dial:gm}
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
	pilotid:112,
	faction:SCUM,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		var p=this.selectnearbyally(2);
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
	pilotid:113,
	faction:SCUM,
	done:true,
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
        upgrades: [ELITE,MISSILE,ILLICIT],
    },
    {
        name: "Black Sun Soldier",
        faction:SCUM,
	pilotid:114,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 3,
        points: 13,
        upgrades: [MISSILE,ILLICIT],
    },
    {
        name: "Binayre Pirate",
	faction:SCUM,
	pilotid:115,
        done:true,        
        unit: "Z-95 Headhunter",
        skill: 1,
        points: 12,
        upgrades: [MISSILE,ILLICIT],
    },
    {
        name: "Boba Fett",
	faction:SCUM,
	pilotid:116,
        unit: "Firespray-31",
        skill: 8,
        points: 39,
	init: function() {
	    var nrerolls=function() {
		var n=0;
		for (var i in squadron) {
		    var s=squadron[i];
		    if (this.getrange(s)==1&&this.team!=s.team) n++;
		}
		return n;
	    }.bind(this);
	    var m={
		dice:["blank","focus"], 
		n: nrerolls, 
		req:function(attacker,w,defender) { return true; }
	    };
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,m);
	    this.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,$.extend({},m));
	},
	done:true,
        unique: true,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Kath Scarlet",
	done:true,
	pilotid:117,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (this.isinfiringarc(sh)&&this.getprimarysector(sh)==4) { 
		    this.log("+1 attack die against %0 in auxiliary arc",sh.name);
		    a=a+1;
		}
		return a;
	    });
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
	pilotid:118,
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
	pilotid:119,
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
	pilotid:120,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (!this.isinfiringarc(sh)) { 
		    this.log("+1 attack die against %0 outside firing arc",sh.name);
		    return a+1;
		}
		return a;
	    });
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
	pilotid:121,
	faction:SCUM,
        unit: "Y-Wing",
        skill: 5,
	done:true,
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
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Hired Gun",
	faction:SCUM,
	pilotid:122,
	done:true,
        unit: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Syndicate Thug",
	faction:SCUM,
	pilotid:123,
	done:true,
        unit: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Dace Bonearm",
        unique: true,
	pilotid:124,
	faction:SCUM,
        unit: "HWK-290",
	done:true,
	init: function() {
	    var unit=this;
	    Unit.prototype.wrap_after("addiontoken",this,function() {
		if (this.getrange(unit)<=3 &&unit.team!=this.team&&unit.stress==0) {
		    unit.addstress();
		    this.resolvehit(1);
		    unit.log("+1 %cSTRESS%");
		    this.log("+%1 %HIT [%0]",unit.name,1);
		    this.checkdead();
		}
	    });
	},
        skill: 7,
        points: 23,
        upgrades: [ELITE,TURRET,CREW,ILLICIT],
    },
    {
        name: "Palob Godalhi",
        unique: true,
	pilotid:125,
	faction:SCUM,
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
        upgrades: [ELITE,TURRET,CREW,ILLICIT],
    },
    {
        name: "Torkil Mux",
        unique: true,
	pilotid:126,
	done:true,
	init: function() {
            this.wrap_after("endactivationphase",this,function() {
		this.selectunit(this.selectnearbyenemy(2),function(p,k) {
		    p[k].wrap_after("getskill",this,function(s) {
			return 0;
		    }).unwrapper("endcombatphase");
		},["select unit for a 0 PS"],false);
	    });
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
	pilotid:127,
	done:true,
        unit: "HWK-290",
        skill: 1,
        points: 16,
        upgrades: [TURRET,CREW,ILLICIT],
    },
    {
        name: "Commander Alozen",
        faction:EMPIRE,
	pilotid:128,
        unit: "TIE Advanced",
        unique: true,
	done:true,
        skill: 5,
        points: 25,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		this.selectunit(this.gettargetableunits(1),function(p,k) {
		    this.addtarget(p[k]);
		    this.log("+%1 %TARGET% / %0",p[k].name,1);
		},["select unit to lock (or self to cancel)"],true);
		return l;
	    })
	},
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Juno Eclipse",
        unique: true,
	pilotid:129,
	done:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 8,
        points: 28,
	getmaneuverlist: function() {
	    var m=this.getmaneuver();
	    var p={};
	    p[m.move]=m;
	    var speed = parseInt(m.move.substr(-1),10);
	    for (var i=-1; i<=1; i++) {
		var r=m.move.replace(/\d/,(speed+i)+"");
		if (typeof P[r]!="undefined") {
		    p[r]={move:r,difficulty:m.difficulty,halfturn:m.halfturn};
		}
	    }
	    return p;
	},
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Zertik Strom",
        unique: true,
	pilotid:130,
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
	pilotid:131,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 3,
        points: 23,
        upgrades: [MISSILE],
	done:true,
	init: function() {
	    this.wrap_after("endcombatphase",this,function() {
		this.selectunit(this.targeting,function(p,k) {
		    if (this.canusetarget(p[k])) {
			var c=p[k].criticals;
			this.removetarget(p[k]);
			if (c.length>0) c[rand(c.length)].faceup();
		    }
		},["select unit (or self to cancel)"],true);
	    });
	},
    },
    {
        name: "Bossk",
        faction: SCUM,
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
        upgrades: [ELITE,CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Moralo Eval",
        faction: SCUM,
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
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Latts Razzi",
        faction: SCUM,
	pilotid:134,
        unit: "YV-666",
        unique: true,
        skill: 5,
        points: 33,
	done:true,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("declareattack",this,function(wp,t) {
		if (self.team==this.team&&self.canusetarget(t))
		    self.donoaction([this.newaction(function(n) {
			this.removetarget(t);
			t.wrap_after("getdefensestrength",self,function(i,sh,d) {
			    return (d>0)?d-1:d;
			}).unwrapper("endbeingattacked");
			this.endnoaction(n,"TARGET");
		    }.bind(self),"TARGET")],self.name+": -1 agility for "+t.name,true);
	    });
	},
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Trandoshan Slaver",
        faction: SCUM,
	pilotid:135,
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
	pilotid:136,
        unit: "Kihraxz Fighter",
        skill: 9,
        upgrades: [ELITE,MISSILE,ILLICIT],
	done:true,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(i,sh,a) {
		return a+this.weapons[i].getrangeattackbonus(sh);
	    });
	    this.wrap_after("getdefensestrength",this,function(i,sh,a) {
		return a+sh.weapons[i].getrangedefensebonus(this);
	    });
	},
        points: 28,
    },
    {
        name: "Graz the Hunter",
        unique: true,
	pilotid:137,
        faction: SCUM,
        unit: "Kihraxz Fighter",
        skill: 6,
        upgrades: [MISSILE,ILLICIT],
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
        faction: SCUM,
	pilotid:138,
        unit: "Kihraxz Fighter",
	done:true,
            skill: 5,
            upgrades: [ELITE,MISSILE,ILLICIT],
            points: 23
        },
        {
            name: "Cartel Marauder",
	    done:true,
	    pilotid:139,
            faction: SCUM,
            unit: "Kihraxz Fighter",
            skill: 2,
            upgrades: [MISSILE,ILLICIT],
            points: 20
        },
        {
            name: "Miranda Doni",
            unique: true,
	    pilotid:140,
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
            faction: REBEL,
            unit: "K-Wing",
            skill: 6,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 28,
	    done:true,
	    init: function() {
		var self=this;
		Unit.prototype.wrap_before("beginattack",this,function() {
		    if (this!=self&&this.team==self.team) {
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
            faction: REBEL,
	    pilotid:142,
	    done:true,
            unit: "K-Wing",
            skill: 4,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 25
        },
        {
            name: "Warden Squadron Pilot",
            faction: REBEL,
	    pilotid:143,
	    done:true,
            unit: "K-Wing",
            skill: 2,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 23
        },
        {
            name: "'Redline'",
            unique: true,
	    pilotid:144,
            faction: EMPIRE,
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
		if (this.targeting.indexOf(sh)>-1) return true;
		for (var i=this.targeting.length-2;i>=0; i++) this.removetarget(this.targeting[i]);
		return false;
	    },
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 27
        },
        {
            name: "'Deathrain'",
            unique: true,
	    pilotid:145,
            faction: EMPIRE,
            unit: "TIE Punisher",
            skill: 6,
	    done:true,
	    init: function() {
		this.wrap_after("getbombposition",this,function(lm,size,p) {
		    for (var i=0; i<lm.length; i++)
			p.push(this.getpathmatrix(this.m.clone(),lm[i]).translate(0,-size+20));
		    return p;
		});
		this.wrap_after("bombdropped",this,function() {
		    if (this.candoroll()&&this.candoaction()) {
			$("#activationdial").hide();
			this.doaction([this.newaction(this.resolveroll,"ROLL")],"free %ROLL% action")
		    }
		});
	    },
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 26
        },
        {
            name: "Black Eight Squadron Pilot",
            faction: EMPIRE,
	    pilotid:146,
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
	    pilotid:147,
            unit: "TIE Punisher",
            skill: 2,
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 21
        },
        {
            name: "Poe Dameron",
            faction: REBEL,
	    pilotid:148,
            unit: "T-70 X-Wing",
	    unique:true,
	    done:true,
            skill: 8,
            upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	    init: function() {
		this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		    req:function(m,n) { 
			return this.focus>0;
		    }.bind(this),
		    f:function(m,n) {
			var f=FCH_focus(m);
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %HIT%");
			    return m-FCH_FOCUS+FCH_HIT;
			}
			return m;
		    }.bind(this),str:"focus"});
		this.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		    req:function(m,n) { 
			return this.focus>0;
		    }.bind(this),
		    f:function(m,n) {
			var f=FE_focus(m);
			if (f>0) {
			    this.log("1 %FOCUS% -> 1 %EVADE%");
			    return m-FE_FOCUS+FE_EVADE;
			}
			return m;
		    }.bind(this), str:"focus"});
	    },
            points: 31
        },
      {
	  name: "'Blue Ace'",
	  faction: REBEL,
	  done:true,
	  pilotid:149,
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
	  name: "Ello Asty",
	  faction: REBEL,
	  done:true,
	  pilotid:150,
	  beta:true,
	  unit: "T-70 X-Wing",
	  skill: 7,
	  unique:true,
	  getdial:function() {
	      var save=[];
	      var gd=Unit.prototype.getdial.call(this);
	      for (var i=0; i<gd.length; i++) {
		  var move=gd[i].move;
		  var d=gd[i].difficulty;
		  if (move.match(/TR[RL]\d/)&&this.stress==0) d="WHITE";
		  save[i]={move:move,difficulty:d};
	      }
	      return save;
	  },
	  upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	  points: 30
      },
      {
	  name: "'Red Ace'",
	  faction: REBEL,
	  done:true,
	  pilotid:151,
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
	  pilotid:152,
	  upgrades: [TORPEDO,ASTROMECH,TECH],
	  points: 24
      },
     {
	  name: "Red Squadron Veteran",
	  faction: REBEL,
	 pilotid:153,
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
	pilotid:154,
	  unit: "TIE/FO Fighter",
	  skill: 4,
	upgrades: [TECH,ELITE],
	  points: 17
      },
   {
	  name: "Zeta Squadron Pilot",
	  faction: EMPIRE,
	  done:true,
       pilotid:155,
	  unit: "TIE/FO Fighter",
	  skill: 3,
       upgrades: [TECH],
	  points: 16
      },
   {
	  name: "Epsilon Squadron Pilot",
	  faction: EMPIRE,
	  done:true,
       pilotid:156,
	  unit: "TIE/FO Fighter",
	  skill: 1,
       upgrades: [TECH],
	  points: 15
      },
   {
	  name: "'Zeta Ace'",
	  faction: EMPIRE,
	  done:true,
       pilotid:157,
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
       pilotid:158,
       unique:true,
       unit: "TIE/FO Fighter",
       skill: 6,
       init: function() {
	   this.wrap_after("begincombatphase",this,function() {
	       var p=this.selectnearbyally(1);
	       p.push(this);
	       for (var i=0; i<p.length; i++) p[i].removestresstoken();
	       return l;
	   });
       },
       upgrades: [TECH],
       points: 19
   },
   {
       name:"'Epsilon Ace'",
       faction:EMPIRE,
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
       upgrades:[TECH],
       points:17
   },
   {
	  name: "'Omega Ace'",
	  faction: EMPIRE,
	  done:true,
       pilotid:160,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 7,
	  init: function() {
	      this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		  req:function(m,n) { 
		      return this.canusefocus()&&this.targeting.indexOf(targetunit)>-1;
		  }.bind(this),
		  f:function(m,n) {
		      this.removefocustoken();
		      this.removetarget(targetunit);
		      this.log("all results are %CRIT%");
		      return n*FCH_CRIT;
		  }.bind(this),str:"critical"});
       },
       upgrades: [ELITE,TECH],
	  points: 20
      },
   {
       name: "'Omega Leader'",
       faction: EMPIRE,
       beta:true,
       pilotid:161,
       unique:true,
       unit: "TIE/FO Fighter",
       skill: 8,
       upgrades: [ELITE,TECH],
       points: 21,
       done:true,
       init: function() {
	   var self=this;
	    this.wrap_after("isattackedby",this,function(w,a) {
		if (self.targeting.indexOf(a)>-1) 
		    a.wrap_after("getdicemodifiers",self,function(mods) {
			var p=[];
			for (var i=0; i<mods.length; i++)
			    if (mods[i].from!=ATTACK_M) p.push(mods[i]);
			return p;
		    }).unwrapper("endattack");
	    })
	    this.wrap_after("declareattack",this,function(w,t) {
		if (self.targeting.indexOf(t)>-1) 
		    t.wrap_after("getdicemodifiers",self,function(mods) {
			var p=[];
			for (var i=0; i<mods.length; i++)
			    if (mods[i].from!=DEFENSE_M) p.push(mods[i]);
			return p;
		    }).unwrapper("endbeingattacked");
	    })
       }
   },
    {
	name:"Hera Syndulla",
	unique:true,
	faction:REBEL,
	unit:"VCX-100",
	skill:7,
	pilotid:162,
	ambiguous:true,
	points:40,
	done:true,
        getmaneuverlist: hera_fct,
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW]
    },
    {
	name:"'Chopper'",
	unique:true,
	pilotid:163,
	faction:REBEL,
	unit:"VCX-100",
	skill:4,
	points:37,
	done:true,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		for (var i=0; i<this.touching.length; i++) {
		    if (this.touching[i].team!=this.team) {
			this.touching[i].addstress();
			this.touching[i].log("+1 %STRESS% [%0]",this.name);
		    }
		}
		return l;
	    });
	},
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW]
    },
    {
	name:"Ezra Bridger",
	faction:REBEL,
	unique:true,
	done:true,
	pilotid:164,
	unit:"Attack Shuttle",
	skill:4,
	points:20,
	init: function() {
	    this.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return this.stress>0;
		}.bind(this), 
		f:function(m,n) {
		    var f=FE_focus(m);
		    if (f>2) f=2;
		    if (f>0) {
			this.log("%0 %FOCUS% -> %0 %EVADE%",f);
			return m-f*FE_FOCUS+f*FE_EVADE;
		    } 
		    return m;
		}.bind(this),str:"focus"});
	},        
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"Hera Syndulla",
	faction:REBEL,
	unique:true,
	done:true,
	pilotid:165,
	unit:"Attack Shuttle",
	skill:7,
	ambiguous:true,
	points:22,
        getmaneuverlist: hera_fct,
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"Sabine Wren",
	faction:REBEL,
	unique:true,
	done:true,
	pilotid:166,
	unit:"Attack Shuttle",
	skill:5,
	points:21,
	beginactivation: function() {
	    var p=[];
	    if (this.candoaction()) {
		if (this.candoboost()) 
		    p.push(this.newaction(this.resolveboost,"BOOST"));
		if (this.candoroll()) 
		    p.push(this.newaction(this.resolveroll,"ROLL"));
		this.doaction(p,"free %BOOST% or %ROLL% action");
	    }
	},
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"'Zeb' Orrelios",
	faction:REBEL,
	unique:true,
	unit:"Attack Shuttle",
	skill:3,
	pilotid:167,
	points:18,
	done:true,
	cancelhit:function(r,t) {
	    // first, cancel criticals
	    this.log("cancel %CRIT% first");
	    r=this.cancelcritical(r,t);
	    r=Unit.prototype.cancelhit(r,t);
	    return r;
	},
	upgrades:[TURRET,CREW]
    },
    {
	name:"Kanan Jarrus",
	faction:REBEL,
	unique:true,
	pilotid:168,
	unit:"VCX-100",
	skill:5,
	points:38,
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW],
	done:true,
	init:function() {
	    var self=this;
	    Unit.prototype.wrap_after("preattackroll",this,function(w,t) {
		var p=this.selectnearbyenemy(2);
		if (self.canusefocus()&&p.indexOf(self)>-1) { 
		    this.donoaction([{org:self,name:self.name,type:"FOCUS",action:function(n) {
			this.wrap_after("getattackstrength",self,function(i,t,a) {
			    var ra= this.weapons[i].getrangeattackbonus(t);
			    a=a-ra;
			    if (a>0) a=a-1;			    
			    return a+ra;
			}).unwrapper("attackroll");
			self.removefocustoken();
			this.log("-1 attack against %1",self.name);
			this.endnoaction(n,"FOCUS");
		    }.bind(this)}],"",true);
		}
	    });
	}
    },
    {
	name:"'Wampa'",
	faction:EMPIRE,
	unique:true,
	pilotid:169,
	unit:"TIE Fighter",
	skill:4,
	points:14,
	done:true,
	init: function() {
	    this.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return true; 
		},
		f:function(m,n) {
		    this.log("cancel all dice");
		    if (FCH_crit(m)>0) {
			targetunit.log("+1 damage card [%0]",this.name);
			targetunit.applydamage(1);
		    }
		    return {m:0,n:0};
		}.bind(this),str:"critical"});
	},
	upgrades:[]
    },
    { 
	name:"'Youngster'",
	faction:EMPIRE,
	unique:true,
	pilotid:170,
	unit:"TIE Fighter",
	skill:6,
	points:15,
	done:true,
	init: function() {
	    var elite=null;
	    var self=this;
	    for (i=0; i<this.upgrades.length; i++) {
		if (this.upgrades[i].type==ELITE&&(typeof this.upgrades[i].action=="function")){ 
		    elite=$.extend({}, this.upgrades[i]);
		    elite.clone=true;
		    elite.isactive=true;
		}
	    }
	    if (elite==null) return;
	    this.log("share %0 upgrade",elite.name);
	    Unit.prototype.wrap_after("getupgactionlist",self,function(l) {
		var p=this.selectnearbyally(3);
		if (this.ship.name.match(/.*TIE.*Fighter.*/)&&p.indexOf(self)>-1&&elite.candoaction()&&elite.isactive) {
		    this.log("elite action from %0 available",self.name);
		    elite.unit=this;
		    l.push({org:elite,action:elite.action,type:elite.type.toUpperCase(),name:elite.name});
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
	pilotid:171,
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
    },
    {
	name:"Gamma Squadron Veteran",
	faction:EMPIRE,
	pilotid:172,
	done:true,
	unit:"TIE Bomber",
	skill:5,
	points:19,
	upgrades:[ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB]
    },
    {
	name:"The Inquisitor",
	faction:EMPIRE,
	pilotid:173,
	unit:"TIE Adv. Prototype",
	skill:8,
	unique:true,
	done:true,
	points:25,
	init: function() {
	    var self=this;
	    this.wrap_after("getattackstrength",this,function(i,sh,a) {
		if (i==0) {
		    if (this.weapons[0].getrange(sh)>1) {
			this.log("+1 attack die with primary weapon [%0]",this.name);
			return a+1;
		    }
		} 
		return a;
	    });
	    Weapon.prototype.wrap_after("getrangedefensebonus",this,function(t,a) {
		if (a>0&&t==self) return 0;
		return a;
	    });
	},
	upgrades:[ELITE,MISSILE]
    },
    {
	name:"Valen Rudor",
	faction:EMPIRE,
	unique:true,
	pilotid:174,
	unit:"TIE Adv. Prototype",
	skill:6,
	points:22,
	done:true,
	init: function() {
	    this.wrap_after("endbeingattacked",this,function(c,h,t) {
		if (this.candoaction()) {
		    this.log("+1 free action [%0]",this.name);
		    this.doaction(this.getactionlist());
		}
	    });
	},
	upgrades:[ELITE,MISSILE]
    },
   {
       name:"Sienar Test Pilot",
       faction:EMPIRE,
       pilotid:175,
       done:true,
       unit:"TIE Adv. Prototype",
       skill:2,
       points:16,
       upgrades:[MISSILE]
    },
   {
       name:"Zuckuss",
       faction:SCUM,
       pilotid:176,
       unique:true,
       unit:"G-1A Starfighter",
       skill:7,
       points:28,
       done:true,
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT],
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
       faction:SCUM,
       pilotid:177,
       unique:true,
       done:true,
       unit:"G-1A Starfighter",
       skill:6,
       points:26,
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
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT]
    },
    {
        name: "Nashtah Pup Pilot",
	faction:SCUM,
        done:true,
	pilotid:178,
	unique:true,
        unit: "Z-95 Headhunter",
        skill: 2,
        points: 0,
        upgrades: [],
    },
    {
	name:"Dengar",
	faction:SCUM,
	unique:true,
	pilotid:179,
	unit:"JumpMaster 5000",
	skill:9,
	points:33,
	done:true,
	init: function() {
	    this.den=-1;
	    var self=this;
	    Unit.prototype.wrap_before("endattack",this,function() {
		var t=this;
		var p=[];
		var wn=[];
		if (targetunit==self&&!self.iscloacked&&!self.isfireobstructed()&&self.isinfiringarc(t)&&self.den<round) {
		    self.log("retaliate!");
		    self.select();
		    for (var i in self.weapons) 
			if (self.weapons[i].canfire(t)) wn.push(i);
		    for (var i in wn) 
			p.push({org:self,type:self.weapons[wn[i]].type.toUpperCase(),name:"Retaliation",
				action:function(n) {
				    self.wrap_after("endattack",self,function() {
					this.den=round;
					this.hasfired=this.hf;
				    }).unwrapper("cleanupattack");
				    self.wrap_before("cleanupattack",self,function() {
					if (this.hasfired>0&&this.den==round) {
					    this.newlock().done(nextcombat);
					}
				    });
				
				    targetunit=t;
				    this.selecttargetforattack(i,t);
				    this.endnoaction(n,"HIT");
				}.bind(self)});
		    self.hf=self.hasfired;
		    if (p.length>0) self.donoaction(p,"select weapon for retaliation",true);
		   
		}
	    });
	},
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    {
	name:"Tel Trevura",
	faction:SCUM,
	unique:true,
	pilotid:180,
	unit:"JumpMaster 5000",
	skill:7,
	points:30,
	done:true,
	init: function() {
	    this.wrap_after("checkdead",this,function() {
		if (this.hull<=0&&!this.dead) {
		    this.addhull(this.ship.hull-this.hull);
		    this.addshield(this.ship.shield);
		    this.criticals=[];
		    SOUNDS.explode.play();
		    this.log("resurrects");
		    this.applydamage(4);
		}
	    });
	},
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    {
	name:"Manaroo",
	faction:SCUM,
	pilotid:181,
	unit:"JumpMaster 5000",
	skill:4,
	unique:true,
	points:27,
	done:true,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyally(4),function(p,k) {
		    var f=this.focus,e=this.evade
		    for (var i=0; i<f; i++) {
			p[k].addfocustoken();
			this.removefocustoken();
		    }
		    for (var i=0; i<e; i++) {
			p[k].addevadetoken();
			this.removeevadetoken();
		    }
		    var t=this.targeting;
		    for (var i=t.length;i>=0; i--) {
			p[k].addtargettoken(t[i]);
			this.removetarget(t[i]);
		    }
		    var t=this.istargeted;
		    for (var i=t.length;i>=0; i--) {
			t[i].removetarget(this);
			t[i].addtargettoken(p[k]);
		    }
		},["select unit (or self to cancel) [%0]",this.name],true);
	    });
	},
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    { name:"Tomax Bren",
      faction:EMPIRE,
      pilotid:182,
      unit:"TIE Bomber",
      skill:8,
      unique:true,
      points:24,
      upgrades:[ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB]
    },
    { name:"Lothal Rebel",
      faction:REBEL,
      done:true,
      unit:"VCX-100",
      skill:3,
      pilotid:183,
      points:35,
      upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW]
    },
   {
       name:"Baron of the Empire",
       faction:EMPIRE,
       pilotid:184,
       done:true,
       unit:"TIE Adv. Prototype",
       skill:4,
       points:19,
       upgrades:[ELITE,MISSILE]
    },
   {
       name:"Gand Findsman",
       faction:SCUM,
       pilotid:185,
       done:true,
       unit:"G-1A Starfighter",
       skill:5,
       points:25,
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT]
    },
    {
       name:"Ruthless Freelancer",
       faction:SCUM,
       pilotid:186,
       done:true,
       unit:"G-1A Starfighter",
       skill:3,
       points:23,
       upgrades:[CREW,SYSTEM,ILLICIT]
    },
    
];
/* 31/06/15: XW FAQ with Garven Dreis 
TODO: desactivate  and unwrapping.
Unit.prototype for old pilots and upgrades
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
    this.wrapping=[];
    this.ordnance=sh.ordnance;
    this.unit=sh;
    sh.bombs.push(this);
    this.exploded=false;
    //if (this.init != undefined) this.init(sh);
}
Bomb.prototype = {
    isWeapon: function() { return false; },
    isBomb: function() { return true; },
    canbedropped: function() { return this.isactive&&!this.unit.hasmoved; },
    desactivate:Unit.prototype.desactivate,
    actiondrop: function(n) {
	this.unit.lastdrop=round;
	$(".bombs").remove(); 
	this.drop(this.unit.getbomblocation(),n);
	//this.unit.showactivation();
    },
    toString: function() {
	var a,b,d,str="";
	var c="";
	var template;
	if (this.unit.team==1) template=$("#bomb-left").html();
	else template=$("#bomb-right").html();
	Mustache.parse(template);
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	var rendered=Mustache.render(template, this);
	/*if (!this.isactive) c="class='inactive'"
	a="<td><code class='"+this.type+" upgrades'></code>";
	a+="</td>";
	var ord="";
	if (this.ordnance) ord="<sup style=\"padding:1px;color:white;background-color:red;border-radius:100%;\">x2</sup>";
	b="<td class='tdstat'><span>"+translate(this.name).replace(/\'/g,"&#39;")+ord+"</span></td>";
	var text=getupgtxttranslation(this.name,this.type);
	if (text=="") d="<td class='outoverflow'></td>";
	else d="<td class='tooltip outoverflow'><span>"+formatstring(text)+"</span></td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";*/
	return rendered;
    },
    getrangeallunits: function () { 
	var range=[[],[],[],[],[]],i;
	for (i in squadron) {
	    var sh=squadron[i];
	    var k=this.getrange(sh);
	    if (k>0) range[k].push({unit:i});
	};
	return range;
    },
    getcollisions: function() {
	var ob=this.getOutlineString();
	var p=[];
	s.path(ob.s).attr({strokeWidth:4,fill:YELLOW}).appendTo(VIEWPORT);
	for (i in squadron) {
	    var u=squadron[i];
	    var so=u.getOutlineString(u.m);
	    os=so.s;
	    op=so.p;
	    s.path(os).attr({strokeWidth:4,fill:YELLOW}).appendTo(VIEWPORT);
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.unit.isPointInside(ob.s,op)
		||this.unit.isPointInside(os,ob.p)) {
		this.unit.log("found collision "+this.unit.name+" bomb and "+u.name);
		p.push(u); 
	    } else this.unit.log("no collision "+this.unit.name+" bomb and "+u.name);

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
	} else {
	    for (i=0; i<moves.length; i++) {
		this.pos[i]=this.getOutline(moves[i]).attr({fill:this.unit.color,opacity:0.7});
		(function(k) {
		    this.pos[k].hover(
			function() {this.pos[k].attr({stroke:this.unit.color,strokeWidth:"4px"})}.bind(this),
			function() {this.pos[k].attr({strokeWidth:"0"})}.bind(this));
		
		    this.pos[k].click(
		    function() { resolve(moves[k],k,cleanup); });}.bind(this)
		)(i);
	    }
	}
    },
    drop: function(lm,n) {
	var dropped=this;
	if (this.ordnance) { 
	    this.ordnance=false; 
	    dropped=$.extend({},this);
	} else this.desactivate();
	dropped.img1=s.image("png/"+this.img,-this.width/2,-this.height/2,this.width,this.height);
	dropped.outline=this.getOutline(new Snap.matrix())
	    .attr({display:"block","class":"bombanim",stroke:halftone(BLUE),strokeWidth:2,fill:"rgba(8,8,8,0.3)"});
	if (this.repeatx) {
	    dropped.img2=s.image("png/"+this.img,-this.width/2-this.repeatx,-this.height/2,this.width,this.height);
	    dropped.img3=s.image("png/"+this.img,-this.width/2+this.repeatx,-this.height/2,this.width,this.height);
	    dropped.g=s.group(dropped.outline,dropped.img1,dropped.img2,dropped.img3);
	} else dropped.g=s.group(dropped.outline,dropped.img1);
	dropped.g.attr("display","none");
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
		this.outline.attr({stroke:BLUE});
		$(".info").css({left:x,top:y}).html(this.name).appendTo("body").show();
	    }.bind(dropped), function() { 
		$(".info").hide(); 
		this.outline.attr({stroke:halftone(BLUE)});
	    }.bind(dropped));
	dropped.resolveactionmove(this.unit.getbombposition(lm,this.size), function(k) { 
	    this.g.transform(this.m);
	    this.g.appendTo(VIEWPORT);
	    this.g.attr("display","block");
	    BOMBS.push(this);
	    if (this.stay) {
		OBSTACLES.push(this);
		var p=this.getcollisions();
		console.log("collisions : "+p.length);
		if (p.length>0) this.unit.resolveactionselection(p,function(k) {
		    this.detonate(p[k]);
		}.bind(this));
	    }
	    this.unit.bombdropped(this);
	    //this.unit.log("endaction dropped "+n);
	    this.unit.endnoaction(n,"DROP");
	}.bind(dropped),false,true);
    },
    getOutline: function(m) {
	return s.path(this.getOutlineString(m).s).appendTo(VIEWPORT);
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
    },
    endround: function() {},
    show: function() {},
    wrap_before: Unit.prototype.wrap_before,
    wrap_after: Unit.prototype.wrap_after,
}
function Weapon(sh,wdesc) {
    this.isprimary=false;
    $.extend(this,wdesc);
    sh.upgrades[sh.upgrades.length]=this;
    this.wrapping=[];
    //log("Installing weapon "+this.name+" ["+this.type+"]");
    this.isactive=true;
    if (this.type.match(/Missile|Torpedo/)) this.ordnance=sh.ordnance;
    this.unit=sh;
    sh.weapons.push(this);
    //if (this.init != undefined) this.init(sh);
}
Weapon.prototype = {
    isBomb: function() { return false; },
    isWeapon: function() { return true; },
    hasauxiliaryfiringarc: function() { return false; },
    desactivate: Unit.prototype.desactivate,
    toString: function() {
	var a,b,d,str="";
	var c="";
	if (!this.isactive) c="class='inactive'"
	else {
	    var i,r=this.getrangeallunits();
	    for (i=0; i<r.length; i++) if (r[i].team!=this.unit.team) break;
	    if (i==r.length) c="class='nofire'"
	}
	var rank = this.unit.upgrades.indexOf(this);
	var i = squadron.indexOf(this.unit);
	a="<td><button class='statfire'";
	if (i>-1) a+=" onclick='if (!squadron["+i+"].isdocked) squadron["+i+"].togglehitsector("+rank+")'";
	a+=">"+this.getattack()+"<span class='symbols'>"+A[this.type.toUpperCase()].key+"</span>"
	a+="</button></td>";
	var ord="";
	if (this.ordnance) ord="<sup style=\"padding:1px;color:white;background-color:red;border-radius:100%;\">x2</sup>";
	b="<td class='tdstat'><span>"+translate(this.name).replace(/\'/g,"&#39;")+ord+" <span style='font-size:smaller'>";
	if ((typeof this.getrequirements()!="undefined")) {
	    if ("Target".match(this.getrequirements())) b+="<code class='symbols'>"+A["TARGET"].key+"</code>"
	    if ("Focus".match(this.getrequirements())) b+=(this.getrequirements().length>5?"/":"")+"<code class='symbols'>"+A["FOCUS"].key+"</code>"
	}
	b+="["+this.getlowrange()+"-"+this.gethighrange()+"]</span></span></td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	if (text=="") d="<td class='outoverflow'></td>";
	else d="<td class='tooltip outoverflow'><span>"+formatstring(text)+"</span></td>";

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
    getlowrange:function() {
	return this.range[0];
    },
    gethighrange:function() {
	return this.range[1];
    },
    isinrange: function(r) {
	return (r>=this.getlowrange()&&r<=this.gethighrange());
    },
    modifydamagegiven: function(ch) { return ch; },
    modifydamageassigned: function(ch,t) { return ch; },
    canfire: function(sh) {
	if (typeof sh=="undefined") console.log("undefined unit: "+this.unit.name+" "+this.name);
	if (!this.isactive||this.unit.team==sh.team) return false;
	if (this.unit.checkcollision(sh)) return false;
	if (typeof this.getrequirements()!="undefined") {
	    var s="Target";
	    if (s.match(this.getrequirements())&&(this.consumes==false||this.unit.canusetarget(sh)))
		return true;
	    s="Focus";
	    if (s.match(this.getrequirements())&&(this.consumes==false||this.unit.canusefocus(sh))) return true;
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
	    if (s.match(this.getrequirements())&&this.consumes==true&&this.unit.canusetarget(sh))
		this.unit.removetarget(sh);
	    else if (u.match(this.getrequirements())&&this.consumes==true&&this.unit.canusefocus(sh)) 
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
	if (ghs>=this.getlowrange()&&ghs<=this.gethighrange()) return ghs;
	return 0;
    },
    endattack: function(c,h) {
	if (this.type.match(/Torpedo|Missile/)) {
	    if (this.ordnance) this.ordnance=false; else this.desactivate();
	}
    },
    getenemiesinrange: function() {
	var i;
	var r=[];
	for (i in squadron) {
	    var sh=squadron[i];
	    if (this.unit.team!=sh.team&&this.getrange(sh)>0) r.push(sh);
	}
	return r;
    },
    getrangeallunits: function() {
	var i;
	var r=[];
	for (i in squadron) {
	    var sh=squadron[i];
	    if ((this.unit!=sh)&&(this.getrange(sh)>0)) r.push(sh);
	}
	return r;
    },
    wrap_before: Unit.prototype.wrap_before,
    wrap_after: Unit.prototype.wrap_after,
    endround:function() {},
    show: function() {}
};
function Upgrade(sh,i) {
    $.extend(this,UPGRADES[i]);
    sh.upgrades.push(this);
    this.isactive=true;
    this.unit=sh;
    this.wrapping=[];
    var addedaction=this.addedaction;
    if (typeof addedaction!="undefined") {
	var added=addedaction.toUpperCase();
	sh.shipactionList.push(added);
    }
    //if (typeof this.init != "undefined") this.init(sh);
}
function Upgradefromid(sh,i) {
    var upg=UPGRADES[i];
    upg.id=i;
    if (upg.type==BOMB) return new Bomb(sh,upg);
    if (typeof upg.isWeapon != "undefined") 
	if (upg.isWeapon()) return new Weapon(sh,upg);
    else return new Upgrade(sh,i);
    if (upg.type.match(/Turretlaser|Bilaser|Laser180|Laser|Torpedo|Cannon|Missile|Turret/)||upg.isweapon==true) return new Weapon(sh,upg);
    return new Upgrade(sh,i);
}
Upgrade.prototype = {
    toString: function() {
	var a,b,str="";
	var c="";
	var d;
	if (!this.isactive) c="class='inactive'"
	a="<td><code class='"+this.type+" upgrades'></code></td>"; 
	b="<td class='tdstat'>"+translate(this.name).replace(/\'/g,"&#39;");
	if (typeof this.shield!="undefined" &&this.shield>0)
	    b+=" <code class='cshield' title='"+this.shield+" shield(s)'></code>";
	b+="</td>";
	var text=formatstring(getupgtxttranslation(this.name,this.type));
	if (text=="") d="<td class='outoverflow'></td>";
	else d="<td class='tooltip outoverflow'><span>"+text+"</span></td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    isWeapon: function() { return false; },
    isBomb: function() { return false; },
    getlowrange:function() {
	return this.range[0];
    },
    gethighrange:function() {
	return this.range[1];
    },
    endround: function() {},
    desactivate:Unit.prototype.desactivate,
    show: function() {},
    install: function(sh) {
	if (typeof this.addedaction!="undefined") {
	    var aa=this.addedaction.toUpperCase();
	    sh["addedaction"+this.id]=sh.shipactionList.length;
	    sh.shipactionList.push(aa);
	    sh.showactionlist();
	}
	// Adding upgrades
	if (typeof this.upgrades!="undefined") {
	    sh["addedupg"+this.id]=sh.upgradesno;
	    if (typeof this.pointsupg!="undefined") sh.upgbonus[this.upgrades[0]]=this.pointsupg;
	    if (typeof this.maxupg!="undefined") {
		sh.maxupg[this.upgrades[0]]=this.maxupg;
	    }
	    if (this.exclusive==true) {
		sh.exclupg[this.upgrades[0]]=true;
	    }
	    sh.upgradetype=sh.upgradetype.concat(this.upgrades);
	    sh.upgradesno=sh.upgradetype.length;
	    sh.showupgradeadd();   
	}
	// Losing upgrades
	if (typeof this.lostupgrades!="undefined") {
	    for (var j=0; j<sh.upgradetype.length; j++) {
		if (this.lostupgrades.indexOf(sh.upgradetype[j])>-1) {
		    if (sh.upg[j]>-1) removeupgrade(sh,j,sh.upg[j]);
		    sh.upg[j]=-2;
		}
	    }
	    sh.showupgradeadd();
	}
	// Emperor
	if (typeof this.takesdouble!="undefined") {
	    var j;
	    for (j=0; j<sh.upgradetype.length; j++)
		if (sh.upgradetype[j]==this.type&&(sh.upg[j]==-1||UPGRADES[sh.upg[j]].name!=this.name)) {
		    log("found upgrade "+j+" "+sh.upg[j]+" "+this.id);
		    break;
		}
	    if (j<sh.upgradetype.length) {
		if (sh.upg[j]>-1) removeupgrade(sh,j,sh.upg[j]);
		sh.upg[j]=-2;
	    }
	    sh.showupgradeadd();
	}
    },
    uninstall: function(sh) {
	if (typeof this.addedaction!="undefined") {
	    var aa=this.addedaction.toUpperCase();
	    sh.shipactionList.splice(sh["addedaction"+this.id],1);

	}
	if (typeof this.upgrades!="undefined") {
	    if (typeof this.pointsupg!="undefined") sh.upgbonus[this.upgrades[0]]=0;
	    if (typeof this.maxupg!="undefined") sh.maxupg[this.upgrades[0]]=0;
	    for (var i=0; i<this.upgrades.length; i++) {
		var num=i+sh["addedupg"+this.id];
		var e=$("#unit"+sh.id+" .upg span[num="+num+"]");
		if (e.length>0) {
		    var data=e.attr("data");
		    removeupgrade(sh,num,data);
		}
	    }
	    if (typeof this.exclusive==true) {
		sh.exclupg[this.upgrades[0]]=false;
	    }
	    sh.upgradetype.splice(sh["addedupg"+this.id],this.upgrades.length);
	    sh.upgradesno=sh.upgradetype.length;
	}
	if (typeof this.lostupgrades!="undefined") {
	    for (var i=0; i<sh.upgradetype.length; i++)
		if (this.lostupgrades.indexOf(sh.upgradetype[i])>-1)
		    sh.upg[i]=-1;
	}
	if (typeof this.takesdouble!="undefined") {
	    for (var i=0; i<sh.upgradetype.length; i++)
		if (sh.upgradetype[i]==this.type&&sh.upg[i]==-2)
		    sh.upg[i]=-1;
	}
    }
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
	upgid:0,
	done:true,
	prehit: function(target,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
	    target.addiontoken();
	},
	range: [1,2],
    },
    {
	name: "Proton Torpedoes",
	requires: "Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
        points: 4,
	done:true,
        attack: 4,
	init: function(sh) {
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (sh.weapons[sh.activeweapon]==this);
		}.bind(this),
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",this.name);
			m=m-FCH_FOCUS+FCH_CRIT;
		    }
		    return m;
		}.bind(this),str:"focus"});
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
	    sh.wrap_after("getdial",this,function(gd) {
		if (save.length==0) { 
		    for (i=0; i<gd.length; i++) {
			var s=P[gd[i].move].speed;
			var d=gd[i].difficulty;
			if (s==1||s==2) d="GREEN"; 
			save[i]={move:gd[i].move,difficulty:d};
		    }
		    sh.log("1, 2 speed maneuvers are green [%0]",self.name);
		}
		return save;
	    });
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap(this);
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
		    this.addshield(1);
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
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this.unit;
	    if (!this.isactive) return true;
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
	    if (!this.isactive) return false;
	    for (var i=0; i<this.unit.criticals.length; i++) 
		if (this.unit.criticals[i].isactive==false) return true;
	    return false;
	},
	action: function(n) {
	    var self=this;
	    if (!this.isactive) return true;
	    this.unit.defenseroll(1).done(function(roll) {
		if (FE_evade(roll.roll)+FE_focus(roll.roll)>0) {
		    for (var i=0; i<this.criticals.length; i++)
			if (this.criticals[i].isactive==false) {
			    this.log("-1 %HIT% [%0]",self.name);
			    this.criticals.slice(i,1);
			    this.addhull(1);
			    this.show();
			    break;
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
		  self.desactivate();
		  this.wrap_after("getocollisions",self,function(mbegin,mend,path,len) { 
		      return {overlap:-1,template:[],mine:[]};
		  }).unwrapper("endround");
		  this.show();
	      }.bind(this), A[ASTROMECH.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
	      return this.activationdial;
	  });
      },
    },
    { name: "BB-8",
      unique:true,
      done:true,
      type:ASTROMECH,
      points:2,
      init: function(sh) {
	  var self=this;
	  self.bb=-1;
	  sh.wrap_after("updateactivationdial",this,function(ad) {
	      if (self.isactive&&self.bb!=round) 
		  this.addactivationdial(
		      function() { 
			  return !this.hasmoved&&this.maneuver>-1&&(this.getmaneuver().difficulty=="GREEN")&&this.candoroll(); 
		      }.bind(this),
		      function() {
			  self.bb=round;
			  this.doaction([this.newaction(this.resolveroll,"ROLL")],self.name+" free roll for green maneuver.");
		      }.bind(this), 
		      A[ASTROMECH.toUpperCase()].key, 
		      $("<div>").attr({class:"symbols",title:self.name}));
	      return this.activationdial;
	  })
      },
    },
    {name:"Integrated Astromech",
     points:0,
     type:MOD,
     ship:"X-Wing",
     done:true,
     init: function(sh) {
	 var self=this;
	 var newdeal=function(c,f,p) {
	     var k=-1;
	     for (var i in this.upgrades) {
		 var u=this.upgrades[i];
		 if (u.type==ASTROMECH&&u.isactive==true) { k=i; break; }
	     }
	     if (k==-1) return p;
	     var pp=$.Deferred();
	     p.then(function(cf) {
		 if (this.shield+this.hull==1||(cf.face==FACEUP&&cf.crit.lethal&&this.shield+this.hull<=2)) {
		     this.upgrades[k].desactivate();
		     this.log("%0 is inactive, damage discarded [%1]",this.upgrades[k].name,self.name);
		     self.desactivate();
		     pp.resolve({crit:cf.crit,face:DISCARD});
		 } else pp.resolve(cf);
	     }.bind(this));
	     return pp.promise();
	 };
	 sh.wrap_after("deal",this,newdeal);
     },
    },
    {name:"Weapons Guidance",
     points:2,
     type:TECH,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req:function(m,n) { 
		 return self.isactive&&this.canusefocus(); 
	     }.bind(sh), 
	     f:function(m,n) {
		 var b=FCH_blank(m,n);
		 this.removefocustoken();
		 displayattacktokens(this);
		 if (b>0) {		
		     this.log("1 blank -> 1 %HIT% [%0]",self.name);
		     m=m+FCH_HIT; 
		 } 
		 return m;
	     }.bind(sh),str:"focus"});
     }
    },
    {
        name: "R5-K6",
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("removetarget",this,function(t) {
		this.defenseroll(1).done(function(roll) {
		    if (FE_evade(roll.roll)>0) {
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
		for (var i=0; i<this.criticals.length; i++) {
		    var cr=this.criticals[i];
		    if (cr.isactive&&cr.type=="ship") {
			c=i;
			if (cr.lethal) { cl=i; break; }
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
	    var newdeal=function(c,f,p) {
		if (c.type!="pilot") return p;
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.face==FACEUP) {
			this.log("discarding critical %1 [%0]",self.name,cf.crit.name);
			pp.resolve({crit:cf.crit,face:DISCARD});
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    sh.wrap_after("deal",this,newdeal);
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
		this.selectunit(sh.selectnearbyally(1,function(a,b) { 
		    return a.getskill()>b.getskill(); 
		}),function(p,k) {
		    p[k].log("PS set to %1 [%0]",self.name,this.getskill());
		    p[k].wrap_after("getskill",self,function(s) {
			return sh.getskill();
		    }).unwrapper("endcombatphase");
		},["select unit [%0]",self.name],false);
	    });
	},
    },
    {
        name: "Squad Leader",
        unique: true,
	done:true,
        type: ELITE,
        points: 2,
	candoaction: function() {  
	    var p=this.unit.selectnearbyally(2,function(t,s) { return s.getskill()<t.getskill()&&s.candoaction();});
	    return (this.isactive)&&(p.length>0);
	},
	action: function(n) {
	    var self=this.unit;
	    var p=self.selectnearbyally(2,function(t,s) { return s.getskill()<t.getskill()&&s.candoaction();});
	    self.resolveactionselection(p,function(k) {
		p[k].select();
		p[k].doaction(p[k].getactionlist(),"+1 free action").done(function() {
		    self.select();
		});
		self.endaction(n,"ELITE");
	    });
	},
    },
    {
        name: "Expert Handling",
	candoaction: function() { return this.isactive&&this.unit.actionsdone.indexOf("ROLL")==-1; },
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
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (this.mark==round)&&this.isactive;
		}.bind(this),
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0&&this.mark==round) {	
			if (f>1) this.unit.log("%0 %FOCUS% -> 1 %CRIT%, %1 %HIT% [%2]",f,f-1,self.name); else this.unit.log("1 %FOCUS% -> 1 %CRIT% [%1]",f,self.name);
			m=m-FCH_FOCUS*f+FCH_CRIT+(f-1)*FCH_HIT; 
		    } 
		    return m;
		}.bind(this),str:"focus"});
	},
	candoaction: function() { return this.isactive; },
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
	consumes:true,
        type: MISSILE,
	firesnd:"missile",
        points: 4,
        attack: 4,
	done:true,
	init: function(sh) {
	    var missile=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return sh.weapons[sh.activeweapon]==this&&missile.isactive;
		}.bind(this), 
		f:function(m,n) {
		    var b=FCH_blank(m,n);
		    if (b>0) m=m+FCH_HIT; 
		    return m;
		}.bind(this),str:"blank"});
	},
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        type: MISSILE,
	firesnd:"missile",
	requires:"Target",
	consumes:true,
        points: 4,
        attack: 3,
	done:true,
	fired:-1,
	endattack: function() {
	    if (this.fired==round) {
		if (this.ordnance) {
		    this.ordnance=false; 
		} else this.desactivate();
	    }
	},
	init: function(sh) {
	    var m=this;
	    sh.wrap_after("endattack",this,function(c,h) {
		if (m.fired<round&&m.isactive&&this.usedweapon>-1&&this.weapons[this.usedweapon]==m) {
		    this.log("2nd attack with %0 [%1]",m.name,m.name);
		    m.fired=round;
		    this.resolveattack(this.activeweapon,targetunit); 
		}
	    }.bind(sh));
	},
        range: [1,2],
    },
    {
        name: "Daredevil",
	done:true,
        candoaction: function() { return this.isactive; },
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
			    if (roll[i]=="hit") t.resolvehit(1); 
			    else if (roll[i]=="critical") t.resolvecritical(1);
			}
			t.checkdead();
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
	    var self=this;
	    sh.adddicemodifier(DEFENSE_M,MOD_M,ATTACK_M,this,{
		req:function() {
		    return this.stress==0&&targetunit==this&&self.isactive;
		}.bind(sh),
		f:function(m,n) {
		    this.unit.addstress();
		    if (FCH_crit(m)>0) {
			this.unit.log("1 %CRIT% rerolled [%0]",this.name);
			m=m-FCH_CRIT+activeunit.attackroll(1);
		    } else if (FCH_hit(m)>0) {
			this.unit.log("1 %HIT% rerolled [%0]",this.name);
			m=m-FCH_HIT+activeunit.attackroll(1);
		    }
		    return m;
		}.bind(this),str:"critical"});
	},
        type: ELITE,
        points:2,
    },
    {
        name: "Homing Missiles",
	requires:"Target",
	consumes:false,
        type: MISSILE,
	firesnd:"missile",
        attack: 4,
        range: [2,3],
	done:true,
	declareattack: function(target) {
	    Weapon.prototype.declareattack.call(this,target);
	    targetunit.wrap_after("canuseevade",this,function() { return false; }).unwrapper("endbeingattacked");
	    targetunit.log("cannot use evade tokens [%0]",this.name);
	},
        points: 5,
    },
    {
        name: "Push the Limit",
	init: function(sh) {
	    var ptl=this;
	    ptl.r=-1;
	    ptl.da=sh.doaction;
	    sh.doaction= function(la,str) {
		var dar=ptl.da.call(this,la,str);
		var df=$.Deferred();
		dar.then(function(r) {
		    if (ptl.r<round&&this.candoaction()) {
			ptl.r=round;		
			var dac=ptl.da.call(this,this.getactionbarlist(),"+1 free action");
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
	desactivate: function() {
	    this.unit.doaction=this.da;
	    Upgrade.prototype.desactivate.call(this);
	},
	done:true,
        type: ELITE,
        points: 3,
    },
    {
        name: "Deadeye",
        init: function(sh) {
	    Weapon.prototype.wrap_after("getrequirements",this,function(g) {
		if (this.unit==sh&&g=="Target") return "Target|Focus";
		return g;
	    });
	},
	done:true,
        type: ELITE,
        points: 1,
    },
    {
        name: "Expose",
        candoaction: function() { return this.isactive; },
	action: function(n) {
	    var w=this.unit.weapons[0];
	    var gat=w.getattack;
	    var self=this;
	    this.unit.log("-1 agility, +1 primary attack until end of turn [%0]",this.name);
	    this.unit.wrap_after("getagility",this,function(a) {
		if (a>0) return a-1; else return 0;
	    }).unwrapper("endround");
	    w.wrap_after("getattack",this,function(a) {
		return a+1;
	    }).unwrapper("endround");
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
	    var gunner=-1;
	    sh.wrap_before("endattack",this,function(c,h) {
		if (c+h==0&&gunner<round) {
		    gunner=round;
		    this.log("+1 attack with primary weapon [%0]",self.name);
		    this.selecttargetforattack(0); 
		}
	    });
	},
        type: CREW,
        points: 5,
    },
    {
        name: "Ion Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	prehit: function(target,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
	    target.addiontoken();
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
	    if (FCH_crit(ch)>0) {
		var c=FCH_crit(ch);
		this.unit.log("%0 %CRIT%-> %0 %HIT% [%1]",c,this.name);
		ch=ch-FCH_CRIT*c+c*FCH_HIT;
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
		    var u=squadron[r[1][i].unit];
		    u.log("+1 %HIT% [%0]",this.name);
		    u.resolvehit(1);
		    u.checkdead();
		}
	    }
	},
        type: BOMB,
        points: 2,
    },    
    {
        name: "Thermal Detonator",
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
		    var u=squadron[r[1][i].unit];
		    u.log("+1 %HIT%, +1 %STRESS% [%0]",this.name);
		    u.resolvehit(1);
		    u.addstress();
		    u.checkdead();
		}
	    }
	},
        type: BOMB,
        points: 2,
    },
    {
        name: "Mercenary Copilot",
        init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { return (this.getrange(targetunit)==3); }.bind(sh),
		f:function(m,n) {
		    if (FCH_hit(m)>0) {
			this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
			m=m-FCH_HIT+FCH_CRIT; 
		    } 
		    return m;
		}.bind(sh),str:"hit"});
	},
	done:true,
        type: CREW,
        points: 2,
    },
    {
        name: "Assault Missiles",
        type: MISSILE,
	requires:"Target",
	consumes:true,
	firesnd:"missile",
	done:true,
	prehit: function(t,c,h) {
	    var r=t.getrangeallunits();
	    for (var i=0; i<r[1].length; i++) {
		squadron[r[1][i].unit].log("+1 %HIT% [%0]",this.name);
		squadron[r[1][i].unit].resolvehit(1);
	    }
	},
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Veteran Instincts",
	done:true,
        install: function(sh) {
	    sh.wrap_after("getskill",this,function(s) {
		return s+2;
	    });
	    sh.showskill();
	},
	uninstall: function(sh) {
	    sh.getskill.unwrap(this);
	    sh.showskill();

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
	candoaction: function() { return this.unit.lastdrop!=round&&this.isactive; },
	action: function(n) { this.actiondrop(n); },
	canbedropped:function() { return false; },
        explode: function() {},
	detonate:function(t) {
	    if (!this.exploded) {
		var roll=this.unit.rollattackdie(3);
		for (var i=0; i<3; i++) {
		    if (roll[i]=="hit") { 
			t.log("+1 %HIT% [%0]",this.name); 
			t.resolvehit(1); t.checkdead(); }
		    else if (roll[i]=="critical") { 
			t.log("+1 %CRIT% [%0]",this.name); 
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
	done:true,
	init: function(sh) {
	    var second=false;
	    var self=this;
	    sh.boundtargets=function(t) {
		if (this.targeting.indexOf(t)>-1) return true;
		for (var i=this.targeting.length-2; i>=0; i--) 
		    this.removetarget(this.targeting[i]);
		return false;
	    };
	    sh.wrap_after("addtarget",this,function(u) {
		if (second==true) second=false;
		else this.doselection(function(n) {
		    second=true;
		    this.log("select target to lock [%0]",self.name);
		    this.resolvetargetnoaction(n,true);
		}.bind(this));
	    });
	}
    },
    { /* TODO: a ship is still hit if crit is transferred ? */
        name: "Draw Their Fire",
        init: function(sh) {
	    var self=this;
	    this.ea=Unit.prototype.resolvecritical;
	    Unit.prototype.resolvecritical=function(c) {
		if (c>0&&this.team==sh.team&&sh!=this&&this.getrange(sh)==1){
		    this.selectunit([this,sh],function(p,k) {
			if (k==0) { this.ea.call(this,1); }
			else { this.ea.call(sh,1);}
		    },["select unit [%0]",self.name],false);
		    this.ea.call(this,c-1);
		} else this.ea.call(this,c);
		return c;
	    }
	}, 
	desactivate:function(sh) {
	    Unit.prototype.resolvecritical=this.ea;
	    Upgrade.prototype.desactivate.call(this,sh);
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
	    var self=this;
	    var luke=-1;
	    sh.wrap_before("endattack",this,function(c,h) {
		if ((c+h==0)&&luke<round) {
		    luke=round;
		    this.log("+1 attack with primary weapon [%0]",self.name);
		    this.selecttargetforattack(0);
		}
	    });
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return luke==round&&self.isactive;
		}.bind(sh),
		f:function(m,n) {
		    if (m>100) return m-99; else return m;
		},str:"focus"});
	},
        type: CREW,
        points: 7,
    },
    {
        name: "Nien Nunb",
	faction:REBEL,
	done:true,
        install: function(sh) {
	    var save=[];
	    sh.wrap_after("getdial",this,function(gd) {
		if (save.length==0) 
		    for (var i=0; i<gd.length; i++) {
			var move=gd[i].move;
			var d=gd[i].difficulty;
			if (move.match(/F[1-5]/)) d="GREEN";
			save[i]={move:move,difficulty:d};
		    }
		return save;
	    });
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap(this);
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
	    var self=this;
	    var newdeal=function(c,f,p) {
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (this.hull+this.shield==1||(cf.face==FACEUP&&cf.crit.lethal&&this.hull+this.shield<=2)) {
			if (this.shield<this.ship.shield) this.addshield(1);
			this.log("+1 %SHIELD%, 1 damage discarded [%0]",self.name);
			self.desactivate();
			pp.resolve({crit:cf.crit,face:DISCARD});
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    sh.wrap_after("deal",this,newdeal);
	},
        points: 4,
    },
    {
        name: "Advanced Proton Torpedoes",
	requires:"Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
        attack: 5,
	done:true,
        range: [1,1],
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (sh.weapons[sh.activeweapon]==this);
		}.bind(this),
		f:function(m,n) {
		    var b=FCH_blank(m,n);
		    if (b>3) b=3;
		    if (b>0) {
			this.unit.log("%0 blanks -> %0 %FOCUS% [%1]",b,this.name);
			m+=b*FCH_FOCUS;
		    }
		    return m;
		}.bind(this),str:"blank"});
	},        
        points: 6,
    },
    {
        name: "Autoblaster",
        type: CANNON,
	done:true,
	firesnd:"slave_fire",
        attack: 3,
	declareattack: function(target) {
	    var self=this;
	    target.wrap_after("cancelhit",self,function(r,org,r2) {
		self.unit.log("%HIT% cannot be cancelled [%0]",self.name);
		return r;
	    }).unwrapper("endbeingattacked");
	    Weapon.prototype.declareattack.call(this,target);
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
	consumes:true,
        points: 4,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Recon Specialist",
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("addfocus",this,function(n) {
		sh.log("+1 %FOCUS% [%0]",self.name);
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
	    var a=this.unit.selectnearbyenemy(1);
	    return this.isactive&&a.length>0;
	}, 
	action: function(n) {
	    var self=this;
	    if (!this.isactive) return;
	    var p=this.unit.selectnearbyenemy(1);
	    if (p.length>0) {		
		this.unit.log("select unit [%0]",this.name);
		this.unit.resolveactionselection(p,function(k) {
		    var i,q=[];
		    for (i=0; i<p[k].criticals.length; i++) 
			if (p[k].criticals[i].isactive==false) q.push(p[k].criticals[i]);
		    if (q.length>0) {
			var r=p[k].rand(q.length);
			p[k].log("turn faceup one damage card [%0]",self.name);
			q[r].faceup();
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
		this.selectunit(this.selectnearbyenemy(2),function(p,k) {
		    p[k].showmaneuver();
		},["select unit [%0]",self.name],false);
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
		    // if ionized, doesnot reveal a maneuver
		    return this.ionized==0
			&&!this.hasmoved
			&&upg.isactive
			&&this.maneuver>-1
			&&(this.getmaneuver().difficulty=="RED"); 
		}.bind(this),function() {
		    this.log("red into white maneuver [%0]",upg.name);
		    upg.desactivate();
		    this.wrap_after("getmaneuver",upg,function(d) {
			return {move:d.move,difficulty:"WHITE"};
		    }).unwrapper("endactivationphase"); 
		    this.show();
		}.bind(this), A[ELITE.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
		return this.activationdial;
	    })
	},        
        type: ELITE,
        points: 1,
    },
    {
        name: "Advanced Sensors",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("beginactivation",this,function() {
		if (this.candoaction()) 
		    this.doaction(this.getactionlist()).done(function(r) {
			if (r!=null) this.wrap_after("candoendmaneuveraction",self,function() {return false;}).unwrapper("doendmaneuveraction");
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
	    sh.adddicemodifier(DEFENSE_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return self.isactive;
		}.bind(sh),
		f:function(m,n) {
		    var h=FCH_hit(m);
		    if (h>0) {
			this.unit.log("1 %HIT% -> 1 %FOCUS% [%0]",self.name);
			m=m-FCH_HIT+FCH_FOCUS;
		    }
		    return m;
		}.bind(this),str:"hit"});
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
		    t.log("+1 %STRESS% [%0]",self.name);
		    t.addstress();
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
	    sh.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
		dice:["focus"],
		n:function() { if (activeunit.getskill()<=2) return 2; return 1; },
		req:function(attacker,w,defender) {
		    if (this.isactive) 
			this.unit.log("+%1 %FOCUS% reroll(s) [%0]",self.name,(activeunit.getskill()<=2?2:1));
		    return this.isactive;
		}.bind(this)
	    });
	},
	done:true,
        type: CREW,
        points: 4,
    },
    {
        name: "Navigator",
        init: function(sh) {
            sh.wrap_after("getmaneuverlist",this,function(list) {
		var gd=this.getdial();
		var p=list;
		if (this.ionized>0) return p;
		for (var i in list) {
		    var bearing=i.replace(/\d/,'');
		    for (j=0; j<gd.length; j++) 
			if (gd[j].move.match(bearing)
			    &&typeof p[gd[j].move]=="undefined"
			    &&(gd[j].difficulty!="RED"||this.stress==0)) p[gd[j].move]=gd[j];
		}
		return p;
	    });
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
	    sh.wrap_after("preattackroll",this,function(w,t) {
		if (t.focus+t.evade==0&&this.stress==0) 
		    this.donoaction([{org:this,name:this.name,type:"ELITE",action:function(n) {
			this.wrap_after("getattackstrength",self,function(i,t,a) {
			    return a+1;
			}).unwrapper("endattack");
			this.addstress();
			this.log("+1 attack against %1, +1 %STRESS% [%0]",self.name,t.name);
			this.endnoaction(n,"ELITE");
		    }.bind(this)}],"",true);
	    });
	},
        type: ELITE,
        points: 4,
    },
    {
        name: "Ion Pulse Missiles",
	requires:"Target",
	consumes:false,
        type: MISSILE,
	firesnd:"missile",
	done:true,
	prehit: function(t,c,h) {
	    this.unit.log("+%1 %HIT%, +1 ion token [%0]",this.name,2);
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    t.addiontoken(); t.addiontoken();
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
		this.selectunit(this.selectnearbyally(1,function(s,t) { 
		    return t.stress>0; }),
				function(p,k) {
				    p[k].removestresstoken();
				},["select unit [%0]",self.name],false);
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
		this.selectunit(this.selectnearbyally(2),function(p,k) {
		    var s1=p[k].getskill();
		    var s2=this.getskill();
		    this.wrap_after("getskill",self,function(s) {
			return s1;
		    }).unwrapper("endcombatphase");
		    p[k].wrap_after("getskill",self,function(s) {
			return s2;
		    }).unwrapper("endcombatphase");
		}, ["select unit (or self to cancel) [%0]",self.name],true);
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
	    sh.wrap_before("resolveattack",this,function(w,targetunit) {
		targetunit.wrap_after("getdefensestrength",self,function(i,t,d) {
		    if(!this.isinfiringarc(t)&&t.isinfiringarc(this)&&d>0) {
			this.log("-1 defense [%0]",self.name);
			return d-1;
		    }
		    return d;
		}).unwrapper("dodefenseroll");
	    });
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Predator",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { if (targetunit.getskill()<=2) return 2; return 1; },
		req:function(a,w,defender) {
		    this.log("+%1 reroll(s) [%0]",self.name,(targetunit.getskill()<=2?2:1));
		    return self.isactive;
		}.bind(sh)});
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
	requires:"Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
	done:true,
	endattack: function(c,h) {
	    if (targetunit.hull<=4) targetunit.addstress();
	    Weapon.prototype.endattack.call(this);
	},
        points: 2,
        attack: 3,
        range: [2,3],
    },
    {
        name: "R7 Astromech",
        type: ASTROMECH,
        points: 2,
	done:true,
	init: function(sh) {
	    sh.adddicemodifier(DEFENSE_M,REROLL_M,ATTACK_M,this,{
		dice:["critical","hit"],
		n:function() { return 9; },
		req: function() { return this.targeting.indexOf(activeunit)>-1; }.bind(this)
	    });
	}
    },
    {
        name: "R7-T1",
	candoaction: function() { return this.isactive; },	    
	action: function(n) {
	    var self=this;
	    if (!this.isactive) return;
	    var p=this.unit.selectnearbyenemy(2);
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
	},
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
		    this.addshield(1);
		    this.show();
		    if (p.length>0) {
			var crit=p[this.rand(p.length)]
			if (FCH_hit(this.attackroll(1))>0) {
			    this.log("+1 %CRIT% [%0]",this.name);
			    crit.faceup();
			}
		    } 
		}
	    });
	},
    },
    {
        name: "C-3PO",
        unique: true,
        faction:REBEL,
        type: CREW,
        points: 3,
	done:true,
	init:function(sh) {
	    var self=this;
	    var c3po=-1;
	    sh.wrap_after("defenseroll",this,function(r,promise) {
		if (c3po==round) return promise;
		var lock=$.Deferred();
		c3po=round;
		promise.done(function(roll) {
		    var resolve=function(k) {
			if (k==FE_evade(roll.roll)) {
			    this.log("guessed correctly ! +1 %EVADE% [%0]",self.name);
			    roll.roll+=FE_EVADE;
			    roll.dice+=1;
			}
			$("#actiondial").empty();
			lock.resolve(roll);
		    }.bind(this);

		    this.log("guess the number of evades out of %0 dice [%1]",r,self.name);
		    $("#actiondial").empty();
		    for (var i=0; i<=roll.dice; i++) {
			(function(k) {
			    var e=$("<button>").html(k+" <code class='xevadetoken'></code>")
				.on("touch click",function() { resolve(k);}.bind(this));
			    $("#actiondial").append(e);
			}.bind(this))(i);
		    }
		}.bind(this));
		return lock.promise();
	    });
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
		this.log("PS set to %1 [%0]",self.name,0); 
		this.wrap_after("getskill",self,function(s) {
		    return 0;
		}).unwrapper("endactivationphase");
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
        ship: "A-Wing"
    },
    {
        name: "Proton Rockets",
        type: MISSILE,
	firesnd:"missile",
	requires:"Focus",
	consumes:false,
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
	},
        
    },
    {
        name: "Jan Ors",
        faction:REBEL,
        unique: true,
        type: CREW,
        points: 2,
	done:true,
	init: function(sh) {
	    var jan=-1;
	    var self=this;
	    Unit.prototype.wrap_after("addfocustoken",this,function() {
		if (this.getrange(sh)<=3&&this.team==sh.team&&jan<round) {
		    jan=round;
		    this.log("select %FOCUS% or %EVADE% token [%0]",self.name)
		    this.donoaction(
			[{name:u.name,org:u,type:"FOCUS",action:function(n) { 
			    this.endnoaction(n,"FOCUS"); }.bind(this)},
			 {name:u.name,org:u,type:"EVADE",action:function(n) { 
			     this.focus--;
			     this.addevadetoken(); 
			     this.endnoaction(n,"EVADE"); }.bind(this)}],
			"",true);
		}
	    })
	},
    },

    {
        name: "R4-D6",
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("cancelhit",this,function(r,org,r2) {
		var h=FCH_hit(r2.ch);
		if (h>=3) {
		    sh.log("cancelling %0 hits [%1]",h-2,self)
		    var d=h-2;
		    var ch=r2.ch-d*FCH_HIT;
		    for (var i=0; i<d; i++) sh.addstress();
		    return {ch:ch,e:r2.e};
		}
		return r2;
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
		    this.addshield(1);
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
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return self.isactive&&this.targeting.indexOf(targetunit)>-1;
		}.bind(sh), 
		f:function(m,n) {
		    var f=FCH_focus(m);
		    this.log("%0 %FOCUS% -> %0 %HIT% [%1]",f,self.name);
		    this.removetarget(targetunit);
		    return m-FCH_FOCUS*f+FCH_HIT*f;
		}.bind(sh),str:"target"});
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
	    var self=sh;
	    sh.wrap_before("beginactivationphase",this,function() {
		this.donoaction([{type:"CREW",org:mod,name:mod.name,action:function(n) {
		    mod.desactivate();
		    for (var i in squadron) {
			if (squadron[i].team==self.team) 
			    squadron[i].wrap_after("getmaneuver",mod,function(m) {
				if (m.difficulty=="RED") 
				    m.difficulty="WHITE";
				return m;
			    }).unwrapper("endactivationphase");
		    }
		    this.endnoaction(n,"CREW");
		}.bind(this)}],"",true);
	    })
	},

        points: 4,
    },
    {
        name: "Targeting Coordinator",
        type: CREW,
        limited: true,
	done:true,
        points: 4,
    },

    {
        name: "Lando Calrissian",
        faction:REBEL,
        type: CREW,
        unique: true,
	done:true,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this;
	    var str="";
	    if (!this.isactive) return;
	    this.unit.defenseroll(2).done(function(roll) {
		var f=FE_focus(roll.roll);
		var e=FE_evade(roll.roll);
		for (var i=0; i<f; i++) this.addfocustoken(); 
		if (f>0) str+=" +"+f+" %FOCUS%"; 
		for (var i=0; i<e; i++) this.addevadetoken(); 
		if (e>0) str+=" +"+e+" %EVADE%"; 
		if (str=="") this.log("no effect [%0]",self.name); else this.log(str+" [%0]",self.name);
		this.endaction(n,"CREW");
	    }.bind(this.unit));
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
			p[i].log("+1 %STRESS% [%0]",self.name);
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
        candoaction: function() { return this.isactive;	},
	action: function(n) {
	    var self=this;
	    if (!this.isactive) return;
	    var p=this.unit.selectnearbyally(2);
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
            sh.wrap_after("getmaneuverlist",this,function(list) {
		var gd=this.getdial();
		var p=list;
		for (var i in list) {
		    var speed=list[i].move.substr(-1);
		    for (var j=0; j<gd.length; j++) 
			if (gd[j].move.substr(-1)==speed
			    &&typeof p[gd[j].move]=="undefined") { 
			    p[gd[j].move]={move:gd[j].move,difficulty:"RED",halfturn:false};
			}
		}
		return p;
	    });
	},
    },
    {
        name: "Dash Rendar",
        faction:REBEL,
        unique: true,
	done:true,
	init: function(sh) {
	    sh.wrap_after("isfireobstructed",this,function() { return false; });
	    sh.wrap_after("getobstructiondef",this,function() { return 0; });
	},
        type: CREW,
        points: 2,
        
    },
    {
        name: "Lone Wolf",
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank"],
		n:function() { return 1;},
		req:function(a,w,defender) {
		    var p=this.unit.selectnearbyally(2);
		    if (p.length==0&&self.isactive) {
			this.unit.log("+1 blank reroll [%0]",self.name);
		    }
		    return p.length==0&&self.isactive; 
		}.bind(this)});
	    sh.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
		dice:["blank"],
		n:function() { return 1;},
		req:function(attacker,w,defender) {
		    var p=this.unit.selectnearbyally(2);
		    if (p.length==0&&self.isactive) {
			this.unit.log("+1 blank reroll [%0]",self.name);
		    }
		    return p.length==0&&self.isactive; 
		}.bind(this)});
	},
        unique: true,
        type: ELITE,
        points: 2,
    },
    {
        name: "'Leebo'",
        faction:REBEL,
        unique: true,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    if (!this.isactive) return;
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
		var p=targetunit.selectnearbyunits(1,function(t,o) { return o != targetunit; });
		this.selectunit(p,function(p,k) {
		    p[k].log("+%1 %HIT% [%0]",self.name,1);
		    p[k].resolvehit(1); 
		    p[k].checkdead();
		},["select unit [%0]",self.name],false);
	    });
	},
    },
    {
        name: "Intimidation",
	done:true,
        init: function(sh) {
	    var unit=this.unit;
	    var self=this;
	    Unit.prototype.wrap_after("getagility",this,function(a) {
		if (this.team!=unit.team&&a>0&&(typeof this.touching!="undefined")) 
		    if (this.touching.indexOf(unit)>-1) {
			this.log("-1 agility [%0]",self.name);
			return a-1;
		    }
		return a;
	    });
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
		if (this.criticals.length>0&&this.candoevade()) {
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
	    var crew=this;
	    var newdeal=function(c,f,p) {
		var pp=$.Deferred();
		p.then(function(cf) {
		    var i,cr=[];
		    if ((cf.crit.lethal&&this.hull+this.shield<=2&&cf.face==FACEUP)||this.hull+this.shield==1) {
			for (i=0; i<this.upgrades.length; i++) {
			    var upg=this.upgrades[i];
			    if (upg.type==CREW&&upg!=crew&&upg.isactive) cr.push(upg);
			}
			cr.push(crew);
			cr[0].desactivate();
			this.log("discard %0 to remove critical %1 [%2]",cr[0].name,c.name,crew.name);
			pp.resolve({crit:cf.crit,face:FACEDOWN});
			return false;
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    }
	    sh.wrap_after("deal",this,newdeal);
	},
    },
    {
        name: "Ion Torpedoes",
	requires:"Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
	done:true,
	prehit: function(t,c,h) {
	    t.addiontoken();
	    var r=t.getrangeallunits();
	    for (var i=0; i<r[1].length; i++) {
		squadron[r[1][i].unit].log("+1 ion token [%0]",this.name);
		squadron[r[1][i].unit].addiontoken();
	    }
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
		var p=this.selectnearbyally(1,function(a,b) { return a.getskill()<b.getskill(); });
		if (this.canusefocus()) {
		    this.selectunit(p,function(p,k) {
			p[k].wrap_after("getagility",self,function(a) { return a+1; }).unwrapper("endcombatphase"); 
			this.removefocustoken();
		    },["select unit (or self to cancel) [%0]",self.name],true);
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
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return this.canusefocus()&&self.isactive;
		}.bind(sh),
		f:function(m,n) {
		    var f=FCH_focus(m);
		    this.removefocustoken();
		    displayattacktokens(this);
		    if (f>0) {
			this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
			return m-FCH_FOCUS+FCH_CRIT;
		    }
		    return m;
		}.bind(sh),str:"focus"});
	},   
        type: ELITE,
        points: 1,
    },
    {
        name: "Accuracy Corrector",
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return self.isactive; 
		},
		f:function(m,n) {
		    this.log("replace all dice by 2 %HIT% [%0]",self.name);
		    return {m:2,n:2};
		}.bind(sh),str:"hit"});
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
		    return !this.hasmoved&&upg.isactive&&this.ionized==0; 
		}.bind(this),function() {
		    upg.desactivate();
		    this.addstress();
		    this.wrap_after("getmaneuver",upg,function(m) {
			return {move:"F0",difficulty:"WHITE"};
		    }).unwrapper("endactivationphase");
		    this.show();
		}.bind(this), A[ILLICIT.toUpperCase()].key,$("<div>").attr({class:"symbols"}));
		return this.activationdial;
	    });
	},
        type: ILLICIT,
        points: 1,
    },
    { name:"Tractor Beam",
      type:CANNON,
      points:1,
      attack:3,
      done:true,
      prehit: function(t,c,h) {
	  this.unit.hitresolved=0;
	  this.unit.criticalresolved=0;
	  t.log("+1 tractor beam token [%0]",this.name);
	  t.addtractorbeam(this);
      },
      range:[1,3]
    },
    {
        name: "Flechette Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	prehit: function(t,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=1;
	    t.log("+1 %HIT%, +1 %STRESS% [%0]",this.name);
	    if (t.stress==0) t.addstress();
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
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    if (sh.weapons[sh.activeweapon]==this) return self.isactive;
		    return false;
		}.bind(this),
		f:function(m,n) {
		    var h=m%10;
		    if (h>0) {
			this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
			return m+9;
		    }
		    return m;
		}.bind(sh),str:"hit"});
	},
        range: [1,3],
    },
    {
        name: "Dead Man's Switch",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("dies",this,function() {
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
		this.selectunit(this.selectnearbyenemy(1),function(p,k) {
		    this.resolvehit(1);
		    this.addiontoken();
		    SOUNDS.explode.play();
		    p[k].resolvehit(1);
		    p[k].checkdead();
		    this.checkdead();
		    this.hasfired=true;
		    this.hasdamaged=true;
		}, ["select unit (or self to cancel) [%0]",self.name],true);
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
	    var self=this;
	    var newdeal=function(c,f) {
		this.log("first damage is a faceup damage [%0]",self.name);
		return {crit:cf.crit,face:FACEUP};
	    };
            sh.wrap_before("hashit",this,function(t) {
		if (this.greedoa<round) {
		    this.greedoa=round;
		    var adeal=t.deal;
		    t.deal=function(c,f) {
			this.deal=adeal;
			return adeal.call(this,c,FACEUP);
		    }
		}
	    });
	    sh.wrap_before("evadeattack",this,function(t) {
		if (this.greedod<round) {
		    this.greedod=round;
		    var tdeal=this.deal;
		    this.deal=function(c,f) { 
			this.deal=tdeal; 
			return tdeal.call(this,c,FACEUP); 
		    };
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
	    var self=this;
	    var newdeal=function(c,f,p) {
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.crit.type=="ship"&&cf.face==FACEUP) {
			self.desactivate();
			this.log("remove critical %0 [%1]",cf.crit.name,self.name);
			pp.resolve({crit:cf.crit,face:DISCARD});
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    sh.wrap_after("deal",this,newdeal);
	},
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
	    var self=this;
	    sh.wrap_after("handledifficulty",this,function(d) {
		var p=[];
		if (this.lastdrop==round) return;
		for (var i=0; i<this.bombs.length; i++) {
		    var b=this.bombs[i];
		    if (typeof b.action=="undefined"&&b.isactive) {
			p.push({type:"BOMB",name:b.name,org:self,action:function(n) {
			    this.actiondrop(n);
			}.bind(b)});
		    }
		}
		this.donoaction(p,"",true);
	    });
	},
        type: SALVAGED,
        points: 0,
    },
    {
        name: "Unhinged Astromech",
        type: SALVAGED,
	done:true,
        install: function(sh) {
	    var save=[];
	    var self=this;
	    sh.wrap_after("getdial",this,function(gd) {
		if (save.length==0) {
		    for (var i=0; i<gd.length; i++) {
			var d=gd[i].difficulty;
			var move=gd[i].move;
			if (move.match(/[A-Z]+3/)) {
			    this.log("%0 is green [%1]",move,self.name);
			    d="GREEN";
			}
			save[i]={move:move,difficulty:d};
		    }
		}
		return save;
	    });
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap(this);
	},
        points: 1,
    },
    {
        name: "R4-B11",
        unique: true,
        type: SALVAGED,
        points: 3,
	done:true,
	init: function(sh) {
	    sh.adddicemodifier(ATTACK_M,REROLL_M,DEFENSE_M,this,{
		dice:["evade","focus","blank"],
		n:function() { return 9; },
		req: function() { return (this.targeting.indexOf(targetunit)>-1) }.bind(this),
		f:function() { this.removetarget(targetunit); }.bind(this)
	    });
	},
    },
    {
        name: "Autoblaster Turret",
        type: TURRET,
	firesnd:"falcon_fire",
	done:true,
        points: 2,
        attack: 2,
	declareattack: function(target) {
	    var self=this;
	    target.wrap_after("cancelhit",self,function(r,org,r2) {
		self.unit.log("%HIT% cannot be cancelled [%0]",self.name);
		return r;
	    }).unwrapper("endbeingattacked");
	    Weapon.prototype.declareattack.call(this,target);
	},
        range: [1,1],
    },
    {
        name: "R4 Agromech",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("declareattack",this,function(w,target) {
		this.wrap_before("removefocustoken",self,function() {
		    if (this.targeting.length==0) {
			this.log("+1 %TARGET% / %1 [%0]",self.name,targetunit.name);
			this.addtarget(targetunit);
			displayattacktokens(this);
		    }
		}).unwrapper("endattack");
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
		if (d=="GREEN")
		    this.selectunit(this.gettargetableunits(3),function(p,k) {
			this.addtarget(p[k]);
			this.log("+1 %TARGET% / %1 [%0]",self.name,p[k].name);
		    },["select unit (or self to cancel) [%0]",self.name],true);
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
	    sh.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return this.targeting.indexOf(targetunit)>-1&&self.isactive==true; 
		}.bind(sh),
		f:function(m,n) {
		    if (this.targeting.indexOf(targetunit)>-1) {
			this.log("+1 %CRIT% [%0]",self.name);
			$("#atokens > .xtargettoken").remove();
			return {m:m+10,n:n+1};
		    } else return {m:m,n:n};
		}.bind(sh),str:"critical"})
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
		upg.desactivate(); 
		this.log("%0 is hit => destroyed",upg.name);
		this.show();
	    })
	},
        points: 3,
    },
    {
        name: "Shield Upgrade",
	type:MOD,    
	done:true,
	install: function(sh) {
	    sh.shield++; sh.ship.shield++;
	},
	uninstall:function(sh) {
	    sh.shield--; sh.ship.shield--;
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
		if (upg.isactive&&t.team!=this.team) {
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
	    sh.hull++; sh.ship.hull++;
	},     
	uninstall:function(sh) {
	    sh.hull--; sh.ship.hull--;
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
		return true;
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
	install: function(sh) {
	    sh.shipimg="b-wing-1.png";
	},
	uninstall: function(sh) {
	    sh.shipimg="b-wing-2.png";
	},
    },
    {
        name: "Countermeasures",
	type:MOD,
        islarge:true,
	done:true,
	init: function(sh) {
	    var mod=this;
	    sh.wrap_before("begincombatphase",this,function() {
		this.donoaction([{action:function(n) {
		    mod.desactivate();
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
	done:true,
	init: function(sh) {
	    Unit.prototype.wrap_after("getobstructiondef",this,function(t,ob) {
		if (this.team!=sh.team&&ob==0) {
		    OBSTACLES.push(sh);
		    ob=this.getoutlinerange(this.m,sh).o?1:0;
		    OBSTACLES.splice(OBSTACLES.indexOf(sh),1);
		}
		return ob;
	    });
	}
    },
    {
        name: "Autothrusters",
	type:MOD,
        actionrequired:"Boost",
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    if (activeunit.getsector(this)>2) return self.isactive;
		    return false;
		}.bind(sh),
		f:function(m,n) {
		    var b=FE_blank(m,n);
		    if (b>0) {
			this.log("1 blank -> 1 %EVADE% [%0]",self.name);
			m=m+FE_EVADE;
		    }
		    return m;
		}.bind(sh),
		str:"blank"});
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
	    sh.wrap_after("gettargetableunits",this,function(n) {
		var p=[];
		for (i in squadron) 
		    if (squadron[i].team!=this.team) p.push(squadron[i]);
		return p;
	    });
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
	exclusive:true,
	install: function(sh) {
	    sh.shipimg="a-wing-1.png";
	},
	uninstall:function(sh) {
	    sh.shipimg="a-wing-2.png";
	},
    },
    {
        name: "Outrider",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var i;
	    for (i=0; i<sh.weapons.length; i++) {
		if (sh.weapons[i].type==CANNON) {
		    sh.weapons[0].desactivate();
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
	    sh.wrap_after("doendmaneuveraction",this,function() {
		if (this.candoaction()&&this.collision) {
		    this.log("+1 free action [%0]",self.name);
		    this.doaction(this.getactionlist());
		    this.addstress();
		}
	    });
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
		for (i in squadron) {
		    var u=squadron[i];
		    if (u!=sh&&u.ig2000==true&&u.team==sh.team) {
			if (u.name=="IG-88A") {
			    sh.cleanupattack=u.cleanupattack;}
			if (u.name=="IG-88B") { 
			    sh.endattack=u.endattack;
			}
			if (u.name=="IG-88C") {
			    sh.resolveboost=u.resolveboost;
			}
			if (u.name=="IG-88D") {
			    sh.getmaneuverlist=u.getmaneuverlist;
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
	    var turret=-1;
	    var self=this;
	    for (var i=0; i<sh.weapons.length; i++) {
		if (sh.weapons[i].type==TURRET) {
		    turret=i;
		    break;
		}
	    }
	    if (turret==-1) return;
	    sh.weapons[turret].isTurret=function() { return false; };
	    sh.wrap_after("isTurret",this,function(w,b) {
		return (w!=sh.weapons[turret]&&b);
	    });
	    var btl=-1;
	    sh.wrap_before("endattack",this,function(c,h) {
		if (btl<round&&turret>-1&&this.weapons[this.activeweapon].isprimary) {
		    this.log("+1 attack with %0 [%1]",this.weapons[turret].name,self.name);
		    this.selecttargetforattack(turret);
		}
	    });
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
	install: function(sh) { sh.ordnance=true;  },
	uninstall: function(sh) { sh.ordnance=false;  }
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
	/*
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
	},*/
	candoaction: function() { return  this.unit.lastdrop!=round&&this.isactive; },
	action: function(n) {   this.actiondrop(n);  },
	canbedropped: function() { return false; },
        explode: function() {},
	detonate: function(t) {
	    if (!this.exploded) {
		var roll=this.unit.rollattackdie(2);
		for (var i=0; i<2; i++) {
		    if (roll[i]=="hit") {
			t.log("+1 %HIT% [%0]",this.name); 
			t.resolvehit(1); 
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
	activated: -1,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("begincombatphase",this,function(lock) {
		if (self.isactive) {
		    this.donoaction([
			{org:self,name:self.name,type:"ILLICIT",action:function(n) {
			    this.addstress();
			    self.isactive=false;
			    self.activated=round;
			    this.endnoaction(n,"ILLICIT");
			}.bind(this)}],"",true);
		}
		return lock;
	    });
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return self.activated==round;
		},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.unit.log("%FOCUS% -> %HIT% [%0]",self.name);
			m=m-FCH_FOCUS*f+f*FCH_HIT;
		    }
		    return m;
		}.bind(this),str:"focus"});
	    sh.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return self.activated==round;
		},
		f:function(m,n) {
		    var f=FE_focus(m);
		    if (f>0) {
			this.unit.log("%FOCUS% -> %EVADE% [%0]",self.name);
			m=m-FE_FOCUS*f+FE_EVADE*f;
		    }
		    return m;
		}.bind(this),str:"focus"});
	},
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
		if (roll=="focus"&&this.iscloaked&&self.isactive==true) {
		    this.log("decloaked [%0]",self.name);
		    self.isactive=false;
		    this.wrap_after("getdecloakmatrix",self,function(m,l) {
			return l.concat(m);
		    });
		    this.resolvedecloak();
		}
	    });
	},
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
	  var req=function() {
	      if (this.stress>0) {
		  this.log("+%1 %FOCUS% reroll(s) [%0]",self.name,this.focus);
		  return self.isactive;
	      } else return false;
	  }.bind(sh);
	  sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
	      dice:["focus"],
	      n:function() { return 9; },
	      req:req});
	  sh.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
	      dice:["focus"],
	      n:function() { return 9; },
	      req:req});
      },
      done:true,
      points:1,
    },
    { name:"Cool Hand",
      type: ELITE,
      points:1,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.wrap_after("addstress",this,function() {
	      /* No stress action ? as.call(this);*/
	      this.stress++;
	      this.donoaction([{type:FOCUS,name:self.name,org:self,
				action:function(n) {
				    self.desactivate();
				    this.addfocustoken();
				    this.endnoaction(n,"ELITE");
				}.bind(this)},
			       {type:EVADE,name:self.name,org:self,
				action:function(n) {
				    self.desactivate();
				    this.addevadetoken();
				    this.endnoaction(n,"ELITE");
				}.bind(this)}],
			      "Add %EVADE% or %FOCUS% instead of %STRESS% token",
			      true);
	  });
      },
    },
    { name:"Juke",
      type: ELITE,
      points:2,
      islarge:false,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
	      req:function() { return this.evade>0; },
	      f:function(m,n) {
		  var e=FE_evade(m);
		  if (e>0) {
		      targetunit.log("%EVADE% -> %FOCUS% [%0]",self.name); 
		      m=m-FE_EVADE+FE_FOCUS;
		  }
		  return m;
	      },str:"evade"});
      }
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
		    this.donoaction([{type:"ELITE",name:u.name,org:u,action:function(n) {
			u.desactivate();
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
	prehit: function(target,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    target.log("+%1 %HIT% [%0]",this.name,1);
	},	
	init: function(sh) {
	    var self=this;
	    var tlt=-1;
	    sh.wrap_after("cleanupattack",this,function() {
		if (tlt<round&&this.usedweapon>-1&&!targetunit.dead
		    &&this.weapons[this.usedweapon]==self) {
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
	consumes:true,
	done:true,
	posthit: function(t,c,h) {
	    if (t.shield>0) t.log("-1 %SHIELD% [%0]",this.name);
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
	candoaction: function() { return this.unit.lastdrop!=round&&this.isactive; },
	action: function(n) {   this.actiondrop(n);  },
	canbedropped: function() { return false; },
	explode: function() {},
	detonate:function(t) {
	    if (!this.exploded) {
		var roll=this.unit.rollattackdie(1)[0];
		if (roll=="hit") { 
		    t.log("+1 %HIT% [%0]",this.name); 
		    t.resolvehit(1); 
		    t.checkdead(); }
		else if (roll=="critical") { 
		    t.log("+1 %CRIT% [%0]",this.name); 
		    t.resolvecritical(1);
		    t.checkdead();
		}
		t.log("+2 ion tokens [%0]",this.name);
		t.addiontoken();
		t.addiontoken();
		t.log("%1 skips action phase [%0]",this.name,t.name);
		t.wrap_after("candoendmaneuveraction",this,function() {
		    return false;
		}).unwrapper("endactivationphase");
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
	},
    },
    {name:"Agent Kallus",
     type:CREW,
     faction:EMPIRE,
     points:2,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("beginactivationphase",self,function(l) {
	     if (round==0) {
		 this.selectunit(this.selectnearbyenemy(4),function(p,k) {
		     self.nemesis=p[k];
		     this.log("%0 chosen as nemesis [%1]",p[k].name,self.name);
		     this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,self,{
			 req:function() { return targetunit==self.nemesis; },
			 f: function(n,m) {
			     var f=FCH_focus(m);
			     if (f>0) {
				 m=m-FCH_FOCUS+FCH_HIT;
				 this.log("%FOCUS% -> %HIT% [%0]",self.name);
			     }
			     return m;
			 },str:"focus"});
		     this.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,self,{
			 req:function() { return activeunit==self.nemesis; },
			 f: function(n,m) {
			     var f=FE_focus(m);
			     if (f>0) {
				 m=m-FE_FOCUS+FE_EVADE;
				 this.log("%FOCUS% -> %EVADE% [%0]",self.name);
			     }
			     return m;
			 },str:"focus"});
		 },["select unit [%0]",self.name],false);
	     } else this.beginactivationphase.unwrap(self);
	     return l;
	 });
     }
    },
    {
        name: "'Crack Shot'",
        type: ELITE,
        points: 1,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
		req:function() {
		    return this.isinfiringarc(targetunit)&&self.isactive;
		}.bind(sh),
		f:function(m,n) {
		    self.desactivate();
		    if (FE_evade(m)>0) {
			sh.log("-1 %EVADE% [%0]",self.name);
			m=m-FE_EVADE;
		    } 
		    return m;
		},str:"evade"});
	}
    },
    {
        name: "Advanced Homing Missiles",
        type: MISSILE,
        points: 3,
	requires:"Target",
	consumes:false,
        attack: 3,
        range: [2,2],
	done:true,
	prehit: function(t,c,h) {
	    t.log("+1 %CRIT% [%0]",this.name);
	    t.applycritical(1);
	    this.unit.hitresolved=0;
	    this.unit.criticalresolved=0;
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
	    sh.wrap_after("getdial",this,function(gd) {
		if (save.length==0) 
		    for (var i=0; i<gd.length; i++) {
			var move=gd[i].move;
			var d=gd[i].difficulty;
			if (move.match(/BL\d|BR\d/)) d="GREEN";
			save[i]={move:move,difficulty:d};
		    }
		return save;
	    })
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap(this);
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
	    sh.wrap_after("getmaneuverlist",self,function(list) {
		var p=list;
		for (var i in list) {
		    if (i.match(/TR\d|TL\d/)) {
			this.log("change turn into a bank [%0]",self.name);
			var m=i.replace(/T/,"B");
			p[m]={move:m,difficulty:list[i].difficulty,halfturn:list[i].halfturn};
		    }
		}
		return p;
	    }.bind(sh));
	}
    },
    {
        name: "Hound's Tooth",
        points: 6,
	type:TITLE,
        unique: true,
        ship: "YV-666",
	done:true,
	getdeploymentmatrix:function(u) {
	    var gd=u.getdial();
	    var p=[];
	    for (var i=0; i<gd.length; i++) {
		var m0=this.unit.m.clone().translate(0,20).rotate(180,0,0);
		p.push(u.getpathmatrix(m0,gd[i].move));
	    }
	    for (var i=0; i<gd.length; i++) {
		var m0=this.unit.m.clone().translate(0,-20);
		p.push(u.getpathmatrix(m0,gd[i].move));
	    }
	    return p;
	},
	init: function(sh) {
	    var self=this;
	    // find or clone the pilot
	    var i,found=-1;
	    for (i in squadron) 
		if (squadron[i].name=="Nashtah Pup Pilot") { found=i; break; }
	    if (found>-1) {
		p=squadron[found];
		p.skill=sh.skill;
	    } else {
		for (i=0; i<PILOTS.length; i++) {
		    if (PILOTS[i].name=="Nashtah Pup Pilot") break;
		}
		p=new Unit(sh.team,i);
		p.upg=[];
		p.skill=sh.skill;
		p.tosquadron(s);
		allunits.push(p);
		squadron.push(p);
		TEAMS[sh.team].units.push(p);
	    }
	    p.dock(sh);
	    p.show();
	    sh.wrap_before("dies",self,function() {
		var u=this.docked;
		this.init.call(u); // Copy capacities
		this.hasfired=false;
		u.wrap_before("endround",u,function() {
		    this.hasmoved=false;
		});
		u.wrap_after("canfire",u,function() { return false; }).unwrapper("endround");
		//this.doselection(function(n) {
		u.deploy(this,self.getdeploymentmatrix(u));
		//    this.endnoaction(n,"TITLE");
		//}.bind(this));
	    });
	}
    },
    {
	name: "XX-23 S-Thread Tracers",
	points:1,
	type:MISSILE,
	range:[1,3],
	attack:3,
	done:true,
	requires:"Focus",
	consumes:false,
	prehit:function(t,c,h) {
	    var p=this.unit.selectnearbyally(2);
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
	done:true,
	getrangeattackbonus: function(sh) {
	    var r=this.getrange(sh);
	    if (r==1) {
		this.unit.log("+1 attack for range 1");
		return 1;
	    }
	    return 0;
	}
    },
    { name:"'Chopper'",
      type:CREW,
      points:0,
      done:true,
      init: function() {
	  this.wrap_after("begincombatphase",this,function(lock) {
	      for (var i=0; i<this.touching.length; i++) {
		  var u=this.touching[i];
		  if (u.team!=this.team) {
		      u.log("+1 %STRESS% [%0]",this.name);
		      u.addstress();
		  }
	      }
	      return lock;
	  });
      },
      faction:REBEL,
      unique:true
    },
    { name:"Hera Syndulla",
      type:CREW,
      points:1,
      faction:REBEL,
      done:true,
      init: function(sh) {
	  sh.wrap_after("canreveal",this,function(d,b) {
	      if (d.difficulty=="RED"&&this.stress>0) return true;
	      return b;
	  }); 
      },
      unique:true
    },
    { name:"'Zeb' Orrelios",
      type:CREW,
      points:1,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  Unit.prototype.wrap_after("checkcollision",this,function(t,b) {
	      if (t==sh&&sh.isinfiringarc(t)) return false;
	      return b;
	  });
	  sh.wrap_after("checkcollision",this,function(t,b) {
	      if (sh.isinfiringarc(t)) return false;
	      return b;
	  });
      }
    },
    { name:"Ezra Bridger",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	      req:function(m,n) {
		  return self.isactive&&(sh.stress>0);
	      }.bind(this),
	      f:function(m,n) {
		  var f=FCH_focus(m);
		  if (f>0) {
		      this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",this.name);
		      return m-FCH_FOCUS+FCH_CRIT;
		  }
		  return m;
	      }.bind(this),str:"focus"});
      },
    },
    { name:"Kanan Jarrus",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  Unit.prototype.wrap_after("handledifficulty",self,function(difficulty) {
	      if (difficulty=="WHITE"&&this.stress>0
		  &&this.team==self.team&&this.getrange(self)<=2) {
		  this.log("-1 %STRESS% [%0]",self.name);
		  this.removestresstoken();
	      }
	  });
      }
    },
    { name:"Sabine Wren",
      type:CREW,
      points:2,
      upgrades:[BOMB],
      faction:REBEL,
      unique:true,
      done:true,
      rd:-1,
      init: function(sh) {
	  var self=this;
	  Bomb.prototype.wrap_after("explode",this,function() {
	      var p=[self.unit];
	      if (self.rd==round||this.unit.team!=self.team) return;
	      for (var i in squadron) {
		  var u=squadron[i];
		  if (this.unit.team!=u.team&&this.getrange(squadron[i])==1) p.push(u); 
	      }
	      this.unit.selectunit(p,function(p,k) {
		  if (k==0) return;
		  p[k].log("+1 %HIT% [%0]",self.name);
		  p[k].resolvehit(1);
		  self.rd=round;
		  SOUNDS.explode.play();
		  p[k].checkdead();
	      },["select unit (or self to cancel) [%0]",self.name],false);
	  });
      }
    },
    {
	name:"Ghost",
	type:TITLE,
	points:0,
	unique:true,
	done:true,
	getdeploymentmatrix:function(u) {
	    var gd=u.getdial();
	    var p=[];
	    for (var i=0; i<gd.length; i++) {
		var m0=this.unit.m.clone().translate(0,20).rotate(180,0,0);
		p.push(u.getpathmatrix(m0,gd[i].move));
	    }
	    return p;
	},
	init: function(sh) {
	    var phantom=-1;
	    var self=this;
	    for (var i in squadron) {
		var u=squadron[i];
		if (u.team==sh.team&&sh!=u) {
		    for (var j=0; j<u.upgrades.length; j++) {
			var upg=u.upgrades[j];
			if (upg.name=="Phantom") { phantom=i; break; }
		    }
		}
		if (phantom!=-1) break;
	    }
	    if (phantom!=-1) {
		var u=squadron[phantom];
		if (TEAMS[sh.team].isia==true) u=$.extend(u,IAUnit.prototype);
		u.dock(sh);
		sh.weapons[0].auxiliary=function(i,m) { return this.getPrimarySectorString(i,m.clone().rotate(180,0,0)); };
		sh.weapons[0].subauxiliary=function(i,j,m) { return this.getPrimarySubSectorString(i,j,m.clone().rotate(180,0,0)); };
		sh.weapons[0].type="Bilaser";
		sh.wrap_after("endmaneuver",this,function() {
		    if (this.docked) {
			u.donoaction([{org:self,type:"TITLE",name:self.name,action:function(n) {

			    this.weapons[0].auxiliary=undefined;
			    this.weapons[0].subauxiliary=undefined;
			    this.weapons[0].type="Laser";
			    u.deploy(this,self.getdeploymentmatrix(u));
			    u.endnoaction(n,"TITLE");
			}.bind(this)}],"",true);
		    }
		});
	    } else sh.log("Phantom not found");
	},
	ship:"VCX-100"
    },
    {name:"Phantom",
     type:TITLE,
     points:0,
     unique:true,
     done:true,
     ship:"Attack Shuttle"
    },
    {name:"Reinforced Deflectors",
     points:3,
     type:SYSTEM,
     islarge:true,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_before("resolveishit",this,function(t) {
	     self.damage=0;
	     this.wrap_before("removehull",self,function(n) {
		 self.damage+=n;
	     });
	     this.wrap_before("removeshield",self,function(n) {
		 self.damage+=n;

	     }); 
	     this.wrap_before("endbeingattacked",self,function(c,h,t) {
		 if (self.damage>=3) {
		     this.log("+1 %SHIELD% [%0]",self.name);
		     this.addshield(1);
		 }
		 this.removeshield.unwrap(self);
		 this.removehull.unwrap(self);
		 this.endbeingattacked.unwrap(self);
	     });
	 });
     }
    },
    {name:"Targeting Astromech",
     points:2,
     type:ASTROMECH,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("handledifficulty",this,function(d) {
	     if (d=="RED")
		 this.selectunit(this.gettargetableunits(3),function(p,k) {
		     this.addtarget(p[k]);
		 },["select target or self to cancel [%0]",self.name],true);
	 });
     },
    },
    {name:"TIE/x7",
     points:-2,
     type:TITLE,
     lostupgrades:[CANNON,MISSILE],
     ship:"TIE Defender",
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_before("endmaneuver",this,function() {
	     if (this.getdial()[this.maneuver].move.match(/[345]/)) {
		 this.log("+1 %EVADE% [%0]",self.name);
		 this.addevadetoken();
	     }
	 });
     }
    },
    {name:"TIE/D",
     points:0,
     type:TITLE,
     ship:"TIE Defender",
     done:true,
     init: function(sh) {
	 var ea=sh.endattack;
	 var self=this;
	 sh.endattack=function(c,h) {
	     var w=this.weapons[0];
	     var w1=this.weapons[this.activeweapon];
	     if (w1.type==CANNON&&w1.point<=3&&w.isactive) {
		 this.log("2nd attack with %0 [%1]",w.name,self.name);
		 this.selecttargetforattack(0); 
	     } else ea.call(this,c,h);
	 }
     }
    },
    {name:"TIE Shuttle",
     points:0,
     done:true,
     type:TITLE,
     ship:"TIE Bomber",
     maxupg:4,
     lostupgrades:[TORPEDO,MISSILE,BOMB],
     upgrades:[CREW,CREW]
    },
    {name:"Guidance Chips",
     points:0,
     type:MOD,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req: function(m,n) {
		 var t=this.weapons[this.activeweapon].type;
		 if (t==TORPEDO||t==MISSILE) return true;
		 return false;
	     }.bind(sh),
	     f: function(m,n) {
		 var b=FCH_blank(m,n);
		 var f=FCH_focus(m);
		 var h=FCH_hit(m);
		 var to=FCH_HIT;
		 var s="%HIT%";
		 if (this.weapons[0].isactive&&this.weapons[0].getattack()>=3) {
		     to=FCH_CRIT;
		     s="%CRIT%";
		 }
	     	 if (b>0) { sh.log("+1 "+s+" [%0]",self.name); m+=to; }
		 else if (f>0) { sh.log("%FOCUS% -> "+s+" [%0]", self.name); m+=to-FCH_FOCUS;}
		 else if (h>0&&to==FCH_CRIT) { sh.log("%HIT% -> %CRIT% [%0]",self.name); m+=to-FCH_HIT; }
		 return m;
	     }.bind(sh),str:"target"
	 });
     }
    },
    {name:"TIE/v1",
     ship:"TIE Adv. Prototype",
     points:1,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("addtarget",this,function(t) {
	     if (self.isactive&&this.candoaction()&&this.candoevade()) 
		 this.doaction([this.newaction(this.addevade,"EVADE")]);
	 });
     },
     type:TITLE
    },
    {name:"Zuckuss",
     faction:SCUM,
     points:1,
     unique:true,
     done:true,
     type:CREW,
     init: function(sh) {
	 var self=this;
	 sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
	     req: function(m,n) { return true; },
	     f:function(m,n) {
		 var f=FE_focus(m);
		 if (f>0) {
		     targetunit.log("Reroll %0 %FOCUS% [%1]",f,self.name);
		     sh.log("+%0 %STRESS% [%1]",f,self.name);
		     var roll=sh.rolldefensedie(f);
		     m-=FE_FOCUS*f;
		     for (var i=0; i<f; i++) {
			 sh.addstress();
			 if (roll[i]=="evade") m+=FE_EVADE;
			 if (roll[i]=="focus") m+=FE_FOCUS;
		     }
		 }
		 return m;
	     },str:"focus"});
	 sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
	     req: function(m,n) { return true; },
	     f:function(m,n) {
		 var f=FE_evade(m);
		 if (f>0) {
		     targetunit.log("Reroll %0 %EVADE% [%1]",f,self.name);
		     sh.log("+%0 %STRESS% [%1]",f,self.name);
		     var roll=sh.rolldefensedie(f);
		     m-=FE_EVADE*f;
		     for (var i=0; i<f; i++) {
			 sh.addstress();
			 if (roll[i]=="evade") m+=FE_EVADE;
			 if (roll[i]=="focus") m+=FE_FOCUS;
		     }
		 }
		 return m;
	     },str:"evade"});
     },
    },
    {name:"4-LOM",
     faction:SCUM,
     points:1,
     unique:true,
     done:true,
     type:CREW,
     init: function(sh) {
	 sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
	     req: function() { return true; },
	     f: function(m,n) {
		 this.addiontoken();
		 if (targetunit.canuseevade()) {
		     targetunit.wrap_after("canuseevade",this,function(b) {
			 return false;
		     }).unwrapper("endbeingattacked");
		 } else if (targetunit.canusefocus()) {
		     targetunit.wrap_after("canusefocus",this,function() {
			 return false;
		     }).unwrapper("endbeingattacked");
		 }
		 return m;
	     },str:"focus"});
     }
    },
    {name:"Mist Hunter",
     type:TITLE,
     points:0,
     addedaction:"Roll",
     done:true,
     ship:"G-1A Starfighter",
     unique:true,
    },
    {
	name:"Adaptability(+1)",
	type:ELITE,
	points:0,
	done:true,
	install: function(sh) {
	    sh.wrap_after("getskill",this,function(s) {
		return s+1;
	    });
	    sh.showskill();
	},
	uninstall: function(sh) {
	    sh.getskill.unwrap(this);
	    sh.showskill();
	},
    },
    {
	name:"Adaptability(-1)",
	type:ELITE,
	points:0,
	done:true,
	install: function(sh) {
	    sh.wrap_after("getskill",this,function(s) {
		return s-1;
	    });
	    sh.showskill();
	},
	uninstall: function(sh) {
	    sh.getskill.unwrap(this);
	    sh.showskill();
	},
    },
    { 
	name:"Dengar",
	unique:true,
	type:CREW,
	points:3,
	faction:SCUM,
	done:true,
	init: function(sh) {
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { if (targetunit.unique==true) return 2; return 1; },
		req:function(attacker,w,defender) {
		    return this.isactive;
		}.bind(this)
	    });
	}
    },
    {
	name:"'Gonk'",
	unique:true,
	type:CREW,
	points:2,
	faction:SCUM,
	shield:0,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this.unit;
	    if (!this.isactive) return true;
	    self.log("+1 %SHIELD% on %0 [%0]",this.name);
	    this.shield++;
	    self.endaction(n,CREW);
	    return true;
	},
	candoaction2: function() { return this.isactive&&this.shield>0&&this.unit.shield<this.unit.ship.shield; },
	action2:function(n) {
	    var self=this.unit;
	    if (!this.isactive) return true;
	    if (self.shield<self.ship.shield) 
		self.log("+1 %SHIELD% [%0]",this.name)
	    self.addshield(1);
	    this.shield--;
	    self.show();
	    self.endaction(n,CREW);
	    return true;
	},
	done:true
    },
    {
	name:"Boba Fett",
	unique:true,
	type:CREW,
	points:1,
	faction:SCUM,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("hashit",this,function(t) {
		var bu=this;
		t.wrap_after("deal",self,function(c,f,p) {
		    p.then(function(crit) {
			if (crit.face==FACEUP) {
			    var p=[];
			    for (i in t.upgrades) {
				var upg=t.upgrades[i];
				if (upg.type.match(/Missile|Torpedo|Crew|Bomb|Cannon|Turret|Astromech|System|Illicit|Salvaged|Tech|Elite/)) {
				    p.push(upg);
				}
			    }
			    t.log("select upgrade to desactivate [%0]",self.name);
			    bu.selectupgradetodesactivate(p,self);
			}
		    });
		    return p;
		}).unwrapper("endbeingattacked");
	    });
	}
    },
    {
	name:"R5-P8",
	unique:true,
	type:SALVAGED,
	points:3,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("endbeingattacked",this,function(c,h,t) {
		this.donoaction([{name:this.name,org:this,type:"HIT",action:function(n) {
		    var roll=this.rollattackdie(1)[0];
		    this.log("roll 1 attack dice [%0]",self.name);
		    if (roll=="hit"||roll=="critical") { 
			t.log("+1 %HIT% [%1]",self.name)
			t.resolvehit(1); 
			t.checkdead(); 
		    }
		    if (roll=="critical") {
			this.log("+1 %HIT% [%1]",self.name)
			this.resolvehit(1);
			this.checkdead();
		    }
		    this.endnoaction(n,"");
		}.bind(this)}],"",true);

	    });
	}
    },
    {
	name:"Attanni Mindlink",
	type:ELITE,
	points:1,
	done:true,
	init: function(sh) {
	    var self=this;
	    if (typeof Unit.prototype.getattanni=="undefined")
		Unit.prototype.getattanni=function() { return []; }
	    Unit.prototype.wrap_after("getattanni",this,function(p) {
		return p.concat(self.unit);
	    });
	    sh.wrap_after("addfocustoken",this,function() {
		var p=this.getattanni();
		for (var i in p) if (p[i]!=this&&p[i].focus==0) {
		    p[i].addfocustoken();
		    p[i].log("+1 %FOCUS% [%0]",self.name);
		}
	    });
	    sh.wrap_after("addstress",this,function() {
		var p=this.getattanni();
		for (var i in p) if (p[i]!=this&&p[i].stress==0) {
		    p[i].addstress();
		    p[i].log("+1 %STRESS% [%0]",self.name);
		}
	    });
	}
    },
    {
	name:"Rage",
	type:ELITE,
	round:-1,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this.unit;
	    if (!this.isactive) return true;
	    this.unit.log("+1 %FOCUS%, +2 %STRESS%, 3 rerolls [%0]",self.name);
	    this.round=round;
	    self.addfocustoken();
	    self.addstress();
	    self.addstress();
	    self.endaction(n,ELITE);
	    return true;
	},
	init: function(sh) {
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 3; },
		req:function(attacker,w,defender) {
		    return this.isactive&&this.round==round;
		}.bind(this)
	    });
	},
	done:true,
 	points:1
    },
    {
	name:"Punishing One",
	type:TITLE,
	unique:true,
	points:12,
	done:true,
	ship:"JumpMaster 5000",
	install: function(sh) {
	    sh.weapons[0].wrap_after("getattack",this,function(a) {
		return a+1;
	    });
	},
	uninstall: function(sh) {
	    this.unwrap(this);
	},
    },
    {name:"Long Range Scanner",
     type:MOD,
     points:0,
     done:true,
     requiredupg:[TORPEDO,MISSILE],
     init: function(sh) {
	 sh.wrap_after("gettargetableunits",this,function(n,q) {
	     var p=[];
	     if (n<3) return p;
	     for (var i in squadron) {
		 if (squadron[i].team!=this.team) {
		     var r=this.getrange(squadron[i]);
		     if (r>=3) p.push(squadron[i]);
		 }
	     }
	     return p;
	 });
     }
    },
    {name:"Electronic Baffle",
     type:SYSTEM,
     points:1,
    },
    {name:"Overclocked R4",
     type:SALVAGED,
     points:1
    }
];
var factions=["REBEL","EMPIRE"];
var allunits=[];

function Team(team) {
    this.team=team;
    this.isdead=false;
    this.isia=false;
    this.initiative=false;
    this.units=[];
    this.allhits=this.allcrits=this.allevade=this.allred=this.allgreen=0;
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
	$("#totalpts").html(0);
	this.setfaction(faction);
	displayfactionunits();
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
	var s=0;
	var score1=$("#listunits .pts").each(function() {
	    s+=parseInt($(this).text())
	});
	$("#totalpts").html(s);
    },
    addunit:function(n) {
	var u=new Unit(this.team,n);
	$("#listunits").append(""+u);
	this.updatepoints();
    },
    tosquadron:function(s) {
	var team=this.team;
	var sortable = [];
	var i,j;
	var sortable = this.sortedgenerics();
	var team1=0;
	var id=0;
	for (var i in generics) 
	    if (generics[i].team==1) team1++;
	//log("found team1:"+team1);
	for (var i=0; i<sortable.length; i++) {
	    if (this.team==sortable[i].team) {
		sortable[i].id=id++;
		if (sortable[i].team==2) sortable[i].id+=team1;
		var u=sortable[i];
		/* Copy all functions for manual inheritance.  */
		for (var j in PILOTS[u.pilotid]) {
		    var p=PILOTS[u.pilotid];
		    if (typeof p[j]=="function") u[j]=p[j];
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
	    if (u.team==this.team&&typeof u.init=="function") u.init();
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		for (var j=0; j<u.upgrades.length; j++) {
		    var upg=u.upgrades[j];
		    if (typeof upg.init=="function") upg.init(u);
		}
	    }
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		if (this.isia==true) u=$.extend(u,IAUnit.prototype);
	    }
	}
	this.units.sort(function(a,b) {return b.getskill()-a.getskill();});
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
		$("#team1").append("<div id=\""+sq[i].id+"\" onclick='select($(this).attr(\"id\"))'>"+sq[i]+"</div>");
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
    sortedgenerics: function() {
	var sortable=[];
	for (var i in generics) 
	    if (generics[i].team==this.team) sortable.push(generics[i]);
	sortable.sort(function(a,b) {
	    if (typeof a.points=="undefined") log("undefined score");
	    if (a.points<b.points) return -1; 
	    if (a.points>b.points) return 1;
	    return (a.toJuggler(false)<b.toJuggler(false));
	});
	return sortable;
    },
    toASCII: function() {
	var s="";
	var sortable=this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) 
	    s+=sortable[i].toASCII()+";";
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
	var sortable=this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) {
	    var jp=sortable[i].toJSON();
	    pts+=jp.points;
	    sq.push(jp);
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
	var sortable = this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) 
	    s+=sortable[i].toJuggler(translated)+"\n";
	return s;
    },
    parseJuggler : function(str,translated) {
	var f,i,j,k;
	var pid=-1;
	var getf=function(f) {
	    if (f=="REBEL") return 1;
	    if (f=="SCUM") return 2;
	    return 4;
	};
	var f=7;
	var pilots=str.trim().split("\n");
	var del=[];
	for (i in generics) { 
	    if (generics[i].team==this.team) delete generics[i];
	}
	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    var lf=0;
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var va=v;
		if (translated==true) va=translate(va);
		if (PILOTS[j].ambiguous==true) va+="("+PILOTS[j].unit+")";
		if (va.replace(/\'/g,"")==pstr[0]) {
		    lf=lf|getf(PILOTS[j].faction);
		}
	    }
	    f=f&lf;
	}
	if ((f&1)==1) this.faction="REBEL"; else if ((f&2)==2) this.faction="SCUM"; else this.faction="EMPIRE";
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;

	for (i=0; i<pilots.length; i++) {
	    pid=-1;
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var va=v;
		if (PILOTS[j].faction==this.faction) {
		    if (translated==true) va=translate(va);
		    if (PILOTS[j].ambiguous==true) va+="("+PILOTS[j].unit+")";
		    if (va.replace(/\'/g,"")==pstr[0]) { pid=j; break; }
		} 
	    }
	    if (pid==-1) {
		throw("pid undefined:"+translated+" "+pstr[0]+"#"+this.faction);
	    }
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    var authupg=[MOD,TITLE].concat(PILOTS[p.pilotid].upgrades);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) {
		    if ((translated==true&&translate(UPGRADES[k].name).replace(/\'/g,"").replace(/\(Crew\)/g,"")==pstr[j])
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
			} else log("UPGRADE not listed: "+UPGRADES[k].type+" in "+p.name);
		if (k==UPGRADES.length) log("UPGRADE undefined: "+pstr[j]);
		}
	    }
	}
	//nextphase();
	
    },
    parseASCII: function(str) {
	var pilots=str.split(";");
	for (var i in generics) if (generics[i].team==this.team) delete generics[i];
	for (var i=0; i<pilots.length-1; i++) {
	    var coord=pilots[i].split(":");
	    var updstr=coord[0].split(",");
	    var pid=parseInt(updstr[0],10);
	    this.faction=PILOTS[pid].faction;
	    this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    for (var j=1; j<updstr.length; j++) {
		var n=parseInt(updstr[j],10);
		p.upg[j-1]=n;
	        if (typeof UPGRADES[n].install!="undefined") UPGRADES[n].install(p);
	    }
	    if (coord.length>1) {
		var c=coord[1].split(",");
		p.tx=parseInt(c[0],10);
		p.ty=parseInt(c[1],10);
		p.alpha=parseInt(c[2],10);
	    }
	}
	//nextphase();
    },
    parseJSON:function(str,translated) {
	var s;
	var f={"rebel":REBEL,"scum":SCUM,"empire":EMPIRE};
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
	    var pid=-1;
	    pilot.team=this.team;
	    for (j=0; j<PILOTS.length; j++) {
		if (PILOTS[j].faction==this.faction&&
		   PILOTS[j].unit==PILOT_dict[pilot.ship]) {
		    va=PILOTS[j].name;
		    if (va==PILOT_dict[pilot.name]) { pid=j; break; }
		}
	    }
	    if (pid==-1) throw("pid undefined:"+PILOT_dict[pilot.name]);
	    p=new Unit(this.team,pid);
	    p.upg=[];

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
var VERSION="v0.8.4";
var LANG="en";
var DECLOAK_PHASE=1;
var SETUP_PHASE=2,PLANNING_PHASE=3,ACTIVATION_PHASE=4,COMBAT_PHASE=5,SELECT_PHASE=1,CREATION_PHASE=6,XP_PHASE=7;
var DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];
var BOMBS=[];
var ROCKDATA="";
var allunits=[];
var PILOT_translation,SHIP_translation,CRIT_translation,UI_translation,UPGRADE_translation,PILOT_dict,UPGRADE_dict;
var actionr=[];
var actionrlock;
var HISTORY=[];
var replayid=0;
var dice=1;
var ATTACK=[]
var DEFENSE=[]
var SEARCHINGSQUAD;
var FACTIONS={"rebel":"REBEL","empire":"EMPIRE","scum":"SCUM"};
var SQUADLIST,SQUADBATTLE;
var COMBATLIST;
var combatpilots=[];
var TEAMS=[new Team(0),new Team(1),new Team(2)];
var currentteam=TEAMS[0];
var VIEWPORT;
var ANIM="";
var SETUPS={};
var SETUP;
var SHOWDIAL=[];
var TRACE=false;
//var sl;
var increment=1;
var theta=0;
var UNIQUE=[];
var stype="";
var REPLAY="";
var PERMALINK="";
/*

    <script src="src/obstacles.js"></script>
    <script src="src/critical.js"></script>
    <script src="src/units.js"></script>
    <script src="src/iaunits.js"></script>
    <script src="src/pilots.js"></script>
    <script src="src/upgrades.js"></script>
    <script src="src/upgcards.js"></script>
    <script src="src/team.js"></script>
    <script src="src/xwings.js"></script>

		 <button onclick='$("#replay")[0].contentWindow.stopreplay();'>Stop</button>

*/
window.callback = function () { alert("called callback");return true; };
/*window.onerror = function(message, source, lineno, colno, error) {
    log("<b>ERROR: "+error+"</b>");
 };
*/
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
var AIstats = function(error,options, response) {
    console.log(error,options,response);
    var scoreh=0;
    var scorec=0;
    var n=0;
    if (typeof response.rows!="undefined") {
    	for (var i=1; i<response.rows.length; i++) {
	    var t=response.rows[i].cellsArray[0].split(" ");
	    var ts1=t[0].split(":");
	    var type1=ts1[0];
	    var score1=ts1[1];
	    var ts2=t[1].split(":");
	    var type2=ts2[0];
	    var score2=ts2[1];
	    if (type2!=type1) {
		if (type2=="Human") scoreh+=parseInt(score2,10);
		else scorec+=parseInt(score2,10);
		if (type1=="Human") scoreh+=parseInt(score1,10);
		else scorec+=parseInt(score1,10);
		n++;
	    }
	}
	if (n>0) log("mean score:"+(Math.floor(scorec/n))+"-"+(Math.floor(scoreh/n)));
    }
}
var myCallback = function (error, options, response) {
   if (response!=null&&typeof response.rows!="undefined") {
	//console.log("found "+response.rows.length);
	var t=SEARCHINGSQUAD,t1="",s1="";
	var tt=t.split("\.");
	for (var i=0; i<tt.length; i++) {
	    t1+=tt[i].replace(/\*/g," + ").replace(/_/g," ")+"<br>";
	    s1+=tt[i].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	}
	stype="";
	TEAMS[1].parseJuggler(s1,false);
	for (var i=1; i<response.rows.length; i++) {
	    myTemplate(i,response.rows[i].cellsArray,null,null);
	}
       /*
*/
	SQUADBATTLE.columns.adjust().draw();
    }
};

var myTemplate = function(num,cells,cellarrays,labels) {
    var s="";
    var t=cells[0].split(" ");
    var ts1=t[0].split(":");
    var type1=ts1[0];
    var score1=ts1[1];
    var ts2=t[1].split(":");
    var type2=ts2[0];
    var score2=ts2[1];
    var squad=cells[1];
    var tt=squad.split("VS");
    var team1=tt[0].split("\.");
    var team2=tt[1].split("\.");
    var t1="",s1="";

    if (tt[0]==SEARCHINGSQUAD) { var sc=score2,ts=type2; team1=team2; score2=score1; type2=type1; score1=sc; type1=ts; }
    for (var j=0; j<team1.length-1; j++) {
	s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	t1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"<br>";
    }
    TEAMS[2].parseJuggler(s1,false);
    if (LANG!="en") {
	t1=TEAMS[2].toJuggler(true).replace(/\n/g,"<br>");
    }
    score1=""+score1;
    score2=""+score2;
    for (var i=0; i<3; i++) {
	if (score1.length<3) score1="0"+score1;
	if (score2.length<3) score2="0"+score2;
    }
    if (type2=="Human") score2="<b>"+score2+"</b>";
    if (type1=="Human") score1="<b>"+score1+"</b>";

    SQUADBATTLE.row.add([score2+"-"+score1,"<span onclick='$(\"#replay\").attr(\"src\",\""+cells[2]+"\")'>"+t1+"</span>"]).draw(false);
}
var computeurl=function(error, options,response) {
    console.log(error,options,response);
    var scoreh=0;
    var scorec=0;
    var n=0;
    if (typeof response.rows!="undefined") {
    	for (var i=1; i<10; i++) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    var team1=tt[0].split("\.");
	    var team2=tt[1].split("\.");
	    var s1="",s2="";
	    for (var j=0; j<team1.length-1; j++) {
		s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
		s2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    }
	    TEAMS[1].parseJuggler(s1,false);
	    TEAMS[2].parseJuggler(s2,false);
	    var longurl = response.rows[i].cellsArray[2];
	    var curl=longurl.split("?")[1];
	    var arg=LZString.decompressFromEncodedURIComponent(decodeURI(curl));
	    var args=[];
	    args= arg.split('&');
	    //log(LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+args[2]+"&"+args[3]+"&"+args[4]+"&"+args[5]+"&"+args[6]));
	}
    }
}
function translate(a) {
    if (typeof PILOT_translation[a]!="undefined"
	&&typeof PILOT_translation[a].name!="undefined") 
	return PILOT_translation[a].name;
    if (typeof PILOT_translation[a+" (Scum)"]!="undefined"
	&&typeof PILOT_translation[a+" (Scum)"].name!="undefined") 
	return PILOT_translation[a+" (Scum)"].name;
    if (typeof UPGRADE_translation[a]!="undefined"
	&&typeof UPGRADE_translation[a].name!="undefined") 
	return UPGRADE_translation[a].name;
    if (typeof UPGRADE_translation[a+"(Crew)"]!="undefined"
	&&typeof UPGRADE_translation[a+"(Crew)"].name!="undefined") 
	return UPGRADE_translation[a+"(Crew)"].name;
    if (typeof CRIT_translation[a]!="undefined"
	&&typeof CRIT_translation[a].name!="undefined")
	return CRIT_translation[a].name;
    return a;
}
function formatstring(s) {
    return s.replace(/%HIT%/g,"<code class='hit'></code>")
	.replace(/%ACTION%/g,"<b>Action:</b>")
	.replace(/%STRESS%/g,"<code class='xstresstoken'></code>")
	.replace(/%CRIT%/g,"<code class='critical'></code>")
	.replace(/%EVADE%/g,"<code class='symbols'>e</code>")
	.replace(/%FOCUS%/g,"<code class='symbols'>f</code>")
	.replace(/%SHIELD%/g,"<code class='cshield'></code>")
	.replace(/%HULL%/g,"<code class='chull'></code>")
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
        .replace(/%TALONLEFT%/g,"<code class='symbols'>;</code>")
        .replace(/%TALONRIGHT%/g,"<code class='symbols'>:</code>")
        .replace(/%ASTROMECH%/g,"<code class='symbols'>A</code>")
	.replace(/%CREW%/g,"<code class='symbols'>W</code>");
}
function nextunit(cando, changeturn,changephase,activenext) {
    var i,sk=false,last=0;
    if (skillturn<0||skillturn>12) return changephase();
    for (i=0; i<tabskill[skillturn].length; i++) {
	var u=tabskill[skillturn][i];
	if (cando(u)&&u.isdocked!=true) { sk=true; last=i; break;} 
    };
    if (!sk) {
	do {
	    changeturn(tabskill);
	    last=0;
	    if (skillturn>=0 && skillturn<=12) {
		while (last<tabskill[skillturn].length&&tabskill[skillturn][last].isdocked==true) last++;
		if (last==tabskill[skillturn].length) last=-1;
	    }
	} while (skillturn>=0 && skillturn<=12 && last==-1);
    } 
    if (skillturn<0||skillturn>12||last==-1) return changephase();
    active=last; 
    tabskill[skillturn][last].select();
    activenext();
}
function endphase() {
    for (var i in squadron) squadron[i].endphase();
}
function nextcombat() {
    nextunit(function(t) { return t.canfire(); },
	     function(list) { 
		 var dead=false;
		 if (skillturn>=0) skillturn--;
		 for (var i=0; i<list[skillturn+1].length; i++) {
		     var u=list[skillturn+1][i];
		     if (u.canbedestroyed(skillturn))
			 if (u.checkdead()) dead=true;
		 }
		 if (dead&&(TEAMS[1].checkdead()||TEAMS[2].checkdead())) win();
	     },
	     function() {
		 log(UI_translation["No more firing units, ready to end phase."]); 
		 for (var i in squadron) squadron[i].endcombatphase();
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
function getattackresult() {
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    return FCH_CRIT*c+FCH_HIT*h;
}
function getdefenseresult() {
    return $(".evadegreendice").length+$(".evadegreen").length;
}
function addattackdie(type,n) {
    for (var i=0; i<n; i++) 
	$("#attack").append("<td class="+type+"reddice'></td>");
}
function adddefensedie(type,n) {
    for (var i=0; i<n; i++) 
	$("#defense").append("<td class="+type+"greendice'></td>");
}
function getattackdice() {
    return $(".focusreddice").length+$(".criticalreddice").length+$(".hitreddice").length+$(".blankreddice").length;
}
function getdefensedice() {
    return $(".focusgreendice").length+$(".blankgreendice").length+$(".evadegreendice").length; 
}
function displaycombatdial() {
    $("#attackdial").empty();
    $("#dtokens").empty();
    $("#defense").empty();
    $("#combatdial").show();
}
function displayattackroll(m,n) {
    var i,j=0;
    for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
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
function displayattacktokens(u,f) {
    $("#atokens").empty();
    var dm=targetunit.getresultmodifiers(u.ar,u.ad,DEFENSE_M,ATTACK_M);
    if (dm.length>0) {
	$("#atokens").append(dm);
	//$("#atokens td").click(function() { displayattacktokens(u,f); });
	$("#atokens").append($("<button>").addClass("m-done").click(function() {
	    displayattacktokens2(u,f);
	}))
    } else displayattacktokens2(u,f);
}
function displayattacktokens2(u,f) {
    if (typeof f!="function") f=u.lastaf;
    u.lastaf=f;
    $("#atokens").empty();
    var am=u.getresultmodifiers(u.ar,u.da,ATTACK_M,ATTACK_M);
    if (am.length>0) {
	$("#atokens").append(am);
	//$("#atokens td").click(function() { displayattacktokens2(u,f); });
	$("#atokens").append($("<button>").addClass("m-done").click(function() {
	    $("#atokens").empty();
	    f();}.bind(u)));
    } else f();
}
function displaydefensetokens(u,f) {
    $("#dtokens").empty();
    var dm=activeunit.getresultmodifiers(u.ar,u.ad,ATTACK_M,DEFENSE_M);
    if (dm.length>0) {
	$("#dtokens").append(dm);
	//$("#dtokens td").click(function() { displaydefensetokens(u,f); });
	$("#dtokens").append($("<button>").addClass("m-done").click(function() {
	    displaydefensetokens2(u,f);
	}))
    } else displaydefensetokens2(u,f);
}
function displaydefensetokens2(u,f) {
    if (typeof f!="function") f=u.lastdf;
    u.lastdf=f;
    $("#dtokens").empty();
    $("#dtokens").append(u.getresultmodifiers(u.dr,u.dd,DEFENSE_M,DEFENSE_M));
    //$("#dtokens td").click(function() { displaydefensetokens2(u,f); });
    $("#dtokens").append($("<button>").addClass("m-fire").click(function() {
	$("#combatdial").hide();
	f();}.bind(u)));
}
function FE_focus(r) {
    return Math.floor(r/10)%10;
}
function FE_evade(r) {
    return r%10;
}
function FE_blank(r,n) {
    return n-FE_evade(r)-FE_focus(r);
}
function FCH_hit(r) {
    return r%10;
}
function FCH_focus(r) {
    return Math.floor(r/100)%10;
}
function FCH_crit(r) {
    return Math.floor(r/10)%10;
}
function FCH_blank(r,n) {
    return n-FCH_crit(r)-FCH_focus(r) - FCH_hit(r);
}
var FE_EVADE=1;
var FE_FOCUS=10;
var FCH_HIT=1;
var FCH_FOCUS=100;
var FCH_CRIT=10;

function addroll(f,id,to) {
    if (to==DEFENSE_M) return addrolld(f,id);
    var n=getattackdice();
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var t=f(100*foc+10*c+h,n);
    displayattackroll(t.m,t.n);
    $("#atokens #mod"+id).remove();
}
function addrolld(f,id) {
    var n=getdefensedice();
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var t=f(10*foc+e,n);
    displaydefenseroll(t.m,t.n);
    $("#dtokens #mod"+id).remove();
}
function modroll(f,id,to) {
    if (to==DEFENSE_M) return modrolld(f,id);
    var n=getattackdice();
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var r=f(100*foc+10*c+h,n);
    displayattackroll(r,n);
    $("#atokens #mod"+id).remove();
}
function modrolld(f,id) {
    var n=getdefensedice();
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var r=f(10*foc+e,n);
    displaydefenseroll(r,n);
    $("#dtokens #mod"+id).remove();
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

function reroll(n,forattack,a,id) {
    var i,l,m=0;
    var attackroll=["blank","focus","hit","critical"];
    var defenseroll=["blank","focus","evade"];
    if (typeof a.f=="function") a.f();
    if (forattack) {
	for (i=0; i<4; i++) {
	    // Do not reroll focus
	    if (activeunit.canusefocus()&&activeunit.candofocus()&&i==1) continue;
	    if (a.dice.indexOf(attackroll[i])>-1) {
		l=$("."+attackroll[i]+"reddice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;
		    n-=l.length;
		} else {
		    $("."+attackroll[i]+"reddice:lt("+n+"):not([noreroll])").remove();
		    m+=n;
		    n=0;
		    break;
		}
	    }
	}
	//console.log("rerolling "+m+" dices");
	$("#atokens #reroll"+id).remove();
	var r=activeunit.rollattackdie(m);
	for (i=0; i<m; i++) {
	    $("#attack").prepend("<td noreroll='true' class='"+r[i]+"reddice'></td>");
	}
    } else { 
	for (i=0; i<3; i++) {
	    // Do not reroll focus
	    if (targetunit.canusefocus()&&targetunit.candofocus()&&i==1) continue;
	    if (a.dice.indexOf(defenseroll[i])>-1) {
		l=$("."+defenseroll[i]+"greendice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;
		    n-=l.length;
		} else {
		    $("."+attackroll[i]+"greendice:lt("+n+"):not([noreroll])").remove();
		    m+=n;
		    n=0;
		    break;
		}
	    }
	}
	$("#dtokens #reroll"+id).remove();
	activeunit.defenseroll(m).done(function(r) {
	    var i;
	    for (i=0; i<FE_evade(r.roll); i++)
		$("#defense").prepend("<td noreroll='true' class='evadegreendice'></td>");
	    for (i=0; i<FE_focus(r.roll); i++)
		$("#defense").prepend("<td noreroll='true' class='focusgreendice'></td>");
	    for (i=0; i<FE_blank(r.roll,r.dice); i++)
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
	for (i in squadron)
	    if (squadron[i].maneuver<0&&!squadron[i].isdocked) { ready=false; break; }
	if (ready&&$(".nextphase").prop("disabled")) {
	    log(UI_translation["All units have planned a maneuver, ready to end phase"]);
	}
	break;
    case ACTIVATION_PHASE:
	if (subphase!=ACTIVATION_PHASE) {
	    subphase=ACTIVATION_PHASE; 
	    skillturn=0; 
	    ready=false;
	    for (i in squadron) squadron[i].enddecloak().done(nextactivation);
	    barrier(nextactivation);
	} else {
	    for (i in squadron)
		if (squadron[i].maneuver>-1&&!squadron[i].isdocked) { ready=false; break; }
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

function win() {
    var title="m-draw";
    var i;
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
//    var meanhit=Math.floor(1000*TEAMS[1].allhits/TEAMS[1].allred)/1000;
//    var meancrit=Math.floor(1000*TEAMS[1].allcrits/TEAMS[1].allred)/1000;
//    var str="<td rowspan='2' class='probacell' >";
//    str+="<div style='font-size:smaller'>Average <span class='hit'></span>/die:"+meanhit+" (norm:0.375)</div><div>Average <span class='critical'></span>/die:"+meancrit+" (norm:0.125)</div></td>";

    $(".victory-table").empty();
    $(".victory-table").append("<tr><th class='m-squad1'></th><th>"+score1+"</th></tr>");
    $(".victory-table").append(s1);
//    meanhit=Math.floor(1000*TEAMS[2].allhits/TEAMS[2].allred)/1000;
//    meancrit=Math.floor(1000*TEAMS[2].allcrits/TEAMS[2].allred)/1000;
//    var str="<td rowspan='2' class='probacell' >";
//    str+="<div style='font-size:smaller'>Average <span class='hit'></span>/die:"+meanhit+" (norm:0.375)</div><div>Average <span class='critical'></span>:"+meancrit+" (norm: 0.125)</div>/die</td>";
    $(".victory-table").append("<tr><th class='m-squad2'></th><th>"+score2+"</th></tr>");
    $(".victory-table").append(s2);
    if (d>0) title="m-1win";
    else if (d<0) title="m-2win";
    $(".victory").attr("class",title);
    var titl = (TEAMS[1].isia?"Computer":"Human")+":"+score1+" "+(TEAMS[2].isia?"Computer":"Human")+":"+score2;
    var note=TEAMS[1].toJuggler(false);
    note+="VS"+TEAMS[2].toJuggler(false);
    note=note.replace(/\n/g,".");
    note=note.replace(/ \+ /g,"*");
    note=note.replace(/ /g,"_");
    //console.log("note:"+encodeURI(note));
    var link="https://api-ssl.bitly.com/v3/user/link_save?access_token=ceb626e1d1831b8830f707af14556fc4e4e1cb4c&longUrl="+encodeURI("http://xws-bench.github.io/bench/index.html?"+permalink(false))+"&title="+encodeURI(titl)+"&note="+encodeURI(note);
    $.when($.ajax(link)).done(function(result1) {
	var url=result1.data.link_save.link;
	$(".victory-link").attr("href",url);
	$(".victory-link code").text(url);
	$(".tweet").attr("href","https://twitter.com/intent/tweet?url="+encodeURI(url)+"&text=A%20Squad%20Benchmark%20combat");

	$(".facebook").attr("href","https://www.facebook.com/sharer/sharer.php?u="+encodeURI(url));
	$(".googlep").attr("href","https://plus.google.com/share?url="+encodeURI(url));
	$(".email").attr("href","mailto:?body="+url);
    });
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

function battlelog(t) {
    var row=SQUADLIST.row(t.parents("tr"));
    var data = row.data()[3];
    if (LANG!="en") TEAMS[0].parseJuggler(data,false);
    else TEAMS[0].parseJuggler(data,false);
    data=TEAMS[0].toJuggler(false);
    displaycombats(data);
    window.location="#battlelog";
}

function createsquad() {
    $(".activeunit").prop("disabled",true);
    $("#selectphase").hide();
    phase=CREATION_PHASE;
    $(".nextphase").prop("disabled",false);
    currentteam.changefaction("REBEL");
    $(".factionselect selected").val("REBEL");
    $("#creation").show();
    displayfactionunits();
    //$("#coverflow").coverflow();
}
function switchdialimg(b) {
    if (b==true) {
	$(".shipimg").css("display","none");
	$(".shipdial").css("display","table-cell");
    } else {
	$(".shipdial").css("display","none");
	$(".shipimg").css("display","table-cell");
    }
}
var mySpreadsheets=[
"https://docs.google.com/spreadsheets/d/1n35IFydakSJf9N9b9byLog2MooaWXk_w8-GQdipGe8I/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1Jzigt2slBhygjcylCsy4UywpsEJEjejvtCfixNoa_z4/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1dkvDxaH3mJhps9pi-R5L_ttK_EmDKUZwaCE9RZUYueg/edit#gid=0"
];
/*function displayAIperformance() {
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadbattlediv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select B",
	    callback:AIstats,
	    rowTemplate:function () { return "";},
	    labels:["Score"]
	});
    }   
}*/
/*
function recomputeurl() {
    $('#squadbattlediv').sheetrock({
	url: mySpreadsheets[0],
	query:"select C,D,E",
	callback:computeurl,
	rowTemplate:function () { return "";},
	labels:["ascii","short","long"]
    }); 
}*/
function displaycombats(t) {
    var s1=t;
    t=t.replace(/\n/g,".");
    t=t.replace(/ \+ /g,"*");
    //t=t.replace(/-/g,"\\-");
    t=t.replace(/ /g,"_");
    $("#replay").attr("src","");

    if (t.slice(-1)!=".") t=t+".";
    SEARCHINGSQUAD=t;
    //console.log("asking for "+t);

    var t1="";
    if (LANG!="en") {
	TEAMS[0].parseJuggler(s1,false);
	s1=TEAMS[0].toJuggler(true);
    }
    t1=s1.replace(/\n/g,"<br>");

    $("#battlingsquad").html(t1);
    SQUADBATTLE.clear().draw();;
 
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadbattlediv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select B,C,D where C contains '"+t+"'",
	    callback:myCallback,
	    rowTemplate:function () { return "";},
	    labels:["Score","Squadlist","URL"]
	});
    }   
}
function displayfactionunits() {
    var count=0;
    var n=0;
    var i,j,k;
    var faction=currentteam.faction;
    var p={};
    var t={};
    var uu=[];
    if (phase!=CREATION_PHASE) return;
    for (i in unitlist) if (unitlist[i].faction.indexOf(faction)>-1) count++;

    var tz = Math.round( ( 186 / 2 ) / Math.tan( Math.PI / count ) );
    $(".caroussel").html("");
    increment = 360. / count;
    var str;
    for (i=0; i<PILOTS.length; i++) {
	var u=PILOTS[i].unit;
	if (PILOTS[i].faction==faction) {
	    if (typeof p[u]=="undefined") p[u]=[];
	    /* should go elsewhere */
	    if (PILOTS[i].upgrades.indexOf(ELITE)>-1) PILOTS[i].haselite=true;
	    var text=getpilottexttranslation(PILOTS[i].name,faction);
	    if (text!="")
		text+=(PILOTS[i].done==true?"":"<div><strong class='m-notimplemented'></strong></div>");
	    PILOTS[i].tooltip=text;
	    PILOTS[i].trname=translate(PILOTS[i].name);
	    p[u].push(PILOTS[i]);
	    //PILOTS[i].pilotid=i;
	}
    }
    for (u in p) p[u].sort(function(a,b) { return a.points - b.points; });
    for (i=0; i<UPGRADES.length; i++) {
	var u=UPGRADES[i];
	if (u.type==TITLE) unitlist[u.ship].hastitle=true;
    }
    for (i in unitlist) 
	if (unitlist[i].faction.indexOf(faction)>-1) { 
	    unitlist[i].trname=SHIP_translation[i]; 
	    unitlist[i].name=i;
	    if (typeof unitlist[i].trname=="undefined") unitlist[i].trname=i;
	    uu.push(unitlist[i]);
	}
    uu.sort(function(a,b) { return a.trname > b.trname; });
    for (i=0; i<uu.length; i++) {
	str="";
	n++;
	var u=uu[i];
	var template = $('#faction').html();
	Mustache.parse(template);
	var m=[];str="";
	for (j=0; j<=5; j++) m[j]={item:"",moves:null};
	for (j=0; j<u.dial.length; j++) {
	    d=u.dial[j];
	    var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
	    m[5-cx].item=cx;
	    if (m[5-cx].moves==null) {
		m[5-cx].moves=[];
		for (k=0; k<=6; k++) m[5-cx].moves[k]={difficulty:"",key:""};
	    }
	    m[5-cx].moves[cy]={difficulty:d.difficulty,key:P[d.move].key};
	}
	var rendered=Mustache.render(template, {
	    shipimg:u.img[0],
	    fire:repeat('u',u.fire),
	    evade:repeat('u',u.evade),
	    hull:repeat('u',u.hull),
	    shield:repeat('u',u.shield),
	    diallist:m,
	    shipname:u.trname,
	    actionlist:function() {
		var al=[];
		for (j=0; j<u.actionList.length; j++) al[j]=A[u.actionList[j]].key;
		return al;
	    },
	    hastitle:u.hastitle,
	    shipupgrades:p[u.name][0].upgrades,
	    pilots:p[u.name]
	});
	$("#caroussel").append("<li>"+rendered+"</li>");	    
    }
}
function getpilottexttranslation(name,faction) {
    var idxn=name+(faction=="SCUM"?" (Scum)":"");
    if (typeof PILOT_translation[idxn]!="undefined"&&typeof PILOT_translation[idxn].text!="undefined") return formatstring(PILOT_translation[idxn].text);
    return "";
}
function getupgtxttranslation(name,type) {
    var v=name+(type==CREW?"(Crew)":"");
    if (typeof UPGRADE_translation[v]!="undefined"&&typeof UPGRADE_translation[v].text!="undefined") return formatstring(UPGRADE_translation[v].text)
    return "";
}
function addunique(name) {
    UNIQUE[name]=true;
    for (var i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",true);
    }
    for (var i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",true);
    }
}
function removeunique(name) {
    UNIQUE[name]=false;
    for (var i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",false);
    }
    for (var i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",false);
    }
}
function addlimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",true);
}
function removelimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",false);
}
function addupgradeaddhandler(u) {
    $("#unit"+u.id+" .upgrades").click(function(e) {
	var org=e.currentTarget.getAttribute("class").split(" ")[1];
	var num=e.currentTarget./*parentElement.*/getAttribute("num");
	var p=this.getupgradelist(org);
	$("#unit"+this.id+" .upglist").empty();
	$("#unit"+this.id+" .upglist").append("<tr><td><button>+</button></td><td><span class='m-none'></span></td><td></td><td></td></tr>");
	$("#unit"+this.id+" .upglist ").click(function() {
	    $("#unit"+this.id+" .upglist").empty();
	}.bind(this));
	if (typeof this.upgbonus[org]=="undefined") this.upgbonus[org]=0;
	for (var i=0; i<p.length; i++) {
	    var upg=UPGRADES[p[i]];
	    var disabled=false;
	    var pts=upg.points+this.upgbonus[org];
	    if (pts<0) pts=0;
	    var tt=">";
	    var attack="</td><td>";
	    if (typeof upg.attack!="undefined") attack="<span class='statfire'>"+upg.attack+"</span></td><td>["+upg.range[0]+"-"+upg.range[1]+"]";
	    var text=formatstring(getupgtxttranslation(upg.name,upg.type));
	    if (text!="") tt=" class='tooltip'>"+text+(upg.done==true?"":"<div><strong class='m-notimplemented'></strong></div>");

	    if (UNIQUE[upg.name]==true) disabled=true;
	    if ((upg.limited==true||this.exclupg[upg.type]==true)&&$("#unit"+this.id+" .upg span[data="+p[i]+"]").length>0) disabled=true;
	    $("#unit"+this.id+" .upglist").append("<tr><td><button "+(disabled?"disabled":"")+" num="+num+" data="+p[i]+">+</button></td><td>"+translate(upg.name).replace(/\(Crew\)/g,"")+"</td><td>"+pts+"</td><td>"+attack+"</td><td"+tt+"</td></tr>")
	}
	$("#unit"+this.id+" .upglist button").click(function(e) {
	    var data=e.currentTarget.getAttribute("data");
	    var num=e.currentTarget.getAttribute("num");
	    addupgrade(this,data,num);
	}.bind(this));
    }.bind(u));
}
function addunit(n) {
    var u=new Unit(currentteam.team,n);
    $("#listunits").append("<li id='unit"+u.id+"'></li>");
    u.show();
    $("li#unit"+u.id).hover(function() { $(".highlighted").removeClass("highlighted"); 
					 $(this).addClass("highlighted"); },
			 function() { });
    if (u.unique==true) addunique(u.name);
    $("#unit"+u.id+" .close").click(function() {
	var data=$(this).attr("data");
	var u=generics["u"+data];
	$("#unit"+data+" .upg span[data]").each(function() {
	    var d=$(this).attr("data");
	    if (UPGRADES[d].unique==true) removeunique(UPGRADES[d].name);
	});
	if (PILOTS[u.pilotid].unique==true) removeunique(u.name);
	$("#unit"+data).remove();
	delete generics["u"+data];
	currentteam.updatepoints();
    });
    $("#unit"+u.id+" .duplicate").click(function() {
	var data=$(this).attr("data");
	var u=generics["u"+data];
	var self=addunit(u.pilotid);
	$("#unit"+data+" .upg span[data]").each(function() {
	    var d=$(this).attr("data");
	    var num=$(this).attr("num");
	    if (UPGRADES[d].unique!=true) addupgrade(self,d,num);
	});
    });
    currentteam.updatepoints();
    addupgradeaddhandler(u);
    return u;
}
function addupgrade(self,data,num) {
    var org=UPGRADES[data];
    $("#unit"+self.id+" .upglist").empty();
    if (typeof org=="undefined") return;
    if (org.unique==true) addunique(org.name);
    if (org.limited==true) addlimited(self,data);
    $("#unit"+self.id+" .upgavail span[num="+num+"]").css("display","none");
    var text=translate(org.name).replace(/\(Crew\)/g,"").replace(/\'/g,"");
    if (typeof self.upgbonus[org.type]=="undefined") self.upgbonus[org.type]=0;
    var pts=org.points+self.upgbonus[org.type];
    if (pts<0) pts=0;
    $("#unit"+self.id+" .upg").append("<span data="+data+" num="+num+"><code class='upgrades "+org.type+"'></code>"+text+" (<span class='pts'>"+pts+"</span>)</span>");
    self.upg[num]=data;
    if (typeof org.install!="undefined") org.install(self);
    Upgrade.prototype.install.call(org,self);
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();


    $("#unit"+self.id+" .upg span[num="+num+"]").click(function(e) {
	var num=e.currentTarget.getAttribute("num");
	var data=e.currentTarget.getAttribute("data");
	$("#unit"+self.id+" .upglist").empty();
	removeupgrade(self,num,data);
    }.bind(self));
}
function removeupgrade(self,num,data) {
    var org=UPGRADES[data];
   $("#unit"+self.id+" .upgavail span[num="+num+"]").css("display","block");
    $("#unit"+self.id+" .upg span[num="+num+"]").remove();
    if (org.unique==true) removeunique(org.name);
    if (org.limited==true) removelimited(self,data);
    self.upg[num]=-1;
    if (typeof org.uninstall!="undefined") org.uninstall(self);
    Upgrade.prototype.uninstall.call(org,self);
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();
}
function setselectedunit(n,td) {
    var jug=td; 
    currentteam=TEAMS[n];
    try {
	currentteam.parseJuggler(jug,true);
    } catch(e) {
	currentteam.parseJuggler(jug,false);
    }
    currentteam.name=currentteam.toASCII();
    currentteam.toJSON(); // Just for score
    addrow(n,currentteam.name,0,currentteam.faction,currentteam.toJuggler(true));
}
function addrow(team,name,pts,faction,jug) {
    if (team==1) {$("#squad1").val(jug); $("#squad1").attr("data-name",name);}
    if (team==2) {$("#squad2").val(jug); $("#squad2").attr("data-name",name);}
    enablenextphase();
    var n=faction.toUpperCase();
    if (typeof localStorage[name]!="undefined")
	SQUADLIST.row.add(["",n,""+pts,jug,name,"",""]).draw(false);
}
//function addrowcombat(link,team1,team2,n) {
    //var clicks="https://api-ssl.bitly.com/v3/link/clicks?access_token=ceb626e1d1831b8830f707af14556fc4e4e1cb4c&link="+encodeURI(link);
    //$.when($.ajax(clicks)).done(function(result1) {
//    COMBATLIST.row.add(["",link,n,team1,team2]).draw(false);
    //});
//}

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
}
function removerow(t) {
    var row = SQUADLIST.row(t.parents("tr"));
    var data = row.data()[4];
    delete localStorage[data];
    row.remove().draw(false);
}

function checkrow(n,t) {
   var row=SQUADLIST.row(t.parents("tr"));
    var data = row.data()[3];
    setselectedunit(n,data);
}
function importsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    currentteam.name="SQUAD."+currentteam.toASCII();
    var jug=currentteam.toJuggler(true);
    currentteam.toJSON(); // just for points
    localStorage[currentteam.name]=JSON.stringify({"pts":currentteam.points,"faction":currentteam.faction,"jug":currentteam.toJuggler(false)});
    addrow(t,currentteam.name,currentteam.points,currentteam.faction,jug);
}
function findsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    var jug=currentteam.toJuggler(false);
    var pattern=jug.replace(/ \+.*/g,"").replace(/\n/g,".*\.").replace(/ /g,"_");
    log(pattern);
    $('#squad'+t).sheetrock({
	url: mySpreadsheets[0],
	query:"select C where C matches '.*VS"+pattern+"'",
	callback:matchsquad,
	rowTemplate:function () { return "";},
	labels:["squad"]
    }); 
}
function matchsquad(error, options,response) {
    if (response!=null&&typeof response.rows!="undefined") {
	response.rows.sort(function(a,b) { return a.cellsArray[0]<b.cellsArray[0]; });
	var str="<ol>";
	var oldsquad="";
   	for (var i in response.rows) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    if (tt[1]==oldsquad) continue;
	    str+="<li>"+tt[1]+"</li>";
	    oldsquad=tt[1];
	}
	str+="</ol>";
	log(str);
    }
}
function startcombat() {
}
function filltabskill() {
    var i;
    tabskill=[];
    for (i=0; i<=12; i++) tabskill[i]=[];
    for (i in squadron) tabskill[squadron[i].getskill()].push(squadron[i]);
    for (i=0; i<=12; i++) tabskill[i].sort(function(a,b) {
	var xa=0,xb=0;
	if (TEAMS[a.team].initiative==true) xa=1; 
	if (TEAMS[b.team].initiative==true) xb=1;
	if (xb-xa==0) return (b.id-a.id);
	return xb-xa;
    });
}

var ZONE=[];
function movelog(s) {
    ANIM+="_-"+s;
}
function nextphase() {
    var i;
    movelog("P-"+round+"-"+(phase+1));
    // End of phases
    //if (!enablenextphase()) return;
    window.location="#";
    switch(phase) {
    case SELECT_PHASE:
	$(".mainbutton").hide();
	$("#game").show();
	$("#selectphase").hide();
	$("#creation").hide();
	$("#rightpanel").show();
	$("#leftpanel").show();
	if ($("#player1 option:checked").val()=="human") 
	    TEAMS[1].isia=false; else TEAMS[1].isia=true;
	if ($("#player2 option:checked").val()=="human") 
	    TEAMS[2].isia=false; else TEAMS[2].isia=true;
	for (var i in squadron) console.log("--squadron["+i+"]:"+squadron[i].name+" "+squadron[i].id);

 	break;
    case CREATION_PHASE:
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
	PERMALINK=permalink(true);
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
	//$(".permalink").hide();
	break;
    case PLANNING_PHASE:
	$("#maneuverdial").hide();
	break;
    case ACTIVATION_PHASE:
	$("#activationdial").hide();
	for (i in squadron) {
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
	for (i in squadron) squadron[i].endround();
	round++;
	break;
    }
    phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;
    if (phase==1) $("#phase").empty();
    else if (phase<3) $("#phase").html(UI_translation["phase"+phase]);
    else $("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
    $("#combatdial").hide();
    if (phase>SELECT_PHASE) for (i in squadron) {squadron[i].unselect();}
    // Init new phase

    $(".nextphase").prop("disabled",false);
    switch(phase) {
    case SELECT_PHASE:
	$(".mainbutton").show();
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
	loadsound();
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
	if (SETUP.background!="") $(".playmat").css({background:"url("+SETUP.background+") no-repeat",backgroundSize:"100% 100%"});
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
	if (TEAMS[1].points>TEAMS[2].points) TEAMS[2].initiative=true;
	else {
	    if (TEAMS[2].faction=="EMPIRE") TEAMS[2].initiative=true;
	    else TEAMS[1].initiative=true;
	}
	if (TEAMS[1].initiative==true) log("TEAM #1 has initiative");
	else log("TEAM #2 has initiative");
	$(".activeunit").prop("disabled",false);
	var i;
	for (i in squadron) if (!squadron[i].isdocked) break;
	activeunit=squadron[i];
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
	jwerty.key("escape", nextphase);
	
	jwerty.key("c", center);
	/* By-passes */
	jwerty.key("9", function() { 
		console.log("active:"+activeunit.name+" in hit range:"+activeunit.weapons[0].name);
		var w=activeunit.weapons[0];
		for (var i in squadron) {
		    console.log("      "+squadron[i].name+":"+w.getrange(squadron[i]));
		}
	    });
	jwerty.key("p",function() {
	    activeunit.showpossiblepositions();
	    //activeunit.evaluateposition();
	});
	jwerty.key("m",function() {
	    activeunit.showmeanposition();
	});
	jwerty.key("shift+p",function() {
	    $(".possible").remove();
	});
	jwerty.key("1", function() { activeunit.addfocustoken();activeunit.show();});
	jwerty.key("2", function() { activeunit.addevadetoken();activeunit.show();});
	jwerty.key("3", function() { if (!activeunit.iscloaked) {activeunit.iscloaked=true;activeunit.agility+=2;activeunit.show();}});
	jwerty.key("4", function() { activeunit.addstress();activeunit.show();});
	jwerty.key("5", function() { activeunit.addiontoken();activeunit.show();});
	jwerty.key("shift+1", function() { if (activeunit.focus>0) activeunit.removefocustoken();activeunit.show();});
	jwerty.key("shift+2", function() { if (activeunit.evade>0) activeunit.removeevadetoken();activeunit.show();});
	jwerty.key("shift+3", function() { if (activeunit.iscloaked) {activeunit.iscloaked=false;activeunit.agility-=2;activeunit.show();}});
	jwerty.key("shift+4", function() { if (activeunit.stress>0) activeunit.removestresstoken();activeunit.show();});
	jwerty.key("shift+5", function() { if (activeunit.ionized>0) activeunit.removeiontoken();});
	jwerty.key("f",function() { 
	    var s=""; 
	    for(i in activeunit.actionsdone) s+=activeunit.actionsdone[i]+" ";
	    activeunit.log("actions done:"+s);
	});
	jwerty.key("d",function() { activeunit.resolvehit(1);});
	jwerty.key("c",function() { activeunit.resolvecritical(1);});
	jwerty.key("shift+d",function() { 
	    if (activeunit.hull<activeunit.ship.hull) activeunit.addhull(1); 
	    else if (activeunit.shield<activeunit.ship.shield) activeunit.addshield(1); 
	    activeunit.show();
	});
	if (SETUP.asteroids>0) {
	    loadrock(s,ROCKDATA);
	}
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".unit").css("cursor","move");
	$("#positiondial").show();
	$(".permalink").show();
	startreplayall();
	break;
    case PLANNING_PHASE: 
	active=0;
	/* For actions of all ships */
	actionr = [$.Deferred().resolve()];
	/* For phase */
	actionrlock=$.Deferred().resolve();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").prop("disabled",true);
	$("#maneuverdial").show();
	skillturn=0;
	filltabskill();
	for (i in squadron) {
	    squadron[i].newm=squadron[i].m;
	    squadron[i].beginplanningphase().progress(nextplanning);
	}
	nextplanning();
	break;
    case ACTIVATION_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").prop("disabled",true);
	$("#activationdial").show();
	for (i in squadron) squadron[i].beginactivationphase().done(nextdecloak);
	
	filltabskill();
	subphase=DECLOAK_PHASE;
	skillturn=0;
	barrier(nextdecloak);
	break;
    case COMBAT_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$("#attackdial").show();
	skillturn=12;
	for (i in squadron) squadron[i].begincombatphase().done(nextcombat);
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
function permalink(reset) {
    var r="";
    if (!reset) { if (REPLAY!="") r=REPLAY; else r=ANIM; } 
    return LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+SETUP.name+"&"+r);
}
function resetlink() {
    switch (phase) {
    case SETUP_PHASE:
    case SELECT_PHASE: 
    case XP_PHASE: document.location.reload(true); break;
    case CREATION_PHASE: phase=0; document.location.search=""; nextphase(); break; 
    default: 
	document.location.search="?"+PERMALINK;
	//document.location.assign(document.location.href);
	//document.location.reload(true);
    }
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
function select(id) {
    var i;
    for (i in squadron) {
	if (squadron[i].id==id) break;
    }
    if (typeof TogetherJS!="undefined"&&TogetherJS.running) {
	TogetherJS.send({
	    type: 'select',
	    uid: id,
	});
    }
    squadron[i].select();
    //$("#"+u.id).attr({color:"black",background:"white"});
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
    var availlanguages=["en","fr"];
    LANG = localStorage['LANG'] || window.navigator.userLanguage || window.navigator.language;
    LANG=LANG.substring(0,2);
    $.ajaxSetup({beforeSend: function(xhr){
	if (xhr.overrideMimeType)
	    xhr.overrideMimeType("application/json");
    }});
    if (availlanguages.indexOf(LANG)==-1) LANG="en";
    $.when(
	$.ajax("data/ships.json"),
	$.ajax("data/strings."+LANG+".json"),
	$.ajax("data/xws.json"),
	$.ajax("data/setups.json")
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

	UPGRADE_dict=result3[0].upgrades;
	PILOT_dict=result3[0].pilots;

	for (var j in PILOT_dict) {
	    for (var i=0; i<PILOTS.length; i++) 
		if (PILOTS[i].name==PILOT_dict[j]) PILOTS[i].dict=j;
	    for (var i in unitlist) 
		if (i==PILOT_dict[j]) unitlist[i].dict=j;
	}
	/*Sanity check */
	
	for (var i=0; i<PILOTS.length; i++) {
	    var found=false;
	    for (var j in PILOT_dict) 
		if (PILOTS[i].name==PILOT_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+PILOTS[i].name);
	}
	for (var i=0; i<UPGRADES.length; i++) {
	    var found=false;
	    for (var j in UPGRADE_dict) 
		if (UPGRADES[i].name==UPGRADE_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+UPGRADES[i].name);
	}


	for (i in result4[0].data) {
	    var st=result4[0].data[i];
	    SETUPS[i]=st;
	}
	var r=0,e=0,i;
	squadron=[];

	s.attr({width:"100%",height:"100%",viewBox:"0 0 900 900"});
	TEAMS[1].setfaction("REBEL");
	TEAMS[2].setfaction("EMPIRE");
	/*UPGRADES.sort(function(a,b) {
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
	    });*/
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

	if (typeof localStorage.volume=="undefined") localStorage.volume=0.8;

	Howler.volume(localStorage.volume);
	$("#vol").val(localStorage.volume*100);

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

    $("#squadbattle").html("<thead><tr><th><span class='m-score'></span></th><th><span class='m-opponent'></span></th></tr></thead>");
    SQUADBATTLE=$("#squadbattle").DataTable({
	"language": {
	    "search":UI_translation["Search"],
	    "lengthMenu": UI_translation["Display _MENU_ records per page"],
	    "zeroRecords": UI_translation["Nothing found - sorry"],
	    "info": UI_translation["Showing page _PAGE_ of _PAGES_"],
	    "infoEmpty": UI_translation["No records available"],
	    "infoFiltered": UI_translation["(filtered from _MAX_ total records)"]
	},
	"autoWidth": true,
	"scrollY": "20em",
	"scrollX":true,
	"deferRender": true,
	"scrollCollapse": true,
	"ordering":true,
	"processing":true,
	"info":true,
	"paging":         true});

	$('#squadbattle tbody').on('click','tr', function () {
            if ( $(this).hasClass('selected') ) {
		$(this).removeClass('selected');
            }
            else {
		$("#squadbattle tr.selected").removeClass("selected");
		$(this).addClass('selected');
            }
	} );
	$("#player1").html("<option selected value='human'>"+UI_translation["human"]+"</option>");
	$("#player1").append("<option value='computer'>"+UI_translation["computer"]+"</option>");
	$("#player2").html("<option selected value='human'>"+UI_translation["human"]+"</option>");
	$("#player2").append("<option value='computer'>"+UI_translation["computer"]+"</option>");

	//jwerty.key("shift+i", displayAIperformance);
	//jwerty.key("shift+i", TogetherJS);
/*
TogetherJSConfig_on_ready = function () {
    TogetherJS.running=true;
      $("#togetherjs-dock").removeClass("togetherjs-dock-right");
      $("#togetherjs-dock").addClass("togetherjs-dock-top").css({top:"-15px",background:"rgba(0,0,0,0)",border:"0px",width:"20em"}).css("box-shadow","none");

};*/ //,3000);


	var arg=LZString.decompressFromEncodedURIComponent(decodeURI(window.location.search.substr(1)));
	var args=[];
	if (arg!=null) args= arg.split('&');
	if (args.length>1) {
	    log("Loading permalink...");
	    ROCKDATA=args[2];
	    phase=CREATION_PHASE;
	    TEAMS[1].parseASCII(args[0]);
	    TEAMS[1].toJSON(); // Just for points
	    TEAMS[2].parseASCII(args[1]);
	    TEAMS[2].toJSON(); // Just for points
	    TEAMS[1].isia=false;
	    TEAMS[2].isia=false;
	    if (args[3]=="true") { $("#player1 option[value='computer']").prop("selected",true); TEAMS[1].isia=true;}
	    else $("#player1 option[value='human']").prop("selected",true);
	    if (args[4]=="true") { $("#player2 option[value='computer']").prop("selected",true); TEAMS[2].isia=true; }
	    else $("#player2 option[value='human']").prop("selected",true);
	    SETUP=SETUPS[args[5]+" Map"];
	    phase=SELECT_PHASE;
	    if (args.length>6&args[6]!="") { REPLAY=args[6]; }
	    PERMALINK=LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+args[5]);
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

	    $("#squadlist").html("<thead><tr><th></th><th>"+UI_translation["type"]+"</th><th><span class='m-points'></span></th><th><span class='m-units'></span></th><th></th><th></th><th></th></tr></thead>");
	    $.fn.dataTable.ext.search.push(
		function( settings, data, dataIndex ) {
		    return data[1].search(stype)>-1;
		}
	    );
	    var first=0;
	    SQUADLIST=$("#squadlist").DataTable({
		"language": {
		    "search":UI_translation["Search"],
		    "lengthMenu": UI_translation["Display _MENU_ records per page"],
		    "zeroRecords": UI_translation["Nothing found - sorry"],
		    "info": UI_translation["Showing page _PAGE_ of _PAGES_"],
		    "infoEmpty": UI_translation["No records available"],
		    "infoFiltered": UI_translation["(filtered from _MAX_ total records)"]
		},
		"autoWidth": true,
		"columnDefs": [
		    { "targets": [0],
		      "render":function() {
			  return "<span class='closemiddle' onclick='removerow($(this))'>&times;</span> "
		      },
		      "sortable":false
		    },
		    { "targets":[6],
		      "width":"2em",
		      "render":function() {
			  return "<span class='squadtop'><span class='squadmiddle' onclick='checkrow(1,$(this))'>1</span>&nbsp;<span class='squadmiddle right' onclick='checkrow(2,$(this))'>2</span></span>";
		      },
		      "sortable":false
		    },
		    { "targets":[5],
		      "render":function(d,c,row) {
			  return "<span class='logmiddle symbols' onclick='battlelog($(this));'>&#xE901;</span>";
		      },
		      "sortable":false
		    },
		    { "targets":[1],
		      "sortable":false,
		      "render":function(data,type,row) {
			  if (row[4].search("SQUAD")>-1)
			      return "<span style='display:none'>"+data+" USER</span><span class='"+data+"'></span>";
			  else if (row[4]=="ELITE") 
			      return "<span style='display:none'>"+data+" ELITE</span><span class='"+data+"'></span><span class='TOP'></span>";
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
				    TEAMS[0].parseJuggler(data,false);
				    data=TEAMS[0].toJuggler(true);
				}
			    return data.replace(/\n/g,"<br>");
			}
		    }],   
		"ajax": "data/full4b.json",
		"scrollY":        "20em",
		"scrollCollapse": true,
		"deferRender": true,
		"ordering":true,
		"info":true,
		"paging":         true});


	    for (i in localStorage) {
		if (typeof localStorage[i]=="string"&&i.match(/SQUAD.*/)) {
		    //delete localStorage[i];
		    var l=$.parseJSON(localStorage[i]);
		    if (typeof l.jug=="undefined"||typeof l.pts=="undefined")
			delete localStorage[i]
		    else if (LANG!="en") { 
			TEAMS[0].parseJuggler(l.jug,false); 
			addrow(0,i,l.pts,l.faction,TEAMS[0].toJuggler(true)); 
		    } else addrow(0,i,l.pts,l.faction,l.jug);
		}
	    }
	    $("#squadlist tr:first-child .squadtop").attr("data-intro","Select squad").attr("data-position","bottom");
	    $("#squadlist tr:first-child .logmiddle").attr("data-intro",'Battle log').attr("data-position",'left'); 
	}
	var pilots=[];
	for (i=0; i<PILOTS.length; i++) {
	    var n=i;
	    var name=translate(PILOTS[i].name);
	    if (PILOTS[i].ambiguous==true) name+="("+PILOTS[i].unit+")";
	    pilots.push(name.replace(/\'/g,"").replace(/\(Scum\)/g,""));
	}
	var upgrades=[];
	for (i in UPGRADE_translation) {
	    upgrades.push(translate(i).replace(/\'/g,"").replace(/\(Crew\)/g,""));
	}
	$(".squadbg > textarea").asuggest(pilots, { 'delimiters': '^\n', 'cycleOnTab': true });
	$(".squadbg > textarea").asuggest(upgrades, { 'delimiters': '+ ', 'cycleOnTab':true});
    });
});
var cmd=[];
var startreplayall=function() {
    if (REPLAY.length==0) return; 
    cmd=REPLAY.split("_");
    cmd.splice(0,1);
    if (cmd.length==0) return;
    ZONE[1].remove();
    ZONE[2].remove();
    $(".nextphase").prop("disabled",true);
    $(".unit").css("cursor","pointer");
    actionrlock=$.Deferred();
    actionrlock.progress(replayall);
    $("#positiondial").hide();
    //for (var j in squadron) console.log("squadron["+j+"]:"+squadron[j].name+" "+squadron[j].id);
    replayall();
}
var stopreplay=function() {
    actionrlock=$.Deferred();
}
var restartreplay=function() {
    actionrlock=$.Deferred();
    actionrlock.progress(replayall);
    replayall();
}
var replayall=function() {
    var c=cmd[0].split("-");
    console.log(cmd[0]);
    cmd.splice(0,1);
    var u=null;
    var j;
    if (c[0].length>0) {
	var id=parseInt(c[0],10);
	for (j in squadron) if (squadron[j].id==id) break; 
	if (squadron[j].id==id) u=squadron[j];
	else {
	    console.log("cannot find id "+id);
	    //for (j in squadron) console.log("squadron["+j+"]="+squadron[j].name);
	    console.log("notify");
	    actionrlock.notify();
	    console.log("endnotify");
	    return;
	}
    } 
    //if (u!=null) log("cmd : "+u.name+" "+c[1]);
    var FTABLE={"fo":"removefocustoken",
		"FO":"addfocustoken",
		"e":"removeevadetoken",
		"E":"addevadetoken",
		"ct":"removecloaktoken",
		"CT":"addcloaktoken",
		"i":"removeiontoken",
		"I":"addiontoken",
		"tb":"removetractorbeamtoken",
		"TB":"addtractorbeamtoken",
		"ST":"addstress",
		"DPY":"deploy",
		"st":"removestresstoken",
		"d":"dies",
	   };
    if (typeof FTABLE[c[1]]=="string") {
	var f=Unit.prototype[FTABLE[c[1]]];
	if (typeof f=="undefined") log("ftable "+c[1]+" "+FTABLE[c[1]]);
	if (typeof f.vanilla=="function") f.vanilla.call(u,t);
	else f.call(u);
	actionrlock.notify();
	return;
    }
    switch(c[1]) {
    case "P": 
	var p=phase;
	round=parseInt(c[2],10);
	phase=parseInt(c[3],10);
	if (p>phase) {
	    for (var i in squadron) {
		var u=squadron[i];
		u.focus=u.evade=0;
		u.showinfo();
	    }
	}
	$("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
	actionrlock.notify();
	break;
    case "t": 
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target "+c[2]);
	    actionrlock.notify();
	    break;
	}
	var t=squadron[j];
	if (typeof Unit.prototype.removetarget.vanilla=="function") 
	    Unit.prototype.removetarget.vanilla.call(u,t);
	else Unit.prototype.removetarget.call(u,t);
	actionrlock.notify();
	break;
    case "T":
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target "+c[2]);
	    actionrlock.notify();
	    break;
	}
	var t=squadron[j];
	if (typeof Unit.prototype.addtarget.vanilla=="function") 
	    Unit.prototype.addtarget.vanilla.call(u,t);
	else Unit.prototype.addtarget.call(u,t);
	actionrlock.notify();
	break;
    case "s": Unit.prototype.removeshield.call(u,parseInt(c[2],10)); 
	u.show();
	actionrlock.notify();
	break;
    case "S": Unit.prototype.addshield.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "h": Unit.prototype.removehull.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "H": Unit.prototype.addhull.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "d": u.dies(); 	
	actionrlock.notify();
	break;
    case "f": 		   
	u.select();
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target unit "+c[2]);
	    actionrlock.notify();
	} else {
	    targetunit=squadron[j];
	    u.activeweapon=parseInt(c[3],10);
	    u.playfiresnd();
	    //u.log("fires on "+targetunit.name+" with "+u.weapons[u.activeweapon].name);
	    setTimeout(function() { actionrlock.notify(); }, 1000);
	}
	break;
    case "am": 
	u.select();
	u.m=(new Snap.Matrix()).translate(c[2]-300,c[3]-300).rotate(c[4],0,0);
	u.g.transform(u.m);
	u.geffect.transform(u.m);
	actionrlock.notify();
	break;
    case "c":
	(new Critical(u,parseInt(c[2],10))).faceup();
	actionrlock.notify();
	break;
    case "m":
	u.select();
	var d=c[2];
	var l=parseInt(c[4],10);
	var oldm=u.m;
	var path=P[d].path;
	SOUNDS[u.ship.flysnd].play();
	Snap.animate(0,l,function(value) {
	    var m=this.getmatrixwithmove(oldm,path,value);
	    this.g.transform(m);
	    this.geffect.transform(m);
	}.bind(u), TIMEANIM*l/200,mina.linear, function() {
	    this.m=this.getmatrixwithmove(oldm,path,l);
	    this.m.rotate(parseFloat(c[3]),0,0);
	    this.g.transform(this.m);
	    this.geffect.transform(this.m);
	    actionrlock.notify();
	}.bind(u));
	break;
    default: log("undefined cmd "+c[1]);
    }
}

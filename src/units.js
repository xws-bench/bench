/*



 */
var FAST=false;
var s;
var BLACK="#111",GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0",GREY="#888";
var HALFBLACK="#222",HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880",HALFGREY="#444";
var TIMEANIM=FAST?0:1000;
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
var ILLICIT="Illicit",ELITE="Elite",TURRET="Turret",MISSILE="Missile",ASTROMECH="Astromech",TORPEDO="Torpedo",CANNON="Cannon",BOMB="Bomb",TECH="Tech",CREW="Crew",SYSTEM="System",SALVAGED="Salvaged",MOD="Mod",TITLE="Title",ROCK="Rock",DEBRIS="Debris";
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
var SOUND_DIR="ogg/";
var SOUND_FILES=[
    "cloak_romulan",
    "decloak_romulan",
    "EXPLODE3",
    "KX9_laser_cannon",
    "TIE-Fire",
    "Slave1-Guns",
    "Falcon-Guns",
    "XWing-Fly1",
    "TIE-Fly2",
    "Slave1-Fly1",
    "Falcon-Fly1",
    "Falcon-Fly3",
    "YWing-Fly2",
    "ISD-Fly",
    "missile",
    "XWing-Fly2",
    "DStar-Gun4",
    "TIE-Fly6",
    "Slave1-Fly2",
    "ghost"
];
var SOUNDS={};
var SOUND_NAMES=["cloak","decloak","explode","xwing_fire","tie_fire","slave_fire","falcon_fire","xwing_fly","tie_fly","slave_fly","falcon_fly","yt2400_fly","ywing_fly","isd_fly","missile","xwing2_fly","dstar_gun","tie2_fly","slave2_fly","ghost"];
function loadsound() {
    var i,j;
    var sound={"explode":2,"cloak":0,"decloak":1};
    for (i=0; i<squadron.length; i++) {
	sound[squadron[i].ship.firesnd]=SOUND_NAMES.indexOf(squadron[i].ship.firesnd);
	sound[squadron[i].ship.flysnd]=SOUND_NAMES.indexOf(squadron[i].ship.flysnd);
	for (j=1; j<squadron[i].weapons.length; j++) {
	    sound[squadron[i].weapons[j].firesnd]=SOUND_NAMES.indexOf(squadron[i].weapons[j].firesnd);
	}
	    
    }
    for (i in sound) {
	SOUNDS[i]=new Howl({
	    urls: [SOUND_DIR+SOUND_FILES[sound[i]]+".ogg", SOUND_DIR+SOUND_FILES[sound[i]]+".m4a", SOUND_DIR+SOUND_FILES[sound[i]]+".wav"],
	    autoplay:false,
	    loop:false
	});
    }
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
    BILASER:{key:"<",color:RED},
    LASER180:{key:">",color:RED},
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
    this.nomoreattack=0;
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
    if (typeof PILOTS[pilotid].shipimg=="undefined") this.shipimg=u.img[0];
	else this.shipimg=PILOTS[pilotid].shipimg;
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
    //this.install(this);
    TEAMS[this.team].updatepoints();
}
Unit.prototype = {
    tosquadron: function(s) {
	var upgs=this.upg;
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
	this.oldoverlap=-1;
	this.ocollision={overlap:-1,template:[],mine:[]};
	var uu=[];
	for (j in upgs) if (upgs[j]>-1) uu.push(Upgradefromid(this,upgs[j]));
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	var img=this.shipimg;

	if (!(this.islarge)) {
	    if (typeof this.shipimg!="undefined") {
		img=this.shipimg;
	    }
	    if (typeof img=="undefined") 
		this.img=s.text(-10,10,this.ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction=="SCUM")?'r -1 1':'')).attr({
		class:"xwingship",
	    }); else 	    this.img=s.image("png/"+img,-20*this.scale,-20*this.scale,40*this.scale,40*this.scale).transform('r 90 0 0').attr({ pointerEvents:"none"});


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
	this.border = s.rect(-w,-w,2*w,2*w).attr({
	    fill:"rgba(0,0,0,0)",
	    strokeWidth: 2,
	    stroke:halftone(this.color),
	});
	this.tohitstats={};
	this.tohit = s.text(-w,w-30,"0").attr({class:"tohit",strokeWidth:1});
	this.meanhit = s.text(-w,w-15,"0").attr({class:"tohit",strokeWidth:1});
	this.meanhitsymbol = s.text(-w+40,w-15,"0").attr({class:"symbols",strokeWidth:0,text:"d"});
	this.meancrit = s.text(-w,w,"0").attr({class:"tohit",strokeWidth:1});
	this.meancritsymbol = s.text(-w+40,w,"0").attr({class:"symbols",strokeWidth:0,text:"c"});
	this.gproba = s.group(this.tohit,this.meanhit,this.meanhitsymbol,this.meancrit,this.meancritsymbol).attr({display:"none",fontSize:"15",stroke:"#fff",fill:"#fff",opacity:1});
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
	this.gstat=s.group(this.skillbar,this.firebar,this.evadebar,this.shieldbar,this.hullbar,this.gproba).attr({pointerEvents:"none"});
	this.dialspeed = s.text(2+w,3-w,"").attr({class: "dialspeed",pointerEvents:"none"});
	this.dialdirection = s.text(w+8,3-w,"").attr({class: "symbols",pointerEvents:"none" });
	this.actionicon = s.text(w+2,-7,"").attr({pointerEvents:"none",class: "symbols",strokeWidth:0});
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
		.attr({pointerEvents:"none",
		       class: "xsymbols",
		       fill:A[AINDEX[i+2]].color,
		       strokeWidth: 0
		      });
	}
	this.geffect=s.group(this.imgflame,this.imgsmoke).attr({pointerEvents:"none"});
	// Order in the group is important. Latest is on top of stacked layers
	this.g=s.group(this.sector,this.outline,this.img,this.border,this.dialspeed,this.dialdirection,this.actionicon,this.infoicon[0],this.infoicon[1],this.infoicon[2],this.infoicon[3],this.infoicon[4],this.infoicon[5],this.gstat);
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
		$(".info").css({left:x,top:y}).attr({pointerEvents:"none"}).html(translate(this.name))
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
	if (typeof save=="undefined") console.log("name"+name+" undefined");
	var global=false;
	if (typeof save.org=="undefined"&&this!=Bomb.prototype&&this!=Unit.prototype&&this!=Weapon.prototype) global=true;
	var f=function () {
            var args = Array.prototype.slice.call(arguments),result;
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
	if (typeof save.vanilla!="undefined") f.vanilla=save.vanilla;
	else f.vanilla=save;
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
	    log("showing "+self.name);
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
	    if (u>-1&&typeof u!="undefined") {
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
	    if (u>-1&&typeof u!="undefined") {
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
	for (var i=0; i<this.upgrades.length; i++) {
	    var u=this.upgrades[i].id;
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
	var img=PILOTS[this.pilotid].dict;
	if (PILOTS[this.pilotid].ambiguous==true) img+="-"+unitlist[this.ship.name].dict;
	var sname=SHIP_translation[this.ship.name];
	if (typeof SHIP_translation[this.ship.name]=="undefined") sname=this.ship.name;
	var rendered = Mustache.render(TEMPLATES["unit-creation"], {
	    imgname:img,
	    faction:currentteam.faction,
	    skill:this.getskill(),
	    name:translate(this.name),
	    points:this.points,
	    unique:(PILOTS[this.pilotid].unique==true?false:true),
	    id:this.id,
	    evade:this.agility,
	    hull:this.ship.hull,
	    shield:this.ship.shield,
	    fire:this.weapons[0].getattack(),
	    shipimg:this.shipimg,
	    diallist:dial2JSON(this.getdial()),
	    shipname:sname,
	    actionstring:this.getactionstring(),
	    upgradeaddstring:this.getupgradeaddstring()
	});
	return rendered;
    },
    setpriority:function(action) {
	var PRIORITIES={"FOCUS":3,"EVADE":1,"CLOAK":4,"TARGET":2,"CRITICAL":100};
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
	if (this.hasionizationeffect()) return [{move:"F1",difficulty:"WHITE"}];
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
	zone=SETUPS.playzone;
	for (i=0; i<4; i++)
	    //if (op[i].x<0||op[i].x>900||op[i].y<0||op[i].y>900) return false;
	    if (!Snap.path.isPointInside(zone,op[i].x,op[i].y)) return false;
	return true;
    },
    getOutlinePoints: function(m) {
	var w=(this.islarge)?40:20;
	if (typeof m=="undefined") m=this.m;
	return [{x:m.x(-w,-w),y:m.y(-w,-w)},{x:m.x(w,-w),y:m.y(w,-w)},{x:m.x(w,w),y:m.y(w,w)},{x:m.x(-w,w),y:m.y(-w,w)}];
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
    getRangePoints: function(n,m) {
	var w=(this.islarge)?40:20;
	return $.map([{x:-w,y:-100*n-w},{x:w,y:-100*n-w},{x:100*n+w,y:-w},{x:100*n+w,y:w},{x:w,y:100*n+w},{x:-w,y:100*n+w},{x:-100*n-w,y:w},{x:-100*n-w,y:-w}],
	//return $.map([{x:-w,y:-100*n-w},{x:w,y:-100*n-w},{x:100*n+1+w,y:-w},{x:100*n+1+w,y:w},{x:w,y:100*n+1+w},{x:-w,y:100*n+1+w},{x:-100*n-w-1,y:w},{x:-100*n-w-1,y:-w}],
		    function(a,i) { return transformPoint(m,a); });
    },
    getHalfRangePoints:function(n,m) {
	var w=(this.islarge)?40:20;
	return $.map([{x:100*n+w,y:0},{x:100*n+w,y:-w},{x:w,y:-100*n-w},{x:-w,y:-100*n-w},{x:-100*n-w,y:-w},{x:-100*n-w,y:0}],
		    function(a,i) { return transformPoint(m,a); });
    },
    getRangeString: function(n,m) {
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 1 ";
	var p=this.getRangePoints(n,m);
	return ("M "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y+circle+p[6].x+" "+p[6].y+" L "+p[7].x+" "+p[7].y+circle+p[0].x+" "+p[0].y+" Z");
    },
    getHalfRangeString: function(n,m) {
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 0 ";
	var p=this.getHalfRangePoints(n,m);
	return ("M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y+" Z");
    },
    getSubRangeString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 1 ";
	var p=this.getRangePoints(n1,m);
	var str="M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y+circle+p[6].x+" "+p[6].y+" L "+p[7].x+" "+p[7].y+circle+p[0].x+" "+p[0].y;
	circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 0 ";
	p=this.getRangePoints(n2,m);
	str+=" L "+p[0].x+" "+p[0].y+circle+p[7].x+" "+p[7].y+" L "+p[6].x+" "+p[6].y+circle+p[5].x+" "+p[5].y+" L "+p[4].x+" "+p[4].y+circle+p[3].x+" "+p[3].y+" L "+p[2].x+" "+p[2].y+circle+p[1].x+" "+p[1].y+" L "+p[0].x+" "+p[0].y;
	return str;
    },
    getHalfSubRangeString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 0 ";
	var p=this.getHalfRangePoints(n1,m);
	var str="M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y;
	var circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 1 ";
	p=this.getHalfRangePoints(n2,m);
	str+=" L "+p[5].x+" "+p[5].y+" L "+p[4].x+" "+p[4].y+circle+p[3].x+" "+p[3].y+" L "+p[2].x+" "+p[2].y+circle+p[1].x+" "+p[1].y+" L "+p[0].x+" "+p[0].y+" Z";
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
	return $.map([{x:-(socle+100*n)/Math.sqrt(1+w*w/(w-3)/(w-3)),y:-(socle+100*n)/Math.sqrt(1+(w-3)*(w-3)/w/w)},
			{x:-w+3,y:-w-100*n-1},
			{x:w-3,y:-w-100*n-1},
			{x:(socle+100*n)/Math.sqrt(1+w*w/(w-3)/(w-3)),y:-(socle+2+100*n)/Math.sqrt(1+(w-3)*(w-3)/w/w)}],
		    function(a,i) { return transformPoint(m,a); });
    },
    setmaneuver: function(i) {
	this.lastmaneuver=this.maneuver;
	this.maneuver=i;
	this.showdial();
	this.showmaneuver();
	if (typeof this.deferred == "undefined") this.error("undefined deferred");
	nextplanning();
	//this.deferred.notify();
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
    getBall: function(m) {
	return { x:m.x(0,0),y:m.y(0,0),diam:(this.islarge?56:28) };
    },
    fastgetocollisions: function(mbegin,mend,path,len) {
	var k,i;
	// Overlapping obstacle ?
	var pp=[];
	var tb=this.getBall(mend);
	for (i=0; i<=len; i+=len/5) {
	    var p=path.getPointAtLength(i);
	    pp[i]={x:mbegin.x(p.x,p.y),y:mbegin.y(p.x,p.y)};
	}
	//s.circle(tb.x,tb.y,tb.diam).attr({fill:"#f00"});

	for (k=0; k<OBSTACLES.length; k++){
	    var b=OBSTACLES[k].getBall();
	    var D=b.diam+tb.diam;
	    //s.circle(b.x,b.y,b.diam).attr({fill:"#fff"});
	    var d=D*D;
	    if ((b.x-tb.x)*(b.x-tb.x)+(b.y-tb.y)*(b.y-tb.y)<d) return true;
	    for (i=0; i<pp.length; i++) 
	 	if ((b.x-pp[i].x)*(b.x-pp[i].x)+(b.y-pp[i].y)*(b.y-pp[i].y)<d) return true;
	}
	return false;
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
		if (this.oldoverlap!=k) {
		    if (k<6) collision.overlap=k; 
		    else collision.mine.push(OBSTACLES[k]);
		} 
	    }
	}
	if (typeof path!="undefined") {
	    // Template overlaps ? 
	    for (i=0; i<=len; i+=5) {
		var p=path.getPointAtLength(i);
		pathpts.push({x:mbegin.x(p.x,p.y),y:mbegin.y(p.x,p.y)});
	    }
	    for (j=0; j<pathpts.length; j++) {
		for (k=0; k<OBSTACLES.length; k++) {
		    if (k!=collision.overlap&&k!=this.oldoverlap&&collision.template.indexOf(k)==-1&&collision.mine.indexOf(OBSTACLES[k])==-1) { // Do not count overlapped obstacle twice
			var o2=OBSTACLES[k].getOutlineString().p;
			for(i=0; i<o2.length; i++) {
			    var dx=(o2[i].x-pathpts[j].x);
			    var dy=(o2[i].y-pathpts[j].y);
			    if (dx*dx+dy*dy<=100) { 
				if (k<6) collision.template.push(k); 
				else collision.mine.push(OBSTACLES[k]);
				break;
			    } 
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
    getmovecolor: function(m,withcollisions,withobstacles,path,len,order) {
	var i,k;
	if (!this.isinzone(m)) return RED;
	if (withobstacles&&this.fastgetocollisions(this.m,m,path,len))
	    return YELLOW;
 	if (withcollisions) {
	    var so=this.getOutlineString(m);
	    var sk=this.getskill();
	    for (k in squadron) {
		var u=squadron[k];
		if (u==this) continue;
		var m=(order?u.futurem:u.m);
		var su=u.getOutlineString(m);
		if (Snap.path.intersection(su.s,so.s).length>0
		    ||((this.islarge&&!u.islarge&&this.isPointInside(so.s,su.p)))
		    ||((!this.islarge&&u.islarge)&&this.isPointInside(su.s,so.p))) return WHITE;
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
	if (this.tractorbeam==1&&!this.islarge) {
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
	this.animateaddtoken("xtractorbeamtoken");
	this.movelog("TB");
	this.show();
    },
    removetractorbeamtoken: function() {
	this.tractorbeam--;
	this.animateremovetoken("xtractorbeamtoken");
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
	this.movelog("d-0");
	$("#"+this.id).attr("onclick","");
	$("#"+this.id).addClass("dead");
	$("#"+this.id).html(""+this);
	$("#"+this.id+" .outoverflow").each(function(index) { 
	    if ($(this).css("top")!="auto") {
		$(this).css("top",$(this).parent().offset().top+"px");
	    }
	});
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
	if (!FAST) SOUNDS.explode.play();
	this.dead=true;
	
	this.log("has exploded!");
	setTimeout(function(){ 
	    //this.m=MT(-60,-60);
	    this.geffect.attr({display:"none"});
	    this.show();
	    if (TEAMS[this.team].checkdead()) win();	
	    //squadron[0].select();
	}.bind(this), (FAST?0:1000)); // 29 images * 4 1/100th s
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
	var ch=getattackresult();
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
    modifydamageassigned: function(ch,attacker) {return ch;},
    modifydefenseroll: function(a,m,n) { return m;},
    modifyattackroll: function(m,n,d) { return m;},
    resolveishit:function() {},
    hashit:function(t) { return this.criticalresolved+this.hitresolved>0;},
    resolvedamage: function() {
	$(".fireline").remove();
	if (!FAST) this.playfiresnd();
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
    postattack: function(i) { },
    cleanupattack: function() {
	this.actionbarrier();
    },
    resetfocus: function() {
	return 0;
    },
    resetevade: function() {
	return 0;
    },
    endround: function() {
	for (var i=0; i<this.upgrades.length; i++) 
	    this.upgrades[i].endround();
	this.focus=this.resetfocus();
	this.evade=this.resetevade();
	this.hasfired=0;
	this.oldoverlap=this.ocollision.overlap;
	this.ocollision.overlap=-1;
	this.ocollision.template=[];
	this.ocollision.mine=[];
	this.collision=false;
	this.touching=[];
	this.nomoreattack=0;
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
	var VALUES={"#000":0,"#F00":1,"#FF0":2,"#FFF":3,"#0F0":4};
	NOLOG=false;
	var ref=(this.m.split().rotate+360+180)%360-180;

	for (i=0; i<gd.length; i++) {
	    gd[i].path=P[gd[i].move].path;
	    gd[i].len=gd[i].path.getTotalLength()+(this.islarge?40:0);
	}
	var m=this.m;
	for (i=0; i<gd.length; i++) {
	    var mm = this.getpathmatrix(this.m,gd[i].move);
	    gd[i].m=mm;
	    if (!this.canreveal(gd[i])) gd[i].color=BLACK; 
	    else {
		var color=this.getmovecolor(mm,withcollisions,withobstacles,gd[i].path,gd[i].len,true);
		gd[i].color=color;
		
		if (color!=RED&&color!=BLACK&&withcollisions&&withobstacles) {
		    var c=RED;
		    for (j=0; j<gd.length; j++) {
			if (gd[j].move=="F0") continue;
			//if (gd[j].move=="F0"||(gd[j].difficulty=="RED"&&
			//    ((this.stress>0&&gd[i].difficulty!="GREEN")
			// ||gd[i].difficulty=="RED"))) continue;
			// Simplification: no need to uturn here.
			var mmm=this.getmatrixwithmove(mm,gd[j].path,gd[j].len);
			ccc=GREEN;
			if (!this.isinzone(mmm)) ccc=RED;
			else if (withobstacles&&this.fastgetocollisions(mm,mmm,gd[j].path,gd[j].len)) ccc=YELLOW;
			    //this.log("trying "+gd[i].move+"-> "+gd[j].move+" "+fc);
			if (VALUES[ccc]>VALUES[c]) c=ccc;
		    }
		    if (gd[i].move!="F0") 
			if (VALUES[c]<VALUES[color]) gd[i].color=c;
		}
		
		//this.log(">"+gd[i].move+" "+gd[i].color+" "+withobstacles);
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
			this.ocollision.overlap=i;
			this.log("colliding with obstacle");
			if (!this.canmoveonobstacles()) this.resolveocollision(1,[]);
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
	    if ((possible&&(c==YELLOW||c==RED))||c==GREEN||(possible&&!automove)) {
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
	    function (t,k) { t.endaction(n,"BOOST"); },true,this.canmoveonobstacles());
    },
    canmoveonobstacles:function() { return false; },
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
	this.animateremovetoken("xcloaktoken");
	this.movelog("ct");
	if (!FAST) SOUNDS.decloak.play();
    },
    resolvedecloak: function() {
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
    gettallonrollmatrix: function(m,maneuver) {
	var m0=this.getpathmatrix(m,maneuver);
	return [m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20)];
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
	    function(t,k) { t.endaction(n,"ROLL");},true,this.canmoveonobstacles());
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
	this.animateaddtoken("xcloaktoken");
	this.movelog("CT");
	if (!FAST) SOUNDS.cloak.play();
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
	this.wrap_after("canfire",this,function() { return false;}).unwrapper("endround");
	this.wrap_after("endmaneuver",this,function() {
	    this.endaction(n,"SLAM");
	}).unwrapper("endactivationphase");
	this.wrap_after("candoendmaneuveraction",this,function() {
	    return false;
	}).unwrapper("endactivationphase");
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
	    var restorefocus=0;
	    // Check this: either one TL and no requirement, or more than one TL. 
	    if (this.weapons[w].consumes
		&&((this.targeting.indexOf(sh)>-1
		    &&!"Target".match(this.weapons[w].getrequirements()))
		||(this.targeting.indexOf(sh,this.targeting.indexOf(sh)+1)>-1)))
		this.reroll=10;
	    else this.reroll=0;
	    // If TL and focus are required, use both...TODO
	    if (this.focus>0
		&&(typeof this.weapons[w].getrequirements()!="undefined")
		&&this.weapons[w].consumes
		&&"Focus".match(this.weapons[w].getrequirements())) { 
		this.focus--; restorefocus=1; 
	    }
	    var thp= tohitproba(this,this.weapons[w],sh,
			      this.getattacktable(attack),
			      sh.getdefensetable(defense),
			      attack,
			      defense);
	    if (restorefocus) this.focus++;
	    return thp;
	} else return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    },
    isfireobstructed: function() {
	return this.ocollision.overlap>-1&&OBSTACLES[this.ocollision.overlap].type==ROCK;
    },
    hascollidedobstacle: function() {
	return this.ocollision.overlap>-1||this.ocollision.template.length>0;
    },
    canfire: function() {
 	var b= (this.nomoreattack==0)&&(this.hasfired==0)/*&&((r[1].length>0||r[2].length>0||r[3].length>0)*/&&!this.iscloaked&&!this.isfireobstructed();
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
	    e.click(function() { reroll(n,(to==ATTACK_M),a,i); });
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
	this.select();	
	for (i in squadron) if (squadron[i]==this) break;
	this.preattackroll(w,targetunit);
	this.doselection(function(n) {
	    var attack=this.getattackstrength(w,targetunit);
	    var defense=targetunit.getdefensestrength(w,this);
	    this.doattackroll(this.attackroll(attack),attack,defense,i,n);
	    //this.show();
	}.bind(this),"in combat")
	//this.show();
    },
    preattackroll:function(w,targetunit) {
    },
    doattack: function(forced) {
	this.showattack(forced);
    },
    doattackroll: function(ar,ad,defense,me,n) {
	ar=this.weapons[this.activeweapon].modifydamagegiven(ar);
	displayattackroll(ar,ad);
	//this.log("target:"+targetunit.name+" "+defense+" "+ar+" "+ad+" "+defense+" "+n+" me:"+squadron[me].name);
	this.ar=ar;this.ad=ad;
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
	    this.endnoaction(n,"in combat");
	}.bind(squadron[me]));
    },
    drawpathmove:function(mm,path,lenC) {
	if (FAST) return;
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
	if (this.hascollidedobstacle()) {
	    if (this.ocollision.overlap>-1&&OBSTACLES[this.ocollision.overlap].type==DEBRIS) this.addstress();
	    for (var i=0; i<this.ocollision.template.length; i++) {
		var j=this.ocollision.template[i];
		if (typeof j!="undefined"&&OBSTACLES[j].type==DEBRIS) this.addstress();
	    }
	}
    },
    completemaneuver: function(dial,difficulty,halfturn,finalm) {
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
	if (this.isfireobstructed()) { this.log("overlaps obstacle: cannot attack"); }
	if (this.hascollidedobstacle()) { this.log("unit or template overlaps obstacle: no action"); }
	if (lenC>0) this.m=m;
	var turn=0;
	// Animate movement
	if (lenC>0) {
	    this.hasmoved=true;
	    $("#activationdial").empty();
	    if (!FAST) SOUNDS[this.ship.flysnd].play();
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
			if (typeof finalm!="undefined") this.m=finalm; 
			else this.m.rotate(90,0,0);
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
		if (this.hascollidedobstacle()) 
		    this.resolveocollision(this.ocollision.overlap,this.ocollision.template);
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
	    if (ml[i].move.match(/TRR\d|TRL\d/)) {
		var gtr=this.gettallonrollmatrix(this.m,ml[i].move);
		for (var j=0; j<gtr.length; j++) {
		    p.push(gtr[j]);
		    if (j>0) q.push(ml[i]);
		}
	    } else if (ml[i].halfturn==true&&!ml[i].move.match(/K\d|SR\d|SL\d/))
		p.push(this.getpathmatrix(this.m,ml[i].move).rotate(180,0,0));
	    else p.push(this.getpathmatrix(this.m,ml[i].move));
	}
	this.resolveactionmove(p,function(t,k) {
	    if (k==-1) k=0;
	    var dial=q[k].move;
	    var difficulty=q[k].difficulty;
	    if (q[k].halfturn!=true) q[k].halfturn=false; 
	    this.completemaneuver(dial,difficulty,q[k].halfturn,p[k]);
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
	return this.deferred.resolve(v);
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
    addattack: function(f,org,wn,t) {
	this.addattack=-1;
	this.wrap_after("endattack",org,function(c,h) {
	    //this.log("f:"+f(c,h)+" active:"+this.weapons[wn].isactive);
	    if (f(c,h)&&this.weapons[wn].isactive
		&&this.addattack<round) {
		this.latedeferred=this.deferred;
		this.addattack=round;
		this.newlock().done(function() {
		    this.deferred=this.latedeferred;
		    this.log("+1 attack with %1 [%0]",org.name,this.weapons[wn].name);
		    if (typeof t=="function") this.resolveattack(wn,t());
		    else this.selecttargetforattack(wn); 
		}.bind(this));
	    }
	})
    },
    candoendmaneuveraction: function() { 
	return this.candoaction()
	    &&!this.collision
	    &&!this.hascollidedobstacle(); },
    doendmaneuveraction: function() {
	if (this.candoendmaneuveraction()) return this.doaction(this.getactionlist(),"");
	this.action=-1; this.actiondone=true;
	return this.unlock();
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
			    if (k.type=="BOMB") e.addClass("bombs");
			    e.attr("title",list[i].name);
			    if (list[i].name.slice(-2)=="/2") {
				e.css("color","yellow");
			    }
			    $("#actiondial > div").append(e);
			}.bind(this))(list[i],i);
		    }
		}
		var e=$("<button>").addClass("m-skip").addClass("wbutton").click(function() { this.resolveaction(null,n); }.bind(this));
		$("#actiondial > div").append(e);
	    } else this.endaction(n);
	}.bind(this),list[0].name);  
    },
    donoaction: function(list,str,noskip) {
	var l;
	if (list.length==0) {
	    this.log("no action available");
	    return this.enqueueaction(function(n) {
		this.endnoaction(n);
	    }.bind(this),this.name);
	} 
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
		var e=$("<button>").addClass("m-skip").addClass("wbutton").click(function() { this.resolvenoaction(null,n); }.bind(this));
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
		str+="<button class='m-skip wbutton' onclick='activeunit.hasfired++;activeunit.show();activeunit.unlock();'></button>";
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
	if (this.candropbomb()&&(this.hasionizationeffect())) {
	    //this.log("ionized, cannot drop bombs");
	} else if (self.lastdrop!=round) {
	    switch(this.bombs.length) {
	    case 3: if (this.bombs[2].canbedropped()) 
		this.addactivationdial(
		    function() { return self.lastdrop!=round&&self.bombs[2].canbedropped(); },
		    function() { 
			self.lastdrop=round;
			$(".bombs").remove();
			self.bombs[2].actiondrop();
		    }, A["BOMB"].key,
		    $("<div>").attr({class:"symbols bombs",title:self.bombs[2].name}));
	    case 2:if (this.bombs[1].canbedropped()) 
		this.addactivationdial(
		    function() { return self.lastdrop!=round&&self.bombs[1].canbedropped(); },
		    function() { 
			self.lastdrop=round;
			$(".bombs").remove();			
			self.bombs[1].actiondrop();
		    }, A["BOMB"].key,
		    $("<div>").attr({class:"symbols bombs",title:self.bombs[1].name}));
	    case 1:if (this.bombs[0].canbedropped()) 
		this.addactivationdial(
		    function() { return self.lastdrop!=round&&self.bombs[0].canbedropped(); },
		    function() { 
			self.lastdrop=round;
			$(".bombs").remove();
			self.bombs[0].actiondrop();
		    }, A["BOMB"].key,
		    $("<div>").attr({class:"symbols bombs",title:self.bombs[0].name}));
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
	$("<button>").addClass("m-move").addClass("wbutton").click(function() { this.resolvemaneuver(); }.bind(this)).appendTo("#activationdial > div");

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
	var h=$("#"+this.id+" .usabletokens").html();
	var gut=this.getusabletokens();
	$("#"+this.id+" .usabletokens").html(gut);
	if (h!=gut) {
	    for (var j in squadron) {
		var u=squadron[j];
		if (this.team==u.team&&this.getskill()>=u.getskill())
		    u.showoverflow();
	    }
	}
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
	    this.infoicon[i++].attr({text:"Y",fill:A.STRESS.color});}
	for (var j=i; j<6; j++) {
	    this.infoicon[i++].attr({text:""});}	    
    },
    showoutline: function() {
        this.border.attr({ stroke:((activeunit==this)?this.color:halftone(this.color)) }); 
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
	$("#"+this.id).html(""+this);
	$("#"+this.id+" .outoverflow").each(function(index) { 
	    if ($(this).css("top")!="auto") {
		$(this).css("top",$(this).parent().offset().top+"px");
	    }
	});
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
	return this.maneuver>-1&&phase<=ACTIVATION_PHASE;
    },
    getmaneuver: function() {
	if (this.hasionizationeffect()) {
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
    hasionizationeffect: function() {
	return ((this.ionized>0&&!this.islarge)||this.ionized>1);
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
	if (i>-1) str+="<div class='usabletokens' style='width:100%'>"+this.getusabletokens()+"</div>";
	str+="</div></div>";
	var a;
	var b;
	var strw="",stru="",strc="";
	
	a="<td><button class='statevade' onclick='if (!squadron["+i+"].dead&&!squadron["+i+"].isdocked) squadron["+i+"].togglerange();'><span class='val'>"+this.getagility()+"</span><span class='symbols'>^</span></button></td>";
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
	this.focuses=(this.focus>1?[this.focus]:[]);
	this.evades=(this.evade>1?[this.evade]:[]);
	this.stresses=(this.stress>1?[this.stress]:[]);
	this.ionizedes=(this.ionized>1?[this.ionized]:[]);
	this.tractorbeames=(this.tractorbeam>1?[this.tractorbeam]:[]);
	this.targetedname=[];
	this.targetingname=[];
	for (var j=0; j<this.istargeted.length; j++) 
	    this.targetedname[j]=this.istargeted[j].name.replace(/\'/g,"&#39;");
	for (var j=0; j<this.targeting.length; j++) 
	    this.targetingname[j]=this.targeting[j].name.replace(/\'/g,"&#39;");
	return Mustache.render(TEMPLATES["usabletokens"], this);
    },
    showskill:function() {
	var s=this.getskill();
	$("#unit"+this.id+" .statskill").html(s);
	$("#"+this.id+" .statskill").html(s);
    },
    showstats: function() {
	$("#unit"+this.id+" .statevade .val").html(this.getagility());
	//$("#unit"+this.id+" .statfire .val").html(this.weapons[0].getattack());
	if (phase==SELECT_PHASE||phase==CREATION_PHASE) {
	    $("#unit"+this.id+" .stathull .val").html(this.ship.hull);
	    $("#unit"+this.id+" .statshield .val").html(this.ship.shield);
	} else {
	    this.skillbar.attr({text:repeat('u',this.getskill())});
	    this.firebar.attr({text:repeat('u',this.weapons[0].getattack())});
	    this.evadebar.attr({text:repeat('u',this.getagility())});
	    this.hullbar.attr({text:repeat('u',this.hull)});
	    this.shieldbar.attr({text:repeat('u',this.shield+this.hull)});
	    var n=8+this.upgrades.length*2;
	    if (this.hull+this.shield<=n) {
		$("#"+this.id+" .stat .hull").html(repeat("u ",this.hull));
		$("#"+this.id+" .stat .shield").html(repeat("u ",this.shield));
	    } else if (this.hull>n) {
		$("#"+this.id+" .stat .hull").html(repeat("u ",n));
		if (this.hull<=n*2) {
		    $("#"+this.id+" .stat2 .hull").html(repeat("u ",this.hull-n));
		    if (this.shield+this.hull<=n*2) 
			$("#"+this.id+" .stat2 .shield").html(repeat("u ",this.shield));
		    else {
			$("#"+this.id+" .stat2 .shield").html(repeat("u ",n*2-this.hull));
			$("#"+this.id+" .stat3 .shield").html(repeat("u ",this.shield-n*2+this.hull));		
		    }
		} else {
		    $("#"+this.id+" .stat2 .hull").html(repeat("u ",n));
		    $("#"+this.id+" .stat3 .hull").html(repeat("u ",this.hull-n*2));
		    $("#"+this.id+" .stat3 .shield").html(repeat("u ",this.shield));
		}
	    } else {
		$("#"+this.id+" .stat .hull").html(repeat("u ",this.hull));
		$("#"+this.id+" .stat .shield").html(repeat("u ",n-this.hull));
		$("#"+this.id+" .stat2 .shield").html(repeat("u ",this.shield-n+this.hull));
	    }
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
	return  (this==activeunit&&this.maneuver>-1&&!this.hasmoved&&this.getskill()==skillturn&&phase==ACTIVATION_PHASE&&subphase==ACTIVATION_PHASE);
    },
    showoverflow: function() {
	if (!this.dead) { 
	    $("#"+this.id).html(""+this);
	    $("#"+this.id+" .outoverflow").each(function(index) { 
		if ($(this).css("top")!="auto") {
		    $(this).css("top",($(this).parent().offset().top)+"px");
		}
	    });
	}
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
	this.showoverflow();
    },
    updatetohit: function(b,wp) {
	var w=this.weapons[wp];
	var e=w.getenemiesinrange();
	if (!b) 
	    for (var i in e) delete e[i].tohitstats[this.id];
	else for (var i in e) e[i].tohitstats[this.id]={unit:this,weapon:wp};

	for (var i in e) {
	    var u=e[i];
	    NOLOG=true;
	    var tohit=1;
	    var meanhit=0;
	    var meancrit=0;
	    var focus=u.focus;
	    var evade=u.evade;
	    var p=[];
	    for (var j in u.tohitstats) {
		var v=u.tohitstats[j];
		var w=v.weapon;
		if (typeof v.unit=="undefined") continue;
		var ss=v.unit.evaluatetohit(v.weapon,u);
		tohit *=(1-ss.tohit/100.);
		meanhit+=ss.meanhit;
		meancrit+=ss.meancritical;
		if (u.focus>0) u.focus--;
		if (u.evade>0) u.evade--;
		p=[];
		while (typeof v.unit.weapons[w].followupattack=="function"
		       &&p.indexOf(w)==-1) {
		    p.push(w);
		    var ww=w;
		    w=v.unit.weapons[w].followupattack();
		    ss=v.unit.evaluatetohit(w,u);
		    //console.log("follow-up attack "+v.unit.weapons[ww].name+" -> "+v.unit.weapons[w].name);
		    tohit *=(1-ss.tohit/100.);
		    meanhit+=ss.meanhit;
		    meancrit+=ss.meancritical;
		    if (u.focus>0) u.focus--;
		    if (u.evade>0) u.evade--;
		}
	    }
	    u.tohitstats.tohit=tohit;
	    u.tohitstats.meanhit=meanhit;
	    u.tohitstats.meancrit=meancrit;
	    u.evade=evade;
	    u.focus=focus;
	    NOLOG=false;
	}
    },
    displaytohit: function(wp) {
	var w=this.weapons[wp];
	var e=w.getenemiesinrange();
	// Display
	for (var i in e) {
	    var u=e[i];
	    var tohit=1-u.tohitstats.tohit;
	    var hit=u.tohitstats.meanhit;
	    var crit=u.tohitstats.meancrit;
	    if (hit==0) u.gproba.attr({display:"none"});
	    else {
		var r=-u.m.split().rotate;
		u.gproba.transform("r "+r+" 0 0").attr({display:"block"});
		u.tohit.attr({text:Math.floor(tohit*100)+"%"});
		u.meanhit.attr({text:Math.floor(hit*100)/100});
		u.meancrit.attr({text:Math.floor(crit*100)/100});
	    }
	    u.show();
	}
    },
    showhitsector: function(b,wp) {
        var opacity=(b)?"inline":"none";
	this.select();
	if (typeof wp=="undefined") wp=0;
	var w=this.weapons[wp];
	if (!b) {
	    for (i=0; i<this.sectors.length; i++) this.sectors[i].remove();
	    for (i=0; i<this.ranges.length; i++) this.ranges[i].remove();
	    this.ranges=[];
	    this.sectors=[];
	    this.updatetohit(b,wp);
	    this.displaytohit(wp);
	    return;
	}
	var r0=w.getlowrange(), r1=w.gethighrange();
	if (w.isTurret()||this.isTurret(w)) {
	    this.showrange(b,r0,r1);
	} else {
	    var i,k;
	    if (r0==1) {
		for (i=r0;i<=r1; i++) { 
		    this.sectors.push(s.path(this.getPrimarySectorString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof w.auxiliary!="undefined") {
		    var aux=w.auxiliary;
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(aux.call(this,i,this.m.clone())).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		} 
	    } else {
		for (i=r0; i<=r1; i++) {
		    this.sectors.push(s.path(this.getPrimarySubSectorString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof w.subauxiliary!="undefined") {
		    var aux=w.subauxiliary;
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(aux.call(this,r0-1,i,this.m.clone())).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		}

	    }
	}
	this.updatetohit(b,wp);
	this.displaytohit(wp);
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
		this.ranges.push(s.path(this.getRangeString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
	} else {
	    for (i=r0; i<=r1; i++) 
		this.ranges.push(s.path(this.getSubRangeString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
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
    resolveocollision: function(o,t) {
	var i;
	var p=t;
	if (p.indexOf(o)==-1&&o>-1) p.push(o);
	for (i=0; i<p.length; i++) {
	    var roll=this.rollattackdie(1)[0];
	    if (roll=="hit"&&p[i].type==ROCK) { 
		this.log("+1 %HIT% [collision]"); 
		this.resolvehit(1); 
		this.checkdead(); 
	    }
	    else if (roll=="critical") { 
		this.log("+1 %CRIT% [collision]"); 
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

	this.show();
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
	this.show();
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
	    var e=$("<button>").addClass("m-skip").addClass("wbutton").click(function() { resolve(null,n); });
	    $("#actiondial").append(e);
	    $("#actiondial").show();
	}.bind(this),"upgrade");
    },

    selectdamage: function() {
	var i,s=0,m,j;
	for (i=0; i<CRITICAL_DECK.length; i++) 
	    if (CRITICAL_DECK[i].version.indexOf(CURRENT_DECK)>-1)
		s+=CRITICAL_DECK[i].count;
	var r=this.rand(s);
	m=0;
	for (i=0; i<CRITICAL_DECK.length; i++) {
	    if (CRITICAL_DECK[i].version.indexOf(CURRENT_DECK)>-1){
		m+=CRITICAL_DECK[i].count;
		if (m>r) return i;
	    }
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
	if (OBSTACLES.length>0) {
	    for (k=0; k<OBSTACLES.length; k++) {
		var op=OBSTACLES[k].getOutlineString().p;
		// The object is not yet intialized. Should not be here...
		if (op.length==0) break;
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
	}
	if (k<OBSTACLES.length) obs=true;
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

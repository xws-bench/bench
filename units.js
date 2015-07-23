var s;
var GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0";
var HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880";
var TIMEANIM=1000;
var FACE=["focus","hit","critical","evade","blank"];
var ATTACKDICE= [0,0,1,1,1,2,4,4];
var DEFENSEDICE=[0,0,3,3,3,4,4,4];
var MPOS={ F0:[0,2],F1:[1,2],F2:[2,2],F3:[3,2],F4:[4,2],F5:[5,2],	
	   BL1:[1,1],BL2:[2,1],BL3:[3,1],
	   TL1:[1,0],TL2:[2,0],TL3:[3,0],
	   BR1:[1,3],BR2:[2,3],BR3:[3,3],
	   TR1:[1,4],TR2:[2,4],TR3:[3,4],
	   K1:[1,5],K2:[2,5],K3:[3,5],K4:[4,4],K5:[5,4],
	   SL3:[3,0],SR3:[3,4]
	 };
var generics=[];
var gid=0;
var UNIQUE=[[],[],[]];
var ATTACKREROLLA=[];
var DEFENSEREROLLD=[];
var ATTACKMODA=[];
var ATTACKMODD=[];
var DEFENSEMODD=[];
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
    "ogg/missile"
];
var SOUNDS={};
var SOUND_NAMES=["explode","xwing_fire","tie_fire","slave_fire","falcon_fire","xwing_fly","tie_fly","slave_fly","falcon_fly","yt2400_fly","ywing_fly","isd_fly","missile"];

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
    FOCUS:{key:"f",color:GREEN},
    TARGET:{key:"l",color:BLUE},
    EVADE:{key:"e",color:GREEN},
    BOOST:{key:"b",color:GREEN},
    STRESS:{key:"s",color:RED},
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
    NOTHING:{key:"&nbsp;",color:WHITE}
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
    this.ship.select+="<option disabled selected>Select unit</option>";
    for (var s in unitlist) {
	if (unitlist[s].faction.indexOf(this.faction)>=0) {
	    this.ship.select+="<option>"+s+"</option>"
	}
    } 
    this.ship.select+="</select>";
    this.shipactionList=[];
    this.dial=[];
    this.dialselect="<div id='dial"+id+"' class='table'></div>";
    this.pts="<div class='pts' id='pts"+id+"'></div>";
    this.text="<div id='text"+id+"' class='details'></div>";
    this.pilotselect="";//"<select onchange='generics[\"u"+id+"\"].selectpilot()' id='name"+id+"'></select>";
    this.name="";
    this.upgradesno=0;
    this.upgrades=[];
    this.removeupg=[];
    this.criticals=[];
    for (i=0; i<10; i++) this.removeupg[i]=Unit.prototype.defaultremoveupg;
    this.stats="<div id='stats"+id+"'></div>";
    this.actions="<div id='actions"+id+"'></div>";
    this.DEFENSEREROLLD=[];
    this.ATTACKREROLLA=[];
    this.ATTACKMODA=[];
    this.ATTACKADD=[];
    this.DEFENSEMODD=[];
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
	this.actiondone=false;
	this.reroll=0;
	this.focus=0;
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
	this.ocollision={overlap:-1,template:0};
	if (typeof this.init!="undefined") this.init();
	for (j in upgs) {
	    if (upgs[j]>-1) {
		Upgradefromname(this,UPGRADES[upgs[j]].name)
	    }
	}
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	if (!(this.islarge)) {
	    this.img=s.image("png/"+this.ship.img[0],-20*this.scale,-20*this.scale,40*this.scale,40*this.scale).transform('r 90 0 0');
//	    this.img=s.text(-10,10,this.ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction=="SCUM")?'r -1 1':'')).attr({
//		class:"xwingship",
//	    });
	    this.imgsmoke= s.image("png/smoke.gif",-20,-60,30,50).transform('r 180 0 0').attr({display:"none"});
	    this.imgflame=s.image("png/out.gif",-15,-40,20,40).transform('r 180 0 0').attr({display:"none"});
	} else {
	    this.img=s.image("png/"+this.ship.img[0],-50*this.scale,-50*this.scale,100*this.scale,100*this.scale).transform('r 90 0 0');
	    this.imgsmoke= s.image("png/smoke.gif",-20,-60,30,50).transform('r 180 0 0').attr({display:"none"});
	    this.imgflame=s.image("png/out.gif",-15,-40,20,40).transform('r 180 0 0').attr({display:"none"});
//	    this.img=s.text(0,0,this.ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction=="SCUM")?'s 2 -2':'s 2 2')+'t -15 5').attr({
//		class:"xwingship",
//	    });
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
	this.g.addClass("unit");
	this.g.hover(
	    function () { 
		var bbox=this.g.getBBox();
		var p=$("#playmat").position();
		var x=p.left+bbox.x*$("#playmat").width()/900;
		var y=p.top+(bbox.y-20)*$("#playmat").height()/900;
		$(".info").css({left:x,top:y}).html(this.name).appendTo("body").show();
	    }.bind(this),
	    function() { $(".info").hide(); 
		       }.bind(this));
	this.setdefaultclickhandler();

	this.upgrades.sort(function(a,b) { 
	    var pa=(a.isWeapon()?2:0)+(a.isBomb()?0:1); 
	    var pb=(b.isWeapon()?2:0)+(b.isBomb()?0:1);
	    return b-a;
	});
	this.g.drag(this.dragmove.bind(this),
		    this.dragstart.bind(this),
		    this.dragstop.bind(this));
    },
    defaultremoveupg: function(upgid,init) {
	var id=this.upg[upgid];
	$("#upgradetext"+this.id+"_"+upgid+" div").remove();
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
	for (var i=0; i<10; i++) {
	    if (this.upg[i]!=-1) {
		var upg=UPGRADES[this.upg[i]];
		var type=UPGRADE_TYPES[upg.type];
		if (typeof upgpt[type]=="undefined") upgpt[type]=[];
		upgpt[type].push(upg_lookup(upg.name));
	    }	
	}
	s.upgrades=upgpt;
	return s;
    },
    toASCII: function() {
	var s="";
	s+=Base64.fromNumber(this.pilotid);
	
	for (var i=1; i<this.upgrades.length; i++) {
	    for (var j=0; j<UPGRADES.length; j++) 
		if (UPGRADES[j].name==this.upgrades[i].name) break;
	    s+=","+Base64.fromNumber(j);
	}
	s+="%"+Base64.fromCoord([this.tx,this.ty,this.alpha]);
	return s;
    },
    toString2: function() {
	var i;
	var str="<div class='generic' id='unit"+this.id+"'>";
	str+="<div><div class='dial'>"+this.dialselect+"</div></div>";
	str+="<div><div>"+this.pts+"</div></div>";
	str+="<div><div class='name'>"+this.pilotselect+"</div></div>";
	str+="<div><div>"+this.ship.select+"</div></div>";
	str+="<div>"+this.stats+"</div>";
	str+="<div>"+this.actions+"</div>";
	var text=PILOT_translation.english[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof text=="undefined") text=""; 
	str+="<div>"+this.text+"</div>";
	str+="<div id='upgrade"+this.id+"'></div>";
	str+="</div>";
	str+="</div>";
	return str;
    },
    getagility: function() {
	return this.agility;
    },
    getdial: function() {
	if ((this.ionized>0&&!this.islarge) || this.ionized>1) return [{move:"F1",difficulty:"WHITE"}];
	return this.dial;
    },
    doplan: function() { this.showdial(); },
    candodial: function() {
	return (phase==PLANNING_PHASE||phase==SELECT_PHASE1||phase==SELECT_PHASE2);
    },
    showdial: function() {
	var m=[],i,j,d;
	var gd=this.getdial();
	if  (this.candodial()) {
	    for (i=0; i<=5; i++) {
		m[i]=[];
		for (j=0; j<=5; j++) m[i][j]="<div></div>";
	    }
	    var ship=$("#select"+this.id).val();
	    for (i=0; i<gd.length; i++) {
		d=gd[i];
		var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
		if (d.difficulty=="RED"&&this.stress>0) m[cx][cy]="<div></div>";
		else {
		    m[cx][cy]="<div";
		    if (phase>=PLANNING_PHASE) 
			m[cx][cy]+=" onclick='activeunit.setmaneuver("+i+")'";
		    m[cx][cy]+=" class='symbols "+d.difficulty;
		    if (this.maneuver==i) m[cx][cy]+=" selected";
		    m[cx][cy]+="' >"+P[d.move].key+"</div>";
		}
	    }
	    var str="";
	    for (i=5; i>=0; i--) {
		str+="<div>";
		if (i>0&&i<5) str+="<div>"+i+"</div>"; else str+="<div>&nbsp;</div>";
		for (j=0; j<=5; j++) str+=m[i][j];
		str+="</div>\n";
	    }
	    if (phase==SELECT_PHASE1||phase==SELECT_PHASE2) $("#dial"+this.id).html(str);
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
	$("#name"+this.id).append("<option disabled>Select pilot</option>");
	for (i=0; i<PILOTS.length; i++) {
	    if (PILOTS[i].unit==ship && PILOTS[i].faction==this.faction) {
		$("#name"+this.id).append("<option"+(selected==-1?" selected":"")+">"+PILOTS[i].name+" ("+PILOTS[i].points+")</option>");
		if (selected==-1&&PILOTS[i].unique!=true) selected=i;
	    }
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
	var u=unitlist[ship]
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
	this.dial=u.dial.slice(0);
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
		&& u.ship!=p.unit) continue;
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
		str+="<option value='"+j+"'>"+u.name+"</option>";
	    }
	}
	return str;
    },
    addupgradetype:function(type,upgid,bonus) {
	var str,head,bs=0;
	if (typeof bonus!="undefined") bs=bonus;
	head="<div id='upgradetext"+this.id+"_"+upgid+"' class='upgrade'>";
	head+="<span class='pts' id='pts"+this.id+"_"+upgid+"'></span>";
	head+="<a href='#' class='upgrades "+(type=="Cannon|Torpedo|Missile"?"CannonTorpedoMissile":type)+"'></a>"; /* type.replace(/|/g,'')*/
	head+="<select id='upgrade"+this.id+"_"+upgid+"' onchange='generics[\"u"+this.id+"\"].selectupgrade(\""+type+"\","+upgid+","+bs+")'>";
	head+="<option value='-1' selected>none</option>";
	str=this.initupgradelist(type,upgid);
	if (str!="") {
	    head+=str+"</select></div>";
	    $("#upgrade"+this.id).append(head);
	} else $("#upgrade"+this.id).append("<div id='upgradetext"+this.id+"_"+upgid+"'></div>");
    },
    showstats: function() {
	$("#stats"+this.id).html(
	    "<div class='PS'>"+this.skill+"</div>"
		+"<div class='statfire'>"+this.weapons[0].attack+"</div>"
		+"<div class='statevade'>"+this.getagility()+"</div>"
		+"<div class='statshield'>"+this.shield+"</div>"
		+"<div class='stathull'>"+this.hull+"</div>");
    },
    showactions:function() {
	var str="";
	for (var i=0; i<this.shipactionList.length; i++) {
	    str+="<code class='symbols'>"+A[this.shipactionList[i]].key+"</code>";
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

	if (this.unique) {
	    //log(this.name+" is a unique pilot");
	    var up=UNIQUE[this.team][this.name];
	    if (typeof up != "undefined") UNIQUE[this.team][this.name](this.name,true);
	    UNIQUE[this.team][this.name]=function(name,other) {
		if (other) {
		    log("Only one pilot "+name);
		    this.removepilot(true);
		    this.getpilotlist();
		    this.selectpilot();
		} else delete UNIQUE[this.team][name];
	    }.bind(this);
	}
 
	var up=PILOTS[this.pilotid].upg;
	var text=PILOT_translation.english[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof text=="undefined") text=""; 
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
	$("#pts"+this.id+"_"+upgid).html(pts);
	var u=UPGRADES[upgrade];
	$("#upgradetext"+this.id+"_"+upgid).prepend("<div class='dial details'>"+(u.attack?"<b class='statfire'>"+u.attack+"</b>["+u.range[0]+"-"+u.range[1]+"], ":"")+UPGRADE_translation.english[u.name+(type=="Crew"?"(Crew)":"")]+"</div>");

	/* Add action */
	var addedaction=UPGRADES[upgrade].addedaction;
	if (typeof addedaction!="undefined") {
	    var added=addedaction.toUpperCase();
	    this.shipactionList.push(added);
	    log("Added action:"+addedaction);
	    this.removeupg[upgid]=function(upgid,reset) {
		var upgrade=this.upg[upgid];
		var x=this.shipactionList.indexOf(UPGRADES[upgrade].addedaction.toUpperCase());
		if (x>-1) this.shipactionList.splice(x,1);
		this.defaultremoveupg(upgid,reset);
		this.removeupg[upgid]=this.defaultremoveupg;
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
    getdefensetable: function(n) { return DEFENSE[n]; },
    defenseroll: function(n) {
	var i,e,f;
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=Math.random();
	if (n==0) return 0;
	if (typeof P=="undefined") {
	    //console.log("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*10+e;
		ptot+=P[i];
		if (ptot>r) return 10*f+e;
	    }
	}
	return 0;
    },
    // org:origin, type: list of die type to reroll, n:number of
    // rerolls (function), req: prerequisite check
    addattackrerolla: function(org,t,n,f,global) {
	if (global) ATTACKREROLLA.push({org:org,type:t,n:n,req:f});
	else this.ATTACKREROLLA.push({org:org,type:t,n:n,req:f});
    },
    adddefensererolld: function(org,t,n,f,global) {
	if (global) DEFENSEREROLLD.push({org:org,type:t,n:n,req:f});
	else this.DEFENSEREROLLD.push({org:org,type:t,n:n,req:f});	
    },
    addattackmoda: function(org,require,f,global,str) {
	if (global) ATTACKMODA.push({org:org,req:require,f:f,str:str});
	else this.ATTACKMODA.push({org:org,req:require,f:f,str:str});
    },
    addattackmodd: function(org,require,f,str) {
	ATTACKMODD.push({org:org,req:require,f:f,str:str});
    },
    addattackadd: function(org,require,f,str) {
	this.ATTACKADD.push({org:org,req:require,f:f,str:str});
    },
    adddefensemodd: function(org,require,f,global,str) {
	if (global) DEFENSEMODD.push({org:org,req:require,f:f,str:str});
	else this.DEFENSEMODD.push({org:org,req:require,f:f,str:str});
    },
    setclickhandler: function(f) {
	this.g.unmousedown();
	this.g.mousedown(f);
    },
    setdefaultclickhandler: function() {
	this.g.unmousedown();
	this.g.mousedown(function() { 
	    if (this!=activeunit) {
		var old=activeunit;
		this.select();
		old.unselect();
	    }
	}.bind(this));
    },
    dragmove: function(dx,dy,x,y) {
	// scaling factor
	var ddx=dx*900./$("#playmat").width();
	var ddy=dy*900./$("#playmat").height();
	this.dragMatrix=MT(ddx,ddy).add(this.m);
	this.dx=ddx;
	this.dy=ddy;
	this.dragged=true;
	$(".phasepanel").hide();
	this.g.transform(this.dragMatrix);
	this.geffect.transform(this.dragMatrix);
    },
    dragstart:function(x,y,a) { this.showhitsector(false); this.dragged=false; },
    dragstop: function(a) { 
	if (this.dragged) { 
	    this.m=this.dragMatrix; this.showpanel();
	    this.tx+=this.dx; this.ty+=this.dy;
			  }
	this.dragged=false;
    },
    isinzone: function(m) {
	var o1=this.getOutlinePoints(m);
	for (var i=0; i<4; i++) 
	    if (o1[i].x<0||o1[i].x>900||o1[i].y<0||o1[i].y>900) return false;
	return true;
    },
    getOutlinePoints: function(m) {
	var w=(this.islarge)?40:20;
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
	var r=s.rect(-w,-w,2*w,2*w);
	var t = s.text(w+5,3-w,"8").attr({class:'symbols'});
	var g= s.group(r,t).transform(m).attr({display:'none'});
	return g;
    },
    getRangeString: function(n,m) {
	var w=(this.islarge)?40:20;
	var p1=transformPoint(m,{x:-w,y:-100*n-w});
	var p2=transformPoint(m,{x:w,y:-100*n-w});	
	var p3=transformPoint(m,{x:100*n+1+w,y:-w});
	var p4=transformPoint(m,{x:100*n+1+w,y:w});
	var p5=transformPoint(m,{x:w,y:100*n+1+w});
	var p6=transformPoint(m,{x:-w,y:100*n+1+w});
	var p7=transformPoint(m,{x:-100*n-w-1,y:w});
	var p8=transformPoint(m,{x:-100*n-w-1,y:-w});
	var p9=transformPoint(m,{x:50*n+w,y:-100*n-1-w});
	var p10=transformPoint(m,{x:100*n+1+w,y:-50*n-w});
	var p11=transformPoint(m,{x:100*n+1+w,y:50*n+w});	
	var p12=transformPoint(m,{x:50*n+w,y:100*n+1+w});
	var p13=transformPoint(m,{x:-50*n-w,y:100*n+1+w});
	var p14=transformPoint(m,{x:-100*n-1-w,y:50*n+w});
	var p15=transformPoint(m,{x:-100*n-1-w,y:-50*n-w});
	var p16=transformPoint(m,{x:-50*n-w,y:-100*n-1-w});
	return ("M "+p1.x+" "+p1.y+" L "+p2.x+" "+p2.y+" C "+p9.x+" "+p9.y+" "+p10.x+" "+p10.y+" "+p3.x+" "+p3.y+" L "+p4.x+" "+p4.y+" C "+p11.x+" "+p11.y+" "+" "+p12.x+" "+p12.y+" "+p5.x+" "+p5.y+" L "+p6.x+" "+p6.y+" C "+p13.x+" "+p13.y+" "+p14.x+" "+p14.y+" "+p7.x+" "+p7.y+" L "+p8.x+" "+p8.y+" C "+p15.x+" "+p15.y+" "+p16.x+" "+p16.y+" "+p1.x+" "+p1.y);
    },
    getSubRangeString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var p1=transformPoint(m,{x:-w,y:-100*n1-w});
	var p2=transformPoint(m,{x:w,y:-100*n1-w});	
	var p3=transformPoint(m,{x:100*n1+w,y:-w});
	var p4=transformPoint(m,{x:100*n1+w,y:w});
	var p5=transformPoint(m,{x:w,y:100*n1+w});
	var p6=transformPoint(m,{x:-w,y:100*n1+w});
	var p7=transformPoint(m,{x:-100*n1-w,y:w});
	var p8=transformPoint(m,{x:-100*n1-w,y:-w});
	var p9=transformPoint(m,{x:50*n1+w,y:-100*n1-w});
	var p10=transformPoint(m,{x:100*n1+w,y:-50*n1-w});
	var p11=transformPoint(m,{x:100*n1+w,y:50*n1+w});	
	var p12=transformPoint(m,{x:50*n1+w,y:100*n1+w});
	var p13=transformPoint(m,{x:-50*n1-w,y:100*n1+w});
	var p14=transformPoint(m,{x:-100*n1-w,y:50*n1+w});
	var p15=transformPoint(m,{x:-100*n1-w,y:-50*n1-w});
	var p16=transformPoint(m,{x:-50*n1-w,y:-100*n1-w});
	var str="M "+p1.x+" "+p1.y+" L "+p2.x+" "+p2.y+" C "+p9.x+" "+p9.y+" "+p10.x+" "+p10.y+" "+p3.x+" "+p3.y+" L "+p4.x+" "+p4.y+" C "+p11.x+" "+p11.y+" "+" "+p12.x+" "+p12.y+" "+p5.x+" "+p5.y+" L "+p6.x+" "+p6.y+" C "+p13.x+" "+p13.y+" "+p14.x+" "+p14.y+" "+p7.x+" "+p7.y+" L "+p8.x+" "+p8.y+" C "+p15.x+" "+p15.y+" "+p16.x+" "+p16.y+" "+p1.x+" "+p1.y;
	p1=transformPoint(m,{x:-w,y:-100*n2-w});
	p2=transformPoint(m,{x:w,y:-100*n2-w});	
	p3=transformPoint(m,{x:100*n2+w,y:-w});
	p4=transformPoint(m,{x:100*n2+w,y:w});
	p5=transformPoint(m,{x:w,y:100*n2+w});
	p6=transformPoint(m,{x:-w,y:100*n2+w});
	p7=transformPoint(m,{x:-100*n2-w,y:w});
	p8=transformPoint(m,{x:-100*n2-w,y:-w});
        p9=transformPoint(m,{x:50*n2+w,y:-100*n2-w});
	p10=transformPoint(m,{x:100*n2+w,y:-50*n2-w});
	p11=transformPoint(m,{x:100*n2+w,y:50*n2+w});	
	p12=transformPoint(m,{x:50*n2+w,y:100*n2+w});
	p13=transformPoint(m,{x:-50*n2-w,y:100*n2+w});
	p14=transformPoint(m,{x:-100*n2-w,y:50*n2+w});
	p15=transformPoint(m,{x:-100*n2-w,y:-50*n2-w});
	p16=transformPoint(m,{x:-50*n2-w,y:-100*n2-w});
	str+=" L "+p1.x+" "+p1.y+" C "+p16.x+" "+p16.y+" "+ p15.x+" "+p15.y+" "+p8.x+" "+p8.y+" L "+p7.x+" "+p7.y+" C "+p14.x+" "+p14.y+" "+p13.x+" "+p13.y+" "+p6.x+" "+p6.y+" L "+p5.x+" "+p5.y+" C "+p12.x+" "+p12.y+" "+p11.x+" "+p11.y+" "+p4.x+" "+p4.y+" L "+p3.x+" "+p3.y+" C "+p10.x+" "+p10.y+" "+p9.x+" "+p9.y+" "+p2.x+" "+p2.y+" L "+p1.x+" "+p1.y;
	return str;
    },
    getSectorString: function(n,m) {
	var w=(this.islarge)?40:20;
	var p0=this.getSectorPoints(n,new Snap.matrix()); // get fresh points
	var p=this.getSectorPoints(n,m);
	var o=transformPoint(m,{x:0,y:0});
	var p1=transformPoint(m,{x:p0[0].x+w/2*n,y:p0[0].y-w*n/2});
	var p2=transformPoint(m,{x:(p0[0].x+3*p0[1].x)/4,y:p0[1].y});
	var p3=transformPoint(m,{x:(3*p0[2].x+p0[3].x)/4,y:p0[2].y});
	var p4=transformPoint(m,{x:(p0[3].x-w/2*n),y:(p0[3].y-w/2*n)});
	return ("M "+o.x+" "+o.y+" L "+p[0].x+" "+p[0].y+" C "+p1.x+" "+p1.y+" "+p2.x+" "+p2.y+" "+p[1].x+" "+p[1].y+" L "+p[2].x+" "+p[2].y+" C "+p3.x+" "+p3.y+" "+p4.x+" "+p4.y+" "+p[3].x+" "+p[3].y+" Z");
    },
    getSubSectorString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var p0=this.getSectorPoints(n1,new Snap.matrix()); // get fresh points
	var p=this.getSectorPoints(n1,m);
	var p1=transformPoint(m,{x:p0[0].x+w/2*n1,y:p0[0].y-w*n1/2});
	var p2=transformPoint(m,{x:(p0[0].x+3*p0[1].x)/4,y:p0[1].y});
	var p3=transformPoint(m,{x:(3*p0[2].x+p0[3].x)/4,y:p0[2].y});
	var p4=transformPoint(m,{x:(p0[3].x-w/2*n1),y:(p0[3].y-w/2*n1)});
	var str="M "+p[0].x+" "+p[0].y+" C "+p1.x+" "+p1.y+" "+p2.x+" "+p2.y+" "+p[1].x+" "+p[1].y+" L "+p[2].x+" "+p[2].y+" C "+p3.x+" "+p3.y+" "+p4.x+" "+p4.y+" "+p[3].x+" "+p[3].y;
	p0=this.getSectorPoints(n2,new Snap.matrix()); // get fresh points
	p=this.getSectorPoints(n2,m);
	p1=transformPoint(m,{x:p0[0].x+w/2*n2,y:p0[0].y-w*n2/2});
	p2=transformPoint(m,{x:(p0[0].x+3*p0[1].x)/4,y:p0[1].y});
	p3=transformPoint(m,{x:(3*p0[2].x+p0[3].x)/4,y:p0[2].y});
	p4=transformPoint(m,{x:(p0[3].x-w/2*n2),y:(p0[3].y-w/2*n2)});
	str+="L "+p[3].x+" "+p[3].y+" C "+p4.x+" "+p4.y+" "+p3.x+" "+p3.y+" "+p[2].x+" "+p[2].y+" L "+p[1].x+" "+p[1].y+" C "+p2.x+" "+p2.y+" "+p1.x+" "+p1.y+" "+p[0].x+" "+p[0].y+" Z";
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
	if (this.getdial()[i].difficulty=="RED"&&this.stress>0) return;
	this.maneuver=i;
	record(this.id,"this.maneuver="+i);
	enablenextphase();
	this.showdial();
	this.showmaneuver();
	nextstep();
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
	if (waitingforaction.isexecuting) return;
	activeunit=this;
	$("#"+this.id).addClass("selected");
	this.show();
        center(this);
    },
    unselect: function() {
	if (this==activeunit) return;
	$("#"+this.id).removeClass("selected");
	this.showoutline();
	this.showmaneuver();
	//if (phase==SETUP_PHASE&&typeof this.g!="undefined") { this.g.undrag(); }
    },
    getocollisions: function(mbegin,mend,path,len) {
	var k,i,j;
	var pathpts=[];
	var collision={overlap:-1,template:0};
	// Overlapping obstacle ? 
	var os=this.getOutlineString(mend);
	for (k=0; k<OBSTACLES.length; k++){
	    if (Snap.path.intersection(OBSTACLES[k].path,os.s).length>0 
		||this.isPointInside(OBSTACLES[k].path,os.p)
		||this.isPointInside(os.s,OBSTACLES[k].getOutlinePoints())) {
		collision.overlap=k; 
		break;
	    }
	}
	// Template overlaps ? 
	for (i=0; i<=len; i++) {
	    var p=path.getPointAtLength(i);
	    pathpts.push({x:mbegin.x(p.x,p.y),y:mbegin.y(p.x,p.y)});
	}
	var percuted=[];
	for (j=0; j<pathpts.length; j++) {
	    for (k=0; k<OBSTACLES.length; k++) {
		if (k!=collision.overlap&&percuted.indexOf(k)==-1) { // Do not count overlapped obstacle twice
		    var o2=OBSTACLES[k].getOutlinePoints();
		    for(i=0; i<o2.length; i++) {
			var dx=(o2[i].x-pathpts[j].x);
			var dy=(o2[i].y-pathpts[j].y);
			if (dx*dx+dy*dy<=100) {  percuted.push(k); collision.template++; break } 
		    }
		}
	    }
	}	   
	return collision;
    },
    iscollidingunit: function(m,sh) {
	var o1=this.getOutlineString(m);
	var o2=sh.getOutlineString(sh.m); 
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
	m=this.getmatrixwithmove(m, path, len);
	if (maneuver.match(/K\d|SR\d|SL\d/))
	    m.rotate(180,0,0);
	path.remove();
	return m;
    },
    getpossibleoutline: function(m) {
	var os1=this.getOutlineString(m).s;
	var o1=this.getOutline(m);
	var possible=true;
	var i;
	if (!this.isinzone(m)) return {ol:o1,b:false};
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if (sh!=this&&Snap.path.intersection(os1, sh.getOutlineString(sh.m).s).length>0) {
		possible=false;
		break; 
	    }
	}
	if (possible) {
	    for (i=0; i<OBSTACLES.length; i++) {
		if (this.isPointInside(os1,OBSTACLES[i].getOutlinePoints())) {
		    possible=false;
		    break; 
		}
	    } 
	}
	return {ol:o1,b:possible};
    },
    isTurret: function(w) {
	return (w.type=="Turretlaser");
    },
    getshipactionlist: function() {
	var i,al=[];
	for (i=0; i<this.shipactionList.length; i++) {
	    var a=this.shipactionList[i];
	    if (this.actionsdone.indexOf(a)==-1) al.push(a);
	}
	return al;
    },
    getupgactionlist: function() {
	var i,al=[];
	for (i=0; i<this.upgrades.length; i++) {
	    var upg=this.upgrades[i];
	    if (upg.isactive&&typeof upg.action=="function"&&upg.candoaction()) al.push(upg.type.toUpperCase());
	}
	return al;
    },
    getcritactionlist: function() {
	var i,al=[];
	for (i=0; i<this.criticals.length; i++) {
	    var crit=this.criticals[i];
	    if (crit.isactive&&typeof crit.action=="function") al.push("CRITICAL");
	}
	return al;
    },
    updateactionlist: function() {
	var i;
	var sal=this.getshipactionlist();
	var ual=this.getupgactionlist();
	var cal=this.getcritactionlist();
	this.actionList=[];
	for (i=0; i<sal.length; i++) this.actionList.push(sal[i]);
	for (i=0; i<ual.length; i++) this.actionList.push(ual[i]);
	for (i=0; i<cal.length; i++) this.actionList.push(cal[i]);
    },
    addevadetoken: function() {
	this.evade++;
	this.show();
	record(this.id,"TE");
    },
    addevade: function() { 
	this.addevadetoken(); 
	this.endaction();
	return true;
    },
    addfocustoken: function() {
	this.focus++;
	this.show();
	record(this.id,"TF");
    },
    addfocus: function() { 
	this.addfocustoken(); 
	this.endaction();
	return true;
    },
    addstress: function() {
	this.stress++;
	record(this.id,"TS");
	this.show();
    },
    addiontoken: function() {
	this.ionized++;
	record(this.id,"TI");
	this.show();
    },
    removeiontoken: function() {
	this.ionized--;
	record(this.id,"RI");
	this.show();
   },
    dies: function() {
	var i;
	record(this.i,"D");
	$("#"+this.id).attr("onclick","");
	$("#"+this.id).addClass("dead");
	$("#"+this.id).html(""+this)
	for (i=0; i<squadron.length; i++) {
	    if (squadron[i]==this) {
		squadron.splice(i,1); break;
	    }
	}
	for (i=0; i<this.targeting.length; i++) {
	    var t=this.targeting[i];
	    n=t.istargeted.indexOf(this);
	    if (n>-1) t.istargeted.splice(n,1);
	    t.show();
	}
	this.targeting=[];

	this.dead=true;
	this.m=MT(-60,-60);
	this.log("has exploded !");
	this.show();
	if (TEAMS[this.team].checkdead()) win();	
	SOUNDS.explode.play();
    },
    canbedestroyed: function() {
	if (skillturn!=this.skill) return true;
	return false;
    },
    checkdead: function() {
	if (this.hull<=0||!this.isinzone(this.m)) {
	    this.dies();
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
	this.log("attacks "+target.name+" with "+this.weapons[w].name);
	target.isattackedby(w,this);
    },
    isattackedby:function(k,a) {},
    modifydamageassigned: function(ch,attacker) {
	return ch;
    },
    ishit: function(c,h) {
    },
    resolvedamage: function() {
	this.fireline.remove();
	this.playfiresnd();
	var ch=targetunit.evadeattack(this);
	ch=this.weapons[this.activeweapon].modifydamageassigned(ch,targetunit);
	ch=targetunit.modifydamageassigned(ch,this);
	var c=Math.floor(ch/10);
	var h=ch-c*10;;
	this.hasdamaged=true;
	if (c+h>0) {
	    if (c+h<targetunit.shield) targetunit.log("lost "+(c+h)+" <p class='cshield'></p>");
	    else if (targetunit.shield>0) targetunit.log("lost all <p class='cshield'></p>")
	    targetunit.ishit(this);
	    this.hitresolved+=h;
	    this.criticalresolved+=c;
	    targetunit.resolvehit(h);
	    targetunit.resolvecritical(c);
	} 
	targetunit.endbeingattacked(c,h);
	this.weapons[this.activeweapon].endattack(c,h);
	this.endattack(c,h);
	if (targetunit.canbedestroyed(skillturn)) targetunit.checkdead();
	this.cleanupattack();
    },
    cleanupattack: function() {
	this.incombat=false;
	//log("calling nextstep from cleanup");
	//console.log("cleanupattack "+this.name+">nextstep()");
	nextstep();
	//console.log("cleanupattack "+this.name+"<nextstep()");
    },
    endround: function() {
	this.focus=this.evade=0;
	this.ocollision.overlap=-1;
	this.ocollision.template=0;
	this.collision=false;
	this.touching=[];
	this.showinfo();
    },
    playfiresnd: function() {
	var bb=targetunit.g.getBBox();
	var start=transformPoint(this.m,{x:0,y:-(this.islarge?40:20)});
	var p=s.path("M "+start.x+" "+start.y+" L "+(bb.x+bb.w/2)+" "+(bb.y+bb.h/2)).attr({stroke:this.color,strokeWidth:2});
	var process=setInterval(function() { p.remove(); clearInterval(process);
	},200);
	if (typeof this.weapons[this.activeweapon].firesnd!="undefined") 
	    SOUNDS[this.weapons[this.activeweapon].firesnd].play();
	else SOUNDS[this.ship.firesnd].play();		
	record(this.id,"playfiresnd()");
    },
    endattack: function(c,h) {
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	this.show();
    },
    endbeingattacked: function(c,h) {
	this.show();
	this.activeweapon=-1;
    },
    isPointInside:function(path,op) {
	var i;
	for (i=0; i<op.length; i++) 
	    if (Snap.path.isPointInside(path,op[i].x,op[i].y)) return true;
	return false;
    },
    showpossiblepositions:function() {
	this.evaluatepositions(true,true);
	var gd=this.getdial();
	var o=[];
	for (i=0; i<gd.length; i++) {
	    mm = this.getpathmatrix(this.m,gd[i].move);
	    o[i]=this.getOutline(mm).attr({title:gd[i].move,opacity:0.4,fill:halftone(gd[i].color),display:"block",class:'possible'});
	    (function(i) {o[i].hover(function() { o[i].attr({stroke:gd[i].color,strokeWidth:4})}.bind(this),
				     function() { o[i].attr({strokeWidth:0})}.bind(this)); }.bind(this))(i);
	}
    },
    evaluatepositions: function(withcollisions,withobstacles) {
	var gd=this.getdial();
	var i,j,k,os=[],op=[],s1=[],sp1=[];
	for (k=0; k<squadron.length; k++) {
	    var u=squadron[k];
	    if (u==this) continue;
	    var su=u.getOutlineString(u.m);
	    s1[k]=su.s;
	    sp1[k]=su.p;
	}
	for (i=0; i<gd.length; i++) {
	    if (gd[i].difficulty=="RED"&&this.stress>0) {
		gd[i].color=RED; continue; 
	    }
	    mm = this.getpathmatrix(this.m,gd[i].move);
	    gd[i].color=GREEN;
	    //if (gd[i].move.match(/K\d|SL\d|SR\d/)) mm=mm.rotate(180,0,0);
	    if (!this.isinzone(mm)) {
		gd[i].color=RED;
		continue;
	    }
	    if (withobstacles) {
		var so=this.getOutlineString(mm);
		os[i]=so.s;
		op[i]=so.p;
		for (k=0; k<OBSTACLES.length; k++){
		    if (Snap.path.intersection(OBSTACLES[k].path,os[i]).length>0 
			||this.isPointInside(OBSTACLES[k].path,op[i])
			||this.isPointInside(os[i],OBSTACLES[k].getOutlinePoints())) {
			gd[i].color=YELLOW;
			break;
		    }
		}
	    }
	    if (gd[i].color!=YELLOW&&withcollisions) {
		for (k=0; k<squadron.length; k++) {
		    var u=squadron[k];
		    if (u==this) continue;
		    if (Snap.path.intersection(s1[k],os[i]).length>0
			||((this.islarge&&!u.islarge&&this.isPointInside(os[i],sp1[k])))
			||((!this.islarge&&u.islarge)&&this.isPointInside(s1[k],op[i]))) {
			gd[i].color=WHITE;
			break;
		    }
		}
	    }
	}
    },
    usecloak: function(id) {
	if ((!waitingforaction.isexecuting)&&(phase==ACTIVATION_PHASE)&&!this.hasmoved) {
	    this.resolvedecloak();
	}
    },
    usestress: function(id) {
    },
    usefocusattack: function(id) {
	this.removefocustoken();
	this.show();
	var l=$(".focusreddice").length;
	$(".focusreddice").remove();
	for (i=0; i<l; i++) { 	
	    $("#attack").prepend("<td class='hitreddice'></td>");
	}
	$("#atokens > .xfocustoken").remove();
    },
    usefocus:function(id) {
	if (phase==COMBAT_PHASE) {
	    if (this==activeunit) {
		this.usefocusattack(id);
	    } else if (this==targetunit) {
		targetunit.removefocustoken();
		targetunit.show();
		var l=$(".focusgreendice").length;
		$(".focusgreendice").remove();
		$("#dtokens > .xfocustoken").remove()
		for (i=0; i<l; i++) { 	
		    $("#defense").prepend("<td class='evadegreendice'></td>");
		}
	    }
	}
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
    removeevadetoken: function() { record(this.id,"RE");this.evade--; this.show();},
    removefocustoken: function() { record(this.id,"RF"); this.focus--; this.show();},
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    for (i=0; i<this.pos.length; i++) this.pos[i].ol.remove();
	    if (automove) {
		this.m=m;
	    }
	    f(this,k);
	    this.show();
	}.bind(this);
	for (i=0; i<moves.length; i++) {
	    var p=this.getpossibleoutline(moves[i]);
	    if (possible||p.b) {
		p.ol.attr({display:"block",opacity:0.4,fill:halftone(this.color)});
		this.pos.push({ol:p.ol,k:i});
	    } //else p.ol.remove();
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
	var ready=false;
	var resolve=function(k) {
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
    resolveboost: function() {
	waitingforaction.add(function() {
	this.resolveactionmove(
	    [this.getpathmatrix(this.m,"F1"),
	     this.getpathmatrix(this.m,"BL1"),
	     this.getpathmatrix(this.m,"BR1")],
	    function (t,k) { t.endaction(); },true);
	}.bind(this));
	this.endaction();
	return true;
    },
    resolvedecloak: function() {
	var m0=this.getpathmatrix(this.m.clone().rotate(90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(this.m.clone().rotate(-90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	var m2=this.getpathmatrix(this.m,"F2");
	waitingforaction.add(function() {
	this.resolveactionmove(
	    [m0.clone().translate(0,-20),
	     m0,
	     m0.clone().translate(0,20),
	     m2,
	     m1.clone().translate(0,-20),
	     m1,
	     m1.clone().translate(0,20)],
	    function (t,k) {
		t.agility-=2; t.iscloaked=false;
		SOUNDS.decloak.play();
	    },true);
	}.bind(this));
	nextstep();
	return true;
    },
    resolveroll: function() {
	waitingforaction.add(function() {
	    var m0=this.getpathmatrix(this.m.clone().rotate(90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	    var m1=this.getpathmatrix(this.m.clone().rotate(-90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	    this.resolveactionmove(
		[m0.clone().translate(0,-20),
		 m0,
		 m0.clone().translate(0,20),
		 m1.clone().translate(0,-20),
		 m1,
		 m1.clone().translate(0,20)],
		function(t,k) {	t.endaction();
},true);
	}.bind(this));
	this.endaction();
	return true;
    },
    addtarget: function(sh) {
	var i;
	for (i=0; i<this.targeting.length; i++) 
	    if (this.targeting[i]==sh) return;
	for (i=0; i<this.targeting.length; i++) this.removetarget(this.targeting[i]);
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
    resolvetarget: function() {
	var i; var p;
	p=this.gettargetableunits(3);
	if (p.length>0) {
	    //log("ADD ACTION");
	    //log("<b>["+this.name+"] select target to lock</b>");
	    waitingforaction.add(function() {
		this.resolveactionselection(p,function(k) { 
		    if (k>=0) this.addtarget(p[k]);
		    this.endaction();
		}.bind(this));
	    }.bind(this));
	    this.endaction();
	    return true;
	}
	return false; 
    },
    resolvecloak: function() {
	this.iscloaked=true;
	this.agility+=2;
	SOUNDS.cloak.play();
	this.endaction();
	return true;
    },
    endaction: function() {
	this.actiondone=true; this.action=-1;
	//console.log("endaction "+this.name+">nextstep");
	nextstep();
	//console.log("endaction "+this.name+"<nextstep");
	return true;
    },
    resolveaction: function() {
	var a;
	$("#actiondial").empty();
	if (this.action==-1) a="NOTHING";
	else {
	    a = this.actionList[this.action];
	    this.actionsdone.push(a);
	}
	if (a=="BOOST") { return this.resolveboost(); }
	else if (a=="ROLL") {return this.resolveroll(); }
	else if (a=="CLOAK") { return this.resolvecloak();}
	else if (a=="FOCUS") { return this.addfocus(); }
	else if (a=="EVADE")  { return this.addevade(); }
	else if (a=="TARGET") { return this.resolvetarget(); }
	else {
	    var i,n=this.getshipactionlist().length;
	    for (i=0; i<this.upgrades.length; i++) {
		var upg=this.upgrades[i];
		if (typeof upg.action=="function"&&upg.isactive) {
		    if (upg.type.toUpperCase()==a
			&&this.action==n)  return upg.action(); 
		    n++;
		}
	    }
	    for (i=0; i<this.criticals.length; i++) {
		var crit=this.criticals[i];
		if (typeof crit.action=="function"&&crit.isactive) {
		    if (this.action==n)  return crit.action(); 
		    n++;
		}
	    }
	    /* NOTHING */
	}
	this.endaction();
	return true;
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
        var r=this.gethitrangeallunits();
	var b= (this.hasfired==0)&&((r[1].length>0||r[2].length>0||r[3].length>0)&&!this.iscloaked&&!this.isfireobstructed());
	//log("[canfire]"+this.name+" "+b+"="+this.hasfired+"& r=["+r[1].length+", "+r[2].length+", "+r[3].length+"] &"+this.iscloaked+" &"+this.ocollision.overlap)
        return b;
    },
    getattackstrength: function(i,sh) {
	var att=this.weapons[i].getattack();
	return att+this.weapons[i].getattackbonus(sh);
    },
    getobstructiondef: function(sh) {
	return this.getoutlinerange(this.m,sh).o?1:0;
    },
    getdefensestrength: function(i,sh) {
	var def=this.getagility();
	var obstacledef=sh.getobstructiondef(this);
	if (obstacledef>0) this.log("+"+obstacledef+" defense for obstacle");
	return def+sh.weapons[i].getdefensebonus(this)+obstacledef;
    },
    getattackmodtokens: function(m,n) {
	var str="";
	var i,j;
	for (me=0; me<squadron.length; me++) if (squadron[me]==this) break;
	for (i=0; i<ATTACKMODA.length; i++) {
	    var a=ATTACKMODA[i];
	    if (a.req(m,n)) {
		str+="<td id='moda"+i+"' class='"+a.str+"modtokena' onclick='modroll(ATTACKMODA["+i+"].f,"+n+","+i+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	for (i=0; i<ATTACKMODD.length; i++) {
	    var a=ATTACKMODD[i];
	    if (a.req(m,n)) {
		//log("adding attackmodd");
		str+="<td id='moda"+(i+ATTACKMODA.length)+"' class='"+a.str+"modtokend' onclick='modroll(ATTACKMODD["+i+"].f,"+n+","+(i+ATTACKMODA.length)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length+ATTACKMODD.length;
	for (j=0; j<this.ATTACKMODA.length; j++) {
	    var a=this.ATTACKMODA[j];
	    if (a.req(m,n)) {
		str+="<td id='moda"+(i+j)+"' class='"+a.str+"modtokena' onclick='modroll(squadron["+me+"].ATTACKMODA["+j+"].f,"+n+","+(i+j)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	for (j=0; j<this.ATTACKADD.length; j++) {
	    var a=this.ATTACKADD[j];
	    if (a.req(m,n)) {
		str+="<td id='moda"+(j+i+this.ATTACKMODA.length)+"' class='"+a.str+"modtokena' onclick='addroll(squadron["+me+"].ATTACKADD["+j+"].f,"+n+","+(i+j+this.ATTACKMODA.length)+")' title='add roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
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
		str+="<td id='modd"+i+"' class='"+a.str+"modtokend' onclick='modrolld(DEFENSEMODD["+i+"].f,"+n+","+i+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	for (j=0; j<this.DEFENSEMODD.length; j++) {
	    var a=this.DEFENSEMODD[j];
	    if (a.req(m,n)) {
		str+="<td id='modd"+(i+j)+"' class='"+a.str+"modtokend' onclick='modrolld(squadron["+me+"].DEFENSEMODD["+j+"].f,"+n+","+(i+j)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	//if (this.DEFENSEMODD.length>0) log("DEFENSEMODD "+this.DEFENSEMODD.length+" req ?"+this.DEFENSEMODD[0].req(m,n));
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
	    return "<td id='rerolld"+i+"' class='tokens' onclick='reroll("+n+",false,"+s+","+i+")' title='"+n+" rerolls ["+a.org.name.replace(/\'/g,"&#39;")+"]'>R"+n+"</td>";
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
	var attack=this.getattackstrength(w,targetunit);
	var defense=targetunit.getdefensestrength(w,this);
	this.hasfired++;
	this.hasdamaged=false;
	$("#combatdial").show();
	var bb=targetunit.g.getBBox();
	var start=transformPoint(this.m,{x:0,y:-(this.islarge?40:20)});
	this.fireline=s.path("M "+start.x+" "+start.y+" L "+(bb.x+bb.w/2)+" "+(bb.y+bb.h/2))
	    .attr({stroke:this.color,
		   strokeWidth:2,
		   strokeDasharray:100,
		   "class":"animated"});
	//console.log("resolveattack:"+this.name+" "+attack+"/"+defense);
	this.select();	targetunit.unselect(); 
	for (i=0; i<squadron.length; i++) if (squadron[i]==this) break;
	this.doattackroll(this.attackroll(attack),attack,defense,i);
	//this.show();
    },
    doattack: function(forced) {
	this.showattack(forced);
    },
    doattackroll: function(ar,da,defense,me) {
	var i,j;
	$("#attackdial").empty();
	$("#dtokens").empty();
	$("#defense").empty();
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	var f=Math.floor(ar/100);
	for (i=0; i<f; i++) $("#attack").prepend("<td class='focusreddice'></td>");
	var c=Math.floor(ar/10)%10;
	for (i=0; i<c; i++) $("#attack").prepend("<td class='criticalreddice'></td>");
	var h=ar%10;
	for (i=0; i<h; i++) $("#attack").prepend("<td class='hitreddice'></td>");
	for (i=0; i<da-h-c-f; i++) $("#attack").prepend("<td class='blankreddice'></td>");
	$("#atokens").html(this.getusabletokens(me,true)+this.getattackrerolltokens()+this.getattackmodtokens(ar,da));
	$("#atokens").append("<button onclick='$(\"#atokens\").empty();targetunit.dodefenseroll(targetunit.defenseroll("+defense+")"+","+defense+","+me+")'>Done</button>");
	//console.log("showattackroll:"+this.name);
	//log("attack roll: f"+f+" c"+c+" h"+h+" b"+(da-h-c-f));
    },
    dodefenseroll: function(dr,dd,me) {
	var i,j;
	var f=Math.floor(dr/10);
	for (i=0; i<f; i++) $("#defense").prepend("<td class='focusgreendice'></td>");
	var e=dr%10;
	for (i=0; i<e; i++) $("#defense").prepend("<td class='evadegreendice'></td>");
	for (i=0; i<dd-e-f; i++) $("#defense").prepend("<td class='blankgreendice'></td>");
	for (j=0; j<squadron.length; j++) if (squadron[j]==this) break;
	$("#dtokens").html(this.getusabletokens(j,true)+this.getdefensererolltokens()+this.getdefensemodtokens(dr,dd));
	$("#dtokens").append("<button onclick='$(\"#combatdial\").hide();squadron["+me+"].resolvedamage()'>Fire!</button>");
	//log("defense roll: f"+f+" e"+e+" b"+(dd-e-f));
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
	record(this.id,"RS");
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
	    this.maneuver=-1;
	    this.hasmoved=true;
	    this.handledifficulty(difficulty);
	    this.show();
	    this.endmaneuver();
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
	    this.log("collides with "+c[0].name+": no action");
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
	
   
	this.m=m;
	this.ocollision=this.getocollisions(oldm,this.m,path,lenC);
	if (this.isfireobstructed()) { this.log("overlaps obstacle: no action, cannot attack"); }
	if (this.ocollision.template>0) { this.log("template overlaps obstacle: no action"); }

	// Animate movement
	if (lenC>0) {
	    SOUNDS[this.ship.flysnd].play();
	    Snap.animate(0, lenC, function( value ) {
		m = this.getmatrixwithmove(oldm,path,value);
		this.g.transform(m);
		this.geffect.transform(m);
	    }.bind(this), TIMEANIM*lenC/200,mina.linear, function(){
		if (!this.collision) { 
		    // Special handling of K turns: half turn at end of movement. Straight line if collision.
		    if (dial.match(/K\d|SR\d|SL\d/)) {
			this.m.rotate(180,0,0);
			record(this.id,"M"+realdial+":"+lenC+":R");
		    } else {
			record(this.id,"M"+realdial+":"+lenC);
		    }
		} 
		else { 
		    record(this.id,"M"+realdial+":"+lenC);
		}
		this.handledifficulty(difficulty);
		this.maneuver=-1;
		this.show();
		path.remove();
		if (this.ocollision.overlap>-1||this.ocollision.template>0) this.resolveocollision();
		if (this.collision) this.resolvecollision();
		this.endmaneuver();
	    }.bind(this));
	} else { 
	    this.log("cannot move");
	    this.handledifficulty(difficulty);
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
	if (this.maneuver<0||this.hasmoved) return;
	this.hasmoved=true;
	var dial=this.getdial()[this.maneuver].move;
	var difficulty=this.getdial()[this.maneuver].difficulty;
	// Move = forward 0. No movement. 
	this.completemaneuver(dial,dial,difficulty);
    },
    endmaneuver: function() {
	this.ionized=0;
	this.hasmoved=true;
	if (this.checkdead()) { this.hull=0; this.shield=0; nextstep(); } 
	else if (this.timeforaction()) {
	    if (this.candoaction()) this.doaction(); else {
		this.action=-1; this.actiondone=true;
		//console.log("endmaneuver endaction"+this.name+">nextstep");
		nextstep();
		//console.log("endmaneuver endaction"+this.name+"<>nextstep");
		nextstep();
		//console.log("endmaneuver endaction"+this.name+"<nextstep");
	    }
	} else { 
		//console.log("endmaneuver noaction"+this.name+">nextstep");
		nextstep();
		//console.log("endmaneuver noaction"+this.name+"<>nextstep");
		nextstep();
		//console.log("endmaneuver noaction"+this.name+"<nextstep");
	}
	this.showstats();
    },
    doaction: function() {
	this.showaction();
    },
    candoaction: function() {
	if (this.stress>0||this.collision||this.ocollision.template>0||this.ocollision.overlap>-1) return false;
	return  true;
    },
    candecloak: function() {
	return (!this.hasmoved&&this.iscloaked&&phase==ACTIVATION_PHASE);
    },
    selecttargetforattack: function(wp) {
	var grau=this.weapons[wp].getrangeallunits();
	var i;
	var p=[];
	//console.log("selecttargetforattack:"+this.name+":")
	for (i=0; i<grau.length; i++) {
	    //console.log("    "+grau[i].name+":"+this.getrange(grau[i])+" teams:"+grau[i].team+" "+this.team);
	    if (grau[i].team!=this.team) p.push(grau[i]);
	}
	if (p.length==0) {
	    this.log("no target for "+this.weapons[wp].name);
	    this.cleanupattack();
	    return false;
	}
	this.resolveactionselection(p,function(k) { 
	    if (k>=0) {
		this.declareattack(wp,p[k]); 
		this.incombat=true;
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
	if (forced==true || (phase==COMBAT_PHASE&&(!waitingforaction.isexecuting)&&skillturn==this.skill&&this.canfire())) {
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
		str+="<div class='symbols "+w.color+"' onclick='activeunit.selecttargetforattack("+wn[i]+")'>"+w.key+"</div>"
	    }
	    str+="<button onclick='activeunit.hasfired++;activeunit.show();nextstep()'>Skip</button>"
	    $("#attackdial").html("<div>"+str+"</div>").show();
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
	return (this.lastdrop!=round&&!this.hasmoved&&this.skill==skillturn&&phase==ACTIVATION_PHASE);
    },
    addactivationdial: function(pred,action,html,elt) {
	this.activationdial.push({pred:pred,action:action,html:html,elt:elt});
    },
    updateactivationdial: function() {
	this.activationdial=[];
	this.addactivationdial(function() { return this.candecloak(); }.bind(this),
			       function() {this.usecloak(); }.bind(this),
			       A["CLOAK"].key,
			       $("<div>").attr({class:"symbols"}));
	if (this.candropbomb()) 
	    for (var i=0; i<this.bombs.length; i++) {
		var bomb=this.bombs[i];
		this.addactivationdial(function() {return this.isactive; }.bind(bomb),
		    function() {
			this.unit.lastdrop=round;
			$(".bombs").remove(); 
			this.drop(this.getbomblocation());
			this.unit.showactivation();
		    }.bind(bomb),
		    A["BOMB"].key,
		    $("<div>").attr({class:"symbols"}));
	    }
	return this.activationdial;
    },
    doactivation: function() { this.showactivation(); },
    showactivation: function() {
	var ad=this.updateactivationdial();
	$("#activationdial").html("<div></div>");
	for (var i=0; i<ad.length; i++) {
	    var adi=ad[i];
	    if (adi.pred()) 
		adi.elt.appendTo("#activationdial > div").click(adi.action).html(adi.html);
	}
	if (this.timeformaneuver()) 
	    $("<button>").html("Move").click(function() {this.resolvemaneuver(); }.bind(this)).appendTo("#activationdial > div");

    },
    addaction: function(org,timeforaction,action) {
	var sa=this.showaction
	var tfa=this.timeforaction;
	this.resolveoneaction=function() {
	    action();
	    this.endoneaction();
	};
	this.endoneaction=function() {
	    this.showaction=sa;
	    this.timeforaction=tfa;
	    this.show();
	};
	this.timeforaction=timeforaction;
	this.showaction=function() {
	    $("#actiondial").empty();
	    for (me=0; me<squadron.length; me++) if (squadron[me]==this) break;
	    var a = org.type.toUpperCase();
	    var str="<div class='symbols' onclick='squadron["+me+"].resolveoneaction()'>"+A[a].key+"</div>";
	    str+="<button onclick='squadron["+me+"].endoneaction()'>Skip</button>";
	    $("#actiondial").html("<div>"+str+"</div>").show();
	};
	this.showaction();
    },
    log: function(str) {
	log("<div><span style='color:"+this.color+"'>["+this.name+"]</span> "+str+"</div>");
    },
    freeaction: function(endfree) {
	this.tfa=this.timeforaction;
	this.ea=this.endaction;
	this.timeforaction=function() { return true; }
	this.endaction=function() {
	    this.endaction=this.ea; 
	    this.timeforaction=this.tfa;
	    this.show();
	    endfree();
	    return false;
	};
	this.showaction();
    },
    showaction: function() {
	var str="";
	var name,me;
	$("#actiondial").empty();
	//if (waitingforaction.isexecuting) return;
	this.updateactionlist();
	for (me=0; me<squadron.length; me++) if (squadron[me]==this) break;
	if (this.candoaction()) {
	    var i;
	    for (i=0; i<this.actionList.length; i++) {
		var a = this.actionList[i];
		if (a=="TARGET"&&!this.candotarget()) continue;
		if (a=="FOCUS"&&!this.candofocus()) continue;
		if (a=="EVADE"&&!this.candoevade()) continue;
		str+="<div class='symbols' onclick='activeunit.action="+i+";squadron["+me+"].resolveaction()'>"+A[a].key+"</div>";
	    }
	}
	if (str!="") {
	    str+="<button onclick='activeunit.action=-1;squadron["+me+"].resolveaction()'>Skip</button>";
	    $("#actiondial").html("<div>"+str+"</div>").show();
	} else { this.action=-1; this.resolveaction(); }
	if (this.action<this.actionList.length && this.action>-1) {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});
	if (str!="") return true; else return false;
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
    endcombatphase:function() {
	this.hasfired=0;
    },
//?28;36;&56;#
    beginplanningphase: function() {
    },
    beginactivationphase: function() {
	this.showmaneuver();
    },
    timetoshowmaneuver: function() {
	return this.maneuver>-1;
    },
    getmaneuver: function() {
	return this.getdial()[this.maneuver];
    },
    showmaneuver: function() {
	if (this.timetoshowmaneuver()) {
	    var d = this.getmaneuver();
	    var c  =C[d.difficulty];
	    if (!(activeunit==this)) c = halftone(c);
            this.dialspeed.attr({text:P[d.move].speed,fill:c});
            this.dialdirection.attr({text:P[d.move].key,fill:c});
	}
    },
    beginactivation: function() {
	this.show();
    },
    endactivationphase: function() {
	this.actionsdone=[];
	/* TODO: check this */
    },
    begincombatphase: function() {},
    beginattack: function() {},
    toString: function() {
	if (phase==SELECT_PHASE1||(phase==SELECT_PHASE2&&this.team==2)) return this.toString2();
	var i;
	var n=8;
	for (i=0; i<squadron.length; i++) if (this==squadron[i]) break;
	if (i==squadron.length) i=-1;;
	if (i==-1) str="<div class='dead '>"; else str="<div>";
	n+=this.upgrades.length*2;
	if (this.hull+this.shield<=n) {
	    str+="<div class='vertical stat'>";
	    str+="<div class='hull'>"+repeat("u ",this.hull)+"</div>";
	    str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
	} else {
	    if (this.hull>n) {
		str+="<div class='vertical stat'>";
		str+="<div class='hull'>"+repeat("u ",n)+"</div></div>";
		if (this.hull<=n*2) {
		    str+="<div class='vertical stat2'>";
		    str+="<div class='hull'>"+repeat("u ",this.hull-n)+"</div>";
		    if (this.shield+this.hull<=n*2) 
			str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
		    else { 
			str+="<div class='shield'>"+repeat("u ",n*2-this.hull)+"</div></div>";
			str+="<div class='vertical stat3'>";
			str+="<div class='shield'>"+repeat("u ",this.shield-n*2+this.hull)+"</div></div>";
		    }
		} else {
		    str+="<div class='vertical stat2'><div class='hull'>"+repeat("u ",n)+"</div></div>";
		    str+="<div class='vertical stat3'><div class='hull'>"+repeat("u ",this.hull-n*2)+"</div>";
		    str+="<div class='shield'>"+repeat("u ",this.shield)+"</div></div>";
		}
	    } else { // No more than 8 shields ? 
		str+="<div class='vertical stat'><div class='hull'>"+repeat("u ",this.hull)+"</div>";
		str+="<div class='shield'>"+repeat("u ",n-this.hull)+"</div></div>";
		str+="<div class='vertical stat2'><div class='shield'>"+repeat("u ",this.shield-n+this.hull)+"</div></div>";
	    }    
	}
	str+="<div><div class='statskill'>"+this.skill+"</div>";
	str+="<div class='horizontal statfire'>"+this.weapons[0].getattack()+"</div>";
	str+="<div class='horizontal statevade'>"+this.getagility()+"</div>";
	str+="<div class='horizontal statshield'>"+this.shield+"</div>";
	str+="<div class='horizontal stathull'>"+this.hull+"</div></div>";
	var text=PILOT_translation.english[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof text=="undefined") text=""; 
	str+="<div class='name'><div class='tooltip'>"+text+"</div><div>"+this.name+"</div></div>";
	str+="<div><div style='font-size:small'><code class='"+this.faction+"'></code>"+this.ship.name+"</div></div>";
	str+="<div class='horizontal'><div>"+PILOTS[this.pilotid].points+"pts</div></div>";
	str+="<div class='horizontal details'><div style='text-align:justify;margin:8px;width:100%'>"+text+"</div></div>";
	str+="<div class='vertical'><div>";
	if (i>-1) str+="<div><table style='width:100%'><tr style='width:100%'>"+this.getusabletokens(i,false)+"</tr></table></div>";
	str+="</div></div>";
	var a;
	var b;
	var strw="",stru="",strc="";
	
	a="<td class='statevade' onclick='if (!squadron["+i+"].dead) squadron["+i+"].togglerange();'>"+this.getagility()+"<span class='symbols'>^</span></td>";
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
    getusabletokens: function(i,isforcombat) {
	var str=""; var targets=""
	if (this.canusefocus()) str+="<td title='"+this.focus+" focus token(s)'"+(isforcombat?" onclick='squadron["+i+"].usefocus("+i+")'":"")+" class='xfocustoken'></td>";
	if (this.canuseevade()) str+="<td title='"+this.evade+" evade token(s)'"+(isforcombat?" onclick='squadron["+i+"].useevade("+i+")'":"")+" class='xevadetoken'></td>";
	for (var j=0; j<this.targeting.length; j++) targets+=this.targeting[j].name+" ";
	if (this.canusetarget()) str+="<td title='targeting "+targets.replace(/\'/g,"&#39;")+"'"+(isforcombat?" onclick='squadron["+i+"].usetarget()'":"")+" class='xtargettoken'></td>";
	targets="";
	for (var j=0; j<this.istargeted.length; j++) targets+=this.istargeted[j].name+" ";
	if (targets!="") str+="<td title='targeted by "+targets.replace(/\'/g,"&#39;")+"' class='xtargetedtoken'></td>";
	if (this.iscloaked) str+="<td class='xcloaktoken'></td>";
	if (this.stress>0) str+="<td title='"+this.stress+" stress token(s)'"+(isforcombat?" onclick='squadron["+i+"].usestress("+i+")'":"")+" class='xstresstoken'></td>";	
	if (this.ionized>0) str+="<td title='"+this.ionized+" ionization token(s)' class='xionizedtoken'></td>";	
	return str;
    },
    showstats: function() {
	if (phase==SELECT_PHASE1||phase==SELECT_PHASE2) {
	    $("#stats"+this.id).html(
		"<div class='PS'>"+this.skill+"</div>"
		    +"<div class='statfire'>"+this.weapons[0].getattack()+"</div>"
		    +"<div class='statevade'>"+this.getagility()+"</div>"
		    +"<div class='statshield'>"+this.shield+"</div>"
		    +"<div class='stathull'>"+this.hull+"</div>");
	} else {
	    this.skillbar.attr({text:repeat('u',this.skill)});
	    this.firebar.attr({text:repeat('u',this.weapons[0].getattack())});
	    this.evadebar.attr({text:repeat('u',this.getagility())});
	    this.hullbar.attr({text:repeat('u',this.hull)});
	    this.shieldbar.attr({text:repeat('u',this.shield+this.hull)});
	    $("#"+this.id).html(""+this);
	}
    },
    showpanel: function() {
	var bbox=this.g.getBBox();
	var p=$("#playmat").position();
	var x=p.left+(bbox.x+(this.islarge?80:40))*$("#playmat").width()/900;
	var y=p.top+bbox.y*$("#playmat").height()/900;
	$(".phasepanel").css({left:x+10,top:y}).appendTo("body").show();
    },
    timeforaction: function() {
	return (!waitingforaction.isexecuting&&this==activeunit&&this.hasmoved&&!this.actiondone&&phase==ACTIVATION_PHASE);
    },
    timeformaneuver: function() {
	return (this==activeunit&&this.maneuver>-1&&!this.hasmoved&&this.skill==skillturn);
    },
    show: function() {
	var i;
	if (typeof this.g=="undefined") return;
	this.g.transform(this.m);
	this.g.appendTo(s); // Put to front
	this.geffect.transform(this.m);
	this.geffect.appendTo(s);
	this.showoutline();
	this.flameno++;
	this.showstats();
	this.showinfo();
	if (activeunit!=this) return;

	this.showpanel();
	this.showdial();
	this.showmaneuver();
	if (this.timeforaction()) this.showaction(); else $("#actiondial").empty();
	if (phase==ACTIVATION_PHASE) this.showactivation();
	this.showattack();
	if (this.hull>0) { 
	    $("#"+this.id).html(""+this);
	    $("#"+this.id).addClass("selected");
	}
    },
    showhitsector: function(b,name) {
        var opacity=(b)?"inline":"none";
	var old=activeunit;
	activeunit=this;
	if (old!=this) { 
	    old.unselect();
	    this.select();
	}
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
		    this.sectors.push(s.path(this.getSectorString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}));
		}
		if (this.weapons[k].type=="Bilaser") {
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(this.getSectorString(i,this.m.clone().rotate(180,0,0))).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}));
		    }
		}
	    } else {
		for (i=r0; i<=r1; i++) {
		    this.sectors.push(s.path(this.getSubSectorString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}));
		}
	    }
	}
    },
    showrange: function(b,r0,r1) {
        var opacity=(b)?"inline":"none";
	var i;
	var old=activeunit;
	activeunit=this;
	if (old!=activeunit) {
	    old.unselect();
	    this.select();
	}
	if (!b) {
	    for (i=0; i<this.ranges.length; i++) 
		this.ranges[i].remove();
	    this.ranges=[];
	    return; 
	}
	if (r0==1) {
	    for (i=r0; i<=r1; i++) 
		this.ranges.push(s.path(this.getRangeString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}));
	} else {
	    for (i=r0; i<=r1; i++) 
		this.ranges.push(s.path(this.getSubRangeString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}));
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
    isinsector: function(m,n,sh) {
	var o1=this.getSectorString(n,m);
	var op1=this.getSectorPoints(n,m);
	var o2=sh.getOutlineString(sh.m);
	if (Snap.path.intersection(o2.s,o1).length>0
	    ||this.isPointInside(o1.s,o2.p)
	    ||this.isPointInside(o2.s,op1)) return true
	return false;
    },
    gethitsector: function(sh) {
	var i;
	for (i=1; i<=3; i++) {
	    if (this.isinsector(this.m,i,sh)) return i;
	}
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
	var n=this.ocollision.template;
	if (this.ocollision.overlap>-1) n++;
	for (i=0; i<n; i++) {
	    var r=Math.floor(Math.random()*8);
	    var roll=FACE[ATTACKDICE[r]];
	    if (roll=="hit") { this.resolvehit(1); this.checkdead(); }
	    else if (roll=="critical") { this.resolvecritical(1);
					 this.checkdead();
				       }
	}
    },
    removeshield: function(n) {
	record(this.id,"removeshield("+n+")");
	this.shield=this.shield-n;
    },
    resolvehit: function(n) {
	if (n==0) return;
	if (this.shield>n) this.removeshield(n);
	else {
	    var s=n-this.shield;
	    this.removeshield(this.shield);
	    if (s>0) this.applydamage(s);
	}
	this.showstats();
    },
    resolvecritical: function(n) {
	if (n==0) return;
	if (this.shield>n) this.removeshield(n);
	else {
	    var s=n-this.shield;
	    this.removeshield(this.shield)
	    if (s>0) this.applycritical(s);
	}
	this.showstats();
    },
    removehull: function(n) {
	record(this.id,"removehull("+(n)+")");
	this.hull=this.hull-n;
	this.log("lost "+n+" <p class='chull'></p>");
	if (this.hull<=this.ship.hull/2) this.imgsmoke.attr({display:"block"});
	if (this.hull==1) {
	    this.imgsmoke.attr({display:"none"});
	    this.imgflame.attr({display:"block"});
	}
    },
    selectcritical: function(crits,endselect) {
	var sa=this.showaction
	var tfa=this.timeforaction;
	var cda=this.candoaction;
	this.endoneaction=function() {
	    this.showaction=sa;
	    this.timeforaction=tfa;
	    this.show();
	};
	this.candoaction=function() { return true; }
	this.resolveoneaction=function(n) {
	    endselect(n);
	    this.endoneaction();
	};
	this.timeforaction=function() { return true; }
	this.showaction=function() {
	    var i,str="";
	    $("#actiondial").empty();
	    for (me=0; me<squadron.length; me++) if (squadron[me]==this) break;
	    for (i=0; i<crits.length; i++) {
		str+="<button onclick='squadron["+me+"].resolveoneaction("+crits[i]+")'>"+CRITICAL_DECK[crits[i]].name+"</button>";
	    }
	    $("#actiondial").html("<div>"+str+"</div>").show();
	}.bind(this);
	this.showaction();
    },
    selectdamage: function(crit) {
	var i,s=0,m,j;
	for (i=0; i<CRITICAL_DECK.length; i++) s+=CRITICAL_DECK[i].count;
	var r=Math.floor(Math.random()*s);
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
	    s=this.selectdamage(false);
	    CRITICAL_DECK[s].count--;
	    new Critical(this,s);
	}
	this.removehull(n);
	this.show();
    },
    applycritical: function(n) {
	var s,j;
	for (j=0; j<n; j++) {
	    s=this.selectdamage(true);
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
	
	for (k=0; k<OBSTACLES.length; k++) {
	    var op=OBSTACLES[k].getOutlinePoints();
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
	if (k<OBSTACLES.length) obs=true;
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

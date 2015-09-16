/*
  factorized code and a bug in cache allowed moves

 */
var s;
var GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0";
var HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880";
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
    SLAM:{key:"L",color:BLUE},
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
    NOTHING:{key:"&nbsp;",color:WHITE},
    HIT:{key:"d",color:WHITE},
    SHIELD:{key:"v",color:YELLOW}
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
    this.dialselect="<table class='dial outoverflow' id='dial"+id+"'></table>";
    this.pts="<div class='pts outoverflow' id='pts"+id+"'></div>";
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
	this.incombat=-1;
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
	this.ocollision={overlap:-1,template:0};
	if (typeof this.init!="undefined") this.init();
	for (j in upgs) {
	    if (upgs[j]>-1) {
		Upgradefromname(this,UPGRADES[upgs[j]].name)
	    }
	}
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
    toJuggler: function() {
	var s="";
	s=this.name.replace(/\'/g,"");
	for (var i=0; i<10; i++) {
	    if (this.upg[i]!=-1) {
		var upg=UPGRADES[this.upg[i]];
		s = s + " + "+upg.name.replace(/\'/g,"");
	    }	
	}
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
    remove: function() {
	$("#unit"+this.id).parent().remove();
	delete generics["u"+this.id]	
    },
    toString2: function() {
	var i;
	var str="<div class='generic' id='unit"+this.id+"'>";
	str+="<div><div>"+this.pts+"</div></div>";
	var text=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof text=="undefined"||typeof text.text=="undefined") text=""; else text=formatstring(text.text);
	str+="<div><div id='text"+this.id+"' class='outoverflow upgtxt details'>"+text+"</div><div class='name'>"+this.pilotselect+"</div></div>";
	str+="<div>"+this.dialselect+"</div>";
	str+="<div id='ship"+this.id+"' class='shipname'><span onclick='generics[\"u"+this.id+"\"].remove();'>&#10060;</span>"+this.ship.select+"</div>";
	$("#ship"+this.id+" span").click(function() {
		log("removing");
		    }.bind(this));
	str+="<div>"+this.stats+"</div>";
	str+="<div style='height:4em'>"+this.actions+"</div>";
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
    doplan: function() { this.showdial(); return this.deferred; },
    showdial: function() {
	var m=[],i,j,d;
	var gd=this.getdial();
	if (phase==PLANNING_PHASE||phase==SELECT_PHASE1||phase==SELECT_PHASE2) {
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
	var ml=0;
	var p=[];
	for (i=0; i<PILOTS.length; i++) {
	    if (PILOTS[i].unit==ship && PILOTS[i].faction==this.faction) {
		var n=PILOTS[i].name;
		if (typeof PILOT_translation[n]!="undefined"&& typeof PILOT_translation[n].name!="undefined") n=PILOT_translation[n].name;
		if (selected==-1&&PILOTS[i].unique!=true) selected=i;
		p.push({n:n,name:PILOTS[i].name,c:PILOTS[i].points,s:(selected==i)});
		var e=$("<span>").html(n).appendTo("body");
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
	head="<div id='upgradetext"+this.id+"_"+upgid+"' class='upgrade'>";
	head+="<span class='outoverflow pts' id='pts"+this.id+"_"+upgid+"'></span>";
	head+="<a href='#' class='upgrades "+(type=="Cannon|Torpedo|Missile"?"CannonTorpedoMissile":type)+"'></a>"; /* type.replace(/|/g,'')*/
	head+="<select id='upgrade"+this.id+"_"+upgid+"' onchange='generics[\"u"+this.id+"\"].selectupgrade(\""+type+"\","+upgid+","+bs+")'>";
	head+="<option value='-1' selected>"+UI_translation.none+"</option>";
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
		    this.removepilot(true);
		    this.getpilotlist();
		    this.selectpilot();
		} else delete UNIQUE[this.team][name];
	    }.bind(this);
	}
 
	var up=PILOTS[this.pilotid].upg;
	var text=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof text=="undefined"||typeof text.text=="undefined") text=""; else text=formatstring(text.text);
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
	if (typeof text=="undefined"||typeof text.text=="undefined") text=""; else text=formatstring(text.text);
	$("#upgradetext"+this.id+"_"+upgid).prepend("<div class='outoverflow upgtxt details'>"+(u.attack?"<b class='statfire'>"+u.attack+"</b>["+u.range[0]+"-"+u.range[1]+"], ":"")+text+"</div>");

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
    rollattackdie: function() { return FACE[ATTACKDICE[this.rand(8)]]; },
    rolldefensedie: function() { return FACE[DEFENSEDICE[this.rand(8)]]; },
    rand: function(n) { return Math.floor(Math.random()*n); },
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
	/*PANZOOM.enablePan(); PANZOOM.enableZoom(); */
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
	var p=s.rect(-w,-w,2*w,2*w);
	var t=s.text(w+8,3-w,"8").attr({class: "symbols",fontSize:"1.3em"});
	var g=s.g(t,p).transform(m).attr({fill:this.color,opacity:0.3,display:"none"});
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
	this.lastmaneuver=this.maneuver;
	//if (this.getdial()[i].difficulty=="RED"&&this.stress>0) return;
	this.maneuver=i;
	record(this.id,"this.maneuver="+i);
	//enablenextphase();
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
	if (phase<ACTIVATION_PHASE
	    ||(phase==ACTIVATION_PHASE)
	    ||(phase==COMBAT_PHASE)) {
	    //if (this!=activeunit) $("#activationdial").hide();
	    //else $("#activationdial").show();
	    var old=activeunit;
	    activeunit=this;
	    if (old!=this) old.unselect();
	    $("#"+this.id).addClass("selected");
	    this.show();
	    center(this);
	}
	return this;
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
	var pathpts=[],os=[],op=[];
	var collision={overlap:-1,template:0};
	// Overlapping obstacle ? 
	var so=this.getOutlineString(mend);
	os[i]=so.s;
	op[i]=so.p;
	for (k=0; k<OBSTACLES.length; k++){
	    var ob=OBSTACLES[k].getOutlineString();
	    if (Snap.path.intersection(ob.s,os[i]).length>0 
		||this.isPointInside(ob.s,op[i])
		||this.isPointInside(os[i],ob.p)) {
		collision.overlap=k; 
		break;
	    }
	}
	if (typeof path!=undefined) {
	    // Template overlaps ? 
	    for (i=0; i<=len; i++) {
		var p=path.getPointAtLength(i);
		pathpts.push({x:mbegin.x(p.x,p.y),y:mbegin.y(p.x,p.y)});
	    }
	    var percuted=[];
	    for (j=0; j<pathpts.length; j++) {
		for (k=0; k<OBSTACLES.length; k++) {
		    if (k!=collision.overlap&&percuted.indexOf(k)==-1) { // Do not count overlapped obstacle twice
			var o2=OBSTACLES[k].getOutlineString().p;
			for(i=0; i<o2.length; i++) {
			    var dx=(o2[i].x-pathpts[j].x);
			    var dy=(o2[i].y-pathpts[j].y);
			    if (dx*dx+dy*dy<=100) {  percuted.push(k); collision.template++; break } 
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
	m=this.getmatrixwithmove(m, path, len);
	if (maneuver.match(/K\d|SR\d|SL\d/)) m.rotate(180,0,0);
	path.remove();
	return m;
    },
    getmovecolor: function(m,withcollisions,withobstacles) {
	var i,k;
	if (!this.isinzone(m)) return RED;
	var so=this.getOutlineString(m);
	if (withobstacles) {
	    //this.log("getmovecolor ");
	    var c=this.getocollisions(this.m,m);
	    if (c.overlap!=-1) return YELLOW;
	    /*log("obstacles: "+OBSTACLES.length);*/
/*	    for (k=0; k<OBSTACLES.length; k++) { 
		var os=OBSTACLES[k].getOutlineString();
		if (Snap.path.intersection(os.s,so.s).length>0 
		    ||this.isPointInside(os.s,so.p)
		    ||this.isPointInside(so.s,os.p)) 
		    return YELLOW; 
	    }*/
	}
 	if (withcollisions) {
	    for (k=0; k<squadron.length; k++) {
		var u=squadron[k];
		if (u==this) continue;
		var su=u.getOutlineString(u.m);
		if (Snap.path.intersection(su.s,so.s).length>0
		    ||((this.islarge&&!u.islarge&&this.isPointInside(so.s,su.p)))
		    ||((!this.islarge&&u.islarge)&&this.isPointInside(su.s,so.p))) 
		    return WHITE;
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
	record(this.id,"TE");
    },
    addevade: function(n) { 
	this.addevadetoken(); 
	this.endaction(n,"EVADE");
    },
    addfocustoken: function() {
	this.focus++;
	this.show();
	record(this.id,"TF");
    },
    addfocus: function(n) { 
	this.addfocustoken(); 
	this.endaction(n,"FOCUS");
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
	this.g.attr({display:"none"});
	this.geffect.attr({display:"none"});
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
	this.hitresolved=0;
	this.criticalresolved=0;
	if (c+h>0) {
	    if (c+h<targetunit.shield) targetunit.log("lost "+(c+h)+" <p class='cshield'></p>");
	    else if (targetunit.shield>0) targetunit.log("lost all <p class='cshield'></p>")
	    targetunit.ishit(this);
	    this.hitresolved=targetunit.resolvehit(h);
	    this.criticalresolved=targetunit.resolvecritical(c);
	} 
	targetunit.endbeingattacked(c,h);
	this.weapons[this.activeweapon].endattack(c,h);
	this.endattack(c,h);
	if (targetunit.canbedestroyed(skillturn)) targetunit.checkdead();
	this.cleanupattack();
    },
    cleanupattack: function() {
	//this.hasfired=0;
	//log("calling nextstep from cleanup");
	//this.log("cleanupattack "+this.name+">nextstep()");
	this.actionbarrier();
	//console.log("cleanupattack "+this.name+"<nextstep()");
    },
    endround: function() {
	this.focus=this.evade=0;
	this.hasfired=0;
	this.ocollision.overlap=-1;
	this.ocollision.template=0;
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
	record(this.id,"playfiresnd()");
    },
    endattack: function(c,h) {
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	this.show();
    },
    endbeingattacked: function(c,h) {
	this.show();
    },
    showpossiblepositions:function() {
	this.evaluatepositions(true,true);
	var gd=this.getdial();
	var o=[];
	for (i=0; i<gd.length; i++) {
	    mm = gd[i].m;
	    o[i]=this.getOutline(mm).attr({title:gd[i].move,opacity:0.4,fill:halftone(gd[i].color),display:"block",class:'possible'}).appendTo(VIEWPORT);
	    (function(i) {o[i].hover(function() { o[i].attr({stroke:gd[i].color,strokeWidth:4})}.bind(this),
				     function() { o[i].attr({strokeWidth:0})}.bind(this)); }.bind(this))(i);
	}
    },
    evaluatepositions: function(withcollisions,withobstacles) {
	var gd=this.getdial();
	var i;
	for (i=0; i<gd.length; i++) {
	    var mm = this.getpathmatrix(this.m,gd[i].move);
	    gd[i].m=mm;
	    if (gd[i].difficulty=="RED"&&this.stress>0) gd[i].color=RED; 
	    else gd[i].color=this.getmovecolor(mm,withcollisions,withobstacles);
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
	//this.log((phase==COMBAT_PHASE)+" "+phase);
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
	    if (automove) this.m=m;
	    f(this,k);
	    this.show();
	}.bind(this);
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
    resolveactionselection_sync: function(units,cleanup) {
	this.doselection(function(n) {
	    this.resolveactionselection(units,function (k) { 
		cleanup(k); 
		this.actionr[n].resolve();
		this.show();
	    }.bind(this));
	}.bind(this));
    },
    resolveactionselection: function(units,cleanup) {
	var i;
	this.pos=[];
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
    getboostmatrix:function(m) {
	return [this.getpathmatrix(this.m,"F1"),
		this.getpathmatrix(this.m,"BL1"),
		this.getpathmatrix(this.m,"BR1")];
    },
    resolveboost: function(n) {
	this.resolveactionmove(this.getboostmatrix(this.m),
	    function (t,k) { t.endaction(n,"BOOST"); },true);
    },
    getdecloakmatrix: function(m) {
	return [m.clone(),this.getpathmatrix(m.clone(),"F2")].concat(this.getrollmatrix(m.clone()));
    },
    resolvedecloak: function() {
	this.doselection(function(n) {
	    this.resolveactionmove(this.getdecloakmatrix(this.m),
				   function (t,k) {
				       if (k>0) {
					   t.agility-=2; t.iscloaked=false;
					   SOUNDS.decloak.play();
				       }
				       this.hasdecloaked=true;
				       this.endnoaction(n,"");
				   }.bind(this),true);
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
	    function(t,k) { t.endaction(n,"ROLL");},true);
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
    resolvetarget: function(n) {
	var p=this.gettargetableunits(3);
	this.log("<b>select target to lock</b>");
	this.resolveactionselection(p,function(k) { 
	    if (k>=0) this.addtarget(p[k]);
	    this.endaction(n,"TARGET");
	}.bind(this));
    },
    addcloak: function(n) {
	this.iscloaked=true;
	this.agility+=2;
	SOUNDS.cloak.play();
	this.endaction(n,"CLOAK");
    },
    resolveslam: function(n) {
	var gd=this.getdial();
	var realdial=gd[this.lastmaneuver].move;
	var speed=realdial.substr(-1);
	var p=[];
	var q=[];
	for (var i=0; i<gd.length; i++) 
	    if (gd[i].move.substr(-1)==speed) { 
		p.push(this.getpathmatrix(this.m,gd[i].move));
		q.push(i);
	    }
	this.log("<b>choose maneuver for SLAM</b>");
	var em=this.endmaneuver;
	var tfm=this.timeformaneuver;
	this.timeformaneuver=function() { return true; }
	this.endmaneuver=function() {
	    this.endaction(n,"SLAM");
	    this.endmaneuver=em;
	    this.timeformaneuver=tfm;
	};
	this.resolveactionmove(p,function(t,k) {
	    this.maneuver=q[k];
	    this.doactivation();
	}.bind(this),false,true);
    },
    enqueueaction: function(callback,str) {
	this.actionr.push($.Deferred());
	var n=this.actionr.length-1;
	this.actionr[n-1].done(function() { callback(n) }.bind(this));
	return this.actionr[n];
    },
    endnoaction: function(n,type) {
	this.show();
	this.actionr[n].resolve(type);
	//this.log("solving "+n+" "+(this.actionr.length-1))
	if (n==this.actionr.length-1) this.actionrlock.resolve();
    },
    endaction: function(n,type) {
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
        var r=this.gethitrangeallunits();
	//this.log("hasfired? "+this.hasfired+" r1:"+r[1].length+" r2:"+r[2].length+" r3:"+r[3].length+" iscloaked?"+this.iscloaked+" obst?"+this.isfireobstructed());
	var b= (this.hasfired==0)/*&&((r[1].length>0||r[2].length>0||r[3].length>0)*/&&!this.iscloaked&&!this.isfireobstructed();
	//log("[canfire]"+this.name+" "+b+"="+this.hasfired+"& r=["+r[1].length+", "+r[2].length+", "+r[3].length+"] &"+this.iscloaked+" &"+this.ocollision.overlap)
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
	if (obstacledef>0) this.log("+"+obstacledef+" defense for obstacle");
	return def+sh.weapons[i].getrangedefensebonus(this)+obstacledef;
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
		   "class":"animated"}).appendTo(VIEWPORT);
	//console.log("resolveattack:"+this.name+" "+attack+"/"+defense);
	this.select();	
	for (i=0; i<squadron.length; i++) if (squadron[i]==this) break;
	this.doselection(function(n) {
	    incombat=n;
	    this.doattackroll(this.attackroll(attack),attack,defense,i);
	    //this.show();
	}.bind(this))
	//this.show();
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
	var f=Math.floor(ar/100);
	for (i=0; i<f; i++) $("#attack").prepend("<td class='focusreddice'></td>");
	var c=Math.floor(ar/10)%10;
	for (i=0; i<c; i++) $("#attack").prepend("<td class='criticalreddice'></td>");
	var h=ar%10;
	for (i=0; i<h; i++) $("#attack").prepend("<td class='hitreddice'></td>");
	for (i=0; i<da-h-c-f; i++) $("#attack").prepend("<td class='blankreddice'></td>");
	$("#atokens").html(this.getusabletokens(me,true)+this.getattackrerolltokens()+this.getattackmodtokens(ar,da));
	$("#atokens").append("<button>");
	$("#atokens > button").text("Done").click(function() {
	    $("#atokens").empty();
	    targetunit.dodefenseroll(targetunit.defenseroll(defense),defense,me,n);
	});
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
	//console.log("showattackroll:"+this.name);
	//log("attack roll: f"+f+" c"+c+" h"+h+" b"+(da-h-c-f));
    },
    dodefenseroll: function(dr,dd,me,n) {
	var i,j;
	var f=Math.floor(dr/10);
	for (i=0; i<f; i++) $("#defense").prepend("<td class='focusgreendice'></td>");
	var e=dr%10;
	for (i=0; i<e; i++) $("#defense").prepend("<td class='evadegreendice'></td>");
	for (i=0; i<dd-e-f; i++) $("#defense").prepend("<td class='blankgreendice'></td>");
	for (j=0; j<squadron.length; j++) if (squadron[j]==this) break;
	$("#dtokens").html(this.getusabletokens(j,true)+this.getdefensererolltokens()+this.getdefensemodtokens(dr,dd));
	$("#dtokens").append("<button>");
	$("#dtokens > button").text("Fire!")
	    .click(function() {
		$("#combatdial").hide();
		this.resolvedamage()
		this.endnoaction(incombat);
		this.incombat=-1;
	    }.bind(squadron[me]));
	var change=function() { 
	    if ($(this).hasClass("focusgreendice")) {
		$(this).removeClass("focusgreendice"); $(this).addClass("evadegreendice");
	    } else if ($(this).hasClass("blankgreendice")) {
		$(this).removeClass("blankgreendice"); $(this).addClass("focusgreendice");
	    } else if ($(this).hasClass("evadegreendice")) {
		$(this).removeClass("evadegreendice"); $(this).addClass("blankgreendice");
	    }
	}	//log("defense roll: f"+f+" e"+e+" b"+(dd-e-f));
	$(".focusgreendice").click(change);
	$(".evadegreendice").click(change);
	$(".blankgreendice").click(change);
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
	    this.lastmaneuver=this.maneuver;
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
	
   
	this.ocollision=this.getocollisions(oldm,m,path,lenC);
	if (this.isfireobstructed()) { this.log("overlaps obstacle: no action, cannot attack"); }
	if (this.ocollision.template>0) { this.log("template overlaps obstacle: no action"); }
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
			this.m.rotate(180,0,0);
			record(this.id,"M"+realdial+":"+lenC+":R");
		    } else if (dial.match(/TRL\d/)) {
			this.m.rotate(-90,0,0);
		    } else if (dial.match(/TRR\d/)) {
			this.m.rotate(90,0,0);
		    } else {
			record(this.id,"M"+realdial+":"+lenC);
		    }
		} 
		else { 
		    record(this.id,"M"+realdial+":"+lenC);
		}
		this.handledifficulty(difficulty);
		this.lastmaneuver=this.maneuver;
		this.maneuver=-1;
		path.remove();
		if (this.ocollision.overlap>-1||this.ocollision.template>0) this.resolveocollision();
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
	var dial=this.getdial()[this.maneuver].move;
	var difficulty=this.getdial()[this.maneuver].difficulty;
	if (typeof this.forceddifficulty!="undefined") difficulty=this.forceddifficulty;
	// Move = forward 0. No movement. 
	this.completemaneuver(dial,dial,difficulty);
    },
    endmaneuver: function() {
	this.ionized=0;
	this.hasmoved=true;
	if (this.checkdead()) { this.hull=0; this.shield=0; } 
	else this.doendmaneuveraction();
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
    doendmaneuveraction: function() {
	if (this.candoaction()) this.doaction(this.getactionlist());
	else { this.action=-1; this.actiondone=true; }
    },
    doselection: function(f) {
	return this.enqueueaction(function(n) {
	    f(n);
	    }.bind(this),"doselection");  
    },
    doaction: function(list,str) {
	return this.enqueueaction(function(n) {
	    var i;
	    $("#actiondial").empty();
	    if (this.candoaction()) {
		this.select();
 		if (typeof str!="undefined") this.log(str);
		$("#actiondial").html($("<div>"));
		for (i=0; i<list.length; i++) {
		    if (this.actionsdone.indexOf(list[i].name)==-1) {
			(function(k) {
			    var e=$("<div>").addClass("symbols").text(A[k.type].key)
				.click(function () { this.resolveaction(k,n) }.bind(this));
			    $("#actiondial > div").append(e);
			}.bind(this))(list[i]);
		    }
		}
		var e=$("<button>").text("Skip").click(function() { this.resolveaction(null,n); }.bind(this));
		$("#actiondial > div").append(e);
	    } else this.endaction(n);
	    }.bind(this),"doaction");  
    },
    donoaction: function(list,str) {
	return this.enqueueaction(function(n) {
	    var i;
 	    if (typeof str!="undefined") this.log(str);
	    this.select();
	    $("#actiondial").html($("<div>"));
	    for (i=0; i<list.length; i++) {
		(function(k) {
		    var e=$("<div>").addClass("symbols").text(A[k.type].key)
			.click(function () { this.resolvenoaction(k,n) }.bind(this));
		    $("#actiondial > div").append(e);
		}.bind(this))(list[i]);
	    }
	    var e=$("<button>").text("Skip").click(function() { this.resolvenoaction(null,n); }.bind(this));
	    $("#actiondial > div").append(e);
	    }.bind(this),"donoaction");  
    },
    candoaction: function() {
	//log("stress:"+this.stress+" collision:"+this.collision+" template"+this.ocollision.template+" overlap"+this.ocollision.overlap);
	if (this.stress>0||this.collision||this.ocollision.template>0||this.ocollision.overlap>-1) return false;
	return  true;
    },
    candecloak: function() {
	return (this.iscloaked&&phase==ACTIVATION_PHASE&&!this.hasdecloaked);
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
		    str+="<div class='symbols "+w.color+"' onclick='activeunit.selecttargetforattack("+wn[i]+")'>"+w.key+"</div>"
			}
		// activeunit.hasfired++ ?
		str+="<button onclick='activeunit.hasfired++;activeunit.show();activeunit.deferred.resolve();'>Skip</button>";
		$("#attackdial").html("<div>"+str+"</div>").show();
	    } else if (!this.hasfired) {
		this.log("FALLBACK");
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
	var ad=$.when.apply(null,this.actionr);
	if (ad.state()=="pending") {
	    this.actionrlock=$.Deferred();
	    this.actionrlock.done(function() { this.unlock(); }.bind(this));
	} else {
	    this.actionrlock=$.Deferred();
	    this.actionrlock.resolve();
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
    updateactivationdial: function() {
	this.activationdial=[];
	if (this.candropbomb()) 
	    for (var i=0; i<this.bombs.length; i++) {
		var bomb=this.bombs[i];
		this.addactivationdial(function() {return this.isactive; }.bind(bomb),
		    function() {
			this.unit.lastdrop=round;
			$(".bombs").remove(); 
			this.drop(this.unit.getbomblocation());
			this.unit.showactivation();
		    }.bind(bomb),
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
	    if (adi.pred()) 
		adi.elt.appendTo("#activationdial > div").click(adi.action).html(adi.html);
	}
	$("<button>").html("Move").click(function() {this.resolvemaneuver(); }.bind(this)).appendTo("#activationdial > div");

    },
    log: function(str,a,b,c) {
	if (typeof a!="undefined") str=str.replace(/%0/,a)
	if (typeof b!="undefined") str=str.replace(/%1/,b)
	if (typeof c!="undefined") str=str.replace(/%2/,c)
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
    endcombatphase:function() {
    },
//?28;36;&56;#
    beginplanningphase: function() {
	this.actionr = [$.Deferred().resolve()];
	this.actionrlock=$.Deferred().resolve();
	return this.newlock();
    },
    beginactivationphase: function() {
	this.showmaneuver();
	return this.newlock();
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
	    var c  =C[(typeof this.forceddifficulty!="undefined")?this.forceddifficulty:d.difficulty];
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
	this.forceddifficulty=undefined;
    },
    begincombatphase: function() {
        return this.newlock();
    },
    beginattack: function() { },
    toString: function() {
	if (phase==SELECT_PHASE1||(phase==SELECT_PHASE2&&this.team==2)) return this.toString2();
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
	str+="<div class='horizontal statfire'>"+this.weapons[0].getattack()+"</div>";
	str+="<div class='horizontal statevade'>"+this.getagility()+"</div>";
	str+="<div class='horizontal statshield'>"+this.shield+"</div>";
	str+="<div class='horizontal stathull'>"+this.hull+"</div></div>";
	var text=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	var t=text;
	var name;
	if (typeof text=="undefined"||typeof text.text=="undefined") t=""; else t=formatstring(text.text); 
	if (typeof text=="undefined"||typeof text.name=="undefined") name=this.name; else name=text.name;
	str+="<div class='name'><div class='tooltip outoverflow'>"+t+"</div><div>"+name+"</div></div>";
	text=SHIP_translation[this.ship.name];
	if (typeof text=="undefined") text=this.ship.name;
	str+="<div><div style='font-size:small'><code class='"+this.faction+"'></code>"+text+"</div></div>";
	str+="<div class='horizontal'><div>"+PILOTS[this.pilotid].points+"pts</div></div>";
	str+="<div class='horizontal details'><div style='text-align:justify;margin:8px;width:100%'>"+text+"</div></div>";
	str+="<div class='vertical'><div>";
	if (i>-1) str+="<div><table style='width:100%'><tr style='width:100%'>"+this.getusabletokens(i,false)+"</tr></table></div>";
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
		    this.sectors.push(s.path(this.getSectorString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (this.weapons[k].type=="Bilaser") {
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(this.getSectorString(i,this.m.clone().rotate(180,0,0))).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		}
	    } else {
		for (i=r0; i<=r1; i++) {
		    this.sectors.push(s.path(this.getSubSectorString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"}).appendTo(VIEWPORT));
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
    isinsector: function(m,n,sh) {
	var o1;
	if (this.getoutlinerange(this.m,sh).d!=n) return false;
	var o2=sh.getOutlineString(sh.m);
	if (n>1) o1=this.getSubSectorString(n-1,n,m); else o1=this.getSectorString(n,m);
	return (Snap.path.intersection(o2.s,o1).length>0
	       	||this.isPointInside(o1,o2.p))
    },
    isinfiringarc: function(sh) {
	return this.gethitsector(sh)<=3;
    },
    gethitsector: function(sh,m) {
	var i;
	if (typeof m=="undefined") m=this.m;
	var n=this.getoutlinerange(m,sh).d
	if (this.isinsector(m,n,sh)) return n;
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
	    var roll=this.rollattackdie();
	    if (roll=="hit") { this.resolvehit(1); this.checkdead(); }
	    else if (roll=="critical") { this.resolvecritical(1);
					 this.checkdead();
				       }
	}
    },
    removeshield: function(n) {
	record(this.id,"removeshield("+n+")");
	this.shield=this.shield-n;
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
	record(this.id,"removehull("+(n)+")");
	this.hull=this.hull-n;
	var r=TEAMS[this.team].history.rawdata
	if (typeof r[round]=="undefined") r[round]={hits:0,dead:""}
	r[round].hits+=n;
	this.log("lost "+n+" <p class='chull'></p>");
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
			.click(function() { resolve(crits[k],n);}.bind(this));
		    $("#actiondial").append(e);
		}.bind(this))(i);
	    }
	    $("#actiondial").show();
	}.bind(this));
    },
    selectdamage: function(crit) {
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

/*
  factorized code and a bug in cache allowed moves

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
    "ogg/Slave1-Fly2"
];
var SOUNDS={};
var SOUND_NAMES=["explode","xwing_fire","tie_fire","slave_fire","falcon_fire","xwing_fly","tie_fly","slave_fly","falcon_fly","yt2400_fly","ywing_fly","isd_fly","missile","xwing2_fly","dstar_gun","tie2_fly","slave2_fly"];
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
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u!=-1) {
		var up=UPGRADES[u];
		if (typeof upgpt[upg_lookup(up.type)]=="undefined") upgpt[upg_lookup(up.type)]=[];
		s.points+=up.points;
		upgpt[upg_lookup(up.type)].push(upg_lookup(up.name))
	    }
	}
	s.upgrades=upgpt;
	return s;
    },
    toJuggler: function() {
	var s="";
	s=PILOT_translation[this.name+(this.faction=="SCUM"?" (Scum)":"")];
	if (typeof s=="undefined"||typeof s.name=="undefined") 
	s=this.name.replace(/\'/g,""); else s=s.name.replace(/\'/g,"");
	for (var i=0; i<this.upg.length; i++) {
	    var upg=this.upg[i];
	    if (upg>-1) {
		var v=UPGRADES[upg].name+(UPGRADES[upg].type=="Crew"?"(Crew)":"");
		if (typeof UPGRADE_translation[v]!="undefined"&&typeof UPGRADE_translation[v].name!="undefined")
		    s += " + "+UPGRADE_translation[v].name.replace(/\(Crew\)/g,"").replace(/\'/g,"");
		else s += " + "+v.replace(/\(Crew\)/g,"").replace(/\'/g,"");
		
	    }
	}
	return s;
    },
    toASCII: function() {
	var s="";
	s+=Base64.fromNumber(this.pilotid);
	for (var i=1; i<this.upgrades.length; i++) {
	    var u=this.upgrades[i];
	    if (typeof u.id!="undefined") {
		s+=","+Base64.fromNumber(u.id);
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
	if (n==0) return lock.resolve(0).promise();
	if (typeof P=="undefined") {
	    //console.log("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*10+e;
		ptot+=P[i];
		if (ptot>r) return lock.resolve(10*f+e).promise();
	    }
	}
	return lock.resolve(0).promise();
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
	return this;
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
	if (typeof path!=undefined) {
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
	m=this.getmatrixwithmove(m, path, len);
	if (maneuver.match(/K\d|SR\d|SL\d/)) m.rotate(180,0,0);
	path.remove();
	return m;
    },
    /* TODO: should prevent collision with obstacles if collision with
     * unit shortens path */
    getmovecolor: function(m,withcollisions,withobstacles) {
	var i,k;
	if (!this.isinzone(m)) return RED;
	var so=this.getOutlineString(m);
	if (withobstacles) {
	    var c=this.getocollisions(this.m,m);
	    if (c.overlap>-1) return YELLOW;
	}
 	if (withcollisions) {
	    for (k=0; k<squadron.length; k++) {
		var u=squadron[k];
		var um=u.m;
		if (u==this) continue;
		if (typeof u.newm!="undefined") {
		    um=u.newm;
		    //this.log("taking "+u.name+" move into account");
		}
		var su=u.getOutlineString(um);
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
	this.log("has exploded!");
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
	var cmax=function(a,b) {
	    if (a==RED||(a==YELLOW&&(b==GREEN||b==WHITE))||(a==WHITE&&b==GREEN))
		return a;
	    else return b;
	}
	var cmin=function(a,b) {
	    if (cmax(a,b)==a) return b;
	    else return a;
	}
	for (i=0; i<gd.length; i++) {
	    var mm = this.getpathmatrix(this.m,gd[i].move);
	    gd[i].m=mm;
	    if (gd[i].difficulty=="RED"&&this.stress>0) gd[i].color=RED; 
	    else {
		var c=RED;
		gd[i].color=this.getmovecolor(mm,false,withobstacles);
		if (gd[i].color!=RED) {
		    for (j=0; j<gd.length; j++) {
			var mmm=this.getpathmatrix(mm,gd[j].move);
			if (cmax(c,gd[i].color)==gd[i].color) break;
			if (gd[j].difficulty=="RED"&&((this.stress>0&&gd[i].difficulty!="GREEN")||gd[i].difficulty=="RED")) continue;
			var cc=this.getmovecolor(mmm,withcollisions,withobstacles);
			c=cmin(c,cc);
		    }
		}
		gd[i].color=cmax(c,gd[i].color);
	    }
	}
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
	this.log("select target to lock");
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
	//log(">> "+n+":"+org);
	actionr[n-1].done(function() { 
	    //log("|| "+n+" execute"); 
	    callback(n) }.bind(this));
	return actionr[n];
    },
    endnoaction: function(n,type) {
	this.show();
	actionr[n].resolve(type);
	//this.log("***"+actionrlock.state());
	if (n==actionr.length-1) actionrlock.resolve();
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
		var cl=a.str+"modtokend"
		if (typeof a.token!="undefined") cl="x"+a.str+"token";
		str+="<td id='moda"+(i+j)+"' class='x"+a.str+"token' onclick='record("+this.id+","+j+",\"attackmoda_"+n+"\"); modroll(squadron["+me+"].ATTACKMODA["+j+"].f,"+n+","+(i+j)+")' title='modify roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
	    }
	}   
	i=ATTACKMODA.length+ATTACKMODD.length+this.ATTACKMODA.length
	for (j=0; j<this.ATTACKADD.length; j++) {
	    var a=this.ATTACKADD[j];
	    if (a.req(m,n)) {
		str+="<td id='moda"+(j+i)+"' class='"+a.str+"modtokena' onclick='record("+this.id+","+j+"\"attackadd_"+n+"\"); addroll(squadron["+me+"].ATTACKADD["+j+"].f,"+n+","+(i+j)+")' title='add roll ["+a.org.name.replace(/\'/g,"&#39;")+"]'></td>";
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
	}.bind(this),this.name+" attack")
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
	displayattackroll(ar,da);
	$("#atokens").html(this.getattackrerolltokens()+this.getattackmodtokens(ar,da));
	$("#atokens").append("<button>");
	$("#atokens > button").addClass("m-done").click(function() {
	    $("#atokens").empty();
	    record("doattackroll",-1);
	    targetunit.defenseroll(defense).done(function(roll) {
		targetunit.dodefenseroll(roll,defense,me,n);
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
		this.resolvedamage()
		this.endnoaction(incombat,"incombat");
		this.incombat=-1;
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
		    } else if (dial.match(/TRL\d/)) {
			this.m.rotate(-90,0,0);
		    } else if (dial.match(/TRR\d/)) {
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
	this.actionbarrier();
    },
    unlock:function(v) {
	//this.log("state:"+this.deferred.state());
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
	if (this.candoendmaneuveraction()) this.doaction(this.getactionlist());
	else { this.action=-1; this.actiondone=true; }
    },
    doselection: function(f,org) {
	return this.enqueueaction(function(n) {
	    f(n);
	    }.bind(this),org);  
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
		    var e=$("<div>").addClass("symbols").text(A[k.type].key)
			.click(function () { record(this.id,h,"donoaction"); this.resolvenoaction(k,n) }.bind(this));
		    $("#actiondial > div").append(e);
		}.bind(this))(list[i],i);
	    }
	    if (noskip==true) {
		var e=$("<button>").text("Skip").click(function() { record(this.id,-1,"skipnoaction"); this.resolvenoaction(null,n); }.bind(this));
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
		str+="<button onclick='record("+this.id+",-1,\"skiptargetforattack\"); activeunit.hasfired++;activeunit.show();activeunit.deferred.resolve();'>Skip</button>";
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
	var ad=$.when.apply(null,actionr);
	if (ad.state()=="pending") {
	    actionrlock=$.Deferred();
	    actionrlock.done(function() { this.unlock() }.bind(this));
	} else {
	    actionrlock=$.Deferred();
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
		adi.elt.appendTo("#activationdial > div").click(function() { 
		    record(0,0,(function(i){return function() {this.updateactivationdial()[i].action();}})(i)) 
		    adi.action();
		}).html(adi.html);
	}
	$("<button>").addClass("m-move").click(function() { record(0,0,function(){this.resolvemaneuver();}); this.resolvemaneuver(); }.bind(this)).appendTo("#activationdial > div");

    },
    log: function(str,a,b,c) {
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
	.replace(/%BARRELROLL%/g,"<code class='symbols'>r</code>")
	.replace(/%TURNLEFT%/g,"<code class='symbols'>4</code>")
	.replace(/%TURNRIGHT%/g,"<code class='symbols'>6</code>")
	.replace(/%BOOST%/g,"<code class='symbols'>b</code>")
        .replace(/%ELITE%/g,"<code class='symbols'>E</code>")
 	.replace(/%BOMB%/g,"<code class='symbols'>B</code>")
	.replace(/%STRAIGHT%/g,"<code class='symbols'>8</code>")
	.replace(/%CREW%/g,"<code class='symbols'>C</code>")
        .replace(/%STOP%/g,"<code class='symbols'>5</code>")
        .replace(/%TARGETLOCK%/g,"<code class='symbols'>l</code>")
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

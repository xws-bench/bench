var s = Snap("#svgout");
var GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0";
var HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880";
var TIMEANIM=500;
var FACE=["focus","hit","critical","evade","blank"];
var ATTACKDICE= [0,0,1,1,1,2,4,4];
var DEFENSEDICE=[0,0,3,3,3,4,4,4];
var activeunit;
var unitlist;
var pilotlist;
var squadron=[];
var active=0;
var globalid=1;
var targetunit;
//sicon.image("img/xwing.png", 0,0, 100,100 );

function attackroll(n) {
    var i;
    var roll=[]
    for (i=0; i<n; i++) {
	var r=Math.floor(Math.random()*8);
	roll[i]=FACE[ATTACKDICE[r]];
    }
    return roll;
}
function defenseroll(n) {
    var i;
    var roll=[]
    for (i=0; i<n; i++) {
	var r=Math.floor(Math.random()*7);
	roll[i]=FACE[DEFENSEDICE[r]];
    }
    return roll;
}

function actionevent() {
    return new CustomEvent(
	"actioncomplete", {
	    detail: {
		time: new Date(),
	    },
	    bubbles: true,
	    cancelable: true
	});
}
function maneuverevent() {
    return new CustomEvent(
	"maneuvercomplete", {
	    detail: {
		time: new Date(),
	    },
	    bubbles: true,
	    cancelable: true
	});
}
function fireevent(attacker,ar,defenser,dr) {
    return new CustomEvent(
	"firecomplete", {
	    detail: {
		ar:ar,
		dr:dr,
		attacker:attacker,
		defenser:defenser,
		time: new Date(),
	    },
	    bubbles: true,
	    cancelable: true
	});
}

function transformPoint(matrix,point)  {
    var dx = point.x * matrix.a + point.y * matrix.c + matrix.e;
    var dy = point.x * matrix.b + point.y * matrix.d + matrix.f;
    return { x: dx, y: dy };
} 
function getoutlinerange(rsh,ro) {
    var min=90001;
    var i,j;
    var str="";
    for (i=0; i<4; i++) {
	for (j=0; j<4; j++) {
	    var d=dist(rsh[j],ro[i]);
	    if (d<min) { min=d; }
	}
    }
    if (min<=10000) {return 1; }
    if (min<=40000) { return 2; }
    if (min<=90000) { return 3; }
    return 4;
}

function halftone(c) {
    if( c==GREEN) return HALFGREEN;
    if (c==RED) return HALFRED;
    if (c==WHITE) return HALFWHITE;
    if (c==BLUE) return HALFBLUE;
    if (c==YELLOW) return HALFYELLOW;
    return c;
}

var MS = function(x) { return (new Snap.Matrix().scale(x,x));}
var MT = function(x,y) { return (new Snap.Matrix()).translate(x,y); }
var MR = function(a,x,y) { return (new Snap.Matrix()).rotate(a,x,y); }
var C = { GREEN:"#0F0",RED:"#F00",WHITE:"#FFF" };

var P = { F0:{path:s.path("M 0 0"), speed: 0, key:"5"},
          F1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"8"},
          F2:{path:s.path("M 0 0 L 0 -120"), speed: 2, key:"8"},
          F3:{path:s.path("M 0 0 L 0 -160"), speed: 3, key:"8"},
          F4:{path:s.path("M 0 0 L 0 -200"), speed: 4, key:"8"},
          F5:{path:s.path("M 0 0 L 0 -240"), speed: 5, key: "8" },
	  // Turn right
          TR1:{path:s.path("M0 0 C 0 -40 15 -55 55 -55"), speed: 1, key:"6"},// 35 -35
          TR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83"), speed:2, key:"6"},// 63 -63
	  TR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105"), speed:3, key:"6"}, // 85 -85
	  // Turn left
          TL1:{path:s.path("M0 0 C 0 -40 -15 -55 -55 -55"), speed:1, key:"4"}, // -35 -35
          TL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83"), speed:2, key:"4"},// -63 -63
	  TL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105"), speed:3, key:"4"}, // -85 -85
	  // Bank right
	  BR1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92"), speed:1, key:"9"}, // 24 -58 (+/-14.14)
	  BR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"9"}, // 40 -92 (+/-14.14)
	  BR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"9"}, // 55 -126 (+/-14.14)
	  // Bank left
	  BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"7"}, // 24 -58 (+/-14.14)
	  BL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126"), speed:2, key:"7"}, // 40 -92 (+/-14.14)
	  BL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"7"}, // 55 -126 (+/-14.14)
	  // K turns (similar to straight line, special treatment in move function)
          K1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"2"},
          K2:{path:s.path("M 0 0 L 0 -120"), speed: 2, key:"2"},
          K3:{path:s.path("M 0 0 L 0 -160"), speed: 3, key:"2"},
          K4:{path:s.path("M 0 0 L 0 -200"), speed: 4, key:"2"},
          K5:{path:s.path("M 0 0 L 0 -240"), speed: 5, key: "2" }
	};
// Table of actions
var A = { 	  
    ROLL:{key:"r",color:GREEN},
    FOCUS:{key:"f",color:GREEN},
    TARGET:{key:"l",color:BLUE},
    EVADE:{key:"e",color:GREEN},
    BOOST:{key:"b",color:GREEN},
    STRESS:{key:"s",color:RED},
    ISTARGETED:{key:"l",color:RED},
    ASTRO:{key:"A",color:YELLOW},
    CANNON:{key:"C",color:YELLOW},
    CREW:{key:"W",color:YELLOW},
    MISSILE:{key:"M",color:YELLOW},
    TORPEDO:{key:"P",color:YELLOW},
    ELITE:{key:"T",color:YELLOW},
    TURRET:{key:"U",color:YELLOW},
    UPGRADE:{key:"S",color:YELLOW},
    CRITICAL:{key:"c",color:RED},
    NOTHING:{key:""}
};
var AINDEX = ["ROLL","FOCUS","TARGET","EVADE","BOOST","STRESS","ISTARGETED","ASTRO","CANNON","CREW","MISSILE","TORPEDO","ELITE","TURRET","UPGRADE","CRITICAL","NOTHING"];

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
function Unit(name) {
    var pilot=pilotlist[name];
    var unit=unitlist[pilot.unit];
    this.name=name;
    if (!pilot.unique) this.name=this.name+(globalid++);
    this.unit=unit;
    this.pilot=pilot;
    this.skill=pilot.skill;
    this.focus=0;
    this.target=0;
    this.istargeted=0;
    this.stress=0;
    this.evade=0;
    this.hasfired=false;
    this.showtarget=false;

    this.m = new Snap.Matrix();

    this.color=(unit.faction=="REBEL")?RED:GREEN;
    this.img=s.image(unit.img, -20,-20, 40,40 );
    this.outline = s.rect(-20,-20,40,40).attr({
        fill: "rgba(8,8,8,0.5)",
        strokeWidth: 2,
    });

    this.hashitsector=false;
    this.skillbar=s.text(-19,-17,repeat('u',pilot.skill)).transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#fa0",
    });
    this.firebar=s.text(-19,-15,repeat('u',unit.fire)).transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#f00",
    });
    this.evadebar=s.text(-19,-13,repeat('u',unit.evade)).transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#0f0",
    });
    this.hullbar=s.text(-19,-11,repeat('u',unit.hull)).transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#cc0",
    });
    this.shieldbar=s.text(-19,-11,repeat('u',unit.shield+unit.hull)).transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#0af",
    });
    this.gstat=s.group(this.skillbar,this.firebar,this.evadebar,this.shieldbar,this.hullbar);
    this.dial = unit.dial;
    this.actionList=unit.actionList;
    this.dialspeed = s.text(22,-17,"").attr({class: "dialspeed"	});
    this.dialdirection = s.text(26,-17,"").attr({class: "symbols" });
    this.actionicon = s.text(22,-7,A["NOTHING"].key).attr({class: "symbols",strokeWidth:0});
    this.sector = s.polygon(-17,-20,0,0,17,-20).attr({
	fill: this.color,
	opacity:0.5,
	strokeWidth: 0
    });
    this.sector1=s.path(this.getSectorString(1,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.sector2=s.path(this.getSectorString(2,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.sector3=s.path(this.getSectorString(3,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});

    this.infoicon=[];
    var i;
    for(i=0; i<4; i++) {
	this.infoicon[i]=s.text(13,-14+7*i,A[AINDEX[i+2]].key)
	    .attr({class: "xsymbols",fill:A[AINDEX[i+2]].color,strokeWidth: 0
		  });
    }
    // Order in the group is important. Latest is on top of stacked layers
    this.g=s.group(this.sector3,this.sector2,this.sector1,this.sector,this.outline,this.dialspeed,this.dialdirection,this.actionicon,this.img,this.infoicon[0],this.infoicon[1],this.infoicon[2],this.infoicon[3],this.gstat);
    this.g.hover(function (e,x,y) {  
//	myship.summary=s.text(x,y,myship.name).attr({class:"hoverinfo"}); 
    },
		 function() { //myship.summary.remove(); 
		 });
    this.setdefaultclickhandler();
    this.imgpilot=pilot.img;
    this.maneuver=-1;
    this.action=-1;
}

Unit.prototype = {
    setclickhandler: function(f) {
	this.img.unmousedown();
	this.img.mousedown(f);
    },
    setdefaultclickhandler: function() {
	this.img.unmousedown();
	this.img.mousedown(function() { 
	    if (this!=activeunit) {
		var old=activeunit;
		activeunit=this;
		old.show();
		old.undrag();
		activeunit.select();
	    }
	}.bind(this));
    },
    dragmove: function(dx,dy,x,y) {
	this.dragMatrix=MT(dx,dy).add(this.m);
	this.dragged=true;
	this.g.transform(this.dragMatrix);
    },
    dragstart:function(x,y,a) { this.showhitsector(false); this.dragged=false; },
    dragstop: function(a) { 
    if (this.dragged) { this.m=this.dragMatrix;} 
	this.dragged=false;
    },
    getOutline: function(m) {
	var p1=transformPoint(m,{x:-20,y:-20});
	var p2=transformPoint(m,{x:20,y:-20});
	var p3=transformPoint(m,{x:20,y:20});
	var p4=transformPoint(m,{x:-20,y:20});	
	return s.path("M "+p1.x+" "+p1.y+" L "+p2.x+" "+p2.y+" "+p3.x+" "+p3.y+" "+p4.x+" "+p4.y+" Z").attr({display: "none"});    
    },
    getSectorString: function(n,m) {
	var x=[
	    {},
	    {a:81.76,b:96.2}, // sector 1 
	    {a:146.5,b:172.4}, // sector 2
	    {a:211.4,b:248.8} // sector 3
	];
	var p1=transformPoint(m,{x:0,y:0});
	var p2=transformPoint(m,{x:-x[n].a,y:-x[n].b});
	var p3=transformPoint(m,{x:-x[n].a+30,y:-x[n].b-15-5*n});	
	var p4=transformPoint(m,{x:-17,y:-20-100*n});
	var p5=transformPoint(m,{x:17,y:-20-100*n});
	var p8=transformPoint(m,{x:-7-10*n,y:-20-100*n});
	var p9=transformPoint(m,{x:7+10*n,y:-20-100*n});
	var p6=transformPoint(m,{x:x[n].a-30,y:-x[n].b-15-5*n});
	var p7=transformPoint(m,{x:x[n].a,y:-x[n].b});
	return ("M "+p1.x+" "+p1.y+" L "+p2.x+" "+p2.y+" C "+p3.x+" "+p3.y+" "+p8.x+" "+p8.y+" "+p4.x+" "+p4.y+" L "+p5.x+" "+p5.y+" C "+p9.x+" "+p9.y+" "+p6.x+" "+p6.y+" "+p7.x+" "+p7.y+" Z");
    },
    getOutlinePoints: function(m) {
	var p1=transformPoint(m,{x:-20,y:-20});
	var p2=transformPoint(m,{x:20,y:-20});
	var p3=transformPoint(m,{x:20,y:20});
	var p4=transformPoint(m,{x:-20,y:20});	
	return [p1,p2,p3,p4];
    },
    nextManeuver: function() {
	if (this.maneuver==-1) { this.maneuver=0; }
        else { this.maneuver=(this.maneuver==this.dial.length-1)?0:this.maneuver+1; }
	if (this.dial[this.maneuver].difficulty=="RED"&&this.stress>0) {
	    this.nextManeuver();
	}
    },
    prevManeuver: function() {
	if (this.maneuver==-1) { this.maneuver=0; } 
        else {this.maneuver=(this.maneuver==0)?this.dial.length-1:this.maneuver-1; }
	if (this.dial[this.maneuver].difficulty=="RED"&&this.stress>0) {
	    this.prevManeuver();
	}
    },
    nextaction: function() {
	if (this.action==-1) { this.action=0; } 
	else {this.action=(this.action==this.actionList.length-1)?0:this.action+1;}
	var a = this.actionList[this.action];
	this.actionicon.attr({text:A[a].key, fill:A[a].color});
    },
    prevaction: function() {
	if (this.action==-1) { this.action=0; } 
	else { this.action=(this.action==0)?this.actionList.length-1:this.action-1;}
	var a = this.actionList[this.action];
	this.actionicon.attr({text:A[a].key, fill:A[a].color});
    },
    turn: function(n) {
	this.m.add(MR(n,0,0)); 
	this.show();
    },
    select: function() {
	targetunit=this;
	if (phase==0) { this.g.drag(this.dragmove.bind(this),
				    this.dragstart.bind(this),
				    this.dragstop.bind(this)); }
        center(this);
	this.show();
    },
    iscollidingunit: function(m,sh) {
	var o1=this.getOutline(m);
	var o2=this.getOutline(sh.m);
	var inter=Snap.path.intersection(o1, o2);
	o1.remove();
	o2.remove();
	if (inter.length>0) { return true; }
	return false;
    },
    iscollidinganyunit: function(m) {
	var collision=false;
	var i;
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if (sh!=this) {
		if (this.iscollidingunit(m,sh)) {  
		    collision=true;
		    this.collides=sh;
		}
	    }
	};
	return collision;
    },
    getpathmatrix: function(m,maneuver) {
	var path =  P[maneuver].path.transform(this.m).attr({display:"none"});
	var len = path.getTotalLength();
	var movePoint = path.getPointAtLength( len );
	m.add(MT(movePoint.x,movePoint.y)).add(MR(movePoint.alpha-90,0,0)); 
	return m;
    },
    getpossibleoutline: function(m) {
	var o1=this.getOutline(m).attr({display:"inline",fill:this.color,opacity:0.3});
	var possible=true;
	var i;
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if (sh!=this) {
		var o2=sh.getOutline(sh.m);
		var inter=Snap.path.intersection(o1, o2);
		o2.remove();
		if (inter.length>0) {
		    possible=false;
		    o1.attr({pointerEvents:"none",display:"none"}); 
		    break; 
		}
	    }
	}
	return {ol:o1,b:possible};
    },
    updateactionlist: function() {
	if (this.stress>0||this.collision>0) {
	    this.actionList=["NOTHING"];
	} else {
	    this.actionList=this.unit.actionList;
	    this.actionList[this.actionList.length]="NOTHING";
	}
    },
    addevade: function() { this.evade++; this.action=-1;this.show();
			     document.dispatchEvent(actionevent());
			     return true;
			   },
    addfocus: function() { this.focus++; this.action=-1; this.show();	    
			     document.dispatchEvent(actionevent());
			     return true;
},
    resolvefocus: function() { this.focus--; },
    resolveboost: function() {
	var m;
	var resolve=function(m) {
	    this.pos1.ol.remove();
	    this.pos2.ol.remove();
	    this.pos3.ol.remove();
	    this.m=m;
	    this.action=-1;
	    this.show();
	    document.dispatchEvent(actionevent());
	}.bind(this);
	var m1=this.getpathmatrix(this.m.clone(),"F1");
	this.pos1=this.getpossibleoutline(m1);
	if (this.pos1.b) { this.pos1.ol.click(function() { resolve(m1);}); }
	var m2=this.getpathmatrix(this.m.clone(),"BL1");
	this.pos2=this.getpossibleoutline(m2)
	if (this.pos2.b) { this.pos2.ol.click(function() { resolve(m2);}); }
	var m3=this.getpathmatrix(this.m.clone(),"BR1");
	this.pos3=this.getpossibleoutline(m3)
	if (this.pos3.b) { this.pos3.ol.click(function() { resolve(m3);}); }
	if (!this.pos1.b&&!this.pos2.b&&!this.pos3.b) {
	    document.dispatchEvent(actionevent());
	}
	return true;
    },
    resolveroll: function() {
	var m=[];
	this.pos=[];
	var exist=false;
	var i;
	var resolve=function(k) {
	    for (i=0; i<6; i++) {
		this.pos[i].ol.remove();
	    }
	    this.m=m[k];
	    this.action=-1;
	    this.show();
	    document.dispatchEvent(actionevent());
	}.bind(this);
	var m0=this.getpathmatrix(this.m.clone().add(MR(90,0,0)),"F1")
	    .add(MR(-90,0,0)).add(MT(0,-20));
	var m1=this.getpathmatrix(this.m.clone().add(MR(-90,0,0)),"F1")
	    .add(MR(90,0,0)).add(MT(0,-20));
	for (i=0; i<3; i++) {
	    m[i]=m0.clone().add(MT(0,20*i));
	    this.pos[i]=this.getpossibleoutline(m[i]);
	    m[i+3]=m1.clone().add(MT(0,20*i));
	    this.pos[i+3]=this.getpossibleoutline(m[i+3]);
	    exist=exist||this.pos[i].b||this.pos[i+3];
	}
	if (!exist) {
	    for (i=0; i<6; i++) {
		this.pos[i].ol.remove();
	    }	    
	    document.dispatchEvent(actionevent());
	} else {
	    if (this.pos[0].b) { this.pos[0].ol.click(function() {resolve(0);}); }
	    if (this.pos[0].b) { this.pos[1].ol.click(function() {resolve(1);}); }
	    if (this.pos[0].b) { this.pos[2].ol.click(function() {resolve(2);}); }
	    if (this.pos[0].b) { this.pos[3].ol.click(function() {resolve(3);}); }
	    if (this.pos[0].b) { this.pos[4].ol.click(function() {resolve(4);}); }
	    if (this.pos[0].b) { this.pos[5].ol.click(function() {resolve(5);}); }
	}
	return true;
    },
    addtarget: function() { 	    
	if (this!=targetunit
	    &&this.getrange(targetunit)<=3
	    &&this.unit.faction!=targetunit.unit.faction) {
	    this.target++;
	    this.targeting=targetunit;
	    targetunit.istargeted++;
	    targetunit.showinfo();
	    this.action=-1;
	    this.show();
	    console.log("targeting "+targetunit.name);
	    document.dispatchEvent(actionevent());
	    return true;
	} else { console.log("no targeting!"); return false; }
    },
    resolveaction: function() {
	if (this.action==-1) { return true; }
	var a = this.actionList[this.action];
	this.showtarget=0;
	if (a=="BOOST") { return this.resolveboost(); }
	if (a=="ROLL") {return this.resolveroll(); }
	if (a=="FOCUS") {return this.addfocus(); }
	if (a=="EVADE")  { return this.addevade(); }
	if (a=="TARGET") { return this.addtarget(); }
	if (a=="NOTHING") { document.dispatchEvent(actionevent()); }
	this.action=-1;
	return true;
    },
    canfire: function() {
	var r=this.gethitrangeallunits();
	return (!this.hasfired&&(r[1].length>0||r[2].length>0||r[3].length>0));
    },
    resolvefire: function() {
	var r=this.gethitrange(targetunit);
	if (targetunit!=this&&r<=3&&!this.hasfired) {
	    var attack=this.unit.fire;
	    var defense=targetunit.unit.evade;
	    if (r==1) { attack++; }
	    if (r==3) { defense++; }
	    this.hasfired=true;
	    console.log(this.name+" fired on "+targetunit.name);
	    document.dispatchEvent(fireevent(this,attackroll(attack),targetunit,defenseroll(defense)));
	}
    },
    resolvemaneuver: function() {
	if (this.maneuver==-1) return;
	var dial=this.dial[this.maneuver].move;
	var difficulty=this.dial[this.maneuver].difficulty;
	var path =  P[dial].path.transform(this.m).attr({display:"none"});
	var lenC = path.getTotalLength();
	this.collision=false; // Any collision with other units ?
	var m=new Snap.matrix();
	var m_old;
	var outline;
	var postcollision=false; // Time after a collision with a unit. Stop animation
	// Check collision with other units

	this.maneuver=-1;
	this.showhitsector(false);
	movePoint = path.getPointAtLength( lenC );
	m_old=this.m;
	m = this.m.clone();
	m.add(MT(movePoint.x,movePoint.y)).add(MR(movePoint.alpha-90,0,0)); 
	console.log(this.name);
	if (this.iscollidinganyunit(m)) { console.log("has collision!!");
					  this.collision=true; }
	else { console.log("has no collision"); }
	Snap.animate(0, lenC, function( value ) {
	    if(!postcollision) {
		movePoint = path.getPointAtLength( value );
		m = this.m.clone();
		m.add(MT(movePoint.x,movePoint.y)).add(MR(movePoint.alpha-90,0,0)); 
		if (this.collision && this.iscollidinganyunit(m)) { postcollision=true; }
		if (!postcollision) { m_old=m; this.g.transform(m); }
	    }
	}.bind(this), TIMEANIM,mina.linear, function(){
	    if (!this.collision) { 
		this.m=m; 
		// Special handling of K turns: half turn at end of movement. Straight line if collision.
		if (dial=="K1"||dial=="K2"||dial=="K3"||dial=="K4"||dial=="K5") { this.m.add(MR(180,0,0))} } 
	    else { this.m=m_old; }
	    // Handle stress
	    if (difficulty=="RED") {
		this.stress++;
	    } else if (difficulty=="GREEN" && this.stress>0) {
		this.stress--;
	    }
	    this.show();
	    document.dispatchEvent(maneuverevent());
	}.bind(this));
    },
    showaction: function(active) {
	if (this.action==-1) {
	    this.actionicon.attr({text:""});
	} else {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:(active?c:halftone(c))});
	    this.showtarget=false;
	    if (a=="TARGET") { this.showtarget=true; }
	}
    },
    showinfo: function() {
	var i=0,j;
	if (this.focus>0) {
	    this.infoicon[i++].attr({text:A.FOCUS.key,fill:A.FOCUS.color});}
	if (this.evade>0) {
	    this.infoicon[i++].attr({text:A.EVADE.key,fill:A.EVADE.color});}
	if (this.target>0) {
	    this.infoicon[i++].attr({text:A.TARGET.key,fill:A.TARGET.color});}
	if (this.istargeted>0) {
	    this.infoicon[i++].attr({text:A.ISTARGETED.key,fill:A.ISTARGETED.color});}
	if (this.stress>0) {
	    this.infoicon[i++].attr({text:A.STRESS.key,fill:A.STRESS.color});}
	for (j=i; j<4; j++) {
	    this.infoicon[i++].attr({text:""});}	    
    },
    showoutline: function(active) {
        this.outline.attr({ stroke: (active?this.color:halftone(this.color)) }); 
    }, 
    showdial: function(active) {
	if (this.maneuver==-1) {
            this.dialspeed.attr({text:""});
            this.dialdirection.attr({text:""});
	    return;
	};
	var d = this.dial[this.maneuver];
	var c  =C[d.difficulty];
	if (!active) { c = halftone(c); } 
        this.dialspeed.attr({text:P[d.move].speed,fill:c});
        this.dialdirection.attr({text:P[d.move].key,fill:c});
    },
    show: function() {
	var b=(activeunit==this);
	this.g.appendTo(s); // Put to front
	this.g.transform(this.m);
	this.showaction(b);
	this.showdial(b);
	this.showoutline(b);
	this.showinfo();
	var t=b?"":"t";
	//sicon.attr("href",this.unit.img);
	$("#"+t+"pilot").html(this.name);
	$("#"+t+"pilot-text").html(this.pilot.text);
	$("#"+t+"unit").html(this.pilot.unit);
	$("#"+t+"skill").html(this.skill);
	$("#"+t+"fire").html(this.unit.fire);
	$("#"+t+"evade").html(this.unit.evade);
	$("#"+t+"hull").html(this.unit.hull);
	$("#"+t+"shield").html(this.unit.shield);
	$("#"+t+"actionlist .focustoken").remove();
	$("#"+t+"actionlist .evadetoken").remove();
	$("#"+t+"actionlist .targettoken").remove();
	$("#"+t+"actionlist .stresstoken").remove();
	if (this.focus>0) { $("#"+t+"actionlist").append("<a href='#' title='"
							 +this.focus+
							 " focus token' class='focustoken' onclick='"+t+"usefocus()'></a>"); }
	if (this.evade>0) { $("#"+t+"actionlist").append("<a href='#' title='"+this.evade+" evade token' class='evadetoken' onclick='"+t+"useevade()'></a>"); }
	if (this.target>0) { $("#"+t+"actionlist").append("<a href='#' title='<ul><li>"+this.targeting.name+"</li></ul>' class='targettoken'></a>"); }
	if (this.stress>0) { $("#"+t+"actionlist").append("<a href='#' title='"+this.stress+" stress token' class='stresstoken'></a>"); }
    },
    showhitsector: function(b) {
        var opacity=(b)?"inline":"none";
	this.hashitsector=b;
	this.sector1.attr({display:opacity});
	this.sector2.attr({display:opacity});
	this.sector3.attr({display:opacity});
    },
    togglehitsector: function() {
	this.hashitsector=!this.hashitsector; 
	this.showhitsector(this.hashitsector);
    },
    isinsector: function(m,n,sh) {
	var o1=this.getSectorString(n,m);
	var o2=this.getOutlinePoints(sh.m);
	if (Snap.path.isPointInside(o1, o2[0].x,o2[0].y)
	    ||Snap.path.isPointInside(o1, o2[1].x,o2[1].y)
	    ||Snap.path.isPointInside(o1, o2[2].x,o2[2].y)
	    ||Snap.path.isPointInside(o1, o2[3].x,o2[3].y)) { return true; }
	return false;
    },
    gethitrange: function(sh) {
	var r=4,i;
	if (sh.unit.faction==this.unit.faction) { return 4; }
	if (this.collision&&this.collides==sh) {return 4; }
	for (i=1; i<4; i++) {
	    if (this.isinsector(this.m,i,sh)) { r=(i<r)?i:r; }
	}
	return r;
    },
    gethitrangeallunits: function() {
	var str='';
	var range=[[],[],[],[],[]];
	squadron.forEach(function(sh) {
	    if (sh!=this) {
		var r=this.gethitrange(sh);
		range[r][range[r].length]=sh;
	    }
	}.bind(this));
	return range;
    },
    getrange: function(sh) {
	var ro=this.getOutlinePoints(this.m);
	var rsh = sh.getOutlinePoints(sh.m);
	return getoutlinerange(rsh,ro);
    },
    getrangeallunits: function() {
	var ro=this.getOutlinePoints(this.m);
	var range=[[],[],[],[],[]];
	squadron.forEach(function(sh) {
	    if (sh!=this) {
		var k=this.getrange(sh);
		range[k][range[k].length]=sh;
	    }
	}.bind(this));
	return range;
    },
    range: function(open) {
        if (open) {opacity="0.3";} else {opacity="0";}
        this.sectors[2].transform(this.m).attr({fill:"yellow",stroke:"yellow",opacity:opacity});
        this.sectors[1].transform(this.m).attr({fill:"yellow",stroke:"yellow",opacity:opacity});
        this.sectors[0].transform(this.m).attr({fill:"yellow",stroke:"yellow",opacity:opacity});
    }
};

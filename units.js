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

	  


var activeunit;
var unitlist;
var pilotlist;
var squadron=[];
var active=0;
var globalid=1;
var targetunit;


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
function uncloakevent() {
    return new CustomEvent(
	"uncloakcomplete", {
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
function Unit(pilot) {
    $.extend(this,pilot);
    var ship=unitlist[this.ship];
    var sname=this.ship;
    if (!this.unique) { this.name=this.name+(globalid++); }
    this.ship=$.extend({}, ship);
    this.ship.name=sname;
    this.weapons=[];
    this.weapons.push(Laser(this,this.ship.weapon_type,this.ship.fire));
    this.islarge = (ship.islarge==true)?true:false;
    this.focus=0;
    this.iscloaked=false;
    this.target=0;
    this.istargeted=0;
    this.stress=0;
    this.evade=0;
    this.hasfired=false;
    this.shield=this.ship.shield;
    this.hull=this.ship.hull;
    this.hasmoved=false;
    this.actiondone=false;
    this.reroll=0;
    this.m=new Snap.Matrix(); 
    this.upgrades=[];
    this.collision=false;
    this.ocollision={overlap:-1,template:0};

    this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
    if (!(this.islarge)) {
	this.img=s.text(-10,10,ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction=="SCUM")?'r -1 1':'')).attr({
	    class:"xwingship",
	});
    } else {
	this.img=s.text(0,0,ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction=="SCUM")?'s 2 -2':'s 2 2')+'t -15 5').attr({
	    class:"xwingship",
	});
    }
    var w=(this.islarge)?40:20;
    this.outline = s.rect(-w,-w,2*w,2*w).attr({
        fill: "rgba(8,8,8,0.5)",
        strokeWidth: 2,
    });
    this.hashitsector=false;
    this.hasrange=false;
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
    this.evadebar=s.text(1-w,7-w,repeat('u',ship.evade))
	.transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#0f0",
	});
    this.hullbar=s.text(1-w,9-w,repeat('u',ship.hull))
	.transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#cc0",
	});
    this.shieldbar=s.text(1-w,9-w,repeat('u',ship.shield+ship.hull))
	.transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#0af",
	});
    this.gstat=s.group(this.skillbar,this.firebar,this.evadebar,this.shieldbar,this.hullbar);
    this.dial = ship.dial;
    this.actionList=ship.actionList;
    this.dialspeed = s.text(2+w,3-w,"").attr({class: "dialspeed"});
    this.dialdirection = s.text(w+8,3-w,"").attr({class: "symbols" });
    this.actionicon = s.text(w+2,-7,A["NOTHING"].key).attr({class: "symbols",strokeWidth:0});
    this.sector = s.polygon(3-w,-w,0,0,w-3,-w).attr({
	fill: this.color,
	opacity:0.5,
	strokeWidth: 0
    });
    this.range1=s.path(this.getRangeString(1,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.range2=s.path(this.getRangeString(2,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.range3=s.path(this.getRangeString(3,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.sector1=s.path(this.getSectorString(1,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.sector2=s.path(this.getSectorString(2,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.sector3=s.path(this.getSectorString(3,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none",display:"none"});
    this.sector4=this.sector1.clone().transform(MR(180,0,0));
    this.sector5=this.sector2.clone().transform(MR(180,0,0));
    this.sector6=this.sector3.clone().transform(MR(180,0,0));
    this.infoicon=[];
    var i;
    for(i=0; i<4; i++) {
	this.infoicon[i]=s.text(w-7,6-w+7*i,A[AINDEX[i+2]].key)
	    .attr({class: "xsymbols",fill:A[AINDEX[i+2]].color,strokeWidth: 0
		  });
    }
    // Order in the group is important. Latest is on top of stacked layers
    this.g=s.group(this.range3,this.range2,this.range1,this.sector6,this.sector5,this.sector4,this.sector3,this.sector2,this.sector1,this.sector,this.outline,this.dialspeed,this.dialdirection,this.actionicon,this.img,this.infoicon[0],this.infoicon[1],this.infoicon[2],this.infoicon[3],this.gstat);
    this.g.hover(
	function () { 
	    var bbox=this.g.getBBox();
	    var y=$("#playmat").scrollTop();
	    var x=$("#playmat").scrollLeft();
	    $(".info").css({left:170+bbox.x-x,top:70+bbox.y-y,display:"block"})
		.html(this.name).appendTo("body");
	    //this.summary.transform('t '+bbox.x+' '+bbox.y).attr({display:"inline"}); 
	}.bind(this),
	function() {
	    $(".info").css({display: "none"});
	    //this.summary.attr({display:"none"}); 
	}.bind(this));
    this.setdefaultclickhandler();
    this.maneuver=-1;
    this.action=-1;
}

Unit.prototype = {
    // Rolls results are deducted from probabilistic repartition...
    getattacktable: function(n) { return ATTACK[n]; },
    attackroll: function(n) {
	var i,f,h,c;
	var P=this.getattacktable(n);
	var ptot=0;
	var r=Math.random();
	var dice=function(f,h,c,b) {
	    var i;
	    var d=[];
	    for (i=0; i<f; i++) d.push("focus");
	    for (i=0; i<h; i++) d.push("hit");
	    for (i=0; i<c; i++) d.push("critical");
	    for (i=0; i<b; i++) d.push("blank");
	    return d;
	}
	for (f=0; f<=n; f++) {
	    for (h=0; h<=n-f; h++) {
		for (c=0; c<=n-f-h; c++) {
		    i=f*100+h+10*c;
		    ptot+=P[i];
		    if (ptot>r) return dice(f,h,c,n-f-h-c);
		}
	    }
	}
	return [];
    },
    getdefensetable: function(n) { return DEFENSE[n]; },
    defenseroll: function(n) {
	var i,e,f;
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=Math.random();
	if (n==0) return [];
	var dice=function(f,e,b) {
	    var i;
	    var d=[];
	    for (i=0; i<f; i++) d.push("focus");
	    for (i=0; i<e; i++) d.push("evade");
	    for (i=0; i<b; i++) d.push("blank");
	    return d;
	}
	if (typeof P=="undefined") {
	    console.log("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*10+e;
		ptot+=P[i];
		if (ptot>r) return dice(f,e,n-f-e);
	    }
	}
	return [];
    },
    setclickhandler: function(f) {
	this.img.unmousedown();
	this.img.mousedown(f);
    },
    setdefaultclickhandler: function() {
	this.img.unmousedown();
	this.img.mousedown(function() { 
	    if (this!=activeunit) {
		var old=activeunit;
		this.select();
		old.unselect();
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
    getOutlinePoints: function(m) {
	var w=(this.islarge)?40:20;
	var p1=transformPoint(m,{x:-w,y:-w});
	var p2=transformPoint(m,{x:w,y:-w});
	var p3=transformPoint(m,{x:w,y:w});
	var p4=transformPoint(m,{x:-w,y:w});	
	return [p1,p2,p3,p4];
    },
    getOutline: function(m) {
	var p=this.getOutlinePoints(m);
	return s.path("M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+" "+p[2].x+" "+p[2].y+" "+p[3].x+" "+p[3].y+" Z").attr({display: "none"})    
    },
    getRangeString: function(n,m) {
	var w=(this.islarge)?40:20;
	var p1=transformPoint(m,{x:-w,y:-100*n-w});
	var p2=transformPoint(m,{x:w,y:-100*n-w});	
	var p3=transformPoint(m,{x:100*n+w,y:-w});
	var p4=transformPoint(m,{x:100*n+w,y:w});
	var p5=transformPoint(m,{x:w,y:100*n+w});
	var p6=transformPoint(m,{x:-w,y:100*n+w});
	var p7=transformPoint(m,{x:-100*n-w,y:w});
	var p8=transformPoint(m,{x:-100*n-w,y:-w});
	return ("M "+p1.x+" "+p1.y+" L "+p2.x+" "+p2.y+" C "+(p2.x+p3.x)/2+" "+p2.y+" "+p3.x+" "+(p2.y+p3.y)/2+" "+p3.x+" "+p3.y+" L "+p4.x+" "+p4.y+" C "+p4.x+" "+(p4.y+p5.y)/2+" "+" "+(p5.x+p4.x)/2+" "+p5.y+" "+p5.x+" "+p5.y+" L "+p6.x+" "+p6.y+" C "+(p6.x+p7.x)/2+" "+p6.y+" "+p7.x+" "+(p6.y+p7.y)/2+" "+p7.x+" "+p7.y+" L "+p8.x+" "+p8.y+" C "+p8.x+" "+(p8.y+p1.y)/2+" "+(p8.x+p1.x)/2+" "+p1.y+" "+p1.x+" "+p1.y);
    },
    getSectorString: function(n,m) {
	var w=(this.islarge)?40:20;
	var p=this.getSectorPoints(n,m);
	var o=transformPoint(m,{x:0,y:0});
	return ("M "+o.x+" "+o.y+" L "+p[0].x+" "+p[0].y+" C "+(p[0].x+w/2*n)+" "+(p[0].y-w*n/2)+" "+(p[0].x+3*p[1].x)/4+" "+p[1].y+" "+p[1].x+" "+p[1].y+" L "+p[2].x+" "+p[2].y+" C "+(3*p[2].x+p[3].x)/4+" "+p[2].y+" "+(p[3].x-w/2*n)+" "+(p[3].y-w/2*n)+" "+p[3].x+" "+p[3].y+" Z");
    },
    getSectorPoints: function(n,m) {
	var w=(this.islarge)?40:20;
	var socle=Math.sqrt((w-3)*(w-3)+w*w);
	var p1 = transformPoint(m,{x:-.95*(socle+100*n)/Math.sqrt(1+w*w/(w-3)/(w-3)),
		  y:-(socle+100*n)/Math.sqrt(1+(w-3)*(w-3)/w/w)});
	var p2 = transformPoint(m,{x:-w+3,y:-w-100*n});
	var p3 = transformPoint(m,{x:w-3,y:-w-100*n});
	var p4 = transformPoint(m,{x:.95*(socle+100*n)/Math.sqrt(1+w*w/(w-3)/(w-3)),
		  y:-(socle+100*n)/Math.sqrt(1+(w-3)*(w-3)/w/w)});
	return [p1,p2,p3,p4];
    },
    setmaneuver: function(i) {
	if (this.dial[i].difficulty=="RED"&&this.stress>0) return;
	this.maneuver=i;
	enablenextphase();
	this.showdial();
    },
    nextmaneuver: function() {
	if (this.maneuver<0) { this.maneuver=0; }
        else { this.maneuver=(this.maneuver==this.dial.length-1)?0:this.maneuver+1; }
	if (this.dial[this.maneuver].difficulty=="RED"&&this.stress>0) {
	    this.nextmaneuver();
	}
	enablenextphase();
	this.showdial();
    },
    prevmaneuver: function() {
	if (this.maneuver<0) { this.maneuver=this.dial.length-1; } 
        else {this.maneuver=(this.maneuver==0)?this.dial.length-1:this.maneuver-1; }
	if (this.dial[this.maneuver].difficulty=="RED"&&this.stress>0) {
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
	this.showaction();
    },
    prevaction: function() {
	if (this.action==-1) { this.action=0; } 
	else { this.action=(this.action==0)?this.actionList.length-1:this.action-1;}
	//	var a = this.actionList[this.action];
	//	this.actionicon.attr({text:A[a].key, fill:A[a].color});
	this.showaction();
    },
    turn: function(n) {
	this.m.add(MR(n,0,0)); 
	this.show();
    },
    select: function() {
	activeunit=this;
	this.show();
	if (phase==SETUP_PHASE) { this.g.drag(this.dragmove.bind(this),
					      this.dragstart.bind(this),
					      this.dragstop.bind(this)); }
        center(this);
    },
    unselect: function() {
	if (this==activeunit) { return; }
	this.show();
	if (phase==SETUP_PHASE) { this.g.undrag(); }
    },
    getocollisions: function(mbegin,mend,path) {
	var k,i,j;
	var pathpts=[];
	var collision={overlap:-1,template:0};
	var o1=this.getOutline(mend);
	// Overlapping obstacle ? 
	for (k=0; k<ROCKS.length; k++){
	    if (this.isintersecting(ROCKS[k].getOutlinePts(),o1)) { 
		o1.remove();
		collision.overlap=k; 
		break;
	    }
	}
	// Template overlaps ? 
	for (i=0; i<=path.getTotalLength(); i++) {
	    var p=path.getPointAtLength(i);
	    pathpts.push(transformPoint(mbegin,p));
	}
	var percuted=[];
	for (j=0; j<pathpts.length; j++) {
	    for (k=0; k<ROCKS.length; k++) {
		if (k!=collision.overlap&&percuted.indexOf(k)==-1) { // Do not count overlapped obstacle twice
		    var o2=ROCKS[k].getOutlinePts();
		    for(i=0; i<o2.length; i++) {
			var dx=(o2[i].x-pathpts[j].x);
			var dy=(o2[i].y-pathpts[j].y);
			if (dx*dx+dy*dy<=100) {  percuted.push(k); collision.template++; break } 
		    }
		}
	    }
	}	   

	o1.remove();
	return collision;
    },
    iscollidingunit: function(m,sh) {
	var o1=this.getOutline(m);
	var o2=sh.getOutline(sh.m);
	var inter=Snap.path.intersection(o1, o2);
	var collision=(inter.length>0);
	// If unit is large, add another check
	if (this.islarge) { collision=collision||this.isinoutline(o1,sh,sh.m); }
	if (sh.islarge)  { collision = collision||sh.isinoutline(o2,this,m); }
	o1.remove();
	o2.remove();
	return collision;
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
		    return true;
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
	var o1=this.getOutline(m).attr({fill:this.color,opacity:0.5,display:"block"});
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
	if (this.stress>0||this.collision>0||this.ocollision.template>0||this.ocollision.overlap>-1) {
	    this.actionList=["NOTHING"];
	} else {
	    this.actionList=this.ship.actionList.slice(0);
	    this.actionList.push("NOTHING");
	}
    },
    addevade: function() { this.evade++; this.action=-1;this.show();
			   document.dispatchEvent(actionevent());
			   return true;
			 },
    addfocus: function() { 
	this.focus++; this.action=-1; this.show();	    
	document.dispatchEvent(actionevent());
	return true;
    },
    addstress: function() {
	this.stress++;
	this.show();
    },
    resolvedamage: function() {
	var h=$(".hitreddice").length;
	var c=$(".criticalreddice").length;
	var e=$(".evadegreendice").length;
	var d=c+h-e;
	var he=h-e;
	this.hasdamaged=true;
	if (he>0) { h=he; e=0; } else { h=0; e=-he; }
	var ce=c-e;
	var ts=targetunit.shield;
	if (ce>0) { c=ce; e=0; } else { c=0; e=-ce; }
	if (c+h>0) {
	    targetunit.resolvehit(h);
	    targetunit.resolvecritical(c);
	    // TODO: should be removed depending on skill
	    if (targetunit.hull<=0) {
		var i;
		for (i=0; i<squadron.length; i++) {
		    if (squadron[i]==targetunit) {
			squadron.splice(i,1); break;
		    }
		}
		targetunit.m=MT(-30,-30);
		targetunit.show();
	    }
	} else { console.log("no damage"); }
	this.cleancombat();
    },
    cleancombat: function() {
	window.location="#";
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	targetunit.show();
	$("#"+this.ship.firesnd).trigger("play");	
    },
    resolvefocus: function() { this.focus--; },
    resolveactionmove: function(moves,cleanup) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    for (i=0; i<moves.length; i++) this.pos[i].ol.remove();
	    this.m=m;
	    this.show();
	    f(this,k);
	}.bind(this);
	log(this.name+" resolveactionmove");
	for (i=0; i<moves.length; i++) {
	    this.pos[i]=this.getpossibleoutline(moves[i]);
	    if (this.pos[i].b) {
		(function(k) {
		    this.pos[k].ol.click(function() 
					 { resolve(moves[k],k,cleanup); });}.bind(this)
		 )(i);
	    }
	    ready=ready||this.pos[i].b;
	}
	if (!ready) resolve(this.m,cleanup);
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

	for (i=0; i<units.length; i++) {
	    units[i].outline.attr({fill:"rgba(255,100,100,0.8)"});
	    (function(k) { units[k].setclickhandler(function() { resolve(k);}); })(i);
	}
    },
    resolveboost: function() {
	this.resolveactionmove(
	    [this.getpathmatrix(this.m.clone(),"F1"),
	     this.getpathmatrix(this.m.clone(),"BL1"),
	     this.getpathmatrix(this.m.clone(),"BR1")],
	    function (t,k) { 
		t.action=-1; t.show(); document.dispatchEvent(actionevent()); 
	    });
	return true;
    },
    resolveuncloak: function() {
	var m0=this.getpathmatrix(this.m.clone().add(MR(90,0,0)).add(MT(0,(this.islarge?-20:0))),"F2").add(MR(-90,0,0)).add(MT(0,-20));
	var m1=this.getpathmatrix(this.m.clone().add(MR(-90,0,0)).add(MT(0,(this.islarge?-20:0))),"F2")
	this.resolveactionmove(
	    [m0.clone().add(MT(0,0)),
	     m0.clone().add(MT(0,20)),
	     m0.clone().add(MT(0,40)),
	     m1.clone().add(MT(0,0)),
	     m1.clone().add(MT(0,20)),
	     m1.clone().add(MT(0,40))],
	    function (t,k) {
		t.ship.evade-=2; t.iscloaked=false;t.show(); 
		document.dispatch(uncloakevent()); 
	    });
	return true;
    },
    resolveroll: function() {
	var m0=this.getpathmatrix(this.m.clone().add(MR(90,0,0)).add(MT(0,(this.islarge?-20:0))),"F1").add(MR(-90,0,0)).add(MT(0,-20));
	var m1=this.getpathmatrix(this.m.clone().add(MR(-90,0,0)).add(MT(0,(this.islarge?-20:0))),"F1").add(MR(90,0,0)).add(MT(0,-20));
	log("preparing roll for "+this.name);
	this.resolveactionmove(
	    [m0.clone().add(MT(0,0)),
	     m0.clone().add(MT(0,20)),
	     m0.clone().add(MT(0,40)),
	     m1.clone().add(MT(0,0)),
	     m1.clone().add(MT(0,20)),
	     m1.clone().add(MT(0,40))],
	    function(t,k) {
		t.action=-1;
		t.show();
		document.dispatchEvent(actionevent());
	    });
	return true;
    },
    resolvetarget: function(k) {
	var p=[];
	var i;
	this.istargeting=true;
	for (i=0; i<squadron.length; i++) {
	    if (squadron[i].faction!=this.faction
		&&this.getrange(squadron[i])<=3) {
		    p.push(squadron[i]);
	    }
	}
	if (p.length>0) {
	    this.resolveactionselection(p,function(k) { 
		this.target++;
		this.targeting=p[k];
		p[k].istargeted++;
		p[k].show();
		this.action=-1;
		this.istargeting=false;
		this.show();
		document.dispatchEvent(actionevent());  
	    }.bind(this));
	    return true;
	} else { console.log("no targeting!"); return false; }
    },
    resolvecloak: function() {
	this.iscloaked=true;
	this.ship.evade+=2;
	document.dispatchEvent(actionevent());
	return true;
    },
    resolveaction: function() {
	var a;
	if (this.action==-1) a=this.actionList[this.actionList.length-1];
	else a = this.actionList[this.action];
	if (a=="BOOST") { return this.resolveboost(); }
	else if (a=="ROLL") {return this.resolveroll(); }
	else if (a=="CLOAK") { return this.resolvecloak();}
	else if (a=="FOCUS") {return this.addfocus(); }
	else if (a=="EVADE")  { return this.addevade(); }
	else if (a=="TARGET") { return this.resolvetarget(); }
	else /* "NOTHING"*/ { document.dispatchEvent(actionevent()); }
	this.action=-1;
	return true;
    },
    evaluatetohit: function(w,sh) {
	var r=this.gethitrange(w,sh);
	console.log("EVALUATETOHIT "+sh.name+" r"+r+" "+this.hasfired);
	if (sh!=this&&r<=3&&r>0&&!this.hasfired) {
	    var attack=this.getattackstrength(w,sh);
	    var defense=sh.getdefensestrength(w,this);
	    return tohitproba(this,sh,
			      this.getattacktable(attack),
			      sh.getdefensetable(defense),
			      this.weapons[w].attack,
			      sh.ship.evade);
	} else return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    },
    canfire: function() {
        var r=this.gethitrangeallunits();
	var b= (!this.hasfired&&(r[1].length>0||r[2].length>0||r[3].length>0)&&!this.iscloaked&&this.ocollision.overlap==-1);
	console.log("[canfire]"+this.name+" "+b+"="+this.hasfired+" r=["+r[1].length+", "+r[2].length+", "+r[3].length+"] "+this.iscloaked)
        return b;
    },
    getattackstrength: function(i,sh) {
	var att=this.weapons[i].attack;
	return att+this.weapons[i].getattackbonus(sh);
    },
    getdefensestrength: function(i,sh) {
	var def=this.ship.evade;
	return def+sh.weapons[i].getdefensebonus(this);
    },
    resolvefire: function(w) {
	var r=this.gethitrange(w,targetunit);
	log("<b style='color:"+this.color+"'>"+this.name+"</b> attacks <b style='color:"+targetunit.color+"'>"+targetunit.name+"</b> with "+this.weapons[w].name);
	var attack=this.getattackstrength(w,targetunit);
	var defense=targetunit.getdefensestrength(w,this);
	this.hasfired=true;
	this.hasdamaged=false;
	document.dispatchEvent(fireevent(this,this.attackroll(attack),targetunit,targetunit.defenseroll(defense)));
    },
    getmatrixwithmove: function(path, len) {
	var lenC = path.getTotalLength();
	var m = this.m.clone();
	if (this.islarge) {
	    if (len<=20) m.add(MT(0,-len));
	    else {
		var over=(len>lenC+20)?len-lenC-20:0;
		var movePoint = path.getPointAtLength( len-over-20 );
		m.add(MT(movePoint.x,-20+movePoint.y)).add(MR(movePoint.alpha-90,0,0)).add(MT(0,-over));
	    }
	} else {
	    var movePoint = path.getPointAtLength( len );
	    m.add(MT(movePoint.x,movePoint.y)).add(MR(movePoint.alpha-90,0,0));
	}
	return m
    },
    handledifficulty: function(difficulty) {
	if (difficulty=="RED") {
	    this.addstress();
	} else if (difficulty=="GREEN" && this.stress>0) {
	    this.stress--;
	}
    },
    resolvemaneuver: function() {
	// -1: No maneuver
	if (this.maneuver<0) return;
	var dial=this.dial[this.maneuver].move;
	var difficulty=this.dial[this.maneuver].difficulty;
	// Move = forward 0. No movement. 
	if (dial=="F0") {
	    this.handledifficulty(difficulty);
	    this.show();
	    document.dispatchEvent(maneuverevent());
	    return;
	}
	var path =  P[dial].path.transform(this.m).attr({
	    display: "none"});
	path.appendTo(s);   //attr({fill:"#FFF"});//.attr({display:"none"});
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
	if (this.islarge) lenC+=40;
	m = this.getmatrixwithmove(path, lenC);
	this.ocollision=this.getocollisions(this.m,m,P[dial].path);
	if (this.ocollision.overlap>-1) { log(this.name+" overlaps obstacle: cannot perform action, cannot attack"); }
	if (this.ocollision.template>0) { log(this.name+" template overlaps obstacle: cannot perform action"); }

	if (this.iscollidinganyunit(m)) { 
	    log(this.name+"  collides with "+this.collides.name);
	    this.collision=true;
	    while (lenC>0 && this.iscollidinganyunit(m)) {
		m=this.getmatrixwithmove(path,lenC);
		lenC=lenC-1;
	    }
	} 
	// Animate movement
	if (lenC>0) {
	    $("#"+this.ship.flysnd).trigger("play");

	    Snap.animate(0, lenC, function( value ) {
		m = this.getmatrixwithmove(path,value);
		this.g.transform(m);
	    }.bind(this), TIMEANIM*lenC/200,mina.linear, function(){
		if (!this.collision) { 
		    this.m=m; 
		    // Special handling of K turns: half turn at end of movement. Straight line if collision.
		    if (dial=="K1"||dial=="K2"||dial=="K3"||dial=="K4"||dial=="K5"||dial=="SR3"||dial=="SL3") { this.m.add(MR(180,0,0))} } 
		else { this.m=m; }
		this.handledifficulty(difficulty);
		console.log("End MANEUVER");
		this.show();
		path.remove();
		if (this.ocollision.overlap>-1||this.ocollision.template>0) this.resolveocollision();
		document.dispatchEvent(maneuverevent());
	    }.bind(this));
	} else { 
	    log(this.name+" cannot move");
	    this.handledifficulty(difficulty);
	    this.show();
	    path.remove();
	    document.dispatchEvent(maneuverevent());
	}
    },
    showaction: function() {
	if (this==activeunit) $("#actionbutton").prop("disabled",((this.actiondone)||(!this.hasmoved)||(phase!=ACTIVATION_PHASE)||(this.skill!=skillturn)));
	if (this.action==-1) {
	    this.actionicon.attr({text:""});
	    if (this==activeunit) $("#action").text("");
	} else {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	    if (this==activeunit) {
		$("#action").text(A[a].key);
		$("#action").css("color",A[a].color);
	    }
	}
    },
    showinfo: function() {
	var i=0,j;
	if (this.focus>0) {
	    this.infoicon[i++].attr({text:A.FOCUS.key,fill:A.FOCUS.color});}
	if (this.evade>0) {
	    this.infoicon[i++].attr({text:A.EVADE.key,fill:A.EVADE.color});}
	if (this.iscloaked==true) {
	    this.infoicon[i++].attr({text:A.CLOAK.key,fill:A.CLOAK.color});}
	if (this.target>0) {
	    this.infoicon[i++].attr({text:A.TARGET.key,fill:A.TARGET.color});}
	if (this.istargeted>0) {
	    this.infoicon[i++].attr({text:A.ISTARGETED.key,fill:A.ISTARGETED.color});}
	if (this.stress>0) {
	    this.infoicon[i++].attr({text:A.STRESS.key,fill:A.STRESS.color});}
	for (j=i; j<4; j++) {
	    this.infoicon[i++].attr({text:""});}	    
    },
    showoutline: function() {
        this.outline.attr({ stroke: ((activeunit==this)?this.color:halftone(this.color)) }); 
    }, 
    showdial: function() {
	if (activeunit==this) 
	    $("#manbutton").prop("disabled",this.hasmoved||!(phase==PLANNING_PHASE||phase==ACTIVATION_PHASE));
	var m=[],i,j,d,speed=[];
	for (i=0; i<=5; i++) {
	    m[i]=[];speed[i]="";
	    for (j=0; j<=5; j++) m[i][j]="<div></div>";
	}
	for (i=0; i<this.dial.length; i++) {
	    d=this.dial[i];
	    var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
	    m[cx][cy]="<div onclick='activeunit.setmaneuver("+i
		+")' class='symbols "+d.difficulty+" ";
	    m[cx][cy]+=((i==this.maneuver)?"selected'":"'")+">"
		+P[d.move].key+"</div>";
	    speed[cx]=P[d.move].speed;
	}
	var str="";
	for (i=5; i>=0; i--) {
	    str+="<div><div>"+speed[i]+"</div>";
	    for (j=0; j<=5; j++) str+=m[i][j];
	    str+="</div>\n";
	}
	$("#maneuverdial").empty();
	$("#maneuverdial").html(str);
	if (this.stress>0) $("button RED").prop("disabled",true);
	if (this.maneuver==-1) {
            this.dialspeed.attr({text:""});
            this.dialdirection.attr({text:""});
	    return;
	};
	d = this.dial[this.maneuver];
	var c  =C[d.difficulty];
	if (!(activeunit==this)) {
	    c = halftone(c);
	}
        this.dialspeed.attr({text:P[d.move].speed,fill:c});
        this.dialdirection.attr({text:P[d.move].key,fill:c});
    },
    toString: function() {
	var i;
	for (i=0; i<squadron.length; i++) if (this==squadron[i]) break;
	if (i==squadron.length) return "";
	str="<div><div style='font-weight:bold'>"+this.name+"</div></div>";
	str+="<div class='vertical' style='font-size:smaller'><div><code class='"+this.faction+"'></code>"+this.ship.name+"</div></div>";
	str+="<hr class='vertical'></hr>";
	str+="<div><div>";
	str+="<p class='statskill'>"+this.skill+"</p>";
	str+="<p class='statfire'>"+this.weapons[0].attack+"</p>";
	str+="<p class='statevade'>"+this.ship.evade+"</p>";
	str+="<p class='stathull'>"+this.hull+"</p>";
	str+="<p class='statshield'>"+this.shield+"</p>";
	str+="</div></div>";
	str+="<div class='horizontal'><div>"+this.points+"</div></div>";
	var text=PILOT_translation.english[this.name];
	if (typeof text=="undefined") text=""; 
	str+="<div class='vertical' style='height:8em;'><div style='text-align:justify'><br/>"+text+"</div></div>";
	str+="<div><div>";
	if (this.focus>0) str+="<p title='"+this.focus+" focus token' onclick='usefocus("+i+")' class='focustoken'></p>";
	if (this.evade>0) str+="<p title='"+this.evade+" evade token' onclick='useevade("+i+")' class='evadetoken'></p>"; 
	if (this.target>0) str+="<p title='targeting "+this.targeting.name+"' onclick='usetarget("+i+")' class='targettoken'></p>";
	if (this.iscloaked) str+="<p class='cloaktoken'></p>";
	if (this.stress>0) str+="<p title='"+this.stress+" stress token' onclick='usestress("+i+")' class='stresstoken'></p>";
	str+="</div></div><div class='vertical'><div>";
	for (i=0; i<this.upgrades.length;i++) {
	    str+="<hr><p class='"+this.upgrades[i].type+"'></p><p href='#' style='font-size:smaller'>"+this.upgrades[i].name+"</p>";
	}
	str+="</div></div>";
	return str;
   },
    show: function() {
	var i;
	this.g.transform(this.m);
	this.g.appendTo(s); // Put to front
	this.skillbar.attr({text:repeat('u',this.skill)});
	this.firebar.attr({text:repeat('u',this.weapons[0].attack)});
	this.evadebar.attr({text:repeat('u',this.ship.evade)});
	this.hullbar.attr({text:repeat('u',this.hull)});
	this.shieldbar.attr({text:repeat('u',this.shield+this.hull)});
	this.showoutline();
	this.showaction();
	this.showinfo();
	if (activeunit!=this) return;

	this.showdial();
	$("#desc").html(""+this);
	$("#primary").prop("disabled",this.hasdamaged||(!this.canfire()));
    },
    showhitsector: function(b) {
        var opacity=(b)?"inline":"none";
	this.hashitsector=b;
	if (this.weapons[0].type=="Turret") {
	    this.showrange(b);
	} else {
	    this.sector1.attr({display:opacity});
	    this.sector2.attr({display:opacity});
	    this.sector3.attr({display:opacity});
	    if (this.weapons[0].type=="bilaser") {
		this.sector4.attr({display:opacity});
		this.sector5.attr({display:opacity});
		this.sector6.attr({display:opacity});
	    }
	}
	if (b) {
	    var i;
	    for (i=0; i<squadron.length; i++) {
		if (squadron[i]!=this) squadron[i].g.appendTo(s);
	    }
	}
    },
    showrange: function(b) {
        var opacity=(b)?"inline":"none";
	this.hasrange=b;
	this.range1.attr({display:opacity});
	this.range2.attr({display:opacity});
	this.range3.attr({display:opacity});
	if (b) {
	    var i;
	    for (i=0; i<squadron.length; i++) {
		if (squadron[i]!=this) squadron[i].g.appendTo(s);
	    }
	}
    },
    togglehitsector: function() {
	this.hashitsector=!this.hashitsector; 
	this.showhitsector(this.hashitsector);
    },
    togglerange: function() {
	this.hasrange=!this.hasrange;
	this.showrange(this.hasrange);
    },
    isintersecting: function(apts,path) {
	var i; 
	var inter=false;
	for (i=0; i<apts.length; i++)
	    inter=inter||Snap.path.isPointInside(path,apts[i].x,apts[i].y);
	return inter;
    },
    isinsector: function(m,n,sh) {
	var op2=sh.getOutlinePoints(sh.m);
	var o1=this.getSectorString(n,m);
	// Is outline points inside sector ?
	//s.path(o1).attr({fill:this.color,stroke:this.color,opacity:0.3,pointerEvents:"none"});
	if (this.isintersecting(op2,o1)) return true;
	var o2=sh.getOutline(sh.m);
	var op1=this.getSectorPoints(n,m);
	// or is extreme sector points inside outline ?
	if (this.isintersecting(op1,o2)) {
	    o2.remove();
	    return true; 
	}
	o2.remove();
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
	return this.isintersecting(sh.getOutlinePoints(m),o1);
    },
    checkcollision: function(sh) {
	return ((this.collision&&this.collides==sh)||(sh.collision&&sh.collides==this));
    },
    resolveocollision: function() {
	var i;
	var n=this.ocollision.template;
	if (this.ocollision.overlap>-1) n++;
	log(this.name+" hit "+n+" obstacles");
	for (i=0; i<n; i++) {
	    var r=Math.floor(Math.random()*7);
	    var roll=FACE[ATTACKDICE[r]];
	    if (roll=="hit") this.resolvehit(1);
	    else if (roll=="critical") this.resolvecritical(1);
	}
    },
    resolvehit: function(n) {
	if (n==0) return;
	if (this.shield>n) {
	    log(this.name+" lost "+n+" shield");
	    this.shield=this.shield-n
	} else {
	    var s=n-this.shield;
	    this.shield=0;
	    log(this.name+" lost all shields");
	    this.applydamage(n);
	}
    },
    resolvecritical: function(n) {
	if (n==0) return;
	if (this.shield>n) {
	    log(this.name+" lost "+n+" shield");
	    this.shield=this.shield-n
	} else {
	    var s=n-this.shield;
	    this.shield=0;
	    log(this.name+" lost all shields");
	    this.applycritical(n);
	}
    },
    applydamage: function(n) {
	this.hull=this.hull-n;
    },
    applycritical: function(n) {
	this.applydamage(n); 
    },
    gethitrange: function(w,sh) {
	var i;
	if (sh.faction==this.faction) return 0;
 	if (this.checkcollision(sh)) return 0;
	if (this.weapons[w].canfire(sh)==false) return 0;
	console.log("["+this.weapons[w].name+"] in range?");
	var gr=this.weapons[w].getrange(sh);
	console.log("["+this.name+"] "+this.weapons[w].name+" gethitrange of "+sh.name+":"+gr);
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
		    if (r>0) {
			for (j=0; j<range[r].length; j++) if (range[r][j].unit==i) break;
			console.log("["+this.name+"] can fire "+sh.name+"/"+this.weapons[k].name);
			if (j<range[r].length) range[r][j].wp.push(k);
			else range[r].push({unit:i,wp:[k]});
		    }
		}
	};
	return range;
    },
    getrange: function(sh) {
	var ro=this.getOutlinePoints(this.m);
	var rsh = sh.getOutlinePoints(sh.m);
	return getoutlinerange(rsh,ro);
    },
    getrangeallunits: function() {
	var ro=this.getOutlinePoints(this.m);
	var range=[[],[],[],[],[]],i;
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if (sh!=this) {
		var k=this.getrange(sh);
		range[k].push({unit:sh});
	    }
	};
	return range;
    }
};

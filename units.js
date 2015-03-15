var s;
var GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0";
var HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880";
var TIMEANIM=1000;
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
function Unit(pilot) {
    $.extend(this,pilot);
    var ship=unitlist[this.ship];
    var sname=this.ship;
    if (!this.unique) { this.name=this.name+(globalid++); }
    this.ship=ship;
    this.ship.name=sname;
    this.islarge = (ship.islarge==true)?true:false;
    this.focus=0;
    this.target=0;
    this.istargeted=0;
    this.stress=0;
    this.evade=0;
    this.hasfired=false;
    this.showtarget=false;
    this.shield=this.ship.shield;
    this.hull=this.ship.hull;
    this.hasmoved=false;
    this.actiondone=false;
    this.m = new Snap.Matrix();

    this.color=(ship.faction=="REBEL")?RED:GREEN;
    if (!(this.islarge)) {
	this.img=s.text(-10,10,ship.code).transform('r -90 0 0 '+(ship.faction=="EMPIRE"?'r -1 1':'')).attr({
	    class:"xwingship",
	});
    } else {
	this.img=s.text(0,0,ship.code).transform('r -90 0 0 '+(ship.faction=="EMPIRE"?'s 2 -2':'s 2 2')+'t -15 5').attr({
	    class:"xwingship",
	});
    }
    var w=(this.islarge)?40:20;
    this.outline = s.rect(-w,-w,2*w,2*w).attr({
        fill: "rgba(8,8,8,0.5)",
        strokeWidth: 2,
    });
    this.hashitsector=false;
    this.skillbar=s.text(1-w,3-w,repeat('u',this.skill))
	.transform('r -90 0 0').attr({
	    class: "xsymbols",
	    fill:"#fa0",
	});
    this.firebar=s.text(1-w,5-w,repeat('u',ship.fire))
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
    this.dialspeed = s.text(2+w,3-w,"").attr({class: "dialspeed"	});
    this.dialdirection = s.text(w+8,3-w,"").attr({class: "symbols" });
    this.actionicon = s.text(w+2,-7,A["NOTHING"].key).attr({class: "symbols",strokeWidth:0});
    this.sector = s.polygon(3-w,-w,0,0,w-3,-w).attr({
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
	this.infoicon[i]=s.text(w-7,6-w+7*i,A[AINDEX[i+2]].key)
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
    getOutline: function(m) {
	var w=(this.islarge)?40:20;
	var p1=transformPoint(m,{x:-w,y:-w});
	var p2=transformPoint(m,{x:w,y:-w});
	var p3=transformPoint(m,{x:w,y:w});
	var p4=transformPoint(m,{x:-w,y:w});	
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
	var w=(this.islarge)?40:20;
	var p1=transformPoint(m,{x:-w,y:-w});
	var p2=transformPoint(m,{x:w,y:-w});
	var p3=transformPoint(m,{x:w,y:w});
	var p4=transformPoint(m,{x:-w,y:w});	
	return [p1,p2,p3,p4];
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
    iscollidingunit: function(m,sh) {
	var o1=this.getOutline(m);
	var o2=sh.getOutline(sh.m);
	var inter=Snap.path.intersection(o1, o2);
	var collision=(inter.length>0);
	console.log("  testing intersection with "+sh.name+" "+collision);
	// If unit is large, add another check
	if (this.islarge) { collision=collision||this.isinoutline(o1,sh,sh.m); 
			    console.log("  testing collision with "+sh.name+":"+collision); }
	if (sh.islarge)  { collision = collision||sh.isinoutline(o2,this,m); 
			   console.log("  testing collision with large "+sh.name+":"+collision);  }
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
    resolvedamage: function() {
	console.log("Resolve damage "+activeunit.name+" vs "+targetunit.name);
	var h=$(".hitreddice").length;
	var c=$(".criticalreddice").length;
	var e=$(".evadegreendice").length;
	var d=c+h-e;
	var he=h-e;
	this.hasdamaged=true;
	console.log("1- evades:"+h+"+"+c+"/"+e);
	if (he>0) { h=he; e=0; } else { h=0; e=-he; }
	var ce=c-e;
	console.log("1- evades:"+h+"+"+c+"/"+e);
	if (ce>0) { c=ce; e=0; } else { c=0; e=-ce; }
	if (c+h>0) {
	    console.log("2- shields:"+h+"+"+c+"/"+targetunit.shield);	    
	    var hs=h-targetunit.shield;
	    if (hs>0) { h=hs; targetunit.shield=0; } else { h=0; targetunit.shield=-hs;}
	    console.log("2- shields:"+h+"+"+c+"/"+targetunit.shield);	    
	    var cs=c-targetunit.shield;
	    if (cs>0) { c=cs; targetunit.shield=0; } else { c=0; targetunit.shield=-cs;}
	    if (c+h>0) {
		console.log("3- hull:"+h+"+"+c+"/"+targetunit.hull);	    
		targetunit.hull=targetunit.hull-c-h;
		console.log(targetunit.name+" takes "+h+" hits and "+c+" critical");
		// TODO: should be removed depending on skill
		if (targetunit.hull<=0) {
		    var i;
		    console.log(targetunit.name+" exploded!");
		    for (i=0; i<squadron.length; i++) {
			if (squadron[i]==targetunit) {
			    squadron.splice(i,1); break;
			}
		    }
		    for (i=0; i<squadron.length; i++) {
			console.log("- "+squadron[i].name);
		    }
		    targetunit.m=MT(-30,-30);
		    targetunit.show();
		}
	    }
	} else { console.log("no damage"); }
	$(".hitreddice").remove();
	$(".criticalreddice").remove();
	$(".focusreddice").remove();
	$(".blankreddice").remove();
	$(".focusgreendice").remove();
	$(".evadegreendice").remove();
	$(".blankgreendice").remove();
	targetunit.show();
	console.log("triggering "+this.ship.firesnd);
	$("#"+this.ship.firesnd).trigger("play");

	console.log("End resolve damage");
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
	var m0=this.getpathmatrix(this.m.clone().add(MR(90,0,0)).add(MT(0,(this.islarge?-20:0))),"F1")
	    .add(MR(-90,0,0)).add(MT(0,-20));
	var m1=this.getpathmatrix(this.m.clone().add(MR(-90,0,0)).add(MT(0,(this.islarge?-20:0))),"F1")
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
	    if (this.pos[1].b) { this.pos[1].ol.click(function() {resolve(1);}); }
	    if (this.pos[2].b) { this.pos[2].ol.click(function() {resolve(2);}); }
	    if (this.pos[3].b) { this.pos[3].ol.click(function() {resolve(3);}); }
	    if (this.pos[4].b) { this.pos[4].ol.click(function() {resolve(4);}); }
	    if (this.pos[5].b) { this.pos[5].ol.click(function() {resolve(5);}); }
	}
	return true;
    },
    resolvetarget: function(k) {
 	targetunit=squadron[k];
	if (this!=targetunit
	    &&this.getrange(targetunit)<=3
	    &&this.ship.faction!=targetunit.ship.faction) {
	    this.target++;
	    this.targeting=targetunit;
	    targetunit.istargeted++;
	    targetunit.show();
	    this.action=-1;
	    this.istargeting=false;
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
	if (a=="TARGET") { this.istargeting=true; inrange(); window.location="#modal"; return true; }
	if (a=="NOTHING") { document.dispatchEvent(actionevent()); }
	this.action=-1;
	return true;
    },
    canfire: function() {
	var r=this.gethitrangeallunits();
	return (!this.hasfired&&(r[1].length>0||r[2].length>0||r[3].length>0));
    },
    evaluatetohit: function(sh) {
	var p=[];
	var k=[];
	var f,h,c,fd,e,i,j;
	var tot=0,mean=0,meanc=0;
	var A;
	var r=this.gethitrange(sh);
	if (sh!=this&&r<=3&&!this.hasfired) {
	    var attack=this.ship.fire;
	    var defense=sh.ship.evade;
	    if (r==1) { attack++; }
	    if (r==3) { defense++; }
	    
	    for (h=0; h<=attack; h++) {
		for (c=0; c<=attack-h; c++) {
		    i=h+10*c;
		    p[i]=0;
		}
	    }
	    if (this.targeting==sh) {
		if (this.focus>0) 
		    A=attackreroll(attack,attack,ATTACK[attack]);
		else A=attackrerollwithfocus(attack,attack,ATTACK[attack]);
	    } else A=ATTACK[attack];
	    for (j=0; j<10; j++) { k[j]=0; }
	    for (f=0; f<=attack; f++) {
		for (h=0; h<=attack-f; h++) {
		    for (c=0; c<=attack-h-f; c++) {
			var a=A[100*f+h+10*c]; // attack index
			for (fd=0; fd<=defense; fd++) {
			    for (e=0; e<=defense-fd; e++) {
				var d=DEFENSE[defense][10*fd+e]; // defense index
				var evade=e;
				var hit=h;
				var i=0;
				if (sh.evade>0) { evade+=1; }
				if (sh.focus>0) { evade+=fd; }
				if (this.focus>0) { hit+=f; }
				if (hit-evade>0) { i = hit-evade; evade=0; } 
				else { evade=evade-hit; }
				if (c-evade>0) { i+= 10*(c-evade); }
				p[i]+=a*d;
			    }
			}
		    }
		}
	    }
	    for (h=0; h<=attack; h++) {
		for (c=0; c<=attack-h; c++) {
		    i=h+10*c;
		    if (c+h>0) { tot+=p[i]; }
		    mean+=(h)*p[i];
		    meanc+=c*p[i];
		    for (j=1; j<=c+h; j++) {
			k[j]+=p[i];
		    }
		}
	    }
	    console.log("chance to hit:"+tot+" avg dmg:"+(mean/tot)+" avg crt:"+(meanc/tot));
	    return {proba:p, tohit:Math.round(tot*10000)/100, meanhit:Math.round(mean * 100/tot) / 100,meancritical:Math.round(meanc/tot*100)/100,tokill:k} ;
	}
    },
    resolvefire: function() {
	console.log("resolving fire for "+this.name);
	var r=this.gethitrange(targetunit);
	if (targetunit!=this&&r<=3&&!this.hasfired) {
	    var attack=this.ship.fire;
	    var defense=targetunit.ship.evade;
	    if (r==1) { attack++; }
	    if (r==3) { defense++; }
	    this.hasfired=true;
	    this.hasdamaged=false;
	    console.log(this.name+" fired on "+targetunit.name);
	    console.log(attack+" vs "+defense);
	    document.dispatchEvent(fireevent(this,attackroll(attack),targetunit,defenseroll(defense)));
	}
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
    handlestress: function(difficulty) {
	if (difficulty=="RED") {
	    this.stress++;
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
	    this.handlestress(difficulty);
	    this.show();
	    document.dispatchEvent(maneuverevent());
	    return;
	}
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
	if (this.islarge) lenC+=40;
	m = this.getmatrixwithmove(path, lenC);
	console.log("Starting MANEUVER for "+this.name);
	console.log("  path of length "+lenC);
	if (this.iscollidinganyunit(m)) { 
	    console.log("  has collision with "+this.collides.name);
	    this.collision=true;
	} else { 
	    this.collision=false; 
	    console.log("  has no collision"); 
	}
	// Go back until we find a position 
	while (this.collision==true &&lenC>0 && this.iscollidinganyunit(m)) {
	    m=this.getmatrixwithmove(path,lenC);
	    lenC=lenC-1;
	    console.log("with "+this.collides.name);
	}
	if (lenC>0) {
	    $("#"+this.ship.flysnd).trigger("play");

	    Snap.animate(0, lenC, function( value ) {
		m = this.getmatrixwithmove(path,value);
		this.g.transform(m);
	    }.bind(this), TIMEANIM*lenC/200,mina.linear, function(){
		if (!this.collision) { 
		    this.m=m; 
		    // Special handling of K turns: half turn at end of movement. Straight line if collision.
		    if (dial=="K1"||dial=="K2"||dial=="K3"||dial=="K4"||dial=="K5") { this.m.add(MR(180,0,0))} } 
		else { this.m=m; }
		this.handlestress(difficulty);
		console.log("End MANEUVER");
		this.show();
		document.dispatchEvent(maneuverevent());
	    }.bind(this));
	} else { 
	    console.log(this.name+" cannot move");
	    this.handlestress(difficulty);
	    console.log("End MANEUVER");
	    this.show();
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
	    $("#manbutton").prop("disabled",this.hasmoved||(phase!=PLANNING_PHASE));
	if (this.maneuver==-1) {
            this.dialspeed.attr({text:""});
            this.dialdirection.attr({text:""});
	    if (activeunit==this) {
		$("#dialspeed").text("");
		$("#dialdirection").text("");
	    }
	    return;
	};
	var d = this.dial[this.maneuver];
	var c  =C[d.difficulty];
	if (!(activeunit==this)) { c = halftone(c); }
	else {
	    $("#dialspeed").text(P[d.move].speed);
	    $("#dialspeed").css("color",c);
	    $("#dialdirection").text(P[d.move].key);
	    $("#dialdirection").css("color",c);
	}
        this.dialspeed.attr({text:P[d.move].speed,fill:c});
        this.dialdirection.attr({text:P[d.move].key,fill:c});
    },
    show: function() {
	var i;
	this.g.transform(this.m);
	this.g.appendTo(s); // Put to front
	this.skillbar.attr({text:repeat('u',this.skill)});
	this.firebar.attr({text:repeat('u',this.ship.fire)});
	this.evadebar.attr({text:repeat('u',this.ship.evade)});
	this.hullbar.attr({text:repeat('u',this.hull)});
	this.shieldbar.attr({text:repeat('u',this.shield+this.hull)});
	this.showoutline();
	this.showaction();
	this.showdial();
	this.showinfo();
	if (activeunit!=this) return;

	$("#pilot").html(this.name);
	$("#unit").text(this.ship.name);
	var text=PILOT_translation.english[this.name];
	if (typeof text=="undefined") { text=""; }
	$("#pilot-text").html(text);
	$("#upgrades").empty();
	for (i=0; i<this.upgrades.length;i++) {
	    $("#upgrades").append("<p class='"+this.upgrades[i]+"'></p>");
	}
	$("#skill").html(this.skill);
	$("#fire").html(this.ship.fire);
	$("#evade").html(this.ship.evade);
	$("#hull").html(this.hull);
	$("#shield").html(this.shield);
	$("#actionlist").empty();
	if (this.focus>0) { 
	    $("#actionlist").append("<b title='"+this.focus+" focus token' class='focustoken'></b>"); }
	if (this.evade>0) { 
	    $("#actionlist").append("<b title='"+this.evade+" evade token' class='evadetoken'></b>"); }
	if (this.target>0) { 
	    $("#actionlist").append("<b title='targeting "+this.targeting.name+"' class='targettoken'></b>"); }
	if (this.stress>0) { 
	    $("#actionlist").append("<b title='"+this.stress+" stress token' class='stresstoken'></b>"); }
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
	var o2=sh.getOutlinePoints(sh.m);
	if (Snap.path.isPointInside(o1, o2[0].x,o2[0].y)
	    ||Snap.path.isPointInside(o1, o2[1].x,o2[1].y)
	    ||Snap.path.isPointInside(o1, o2[2].x,o2[2].y)
	    ||Snap.path.isPointInside(o1, o2[3].x,o2[3].y)) { return true; }
	return false;
    },
    isinoutline: function(o1,sh,m) {
	var o2=sh.getOutlinePoints(m);
	if (Snap.path.isPointInside(o1, o2[0].x,o2[0].y)
	    ||Snap.path.isPointInside(o1, o2[1].x,o2[1].y)
	    ||Snap.path.isPointInside(o1, o2[2].x,o2[2].y)
	    ||Snap.path.isPointInside(o1, o2[3].x,o2[3].y)) { 
	    return true; 
	}
	return false;
    },
    gethitrange: function(sh) {
	var i;
	if (sh.ship.faction==this.ship.faction) return 4;
 	if ((this.collision&&this.collides==sh)||(sh.collision&&sh.collides==this)) return 4;
	for (i=1; i<4; i++) 
	    if (this.isinsector(this.m,i,sh)) { return i; }
	return 4;
    },
    gethitrangeallunits: function() {
	var str='';
	var range=[[],[],[],[],[]];
	squadron.forEach(function(sh) {
	    if (sh!=this) range[this.gethitrange(sh)].push(sh);
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
		range[k].push(sh);
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

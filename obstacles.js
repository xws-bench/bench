var ROCKIMG="img/asteroid.jpg";
var OBSTACLES=[];
var id=0;
function loadrock(s) {
    var i;
    PATTERN = s.image(ROCKIMG,0,0,200,200).pattern(0,0,200,200);
    for (i=1; i<=6; i++)
	Snap.load("data/rock"+i+".svg", function(fragment) {
	    OBSTACLES.push(new Rock(fragment));
	});
}
function getid() {
    return id++;
}

function Rock(fragment) {    
    var k;
    var i=getid();
    var px=[300,500,300,500,300,500];
    var py=[250,250,400,400,550,550];
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
    this.m=(new Snap.Matrix()).add(MT(px[i],py[i])).add(MS(0.5,0.5));
    this.g.drag(this.dragmove.bind(this), 
		this.dragstart.bind(this),
		this.dragstop.bind(this));
    this.path="";
    this.g.hover(function() {this.g.attr({strokeWidth:4});}.bind(this),
		 function()  {this.g.attr({strokeWidth:0});}.bind(this));
    this.g.addClass("unit");
    var b=this.g.getBBox();
    this.g.transform('t '+(-b.width/2)+" "+(-b.height/2));
    this.showrange=true;
    this.show();
}

Rock.prototype = {
    getrangeallunits: function () { return Unit.prototype.getrangeallunits.call(this);},
    getrange: function(sh) { return Unit.prototype.getrange.call(this,sh); },
    gethitrangeallunits: function () {return [[],[],[],[]]},
    togglehitsector: function() {},
    togglerange: function() { },
    getOutlinePoints: function () {
	var k;
	var pts=[];
	if (this.m==this.mop) return this.op;
	for (k=0; k<this.arraypts.length; k++)
	    pts.push(transformPoint(this.m,this.arraypts[k]));
	this.op=pts;
	this.mop=this.m;
	pts.obstacle=true;
	return pts;
    },
    getBox: function() { },
    getOutline: function() {
	var k;
	this.path="M ";
	for (k=0; k<this.arraypts.length; k++) {
	    var p=transformPoint(this.m,this.arraypts[k]);
	    this.path+=p.x+" "+p.y+" ";
	    if (k==0) this.path+=" L ";
	}
	this.path+="Z";
	var out= s.path(this.path); /*.attr({display:"none"});*/
	out.appendTo(s);
	return out;
    },
    turn: function(n) {
	this.m.add(MR(n,0,0));
	this.show();
    },
    unselect: function() {
    },
    select: function() { 
	if (phase==SETUP_PHASE) {
	    this.showpanel();
	    if (this.showrange) {
		var b=this.g.getBBox();
		for (var k=1; k<4; k++) {
		    this.o[k]=s.ellipse(b.x+b.width/2,b.y+b.height/2,100*k+b.width/2,100*k+b.height/2).attr({pointerEvents:"none",display:"block",fill:WHITE,opacity:0.3,strokeWidth:2});
		    this.o[k].prependTo(s);
		}
		this.showrange=false;
	    } else { 
		for (var i=1; i<4; i++) this.o[i].remove();
		this.showrange=true;
	    }
	}
    },
    showpanel:  function() {
	var bbox=this.g.getBBox();
	var p=$("#playmat").position();
	var x=p.left+(bbox.x+(this.islarge?80:40))*$("#playmat").width()/900;
	var y=p.top+bbox.y*$("#playmat").height()/900;
	$(".phasepanel").css({left:x+10,top:y}).appendTo("body").show();
    },
    dragmove: function(dx,dy,x,y) {
	var ddx=dx*900/$("#playmat").width();
	var ddy=dy*900/$("#playmat").height();
	this.dragMatrix=MT(ddx,ddy).add(this.m);
	if (phase==SETUP_PHASE) for (var i=1; i<4; i++) this.o[i].remove();
	this.dragged=true;
	$(".phasepanel").hide();
	this.g.transform(this.dragMatrix);
    },
    dragstart:function(x,y,a) { 
	this.dragged=false; 
	var a=activeunit;
	activeunit=this; 
	this.select();
	a.unselect();
    },
    dragstop: function(a) { 
	if (this.dragged) { this.m=this.dragMatrix; this.showpanel();} 
	this.dragged=false;
    },
    show: function() {
	this.g.transform(this.m);
	this.g.appendTo(s); // Put to front
	//this.showpanel();
    }
}

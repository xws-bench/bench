var ROCKIMG="img/asteroid.jpg";
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

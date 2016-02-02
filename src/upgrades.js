/* 31/06/15: XW FAQ with Garven Dreis 
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
    desactivate:function(sh) { 
	for (var i in sh.wrapping) 
	    if (typeof sh[i].unwrap=="function") sh[i].unwrap(this);
	this.isactive=false; 
    },
    actiondrop: function(n) {
	this.unit.lastdrop=round;
	$(".bombs").remove(); 
	this.drop(this.unit.getbomblocation(),n);
	this.unit.showactivation();
    },
    toString: function() {
	var a,b,d,str="";
	var c="";
	if (!this.isactive) c="class='inactive'"
	a="<td><code class='"+this.type+" upgrades'></code>";
	//if (this.ordnance) a+=
	a+="</td>";
	var text=UPGRADE_translation[this.name];
	var name=this.name;
	var ord="";
	if (this.ordnance) ord="<sup style=\"padding:1px;color:white;background-color:red;border-radius:100%;\">x2</sup>";
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'><span>"+name.replace(/\'/g,"&#39;")+ord+"</span></td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	if (text=="") d="<td class='outoverflow'></td>";
	else d="<td class='tooltip outoverflow'><span>"+formatstring(text)+"</span></td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
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
	for (i in squadron) {
	    var u=squadron[i];
	    var so=u.getOutlineString(u.m);
	    os=so.s;
	    op=so.p;
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.unit.isPointInside(ob.s,op)
		||this.unit.isPointInside(os,ob.p)) {
		p.push(u); 
	    }
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
	} else for (i=0; i<moves.length; i++) {
	    this.pos[i]=this.getOutline(moves[i]).attr({fill:this.unit.color,opacity:0.7});
	    (function(k) {
		this.pos[k].hover(
		    function() {this.pos[k].attr({stroke:this.unit.color,strokeWidth:"4px"})}.bind(this),
		    function() {this.pos[k].attr({strokeWidth:"0"})}.bind(this));
		
		this.pos[k].click(
		    function() { resolve(moves[k],k,cleanup); });}.bind(this)
	    )(i);
	}
    },
    drop: function(lm,n) {
	var dropped=this;
	if (this.ordnance) { 
	    this.ordnance=false; 
	    dropped=$.extend({},this);
	} else this.desactivate(this.unit);
	dropped.img1=s.image("png/"+this.img,-this.width/2,-this.height/2,this.width,this.height);
	dropped.outline=this.getOutline(new Snap.matrix())
	    .attr({display:"block","class":"outline",stroke:halftone(GREY),strokeWidth:2,fill:"rgba(8,8,8,0.3)"});
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
		this.outline.attr({stroke:GREY});
		$(".info").css({left:x,top:y}).html(this.name).appendTo("body").show();
	    }.bind(dropped), function() { 
		$(".info").hide(); 
		this.outline.attr({stroke:halftone(GREY)});
	    }.bind(dropped));
	dropped.resolveactionmove(this.unit.getbombposition(lm,this.size), function(k) { 
	    this.g.transform(this.m);
	    this.g.appendTo(VIEWPORT);
	    this.g.attr("display","block");
	    BOMBS.push(this);
	    if (this.stay) {
		OBSTACLES.push(this);
		var p=this.getcollisions();
		if (p.length>0) this.unit.resolveactionselection(p,function(k) {
		    this.detonate(p[k]);
		}.bind(this));
	    }
	    this.unit.bombdropped(this);
	    this.unit.endaction(n);
	}.bind(dropped));
    },
    getOutline: function(m) {
	var path=s.path(this.getOutlineString(m).s);
	path.appendTo(VIEWPORT);
	return path;
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
    show: function() {}
}
function Weapon(sh,wdesc) {
    this.isprimary=false;
    $.extend(this,wdesc);
    sh.upgrades.push(this);
    //log("Installing weapon "+this.name+" ["+this.type+"]");
    this.isactive=true;
    if (this.type.match("Missile|Torpedo")) this.ordnance=sh.ordnance;
    this.unit=sh;
    sh.weapons.push(this);
    //if (this.init != undefined) this.init(sh);
}
Weapon.prototype = {
    isBomb: function() { return false; },
    isWeapon: function() { return true; },
    hasauxiliaryfiringarc: function() { return false; },
    desactivate:function(sh) {
	log("sh unwrapping "+sh.name+" "+sh.wrapping);
	if (typeof sh.wrapping!="undefined") {
	    for (var i in sh.wrapping) 
		if (typeof sh[i].unwrap=="function") sh[i].unwrap(this);
	}
	this.isactive=false; 
    },
    toString: function() {
	var a,b,d,str="";
	var c="";
	if (!this.isactive) c="class='inactive'"
	else {
	    var i,r=this.getrangeallunits();
	    for (i=0; i<r.length; i++) if (r[i].team!=this.unit.team) break;
	    if (i==r.length) c="class='nofire'"
	}
	for (var i in squadron) if (squadron[i]==this.unit) break;
	a="<td><button class='statfire'";
	a+=" onclick='if (!squadron["+i+"].dead) squadron["+i+"].togglehitsector(\""+this.name.replace(/\'/g,"&#39;")+"\")'";
	a+=">"+this.getattack()+"<span class='symbols'>"+A[this.type.toUpperCase()].key+"</span>"
	a+="</button></td>";
	var text=UPGRADE_translation[this.name];
	var name=this.name;
	var ord="";
	if (this.ordnance) ord="<sup style=\"padding:1px;color:white;background-color:red;border-radius:100%;\">x2</sup>";
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'><span>"+name.replace(/\'/g,"&#39;")+ord+" <span style='font-size:x-small'>";
	if ((typeof this.getrequirements()!="undefined")) {
	    if ("Target".match(this.getrequirements())) b+="<code class='symbols'>"+A["TARGET"].key+"</code>"
	    if ("Focus".match(this.getrequirements())) b+=(this.getrequirements().length>5?"/":"")+"<code class='symbols'>"+A["FOCUS"].key+"</code>"
	}
	b+="["+this.range[0]+"-"+this.range[1]+"]</span></span></td>";
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
    isinrange: function(r) {
	return (r>=this.range[0]&&r<=this.range[1]);
    },
    modifydamagegiven: function(ch) { return ch; },
    modifydamageassigned: function(ch,t) { return ch; },
    canfire: function(sh) {
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
	if (ghs>=this.range[0]&&ghs<=this.range[1]) return ghs;
	return 0;
    },
    endattack: function(c,h) {
	if (this.type.match("Torpedo|Missile")) {
	    if (this.ordnance) this.ordnance=false; else this.desactivate(this.unit);
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
    if (upg.type.match("Turretlaser|Bilaser|Laser180|Laser|Torpedo|Cannon|Missile|Turret")||upg.isweapon==true) return new Weapon(sh,upg);
    return new Upgrade(sh,i);
}
Upgrade.prototype = {
    toString: function() {
	var a,b,str="";
	var c="";
	var d;
	if (!this.isactive) c="class='inactive'"
	a="<td><code class='"+this.type+" upgrades'></code></td>"; 
	var text=UPGRADE_translation[this.name+(this.type==CREW?"(Crew)":"")];
	var name=this.name;
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'>"+name.replace(/\'/g,"&#39;")+"</td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	if (text=="") d="<td class='outoverflow'></td>";
	else d="<td class='tooltip outoverflow'><span>"+formatstring(text)+"</span></td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    isWeapon: function() { return false; },
    isBomb: function() { return false; },
    endround: function() {},
    desactivate:function(sh) { 
	for (var i in sh.wrapping)
	    if (typeof sh[i].unwrap=="function") sh[i].unwrap(this);
	this.isactive=false; 
    },
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
	done:true,
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
		target.addiontoken();
	    }
	    return ch;
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
	    sh.addattackmoda(this,function(m,n) {
		return (sh.weapons[sh.activeweapon]==this);
	    }.bind(this),function(m,n) {
		var f=FCH_focus(m);
		if (f>0) {
		    this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",this.name);
		    return m-FCH_FOCUS+FCH_CRIT;
		}
		return m;
	    }.bind(this),false,"focus");
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
		    this.shield++;
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
			    this.hull++;
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
		  self.desactivate(this);
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
			  return !this.hasmoved&&this.maneuver>-1&&(this.getmaneuver().difficulty=="GREEN"); 
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
		     this.upgrades[k].desactivate(this);
		     this.log("%0 is inactive, damage discarded [%1]",this.upgrades[k].name,self.name);
		     self.desactivate(this);
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
	 sh.addattackmoda(this,function(m,n) { 
	     return self.isactive&&this.canusefocus(); 
	 }.bind(sh), function(m,n) {
	     var b=FCH_blank(m);
	     this.removefocustoken();
	     displayattacktokens(this);
	     if (b>0) {		
		 this.log("1 blank -> 1 %HIT% [%0]",self.name);
		 return m+FCH_HIT; 
	     } 
	     return m;
	 }.bind(sh),false,"focus");
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
		var p=sh.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.getskill()>b.getskill(); });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    p[k].log("PS set to %1 [%0]",self.name,this.getskill());
			    p[k].wrap_after("getskill",self,function(s) {
				return sh.getskill();
			    }).unwrap("endcombatphase");
			    this.endnoaction(n,"ELITE");
			}.bind(this));
		    }.bind(this));
		}
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
	    var p=this.unit.selectnearbyunits(2,function(t,s) { return t.team==s.team&&s!=t&&s.getskill()<t.getskill()&&s.candoaction();});
	    return (this.isactive)&&(p.length>0);
	},
	action: function(n) {
	    var unit=this.unit;
	    var p=this.unit.selectnearbyunits(2,function(t,s) { return t.team==s.team&&s!=t&&s.getskill()<t.getskill()&&s.candoaction();});
	    this.unit.resolveactionselection(p,function(k) {
		p[k].select();
		p[k].doaction(p[k].getactionlist()).done(function() {
		    this.select();
		    this.endaction(n,"ELITE");
		}.bind(this));
	    }.bind(this.unit));
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
	    sh.addattackmoda(this,function(m,n) {
		    return (this.mark==round)&&this.isactive;
		}.bind(this),function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0&&this.mark==round) {	
			if (f>1) this.unit.log("%0 %FOCUS% -> 1 %CRIT%, %1 %HIT% [%2]",f,f-1,self.name); else this.unit.log("1 %FOCUS% -> 1 %CRIT% [%1]",f,self.name);
			return m-FCH_FOCUS*f+FCH_CRIT+(f-1)*FCH_HIT; 
		    } 
		    return m;
		}.bind(this),false,"focus");
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
	    sh.addattackmoda(this,function(m,n) {
		return sh.weapons[sh.activeweapon]==this&&missile.isactive;
	    }.bind(this), function(m,n) {
		var b=FCH_blank(m,n);
		if (b>0) return m+FCH_HIT; else return m;
	    }.bind(this),false,"blank");
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
		} else this.desactivate(this.unit);
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
	    sh.addattackmodd(this,function(m,n) {
		return this.stress==0&&targetunit==this&&self.isactive;
	    }.bind(sh),function(m,n) {
		this.unit.addstress();
		if (FCH_crit(m)>0) {
		    this.unit.log("1 %CRIT% rerolled [%0]",this.name);
		    m=m-FCH_CRIT+activeunit.attackroll(1);
		} else if (FCH_hit(m)>0) {
		    this.unit.log("1 %HIT% rerolled [%0]",this.name);
		    m=m-FCH_HIT+activeunit.attackroll(1);
		}
		return m;
	    }.bind(this),"critical");
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
	desactivate: function(sh) {
	    sh.doaction=this.da;
	    Upgrades.prototype.desactivate.call(this,sh);
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
	desactivate:function(sh) {
	    Weapon.prototype.getrequirements.unwrap(this);
	    Upgrades.prototype.desactivate.call(this,sh);
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
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
		target.addiontoken();
	    }
	    return ch;
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
		    squadron[r[1][i].unit].resolvehit(1);
		    squadron[r[1][i].unit].checkdead();
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
	    sh.addattackmoda(this,function(m,n) {
		if (self.isactive&&(this.getrange(targetunit)==3)) return true;
		return false;
	    }.bind(sh),function(m,n) {
		if (FCH_hit(m)>0) {
		    this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
		    return m-FCH_HIT+FCH_CRIT; 
		} else return m;
	    }.bind(sh),false,"hit");
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
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].log("+1 %HIT% [%0]",this.name);
		    squadron[r[1][i].unit].resolvehit(1);
		}
	    }
	    return ch;
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
		    if (roll[i]=="hit") { t.resolvehit(1); t.checkdead(); }
		    else if (roll[i]=="critical") { 
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
    },
    { /* TODO: a ship is still hit if crit is transferred ? */
        name: "Draw Their Fire",
        init: function(sh) {
	    var self=this;
	    this.ea=Unit.prototype.resolvecritical;
	    Unit.prototype.resolvecritical=function(c) {
		if (c>0&&this.team==sh.team&&sh!=this&&this.getrange(sh)==1){
		    this.log("select unit [%0]",self.name);
		    this.doselection(function(n) {
			this.resolveactionselection([this,sh],function(k) {
			    if (k==0) { this.ea.call(this,1); }
			    else { this.ea.call(sh,1);}
			    this.endnoaction(n,"ELITE");

			}.bind(this));
		    }.bind(this));
		    this.ea.call(this,c-1);
		} else this.ea.call(this,c);
		return c;
	    }
	}, 
	desactivate:function(sh) {
	    Unit.prototype.resolvecritical=this.ea;
	    Upgrades.prototype.desactivate.call(this,sh);
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
	    sh.addattackmoda(this,function(m,n) {
		return luke==round&&self.isactive;
	    }.bind(sh),function(m,n) {
		if (m>100) return m-99; else return m;
	    },false,"focus");
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
			if (this.shield<this.ship.shield) this.shield++;
			this.log("+1 %SHIELD%, 1 damage discarded [%0]",self.name);
			self.desactivate(this);
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
	    sh.addattackmoda(this,function(m,n) {
		return (sh.weapons[sh.activeweapon]==this);
	    }.bind(this),function(m,n) {
		var b=FCH_blank(m,n);
		if (b>3) b=3;
		if (b>0) {
		    this.unit.log("%0 blanks -> %0 %FOCUS% [%1]",b,this.name);
		    m+=b*FCH_FOCUS;
		}
		return m;
	    }.bind(this),false,"blank");
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
	    }).unwrapper("endattack");
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
		var p=this.selectnearbyenemy(2);
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    p[k].showmaneuver();
			    this.endnoaction(n,"CREW");
			}.bind(this));
		    }.bind(this));
		}
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
		    upg.desactivate(this);
		    this.wrap_after("getmaneuver",upg,function(d) {
			d.difficulty="WHITE";
			return d;
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
	    sh.wrap_before("beginactivation",this,function() {
		if (this.candoaction()) 
		    this.doaction(this.getactionlist()).done(function(r) {
			if (r==null) sh.doendmaneuveraction=dema; 
			else this.doendmaneuveraction=function() { }
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
	    sh.addattackmodd(this,function(m,n) {
		return (targetunit==this&&self.isactive);
	    }.bind(sh),function(m,n) {
		var h=FCH_hit(m);
		if (h>0) {
		    this.unit.log("1 %HIT% -> 1 %FOCUS% [%0]",self.name);
		    return m-FCH_HIT+FCH_FOCUS;
		}
		return m;
	    }.bind(this),"hit");
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
	    sh.adddefensererolld(
		this,
		["focus"],
		function() { if (activeunit.getskill()<=2) return 2; return 1; },
		function(w,attacker) {
		    if (this.isactive) 
			this.unit.log("+%1 %FOCUS% reroll(s) [%0]",self.name,(activeunit.getskill()<=2?2:1));
		    return this.isactive;
		}.bind(this)
	    )
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
		if (t.focus+t.evade==0) 
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
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		this.unit.log("+%1 %HIT%, +1 ion token [%0]",this.name,2);
		ch=2;
		t.addiontoken(); t.addiontoken();
	    }
	    return ch;
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
		var p=this.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&b.stress>0; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit [%0]",self.name);
		    	this.resolveactionselection(p,function(k) {
			    p[k].removestresstoken();
			    this.endnoaction(n,ELITE);
			}.bind(this));
		    }.bind(this));
		} 
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
		var p=this.selectnearbyally(2);
		if (p.length>0) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("select unit (or self to cancel) [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    if (p[k]!=sh) {
				var s1=p[k].getskill();
				var s2=sh.getskill();
				sh.wrap_after("getskill",self,function(s) {
				    return s1;
				}).unwrapper("endcombatphase");
				p[k].wrap_after("getskill",self,function(s) {
				    return s2;
				}).unwrapper("endcombatphase");
			    }
			    sh.endnoaction(n,ELITE);
			});
		    }.bind(this));
		}
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
	    sh.addattackrerolla(
		this,
		["blank","focus"],
		function() { if (targetunit.getskill()<=2) return 2; return 1; },
		function(w,defender) {
		    this.log("+%1 reroll(s) [%0]",self.name,(targetunit.getskill()<=2?2:1));
		    return self.isactive;
		}.bind(sh)
	    )
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
		    this.shield++;
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
				.click(function() { resolve(k);}.bind(this));
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
	desactivate:function(sh) {
	    Unit.prototype.addfocustoken.unwrap(this);
	    Upgrades.prototype.desactivate.call(this,sh);
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
		    this.shield++;
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
	    sh.addattackmoda(this,function(m,n) { 
		return self.isactive&&this.targeting.indexOf(targetunit)>-1;
	    }.bind(sh), function(m,n) {
		var f=FCH_focus(m);
		this.log("%0 %FOCUS% -> %0 %HIT% [%1]",f,self.name);
		this.removetarget(targetunit);
		return m-FCH_FOCUS*f+FCH_HIT*f;
	    }.bind(sh),false,"target");
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
		    mod.desactivate(this);
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
	    sh.addattackrerolla(
		this,
		["blank"],
		function() { return 1;},
		function(w,defender) {
		    var p=this.unit.selectnearbyally(2);
		    if (p.length==0&&self.isactive) {
			this.unit.log("+1 blank reroll [%0]",self.name);
		    }
		    return p.length==0&&self.isactive; 
		}.bind(this)
	    )
	    sh.adddefensererolld(
		this,
		["blank"],
		function() { return 1;},
		function(w,defender) {
		    var p=this.unit.selectnearbyally(2);
		    if (p.length==0&&self.isactive) {
			this.unit.log("+1 blank reroll [%0]",self.name);
		    }
		    return p.length==0&&self.isactive; 
		}.bind(this)
	    )
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
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select unit [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    p[k].log("+%1 %HIT% [%0]",self.name,1);
			    p[k].resolvehit(1); 
			    p[k].checkdead();
			    this.endnoaction(n,ELITE);
			}.bind(this))
		    }.bind(this));
		}
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
	desactivate:function(sh) {
	    Unit.prototype.getagility.unwrap(this);
	    Upgrades.prototype.desactivate.call(this,sh);
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
			cr[0].desactivate(this);
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
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		t.addiontoken();
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].log("+1 ion token [%0]",this.name);
		    squadron[r[1][i].unit].addiontoken();
		}
	    }
	    return ch;
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
		var p=this.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.getskill()<b.getskill(); });
		p.push(this);
		if (p.length>1&&this.canusefocus()) {
		    this.doselection(function(n) {
			this.log("select unit (or self to cancel) [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				p[k].wrap_after("getagility",self,function(a) { return a+1; }).unwrapper("endcombatphase"); 
				this.removefocustoken();
			    }
			    this.endnoaction(n,ELITE);
			}.bind(this));
		    }.bind(sh));
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
	    sh.addattackmoda(this,function(m,n) {
		return this.canusefocus()&&self.isactive;
	    }.bind(sh),function(m,n) {
		var f=FCH_focus(m);
		this.removefocustoken();
		displayattacktokens(this);
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
		    return m-FCH_FOCUS+FCH_CRIT;
		}
		return m;
	    }.bind(sh),false,"focus");
	},   
        type: ELITE,
        points: 1,
    },
    {
        name: "Accuracy Corrector",
	init: function(sh) {
	    var self=this;
	    sh.addattackadd(this,function(m,n) { 
		return self.isactive; 
	    },function(m,n) {
		this.log("replace all dice by 2 %HIT% [%0]",self.name);
		return {m:2,n:2};
	    }.bind(sh),"hit");
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
		    upg.desactivate(this);
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
      range:[1,3]
    },
    {
        name: "Flechette Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		ch=1;
		t.log("+1 %HIT%, +1 %STRESS% [%0]",this.name);
		if (t.stress==0) t.addstress();
	    }
	    return ch;
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
	    sh.addattackmoda(this,function(m,n) {
		if (sh.weapons[sh.activeweapon]==this) return self.isactive;
		return false;
	    }.bind(this),function(m,n) {
		var h=m%10;
		if (h>0) {
		    this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
		    return m+9;
		}
		return m;
	    }.bind(sh),false,"hit");
	},
        range: [1,3],
    },
    {
        name: "Dead Man's Switch",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("dies",this,function() {
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
		var p=this.selectnearbyenemy(1);
		if (p.length>0) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("select unit (or self to cancel) [%0]",self.name)
			this.resolveactionselection(p,function(k) {
			    if (p[k]!=this) {
				this.resolvehit(1);
				this.addiontoken();
				SOUNDS.explode.play();
				p[k].resolvehit(1);
				p[k].checkdead();
				this.checkdead();
				this.hasfired=true;this.hasdamaged=true;
			    }
			    this.endnoaction(n,ILLICIT);
			}.bind(this))
		    }.bind(this));
		}
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
			self.desactivate(this);
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
	    for (var i=0; i<sh.bombs.length; i++) {
		var b=sh.bombs[i];
		if (typeof b.action=="undefined") {
		    b.action=function(n) { this.actiondrop(n); };
		    b.candoaction=function() { return  this.unit.lastdrop!=round&&this.isactive&&self.isactive; };
		}
	    }
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
	    }).unwrapper("endattack");
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
		if (d=="GREEN") {
		    var p=this.gettargetableunits(3);
		    if (p.length>0) {
			p.push(this);
			this.log("select unit (or self to cancel) [%0]",self.name);
			this.doselection(function(n) {
			    this.resolveactionselection(p,function(k) {
				if (this!=p[k]) {
				    this.addtarget(p[k]);
				    this.log("+1 %TARGET% / %1 [%0]",self.name,p[k].name);
				}
				this.endnoaction(n,CREW);
			    }.bind(this));
			}.bind(this));
		    }  else {
			this.log("no available target [%0]",self.name);
		    }
		}
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
	    sh.addattackadd(this,function(m,n) { 
		return this.targeting.indexOf(targetunit)>-1&&self.isactive==true; 
	    }.bind(sh),function(m,n) {
		if (this.targeting.indexOf(targetunit)>-1) {
		    this.log("+1 %CRIT% [%0]",self.name);
		    $("#atokens > .xtargettoken").remove();
		    return {m:m+10,n:n+1};
		} else return {m:m,n:n};
	    }.bind(sh),"critical")
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
		upg.desactivate(this); 
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
		    mod.desactivate(this);
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
    },
    {
        name: "Autothrusters",
	type:MOD,
        actionrequired:"Boost",
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddefensemodd(this,function(m,n) {
		if (activeunit.getsector(this)>2) return self.isactive;
		return false;
	    }.bind(sh),function(m,n) {
		var b=FE_blank(m,n);
		if (b>0) {
		    this.log("1 blank -> 1 %EVADE% [%0]",self.name);
		    return m+FE_EVADE;
		}
		return m;
	    }.bind(sh),false,"blank");
	    
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
	    sh.wrap_after("candotarget",this,function() {return true;});
	    sh.resolvetarget=function(n) {
		var i; var p=[];
		for (i in squadron) 
		    if (squadron[i].team!=this.team) p.push(squadron[i]);
		if (p.length>0) {
		    this.log("target any unit in area [%0]",self.name);
		    this.resolveactionselection(p,function(k) { 
			this.addtarget(p[k]);
			this.endaction(n,"TITLE");
		    }.bind(this));
		    return true;
		} else { return false; }
	    }
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
        special_case: "A-Wing Test Pilot",
    },
    {
        name: "Outrider",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var i;
	    for (i=0; i<sh.weapons.length; i++) {
		if (sh.weapons[i].type==CANNON) {
		    sh.weapons[0].desactivate(sh);
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
		    if (u!=sh&&u.ig2000==true&&u.faction==sh.faction) {
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
	    var turret=-1,i;
	    var self=this;
	    for (i=0; i<sh.weapons.length; i++) {
		if (sh.weapons[i].type==TURRET) {
		    turret=i;
		    break;
		}
	    }
	    if (turret==-1) return;
	    sh.weapons[turret].isTurret=function() { return false; };
	    sh.isTurret=function(w) {
		if (w==sh.weapons[turret]) return false;
		return Unit.prototype.isTurret(w);
	    };
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
	    install: function(sh) {
		sh.ordnance=true;
	    },
	    uninstall: function(sh) {
		sh.ordnance=false;
	    }
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
	    candoaction: function() { return  this.unit.lastdrop!=round&&this.isactive; },
	    action: function(n) {   this.actiondrop(n);  },
	    canbedropped: function() { return false; },
            explode: function() {},
	    detonate: function(t) {
		if (!this.exploded) {
		    var roll=this.unit.rollattackdie(2);
		    for (var i=0; i<2; i++) {
			if (roll[i]=="hit") { t.resolvehit(1); t.checkdead(); }
			else if (roll[i]=="critical") { 
			    t.resolvecritical(1);
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
	    activated: false,
	    done:true,
	    init: function(sh) {
		var self=this;
		sh.wrap_after("begincombatphase",this,function(lock) {
		    if (self.isactive) {
			this.donoaction([
			    {org:self,name:self.name,type:"ILLICIT",action:function(n) {
				this.addstress();
				self.desactivate(this);
				self.activated=round;
				this.endnoaction(n,"ILLICIT");
			    }.bind(this)}],"",true);
		    }
		    return lock;
		});
		sh.addattackmoda(this,function(m,n) {
		    return self.activated==round&&self.isactive;
		},function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.unit.log("%FOCUS% -> %HIT% [%0]",self.name);
			return m-FCH_FOCUS*f+f*FCH_HIT;
		    }
		    return m;
		}.bind(this),false,"illicit");
		sh.adddefensemodd(this,function(m,n) {
		    return self.activated==round;
		},function(m,n) {
		    var f=FE_focus(m);
		    if (f>0) {
			this.unit.log("%FOCUS% -> %EVADE% [%0]",self.name);
			return m-FE_FOCUS*f+FE_EVADE*f;
		    }
		    return m;
		}.bind(this),false,"illicit");
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
		if (roll=="focus"&&this.iscloaked) {
		    this.log("decloaked [%0]",self.name);
		    self.desactivate(this);
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
	  sh.addattackrerolla(
	      this,
	      ["focus"],
	      function() { return 9; },
	      function(w,defender) {
		  if (this.stress>0&&this.canusefocus()) {
		      this.log("+%1 %FOCUS% reroll(s) [%0]",self.name,this.focus);
		      return self.isactive;
		  } else return false;
		}.bind(sh)
	  );
	  sh.adddefensererolld(
	      this,
	      ["focus"],
	      function() { if (activeunit.getskill()<=2) return 2; return 1; },
	      function(w,attacker) {
		  if (this.stress>0&&this.canusefocus()) {
		      this.log("+%1 %FOCUS% reroll(s) [%0]",self.name,this.focus);
		      return self.isactive;
		  } else return false;
	      }.bind(this)
	  )
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
				    self.desactivate(this);
				    this.addfocustoken();
				    this.endnoaction(n,"ELITE");
				}.bind(this)},
			       {type:EVADE,name:self.name,org:self,
				action:function(n) {
				    self.desactivate(this);
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
			this.donoaction([{type:ELITE,name:u.name,org:u,action:function(n) {
			    u.desactivate(this);
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
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		target.log("+%1 %HIT% [%0]",this.name,1);
	    }
	    return ch;
	},	
	init: function(sh) {
	    var self=this;
	    var tlt=-1;
	    sh.wrap_after("cleanupattack",this,function() {
		if (tlt<round&&this.usedweapon>-1
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
		if (t.shield>0) t.log("-1 %SHIELD% [%0]",self.name);
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
		t.log("makes detonation");
		if (!this.exploded) {
		    var roll=this.unit.rollattackdie(1)[0];
		    if (roll=="hit") { t.resolvehit(1); t.checkdead(); }
		    else if (roll=="critical") { 
			t.resolvecritical(1);
			t.checkdead();
		    }
		    t.addiontoken();
		    t.addiontoken();
		    this.unit.log("%1 skips action phase [%0]",self.name,t.name);
		    var cdema=t.candoendmaneuveraction;
		    t.candoendmaneuveraction=function() {
			t.candoendmaneuveraction=cdema;
			return false;
		    }
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
    },
        {
            name: "'Crack Shot'",
            type: ELITE,
            points: 1,
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
	    init: function(sh) {
		var self=this;
		sh.wrap_after("hashit",this,function(t,hh) {
		    if (hh&&self==this.weapons[this.activeweapon]) {
			this.log("+1 %CRIT% [%0]",self.name);
			t.applycritical(1);
			this.hitresolved=0;
			this.criticalresolved=0;
		    }
		    return hh;
		})
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
		  if (u.faction!=this.faction) {
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
      unique:true
    },
    { name:"Ezra Bridger",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.addattackmoda(this,function(m,n) {
	      return self.isactive&&(sh.stress>0);
	  }.bind(this),function(m,n) {
	      var f=FCH_focus(m);
	      if (f>0) {
		  this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",this.name);
		  return m-FCH_FOCUS+FCH_CRIT;
	      }
	      return m;
	  }.bind(this),false,"focus");
      },
    },
    { name:"Kanan Jarrus",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true
    },
    { name:"Sabine Wren",
      type:CREW,
      points:2,
      upgrades:[BOMB],
      faction:REBEL,
      unique:true
    },
    {
	name:"Ghost",
	type:TITLE,
	points:0,
	unique:true,
	ship:"VCX-100"
    },
    {name:"Phantom",
     type:TITLE,
     points:0,
     unique:true,
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
	     this.wrap_before("endbeingattacked",self,function(c,h) {
		 if (self.damage>=3) {
		     this.log("+1 %SHIELD% [%0]",self.name);
		     this.shield++;
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
     type:ASTROMECH
    },
    {name:"TIE/x7",
     points:-2,
     type:TITLE,
     lostupgrades:[CANNON,MISSILE],
     ship:"TIE Defender"
    },
    {name:"TIE/D",
     points:0,
     type:TITLE,
     ship:"TIE Defender"
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
     type:CREW
    },
    {name:"4-LOM",
     faction:SCUM,
     points:1,
     unique:true,
     type:CREW
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
    }
];

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
    if (this.init != undefined) this.init(sh);
}
Bomb.prototype = {
    isWeapon: function() { return false; },
    isBomb: function() { return true; },
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
	b="<td class='tdstat'>"+name.replace(/\'/g,"&#39;")+ord+"</td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	d="<td class='tooltip outoverflow'>"+formatstring(text)+"</td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    getrangeallunits: function () { 
	var range=[[],[],[],[],[]],i;
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    var k=this.getrange(sh);
	    if (k>0) range[k].push({unit:i});
	};
	return range;
    },
    getcollisions: function() {
	var ob=this.getOutlineString();
	var p=[];
	for (i=0; i<squadron.length; i++) {
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
    drop: function(lm) {
	var dropped=this;
	if (this.ordnance) { 
	    this.ordnance=false; 
	    dropped=$.extend({},this);
	} else this.isactive=false;
	dropped.img1=s.image("png/"+this.img,-this.width/2,-this.height/2,this.width,this.height);
	dropped.outline=this.getOutline(new Snap.matrix())
	    .attr({display:"block","class":"outline",stroke:halftone(GREY),strokeWidth:2,fill:"rgba(8,8,8,0.3)"});
	if (this.repeatx) {
	    dropped.img2=s.image("png/"+this.img,-this.width/2-this.repeatx,-this.height/2,this.width,this.height);
	    dropped.img3=s.image("png/"+this.img,-this.width/2+this.repeatx,-this.height/2,this.width,this.height);
	    dropped.g=s.group(dropped.outline,dropped.img1,dropped.img2,dropped.img3);
	} else dropped.g=s.group(dropped.outline,dropped.img1);
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
	    BOMBS.push(this);
	    if (this.stay) {
		OBSTACLES.push(this);
		var p=this.getcollisions();
		if (p.length>0) this.unit.resolveactionselection(p,function(k) {
		    this.detonate(p[k]);
		}.bind(this));
	    }
	    this.unit.bombdropped(this);
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
    }
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
    if (this.init != undefined) this.init(sh);
}
Weapon.prototype = {
    isBomb: function() { return false; },
    isWeapon: function() { return true; },
    hasauxiliaryfiringarc: function() { return false; },
    toString: function() {
	var a,b,d,str="";
	var c="";
	if (!this.isactive) c="class='inactive'"
	else {
	    var i,r=this.getrangeallunits();
	    for (i=0; i<r.length; i++) if (r[i].team!=this.unit.team) break;
	    if (i==r.length) c="class='nofire'"
	}
	for (var i=0; i<squadron.length; i++) if (squadron[i]==this.unit) break;
	a="<td><button class='statfire'";
	a+=" onclick='if (!squadron["+i+"].dead) squadron["+i+"].togglehitsector(\""+this.name.replace(/\'/g,"&#39;")+"\")'";
	a+=">"+this.getattack()+"<span class='symbols'>"+A[this.type.toUpperCase()].key+"</span>"
	a+="</button></td>";
	var text=UPGRADE_translation[this.name];
	var name=this.name;
	var ord="";
	if (this.ordnance) ord="<sup style=\"padding:1px;color:white;background-color:red;border-radius:100%;\">x2</sup>";
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'>"+name.replace(/\'/g,"&#39;")+ord+" <span style='font-size:x-small'>";
	if ((typeof this.getrequirements()!="undefined")) {
	    if ("Target".match(this.getrequirements())) b+="<code class='symbols'>"+A["TARGET"].key+"</code>"
	    if ("Focus".match(this.getrequirements())) b+=(this.getrequirements().length>5?"/":"")+"<code class='symbols'>"+A["FOCUS"].key+"</code>"
	}
	b+="["+this.range[0]+"-"+this.range[1]+"]</span></td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	d="<td class='tooltip outoverflow'>"+formatstring(text)+"</td>";

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
	if (!this.isactive) return false;
	if (this.unit.checkcollision(sh)) return false;
	if (typeof this.getrequirements()!="undefined") {
	    var s="Target";
	    if (s.match(this.getrequirements())&&this.unit.canusetarget(sh))
		return true;
	    s="Focus";
	    if (s.match(this.getrequirements())&&this.unit.canusefocus(sh)) return true;
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
	    if (s.match(this.getrequirements())&&this.unit.canusetarget(sh)) 
		this.unit.removetarget(sh);
	    else if (u.match(this.getrequirements())&&this.unit.canusefocus(sh)) 
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
	    if (this.ordnance) this.ordnance=false; else this.isactive=false;
	    //log("["+this.name.replace(/\'/g,"&#39;")+"] inactive");
	}
    },
    getrangeallunits: function() {
	var i;
	var r=[];
	for (i=0; i<squadron.length; i++) {
	    var sh=squadron[i];
	    if ((this.unit!=sh)&&(this.getrange(sh)>0)) r.push(sh);
	}
	return r;
    }
};
function Upgrade(sh,i) {
    $.extend(this,UPGRADES[i]);
    sh.upgrades.push(this);
    //log("Installing upgrade "+this.name.replace(/\'/g,"&#39;")+" ["+this.type+"]");
    this.isactive=true;
    this.unit=sh;
    var addedaction=this.addedaction;
    if (typeof addedaction!="undefined") {
	var added=addedaction.toUpperCase();
	sh.shipactionList.push(added);
	log("Added action: %1",addedaction);
    }
    if (typeof this.init != "undefined") this.init(sh);
}
function Upgradefromid(sh,i) {
    var upg=UPGRADES[i];
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
	d="<td class='tooltip outoverflow'>"+formatstring(text)+"</td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    isWeapon: function() { return false; },
    isBomb: function() { return false; }
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
		target.log("+1 %HIT%, +1 ion token [%0]",this.name);
		target.addiontoken();
	    }
	    return ch;
	},
        range: [1,2],
    },
    {
        name: "Proton Torpedoes",
	requires: "Target",
        type: TORPEDO,
	firesnd:"missile",
        points: 4,
	done:true,
        attack: 4,
	init: function(sh) {
	    var self=this;
	    sh.addattackmoda(this,function(m,n) {
		return (sh.weapons[sh.activeweapon]==this);
	    }.bind(this),function(m,n) {
		var f=this.unit.getfocusreddice(m);
		if (f>0) {
		    this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
		    return m-90;
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
	    sh.wrap_after("getdial",this,function(m) {
		var n=[];
		for (var i=0; i<m.length; i++) {
		    var s=P[m[i].move].speed;
		    var d=m[i].difficulty;
		    if (s==1||s==2) d="GREEN";
		    n.push({ move:m[i].move,difficulty:d});
		}
		return n;
	    });
	    sh.log("1, 2 speed maneuvers are green [%0]",self.name);
	},
	uninstall: function(sh) {
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
		    this.log("+1 %SHIELD [%0]",self.name);
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
	candoaction: function() { return true; },
	action: function(n) {
	    var self=this.unit;
	    this.unit.log("+1 agility until end of round [%0]",self.name);
	    self.wrap_after("getagility",this,function(a) {
		return a+1;
	    }).unwrapper("endround");
	    this.unit.showstats();
	    this.unit.endaction(n,ASTROMECH);
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
	    for (var i=0; i<this.criticals.length; i++) 
		if (this.criticals[i].isactive==false) return true;
	    return false;
	},
	action: function(n) {
	    var c=-1,cl=-1;
	    var self=this;
	    this.unit.defenseroll(1).done(function(roll) {
		if (this.getfocusgreendice(roll)+this.getevadegreendice(roll)>0) {
		    for (i=0; i<this.criticals.length; i++) {
			var cr=this.criticals[i];
			if (cr[i].isactive==false) {
			    c=i;
			    break;
			}
		    }
		    if (c>-1) {
			this.log("repairing 1 %HIT% [%0]",self.name);
			this.criticals.slice(c,1);
		    }
		}
		this.endaction(n,ASTROMECH);
	    }.bind(this));
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
	  sh.wrap_after("updateactivationdial",this,function(ad) {
	      this.addactivationdial(function() { 
		    return self.isactive;
	      },function() {
		  this.log("ignore obstacles [%0]",self.name);
		  self.isactive=false;
		  this.wrap_after("getocollisions",self,function(mbegin,mend,path,len) { 
		      return {overlap:-1,template:[],mine:[]};
		  }).unwrapper("endround");
		  this.show();
	      }.bind(this), A[ASTROMECH.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
	      return ad
	  });
      }
    },
    { name: "BB-8",
      unique:true,
      done:true,
      type:ASTROMECH,
      points:2,
      init: function(sh) {
	  var self=this;
	  self.ad=-1;
	  sh.wrap_after("updateactivationdial",this,function(ad) {
	      self.unit.addactivationdial(function() { 
		  return self.ad!=round&&self.isactive&&!self.unit.hasmoved&&self.unit.maneuver>-1&&(self.unit.getmaneuver().difficulty=="GREEN"); 
	      },function() {
		  self.ad=round;
		  self.unit.doaction([self.unit.newaction(self.unit.resolveroll,"ROLL")],self.name+" free roll for green maneuver.");
	      }, A[ASTROMECH.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
	      return ad;
	  }.bind(this))
      }
    },
    {name:"Integrated Astromech",
     points:0,
     type:MOD,
     ship:"X-Wing",
     done:false,
     init: function(sh) {
	 var upg=this;
	 var ac=sh.applycritical;
	 var ad=sh.applydamage;
	 sh.applydamage=function(n) {
	     if (n>0&&this.hull==1) {
		 upg.isactive=false;
		 this.applydamage=ad;
		 this.log("-1 damage [%0]",upg.name);
		 if (n>1) ad.call(this,n-1);
	     } else ad.call(this,n);
	 }
	 sh.applycritical=function(n) {
	     if (n>0) {
		 s=this.selectdamage();
		 CRITICAL_DECK[s].count--;
		 if (this.hull==1||CRITICAL_DECK[s].lethal) {
		     upg.isactive=false;
      		     this.log("-1 damage [%0]",upg.name);
		     this.applycritical=ac;
		 } else {
		     if (this.faceup(new Critical(this,s))) this.removehull(1);
		 }
		 if (n>1) ac.call(this,n-1);
	     }
	 }
     }
    },
    {name:"Weapons Guidance",
     points:2,
     type:TECH,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.addattackmoda(this,function(m,n) { 
	     return true; 
	 }, function(m,n) {
	     var b=this.getblankreddice(m);
	     if (b>0&&this.canusefocus()&&self.isactive) {		
		 this.log("1 blank -> 1 %HIT% [%0]",self.name);
		 this.removefocustoken();
		 return m+1; 
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
		rtt.call(this,t);		  
		this.defenseroll(1).done(function(roll) {
		    if (this.getevadegreendice(roll)>0) {
			this.addtarget(t);
			this.log("+1 %TARGET% on %1 [%0]",self.name,t.name);
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
		for (i=0; i<this.criticals.length; i++) {
		    var cr=this.criticals[i];
		    if (cr[i].isactive&&cr[i].type=="ship") {
			c=i;
			if (cr[i].lethal) { cl=i; break; }
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
	    sh.wrap_after("faceup",this,function(c,fu) {
		if (c.type!="pilot") return fu;
		this.log("discarding critical %1 [%0]",self.name,c.name);
		this.criticals.slice(this.criticals.indexOf(c),1);
		return false;
	    });
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
		var p=sh.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.skill>b.skill; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select pilot [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    var u=p[k];
			    u.log("PS set to %1 [%0]",self.name,this.skill);
			    this.u=u;
			    this.oldskill=u.skill;
			    u.skill=this.skill;
			    filltabskill();
			    u.show();
			    this.wrap_before_once("endcombatphase",this,function() {
				this.u.skill=this.oldskill;
				filltabskill();
				this.u.show();
			    });
			    this.endnoaction(n,ELITE);
			}.bind(this));
		    }.bind(this));
		} 
	    });
	}
    },
    {
        name: "Squad Leader",
        unique: true,
	done:true,
        type: ELITE,
        points: 2,
	candoaction: function() {  
	    var p=this.unit.selectnearbyunits(2,function(t,s) { return t.team==s.team&&s!=t&&s.skill<t.skill&&s.candoaction();});
	    return (p.length>0);
	},
	action: function(n) {
	    var unit=this.unit;
	    var p=this.unit.selectnearbyunits(2,function(t,s) { return t.team==s.team&&s!=t&&s.skill<t.skill&&s.candoaction();});
	    this.unit.resolveactionselection(p,function(k) {
		p[k].select();
		p[k].doaction(p[k].getactionlist()).done(function() {
		    this.select();
		    this.endaction(n);
		}.bind(this));
	    }.bind(this.unit));
	},
    },
    {
        name: "Expert Handling",
	candoaction: function() { return this.unit.actionsdone.indexOf("ROLL")==-1; },
	action: function(n) {
	    if (this.unit.shipactionList.indexOf("ROLL")==-1) this.unit.addstress();
	    if (this.unit.istargeted.length>0) {
		this.unit.log("select target [%0]",this.name);
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
		    return (this.mark==round);
		}.bind(this),function(m,n) {
		    var f=this.getfocusreddice(m);
		    if (f>0&&this.mark==round) {	
			if (f>1) this.unit.log("%0 %FOCUS% -> 1 %CRIT%, %1 %HIT% [%2]",f,f-1,self.name); else this.unit.log("%0 %FOCUS% -> 1 %CRIT% [%1]",f,self.name);
			return m-100*f+10+(f-1); 
		    } 
		    return m;
		}.bind(this),false,"focus");
	},
	candoaction: function() { return true; },
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
        type: MISSILE,
	firesnd:"missile",
        points: 4,
        attack: 4,
	done:true,
	init: function(sh) {
	    var missile=this;
	    sh.addattackmoda(this,function(m,n) {
		return sh.weapons[sh.activeweapon]==this;
	    }.bind(this), function(m,n) {
		var b=this.getblankreddice(m,n);
		if (b>0) return m+1; else return m;
	    }.bind(this),false,"blank");
	},
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        type: MISSILE,
	firesnd:"missile",
	requires:"Target",
        points: 4,
        attack: 3,
	done:true,
	init: function(sh) {
	    var m=this;
	    var r=-1;
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		if (r<round&&this.weapons[this.activeweapon]==m) {
		    this.log("2nd attack [%0]",m.name);
		    r=round;
		    this.resolveattack(this.activeweapon,targetunit); 
		} else ea.call(this);
	    };
	},
        range: [1,2],
    },
    {
        name: "Daredevil",
	done:true,
        candoaction: function() { return true; },
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
			    if (roll[i]=="hit") { t.resolvehit(1); t.checkdead(); }
			    else if (roll[i]=="critical") { 
				t.resolvecritical(1);
				t.checkdead();
			    }
			}
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
	    sh.addattackmodd(this,function(m,n) {
		return this.stress==0&&targetunit==this;
	    }.bind(sh),function(m,n) {
		this.unit.addstress();
		if (activeunit.getcritreddice(m)>0) {
		    this.unit.log("1 %CRIT% rerolled [%0]",this.name);
		    m=m-10+activeunit.attackroll(1);
		} else if (activeunit.gethitreddice(m)>0) {
		    this.unit.log("1 %HIT% rerolled [%0]",this.name);
		    m=m-1+activeunit.attackroll(1);
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
        type: MISSILE,
	firesnd:"missile",
        attack: 4,
        range: [2,3],
	done:true,
	declareattack: function(target) {
	    Weapon.prototype.declareattack.call(this,target);
	    targetunit.wrap("canuseevade",function() { return false; });
	    targetunit.log("cannot use evade tokens [%0]",this.name);
	},
	endattack: function(c,h) {
	    Weapon.prototype.endattack.call(this,c,h);
	    targetunit.canuseevade.unwrap();
	},
        points: 5,
    },
    {
        name: "Push the Limit",
	init: function(sh) {
	    var ptl=this;
	    ptl.r=-1;
	    var da=sh.doaction;
	    var ea=sh.endaction;
	    sh.doaction= function(la,str) {
		var dar=da.call(this,la,str);
		var df=$.Deferred();
		dar.then(function(r) {
		    if (ptl.r<round) {
			ptl.r=round;		
			var dac=da.call(this,this.getactionbarlist(),ptl.name+": 1 free action");
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
	done:true,
        type: ELITE,
        points: 3,
    },
    {
        name: "Deadeye",
        init: function(sh) {
	    var gr=Weapon.prototype.getrequirements;
	    Weapon.prototype.getrequirements=function() {
		var g=gr.call(this);
		if (this.unit==sh&&g=="Target") return "Target|Focus";
		return g;
	    }
	},
	done:true,
        type: ELITE,
        points: 1,
    },
    {
        name: "Expose",
        candoaction: function() { return true; },
	action: function(n) {
	    var w=this.unit.weapons[0];
	    var gat=w.getattack;
	    this.unit.log("-1 agility, +1 primary attack until end of turn [%0]",this.name);
	    this.unit.wrap_after("getagility",this,function(a) {
		var a=a-1;
		if (a>=0) return a; else return 0;
	    });
	    w.getattack=function() {
		return gat.call(w)+1;
	    };
	    this.unit.wrap_before_once("endround",this,function() {
		this.getagility.unwrap();
		w.getattack=gat;
	    })
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
	    sh.endattack=function(c,h) {
		if ((c+h==0)&&this.hasfired<2) {
		    this.log("2nd attack with primary weapon [%0]",self.name);
		    this.selecttargetforattack(0); 
		} else ea.call(this);
	    };
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
		target.log("+1 %HIT%, +1 ion token [%0]",this.name);
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
	    if (ch>10) {
		var c=this.unit.getcritreddice(ch);
		this.unit.log("%0 %CRIT%-> %0 %HIT% [%1]",c,this.name);
		ch=ch-10*c+c;
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
	    sh.addattackmoda(this,function(m,n) {
		if (this.getrange(targetunit)==3) return true;
		return false;
	    }.bind(sh),function(m,n) {
		if (this.gethitreddice(m)>0) return m+1+10; else return m;
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
	    sh.skill+=2;
	},
	uninstall: function(sh) {
	    sh.skill-=2;
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
	    var ea=Unit.prototype.resolvecritical;
	    Unit.prototype.resolvecritical=function(c) {
		if (c>0&&this.team==sh.team&&sh!=this&&this.getrange(sh)==1){
		    this.log("select unit [%0]",self.name);
		    this.doselection(function(n) {
			this.resolveactionselection([this,sh],function(k) {
			    if (k==0) { ea.call(this,1); }
			    else { ea.call(sh,1);}
			    this.endnoaction(n,CREW);
			}.bind(this));
		    }.bind(this));
		    ea.call(this,c-1);
		} else ea.call(this,c);
		return c;
	    }
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
	    var ea=sh.endattack;
	    var self=this;
	    sh.endattack=function(c,h) {
		if ((c+h==0)&&this.hasfired<2) {
		    this.log("+1 attack with primary weapon [%0]",self.name);
		    this.selecttargetforattack(0);
		} else ea.call(this);
	    };
	    sh.addattackmoda(this,function(m,n) {
		return (this.hasfired==2);
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
	    var i;
	    sh.getdial=function() {
		var m=Unit.prototype.getdial.call(this);
		var n=[];
		for (var i=0; i<m.length; i++) {
		    var move=m[i].move;
		    var d=m[i].difficulty;
		    if (move.match(/F[1-5]/)) d="GREEN";
		    n.push({move:move,difficulty:d});
		}
		return n;
	    }.bind(sh);
	},
	uninstall:function(sh) {
	    sh.getdial=Unit.prototype.getdial;
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
	    var upg=this;
	    var ac=sh.applycritical;
	    var ad=sh.applydamage;
	    sh.applydamage=function(n) {
		if (n>0&&this.hull==1) {
		    upg.isactive=false;
		    if (this.shield<this.ship.shield) this.shield++;
		    this.log("+1 %SHIELD%, -1 %HIT% [%0]",upg.name);
		    this.applydamage=ad;
		    if (n>1) ad.call(this,n-1);
		} else ad.call(this,n);
	    }
	    sh.applycritical=function(n) {
		if (n>0) {
		    s=this.selectdamage();
		    CRITICAL_DECK[s].count--;
		    if (this.hull==1||CRITICAL_DECK[s].lethal) {
			upg.isactive=false;
			if (this.shield<this.ship.shield) this.shield++;
      			this.log("+1 %SHIELD%, -1 %CRIT% %0 [%1]",CRITICAL_DECK[s].name,upg.name);
			this.applycritical=ac;
		    } else {
			if (this.faceup(new Critical(this,s))) this.removehull(1);
		    }
		    if (n>1) ac.call(this,n-1);
		    //this.show();
		}
	    }
	},
        points: 4,
    },
    {
        name: "Advanced Proton Torpedoes",
	requires:"Target",
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
		var r=m%10+(Math.floor(m/10)%10)+(Math.floor(m/100)%10);
		if (n-r>0) {
		    this.unit.log("%0 blanks -> %0 %FOCUS% [%1]",n-r,self.name);
		    if (n-r<3) m+=(n-r)*100; else m+=300;
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
	init: function(sh) {
	    var self=this;
	    var ch=Unit.prototype.cancelhit;
	    Unit.prototype.cancelhit=function(h,e,u) {
		if (u.weapons[u.activeweapon]==this) {
		    this.log("Hits cannot be cancelled by defense dice [%0]",self.name);
		    return h;
		}
		return ch.call(this,h,e,u);
	    };
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
		this.log("+1 %TARGET% on %0 [%1]",targetunit.name,self.name);
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
        points: 4,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Recon Specialist",
        init: function(sh) {
	    sh.wrap_before("addfocus",this,function(n) {
		sh.addfocustoken();
		return af.call(this,n);
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
	    var a=this.unit.selectnearbyunits(1,function(a,b) { return a.team!=b.team; });
	    return a.length>0;
	}, 
	action: function(n) {
	    var self=this;
	    var p=this.unit.selectnearbyunits(1,function(a,b) { return a.team!=b.team; });
	    if (p.length>0) {		
		this.unit.log("select unit [%0]",this.name);
		this.unit.resolveactionselection(p,function(k) {
		    var i,q=[];
		    for (i=0; i<p[k].criticals.length; i++) 
			if (p[k].criticals[i].isactive==false) q.push(p[k].criticals[i]);
		    if (q.length>0) {
			var r=p[k].rand(q.length);
			p[k].log("turn faceup one damage card [%0]",self.name);
			p[k].faceup(q[r]);
			p[k].show();
		    } else p[k].log("no damage card [%0]",self.name);
		    this.endaction(n,CREW);
		}.bind(this));
	    } else this.endaction(n,CREW);
	},
        points: 2,
    },
    {
        name: "Intelligence Agent",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("beginactivationphase",this,function() {
		var p=this.selectnearbyunits(2,function(a,b) { return a.team!=b.team; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("select pilot [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    p[k].showmaneuver();
			    this.endnoaction(n,CREW);
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

	    sh.wrap_after("updateactivationdial",this,function(ad) {
		this.addactivationdial(function() { 
		    return !upg.unit.hasmoved&&upg.isactive&&upg.unit.maneuver>-1&&(upg.unit.getmaneuver().difficulty=="RED"); 
		},function() {
		    upg.unit.log("red into white maneuver [%0]",upg.name);
		    var d=upg.unit.getmaneuver(); 
		    upg.isactive=false;
		    var c  =C["WHITE"];
		    if (!(activeunit==this)) c = halftone(c);
		    upg.unit.dialspeed.attr({text:P[d.move].speed,fill:c});
		    upg.unit.dialdirection.attr({text:P[d.move].key,fill:c});
		    upg.unit.completemaneuver(d.move,d.move,"WHITE");
		}, A[ELITE.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
		return ad;
	    })
	},        
        type: ELITE,
        points: 1,
    },
    {
        name: "Advanced Sensors",
	done:true,
        init: function(sh) {
	    var ba=sh.beginactivation;
	    var dema=sh.doendmaneuveraction;
	    var upg=this;
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
		return (targetunit==this);
	    }.bind(sh),function(m,n) {
		var h=this.gethitreddice(m);
		if (h>0) {
		    this.unit.log("1 %HIT% -> 1 %FOCUS% [%0]",self.name);
		    return m+99;
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
		    this.donoaction([{org:self,type:CREW,name:self.name,action:function(n) {
			targetunit.log("+1 %CRIT% [%0]",self.name); 
			this.resolvehit(2);
			SOUNDS.explode.play();
			targetunit.resolvecritical(1);
			this.checkdead();
			targetunit.checkdead();
			this.endnoaction(n,CREW);
		    }.bind(this)}],"+2 %HIT% [%0]",self.name);
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
	    sh.wrap_before("resolveishit",this,function(t) {
		if (this.rebelcaptive!=round) {//First attack this turn
		    t.log("+1 %STRESS% [%0]",self.name);
		    t.addstress();
		    this.rebelcaptive=round;
		}
	    });
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
		function() { if (activeunit.skill<=2) return 2; return 1; },
		function(w,attacker) {
		    this.unit.log("+ %0 reroll(s) [%1]",(activeunit.skill<=2?2:1),self.name);
		    return true;
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
	    var self=this;
	    var cm=sh.completemaneuver;
            sh.completemaneuver= function(dial,realdial,difficulty) {
		var bearing=realdial.replace(/\d/,'');
		var gd=this.getdial();
		var p=[];
		var q=[];
		q.push(realdial);
		p.push(this.getpathmatrix(this.m,realdial));
		for (i=0; i<gd.length; i++) 
		    if (gd[i].move.match(bearing)&&gd[i].move!=realdial&&(gd[i].difficulty!="RED"||this.stress==0)) { 
			p.push(this.getpathmatrix(this.m,gd[i].move));
			q.push(gd[i].move);
		    }
		if (p.length>1) {
		    this.log("choose maneuver of bearing %0 [%1]",bearing,self.name);
		    this.resolveactionmove(p,
		    function(t,k) {
			cm.call(t,q[k],q[k],difficulty);
		    },false,true);
		} else cm.call(this,dial,realdial,difficulty);
	    }
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
	    sh.wrap_after("getattackstrength",this,function(w,t,a) {
		if (t.focus+t.evade==0) {
		    a=a+1;
		    /* DONOACTION*/
		    this.addstress();
		    this.log("+1 attack against %1, +1 %STRESS% [%0]",self.name,t.name);
		}
		return a;
	    })
	},
        type: ELITE,
        points: 4,
    },
    {
        name: "Ion Pulse Missiles",
	requires:"Target",
        type: MISSILE,
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		this.unit.log("+2 %HIT%, +1 ion token [%0]",this.name);
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
			this.log("select pilot [%0]",self.name);
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
		var p=this.selectnearbyunits(2,function(a,b) { return a.team==b.team&&a!=b; });
		if (p.length>0) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("select pilot (or self to cancel) [%0]",self.name);
			this.resolveactionselection(p,function(k) {
			    if (p[k]!=this) {
				var s=this.skill;
				this.skill=p[k].skill;
				p[k].skill=s;
				filltabskill();
				p[k].showstats();
				this.showstats();
				this.wrap_before_once("endcombatphase",self,function() {
				    var s=this.skill;
				    this.skill=p[k].skill;
				    p[k].skill=s;
				    this.showstats();
				    p[k].showstats();
				});
			    }
			    this.endnoaction(n,ELITE);
			}.bind(this));
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
	    var gds=Unit.prototype.getdefensestrength; 
	    Unit.prototype.getdefensestrength=function(i,t) {
		var d=gds.call(this,i,t);
		if (t==sh) {
		    if(!this.isinfiringarc(t)&&t.isinfiringarc(this)&&d>0) {
			this.log("-1 defense [%0]",self.name);
			return d-1;
		    } 
		}
		return d;
	    }
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
		function() { if (targetunit.skill<=2) return 2; return 1; },
		function(w,defender) {
		    this.log("%0 reroll(s) [%1]",(targetunit.skill<=2?2:1),self.name);
		    return true;
		}.bind(sh)
	    )
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
	requires:"Target",
        type: TORPEDO,
	firesnd:"missile",
	done:true,
	endattack: function(c,h) {
	    if (targetunit.hull<=4) targetunit.addstress();
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
	candoaction: function() { return true; },	    
	action: function(n) {
	    var self=this;
	    //log("R7-T1 preactivated");
	    var p=this.unit.selectnearbyunits(2,function(a,b) { return a.team!=b.team; });
	    //log("R7-T1 activated");
	    if (p.length>0) {
		p.push(this.unit);
		this.unit.log("select unit (self to ignore) [%0]",self.name);
		    this.unit.resolveactionselection(p,function(k) {
			if (p[k]!=this) { 
			    if (p[k].isinfiringarc(this)) this.addtarget(p[k]);
			    this.resolveboost(n);
			} else this.endaction(n,ASTROMECH);
		    });
		} else this.unit.endaction(n,ASTROMECH);
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
		    targetunit.log("+1 %STRESS [%0]",self.name);
		}
	    });
	}
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
			if (this.attackroll(1)%10>0)
			    this.faceup(crit);
		   } 
		}
	    });
	}        
    },
    {
        name: "C-3PO",
        unique: true,
        faction:REBEL,
        type: CREW,
        points: 3,
	done:true,
	init:function(sh) {
	    var rdd=sh.defenseroll;
	    var self=this;
	    sh.defenseroll=function(r) {
		var lock=$.Deferred();
		rdd.call(this,r).done(function(roll) {
		    var resolve=function(k) {
			if (k==this.getevadegreendice(roll)) {
			    this.log("guessed correctly ! +1 %EVADE% [%0]",self.name);
			    roll+=1;
			}
			$("#actiondial").empty();
			lock.resolve(roll);
		    }.bind(this);

		    this.log("guess the number of evades out of %0 dice [%1]",r,self.name);
		    $("#actiondial").empty();
		    for (var i=0; i<r; i++) {
			(function(k) {
			    var e=$("<button>").html(k+" %EVADE%")
				.click(function() { resolve(k);}.bind(this));
			    $("#actiondial").append(e);
			}.bind(this))(i);
		    }
		}.bind(this));
		return lock.promise();
	    }
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
		    }.bind(this)}],"choose to add stress to "+target.name,true);
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
		this.oldskill=this.skill;
		this.log("PS set to 0 [%0]",self.name); 
		this.skill=0;
	    });
	    sh.wrap_before("endactivationphase",this,function() {
		this.skill=this.oldskill;
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
        ship: "A-Wing",
    },
    {
        name: "Proton Rockets",
        type: MISSILE,
	firesnd:"missile",
	requires:"Focus",
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
	}
        
    },
    {
        name: "Jan Ors",
        faction:REBEL,
        unique: true,
        type: CREW,
        points: 2,
	done:true,
	test:"?E,1D%10W5_b;k%10VhdJ;1M%10VHlq;&0%LayHI;&h1Sx4;h1Sx4;h1Sx4;h1Sx4;h1Sx4;h1Sx4#",
	init: function(sh) {
	    var u=sh;
	    u.jan=-1;
	    var aft=Unit.prototype.addfocustoken;
	    Unit.prototype.addfocustoken=function() {
		if (this.getrange(u)<=3&&this.faction==u.faction&&u.jan<round) {
		    this.donoaction(
			[{name:u.name,org:u,type:"FOCUS",action:function(n) { 
			    aft.call(this); 
			    this.endnoaction(n,"FOCUS"); }.bind(this)},
			 {name:u.name,org:u,type:"EVADE",action:function(n) { 
			     this.addevadetoken(); 
			     u.jan=round; 
			     this.endnoaction(n,"EVADE"); }.bind(this)}],
			"select focus or evade token",true);
		} else aft.call(this);
	    }
	},
    },

    {
        name: "R4-D6",
        init: function(sh) {
	    sh.wrap_after("cancelhit",this,function(h,e,org,hh) {
		if (hh>=3) {
		    var d=hh-2;
		    for (var i=0; i<d; i++) sh.addstress();
		    return d;
		}
		return hh;
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
		return this.targeting.indexOf(targetunit)>-1;
	    }.bind(sh), function(m,n) {
		var f=this.getfocusreddice(m);
		this.log("%0 %FOCUS% -> %0 %HIT% [%1]",f,self.name);
		this.removetarget(targetunit);
		return m-100*f+f;
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
	    var bap=sh.beginactivationphase;
	    sh.wrap_before("beginactivationphase",this,function() {
		this.donoaction([{type:MOD,org:mod,name:mod.name,action:function(n) {
		    mod.isactive=false;
		    for (var i=0; i<squadron.length; i++) {
			var u=squadron[i];
			u.oldmaneuver=u.maneuver;
			if (u.team==this.team&&u.getmaneuver().difficulty=="RED") {
			    u.forceddifficulty="WHITE";
			    u.showmaneuver();
			}
		    }
		    this.beginactivationphase.unwrap();
		    this.endnoaction(n,MOD);
		}.bind(this)}]);
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
	candoaction: function() { return true; },
	action: function(n) {
	    var str="";		
	    this.unit.defenseroll(2).done(function(roll) {
		var f=this.getfocusgreendice(roll);
		var e=this.getevadegreendice(roll);
		for (var i=0; i<f; i++) this.unit.addfocustoken(); 
		if (f>0) str+=" +"+f+" %FOCUS%"; 
		for (var i=0; i<e; i++) this.unit.addevadetoken(); 
		if (e>0) str+=" +"+e+" %EVADE%"; 
		if (str=="") this.unit.log("no effect [%0]",this.name); else this.unit.log(str+" [%0]",this.name);
		this.unit.endaction(n,CREW);
	    }.bind(this));
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
			p[i].log("+1 %STRESS [%0]",self.name);
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
        candoaction: function() { return true;	},
	action: function(n) {
	    var self=this;
	    var p=this.unit.selectnearbyunits(2,function(s,t) { return (s.team==t.team)&&s!=t; });
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
	    var cm=sh.completemaneuver;
            sh.completemaneuver= function(dial,realdial,difficulty) {
		var speed=realdial.substr(-1);
		var gd=this.getdial();
		var p=[];
		var q=[];
		q.push(realdial);
		p.push(this.getpathmatrix(this.m,realdial));
		for (var i=0; i<gd.length; i++) 
		    if (gd[i].move.substr(-1)==speed&&gd[i].move!=realdial) { 
			p.push(this.getpathmatrix(this.m,gd[i].move));
			q.push(gd[i].move);
		    }
		if (p.length>1) {
		    this.log("choose maneuver of speed %0 [%1]",speed,self.name);
		    this.resolveactionmove(p,function(t,k) {
			cm.call(t,q[k],q[k],(k==0)?difficulty:"RED");
		    },false,true);
		} else cm.call(this,dial,realdial,difficulty);
	    }
	}
    },
    {
        name: "Dash Rendar",
        faction:REBEL,
        unique: true,
	done:true,
	init: function(sh) {
	    sh.isfireobstructed=function() { return false; }
	    sh.getobstructiondef=function() { return 0; }
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
		    var p=this.unit.selectnearbyunits(2,function(s,t) { return s.team==t.team&&s!=t; });
		    if (p.length==0) {
			this.unit.log("1 reroll [%0]",self.name);
		    }
		    return p.length==0; 
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
	candoaction: function() { return true; },
	action: function(n) {
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
		var p=targetunit.selectnearbyunits(1,function(t,o) { return true; });
		if (p.length>0) {
		    this.resolveactionselection(p,function(k) {
			p[k].log("+1 %HIT% [%0]",self.name);
			p[k].resolvehit(1); p[k].checkdead();
		    });
		}
	    });
	}
    },
    {
        name: "Intimidation",
	done:true,
        init: function(sh) {
	    var unit=this.unit;
	    var self=this;
	    var ga=Unit.prototype.getagility;
	    Unit.prototype.getagility=function() {
		var a=ga.call(this);
		if (this.team!=unit.team&&a>0&&(typeof this.touching!="undefined")) 
		    if (this.touching.indexOf(unit)>-1) {
			this.log("-1 agility [%0]",self.name);
			return a-1;
		    }
		return a;
	    }
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
		if (this.shield==0&&this.hull<this.ship.hull&&this.candoevade()) {
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
	    var fu=sh.faceup;
	    var crew=this;
	    sh.faceup=function(c) {
		var i,cr=[];
		if (c.lethal||this.hull==1) {
		    for (i=0; i<this.upgrades.length; i++) {
			var upg=this.upgrades[i];
			if (upg.type==CREW&&upg!=crew) cr.push(upg);
		    }
		    cr.push(crew);
		    for (i=0; i<cr.length; i++) {
			if (cr[i].isactive) {
			    cr[i].isactive=false;
			    this.log("discard %0 to remove critical %1 [%2]",cr[i].name,c.name,crew.name);
			    this.criticals.slice(this.criticals.indexOf(c),1);
			    return false;
			}
		    }
		}
		return fu.call(this,c);
	    }
	}
    },
    {
        name: "Ion Torpedoes",
	requires:"Target",
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
		var p=this.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.skill<b.skill; });
		p.push(this);
		if (p.length>1&&this.canusefocus()) {
		    this.doselection(function(n) {
			this.log("select pilot (self to cancel) [%0]",self.name);
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
		return this.canusefocus();
	    }.bind(sh),function(m,n) {
		var f=this.getfocusreddice(m);
		if (f>0) {
		    this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
		    return m-100+10;
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
		return true; 
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
	    sh.wrap_after("updateactivationdial",this,function(ad) {
		this.addactivationdial(function() { 
		    return !upg.unit.hasmoved&&upg.isactive; 
		},function() {
		    upg.isactive=false;
		    upg.unit.addstress();
		    upg.unit.completemaneuver("F0","F0","WHITE");
		}, A[ILLICIT.toUpperCase()].key,$("<div>").attr({class:"symbols"}));
		return ad;
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
		if (sh.weapons[sh.activeweapon]==this) return true;
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
		    squadron[r[1][i].unit].log("+1 %HIT% [%0]",self.name);
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
		var p=this.selectnearbyunits(1,function(s,t) { return s.team!=t.team; });
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
	    var greedo=this;
            sh.wrap_after("hashit",this,function(t,h) {
		var d=this.hitresolved+this.criticalresolved-t.shield;
		if (this.greedoa<round&&d>0) {
		    if (this.hitresolved>t.shield) {
			this.log("first damage is a faceup damage [%0]",self.name);
			this.hitresolved--;
			this.criticalresolved++;
			this.greedoa=round;
		    }
		}
		return h;
	    });
	    sh.wrap_after("resolveishit",this,function(t) {
		var d=t.criticalresolved+t.hitresolved-this.shield;
		if (this.greedod<round&&d>0) {
		    if (t.hitresolved>this.shield) {
			this.log("first damage is a faceup damage [%0]",self.name);
			t.hitresolved--;
			t.criticalresolved++;
			this.greedod=round;
		    }
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
	    var fu=sh.faceup;
	    var upg=this;
	    sh.faceup=function(c) {
		var i,cr=[];
		if ((c.lethal||this.hull==1)&&c.type=="ship") {
		    upg.isactive=false;
		    sh.faceup=fu;
		    this.log("remove critical %0 [%1]",c.name,self.name);
		    this.criticals.slice(this.criticals.indexOf(c),1);
		    return false;
		}
		return fu.call(this,c);
	    }
	}
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
	    sh.candropbomb=function() {
		return phase==ACTIVATION_PHASE;
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
	    sh.wrap_after("getdial",this,function(m) {
		var n=[];
		for (var i=0; i<m.length; i++) {
		    var d=m[i].difficulty;
		    var move=m[i].move;
		    if (move.match(/[A-Z]+3/)) 
			d="GREEN";
		    n.push({move:move,difficulty:d});
		}
		return n;
	    });
	},
	uninstall:function(sh) {
	    sh.getdial.unwrap();
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
	init: function(sh) {
	    var self=this;
	    var ch=Unit.prototype.cancelhit;
	    Unit.prototype.cancelhit=function(h,e,u) {
		if (u.weapons[u.activeweapon]==self) {
		    this.log("%HIT% cannot be cancelled by defense dice [%0]",self.name);
		    return h;
		}
		return ch.call(this,h,e,u);
	    };
	},
        range: [1,1],
    },
    {
        name: "R4 Agromech",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("removefocustoken",this,function(id) {
		if (this.target==0&&this.incombat==true) {
		    this.log("free %TARGET% on %0 [%1]",targetunit.name,self.name);
		    this.addtarget(targetunit);
		}
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
			this.log("select unit (self to cancel) [%0]",self.name);
			this.doselection(function(n) {
			    this.resolveactionselection(p,function(k) {
				if (this!=p[k]) {
				    this.addtarget(p[k]);
				    this.log("+1 %TARGET% on %1 [%0]",p[k].name,self.name);
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
		return this.targeting.indexOf(targetunit)>-1; 
	    }.bind(sh),function(m,n) {
		this.log("+1 %CRIT% [%0]",self.name);
		$("#atokens > .xtargettoken").remove();
		return {m:m+10,n:n+1};
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
		if (upg.isactive) { 
		    upg.isactive=false; 
		    this.getagility.unwrap(upg);
		    this.log("%0 is hit => destroyed",upg.name);
		    this.show();
		    this.resolveishit.unwrap(upg);
		}
	    })
	},
        points: 3,
    },
    {
        name: "Shield Upgrade",
	type:MOD,    
	done:true,
	install: function(sh) {
	    sh.shield++;
	},
	uninstall:function(sh) {
	    sh.shield--;
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
		if (upg.isactive) {
		    var roll=this.rollattackdie(1)[0];
		    if (roll=="hit"||roll=="critical") {
			t.log("+1 %HIT% [%0]",upg.name) 
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
	    sh.hull++;
	},     
	uninstall:function(sh) {
	    sh.hull--;
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

    },
    {
        name: "Countermeasures",
	type:MOD,
        islarge:true,
	done:true,
	init: function(sh) {
	    var mod=this;
	    sh.wrap_before("begincombatphase",this,function() {
		if (mod.isactive) {
		    this.donoaction([{action:function(n) {
			mod.isactive=false;
			this.wrap_after("getagility",mod,function(a) {
			    return a+1;
			}).unwrapper("endround");
			if (this.istargeted.length>0) {
			    this.log("select a lock to remove [%0]",mod.name);
			    this.resolveactionselection(this.istargeted,function(k) { 
				this.istargeted[k].removetarget(this);
				this.endnoaction(n,MOD);
			    }.bind(this));
			} else this.endnoaction(n,MOD);
		    }.bind(this),type:mod.type.toUpperCase(),name:mod.name}],"");
		}
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
		if (activeunit.getsector(this)>2) return true;
		return false;
	    }.bind(sh),function(m,n) {
		var b=n-Math.floor(m/10)%10-m%10;
		if (b>0) {
		    this.log("1 <code class='blankgreendice'></code> -> 1 %EVADE% [%0]",self.name);
		    return m+1;
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
		for (i=0; i<squadron.length; i++) 
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
		    sh.weapons[0].isactive=false;
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
	    sh.wrap_after("endmaneuver",this,function() {
		if (this.collision) {
		    this.log("+1 free action [%0]",self.name);
		    this.collision=false;
		    this.doaction(this.getactionlist()).done(function() {
			this.collision=true;
		    }.bind(this));
		}
	    })
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
		for (i=0; i<squadron.length; i++) {
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
			    sh.completemaneuver=u.completemaneuver;
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
	    var i;
	    var self=this;
	    for (i=0; i<sh.weapons.length; i++) if (sh.weapons[i].type==TURRET) break;
	    if (i==sh.weapons.length) return;
	    sh.weapons[i].isTurret=function() { return false; };
	    sh.isTurret=function(w) {
		if (w==sh.weapons[i]) return false;
		return Unit.prototype.isTurret(w);
	    };
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		var i;
		for (i=0; i<this.weapons.length; i++) if (this.weapons[i].type==TURRET) break;
		
		if (i<this.weapons.length&&this.weapons[this.activeweapon].isprimary) {
		    this.log("2nd attack with %0 [%1]",this.weapons[i].name,self.name);
		    this.selecttargetforattack(i);
		}else ea.call(this,c,h);
	    };
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
		    this.log("decloak [%0]",self.name);
		    self.isactive=false;
		    this.wrap_after("getdecloakmatrix",self,function(m,l) {
			return l.concat(m);
		    });
		    this.resolvedecloak();
		}
	    });
	}
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
		      this.log("%0 reroll(s) of %FOCUS% [%1]",this.focus,self.name);
		      return true;
		  } else return false;
		}.bind(sh)
	  );
	  sh.adddefensererolld(
	      this,
	      ["focus"],
	      function() { if (activeunit.skill<=2) return 2; return 1; },
	      function(w,attacker) {
		  if (this.stress>0&&this.canusefocus()) {
		      this.log("%0 reroll(s) of %FOCUS% [%1]",this.focus,self.name);
		      return true;
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
	  var as=sh.addstress;
	  var self=this;
	  sh.wrap_after("addstress",this,function() {
	      /* No stress action ? as.call(this);*/
	      this.stress++;
	      this.donoaction([{type:FOCUS,name:self.name,org:self,
				action:function(n) {
				    self.isactive=false;
				    this.addfocustoken();
				    this.endnoaction(n);
				}.bind(this)},
			       {type:EVADE,name:self.name,org:self,
				action:function(n) {
				    self.isactive=false;
				    this.addevadetoken();
				    this.endnoaction(n);
				}.bind(this)}],
			      "Add %EVADE% or %FOCUS% instead of %STRESS% token",
			      true);
	  });
      }
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
			    u.isactive=false;
			    this.addstress(1);
			    this.m=this.m.rotate(180,0,0);
			    this.show();
			    this.endnoaction(n,ELITE);
			}.bind(this)}]);
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
		target.log("+1 %HIT% [%0]",this.name);
	    }
	    return ch;
	},	
	init: function(sh) {
	    var self=this;
	    var tlt=-1;
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		if (tlt<round&&this.weapons[this.activeweapon]==self) {
		    this.log("2nd attack [%0]",self.name);
		    tlt=round;
		    this.resolveattack(this.activeweapon,targetunit); 
		} else ea.call(this,c,h);
	    }
	}
    },
        {
            name: "Plasma Torpedoes",
            type: TORPEDO,
            points: 3,
            attack: 4,
	    requires:"Target",
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
	    explode: function() {},
	    detonate:function(t) {
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
	}
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
            attack: 3,
            range: [2,2],
	    done:true,
	    init: function(sh) {
		var ahm=this;
		sh.wrap_after("hashit",this,function(t,hh) {
		    if (hh) {
			this.log("+1 %CRIT% [%0]",ahm.name);
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
		sh.wrap_after("getdial",this,function(m) {
		    var n=[];
		    for (var i=0; i<m.length; i++) {
			var move=m[i].move;
			var d=m[i].difficulty;
			if (move.match(/BL\d|BR\d/)) d="GREEN";
			n.push({move:move,difficulty:d});
		    }
		    return n;
		})
	    },
	    uninstall:function(sh) {
		sh.getdial.unwrap(this);
	    },

        },
        {
            name: "Maneuvering Fins",
	    type:MOD,
            points: 1,
            ship: "YV-666",
	    done:true,
	    init: function(sh) {
		var self=this;
		var cm=sh.completemaneuver;
		sh.completemaneuver= function(dial,realdial,difficulty) {
		    if (dial.match(/TR\d|TL\d/)) {
			this.log("change turn into a bank [%0]",self.name);
			var newdial=dial.replace(/T/,"B");
			this.resolveactionmove(
			    [this.getpathmatrix(this.m,realdial),
			     this.getpathmatrix(this.m,newdial)],
			    function(t,k) {
				if (k==0) cm.call(this,dial,realdial,difficulty);
				else cm.call(this,newdial,newdial,difficulty);
			    }.bind(this),false,true);
		    } else cm.call(this,dial,realdial,difficulty);
		}
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
	prehit:function(t,c,h) {
	    var p=this.unit.selectnearbyunits(2,function(a,b) { return a.team==b.team;});
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
    }
];

/* 31/06/15: XW FAQ with Garven Dreis 
*/

var UPGRADE_TYPES={
Elite:"ept",Torpedo:"torpedo",Astromech:"amd",Turret:"turret",Missile:"missile",Crew:"crew",Cannon:"cannon",Bomb:"bomb",Title:"title",Mod:"mod",System:"system",Illicit:"illicit",Salvaged:"salvaged"
};
function Laser(u,type,fire) {
    return new Weapon(u,{
	type: type,
	name:"Laser",
	isactive:true,
	attack: fire,
	range: [1,3],
	isprimary: true
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
	d="<td class='tooltip'>"+formatstring(text)+"</td>";
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
    getrange: function(sh) { 
	var ro=this.getOutlinePoints(this.m);
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
	this.unit.log("dropped "+this.name);
	this.img=s.image("png/"+this.img,-10,-8,20,16);
	if (this.ordnance) this.ordnance=false; else this.isactive=false;
	this.outline=this.getOutline(new Snap.matrix())
	    .attr({display:"block",stroke:halftone(this.unit.color),strokeWidth:2});
	this.g=s.group(this.outline,this.img);
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
		$(".info").css({left:x,top:y}).html(this.name).appendTo("body").show();
	    }.bind(this),
	    function() { $(".info").hide(); 
		       }.bind(this));
	var p=[];
	for (var i=0; i<lm.length; i++) 
	    p.push(this.unit.getpathmatrix(this.unit.m.clone().rotate(180,0,0),lm[i]).translate(0,(this.islarge?20:0)))
	this.resolveactionmove(p, function(k) { 
	    this.g.transform(this.m);
	    this.g.appendTo(VIEWPORT);
	    BOMBS.push($.extend({},this));	 
	}.bind(this));
    },
    getOutlinePoints: function(m) {
	var w=10;
	var p1=transformPoint(m,{x:-w,y:-w});
	var p2=transformPoint(m,{x:w,y:-w});
	var p3=transformPoint(m,{x:w,y:w});
	var p4=transformPoint(m,{x:-w,y:w});	
	this.op=[p1,p2,p3,p4];
	return this.op;
    },
    getOutline: function(m) {
	var p=this.getOutlinePoints(m);
	var pa=s.path("M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+" "+p[2].x+" "+p[2].y+" "+p[3].x+" "+p[3].y+" Z");
	pa.appendTo(VIEWPORT);
	return pa;
    },
    explode: function() {
	this.exploded=true;
	this.unit.log(this.name+" explodes");
	SOUNDS[this.snd].play();
	this.g.remove();
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
	a="<td class='statfire'";
	a+=" onclick='if (!squadron["+i+"].dead) squadron["+i+"].togglehitsector(\""+this.name.replace(/\'/g,"&#39;")+"\")'";
	a+=">"+this.getattack()+"<span class='symbols'>"+A[this.type.toUpperCase()].key+"</span>"
	a+="</td>";
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
	d="<td class='tooltip'>"+formatstring(text)+"</td>";

	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+d+a+"</tr>"; 
	else return "<tr "+c+">"+d+a+b+"</tr>";
    },
    getrequirements: function() {
	return this.requires;
    },
    getattack: function() {
	return this.attack;
    },
    isTurret: function() {
	return this.type=="Turret";
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
		sh.log("+1 defense for range 3 against "+this.unit.name);
		return 1;
	    }
	}
	return 0;
    },
    getrange: function(sh) {
	var i;
	if (!this.canfire(sh)) return 0;
	if (this.isTurret()||this.unit.isTurret(this)) {
	    var r=this.unit.getrange(sh);
	    if (this.isinrange(r)) return r;
	    else return 0;
	}
	var ghs=this.unit.gethitsector(sh);
	if (ghs>=this.range[0]&&ghs<=this.range[1]) return ghs;
	if (this.type=="Bilaser") {
	    var m=this.unit.m.clone();
	    m.rotate(180,0,0);
	    ghs=this.unit.gethitsector(sh,m);
	    if (ghs>=this.range[0]&&ghs<=this.range[1]) return ghs;
	}
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
	log("Added action:"+addedaction);
    }
    if (typeof this.init != "undefined") this.init(sh);
}
function Upgradefromname(sh,name) {
    var i;
    for (i=0; i<UPGRADES.length; i++) {
	if (UPGRADES[i].name==name) {
	    var upg=UPGRADES[i];
	    if (upg.type=="Bomb") return new Bomb(sh,upg);
	    if (typeof upg.isWeapon != "undefined") 
		if (upg.isWeapon()) return new Weapon(sh,upg);
	        else return new Upgrade(sh,i);
	    if (upg.type.match("Turretlaser|Bilaser|Laser|Torpedo|Cannon|Missile|Turret")||upg.isweapon==true) return new Weapon(sh,upg);
	    return new Upgrade(sh,i);
	}
    }
    log("Could not find upgrade "+name);
}
Upgrade.prototype = {
    toString: function() {
	var a,b,str="";
	var c="";
	var d;
	if (!this.isactive) c="class='inactive'"
	a="<td><code class='"+this.type+" upgrades'></code></td>"; 
	var text=UPGRADE_translation[this.name+(this.type=="Crew"?"(Crew)":"")];
	var name=this.name;
	if (typeof text!="undefined"&&typeof text.name!="undefined") name=text.name;
	b="<td class='tdstat'>"+name.replace(/\'/g,"&#39;")+"</td>";
	if (typeof text!="undefined"&&typeof text.text!="undefined") text=text.text; else text="";
	d="<td class='tooltip'>"+formatstring(text)+"</td>";
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
	if (p==PILOTS[i].name&&PILOTS[i].faction=="REBEL") return true;
    return false;
}
var empireonly=function(p) {
    var i;
    for (i=0; i<PILOTS.length; i++) 
	if (p==PILOTS[i].name&&PILOTS[i].faction=="EMPIRE") return true;
    return false;
}
var UPGRADES= [
    {
        name: "Ion Cannon Turret",
        type: "Turret",
	firesnd:"falcon_fire",
        points: 5,
        attack: 3,
	done:true,
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		this.unit.log(this.name+": 1<code class='hit'></code> + 1 ion token assigned to "+target.name);
		target.addiontoken();
	    }
	    return ch;
	},
        range: [1,2],
    },
    {
        name: "Proton Torpedoes",
	requires: "Target",
        type: "Torpedo",
	firesnd:"missile",
        points: 4,
	done:true,
        attack: 4,
	init: function(sh) {
	    sh.addattackmoda(this,function(m,n) {
		return (sh.weapons[sh.activeweapon]==this);
	    }.bind(this),function(m,n) {
		var f=Math.floor(m/100)%10;
		if (f>0) {
		    this.unit.log("Proton Torpedoes: 1 <code class='xfocustoken'></code> -> 1 <code class='critical'></code>");
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
	    sh.gdr2=sh.getdial;
	    sh.getdial=function() {
		var m=sh.gdr2();
		var n=[];
		for (var i=0; i<m.length; i++) {
		    var s=P[m[i].move].speed;
		    var d=m[i].difficulty;
		    if (s==1||s==2) d="GREEN";
		    n.push({ move:m[i].move,difficulty:d});
		}
		return n;
	    }.bind(sh);
	    sh.log(this.name+": 1, 2 speed maneuvers of "+sh.name+" are green");
	},
	uninstall: function(sh) {
	    sh.getdial=sh.gdr2;
	    sh.log(this.name+": uninstalling effect");
	},
        type: "Astromech",
        points: 1,
    },
    {
        name: "R2-D2",
	done:true,
        init: function(sh) {
	    var hd=sh.handledifficulty;
	    sh.handledifficulty=function(d) {
		hd.call(this,d);
		if (d=="GREEN"&&this.shield<this.ship.shield){ 
		    this.shield++;
		    this.log("R2-D2 recovers 1 shield");
		}
	    }
	},
        unique: true,
        type: "Astromech",
        points: 4,
    },
    {
        name: "R2-F2",
        done:true,
	candoaction: function() { return true; },
	action: function(n) {
	    var ga=this.unit.getagility;
	    var er=this.unit.endround;
	    this.unit.log("R2-F2 gives +1 agility until end of round");
	    this.unit.getagility=function() {
		return ga.call(this)+1;
	    };
	    this.unit.endround=function() {
		this.getagility=ga;
		this.endround=er;
		er.call(this);
	    };
	    this.unit.showstats();
	    this.unit.endaction(n,"ASTROMECH");
	    return true;
	},
        unique: true,
        type: "Astromech",
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
	    var r=Math.floor(Math.random()*8);
	    var roll=FACE[DEFENSEDICE[r]];
	    if (roll=="evade" ||roll=="focus") {
		for (i=0; i<this.criticals.length; i++) {
		    var cr=this.criticals[i];
		    if (cr[i].isactive==false) {
			c=i;
			break;
		    }
		}
		if (c>-1) {
		    this.log("R5-D8: repairing 1 <code class='hit'></code>");
		    this.criticals.slice(c,1);
		}
	    }
	    this.endaction(n,"ASTROMECH");
	},
        unique: true,
        type: "Astromech",
        points: 3,
    },
    {
        name: "R5-K6",
        init: function(sh) {
	    var rtt=sh.removetarget;
	    sh.removetarget=function(t) {
		rtt.call(this,t);		    
		var r=Math.floor(Math.random()*8);
		var roll=FACE[DEFENSEDICE[r]];
		if (roll=="evade") {
		    this.addtarget(t);
		    this.log("R5-K6 gives target lock on "+t.name);
		}
	    }
	},
	done:true,
        unique: true,
        type: "Astromech",
        points: 2,
    },
    {
        name: "R5 Astromech",
	done:true,
        init: function(sh) {
	    var er=sh.endround;
	    sh.endround=function() {
		var c=-1,cl=-1;
		for (i=0; i<this.criticals.length; i++) {
		    var cr=this.criticals[i];
		    if (cr[i].isactive&&cr[i].type=="ship") {
			c=i;
			if (cr[i].lethal) { cl=i; break; }
		    }
		}
		if (cl>-1) {
		    this.log("R5 Astromech: repairing critical "+this.criticals[cl].name);
		    this.criticals[cl].facedown();
		} else if (c>-1) {
		    this.log("R5 Astromech: repairing critical "+this.criticals[c].name);
		    this.criticals[c].facedown();
		}
		er.call(this);
	    }
	},
        type: "Astromech",
        points: 1,
    },
    {
        name: "Determination",
	done:true,
        init: function(sh) {
	    var fu=sh.faceup;
	    sh.faceup=function(c) {
		if (c.type!="pilot") return fu.call(this,c); 
		this.log("Determination: discarding critical "+c.name);
		this.criticals.slice(this.criticals.indexOf(c),1);
		return false;
	    };
	},
        type: "Elite",
        points: 1,
    },
    {
        name: "Swarm Tactics",
        type: "Elite",
        points: 2,
	done:true,
	init: function(sh) {
	    var bcp=sh.begincombatphase;
	    sh.begincombatphase= function() {
		var p=sh.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.skill>b.skill; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("<b>"+this.name+" sets a pilot skill to the skill of "+this.name+"</b>");
			this.resolveactionselection(p,function(k) {
			    var u=p[k];
			    u.log("has "+this.skill+" pilot skill");
			    this.u=u;
			    this.oldskill=u.skill;
			    u.skill=this.skill;
			    filltabskill();
			    u.show();
			    var ecp=this.endcombatphase;
			    this.endcombatphase=function() {
				this.u.skill=this.oldskill;
				filltabskill();
				this.u.show();
				this.endcombatphase=ecp;
				ecp.call(this)
			    };
			    this.endnoaction(n,"ELITE");
			    }.bind(this));
			}.bind(this));
		} 
		return bcp.call(this);
	    }
	}
    },
    {
        name: "Squad Leader",
        unique: true,
	done:true,
        type: "Elite",
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
		this.unit.log("<b>"+this.name+" selects 1 target lock to remove</b>");
		this.unit.resolveactionselection(this.unit.istargeted,function(k) {
		    var unit=this.istargeted[k];
		    unit.removetarget(this);
		    this.resolveroll(n);
		}.bind(this.unit));
	    } else this.unit.resolveroll(n);
	},        
        type: "Elite",
	done:true,
        points: 2,
    },
    {
        name: "Marksmanship",
	init: function(sh) {
	    this.mark=-1;;
	    sh.addattackmoda(this,function(m,n) {
		    return (this.mark==round);
		}.bind(this),function(m,n) {
		    var f=Math.floor(m/100)%10;
		    if (f>0&&this.mark==round) {		
			this.unit.log("Marksmanship: "+f+" <code class='xfocustoken'></code> -> 1 <code class='critical'></code>"+(f>1?"+ "+(f-1)+"<code class='hit'></code>":""));
			return m-100*f+10+(f-1); 
		    } 
		    return m;
		}.bind(this),false,"focus");
	},
	candoaction: function() { return true; },
	action: function(n) {
	    this.mark=round;
	    this.unit.endaction(n,"ELITE");
	},
        done:true,
        type: "Elite",
        points: 3,
    },
    {
        name: "Concussion Missiles",
	requires:"Target",
        type: "Missile",
	firesnd:"missile",
        points: 4,
        attack: 4,
	done:true,
	init: function(sh) {
	    var missile=this;
	    sh.addattackmoda(this,function(m,n) {
		return sh.weapons[sh.activeweapon]==this;
	    }.bind(this), function(m,n) {
		var b=n-m%100-Math.floor(m/10)%10-m%10;
		if (b>0) return m+1; else return m;
	    },false,"blank");
	},
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        type: "Missile",
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
		ea.call(this,c,h);
		if (r<round&&this.weapons[this.activeweapon]==m) {
		    this.log(m.name+": 2nd attack");
		    r=round;
		    this.resolveattack(this.activeweapon,targetunit); 
		}
	    }
	},
        range: [1,2],
    },
    {
        name: "Daredevil",
	done:true,
        candoaction: function() { return true; },
	action: function(n) {
	    this.unit.log("<b>"+this.name+" selects maneuver to perform</b>");
	    this.unit.resolveactionmove(
		[this.unit.getpathmatrix(this.unit.m,"TL1"),
		 this.unit.getpathmatrix(this.unit.m,"TR1")],
		function(t,k) { 
		    if (k==-1) return t.endaction(n,"ELITE");
		    t.addstress(); 
		    if (t.shipactionList.indexOf("BOOST")==-1) {
			t.log("Daredevil: 2 rolls for damage");
			for (var i=0; i<2; i++) {
			    var r=Math.floor(Math.random()*8);
			    var roll=FACE[ATTACKDICE[r]];
			    if (roll=="hit") { t.resolvehit(1); t.checkdead(); }
			    else if (roll=="critical") { 
				t.resolvecritical(1);
				t.checkdead();
			    }
			}
		    }
		    t.endaction(n,"ELITE");
		},true,true);
	},
        type: "Elite",
        points: 3,
    },
    {
        name: "Elusiveness",
        
        type: "Elite",
        points:2,
    },
    {
        name: "Homing Missiles",
	requires:"Target",
        type: "Missile",
	firesnd:"missile",
        attack: 4,
        range: [2,3],
	done:true,
	init: function(sh) {
	    var ra=sh.resolveattack;
	    var wp=this;
	    sh.resolveattack=function(w,targetunit) {
		if (this.weapons[w]==wp) {
		    this.cufhm=targetunit.canuseevade;
		    this.log("Homing Missile: "+targetunit.name+" cannot use evade tokens");
		    targetunit.canuseevade=function() { return false; };
		}
		ra.call(this,w,targetunit);
	    };
	    var ea=this.endattack;
	    this.endattack=function(c,h) {
		ea.call(this,c,h);
		targetunit.canuseevade=this.unit.cufhm;
	    }
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
	    sh.doaction= function(la) {
		var dar=da.call(this,la)
		dar.then(function(r) {
		    if (r!=null&&ptl.r!=round) {
			ptl.r=round;
			var dac=da.call(this,this.getactionbarlist());
			dac.done(function(rr) { 
			    if (rr!=null) this.addstress();
			    else ptl.r=-1;
			}.bind(this));
			return dac;
		    } else return dar;
		}.bind(this));
	    }
	},
	done:true,
        type: "Elite",
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
        type: "Elite",
        points: 1,
    },
    {
        name: "Expose",
        candoaction: function() { return true; },
	action: function(n) {
	    var ga=this.unit.getagility;
	    var w=this.unit.weapons[0];
	    var gat=w.getattack;
	    var endround=this.unit.endround;
	    this.unit.log(this.name+" gives -1 agility, +1 primary attack until end of turn");
	    this.unit.getagility=function() {
		var a=ga.call(this)-1;
		if (a>=0) return a; else return 0;
	    };
	    w.getattack=function() {
		return gat.call(w)+1;
	    };
	    this.unit.endround=function() {
		this.getagility=ga;
		w.getattack=gat;
		this.endround=endround;
		endround.call(this);
	    }
	    this.unit.showstats();
	    this.unit.endaction(n,"ELITE");
	},
	done:true,
        type: "Elite",
        points: 4,
    },
    {
        name: "Gunner",
	done:true,
        init: function(sh) {
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		ea.call(this,c,h);
		if ((c+h==0)&&this.hasfired<2) {
		    this.log("Gunner: 2nd attack with primary weapon");
		    this.selecttargetforattack(0); 
		} 
	    }
	},
        type: "Crew",
        points: 5,
    },
    {
        name: "Ion Cannon",
        type: "Cannon",
	firesnd:"slave_fire",
	done:true,
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		this.unit.log(this.name+": 1<code class='hit'></code> + 1 ion token assigned to "+target.name);
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
        type: "Cannon",
	firesnd:"slave_fire",
	done:true,
	modifydamagegiven: function(ch) {
	    if (ch>10) {
		var c=Math.floor(ch/10)%10;
		this.unit.log(this.name+": "+c+"<code class='critical'></code>-> "+c+"<code class='hit'></code>");
		ch=ch-9*c;
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
        explode: function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		var i;
		BOMBS.splice(BOMBS.indexOf(this),1);
		Bomb.prototype.explode.call(this);
		for (i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].resolvehit(1);
		    squadron[r[1][i].unit].checkdead();
		}
	    }
	},
        type: "Bomb",
        points: 2,
    },
    {
        name: "Mercenary Copilot",
        init: function(sh) {
	    sh.addattackmoda(this,function(m,n) {
		if (this.getrange(targetunit)==3) return true;
		return false;
	    }.bind(sh),function(m,n) {
		if (m%10>0) return m+9; else return m;
	    },false,"hit");

	},
	done:true,
        type: "Crew",
        points: 2,
    },
    {
        name: "Assault Missiles",
        type: "Missile",
	requires:"Target",
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		this.unit.log(this.name+": 1 damage assigned to all units at range 1 of "+t.name);
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
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
        type: "Elite",
        points: 1,
    },
    {
        name: "Proximity Mines",
        
        type: "Bomb",
        points: 3,
    },
    {
        name: "Weapons Engineer",
        
        type: "Crew",
        points: 3,
    },
    { /* TODO: a ship is still hit if crit is transferred ? */
        name: "Draw Their Fire",
        init: function(sh) {
	    var ea=Unit.prototype.resolvecritical;
	    Unit.prototype.resolvecritical=function(c) {
		//log("c?"+c+" team?"+(this.team==sh.team)+" range?"+this.getrange(sh));
		if (c>0&&this.team==sh.team&&sh!=this&&this.getrange(sh)==1){
		    this.log("<b>Draw Their Fire: select unit that takes critical</b>");
		    this.doselection(function(n) {
			this.resolveactionselection([this,sh],function(k) {
			    if (k==0) { ea.call(this,1); this.log("takes critical");}
			    else { ea.call(sh,1);sh.log("takes critical");}
			    this.endnoaction(n,"CREW");
			}.bind(this));
		    }.bind(this));
		    ea.call(this,c-1);
		} else ea.call(this,c);
		return c;
	    }
	}, 
	done:true,
        type: "Elite",
        points: 1,
    },
    {
        name: "Luke Skywalker",
        faction:"REBEL",
        unique: true,
	done:true,
        init: function(sh) {
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		ea.call(this,c,h);
		if ((c+h==0)&&this.hasfired<2) {
		    this.log("Luke Skywalker attacks again with primary weapon");
		    this.selecttargetforattack(0);
		} 
	    };
	    sh.addattackmoda(this,function(m,n) {
		if (this.hasfired==2) return true;
		return false;
	    }.bind(sh),function(m,n) {
		if (m>100) return m-99; else return m;
	    },false,"focus");
	},
        type: "Crew",
        points: 7,
    },
    {
        name: "Nien Nunb",
	faction:"REBEL",
	done:true,
        install: function(sh) {
	    var i;
	    sh.getdial=function() {
		var m=Unit.prototype.getdial.call(this);
		var n=[];
		for (var i=0; i<m.length; i++) {
		    var move=m[i].move;
		    var d=m[i].difficulty;
		    if (move.match("F1|F2|F3|F4|F5")) d="GREEN";
		    n.push({move:move,difficulty:d});
		}
		return n;
	    }.bind(sh);
	},
	uninstall:function(sh) {
	    sh.getdial=Unit.prototype.getdial;
	},
        unique: true,
        type: "Crew",
        points: 1,
    },
    {
        name: "Chewbacca",
        faction:"REBEL",
        unique: true,
	done:true,
        type: "Crew",
	init: function(sh) {
	    var upg=this;
	    var ac=sh.applycritical;
	    var ad=sh.applydamage;
	    sh.applydamage=function(n) {
		if (n>0&&this.hull==1) {
		    upg.isactive=false;
		    if (this.shield<this.ship.shield) this.shield++;
		    this.log("Chewbacca: +1 <code class='cshield'></code>, -1 <code class='hit'></code>");
		    this.applydamage=ad;
		    if (n>1) ad.call(this,n-1);
		} else ad.call(this,n);
	    }
	    sh.applycritical=function(n) {
		if (n>0) {
		    s=this.selectdamage(true);
		    CRITICAL_DECK[s].count--;
		    if (this.hull==1||CRITICAL_DECK[s].lethal) {
			upg.isactive=false;
			if (this.shield<this.ship.shield) this.shield++;
      			this.log("Chewbacca: +1 <code class='cshield'></code>, -1 <code class='critical'></code> "+CRITICAL_DECK[s].name);
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
        type: "Torpedo",
	firesnd:"missile",
        attack: 5,
	done:true,
        range: [1,1],
	init: function(sh) {
	    sh.addattackmoda(this,function(m,n) {
		return (sh.weapons[sh.activeweapon]==this);
	    }.bind(this),function(m,n) {
		var r=m%10+(Math.floor(m/10)%10)+(Math.floor(m/100)%10);
		if (n-r>0) {
		    this.unit.log("Advanced Proton Torpedoes change "+(n-r)+" blanks by focus");
		    if (n-r<3) m+=(n-r)*100; else m+=300;
		}
		return m;
	    }.bind(this),false,"blank");
	},        
        points: 6,
    },
    {
        name: "Autoblaster",
        type: "Cannon",
	done:true,
	firesnd:"slave_fire",
        attack: 3,
	init: function(sh) {
	    var ch=Unit.prototype.cancelhit;
	    Unit.prototype.cancelhit=function(h,e,u) {
		if (u.weapons[u.activeweapon].name=="Autoblaster Turret") {
		    this.log("Autoblaster Turret: Hits cannot be cancelled by defense dice");
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
	    var fcs=sh.cleanupattack;
	    sh.cleanupattack=function() {
		this.log("Fire-Control System gives free target lock on "+targetunit.name);
		this.addtarget(targetunit);
		fcs.call(this);
	    };
	},
        type: "System",
        points: 2,
    },
    {
        name: "Blaster Turret",
        type: "Turret",
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
	    var af=sh.addfocus;
	    sh.addfocus=function(n) {
		sh.addfocustoken();
		return af.call(this,n);
	    }
	},
	done:true,
        type: "Crew",
        points: 3,
    },
    {
        name: "Saboteur",
        type: "Crew",
	done:true,
	candoaction:function() { 
	    var a=this.unit.selectnearbyunits(1,function(a,b) { return a.team!=b.team; });
	    return a.length>0;
	}, 
	action: function(n) {
	    var p=this.unit.selectnearbyunits(1,function(a,b) { return a.team!=b.team; });
	    if (p.length>0) {		
		this.unit.log(this.name+": select unit in range 1");
		this.unit.resolveactionselection(p,function(k) {
		    var i,q=[];
		    for (i=0; i<p[k].criticals.length; i++) 
			if (p[k].criticals[i].isactive==false) q.push(p[k].criticals[i]);
		    log("found "+q.length+" damage cards");
		    if (q.length>0) {
			var r=Math.floor(Math.random()*q.length);
			p[k].log("Saboteur: turning faceup one damage card");
			p[k].faceup(q[r]);
			p[k].show();
		    } else p[k].log("Saboteur: no damage card");
		    this.endaction(n,"CREW");
		}.bind(this));
	    } else this.endaction(n,"CREW");
	},
        points: 2,
    },
    {
        name: "Intelligence Agent",
        
        type: "Crew",
        points: 1,
    },
    {
        name: "Proton Bombs",
        done:true,
	snd:"explode",
	img:"proton.png",
        explode: function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		BOMBS.splice(BOMBS.indexOf(this),1);
		Bomb.prototype.explode.call(this);
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].applycritical(1);
		    squadron[r[1][i].unit].checkdead();
		}
	    }
	},
        type: "Bomb",
        points: 5,
    },
    {
        name: "Adrenaline Rush",
	done:true,
        init: function(sh) {
	    var uad=sh.updateactivationdial;
	    var upg=this;

	    sh.updateactivationdial=function() {
		var ad=uad.call(this);
		this.addactivationdial(function() { 
		    return !upg.unit.hasmoved&&upg.isactive&&upg.unit.maneuver>-1&&(upg.unit.getdial()[upg.unit.maneuver].difficulty=="RED"); 
		},function() {
		    upg.unit.log(upg.name+" changes red into white maneuver");
		    var d=upg.unit.getdial()[upg.unit.maneuver]; 
		    upg.isactive=false;
		    var c  =C["WHITE"];
		    if (!(activeunit==this)) c = halftone(c);
		    upg.unit.dialspeed.attr({text:P[d.move].speed,fill:c});
		    upg.unit.dialdirection.attr({text:P[d.move].key,fill:c});
		    upg.unit.completemaneuver(d.move,d.move,"WHITE");
		}, A["ELITE"].key, $("<div>").attr({class:"symbols"}));
		return ad;
	    }
	},        
        type: "Elite",
        points: 1,
    },
    {
        name: "Advanced Sensors",
	done:true,
        init: function(sh) {
	    var ba=sh.beginactivation;
	    var dema=sh.doendmaneuveraction;
	    var upg=this;
	    sh.beginactivation=function() {
		if (this.candoaction()) 
		    this.doaction(this.getactionlist()).done(function(r) {
		    if (r==null) sh.doendmaneuveraction=dema; 
		    else sh.doendmaneuveraction=function() { }
		}.bind(this))
		ba.call(this);
	    }
	},
        type: "System",
        points: 3,
    },
    {
        name: "Sensor Jammer",
        init: function(sh) {
	    sh.addattackmodd(this,function(m,n) {
		return (targetunit==this);
	    }.bind(sh),function(m,n) {
		var h=m%10;
		if (h>0) {
		    this.unit.log("Sensor Jammer: 1 <code class='hit'></code> -> 1 <code class='xfocustoken'></code>");
		    return m+99;
		}
		return m;
	    }.bind(this),"hit");
	},
	done:true,
        type: "System",
        points: 4,
    },
    {
        name: "Darth Vader",
        faction:"EMPIRE",
        unique: true,
	done:true,
	init: function(sh) {
	    var cla=sh.cleanupattack;
	    var mod=this;
	    sh.cleanupattack=function() {
		if (this.hasfired) 
		    this.donoaction([{org:mod,type:"CREW",name:mod.name,action:function(n) {
			targetunit.log("Darth Vader gives +1 critical"); 
			this.resolvehit(2);
			SOUNDS.explode.play();
			targetunit.resolvecritical(1);
			this.checkdead();
			targetunit.checkdead();
			this.endnoaction(n,"CREW");
		    }.bind(this)}],"Darth Vader gives +2 hits");
		cla.call(this);
	    };
	},
        type: "Crew",
        points: 3,
    },
    {
        name: "Rebel Captive",
	faction:"EMPIRE",
	done:true,
        init: function(sh) {
	    var ih=sh.ishit;
	    sh.rebelcaptive=0;
	    sh.ishit=function(t) {
		if (this.rebelcaptive!=round) {//First attack this turn
		    t.log("Rebel Captive gives +1 stress");
		    t.addstress();
		    this.rebelcaptive=round;
		}
		return ih.call(this,t);
	    }.bind(sh);
	},
        unique: true,
        
        type: "Crew",
        points: 3,
    },
    {
        name: "Flight Instructor",
        init: function(sh) {
	    sh.adddefensererolld(
		this,
		["focus"],
		function() { if (activeunit.skill<=2) return 2; return 1; },
		function(w,attacker) {
		    this.unit.log("Flight Instructor: +"+(activeunit.skill<=2?2:1)+" reroll(s)");
		    return true;
		}.bind(this),
		false
	    )
	},
	done:true,
        type: "Crew",
        points: 4,
    },
    {
        name: "Navigator",
        init: function(sh) {
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
		    this.log("<b>Navigator chooses maneuver of bearing "+bearing+"</b>");
		    this.resolveactionmove(p,
		    function(t,k) {
			cm.call(t,q[k],q[k],difficulty);
		    },false,true);
		} else cm.call(this,dial,realdial,difficulty);
	    }
	},
	done:true,
        type: "Crew",
        points: 3,
    },
    {
        name: "Opportunist",
	done:true,
        init: function(sh) {
	    var gas=sh.getattackstrength;
	    sh.getattackstrength=function(w,t) {
		var a=gas.call(this,w,t);
		if (t.focus+t.evade==0) {
		    a=a+1;
		    this.addstress();
		    this.log("Opportunist gives +1 attack against "+t.name+", +1 stress");
		}
		return a;
	    };
	},
        type: "Elite",
        points: 4,
    },
    {
        name: "Ion Pulse Missiles",
	requires:"Target",
        type: "Missile",
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		this.unit.log(this.name+": 2<code class='hit'></code> + 1 ion token assigned by "+t.name);
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
	    var bcp=sh.begincombatphase;
	    sh.begincombatphase= function() {
		var p=this.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&b.stress>0; });
		if (p.length>0) {
		    this.doselection(function(n) {
			this.log("<b>Wingman selects a pilot with stress to remove.</b>");
		    	this.resolveactionselection(p,function(k) {
			    p[k].removestresstoken();
			    this.endnoaction(n,"ELITE");
			}.bind(this));
		    }.bind(this));
		} 
		return bcp.call(this);
	    }
	},
        type: "Elite",
        points: 2,
    },
    {
        name: "Decoy",
        init: function(sh) {
	    var bcp=sh.begincombatphase;
	    sh.begincombatphase= function() {
		var p=this.selectnearbyunits(2,function(a,b) { return a.team==b.team&&a!=b; });
		if (p.length>0) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("<b>Decoy select a pilot to exchange skill with (or self to cancel)</b>");
			this.resolveactionselection(p,function(k) {
			    if (p[k]!=this) {
				var s=this.skill;
				this.skill=p[k].skill;
				p[k].skill=s;
				filltabskill();
				p[k].showstats();
				this.showstats();
				var ecp=this.endcombatphase;
				this.endcombatphase=function() {
				    ecp.call(this);
				    var s=this.skill;
				    this.skill=p[k].skill;
				    p[k].skill=s;
				    this.showstats();
				    p[k].showstats();
				    this.endcombatphase=ecp;
				}.bind(this);
			    }
			    this.endnoaction(n,"ELITE");
			}.bind(this));
		    }.bind(this));
		} 
		return bcp.call(this);
	    }
	},
	done:true,
        type: "Elite",
        points: 2,
    },
    {
        name: "Outmaneuver",
	done:true,
        init: function(sh) {
	    var gds=Unit.prototype.getdefensestrength; 
	    Unit.prototype.getdefensestrength=function(i,t) {
		var d=gds.call(this,i,t);
		if (t==sh) {
		    if(!this.isinfiringarc(t)&&t.isinfiringarc(this)&&d>0) {
			this.log("-1 defense due to Outmaneuver");
			return d-1;
		    } 
		}
		return d;
	    }
	},
        type: "Elite",
        points: 3,
    },
    {
        name: "Predator",
	done:true,
        init: function(sh) {
	    sh.addattackrerolla(
		this,
		["blank","focus"],
		function() { if (targetunit.skill<=2) return 2; return 1; },
		function(w,defender) {
		    this.log("Predator: "+(targetunit.skill<=2?2:1)+" reroll(s)");
		    return true;
		}.bind(sh),
		false
	    )
	},
        type: "Elite",
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
	requires:"Target",
        type: "Torpedo",
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
              
        type: "Astromech",
        points: 2,
    },
    {
        name: "R7-T1",
	candoaction: function() { return true; },	    
	action: function(n) {
		//log("R7-T1 preactivated");
		var p=this.unit.selectnearbyunits(2,function(a,b) { return a.team!=b.team; });
		//log("R7-T1 activated");
		if (p.length>0) {
		    p.push(this.unit);
		    this.unit.log("<b>R7-T1 acquires target lock on target enemy ship (self to ignore)</b>");
		    this.unit.resolveactionselection(p,function(k) {
			if (p[k]!=this) { 
			    if (p[k].isinfiringarc(this)) this.addtarget(p[k]);
			    this.resolveboost(n);
			} else this.endaction(n,"ASTROMECH");
		    });
		} else this.unit.endaction(n,"ASTROMECH");
	},
	done:true,
        unique: true,
        type: "Astromech",
        points: 3,
    },
    {
        name: "Tactician",
        type: "Crew",
	limited:true,
        points: 2,
	done:true,
        init: function(sh) {
	    var tac = sh.endattack;
	    sh.endattack=function(c,h) {
		tac.call(this);
		if (this.gethitsector(targetunit)==2) {
		    targetunit.addstress();
		    targetunit.log("Tactician: +1 stress");
		}
	    }.bind(sh);
	}
    },
    {
        name: "R2-D2",
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 4,
        
    },
    {
        name: "C-3PO",
        unique: true,
        faction:"REBEL",
        type: "Crew",
        points: 3,
        
    },
    {
        name: "R3-A2",
	done:true,
        init: function(sh) {
	    var da=sh.declareattack;
	    sh.declareattack=function(w,target) {
		da.call(this,w,target);
		if (this.isinfiringarc(target)) {
		    this.addstress();
		    this.log("[R3-A2] +1 stress");
		    target.log("[R3-A2] +1 stress");
		    target.addstress();
		}
	    }
	},
        unique: true,
        type: "Astromech",
        points: 2,
    },
    {
        name: "R2-D6",
        upgrades:["Elite"],
	noupgrades:"Elite",
	skillmin:3,
	done:true,
        unique: true,
        type: "Astromech",
        points: 1,
    },
    {
        name: "Enhanced Scopes",
	done:true,
        init: function(sh) {
	    var bap=sh.beginactivationphase;
	    var eap=sh.endactivationphase;
	    sh.beginactivationphase=function() {
		this.oldskill=this.skill;
		this.log("Enhanced Scopes sets pilot skill set to 0"); 
		this.skill=0;
		bap.call(this);
	    };
	    sh.endactivationphase=function() {
		this.skill=this.oldskill;
		eap.call(this);
	    };
	},
        type: "System",
        points: 1,
    },
    {
        name: "Chardaan Refit",
        type: "Missile",
	done:true,
	isWeapon: function() { return false; },
        points: -2,
        ship: "A-Wing",
    },
    {
        name: "Proton Rockets",
        type: "Missile",
	firesnd:"missile",
	requires:"Focus",
        points: 3,
        attack: 2,
	done:true,
	getattack: function() {
	    a=this.attack;
	    if (this.unit.agility<=3) a+=this.unit.agility;
	    else a+=3;
	    //this.unit.log("Proton Rockets: +"+(this.unit.agility>3?3:this.unit.agility)+" attack for agility");
	    return a;
	},
        range: [1,1],
    },
    {
        name: "Kyle Katarn",
        faction:"REBEL",
        unique: true,
	done:true,
        type: "Crew",
        points: 3,
	init: function(sh) {
	    var rst=sh.removestresstoken;
	    sh.removestresstoken=function() {
		rst.call(this);
		this.addfocustoken();
	    }.bind(sh);
	}
        
    },
    {
        name: "Jan Ors",
        faction:"REBEL",
        unique: true,
        type: "Crew",
        points: 2,
    },

    {
        name: "R4-D6",
        init: function(sh) {
	    var ch=sh.cancelhit;
	    sh.cancelhit=function(h,e,org) {
		var h=ch.call(this,h,e,org);
		if (h>=3) {
		    var d=h-2;
		    for (var i=0; i<d; i++) sh.addstress();
		    return d;
		}
		return h;
	    };
	},
	done:true,
        unique: true,
        type: "Astromech",
        points: 1,
    },
    {
        name: "R5-P9",
	done:true,
        init: function(sh) {
	    var upg=this;
	    var ecp=sh.endcombatphase;
	    sh.endcombatphase=function() {
		if (this.canusefocus()&&this.shield<this.ship.shield) {
		    this.shield++;
		    this.log("R5-P9: 1 <code class='xfocustoken'></code> -> 1 <code class='cshield'></code>");
		    this.removefocustoken();
		}
		ecp.call(this);
	    }.bind(sh);
	},        
        unique: true,
        type: "Astromech",
        points: 3,
    },
    {
        name: "Han Solo",
        faction:"REBEL",
	init: function(sh) {
	    sh.addattackmoda(this,function(m,n) { 
		return this.targeting.indexOf(targetunit)>-1;
	    }.bind(sh), function(m,n) {
		var f=Math.floor(m/100);
		this.log("Han Solo: "+f+"<code class='xfocustoken'></code> -> "+f+"<code class='hit'></code>");
		this.removetarget(targetunit);
		return m-99*f;
	    }.bind(sh),false,"target");
	},
        type: "Crew",
        unique: true,
        done:true,
        points: 2,
    },
    { /* TODO: buggy */
        name: "Leia Organa",
        faction:"REBEL",
        type: "Crew",
        unique: true,
	done:true,
	init: function(sh) {
	    var mod=this;
	    var bap=sh.beginactivationphase;
	    sh.beginactivationphase=function() {
		this.donoaction([{type:"MOD",org:mod,name:mod.name,action:function(n) {
		    mod.isactive=false;
		    for (var i=0; i<squadron.length; i++) {
			var u=squadron[i];
			u.oldmaneuver=u.maneuver;
			if (u.team==this.team&&u.getdial()[u.maneuver].difficulty=="RED") {
			    u.forceddifficulty="WHITE";
			    u.showmaneuver();
			}
		    }
		    this.endnoaction(n,"MOD");
		}.bind(this)}]);
		sh.beginactivationphase=bap;
		return bap.call(this);
	    };
	},
        points: 4,
    },
    {
        name: "Targeting Coordinator",
        type: "Crew",
        limited: true,
        points: 4,
    },

    {
        name: "Lando Calrissian",
        faction:"REBEL",
        type: "Crew",
        unique: true,
	done:true,
	candoaction: function() { return true; },
	action: function(n) {
	    var str="";
	    for (var i=0; i<2; i++) {
		var r=Math.floor(Math.random()*8);
		var roll=FACE[DEFENSEDICE[r]];
		if (roll=="focus") { this.unit.addfocustoken(); str+=" +1 <code class='xfocustoken'></code>"; }
		if (roll=="evade") { this.unit.addevadetoken(); str+=" +1 <code class='xevadetoken'></code>"; }
	    } 
	    if (str=="") this.unit.log(this.name+": no effect"); else this.unit.log(this.name+": "+str);
	    this.unit.endaction(n,"CREW");
	},
        points: 3,
    },
    {
        name: "Mara Jade",
        faction:"EMPIRE",
        type: "Crew",
        unique: true,
	done:true,
        init: function(sh) {
	    var ecp=sh.endcombatphase;
	    sh.endcombatphase=function() {
		var p=this.gettargetableunits(1);
		var i;
		if (p.length>0) this.log("Mara Jade: +1 stress for all enemies in range 1");
		for (i=0; i<p.length; i++) {
		    if (p[i].stress==0) p[i].addstress();
		}
		ecp.call(this);
	    }.bind(sh);
	},
        points: 3,
    },
    {
        name: "Fleet Officer",
        faction:"EMPIRE",
        type: "Crew",
	done:true,
        candoaction: function() {
	    return true;
	},
	action: function(n) {
	    var p=this.unit.selectnearbyunits(2,function(s,t) { return (s.team==t.team)&&s!=t; });
	    if (p.length>0) {
		if (p.length==2) {
		    p[0].addfocustoken(); p[1].addfocustoken();
		    this.unit.addstress();
		    this.unit.endaction(n,"CREW");
		} else {
		    this.unit.log("<b>Fleet Officer selects 2 units to give focus</b>");
		    this.unit.resolveactionselection(p,function(k) {
			p[k].addfocustoken();
			p.splice(k,1);
			if (p.length>0) 
			    this.resolveactionselection(p,function(l) {
				p[l].addfocustoken();
				this.addstress();
				this.endaction(n,"CREW");
			    }.bind(this));
			else this.endaction(n,"CREW");
		    }.bind(this.unit))
		}
	    } else this.unit.endaction(n,"CREW");
	},
        points: 3,
    },
    {
        name: "Stay On Target",
        type: "Elite",
        points: 2,
	done:true,
	init: function(sh) {
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
		    this.log("<b>Stay on target chooses maneuver of speed "+speed+"</b>");
		    this.resolveactionmove(p,function(t,k) {
			cm.call(t,q[k],q[k],(k==0)?difficulty:"RED");
		    },false,true);
		} else cm.call(this,dial,realdial,difficulty);
	    }
	}
    },
    {
        name: "Dash Rendar",
        faction:"REBEL",
        unique: true,
	done:true,
	init: function(sh) {
	    sh.isfireobstructed=function() { return false; }
	    sh.getobstructiondef=function() { return 0; }
	},
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Lone Wolf",
	done:true,
	init: function(sh) {
	    sh.addattackrerolla(
		this,
		["blank"],
		function() { return 1;},
		function(w,defender) {
		    var p=this.unit.selectnearbyunits(2,function(s,t) { return s.team==t.team&&s!=t; });
		    if (p.length==0) {
			this.unit.log("Lone Wolf: 1 reroll");
		    }
		    return p.length==0; 
		}.bind(this),
		false
	    )
	},
        unique: true,
        type: "Elite",
        points: 2,
    },
    {
        name: "'Leebo'",
        faction:"REBEL",
        unique: true,
	candoaction: function() { return true; },
	action: function(n) {
	    this.unit.log(this.name+": free boost and ion token");
	    this.unit.addiontoken();
	    this.unit.resolveboost(n);
	},
	done:true,
        type: "Crew",
        points: 2,
        
    },
    {
        name: "Ruthlessness",
        faction:"EMPIRE",
        type: "Elite",
        points: 3,
	done:true,
        init: function(sh) {
	    var ruth = sh.endattack;
	    sh.endattack=function(c,h) {
		ruth.call(this);
		var p=targetunit.selectnearbyunits(1,function(t,o) { return true; });
		if (p.length>0) {
		    this.resolveactionselection(p,function(k) {
			p[k].log("Ruthlessness gives +1 hit");
			p[k].resolvehit(1); p[k].checkdead();
		    });
		}
	    }.bind(sh);
	}
    },
    {
        name: "Intimidation",
	done:true,
        init: function(sh) {
	    var unit=this.unit;
	    var ga=Unit.prototype.getagility;
	    Unit.prototype.getagility=function() {
		var a=ga.call(this);
		if (this.team!=unit.team&&a>0&&(typeof this.touching!="undefined")) 
		    if (this.touching.indexOf(unit)>-1) {
			this.log("Intimidation gives -1 agility");
			return a-1;
		    }
		return a;
	    }
	},
        type: "Elite",
        points: 2,
    },
    {
        name: "Ysanne Isard",
        faction:"EMPIRE",
        unique: true,
	done:true,
	init: function(sh) {
	    var bcp=sh.begincombatphase;
	    sh.begincombatphase=function() {
		if (this.shield==0&&this.hull<this.ship.hull&&this.candoevade()) {
		    this.addevadetoken();
		    this.log("Ysanne Isard: +1 free evade");
		}
		return bcp.call(this);
	    }.bind(sh);
	},
	done:true,
        type: "Crew",
        points: 4,
        
    },
    {
        name: "Moff Jerjerrod",
        faction:"EMPIRE",
        unique: true,
	done:true,
        type: "Crew",
        points: 2,
	init: function(sh) {
	    var fu=sh.faceup;
	    var crew=this;
	    sh.faceup=function(c) {
		var i,cr=[];
		if (c.lethal||this.hull==1) {
		    for (i=0; i<this.upgrades.length; i++) {
			var upg=this.upgrades[i];
			if (upg.type=="Crew"&&upg!=crew) cr.push(upg);
		    }
		    cr.push(crew);
		    for (i=0; i<cr.length; i++) {
			if (cr[i].isactive) {
			    cr[i].isactive=false;
			    this.log("Moff Jerjerrod: discard "+cr[i].name+" to remove critical "+c.name);
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
        type: "Torpedo",
	firesnd:"missile",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		this.unit.log(this.name+": 1 ion token for all units at range 1");
		t.addiontoken();
		var r=t.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
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
        faction:"SCUM",
        unique: true,
	done:true,
	init: function(sh) {
	    var bcp=sh.begincombatphase;
	    sh.begincombatphase= function() {
		var p=this.selectnearbyunits(1,function(a,b) { return a.team==b.team&&a!=b&&a.skill<b.skill; });
		p.push(this);
		if (p.length>1&&this.canusefocus()) {
		    this.doselection(function(n) {
			this.log("<b>select pilot for +1 agility</b>");
			this.resolveactionselection(p,function(k) {
			    if (this!=p[k]) {
				p[k].agility++;
				this.removefocustoken();
				this.show();
				var ecp=p[k].endcombatphase;
				p[k].endcombatphase=function() {
				    ecp.call(this);
				    this.agility--;
				    this.showstats();
				    p[k].endcombatphase=ecp;
				}.bind(p[k]);
			    }
			    this.endnoaction(n,"ELITE");
			}.bind(this));
		    }.bind(sh));
		}
		return bcp.call(this);
	    }
	},
        type: "Elite",
        points: 2,
        
    },
    {
        name: "Calculation",
	done:true,
        init: function(sh) {
	    sh.addattackmoda(this,function(m,n) {
		return this.canusefocus();
	    }.bind(sh),function(m,n) {
		var f=Math.floor(m/100)%10;
		if (f>0) {
		    this.unit.log("Calculation: 1 <code class='xfocustoken'></code> -> 1 <code class='critical'></code>");
		    return m-90;
		}
		return m;
	    }.bind(this),false,"focus");
	},   
        type: "Elite",
        points: 1,
    },
    {
        name: "Accuracy Corrector",
	init: function(sh) {
	    sh.addattackadd(this,function(m,n) {
		return true;
	    }.bind(this),function(m,n) {
		this.unit.log("Accuracy Corrector replaces all dice by 2 <code class='hit'></code>");
		return {m:2,n:2};
	    }.bind(this),"hit");
	},                
	done:true,
        type: "System",
        points: 3,
    },
    {
        name: "Inertial Dampeners",
	done:true,
        init: function(sh) {
	    var uad=sh.updateactivationdial;
	    var upg=this;

	    sh.updateactivationdial=function() {
		var ad=uad.call(this);
		this.addactivationdial(function() { return !upg.unit.hasmoved&&upg.isactive; },
				       function() {
					   upg.isactive=false;
					   upg.unit.addstress();
					   upg.unit.completemaneuver("F0","F0","WHITE");					   
				       }, 
				       A["ILLICIT"].key,
				       $("<div>").attr({class:"symbols"}));
		return ad;
	    }
	},
        type: "Illicit",
        points: 1,
    },
    {
        name: "Flechette Cannon",
        type: "Cannon",
	firesnd:"slave_fire",
	done:true,
	modifydamageassigned: function(ch,t) {
	    if (ch>0) {
		ch=1;
		t.log(this.name+": +1<code class='hit'></code> and +1 stress token");
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
        type: "Cannon",
	firesnd:"slave_fire",
        points: 4,
        attack: 3,
	done:true,
	init: function(sh) {
	    sh.addattackmoda(this,function(m,n) {
		if (sh.weapons[sh.activeweapon]==this) return true;
		return false;
	    }.bind(this),function(m,n) {
		var h=m%10;
		if (h>0) {
		    this.unit.log("'Mangler' Cannon: 1 <code class='hit'></code> -> 1 <code class='critical'></code>");
		    return m+9;
		}
		return m;
	    }.bind(this),false,"hit");
	},
        range: [1,3],
    },
    {
        name: "Dead Man's Switch",
	done:true,
        init: function(sh) {
	    var di=sh.dies;
	    sh.dies=function() {
		var i;
		var r=sh.getrangeallunits();
		di.call(this);
		this.log("Dead Man's Switch: 1 damage for all units in range 1");
		for (i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].applydamage(1);
		}
	    };
	},
        type: "Illicit",
        points: 2,
    },
    {
        name: "Feedback Array",
        type: "Illicit",
	done:true,
        init: function(sh) {
	    var bcp=sh.begincombatphase;
	    sh.begincombatphase=function() {
		var p=this.selectnearbyunits(1,function(s,t) { return s.team!=t.team; });
		if (p.length>0) {
		    p.push(this);
		    this.doselection(function(n) {
			this.log("<b>Feedback Array selects target unit (or self to cancel)</b>")
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
			    this.endnoaction(n,"ILLICIT");
			}.bind(this))
		    }.bind(this));
		}
		return bcp.all(this);
	    }
	},
        points: 2,
    },
    {
        name: "'Hot Shot' Blaster",
	done:true,
        isWeapon: function() { return true;},
	isTurret:function() { return true;},
	endattack: function(c,h) { this.isactive=false; },
        type: "Illicit",
	firesnd:"xwing_fire",
        points: 3,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Greedo",
        faction:"SCUM",
        unique: true,
        type: "Crew",
        
        points: 1,
    },
    {
        name: "Salvaged Astromech",   
        type: "Salvaged",
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
		    this.log("Salvaged Astromech: removes critical "+c.name);
		    this.criticals.slice(this.criticals.indexOf(c),1);
		    return false;
		}
		return fu.call(this,c);
	    }
	}
    },
    {
        name: "Bomb Loadout",
        upgrades:["Bomb"],
	done:true,
	isWeapon: function() { return false; },
        limited: true,
        type: "Torpedo",
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
        type: "Salvaged",
        points: 0,
    },
    {
        name: "Unhinged Astromech",
        type: "Salvaged",
	done:true,
        install: function(sh) {
	    var i;
	    sh.gd=sh.getdial;
	    sh.getdial=function() {
		var m=sh.gd();
		var n=[];
		for (i=0; i<m.length; i++) {
		    var d=m[i].difficulty;
		    var move=m[i].move;
		    if (move.match("F3|TL3|TR3|BL3|BR3|SR3|SR3|K3")) 
			d="GREEN";
		    n.push({move:move,difficulty:d});
		}
		return n;
	    };
	},
	uninstall:function(sh) {
	    sh.getdial=sh.gd;
	},
        points: 1,
    },
    {
        name: "R4-B11",
        unique: true,
        type: "Salvaged",
        points: 3,
    },
    {
        name: "Autoblaster Turret",
        type: "Turret",
	firesnd:"falcon_fire",
	done:true,
        points: 2,
        attack: 2,
	init: function(sh) {
	    var ch=Unit.prototype.cancelhit;
	    Unit.prototype.cancelhit=function(h,e,u) {
		if (u.weapons[u.activeweapon].name=="Autoblaster Turret") {
		    this.log("Autoblaster Turret: Hits cannot be cancelled by defense dice");
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
	    sh.usefocusattack=function(id) {
		if (this.target==0) {
		    this.log("R4 Agromech adds free target lock");
		    this.addtarget(targetunit);
		    /* TODO: add target token ? */
		}
		Unit.prototype.usefocusattack.call(this,id);
	    };
	    sh.declareattack=function(wp,t) {
		var r=this.weapons[wp].getrequirements();
		if ((typeof r !="undefined")&&"Focus".match(r)&&this.canusefocus(t)) {
		    this.log("R4 Agromech adds free target lock");
		    this.addtarget(t);
		}
		Unit.prototype.declareattack.call(this,wp,t);
	    };
	},
        type: "Salvaged",
        points: 2,
    },
    {
        name: "K4 Security Droid",
        faction:"SCUM",
        type: "Crew",
	done:true,
        init: function(sh) {
	    var hd=sh.handledifficulty;
	    sh.handledifficulty=function(d) {
		if (d=="GREEN") {
		    var p=this.gettargetableunits(3);
		    if (p.length>0) {
			p.push(this);
			this.log("K4 Security Droid selects unit to target lock (self to cancel)");
			this.doselection(function(n) {
			    this.resolveactionselection(p,function(k) {
				if (this!=p[k]) {
				    this.addtarget(p[k]);
				    this.log("locks target "+p[k].name);
				}
				this.endnoaction(n,"CREW");
			    }.bind(this));
			}.bind(this));
		    }  else {
			this.log("no available target for K4 Security Droid");
		    }
		}
		hd.call(this,d);

	    }
	},
        points: 3,
    },
    {
        name: "Outlaw Tech",
        faction:"SCUM",
        limited: true,
	done:true,
        type: "Crew",
        init: function(sh) {
	    sh.handledifficulty=function(d) {
		Unit.prototype.handledifficulty(d);
		if (d=="RED") sh.addfocustoken();
	    }
	},
        points: 2,
    },
    {
        name: "Advanced Targeting Computer",
        type: "System",
        points: 5,
	init: function(sh) {
	    sh.addattackadd(this,function(m,n) { 
		return this.targeting.indexOf(targetunit)>-1; 
	    }.bind(sh),function(m,n) {
		this.log("Advanced Targeting Computer adds +1 critical");
		$("#atokens > .xtargettoken").remove();
		return {m:m+10,n:n+1};
	    }.bind(sh),"critical")
	},
        ship: "TIE Advanced",
	done:true
    },
    {
        name: "Stealth Device",
	type:"Mod",
	done:true,
	install:function(sh) {
	    sh.agility++;
	},
	uninstall:function(sh) {
	    sh.agility--;
	},
	init: function(sh) {
	    sh.log(this.name+": +1 agility")
	    var ih=sh.ishit;
	    sh.ishit=function(t) {
		var i;
		for (i=0;i<this.upgrades.length; i++) 
		    if (this.upgrades[i].name=="Stealth Device") break;
		if (this.upgrades[i].isactive) { 
		    this.upgrades[i].isactive=false; 
		    this.agility--;
		    this.log(this.upgrades[i].name+" is hit => equipment destroyed");
		    this.show();
		}
		ih.call(this,t);
	    }.bind(sh);
	},
        points: 3,
    },
    {
        name: "Shield Upgrade",
	type:"Mod",    
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
	type:"Mod",
	done:true,
	addedaction:"Boost",
        points: 4,
    },
    {
        name: "Anti-Pursuit Lasers",
	type:"Mod",
        islarge:true,
	done:true,
        points: 2,
	init: function(sh) {
	    var upg=this;
	    var cb=sh.collidedby;
	    sh.collidedby=function(t) {
		if (upg.isactive) {
		    var r=Math.floor(Math.random()*8);
		    var roll=FACE[ATTACKDICE[r]];
		    if (roll=="hit"||roll=="critical") {
			t.log(upg.name+": +1 <code class='hit'></code>") 
			    t.resolvehit(1);
			t.checkdead();
		    }
		}
		cb.call(sh,t);
	    }
	}
    },
    {
        name: "Targeting Computer",
	type:"Mod",
	done:true,
	addedaction:"Target",
        points: 2,
    },
    {
        name: "Hull Upgrade",
	type:"Mod",
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
	type:"Mod",
        init: function(sh) {
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		ea.call(this,c,h);
		if (!this.weapons[this.activeweapon].isprimary&&(c+h==0)) {
		    this.log("Munitions Failsafe: "+this.weapons[this.activeweapon].name+" still active");
		    this.weapons[this.activeweapon].isactive=true;
		    this.show();
		}
	    }
	},
	done:true,
        points: 1,
    },
    {
        name: "Stygium Particle Accelerator",
	type:"Mod",
	done:true,
        init: function(sh) {
	    var rc=sh.addcloak;
	    var rdc=sh.resolvedecloak;
	    sh.resolvedecloak=function() {
		rdc.call(this);
		if (this.candoevade()) {
		    this.doaction([this.newaction(this.addevade,"EVADE")],
				  "Stygium P.A.: +1 <code class='xevadetoken'></code>");
		}
	    }.bind(sh);
	    sh.addcloak=function(n) {
		rc.call(this,n);
		if (this.candoevade()) 
		    this.doaction([this.newaction(this.addevade,"EVADE")],
				  "Stygium P.A.: +1 <code class='xevadetoken'></code>");
	    }.bind(sh)
	},
        points: 2,
    },
    {
        name: "Advanced Cloaking Device",
	type:"Mod",
        points: 4,
	done:true,
	init: function(sh) {
	    var cla=sh.cleanupattack;
	    var upg=this;
	    sh.cleanupattack=function() {
		if (this.candoaction()&&this.candocloak()) {
		    this.doaction([this.newaction(this.addcloak,"CLOAK")],"Advanced Cloaking Device: free cloack action");
		}
		cla.call(this);
	    }
	},
        ship: "TIE Phantom",
    },
    {
        name: "B-Wing/E2",
	type:"Mod",
	done:true,
        upgrades:["Crew"],
        points: 1,
        ship: "B-Wing",

    },
    {
        name: "Countermeasures",
	type:"Mod",
        islarge:true,
	done:true,
	init: function(sh) {
	    var mod=this;
	    var bcp=sh.begincombatphase;
	    sh.begincombatphase=function() {
		if (mod.isactive) {
		    this.donoaction([{action:function(n) {
			mod.isactive=false;
			var er=this.endround;
			this.agility++;
			this.endround=function() {
			    this.agility--;
			    this.endround=er;
			    er.call(this);
			}.bind(this);
			if (this.istargeted.length>0) {
			    this.log("<b>Select a lock to remove</b>");
			    this.resolveactionselection(this.istargeted,function(k) { 
				this.istargeted[k].removetarget(this);
				this.endnoaction(n,"MOD");
			    }.bind(this));
			} else this.endnoaction(n,"MOD");
		    }.bind(this),type:mod.type.toUpperCase(),name:mod.name}],"");
		}
		return bcp.call(this);
	    }.bind(sh);
	},
        points: 3,
    },
    {
        name: "Experimental Interface",
	type:"Mod",
        unique: true,
        points: 3,
	init: function(sh) {
	    var upg=this;
	    upg.r=-1;
	    var ea=sh.endaction;
	    sh.endaction= function(n,type) {
		if (upg.r!=round) {
		    upg.r=round;
		    this.log(upg.name+": select an action or Skip to cancel");
		    this.doaction(this.getupgactionlist()).done(function(type) {
			if (type!=null) this.addstress(); else upg.r=-1;
		    }.bind(this));
		}
		ea.call(this,n,type);
	    };
	},
	done:true
    },
    {
        name: "Tactical Jammer",
	type:"Mod",
        islarge:true,
        points: 1,
    },
    {
        name: "Autothrusters",
	type:"Mod",
        actionrequired:"Boost",
        points: 2,
	done:true,
	init: function(sh) {
	    sh.adddefensemodd(this,function(m,n) {
		    if (activeunit.gethitsector(this)>2) return true;
		    return false;
		}.bind(sh),function(m,n) {
		var b=n-Math.floor(m/10)%10-m%10;
		if (b>0) {
		    this.log("Autothrusters: 1 <code class='blank'></code> -> 1 <code class='xevadetoken'></code>");
		    return m+1;
		}
		return m;
	    }.bind(sh),false,"blank");
	}
    },
    {
        name: "Slave I",
        type:"Title",
        unique: true,
        points: 0,
	done:true,
        ship: "Firespray-31",
	upgrades:["Torpedo"],
    },
    {
        name: "Millennium Falcon",
        type:"Title",
	done:true,
	addedaction:"Evade",
        unique: true,
        points: 1,
        ship: "YT-1300",
    },
    {
        name: "Moldy Crow",
        type:"Title",
        init: function(sh) {
	    var er=sh.endround;
	    sh.endround=function() {
		this.evade=0;
		if (this.focus>0) this.log("Moldy Crow keeps focus tokens");
		this.showinfo();
		er.call(this);
	    };
	},
        unique: true,
	done:true,
        points: 3,
        ship: "HWK-290",
    },
    {
        name: "ST-321",
        type:"Title",
	done:true,
        init: function(sh) {
	    var cdt=sh.candotarget;
	    sh.candotarget=function() {
		cdt.call(this);
		return true;
	    };
	    sh.resolvetarget=function(n) {
		var i; var p=[];
		for (i=0; i<squadron.length; i++) 
		    if (squadron[i].team!=this.team) p.push(squadron[i]);
		if (p.length>0) {
		    this.log("ST-321 can target any unit on area");
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
        type:"Title",
	done:true,
        upgrades:["Mod"],
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
        type:"Title",
	done:true,
        upgrades:["Elite"],
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
        type:"Title",
	done:true,
        init: function(sh) {
	    var i;
	    for (i=0; i<sh.weapons.length; i++) {
		if (sh.weapons[i].type=="Cannon") {
		    sh.weapons[0].isactive=false;
		    sh.log(this.name+" sets primary weapon inactive");
		    sh.weapons[i].isTurret= function() { return true; };
		    sh.log(this.name+" can fire in 360 degrees");
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
        type:"Title",
	done:true,
        init: function(sh) {
	    var em=sh.endmaneuver;
	    sh.endmaneuver=function() {
		em.call(this);
		if (this.collision) {
		    this.log("Dauntless adds free action when colliding with another unit.");
		    this.collision=false;
		    this.doaction(this.getactionlist()).done(function() {
			this.collision=true;
		    }.bind(this));
		}
	    }
	},
        unique: true,
        points: 2,
        ship: "VT-49 Decimator",
    },
    {
        name: "Virago",
        type:"Title",
	done:true,
        upgrades:["Illicit","System"],
        unique: true,
        points: 1,
	skillmin:4,
        ship: "StarViper",
    },
    {
        name: "'Heavy Scyk' Interceptor",
	done:true,
        upgrades:["Cannon|Torpedo|Missile"],
        type:"Title",
        points: 2,
        ship: "M3-A Interceptor",

    },
    {
        name: 'IG-2000',
        type:"Title",
        
        points: 0,
        ship: "Aggressor",
    },
    {
        name: "BTL-A4 Y-Wing",
        type:"Title",
	done:true,
        init: function(sh) {
	    var i;
	    for (i=0; i<sh.weapons.length; i++) if (sh.weapons[i].type=="Turret") break;
	    if (i==sh.weapons.length) return;
	    sh.weapons[i].isTurret=function() { return false; };
	    sh.isTurret=function(w) {
		if (w==sh.weapons[i]) return false;
		return Unit.prototype.isTurret(w);
	    };
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		var i;
		for (i=0; i<this.weapons.length; i++) if (this.weapons[i].type=="Turret") break;
		
		if (i<this.weapons.length&&this.hasfired<2&&this.weapons[this.activeweapon].isprimary) {
		    this.log("BTL-A4 Y-Wing gives 2nd attack with secondary weapon");
		    this.selecttargetforattack(i);
		}
		ea.call(this,c,h);
	    };
	},
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "Andrasta",
        type:"Title",
	done:true,
        upgrades:["Bomb","Bomb"],
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: "TIE/x1",
        type:"Title",
	done:true,
        upgrades:["System"],
	pointsupg:-4,
        points: 0,
        ship: "TIE Advanced",
    },
    {
        name: "Emperor Palpatine",
        type:"Crew",
	unique:true,
	takesdouble:true,
        points: 8,
        faction: "EMPIRE"
    },
        {
            name: "Extra Munitions",
            type: "Torpedo",
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
            type: "Bomb",
            points: 4,
        },
        {
            name: "Glitterstim",
            type: "Illicit",
            points: 2,
        },
        {
            name: "Bossk",
            unique: true,
            faction: "SCUM",
            type: "Crew",
            points: 2,
        },
        {
            name: "Lightning Reflexes",
            type: "Elite",
            points: 1,
	    done:true,
	    init: function(sh) {
		var hd=sh.handledifficulty;
		var u=this;
		sh.handledifficulty=function(d) {
		    hd.call(this,d);
		    if (d=="WHITE"||d=="GREEN") {
			this.donoaction([{type:"ELITE",name:u.name,org:u,action:function(n) {
			    u.isactive=false;
			    this.addstress(1);
			    this.m=this.m.rotate(180,0,0);
			    this.show();
			    this.endnoaction(n,"ELITE");
			}.bind(this)}]);
		    };
		}
	    },
	    islarge:false,
        },
    {
	name: "Twin Laser Turret",
	type: "Turret",
	points: 6,
	done:true,
	attack: 3,
	range: [2,3],
	modifydamageassigned: function(ch,target) {
	    if (ch>0) {
		ch=1;
		this.unit.log(this.name+": 1<code class='hit'></code> assigned to "+target.name);
	    }
	    return ch;
	},	
	init: function(sh) {
	    var m=this;
	    var tlt=-1;
	    var ea=sh.endattack;
	    sh.endattack=function(c,h) {
		ea.call(this,c,h);
		if (tlt<round) {
		    tlt=round;
		    this.log("active:"+this.weapons[this.activeweapon].name);
		    if (this.weapons[this.activeweapon]==m) {
			this.log(m.name+": 2nd attack");
			this.resolveattack(this.activeweapon,targetunit); 
		    }
		}
	    }
	}
    },
        {
            name: "Plasma Torpedoes",
            type: "Torpedo",
            points: 3,
            attack: 4,
            range: [2,3]
        },
    {
	name: "Ion Bombs",
	type: "Bomb",
	points: 2,
	done:true,
	img:"proton.png",
	explode: function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		BOMBS.splice(BOMBS.indexOf(this),1);
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
            type: "Bomb",
            points: 4,
        },
    {
	name: "Bombardier",
	type: "Crew",
	points: 1,
	done:true,
	init:function(sh) {
	    var gbl=sh.getbomblocation;
	    sh.getbomblocation=function() {
		var d=gbl.call(this);
		if (d.indexOf("F1")>-1) return d.concat("F2");
		return d;
	    }
	}
    },
        {
            name: "'Crack Shot'",
            type: "Elite",
            points: 1,
        },
        {
            name: "Advanced Homing Missiles",
            type: "Missile",
            points: 3,
            attack: 3,
            range: [2,2]
        },
   {
       name: "Advanced SLAM",
       type:"Mod",
       done:true,
       points: 2,
       init: function(sh) {
	   var da=sh.doaction;
	   sh.doaction= function(la) {
	       var dar=da.call(this,la)
	       dar.then(function(r) {
		       if (r=="SLAM"&&this.ocollision.overlap==-1
			   &&this.ocollision.template==0
			   &&!this.collision) {
			   return da.call(this,this.getactionbarlist());
		       } else return dar;
		   }.bind(this));
	   }
       }
   },
        {
            name: "Twin Ion Engine Mk. II",
	    type:"Mod",
            points: 1,
	    ship: "TIE",
	    done:true,
            install: function(sh) {
		var i;
		sh.getdial=function() {
		    var m=Unit.prototype.getdial.call(this);
		    var n=[];
		    for (var i=0; i<m.length; i++) {
			var move=m[i].move;
			var d=m[i].difficulty;
			if (move.match("BL2|BR2|BL3|BR3|BL1|BR1")) d="GREEN";
			n.push({move:move,difficulty:d});
		    }
		    return n;
		}.bind(sh);
	    },
	    uninstall:function(sh) {
		sh.getdial=Unit.prototype.getdial;
	    },

        },
        {
            name: "Maneuvering Fins",
       type:"Mod",
            points: 1,
            ship: "YV-666",
        },
       {
            name: "Hound's Tooth",
            points: 6,
	    type:"Title",
            unique: true,
            ship: "YV-666",
        }
];

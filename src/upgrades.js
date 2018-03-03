/* jshint esversion: 6 */
/* 31/06/15: XW FAQ with Garven Dreis 
TODO: desactivate  and unwrapping.
Unit.prototype for old pilots and upgrades

*/
var Unit=window.Unit || {};
var Mustache=window.Mustache || {};

const UPGRADE_TYPES={
    Elite:"ept",Torpedo:"torpedo",Astromech:"amd",Turret:"turret",Missile:"missile",Crew:"crew",Cannon:"cannon",Bomb:"bomb",Title:"title",Mod:"mod",System:"system",Illicit:"illicit",Salvaged:"salvaged",Tech:"tech"
};
function AUXILIARY(i,m) { return this.getPrimarySectorString(i,m.clone().rotate(this.arcrotation,0,0));}
function SUBAUXILIARY(i,j,m) { return this.getPrimarySubSectorString(i,j,m.clone().rotate(this.arcrotation,0,0)); }


function Bomb(sh,bdesc) {
	$.extend(this,bdesc);
	sh.upgrades.push(this);
	this.isactive=true;
	this.wrapping=[];
	this.unit=sh;
	sh.bombs.push(this);
	this.exploded=false;
	//if (this.init != undefined) this.init(sh);
};
Bomb.prototype = { 
    wrap_before:Unit.prototype.wrap_before,
    wrap_after:Unit.prototype.wrap_after,
    setclickhandler:Unit.prototype.setclickhandler,
    setdefaultclickhandler:Unit.prototype.setdefaultclickhandler,
    addDrag:Rock.prototype.addDrag,
    unDrag:Rock.prototype.unDrag,
    unselect:Rock.prototype.unselect,
    select:Rock.prototype.select,
    dragmove:Rock.prototype.dragmove,
    dragstart:Rock.prototype.dragstart,
    dragshow:Rock.prototype.dragshow,
    dragstop:Rock.prototype.dragstop,
    showhitsector:Rock.prototype.showhitsector,
    showpanel() { },
    isWeapon() { return false; },
    isBomb() { return true; },
    showOrdnance() { return this+1; },
    aiactivate() {
        var victims = [], ship;
        var bRange = 0;
        if(this.canbedropped()){  // Probably dropping early
            // Fill in with maneuver-drop bomb logic
            bRange=3;
        }
        else if(this.candoaction()){ // Probably dropping after closing
            // Fill in with action-drop bomb logic
            bRange=2;
        }
        for(var i in squadron){
            ship=squadron[i];
            if(this.unit.isenemy(ship)
                    &&((this.unit.getrange(ship)<=bRange && !this.unit.isinprimaryfiringarc(ship))
                    ||this.unit.getrange(ship)<=1) // For Deathrain
                    )
                victims.push(ship);
        }
        return victims.length>0;
    },
    canbedropped() { return this.isactive&&!this.unit.hasmoved&&this.unit.lastdrop!=round; },
    desactivate() { this.isactive=false;this.unit.movelog("D-"+this.unit.upgrades.indexOf(this)); },
    getBall() {
	var b=this.g.getBBox();
	return {x:b.x+b.width/2,y:b.y+b.height/2,diam:Math.max(b.width/2,b.height/2)};
    },
    actiondrop(n) {
	this.unit.lastdrop=round;
	$(".bombs").remove(); 
	this.drop(this.unit.getbomblocation(this),n);
	//this.unit.showactivation();
    },
    toString() {
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	return Mustache.render(TEMPLATES.bomb, this);
    },
    getrangeallunits() { 
	var range=[[],[],[],[],[]],i;
	for (i in squadron) {
	    var sh=squadron[i];
	    var k=this.getrange(sh);
	    if (k>0) range[k].push({unit:i});
	}
	return range;
    },
    getcollisions() {
	var ob=this.getOutlineString();
	var p=[];
	for (var i in squadron) {
	    var u=squadron[i];
	    var so=u.getOutlineString(u.m);
	    var os=so.s;
	    var op=so.p;
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.unit.isPointInside(ob.s,op)
		||this.unit.isPointInside(os,ob.p)) {
		p.push(u); 
	    }

	}
	return p;
    },
    getrange(sh) { 
	var ro=this.getOutlineString(this.m).p;
	var rsh = sh.getOutlinePoints(sh.m);
	var min=90001;
	var i,j;
	var mini,minj;
	for (i=0; i<ro.length; i++) {
	    for (j=0; j<4; j++) {
		var d=dist(rsh[j],ro[i]);
		if (d<min) min=d;
	    }
	}
	if (min>90000) return 4;
	if (min<=10000) return 1; 
	if (min<=40000) return 2;
	return 3;
    },
    resolveactionmove(moves,cleanup) {
	var i;
	this.pos=[];
	var resolve=function(m,k,f) {
	    this.m=m;
	    for (i=0; i<moves.length; i++) this.pos[i].remove();
	    f(this,k);
	}.bind(this);
        if(this.unit.ia){ // Reduce possible bomb locations 
            moves=this.unit.chooseBombDrop(moves);
        }
	if (moves.length==1) {
	    this.pos[0]=this.getOutline(moves[0]).attr({fill:this.unit.color,opacity:0.7});
	    resolve(moves[0],0,cleanup);
	} else {
	    for (i=0; i<moves.length; i++) {
	    (function(k) {
		this.pos[k]=this.getOutline(moves[k]).attr({fill:this.unit.color,opacity:0.7});
		this.pos[k].hover(
		    function() {this.pos[k].attr({stroke:this.unit.color,strokeWidth:"4px"});}.bind(this),
		    function() {this.pos[k].attr({strokeWidth:"0"});}.bind(this));
		
		this.pos[k].click(
		    function() { resolve(moves[k],k,cleanup); });
	    }.bind(this))(i);

	    }
	}
    },
    drop(lm,n) {
	var dropped=this;
	if (this.ordnance>0) { 
	    this.ordnance-=1; 
	    dropped=$.extend({},this);
	} else this.desactivate();
	dropped.resolveactionmove(this.unit.getbombposition(lm,this.size), function(k) {
	    this.display(0,0);
	    this.unit.bombdropped(this);
	    //this.unit.log("endaction dropped "+n);
	    if (typeof n!="undefined") this.unit.endaction(n,"DROP");
	}.bind(dropped),false,true);
    },
    display(x,y) {
	if (x!==0||y!==0) this.m=this.m.clone().translate(x,y);
	this.img1=s.image("png/"+this.img,-this.width/2,-this.height/2,this.width,this.height);
	this.outline=this.getOutline(new Snap.Matrix())
	    .attr({display:"block","class":"bombanim",stroke:halftone(BLUE),strokeWidth:2,fill:"rgba(8,8,8,0.3)"});
	this.g=s.group(this.outline,this.img1);
	this.g.hover(function () { 
	    var m=VIEWPORT.m.clone();
	    var w=$("#svgout").width();
	    var h=$("#svgout").height();
	    var startX=0;
	    var startY=0;
	    if (h>w) startY=(h-w)/2;
	    else startX=(w-h)/2;
	    var max=Math.max(GW/w,GH/h);
	    
	    var bbox=this.g.getBBox();
	    var p=$("#svgout").position();
	    var x=m.x(bbox.x,bbox.y-20)/max;
	    x+=p.left+startX;
	    var y=m.y(bbox.x,bbox.y-20)/max;
	    y+=p.top+startY;
	    this.outline.attr({stroke:BLUE});
	    $(".info").css({left:x,top:y}).html(this.name).appendTo("body").show();
	}.bind(this), function() { 
	    $(".info").hide(); 
	    this.outline.attr({stroke:halftone(BLUE)});
	}.bind(this));
	this.g.transform(this.m);
	this.g.appendTo(VIEWPORT);
        // Drag setup
        var b=this.g.getBBox();
        this.o=[];
        var scale=0.27; // Magic number stolen from Rock constructor
	for (var k=1; k<4; k++) {
	    this.o[k]=s.ellipse(0,0,100*k+b.width/2,100*k+b.height/2).attr({pointerEvents:"none",display:"none",fill:WHITE,opacity:0.3,strokeWidth:2});
	}
	this.g.attr("display","block");
	BOMBS.push(this);
	if (this.stay) {
	    OBSTACLES.push(this);
	    var p=this.getcollisions();
	    if (p.length>0) this.unit.resolveactionselection(p,function(k) {
                this.preexplode(true,[p[k],true]);
		this.detonate(p[k],true);
                this.postexplode(true,[p[k],true]);
	    }.bind(this));
	}
    },
    getOutline(m) {
	return s.path(this.getOutlineString(m).s).appendTo(VIEWPORT);
    },
    getOutlineString(m) {
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
    explode_base() {
	this.exploded=true;
	this.unit.log("%0 explodes",this.name);
	SOUNDS[this.snd].play();
	this.g.remove();
	BOMBS.splice(BOMBS.indexOf(this),1);
    },
    preexplode(isMine,args) {$(document).trigger("preexplode"+this.unit.team,[this,isMine,args]); },
    postexplode(isMine,args) {$(document).trigger("postexplode"+this.unit.team,[this,isMine,args]); },
    explode() { this.explode_base(); },
    detonate(t,immediate) {
	OBSTACLES.splice(OBSTACLES.indexOf(this),1);
	this.explode_base();
    },
    endround() {},
    show() {}
}
function Weapon(sh,wdesc) {
	this.isprimary=false;
	this.issecondary=true;
	$.extend(this,wdesc);
	sh.upgrades[sh.upgrades.length]=this;
	this.wrapping=[];
	this.ordnance=0;
	//log("Installing weapon "+this.name+" ["+this.type+"]");
	this.isactive=true;
	this.unit=sh;
	this.lastattackroll = -1;

	sh.weapons.push(this);
}

function Laser(u,type,fire) {
    var t={
	type: type,
	name:"Laser",
	isactive:true,
	attack: fire,
	range: [1,3],
	isprimary: true,
	issecondary:false
    };
    switch(type) {
    case "Bilaser":
    case "Mobilelaser":
	t.auxiliary=AUXILIARY;
	t.subauxiliary=SUBAUXILIARY;
	break;
    case "Laser180":
	t.auxiliary = function(i,m) { return this.getHalfRangeString(i,m); };
	t.subauxiliary = function(i,j,m)  { return this.getHalfSubRangeString(i,j,m); };
	break;
    default: break;
    };
    return new Weapon(u,t);
}

Weapon.prototype={
    wrap_before:Unit.prototype.wrap_before,
    wrap_after:Unit.prototype.wrap_after,
    isBomb() { return false; },
    isWeapon() { return true; },
	showOrdnance() { return this+1; },
    desactivate() {
	if (this.ordnance>0&&this.type.match(/Torpedo|Missile|Bomb|Illicit/)) {
	    this.ordnance-=1;
	} else { this.isactive=false; /*this.unit.movelog("D-"+this.unit.upgrades.indexOf(this)); this.unit.show();*/ }
    },
    toString() {
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	if (this.isactive) {
	    var i,r=this.getrangeallunits();
	    for (i=0; i<r.length; i++) if (r[i].isenemy(this.unit)) break;
	    if (i==r.length) this.nofire=true; else this.nofire=false;
	}
	this.attackkey=A[this.type.toUpperCase()].key;
	this.req=[];
	if ((typeof this.getrequirements()!="undefined")) {
	    if ("Target".match(this.getrequirements())) this.req.push([A.TARGET.key]);
	    if ("Focus".match(this.getrequirements())) this.req.push(A.FOCUS.key);
	}
	this.uid = squadron.indexOf(this.unit);
	this.rank=this.unit.upgrades.indexOf(this);
	return Mustache.render(TEMPLATES.weapon, this);
    },
    prehit(t,c,h) {},
    posthit(t,c,h) {},
    getrequirements() {
	return this.requires;
    },
    getattack() {
	return this.attack;
    },
    isTurret() {
	return this.type==Unit.TURRET;
    },
    getlowrange() {
	return this.range[0];
    },
    gethighrange() {
	return this.range[1];
    },
    isinrange(r) {
	return (r>=this.getlowrange()&&r<=this.gethighrange());
    },
    modifydamagegiven(ch) { return ch; },
    modifyattackroll(ch,n,d) { return ch; },
    modifydamageassigned(ch,t) { return ch; },
    canfire(sh) {
	if (typeof sh=="undefined") {
	    return true;
	}
	if (!this.isactive||sh.isdocked||this.unit.isally(sh)) return false;
	if (this.unit.checkcollision(sh)) return false;
	if (typeof this.getrequirements()!="undefined") {
	    var s="Target";
	    if (s.match(this.getrequirements())&&this.unit.canusetarget(sh))
		return true;
	    s="Focus";
	    if (s.match(this.getrequirements())&&this.unit.canusefocus()) return true;
	    return false;
	}
	return true;
    },
    getrangeattackbonus(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==1) {
		this.unit.log("+1 attack for range 1");
		return 1;
	    }
	}
	return 0;
    },
    declareattack(sh) { 
	if (typeof this.getrequirements()!="undefined") {
		this.twinattack=false;
	    var s="Target";
	    var u="Focus";
	    if (s.match(this.getrequirements())&&this.consumes===true&&this.unit.canusetarget(sh)) {
		this.unit.removetarget(sh);
		
	    } else if (u.match(this.getrequirements())&&this.consumes===true&&this.unit.canusefocus(sh)) 
		this.unit.removefocustoken();
	}
	return true;
    },
    getrangedefensebonus(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==3) {
		sh.log("+1 defense for range 3");
		return 1;
	    }
	}
	return 0;
    },
    getauxiliarysector(sh) {
	var m=this.unit.m;
	if (typeof this.auxiliary=="undefined") return 4;
	return this.unit.getauxiliarysector(sh,m,this.subauxiliary,this.auxiliary);
    },
    getprimarysector(sh) {
	var m=this.unit.m;
	return this.unit.getprimarysector(sh,m);
    },
    getsector(sh) {
	var m=this.unit.m;
	var r=this.unit.getprimarysector(sh,m);
	if (r<4) return r;
	if (typeof this.auxiliary=="undefined") return 4;
        if (typeof this.auxiliary!="undefined" && !this.type.match(/Turretlaser|Bilaser|Mobilelaser|Laser180|Laser|Turret/)){
            return this.getauxiliarysector(sh); // For VCX-100 w/o Phantom & Ghost, etc.
        }
	return this.unit.getauxiliarysector(sh,m);
    },
    getrange(sh) {
	var i;
	if (!this.canfire(sh)) return 0;
	if (this.isTurret()||this.unit.isTurret(this)) {
	    var r=this.unit.getrange(sh);
	    if (this.isinrange(r)) return r;
	    else return 0;
	}
	var ghs=this.getsector(sh);
	if (ghs>=this.getlowrange()&&ghs<=this.gethighrange()) return ghs;
	return 0;
    },
    endattack(c,h) {
	if (this.type.match(/Torpedo|Missile/) && (this.twinattack != true)) this.desactivate();
    },
    hasdoubleattack() { return false; },
    hasenemiesinrange() {
	for (var i in squadron) {
	    var sh=squadron[i];
	    if (this.unit.isenemy(sh)&&this.getrange(sh)>0) return true;
	}
	return false;
    },
    getenemiesinrange(enemylist) {
	var r=[];
	if (typeof enemylist=="undefined") enemylist=squadron;
	for (var i in enemylist) {
	    var sh=enemylist[i];
	    if (!sh.isdocked&&sh.isenemy(this.unit)&&this.getrange(sh)>0) r.push(sh);
	}
	return r;
    },
    getrangeallunits() {
	var i;
	var r=[];
	for (i in squadron) {
	    var sh=squadron[i];
	    if ((this.unit!=sh)&&(this.getrange(sh)>0)) r.push(sh);
	}
	return r;
    },
    endround() {},
    show() {},
}
function Upgradefromid(sh,i) {
    var upg=UPGRADES[i];
    upg.id=i;
    if (upg.type==Unit.BOMB) {
		if (typeof upg.isBomb != "undefined" && !upg.isBomb()) return new Upgrade(sh,i);
		return new Bomb(sh,upg);
	}
    if (typeof upg.isWeapon != "undefined") {
		if (upg.isWeapon()) return new Weapon(sh,upg);
		else return new Upgrade(sh,i);
    }
    if (upg.type.match(/Turretlaser|Bilaser|Mobilelaser|Laser180|Laser|Torpedo|Cannon|Missile|Turret/)||upg.isweapon===true) return new Weapon(sh,upg);
    return new Upgrade(sh,i);
}

function Upgrade(sh,i) {
	$.extend(this,UPGRADES[i]);
	sh.upgrades.push(this);
	this.isactive=true;
	this.unit=sh;
	this.wrapping=[];
	this.ordnance=0;
	/*
	 var addedaction=this.addedaction;
	 if (typeof addedaction!="undefined") {
	 var added=addedaction.toUpperCase();
	 sh.shipactionList.push(added);
	 }
	 */
	//if (typeof this.init != "undefined") this.init(sh);
    }
Upgrade.prototype={
    wrap_before: Unit.prototype.wrap_before,
    wrap_after: Unit.prototype.wrap_after,
    toString() {
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	if (typeof this.shield!="undefined" &&this.shield>0) this.hasshield=true; else this.hasshield=false;
	if (typeof this.focus!="undefined" &&this.focus>0) this.hasfocus=true; else this.hasfocus=false;
	if (typeof this.switch!="undefined"&&this.canswitch()) {
	    for (var j=0; j<this.unit.upgrades.length; j++) if (this.unit.upgrades[j]==this) break;
	    this.hasswitch={uid:this.unit.id,uuid:j};
	} else this.hasswitch=false;
	return Mustache.render(TEMPLATES.upgrade, this);
    },
    isWeapon() { return false; },
    isBomb() { return false; },
	showOrdnance() { return this+1; },
    getlowrange() {
	return this.range[0];
    },
    gethighrange() {
	return this.range[1];
    },
    endround() {},
    desactivate() {
	if (this.ordnance>0&&this.type.match(/Torpedo|Missile|Bomb|Illicit/)) {
	    this.ordnance-=1;
	} else { this.isactive=false; this.unit.movelog("D-"+this.unit.upgrades.indexOf(this)); this.unit.show(); }
    },
    show() {},
    install(sh) {
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
	    if (this.exclusive===true) {
		sh.exclupg[this.upgrades[0]]=true;
	    }
	    sh.upgradetype=sh.upgradetype.concat(this.upgrades);
	    sh.upgradesno=sh.upgradetype.length;
	    sh.showupgradeadd();   
	}
	var j;
	// Losing upgrades
	if (typeof this.lostupgrades!="undefined") {
	    for (j=0; j<sh.upgradetype.length; j++) {
		if (this.lostupgrades.indexOf(sh.upgradetype[j])>-1) {
		    if (sh.upg[j]>-1) removeupgrade(sh,j,sh.upg[j]);
		    sh.upg[j]=-2;
		}
	    }
	    sh.showupgradeadd();
	}
	// Emperor, Bomblet Generator, Jabba
	if (typeof this.takesdouble!="undefined") {
            var typeslots = [];
            var installedtype = 0;
            //var typeslots = 0,installedtype = 0;
            // Possibly track slots and ID numbers of all same-type upgrades
            for (var k=0; k<sh.upgradetype.length; k++){ // Count all avail same-type slots
                if(sh.upgradetype[k]==this.type) typeslots.push({index: k});
            }
            for (k=0; k<sh.upgrades.length; k++){
                if(sh.upgrades[k].type===this.type){ // upgrades' order is dependent on install order
                    if(typeof sh.upgrades[k].takesdouble==="undefined"||sh.upgrades[k].takesdouble===false){
                        installedtype++;
                    }
                    else{
                        installedtype+=2; // also counts current double card
                    }
                }
            }
            if(installedtype > typeslots.length){ // Check if there are enough slots for all upgrades of this.type
                // If not, just uninstall this and NOTHING ELSE!
                removeupgrade(sh,typeslots[typeslots.length-2].index,this.id);                
//                for (j=0; j<sh.upgradetype.length; j++){
//                    if (sh.upgradetype[j]==this.type&&(sh.upg[j]<0||UPGRADES[sh.upg[j]].name!=this.name)) {
//                        break;
//                    }
//                }
//                if (j<sh.upgradetype.length) {
//                    if (sh.upg[j]>-1) removeupgrade(sh,j,sh.upg[j]);
//                    sh.upg[j]=-2;
//                }
            }
            else { // Remove one upgrade slot
                for(var u in typeslots){
                    if (sh.upg[typeslots[u].index]==-1){
                        sh.upg[typeslots[u].index] = -2;
                        break;
                    }
                }
            }
	    sh.showupgradeadd();
	}
    },
    uninstall(sh) {
	var i;
	//sh.log("removing upgrade "+this.name);
	if (typeof this.addedaction!="undefined") {
	    var aa=this.addedaction.toUpperCase();
	    sh.shipactionList.splice(sh["addedaction"+this.id],1);

	}
	if (typeof this.upgrades!="undefined") {
	    if (typeof this.pointsupg!="undefined") sh.upgbonus[this.upgrades[0]]=0;
	    if (typeof this.maxupg!="undefined") sh.maxupg[this.upgrades[0]]=0;
	    for (i=0; i<this.upgrades.length; i++) {
		var num=i+sh["addedupg"+this.id];
		var e=$("#unit"+sh.id+" .upg div[num="+num+"]");
		if (e.length>0) {
		    var data=e.attr("data");
		    removeupgrade(sh,num,data);
		}
	    }
	    if (typeof this.exclusive===true) {
		sh.exclupg[this.upgrades[0]]=false;
	    }
	    sh.upgradetype.splice(sh["addedupg"+this.id],this.upgrades.length);
	    sh.upgradesno=sh.upgradetype.length;
	}
	if (typeof this.lostupgrades!="undefined") {
	    for (i=0; i<sh.upgradetype.length; i++)
		if (this.lostupgrades.indexOf(sh.upgradetype[i])>-1)
		    sh.upg[i]=-1;
	}
	if (typeof this.takesdouble!="undefined") {
	    for (i=0; i<sh.upgradetype.length; i++){
		if (sh.upgradetype[i]==this.type&&sh.upg[i]==-2){
		    sh.upg[i]=-1;
                    break;
                }
            }
	}
        for(i in sh.upgrades){ // We need to delete this from upgrades or other stuff gets broken
            if(sh.upgrades[i].type==this.type && sh.upgrades[i].id==this.id){
                sh.upgrades.splice(i,1);
                break;
            }
        }
    }
}


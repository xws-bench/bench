/*
Espilon ace rule
Chopper crew (was working like Chopper pilot)
*/

function metaUnit() {
    this.ordnance=false;
    this.touching=[];
    this.focus=0;
    this.stress=0;
    this.evade=0;
    this.targeting=[];
    
}
metaUnit.prototype= {
    resolveactionselection: function(units,cleanup) {
	cleanup(0);
    },
    selectcritical: function(crits,endselect) {
	for (var i=0; i<crits.length; i++) {
	    if (CRITICAL_DECK[crits[i]].lethal==false) {
		endselect(crits[i]); return;
	    }
	}
	endselect(crits[0]);
    },
    animateaddtoken: function() {},
    animateremovetoken: function() {},
    dodecloak: function() {
	if (this.shipactionList.indexOf("CLOAK")>-1) 
	    this.resolvedecloak();
    },
    resolvedecloak: function() {
	var p=[];
	var k=0;
	for (var i=0; i<this.moves.length; i++) {
	    var ml=this.getdecloakmatrix(this.moves[i]);
	    for (var j=0; j<ml.length; j++) p[k++]=ml[j];
	}
	this.moves=p;
    },
    isactiondone: function(a) {
	return false;
    },
    addiontoken: function() {
    },
    addstress: function() {
	this.stress++;
    },
    addevadetoken: function() {
	this.evade++;
    },
    removeevadetoken:function() {
	this.evade--;
    },
    removestresstoken:function() {
	this.stress--;
    },
    addtarget: function(sh) {
	for (var i=0; i<this.moves.length; i++) {
	    this.moves[i].targeting=[targetunit];
	}
	this.targeting=[targetunit];
    },
    removetarget: function(t) {
	console.log("removetarget meta");
	var n=this.targeting.indexOf(t);
	if (n>-1) this.targeting.splice(n,1);
    },
    addfocustoken: function() { this.focus++; },
    removefocustoken: function() { this.focus--; },
    initcounters: function(m) {
	m.BOOST=false;
	m.ROLL=false;
	m.focus=0;
	m.stress=0;
	m.evade=0;
	m.move="";
	m.reroll=0;
	m.targeting=[];
	this.m=m;
    },
    resolvemaneuver: function() {
	var i,j,k;
	k=0;
	this.maneuver=0;
	this.stress=0;
	this.evade=0;
	this.focus=0;
	this.reroll=0;
	this.targeting=[];
	var ml=this.getmaneuverlist();
	var p=[];
	for (i in ml) {
	    var mli=ml[i];
	    for (j=0; j<this.moves.length; j++) {
		var m;
		this.stress=0;
		this.focus=0;
		this.evade=0;
		this.targeting=[];
		m=this.getpathmatrix(this.moves[j],mli.move,mli.halfturn);
		this.initcounters(m);
		this.handledifficulty(mli.difficulty);
		m.stress=this.stress;
		m.focus=this.focus;
		m.evade=this.evade;
		m.reroll=0;
		m.targeting=this.targeting;
		m.move=mli.move;
		p[k++]=m;
	    }
	}
	this.moves=p;
	this.endmaneuver();
    },
    endmaneuver: function() {
	if (this.candoendmaneuveraction()) this.doendmaneuveraction();
    },
    candoendmaneuveraction: function() { return true; },
    doendmaneuveraction: function() {
	this.doaction(this.getactionlist(true));
    },
    movelog: function() {},
    showdial: function() {},
    showactivation: function() {},
    timetoshowmaneuver: function() {},
    doactivation: function() {
	this.beginactivation();
	this.premove();
	this.dodecloak();
	this.resolvemaneuver();
	this.endactivationphase();
    },
    log: function() { },
    beginactivation: function() {},
    endactivationphase: function() {},
    showaction: function() {},
    donoaction:function(list,str) {
	this.doaction(list,str);
    },
    resolveboost: function() {
	var p=[];
	var k=0;
	for (var i=0; i<this.moves.length; i++) {
	    var m=this.moves[i];
	    if (!m.BOOST) {
		var bl=this.getboostmatrix(m);
		for (var j=0; j<bl.length; j++) { 
		    bl[j].BOOST=true;
		    bl[j].ROLL=m.ROLL;
		    bl[j].reroll=0;
		    bl[j].stress=m.stress;
		    bl[j].focus=m.focus;
		    bl[j].evade=m.evade;
		    bl[j].move=m.move;
		    bl[j].targeting=m.targeting;
		    p[k++]=bl[j];
		} 
	    } 
	    p[k++]=m;
	}
	this.moves=p;
	this.endaction(0,"BOOST");
    },
    resolvefocus: function() {
	var p=[];
	for (var i=0; i<this.moves.length; i++) {
	    p[i]=this.moves[i].clone();
	    p[i].stress=this.moves[i].stress;
	    p[i].move=this.moves[i].move;
	    p[i].evade=this.moves[i].evade;
	    p[i].targeting=this.targeting;
	    p[i].reroll=0;
	    p[i].focus=1;
	}
	this.moves=p;
	this.endaction(0,"FOCUS");
    },
    resolveevade: function() {
	var p=[];
	for (var i=0; i<this.moves.length; i++) {
	    p[i]=this.moves[i].clone();
	    p[i].stress=this.moves[i].stress;
	    p[i].move=this.moves[i].move;
	    p[i].targeting=this.targeting;
	    p[i].reroll=0;
	    p[i].focus=this.moves[i].evade;
	    p[i].evade=1;
	}
	this.moves=p;
	this.endaction(0,"EVADE");
    },
    resolvetargetnoaction: function(n,noaction) {
	var p=[];
	for (var i=0; i<this.moves.length; i++) {
	    p[i]=this.moves[i].clone();
	    p[i].move=this.moves[i].move;
	    p[i].targeting=[targetunit];
	    p[i].focus=this.moves[i].focus;
	    p[i].evade=this.moves[i].evade;
	    p[i].reroll=0;
	    p[i].stress=this.moves[i].stress;
	}
	this.moves=p;
	this.endaction(0,"TARGET");
    },
    gettargetableunits: function(r) {
	if (r==this.range) return [targetunit];
	return [];
    },
    selectunit: function(tab,f) {
	if(tab.length>0) f.call(this,tab,0);
    },
    resolveroll: function() {
	var p=[];
	var k=0;
	for (var i=0; i<this.moves.length; i++) {
	    var m=this.moves[i];
	    if (!m.ROLL) {
		var bl=this.getrollmatrix(m);
		for (var j=0; j<bl.length; j++) {
		    bl[j].ROLL=true;
		    bl[j].BOOST=m.BOOST;
		    bl[j].reroll=0;
		    bl[j].focus=m.focus;
		    bl[j].evade=m.evade;
		    bl[j].stress=m.stress;
		    bl[j].move=m.move;
		    bl[j].targeting=m.targeting;
		    p[k++]=bl[j];
		}
	    }
	    p[k++]=m;
	}
	this.moves=p;
	this.endaction(0,"ROLL");
    },
    uniquearray: function(arr) {
	var u = {}, a = [];
	for(var i = 0, l = arr.length; i < l; ++i){
            if(!u.hasOwnProperty(arr[i])) {
		a.push(arr[i]);
		u[arr[i]] = 1;
            }
	}
	return a;
    },
    doaction: function(list,str,cando) {
	var nostress=[];
	var stressed=[];
	var org=[];
	var k=0,h=0;
	var p=[],i;
	for (i=0; i<this.moves.length; i++) {
	    this.stress=0;
	    if (this.moves[i].stress>0) {
		this.stress=this.moves[i].stress;
	    }
	    if (this.hasnostresseffect()) nostress[k++]=this.moves[i];
	    else stressed[h++]=this.moves[i];
	}
	for (i=0; i<list.length; i++) {
	    this.moves=nostress;
	    //console.log("TYPE of ACTION:"+list[i].type);
	    switch(list[i].type) {
	    case "ROLL":  
		this.resolveroll(); 
		break;
	    case "BOOST":
		this.resolveboost(); 
		break;
	    case "FOCUS":
		this.resolvefocus();
		this.addfocustoken();
		break;
	    case "TARGET":
		this.resolvetarget(0,false);
		break;
	    case "ELITE":
		list[i].action.call(list[i].org,0); 
		break;
	    case "EVADE":
		this.resolveevade();
		this.addevadetoken();
		break;
	    }
	    p=p.concat(this.moves);
	}
	this.moves=p.concat(stressed);
	return $.Deferred().resolve().promise();
    },
    resolveactionmove: function(list,fun) {
	for (var i=0; i<list.length; i++) {
	    console.log("ram:"+list[i]);
	}
    },
    candotarget: function() { return true;},
    candoaction: function() { return true;},
    candoroll: function() { return true;},
    candoboost: function() { return true;},
    endaction: function(n,type) {},
    getmaneuverlist: function() {
	var d=this.getdial();
	var p={};
	for (var i=0; i<d.length; i++) {
	    p[d[i].move]=d[i];
	}
	return p;
    },
    getrange: function() { return this.range; },
    getsector: function() { return this.range; },
    getoutlinerange:function(m,sh) {
	return {d:this.range};
    },
    isinsector: function() { return true; },
    checkcollision:function() {	return false; },
    isally:function() { return false;  },
    isenemy: function(sh) { return sh==targetunit||this==targetunit; },
    begincombatphase: function() { },
    selectnearbyenemy:function(r) {
	if (this.range==r) return [targetunit];
	return [];
    },
    doselection: function() {},
    setinfo: function(info,event) {
	var w=$("#unit"+this.id+" .statisticsvg").width();
	var h=$("#unit"+this.id+" .statisticsvg").height();	
	var p=$("#unit"+this.id+" .statisticsvg").offset();
	var x=event.pageX+20;
	var y=event.pageY;
	return $(".info").css({left:x,top:y}).html(formatstring(info)).appendTo("body").show();
    },
/*


*/
    resolveattack: function(w,target) {
    },
    cleanupattack: function() {
    },
    computeproba: function(w,j,config) {
	this.evade=Math.floor(config/60);
	this.targeting=(Math.floor(config/10)%2==1)?[targetunit]:[];
	this.focus=Math.floor(config/20)%2;
	this.stress=Math.floor(config/40)%2;
	//console.log(w.name+" "+w.canfire(targetunit)+" "+w.getrange(targetunit));

	if (w.getrange(targetunit)==0) return null;

	w.declareattack(targetunit);

	this.resolveattack(w,targetunit);
	var a=this.getattackstrength(j,targetunit);
	var defense=targetunit.getdefensestrength(j,this);
	var ad = this.modifyattackdefense(a,defense,targetunit,j);
	a=ad.a;
	console.log("attack:"+ad.a+" "+ad.d);
	defense=ad.d;
	if (this.targeting.length>0) this.reroll=9; else this.reroll=config%10;
	var thp= tohitproba(this,w,targetunit,ATTACK[a],DEFENSE[defense],a,defense);
	targetunit.cleanupattack();
	return thp;
    },
    showattack: function(weaponlist,s) {
	var p;
	var power=[];
	var h=0,k;
	var configs;
	var prim=this.getprimarysector;
	var aux=this.getauxiliarysector;
	for (var i=3; i>=1; i--) {
	    this.range=i;
	    this.begincombatphase();
	    p=this.moves;
	    configs=[];
	    for (k=0; k<p.length; k++) {
		var r=(8*p[k].evade+4*p[k].stress+2*p[k].focus+(p[k].targeting.length>0?1:0))*10+p[k].reroll;
		configs[r]=[];
		//console.log(p[k].move+" stress:"+p[k].stress+" focus:"+p[k].focus+" targ:"+p[k].targeting.length+" reroll:"+p[k].reroll);

	    }

	    var ff=this.focus;
	    for (var j=0; j<weaponlist.length; j++) {
		var w=weaponlist[j];
		var f;
		activeweapon=j;
		if (!w.isactive) continue;
		if (w.isTurret()||this.isTurret(w)) {
		    f=this.getSubRangeString;
		} else { 
		    f=this.getPrimarySubSectorString;
		    this.getprimarysector=prim;
		    this.getauxiliarysector=function() { return 4; };
		}
		for (k in configs) {
		    var cp=this.computeproba(w,j,k);
		    if (cp!=null) configs[k][j]=cp;
		}
		for (k=0; k<p.length; k++) {
		    r=(8*p[k].evade+4*p[k].stress+2*p[k].focus+(p[k].targeting.length>0?1:0))*10+p[k].reroll;
		    if (typeof configs[r][j]!="undefined")
			power[h++]={f:f,proba:configs[r][j],m:p[k],range:i};
		}
		
		if (typeof w.subauxiliary!="undefined") {
		    f=w.subauxiliary;
		    this.getprimarysector=function() { return 4; };
		    this.getauxiliarysector=aux;
		    for (k in configs) {
			cp=this.computeproba(w,j,k);
			if (cp!=null) configs[k][j]=cp;
		    }
		    for (k=0; k<p.length; k++) {
			r=(8*p[k].evade+4*p[k].stress+2*p[k].focus+(p[k].targeting.length>0?1:0))*10+p[k].reroll;
			if (typeof configs[r][j]!="undefined")
			    power[h++]={f:f,proba:configs[r][j],m:p[k],range:i};
		    }
		}
	    }
	}
	this.focus=0;
	this.targeting=[];
	this.stress=0;
	this.evade=0;
	this.getprimarysector=prim;
	this.getauxiliarysector=aux;

	power.sort(function(a,b) {
	    var d=(a.proba.tohit-b.proba.tohit);
	    if (d>0) return 1;
	    if (d<0) return -1;
	    return 0;
	});
	for (h=0; h<power.length; h++) {
	    var pw=power[h];
	    var margin=50;
	    var ll=100;
	    if (pw.proba.tohit<50) margin=Math.round(pw.proba.tohit/2+25);
	    if (pw.proba.tohit>80) ll=100-(pw.proba.tohit-80);
	    
	    var hh=1.2*(100-pw.proba.tohit);
	    var color="hsl("+Math.round(hh)+","+ll+","+margin+")";
	    //if (hh<60) color="rgb(255,"+Math.round(hh/60*255)+",0)";
	    //else color="rgb("+Math.round((120-hh)/60*255)+",255,0)";
	    pw.parent=this;
	    var p=s.path(pw.f.call(this,pw.range-1,pw.range,pw.m)).hover(function(event) {
		$(".info").show(); 
		var mm=this.m.move;
		var speed=P[mm].speed;
		var dir=P[mm].key;
		this.parent.setinfo((this.proba.tohit)+"%<br/>"
				    +speed+"<span class='symbols'>"+dir+"</span>"
				    +(this.m.focus?"+%FOCUS%":"")
				    +(this.m.BOOST?"+%BOOST%":"")
				    +(this.m.ROLL?"+%ROLL%":"")
				    +(this.m.evade?"+%EVADE%":"")
				    +(this.m.targeting.length>0?"+%TARGET%":"")
				    ,event);
	    }.bind(pw),function() { 
		$(".info").hide();
	    }.bind(this)).attr({fill:color});
	}
	return false;
    }
};

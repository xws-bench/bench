var Unit=window.Unit || {};
var Mustache = window.Mustache || {};
var Critical = window.Critical || {};

function Condition(sh,org,n) {
    this.name=n;
    this.org=org;
    if (n in  TEAMS[sh.team].conditions) {
	TEAMS[sh.team].conditions[n].remove();
    }
    $.extend(this,CONDITIONS[n]);
    console.log("new condition: "+n+" to "+sh.name+" from "+this.org.name);
    sh.conditions[n]=this;
    TEAMS[sh.team].conditions[n]=this;
    this.unit=sh;
    this.isactive=true;
    this.assign(sh);
    activeunit=sh;
    sh.show();
    activeunit=org;
}
Condition.prototype = {
    toString: function() {
	if (!this.isactive) return "";
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	return Mustache.render(TEMPLATES["condition"], this);
    },
    remove: function() {
	var u=this.unit;
	Unit.prototype.desactivate.call(this);
	delete u.conditions[this.name];
	delete TEAMS[u.team].conditions[this.name];
	u.show();
    }
} 
var CONDITIONS={
    "I'll Show You The Dark Side": {
	assign: function(t) {
	    var self=this;
	    var sc=[];
	    for (var i=0; i<Critical.CRITICAL_DECK.length; i++) {
		if (Critical.CRITICAL_DECK[i].version.indexOf(CURRENT_DECK)>-1
		    &&Critical.CRITICAL_DECK[i].type=="pilot"&&Critical.CRITICAL_DECK[i].count>0) 
		    sc.push(i);
	    }
	    this.org.selectcritical(sc,function(m) {
		Critical.CRITICAL_DECK[m].count--;
		t.darkside=new Critical(t,m);
		var name=Critical.CRITICAL_DECK[m].name;
		if (typeof CRIT_translation[name].name!="undefined") name=CRIT_translation[name].name;
		
		self.name+=" ["+name+"]";
	    });
	    t.wrap_after("deal",this,function(cr,f,dd) {
		if (f==Critical.FACEUP) {
		    var ddd=$.Deferred();
		    self.remove();
		    return ddd.resolve({crit:this.darkside,face:f});
		} else return dd;
	    }).unwrapper("deal");
	}
    },
    "Suppressive Fire":{
	assign: function(target) {
	    var self=this;
	    target.wrap_after("getattackstrength",this,function(i,t,d) {
		if (t.name!=self.org.name&&self.isactive&&self.unit==this) return d-1;
		return d;		
	    });
	    target.wrap_after("declareattack",this,function(w,t,b) {
		if (b&&t.name==self.org.name&&self.isactive&&self.unit==this) self.remove();
		return b;
	    });
	    this.org.wrap_before("dies",this,function() {
		self.remove();
	    });
	    this.org.wrap_before("endcombatphase",this,function() {
		if (this.hasfired==0) self.remove();
	    });
	}
    },
    "A Debt To Pay":{
	assign: function(t) {
	    var self=this;
	    t.adebttopay=self;
	    t.adddicemodifier(Unit.ATTACK_M,Unit.MOD_M,Unit.ATTACK_M,this,{
		req:function(m,n) {
		    if (typeof targetunit.ascoretosettle!="undefined")
			return targetunit.ascoretosettle.isactive;
		    return false;
		},
	     f:function(m,n) {
		 this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
		 m = m - Unit.FCH_FOCUS + Unit.FCH_CRIT;
		 return m;
	     }.bind(t),str:"elite"});

	},
    },
    "Fanatical Devotion":{
	assign: function(t) {
	    var self=this;
	    t.wrap_before("isattackedby",this,function() {
		this.wrap_after("canusefocus",self,function() { return false;}).unwrapper("endbeingattacked");
	    });
	    t.wrap_before("endround",this,function() {
		self.remove();
	    });
	    t.wrap_after("declareattack",this,function(w,target,b) {
		if (b) this.wrap_after("removefocustoken",self,function() {
		    Unit.prototype.wrap_after("cancelcritical",self,function(r,sh,s) {
			return {ch:s.ch+Unit.FCH_HIT,e:s.e}; 
		    }).unwrap("endbeingattacked");
		}).unwrap("endattack");
		return b;
	    }).unwrap("endattack");
	}
    }
}

var Unit=window.Unit || {};
var Mustache = window.Mustache || {};
var Critical = window.Critical || {};

function Condition(sh,org,n) {
    this.name=n;
    this.org=org;
    var cond = null;
    for (var i=0; i<CONDITIONS.length; i++) {
	if (CONDITIONS[i].name == n) {
		cond = CONDITIONS[i];
		break;
	}
    }
    $.extend(this,cond);
    console.log("new condition: "+n+" to "+sh.name+" from "+this.org.name);
    sh.conditions.push(this);
    TEAMS[sh.team].conditions.push(this);
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
	u.conditions.pop[this];
	TEAMS[u.team].conditions.pop[this];
	u.show();
    }
} 
var CONDITIONS=[
  {
    	name: "I'll Show You The Dark Side",
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
  {
    	name: "Suppressive Fire",
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
  {
    	name: "A Debt To Pay",
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
  {
    	name: "Fanatical Devotion",
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
  },
  {
	name: "Shadowed",
	assign: function(target) {
		this.org.skill = target.getskill(target.skill);
		this.org.show();
	},
  },
  {
        name: "Mimicked",
        assign: function(target) {
            var self=this;
            self.org.mimicking=target;
            // Handle duelling Thweeks by Mimicking the other Thweek's target
            if(target.name===self.org.name&&typeof target.mimicking!=="undefined"){
                self.org.log("copying %0 abilities [%1]",target.mimicking.name,self.name);
                target.mimicking.init.call(self.org);
            }
            else{ // Mimicking non-Thweek, or a Thweek that is Shadowing (so re-run init)
                this.org.log("copying %0 abilities [%1]",target.name,this.name);
                target.init.call(this.org);
            }
            // Redefine Condition() to check if the org is the owner of this
            var newCondition=function(){
                var tempbase=Condition; // Copied from "http://www.i-programmer.info/programming/javascript/1735-overriding-a-javascript-global-function-parseint.html"
                return (function(sh,org,n){
                    var specialCase=false;
                    if(typeof self.org.mimicking!=="undefined" && self.org.mimicking.name===self.org.name){
                        specialCase=true; // Only set on first pass, during event handling
                    }
                    if (org === self.org && !specialCase) { // Clojure assures this test works
                        return;
                    }
                    return new tempbase(sh,org,n);
                });
            }(); // Has to execute immediately so that Condition is still correct w/in context
            if (Condition.toString()!==newCondition.toString()) {Condition=newCondition;};
            this.org.show();
        }
  },
  {
	name: "Harpooned!",
	assign: function(target) {
		var self=this;
		target.wrap_before("dies",this,function() {
			var r=target.getrangeallunits();
			for (var i=0; i<r[1].length; i++) {
				var u=squadron[r[1][i].unit];
				if (u!=target) {
					squadron[r[1][i].unit].log("Harpooned! deals 1 %HIT%");
					squadron[r[1][i].unit].resolvehit(1);
				}
			}
			self.remove();
		});

		target.wrap_after("resolveishit",this,function(sh) {
			if (sh.criticalresolved > 0) {
				var r=target.getrangeallunits();
				for (var i=0; i<r[1].length; i++) {
					var u=squadron[r[1][i].unit];
					if (u!=target) {
						squadron[r[1][i].unit].log("Harpooned! deals 1 %HIT%");
						squadron[r[1][i].unit].resolvehit(1);
					}
				}
				target.log("Harpooned! deals 1 damage card");
				target.applydamage(1);
				self.remove();
				target.show();
			}
		});
	},
	candoaction: function() { return this.isactive },
	action: function(n) {
		var self=this;
		var roll=this.unit.rollattackdie(1,this.unit,"hit")[0];
		this.unit.log("roll 1 attack dice [%0]",self.name);
		this.unit.log("Rolled: %HIT% [%1]",roll,self.name)
		if (roll=="hit"||roll=="critical") { 
			this.unit.resolvehit(1); 
			this.unit.checkdead(); 
		}
		self.remove();
		this.unit.endaction(n)
	}
  }
];

var factions=["REBEL","EMPIRE"];
var allunits=[];
function winevent() {
    return new CustomEvent(
	"win", {
	    detail: {
		time: new Date(),
	    },
	    bubbles: true,
	    cancelable: true
	});
}

function Team(team) {
    this.team=team;
    this.isdead=false;
    this.isia=false;
    this.initiative=false;
    this.units=[];
    this.allhits=this.allcrits=this.allevade=this.allred=this.allgreen=0;
}
Team.prototype = {
    setfaction: function(faction) {
	$(".listunits .generic").remove();
	this.faction=faction;
	$("#"+faction+"select").prop("checked",true);
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;	
    },
    changefaction: function(faction) {
	var i;
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		delete generics[i];
	    }
	}
	$("#totalpts").html(0);
	this.setfaction(faction);
	displayfactionunits();
    },
    checkdead: function() {
	var i;
	var alldead=true;
	for (i=0; i<this.units.length; i++) 
	    if (!this.units[i].dead) { alldead=false; break; }
	this.isdead=alldead;
	return alldead;
    },
    toggleplayer: function(name) {
	this.isia=!this.isia;
    },
    updatepoints: function() {
	var s=0;
	var score1=$("#listunits .pts").each(function() {
	    s+=parseInt($(this).text())
	});
	$("#totalpts").html(s);
    },
    addunit:function(n) {
	var u=new Unit(this.team,n);
	$("#listunits").append(""+u);
	this.updatepoints();
    },
    tosquadron:function(s) {
	var i;
	var team=this.team;
	for (i in generics) {
	    if (generics[i].team==this.team) {
		u=generics[i];
		/* Copy all functions for manual inheritance.  */
		for (var i in PILOTS[u.pilotid]) {
		    var p=PILOTS[u.pilotid];
		    if (typeof p[i]=="function") u[i]=p[i];
		}
		u.tosquadron(s);
		allunits.push(u);
		squadron.push(u);
		this.units.push(u);
	    }
	}	
	// knockout
	//ko.applyBindings({squad:ko.observableArray(squadron)});
	var gid=0;
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==1) u.id=gid++;
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==2) u.id=gid++;
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		if (typeof u.init!="undefined") u.init();
		if (this.isia==true) u=$.extend(u,IAUnit.prototype);
	    }
	}
	this.units.sort(function(a,b) {return b.getskill()-a.getskill();});
	squadron.sort(function(a,b) {return b.getskill()-a.getskill();});
	this.history={title: {text: UI_translation["Damage taken per turn"]},
		      axisX:{  interval: 1,title: UI_translation["Turns"]},
		      axisY: {	title: UI_translation["Cumulated damage"]},
		      rawdata:[],
		      data: [{        
		    indexLabelFontColor: "darkSlateGray",
		    name: "views",
		    type: "area",
		    color: "rgba(200,10,10,0.8)",
		    markerSize:8,
		    dataPoints: []}]
	};
	return this.units;
    },
    endsetup: function() {
	if (this.isia)
	    for (i=0; i<this.units.length; i++) 
		$.extend(this.units[i],IAUnit.prototype);
	for (i=0; i<this.units.length; i++) { 
	    this.units[i].g.undrag();
	}

    },
    endselection:function(s) {
	var i;
	var team=this.team;
	this.name=$("#teamname"+this.team).val();
	if (this.name=="") this.name="Squad #"+team;
	
	$("#team"+team).empty();
	$("#importexport"+team).remove();
	sq=this.tosquadron(s);
	for (i=0; i<sq.length; i++) {
	    if (team==1) {
		if (sq[i].tx<=0||sq[i].ty<=0) {
		    sq[i].tx=80-(sq[i].islarge?20:0);
		    sq[i].ty=70+82*i;
		    sq[i].alpha=90;
		}
		$("#team1").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    } else {
		if (sq[i].tx<=0||sq[i].ty<=0) {
		    sq[i].tx=820+(sq[i].islarge?20:0);
		    sq[i].ty=70+82*i;
		    sq[i].alpha=-90;
		}
		$("#team2").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    }
	    sq[i].m.translate(sq[i].tx,sq[i].ty).rotate(sq[i].alpha,0,0);
	    sq[i].show();
	}
	$("#team"+team).css("top",$("nav").height()+2);
	activeunit=sq[0];
    },
    toASCII: function() {
	var s="";
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		s+=generics[i].toASCII()+";";
	    }
	}
	return s;
    },
    toJSON:function() {
	var s={};
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	s.description="";
	s.faction=f[this.faction];
	s.name=this.name;
	var sq=[];
	var pts=0;
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		var jp=generics[i].toJSON();
		pts+=jp.points;
		sq.push(jp);
	    }
	}
	s.pilots=sq;
	s.points=pts;
	// update also the number of points
	this.points=pts;
	s.vendor={xwsbenchmark:{builder:"X-Wings Squadron Benchmark",builder_url:"http://xws-bench.github.io/bench/"}};
	s.version="0.3.0";
	return s;
    },
    toJuggler:function(translated) {
	var s="";
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		s=s+generics[i].toJuggler(translated)+"\n";
	    }
	}
	return s;
    },
    parseJuggler : function(str,translated) {
	var f,i,j,k;
	var pid;
	var getf=function(f) {
	    if (f=="REBEL") return 1;
	    if (f=="SCUM") return 2;
	    return 4;
	};
	var f=7;
	var pilots=str.trim().split("\n");
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    var lf=0;
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var va=v;
		var vn=v+(PILOTS[j].faction==SCUM?" (Scum)":"");
		if (translated==true&&typeof PILOT_translation[vn]!="undefined"&&typeof PILOT_translation[vn].name!="undefined")
		    va=PILOT_translation[vn].name;
		if (PILOTS[j].ambiguous==true) va+="("+PILOTS[j].unit+")";
		if (va.replace(/\'/g,"")==pstr[0]) {
		    lf=lf|getf(PILOTS[j].faction);
		}
	    }
	    f=f&lf;
	}
	if ((f&1)==1) this.faction="REBEL"; else if ((f&2)==2) this.faction="SCUM"; else this.faction="EMPIRE";
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;

	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var va=v;
		var vn=v+(PILOTS[j].faction==SCUM?" (Scum)":"");
		if (PILOTS[j].faction==this.faction) {
		    if (translated==true&&typeof PILOT_translation[vn]!="undefined"&&typeof PILOT_translation[vn].name!="undefined") 
			va=PILOT_translation[vn].name;
		    if (PILOTS[j].ambiguous==true) va+="("+PILOTS[j].unit+")";
		    if (va.replace(/\'/g,"")==pstr[0]) { pid=j; break; }
		} 
	    }
	    if (typeof pid=="undefined") console.log("pid undefined: >"+pstr[0]+"<"+this.faction);
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    var authupg=[MOD,TITLE].concat(PILOTS[p.pilotid].upgrades);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) {
		    var v=UPGRADES[k].name+(UPGRADES[k].type=="Crew"?"(Crew)":"");
		    if ((translated==true&&typeof UPGRADE_translation[v]!="undefined"
			 &&typeof UPGRADE_translation[v].name!="undefined"
			 &&UPGRADE_translation[v].name.replace(/\'/g,"").replace(/\(Crew\)/g,"")==pstr[j])
			||(UPGRADES[k].name.replace(/\'/g,"")==pstr[j]))
			if (authupg.indexOf(UPGRADES[k].type)>-1) {
			    p.upg[j-1]=k;
			    if (typeof UPGRADES[k].upgrades!="undefined") 
				if (UPGRADES[k].upgrades[0]=="Cannon|Torpedo|Missile")
				    authupg=authupg.concat(["Cannon","Torpedo","Missile"]);
				else authupg=authupg.concat(UPGRADES[k].upgrades);
			    if (typeof UPGRADES[k].install!= "undefined") 
				UPGRADES[k].install(p);
			    break;
			} else log("UPGRADE not listed: "+UPGRADES[k].type+" in "+p.name);
		if (k==UPGRADES.length) log("UPGRADE undefined: "+pstr[j]);
		}
	    }
	}
	//nextphase();
	
    },
    parseASCII: function(str) {
	var pilots=str.split(";");
	for (var i in generics) if (generics[i].team==this.team) delete generics[i];
	for (var i=0; i<pilots.length-1; i++) {
	    var coord=pilots[i].split(":");
	    var updstr=coord[0].split(",");
	    var pid=parseInt(updstr[0],10);
	    this.faction=PILOTS[pid].faction;
	    this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    for (var j=1; j<updstr.length; j++) {
		var n=parseInt(updstr[j],10);
		p.upg[j-1]=n;
	        if (typeof UPGRADES[n].install!="undefined") UPGRADES[n].install(p);
	    }
	    if (coord.length>1) {
		var c=coord[1].split(",");
		p.tx=parseInt(c[0],10);
		p.ty=parseInt(c[1],10);
		p.alpha=parseInt(c[2],10);
	    }
	}
	//nextphase();
    },
    parseJSON:function(str,translated) {
	var s;
	var f={"rebels":"REBEL","scum":"SCUM","empire":"EMPIRE"};
	try {
	    s=$.parseJSON(str);
	} catch(err) {
	    return this.parseJuggler(str,translated);
	}
	var i,j,k;
	this.name=s.name;
	this.points=s.points;
	this.faction=f[s.faction];
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<s.pilots.length; i++) {
	    var pilot=s.pilots[i];
	    var p;
	    pilot.team=this.team;
	    p=new Unit(this.team,0);
	    if (pilot.ship=="") pilot.ship="tiefofighter";
	    // log calling selectship ??
	    log("call selectship "+pilot.name);
	    p.selectship(PILOT_dict[pilot.ship],PILOT_dict[pilot.name]);
	    /* Copy all functions for manual inheritance. Call init. */
	    for (k in PILOTS[this.pilotid]) {
		var u=PILOTS[this.pilotpid];
		if (typeof u[k]=="function") p[k]=u[k];
	    }
	    if (typeof pilot.upgrades!="undefined")  {
		var nupg=0;
		for (j in pilot.upgrades) { 
		    var upg=pilot.upgrades[j];
		    for (k=0; k<upg.length; k++) {
			nupg++;
			for (var z=0; z<UPGRADES.length; z++) 
			    if (UPGRADES[z].name==UPGRADE_dict[upg[k]]) {
				p.upg[nupg]=z;
				if (typeof UPGRADES[z].install != "undefined") UPGRADES[z].install(p);
				break;
			    }
		    }
		}
	    }
	}
	//nextphase();
    }
}

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
    if (typeof isia=="undefined") isia=false;
    this.team=team;
    this.isdead=false;
    this.isia=false;
    this.units=[];
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
	this.setfaction(faction);
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
	var score1=$(".listunits .pts").map(function() {
	    return parseInt($(this).text());}).get();
	var i,s=0;
	for (i=0; i<score1.length; i++) {
	    if (!isNaN(score1[i])) {
		s+=score1[i];
	    }
	}
	$("#totalpts").html(s);
    },
    addunit:function() {
	$(".listunits").append(""+(new Unit(this.team)));
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

	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		if (typeof u.init!="undefined") u.init();
		if (this.isia) u=$.extend(u,IAUnit.prototype);
	    }
	}
	this.units.sort(function(a,b) {return b.skill-a.skill;});
	squadron.sort(function(a,b) {return b.skill-a.skill;});
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
    toJuggler:function() {
	var s="";
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		s=s+generics[i].toJuggler()+"\n";
	    }
	}
	return s;
    },
    parseJuggler : function(str) {
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
	    for (j=0;j<PILOTS.length; j++) if (PILOTS[j].name.replace(/\'/g,"")==pstr[0]) {
		    lf=lf|getf(PILOTS[j].faction);
		    log("Found "+PILOTS[j].name+" "+PILOTS[j].faction)
		}
	    f=f&lf;
	}
	if ((f&1)==1) this.faction="REBEL"; else if ((f&2)==2) this.faction="SCUM"; else this.faction="EMPIRE";
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;

	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    for (j=0;j<PILOTS.length; j++) 
		if (PILOTS[j].name.replace(/\'/g,"")==pstr[0]&&PILOTS[j].faction==this.faction) { pid=j; break; } 
	    var p=new Unit(this.team);
	    p.upg=[];
	    log("PILOTS unit "+PILOTS[pid].unit+" "+PILOTS[pid].name);
	    p.selectship(PILOTS[pid].unit,PILOTS[pid].name);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) 
		    if (UPGRADES[k].name.replace(/\'/g,"")==pstr[j]) {
			p.upg[j-1]=k;
			if (typeof UPGRADES[k].install!= "undefined") UPGRADES[k].install(p);
			break;
		    }
	    }
	}
	//nextphase();
	
    },
    parseASCII: function(str) {
	var pilots=str.split(";");
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<pilots.length-1; i++) {
	    var coord=pilots[i].split("%");
	    var updstr=coord[0].split(",");
	    var pid=Base64.toNumber(updstr[0]);
	    this.faction=PILOTS[pid].faction;
	    this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	    var p=new Unit(this.team);
	    p.upg=[];
	    p.selectship(PILOTS[pid].unit,PILOTS[pid].name);
	    for (j=1; j<updstr.length; j++) {
		var n=Base64.toNumber(updstr[j]);
		p.upg[j-1]=n;
	        if (typeof UPGRADES[n].install!="undefined") UPGRADES[n].install(p);
	    }
	    if (coord.length>1) {
		var c=Base64.toCoord(coord[1]);
		p.tx=c[0];
		p.ty=c[1];
		p.alpha=c[2];
	    }
	}
	//nextphase();
    },
    parseJSON:function(str) {
	var s;
	try {
	    s=$.parseJSON(str);
	} catch(err) {
	    return this.parseJuggler(str);
	}
	var i,j,k;
	this.name=s.name;
	this.points=s.points;
	this.faction=FACTIONS[s.faction];
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<s.pilots.length; i++) {
	    var pilot=s.pilots[i];
	    var p;
	    pilot.team=this.team;
	    p=new Unit(this.team);
	    if (pilot.ship=="") pilot.ship="tiefofighter";
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

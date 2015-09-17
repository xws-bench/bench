var factions=["REBEL","EMPIRE"];
var currentteam=1;
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
	$("#team"+this.team).empty();
	this.faction=faction;
	this.addpoints();
	this.addunit();
	$("#"+faction+this.team).prop("checked",true);
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
    addpoints: function() { 
	var team=this.team
	var f=["REBEL","SCUM","EMPIRE"];
	$("#team"+team).append("<div id='factionselect"+team+"'></div>");
	for (i=0; i<3; i++) {
	    $("#factionselect"+team).append("<input class='factionselect' id='"+f[i]+team+"' name='faction"+team+"' type='radio' onchange='TEAMS["+team+"].changefaction(\""+f[i]+"\")'>");
	    $("#factionselect"+team).append("<label for='"+f[i]+team+"' class='"+f[i]+"'>");
	}
	$("#team"+team).append("<input class='generic' id='teamname"+this.team+"' type='text' placeholder='"+UI_translation.squadron+" #"+team+"'>");
    },
    updatepoints: function() {
	var score1=$("#team"+this.team+" .pts").map(function() {
	    return parseInt($(this).text());}).get();
	var i,s=0;
	for (i=0; i<score1.length; i++) {
	    if (!isNaN(score1[i])) {
		s+=score1[i];
	    }
	}
	$("#total"+this.team).html(s);
    },
    addunit:function() {
	var team=this.team
	$("#addunit"+team).remove();
	$("#total"+team).remove();
	$("#totallbl"+team).remove();
	$("#team"+team).append("<div>"+(new Unit(team))+"</div>");
	$("#team"+team).append("<div id='addunit"+team+"' onclick='TEAMS["+team+"].addunit("+team+")'><span class='plus addunit'>+</span><span class='addunit generic m-addunit'></span></div><div><div><div class='totalpts outoverflow' id='total"+team+"'>0</div></div></div><div  id='totallbl"+team+"'></span><span class='plus'>=</span><span class='generic total m-totalpts'></span></div>");
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
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		if (typeof u.init!="undefined") u.init();
		if (this.isia) u=$.extend(u,IAUnit.prototype);
	    }
	}
	this.units.sort(function(a,b) {return b.skill-a.skill;});
	squadron.sort(function(a,b) {return b.skill-a.skill;});
	this.history={title: {text: "Damage taken by "+this.name},
		      axisX:{  interval: 1,title: "Turns"},
		      axisY: {	title: "Cumulated damage"},
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
	$("#team"+team).append("<div class='playerselect'></div>");
	$("#team"+team+" .playerselect").append("<input id='human"+team+"' class='human' type='checkbox' onchange='TEAMS["+team+"].toggleplayer()'>"); 
	$("#team"+team+" .playerselect").append("<label for='human"+team+"' data-off='&#9668; "+UI_translation["human"]+" &#9658;' data-on='&#9668; "+UI_translation["computer"]+" &#9658;'></label>");

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
	s.name=$("#teamname"+this.team).val();
	var sq=[];
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		sq.push(generics[i].toJSON());
	    }
	}
	s.pilots=sq;
	s.points=$("#total"+this.team).val();
	s.vendor={xwsbenchmark:{builder:"X-Wings Squadron Benchmark",builder_url:"http://xws-bench.github.io/bench/"}};
	s.version="0.2.0";
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
    parseJuggler : function(svg,str) {
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
	    //log("Searching pilot "+pstr[0]);
	    for (j=0;j<PILOTS.length; j++) if (PILOTS[j].name.replace(/\'/g,"")==pstr[0]&&PILOTS[j].faction==this.faction) { pid=j; break; } 
	    var p=new Unit(this.team);
	    p.upg=[];
	    p.selectship(PILOTS[pid].unit,PILOTS[pid].name);
	    for (j=1; j<pstr.length; j++) {
		//log("Searching upg "+pstr[j]);
		for (k=0; k<UPGRADES.length; k++) if (UPGRADES[k].name.replace(/\'/g,"")==pstr[j]) {
			p.upg.push(k);
			if (typeof UPGRADES[k].install!="undefined") UPGRADES[k].install(p);
			break;
		    }
	    }
	}
	nextphase();
	
    },
    parseASCII: function(svg,str) {
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
		p.upg.push(n);
		//log("upg:"+n+" "+UPGRADES[n].type+" "+UPGRADES[n].name);
	        if (typeof UPGRADES[n].install!="undefined") UPGRADES[n].install(p);
	    }
	    if (coord.length>1) {
		var c=Base64.toCoord(coord[1]);
		p.tx=c[0];
		p.ty=c[1];
		p.alpha=c[2];
	    }
	}
	nextphase();
    },
    parseJSON:function(svg,str) {
	var s;
	try {
	    s=$.parseJSON(str);
	} catch(err) {
	    return this.parseJuggler(svg,str);
	}
	var upg_type=["ept","turret","torpedo","mod","title","amd","missile","crew","cannon","bomb","system","illicit","salvaged"];
	var i,j,k;
	var FACTIONS={"rebels":"REBEL","empire":"EMPIRE","scum":"SCUM"};
	this.faction=FACTIONS[s.faction];
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;

	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<s.pilots.length; i++) {
	    var pilot=s.pilots[i];
	    var p;
	    pilot.team=this.team;
	    p=new Unit(this.team);
	    p.selectship(PILOT_dict[pilot.ship],PILOT_dict[pilot.name]);
	    /* Copy all functions for manual inheritance. Call init. */
	    for (k in PILOTS[this.pilotid]) {
		var u=PILOTS[this.pilotpid];
		if (typeof u[k]=="function") p[k]=u[k];
	    }
	    if (typeof pilot.upgrades!="undefined")  {
		for (j=0; j<upg_type.length; j++) { 
		    var upg=pilot.upgrades[upg_type[j]];
		    if (typeof upg!="undefined") 
			for (k=0; k<upg.length; k++) {
			    var u=Upgradefromid(p,upg[k]);		    
			    if (typeof u.install != "undefined") u.install(p);
			}
		}
	    }
	}
	nextphase();
    }
}

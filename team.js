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
    changeplayer: function(name) {
	if (name=="human") this.isia=false; else this.isia=true;
    },
    addpoints: function() { 
	var team=this.team
	var f=["REBEL","SCUM","EMPIRE"];
	$("#team"+team).append("<p id='factionselect"+team+"'></p>");
	for (i=0; i<3; i++) {
	    $("#factionselect"+team).append("<input id='"+f[i]+team+"' name='faction"+team+"' type='radio' onchange='TEAMS["+team+"].changefaction(\""+f[i]+"\")'>");
	    $("#factionselect"+team).append("<label for='"+f[i]+team+"' style='font-size:30px' class='"+f[i]+"'>");
	}
	$("#team"+team).append("<input id='teamname"+this.team+"' type='text' placeholder='Team #"+team+"' style='width:160px'>");
	$("#team"+team).append("<p id='playerselect"+team+"'></p>");
	$("#playerselect"+team).append("<input id='human"+team+"' checked name='player"+team+"' type='radio' selected onchange='TEAMS["+team+"].changeplayer(\"human\")'>");
	$("#playerselect"+team).append("<label for='human"+team+"' >Human</label>");
	$("#playerselect"+team).append("<input id='computer"+team+"' name='player"+team+"' type='radio' onchange='TEAMS["+team+"].changeplayer(\"computer\")'>");
	$("#playerselect"+team).append("<label for='computer"+team+"'>Computer</label>");
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
	$("#team"+team).append("<div id='addunit"+team+"' onclick='TEAMS["+team+"].addunit("+team+")'><span class='plus addunit'>+</span><span class='addunit'>Add new unit</span></div><div><div><div class='totalpts' id='total"+team+"'>0</div></div></div><div  id='totallbl"+team+"'><div><div class='total'>Total points</div></div></div>");
	this.updatepoints();
    },
    tosquadron:function(s) {
	var i;
	var team=this.team;
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		u=generics[i];
		/* Copy all functions for manual inheritance. Call init. */
		for (var i in PILOTS[u.pilotid]) {
		    var p=PILOTS[u.pilotid];
		    if (typeof p[i]=="function") u[i]=p[i];
		}
		u.tosquadron(s);
		allunits.push(u);
		squadron.push(u);
		this.units.push(u);
		if (this.isia) u=$.extend(u,IAUnit.prototype);
	    }
	}
	this.units.sort(function(a,b) {return b.skill-a.skill;});
	squadron.sort(function(a,b) {return b.skill-a.skill;});
	return this.units;
    },
    endselection:function(s) {
	var i;
	var team=this.team;
	this.name=$("#teamname"+this.team).val();
	if (this.name=="") this.name="Squad #"+team;

	$("#team"+team).empty();
	$("#importexport"+team).remove();
	//$("#team"+team).append("<div class='total'>"+this.name+"</div>");
	sq=this.tosquadron(s);
	for (i=0; i<sq.length; i++) {
	    if (team==1) {
		sq[i].m.add(MT(80,70+82*i)).add(MR(90,0,0));

		$("#team1").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    } else {
		sq[i].m.add(MT(820,70+82*i)).add(MR(-90,0,0));
		$("#team2").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    }

	    sq[i].show();
	}
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
	log("ASCII:"+this.toASCII());
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
    parseASCII: function(svg,str) {
	var pilots=str.split(";");
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<pilots.length-1; i++) {
	    var pid=parseInt(pilots[i]);
	    var updstr=pilots[i].split(",");
	    this.faction=PILOTS[pid].faction;
	    this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	    var p=new Unit(this.team);
	    p.upg=[];
	    p.selectship(PILOTS[pid].unit,PILOTS[pid].name);
	    for (j=1; j<updstr.length; j++) p.upg.push(parseInt(updstr[j]));
	}
	nextphase();
    },
    parseJSON:function(svg,str) {
	var s;
	try {
	    s=$.parseJSON(str);
	} catch(err) {
	    alert("JSON error:"+err.message);
	    return;
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
	    for (k in PILOTS[pid]) {
		var u=PILOTS[pid];
		if (typeof u[k]=="function") p[k]=u[k];
	    }
	    if (typeof pilot.upgrades!="undefined")  {
		for (j=0; j<upg_type.length; j++) { 
		    var upg=pilot.upgrades[upg_type[j]];
		    if (typeof upg!="undefined") 
			for (k=0; k<upg.length; k++) {
			    var u=Upgradefromname(p,UPGRADE_dict[upg[k]]);		    
			    if (typeof u.install != "undefined") u.install(p);
			}
		}
	    }
	}
	nextphase();
    }
}

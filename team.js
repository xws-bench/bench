var factions=["REBEL","EMPIRE"];
var currentteam=1;
function Team(team) {
    this.team=team;
}
Team.prototype = {
    setfaction: function(faction) {
	$("#team"+this.team).empty();
	this.faction=faction;
	this.addpoints();
	this.addunit();
	$("#"+faction+this.team).prop("checked",true);	
    },
    changefaction: function(faction) {
	var i;
	log("changing faction "+faction+" for team "+this.team);
	for (var i in generics) {
	    if (generics[i].team==this.team) {
		delete generics[i];
	    }
	}
	this.setfaction(faction);
    },
    addpoints: function() { 
	var team=this.team
	var f=["REBEL","SCUM","EMPIRE"];
	$("#team"+team).append("<input id='teamname"+this.team+"' type='text' placeholder='Enter the squad name' style='width:160px'>");
	$("#team"+team).append("<div id='factionselect"+team+"'></div>");
	for (i=0; i<3; i++) {
	    $("#factionselect"+team).append("<input id='"+f[i]+team+"' name='faction"+team+"' type='radio' onchange='TEAMS["+team+"].changefaction(\""+f[i]+"\")'>");
	    $("#factionselect"+team).append("<label for='"+f[i]+team+"' style='font-size:30px' class='"+f[i]+"'>");
	}
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
	var sq=[];
	for (var i in generics) {
	    if (generics[i].team==team) {
		u=generics[i];
		log("converting first "+u.ship.name);
		u.tosquadron(s);
		squadron.push(u);
		sq.push(u);
	    }
	}
	sq.sort(function(a,b) {return b.skill-a.skill;});
	squadron.sort(function(a,b) {return b.skill-a.skill;});
	return sq;
    },
    endselection:function(s) {
	var i;
	var team=this.team;
	$("#team"+team).empty();
	$("#importexport"+team).remove();
	sq=this.tosquadron(s);
	for (i=0; i<sq.length; i++) {
	    if (team==1) {
		sq[i].m.add(MT(80,70+82*i)).add(MR(90,0,0));
		$("#team1").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    } else {
		sq[i].m.add(MT(800,70+82*i)).add(MR(-90,0,0));
		$("#team2").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    }
	    sq[i].show();
	}
	activeunit=sq[0];
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
    parseJSON:function(str) {
	var s;
	var team=this.team;
	try {
	    s=$.parseJSON(str);
	} catch(err) {
	    alert("JSON error:"+err.message);
	    return;
	}
	$("#team"+team).empty();
	var upg_type=["ept","turret","torpedo","mod","title","amd","missile","crew","cannon","bomb","system","illicit","salvaged"];
	var i,j,k;
	var sq=[];
	for (i=0; i<s.pilots.length; i++) {
	    var pilot=s.pilots[i];
	    var p;
	    p=Pilot(pilot.name);
	    p.team=team;
	    squadron.push(p);
	    sq.push(p);
	    if (typeof pilot.upgrades!="undefined")  {
		for (j=0; j<upg_type.length; j++) { 
		    var upg=pilot.upgrades[upg_type[j]];
		    if (typeof upg!="undefined") 
			for (k=0; k<upg.length; k++)
			    Upgrade(p,UPGRADE_dict[upg[k]]);
		    
		}
	    }
	}
	squadron.sort(function(a,b) {
	    return a.skill-b.skill;
	});
	squadron[0].select();
	return sq;
    }
}

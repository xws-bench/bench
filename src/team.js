var allunits=[];

function Team(team) {
    this.team=team;
    this.isdead=false;
    this.isia=false;
    this.initiative=false;
    this.units=[];
    this.allhits=this.allcrits=this.allevade=this.allred=this.allgreen=0;
}
Team.prototype = {
    setia: function() {
	for (i in squadron) {
	    u=squadron[i];
	    if (squadron[i].team==this.team)
		for (j in IAUnit.prototype) 
		    squadron[i][j]=IAUnit.prototype[j];
	}
	this.ia=true;
    },
    setplayer: function() {
	for (i in squadron) {
	    u=squadron[i];
	    if (squadron[i].team==this.team)
		for (j in IAUnit.prototype) 
		    if (typeof Unit.prototype[j]!="undefined") squadron[i][j]=Unit.prototype[j];
	}
	this.ia=false;
    },
    setfaction: function(faction) {
	$(".listunits .generic").remove();
	this.faction=faction;
	$("#"+faction+"select").prop("checked",true);
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;	
    },
    changefaction: function(faction) {
	$("#rocks").hide();
	$("#debris").hide();
	$("#caroussel").show();
	if (this.faction!=faction) {
	    for (var i in generics) {
		if (generics[i].team==this.team) {
		    delete generics[i];
		}
	    }
	    $("#totalpts").html(0);
	    this.setfaction(faction);
	    displayfactionunits();
	}
    },
    setrocks:function(r) {
	if (typeof r=="undefined") this.rocks=[-1,-1,-1];
	else this.rocks=r;
    },
    displayrockdebris: function(i,w,h,s,g,viewport,pa) {
	var j=(i%MAXROCKS)+(i>=MAXROCKS?ROCKS.length:0);
	var bb=g[j].getBBox();
	var m1;
	if (i<MAXROCKS)
	    m1=MT(i*w/ROCKS.length+w/ROCKS.length/4,h/4-bb.height*s/2).scale(s,s);
	else m1=MT((i-MAXROCKS)*w/DEBRISCLOUD.length+w/DEBRISCLOUD.length/4,3*h/4-bb.height*s/2).scale(s,s);
	g[j].transform(m1);
	g[j].appendTo(viewport);
	g[j].hover(function()  {g[j].attr({strokeWidth:12});},
		   function()  {g[j].attr({strokeWidth:3});});
	g[j].click(function() { 
	    var n=this.rocks.indexOf(i);
	    if (n>-1) {
		this.rocks[n]=-1;
		g[j].attr("fill",pa);
	    } else { 
		if (this.rocks[0]==-1) this.rocks[0]=i;
		else if (this.rocks[1]==-1) this.rocks[1]=i;
		else if (this.rocks[2]==-1) this.rocks[2]=i;
		if (this.rocks[0]>-1&&this.rocks[1]>-1&&this.rocks[2]>-1) {
		    //var o=OBSTACLES[i+(this.team-1)*3];
		    //$("ASTEROID"+this.team).remove();
		    for (var k=0; k<3; k++) {
			var o=OBSTACLES[k+(this.team-1)*3];
			o.g.remove();
			OBSTACLES[k+(this.team-1)*3]=
			    new Rock(this.rocks[k],
				     [o.tx,o.ty,o.alpha],
				     this.team,k);
		    }
		}
		if (this.rocks.indexOf(i)>-1) g[j].attr("fill",halftone(this.color));
	    }
	}.bind(this));
    },
    selectrocks:function() {
	if (typeof this.rocks=="undefined") this.rocks=[-1,-1,-1];
	$(".aster").empty();
	var sa=Snap(".aster");
	var g=[];
	var viewport=sa.g();
	var maxw=0,maxh=0;
	var padebris = sa.image(DEBRISIMG,0,0,256,256).pattern(0,0,256,256);
	var parock = sa.image(ROCKIMG,0,0,256,256).pattern(0,0,256,256);
	for (var i=0; i<ROCKS.length+DEBRISCLOUD.length; i++) {
	    if (i<ROCKS.length) {
		g[i]=sa.path(ROCKS[i]).attr({strokeWidth:3});
		if (this.rocks.indexOf(i)>-1)
		    g[i].attr({fill:halftone(this.color),stroke:this.color});
		else g[i].attr({fill:parock,stroke:"#888"});
	    } else {
		g[i]=sa.path(DEBRISCLOUD[i-ROCKS.length]).attr({strokeWidth:3});
		if (this.rocks.indexOf(i)>-1)
		    g[i].attr({fill:halftone(this.color),stroke:this.color});
		else g[i].attr({fill:padebris,stroke:"#888"});
	    }
	    var bb=g[i].getBBox();
	    if (maxw<bb.width) maxw=bb.width;
	    if (maxh<bb.height) maxh=bb.height;
	}
	var h=$(".aster").height();
	var w=$(".aster").width();
	var s=h/2/maxh;
	if (w/maxw/ROCKS.length<s) s=w/maxw/ROCKS.length;

	for (var i=0; i<ROCKS.length; i++) {
	    this.displayrockdebris(i,w,h,s,g,viewport,parock);
	}
	for (var i=0; i<DEBRISCLOUD.length; i++) {
	    this.displayrockdebris(i+MAXROCKS,w,h,s,g,viewport,padebris);
	}
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
	var tot=0;
	var score1=$("#listunits li").each(function() {
	    var s=0;
	    $(this).find(".pts").each(function() {
		s+=parseInt($(this).text());
	    });
	    $(this).find(".upts").html(s);
	    tot+=s;
	});
	$("#totalpts").html(tot);
    },
    addunit:function(n) {
	if (n==-1) {
	    log("unknown addunit pilot "+pilots[n]);
	}
	var u=new Unit(this.team,n);
	$("#listunits").append(""+u);
	this.updatepoints();
    },
    tosquadron:function(s) {
	var team=this.team;
	var sortable = [];
	var i,j;
	var sortable = this.sortedgenerics();
	var team1=0;
	var id=0;
	for (var i in generics) 
	    if (generics[i].team==1) team1++;
	//log("found team1:"+team1);
	for (var i=0; i<sortable.length; i++) {
	    if (this.team==sortable[i].team) {
		sortable[i].id=id++;
		if (sortable[i].team==2) sortable[i].id+=team1;
		var u=sortable[i];
		/* Copy all functions for manual inheritance.  */
		for (var j in PILOTS[u.pilotid]) {
		    var p=PILOTS[u.pilotid];
		    if (typeof p[j]=="function") u[j]=p[j];
		}
		u.tosquadron(s);
		allunits.push(u);
		squadron.push(u);
		this.units.push(u);
	    }
	}	
	
/*	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		if (this.isia==true) {
		    squadron[i]=$.extend(u,IAUnit.prototype);
		}
	    }
	}
*/	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team&&typeof u.init=="function") u.init();
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		for (var j=0; j<u.upgrades.length; j++) {
		    var upg=u.upgrades[j];
		    //if (upg.id>=0) log("removing "+upg.name+"?"+u.installed+" "+(typeof upg.uninstall));
		    // Need to unwrap generic upgrades, installed when creating the squad
		    if (upg.id>=0&&typeof UPGRADES[upg.id].uninstall=="function")
			UPGRADES[upg.id].uninstall(u);
		    // Now install the upgrades added during the tosquadron call
		    if (typeof upg.install=="function") upg.install(u);
		}
	    }
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		for (var j=0; j<u.upgrades.length; j++) {
		    var upg=u.upgrades[j];
		    if (typeof upg.init=="function"&&!u.isdocked) upg.init(u);
		}
	    }
	}

	this.units.sort(function(a,b) {return b.getskill()-a.getskill();});
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
	var i,j;
	for (i=0; i<this.units.length; i++) this.units[i].g.undrag();
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
		$("#team1").append("<div id=\""+sq[i].id+"\" onclick='select($(this).attr(\"id\"))'>"+sq[i]+"</div>");
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
    sortedgenerics: function() {
	var sortable=[];
	for (var i in generics) 
	    if (generics[i].team==this.team) sortable.push(generics[i]);
	sortable.sort(function(a,b) {
	    if (typeof a.points=="undefined") log("undefined score");
	    if (a.points<b.points) return -1; 
	    if (a.points>b.points) return 1;
	    return (a.toJuggler(false)<b.toJuggler(false));
	});
	return sortable;
    },
    toASCII: function() {
	var s="";
	var sortable=this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) 
	    s+=sortable[i].toASCII()+";";
	return s;
    },
    toKey: function() {
	var s="";
	var p=[];
	for (var i in generics) {
	    if (generics[i].team==this.team) p.push(generics[i]);
	}
	p.sort(function(a,b) { return a.pilotid-b.pilotid; });
	for (var i=0; i<p.length; i++) 
	    s+=p[i].toKey()+";";
	//s+=p[0].toKey();
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
	var sortable=this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) {
	    var jp=sortable[i].toJSON();
	    pts+=jp.points;
	    sq.push(jp);
	}
	s.pilots=sq;
	s.points=pts;
	// update also the number of points
	this.points=pts;
	s.vendor={xwsbenchmark:{builder:"Ynot Squadron Benchmark",builder_url:"http://ynot6517.github.io/bench/"}};
	s.version="0.3.0";
	return s;
    },
    toJuggler:function(translated) {
	var s="";
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	var sortable = this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) 
	    s+=sortable[i].toJuggler(translated)+"\n";
	return s;
    },
    parseJuggler : function(str,translated) {
	var f,i,j,k;
	var pid=-1;
	var getf=function(f) {
	    if (f=="REBEL") return 1;
	    if (f=="SCUM") return 2;
	    return 4;
	};
	var f=7;
	if (str=="") return;
	var pilots=str.trim().split("\n");
	var del=[];
	for (i in generics) { 
	    if (generics[i].team==this.team) delete generics[i];
	}
	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    var lf=0;
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var vat=translate(v);
		var pu="";
		if (PILOTS[j].ambiguous==true&&typeof PILOTS[j].edition!="undefined") pu="("+PILOTS[j].edition+")";
		vat+=pu; v+=pu;
		if (v.replace(/\'/g,"")==pstr[0]) lf=lf|getf(PILOTS[j].faction);
		if (vat.replace(/\'/g,"")==pstr[0]) lf=lf|getf(PILOTS[j].faction);
	    }
	    f=f&lf;
	}
	if ((f&1)==1) this.faction="REBEL"; else if ((f&2)==2) this.faction="SCUM"; else this.faction="EMPIRE";
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;

	for (i=0; i<pilots.length; i++) {
	    pid=-1;
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var vat=v;
		var pu="";
		if (PILOTS[j].faction==this.faction) {
		    vat=translate(v);
		    if (PILOTS[j].ambiguous==true&&typeof PILOTS[j].edition!="undefined") pu="("+PILOTS[j].edition+")";
		    v+=pu;
		    vat+=pu;
		    if (v.replace(/\'/g,"")==pstr[0]) { pid=j; break; }
		    if (vat.replace(/\'/g,"")==pstr[0]) { pid=j; translated=true; break; }
		} 
	    }
	    if (pid==-1) {
		//if (translated==false) return this.parseJuggler(str,true);
		console.log("pid undefined:"+translated+"!!"+pstr[0]+"!!"+this.faction);
	    }
 	    if (pid==-1) {
		log("unknown Juggler pilot:"+pilots[i]+"/"+str);
	    }
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    for (j=0; j<10; j++) p.upg[j]=-1;
	    var authupg=[TITLE,MOD].concat(PILOTS[p.pilotid].upgrades);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) {
		    if ((translated==true&&translate(UPGRADES[k].name).replace(/\'/g,"").replace(/\(Crew\)/g,"")==pstr[j])
			||(UPGRADES[k].name.replace(/\'/g,"")==pstr[j])) {
				if (authupg.indexOf(UPGRADES[k].type)>-1) {
			    	if (typeof UPGRADES[k].upgrades!="undefined") 
						if (UPGRADES[k].upgrades[0]=="Cannon|Torpedo|Missile") {
				    		authupg=authupg.concat(["Cannon","Torpedo","Missile"]);
							p.upgradetype=p.upgradetype.concat(["Cannon","Torpedo","Missile"]);
			   			}
						else  {
							authupg=authupg.concat(UPGRADES[k].upgrades);
							if (typeof UPGRADES[k].upgrades!="") {
								p.upgradetype=p.upgradetype.concat(UPGRADES[k].upgrades); }
						}
					break;
		    	}
		    	if (k==UPGRADES.length) log("UPGRADE undefined: "+pstr[j]);
			}
	    }
		}
	    //for (j=0; j<p.upgradetype.length; j++)
		//p.log("found type "+p.upgradetype[j]);
		//p.log("authupg "+authupg);
		//p.log("pstr "+pstr);
		//p.log("p.upgradetype.length "+p.upgradetype.length);
		//p.log("p.upgradetype "+p.upgradetype);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) {
		    if ((translated==true&&translate(UPGRADES[k].name).replace(/\'/g,"").replace(/\(Crew\)/g,"")==pstr[j])
			||(UPGRADES[k].name.replace(/\'/g,"")==pstr[j])) {
			if (authupg.indexOf(UPGRADES[k].type)>-1) {
			    for (f=0; f<p.upgradetype.length; f++) {
				//log("check ?"+p.upgradetype[f]+" "+UPGRADES[k].type);
				if (p.upgradetype[f]==UPGRADES[k].type&&p.upg[f]==-1) { p.upg[f]=k; break; }
			    }
			    break;
			} else log("** "+pstr[j]+" UPGRADE not listed: "+UPGRADES[k].type+" in "+p.name);
		    }
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
	    if (pid==-1) {
		log("unknown ASCII pilot "+pilots[i]);
	    }
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    for (var j=0; j<10; j++) p.upg[j]=-1;
	    for (var j=1; j<updstr.length; j++) {
		var n=parseInt(updstr[j],10);
		for (var f=0; f<p.upgradetype.length; f++)
		    if (p.upgradetype[f]==UPGRADES[n].type&&p.upg[f]==-1) { p.upg[f]=n; break; }
	        //if (typeof UPGRADES[n].install!="undefined") UPGRADES[n].install(p);
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
	var f={"rebel":REBEL,"scum":SCUM,"imperial":EMPIRE};
	try {
	    s=$.parseJSON(str);
	    ga('send','event', {
		eventCategory: 'social',
		eventAction: 'receive',
		eventLabel: 'xws'
	    });
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
	    var pid=-1;
	    pilot.team=this.team;
	    for (j=0; j<PILOTS.length; j++) {
		if (PILOTS[j].faction==this.faction&&
		   PILOTS[j].unit==PILOT_dict[pilot.ship]) {
		    va=PILOTS[j].name;
		    if (va==PILOT_dict[pilot.name]) { pid=j; break; }
		}
	    }
	    if (pid==-1) throw("pid undefined:"+PILOT_dict[pilot.name]);

	    p=new Unit(this.team,pid);
	    p.upg=[];
	    for (var j=0; j<10; j++) p.upg[j]=-1;

	    if (typeof pilot.upgrades!="undefined")  {
		var nupg=0;
		for (j in pilot.upgrades) { 
		    var upg=pilot.upgrades[j];
		    for (k=0; k<upg.length; k++) {
			nupg++;
			for (var z=0; z<UPGRADES.length; z++) 
			    if (UPGRADES[z].name==UPGRADE_dict[upg[k]]) {
				for (var f=0; f<p.upgradetype.length; f++)
				    if (p.upgradetype[f]==UPGRADES[z].type&&p.upg[f]==-1) { p.upg[f]=z; break; }
				//if (typeof UPGRADES[z].install != "undefined") UPGRADES[z].install(p);
				break;
			    }
		    }
		}
	    }
	}
	//nextphase();
    }
}

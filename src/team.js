var allunits=[];
var Unit = window.Unit || {};
var Upgrade = window.Upgrade || {};
var IAUnit = window.IAUnit || {};
var Snap = window.Snap || {};
var PILOTS = window.PILOTS || {};
var UPGRADES = window.UPGRADES || {};
function Team(team) {
    this.team=team;
    this.isdead=false;
    this.isia=false;
    this.initiative=false;
    this.teamlist=null;   // New for teamlist functionality
    this.units=[];
    this.conditions=[];
    this.captain=null;
    this.faction=Unit.REBEL;
    this.allhits=this.allcrits=this.allevade=this.allred=this.allgreen=0;
}
Team.prototype = {
    setteamlist: function(teamlist){
        if(typeof teamlist!=="undefined"){
            this.teamlist=teamlist;
        }
        else{
            this.teamlist=null;
        }
    },
    setia: function() {
	for (var i in squadron) {
	    var u=squadron[i];
	    if (squadron[i].team==this.team) {
		for (var j in IAUnit.prototype) {
		    squadron[i][j]=IAUnit.prototype[j];
		}
		squadron[i].IAinit();
	    }
	}
	this.ia=true;
    },
    setplayer: function() {
	for (var i in squadron) {
	    var u=squadron[i];
	    if (squadron[i].team==this.team)
		for (var j in IAUnit.prototype) 
		    if (typeof Unit.prototype[j]!="undefined") squadron[i][j]=Unit.prototype[j];
	}
	this.ia=false;
    },
    setfaction: function(faction) {
	$(".listunits .generic").remove();
	this.faction=faction;
	$("#"+faction+"select").prop("checked",true);
	this.color=(this.faction==Unit.REBEL)?RED:(this.faction==Unit.EMPIRE)?GREEN:YELLOW;	
    },
    changefaction: function(faction,force) {
	$("#rocks").hide();
	$("#debris").hide();
	$("#caroussel").show();
	if (this.faction!=faction||force==true) {
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
	    $(this).find(".upts span:first-child").html(s);
	    tot+=s;
	});
	$(".upts span:nth-child(2)").html(tot);
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
        // Refactor to generate squadron from teamlist.
	var i,j;
        var prevTeam=currentteam;
        currentteam=this;
        // Early escape
        if((typeof this.units==="undefined" || this.units.length===0)
            && (typeof this.teamlist==="undefined" || this.teamlist.getShips().length===0)){
            return this.units;
        }
        
        this.points=this.teamlist.getCost();
        var shiplist=this.teamlist.getShips();
	var team1=(this.team===1)?0:TEAMS[1].teamlist.getShips().length;
        // var sortable = this.sortedgenerics();
	var id=0;
	this.captain=null;
	//log("found team1:"+team1);
        // Iterate over ships on this team, create them, add them to allunits and squadron
	for(i in shiplist){
            var ship=shiplist[i];
            var u=addunit(ship.pilotID,this.teamlist.listFaction);
            for(var j in Unit.prototype){
                u[j]=Unit.prototype[j];
            }
            u.tosquadron(s);
            u.tlIndex=i;    // Hack to let ships know index of their SimpleUnit
            u.team=this.team;
            
            // Set ship's position (mainly for loading ASCII from URL
            u.tx=ship.position.x;
            u.ty=ship.position.y;
            u.alpha=ship.position.rot;
            //u.m.rotate(ship.position.rot);
            
            //Let's just assume there will always be *at least* as many upgrade slots as necessary.
            var impUpgList=ship.upgrades.slice(); // list of upgrade indices
            var installed=false;
            while(impUpgList.length>0){
                var upg=UPGRADES[impUpgList[0]]; // first upgrade from the top of the array
                for (var f=0, unusedSlots=(typeof u.upgradetype!=="undefined")?u.upgradetype.length:0; f<unusedSlots; f++){
                    if (u.upgradetype[f]==upg.type&&u.upg[f]==-1) { 
                        addupgrade(u,impUpgList[0],f);
                        installed=true; 
                        impUpgList.shift(); break; }
                }
                if(installed){installed=false; continue;} // If we found a slot, great!  Move on.
                else{ // Not enough of required type of slots.
                    var idx=u.upgradetype.length; // Find last index of upgradetype array
                    u.upgradetype.push(upg.type); // Add a new entry of the type we want to install
                    while(u.upg.length<=idx){u.upg.push(-1);} // lengthen p.upg as well.
                    addupgrade(u,impUpgList[0],idx);
                    impUpgList.shift();
                    continue;
                }
                throw("Upgrade not installed:"+upg.name+"-"+impUpgList[0]+"/"+currentteam.faction+"/"+PILOT_dict[pilot.pilotID]);
                break; // In case of emergency
            }

            // Set graphical context, add u to various lists
            u.id=team1 + id++;

            /* Copy all functions for manual inheritance.  */
            for (var j in PILOTS[u.pilotid]) {
                var p=PILOTS[u.pilotid];
                if (typeof p[j]=="function") u[j]=p[j];
            }
            
            // Add new ship to all relevant lists
            allunits.push(u);
            squadron.push(u);
            this.units.push(u);
        }
	
        /* This section is required to ensure that init functions that rely on
         * other members of the list (e.g. docking Nashta Pup, Phantom, etc.)
         * works correctly.  I am very sad that this is necessary. */
        for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team){
                if(typeof u.init=="function") u.init();
                for (var j=0; j<u.upgrades.length; j++) {
		    var upg=u.upgrades[j];
		    if (typeof upg.dockable!=="undefined" 
                            && upg.dockable 
                            && typeof upg.init=="function") {
                        upg.init(u);
                    }
		}
            }            
	}
        
        /* However, the following section does not seem to be necessary any longer
         * as we are not instantiating each ship multiple times
         */
//	for (i in squadron) {
//	    u=squadron[i];
//	    if (u.team==this.team) {
//		for (var j=0; j<u.upgrades.length; j++) {
//		    var upg=u.upgrades[j];
//		    //if (upg.id>=0) log("removing "+upg.name+"?"+u.installed+" "+(typeof upg.uninstall));
//		    // Need to unwrap generic upgrades, installed when creating the squad
//		    if (upg.id>=0&&typeof UPGRADES[upg.id].uninstall=="function")
//			UPGRADES[upg.id].uninstall(u);
//		    // Now install the upgrades added during the tosquadron call
//		    if (typeof upg.install=="function" && upg.install !== Upgrade.prototype.install) upg.install(u);
//		    Upgrade.prototype.install.call(upg,u);
//		}
//	    }
//	}
//	for (i in squadron) {
//	    u=squadron[i];
//	    if (u.team==this.team) {
//		for (var j=0; j<u.upgrades.length; j++) {
//		    var upg=u.upgrades[j];
//		    if (typeof upg.init=="function"&&!u.isdocked) upg.init(u);
//		}
//	    }
//	}

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
	if (this.name=="" || typeof this.name==="undefined") this.name="Squad #"+team;
	
	$("#team"+team).empty();
	$("#importexport"+team).remove();
	var sq=this.tosquadron(s);
        // Init ship positions at beginning of game
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
		    sq[i].tx=(GW - 80)+(sq[i].islarge?20:0);
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
	if(typeof this.teamlist!=="undefined"&&this.teamlist!==null){
            // If we are saving ASCII data during play, get actual positions from
            // each ship before compiling ASCII.
            // Unfortunately, after re-ordering the units array is not always
            // in the same order as the teamlist.
            if(this.units.length!==0){
                for(var i in this.units){
                    var pos={x:0,y:0,rot:0};
                    pos.x=this.units[i].tx;
                    pos.y=this.units[i].ty;
                    pos.rot=this.units[i].alpha;
                    this.teamlist.listShips[this.units[i].tlIndex].position=pos;
                }
            }
            return this.teamlist.toASCII();
        }
        else return "";
    },
    toKey: function() {
	if(typeof this.teamlist!=="undefined"&&this.teamlist!==null){
            return this.teamlist.toKey();
        }
        else return "";
    },
    toJSON:function() {
	if(typeof this.teamlist!=="undefined"&&this.teamlist!==null){
            return this.teamlist.outputJSON();
        }
        else return "";
    },
    toJuggler:function(translated,improved) {
	if(typeof this.teamlist!=="undefined"&&this.teamlist!==null){
            return this.teamlist.outputJuggler(translated,improved);
        }
        else return "";
    },
    parseJuggler : function(str,translated) {
        if(typeof this.teamlist!=="undefined"&&this.teamlist!==null){
            return this.teamlist.inputOldJuggler(str);
        }
        else{
            this.teamlist=new TeamList();
            return this.teamlist.inputOldJuggler(str);
        }
    },
    parseASCII: function(str) {
        for (var i in generics) if (generics[i].team==this.team) delete generics[i];
        
        if(typeof this.teamlist!=="undefined"&&this.teamlist!==null){
            this.teamlist.inputASCII(str);
        }
        else{
            this.teamlist=new TeamList()
            this.teamlist.inputASCII(str);
        }
    },
    parseJSON:function(str,translated) {
	if(typeof this.teamlist!=="undefined"&&this.teamlist!==null){
            return this.teamlist.inputJSON(str);
        }
        else{
            return this.teamlist=new TeamList(str);
        }
    }
}

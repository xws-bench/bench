/*<span class="smallbutton" onclick="SQUADLIST.displaycombats({{nrows}})">Replay</span>*/
//var JUGGLERWEBSITE="http://lists.starwarsclubhouse.com/api/v1/";
var JUGGLERWEBSITE="";

var mk2split = function(t) {
    var tt=t.split("\.");
    var r=[];
    var missing=false;
    for (var i=1; i<tt.length; i++) {
	if (tt[i].match(/_II.*/)) { r.push(tt[i-1]+"."+tt[i]); tt[i]=null; missing=false;} 
	else { if (tt[i-1]) r.push(tt[i-1]); missing=true; }
    }
    if (missing) r.push(tt[tt.length-1]);
    return r;
}
function Squadlist(id) {
    this.id=id;
    TEMPLATES["row-manage"]=$("#row-manage").html();
    Mustache.parse(TEMPLATES["row-manage"]);  
    TEMPLATES["header-manage"]=$("#header-manage").html();
    Mustache.parse(TEMPLATES["header-manage"]);  
    
    $(id).html(Mustache.render(TEMPLATES["header-manage"],{translation:UI_translation["type"]}));
    var self=this;

    $(id+" tbody").on( 'click', 'tr', function () {
        $(id+" .selected").removeClass('selected');
        $(this).addClass('selected');
    } );
}


Squadlist.prototype = {
    isinrow: function(t) {
	return ((typeof this.rows!="undefined")&&(this.rows.indexOf(t)>-1)); 
    },
    filter: function(f) {
	for (var i in this.rows) {
	    if (!this.rows[i].match(f)) {
		$("#r"+i).hide();
	    }
	    else {
		$("#r"+i).show();
	    }
	}

    },
    import:function(t) {
    },
    addrow: function(team,name,pts,faction,jug,fill,tournament,teamlist) {
	var n=faction.toUpperCase();
	if (typeof localStorage[name]=="undefined"||fill==true) {
	    this.rows[this.nrows]=teamlist;
	    //TEAMS[0].parseJuggler(jug,false);//true);
	    //var jjug = TEAMS[0].toJuggler(true,true);
	    $(this.id +" tbody").append(
		Mustache.render(TEMPLATES["row-manage"],{
		    nrows:this.nrows,
		    faction:n,
		    pts:pts,
		    name:name,
		    tournament:tournament,
		    jug:teamlist.outputJuggler(true,true),//.replace(/\n/g,"<br>")
                    teamlist:teamlist
		}));
	    this.nrows++;
	}
    },
    removerow:function(t) {
	var u=this.rows[t];
	//TEAMS[0].parseJuggler(u.outputJuggler(),false);
        //var name="SQUAD."+TEAMS[0].toASCII();
	var name="SQUAD."+u.toASCII();
	$("#r"+t).remove();
	delete this.rows[t];
	if (typeof localStorage[name]!="undefined") {
            delete localStorage[name];
        }
    },
    createfromrow:function(t) {
	var data = this.rows[t];
	currentteam=TEAMS[3];
        currentteam.setteamlist(data);
	//currentteam.parseJuggler(data,true);
	//console.log("data is "+data);
	createsquad(data.listFaction,data);
	for (var j in generics) {
	    var u=generics[j];
	    if (u.team==3) {
		for (var i in metaUnit.prototype) u[i]=metaUnit.prototype[i];
	    }
	}
		//displayfactionunits(true);
    },
    toplist: function() {
	var i;
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	for (i=0; i< TOP_squads.length; i++) {
	    TEAMS[0].parseJuggler(TOP_squads[i],false); 
	    this.addrow(0,i,TEAMS[0].points,TEAMS[0].faction,TEAMS[0].toJuggler(false),true); 
	}
    },
    user: function() {
	var i;
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	for (i in localStorage) {
	    if (typeof localStorage[i]=="string"&&i.match(/SQUAD.*/)) {
		var l=$.parseJSON(localStorage[i]);
                // Should probably split this check into old and new versions
		if (typeof l.version==="undefined" && typeof l.jug=="undefined"||l.jug===""||typeof l.pts=="undefined"||l.pts===0||typeof l.faction=="undefined")
		    delete localStorage[i];
		else {
                    var newTeamList=new TeamList();
                    var converted=true;
                    // One handler for new list types, one for old list types
                    if(typeof l.version!=="undefined"){
                        newTeamList.inputJSON(l);
                    }
                    else{
                        converted = newTeamList.inputOldJuggler(l);
                    }
                    if(converted){
                        var jug2=newTeamList.outputJuggler();
                        var key=newTeamList.toKey();
                        //this.addrow(0,i,l.pts,l.faction,l.jug,true);
                        this.addrow(0,i,newTeamList.getCost(),newTeamList.listFaction,jug2,true,null,newTeamList); 
                    }
                    else{
                        delete localStorage[i];
                    }
		}
	    }
	}
    },
    addtournamentlists:function(latest) {
	var req = new XMLHttpRequest();
        req.overrideMimeType("application/json");  // For local juggler file loading
	req.open('GET', JUGGLERWEBSITE+"tournament/"+latest, true);
	req.onreadystatechange = function() {
	    if (req.readyState === 4) {
		if (req.status >= 200 && req.status < 400) {
		    var t=$.parseJSON(req.responseText);
		    var cc="us";
		    if (typeof CC[t.tournament.venue.country]=="undefined") {
			console.log("No country:"+t.tournament.venue.country);
		    } else cc=CC[t.tournament.venue.country].toLowerCase();
		    var event={
			cc:cc,
			country:t.tournament.venue.country,
			type:t.tournament.type,
			format:t.tournament.format.replace(/Standard -/,""),
			date:t.tournament.date};
		    var list=[];
		    for (var i in t.tournament.players) {
			var p=t.tournament.players[i];
			if (typeof p.list!="undefined") {
                            var newTeamList=new TeamList(JSON.stringify(p.list));
			    //TEAMS[0].parseJSON(p.list);
			    //TEAMS[0].toJSON();
			    var key=newTeamList.toKey();
			    if (this.allresults[key]!=true) {
				//var jug=TEAMS[0].toJuggler(false);
                                var jug2=newTeamList.outputJuggler();
				list.push({points:newTeamList.getCost(),faction:newTeamList.listFaction,jug:jug2});
				this.addrow(0,"COMPETITION"+key,newTeamList.getCost(),newTeamList.listFaction,jug2,false,event,newTeamList); 
				this.allresults[key]=true;
			    }
			}
		    }
		    localStorage["_TOURNAMENT"+latest]=JSON.stringify({"list":list,"event":event});
		} else console.log("no tournament "+latest+" (status:"+req.status+")"); 
	    } 
	}.bind(this);
	req.send();
    },
    latest: function() {
	var req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
	var i;
	this.allresults={};
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	// Feature detection for CORS
	req.open('GET', JUGGLERWEBSITE+"tournament/tournaments", true);
	// Just like regular ol' XHR
	req.onreadystatechange = function() {
            if (req.readyState === 4) {
		if (req.status >= 200 && req.status < 400) {
		    var resp=$.parseJSON(req.responseText);
		    resp.tournaments.sort(function(a,b) {
			return parseInt(a,10)-parseInt(b,10);
		    });
		    var p=[];
		    for (i=0; i<5; i++) {
			var latest=resp.tournaments[resp.tournaments.length-1-i];
                        this.addtournamentlists(latest); 
                        // caching only works if we can mark older versions as "dirty", so disabled.
//			if (typeof localStorage["_TOURNAMENT"+latest]=="undefined") {
//			    this.addtournamentlists(latest);
//			} else {
//			    
//			    var tt=$.parseJSON(localStorage["_TOURNAMENT"+latest]);
//			    for (var j in tt.list) {
//				var l=tt.list[j];
//				this.addrow(0,"COMPETITION0",l.points,l.faction,l.jug,false,tt.event);
//			    }
//			    console.log("tournament "+latest+" in cache");
//			}
			p[i]=parseInt(latest,10);
		    }
		    for (i in localStorage) {
			if (i.match(/_TOURNAMENT/)!=null) {
			    var k=parseInt(i.replace(/_TOURNAMENT([0-9]*)/,"$1"),10);
			    if (p.indexOf(k)==-1) {
				console.log("removing old tournament "+i);
				delete localStorage[i];
			    }
			}
		    }
		} else console.log("tournaments not loaded (status:"+req.status+")");
            }
	}.bind(this);
    req.send();
	
    },
    displaycombats: function(data) {
	generics=[];
	squadron=[];
	if (typeof data!="undefined") { 
	    var d=this.rows[data].outputJuggler();
	    TEAMS[0].parseJuggler(d,true);
	    var team=TEAMS[0].toJuggler(false);
	    team=team.replace(/\n/g,".");
	    team=team.replace(/ \+ /g,"*");
	    //t=t.replace(/-/g,"\\-");
	    team=team.replace(/ /g,"_");
	    SEARCHINGSQUAD=team;
	}
	stype="";
	var t=SEARCHINGSQUAD;
	$("#replay").attr("src","space.html");

	/*
	  if (LANG!="en") {
	  TEAMS[0].parseJuggler(s1,false);
	  s1=TEAMS[0].toJuggler(true);
	  }*/
	/*ga('send','event', {
	    eventCategory: 'interaction',
	    eventAction: 'battlelog',
	    eventLabel: 'battlelog',
	    eventValue:response.rows.length
	});*/

	for (var i=0; i<mySpreadsheets.length; i++) {
	    $('#squadbattlediv').sheetrock({
		url: mySpreadsheets[i],
		/* score: B, squad:C, E and A: url */
		query:"select B,C,E,A where C contains '"+t+"'",
		/*callback:myCallback,*/
		fetchSize:2,
		rowTemplate:myTemplate
	    });
	}   
    },
    printfromrow: function(t) {
	var data = this.rows[t];
	generics=[];
	squadron=[];
	//TEAMS[0].parseJuggler(data,true);
	currentteam = TEAMS[0];
	for (var i in generics) {
	    var u=generics[i];
	    if (u.team==0) {
		addunit(u.pilotid,currentteam.faction,u);
		for (var j=0; j<u.upgradetype.length; j++) {
		    var upg=u.upg[j];
		    if (upg>-1) {
			addupgrade(u,upg,j);
		    }
		}
	    }
	}
	printunits();
	window.print();
    },
    checkrow:function(n,t) {
	prepareforcombat(this.rows[t],n);
    }
}

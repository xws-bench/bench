
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
	console.log("matching with "+f);
	for (var i in this.rows) {
	    if (!this.rows[i].match(f)) {
		$("#r"+i).hide();
	    }
	    else {
		$("#r"+i).show();
	    }
	}

    },
    addrow: function(team,name,pts,faction,jug,fill,isselection) {
	if (isselection!=true) enablenextphase();
	var n=faction.toUpperCase();
	if (typeof localStorage[name]=="undefined"||fill==true) {
	    this.rows[this.nrows]=jug;
	    $(this.id +" tbody").append(
		Mustache.render(TEMPLATES["row-manage"],{
		    nrows:this.nrows,
		    faction:n,
		    pts:pts,
		    name:name,
		    jug:jug//.replace(/\n/g,"<br>")
		}));
	    this.nrows++;
	}
    },
    removerow:function(t) {
	var row = this.table.row(t.parents("tr"));
	var data = row.data()[4];
	delete localStorage[data];
	row.remove().draw(false);
    },
    createfromrow:function(t) {
	var data = this.rows[t];
	currentteam=TEAMS[3];
	currentteam.parseJuggler(data,true);
	//console.log("data is "+data);
	createsquad(currentteam.faction);
	for (var j in generics) {
	    var u=generics[j];
	    if (u.team==3) {
		for (var i in metaUnit.prototype) u[i]=metaUnit.prototype[i];
	    }
	}

	document.location="#creation";
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
	    if (LANG!="en")
		this.addrow(0,i,TEAMS[0].points,TEAMS[0].faction,TEAMS[0].toJuggler(true),true); 
	    else
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
		//delete localStorage[i];
		
		var l=$.parseJSON(localStorage[i]);
		if (typeof l.jug=="undefined"||typeof l.pts=="undefined"||typeof l.faction=="undefined")
		    delete localStorage[i]
		else {
		    if (LANG!="en") { 
			TEAMS[0].parseJuggler(l.jug,false); 
			this.addrow(0,i,l.pts,l.faction,TEAMS[0].toJuggler(true),true); 
		    } else {
			this.addrow(0,i,l.pts,l.faction,l.jug,true);
		    }
		}
	    }
	}
    },
    latest: function() {
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	for (var i=0; i<mySpreadsheets.length; i++) {
	    $('#squadlist').sheetrock({
		url: mySpreadsheets[i],
		query:"select C order by A desc",
		//callback:myCallbacksl,
		fetchSize:40,
		rowTemplate:this.myTemplatesl,//function () { return "";},
	    });
	}  
    },
    myTemplatesl: function(o) { 
	var cells= o.cellsArray;
	var s="";
	var squad=cells[0];
	var tt=squad.split("VS");
	if (tt.length<2) return;
	var team1=mk2split(tt[0]);
	var team2=mk2split(tt[1]);
	var t1="",s1="",t2="",s2="";

	for (var j=0; j<team1.length-1; j++) {
	    s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    t1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	}
	for (var j=0; j<team2.length-1; j++) {
	    s2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    t2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	}
	TEAMS[0].parseJuggler(s1,false);
	TEAMS[0].toJSON();
	if (typeof SQUADLIST.log[t1]=="undefined") {
	    SQUADLIST.addrow(0,"SQUAD."+TEAMS[0].toASCII(),TEAMS[0].points,TEAMS[0].faction,t1,true);
	    SQUADLIST.log[t1]=true;
	}
	TEAMS[0].parseJuggler(s2,false);
	TEAMS[0].toJSON();
	if (typeof SQUADLIST.log[t2]=="undefined") {
	    SQUADLIST.addrow(0,"SQUAD."+TEAMS[0].toASCII(),TEAMS[0].points,TEAMS[0].faction,t2,true);
	    SQUADLIST.log[t2]=true;
	}

    },
    displaycombats: function(data) {
	generics=[];
	squadron=[];
	if (typeof data!="undefined") { 
	    var d=this.rows[data];
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
	TEAMS[0].parseJuggler(data,true);
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

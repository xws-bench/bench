var FREECOMBAT=0,SCENARIO=1,SCENARIOCREATOR=2;
var mode=FREECOMBAT;

function prepareforcombat(t,n) {
    $("#squad"+n).html(t);
    TEAMS[n].parseJuggler(t);
    TEAMS[n].name="SQUAD."+TEAMS[n].toASCII();
    TEAMS[n].toJSON();// Just for points
    if (typeof localStorage[TEAMS[n].name]=="undefined") {
	localStorage[TEAMS[n].name]=JSON.stringify({"pts":TEAMS[n].points,"faction":TEAMS[n].faction,"jug":t});
    }
    if (!SQUADLIST.isinrow(t)) {
	/*console.log("Juggler:"+t+" "+n+" ->" +TEAMS[n].toJuggler(true)+" "+TEAMS[n].faction);*/
	SQUADLIST.addrow(0,TEAMS[n].name,TEAMS[n].points,TEAMS[n].faction,TEAMS[n].toJuggler(true),true);
    }
    $("#squad"+n+"points").html(TEAMS[n].points);
    enablenextphase();
}
function scenariomode(b) {
    mode=b;
    switch(b) {
    case SCENARIO:
	$(".duelmode").hide();
	$(".scenariocreator").hide();
	$(".scenariomode").show();
	break;
    case FREECOMBAT:
	$(".scenariocreator").hide();
	$(".scenariomode").hide();
	$(".duelmode").show();
	break;
    case SCENARIOCREATOR:
	$(".duelmode").hide();
	$(".scenariomode").hide();
	$(".scenariocreator").show();
    }
    enablenextphase();
}

function Scenariolist(id) {
    this.id=id;
    TEMPLATES["scenario-row-manage"]=$("#scenario-row-manage").html();
    Mustache.parse(TEMPLATES["scenario-row-manage"]);  
    TEMPLATES["scenario-header-manage"]=$("#scenario-header-manage").html();
    Mustache.parse(TEMPLATES["scenario-header-manage"]);  
    
    $(id).html(Mustache.render(TEMPLATES["scenario-header-manage"],{}));
    var self=this;

    $(id+" tbody").on( 'click', 'tr', function () {
        $(id+" .selected").removeClass('selected');
        $(this).addClass('selected');
    } );
    this.rows=[];
    this.nrows=0;
    this.log={};
    for (var i in SCENARIOS) {
	var scenario=SCENARIOS[i];
	this.addrow(i,scenario.text,scenario.wincond,scenario.link);
    }
}

Scenariolist.prototype = {
    remove: function(n) {
	$("#sc"+n).remove();
	delete localStorage["SCENARIO"+this.rows[n].title];
	delete this.rows[n];
    },
    isinrow: function(t) {
	return ((typeof this.rows!="undefined")&&(this.rows.indexOf(t)>-1)); 
    },
    addrow: function(title,text,wincond,link) {
	console.log("adding scenario "+title);
	this.rows[this.nrows]={title:title,text:text,link:link,wincond:wincond};
	var arg=LZString.decompressFromEncodedURIComponent(link);
	var args=arg.split('&');
	TEAMS[3].parseASCII(args[1]);
	var victory="Death match";
	if (wincond>0) victory="Destroy all units before "+wincond+" turns";
	if (wincond<0) victory="Highest score after "+wincond+" turns";
	$(this.id +" tbody").append(
	    Mustache.render(TEMPLATES["scenario-row-manage"],{
		nrows:this.nrows,
		title:title,
		text:text,
		faction:TEAMS[3].faction,
		wincond:victory,
		link:link
	    }));
	this.nrows++;
	if (typeof localStorage["SCENARIO"+title]=="undefined") {
	    localStorage["SCENARIO"+title]=JSON.stringify({"title":title,"text":text,"link":link,"wincond":wincond});
	}
    },
    user: function() {
	var i;
	$(this.id+" tbody").html("");
	for (i in localStorage) {
	    if (typeof localStorage[i]=="string"&&i.match(/SCENARIO.*/)) {
		//delete localStorage[i];
		var l=$.parseJSON(localStorage[i]);
		if (typeof l.title=="undefined"||typeof l.text=="undefined"||typeof l.link=="undefined")
		    delete localStorage[i];
		else {
		    if (typeof l.wincond=="undefined") l.wincond=0;
		    this.addrow(l.title,l.text,l.wincond,l.link);
		}
	    }
	}
    },
    checkrow:function(t) {
	HEADERS=this.rows[t].text;
	SCENARIOTITLE=this.rows[t].title;
	WINCOND=this.rows[t].wincond;
	var link=this.rows[t].link;
	var arg=LZString.decompressFromEncodedURIComponent(link);
	var args=arg.split('&');
	prepareforcombat($("#squad1").html(),1);
	args[0]=TEAMS[1].toASCII();
	arg=args.join("&");
	TEAMS[1].parseASCII(args[0]);
	document.location.search="?"+LZString.compressToEncodedURIComponent(arg);
    }
}

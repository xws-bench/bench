var FREECOMBAT=0,SCENARIO=1,SCENARIOCREATOR=2;
var mode=FREECOMBAT;

function prepareforcombat(t,n) {
    if (typeof t !== "undefined" && t.getShips().length!==0){
        //TEAMS[n].parseJuggler(t,true);
        $("#squad"+n).html(t.outputJuggler(true));
        TEAMS[n].name="SQUAD."+t.toASCII();
        TEAMS[n].setteamlist(t);
        //TEAMS[n].toJSON();// Just for points

        if (typeof localStorage[TEAMS[n].name]=="undefined") {
            localStorage.setItem(TEAMS[n].name,t.outputJSON());
            //localStorage[TEAMS[n].name]=t.outputJSON();
        }
        if (!SQUADLIST.isinrow(t)) {
            SQUADLIST.addrow(0,TEAMS[n].name,t.getCost(),t.listFaction,t.outputJuggler(true),true,null,t);
        }
        $("#squad"+n+"points").html(t.getCost());
    }
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

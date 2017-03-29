var mySpreadsheets=[
/*"https://docs.google.com/spreadsheets/d/1n35IFydakSJf9N9b9byLog2MooaWXk_w8-GQdipGe8I/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1Jzigt2slBhygjcylCsy4UywpsEJEjejvtCfixNoa_z4/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1dkvDxaH3mJhps9pi-R5L_ttK_EmDKUZwaCE9RZUYueg/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1IoViAKvpZFRlmzBXeY6S9jYX4Ju9ccL5boNxhLwUXiY/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1D2UbgrM6V7KJcRmyUQBxn5jxT-Nj8UGlpvLYlasH6TQ/edit#gid=0",
"https://docs.google.com/spreadsheets/d/15pAnwcBlp4l01eJgyNXW9uGu5jYDhxk3oSveBIQhJFc/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1P64wZXXV_3gJE0wdLTDWW2pdOliInCRlTXm1lgYNumc/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1zlqDnXJ9J-k4apP1DadPx_vdv6Asdp_b9QvaytKI9ek/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1hK3niJbtDIE8xxv-9vQGcqd5eQ1D6dP5hQ7GicDVh-A/edit#gid=0",*/
"https://docs.google.com/spreadsheets/d/1KR1uc7QgbiDkxCU5J1rm9qBMMjwKC0WyfAuDhnrbgAA/edit#gid=0"
];
var AIstats = function(error,options, response) {
    if (typeof response.rows!="undefined") {
	//log("rows: "+response.rows.length);
    	for (var i=1; i<response.rows.length; i+=200) {
	    var scorec=0;
	    var n=0;
	    var median=0;
	    for (var j=1; j<200&&j+i<response.rows.length; j++) {
		var t=response.rows[i+j].cellsArray[0].split(" ");
		var ts1=t[0].split(":");
		var type1=ts1[0];
		var score1=ts1[1];
		var ts2=t[1].split(":");
		var type2=ts2[0];
		var score2=ts2[1];
		var scoreco=0;
		var scoreh=0;
		if (type2!=type1) {
		    if (type2=="Player") scoreh+=parseInt(score2,10);
		    else scoreco+=parseInt(score2,10);
		    if (type1=="Player") scoreh+=parseInt(score1,10);
		    else scoreco+=parseInt(score1,10);
		    median+=Math.floor((scoreco)/(scoreco+scoreh)*100);
		    n++;
		}
	    }
	}
    }
}
function displayAIperformance() {
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadbattlediv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select B",// where C ends with '"+t+"' or C starts with '"+t+"'",
	    callback:AIstats,
	    rowTemplate:function () { return "";},
	    labels:["Score"]
	});
    }   
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
function recomputeurl() {
    $('#squadbattlediv').sheetrock({
	url: mySpreadsheets[0],
	query:"select C",
	callback:computeurl,
	rowTemplate:function () { return "";},
	labels:["ascii","short","long"]
    }); 
}
/* Unused ? */
function displaysquads(t) {
    var s1=t;
    t=t.replace(/\n/g,".");
    t=t.replace(/ \+ /g,"*");
    t=t.replace(/ /g,"_");
    SEARCHINGSQUAD=t;
    var t1="";
    /*
    if (LANG!="en") {
	TEAMS[0].parseJuggler(s1,false);
	s1=TEAMS[0].toJuggler(true);
    }*/
    t1=s1.replace(/\n/g,"<br>");

    //$("#squadlist").html(t1);
    //SQUADLIST.table.clear().draw();;
 
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadlistdiv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select C where C contains '"+t+"'",
	    callback:myCallbacksl,
	    fetchSize:2,
	    rowTemplate:function () { return "";},
	    labels:["","Type","Pts","Units","",""]
	});
    }   
}
function findsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    var jug=currentteam.toJuggler(false);
    var pattern=jug.replace(/ \+.*/g,"").replace(/\n/g,".*\.").replace(/ /g,"_");
    $('#squad'+t).sheetrock({
	url: mySpreadsheets[0],
	query:"select C where C matches '.*VS"+pattern+"'",
	callback:matchsquad,
	fetchSize:100,
	rowTemplate:function () { return "";},
	labels:["squad"]
    }); 
}
function matchsquad(error, options,response) {
    if (response!=null&&typeof response.rows!="undefined") {
	response.rows.sort(function(a,b) { return a.cellsArray[0]<b.cellsArray[0]; });
	var str="<ol>";
	var oldsquad="";
   	for (var i in response.rows) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    if (tt[1]==oldsquad) continue;
	    str+="<li>"+tt[1]+"</li>";
	    oldsquad=tt[1];
	}
	str+="</ol>";
    }
}
var myCallbacksl = function (error, options, response) {
    if (response!=null&&typeof response.rows!="undefined") {
	//console.log("found "+response.rows.length+" answers");
	for (var i=1; i<response.rows.length; i++) {
	    try {
		//console.log(response.rows[i].cellsArray);
		myTemplatesl(i,response.rows[i].cellsArray,null,null);
	    } catch(e) {
	    }
	}
	//SQUADLIST.table.columns.adjust().draw();
    }
};

var myTemplate = function(o) { //num,cells,cellarrays,labels) {
    var cells = o.cellsArray;
    var s="";
    var t=cells[0].split(" ");
    if (t.length<2) return;
    var ts1=t[0].split(":");
    var type1=ts1[0];
    var score1=ts1[1];
    var ts2=t[1].split(":");
    var type2=ts2[0];
    var score2=ts2[1];
    var squad=cells[1];
    var tt=squad.split("VS");
    var team1=mk2split(tt[0]);
    var team2=mk2split(tt[1]);
    var t1="",s1="",t2="",s2="";
    if (tt[0]==SEARCHINGSQUAD) { 
	var sc=score2,ts=type2,tteam=team1;
	team1=team2; team2=tteam; score2=score1; type2=type1; score1=sc; type1=ts; 
    }
    for (var j=0; j<team1.length-1; j++) {
	s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	t1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"<br>";
    }
    for (var j=0; j<team2.length-1; j++) {
	s2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	t2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"<br>";
    }
    TEAMS[2].parseJuggler(s1,false);
    if (LANG!="en") {
	t1=TEAMS[2].toJuggler(true).replace(/\n/g,"<br>");
    }
    TEAMS[1].parseJuggler(s2,false);
    if (LANG!="en") {
	t2=TEAMS[1].toJuggler(true).replace(/\n/g,"<br>");
    }
    score1=""+score1;
    score2=""+score2;
    for (var i=0; i<3; i++) {
	if (score1.length<3) score1="0"+score1;
	if (score2.length<3) score2="0"+score2;
    }
    if (type2=="Player") score2="<b>"+score2+"</b>";
    if (type1=="Player") score1="<b>"+score1+"</b>";
    var xx=cells[2].split("?");
    var arg=LZString.decompressFromEncodedURIComponent(decodeURI(xx[1]));
    var args=[];
    args= arg.split('&');
    //HEADER="";
    //SCENARIOTITLE="";
    if (args[6].split(-1)!="W")  {
	arg="";
	// A MODIFIER 
	//args[6]+="_-W";
	for (var i=0; i<args.length; i++) 
	    arg+=((i>0)?"&":"")+args[i];
	xx[0]=WEBSITE;
	src=xx[0]+"?"+LZString.compressToEncodedURIComponent(arg);
    } else src=cells[2];
    //SQUADBATTLE.row.add([score2+"-"+score1,"<span onclick='$(\".replay\").attr(\"src\",\""+src+"\")'>"+t1+cells[3]+"</span>"]).draw(false);
    $("#squadbattlediv").html(Mustache.render(TEMPLATES["combat-display"],{s1:t1,s2:t2,score:score2+" - "+score1}));
    $("#replay").attr("src",src);
    return "";
}

var computeurl=function(error, options,response) {
    //console.log(error,options,response);
    var scoreh=0;
    var scorec=0;
    var n=0;
    var histogram=[];
    if (typeof response.rows!="undefined") {
    	for (var i=1; i<response.rows.length; i++) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    var team1=mk2split(tt[0]);
	    var team2=mk2split(tt[1]);
	    var s1="",s2="";

	    for (var j=0; j<team1.length-1; j++) {
		s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    }
	    try {
		TEAMS[1].parseJuggler(s1,false);
	    for (var j=0; j<team2.length-1; j++) 
	    	s2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    TEAMS[2].parseJuggler(s2,false);
	    } catch (e) {
	    }
	    for (var j in generics) {
		if (typeof histogram[generics[j].pilotid]=="undefined") 
		    histogram[generics[j].pilotid]=0;
		histogram[generics[j].pilotid]++;
	    }
	}
    }
    for (var i in histogram) {
	console.log(PILOTS[i].name+":"+histogram[i]);
    }
}

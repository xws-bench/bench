var cmd=[];
var startreplayall=function() {
    if (REPLAY.length==0) return;
    try {
	FAST= (REPLAY.substr(-1)!="W")&&(window.self == window.top);
	if (window.self != window.top) console.log("REPLAY in FRAME: "+FAST);
    } catch(e) { FAST=false; }
    ANIM=REPLAY;
    var arg=LZString.decompressFromEncodedURIComponent(decodeURI(window.location.search.substr(1)));
    var args=arg.split("&");
    cmd=args[6].split("_");
    cmd.splice(0,1);
    if (cmd.length==0) return;
    $(".nextphase").prop("disabled",true);
    $(".unit").css("cursor","pointer");
    actionrlock=$.Deferred();
    actionrlock.progress(replayall);
    //for (var j in squadron) console.log("squadron["+j+"]:"+squadron[j].name+" "+squadron[j].id);
    if (TEAMS[1].isia==true) TEAMS[1].setia();
    if (TEAMS[2].isia==true) TEAMS[2].setia();
    //endsetupphase();
    subphase=ACTIVATION_PHASE;
    for (var i in squadron) {
	squadron[i].hasmoved=false; 
	squadron[i].maneuver=-1;
	squadron[i].hasdecloaked=false;
    }
    replayall();
}
var stopreplay=function() {
    actionrlock=$.Deferred();
}
var restartreplay=function() {
    ga('send','event', {
	eventCategory: 'interaction',
	eventAction: 'replay',
	eventLabel: 'replay'
    });
    actionrlock=$.Deferred();
    actionrlock.progress(replayall);
    replayall();
}
var replayall=function() {
    //log("replay all "+cmd+" "+phase+" "+round);
    if (cmd=="") {
	FAST=false;
	filltabskill();
	//log("setting phase"+phase);
	if (phase!=SETUP_PHASE){
            setphase();
        }
	else {
	    $(".imagebg").hide();
	    $(".nextphase").prop("disabled",false);
	    for (var i=0; i<OBSTACLES.length; i++) OBSTACLES[i].addDrag();
	    if (TEAMS[1].isia==true) TEAMS[1].setplayer();
	    if (TEAMS[2].isia==true) TEAMS[2].setplayer();
	    displayplayertype(1);
	    displayplayertype(2);
	}
	INREPLAY=false;
	return;
    }

    INREPLAY=true;
    var c=cmd[0].split("-");
    console.log(cmd[0]);

    cmd.splice(0,1);
    var u=null;
    var j;
    //endsetupphase();
    if (c[0].length>0) {
	var id=parseInt(c[0],10);
	for (j in squadron){
            if (squadron[j].id==id) break;
        } 
	if (squadron[j].id==id){
            u=squadron[j];
        }
	else {
	    console.log("cannot find id "+id);
	    //for (j in squadron) console.log("squadron["+j+"]="+squadron[j].name);
	    actionrlock.notify();
	    return;
	}
    } 
    //if (u!=null) log("cmd : "+u.name+" "+c[1]);
    var FTABLE={"fo":"removefocustoken",
		"FO":"addfocustoken",
		"e":"removeevadetoken",
		"E":"addevadetoken",
		"ct":"removecloaktoken",
		"CT":"addcloaktoken",
		"i":"removeiontoken",
		"I":"addiontoken",
		"tb":"removetractorbeamtoken",
		"TB":"addtractorbeamtoken",
		"ST":"addstress",
		"DPY":"deploy",
		"st":"removestresstoken",
		"d":"dies",
                "wd":"removeweapondisabledtoken",
                "WD":"addweapondisabledtoken"
	   };
    if (typeof FTABLE[c[1]]=="string") {
	var f=Unit.prototype[FTABLE[c[1]]];
	//if (typeof f=="undefined") console.log("ftable "+c[1]+" "+FTABLE[c[1]]);
	if (typeof f.vanilla=="function") { f.vanilla.call(u,t); }
	else {  f.call(u);}
	actionrlock.notify();
	return;
    }
    switch(c[1]) {
    case "W":/* do nothing */ break;
    case "P": 
	var p=phase;
	var r=parseInt(c[2],10);
	phase=parseInt(c[3],10);
	if (round!=r) {
	    $("#turnselector").append("<option value='"+round+"'>"+UI_translation["turn #"]+round+"</option>");
	    round=r;
	    for (var i in squadron) {
		var u=squadron[i];
		u.focus=Unit.prototype.resetfocus.call(u);
		u.evade=Unit.prototype.resetevade.call(u);
		u.tractorbeam=Unit.prototype.resettractorbeam.call(u);
		u.showinfo();
	    }
	}
	if (phase==SETUP_PHASE+1&&r==1) endsetupphase();
	$("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
	actionrlock.notify();
	break;
    case "L":	
	if (!FAST) {
	    var i=(decodeURIComponent(c[2].substring(2,c[2].length-2)));
	    u.setinfo(i).delay(1500).fadeOut(400);
	    setTimeout(function() { actionrlock.notify();},2000);
	} else actionrlock.notify();
	break;
    case "t": 
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target "+c[2]);
	    actionrlock.notify();
	    break;
	}
	var t=squadron[j];
	if (typeof Unit.prototype.removetarget.vanilla=="function") 
	    Unit.prototype.removetarget.vanilla.call(u,t);
	else Unit.prototype.removetarget.call(u,t);
	actionrlock.notify();
	break;
    case "T":
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target "+c[2]);
	    actionrlock.notify();
	    break;
	}
	var t=squadron[j];
	if (typeof Unit.prototype.addtarget.vanilla=="function") 
	    Unit.prototype.addtarget.vanilla.call(u,t);
	else Unit.prototype.addtarget.call(u,t);
	actionrlock.notify();
	break;
    case "R": u.setarcrotate(parseInt(c[2],10)); 
	actionrlock.notify();
	break;
    case "s": Unit.prototype.removeshield.call(u,parseInt(c[2],10)); 
	u.show();
	actionrlock.notify();
	break;
    case "S": Unit.prototype.addshield.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "h": Unit.prototype.removehull.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "H": Unit.prototype.addhull.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "f": 		   
	u.select();
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target unit "+c[2]);
	    actionrlock.notify();
	} else {
	    targetunit=squadron[j];
	    u.activeweapon=parseInt(c[3],10);
	    if (!FAST) u.playfiresnd();
	    //u.log("fires on "+targetunit.name+" with "+u.weapons[u.activeweapon].name);
	    setTimeout(function() { actionrlock.notify(); }, (FAST?0:1000));
	}
	break;
    case "am": 
	u.select();
	u.m=(new Snap.Matrix()).translate(c[2]-300,c[3]-300).rotate(c[4],0,0);
	u.g.transform(u.m);
	u.geffect.transform(u.m);
	actionrlock.notify();
	break;
    case "c":
	(new Critical(u,parseInt(c[2],10))).faceup();
	actionrlock.notify();
	break;
    case "D":
	u.upgrades[parseInt(c[2],10)].desactivate();
	actionrlock.notify();
	break;
    case "m":
	u.select();
	var d=c[2];
	var l=parseInt(c[4],10);
	var oldm=u.m;
	var path=P[d].path;
	if (FAST) {
	    u.m=u.getmatrixwithmove(oldm,path,l);
	    u.m.rotate(parseFloat(c[3],0,0),0,0);
	    u.g.transform(u.m);
	    u.geffect.transform(u.m);
	    actionrlock.notify();
	    break;
	}
	SOUNDS[u.ship.flysnd].play();
	Snap.animate(0,l,function(value) {
	    var m=this.getmatrixwithmove(oldm,path,value);
	    this.g.transform(m);
	    this.geffect.transform(m);
	}.bind(u), TIMEANIM*l/200,mina.linear, function() {
	    this.m=this.getmatrixwithmove(oldm,path,l);
	    this.m.rotate(parseFloat(c[3]),0,0);
	    this.g.transform(this.m);
	    this.geffect.transform(this.m);
	    actionrlock.notify();
	}.bind(u));
	break;
    default: 
	console.log("unknown cmd:"+c[1]);
	FAST=false;
	filltabskill();
	setphase((phase==SETUP_PHASE));
    }
}

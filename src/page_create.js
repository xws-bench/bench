var Unit = window.Unit || {};
var PILOTS = window.PILOTS || {};
var UPGRADES = window.UPGRADES || {};
var Mustache = window.Mustache || {};
function displayfactionunits(noreset) {
    var count=0;
    var n=0;
    var i,j,k;
    var faction=TEAMS[3].faction;
    var p={};
    var t={};
    var uu=[];
    currentteam=TEAMS[3];
    //if (phase!=CREATION_PHASE) return;

    if (faction=="REBEL") {
	$(".dialfilter td[move=SL3]").text(P["TRL3"].key).attr("move","TRL3"); 
	$(".dialfilter td[move=SL2]").text(P["TRL2"].key).attr("move","TRL2"); 
    } else  {
	$(".dialfilter td[move=TRL3]").text(P["SL3"].key).attr("move","SL3");
	$(".dialfilter td[move=TRL2]").text(P["SL2"].key).attr("move","SL2");
    }
    for (i in unitlist) if (unitlist[i].faction.indexOf(faction)>-1) count++;

    //var tz = Math.round( ( 186 / 2 ) / Math.tan( Math.PI / count ) );
    if (noreset==true) $("#caroussel").html(""); else $(".caroussel").html("");
    //increment = 360. / count;
    var str;
    for (i=0; i<PILOTS.length; i++) {
	var u=PILOTS[i].unit;
	var rating="";
	var name=PILOTS[i].name;
	if (PILOTS[i].faction==faction) {
	    if (typeof p[u]=="undefined") p[u]=[];
	    /* should go elsewhere */
	    if (PILOTS[i].upgrades.indexOf(Unit.ELITE)>-1) PILOTS[i].haselite=true;
	    var text=getpilottexttranslation(PILOTS[i],faction);
	    if (text!="")
		text+=(PILOTS[i].done==true?"":"<div><strong class='m-notimplemented'></strong></div>");
	    if (PILOTS[i].faction==Unit.SCUM) name+="(SCUM)";
	    if (typeof PILOTS[i].edition!="undefined") name+=" ("+PILOTS[i].edition+")";
	    if (typeof RATINGS_pilots[name]!="undefined") {
		text=text+"<hr/><p class='strategy'>"+RATINGS_pilots[name].text+"</p>";
		rating=repeat("ÿ",RATINGS_pilots[name].rating);
	    }
	    PILOTS[i].tooltip=text;
	    PILOTS[i].rating=rating;
	    PILOTS[i].trname=translate(PILOTS[i].name);
	    p[u].push(PILOTS[i]);
	    //PILOTS[i].pilotid=i;
	}
    }
    for (u in p) p[u].sort(function(a,b) { return a.points - b.points; });
    for (i in unitlist) 
	if (unitlist[i].faction.indexOf(faction)>-1) { 
	    unitlist[i].trname=SHIP_translation[i]; 
	    unitlist[i].name=i;
	    if (typeof unitlist[i].trname=="undefined") unitlist[i].trname=i;
	    uu.push(unitlist[i]);
	}
    uu.sort(function(a,b) { return a.trname > b.trname; });
    for (i=0; i<uu.length; i++) {
	str="";
	n++;
	var u=uu[i];
	var q=p[u.name];
	var filter=p[u.name][0].upgrades;
	var filtered=true;
	if (WAVEFILTER!="0") {
	    var qq=[];
	    for (k in q) {
		var v=q[k];
		if (typeof v.wave!="undefined") {
		    if (v.wave.indexOf(WAVEFILTER)>-1)		    
			qq.push(v);
		} else if (u.wave==WAVEFILTER)	qq.push(v);
	    }
	    if (qq.length==0) filtered=false;
	    q=qq;
	}
	for (j in UNITFILTER)
	    if (filter.indexOf(j)==-1) filtered=false;
	for (j in ACTIONFILTER) 
	    if (u.actionList.indexOf(j)==-1) filtered=false;
	if (COSTFILTER>0) {
	    var qq=[];
	    for (k in q) {
		var v=q[k];
		if (v.points<=COSTFILTER) qq.push(v);
	    }
	    if (qq.length==0) filtered=false;
	    q=qq;
	}
	if (TEXTFILTER!=""&&filtered==true) {
	    var qq=[];
	    for (k in q) {
		var v=q[k];
		//console.log("v:"+v.unitfaction);
		//console.log("unit faction "+v.name+" "+v.unitfaction);
		var ttext=getpilottexttranslation(v,faction);
		var tname=translate(v.name);
		var r=new RegExp(TEXTFILTER,'i');
		if (ttext.match(r)||tname.match(r)) qq.push(v);
	    }
	    if (qq.length==0) filtered=false;
	    q=qq;
	}
	for (j in MOVEFILTER) {
	    var found=false;
	    for (k=0; k<u.dial.length; k++)
		if (u.dial[k].move==j) found=true;
	    if (!found) filtered=false;
	}
	if (filtered) {
	    var rating = [];
	    /*var fname=u.name;
	    if (faction=="SCUM") fname=fname+" (SCUM)";
	    if (typeof RATINGS_ships[fname]!="undefined") rating=[RATINGS_ships[fname]];*/
	    var rendered=Mustache.render(TEMPLATES["faction"], {
		shipimg:u.img[0],
		fire:repeat('u',u.fire),
		evade:repeat('u',u.evade),
		hull:repeat('u',u.hull),
		shield:repeat('u',u.shield),
		diallist:dial2JSON(u.dial),
		shipname:u.trname,
		primary:u.weapon_type,
		faction:faction,
		//rating:rating,
		actionlist:function() {
		    var al=[];
		    for (j=0; j<u.actionList.length; j++) al[j]=A[u.actionList[j]].key;
		    return al;
		},
		hastitle:u.hastitle,
		shipupgrades:p[u.name][0].upgrades,
		pilots:q
	    });
	    $("#caroussel").append("<li>"+rendered+"</li>");	    
	}
    }
}
function addunique(name) {
    var i;
    UNIQUE[name]=true;
    for (i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) {
	    $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",true);
	}
    }
    for (i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",true);
    }
}
function removeunique(name) {
    UNIQUE[name]=false;
    for (var i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",false);
    }
    for (var i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",false);
    }
}
function addlimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",true);
}
function removelimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",false);
}
function addupgradeaddhandler(u) {
    $("#unit"+u.id+" button.upgrades").click(function(e) {
	var org=e.currentTarget.getAttribute("class").split(" ")[1];
	var num=e.currentTarget./*parentElement.*/getAttribute("num");
	var p=this.getupgradelist(org);
	$("#unit"+this.id+" .upgs .upgavail").hide();
	$("#unit"+this.id+" .upgs .upg").hide();
	//$("#unit"+this.id+" .upglist").append("<tr><td></td><td colspan='3'><input class='textfilter' type='search'></td></tr>");

	if (typeof this.upgbonus[org]=="undefined") this.upgbonus[org]=0;

	var q=[];
	for (var i=0; i<p.length; i++) {
	    var upg=UPGRADES[p[i]];
	    var disabled;
	    var attacks=[];
	    if (upg.invisible) continue;
	    disabled=(UNIQUE[upg.name]==true)
		||((upg.limited==true||this.exclupg[upg.type]==true)&&$("#unit"+this.id+" .upg tr[data="+p[i]+"]").length>0);
	    var pts=upg.points+this.upgbonus[org];
	    if (upg.points>0&&pts<0) pts=0;
	    var text=formatstring(getupgtxttranslation(upg.name,upg.type));
	    if (upg.done!=true) text+="<div><strong class='m-notimplemented'></strong></div>";
	    if (typeof upg.attack!="undefined") attacks=[{attack:upg.attack,lrange:upg.range[0],hrange:upg.range[1]}];
	    //log(pts+" "+text+" disabled"+disabled+" num"+num+" data"+p[i]+" name"+translate(upg.name)+" attacks"+attacks[0].attack);
	    var rating=0;
	    var comment="";
	    var v=upg.name+(upg.type==CREW?"(Crew)":"");
	    if (typeof RATINGS_upgrades[v]!="undefined"
		&&typeof RATINGS_upgrades[v].rating!="undefined") {
		rating=RATINGS_upgrades[v].rating;
		comment=RATINGS_upgrades[v].text;
	    } else console.log("no rating for "+upg.name);
	    q.push({
		pts:pts,
		rating:repeat('ÿ',rating),
		tooltip:[text+"<hr/><p class='strategy'>"+comment+"</p>"],
		text:text,
		isdisabled:disabled,
		num:num,
		data:p[i],
		name:translate(upg.name).replace(/\(Crew\)/g,""),
		attacks:attacks
	    });
	}
	$("#unit"+this.id+" .upglist").html(Mustache.render(TEMPLATES["upglist-creation"],{upglist:q}));

	$("#unit"+this.id+" .upglist button").click(function(e) {
	    var data=e.currentTarget.getAttribute("data");
	    var num=e.currentTarget.getAttribute("num");
	    $("#unit"+this.id+" .upgs .upgavail").show();
	    $("#unit"+this.id+" .upgs .upg").show();
	    addupgrade(this,data,num);
	}.bind(this));
    }.bind(u));
}
function addunit(n,faction,u) {
    if (typeof u=="undefined") {
	u=new Unit(currentteam.team,n);
	u.faction=faction;
	for (var i in metaUnit.prototype) u[i]=metaUnit.prototype[i];
	for (var j in PILOTS[u.pilotid]) {
	    var p=PILOTS[u.pilotid];
	    if (typeof p[j]=="function") u[j]=p[j];
	}
    }
    if (typeof u.init!="undefined") {
	u.init();
    }
    if (currentteam.team==3) { 
	$("#listunits").append("<li id='unit"+u.id+"'></li>");
	u.show();
	$("li#unit"+u.id).hover(function() { $(".highlighted").removeClass("highlighted"); 
					     $(this).addClass("highlighted"); },
				function() { });
	if (u.unique==true) addunique(u.name);
	$("#unit"+u.id+" .close").click(function() {
	    var data=$(this).attr("data");
	    var u=generics["u"+data];
	    $("#unit"+data+" .upg tr[data]").each(function() {
		var d=$(this).attr("data");
		if (UPGRADES[d].unique==true) removeunique(UPGRADES[d].name);
	    });
	    if (PILOTS[u.pilotid].unique==true) removeunique(u.name);
	    $("#unit"+data).remove();
	    delete generics["u"+data];
	    currentteam.updatepoints();
	});
	$("#unit"+u.id+" .duplicate").click(function() {
	    var data=$(this).attr("data");
	    var u=generics["u"+data];
	    var self=addunit(u.pilotid,faction);
	    $("#unit"+data+" .upg tr[data]").each(function() {
		var d=$(this).attr("data");
		var num=$(this).attr("num");
		if (UPGRADES[d].unique!=true&&u.upgnocopy!=d) addupgrade(self,d,num);
	    });
	});
	$("#unit"+u.id+" .dialopen").click(function() {
	    var data=$(this).attr("data");
	    $("#unit"+data+" .upg").hide();
	    $("#unit"+data+" .upglist").hide();
	    $("#unit"+data+" .upgavail").hide();
	    $("#unit"+data+" .statlist").hide();
	    $("#unit"+data+" .shipdial").show();
	    $("#unit"+data+" .movelist").hide();

	    var u=generics["u"+data];
	});
	$("#unit"+u.id+" .upgradelists").click(function() {
	    var data=$(this).attr("data");
	    $("#unit"+data+" .upg").show();
	    $("#unit"+data+" .upglist").empty();
	    $("#unit"+data+" .upglist").show();
	    $("#unit"+data+" .upgavail").show();
	    $("#unit"+data+" .statlist").hide();
	    $("#unit"+data+" .shipdial").hide();
	    $("#unit"+data+" .movelist").hide();
	    var u=generics["u"+data];
	});
	
	$("#unit"+u.id+" .moves").click(function() {
	    var data=$(this).attr("data");
	    var u=generics["u"+data];
	    $("#unit"+data+" .upg").hide();
	    $("#unit"+data+" .upglist").hide();
	    $("#unit"+data+" .upgavail").hide();
	    $("#unit"+data+" .statlist").hide();
	    $("#unit"+data+" .shipdial").hide();
	    $("#unit"+data+" .movelist").show();
	    
	    var s= Snap("#unit"+data+" .movesvg");
	    var sl = $("#unit"+data+" .statbutton");
	    s.clear();
	    var w=$(".movesvg").width();
	    targetunit=new Unit(0,13);
	    for (var i in metaUnit.prototype) targetunit[i]=metaUnit.prototype[i];
	    u.moves = [ MT(w/2,w/2)];
	    u.doactivation();
	    u.s=s;
	    setTimeout(function() {
		for (i in u.moves) {
		    var p=s.path(u.getOutlineString(u.moves[i]).s).attr({"stroke-width":5,stroke:"#0a0",opacity:0.5,fill:"rgba(0,0,0,0)",pointerEvents:"none"});
		}		
		s.path(u.getOutlineString(MT(w/2,w/2)).s).attr({"stroke-width":5,stroke:"#a00",opacity:1,fill:"rgba(0,0,0,0)",pointerEvents:"none"});
	    });
	});

	$("#unit"+u.id+" .statistics").click(function() {
	    var data=$(this).attr("data");
	    var u=generics["u"+data];
	    $("#unit"+data+" .upg").hide();
	    $("#unit"+data+" .upglist").hide();
	    $("#unit"+data+" .upgavail").hide();
	    $("#unit"+data+" .statlist").show();
	    $("#unit"+data+" .shipdial").hide();
	    $("#unit"+data+" .movelist").hide();
	    
	    var s= Snap("#unit"+data+" .statisticsvg");
	    var sl = $("#unit"+data+" .statbutton");
	    s.clear();
	    var w=$(".statisticsvg").width();
	    targetunit=new Unit(0,13);
	    for (var i in metaUnit.prototype) targetunit[i]=metaUnit.prototype[i];
	    u.moves = [ MT(w/2,w/2)];
	    u.doactivation();
	    u.s=s;
	    var t=s.text(0,0,"Computing...").attr({"font-size":50,stroke:WHITE});
	    setTimeout(function() {
		u.showattack(u.weapons,s);
		t.attr({display:"none"});
		s.path(u.getOutlineString(MT(w/2,w/2)).s).attr({"stroke-width":5,stroke:"#0a0",opacity:0.5,fill:"rgba(0,0,0,0)",pointerEvents:"none"});
		for (i=1; i<=5; i++) 
		    s.path(u.getRangeString(i,MT(w/2,w/2))).attr({"stroke-width":5,stroke:"#0a0",opacity:0.5,fill:"rgba(0,0,0,0)",pointerEvents:"none","stroke-dasharray":"5,5"});
		var g=s.gradient("l(0,0,0,1)hsl(0,80,50)-hsl(60,100,50)-hsl(120,100,25)");
		s.rect(-400,-500,30,800).attr({fill:g});
		s.text(-350,-450,"100%").attr({"font-size":50,stroke:WHITE});
		s.text(-350,-75,"50%").attr({"font-size":50,stroke:WHITE});
		s.text(-350,300,"0%").attr({"font-size":50,stroke:WHITE});
	    },30);
	});
	currentteam.updatepoints();
	addupgradeaddhandler(u);
    } else currentteam.updatepoints();
    return u;
}
function addupgrade(self,data,num,noremove) {
    var org=UPGRADES[data];
    $("#unit"+self.id+" .upglist").empty();
    if (typeof org=="undefined") return;
    //log("upgrade identified");
    if (org.unique==true) addunique(org.name);
    if (org.limited==true) addlimited(self,data);
    $("#unit"+self.id+" .upgavail span[num="+num+"]").hide();
    var text=translate(org.name).replace(/\(Crew\)/g,"").replace(/\'/g,"");
    if (typeof self.upgbonus[org.type]=="undefined") self.upgbonus[org.type]=0;
    var pts=org.points+self.upgbonus[org.type];
    if (org.points>=0&&pts<0) pts=0;
    var tt="";

    var tttext=formatstring(getupgtxttranslation(org.name,org.type));
    if (tttext!="") tt=tttext+(org.done==true?"":"<div><strong class='m-notimplemented'></strong></div>");
    $("#unit"+self.id+" .upg").append("<tr data="+data+" num="+num+"><td><span class='upgrades "+org.type+"'></span></td><td><button>"+text+"</button></td><td class='pts'>"+pts+"</td><td class='tooltip'>"+tt+"</td></tr>");
    self.upg[num]=data;
    var uu=Upgradefromid(self,data);
    if (typeof UPGRADES[data].install!="undefined") uu.install(self);
    Upgrade.prototype.install.call(uu,self);
    if (typeof uu.init!="undefined") uu.init(self);
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();
    if (typeof noremove=="undefined") { 
	$("#unit"+self.id+" .upg tr[num="+num+"] button").click(function(e) {
	    var num=e.currentTarget.parentElement.parentElement.getAttribute("num");
	    var data=e.currentTarget.parentElement.parentElement.getAttribute("data");
	    $("#unit"+self.id+" .upglist").empty();
	    removeupgrade(self,num,data);
	}.bind(self));
    } else self.upgnocopy=data;

}
function removeupgrade(self,num,data) {
    var i;
    for (i in self.upgrades) 
	if (self.upgrades[i].id==data) break;
    var org=self.upgrades[i];;
    // Removing an upgrade giving an extra upgrade
    if (typeof self["addedupg"+data]!="undefined") {
	var c=self["addedupg"+data];
	if (self.upg[c]>-1) removeupgrade(self,c,self.upg[c]);
    }
    $("#unit"+self.id+" .upgavail span[num="+num+"]").show();
    $("#unit"+self.id+" .upg tr[num="+num+"]").remove();
    if (org.unique==true) removeunique(org.name);
    if (org.limited==true) removelimited(self,data);
    self.upg[num]=-1;
    if (typeof org.uninstall!="undefined") {
	org.uninstall(self);
    }
    Upgrade.prototype.uninstall.call(org,self);
    org.isactive=false;
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();
}

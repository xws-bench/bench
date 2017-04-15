var a1 = [];
a1[0]=2/8; // blank
a1[1]=3/8; // hit
a1[10]=1/8; // crit
a1[100]=2/8; // focus
var d1 = [];
d1[0]=3/8; // blank
d1[1]=3/8; // evade
d1[10]=2/8; // focus

// Add one dice to already existing roll of n dices
function addattackdice(n,proba) {
    var f,c,h,i;
    var p=[];
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++)
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
		p[i+1]=0;
		p[i+10]=0;
		p[i+100]=0;
	    }
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++) 
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]+=proba[i]*a1[0];
		p[i+1]+=proba[i]*a1[1];
		p[i+10]+=proba[i]*a1[10];
		p[i+100]+=proba[i]*a1[100];
	    }
    return p;
}
function adddefensedice(n,proba) {
    var f,e,i;
    var p=[];
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]=0;
	    p[i+1]=0;
	    p[i+10]=0;	   
	}
    }
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]+=proba[i]*d1[0];
	    p[i+1]+=proba[i]*d1[1];
	    p[i+10]+=proba[i]*d1[10];
	}
    }
    return p;
}

function attackproba(n) {
    var i;
    var proba=[];
    proba[0]=a1[0];
    proba[1]=a1[1];
    proba[10]=a1[10];
    proba[100]=a1[100];
    for (i=2; i<=n; i++) {
	proba=addattackdice(i,proba);
    }

    return proba;
}
function defenseproba(n) {
    var i;
    var proba=[];
    proba[0]=d1[0];
    proba[1]=d1[1];
    proba[10]=d1[10];
    for (i=2; i<=n; i++) {
	proba=adddefensedice(i,proba);
    }
    return proba;
}
function attackwithreroll(tokensA,at,attack) {
    var f,h,c,f2,h2,c2,i,j,b;
    var p=[];
    if (tokensA.reroll==0) return at;
    if (typeof tokensA.reroll=="undefined") return at;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++)
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
	    }
    var newf=0, r;
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++) 
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		b=attack-h-c-f; // blanks
		r=tokensA.reroll;
		newf=f;
		if (tokensA.reroll>b) { // more reroll than blanks
		    if (tokensA.focus==0) {
			if (tokensA.reroll>f+b) { // more rerolls than blanks+focus
			    r=f+b;
			    newf=0; // no more focus in results
			} else newf=f-(r-b);
		    } else r=b;
		} 
		//log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
		if (r==0) p[i]+=at[i];
		else {
		    var tot=0;
		    for (f2=0; f2<=r; f2++) 
			for (h2=0; h2<=r-f2; h2++)
			    for (c2=0; c2<=r-f2-h2; c2++) {
				j=100*f2+h2+10*c2;
				var k=100*(newf+f2)+h+h2+10*(c+c2);
				p[k]+=at[i]*ATTACK[r][j];
//				if (tokensA.reroll>0) log(attack+" at["+f+" "+h+" "+c+"]:"+at[i]+"*A["+r+"]["+f2+" "+h2+" "+c2+"]:"+ATTACK[r][j]);
			    }
		}
	    }
    return p;
}
function defendwithreroll(tokensD,dt,defense) {
    var f,e,f2,e2,i,j,b;
    var p=[];
    if (tokensD.reroll==0) return dt;
    if (typeof tokensD.reroll=="undefined") return dt;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=defense; f++) for (e=0; e<=defense-f; e++) p[10*f+e]=0;
    var newf=0, r;
    for (f=0; f<=defense; f++) 
	for (e=0; e<=defense-f; e++) {
	    i=10*f+e;
	    b=defense-e-f; // blanks
	    r=tokensD.reroll;
	    newf=f;
	    if (tokensD.reroll>b) { // more reroll than blanks
		if (tokensD.focus==0) {
		    if (tokensD.reroll>f+b) { // more rerolls than blanks+focus
			r=f+b;
			newf=0; // no more focus in results
		    } else newf=f-(r-b);
		} else r=b;
	    } 
	    //log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
	    if (r==0) p[i]+=dt[i];
	    else {
		for (f2=0; f2<=r; f2++) 
		    for (e2=0; e2<=r-f2; e2++) {
			j=10*f2+e2;
			k=10*(newf+f2)+e+e2;
			p[k]+=dt[i]*DEFENSE[r][j];
		    }
	    }
	}
    return p;
}

function tohitproba(attacker,weapon,defender,at,dt,attack,defense,double) {
    var p=[];
    var k=[];
    var f,h,c,d,fd,e,i,j,hit,evade;
    var missed=0;
    var tot=0,mean=0,meanc=0;
    var ATable=at;
    var DTable=dt;
    var max=attack;
    var rr=attacker.reroll;
    dt=(defense==0)?[]:dt;
    for (h=0; h<=attack; h++) {
	for (c=0; c<=attack-h; c++) {
	    i=h+10*c;
	    p[i]=0;
	}
    }
    if (typeof double=="undefined") double=false;
    if (typeof ATable=="undefined") return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    //log("Attack "+attack+" Defense "+defense);
    if (defense>0) DTable=defendwithreroll(defender,dt,defense);
    //for (j=0; j<=20; j++) { k[j]=0; }
    for (f=0; f<=attack; f++) {
	for (h=0; h<=attack-f; h++) {
	    for (c=0; c<=attack-h-f; c++) {
		var n=Unit.FCH_FOCUS*f+Unit.FCH_CRIT*c+Unit.FCH_HIT*h;
		var fa,ca,ha,ff,ef;
		var focusa=attacker.focus;
		var savedreroll=attacker.reroll;
		if (typeof attacker.attackrerolls!="undefined") 
		    attacker.reroll=Math.max(attacker.attackrerolls(weapon,defender),attacker.reroll);
		ATable=attackwithreroll(attacker,at,attack);

		var a=ATable[Unit.FCH_FOCUS*f+Unit.FCH_HIT*h+Unit.FCH_CRIT*c]; // attack index
		n=weapon.modifyattackroll(n,attack,defender);
		if (typeof attacker.modifyattackroll!="undefined") {
		    n=attacker.modifyattackroll(n,attack,defender);
		}
		fa=Unit.FCH_focus(n);
		ca=Unit.FCH_crit(n);
		hit=Unit.FCH_hit(n);
		if (attacker.focus>0&&fa>0) { hit+=fa;attacker.focus--; }

		for (ff=0; ff<=defense; ff++) {
		    for (ef=0; ef<=defense-ff; ef++) {
			var fd;
			var focusd=defender.focus;
			var evade=defender.evade;
			var savedevade=defender.evade;
			var savedfocus=defender.focus;
			var m=Unit.FE_FOCUS*ff+Unit.FE_EVADE*ef;
			if (defense==0) d=1; else d=DTable[m];
			if (typeof attacker.modifydefenseroll!="undefined") 
			    m=attacker.modifydefenseroll(attacker,m,defense);
			fd=Unit.FE_focus(m);
			evade=Unit.FE_evade(m);
			i=0;
			if (defender.focus>0&&fd>0&&evade<hit+ca) { evade+=fd;defender.focus--; }
			if (defender.evade>0&&evade<hit+ca) { evade+=1;defender.evade--; }
			if (typeof defender.cancelhit!="undefined") {
			    var ch=defender.cancelhit({ch:hit*Unit.FCH_HIT+ca*Unit.FCH_CRIT,e:evade},targetunit);
			    ch=defender.cancelcritical(ch,targetunit);

			    evade=ch.e;
			    i=ch.ch;
			} else {
			    if (hit>evade) { i = Unit.FCH_HIT*(hit-evade); evade=0; } 
			    else { evade=evade-hit; }
			    if (ca>evade) { i+= Unit.FCH_CRIT*(ca-evade); }
			}
			if (typeof weapon.modifyhit=="function"&&i>0) i=weapon.modifyhit(i);

			attacker.reroll=0;
			/*if (typeof attacker.postattack=="function") {
			    attacker.postattack(i);
			}*/
			if (typeof weapon.followupattack=="function"
			    &&double==false) {
			    //var w=weapon.immediateattack.weapon();
			    //var r=attacker.gethitrange(w,defender);
			    // No prerequisite checked.
			    //if (r<=3&&r>0) {
				//console.log("immediate attack:"+weapon.name+"->"+attacker.weapons[w].name+" "+attacker.reroll+" "+attacker.name)
			//	var attack2=attacker.getattackstrength(w,defender);
			//	var defense2=defender.getdefensestrength(w,attacker);
			    var thp= tohitproba(attacker,weapon,defender,at,dt,attack,defense,true); 
			    //attacker,attacker.weapons[w],defender,
			    //			    attacker.getattacktable(attack2),
			    //defender.getdefensetable(defense2),
			    //attack2,
			    //defense2);
				//console.log(attacker.name+" after call "+n+"/"+m+" ("+attack2+"/"+defense2+"/"+attacker.weapons[w].name+"):"+p[0]+" + "+thp.proba[0]+" * "+(a*d));
			    max=2*attack;
			    for (j in thp.proba) {
				var kk=i+j*1;
				if (typeof p[kk]=="undefined") p[kk]=0;
				p[kk]+=thp.proba[j]*a*d;
			    }
			    //} else p[i]+=a*d;
			    //delete attacker.iar;
			} else {
			    p[i]+=a*d;
			}
			defender.focus=savedfocus;
			defender.evade=savedevade;
		    }
		}
		attacker.focus=focusa;
		attacker.reroll=savedreroll;
	    }
	}
    }
    //console.log("missed "+missed+"/"+p[0]+" "+attacker.name+" "+weapon.iar);
    for (h=0; h<=max; h++) {
	for (c=0; c<=max-h; c++) {
	    i=Unit.FCH_HIT*h+Unit.FCH_CRIT*c;
	    if (i>0&&typeof p[i]!="undefined") tot+=p[i];
	    mean+=h*p[i];
	    meanc+=c*p[i];
	    // Max 3 criticals leading to 2 damages each...Proba too low anyway after that.
	    /*switch(c) {
	    case 0:
		for(j=1; j<=c+h; j++) k[j]+=p[i];
		break;
	    case 1:
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33;
		for(j=2; j<=c+h+1; j++) k[j]+=p[i]*7/33;
		break;
	    default: 
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33*(32-7)/32;
		for (j=2; j<=c+h+1; j++) k[j]+=p[i]*(7/33*(1-6/32)+(1-7/33)*7/32);
		for (j=3; j<=c+h+2; j++) k[j]+=p[i]*7/33*6/32;
	    }*/
	}
    }
    //log("proba "+attacker.name+" "+attacker.iar+" "+tot);
    return {proba:p, tohit:Math.floor(tot*10000)/100, meanhit:tot==0?0:Math.floor(mean * 100) / 100,
	    meancritical:tot==0?0:Math.floor(meanc*100)/100}; //,tokill:k} ;
}

var allunits=[];
var Unit = window.Unit || {};
var Upgrade = window.Upgrade || {};
var IAUnit = window.IAUnit || {};
var Snap = window.Snap || {};
var PILOTS = window.PILOTS || {};
var UPGRADES = window.UPGRADES || {};
function TeamList(jsonString){
    // do initialization stuff
    this.listJSON=null;     // JSON-based object containing all list info
    this.listJuggler=null;  // Human-readable list; read-only usually
    this.listTJuggler=null; // Translated human-readable list.
    this.listHTML=null;     // Enhanced listJuggler list with HTML hinting
    this.listTHTML=null;    // Translated, enhanced listJuggler list
    this.listShips=[];      // IDs of all ships and upgrades for this list.
    this.listFaction="";    // should be one of Unit.REBEL, Unit.EMPIRE, Unit.SCUM
    this.pointCost=0;       // pointCost as computed from listShips
    this.subLists=[];       // [WIP] possible composition system for Epic squads
    this.dirty=false;       // Marks whether non-JSON info needs refreshing
    
    // Parse and validate jsonString if passed in
    if(typeof jsonString!=="undefined"){
        TeamList.prototype.inputJSON.call(this,jsonString); // parse JSON and update info
    }   
};
// Define members and methods of the TeamList prototype
TeamList.prototype={
    // Calculate cost of list, assuming "this" has at least a JSON-backed object already
    updateCost: function(){
        // look up every card and add their costs, accounting for upgrades that decrease cost
        for(var i in this.listShips){
            var pilot=this.listShips[i];
            // Record cost
            this.pointCost+=PILOTS[pilot.pilotID].points;
            if (typeof pilot.upgrades!==[])  {
                // Need to apply all valid upgrades, but also need to install upgrades first
                var impUpgList=[];
                var upgInfo;
                var index;
                var realUpg;
                var vaksai=false;
                var tiex1=false;
                // Iterate over imported pilot's upgrades and get their info from
                // UPGRADES if possible.
                for (var j in pilot.upgrades){
                    index=pilot.upgrades[j];
                    upgInfo={
                        "name":UPGRADES[index].name, 
                        "type":UPGRADES[index].type, 
                        "index":index, 
                        "hasUpgrades":false, 
                        "entry":null
                    };
                    realUpg=UPGRADES[upgInfo.index];
                    upgInfo.hasUpgrades=(
                        (typeof realUpg.upgrades!=="undefined")||
                        (typeof realUpg.pointsupg!=="undefined")
                    );
                    upgInfo.entry=realUpg;
                    impUpgList.push(upgInfo);
                }
                for(var k in impUpgList){
                    if(impUpgList[k].entry.name==="TIE/x1"){tiex1=true;}
                    else if (impUpgList[k].entry.name==="Vaksai"){vaksai=true;}
                }
                for(k in impUpgList){ // Actually calculate cost
                    var cost;
                    var upg=impUpgList[k];
                    cost=upg.entry.points;
                    if(tiex1&&upg.entry.type===Unit.SYSTEM){
                        cost=(cost-4<0)?0:cost-4;
                    }
                    if(vaksai){
                        cost=(cost-1<0)?0:cost-1;
                    }
                    this.pointCost+=cost;
                }
            }
        }
    },
    getCost: function(){
        // Accessor to return current list cost.
        if(this.dirty){
            this.updateCost();
        }
        return this.pointCost;
    },
    outputJSON: function(){
        return JSON.stringify(this.listJSON);
    },
    inputJSON: function(jsonString){
        // The real work happens here.
        // WIP
        var f={"rebel":Unit.REBEL,"scum":Unit.SCUM,"imperial":Unit.EMPIRE};
        this.listJSON=JSON.parse(jsonString);
        this.listFaction=f[this.listJSON.faction];
        this.populateShips(); // Grab all ship and upgrade indices for updateCost, outputX, etc.
        this.updateCost(); // Probably does too much; let's split this into "populateShips" and "updateCost".
        this.dirty=true; // Let all output functions know to update
    },
    populateShips: function(){ // fill in list of SimpleUnits from JSON data
        // look up every card
        var s=this.listJSON;
	var i,j,k;
	for (i=0; i<s.pilots.length; i++) {
	    var pilot=s.pilots[i];
	    var p;
	    var pid=-1;
            var simplePilot=new SimpleUnit();
	    
            var j=PILOTSNAMEINDEX.indexOf(PILOT_dict[pilot.name]); // INDEX lookup is much faster than iterating over PILOTS
            var possiblePilots=[];
            while(j!==-1){  // Fix for Fenn Rau, possibly others
                possiblePilots.push(j);
                j=PILOTSNAMEINDEX.indexOf(PILOT_dict[pilot.name],j+1);
            }
            for(var p in possiblePilots){
                j=possiblePilots[p];
                if (j!==-1 && PILOTS[j].faction==this.listFaction&&
                       PILOTS[j].unit==PILOT_dict[pilot.ship]) { 
                        pid=j;
                        break;
                }
            }
            if(pid===-1){ 
                throw("pid undefined:"+PILOT_dict[pilot.name]+"-"+pilot.name+"/"+this.listFaction+"/"+PILOT_dict[pilot.ship]); 
            }
            // Record PID
            simplePilot.pilotID=pid;
	    
            if (typeof pilot.upgrades!="undefined")  {
                // Need to apply all valid upgrades, but also need to install upgrades first
                var upgType;
                var upgIndex;
                // Iterate over imported pilot's upgrades and get their info from
                // UPGRADES if possible.
                for (var j in pilot.upgrades){
                    var upgType=pilot.upgrades[j];
                    for (var k=0, len=upgType.length; k<len; k++){
                        upgIndex=UPGRADESNAMEINDEX.indexOf(UPGRADE_dict[upgType[k]]); // ~2 faster than iterating over UPGRADES
                        if(upgIndex===-1){
                            console.log(`[teamlist.js][populateShips] Could not find upgrade ${upgType[k]}`);
                            break;
                        }
                        else{
                            // Store upgrade ID
                            simplePilot.upgrades.push(upgIndex);
                        }
                    }
                }
	    }
            // Add this ship to the list of simpleUnits.
            this.addShip(simplePilot);
	}
    },
    outputJuggler: function(translated,improved){
        /* Output current list state as List Juggler formats
         There are four possible output states, and I want to cache them all:
            1) "plain" Juggler format (not translated, no HTML formatting)
            2) Translated Juggler format (tranlated pilot & upgrades, no HTML)
            3) HTML-formatted Juggler (not translated, HTML formatting for icons etc.)
            4) Translated HTML-formatted (translated pilot & Upgrades with HTML for icons, etc.)
        */

        // Shortcuts
        if(this.listJSON===null) return "";
        else if(!this.dirty){ // No changes since last call to outputJuggler, so use cache
            if(translated && improved){
                return this.listTHTML;
            }
            else if(translated){
                return this.listTJuggler;
            }
            else if(improved){
                return this.listHTML;
            }
            else{
                return this.listJuggler;
            }
        }
        
        // Start strings with faction name (no translation at this point)
        var s=`${this.listFaction.replace(/\B[A-Z]/g,l => l.toLowerCase())}`;
        var st=`${translate(s)}`;
        var si=`<span class='${this.listFaction==Unit.REBEL?"HALFRED":(this.listFaction==Unit.EMPIRE?"HALFGREEN":"HALFYELLOW")}'>${s}</span>`;
        var sti=`<span class='${this.listFaction==Unit.REBEL?"HALFRED":(this.listFaction==Unit.EMPIRE?"HALFGREEN":"HALFYELLOW")}'>${st}</span>`; // NO JOKES!!!
        
        // Should never be [] once JSON has been imported
        if(this.listShips!==[]){
            var ships=this.listShips;
            for(var i in ships){
                var ship=ships[i];
                var pName=PILOTS[ship.pilotID].name;
                var uName=PILOTS[ship.pilotID].unit;
                // Set pilot name, edition (if necessary [Poe!]), and unit name
                if(PILOTS[ship.pilotID].ambiguous){
                    s+=`\n${pName} (${PILOTS[ship.pilotID].edition}) (${uName})`;
                    st+=`\n${translate(pName)} (${PILOTS[ship.pilotID].edition}) (${translate(uName)})`;
                    si+=`\n<span class='ship'>${unitlist[uName].code}</span> <span class='${this.listFaction==Unit.REBEL?"HALFRED":(this.listFaction==Unit.EMPIRE?"HALFGREEN":"HALFYELLOW")}'>${pName} (${PILOTS[ship.pilotID].edition}) (${uName})</span>`;
                    sti+=`\n<span class='ship'>${unitlist[uName].code}</span> <span class='${this.listFaction==Unit.REBEL?"HALFRED":(this.listFaction==Unit.EMPIRE?"HALFGREEN":"HALFYELLOW")}'>${translate(pName)} (${PILOTS[ship.pilotID].edition}) (${translate(uName)})</span>`;
                }
                else{
                    s+=`\n${pName} (${uName})`;
                    st+=`\n${translate(pName)} (${translate(uName)})`;
                    si+=`\n<span class='ship'>${unitlist[uName].code}</span> <span class='${this.listFaction==Unit.REBEL?"HALFRED":(this.listFaction==Unit.EMPIRE?"HALFGREEN":"HALFYELLOW")}'>${pName} (${uName})</span>`;
                    sti+=`\n<span class='ship'>${unitlist[uName].code}</span> <span class='${this.listFaction==Unit.REBEL?"HALFRED":(this.listFaction==Unit.EMPIRE?"HALFGREEN":"HALFYELLOW")}'>${translate(pName)} (${translate(uName)})</span>`;
                }
                if(ship.upgrades!==[]){
                    for(var k in ship.upgrades){
                        var id=ship.upgrades[k];
                        var upgName=UPGRADES[id].name;
                        s+=` + ${upgName}`;
                        st+=` + ${translate(upgName)}`;
                        si+=` + <span class="${UPGRADES[id].type}"></span> ${upgName}`;
                        sti+=` + <span class="${UPGRADES[id].type}"></span> ${translate(upgName)}`;
                    }
                }
            }
            s+="\n";    // Finish off the strings with newlines
            st+="\n";
            si+="\n";
            sti+="\n";
            this.listJuggler=s;     // Store strings in appropriate caches
            this.listTJuggler=st;
            this.listHTML=si;
            this.listTHTML=sti;
            this.dirty=false;
            
            // Now that all strings are generated and this.dirty is unset, just returns
            // the appropriate string (I chose this way for compactness)
            return this.outputJuggler(translated,improved);
        }
        else{
            console.log(`[teamlist][outputJuggler] Something went wrong!!!\n${JSON.stringify(this.listJSON)}`);
            return "";
        }
    },
    inputJuggler: function(jString){
        this.dirty=true;
    },
    inputOldJuggler: function(ojString){
        this.dirty=true;
    },
    addShip: function(ship){
        if(ship instanceof SimpleUnit){
            this.listShips.push(ship);
        }
        else{ // handle Unit <blech>
            
        }
        this.dirty=true;
    },
    removeShip: function(ship){
        if(ship instanceof SimpleUnit){
            this.listShips.splice(this.listShips.indexOf(ship),1);
        }
        else{ // handle Unit <blech!>
            
        }
        this.dirty=true;
    },
    getShips: function(){
        return this.listShips;
    },
    outputLocal: function(){
        
    },
    inputLocal: function(wrappedString){
        this.dirty=true;
    },
    toASCII: function(){
        //output list as pilot ID#s followed by upgrades;
        //Format: <ID>[,<upgID>[,...]]:<Math.floor(this.tx)>,<Math.floor(this.ty)>,<Math.floor(this.alpha)>;[<ID>...;]
        var s="";
        var i,j,ship,upg;
        // traverse each ship and its upgrades
        for(i in this.listShips){
            ship=this.listShips[i];
            s+=ship.pilotID;
            for(j in ship.upgrades){
                upg=ship.upgrades[i];
                s+=upg;
            }
            s+=":0,0,0;"
        }
        return s;
    },
    toKey: function(){
        //Converts a teamlist to a key used to reference stored data.
        var str="";
	var p=this.listShips.slice();
	p.sort(function(a,b) { return a.pilotID-b.pilotID; });
	for (var i=0; i<p.length; i++) {
            var str2=("00"+p[i].pilotID.toString(32)).slice(-2);
            var q=p[i].upgrades.slice();
            q.sort();
            for (var j=0; j<q.length; j++) str2+=("00"+q[j].toString(32)).slice(-2);
	    str+=str2+";";
        }
	//s+=p[0].toKey();
	return str;
    }
};
// Lightweight Unit object
function SimpleUnit(pilotID, upgrades){
    this.pilotID=-1;
    this.upgrades=[];
    
    if(typeof pilotID !== "undefined" && pilotID>=0 && pilotID<PILOTS.length){
        this.pilotID=pilotID;
    }
    if(typeof upgrades!=="undefined" && upgrades.length>0){
        this.upgrades=upgrades;
    }
};
SimpleUnit.prototype={};

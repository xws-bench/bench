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
    this.listHTML=null;     // enhanced listJuggler list with HTML hinting
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
        
//	for (i=0; i<s.pilots.length; i++) {
//	    var pilot=s.pilots[i];
//	    var p;
//	    var pid=-1;
//            var simplePilot=new SimpleUnit();
//	    
//            var j=PILOTSNAMEINDEX.indexOf(PILOT_dict[pilot.name]); // INDEX lookup is much faster than iterating over PILOTS
//            var possiblePilots=[];
//            while(j!==-1){  // Fix for Fenn Rau, possibly others
//                possiblePilots.push(j);
//                j=PILOTSNAMEINDEX.indexOf(PILOT_dict[pilot.name],j+1);
//            }
//            for(var p in possiblePilots){
//                j=possiblePilots[p];
//                if (j!==-1 && PILOTS[j].faction==this.listFaction&&
//                       PILOTS[j].unit==PILOT_dict[pilot.ship]) { 
//                        pid=j;
//                        break;
//                }
//            }
//            if(pid===-1){ 
//                throw("pid undefined:"+PILOT_dict[pilot.name]+"-"+pilot.name+"/"+this.listFaction+"/"+PILOT_dict[pilot.ship]); 
//            }
//            // Record cost
//            this.pointCost+=PILOTS[pid].points;
//            // Record PID
//            simplePilot.pilotID=pid;
//	    
//            if (typeof pilot.upgrades!="undefined")  {
//                // Need to apply all valid upgrades, but also need to install upgrades first
//                var impUpgList=[];
//                var upgType;
//                var upgInfo;
//                var realUpg;
//                var vaksai=false;
//                var tiex1=false;
//                // Iterate over imported pilot's upgrades and get their info from
//                // UPGRADES if possible.
//                for (var j in pilot.upgrades){
//                    var upgType=pilot.upgrades[j];
//                    for (var k=0, len=upgType.length; k<len; k++){
//                        upgInfo={"name":upgType[k], "type":j, "index":-1, "hasUpgrades":false, "entry":null};
//                        upgInfo.index=UPGRADESNAMEINDEX.indexOf(UPGRADE_dict[upgInfo.name]); // ~2 faster than iterating over UPGRADES
//                        if(upgInfo.index===-1){
//                            console.log(`[teamlist.js][updateCost] Could not find upgrade ${upgInfo.name}`);
//                            break;
//                        }
//                        else{
//                            realUpg=UPGRADES[upgInfo.index];
//                            upgInfo.hasUpgrades=(
//                                (typeof realUpg.upgrades!=="undefined")||
//                                (typeof realUpg.pointsupg!=="undefined")
//                            );
//                            upgInfo.entry=realUpg;
//                            impUpgList.push(upgInfo);
//                            // Store upgrade ID
//                            simplePilot.upgrades.push(upgInfo.index);
//                        }
//                    }
//                }
//                for(var k in impUpgList){
//                    if(impUpgList[k].entry.name==="TIE/x1"){tiex1=true;}
//                    else if (impUpgList[k].entry.name==="Vaksai"){vaksai=true;}
//                }
//                for(k in impUpgList){ // Actually calculate cost
//                    var cost;
//                    var upg=impUpgList[k];
//                    cost=upg.entry.points;
//                    if(tiex1&&upg.entry.type===Unit.SYSTEM){
//                        cost=(cost-4<0)?0:cost-4;
//                    }
//                    if(vaksai){
//                        cost=(cost-1<0)?0:cost-1;
//                    }
//                    this.pointCost+=cost;
//                }
//	    }
//            // Add this ship to the list of simpleUnits.
//            this.addShip(simplePilot);
//	}
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
    outputJuggler: function(){
        // Output current list state as List Juggler format
        var s=`${this.listFaction.replace(/\B[A-Z]/g,l => l.toLowerCase())}`;
        // Shortcuts
        if(this.listJSON===null) return "";
        else if(!this.dirty){
            return this.listJuggler;
        }
        else if(this.listShips!==[]){
            var ships=this.listShips;
            for(var i in ships){
                var ship=ships[i];
                // Set pilot name, edition (if necessary [Poe!]), and unit name
                if(PILOTS[ship.pilotID].ambiguous){
                    s+=`\n${PILOTS[ship.pilotID].name} (${PILOTS[ship.pilotID].edition}) (${PILOTS[ship.pilotID].unit})`;
                }
                else{
                    s+=`\n${PILOTS[ship.pilotID].name} (${PILOTS[ship.pilotID].unit})`;
                }
                if(ship.upgrades!==[]){
                    for(var k in ship.upgrades){
                        var id=ship.upgrades[k];
                        s+=` + ${UPGRADES[id].name}`;
                    }
                }
            }
            s+="\n";
            this.listJuggler=s;
            this.dirty=false;
            return s;
        }
        else{
            // Setup for turning JSON into List Juggler human-readable text
            var js=this.listJSON;


            // Find the human-readable pilot string
            var j,pilot;
            try{
                for(var i in js.pilots){
                    // Search all pilots whose names match this;
                    pilot=js.pilots[i];            
                    s+=`\n${PILOT_dict[pilot.name]} (${PILOT_dict[pilot.ship]})`;

                    if (typeof pilot.upgrades!="undefined")  {
                        // Need to apply all valid upgrades, but also need to install upgrades first
                        var upgType;
                        var upgInfo;
                        // Iterate over imported pilot's upgrades and get their info from
                        // UPGRADES if possible.
                        for (var j in pilot.upgrades){
                            var upgType=pilot.upgrades[j];
                            for (var k=0, len=upgType.length; k<len; k++){
                                upgInfo={"name":upgType[k], "type":j, "index":-1, "hasUpgrades":false, "entry":null};
                                upgInfo.index=UPGRADESNAMEINDEX.indexOf(UPGRADE_dict[upgInfo.name]); // ~2 faster than iterating over UPGRADES
                                if(upgInfo.index===-1){
                                    console.log(`[teamlist.js][outputJuggler] Could not find upgrade ${upgInfo.name}`);
                                    break;
                                }
                                else{
                                    s+=` + ${UPGRADE_dict[upgInfo.name]}`;
                                }
                            }
                        }
                    }
                }
            }
            catch(e){
                console.log(`[teamlist.js][outputJuggler] Could not parse part of ${pilot.name}`);
                console.log(e.message);
            }
            this.listJuggler=s; // update cached Juggler string
            this.dirty=false;
            return s;
        }
    },
    outputHTML: function(translated){
        var s;
        if(this.dirty){
            s=this.outputJuggler();
        }
        else{
            s=this.listJuggler;
        }
        // Improve 
        
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
            this.listShips.splice(this.listShips.indexOf(ship));
        }
        else{ // handle Unit <blech!>
            
        }
        this.dirty=true;
    },
    getShips: function(){
        return this.listShips;
    },
    computeScore: function(){
        
    },
    outputLocal: function(){
        
    },
    inputLocal: function(wrappedString){
        this.dirty=true;
    },
    toASCII: function(){
        
    },
    toKey: function(){
        
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

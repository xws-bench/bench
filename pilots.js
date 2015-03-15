var REBEL="Rebel Alliance",EMPIRE="Galactic Empire",SCUM="Scum and Villainy";

function Pilot(name) {
    var i;
    for (i=0; i<PILOTS.length; i++) {
	if (PILOTS[i].name==name) {
	    return new Unit(PILOTS[i]);
	}
    }
    console.log("Could not find pilot "+name);
}

var PILOTS = [
    {
        name: "Wedge Antilles",
        
        
        unique: true,
        ship: "X-Wing",
        skill: 9,
        points: 29,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Garven Dreis",
        
        
        unique: true,
        ship: "X-Wing",
        skill: 6,
        points: 26,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Red Squadron Pilot",
        
        
        ship: "X-Wing",
        skill: 4,
        points: 23,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Rookie Pilot",
        
        
        ship: "X-Wing",
        skill: 2,
        points: 21,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Biggs Darklighter",
        
        
        unique: true,
        ship: "X-Wing",
        skill: 5,
        points: 25,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Luke Skywalker",
        
        
        unique: true,
        ship: "X-Wing",
        skill: 8,
        points: 28,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Gray Squadron Pilot",
        
        
        ship: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: '"Dutch" Vander',
        
        
        unique: true,
        ship: "Y-Wing",
        skill: 6,
        points: 23,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Horton Salm",
        
        
        unique: true,
        ship: "Y-Wing",
        skill: 8,
        points: 25,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Gold Squadron Pilot",
        
        
        ship: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Academy Pilot",
        
        
        ship: "TIE Fighter",
        skill: 1,
        points: 12,
        upgrades: [],
    },
    {
        name: "Obsidian Squadron Pilot",
        
        
        ship: "TIE Fighter",
        skill: 3,
        points: 13,
        upgrades: [],
    },
    {
        name: "Black Squadron Pilot",
        
        
        ship: "TIE Fighter",
        skill: 4,
        points: 14,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: '"Winged Gundark"',
        
        
        unique: true,
        ship: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: '"Night Beast"',
        
        
        unique: true,
        ship: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: '"Backstabber"',
        
        
        unique: true,
        ship: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: '"Dark Curse"',
        
        
        unique: true,
        ship: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: '"Mauler Mithel"',
        
        
        unique: true,
        ship: "TIE Fighter",
        skill: 7,
        points: 17,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: '"Howlrunner"',
        
        
        unique: true,
        ship: "TIE Fighter",
        skill: 8,
        points: 18,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Maarek Stele",
        
        
        unique: true,
        ship: "TIE Advanced",
        skill: 7,
        points: 27,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Tempest Squadron Pilot",
        
        
        ship: "TIE Advanced",
        skill: 2,
        points: 21,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Storm Squadron Pilot",
        
        
        ship: "TIE Advanced",
        skill: 4,
        points: 23,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Darth Vader",
        
        
        unique: true,
        ship: "TIE Advanced",
        skill: 9,
        points: 29,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Alpha Squadron Pilot",
        
        
        ship: "TIE Interceptor",
        skill: 1,
        points: 18,
        upgrades: [ ],
    },
    {
        name: "Avenger Squadron Pilot",
        
        
        ship: "TIE Interceptor",
        skill: 3,
        points: 20,
        upgrades: [ ],
    },
    {
        name: "Saber Squadron Pilot",
        
        
        ship: "TIE Interceptor",
        skill: 4,
        points: 21,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "\"Fel's Wrath\"",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 5,
        points: 23,
        upgrades: [ ],
    },
    {
        name: "Turr Phennir",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 7,
        points: 25,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Soontir Fel",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 9,
        points: 27,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Tycho Celchu",
        
        
        unique: true,
        ship: "A-Wing",
        skill: 8,
        points: 26,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Arvel Crynyd",
        
        
        unique: true,
        ship: "A-Wing",
        skill: 6,
        points: 23,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Green Squadron Pilot",
        
        
        ship: "A-Wing",
        skill: 3,
        points: 19,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Prototype Pilot",
        
        
        ship: "A-Wing",
        skill: 1,
        points: 17,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Outer Rim Smuggler",
        
        
        ship: "YT-1300",
        skill: 1,
        points: 27,
        upgrades: [
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Chewbacca",
        
        
        unique: true,
        ship: "YT-1300",
        skill: 5,
        points: 42,
        upgrades: [
            "Elite",
            "Missile",
            "Crew",
            "Crew",
        ],
        attack: 3,
        agility: 1,
        hull: 8,
        shields: 5,
    },
    {
        name: "Lando Calrissian",
        
        
        unique: true,
        ship: "YT-1300",
        skill: 7,
        points: 44,
        upgrades: [
            "Elite",
            "Missile",
            "Crew",
            "Crew",
        ],
        attack: 3,
        agility: 1,
        hull: 8,
        shields: 5,
    },
    {
        name: "Han Solo",
        
        
        unique: true,
        ship: "YT-1300",
        skill: 9,
        points: 46,
        upgrades: [
            "Elite",
            "Missile",
            "Crew",
            "Crew",
        ],
        attack: 3,
        agility: 1,
        hull: 8,
        shields: 5,
    },
    {
        name: "Kath Scarlet",
        
        
        unique: true,
        ship: "Firespray-31",
        skill: 7,
        points: 38,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Boba Fett",
        
        
        unique: true,
        ship: "Firespray-31",
        skill: 8,
        points: 39,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Krassis Trelix",
        
        
        unique: true,
        ship: "Firespray-31",
        skill: 5,
        points: 36,
        upgrades: [
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Bounty Hunter",
        
        
        ship: "Firespray-31",
        skill: 3,
        points: 33,
        upgrades: [
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
        ],
    },
    {
        name: "Ten Numb",
        
        
        unique: true,
        ship: "B-Wing",
        skill: 8,
        points: 31,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Ibtisam",
        
        
        unique: true,
        ship: "B-Wing",
        skill: 6,
        points: 28,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Dagger Squadron Pilot",
        
        
        ship: "B-Wing",
        skill: 4,
        points: 24,
        upgrades: [
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Blue Squadron Pilot",
        
        
        ship: "B-Wing",
        skill: 2,
        points: 22,
        upgrades: [
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Rebel Operative",
        
        
        ship: "HWK-290",
        skill: 2,
        points: 16,
        upgrades: [
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Roark Garnet",
        
        
        unique: true,
        ship: "HWK-290",
        skill: 4,
        points: 19,
        upgrades: [
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Kyle Katarn",
        
        
        unique: true,
        ship: "HWK-290",
        skill: 6,
        points: 21,
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Jan Ors",
        
        
        unique: true,
        ship: "HWK-290",
        skill: 8,
        points: 25,
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
        ],
    },
    {
        name: "Scimitar Squadron Pilot",
        
        
        ship: "TIE Bomber",
        skill: 2,
        points: 16,
        upgrades: [
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Gamma Squadron Pilot",
        
        
        ship: "TIE Bomber",
        skill: 4,
        points: 18,
        upgrades: [
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Captain Jonus",
        
        
        unique: true,
        ship: "TIE Bomber",
        skill: 6,
        points: 22,
        upgrades: [
            "Elite",
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Major Rhymer",
        
        
        unique: true,
        ship: "TIE Bomber",
        skill: 7,
        points: 26,
        upgrades: [
            "Elite",
            "Torpedo",
            "Torpedo",
            "Missile",
            "Missile",
            "Bomb",
        ],
    },
    {
        name: "Captain Kagi",
        
        
        unique: true,
        ship: "Lambda-Class Shuttle",
        skill: 8,
        points: 27,
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Colonel Jendon",
        
        
        unique: true,
        ship: "Lambda-Class Shuttle",
        skill: 6,
        points: 26,
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Captain Yorr",
        
        
        unique: true,
        ship: "Lambda-Class Shuttle",
        skill: 4,
        points: 24,
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Omicron Group Pilot",
        
        
        ship: "Lambda-Class Shuttle",
        skill: 2,
        points: 21,
        upgrades: [
            "System",
            "Cannon",
            "Crew",
            "Crew",
        ],
    },
    {
        name: "Lieutenant Lorrir",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 5,
        points: 23,
        upgrades: [ ],
    },
    {
        name: "Royal Guard Pilot",
        
        
        ship: "TIE Interceptor",
        skill: 6,
        points: 22,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Tetran Cowall",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Kir Kanos",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 6,
        points: 24,
        upgrades: [ ],
    },
    {
        name: "Carnor Jax",
        
        
        unique: true,
        ship: "TIE Interceptor",
        skill: 8,
        points: 26,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "GR-75 Medium Transport",
        
        
        epic: true,
        ship: "GR-75 Medium Transport",
        skill: 3,
        points: 30,
        upgrades: [
            "Crew",
            "Crew",
            "Cargo",
            "Cargo",
            "Cargo",
        ],
    },
    {
        name: "Bandit Squadron Pilot",
        
        
        ship: "Z-95 Headhunter",
        skill: 2,
        points: 12,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Tala Squadron Pilot",
        
        
        ship: "Z-95 Headhunter",
        skill: 4,
        points: 13,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Lieutenant Blount",
        
        
        unique: true,
        ship: "Z-95 Headhunter",
        skill: 6,
        points: 17,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Airen Cracken",
        
        
        unique: true,
        ship: "Z-95 Headhunter",
        skill: 8,
        points: 19,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Delta Squadron Pilot",
        
        
        ship: "TIE Defender",
        skill: 1,
        points: 30,
        upgrades: [
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Onyx Squadron Pilot",
        
        
        ship: "TIE Defender",
        skill: 3,
        points: 32,
        upgrades: [
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Colonel Vessery",
        
        
        unique: true,
        ship: "TIE Defender",
        skill: 6,
        points: 35,
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Rexler Brath",
        
        
        unique: true,
        ship: "TIE Defender",
        skill: 8,
        points: 37,
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
        ],
    },
    {
        name: "Knave Squadron Pilot",
        
        
        ship: "E-Wing",
        skill: 1,
        points: 27,
        upgrades: [
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Blackmoon Squadron Pilot",
        
        
        ship: "E-Wing",
        skill: 3,
        points: 29,
        upgrades: [
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Etahn A'baht",
        
        
        unique: true,
        ship: "E-Wing",
        skill: 5,
        points: 32,
        upgrades: [
            "Elite",
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Corran Horn",
        
        
        unique: true,
        ship: "E-Wing",
        skill: 8,
        points: 35,
        upgrades: [
            "Elite",
            "System",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Sigma Squadron Pilot",
        
        
        ship: "TIE Phantom",
        skill: 3,
        points: 25,
        upgrades: [
            "System",
            "Crew",
        ],
    },
    {
        name: "Shadow Squadron Pilot",
        
        
        ship: "TIE Phantom",
        skill: 5,
        points: 27,
        upgrades: [
            "System",
            "Crew",
        ],
    },
    {
        name: '"Echo"',
        
        
        unique: true,
        ship: "TIE Phantom",
        skill: 6,
        points: 30,
        upgrades: [
            "Elite",
            "System",
            "Crew",
        ],
    },
    {
        name: '"Whisper"',
        
        
        unique: true,
        ship: "TIE Phantom",
        skill: 7,
        points: 32,
        upgrades: [
            "Elite",
            "System",
            "Crew",
        ],
    },
    {
        name: "CR90 Corvette (Fore)",
        
        
        epic: true,
        ship: "CR90 Corvette (Fore)",
        skill: 4,
        points: 50,
        upgrades: [
            "Crew",
            "Hardpoint",
            "Hardpoint",
            "Team",
            "Team",
            "Cargo",
        ],
    },
    {
        name: "CR90 Corvette (Aft)",
        
        
        epic: true,
        ship: "CR90 Corvette (Aft)",
        skill: 4,
        points: 40,
        upgrades: [
            "Crew",
            "Hardpoint",
            "Team",
            "Cargo",
        ],
    },
    {
        name: "Wes Janson",
        
        
        unique: true,
        ship: "X-Wing",
        skill: 8,
        points: 29,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Jek Porkins",
        
        
        unique: true,
        ship: "X-Wing",
        skill: 7,
        points: 26,
        upgrades: [
            "Elite",
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: '"Hobbie" Klivian',
        
        
        unique: true,
        ship: "X-Wing",
        skill: 5,
        points: 25,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Tarn Mison",
        
        
        unique: true,
        ship: "X-Wing",
        skill: 3,
        points: 23,
        upgrades: [
            "Torpedo",
            "Astromech",
        ],
    },
    {
        name: "Jake Farrell",
        
        
        unique: true,
        ship: "A-Wing",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Gemmer Sojan",
        
        
        unique: true,
        ship: "A-Wing",
        skill: 5,
        points: 22,
        upgrades: [
            "Missile",
        ],
    },
    {
        name: "Keyan Farlander",
        
        
        unique: true,
        ship: "B-Wing",
        skill: 7,
        points: 29,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "Nera Dantels",
        
        
        unique: true,
        ship: "B-Wing",
        skill: 5,
        points: 26,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Torpedo",
            "Torpedo",
        ],
    },
    {
        name: "CR90 Corvette (Crippled Fore)",
        skip: true,
        
        
        ship: "CR90 Corvette (Fore)",
        skill: 4,
        points: 0,
        epic: true,
        upgrades: [
            "Crew",
        ],
        
        attack: 2,
        agility: 0,
        hull: 0,
        shields: 0,
        actions: [],
    },
    {
        name: "CR90 Corvette (Crippled Aft)",
        skip: true,
        
        
        ship: "CR90 Corvette (Aft)",
        skill: 4,
        points: 0,
        epic: true,
        upgrades: [
            "Cargo",
        ],
        
        energy: 1,
        agility: 0,
        hull: 0,
        shields: 0,
        actions: [],
    },
    {
        name: "Wild Space Fringer",
        
        
        ship: "YT-2400",
        skill: 2,
        points: 30,
        upgrades: [
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: "Eaden Vrill",
        
        
        ship: "YT-2400",
        unique: true,
        skill: 3,
        points: 32,
        upgrades: [
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: '"Leebo"',
        
        
        ship: "YT-2400",
        unique: true,
        skill: 5,
        points: 34,
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: "Dash Rendar",
        
        
        ship: "YT-2400",
        unique: true,
        skill: 7,
        points: 36,
        upgrades: [
            "Elite",
            "Cannon",
            "Missile",
            "Crew",
        ],
    },
    {
        name: "Patrol Leader",
        
        
        ship: "VT-49 Decimator",
        skill: 3,
        points: 40,
        upgrades: [
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Captain Oicunn",
        
        
        ship: "VT-49 Decimator",
        skill: 4,
        points: 42,
        unique: true,
        upgrades: [
            "Elite",
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Commander Kenkirk",
        
        
        ship: "VT-49 Decimator",
        skill: 6,
        points: 44,
        unique: true,
        upgrades: [
            "Elite",
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Rear Admiral Chiraneau",
        
        
        ship: "VT-49 Decimator",
        skill: 8,
        points: 46,
        unique: true,
        upgrades: [
            "Elite",
            "Torpedo",
            "Crew",
            "Crew",
            "Crew",
            "Bomb",
        ],
    },
    {
        name: "Prince Xizor",
        
        
        unique: true,
        ship: "StarViper",
        skill: 7,
        points: 31,
        upgrades: [
            "Elite",
            "Torpedo",
        ],
    },
    {
        name: "Guri",
        
        
        unique: true,
        ship: "StarViper",
        skill: 5,
        points: 30,
        upgrades: [
            "Elite",
            "Torpedo",
        ],
    },
    {
        name: "Black Sun Vigo",
        
        
        ship: "StarViper",
        skill: 3,
        points: 27,
        upgrades: [
            "Torpedo",
        ],
    },
    {
        name: "Black Sun Enforcer",
        
        
        ship: "StarViper",
        skill: 1,
        points: 25,
        upgrades: [
            "Torpedo",
        ],
    },
    {
        name: "Serissu",
        
        
        ship: "M3-A Interceptor",
        skill: 8,
        points: 20,
        unique: true,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Laetin A'shera",
        
        
        ship: "M3-A Interceptor",
        skill: 6,
        points: 18,
        unique: true,
        upgrades: [ ],
    },
    {
        name: "Tansarii Point Veteran",
        
        
        ship: "M3-A Interceptor",
        skill: 5,
        points: 17,
        upgrades: [
            "Elite",
        ],
    },
    {
        name: "Cartel Spacer",
        
        
        ship: "M3-A Interceptor",
        skill: 2,
        points: 14,
        upgrades: [ ],
    },
    {
        name: "IG-88A",
        
        
        unique: true,
        ship: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "IG-88B",
        
        
        unique: true,
        ship: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "IG-88C",
        
        
        unique: true,
        ship: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "IG-88D",
        
        
        unique: true,
        ship: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [
            "Elite",
            "System",
            "Cannon",
            "Cannon",
            "Bomb",
            "Illicit",
        ],
    },
    {
        name: "N'Dru Suhlak",
        unique: true,
        
        
        ship: "Z-95 Headhunter",
        skill: 7,
        points: 17,
        upgrades: [
            "Elite",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Kaa'To Leeachos",
        unique: true,
        
        
        ship: "Z-95 Headhunter",
        skill: 5,
        points: 15,
        upgrades: [
            "Elite",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Black Sun Soldier",
        
        
        ship: "Z-95 Headhunter",
        skill: 3,
        points: 13,
        upgrades: [
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Binayre Pirate",
        
        
        ship: "Z-95 Headhunter",
        skill: 1,
        points: 12,
        upgrades: [
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Boba Fett (Scum)",
        
        
        
        ship: "Firespray-31",
        skill: 8,
        points: 39,
        unique: true,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Kath Scarlet (Scum)",
        
        unique: true,
        
        
        ship: "Firespray-31",
        skill: 7,
        points: 38,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Emon Azzameen",
        unique: true,
        
        
        ship: "Firespray-31",
        skill: 6,
        points: 36,
        upgrades: [
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Mandalorian Mercenary",
        
        
        ship: "Firespray-31",
        skill: 5,
        points: 35,
        upgrades: [
            "Elite",
            "Cannon",
            "Bomb",
            "Crew",
            "Missile",
            "Illicit",
        ],
    },
    {
        name: "Kavil",
        unique: true,
        
        
        ship: "Y-Wing",
        skill: 7,
        points: 24,
        upgrades: [
            "Elite",
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Drea Renthal",
        unique: true,
        
        
        ship: "Y-Wing",
        skill: 5,
        points: 22,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Hired Gun",
        
        
        ship: "Y-Wing",
        skill: 4,
        points: 20,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Syndicate Thug",
        
        
        ship: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [
            "Turret",
            "Torpedo",
            "Torpedo",
            "Salvaged Astromech",
        ],
    },
    {
        name: "Dace Bonearm",
        unique: true,
        
        
        ship: "HWK-290",
        skill: 7,
        points: 23,
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
            "Illicit",
        ],
    },
    {
        name: "Palob Godalhi",
        unique: true,
        
        
        ship: "HWK-290",
        skill: 5,
        points: 20,
        upgrades: [
            "Elite",
            "Turret",
            "Crew",
            "Illicit",
        ],
    },
    {
        name: "Torkil Mux",
        unique: true,
        
        
        ship: "HWK-290",
        skill: 3,
        points: 19,
        upgrades: [
            "Turret",
            "Crew",
            "Illicit",
        ],
    },
    {
        name: "Spice Runner",
        
        
        ship: "HWK-290",
        skill: 1,
        points: 16,
        upgrades: [
            "Turret",
            "Crew",
            "Illicit",
        ],
    },
    {
        name: "Commander Alozen",
        
        
        ship: "TIE Advanced",
        unique: true,
        skill: 5,
        points: 25,
        upgrades: [
            "Elite",
            "Missile",
        ],
    },
    {
        name: "Raider-class Corvette (Fore)",
        
        
        ship: "Raider-class Corvette (Fore)",
        skill: 4,
        points: 50,
        epic: true,
        upgrades: [
            "Hardpoint",
            "Team",
            "Cargo",
        ],
    },
    {
        name: "Raider-class Corvette (Aft)",
        
        
        ship: "Raider-class Corvette (Aft)",
        skill: 4,
        points: 50,
        epic: true,
        upgrades: [
            "Crew",
            "Crew",
            "Hardpoint",
            "Hardpoint",
            "Team",
            "Team",
            "Cargo",
        ],
    },
];

var UPGRADES= [
    {
        name: "Ion Cannon Turret",
        
        upgrade: "Turret",
        points: 5,
        attack: 3,
        range: "1-2",
    },
    {
        name: "Proton Torpedoes",
        
        upgrade: "Torpedo",
        points: 4,
        attack: 4,
        range: "2-3",
    },
    {
        name: "R2 Astromech",
        
        upgrade: "Astromech",
        points: 1,
    },
    {
        name: "R2-D2",
        aka: [ "R2-D2 (Crew)" ],
        
        
        unique: true,
        upgrade: "Astromech",
        points: 4,
    },
    {
        name: "R2-F2",
        
        unique: true,
        upgrade: "Astromech",
        points: 3,
    },
    {
        name: "R5-D8",
        
        unique: true,
        upgrade: "Astromech",
        points: 3,
    },
    {
        name: "R5-K6",
        
        unique: true,
        upgrade: "Astromech",
        points: 2,
    },
    {
        name: "R5 Astromech",
        
        upgrade: "Astromech",
        points: 1,
    },
    {
        name: "Determination",
        
        upgrade: "Elite",
        points: 1,
    },
    {
        name: "Swarm Tactics",
        
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Squad Leader",
        
        unique: true,
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Expert Handling",
        
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Marksmanship",
        
        upgrade: "Elite",
        points: 3,
    },
    {
        name: "Concussion Missiles",
        
        upgrade: "Missile",
        points: 4,
        attack: 4,
        range: "2-3",
    },
    {
        name: "Cluster Missiles",
        
        upgrade: "Missile",
        points: 4,
        attack: 3,
        range: "1-2",
    },
    {
        name: "Daredevil",
        
        upgrade: "Elite",
        points: 3,
    },
    {
        name: "Elusiveness",
        
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Homing Missiles",
        
        upgrade: "Missile",
        attack: 4,
        range: "2-3",
        points: 5,
    },
    {
        name: "Push the Limit",
        
        upgrade: "Elite",
        points: 3,
    },
    {
        name: "Deadeye",
        
        upgrade: "Elite",
        points: 1,
    },
    {
        name: "Expose",
        
        upgrade: "Elite",
        points: 4,
    },
    {
        name: "Gunner",
        
        upgrade: "Crew",
        points: 5,
    },
    {
        name: "Ion Cannon",
        
        upgrade: "Cannon",
        points: 3,
        attack: 3,
        range: "1-3",
    },
    {
        name: "Heavy Laser Cannon",
        
        upgrade: "Cannon",
        points: 7,
        attack: 4,
        range: "2-3",
    },
    {
        name: "Seismic Charges",
        
        upgrade: "Bomb",
        points: 2,
    },
    {
        name: "Mercenary Copilot",
        
        upgrade: "Crew",
        points: 2,
    },
    {
        name: "Assault Missiles",
        
        upgrade: "Missile",
        points: 5,
        attack: 4,
        range: "2-3",
    },
    {
        name: "Veteran Instincts",
        
        upgrade: "Elite",
        points: 1,
    },
    {
        name: "Proximity Mines",
        
        upgrade: "Bomb",
        points: 3,
    },
    {
        name: "Weapons Engineer",
        
        upgrade: "Crew",
        points: 3,
    },
    {
        name: "Draw Their Fire",
        
        upgrade: "Elite",
        points: 1,
    },
    {
        name: "Luke Skywalker",
        
        unique: true,
        
        upgrade: "Crew",
        points: 7,
    },
    {
        name: "Nien Nunb",
        
        unique: true,
        
        upgrade: "Crew",
        points: 1,

    },
    {
        name: "Chewbacca",
        
        unique: true,
        
        upgrade: "Crew",
        points: 4,
    },
    {
        name: "Advanced Proton Torpedoes",
        
        
        upgrade: "Torpedo",
        attack: 5,
        range: "1",
        points: 6,
    },
    {
        name: "Autoblaster",
        
        upgrade: "Cannon",
        attack: 3,
        range: "1",
        points: 5,
    },
    {
        name: "Fire-Control System",
        
        upgrade: "System",
        points: 2,
    },
    {
        name: "Blaster Turret",
        
        upgrade: "Turret",
        points: 4,
        attack: 3,
        range: "1-2",
    },
    {
        name: "Recon Specialist",
        
        upgrade: "Crew",
        points: 3,
    },
    {
        name: "Saboteur",
        
        upgrade: "Crew",
        points: 2,
    },
    {
        name: "Intelligence Agent",
        
        upgrade: "Crew",
        points: 1,
    },
    {
        name: "Proton Bombs",
        
        upgrade: "Bomb",
        points: 5,
    },
    {
        name: "Adrenaline Rush",
        
        upgrade: "Elite",
        points: 1,
    },
    {
        name: "Advanced Sensors",
        
        upgrade: "System",
        points: 3,
    },
    {
        name: "Sensor Jammer",
        
        upgrade: "System",
        points: 4,
    },
    {
        name: "Darth Vader",
        
        unique: true,
        
        upgrade: "Crew",
        points: 3,
    },
    {
        name: "Rebel Captive",
        
        unique: true,
        
        upgrade: "Crew",
        points: 3,
    },
    {
        name: "Flight Instructor",
        
        upgrade: "Crew",
        points: 4,
    },
    {
        name: "Navigator",
        
        upgrade: "Crew",
        points: 3,
    },
    {
        name: "Opportunist",
        
        upgrade: "Elite",
        points: 4,
    },
    {
        name: "Comms Booster",
        
        upgrade: "Cargo",
        points: 4,
    },
    {
        name: "Slicer Tools",
        
        upgrade: "Cargo",
        points: 7,
    },
    {
        name: "Shield Projector",
        
        upgrade: "Cargo",
        points: 4,
    },
    {
        name: "Ion Pulse Missiles",
        
        upgrade: "Missile",
        points: 3,
        attack: 3,
        range: "2-3",
    },
    {
        name: "Wingman",
        
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Decoy",
        
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Outmaneuver",
        
        upgrade: "Elite",
        points: 3,
    },
    {
        name: "Predator",
        
        upgrade: "Elite",
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
        
        upgrade: "Torpedo",
        points: 2,
        attack: 3,
        range: "2-3",
    },
    {
        name: "R7 Astromech",
        
        upgrade: "Astromech",
        points: 2,
    },
    {
        name: "R7-T1",
        
        unique: true,
        upgrade: "Astromech",
        points: 3,
    },
    {
        name: "Tactician",
        
        upgrade: "Crew",
        points: 2,
    },
    {
        name: "R2-D2 (Crew)",
        aka: [ "R2-D2" ],
        
        
        unique: true,
        upgrade: "Crew",
        points: 4,
        
    },
    {
        name: "C-3PO",
        unique: true,
        
        upgrade: "Crew",
        points: 3,
        
    },
    {
        name: "Single Turbolasers",
        
        upgrade: "Hardpoint",
        points: 8,
        energy: 2,
        attack: 4,
        range: "3-5",
    },
    {
        name: "Quad Laser Cannons",
        
        upgrade: "Hardpoint",
        points: 6,
        energy: 2,
        attack: 3,
        range: "1-2",
    },
    {
        name: "Tibanna Gas Supplies",
        
        upgrade: "Cargo",
        points: 4,
        limited: true,
    },
    {
        name: "Ionization Reactor",
        
        upgrade: "Cargo",
        points: 4,
        energy: 5,
        limited: true,
    },
    {
        name: "Engine Booster",
        
        upgrade: "Cargo",
        points: 3,
        limited: true,
    },
    {
        name: "R3-A2",
        
        unique: true,
        upgrade: "Astromech",
        points: 2,
    },
    {
        name: "R2-D6",
        
        unique: true,
        upgrade: "Astromech",
        points: 1,
    },
    {
        name: "Enhanced Scopes",
        
        upgrade: "System",
        points: 1,
    },
    {
        name: "Chardaan Refit",
        
        upgrade: "Missile",
        points: -2,
        ship: "A-Wing",
    },
    {
        name: "Proton Rockets",
        
        upgrade: "Missile",
        points: 3,
        attack: 2,
        range: "1",
    },
    {
        name: "Kyle Katarn",
        
        unique: true,
        upgrade: "Crew",
        points: 3,
        
    },
    {
        name: "Jan Ors",
        
        unique: true,
        upgrade: "Crew",
        points: 2,
        
    },
    {
        name: "Toryn Farr",
        
        unique: true,
        upgrade: "Crew",
        points: 6,
    },
    {
        name: "R4-D6",
        
        unique: true,
        upgrade: "Astromech",
        points: 1,
    },
    {
        name: "R5-P9",
        
        unique: true,
        upgrade: "Astromech",
        points: 3,
    },
    {
        name: "WED-15 Repair Droid",
        
        upgrade: "Crew",
        points: 2,
    },
    {
        name: "Carlist Rieekan",
        
        unique: true,
        upgrade: "Crew",
        points: 3,
        
    },
    {
        name: "Jan Dodonna",
        
        unique: true,
        upgrade: "Crew",
        points: 6,
        
    },
    {
        name: "Expanded Cargo Hold",
        
        upgrade: "Cargo",
        points: 1,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Backup Shield Generator",
        
        upgrade: "Cargo",
        limited: true,
        points: 3,
    },
    {
        name: "EM Emitter",
        
        upgrade: "Cargo",
        limited: true,
        points: 3,
    },
    {
        name: "Frequency Jammer",
        
        upgrade: "Cargo",
        limited: true,
        points: 4,
    },
    {
        name: "Han Solo",
        
        upgrade: "Crew",
        unique: true,
        
        points: 2,
    },
    {
        name: "Leia Organa",
        
        upgrade: "Crew",
        unique: true,
        
        points: 4,
    },
    {
        name: "Targeting Coordinator",
        
        upgrade: "Crew",
        limited: true,
        points: 4,
    },
    {
        name: "Raymus Antilles",
        
        upgrade: "Crew",
        unique: true,
        
        points: 6,
    },
    {
        name: "Gunnery Team",
        
        upgrade: "Team",
        limited: true,
        points: 4,
    },
    {
        name: "Sensor Team",
        
        upgrade: "Team",
        points: 4,
    },
    {
        name: "Engineering Team",
        
        upgrade: "Team",
        limited: true,
        points: 4,
    },
    {
        name: "Lando Calrissian",
        
        upgrade: "Crew",
        unique: true,
        
        points: 3,
    },
    {
        name: "Mara Jade",
        
        upgrade: "Crew",
        unique: true,
        
        points: 3,
    },
    {
        name: "Fleet Officer",
        
        upgrade: "Crew",
        
        points: 3,
    },
    {
        name: "Stay On Target",
        
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Dash Rendar",
        
        unique: true,
        upgrade: "Crew",
        points: 2,
        
    },
    {
        name: "Lone Wolf",
        
        unique: true,
        upgrade: "Elite",
        points: 2,
    },
    {
        name: '"Leebo"',
        
        unique: true,
        upgrade: "Crew",
        points: 2,
        
    },
    {
        name: "Ruthlessness",
        
        upgrade: "Elite",
        points: 3,
        
    },
    {
        name: "Intimidation",
        
        upgrade: "Elite",
        points: 2,
    },
    {
        name: "Ysanne Isard",
        
        unique: true,
        upgrade: "Crew",
        points: 4,
        
    },
    {
        name: "Moff Jerjerrod",
        
        unique: true,
        upgrade: "Crew",
        points: 2,
        
    },
    {
        name: "Ion Torpedoes",
        
        upgrade: "Torpedo",
        points: 5,
        attack: 4,
        range: "2-3",
    },
    {
        name: "Bodyguard",
        
        unique: true,
        upgrade: "Elite",
        points: 2,
        
    },
    {
        name: "Calculation",
        
        upgrade: "Elite",
        points: 1,
    },
    {
        name: "Accuracy Corrector",
        
        upgrade: "System",
        points: 3,
    },
    {
        name: "Inertial Dampeners",
        
        upgrade: "Illicit",
        points: 1,
    },
    {
        name: "Flechette Cannon",
        
        upgrade: "Cannon",
        points: 2,
        attack: 3,
        range: "1-3",
    },
    {
        name: '"Mangler" Cannon',
        
        upgrade: "Cannon",
        points: 4,
        attack: 3,
        range: "1-3",
    },
    {
        name: "Dead Man's Switch",
        
        upgrade: "Illicit",
        points: 2,
    },
    {
        name: "Feedback Array",
        
        upgrade: "Illicit",
        points: 2,
    },
    {
        name: '"Hot Shot" Blaster',
        
        upgrade: "Illicit",
        points: 3,
        attack: 3,
        range: "1-2",
    },
    {
        name: "Greedo",
        
        unique: true,
        upgrade: "Crew",
        
        points: 1,
    },
    {
        name: "Salvaged Astromech",
        
        upgrade: "Salvaged Astromech",
        points: 2,
    },
    {
        name: "Bomb Loadout",
        
        limited: true,
        upgrade: "Torpedo",
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: '"Genius"',
        
        unique: true,
        upgrade: "Salvaged Astromech",
        points: 0,
    },
    {
        name: "Unhinged Astromech",
        
        upgrade: "Salvaged Astromech",
        points: 1,
    },
    {
        name: "R4-B11",
        
        unique: true,
        upgrade: "Salvaged Astromech",
        points: 3,
    },
    {
        name: "Autoblaster Turret",
        
        upgrade: "Turret",
        points: 2,
        attack: 2,
        range: "1",
    },
    {
        name: "R4 Agromech",
        
        upgrade: "Salvaged Astromech",
        points: 2,
    },
    {
        name: "K4 Security Droid",
        
        upgrade: "Crew",
        
        points: 3,
    },
    {
        name: "Outlaw Tech",
        
        limited: true,
        upgrade: "Crew",
        
        points: 2,
    },
    {
        name: 'Advanced Targeting Computer',
        
        
        upgrade: "System",
        points: 5,
        ship: "TIE Advanced",
    },
    {
        name: 'Ion Cannon Battery',
        
        upgrade: "Hardpoint",
        points: 6,
        energy: 2,
        attack: 4,
        range: "2-4",
    },
];

var MODS=[
    {
        name: "Stealth Device",
        
        points: 3,
    },
    {
        name: "Shield Upgrade",
        
        points: 4,
    },
    {
        name: "Engine Upgrade",
        
        points: 4,
    },
    {
        name: "Anti-Pursuit Lasers",
        
        points: 2,
    },
    {
        name: "Targeting Computer",
        
        points: 2,
    },
    {
        name: "Hull Upgrade",
        
        points: 3,
    },
    {
        name: "Munitions Failsafe",
        
        points: 1,
    },
    {
        name: "Stygium Particle Accelerator",
        
        points: 2,
    },
    {
        name: "Advanced Cloaking Device",
        
        points: 4,
        ship: "TIE Phantom",
    },
    {
        name: "Combat Retrofit",
        
        points: 10,
        ship: "GR-75 Medium Transport",
        huge: true,
    },
    {
        name: "B-Wing/E2",
        
        points: 1,
        ship: "B-Wing",

    },
    {
        name: "Countermeasures",
        
        points: 3,
    },
    {
        name: "Experimental Interface",
        
        unique: true,
        points: 3,
    },
    {
        name: "Tactical Jammer",
        
        points: 1,
    },
    {
        name: "Autothrusters",
        
        points: 2,
    },
    ,
];

var TITLES= [
    {
        name: "Slave I",
        
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: "Millennium Falcon",
        
        unique: true,
        points: 1,
        ship: "YT-1300",
        actions: "Evade",
    },
    {
        name: "Moldy Crow",
        
        unique: true,
        points: 3,
        ship: "HWK-290",
    },
    {
        name: "ST-321",
        
        unique: true,
        points: 3,
        ship: "Lambda-Class Shuttle",
    },
    {
        name: "Royal Guard TIE",
        
        points: 0,
        ship: "TIE Interceptor",
    },
    {
        name: "Dodonna's Pride",
        
        unique: true,
        points: 4,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "A-Wing Test Pilot",
        
        points: 0,
        ship: "A-Wing",
        special_case: "A-Wing Test Pilot",
    },
    {
        name: "Tantive IV",
        
        unique: true,
        points: 4,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "Bright Hope",
        
        energy: "+2",
        unique: true,
        points: 5,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Quantum Storm",
        
        energy: "+1",
        unique: true,
        points: 4,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Dutyfree",
        
        energy: "+0",
        unique: true,
        points: 2,
        ship: "GR-75 Medium Transport",
    },
    {
        name: "Jaina's Light",
        
        unique: true,
        points: 2,
        ship: "CR90 Corvette (Fore)",
    },
    {
        name: "Outrider",
        
        unique: true,
        points: 5,
        ship: "YT-2400",
    },
    {
        name: "Dauntless",
        
        unique: true,
        points: 2,
        ship: "VT-49 Decimator",
    },
    {
        name: "Virago",
        
        unique: true,
        points: 1,
        ship: "StarViper",
    },
    {
        name: '"Heavy Scyk" Interceptor (Cannon)',
        
        
        points: 2,
        ship: "M3-A Interceptor",

    },
    {
        name: '"Heavy Scyk" Interceptor (Torpedo)',
        
        
        points: 2,
        ship: "M3-A Interceptor",
    },
    {
        name: '"Heavy Scyk" Interceptor (Missile)',
        
        
        points: 2,
        ship: "M3-A Interceptor",
    },
    {
        name: 'IG-2000',
        
        points: 0,
        ship: "Aggressor",
    },
    {
        name: "BTL-A4 Y-Wing",
        
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "Andrasta",
        
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: 'TIE/x1',
        
        points: 0,
        ship: "TIE Advanced",
    },
];

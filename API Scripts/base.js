/*jshint esversion: 6 */
//credit to Brian on the forums for this framework!
function ManhDist(token1,token2) { //Manhattan Distance in tiles between two units
    let AXCoord = token1.get("left");
    let AYCoord = token1.get("top");
    let BXCoord = token2.get("left");
    let BYCoord = token2.get("top");
    let diff = parseInt((Math.abs(AXCoord - BXCoord))+(Math.abs(AYCoord - BYCoord)));
    return (diff/70)
};

on('chat:message', function(msg) {
    if (msg.type != 'api') return;
    var parts = msg.content.split(' ');
    var command = parts.shift().substring(1);
    var turnorder;
    var turncounter;
    if (Campaign().get("turnorder") == "") turnorder = [];
    else turnorder = JSON.parse(Campaign().get("turnorder"));
    for (i in turnorder){
        if (turnorder[i].custom == "Turn Counter"){
            turncounter = turnorder[i]
        }
    }

    let n;
    if (turncounter != undefined){
        n = turncounter.pr;
    } else {
        n = 0
    }

    //log(turncounter)

    // Don't run if it's any other command
    if (command == 'combat') {
        if (parts.length < 2) {
            sendChat('SYSTEM', 'You must provide a selected token id and a target token id.');
            return;
        }

        var selectedId = parts[0];
        var targetId = parts[1];

        // Grab tokens
        var selectedToken = getObj('graphic', selectedId);
        var targetToken = getObj('graphic', targetId);

        // Check if the objects aren't tokens or if the passed parameters aren't ids
        if (!selectedToken) {
            sendChat('SYSTEM', 'Selected token id not provided.');
            return;
        }
        if (!targetToken) {
            sendChat('SYSTEM', 'Target token id not provided.');
            return;
        }
        log(selectedToken.get('represents'));
        log(targetToken.get('represents'));
        //Check to make sure that the tokens represent characters
        if (selectedToken.get('represents') === "" || targetToken.get('represents') === ""){
            sendChat('SYSTEM', 'Both tokens must be linked to characters in the journal!');
            return;
        }

        // Get a variable to use as the "who" for sendChat
        var who = getObj('character', selectedToken.get('represents'));
        if (!who) {
            who = selectedToken.get('name');
        } else {
            who = 'character|' + who.id;
        }
        var who2 = getObj('character', targetToken.get('represents'));
        if (!who2) {
            who2 = targetToken.get('name');
        } else {
            who2 = 'character|' + who2.id;
        }
        var attacker = getObj('character', selectedToken.get('represents'));
        var defender = getObj('character', targetToken.get('represents'));
        let AName = attacker.get('name');
        let DName = defender.get('name');
        let Chatstr = '';

        //Grab basic stats
        let CurrHPA = findObjs({ characterid: attacker.id, name: "HP_current"})[0];
        let CurrHPB = findObjs({ characterid: defender.id, name: "HP_current"})[0];
        let CurrEXP = findObjs({ characterid: attacker.id, name: "EXP"})[0];
        let LvA = findObjs({ characterid: attacker.id, name: "Level"})[0];
        let InLvA = Number(LvA.get("current"));
        let LvB = findObjs({ characterid: defender.id, name: "Level"})[0];
        let InLvB = Number(LvB.get("current"));
        let EXPA = Number(CurrEXP.get("current"));
        let IsPromoA = getAttrByName(attacker.id, 'isPromo');
        let IsPromoB = getAttrByName(defender.id, 'isPromo');
        let UACounterA = getAttrByName(attacker.id, 'UACounter');
        let UACounterB = getAttrByName(defender.id, 'UACounter');
        let HPA = Number(getAttrByName(attacker.id, 'hp_current'));
        let HPB = Number(getAttrByName(defender.id, 'hp_current'));
        let StrA = Number(getAttrByName(attacker.id, 'str_total'));
        let StrB = Number(getAttrByName(defender.id, 'str_total'));
        let MagA = Number(getAttrByName(attacker.id, 'mag_total'));
        let MagB = Number(getAttrByName(defender.id, 'mag_total'));
        let SklA = Number(getAttrByName(attacker.id, 'skl_total'));
        let SklB = Number(getAttrByName(defender.id, 'skl_total'));
        let SpdA = Number(getAttrByName(attacker.id, 'spd_total'));
        let SpdB = Number(getAttrByName(defender.id, 'spd_total'));
        let LckA = Number(getAttrByName(attacker.id, 'lck_total'));
        let LckB = Number(getAttrByName(defender.id, 'lck_total'));
        let DefA = Number(getAttrByName(attacker.id, 'def_total'));
        let DefB = Number(getAttrByName(defender.id, 'def_total'));
        let ResA = Number(getAttrByName(attacker.id, 'res_total'));
        let ResB = Number(getAttrByName(defender.id, 'res_total'));

        //Grab weapon stats
        let WNameA = getAttrByName(attacker.id, 'repeating_weapons_$0_WName') || "Empty";
        let WNameB = getAttrByName(defender.id, 'repeating_weapons_$0_WName') || "Empty";
        let WTypeA = getAttrByName(attacker.id, 'repeating_weapons_$0_WType') || "Stones/Other";
        let WTypeB = getAttrByName(defender.id, 'repeating_weapons_$0_WType') || "Stones/Other";
        let MtA = parseInt(getAttrByName(attacker.id, 'repeating_weapons_$0_Mt')) || 0;
        let MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Mt')) || 0;
        let WtA = parseInt(getAttrByName(attacker.id, 'repeating_weapons_$0_Wt')) || 0;
        let WtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
        let Range1A = parseInt(getAttrByName(attacker.id, 'repeating_weapons_$0_Range1')) || 1;
        let Range1B = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Range1')) || 1;
        let Range2A = parseInt(getAttrByName(attacker.id, 'repeating_weapons_$0_Range2')) || 1;
        let Range2B = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Range2')) || 1;
        let WRankA = getAttrByName(attacker.id, 'repeating_weapons_$0_WRank') || "E";
        let WRankB = getAttrByName(defender.id, 'repeating_weapons_$0_WRank') || "E";
        let fIDA = getAttrByName(attacker.id, 'fid')|| ""
        let fIDB = getAttrByName(defender.id, 'fid')|| ""
        log(fIDA)
        log(fIDB)
        let UsesA;
        let UsesB;
        let AOEA = getAttrByName(attacker.id, "repeating_weapons_$0_AOE");
        let AOEB = getAttrByName(defender.id, "repeating_weapons_$0_AOE");
        log("AOE is " + AOEA)
        log("AOE is " + AOEB)
        //check for no rows
        if (fIDA == ""){
            UsesA = 68932;
            log("No weapon! :0");
        } else {
            UsesA = findObjs({ characterid: attacker.id, name: "repeating_weapons_"+fIDA+"_Uses"},{ caseInsensitive: true })[0];
        }
        if (fIDB == ""){
            UsesB = 68932;
        } else {
            UsesB = findObjs({ characterid: defender.id, name: "repeating_weapons_"+fIDB+"_Uses"},{ caseInsensitive: true })[0];
        }
        log(UsesA);
        log(UsesB);
        let StrengthsA = getAttrByName(attacker.id, "repeating_weapons_$0_Strengths") || "";
        let StrengthsB = getAttrByName(defender.id, "repeating_weapons_$0_Strengths") || "";
        let WeaknessA = getAttrByName(attacker.id, 'weaknesses');
        let WeaknessB = getAttrByName(defender.id, 'weaknesses');
        //Weapon exp
        let SwordEXP = findObjs({ characterid: attacker.id, name: "SwordEXP", type: "attribute"})[0];
        let LanceEXP = findObjs({ characterid: attacker.id, name: "LanceEXP", type: "attribute"})[0];
        let AxeEXP = findObjs({ characterid: attacker.id, name: "AxeEXP", type: "attribute"})[0];
        let BowEXP = findObjs({ characterid: attacker.id, name: "BowEXP", type: "attribute"})[0];
        let DaggerEXP = findObjs({ characterid: attacker.id, name: "GunEXP", type: "attribute"})[0];
        let GunEXP = findObjs({ characterid: attacker.id, name: "GunEXP", type: "attribute"})[0];
        let DarkEXP = findObjs({ characterid: attacker.id, name: "DarkEXP", type: "attribute"})[0];
        let LightEXP = findObjs({ characterid: attacker.id, name: "LightEXP", type: "attribute"})[0];
        let AnimaEXP = findObjs({ characterid: attacker.id, name: "AnimaEXP", type: "attribute"})[0];
        let StoneEXP = findObjs({ characterid: attacker.id, name: "StoneEXP", type: "attribute"})[0];
        let StaffEXP = findObjs({ characterid: attacker.id, name: "StaffEXP", type: "attribute"})[0];

        //Hit/crit/avo/dod
        let HitA = getAttrByName(attacker.id, 'hit');
        let HitB = getAttrByName(defender.id, 'hit');
        let CritA = getAttrByName(attacker.id, 'crit');
        let CritB = getAttrByName(defender.id, 'crit');
        let AvoA = getAttrByName(attacker.id, 'avo');
        let AvoB = getAttrByName(defender.id, 'avo');
        let DdgA = getAttrByName(attacker.id, 'lck_total');
        let DdgB = getAttrByName(defender.id, 'lck_total');
        let DmgmodA = Number(getAttrByName(attacker.id, 'Dmgmod'));
        let DmgmodB = Number(getAttrByName(defender.id, 'Dmgmod'));

        //Grab weapon ranks
        let SwordUA = getAttrByName(attacker.id, 'SwordU');
        let LanceUA = getAttrByName(attacker.id, 'LanceU');
        let AxeUA = getAttrByName(attacker.id, 'AxeU');
        let BowUA = getAttrByName(attacker.id, 'BowU');
        let DaggerUA = getAttrByName(attacker.id, 'DaggerU');
        let GunUA = getAttrByName(attacker.id, 'GunU');
        let AnimaUA = getAttrByName(attacker.id, 'AnimaU');
        let LightUA = getAttrByName(attacker.id, 'LightU');
        let DarkUA = getAttrByName(attacker.id, 'DarkU');
        let StoneUA = getAttrByName(attacker.id, 'StoneU');
        let StaffUA = getAttrByName(attacker.id, 'StaffU');

        let SwordUB = getAttrByName(defender.id, 'SwordU');
        let LanceUB = getAttrByName(defender.id, 'LanceU');
        let AxeUB = getAttrByName(defender.id, 'AxeU');
        let BowUB = getAttrByName(defender.id, 'BowU');
        let DaggerUB = getAttrByName(defender.id, 'DaggerU');
        let GunUB = getAttrByName(defender.id, 'GunU');
        let AnimaUB = getAttrByName(defender.id, 'AnimaU');
        let LightUB = getAttrByName(defender.id, 'LightU');
        let DarkUB = getAttrByName(defender.id, 'DarkU');
        let StoneUB = getAttrByName(defender.id, 'StoneU');
        let StaffUB = getAttrByName(defender.id, 'StaffU');

        const PhysWepTypes = ["Sword/Katana","Lance/Nagin.","Axe/Club","Bow/Yumi","Dagger/Shurik.","Stones/Other"];
        const MWepTypes = ["Anima Magic","Light Magic","Dark Magic"];
        const WepTypes = ["Sword/Katana","Lance/Nagin.","Axe/Club","Bow/Yumi","Dagger/Shurik.","Firearm/Taneg.","Anima Magic","Light Magic","Dark Magic","Stones/Other","Staves/Rods"];
        const MagWeps = ["Levin Sword","Bolt Naginata","Bolt Axe","Shining Bow","Flame Shuriken"];
        const PhysWeps = ["Flame Glaive","Light Rapier","Shadow Hammer"];
        const WepRanks = [SwordEXP,LanceEXP,AxeEXP,BowEXP,DaggerEXP,GunEXP,AnimaEXP,LightEXP,DarkEXP,StoneEXP,StaffEXP];
        const WepUA = [SwordUA,LanceUA,AxeUA,BowUA,DaggerUA,GunUA,AnimaUA,LightUA,DarkUA,StoneUA,StaffUA];
        const WepUB = [SwordUB,LanceUB,AxeUB,BowUB,DaggerUB,GunUB,AnimaUB,LightUB,DarkUB,StoneUB,StaffUB];
        let DmgtypeA;
        let DmgtypeB;
        let DmgA;
        let DmgB;
        let DoubleA = false;
        let DoubleB = false;
        let QuadA = false;
        let QuadB = false;
        let hasCritA = false;
        let hasCritB = false;
        let CanAttackA = true;
        let CanAttackB = true;

        let SkillsA = findObjs({ characterid: attacker.id, type: "ability"});
        let SkillsB = findObjs({ characterid: defender.id, type: "ability"});

        //Weapon Rank threshold values
        let WRankA_num;
        let WRankB_num;
        const LRanks = [{num: 0, rank: "E"},{num: 30, rank: "D"},{num: 70, rank: "C"},{num: 120, rank: "B"},{num: 180, rank: "A"},{num: 250, rank: "S"},{num: 999, rank: "UU"}];
        //check for which rank
        for (var h in LRanks){
            if (LRanks[h].rank == WRankA){
                WRankA_num = LRanks[h].num;
            }
        }
        for (var j in LRanks){
            if (LRanks[j].rank == WRankB){
                WRankB_num = LRanks[j].num;
            }
        }
        log("Numerical weapon rank is " + WRankA_num);
        //Check to see if the weapon is usable
        if ((WepUA[WepTypes.indexOf(WTypeA)] == 1) && (WepRanks[WepTypes.indexOf(WTypeA)].get("current") >= WRankA_num)){
            log("Attacker's weapon is usable!");
        } else {
            log("Attacker's weapon is not usable!");

            CanAttackA = false;
        }
        if ((WepUB[WepTypes.indexOf(WTypeB)] == 1) && (WepRanks[WepTypes.indexOf(WTypeB)].get("current") >= WRankB_num)){
            log("Defender's weapon is usable!");
        } else {
            log("Defender's weapon is not usable!");
            CanAttackB = false;
        }

        //unarmed counter checking
        if ((UsesA == undefined) && (UACounterA == false)){
            CanAttackA = false
        }
        if ((UsesB == undefined) && (UACounterB == false)){
            CanAttackB = false
        }

        let effectiveA;
        let effectiveB;
        //Check for weapon effectiveness- HAS TO BE BEFORE stat targeting calcs so it can factor in Mt.
        if ( ((SkillsA.filter(e => e.get("name") === 'Beastbane').length > 0) && WeaknessB.includes("Beast")) || ((SkillsA.filter(e => e.get("name") === 'Golembane').length > 0) && WeaknessB.includes("Construct")) || ( StrengthsA.includes("Beast") && WeaknessB.includes("Beast")) || ( StrengthsA.includes("Flier") && WeaknessB.includes("Flier")) || ( StrengthsA.includes("Dragon") && WeaknessB.includes("Dragon")) || ( StrengthsA.includes("Armor") && WeaknessB.includes("Armor")) || ( StrengthsA.includes("Monster") && WeaknessB.includes("Monster")) ){
            MtA *= 3;
            effectiveA = true;
        }
        if ( ((SkillsB.filter(e => e.get("name") === 'Beastbane').length > 0) && WeaknessA.includes("Beast")) || ((SkillsA.filter(e => e.get("name") === 'Golembane').length > 0) && WeaknessB.includes("Construct")) || ( StrengthsB.includes("Beast") && WeaknessA.includes("Beast")) || ( StrengthsB.includes("Flier") && WeaknessA.includes("Flier")) || ( StrengthsB.includes("Dragon") && WeaknessA.includes("Dragon")) || ( StrengthsB.includes("Armor") && WeaknessA.includes("Armor")) || ( StrengthsB.includes("Monster") && WeaknessA.includes("Monster")) ){
            MtB *= 3;
            effectiveB = true;
        }

        //Targeted stat
        if ( (PhysWepTypes.includes(WTypeA))||(PhysWeps.includes(WNameA)) ){
            DmgtypeA = "Physical";
            DmgA = (StrA + MtA) - DefB;
        } else if ( (MWepTypes.includes(WTypeA))||(MagWeps.includes(WNameA)) ){
            DmgtypeA = "Magical";
            DmgA = (MagA + MtA) - ResB;
        }
        else if (WTypeA == "Firearm/Taneg.") {
            DmgtypeA = "Firearm";
            DmgA = MtA - DefB;
        } else {
            DmgtypeA = "Healing";
            DmgA = 0;
            Chatstr += "Unit cannot attack!";
            sendChat("System","Unit cannot attack!");
            return;
        }
        if (DmgA < 0){
            DmgA = 0;
        }
        DmgA += DmgmodA;
        //dark magic vs. tome bonuses
        if ((WTypeA == "Dark Magic") && (MagWeps.includes(WTypeB))){
            DmgA += 4
        }

        log(DmgtypeA);
        log(DmgA);
        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
            DmgtypeB = "Physical";
            DmgB = (StrB + MtB) - DefA;
        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
            DmgtypeB = "Magical";
            DmgB = (MagB + MtB) - ResA;
        } else if (WTypeB == "Firearm/Taneg."){
            DmgtypeB = "Firearm";
            DmgB = MtB - DefA;
        } else {
            DmgtypeB = "Healing";
            DmgB = 0; //Set damage to 0 so you don't accidentally heal the enemy;
            CanAttackB = false;
        }
        if (DmgB < 0){
            DmgB = 0;
        }
        DmgB += DmgmodB
        if ((WTypeB == "Dark Magic") && (MagWeps.includes(WTypeA))){
            DmgB += 4
        }
        //check for doubling/braves
        if ( (SpdA - WtA) - (SpdB - WtB) >= 5 ||  WNameA.toLowerCase().includes("brave")){
            DoubleA = true;
            log("Attacker can double!");
            if ( (SpdA - WtA) - (SpdB - WtB) >= 5 &&  WNameA.toLowerCase().includes("brave")){
                QuadA = true;
                log("Attacker can quad!");
            }
        }
        log("AS is " + ((SpdA - WtA) - (SpdB - WtB)))
        if ( (SpdB - WtB) - (SpdA - WtA) >= 5 ||  WNameB.toLowerCase().includes("brave")){
            DoubleB = true;
            log("Defender can double!");
            if ( (SpdB - WtB) - (SpdA - WtA) >= 5 &&  WNameB.toLowerCase().includes("brave")){
                QuadB = true;
                log("Defender can quad!");
            }
        }

        //Check for WTA
        let WIndexA = WepTypes.indexOf(WTypeA)+ 1;
        let WIndexB = WepTypes.indexOf(WTypeB)+ 1;
        let WIN = WepTypes.indexOf(WTypeA);
        let CurrWR = WepRanks[WIN];
        let CWRVal = Number(CurrWR.get("current")); //Assume number because it's a numerical input
        let WTAA;
        let WTAB;
        log(CurrWR);
        log(CWRVal);
        if( (WIndexA == 1 && WIndexB == 3) || (WIndexA == 3 && WIndexB == 2) || (WIndexA == 2 && WIndexB == 1) || (WIndexA == 4 && WIndexB == 5) || (WIndexA == 5 && WIndexB == 6) || (WIndexA == 6 && WIndexB == 4) || (WIndexA == 7 && WIndexB == 8) || (WIndexA == 8 && WIndexB == 9) || (WIndexA == 9 && WIndexB == 7)) {
            DmgA +=1;
            HitA +=15;
            DmgB -= 1;
            HitB -=15;
            WTAA = true;
        }
        if( (WIndexA == 3 && WIndexB == 1) || (WIndexA == 2 && WIndexB == 3) || (WIndexA == 1 && WIndexB == 2) || (WIndexA == 5 && WIndexB == 4) || (WIndexA == 6 && WIndexB == 5) || (WIndexA == 4 && WIndexB == 6) || (WIndexA == 8 && WIndexB == 7) || (WIndexA == 9 && WIndexB == 8) || (WIndexA == 7 && WIndexB == 9)) {
            DmgA -=1;
            HitA -=15;
            DmgB += 1;
            HitB +=15;
            WTAB = true;
        }
        if (DmgA < 0){
            DmgA = 0;
        }
        if (DmgB < 0){
            DmgB = 0;
        }
        if (typeof(UsesA) == "object"){
            function DecUsesA() {
                UsesA.setWithWorker({current: Number(UsesA.get("current")) - 1});
            }
            log("Is an object!");
        } else {
            log("Not an object!");
            function DecUsesA() {
                UsesA -= 1;
            }
        }
        if (typeof(UsesB) == "object"){
            function DecUsesB() {
                UsesB.setWithWorker({current: Number(UsesB.get("current")) - 1});
            }
            log("Is an object!");
        } else {
            log("Not an object!");
            function DecUsesB() {
                UsesB -= 1;
            }
        }

        for (var i in SkillsA){
            SkillsA[i] = SkillsA[i].get("action");
            if (SkillsA[i] != ""){
                SkillsA[i] = JSON.parse(SkillsA[i])
            }
        }
        log(SkillsA)

        for (var i in SkillsB){
            SkillsB[i] = SkillsB[i].get("action");
            if (SkillsB[i] != ""){
                SkillsB[i] = JSON.parse(SkillsB[i])
            }
        }
        log(SkillsB)
        //Skills system! :^)
        /*Here is an example of Speedtaker so I don't have to keep checking back to see what I used:
        {
        "name": "Speedtaker",
	    "triggertime": "before",
	    "u_wepreq": ["Sword/Katana","Lance/Nagin.","Axe/Club","Bow/Yumi","Dagger/Shurik.","Firearm/Taneg.","Anima Magic","Light Magic","Dark Magic","Stones/Other","Staves/Rods"],
	    "e_wepreq": ["Sword/Katana","Lance/Nagin.","Axe/Club","Bow/Yumi","Dagger/Shurik.","Firearm/Taneg.","Anima Magic","Light Magic","Dark Magic","Stones/Other","Staves/Rods"],
	    "whotriggered": "either",
	    "radius_effect": "none",
	    "physmagcond": false,
        "killcond": true,
        "rng": "any",
        "rngmod": "none",
   	    "u_healfactor": 0,
	    "e_healfactor": 0,
	    "u_hitmod": 0,
    	"e_hitmod": 0,
    	"u_critmod": 0,
    	"e_critmod": 0,
    	"u_avomod": 0,
    	"e_avomod": 0,
    	"u_ddgmod": 0,
    	"e_ddgmod": 0,
    	"physmag": false,
       	"u_damagemod": "0",
        "e_damagemod": "0",
    	"u_stat_target": "Spd",
    	"e_stat_target": "none",
    	"u_stat_targetmod": "2",
    	"e_stat_targetmod": 0,
    	"children_skills": []
        }
        */
        //stat initializations- technically, these do nothing in the main function because ~block scope~
        let user;
        let RNGSklU;
        let RNGLuckU;
        let CurrHPU;
        let CurrHPE;
        let HPU;
        let HPE;
        let StrU;
        let StrE;
        let MagU;
        let MagE;
        let SklU;
        let SklE;
        let SpdU;
        let SpdE;
        let LckU;
        let LckE;
        let DefU;
        let DefE;
        let ResU;
        let ResE;
        let HitU;
        let HitE;
        let CritU;
        let CritE;
        let AvoU;
        let AvoE;
        let DdgU;
        let DdgE;
        let DmgU;
        let DmgE;
        let DmgtypeU;
        let DmgtypeE;
        let PhysmagU;
        let PhysmagE;
        let PhysmaginvU;
        let PhysmaginvE;
        let StattargetU;
        let StattargetE;
        let Dmg_U;
        let Dmg_E;
        let leveldiff = InLvB-InLvA;
        if (leveldiff < 0){
            leveldiff = 1;
        }
        let EXPAmod = (10 + (leveldiff*3));
        let WEXPA = 2;
        let none; //just in case something accidentally gets parsed

        function Skill(userid,targetid,obj,triggertime) { //haha END ME
        if (typeof obj != "object"){
            log("obj is not an object :(")
            return;
        }
        if ((triggertime == obj.triggertime) && (((obj.whotriggered == "attacker") && (userid == attacker.id)) || ((obj.whotriggered == "defender") && (userid == defender.id)) || (obj.whotriggered == "either"))) {
            log("Okay, first barrier passed")
            if ((userid == attacker.id) && (obj.u_wepreq.indexOf(WTypeA) != -1) && (obj.e_wepreq.indexOf(WTypeB) != -1)) {
                //obj.u_wepreq is a list of weapon types (to account for Aegis/Pavise & other similar skills)
                //just change "any" to a list of all weapon types, I guess
                log("Skill user is attacker");
                user = "attacker";
                RNGSklU = SklA;
                RNGLckU = LckA;
                CurrHPU = CurrHPA;
                CurrHPE = CurrHPB;
                DmgtypeU = DmgtypeA;
                DmgtypeE = DmgtypeB;
                Usertoken = selectedToken;
                Enemtoken = targetToken;
                Dmg_U = DmgA; //just for expressions'sake
                Dmg_E = DmgB;

            } else if ((userid == defender.id) && (obj.u_wepreq.indexOf(WTypeB) != -1) && (obj.e_wepreq.indexOf(WTypeA) != -1)) {
                user = "defender";
                log("Skill user is defender")
                RNGSklU = SklB;
                RNGLckU = LckB;
                CurrHPU = CurrHPB;
                CurrHPE = CurrHPA;
                DmgtypeU = DmgtypeB;
                DmgtypeE = DmgtypeA;
                Usertoken = targetToken;
                Enemtoken = selectedToken;
                Dmg_U = DmgB; //just for expressions'sake
                Dmg_E = DmgA;

            } else {
                log("You probably don't have the right weapons")
                return;
            }
            log("userid is" + userid)
            log("targetid is " + targetid)
            log("DamageU is" + Dmg_U);
            log(CurrHPU);
            log(CurrHPE);
            //stat definitions
            HPU = findObjs({
                characterid: userid,
                name: "HP_bd"
            })[0];
            HPE = findObjs({
                characterid: targetid,
                name: "HP_bd"
            })[0];
            StrU = findObjs({
                characterid: userid,
                name: "Str_bd"
            })[0];
            StrE = findObjs({
                characterid: targetid,
                name: "Str_bd"
            })[0];
            MagU = findObjs({
                characterid: userid,
                name: "Mag_bd"
            })[0];
            MagE = findObjs({
                characterid: targetid,
                name: "Mag_bd"
            })[0];
            SklU = findObjs({
                characterid: userid,
                name: "Skl_bd"
            })[0];
            SklE = findObjs({
                characterid: targetid,
                name: "Skl_bd"
            })[0];
            SpdU = findObjs({
                characterid: userid,
                name: "Spd_bd"
            })[0];
            SpdE = findObjs({
                characterid: targetid,
                name: "Spd_bd"
            })[0];
            LckU = findObjs({
                characterid: userid,
                name: "Lck_bd"
            })[0];
            LckE = findObjs({
                characterid: targetid,
                name: "Lck_bd"
            })[0];
            DefU = findObjs({
                characterid: userid,
                name: "Def_bd"
            })[0];
            DefE = findObjs({
                characterid: targetid,
                name: "Def_bd"
            })[0];
            ResU = findObjs({
                characterid: userid,
                name: "Res_bd"
            })[0];
            ResE = findObjs({
                characterid: targetid,
                name: "Res_bd"
            })[0];

            log(ResE);

            //nice stat-variables for use in expressions and such
            let HP_StatU = getAttrByName(userid, 'hp_total');
            let HP_StatE = getAttrByName(targetid, 'hp_total');
            let HP_CurrU = getAttrByName(userid, 'hp_current');
            let HP_CurrE = getAttrByName(targetid, 'hp_current');
            let Str_StatU = getAttrByName(userid, 'str_total');
            let Str_StatE = getAttrByName(targetid, 'str_total');
            let Mag_StatU = getAttrByName(userid, 'mag_total');
            let Mag_StatE = getAttrByName(targetid, 'mag_total');
            let Skl_StatU = getAttrByName(userid, 'skl_total');
            let Skl_StatE = getAttrByName(targetid, 'skl_total');
            let Spd_StatU = getAttrByName(userid, 'spd_total');
            let Spd_StatE = getAttrByName(targetid, 'spd_total');
            let Lck_StatU = getAttrByName(userid, 'lck_total');
            let Lck_StatE = getAttrByName(targetid, 'lck_total');
            let Def_StatU = getAttrByName(userid, 'def_total');
            let Def_StatE = getAttrByName(targetid, 'def_total');
            let Res_StatU = getAttrByName(userid, 'res_total');
            let Res_StatE = getAttrByName(targetid, 'res_total');

            let rng;
            if (obj.rng == "Skill") {
                rng = RNGSklU;
            }
            if (obj.rng == "Luck") {
                rng = RNGLckU;
            }
            if ((obj.customcond != "none") && (eval(obj.customcond) != true)){
                return;
            }
            if ((obj.turncond != "none") && (eval(obj.turncond) != true)){
                return;
            }
            log(obj.rng)

            //actual skill function
            function skillMain(){
                //PhysmagE
                if (DmgtypeE == "Physical" || DmgtypeE == "Firearm") {
                    PhysmagE = getAttrByName(targetid, "str_total");
                    PhysmaginvE = getAttrByName(targetid, "mag_total"); //inv for stuff like Ignis
                    log(targetid)
                } else {
                    PhysmagE = getAttrByName(targetid, "mag_total");
                    PhysmaginvE = getAttrByName(targetid, "str_total");
                } //I would add a def/res parameter, but I'm just going to be lazy and use the defense AND resistance definition for Luna.
                log("PhysmagE is " + PhysmagE)

                //PhysmagU
                if (DmgtypeU == "Physical" || DmgtypeU == "Firearm") {
                    PhysmagU = getAttrByName(userid, "str_total");
                    PhysmaginvU = getAttrByName(userid, "mag_total");
                    log(targetid)
                } else {
                    PhysmagU = getAttrByName(userid, "mag_total");
                    PhysmaginvU = getAttrByName(userid, "str_total");
                }
                log("PhysmagU is " + PhysmagU)


                /* Parse damage and HP modifiers- normally eval() is incredibly dangerous and
                usually Shouldn't Be Used Under Any Circumstance Ever, but the Roll20 API sandboxes it,
                so I think it should be alright. Oh well!*/
                let DamagemodU = eval(obj.u_damagemod);
                log("Damage mod is " + DamagemodU)
                let DamagemodE = eval(obj.e_damagemod);
                let HealmodU = parseInt(eval(obj.u_healfactor));
                let HealmodE = parseInt(eval(obj.e_healfactor));
                log("HealmodU is" + HealmodU)

                let statnames = ["HP", "Str", "Mag", "Skl", "Spd", "Lck", "Def", "Res"];
                log(obj.u_stat_target)
                log(obj.e_stat_target)
                //determining the actual stat target
                if (obj.u_stat_target || obj.e_stat_target != "none") {
                    for (var r in statnames) {
                        if (obj.u_stat_target == statnames[r] + "U") {
                            StattargetU = eval(statnames[r] + "U");
                        }
                        if (obj.e_stat_target == statnames[r] + "E") {
                            StattargetE = eval(statnames[r] + "E");
                        }
                    }
                }
                //for current HP-affecting skills
                if (obj.u_stat_target === "CurrHPU" || obj.u_stat_target === "CurrHPE"){
                    StattargetU = eval(obj.u_stat_target)
                }
                if (obj.e_stat_target === "CurrHPU" || obj.e_stat_target === "CurrHPE"){
                    StattargetE = eval(obj.e_stat_target);
                }

                let StattargetmodU = parseInt(eval(obj.u_stat_targetmod));
                let StattargetmodE = parseInt(eval(obj.e_stat_targetmod));
                log(StattargetE);
                log(StattargetmodE);

                if (obj.u_stat_target != "none" && StattargetU != undefined){
                    StattargetU.setWithWorker({
                        current: parseInt(StattargetU.get("current") + Number(StattargetmodU))
                    });
                    log("Set U-targeted stat to "+ StattargetU.get("current"));
                }

                if (obj.e_stat_target != "none" && StattargetE != undefined){
                    StattargetE.setWithWorker({
                        current: parseInt(StattargetE.get("current") + Number(StattargetmodE))
                    });
                    log("Set E-targeted stat to "+ StattargetE.get("current"));
                }

                if (userid == attacker.id) {
                    log("Damage before is " + DmgA)
                    DmgA += DamagemodU;
                    log("Damage after is " + DmgA)
                    DmgB += DamagemodE;
                    HitA += obj.u_hitmod;
                    HitB += obj.e_hitmod;
                    CritA += obj.u_critmod;
                    CritB += obj.e_critmod;
                    AvoA += obj.u_avomod;
                    AvoB += obj.e_avomod;
                    DdgA += obj.u_ddgmod;
                    DdgB += obj.e_ddgmod;
                    HPA = parseInt(HPA) + HealmodU; //this has to be here because sometimes it'll be stupid and overflow if it's not >:(
                    HPB = parseInt(HPB) + HealmodE;
                    EXPAmod *= obj.expmod_u;
                    WEXPA *= obj.wexpmod_u
                } else {
                    DmgB += DamagemodU;
                    DmgA += DamagemodE;
                    HitB += obj.u_hitmod;
                    HitA += obj.e_hitmod;
                    CritB += obj.u_critmod;
                    CritA += obj.e_critmod;
                    AvoB += obj.u_avomod;
                    AvoA += obj.e_avomod;
                    DdgB += obj.u_ddgmod;
                    DdgA += obj.e_ddgmod;
                    HPB = parseInt(HPB) + HealmodU;
                    HPA = parseInt(HPA) + HealmodE;
                }
                log(HPA)

                if (obj.radius != 0){
                    //tortured screaming
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken,token) > obj.radius || token.get("represents") == Usertoken.get("represents")) return false;
                        else return true;
                    });
                    log("Tokens in radius are: ")
                    for (var i in tokenInRadius){
                        log(tokenInRadius[i])
                        //stat targets
                        let char = tokenInRadius[i].get("represents")
                        let HPcurrC = findObjs({ characterid: char, name: "HP_current"})[0];
                        let StrC = findObjs({ characterid: char, name: "Str_bd"})[0];
                        let MagC = findObjs({ characterid: char, name: "Mag_bd"})[0];
                        let SklC = findObjs({ characterid: char, name: "Skl_bd"})[0];
                        let SpdC = findObjs({ characterid: char, name: "Spd_bd"})[0];
                        let LckC = findObjs({ characterid: char, name: "Lck_bd"})[0];
                        let DefC = findObjs({ characterid: char, name: "Def_bd"})[0];
                        let ResC = findObjs({ characterid: char, name: "Res_bd"})[0];
                        let HitC = findObjs({ characterid: char, name: "Hitmod"})[0];
                        let CritC = findObjs({ characterid: char, name: "Critmod"})[0];
                        let AvoC = findObjs({ characterid: char, name: "Avomod"})[0];
                        let DdgC = findObjs({ characterid: char, name: "Ddgmod"})[0];

                        //numerical stats
                        let HPcurrStat = getAttrByName(char, 'HP_current');
                        let StrStat = getAttrByName(char, 'Str_total');
                        let MagStat = getAttrByName(char, 'Mag_total');
                        let SklStat = getAttrByName(char, 'Skl_total');
                        let SpdStat = getAttrByName(char, 'Spd_total');
                        let LckStat = getAttrByName(char, 'Lck_total');
                        let DefStat = getAttrByName(char, 'Def_total');
                        let ResStat = getAttrByName(char, 'Res_total');
                        let HitStat = getAttrByName(char, 'Hit');
                        let CritStat = getAttrByName(char, 'Crit');
                        let AvoStat = getAttrByName(char, 'Avo');
                        let DdgStat = getAttrByName(char, 'Ddg');

                        effect = eval(obj.radius_effect); //effect MUST be an array!!!
                        rad_effect = Number(effect[0].get("current")) + parseInt(Number(effect[1]))

                        log(effect[0].get("current"))
                        effect[0].setWithWorker({
                            current: rad_effect
                        });
                        log(effect[0].get("current"))

                        if ((effect[0] == HPcurrC) && (char == attacker.id)){
                            HPA += parseInt(effect[1])
                        }

                        if ((effect[0] == HPcurrC) && (char == defender.id)){
                            HPB += parseInt(effect[1])
                        }
                    }
                }
                //recursionnn
                if (obj.children_skills != []){
                    for (var y in obj.children_skills){
                        Child_Skill = JSON.parse(obj.children_skills[y]);
                        Skill(userid, targetid, Child_Skill, "any"); //child implementations of preexisting skills should have the triggertime "any" as well
                    }
                }

                //Attack multiplier for stuff like Astra
                if (obj.attack_multiplier != 0){
                    if (userid == attacker.id){
                        for (i = 0; i < obj.attack_multiplier; i++){

                            if (randomInteger(100) < (HitA - AvoB)){
                                Chatstr += '<p style = "margin-bottom: 0px;">' + AName + " hits! </p>";
                                //Check if attack crits
                                if (randomInteger(100) < (CritA - DdgB)){
                                    DmgA *= 3;
                                    Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " crits! </p>";
                                    hasCritA = true;
                                }
                                //No AOE checking because that's stupidly broken. >:O
                                HPB -= DmgA;
                                log("Damage is " + DmgA);
                                CurrHPB.set("current", HPB);
                                CWRVal += 2;
                                CurrWR.set("current",CWRVal);
                                log("Incremented weapon EXP!");
                                DecUsesA();
                                log("Decreased weapon uses!");
                                if (hasCritA){
                                    DmgA /= 3;
                                    hasCritA = false;
                                }
                            } else {
                                Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " misses! </p>";
                            }

                        }

                        DoubleA = false;

                    }
                    else {
                        for (i = 0; i < obj.attack_multiplier; i++){
                            if (randomInteger(100) < (HitB - AvoA)){
                                Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " hits! </p>";
                                //Check if attack crits
                                if (randomInteger(100) < (CritB - DdgA)){
                                    DmgB *= 3;
                                    Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " crits!</p>";
                                    hasCritB = true;
                                }
                                HPA -= DmgB;
                                CurrHPA.set("current", HPA);
                                //Defender gets no WEXP to discourage turtling on EP
                                DecUsesB();
                                log("Decreased weapon uses!");
                                if (hasCritB){
                                    DmgB /= 3;
                                    hasCritB = false;
                                }
                            } else {
                                Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " misses! </p>";
                            }

                        }

                        DoubleB = false;

                    }
                }
                if (obj.custom_string != ""){
                    Chatstr += '<p><b style = "color: #4055df;">' + obj.custom_string + "</b></p>"
                } else {
                    Chatstr += '<p><b style = "color: #4055df;">' + obj.name + " activated!</b></p>"
                }
            }

            //more conditional checks
            if (obj.e_physmagcond != false){
                if ((obj.e_physmagcond == "Physical" && DmgtypeE == "Magical") || (obj.e_physmagcond == "Magical" && DmgtypeE == ("Physical" || "Firearm"))){
                    return;
                }
            }
            if (obj.u_physmagcond != false){
                if ((obj.u_physmagcond == "Physical" && DmgtypeU == "Magical") || (obj.u_physmagcond == "Magical" && DmgtypeU == ("Physical" || "Firearm"))){
                    return;
                }
            }
            if (obj.killcond == true){ //this should only be true if the triggertime is after
                if (CurrHPE.get("current") > 0){
                    return;
                }
            }

            if (obj.rng != "none") {
                if (randomInteger(100) < (rng * obj.rngmod)) {
                    skillMain();
                } else {
                    log("RIP RNG")
                    return;
                }

            } else { //Plain ol' skill trigger
                log("Regular skillmain")
                skillMain();
            }

        } else {
            log(triggertime + " vs " + obj.triggertime);
            log("Attacker id is " + attacker.id + "; Defender id is " + defender.id);
            log("Userid is" + userid);
            log("Whotriggered is " + obj.whotriggered);
            return;
        }}; //I know it looks weird, but don't touch this!

        //before triggers
        for (i in SkillsA){
            Skill(attacker.id, defender.id, SkillsA[i], "before");
        }
        for (i in SkillsB){
            Skill(defender.id, attacker.id, SkillsB[i], "before");
        }
        let diff = parseInt(ManhDist(selectedToken, targetToken));
        let dispHPA = HPA;
        let dispHPB = HPB;
        let dispDmgA = DmgA;
        let dispDmgB = DmgB;
        let dispHitA = HitA - AvoB
        let dispHitB = HitB - AvoA
        let dispCritA = CritA;
        let dispCritB = CritB;

        if (effectiveA){
            dispDmgA = '<span style = "color:green;">' + dispDmgA + '</span>'
        }
        if (effectiveB){
            dispDmgB = '<span style = "color:green;">' + dispDmgB + '</span>'
        }

        if (!(diff >= Range1A) && (diff <= Range2A)){
            CanAttackA = false;
        }

        if (!(diff >= Range1B) && (diff <= Range2B)){
            CanAttackB = false;
        }

        if (!CanAttackA){
            dispDmgA = "--"
            dispHitA = "--";
            dispCritA = "--"
        }
        if (!CanAttackB){
            dispDmgB = "--"
            dispHitB = "--";
            dispCritB = "--"
        }

        if (dispHitA > 100){
            dispHitA = 100
        }

        if (dispHitB > 100){
            dispHitB = 100
        }
        if (dispCritA > 100){
            dispCritA = 100
        }

        if (dispCritB > 100){
            dispCritB = 100
        }

        //Actual battle script
        //Check if attacker's attack hits/is in range
        log(diff + " tiles away!");
        let css = {
            attack: 'style = "color: #353535; border = 1px solid #353535;"'
        };
        let diffcheckA;
        let diffcheckB;
        log(diff + " " + Range1A);
        log(diff + " " + Range1B);
        if (CanAttackA == true) {
            if ((diff >= Range1A) && (diff <= Range2A)){
                log(Range1A + "-"+ Range2A)
                diffcheckA = true;
                if (randomInteger(100) < (HitA - AvoB)){
                    //Check if attack crits
                    if (randomInteger(100) < (CritA - DdgB)){
                        DmgA *= 3;
                        Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " crits for " + DmgA + " damage!</p>";
                        hasCritA = true;
                    } else {
                        Chatstr += '<p style = "margin-bottom: 0px;">' + AName + " hits for "+ DmgA + " damage!</p>";
                    }

                    //Battle skill trigger
                    for (i in SkillsA){
                        Skill(attacker.id, defender.id, SkillsA[i], "during");
                    }
                    for (i in SkillsB){
                        Skill(defender.id, attacker.id, SkillsB[i], "during");
                    }

                    HPB -= DmgA;
                    log("Damage is " + DmgA);
                    CurrHPB.set("current", HPB);
                    CWRVal += WEXPA;
                    CurrWR.set("current",CWRVal);
                    log("Incremented weapon EXP!");
                    DecUsesA();
                    log("Decreased weapon uses!");
                    if (hasCritA){
                        DmgA /= 3;
                        hasCritA = false;
                    }
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " misses! </p>";
                }

                //radius
                if (AOEA != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(targetToken,token) > AOEA || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgA;
                        let prov_MtA = parseInt(getAttrByName(attacker.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsA.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsA.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsA.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsA.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsA.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtA *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeA))||(PhysWeps.includes(WNameA)) ){
                            prov_DmgA = (StrA + MtA) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeA))||(MagWeps.includes(WNameA)) ){
                            prov_DmgA = (MagA + MtA) - res_ch;
                        }
                        else if (WTypeA == "Firearm/Taneg.") {
                            prov_DmgA = MtA - def_ch;
                        }
                        if (prov_DmgA < 0){
                            prov_DmgA = 0;
                        }
                        if (randomInteger(100) < (HitA - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgA
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ AName+ " hits " + char_name + " for " + prov_DmgA + " damage!</p>";
                        }
                    }
                }

            } else {
                Chatstr += '<p style = "margin-bottom: 0px;">' + AName + " is not in range! </p>";
            }
        } else {
            Chatstr += '<p style = "margin-bottom: 0px;">' + AName +" cannot attack!</p>";
        }

        if (CanAttackB == true){
            //Check if defender's attack hits
            if (((Range1B) <= (diff)) && ((diff) <= (Range2B))){
                diffcheckB = true;
                if (randomInteger(100) < (HitB - AvoA)){
                    //Check if attack crits
                    if (randomInteger(100) < (CritB - DdgA)){
                        DmgB *= 3;
                        Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " crits for " + DmgB + " damage!</p>";
                        hasCritB = true;
                    } else {
                        Chatstr += '<p style = "margin-bottom: 0px;">' + DName + " hits for "+ DmgB + " damage! </p>";
                    }

                    //battle skill trigger
                    for (i in SkillsB){
                        Skill(defender.id, attacker.id, SkillsB[i], "during");
                    }
                    for (i in SkillsA){
                        Skill(attacker.id, defender.id, SkillsA[i], "during");
                    }

                    HPA -= DmgB;
                    CurrHPA.set("current", HPA);
                    //Defender gets no WEXP to discourage turtling on EP
                    DecUsesB();
                    log("Decreased weapon uses!");
                    if (hasCritB){
                        DmgB /= 3;
                        hasCritB = false;
                    }
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " misses!</p>";
                }

                //radius
                if (AOEB != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEB || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }

            } else {
                Chatstr += '<p style = "margin-bottom: 0px;">' + DName + " is not in range!</p>";
            }
        } else {
            Chatstr += '<p style = "margin-bottom: 0px;">' + DName +" cannot attack!</p>";
        }

        //Attacker doubles; I don't think I should need to do usability checking for doubleattacking since it's checked within the battle calc
        if ((DoubleA === true) && (CanAttackA == true) && (diffcheckA == true)){
            //quadattacks
            if (randomInteger(100) < (HitA - AvoB)){
                //Check if attack crits
                if (randomInteger(100) < (CritA - DdgB)){
                    DmgA *= 3;
                    Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " crits for " + DmgA + " damage!</p>"
                    hasCritA = true;
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " hits for " + DmgA + " damage!</p>";
                }

                for (i in SkillsA){
                    Skill(attacker.id, defender.id, SkillsA[i], "during");
                }
                for (i in SkillsB){
                    Skill(defender.id, attacker.id, SkillsB[i], "during");
                }

                HPB -= DmgA;
                CurrHPB.set("current", HPB);
                CWRVal += WEXPA;
                CurrWR.set("current",CWRVal);
                log("Incremented weapon EXP!");
                DecUsesA();
                log("Decreased weapon uses!");
                if (hasCritA){
                    DmgA /= 3;
                    hasCritA = false;
                }
            } else {
                Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " misses!</p>";
            }
            //radius
            if (AOEA != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEA || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }

            if (QuadA === true){
                //tripleattacks
                if (randomInteger(100) < (HitA - AvoB)){
                    //Check if attack crits
                    if (randomInteger(100) < (CritA - DdgB)){
                        DmgA *= 3;
                        Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " crits for " + DmgA + " damage!</p>"
                        hasCritA = true;
                    } else {
                        Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " hits for " + DmgA + " damage!</p>"
                    }

                    for (i in SkillsA){
                        Skill(attacker.id, defender.id, SkillsA[i], "during");
                    }
                    for (i in SkillsB){
                        Skill(defender.id, attacker.id, SkillsB[i], "during");
                    }

                    HPB -= DmgA;
                    CurrHPB.set("current", HPB);
                    CWRVal += WEXPA;
                    CurrWR.set("current",CWRVal);
                    log("Incremented weapon EXP!");
                    DecUsesA();
                    log("Decreased weapon uses!");
                    if (hasCritA){
                        DmgA /= 3;
                        hasCritA = false;
                    }
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " misses!</p>";
                }
                //radius
                if (AOEA != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEA || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }

                //quadattacks
                if (randomInteger(100) < (HitA - AvoB)){
                    //Check if attack crits
                    if (randomInteger(100) < (CritA - DdgB)){
                        DmgA *= 3;
                        Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " crits for " + DmgA + " damage!</p>"
                        hasCritA = true;
                    } else {
                        Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " hits for " + DmgA + " damage!</p>";
                    }

                    for (i in SkillsA){
                        Skill(attacker.id, defender.id, SkillsA[i], "during");
                    }
                    for (i in SkillsB){
                        Skill(defender.id, attacker.id, SkillsB[i], "during");
                    }

                    HPB -= DmgA;
                    CurrHPB.set("current", HPB);
                    CWRVal += WEXPA;
                    CurrWR.set("current",CWRVal);
                    log("Incremented weapon EXP!");
                    DecUsesA();
                    log("Decreased weapon uses!");
                    if (hasCritA){
                        DmgA /= 3;
                        hasCritA = false;
                    }
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + AName+ " misses!</p>";
                }

                //radius
                if (AOEA != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEA || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }
                //
            }
        }

        //Defender doubles
        if ((DoubleB === true) && (CanAttackB == true) && (diffcheckB == true)){
            //doubleattacks
            if (randomInteger(100) < (HitB - AvoA)){
                //Check if attack crits
                if (randomInteger(100) < (CritB - DdgA)){
                    DmgB *= 3;
                    Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " crits for " + DmgB + " damage!</p>"
                    hasCritB = true;
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " hits for " + DmgB + " damage!</p>"
                }

                for (i in SkillsB){
                    Skill(defender.id, attacker.id, SkillsB[i], "during");
                }
                for (i in SkillsA){
                    Skill(attacker.id, defender.id, SkillsA[i], "during");
                }

                HPA -= DmgB;
                CurrHPA.set("current", HPA);
                DecUsesB();
                log("Decreased weapon uses!");
                if (hasCritB){
                    DmgB /= 3;
                    hasCritB = false;
                }
            } else {
                Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " misses!</p>";
            }
            //radius
            if (AOEB != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEB || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }

            if (QuadB === true){
                //tripleattack
                if (randomInteger(100) < (HitB - AvoA)){
                    //Check if attack crits
                    if (randomInteger(100) < (CritB - DdgA)){
                        DmgB *= 3;
                        Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " crits for " + DmgB + " damage!</p>"
                        hasCritB = true;
                    } else {
                        Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " hits for " + DmgB + " damage!</p>"
                    }

                    for (i in SkillsB){
                        Skill(defender.id, attacker.id, SkillsB[i], "during");
                    }
                    for (i in SkillsA){
                        Skill(attacker.id, defender.id, SkillsA[i], "during");
                    }

                    HPA -= DmgB;
                    CurrHPA.set("current", HPA);
                    DecUsesB();
                    log("Decreased weapon uses!");
                    if (hasCritB){
                        DmgB /= 3;
                        hasCritB = false;
                    }
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " misses!</p>";
                }
                //radius
                if (AOEB != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEB || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }

                //quad-attack
                if (randomInteger(100) < (HitB - AvoA)){
                    //Check if attack crits
                    if (randomInteger(100) < (CritB - DdgA)){
                        DmgB *= 3;
                        Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " crits for " + DmgB + " damage!</p>"
                        hasCritB = true;
                    } else {
                        Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " hits for " + DmgB + " damage!</p>"
                    }

                    for (i in SkillsB){
                        Skill(defender.id, attacker.id, SkillsB[i], "during");
                    }
                    for (i in SkillsA){
                        Skill(attacker.id, defender.id, SkillsA[i], "during");
                    }

                    //radius
                    if (AOEB != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEB || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }

                    HPA -= DmgB;
                    CurrHPA.set("current", HPA);
                    DecUsesB();
                    log("Decreased weapon uses!");
                    if (hasCritB){
                        DmgB /= 3;
                        hasCritB = false;
                    }
                } else {
                    Chatstr += '<p style = "margin-bottom: 0px;">' + DName+ " misses!</p>";
                }
                //radius
                if (AOEB != 0){
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(selectedToken,token) > AOEB || selectedToken.get("represents") == token.get("represents") || targetToken.get("represents") == token.get("represents") ) return false;
                        else return true;
                    });
                    for (i in tokenInRadius){
                        let char = tokenInRadius[i].get("represents");
                        let char_name = tokenInRadius[i].get("name");
                        let HPchar = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let def_ch = Number(getAttrByName(char, 'def_total'));
                        let res_ch = Number(getAttrByName(char, 'res_total'));
                        let weak_ch = getAttrByName(char, 'weaknesses');
                        let avo_ch = getAttrByName(char, 'avo');
                        let prov_DmgB;
                        let prov_MtB = parseInt(getAttrByName(defender.id, 'repeating_weapons_$0_Wt')) || 0;
                        if ( ( StrengthsB.includes("Beast") && weak_ch.includes("Beast")) || ( StrengthsB.includes("Flier") && weak_ch.includes("Flier")) || ( StrengthsB.includes("Dragon") && weak_ch.includes("Dragon")) || ( StrengthsB.includes("Armor") && weak_ch.includes("Armor")) || ( StrengthsB.includes("Monster") && weak_ch.includes("Monster")) ){
                            prov_MtB *= 3;
                        }
                        if ( (PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB)) ){
                            prov_DmgB = (StrB + MtB) - def_ch;
                        } else if ( (MWepTypes.includes(WTypeB))||(MagWeps.includes(WNameB)) ){
                            prov_DmgB = (MagB + MtB) - res_ch;
                        }
                        else if (WTypeB == "Firearm/Taneg.") {
                            prov_DmgB = MtB - def_ch;
                        }
                        if (prov_DmgB < 0){
                            prov_DmgB = 0;
                        }
                        if (randomInteger(100) < (HitB - avo_ch)){
                            HPchar.setWithWorker({
                                current: HPchar.get("current") - prov_DmgB
                            });
                            Chatstr += '<p style = "margin-bottom: 0px;">'+ DName+ " hits " + char_name + " for " + prov_DmgB + " damage!</p>";
                        }
                    }
                }

            }
        }
        //after triggers
        for (i in SkillsA){
            Skill(attacker.id, defender.id, SkillsA[i], "after");
        }
        for (i in SkillsB){
            Skill(defender.id, attacker.id, SkillsB[i], "after");
        }

        let timesA = "";
        let timesB = "";

        //for damage display
        if (DoubleA){
            timesA = " x 2"
            if (QuadA){
                timesA = " x 4"
            }
        }
        if (DoubleB){
            timesB = " x 2"
            if (QuadB){
                timesB = " x 4"
            }
        }
        if (WTAA){
            dispDmgA = dispDmgA+ '<span style = "color: blue;"> ↑</span>'
            dispDmgB = dispDmgB + '<span style = "color: red;"> ↓</span>'
        }
        if (WTAB){
            dispDmgA = dispDmgA + '<span style = "color: red;"> ↓</span>'
            dispDmgB = dispDmgB+ '<span style = "color: blue;"> ↑</span>'
        }

        //adapted from Ciorstaidh's Faerun Calendar css
        var divstyle = 'style="width: 189px; border: 1px solid #353535; background-color: #f3f3f3; padding: 5px; color: #353535;"'
        var tablestyle = 'style="text-align:center; margin: 0 auto; border-collapse: collapse; margin-top: 5px; border-radius: 2px"';
        var headstyle = 'style="color: #f3f3f3; font-size: 18px; text-align: left; font-variant: small-caps; background-color: #353535; padding: 4px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;"';
        var namestyle = 'style="background-color: #353535; color: #f3f3f3; text-align: center; font-weight: bold; overflow: hidden; margin: 4px; margin-right: 0px; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;"'
        var wrapperstyle = 'style="display: inline-block; padding:2px;"'
        var statdiv = 'style="border: 1px solid #353535; border-radius: 5px; overflow: hidden; text-align: center; display: inline-block; margin-left: 4px;"'
        var cellabel = 'style="background-color: #353535; color: #f3f3f3; font-weight: bold; padding: 2px;"'
        sendChat(who, '<div ' + divstyle + '>' + //--
                '<div ' + headstyle + '>Combat</div>' + //--
                '<div style = "margin: 0px auto; width: 100%; text-align: center;">' + //--
                '<div ' + wrapperstyle +'>' + //--
                    '<div ' + namestyle + '>'+ AName +'</div>' + //--
                    '<div ' + statdiv +'>' + //--
                        '<table>'+ //--
                            '<tr><td ' + cellabel +'> HP </td> <td style = "padding: 2px;">' + dispHPA + '</td></tr>' + //--
                            '<tr><td ' + cellabel +'> Dmg </td> <td style = "padding: 2px;">' + dispDmgA + timesA + '</td></tr>' + //--
                            '<tr><td ' + cellabel +'> Hit% </td> <td style = "padding: 2px;">' + dispHitA + '</td></tr>' + //--
                            '<tr><td ' + cellabel +'> Crit% </td> <td style = "padding: 2px;">' + dispCritA + '</td></tr>' + //--
                        '</table>'+ //--
                    '</div>' + //--
                '</div>' + //--

                '<div ' + wrapperstyle +'>' + //--
                    '<div ' + namestyle + '>'+ DName +'</div>' + //--
                    '<div ' + statdiv +'>' + //--
                        '<table>'+ //--
                            '<tr><td style = "padding: 2px;">' + dispHPB + '</td><td ' + cellabel +'> HP </td></tr>' + //--
                            '<tr><td style = "padding: 2px;">' + dispDmgB + timesB + '</td><td ' + cellabel +'> Dmg </td></tr>' + //--
                            '<tr><td style = "padding: 2px;">' + dispHitB  + '</td><td ' + cellabel +'> Hit% </td></tr>' + //--
                            '<tr><td style = "padding: 2px;">' + dispCritB + '</td><td ' + cellabel +'> Crit% </td></tr>' + //--
                        '</table>'+ //--
                    '</div>' + //--
                '</div>' + //--
                '</div>' + //--

                '<div style = "height: 1px; background-color: #353535; width: 70%; margin: 0 auto; margin-bottom: 4px;"></div>' + //--
                '<div style = "margin: 0 auto; width: 70%;">' + Chatstr + '</div>' + //--
            '</div>'
        );
        if (IsPromoA == true){
            InLvA += 20;
        }
        if (IsPromoB == true){
            InLvB += 20;
        }
        //Calculate EXP; commented out for the test
        EXPA += EXPAmod
        CurrEXP.set("current",EXPA);
        log(EXPA)
        if (CurrEXP.get("current") >= 100){
            CurrEXP.set("current",CurrEXP.get("current")-100);
            //Get growths
            LvA.set("current", parseInt(LvA.get("current")) + 1);
            let Lvstr = '';
            let HPG = Number(getAttrByName(attacker.id, 'hp_gtotal'));
            let StrG = Number(getAttrByName(attacker.id, 'str_gtotal'));
            let MagG = Number(getAttrByName(attacker.id, 'mag_gtotal'));
            let SklG = Number(getAttrByName(attacker.id, 'skl_gtotal'));
            let SpdG = Number(getAttrByName(attacker.id, 'spd_gtotal'));
            let LckG = Number(getAttrByName(attacker.id, 'lck_gtotal'));
            let DefG = Number(getAttrByName(attacker.id, 'def_gtotal'));
            let ResG = Number(getAttrByName(attacker.id, 'res_gtotal'));
            let growthslist = [HPG,StrG,MagG,SklG,SpdG,LckG,DefG,ResG];

            let HPi = Number(getAttrByName(attacker.id, 'hp_i'));
            let Stri = Number(getAttrByName(attacker.id, 'str_i'));
            let Magi = Number(getAttrByName(attacker.id, 'mag_i'));
            let Skli = Number(getAttrByName(attacker.id, 'skl_i'));
            let Spdi = Number(getAttrByName(attacker.id, 'spd_i'));
            let Lcki = Number(getAttrByName(attacker.id, 'lck_i'));
            let Defi = Number(getAttrByName(attacker.id, 'def_i'));
            let Resi = Number(getAttrByName(attacker.id, 'res_i'));
            let sprefix = [HPi,Stri,Magi,Skli,Spdi,Lcki,Defi,Resi];

            let HPSG = findObjs({ characterid: attacker.id, name: "HP_i", type: "attribute"})[0];
            let StrSG = findObjs({ characterid: attacker.id, name: "Str_i", type: "attribute"})[0];
            let MagSG = findObjs({ characterid: attacker.id, name: "Mag_i", type: "attribute"})[0];
            let SklSG = findObjs({ characterid: attacker.id, name: "Skl_i", type: "attribute"})[0];
            let SpdSG = findObjs({ characterid: attacker.id, name: "Spd_i", type: "attribute"})[0];
            let LckSG = findObjs({ characterid: attacker.id, name: "Lck_i", type: "attribute"})[0];
            let DefSG = findObjs({ characterid: attacker.id, name: "Def_i", type: "attribute"})[0];
            let ResSG = findObjs({ characterid: attacker.id, name: "Res_i", type: "attribute"})[0];
            let statslist = [HPSG,StrSG,MagSG,SklSG,SpdSG,LckSG,DefSG,ResSG];
            log(statslist);
            let slist = ["HP","Str","Mag","Skl","Spd","Lck","Def","Res"];
            for (var i = 0; i < growthslist.length - 1; i++){
                gi = growthslist[i];
                log(gi);
                if (randomInteger(100) < gi){
                    statslist[i].setWithWorker({current: sprefix[i] + 1});
                    if (gi > 100){
                        if (randomInteger(100) < (gi - 100)){
                            Lvstr += '<p style = "margin-bottom: 0px;"> + 2 to ' + slist[i] + "!</p>";
                            statslist[i].setWithWorker({current: sprefix[i] + 2});
                        } else{
                            Lvstr += '<p style = "margin-bottom: 0px;"> + 1 to '+ slist[i] + "!</p>";
                        }
                    } else {
                        Lvstr += '<p style = "margin-bottom: 0px;"> + 1 to '+ slist[i] + "!</p>";
                    }
                }
            }
            log(Lvstr);
            sendChat(who, '<div ' + divstyle + '>' + //--
                '<div ' + headstyle + '>Level Up</div>' + //--
                '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + Lvstr + '</div>' + //--
            '</div>'
            );
        }

    }
});

on("change:campaign:turnorder", function(turn) {
    var turnorder;
    var turncounter;
    if (Campaign().get("turnorder") == "") turnorder = [];
    else turnorder = JSON.parse(Campaign().get("turnorder"));
    for (var i in turnorder){
        if (turnorder[i].custom == "Turn Counter"){
            turncounter = turnorder[i]
        }
    }
    if (turnorder[0] !== turncounter){ //STRICT EQUALITY checking for if it's the turncounter's "turn"
        return;
    }

    let n;
    if (turncounter != undefined){
        n = turncounter.pr;
    } else {
        n = 0
    }

    log(n)
    Skills = filterObjs(function(obj) {
        if (obj.get('type') !== 'ability' || obj.get('action').indexOf('"triggertime": "turn"') == -1) return false;
        return obj;
    });
    log(Skills)
    if (Skills != []){
       for (i in Skills){
           let id = Skills[i].get('characterid');
           Skills[i] = JSON.parse(Skills[i].get("action"));
           Skills[i]["ID"] = id;
       }
    } else {
        return;
    }
    log(Skills)

    //Skills system, user-centric version
    let user;
        let RNGSklU;
        let RNGLuckU;
        let CurrHPU;
        let HPU;
        let StrU;
        let MagU;
        let SklU;
        let SpdU;
        let LckU;
        let DefU;
        let ResU;
        let HitU;
        let CritU;
        let AvoU;
        let DdgU;
        let DdgE;
        let DmgU;
        let DmgtypeU;
        let PhysmagU;
        let PhysmaginvU;
        let HPA;
        let CurrHPA;
        var divstyle = 'style="width: 189px; border: 1px solid #353535; background-color: #f3f3f3; padding: 5px; color: #353535;"'
        var tablestyle = 'style="text-align:center; margin: 0 auto; border-collapse: collapse; margin-top: 5px; border-radius: 2px"';
        var headstyle = 'style="color: #f3f3f3; font-size: 18px; text-align: left; font-variant: small-caps; background-color: #353535; padding: 4px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;"';
        var namestyle = 'style="background-color: #353535; color: #f3f3f3; text-align: center; font-weight: bold; overflow: hidden; margin: 4px; margin-right: 0px; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;"'
        var wrapperstyle = 'style="display: inline-block; padding:2px;"'
        var statdiv = 'style="border: 1px solid #353535; border-radius: 5px; overflow: hidden; text-align: center; display: inline-block; margin-left: 4px;"'
        var cellabel = 'style="background-color: #353535; color: #f3f3f3; font-weight: bold; padding: 2px;"'

        function Skill(userid, obj, triggertime) { //haha END ME
            if (typeof obj != "object") {
                log("obj is not an object :(")
                return;
            }
            if (obj.triggertime != "turn"){ //JUST making sure
                return;
            }
            //no whotriggered checking because it'll always be the attacker
            log("Okay, first barrier passed")
            user = "attacker";
            RNGSklU = Number(getAttrByName(userid, 'skl_total'));
            RNGLckU = Number(getAttrByName(userid, 'lck_total'));
            CurrHPU = findObjs({
                characterid: userid,
                name: "HP_current"
            })[0];
            let who = findObjs({ //get the first token on the page that represents the given user
                type: "character",
                id: userid
            })[0].get("name") || "User"
            HPA = Number(getAttrByName(userid, 'hp_current'));
            DmgtypeU = ""
            DmgtypeE = "" //doesn't matter since commands are non-combative anyways
            Usertoken = findObjs({ //get the first token on the page that represents the given user
                type: "graphic",
                subtype: "token",
                represents: userid
            })[0];
            //stat definitions
            HPU = findObjs({
                characterid: userid,
                name: "HP_bd"
            })[0];
            StrU = findObjs({
                characterid: userid,
                name: "Str_bd"
            })[0];
            MagU = findObjs({
                characterid: userid,
                name: "Mag_bd"
            })[0];
            SklU = findObjs({
                characterid: userid,
                name: "Skl_bd"
            })[0];
            SpdU = findObjs({
                characterid: userid,
                name: "Spd_bd"
            })[0];
            LckU = findObjs({
                characterid: userid,
                name: "Lck_bd"
            })[0];
            DefU = findObjs({
                characterid: userid,
                name: "Def_bd"
            })[0];
            ResU = findObjs({
                characterid: userid,
                name: "Res_bd"
            })[0];

            //nice stat-variables for use in expressions and such
            let HP_StatU = getAttrByName(userid, 'hp_total');
            let HP_CurrU = getAttrByName(userid, 'hp_current');
            let Str_StatU = getAttrByName(userid, 'str_total');
            let Mag_StatU = getAttrByName(userid, 'mag_total');
            let Skl_StatU = getAttrByName(userid, 'skl_total');
            let Spd_StatU = getAttrByName(userid, 'spd_total');
            let Lck_StatU = getAttrByName(userid, 'lck_total');
            let Def_StatU = getAttrByName(userid, 'def_total');
            let Res_StatU = getAttrByName(userid, 'res_total');

            let rng;
            if (obj.rng == "Skill") {
                rng = RNGSklU;
            }
            if (obj.rng == "Luck") {
                rng = RNGLckU;
            }
            if ((obj.customcond != "none") && (eval(obj.customcond) != true)) {
                return;
            }
            if ((obj.turncond != "none") && (eval(obj.turncond) != true)) {
                return;
            }
            log(obj.rng)

            //actual skill function
            function skillMain() {
                //No Physmag :O

                /* Parse damage and HP modifiers- normally eval() is incredibly dangerous and
                usually Shouldn't Be Used Under Any Circumstance Ever, but the Roll20 API sandboxes it,
                so I think it should be alright. Oh well!*/
                let HealmodU = parseInt(eval(obj.u_healfactor));
                log("HealmodU is" + HealmodU)

                let statnames = ["HP", "Str", "Mag", "Skl", "Spd", "Lck", "Def", "Res"];

                //determining the actual stat target
                if (obj.u_stat_target != "none") {
                    for (var r in statnames) {
                        if (obj.u_stat_target == statnames[r]) {
                            StattargetU = eval(statnames[r] + "U");
                        }
                    }
                }
                let StattargetmodU = eval(obj.u_stat_targetmod);

                if (obj.u_stat_target != "none") {
                    StattargetU.setWithWorker({
                        current: Number(StattargetU.get("current")) + Number(StattargetmodU)
                    });
                    log("Set targeted stat to " + StattargetU.get("current"));
                }

                HPA = parseInt(HPA) + HealmodU; //this has to be here because sometimes it'll be stupid and overflow if it's not >:(
                log(HPA)

                if (obj.radius != 0) {
                    //tortured screaming
                    let tokenInRadius = filterObjs(function(token) {
                        if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken, token) > obj.radius || token.get("represents") == Usertoken.get("represents")) return false;
                        else return true;
                    });
                    log("Tokens in radius are: ")
                    for (var i in tokenInRadius) {
                        log(tokenInRadius[i])
                            //stat targets
                        let char = tokenInRadius[i].get("represents")
                        let HPcurrC = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        let StrC = findObjs({
                            characterid: char,
                            name: "Str_bd"
                        })[0];
                        let MagC = findObjs({
                            characterid: char,
                            name: "Mag_bd"
                        })[0];
                        let SklC = findObjs({
                            characterid: char,
                            name: "Skl_bd"
                        })[0];
                        let SpdC = findObjs({
                            characterid: char,
                            name: "Spd_bd"
                        })[0];
                        let LckC = findObjs({
                            characterid: char,
                            name: "Lck_bd"
                        })[0];
                        let DefC = findObjs({
                            characterid: char,
                            name: "Def_bd"
                        })[0];
                        let ResC = findObjs({
                            characterid: char,
                            name: "Res_bd"
                        })[0];
                        let HitC = findObjs({
                            characterid: char,
                            name: "Hitmod"
                        })[0];
                        let CritC = findObjs({
                            characterid: char,
                            name: "Critmod"
                        })[0];
                        let AvoC = findObjs({
                            characterid: char,
                            name: "Avomod"
                        })[0];
                        let DdgC = findObjs({
                            characterid: char,
                            name: "Ddgmod"
                        })[0];

                        //numerical stats
                        let HPcurrStat = getAttrByName(char, 'HP_current');
                        let StrStat = getAttrByName(char, 'Str_total');
                        let MagStat = getAttrByName(char, 'Mag_total');
                        let SklStat = getAttrByName(char, 'Skl_total');
                        let SpdStat = getAttrByName(char, 'Spd_total');
                        let LckStat = getAttrByName(char, 'Lck_total');
                        let DefStat = getAttrByName(char, 'Def_total');
                        let ResStat = getAttrByName(char, 'Res_total');
                        let HitStat = getAttrByName(char, 'Hit');
                        let CritStat = getAttrByName(char, 'Crit');
                        let AvoStat = getAttrByName(char, 'Avo');
                        let DdgStat = getAttrByName(char, 'Ddg');

                        let effect = eval(obj.radius_effect); //effect MUST be an array!!!
                        let rad_effect = Number(effect[0].get("current")) + parseInt(Number(effect[1]))

                        log(effect[0].get("current"))
                        effect[0].setWithWorker({
                            current: rad_effect
                        });
                        log(effect[0].get("current"))

                        if ((effect[0] == HPcurrC) && (char == userid)) {
                            HPA += parseInt(effect[1])
                        }

                    }
                }

                CurrHPU.setWithWorker({
                    current: HPA
                });
                //recursionnn
                if (obj.children_skills != []) {
                    for (var y in obj.children_skills) {
                        let Child_Skill = JSON.parse(obj.children_skills[y]);
                        Skill(userid, Child_Skill, "any"); //child implementations of preexisting skills should have the triggertime "any" as well
                    }
                }

                let Chatstr;
                if (obj.custom_string != "") {
                    '<p style = "margin-bottom: 0px;"> <b style = "color: #4055df;">' + obj.custom_string + "</b></p>"
                } else {
                    Chatstr = '<p style = "margin-bottom: 0px;"><b style = "color: #4055df;">'+ obj.name + " activated!</b></p>"
                }
                sendChat(who, '<div ' + divstyle + '>' + //--
                    '<div ' + headstyle + '>Skill</div>' + //--
                    '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + Chatstr + '</div>' + //--
                '</div>'
                );
            }

            if (obj.rng != "none") {
                if (randomInteger(100) < (rng * obj.rngmod)) {
                    skillMain();
                } else {
                    log("RIP RNG")
                    return;
                }

            } else { //Plain ol' skill trigger
                log("Regular skillmain")
                skillMain();
            }
        }
        for (var j in Skills){
            Skill(Skills[i].ID, Skills[i], "turn")
        }
});

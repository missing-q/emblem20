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
    if (command == 'forecast') {
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
        let WNameA = attrLookup(attacker, "repeating_weapons_$0_WName", false) || "Empty";
        let WNameB = attrLookup(defender, "repeating_weapons_$0_WName", false) || "Empty";
        let WTypeA = attrLookup(attacker, "repeating_weapons_$0_WType", false) || "Stones/Other";
        let WTypeB = attrLookup(defender, "repeating_weapons_$0_WType", false) || "Stones/Other";
        let MtA = parseInt(attrLookup(attacker, "repeating_weapons_$0_Mt", false)) || 0;
        let MtB = parseInt(attrLookup(defender, "repeating_weapons_$0_Mt", false)) || 0;
        let WtA = parseInt(attrLookup(attacker, "repeating_weapons_$0_Wt", false)) || 0;
        let WtB = parseInt(attrLookup(defender, "repeating_weapons_$0_Wt", false)) || 0;
        let Range1A = parseInt(attrLookup(attacker, "repeating_weapons_$0_Range1", false)) || 1;
        let Range1B = parseInt(attrLookup(defender, "repeating_weapons_$0_Range1", false)) || 1;
        let Range2A = parseInt(attrLookup(attacker, "repeating_weapons_$0_Range2", false)) || 1;
        let Range2B = parseInt(attrLookup(defender, "repeating_weapons_$0_Range2", false)) || 1;
        let WRankA = attrLookup(attacker, "repeating_weapons_$0_WRank", false) || "E";
        let WRankB = attrLookup(attacker, "repeating_weapons_$0_WRank", false) || "E";
        let fIDA = getAttrByName(attacker.id, 'fid')|| "";
        let fIDB = getAttrByName(defender.id, 'fid')|| "";
        log(fIDA);
        log(fIDB);
        let UsesA;
        let UsesB;
        let AOEA = parseInt(attrLookup(attacker, "repeating_weapons_$0_AOE", false)) || 0;
        let AOEB = parseInt(attrLookup(defender, "repeating_weapons_$0_AOE", false)) || 0;
        log("AOE is " + AOEA);
        log("AOE is " + AOEB);
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
        let StrengthsA = attrLookup(attacker, "repeating_weapons_$0_Strengths", false) || "";
        let StrengthsB = attrLookup(defender, "repeating_weapons_$0_Strengths", false) || "";
        let WeaknessA = getAttrByName(attacker.id, 'weaknesses');
        let WeaknessB = getAttrByName(defender.id, 'weaknesses');

        //attacker wexp
        let SwordEXPA = findObjs({ characterid: attacker.id, name: "SwordEXP", type: "attribute"})[0];
        let LanceEXPA = findObjs({ characterid: attacker.id, name: "LanceEXP", type: "attribute"})[0];
        let AxeEXPA = findObjs({ characterid: attacker.id, name: "AxeEXP", type: "attribute"})[0];
        let BowEXPA = findObjs({ characterid: attacker.id, name: "BowEXP", type: "attribute"})[0];
        let DaggerEXPA = findObjs({ characterid: attacker.id, name: "DaggerEXP", type: "attribute"})[0];
        let GunEXPA = findObjs({ characterid: attacker.id, name: "GunEXP", type: "attribute"})[0];
        let DarkEXPA = findObjs({ characterid: attacker.id, name: "DarkEXP", type: "attribute"})[0];
        let LightEXPA = findObjs({ characterid: attacker.id, name: "LightEXP", type: "attribute"})[0];
        let AnimaEXPA = findObjs({ characterid: attacker.id, name: "AnimaEXP", type: "attribute"})[0];
        let StoneEXPA = findObjs({ characterid: attacker.id, name: "StoneEXP", type: "attribute"})[0];
        let StaffEXPA = findObjs({ characterid: attacker.id, name: "StaffEXP", type: "attribute"})[0];

        //defender wexp
        let SwordEXPB = findObjs({ characterid: defender.id, name: "SwordEXP", type: "attribute"})[0];
        let LanceEXPB = findObjs({ characterid: defender.id, name: "LanceEXP", type: "attribute"})[0];
        let AxeEXPB = findObjs({ characterid: defender.id, name: "AxeEXP", type: "attribute"})[0];
        let BowEXPB = findObjs({ characterid: defender.id, name: "BowEXP", type: "attribute"})[0];
        let DaggerEXPB = findObjs({ characterid: defender.id, name: "DaggerEXP", type: "attribute"})[0];
        let GunEXPB = findObjs({ characterid: defender.id, name: "GunEXP", type: "attribute"})[0];
        let DarkEXPB = findObjs({ characterid: defender.id, name: "DarkEXP", type: "attribute"})[0];
        let LightEXPB = findObjs({ characterid: defender.id, name: "LightEXP", type: "attribute"})[0];
        let AnimaEXPB = findObjs({ characterid: defender.id, name: "AnimaEXP", type: "attribute"})[0];
        let StoneEXPB = findObjs({ characterid: defender.id, name: "StoneEXP", type: "attribute"})[0];
        let StaffEXPB = findObjs({ characterid: defender.id, name: "StaffEXP", type: "attribute"})[0];

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
        const WepRanksA = [SwordEXPA,LanceEXPA,AxeEXPA,BowEXPA,DaggerEXPA,GunEXPA,AnimaEXPA,LightEXPA,DarkEXPA,StoneEXPA,StaffEXPA];
        const WepRanksB = [SwordEXPB,LanceEXPB,AxeEXPB,BowEXPB,DaggerEXPB,GunEXPB,AnimaEXPB,LightEXPB,DarkEXPB,StoneEXPB,StaffEXPB];
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
        if ((WepUA[WepTypes.indexOf(WTypeA)] == 1) && (WepRanksA[WepTypes.indexOf(WTypeA)].get("current") >= WRankA_num)){
            log("Attacker's weapon is usable!");
        } else {
            log("Attacker's weapon is not usable!");

            CanAttackA = false;
        }
        if ((WepUB[WepTypes.indexOf(WTypeB)] == 1) && (WepRanksB[WepTypes.indexOf(WTypeB)].get("current") >= WRankB_num)){
            log("Defender's weapon is usable!");
        } else {
            log("Defender's weapon is not usable!");
            log((WepUB[WepTypes.indexOf(WTypeB)]));
            log(WepRanksB[WepTypes.indexOf(WTypeB)].get("current"));
            log(WRankB_num)
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
        if ( ((PhysWepTypes.includes(WTypeA))||(PhysWeps.includes(WNameA))) && (!MagWeps.includes(WNameA)) ){
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
        if ( ((PhysWepTypes.includes(WTypeB))||(PhysWeps.includes(WNameB))) && (!MagWeps.includes(WNameB)) ){
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
        let CurrWR = WepRanksA[WIN];
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

        log("diff: "+ diff + ", range1A: "+ Range1A + ", range2A: "+ Range2A + ", range1B: "+ Range1B + ", range2B: "+ Range2B );

        if (!((diff >= Range1A) && (diff <= Range2A))){
            CanAttackA = false;
        }

        if (!((diff >= Range1B) && (diff <= Range2B))){
            CanAttackB = false;
        }
        log(CanAttackA);
        log(CanAttackB);

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
        let timesA = "";
        let timesB = "";

        //for damage display
        if (CanAttackA && DoubleA){
            timesA = " x 2"
            if (QuadA){
                timesA = " x 4"
            }
        }
        if (CanAttackB && DoubleB){
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
                '<div ' + headstyle + '>Battle Forecast</div>' + //--
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

            '</div>'
        );
        if (IsPromoA == true){
            InLvA += 20;
        }
        if (IsPromoB == true){
            InLvB += 20;
        }
    }
});

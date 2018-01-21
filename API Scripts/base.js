//credit to Brian on the forums for this framework!
on('chat:message', function(msg) {
    if (msg.type != 'api') return;
    var parts = msg.content.split(' ');
    var command = parts.shift().substring(1);

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
        let Chatstr = AName + ' attacks ' + DName + '!\n';

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
        let HPA = getAttrByName(attacker.id, 'hp_current');
        let HPB = getAttrByName(defender.id, 'hp_current');
        let StrA = getAttrByName(attacker.id, 'str_total');
        let StrB = getAttrByName(defender.id, 'str_total');
        let MagA = getAttrByName(attacker.id, 'mag_total');
        let MagB = getAttrByName(defender.id, 'mag_total');
        let SklA = getAttrByName(attacker.id, 'skl_total');
        let SklB = getAttrByName(defender.id, 'skl_total');
        let SpdA = getAttrByName(attacker.id, 'spd_total');
        let SpdB = getAttrByName(defender.id, 'spd_total');
        let LckA = getAttrByName(attacker.id, 'lck_total');
        let LckB = getAttrByName(defender.id, 'lck_total');
        let DefA = getAttrByName(attacker.id, 'def_total');
        let DefB = getAttrByName(defender.id, 'def_total');
        let ResA = getAttrByName(attacker.id, 'res_total');
        let ResB = getAttrByName(defender.id, 'res_total');

        //Grab weapon stats
        let WNameA = getAttrByName(attacker.id, 'f_WName');
        let WNameB = getAttrByName(defender.id, 'f_WName');
        let WTypeA = getAttrByName(attacker.id, 'f_WType');
        let WTypeB = getAttrByName(defender.id, 'f_WType');
        let MtA = getAttrByName(attacker.id, 'f_Mt');
        let MtB = getAttrByName(defender.id, 'f_Mt');
        let WtA = getAttrByName(attacker.id, 'f_Wt');
        let WtB = getAttrByName(defender.id, 'f_Wt');
        let Range1A = getAttrByName(attacker.id, 'f_Range1');
        let Range1B = getAttrByName(defender.id, 'f_Range1');
        let Range2A = getAttrByName(attacker.id, 'f_Range2');
        let Range2B = getAttrByName(defender.id, 'f_Range2');
        let WRankA = getAttrByName(attacker.id, 'f_WRank');
        let WRankB = getAttrByName(defender.id, 'f_WRank');
        log(WRankA);
        log(WRankB);
        let fIDA = findObjs({ characterid: attacker.id, name: "fid"})[0];
        let fIDB = findObjs({ characterid: defender.id, name: "fid"})[0];
        log(fIDA);
        log(fIDB);
        let UsesA;
        let UsesB;
        //check for no rows
        if (fIDA.get("current") == ""){
            UsesA = 68932
            log("No weapon! :0")
        } else {
            UsesA = findObjs({ characterid: attacker.id, name: "repeating_weapons_"+fIDA.get("current")+"_Uses"},{ caseInsensitive: true })[0];
        }
        if (fIDB.get("current") == ""){
            UsesB = 68932
        } else {
            UsesB = findObjs({ characterid: defender.id, name: "repeating_weapons_"+fIDB.get("current")+"_Uses"},{ caseInsensitive: true })[0];
        }
        log(UsesA)
        log(UsesB)
        let StrengthsA = getAttrByName(attacker.id, 'f_Strengths');
        let StrengthsB = getAttrByName(defender.id, 'f_Strengths');
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
        log(SwordUA)

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
        let CanAttackA = true;
        let CanAttackB = true;
        //Weapon Rank threshold values
        let WRankA_num;
        let WRankB_num;
        const LRanks = [{num: 0, rank: "E"},{num: 30, rank: "D"},{num: 70, rank: "C"},{num: 120, rank: "B"},{num: 180, rank: "A"},{num: 250, rank: "S"},{num: 999, rank: "UU"}]
        //check for which rank
        for (var h in LRanks){
            log(LRanks[h])
            if (LRanks[h].rank == WRankA){
                WRankA_num = LRanks[h].num;
            }
        }
        for (var h in LRanks){
            log(LRanks[h])
            if (LRanks[h].rank == WRankB){
                WRankB_num = LRanks[h].num;
            }
        }
        log("Numerical weapon rank is " + WRankA_num)
        //Check to see if the weapon is usable
        if ((WepUA[WepTypes.indexOf(WTypeA)] == 1) && (WepRanks[WepTypes.indexOf(WTypeA)].get("current") >= WRankA_num)){
            log("Attacker's weapon is usable!")
        } else {
            log("Attacker's weapon is not usable!")
            CanAttackA = false;
        }
        if ((WepUB[WepTypes.indexOf(WTypeB)] == 1) && (WepRanks[WepTypes.indexOf(WTypeB)].get("current") >= WRankB_num)){
            log("Defender's weapon is usable!")
        } else {
            log("Defender's weapon is not usable!")
            CanAttackB = false;
        }
        //Check for weapon effectiveness- HAS TO BE BEFORE stat targeting calcs so it can factor in Mt.
        if ( ( StrengthsA.includes("Beast") && WeaknessB.includes("Beast")) || ( StrengthsA.includes("Flier") && WeaknessB.includes("Flier")) || ( StrengthsA.includes("Dragon") && WeaknessB.includes("Dragon")) || ( StrengthsA.includes("Armor") && WeaknessB.includes("Armor"))){
            MtA *= 3;
            Chatstr += "Attacker has weapon effectiveness! \n";
        }
        if ( ( StrengthsB.includes("Beast") && WeaknessA.includes("Beast")) || ( StrengthsB.includes("Flier") && WeaknessA.includes("Flier")) || ( StrengthsB.includes("Dragon") && WeaknessA.includes("Dragon")) || ( StrengthsB.includes("Armor") && WeaknessA.includes("Armor"))){
            MtB *= 3;
            Chatstr += "Defender has weapon effectiveness! \n";
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

        //Check for WTA
        let WIndexA = WepTypes.indexOf(WTypeA)+ 1;
        let WIndexB = WepTypes.indexOf(WTypeB)+ 1;
        let WIN = WepTypes.indexOf(WTypeA);
        let CurrWR = WepRanks[WIN];
        let CWRVal = Number(CurrWR.get("current")); //Assume number because it's a numerical input
        log(CurrWR);
        log(CWRVal);
        if( (WIndexA == 1 && WIndexB == 3) || (WIndexA == 3 && WIndexB == 2) || (WIndexA == 2 && WIndexB == 1) || (WIndexA == 4 && WIndexB == 5) || (WIndexA == 5 && WIndexB == 6) || (WIndexA == 6 && WIndexB == 4) || (WIndexA == 7 && WIndexB == 8) || (WIndexA == 8 && WIndexB == 9) || (WIndexA == 9 && WIndexB == 7)) {
            DmgA +=1;
            HitA +=15;
            DmgB -= 1;
            HitB -=15;
            Chatstr += "Attacker has WTA! \n";
        }
        if( (WIndexA == 3 && WIndexB == 1) || (WIndexA == 2 && WIndexB == 3) || (WIndexA == 1 && WIndexB == 2) || (WIndexA == 5 && WIndexB == 4) || (WIndexA == 6 && WIndexB == 5) || (WIndexA == 4 && WIndexB == 6) || (WIndexA == 8 && WIndexB == 7) || (WIndexA == 9 && WIndexB == 8) || (WIndexA == 7 && WIndexB == 9)) {
            DmgA -=1;
            HitA -=15;
            DmgB += 1;
            HitB +=15;
            Chatstr += "Defender has WTA! \n";
        }
        if (DmgA < 0){
            DmgA = 0;
        }
        if (DmgB < 0){
            DmgB = 0;
        }
        if (typeof(UsesA) === "object"){
            function DecUsesA() {
                UsesA.setWithWorker({current: Number(UsesA.get("current")) - 2})
            }
            log("Is an object!")
        } else {
            log("Not an object!")
            function DecUsesA() {
                UsesA -= 2
            }
        }
        if (typeof(UsesB) === "object"){
            function DecUsesB() {
                UsesA.setWithWorker({current: Number(UsesB.get("current")) - 1})
            }
            log("Is an object!")
        } else {
            log("Not an object!")
            function DecUsesB() {
                UsesB -= 2
            }
        }

        //Actual battle script
        //Check if attacker's attack hits/is in range
        let AXCoord = selectedToken.get("left");
        let AYCoord = selectedToken.get("top");
        let BXCoord = targetToken.get("left");
        let BYCoord = targetToken.get("top");
        let diff = parseInt((Math.abs(AXCoord - BXCoord))+(Math.abs(AYCoord - BYCoord)));
        log(diff/70 + " tiles away!")
        let css = {
            attack: 'style = "color: #353535"'
        }
        if (CanAttackA == true) {
            if (((Range1A) <= (diff/70)) && ((diff/70) <= (Range2A))){
                Chatstr += AName+ "'s attack is in range! \n";
                if (randomInteger(100) < (HitA - AvoB)){
                    Chatstr += AName + "'s attack hits! \n";
                    //Check if attack crits
                    if (randomInteger(100) < (CritA - DdgB)){
                        DmgA *= 3;
                        Chatstr += AName+ " crits! \n";
                    }
                    HPB -= DmgA;
                    log("Damage is " + DmgA);
                    CurrHPB.set("current", HPB);
                    CWRVal += 2;
                    CurrWR.set("current",CWRVal);
                    log("Incremented weapon EXP!");
                    DecUsesA()
                    log("Decreased weapon uses!")
                } else {
                    Chatstr += AName+ " misses! \n";
                }
                //Check for doubling/braves
                if ( (SpdA - WtA) - (SpdB - WtB) > 5 ||  WNameA.toLowerCase().includes("brave")){
                    DoubleA = true;
                    log("Attacker can double!");
                    if ( (SpdA - WtA) - (SpdB - WtB) > 5 &&  WNameA.toLowerCase().includes("brave")){
                        QuadA = true;
                        log("Attacker can quad!");
                    }
                }
            } else {
                Chatstr += AName + "'s attack is not in range! \n";
            }
        } else {
            Chatstr += AName +" cannot attack!"
        }

        if (CanAttackB == true){
            //Check if defender's attack hits
            if (((Range1B) <= (diff/70)) && ((diff/70) <= (Range2B))){
                Chatstr += DName + "'s attack is in range! \n";
                if (randomInteger(100) < (HitB - AvoA)){
                    Chatstr += DName+ "'s attack hits!";
                    //Check if attack crits
                    if (randomInteger(100) < (CritB - DdgA)){
                        DmgB *= 3;
                        Chatstr += "\n"+ DName+ " crits!";
                    }
                    HPA -= DmgB;
                    CurrHPA.set("current", HPA);
                    //Defender gets no WEXP to discourage turtling on EP
                    DecUsesB()
                    log("Decreased weapon uses!")
                } else {
                    Chatstr += DName+ " misses!";
                }
                if ( (SpdB - WtB) - (SpdA - WtA) > 5 ||  WNameB.toLowerCase().includes("brave")){
                    DoubleB = true;
                    log("Defender can double!");
                    if ( (SpdB - WtB) - (SpdA - WtA) > 5 &&  WNameB.toLowerCase().includes("brave")){
                        QuadB = true;
                        log("Defender can quad!");
                    }
                }
            } else {
                Chatstr += DName + "'s attack is not in range!";
            }
        } else {
            Chatstr += "\n"+ DName +" cannot attack!"
        }

        //Attacker doubles; I don't think I should need to do usability checking for doubleattacking since it's checked within the battle calc
        if (DoubleA === true){
            Chatstr += "\n"+ AName+ " doubleattacks! \n";
            if (randomInteger(100) < (HitA - AvoB)){
                Chatstr += AName+ "'s attack hits!";
                //Check if attack crits
                if (randomInteger(100) < (CritA - DdgB)){
                    DmgA *= 3;
                    Chatstr += "\n"+ AName+ " crits!";
                }
                HPB -= DmgA;
                CurrHPB.set("current", HPB);
                CWRVal += 2;
                CurrWR.set("current",CWRVal)
                log("Incremented weapon EXP!")
                DecUsesA()
                log("Decreased weapon uses!")
            } else {
                Chatstr += AName+ " misses!";
            }
            if (QuadA === true){
                Chatstr += AName+ " tripleattacks! \n";
                if (randomInteger(100) < (HitA - AvoB)){
                    Chatstr += AName+ "'s attack hits! \n";
                    //Check if attack crits
                    if (randomInteger(100) < (CritA - DdgB)){
                        DmgA *= 3;
                        Chatstr += AName+ " crits! \n";
                    }
                    HPB -= DmgA;
                    CurrHPB.set("current", HPB);
                    CWRVal += 2;
                    CurrWR.set("current",CWRVal)
                    log("Incremented weapon EXP!")
                    DecUsesA()
                    log("Decreased weapon uses!")
                } else {
                    Chatstr += AName+ " misses! \n";
                }
                Chatstr += AName+ " quadrupleattacks! \n";
                if (randomInteger(100) < (HitA - AvoB)){
                    Chatstr += AName+ "'s attack hits! \n";
                    //Check if attack crits
                    if (randomInteger(100) < (CritA - DdgB)){
                        DmgA *= 3;
                        Chatstr += AName+ " crits! \n";
                    }
                    HPB -= DmgA;
                    CurrHPB.set("current", HPB);
                    CWRVal += 2;
                    CurrWR.set("current",CWRVal)
                    log("Incremented weapon EXP!")
                    DecUsesA()
                    log("Decreased weapon uses!")
                } else {
                    Chatstr += AName+ " misses!";
                }
            }
        }

        //Defender doubles
        if (DoubleB === true){
            Chatstr += "\n"+ DName+ " doubleattacks! \n";
            if (randomInteger(100) < (HitB - AvoA)){
                Chatstr += DName+ "'s attack hits! \n";
                //Check if attack crits
                if (randomInteger(100) < (CritB - DdgA)){
                    DmgB *= 3;
                    Chatstr += DName+ " crits! \n";
                }
                HPA -= DmgB;
                CurrHPA.set("current", HPA);
                DecUsesB()
                log("Decreased weapon uses!")
            } else {
                Chatstr += DName+ " misses! \n";
            }
            if (QuadB === true){
                Chatstr += DName+ " tripleattacks! \n";
                if (randomInteger(100) < (HitB - AvoA)){
                    Chatstr += DName+ "'s attack hits! \n";
                    //Check if attack crits
                    if (randomInteger(100) < (CritB - DdgA)){
                        DmgB *= 3;
                        Chatstr += DName+ " crits! \n";
                    }
                    HPA -= DmgB;
                    CurrHPA.set("current", HPA);
                    DecUsesB()
                    log("Decreased weapon uses!")
                } else {
                    Chatstr += DName+ " misses! \n";
                }
                Chatstr += DName+ " quadrupleattacks! \n";
                if (randomInteger(100) < (HitB - AvoA)){
                    Chatstr += DName+ "'s attack hits! \n";
                    //Check if attack crits
                    if (randomInteger(100) < (CritB - DdgA)){
                        DmgB *= 3;
                        Chatstr += DName+ " crits! \n";
                    }
                    HPA -= DmgB;
                    CurrHPA.set("current", HPA);
                    DecUsesB()
                    log("Decreased weapon uses!")
                } else {
                    Chatstr += DName+ " misses!";
                }
            }
        }

        sendChat(who,'<div ' + css.attack + '>'+ Chatstr +'</div>');
        log('<div ' + css.attack + '>'+ Chatstr +'</div>');
        if (IsPromoA == true){
            InLvA += 20
        }
        if (IsPromoB == true){
            InLvB += 20
        }
        //Calculate EXP; commented out for the test
        EXPA += (10 + ((InLvB-InLvA)*3))
        log(EXPA)
        CurrEXP.set("current",EXPA)
        if (CurrEXP.get("current") >= 100){
            CurrEXP.set("current",CurrEXP.get("current")-100)
            //Get growths
            LvA.set("current", Number(LvA.get("current")) + 1)
            let Lvstr = "/me leveled up!"
            let HPG = Number(getAttrByName(attacker.id, 'hp_gtotal'));
            let StrG = Number(getAttrByName(attacker.id, 'str_gtotal'));
            let MagG = Number(getAttrByName(attacker.id, 'mag_gtotal'));
            let SklG = Number(getAttrByName(attacker.id, 'skl_gtotal'));
            let SpdG = Number(getAttrByName(attacker.id, 'spd_gtotal'));
            let LckG = Number(getAttrByName(attacker.id, 'lck_gtotal'));
            let DefG = Number(getAttrByName(attacker.id, 'def_gtotal'));
            let ResG = Number(getAttrByName(attacker.id, 'res_gtotal'));
            let growthslist = [HPG,StrG,MagG,SklG,SpdG,LckG,DefG,ResG]

            let HPi = Number(getAttrByName(attacker.id, 'hp_i'));
            let Stri = Number(getAttrByName(attacker.id, 'str_i'));
            let Magi = Number(getAttrByName(attacker.id, 'mag_i'));
            let Skli = Number(getAttrByName(attacker.id, 'skl_i'));
            let Spdi = Number(getAttrByName(attacker.id, 'spd_i'));
            let Lcki = Number(getAttrByName(attacker.id, 'lck_i'));
            let Defi = Number(getAttrByName(attacker.id, 'def_i'));
            let Resi = Number(getAttrByName(attacker.id, 'res_i'));
            let sprefix = [HPi,Stri,Magi,Skli,Spdi,Lcki,Defi,Resi]

            let HPSG = findObjs({ characterid: attacker.id, name: "HP_i", type: "attribute"})[0];
            let StrSG = findObjs({ characterid: attacker.id, name: "Str_i", type: "attribute"})[0];
            let MagSG = findObjs({ characterid: attacker.id, name: "Mag_i", type: "attribute"})[0];
            let SklSG = findObjs({ characterid: attacker.id, name: "Skl_i", type: "attribute"})[0];
            let SpdSG = findObjs({ characterid: attacker.id, name: "Spd_i", type: "attribute"})[0];
            let LckSG = findObjs({ characterid: attacker.id, name: "Lck_i", type: "attribute"})[0];
            let DefSG = findObjs({ characterid: attacker.id, name: "Def_i", type: "attribute"})[0];
            let ResSG = findObjs({ characterid: attacker.id, name: "Res_i", type: "attribute"})[0];
            let statslist = [HPSG,StrSG,MagSG,SklSG,SpdSG,LckSG,DefSG,ResSG]
            log(statslist)
            let slist = ["HP","Str","Mag","Skl","Spd","Lck","Def","Res"]
            for (var i = 0; i < growthslist.length - 1; i++){
                gi = growthslist[i]
                log(gi)
                if (randomInteger(100) < gi){
                    statslist[i].setWithWorker({current: sprefix[i] + 1})
                    if (gi > 100){
                        if (randomInteger(100) < gi){
                            Lvstr += "\n + 2 to "+ slist[i] + "!"
                            statslist[i].setWithWorker({current: sprefix[i] + 2})
                        } else{
                            Lvstr += "\n + 1 to "+ slist[i] + "!"
                        }
                    } else {
                        Lvstr += "\n + 1 to "+ slist[i] + "!"
                    }
                }
            }
            log(Lvstr)
            sendChat(who,Lvstr)
        }
    }
});

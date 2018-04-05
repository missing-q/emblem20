//Command skills! :o
on('chat:message', function(msg) {
    if (msg.type != 'api') return;
    var parts = msg.content.split(' '); //skill name should NOT have a space in it!
    var command = parts.shift().substring(1);
    function ManhDist(token1,token2) { //Manhattan Distance in tiles between two units
        let AXCoord = token1.get("left");
        let AYCoord = token1.get("top");
        let BXCoord = token2.get("left");
        let BYCoord = token2.get("top");
        let diff = parseInt((Math.abs(AXCoord - BXCoord))+(Math.abs(AYCoord - BYCoord)));
        return (diff/70)
    }
    // Don't run if it's any other command
    if (command == 'skill') {
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

        // Get a variable to use as the "who" for sendChat
        var who = getObj('character', selectedToken.get('represents'));
        if (!who) {
            who = selectedToken.get('name');
        } else {
            who = 'character|' + who.id;
        }
        //script!!

        var attacker = getObj('character', selectedToken.get('represents'));
        var defender = getObj('character', targetToken.get('represents'));

        //grab all commands
        let SkillsA = findObjs({ characterid: attacker.id, type: "ability"});
        for (var i in SkillsA){
            SkillsA[i] = SkillsA[i].get("action");
            if (SkillsA[i] != ""){
                SkillsA[i] = JSON.parse(SkillsA[i]);
            }
        }
        let temp = []
        SkillsA.forEach(function(entry, i) {
            if (SkillsA[i].triggertime == "command"){
                temp.push(SkillsA[i])
            }
        });
        SkillsA = temp;
        let namestr = "";
        for (i in SkillsA){
            namestr += "|" + SkillsA[i].name;
        }


        //SkillsB doesn't exist because they're not selecting anything lol

        sendChat("System","[Pick Ability](!&#"+"13;!co ?{Pick a skill"+namestr+"} " + selectedId + " " + targetId + ")");
        //get second message

    }
    if (command == 'co'){
        log("YE")
        log(parts);
        var skillName = parts[0];
        var selectedId = parts[1];
        var targetId = parts[2];

        var selectedToken = getObj('graphic', selectedId);
        var targetToken = getObj('graphic', targetId);
        var attacker = getObj('character', selectedToken.get('represents'));
        var defender = getObj('character', targetToken.get('represents'));

        var who = getObj('character', selectedToken.get('represents'));
        if (!who) {
            who = selectedToken.get('name');
        } else {
            who = 'character|' + who.id;
        }

        let newSkill = findObjs({ characterid: attacker.id, type: "ability", name: skillName })[0];
        log(newSkill)
        if (newSkill == [] || newSkill == undefined){
            sendChat("SYSTEM","Provided skill name does not exist! ")
            return;
        }
        newSkill = newSkill.get("action")
        let selectedSkill = JSON.parse(newSkill);
        log(selectedSkill)
        //Skills system time!!
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
        let CurrEXP = findObjs({ characterid: attacker.id, name: "EXP"})[0];
        let LvA = findObjs({ characterid: attacker.id, name: "Level"})[0];
        let InLvA = Number(LvA.get("current"));
        let LvB = findObjs({ characterid: defender.id, name: "Level"})[0];
        let InLvB = Number(LvB.get("current"));
        let EXPA = Number(CurrEXP.get("current"));
        let IsPromoA = getAttrByName(attacker.id, 'isPromo');
        let IsPromoB = getAttrByName(defender.id, 'isPromo');
        let EXPAmod = (10 + ((Math.abs(InLvB-InLvA)*3)));
        let HPA = Number(getAttrByName(attacker.id, 'hp_current'));
        let HPB = Number(getAttrByName(defender.id, 'hp_current'));
        let CurrHPA = findObjs({ characterid: attacker.id, name: "HP_current"})[0];
        let CurrHPB = findObjs({ characterid: defender.id, name: "HP_current"})[0];

        function Skill(userid, targetid, obj, triggertime) { //haha END ME
            if (typeof obj != "object") {
                log("obj is not an object :(")
                return;
            }
            if (obj.triggertime != "command"){
                return;
            }
            //no whotriggered checking because it'll always be the attacker
            log("Okay, first barrier passed")
            user = "attacker";
            RNGSklU = Number(getAttrByName(attacker.id, 'skl_total'));
            RNGLckU = Number(getAttrByName(attacker.id, 'lck_total'));
            CurrHPU = findObjs({
                characterid: attacker.id,
                name: "HP_current"
            })[0];
            CurrHPE = findObjs({
                characterid: defender.id,
                name: "HP_current"
            })[0];
            DmgtypeU = ""
            DmgtypeE = "" //doesn't matter since commands are non-combative anyways
            Usertoken = selectedToken;
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
            if ((obj.customcond != "none") && (eval(obj.customcond) != true)) {
                return;
            }
            if ((obj.turncond != "none") && (eval(obj.turncond) != true)){
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
                let HealmodE = parseInt(eval(obj.e_healfactor));
                log("HealmodU is" + HealmodU)

                let statnames = ["HP", "Str", "Mag", "Skl", "Spd", "Lck", "Def", "Res"];

                //determining the actual stat target
                if (obj.u_stat_target || obj.e_stat_target != "none") {
                    for (var r in statnames) {
                        if (obj.u_stat_target == statnames[r]) {
                            StattargetU = eval(statnames[r] + "U");
                        }
                        if (obj.e_stat_target == statnames[r]) {
                            StattargetE = eval(statnames[r] + "U");
                        }
                    }
                }
                let StattargetmodU = eval(obj.u_stat_targetmod);
                let StattargetmodE = eval(obj.e_stat_targetmod);

                if (obj.u_stat_target != "none") {
                    StattargetU.setWithWorker({
                        current: Number(StattargetU.get("current")) + Number(StattargetmodU)
                    });
                    log("Set targeted stat to " + StattargetU.get("current"));
                }

                if (obj.e_stat_target != "none") {
                    StattargetE.setWithWorker({
                        current: Number(StattargetE.get("current")) + Number(StattargetmodE)
                    });
                    log("Set targeted stat to " + StattargetE.get("current"));
                }

                HPA = parseInt(HPA) + HealmodU; //this has to be here because sometimes it'll be stupid and overflow if it's not >:(
                HPB = parseInt(HPB) + HealmodE;
                EXPAmod *= obj.expmod_u;
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

                        if ((effect[0] == HPcurrC) && (char == attacker.id)) {
                            HPA += parseInt(effect[1])
                        }

                        if ((effect[0] == HPcurrC) && (char == defender.id)) {
                            HPB += parseInt(effect[1])
                        }
                    }

                    CurrHPA.setWithWorker({
                        current: HPA
                    });
                    CurrHPB.setWithWorker({
                        current: HPB
                    });

                }
                //recursionnn
                if (obj.children_skills != []) {
                    for (var y in obj.children_skills) {
                        let Child_Skill = JSON.parse(obj.children_skills[y]);
                        Skill(userid, targetid, Child_Skill, "any"); //child implementations of preexisting skills should have the triggertime "any" as well
                    }
                }

                let Chatstr;
                if (obj.custom_string != "") {
                    Chatstr = '<b style = "color: #4055df;">' + obj.custom_string + "</b>\n"
                } else {
                    Chatstr = '<b style = "color: #4055df;">'+attacker.get("name") + " used " + obj.name + "!</b>\n"
                }
                sendChat(who, Chatstr);
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

        Skill(attacker.id, defender.id, selectedSkill, "command")

        //EXPPPPP
        EXPA += EXPAmod
        CurrEXP.set("current",EXPA);
        if (CurrEXP.get("current") >= 100){
            CurrEXP.set("current",CurrEXP.get("current")-100);
            //Get growths
            LvA.set("current", Number(LvA.get("current")) + 1);
            let Lvstr = "/me leveled up!";
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
                        if (randomInteger(100) < gi){
                            Lvstr += "\n + 2 to "+ slist[i] + "!";
                            statslist[i].setWithWorker({current: sprefix[i] + 2});
                        } else{
                            Lvstr += "\n + 1 to "+ slist[i] + "!";
                        }
                    } else {
                        Lvstr += "\n + 1 to "+ slist[i] + "!";
                    }
                }
            }
            log(Lvstr);
            sendChat(who,Lvstr);
        }

    }
});
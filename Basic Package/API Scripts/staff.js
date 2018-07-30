/*jshint esversion: 6 */
//Manhattan Distance in tiles between two units
function ManhDist(token1,token2) {
    let AXCoord = token1.get("left");
    let AYCoord = token1.get("top");
    let BXCoord = token2.get("left");
    let BYCoord = token2.get("top");
    let diff = parseInt((Math.abs(AXCoord - BXCoord))+(Math.abs(AYCoord - BYCoord)));
    return (diff/70);
}
//credit to Brian on the forums for this framework!
on('chat:message', function(msg) {
    if (msg.type != 'api') return;
    var parts = msg.content.split(' ');
    var command = parts.shift().substring(1);

    // Don't run if it's any other command
    if (command == 'staff') {
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
        var staffer = getObj('character', selectedToken.get('represents'));
        var target = getObj('character', targetToken.get('represents'));
        //Check to make sure that the tokens represent characters
        if (selectedToken.get('represents') === "" || targetToken.get('represents') === ""){
            sendChat('SYSTEM', 'Both tokens must be linked to characters in the journal!');
            return;
        }
        let CurrHPA = findObjs({ characterid: staffer.id, name: "HP_current"})[0];
        //Target stats for tasty statuses
        let CurrHPB = findObjs({ characterid: target.id, name: "HP_current"})[0];
        let dispHPA = CurrHPA.get("current");
        let dispHPB = CurrHPB.get("current");
        let CurrEXP = findObjs({ characterid: staffer.id, name: "EXP"})[0];
        let LvA = findObjs({ characterid: staffer.id, name: "Level"})[0];
        let InLvA = Number(LvA.get("current"));
        let EXPA = Number(CurrEXP.get("current"));
        let IsPromoA = getAttrByName(staffer.id, 'isPromo');
        let StaffEXPA = 0;
        let MaxHPB = findObjs({ characterid: target.id, name: "HP_total"})[0];
        let StrB = findObjs({ characterid: target.id, name: "Str_total"})[0];
        let MagB = findObjs({ characterid: target.id, name: "Mag_total"})[0];
        let SklB = findObjs({ characterid: target.id, name: "Skl_total"})[0];
        let SpdB = findObjs({ characterid: target.id, name: "Spd_total"})[0];
        let LckB = findObjs({ characterid: target.id, name: "Lck_total"})[0];
        let DefB = findObjs({ characterid: target.id, name: "Def_total"})[0];
        let ResB = findObjs({ characterid: target.id, name: "Res_total"})[0];
        let MovB = findObjs({ characterid: target.id, name: "Mov_total"})[0];

        let HPbd = findObjs({ characterid: target.id, name: "HP_bd"})[0];
        let Strbd = findObjs({ characterid: target.id, name: "Str_bd"})[0];
        let Magbd = findObjs({ characterid: target.id, name: "Mag_bd"})[0];
        let Sklbd = findObjs({ characterid: target.id, name: "Skl_bd"})[0];
        let Spdbd = findObjs({ characterid: target.id, name: "Spd_bd"})[0];
        let Lckbd = findObjs({ characterid: target.id, name: "Lck_bd"})[0];
        let Defbd = findObjs({ characterid: target.id, name: "Def_bd"})[0];
        let Resbd = findObjs({ characterid: target.id, name: "Res_bd"})[0];
        let Movbd = findObjs({ characterid: target.id, name: "Mov_bd"})[0];
        //Weapons and h/c/a
        let HitA = getAttrByName(staffer.id, 'hit');
        let AvoB = getAttrByName(target.id, 'avo');
        let MagA = getAttrByName(staffer.id, 'mag_total');
        let WNameA = getAttrByName(staffer.id, 'repeating_weapons_$0_WName') || "Empty";
        let WTypeA = getAttrByName(staffer.id, 'repeating_weapons_$0_WType') || "Stones/Other";
        let MtA = parseInt(getAttrByName(staffer.id, 'repeating_weapons_$0_Mt')) || 0;
        let WtA = parseInt(getAttrByName(staffer.id, 'repeating_weapons_$0_Wt')) || 0;
        let Range1A = parseInt(getAttrByName(staffer.id, 'repeating_weapons_$0_Range1')) || 1;
        let Range2A = parseInt(getAttrByName(staffer.id, 'repeating_weapons_$0_Range2')) || 1;
        let fIDA = getAttrByName(staffer.id, 'fid')|| "";
        let UsesA = parseInt(getAttrByName(staffer.id, 'repeating_weapons_$0_Uses')) || 0;
        let diff = ManhDist(selectedToken, targetToken);
        let AllegianceA = getAttrByName(staffer.id, 'all');
        let AllegianceB = getAttrByName(target.id, 'all');

        chatstr = '<p style = "margin-bottom: 0px;">' + staffer.get("name") + " uses " + WNameA + "!</p>";


        const Heal = {
            name : "Heal",
            type : "healing",
            effect : 10 + (Math.round(MagA/3)),
            exp: 17
        };
        const Mend = {
            name : "Mend",
            type : "healing",
            effect : 20 + (Math.round(MagA/3)),
            exp: 22
        };
        const Physic = {
            name : "Physic",
            type : "healing",
            effect : 7 + (Math.round(MagA/3)),
            exp: 30
        };
        const Recover = {
            name : "Recover",
            type : "healing",
            effect : 35 + (Math.round(MagA/3)),
            exp: 40
        };
        const Fortify = {
            name : "Fortify",
            type : "healing",
            effect : 7 + (Math.round(MagA/3)),
            exp: 60
        };
        const Bloom_Festal = {
            name : "Bloom Festal",
            type : "healing",
            effect : 7 + (Math.round(MagA/3)),
            exp: 17
        };
        const Sun_Festal = {
            name : "Sun Festal",
            type : "healing",
            effect : 14 + (Math.round(MagA/3)),
            exp: 22,
        };
        const Wane_Festal = {
            name : "Wane Festal",
            type : "healing",
            effect : 2 + (Math.round(MagA/3)),
            exp: 30
        };
        const Moon_Festal = {
            name : "Moon Festal",
            type : "healing",
            effect : 25 + (Math.round(MagA/3)),
            exp: 40
        };
        const Great_Festal = {
            name : "Great Festal",
            type : "healing",
            effect : 2 + (Math.round(MagA/3)),
            exp: 60
        };
        const Freeze = {
            name : "Freeze",
            type : "status",
            target: [Movbd],
            effect : Number(MovB.get("current")) * -1,
            status: {status_tread: true},
            chatmsg: targetToken.get("name") + " is unable to move this turn!",
            exp: 30
        };
        const Enfeeble = {
            name : "Enfeeble",
            type : "status",
            target: [Strbd,Magbd,Sklbd,Spdbd,Lckbd,Defbd,Resbd],
            effect : -4,
            status: {"status_back-pain": 4},
            chatmsg: targetToken.get("name") + " is enfeebled! -4 to every stat (decreases by 1 each turn)",
            exp: 40
        };
        const Entrap = {
            name : "Entrap",
            type : "status",
            target: [Movbd],
            effect : 0,
            status: {"status_grab": false},
            chatmsg: targetToken.get("name") + " is moved next to the enemy!",
            exp: 50
        };
        const Rescue = {
            name : "Rescue",
            type : "status",
            target: [Movbd],
            effect : 0,
            status: {"status_grab": false},
            chatmsg: targetToken.get("name") + " is rescued!",
            exp: 35
        };
        const Silence = {
            name : "Silence",
            type : "status",
            target: [Magbd],
            effect : Number(MagB.get("current")) * -1,
            status: {status_interdiction: true},
            chatmsg: targetToken.get("name") + " cannot use magic for the next turn!",
            exp: 40
        };
        const Hexing_Rod = {
            name : "Hexing Rod",
            type : "status",
            target: [HPbd],
            effect : Math.round(Number(MaxHPB.get("current")) * -0.5),
            status: {"status_broken-heart": true},
            chatmsg: targetToken.get("name") + "'s HP was halved!",
            exp: 50
        };

        //Okay, Skills system time!!
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
        let HPA = Number(getAttrByName(staffer.id, 'hp_current'));
        let HPB = Number(getAttrByName(target.id, 'hp_current'));
        let EXPbonus = 8; //unpromoted class bonus
        let EXPAmod = 0;
        if (IsPromoA){
            EXPbonus = 0;
            InLvA += 20;
        }
        EXPAmod = parseInt(StaffEXPA - Math.max(InLvA - 5, 0)/3 + EXPbonus);
        EXPA += EXPAmod;
        log(EXPAmod);
        function Skill(userid, targetid, obj, triggertime) { //haha END ME
            if (typeof obj != "object") {
                log("obj is not an object :(");
                return;
            }
            if (obj.triggertime != "staff"){
                return;
            }
            //no whotriggered checking because it'll always be the staffer
            log("Okay, first barrier passed");
            user = "staffer";
            RNGSklU = Number(getAttrByName(staffer.id, 'skl_total'));
            RNGLckU = Number(getAttrByName(staffer.id, 'lck_total'));
            CurrHPU = findObjs({
                characterid: staffer.id,
                name: "HP_current"
            })[0];
            CurrHPE = findObjs({
                characterid: target.id,
                name: "HP_current"
            })[0];
            DmgtypeU = "";
            DmgtypeE = ""; //doesn't matter since staves are non-combative anyways
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
                log("HealmodU is" + HealmodU);

                let statnames = ["HP", "Str", "Mag", "Skl", "Spd", "Lck", "Def", "Res"];
                log(obj.u_stat_target);
                log(obj.e_stat_target);
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
                let currvlU;
                let newvlU;
                let currvlE;
                let newvlE;

                if (obj.u_stat_target != "none" && StattargetU != undefined){
                    currvlU = parseInt(StattargetU.get("current"));
                    newvlU = parseInt(StattargetmodU)
                    log(currvlU);
                    log(newvlU)
                    StattargetU.setWithWorker({
                        current: currvlU + newvlU
                    });
                    log("Set U-targeted stat to "+ StattargetU.get("current"));
                }

                if (obj.e_stat_target != "none" && StattargetE != undefined){
                    currvlE = parseInt(StattargetE.get("current"));
                    newvlE = parseInt(StattargetmodE)
                    log(currvlE);
                    log(newvlE)
                    StattargetE.setWithWorker({
                        current: currvlE + newvlE
                    });
                    log("Set E-targeted stat to "+ StattargetE.get("current"));
                }
                //queue queue queue
                if (obj.u_stat_target != "CurrHPU" && obj.u_stat_target != "CurrHPE" && obj.u_stat_target != "none"){
                    if (StattargetmodU > 0){
                        queue.push([StattargetU, "decrement", 1, 0, "staff"])
                        log([StattargetU, "decrement", 1, 0, "staff"])
                        log("Pushed to queue!")
                    } else {
                        queue.push([StattargetU, "increment", 1, 0, "staff"])
                        log([StattargetU, "increment", 1, 0, "staff"])
                        log("Pushed to queue!")
                    }
                    //check queue for repeated buff/debuffs
                    for (var i in queue){
                        if ((queue[i][0] == StattargetU) && (queue[i][4] == "staff") && (queue[i] != queue[queue.length - 1])){ //the last element should be immune since it just got pushed
                            queue.shift();
                            i--;
                            StattargetU.setWithWorker({
                                current: currvlU
                            }); //reset stat back to what it was before
                            log("Removed repeating b/d");
                        }
                    }
                    //
                }
                if (obj.e_stat_target != "CurrHPU" && obj.e_stat_target != "CurrHPE" && obj.e_stat_target != "none"){
                    if (StattargetmodE> 0){
                        queue.push([StattargetE, "decrement", 1, 0, "staff"])
                        log([StattargetE, "decrement", 1, 0, "staff"])
                        log("Pushed to queue!")
                    } else {
                        queue.push([StattargetE, "increment", 1, 0, "staff"])
                        log([StattargetE, "increment", 1, 0, "staff"])
                        log("Pushed to queue!")
                    }
                    //check queue for repeated debuffs
                    for (var i in queue){
                        if ((queue[i][0] == StattargetE) && (queue[i][4] == "staff") && (queue[i] != queue[queue.length - 1])){ //change the checked string for each different queuetype
                            queue.shift();
                            i--;
                            StattargetE.setWithWorker({
                                current: currvlE
                            }); //reset stat back to what it was before
                            log("Removed repeating b/d");
                        }
                    }
                    //
                }

                HPA = parseInt(HPA) + HealmodU; //this has to be here because sometimes it'll be stupid and overflow if it's not >:(
                HPVal = parseInt(HPVal) + HealmodE;
                EXPAmod *= obj.expmod_u;
                log(HPA);

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
                        let HPC = findObjs({
                            characterid: char,
                            name: "HP_bd"
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
                        let MovC = findObjs({
                            characterid: char,
                            name: "Mov_bd"
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
                        let target = eval(obj.radius_target); //likewise
                        let rad_effect;
                        let def_target;

                        for (var i in effect) {
                          log(target[i].get("current"))
                          rad_effect = Number(target[i].get("current")) + parseInt(Number(effect[i]));
                          def_target = Number(target[i].get("current"));
                          target[i].setWithWorker({
                              current: rad_effect
                          });
                          log(target[i].get("current"))

                          if ((target[i] == HPcurrC) && (char == attacker.id)) {
                              HPA += parseInt(effect[1])
                          }

                          if ((target[i] == HPcurrC) && (char == defender.id)) {
                              HPB += parseInt(effect[1])
                          }

                          //queueeeee
                          if (target[i] != HPcurrC) {
                            if (parseInt(effect[i]) > 0){
                                queue.push([target[i], "decrement", 1, 0, "staff-r"])
                                log([target[i], "decrement", 1, 0, "staff-r"])
                                log("Pushed to queue!")
                            } else {
                                queue.push([target[i], "increment", 1, 0, "staff-r"])
                                log([target[i], "increment", 1, 0, "staff-r"])
                                log("Pushed to queue!")
                            }
                          }
                            for (var j in queue){
                                if ((queue[j][0] == target[i]) && (queue[j][4] == "command-r") && (j != queue.length - 1)){ //the last element should be immune since it just got pushed
                                    log(j)
                                    log(queue.length - 1)
                                    log(queue)
                                    target[i].setWithWorker({
                                        current: def_target
                                    }); //reset stat back to what it was before*/
                                    log("Removed repeating b/d");
                                }
                            }
                            //
                          //:OOOOOO
                        }
                    }
                }

                CurrHPA.setWithWorker({
                    current: HPA
                });

                //recursionnn
                if (obj.children_skills != []) {
                    for (var y in obj.children_skills) {
                        let Child_Skill = JSON.parse(obj.children_skills[y]);
                        Skill(userid, targetid, Child_Skill, "any"); //child implementations of preexisting skills should have the triggertime "any" as well
                    }
                }

                if (obj.custom_string != "") {
                    chatstr += '<p style = "margin-bottom: 0px;"><b style = "color: #4055df;">' + obj.custom_string + "</b></p>";
                } else {
                    chatstr += '<p style = "margin-bottom: 0px;"><b style = "color: #4055df;">' + obj.name + " activated!</b></p>";
                }
            }

            if (obj.rng != "none") {
                if (randomInteger(100) < (rng * obj.rngmod)) {
                    skillMain();
                } else {
                    log("RIP RNG");
                    return;
                }

            } else { //Plain ol' skill trigger
                log("Regular skillmain");
                skillMain();
            }
        }

        let SkillsA = findObjs({ characterid: staffer.id, type: "ability"});
        for (var i in SkillsA){
            SkillsA[i] = SkillsA[i].get("action");
            if (SkillsA[i] != ""){
                SkillsA[i] = JSON.parse(SkillsA[i]);
            }
        }
        let temp = [];
        SkillsA.forEach(function(entry, i) {
            if (SkillsA[i].triggertime == "staff"){
                temp.push(SkillsA[i]);
            }
        });
        SkillsA = temp;
        log(SkillsA);

        let dispHealA = "--";
        let dispHitA = (HitA - AvoB);

        const staveslist = [Heal,Mend,Physic,Recover,Fortify,Bloom_Festal,Sun_Festal,Wane_Festal,Moon_Festal,Great_Festal,Freeze,Enfeeble,Entrap,Rescue,Silence,Hexing_Rod];
        //Script stuff here
        if (WTypeA != "Staves/Rods"){
            chatstr += '<p style = "margin-bottom: 0px;"> Weapon is not a staff!</p>';
        } else {
            for (var i in staveslist){
                if (staveslist[i].name === WNameA){
                    j = staveslist[i];
                    //check for range
                    if (((Range1A) <= (diff)) && ((diff) <= (Range2A))){
                        if (j.type === "healing"){
                            //check for ally
                            if ((AllegianceA == "Player" && AllegianceB == "Player") || (AllegianceA == "Player" && AllegianceB == "Ally") || (AllegianceA == "Ally" && AllegianceB == "Player") || (AllegianceA == "Ally" && AllegianceB == "Ally") || (AllegianceA == "Enemy" && AllegianceB == "Enemy")){
                                //Set with workers in respect to total caps
                                HPVal = j.effect;
                                StaffEXPA = j.exp;
                                dispHealA = HPVal;
                                for (var z in SkillsA){
                                    Skill(staffer, target, SkillsA[z], "staff");
                                }
                                CurrHPB.setWithWorker({current: parseInt(CurrHPB.get("current")) + HPVal});
                                chatstr += '<p style = "margin-bottom: 0px;">' + targetToken.get("name") + " is healed for " + String(HPVal) + " HP!</p>";
                                setAttrs(user.id, {'repeating_weapons_$0_Uses': UsesA - 1})
                                dispHitA = "--";
                            }
                            else {
                                chatstr += '<p style = "margin-bottom: 0px;"> Unit cannot be healed!</p>';
                            }
                        }
                        if (j.type === "status"){
                            //check for enemy
                            if (!((AllegianceA == "Player" && AllegianceB == "Player") || (AllegianceA == "Player" && AllegianceB == "Ally") || (AllegianceA == "Ally" && AllegianceB == "Player") || (AllegianceA == "Ally" && AllegianceB == "Ally") || (AllegianceA == "Enemy" && AllegianceB == "Enemy"))){
                                //Check for RNG
                                if (randomInteger(100) < (HitA - AvoB)){
                                    for (var a in j.target){
                                        log(j.effect);
                                        log(j.target[a]);
                                        j.target[a].setWithWorker("current",j.effect);
                                    }
                                    log(j.status);
                                    targetToken.set(j.status);
                                    setAttrs(user.id, {'repeating_weapons_$0_Uses': UsesA - 1})
                                    chatstr += '<p style = "margin-bottom: 0px;">'+ j.chatmsg + '</p>';
                                    StaffEXPA = j.exp;
                                }
                                else {
                                    chatstr += '<p style = "margin-bottom: 0px;"> Staff misses!</p>';
                                }
                            } else {
                                chatstr += '<p style = "margin-bottom: 0px;"> Unit cannot be targeted!</p>';
                            }
                        }
                    } else {
                        chatstr += '<p style = "margin-bottom: 0px;"> Staff is not in range!</p>';
                    }
                }
            }
        }

        //adapted from Ciorstaidh's Faerun Calendar css
        var divstyle = 'style="width: 189px; border: 1px solid #353535; background-color: #f3f3f3; padding: 5px; color: #353535;"';
        var tablestyle = 'style="text-align:center; margin: 0 auto; border-collapse: collapse; margin-top: 5px; border-radius: 2px"';
        var headstyle = 'style="color: #f3f3f3; font-size: 18px; text-align: left; font-variant: small-caps; background-color: #353535; padding: 4px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;"';
        var namestyle = 'style="background-color: #353535; color: #f3f3f3; text-align: center; font-weight: bold; overflow: hidden; margin: 4px; margin-right: 0px; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;"';
        var wrapperstyle = 'style="display: inline-block; padding:2px;"';
        var statdiv = 'style="border: 1px solid #353535; border-radius: 5px; overflow: hidden; text-align: center; display: inline-block; margin-left: 4px;"';
        var cellabel = 'style="background-color: #353535; color: #f3f3f3; font-weight: bold; padding: 2px;"';
        sendChat(who, '<div ' + divstyle + '>' + //--
                '<div ' + headstyle + '>Staff</div>' + //--
                '<div style = "margin: 0px auto; width: 100%; text-align: center;">' + //--
                '<div ' + wrapperstyle +'>' + //--
                    '<div ' + namestyle + '>'+ staffer.get("name") +'</div>' + //--
                    '<div ' + statdiv +'>' + //--
                        '<table>'+ //--
                            '<tr><td ' + cellabel +'> HP </td> <td style = "padding: 2px;">' + dispHPA + '</td></tr>' + //--
                            '<tr><td ' + cellabel +'> Heal </td> <td style = "padding: 2px;">' + dispHealA + '</td></tr>' + //--
                            '<tr><td ' + cellabel +'> Hit% </td> <td style = "padding: 2px;">' + dispHitA + '</td></tr>' + //--
                            '<tr><td ' + cellabel +'> Crit% </td> <td style = "padding: 2px;">' + "--" + '</td></tr>' + //--
                        '</table>'+ //--
                    '</div>' + //--
                '</div>' + //--

                '<div ' + wrapperstyle +'>' + //--
                    '<div ' + namestyle + '>'+ targetToken.get("name") +'</div>' + //--
                    '<div ' + statdiv +'>' + //--
                        '<table>'+ //--
                            '<tr><td style = "padding: 2px;">' + dispHPB + '</td><td ' + cellabel +'> HP </td></tr>' + //--
                            '<tr><td style = "padding: 2px;">' + "--"  + '</td><td ' + cellabel +'> Heal </td></tr>' + //--
                            '<tr><td style = "padding: 2px;">' + "--"  + '</td><td ' + cellabel +'> Hit% </td></tr>' + //--
                            '<tr><td style = "padding: 2px;">' + "--" + '</td><td ' + cellabel +'> Crit% </td></tr>' + //--
                        '</table>'+ //--
                    '</div>' + //--
                '</div>' + //--
                '</div>' + //--

                '<div style = "height: 1px; background-color: #353535; width: 70%; margin: 0 auto; margin-bottom: 4px;"></div>' + //--
                '<div style = "margin: 0 auto; width: 70%;">' + chatstr + '</div>' + //--
            '</div>'
        );

        //EXP!
        CurrEXP.set("current",EXPA);
        log(EXPA);
        if (CurrEXP.get("current") >= 100){
            CurrEXP.set("current",CurrEXP.get("current")-100);
            //Get growths
            LvA.set("current", parseInt(LvA.get("current")) + 1);
            let Lvstr = '';
            let HPG = Number(getAttrByName(staffer.id, 'hp_gtotal'));
            let StrG = Number(getAttrByName(staffer.id, 'str_gtotal'));
            let MagG = Number(getAttrByName(staffer.id, 'mag_gtotal'));
            let SklG = Number(getAttrByName(staffer.id, 'skl_gtotal'));
            let SpdG = Number(getAttrByName(staffer.id, 'spd_gtotal'));
            let LckG = Number(getAttrByName(staffer.id, 'lck_gtotal'));
            let DefG = Number(getAttrByName(staffer.id, 'def_gtotal'));
            let ResG = Number(getAttrByName(staffer.id, 'res_gtotal'));
            let growthslist = [HPG,StrG,MagG,SklG,SpdG,LckG,DefG,ResG];

            let HPi = Number(getAttrByName(staffer.id, 'hp_i'));
            let Stri = Number(getAttrByName(staffer.id, 'str_i'));
            let Magi = Number(getAttrByName(staffer.id, 'mag_i'));
            let Skli = Number(getAttrByName(staffer.id, 'skl_i'));
            let Spdi = Number(getAttrByName(staffer.id, 'spd_i'));
            let Lcki = Number(getAttrByName(staffer.id, 'lck_i'));
            let Defi = Number(getAttrByName(staffer.id, 'def_i'));
            let Resi = Number(getAttrByName(staffer.id, 'res_i'));
            let sprefix = [HPi,Stri,Magi,Skli,Spdi,Lcki,Defi,Resi];

            let HPSG = findObjs({ characterid: staffer.id, name: "HP_i", type: "attribute"})[0];
            let StrSG = findObjs({ characterid: staffer.id, name: "Str_i", type: "attribute"})[0];
            let MagSG = findObjs({ characterid: staffer.id, name: "Mag_i", type: "attribute"})[0];
            let SklSG = findObjs({ characterid: staffer.id, name: "Skl_i", type: "attribute"})[0];
            let SpdSG = findObjs({ characterid: staffer.id, name: "Spd_i", type: "attribute"})[0];
            let LckSG = findObjs({ characterid: staffer.id, name: "Lck_i", type: "attribute"})[0];
            let DefSG = findObjs({ characterid: staffer.id, name: "Def_i", type: "attribute"})[0];
            let ResSG = findObjs({ characterid: staffer.id, name: "Res_i", type: "attribute"})[0];
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

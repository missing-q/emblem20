//it's time for lag, bois
remove_queue = [];
on("change:graphic:top", function(token){
    //define Skills funct up here this time so it can be used for both enters and exits
    let alreadyMoved = false;
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
    let StattargetU;
    let StattargetE;
    let HPA;
    let HPB;
    let CurrHPA;
    var divstyle = 'style="width: 189px; border: 1px solid #353535; background-color: #f3f3f3; padding: 5px; color: #353535;"';
    var tablestyle = 'style="text-align:center; margin: 0 auto; border-collapse: collapse; margin-top: 5px; border-radius: 2px"';
    var headstyle = 'style="color: #f3f3f3; font-size: 18px; text-align: left; font-variant: small-caps; background-color: #353535; padding: 4px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;"';
    var namestyle = 'style="background-color: #353535; color: #f3f3f3; text-align: center; font-weight: bold; overflow: hidden; margin: 4px; margin-right: 0px; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;"';
    var wrapperstyle = 'style="display: inline-block; padding:2px;"';
    var statdiv = 'style="border: 1px solid #353535; border-radius: 5px; overflow: hidden; text-align: center; display: inline-block; margin-left: 4px;"';
    var cellabel = 'style="background-color: #353535; color: #f3f3f3; font-weight: bold; padding: 2px;"';
    //Skills boi
    function Skill(userid, targetid, obj, triggertime) { //haha END ME
            if (typeof obj != "object") {
                log("obj is not an object :(")
                return;
            }
            if (obj.triggertime != "aura-enter"){
                log("How on earth did this get through?")
                return;
            }
            //no whotriggered checking because it'll always be the attacker
            log("Okay, first barrier passed")
            user = "attacker";
            let who = getObj('character', userid);
            RNGSklU = Number(getAttrByName(userid, 'skl_total'));
            RNGLckU = Number(getAttrByName(userid, 'lck_total'));
            HPA = Number(getAttrByName(userid, 'hp_current'));
            HPB = Number(getAttrByName(targetid, 'hp_current'));
            CurrHPU = findObjs({
                characterid: userid,
                name: "HP_current"
            })[0];
            log(CurrHPU)
            CurrHPE = findObjs({
                characterid: targetid,
                name: "HP_current"
            })[0];
            log(CurrHPE)
            DmgtypeU = ""
            DmgtypeE = "" //doesn't matter since commands are non-combative anyways
            Usertoken = findObjs({ //get the first token on the page that represents the given user
                type: "graphic",
                subtype: "token",
                represents: targetid
            })[0];

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

            HitU = findObjs({
                characterid: userid,
                name: "Hitmod"
            })[0];
            log(HitU)
            HitE = findObjs({
                characterid: targetid,
                name: "Hitmod"
            })[0];
            log(HitE)
            CritU = findObjs({
                characterid: userid,
                name: "Critmod"
            })[0];
            CritE = findObjs({
                characterid: targetid,
                name: "Critmod"
            })[0];
            AvoU = findObjs({
                characterid: userid,
                name: "Avomod"
            })[0];
            AvoE = findObjs({
                characterid: targetid,
                name: "Avomod"
            })[0];
            DdgU = findObjs({
                characterid: userid,
                name: "Ddgmod"
            })[0];
            DdgE = findObjs({
                characterid: targetid,
                name: "Ddgmod"
            })[0];
            DmgU = findObjs({
                characterid: userid,
                name: "Dmgmod"
            })[0];
            DmgE = findObjs({
                characterid: targetid,
                name: "Dmgmod"
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
                let removevals_temp = [obj.u_hitmod, obj.e_hitmod, obj.u_critmod, obj.e_critmod, obj.u_ddgmod, obj.e_ddgmod, obj.u_avomod, obj.e_avomod, obj.u_damagemod, obj.e_damagemod];
                let removeobjs_temp = [HitU, HitE, CritU, CritE, DdgU, DdgE, AvoU, AvoE, DmgU, DmgE];
                let removevals = [];
                let removeobjs = [];

                for (var i in removevals_temp){
                    var temp = parseInt(removevals_temp[i])
                    if (temp != 0){
                        removevals.push(temp * -1) //inverse val
                        removeobjs.push(removeobjs_temp[i])//corresponding obj
                    }
                }

                log(removevals)
                log(removeobjs)

                let HealmodU = parseInt(eval(obj.u_healfactor));
                let HealmodE = parseInt(eval(obj.e_healfactor));

                for (var i in removeobjs_temp){
                    if (removeobjs_temp[i] != undefined){
                       removeobjs_temp[i].setWithWorker({
                           current: parseInt(removeobjs_temp[i].get("current")) + parseInt(removevals_temp[i])
                       });
                       log(parseInt(removevals_temp[i]))
                    }
                }

                log("HealmodU is" + HealmodU)

                log(obj.u_stat_target);
                log(obj.e_stat_target);
                //determining the actual stat targets- both of them should be arrays

                if (obj.u_stat_target != "none") {
                    StattargetU = eval(obj.u_stat_target);
                }
                if (obj.e_stat_target != "none") {
                    StattargetE = eval(obj.e_stat_target);
                }

                let StattargetmodU = eval(obj.u_stat_targetmod); //should also be arrays
                let StattargetmodE = eval(obj.e_stat_targetmod);
                //let STCounterU = eval(obj.u_stat_targetcounter);
                //let STCounterE = eval(obj.e_stat_targetcounter);
                log(StattargetE);
                log(StattargetmodE);
                let currvlU = [];
                let newvlU = [];
                let currvlE = [];
                let newvlE = [];


                if (obj.u_stat_target != "none" && StattargetU != undefined){
                    for (var i in StattargetmodU){
                        log(StattargetU);
                        log(StattargetU[i])
                        log(StattargetmodU[i])
                        currvlU[i] = parseInt(StattargetU[i].get("current"));
                        newvlU[i] = parseInt(StattargetmodU[i])
                        log(currvlU[i]);
                        log(newvlU[i])
                        StattargetU[i].setWithWorker({
                            current: currvlU[i] + newvlU[i]
                        });
                        log("Set U-targeted stat to "+ StattargetU[i].get("current"));
                        //aura nonsense
                        removevals.push(newvlU[i] * -1);
                        removeobjs.push(StattargetU[i]);
                    }
                }

                if (obj.e_stat_target != "none" && StattargetE != undefined){
                    for (var i in StattargetmodE){
                        log(StattargetE);
                        log(StattargetE[i])
                        log(StattargetmodE[i])
                        currvlE[i] = parseInt(StattargetE[i].get("current"));
                        newvlE[i] = parseInt(StattargetmodE[i])
                        log(currvlE[i]);
                        log(newvlE[i])
                        StattargetE[i].setWithWorker({
                            current: currvlE[i] + newvlE[i]
                        });
                        log("Set E-targeted stat to "+ StattargetE[i].get("current"));
                        //aura nonsense
                        removevals.push(newvlE[i] * -1);
                        removeobjs.push(StattargetE[i]);
                    }
                }
                log(removevals);
                log(removeobjs)
                remove_queue.push({
                    "userid": userid,
                    "targetid" : targetid,
                    "removevals": removevals,
                    "removeobjs": removeobjs
                })

                HPA = parseInt(HPA) + HealmodU; //this has to be here because sometimes it'll be stupid and overflow if it's not >:(
                HPB = parseInt(HPB) + HealmodE;

                log(HPA)

                if (obj.radius != 0) {
                    //tortured screaming
                    let allc;
                    let tokenInRadius;
                    if (obj.radius_allegiance == "enemy"){
                        allc = true;
                        tokenInRadius = filterObjs(function(token) {
                            if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken, token) > obj.radius || token.get("represents") == Usertoken.get("represents") || (getAttrByName(token.get('represents'), 'all') != getAttrByName(Usertoken.get('represents'), 'all')) != allc ) return false;
                            else return true;
                        });
                    } else if (obj.radius_allegiance == "ally"){
                        allc = false;
                        tokenInRadius = filterObjs(function(token) {
                            if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken, token) > obj.radius || token.get("represents") == Usertoken.get("represents") || (getAttrByName(token.get('represents'), 'all') != getAttrByName(Usertoken.get('represents'), 'all')) != allc ) return false;
                            else return true;
                        });
                    } else {
                        tokenInRadius = filterObjs(function(token) {
                            if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken, token) > obj.radius || token.get("represents") == Usertoken.get("represents")) return false;
                            else return true;
                        });
                    }
                    log(allc)
                    log("Tokens in radius are: ")
                    for (var i in tokenInRadius) {
                        log(tokenInRadius[i])
                            //stat targets
                        let char = tokenInRadius[i].get("represents")
                        let HPcurrC = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        log(HPcurrC)
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
                        let counter = eval(obj.radius_counter);
                        let rad_effect;
                        let def_target;

                        for (var i in effect) {
                          log(target[i].get("current"))
                          rad_effect = Number(target[i].get("current")) + parseInt(Number(effect[i]));
                          def_target = Number(target[i].get("current"));
                          target[i].setWithWorker({
                              current: rad_effect
                          });
                          log("target is")
                          log(target[i].get("current"))

                          if ((target[i] == HPcurrC) && (char == userid)) {
                              HPA += parseInt(effect[i])
                          }

                          if ((target[i] == HPcurrC) && (char == targetid)) {
                              HPB += parseInt(effect[i])
                          }

                          //queueeeee
                          if (target[i] != HPcurrC) {
                            if (parseInt(effect[i]) > 0){
                                queue.push([target[i], "decrement", counter[i], 0, "combat-r"])
                                log([target[i], "decrement", counter[i], 0, "combat-r"])
                                log("Pushed to queue!")
                            } else {
                                queue.push([target[i], "increment", counter[i], 0, "combat-r"])
                                log([target[i], "increment", counter[i], 0, "combat-r"])
                                log("Pushed to queue!")
                            }

                            //check queue for repeated buff/debuffs
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
                          }
                          //:OOOOOO
                        }
                    }
                }
                CurrHPU.setWithWorker({
                    current: HPA
                });
                CurrHPE.setWithWorker({
                    current: HPB
                });
                //recursionnn
                if (obj.children_skills != []) {
                    for (var y in obj.children_skills) {
                        let Child_Skill = JSON.parse(obj.children_skills[y]);
                        Skill(userid, targetid, Child_Skill, "any"); //child implementations of preexisting skills should have the triggertime "any" as well
                    }
                }

                let Chatstr;
                if (obj.custom_string != "") {
                    Chatstr = '<p style = "margin-bottom: 0px;"> <b style = "color: #4055df;">' + obj.custom_string + "</b></p>"
                } else {
                    Chatstr = '<p style = "margin-bottom: 0px;"><b style = "color: #4055df;">'+ who.get("name") + " used " + obj.name + "!</b></p>"
                }
                sendChat("Sys", '<div ' + divstyle + '>' + //--
                    '<div ' + headstyle + '>Skill</div>' + //--
                    '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + Chatstr + '</div>' + //--
                '</div>'
                );
                //finally, if everything else suceeds up to that point
                Usertoken.set("status_archery-target", true);

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
    /*----------------*/
    //if the token is generating the aura and moves
    if ((token.get("aura1_radius") != "" || 0) && (token.get("represents") != "")){
        log("token generating aura")
        let radius = parseInt(token.get("aura1_radius") / 5);
        let tokenInRadius = filterObjs(function(obj) {
            if (obj.get('type') !== 'graphic' || obj.get('subtype') !== 'token' || obj.get('represents') == "" || ManhDist(token,obj) > radius || obj.get("represents") == token.get("represents")) return false;
            else return true;
        });
        log(tokenInRadius);
        let user = getObj('character', token.get('represents'));
        log(user)

        //filter skills
        Skills = findObjs({ characterid: user.id, type: "ability"});
        let temp = [];
        if (Skills != []){
            for (var i in Skills){
                Skills[i] = Skills[i].get("action");
                Skills[i] = JSON.parse(Skills[i])
                if (Skills[i].triggertime == "aura-enter"){
                temp.push(Skills[i])
                }
            }
        }
        Skills = temp;
        let char;

        for (var i in tokenInRadius){
            //only one aura active at a time
            for (var j in Skills){
                if (!token.get("status_archery-target")) {
                   log(j)
                    char = getObj('character', tokenInRadius[i].get('represents'));
                    log(char)
                    Skill(user.id, char.id, Skills[j], "aura-enter")
                }
            }
            log("A");
        }
        log('AAAAAAA')

    }

    //if the token is entering an aura
    if ((token.get("aura1_radius") == "" || 0) && (token.get("represents") != "") && (!token.get("status_archery-target")) ){
        log("aura-enter attempt");
        let tokenInRadius = filterObjs(function(obj) {
            if (obj.get('type') !== 'graphic' || obj.get('subtype') !== 'token' || obj.get('represents') == "" || (obj.get("aura1_radius") == "" || 0) || ManhDist(obj,token) > parseInt(obj.get("aura1_radius") / 5) || obj.get("represents") == token.get("represents")) return false;
            else return true;
        });
        //get the first one in the list since only one aura can be active at a time
        let char = tokenInRadius[0];
        if (char != undefined){
            let user = getObj('character', char.get('represents'));
            let target = getObj('character', token.get('represents'));

            Skills = findObjs({ characterid: user.id, type: "ability"});
            let temp = [];
            if (Skills != []){
                for (var i in Skills){
                    Skills[i] = Skills[i].get("action");
                    Skills[i] = JSON.parse(Skills[i])
                    if (Skills[i].triggertime == "aura-enter"){
                    temp.push(Skills[i])
                    }
                }
            }
            Skills = temp;
            log(Skills)

            //skills time
            //only one aura active at a time
            for (var j in Skills){
                if (!token.get("status_archery-target")) {
                    log(j)
                    Skill(user.id, target.id, Skills[j], "aura-enter")
                    alreadyMoved = true;
                }
            }
            //
        }
        //
    }

    //if the token is exiting an aura
    if ((token.get("aura1_radius") == "" || 0) && (token.get("represents") != "") && (token.get("status_archery-target")) && (!alreadyMoved) ){
        log("aura-exit attempt")
        let tokenInRadius = filterObjs(function(obj) {
            if (obj.get('type') !== 'graphic' || obj.get('subtype') !== 'token' || obj.get('represents') == "" || (obj.get("aura1_radius") == "" || 0) || ManhDist(obj,token) < parseInt(obj.get("aura1_radius") / 5) || obj.get("represents") == token.get("represents")) return false;
            else return true;
        });
        log(tokenInRadius);
        log(remove_queue);

        if (tokenInRadius){
            log("We in boys")
            for (var i in tokenInRadius){
                log(i)
                for (var j in remove_queue){
                    let obj = remove_queue[j]
                    log(obj)
                    if (obj.userid == tokenInRadius[i].get("represents") && obj.targetid == token.get("represents")){

                        for (var i in obj.removevals){
                            obj.removeobjs[i].setWithWorker({
                                current: parseInt(obj.removeobjs[i].get("current")) + parseInt(obj.removevals[i])
                            });
                        }
                        token.set("status_archery-target", false);

                        let Chatstr = "Aura effects cleared!"
                        sendChat("System", '<div ' + divstyle + '>' + //--
                            '<div ' + headstyle + '>Skill</div>' + //--
                            '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + Chatstr + '</div>' + //--
                            '</div>'
                        );
                        //
                        remove_queue.shift();
                        j--
                    }
                    //
                }
            }
        }
        //
    }

});


/*Literally the exact same thing except it's for horizontal movement now
-------------------------------Line-------------------------------------
-------------------------------Breaks-----------------------------------
--------------------------------For-------------------------------------
------------------------------Clarity-----------------------------------
--------------------------------Of--------------------------------------
------------------------------Reading-----------------------------------
*/

on("change:graphic:left", function(token){
    //define Skills funct up here this time so it can be used for both enters and exits
    let alreadyMoved = false;
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
    let StattargetU;
    let StattargetE;
    let HPA;
    let HPB;
    let CurrHPA;
    var divstyle = 'style="width: 189px; border: 1px solid #353535; background-color: #f3f3f3; padding: 5px; color: #353535;"';
    var tablestyle = 'style="text-align:center; margin: 0 auto; border-collapse: collapse; margin-top: 5px; border-radius: 2px"';
    var headstyle = 'style="color: #f3f3f3; font-size: 18px; text-align: left; font-variant: small-caps; background-color: #353535; padding: 4px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;"';
    var namestyle = 'style="background-color: #353535; color: #f3f3f3; text-align: center; font-weight: bold; overflow: hidden; margin: 4px; margin-right: 0px; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;"';
    var wrapperstyle = 'style="display: inline-block; padding:2px;"';
    var statdiv = 'style="border: 1px solid #353535; border-radius: 5px; overflow: hidden; text-align: center; display: inline-block; margin-left: 4px;"';
    var cellabel = 'style="background-color: #353535; color: #f3f3f3; font-weight: bold; padding: 2px;"';
    //Skills boi
    function Skill(userid, targetid, obj, triggertime) { //haha END ME
            if (typeof obj != "object") {
                log("obj is not an object :(")
                return;
            }
            if (obj.triggertime != "aura-enter"){
                log("How on earth did this get through?")
                return;
            }
            //no whotriggered checking because it'll always be the attacker
            log("Okay, first barrier passed")
            user = "attacker";
            let who = getObj('character', userid);
            RNGSklU = Number(getAttrByName(userid, 'skl_total'));
            RNGLckU = Number(getAttrByName(userid, 'lck_total'));
            HPA = Number(getAttrByName(userid, 'hp_current'));
            HPB = Number(getAttrByName(targetid, 'hp_current'));
            CurrHPU = findObjs({
                characterid: userid,
                name: "HP_current"
            })[0];
            log(CurrHPU)
            CurrHPE = findObjs({
                characterid: targetid,
                name: "HP_current"
            })[0];
            log(CurrHPE)
            DmgtypeU = ""
            DmgtypeE = "" //doesn't matter since commands are non-combative anyways
            Usertoken = findObjs({ //get the first token on the page that represents the given user
                type: "graphic",
                subtype: "token",
                represents: targetid
            })[0];

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

            HitU = findObjs({
                characterid: userid,
                name: "Hitmod"
            })[0];
            log(HitU)
            HitE = findObjs({
                characterid: targetid,
                name: "Hitmod"
            })[0];
            log(HitE)
            CritU = findObjs({
                characterid: userid,
                name: "Critmod"
            })[0];
            CritE = findObjs({
                characterid: targetid,
                name: "Critmod"
            })[0];
            AvoU = findObjs({
                characterid: userid,
                name: "Avomod"
            })[0];
            AvoE = findObjs({
                characterid: targetid,
                name: "Avomod"
            })[0];
            DdgU = findObjs({
                characterid: userid,
                name: "Ddgmod"
            })[0];
            DdgE = findObjs({
                characterid: targetid,
                name: "Ddgmod"
            })[0];
            DmgU = findObjs({
                characterid: userid,
                name: "Dmgmod"
            })[0];
            DmgE = findObjs({
                characterid: targetid,
                name: "Dmgmod"
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
                let removevals_temp = [obj.u_hitmod, obj.e_hitmod, obj.u_critmod, obj.e_critmod, obj.u_ddgmod, obj.e_ddgmod, obj.u_avomod, obj.e_avomod, obj.u_damagemod, obj.e_damagemod];
                let removeobjs_temp = [HitU, HitE, CritU, CritE, DdgU, DdgE, AvoU, AvoE, DmgU, DmgE];
                let removevals = [];
                let removeobjs = [];

                for (var i in removevals_temp){
                    var temp = parseInt(removevals_temp[i])
                    if (temp != 0){
                        removevals.push(temp * -1) //inverse val
                        removeobjs.push(removeobjs_temp[i])//corresponding obj
                    }
                }

                log(removevals)
                log(removeobjs)

                let HealmodU = parseInt(eval(obj.u_healfactor));
                let HealmodE = parseInt(eval(obj.e_healfactor));

                for (var i in removeobjs_temp){
                    if (removeobjs_temp[i] != undefined){
                       removeobjs_temp[i].setWithWorker({
                           current: parseInt(removeobjs_temp[i].get("current")) + parseInt(removevals_temp[i])
                       });
                       log(parseInt(removevals_temp[i]))
                    }
                }

                log("HealmodU is" + HealmodU)

                log(obj.u_stat_target);
                log(obj.e_stat_target);
                //determining the actual stat targets- both of them should be arrays

                if (obj.u_stat_target != "none") {
                    StattargetU = eval(obj.u_stat_target);
                }
                if (obj.e_stat_target != "none") {
                    StattargetE = eval(obj.e_stat_target);
                }

                let StattargetmodU = eval(obj.u_stat_targetmod); //should also be arrays
                let StattargetmodE = eval(obj.e_stat_targetmod);
                //let STCounterU = eval(obj.u_stat_targetcounter);
                //let STCounterE = eval(obj.e_stat_targetcounter);
                log(StattargetE);
                log(StattargetmodE);
                let currvlU = [];
                let newvlU = [];
                let currvlE = [];
                let newvlE = [];


                if (obj.u_stat_target != "none" && StattargetU != undefined){
                    for (var i in StattargetmodU){
                        log(StattargetU);
                        log(StattargetU[i])
                        log(StattargetmodU[i])
                        currvlU[i] = parseInt(StattargetU[i].get("current"));
                        newvlU[i] = parseInt(StattargetmodU[i])
                        log(currvlU[i]);
                        log(newvlU[i])
                        StattargetU[i].setWithWorker({
                            current: currvlU[i] + newvlU[i]
                        });
                        log("Set U-targeted stat to "+ StattargetU[i].get("current"));
                        //aura nonsense
                        removevals.push(newvlU[i] * -1);
                        removeobjs.push(StattargetU[i]);
                    }
                }

                if (obj.e_stat_target != "none" && StattargetE != undefined){
                    for (var i in StattargetmodE){
                        log(StattargetE);
                        log(StattargetE[i])
                        log(StattargetmodE[i])
                        currvlE[i] = parseInt(StattargetE[i].get("current"));
                        newvlE[i] = parseInt(StattargetmodE[i])
                        log(currvlE[i]);
                        log(newvlE[i])
                        StattargetE[i].setWithWorker({
                            current: currvlE[i] + newvlE[i]
                        });
                        log("Set E-targeted stat to "+ StattargetE[i].get("current"));
                        //aura nonsense
                        removevals.push(newvlE[i] * -1);
                        removeobjs.push(StattargetE[i]);
                    }
                }
                log(removevals);
                log(removeobjs)
                remove_queue.push({
                    "userid": userid,
                    "targetid" : targetid,
                    "removevals": removevals,
                    "removeobjs": removeobjs
                })

                HPA = parseInt(HPA) + HealmodU; //this has to be here because sometimes it'll be stupid and overflow if it's not >:(
                HPB = parseInt(HPB) + HealmodE;

                log(HPA)

                if (obj.radius != 0) {
                    //tortured screaming
                    let allc;
                    let tokenInRadius;
                    if (obj.radius_allegiance == "enemy"){
                        allc = true;
                        tokenInRadius = filterObjs(function(token) {
                            if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken, token) > obj.radius || token.get("represents") == Usertoken.get("represents") || (getAttrByName(token.get('represents'), 'all') != getAttrByName(Usertoken.get('represents'), 'all')) != allc ) return false;
                            else return true;
                        });
                    } else if (obj.radius_allegiance == "ally"){
                        allc = false;
                        tokenInRadius = filterObjs(function(token) {
                            if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken, token) > obj.radius || token.get("represents") == Usertoken.get("represents") || (getAttrByName(token.get('represents'), 'all') != getAttrByName(Usertoken.get('represents'), 'all')) != allc ) return false;
                            else return true;
                        });
                    } else {
                        tokenInRadius = filterObjs(function(token) {
                            if ((token.get('type') !== 'graphic' || token.get('subtype') !== 'token' || token.get('represents') == "") || ManhDist(Usertoken, token) > obj.radius || token.get("represents") == Usertoken.get("represents")) return false;
                            else return true;
                        });
                    }
                    log(allc)
                    log("Tokens in radius are: ")
                    for (var i in tokenInRadius) {
                        log(tokenInRadius[i])
                            //stat targets
                        let char = tokenInRadius[i].get("represents")
                        let HPcurrC = findObjs({
                            characterid: char,
                            name: "HP_current"
                        })[0];
                        log(HPcurrC)
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
                        let counter = eval(obj.radius_counter);
                        let rad_effect;
                        let def_target;

                        for (var i in effect) {
                          log(target[i].get("current"))
                          rad_effect = Number(target[i].get("current")) + parseInt(Number(effect[i]));
                          def_target = Number(target[i].get("current"));
                          target[i].setWithWorker({
                              current: rad_effect
                          });
                          log("target is")
                          log(target[i].get("current"))

                          if ((target[i] == HPcurrC) && (char == userid)) {
                              HPA += parseInt(effect[i])
                          }

                          if ((target[i] == HPcurrC) && (char == targetid)) {
                              HPB += parseInt(effect[i])
                          }

                          //queueeeee
                          if (target[i] != HPcurrC) {
                            if (parseInt(effect[i]) > 0){
                                queue.push([target[i], "decrement", counter[i], 0, "combat-r"])
                                log([target[i], "decrement", counter[i], 0, "combat-r"])
                                log("Pushed to queue!")
                            } else {
                                queue.push([target[i], "increment", counter[i], 0, "combat-r"])
                                log([target[i], "increment", counter[i], 0, "combat-r"])
                                log("Pushed to queue!")
                            }

                            //check queue for repeated buff/debuffs
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
                          }
                          //:OOOOOO
                        }
                    }
                }
                CurrHPU.setWithWorker({
                    current: HPA
                });
                CurrHPE.setWithWorker({
                    current: HPB
                });
                //recursionnn
                if (obj.children_skills != []) {
                    for (var y in obj.children_skills) {
                        let Child_Skill = JSON.parse(obj.children_skills[y]);
                        Skill(userid, targetid, Child_Skill, "any"); //child implementations of preexisting skills should have the triggertime "any" as well
                    }
                }

                let Chatstr;
                if (obj.custom_string != "") {
                    Chatstr = '<p style = "margin-bottom: 0px;"> <b style = "color: #4055df;">' + obj.custom_string + "</b></p>"
                } else {
                    Chatstr = '<p style = "margin-bottom: 0px;"><b style = "color: #4055df;">'+ who.get("name") + " used " + obj.name + "!</b></p>"
                }
                sendChat("Sys", '<div ' + divstyle + '>' + //--
                    '<div ' + headstyle + '>Skill</div>' + //--
                    '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + Chatstr + '</div>' + //--
                '</div>'
                );
                //finally, if everything else suceeds up to that point
                Usertoken.set("status_archery-target", true);

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
    /*----------------*/
    //if the token is generating the aura and moves
    if ((token.get("aura1_radius") != "" || 0) && (token.get("represents") != "")){
        log("token generating aura")
        let radius = parseInt(token.get("aura1_radius") / 5);
        let tokenInRadius = filterObjs(function(obj) {
            if (obj.get('type') !== 'graphic' || obj.get('subtype') !== 'token' || obj.get('represents') == "" || ManhDist(token,obj) > radius || obj.get("represents") == token.get("represents")) return false;
            else return true;
        });
        log(tokenInRadius);
        let user = getObj('character', token.get('represents'));
        log(user)

        //filter skills
        Skills = findObjs({ characterid: user.id, type: "ability"});
        let temp = [];
        if (Skills != []){
            for (var i in Skills){
                Skills[i] = Skills[i].get("action");
                Skills[i] = JSON.parse(Skills[i])
                if (Skills[i].triggertime == "aura-enter"){
                temp.push(Skills[i])
                }
            }
        }
        Skills = temp;
        let char;

        for (var i in tokenInRadius){
            //only one aura active at a time
            for (var j in Skills){
                if (!token.get("status_archery-target")) {
                   log(j)
                    char = getObj('character', tokenInRadius[i].get('represents'));
                    log(char)
                    Skill(user.id, char.id, Skills[j], "aura-enter")
                }
            }
            log("A");
        }
        log('AAAAAAA')

    }

    //if the token is entering an aura
    if ((token.get("aura1_radius") == "" || 0) && (token.get("represents") != "") && (!token.get("status_archery-target")) ){
        log("aura-enter attempt");
        let tokenInRadius = filterObjs(function(obj) {
            if (obj.get('type') !== 'graphic' || obj.get('subtype') !== 'token' || obj.get('represents') == "" || (obj.get("aura1_radius") == "" || 0) || ManhDist(obj,token) > parseInt(obj.get("aura1_radius") / 5) || obj.get("represents") == token.get("represents")) return false;
            else return true;
        });
        //get the first one in the list since only one aura can be active at a time
        let char = tokenInRadius[0];
        if (char != undefined){
            let user = getObj('character', char.get('represents'));
            let target = getObj('character', token.get('represents'));

            Skills = findObjs({ characterid: user.id, type: "ability"});
            let temp = [];
            if (Skills != []){
                for (var i in Skills){
                    Skills[i] = Skills[i].get("action");
                    Skills[i] = JSON.parse(Skills[i])
                    if (Skills[i].triggertime == "aura-enter"){
                    temp.push(Skills[i])
                    }
                }
            }
            Skills = temp;
            log(Skills)

            //skills time
            //only one aura active at a time
            for (var j in Skills){
                if (!token.get("status_archery-target")) {
                    log(j)
                    Skill(user.id, target.id, Skills[j], "aura-enter")
                    alreadyMoved = true;
                }
            }
            //
        }
        //
    }

    //if the token is exiting an aura
    if ((token.get("aura1_radius") == "" || 0) && (token.get("represents") != "") && (token.get("status_archery-target")) && (!alreadyMoved) ){
        log("aura-exit attempt")
        let tokenInRadius = filterObjs(function(obj) {
            if (obj.get('type') !== 'graphic' || obj.get('subtype') !== 'token' || obj.get('represents') == "" || (obj.get("aura1_radius") == "" || 0) || ManhDist(obj,token) < parseInt(obj.get("aura1_radius") / 5) || obj.get("represents") == token.get("represents")) return false;
            else return true;
        });
        log(tokenInRadius);
        log(remove_queue);

        if (tokenInRadius){
            log("We in boys")
            for (var i in tokenInRadius){
                log(i)
                for (var j in remove_queue){
                    let obj = remove_queue[j]
                    log(obj)
                    if (obj.userid == tokenInRadius[i].get("represents") && obj.targetid == token.get("represents")){

                        for (var i in obj.removevals){
                            obj.removeobjs[i].setWithWorker({
                                current: parseInt(obj.removeobjs[i].get("current")) + parseInt(obj.removevals[i])
                            });
                        }
                        token.set("status_archery-target", false);

                        let Chatstr = "Aura effects cleared!"
                        sendChat("System", '<div ' + divstyle + '>' + //--
                            '<div ' + headstyle + '>Skill</div>' + //--
                            '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + Chatstr + '</div>' + //--
                            '</div>'
                        );
                        //
                        remove_queue.shift();
                        j--
                    }
                    //
                }
            }
        }
        //
    }

});

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
        let CurrHPA = findObjs({ characterid: staffer.id, name: "HP_current"})[0];
        //Target stats for tasty statuses
        let CurrHPB = findObjs({ characterid: target.id, name: "HP_current"})[0];
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
        let WNameA = getAttrByName(staffer.id, 'f_WName');
        let WTypeA = getAttrByName(staffer.id, 'f_WType');
        let MtA = getAttrByName(staffer.id, 'f_Mt');
        let WtA = getAttrByName(staffer.id, 'f_Wt');
        let Range1A = getAttrByName(staffer.id, 'f_Range1');
        let Range2A = getAttrByName(staffer.id, 'f_Range2');
        let AXCoord = selectedToken.get("left");
        let AYCoord = selectedToken.get("top");
        let BXCoord = targetToken.get("left");
        let BYCoord = targetToken.get("top");
        let diff = parseInt((Math.abs(AXCoord - BXCoord))+(Math.abs(AYCoord - BYCoord)));
        log(diff)
        chatstr = "/me uses " + WNameA + "!"

        const Heal = {
            name : "Heal",
            type : "healing",
            effect : 10 + (Math.round(MagA/3))
        };
        const Mend = {
            name : "Mend",
            type : "healing",
            effect : 20 + (Math.round(MagA/3))
        };
        const Physic = {
            name : "Physic",
            type : "healing",
            effect : 7 + (Math.round(MagA/3))
        };
        const Recover = {
            name : "Recover",
            type : "healing",
            effect : 35 + (Math.round(MagA/3))
        };
        const Fortify = {
            name : "Fortify",
            type : "healing",
            effect : 7 + (Math.round(MagA/3))
        };
        const Bloom_Festal = {
            name : "Bloom Festal",
            type : "healing",
            effect : 7 + (Math.round(MagA/3))
        };
        const Sun_Festal = {
            name : "Sun Festal",
            type : "healing",
            effect : 14 + (Math.round(MagA/3))
        };
        const Wane_Festal = {
            name : "Wane Festal",
            type : "healing",
            effect : 2 + (Math.round(MagA/3))
        };
        const Moon_Festal = {
            name : "Moon Festal",
            type : "healing",
            effect : 25 + (Math.round(MagA/3))
        };
        const Great_Festal = {
            name : "Great Festal",
            type : "healing",
            effect : 2 + (Math.round(MagA/3))
        };
        const Freeze = {
            name : "Freeze",
            type : "status",
            target: [Movbd],
            effect : Number(MovB.get("current")) * -1,
            status: {status_tread: true},
            chatmsg: targetToken.get("name") + " is unable to move this turn!"
        };
        const Enfeeble = {
            name : "Enfeeble",
            type : "status",
            target: [Strbd,Magbd,Sklbd,Spdbd,Lckbd,Defbd,Resbd],
            effect : -4,
            status: {"status_back-pain": 4},
            chatmsg: targetToken.get("name") + " is enfeebled! -4 to every stat (decreases by 1 each turn)"
        };
        const Entrap = {
            name : "Entrap",
            type : "status",
            target: [Movbd],
            effect : 0,
            status: {"status_grab": false},
            chatmsg: targetToken.get("name") + " is moved next to the enemy!"
        };
        const Rescue = {
            name : "Rescue",
            type : "status",
            target: [Movbd],
            effect : 0,
            status: {"status_grab": false},
            chatmsg: targetToken.get("name") + " is rescued!"
        };
        const Silence = {
            name : "Silence",
            type : "status",
            target: [Magbd],
            effect : Number(MagB.get("current")) * -1,
            status: {status_interdiction: true},
            chatmsg: targetToken.get("name") + " cannot use magic for the next turn!"
        };
        const Hexing_Rod = {
            name : "Hexing Rod",
            type : "status",
            target: [HPbd],
            effect : Math.round(Number(MaxHPB.get("current")) * -0.5),
            status: {"status_broken-heart": true},
            chatmsg: targetToken.get("name") + "'s HP was halved!"
        };

        const staveslist = [Heal,Mend,Physic,Recover,Fortify,Bloom_Festal,Sun_Festal,Wane_Festal,Moon_Festal,Great_Festal,Freeze,Enfeeble,Entrap,Rescue,Silence,Hexing_Rod];
        //Script stuff here
        if (WTypeA != "Staves/Rods"){
            chatstr += "\n Weapon is not a staff!"
        } else {
            for (var i in staveslist){
                if (staveslist[i].name === WNameA){
                    j = staveslist[i];
                    //check for range
                    log("Range "+ ((Range1A) <= (diff/70)) && ((diff/70) <= (Range2A)))
                    if (((Range1A) <= (diff/70)) && ((diff/70) <= (Range2A))){
                        if (j.type === "healing"){
                            //Set with workers in respect to total caps
                            HPVal = Number(CurrHPB.get("current")) + j.effect
                            CurrHPB.setWithWorker({current: HPVal})
                            chatstr += "\n" + targetToken.get("name") + " is healed for " + String(j.effect) + " HP!"
                        }
                        if (j.type === "status"){
                            //Check for RNG
                            if (randomInteger(100) < (HitA - AvoB)){
                                for (var a in j.target){
                                    log(j.effect);
                                    log(j.target[a])
                                    j.target[a].setWithWorker("current",j.effect)
                                }
                                log(j.status);
                                targetToken.set(j.status);
                                chatstr += "\n"+ j.chatmsg
                            }
                            else {
                                chatstr += "\n Staff misses!"
                            }
                        }
                    } else {
                        chatstr += "\n Staff is not in range!"
                    }
                }
            }
        }
        sendChat(who, chatstr);

    }
});

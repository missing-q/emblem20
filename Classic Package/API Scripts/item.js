on('chat:message', function(msg) {
    // Do nothing for messages which aren't API commands
    if (msg.type != 'api') return;

    // Each parameter in the API command is separated by a space, and the first part is the command itself
    var parts = msg.content.split(' ');
    // I like to remove the exclamation point at the start of the command name, but it's not required
    var command = parts.shift().substring(1);

    // Don't run your API command logic if some other command was sent!
    if (command == 'item') {

        // Make sure enough parameters were sent, to avoid index out of bounds
        if (parts.length < 1) {
            sendChat('SYSTEM', 'You must provide a selected token id.');
            return;
        }

        // Assume the first two parameters are object IDs
        var selectedId = parts[0];
        var item = parts.slice(1).join(" ")
        // Attempt to get the objects as graphics
        var selectedToken = getObj('graphic', selectedId);

        // If the objects *aren't* graphics, or the parameters weren't IDs, fail gracefully
        if (!selectedToken) {
            sendChat('SYSTEM', 'Selected token id not provided.');
            return;
        }

        // Get a variable to use as the "who" for sendChat
        var who = getObj('character', selectedToken.get('represents'));
        if (!who) {
            who = selectedToken.get('name');
        } else {
            who = 'character|' + who.id;
        }

        if (item == ""){
            sendChat("System","No item!")
            return;
        }
        var user = getObj('character', selectedToken.get('represents'));
        let SkillsU = findObjs({ characterid: user.id, type: "ability"});
        //Check to make sure that the tokens represent characters
        if (selectedToken.get('represents') === ""){
            sendChat('SYSTEM', 'Token must be linked to a character in the journal!');
            return;
        }
        //Personal values, for statboosters
        let HPi = findObjs({ characterid: user.id, name: "HP_i", type: "attribute"})[0];
        let Stri = findObjs({ characterid: user.id, name: "Str_i", type: "attribute"})[0];
        let Magi = findObjs({ characterid: user.id, name: "Mag_i", type: "attribute"})[0];
        let Skli = findObjs({ characterid: user.id, name: "Skl_i", type: "attribute"})[0];
        let Spdi = findObjs({ characterid: user.id, name: "Spd_i", type: "attribute"})[0];
        let Lcki = findObjs({ characterid: user.id, name: "Lck_i", type: "attribute"})[0];
        let Defi = findObjs({ characterid: user.id, name: "Def_i", type: "attribute"})[0];
        let Resi = findObjs({ characterid: user.id, name: "Res_i", type: "attribute"})[0];
        //Buff/debuff values, for temp statboosters
        let HPbd = findObjs({ characterid: user.id, name: "HP_bd", type: "attribute"})[0];
        let Strbd = findObjs({ characterid: user.id, name: "Str_bd", type: "attribute"})[0];
        let Magbd = findObjs({ characterid: user.id, name: "Mag_bd", type: "attribute"})[0];
        let Sklbd = findObjs({ characterid: user.id, name: "Skl_bd", type: "attribute"})[0];
        let Spdbd = findObjs({ characterid: user.id, name: "Spd_bd", type: "attribute"})[0];
        let Lckbd = findObjs({ characterid: user.id, name: "Lck_bd", type: "attribute"})[0];
        let Defbd = findObjs({ characterid: user.id, name: "Def_bd", type: "attribute"})[0];
        let Resbd = findObjs({ characterid: user.id, name: "Res_bd", type: "attribute"})[0];
        //Current HP, for healing items
        let HPcurrent = findObjs({ characterid: user.id, name: "HP_current", type: "attribute"})[0];
        let Userclass = findObjs({ characterid: user.id, name: "Class", type: "attribute"})[0];

        let itemuses = ["item_uses0", "item_uses1", "item_uses2"]
        let itemnames = ["item_name0", "item_name1", "item_name2"]
        log(itemuses)
        log(itemnames)
        //All items as objects QnQ
        //Temp statboosters
        const Hearty_Cheese = {
            name: "Hearty Cheese",
            type: "temp_statbooster",
            target: HPbd,
            effect: 2,
            targetstr: "HP"
        }
        const Spicy_Chicken = {
            name: "Spicy Chicken",
            type: "temp_statbooster",
            target: Strbd,
            effect: 2,
            targetstr: "Str"
        }
        const Sweet_Honey = {
            name: "Sweet Honey",
            type: "temp_statbooster",
            target: Magbd,
            effect: 2,
            targetstr: "Mag"
        }
        const Fresh_Bread = {
            name: "Fresh Bread",
            type: "temp_statbooster",
            target: Sklbd,
            effect: 2,
            targetstr: "Skl"
        }
        const Exotic_Spice = {
            name: "Exotic Spice",
            type: "temp_statbooster",
            target: Spdbd,
            effect: 2,
            targetstr: "Spd"
        }
        const Candy_Die = {
            name: "Candy Die",
            type: "temp_statbooster",
            target: Lckbd,
            effect: 2,
            targetstr: "Lck"
        }
        const Hot_Soup = {
            name: "Hot Soup",
            type: "temp_statbooster",
            target: Defbd,
            effect: 2,
            targetstr: "Def"
        }
        const Pure_Water = {
            name: "Pure Water",
            type: "temp_statbooster",
            target: Resbd,
            effect: 2,
            targetstr: "Res"
        }
        //Healing
        const Vulnerary = {
            name: "Vulnerary",
            type: "healing",
            effect: 10
        }
        const Concoction = {
            name: "Concoction",
            type: "healing",
            effect: 20
        }
        const Elixir = {
            name: "Elixir",
            type: "healing",
            effect: 999
        }
        //Statboosters
        const Fruit_of_Life = {
            name: "Fruit of Life",
            type: "statbooster",
            target: HPi,
            effect: 2,
            targetstr: "HP"
        }
        const Soma = {
            name: "Soma",
            type: "statbooster",
            target: Stri,
            effect: 2,
            targetstr: "Str"
        }
        const Golden_Apple = {
            name: "Golden Apple",
            type: "statbooster",
            target: Magi,
            effect: 2,
            targetstr: "Mag"
        }
        const Nethergranate = {
            name: "Nethergranate",
            type: "statbooster",
            target: Skli,
            effect: 2,
            targetstr: "Skl"
        }
        const Pegasus_Cheese = {
            name: "Pegasus_Cheese",
            type: "statbooster",
            target: Spdi,
            effect: 2,
            targetstr: "Spd"
        }
        const Nectar = {
            name: "Nectar",
            type: "statbooster",
            target: Lcki,
            effect: 2,
            targetstr: "Lck"
        }
        const Ambrosia = {
            name: "Ambrosia",
            type: "statbooster",
            target: Defi,
            effect: 2,
            targetstr: "Def"
        }
        const Talisman = {
            name: "Talisman",
            type: "statbooster",
            target: Resi,
            effect: 2,
            targetstr: "Res"
        }
        //Promo items
        const Orions_Bolt = {
            name: "Orion's Bolt",
            type: "seal",
            target: ["Archer","Apothecary"],
            promo: true
        }
        const Hero_Crest = {
            name: "Hero_Crest",
            type: "seal",
            target: ["Fighter","Mercenary","Myrmidon"],
            promo: true
        }
        const Knight_Crest = {
            name: "Knight_Crest",
            type: "seal",
            target: ["Cavalier","Knight"],
            promo: true
        }
        const Elysian_Whip = {
            name: "Elysian Whip",
            type: "seal",
            target: ["Griffin Rider","Pegasus Knight","Wyvern Rider"],
            promo: true
        }
        const Guiding_Ring = {
            name: "Guiding Ring",
            type: "seal",
            target: ["Anima Mage","Dark Mage","Light Mage","Cleric","Troubadour"],
            promo: true
        }
        const Beastly_Claw = {
            name: "Beastly Claw",
            type: "seal",
            target: ["Laguz","Manakete","Kitsune","Wolfskin"],
            promo: true
        }
        const Ocean_Seal = {
            name: "Ocean Seal",
            type: "seal",
            target: ["Thief","Ninja","Oni Savage","Acrobat"],
            promo: true
        }
        const Medal_of_Honor = {
            name: "Medal of Honor",
            type: "seal",
            target: ["Soldier","Villager","Rifleman"],
            promo: true
        }
        const Heart_Seal = {
            name: "Heart Seal",
            type: "seal",
            target: "all",
            promo: false
        }
        //Misc
        const Chest_Key = {
            name: "Chest Key",
            type: "misc",
            desc: "Opens chests on adjacent spaces."
        }
        const Door_Key = {
            name: "Door Key",
            type: "misc",
            desc: "Opens doors on adjacent spaces."
        }
        const Lockpick = {
            name: "Lockpick",
            type: "misc",
            desc: "Opens doors and chests. Usable only by thieves."
        }
        const Red_Gem = {
            name: "Red Gem",
            type: "misc",
            desc: "Sells for 2500G."
        }
        const Blue_Gem = {
            name: "Blue Gem",
            type: "misc",
            desc: "Sells for 5000G."
        }
        const White_Gem = {
            name: "White Gem",
            type: "misc",
            desc: "Sells for 10000G."
        }
        itemlist = [Hearty_Cheese,Spicy_Chicken,Sweet_Honey,Fresh_Bread,Exotic_Spice,Candy_Die,Hot_Soup,Pure_Water,Vulnerary,Concoction,Elixir,Fruit_of_Life,Soma,Golden_Apple,Nethergranate,Pegasus_Cheese,Nectar,Ambrosia,Talisman,Orions_Bolt,Hero_Crest,Elysian_Whip,Guiding_Ring,Beastly_Claw,Ocean_Seal,Medal_of_Honor,Heart_Seal,Door_Key,Chest_Key,Lockpick,Red_Gem,Blue_Gem,White_Gem];
        //Actual scripts
        //a-an message handling. Obviously, there are some exceptions because a/an is based on phonetic vowels, but whatever
        let a_an = "";
        if (item.toLowerCase()[0] == "a"||item.toLowerCase()[0] == "e"||item.toLowerCase()[0] == "i"||item.toLowerCase()[0] == "o"||item.toLowerCase()[0] == "u"){
            a_an = "an"
        } else {
            a_an = "a"
        }
        let Itemstr = '<p style = "margin-bottom: 0px;">' + user.get("name") + " uses " + a_an +  " " + item + "!</p>"
        for (var i in itemlist){
            if (itemlist[i].name == item){
                j = itemlist[i]
                log(j)
                //item effects
                if (j.type == "misc"){
                    Itemstr += '<p style = "margin-bottom: 0px;">' + j.desc + '</p>'
                }
                if (j.type == "temp_statbooster"){
                    let curr = parseInt(j.target.get("current"));
                    //credit to Kizo-ALR for script!
                    if ((SkillsU.filter(e => e.get("name") === 'Potent-Potion').length > 0)||(SkillsU.filter(e => e.get("name") === 'Potent Potion').length > 0)){
                        j.effect *= 1.5;
                        j.effect = parseInt(j.effect)
                        Itemstr += '<p style = "margin-bottom: 0px;"><b style = "color: #4055df;">Potent Potion activated!</b></p>'
                    }
                    j.target.setWithWorker({
                        current: curr + j.effect
                    });
                    Itemstr += '<p style = "margin-bottom: 0px;">' + j.targetstr + ' temporarily increased by '+ j.effect +'!</p>'
                    queue.push([j.target, "decrement", 1, 0, "item"]);
                    log([j.target, "decrement", 1, 0, "item"])
                    log("Pushed to queue!")

                    //
                    for (var i in queue){
                        if ((queue[i][0] == j.target) && (queue[i][4] == "item") && (queue[i] != queue[queue.length - 1])){ //change the checked string for each different queuetype
                            queue.shift();
                            i--;
                            j.target.setWithWorker({
                                current: curr
                            }); //reset stat back to what it was before
                            log("Removed repeating b/d");
                            Itemstr += '<p style = "margin-bottom: 0px;">' + j.targetstr + ' cannot be increased any more! </p>'
                        }
                    }
                    //
                }
                if (j.type == "statbooster"){
                    j.target.setWithWorker({
                        current: parseInt(j.target.get("current")) + j.effect
                    });
                    Itemstr += '<p style = "margin-bottom: 0px;">' + j.targetstr + ' increased by '+ j.effect +'!</p>'
                }
                if (j.type == "healing"){
                    if ((SkillsU.filter(e => e.get("name") === 'Potent-Potion').length > 0)||(SkillsU.filter(e => e.get("name") === 'Potent Potion').length > 0)){
                        j.effect *= 1.5;
                        j.effect = parseInt(j.effect)
                        Itemstr += '<p style = "margin-bottom: 0px;"><b style = "color: #4055df;">Potent Potion activated!</b></p>'
                    }
                    HPcurrent.setWithWorker({
                        current: parseInt(HPcurrent.get("current")) + j.effect
                    });
                    Itemstr += '<p style = "margin-bottom: 0px;">' + user.get("name") + ' is healed for '+ j.effect +' HP!</p>'
                }
                if (j.type == "seal"){
                    if (j.promo == true){
                        if (j.target.indexOf(Userclass.get("current")) != -1 ){
                            Itemstr += '<p style = "margin-bottom: 0px;">' + user.get("name") + " promotes with the " + j.name + "!</p>"
                        } else {
                            Itemstr += '<p style = "margin-bottom: 0px;">Cannot promote! </p>'
                        }
                    } else {
                        Itemstr += '<p style = "margin-bottom: 0px;">' + user.get("name") + " changes class with a Heart Seal! </p>";
                    }
                }
            }
        }
        //decrease uses
        for (var i in itemnames){
            let itemname_get = getAttrByName(user.id, itemnames[i]);
            let itemuses_get = getAttrByName(user.id, itemuses[i]);
            let names_i = itemnames[i]
            let uses_i = itemuses[i]
            log(uses_i)
            if (itemname_get != null){ //no object assigned checking
                if (itemname_get == item){
                    let num = itemuses_get - 1
                    log(num)
                    setAttrs(user.id, {[uses_i]: num})
                    if (num <= 0){
                        setAttrs(user.id, {[names_i]: ""})
                    }
                }
            }
        }

        var divstyle = 'style="width: 189px; border: 1px solid #353535; background-color: #f3f3f3; padding: 5px; color: #353535;"'
        var tablestyle = 'style="text-align:center; margin: 0 auto; border-collapse: collapse; margin-top: 5px; border-radius: 2px"';
        var headstyle = 'style="color: #f3f3f3; font-size: 18px; text-align: left; font-variant: small-caps; background-color: #353535; padding: 4px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;"';
        var namestyle = 'style="background-color: #353535; color: #f3f3f3; text-align: center; font-weight: bold; overflow: hidden; margin: 4px; margin-right: 0px; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;"'
        var wrapperstyle = 'style="display: inline-block; padding:2px;"'
        var statdiv = 'style="border: 1px solid #353535; border-radius: 5px; overflow: hidden; text-align: center; display: inline-block; margin-left: 4px;"'
        var cellabel = 'style="background-color: #353535; color: #f3f3f3; font-weight: bold; padding: 2px;"'

        sendChat(who, '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Item</div>' + //--
            '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + Itemstr + '</div>' + //--
            '</div>'
        );
    }
});

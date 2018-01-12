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

        let Item_Name0 = findObjs({ characterid: user.id, name: "item_uses0", type: "attribute"})[0];
        let Item_Name1 = findObjs({ characterid: user.id, name: "item_name1", type: "attribute"})[0];
        let Item_Name2 = findObjs({ characterid: user.id, name: "item_name2", type: "attribute"})[0];
        let Item_Uses0 = findObjs({ characterid: user.id, name: "item_uses0", type: "attribute"})[0];
        let Item_Uses1 = findObjs({ characterid: user.id, name: "item_uses1", type: "attribute"})[0];
        let Item_Uses2 = findObjs({ characterid: user.id, name: "item_uses2", type: "attribute"})[0];
        itemuses = [Item_Uses0,Item_Uses1,Item_Uses2]
        itemnames = [Item_Name0,Item_Name1,Item_Name2]
        //All items as objects QnQ
        //Temp statboosters
        const Hearty_Cheese = {
            name: "Hearty Cheese",
            type: "temp_statbooster",
            target: HPbd,
            effect: 2
        }
        const Spicy_Chicken = {
            name: "Spicy Chicken",
            type: "temp_statbooster",
            target: Strbd,
            effect: 2
        }
        const Sweet_Honey = {
            name: "Sweet Honey",
            type: "temp_statbooster",
            target: Magbd,
            effect: 2
        }
        const Fresh_Bread = {
            name: "Fresh Bread",
            type: "temp_statbooster",
            target: Sklbd,
            effect: 2
        }
        const Exotic_Spice = {
            name: "Exotic Spice",
            type: "temp_statbooster",
            target: Spdbd,
            effect: 2
        }
        const Candy_Die = {
            name: "Candy Die",
            type: "temp_statbooster",
            target: Lckbd,
            effect: 2
        }
        const Hot_Soup = {
            name: "Hot Soup",
            type: "temp_statbooster",
            target: Defbd,
            effect: 2
        }
        const Pure_Water = {
            name: "Pure Water",
            type: "temp_statbooster",
            target: Resbd,
            effect: 2
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
            effect: 2
        }
        const Soma = {
            name: "Soma",
            type: "statbooster",
            target: Stri,
            effect: 2
        }
        const Golden_Apple = {
            name: "Golden Apple",
            type: "statbooster",
            target: Magi,
            effect: 2
        }
        const Nethergranate = {
            name: "Nethergranate",
            type: "statbooster",
            target: Skli,
            effect: 2
        }
        const Pegasus_Cheese = {
            name: "Pegasus_Cheese",
            type: "statbooster",
            target: Spdi,
            effect: 2
        }
        const Nectar = {
            name: "Nectar",
            type: "statbooster",
            target: Lcki,
            effect: 2
        }
        const Ambrosia = {
            name: "Ambrosia",
            type: "statbooster",
            target: Defi,
            effect: 2
        }
        const Talisman = {
            name: "Talisman",
            type: "statbooster",
            target: Resi,
            effect: 2
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
        //a-an message handling. Obviously, there are some exceptions because it's based on phonetic vowels, but whatever
        if (item.toLowerCase()[0] == "a"||item.toLowerCase()[0] == "e"||item.toLowerCase()[0] == "i"||item.toLowerCase()[0] == "o"||item.toLowerCase()[0] == "u"){
            sendChat(who, '/me uses an ' + item);
        } else {
            sendChat(who, '/me uses a ' + item)
        }
        for (var i in itemlist){
            if (itemlist[i].name == item){
                j = itemlist[i]
                log(j)
                //item effects
                if (j.type == "misc"){
                    sendChat("System",j.desc)
                }
                if (j.type == "temp_statbooster"){
                    j.target.set("current", Number(j.target.get("current")) + j.effect)
                }
                if (j.type == "statbooster"){
                    j.target.set("current", Number(j.target.get("current")) + j.effect)
                }
                if (j.type == "healing"){
                    HPcurrent.set("current", Number(HPcurrent.get("current")) + j.effect)
                }
                if (j.type == "seal"){
                    if (j.promo == true){
                        if (j.target.indexOf(Userclass.get("current")) != -1 ){
                            sendChat("System", user.get("name") + " promotes with the " + j.name + "!")
                        } else {
                            sendChat("System", "Cannot promote!")
                        }
                    } else {
                        sendChat("System", user.get("name") + " changes class with a Heart Seal!")
                    }
                }
            }
        }
    }
});

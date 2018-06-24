on('chat:message', function(msg) {
    if (msg.type != 'api') return;
    var parts = msg.content.split(' ');
    var command = parts.shift().substring(1);
    if (command == 'stats') {
        if (parts.length < 1) {
            sendChat('SYSTEM', 'You must provide a selected token id');
            return;
        }
        if (parts.length < 4) {
            sendChat('SYSTEM', 'You must provide arguments for all four stats');
            return;
        }

        // Only one token for this one
        var selectedId = parts[0];
        var hit = Number(parts[1]);
        var crit = Number(parts[2]);
        var avo = Number(parts[3]);
        var ddg = Number(parts[4]);
        var dmg = Number(parts[5]);
        log(parts)

        var selectedToken = getObj('graphic', selectedId);

        if (!selectedToken) {
            sendChat('SYSTEM', 'Selected token id not provided.');
            return;
        }

        var who = getObj('character', selectedToken.get('represents'));
        //Check to make sure that the tokens represent characters
        if (selectedToken.get('represents') === ""){
            sendChat('SYSTEM', 'Token must be linked to a character in the journal!');
            return;
        }
        var user = who.id
        if (!who) {
            who = selectedToken.get('name');
        } else {
            who = 'character|' + who.id;
        }

        let Hitmod = findObjs({ characterid: user, name: "Hitmod"})[0];
        log(Hitmod)
        let Critmod = findObjs({ characterid: user, name: "Critmod"})[0];
        log(Critmod)
        let Avomod = findObjs({ characterid: user, name: "Avomod"})[0];
        log(Avomod)
        let Ddgmod = findObjs({ characterid: user, name: "Ddgmod"})[0];
        log(Ddgmod)
        let Dmgmod = findObjs({ characterid: user, name: "Dmgmod"})[0];
        log(Dmgmod)

        Hitmod.setWithWorker({
            current: Number(Hitmod.get("current")) + hit
        });
        Critmod.setWithWorker({
            current: Number(Critmod.get("current")) + crit
        });
        Avomod.setWithWorker({
            current: Number(Avomod.get("current")) + avo
        });
        Ddgmod.setWithWorker({
            current: Number(Hitmod.get("current")) + ddg
        });
        Dmgmod.setWithWorker({
            current: Number(Hitmod.get("current")) + dmg
        });

        var divstyle = 'style="width: 189px; border: 1px solid #353535; background-color: #f3f3f3; padding: 5px; color: #353535;"'
        var tablestyle = 'style="text-align:center; margin: 0 auto; border-collapse: collapse; margin-top: 5px; border-radius: 2px"';
        var headstyle = 'style="color: #f3f3f3; font-size: 18px; text-align: left; font-variant: small-caps; background-color: #353535; padding: 4px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;"';
        var namestyle = 'style="background-color: #353535; color: #f3f3f3; text-align: center; font-weight: bold; overflow: hidden; margin: 4px; margin-right: 0px; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;"'
        var wrapperstyle = 'style="display: inline-block; padding:2px;"'
        var statdiv = 'style="border: 1px solid #353535; border-radius: 5px; overflow: hidden; text-align: center; display: inline-block; margin-left: 4px;"'
        var cellabel = 'style="background-color: #353535; color: #f3f3f3; font-weight: bold; padding: 2px;"'
        sendChat(who, '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Stats</div>' + //--
            '<div style = "margin: 0 auto; width: 80%; margin-top: 4px;">' + //--
            '<p style = "margin-bottom: 0px;"> Stats modified! </p>' + //--
            '</div>' + //--
        '</div>'
        );
    }
});

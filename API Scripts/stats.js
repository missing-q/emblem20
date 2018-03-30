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

        sendChat(who, "Stats modified!");
    }
});

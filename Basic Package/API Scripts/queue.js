on("change:campaign:turnorder", function(turn) {
    var turnorder;
    var turncounter;
    if (Campaign().get("turnorder") == "") turnorder = [];
    else turnorder = JSON.parse(Campaign().get("turnorder"));
    for (var i in turnorder){
        if (turnorder[i].custom == "Turn Counter"){
            turncounter = turnorder[i];
        }
    }
    if (turnorder[0] !== turncounter){ //STRICT EQUALITY checking for if it's the turncounter's "turn"
        return;
    }

    let n;
    if (turncounter != undefined){
        n = turncounter.pr;
    } else {
        n = 0;
    }
    /*queueitem structure:
      [{stat}, "increment/decrement", how much/turn, floor/ceiling, source]
      sources: "combat", "combat-r", "staff", "staff-r", "item", "command", "command-r", "turn", "turn-r", "stat"
      -r's are for radii
    */
    if (queue == []){
        log("Action Queue is empty!")
        return;
    }
    log(queue);
    //remove entries targeting the same stat from the queue; prioritize earlier entries
    for (var i in queue){
        for (var j in queue){
            if ((queue[i][0] == queue[j][0]) && (queue[i][4] == queue[j][4]) && (i != j)){ //check if the stats and sources are the same
                log("Removed repeated entry from queue: " + queue[i][0].get("name")) //log repeats before deletion :0
                queue.shift(); //remove element from queue
                i --; //decrement i
                j --;
            }
        }
    }

    //iterate over queueitems
    for (var i in queue){
        log(queue[i][0]);
        log(queue[i][0].get("current"))
        if (queue[i][0].get("current") != queue[i][3]){

            if (queue[i][1] == "increment"){
                queue[i][0].setWithWorker({
                    current: queue[i][0].get("current") + queue[i][2] //current stat plus amt per turn
                });
            } else if (queue[i][1] == "decrement"){
                queue[i][0].setWithWorker({
                    current: queue[i][0].get("current") - queue[i][2] //current stat minus amt per turn
                });
            }

        } else {
            queue.shift(); //remove element from queue
            i --; //decrement i
        }
    }

    //:')
});

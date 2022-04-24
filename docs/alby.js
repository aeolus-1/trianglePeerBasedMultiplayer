var ably = new Ably.Realtime(
  "DpINhA.k0XtSA:DQcJRsOOqx2nLIE0KLBY0EtuPSLeFYm3lEa6gdfPFKY"
);
var online = false,
    broadCasting = false
ably.connection.on("connected", () => {
  console.log("connected with alby");
  online = true
});

var onlinePlayers = new Object(),
    onlinePlayersComp = Matter.Composite.create()
    onlineId = `${Math.random()}`

Matter.Composite.add(engine.world, onlinePlayersComp)

var channel = ably.channels.get("game");
channel.subscribe("gamePlayers", (message) => {
  var dat = JSON.parse(message.data)
    if (dat.id != onlineId) {
    if (onlinePlayers[dat.id] == undefined) {
        onlinePlayers[dat.id] = {body:addOnlinePlayer(dat)}
        
        console.log("add")
    }

        Matter.Body.set(onlinePlayers[dat.id].body, "position", dat.position)
        Matter.Body.set(onlinePlayers[dat.id].body, "velocity", dat.velocity)

        Matter.Body.set(onlinePlayers[dat.id].body, "angle", dat.angle)
        Matter.Body.set(onlinePlayers[dat.id].body, "anglarVelocity", dat.anglarVelocity)
}

});

function broadcastData() {
    channel.publish("gamePlayers", JSON.stringify({
        id:onlineId,
        position:{...entitys[0].body.position},
        velocity:{...entitys[0].body.velocity},
        angle:entitys[0].body.angle,
        anglarVelocity:entitys[0].body.anglarVelocity,
    }))
}

function addOnlinePlayer(dat) {
    var body = Matter.Bodies.rectangle(dat.position.x, dat.position.y, 30, 30,{
        frictionAir:0,
        restitution:0.15,
        friction:0.7,
        frictionStatic:0,
        render:{
            fillStyle:colorTheme.player
        }
    })

    Matter.Composite.add(onlinePlayersComp, body)

    return body
}

setInterval(() => {
    if (broadCasting) {
        broadcastData()
    }
}, 56);

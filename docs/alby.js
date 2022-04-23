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
    onlineId = `${Math.random()}`

var channel = ably.channels.get("game");
channel.subscribe("gamePlayers", (message) => {
  var dat = JSON.parse(message.data)

  onlinePlayers[dat.id] = {}

    onlinePlayers[dat.id].position = dat.position

});

function broadcastData() {
    channel.publish("gamePlayers", JSON.stringify({
        id:onlineId,
        position:{...entitys[0].body.position}
    }))
}

setInterval(() => {
    if (broadCasting) {
        broadcastData()
    }
}, 100);

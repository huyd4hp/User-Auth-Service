const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../../config");

let statusConnect = {
  CONNECT: "connect",
  END: "end",
  ERROR: "error",
  RECONNECT: "reconnecting",
};
const client = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

client.on(statusConnect.CONNECT, () => {
  console.log("Connected to Redis");
});

client.on(statusConnect.END, () => {
  console.log("Disconnected to Redis");
});

client.on(statusConnect.ERROR, (err) => {
  console.log("ERROR:   Disconnected to Redis");
  console.log(`ERROR:  ${err}`);
});

client.on(statusConnect.RECONNECT, () => {
  console.log("Reconnection to Redis");
});

module.exports = client;

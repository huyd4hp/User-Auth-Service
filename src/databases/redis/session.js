const redis = require("redis");
const colors = require("colors");
const {
  REDIS_SESSION_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = require("../../config");
let statusConnect = {
  CONNECT: "connect",
  END: "end",
  ERROR: "error",
  RECONNECT: "reconnecting",
};
const client = redis.createClient({
  socket: {
    host: REDIS_SESSION_HOST,
    port: REDIS_PORT,
  },
  password: REDIS_PASSWORD,
});

client.on(statusConnect.CONNECT, () => {
  console.log(colors.green("INFO:    "), "Connected to RedisSession");
});

client.on(statusConnect.END, () => {
  console.log(colors.green("INFO:    "), "Disconnected to RedisSession");
});

client.on(statusConnect.ERROR, (err) => {
  console.log(colors.red("ERROR:    "), `Disconnected to RedisSession, ${err}`);
});

client.on(statusConnect.RECONNECT, () => {
  console.log(colors.green("INFO:    "), "Reconnection to RedisSession");
});

module.exports = client;

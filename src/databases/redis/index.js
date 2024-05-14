const redis = require("redis");
const redis_client = require('../../config').redis;

let statusConnect = {
    CONNECT: 'connect',
    END: 'end',
    ERROR: 'error',
    RECONNECT: 'reconnecting'
};
const client = redis.createClient({
    socket: {
        host: redis_client.host,
        port: redis_client.port
    }
});

client.on(statusConnect.CONNECT, () => {
    console.log("INFO:   Connected to Redis");
});

client.on(statusConnect.END, () => {
    console.log("INFO:   Disconnected to Redis");
});

client.on(statusConnect.ERROR, (err) => {
    console.log("ERROR:   Disconnected to Redis");
    console.log(`ERROR:  ${err}`);
});

client.on(statusConnect.RECONNECT, () => {
    console.log("INFO:   Reconnection to Redis");
});

module.exports = client
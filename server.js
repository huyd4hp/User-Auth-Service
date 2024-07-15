const { app } = require("./src/app");
const colors = require("colors");
const ConsulClient = require("./src/helper/consul");
const { APP_PORT, APP_HOST, APP_NAME } = require("./src/config");
colors.enable();
const server = app.listen(APP_PORT, () => {
  const service = {
    id: "AuthService",
    name: "AuthService",
    address: "api.eventhub",
    port: 80,
    tags: ["NodeJS", "AuthService"],
  };

  // Register the service with Consul
  ConsulClient.registerService(service);

  // Define a new check for the service
  const check = {
    serviceId: "AuthService",
    name: `${APP_NAME} Health Check`,
    http: `http://${APP_HOST}:${APP_PORT}/api/v1/health`,
    interval: "30s",
    timeout: "3s",
  };

  // Add the check to Consul
  ConsulClient.addCheck(check);

  console.log(
    colors.green("INFO:    "),
    `Application listening on ${APP_PORT}`
  );
});

process.on("SIGINT", () => {
  console.log(colors.green("INFO:    "), `Application stopped`);
  server.close();
  process.exit(0);
});

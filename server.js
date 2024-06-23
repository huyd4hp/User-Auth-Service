const app = require("./src/app");
const { APP_PORT } = require("./src/config");

const server = app.listen(APP_PORT, () => {
  console.log(`Application listening on ${APP_PORT}`);
});

process.on("SIGINT", () => {
  console.log("Application stopped");
  server.close();
  process.exit(0);
});

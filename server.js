const app = require("./src/app");

const PORT = process.env.SERVICE_PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`INFO:   Application listening on ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("INFO:   Application stopped");
  server.close();
  process.exit(0);
});

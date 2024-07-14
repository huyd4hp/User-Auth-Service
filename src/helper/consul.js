const consul = require("consul");

class Consul {
  constructor(options) {
    this.client = new consul(options);
  }
  registerService(service) {
    this.client.agent.service.register(service, (err) => {
      if (err) throw err;
    });
  }
  deregisterService(serviceID) {
    this.client.agent.service.deregister(serviceID);
  }
  addCheck(check) {
    this.client.agent.check.register(check, (err) => {
      if (err) throw err;
    });
  }
}

const ConsulClient = new Consul({
  host: "consul",
  port: "8500",
});

module.exports = ConsulClient;

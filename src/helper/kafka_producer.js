const { Kafka, Partitioners } = require("kafkajs");
const { KAFKA_HOST, KAFKA_PORT } = require("../config");
class KafkaProducer {
  constructor({ clientId, brokers }) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }
  async connect() {
    await this.producer.connect();
  }
  async disconnect() {
    await this.producer.disconnect();
  }

  async sendMessage(topic, messages) {
    await this.producer.send({
      topic,
      messages,
    });
  }
}
console.log(`${KAFKA_HOST}:${KAFKA_PORT}`);
const producer = new KafkaProducer({
  clientId: "auth-service",
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
});

producer.connect();
module.exports = producer;

const { Kafka, Partitioners } = require("kafkajs");

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
const producer = new KafkaProducer({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
producer.connect();
module.exports = producer;

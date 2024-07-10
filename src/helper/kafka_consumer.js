const { Kafka } = require("kafkajs");
const { KAFKA_HOST, KAFKA_PORT } = require("../config");
class KafkaConsumer {
  constructor({ clientId, brokers, groupId, topic }) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });
    this.consumer = this.kafka.consumer({ groupId });
    this.topic = topic;
  }

  async connect() {
    await this.consumer.connect();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  async consume(callback) {
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const formattedMessage = {
          key: message.key ? message.key.toString() : null,
          value: message.value.toString(),
        };
        callback(formattedMessage);
      },
    });
  }
}

const consumer = new KafkaConsumer({
  clientId: "my-app",
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
  groupId: "my_group_id",
  topic: "booking",
});
const run = async () => {
  await consumer.connect();
  console.log("Connected to Kafka");
  consumer.consume((message) => {
    console.log(`Received message: ${JSON.stringify(message)}`);
  });
};
module.exports = run;

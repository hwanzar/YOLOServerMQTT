import { connect } from "mqtt"

const MQTT_SERVER = "mqtt.ohstem.vn"
const MQTT_PORT = 1883
const MQTT_USERNAME = "Yolo:HomeZar"
const MQTT_PASSWORD = ""
const MQTT_TOPIC_PUB = [
    `${MQTT_USERNAME}/feeds/V1`,
    `${MQTT_USERNAME}/feeds/V2`,
    `${MQTT_USERNAME}/feeds/V3`,
]
const MQTT_TOPIC_SUB = [
    `${MQTT_USERNAME}/feeds/V1`,
    `${MQTT_USERNAME}/feeds/V2`,
    `${MQTT_USERNAME}/feeds/V3`,
]

const mqttClient = connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
})

mqttClient.on("connect", () => {
    console.log("Connected successfully!")
    MQTT_TOPIC_SUB.forEach((topic) => {
        mqttClient.subscribe(topic, (err) => {
            if (err) {
                console.error("Error subscribing to topic:", topic, err)
            } else {
                console.log("Subscribed to", topic)
            }
        })
    })
})

mqttClient.on("message", (topic, message) => {
    console.log(`Received message ${message.toString()} on topic ${topic}`)
})

mqttClient.on("error", (err) => {
    console.error("MQTT error:", err)
})

let counter = 0

function publishCounter() {
    counter++
    MQTT_TOPIC_PUB.forEach((pub) => {
        mqttClient.publish(pub, counter.toString())
    })
}

setInterval(publishCounter, 5000)

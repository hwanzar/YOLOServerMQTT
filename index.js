import { connect } from "mqtt"

const MQTT_SERVER = "mqtt.ohstem.vn"
const MQTT_PORT = 1883
const MQTT_USERNAME = "Yolo:HomeZar"
// const MQTT_USERNAME = "Yolo:Home0410"
const MQTT_PASSWORD = ""
// V1 : nhiệt độ
// V2 : độ ẩm
// V3 : ánh sáng

// MQTT_TOPIC_PUB: dùng để PUBLISH.
const MQTT_TOPIC_PUB = [
    `${MQTT_USERNAME}/feeds/V1`,
    `${MQTT_USERNAME}/feeds/V2`,
    `${MQTT_USERNAME}/feeds/V3`,
    // `${MQTT_USERNAME}/feeds/V10`,
]

// MQTT_TOPIC_SUB: dùng để SUBSCRIBE.
const MQTT_TOPIC_SUB = [
    `${MQTT_USERNAME}/feeds/V1`,
    `${MQTT_USERNAME}/feeds/V2`,
    `${MQTT_USERNAME}/feeds/V3`,
    `${MQTT_USERNAME}/feeds/V10`,
]

// CONNECT vào server ohstem.
const mqttClient = connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
})

// connect thành công thì sẽ subscribe các topic V1, V2 , V3
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

//  QUAN TRỌNG: làm sao lưu lại message mỗi khi nhận message (thành 1 database).
// let saveMessageToDB = function (message) {   ... }
// let saveMessageToDB = async function (      message) {
//     const data = JSON.parse(message)

//     // LƯU VÀO DB, chưa nghĩ ra
//     // ....
// }

//  QUAN TRỌNG: làm sao lưu lại message mỗi khi nhận message thành 1 database??
mqttClient.on("message", (topic, message) => {
    console.log(`Received message ${message.toString()} on topic ${topic}`)
})

mqttClient.on("error", (err) => {
    console.error("MQTT error:", err)
})

// DEMO THỬ 1 quá trình publish message lên server bằng mqtt

let counter = 0
let turnLamp = 0
function publishCounter() {
    counter++
    MQTT_TOPIC_PUB.forEach((pub) => {
        mqttClient.publish(pub, counter.toString())
    })
}
function lampOn() {
    turnLamp = 1
    mqttClient.publish(MQTT_TOPIC_PUB[3], turnLamp.toString())
}

setInterval(publishCounter, 5000)
// setInterval(lampOn, 2000)

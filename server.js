const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const router = require("./Router")

const PORT = 5000

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.use(morgan("combined"))

const { MONGODB } = require("./config")

app.use("/", router)


mongoose.connect(MONGODB, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}).then((_) => {
    console.log("MongoDB Atlas Connected");
    app.listen(PORT, () => {
        console.log("Server running on port 5000");
    })
})
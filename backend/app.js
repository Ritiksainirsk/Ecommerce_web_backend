const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const errorMiddleware = require("./middleware/error")

app.use(express.json())
app.use(cookieParser())
app.use(cors())

//Router import
const Product = require("./routers/productRouters")
const user = require("./routers/userRoute")
const order= require("./routers/orderRouters")

app.use("/api/v1",Product)
app.use("/api/v1",user)
app.use("/api/v1",order)

// middleware for error
app.use(errorMiddleware)

module.exports = app
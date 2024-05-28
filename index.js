const express = require('express')
const dbConnect = require('./config/dbConnection')
const dotenv = require('dotenv').config()
const app = express()
const authRoute = require('./routes/authRoutes')
const productRoute = require('./routes/productRoutes')
const bodyParser = require('body-parser')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const cookieParser = require("cookie-parser")
const morgan = require("morgan")


app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(cookieParser())


app.use('/api/user', authRoute)

app.use('/api/product', productRoute)


app.use(notFound)

app.use(errorHandler)
const PORT = process.env.PORT || 5000



app.listen(PORT, () => {
    dbConnect()
    console.log("Server is running")
})
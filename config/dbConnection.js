const {mongoose} = require('mongoose')


const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected")
    }catch(error){
       console.log("Database connection error")
    }
}

module.exports = dbConnect
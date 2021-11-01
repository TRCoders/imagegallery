const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://TRCoder:dbpassword@messagefromdownunder.xv6xa.mongodb.net/Messagefromdownunder?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let db = mongoose.connection

db.on('error', console.error.bind(console,'connection error at database'))

db.once('open', function callback() {
    console.log("Database connection successful")
})

let uploadSchema = new mongoose.Schema({
    imagename: String
})

let uploadModel = mongoose.model('image', uploadSchema)

module.exports = uploadModel
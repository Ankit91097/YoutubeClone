const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    media: {
        type: String,
        required: [ true, "Media is required to upload a video" ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [ true, "video can't be upload without user" ],
    },
    likes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    } ],
    title:String,
    description:String
})

module.exports = mongoose.model('video', videoSchema)
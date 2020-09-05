const mongoose = require('mongoose')
//creating a schema for user data in mongoose
const postSchema =  new mongoose.Schema({
    content: {
        type: String,
        required : true //without this data wont be saved
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }

    },{
        //written to show  created and updated at
        timestamps : true
    }

);
const Post = mongoose.model('Post',postSchema)
module.exports = Post;
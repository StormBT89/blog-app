import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    }, 
    title: {
        type: String,
        required: true,
    }, 
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://s3-ap-south-1.amazonaws.com/static.awfis.com/wp-content/uploads/2017/07/07184649/ProjectManagement.jpg',
    },
    category: {
        type: String,
        default: 'kolegijalen',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, {timestamps: true}
);

const Post = mongoose.model('Post', postSchema);

export default Post;


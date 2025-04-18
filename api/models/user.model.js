import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://www.usnews.com/object/image/0000015c-a2ce-da40-adfe-a3ef706c0000/180417smallbeachtowns-stock.jpg?update-time=1524001273952&size=responsive970'
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;


import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
    console.log(req.body.title);
    if (!req.user.isAdmin){
        return next(errorHandler(403, 'Немате привилегии за да креирате состанок.'));
    }

    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Задолжително е да внесете наслов на состанок и информации за состанок'));
    }
    const slug = req.body.title
    .toString()
    .replace(/^\s+|\s+$/g, '')// trim leading/trailing white space
    .toLowerCase()// convert string to lowercase
    .replace(/[^a-z0-9 -]/, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-')// remove consecutive hyphens
    + new Date().getTime();

    console.log('Слагот');
    console.log(slug);

    const newPost = new Post({
        ...req.body, 
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
        
    } catch (error) {
        next(error);        
    }
}


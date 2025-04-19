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

export const getposts = async (req, res, next) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 9;
            const sortDirection = req.query.order === 'asc' ? 1 : -1;
            const posts = await Post.find({
                ...(req.query.userId && {userId: req.query.userId}),
                ...(req.query.category && {category: req.query.category}),
                ...(req.query.postId && {_id: req.query.postId}),
                ...(req.query.searchTerm && {
                    $or: [
                        {
                            title: { $regex: req.query.searchTerm, $options: 'i'}
                        },
                        {
                            content: { $regex: req.query.searchTerm, $options: 'i'}
                        },
                    ], 
                }),
            }).sort({
                updatedAt: sortDirection
            }).skip(startIndex).limit(limit);

            const totalPosts = await Post.countDocuments();

            const now = new Date();

            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            );

            const lastMonthPosts = await Post.countDocuments({
                createdAt: { $gte: oneMonthAgo},
            });

            res.status(200).json({
                posts,
                totalPosts,
                lastMonthPosts,
            });            
        } catch (error) {
            next(error);            
        }
}


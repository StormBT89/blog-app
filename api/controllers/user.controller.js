import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'

export const test = (req, res) => {
    res.json({message: 'Тест, тест..'});
};

export const updateUser = async (req, res, next) => {
    
   if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Немате привилегии да ги ажурирате податоците'));
   }

   if (req.body.password) {
    if (req.body.password < 6) {
        return next(errorHandler(400, 'Пасвордот мора да содржи најмалку 8 карактери'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
   }

   if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(errorHandler(400, 'Корисничкото име е потребно да биде составено од 7 или повеќе карактери и помалку од 20'));
    }
    if (req.body.username.includes(' ')){
        return next(errorHandler(400, 'Корисничкото име не смее да содржи празно место'));
    }
    if (req.body.username !== req.body.username.toLowerCase()){
        return next(errorHandler(400, 'Корисничкото име потребно е да биде составено само од мали букци'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)){
        return next(errorHandler(400, 'Корисничкото име може да содржи само букви и бројки'));
    }
}
    try {
        
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        }, {new: true});

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
        
    } catch (error) {
        next(error);
    }
}

       
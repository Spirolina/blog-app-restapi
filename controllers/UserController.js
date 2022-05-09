import crypto from 'crypto'
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import { generateSignToken, genPassword, validPassword, verifyToken } from '../modules/Auth.js';



export const login_post = [
    body('username').isLength({ min: 1 }).withMessage('username must be specified !'),
    body('password').isLength({ min:1}).withMessage('password must be specified'),
     (req, res, next) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({errors: errors.array()});   
            return;
        }

    User.findOne({ username : req.body.username })
        .exec((err, user) => {
            if (err) { return next() }
            if (!user) {
                res.json({ errors : [{msg: 'User not found!'}] });
                return;
            }
            if (user) {
                const result = validPassword(req.body.password, user.hash, user.salt);
                if (result) {
                    const payload = {
                        _id: user._id,
                        username: user.username,
                        admin: user.admin,
                    };
                    const token = generateSignToken(payload)
                    res.status(200).json({
                        message: 'success',
                        token,
                        payload,
                    });
                    return
                }

                res.json({errors : [{msg: 'wrong password'}]})

            }
        })
}]

export const register_post = [
    body('username').custom((value) => {
        if (value.length === 0) {
            throw new Error('Username must be specified !');
        }
        console.log(value);
        
       return User.find({ username: value })
            .then((result) => {
                console.log(result);
                if (result.length > 0) {
                    throw new Error('This username is already taken');
                }
            })
    }),
    body('password').custom((value, { req }) => {
        if (value.length === 0) {
            throw new Error('Password must be specified');
        }

        if (value !== req.body.passwordConf) {
            throw new Error('Passwords must be matched');
        }
        return true
    }), (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
           
            return;
        }

        const [salt, hash] = genPassword(req.body.password)
        
        const user = new User({
            username: req.body.username,
            salt,
            hash,
            admin: true
        })

        user.save((err, result) => {
            if (err) {
                console.log(err);
                res.json({errors: [{msg: err.message}]});
                return;
            }

             res.status(200).json({
            message: 'Your account succesfully created !'
        })
        })
        
       
        
    }
]

export const get_authors = (req, res, next) => {
    User.find({ admin: true }, { username : 1, _id : -1})
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            res.json({ authors: result });
        })
        
}

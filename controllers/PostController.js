import Post from "../models/Post.js";
import { verifyToken } from "../modules/Auth.js";
import { body, validationResult } from "express-validator";


export const create_post = [
    body('title').isLength({ min: 1 }).withMessage('title is required !'),
    body('content').isLength({ min:1}).withMessage('content must be exist !'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        }

    if (!req.headers.authorization) {
        res.status(401).json({errors: [{ msg: 'you are not authenticated !' }]});
        return;
    }
    
    const token = req.headers.authorization.split(' ')[1];

    verifyToken(token, (err, payload) => {
        if (err) {
            res.status(401).json({errors: [{ msg: 'you are not authenticated !' }]});
            return;
        }
        const content = req.body.content;
        const title = req.body.title;
        const author = payload._id;
        const post = new Post({
            title,
            content,
            author,
        })

        post.save((err, result) => {
            if (err) {
                res.json({ errors: [{ msg: err.message }] });
                return;
            }

            res.json({
                message: 'succesfully created Post',
                post: result,
            })
        })

        
    })
}]

export const post_get = (req, res, next) => {  
  
        
    Post.findById(req.params.id)
        .populate('author')
            .exec((err, result) => {
                if (err) { res.status(404).json({ errors: [{ msg: 'There is no post.' }] });
                    return;
                }

                if (!result) {
                    res.status(404).json({ errors: [{ msg: 'There is no post.' }] });
                    return;
                }
                res.json({ post: result });
            })
}

export const post_delete = (req, res, next) => {
    if (!req.headers.authorization) {
        res.json({ errors: [{ msg: 'There is no auth!' }] });
        return;
    }
    
    const token = req.headers.authorization.split(' ')[1];

    verifyToken(token, (err, result) => {
        if (err) { res.json({ errors: [{ msg: err.message }] }); return; }
        if (!result.admin) {  res.status(401).json({errors: [{ msg: 'you are not authenticated !' }]});
    }
        Post.findByIdAndRemove(req.params.id)
            .exec((err, result) => {
                if (err) { res.json({ errors: [{ msg: err.message }] }); return; }
                res.json({ message: 'succesfully deleted !' });
            })
    })
}

export const post_comment = [
    body('commentor').isLength({ min: 1 }).withMessage('Name must be specified !'),
    body('content').isLength({ min: 1 }).withMessage('comment must be specifed!'),
    (req, res, next) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        }

            const comment = {
                name: req.body.commentor,
                content: req.body.content,
            }
    
        Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: comment },
        }, {new: true}, (err, result) => {
            if (err) {
                res.json({ errors: [err.message] })
                return;
            }
    
            res.json({
                message: 'comment added succesfully',
                post: result,
            });
        });
    }
]

export const post_edit = [
    body('title').isLength({ min: 1 }).withMessage('title is required !'),
    body('content').isLength({ min: 1}).withMessage('content must be exist !'),
    (req, res, next) => {
        
        if (!req.headers.authorization) {
            res.status(401).json({errors: [{ msg: 'you are not authenticated !' }]});

            return;
        }
        const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() });
            return;
        }
    
    const token = req.headers.authorization.split(' ')[1];
        console.log(token);
    verifyToken(token, (err, result) => {
        if (err) { res.json({ errors: [{ msg: err.message }] }); return; }
        const newTitle = req.body.title;
        const newContent = req.body.content;

        Post.findByIdAndUpdate(req.params.id, {
            _id: req.params.id,
            title: newTitle,
            content: newContent,
            updated_date: new Date(),
        }, {}, (err, post) => {
            if (err) { res.json({ errors: [{ msg: err.message }] }); return; }
            if(!post) {res.json({errors: [{msg: 'post cannot found!'}]}); return; }
            
            res.json({
                message: 'Updated succesfully',
                post,
            })  
        })

    })

}]

export const dashboard = (req, res, next) => {
    if (req.query.admin === 'true') {
        if (!req.headers.authorization) {
            res.status(401).json({msg: 'there is no auth'});
            return;
        }

        
        const token = req.headers.authorization.split(' ')[1];
    
        verifyToken(token, (err, result) => {
            if (err) { res.status(401).json({ msg: 'your are not authenticated !' }); return; };
          
            Post.find()
            .populate('author')
            .exec((err, result) => {
                if (err) { return next(err) }
                if (!result) {
                    res.json({ message: 'There is not exist any post.' });

                }
                res.json({
                    posts : result
                })
            })
        })
        return;
    }

    Post.find()
        .populate('author')
        .exec((err, result) => {
            if (err) { return next(err) }
            if (!result) {
                res.json({ message: 'There is not exist any post.' });
            }
            res.json({
                posts : result
            })
        })

}


import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: mongoose.SchemaTypes.String, required: true },
    content: { type: mongoose.SchemaTypes.String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    date: { type: mongoose.SchemaTypes.Date, required: true, default: Date.now() },
    comments: [{
        name: { type: mongoose.SchemaTypes.String },
        content: { type: mongoose.SchemaTypes.String },
        date: { type: mongoose.SchemaTypes.Date, default: Date.now()},
    }]
})
PostSchema.virtual('url').get(function() {
    return '/api/dashboard/' + this._id;
})



const Post = mongoose.model('Post', PostSchema);

export default Post;
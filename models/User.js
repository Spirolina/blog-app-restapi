import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: mongoose.SchemaTypes.String, unique: [true, 'This username already exist !'], required: [true, 'Username must be exist.'] },
    hash: { type: mongoose.SchemaTypes.String, required: true },
    salt: { type: mongoose.SchemaTypes.String, required: true },  
    admin: { type: mongoose.SchemaTypes.Boolean, default: false },
})

UserSchema.virtual('url').get(() => {
    return '/api/users/' + this._id;
})

const User = mongoose.model('User', UserSchema);

export default User;
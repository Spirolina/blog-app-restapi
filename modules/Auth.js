import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import fs from 'fs'
import crypto from 'crypto'

let PUBLIC_KEY = process.env.public;
let PRIVATE_KEY = process.env.private;

export function generateSignToken(payload) {
    const token = jwt.sign(payload, {
        key: PRIVATE_KEY,
        passphrase: 'top secret'
    }, {
        algorithm: 'RS256',
        expiresIn: '1h'
    });

    return token;
}

export function verifyToken(token, cb) {
    jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, cb)
}





export function genPassword(password) {
    const salt = crypto
        .randomBytes(32)
        .toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex')
    
    return [salt, hash]
}
  
export function validPassword(password, hash, salt) {
    const hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return hash === hashVerify;
}
  
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    is_mail_confirmed: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    notifications: {
        type: [
            {
                notificationType: String,
                fromUser: String
            }
        ],
        default: []
    },
    friends: {
        type: [
            {
                userName: String
            }
        ],
        default: []
    },
    friends_requests_incoming: {
        type: [
            {
                fromUser: String
            }
        ],
        default: []
    },
    friends_requests_outcoming: {
        type: [
            {
                toUser: String
            }
        ],
        default: []
    }
});
let User;
module.exports = User = mongoose.model("users", UserSchema);
//# sourceMappingURL=User.js.map
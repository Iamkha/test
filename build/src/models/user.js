"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.userInitialData = exports.UserModel = exports.saltRounds = exports.userRole = void 0;
var mongoose_1 = require("mongoose");
var bcrypt_1 = __importDefault(require("bcrypt"));
exports.userRole = {
    ADMIN: 'admin',
    USER: 'user'
};
exports.saltRounds = 10;
var userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        "enum": [exports.userRole.ADMIN, exports.userRole.USER]
    },
    active: {
        type: Boolean,
        required: true,
        "default": true
    }
}, {
    timestamps: true
});
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt_1["default"].compare(candidatePassword, this.password, function (err, isMatch) {
        callback(err, isMatch);
    });
};
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
exports.userInitialData = [
    {
        email: 'admin@example.com',
        password: 'admin@123',
        firstname: 'admin',
        lastname: 'sumitomo',
        roles: ['admin']
    },
];

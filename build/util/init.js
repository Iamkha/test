"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.initialDb = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var user_1 = require("../src/models/user");
var initialDb = function () {
    user_1.UserModel.count(function (_, count) {
        if (count === 0) {
            user_1.userInitialData.forEach(function (userData) {
                user_1.UserModel.create(__assign(__assign({}, userData), { password: bcrypt_1["default"].hashSync(userData.password, user_1.saltRounds) }));
            });
        }
    });
};
exports.initialDb = initialDb;

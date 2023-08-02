"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var secret_1 = require("../util/secret");
var connection = mongoose_1["default"].connection;
var routeApi = process.env.ROUTE_API;
var port = 8181;
mongoose_1["default"].set('strictQuery', false);
mongoose_1["default"].connect(secret_1.MONGODB_URL_LOCAL);
connection.on('connected', function () {
    console.log('Mongo Connection Established');
});
connection.on('reconnected', function () {
    console.log('Mongo Connection Reestablished');
});
connection.on('disconnected', function () {
    console.log('Mongo Connection Disconnected');
    console.log('Trying to reconnect to Mongo ...');
    setTimeout(function () {
        mongoose_1["default"].connect(secret_1.MONGODB_URL_LOCAL, {
            keepAlive: true,
            socketTimeoutMS: 3000,
            connectTimeoutMS: 3000
        });
    }, 3000);
});
connection.on('close', function () {
    console.log('Mongo Connection Closed');
});
connection.on('error', function (error) {
    console.log('Mongo Connection ERROR: ' + error);
});
var app = (0, express_1["default"])();
app.use("/".concat(routeApi, "/test"), function (req, res) {
    res.status(200);
    res.send({
        message: 'OK',
        url: secret_1.MONGODB_URL_LOCAL
    });
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});

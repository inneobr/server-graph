"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = getConnection;
require("dotenv/config");
const oracledb_1 = __importDefault(require("oracledb"));
async function getConnection() {
    return await oracledb_1.default.getConnection({
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        connectString: process.env.DATABASE_HOSTNAME,
    });
}

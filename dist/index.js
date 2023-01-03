"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express_1.default.static('./static')); // new 
let clientId = process.env.CLIENTID;
let access_token;
app.get("/", (req, res) => {
    let redirect_uri = "http://localhost:3001/auth/kakao/callback";
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
    res.render("home", { url });
});
app.get("/auth/kakao/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const client_id = "f2be86524d3f5e2c92b3fb0a546ec586";
    const token = yield (0, axios_1.default)({
        method: "post",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            grant_type: "authorization_code",
            client_id,
            code,
            redirect_uri: "http://localhost:3001/auth/kakao/callback"
        }
    });
    access_token = token.data.access_token;
    // const tokenInfo = await axios({
    //     headers : {
    //         Authorization : `Bearer ${token.data.access_token}`,
    //         "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    //     },
    //     url : "https://kapi.kakao.com/v1/user/access_token_info"
    // })
    res.redirect("/auth/data");
    //res.redirect("/user")
}));
app.get("/auth/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield (0, axios_1.default)({
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        url: "https://kapi.kakao.com/v2/user/me"
    });
    console.log(userData.data, 1);
    res.send(JSON.stringify(userData.data));
}));
app.listen(3001, () => {
    console.log("Server");
});

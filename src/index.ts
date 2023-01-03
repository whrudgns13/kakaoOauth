import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.set("views", __dirname+"/views");
app.set("view engine", "ejs");
app.use(express.static('./static'));     // new 

let clientId = process.env.CLIENTID;
let access_token : string;

app.get("/",(req,res)=>{
    let redirect_uri = "http://localhost:3001/auth/kakao/callback";
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;    
    res.render("home",{url});
})

app.get("/auth/kakao/callback", async (req,res)=>{
    const code = req.query.code;
    const client_id = "f2be86524d3f5e2c92b3fb0a546ec586";
    const token = await axios({
        method : "post",
        url : "https://kauth.kakao.com/oauth/token",
        headers : {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data : {
            grant_type:"authorization_code",
            client_id,
            code,
            redirect_uri : "http://localhost:3001/auth/kakao/callback"
        }
    })
    access_token = token.data.access_token;
    // const tokenInfo = await axios({
    //     headers : {
    //         Authorization : `Bearer ${token.data.access_token}`,
    //         "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    //     },
    //     url : "https://kapi.kakao.com/v1/user/access_token_info"
    // })
   
    res.redirect("/auth/data")
    //res.redirect("/user")
})

app.get("/auth/data",async (req, res)=>{
    const userData = await axios({
        method : "POST",
        headers : {
            Authorization : `Bearer ${access_token}`,
        },
        url : "https://kapi.kakao.com/v2/user/me"
    })
    console.log(userData.data,1);
    res.send(JSON.stringify(userData.data));
})

app.listen(3001,()=>{
    console.log("Server")
})
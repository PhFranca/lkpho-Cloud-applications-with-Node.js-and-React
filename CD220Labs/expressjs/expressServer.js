const express = require('express');
const app = new express();
const months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

let loginDetails = [];

app.get("/",(req,res)=>{
    res.send("Bem-vindo ao 'the express server'")
})

app.get("/loginDetails",(req,res)=>{
    res.send(JSON.stringify(loginDetails));
})

app.post("/login/:name",(req,res)=>{
    loginDetails.push({"name":req.params.name,"login_time":new Date()});
    res.send(req.params.name + ", Você está logado!")
})

app.get("/:name",(req,res)=>{
    res.send("Olá "+req.params.name)
})

app.listen(3333, () => {
    console.log(`Listening at http://localhost:3333`)
})

app.get("/fetchMonth/:num",(req,res)=>{
    let num = parseInt(req.params.num);
    if(num <1 || num >12) {
        res.send("Não é um número de mês válido.")
    } else {
        res.send(months[num-1])
    }
})


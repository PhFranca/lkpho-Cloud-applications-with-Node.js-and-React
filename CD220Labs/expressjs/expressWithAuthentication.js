const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')

let users = []

//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

//Function to check if the user is authenticated
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

const app = express();

app.use(express.json());

app.use(session({secret:"fingerpint"}))

app.use("/auth", function auth(req,res,next){
   if(req.session.authorization) { //get the authorization object stored in the session
       token = req.session.authorization['accessToken']; //retrieve the token from authorization object
       jwt.verify(token, "access",(err,user)=>{ //Use JWT to verify token
           if(!err){
               req.user = user;
               next();
           }
           else{
               return res.status(403).json({message: "Usuário não autenticado."})
           }
        });
    } else {
        return res.status(403).json({message: "Usuário não logado."})
    }
});

app.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Erro ao efetuar login."});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Usuário logado com sucesso!");
  } else {
    return res.status(208).json({message: "Login inválido. Verifique seu usuário e senha."});
  }
});

app.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Usuário registrado com sucesso. Agora você pode logar."});
    } else {
      return res.status(404).json({message: "Usuário já existente!"});    
    }
  } 
  return res.status(404).json({message: "Impossível registrar usuário."});
});

app.get("/auth/get_message", (req,res) => {
  return res.status(200).json({message: "Olá, você é um usuário autenticado! Parabéns!"});
})

const PORT =5000;

app.listen(PORT,()=>console.log("Server is running"));

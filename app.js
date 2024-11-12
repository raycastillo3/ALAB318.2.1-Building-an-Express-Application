const express = require('express'); 
const app = express(); 
const port = 3000; 

app.set("view engine", "pug"); 
app.set("views", "views");

app.get("/", (req, res, next) =>{
    const payload = {
        pageTitle: "Home"
    }
    res.status(200).render("home", payload)
}); 

app.get("/profile", (req, res, next) => {
    res.status(200).render("profile")
})
app.get("/user", (req, res, next) =>{

    res.status(200).render("user")
})
const server = app.listen(port, ()=> console.log("Server listening on port: "+ port)); 
const express = require('express'); 
const middleware = require('./middleware');
const path = require('path'); 
const bodyParse = require('body-parser')
const app = express(); 
const port = 3000; 
const mongoose = require('./database');


app.set("view engine", "pug"); 
app.set("views", "views");

app.use(bodyParse.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, "public")))


//ROUTES
const loginRoute = require('./routes/loginRoutes'); 
const registerRoute = require('./routes/registerRoutes'); 

app.use('/login', loginRoute);
app.use('/register', registerRoute);


app.get("/", middleware.requireLogin, (req, res, next) =>{
    const payload = {
        pageTitle: "Home"
    }
    res.status(200).render("home", payload)
}); 

app.get('/test', (req, res) => {
    res.render('home');
});



//debuggin: 
// app.get('/test-static', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/css/login.css'));
// });

const server = app.listen(port, ()=> console.log("Server listening on port: "+ port)); 
const express = require('express'); 
const middleware = require('./middleware');
const path = require('path'); 
const app = express(); 
const port = 3000; 

app.set("view engine", "pug"); 
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")))


//ROUTES
const loginRoute = require('./routes/loginRoutes'); 
app.use('/login', loginRoute);


app.get("/", middleware.requireLogin, (req, res, next) =>{
    const payload = {
        pageTitle: "Home"
    }
    res.status(200).render("home", payload)
}); 

app.get('/test', (req, res) => {
    res.render('home');
});

// app.get("/profile", (req, res, next) => {
//     res.status(200).render("profile")
// })
// app.get("/user", (req, res, next) =>{
//     res.status(200).render("user")
// })

//debuggin: 
// app.get('/test-static', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/css/login.css'));
// });

const server = app.listen(port, ()=> console.log("Server listening on port: "+ port)); 
const express = require('express'); 
const middleware = require('./middleware');
const path = require('path'); 
const bodyParse = require('body-parser');
const app = express(); 
const port = 3000; 
const mongoose = require('./database');
const session = require('express-session');



app.set("view engine", "pug"); 
app.set("views", "views");


app.use(bodyParse.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: false,
}))
//ROUTES
const loginRoute = require('./routes/loginRoutes'); 
const logoutRoute = require('./routes/logoutRoutes'); 
const registerRoute = require('./routes/registerRoutes'); 
const profileRoutes = require('./routes/profileRoutes'); 

const postRoutes = require('./routes/postRoutes'); 



app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/register', registerRoute);
app.use('/profile', middleware.requireLogin, profileRoutes);
app.use('/posts', postRoutes)
// API ROUTES
const postsApiRoutes = require('./routes/api/posts')
app.use('/api/posts', postsApiRoutes);




app.get("/", middleware.requireLogin, (req, res, next) =>{
    const payload = {
        pageTitle: "Dashboard",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
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
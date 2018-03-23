const express = require('express') ;
const exphbs  = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport); 
//DB config
const db = require('./config/database');

const app = express() ;
//mongoose global promise - get rid of warning
mongoose.Promise = global.Promise ;

//Connect to mongoose
mongoose.connect(db.mongoURI,{})
    .then( () => console.log(' Connected')) 
    .catch( err => console.log(err) );  


//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static middleware
app.use(express.static(path.join(__dirname,'public')));

//method override miiddle ware
app.use(methodOverride('_method')) ;

//Express session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()) ;

//Global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg') ;
    res.locals.error_msg = req.flash('error_msg') ;
    res.locals.error = req.flash('error') ;
    res.locals.user = req.user ||  null ;
    next();
})

const port = process.env.PORT || 5000 ;
// Index Route
app.get('/',(req,res) => {
    const title = 'Welcome' ;
    res.render('index',{
        title : title
    });
});
//About Route
app.get('/about',(req,res) => {
    res.render('about');
});

//Use Routes
app.use('/ideas' ,ideas) ;
app.use('/users' ,users) ;

app.listen(port, () => {
console.log(`Server started on port ${port} `) ;
}) ;





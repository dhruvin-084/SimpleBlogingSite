const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}).then(()=>console.log('mongodb connected'))
    .catch((err) => console.log(err));


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//routers
const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter); 

const articleRouter = require('./routes/article');
app.use('/article', articleRouter);


app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => console.log('server running on 3000'));


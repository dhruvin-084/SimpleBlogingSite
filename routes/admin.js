const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');



const Article = require('../models/Article');
const Admin = require('../models/Admin');

const { InitPassport, checkAuthenticated, checkNotAuthenticated} = require('../helpers/passport-config');
InitPassport(passport, async (email) => {
    try{
        const user = await Admin.findOne({email: email});
        return user;
    }catch(err) {
        console.log(err);
    }        
}, async (id) => {
    try{
        const user = await Admin.findById(id);
        return user;
    }catch(err) {
        console.log(err);
    } 
});


const router = express.Router();

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
}));

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/admin/login');
})

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register');
});

router.post('/register', checkNotAuthenticated, (req, res) =>{
    bcrypt.hash(req.body.password, 15)
        .then(hash => {
            const admin = new Admin({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            admin.save().then(adm => {
                res.redirect('/admin/login');
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
});

router.get('/dashboard', checkAuthenticated, (req, res) => {

    Article.find().sort({createdAt: 'desc'}).select('title').select('createdAt').select('slug')
        .then(articles => {

            res.render('dashboard', {
                articles: articles
            });
        }).catch(err => console.log(err));
})

router.get('/newArticle', checkAuthenticated, (req, res) => {
    res.render('newArticle');
});

router.post('/newArticle', checkAuthenticated, (req, res) => {
    console.log('new Article');
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });

    article.save()
        .then(art => {
            console.log(art);
            res.redirect('/article');
        })
        .catch((err) => console.log(err));

});

router.delete('/delete/:id', checkAuthenticated, (req, res) => {
    Article.findByIdAndDelete(req.params.id)
        .then((art)=>{
            console.log('delete' + req.params.id);
            console.log(art);
            res.redirect('/admin/dashboard');
        }).catch(err => console.log(err));
});



module.exports = router;
const express = require('express');
const mongoose = require('mongoose');

const Article = require('../models/Article');

const router = express.Router();

router.get('/', (req, res) => {
    Article.find().sort({createdAt: 'desc'})
        .then(articles => {
            console.log(articles);
            res.render('article', {
                articles: articles
            });
        }).catch(err => console.log(err));
});

router.get('/:slug', (req, res) => {
    console.log('indArticle');
    Article.findOne({slug: req.params.slug})
        .then(article => {
            //console.log(article);
            res.render('indArticle', {article: article});
        }).catch(err => console.log(err));
});



module.exports = router;
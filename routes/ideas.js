const express = require('express') ;
const mongoose = require('mongoose') ;
const router = express.Router() ;
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model
require('../models/Ideas') ;
const Idea = mongoose.model('ideas');


//Idea index page
router.get('/', ensureAuthenticated ,(req,res) => {
    Idea.find({user : req.user.id})
    .sort({ date : 'desc' })   
    .then( ideas => {
            res.render('ideas/index',{
                ideas : ideas 
            });
        });
});

//Add idea form
router.get('/add', ensureAuthenticated ,(req,res) => {
    res.render('ideas/add');
});

//Edit idea form
router.get('/edit/:id',ensureAuthenticated ,(req,res) => {
    Idea.findOne({
        _id : req.params.id 
    })
    .then( idea => {
       if(idea.user!=req.user.id){
        req.flash('error_msg','Not Authorized');
        res.redirect('/ideas');
       }
       else{
        res.render('ideas/edit' , {
            idea : idea 
        });
       }
        
    });
});

//process form
router.post('/',ensureAuthenticated ,(req,res) => {
    let errors = [] ;

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }
    if(errors.length>0){
        res.render('/add',{
            errors : errors ,
            title : req.body.title ,
            details : req.body.details 
        });
    }   else {
        const newUser ={
            title : req.body.title ,
            details : req.body.details,
            user : req.user.id 
        }
        new Idea(newUser)
        .save()
        .then( idea => {
            req.flash('success_msg','Video idea added');
            res.redirect('/ideas') ;
        })
    }
});

//Edit form Process
router.put('/:id',ensureAuthenticated ,(req,res) => {
    Idea.findOne({
        _id : req.params.id 
    })
    .then( idea => {
        //new Values
        idea.title = req.body.title ;
        idea.details = req.body.details ;
        
        idea.save() 
        .then( idea => {
            req.flash('success_msg','Video idea editted');
            res.redirect('/ideas') ;
        } )
    } )
})

//Delete ideas
router.delete('/:id',ensureAuthenticated ,(req,res) => {
    Idea.remove({_id: req.params.id})
        .then( () => {
            req.flash('success_msg','Video idea removed');
            res.redirect('/ideas') ;
        })
} );

module.exports = router ;
 
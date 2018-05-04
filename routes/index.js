var express = require('express');
var router = express.Router();

var user = require('../model/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies._id) {
    user.find({_id: req.cookies._id }, function(err, doc) {
      console.log(doc);
      res.render('index', { title: doc[0], active: true });
    })
  } else {
    res.render('index', { title: 'Express', active: false });
  } 
});

router.get('/login', function(req, res, next) {
  res.render('getLogin', { title: 'login'});
});

router.get('/register', function(req, res, next) {
  res.render('getRegister', { title: 'getRister'});
})

router.get('/logout', function(req, res, next) {
  res.cookie("_id", "", {
    path: "/",
    maxAge: -1
  });
  res.redirect("/");
})

router.post('/delet', function(req, res, next) {
  var num = req.body.num;
  var _id = req.cookies._id;
  user.findOne({ _id: _id }, function(err, doc) {
    if (err) {
      res.send("出错了！");
    } else {
      console.log("doc:" + doc);
      if (doc) {
        doc.content.splice(num, 1);
      }
      doc.save();
      res.redirect("/");
      }
  })
})

router.post('/register', function(req, res, next) {
  var username = req.body.username;
  var passwd = req.body.passwd; 

  user.findOne({ username: username}, function(err, doc) {
    if (err) {
        res.json({
          status: "1",
          message: err.message
        });
    } else {
      if (doc) {
        res.render('register', {});
      } else {
        user.create({ username: username, passwd: passwd }, function(err) {
          if (err) {
              res.json({
                status: '1',
                msg: err.message
              });
          } else {
              res.redirect("/");
          }
        })
      }
    }
  })
  
 })

router.post('/login', function(req, res, next) {
  let param = {
    username : req.body.username,
    passwd : req.body.passwd
  };

  user.findOne(param, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: '密码不对'
      });
    } else {
      if (doc) {
          res.cookie("_id", doc._id, {
            path: '/',
            maxAge: 1000*60*60*24*7
          })
        res.redirect("/");
      } else {
        res.render('login', {});
      }
    }
  })
})

  router.post('/addNote', function(req, res, next) {
    var title = req.body.title;
    var content = req.body.content;
    var _id = req.cookies._id;
    user.findOne({ _id: _id }, function(err, doc) {
      if (err) {
        res.send("出错了！");
      } else {
        console.log("doc:" + doc);
        if (doc) {
          doc.content.push({
            title: title,
            content: content
          });
        }
        doc.save();
        res.redirect("/");
        }
    })
})

module.exports = router;

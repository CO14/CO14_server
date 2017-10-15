const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../db/signup');

require('dotenv').config();

// User Validation
function isUserValid(account) {
  const hasValidFirstName = typeof account.first_name == "string" && account.first_name.trim() != '';
  const hasValidLastName = typeof account.last_name == "string" && account.last_name.trim() != '';
  const hasValidEmail = validEmailAddress(account.email);
  const hasValidPassword = validPassword(account.password)
  return hasValidEmail && hasValidFirstName && hasValidLastName && hasValidPassword;
};

// Validation for Login
function isLoginValid(account) {
  const hasValidEmail = validEmailAddress(account.email);
  const hasValidPassword = validPassword(account.password);
  return hasValidEmail && hasValidPassword;
};

// Validation for email address
function validEmailAddress(useremail) {
  const filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (filter.test(useremail)) {
    return true;
  } else {
    return false;
  };
};

// Validation for password, Password must contain be 8-16 charachters, contain 1 upper and lower case, 1 numeric and a special character
function validPassword(userPassword) {
  const password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
  if (userPassword.match(password)) {
    return true;
  } else {
    return false;
  };
};

router.get('/', (req, res) => {
  res.json({
    message: "Endpoint Works"
  });
});

//SIGNUP
router.post('/signup', (req, res, next) => {
  if(isUserValid(req.body)) {
    User.getUserByEmail(req.body.email)
      .then(user => {
        console.log("User: ", user)
        if(!user) {
          bcrypt.hash(req.body.password, 10)
            .then(hash => {
              const account = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hash,
                image: req.body.image,
                facebook_url: req.body.facebook_url,
                instagram_url: req.body.instagram_url,
                twitter_url: req.body.twitter_url
              };
              User.createNewAccount(account)
                .then(id => {
                  jwt.sign({
                    id,
                  }, process.env.TOKEN_SECRET, {
                    expiresIn: '7d'
                  }, (err, token) => {
                    console.log('err ', err);
                    console.log('token', token);
                    console.log('id', id);
                    res.json({
                      id,
                      email: account.email,
                      token,
                      message: "New Account Created"
                    });
                  });
                });
            });
        } else {
          next(new Error("Email is already in use"));
        }
      });
  } else {
    next(new Error("Invalid User"));
  }
});

// LOGIN

router.post('/login', (req, res, next) => {
  if (isLoginValid(req.body)) {
    User.getUserByEmail(req.body.email)
      .then(account => {
        if (account) {
          bcrypt.compare(req.body.password, account.password)
            .then(result => {
            if (result) {
              jwt.sign({
                id: account.id
              }, process.env.TOKEN_SECRET, {
                expiresIn: '7d'
              }, (err, token) => {
                console.log('err ', err);
                console.log('token', token);
                res.json({
                  id: account.id,
                  token,
                  message: "Logged In"
                });
              });
            } else {
              next(new Error("Invalid Email and/or Password"));
            }
          });
        } else {
          next(new Error("Invalid Email and/or Password"));
        }
      });
  } else {
    next(new Error("Invalid Email and/or Password"));
  }
});

module.exports = router;

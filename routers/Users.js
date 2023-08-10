'use strict'

const {Router} = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = Router()

router.post('/register', async(req, res, next) => {
  const {body} = req;
  const userData = new User(body);
  console.log(body);

  if (!(userData.email && userData.password && userData.first_name && userData.last_name)) {
    res.send("All input is required");
    return
  }

  await User.findOne({
    email: req.body.email
  })
  .then(user => {
    if(!user) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        userData.password = hash;
        userData.save()
          .then(user => {
            res.json({ status: user.email + ' has been registerd!'})
            res.statusCode = 201;
          })
          .catch(err => {
            res.send('error:' + err)
          })
      })
    } else {
      res.json({ error: 'User already exists'})
    }
  })
  .catch(err => {
    res.send('error:' + err)
  })
})

router.post('/login', async (req, res) => {

    console.log(req.body)
    await User.findOne({
      email: req.body.email
    })
    .then(user => {
      if(user) {
        if(bcrypt.compareSync(req.body.password, user.password)) {

          const payload = {
            // _id: user._id,  
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            avatar: user.avatar
          }

          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          })

          console.log("token is valid")

          res.statusCode = 201;
          res.send(token)
        } else {
          res.statusCode = 404,
          res.json({error: "Invalid password! Please try again"})
        }
      } else {
        res.json({ error: "User does not exist!"})
      }
    })
    .catch(err => {
      res.send("error" + err)
    })
})

router.put('/edit', async(req, res, next) => {
  try {
      const {body} = req;
      const userData = new User(body);
      console.log(body);

      if (!(userData.first_name && userData.last_name)) {
        res.status(404);  
        res.send("Your name is required");
      }

      const result = await User.findOne(
        {email: userData.email}
      )
      console.log(result)
      // const result = await Menu.findOne({"title": iTitle})
      if(result === null) {
          res.statusCode = 404;
          res.send({
              succeed: false,
          })
      } else {
        Object.assign(result, await User.updateOne(
            {email: userData.email},
            {$set: {first_name: userData.first_name, 
                    last_name:  userData.last_name, 
                    telephone: userData.telephone }}
        ))
        res.statusCode = 201;
        res.send({
            succeed: true,
        })
      }
    } catch (e) {
      next();
    }
  })


module.exports = router;
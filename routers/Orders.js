'use strict'

const { Router } = require('express');
const Order = require('../models/Order');

const router = Router();

router.post('/order/:id', async(req, res, next) => {
  try {
    const {body} = req;
    const order = new Order(body);
    const dbRes = await order.save();
    res.statusCode = 201;
    res.send({
      succeed: true,
      _id: dbRes._id
    })
  } catch (e) {
    next();
  }
})

router.get('/maxorderid', async (req, res, next) => {
  const dbRes = await Order.aggregate([
    {
      $group: {
        _id: null,
        maxOrderId: {$max: "$orderId"}
      }
    }  
  ]);
  res.send(dbRes);
})

router.get('/cart/:id', async (req, res, next) => {
  const dbRes = await Order.find({
    email: req.params.id
  })
  res.statusCode = 201;
  res.send(dbRes)
})

router.put("/pickuporder", async (req, res, next) => {  
  try {
      const orderId = Number(req.body.orderId);
      const email = req.body.email

      const result = await Order.findOne(
          {orderId: orderId, email: email}
      )
      console.log(result)
      // const result = await Menu.findOne({"title": iTitle})
      if(result === null) {
          res.statusCode = 404;
          res.send({
              succeed: false,
          })
      } else {
          Object.assign(result, await Order.updateOne(
              {orderId: orderId, email: email},
              {$set: {isCaseClosed: true }}
          ))
          res.statusCode = 201;
          res.send({
              succeed: true,
          });
      }
  } catch (e) {
      next();
  }
  //req.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
})

module.exports = router;
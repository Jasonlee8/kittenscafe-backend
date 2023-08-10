'use strict'

const {Router} = require('express');
const Menu = require('../models/Menu');

const router = Router();

router.get('/menu', async (req, res, next) => {
  const dbRes = await Menu.find();
  res.send(dbRes)

})

router.get('/order/:id', async(req, res, next) => {

  const id = Number(req.params.id)
  
  const dbRes = await Menu.findOne({
    id: id
  });
  res.send(dbRes)
 
})

module.exports = router;
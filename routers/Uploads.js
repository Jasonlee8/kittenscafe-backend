const AWS = require("aws-sdk");
const { Router } = require('express');
const User = require('../models/User');
const Upload = require('../models/Upload');
const router = Router();

AWS.config.loadFromPath("./config.json");
const responseJSON = function(res, ret) {
  if (typeof ret === "undefined") {
    res.json({
      code: "-200",
      msg: "The operation failure"
    });
  } else {
    res.json(ret);
  }
};

s3 = new AWS.S3({ apiVersion: "2006-03-01", signatureVersion: 'v2'
});

router.put("/upload",  async (req, res, next) => {
  console.log(req.body)
  const key = Math.random()
    .toString(36)
    .substr(2);
  console.log("key===", key);

  await User.updateOne(
    {email: req.body.email},
    {$set: {avatar: `${process.env.REACT_APP_AVATAR_IMG}/${req.body.email}/${key}`}}
  )

  const buf = new Buffer.from(
    req.body.data.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const bucket = `kittenscafe.com/${req.body.folder}`;
  //   const key = req.body.id.toString();
  console.log("bucket===", bucket);
  const params = {
    Key: key,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    Bucket: bucket
  };

  s3.upload(params, function(err, result) {
    if (!err) {
      result = {
        key: key,
        avatar: `${process.env.REACT_APP_AVATAR_IMG}/${req.body.email}/${key}`
      }
    } else {
      result = {
        status: 201,
        msg: err
      };
    }
    responseJSON(res, result);
  });
});

router.delete("/upload/:id",  async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(id)
    const dbRes = await Upload.deleteOne({
      avatar : id
    })
    res.send(dbRes)
    // const bucket = 'handycafe';
    const bucket = 'kittenscafe.com';
    const params = {
      Bucket: bucket,
      Key: `images/uploads/${req.params.email}/id`,
    };
  
    await s3.deleteObject(params, function(err, result) {
      if (err) {
        result = {
          status: 401,
          msg: err
        };
        console.log(err, err.stack)
      } else {
        console.log(result)
      }
    }).promise();
  }
   catch (e) {
    next(e)
  }
});

router.get('/avatar', async (req, res, next) => {
  console.log(req.query)
  const dbRes = await Upload.find({
      email: req.query.email
  })
  res.statusCode = 201;
  res.send(dbRes);
});

router.post("/fileurltodb", async(req, res, next) => {
  try {
      const {body} = req;
      console.log(req.body.email)
      const upload = new Upload(body);
      const dbRes = await upload.save();
      res.statusCode = 201;       
      res.send({
          succeed: true,
          _id: dbRes._id
      })
  } catch (e) {
      next();
  }
})

module.exports = router;


// router.put("/profileimage/:id", async (req, res, next) => {  
//   try {
      
//       const email = req.body.email;
//       const { id } = req.params
//       console.log(id)
//       const dbRes = await Upload.updateOne(
//         { email: email },
//         { profile_image : id }
//       )

//       res.statusCode = 201;
//       res.send({
//           succeed: true,
//       });
    
//   } catch (e) {
//       next();
//   }
//   //req.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
// })

// router.get('/avatar/:id', async (req, res, next) => {
//   console.log(req.params)
//   const bucket = `handycafe/images/uploads/${req.params.id}`;
//   const params = {
//     // Key: req.params.id,
//     Bucket: bucket,
//   };
//   s3.getObject(params, function(err, result) {
//     if (err) {
//       result = {
//         status: 201,
//         msg: err
//       };
//       console.log(err, err.stack)
//     } else {
//       console.log(result)
//     }
//   });
// });

  //try {
    //res.send(dbRes)
  //   const bucket = `handycafe/images/uploads/${req.query.email}`;
  //   const params = {
  //     //Key: id,
  //     Bucket: bucket,
  //   };
  
  //   s3.getObject(params, function(err, result) {
  //     if (err) {
  //       console.log(err, err.stack)
  //     } else {
  //       resolve(data.Body.toString('utf-8'))
  //     }
  //   });
  // }
  //  catch (e) {
  //   next(e)
  // }
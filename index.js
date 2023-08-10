const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const yamljs = require('yamljs');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const menuRouter = require('./routers/Menus');
const orderRouter = require('./routers/Orders');
const userRouter = require('./routers/Users');
const uploadRouter = require('./routers/Uploads')
require('dotenv').config()

const app = express();
app.use(cors());

mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
    //'mongodb://localhost:27017/test',  { useNewUrlParser: true, useUnifiedTopology: true }
);


const openapiDoc = yamljs.load('./openapi.yaml');

app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiDoc));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(menuRouter);
app.use(orderRouter);
app.use(userRouter);
app.use(uploadRouter);

// const port = process.env.PORT || 5000;

app.listen(8080, () => console.log("listening on port 8080"));
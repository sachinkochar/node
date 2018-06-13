const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors= require('cors');
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

const mongoose= require('mongoose');
const dbUrl= require('./config/config');
const uri= dbUrl.database.connectionString;

mongoose.connect(uri,(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('MongoDB is at your service');
    }
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors())
app.use('/products',productsRoutes);
app.use('/orders',ordersRoutes);

app.use((req, res, next)=>{
    const error= new Error('Not Found');
    error.status=404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        message: error.message
    })
})

module.exports = app;
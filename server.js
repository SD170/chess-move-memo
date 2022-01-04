const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// const cors = require("cors");

//load env vars
dotenv.config({path: './config.env'});

//route files
const chess = require('./routes/chess.route');


const app = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//dev logging middleware
if(process.env.NODE_ENV==='development'){   //only when using dev env
    app.use(morgan('dev'));
}

//mount routers
app.use('/',chess);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled PromeseRejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    
    //Close Server & exit process
    server.close(()=> process.exit(1));
})
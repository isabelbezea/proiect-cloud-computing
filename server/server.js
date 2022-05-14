const express = require('express')
const Sequelize = require('sequelize')
const bodyParser = require("body-parser");
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(bodyParser.json());
app.use(cors())

//connect to db
const sequelize = new Sequelize('databaseProjectCloudComputing','admin', 'adminadmin',{
  host: 'databaseprojectcloudcomputing.cro6e7khravp.us-east-2.rds.amazonaws.com',
  port: 3306,
  dialect: 'mysql',
  define: {
    timestamps: false
  }
})

sequelize.authenticate().then(() => {
  console.log("Connected to database")
}).catch((e) => {
  console.log(e)
  console.log("Unable to connect to database")
})

//create the model for db

const Bookings = sequelize.define('databaseProjectCloudComputing',{
  hotelName:{
    type: Sequelize.STRING,
    allowNUll: false,
    require: true
  },
  hotelLocation:{
    type: Sequelize.STRING,
    allowNull: false,
    require: true

  },
  bookingPrice:{
    type: Sequelize.FLOAT,
    allowNull: false,
    require: true

  },
  numberOfPersons:{
    type: Sequelize.INTEGER,
    allowNull: false,
    require: true

  },
  checkIn:{
    type: Sequelize.STRING,
    allowNUll: false,
    require: true
  },
  checkOut:{
    type: Sequelize.STRING,
    allowNUll: false,
    require: true
  },
  youtubeUrl:{
    type: Sequelize.STRING,
    allowNUll: false,
    require: true
  }
})

//Make sure schema is created

app.get('/createdb', (request, response) => {
  sequelize.sync({force:true}).then(() => {
      response.status(200).send('tables created')
  }).catch((e) => {
      console.log(e)
      response.status(200).send('could not create tables')
  })
})


//Youtube

// app.get('/youtube', async(req,res) =>{
//   try{
//     let url = 'https://youtube.googleapis.com/youtube/v3/search?q=' + req.body.title + '&key=AIzaSyCpePCZfK_XhVWcrXQyLB7SinKSrmNoWNk&type=video&part=snippet'
//     let response = await axios.get(url)
//     let first_url = "https://www.youtube.com/watch?v=" + response.data.items[0].id.videoId
//     console.log(first_url)
//   }catch(e){
//     console.warn(e)
//   }
 
// } )


//CRUD
app.get('/bookings', async(req, res)=>{
  try{
    let bookings = await Bookings.findAll();
    res.status(200).json(bookings)
  }catch(e){
    console.warn(e);
    res.status(500).json({ message: "Could not retrieve data" });

  }
})

app.post('/bookings', async(req,res)=>{
  try{
   let url = 'https://youtube.googleapis.com/youtube/v3/search?q=atractions%20in%20' + req.body.hotelLocation + '&key=AIzaSyC4IK9S-ffeuJDOIIli0cnpWYjudFhC03Y&type=video&part=snippet'
   let response = await axios.get(url)
   let first_url = "https://www.youtube.com/watch?v=" + response.data.items[0].id.videoId
   console.log(first_url)
   
    const booking = {
      hotelName: req.body.hotelName,
      hotelLocation: req.body.hotelLocation,
      bookingPrice: req.body.bookingPrice,
      numberOfPersons: req.body.numberOfPersons,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      youtubeUrl: first_url
    }
    
    await Bookings.create(booking)
    res.status(201).json({ message: "booking " + booking.hotelName + " was created" });
  }catch(e){
    console.warn(e);
    res.status(500).json({ message: "Could not create new booking" });

  } 
})


app.delete('/bookings/:hotelName', async (req,res)=>{
  try {
    let booking = await Bookings.findOne({where: {hotelName: req.params.hotelName}});
    if (booking) {
      await booking.destroy();

      res.status(200).json({ message: "booking " + req.params.hotelName + " was deleted" });
    } else {
      res.status(200).json({ message: "booking " + req.params.hotelName + " was not found" });
    }
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "Could not delete booking record" });
  }

})

app.listen(8080, ()=>{
    console.log("Server started at 8080")
})
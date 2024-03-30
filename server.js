/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Abhi Maulikkumar Patel
* Student ID: 137588224 
* Date: 16 - 02 - 2024
*
* Published URL: 
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
const path = require('path');

const HTTP_PORT = process.env.PORT || 2212;

app.set('view engine', 'ejs');
app.use(express.static('public')); 

app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get('/lego/sets', async (req,res)=>{
  try {
    let theme = req.query.theme;
    let sets;
    if (theme) {
      sets = await legoData.getSetsByTheme(theme);
    } else {
      sets = await legoData.getAllSets();
    }
    if (sets.length === 0) {
      throw new Error("No LEGO sets found for the specified theme");
    }
    res.render("sets", { sets: sets, page: '/lego/sets', theme: theme });
  } catch (err) {
    res.status(404).render("404", { message: err.message || "Something went wrong while fetching the LEGO set details"});
  }
});

app.get('/lego/sets/:idDemo', async (req,res)=>{
  let idDemo = req.params.idDemo;
  try {
    let set = await legoData.getSetByNum(idDemo);
    res.render("set", {set: set});
  } catch (err) {
    res.status(404).render("404", { message: "It seems the LEGO set you're looking for does not yet exist"});
  }
});

// Add Set Route
app.get('/lego/addSet', (req, res) => {
try {
  res.render("/views/addSet"); }
  catch (err) {
    res.status(500).render("500", { message: "It seems Internal Server Error"});
  }
});

// Edit Set Route
app.get('/lego/editSet/:setNum', (req, res) => {

  try {
  let setNum = req.params.setNum;
  // Assuming you have an editSet.ejs file for editing a set
  res.render("editSet", { setNum: setNum }); }
  catch (err) {
    res.status(500).render("500", { message: "It seems Internal Server Error"});
  }
});


// 500 Error Route
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

app.use((req, res, next) => {
  res.status(404).render("404", { message: "The page you're looking for cannot be found" });
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: http://localhost:${HTTP_PORT}`) });
});


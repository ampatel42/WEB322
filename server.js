/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Abhi Maulikkumar Patel
* Student ID: 137588224 
* Date: 02 - 02 - 2024
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require('express');
const app = express();
const legoData = require("./modules/legoSets");

legoData.initialize()
  .then(() => {
    
    app.get("/", (req, res) => {
      res.send("Assignment 2: Abhi Maulikkumar Patel - Your Student Id: 137588224");
    });

    app.get("/lego/sets", (req, res) => {
      const allSets = legoData.getAllSets();
      res.json(allSets);
    });

    app.get("/lego/sets/num-demo", (req, res) => {
      legoData.getSetByNum("701")
        .then((set) => {
          res.json(set);
        })
        .catch((error) => {
          res.status(404).send(`Error: Set with number 701 not found. Details: ${error}`);
        });
    });

    app.get("/lego/sets/theme-demo", (req, res) => {
      legoData.getSetsByTheme("Outback")
        .then((sets) => {
          res.json(sets);
        })
        .catch((error) => {
          res.status(404).send(`Error: No sets found for the theme "Outback". Details: ${error}`);
        });
    });
    
    const PORT = 2212;
    app.listen(PORT, () => {
      console.log(`Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error: Initialization failed. Details: " + error);
  });

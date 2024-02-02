const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");

let sets = [];

async function initialize() {
  return new Promise((resolve, reject) => {
    sets = setData.map((set) => {
      const theme = themeData.find((theme) => theme.id === set.theme_id).name;
      return { ...set, theme };
    });
    if (sets.length > 0) {
      resolve("Initialization successful");
    } else {
      reject("Initialization failed");
    }
  });
}

async function getAllSets() {
  return new Promise((resolve, reject) => {
    if (sets.length > 0) {
      resolve(sets);
    } else {
      reject("No sets found");
    }
  });
}

async function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    const set = sets.find((s) => s.set_num === setNum);
    if (set) {
      resolve(set);
    } else {
      reject("Set not found");
    }
  });
}

async function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    const matchingSets = sets.filter((s) =>
      s.theme.toLowerCase().includes(theme.toLowerCase())
    );
    if (matchingSets.length > 0) {
      resolve(matchingSets);
    } else {
      reject("No sets found for the theme");
    }
  });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

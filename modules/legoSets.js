const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is optional and may be needed depending on your setup
    }
  }
});

const Set = sequelize.define('Set', {
  set_num: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: DataTypes.STRING,
  year: DataTypes.INTEGER,
  num_parts: DataTypes.INTEGER,
  theme_id: DataTypes.INTEGER,
  img_url: DataTypes.STRING
}, {
  timestamps: false // Disable createdAt and updatedAt fields
});

const Theme = sequelize.define('Theme', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING
}, {
  timestamps: false // Disable createdAt and updatedAt fields
});

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

async function initialize() {
  try {
    await sequelize.sync();
    console.log('Database synchronized.');
    console.log('Inserting existing sets and themes...');
    const setData = require("../data/setData.json");
    const themeData = require("../data/themeData.json");
    await Theme.bulkCreate(themeData);
    await Set.bulkCreate(setData);
    console.log('Data inserted successfully!');
  } catch (error) {
    console.error("Error initializing:", error);
  }
}

async function getAllSets() {
  try {
    const sets = await Set.findAll({ include: Theme });
    return sets;
  } catch (error) {
    throw new Error("Error fetching sets: " + error.message);
  }
}

async function getSetByNum(setNum) {
  try {
    const set = await Set.findOne({ where: { set_num: setNum }, include: Theme });
    if (set) {
      return set;
    } else {
      throw new Error("Set not found");
    }
  } catch (error) {
    throw new Error("Error fetching set: " + error.message);
  }
}

async function getSetsByTheme(theme) {
  try {
    const sets = await Set.findAll({
      include: Theme,
      where: {
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`
        }
      }
    });
    if (sets.length > 0) {
      return sets;
    } else {
      throw new Error("No sets found for the theme");
    }
  } catch (error) {
    throw new Error("Error fetching sets: " + error.message);
  }
}

async function addSet(setData) {
  try {
    const newSet = await Set.create({
      set_num: setData.set_num,
      name: setData.name,
      year: setData.year,
      num_parts: setData.num_parts,
      theme_id: setData.theme_id,
      img_url: setData.img_url,
    });
    return newSet;
  } catch (err) {
    console.error('Error adding new set:', err);
    throw err;
  }
}

async function editSet(set_num, setData) {
  try {
    const result = await Set.update(setData, {
      where: { set_num: set_num }
    });

    // Check if any rows were updated
    if (result[0] === 0) {
      throw new Error('Set not found or data unchanged');
    }
  } catch (err) {
    console.error('Error updating set:', err);
    throw err;
  }
}

async function deleteSet(set_num) {
  try {
    const result = await Set.destroy({
      where: { set_num: set_num }
    });

    if (result === 0) {
      throw new Error('Set not found');
    }
  } catch (err) {
    console.error('Error deleting set:', err);
    throw err;
  }
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, editSet, deleteSet };

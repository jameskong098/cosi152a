const fs = require("fs");

const customReadFile = (file, res) => {
    fs.readFile(`./${file}`, (error, data) => {
      if (error) {
        console.log("Error reading the file");
      }
      res.end(data);
    });
};

exports.customReadFile = customReadFile;
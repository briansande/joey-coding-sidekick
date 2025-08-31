const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'media', 'achievements');
const maxSize = 64;

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.png') {
      const filePath = path.join(directoryPath, file);
      const image = sharp(filePath);

      image
        .metadata()
        .then(metadata => {
          if (metadata.width > maxSize || metadata.height > maxSize) {
            console.log(`Resizing ${file}...`);
            return image
              .resize({
                width: maxSize,
                height: maxSize,
                fit: 'inside',
                withoutEnlargement: true
              })
              .toBuffer((err, buffer) => {
                if(err) throw err;
                fs.writeFile(filePath, buffer, (err) => {
                  if(err) throw err;
                  console.log(`Finished resizing ${file}`);
                });
              });
          } else {
            console.log(`Skipping ${file}, already within size limits.`);
          }
        })
        .catch(err => {
          console.error(`Error processing ${file}:`, err);
        });
    }
  });
});
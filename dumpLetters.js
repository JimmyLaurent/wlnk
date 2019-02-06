const fs = require('fs');
const { PNG } = require('pngjs');
const crypto = require('crypto');

// var pData = fs.readFileSync('./pictures/new12.png');
// dumpLetters(pData);

function dumpLetters(data) {
  const png = PNG.sync.read(data);
  let count = 0;

  for (var i = 0; i < png.data.length; i++) {
    if (png.data[i] !== 0 && png.data[i] !== 255) {
      png.data[i] = 255;
    }
  }

  let letters = [];
  let currentLetter = {};
  let foundLetter = false;
  for (var x = 0, j = png.width; x < j; ++x) {
    // for every column
    var foundLetterInColumn = false;

    for (var y = 0, k = png.height; y < k; ++y) {
      // for every pixel
      var pixIndex = (y * png.width + x) * 4;
      if (png.data[pixIndex] === 0) {
        // if we're dealing with a letter pixel
        foundLetterInColumn = foundLetter = true;
        // set data for this letter
        currentLetter.minX = Math.min(x, currentLetter.minX || Infinity);
        currentLetter.maxX = Math.max(x, currentLetter.maxX || -1);
        currentLetter.minY = Math.min(y, currentLetter.minY || Infinity);
        currentLetter.maxY = Math.max(y, currentLetter.maxY || -1);
      }
    }

    // if we've reached the end of this letter, push it to letters array
    if (!foundLetterInColumn && foundLetter) {
      // get letter pixels
      letters.push({
        minX: currentLetter.minX,
        minY: currentLetter.minY,
        maxX: currentLetter.maxX - currentLetter.minX,
        maxY: currentLetter.maxY - currentLetter.minY
      });
      const height = currentLetter.maxY - currentLetter.minY + 1;
      const width = currentLetter.maxX - currentLetter.minX + 1;
      var dst = new PNG({ width, height });
      PNG.bitblt(
        png,
        dst,
        currentLetter.minX,
        currentLetter.minY,
        width,
        height,
        0,
        0
      );
      const buffer = PNG.sync.write(dst, {});

      const md5Hash = crypto
        .createHash('md5')
        .update(dst.data)
        .digest('hex');
      const newFilename = './letters/' + md5Hash + '.png';
      if(!fs.existsSync(newFilename)) {
        fs.writeFileSync(newFilename, buffer);
        count++;
      }
      

      // reset
      foundLetter = foundLetterInColumn = false;
      currentLetter = {};
    }
  }
  return count;
}

module.exports = dumpLetters;
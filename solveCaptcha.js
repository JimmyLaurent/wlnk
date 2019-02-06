const { PNG } = require('pngjs');
const crypto = require('crypto');
const letterHashs = {
  '0a05cce8ee444afa26099129c65a2e59': 'C',
  '0a268c9c637606bb80c53da78a6f07f9': 'L',
  '2eb18a8041879d600030fef60e1fe122': 'U',
  '4afb7ed8c7c93ea6fb11e729305f8b3e': 'S',
  '4d5d8ee547486a1ef5337a91ada26271': 'Y',
  '4d735bb5b094cb1c73a6cae22b167c15': 'W',
  '5ac4201302faf68b08c72b5dc2e524e7': 'Z',
  '5fa9572d3403a2f92b007ef5413c8edb': 'V',
  '8cdfb80c53b38586e6b107b2cf47d667': 'D',
  '9b83b02ee8dfe9253225559c88e3a0f9': 'B',
  '80fc3c2c217da774f91c3905daf44327': 'F',
  '83a577ea68e1768ba9c775d507045528': 'J',
  '88ea04989b9e5f341d302974d25fbe45': 'I',
  '95ee8b9394ada4bb2e427027cacdbaba': 'A',
  '375d27f6aedf82391dc45b2cdeab768e': 'G',
  '0746b3877a398c69e6cb20d5e63c4eaf': '3',
  '925add8d18a3adf1bfeb4b217a514810': 'R',
  '939a12b7478ac7a39b44ad53afebedcd': 'T',
  '9287fd529394786187163c90f336276f': 'E',
  '45309b5af6e1a3577646570c04ee2491': '8',
  '51501d41e696c9f150f06ec8a061dcdf': 'X',
  '24025917cd0e3eab66676d04ccb7dcf3': 'K',
  '611844444f7dd822e0df2a7ca4b5c59b': 'P',
  'a61ab095eb228916eab7335212653872': 'N',
  'ab6c6ebc3aa2639c0690e52ee0a9137c': '6',
  'ab6fe97c84dfcb8cf93afb9209bb4c0d': '9',
  'b7888ccf2645d618aa2b0eccd6821967': 'Q',
  'c0a6cda4be72490ab9ec90cbd5652755': '7',
  'd449aed2b7046ef037c1fc505f506f10': '4',
  'd1971857af57606e2c3ba379ddd60d38': 'M',
  'e6ddb367e6d9c78a97696375b9811d76': '5',
  'e7fc64e2efac3a2fd11d2040008af3cc': 'H',
  'e922910f824cf38abfe441911c66d2cf': '1',
  'fd1b96aeb649c8494ce015dfe6a48ec4': '2'
};


function solveCaptcha(data) {
  const png = PNG.sync.read(data);

  // Filter lines
  for (var i = 0; i < png.data.length; i++) {
    if (png.data[i] !== 0 && png.data[i] !== 255) {
      png.data[i] = 255;
    }
  }

  let solution = '';
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

      const letterMd5Hash = crypto
        .createHash('md5')
        .update(dst.data)
        .digest('hex');
      
      solution += letterHashs[letterMd5Hash];

      // reset
      foundLetter = foundLetterInColumn = false;
      currentLetter = {};
    }
  }
  return solution;
}

module.exports = solveCaptcha;
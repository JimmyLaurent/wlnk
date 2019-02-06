var fs = require("fs"),
  PNG = require("pngjs").PNG;

  var data = fs.readFileSync('./pictures/new12.png');
  var png = PNG.sync.read(data);

fs.createReadStream("./pictures/new12.png")
  .pipe(
    new PNG({
      filterType: 4
    })
  )
  .on("parsed", function() {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i] !== 0 && this.data[i] !== 255) {
        this.data[i] = 255;
      }
    }

    var letters = [];

    var currentLetter = {};
    var foundLetter = false;
    for (var x = 0, j = this.width; x < j; ++x) {
      // for every column
      var foundLetterInColumn = false;

      for (var y = 0, k = this.height; y < k; ++y) {
        // for every pixel
        var pixIndex = (y * this.width + x) * 4;
        if (this.data[pixIndex] === 0) {
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
        var height = currentLetter.maxY - currentLetter.minY + 1;
        var width = currentLetter.maxX - currentLetter.minX + 1;
        var dst = new PNG({width, height});
        this.bitblt(dst, currentLetter.minX, currentLetter.minY, width, height, 0, 0);
        dst.pack().pipe(fs.createWriteStream('./pictures/'+letters.length+'.png'));

        // reset
        foundLetter = foundLetterInColumn = false;
        currentLetter = {};
      }
    }

    // for (var y = 0; y < this.height; y++) {
    //     for (var x = 0; x < this.width; x++) {
    //         var idx = (this.width * y + x) << 2;

    //         if(this.data[idx] !== 0 && this.data[idx] !== 255) {
    //           this.data[idx] = 255;
    //         }
    //         if(this.data[idx+1] !== 0 && this.data[idx+1] !== 255) {
    //           this.data[idx+1] = 255;
    //         }
    //         if(this.data[idx+2] !== 0 && this.data[idx+2] !== 255) {
    //           this.data[idx+2] = 255;
    //         }
    //     }
    // }

    this.pack().pipe(fs.createWriteStream("./pictures/out.png"));
  });

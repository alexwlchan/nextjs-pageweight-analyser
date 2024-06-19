const fs = require('fs');
const https = require('https');

// Write text to a file in the `out` directory.
//
// This takes an `options` object with two parameters:
//
//    - `filename` -- the name of the file to write
//    - `contents` -- the text to write to the file
//
function writeToFile(options) {
  let filePath = `out/${options.filename}`;

  fs.mkdir('out', { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating `out` directory:', err);
      process.exit(1);
    }
  });

  fs.writeFile(filePath, options.contents, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      process.exit(1);
    }
  });
}

// Format a number of bytes as a human-readable string.
//
// Example: naturalsize(1234) ~> "1.21 kB"
function naturalSize(byteCount) {
  return `${(byteCount / 1024).toFixed(2)} kB`;
}

// Left-pad a string with spaces for consistent indentation.
function leftPad(str, length) {
  while (str.length < length) {
    str = ' ' + str;
  }

  return str;
}

// Parse command-line arguments.
//
// The script takes one or two arguments:
//
//  * the URL to fetch (required)
//  * a label for the downloaded files (optional)
//
const args = process.argv.slice(2);

let url = '';
let label = '';

if (args.length === 0) {
  console.error("Usage: measure.js URL [LABEL]");
  process.exit(1);
} else if (args.length === 1) {
  url = args[0];
  label = "export";
} else if (args.length === 2) {
  url = args[0];
  label = args[1];
} else {
  console.error("Usage: measure.js URL [LABEL]");
  process.exit(1);
}

// Actually fetch the URL, and save the HTML
//
// Note: I add a custom User-Agent because CloudFront seems to reject fetches that
// come from Node's builtin HTTP library.
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0',
  }
};

https.get(url, options, (res) => {
  let html = '';

  res.on('data', (chunk) => {
    html += chunk;
  });

  // We've got the whole HTML file.  Parse it, and save the results.
  res.on('end', () => {
    let htmlByteCount = Buffer.byteLength(html, 'utf8');
    console.log(`HTML          = ${leftPad(naturalSize(htmlByteCount), 10)}`);

    let nextData = html
        .split('<script id="__NEXT_DATA__" type="application/json">')[1]
        .split("</script>")[0];

    let nextDataByteCount = Buffer.byteLength(nextData, 'utf8');
    console.log(`__NEXT_DATA__ = ${leftPad(naturalSize(nextDataByteCount), 10)} (${(nextDataByteCount / htmlByteCount * 100).toFixed(1)}%)`);

    console.log();

    writeToFile({ filename: `${label}.html`, contents: html });
    console.log(`Saved HTML to out/${label}.html`);

    writeToFile({ filename: `${label}.json`, contents: nextData });
    console.log(`Saved __NEXT_DATA__ to out/${label}.json`);
  });

}).on('error', (err) => {
  console.error('Error fetching the URL: ', err);
  process.exit(1);
});

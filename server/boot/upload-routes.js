const fs = require('fs');

let uploadId = 0;
const uploads = [];

module.exports = function(app) {
  app.post('/api/upload', (req, res) => {
    if (!req.files || !req.files.file) {
      res.status(500);
      res.json({'error': 'Please provide a file'});
    } else {
      const file = req.files.file;

      const filename = 'server/uploads/' + file.name;
      fs.writeFile(filename, file.data, function(err) {
        if (err) {
          return console.log(err);
        }

        // Read file
        const fileContents = fs.readFileSync(filename).toString('utf8').substring(0, 200) + '...';

        // Remove file
        fs.unlinkSync(filename);

        uploads.push({id: ++uploadId, file_name: file.name, content: fileContents});

        res.json(uploads);
      });
    }
  });

  app.get('/api/uploads', (req, res) => {
    res.json(uploads);
  });
};

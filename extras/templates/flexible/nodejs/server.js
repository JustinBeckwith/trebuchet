var express = require('express')
var app = express();
app.get('/', function (req, res) {
  res.send('Hello world!');
});

let server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
  console.log(`Current project is ${process.env.GCLOUD_PROJECT}`);
});
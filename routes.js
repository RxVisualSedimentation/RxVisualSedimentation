module.exports = function (app, express) {
  //ROUTES
  app.use('/ext', express.static(__dirname + '/public/ext'));
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use('/js', express.static(__dirname + '/public/js'));

  app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
  });
};
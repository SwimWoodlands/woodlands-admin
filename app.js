var path = require('path')
var config = require('./config.js')
var express = require('express')
var session = require('express-session')
var fs = require('fs')
var https = require('https')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'secret', resave: 'false', saveUninitialized: 'false'}))

// Initial view - loads Connect To QuickBooks Button
app.get('/', function (req, res) {
  res.render('home', config)
})

// Sign In With Intuit, Connect To QuickBooks, or Get App Now
// These calls will redirect to Intuit's authorization flow
app.use('/sign_in_with_intuit', require('./routes/sign_in_with_intuit.js'))
app.use('/connect_to_quickbooks', require('./routes/connect_to_quickbooks.js'))
app.use('/connect_handler', require('./routes/connect_handler.js'))

// Callback - called via redirect_uri after authorization
app.use('/callback', require('./routes/callback.js'))

// Connected - call OpenID and render connected view
app.use('/connected', require('./routes/connected.js'))

// Call an example API over OAuth2
app.use('/api', require('./routes/admin_api.js'))


// Start server on HTTP (will use ngrok for HTTPS forwarding)

/*
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
*/
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || 'localhost'

console.log('Admin Server Environment variables:')
console.log(process.env)
app.listen(port, ip, function () {
  console.log('Woodlands Admin Server running on http://%s:%s', ip, port)
})
/*

var options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

var server = https.createServer(options, app).listen(443, function(){
  console.log("server started at port 443");
});
*/
// path is a node module used for handling and transforming file paths.
const path = require('path');
// express web app framework let's us structure and handle numerous http requests at specific urls.
const express = require('express');
const app = express();
require('dotenv').config();
// Express JS middleware implementing sign on for Express web apps using OpenID Connect
const { auth, requiresAuth } = require('express-openid-connect');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  redirect our pages
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

// With this basic config, our app requires authentication for all routes and stores the user's identity in an encrypted and signed cookie
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

const port = process.env.JAWSDB_URL || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});
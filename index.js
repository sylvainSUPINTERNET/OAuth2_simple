'use strict';

const express = require('express');
const simpleOauthModule = require('simple-oauth2');
const cookieParser = require('cookie-parser');
const app = express();
const oauth2 = simpleOauthModule.create({
    client: {
        id: 'cb95792c5a4ab7cd297d',
        secret: '2231590ec1c3e514ff67ed28c1efd8f28a4109d3',
    },
    auth: {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
    },
});



app.use(cookieParser());

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'notifications',
    state: '3(#0/!~',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
    const code = req.query.code;
const options = {
    code,
};

oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
        console.error('Access Token Error', error.message);
        return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);
    console.log(result.access_token)
    res.cookie('user_token', result.access_token)
    res.cookie('ACL', result.scope)
    return res
        .status(200)
        .json(token);
    });
});

app.get('/success', (req, res) => {
    res.send('');
});

app.get('/', (req, res) => {
    res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

app.listen(3000, () => {
    console.log('Express server started on port 3000'); // eslint-disable-line
});


// Credits to [@lazybean](https://github.com/lazybean)
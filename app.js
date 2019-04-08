const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const fetch = require('node-fetch');
const upload = multer();
const { just_guide_content } = require('./just_guide_content');

// Create an express application
const app = express();

// Mount the middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', upload.array(), (req, res, next) => {

    const guides = JSON.parse(req.body.guides),
        guides_content = [],
        request_promises = [];

    Object.keys(guides).forEach(guide => {

        const request_promise = fetch(`http://www.nationalarchives.gov.uk/help-with-your-research/research-guides/${guide}/`)
            .then(response => {
                return response.text();
            })
            .then(text => {
                const guide_content = just_guide_content(text);
                guides_content.push(guide_content);
            })
            .catch(error => console.log(error));

        request_promises.push(request_promise);
    });

    // When all fetch() promises are fulfilled
    Promise.all(request_promises)
        .then(() => {
            res.send(guides_content)
        })
});

app.listen(process.env.PORT || 3000, function () {
    console.log('CORS-enabled web server listening on port 80')
});
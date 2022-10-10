const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'b58172beddae4925b565b284608ad97d'
});

const handleApiCall = (req, res) => {
    app.models  // Security review 12:06
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) // this.state.imageUrl cannot work here because of how this.setState works.
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'));
}

const handleImage = (req, res, knex) => { // To update, use put
    const { id } = req.body; 
knex('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);  
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}
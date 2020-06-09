const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'e57de87d170743f5bd0710832bb0bfa4'
});

const handleApiCall = (req, res) => {
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, 
        req.body.input
    )
    .then(data => res.json(data))
    .catch(err => res.status(400).json('couldnt run API'))
}

const handleImageSubmit = (db) => (req, res) => {
    const  { id } = req.body;
    db('users').where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json("this entry got lost"))
}
module.exports = {
    handleImageSubmit,
    handleApiCall
}
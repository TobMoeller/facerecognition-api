const handleSignIn = (req, res, db) => {
    db.select('*').from('login')
    .where('email', req.body.email)
    .then(storedCredentials => {
        const isValid = req.body.password === storedCredentials[0].hash;
        if (isValid) {
            return db.select('*').from('users')
                .where('email', storedCredentials[0].email)
                .then(user => {
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json('failed to get credentials'))
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignIn: handleSignIn
}
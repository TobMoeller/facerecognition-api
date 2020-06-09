const handleSignIn = (req, res, db) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('something is wrong with your entries')
    }
    db.select('*').from('login')
    .where('email', email)
    .then(storedCredentials => {
        const isValid = password === storedCredentials[0].hash;
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
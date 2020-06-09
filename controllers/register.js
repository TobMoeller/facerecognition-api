const handleRegister = (req, res, db) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('something is wrong with your entries')
    }
    db.transaction(trx => {
        trx('login')
        .insert({
            hash: password,
            email: email
        })
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('something went wrong registering'))
    })
}

module.exports = {
    handleRegister: handleRegister
}
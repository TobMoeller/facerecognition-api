const handleProfileGet = (req, res, db) => {
    const  { id } = req.params;
    db.select('*').from('users').where('id', id)
    .then(user => user.length ? res.json(user[0]) : res.status(400).json('this user does not exist'))
    .catch(err => res.status(400).json('error finding the user'))
}
module.exports = {
    handleProfileGet: handleProfileGet
}
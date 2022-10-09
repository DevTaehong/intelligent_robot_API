const handleProfileGet = (req, res, knex) => { // This route will be useful and want to update user's name or email in the future
    const { id } = req.params; // if you have the route /student/:id, then the “id” property is available as req.params.id
    knex.select('*').from('users').where({id}) // .where({id: id}) can be too but with ES6 if it's the same name then just use .where({id})
        .then(user => { 
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found');
            }
        })
}

module.exports = {
    handleProfileGet
}
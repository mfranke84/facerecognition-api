const handleSignIn = (req, res, db, bcrypt)  => {
    const { email, password } = req.body;
    if (!email || !password){
        return res.status(400).json('incorrect form submission');
    }
    
    db.select('email','hash').from('login')
    .where('email',email)
    .then(data => {
        const isValid = data[0].email === email && bcrypt.compareSync(password,data[0].hash);
        if (isValid){
            db.select('*').from('users')
            .where('email',email)
            .then(user => {
                res.send(user[0]);
            })
            .catch(err => res.status(400).json("Unable to get user"))
        }
        else {
            res.status(403).json("Wrong password! Please try with another password!");
        }
    })
    .catch(err => res.status(400).json("User not found! Please try another email!"))
}

module.exports = {
    handleSignIn: handleSignIn
}
const createError = require ("http-errors")
const Users = require ("../models/users")
const bcrypt = require ("bcrypt")
const { v4: uuidv4 } = require('uuid');

exports.register = async function (req, res, next) {

    try 
    {
        const { username, password } = req.body // request from frontend 

        const existingUser = await Users.findOne({ username });

        if (existingUser) {
            return res.status(400).json({message: 'Username already exists.'})
        }

        const hashedPassword = await bcrypt.hash(password, 12) // takes password and hashes the password, encryption 
    
        const newUser = new Users({username, password: hashedPassword}) // creates an instance of the userModel with the request from the frontend
    
        newUser.token = uuidv4() // assigns a token to the user. Token is stored in the variable token.
        await newUser.save() // saves the user information into the database.

        res.status(201).json({ token: newUser.token, message: 'Registration Successful'})
    } catch (error) {
        next(error)
    }
}

exports.login = async function login (req, res, next) {
    try {
        const {username, password} = req.body

        const user = await Users.findOne({username})
        
        if (!user) {
            console.error('The username was not found')
            throw createError(401, 'The username was not found')
        }

        user.token = uuidv4();
        await user.save()
        res.json({token: user.token, message: 'Login successful'})

    }    catch (error){
        next(error)
    }
 
    
}


// const checkPassword = (password) => {


//     const isRight = /^(?=.*[a-zA-Z0-9])(?=.*[\W_]).{8,20}$/g.test(password);
//     return isRight ? true : false 


// };
// module.exports = checkPassword; 


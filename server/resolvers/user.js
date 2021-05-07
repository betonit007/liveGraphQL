//const { authCheck } = require('../helpers/auth')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const profile = async (parent, args, context) => {

    const { req, res } = context
    //const currentUser = await authCheck(req)
    return await User.findOne({ email: currentUser.email })

}

const publicProfile = async (parent, args, { req }) => {
    return await User.findOne({ username: args.username })
}

const allUsers = async (parent, args, { req }) => await User.find({})


const userCreate = async (parent, args, { req }) => {

    console.log('args here', args)
    console.log('req.body', req.body.variables)
    const { username, email, password } = req.body.variables.input
    let user = await User.findOne({ email })

    // if user is in database return user, if not add user to database and then return
    if (user) throw new Error('User already exists')

    const hashedPassword = await bcrypt.hash(password, 10)
    user = await new User({
        email,
        username,
        password: hashedPassword
    })
    .save()

    user.password = null
    
    return {
        token: jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
    }

}

const userUpdate = async (parent, args, { req }) => {

    //args contain the input from

    //const currentUser = await authCheck(req)

    //findOneAndUpdate accepts 3 args: what to search by, the updated info and findally new: true returns updated info
    const updatedUser = await User.findOneAndUpdate({ email: currentUser.email }, { ...args.input }, { new: true })

    return updatedUser

}

const userLogin = async (parent, args, { req }) => {
    
    const user = await User.findOne({ email: args.input.email })
    
    const match = await bcrypt.compare(args.input.password, user.password);

    if (!match) throw new Error('Invalid User Credentials')
    user.password = null
    const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
    
    return { token }
}

module.exports = {
    Query: {
        profile,
        publicProfile,
        allUsers
    },
    Mutation: {
        userCreate,
        userUpdate,
        userLogin
    }
}
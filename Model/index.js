const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const { SECRET_KEY } = require("../config")
const { User, Flight } = require("../schema")
const { validateEmail } = require("../Validator")
const { stringify } = require("querystring")

const generateToken = (user) => (jwt.sign({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob
}, SECRET_KEY, { expiresIn: '1h' }))

module.exports = {
    register: async ({ firstName, lastName, dob, email, password  }) => {
        validateEmail(email)
        const user = await User.findOne({ email })
        if(user){
            throw new Error("User already exists!")
        }
        try{
            password = await bcrypt.hash(password, 12)
            let flightDetails = []
            const newUser = new User({
                firstName,
                lastName,
                dob,
                email,
                password,
                flightDetails
            })

            const res = await newUser.save()
            const token = generateToken(res)

            return {
                id: res._id,
                token
            }
        }
        catch(err){
            throw new Error(err)
        }
    },
    login: async ({ email, password }) => {
        validateEmail(email)
        const user = await User.findOne({email})
        if(!user){
            throw new Error("User not found!")
        }
        const match = await bcrypt.compare(password, user.password)

        if(!match){
            throw new Error("Wrong credentials")
        }
        const token = generateToken(user)

        return {
            id: user._id,
            token
        }
    },
    bookTickets: async ( { email, passengers, flightNo } ) => {
        validateEmail(email)
        const user = await User.findOne({email})
        if(!user){
            throw new Error("User does not exist")
        }
        try{
            const flight = await Flight.findOne({ flightNo })
            console.log("flight.price ---> ", flight)
            let flightDetails = {
                flightNo,
                from: flight.from,
                to: flight.to,
                passengers,
                price: Number(flight.price) * passengers.length
            }
            user.flightDetails.unshift(flightDetails)
            const res = await user.save()
            if(res){
                console.log(passengers);
                let numberOfTickets = passengers.length
                if( numberOfTickets > flight.available){
                    throw new Error(`Sorry! Only ${flight.available} seats only available. Inconvinience caused is thoroughly regreted. `)
                }

                flight.available -= numberOfTickets
                flight.booked += numberOfTickets

                const flightRes = await flight.save()

                return {
                    ...flightRes._doc,
                    ...res._doc
                }
            }   
        }
        catch(err){
            throw new Error(err)
        }
    },
    cancelTickets: async ({email,ticketId,passengerId}) => {
        validateEmail(email)
        const user = await User.findOne({ email })
        if(!user){
            throw new Error("User does not exist!")
        }
        let ticketIndex = user.flightDetails.findIndex(item => String(item._id) === ticketId)
        if(user.flightDetails[ticketIndex].passengers.length === 1){
            user.flightDetails.splice(ticketIndex,1)
        }
        else{
            let index = user.flightDetails[ticketIndex].passengers.findIndex(item => String(item._id) === String(passengerId))
            user.flightDetails[ticketIndex].passengers.splice(index,1)
            const flight = await Flight.findOne(user.flightDetails.flightNo)
            user.flightDetails[ticketIndex].price -= flight.price
        }
        const res = await user.save()
        return{
            ...res._doc
        }
    }
}
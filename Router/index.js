const moment = require("moment")
const express = require("express")
const router = express.Router()

const { register, login, bookTickets, cancelTickets } = require("../Model")

router.post("/register", (req,res,next) => {
    let { firstName, lastName, dob, email, password } = req.body
    dob = moment(new Date(dob)).format("do MMM yyyy")
    register( { firstName, lastName, dob, email, password } ).then(user => {
        if(user){
            res.json({
                data: user
            })
        }
    }).catch(err => next(err))
})

router.post("/login", (req,res,next) => {
    const { email, password } = req.body
    login({ email, password }).then(data => {
        if(data){
            res.json({data})
        }
    }).catch(err => {
        next(err)
    })
})


router.put("/bookTickets/:email/:flightNo",  (req,res,next) => {
    const { email, flightNo } = req.params 
    const { passengers } = req.body
    bookTickets( { email, passengers, flightNo } ).then(data => {
        res.json({
            data
        })
    }).catch(err => next(err)) 
})

router.delete("/cancelTickets/:email/:ticketId/:passengerId",(req,res,next) => {
    const { email, ticketId, passengerId } = req.params
    cancelTickets( { email, ticketId, passengerId } ).then(data => {
        if(data){
            res.json({
                data
            })
        }
    }).catch(err => next(err))
})

module.exports = router
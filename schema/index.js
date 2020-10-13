const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  flightDetails: {
      type: [
          {
              flightNo: {
                  type: Number,
                  unique: true,
                  required: true
              },
              from: {
                  type: String,
                  required: true
              },
              to: {
                  type: String,
                  required: true
              },
              passengers: [
                {
                  firstName: {
                    type: String,
                    required: true
                  },
                  lastName: {
                    type: String,
                    required: true
                  },
                  age: {
                    type: Number,
                    required: true
                  }
                }
              ],
              price: {
                  type: Number,
                  required: true
              }
          }
      ]
  }
});

const flightSchema = new Schema({
  flightNo: {
    type: Number,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  available: {
    type: Number,
    required: true,
  },
  booked: {
    type: Number,
    required: true,
  },
  price:{
    type: Number,
    required: true
  }
});

module.exports = {
  User: model("Users", userSchema),
  Flight: model("Flights", flightSchema),
};

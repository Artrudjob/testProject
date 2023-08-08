const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    date: String,
    name: String,
})

module.exports = {
    groupSchema,
}
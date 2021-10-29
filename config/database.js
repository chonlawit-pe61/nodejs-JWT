const mongoose = require('mongoose');

const { MONGO_URL } = process.env;
exports.connect = () => {
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('Database connected succesfully');
        })
        .catch((error) => {
            console.log("Error connecting to Database");
            console.error(error);
            process.exit(1);
        })
}
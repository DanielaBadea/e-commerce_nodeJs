const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const connect = process.env.MONGODB_CONNECTION;

mongoose.connect(connect)
.then(() => {
    console.log("MongoDB connected successfully!");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch((error) => {
    console.error('Database connection error:', error);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes')

const app = express();
const PORT =5000;

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/events', eventRoutes);
app.use('/api/volunteers', volunteerRoutes);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});

module.exports = app
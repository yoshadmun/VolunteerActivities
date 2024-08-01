require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const createUserProfileRoutes = require('./routes/createUserProfileRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
const volunteerHistoryRoutes = require('./routes/volunteerHistoryRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const findEventsForUserRoutes = require('./routes/findEventsForUserRoutes')
const getAssignedEventsRoutes = require('./routes/getAssignedEventsRoutes')
const getReportRoutes = require('./routes/reportRoutes')

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/events', eventRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/user-profile', createUserProfileRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/notifications', notificationRoutes); 
app.use('/api/volunteerHistory', volunteerHistoryRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/eventsforuser', findEventsForUserRoutes);
app.use('/api/assigned-events',getAssignedEventsRoutes);
app.use('/api/report', getReportRoutes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error)
    })

/*app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/

module.exports = app;

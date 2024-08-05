const express = require('express');
const {
  getVolunteersReport,
  getEventsReport,
  getVolunteersReportCSV,
  getVolunteersReportPDF,
  getEventsReportCSV,
  getEventsReportPDF,
} = require('../controllers/reportController');

const router = express.Router();

//router.get('/volunteers', getVolunteersReport);
//router.get('/events', getEventsReport);
router.get('/volunteers/csv', getVolunteersReportCSV);
router.get('/volunteers/pdf', getVolunteersReportPDF);
router.get('/events/csv', getEventsReportCSV);
router.get('/events/pdf', getEventsReportPDF);
module.exports = router;

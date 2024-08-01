const UserProfile = require('../models/UserProfileModel');
const Event = require('../models/EventModel');
const { Parser } = require('json2csv');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const getVolunteersReport = async (req, res) => {
  try {
    const volunteers = await UserProfile.find().populate('assignedEvents completedEvents');
    res.json(volunteers);
  } catch (error) {
    console.error('Error getting volunteer report: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEventsReport = async (req, res) => {
  try {
    const events = await Event.find().populate('assignedVolunteers');
    res.json(events);
  } catch (error) {
    console.error('Error getting event report: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generateCSV = (data, fields) => {
  const json2csvParser = new Parser({ fields });
  return json2csvParser.parse(data);
};

const generatePDF = async (data, headers, fieldExtractors, reportTitle) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  let page = pdfDoc.addPage([800, 1200]);
  const topPadding = 50;
  const initialY = 1150 - topPadding;
  const cellPadding = 5;
  const fontSize = 11;

  const wrapText = (text, maxWidth, font) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const calculateRowHeight = (row, cellWidths, font) => {
    let maxHeight = 0;
    row.forEach((cell, i) => {
      const lines = wrapText(cell, cellWidths[i] - cellPadding * 2, font);
      const cellHeight = (lines.length * fontSize) + cellPadding * 2;
      if (cellHeight > maxHeight) {
        maxHeight = cellHeight;
      }
    });
    return maxHeight;
  };

  const drawTableRow = (y, row, cellWidths, font) => {
    let x = 50;
    const rowHeight = calculateRowHeight(row, cellWidths, font);
    row.forEach((cell, i) => {
      const lines = wrapText(cell, cellWidths[i] - cellPadding * 2, font);
      const textY = y - cellPadding - fontSize;
      page.drawRectangle({
        x,
        y: y - rowHeight,
        width: cellWidths[i],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      lines.forEach((line, j) => {
        page.drawText(line, {
          x: x + cellPadding,
          y: textY - j * fontSize,
          size: fontSize,
          font: font,
        });
      });
      x += cellWidths[i];
    });
    return rowHeight;
  };

  const getCellWidth = (header) => {
    if (header === 'Name' || header ==='Skills') {
      return 150;
    } else if (header === 'Event Name'){
      return 125;
    } else if (header === 'Location'){
      return 110;
    } else if (header === 'Date') {
      return 65;
    } else if (header === 'Assigned Events' || header === 'Completed Events') {
      return 200;
    } else if (header === 'Description') {
      return 200;
    } else if (header === 'Assigned Volunteers') {
      return 200;
    } else {
      return 150; // Default width
    }
  };

  const drawTable = (data, headers, fieldExtractors) => {
    const cellWidths = headers.map(header => getCellWidth(header));
    let y = initialY;

    // Draw header row
    y -= drawTableRow(y, headers, cellWidths, timesRomanFont);

    // Draw data rows
    data.forEach((item) => {
      const row = fieldExtractors.map(extractor => extractor(item));
      const rowHeight = calculateRowHeight(row, cellWidths, timesRomanFont);

      // Check if a new page is needed
      if (y - rowHeight < 50) {
        page = pdfDoc.addPage([800, 1200]);
        y = initialY;
      }

      y -= drawTableRow(y, row, cellWidths, timesRomanFont);
    });
  };

  const drawReportTitle = (title, font) => {
    page.drawText(title, {
      x: 50,
      y: 1150,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });
  };

  // Draw the report title on the first page
  drawReportTitle(reportTitle, timesRomanFont);

  // Draw the table
  drawTable(data, headers, fieldExtractors);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};


const getVolunteersReportCSV = async (req, res) => {
  try {
    const volunteers = await UserProfile.find().populate('assignedEvents completedEvents');
    const fields = [
      { label: 'Name', value: 'fullName' },
      { label: 'Skills', value: row => row.skills.join(', ') },
      { label: 'Assigned Events', value: row => row.assignedEvents.map(event => event.eventName).join(', ') },
      { label: 'Completed Events', value: row => row.completedEvents.map(event => event.eventName).join(', ') },
    ];
    const csv = generateCSV(volunteers, fields);
    res.header('Content-Type', 'text/csv');
    res.attachment('volunteers_report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating volunteer report CSV:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getVolunteersReportPDF = async (req, res) => {
  try {
    const volunteers = await UserProfile.find().populate('assignedEvents completedEvents');
    const headers = ['Name', 'Skills', 'Assigned Events', 'Completed Events'];
    const fieldExtractors = [
      volunteer => volunteer.fullName,
      volunteer => volunteer.skills.join(', '),
      volunteer => volunteer.assignedEvents.map(event => event.eventName).join(', '),
      volunteer => volunteer.completedEvents.map(event => event.eventName).join(', '),
    ];
    const reportTitlte = 'Volunteer Report';
    const pdfBytes = await generatePDF(volunteers, headers, fieldExtractors, reportTitlte);
    res.header('Content-Type', 'application/pdf');
    res.attachment('volunteers_report.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating volunteer report PDF:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEventsReportCSV = async (req, res) => {
  try {
    const events = await Event.find();
    const volunteers = await UserProfile.find();
    const volunteerMap = new Map(volunteers.map(v => [v.userId, v.fullName]));
    const fields = [
      { label: 'Event Name', value: 'eventName' },
      { label: 'Location', value: row => `${row.location.streetAddress}, ${row.location.city}, ${row.location.state}, ${row.location.zipCode}` },
      { label: 'Description', value: 'eventDescription'},
      { label: 'Date', value: row => row.date ? row.date.toISOString().split('T')[0] : 'N/A' },
      { label: 'Assigned Volunteers', value: row => row.assignedVolunteers.map(id => volunteerMap.get(id) || id).join(', ') },
    ];
    const csv = generateCSV(events, fields);
    res.header('Content-Type', 'text/csv');
    res.attachment('events_report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating event report CSV:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEventsReportPDF = async (req, res) => {
  try {
    const events = await Event.find();
    const volunteers = await UserProfile.find();
    const volunteerMap = new Map(volunteers.map(v => [v.userId, v.fullName]));
    const headers = ['Event Name', 'Location', 'Date', 'Description', 'Assigned Volunteers'];
    const fieldExtractors = [
      event => event.eventName,
      event => `${event.location.streetAddress}, ${event.location.city}, ${event.location.state}, ${event.location.zipCode}`,
      event => event.date ? event.date.toISOString().split('T')[0] : 'N/A',
      event => event.eventDescription.replace(/[\n\r]+/g, ' '), // Sanitize event description
      event => event.assignedVolunteers.map(id => volunteerMap.get(id) || id).join(', '),
    ];
    const reportTitle = 'Event Report';
    const pdfBytes = await generatePDF(events, headers, fieldExtractors, reportTitle);
    res.header('Content-Type', 'application/pdf');
    res.attachment('events_report.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating event report PDF:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getVolunteersReport,
  getEventsReport,
  getVolunteersReportCSV,
  getVolunteersReportPDF,
  getEventsReportCSV,
  getEventsReportPDF,
};

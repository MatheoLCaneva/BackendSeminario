var express = require('express')
var router = express.Router()
var ReportController = require('../controllers/report.controller');
var MailController = require('../controllers/mail.controller');
var Authorization = require('../auth/authorization'); 

// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/test', function (req, res) {
    res.send('Llegaste a la ruta de reportes');
});
router.post('/create', Authorization,ReportController.createReport)
router.get('/',ReportController.getReports)
router.post('/reportsByUser',Authorization, ReportController.getReportByUser)
router.put('/update',Authorization, ReportController.updateReport)
router.put('/like',Authorization, ReportController.likeReport)
router.delete('/', Authorization, ReportController.removeReport)
router.post('/sendMail', MailController.sendEmail)


// Export the Router
module.exports = router;
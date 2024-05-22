var ReportService = require('../services/report.service');
var UserImgService = require('../services/userImg.service');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getReports = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    console.log(page)
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Reports = await ReportService.getReports({}, page, limit)
        console.log(Reports)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, data: Reports, message: "Succesfully Reports Recieved" });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
}
exports.getReportByUser = async function (req, res) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;

    let filtro = req.body
    try {
        var Reports = await ReportService.getReports(filtro, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, data: Reports, message: "Succesfully Class Recieved" });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.createReport = async function (req, res) {
    // Req.Body contains the form submit values.{}
    console.log("llegue al controller", req.body)
    // console.log(typeof(req.headers.profesor))
    var Report = {
        user: req.body.user,
        description: req.body.description,
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdReport = await ReportService.createReport(Report)
        if (createdReport.description) { return res.status(409).json({ status: 409, message: "Report already exist" }) }
        else {
            return res.status(201).json({ status: 201, message: "Succesfully Created Report", report: createdReport })
        }
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({ status: 400, message: "Report Creation was Unsuccesfull" })
    }
}

exports.updateReport = async function (req, res, next) {
    console.log('controller reservas', req.body)
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(400).json({ status: 400., message: "Id be present" })
    }

    var Report = {
        _id: req.body._id,
        estado: req.body.estado,
        valoracion: req.body.valoracion
    }
    try {
        var updatedReport = await ReportService.updateReport(Report)
        return res.status(200).json({ status: 200, data: updatedReport, message: "Succesfully Updated Report" })
    } catch (e) {
        return res.status(400).json({ status: 400., message: e.message })
    }
}

exports.likeReport = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body.reportId) {
        return res.status(400).json({ status: 400., message: "Id must be present" })
    }

    var Report = {_id: req.body.reportId, user: req.body.userId}

    try {
        var updatedReport = await ReportService.likeReport(Report)
        return res.status(200).json({ status: 200, message: "Succesfully Updated Report" })
    } catch (e) {
        return res.status(400).json({ status: 400., message: e.message })
    }
}

exports.removeReport = async function (req, res, next) {

    var id = req.body.reportId;
    console.log(id)
    try {
        var deleted = await ReportService.deleteReport(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }
}

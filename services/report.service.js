// Gettign the Newly created Mongoose Model we just created 
var Report = require('../models/report.model')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getReports = async function (query, page, limit) {
    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query", query)
        var Reports = await Report.paginate(query, options)
        // Return the Userd list that was retured by the mongoose promise
        return Reports;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services", e)
        throw Error('Error while Paginating Reports');
    }
}

exports.createReport = async function (report) {

    console.log(report.description.content)
    const existingReport = await Report.findOne({"description.content": report.description.content});
    console.log(existingReport)
    if (existingReport) {
        error = {
            description: "The report is already created"
        }
        return error
    }
    function getGMTMinus3Date() {
        const now = new Date();
        const offset = -3 * 60; // GMT-3 en minutos
        const gmtMinus3Date = new Date(now.getTime() + offset * 60000);
        return gmtMinus3Date;
    }

    // Crear un nuevo reporte con la información proporcionada
    var newReport = new Report({
        user: report.user,              // Asignar el usuario del reporte
        description: report.description, // Asignar la descripción del reporte
        date: getGMTMinus3Date(),       // Asignar la fecha ajustada a GMT-3
        likes: 0                        // Inicializar el contador de "me gusta" a 0
    });

    try {
        // var savedReport = await newReport.save();
        // return savedReport;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)
        throw Error("Error while Creating Report")
    }
}

exports.updateReport = async function (Reporto) {

    console.log(Reporto._id)
    var _id = { _id: Reporto._id }

    try {
        //Find the old User Object by the Id    
        var oldReport = await Reporto.findOne(_id);
    } catch (e) {
        throw Error("Error occured while Finding the Report")
    }
    // If no old User Object exists return false
    if (!oldReport) {
        return false;
    }

    oldReport.estado = Reporto.estado
    oldReport.valoracion = Reporto.valoracion

    try {
        var savedReport = await oldReport.save()
        return savedReport;
    } catch (e) {
        throw Error("And Error occured while updating the Report");
    }
}

exports.likeReport = async function (report) {

    var _id = { _id: report._id }
    console.log(_id)
    try {
        //Find the old User Object by the Id    
        var oldReport = await Report.findOne(_id);
    } catch (e) {
        throw Error("Error occured while Finding the Report")
    }
    // If no old Report Object exists return false
    if (!oldReport) {
        return false;
    }

    oldReport.likes = oldReport.likes + 1
    oldReport.likesBy.push(report.user)

    try {
        var savedReport = await oldReport.save()
        return savedReport;
    } catch (e) {
        throw Error("And Error occured while updating the Report");
    }
}

exports.finishReport = async function (Reporto) {

    var _id = { _id: Reporto._id }

    try {
        //Find the old User Object by the Id    
        var oldReport = await Reporto.findOne(_id);
    } catch (e) {
        throw Error("Error occured while Finding the Report")
    }
    // If no old User Object exists return false
    if (!oldReport) {
        return false;
    }

    oldReport.estado = Reporto.estado

    try {
        var savedReport = await oldReport.save()
        return savedReport;
    } catch (e) {
        throw Error("And Error occured while updating the Report");
    }
}


exports.deleteReport = async function (id) {

    try {
        var deleted = await Report.deleteOne({
            _id: id
        })
        console.log("Report", deleted)
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Report Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the Report")
    }
}
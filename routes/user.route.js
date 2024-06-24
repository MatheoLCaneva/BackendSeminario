var express = require('express')
var router = express.Router()
var UserController = require('../controllers/users.controller');
var UploadController = require('../controllers/upload.controller');
var MailController = require('../controllers/mail.controller');
var Authorization = require('../auth/authorization');

router.get('/test', function(req, res) {
    res.send('Llegaste a la ruta de users');
  });
router.post('/registration', UserController.createUser)
router.post('/login', UserController.loginUser)
router.get('/',Authorization, UserController.getUsers)
router.post('/userByMail', Authorization, UserController.getUsersByMail)
router.put('/', Authorization, UserController.updateUser)
router.put('/password', Authorization, UserController.updatePassword)
router.delete('/', Authorization, UserController.removeUser)
router.put('/whitelist', Authorization, UserController.updateWhitelist)
router.put('/whitelist/addOne', Authorization, UserController.addToWhitelist)
router.delete('/whitelist', Authorization, UserController.deleteFromWhitelist)
router.post('/sendMail',MailController.sendEmail)

// Export the Router
module.exports = router;





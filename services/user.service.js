// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/User.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query", query)
        var Users = await User.paginate(query, options)
        // Return the Userd list that was retured by the mongoose promise
        return Users;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services", e)
        throw Error('Error while Paginating Users');
    }
}

exports.createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
        return {
            description: "Mail used"
        };
    }

    // Verificar que la contraseña tenga al menos una mayúscula, al menos un número y mínimo 6 caracteres
    const password = user.password;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return {
            description: "Password must have at least one uppercase letter, one number, and be at least 6 characters long"
        };
    }

    var hashedPassword = bcrypt.hashSync(password, 8);

    var newUser = new User({
        name: user.name,
        apellido: user.apellido,
        email: user.email,
        password: hashedPassword,
        whitelist: []
        // imgUser: user.imgUser
    });

    try {
        // Saving the User 
        var savedUser = await newUser.save();
        var token = jwt.sign({
            id: savedUser._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    } catch (e) {
        // return an Error message describing the reason 
        console.log(e);
        throw Error("Error while Creating User");
    }
};

exports.updateUser = async function (user) {

    let _id = { _id: user._id }
    try {
        //Find the old User Object by the Id
        let savedUser = await User.findOneAndUpdate(_id, user, { new: true });
        return savedUser
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
}


exports.updateUserPassword = async function (user) {

    var email = { email: user.email }
    console.log('pase el controller')
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne(email);
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }

    var hashedPassword = bcrypt.hashSync(user.password, 8);
    oldUser.password = hashedPassword


    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (mail) {

    // Delete the User
    console.log("mail mandado", mail)
    try {
        var deleted = await User.deleteOne({
            email: mail
        })
        console.log("Usuario", deleted)
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}


exports.loginUser = async function (user) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        console.log("login:", user)
        var _details = await User.findOne({
            email: user.email
        }).select('+password');

        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) return 0;

        const { password, ...responseUser } = _details._doc
        var token = jwt.sign({
            id: _details._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return { token: token, user: responseUser };
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Login User")
    }

}

exports.addToWhitelist = async function (content) {
    try {
        var userId = content._id;
        var newWhitelist = [];

        var user = await User.findById(userId);
        if (user && user.whitelist) {
            newWhitelist = user.whitelist;
        }

        content.content.forEach(element => {
            if (!newWhitelist.includes(element)) {
                newWhitelist.push(element);
            }
        });

        var whitelist = await User.findOneAndUpdate(
            { _id: userId },
            { whitelist: newWhitelist },
            { new: true }
        );

        return { whitelist: whitelist };
    } catch (e) {
        // return an Error message describing the reason     
        throw Error("Error while updating whitelist");
    }
}

exports.removeFromWhitelist = async function (content) {
    try {
        var userId = content._id;

        var user = await User.findById(userId);

        if (user && user.whitelist.length == 0) {
            return { error: "Whitelist is empty" };
        }

        var contentToRemove = new Set(content.content);
        var newWhitelist = user.whitelist.filter(element => !contentToRemove.has(element));

        var updatedWhitelist = await User.findOneAndUpdate(
            { _id: userId },
            { whitelist: newWhitelist },
            { new: true }
        );

        return { whitelist: updatedWhitelist.whitelist };
    } catch (e) {
        // return an Error message describing the reason     
        throw Error("Error while updating whitelist");
    }
}
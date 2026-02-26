const validator = require('validator');

const validationSignup = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body || {};

    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    // Relaxed strong password options to match a 6-character minimum requirement
    const strongOptions = { minLength: 6, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 };
    if (!validator.isStrongPassword(password, strongOptions)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    next();
};


const validateEditProfile = (req) => {

    const allowFields=[

        "firstName",
        "lastName",
        "email",
        "password",
        "photoUrl",
        "gender",
        "age",
        "about",



    ];

    const updates=Object.keys(req.body);

    const isValidOperation=updates.every((update)=> allowFields.includes(update));

    if(!isValidOperation)
    {
        return false;
    }
    return true;
}

module.exports = { validationSignup, validateEditProfile };
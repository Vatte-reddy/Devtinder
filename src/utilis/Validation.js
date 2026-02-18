const validator = require('validator');

const validationSignup=(req)=>{
   
    const {firstName,lastName,email,password}=req.body;

    if(!firstName || !lastName ){
        throw new Error("All fields are required"); 
    }
   else if(!validator.isEmail(email)){
        throw new Error("Invalid email address");
   }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 6 characters");
    }
}

module.exports={
    validationSignup,
}   
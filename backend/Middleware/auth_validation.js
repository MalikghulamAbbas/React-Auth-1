const joi = require('joi');

const registerValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(5).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(7).required()
    });
    const {error} = schema.validate(req.body);
    if(error) {        
        return res.status(400).json({message:"Bad Request", error: error.details});
    }  
    next();  
}

const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(7).required()
    });
    const {error} = schema.validate(req.body);
    if(error) {        
        return res.status(400).json({message:"Bad Request", error: error.details});
    }  
    next();  
}

const forgotPasswordValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required()
    });
    const {error} = schema.validate(req.body);
    if(error) {        
        return res.status(400).json({message:"Bad Request", error: error.details});
    }  
    next();  
}

const verifyTokenValidation = (req, res, next) => {
    const schema = joi.object({
        token: joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error) {        
        return res.status(400).json({message:"Bad Request", error: error.details});
    }  
    next();  
}

const resetPasswordValidation = (req, res, next) => {
    const schema = joi.object({
        token: joi.string().required(),
        password: joi.string().min(7).required()
    });
    const {error} = schema.validate(req.body);
    if(error) {        
        return res.status(400).json({message:"Bad Request", error: error.details});
    }  
    next();  
}

module.exports = {
    registerValidation, 
    loginValidation,
    forgotPasswordValidation,
    verifyTokenValidation,
    resetPasswordValidation
};
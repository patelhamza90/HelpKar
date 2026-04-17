const Joi = require("joi")

const signUpValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        phone: Joi.required(),
        password: Joi.string().min(4).max(100).required(),
        gender: Joi.string().valid("Male", "Female", "Other").required()
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            msg: "Bad Requiest",
            error
        })
    }
    next();
}

const signInValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),

    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            msg: "Bad Requiest",
            error
        })
    }
    next();
}

const workerSignInValidation = (req, res, next) => {
    const schema = Joi.object({
        workerUID: Joi.string().required(),
        password: Joi.string().min(4).required(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            msg: "Bad Requiest",
            error
        })
    }
    next();

}
const workerProfileValidation = (req, res, next) => {

    const schema = Joi.object({

        workerUID: Joi.string().required(),

        fullName: Joi.string()
            .min(3)
            .max(40)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .min(4)
            .max(50)
            .required(),

        gender: Joi.string()
            .valid("Male", "Female", "Other")
            .required(),

        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required(),

        address: Joi.string()
            .min(5)
            .max(150)
            .required(),

        category: Joi.string()
            .min(3)
            .max(50)
            .required(),

        service: Joi.string()
            .min(3)
            .max(60)
            .required(),

        experience: Joi.number()
            .min(0)
            .max(50)
            .optional(),

        profilePhoto: Joi.string()
            .optional(),

        isActive: Joi.boolean()
            .optional()

    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            msg: "Bad Request",
            error: error.details.map(err => err.message)
        });
    }

    next();
};

const workerSignUpValidation = (req, res, next) => {

    const schema = Joi.object({

        fullName: Joi.string()
            .min(3)
            .max(40)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required(),

        gender: Joi.string()
            .valid("Male", "Female", "Other")
            .required(),

        address: Joi.string()
            .min(5)
            .max(150)
            .required(),

        city: Joi.string()
            .min(3)
            .max(150)
            .required(),

        category: Joi.string()
            .min(3)
            .max(50)
            .required(),

        service: Joi.string()
            .min(3)
            .max(60)
            .required(),

        experience: Joi.number()
            .min(0)
            .max(50)
            .optional()

    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error)
        return res.status(400).json({
            msg: "Bad Request",
            error: error.details[0].message
        });
    }
    
    if (!req.file) {
        return res.status(400).json({
            msg: "Bad Request",
            error: "ID Proof file is required!"
        });
    }
    console.log('object')
    
    next();
};

module.exports = { signUpValidation, signInValidation, workerSignInValidation, workerSignUpValidation, workerProfileValidation }
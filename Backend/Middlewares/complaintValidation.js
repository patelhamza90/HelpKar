const Joi = require("joi");

const complaintValidation = (req, res, next) => {

    const schema = Joi.object({

        complaint: Joi.string()
            .min(5)
            .max(500)
            .required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad Request",
            success: false,
            error: error.details[0].message
        });
    }

    next();
};

module.exports = complaintValidation;
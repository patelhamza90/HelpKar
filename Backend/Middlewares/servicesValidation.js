const Joi = require("joi");

const createServiceValidation = (req, res, next) => {

    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),

        description: Joi.string().min(10).max(500).required(),

        price: Joi.number().min(0).required(),

        radiusKM: Joi.number().min(1).required(),

        category: Joi.string().min(3).max(50).required(),

        icon: Joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }

    next();
};

module.exports = createServiceValidation;
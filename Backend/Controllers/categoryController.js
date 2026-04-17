const addCategory = async (req, res) => {
    try {

        const { category, services } = req.body;

        const result = await serviceCategoryModel.create({
            category,
            services
        });

        res.status(201).json({
            success: true,
            response: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { addCategory };
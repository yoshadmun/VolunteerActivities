const {body, validationResult} = require('express-validator');

const eventValidation = () => [
    body('name').isString().isLength({max:30}).notEmpty(),
    body('description').isString().isLength({max:500}).notEmpty(),
    body('location').custom(value => {
        const zipCodepattern = /^\d{5}(-\d{4})?$/;
        if (
            typeof value.address !== 'string' ||
            typeof value.city !== 'string' ||
            typeof value.state !== 'string' ||
            !zipCodepattern.test(value.zipcode)
        ) {
            throw new Error('Invalid location');
        }
        return true;
    }),
    body('requirements').isArray().notEmpty(),
    body('urgency').isString().notEmpty(),
    body('date').isISO8601().toDate().notEmpty(),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()){
        return next;
    }
    return res.status(400).json({errors: errors.array()});
};

module.exports={
    eventValidation,
    validate,
};
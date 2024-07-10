const {body, validationResult} = require('express-validator');

const eventValidation = () => [
    body('eventName').isString().isLength({ max: 100 }).notEmpty(),
    body('eventDescription').isString().notEmpty(),
    body('location').isObject().notEmpty(),
    body('location.streetAddress').isString().notEmpty(),
    body('location.city').isString().notEmpty(),
    body('location.state').isString().notEmpty(),
    body('location.zipcode').isPostalCode('US').notEmpty(),
    body('requiredSkills').isArray().notEmpty(),
    body('urgency').isString().notEmpty(),
    body('date').isISO8601().notEmpty(),
  ];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()){
        return next();
    }
    return res.status(400).json({errors: errors.array()});
};

module.exports={
    eventValidation,
    validate,
};
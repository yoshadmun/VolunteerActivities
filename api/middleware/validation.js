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

const profileValidation = () => [
      body('fullName').notEmpty().withMessage('Full Name is required'),
      body('location').isObject().notEmpty(),
      body('location.address1').notEmpty().withMessage('Address 1 is required'),
      body('location.city').notEmpty().withMessage('City is required'),
      body('location.state').notEmpty().withMessage('State is required'),
      body('location.zipCode').isLength({ min: 5, max: 5 }).withMessage('Zip Code must be 5 digits'),
      body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
      body('availability').notEmpty().withMessage('Availability is required')
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
    profileValidation,
    validate,
};
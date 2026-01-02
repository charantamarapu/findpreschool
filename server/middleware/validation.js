import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.validated = value;
    next();
  };
};

// Validation schemas
export const schemas = {
  addPreschool: Joi.object({
    name: Joi.string().required(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
    website: Joi.string().uri(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
  }),

  updateAdmissionDetails: Joi.object({
    monthly_fee: Joi.number().min(0),
    annual_fee: Joi.number().min(0),
    registration_fee: Joi.number().min(0),
    hidden_charges_json: Joi.alternatives().try(Joi.object(), Joi.string()),
    age_criteria: Joi.string(),
    academic_year_start: Joi.string(),
  }),

  updateFranchiseDetails: Joi.object({
    franchise_available: Joi.boolean(),
    initial_investment: Joi.number().min(0),
    royalty_percentage: Joi.number().min(0).max(100),
    royalty_type: Joi.string().valid('flat', 'percentage'),
  }),

  submitReview: Joi.object({
    parent_name: Joi.string().required(),
    parent_email: Joi.string().email().required(),
    rating: Joi.number().min(1).max(5).required(),
    facilities_rating: Joi.number().min(1).max(5),
    teachers_rating: Joi.number().min(1).max(5),
    curriculum_rating: Joi.number().min(1).max(5),
    safety_rating: Joi.number().min(1).max(5),
    review_text: Joi.string(),
  }),

  googleMapsFetch: Joi.object({
    location: Joi.string().required(),
    radius: Joi.number().default(10000),
  }),
};

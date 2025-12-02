const Joi = require('joi');

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    role: Joi.string().valid('learner', 'expert').default('learner')
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      message: 'Bad request',
      error
    });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required()
    // ❌ no name here
    // ❌ no role here
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      message: 'Bad request',
      error
    });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation
};

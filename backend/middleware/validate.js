import { body, validationResult } from 'express-validator';

export const validateProject = [
  body('title').trim().notEmpty().isLength({ min: 3 }),
  body('description').trim().notEmpty(),
  body('targetAmount').isNumeric().isFloat({ min: 0 }),
  body('endDate').isISO8601(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 
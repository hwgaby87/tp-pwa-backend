import { validationResult } from 'express-validator';
import ServerError from '../helpers/error.helper.js';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        return next(new ServerError(errorMessages, 400));
    }
    next();
};

export default handleValidationErrors;

const ApiError = require('../utils/ApiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not authorized`));
    }
    next();
  };
};

const requireNgoVerified = (req, res, next) => {
  if (req.user.role === 'ngo' && req.user.ngoVerification?.status !== 'approved') {
    return next(new ApiError(403, 'NGO verification required. Please wait for admin approval.'));
  }
  next();
};

module.exports = { authorize, requireNgoVerified };

const parseFormDataFields = (fields = []) => (req, res, next) => {
  fields.forEach((field) => {
    if (typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        /* keep as string */
      }
    }
  });
  if (req.body.servings) req.body.servings = parseInt(req.body.servings, 10);
  next();
};

module.exports = parseFormDataFields;

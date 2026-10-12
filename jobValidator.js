const { requireFields } = require("../middleware/validationMiddleware");

exports.jobValidator = requireFields(["title", "company", "description", "location", "type", "deadline"]);

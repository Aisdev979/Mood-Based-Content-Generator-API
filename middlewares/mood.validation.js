// Valid Moods
const validMoods = new Set([
  "happy",
  "sad",
  "motivated",
  "calm",
  "anxious",
  "energetic",
  "reflective",
  "tired",
]);

// Validates the mood field in req.body
export const validateMoodBody = (req, res, next) => {
  const { mood } = req.body;

  if (!mood || typeof mood !== "string" || !mood.trim()) {
    return res.status(400).json({
      success: false,
      message: "mood is required.",
    });
  }

  const normalized = mood.trim().toLowerCase();

  if (!validMoods.has(normalized)) {
    return res.status(400).json({
      success: false,
      message: `Invalid mood "${mood}". Valid moods are: ${[...validMoods].join(", ")}.`,
    });
  }

  req.body.mood = normalized;
  next();
};

// Validates an optional date field in req.body.
export const validateMoodDate = (req, res, next) => {
  const { date } = req.body;

  if (!date) return next(); 

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    return res.status(400).json({
      success: false,
      message: "date must be a valid ISO 8601 date string (e.g. 2025-06-01).",
    });
  }

  if (parsed > new Date()) {
    return res.status(400).json({
      success: false,
      message: "date cannot be in the future.",
    });
  }

  next();
};

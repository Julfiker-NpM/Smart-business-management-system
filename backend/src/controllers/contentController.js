const ContentPost = require("../models/ContentPost");

const getContent = async (req, res, next) => {
  try {
    const posts = await ContentPost.find({ owner: req.user.id }).sort({ scheduled_date: 1 });
    return res.json(posts);
  } catch (error) {
    return next(error);
  }
};

const createContent = async (req, res, next) => {
  try {
    const post = await ContentPost.create({ ...req.body, owner: req.user.id });
    return res.status(201).json(post);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getContent, createContent };

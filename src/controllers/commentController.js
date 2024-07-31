const commentService = require("../services/commentService.js");

module.exports = {
  getComment: async (req, res) => {
    const { id, populate } = req.params;

    const comment = await commentService.getCommentById(
      id,
      populate !== "false"
    );

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    res.json(comment);
  },

  getAllComments: async (req, res) => {
    const {
      mobile = "false",
      node,
      populate,
      skip = 0,
      limit = 10,
      ...where
    } = req.query;

    const totalCount = await commentService.getCountComments(where, node, mobile);
    const results = await commentService.getComments(
      where,
      node,
      skip,
      limit,
      mobile,
      populate === "true"
    );

    return res.json({ totalCount, results });
  },

  createComment: async (req, res, next) => {
    const newComment = await commentService.createComment(req.body);

    return res.json(newComment);
  },

  updateComment: async (req, res, next) => {
    const { id } = req.params;
    const updateComment = await commentService.updateCommentById(id, req.body);
    return res.json(updateComment);
  },

  deleteComment: async (req, res, next) => {
    const { id } = req.params;

    const comment = await commentService.deleteCommentById(id);

    res.json(comment);
  },
};

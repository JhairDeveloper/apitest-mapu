const userService = require("../services/userService");

module.exports = {
  getAllUsers: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;

    const results = await userService.getAllUser(where, skip, limit);
    const totalCount = await userService.getCountUser(where);

    return res.json({ totalCount, results });
  },

  getUserById: async (req, res, next) => {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    return res.json(user);
  },

  updateUser: async (req, res) => {
    const { id } = req.params;

    const user = await userService.updateUser(id, req.body);

    return res.json(user);
  },

  createUser: async (req, res) => {
    const user = await userService.createUser(req.body);

    return res.json(user);
  },

  deleteUser: async (req, res) => {
    const deletedUser = await userService.deleteUser(req.params.id);

    return res.json(deletedUser);
  },
};

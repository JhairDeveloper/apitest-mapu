const userService = require("../services/userService");
const reportService = require("../services/reportSevice");

module.exports = {
  getMyProfile: async (req, res) => {
    const id = req.user?._id;

    const user = await userService.getUserById(id);

    return res.json(user);
  },

  getMyReports: async (req, res) => {
    const user = req.user?._id;
    const where = { user, deletedAt: null };

    const results = await reportService.getReports(where);
    const totalCount = await reportService.getCountReports(where);

    return res.json({ totalCount, results });
  },

  updateProfile: async (req, res) => {
    const id = req.user?._id;

    const user = await userService.updateUser(id, req.body);

    return res.json(user);
  },
};

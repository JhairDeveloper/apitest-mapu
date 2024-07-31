const reportService = require("../services/reportSevice");

module.exports = {
  getAllReports: async (req, res) => {
    const { skip = 0, limit = 10, populate = "true", ...where } = req.query;

    const totalCount = await reportService.getCountReports(where);
    const results = await reportService.getReports(
      where,
      skip,
      limit,
      populate === "true"
    );

    return res.json({ totalCount, results });
  },

  getReportById: async (req, res, next) => {
    const { id } = req.params;

    const report = await reportService.getReportById(id);

    res.json(report);
  },

  createReport: async (req, res, next) => {
    req.body.user = req.user?.id;
    const report = await reportService.createReport(req.body);

    return res.json(report);
  },

  updateReport: async (req, res, next) => {
    const { id } = req.params;

    const report = await reportService.updateReportById(id, req.body);

    res.json(report);
  },
};

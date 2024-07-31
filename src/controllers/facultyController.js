const facultyService = require("../services/facultyService.js");

module.exports = {
  getAllFaculties: async (req, res) => {
    const { skip = 0, limit, ...where } = req.query;

    const totalCount = await facultyService.getCountFaculties(where);
    const results = await facultyService.getFaculties(
      where,
      skip,
      limit || totalCount
    );

    return res.json({ totalCount, results, limit });
  },

  getFacultyById: async (req, res, next) => {
    const { id } = req.params;

    const faculty = await facultyService.getFacultyById(id);

    if (!faculty) {
      return res.status(404).json({ message: "Facultad no encontrada" });
    }

    res.json(faculty);
  },

  createFaculty: async (req, res, next) => {
    const newFaculty = await facultyService.createFaculty(req.body);

    return res.json(newFaculty);
  },

  updateFaculty: async (req, res, next) => {
    const { id } = req.params;

    const faculty = await facultyService.updateFacultyById(id, req.body);

    res.json(faculty);
  },

  deleteFacultyById: async (req, res, next) => {
    const { id } = req.params;

    await facultyService.deleteFacultyById(id);

    res.json({ message: "Eliminación exitosa" });
  },
};

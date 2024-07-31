const sectorService = require("../services/sectorService.js");

module.exports = {
  getAllSectors: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;

    const totalCount = await sectorService.getCountSectors(where);
    const results = await sectorService.getSectors(where, skip, limit);

    return res.json({ totalCount, results });
  },

  getSectorById: async (req, res, next) => {
    const { id } = req.params;

    const sector = sectorService.getSectorById(id);

    if (!sector) {
      return res.status(404).json({ message: "Sector no encontrado" });
    }

    res.json(sector);
  },

  createSector: async (req, res, next) => {
    const newSector = await sectorService.createSector(req.body);

    return res.json(newSector);
  },

  updateSector: async (req, res, next) => {
    const { id } = req.params;

    const sector = await sectorService.updateSectorById(id, req.body);

    res.json(sector);
  },

  deleteSectorById: async (req, res, next) => {
    const { id } = req.params;

    await sectorService.deleteSectorById(id);

    res.json({ message: "Eliminación exitosa" });
  },
};

const suscriptionService = require("../services/suscriptionService");

module.exports = {
  createSuscription: async (req, res) => {
    req.body.userId = req.user.id;
    const newSuscription = await suscriptionService.createSuscription(req.body);
    return res.json({ newSuscription });
  },

  getAllSuscriptions: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;
    const suscriptions = await suscriptionService.getAllSuscriptions(
      where,
      skip,
      limit
    );
    const totalSuscriptions = await suscriptionService.getCountSuscriptions(
      where
    );
    return res.json({ totalSuscriptions, suscriptions });
  },
  getUserSuscriptions: async (req, res) => {
    let { skip = 0, limit = 10, ...where } = req.query;
    where = { userId: req.user.id };
    const suscriptions = await suscriptionService.getAllSuscriptions(
      where,
      skip,
      limit
    );
    const totalSuscriptions = await suscriptionService.getCountSuscriptions(
      where
    );
    return res.json({ totalSuscriptions, suscriptions });
  },

  getAnyUserSuscriptions: async (req, res) => {
    let { skip = 0, limit = 10, ...where } = req.query;
    where = { userId: req.params.id };
    const suscriptions = await suscriptionService.getAllSuscriptions(
      where,
      skip,
      limit
    );
    const totalSuscriptions = await suscriptionService.getCountSuscriptions(
      where
    );
    return res.json({ totalSuscriptions, suscriptions });
  },

  getSuscriptionById: async (req, res) => {
    const { id } = req.params;
    const suscription = await suscriptionService.getSuscriptionById(id);
    return res.json(suscription);
  },

  updateSuscription: async (req, res) => {
    const { id } = req.params;
    const updatedSuscription = await suscriptionService.updateSuscription(
      id,
      req.body,
      req.user.id
    );
    return res.json(updatedSuscription);
  },

  deleteSuscription: async (req, res) => {
    const { id } = req.params;
    const deletedSuscription = await suscriptionService.deleteSuscription(
      id,
      req.user.email
    );
    return res.json({ deletedSuscription });
  },
};

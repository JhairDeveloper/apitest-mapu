const roleService = require("../services/roleServices");

module.exports = {
  createRole: async (req, res) => {
    const newRole = await roleService.createRole(req.body);

    res.status(201).json(newRole);
  },

  getRoleById: async (req, res) => {
    let role = await roleService.getRoleById(req.params.id);

    res.json(role);
  },

  getAllRoles: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;

    const totalCount = await roleService.getCountRoles(where);
    const results = await roleService.getAllRoles(where, skip, limit);

    return res.json({ totalCount, results });
  },

  updateRole: async (req, res) => {
    const { id } = req.params;

    const role = await roleService.updateRole(id, req.body);

    res.json(role);
  },

  deleteRole: async (req, res) => {
    let deletedRole = await roleService.deleteRole(req.params.id);

    res.status(200).json({ message: "Rol eliminado exitosamente" });
  },
};

const userService = require("../services/userService");
const campusService = require("../services/campusService");
const facultyService = require("../services/facultyService");
const blockService = require("../services/blockService");
const careerService = require("../services/careerService");
const categoryService = require("../services/categoryService");
const sectorService = require("../services/sectorService");
const eventService = require("../services/eventService");
const accessNodeService = require("../services/accessNodeService");
const routeNodeService = require("../services/routeNodeService");
const interestingNodeService = require("../services/interestingNodeService");
const { getStartOfMonth } = require("../helpers");

module.exports = {
  getCounts: async (req, res) => {
    const sinceDate = getStartOfMonth(1);

    const totalUserLastMonth = await userService.getCountUser({
      deletedAt: null,
      createdAt: { $gte: sinceDate },
    });
    const totalUser = await userService.getCountUser({ deletedAt: null });
    const totalCampus = await campusService.getCountCampuses({
      deletedAt: null,
    });
    const totalFaculty = await facultyService.getCountFaculties({
      deletedAt: null,
    });
    const totalBlock = await blockService.getCountBlocks({ deletedAt: null });
    const totalCareer = await careerService.getCountCareers({
      deletedAt: null,
    });
    const totalCategory = await categoryService.getCountCategories({
      deletedAt: null,
    });
    const totalSector = await sectorService.getCountSectors({
      deletedAt: null,
    });
    const totalEvents = await eventService.getCountEvents({
      deletedAt: null,
    });
    const totalRouteNodes = await routeNodeService.getCountRouteNodes({
      deletedAt: null,
    });
    const totalInterestingNodes =
      await interestingNodeService.getCountInterestingNodes({
        deletedAt: null,
      });
    const totalAccessNodes = await accessNodeService.getCountAccessNodes({
      deletedAt: null,
    });

    res.json({
      totalUser,
      totalUserLastMonth,
      totalCampus,
      totalFaculty,
      totalBlock,
      totalCareer,
      totalCategory,
      totalSector,
      totalEvents,
      totalInterestingNodes,
      totalAccessNodes,
      totalRouteNodes,
    });
  },
};

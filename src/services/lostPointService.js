const LostPoint = require("../models/LostPoint");

const findOrCreateLostPoint = async (lostPointData) => {
  const { latitude, longitude } = lostPointData;

  const lostPoint = await LostPoint.findOneAndUpdate(
    { latitude, longitude },
    lostPointData,
    { upsert: true, new: true }
  );

  return lostPoint;
};

module.exports = { findOrCreateLostPoint };

const Event = require("../models/Event");
const Detail = require("../models/Detail");
const FieldExistingError = require("../errors/FieldExistingError");
const NotExist = require("../errors/NotExist");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");

const populateDetail = async (event = {}) => {
  if (event.node) {
    event.node.detail = await Detail.findOne({ _id: event.node.detail });
  }
};

const createEvent = async (eventData) => {
  const existingEvent = await Event.findOne({ name: eventData.name });
  if (existingEvent) throw new FieldExistingError("El evento ya existe", 400);
  if (eventData.untilDate < eventData.sinceDate)
    throw new ValidationError(
      "La fecha de inicio del evento debe ser antes de la fecha de termino"
    );
  const event = await Event.create(eventData);

  return event;
};

const getEvents = async (
  mobile,
  search,
  where = {},
  skip,
  limit,
  populate = false
) => {
  await applyRegex(mobile, search, where);
  const events = populate
    ? await Event.find(where).skip(skip).limit(limit).populate("node").lean()
    : await Event.find(where).skip(skip).limit(limit).lean();

  if (populate) {
    await Promise.all(events.map(populateDetail));
  }

  return events;
};

const applyRegex = async (mobile, search, where) => {
  if (mobile === "true") {
    where.untilDate = { $gte: new Date() };
  }

  if (search && typeof search === "string") {
    where.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
};

const getEventById = async (_id, populate = false) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");
  const event = populate
    ? await Event.findOne({ _id }).populate("node").lean()
    : await Event.findOne({ _id }).lean();

  if (!event) throw new NotExist("El evento no se encontro");

  if (populate) await populateDetail(event);

  return event;
};

const getCountEvents = async (mobile, search, where = {}) => {
  await applyRegex(mobile, search, where);
  return await Event.count(where);
};

const updateEventById = async (_id, eventData) => {
  let existingEvent = await getEventById(_id);
  if (!existingEvent) throw new NotExist("El evento no se encontro");

  if (eventData.name) {
    const existingName = await Event.findOne({
      name: eventData.name,
      _id: { $ne: _id },
    });

    if (existingName)
      throw new ValidationError(`El evento ${eventData.name} ya existe`);
  }

  const sinceDate = eventData.sinceDate ?? existingEvent.sinceDate;
  const untilDate = eventData.untilDate ?? existingEvent.untilDate;
  if (untilDate < sinceDate)
    throw new ValidationError(
      "La fecha de inicio del evento debe ser antes de la fecha de término"
    );

  if (eventData.name) {
    const existingEvent = await Event.findOne({ name: eventData.name });
  }

  existingEvent = await Event.updateOne({ _id }, eventData);

  return existingEvent;
};

const deleteEventById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");
  const deletedEvent = await Event.findByIdAndRemove(_id);
  if (!deletedEvent) throw new NotExist("El evento no existe");

  return deletedEvent;
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getCountEvents,
  updateEventById,
  deleteEventById,
};

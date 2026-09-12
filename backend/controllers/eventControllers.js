import Event from "../models/eventModel.js";
import TryCatch from "../utils/TryCatch.js";

const requireAlumni = (req, res) => {
  if (req.user?.role !== "alumni") {
    res.status(403).json({
      message: "Only alumni can manage events"
    });
    return false;
  }
  return true;
};

export const createEvent = TryCatch(async (req, res) => {
  if (!requireAlumni(req, res)) return;

  const { title, description, date, location, registrationLink } = req.body;
  const event = await Event.create({
    title,
    description,
    date,
    location,
    registrationLink,
    owner: req.user._id
  });

  await event.populate("owner", "name avatar role batch");
  res.status(201).json({ message: "Event created", event });
});

export const getAllEvents = TryCatch(async (req, res) => {
  const events = await Event.find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .populate("owner", "name avatar role batch")
    .lean();
  res.json(events);
});

export const updateEvent = TryCatch(async (req, res) => {
  if (!requireAlumni(req, res)) return;

  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (event.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only edit your own events" });
  }

  const { title, description, date, location, registrationLink } = req.body;
  Object.assign(event, { title, description, date, location, registrationLink });
  await event.save();
  await event.populate("owner", "name avatar role batch");
  res.json({ message: "Event updated", event });
});

export const deleteEvent = TryCatch(async (req, res) => {
  if (!requireAlumni(req, res)) return;

  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (event.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only delete your own events" });
  }

  await event.deleteOne();
  res.json({ message: "Event deleted" });
});

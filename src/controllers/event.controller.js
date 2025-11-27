import database from "../database/db.js";
import eventRepo from "../repository/event.js";
import ApiError from "../utils/ApiError.js";

class EventController {
  async initializeEvent(req, res, next) {
    try {
      if (!req.body) {
        throw ApiError.badRequest("Missing request body");
      }

      const { name, availableTickets } = req.body;

      console.log(req.body);

      if (!name || availableTickets === undefined) {
        throw ApiError.badRequest("Missing event name or availableTickets");
      }

      if (typeof availableTickets !== "number" || availableTickets < 0) {
        throw ApiError.badRequest(
          "availableTickets must be a non-negative number",
        );
      }

      const event = await eventRepo.createEvent(name, availableTickets);

      return res.status(201).json({
        message: "event created successfully",
        data: event,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getEventStatus(req, res, next) {
    try {
      const { eventId } = req.params;
      if (!eventId) throw ApiError.badRequest("Missing eventId parameter");

      const status = await eventRepo.getEventById(eventId);
      if (!status) throw ApiError.notFound("Event not found");
      return res.status(200).json({
        data: status,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new EventController();

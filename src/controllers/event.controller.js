import database from "../database/db.js";
import eventRepo from "../repository/event.js";

class EventController {
  async initializeEvent(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          statusCode: 400,
          message: "missing request body",
        });
      }

      const { name, availableTickets } = req.body;

      if (!name || !availableTickets) {
        return res.status(400).json({
          message: "missing event name or availableTickets",
        });
      }

      if (typeof availableTickets === "string") {
        return res.status(400).json({
          message: "availableTickets must be a number",
        });
      }

      const event = await eventRepo.createEvent(name, availableTickets);

      return res.status(201).json({
        message: "event created successfully",
        data: event,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getEventStatus(req, res) {
    try {
      const { eventId } = req.params;
      if (!eventId)
        return res.status(400).json({
          message: "missing eventId parameter",
        });

      const status = await eventRepo.getEventById(eventId);
      return res.status(200).json({
        data: status,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  }
}

export default new EventController();

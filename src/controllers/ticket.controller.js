import ticketRepo from "../repository/ticket.js";
import ApiError from "../utils/ApiError.js";

class TicketController {
  /**
   * BOOK A TICKET OR JOIN WAITLIST
   */
  async bookTicket(req, res, next) {
    try {
      if (!req.body) {
        throw ApiError.badRequest("Missing request body");
      }

      const { eventId, fullName } = req.body;

      if (!eventId || !fullName) {
        throw ApiError.badRequest("eventId and fullName are required");
      }

      const result = await ticketRepo.createTicket(eventId, fullName);

      return res.status(201).json({
        message:
          result.status === "booked"
            ? "Ticket successfully booked"
            : "Added to waitlist",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * CANCEL A TICKET AND PROMOTE NEXT WAITLIST USER
   */
  async cancelTicket(req, res, next) {
    try {
      const { ticketId } = req.body;

      if (!ticketId) {
        throw ApiError.badRequest("ticketId is required");
      }

      const result = await ticketRepo.cancelTicket(ticketId);

      return res.status(200).json({
        message: "Ticket cancelled",
        promoted: result.promoted,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new TicketController();

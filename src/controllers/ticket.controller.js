import ticketRepo from "../repository/ticket.js";

class TicketController {
  /**
   * BOOK A TICKET OR JOIN WAITLIST
   */
  async bookTicket(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          message: "missing request body",
        });
      }

      const { eventId, fullName } = req.body;

      if (!eventId || !fullName) {
        return res.status(400).json({
          error: "eventId and fullName are required",
        });
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
      console.error("Error booking ticket:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  /**
   * CANCEL A TICKET AND PROMOTE NEXT WAITLIST USER
   */
  async cancelTicket(req, res) {
    try {
      const { ticketId } = req.body;

      if (!ticketId) {
        return res.status(400).json({
          error: "ticketId is required",
        });
      }

      const result = await ticketRepo.cancelTicket(ticketId);

      return res.status(200).json({
        message: "Ticket cancelled",
        cancelled: result.cancelled,
        promoted: result.promoted,
      });
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}

export default new TicketController();

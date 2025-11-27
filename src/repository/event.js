import database from "../database/db.js";

class EventRepository {
  constructor() {
    this.db = database.getConnection().getRepository("events");
  }

  async createEvent(name, totalTickets) {
    return await this.db.save({
      name,
      totalTickets,
      availableTickets: totalTickets,
    });
  }

  async getEventById(eventId) {
    try {
      // Fetch event
      const event = await this.db.findOne({
        where: { id: eventId },
        relations: ["tickets", "waitlist"],
      });

      if (!event) {
        return null;
      }

      const totalTicketsSold = event.tickets?.length || 0;
      const totalWaitlist = event.waitlist?.length || 0;

      return {
        id: event.id,
        name: event.name,
        availableTickets: event.availableTickets,
        ticketsSold: totalTicketsSold,
        waitlistCount: totalWaitlist,
      };
    } catch (error) {
      console.error("Error fetching event status:", error);
      throw error;
    }
  }
}

export default new EventRepository();

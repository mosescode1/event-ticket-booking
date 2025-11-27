import database from "../database/db.js";

class TicketRepository {
  constructor() {
    this.dataSource = database.getConnection();
    this.eventRepo = this.dataSource.getRepository("events");
    this.ticketRepo = this.dataSource.getRepository("tickets");
    this.waitlistRepo = this.dataSource.getRepository("waitlist");
  }

  /**
   * BOOK TICKET OR JOIN WAITLIST
   */
  async createTicket(eventId, fullName) {
    return await this.dataSource.manager.transaction(async (trx) => {
      const event = await trx.findOne("events", {
        where: { id: eventId },
        relations: ["tickets", "waitlist"],
      });

      if (!event) throw new Error("Event not found");

      if (event.availableTickets > 0) {
        event.availableTickets -= 1;
        await trx.save("events", event);

        const ticket = await trx.save("tickets", {
          fullName,
          event,
          status: "active",
        });

        return { status: "booked", ticket };
      }

      // Otherwise add to waitlist
      const wait = await trx.save("waitlist", { fullName, event });
      return { status: "waitlisted", wait };
    });
  }

  /**
   * CANCEL A TICKET AND PROMOTE FROM WAITLIST
   */
  async cancelTicket(ticketId) {
    try {
      await this.dataSource.manager.transaction(async (trx) => {
        const ticket = await trx.findOne("tickets", {
          where: { id: ticketId },
          relations: ["event"],
        });

        if (!ticket || ticket.status === "cancelled")
          throw new Error("Ticket not found or already cancelled");

        ticket.status = "cancelled";
        await trx.save("tickets", ticket);

        const event = ticket.event;
        event.availableTickets += 1;
        event.ticketSold -= 1;
        await trx.save("events", event);

        // Promote next waitlist user
        const next = await trx.findOne("waitlist", {
          where: { event: { id: event.id } },
          order: { id: "ASC" },
        });
        if (next) {
          await trx.save("tickets", {
            fullName: next.fullName,
            event,
            status: "active",
          });
          await trx.delete("waitlist", { id: next.id });
          event.availableTickets -= 1;
          await trx.save("events", event);

          return { cancelled: ticket, promoted: next.fullName };
        }

        return { cancelled: ticket, promoted: null };
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new TicketRepository();

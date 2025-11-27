import typeorm from "typeorm";

const EventSchema = new typeorm.EntitySchema({
  name: "events",
  tableName: "events",

  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
    },
    totalTickets: {
      type: "int",
    },
    availableTickets: {
      type: "int",
    },
  },

  relations: {
    tickets: {
      type: "one-to-many",
      target: "tickets",
      inverseSide: "event",
    },
    waitlist: {
      type: "one-to-many",
      target: "waitlist",
      inverseSide: "event",
    },
  },
});

export default EventSchema;

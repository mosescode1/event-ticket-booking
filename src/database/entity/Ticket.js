import typeorm from "typeorm";

const TicketSchema = new typeorm.EntitySchema({
  name: "tickets",
  tableName: "tickets",

  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    fullName: {
      type: "varchar",
      length: 255,
    },
    status: {
      type: "varchar",
      default: "booked",
    },
  },

  relations: {
    event: {
      type: "many-to-one",
      target: "events",
      joinColumn: {
        name: "event_id",
      },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default TicketSchema;

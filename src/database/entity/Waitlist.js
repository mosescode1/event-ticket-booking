import typeorm from "typeorm";

const WaitlistSchema = new typeorm.EntitySchema({
  name: "waitlist",
  tableName: "waitlist",

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
  },

  relations: {
    event: {
      type: "many-to-one",
      target: "events",
      joinColumn: { name: "event_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default WaitlistSchema;

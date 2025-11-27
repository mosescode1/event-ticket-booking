import typeorm from "typeorm";

const UserSchema = new typeorm.EntitySchema({
  name: "User",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    userName: {
      type: "varchar",
      length: 255,
    },
    role: {
      type: "varchar",
      length: 255,
    },
    password: {
      type: "varchar",
      length: 255,
    },
  },
});

export default UserSchema;

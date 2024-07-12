import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "sequelize";
import { Connection } from "../database/connection.js";
import { Record } from "./Record.js";
import bcrypt from "bcryptjs";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: "id" }>
> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    tableName: "users",
    sequelize: Connection,
  }
);

User.beforeCreate(async (user) => {
  const uuid = crypto.randomUUID();
  const salt = await bcrypt.genSalt(10);
  const date = new Date();
  user.password = await bcrypt.hash(user.password, salt);
  user.id = uuid;
  user.created_at = date;
  user.updated_at = date;
});

User.beforeUpdate(async (user) => {
  const updated_at = new Date();
  user.updated_at = updated_at;
});

Record.belongsTo(User);

User.hasMany(Record, {
  sourceKey: "id",
  foreignKey: "user_id",
  as: "records",
  onDelete: 'CASCADE'
});

(async () => {
  try {
    const result = await Connection.query(
      "SELECT 1 FROM information_schema.tables WHERE table_schema='daily_diary' AND table_name='users'"
    );

    if (result[0].length) console.log("The 'users' table already exists");
    else {
      await User.sync();
    }
  } catch (err) {
    console.error("Error checking/creating table: ", err);
  }
})();

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Model,
} from "sequelize";
import { Connection } from "../database/connection.js";
import { User } from "./User.js";

export class Record extends Model<
  InferAttributes<Record>,
  InferCreationAttributes<Record, { omit: "id" }>
> {
  declare id: CreationOptional<number>;
  declare body: string;
  declare userId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Record.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: Connection,
    tableName: "records",
  }
);

User.hasMany(Record, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "records",
});

try {
  const result = await Connection.query(
    "SELECT 1 FROM information_schema.tables WHERE table_schema='daily_diary' AND table_name='records'"
  );

  if (result[0].length) console.log("The 'records' table already exists");
  else {
    await Record.sync();
  }
} catch (err) {
  console.error("Error checking/creating table: ", err);
}

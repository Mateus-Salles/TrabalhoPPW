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
  declare user_id: ForeignKey<User["id"]>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize: Connection,
    tableName: "records",
  }
);

Record.beforeCreate((record) => {
  const date = new Date();
  record.created_at = date;
  record.updated_at = date;
});

Record.beforeUpdate((record) => {
  record.updated_at = new Date();
});


(async () => {
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
})();

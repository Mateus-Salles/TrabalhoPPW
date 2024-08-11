import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { User } from "./User";
import { Connection } from "../database/connection";

export class ResetPassword extends Model<
  InferAttributes<ResetPassword>,
  InferCreationAttributes<ResetPassword, { omit: "id" }>
> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User["id"]>;
  declare token: string;
  declare expires_in: CreationOptional<Date>;
}

ResetPassword.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expires_in: DataTypes.DATE,
  },
  {
    sequelize: Connection,
    tableName: "password_resets",
  }
);

ResetPassword.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

ResetPassword.beforeCreate((resetPass: ResetPassword) => {
  resetPass.expires_in = new Date(Date.now() + 60 * 60 * 1000);
});

(async () => {
  try {
    const result = await Connection.query(
      "SELECT 1 FROM information_schema.tables WHERE table_schema='daily_diary' AND table_name='reset_password'"
    );

    if (result[0].length)
      console.log("The 'reset_password' table already exists");
    else {
      await ResetPassword.sync();
    }
  } catch (err) {
    console.error("Error checking/creating table: ", err);
  }
})();

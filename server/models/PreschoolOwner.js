import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PreschoolOwner = sequelize.define(
  'PreschoolOwner',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    preschool_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Removed unique constraint to reduce key count
    },
    owner_name: DataTypes.STRING(255),
    owner_email: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    owner_phone: DataTypes.STRING(20),
    verified_owner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_token: DataTypes.STRING(255),
  },
  {
    tableName: 'preschool_owners',
    timestamps: true,
    underscored: true,
  }
);

export default PreschoolOwner;

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Preschool = sequelize.define(
  'Preschool',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: DataTypes.STRING(500),
    city: DataTypes.STRING(100),
    state: DataTypes.STRING(100),
    pincode: DataTypes.STRING(10),
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8),
    phone: DataTypes.STRING(20),
    email: DataTypes.STRING(255),
    website: DataTypes.STRING(255),
    google_place_id: {
      type: DataTypes.STRING(255),
      // Removed unique constraint to reduce key count
    },
    google_map_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    verified_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    established_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'preschools',
    timestamps: true,
    underscored: true,
  }
);

export default Preschool;

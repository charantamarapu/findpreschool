import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FranchiseDetail = sequelize.define(
  'FranchiseDetail',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    preschool_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    franchise_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    initial_investment: DataTypes.DECIMAL(12, 2),
    royalty_percentage: DataTypes.DECIMAL(5, 2),
    royalty_type: {
      type: DataTypes.ENUM('flat', 'percentage'),
      defaultValue: 'percentage',
    },
    franchise_terms_json: DataTypes.JSON,
    support_provided_json: DataTypes.JSON,
  },
  {
    tableName: 'franchise_details',
    timestamps: true,
    underscored: true,
  }
);

export default FranchiseDetail;

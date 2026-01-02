import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ComparisonHistory = sequelize.define(
  'ComparisonHistory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_ip: DataTypes.STRING(45),
    compared_preschool_ids: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    comparison_type: {
      type: DataTypes.ENUM('admission', 'franchise', 'both'),
      defaultValue: 'admission',
    },
  },
  {
    tableName: 'comparison_history',
    timestamps: true,
    underscored: true,
  }
);

export default ComparisonHistory;

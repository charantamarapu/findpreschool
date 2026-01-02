import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AdmissionDetail = sequelize.define(
  'AdmissionDetail',
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
    monthly_fee: DataTypes.DECIMAL(10, 2),
    annual_fee: DataTypes.DECIMAL(10, 2),
    registration_fee: DataTypes.DECIMAL(10, 2),
    hidden_charges_json: DataTypes.JSON,
    age_criteria: DataTypes.STRING(255),
    academic_year_start: DataTypes.STRING(50),
    verified_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'admission_details',
    timestamps: true,
    underscored: true,
  }
);

export default AdmissionDetail;

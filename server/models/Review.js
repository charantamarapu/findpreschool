import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    preschool_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_name: DataTypes.STRING(255),
    parent_email: DataTypes.STRING(255),
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
    facilities_rating: DataTypes.DECIMAL(3, 2),
    teachers_rating: DataTypes.DECIMAL(3, 2),
    curriculum_rating: DataTypes.DECIMAL(3, 2),
    safety_rating: DataTypes.DECIMAL(3, 2),
    review_text: DataTypes.TEXT,
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    photo_urls: DataTypes.JSON,
  },
  {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
  }
);

export default Review;

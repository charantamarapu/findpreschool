import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PreSchoolImage = sequelize.define(
  'PreSchoolImage',
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
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'preschool_images',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

export default PreSchoolImage;

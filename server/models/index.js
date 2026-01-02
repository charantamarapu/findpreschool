import Preschool from './Preschool.js';
import PreschoolImage from './PreschoolImage.js';
import AdmissionDetail from './AdmissionDetail.js';
import FranchiseDetail from './FranchiseDetail.js';
import ComparisonHistory from './ComparisonHistory.js';
import Review from './Review.js';
import AdminUser from './AdminUser.js';
import PreschoolOwner from './PreschoolOwner.js';

// Define associations
Preschool.hasMany(PreschoolImage, { foreignKey: 'preschool_id', as: 'images' });
PreschoolImage.belongsTo(Preschool, { foreignKey: 'preschool_id' });

Preschool.hasOne(AdmissionDetail, { foreignKey: 'preschool_id', as: 'admission' });
AdmissionDetail.belongsTo(Preschool, { foreignKey: 'preschool_id' });

Preschool.hasOne(FranchiseDetail, { foreignKey: 'preschool_id', as: 'franchise' });
FranchiseDetail.belongsTo(Preschool, { foreignKey: 'preschool_id' });

Preschool.hasMany(Review, { foreignKey: 'preschool_id', as: 'reviews' });
Review.belongsTo(Preschool, { foreignKey: 'preschool_id' });

Preschool.hasOne(PreschoolOwner, { foreignKey: 'preschool_id', as: 'owner' });
PreschoolOwner.belongsTo(Preschool, { foreignKey: 'preschool_id' });

export {
  Preschool,
  PreschoolImage,
  AdmissionDetail,
  FranchiseDetail,
  ComparisonHistory,
  Review,
  AdminUser,
  PreschoolOwner,
};

import PreSchool from './PreSchool.js';
import PreSchoolImage from './PreSchoolImage.js';
import AdmissionDetail from './AdmissionDetail.js';
import FranchiseDetail from './FranchiseDetail.js';
import ComparisonHistory from './ComparisonHistory.js';
import Review from './Review.js';
import AdminUser from './AdminUser.js';
import PreSchoolOwner from './PreSchoolOwner.js';

// Define associations
PreSchool.hasMany(PreSchoolImage, { foreignKey: 'preschool_id', as: 'images' });
PreSchoolImage.belongsTo(PreSchool, { foreignKey: 'preschool_id' });

PreSchool.hasOne(AdmissionDetail, { foreignKey: 'preschool_id', as: 'admission' });
AdmissionDetail.belongsTo(PreSchool, { foreignKey: 'preschool_id' });

PreSchool.hasOne(FranchiseDetail, { foreignKey: 'preschool_id', as: 'franchise' });
FranchiseDetail.belongsTo(PreSchool, { foreignKey: 'preschool_id' });

PreSchool.hasMany(Review, { foreignKey: 'preschool_id', as: 'reviews' });
Review.belongsTo(PreSchool, { foreignKey: 'preschool_id', as: 'preschool' });

PreSchool.hasOne(PreSchoolOwner, { foreignKey: 'preschool_id', as: 'owner' });
PreSchoolOwner.belongsTo(PreSchool, { foreignKey: 'preschool_id' });

export {
  PreSchool,
  PreSchoolImage,
  AdmissionDetail,
  FranchiseDetail,
  ComparisonHistory,
  Review,
  AdminUser,
  PreSchoolOwner,
};

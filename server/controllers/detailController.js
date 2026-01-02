import {
  AdmissionDetail,
  FranchiseDetail,
  Preschool,
} from '../models/index.js';

export const updateAdmissionDetails = async (req, res) => {
  try {
    const { preschool_id } = req.params;
    const {
      monthly_fee_min,
      monthly_fee_max,
      annual_fee_min,
      annual_fee_max,
      registration_fee,
      hidden_charges_json,
      age_criteria,
      academic_year_start,
    } = req.validated;

    const admission = await AdmissionDetail.findOne({
      where: { preschool_id },
    });

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission details not found',
      });
    }

    await admission.update({
      monthly_fee_min,
      monthly_fee_max,
      annual_fee_min,
      annual_fee_max,
      registration_fee,
      hidden_charges_json,
      age_criteria,
      academic_year_start,
    });

    return res.status(200).json({
      success: true,
      data: admission,
      message: 'Admission details updated',
    });
  } catch (error) {
    console.error('Error updating admission details:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating admission details',
      error: error.message,
    });
  }
};

export const updateFranchiseDetails = async (req, res) => {
  try {
    const { preschool_id } = req.params;
    const {
      franchise_available,
      initial_investment,
      royalty_percentage,
      royalty_type,
    } = req.validated;

    const franchise = await FranchiseDetail.findOne({
      where: { preschool_id },
    });

    if (!franchise) {
      return res.status(404).json({
        success: false,
        message: 'Franchise details not found',
      });
    }

    await franchise.update({
      franchise_available,
      initial_investment,
      royalty_percentage,
      royalty_type,
    });

    return res.status(200).json({
      success: true,
      data: franchise,
      message: 'Franchise details updated',
    });
  } catch (error) {
    console.error('Error updating franchise details:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating franchise details',
      error: error.message,
    });
  }
};

export const getFranchiseOpportunities = async (req, res) => {
  try {
    const { minInvestment, maxInvestment, city, limit = 20, offset = 0 } =
      req.query;

    const where = { franchise_available: true };

    if (minInvestment || maxInvestment) {
      where.initial_investment = {};
      if (minInvestment) {
        where.initial_investment[Op.gte] = parseFloat(minInvestment);
      }
      if (maxInvestment) {
        where.initial_investment[Op.lte] = parseFloat(maxInvestment);
      }
    }

    let franchises = await FranchiseDetail.findAndCountAll({
      where,
      include: [
        {
          association: 'Preschool',
          attributes: ['id', 'name', 'city', 'phone', 'email'],
          where: city ? { city } : undefined,
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: franchises.rows,
      pagination: {
        total: franchises.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching franchise opportunities:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching franchise opportunities',
      error: error.message,
    });
  }
};

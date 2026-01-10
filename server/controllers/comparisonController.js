import {
  PreSchool,
  AdmissionDetail,
  FranchiseDetail,
  ComparisonHistory,
} from '../models/index.js';
import { Op } from 'sequelize';

export const compareAdmission = async (req, res) => {
  try {
    const { preschool_ids } = req.body;

    if (!preschool_ids || preschool_ids.length < 2 || preschool_ids.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Please select 2-4 preschools to compare',
      });
    }

    const preschools = await PreSchool.findAll({
      where: {
        id: {
          [Op.in]: preschool_ids,
        },
      },
      include: [
        {
          association: 'admission',
          attributes: [
            'monthly_fee_min',
            'monthly_fee_max',
            'annual_fee_min',
            'annual_fee_max',
            'registration_fee',
            'hidden_charges_json',
            'age_criteria',
            'academic_year_start',
            'verified_rating',
            'total_reviews',
          ],
        },
      ],
      attributes: ['id', 'name', 'city', 'phone', 'email', 'website'],
    });

    if (preschools.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PreSchools not found',
      });
    }

    // Calculate total cost of ownership
    const comparisonData = preschools.map((p) => {
      const monthlyFeeAvg = p.admission?.monthly_fee_min && p.admission?.monthly_fee_max
        ? (p.admission.monthly_fee_min + p.admission.monthly_fee_max) / 2
        : (p.admission?.monthly_fee_min || p.admission?.monthly_fee_max || 0);
      const annualFeeAvg = p.admission?.annual_fee_min && p.admission?.annual_fee_max
        ? (p.admission.annual_fee_min + p.admission.annual_fee_max) / 2
        : (p.admission?.annual_fee_min || p.admission?.annual_fee_max || 0);
      return {
        id: p.id,
        name: p.name,
        city: p.city,
        phone: p.phone,
        email: p.email,
        website: p.website,
        admission: {
          monthly_fee_min: p.admission?.monthly_fee_min || 0,
          monthly_fee_max: p.admission?.monthly_fee_max || 0,
          annual_fee_min: p.admission?.annual_fee_min || 0,
          annual_fee_max: p.admission?.annual_fee_max || 0,
          registration_fee: p.admission?.registration_fee || 0,
          hidden_charges: p.admission?.hidden_charges_json || {},
          age_criteria: p.admission?.age_criteria,
          academic_year_start: p.admission?.academic_year_start,
          verified_rating: p.admission?.verified_rating || 0,
          total_reviews: p.admission?.total_reviews || 0,
        },
        totalAnnualCost: monthlyFeeAvg * 12 + annualFeeAvg + (p.admission?.registration_fee || 0),
      };
    });

    // Sort by best value (lowest total cost)
    comparisonData.sort((a, b) => a.totalAnnualCost - b.totalAnnualCost);

    // Record comparison in history
    const userIp =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await ComparisonHistory.create({
      user_ip: userIp,
      compared_preschool_ids: JSON.stringify(preschool_ids),
      comparison_type: 'admission',
    });

    return res.status(200).json({
      success: true,
      data: comparisonData,
    });
  } catch (error) {
    console.error('Error comparing admission:', error);
    return res.status(500).json({
      success: false,
      message: 'Error comparing preschools',
      error: error.message,
    });
  }
};

export const compareFranchise = async (req, res) => {
  try {
    const { preschool_ids } = req.body;

    if (!preschool_ids || preschool_ids.length < 2 || preschool_ids.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Please select 2-4 preschools to compare',
      });
    }

    const preschools = await PreSchool.findAll({
      where: {
        id: {
          [Op.in]: preschool_ids,
        },
      },
      include: [
        {
          association: 'franchise',
          attributes: [
            'franchise_available',
            'initial_investment',
            'royalty_percentage',
            'royalty_type',
            'franchise_terms_json',
            'support_provided_json',
          ],
        },
      ],
      attributes: ['id', 'name', 'city'],
    });

    const franchiseData = preschools
      .map((p) => ({
        id: p.id,
        name: p.name,
        city: p.city,
        franchise_available: p.franchise?.franchise_available || false,
        initial_investment: p.franchise?.initial_investment || 0,
        royalty_percentage: p.franchise?.royalty_percentage || 0,
        royalty_type: p.franchise?.royalty_type || 'percentage',
        franchise_terms: p.franchise?.franchise_terms_json || {},
        support_provided: p.franchise?.support_provided_json || {},
      }))
      .filter((p) => p.franchise_available);

    // Record comparison in history
    const userIp =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await ComparisonHistory.create({
      user_ip: userIp,
      compared_preschool_ids: JSON.stringify(preschool_ids),
      comparison_type: 'franchise',
    });

    return res.status(200).json({
      success: true,
      data: franchiseData,
    });
  } catch (error) {
    console.error('Error comparing franchise:', error);
    return res.status(500).json({
      success: false,
      message: 'Error comparing franchise',
      error: error.message,
    });
  }
};

export const getComparisonHistory = async (req, res) => {
  try {
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const history = await ComparisonHistory.findAll({
      where: { user_ip: userIp },
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching comparison history:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message,
    });
  }
};

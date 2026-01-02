import {
  Preschool,
  PreschoolImage,
  AdmissionDetail,
  FranchiseDetail,
  Review,
} from '../models/index.js';
import { Op } from 'sequelize';

export const getAllPreschools = async (req, res) => {
  try {
    const {
      city,
      minFee,
      maxFee,
      minRating,
      limit = 20,
      offset = 0,
    } = req.query;

    const where = {};
    if (city) where.city = city;

    // Build include for admission with optional filtering so the database does the heavy lifting
    const admissionWhere = {};
    if (minFee) admissionWhere.monthly_fee = { ...(admissionWhere.monthly_fee || {}), [Op.gte]: parseFloat(minFee) };
    if (maxFee) admissionWhere.monthly_fee = { ...(admissionWhere.monthly_fee || {}), [Op.lte]: parseFloat(maxFee) };
    if (minRating) admissionWhere.verified_rating = { [Op.gte]: parseFloat(minRating) };

    const include = [
      { association: 'images', attributes: ['image_url', 'is_primary'] },
      {
        association: 'admission',
        attributes: [
          'monthly_fee',
          'annual_fee',
          'verified_rating',
          'total_reviews',
        ],
        ...(Object.keys(admissionWhere).length ? { where: admissionWhere, required: true } : {}),
      },
    ];

    const preschools = await Preschool.findAndCountAll({
      where,
      include,
      distinct: true,
      col: 'id',
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: preschools.rows,
      pagination: {
        total: preschools.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching preschools:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching preschools',
      error: error.message,
    });
  }
};

export const getPreschoolById = async (req, res) => {
  try {
    const { id } = req.params;

    const preschool = await Preschool.findByPk(id, {
      include: [
        { association: 'images', attributes: ['id', 'image_url', 'is_primary'] },
        { association: 'admission' },
        { association: 'franchise' },
        {
          association: 'reviews',
          attributes: [
            'id',
            'parent_name',
            'rating',
            'facilities_rating',
            'teachers_rating',
            'curriculum_rating',
            'safety_rating',
            'review_text',
            'created_at',
          ],
          where: { verified: true },
          required: false,
        },
        { association: 'owner', attributes: ['verified_owner'] },
      ],
    });

    if (!preschool) {
      return res.status(404).json({
        success: false,
        message: 'Preschool not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: preschool,
    });
  } catch (error) {
    console.error('Error fetching preschool:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching preschool',
      error: error.message,
    });
  }
};

export const addPreschool = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website,
      latitude,
      longitude,
      google_place_id,
    } = req.validated;

    // Check if already exists
    if (google_place_id) {
      const existing = await Preschool.findOne({
        where: { google_place_id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Preschool already exists',
        });
      }
    }

    const preschool = await Preschool.create({
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website,
      latitude,
      longitude,
      google_place_id,
      verified_status: false,
    });

    // Create empty admission and franchise details
    await AdmissionDetail.create({ preschool_id: preschool.id });
    await FranchiseDetail.create({ preschool_id: preschool.id });

    return res.status(201).json({
      success: true,
      data: preschool,
      message: 'Preschool added successfully',
    });
  } catch (error) {
    console.error('Error adding preschool:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding preschool',
      error: error.message,
    });
  }
};

export const updatePreschool = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, state, pincode, phone, email, website } =
      req.validated;

    const preschool = await Preschool.findByPk(id);
    if (!preschool) {
      return res.status(404).json({
        success: false,
        message: 'Preschool not found',
      });
    }

    await preschool.update({
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website,
    });

    return res.status(200).json({
      success: true,
      data: preschool,
      message: 'Preschool updated successfully',
    });
  } catch (error) {
    console.error('Error updating preschool:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating preschool',
    });
  }
};

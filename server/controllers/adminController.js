import AdminUser from '../models/AdminUser.js';
import Preschool from '../models/Preschool.js';
import PreschoolImage from '../models/PreschoolImage.js';
import AdmissionDetail from '../models/AdmissionDetail.js';
import FranchiseDetail from '../models/FranchiseDetail.js';
import ComparisonHistory from '../models/ComparisonHistory.js';
import Review from '../models/Review.js';
import PreschoolOwner from '../models/PreschoolOwner.js';
import jwt from 'jsonwebtoken';

// Admin Authentication
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({ where: { email, active: true } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [preschoolCount, reviewCount, comparisonCount, adminCount] = await Promise.all([
      Preschool.count(),
      Review.count(),
      ComparisonHistory.count(),
      AdminUser.count()
    ]);

    res.json({
      stats: {
        preschools: preschoolCount,
        reviews: reviewCount,
        comparisons: comparisonCount,
        admins: adminCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Preschools CRUD
export const getPreschools = async (req, res) => {
  try {
    const { page = 1, limit = 10, city, verified } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (city) where.city = city;
    if (verified !== undefined) where.verified = verified === 'true';

    const preschools = await Preschool.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        { model: AdmissionDetail, as: 'admission' },
        { model: FranchiseDetail, as: 'franchise' },
        { model: PreschoolImage, as: 'images' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      preschools: preschools.rows,
      total: preschools.count,
      page: parseInt(page),
      totalPages: Math.ceil(preschools.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPreschool = async (req, res) => {
  try {
    const preschool = await Preschool.create(req.body);
    res.status(201).json(preschool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePreschool = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Preschool.update(req.body, { where: { id } });
    if (updated) {
      const preschool = await Preschool.findByPk(id);
      res.json(preschool);
    } else {
      res.status(404).json({ error: 'Preschool not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePreschool = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Preschool.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Preschool deleted successfully' });
    } else {
      res.status(404).json({ error: 'Preschool not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reviews CRUD
export const getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, preschool_id, verified } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (preschool_id) where.preschool_id = preschool_id;
    if (verified !== undefined) where.verified = verified === 'true';

    const reviews = await Review.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [{ model: Preschool, as: 'preschool' }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      reviews: reviews.rows,
      total: reviews.count,
      page: parseInt(page),
      totalPages: Math.ceil(reviews.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Review.update(req.body, { where: { id } });
    if (updated) {
      const review = await Review.findByPk(id);
      res.json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Users CRUD
export const getAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']]
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const admin = await AdminUser.create(req.body);
    const { password_hash, ...adminData } = admin.toJSON();
    res.status(201).json(adminData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await AdminUser.update(req.body, { where: { id } });
    if (updated) {
      const admin = await AdminUser.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
      });
      res.json(admin);
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AdminUser.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Admin deleted successfully' });
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk Operations
export const bulkVerifyPreschools = async (req, res) => {
  try {
    const { ids } = req.body;
    const [updated] = await Preschool.update(
      { verified: true },
      { where: { id: ids } }
    );
    res.json({ message: `${updated} preschools verified successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkVerifyReviews = async (req, res) => {
  try {
    const { ids } = req.body;
    const [updated] = await Review.update(
      { verified: true },
      { where: { id: ids } }
    );
    res.json({ message: `${updated} reviews verified successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkDelete = async (req, res) => {
  try {
    const { model, ids } = req.body;
    let deletedCount = 0;

    switch (model) {
      case 'preschools':
        deletedCount = await Preschool.destroy({ where: { id: ids } });
        break;
      case 'reviews':
        deletedCount = await Review.destroy({ where: { id: ids } });
        break;
      case 'comparisons':
        deletedCount = await ComparisonHistory.destroy({ where: { id: ids } });
        break;
      default:
        return res.status(400).json({ error: 'Invalid model' });
    }

    res.json({ message: `${deletedCount} ${model} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admission Details Management
export const createAdmissionDetail = async (req, res) => {
  try {
    const { preschool_id, monthly_fee_min, monthly_fee_max, annual_fee_min, annual_fee_max, verified_rating } = req.body;
    
    // Check if admission detail already exists
    let admission = await AdmissionDetail.findOne({ where: { preschool_id } });
    
    if (admission) {
      // Update existing
      await admission.update({
        monthly_fee_min: monthly_fee_min !== undefined ? monthly_fee_min : admission.monthly_fee_min,
        monthly_fee_max: monthly_fee_max !== undefined ? monthly_fee_max : admission.monthly_fee_max,
        annual_fee_min: annual_fee_min !== undefined ? annual_fee_min : admission.annual_fee_min,
        annual_fee_max: annual_fee_max !== undefined ? annual_fee_max : admission.annual_fee_max,
        verified_rating: verified_rating !== undefined ? verified_rating : admission.verified_rating,
      });
      res.json(admission);
    } else {
      // Create new
      admission = await AdmissionDetail.create({
        preschool_id,
        monthly_fee_min,
        monthly_fee_max,
        annual_fee_min,
        annual_fee_max,
        verified_rating: verified_rating || 0,
      });
      res.status(201).json(admission);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Image Management
export const createPreschoolImage = async (req, res) => {
  try {
    const { preschool_id, image_url, is_primary } = req.body;
    
    if (is_primary) {
      // Unset primary for other images
      await PreschoolImage.update(
        { is_primary: false },
        { where: { preschool_id } }
      );
    }
    
    const image = await PreschoolImage.create({
      preschool_id,
      image_url,
      is_primary: is_primary || false,
    });
    
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePreschoolImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_primary } = req.body;
    
    const image = await PreschoolImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    if (is_primary) {
      // Unset primary for other images
      await PreschoolImage.update(
        { is_primary: false },
        { where: { preschool_id: image.preschool_id } }
      );
    }
    
    await image.update({ is_primary });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePreschoolImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PreschoolImage.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
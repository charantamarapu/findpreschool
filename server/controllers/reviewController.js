import { Review, Preschool, AdmissionDetail } from '../models/index.js';

export const getReviews = async (req, res) => {
  try {
    const { preschool_id, limit = 10, offset = 0 } = req.query;

    const where = { verified: true };
    if (preschool_id) {
      where.preschool_id = preschool_id;
    }

    const reviews = await Review.findAndCountAll({
      where,
      attributes: [
        'id',
        'parent_name',
        'rating',
        'facilities_rating',
        'teachers_rating',
        'curriculum_rating',
        'safety_rating',
        'review_text',
        'photo_urls',
        'created_at',
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      success: true,
      data: reviews.rows,
      pagination: {
        total: reviews.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { preschool_id } = req.params;
    const {
      parent_name,
      parent_email,
      rating,
      facilities_rating,
      teachers_rating,
      curriculum_rating,
      safety_rating,
      review_text,
    } = req.validated;

    // Verify preschool exists
    const preschool = await Preschool.findByPk(preschool_id);
    if (!preschool) {
      return res.status(404).json({
        success: false,
        message: 'Preschool not found',
      });
    }

    // Create review (unverified initially)
    const review = await Review.create({
      preschool_id,
      parent_name,
      parent_email,
      rating,
      facilities_rating,
      teachers_rating,
      curriculum_rating,
      safety_rating,
      review_text,
      verified: false,
    });

    return res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted. It will be verified before publishing.',
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message,
    });
  }
};

export const verifyReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await Review.findByPk(review_id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.update({ verified: true });

    // Update preschool's admission rating
    const reviews = await Review.findAll({
      where: { preschool_id: review.preschool_id, verified: true },
      attributes: ['rating'],
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length;
    const totalReviews = reviews.length;

    await AdmissionDetail.update(
      { verified_rating: avgRating, total_reviews: totalReviews },
      { where: { preschool_id: review.preschool_id } }
    );

    return res.status(200).json({
      success: true,
      data: review,
      message: 'Review verified',
    });
  } catch (error) {
    console.error('Error verifying review:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying review',
      error: error.message,
    });
  }
};

export const rejectReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await Review.findByPk(review_id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.destroy();

    return res.status(200).json({
      success: true,
      message: 'Review rejected and deleted',
    });
  } catch (error) {
    console.error('Error rejecting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Error rejecting review',
      error: error.message,
    });
  }
};

export const getPendingReviews = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const reviews = await Review.findAndCountAll({
      where: { verified: false },
      include: [
        {
          association: 'Preschool',
          attributes: ['id', 'name', 'city'],
        },
      ],
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      success: true,
      data: reviews.rows,
      pagination: {
        total: reviews.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching pending reviews',
      error: error.message,
    });
  }
};

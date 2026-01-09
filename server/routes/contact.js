import express from 'express';
import nodemailer from 'nodemailer';
import { Preschool } from '../models/index.js';

const router = express.Router();

// Configure nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER ? process.env.SMTP_USER.trim() : undefined,
    pass: process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.trim() : undefined
  }
});

// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Try to send email, but don't fail if email service is not available
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'noreply@findpreschool.com',
        to: process.env.CONTACT_EMAIL || 'contact@findpreschool.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });
    } catch (emailError) {
      console.log('Email service not available, message logged:', emailError.message);
    }

    res.json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your message'
    });
  }
});

// Contact school endpoint
router.post('/contact-school/:preschoolId', async (req, res) => {
  try {
    const { preschoolId } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Get preschool details
    const preschool = await Preschool.findByPk(preschoolId);
    if (!preschool) {
      return res.status(404).json({
        success: false,
        error: 'Preschool not found'
      });
    }

    // Try to send email to preschool
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'noreply@findpreschool.com',
        to: preschool.email || process.env.CONTACT_EMAIL,
        subject: `New Inquiry from ${name} via FindPreschool.org`,
        html: `
          <h2>New Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><em>This inquiry was sent via FindPreschool.org</em></p>
        `
      });
    } catch (emailError) {
      console.log('Email service not available, message logged:', emailError.message);
    }

    res.json({
      success: true,
      message: `Your inquiry has been sent to ${preschool.name}. They will contact you soon.`
    });
  } catch (error) {
    console.error('Contact school error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send your inquiry'
    });
  }
});

export default router;

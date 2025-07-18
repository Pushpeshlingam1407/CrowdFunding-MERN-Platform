import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/auth.middleware.js';
import Document from '../models/Document.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 9 * 1024 * 1024 }, // 9MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF and image files are allowed!');
    }
  }
});

// @route   POST /api/documents/upload
// @desc    Upload a new document
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    const { projectName, location, documentType } = req.body;
    const userType = req.user.role === 'individual' || req.user.role === 'institutional' || req.user.role === 'angel' ? 'investor' : 'creator';

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = await Document.create({
      user: req.user._id,
      projectName,
      location,
      documentType,
      filePath: req.file.path,
      userType
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Error uploading document' });
  }
});

// @route   GET /api/documents
// @desc    Get user's documents
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id })
      .sort('-createdAt');
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// @route   GET /api/documents/admin
// @desc    Get all documents (admin only)
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// @route   PUT /api/documents/:id/verify
// @desc    Verify or reject a document (admin only)
// @access  Private/Admin
router.put('/:id/verify', protect, admin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.status = status;
    document.verifiedAt = status === 'verified' ? new Date() : undefined;
    document.verifiedBy = status === 'verified' ? req.user._id : undefined;
    document.rejectionReason = rejectionReason;

    await document.save();
    res.json(document);
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ message: 'Error verifying document' });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only allow admin or document owner to delete
    if (document.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await document.remove();
    res.json({ message: 'Document removed' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

export default router; 
import asyncHandler from 'express-async-handler';
import Document from '../models/documentModel.js';

// @desc    Upload a new document
// @route   POST /api/documents
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
  const { title, fileUrl, fileType } = req.body;

  if (!title || !fileUrl || !fileType) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const document = await Document.create({
    user: req.user._id,
    title,
    fileUrl,
    fileType,
  });

  if (document) {
    res.status(201).json(document);
  } else {
    res.status(400);
    throw new Error('Invalid document data');
  }
});

// @desc    Get user documents
// @route   GET /api/documents
// @access  Private
const getUserDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.user._id });
  res.json(documents);
});

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id).populate('user', 'name email');

  if (document) {
    res.json(document);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    if (document.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to delete this document');
    }

    await document.deleteOne();
    res.json({ message: 'Document removed' });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc    Update document status (admin only)
// @route   PUT /api/documents/:id/status
// @access  Private/Admin
const updateDocumentStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;

  const document = await Document.findById(req.params.id);

  if (document) {
    document.status = status || document.status;
    document.remarks = remarks || document.remarks;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

export {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  updateDocumentStatus,
};
import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { uploadSingle, handleUploadError } from '../middleware/upload.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { UploadDocumentSchema, UpdateDocumentStatusSchema, GetDocumentsQuerySchema } from '../schemas/document.schemas';
import { z } from 'zod';

const router = Router();
const documentController = new DocumentController();

// Parameter validation schema
const DocumentIdSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required')
});

// POST /documents - Upload a document
router.post(
  '/',
  uploadSingle,
  handleUploadError,
  validateBody(UploadDocumentSchema),
  documentController.uploadDocument.bind(documentController)
);

// GET /documents - Get documents with optional filters
router.get(
  '/',
  validateQuery(GetDocumentsQuerySchema),
  documentController.getDocuments.bind(documentController)
);

// GET /documents/:documentId - Get specific document
router.get(
  '/:documentId',
  validateParams(DocumentIdSchema),
  documentController.getDocumentById.bind(documentController)
);

// PUT /documents/:documentId/status - Update document status (for officials)
router.put(
  '/:documentId/status',
  validateParams(DocumentIdSchema),
  validateBody(UpdateDocumentStatusSchema),
  documentController.updateDocumentStatus.bind(documentController)
);

// GET /documents/:documentId/download - Get download URL
router.get(
  '/:documentId/download',
  validateParams(DocumentIdSchema),
  documentController.downloadDocument.bind(documentController)
);

// DELETE /documents/:documentId - Delete document
router.delete(
  '/:documentId',
  validateParams(DocumentIdSchema),
  documentController.deleteDocument.bind(documentController)
);

export default router;

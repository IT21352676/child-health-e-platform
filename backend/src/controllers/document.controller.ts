import { Request, Response, NextFunction } from 'express';
import { DocumentService } from '../services/document.service';
import { UploadDocumentSchema, UpdateDocumentStatusSchema, GetDocumentsQuerySchema } from '../schemas/document.schemas';

export class DocumentController {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
        return;
      }

      const validatedData = UploadDocumentSchema.parse(req.body);
      const userId = req.user?.userId || req.body.user_id; // Assuming auth middleware sets req.user

      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'User authentication required'
        });
        return;
      }

      const document = await this.documentService.uploadDocument(
        req.file,
        validatedData,
        userId
      );

      res.status(201).json({
        status: 'success',
        message: 'Document uploaded successfully',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = GetDocumentsQuerySchema.parse(req.query);
      const documents = await this.documentService.getDocumentsByQuery(validatedQuery);

      res.status(200).json({
        status: 'success',
        data: documents
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { documentId } = req.params;
      const document = await this.documentService.getDocumentById(documentId);

      if (!document) {
        res.status(404).json({
          status: 'error',
          message: 'Document not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDocumentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { documentId } = req.params;
      const validatedData = UpdateDocumentStatusSchema.parse(req.body);
      const officialId = req.user?.officialId || req.body.official_id;

      if (!officialId) {
        res.status(401).json({
          status: 'error',
          message: 'Official authentication required'
        });
        return;
      }

      const document = await this.documentService.updateDocumentStatus(
        documentId,
        validatedData,
        officialId
      );

      res.status(200).json({
        status: 'success',
        message: 'Document status updated successfully',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { documentId } = req.params;
      const document = await this.documentService.getDocumentById(documentId);

      if (!document) {
        res.status(404).json({
          status: 'error',
          message: 'Document not found'
        });
        return;
      }

      const downloadUrl = await this.documentService.getDocumentDownloadUrl(document.file_path);

      res.status(200).json({
        status: 'success',
        data: {
          download_url: downloadUrl,
          file_name: document.file_name
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { documentId } = req.params;
      await this.documentService.deleteDocument(documentId);

      res.status(200).json({
        status: 'success',
        message: 'Document deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

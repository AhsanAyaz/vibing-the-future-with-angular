import { Injectable } from '@angular/core';

/**
 * IndexedDB Service for Document Persistence
 *
 * Provides persistent storage for documents across browser sessions.
 * Uses IndexedDB for efficient storage of large documents with metadata.
 */
@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private readonly DB_NAME = 'smart-doc-analyzer';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'documents';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  /**
   * Initialize IndexedDB database
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });

          // Create indexes for efficient querying
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });

          console.log('Object store created successfully');
        }
      };
    });
  }

  /**
   * Ensure database is ready before operations
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  /**
   * Save a document to IndexedDB
   * Note: The id parameter is optional and will be auto-generated if not provided
   */
  async saveDocument(document: Omit<Document, 'id'> & { id?: number }): Promise<number> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      // Only include id if it's a valid number
      const docToSave: any = {
        name: document.name,
        content: document.content,
        timestamp: document.timestamp || Date.now()
      };

      // Store the application's UUID if provided
      if (document.documentId) {
        docToSave.documentId = document.documentId;
      }

      // Only add id if it's a valid number (for updates)
      if (typeof document.id === 'number' && !isNaN(document.id)) {
        docToSave.id = document.id;
      }

      const request = store.put(docToSave);

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Get all documents from IndexedDB
   */
  async getAllDocuments(): Promise<Document[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Document[]);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Get a single document by ID
   */
  async getDocument(id: number): Promise<Document | undefined> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result as Document | undefined);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Delete a document from IndexedDB
   */
  async deleteDocument(id: number): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Update a document in IndexedDB
   */
  async updateDocument(document: Document): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      const request = store.put({
        ...document,
        timestamp: Date.now()
      });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Clear all documents from IndexedDB
   */
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

/**
 * StoredDocument interface for IndexedDB persistence
 */
export interface Document {
  id?: number; // Auto-generated numeric ID by IndexedDB
  documentId?: string; // Application UUID
  name: string;
  content: string;
  timestamp?: number;
}

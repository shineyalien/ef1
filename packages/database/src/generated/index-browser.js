
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastLogin: 'lastLogin',
  subscriptionPlan: 'subscriptionPlan',
  subscriptionEnd: 'subscriptionEnd'
};

exports.Prisma.UserSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  expiresAt: 'expiresAt'
};

exports.Prisma.BusinessScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  companyName: 'companyName',
  ntnNumber: 'ntnNumber',
  address: 'address',
  province: 'province',
  city: 'city',
  postalCode: 'postalCode',
  businessType: 'businessType',
  sector: 'sector',
  phoneNumber: 'phoneNumber',
  email: 'email',
  website: 'website',
  fbrSetupComplete: 'fbrSetupComplete',
  fbrSetupSkipped: 'fbrSetupSkipped',
  integrationMode: 'integrationMode',
  sandboxValidated: 'sandboxValidated',
  productionEnabled: 'productionEnabled',
  sandboxToken: 'sandboxToken',
  productionToken: 'productionToken',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  businessId: 'businessId',
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  province: 'province',
  postalCode: 'postalCode',
  ntnNumber: 'ntnNumber',
  registrationType: 'registrationType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  businessId: 'businessId',
  customerId: 'customerId',
  localInvoiceNumber: 'localInvoiceNumber',
  invoiceSequence: 'invoiceSequence',
  invoiceDate: 'invoiceDate',
  dueDate: 'dueDate',
  description: 'description',
  notes: 'notes',
  subtotal: 'subtotal',
  taxAmount: 'taxAmount',
  totalAmount: 'totalAmount',
  discount: 'discount',
  status: 'status',
  mode: 'mode',
  fbrSubmitted: 'fbrSubmitted',
  fbrValidated: 'fbrValidated',
  submissionTimestamp: 'submissionTimestamp',
  fbrInvoiceNumber: 'fbrInvoiceNumber',
  locallyGeneratedQRCode: 'locallyGeneratedQRCode',
  fbrTimestamp: 'fbrTimestamp',
  fbrTransmissionId: 'fbrTransmissionId',
  fbrAcknowledgmentNumber: 'fbrAcknowledgmentNumber',
  fbrResponse: 'fbrResponse',
  pdfGenerated: 'pdfGenerated',
  pdfStoragePath: 'pdfStoragePath',
  encryptedData: 'encryptedData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  description: 'description',
  hsCode: 'hsCode',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalValue: 'totalValue',
  taxRate: 'taxRate',
  taxAmount: 'taxAmount',
  exemptionSRO: 'exemptionSRO',
  unitOfMeasurement: 'unitOfMeasurement'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  businessId: 'businessId',
  name: 'name',
  description: 'description',
  hsCode: 'hsCode',
  unitOfMeasurement: 'unitOfMeasurement',
  unitPrice: 'unitPrice',
  taxRate: 'taxRate',
  category: 'category',
  sku: 'sku',
  stock: 'stock',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BulkInvoiceBatchScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessId: 'businessId',
  fileName: 'fileName',
  originalName: 'originalName',
  fileSize: 'fileSize',
  totalRecords: 'totalRecords',
  validRecords: 'validRecords',
  invalidRecords: 'invalidRecords',
  processingStatus: 'processingStatus',
  validationStatus: 'validationStatus',
  validationErrors: 'validationErrors',
  processingErrors: 'processingErrors',
  uploadedAt: 'uploadedAt',
  processedAt: 'processedAt',
  completedAt: 'completedAt'
};

exports.Prisma.BulkInvoiceItemScalarFieldEnum = {
  id: 'id',
  batchId: 'batchId',
  rowNumber: 'rowNumber',
  localId: 'localId',
  dataValid: 'dataValid',
  sandboxValidated: 'sandboxValidated',
  sandboxSubmitted: 'sandboxSubmitted',
  productionSubmitted: 'productionSubmitted',
  validationErrors: 'validationErrors',
  sandboxResponse: 'sandboxResponse',
  productionResponse: 'productionResponse',
  fbrInvoiceNumber: 'fbrInvoiceNumber',
  invoiceData: 'invoiceData',
  processedAt: 'processedAt'
};

exports.Prisma.SystemConfigScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessId: 'businessId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  oldValues: 'oldValues',
  newValues: 'newValues',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.SubscriptionPlan = exports.$Enums.SubscriptionPlan = {
  FREE: 'FREE',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE'
};

exports.IntegrationMode = exports.$Enums.IntegrationMode = {
  LOCAL: 'LOCAL',
  SANDBOX: 'SANDBOX',
  PRODUCTION: 'PRODUCTION'
};

exports.RegistrationType = exports.$Enums.RegistrationType = {
  REGISTERED: 'REGISTERED',
  UNREGISTERED: 'UNREGISTERED'
};

exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  VALIDATED: 'VALIDATED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.ProcessingStatus = exports.$Enums.ProcessingStatus = {
  UPLOADING: 'UPLOADING',
  PARSING: 'PARSING',
  VALIDATING: 'VALIDATING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED'
};

exports.ValidationStatus = exports.$Enums.ValidationStatus = {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserSession: 'UserSession',
  Business: 'Business',
  Customer: 'Customer',
  Invoice: 'Invoice',
  InvoiceItem: 'InvoiceItem',
  Product: 'Product',
  BulkInvoiceBatch: 'BulkInvoiceBatch',
  BulkInvoiceItem: 'BulkInvoiceItem',
  SystemConfig: 'SystemConfig',
  AuditLog: 'AuditLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

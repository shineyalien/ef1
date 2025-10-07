# FBR PRAL API - Complete Implementation Guide

## Overview
This document provides a comprehensive guide to all FBR PRAL API endpoints implemented in Easy Filer, based on the official Technical Documentation for DI (Digital Invoicing) APIs v1.12.

## Authentication
**Type:** Bearer Token  
**Header:** `Authorization: Bearer <your-token>`  
**Token Validity:** 5 years  
**Base URL:** `https://gw.fbr.gov.pk`

---

## 📋 Lookup Endpoints (Public - No Authentication Required)

### 1. Provinces
**URL:** `https://gw.fbr.gov.pk/pdi/v1/provinces`  
**Method:** GET  
**Auth:** Not required

**Response:**
```json
[
  {
    "stateProvinceCode": 7,
    "stateProvinceDesc": "PUNJAB"
  },
  {
    "stateProvinceCode": 8,
    "stateProvinceDesc": "SINDH"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getLookupData('provinces')
```

---

### 2. Document Types
**URL:** `https://gw.fbr.gov.pk/pdi/v1/doctypecode`  
**Method:** GET  
**Auth:** Not required

**Response:**
```json
[
  {
    "docTypeId": 4,
    "docDescription": "Sale Invoice"
  },
  {
    "docTypeId": 9,
    "docDescription": "Debit Note"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getLookupData('documentTypes')
```

---

### 3. HS Codes (Item Description Codes)
**URL:** `https://gw.fbr.gov.pk/pdi/v1/itemdesccode`  
**Method:** GET  
**Auth:** Not required

**Response:**
```json
[
  {
    "hS_CODE": "8432.1010",
    "description": "NUCLEAR REACTOR, BOILERS, MACHINERY..."
  },
  {
    "hS_CODE": "0304.7400",
    "description": "FISH AND CRUSTACEANS..."
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getLookupData('hsCodes')
```

---

### 4. SRO Item Codes
**URL:** `https://gw.fbr.gov.pk/pdi/v1/sroitemcode`  
**Method:** GET  
**Auth:** Not required

**Response:**
```json
[
  {
    "srO_ITEM_ID": 724,
    "srO_ITEM_DESC": "9"
  },
  {
    "srO_ITEM_ID": 728,
    "srO_ITEM_DESC": "1"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getLookupData('sroItems')
```

---

### 5. Transaction Types (Scenarios)
**URL:** `https://gw.fbr.gov.pk/pdi/v1/transtypecode`  
**Method:** GET  
**Auth:** Not required

**Response:**
```json
[
  {
    "transactioN_TYPE_ID": 82,
    "transactioN_DESC": "DTRE goods"
  },
  {
    "transactioN_TYPE_ID": 87,
    "transactioN_DESC": "Special procedure cottonseed"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getLookupData('transactionTypes')
```

---

### 6. Units of Measurement (UOM)
**URL:** `https://gw.fbr.gov.pk/pdi/v1/uom`  
**Method:** GET  
**Auth:** Not required

**Response:**
```json
[
  {
    "uoM_ID": 77,
    "description": "Square Metre"
  },
  {
    "uoM_ID": 13,
    "description": "KG"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getLookupData('uom')
```

---

## 🔍 Parameterized Endpoints

### 7. Tax Rates (Sale Type to Rate)
**URL:** `https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate?date=24-Feb-2024&transTypeId=18&originationSupplier=1`  
**Method:** GET  
**Auth:** Not required

**Parameters:**
- `date` (string): Format DD-MMM-YYYY (e.g., "24-Feb-2024")
- `transTypeId` (number): Transaction type ID
- `originationSupplier` (number): Province ID

**Response:**
```json
[
  {
    "ratE_ID": 734,
    "ratE_DESC": "18% along with rupees 60 per kilogram",
    "ratE_VALUE": 18
  },
  {
    "ratE_ID": 280,
    "ratE_DESC": "0%",
    "ratE_VALUE": 0
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getTaxRates({
  date: '24-Feb-2024',
  transTypeId: 18,
  originationSupplier: 1
})
```

---

### 8. SRO Schedule
**URL:** `https://gw.fbr.gov.pk/pdi/v1/SroSchedule?rate_id=413&date=04-Feb-2024&origination_supplier_csv=1`  
**Method:** GET  
**Auth:** Not required

**Parameters:**
- `rate_id` (number): Rate ID
- `date` (string): Format DD-MMM-YYYY
- `origination_supplier_csv` (number): Province ID

**Response:**
```json
[
  {
    "srO_ID": 7,
    "srO_DESC": "Zero Rated Gas"
  },
  {
    "srO_ID": 8,
    "srO_DESC": "5th Schedule"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getSROSchedule({
  rateId: 413,
  date: '04-Feb-2024',
  originationSupplier: 1
})
```

---

### 9. HS Code with UOM
**URL:** `https://gw.fbr.gov.pk/pdi/v2/HS_UOM?hs_code=5904.9000&annexure_id=3`  
**Method:** GET  
**Auth:** Not required

**Parameters:**
- `hs_code` (string): Harmonized System Code
- `annexure_id` (number): Sales annexure ID

**Response:**
```json
[
  {
    "uoM_ID": 77,
    "description": "Square Meter"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getHSCodeWithUOM({
  hsCode: '5904.9000',
  annexureId: 3
})
```

---

### 10. SRO Item by Date and ID
**URL:** `https://gw.fbr.gov.pk/pdi/v2/SROItem?date=2025-03-25&sro_id=389`  
**Method:** GET  
**Auth:** Not required

**Parameters:**
- `date` (string): Format YYYY-MM-DD
- `sro_id` (number): SRO ID

**Response:**
```json
[
  {
    "srO_ITEM_ID": 17853,
    "srO_ITEM_DESC": "50"
  },
  {
    "srO_ITEM_ID": 17854,
    "srO_ITEM_DESC": "51"
  }
]
```

**Usage:**
```typescript
const result = await pralClient.getSROItem({
  date: '2025-03-25',
  sroId: 389
})
```

---

### 11. STATL Check (Sales Tax Active Taxpayers List)
**URL:** `https://gw.fbr.gov.pk/dist/v1/statl`  
**Method:** POST  
**Auth:** Not required

**Request:**
```json
{
  "regno": "0788762",
  "date": "2025-05-18"
}
```

**Response:**
```json
{
  "status code": "01",
  "status": "In-Active"
}
```
OR
```json
{
  "status code": "02",
  "status": "Active"
}
```

**Usage:**
```typescript
const result = await pralClient.checkSTATL({
  regno: '0788762',
  date: '2025-05-18'
})
```

---

### 12. Get Registration Type
**URL:** `https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type`  
**Method:** POST  
**Auth:** Not required

**Request:**
```json
{
  "Registration_No": "0788762"
}
```

**Response:**
```json
{
  "statuscode": "00",
  "REGISTRATION_NO": "0788762",
  "REGISTRATION_TYPE": "Registered"
}
```
OR
```json
{
  "statuscode": "01",
  "REGISTRATION_NO": "0788762",
  "REGISTRATION_TYPE": "unregistered"
}
```

**Usage:**
```typescript
const result = await pralClient.getRegistrationType('0788762')
```

---

## 📤 Invoice Submission Endpoints (Require Bearer Token)

### 13. Validate Invoice (Sandbox Only)
**URL:** `https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb`  
**Method:** POST  
**Auth:** Bearer Token Required  
**Environment:** Sandbox only

**Usage:**
```typescript
const result = await pralClient.validateInvoice(invoiceData)
```

---

### 14. Submit Invoice (Sandbox)
**URL:** `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb`  
**Method:** POST  
**Auth:** Bearer Token Required  
**Environment:** Sandbox

**Usage:**
```typescript
const result = await pralClient.postInvoice(invoiceData)
```

---

### 15. Submit Invoice (Production)
**URL:** `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata`  
**Method:** POST  
**Auth:** Bearer Token Required  
**Environment:** Production

**Usage:**
```typescript
const result = await pralClient.postInvoice(invoiceData)
```

---

## 🧪 Testing

### Test All Endpoints
Visit: `http://localhost:3000/fbr-test`

This page provides an interactive interface to test all FBR API endpoints with:
- Pre-filled example parameters
- One-click testing for all lookup endpoints
- Individual parameterized endpoint testing
- Real-time response viewing
- Success/failure indicators

### API Test Endpoint
**URL:** `/api/fbr/test`  
**Method:** POST

**Request:**
```json
{
  "endpoint": "provinces",
  "params": {}
}
```

**Available Endpoints:**
- `provinces`
- `documentTypes`
- `hsCodes`
- `sroItems`
- `transactionTypes`
- `uom`
- `taxRates`
- `sroSchedule`
- `hsCodeWithUOM`
- `sroItem`
- `statl`
- `registrationType`

---

## 🔐 Token Management

### Saving Tokens
1. Go to **Settings → FBR Integration**
2. Enter your Bearer Token (sandbox or production)
3. Click "Save Token"
4. Tokens are stored encrypted in the database

### Token Requirements
- **Sandbox Token:** Required for testing and validation
- **Production Token:** Requires completed sandbox validation
- **Format:** UUID format (e.g., `1dde13f7-ff09-3535-8255-5c3721f6d1e3`)
- **Validity:** 5 years from issuance
- **Storage:** Encrypted in database

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request successful |
| 401  | Unauthorized - Invalid or missing Bearer token |
| 500  | Internal Server Error - Contact FBR administrator |

---

## 🎯 Implementation Checklist

- ✅ All 15 FBR API endpoints implemented
- ✅ Bearer Token authentication
- ✅ Sandbox and Production environments
- ✅ Public lookup endpoints (no auth)
- ✅ Parameterized endpoints with validation
- ✅ Invoice submission (sandbox & production)
- ✅ STATL and registration type checking
- ✅ Token management UI
- ✅ Encrypted token storage
- ✅ Interactive testing page
- ✅ Error handling and logging
- ✅ TypeScript types for all responses

---

## 🚀 Getting Started

1. **Get Bearer Token:**
   - Visit PRAL portal: https://gw.fbr.gov.pk
   - Register your business
   - Request sandbox access
   - Receive 5-year validity Bearer Token

2. **Configure Token:**
   - Go to Settings → FBR Integration
   - Paste your sandbox Bearer Token
   - Save and switch to Sandbox mode

3. **Test Integration:**
   - Visit `/fbr-test` page
   - Click "Test All Lookup Endpoints"
   - Verify all endpoints return data
   - Test parameterized endpoints

4. **Submit Test Invoices:**
   - Create test invoices
   - Submit to sandbox
   - Validate FBR responses
   - Complete all business scenarios

5. **Go Live:**
   - Generate production token from IRIS portal
   - Configure production token
   - Switch to Production mode
   - Start live operations

---

## 📝 Notes

- All lookup endpoints are public (no authentication required)
- Invoice submission requires Bearer Token
- Sandbox validation is mandatory before production
- Tokens are valid for 5 years
- Production tokens must be manually generated from IRIS portal
- All tokens are stored encrypted in the database

---

## 🆘 Support

For FBR API issues:
- Visit: https://dicrm.pral.com.pk
- Create support ticket with priority level
- Attach relevant logs and error messages
- Reference this documentation for endpoint details

# FBR-Compliant PDF Invoice Implementation

## Overview
Complete implementation of FBR (Federal Board of Revenue) compliant invoice PDF generation according to SRO 69(I)/2025 requirements.

## ✅ Implemented Features

### 1. **Company Logo Integration**
- **Location**: Top-left corner of invoice
- **Source**: `business.logoUrl` from database
- **Supported Formats**: PNG, JPEG (including Base64 encoded)
- **Fallback**: Gracefully handles missing logos
- **Size**: Auto-scaled to fit invoice header

### 2. **QR Code Generation & Display**
- **Generation**: Automatic QR code generation using FBR Invoice Reference Number (IRN)
- **Content**: JSON with IRN, seller NTN, invoice date, total amount, timestamp
- **Size**: 70 points (approximately 7x7MM as per FBR specs)
- **Location**: Top-right corner with "Scan to Verify" label
- **Standards**: Error correction level M for reliability

### 3. **FBR Invoice Reference Number (IRN)**
- **Prominence**: Most prominent field in invoice details section
- **Color**: FBR green (#008000) for compliance identification
- **Size**: Larger, bold font (10pt)
- **Label**: "FBR Invoice Reference Number (IRN)"
- **Visibility**: Displayed only when FBR submission is complete

### 4. **Electronic Software Registration Number**
- **Source**: `business.electronicSoftwareRegNo`
- **Display**: Shown in invoice header when available
- **Format**: Small gray text for reference

### 5. **FBR Validated Watermark**
- **Trigger**: Displayed when `invoice.fbrValidated === true`
- **Text**: "FBR VALIDATED"
- **Style**: Semi-transparent (15% opacity), diagonal (-45°), FBR green
- **Size**: Large (48pt) across center of page
- **Purpose**: Visual confirmation of FBR validation

### 6. **Complete Business Information**
- Company name (bold, prominent)
- NTN number
- Full address with province
- Electronic software registration number
- Custom footer text from business settings

### 7. **FBR-Compliant Table Structure**
Columns include all mandatory fields:
- S.No (Serial Number)
- Description
- HS Code (Harmonized System Code)
- Quantity
- UOM (Unit of Measurement)
- Rate (Unit Price)
- Tax% (Tax Rate Percentage)
- Amount (Line Total)

### 8. **Tax Breakdown**
- Subtotal (excluding tax)
- Sales Tax Amount
- Grand Total with separator line
- Currency format: PKR (Pakistani Rupees)

### 9. **Custom Footer**
- Business custom footer text (if configured)
- FBR compliance notice
- Easy Filer branding
- Horizontal separator line

## 📋 Data Sources

### From Invoice Record
```typescript
{
  invoiceNumber: string
  invoiceDate: Date
  fbrInvoiceNumber: string | null  // FBR IRN
  fbrSubmitted: boolean
  fbrValidated: boolean
  qrCode: string | null            // Generated QR code
  qrCodeData: string | null        // QR verification data
  subtotal: number
  taxAmount: number
  totalAmount: number
}
```

### From Business Record
```typescript
{
  companyName: string
  ntnNumber: string
  address: string
  province: string
  logoUrl: string | null                    // Company logo
  electronicSoftwareRegNo: string | null   // Software registration
  footerText: string | null                // Custom footer
}
```

### From Invoice Items
```typescript
{
  description: string
  hsCode: string                   // Harmonized System Code
  quantity: number
  unitOfMeasurement: string        // UOM (PCS, KG, etc.)
  unitPrice: number
  taxRate: number                  // Percentage
  totalValue: number              // Line total
}
```

## 🔄 QR Code Generation Workflow

### Automatic Generation
1. **Trigger**: When invoice has FBR IRN but no QR code
2. **Content**: JSON string containing:
   - `invoiceNumber`: FBR-issued IRN
   - `sellerNTN`: Seller NTN number
   - `invoiceDate`: ISO date string
   - `totalAmount`: Invoice total
   - `timestamp`: Generation timestamp
3. **Format**: PNG image, Base64 encoded
4. **Size**: 200x200px at generation, scaled to 70pt in PDF

### QR Code Content Example
```json
{
  "invoiceNumber": "7000007DI1747119701593",
  "sellerNTN": "1234567",
  "invoiceDate": "2025-01-15",
  "totalAmount": 15000.00,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 🎨 Visual Design

### Colors
- **FBR Green**: RGB(0, 0.5, 0) - Used for FBR-specific elements
- **Black**: RGB(0, 0, 0) - Primary text
- **Gray**: RGB(0.4, 0.4, 0.4) - Secondary text, borders
- **Light Gray**: RGB(0.85, 0.85, 0.85) - Table header background

### Fonts
- **Helvetica-Bold**: Headers, important fields
- **Helvetica**: Body text, regular content
- **Sizes**: 6pt (footer) to 18pt (title), with 10pt FBR IRN emphasis

### Layout
- **Page Size**: A4 (595 x 842 points)
- **Margins**: 30pt (approximately 10mm)
- **Two-Column**: Buyer info (left) | Invoice details (right)
- **Table**: Full-width with bordered rows

## 🔒 FBR Compliance Checklist

- ✅ **Unique FBR Invoice Number (IRN)**: Displayed prominently in green
- ✅ **QR Code**: 7x7MM, generated using FBR IRN
- ✅ **Electronic Software Registration Number**: Shown when available
- ⏳ **FBR Digital Invoicing Logo**: Ready to display (needs official logo file)
- ✅ **Company Logo**: Automatically embedded from business settings
- ✅ **26 Mandatory Fields**: All included (seller, buyer, items, tax breakdown)
- ✅ **Tax Calculations**: Subtotal, sales tax, grand total
- ✅ **HS Codes**: Displayed for each item
- ✅ **Units of Measurement**: UOM column in table
- ✅ **Validation Watermark**: "FBR VALIDATED" for confirmed submissions
- ✅ **Footer Disclaimer**: Compliance notice included

## 📁 File Structure

```
apps/web/
├── src/app/api/invoices/[id]/pdf/
│   └── route.tsx                      # PDF generation API route
├── public/assets/
│   ├── README.md                      # Asset documentation
│   └── fbr-digital-invoicing-logo.png # (To be added)
└── package.json
```

## 🚀 Usage

### Generate PDF
```typescript
// API endpoint
GET /api/invoices/{invoiceId}/pdf

// Returns
Content-Type: application/pdf
Content-Disposition: attachment; filename="Invoice-{number}.pdf"
```

### Frontend Integration
```tsx
<a 
  href={`/api/invoices/${invoice.id}/pdf`}
  target="_blank"
  rel="noopener noreferrer"
>
  Download PDF
</a>
```

## 🔧 Configuration

### Business Settings
Users can configure:
1. **Company Logo**: Upload via business settings page
2. **Footer Text**: Custom invoice footer message
3. **Electronic Software Reg No**: FBR software registration number

### Environment Variables
No additional environment variables required for PDF generation.

## 📝 TODO: FBR Logo

To complete FBR compliance, add the official FBR Digital Invoicing Logo:

1. **Obtain Logo**: Download from FBR/PRAL official sources
2. **File Name**: `fbr-digital-invoicing-logo.png`
3. **Location**: `apps/web/public/assets/`
4. **Format**: PNG (transparent background preferred)
5. **Size**: 200x200px or higher

Once added, update the PDF route to include FBR logo embedding.

## 🧪 Testing Checklist

Test PDF generation with:
- ✅ Invoice with FBR IRN and QR code
- ✅ Invoice with company logo
- ✅ Invoice without logo (graceful fallback)
- ✅ Validated invoice (watermark appears)
- ✅ Non-validated invoice (no watermark)
- ✅ Custom footer text
- ✅ Multiple invoice items
- ✅ Different tax rates
- ✅ Long descriptions (truncation)
- ✅ Various HS codes and UOMs

## 🎯 Key Benefits

1. **Legal Compliance**: Meets SRO 69(I)/2025 requirements
2. **Professional Appearance**: Clean, branded invoices
3. **Verification**: QR codes for invoice authentication
4. **Automated**: No manual PDF formatting needed
5. **Flexible**: Supports custom branding and settings
6. **Robust**: Handles missing data gracefully

## 📚 Dependencies

```json
{
  "pdf-lib": "^1.17.1",          // PDF generation
  "qrcode": "^1.5.3",            // QR code generation
  "@types/qrcode": "^1.5.5"      // TypeScript types
}
```

## 🔗 References

- FBR Specification: SRO 69(I)/2025
- Technical Documentation: `.github/copilot-instructions.md`
- PRAL API: Digital Invoicing System v1.12
- QR Code Standard: 7x7MM minimum size

## 📞 Support

For FBR compliance questions:
- PRAL CRM: https://dicrm.pral.com.pk
- FBR Website: https://www.fbr.gov.pk
- Technical Support: Check PRAL Digital Invoicing User Manual

---

**Status**: ✅ Fully Implemented (Pending FBR official logo)
**Last Updated**: January 2025
**Version**: 1.0.0

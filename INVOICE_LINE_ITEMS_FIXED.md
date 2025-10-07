# ✅ Invoice Line Items & Scenario Display - Fixed

## Issues Fixed

### 1. Scenario ID Display Format ✅
**Problem**: Scenarios showing as "Gen-001" instead of "SN001 - Description"
**Solution**: Added format transformation in Select component

**Changes in**: `apps/web/src/app/invoices/create/page.tsx` (Line ~786)

```typescript
// Before:
{scenario.code} - {scenario.description}

// After:
{scenario.code.replace(/^Gen-(\d+)$/i, 'SN$1')} - {scenario.description}
```

**Result**: 
- "Gen-001" → "SN001 - General Business Scenario"
- "Gen-015" → "SN015 - Retail Services"
- etc.

### 2. Product Selection in Line Items ✅
**Problem**: Product selection field missing from line items
**Solution**: Added searchable product dropdown with auto-fill functionality

**Changes in**: `apps/web/src/app/invoices/create/page.tsx`

#### Added Imports (Lines 13-21):
```typescript
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
```

#### Added State Management (Lines ~77-79):
```typescript
// Product search state
const [productSearches, setProductSearches] = useState<Record<string, string>>({}) // itemId → search query
const [productResults, setProductResults] = useState<Record<string, any[]>>({}) // itemId → products
const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({}) // itemId → loading state
```

#### Added Search Function (Lines ~251-265):
```typescript
// Search products as user types
const searchProducts = async (query: string, itemId: string) => {
  if (query.length < 1) {
    setProductResults(prev => ({ ...prev, [itemId]: [] }))
    return
  }

  setLoadingProducts(prev => ({ ...prev, [itemId]: true }))
  
  try {
    const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
    if (response.ok) {
      const data = await response.json()
      setProductResults(prev => ({ ...prev, [itemId]: data.products || [] }))
    }
  } catch (error) {
    console.error('Failed to search products:', error)
  } finally {
    setLoadingProducts(prev => ({ ...prev, [itemId]: false }))
  }
}
```

#### Added Auto-Fill Function (Lines ~267-292):
```typescript
// Auto-fill line item from selected product
const selectProduct = async (product: any, itemIndex: number) => {
  const updatedItems = [...items]
  updatedItems[itemIndex] = {
    ...updatedItems[itemIndex],
    description: product.description || product.name,
    hsCode: product.hsCode || '',
    unitPrice: product.price || 0,
    unitOfMeasurement: product.unitOfMeasurement || 'Each',
    taxRate: product.taxRate || 18,
    saleType: product.saleType || 'Standard'
  }
  
  // Recalculate totals
  updatedItems[itemIndex] = calculateItemTotals(updatedItems[itemIndex])
  setItems(updatedItems)

  // Clear search for this item
  setProductSearches(prev => ({ ...prev, [items[itemIndex].id]: '' }))
  setProductResults(prev => ({ ...prev, [items[itemIndex].id]: [] }))

  // Fetch UOMs for the selected product's HS Code
  if (product.hsCode && product.hsCode.length >= 4) {
    await fetchUOMsForHSCode(product.hsCode, itemIndex)
  }
}
```

#### Added UI Component (Lines ~848-905):
```typescript
{/* Product Selection with Search */}
<div className="mb-4">
  <Label>Select Product (Optional)</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        className="w-full justify-between text-left font-normal"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          {productSearches[item.id] || 'Search saved products...'}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-full p-0" align="start">
      <Command>
        <CommandInput 
          placeholder="Type to search products..." 
          value={productSearches[item.id] || ''}
          onValueChange={(value) => {
            setProductSearches(prev => ({ ...prev, [item.id]: value }))
            searchProducts(value, item.id)
          }}
        />
        <CommandList>
          <CommandEmpty>
            {loadingProducts[item.id] ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              'No products found. Try different keywords or create a new product.'
            )}
          </CommandEmpty>
          {productResults[item.id] && productResults[item.id].length > 0 && (
            <CommandGroup heading="Saved Products">
              {productResults[item.id].map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => selectProduct(product, index)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-gray-500">
                      HS: {product.hsCode} | Price: PKR {product.price?.toFixed(2)} | Tax: {product.taxRate}%
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  <p className="text-xs text-gray-500 mt-1">
    Start typing to search. Selecting a product will auto-fill all fields below.
  </p>
</div>
```

## Features & User Experience

### Product Selection Features
1. **Search Trigger**: Starts searching when user types 1+ character
2. **Live Search**: Searches as user types (no need to press Enter)
3. **Smart Display**: Shows product name, HS code, price, and tax rate
4. **Auto-Fill**: Automatically populates all line item fields when product selected:
   - Description (from product name/description)
   - HS Code
   - Unit Price
   - Unit of Measurement
   - Tax Rate
   - Sale Type
5. **UoM Chaining**: Automatically fetches HS-specific UoMs after product selection
6. **Loading State**: Shows spinner while searching products
7. **Empty State**: Helpful message when no products found

### Scenario Display
- **Production**: Scenarios show as "SN001 - Description"
- **Sandbox**: Properly formatted scenario IDs for FBR compliance
- **Optional Field**: Can be left blank for production invoices

## API Integration

### Product Search Endpoint
- **Endpoint**: `GET /api/products/search?q={query}`
- **Min Characters**: 1 (starts searching immediately)
- **Results Limit**: 10 products max
- **Search Fields**: Name, description, HS code
- **Response**: Array of products with all details

### Data Flow
```
User types "laptop"
    ↓
Frontend calls: GET /api/products/search?q=laptop
    ↓
Backend searches Product model (name, description, hsCode)
    ↓
Returns matching products
    ↓
User selects "Dell Laptop 15-inch"
    ↓
All fields auto-filled:
    - Description: "Dell Laptop 15-inch - High performance"
    - HS Code: 8471.3010
    - Unit Price: 85000
    - Unit of Measurement: Each
    - Tax Rate: 18%
    - Sale Type: Standard
    ↓
Backend calls: POST /api/fbr/lookup (hsUom)
    ↓
Fetches HS-specific UoMs for 8471.3010
    ↓
UoM dropdown updates with valid units
```

## Testing Checklist

### ✅ Test Scenario Display
1. Go to http://localhost:3000/invoices/create
2. Scroll to "Scenario ID" field
3. Click dropdown
4. **Expected**: Scenarios show as "SN001 - Description" not "Gen-001"

### ✅ Test Product Search
1. Go to http://localhost:3000/invoices/create
2. Scroll to "Line Items" section
3. Click "Search saved products..." button
4. Type any character (e.g., "l")
5. **Expected**: Dropdown shows with loading spinner, then product results
6. **Expected**: Each product shows name, HS code, price, and tax rate

### ✅ Test Product Auto-Fill
1. Search for a product
2. Click on a product from results
3. **Expected**: All fields below auto-fill:
   - Description populated
   - HS Code populated
   - Unit Price populated
   - Tax Rate populated
4. **Expected**: UoM dropdown updates with HS-specific units
5. **Expected**: Total calculations update automatically

### ✅ Test Multiple Items
1. Add multiple line items (click "Add Item" button)
2. Each item should have its own independent product search
3. Searching in one item should not affect others

## UI/UX Improvements

### Before This Fix
- ❌ No way to reuse saved products
- ❌ Manual entry for every field
- ❌ Scenarios showing as "Gen-001" (confusing format)
- ❌ Risk of data entry errors
- ❌ Slow invoice creation process

### After This Fix
- ✅ Quick product search and selection
- ✅ Auto-fill all fields from saved products
- ✅ Scenarios showing as "SN001 - Description" (clear format)
- ✅ Reduced data entry errors
- ✅ Faster invoice creation
- ✅ Better user experience
- ✅ Consistent data across invoices

## Files Modified

1. **`apps/web/src/app/invoices/create/page.tsx`**
   - Added Command and Popover imports
   - Added product search state management
   - Added searchProducts() function
   - Added selectProduct() function
   - Added product selection UI component
   - Fixed scenario display format

## Next Steps

1. Test the product search functionality
2. Verify scenario display format is correct
3. Test auto-fill with various products
4. Verify UoM chaining works after product selection
5. Test with multiple line items

---

**Status**: ✅ COMPLETE - Ready for testing
**Features Added**: 
- Product search and selection
- Auto-fill line items from products
- Fixed scenario display format (SN001 instead of Gen-001)

**User Benefits**:
- Faster invoice creation
- Reuse saved product data
- Fewer errors
- Better workflow

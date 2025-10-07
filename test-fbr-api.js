// Quick test to see actual FBR API responses
// Run this to debug: node test-fbr-api.js

const FBR_BASE_URL = 'https://gw.fbr.gov.pk'

async function testFBREndpoint(endpoint, name) {
  console.log(`\n\n=== Testing ${name} ===`)
  console.log(`Endpoint: ${FBR_BASE_URL}${endpoint}`)
  
  try {
    const response = await fetch(`${FBR_BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.log(`❌ Error: ${response.status} ${response.statusText}`)
      return
    }
    
    const data = await response.json()
    console.log(`✅ Got ${Array.isArray(data) ? data.length : 1} records`)
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('\n📋 Sample Record:')
      console.log(JSON.stringify(data[0], null, 2))
      
      console.log('\n🔑 All Field Names:')
      console.log(Object.keys(data[0]).join(', '))
    }
  } catch (error) {
    console.log(`❌ Failed:`, error.message)
  }
}

async function main() {
  // Test public endpoints (no auth required)
  await testFBREndpoint('/pdi/v1/transtypecode', 'Transaction Types')
  await testFBREndpoint('/pdi/v1/uom', 'Units of Measurement')
  await testFBREndpoint('/pdi/v1/provinces', 'Provinces')
  await testFBREndpoint('/pdi/v1/itemdesccode', 'HS Codes (limited)')
}

main()

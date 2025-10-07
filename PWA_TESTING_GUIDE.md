# PWA Testing Checklist

## Test the following features on http://localhost:3000

### 1. Service Worker Registration
- [ ] Open Developer Tools → Application → Service Workers
- [ ] Verify that `sw.js` is registered and running
- [ ] Check that caching strategies are working

### 2. Web App Manifest
- [ ] Application → Manifest
- [ ] Verify all manifest properties are loaded correctly
- [ ] Check icons, shortcuts, and theme colors

### 3. Install Prompt
- [ ] Open on Chrome/Edge desktop
- [ ] Look for install prompt in address bar
- [ ] Test install functionality
- [ ] Verify app opens as standalone window

### 4. Mobile Experience
- [ ] Open on mobile device or use DevTools device simulation
- [ ] Test responsive design on different screen sizes
- [ ] Verify touch-friendly interface elements
- [ ] Test mobile navigation and bottom tab bar

### 5. Offline Functionality
- [ ] Turn off internet connection
- [ ] Navigate to different pages (should show offline page)
- [ ] Create an invoice offline
- [ ] Verify offline data is stored
- [ ] Turn internet back on and check sync

### 6. Network Status
- [ ] Check online/offline indicators
- [ ] Verify status changes when connection changes
- [ ] Test unsynced data notifications

### 7. Background Sync
- [ ] Create data while offline
- [ ] Turn internet back on
- [ ] Verify automatic sync occurs

### 8. Push Notifications (if implemented)
- [ ] Test notification permissions
- [ ] Verify notifications are received

## Mobile Testing URLs
- Dashboard: http://localhost:3000/dashboard
- Invoices: http://localhost:3000/invoices/mobile  
- Customers: http://localhost:3000/customers/mobile
- Invoice Form: Via "New" button on invoices page

## PWA Installation Test
1. Open Chrome/Edge on desktop
2. Navigate to http://localhost:3000
3. Look for install icon in address bar
4. Click install and verify app opens in standalone window
5. Test that app icon appears in start menu/dock

## Mobile Device Test
1. Open http://localhost:3000 on mobile browser
2. Look for "Add to Home Screen" prompt
3. Install and verify app behavior
4. Test offline functionality

## Performance Verification
- [ ] Use Lighthouse to audit PWA score
- [ ] Check Performance, Accessibility, Best Practices, SEO scores
- [ ] Verify PWA criteria are met (should be 100 or close)
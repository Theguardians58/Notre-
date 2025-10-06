# 🎨 CogniNote Logo Setup

**Updated**: October 2025  
**Version**: v2.2.1

---

## 🖼️ Logo Integration

The CogniNote logo has been integrated throughout the application using a custom gemstone/crystal design that represents the application's premium, intelligent nature.

---

## 📦 Logo Files

### Current Logo Files

**Primary Logo:**
- `public/logo-original.png` - Downloaded from provided URL
- `public/logo.svg` - Custom-designed SVG (fallback/alternative)

### Logo Component

**Location**: `components/layout/Logo.tsx`

**Features:**
- Responsive sizing (sm, md, lg, xl)
- Optional text display
- Clickable link to dashboard
- Next.js Image optimization
- Gradient text effect

**Usage:**
```tsx
import Logo from '@/components/layout/Logo';

// Default (medium size with text)
<Logo />

// Custom size
<Logo size="xl" />

// Without text
<Logo showText={false} />

// Custom link
<Logo href="/custom-route" />

// No link
<Logo href="" />
```

---

## 🎨 Logo Design

### SVG Logo Design
The custom SVG logo features:
- **Geometric crystal/diamond shape**
- **Gradient colors** (blue to purple)
- **Multiple facets** for depth
- **Light reflections** for premium feel
- **Scalable vector graphics**

### Color Scheme
- Primary Blue: `#3b82f6`
- Primary Purple: `#8b5cf6`
- Light Blue: `#60a5fa`
- Light Purple: `#a78bfa`
- Indigo: `#6366f1`

---

## 📍 Logo Placement

### Where the Logo Appears

1. **Sidebar** (Desktop)
   - Location: `components/layout/Sidebar.tsx`
   - Size: Medium
   - Shows: Logo + Text

2. **Mobile Header**
   - Location: `components/layout/MobileHeader.tsx`
   - Size: Small
   - Shows: Logo + Text

3. **Login Page**
   - Location: `app/auth/login/page.tsx`
   - Size: Extra Large
   - Shows: Logo + Text + Gradient

4. **Signup Page**
   - Location: `app/auth/signup/page.tsx`
   - Size: Extra Large
   - Shows: Logo + Text + Gradient

5. **Landing Page**
   - Location: `app/page.tsx`
   - Size: Extra Large
   - Shows: Logo + Text

6. **Favicon**
   - Location: Browser tab
   - File: `public/logo.svg`
   - Auto-generated from metadata

---

## 🔧 Customization

### Change Logo Image

**Option 1: Use PNG Image**
1. Download your logo image
2. Save as `public/logo.png`
3. Update `components/layout/Logo.tsx`:
```tsx
<Image
  src="/logo.png"  // Change from logo-original.png
  alt="CogniNote Logo"
  width={imageSize}
  height={imageSize}
  ...
/>
```

**Option 2: Use SVG Image**
1. Create/download SVG logo
2. Save as `public/logo.svg`
3. Update `components/layout/Logo.tsx`:
```tsx
<Image
  src="/logo.svg"
  alt="CogniNote Logo"
  ...
/>
```

**Option 3: Use External URL**
```tsx
<Image
  src="https://your-cdn.com/logo.png"
  alt="CogniNote Logo"
  ...
/>
```

### Change Logo Sizes

Edit `components/layout/Logo.tsx`:
```tsx
const sizeMap = {
  sm: { image: 28, text: 'text-base' },    // Small
  md: { image: 36, text: 'text-lg' },      // Medium
  lg: { image: 44, text: 'text-xl' },      // Large
  xl: { image: 56, text: 'text-2xl' },     // Extra Large
};
```

### Change Brand Colors

Edit the gradient in `components/layout/Logo.tsx`:
```tsx
<span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  CogniNote
</span>
```

Change to your colors:
```tsx
from-[#yourcolor] to-[#yourcolor]
```

### Change SVG Logo Design

Edit `public/logo.svg` with your custom SVG code:
```svg
<svg width="48" height="48" viewBox="0 0 48 48">
  <!-- Your custom logo design -->
</svg>
```

---

## 🎨 Logo Variants

### Create Additional Variants

**Dark Mode Logo:**
```tsx
// In Logo component, add dark mode variant
<Image
  src={isDark ? '/logo-dark.svg' : '/logo-light.svg'}
  ...
/>
```

**Favicon Sizes:**
Create multiple sizes for different devices:
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

Update `app/layout.tsx`:
```tsx
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};
```

---

## 📱 PWA Manifest Logo

Update `app/manifest.json` with logo:
```json
{
  "name": "CogniNote",
  "short_name": "CogniNote",
  "icons": [
    {
      "src": "/logo.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🖼️ Logo Best Practices

### File Format Recommendations

**SVG (Recommended):**
- ✅ Scalable to any size
- ✅ Small file size
- ✅ Sharp on all screens
- ✅ Easy to modify colors

**PNG:**
- ✅ Wide browser support
- ✅ Transparent background
- ⚠️ Create multiple sizes
- ⚠️ Larger file size

**WebP:**
- ✅ Best compression
- ✅ Modern browsers
- ⚠️ Need fallback for older browsers

### Size Guidelines

**Minimum Sizes:**
- Favicon: 16x16px, 32x32px
- App Icon: 192x192px, 512x512px
- Header Logo: 32px height
- Hero Logo: 64px+ height

**File Size:**
- Target: < 50 KB for PNG
- Target: < 10 KB for SVG
- Optimize with tools like TinyPNG, SVGO

### Design Tips

1. **Keep it Simple**: Logo should work at small sizes
2. **High Contrast**: Ensure visibility on light/dark backgrounds
3. **Consistent**: Use same logo throughout app
4. **Scalable**: Design works at any size
5. **Memorable**: Distinctive and recognizable

---

## 🔄 Logo Update Process

### To Update Logo Application-Wide

1. **Replace logo file** in `public/` directory
2. **Clear browser cache** (Ctrl+Shift+R / Cmd+Shift+R)
3. **Rebuild app** (`npm run build`)
4. **Deploy** to production

### Hot Reload During Development

Logo changes should hot-reload automatically during `npm run dev`. If not:
```bash
# Stop dev server (Ctrl+C)
# Restart
npm run dev
```

---

## 🎯 Current Implementation

### Logo Component Props

```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
}
```

### Usage Examples

**Sidebar:**
```tsx
<Logo size="md" showText={true} href="/dashboard" />
```

**Mobile Header:**
```tsx
<Logo size="sm" showText={true} href="/dashboard" />
```

**Auth Pages:**
```tsx
<Logo size="xl" showText={true} href="/" className="justify-center" />
```

**Without Link:**
```tsx
<Logo size="lg" showText={true} href="" />
```

---

## 📊 Logo Performance

### Optimization Tips

**Next.js Image Optimization:**
```tsx
<Image
  src="/logo.png"
  alt="CogniNote"
  width={48}
  height={48}
  priority  // Load immediately
/>
```

**Lazy Loading:**
```tsx
<Image
  src="/logo.png"
  alt="CogniNote"
  loading="lazy"  // Load when needed
/>
```

**SVG Optimization:**
```bash
# Install SVGO
npm install -g svgo

# Optimize SVG
svgo logo.svg -o logo-optimized.svg
```

---

## 🆘 Troubleshooting

### Logo Not Displaying

**Issue**: Logo shows broken image icon  
**Solution**: 
1. Check file exists in `public/` directory
2. Verify file path is correct
3. Check file permissions
4. Clear Next.js cache: `rm -rf .next`

**Issue**: Logo is blurry  
**Solution**:
1. Use SVG instead of PNG
2. Provide 2x resolution PNG
3. Ensure proper width/height attributes

**Issue**: Logo doesn't update  
**Solution**:
1. Clear browser cache
2. Restart dev server
3. Check file name matches code

### Browser Cache Issues

**Clear Cache:**
- Chrome: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Safari: Cmd+Option+E

**Force Reload:**
- Windows: Ctrl+Shift+R
- Mac: Cmd+Shift+R

---

## 📞 Support

For logo-related issues:
- Check Next.js Image documentation
- Review this guide
- Check browser console for errors
- Verify file paths and names

---

## ✅ Checklist

Logo setup completed:
- [x] Logo component created
- [x] PNG logo downloaded
- [x] SVG logo created (fallback)
- [x] Integrated in sidebar
- [x] Integrated in mobile header
- [x] Integrated in auth pages
- [x] Integrated in landing page
- [x] Favicon configured
- [x] Metadata updated
- [x] Documentation created

---

**Your CogniNote application now has a professional logo throughout!** 🎨✨

**Repository**: https://github.com/Theguardians58/Notre-

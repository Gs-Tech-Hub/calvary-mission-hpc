# Favicon and Logo Setup

This document explains how to manually set up the favicon and logo for the Calvary Mission HPC website.

## Current Working Setup

### Logo
- **File**: `public/logo.svg` ✅ (currently working)
- **Usage**: Displayed in the navbar next to the organization name
- **Fallback**: If logo fails to load, only the organization name is displayed
- **Size**: 40x40 pixels (configurable in navbar.tsx)

### Favicon
- **File**: `public/favicon.ico` ✅ (currently working)
- **Usage**: Browser tab icon and bookmarks
- **Size**: 32x32 pixels (currently working)

## How to Add Your Files

### 1. Add Your Logo
1. Create your logo file (SVG recommended for best quality)
2. Save it as `public/logo.svg`
3. The navbar will automatically detect and display it

### 2. Add Your Favicon
1. Create your favicon file (.ico format recommended)
2. Save it as `public/favicon.ico`
3. The browser will automatically use it

## Configuration

### Organization Data
The logo path is configured in `src/lib/org.ts`:

```typescript
export const org = {
  name: "Calvary Mission HPC",
  logo: "/logo.svg",
  // ... other properties
};
```

### API Integration
The navbar fetches organization data from the Strapi API and will use any logo URL returned from the API. If no logo is returned, it falls back to the default logo path.

### Supabase Image Hosting
The system is configured to handle images from Supabase storage. The Next.js configuration includes the Supabase domain (`pwzffnqczqjjehefciib.supabase.co`) to allow external images to be displayed.

## Customization

### Logo Sizing
To change the logo size in the navbar, you'll need to add the logo display code back to `src/components/navbar.tsx`:

```typescript
<Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
  {logoUrl && (
    <Image
      src={logoUrl}
      alt={`${orgName} Logo`}
      width={40}  // Change this value
      height={40} // Change this value
      className="w-10 h-10" // Update this class to match
    />
  )}
  <div className="text-xl font-bold">{orgName}</div>
</Link>
```

## File Formats

### Logo
- **SVG**: Best quality, scalable, small file size
- **PNG**: Good quality, fixed size, larger file size
- **JPG**: Acceptable quality, fixed size, larger file size

### Favicon
- **ICO**: Best browser support, multiple sizes in one file
- **PNG**: Modern browsers, single size
- **SVG**: Modern browsers, scalable

## Browser Support

- **Modern browsers**: SVG logo and PNG/SVG favicon
- **Older browsers**: ICO favicon
- **Mobile**: Apple touch icon support

## Best Practices

1. **Logo**: Use SVG format for crisp display at all sizes
2. **Favicon**: Include ICO format for maximum compatibility
3. **Sizing**: Keep logos under 100KB for fast loading
4. **Colors**: Ensure good contrast with the navbar background (#0A1D3C)
5. **Accessibility**: Include descriptive alt text for screen readers

## Troubleshooting

### Logo Not Displaying
- Check that the logo file exists in the public directory
- Verify the path in `org.ts` is correct
- Check browser console for any 404 errors
- Ensure the file format is supported

### Favicon Not Showing
- Clear browser cache
- Check that favicon file is in the public directory
- Some browsers may take time to update the favicon
- Ensure the file format is supported

### API Logo Override
If you want to use a logo from your Strapi CMS:
1. Ensure the logo field is populated in your organization data
2. The navbar will automatically use the API logo if available
3. Falls back to the default logo if API logo fails to load

## Current Status

- ✅ Logo system configured and working
- ✅ Favicon system configured and working
- ✅ Navbar displays logo + organization name
- ✅ API integration ready for dynamic logo loading
- ✅ Error handling with fallback to text-only display
- ✅ Supabase image hosting configured in Next.js

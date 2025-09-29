# Trackr - Firefox Extension

A Firefox browser extension built with TypeScript for tracking website usage.

## 🔥 Features

- **Website Tracking**: Add and manage websites to track usage
- **Tab Monitoring**: Automatically detects when tracked websites are visited
- **Persistent Storage**: Saves tracked websites in browser storage
- **Background Processing**: Runs intervals to track time spent on sites
- **TypeScript**: Built with TypeScript for better type safety and development experience
- **Responsive Design**: Clean popup interface

## 📁 Project Structure

```
├── manifest.json       # Extension configuration
├── popup.html         # Main popup interface
├── popup.css          # Popup styling
├── popup.ts           # Popup functionality (TypeScript)
├── background.ts      # Background script (TypeScript)
├── types.ts           # Shared TypeScript types and interfaces
├── utils.ts           # Shared utility functions
├── tsconfig.json      # TypeScript configuration
├── package.json       # Node.js dependencies and build scripts
├── dist/              # Compiled JavaScript files
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🛠️ Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firefox Browser
- Basic knowledge of TypeScript, HTML, and CSS

### Building the Extension

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build TypeScript Files**
   ```bash
   npm run build
   ```
   This compiles the TypeScript files from `*.ts` to JavaScript in the `dist/` folder.

3. **Watch Mode (Development)**
   ```bash
   npm run watch
   ```
   This will automatically rebuild TypeScript files when you make changes.

4. **Clean Build**
   ```bash
   npm run clean
   npm run build
   ```

### Available Scripts

- `npm run build` - Compile TypeScript files to JavaScript
- `npm run watch` - Watch TypeScript files and rebuild on changes
- `npm run clean` - Remove the dist/ folder
- `npm install` - Install dependencies

## 🚀 How to Install in Firefox (Debug Mode)

**⚠️ Important**: Make sure to build the extension first before installing!

### Method 1: Temporary Installation (Recommended for Development)

1. **Build the Extension** (Required!)
   ```bash
   npm run build
   ```

2. **Open Firefox Developer Tools**
   - Open Firefox
   - Navigate to `about:debugging` in the address bar
   - Click "This Firefox" in the left sidebar

3. **Load the Extension**
   - Click "Load Temporary Add-on..."
   - Navigate to your extension folder
   - Select the `manifest.json` file
   - Click "Open"

4. **Verify Installation**
   - The extension should appear in the list with a green "Running" status
   - You should see the extension icon in the Firefox toolbar
   - Click the icon to open the popup

### Method 2: Permanent Installation (For Testing)

1. **Build the Extension First**
   ```bash
   npm run build
   ```

2. **Create a ZIP file**
   ```bash
   zip -r trackr-extension.zip manifest.json popup.html popup.css dist/ icons/
   ```

3. **Install via about:addons**
   - Go to `about:addons`
   - Click the gear icon (⚙️) in the top right
   - Select "Install Add-on From File..."
   - Choose your ZIP file

### Method 3: Using web-ext CLI (Advanced)

1. **Install web-ext**
   ```bash
   npm install -g web-ext
   ```

2. **Build and Run**
   ```bash
   npm run build
   web-ext run
   ```

## 🔄 Development Workflow

1. **Make changes** to any TypeScript files (`*.ts`)
2. **Rebuild the extension**:
   ```bash
   npm run build
   ```
   Or use watch mode for automatic rebuilds:
   ```bash
   npm run watch
   ```
3. **Reload the extension** in Firefox:
   - Go to `about:debugging`
   - Click "Reload" next to your extension
   - Or use `Ctrl+R` in the extension popup

### Testing

- **Popup Testing**: Click the extension icon in the toolbar to open the popup
- **Website Tracking**: Add a website in the Tracking tab and visit it to see console logs
- **Storage Testing**: Check if tracked websites persist between browser sessions

## 🎨 Customization

### Icons

Add your own icons to the `icons/` directory:
- `icon-16.png` (16x16 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-96.png` (96x96 pixels)

### Styling

Edit `popup.css` to customize the appearance:
- Change colors in the CSS variables
- Modify the gradient background
- Adjust button styles and layouts

### Functionality

Extend the extension by modifying:
- `popup.ts` - Add new popup features (requires rebuild)
- `background.ts` - Add new background processing (requires rebuild)
- `types.ts` - Add new TypeScript interfaces/types (shared across files)
- `utils.ts` - Add new shared utility functions
- `manifest.json` - Add new permissions or features

## 📋 Common Issues

**Extension doesn't load:**
- Make sure you've run `npm run build` first
- Check that `manifest.json` is valid JSON
- Ensure all referenced files exist in the `dist/` folder
- Check the Firefox console for errors

**TypeScript compilation errors:**
- Run `npm run build` to see specific TypeScript errors
- Check that all imports and types are correct
- Ensure `tsconfig.json` is properly configured

**Popup doesn't work:**
- Verify popup.html, popup.css exist and `dist/popup.js` is built
- Check for JavaScript errors in the extension's console
- Make sure the build process completed successfully

**Background script issues:**
- Check that `dist/background.js` exists and is referenced in manifest.json
- Look for errors in the extension's background page console
- Verify browser API permissions are correctly set

**Build issues:**
- Make sure Node.js and npm are installed
- Run `npm install` to install dependencies
- Check that TypeScript is properly installed

## 🔧 Debugging

1. **Open Extension Console**:
   - Go to `about:debugging`
   - Click "Inspect" next to your extension
   - Check for errors in the console

2. **Debug Content Scripts**:
   - Open regular Firefox Developer Tools (F12)
   - Content script errors appear in the webpage console

3. **Check Permissions**:
   - Ensure your manifest.json has the required permissions
   - Some features require additional permissions

## 📚 Resources

- [Mozilla Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Firefox Extension API Reference](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API)
- [web-ext CLI Tool](https://github.com/mozilla/web-ext)

## 🤝 Contributing

Feel free to modify and extend this boilerplate for your own projects!

---

Built with ❤️ for Firefox extension development
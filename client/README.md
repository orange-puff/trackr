# Firefox Extension - Sample Boilerplate

A basic Firefox browser extension with sample HTML, CSS, and JavaScript functionality.

## 🔥 Features

- **Popup Interface**: Clean, modern popup with tab information
- **Tab Interaction**: Get current tab URL and title
- **Background Color Changer**: Dynamically change webpage backgrounds
- **Click Counter**: Track extension usage with persistent storage
- **Content Script**: Adds a subtle activity indicator to all web pages
- **Responsive Design**: Works well on different screen sizes

## 📁 Project Structure

```
├── manifest.json       # Extension configuration
├── popup.html         # Main popup interface
├── popup.css          # Popup styling
├── popup.js           # Popup functionality
├── content.js         # Content script for web pages
├── icons/             # Extension icons (empty - add your own)
└── README.md          # This file
```

## 🚀 How to Install in Firefox (Debug Mode)

### Method 1: Temporary Installation (Recommended for Development)

1. **Open Firefox Developer Tools**
   - Open Firefox
   - Navigate to `about:debugging` in the address bar
   - Click "This Firefox" in the left sidebar

2. **Load the Extension**
   - Click "Load Temporary Add-on..."
   - Navigate to your extension folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Verify Installation**
   - The extension should appear in the list with a green "Running" status
   - You should see the extension icon in the Firefox toolbar
   - Click the icon to open the popup

### Method 2: Permanent Installation (For Testing)

1. **Create a ZIP file**
   ```bash
   zip -r firefox-extension.zip manifest.json popup.html popup.css popup.js content.js icons/
   ```

2. **Install via about:addons**
   - Go to `about:addons`
   - Click the gear icon (⚙️) in the top right
   - Select "Install Add-on From File..."
   - Choose your ZIP file

### Method 3: Using web-ext CLI (Advanced)

1. **Install web-ext**
   ```bash
   npm install -g web-ext
   ```

2. **Run the extension**
   ```bash
   web-ext run
   ```

## 🛠️ Development

### Prerequisites

- Firefox Browser (any recent version)
- Basic knowledge of HTML, CSS, and JavaScript
- Text editor or IDE

### Local Development

1. **Make changes** to any of the files
2. **Reload the extension**:
   - Go to `about:debugging`
   - Click "Reload" next to your extension
   - Or use `Ctrl+R` in the extension popup

### Testing

- **Popup Testing**: Click the extension icon in the toolbar
- **Content Script Testing**: Visit any webpage and look for the 🔥 indicator in the bottom left
- **Permissions Testing**: Try the "Get Tab Info" and "Change Background" buttons

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
- `popup.js` - Add new popup features
- `content.js` - Add new webpage interactions
- `manifest.json` - Add new permissions or features

## 📋 Common Issues

**Extension doesn't load:**
- Check that `manifest.json` is valid JSON
- Ensure all referenced files exist
- Check the Firefox console for errors

**Popup doesn't work:**
- Verify popup.html, popup.css, and popup.js files are present
- Check for JavaScript errors in the extension's console

**Content script not working:**
- Ensure `content.js` is listed in manifest.json
- Check that permissions include the websites you're testing on

**Buttons don't work:**
- Make sure you've granted the "activeTab" permission
- Some websites may block script execution

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
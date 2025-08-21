# LinkTree-Style Website

A modern, responsive LinkTree-style website built with HTML, CSS, and JavaScript. Perfect for creating a personal link hub to share all your important links in one place.

## ✨ Features

- **Modern Design**: Clean, responsive design with smooth animations
- **Customizable Profile**: Update your name, bio, and profile picture
- **Dynamic Links**: Add, edit, and manage your links through a user-friendly interface
- **Social Media Integration**: Built-in social media links section
- **Local Storage**: Your links and profile data are saved locally
- **Mobile Responsive**: Works perfectly on all devices
- **Keyboard Shortcuts**: Quick access to add links (Ctrl/Cmd + K)
- **Click Tracking**: Basic analytics for link clicks

## 🚀 Getting Started

1. **Download/Clone** the files to your local machine
2. **Open** `index.html` in your web browser
3. **Customize** your profile and links using the settings button (gear icon)

## 🎨 Customization

### Profile Settings
- Click the gear icon (⚙️) in the top-right corner
- Update your profile picture, name, and bio
- Changes are automatically saved

### Adding Links
1. Click the gear icon (⚙️) or press `Ctrl/Cmd + K`
2. Fill in the link title, URL, and optional icon
3. Click "Add Link" to save

### Social Media Links
Edit the social media URLs in `script.js`:

```javascript
const socialUrls = {
    'Instagram': 'https://instagram.com/yourusername',
    'Twitter': 'https://twitter.com/yourusername',
    'LinkedIn': 'https://linkedin.com/in/yourusername',
    'GitHub': 'https://github.com/yourusername'
};
```

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- The website uses a beautiful gradient background that you can customize
- All animations and hover effects can be adjusted

## 📱 Features in Detail

### Responsive Design
- Optimized for desktop, tablet, and mobile devices
- Flexible layout that adapts to different screen sizes
- Touch-friendly interface for mobile users

### Local Storage
- Your links and profile data are automatically saved
- No server required - everything works offline
- Data persists between browser sessions

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Open add link modal
- `Escape`: Close modal
- `Enter`: Submit forms

### Link Management
- Add unlimited links
- Each link can have a custom icon (emoji or text)
- Links open in new tabs for better user experience
- URL validation to ensure proper formatting

## 🎯 Sample Links Included

The website comes with sample links that you can customize:
- Portfolio
- Blog
- Contact (email)
- Resume

## 🔧 Technical Details

### File Structure
```
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

### Dependencies
- **Font Awesome**: For social media icons
- **Google Fonts**: Inter font family
- **No external JavaScript libraries required**

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🚀 Deployment

### GitHub Pages
1. Upload files to a GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the folder to Netlify
2. Your site will be deployed instantly
3. Get a custom domain or use the provided Netlify URL

### Vercel
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push
3. Get a custom domain and SSL certificate

## 🎨 Customization Examples

### Change Background Gradient
In `styles.css`, modify the body background:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add Custom Fonts
Replace the Google Fonts link in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600&display=swap" rel="stylesheet">
```

### Modify Link Styling
Customize link appearance in `styles.css`:

```css
.link-item {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    /* Add your custom styles */
}
```

## 📊 Analytics Integration

The website includes basic click tracking. To integrate with analytics services:

### Google Analytics
Add this to the `<head>` section of `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics
Add this to the `<head>` section:

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🤝 Contributing

Feel free to fork this project and customize it for your needs. Some ideas for improvements:

- Add more themes/color schemes
- Implement link categories
- Add QR code generation for links
- Include more social media platforms
- Add link analytics dashboard

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by LinkTree
- Icons by Font Awesome
- Fonts by Google Fonts
- Built with modern web standards

---

**Enjoy your new LinkTree-style website!** 🎉

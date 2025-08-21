// Sample links data (v2 grouped by folders)
const sampleLinksV2 = {
    folders: {
        'Spreadsheets': [
            { title: "My Portfolio", url: "https://example.com/portfolio", icon: "💼" }
        ],
        'Links': [
            { title: "My Blog", url: "https://example.com/blog", icon: "✍️" }
        ]
    }
};

// DOM elements
const linksContainer = document.getElementById('links-container');
const addLinkModal = document.getElementById('addLinkModal');
const addLinkForm = document.getElementById('addLinkForm');
const editLinkModal = document.getElementById('editLinkModal');
const editLinkForm = document.getElementById('editLinkForm');
const deleteLinkBtn = document.getElementById('deleteLinkBtn');
const settingsBtn = document.getElementById('settingsBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const closeBtn = document.querySelector('.close');
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const profilePic = document.getElementById('profile-pic');

// Load data from localStorage or use defaults (with migration to v2)
let linksV2 = JSON.parse(localStorage.getItem('linktree-links-v2')) || null;
const legacyLinks = JSON.parse(localStorage.getItem('linktree-links')) || null;
if (!linksV2) {
    if (Array.isArray(legacyLinks)) {
        // Migrate legacy flat array into Spreadsheets by default
        linksV2 = { folders: { 'Spreadsheets': legacyLinks, 'Links': [] } };
        localStorage.setItem('linktree-links-v2', JSON.stringify(linksV2));
    } else {
        linksV2 = sampleLinksV2;
        localStorage.setItem('linktree-links-v2', JSON.stringify(linksV2));
    }
}

// Rename old folder keys if present (Folder A/B -> Spreadsheets/Links)
if (linksV2 && linksV2.folders) {
    const hasOldA = Object.prototype.hasOwnProperty.call(linksV2.folders, 'Folder A');
    const hasOldB = Object.prototype.hasOwnProperty.call(linksV2.folders, 'Folder B');
    let changed = false;
    if (hasOldA) {
        const existing = linksV2.folders['Spreadsheets'] || [];
        linksV2.folders['Spreadsheets'] = existing.concat(linksV2.folders['Folder A']);
        delete linksV2.folders['Folder A'];
        changed = true;
    }
    if (hasOldB) {
        const existing = linksV2.folders['Links'] || [];
        linksV2.folders['Links'] = existing.concat(linksV2.folders['Folder B']);
        delete linksV2.folders['Folder B'];
        changed = true;
    }
    if (changed) {
        localStorage.setItem('linktree-links-v2', JSON.stringify(linksV2));
    }
}

// Get current HTML content as defaults
const currentName = document.getElementById('profile-name').textContent;
const currentBio = document.getElementById('profile-bio').textContent;
const currentImage = document.getElementById('profile-pic').src;

let profileData = JSON.parse(localStorage.getItem('linktree-profile')) || {
    name: currentName,
    bio: currentBio,
    image: currentImage
};

// Initialize the page
function init() {
    loadProfileData();
    renderLinks();
    setupEventListeners();
}

// Load profile data
function loadProfileData() {
    profileName.textContent = profileData.name;
    profileBio.textContent = profileData.bio;
    profilePic.src = profileData.image;
    
    // Add error handling for image loading
    profilePic.onerror = function() {
        console.log('Image failed to load:', profileData.image);
        this.src = 'https://via.placeholder.com/150x150/6366f1/ffffff?text=LOGO';
    };
    
    profilePic.onload = function() {
        console.log('Image loaded successfully:', profileData.image);
    };
}

// Render all links
function renderLinks() {
    linksContainer.innerHTML = '';
    const folderNames = Object.keys(linksV2.folders);
    folderNames.forEach((folderName) => {
        const linksInFolder = linksV2.folders[folderName];
        const section = document.createElement('div');
        section.className = 'folder-section';

        const header = document.createElement('h3');
        header.className = 'folder-title';
        header.textContent = folderName;
        section.appendChild(header);

        const list = document.createElement('div');
        list.className = 'folder-links';
        linksInFolder.forEach((link, index) => {
            const linkElement = createLinkElement(link, index, folderName);
            list.appendChild(linkElement);
        });

        section.appendChild(list);
        linksContainer.appendChild(section);
    });
}

// Create a single link element
function createLinkElement(link, index, folderName) {
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    
    linkItem.innerHTML = `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-main">
            <div class="link-content">
                <span class="link-icon">${link.icon || '🔗'}</span>
                <span class="link-title">${link.title}</span>
            </div>
            <span class="link-arrow">→</span>
        </a>
        <div class="link-actions">
            <button class="link-edit-btn" title="Edit link" onclick="editLink('${folderName}', ${index})">✏️</button>
            <button class="link-delete-btn" title="Delete link" onclick="deleteLink('${folderName}', ${index})">🗑️</button>
        </div>
    `;
    
    // Add click tracking to the main link
    const linkMain = linkItem.querySelector('.link-main');
    linkMain.addEventListener('click', () => {
        trackLinkClick(link.title);
    });
    
    return linkItem;
}

// Track link clicks (you can extend this for analytics)
function trackLinkClick(linkTitle) {
    console.log(`Link clicked: ${linkTitle}`);
    // Here you could send analytics data to your preferred service
}

// Setup event listeners
function setupEventListeners() {
    // Settings button
    settingsBtn.addEventListener('click', () => {
        addLinkModal.style.display = 'block';
    });
    
    // Theme toggle button
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            addLinkModal.style.display = 'none';
            editLinkModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === addLinkModal) {
            addLinkModal.style.display = 'none';
        }
        if (event.target === editLinkModal) {
            editLinkModal.style.display = 'none';
        }
    });
    
    // Add link form submission
    addLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewLink();
    });
    
    // Edit link form submission
    editLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEditedLink();
    });
    
    // Delete link button
    deleteLinkBtn.addEventListener('click', () => {
        const index = parseInt(document.getElementById('editLinkIndex').value);
        const folder = document.getElementById('editLinkFolderOriginal').value;
        deleteLink(folder, index);
        editLinkModal.style.display = 'none';
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to open add link modal
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            addLinkModal.style.display = 'block';
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            addLinkModal.style.display = 'none';
            editLinkModal.style.display = 'none';
        }
    });
}

// Add new link
function addNewLink() {
    const title = document.getElementById('linkTitle').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const icon = document.getElementById('linkIcon').value.trim();
    const folder = document.getElementById('linkFolder').value;
    
    if (!title || !url) {
        alert('Please fill in both title and URL fields.');
        return;
    }
    
    // Validate URL
    try {
        new URL(url);
    } catch {
        alert('Please enter a valid URL.');
        return;
    }
    
    const newLink = {
        title: title,
        url: url,
        icon: icon || '🔗'
    };
    
    if (!linksV2.folders[folder]) {
        linksV2.folders[folder] = [];
    }
    linksV2.folders[folder].push(newLink);
    saveLinks();
    renderLinks();
    
    // Reset form and close modal
    addLinkForm.reset();
    addLinkModal.style.display = 'none';
    
    // Show success message
    showNotification('Link added successfully!', 'success');
}

// Edit link
function editLink(folder, index) {
    const link = linksV2.folders[folder][index];
    
    // Populate the edit form
    document.getElementById('editLinkIndex').value = index;
    document.getElementById('editLinkFolderOriginal').value = folder;
    document.getElementById('editLinkTitle').value = link.title;
    document.getElementById('editLinkUrl').value = link.url;
    document.getElementById('editLinkIcon').value = link.icon || '';
    document.getElementById('editLinkFolder').value = folder;
    
    // Show the edit modal
    editLinkModal.style.display = 'block';
}

// Save edited link
function saveEditedLink() {
    const index = parseInt(document.getElementById('editLinkIndex').value);
    const title = document.getElementById('editLinkTitle').value.trim();
    const url = document.getElementById('editLinkUrl').value.trim();
    const icon = document.getElementById('editLinkIcon').value.trim();
    const newFolder = document.getElementById('editLinkFolder').value;
    const originalFolder = document.getElementById('editLinkFolderOriginal').value;
    
    if (!title || !url) {
        alert('Please fill in both title and URL fields.');
        return;
    }
    
    // Validate URL
    try {
        new URL(url);
    } catch {
        alert('Please enter a valid URL.');
        return;
    }
    
    const updatedLink = { title, url, icon: icon || '🔗' };

    if (newFolder === originalFolder) {
        linksV2.folders[originalFolder][index] = updatedLink;
    } else {
        // Move to another folder
        linksV2.folders[originalFolder].splice(index, 1);
        if (!linksV2.folders[newFolder]) linksV2.folders[newFolder] = [];
        linksV2.folders[newFolder].push(updatedLink);
    }

    saveLinks();
    renderLinks();
    
    // Close modal
    editLinkModal.style.display = 'none';
    
    // Show success message
    showNotification('Link updated successfully!', 'success');
}

// Delete link
function deleteLink(folder, index) {
    if (confirm('Are you sure you want to delete this link?')) {
        linksV2.folders[folder].splice(index, 1);
        saveLinks();
        renderLinks();
        showNotification('Link deleted successfully!', 'success');
    }
}

// Save links to localStorage
function saveLinks() {
    localStorage.setItem('linktree-links-v2', JSON.stringify(linksV2));
}

// Save profile data to localStorage
function saveProfileData() {
    localStorage.setItem('linktree-profile', JSON.stringify(profileData));
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideDown 0.3s ease-out;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Update social media links
function updateSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    // You can customize these URLs
    const socialUrls = {
        'Instagram': 'https://instagram.com/yourusername',
        'Twitter': 'https://twitter.com/yourusername',
        'LinkedIn': 'https://linkedin.com/in/yourusername',
        'GitHub': 'https://github.com/yourusername'
    };
    
    socialLinks.forEach(link => {
        const platform = link.title;
        if (socialUrls[platform]) {
            link.href = socialUrls[platform];
        }
    });
}

// Theme management
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
    }
    localStorage.setItem('linktree-theme', theme);
}

// Load theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('linktree-theme') || 'light';
    setTheme(savedTheme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('linktree-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Analytics tracking (basic implementation)
function trackPageView() {
    console.log('Page viewed');
    // Here you could integrate with Google Analytics, Plausible, or other analytics services
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    updateSocialLinks();
    loadTheme();
    trackPageView();
});

// Export functions for potential future use
window.LinkTree = {
    addLink: addNewLink,
    setTheme: setTheme,
    updateProfile: (data) => {
        profileData = { ...profileData, ...data };
        saveProfileData();
        loadProfileData();
    }
};

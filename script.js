// Global data
let linksV2 = { folders: {} };
let profileData = {};

// Theme management
let isDarkMode = false;

// Executive folder password protection
let isExecutiveFolderUnlocked = false;
const EXECUTIVE_PASSWORD = "EB2025Exec"; // Change this to your desired password

// Load data.json
async function loadData() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    linksV2 = data.links;
    profileData = data.profile;
    renderLinks();
    loadProfileData();
  } catch (err) {
    console.error("Failed to load data.json", err);
  }
}

// Save data back to data.json (requires server support if you want edits persisted)
async function saveData() {
  // On static hosting (GitHub Pages, Netlify, etc.), you can't write back to data.json.
  // For real persistence when editing via the UI, you'd need a backend.
  // For now, just log what would be saved:
  console.log("Updated data:", { profile: profileData, links: linksV2 });
}

// Render a single link item
function renderLinkItem(link, parentElement) {
  const item = document.createElement("div");
  item.className = "link-item";
  item.innerHTML = `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-main">
      <div class="link-content">
        <span class="link-icon">${link.icon || "🔗"}</span>
        <span class="link-title">${link.title}</span>
      </div>
      <span class="link-arrow">→</span>
    </a>
  `;
  parentElement.appendChild(item);
}

// Render content within a folder (can be links or subfolders)
function renderFolderContent(contentArray, parentLinksList) {
  contentArray.forEach(item => {
    if (item.type === "folder") {
      // Render as subfolder
      const subfolderSection = document.createElement("div");
      subfolderSection.className = "folder-section subfolder-section"; // Add a class for subfolders
      subfolderSection.setAttribute("data-folder", item.title);

      const subfolderHeader = document.createElement("div");
      subfolderHeader.className = "folder-header subfolder-header";
      subfolderHeader.innerHTML = `
        <div class="folder-info">
          <i class="fas fa-folder folder-icon"></i>
          <h3 class="folder-title">${item.title}</h3>
        </div>
        <i class="fas fa-chevron-down folder-toggle"></i>
      `;

      const subfolderContent = document.createElement("div");
      subfolderContent.className = "folder-content subfolder-content";
      subfolderContent.style.display = "none"; // Start collapsed

      const sublinksList = document.createElement("div");
      sublinksList.className = "folder-links";
      
      renderFolderContent(item.content, sublinksList); // Recursively render subfolder content

      subfolderContent.appendChild(sublinksList);
      subfolderSection.appendChild(subfolderHeader);
      subfolderSection.appendChild(subfolderContent);
      parentLinksList.appendChild(subfolderSection);

      subfolderHeader.addEventListener('click', () => {
        toggleFolder(subfolderSection);
      });

    } else {
      // Render as a link
      renderLinkItem(item, parentLinksList);
    }
  });
}

// Load profile data into DOM
function loadProfileData() {
  document.getElementById("profile-name").textContent = profileData.name;
  document.getElementById("profile-bio").textContent = profileData.bio;
  const img = document.getElementById("profile-pic");
  img.src = profileData.image;
}

// Quick Resources Toggle
function initQuickResources() {
    const trigger = document.getElementById('quick-resources-trigger');
    const section = document.querySelector('.quick-resources-section');
    
    if (trigger && section) {
        trigger.addEventListener('click', () => {
            section.classList.toggle('show-dropdown');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!section.contains(e.target)) {
                section.classList.remove('show-dropdown');
            }
        });
    }
}

// Theme management functions
function initTheme() {
    // Check localStorage for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  isDarkMode = true;
  localStorage.setItem('theme', 'dark');
  updateThemeIcon();
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  isDarkMode = false;
  localStorage.setItem('theme', 'light');
  updateThemeIcon();
}

function toggleTheme() {
  if (isDarkMode) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

function updateThemeIcon() {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    if (isDarkMode) {
      themeIcon.className = 'fas fa-sun';
    } else {
      themeIcon.className = 'fas fa-moon';
    }
  }
}

// Render links
function renderLinks() {
  const container = document.getElementById("links-container");
  container.innerHTML = "";
  
  Object.keys(linksV2.folders).forEach((folderName) => {
    const folderData = linksV2.folders[folderName];
    const folderSection = document.createElement("div");
    folderSection.className = "folder-section";
    folderSection.setAttribute("data-folder", folderName);

    const folderHeader = document.createElement("div");
    folderHeader.className = "folder-header";
    
    // Check if this is the Executives folder and if it's locked
    const isExecutivesFolder = folderName === "Executives";
    const isLocked = isExecutivesFolder && !isExecutiveFolderUnlocked;
    
    folderHeader.innerHTML = `
      <div class="folder-info">
        <i class="fas ${isLocked ? 'fa-lock' : 'fa-folder'} folder-icon ${isLocked ? 'locked' : ''}"></i>
        <h3 class="folder-title">${folderName}</h3>
        ${isLocked ? '<span class="locked-indicator">🔒</span>' : ''}
      </div>
      <i class="fas fa-chevron-down folder-toggle"></i>
    `;

    const folderContent = document.createElement("div");
    folderContent.className = "folder-content";
    folderContent.style.display = "none"; // Start collapsed

    const linksList = document.createElement("div");
    linksList.className = "folder-links";
    
    renderFolderContent(folderData, linksList); // Call new recursive function

    folderContent.appendChild(linksList);
    folderSection.appendChild(folderHeader);
    folderSection.appendChild(folderContent);
    container.appendChild(folderSection);

    // Add click event to toggle folder
    folderHeader.addEventListener('click', () => {
      if (isExecutivesFolder && !isExecutiveFolderUnlocked) {
        // Show password prompt for locked Executives folder
        showExecutivePasswordModal();
      } else {
        toggleFolder(folderSection);
      }
    });
  });
}

// Toggle folder expand/collapse
function toggleFolder(folderSection) {
  const folderContent = folderSection.querySelector('.folder-content');
  const folderToggle = folderSection.querySelector('.folder-toggle');
  const folderIcon = folderSection.querySelector('.folder-icon');
  const isExpanded = folderContent.style.display !== 'none';
  
  if (isExpanded) {
    // Collapse folder
    folderContent.style.display = 'none';
    folderToggle.className = 'fas fa-chevron-down folder-toggle';
    folderIcon.className = 'fas fa-folder folder-icon';
    folderSection.classList.remove('expanded');
  } else {
    // Expand folder
    folderContent.style.display = 'block';
    folderToggle.className = 'fas fa-chevron-up folder-toggle';
    folderIcon.className = 'fas fa-folder-open folder-icon';
    folderSection.classList.add('expanded');
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication status first
  checkAuthStatus();
  
  // Add event listener for theme toggle button
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Initialize executive password modal
  initExecutivePasswordModal();
});

// Check authentication status
function checkAuthStatus() {
  const user = getCurrentUser();
  if (user) {
    // User is authenticated, show main content
    showMainContent();
    loadData();
    initTheme();
    initQuickResources();
  } else {
    // User is not authenticated, show login
    showLoginPage();
  }
}

// Handle logout
function handleLogout() {
  signOut()
    .then(() => {
      console.log('Logged out successfully');
      // Reset executive folder lock on logout
      isExecutiveFolderUnlocked = false;
      showLoginPage();
    })
    .catch((error) => {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    });
}

// Executive folder password protection functions
function showExecutivePasswordModal() {
  const modal = document.getElementById('executivePasswordModal');
  const passwordInput = document.getElementById('executivePassword');
  const errorDiv = document.getElementById('executivePasswordError');
  
  // Clear previous state
  passwordInput.value = '';
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';
  
  // Show modal
  modal.style.display = 'block';
  
  // Focus on password input
  setTimeout(() => passwordInput.focus(), 100);
}

function hideExecutivePasswordModal() {
  const modal = document.getElementById('executivePasswordModal');
  modal.style.display = 'none';
}

function validateExecutivePassword(password) {
  return password === EXECUTIVE_PASSWORD;
}

function unlockExecutiveFolder() {
  isExecutiveFolderUnlocked = true;
  hideExecutivePasswordModal();
  
  // Re-render the links to update the folder appearance
  renderLinks();
  
  // Auto-expand the Executives folder
  const executivesFolder = document.querySelector('[data-folder="Executives"]');
  if (executivesFolder) {
    toggleFolder(executivesFolder);
  }
}

function showExecutivePasswordError(message) {
  const errorDiv = document.getElementById('executivePasswordError');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

// Initialize executive password modal event listeners
function initExecutivePasswordModal() {
  const modal = document.getElementById('executivePasswordModal');
  const form = document.getElementById('executivePasswordForm');
  const cancelBtn = document.getElementById('cancelExecutiveAccess');
  const closeBtn = modal.querySelector('.close');
  
  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('executivePassword').value;
    
    if (validateExecutivePassword(password)) {
      unlockExecutiveFolder();
    } else {
      showExecutivePasswordError('Incorrect password. Please try again.');
    }
  });
  
  // Handle cancel button
  cancelBtn.addEventListener('click', hideExecutivePasswordModal);
  
  // Handle close button
  closeBtn.addEventListener('click', hideExecutivePasswordModal);
  
  // Handle clicking outside modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideExecutivePasswordModal();
    }
  });
  
  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      hideExecutivePasswordModal();
    }
  });
}

// Global data
let linksV2 = { folders: {} };
let profileData = {};

// Theme management
let isDarkMode = false;

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

// Load profile data into DOM
function loadProfileData() {
  document.getElementById("profile-name").textContent = profileData.name;
  document.getElementById("profile-bio").textContent = profileData.bio;
  const img = document.getElementById("profile-pic");
  img.src = profileData.image;
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
    const folderSection = document.createElement("div");
    folderSection.className = "folder-section";
    folderSection.setAttribute("data-folder", folderName);

    const folderHeader = document.createElement("div");
    folderHeader.className = "folder-header";
    folderHeader.innerHTML = `
      <div class="folder-info">
        <i class="fas fa-folder folder-icon"></i>
        <h3 class="folder-title">${folderName}</h3>
        <span class="folder-count">${linksV2.folders[folderName].length} items</span>
      </div>
      <i class="fas fa-chevron-down folder-toggle"></i>
    `;

    const folderContent = document.createElement("div");
    folderContent.className = "folder-content";
    folderContent.style.display = "none"; // Start collapsed

    const linksList = document.createElement("div");
    linksList.className = "folder-links";
    
    linksV2.folders[folderName].forEach((link) => {
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
      linksList.appendChild(item);
    });

    folderContent.appendChild(linksList);
    folderSection.appendChild(folderHeader);
    folderSection.appendChild(folderContent);
    container.appendChild(folderSection);

    // Add click event to toggle folder
    folderHeader.addEventListener('click', () => {
      toggleFolder(folderSection);
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
  loadData();
  initTheme();
  
  // Add event listener for theme toggle button
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
});

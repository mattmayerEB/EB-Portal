// Global data
let linksV2 = { folders: {} };
let profileData = {};

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
  // On static hosting (GitHub Pages, Netlify, etc.), you can’t write back to data.json.
  // For real persistence when editing via the UI, you’d need a backend.
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

// Render links
function renderLinks() {
  const container = document.getElementById("links-container");
  container.innerHTML = "";
  Object.keys(linksV2.folders).forEach((folderName) => {
    const section = document.createElement("div");
    section.className = "folder-section";

    const header = document.createElement("h3");
    header.className = "folder-title";
    header.textContent = folderName;
    section.appendChild(header);

    const list = document.createElement("div");
    list.className = "folder-links";
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
      list.appendChild(item);
    });

    section.appendChild(list);
    container.appendChild(section);
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

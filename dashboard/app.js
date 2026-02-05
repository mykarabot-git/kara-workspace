// KARA Dashboard - App Logic
// Auto-refreshes from data.json

let dashboardData = null;
let currentView = 'projects';
let currentFilter = 'all';
let searchQuery = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  
  // Auto-refresh every 30 seconds
  setInterval(loadData, 30000);
});

// Load data from JSON
async function loadData() {
  try {
    const response = await fetch('data.json?t=' + Date.now());
    dashboardData = await response.json();
    render();
    
    // Update system status indicator
    const statusText = document.getElementById('system-status');
    if (statusText) statusText.textContent = "Online";
    const dot = document.querySelector('.status-dot');
    if (dot) {
      dot.style.background = 'var(--accent-green)';
      dot.style.boxShadow = '0 0 8px var(--accent-green)';
    }

  } catch (error) {
    console.error('Failed to load data:', error);
    const statusText = document.getElementById('system-status');
    if (statusText) statusText.textContent = "Offline";
    const dot = document.querySelector('.status-dot');
    if (dot) {
      dot.style.background = 'var(--accent-orange)';
      dot.style.boxShadow = 'none';
    }
    
    showToast('Connection lost', 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active nav state
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Switch view
      const viewId = btn.dataset.view;
      switchView(viewId);
    });
  });

  // Search
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderProjects();
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProjects();
    });
  });

  // Refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.style.transform = 'rotate(180deg)';
      setTimeout(() => refreshBtn.style.transform = 'none', 500);
      loadData();
      showToast('Refreshing data...');
    });
  }
  
  // Close Modal
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('project-modal').classList.remove('active');
    });
  }

  // Close on outside click
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

// Switch main view
function switchView(viewName) {
  currentView = viewName;
  
  // Hide all views
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  
  // Show target view
  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    
    // Update header title based on view
    const titles = {
      projects: "Project Command Center",
      content: "Content Gallery",
      social: "Social Media HQ",
      system: "System Diagnostics"
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titles[viewName] || "Dashboard";
    
    if (viewName === 'system') renderSystem();
    if (viewName === 'content') renderContent();
  }
}

// Main render function
function render() {
  if (!dashboardData) return;

  if (currentView === 'projects') {
    renderStats();
    renderProjects();
    renderActivity();
  } else if (currentView === 'system') {
    renderSystem();
  } else if (currentView === 'content') {
    renderContent();
  }
}

// Render top stats
function renderStats() {
  if (!dashboardData.stats) return;
  const stats = dashboardData.stats;
  
  const activeCount = document.getElementById('active-count');
  if (activeCount) activeCount.textContent = stats.active;
  
  // Count total open tasks
  const totalTasks = dashboardData.projects.reduce((sum, p) => 
    sum + (p.tasks ? p.tasks.filter(t => !t.done).length : 0), 0);
  
  const tasksCount = document.getElementById('tasks-count');
  if (tasksCount) tasksCount.textContent = totalTasks;
  
  // Next drop (placeholder logic for now)
  const nextDrop = document.getElementById('next-drop');
  if (nextDrop) nextDrop.textContent = "Feb 10"; 
}

// Render projects list
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  
  let filtered = dashboardData.projects.filter(p => {
    // Filter by status
    if (currentFilter === 'active' && (p.status === 'paused')) return false;
    if (currentFilter === 'paused' && (p.status !== 'paused')) return false;
    
    // Filter by search
    if (searchQuery) {
      const searchable = (p.name + ' ' + p.description + ' ' + (p.nextAction || '')).toLowerCase();
      if (!searchable.includes(searchQuery)) return false;
    }
    
    return true;
  });

  // Sort: active first, then by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const statusOrder = { active: 0, planning: 1, paused: 2 };
  
  filtered.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  grid.innerHTML = filtered.map(project => createProjectCard(project)).join('');
}

// Create project card HTML
function createProjectCard(project) {
  const isPaused = project.status === 'paused';
  const statusClass = project.status;
  const priorityClass = project.priority;

  const openTasks = project.tasks ? project.tasks.filter(t => !t.done) : [];
  
  // Generate task list HTML (limit to 3)
  const taskListHtml = openTasks.slice(0, 3).map(task => `
    <div class="task-item">
      <span class="task-checkbox">○</span>
      <span class="task-text">${task.text}</span>
    </div>
  `).join('');

  // Added onclick handler attached to window function
  return `
    <article class="project-card ${isPaused ? 'paused' : ''}" onclick="window.openProjectModal('${project.id}')">
      <div class="card-header">
        <span class="status-badge ${statusClass}">${capitalize(project.status)}</span>
        ${!isPaused ? `<span class="priority-badge ${priorityClass}">${capitalize(project.priority)}</span>` : ''}
      </div>
      
      <h3 class="project-title">${project.name}</h3>
      <p class="project-desc">${project.description}</p>
      
      ${project.nextAction ? `
        <div class="project-meta">
          <div class="meta-item next-action">
            <span class="meta-icon">🎯</span>
            <span>${project.nextAction}</span>
          </div>
        </div>
      ` : ''}
      
      ${!isPaused && openTasks.length > 0 ? `
        <div class="task-list">
          ${taskListHtml}
          ${openTasks.length > 3 ? `<div class="task-item"><span class="task-text" style="color:var(--text-muted)">+ ${openTasks.length - 3} more...</span></div>` : ''}
        </div>
      ` : ''}
    </article>
  `;
}

// Render activity feed
function renderActivity() {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;
  
  if (!dashboardData.activity) return;

  feed.innerHTML = dashboardData.activity.map(item => `
    <div class="activity-item">
      <div class="activity-icon">${item.icon}</div>
      <div class="activity-details">
        <div class="activity-content">${item.text}</div>
        <div class="activity-date">${item.date}</div>
      </div>
    </div>
  `).join('');
}

// Render System Stats
function renderSystem() {
  const systemView = document.getElementById('view-system');
  if (!systemView) return;

  if (!dashboardData.system) {
    systemView.innerHTML = '<div class="empty-state"><span class="empty-icon">⏳</span><h3>Waiting for system data...</h3><p>Run dashboard/update-data.js to populate.</p></div>';
    return;
  }

  const sys = dashboardData.system;
  
  systemView.innerHTML = `
    <div class="stats-bar">
      <div class="stat-card">
        <span class="stat-value">${sys.uptime || '-'}</span>
        <span class="stat-label">Uptime</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${sys.cpu || '-'}</span>
        <span class="stat-label">CPU Model</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${sys.platform || '-'}</span>
        <span class="stat-label">OS</span>
      </div>
    </div>

    <div class="content-grid">
      <section class="projects-section">
        <div class="section-header">
          <h2>Resources</h2>
        </div>
        <div class="project-card">
          <h3 class="project-title">Memory Usage</h3>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${sys.memory.percent}%"></div>
            </div>
            <span class="progress-label">${sys.memory.used} / ${sys.memory.total} (${sys.memory.percent}%)</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

// Render Content Gallery
function renderContent() {
  const grid = document.getElementById('content-grid');
  if (!grid) return;

  const contentItems = [
    { type: 'video', src: '../content/video-gamma.mp4', title: 'Stop Making Slides Manually' },
    { type: 'image', src: '../content/post-001-chatgpt.jpg', title: 'ChatGPT Tips' }
  ];

  grid.innerHTML = contentItems.map(item => `
    <article class="project-card">
      <h3 class="project-title">${item.title}</h3>
      <div style="margin-top:1rem; border-radius:8px; overflow:hidden; border:1px solid var(--border);">
        ${item.type === 'video' 
          ? `<video src="${item.src}" controls style="width:100%; display:block; background:#000;"></video>`
          : `<img src="${item.src}" style="width:100%; display:block;">`
        }
      </div>
      <div style="margin-top:1rem; display:flex; justify-content:flex-end;">
        <a href="${item.src}" download target="_blank" class="filter-btn active" style="text-decoration:none;">⬇️ Download</a>
      </div>
    </article>
  `).join('');
}

// Helper: Capitalize
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 2000);
}

// Modal Logic - Exposed Global
window.openProjectModal = function(projectId) {
  const project = dashboardData.projects.find(p => p.id === projectId);
  if (!project) return;

  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = project.name;
  
  // Render Tasks
  const tasksContainer = document.getElementById('modal-tasks');
  if (tasksContainer) {
    tasksContainer.innerHTML = (project.tasks || []).map(task => `
      <div class="task-item ${task.done ? 'done' : ''}">
        <span class="task-checkbox">${task.done ? '✓' : '○'}</span>
        <span class="task-text">${task.text}</span>
      </div>
    `).join('') || '<p class="text-muted" style="color:var(--text-muted)">No tasks yet.</p>';
  }

  // Render Ideas
  const ideasContainer = document.getElementById('modal-ideas');
  if (ideasContainer) {
    ideasContainer.innerHTML = (project.ideas || []).map(idea => `
      <li>${idea}</li>
    `).join('') || '<p class="text-muted" style="color:var(--text-muted)">No ideas logged.</p>';
  }

  // Render History
  const historyContainer = document.getElementById('modal-history');
  if (historyContainer) {
    historyContainer.innerHTML = (project.history || []).map(h => `
      <div class="history-item">
        <div class="history-date">${h.date}</div>
        <div class="history-text">${h.text}</div>
      </div>
    `).join('') || '<p class="text-muted" style="color:var(--text-muted)">No history yet.</p>';
  }

  // Show Modal
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.add('active');
};

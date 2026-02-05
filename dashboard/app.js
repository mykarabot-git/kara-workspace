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
    document.querySelector('.status-dot').style.background = 'var(--accent-green)';
    document.querySelector('.status-dot').style.boxShadow = '0 0 8px var(--accent-green)';

  } catch (error) {
    console.error('Failed to load data:', error);
    const statusText = document.getElementById('system-status');
    if (statusText) statusText.textContent = "Offline";
    document.querySelector('.status-dot').style.background = 'var(--accent-orange)';
    document.querySelector('.status-dot').style.boxShadow = 'none';
    
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
  document.getElementById('search').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderProjects();
  });

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
  document.getElementById('refresh-btn').addEventListener('click', () => {
    const btn = document.getElementById('refresh-btn');
    btn.style.transform = 'rotate(180deg)';
    setTimeout(() => btn.style.transform = 'none', 500);
    loadData();
    showToast('Refreshing data...');
  });
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
      social: "Social Media HQ",
      system: "System Diagnostics"
    };
    document.getElementById('page-title').textContent = titles[viewName] || "Dashboard";
  }
}

// Main render function
function render() {
  if (!dashboardData) return;

  if (currentView === 'projects') {
    renderStats();
    renderProjects();
    renderActivity();
  }
  
  // Future: renderSocial() and renderSystem()
}

// Render top stats
function renderStats() {
  const stats = dashboardData.stats;
  document.getElementById('active-count').textContent = stats.active;
  
  // Count total open tasks
  const totalTasks = dashboardData.projects.reduce((sum, p) => 
    sum + (p.tasks ? p.tasks.filter(t => !t.done).length : 0), 0);
  document.getElementById('tasks-count').textContent = totalTasks;
  
  // Next drop (placeholder logic for now)
  document.getElementById('next-drop').textContent = "Feb 10"; 
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

  return `
    <article class="project-card ${isPaused ? 'paused' : ''}">
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

// Helper: Capitalize
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 2000);
}

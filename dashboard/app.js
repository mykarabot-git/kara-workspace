// KARA Dashboard - App Logic
// Auto-refreshes from data.json

let projectsData = null;
let showTasks = false;
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
    projectsData = await response.json();
    render();
    showToast('Dashboard updated');
  } catch (error) {
    console.error('Failed to load data:', error);
    showToast('Failed to refresh', 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
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
    loadData();
  });

  // Toggle tasks button
  document.getElementById('toggle-tasks-btn').addEventListener('click', () => {
    showTasks = !showTasks;
    document.getElementById('toggle-tasks-btn').querySelector('span:last-child').textContent = 
      showTasks ? 'Hide Tasks' : 'Show Tasks';
    renderProjects();
  });
}

// Main render function
function render() {
  renderStats();
  renderProjects();
  renderActivity();
  updateRefreshStatus();
}

// Render stats
function renderStats() {
  const stats = projectsData.stats;
  document.getElementById('active-count').textContent = stats.active;
  document.getElementById('paused-count').textContent = stats.paused;
  
  // Count total open tasks
  const totalTasks = projectsData.projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => !t.done).length, 0);
  document.getElementById('tasks-count').textContent = totalTasks;
}

// Render projects
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  
  let filtered = projectsData.projects.filter(p => {
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

  document.getElementById('visible-count').textContent = `(${filtered.length})`;

  grid.innerHTML = filtered.map(project => createProjectCard(project)).join('');
}

// Create project card HTML
function createProjectCard(project) {
  const isPaused = project.status === 'paused';
  const statusClass = project.status === 'planning' ? 'planning' : 
                      project.status === 'paused' ? 'paused' : 'active';
  
  const priorityClass = project.priority === 'high' ? '' : 
                        project.priority === 'medium' ? 'medium' : 'low';

  const openTasks = project.tasks.filter(t => !t.done);
  const completedTasks = project.tasks.filter(t => t.done);

  let tasksHtml = '';
  if (showTasks && project.tasks.length > 0) {
    tasksHtml = `
      <div class="task-list">
        <div class="task-header">
          <span>Tasks</span>
          <span class="task-count">${completedTasks.length}/${project.tasks.length}</span>
        </div>
        ${project.tasks.map(task => `
          <div class="task-item ${task.done ? 'done' : ''}">
            <span class="task-checkbox">${task.done ? '✓' : '○'}</span>
            <span class="task-text">${task.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  let linksHtml = '';
  if (project.links.length > 0) {
    linksHtml = project.links.map(link => `
      <div class="meta-item">
        <span class="meta-icon">🔗</span>
        <a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>
      </div>
    `).join('');
  }

  return `
    <article class="project-card ${isPaused ? 'paused' : ''}" data-id="${project.id}">
      <div class="card-header">
        <span class="status-badge ${statusClass}">${capitalize(project.status)}</span>
        ${!isPaused ? `<span class="priority-badge ${priorityClass}">${capitalize(project.priority)}</span>` : ''}
        ${openTasks.length > 0 ? `<span class="task-badge">${openTasks.length} task${openTasks.length > 1 ? 's' : ''}</span>` : ''}
      </div>
      
      <h3 class="project-title">${project.name}</h3>
      <p class="project-desc">${project.description}</p>
      
      ${project.nextAction ? `
        <div class="project-meta">
          <div class="meta-item next-action">
            <span class="meta-icon">🎯</span>
            <span>${project.nextAction}</span>
          </div>
          ${linksHtml}
        </div>
      ` : ''}
      
      ${project.waitingOn ? `
        <div class="waiting-on">
          <span class="waiting-icon">⏳</span>
          <span>Waiting on: ${project.waitingOn}</span>
        </div>
      ` : ''}
      
      ${!isPaused ? `
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%"></div>
          </div>
          <span class="progress-label">${project.progress}% complete</span>
        </div>
      ` : ''}
      
      ${tasksHtml}
    </article>
  `;
}

// Render activity feed
function renderActivity() {
  const feed = document.getElementById('activity-feed');
  
  feed.innerHTML = projectsData.activity.map(item => `
    <div class="activity-item">
      <div class="activity-date">${formatDate(item.date)}</div>
      <div class="activity-content">
        <span class="activity-icon">${item.icon}</span>
        <span>${item.text}</span>
      </div>
    </div>
  `).join('');
}

// Update refresh status
function updateRefreshStatus() {
  const lastUpdated = new Date(projectsData.lastUpdated);
  document.getElementById('last-updated').textContent = 
    `Last updated: ${lastUpdated.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  
  document.getElementById('refresh-status').textContent = 
    `Updated ${getTimeAgo(new Date())}`;
}

// Helper: Capitalize
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper: Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper: Time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + K to focus search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('search').focus();
  }
  
  // Escape to clear search
  if (e.key === 'Escape') {
    document.getElementById('search').value = '';
    searchQuery = '';
    renderProjects();
  }
  
  // R to refresh
  if (e.key === 'r' && !e.metaKey && !e.ctrlKey && document.activeElement.tagName !== 'INPUT') {
    loadData();
  }
});

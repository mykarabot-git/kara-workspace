// Modal Logic
function openProjectModal(projectId) {
  const project = dashboardData.projects.find(p => p.id === projectId);
  if (!project) return;

  document.getElementById('modal-title').textContent = project.name;
  
  // Render Tasks
  const tasksContainer = document.getElementById('modal-tasks');
  tasksContainer.innerHTML = (project.tasks || []).map(task => `
    <div class="task-item ${task.done ? 'done' : ''}">
      <span class="task-checkbox">${task.done ? '✓' : '○'}</span>
      <span class="task-text">${task.text}</span>
    </div>
  `).join('') || '<p class="text-muted">No tasks yet.</p>';

  // Render Ideas
  const ideasContainer = document.getElementById('modal-ideas');
  ideasContainer.innerHTML = (project.ideas || []).map(idea => `
    <li>${idea}</li>
  `).join('') || '<p class="text-muted">No ideas logged.</p>';

  // Render History
  const historyContainer = document.getElementById('modal-history');
  historyContainer.innerHTML = (project.history || []).map(h => `
    <div class="history-item">
      <div class="history-date">${h.date}</div>
      <div class="history-text">${h.text}</div>
    </div>
  `).join('') || '<p class="text-muted">No history yet.</p>';

  // Show Modal
  const modal = document.getElementById('project-modal');
  modal.classList.add('active');
}

// Close Modal
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('project-modal').classList.remove('active');
});

// Close on outside click
document.getElementById('project-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('project-modal')) {
    document.getElementById('project-modal').classList.remove('active');
  }
});

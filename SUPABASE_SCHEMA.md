# Supabase Database Schema

## Tables

### 1. kanban_tasks
Real kanban board with full functionality.

```sql
CREATE TABLE kanban_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'done', 'archived')) DEFAULT 'todo',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assignee TEXT, -- email or name
  tags TEXT[], -- array of tags like ['NEXUS', 'CONTENT', 'SYSTEM']
  source TEXT, -- 'manual', 'shift_approve', 'agent'
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  archived_at TIMESTAMP -- null = not archived
);

-- Enable RLS
ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON kanban_tasks FOR ALL TO authenticated USING (true);
```

### 2. shift_outputs
Historical record of all shift runs.

```sql
CREATE TABLE shift_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_name TEXT NOT NULL, -- 'shift_1', 'shift_2', 'morning_brief'
  run_at TIMESTAMP DEFAULT now(),
  status TEXT CHECK (status IN ('pending_review', 'approved', 'rejected', 'partial')) DEFAULT 'pending_review',
  summary TEXT, -- AI-generated summary of the shift
  outputs JSONB, -- Array of output objects with file paths, types, previews
  metrics JSONB, -- {tokens_used, cost, duration, model}
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  notes TEXT, -- user notes on the shift
  archived BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE shift_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON shift_outputs FOR ALL TO authenticated USING (true);
```

### 3. blog_posts
Proposed → Approved → Published workflow.

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE, -- URL-friendly title
  status TEXT CHECK (status IN ('proposed', 'writing', 'review', 'approved', 'published', 'rejected')) DEFAULT 'proposed',
  outline TEXT, -- AI-generated outline
  draft_content TEXT, -- Full draft when written
  tags TEXT[],
  seo_keywords TEXT[],
  proposed_by TEXT, -- 'shift_1_agent', 'shift_2_agent', 'kara', 'melody'
  proposed_at TIMESTAMP DEFAULT now(),
  assigned_to UUID REFERENCES auth.users(id), -- who should write it
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  notes TEXT, -- reviewer feedback
  published_url TEXT, -- final URL after publish
  published_at TIMESTAMP
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON blog_posts FOR ALL TO authenticated USING (true);
```

### 4. agent_logs
Activity logs from autonomous agents.

```sql
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL, -- 'kara', 'shift_1_agent', 'shift_2_agent'
  log_type TEXT CHECK (log_type IN ('thought', 'action', 'error', 'milestone', 'user_interaction')),
  message TEXT NOT NULL,
  context JSONB, -- {task_id, shift_id, related_files}
  session_id TEXT, -- for grouping logs from same session
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON agent_logs FOR ALL TO authenticated USING (true);
```

### 5. dashboard_activity
Real-time activity feed.

```sql
CREATE TABLE dashboard_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT CHECK (activity_type IN ('shift_complete', 'task_created', 'blog_proposed', 'blog_published', 'agent_log', 'user_login')),
  title TEXT NOT NULL,
  description TEXT,
  related_id UUID, -- links to shift_outputs.id, kanban_tasks.id, etc.
  related_type TEXT, -- 'shift', 'task', 'blog', 'log'
  user_email TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE dashboard_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON dashboard_activity FOR ALL TO authenticated USING (true);
```

## Indexes

```sql
-- For filtering/sorting
CREATE INDEX idx_tasks_status ON kanban_tasks(status) WHERE archived_at IS NULL;
CREATE INDEX idx_tasks_assignee ON kanban_tasks(assignee);
CREATE INDEX idx_shifts_run_at ON shift_outputs(run_at DESC);
CREATE INDEX idx_shifts_status ON shift_outputs(status);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_logs_agent ON agent_logs(agent_name, created_at DESC);
CREATE INDEX idx_activity_created ON dashboard_activity(created_at DESC);
```

## Real-time Subscriptions

Enable real-time for all tables in Supabase Dashboard → Database → Replication.

## Client Usage

```javascript
// Fetch kanban tasks
const { data: tasks } = await _supabase
  .from('kanban_tasks')
  .select('*')
  .eq('status', 'todo')
  .is('archived_at', null)
  .order('created_at', { ascending: false });

// Create task from approved shift item
const { data: task } = await _supabase
  .from('kanban_tasks')
  .insert({
    title: 'Implement smart-snapshot.js',
    description: 'From Shift 2 approval',
    source: 'shift_approve',
    status: 'todo',
    tags: ['CODE', 'SHIFT_2']
  });

// Subscribe to real-time updates
_supabase
  .channel('kanban_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'kanban_tasks' }, payload => {
    console.log('Task changed:', payload);
  })
  .subscribe();
```

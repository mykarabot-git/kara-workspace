# Kanban Skill

Control the KARA Command Kanban board (MyKaraBot.info).

## Tools

### `kanban`
Manage tasks on the board.

**Parameters:**
- `action`: "list", "add", "update", "delete"
- `task`: Object containing task details (for add/update)
  - `id`: Task ID (required for update/delete)
  - `title`: Task title
  - `status`: "todo", "inprogress", "done"
  - `tag`: "NEXUS", "CONTENT", "SYSTEM", etc.
  - `assignee`: "KARA" or "Melody"
  - `notes`: Description text

## Usage
- List tasks: `kanban(action="list")`
- Add task: `kanban(action="add", task={title="Build feature X", tag="DEV"})`
- Move task: `kanban(action="update", task={id="t123", status="done"})`

import { useState, useEffect } from 'react';
import { Icon } from './components/Icon';
import { TaskCard } from './components/TaskCard';
import type { Task } from './components/TaskCard';

const initialSampleTasks: Task[] = [
  {
    id: 'sample-1',
    title: 'Design clean and minimalist dashboard layout',
    category: 'work',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    important: true,
    createdAt: Date.now() - 3600000 * 4,
    notes: 'Create custom layout variables and CSS tokens.\n\nKey focuses:\n- Beautiful dark backdrop\n- Fine thin borders\n- Sleek list headers\n- Fast loading typography',
  },
  {
    id: 'sample-2',
    title: 'Double-click directly on any task to edit inline',
    category: 'life',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    important: true,
    createdAt: Date.now() - 3600000 * 2,
    notes: 'Double-click changes the task card title into a text input. Press Enter to save, or Escape to cancel.',
  },
  {
    id: 'sample-3',
    title: 'Plan upcoming weekly focus objectives',
    category: 'work',
    priority: 'low',
    dueDate: '',
    completed: false,
    important: false,
    createdAt: Date.now() - 3600000,
    notes: 'List core project deadlines:\n1. Refactor dashboard styles\n2. Add slide-over detail panels\n3. Review checklist progress with Enzo',
  },
  {
    id: 'sample-4',
    title: 'Buy premium roasted coffee beans',
    category: 'personal',
    priority: 'low',
    dueDate: '',
    completed: false,
    important: false,
    createdAt: Date.now(),
    notes: 'Look for Ethiopian or Colombian medium roast single-origin beans.',
  },
];

type FilterType = 'all' | 'today' | 'upcoming' | 'important' | 'completed' | 'work' | 'personal' | 'life' | 'other';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('aetheria_tasks');
    return stored ? JSON.parse(stored) : initialSampleTasks;
  });

  const [filterTab, setFilterTab] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'work' | 'personal' | 'life' | 'other'>('work');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    localStorage.setItem('aetheria_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hrs = currentTime.getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingIcon = (): 'sun' | 'moon' | 'sparkles' => {
    const hrs = currentTime.getHours();
    if (hrs >= 6 && hrs < 18) return 'sun';
    return 'moon';
  };

  const getFormattedDate = () => {
    return currentTime.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFormattedTime = () => {
    return currentTime.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      completed: false,
      important: false,
      createdAt: Date.now(),
      notes: '',
    };

    setTasks((prev) => [newTask, ...prev]);

    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskCategory('work');
    setNewTaskPriority('medium');
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleImportant = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, important: !t.important } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    switch (filterTab) {
      case 'today': {
        if (!task.dueDate) return false;
        const todayStr = new Date().toISOString().split('T')[0];
        return task.dueDate === todayStr;
      }
      case 'upcoming': {
        if (!task.dueDate || task.completed) return false;
        const todayStr = new Date().toISOString().split('T')[0];
        return task.dueDate > todayStr;
      }
      case 'important':
        return task.important;
      case 'completed':
        return task.completed;
      case 'work':
      case 'personal':
      case 'life':
      case 'other':
        return task.category === filterTab;
      default:
        return true;
    }
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const radius = 18;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  return (
    <>
      <div className="ambient-container" aria-hidden="true">
        <div className="glow-blob blob-1" />
      </div>

      <div className="dashboard-frame">
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">
            <Icon name="sparkles" size={22} variant="outline" style={{ color: '#818cf8' }} />
            <span>AETHERIA FOCUS</span>
          </div>

          <div className="sidebar-clock-widget">
            <div className="clock-time">{getFormattedTime()}</div>
            <div className="clock-date">
              <Icon name="calendar" size={12} variant="outline" />
              {getFormattedDate()}
            </div>
          </div>

          <nav className="sidebar-nav">
            <span className="sidebar-section-title">Navigation</span>
            <ul className="sidebar-menu-list">
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterTab('all')}
                >
                  <Icon name="list" size={16} variant="outline" />
                  <span>All Objectives</span>
                  <span className="menu-count-badge">{tasks.length}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'today' ? 'active' : ''}`}
                  onClick={() => setFilterTab('today')}
                >
                  <Icon name="clock" size={16} variant="outline" />
                  <span>Today</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setFilterTab('upcoming')}
                >
                  <Icon name="calendar" size={16} variant="outline" />
                  <span>Upcoming</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.dueDate && t.dueDate > new Date().toISOString().split('T')[0] && !t.completed).length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'important' ? 'active' : ''}`}
                  onClick={() => setFilterTab('important')}
                >
                  <Icon name="star" size={16} variant="outline" />
                  <span>Starred</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.important).length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilterTab('completed')}
                >
                  <Icon name="check-circle" size={16} variant="outline" />
                  <span>Completed</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.completed).length}
                  </span>
                </button>
              </li>
            </ul>

            <span className="sidebar-section-title" style={{ marginTop: '20px' }}>Categories</span>
            <ul className="sidebar-menu-list">
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'work' ? 'active' : ''}`}
                  onClick={() => setFilterTab('work')}
                >
                  <Icon name="briefcase" size={16} variant="outline" />
                  <span>Work</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.category === 'work').length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setFilterTab('personal')}
                >
                  <Icon name="user" size={16} variant="outline" />
                  <span>Personal</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.category === 'personal').length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'life' ? 'active' : ''}`}
                  onClick={() => setFilterTab('life')}
                >
                  <Icon name="coffee" size={16} variant="outline" />
                  <span>Life & Health</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.category === 'life').length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-menu-btn ${filterTab === 'other' ? 'active' : ''}`}
                  onClick={() => setFilterTab('other')}
                >
                  <Icon name="list" size={16} variant="outline" />
                  <span>Other / Misc</span>
                  <span className="menu-count-badge">
                    {tasks.filter(t => t.category === 'other').length}
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="sidebar-stats-widget">
            <div className="sidebar-stats-header">
              <Icon name="sparkles" size={14} variant="outline" style={{ color: '#818cf8' }} />
              <span>Completion Ratio</span>
            </div>
            <div className="sidebar-stats-body">
              <svg width="40" height="40" className="progress-ring">
                <circle
                  r={radius}
                  cx="20"
                  cy="20"
                  strokeWidth={strokeWidth}
                  className="progress-ring-circle-bg"
                />
                <circle
                  r={radius}
                  cx="20"
                  cy="20"
                  strokeWidth={strokeWidth}
                  className="progress-ring-circle"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  stroke="url(#progress-gradient)"
                />
              </svg>
              <div className="sidebar-stats-text">
                <div className="sidebar-stats-percent">{completionPercentage}%</div>
                <div className="sidebar-stats-fraction">{completedCount} of {totalCount} done</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="dashboard-main-panel">
          <header className="dashboard-main-header">
            <div className="header-greeting-area">
              <Icon name={getGreetingIcon()} size={20} variant="outline" style={{ color: '#818cf8' }} />
              <h2>{getGreeting()}, Enzo</h2>
            </div>

            <div className="header-search-box">
              <Icon name="search" size={14} variant="outline" style={{ color: '#475569' }} />
              <input
                type="text"
                className="header-search-input"
                placeholder="Search objectives and tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search objectives"
              />
            </div>
          </header>

          <div className="main-breadcrumb-row">
            <Icon name="list" size={12} variant="outline" style={{ color: '#64748b' }} />
            <span>Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current-tab">{filterTab}</span>
          </div>

          <div className="dashboard-split-content-container">
            <div className="dashboard-list-column">
              <form className="add-task-form-horizontal" onSubmit={handleAddTask}>
                <div className="horizontal-form-row">
                  <Icon name="edit" size={16} variant="outline" className="form-row-prefix-icon" />
                  <input
                    type="text"
                    className="input-field-task-horizontal"
                    placeholder="Declare a new objective..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    aria-label="New task title"
                    required
                  />
                  <button
                    type="submit"
                    className="btn-submit-horizontal"
                    aria-label="Add task to list"
                    title="Create Task"
                  >
                    <Icon name="plus" size={16} variant="outline" />
                    <span>Create</span>
                  </button>
                </div>

                <div className="horizontal-form-details">
                  <div className="horizontal-badge-selector" title="Select Category">
                    <Icon
                      name={
                        newTaskCategory === 'work'
                          ? 'briefcase'
                          : newTaskCategory === 'personal'
                          ? 'user'
                          : newTaskCategory === 'life'
                          ? 'coffee'
                          : 'list'
                      }
                      size={12}
                      variant="outline"
                    />
                    <span>Category: {newTaskCategory}</span>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as any)}
                      aria-label="Select Category"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="life">Life / Health</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="horizontal-badge-selector" title="Select Priority">
                    <Icon name="sparkles" size={12} variant="outline" />
                    <span>Priority: {newTaskPriority}</span>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      aria-label="Select Priority"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="horizontal-badge-selector" title="Set Due Date">
                    <Icon name="calendar" size={12} variant="outline" />
                    <span>Due Date: {newTaskDueDate ? newTaskDueDate : 'None'}</span>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      aria-label="Set due date"
                    />
                  </div>
                </div>
              </form>

              <div className="tasks-list-header-row">
                <h3>Objectives</h3>
                <span className="tasks-list-badge">{filteredTasks.length} total</span>
              </div>

              <section className="tasks-container-detailed" aria-label="Task List">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      iconStyle="outline"
                      onToggleComplete={handleToggleComplete}
                      onToggleImportant={handleToggleImportant}
                      onDelete={handleDeleteTask}
                      onUpdateTitle={handleUpdateTitle}
                      onSelect={(t) => setActiveTaskId(t.id)}
                    />
                  ))
                ) : (
                  <div className="empty-state-panel">
                    <div className="empty-icon" aria-hidden="true">🌌</div>
                    <h3>Serene & Empty</h3>
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                      No active objectives match your selected filters. Create a new task to get started.
                    </p>
                  </div>
                )}
              </section>
            </div>

            <aside className={`task-details-drawer ${activeTask ? 'open' : ''}`}>
              {activeTask && (
                <div className="drawer-inner">
                  <div className="drawer-header">
                    <div className="drawer-header-title">
                      <Icon name="list" size={16} variant="outline" style={{ color: '#818cf8' }} />
                      <h3>Objective Details</h3>
                    </div>
                    <button
                      type="button"
                      className="drawer-close-btn"
                      onClick={() => setActiveTaskId(null)}
                      title="Close Details Panel"
                      aria-label="Close details"
                    >
                      <Icon name="plus" size={16} variant="outline" style={{ transform: 'rotate(45deg)' }} />
                    </button>
                  </div>

                  <div className="drawer-field-group">
                    <label htmlFor="drawer-title-field">Objective Title</label>
                    <input
                      id="drawer-title-field"
                      type="text"
                      className="drawer-title-input"
                      value={activeTask.title}
                      onChange={(e) => handleUpdateTitle(activeTask.id, e.target.value)}
                    />
                  </div>

                  <div className="drawer-attributes-row">
                    <div className="drawer-field-group">
                      <label>Category</label>
                      <div className="drawer-badge-select">
                        <Icon
                          name={
                            activeTask.category === 'work'
                              ? 'briefcase'
                              : activeTask.category === 'personal'
                              ? 'user'
                              : activeTask.category === 'life'
                              ? 'coffee'
                              : 'list'
                          }
                          size={12}
                          variant="outline"
                        />
                        <span>{activeTask.category}</span>
                        <select
                          value={activeTask.category}
                          onChange={(e) => {
                            setTasks((prev) =>
                              prev.map((t) =>
                                t.id === activeTask.id
                                  ? { ...t, category: e.target.value as any }
                                  : t
                              )
                            );
                          }}
                        >
                          <option value="work">Work</option>
                          <option value="personal">Personal</option>
                          <option value="life">Life / Health</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="drawer-field-group">
                      <label>Priority</label>
                      <div className="drawer-badge-select">
                        <Icon name="sparkles" size={12} variant="outline" />
                        <span>{activeTask.priority}</span>
                        <select
                          value={activeTask.priority}
                          onChange={(e) => {
                            setTasks((prev) =>
                              prev.map((t) =>
                                t.id === activeTask.id
                                  ? { ...t, priority: e.target.value as any }
                                  : t
                              )
                            );
                          }}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="drawer-field-group">
                      <label>Due Date</label>
                      <div className="drawer-badge-select">
                        <Icon name="calendar" size={12} variant="outline" />
                        <span>{activeTask.dueDate ? activeTask.dueDate : 'Set Date'}</span>
                        <input
                          type="date"
                          value={activeTask.dueDate}
                          onChange={(e) => {
                            setTasks((prev) =>
                              prev.map((t) =>
                                t.id === activeTask.id
                                  ? { ...t, dueDate: e.target.value }
                                  : t
                              )
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="drawer-field-group notes-field-container">
                    <label htmlFor="drawer-notes-field">Detailed Notes & Tasks</label>
                    <textarea
                      id="drawer-notes-field"
                      className="drawer-notes-textarea"
                      placeholder="Add descriptive bullet points, notes, reference URLs, or checklists for this objective..."
                      value={activeTask.notes || ''}
                      onChange={(e) => {
                        setTasks((prev) =>
                          prev.map((t) =>
                            t.id === activeTask.id ? { ...t, notes: e.target.value } : t
                          )
                        );
                      }}
                    />
                  </div>

                  <div className="drawer-footer-meta">
                    <Icon name="clock" size={12} variant="outline" />
                    <span>Created {new Date(activeTask.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

export default App;

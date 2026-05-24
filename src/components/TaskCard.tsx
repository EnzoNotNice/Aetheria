import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface Task {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'life' | 'other';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  important: boolean;
  createdAt: number;
  notes?: string;
}

interface TaskCardProps {
  task: Task;
  iconStyle: 'outline' | 'solid';
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onSelect: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  iconStyle,
  onToggleComplete,
  onToggleImportant,
  onDelete,
  onUpdateTitle,
  onSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleSubmit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTitle(task.id, trimmed);
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const isOverdue = (() => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  })();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`task-item-card glass-panel-interactive ${task.completed ? 'completed' : ''}`}>
      <div
        className={`checkbox-wrapper ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task.id)}
        role="checkbox"
        aria-checked={task.completed}
        tabIndex={0}
        aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onToggleComplete(task.id);
          }
        }}
      >
        <div className="checkbox-trigger">
          <Icon name="check" size={14} className="check-icon" />
        </div>
      </div>

      <div
        className="task-content-area"
        onClick={() => !isEditing && onSelect(task)}
        style={{ cursor: 'pointer' }}
        title="Click to view details and add notes"
      >
        <div className="task-title-row">
          {isEditing ? (
            <input
              ref={editInputRef}
              type="text"
              className="task-text editing"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              aria-label="Edit task title"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="task-text"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Double click to edit title, single click to open notes"
            >
              {task.title}
            </span>
          )}
        </div>

        <div className="task-badges-row">
          <span className="badge badge-category">
            <Icon
              name={
                task.category === 'work'
                  ? 'briefcase'
                  : task.category === 'personal'
                  ? 'user'
                  : task.category === 'life'
                  ? 'coffee'
                  : 'list'
              }
              size={10}
              variant={iconStyle}
            />
            {task.category}
          </span>

          <span className={`badge badge-priority priority-${task.priority}`}>
            <span className="priority-dot" />
            {task.priority}
          </span>

          {task.dueDate && (
            <span className={`badge badge-date ${isOverdue ? 'overdue' : ''}`}>
              <Icon name="calendar" size={10} variant={iconStyle} />
              {isOverdue ? 'Overdue: ' : ''}
              {formatDate(task.dueDate)}
            </span>
          )}

          {task.notes && task.notes.trim() !== '' && (
            <span className="badge badge-category" style={{ borderColor: 'rgba(129, 140, 248, 0.25)', color: '#818cf8' }}>
              <Icon name="list" size={10} variant={iconStyle} />
              Has Notes
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="task-action-btn"
          title="Edit title"
          aria-label={`Edit task "${task.title}" title`}
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) {
              handleTitleSubmit();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Icon name={isEditing ? 'save' : 'edit'} size={15} variant={iconStyle} />
        </button>

        <button
          type="button"
          className={`task-action-btn btn-favorite ${task.important ? 'active' : ''}`}
          title={task.important ? 'Remove important tag' : 'Mark as important'}
          aria-label={task.important ? `Unstar task "${task.title}"` : `Star task "${task.title}"`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleImportant(task.id);
          }}
        >
          <Icon
            name="star"
            size={16}
            variant={task.important ? 'solid' : iconStyle}
            style={{ color: task.important ? '#fbbf24' : 'inherit' }}
          />
        </button>

        <button
          type="button"
          className="task-action-btn btn-delete"
          title="Delete task"
          aria-label={`Delete task "${task.title}"`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          <Icon name="trash" size={15} variant={iconStyle} />
        </button>
      </div>
    </div>
  );
};

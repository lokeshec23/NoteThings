import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Filter,
  EyeOff,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';

export const ColumnHeaderMenu = ({
  property,
  onRename,
  onSortAsc,
  onSortDesc,
  onFilter,
  onHide,
  onDelete,
  onClose
}) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(property.name);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handleRenameSubmit = () => {
    if (name.trim()) {
      onRename(property.id, name.trim());
    }
    setEditingName(false);
  };

  return (
    <div className="column-header-menu animate-popover" ref={menuRef}>
      {editingName ? (
        <div className="col-rename-box">
          <input
            type="text"
            className="cell-input col-rename-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') setEditingName(false);
            }}
          />
          <button className="header-btn" onClick={handleRenameSubmit}>
            <Check size={12} color="var(--accent-green)" />
          </button>
        </div>
      ) : (
        <button
          className="col-menu-item"
          onClick={() => setEditingName(true)}
        >
          <Edit2 size={13} />
          <span>Rename</span>
        </button>
      )}

      <button className="col-menu-item" onClick={onSortAsc}>
        <ArrowUp size={13} />
        <span>Sort ascending</span>
      </button>

      <button className="col-menu-item" onClick={onSortDesc}>
        <ArrowDown size={13} />
        <span>Sort descending</span>
      </button>

      <button className="col-menu-item" onClick={onFilter}>
        <Filter size={13} />
        <span>Filter by {property.name}</span>
      </button>

      <button className="col-menu-item" onClick={onHide}>
        <EyeOff size={13} />
        <span>Hide in view</span>
      </button>

      {property.id !== 'prop-title' && (
        <>
          <div className="col-menu-divider" />
          <button
            className="col-menu-item col-menu-danger"
            onClick={onDelete}
          >
            <Trash2 size={13} />
            <span>Delete property</span>
          </button>
        </>
      )}
    </div>
  );
};

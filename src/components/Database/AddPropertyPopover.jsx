import React, { useState, useRef, useEffect } from 'react';
import {
  Type,
  Hash,
  ChevronDown,
  Tag,
  CheckCircle2,
  Calendar,
  User,
  CheckSquare,
  Link,
  Mail,
  Phone,
  Sigma,
  Plus,
  X
} from 'lucide-react';

export const PROPERTY_TYPES = [
  { type: 'text', label: 'Text', icon: <Type size={14} />, desc: 'Titles, notes, paragraphs' },
  { type: 'number', label: 'Number', icon: <Hash size={14} />, desc: 'Quantities, currencies, scores' },
  { type: 'select', label: 'Select', icon: <ChevronDown size={14} />, desc: 'Single tag dropdown' },
  { type: 'multi-select', label: 'Multi-select', icon: <Tag size={14} />, desc: 'Multiple tag badges' },
  { type: 'status', label: 'Status', icon: <CheckCircle2 size={14} />, desc: 'Not started, In progress, Done' },
  { type: 'date', label: 'Date', icon: <Calendar size={14} />, desc: 'Deadlines, event dates' },
  { type: 'person', label: 'Person', icon: <User size={14} />, desc: 'Assignees, collaborators' },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={14} />, desc: 'True or false checklist' },
  { type: 'url', label: 'URL', icon: <Link size={14} />, desc: 'Web links, references' },
  { type: 'email', label: 'Email', icon: <Mail size={14} />, desc: 'Contact email addresses' },
  { type: 'phone', label: 'Phone', icon: <Phone size={14} />, desc: 'Phone numbers' },
  { type: 'formula', label: 'Formula', icon: <Sigma size={14} />, desc: 'Calculated expressions' }
];

export const AddPropertyPopover = ({ onAdd, onClose }) => {
  const [propName, setPropName] = useState('');
  const [selectedType] = useState('text');
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handleSubmit = (type = selectedType) => {
    const name = propName.trim() || PROPERTY_TYPES.find((t) => t.type === type)?.label || 'Property';
    onAdd(name, type);
    onClose();
  };

  return (
    <div className="add-property-popover animate-popover" ref={popoverRef}>
      <div className="add-prop-header">
        <input
          type="text"
          className="add-prop-name-input"
          placeholder="Property name (e.g. Estimate, Status)"
          value={propName}
          onChange={(e) => setPropName(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') onClose();
          }}
        />
        <button className="add-prop-close-btn" onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <div className="add-prop-types-list">
        <div className="add-prop-list-title">Type</div>
        {PROPERTY_TYPES.map((pt) => (
          <button
            key={pt.type}
            className={`add-prop-type-item ${selectedType === pt.type ? 'selected' : ''}`}
            onClick={() => handleSubmit(pt.type)}
          >
            <div className="add-prop-icon">{pt.icon}</div>
            <div className="add-prop-text">
              <span className="add-prop-label">{pt.label}</span>
              <span className="add-prop-desc">{pt.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

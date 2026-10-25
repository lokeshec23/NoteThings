import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

export const CALC_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'count_all', label: 'Count all' },
  { id: 'count_values', label: 'Count values' },
  { id: 'count_unique', label: 'Count unique' },
  { id: 'count_empty', label: 'Count empty' },
  { id: 'percent_empty', label: 'Percent empty' },
  { id: 'sum', label: 'Sum' },
  { id: 'average', label: 'Average' },
  { id: 'min', label: 'Min' },
  { id: 'max', label: 'Max' }
];

export const CalculateMenu = ({ currentCalc = 'none', onSelect, onClose }) => {
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

  return (
    <div className="calculate-menu animate-popover" ref={menuRef}>
      <div className="calc-menu-title">Calculate</div>
      {CALC_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          className={`calc-menu-item ${currentCalc === opt.id ? 'active' : ''}`}
          onClick={() => {
            onSelect(opt.id);
            onClose();
          }}
        >
          <span>{opt.label}</span>
          {currentCalc === opt.id && <Check size={12} style={{ marginLeft: 'auto' }} />}
        </button>
      ))}
    </div>
  );
};

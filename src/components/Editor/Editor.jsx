import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { BlockItem } from './BlockItem';
import { CoverPicker } from './CoverPicker';
import { IconPicker } from './IconPicker';
import { DatabaseView } from '../Database/DatabaseView';
import { PRESET_ICONS } from '../../data/initialData';
import { Image, Smile, Clock } from 'lucide-react';
import './Editor.css';

export const Editor = () => {
  const {
    currentPage,
    updatePage,
    addBlock,
    deleteBlock
  } = useWorkspace();

  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [focusedBlockIndex, setFocusedBlockIndex] = useState(null);

  if (!currentPage) return null;

  const handleTitleChange = (e) => {
    const cleanTitle = e.target.value.slice(0, 255);
    updatePage(currentPage.id, { title: cleanTitle });
  };

  const handleEnterBlock = (index) => {
    addBlock(currentPage.id, index, { type: 'text', content: '' });
    setFocusedBlockIndex(index + 1);
  };

  const handleBackspaceBlock = (index, blockId) => {
    deleteBlock(currentPage.id, blockId);
    if (index > 0) {
      setFocusedBlockIndex(index - 1);
    }
  };

  const handleRandomIcon = () => {
    const random = PRESET_ICONS[Math.floor(Math.random() * PRESET_ICONS.length)];
    updatePage(currentPage.id, { icon: random });
  };

  // Format last edited time safely
  const formattedDate = currentPage.updatedAt
    ? new Date(currentPage.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  return (
    <div className="editor-scroll-container">
      {/* Page Cover Banner */}
      {currentPage.cover && (
        <div className="page-cover-container">
          <img src={currentPage.cover} alt="Cover" className="page-cover-image" />
          <div className="cover-actions">
            <button
              className="cover-action-btn"
              onClick={() => setCoverPickerOpen(true)}
            >
              Change cover
            </button>
            <button
              className="cover-action-btn"
              onClick={() => updatePage(currentPage.id, { cover: null })}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {coverPickerOpen && (
        <CoverPicker
          currentCover={currentPage.cover}
          onSelect={(url) => updatePage(currentPage.id, { cover: url })}
          onClose={() => setCoverPickerOpen(false)}
        />
      )}

      {/* Editor Content Canvas */}
      <div className="editor-content-wrapper">
        {/* Hover / Meta Adders for Icon & Cover */}
        <div className="page-header-controls">
          {!currentPage.icon && (
            <button
              className="header-meta-btn"
              onClick={() => updatePage(currentPage.id, { icon: '✨' })}
            >
              <Smile size={14} />
              <span>Add icon</span>
            </button>
          )}

          {!currentPage.cover && (
            <button
              className="header-meta-btn"
              onClick={() => updatePage(currentPage.id, {
                cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80'
              })}
            >
              <Image size={14} />
              <span>Add cover</span>
            </button>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <Clock size={12} />
            <span>Edited {formattedDate}</span>
          </div>
        </div>

        {/* Page Icon Display & Picker */}
        {currentPage.icon && (
          <div className="page-icon-wrapper">
            <div
              className="page-icon-large"
              onClick={() => setIconPickerOpen((prev) => !prev)}
              title="Change icon"
            >
              {currentPage.icon}
            </div>

            {iconPickerOpen && (
              <IconPicker
                onSelect={(icon) => updatePage(currentPage.id, { icon })}
                onRandomize={handleRandomIcon}
                onClose={() => setIconPickerOpen(false)}
              />
            )}
          </div>
        )}

        {/* Page Title Editable */}
        <input
          type="text"
          className="page-title-input"
          value={currentPage.title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          maxLength={255}
        />

        {/* Blocks Flow */}
        <div className="blocks-container">
          {currentPage.blocks.map((block, idx) => (
            <BlockItem
              key={block.id}
              block={block}
              index={idx}
              pageId={currentPage.id}
              onEnter={handleEnterBlock}
              onBackspace={handleBackspaceBlock}
              isFocused={focusedBlockIndex === idx}
              renderDatabase={(dbId) => <DatabaseView databaseId={dbId} />}
            />
          ))}
        </div>

        {/* Click to add block at bottom */}
        <div
          style={{ minHeight: '120px', cursor: 'text' }}
          onClick={() => {
            const lastIdx = currentPage.blocks.length - 1;
            const lastBlock = currentPage.blocks[lastIdx];
            if (!lastBlock || lastBlock.content !== '') {
              addBlock(currentPage.id, lastIdx, { type: 'text', content: '' });
              setFocusedBlockIndex(lastIdx + 1);
            }
          }}
        />
      </div>
    </div>
  );
};

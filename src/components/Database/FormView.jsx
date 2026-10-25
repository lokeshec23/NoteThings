import React, { useState } from 'react';
import {
  ClipboardList,
  Table,
  Plus,
  Trash2,
  CheckCircle2,
  Share2,
  Eye,
  Send,
  Check
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DatabaseView } from './DatabaseView';
import './FormView.css';

export const FormView = ({ databaseId }) => {
  const { databases, updateDatabaseSettings, addDatabaseProperty, deleteDatabaseProperty, submitFormResponse } = useWorkspace();
  const db = databases[databaseId];

  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'responses'
  const [formTitle, setFormTitle] = useState(db?.title || 'New form');
  const [formDesc, setFormDesc] = useState(db?.formDescription || 'Please fill in your responses below.');
  const [newQuestionName, setNewQuestionName] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('text');
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [answers, setAnswers] = useState({});
  const [respondentName, setRespondentName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);

  if (!db) return null;

  const properties = db.properties || [];
  const formQuestions = properties.filter((p) => p.id !== 'prop-respondent' && p.id !== 'prop-time');
  const responseCount = db.rows?.length || 0;

  const handleTitleBlur = () => {
    updateDatabaseSettings(db.id, { title: formTitle, formDescription: formDesc });
  };

  const handleAddQuestion = () => {
    if (!newQuestionName.trim()) return;
    addDatabaseProperty(db.id, newQuestionName.trim(), newQuestionType);
    setNewQuestionName('');
    setAddingQuestion(false);
  };

  const handleAnswerChange = (propId, value) => {
    setAnswers((prev) => ({ ...prev, [propId]: value }));
  };

  const handleMultiSelectToggle = (propId, opt) => {
    setAnswers((prev) => {
      const current = prev[propId] ? String(prev[propId]).split(', ') : [];
      const updated = current.includes(opt)
        ? current.filter((o) => o !== opt)
        : [...current, opt];
      return { ...prev, [propId]: updated.join(', ') };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFormResponse(db.id, {
      ...answers,
      'prop-respondent': respondentName || 'Anonymous'
    });
    setSubmitted(true);
  };

  const handleResetForm = () => {
    setAnswers({});
    setRespondentName('');
    setSubmitted(false);
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/form/${db.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="notion-form-container">
      {/* Top Navigation Tabs: Form builder vs Responses */}
      <div className="form-top-tabs-bar">
        <div className="form-tabs-group">
          <button
            className={`form-tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            <ClipboardList size={14} />
            <span>Form builder</span>
          </button>
          <button
            className={`form-tab-btn ${activeTab === 'responses' ? 'active' : ''}`}
            onClick={() => setActiveTab('responses')}
          >
            <Table size={14} />
            <span>Responses</span>
            <span className="responses-badge">{responseCount}</span>
          </button>
        </div>

        <div className="form-top-actions">
          {activeTab === 'builder' && (
            <button
              className={`header-meta-btn ${previewActive ? 'active' : ''}`}
              onClick={() => setPreviewActive((p) => !p)}
              title="Toggle preview / respondent mode"
            >
              <Eye size={13} />
              <span>{previewActive ? 'Edit questions' : 'Fill form'}</span>
            </button>
          )}

          <button
            className="header-meta-btn"
            onClick={handleCopyLink}
            title="Copy shareable form URL"
          >
            {copiedLink ? <Check size={13} color="var(--accent-green)" /> : <Share2 size={13} />}
            <span>{copiedLink ? 'Link copied!' : 'Share form'}</span>
          </button>
        </div>
      </div>

      {/* View Content: Builder vs Responses */}
      {activeTab === 'builder' ? (
        <div className="form-builder-body animate-fade-in">
          {/* Form Header Info Box */}
          <div className="form-header-card">
            <div className="form-header-icon">
              <ClipboardList size={28} color="var(--accent-purple)" />
            </div>
            {!previewActive ? (
              <div className="form-header-inputs">
                <input
                  type="text"
                  className="form-title-input"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  placeholder="Form title"
                />
                <textarea
                  rows={2}
                  className="form-desc-input"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  onBlur={handleTitleBlur}
                  placeholder="Add a description or instructions for respondents..."
                />
              </div>
            ) : (
              <div className="form-header-preview">
                <h1 className="form-preview-title">{formTitle}</h1>
                <p className="form-preview-desc">{formDesc}</p>
              </div>
            )}
          </div>

          {/* Form Submission Confirmation View */}
          {submitted ? (
            <div className="form-success-card animate-fade-in">
              <CheckCircle2 size={44} color="var(--accent-green)" />
              <h2>Thank you! Your response has been recorded.</h2>
              <p>Your submission was automatically logged into the Notion database.</p>
              <button className="btn btn-secondary" onClick={handleResetForm}>
                Submit another response
              </button>
            </div>
          ) : previewActive ? (
            /* Live Respondent Fill Out Mode */
            <form className="form-fill-container" onSubmit={handleSubmit}>
              <div className="form-question-card">
                <label className="form-question-label">Your Name / Email (Respondent)</label>
                <input
                  type="text"
                  className="form-response-input"
                  placeholder="e.g. Alex Chen (alex@example.com)"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  required
                />
              </div>

              {formQuestions.map((q, idx) => (
                <div key={q.id} className="form-question-card">
                  <label className="form-question-label">
                    <span className="question-num">{idx + 1}.</span> {q.name}
                  </label>

                  {q.type === 'multi-select' || q.type === 'select' ? (
                    <div className="form-options-group">
                      {(q.options || ['Option 1', 'Option 2', 'Option 3']).map((opt) => {
                        const isChecked = String(answers[q.id] || '').includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`form-option-pill ${isChecked ? 'selected' : ''}`}
                            onClick={() => handleMultiSelectToggle(q.id, opt)}
                          >
                            <span className="option-radio-dot" />
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : q.type === 'date' ? (
                    <input
                      type="date"
                      className="form-response-input"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  ) : q.type === 'checkbox' ? (
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!answers[q.id]}
                        onChange={(e) => handleAnswerChange(q.id, e.target.checked)}
                      />
                      <span>Yes / I agree</span>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="form-response-input"
                      placeholder="Your answer..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary submit-btn">
                  <Send size={14} />
                  <span>Submit response</span>
                </button>
              </div>
            </form>
          ) : (
            /* Builder / Question Editor Mode */
            <div className="form-questions-list">
              {formQuestions.map((q, idx) => (
                <div key={q.id} className="builder-question-card">
                  <div className="builder-q-header">
                    <span className="question-idx-badge">{idx + 1}</span>
                    <span className="builder-q-title">{q.name}</span>
                    <span className="builder-q-type-pill">{q.type}</span>
                    <button
                      className="header-btn q-trash-btn"
                      onClick={() => deleteDatabaseProperty(db.id, q.id)}
                      title="Delete question"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Options Preview for Select / Multi-Select */}
                  {(q.type === 'multi-select' || q.type === 'select') && (
                    <div className="builder-options-preview">
                      {(q.options || ['Option 1', 'Option 2', 'Option 3']).map((opt) => (
                        <span key={opt} className="builder-option-chip">
                          ● {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Question Box */}
              {addingQuestion ? (
                <div className="add-question-box animate-popover">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="cell-input title-input"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
                      placeholder="Question prompt (e.g. Which feature do you use most?)"
                      value={newQuestionName}
                      onChange={(e) => setNewQuestionName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddQuestion();
                        if (e.key === 'Escape') setAddingQuestion(false);
                      }}
                    />
                    <select
                      className="db-toolbar-select"
                      value={newQuestionType}
                      onChange={(e) => setNewQuestionType(e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="multi-select">Multi-select</option>
                      <option value="select">Select</option>
                      <option value="date">Date</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={() => setAddingQuestion(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleAddQuestion}>
                      Add question
                    </button>
                  </div>
                </div>
              ) : (
                <button className="add-question-btn" onClick={() => setAddingQuestion(true)}>
                  <Plus size={14} />
                  <span>Add question</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Responses Table Tab */
        <div className="form-responses-body animate-fade-in">
          <DatabaseView databaseId={databaseId} />
        </div>
      )}
    </div>
  );
};

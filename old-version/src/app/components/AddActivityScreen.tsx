import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Upload, Calendar, FileText, Image as ImageIcon, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

const SUBJECTS = [
  { id: 'math', label: 'Matemática', color: '#7C3AED' },
  { id: 'port', label: 'Português', color: '#3B82F6' },
  { id: 'science', label: 'Ciências', color: '#10B981' },
  { id: 'geo', label: 'Geografia', color: '#F59E0B' },
  { id: 'arts', label: 'Artes', color: '#EC4899' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Fácil', color: '#10B981' },
  { id: 'medium', label: 'Médio', color: '#F59E0B' },
  { id: 'hard', label: 'Difícil', color: '#EF4444' },
];

export function AddActivityScreen({ navigate, user, reduceMotion }: CommonProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [deadline, setDeadline] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('teacher');
    }, 2500);
  };

  const handleFileUpload = () => {
    setAttachments([...attachments, 'arquivo_exemplo.pdf']);
  };

  if (showSuccess) {
    return (
      <div className="size-full flex items-center justify-center" style={{ background: '#F5F3FF' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl p-8 max-w-md mx-4 text-center"
          style={{ background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
        >
          <motion.div
            animate={reduceMotion ? {} : { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0], transition: { duration: 0.5 } }}
          >
            <CheckCircle size={80} color="#10B981" className="mx-auto mb-6" />
          </motion.div>
          <h2 style={{ color: '#1E1B4B', marginBottom: 12 }}>Atividade Publicada! 🎉</h2>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            A atividade foi compartilhada com os alunos com sucesso!
          </p>
        </motion.div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
        <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 mb-3"
            style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            <ChevronLeft size={20} /> Voltar à edição
          </button>
          <h2 style={{ color: 'white' }}>Pré-visualização 👁️</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="rounded-3xl p-6 mb-4 shadow-sm" style={{ background: 'white' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: SUBJECTS.find(s => s.id === subject)?.color + '20' }}>
                <FileText size={24} color={SUBJECTS.find(s => s.id === subject)?.color} />
              </div>
              <div className="flex-1">
                <h3 style={{ color: '#1E1B4B', marginBottom: 4 }}>{title}</h3>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-3 py-1" style={{ background: SUBJECTS.find(s => s.id === subject)?.color + '20', color: SUBJECTS.find(s => s.id === subject)?.color, fontSize: '0.75rem', fontWeight: 700 }}>
                    {SUBJECTS.find(s => s.id === subject)?.label}
                  </span>
                  <span className="rounded-full px-3 py-1" style={{ background: DIFFICULTIES.find(d => d.id === difficulty)?.color + '20', color: DIFFICULTIES.find(d => d.id === difficulty)?.color, fontSize: '0.75rem', fontWeight: 700 }}>
                    {DIFFICULTIES.find(d => d.id === difficulty)?.label}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ color: '#6B7280', marginBottom: 16, lineHeight: 1.6 }}>{description}</p>

            <div className="rounded-xl p-3" style={{ background: '#FEF3C7', border: '2px solid #FDE68A' }}>
              <div className="flex items-center gap-2">
                <Calendar size={16} color="#D97706" />
                <span style={{ color: '#92400E', fontSize: '0.85rem', fontWeight: 700 }}>
                  Prazo: {new Date(deadline).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4">
                <p style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>Anexos:</p>
                {attachments.map((file, idx) => (
                  <div key={idx} className="rounded-lg p-3 mb-2" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <div className="flex items-center gap-2">
                      <FileText size={16} color="#6B7280" />
                      <span style={{ color: '#374151', fontSize: '0.85rem' }}>{file}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.button
            onClick={handleSubmit}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="w-full rounded-xl py-3"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            ✅ Publicar Atividade
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
        <button
          onClick={() => navigate('teacher')}
          className="flex items-center gap-2 mb-3"
          style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
        >
          <ChevronLeft size={20} /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <Mascot mood="happy" size={56} reduceMotion={reduceMotion} />
          <div>
            <h2 style={{ color: 'white' }}>Nova Atividade 📝</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Crie uma atividade para seus alunos</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-5">
          <div>
            <label style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
              Título da atividade
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Exercícios de Frações"
              required
              className="w-full rounded-xl py-3 px-4"
              style={{ border: '2px solid #E5E7EB', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a atividade..."
              required
              rows={4}
              className="w-full rounded-xl py-3 px-4"
              style={{ border: '2px solid #E5E7EB', fontSize: '1rem', resize: 'vertical' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                Matéria
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full rounded-xl py-3 px-4"
                style={{ border: '2px solid #E5E7EB', fontSize: '1rem' }}
              >
                <option value="">Selecione</option>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                Dificuldade
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
                className="w-full rounded-xl py-3 px-4"
                style={{ border: '2px solid #E5E7EB', fontSize: '1rem' }}
              >
                <option value="">Selecione</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
              Prazo de entrega
            </label>
            <div className="relative">
              <Calendar size={20} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full rounded-xl py-3 pl-12 pr-4"
                style={{ border: '2px solid #E5E7EB', fontSize: '1rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
              Anexos (opcional)
            </label>
            <motion.button
              type="button"
              onClick={handleFileUpload}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
              style={{ background: '#F9FAFB', border: '2px dashed #D1D5DB', cursor: 'pointer', fontWeight: 600, color: '#6B7280' }}
            >
              <Upload size={20} />
              Adicionar arquivo ou imagem
            </motion.button>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg p-3 flex items-center justify-between"
                    style={{ background: '#ECFDF5', border: '1px solid #6EE7B7' }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} color="#10B981" />
                      <span style={{ color: '#047857', fontSize: '0.85rem', fontWeight: 600 }}>{file}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <motion.button
            type="button"
            onClick={() => setShowPreview(true)}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
            style={{ background: '#EDE9FE', color: '#7C3AED', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            <Eye size={20} />
            Pré-visualizar
          </motion.button>
        </div>
      </form>
    </div>
  );
}

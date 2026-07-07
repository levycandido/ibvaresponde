'use client'

import { FrequenciaRecord } from '@/types'
import { Trash2, Plus, User, Cake } from 'lucide-react'
import { motion } from 'framer-motion'

interface FrequenciaTabProps {
  frequencia: FrequenciaRecord[]
  onChange: (frequencia: FrequenciaRecord[]) => void
}

export function FrequenciaTab({ frequencia, onChange }: FrequenciaTabProps) {
  const handleFieldChange = (index: number, field: keyof FrequenciaRecord, value: any) => {
    const updated = [...frequencia]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    onChange(updated)
  }

  const handleDeleteRow = (index: number) => {
    const updated = frequencia.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleAddRow = () => {
    onChange([
      ...frequencia,
      {
        nome: '',
        idade: '',
        membro: false,
        visitante: false,
      },
    ])
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">👥 Registro de Frequência</h3>
        <p className="text-sm text-gray-600">Preencha os dados dos participantes presentes nesta atividade</p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3">
        {frequencia.map((record, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:border-blue-200"
          >
            {/* Number and Delete Button */}
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl font-bold text-gray-300">{String(index + 1).padStart(2, '0')}</span>
              {record.nome && (
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 hover:bg-red-50 rounded-lg"
                  title="Deletar linha"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Nome e Idade - Same Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  Nome da Criança
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome..."
                  value={record.nome}
                  onChange={(e) => handleFieldChange(index, 'nome', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Cake size={16} className="text-pink-600" />
                  Idade
                </label>
                <input
                  type="number"
                  placeholder="Ex: 6"
                  value={record.idade}
                  onChange={(e) => handleFieldChange(index, 'idade', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-400"
                  min="0"
                  max="120"
                />
              </div>
            </div>

            {/* Checkboxes - Second Row */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={record.membro}
                    onChange={(e) => handleFieldChange(index, 'membro', e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-emerald-600"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                  Membro da Igreja
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={record.visitante}
                    onChange={(e) => handleFieldChange(index, 'visitante', e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-amber-600"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                  Visitante
                </span>
              </label>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Button */}
      <motion.button
        onClick={handleAddRow}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Adicionar Participante
      </motion.button>

      {/* Stats Footer */}
      {frequencia.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
        >
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Preenchido</p>
            <p className="text-2xl font-bold text-blue-600">
              {frequencia.filter(f => f.nome.trim() !== '').length}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Membros</p>
            <p className="text-2xl font-bold text-emerald-600">
              {frequencia.filter(f => f.membro).length}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Visitantes</p>
            <p className="text-2xl font-bold text-amber-600">
              {frequencia.filter(f => f.visitante).length}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

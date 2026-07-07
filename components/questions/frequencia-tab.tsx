'use client'

import { FrequenciaRecord } from '@/types'
import { Trash2 } from 'lucide-react'

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
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Nº</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Nome da Criança</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Idade</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700">Membro? (S/N)</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700">Visitante? (S/N)</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700">Ação</th>
            </tr>
          </thead>
          <tbody>
            {frequencia.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 w-12">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={record.nome}
                    onChange={(e) => handleFieldChange(index, 'nome', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    placeholder="Idade"
                    value={record.idade}
                    onChange={(e) => handleFieldChange(index, 'idade', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    max="120"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={record.membro}
                    onChange={(e) => handleFieldChange(index, 'membro', e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={record.visitante}
                    onChange={(e) => handleFieldChange(index, 'visitante', e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Deletar linha"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddRow}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        + Adicionar Participante
      </button>
    </div>
  )
}

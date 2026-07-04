export function isSurveyActive(dataFim?: string): boolean {
  if (!dataFim) {
    return true
  }

  try {
    // Extrair a data em formato YYYY-MM-DD e converter para timestamp
    // Usar apenas a parte da data (sem hora) para evitar problemas de timezone
    const [year, month, day] = dataFim.split('-').map(Number)

    if (!year || !month || !day) {
      return true
    }

    // Criar data UTC normalizada para a data final
    const endDateTimestamp = new Date(year, month - 1, day).getTime()

    // Obter data atual em UTC
    const today = new Date()
    const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

    // Pesquisa está ativa se a data final >= data de hoje
    const isActive = endDateTimestamp >= todayTimestamp

    return isActive
  } catch (error) {
    return true
  }
}

export function formatDateBR(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

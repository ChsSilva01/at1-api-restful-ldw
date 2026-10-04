// Contrato de dados de um agendamento individual
export interface Agendamento {
  id: string;
  paciente: string;
  profissional: string;
  dataHorario: string;
  status: 'Agendado' | 'Realizado' | 'Cancelado';
}

// Contrato opcional se você quiser manter um painel de métricas da clínica
export interface ResumoAgendamentos {
  totalAgendamentos: number;
  agendamentosHoje: number;
  listaAgendamentos: Agendamento[];
}
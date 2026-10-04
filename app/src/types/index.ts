export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface Agendamento {
  id: number;
  paciente: string;
  profissional: string;
  data_horario: string;
  createdAt?: string;
  updatedAt?: string;
}
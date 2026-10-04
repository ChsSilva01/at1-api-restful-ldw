import { useState, useEffect } from "react";
import type { Agendamento } from "./types/agendamentos";
import "./App.css";

// Ajuste as URLs para apontarem para as suas rotas do Express/Sequelize
const API_URL = "http://localhost:3000/agendamentos"; 

export default function App() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o formulário de NOVO AGENDAMENTO
  const [paciente, setPaciente] = useState<string>("");
  const [profissional, setProfissional] = useState<string>("");
  const [dataHorario, setDataHorario] = useState<string>("");
  const [enviando, setEnviando] = useState<boolean>(false);

  const opcoesProfissionais = [
    "Dr. João Silva (Clínico Geral)",
    "Dra. Maria Souza (Cardiologista)",
    "Dr. Carlos Mendes (Ortopedista)"
  ];

  async function carregarAgendamentos() {
    try {
      setLoading(true);
      setError(null);
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error("Erro na comunicação com o servidor.");
      
      const dados: Agendamento[] = await resposta.json();
      setAgendamentos(dados);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const submeterAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEnviando(true);
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente,
          profissional,
          dataHorario,
          status: 'Agendado'
        })
      });

      if (!resposta.ok) throw new Error("Falha ao registrar agendamento.");

      // Limpa o formulário após sucesso
      setPaciente("");
      setProfissional("");
      setDataHorario("");
      
      // Recarrega a lista de consultas
      await carregarAgendamentos();
      alert("Consulta agendada com sucesso!");
    } catch (err: any) {
      alert("Erro ao agendar: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="loading">Carregando agenda...</div>;
  if (error) return <div className="error">Aviso: Não foi possível carregar os dados. ({error})</div>;

  return (
    <div className="container">
      <header>
        <h1>Painel de Agendamentos</h1>
        <p>Gerenciamento de consultas médicas</p>
      </header>

      <main className="dashboard-grid">
        {/* Card do Formulário de Agendamento */}
        <div className="metric-card form-card">
          <h3>Nova Consulta</h3>
          <form onSubmit={submeterAgendamento}>
            <div className="form-group">
              <label>Nome do Paciente:</label>
              <input
                type="text"
                required
                value={paciente}
                onChange={(e) => setPaciente(e.target.value)}
                placeholder="Ex: Neuso"
              />
            </div>

            <div className="form-group">
              <label>Profissional:</label>
              <select 
                required
                value={profissional} 
                onChange={(e) => setProfissional(e.target.value)}
              >
                <option value="" disabled>Selecione um médico</option>
                {opcoesProfissionais.map((prof) => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data e Horário:</label>
              <input
                type="datetime-local"
                required
                value={dataHorario}
                onChange={(e) => setDataHorario(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={enviando}>
              {enviando ? "Agendando..." : "Confirmar Agendamento"}
            </button>
          </form>
        </div>

        {/* Card: Lista de Consultas Agendadas */}
        <div className="metric-card tech-card">
          <h3>Próximos Atendimentos ({agendamentos.length})</h3>
          <ul>
            {agendamentos.length === 0 ? (
              <li>Nenhuma consulta agendada.</li>
            ) : (
              agendamentos.map((consulta) => (
                <li key={consulta.id} className="tech-item" style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                  <strong>{consulta.paciente}</strong> com {consulta.profissional} <br/>
                  <small>{new Date(consulta.dataHorario).toLocaleString()} - Status: {consulta.status}</small>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { api } from './services/api';
import type { Agendamento } from './types';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  
  const [paciente, setPaciente] = useState('');
  const [profissional, setProfissional] = useState('');
  const [dataHorario, setDataHorario] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } catch {
      alert('Erro no login. Verifique as credenciais.');
    }
  };

  const fetchAgendamentos = async () => {
    try {
      const res = await api.get<Agendamento[]>('/agendamentos');
      setAgendamentos(res.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/agendamentos', {
        paciente,
        profissional,
        data_horario: dataHorario
      });
      setPaciente('');
      setProfissional('');
      setDataHorario('');
      fetchAgendamentos();
    } catch {
      alert('Erro ao criar agendamento.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchAgendamentos();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Login - Painel</h2>
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-2 border rounded mb-3" 
            required 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-2 border rounded mb-4" 
            required 
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Painel de Agendamentos</h1>
          <button 
            onClick={() => { localStorage.removeItem('token'); setToken(''); }} 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="Paciente" 
            value={paciente} 
            onChange={e => setPaciente(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
          <input 
            type="text" 
            placeholder="Profissional" 
            value={profissional} 
            onChange={e => setProfissional(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
          <input 
            type="datetime-local" 
            value={dataHorario} 
            onChange={e => setDataHorario(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Cadastrar</button>
        </form>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm">
                <th className="p-3">Paciente</th>
                <th className="p-3">Profissional</th>
                <th className="p-3">Data/Horário</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.paciente}</td>
                  <td className="p-3">{item.profissional}</td>
                  <td className="p-3">{new Date(item.data_horario).toLocaleString()}</td>
                </tr>
              ))}
              {agendamentos.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">Nenhum agendamento encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
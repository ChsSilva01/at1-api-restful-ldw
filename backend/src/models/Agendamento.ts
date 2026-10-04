import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Agendamento extends Model {
  declare id: number;
  declare paciente: string;
  declare profissional: string;
  declare data_horario: Date;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Agendamento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    paciente: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    profissional: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    data_horario: {
      type: DataTypes.DATE, // Salva a data e a hora exata
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Agendado', 'Realizado', 'Cancelado'),
      defaultValue: 'Agendado', // Todo agendamento novo começa com esse status
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'agendamentos',
    timestamps: true // Mantém o createdAt e updatedAt automáticos
  }
);
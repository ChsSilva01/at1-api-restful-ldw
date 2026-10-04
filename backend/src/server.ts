import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import { appRoutes } from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', mensagem: 'Servidor operacional.' });
});

app.use('/api', appRoutes);

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexao com o banco de dados estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
}

main();
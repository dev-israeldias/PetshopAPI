require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');

// Importa os models para o Sequelize registrar as tabelas
const Cliente = require('./models/Cliente');
const Agendamento = require('./models/Agendamento');

const authRoutes = require('./routes/authRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/agendamentos', agendamentoRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'PetCare API fucnioando.' });
});

const PORT = process.env.PORT || 3000;

// inserção de dados fictícios
sequelize
  .sync()
  .then(async () => {
    console.log('Banco de dados sincronizado.');

    try {
      // Verifica se já existe um cliente de teste para não duplicar
      const existe = await Cliente.findOne({ where: { email: 'teste@email.com' } });
      
      if (!existe) {
        const senhaHash = await bcrypt.hash('123456', 10);
        
        const cliente = await Cliente.create({
          nome: 'Usuário Teste',
          email: 'teste@email.com',
          senha: senhaHash,
          telefone: '(19) 99999-9999'
        });

        await Agendamento.create({
          petNome: 'Thor',
          servico: 'banho',
          data: '2026-10-10',
          hora: '14:00:00',
          clienteId: cliente.id
        });

        console.log('Dados fictícios inseridos com sucesso!');
      }
    } catch (erro) {
      console.log('Erro ao inserir dados fictícios:', erro.message);
    }

    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch((erro) => {
    console.error('Erro ao conectar no banco de dados:', erro.message);
  });
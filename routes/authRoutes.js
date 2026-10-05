const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// cria um novo cliente
router.post(
  '/registrar',
  [
    body('nome').trim().notEmpty().withMessage('O nome é obrigatório.'),
    body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('A senha deve ter pelo menos 6 caracteres.'),
    body('telefone').optional().trim().escape(),
  ],
  authController.registrar
);

// autentica o cliente e devolve um token JWT
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
    body('senha').notEmpty().withMessage('A senha é obrigatória.'),
  ],
  authController.login
);

module.exports = router;

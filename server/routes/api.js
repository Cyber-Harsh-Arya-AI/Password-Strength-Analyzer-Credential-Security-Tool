import express from 'express';
import { analyzePassword } from '../controllers/passwordController.js';
import { generatePassword, generatePassphrase, hashText, universalConverter } from '../controllers/toolsController.js';

const router = express.Router();

// Password Strength Analyzer
router.post('/analyze', analyzePassword);

// Credential Toolkit
router.post('/generate-password', generatePassword);
router.post('/generate-passphrase', generatePassphrase);
router.post('/hash', hashText);
router.post('/convert', universalConverter);

export default router;

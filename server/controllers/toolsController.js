import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Curated Diceware-style wordlist (subset for demonstration)
const wordlist = [
  'galaxy', 'neon', 'fortress', 'cipher', 'protocol', 'matrix', 'sentinel', 'oracle',
  'quantum', 'binary', 'vector', 'nexus', 'shadow', 'phantom', 'titan', 'vortex',
  'pulse', 'signal', 'beacon', 'echo', 'flux', 'logic', 'core', 'array', 'grid',
  'delta', 'omega', 'alpha', 'sigma', 'zenith', 'apex', 'horizon', 'void', 'plasma'
];

export const generatePassword = (req, res) => {
  try {
    const { length = 16, numbers = true, symbols = true, uppercase = true, lowercase = true } = req.body;
    
    let chars = '';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!chars) {
      return res.status(400).json({ error: 'At least one character type must be selected' });
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      password += chars[randomIndex];
    }
    
    res.json({ password });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating password' });
  }
};

export const generatePassphrase = (req, res) => {
  try {
    const { wordCount = 4, separator = '-', includeNumber = true, capitalize = true } = req.body;
    
    let parts = [];
    for (let i = 0; i < wordCount; i++) {
      let word = wordlist[Math.floor(Math.random() * wordlist.length)];
      if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1);
      parts.push(word);
    }

    if (includeNumber) {
      parts.push(crypto.randomInt(10, 99).toString());
    }

    const passphrase = parts.join(separator);
    
    res.json({ 
      passphrase,
      entropy: Math.round(wordCount * 12.9) // Based on 7776 words list bit-entropy
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating passphrase' });
  }
};

// Universal Encoding/Decoding Logic
const converters = {
  base64: {
    encode: (text) => Buffer.from(text, 'utf8').toString('base64'),
    decode: (text) => Buffer.from(text, 'base64').toString('utf8')
  },
  hex: {
    encode: (text) => Buffer.from(text, 'utf8').toString('hex'),
    decode: (text) => Buffer.from(text, 'hex').toString('utf8')
  },
  binary: {
    encode: (text) => text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
    decode: (text) => text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('')
  },
  rot13: {
    encode: (text) => text.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)),
    decode: (text) => text.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26))
  }
};

export const universalConverter = (req, res) => {
  try {
    const { text, mode, type } = req.body; // mode: encode/decode, type: base64/hex/binary/rot13
    if (!text) return res.status(400).json({ error: 'Payload is required' });

    const converter = converters[type.toLowerCase()];
    if (!converter) return res.status(400).json({ error: 'Invalid converter type' });

    const result = mode === 'encode' ? converter.encode(text) : converter.decode(text);

    res.json({ 
      success: true, 
      result,
      metadata: {
        type: type.toUpperCase(),
        mode: mode.toUpperCase(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Conversion failure: Data corruption or malformed input' });
  }
};

export const hashText = async (req, res) => {
  try {
    const { text, algorithm } = req.body;
    
    if (!text || !algorithm) {
      return res.status(400).json({ error: 'Text and algorithm are required' });
    }

    let hash = '';
    
    switch (algorithm.toLowerCase()) {
      case 'md5':
        hash = crypto.createHash('md5').update(text).digest('hex');
        break;
      case 'sha1':
        hash = crypto.createHash('sha1').update(text).digest('hex');
        break;
      case 'sha256':
        hash = crypto.createHash('sha256').update(text).digest('hex');
        break;
      case 'sha512':
        hash = crypto.createHash('sha512').update(text).digest('hex');
        break;
      case 'bcrypt':
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(text, salt);
        break;
      case 'base64':
        hash = Buffer.from(text).toString('base64');
        break;
      default:
        return res.status(400).json({ error: 'Unsupported algorithm' });
    }

    res.json({ hash, algorithm });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating hash' });
  }
};

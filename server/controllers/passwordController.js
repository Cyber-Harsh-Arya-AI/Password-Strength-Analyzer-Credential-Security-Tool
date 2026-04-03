// Basic implementation of password strength analysis
export const analyzePassword = (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Entropy calculation
    const charsetSize = calculateCharsetSize(password);
    const entropy = password.length * Math.log2(charsetSize || 1);

    // Crack simulation (simplified)
    const guessesPerSecond = 1e9; // 1 billion guesses per sec (e.g. offline brute force)
    const combinations = Math.pow(charsetSize, password.length);
    const crackTimeSeconds = combinations / guessesPerSecond;
    
    // Determine score out of 100
    let score = 0;
    if (entropy > 80) score = 100;
    else if (entropy > 60) score = 80;
    else if (entropy > 40) score = 60;
    else if (entropy > 25) score = 40;
    else score = 20;

    // Checks & feedback
    const feedback = [];
    if (password.length < 12) feedback.push('Increase password length to at least 12 characters.');
    if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters.');
    if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters.');
    if (!/[0-9]/.test(password)) feedback.push('Add numbers.');
    if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Add special characters.');
    if (/(.)\1{2,}/.test(password)) feedback.push('Avoid repeating characters.');
    
    // Pattern detection (very basic dictionary check simulation)
    const commonPatterns = ['123', 'qwerty', 'password', 'admin'];
    const hasPattern = commonPatterns.some(p => password.toLowerCase().includes(p));
    if (hasPattern) {
      score -= 20;
      feedback.push('Avoid common patterns or predictable sequences.');
    }

    // Mock Breach Checker (HaveIBeenPwned simulation)
    const isPwned = password.length < 8 || hasPattern; // Mock logic: weak or common = pwned
    const breachCount = isPwned ? Math.floor(Math.random() * 500000) + 100 : 0;

    res.json({
      passwordLength: password.length,
      entropy: Math.round(entropy * 10) / 10,
      crackTimeSeconds,
      crackTimeDisplay: formatCrackTime(crackTimeSeconds),
      score: Math.max(0, score),
      feedback,
      hasPattern,
      isPwned,
      breachCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during analysis' });
  }
};

const calculateCharsetSize = (password) => {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^A-Za-z0-9]/.test(password)) size += 32; // Special chars
  return size === 0 ? 1 : size;
};

const formatCrackTime = (seconds) => {
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  return `${Math.round(seconds / 31536000)} years`;
};

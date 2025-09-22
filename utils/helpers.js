const is13Digits = s => /^\d{13}$/.test(s);
const parseDob = dobStr => {
  const d = new Date(dobStr);
  return isNaN(d.getTime()) ? null : new Date(d.toISOString().substring(0, 10));
};

module.exports = { is13Digits, parseDob };

const axios = require('axios');

const fetchStaff = async () => {
  const res = await axios.get('https://medi-staff.onrender.com/api/staff');
  return res.data;
};

const getDoctors = async (req, res) => {
  try {
    const staff = await fetchStaff();
    const doctors = staff.filter(s => s.role === 'Doctor');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctors', error: err.message });
  }
};

const getNurses = async (req, res) => {
  try {
    const staff = await fetchStaff();
    const nurses = staff.filter(s => s.role === 'Nurse');
    res.json(nurses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch nurses', error: err.message });
  }
};

module.exports = { getDoctors, getNurses };

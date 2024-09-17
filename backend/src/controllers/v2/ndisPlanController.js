const db = require('../../config/database');

exports.getAllNdisPlans = async (req, res) => {
  try {
    const ndisPlans = await db.NDISPlan.findAll({
      include: [{ model: db.User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(ndisPlans);
  } catch (error) {
    console.error('Error fetching NDIS plans:', error);
    res.status(500).json({ message: 'Error fetching NDIS plans', error: error.message });
  }
};

exports.getNdisPlanById = async (req, res) => {
  try {
    const ndisPlan = await db.NDISPlan.findByPk(req.params.id, {
      include: [{ model: db.User, attributes: ['id', 'name', 'email'] }]
    });
    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }
    res.json(ndisPlan);
  } catch (error) {
    console.error('Error fetching NDIS plan:', error);
    res.status(500).json({ message: 'Error fetching NDIS plan', error: error.message });
  }
};

exports.updateNdisPlan = async (req, res) => {
  try {
    const { startDate, endDate, fundingAmount, goals } = req.body;
    const [updatedRowsCount, updatedPlans] = await db.NDISPlan.update(
      { startDate, endDate, fundingAmount, goals },
      { 
        where: { id: req.params.id },
        returning: true
      }
    );
    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }
    res.json(updatedPlans[0]);
  } catch (error) {
    console.error('Error updating NDIS plan:', error);
    res.status(500).json({ message: 'Error updating NDIS plan', error: error.message });
  }
};
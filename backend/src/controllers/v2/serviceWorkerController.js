const db = require('../../config/database');

exports.getAllServiceWorkers = async (req, res) => {
  try {
    const serviceWorkers = await db.User.findAll({
      where: { role: 'service_worker' },
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    res.json(serviceWorkers);
  } catch (error) {
    console.error('Error fetching service workers:', error);
    res.status(500).json({ message: 'Error fetching service workers', error: error.message });
  }
};

exports.getServiceWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceWorker = await db.User.findOne({
      where: { id, role: 'service_worker' },
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    if (!serviceWorker) {
      return res.status(404).json({ message: 'Service worker not found' });
    }
    res.json(serviceWorker);
  } catch (error) {
    console.error('Error fetching service worker:', error);
    res.status(500).json({ message: 'Error fetching service worker', error: error.message });
  }
};

exports.getServiceWorkerServices = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceAssignments = await db.ServiceAssignment.findAll({
      where: { supportTeamMemberId: id },
      include: [
        {
          model: db.Service,
          as: 'service'
        },
        {
          model: db.User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(serviceAssignments);
  } catch (error) {
    console.error('Error fetching service worker services:', error);
    res.status(500).json({ message: 'Error fetching service worker services', error: error.message });
  }
};
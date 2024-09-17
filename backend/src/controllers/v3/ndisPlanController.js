const db = require('../../config/database');

exports.getAllNdisPlans = async (req, res) => {
  try {
    const ndisPlans = await db.NDISPlan.findAll({
      include: [
        {
          model: db.User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: db.ServiceAssignment,
          as: 'serviceAssignments',
          include: [
            {
              model: db.Service,
              as: 'service'
            },
            {
              model: db.SupportTeamMember,
              as: 'supportTeamMember',
              include: [{
                model: db.User,
                as: 'member',
                attributes: ['id', 'name', 'email']
              }]
            }
          ]
        },
        {
          model: db.ServiceWorker,
          as: 'leader',
          include: [{
            model: db.User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    res.json(ndisPlans);
  } catch (error) {
    console.error('Error in getAllNdisPlans:', error);
    res.status(500).json({ 
      message: 'Error fetching all NDIS plans', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getNdisPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const ndisPlan = await db.NDISPlan.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: db.ServiceAssignment,
          as: 'serviceAssignments',
          include: [
            {
              model: db.Service,
              as: 'service'
            },
            {
              model: db.SupportTeamMember,
              as: 'supportTeamMember',
              include: [{
                model: db.User,
                as: 'member',
                attributes: ['id', 'name', 'email']
              }]
            }
          ]
        },
        {
          model: db.ServiceWorker,
          as: 'leader',
          include: [{
            model: db.User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }

    res.json(ndisPlan);
  } catch (error) {
    console.error('Error fetching NDIS plan by ID:', error);
    res.status(500).json({ message: 'Error fetching NDIS plan by ID', error: error.message });
  }
};

exports.getNdisPlansByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const ndisPlans = await db.NDISPlan.findAll({
      where: { userId: clientId },
      include: [
        {
          model: db.User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: db.ServiceAssignment,
          as: 'serviceAssignments',
          include: [
            {
              model: db.Service,
              as: 'service'
            },
            {
              model: db.SupportTeamMember,
              as: 'supportTeamMember',
              include: [{
                model: db.User,
                as: 'member',
                attributes: ['id', 'name', 'email']
              }]
            }
          ]
        },
        {
          model: db.ServiceWorker,
          as: 'leader',
          include: [{
            model: db.User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    if (!ndisPlans || ndisPlans.length === 0) {
      return res.status(404).json({ message: 'No NDIS plans found for this client' });
    }

    res.json(ndisPlans);
  } catch (error) {
    console.error('Error fetching NDIS plans by client ID:', error);
    res.status(500).json({ message: 'Error fetching NDIS plans by client ID', error: error.message });
  }
};

exports.createNdisPlan = async (req, res) => {
  try {
    const { 
      userId,
      leaderId,
      ndisNumber,
      totalBudget, 
      usedBudget, 
      startDate, 
      endDate, 
      status,
      reviewDate,
      goals, 
      fundingCategories
    } = req.body;

    const newNdisPlan = await db.NDISPlan.create({
      userId,
      leaderId,
      ndisNumber,
      totalBudget, 
      usedBudget, 
      startDate, 
      endDate,
      status,
      reviewDate,
      goals, 
      fundingCategories
    });

    res.status(201).json(newNdisPlan);
  } catch (error) {
    console.error('Error creating NDIS plan:', error);
    res.status(500).json({ message: 'Error creating NDIS plan', error: error.message });
  }
};

exports.updateNdisPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      totalBudget, 
      usedBudget, 
      startDate, 
      endDate, 
      status,
      reviewDate,
      goals, 
      fundingCategories,
      leaderId
    } = req.body;

    const ndisPlan = await db.NDISPlan.findByPk(id);

    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }

    await ndisPlan.update({ 
      totalBudget, 
      usedBudget, 
      startDate, 
      endDate,
      status,
      reviewDate,
      goals, 
      fundingCategories,
      leaderId
    });

    res.json(ndisPlan);
  } catch (error) {
    console.error('Error updating NDIS plan:', error);
    res.status(500).json({ message: 'Error updating NDIS plan', error: error.message });
  }
};

exports.deleteNdisPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const ndisPlan = await db.NDISPlan.findByPk(id);

    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }

    await ndisPlan.destroy();

    res.json({ message: 'NDIS plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting NDIS plan:', error);
    res.status(500).json({ message: 'Error deleting NDIS plan', error: error.message });
  }
};

exports.assignServiceWorker = async (req, res) => {
  try {
    const { planId, workerId } = req.body;

    const ndisPlan = await db.NDISPlan.findByPk(planId);

    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }

    const serviceWorker = await db.ServiceWorker.findByPk(workerId);

    if (!serviceWorker) {
      return res.status(404).json({ message: 'Service worker not found' });
    }

    // Update the NDIS plan with the new leader
    await ndisPlan.update({ leaderId: workerId });

    res.json({ message: 'Service worker assigned successfully' });
  } catch (error) {
    console.error('Error assigning service worker:', error);
    res.status(500).json({ message: 'Error assigning service worker', error: error.message });
  }
};

exports.getAvailableServiceWorkers = async (req, res) => {
  try {
    const availableServiceWorkers = await db.ServiceWorker.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(availableServiceWorkers);
  } catch (error) {
    console.error('Error fetching available service workers:', error);
    res.status(500).json({ message: 'Error fetching available service workers', error: error.message });
  }
};

module.exports = exports;
// controllers/ndisPlanController.js
const db = require('../../config/database');

exports.getAllNDISPlans = async (req, res) => {
  try {
    const ndisPlans = await db.NDISPlan.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
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
              as: 'assignedTeamMember',
              include: [{
                model: db.User,
                as: 'member',
                attributes: ['id', 'name', 'email']
              }]
            }
          ]
        }
      ]
    });

    res.json(ndisPlans);
  } catch (error) {
    console.error('Error fetching all NDIS plans:', error);
    res.status(500).json({ message: 'Error fetching all NDIS plans', error: error.message });
  }
};


exports.getNDISPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const ndisPlan = await db.NDISPlan.findOne({
      where: { userId },
      include: [
        {
          model: db.User,
          as: 'user',
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
              as: 'assignedTeamMember',
              include: [{
                model: db.User,
                as: 'member',
                attributes: ['id', 'name', 'email']
              }]
            }
          ]
        }
      ]
    });

    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }

    // If there's an assigned care coordinator, fetch their details
    if (ndisPlan.assignedCareCoordinatorId) {
      const careCoordinator = await db.User.findByPk(ndisPlan.assignedCareCoordinatorId, {
        attributes: ['id', 'name', 'email']
      });
      ndisPlan.setDataValue('assignedCareCoordinator', careCoordinator);
    }

    res.json(ndisPlan);
  } catch (error) {
    console.error('Error fetching NDIS plan:', error);
    res.status(500).json({ message: 'Error fetching NDIS plan', error: error.message });
  }
};

exports.updateNDISPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      totalBudget, 
      usedBudget, 
      startDate, 
      endDate, 
      status,
      reviewDate,
      goals, 
      fundingCategories,
      assignedCareCoordinatorId
    } = req.body;

    const [ndisPlan, created] = await db.NDISPlan.findOrCreate({
      where: { userId },
      defaults: { 
        ndisNumber: `NDIS-${userId}-${Date.now()}`, // Generate a unique NDIS number
        totalBudget, 
        usedBudget, 
        startDate, 
        endDate,
        status,
        reviewDate,
        goals, 
        fundingCategories,
        assignedCareCoordinatorId
      }
    });

    if (!created) {
      await ndisPlan.update({ 
        totalBudget, 
        usedBudget, 
        startDate, 
        endDate,
        status,
        reviewDate,
        goals, 
        fundingCategories,
        assignedCareCoordinatorId
      });
    }

    res.json(ndisPlan);
  } catch (error) {
    console.error('Error updating NDIS plan:', error);
    res.status(500).json({ message: 'Error updating NDIS plan', error: error.message });
  }
};

module.exports = exports;
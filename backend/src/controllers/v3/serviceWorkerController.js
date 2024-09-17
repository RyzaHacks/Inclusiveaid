// src/controllers/v3/serviceWorkerController.js

const db = require('../../config/database');
const { Op } = require('sequelize');

exports.getAllServiceWorkers = async (req, res) => {
    try {
      const serviceWorkers = await db.ServiceWorker.findAll({
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: db.Service,
            as: 'assignedServices',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      });
  
      const formattedServiceWorkers = serviceWorkers.map(worker => ({
        id: worker.id,
        name: worker.user.name,
        assignedServices: worker.assignedServices.map(service => service.name)
      }));
  
      res.json(formattedServiceWorkers);
    } catch (error) {
      console.error('Error fetching all service workers:', error);
      res.status(500).json({ message: 'Error fetching service workers', error: error.message });
    }
  };
  

exports.getServiceWorkerById = async (req, res) => {
  try {
    const serviceWorker = await db.ServiceWorker.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
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

exports.createServiceWorker = async (req, res) => {
  try {
    const { userId, qualifications, specialties, availability } = req.body;
    const newServiceWorker = await db.ServiceWorker.create({
      userId,
      qualifications,
      specialties,
      availability,
    });
    const createdServiceWorker = await db.ServiceWorker.findByPk(newServiceWorker.id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.status(201).json(createdServiceWorker);
  } catch (error) {
    console.error('Error creating service worker:', error);
    res.status(500).json({ message: 'Error creating service worker', error: error.message });
  }
};

exports.updateServiceWorker = async (req, res) => {
  try {
    const { qualifications, specialties, availability } = req.body;
    const [updated] = await db.ServiceWorker.update(
      { qualifications, specialties, availability },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedServiceWorker = await db.ServiceWorker.findByPk(req.params.id, {
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
      return res.json(updatedServiceWorker);
    }
    throw new Error('Service worker not found');
  } catch (error) {
    console.error('Error updating service worker:', error);
    res.status(500).json({ message: 'Error updating service worker', error: error.message });
  }
};

exports.deleteServiceWorker = async (req, res) => {
  try {
    const deleted = await db.ServiceWorker.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.json({ message: 'Service worker deleted successfully' });
    }
    throw new Error('Service worker not found');
  } catch (error) {
    console.error('Error deleting service worker:', error);
    res.status(500).json({ message: 'Error deleting service worker', error: error.message });
  }
};

exports.updateServiceWorkerAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceIds } = req.body;

    const serviceWorker = await db.ServiceWorker.findByPk(id);
    if (!serviceWorker) {
      return res.status(404).json({ message: 'Service worker not found' });
    }

    // Update the assignments
    await db.ServiceAssignment.destroy({
      where: { serviceWorkerId: id },
    });

    const newAssignments = serviceIds.map(serviceId => ({
      serviceWorkerId: id,
      serviceId,
      status: 'assigned',
    }));

    await db.ServiceAssignment.bulkCreate(newAssignments);

    // Fetch updated service worker with assignments
    const updatedServiceWorker = await db.ServiceWorker.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: db.ServiceAssignment,
          as: 'assignments',
          include: [
            {
              model: db.Service,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    res.json(updatedServiceWorker);
  } catch (error) {
    console.error('Error updating service worker assignments:', error);
    res.status(500).json({ message: 'Error updating service worker assignments', error: error.message });
  }
};
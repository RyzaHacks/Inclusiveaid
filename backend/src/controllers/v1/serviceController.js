// serviceController.js

const db = require('../../config/database');

exports.getAllServices = async (req, res) => {
  try {
    const services = await db.Service.findAll();
    res.json(services);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, description, category, price, duration } = req.body;
    const service = await db.Service.create({ name, description, category, price, duration });
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, duration, status } = req.body;
    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.update({ name, description, category, price, duration, status });
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

exports.assignServiceToClient = async (req, res) => {
  try {
    const { serviceId, clientId, supportTeamMemberId, ndisPlanId, date, time } = req.body;
    const assignment = await db.ServiceAssignment.create({
      serviceId,
      clientId,
      supportTeamMemberId,
      ndisPlanId,
      date,
      time,
      status: 'scheduled'
    });
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error assigning service to client:', error);
    res.status(400).json({ message: 'Error assigning service to client', error: error.message });
  }
};

exports.assignWorkerToService = async (req, res) => {
  try {
    const { serviceId, workerId, role } = req.body;
    const supportTeamMember = await db.SupportTeamMember.findOne({
      where: { userId: workerId, role: 'service_worker' }
    });
    if (!supportTeamMember) {
      return res.status(404).json({ message: 'Service worker not found' });
    }
    await db.ServiceAssignment.update(
      { supportTeamMemberId: supportTeamMember.id },
      { where: { serviceId, supportTeamMemberId: null } }
    );
    res.json({ message: 'Worker assigned to service successfully' });
  } catch (error) {
    console.error('Error assigning worker to service:', error);
    res.status(400).json({ message: 'Error assigning worker to service', error: error.message });
  }
};

exports.getClientServices = async (req, res) => {
  try {
    const { userId } = req.params;
    const services = await db.ServiceAssignment.findAll({
      where: { clientId: userId },
      include: [
        {
          model: db.Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'category', 'price', 'duration', 'status'],
        },
        { 
          model: db.SupportTeamMember, 
          as: 'assignedTeamMember',
          include: [{ model: db.User, as: 'member', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: db.NDISPlan,
          as: 'ndisPlan',
          attributes: ['id', 'totalBudget', 'usedBudget', 'startDate', 'endDate', 'status'],
        },
      ]
    });
    
    const formattedServices = services.map(service => ({
      id: service.id,
      serviceId: service.serviceId,
      serviceName: service.service.name,  // Include the service name
      clientId: service.clientId,
      supportTeamMemberId: service.supportTeamMemberId,
      ndisPlanId: service.ndisPlanId,
      date: service.date,
      time: service.time,
      status: service.status,
      service: service.service,
      assignedTeamMember: service.assignedTeamMember,
      ndisPlan: service.ndisPlan
    }));
    
    res.json(formattedServices);
  } catch (error) {
    console.error('Error fetching client services:', error);
    res.status(500).json({ message: 'Error fetching client services', error: error.message });
  }
};




exports.getWorkerServices = async (req, res) => {
  try {
    const { userId } = req.params;
    const services = await db.ServiceAssignment.findAll({
      where: {
        supportTeamMemberId: userId,
      },
      include: [
        {
          model: db.Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'category', 'price', 'duration', 'status'],
        },
        { 
          model: db.SupportTeamMember, 
          as: 'assignedTeamMember',
          include: [{ model: db.User, as: 'client', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: db.NDISPlan,
          as: 'ndisPlan',
          attributes: ['id', 'totalBudget', 'usedBudget', 'startDate', 'endDate', 'status'],
        },
      ]
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching worker services:', error);
    res.status(500).json({ message: 'Error fetching worker services', error: error.message });
  }
};

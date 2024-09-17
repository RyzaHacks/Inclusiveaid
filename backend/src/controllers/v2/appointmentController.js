const db = require('../../config/database');

exports.getAllAppointments = async (req, res) => {
    try {
      const appointments = await db.Appointment.findAll({
        include: [
          {
            model: db.User,
            as: 'client', // Use the correct alias 'client' instead of 'serviceWorker'
          },
          {
            model: db.ServiceWorker,
            as: 'serviceWorker',
          },
          {
            model: db.Service,
            as: 'service',
          },
        ],
      });
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
  };

exports.createAppointment = async (req, res) => {
  try {
    const { clientId, serviceWorkerId, serviceId, dateTime, status } = req.body;

    const newAppointment = await db.Appointment.create({
      clientId,
      serviceWorkerId,
      serviceId,
      dateTime,
      status
    });
    
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id, {
      include: [
        { model: db.User, as: 'client', attributes: ['name', 'email'] },
        { model: db.User, as: 'serviceWorker', attributes: ['name', 'email'] },
        { model: db.Service, attributes: ['name', 'description'] }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { clientId, serviceWorkerId, serviceId, dateTime, status } = req.body;

    const [updatedRowsCount, updatedAppointments] = await db.Appointment.update(
      { clientId, serviceWorkerId, serviceId, dateTime, status },
      { 
        where: { id: req.params.id },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(updatedAppointments[0]);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const deletedRowsCount = await db.Appointment.destroy({
      where: { id: req.params.id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};
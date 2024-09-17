const db = require('../config/database');

exports.getCourseUsers = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(`Fetching users for course with id: ${courseId}`);
    
    const course = await db.Course.findByPk(courseId, {
      include: [{
        model: db.User,
        as: 'enrolledUsers',
        through: { attributes: [] },
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!course) {
      console.log(`Course with id ${courseId} not found`);
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log(`Found ${course.enrolledUsers.length} users for course ${courseId}`);
    res.json(course.enrolledUsers);
  } catch (error) {
    console.error('Error in getCourseUsers:', error);
    res.status(500).json({ message: 'Error fetching course users', error: error.message });
  }
};


exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching courses for user with id: ${userId}`);
    const user = await db.User.findByPk(userId, {
      include: [{
        model: db.Course,
        as: 'enrolledCourses',
        through: {
          model: db.UserCourse,
          attributes: ['progress']
        },
        include: [{ 
          model: db.Module, 
          as: 'modules',
          include: [{ 
            model: db.Unit,
            as: 'units'
          }] 
        }]
      }]
    });

    if (!user) {
      console.log(`User with id ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    const courses = user.enrolledCourses.map(course => ({
      ...course.toJSON(),
      progress: course.UserCourse.progress
    }));

    console.log(`Found ${courses.length} courses for user ${userId}`);
    res.json(courses);
  } catch (error) {
    console.error('Error in getUserCourses:', error);
    res.status(500).json({ message: 'Error fetching user courses', error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    console.log('Fetching all courses');
    const courses = await db.Course.findAll({
      include: [{
        model: db.Module,
        as: 'modules',
        attributes: ['id', 'title', 'description', 'order', 'progress'],
      }],
      order: [
        ['createdAt', 'DESC'],
        [{ model: db.Module, as: 'modules' }, 'order', 'ASC'],
      ],
    });
    
    console.log(`Found ${courses.length} courses`);
    
    const coursesWithModuleCount = courses.map(course => {
      const plainCourse = course.get({ plain: true });
      return {
        ...plainCourse,
        moduleCount: plainCourse.modules.length,
      };
    });
    
    res.json(coursesWithModuleCount);
  } catch (error) {
    console.error('Error in getCourses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    console.log(`Fetching course with id: ${req.params.id}`);
    const course = await db.Course.findByPk(req.params.id, {
      include: [
        { 
          model: db.Module, 
          as: 'modules',
          include: [{ 
            model: db.Unit, 
            as: 'units',
            include: [{ 
              model: db.Quiz, 
              as: 'quiz',
              include: [{ 
                model: db.Question, 
                as: 'questions' 
              }]
            }]
          }] 
        },
        {
          model: db.User,
          as: 'enrolledUsers',
          through: { attributes: [] },
          attributes: ['id', 'name', 'email']
        }
      ],
    });
    if (!course) {
      console.log(`Course with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error in getCourseById:', error);
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users');
    const users = await db.User.findAll({
      attributes: ['id', 'name', 'email'] // Only include necessary user information
    });
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    console.log('Creating new course', req.body);
    const course = await db.Course.create(req.body);
    console.log('New course created with id:', course.id);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error in createCourse:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    console.log(`Updating course with id: ${req.params.id}`, req.body);
    const [updated] = await db.Course.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCourse = await db.Course.findByPk(req.params.id, {
        include: [{ 
          model: db.Module, 
          as: 'modules',
          include: [{ model: db.Unit, as: 'units' }] 
        }],
      });
      console.log('Course updated successfully');
      return res.json(updatedCourse);
    }
    console.log(`Course with id ${req.params.id} not found for update`);
    throw new Error('Course not found');
  } catch (error) {
    console.error('Error in updateCourse:', error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    console.log(`Deleting course with id: ${req.params.id}`);
    const deleted = await db.Course.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      console.log('Course deleted successfully');
      return res.status(204).send("Course deleted");
    }
    console.log(`Course with id ${req.params.id} not found for deletion`);
    throw new Error('Course not found');
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

exports.enrollUserInCourse = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;
    console.log(`Enrolling user ${userId} in course ${courseId}`);
    
    const user = await db.User.findByPk(userId);
    if (!user) {
      console.log(`User ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.id, user.name);

    const course = await db.Course.findByPk(courseId);
    if (!course) {
      console.log(`Course ${courseId} not found`);
      return res.status(404).json({ message: 'Course not found' });
    }
    console.log('Course found:', course.id, course.title);

    // Use the correct association method
    await user.addEnrolledCourse(course, { 
      through: { 
        progress: 0,
        enrolledAt: new Date()
      } 
    });
    
    console.log(`User ${userId} enrolled in course ${courseId} successfully`);
    res.status(200).json({ message: 'User enrolled in course successfully' });
  } catch (error) {
    console.error('Error in enrollUserInCourse:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error enrolling user in course', error: error.message });
  }
};


exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching courses for user with id: ${userId}`);
    const user = await db.User.findByPk(userId, {
      include: [{
        model: db.Course,
        as: 'enrolledCourses',
        through: {
          model: db.UserCourse,
          attributes: ['progress']
        },
        include: [{ 
          model: db.Module, 
          as: 'modules',
          include: [{ 
            model: db.Unit,
            as: 'units'
          }] 
        }]
      }]
    });

    if (!user) {
      console.log(`User with id ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    const courses = user.enrolledCourses.map(course => ({
      ...course.toJSON(),
      progress: course.UserCourse.progress
    }));

    console.log(`Found ${courses.length} courses for user ${userId}`);
    res.json(courses);
  } catch (error) {
    console.error('Error in getUserCourses:', error);
    res.status(500).json({ message: 'Error fetching user courses', error: error.message });
  }
};


exports.updateUserCourseProgress = async (req, res) => {
  try {
    const { userId, courseId, moduleId } = req.params;
    const { progress } = req.body;
    console.log(`Updating progress for user ${userId}, course ${courseId}, module ${moduleId}`);

    const userCourse = await db.UserCourse.findOne({
      where: { userId, courseId },
      include: [{
        model: db.Course,
        include: [{ 
          model: db.Module,
          as: 'modules'
        }]
      }]
    });

    if (!userCourse) {
      console.log(`User ${userId} not enrolled in course ${courseId}`);
      return res.status(404).json({ message: 'User not enrolled in this course' });
    }

    // Update the progress for the specific module
    const moduleToUpdate = userCourse.Course.modules.find(m => m.id === moduleId);
    if (moduleToUpdate) {
      moduleToUpdate.progress = progress;
      await moduleToUpdate.save();
      console.log(`Updated progress for module ${moduleId}`);
    } else {
      console.log(`Module ${moduleId} not found in course ${courseId}`);
      return res.status(404).json({ message: 'Module not found in this course' });
    }

    // Calculate overall course progress
    const totalModules = userCourse.Course.modules.length;
    const moduleProgresses = userCourse.Course.modules.map(m => m.progress || 0);
    const overallProgress = totalModules > 0 ? moduleProgresses.reduce((sum, p) => sum + p, 0) / totalModules : 0;

    // Update UserCourse progress
    userCourse.progress = overallProgress;
    await userCourse.save();

    console.log(`Updated overall progress for user ${userId} in course ${courseId}`);
    res.status(200).json({ 
      message: 'Progress updated successfully', 
      moduleProgress: progress,
      overallProgress: overallProgress 
    });
  } catch (error) {
    console.error('Error in updateUserCourseProgress:', error);
    res.status(500).json({ message: 'Error updating course progress', error: error.message });
  }
};


exports.getModuleById = async (req, res) => {
  try {
    const { userId, courseId, moduleId } = req.params;
    console.log(`Fetching module ${moduleId} for user ${userId} in course ${courseId}`);

    // First, check if the user is enrolled in the course
    const userCourse = await db.UserCourse.findOne({
      where: { userId, courseId }
    });

    if (!userCourse) {
      console.log(`User ${userId} not enrolled in course ${courseId}`);
      return res.status(404).json({ message: 'User is not enrolled in this course' });
    }

    // Then, fetch the module
    const module = await db.Module.findOne({
      where: { id: moduleId, courseId: courseId },
      include: [{ 
        model: db.Unit, 
        as: 'units',
        attributes: ['id', 'title', 'type', 'content', 'order', 'duration']
      }],
      order: [[{ model: db.Unit, as: 'units' }, 'order', 'ASC']]
    });

    if (!module) {
      console.log(`Module ${moduleId} not found in course ${courseId}`);
      return res.status(404).json({ message: 'Module not found' });
    }

    // Ensure units is always an array
    module.units = module.units || [];

    console.log(`Module ${moduleId} fetched successfully`);
    res.json(module);
  } catch (error) {
    console.error('Error in getModuleById:', error);
    res.status(500).json({ message: 'Error fetching module', error: error.message });
  }
};

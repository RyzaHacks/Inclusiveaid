const db = require('../config/database');
const Resource = db.Resource;

// Get all resources
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll({
            attributes: ['id', 'title', 'description', 'content', 'videoUrl', 'createdAt', 'updatedAt']
        });
        if (resources.length === 0) {
            return res.status(404).json({ message: 'No resources found' });
        }
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
};

// Get a single resource by ID
exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id, {
            attributes: ['id', 'title', 'description', 'content', 'videoUrl', 'createdAt', 'updatedAt']
        });
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
};

// Create a new resource
exports.createResource = async (req, res) => {
    try {
        const { title, description, content, videoUrl } = req.body;

        // Validation
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const newResource = await Resource.create({ title, description, content, videoUrl });
        res.status(201).json(newResource);
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ error: 'Failed to create resource' });
    }
};

// Update a resource by ID
exports.updateResource = async (req, res) => {
    try {
        const { title, description, content, videoUrl } = req.body;
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        resource.title = title !== undefined ? title : resource.title;
        resource.description = description !== undefined ? description : resource.description;
        resource.content = content !== undefined ? content : resource.content;
        resource.videoUrl = videoUrl !== undefined ? videoUrl : null;  // Explicitly set to null if videoUrl is not provided

        await resource.save();
        res.status(200).json(resource);
    } catch (error) {
        console.error('Error updating resource:', error);
        res.status(500).json({ error: 'Failed to update resource' });
    }
};

// Delete a resource by ID
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await resource.destroy();
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
};

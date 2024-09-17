import React, { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUpload, FaBook, FaEdit, FaSearch, FaArrowLeft, FaArrowRight, FaBold, FaItalic, FaUnderline, FaStrikethrough, FaAlignLeft, FaAlignCenter, FaAlignRight, FaListOl, FaListUl, FaImage, FaLink } from 'react-icons/fa';
import api from '../../utils/api';

const ManageResourcesModal = ({ isOpen, onClose, onManageResources }) => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState(''); // HTML content
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Image URL for embedding
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resourcesPerPage] = useState(5); // Number of resources per page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchResources();
    }
  }, [isOpen]);

  useEffect(() => {
    filterResources();
  }, [searchTerm, resources, currentPage]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users/resources');
      setResources(response.data);
      setFilteredResources(response.data);
      if (response.data.length === 0) {
        setError('No resources found');
      } else {
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      setError('Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = resources.filter(resource =>
      resource.title.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredResources(filteredData.slice((currentPage - 1) * resourcesPerPage, currentPage * resourcesPerPage));
  };

  const handleSelectResource = (resource) => {
    setSelectedResource(resource);
    setTitle(resource.title);
    setDescription(resource.description);
    setContent(resource.content); // Load the content in HTML format
    setVideoUrl(resource.videoUrl);
    setImageUrl(''); // Reset image URL
    setIsEditing(false);
  };

  const handleEditResource = () => {
    setIsEditing(true);
  };

  const handleSaveResource = async () => {
    try {
      const response = await api.put(`/api/users/resources/${selectedResource.id}`, {
        title,
        description,
        content, // Save the HTML content
        videoUrl,
      });
      if (response.status === 200) {
        fetchResources(); // Refresh resources after save
        setIsEditing(false);
        setSelectedResource(response.data); // Update selected resource with saved data
      } else {
        throw new Error('Failed to save resource. Please try again.');
      }
    } catch (err) {
      console.error('Error saving resource:', err);
      setError('Failed to save resource. Please try again.');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      const response = await api.delete(`/api/users/resources/${resourceId}`);
      if (response.status === 200) {
        fetchResources();
        setSelectedResource(null); // Deselect resource if it was deleted
      } else {
        throw new Error('Failed to delete resource. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
    }
  };

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleImageUpload = () => {
    if (imageUrl) {
      handleCommand('insertImage', imageUrl);
      setImageUrl('');
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-2xl">Manage Resources</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            <FaTimesCircle size={20} />
          </button>
        </div>

        {isLoading ? (
          <div>Loading resources...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : selectedResource ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setSelectedResource(null)}
              >
                &larr; Back to Resources
              </button>
              {!isEditing && (
                <button
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={handleEditResource}
                >
                  <FaEdit className="mr-2" /> Edit Resource
                </button>
              )}
            </div>

            {isEditing ? (
              <div>
                <h4 className="font-bold text-lg mb-2">Edit Resource</h4>
                <input
                  type="text"
                  className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <button className="btn btn-sm" onClick={() => handleCommand('bold')}><FaBold /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('italic')}><FaItalic /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('underline')}><FaUnderline /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('strikeThrough')}><FaStrikethrough /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('justifyLeft')}><FaAlignLeft /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('justifyCenter')}><FaAlignCenter /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('justifyRight')}><FaAlignRight /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('insertOrderedList')}><FaListOl /></button>
                    <button className="btn btn-sm" onClick={() => handleCommand('insertUnorderedList')}><FaListUl /></button>
                    <button className="btn btn-sm" onClick={handleImageUpload}><FaImage /></button>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    className="border border-gray-300 rounded-md p-4 min-h-[200px]"
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
                <input
                  type="text"
                  className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                  placeholder="Video URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <button
                  className="btn btn-success mr-4"
                  onClick={handleSaveResource}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="prose max-w-none">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">{selectedResource.title}</h2>
                <div
                  className="text-lg text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedResource.content }} // Render HTML content
                />
                {selectedResource.videoUrl && (
                  <div className="mt-6">
                    <iframe
                      width="100%"
                      height="450px"
                      src={selectedResource.videoUrl.replace("watch?v=", "embed/")}
                      title={selectedResource.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 rounded-full shadow-lg"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleSelectResource(resource)}
                >
                  <div className="flex items-center mb-4">
                    <FaBook className="text-blue-500 text-3xl mr-2" />
                    <h3 className="text-xl font-semibold">{resource.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                className="btn btn-sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaArrowLeft /> Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {Math.ceil(resources.length / resourcesPerPage)}
              </span>
              <button
                className="btn btn-sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(resources.length / resourcesPerPage)}
              >
                Next <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageResourcesModal;

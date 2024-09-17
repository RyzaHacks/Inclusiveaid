import React, { useState, useEffect } from 'react';
import { FaSearch, FaBook, FaTextHeight, FaFont } from 'react-icons/fa';
import api from '../../utils/api';

const ResourcesCenter = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [fontSize, setFontSize] = useState('text-base');
  const [fontFamily, setFontFamily] = useState('font-sans');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/api/users/resources');
        setResources(response.data);
      } catch (err) {
        setError('Failed to fetch resources');
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const handleFontFamilyChange = (family) => {
    setFontFamily(family);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-800 mb-12 text-center">Resources Center</h2>
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
          {!selectedResource && (
            <>
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 pl-12 rounded-full shadow-lg"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {loading && <div>Loading...</div>}
              {error && <div className="text-red-500 text-center">{error}</div>}
              
              {!loading && filteredResources.length === 0 && (
                <div className="text-center text-gray-600">No resources found.</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => (
                  <div 
                    key={resource.id} 
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="flex items-center mb-4">
                      <FaBook className="text-blue-500 text-3xl mr-2" />
                      <h3 className="text-xl font-semibold">{resource.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedResource && (
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedResource(null)}
                >
                  &larr; Back to Resources
                </button>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FaTextHeight className="mr-2 text-gray-500" />
                    <select
                      value={fontSize}
                      onChange={(e) => handleFontSizeChange(e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="text-sm">Small</option>
                      <option value="text-base">Medium</option>
                      <option value="text-lg">Large</option>
                      <option value="text-xl">Extra Large</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <FaFont className="mr-2 text-gray-500" />
                    <select
                      value={fontFamily}
                      onChange={(e) => handleFontFamilyChange(e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="font-sans">Sans Serif</option>
                      <option value="font-serif">Serif</option>
                      <option value="font-mono">Monospace</option>
                    </select>
                  </div>
                </div>
              </div>
              <h2 className={`text-4xl font-bold text-gray-800 mb-6 ${fontFamily}`}>{selectedResource.title}</h2>
              <div className={`prose max-w-none ${fontSize} ${fontFamily} leading-relaxed text-gray-700`}>
                <div dangerouslySetInnerHTML={{ __html: selectedResource.content }} /> {/* Render HTML content */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesCenter;

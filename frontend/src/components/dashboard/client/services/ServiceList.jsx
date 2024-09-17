import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceList = ({ services, onViewDetails, serviceName }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {services.map((service) => (
      <ServiceCard 
        key={service.id} 
        service={service} 
        onViewDetails={onViewDetails} 
        serviceName={serviceName}
      />
    ))}
  </div>
);

export default ServiceList;
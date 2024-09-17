// ServicesPDF.js

import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from '../../../../styles/pdfStyles';

const ServicesPDF = ({ services, selectedSections, userInfo }) => {
  const renderHeader = () => (
    <View style={styles.header}>
      <Image src="/path/to/logo.png" style={styles.logo} />
      <Text style={styles.headerTitle}>InclusiveAid</Text>
      <Text style={styles.headerSubtitle}>Service Report</Text>
    </View>
  );

  const renderWelcomeMessage = () => (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeText}></Text>
      <Text style={styles.welcomeBody}>
        This report provides a comprehensive overview of your InclusiveAid services. It includes your service history, upcoming appointments, and personalized insights to optimize your care experience.
      </Text>
    </View>
  );

  const renderServicesOverview = () => {
    const totalServices = services.length;
    const completedServices = services.filter(s => s.status === 'completed').length;
    const upcomingServices = services.filter(s => s.status === 'pending').length;
    const totalSpent = services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const avgDuration = services.reduce((sum, s) => sum + (parseInt(s.duration) || 0), 0) / totalServices || 0;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Summary</Text>
        <View style={styles.overviewGrid}>
          {[
            { label: 'Total Services', value: totalServices },
            { label: 'Completed', value: completedServices },
            { label: 'Upcoming', value: upcomingServices },
            { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}` },
            { label: 'Avg. Duration', value: `${avgDuration.toFixed(0)} min` },
          ].map((item, index) => (
            <View key={index} style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{item.value}</Text>
              <Text style={styles.overviewLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderServicesList = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Service Details</Text>
      {services.map((service, index) => (
        <View key={index} style={styles.serviceItem}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <Text style={[styles.serviceStatus, styles[service.status]]}>
              {service.status === 'completed' ? 'Completed' : 'Scheduled'}
            </Text>
          </View>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceDetailItem}>Date: {new Date(service.date).toLocaleDateString()}</Text>
            <Text style={styles.serviceDetailItem}>Time: {service.time}</Text>
            <Text style={styles.serviceDetailItem}>Duration: {service.duration} minutes</Text>
            <Text style={styles.serviceDetailItem}>Cost: ${service.price}</Text>
            {service.location && <Text style={styles.serviceDetailItem}>Location: {service.location}</Text>}
            {service.serviceWorker && <Text style={styles.serviceDetailItem}>Provider: {service.serviceWorker.name}</Text>}
          </View>
          {service.notesContent && (
            <View style={styles.serviceNotesSection}>
              <Text style={styles.serviceNotesText}>Notes: {service.notesContent}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderUpcomingServices = () => {
    const upcoming = services.filter(s => new Date(s.date) > new Date()).slice(0, 5);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Services</Text>
        {upcoming.length > 0 ? (
          upcoming.map((service, index) => (
            <Text key={index} style={styles.upcomingServiceItem}>
              • {service.name} on {new Date(service.date).toLocaleDateString()} at {service.time}
            </Text>
          ))
        ) : (
          <Text style={styles.insightText}>No upcoming services scheduled at this time.</Text>
        )}
      </View>
    );
  };

  const renderServiceInsights = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Care Insights</Text>
      <Text style={styles.insightText}>
        Based on your service history, we've observed that you tend to schedule services most frequently on {getMostFrequentDay(services)}. 
        Consider booking your next appointments on this day for consistency in your care routine.
      </Text>
      <Text style={styles.insightText}>
        Your average service duration is {getAverageServiceDuration(services)} minutes. 
        This information can help you plan your schedule around future appointments more effectively.
      </Text>
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.insightText}>
        1. Schedule Follow-ups: Regular check-ins can significantly improve your care outcomes.
      </Text>
      <Text style={styles.insightText}>
        2. Explore Additional Services: Based on your history, you might benefit from our [Suggested Service] offering.
      </Text>
      <Text style={styles.insightText}>
        3. Provide Feedback: Your input helps us tailor our services to better meet your needs.
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        {renderWelcomeMessage()}
        {renderServicesOverview()}
        {selectedSections.overview && renderServicesList()}
        {renderUpcomingServices()}
        {renderServiceInsights()}
        {renderRecommendations()}
        <Text style={styles.footer}>
          InclusiveAid | Empowering Through Personalized Care | Report Generated: {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

// Helper functions
const getMostFrequentDay = (services) => {
  // Logic to determine the most frequent day of service
  // This is a placeholder and should be implemented based on your data structure
  return "Wednesdays";
};

const getAverageServiceDuration = (services) => {
  const totalDuration = services.reduce((sum, service) => sum + (parseInt(service.duration) || 0), 0);
  return Math.round(totalDuration / services.length);
};

export default ServicesPDF;
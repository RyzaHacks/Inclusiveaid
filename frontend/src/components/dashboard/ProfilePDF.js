// ProfilePDF.js

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#0056b3',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#17a2b8',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  serviceItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
});

// Create Document Component
const ProfilePDF = ({ userData, services, options }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image
        style={styles.logo}
        src="/path/to/your/logo.png"
      />
      <Text style={styles.header}>User Profile</Text>
      
      {options.personalInfo && (
        <View style={styles.section}>
          <Text style={styles.subheader}>Personal Information</Text>
          <Text style={styles.text}><Text style={styles.bold}>Name:</Text> {userData.name}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Email:</Text> {userData.email}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Phone:</Text> {userData.phoneNumber}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Address:</Text> {userData.address}</Text>
          <Text style={styles.text}><Text style={styles.bold}>NDIS Number:</Text> {userData.ndisNumber}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Date of Birth:</Text> {userData.dateOfBirth ? format(new Date(userData.dateOfBirth), 'dd/MM/yyyy') : 'Not provided'}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Emergency Contact:</Text> {userData.emergencyContact}</Text>
        </View>
      )}

      {options.services && services.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subheader}>Services</Text>
          {services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.text}><Text style={styles.bold}>Service Name:</Text> {service.name}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Category:</Text> {service.category}</Text>
              {service.client && (
                <Text style={styles.text}><Text style={styles.bold}>Client:</Text> {service.client.name} ({service.client.email})</Text>
              )}
              {service.serviceWorker && (
                <Text style={styles.text}><Text style={styles.bold}>Service Worker:</Text> {service.serviceWorker.name} ({service.serviceWorker.email})</Text>
              )}
              {service.assignedWorkers && service.assignedWorkers.length > 0 && (
                <View>
                  <Text style={[styles.text, styles.bold]}>Assigned Workers:</Text>
                  {service.assignedWorkers.map((worker, workerIndex) => (
                    <Text key={workerIndex} style={styles.text}>- {worker.name} ({worker.email})</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.text, { textAlign: 'center', marginTop: 20 }]}>
        Generated on {format(new Date(), 'dd/MM/yyyy HH:mm')}
      </Text>
    </Page>
  </Document>
);

export default ProfilePDF;
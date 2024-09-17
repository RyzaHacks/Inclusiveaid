import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register custom fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 12,
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: 2,
    borderBottomColor: '#3f51b5',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
    color: '#1a237e',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 500,
    marginBottom: 16,
    color: '#283593',
    borderBottom: 2,
    borderBottomColor: '#3f51b5',
    paddingBottom: 8,
  },
  text: {
    marginBottom: 6,
    color: '#37474f',
    lineHeight: 1.5,
  },
  infoBox: {
    backgroundColor: '#e8eaf6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    border: 1,
    borderColor: '#c5cae9',
  },
  infoTitle: {
    fontWeight: 500,
    marginBottom: 6,
    color: '#3f51b5',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#78909c',
    fontSize: 10,
    borderTop: 1,
    borderTopColor: '#cfd8dc',
    paddingTop: 10,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowHeader: {
    backgroundColor: '#e3f2fd',
  },
  tableCol: {
    width: '50%',
    padding: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdbdbd',
  },
  tableCell: {
    fontSize: 10,
  },
  headerCell: {
    fontWeight: 500,
    color: '#1565c0',
  },
});

const NDISPlanPDF = ({ planData, selectedSections }) => {
  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return `$${amount.toLocaleString()}`;
    }
    return 'N/A';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateRemainingBudget = (total, used) => {
    if (typeof total === 'number' && typeof used === 'number') {
      return total - used;
    }
    return null;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Your NDIS Plan</Text>
        </View>

        {selectedSections.overview && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Plan Overview</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Plan Details</Text>
              <Text style={styles.text}>Start Date: {formatDate(planData.startDate)}</Text>
              <Text style={styles.text}>End Date: {formatDate(planData.endDate)}</Text>
              <Text style={styles.text}>Status: {planData.status}</Text>
              {planData.reviewDate && (
                <Text style={styles.text}>Plan Review Due: {formatDate(planData.reviewDate)}</Text>
              )}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Budget Summary</Text>
              <Text style={styles.text}>Total Budget: {formatCurrency(planData.totalBudget)}</Text>
              <Text style={styles.text}>Used Budget: {formatCurrency(planData.usedBudget)}</Text>
              <Text style={styles.text}>
                Remaining Budget: {formatCurrency(calculateRemainingBudget(planData.totalBudget, planData.usedBudget))}
              </Text>
            </View>
          </View>
        )}

        {selectedSections.fundingCategories && planData.fundingCategories && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Funding Categories</Text>
            {Object.entries(planData.fundingCategories).map(([category, budget]) => {
              const used = budget.used || 0;
              const total = budget.total || budget;
              return (
                <View key={category} style={styles.infoBox}>
                  <Text style={styles.infoTitle}>{category}</Text>
                  <Text style={styles.text}>Total: {formatCurrency(total)}</Text>
                  <Text style={styles.text}>Used: {formatCurrency(used)}</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${(used / total) * 100}%` }]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {selectedSections.goals && planData.goals && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Plan Goals</Text>
            {planData.goals.map((goal, index) => (
              <View key={index} style={styles.infoBox}>
                <Text style={styles.infoTitle}>{goal.category}</Text>
                <Text style={styles.text}>{goal.description}</Text>
              </View>
            ))}
          </View>
        )}

        {selectedSections.serviceWorker && planData.assignedServiceWorker && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Assigned Service Worker</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Contact Information</Text>
              <Text style={styles.text}>Name: {planData.assignedServiceWorker.name}</Text>
              <Text style={styles.text}>Email: {planData.assignedServiceWorker.email}</Text>
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          This document is a summary of your NDIS plan. For full details, please refer to your official NDIS documentation.
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

export default NDISPlanPDF;
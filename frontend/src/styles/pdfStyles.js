import { StyleSheet } from '@react-pdf/renderer';

const colors = {
  primary: '#0056b3',
  secondary: '#17a2b8',
  text: '#333333',
  lightText: '#6c757d',
  background: '#ffffff',
  lightBackground: '#f8f9fa',
  completed: '#28a745',
  pending: '#ffc107',
  cancelled: '#dc3545',
};

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: colors.background,
    color: colors.text,
  },
  header: {
    marginBottom: 30,
    borderBottom: `2pt solid ${colors.primary}`,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    borderBottom: `1pt solid ${colors.secondary}`,
    paddingBottom: 5,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '30%',
    backgroundColor: colors.lightBackground,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  overviewLabel: {
    fontSize: 10,
    color: colors.lightText,
  },
  serviceItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: colors.lightBackground,
    borderRadius: 5,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  serviceStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: '2 5',
    borderRadius: 3,
  },
  completed: {
    color: colors.completed,
    backgroundColor: `${colors.completed}22`,
  },
  pending: {
    color: colors.pending,
    backgroundColor: `${colors.pending}22`,
  },
  cancelled: {
    color: colors.cancelled,
    backgroundColor: `${colors.cancelled}22`,
  },
  serviceDetails: {
    marginLeft: 10,
  },
  serviceDetailItem: {
    fontSize: 9,
    marginBottom: 2,
    color: colors.lightText,
  },
  serviceNotesSection: {
    marginTop: 5,
    padding: 5,
    backgroundColor: colors.background,
    borderRadius: 3,
  },
  serviceNotesText: {
    fontSize: 8,
    fontStyle: 'italic',
    color: colors.lightText,
  },
  insightText: {
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  insightSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: colors.secondary,
  },
  upcomingServiceItem: {
    fontSize: 9,
    marginBottom: 2,
    color: colors.lightText,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: colors.lightText,
  },
  calendarContainer: {
    marginTop: 10,
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: colors.primary,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    backgroundColor: colors.lightBackground,
    padding: 5,
  },
  calendarHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  calendarGrid: {
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  calendarWeek: {
    flexDirection: 'row',
    height: 30,
  },
  calendarDay: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.lightText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayText: {
    fontSize: 8,
    color: colors.text,
  },
  serviceDay: {
    backgroundColor: `${colors.secondary}22`,
  },
  serviceIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
});
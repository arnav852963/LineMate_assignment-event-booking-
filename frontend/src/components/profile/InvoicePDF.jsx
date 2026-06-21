import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    borderBottom: '2 solid #ea580c',
    paddingBottom: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleContainer: {},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1917',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: '#78716c',
    marginTop: 6,
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ea580c',
    marginBottom: 10,
    letterSpacing: 1,
  },
  text: {
    fontSize: 12,
    color: '#44403c',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e7e5e4',
    paddingVertical: 10,
  },
  tableHeader: {
    backgroundColor: '#f5f5f4',
    paddingVertical: 10,
    borderBottom: '2 solid #d6d3d1',
  },
  col1: { width: '40%', paddingLeft: 12 },
  col2: { width: '30%' },
  col3: { width: '30%', textAlign: 'right', paddingRight: 12 },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#57534e',
    textTransform: 'uppercase',
  },
  totalRow: {
    flexDirection: 'row',
    paddingTop: 16,
    marginTop: 8,
  },
  totalText: {
    width: '70%',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 20,
    color: '#1c1917',
  },
  totalValue: {
    width: '30%',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ea580c',
    paddingRight: 12,
  },
  watermark: {
    position: 'absolute',
    top: 350,
    left: 80,
    opacity: 0.08,
    transform: 'rotate(-45deg)',
    fontSize: 90,
    color: '#dc2626',
    fontWeight: 'bold',
    letterSpacing: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1 solid #e7e5e4',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 9,
    color: '#a8a29e',
  },
});

const getSeatTier = (seatId) => {
  const match = seatId.match(/R(\d+)-S\d+/);
  const rowNum = match ? parseInt(match[1], 10) : 1;
  if (rowNum <= 5) return 'Premium';
  if (rowNum <= 10) return 'Gold';
  return 'Silver';
};

export default function InvoicePDF({ booking, normalizedSeats, totalAmount }) {
  const { event, _id, createdAt, status } = booking;
  const isCancelled = status === 'CANCELLED';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isCancelled && <Text style={styles.watermark}>CANCELLED</Text>}

        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>TICKET INVOICE</Text>
            <Text style={styles.subtitle}>Booking Reference: {_id}</Text>
            <Text style={styles.subtitle}>Date Issued: {new Date().toLocaleDateString()}</Text>
          </View>
          <View>
            <Text style={styles.brand}>LineMate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EVENT DETAILS</Text>
          <Text style={[styles.text, { fontWeight: 'bold', color: '#1c1917', fontSize: 14 }]}>
            {event.name}
          </Text>
          <Text style={styles.text}>
            {new Date(event.dateTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
          <Text style={styles.text}>{event.venue}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.headerText, styles.col1]}>Seat Identification</Text>
            <Text style={[styles.headerText, styles.col2]}>Seating Tier</Text>
            <Text style={[styles.headerText, styles.col3]}>Amount</Text>
          </View>

          {normalizedSeats.map((seat, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.text, styles.col1]}>{seat.seatId}</Text>
              <Text style={[styles.text, styles.col2]}>{getSeatTier(seat.seatId)}</Text>
              <Text style={[styles.text, styles.col3]}>INR {seat.price}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>GRAND TOTAL</Text>
            <Text style={styles.totalValue}>INR {totalAmount}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for booking with LineMate. This is a computer generated invoice and requires
            no signature.
          </Text>
          {isCancelled && (
            <Text style={[styles.footerText, { color: '#dc2626', marginTop: 4 }]}>
              This booking has been cancelled and tickets are no longer valid.
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

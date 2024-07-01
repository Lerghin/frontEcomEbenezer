import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20
  },
  section: {
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10
  }
});

// Create Document Component
const Invoice = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Image src="/imagenes/ebenezer.jpg" style={styles.logo} />
        <Text style={styles.title}>Factura de Venta</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalles del Cliente:</Text>
        <Text style={styles.text}>Nombre: {data.nombre}</Text>
        <Text style={styles.text}>Apellido: {data.apellido}</Text>
        <Text style={styles.text}>Teléfono: {data.telefono}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalles del Producto:</Text>
        <Text style={styles.text}>Producto: {data.producto}</Text>
        <Text style={styles.text}>Precio: {data.precio}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Total a Pagar:</Text>
        <Text style={styles.text}>Total: {data.total}</Text>
      </View>
    </Page>
  </Document>
);

export default Invoice;
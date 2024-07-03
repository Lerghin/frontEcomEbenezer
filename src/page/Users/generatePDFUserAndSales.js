import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoBase64 from '../../../public/imagenes/ebenezer.jpg'; // Asegúrate de que este es el logotipo en base64

export const generatePDFUserAndSales = (user, salesList, address) => {
  const doc = new jsPDF();

  // Agregar el logotipo
  doc.addImage(logoBase64, 'PNG', 10, 10, 50, 20); // Ajusta las dimensiones y posición según tus necesidades

  // Encabezado
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("Detalles del Usuario", 70, 30);

  // Detalles del usuario
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre Completo: ${user.name} ${user.lastName}`, 10, 50);
  doc.text(`Cédula: ${user.dni}`, 10, 60);
  doc.text(`Teléfono: ${user.phone}`, 10, 70);
  doc.text(`Email: ${user.email}`, 10, 80);

  // Detalles de las direcciones
  if (address.length > 0) {
    doc.text("Direcciones:", 10, 90);
    address.forEach((address, index) => {
      const yPosition = 100 + (index * 10); // Ajusta la posición Y para cada dirección
      doc.text(`- ${address.direccion}, ${address.parroquia}, ${address.municipio}, ${address.estado}`, 10, yPosition);
    });
  } else {
    doc.text("Direcciones: No disponibles.", 10, 90);
  }

  if (salesList.length > 0) {
    // Encabezado de ventas
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Ventas Realizadas", 10, 120);

    const tableColumn = ["Fecha de Pago", "Método de Pago", "Monto Depositado", "Referencia de Pago", "Productos"];
    const tableRows = [];

    salesList.forEach(sale => {
      const productsDetails = sale.productos.map(p => `Nombre: ${p.nombre}, Cantidad: ${p.cantidad}, Precio: ${p.precio}$`).join("\n");
      const saleData = [
        new Date(sale.fechaPago).toLocaleDateString(),
        sale.metodoPago,
        sale.montoDepositado,
        sale.referenciaPago,
        productsDetails
      ];
      tableRows.push(saleData);
    });

    // Agregar la tabla de ventas
    doc.autoTable({
      startY: 130, // Ajusta la posición de inicio de la tabla
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [13, 76, 134] }, // Color del encabezado de la tabla
      styles: { fontSize: 10, cellPadding: 4 }, // Estilos generales de la tabla
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Estilos para las filas alternas
    });
  } else {
    doc.text("No hay ventas disponibles.", 10, 120);
  }

  // Guardar el PDF
  doc.save(`Detalles_Usuario_${user.name}_${user.lastName}.pdf`);
};

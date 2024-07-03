import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoBase64 from '../../../public/imagenes/ebenezer.jpg'; // Asegúrate de que este es el logotipo en base64

export const generatePDFONLYSALES = (user, salesList) => {
  const doc = new jsPDF();

  // Agregar el logotipo
  doc.addImage(logoBase64, 'PNG', 10, 10, 50, 20); // Ajusta las dimensiones y posición según tus necesidades

  // Encabezado
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("Compras Realizadas", 70, 30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${user.name} ${user.lastName}`, 10, 50);

 

  if (salesList.length > 0) {
    // Encabezado de ventas
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
  

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
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [13,76,134] }, // Color del encabezado de la tabla
      styles: { fontSize: 10, cellPadding: 4 }, // Estilos generales de la tabla
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Estilos para las filas alternas
    });
  }

  // Guardar el PDF
  doc.save(`Detalles_Usuario_${user.name}_${user.lastName}.pdf`);
};

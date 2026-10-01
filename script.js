document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bill-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const bill = {
      date: formData.get('date'),
      driverName: formData.get('driverName').toString().trim(),
      cabNumber: formData.get('cabNumber').toString().trim(),
      startPlace: formData.get('startPlace').toString().trim(),
      endPlace: formData.get('endPlace').toString().trim(),
      kilometers: Number(formData.get('kilometers')),
      totalAmount: Number(formData.get('totalAmount'))
    };

    generatePdf(bill);
  });
});

function generatePdf(bill) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const leftMargin = 18;
  let y = 20;

  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 28, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text('Taxi Bill', pageWidth / 2, 18, { align: 'center' });

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  y = 40;

  addField(pdf, 'Date', bill.date, leftMargin, y);
  y += 12;
  addField(pdf, 'Driver Name', bill.driverName, leftMargin, y);
  y += 12;
  addField(pdf, 'Cab Number', bill.cabNumber, leftMargin, y);
  y += 12;
  addField(pdf, 'Start Place', bill.startPlace, leftMargin, y);
  y += 12;
  addField(pdf, 'End Place', bill.endPlace, leftMargin, y);
  y += 12;
  addField(pdf, 'Kilometers Run', `${bill.kilometers.toFixed(1)} km`, leftMargin, y);
  y += 12;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(leftMargin, y + 4, pageWidth - leftMargin, y + 4);
  y += 16;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  addField(pdf, 'Total Amount', `₹ ${bill.totalAmount.toFixed(2)}`, leftMargin, y);

  const fileName = `taxi-bill-${bill.date || 'invoice'}.pdf`;
  pdf.save(fileName);
}

function addField(pdf, label, value, x, y) {
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${label}:`, x, y);
  pdf.setFont('helvetica', 'bold');
  const valueText = pdf.splitTextToSize(String(value), 145);
  pdf.text(valueText, x + 50, y);
}

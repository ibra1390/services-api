import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "../../image/LOGOFUNVALosc.png";

export const generateStudentPDF = async (student, servicesWithDetails) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const blueColor = [41, 128, 185];
  const leftCol = 16;
  const rightCol = pageWidth / 2 + 5;

  // Logo y título
  addHeader(doc, pageWidth);

  let yPos = 50;

  // Secciones principales
  yPos = addStudentInfo(
    doc,
    student,
    yPos,
    pageWidth,
    blueColor,
    leftCol,
    rightCol
  );
  yPos = addSchools(doc, student, yPos, pageWidth, blueColor, leftCol);
  yPos = addSupervision(
    doc,
    student,
    yPos,
    pageWidth,
    blueColor,
    leftCol,
    rightCol
  );

  if (student.services && student.services.length > 0) {
    addServicesSection(
      doc,
      student,
      servicesWithDetails,
      yPos,
      pageWidth,
      blueColor,
      leftCol,
      rightCol
    );
  }

  // Guardar PDF
  doc.save(
    `estudiante_${student.id}_${student.f_name}_${student.f_lastname}.pdf`
  );
};

const addHeader = (doc, pageWidth) => {
  const imgWidth = 50;
  const imgHeight = 10;
  doc.addImage(
    logoImage,
    "PNG",
    (pageWidth - imgWidth) / 2,
    10,
    imgWidth,
    imgHeight
  );

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("REPORTE DE ESTUDIANTE", pageWidth / 2, 35, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Fecha de generación: ${new Date().toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    pageWidth / 2,
    41,
    { align: "center" }
  );
};

const createSection = (doc, title, startY, pageWidth, blueColor) => {
  doc.setFillColor(...blueColor);
  doc.rect(14, startY, pageWidth - 28, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title, 16, startY + 5.5);
  doc.setTextColor(0, 0, 0);
  return startY + 8;
};

const addField = (doc, label, value, xPos, yPos) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${label}:`, xPos, yPos);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(value || "N/A", 80);
  doc.text(lines, xPos, yPos + 4);
  return yPos + 4 + lines.length * 4;
};

const addStudentInfo = (
  doc,
  student,
  yPos,
  pageWidth,
  blueColor,
  leftCol,
  rightCol
) => {
  yPos = createSection(doc, "DATOS DEL ESTUDIANTE", yPos, pageWidth, blueColor);
  yPos += 5;

  let leftY = yPos;
  let rightY = yPos;

  leftY = addField(doc, "Nombre Completo", student.full_name, leftCol, leftY);
  rightY = addField(doc, "Email", student.email, rightCol, rightY);

  leftY += 2;
  rightY += 2;

  leftY = addField(
    doc,
    "Teléfono",
    student.phone || "Sin teléfono",
    leftCol,
    leftY
  );
  rightY = addField(
    doc,
    "País",
    student.student?.country?.name || "N/A",
    rightCol,
    rightY
  );

  leftY += 2;
  rightY += 2;

  leftY = addField(doc, "Estado", student.status, leftCol, leftY);

  return Math.max(leftY, rightY) + 8;
};

const addSchools = (doc, student, yPos, pageWidth, blueColor, leftCol) => {
  yPos = createSection(doc, "ESCUELAS", yPos, pageWidth, blueColor);
  yPos += 5;

  if (student.schools && student.schools.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    student.schools.forEach((school) => {
      doc.text(`• ${school.name}`, leftCol, yPos);
      yPos += 5;
    });
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Sin escuelas asignadas", leftCol, yPos);
    yPos += 5;
  }

  return yPos + 5;
};

const addSupervision = (
  doc,
  student,
  yPos,
  pageWidth,
  blueColor,
  leftCol,
  rightCol
) => {
  yPos = createSection(doc, "SUPERVISIÓN", yPos, pageWidth, blueColor);
  yPos += 5;

  let leftY = yPos;
  let rightY = yPos;

  leftY = addField(
    doc,
    "Controller",
    student.student?.controller?.full_name || "N/A",
    leftCol,
    leftY
  );
  rightY = addField(
    doc,
    "Reclutador",
    student.student?.recruiter?.full_name || "N/A",
    rightCol,
    rightY
  );

  return Math.max(leftY, rightY) + 8;
};

const addServicesSection = (
  doc,
  student,
  servicesWithDetails,
  yPos,
  pageWidth,
  blueColor,
  leftCol,
  rightCol
) => {
  yPos = createSection(
    doc,
    "HISTORIAL DE SERVICIOS",
    yPos,
    pageWidth,
    blueColor
  );
  yPos += 5;

  // Resumen estadístico
  const stats = calculateServiceStats(student.services);
  yPos = addServiceStats(doc, stats, yPos, leftCol, rightCol);

  // Tabla de servicios
  addServicesTable(doc, servicesWithDetails, yPos, blueColor);
};

const calculateServiceStats = (services) => {
  return {
    total: services.length,
    totalReported: services.reduce(
      (sum, s) => sum + (s.amount_reported || 0),
      0
    ),
    totalApproved: services.reduce(
      (sum, s) => sum + (s.amount_approved || 0),
      0
    ),
    approved: services.filter((s) => s.status === "Approved").length,
    rejected: services.filter((s) => s.status === "Rejected").length,
    pending: services.filter((s) => s.status === "Pending").length,
  };
};

const addServiceStats = (doc, stats, yPos, leftCol, rightCol) => {
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  let leftY = yPos;
  let rightY = yPos;

  leftY = addField(
    doc,
    "Total de Servicios",
    stats.total.toString(),
    leftCol,
    leftY
  );
  rightY = addField(
    doc,
    "Horas Reportadas",
    stats.totalReported.toString(),
    rightCol,
    rightY
  );

  leftY += 2;
  rightY += 2;

  leftY = addField(doc, "Aprobados", stats.approved.toString(), leftCol, leftY);
  rightY = addField(
    doc,
    "Horas Aprobadas",
    stats.totalApproved.toString(),
    rightCol,
    rightY
  );

  leftY += 2;
  rightY += 2;

  leftY = addField(
    doc,
    "Rechazados",
    stats.rejected.toString(),
    leftCol,
    leftY
  );
  rightY = addField(
    doc,
    "Pendientes",
    stats.pending.toString(),
    rightCol,
    rightY
  );

  return Math.max(leftY, rightY) + 8;
};

const addServicesTable = (doc, servicesWithDetails, yPos, blueColor) => {
  const tableData = servicesWithDetails.map((service) => {
    const createdDate = new Date(service.created_at).toLocaleDateString(
      "es-GT"
    );
    const updatedDate = new Date(service.updated_at).toLocaleDateString(
      "es-GT"
    );
    const reviewer = service.reviewer?.full_name || "N/A";
    const comment = service.comment || "Sin comentarios";
    const categoryName = service.category?.name || "N/A";
    const categoryDesc = service.category?.description || "";

    return [
      service.id,
      `${service.description}\n\nTipo de Servicio: ${categoryName}${
        categoryDesc ? `\n${categoryDesc}` : ""
      }`,
      `Horas Reportadas: ${service.amount_reported || 0}\nHoras Aprobadas: ${
        service.amount_approved || 0
      }\nFecha Creación: ${createdDate}\nÚltima actualización: ${updatedDate}\n\nRevisado por: ${reviewer}\nComentario: ${comment}`,
      service.status,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["ID", "Descripción", "Detalle", "Estado"]],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    headStyles: {
      fillColor: blueColor,
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center", valign: "middle" },
      1: { cellWidth: 65, valign: "top" },
      2: { cellWidth: 70, valign: "top", fontSize: 7 },
      3: {
        cellWidth: 30,
        halign: "center",
        valign: "middle",
        fontStyle: "bold",
      },
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });
};

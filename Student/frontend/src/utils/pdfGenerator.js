import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../assets/img/gymnazu.png';
const COLORS = {
  primary: [91, 62, 49],
  accent: [244, 215, 125],
  lightGray: [245, 245, 245],
  mediumGray: [128, 128, 128],
  darkGray: [51, 51, 51],
  border: [200, 200, 200]
};

// Load logo as base64
const loadLogo = () => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        console.error('Error converting logo:', error);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn('Logo not found, proceeding without logo');
      resolve(null);
    };
    // Try multiple paths
    img.src = Logo;
  });
};

const addSchoolHeader = async (doc, pageWidth, title, subtitle) => {
  try {
    // Add logo on the right side
    const logoData = await loadLogo();
    if (logoData) {
      const logoSize = 20;
      const logoX = pageWidth - logoSize - 14; // 14px from right edge
      doc.addImage(logoData, 'PNG', logoX, 12, logoSize, logoSize);
    }
    
    // School name (centered)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('GYMNAZO CHRISTIAN ACADEMY', pageWidth / 2, 18, { align: 'center' });
    
    // Location (centered)
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.mediumGray);
    doc.text('268 Zabala St. Cor. Luahati St. Tondo, Manila', pageWidth / 2, 24, { align: 'center' });
    
    // Separator line
    const lineY = 36;
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(14, lineY, pageWidth - 14, lineY);
    
    // Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text(title, pageWidth / 2, lineY + 6, { align: 'center' });
    
    // Subtitle
    if (subtitle) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.mediumGray);
      doc.text(subtitle, pageWidth / 2, lineY + 11, { align: 'center' });
    }
    
    doc.setTextColor(0, 0, 0);
    return lineY + (subtitle ? 16 : 11);
  } catch (error) {
    console.error('Error adding header:', error);
    return 50;
  }
};

const addFooter = (doc, pageWidth, pageHeight) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.mediumGray);
  doc.text(`Generated: ${currentDate}`, 14, pageHeight - 12);
  doc.text('Official Document - Gymnazo Christian Academy', pageWidth / 2, pageHeight - 12, { align: 'center' });
};

// Calculate average safely
const calculateAverage = (grades) => {
  const validGrades = grades.filter(g => g !== null && g !== undefined && !isNaN(parseFloat(g)));
  if (validGrades.length === 0) return 'N/A';
  const sum = validGrades.reduce((acc, g) => acc + parseFloat(g), 0);
  return (sum / validGrades.length).toFixed(2);
};

export const generateQuarterGradeSlipPDF = async (gradesData, quarter, studentInfo) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const quarterLabels = { '1': '1st Quarter', '2': '2nd Quarter', '3': '3rd Quarter', '4': '4th Quarter' };
  
  const startY = await addSchoolHeader(doc, pageWidth, 'GRADE SLIP', `${quarterLabels[quarter]} - S.Y. 2025-2026`);

  // Student Information
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Student Information:', 14, startY + 4);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Name: ${studentInfo.name || 'N/A'}`, 14, startY + 9);
  doc.text(`Grade & Section: ${studentInfo.gradeLevel || 'N/A'}`, 14, startY + 14);

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(14, startY + 18, pageWidth - 14, startY + 18);

  // Grades Table
  const quarterKey = `q${quarter}`;
  const tableData = gradesData.subjects.map(subject => {
    const grade = subject[quarterKey];
    const numGrade = parseFloat(grade);
    const remark = !isNaN(numGrade) ? (
      numGrade >= 90 ? 'Excellent' : 
      numGrade >= 85 ? 'Very Good' : 
      numGrade >= 80 ? 'Good' : 
      numGrade >= 75 ? 'Fair' : 'Needs Improvement'
    ) : 'N/A';
    return [subject.name, !isNaN(numGrade) ? numGrade.toString() : 'N/A', remark];
  });

  doc.autoTable({
    startY: startY + 22,
    head: [['Learning Areas', 'Grade', 'Remarks']],
    body: tableData,
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: COLORS.primary,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9,
      lineWidth: 0.1,
      lineColor: COLORS.border
    },
    columnStyles: {
      0: { cellWidth: 115, halign: 'left' },
      1: { cellWidth: 35, halign: 'center', fontStyle: 'bold', fontSize: 10 },
      2: { cellWidth: 35, halign: 'center', fontSize: 8 }
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: COLORS.border,
      lineWidth: 0.1,
      textColor: COLORS.darkGray
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray
    }
  });

  // Quarter Average
  let finalY = doc.lastAutoTable.finalY + 8;
  const quarterGrades = gradesData.subjects.map(s => s[quarterKey]);
  const quarterAverage = calculateAverage(quarterGrades);

  doc.setDrawColor(...COLORS.border);
  doc.line(14, finalY, pageWidth - 14, finalY);
  
  finalY += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Quarter Average:', 14, finalY);
  doc.setFontSize(14);
  doc.text(quarterAverage.toString(), pageWidth - 14, finalY, { align: 'right' });
  
  finalY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const remark = quarterAverage !== 'N/A' && parseFloat(quarterAverage) >= 75 ? 'PASSED' : 'NEEDS IMPROVEMENT';
  doc.text(`Remarks: ${remark}`, 14, finalY);

  addFooter(doc, pageWidth, pageHeight);
  return doc;
};

export const generateCompleteReportPDF = async (gradesData, studentInfo) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const startY = await addSchoolHeader(doc, pageWidth, 'COMPLETE ACADEMIC REPORT', 'S.Y. 2025-2026');

  // Student Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Student Information:', 14, startY + 4);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Name: ${studentInfo.name || 'N/A'}`, 14, startY + 9);
  doc.text(`Grade & Section: ${studentInfo.gradeLevel || 'N/A'}`, 14, startY + 14);

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(14, startY + 18, pageWidth - 14, startY + 18);

  // Complete Grades Table
  const tableData = gradesData.subjects.map(subject => [
    subject.name,
    subject.q1 || '-',
    subject.q2 || '-',
    subject.q3 || '-',
    subject.q4 || '-',
    subject.final || '-'
  ]);

  doc.autoTable({
    startY: startY + 22,
    head: [['Learning Areas', 'Q1', 'Q2', 'Q3', 'Q4', 'Final']],
    body: tableData,
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: COLORS.primary,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: COLORS.border
    },
    columnStyles: {
      0: { cellWidth: 85, halign: 'left' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 28, halign: 'center', fontStyle: 'bold', fontSize: 9 }
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: COLORS.border,
      lineWidth: 0.1,
      textColor: COLORS.darkGray
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray
    }
  });

  // Summary Section
  let finalY = doc.lastAutoTable.finalY + 8;
  
  doc.setDrawColor(...COLORS.border);
  doc.line(14, finalY, pageWidth - 14, finalY);
  
  finalY += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('ACADEMIC SUMMARY', pageWidth / 2, finalY, { align: 'center' });

  finalY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`General Average: ${gradesData.summary.generalAverage || 'N/A'}`, 14, finalY);
  doc.text(`Attendance: ${gradesData.summary.attendanceRate || 0}%`, 14, finalY + 5);
  doc.text(`Days Present: ${gradesData.summary.totalDaysPresent || 0} / ${gradesData.summary.totalDays || 0}`, 14, finalY + 10);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Academic Standing: ${gradesData.summary.academicStanding || 'N/A'}`, 14, finalY + 15);

  // Final Standing
  finalY += 21;
  const avgValue = parseFloat(gradesData.summary.generalAverage);
  const finalStanding = !isNaN(avgValue) && avgValue >= 75 ? 'PROMOTED' : 'RETAINED';
  
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(1);
  doc.line(14, finalY, pageWidth - 14, finalY);
  
  finalY += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(`Final Standing: ${finalStanding}`, pageWidth / 2, finalY, { align: 'center' });

  addFooter(doc, pageWidth, pageHeight);
  return doc;
};

export const generatePreviousYearPDF = async (yearData, studentInfo) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const startY = await addSchoolHeader(doc, pageWidth, 'HISTORICAL ACADEMIC RECORD', yearData.schoolYear);

  // Student Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Student Information:', 14, startY + 4);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Name: ${studentInfo.name || 'N/A'}`, 14, startY + 9);
  doc.text(`Grade Level: ${yearData.gradeLevel || 'N/A'}`, 14, startY + 14);

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(14, startY + 18, pageWidth - 14, startY + 18);

  // Grades Table
  const tableData = yearData.subjects.map(subject => [
    subject.name,
    subject.q1 || '-',
    subject.q2 || '-',
    subject.q3 || '-',
    subject.q4 || '-',
    subject.final || '-',
    subject.remarks || 'N/A'
  ]);

  doc.autoTable({
    startY: startY + 22,
    head: [['Subject', 'Q1', 'Q2', 'Q3', 'Q4', 'Final', 'Remarks']],
    body: tableData,
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: COLORS.primary,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: COLORS.border
    },
    columnStyles: {
      0: { cellWidth: 62, halign: 'left' },
      1: { cellWidth: 17, halign: 'center' },
      2: { cellWidth: 17, halign: 'center' },
      3: { cellWidth: 17, halign: 'center' },
      4: { cellWidth: 17, halign: 'center' },
      5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      6: { cellWidth: 34, halign: 'center', fontSize: 7 }
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: COLORS.border,
      lineWidth: 0.1,
      textColor: COLORS.darkGray
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray
    }
  });

  // Summary
  let finalY = doc.lastAutoTable.finalY + 8;
  
  doc.setDrawColor(...COLORS.border);
  doc.line(14, finalY, pageWidth - 14, finalY);
  
  finalY += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('YEAR SUMMARY', pageWidth / 2, finalY, { align: 'center' });

  finalY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Final Average: ${yearData.summary.finalAverage || 'N/A'}`, 14, finalY);
  doc.text(`Attendance Rate: ${yearData.summary.attendanceRate || 0}%`, 14, finalY + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Academic Standing: ${yearData.summary.academicStanding || 'N/A'}`, 14, finalY + 10);

  addFooter(doc, pageWidth, pageHeight);
  return doc;
};

export const generateGradesPDF = generateCompleteReportPDF;
export const generateSummaryPDF = generateCompleteReportPDF;
export const generatePerformanceReportPDF = generateCompleteReportPDF;

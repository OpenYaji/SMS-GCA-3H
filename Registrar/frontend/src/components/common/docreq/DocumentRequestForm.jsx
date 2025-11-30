import React, { useState } from 'react';
import { Mail, CheckCircle, Clock, FileText } from 'lucide-react';

const DocumentRequestList = () => {
  // 1. YOUR ORIGINAL CONTENT (Mock Data)
  const [requests, setRequests] = useState([
    { 
      id: 101, 
      studentName: "Juan Dela Cruz",
      email: "juan@example.com",
      documentType: "Report Card (Form 138)", 
      purpose: "School Transfer", 
      quantity: 1, 
      deliveryMethod: "Pickup at School",
      status: "Pending",
      date: "2023-10-27"
    },
    { 
      id: 102, 
      studentName: "Maria Clara",
      email: "maria@example.com",
      documentType: "Certificate of Enrollment", 
      purpose: "Visa Application", 
      quantity: 2, 
      deliveryMethod: "Courier Delivery",
      status: "Processing",
      date: "2023-10-28"
    },
    { 
      id: 103, 
      studentName: "Jose Rizal",
      email: "jose@example.com",
      documentType: "Good Moral Character", 
      purpose: "Scholarship", 
      quantity: 1, 
      deliveryMethod: "Email (PDF)",
      status: "Completed",
      date: "2023-10-29"
    }
  ]);

  // 2. YOUR ORIGINAL LOGIC
  const handleSendEmail = (request) => {
    alert(`Generating email for request #${request.id} to ${request.email}...`);
    const subject = `Update on your Request: ${request.documentType}`;
    const body = `Hello ${request.studentName},%0D%0A%0D%0AWe have received your request for ${request.quantity} copy/copies of ${request.documentType}.%0D%0A%0D%0AStatus: ${request.status}%0D%0A%0D%0ARegards,%0D%0ASchool Registrar`;
    window.location.href = `mailto:${request.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px', fontFamily: 'sans-serif'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        
        {/* HEADER: Title Only (Buttons removed) */}
        <div style={{marginBottom: '24px'}}>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#1e293b'}}>Document Requests</h1>
          <p style={{color: '#6b7280', fontSize: '14px', marginTop: '4px'}}>Manage incoming student requests</p>
        </div>

        {/* TABLE CONTAINER */}
        <div style={{overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            
            {/* Table Header */}
            <thead style={{backgroundColor: '#e5e7eb', borderBottom: '2px solid #d1d5db'}}>
              <tr>
                <th style={headerStyle}>Student Name</th>
                <th style={headerStyle}>Document Type</th>
                <th style={headerStyle}>Purpose/Details</th>
                <th style={headerStyle}>Date Submitted</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} style={{borderBottom: '1px solid #e5e7eb', backgroundColor: 'white'}}>
                  
                  {/* Student Name */}
                  <td style={{...cellStyle, fontWeight: '600', color: '#1e293b'}}>
                    {req.studentName}
                    <div style={{fontSize: '11px', color: '#6b7280', fontWeight: 'normal'}}>{req.email}</div>
                  </td>

                  {/* Document Type */}
                  <td style={cellStyle}>{req.documentType}</td>

                  {/* Purpose / Delivery */}
                  <td style={cellStyle}>
                     <div>{req.purpose}</div>
                     <div style={{fontSize: '12px', color: '#6b7280'}}>{req.deliveryMethod}</div>
                  </td>

                  {/* Date */}
                  <td style={cellStyle}>{req.date}</td>

                  {/* Status Badge */}
                  <td style={cellStyle}>
                    <span style={{
                      ...statusBadgeStyle,
                      backgroundColor: req.status === 'Completed' ? '#dcfce7' : req.status === 'Processing' ? '#fef9c3' : '#f3f4f6',
                      color: req.status === 'Completed' ? '#166534' : req.status === 'Processing' ? '#854d0e' : '#374151',
                    }}>
                       {req.status === 'Completed' ? <CheckCircle size={12} style={{marginRight: '4px'}}/> : <Clock size={12} style={{marginRight: '4px'}}/>}
                       {req.status}
                    </span>
                  </td>

                  {/* Actions (Notify Button) */}
                  <td style={cellStyle}>
                    <button 
                      onClick={() => handleSendEmail(req)}
                      style={viewButtonStyle}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <Mail size={16} /> Notify
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---

const headerStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '700',
  color: '#374151',
  textAlign: 'left',
  whiteSpace: 'nowrap'
};

const cellStyle = {
  padding: '16px',
  color: '#4b5563',
  fontSize: '14px',
  verticalAlign: 'middle'
};

const statusBadgeStyle = {
  padding: '4px 12px', 
  borderRadius: '20px', 
  fontSize: '12px', 
  fontWeight: '600',
  display: 'inline-flex',
  alignItems: 'center'
};

const viewButtonStyle = {
  display: 'flex', 
  alignItems: 'center', 
  gap: '6px',
  backgroundColor: 'white', 
  color: '#374151', 
  border: '1px solid #d1d5db', 
  padding: '6px 12px', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  fontSize: '13px', 
  fontWeight: '600',
  transition: 'background-color 0.2s'
};

export default DocumentRequestList;
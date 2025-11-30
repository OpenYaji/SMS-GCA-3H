import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { HOST_IP } from '../../../../config';
const DocumentRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch requests from API using axios
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/records/get_requests.php`
        );
        setRequests(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSendEmail = (request) => {
    alert(`Generating email for request #${request.id} to ${request.email}...`);
    const subject = `Update on your Request: ${request.documentType}`;
    const body = `Hello ${request.studentName},%0D%0A%0D%0AWe have received your request for ${request.quantity} copy/copies of ${request.documentType}.%0D%0A%0D%0AStatus: ${request.status}%0D%0A%0D%0ARegards,%0D%0ASchool Registrar`;
    window.location.href = `mailto:${request.email}?subject=${subject}&body=${body}`;
  };

  if (loading)
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading...</div>;

  if (error)
    return <div style={{ padding: '32px', color: 'red' }}>Error: {error}</div>;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '32px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e293b',
            }}
          >
            Document Requests
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Manage incoming student requests
          </p>
        </div>

        <div
          style={{
            overflowX: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            <thead
              style={{
                backgroundColor: '#e5e7eb',
                borderBottom: '2px solid #d1d5db',
              }}
            >
              <tr>
                <th style={headerStyle}>Student Name</th>
                <th style={headerStyle}>Document Type</th>
                <th style={headerStyle}>Purpose/Details</th>
                <th style={headerStyle}>Date Submitted</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                  }}
                >
                  <td style={{ ...cellStyle, fontWeight: '600', color: '#1e293b' }}>
                    {req.studentName}
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        fontWeight: 'normal',
                      }}
                    >
                      {req.email}
                    </div>
                  </td>

                  <td style={cellStyle}>{req.documentType}</td>

                  <td style={cellStyle}>
                    <div>{req.purpose}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {req.deliveryMethod}
                    </div>
                  </td>

                  <td style={cellStyle}>{req.date}</td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        ...statusBadgeStyle,
                        backgroundColor:
                          req.status === 'Completed'
                            ? '#dcfce7'
                            : req.status === 'Processing'
                            ? '#fef9c3'
                            : '#f3f4f6',
                        color:
                          req.status === 'Completed'
                            ? '#166534'
                            : req.status === 'Processing'
                            ? '#854d0e'
                            : '#374151',
                      }}
                    >
                      {req.status === 'Completed' ? (
                        <CheckCircle size={12} style={{ marginRight: '4px' }} />
                      ) : (
                        <Clock size={12} style={{ marginRight: '4px' }} />
                      )}
                      {req.status}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    <button
                      onClick={() => handleSendEmail(req)}
                      style={viewButtonStyle}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f9fafb')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = 'white')
                      }
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

/* ------------------------- STYLES ------------------------- */

const headerStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  borderBottom: '1px solid #d1d5db',
};

const cellStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#374151',
};

const statusBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '600',
};

const viewButtonStyle = {
  backgroundColor: 'white',
  border: '1px solid #d1d5db',
  padding: '6px 12px',
  fontSize: '13px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: '0.2s ease',
};

export default DocumentRequestList;

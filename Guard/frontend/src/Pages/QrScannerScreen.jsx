import React, { useState, useEffect } from "react";
import { UserCheck, UserX, Clock, Phone, Calendar, User, Mail } from "lucide-react";

const SerialQrScanner = () => {
  const [qrData, setQrData] = useState("");
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [reader, setReader] = useState(null);
  const [port, setPort] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const connectSerial = async () => {
    try {
      setError("");
      setStudent(null);
      
      if (!navigator.serial) {
        setError("Web Serial API not supported in this browser. Please use Chrome, Edge, or Opera.");
        return;
      }

      const serialPort = await navigator.serial.requestPort();
      await serialPort.open({ baudRate: 9600 });
      setPort(serialPort);
      setIsConnected(true);

      const decoder = new TextDecoderStream();
      serialPort.readable.pipeTo(decoder.writable);
      const textReader = decoder.readable.getReader();
      setReader(textReader);

      readSerialData(textReader);
      
    } catch (err) {
      console.error("Serial connection error:", err);
      setError(err.message || "Serial connection failed. Please check if the scanner is connected.");
      setIsConnected(false);
    }
  };

  const readSerialData = async (textReader) => {
    try {
      while (true) {
        const { value, done } = await textReader.read();
        if (done) {
          textReader.releaseLock();
          break;
        }
        if (value) {
          const scanned = value.trim();
          console.log("Raw scanner data:", scanned);
          
          // Filter out non-QR data and look for complete QR codes
          if (scanned.length > 10 && scanned.startsWith('QR-')) {
            setQrData(scanned);
            await processQRCode(scanned);
          }
        }
      }
    } catch (err) {
      console.error('Read error:', err);
      setError('Error reading from scanner. Please reconnect.');
      setIsConnected(false);
    }
  };

  const processQRCode = async (scannedData) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError("");
    
    try {
      console.log("Processing QR:", scannedData);
      
      const response = await fetch(
        "http://localhost/SMS-GCA-3H/guard/backend/server/tap_qr.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ qr_data: scannedData }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw PHP response:", text);

      try {
        const result = JSON.parse(text);
        console.log("Parsed result:", result);
        
        if (result.success) {
          // Transform the student data to match frontend expectations
          const studentData = result.student || {};
          const transformedStudent = {
            ...studentData,
            FullName: studentData.studentName || `${studentData.FirstName || ''} ${studentData.LastName || ''}`.trim(),
            FirstName: studentData.FirstName || studentData.studentName?.split(' ')[0] || '',
            LastName: studentData.LastName || studentData.studentName?.split(' ').slice(1).join(' ') || '',
            StudentNumber: studentData.StudentNumber || 'N/A',
            PhoneNumber: studentData.PhoneNumber || 'N/A',
            QRCodeID: studentData.QRCodeID || scannedData,
            action: result.action || 'checked_in',
            timestamp: new Date().toLocaleTimeString(),
            message: result.message
          };

          setStudent(transformedStudent);
          setStatus(result.message);
          
          // Add to recent scans
          setRecentScans(prev => [
            transformedStudent,
            ...prev.slice(0, 9) // Keep last 10 scans
          ]);
          
          // Clear after 8 seconds
          setTimeout(() => {
            setStudent(null);
            setStatus("");
          }, 8000);
        } else {
          const errorMsg = result.message || "Student not found or already processed";
          setError(errorMsg);
          setTimeout(() => setError(""), 5000);
        }
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr);
        setError(`Invalid response from server. Please check the backend.`);
        setTimeout(() => setError(""), 5000);
      }
    } catch (fetchErr) {
      console.error("Fetch error:", fetchErr);
      setError(`Network error: Cannot connect to server. Please ensure the backend is running.`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const disconnectSerial = async () => {
    try {
      if (reader) {
        await reader.cancel();
        setReader(null);
      }
      if (port) {
        await port.close();
        setPort(null);
      }
      setIsConnected(false);
      setError("");
    } catch (err) {
      console.error("Disconnect error:", err);
      setError("Error disconnecting scanner");
    }
  };

  useEffect(() => {
    return () => {
      if (reader || port) {
        disconnectSerial();
      }
    };
  }, [reader, port]);

  const getStatusColor = (action) => {
    switch (action) {
      case 'checked_in': 
        return 'bg-green-50 border-green-500 text-green-700';
      case 'checked_out': 
        return 'bg-blue-50 border-blue-500 text-blue-700';
      default: 
        return 'bg-gray-50 border-gray-500 text-gray-700';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'checked_in': 
        return <UserCheck className="w-5 h-5" />;
      case 'checked_out': 
        return <UserX className="w-5 h-5" />;
      default: 
        return <User className="w-5 h-5" />;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'checked_in': 
        return 'Checked In';
      case 'checked_out': 
        return 'Checked Out';
      default: 
        return 'Scanned';
    }
  };

  // Manual QR input for testing
  const [manualQr, setManualQr] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualQr.trim()) {
      processQRCode(manualQr.trim());
      setManualQr('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Attendance System</h1>
              <p className="text-gray-600 mt-1">Serial QR Scanner Interface</p>
              <div className="flex items-center gap-4 mt-2">
                {qrData && (
                  <p className="text-sm text-gray-500">
                    Last Scan: <code className="bg-gray-100 px-2 py-1 rounded">{qrData}</code>
                  </p>
                )}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Processing...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {isConnected ? (
                <button
                  onClick={disconnectSerial}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <UserX className="w-4 h-4" />
                  Disconnect Scanner
                </button>
              ) : (
                <button
                  onClick={connectSerial}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Connect Scanner
                </button>
              )}
            </div>
          </div>

          {/* Manual QR Input for Testing */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-gray-800 mb-2">Manual QR Testing</h3>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualQr}
                onChange={(e) => setManualQr(e.target.value)}
                placeholder="Enter QR code manually for testing (e.g., QR-STUDENT-001)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={isProcessing || !manualQr.trim()}
              >
                <Mail className="w-4 h-4" />
                Test Scan
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scan Area */}
          <div className="lg:col-span-2">
            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg animate-fade-in">
                <p className="text-red-700 font-medium">⚠ {error}</p>
              </div>
            )}

            {status && !error && student && (
              <div className={`border-l-4 p-4 mb-4 rounded-r-lg animate-fade-in ${getStatusColor(student.action)}`}>
                <div className="flex items-center gap-2">
                  {getActionIcon(student.action)}
                  <p className="font-medium">{status}</p>
                </div>
              </div>
            )}

            {/* Student Card */}
            {student && (
              <div className="bg-white rounded-lg shadow-xl p-6 mb-6 animate-fade-in">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {student.FirstName?.charAt(0)}{student.LastName?.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {student.FullName}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.action === 'checked_in'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getActionText(student.action)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Student Number</p>
                          <p className="font-semibold">{student.StudentNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">QR Code ID</p>
                          <p className="font-semibold font-mono">{student.QRCodeID}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Contact Number</p>
                          <p className="font-semibold">{student.PhoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Scan Time</p>
                          <p className="font-semibold">{student.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connection States */}
            {!student && !error && isConnected && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
                  <UserCheck className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Scanner Ready
                </h3>
                <p className="text-gray-600 mb-4">
                  Point the QR scanner at a student's QR code
                </p>
                <div className="flex justify-center items-center gap-2 text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Waiting for scan...</span>
                </div>
              </div>
            )}

            {!isConnected && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                  <UserX className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Scanner Disconnected
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect a QR scanner to start recording attendance
                </p>
                <div className="text-xs text-gray-500 max-w-md mx-auto">
                  <p>• Ensure your QR scanner is in USB serial mode</p>
                  <p>• Click "Connect Scanner" and select your device</p>
                  <p>• Works best in Chrome, Edge, or Opera browsers</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Scans Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Scans</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {recentScans.length}
              </span>
            </div>
            <div className="space-y-3">
              {recentScans.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No scans yet</p>
                  <p className="text-gray-400 text-xs mt-1">Scanned students will appear here</p>
                </div>
              ) : (
                recentScans.map((scan, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${
                      scan.action === 'checked_in'
                        ? 'bg-green-50 border-green-500 hover:bg-green-100' 
                        : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm truncate">
                        {scan.FullName}
                      </p>
                      {scan.action === 'checked_in' ? (
                        <UserCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <UserX className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-mono">{scan.StudentNumber}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">{scan.timestamp}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        scan.action === 'checked_in'
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {getActionText(scan.action)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles without JSX attribute */}
      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default SerialQrScanner;
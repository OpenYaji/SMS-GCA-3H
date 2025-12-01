import React, { useState, useEffect } from "react";
import { UserCheck, UserX, Clock, Phone, Calendar, User, Mail, Wifi, WifiOff } from "lucide-react";

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
      case 'already_completed':
        return <Clock className="w-5 h-5" />;
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
      case 'already_completed':
        return 'Completed';
      default:
        return 'Scanned';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'checked_in':
        return 'from-green-400 to-emerald-500';
      case 'checked_out':
        return 'from-blue-400 to-indigo-500';
      case 'already_completed':
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-gray-400 to-gray-500';
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced design */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8 mb-6 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Student Attendance System
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">Real-time QR Code Scanner</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isConnected
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                  }`}>
                  {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  {isConnected ? 'Scanner Connected' : 'Scanner Disconnected'}
                </div>

                {qrData && (
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border-2 border-blue-200">
                    <span className="text-xs font-medium text-blue-700">Last Scan:</span>
                    <code className="text-xs font-mono text-blue-900 font-semibold">{qrData}</code>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border-2 border-amber-200">
                    <div className="w-4 h-4 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-amber-700">Processing...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {isConnected ? (
                <button
                  onClick={disconnectSerial}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  <UserX className="w-5 h-5" />
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={connectSerial}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <UserCheck className="w-5 h-5" />
                  Connect Scanner
                </button>
              )}
            </div>
          </div>

          {/* Manual QR Input */}
          <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-600" />
              Manual QR Testing
            </h3>
            <form onSubmit={handleManualSubmit} className="flex gap-3">
              <input
                type="text"
                value={manualQr}
                onChange={(e) => setManualQr(e.target.value)}
                placeholder="Enter QR code (e.g., QR-STUDENT-001)"
                className="flex-1 px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                disabled={isProcessing || !manualQr.trim()}
              >
                <Mail className="w-5 h-5" />
                Test
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scan Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Messages */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-5 rounded-r-xl shadow-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserX className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-800 font-bold text-lg">Error</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {status && !error && student && (
              <div className={`border-l-4 p-5 rounded-r-xl shadow-lg animate-fade-in ${student.action === 'checked_in'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
                  : student.action === 'checked_out'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500'
                    : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-500'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${student.action === 'checked_in'
                      ? 'bg-green-100'
                      : student.action === 'checked_out'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}>
                    {getActionIcon(student.action)}
                  </div>
                  <p className="font-bold text-lg">{status}</p>
                </div>
              </div>
            )}

            {/* Student Card - Enhanced */}
            {student && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-amber-100 animate-fade-in transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl transform hover:rotate-3 transition-transform">
                    {student.FirstName?.charAt(0)}{student.LastName?.charAt(0)}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {student.FullName}
                      </h2>
                      <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 w-fit bg-gradient-to-r ${getActionColor(student.action)} text-white`}>
                        {getActionIcon(student.action)}
                        {getActionText(student.action)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Student Number</p>
                          <p className="font-bold text-gray-800 text-lg">{student.StudentNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">QR Code</p>
                          <p className="font-bold text-gray-800 font-mono text-sm">{student.QRCodeID}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                          <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Contact</p>
                          <p className="font-bold text-gray-800">{student.PhoneNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Scan Time</p>
                          <p className="font-bold text-gray-800">{student.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connection States */}
            {!student && !error && isConnected && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 md:p-16 text-center animate-fade-in border-2 border-blue-100">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                  <UserCheck className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Scanner Ready
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Point the QR scanner at a student's QR code
                </p>
                <div className="flex justify-center items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}

            {!isConnected && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 md:p-16 text-center animate-fade-in border-2 border-gray-200">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center shadow-xl">
                  <UserX className="w-16 h-16 text-gray-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Scanner Disconnected
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Connect a QR scanner to start recording attendance
                </p>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 max-w-md mx-auto">
                  <div className="space-y-3 text-sm text-gray-700 text-left">
                    <p className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Ensure your QR scanner is in USB serial mode</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Click "Connect Scanner" and select your device</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Works best in Chrome, Edge, or Opera browsers</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Scans Sidebar - Enhanced */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-fit border-2 border-amber-100 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-600" />
                Recent Scans
              </h3>
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm px-4 py-1.5 rounded-full font-bold shadow-md">
                {recentScans.length}
              </span>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {recentScans.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No scans yet</p>
                  <p className="text-gray-400 text-sm mt-2">Scanned students will appear here</p>
                </div>
              ) : (
                recentScans.map((scan, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-lg transform hover:-translate-y-1 cursor-pointer ${scan.action === 'checked_in'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 hover:from-green-100 hover:to-emerald-100'
                        : scan.action === 'checked_out'
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 hover:from-blue-100 hover:to-indigo-100'
                          : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-500 hover:from-gray-100 hover:to-slate-100'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-sm truncate text-gray-800">
                        {scan.FullName}
                      </p>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scan.action === 'checked_in'
                          ? 'bg-green-200'
                          : scan.action === 'checked_out'
                            ? 'bg-blue-200'
                            : 'bg-gray-200'
                        }`}>
                        {scan.action === 'checked_in' ? (
                          <UserCheck className="w-4 h-4 text-green-700" />
                        ) : scan.action === 'checked_out' ? (
                          <UserX className="w-4 h-4 text-blue-700" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-700" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-mono bg-white/50 px-2 py-1 rounded inline-block">
                      {scan.StudentNumber}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scan.timestamp}
                      </p>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${scan.action === 'checked_in'
                          ? 'bg-green-200 text-green-800'
                          : scan.action === 'checked_out'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-800'
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

      {/* Enhanced Animations */}
      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #fbbf24, #f59e0b);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #f59e0b, #d97706);
          }
        `}
      </style>
    </div>
  );
};

export default SerialQrScanner;
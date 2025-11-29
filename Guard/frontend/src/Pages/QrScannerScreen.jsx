import React, { useState } from "react";

const SerialQrScanner = () => {
  const [qrData, setQrData] = useState("");
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const connectSerial = async () => {
    try {
      setError("");
      setStudent(null);

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          const scanned = value.trim();
          setQrData(scanned);

          try {
            const response = await fetch(
              "http://localhost/sms-gca-3h/guard/backend/server/tap_qr.php",
              {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ qr_data: scanned }),
              }
            );

            const text = await response.text();
            console.log("Raw PHP response:", text);

            try {
              const result = JSON.parse(text);
              if (result.success) {
                setStudent(result.student);
                setStatus(result.message); // Tap In / Tap Out message
              } else {
                setError(result.message || "Student not found");
              }
            } catch (jsonErr) {
              setError(`Invalid JSON: ${text.substring(0, 200)}`);
            }
          } catch (fetchErr) {
            setError(`Network error: ${fetchErr.message}`);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Serial connection failed.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">TekLead T-D4 QR Scanner</h1>
      <button
        onClick={connectSerial}
        className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
      >
        Connect T-D4
      </button>

      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
      {qrData && <p className="mb-2">Scanned QR Code ID: <strong>{qrData}</strong></p>}
      {status && <p className="mb-2 font-semibold">{status}</p>}

      {student && (
        <div className="border p-4 rounded-md bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Student Details</h2>
          <p><strong>Name:</strong> {student.studentName}</p>
          <p><strong>Number:</strong> {student.StudentNumber}</p>
          <p><strong>QR Code ID:</strong> {student.QRCodeID}</p>
          <p><strong>Date of Birth:</strong> {student.DateOfBirth}</p>
          <p><strong>Gender:</strong> {student.Gender}</p>
          <p><strong>Nationality:</strong> {student.Nationality}</p>
          <p><strong>Phone:</strong> {student.PhoneNumber}</p>
          {student.TapTimeIn && <p><strong>Tap In:</strong> {student.TapTimeIn}</p>}
          {student.TapTimeOut && <p><strong>Tap Out:</strong> {student.TapTimeOut}</p>}
        </div>
      )}
    </div>
  );
};

export default SerialQrScanner;

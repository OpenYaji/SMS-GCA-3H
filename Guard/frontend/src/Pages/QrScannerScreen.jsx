import React, { useState } from "react";

const SerialQrScanner = () => {
  const [qrData, setQrData] = useState("");
  const [smsStatus, setSmsStatus] = useState("");
  const [error, setError] = useState("");

  const connectSerial = async () => {
    try {
      setError("");
      setSmsStatus("");

      // 1️⃣ Prompt user to select the T-D4 COM port
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 }); // default T-D4 baud rate

      // 2️⃣ Setup text decoder to read serial input
      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();

      // 3️⃣ Read serial data continuously
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          const scanned = value.trim();
          setQrData(scanned);

          // 4️⃣ Send scanned QR to PHP backend
          setSmsStatus("Sending SMS...");
          try {
            const response = await fetch(
              "http://localhost/guardphpwithsms/backend/server/send_sms_from_qr.php",
              {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ qr_data: scanned }),
              }
            );

            const text = await response.text();
            try {
              const result = JSON.parse(text);
             /*  if (response.ok) {
                setSmsStatus(`✅ SMS sent successfully: ${JSON.stringify(result)}`);
              } else {
                setSmsStatus(`❌ SMS failed: ${result.message || "Unknown error"}`);
              } */
            } catch (jsonErr) {
              setSmsStatus(`❌ SMS failed (invalid JSON): ${text.substring(0, 100)}...`);
            }
          } catch (fetchErr) {
            setSmsStatus(`🚨 Network/Error sending SMS: ${fetchErr.message}`);
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
      {qrData && <p className="mb-2">Scanned QR Data: <strong>{qrData}</strong></p>}
      {smsStatus && <p className="mb-2">{smsStatus}</p>}
    </div>
  );
};

export default SerialQrScanner;

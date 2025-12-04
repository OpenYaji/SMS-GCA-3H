import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProcessRequestModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  const [requestData, setRequestData] = useState({
    studentName: student.name || "N/A",
    studentId: student.studentId || "N/A",
    gradeSection: student.gradeLevel || "Grade 7",
    documentType: student.documentType || "Form 137",
    
    parentGuardian: student.parentGuardian || "N/A",
    contact: student.contact || "N/A",
    requestReason: student.requestReason || "Document request",
    requestDate: student.requestDate || new Date().toLocaleDateString(),
    
    pickupDate: new Date(),
    pickupTime: "",
    recipientEmail: student.email || "",
    
    specialInstructions: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setRequestData((prev) => ({ ...prev, pickupDate: date }));
  };

  const handleCompleted = () => {
    if (window.confirm("Mark this request as completed? The document has been released to the student/guardian.")) {
      console.log("Request Completed:", requestData);
      alert("Request marked as completed and moved to Completed Request History!");
      onClose();
    }
  };

  const handleSendEmail = () => {
    if (!requestData.recipientEmail) {
      alert("Please provide an email address for notification.");
      return;
    }
    
    if (!requestData.pickupDate) {
      alert("Please set a pickup date before sending notification.");
      return;
    }

    if (window.confirm(`Send email notification to ${requestData.recipientEmail}?`)) {
      sendEmailNotification(requestData);
      alert("Email notification sent successfully!");
    }
  };

  const sendEmailNotification = (data) => {
    const emailSubject = `Document Ready for Pickup - ${data.documentType}`;
    const pickupDateFormatted = data.pickupDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const emailBody = `
Dear ${data.parentGuardian},

Your requested document (${data.documentType}) for ${data.studentName} (${data.studentId}) is now ready for pickup.

Pickup Details:
- Date: ${pickupDateFormatted}
- Time: ${data.pickupTime || "During office hours (8:00 AM - 5:00 PM)"}
- Location: Gymnazo Christian Academy - Registrar's Office

${data.specialInstructions ? `Special Instructions: ${data.specialInstructions}` : ""}

Please bring a valid ID for verification.

Best regards,
Gymnazo Christian Academy
Registrar's Office
    `.trim();

    console.log("Sending Email to:", data.recipientEmail);
    console.log("Subject:", emailSubject);
    console.log("Body:", emailBody);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-start justify-center p-4 md:p-10 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mt-10 p-6 md:p-8 transform transition-transform duration-300">
        <div className="flex justify-between items-center bg-blue-500 text-white font-extrabold text-lg md:text-xl p-4 -mx-6 -mt-6 md:-mx-8 md:-mt-8 rounded-t-2xl shadow-md">
          <h3 className="tracking-tight">
            Process Document Request - {requestData.studentName}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-4 pt-6 text-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mb-6 text-sm">
            <h4 className="col-span-1 lg:col-span-3 text-md font-extrabold text-blue-600 mb-2 border-b border-blue-100 pb-1">
              Student and Request Details
            </h4>

            <p>
              <span className="font-bold">Student Name:</span>{" "}
              {requestData.studentName}
            </p>
            <p>
              <span className="font-bold">Parent / Guardian:</span>{" "}
              {requestData.parentGuardian}
            </p>
            <p>
              <span className="font-bold">Document Type:</span>{" "}
              {requestData.documentType}
            </p>

            <p>
              <span className="font-bold">Student ID:</span>{" "}
              {requestData.studentId}
            </p>
            <p>
              <span className="font-bold">Contact:</span> {requestData.contact}
            </p>
            <p>
              <span className="font-bold">Request Date:</span>{" "}
              {requestData.requestDate}
            </p>

            <p>
              <span className="font-bold">Grade & Section:</span>{" "}
              {requestData.gradeSection}
            </p>
            <p className="col-span-2">
              <span className="font-bold">Request Reason:</span>{" "}
              {requestData.requestReason}
            </p>
          </div>

          <div className="mb-6 bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-inner">
            <h4 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              📅 Schedule Pickup/Delivery
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Pickup Date *
                </label>
                <DatePicker
                  selected={requestData.pickupDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm cursor-pointer"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Preferred Time (Optional)
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={requestData.pickupTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                📧 Student Email *
              </label>
              <input
                type="email"
                name="recipientEmail"
                value={requestData.recipientEmail}
                onChange={handleInputChange}
                placeholder="student@example.com"
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                required
              />
              <p className="text-xs text-gray-600 mt-1 italic">
                An email notification will be sent to the student with pickup details.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Notification Method
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="notificationPreference"
                    value="email"
                    checked={true}
                    readOnly
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Email Only
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                name="specialInstructions"
                value={requestData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Any special instructions for pickup (e.g., 'Please bring valid ID', 'Authorized representative: Maria Cruz')"
                rows="3"
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-sm font-bold text-gray-900">
              📄 Document Status:{" "}
              <span className="text-green-600">Ready for Release</span>
            </p>
            <p className="text-xs text-gray-600 italic mt-1">
              Document has been prepared and verified. Ready to be released to student.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCompleted}
              className="px-6 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md transform hover:scale-[1.02] active:scale-100"
            >
              ✓ Completed
            </button>
            <button
              onClick={handleSendEmail}
              className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md transform hover:scale-[1.02] active:scale-100"
            >
              📧 Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessRequestModal;
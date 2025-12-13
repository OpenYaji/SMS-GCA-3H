import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const ProcessRequestModal = ({ isOpen, onClose, student, onRequestCompleted }) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !student) return null;

  const [requestData, setRequestData] = useState({
    studentName: student.studentName || "N/A",
    email: student.email || "N/A",
    documentType: student.documentType || "N/A",
    purpose: student.purpose || "N/A",
    requestDate: student.date || new Date().toLocaleDateString(),
    pickupDate: new Date(),
    specialInstructions: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConfirmCompleteModal, setShowConfirmCompleteModal] = useState(false);
  const [showConfirmScheduleModal, setShowConfirmScheduleModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setRequestData((prev) => ({ ...prev, pickupDate: date }));
  };

  const handleCompletedClick = () => {
    setShowConfirmCompleteModal(true);
  };

  const handleConfirmComplete = async () => {
    setShowConfirmCompleteModal(false);
    try {
      setSubmitting(true);
      
      const response = await fetch(`${API_BASE_URL}/complete_request.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: student.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCompletedModal(true);
      } else {
        throw new Error(data.error || "Failed to complete request");
      }
    } catch (error) {
      console.error("Error completing request:", error);
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompletedModalClose = () => {
    setShowCompletedModal(false);
    if (onRequestCompleted) {
      onRequestCompleted();
    }
    onClose();
  };

  const handleSendScheduleClick = () => {
    if (!requestData.email) {
      alert("Please provide an email address for the schedule notification.");
      return;
    }
    
    if (!requestData.pickupDate) {
      alert("Please set a pickup date before sending schedule.");
      return;
    }

    setShowConfirmScheduleModal(true);
  };

  const handleConfirmSchedule = () => {
    setShowConfirmScheduleModal(false);
    sendScheduleNotification(requestData);
    setShowScheduleModal(true);
  };

  const handleScheduleModalClose = () => {
    setShowScheduleModal(false);
  };

  const sendScheduleNotification = (data) => {
    const scheduleSubject = `Document Pickup Schedule - ${data.documentType}`;
    const pickupDateFormatted = data.pickupDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const scheduleBody = `
Dear Student/Guardian,

Your requested document (${data.documentType}) for ${data.studentName} is now ready for pickup.

Pickup Schedule:
- Date: ${pickupDateFormatted}
- Time: 8:00 AM - 5:00 PM (Office Hours)
- Location: Gymnazo Christian Academy - Registrar's Office

${data.specialInstructions ? `Special Instructions: ${data.specialInstructions}` : ""}

Please bring a valid ID for verification.

Best regards,
Gymnazo Christian Academy
Registrar's Office
    `.trim();

    console.log("Sending Schedule to:", data.email);
    console.log("Subject:", scheduleSubject);
    console.log("Body:", scheduleBody);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-85 flex items-start justify-center p-4 md:p-10 z-50 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mt-10 p-6 md:p-8 transform transition-transform duration-300">
          <div className="flex justify-between items-center bg-blue-500 dark:bg-blue-600 text-white font-extrabold text-lg md:text-xl p-4 -mx-6 -mt-6 md:-mx-8 md:-mt-8 rounded-t-2xl shadow-md">
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

          <div className="p-4 pt-6 text-gray-800 dark:text-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6 text-sm">
              <h4 className="col-span-1 sm:col-span-2 text-md font-extrabold text-blue-600 dark:text-blue-400 mb-2 border-b border-blue-100 dark:border-blue-900 pb-1">
                Student and Request Details
              </h4>

              <p>
                <span className="font-bold">Student Name:</span>{" "}
                {requestData.studentName}
              </p>
              <p>
                <span className="font-bold">Email:</span>{" "}
                {requestData.email}
              </p>

              <p>
                <span className="font-bold">Document Type:</span>{" "}
                {requestData.documentType}
              </p>
              <p>
                <span className="font-bold">Request Date:</span>{" "}
                {requestData.requestDate}
              </p>

              <p className="col-span-1 sm:col-span-2">
                <span className="font-bold">Purpose:</span>{" "}
                {requestData.purpose}
              </p>
            </div>

            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-inner">
              <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                📅 Schedule Pickup
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
                  Pickup Date *
                </label>
                <DatePicker
                  selected={requestData.pickupDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm cursor-pointer"
                  required
                />
              </div>

              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
                  Pickup Time
                </label>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  8:00 AM - 5:00 PM (Office Hours)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Fixed operating hours for document pickup
                </p>
              </div>

              

              
            </div>

            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 rounded-lg">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                📄 Document Status:{" "}
                <span className="text-green-600 dark:text-green-400">Ready for Release</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1">
                Document has been prepared and verified. Ready to be released to student.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCompletedClick}
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold bg-green-600 dark:bg-green-700 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-md transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : "✓ Completed"}
              </button>
              <button
                onClick={handleSendScheduleClick}
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📅 Send Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Complete Modal */}
      {showConfirmCompleteModal && (
        <div className="fixed inset-0 bg-gray-900 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-85 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-transform duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                <svg className="h-10 w-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Mark Request as Completed?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The document has been released to the student/guardian.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmCompleteModal(false)}
                  className="flex-1 px-6 py-3 text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmComplete}
                  className="flex-1 px-6 py-3 text-sm font-semibold bg-green-600 dark:bg-green-700 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Send Schedule Modal */}
      {showConfirmScheduleModal && (
        <div className="fixed inset-0 bg-gray-900 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-85 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-transform duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Send Pickup Schedule?
              </h3>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-6 text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold">Date:</span> {requestData.pickupDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <span className="font-bold">Time:</span> 8:00 AM - 5:00 PM
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmScheduleModal(false)}
                  className="flex-1 px-6 py-3 text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSchedule}
                  className="flex-1 px-6 py-3 text-sm font-semibold bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Success Modal */}
      {showCompletedModal && (
        <div className="fixed inset-0 bg-gray-900 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-85 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-transform duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Request Completed!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Request has been marked as completed and moved to Completed Request History.
              </p>
              <button
                onClick={handleCompletedModalClose}
                className="w-full px-6 py-3 text-sm font-semibold bg-green-600 dark:bg-green-700 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-md transform hover:scale-[1.02] active:scale-100"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Sent Success Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-900 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-85 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-transform duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Schedule Sent Successfully!
              </h3>
             
              <button
                onClick={handleScheduleModalClose}
                className="w-full px-6 py-3 text-sm font-semibold bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md transform hover:scale-[1.02] active:scale-100"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessRequestModal;
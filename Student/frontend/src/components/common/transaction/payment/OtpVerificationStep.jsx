import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import StepIndicator from './StepIndicator'; // Import StepIndicator

const OtpVerificationStep = ({ onConfirm, onBack, setPaymentDetails, paymentDetails, stepStage, setStepStage, correctOtp }) => {
    const [phoneNumber, setPhoneNumber] = useState(paymentDetails.phoneNumber || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const otpInputs = Array(6).fill(0).map((_, i) => React.createRef());

    const handleGetOtp = () => {
        if (!phoneNumber || !/^\d{10}$/.test(phoneNumber.replace(/\s+/g, ''))) {
            setError('Please enter a valid 10-digit PH mobile number (e.g., 9171234567).');
            return;
        }
        setError('');
        setLoading(true);
        console.log("Simulating OTP request for:", phoneNumber);
        setPaymentDetails(prev => ({ ...prev, phoneNumber }));

        setTimeout(() => {
            setLoading(false);
            setStepStage('enterOtp'); // Move to OTP entry
        }, 1500);
    };

    const handleOtpChange = (e, index) => {
        const { value } = e.target;
        // Allow only digits
        if (/^[0-9]$/.test(value)) {
          const newOtp = [...otp];
          newOtp[index] = value;
          setOtp(newOtp);
          // Move focus to next input
          if (index < 5 && otpInputs[index + 1]?.current) {
            otpInputs[index + 1].current.focus();
          }
        } else if (value === '') {
            // Handle backspace
             const newOtp = [...otp];
             newOtp[index] = '';
             setOtp(newOtp);
             // Move focus to previous input on backspace if current is empty
             if (index > 0 && otpInputs[index - 1]?.current) {
                otpInputs[index - 1].current.focus();
             }
        }
    };

     const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        if (/^\d{6}$/.test(paste)) {
            const newOtp = paste.split('');
            setOtp(newOtp);
            // Optionally focus the last input after paste
            if (otpInputs[5]?.current) {
                otpInputs[5].current.focus();
            }
            e.preventDefault();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace when the input is already empty
        if (e.key === 'Backspace' && otp[index] === '' && index > 0 && otpInputs[index - 1]?.current) {
            otpInputs[index - 1].current.focus();
        }
    };

    const handleOtpConfirm = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            setError('Please enter the complete 6-digit code.');
            return;
        }
        setLoading(true);
        setError('');
        console.log("Verifying OTP:", enteredOtp);

        setTimeout(() => {
            setLoading(false);
            if (enteredOtp === correctOtp) {
                onConfirm(); // Proceed to next step
            } else {
                setError('Invalid OTP code. Please try again.');
                setOtp(['', '', '', '', '', '']); // Clear OTP fields on error
                if(otpInputs[0]?.current) otpInputs[0].current.focus(); // Focus first input
            }
        }, 1500);
    };


    if (stepStage === 'getOtp') {
        return (
          <div>
            <StepIndicator currentStep={2} />
            <h3 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">Verification Code</h3>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">We need to send the verification code via SMS.</p>

            {error && <p className="text-xs text-red-500 text-center mb-3">{error}</p>}

            <div className="relative mb-6">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 dark:text-gray-300 pointer-events-none">🇵🇭 +63</span>
                <input
                    type="tel"
                    placeholder="917 123 4567" // Placeholder for format
                    value={phoneNumber}
                    maxLength={10} // Limit input length
                    onChange={(e) => {
                        // Allow only numbers
                        const numericValue = e.target.value.replace(/\D/g, '');
                        setPhoneNumber(numericValue);
                    }}
                    className="w-full pl-[70px] pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
            </div>
            <button
                onClick={handleGetOtp}
                disabled={loading || phoneNumber.length !== 10} // Disable if number is not 10 digits
                className="w-full py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
             {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Get OTP'}
            </button>
            <button onClick={onBack} className="w-full mt-2 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Cancel</button>
          </div>
        );
    }

    if (stepStage === 'enterOtp') {
         return (
          <div>
            <StepIndicator currentStep={2} />
            <h3 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">Verification Code</h3>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">Enter the 6-digit code sent to +63 {phoneNumber}.</p>

            {error && <p className="text-xs text-red-500 text-center mb-3">{error}</p>}

            <div
                className="flex justify-center gap-2 mb-6"
                onPaste={handlePaste} // Handle pasting code
            >
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={otpInputs[index]}
                        type="tel" // Use tel for numeric keyboard on mobile
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace on empty field
                        className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                ))}
            </div>

            <button
                onClick={handleOtpConfirm}
                disabled={loading || otp.join('').length !== 6} // Disable if OTP is incomplete
                className="w-full py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
             {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Confirm'}
            </button>
            {/* Consider adding a timer before enabling Resend */}
            <button onClick={() => setStepStage('getOtp')} className="w-full mt-2 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Resend Code</button>
          </div>
        );
    }

    return null;
};

export default OtpVerificationStep;

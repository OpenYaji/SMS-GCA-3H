// import React from 'react';
// import { MessageSquare, Star, ThumbsUp } from 'lucide-react';

// const TeacherFeedbackCard = () => {
//   // mock lang to lahat wala pa to sa db
//   const feedbackData = {
//     advisorName: "Ms. Maria Santos",
//     advisorSubject: "Class Adviser & Mathematics Teacher",
//     date: "October 8, 2025",
//     quarter: "1st Quarter",
//     overallRating: 5,
//     feedback: "Juan Carlos has shown exceptional academic performance this quarter. He demonstrates strong mathematical skills and actively participates in class discussions. His enthusiasm for learning is evident in his consistent effort and dedication to his studies. He is respectful to teachers and classmates, making him a positive influence in the classroom. I encourage him to continue his excellent work and to maintain his curiosity and love for learning.",
//     strengths: [
//       "Strong problem-solving abilities",
//       "Excellent class participation",
//       "Shows leadership qualities",
//       "Respectful and courteous"
//     ],
//     areasForImprovement: [
//       "Could improve time management on projects",
//       "Encourage more peer collaboration"
//     ],
//     parentNote: "Juan is doing wonderfully! Keep encouraging his reading habits at home."
//   };

//   return (
//     <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
//       <div className="flex items-center gap-3 mb-5">
//         <div className="p-3 bg-[#F4D77D] dark:bg-slate-700 rounded-xl">
//           <MessageSquare className="w-6 h-6 text-gray-800 dark:text-amber-300" />
//         </div>
//         <div className="flex-1">
//           <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 ">
//             Teacher's Feedback
//           </h2>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             {feedbackData.quarter} Assessment
//           </p>
//         </div>
//         <div className="flex gap-1">
//           {[...Array(feedbackData.overallRating)].map((_, i) => (
//             <Star key={i} className="w-5 h-5 fill-[#F4D77D] text-[#F4D77D] dark:fill-amber-400 dark:text-amber-400" />
//           ))}
//         </div>
//       </div>

//       {/* Advisor Info */}
//       <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-600">
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 rounded-full bg-[#F4D77D] dark:bg-slate-600 flex items-center justify-center">
//             <span className="text-lg font-bold text-gray-800 dark:text-amber-300">
//               {feedbackData.advisorName.split(' ').map(n => n[0]).join('')}
//             </span>
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
//               {feedbackData.advisorName}
//             </h3>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               {feedbackData.advisorSubject}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Feedback */}
//       <div className="mb-6">
//         <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
//           <MessageSquare className="w-4 h-4" />
//           General Comments
//         </h3>
//         <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-600">
//           {feedbackData.feedback}
//         </p>
//       </div>

//       {/* Strengths and Areas for Improvement */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Strengths */}
//         <div>
//           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
//             <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
//             Strengths
//           </h3>
//           <ul className="space-y-2">
//             {feedbackData.strengths.map((strength, index) => (
//               <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
//                 <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
//                 <span>{strength}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Areas for Improvement */}
//         <div>
//           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
//             <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             Areas for Growth
//           </h3>
//           <ul className="space-y-2">
//             {feedbackData.areasForImprovement.map((area, index) => (
//               <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
//                 <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
//                 <span>{area}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Note to Parents */}
//       <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
//         <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
//           📝 Note to Parents
//         </h3>
//         <p className="text-sm text-amber-700 dark:text-amber-400">
//           {feedbackData.parentNote}
//         </p>
//       </div>

//       <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
//         <span>Assessment Date: {feedbackData.date}</span>
//         <span className="flex items-center gap-1">
//           <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//           Verified
//         </span>
//       </div>
//     </div>
//   );
// };

// export default TeacherFeedbackCard;
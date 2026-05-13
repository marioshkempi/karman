// 'use client';

// import { categories, menuData } from '@lib/data/nav-item';
// import React, { useState } from 'react';

// const MegaMenu = () => {
//   const [activeMenu, setActiveMenu] = useState<string | null>(null);

//   return (
//     <div 
//       className="bg-white relative"
//       onMouseLeave={() => setActiveMenu(null)}
//     >
//       <div className="bg-white border-b">
//         <div className="max-w-[1350px] mx-auto px-4 sm:px-6">
//           <div className="flex items-center justify-start space-x-7 py-4">
//             {categories.map((category, index) => (
//               <div
//                 key={index}
//                 className="relative"
//                 onMouseEnter={() => setActiveMenu(category)}
//               >
//                 <a
//                   href="#"
//                   className="text-gray-700 font-medium text-primary hover:text-primary transition-colors duration-200 whitespace-nowrap text-[14px]"
//                 >
//                   {category}
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {activeMenu && menuData[activeMenu] && (
//         <div
//           className="absolute left-0 right-0 bg-white shadow-lg z-50 border-t"
//         >
//           <div className="max-w-7.5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="grid grid-cols-5 gap-6">
//               <div className="space-y-6">
//                 {menuData[activeMenu].slice(0, 4).map((section, index) => (
//                   <div key={index}>
//                     <h3 className="font-bold mb-2 text-[18px] text-secondary">
//                       {section.title}
//                     </h3>
//                     <ul className="space-y-1">
//                       {section.items.map((item, itemIndex) => (
//                         <li key={itemIndex}>
//                           <a 
//                             href="#" 
//                             className="text-secondary text-[14px] hover:text-secondary hover:underline block"
//                           >
//                             {item}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-6">
//                 {menuData[activeMenu].slice(4, 8).map((section, index) => (
//                   <div key={index}>
//                     <h3 className="font-bold mb-2 text-[18px] text-secondary">
//                       {section.title}
//                     </h3>
//                     <ul className="space-y-1">
//                       {section.items.map((item, itemIndex) => (
//                         <li key={itemIndex}>
//                           <a 
//                             href="#" 
//                             className="text-secondary text-[14px] hover:text-secondary hover:underline block"
//                           >
//                             {item}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-6">
//                 {menuData[activeMenu].slice(8, 11).map((section, index) => (
//                   <div key={index}>
//                     <h3 className="font-bold mb-2 text-[18px] text-secondary">
//                       {section.title}
//                     </h3>
//                     <ul className="space-y-1">
//                       {section.items.map((item, itemIndex) => (
//                         <li key={itemIndex}>
//                           <a 
//                             href="#" 
//                             className="text-secondary text-[14px] hover:text-secondary hover:underline block"
//                           >
//                             {item}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-6">
//                 {menuData[activeMenu].slice(11, 15).map((section, index) => (
//                   <div key={index}>
//                     <h3 className="font-bold mb-2 text-[18px] text-secondary">
//                       {section.title}
//                     </h3>
//                     <ul className="space-y-1">
//                       {section.items.map((item, itemIndex) => (
//                         <li key={itemIndex}>
//                           <a 
//                             href="#" 
//                             className="text-secondary text-[14px] hover:text-secondary hover:underline block"
//                           >
//                             {item}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-6">
//                 {menuData[activeMenu].slice(15).map((section, index) => (
//                   <div key={index}>
//                     <h3 className="font-bold mb-2 text-[18px] text-secondary">
//                       {section.title}
//                     </h3>
//                     <ul className="space-y-1">
//                       {section.items.map((item, itemIndex) => (
//                         <li key={itemIndex}>
//                           <a 
//                             href="#" 
//                             className="text-secondary text-[14px] hover:text-secondary hover:underline block"
//                           >
//                             {item}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MegaMenu;
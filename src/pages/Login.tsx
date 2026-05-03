// import React, { useId, useState } from "react";
// import type { FormEvent } from "react";

// import image5 from "../assets/image-5.png";
// import KILOSWhiteLogo1 from "../assets/KILOS-white-logo-1.png";


// const formFields = [
//   { id: "username", label: "Username", type: "text", autoComplete: "username" },
//   { id: "password", label: "Password", type: "password", autoComplete: "current-password" },
// ] as const;

// export const LoginPage: React.FC = () => {
//   const formId = useId();
//   const [formValues, setFormValues] = useState({ username: "", password: "" });

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//   };

//   return (
//     <main className="bg-white w-full min-w-[1920px] min-h-[1080px] flex">
//       {/* Left panel */}
//       <section
//         aria-labelledby={`${formId}-title`}
//         className="w-[705px] h-[1080px] relative bg-[linear-gradient(180deg,rgba(7,40,33,1)_21%,rgba(17,27,48,1)_100%)]"
//       >
//         {/* Logo */}
//         <img
//           className="absolute top-[142px] left-[234px] w-[238px] h-[134px] object-contain"
//           alt="KILOS"
//           src={KILOSWhiteLogo1}
//         />

//         {/* Title */}
//         <h1
//           id={`${formId}-title`}
//           className="absolute top-[calc(50%-264px)] left-[calc(50%-110px)] w-[219px] h-[110px] flex items-center justify-center font-poppins font-semibold text-[#fdffe0] text-4xl text-center"
//         >
//           LOG IN 
//         </h1>

//         {/* Form */}
//         <form className="contents" onSubmit={handleSubmit} aria-label="Login form">
//           {formFields.map((field, index) => {
//             const labelTop = index === 0 ? "top-[398px]" : "top-[518px]";
//             const inputTop = index === 0 ? "top-[438px]" : "top-[559px]";
//             const labelWidth = index === 0 ? "w-32" : "w-[116px]";

//             return (
//               <div key={field.id}>
//                 <label
//                   htmlFor={`${formId}-${field.id}`}
//                   className={`absolute ${labelTop} left-[119px] ${labelWidth} h-7 flex items-center justify-center font-poppins text-[#fdffe0] text-2xl`}
//                 >
//                   {field.label}
//                 </label>
//                 <div className={`absolute ${inputTop} left-[119px] w-[467px] h-[42px] flex rounded-md`}>
//                   <input
//                     id={`${formId}-${field.id}`}
//                     name={field.id}
//                     type={field.type}
//                     autoComplete={field.autoComplete}
//                     value={formValues[field.id]}
//                     onChange={(event) =>
//                       setFormValues((current) => ({
//                         ...current,
//                         [field.id]: event.target.value,
//                       }))
//                     }
//                     aria-label={field.label}
//                     className="w-full h-full bg-white rounded-[var(--sizes-global-radius)] px-[12px] 
//                               text-black [font-family:'Poppins-Regular',Helvetica] font-normal text-base leading-[normal] 
//                               placeholder:text-white/60 shadow-[0_0_0_1px_#00000014]"
//                   />

//                 </div>
//               </div>
//             );
//           })}

//           {/* Button */}
//           <button
//             type="submit"
//             className="absolute top-[680px] left-[119px] w-[467px] h-[42px] flex items-center justify-center bg-[#ba6300] rounded-md cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fdffe0]"
//           >
//             <span className="font-poppins font-medium text-[#fdffe0] text-xl">Log in</span>
//           </button>
//         </form>
//       </section>

//       {/* Right panel */}
//       <aside className="w-[1215px] h-[1080px]">
//         <img className="w-full h-full object-cover" alt="Gym interior" src={image5} />
//       </aside>
//     </main>
//   );
// };

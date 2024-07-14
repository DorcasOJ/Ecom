import { useState } from "react";
import "./formInput.css";

const FormInput = (props) => {
    const [focused, setFocused] = useState(false);
    const {label, errorMessage,showError, onChange, loginForm, ...inputProps} = props;

    const handleFocus = (e) => {
        setFocused(true);
    };

    return (
        <div className={(loginForm ? 'formInput' : 'registerInput')}   >
            {/* <label>{label}</label> */}
            
            <input
                {...inputProps}
                onChange={onChange}

                onBlur={handleFocus}
                key={inputProps.id}
                // onFocus={() => 
                // inputProps.name === "comfirmpassword" && setFocused(true)
                // }
                focused={focused.toString()}
               
            />
            <span className={(showError ? "showErrorMsg": "errorMsg")} >{errorMessage}</span>
        </div>
    )
}

export default FormInput;

// export const InputPassword = (props) => {
//     const [focused, setFocused] = useState(false);
//     const {label, errorMessage, onChange, showPassword, loginForm, ...inputProps} = props;

//     const handleFocus = (e) => {
//         setFocused(true);
//     };

//     return (
//         <div className={(loginForm ? 'formInput' : 'registerInput')}   >
//             {/* <label>{label}</label> */}
            
//             <input
//                 {...inputProps}
//                 onChange={onChange}
//                 onBlur={handleFocus}
//                 key={inputProps.id}
//                 id={inputProps.id}
//                 type={showPassword ? "text" : "password"}
//                 // onFocus={() => 
//                 // inputProps[0].name === "comfirmpassword" && setFocused(true)
//                 // }
//                 focused={focused.toString()}
               
//             />
//             <span className="errorMsg" >{errorMessage}</span>
//         </div>
//     )
// }

// export const InputSpan = (props) => {
//     const {showPassword, setShowPassword} = props;

//     return (
//         <span 
//             onClick={() => setShowPassword((prev) => !prev)}
//         >
//             {showPassword ? "hide" : "show"}
//         </span>
//     )
// }
                
import {useEffect, useState} from "react";
import FormInput from "../components/FormInput";
import { inputs } from "../utils/inputFormat";
import {
  Link,
} from "react-router-dom";
import LeftSide from "../components/leftSide";
import "./register.css"

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    comfirmPassword: "",
  });
  const [showLeftSide, setShowLeftSide] = useState(true)

  const handleResize = () => {
    if(window.innerWidth <=770) {
      setShowLeftSide(false)
    } else {
      setShowLeftSide(true)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
  setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(
    ()=> {
      window.addEventListener('resize', handleResize)
    }
  )

return (
  <div className="loginContainer">
    {
    showLeftSide && <LeftSide alternate='Login'/>
    }
    {/* <LeftSide/> */}
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Signup</h1>
       
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          ))}
    
        
        <button>Submit</button>
        <div className="loginDiv">
        <Link to="login" className="loginLink">Login Here</Link>
        </div>
      </form>
      
    </div>
  </div>
  );
  
}

export default Register
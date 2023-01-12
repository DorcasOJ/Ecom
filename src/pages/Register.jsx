import {useState} from "react";
import FormInput from "../components/FormInput";
import inputs from "../utils/inputFormat";
import {
  Link,
} from "react-router-dom";

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    comfirmPassword: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
  };

const onChange = (e) => {
setValues({ ...values, [e.target.name]: e.target.value });
};

return (
  <div className="loginContainer">
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
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
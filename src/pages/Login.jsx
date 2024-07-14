import {useState} from "react";
import FormInput from "../components/FormInput";
import { inputs } from "../utils/inputFormat";
import {
  Link,
} from "react-router-dom";


const Login = () => {
    const [loginValues, setLoginValues] = useState({
        username: "",
        password: "",
    })
    let newInputs = inputs.filter((input) => input.id ===1 || input.id===4)

    const handleSubmit =(e) => {
        e.preventDefault;
    }

    const onChange = (e) => {
        setLoginValues({...loginValues, [e.target.name]: e.target.value})
    }
  return (
    <div className="loginContainer">
 
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>
          Login</h1>
        {newInputs.map((input) => (
            <FormInput
            key={input.id}
            {...input}
            value={loginValues[input.name]}
            onChange={onChange}
            />
        ))}
        <button>Submit</button>
        <div className="loginDiv">
        <Link to="/" className="loginLink">Register Here</Link>
        </div>
      </form>
      
    </div>
  </div>
  )
}

export default Login
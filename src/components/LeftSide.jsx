// import { useState } from "react";
import "./leftSide.css";
import cart from "../assets/cart.png"

const LeftSide = () => {
    // const [focused, setFocused] = useState(false);
    // const {alternate} = props;

    return (
        <div className="leftSide">
            <div className="left">
                <p>All your need is here!</p>
                <div className="cart">
                    <img src={cart} alt="cart" />
                </div>
                <div className="circles">
                    <div className="circle1"></div>
                    <div className="circle2"></div>
                    <div className="circle3"></div>
                </div>
               <span>{}</span>
            </div>
            
        </div>
    )
}

export default LeftSide;
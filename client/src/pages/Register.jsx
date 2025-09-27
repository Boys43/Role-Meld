import { useState } from "react";
import assets from "../assets/assets";
import RegisterModel from "../components/RegisterModel";
import VerificationModel from "../components/VerificationModel";

const Register = () => {
  const [regStep, setRegStep] = useState(0);
  return <>
    <div className="h-screen overflow-hidden w-full flex justify-center items-center">
      <div className="md:w-1/2 py-10 overflow-y-auto">
        {regStep === 0 ? <RegisterModel setRegStep={setRegStep} /> : <VerificationModel />}
      </div>
      <div className="border hidden md:block border-l-3 border-[var(--primary-color)] md:w-1/2">
        <img src={assets.register_side} alt="Register Side" />
      </div>
    </div>
  </>
};

export default Register;

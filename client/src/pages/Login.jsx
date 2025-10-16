import { useEffect, useState } from 'react'
import assets from '../assets/assets'
import LoginModel from '../components/LoginModel'
import DetailsModel from '../components/DetailsModel'

const Login = () => {
    // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
  const [step, setStep] = useState(1);

  return (
    <main className="h-screen overflow-hidden w-full flex justify-center items-center">
      <div className="md:w-1/2 py-10 overflow-y-auto">
        {step === 1 ? <LoginModel setStep={setStep} /> : <DetailsModel />}
      </div>
      {step === 1 && <div className="border hidden md:block md:w-1/2 border-l-3 border-[var(--primary-color)]">
        <img loading='lazy' src={assets.register_side} alt="Register Side" />
      </div>}

    </main>
  )
}

export default Login
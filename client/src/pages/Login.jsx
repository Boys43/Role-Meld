import assets from '../assets/assets'
import LoginModel from '../components/LoginModel'


const Login = () => {

  return (
    <main className="h-screen overflow-hidden w-full flex justify-center items-center">
      <div className="md:w-1/2 py-10 overflow-y-auto">
        <LoginModel />
      </div>
      <div className="border hidden md:block md:w-1/2 border-l-3 border-[var(--primary-color)]">
        <img loading='lazy' src={assets.register_side} alt="Register Side" />
      </div>
    </main>
  )
}

export default Login
import assets from '../assets/assets'
import LoginModel from '../components/LoginModel'


const Login = () => {

  return (
    <main className="h-screen overflow-hidden w-full flex justify-center items-center">
      <div className="w-1/2 py-10 overflow-y-auto">
        <LoginModel />
      </div>
      <div className="border border-l-3 border-[var(--primary-color)] w-1/2">
        <img src={assets.register_side} alt="Register Side" />
      </div>
    </main>
  )
}

export default Login
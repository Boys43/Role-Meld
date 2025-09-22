import { FaBriefcase } from "react-icons/fa";
import assets from "../assets/assets";
import Search from "../components/Search";

// React Icons
import { MdComputer } from "react-icons/md";       // IT & Software
import { MdCampaign } from "react-icons/md";       // Digital Marketing
import { MdDesignServices } from "react-icons/md"; // Design & Creative
import { MdAccountBalance } from "react-icons/md"; // Finance & Accounting
import { MdPeople } from "react-icons/md";         // Human Resources
import { MdBusinessCenter } from "react-icons/md"; // Business Development
import { MdEngineering } from "react-icons/md";    // Engineering
import { MdWeb } from "react-icons/md";            // Website Development
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <main className="py-6 w-[95vw] mx-auto">
        <section className="shadow-2xl py-14 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] p-6 w-full rounded-2xl flex flex-col gap-4 items-center">
          <h1 className="text-white">
            Welcome to <span className="text-[var(--accent-color)] font-bold italic">Role Meld</span>
          </h1>
          <p className="text-[var(--accent-color)]">
            Find the perfect job for you in just a few clicks with Role Meld
          </p>
          <Search />
        </section>
        <section className="border flex items-center justify-evenly rounded-2xl p-4 mt-4 shadow-xl">
          <img src={assets.nt} alt="Netflix" className="w-20" />
          <img src={assets.am} alt="Amazon" className="w-20" />
          <img src={assets.sm} alt="samsung" className="w-20" />
          <img src={assets.apple} alt="Apple" className="w-20" />
          <img src={assets.tcs} alt="Tcs" className="w-15" />
          <img src={assets.mt} alt="Microsoft" className="w-20" />
          <img src={assets.fb} alt="Facebook" className="w-20" />
        </section>
        <section className="mt-20">
          <h1 className="font-bold my-8 flex items-center gap-8">
            <FaBriefcase className="text-[var(--primary-color)]" />  Choose Your Career Path
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300"
              onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("IT & Software"))}
            >
              <MdComputer size={30} />
              IT & Software
            </h3>
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)]  hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <MdCampaign size={30} />
              Digital Marketing
            </h3>
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)]  hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <MdDesignServices size={30} />
              Design & Creative
            </h3>
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)]  hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <MdAccountBalance size={30} />
              Finance & Accounting
            </h3>
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)]  hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <MdPeople size={30} />
              Human Resources
            </h3>
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)]  hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <MdBusinessCenter size={30} />
              Business Development
            </h3>
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)]  hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <MdEngineering size={30} />
              Engineering
            </h3>
            <h3 className="py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2  border-[var(--primary-color)]  hover:text-white hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <MdWeb size={30} />
              Website Development
            </h3>
          </div>

        </section>
      </main>
    </>
  );
};

export default Home;

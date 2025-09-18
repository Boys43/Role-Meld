import assets from "../assets/assets";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
// import Search from "../components/Search";

const Home = () => {
  const [showDropDown, setShowDropDown] = useState(false);

  const navigate = useNavigate();
  return (
    <>
      <main className="py-6">
        {/* <Search /> */}
        <section className="mt-10 flex flex-col">
          <div className="w-full bg-[#ecf2ff]">
            <img
              src={assets.home_bg}
              className="w-[50%] mx-auto"
              alt="Home Bg"
            />
          </div>
          <div className="flex items-center justify-center flex-col mt-5">
            <h3 className="font-medium">Welcome to <span className="font-bold text-[var(--primary-color)] italic">Role Meld!</span></h3>
            <p>
              Create an account or sign in to see your personalised job
              recommendations.
            </p>
            <button 
            onClick={() => navigate('/find-jobs')}
            className="flex mt-4 items-center gap-2 font-semi">
              Find Jobs <IoIosArrowRoundForward size={30} />
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;

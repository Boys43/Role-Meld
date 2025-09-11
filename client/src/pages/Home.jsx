import assets from "../assets/assets";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
// import Search from "../components/Search";

const Home = () => {
  const [showDropDown, setShowDropDown] = useState(false);
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
            <h3 className="font-medium">Welcome to Indeed!</h3>
            <p>
              Create an account or sign in to see your personalised job
              recommendations.
            </p>
            <button className="flex mt-4 items-center gap-2 font-semi">
              Get Started <IoIosArrowRoundForward size={30} />
            </button>
          </div>
          <p className="flex items-center mt-8 justify-center">
            <Link
              to="post-cv"
              className="text-[var(--primary-color)] underline font-semibold underline-offset-4"
            >
              Post Your CV
            </Link>{" "}
            - It only takes a few seconds
          </p>
        </section>
        <section className="mt-10 w-full flex items-center justify-center flex-col">
          <p
            onClick={() => setShowDropDown(!showDropDown)}
            className="flex text-center items-center gap-2 cursor-pointer"
          >
            What's trending on Indeed <IoIosArrowDown size={15} />
          </p>
          {showDropDown && (
            <div className="grid grid-cols-3 gap-8 mt-5">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">Trending Searches</p>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Graphic Designer Jobs Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Internships Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Remote Chat Support
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Data Entry Remote Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Writing Assignment Online
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Data Entry Part Time Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Mto Marketing Karachi
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold">Trending Jobs</p>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Teacher Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Accountant Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      United States
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Medical Billing Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Video Editor Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Call Center Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Internship Islamabad
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Part Time Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Jobs Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Amazon Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Writing Assignment Online
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Bookkeeping Accounting
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Illustration Artist
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Finance Islamabad
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Content Writer Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Laravel Developer Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      SEO Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Graphic Designer Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Part Time Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Jobs for Students Online Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Marketing Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Remote Chat Support
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Internship Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Customer Service Representative Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Data Analyst Lahore
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Sales Executive Karachi Gulshan e Iqbal
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Data Entry Part Time
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Internship Rawalpindi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Part Time Islamabad
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold">Poplular Cities</p>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Gilgit Baltistan
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Muzaffarabad
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Malir Cantt
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Karachi Defence Housing Society
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Rawalpindi Satellite Town
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Karachi Gulistan e Jouhar (KP 2023)
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Attock
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Mianwali
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Mirpur
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Bahrain
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Karachi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Peshawar
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Azad Kashmir
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Rawalpindi
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Islamabad F 8 Markaz
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Muzaffargarh
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Sindh
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Karachi Clifton
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Kotri
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Swat
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Nowshera
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Raiwind
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Lahore Gulberg Colony
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Hafizabad
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Islamabad G 10 Markaz
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Mandi Bahauddin
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Kharian
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Islamabad I 8 4
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Chiniot
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-[0.9rem] text-[var(--primary-color)] underline underline-offset-2"
                      href="#"
                    >
                      Chakwal
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Home;

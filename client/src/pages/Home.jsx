import assets from "../assets/assets";
import Search from "../components/Search";

const Home = () => {

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
      </main>
    </>
  );
};

export default Home;

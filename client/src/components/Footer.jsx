import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <section className="flex gap-4 flex-wrap text-[0.8rem] decoration-none justify-center p-2 border-t-1">
        <Link to={"/jobs"}>Browse Jobs</Link>
        <Link to={"/company-reviews"}>Browse Companies</Link>
        <Link to={"/countries"}>Countries</Link>
        <Link to={"/about"}>About</Link>
        <Link to={"/help"}>Help</Link>
        <Link to={"/esg"}>ESG at Indeed</Link>
        <Link to={"/accessibility"}>Accessibility at Indeed</Link>
        <Link to={"/privacy"}>Privacy Center and Ad Choices</Link>
        <Link to={"/terms"}>Terms</Link>
      </section>
      <section className="p-4 text-center text-[0.8rem]">
        © 2025 Indeed | All rights reserved
      </section>
    </footer>
  );
};

export default Footer;

import VitalMatchLogo from "../assets/vitalmatch-logo.png";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import {Menu, X} from "lucide-react";

function Header() {
    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Links = [
        {name: "Features", link: "#features"},
        {name: "How It Works", link: "#how-it-works"},
        {name: "About Us", link: "#about-us"},
        {name: "FAQ", link: "#faq"},
    ]

  const [open, setOpen] = useState(false);
    return (
        <header className={`w-full fixed top-0 left-0 z-50 ${scrolled ? "bg-[#07052C]/10 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
            <div className="md:flex items-center justify-between px-4 md:px-12 py-6">
                <div className="cursor-pointer flex items-center ">
                    <img src={VitalMatchLogo} alt="vitalmatch-logo" className="h-14 w-20" />
                </div>
                <div className="absolute right-4 top-10 cursor-pointer md:hidden" onClick={() => setOpen(prev => !prev)}>
                    {open ? <X /> : <Menu />}
                </div>
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-40 left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? "top-25 opacity-100 md:bg-transparent bg-white" : "-top-122.5"} md:opacity-100 opacity-0`}>

                {Links.map((link) => {
                    return (
                        <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
                            <a href={link.link} className="md:text-white text-black hover:text-gray-400 duration-500">{link.name}</a>
                        </li>
                    )
                })}
                <div className="flex gap-4 md:gap-0">
                    <Link to="/login" className={`bg-[#3B82F6] text-white cursor-pointer py-2 px-6 md:my-0 rounded-full text-xl md:ml-8 hover:bg-blue-700 duration-500`}>Login</Link>
                    <Link to="/onboarding" className={`bg-[#3B82F6] text-white cursor-pointer py-2 px-6 md:my-0 rounded-full text-xl md:ml-8 hover:bg-blue-700 duration-500`}>Get Started</Link>
                </div>
                </ul>
            </div>
        </header>
    )
}

export default Header;
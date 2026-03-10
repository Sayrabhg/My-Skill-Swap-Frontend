import { useState } from 'react';
import { Link } from "react-router-dom";
import { Menu, X, Rocket } from 'lucide-react'; // Using lucide-react for modern icons
import { CoolMode } from '@/components/ui/cool-mode';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Learn', href: '/learn' },
        { name: 'Earn Tokens', href: '/earn-tokens' },
        { name: 'Teach', href: '/teach' },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 left-0 right-0 bg-white/60 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* Logo Section */}
                    <CoolMode >
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center gap-2 group transition-all duration-300"
                        >
                            <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <Rocket className="text-white w-6 h-6" />
                            </div>

                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight group-hover:from-violet-600 group-hover:to-indigo-600 transition-all duration-300">
                                My Skill-Swap
                            </span>
                        </Link>
                    </CoolMode>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                        <CoolMode>
                            <Link to="/auth">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-200 active:scale-95">
                                    Get Started
                                </button>
                            </Link>
                        </CoolMode>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-indigo-600 focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} bg-white border-b border-gray-100`}>
                <div className="px-4 pt-2 pb-6 space-y-2 shadow-inner">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-4">
                        <CoolMode>
                            <Link to="/auth">
                                <button className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold shadow-md">
                                    Get Started
                                </button>
                            </Link>
                        </CoolMode>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
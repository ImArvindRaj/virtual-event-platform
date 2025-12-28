import { Link } from "react-router";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 dark:bg-gray-950 dark:border-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                EventHub
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                            The premium platform for hosting and attending virtual events. Connect, learn, and grow with us.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/events" className="hover:text-indigo-600 transition-colors">Browse Events</Link></li>
                            <li><Link to="/host" className="hover:text-indigo-600 transition-colors">Host an Event</Link></li>
                            <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
                            <li><Link to="/features" className="hover:text-indigo-600 transition-colors">Features</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/cookies" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} EventHub. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link to="/help" className="hover:text-indigo-600 transition-colors">Help Center</Link>
                        <Link to="/status" className="hover:text-indigo-600 transition-colors">System Status</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

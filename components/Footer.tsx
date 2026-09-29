
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Logo className="mb-6" size="md" />
          <p className="max-w-sm text-sm leading-relaxed">
            Premium baby clothes, overalls, and outfits handpicked for ultimate softness and style. Your number one choice for quality infant wear in Lebanon.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Explore</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">All Products</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Overalls</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Outfits</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Rompers</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              +961 70 180 409
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"></path>
              </svg>
              toutiboutique.official@gmail.com
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-3 text-indigo-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Beirut, Lebanon
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-8 text-center text-xs">
        &copy; {new Date().getFullYear()} Touti Boutique. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

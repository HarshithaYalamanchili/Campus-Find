import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                CampusFind
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart lost and found management system for university campuses. Powered by AI matching to reunite students with their valuables quickly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/lost" className="hover:text-white transition-colors">
                  Lost Items Directory
                </Link>
              </li>
              <li>
                <Link to="/found" className="hover:text-white transition-colors">
                  Found Items Directory
                </Link>
              </li>
              <li>
                <Link to="/post" className="hover:text-white transition-colors">
                  Report Item
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Match Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Zones */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Key Campus Locations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Central Library & Reading Halls
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Main Cafeteria & Food Court
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Engineering & Science Blocks
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Sports Complex & Gym
              </li>
            </ul>
          </div>

          {/* Campus Security & Support */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Campus Security
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Official items deposited with campus security can be reclaimed at the Administration Block Room 102.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>security@campus.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Campus Helpline: (555) 0199</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusFind. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with modern MERN stack & AI matching engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  
  return (
      <footer className="w-full bg-[#3B82F6] rounded-t-[2.5rem] mt-auto text-white px-8 py-10 md:px-16 md:py-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          
          {/* Top row: Logo and Socials */}
          <div className="w-full flex justify-between items-center mb-8">
            <div className="font-bold text-xl tracking-tight">
              VitalMatch
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition-opacity"><Twitter size={24} strokeWidth={1.5} /></a>
              <a href="#" className="hover:opacity-80 transition-opacity"><Linkedin size={24} strokeWidth={1.5} /></a>
              <a href="#" className="hover:opacity-80 transition-opacity"><Facebook size={24} strokeWidth={1.5} /></a>
            </div>
          </div>

          {/* Copyright */}
          <div className="font-bold text-center mb-4 text-[15px]">
            ©VitalMatch2026. All Right Reserved
          </div>

          {/* Disclaimer Text */}
          <div className="text-center text-sm font-medium text-white/90 max-w-225 leading-relaxed">
            <p>
              VitalMatch connects verified hospitals with voluntary blood donors. We do not provide medical services. All procedures are handled by licensed professionals.
            </p>
          </div>
          
        </div>
    </footer>
  );
}
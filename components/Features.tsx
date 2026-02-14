import React from 'react';
import { Fingerprint, MessageSquare, Zap, Globe, Briefcase, Lock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-6 group-hover:bg-gradient-brand group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="font-display text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: <Fingerprint size={24} />,
      title: "Unified Digital ID",
      description: "A single, secure identity to access all government services and partner platforms with 3.0 security standards."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Open Dialogue",
      description: "Transparent communication channels connecting youth feedback directly to policy-makers."
    },
    {
      icon: <Briefcase size={24} />,
      title: "Entrepreneur Support",
      description: "Fast-track registration, funding access, and mentorship for digital startups."
    },
    {
      icon: <Globe size={24} />,
      title: "Global Connectivity",
      description: "Networking opportunities that bridge local talent with international markets and investors."
    },
    {
      icon: <Lock size={24} />,
      title: "Sovereign Cloud",
      description: "Data hosting within national borders ensuring maximum privacy and compliance for users."
    },
    {
      icon: <Zap size={24} />,
      title: "Innovation Hub",
      description: "Resources, APIs, and sandboxes for developers to build the next generation of civic tech."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-green font-bold tracking-widest uppercase text-sm mb-3">Platform Services</h2>
          <h3 className="font-display text-4xl font-bold text-slate-900 mb-4">Ecosystem of Possibilities</h3>
          <p className="text-slate-600">
            We provide the infrastructure; you build the future. Mcommunication 3.0 offers a suite of tools designed for the modern digital citizen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
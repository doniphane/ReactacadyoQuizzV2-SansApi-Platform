import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 flex justify-between items-center px-8">
      <div>Développé par Trules Doniphane</div>
      <div className="flex justify-center space-x-4">
        <Link to="/privacy-policy-page" className="text-blue-400 hover:text-blue-600">Politique de Confidentialité</Link>
        <Link to="/legal-mentions-page" className="text-blue-400 hover:text-blue-600">Mentions Légales</Link>
        <Link to="/cookie-policy-page" className="text-blue-400 hover:text-blue-600">Politique de Cookies</Link>
      </div>
    </footer>
  );
};

export default Footer;
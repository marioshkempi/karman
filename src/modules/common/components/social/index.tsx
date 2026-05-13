import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function SocialFollow() {
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-6">
        <span className="text-secondary text-lg font-light">
          Ακολουθείστε μας στα social
        </span>
        
        <a
          href="#"
          className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Facebook"
        >
          <Facebook className="w-5 h-5 text-secondary" />
        </a>
        
        <a
          href="#"
          className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Twitter"
        >
          <Twitter className="w-5 h-5 text-secondary" />
        </a>
        
        <a
          href="#"
          className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5 text-secondary" />
        </a>
      </div>
    </div>
  );
}
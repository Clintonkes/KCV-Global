import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-deep border-t border-white/5 pt-20 pb-10 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="font-serif text-3xl text-champagne mb-4">KCV Global</h2>
          <p className="text-platinum/40 text-sm leading-relaxed font-sans">
            Premium creative consulting and editorial photography services for global brands.
          </p>
          <div className="flex gap-4 mt-6">
            <Instagram size={20} className="text-platinum/40 hover:text-champagne transition-colors cursor-pointer" />
            <Twitter size={20} className="text-platinum/40 hover:text-champagne transition-colors cursor-pointer" />
            <Linkedin size={20} className="text-platinum/40 hover:text-champagne transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Contact Section */}
        <div className="col-span-1">
          <h3 className="text-platinum font-sans font-bold text-xs uppercase tracking-widest mb-6">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-platinum/60 text-sm">
              <MapPin size={18} className="text-champagne flex-shrink-0" />
              <span>3 River PL Apt B610<br />Lowell, MA 01852-1052</span>
            </li>
            <li className="flex items-center gap-3 text-platinum/60 text-sm">
              <Phone size={18} className="text-champagne" />
              <span>+1 (978) 994-3657</span>
            </li>
            <li className="flex items-center gap-3 text-platinum/60 text-sm">
              <Mail size={18} className="text-champagne" />
              <span>contact@kcvglobal.com</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className="text-platinum font-sans font-bold text-xs uppercase tracking-widest mb-6">Quick Links</h3>
          <ul className="space-y-3">
            {['Home', 'Gallery', 'Shop', 'Book Session', 'Artists', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-platinum/40 hover:text-champagne text-sm transition-colors font-sans">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-1">
          <h3 className="text-platinum font-sans font-bold text-xs uppercase tracking-widest mb-6">Newsletter</h3>
          <p className="text-platinum/40 text-sm mb-4 font-sans">Join our community for creative insights.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-platinum w-full focus:outline-none focus:border-champagne/40 transition-colors"
            />
            <button className="bg-champagne/10 text-champagne px-4 py-2 rounded-lg text-sm border border-champagne/20 hover:bg-champagne/20 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4">
        <p className="text-platinum/20 text-[10px] uppercase tracking-widest font-sans">
          © {currentYear} KCV Global LLC. All rights reserved.
        </p>
        <div className="flex gap-8 text-platinum/20 text-[10px] uppercase tracking-widest font-sans">
          <a href="/privacy" className="hover:text-platinum/40">Privacy Policy</a>
          <a href="/terms" className="hover:text-platinum/40">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

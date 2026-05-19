import React, { useState, useEffect } from 'react';
import { footerStyles } from '../assets/dummyStyles';
import {
  Clapperboard,
  Film,
  Star,
  Ticket,
  Popcorn,
  Share2,
  MessageCircle,
  Globe,
  Play,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  Heart,
  ArrowUp
} from 'lucide-react';

const Footer = () => {

  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Releases", href: "/releases" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" }
  ];

  const genreLinks = [
    { label: "Horror", href: "/movies" },
    { label: "Thriller", href: "/movies" },
    { label: "Action", href: "/movies" },
    { label: "Drama", href: "/movies" },
    { label: "Comedy", href: "/movies" },
  ];

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Array of icon components for the floating animation
  const floatingIcons = [Clapperboard, Film, Star, Ticket, Popcorn];

  const socialLinks = [
    { Icon: Share2, href: "#" },
    { Icon: MessageCircle, href: "#" },
    { Icon: Globe, href: "#" },
    { Icon: Play, href: "#" }
  ];

  return (
    <footer className={footerStyles.footer}>
      {/* Animated border */}
      <div className={footerStyles.animatedBorder}></div>

      {/* Background elements */}
      <div className={footerStyles.bgContainer}>
        <div className={footerStyles.bgGlow1}></div>
        <div className={footerStyles.bgGlow2}></div>
      </div>

      {/* Floating icons - hidden on small devices to avoid overlap; still visible on md+ (tablet & desktop) */}
      <div className={footerStyles.floatingIconsContainer}>
        {[...Array(12)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const left = (i * 23) % 100;
          const top = (i * 17) % 100;
          const dur = 6 + (i % 5);
          const delay = (i % 4) * 0.6;
          return (
            <div
              key={i}
              className={footerStyles.floatingIcon}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animation: `float ${dur}s infinite ease-in-out`,
                animationDelay: `${delay}s`
              }}
            >
              <IconComponent className="w-8 h-8" />
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className={footerStyles.mainContainer}>
        <div className={footerStyles.gridContainer}>
          {/* Brand section */}
          <div className={footerStyles.brandContainer}>
            <div className={footerStyles.brandLogoContainer}>
              <div className='relative'>
                <div className={footerStyles.logoGlow}></div>
                <div className={footerStyles.logoContainer}>
                  <Clapperboard className={footerStyles.logoIcon} />
                </div>
              </div>
              <h2 className={footerStyles.brandTitle}>
                Cine<span className={footerStyles.brandTitleWhite}>verse</span>
              </h2>
            </div>
            <p className={footerStyles.brandDescription}>
              Your ultimate destination for cinematic experiences. Discover, watch, and enjoy the best movies from around the world.
            </p>
            <div className={footerStyles.socialContainer}>
              {socialLinks.map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className={footerStyles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className={footerStyles.socialIcon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <div className={footerStyles.sectionDot} />
              Quick Links
            </h3>
            <ul className={footerStyles.linksList}>
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={footerStyles.linkItem}>
                    <span className={footerStyles.linkDot}></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <div className={footerStyles.sectionDot} />
              Genres
            </h3>
            <ul className={footerStyles.linksList}>
              {genreLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={footerStyles.linkItem}>
                    <span className={footerStyles.linkDot}></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <div className={footerStyles.sectionDot} />
              Contact Us
            </h3>
            <ul className={footerStyles.contactList}>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <Mail className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>skillOTech@gmail.com</span>
              </li>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <Phone className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>+91 7848866824 </span>
              </li>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <MapPin className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>BBSR, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={footerStyles.divider}>
          <div className={footerStyles.dividerIconContainer}>
            <Heart className={footerStyles.dividerIcon} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className={footerStyles.bottomBar}>
          <div className={footerStyles.designedBy}>
            <span className={footerStyles.designedByText}>Designed with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <span className={footerStyles.designedByText}>by</span>
            <a
              href="#"
              className={footerStyles.designedByLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              S^3D Team 
            </a>
          </div>
          <div className={footerStyles.policyLinks}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
              <a
                key={index}
                href="#"
                className={footerStyles.policyLink}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={footerStyles.scrollTopButton}>
          <ArrowUp className={footerStyles.scrollTopIcon} />
        </button>
      )}

      {/* Custom CSS */}
      <style>{footerStyles.customCSS}</style>
    </footer>
  );
};

export default Footer;
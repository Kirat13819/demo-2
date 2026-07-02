import React, { useState, useEffect, useRef } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Play, 
  Sparkles, 
  Menu, 
  X,
  Palette,
  Layers,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import ChatBot from './components/ChatBot';

/**
 * Creative Portfolio Hero
 * A transition from a technical landing page to a minimalist creative journey.
 */
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('purpose');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll logic for smooth video fade out
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const videoOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { id: 'purpose', label: 'Vision' },
    { id: 'process', label: 'Chronicle' },
    { id: 'tariffs', label: 'Services' },
    { id: 'try-live', label: 'Connect' },
  ];

  // Journey milestones for a creative portfolio
  const timelineData = [
    { year: '2025', text: 'Opening of the "Digital Soul" solo exhibition in Tokyo. Exploring the intersection of generative algorithms and traditional typography.' },
    { year: '2024', text: 'Guest Lecturer at the Basel School of Design. Focused on minimalist interface systems and the psychology of negative space.' },
    { year: '2023', text: 'Won the "International Design Excellence" award for the rebranding of the Global Archive. A study in timeless modernism.' },
    { year: '2022', text: 'Founded "Studio Aria" in London. Transitioned from agency lead to independent direction, serving cultural institutions.' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
    }
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = window.innerWidth * 0.8;
      timelineRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = ['purpose', 'process', 'tariffs', 'try-live'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main 
      id="root-container" 
      className={`relative w-full h-screen ${(showIntro || isMenuOpen) ? "overflow-hidden" : "overflow-y-auto"} overflow-x-hidden bg-black text-[#e8ede6] scroll-smooth hide-scrollbar transition-colors duration-700`}
      ref={scrollContainerRef}
    >
      

      {/* Navbar Implementation - Fixed */}
      <nav 
        id="main-nav"
        className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-6 flex items-center justify-between"
      >
        {/* Left: Branding */}
        <motion.div 
          id="logo-brand" 
          initial={{ opacity: 0, x: -20 }}
          animate={showIntro ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-white text-xl md:text-2xl font-semibold tracking-tight font-display cursor-pointer"
          onClick={() => scrollToSection('purpose')}
        >
          Aria Chen™
        </motion.div>

        {/* Center: Desktop Navigation Pill */}
        <motion.div 
          id="desktop-nav-pill"
          initial={{ opacity: 0, y: -20 }}
          animate={showIntro ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="hidden lg:flex items-center bg-white/10 backdrop-blur-xl rounded-full p-1 shadow-2xl border border-white/10"
        >
          <div className="flex items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === link.id 
                    ? 'bg-white text-black shadow-md scale-[1.02]' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right: Actions */}
        <motion.div 
          id="nav-actions" 
          initial={{ opacity: 0, x: 20 }}
          animate={showIntro ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="flex items-center space-x-8"
        >
          <div className="hidden sm:flex items-center space-x-8">
            <a href="#archives" className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wide text-white/60 hover:text-white transition-colors">
              <Layers className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Archives</span>
            </a>
            <a href="#about" className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wide text-white/60 hover:text-white transition-colors">
              <Palette className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>About</span>
            </a>
          </div>
          
          {/* Hamburger (Mobile/Tablet) */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-3.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 cursor-pointer hover:bg-white/20 transition-all flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu Implementation */}
      <AnimatePresence>
        {isMenuOpen && (
          <div 
            id="mobile-menu-overlay"
            className="fixed inset-0 z-50 flex justify-end"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-sm bg-neutral-900 border-l border-white/5 h-full shadow-2xl p-8 flex flex-col"
            >
              <button 
                id="close-menu"
                onClick={() => setIsMenuOpen(false)}
                className="self-end p-3.5 mb-8 cursor-pointer text-white hover:bg-white/5 rounded-full transition-all flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col space-y-7 text-xl font-medium text-white">
                {navLinks.map((link) => (
                   <button 
                    key={link.id}
                    onClick={() => {
                      scrollToSection(link.id);
                      setIsMenuOpen(false);
                    }} 
                    className="uppercase tracking-[0.05em] text-left text-lg font-bold py-1 active:opacity-50 text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
                <hr className="border-white/10" />
                <a href="#archives" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 uppercase tracking-[0.05em] text-base font-bold text-white/60 hover:text-white transition-all py-1">
                  <Layers className="w-5 h-5 text-[#85AB8B]" /> <span>Archives</span>
                </a>
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 uppercase tracking-[0.05em] text-base font-bold text-white/60 hover:text-white transition-all py-1">
                  <Palette className="w-5 h-5 text-[#85AB8B]" /> <span>About</span>
                </a>
              </div>

              <motion.button 
                id="mobile-cta"
                whileTap={{ scale: 0.95 }}
                className="mt-auto bg-white text-black w-full py-4 rounded-full font-bold uppercase tracking-[0.1em] text-xs shadow-lg cursor-pointer"
              >
                Inquire Now
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinematic Studio Intro Overlay using the requested video */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="studio-intro"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              filter: "blur(20px)",
              scale: 1.05,
              transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
          >
            {/* Cinematic Background Video */}
            <div className="absolute inset-0 w-full h-full">
              <motion.video
                autoPlay
                muted
                loop
                playsInline
                exit={{ 
                  scale: 1.1,
                  opacity: 0,
                  filter: "blur(10px)",
                  transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                }}
                className="w-full h-full object-cover opacity-60"
              >
                <source
                  src="https://assets.awwwards.com/awards/element/2024/10/66fd03edc4413305639625.mp4"
                  type="video/mp4"
                />
              </motion.video>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Intro Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0,
                  y: -20,
                  filter: "blur(5px)",
                  transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
                }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-2"
              >
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#85AB8B] mb-2 block">
                  Art Direction & Design System
                </span>
                <h1 className="text-white text-5xl md:text-7xl font-light tracking-tighter font-display mb-8">
                  Aria Chen™
                </h1>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ 
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIntro(false)}
                className="px-8 py-4 bg-white hover:bg-neutral-100 text-black rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all cursor-pointer flex items-center space-x-3"
              >
                <span>Enter Studio</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-y-[-0.5px]">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </motion.button>
            </div>

            {/* Accent Details */}
            <motion.div 
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="absolute bottom-10 left-10 text-[9px] uppercase font-bold tracking-widest text-white/30 hidden sm:block"
            >
              © 2026 Studio Aria
            </motion.div>
            <motion.div 
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="absolute bottom-10 right-10 text-[9px] uppercase font-bold tracking-widest text-[#85AB8B] hidden sm:block font-mono"
            >
              [ Click to Explore ]
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAGE 1: VISION (Hero) */}
      <section 
        id="purpose"
        ref={heroRef}
        className="relative min-h-screen md:h-screen w-full flex flex-col justify-between md:justify-center items-center z-10 overflow-hidden py-24 md:py-0 px-6 md:px-10"
      >
        {/* Background Video */}
        <motion.div 
          style={{ 
            opacity: videoOpacity,
            scale: videoScale
          }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={showIntro ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute inset-0 z-0"
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source 
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4" 
              type="video/mp4" 
            />
          </video>
          {/* Bottom Gradient Fade - Ensures smooth transition to black */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
          
          {/* Subtle Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/30 lg:bg-black/20" />
        </motion.div>

        {/* Dummy spacer for mobile layout alignment */}
        <div className="hidden md:block h-10 w-full" />

        <div className="relative text-center px-4 md:px-10 z-10 my-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={showIntro ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.25rem] leading-[1.0] md:leading-[0.92] tracking-tight font-normal max-w-[900px] font-display"
          >
            Crafting digital <br className="hidden sm:block" />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={showIntro ? { opacity: 0 } : { opacity: 1 }}
              transition={{ delay: 0.9, duration: 1.2 }}
              className="text-[#85AB8B]"
            >
              narratives that resonate
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={showIntro ? { opacity: 0, y: 15 } : { opacity: 0.6, y: 0 }}
            transition={{ delay: 1.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 text-white/60 text-xs sm:text-sm md:text-lg leading-relaxed max-w-sm md:max-w-md mx-auto font-normal"
          >
            Independent Art Director focused on minimalist systems and high-fidelity visual storytelling for global institutions.
          </motion.p>
        </div>

        {/* Bottom-Left Feature Block */}
        <motion.div 
          id="bottom-left-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={showIntro ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:absolute md:left-10 md:bottom-10 z-10 max-w-md md:max-w-xs text-left mt-8 md:mt-0"
        >
          <div className="flex items-center space-x-2 text-[#85AB8B] mb-3 md:mb-4">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Current Practice™</span>
          </div>
          
          <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-5 md:mb-6 font-medium">
            Currently exploring the tactile qualities of digital interfaces and the future of spatial interaction design.
          </p>
          
          <div className="flex items-center space-x-5">
            <button 
              className="bg-white hover:bg-[#85AB8B] hover:text-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer min-h-[44px]"
            >
              View Work
            </button>
            <button 
              className="text-white/65 text-xs font-bold border-b border-white/20 pb-0.5 hover:text-white hover:border-white transition-all uppercase tracking-wide cursor-pointer py-1"
            >
              Read Manifesto.
            </button>
          </div>
        </motion.div>
      </section>

      {/* PAGE 2: CHRONICLE (Journey) */}
      <section 
        id="process"
        className="relative min-h-screen md:h-screen w-full flex flex-col items-center justify-center z-10 py-24 md:py-10 overflow-hidden"
      >
        {/* Cinematic Journey Background Video */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8 }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source 
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4" 
              type="video/mp4" 
            />
          </video>
          {/* Top Gradient Fade - Smooth entry from black sections above */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black via-black/85 to-transparent z-10 pointer-events-none" />
          
          {/* Bottom Gradient Fade - Smooth exit to black sections below */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/85 to-transparent z-10 pointer-events-none" />
          
          {/* Ambient Overlay for ideal text visual/contrast */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] z-10 pointer-events-none" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute top-24 left-6 md:top-20 md:left-20 z-20 pr-6"
        >
          <h2 className="text-white/40 text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase">
            A Decade of Creative Evolution
          </h2>
        </motion.div>

        {/* Horizontal Timeline Container */}
        <div 
          ref={timelineRef}
          className="w-full flex items-center overflow-x-auto space-x-8 md:space-x-16 px-6 sm:px-10 md:px-20 hide-scrollbar relative z-20 overscroll-x-contain"
        >
          {timelineData.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -150 : 150 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: idx * 0.1, type: "spring", damping: 25 }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex-shrink-0 flex items-center space-x-4 sm:space-x-6 md:space-x-10 max-w-[85vw] md:max-w-xl"
            >
              <h3 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-[#85AB8B] font-display select-none">
                {item.year}
              </h3>
              <p className="text-white/65 text-xs sm:text-sm leading-relaxed max-w-[170px] sm:max-w-xs font-medium">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Timeline Navigation Arrows */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute bottom-8 right-6 md:bottom-10 md:right-10 flex space-x-3 items-center z-20"
        >
          <button 
            onClick={() => scrollTimeline('left')}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm hover:bg-white/10 active:scale-90 transition-all cursor-pointer group"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 group-hover:text-white transition-colors">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={() => scrollTimeline('right')}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm hover:bg-white/10 active:scale-90 transition-all cursor-pointer group"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 group-hover:text-white transition-colors">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </motion.div>
      </section>

      {/* PAGE 3: SERVICES (Tariffs) */}
      <section 
        id="tariffs"
        className="relative min-h-screen md:h-screen w-full flex flex-col items-center justify-center z-10 py-24 md:py-16 px-6 md:px-10"
      >
        <div className="text-center w-full max-w-5xl">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 12 }}
            className="text-white text-3xl sm:text-4xl md:text-6xl font-display mb-10 md:mb-14 px-4"
          >
            Collaborative Offerings
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto w-full">
            {[
              { name: 'Visual Design', type: 'Systematic', features: ['Core Brand Identity', 'Design Systems', 'Typography Foundations'] },
              { name: 'Art Direction', type: 'Conceptual', features: ['Creative Strategy', 'Photography Direction', 'Narrative Storytelling'] },
              { name: 'Product Core', type: 'Strategic', features: ['UI/UX Ecosystems', 'Motion Foundations', 'Prototype Systems'] }
            ].map((plan, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="p-8 bg-[#111111]/70 backdrop-blur-md border border-white/5 rounded-[24px] text-left flex flex-col hover:bg-neutral-800/45 transition-colors sm:min-h-[340px]"
                style={{ perspective: "1200px" }}
              >
                <span className="text-[9px] font-black tracking-widest uppercase text-white/40 mb-2">{plan.type}</span>
                <div className="text-2xl sm:text-3xl font-bold mb-6 text-white font-display leading-tight">{plan.name}</div>
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="text-xs font-semibold text-white/60 flex items-center">
                      <div className="w-1.5 h-1.5 bg-[#85AB8B] rounded-full mr-2.5"></div>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-auto w-full py-3.5 bg-white hover:bg-[#85AB8B] hover:text-white text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all font-sans cursor-pointer min-h-[44px]"
                >
                  Inquire
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PAGE 4: CONNECT (Try it Live) */}
      <section 
        id="try-live"
        className="relative min-h-screen md:h-screen w-full flex flex-col items-center justify-center z-10 overflow-hidden py-24 md:py-16 px-6 md:px-10"
      >
        {/* Footer Background Video */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source 
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4" 
              type="video/mp4" 
            />
          </video>
          {/* Top Gradient Fade - Smooth entry from black sections above */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
          
          {/* Minimal Overlay for legibility */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <motion.div 
          className="relative max-w-4xl text-center px-4 md:px-10 z-10"
          initial={{ filter: "blur(20px)", opacity: 0, y: 50 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-[7.5rem] font-display leading-[1.0] md:leading-none mb-6 md:mb-8 tracking-tighter">
            Let's build the <br/><span className="text-[#85AB8B]">Visual Future</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-10 md:mb-12 opacity-80 font-normal">
            Currently accepting commissions for late 2024 and beyond. Let's discuss your vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, rotate: 1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ delay: 0.2 }}
              className="px-8 md:px-10 py-4.5 md:py-5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all cursor-pointer min-h-[44px] w-full sm:w-auto"
            >
              Start Collaboration
            </motion.button>
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, rotate: -1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ delay: 0.3 }}
              className="px-8 md:px-10 py-4.5 md:py-5 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-white/10 hover:bg-white/20 transition-all shadow-xl cursor-pointer min-h-[44px] w-full sm:w-auto"
            >
              Media Kit
            </motion.button>
          </div>
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 md:bottom-10 left-0 right-0 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-center sm:text-left z-20 pointer-events-none"
        >
           <span className="text-[10px] font-bold uppercase tracking-widest text-white">© 2024 Aria Chen. All rights reserved.</span>
           <div className="flex space-x-6 pointer-events-auto">
              <a href="#" className="text-[10px] font-bold uppercase tracking-wide text-white/60 hover:text-white transition-opacity">Instagram</a>
              <a href="#" className="text-[10px] font-bold uppercase tracking-wide text-white/60 hover:text-white transition-opacity">LinkedIn</a>
           </div>
        </motion.footer>
      </section>

      {/* Floating AI Chatbot */}
      <ChatBot />

    </main>
  );
}

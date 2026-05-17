import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, X, Mail, Video, Film, Users, Send } from 'lucide-react';
import { cn } from './lib/utils';

// --- Constants ---
const BACKGROUND_VIDEO_URL = "https://www.youtube.com/watch?v=wzl7CkAhx28";
const CAROUSEL_VIDEOS = [
  "https://www.youtube.com/watch?v=wzl7CkAhx28", // Official Reel
  "https://vimeo.com/1071292828", // Sin Bandera
  "https://vimeo.com/725735848",  // El cuerpo que habito (Assumption based on sequence provided previously)
  "https://vimeo.com/520416093",
  "https://vimeo.com/420175616",
  "https://vimeo.com/339455334"
];

// --- Components ---

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/50 to-transparent"
    >
      <div className="text-2xl font-bold tracking-tighter text-white uppercase">
        Mayra <span className="font-light opacity-80">Berry</span>
      </div>
      <div className="hidden space-x-8 text-sm font-medium tracking-widest text-white uppercase md:flex">
        <a href="#obra" className="transition-opacity hover:opacity-60">Obra</a>
        <a href="#vision" className="transition-opacity hover:opacity-60">Visión</a>
        <a href="#contacto" className="transition-opacity hover:opacity-60">Contacto</a>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center h-screen overflow-hidden bg-black">
      {/* Background Video - Using Iframe directly for maximum compatibility */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <iframe
          src="https://www.youtube.com/embed/wzl7CkAhx28?autoplay=1&mute=1&controls=0&loop=1&playlist=wzl7CkAhx28&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115vw] h-[115vh] md:w-[150vw] md:h-[150vh] object-cover pointer-events-none"
          allow="autoplay; encrypted-media"
          title="Background Video"
        ></iframe>
      </div>
      
      {/* Film Grain / Noise Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_p_Noisey_Texture.png')]"></div>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/20 to-black/60"></div>
      
      {/* Overlay Content */}
      <div className="relative z-10 px-4 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span className="inline-block px-5 py-1.5 mb-8 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase border border-white/20 rounded-full text-white/90 backdrop-blur-sm bg-white/5">
            Director de Cine & Narrativa Visual
          </span>
          <h1 className="text-5xl md:text-[10rem] font-black tracking-tighter text-white uppercase leading-[0.8] mb-10 font-heading">
            Mayra <br /><span className="text-transparent border-text stroke-white">Berry</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/70 font-light leading-snug tracking-tight">
            Capturando la esencia humana a través de lentes cinematográficas. Historias que trascienden la pantalla.
          </p>
          <motion.div 
            className="mt-14"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="#obra" 
              className="inline-flex items-center gap-3 px-10 py-5 text-[11px] font-black tracking-[0.3em] text-black uppercase transition-all bg-white hover:bg-zinc-200"
            >
              Explorar Portfolio <Film size={18} />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase vertical-text">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (CAROUSEL_VIDEOS.length));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_VIDEOS.length) % CAROUSEL_VIDEOS.length);
  };

  // Extract ID and platform for thumbnails
  const getThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    if (url.includes('vimeo.com')) {
      // For Vimeo, we'd normally need an API call, but we can use a placeholder or known cover
      return `https://vumbnail.com/${url.split('/').pop()}.jpg`;
    }
    return "";
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&rel=0&modestbranding=1`;
    }
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;
    }
    return "";
  };

  return (
    <section id="obra" className="py-32 bg-zinc-950 overflow-hidden border-t border-white/5">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-end justify-between mb-20 md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-0"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-white/20"></div>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">Portfolio</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
              Obra <span className="text-transparent border-text stroke-white/40">Seleccionada</span>
            </h2>
          </motion.div>
          <div className="flex gap-4">
            <button 
              onClick={prevSlide} 
              className="p-5 transition-all border border-white/10 rounded-full text-white hover:bg-white hover:text-black hover:scale-110 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide} 
              className="p-5 transition-all border border-white/10 rounded-full text-white hover:bg-white hover:text-black hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            className="flex gap-6"
            animate={{ x: `-${currentIndex * (window.innerWidth < 768 ? 90 : 42)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {CAROUSEL_VIDEOS.map((video, idx) => (
              <motion.div 
                key={idx}
                className="relative flex-shrink-0 w-[85%] md:w-[40%] aspect-video group cursor-pointer overflow-hidden border border-white/5"
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="absolute inset-0 bg-black z-[1]"></div>
                <img 
                  src={getThumbnail(video)} 
                  alt={`Project ${idx + 1}`}
                  className="absolute inset-0 z-[2] object-cover w-full h-full transition-all duration-700 opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
                <div className="absolute inset-0 z-[3] bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute inset-0 z-[4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Play className="text-black fill-black ml-1" size={32} />
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-8 z-[5] opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-white uppercase mb-2">Director's Select_{idx + 1}</p>
                  <h3 className="text-3xl font-black text-white uppercase font-heading italic tracking-tighter">
                    {idx === 0 ? "OFFICIAL_REEL" : "PROJECT_FILM"}
                  </h3>
                </div>
                
                {/* Number Indicator */}
                <div className="absolute top-6 right-8 z-[5] text-[10px] font-mono text-white/20 group-hover:text-white/60 transition-colors">
                  {(idx + 1).toString().padStart(2, '0')} / {CAROUSEL_VIDEOS.length.toString().padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 md:p-12"
          >
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full z-[110]"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-6xl aspect-video relative shadow-2xl">
              <iframe
                src={getVideoEmbedUrl(selectedVideo)}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                title="Project Video"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ContactSection = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      body: formData.get('body'),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Ocurrió un error al enviar tu mensaje.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("error");
      setErrorMsg("Ocurrió un error de red.");
    }
  };

  return (
    <section id="contacto" className="py-24 bg-black">
      <div className="container px-4 mx-auto">
        <div className="grid gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase leading-tight mb-8">
              Tu próximo <br /><span className="text-transparent border-text stroke-white">Gran Proyecto</span> <br />comienza aquí.
            </h2>
            <div className="space-y-6">
              <a href="mailto:baez@hitster.page" className="flex items-center gap-4 text-zinc-400 group cursor-pointer hover:text-white transition-colors">
                <div className="p-3 border border-white/10 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                  <Mail size={20} />
                </div>
                <span className="text-lg font-medium tracking-wide">baez@hitster.page</span>
              </a>
              <a href="mailto:baez@hitster.page?subject=Project%20Inquiry" className="flex items-center gap-4 text-zinc-400 group cursor-pointer hover:text-white transition-colors">
                <div className="p-3 border border-white/10 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                  <Video size={20} />
                </div>
                <span className="text-lg font-medium tracking-wide">Discutamos tu visión</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 border border-white/10 bg-zinc-900/50 backdrop-blur-sm"
          >
            <form 
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Nombre</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    className="w-full px-0 py-3 text-white transition-colors bg-transparent border-b border-white/10 focus:border-white outline-none"
                    placeholder="Tu nombre"
                    disabled={status === "loading"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Email</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full px-0 py-3 text-white transition-colors bg-transparent border-b border-white/10 focus:border-white outline-none"
                    placeholder="email@tuempresa.com"
                    disabled={status === "loading"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Mensaje</label>
                <textarea 
                  name="body"
                  rows={4}
                  required
                  className="w-full px-0 py-3 text-white transition-colors bg-transparent border-b border-white/10 focus:border-white outline-none resize-none"
                  placeholder="Háblanos de tu visión..."
                  disabled={status === "loading"}
                />
              </div>
              
              {status === "success" && (
                <div className="p-4 text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20">
                  ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                </div>
              )}
              {status === "error" && (
                <div className="p-4 text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="group flex items-center justify-center gap-3 w-full py-5 text-sm font-bold tracking-[0.2em] text-black uppercase bg-white hover:bg-zinc-200 transition-all font-heading disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Enviando..." : status === "success" ? "Enviado" : "Enviar Propuesta"}
                {status !== "loading" && status !== "success" && <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 bg-black border-t border-white/5">
      <div className="container px-4 mx-auto text-center">
        <div className="text-xl font-bold tracking-tighter text-white uppercase mb-4">
          Mayra <span className="font-light opacity-60">Berry</span>
        </div>
        <p className="text-xs tracking-[0.2em] text-zinc-600 uppercase">
          © 2026 todos los derechos reservados a Hitster Media
        </p>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black bg-black grid-bg">
      <Navbar />
      <main>
        <Hero />
        
        {/* Manifesto Section - High Conversion Copy */}
        <section className="py-32 bg-black overflow-hidden border-y border-white/5">
          <div className="container px-4 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-500 mb-6 block">Filosofía Artística</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-8 font-heading">
                  Más que <br />Imagen. <br />
                  <span className="text-transparent border-text stroke-white/40">Emoción Pura.</span>
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed">
                  Mi trabajo es una búsqueda constante por la verdad visual. Me especializo en narrativas que exploran la condición humana, combinando una estética cruda con una ejecución cinematográfica de vanguardia.
                </p>
                <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/10">
                  <div>
                    <p className="text-3xl font-black text-white mb-2 tracking-tighter">01_CRAFT</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest leading-loose">Obsesión por cada frame y detalle técnico.</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white mb-2 tracking-tighter">02_IMPACT</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest leading-loose">Narrativas que no solo se ven, se sienten.</p>
                  </div>
                </div>
                <motion.div whileHover={{ x: 10 }}>
                  <a href="#contacto" className="inline-flex items-center gap-4 text-xs font-black tracking-[0.3em] text-white uppercase group">
                    Comienza el proyecto <Send size={14} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <VideoCarousel />
        
        {/* Vision & Ethics Section */}
        <section id="vision" className="py-24 bg-white">
          <div className="container px-4 mx-auto text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Film className="mx-auto mb-8 text-black" size={48} strokeWidth={1} />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black uppercase mb-8">
                Narrativas Visuales <br />que Redefinen la Estética
              </h2>
              <p className="text-xl text-zinc-500 italic font-light leading-relaxed mb-12">
                "Mi propósito no es solo filmar; es crear piezas de arte cinematográfico que eleven la historia y perduren en la memoria emocional de quien las ve."
              </p>
              <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
                {['Innovation', 'Craft', 'Impact', 'Versatility'].map((val) => (
                  <div key={val} className="text-sm font-bold tracking-widest text-black uppercase border-b border-black pb-2">
                    {val}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

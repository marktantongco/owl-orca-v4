"use client";

import { useEffect, useRef, useState, useCallback, useMemo, Component } from "react";
import Image from "next/image";
import {
  Zap,
  ArrowRightLeft,
  Shield,
  GitBranch,
  HardHat,
  RefreshCw,
  Lock,
  Download,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Menu,
  X,
  Trophy,
  Bug,
  Wrench,
  AlertTriangle,
  Clock,
  ArrowRight,
  Terminal,
  ArrowUp,
  Cpu,
  RotateCcw,
  CreditCard,
  Database,
  BookOpen,
  Rocket,
  Fingerprint,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* Simple GitHub SVG icon since lucide-react doesn't export one */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ────────────────────────────────────────────
   ERROR BOUNDARY COMPONENT
   ──────────────────────────────────────────── */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<
  { children: React.ReactNode; sectionName?: string },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; sectionName?: string }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[OWL-ORCA ErrorBoundary${this.props.sectionName ? ` - ${this.props.sectionName}` : ''}]`,
      error.message,
      '\nComponent Stack:',
      errorInfo.componentStack
    );
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center bg-background text-foreground p-8">
          <div className="glass-depth p-8 rounded-2xl max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-owl-amber mx-auto mb-4 vivid-icon" />
            <h2 className="text-xl font-bold mb-2 text-owl-cyan heading-glow">
              Something went wrong
            </h2>
            <p className="text-foreground/90 mb-2">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            {this.props.sectionName && (
              <p className="text-xs text-foreground/60 mb-4">
                Section: {this.props.sectionName}
              </p>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="px-4 py-2 rounded-lg bg-owl-cyan/20 border border-owl-cyan/60 text-owl-cyan hover:bg-owl-cyan/30 transition-all"
              aria-label="Retry rendering"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ────────────────────────────────────────────
   SECTION REVEAL HOOK
   ──────────────────────────────────────────── */
function useSectionReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ────────────────────────────────────────────
   FLOATING PARTICLES BACKGROUND
   ──────────────────────────────────────────── */
function FloatingParticles() {
  const particles = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9301 + 49297) * 49297;
      return x - Math.floor(x);
    };
    return Array.from({ length: 20 }, (_, i) => ({
      width: 2 + seededRandom(i * 3 + 1) * 4,
      height: 2 + seededRandom(i * 3 + 2) * 4,
      left: seededRandom(i * 3 + 3) * 100,
      top: seededRandom(i * 3 + 4) * 100,
      duration: 12 + seededRandom(i * 3 + 5) * 18,
      delay: seededRandom(i * 3 + 6) * -20,
      colorIndex: i % 3,
    }));
  }, []);

  const orbs = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9301 + 49297) * 49297;
      return x - Math.floor(x);
    };
    return Array.from({ length: 6 }, (_, i) => ({
      width: 40 + seededRandom(i * 5 + 10) * 60,
      height: 40 + seededRandom(i * 5 + 11) * 60,
      left: 10 + seededRandom(i * 5 + 12) * 80,
      top: 10 + seededRandom(i * 5 + 13) * 80,
      duration: 6 + seededRandom(i * 5 + 14) * 6,
      delay: seededRandom(i * 5 + 15) * -10,
      colorIndex: i % 3,
    }));
  }, []);

  const particleColors = useMemo(() => [
    { bg: "rgba(0,212,255,0.4)", shadow: "0 0 6px rgba(0,212,255,0.3)" },
    { bg: "rgba(16,185,129,0.4)", shadow: "0 0 6px rgba(16,185,129,0.3)" },
    { bg: "rgba(224,64,251,0.4)", shadow: "0 0 6px rgba(224,64,251,0.3)" },
  ], []);

  const orbGradients = useMemo(() => [
    "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
    "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
    "radial-gradient(circle, rgba(224,64,251,0.06) 0%, transparent 70%)",
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,212,255,0.06)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(224,64,251,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(16,185,129,0.04)_0%,transparent_50%)]" />

      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: particleColors[p.colorIndex].bg,
            animation: `particle-drift ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: particleColors[p.colorIndex].shadow,
          }}
        />
      ))}

      {orbs.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${orb.width}px`,
            height: `${orb.height}px`,
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            background: orbGradients[orb.colorIndex],
            animation: `breathe ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            filter: "blur(20px)",
          }}
        />
      ))}

      <div
        className="absolute"
        style={{
          width: "300px",
          height: "300px",
          left: "60%",
          top: "20%",
          background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 60%)",
          animation: "morph 12s ease-in-out infinite, breathe 8s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute"
        style={{
          width: "200px",
          height: "200px",
          left: "15%",
          top: "60%",
          background: "radial-gradient(circle, rgba(224,64,251,0.04) 0%, transparent 60%)",
          animation: "morph 15s ease-in-out infinite reverse, breathe 10s ease-in-out infinite",
          animationDelay: "-5s",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   OWL EYES ANIMATION
   ──────────────────────────────────────────── */
function OwlEyes() {
  return (
    <div className="flex items-center justify-center gap-4 mb-6" aria-hidden="true">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3e] border-2 border-owl-cyan/30 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: "owl-blink 4s ease-in-out infinite" }}
        >
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-owl-cyan/80 shadow-[0_0_15px_rgba(0,212,255,0.6)]"
            style={{ animation: "owl-look 6s ease-in-out infinite" }}
          >
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0a0a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ animation: "owl-dilate 5s ease-in-out infinite" }}
            />
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-2 left-2 opacity-80" />
          </div>
        </div>
      </div>
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3e] border-2 border-owl-green/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: "owl-blink 4s ease-in-out infinite", animationDelay: "0.2s" }}
        >
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-owl-green/80 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
            style={{ animation: "owl-look 6s ease-in-out infinite", animationDelay: "0.3s" }}
          >
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0a0a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ animation: "owl-dilate 5s ease-in-out infinite", animationDelay: "0.5s" }}
            />
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-2 left-2 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   NAV BAR WITH ACTIVE SECTION HIGHLIGHTING
   ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Architecture", href: "#architecture" },
  { label: "StreamRacer", href: "#streamracer" },
  { label: "Features", href: "#features" },
  { label: "Circuits", href: "#circuit-breaker" },
  { label: "Protocol", href: "#protocol" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Memory", href: "#memory" },
  { label: "Timeline", href: "#timeline" },
  { label: "Install", href: "#install" },
  { label: "Matrix", href: "#matrix" },
];

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-owl-cyan font-bold text-lg sm:text-xl tracking-tight group-hover:text-glow-cyan transition-all">
              🦉 OWL-ORCA
            </span>
            <Badge
              variant="outline"
              className="text-xs border-owl-cyan/40 text-owl-cyan bg-owl-cyan/10"
            >
              v8.0
            </Badge>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-2.5 py-1.5 text-sm transition-colors rounded-lg hover:bg-white/5 ${
                    isActive
                      ? "text-owl-cyan"
                      : "text-foreground/80 hover:text-owl-cyan"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-owl-cyan rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
            <Separator orientation="vertical" className="mx-2 h-5 bg-white/10" />
            <a
              href="https://github.com/marktantongco/owl-orca-v3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground/80 hover:text-white transition-colors"
              aria-label="View on GitHub"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-foreground/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm transition-colors rounded-lg hover:bg-white/5 ${
                      isActive
                        ? "text-owl-cyan bg-owl-cyan/5"
                        : "text-foreground/80 hover:text-owl-cyan"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a
                href="https://github.com/marktantongco/owl-orca-v3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:text-white transition-colors"
                aria-label="View on GitHub"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ────────────────────────────────────────────
   SCROLL TO TOP BUTTON
   ──────────────────────────────────────────── */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-owl-cyan/20 border border-owl-cyan/40 text-owl-cyan flex items-center justify-center hover:bg-owl-cyan/30 transition-all shadow-lg shadow-black/20"
          aria-label="Scroll to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────
   SECTION SEPARATOR
   ──────────────────────────────────────────── */
function SectionSeparator({ color = "owl-cyan" }: { color?: string }) {
  return (
    <div
      className="h-0.5 bg-gradient-to-r from-transparent via-owl-cyan/20 to-transparent my-0"
      style={{
        background: `linear-gradient(to right, transparent, var(--color-${color}, #00d4ff) / 0.25, transparent)`,
      }}
    />
  );
}

/* ────────────────────────────────────────────
   HERO SECTION
   ──────────────────────────────────────────── */
function HeroSection() {
  const { ref, visible } = useSectionReveal();

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden"
    >
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <OwlEyes />

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4">
          <span className="bg-gradient-to-r from-owl-cyan via-owl-green to-owl-magenta bg-clip-text text-transparent">
            OWL-ORCA
          </span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl text-foreground/90 max-w-2xl mx-auto mb-6 leading-relaxed">
          AI Gateway with{" "}
          <span className="text-owl-cyan font-semibold">Stream Racing</span>,{" "}
          <span className="text-owl-green font-semibold">Protocol Translation</span> &{" "}
          <span className="text-owl-magenta font-semibold">Circuit Breakers</span>
        </p>

        <p className="text-sm sm:text-base text-foreground/85 mb-8">
          Free AI for everyone. Race multiple providers. First byte wins.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#install"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-owl-cyan/10 border border-owl-cyan/40 text-owl-cyan hover:bg-owl-cyan/20 hover:border-owl-cyan/50 transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            aria-label="Quick Install"
          >
            <Terminal className="w-4 h-4" />
            Quick Install
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://github.com/marktantongco/owl-orca-v3"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/14 text-foreground/80 hover:text-white hover:bg-white/10 transition-all"
            aria-label="View on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
            View on GitHub
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <Badge variant="outline" className="border-owl-cyan/40 text-owl-cyan bg-owl-cyan/10 text-xs">
            v8.0.0
          </Badge>
          <Badge variant="outline" className="border-owl-green/40 text-owl-green bg-owl-green/10 text-xs">
            MIT License
          </Badge>
          <Badge variant="outline" className="border-owl-magenta/40 text-owl-magenta bg-owl-magenta/10 text-xs">
            8GB RAM Optimized
          </Badge>
          <Badge variant="outline" className="border-yellow-400/40 text-yellow-400 bg-yellow-400/10 text-xs">
            Python 3.10+
          </Badge>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   ARCHITECTURE SECTION
   ──────────────────────────────────────────── */
function ArchitectureSection() {
  const { ref, visible } = useSectionReveal();

  return (
    <section
      id="architecture"
      ref={ref}
      className="relative py-20 sm:py-28 px-4 scroll-mt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15 mb-4">
            System Design
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-cyan to-owl-green bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            OWL-ORCA routes AI requests through a local proxy and router stack, racing multiple
            free-tier providers simultaneously. The first provider to respond wins.
          </p>
        </div>

        <div className="glass-depth p-3 sm:p-4 mb-12 overflow-hidden">
          <Image
            src="/architecture-schematic.png"
            alt="OWL-ORCA Architecture Schematic"
            width={1200}
            height={600}
            className="w-full h-auto rounded-xl"
            priority
          />
        </div>

        <div className="glass p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-owl-cyan mb-6 text-center">Request Flow</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            <FlowNode
              icon={<Terminal className="w-5 h-5" />}
              label="Client"
              sublabel="IDE / CLI"
              color="cyan"
            />
            <FlowArrow />
            <FlowNode
              icon={<Shield className="w-5 h-5" />}
              label="Forward Proxy"
              sublabel="Port 60000"
              color="magenta"
            />
            <FlowArrow />
            <div className="glass-strong p-4 rounded-xl text-center min-w-[160px] glow-cyan">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-owl-cyan/30 flex items-center justify-center drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">
                  <Zap className="w-4 h-4 text-owl-cyan" />
                </div>
              </div>
              <p className="text-sm font-bold text-owl-cyan">Orca Router</p>
              <p className="text-xs text-foreground/70">Port 60001</p>
              <div className="mt-2 space-y-1">
                <div className="text-xs px-2 py-0.5 rounded bg-owl-cyan/15 text-owl-cyan inline-block mr-1 drop-shadow-[0_0_4px_rgba(0,212,255,0.3)]">
                  Radix Tree
                </div>
                <div className="text-xs px-2 py-0.5 rounded bg-owl-green/15 text-owl-green inline-block mr-1 drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Stream Racer
                </div>
                <div className="text-xs px-2 py-0.5 rounded bg-owl-magenta/15 text-owl-magenta inline-block drop-shadow-[0_0_4px_rgba(224,64,251,0.3)]">
                  Translator
                </div>
              </div>
            </div>
            <FlowArrow />
            <div className="flex flex-col gap-2">
              <FlowNode
                icon={<Zap className="w-4 h-4" />}
                label="GitHub Copilot"
                sublabel="Free Tier"
                color="green"
                small
              />
              <FlowNode
                icon={<Zap className="w-4 h-4" />}
                label="Antigravity"
                sublabel="Free Tier"
                color="green"
                small
              />
              <FlowNode
                icon={<Zap className="w-4 h-4" />}
                label="Kiro Gateway"
                sublabel="AWS Builder"
                color="green"
                small
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FlowNode({
  icon,
  label,
  sublabel,
  color,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: "cyan" | "green" | "magenta";
  small?: boolean;
}) {
  const colorMap = {
    cyan: "border-owl-cyan/30 text-owl-cyan bg-owl-cyan/5 hover:border-owl-cyan/50",
    green: "border-owl-green/30 text-owl-green bg-owl-green/5 hover:border-owl-green/50",
    magenta: "border-owl-magenta/30 text-owl-magenta bg-owl-magenta/5 hover:border-owl-magenta/50",
  };

  return (
    <div
      className={`${small ? "p-2.5" : "p-4"} rounded-xl border text-center min-w-[120px] transition-all hover:scale-105 ${colorMap[color]}`}
    >
      <div className={`flex items-center justify-center mb-1 ${small ? "" : "mb-2"}`}>
        <div
          className={`${small ? "w-6 h-6" : "w-8 h-8"} rounded-lg bg-current/25 flex items-center justify-center [&>svg]:text-current drop-shadow-[0_0_8px_currentColor]`}
        >
          {icon}
        </div>
      </div>
      <p className={`${small ? "text-xs" : "text-sm"} font-semibold`}>{label}</p>
      <p className="text-xs text-foreground/70">{sublabel}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center text-owl-cyan/50 flow-arrow-animated">
      <div className="hidden md:block">
        <ArrowRight className="w-5 h-5" />
      </div>
      <div className="md:hidden">
        <ChevronRight className="w-5 h-5 rotate-90" />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   STREAM RACER SECTION (UPGRADED)
   ──────────────────────────────────────────── */
function StreamRacerSection() {
  const { ref, visible } = useSectionReveal();
  const [raceKey, setRaceKey] = useState(0);

  const providers = useMemo(() => [
    { name: "GitHub Copilot", color: "#00d4ff", baseLatency: 120 },
    { name: "Antigravity", color: "#e040fb", baseLatency: 180 },
    { name: "Kiro Gateway", color: "#10b981", baseLatency: 250 },
  ], []);

  const raceResults = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9301 + raceKey * 49297) * 49297;
      return x - Math.floor(x);
    };
    const results = providers.map((p, i) => ({
      ...p,
      latency: Math.round(p.baseLatency + seededRandom(i + raceKey) * 150),
    }));
    results.sort((a, b) => a.latency - b.latency);
    return results;
  }, [providers, raceKey]);

  const winner = raceResults[0];

  const handleReRace = useCallback(() => {
    setRaceKey((k) => k + 1);
  }, []);

  return (
    <section
      id="streamracer"
      ref={ref}
      className="relative py-20 sm:py-28 px-4 overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.04)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15 mb-4">
            Core Engine
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-cyan to-owl-green bg-clip-text text-transparent">
              StreamRacer
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            Fire requests to ALL eligible providers simultaneously. The first byte wins — all other
            streams are immediately cancelled. Zero wasted latency.
          </p>
        </div>

        <div className="glass-depth p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-owl-cyan" />
              <h3 className="text-lg font-semibold text-white">Live Race Simulation</h3>
            </div>
            <button
              onClick={handleReRace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-owl-cyan/10 border border-owl-cyan/30 text-owl-cyan text-sm hover:bg-owl-cyan/20 transition-all"
              aria-label="Re-run race simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Re-Race
            </button>
          </div>

          <div key={raceKey}>
            {raceResults.map((provider, i) => (
              <RaceTrack
                key={provider.name}
                name={provider.name}
                color={provider.color}
                delay={i * 0.15}
                duration={2 + i * 0.5}
                winner={i === 0}
                latency={provider.latency}
              />
            ))}
          </div>

          <motion.div
            key={`winner-${raceKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center gap-3 p-3 rounded-lg bg-owl-cyan/5 border border-owl-cyan/20"
          >
            <Trophy className="w-5 h-5 text-owl-cyan shrink-0" />
            <div>
              <p className="text-sm font-semibold text-owl-cyan">{winner.name} wins the race!</p>
              <p className="text-sm text-foreground/80">
                {winner.latency}ms first-byte — Stream translated from {winner.name === "Antigravity" ? "Anthropic" : "OpenAI"} SSE → Client. Loser streams cancelled.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Request Arrives", desc: "Client sends request to Orca Router with race strategy", color: "cyan" as const },
            { step: "2", title: "Fire All Providers", desc: "Simultaneously request from every eligible provider", color: "magenta" as const },
            { step: "3", title: "First Byte Wins", desc: "Provider with first translated SSE chunk wins the race", color: "green" as const },
            { step: "4", title: "Cancel Losers", desc: "Loser streams cancelled immediately to free resources", color: "cyan" as const },
          ].map((item) => (
            <div key={item.step} className="glass p-4 text-center group hover:scale-[1.02] transition-transform">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg ${
                  item.color === "cyan"
                    ? "bg-owl-cyan/30 text-owl-cyan border border-owl-cyan/40 icon-glow-cyan"
                    : item.color === "magenta"
                      ? "bg-owl-magenta/30 text-owl-magenta border border-owl-magenta/40 icon-glow-magenta"
                      : "bg-owl-green/30 text-owl-green border border-owl-green/40 icon-glow-green"
                }`}
              >
                {item.step}
              </div>
              <p className="text-base font-semibold mb-1">{item.title}</p>
              <p className="text-sm text-foreground/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function RaceTrack({
  name,
  color,
  delay,
  winner = false,
  latency,
}: {
  name: string;
  color: string;
  delay: number;
  duration?: number;
  winner?: boolean;
  latency?: number;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-3 mb-1">
        <span
          className="text-sm font-mono w-28 sm:w-32 shrink-0 truncate"
          style={{ color }}
        >
          {name}
        </span>
        {latency && (
          <span className="text-xs text-foreground/80 font-mono">{latency}ms</span>
        )}
        {winner && (
          <Badge
            variant="outline"
            className="text-xs py-0 px-1.5"
            style={{ borderColor: color, color, backgroundColor: `${color}10` }}
          >
            WINNER
          </Badge>
        )}
      </div>
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-10"
          style={{ backgroundColor: color, width: "100%" }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 right-0 rounded-full origin-left"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   FEATURES GRID
   ──────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Zap,
    title: "Stream Racing",
    subtitle: "First Byte Wins",
    desc: "Fire requests to all providers simultaneously. The first provider to return a translated SSE chunk wins — losers cancelled instantly.",
    color: "cyan" as const,
  },
  {
    icon: ArrowRightLeft,
    title: "Protocol Translation",
    subtitle: "Anthropic ↔ OpenAI",
    desc: "Real-time, chunk-by-chunk SSE translation between Anthropic and OpenAI formats. Zero buffering, zero-copy streaming.",
    color: "green" as const,
  },
  {
    icon: Shield,
    title: "Half-Open Circuit Breakers",
    subtitle: "Probe-Based Recovery",
    desc: "Automatic fault detection with probe-based recovery. 5 consecutive failures → circuit opens. 60s cooldown, then one probe request.",
    color: "magenta" as const,
  },
  {
    icon: GitBranch,
    title: "Radix Tree Routing",
    subtitle: "O(1) Path Matching",
    desc: "No regex, no loops — just tree traversal for all API routes. Lightning-fast path matching with zero overhead.",
    color: "cyan" as const,
  },
  {
    icon: HardHat,
    title: "Safe-Mode",
    subtitle: "IDE Protection",
    desc: "Detects running IDEs and preserves active connections during updates. Updated code activates on next restart — no dropped connections.",
    color: "green" as const,
  },
  {
    icon: RefreshCw,
    title: "SIGHUP Hot-Reload",
    subtitle: "Zero-Drop Config Swap",
    desc: "Swap routing configuration without dropping a single TCP connection. systemctl --user reload is always safe.",
    color: "magenta" as const,
  },
  {
    icon: Lock,
    title: "Fernet Token Encryption",
    subtitle: "Encrypted at Rest",
    desc: "OAuth tokens encrypted at rest using Fernet symmetric encryption with auto-generated keys. Secure file permissions (0600).",
    color: "cyan" as const,
  },
  {
    icon: Download,
    title: "Zero-Downtime Installs",
    subtitle: "Atomic File Writes",
    desc: "Every file update uses write-to-temp + mv for inode swap. Prevents IDE file watcher crashes and partial reads.",
    color: "green" as const,
  },
];

function FeaturesSection() {
  const { ref, visible } = useSectionReveal();

  return (
    <section id="features" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(224,64,251,0.03)_0%,transparent_50%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-magenta/60 text-owl-magenta bg-owl-magenta/15 mb-4">
            Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-magenta to-owl-cyan bg-clip-text text-transparent">
              Feature Set
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            Battle-tested through five audit passes. Every feature is production-hardened.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const colorMap = useMemo(() => ({
    cyan: {
      iconBg: "bg-owl-cyan/30",
      iconColor: "text-owl-cyan",
      borderHover: "hover:border-owl-cyan/30",
      glowHover: "hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]",
      badge: "border-owl-cyan/40 text-owl-cyan bg-owl-cyan/10",
      hoverGlow: "group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]",
    },
    green: {
      iconBg: "bg-owl-green/30",
      iconColor: "text-owl-green",
      borderHover: "hover:border-owl-green/30",
      glowHover: "hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      badge: "border-owl-green/40 text-owl-green bg-owl-green/10",
      hoverGlow: "group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]",
    },
    magenta: {
      iconBg: "bg-owl-magenta/30",
      iconColor: "text-owl-magenta",
      borderHover: "hover:border-owl-magenta/30",
      glowHover: "hover:shadow-[0_0_20px_rgba(224,64,251,0.1)]",
      badge: "border-owl-magenta/40 text-owl-magenta bg-owl-magenta/10",
      hoverGlow: "group-hover:drop-shadow-[0_0_8px_rgba(224,64,251,0.4)]",
    },
  }), []);

  const c = colorMap[feature.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`glass-depth p-5 transition-all duration-300 group ${c.borderHover} ${c.glowHover} hover:scale-[1.02]`}
    >
      <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${c.hoverGlow}`}>
        <feature.icon className={`w-5 h-5 ${c.iconColor} vivid-icon`} />
      </div>
      <h3 className="text-base font-bold mb-1">{feature.title}</h3>
      <Badge variant="outline" className={`text-xs py-0 px-1.5 mb-2 ${c.badge}`}>
        {feature.subtitle}
      </Badge>
      <p className="text-sm text-foreground/80 leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   CIRCUIT BREAKER DEMO (NEW)
   ──────────────────────────────────────────── */
type CircuitState = "CLOSED" | "HALF-OPEN" | "OPEN";

function CircuitBreakerDemo() {
  const { ref, visible } = useSectionReveal();
  const [state, setState] = useState<CircuitState>("CLOSED");
  const [failureCount, setFailureCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [probeActive, setProbeActive] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateFailure = useCallback(() => {
    if (state === "CLOSED") {
      const next = failureCount + 1;
      setFailureCount(next);
      if (next >= 5) {
        setState("OPEN");
        setCooldown(60);
      }
    } else if (state === "HALF-OPEN") {
      setState("OPEN");
      setFailureCount(5);
      setCooldown(60);
    }
  }, [state, failureCount]);

  const simulateSuccess = useCallback(() => {
    if (state === "HALF-OPEN") {
      setState("CLOSED");
      setFailureCount(0);
      setProbeActive(false);
    }
  }, [state]);

  useEffect(() => {
    if (state === "OPEN" && cooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            setState("HALF-OPEN");
            setProbeActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (cooldownRef.current) clearInterval(cooldownRef.current);
      };
    }
  }, [state, cooldown]);

  const resetCircuit = useCallback(() => {
    setState("CLOSED");
    setFailureCount(0);
    setCooldown(0);
    setProbeActive(false);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
  }, []);

  const stateColors: Record<CircuitState, string> = {
    CLOSED: "border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    "HALF-OPEN": "border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    OPEN: "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
  };

  const stateTextColors: Record<CircuitState, string> = {
    CLOSED: "text-emerald-400",
    "HALF-OPEN": "text-amber-400",
    OPEN: "text-red-400",
  };

  const stateBgColors: Record<CircuitState, string> = {
    CLOSED: "bg-emerald-500/10",
    "HALF-OPEN": "bg-amber-500/10",
    OPEN: "bg-red-500/10",
  };

  return (
    <section id="circuit-breaker" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(224,64,251,0.04)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-magenta/60 text-owl-magenta bg-owl-magenta/15 mb-4">
            Interactive Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-magenta to-owl-amber bg-clip-text text-transparent">
              Circuit Breaker
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            Watch how circuit breakers protect your system. 5 consecutive failures trigger the OPEN state,
            a 60-second cooldown leads to HALF-OPEN, and a successful probe restores the CLOSED state.
          </p>
        </div>

        <div className="glass-depth p-6 sm:p-8">
          {/* State Machine Diagram */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            {(["CLOSED", "HALF-OPEN", "OPEN"] as CircuitState[]).map((s, i) => (
              <div key={s} className="flex items-center gap-3 sm:gap-4">
                <motion.div
                  animate={{
                    scale: state === s ? 1.05 : 0.95,
                    opacity: state === s ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`px-5 py-3 rounded-xl border-2 transition-all ${stateColors[s]} ${
                    state === s ? stateBgColors[s] : "bg-white/[0.03]"
                  }`}
                >
                  <p className={`text-sm font-bold ${stateTextColors[s]} ${state === s ? "vivid-text" : ""}`}>
                    {s}
                  </p>
                  <p className="text-xs text-foreground/80 mt-0.5">
                    {s === "CLOSED" ? "All clear" : s === "OPEN" ? "Blocked" : "Probing"}
                  </p>
                </motion.div>
                {i < 2 && (
                  <div className="hidden sm:flex flex-col items-center gap-0.5 text-foreground/50">
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-[10px]">
                      {i === 0 ? "5 failures" : "cooldown"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* State info panel */}
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-xl border-2 mb-6 ${stateColors[state]} ${stateBgColors[state]}`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className={`text-lg font-bold ${stateTextColors[state]}`}>
                  {state === "CLOSED" && "✓ Circuit CLOSED — Requests flowing normally"}
                  {state === "OPEN" && "✗ Circuit OPEN — All requests blocked"}
                  {state === "HALF-OPEN" && "⚡ Circuit HALF-OPEN — Sending probe request"}
                </p>
                <p className="text-sm text-foreground/80 mt-1">
                  {state === "CLOSED" && `Failure count: ${failureCount}/5 before circuit opens`}
                  {state === "OPEN" && `Cooldown: ${cooldown}s remaining before probe attempt`}
                  {state === "HALF-OPEN" && "A single probe request will determine if the circuit can close"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-foreground/70">Failures</p>
                  <p className="text-lg font-bold text-foreground/80">{failureCount}/5</p>
                </div>
                {cooldown > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-foreground/70">Cooldown</p>
                    <p className="text-lg font-bold text-amber-400">{cooldown}s</p>
                  </div>
                )}
                {probeActive && (
                  <div className="text-right">
                    <p className="text-xs text-foreground/70">Probe</p>
                    <p className="text-lg font-bold text-amber-400">Active</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <button
              onClick={simulateFailure}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
              aria-label="Simulate a failure"
            >
              <AlertTriangle className="w-4 h-4" />
              Simulate Failure
            </button>
            {state === "HALF-OPEN" && (
              <button
                onClick={simulateSuccess}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                aria-label="Simulate successful probe"
              >
                <Check className="w-4 h-4" />
                Probe Success
              </button>
            )}
            <button
              onClick={resetCircuit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-foreground/80 hover:bg-white/10 transition-all"
              aria-label="Reset circuit breaker"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   PROTOCOL TRANSLATION DEMO (NEW)
   ──────────────────────────────────────────── */
function ProtocolTranslationDemo() {
  const { ref, visible } = useSectionReveal();
  const [activeLine, setActiveLine] = useState(0);

  const anthropicEvents = useMemo(() => [
    { type: "event", data: "message_start", detail: '{"type":"message_start","message":{"role":"assistant"}}' },
    { type: "event", data: "content_block_start", detail: '{"type":"content_block_start","index":0}' },
    { type: "event", data: "content_block_delta", detail: '{"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}' },
    { type: "event", data: "content_block_delta", detail: '{"type":"content_block_delta","delta":{"type":"text_delta","text":" world"}}' },
    { type: "event", data: "content_block_delta", detail: '{"type":"content_block_delta","delta":{"type":"thinking_delta","thinking":"..."}}' },
    { type: "event", data: "content_block_stop", detail: '{"type":"content_block_stop","index":0}' },
    { type: "event", data: "message_delta", detail: '{"type":"message_delta","delta":{"stop_reason":"end_turn"}}' },
    { type: "event", data: "message_stop", detail: '{"type":"message_stop"}' },
  ], []);

  const openaiEvents = useMemo(() => [
    { type: "chunk", data: "role chunk", detail: '{"role":"assistant","content":null}' },
    { type: "chunk", data: "content start", detail: '{"choices":[{"delta":{"role":"assistant"}}]}' },
    { type: "chunk", data: "content delta", detail: '{"choices":[{"delta":{"content":"Hello"}}]}' },
    { type: "chunk", data: "content delta", detail: '{"choices":[{"delta":{"content":" world"}}]}' },
    { type: "chunk", data: "thinking delta", detail: '{"choices":[{"delta":{"reasoning_content":"..."}}]}' },
    { type: "chunk", data: "content end", detail: '{"choices":[{"delta":{}}]}' },
    { type: "chunk", data: "stop chunk", detail: '{"choices":[{"delta":{},"finish_reason":"stop"}]}' },
    { type: "chunk", data: "done", detail: '[DONE]' },
  ], []);

  const mappings = useMemo(() => [
    { from: "message_start", to: "role chunk", arrow: "→" },
    { from: "content_block_start", to: "content start", arrow: "→" },
    { from: "content_block_delta", to: "content delta", arrow: "→" },
    { from: "content_block_delta (thinking)", to: "thinking delta (reasoning_content)", arrow: "→" },
    { from: "content_block_stop", to: "content end", arrow: "→" },
    { from: "message_delta", to: "stop chunk", arrow: "→" },
    { from: "message_stop", to: "done", arrow: "→" },
  ], []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % anthropicEvents.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [visible, anthropicEvents.length]);

  return (
    <section id="protocol" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-green/60 text-owl-green bg-owl-green/15 mb-4">
            Live Visualization
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-green to-owl-cyan bg-clip-text text-transparent">
              Protocol Translation
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            Real-time SSE translation from Anthropic format to OpenAI format. Every chunk is translated on-the-fly with zero buffering.
          </p>
        </div>

        {/* Side-by-side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Anthropic Input */}
          <div className="glass-depth p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-owl-green animate-pulse" />
              <h3 className="text-sm font-bold text-owl-green">Anthropic SSE Input</h3>
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs sm:text-sm space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar">
              {anthropicEvents.map((event, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: i <= activeLine ? 1 : 0.3,
                    x: i === activeLine ? 4 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${i === activeLine ? "text-owl-green vivid-text" : "text-foreground/70"}`}
                >
                  <span className="text-owl-green/60 shrink-0">event:</span>
                  <span className="text-owl-green">{event.data}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* OpenAI Output */}
          <div className="glass-depth p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-owl-cyan animate-pulse" />
              <h3 className="text-sm font-bold text-owl-cyan">OpenAI SSE Output</h3>
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs sm:text-sm space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar">
              {openaiEvents.map((event, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: i <= activeLine ? 1 : 0.3,
                    x: i === activeLine ? 4 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${i === activeLine ? "text-owl-cyan vivid-text" : "text-foreground/70"}`}
                >
                  <span className="text-owl-cyan/60 shrink-0">data:</span>
                  <span className="text-owl-cyan">{event.data}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mapping table */}
        <div className="glass-depth p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground/80 mb-4">Event Mapping</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {mappings.map((m) => (
              <div key={m.from} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03]">
                <span className="text-xs font-mono text-owl-green">{m.from}</span>
                <ArrowRight className="w-3 h-3 text-foreground/50 shrink-0" />
                <span className="text-xs font-mono text-owl-cyan">{m.to}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   PROXY ECOSYSTEM SECTION (NEW)
   ──────────────────────────────────────────── */
function ProxyEcosystemSection() {
  const { ref, visible } = useSectionReveal();

  const crossFieldInsights = useMemo(() => [
    {
      icon: "🧠",
      field: "Psychology",
      title: "Emotional Regulation & Circuit Breakers",
      desc: "Circuit breakers mirror the human amygdala's threat-response cycle: emotional overwhelm triggers shutdown (OPEN state), a cooling period allows recovery (cooldown), and a cautious test probe (HALF-OPEN) determines whether it's safe to re-engage. Just as cognitive behavioral therapy teaches graded exposure to feared stimuli, the half-open probe is a systematic desensitization protocol for distributed systems. This isn't metaphor — it's the same feedback loop operating at a different scale.",
      color: "magenta" as const,
    },
    {
      icon: "📊",
      field: "Economics",
      title: "Competitive Bidding & Market Dynamics",
      desc: "Stream racing implements a first-price sealed-bid auction where latency is the bid. In economic theory, competitive markets drive prices toward marginal cost — here, racing drives response time toward the physical minimum. The key insight from auction theory: Vickrey auctions (second-price) produce truthful bidding, but first-byte-wins (first-price) creates an incentive for providers to invest in infrastructure. OWL-ORCA's racing engine is a market maker that turns AI providers into bidders competing on speed.",
      color: "cyan" as const,
    },
    {
      icon: "🧬",
      field: "Biology",
      title: "Autopoiesis & Self-Maintaining Systems",
      desc: "Maturana and Varela defined autopoiesis as a system that regenerates its own components through its own operation. OWL-ORCA's circuit breaker system is autopoietic: it regenerates failed connections through probe-based recovery, maintains internal homeostasis through backpressure control, and preserves its boundary through the forward proxy. Like a cell membrane, the forward proxy is selectively permeable — allowing authenticated requests while blocking malformed ones. The system doesn't just recover; it regenerates.",
      color: "green" as const,
    },
    {
      icon: "📜",
      field: "History",
      title: "Industrial Revolution & AI Parallelism",
      desc: "The transition from single-provider routing to stream racing mirrors the shift from cottage industry to factory production. Before factories, one artisan made one product (single routing). Factories introduced parallel assembly lines (multi-provider). Stream racing is the AI equivalent of Just-In-Time manufacturing — minimizing inventory (latency) by firing all production lines simultaneously and using whichever finishes first. The same creative destruction that transformed manufacturing now transforms AI access: middlemen (commercial gateways) are disintermediated by direct, competitive routing.",
      color: "amber" as const,
    },
    {
      icon: "⚛️",
      field: "Physics",
      title: "Quantum Superposition & Concurrent Requests",
      desc: "Stream racing implements a macro-scale analogue of quantum superposition: all provider requests exist in a simultaneous 'maybe' state until the first byte collapses the wave function into a single outcome. Like Schrodinger's cat, all providers are both 'winning' and 'losing' until observation (first byte) forces reality to choose. The cancellation of losing streams is decoherence — the environment collapsing possibilities into actuality. The difference: quantum systems can't choose the fastest path. We can.",
      color: "cyan" as const,
    },
    {
      icon: "🏗️",
      field: "Architecture",
      title: "Radix Trees & Urban Wayfinding",
      desc: "A radix tree route matcher is the digital equivalent of a well-designed city grid. Just as a skilled navigator doesn't scan every street (regex) but follows hierarchical district markers (tree traversal), the radix tree eliminates brute-force path matching. Christopher Alexander's 'pattern language' for architecture applies here: good routing, like good urban design, makes the correct path obvious and efficient. O(1) path matching is the expressway; regex is the traffic jam.",
      color: "green" as const,
    },
    {
      icon: "🛡️",
      field: "Military Strategy",
      title: "Defense in Depth & Proxy Layering",
      desc: "The forward proxy → router → provider stack implements defense in depth, a military doctrine where multiple defensive layers ensure no single point of failure. The forward proxy is the perimeter defense (authentication), the router is the tactical command (routing decisions), and circuit breakers are the strategic reserves (fallback logic). When one layer fails, the next absorbs the impact. The SIGHUP hot-reload is a changing of the guard — the defense never sleeps.",
      color: "magenta" as const,
    },
    {
      icon: "🔄",
      field: "Ecology",
      title: "Keystone Species & Provider Diversity",
      desc: "In ecology, a keystone species supports the entire ecosystem — remove it and the system collapses. A single AI provider is a keystone: lose it and your entire AI pipeline fails. Stream racing introduces biodiversity: multiple providers filling the same niche (ecological redundancy). If one provider goes extinct (circuit opens), others fill the gap. The system becomes resilient through diversity, the same principle that makes rainforests survive drought and coral reefs recover from bleaching.",
      color: "amber" as const,
    },
  ], []);

  const comparisonCards = useMemo(() => [
    {
      name: "Simple Proxy (nginx)",
      limitations: [
        "No stream racing — routes to one backend only",
        "No protocol translation — what goes in comes out",
        "No circuit breakers — failures cascade to client",
        "No authentication — relies on network-level ACLs",
      ],
      owlSolutions: [
        "Race multiple providers simultaneously",
        "Real-time Anthropic ↔ OpenAI translation",
        "Automatic fault detection with probe recovery",
        "Fernet-encrypted token management built-in",
      ],
    },
    {
      name: "API Gateway (Kong)",
      limitations: [
        "No free-tier provider aggregation",
        "No stream racing — sequential only",
        "Requires paid plugins for AI features",
        "Complex plugin ecosystem adds latency",
      ],
      owlSolutions: [
        "Aggregates free-tier providers out of the box",
        "Built-in stream racing engine",
        "All AI features included, zero cost",
        "Single binary, zero dependencies",
      ],
    },
    {
      name: "Load Balancer (HAProxy)",
      limitations: [
        "No protocol translation capability",
        "No circuit breakers with probe logic",
        "Round-robin only, no first-byte-wins",
        "No SSE streaming awareness",
      ],
      owlSolutions: [
        "Full SSE format translation layer",
        "Half-open circuit breaker with probes",
        "First-byte-wins racing strategy",
        "Chunk-by-chunk streaming with backpressure",
      ],
    },
    {
      name: "Commercial Gateway (OpenRouter)",
      limitations: [
        "Costs money per API call",
        "No self-hosting option",
        "Vendor lock-in to their infrastructure",
        "No control over routing logic",
      ],
      owlSolutions: [
        "100% free using free-tier providers",
        "Self-hosted on your own machine",
        "Open source, no vendor lock-in",
        "Full control over race/canary/fallback strategies",
      ],
    },
  ], []);

  const companionRepos = useMemo(() => [
    {
      repo: "owl-forward-proxy",
      version: "v4.4 — modular proxy with billing sidecar",
      url: "https://github.com/marktantongco/owl-forward-proxy",
      role: "Billing & Monetization",
      icon: "billing" as const,
      synergy: "High synergy",
      hoverClass: "hover:border-owl-amber/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]",
      roleBadgeClass: "border-owl-amber/60 text-owl-amber bg-owl-amber/15",
      gap: "Orca v4 races providers and translates protocols — but it never charges anyone. No per-user auth, no tier quotas, and no usage ledger sit in front of the router.",
      adds: [
        "Edge authentication — requests are identified and logged before they touch routing",
        "Per-tier rate limiting so free, pro, and team quotas are actually enforceable",
        "Billing sidecar meters usage (requests, tokens, stream-time) as traffic flows through",
      ],
      options: [
        "Chain in front: clients hit owl-forward-proxy, which authenticates, meters, then forwards to Orca v4 — the routing core stays untouched.",
        "Extract the billing sidecar and mount it as a middleware stage inside the Orca v4 pipeline.",
      ],
      optionLabels: ["Chain", "Merge"],
    },
    {
      repo: "owl-agent-proxy",
      version: "v3.0 — multi-protocol HTTP defense stack",
      url: "https://github.com/marktantongco/owl-agent-proxy",
      role: "Security & Defense",
      icon: "shield" as const,
      synergy: "High synergy",
      hoverClass: "hover:border-owl-magenta/40 hover:shadow-[0_0_24px_rgba(224,64,251,0.12)]",
      roleBadgeClass: "border-owl-magenta/60 text-owl-magenta bg-owl-magenta/15",
      gap: "Circuit breakers defend Orca v4 from upstream provider failures; nothing defends it from downstream threats — DDoS floods, HTTP exploits, and prompt-injection payloads.",
      adds: [
        "Multi-protocol HTTP defense: cache → dedup → rate limit → proxy rotate → protocol router",
        "Per-domain token buckets with tier-sorted proxy rotation and auto-ban on 3 failures",
        "Sanitized traffic only — poisoned payloads never consume AI routing resources",
      ],
      options: [
        "Shield in front: deploy directly before Orca v4 so every request is scrubbed before radix matching and stream racing.",
        "Merge the defense handlers into the v4 pipeline ahead of racing and translation.",
      ],
      optionLabels: ["Chain", "Merge"],
    },
    {
      repo: "owl-agent",
      version: "Unified Proxy Ecosystem Builder — synergy scoring, compatibility matrix, architecture schematic",
      url: "https://github.com/marktantongco/owl-agent",
      role: "RAG & Scraping Engine",
      icon: "data" as const,
      synergy: "Medium-High synergy",
      hoverClass: "hover:border-owl-green/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]",
      roleBadgeClass: "border-owl-green/60 text-owl-green bg-owl-green/15",
      gap: "Models routed through Orca v4 can't reach the live web — no scraping or data-extraction path exists in the pipeline, so real-time RAG stops at the training cutoff.",
      adds: [
        "Tool/function-calling module: models request live web data mid-conversation through Orca v4",
        "Scraping components exposed as an internal API endpoint the router queries during a request",
        "Interactive builder with synergy scoring and a compatibility matrix for the proxy ecosystem",
      ],
      options: [
        "Tool module: register the scraper as a callable tool inside the Orca v4 pipeline — when a model needs real-time web data, Orca invokes it and streams results back.",
        "Internal API: extract the scraping components behind an endpoint that Orca v4 queries for RAG context before racing providers.",
      ],
      optionLabels: ["Tool", "API"],
    },
    {
      repo: "owl-orca-ai-agentic-stack",
      version: "Interactive Knowledge Base & Wiki — 10 sections, GSAP + Framer Motion",
      url: "https://github.com/marktantongco/owl-orca-ai-agentic-stack",
      role: "Documentation & Knowledge Base",
      icon: "docs" as const,
      synergy: "Medium · non-code",
      hoverClass: "hover:border-owl-cyan/40 hover:shadow-[0_0_24px_rgba(0,212,255,0.12)]",
      roleBadgeClass: "border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15",
      gap: "No code to merge — but production readiness needs one knowledge base: onboarding, API references, and troubleshooting that strictly reflect v4.",
      adds: [
        "Adopted as the official documentation site for owl-orca-v4",
        "Content rewritten to strictly reflect v4 architecture (onboarding, API reference, troubleshooting)",
        "A unified knowledge base — critical for production readiness and user support",
      ],
      options: [
        "Adopt: make the wiki the official owl-orca-v4 docs site and rewrite its content against the v4 architecture.",
        "Sync: land documentation updates in the same change as every v4 architecture update so the knowledge base never drifts.",
      ],
      optionLabels: ["Adopt", "Sync"],
    },
    {
      repo: "kiro-owl-agent + owl-agent-installer",
      version: "AWS Builder ID installer + general installer — deployment logic",
      url: "https://github.com/marktantongco/kiro-owl-agent",
      role: "Deployment Automation",
      icon: "deploy" as const,
      synergy: "Operational · medium",
      hoverClass: "hover:border-owl-amber/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]",
      roleBadgeClass: "border-owl-amber/60 text-owl-amber bg-owl-amber/15",
      gap: "Provisioning v4, the defense stack, and the billing sidecar today means running separate installers by hand — deployment logic lives in two repos instead of one command.",
      adds: [
        "One OWL-ORCA Production Deployer combining both installers' deployment logic",
        "One command provisions owl-orca-v4, the owl-agent-proxy defense stack, and the owl-forward-proxy billing sidecar",
        "AWS Builder ID path (kiro-owl-agent) and general path (owl-agent-installer) stay independently usable",
      ],
      options: [
        "Merge the deployment logic: a single Production Deployer script that provisions Orca v4, owl-agent-proxy, and owl-forward-proxy in one command.",
        "Shared entrypoint, separate repos: keep both installers intact and let the unified script orchestrate them.",
      ],
      optionLabels: ["One-command", "Orchestrated"],
    },
    {
      repo: "hermes-disguise",
      version: "Browser TLS fingerprint + proxy rotation — disguise kit and stealth layer",
      url: "https://github.com/marktantongco/hermes-disguise",
      role: "Stealth & Fingerprinting",
      icon: "disguise" as const,
      synergy: "High synergy",
      hoverClass: "hover:border-owl-cyan/40 hover:shadow-[0_0_24px_rgba(0,212,255,0.12)]",
      roleBadgeClass: "border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15",
      gap: "Orca v4's outbound calls carry no disguise — a plain TLS posture that anti-bot systems can flag well before the request ever reaches a provider. Hermes supplies the browser-like fingerprint and rotation that keep the gateway looking like a normal client.",
      adds: [
        "Browser-shaped TLS fingerprint that blends outbound handshakes with real browser traffic to evade provider fingerprinting",
        "Proxy rotation that swaps egress endpoints before a single source can be tied to Orca v4",
        "Stealth layer that sits outside the router so every race inherits an untraceable client posture",
      ],
      options: [
        "Chain as stealth layer: route Orca v4's outbound traffic through Hermes so every provider race is disguised and rotated before it leaves the host.",
        "Merge the fingerprint module: mount Hermes' browser-like TLS shaping as a transport stage inside the v4 egress path.",
      ],
      optionLabels: ["Chain", "Merge"],
    },
    {
      repo: "freebuff-proxy",
      version: "Go gateway core — JA3 stealth transport, multi-token session pool, SOCKS5 proxy pool",
      url: "https://github.com/marktantongco/freebuff-proxy",
      role: "Stealth & Session Layer",
      icon: "stealth" as const,
      synergy: "High synergy",
      hoverClass: "hover:border-owl-magenta/40 hover:shadow-[0_0_24px_rgba(224,64,251,0.12)]",
      roleBadgeClass: "border-owl-magenta/60 text-owl-magenta bg-owl-magenta/15",
      gap: "Orca v4's outbound calls are plainly identifiable — no JA3 fingerprint shaping, no warm session-token pool, and no rotating SOCKS5 egress, so anti-bot defenses can fingerprint and throttle every provider race.",
      adds: [
        "JA3 stealth transport that blends outbound TLS fingerprints with real browsers to slip past anti-bot checks",
        "Multi-token session pool keeps provider sessions warm and rotates identities before rate limits bite",
        "SOCKS5 proxy pool gives every upstream race region-aware, resilient egress",
      ],
      options: [
        "Chain as egress: point Orca v4's provider connections through freebuff-proxy so every race runs over stealth transport.",
        "Merge the transport: mount JA3 shaping and the session pool as an egress stage inside the v4 router.",
      ],
      optionLabels: ["Chain", "Merge"],
    },
    {
      repo: "unified-owl",
      version: "v1.1 — merged 6-repo resilient access engine: proxy evasion, DNS tunneling, NadirClaw cost routing",
      url: "https://github.com/marktantongco/unified-owl",
      role: "Resilient Access & Routing",
      icon: "routing" as const,
      synergy: "Medium-High synergy",
      hoverClass: "hover:border-owl-green/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]",
      roleBadgeClass: "border-owl-green/60 text-owl-green bg-owl-green/15",
      gap: "Orca v4 races free providers but treats every query equally — no evasion when a provider blocks its egress, and no cost intelligence that routes simple prompts to cheap models and hard ones to premium.",
      adds: [
        "Proxy evasion keeps access alive when providers fingerprint or block Orca v4's outbound path",
        "NadirClaw cost routing: simple queries to cheap models, complex ones to premium — 40-70% savings",
        "Six repos merged into one resilient access engine instead of six overlapping tools",
      ],
      options: [
        "Chain as fallback: when Orca v4 detects blocking or cost pressure, hand the request to unified-owl's evasion and routing path.",
        "Merge the strategy: adopt NadirClaw's cost-tier decisions as a race-selection strategy inside Orca v4.",
      ],
      optionLabels: ["Chain", "Merge"],
    },
    {
      repo: "owl-dns-synergy",
      version: "v2.5 — unified dual-channel DNS resiliency engine with AutoClaw synergy",
      url: "https://github.com/marktantongco/owl-dns-synergy",
      role: "DNS Resilience",
      icon: "dns" as const,
      synergy: "Medium synergy",
      hoverClass: "hover:border-owl-cyan/40 hover:shadow-[0_0_24px_rgba(0,212,255,0.12)]",
      roleBadgeClass: "border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15",
      gap: "If upstream DNS is blocked or poisoned, Orca v4 can't even resolve provider endpoints — routing intelligence is useless when the network layer fails first.",
      adds: [
        "Dual-channel DNS keeps provider endpoints resolvable when standard resolution is blocked or poisoned",
        "DNS tunneling provides a fallback path that survives censorship and resolver tampering",
        "AutoClaw ecosystem synergy hardens the whole access layer around the gateway",
      ],
      options: [
        "Tunnel: route Orca v4's upstream lookups through the dual-channel DNS engine whenever standard resolution fails.",
        "Failover: treat DNS health like a circuit breaker — poisoned resolution trips to the tunnel automatically.",
      ],
      optionLabels: ["Tunnel", "Failover"],
    },
    {
      repo: "autoclaw-autologin",
      version: "v2.7 — OpenAI-compatible free LLM proxy with OAuth token harvesting & rotation",
      url: "https://github.com/marktantongco/autoclaw-autologin",
      role: "GLM Token Harvesting",
      icon: "tokens" as const,
      synergy: "Medium synergy",
      hoverClass: "hover:border-owl-amber/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]",
      roleBadgeClass: "border-owl-amber/60 text-owl-amber bg-owl-amber/15",
      gap: "Orca v4's provider table has no persistent GLM source — free GLM access dies the moment its OAuth tokens expire, and nothing harvests or refreshes them.",
      adds: [
        "Google SSO OAuth harvesting mints fresh GLM tokens without manual logins",
        "Token rotation keeps GLM sessions persistently alive so the provider never drops out of the race",
        "OpenAI-compatible endpoint drops straight into Orca v4's routing table as a free provider",
      ],
      options: [
        "Provider: register AutoClaw's harvested GLM models as a first-class provider in Orca v4's routing table.",
        "Rotate: let AutoClaw keep the OAuth tokens fresh so the GLM entries never expire out of the race.",
      ],
      optionLabels: ["Provider", "Rotate"],
    },
  ], []);

  const synergyFlow = useMemo(() => [
    { label: "Client", sub: "IDE · CLI · app", colorClass: "text-foreground/90" },
    { label: "owl-forward-proxy", sub: "Auth · tiers · usage metering", colorClass: "text-owl-amber" },
    { label: "owl-agent-proxy", sub: "Cache · dedup · rate limit · defense", colorClass: "text-owl-magenta" },
    { label: "Orca v4", sub: "Radix routing · racing · circuits", colorClass: "text-owl-cyan" },
    { label: "freebuff-proxy", sub: "JA3 stealth · token & SOCKS5 pools", colorClass: "text-owl-magenta" },
    { label: "AI Providers", sub: "Copilot · Antigravity · Kiro · GLM", colorClass: "text-owl-green" },
  ], []);

  return (
    <section id="ecosystem" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(0,212,255,0.03)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15 mb-4">
            Cross-Domain Insights
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-cyan via-owl-green to-owl-amber bg-clip-text text-transparent">
              Proxy Ecosystem
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            Companion repos that plug into Orca v4 — billing, defense, stealth, resilience, tokens, live web data, docs, and deploys — plus how proxy architecture connects to psychology, economics, biology, and history. And a competitive analysis.
          </p>
        </div>

        {/* Companion repos & integration */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-center mb-2 text-foreground/90 heading-glow">
            Companion Repos for Orca v4
          </h3>
          <p className="text-sm text-foreground/80 text-center max-w-2xl mx-auto mb-8">
            OWL-ORCA v4 owns intelligent routing — these sibling repos supply the layers it deliberately doesn&apos;t: billing at the edge, defense underneath it, stealth egress behind it, resilient access and DNS failover around it, rotating GLM token providers, live web data on demand, a v4 knowledge base, and one-command deploys.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {companionRepos.map((r) => (
              <motion.div
                key={r.repo}
                whileHover={{ scale: 1.01 }}
                className={`glass-depth p-6 flex flex-col ${r.hoverClass}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {r.icon === "billing" ? (
                      <CreditCard className="w-5 h-5 text-owl-amber vivid-icon shrink-0" />
                    ) : r.icon === "shield" ? (
                      <Shield className="w-5 h-5 text-owl-magenta vivid-icon shrink-0" />
                    ) : r.icon === "data" ? (
                      <Database className="w-5 h-5 text-owl-green vivid-icon shrink-0" />
                    ) : r.icon === "docs" ? (
                      <BookOpen className="w-5 h-5 text-owl-cyan vivid-icon shrink-0" />
                    ) : r.icon === "stealth" ? (
                      <Lock className="w-5 h-5 text-owl-magenta vivid-icon shrink-0" />
                    ) : r.icon === "routing" ? (
                      <ArrowRightLeft className="w-5 h-5 text-owl-green vivid-icon shrink-0" />
                    ) : r.icon === "dns" ? (
                      <Terminal className="w-5 h-5 text-owl-cyan vivid-icon shrink-0" />
                    ) : r.icon === "tokens" ? (
                      <RotateCcw className="w-5 h-5 text-owl-amber vivid-icon shrink-0" />
                    ) : r.icon === "disguise" ? (
                      <Fingerprint className="w-5 h-5 text-owl-cyan vivid-icon shrink-0" />
                    ) : (
                      <Rocket className="w-5 h-5 text-owl-amber vivid-icon shrink-0" />
                    )}
                    <span className="font-mono text-sm font-bold text-vivid truncate">{r.repo}</span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-owl-cyan transition-colors"
                      aria-label={`Open ${r.repo} on GitHub`}
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={r.roleBadgeClass}>{r.role}</Badge>
                  </div>
                </div>

                <p className="text-xs text-foreground/60 font-medium mb-3">{r.version}</p>
                <p className="text-sm text-foreground/85 mb-4">{r.gap}</p>

                <div className="space-y-2 mb-4">
                  {r.adds.map((a) => (
                    <div key={a} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-owl-cyan shrink-0 mt-0.5" />
                      <p className="text-sm text-owl-cyan/90">{a}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-3 mt-auto">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-2">
                    How to integrate
                  </p>
                  <ol className="space-y-2">
                    {r.options.map((o, i) => (
                      <li key={o} className="flex items-start gap-2">
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-xs ${
                            i === 0
                              ? r.roleBadgeClass
                              : "border-owl-cyan/50 text-owl-cyan bg-owl-cyan/10"
                          }`}
                        >
                          {r.optionLabels[i]}
                        </Badge>
                        <p className="text-sm text-foreground/85">{o}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Integrated request flow */}
          <div className="proxy-card p-5 sm:p-6">
            <h4 className="text-base font-bold text-foreground/80 mb-1 text-center">
              Integrated request flow
            </h4>
            <p className="text-xs text-foreground/60 text-center mb-5">
              Option A: chained deployment — Option B mounts the same stages as middleware inside Orca v4
            </p>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3">
              {synergyFlow.map((stage, i) => (
                <div
                  key={stage.label}
                  className="flex flex-row lg:flex-col items-center gap-2 lg:gap-3 w-full lg:flex-1"
                >
                  {i > 0 && (
                    <ArrowRight className="w-4 h-4 text-foreground/50 shrink-0 rotate-90 lg:rotate-0" />
                  )}
                  <div className="flex-1 lg:w-full text-center px-3 py-3 rounded-xl border border-white/10 bg-[#0a0a1a]/60">
                    <p className={`text-sm font-bold ${stage.colorClass}`}>{stage.label}</p>
                    <p className="text-xs text-foreground/70 mt-1">{stage.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/60 text-center mt-4">
              On demand: Orca v4 queries <span className="font-mono text-foreground/80">owl-agent</span> for live web data (RAG). Stealth rides with the request — <span className="font-mono text-foreground/80">hermes-disguise</span> disguises the outbound client and rotates its egress, while <span className="font-mono text-foreground/80">freebuff-proxy</span> keeps the provider sessions warm behind JA3-shaped TLS and rotating SOCKS5. Resilience sits beside the path — <span className="font-mono text-foreground/80">unified-owl</span> and <span className="font-mono text-foreground/80">owl-dns-synergy</span> fail over around blocked egress and poisoned DNS, and <span className="font-mono text-foreground/80">autoclaw-autologin</span> keeps GLM tokens rotating. The knowledge base and Production Deployer live outside the request path.
            </p>
          </div>
        </div>

        {/* Cross-field insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {crossFieldInsights.map((insight) => (
            <motion.div
              key={insight.field}
              whileHover={{ scale: 1.02 }}
              className={`glass-depth p-5 transition-all ${
                insight.color === "cyan"
                  ? "hover:border-owl-cyan/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
                  : insight.color === "green"
                    ? "hover:border-owl-green/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : insight.color === "magenta"
                      ? "hover:border-owl-magenta/40 hover:shadow-[0_0_20px_rgba(224,64,251,0.15)]"
                      : "hover:border-owl-amber/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              }`}
            >
              <div className="text-2xl mb-3">{insight.icon}</div>
              <Badge
                variant="outline"
                className={`text-xs mb-2 ${
                  insight.color === "cyan"
                    ? "border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15"
                    : insight.color === "green"
                      ? "border-owl-green/60 text-owl-green bg-owl-green/15"
                      : insight.color === "magenta"
                        ? "border-owl-magenta/60 text-owl-magenta bg-owl-magenta/15"
                        : "border-owl-amber/60 text-owl-amber bg-owl-amber/15"
                }`}
              >
                {insight.field}
              </Badge>
              <h3 className="text-base font-bold mb-2 text-vivid">{insight.title}</h3>
              <p className="text-sm text-foreground/85 leading-relaxed">{insight.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison cards */}
        <h3 className="text-xl font-bold text-center mb-6 text-foreground/90 heading-glow">How OWL-ORCA Compares</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comparisonCards.map((card) => (
            <div key={card.name} className="proxy-card p-5">
              <h4 className="text-base font-bold text-foreground/80 mb-3">{card.name}</h4>
              <div className="space-y-2 mb-4">
                {card.limitations.map((lim) => (
                  <div key={lim} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300/80">{lim}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2">
                {card.owlSolutions.map((sol) => (
                  <div key={sol} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-owl-cyan shrink-0 mt-0.5" />
                    <p className="text-sm text-owl-cyan/90">{sol}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   MEMORY BUDGET SECTION (NEW)
   ──────────────────────────────────────────── */
function MemoryBudgetSection() {
  const { ref, visible } = useSectionReveal();

  const segments = useMemo(() => [
    { name: "Orca Router", idle: 128, max: 384, color: "#00d4ff", colorClass: "bg-owl-cyan" },
    { name: "Forward Proxy", idle: 48, max: 128, color: "#e040fb", colorClass: "bg-owl-magenta" },
    { name: "Kiro Gateway", idle: 96, max: 256, color: "#10b981", colorClass: "bg-owl-green" },
  ], []);

  const totalMax = segments.reduce((sum, s) => sum + s.max, 0);
  const totalIdle = segments.reduce((sum, s) => sum + s.idle, 0);
  const totalRam = 8192;
  const available = totalRam - totalMax;

  return (
    <section id="memory" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(245,158,11,0.03)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-amber/60 text-owl-amber bg-owl-amber/15 mb-4">
            Resource Planning
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-amber to-owl-cyan bg-clip-text text-transparent">
              Memory Budget
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            Optimized for 8GB systems. The entire OWL-ORCA stack uses less than 10% of available RAM at peak, leaving plenty of headroom.
          </p>
        </div>

        <div className="glass-depth p-6 sm:p-8">
          {/* Stacked bar chart */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-foreground/80 mb-4">Memory Allocation (MB)</h3>
            <div className="relative h-12 rounded-xl bg-white/5 overflow-hidden flex">
              {segments.map((seg) => (
                <motion.div
                  key={seg.name}
                  initial={{ width: 0 }}
                  animate={visible ? { width: `${(seg.max / totalRam) * 100}%` } : { width: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full flex items-center justify-center relative"
                  style={{ backgroundColor: seg.color + "40" }}
                >
                  <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {seg.max}MB
                  </span>
                </motion.div>
              ))}
              {/* Available space */}
              <div className="h-full flex-1 flex items-center justify-center bg-white/[0.02]">
                <span className="text-xs text-foreground/50">{available}MB free</span>
              </div>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {segments.map((seg) => (
              <div key={seg.name} className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <h4 className="text-sm font-bold text-foreground/80">{seg.name}</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Idle</span>
                    <span className="font-mono text-foreground/80">{seg.idle}MB</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={visible ? { width: `${(seg.idle / seg.max) * 100}%` } : { width: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: seg.color + "60" }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Max</span>
                    <span className="font-mono text-foreground/80">{seg.max}MB</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={visible ? { width: "100%" } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-owl-cyan/5 border border-owl-cyan/20">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-owl-cyan" />
              <div>
                <p className="text-sm font-bold text-owl-cyan">Total: {totalMax}MB peak / {totalIdle}MB idle</p>
                <p className="text-sm text-foreground/80">
                  {(totalMax / totalRam * 100).toFixed(1)}% of 8GB — {(available / 1024).toFixed(1)}GB available for OS
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-owl-green/40 text-owl-green bg-owl-green/10">
              8GB Optimized
            </Badge>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   VERSION TIMELINE SECTION
   ──────────────────────────────────────────── */
const VERSIONS = [
  { version: "6.2", codename: "Base", date: "May 2025", key: "Podman, swap guard, memory accounting", color: "cyan" as const },
  { version: "6.3", codename: "Provider Integration", date: "May 2025", key: "Copilot Free, Antigravity, Fernet tokens", color: "green" as const },
  { version: "6.4", codename: "Orca-Router", date: "May 2025", key: "Stream Racing, Radix Tree, Circuit Breakers", color: "magenta" as const },
  { version: "7.0", codename: "Protocol Translation", date: "Jun 2025", key: "Anthropic ↔ OpenAI SSE translation", color: "cyan" as const },
  { version: "7.1", codename: "Safe-Mode", date: "Jun 2025", key: "Atomic swaps, IDE preservation, SIGHUP", color: "green" as const },
  { version: "7.2", codename: "Audit-Hardened", date: "Jun 2025", key: "JSONC parser, port conflict detection", color: "magenta" as const },
  { version: "7.3", codename: "Two-Pass-Final", date: "Jun 2025", key: "Kiro Gateway, 7 bugs fixed", color: "cyan" as const },
  { version: "7.4", codename: "Two-Pass-Final+", date: "Jun 2025", key: "Harden, retry logic, 7 more bugs", color: "green" as const },
  { version: "7.5", codename: "Three-Pass-Final", date: "Jun 2025", key: "Dedup, dead code removed, 20 bugs", color: "magenta" as const },
  { version: "7.6", codename: "Four-Pass-Final", date: "Jun 2025", key: "Optimization, memory tuning, 12 bugs", color: "cyan" as const },
  { version: "8.0", codename: "Five-Pass-Final", date: "Jun 2025", key: "15 more bugs, SIGHUP async I/O", color: "green" as const },
];

function TimelineSection() {
  const { ref, visible } = useSectionReveal();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="timeline" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-green/60 text-owl-green bg-owl-green/15 mb-4">
            Evolution
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-green to-owl-cyan bg-clip-text text-transparent">
              Version Timeline
            </span>
          </h2>
          <p className="text-foreground/90 max-w-2xl mx-auto">
            From base infrastructure to five-pass audit final. Every version battle-tested.
          </p>
        </div>

        <div className="glass-depth p-3 sm:p-4 mb-8 overflow-hidden">
          <Image
            src="/version-timeline.png"
            alt="OWL-ORCA Version Timeline"
            width={1200}
            height={400}
            className="w-full h-auto rounded-xl"
          />
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory"
        >
          {VERSIONS.map((v) => {
            const colorStyles = {
              cyan: {
                dot: "bg-owl-cyan shadow-[0_0_8px_rgba(0,212,255,0.5)]",
                badge: "border-owl-cyan/40 text-owl-cyan",
              },
              green: {
                dot: "bg-owl-green shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                badge: "border-owl-green/40 text-owl-green",
              },
              magenta: {
                dot: "bg-owl-magenta shadow-[0_0_8px_rgba(224,64,251,0.5)]",
                badge: "border-owl-magenta/40 text-owl-magenta",
              },
            };
            const s = colorStyles[v.color];

            return (
              <div
                key={v.version}
                className="glass-depth p-4 min-w-[200px] sm:min-w-[220px] snap-start shrink-0 group hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${s.dot}`} />
                  <Badge variant="outline" className={`text-xs py-0 ${s.badge}`}>
                    v{v.version}
                  </Badge>
                </div>
                <p className="text-base font-bold mb-1">{v.codename}</p>
                <p className="text-xs text-foreground/80 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {v.date}
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{v.key}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   QUICK INSTALL SECTION
   ──────────────────────────────────────────── */
function QuickInstallSection() {
  const { ref, visible } = useSectionReveal();
  const [copied, setCopied] = useState(false);

  const installCmd =
    'curl -fsSL https://raw.githubusercontent.com/marktantongco/owl-orca-v3/main/install.sh | bash';

  const handleCopy = useCallback(() => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(installCmd).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          // Clipboard API failed — fallback to execCommand
          try {
            const textarea = document.createElement('textarea');
            textarea.value = installCmd;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (fallbackErr) {
            console.error('[OWL-ORCA] Copy failed:', fallbackErr);
          }
        });
      } else {
        // Clipboard API not available — fallback to execCommand
        const textarea = document.createElement('textarea');
        textarea.value = installCmd;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('[OWL-ORCA] Copy failed:', err);
    }
  }, [installCmd]);

  return (
    <section id="install" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="text-center mb-8">
          <Badge variant="outline" className="border-owl-green/60 text-owl-green bg-owl-green/15 mb-4">
            Get Started
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-green to-owl-cyan bg-clip-text text-transparent">
              Quick Install
            </span>
          </h2>
          <p className="text-foreground/80">
            One line. That&apos;s all it takes.
          </p>
        </div>

        <div className="glass-depth p-1">
          <div className="bg-black/40 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-foreground/80 ml-2 font-mono">bash</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all hover:bg-white/5"
                aria-label="Copy install command"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-owl-green" />
                    <span className="text-owl-green">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-foreground/70" />
                    <span className="text-foreground/70">Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-x-auto">
              <code className="text-sm sm:text-base font-mono text-owl-green leading-relaxed">
                <span className="text-foreground/70">$</span>{" "}
                <span className="text-owl-cyan">curl</span>{" "}
                <span className="text-owl-magenta">-fsSL</span>{" "}
                <span className="text-yellow-400">
                  https://raw.githubusercontent.com/marktantongco/owl-orca-v3/main/install.sh
                </span>{" "}
                <span className="text-owl-magenta">|</span>{" "}
                <span className="text-owl-cyan">bash</span>
              </code>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { flag: "--skip-proxy", desc: "Skip forward proxy" },
            { flag: "--skip-kiro", desc: "Skip Kiro Gateway" },
            { flag: "--with-providers", desc: "Configure provider auth" },
          ].map((opt) => (
            <div key={opt.flag} className="glass p-3 text-center">
              <code className="text-sm font-mono text-owl-cyan">{opt.flag}</code>
              <p className="text-xs text-foreground/80 mt-1">{opt.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-subtle p-4 mt-6 rounded-xl">
          <p className="text-xs text-foreground/80 mb-2 font-semibold">More install options:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { flag: "--upgrade", desc: "Upgrade existing" },
              { flag: "--dry-run", desc: "Preview changes" },
              { flag: "--version=8.0.0", desc: "Pin version" },
              { flag: "--uninstall", desc: "Remove install" },
            ].map((opt) => (
              <div key={opt.flag} className="flex flex-col gap-0.5">
                <code className="text-xs font-mono text-owl-green">{opt.flag}</code>
                <span className="text-xs text-foreground/70">{opt.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   FEATURE MATRIX SECTION
   ──────────────────────────────────────────── */
function FeatureMatrixSection() {
  const { ref, visible } = useSectionReveal();

  const providerData = useMemo(() => [
    {
      provider: "GitHub Copilot (Free)",
      format: "OpenAI",
      auth: "Device Flow",
      storage: "Fernet encrypted",
      streaming: "SSE (native)",
      thinking: "Not supported",
      toolCalling: "Supported",
      circuit: "5 failures → open",
      canary: "90 (default)",
      fallback: "→ Kiro",
    },
    {
      provider: "Antigravity (Free)",
      format: "Anthropic",
      auth: "OAuth PKCE / API Key",
      storage: "Fernet encrypted",
      streaming: "SSE (requires translation)",
      thinking: "Supported (thinking_delta)",
      toolCalling: "Supported",
      circuit: "5 failures → open",
      canary: "10 (default)",
      fallback: "→ Kiro",
    },
    {
      provider: "Kiro Gateway (AWS)",
      format: "OpenAI",
      auth: "AWS Builder ID OIDC",
      storage: ".env (0600)",
      streaming: "SSE (native)",
      thinking: "Not supported",
      toolCalling: "Supported",
      circuit: "5 failures → open",
      canary: "Fallback",
      fallback: "Last resort",
    },
  ], []);

  const strategyData = useMemo(() => [
    { strategy: "race", desc: "Fire ALL providers, first byte wins", use: "Chat completions", latency: "Lowest", cost: "Higher" },
    { strategy: "single", desc: "Route to first available", use: "Model listing", latency: "Normal", cost: "Normal" },
    { strategy: "canary", desc: "Weighted random (A/B testing)", use: "Gradual rollout", latency: "Normal", cost: "Normal" },
    { strategy: "fallback", desc: "Try in order, fall back on circuit-open", use: "Critical paths", latency: "Variable", cost: "Normal" },
  ], []);

  return (
    <section id="matrix" ref={ref} className="relative py-20 sm:py-28 px-4 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-owl-cyan/60 text-owl-cyan bg-owl-cyan/15 mb-4">
            Comparison
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-owl-cyan to-owl-magenta bg-clip-text text-transparent">
              Feature Matrix
            </span>
          </h2>
        </div>

        <div className="glass-depth p-1 mb-8 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-sm font-bold text-foreground/90 p-3">Feature</th>
                {providerData.map((p) => (
                  <th key={p.provider} className="text-left text-sm font-bold text-owl-cyan p-3">
                    {p.provider}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "API Format", key: "format" as const },
                { label: "Auth Method", key: "auth" as const },
                { label: "Token Storage", key: "storage" as const },
                { label: "Streaming", key: "streaming" as const },
                { label: "Extended Thinking", key: "thinking" as const },
                { label: "Tool Calling", key: "toolCalling" as const },
                { label: "Circuit Breaker", key: "circuit" as const },
                { label: "Canary Weight", key: "canary" as const },
                { label: "Auto-Fallback", key: "fallback" as const },
              ].map((row, i) => (
                <tr
                  key={row.key}
                  className={`border-b border-white/3 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                >
                  <td className="text-sm font-semibold text-foreground/80 p-3">{row.label}</td>
                  {providerData.map((p) => (
                    <td key={`${p.provider}-${row.key}`} className="text-sm text-foreground/80 p-3">
                      {p[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-depth p-1 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-sm font-bold text-foreground/90 p-3">Strategy</th>
                <th className="text-left text-sm font-bold text-foreground/90 p-3">Description</th>
                <th className="text-left text-sm font-bold text-foreground/90 p-3">Use Case</th>
                <th className="text-left text-sm font-bold text-foreground/90 p-3">Latency</th>
                <th className="text-left text-sm font-bold text-foreground/90 p-3">Cost</th>
              </tr>
            </thead>
            <tbody>
              {strategyData.map((s, i) => (
                <tr
                  key={s.strategy}
                  className={`border-b border-white/3 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                >
                  <td className="text-sm font-mono font-bold text-owl-green p-3">{s.strategy}</td>
                  <td className="text-sm text-foreground/80 p-3">{s.desc}</td>
                  <td className="text-sm text-foreground/80 p-3">{s.use}</td>
                  <td className="text-sm text-foreground/80 p-3">
                    <span
                      className={
                        s.latency === "Lowest"
                          ? "text-owl-cyan font-semibold"
                          : "text-foreground/70"
                      }
                    >
                      {s.latency}
                    </span>
                  </td>
                  <td className="text-sm text-foreground/80 p-3">{s.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   KNOWN ISSUES SECTION
   ──────────────────────────────────────────── */
function KnownIssuesSection() {
  const { ref, visible } = useSectionReveal();

  const fixedBugs = useMemo(() => [
    { id: "B1", desc: "SSE extended thinking blocks silently dropped", fix: "Map thinking_delta → reasoning_content", ver: "v7.3" },
    { id: "B2", desc: "Uninstall opencode.jsonc cleanup used naive regex", fix: "State-machine JSONC parser", ver: "v7.3" },
    { id: "B3", desc: "glibc/musl detection logic inverted", fix: "Check ldd output for musl string", ver: "v7.3" },
    { id: "B8", desc: "httpx client connections leak on shutdown", fix: "Added aclose() in finally block", ver: "v7.4" },
    { id: "B9", desc: "SIGHUP reload blocked when IDE running", fix: "SIGHUP is always safe", ver: "v7.4" },
    { id: "B10", desc: "Config directories lack secure permissions", fix: "chmod 700 on CONFIG_DIR", ver: "v7.4" },
    { id: "N2", desc: "Forward proxy hardcodes ~/.owl-agent", fix: "Use OWL_INSTALL_DIR env var", ver: "v8.0" },
    { id: "N8", desc: "SIGHUP file I/O blocks event loop", fix: "Thread executor for I/O", ver: "v8.0" },
    { id: "N9", desc: "All-streams-fail raises non-standard exception", fix: "OpenAI-compliant error chunk", ver: "v8.0" },
  ], []);

  const pendingIssues = useMemo(() => [
    { desc: "Antigravity OAuth PKCE requires manual code paste", status: "By design", workaround: "Use --api-key flag" },
    { desc: "Copilot device flow tokens expire after 24h", status: "Pending", workaround: "Re-run owl-token auth" },
    { desc: "Running install.sh twice may cause race conditions", status: "Known", workaround: "Use flock or run sequentially" },
    { desc: "No Windows support (systemd required)", status: "Not planned", workaround: "Use WSL2 with systemd" },
  ], []);

  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-yellow-400/40 text-yellow-400 bg-yellow-400/10 mb-4">
            Transparency
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-glow">
            <span className="bg-gradient-to-r from-yellow-400 to-owl-magenta bg-clip-text text-transparent">
              Known Issues
            </span>
          </h2>
          <p className="text-foreground/80">
            Full transparency. Every bug we&apos;ve fixed and every limitation we acknowledge.
          </p>
        </div>

        <Accordion multiple defaultValue={["fixed", "pending"]} className="space-y-3">
          <AccordionItem value="fixed" className="glass-depth !border-0 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/[0.02] [&>svg]:text-owl-green">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-owl-green/10 flex items-center justify-center">
                  <Bug className="w-4 h-4 text-owl-green" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Fixed Bugs</p>
                  <p className="text-xs text-foreground/70">
                    {fixedBugs.length} bugs fixed across 5 audit passes
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {fixedBugs.map((bug) => (
                  <div
                    key={bug.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <Badge
                      variant="outline"
                      className="text-xs py-0 shrink-0 border-owl-green/40 text-owl-green bg-owl-green/10"
                    >
                      {bug.id}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground/80">{bug.desc}</p>
                      <p className="text-xs text-foreground/80 mt-0.5">
                        Fix: {bug.fix} • {bug.ver}
                      </p>
                    </div>
                    <Wrench className="w-3.5 h-3.5 text-owl-green shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pending" className="glass-depth !border-0 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/[0.02] [&>svg]:text-yellow-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Pending / Known Limitations</p>
                  <p className="text-xs text-foreground/70">
                    {pendingIssues.length} items — workarounds available
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-2">
                {pendingIssues.map((issue, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs py-0 shrink-0 ${
                        issue.status === "Pending"
                          ? "border-yellow-400/40 text-yellow-400 bg-yellow-400/10"
                          : issue.status === "Known"
                            ? "border-owl-magenta/40 text-owl-magenta bg-owl-magenta/10"
                            : "border-foreground/40 text-foreground/80 bg-foreground/10"
                      }`}
                    >
                      {issue.status}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground/80">{issue.desc}</p>
                      <p className="text-xs text-foreground/80 mt-0.5">
                        Workaround: {issue.workaround}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   INFOGRAPHIC SECTION
   ──────────────────────────────────────────── */
function InfographicSection() {
  const { ref, visible } = useSectionReveal();

  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-owl-cyan via-owl-green to-owl-magenta bg-clip-text text-transparent">
              Feature Infographic
            </span>
          </h2>
        </div>

        <div className="glass-depth p-3 sm:p-4 overflow-hidden">
          <Image
            src="/infographic-illustration.png"
            alt="OWL-ORCA Feature Infographic"
            width={1200}
            height={800}
            className="w-full h-auto rounded-xl"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   FOOTER
   ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer role="contentinfo" className="relative mt-auto border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🦉</span>
              <span className="text-lg font-bold text-owl-cyan">OWL-ORCA</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Self-hosted AI gateway that aggregates free-tier providers into a single
              OpenAI-compatible API endpoint. Free AI for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground/80 mb-3">Project</h4>
            <div className="space-y-2">
              <a
                href="https://github.com/marktantongco/owl-orca-v3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-owl-cyan transition-colors"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub Repository
              </a>
              <a
                href="https://github.com/marktantongco/owl-orca/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-owl-cyan transition-colors"
                aria-label="MIT License"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                MIT License
              </a>
              <a
                href="https://github.com/marktantongco/owl-orca/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-owl-cyan transition-colors"
                aria-label="Report an Issue"
              >
                <Bug className="w-3.5 h-3.5" />
                Report an Issue
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground/80 mb-3">Sections</h4>
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-foreground/80 hover:text-owl-cyan transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground/80 mb-3">Built With</h4>
            <div className="flex flex-wrap gap-1.5">
              {["Python 3.10+", "Bash", "asyncio", "httpx", "aiohttp", "systemd", "Fernet"].map(
                (tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-xs py-0 border-white/20 text-foreground/70"
                  >
                    {tech}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/5" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
          <p>OWL-ORCA v8.0.0 — Five-Pass-Audit-Final Edition</p>
          <p>
            Stream Racing • Protocol Translation • Safe-Mode • Radix Routing • Circuit Breakers •
            Zero-Downtime
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────
   MAIN PAGE
   ──────────────────────────────────────────── */
export default function HomePage() {
  return (
    <ErrorBoundary sectionName="Root">
      <div className="min-h-screen flex flex-col animated-gradient-bg">
        <NavBar />
        <main role="main" className="flex-1">
          <ErrorBoundary sectionName="Hero">
            <HeroSection />
          </ErrorBoundary>
          <SectionSeparator />
          <ErrorBoundary sectionName="Architecture">
            <ArchitectureSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-cyan" />
          <ErrorBoundary sectionName="StreamRacer">
            <StreamRacerSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-magenta" />
          <ErrorBoundary sectionName="Features">
            <FeaturesSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-magenta" />
          <ErrorBoundary sectionName="CircuitBreaker">
            <CircuitBreakerDemo />
          </ErrorBoundary>
          <SectionSeparator color="owl-green" />
          <ErrorBoundary sectionName="ProtocolTranslation">
            <ProtocolTranslationDemo />
          </ErrorBoundary>
          <SectionSeparator color="owl-cyan" />
          <ErrorBoundary sectionName="ProxyEcosystem">
            <ProxyEcosystemSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-amber" />
          <ErrorBoundary sectionName="MemoryBudget">
            <MemoryBudgetSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-green" />
          <ErrorBoundary sectionName="Infographic">
            <InfographicSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-green" />
          <ErrorBoundary sectionName="Timeline">
            <TimelineSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-cyan" />
          <ErrorBoundary sectionName="QuickInstall">
            <QuickInstallSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-cyan" />
          <ErrorBoundary sectionName="FeatureMatrix">
            <FeatureMatrixSection />
          </ErrorBoundary>
          <SectionSeparator color="owl-amber" />
          <ErrorBoundary sectionName="KnownIssues">
            <KnownIssuesSection />
          </ErrorBoundary>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </ErrorBoundary>
  );
}

"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import type { ComponentProps, MouseEvent as ReactMouseEvent, SVGProps } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import heroPortrait from "@/public/hero-portrait.jpg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About me", href: "#about" },
  { label: "Projects", href: "#projects" },
];



const heroName = "Amalthoby".split("");
const heroEase: [number, number, number, number] = [0.17, 0.55, 0.55, 1];

const ArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path
      d="M5.5 14.5 14.5 5.5m0 0H7m7.5 0V12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path d="M3.5 6h13M3.5 10h13M3.5 14h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path d="m5.5 5.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type MagneticAnchorProps = ComponentProps<typeof motion.a> & {
  onCursorChange?: (active: boolean) => void;
  magnetic?: boolean;
};

const MagneticAnchor = ({
  onCursorChange,
  magnetic = true,
  children,
  whileHover = { scale: 1.04 },
  whileTap = { scale: 0.98 },
  transition = { type: "spring", stiffness: 260, damping: 18 },
  style,
  ...rest
}: MagneticAnchorProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 16;
    x.set(offsetX);
    y.set(offsetY);
    onCursorChange?.(true);
  };

  const handleMouseLeave = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    x.set(0);
    y.set(0);
    onCursorChange?.(false);
    rest.onMouseLeave?.(event);
  };

  const handleMouseEnter = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    onCursorChange?.(true);
    rest.onMouseEnter?.(event);
  };

  const mergedStyle: MagneticAnchorProps["style"] = style ? { ...style, x, y } : { x, y };

  return (
    <motion.a
      ref={ref}
      {...rest}
      style={mergedStyle}
      onMouseMove={(event) => {
        handleMouseMove(event);
        rest.onMouseMove?.(event);
      }}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
    >
      {children}
    </motion.a>
  );
};

const recentProjects = [
  {
    title: "Gyoji – Fitness Coaching Platform",
    description:
      "Subscription-based coaching platform featuring trainer dashboards, progress tracking, real-time chat, push notifications, and automated session reminders with full Stripe billing and admin analytics.",
    tags: ["Django", "React", "Stripe", "OAuth", "WebSocket"],
    date: "Sep 2025 – Present",
    stack: "Django, React, Stripe, OAuth 2.0, WebSocket, Celery",
    image: "/gyoji-hero.jpg",
    href: "https://github.com/amalthobyy/gyoji",
  },
  {
    title: "Lean-Genie – GenAI Build Assistant",
    description:
      "GenAI-powered dashboard that analyzes git history, classifies commits, surfaces risk indicators, and streamlines QA workflows with FastAPI, GitPython, pytest automation, and React/Vite visualizations.",
    tags: ["FastAPI", "React", "Vite", "GenAI", "OpenAI"],
    date: "Nov 2025",
    stack: "FastAPI, React/Vite, GitPython, OpenAI/Anthropic, pytest",
    image: "/lean-genie.png",
    href: "https://github.com/amalthobyy/Lean_genie",
  },
  {
    title: "DripDeck – Sneaker E-commerce",
    description:
      "Full-featured sneaker marketplace with curated catalog, real-time cart, Stripe checkout, inventory dashboards, sales analytics, and AWS deployment with containerized services and optimized caching.",
    tags: ["Django", "PostgreSQL", "AWS", "React"],
    date: "Oct 2024 – Nov 2024",
    stack: "Django, PostgreSQL, React, Stripe, AWS (EC2/S3), Docker",
    image: "/dripdeck.png",
    href: "https://github.com/amalthobyy/e_commerce",
  },
];

const experience = {
  role: "Full Stack Developer",
  duration: "Jan 2024 – Jun 2025",
  location: "Kochi, India",
  highlights: [
    "Delivered 3 full-stack products end-to-end from requirement gathering to deployment.",
    "Reduced UI defects by 30% by building reusable React components and automating linting in CI.",
    "Led sprint planning and code reviews for a 4-person team, mentoring junior developers.",
    "Optimized Python/Django APIs and caching strategies, cutting response latency by 25%.",
  ],
};

const education = {
  degree: "Bachelor of Computer Application",
  institution: "Sree Narayana Guru College of Advanced Studies",
  location: "Thrissur, India",
  duration: "Sep 2020 – Sep 2023",
};

const certifications = [
  "AWS Certified Cloud Practitioner",
  "Python Programming Certificate",
  "Best Performer Award (Communication)",
  "NCC (B Certification)",
];

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isElevated, setIsElevated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [enableCursor, setEnableCursor] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useSpring(0, { stiffness: 320, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 320, damping: 30 });

  const { scrollY, scrollYProgress } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 120], [0, 0.95]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const parallax = useTransform(heroScrollYProgress, [0, 1], ["-12%", "12%"]);
  const heroInView = useInView(heroRef, { once: true, amount: 0.6 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsElevated(latest > 32);
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = (target: MediaQueryList | MediaQueryListEvent) => setIsMobile(target.matches);
    update(query);

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }
    if (typeof query.addListener === "function") {
      query.addListener(update);
      return () => query.removeListener(update);
    }
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen || isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen, isLoading]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updateCursorSupport = (target: MediaQueryList | MediaQueryListEvent) => {
      const matches = target.matches;
      setEnableCursor(matches);
      if (!matches) {
        setCursorActive(false);
      }
    };

    updateCursorSupport(mediaQuery);

    const handleMouseMove = (event: MouseEvent) => {
      cursorX.set(event.clientX - 12);
      cursorY.set(event.clientY - 12);
    };

    if (mediaQuery.matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const handleChange = (event: MediaQueryListEvent) => updateCursorSupport(event);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [cursorX, cursorY]);

  const animationsReduced = prefersReducedMotion || isMobile;

  const fadeInUp = useMemo<Variants>(() => {
    return {
      hidden: animationsReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: animationsReduced
          ? { duration: 0 }
          : { duration: 0.7, ease: heroEase },
      },
    };
  }, [animationsReduced]);

  const staggerChildren = useMemo<Variants>(() => {
    return {
      hidden: {},
      visible: {
        transition: animationsReduced
          ? { staggerChildren: 0, delayChildren: 0 }
          : { staggerChildren: 0.18, delayChildren: 0.12 },
      },
    };
  }, [animationsReduced]);

  const textSplit = useMemo<Variants>(() => {
    return {
      hidden: animationsReduced ? { opacity: 1, y: "0%" } : { opacity: 0, y: "60%" },
      visible: {
        opacity: 1,
        y: "0%",
        transition: animationsReduced ? { duration: 0 } : { duration: 0.5, ease: heroEase },
      },
    };
  }, [animationsReduced]);

  const imageReveal = useMemo<Variants>(() => {
    return {
      hidden: animationsReduced ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 0, clipPath: "inset(20% 0 20% 0)" },
      visible: {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        transition: animationsReduced ? { duration: 0 } : { duration: 0.9, ease: heroEase },
      },
    };
  }, [animationsReduced]);

  const aboutRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.25 });
  const projectsInView = useInView(projectsRef, { once: true, amount: 0.25 });
  const experienceInView = useInView(experienceRef, { once: true, amount: 0.25 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.25 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnchorClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    const target = document.querySelector(href) as HTMLElement | null;
    if (target) {
      const offset = 96;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setMobileNavOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.17, 0.55, 0.55, 1] }}
          >
            <motion.span
              className="text-base font-semibold uppercase tracking-[0.6em] text-neutral-900 sm:text-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.17, 0.55, 0.55, 1] }}
            >
              Amalthoby
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      {enableCursor && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-900/40 bg-neutral-900/10 backdrop-blur-sm md:block"
          style={{ x: cursorX, y: cursorY }}
          animate={{ scale: cursorActive ? 1.6 : 1, opacity: isLoading ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      )}
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-neutral-900/90"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.header
        className="sticky top-0 z-50"
        role="banner"
        style={{ boxShadow: isElevated ? "0 20px 40px -32px rgba(15, 23, 42, 0.45)" : "none" }}
      >
        <div className="relative border-b border-black/5">
          <motion.span
            aria-hidden
            className="absolute inset-0 -z-10 bg-white/90 backdrop-blur-xl"
            style={{ opacity: backgroundOpacity }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          />
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
            <MagneticAnchor
              href="#home"
              className="flex min-h-[44px] items-center gap-3 text-[1.75rem] font-semibold tracking-[0.2em] text-neutral-900"
              aria-label="Navigate to home"
              magnetic={enableCursor}
              onCursorChange={setCursorActive}
              onClick={(event) => handleAnchorClick(event, "#home")}
            >
              Amalthoby
            </MagneticAnchor>
            <nav
              className="hidden items-center gap-1 text-sm text-neutral-600 lg:flex"
              aria-label="Primary navigation"
              id="primary-navigation"
            >
              {navLinks.map((item) => (
                <MagneticAnchor
                  key={item.href}
                  href={item.href}
                  className="link-underline rounded-full px-3 py-2 text-base font-semibold text-neutral-800 transition-colors duration-200 hover:bg-neutral-900/5 hover:text-neutral-900 min-h-[44px]"
                  magnetic={enableCursor}
                  onCursorChange={setCursorActive}
                  onClick={(event) => handleAnchorClick(event, item.href)}
                >
                  {item.label}
                </MagneticAnchor>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <MagneticAnchor
                href="#contact"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-700 hover:text-white focus-visible:text-white"
                magnetic={enableCursor}
                onCursorChange={setCursorActive}
                onClick={(event) => handleAnchorClick(event, "#contact")}
              >
                Contact
                <ArrowIcon className="h-4 w-4" />
              </MagneticAnchor>
              <motion.button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-600 transition-colors duration-200 hover:border-neutral-900 hover:text-neutral-900 lg:hidden"
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                aria-controls="mobile-navigation-panel"
                aria-expanded={mobileNavOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onMouseEnter={() => enableCursor && setCursorActive(true)}
                onMouseLeave={() => enableCursor && setCursorActive(false)}
              >
                {mobileNavOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              id="mobile-navigation-panel"
              initial={animationsReduced ? undefined : { opacity: 0, y: -12 }}
              animate={animationsReduced ? undefined : { opacity: 1, y: 0 }}
              exit={animationsReduced ? undefined : { opacity: 0, y: -12 }}
              transition={
                animationsReduced ? { duration: 0 } : { duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }
              }
              className="border-b border-neutral-200 bg-white/95 px-4 pb-6 pt-4 shadow-[0px_20px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur lg:hidden"
            >
              <div className="flex flex-col gap-3 text-sm text-neutral-700">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => {
                      handleAnchorClick(event, item.href);
                      setMobileNavOpen(false);
                    }}
                    className="rounded-full px-3 py-2 text-base font-semibold text-neutral-800 transition-colors duration-200 hover:bg-neutral-900/5 hover:text-neutral-900 min-h-[44px]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <motion.main
        className="flex-1"
        id="main-content"
        role="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.17, 0.55, 0.55, 1] }}
      >
        <section
          id="home"
          ref={heroRef}
          className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-24 pt-32 sm:px-6"
        >
          <div className="hidden w-full grid-cols-3 items-start gap-6 text-neutral-900 sm:grid">
            <motion.span
              initial={animationsReduced ? undefined : { opacity: 0, y: 12 }}
              animate={animationsReduced ? undefined : { opacity: 1, y: 0 }}
              transition={animationsReduced ? undefined : { duration: 0.6, ease: [0.17, 0.55, 0.55, 1] }}
              className="justify-self-start text-lg font-semibold text-neutral-800 sm:text-xl"
            >
              Hey there, I&apos;m
            </motion.span>
            <motion.span
              initial={animationsReduced ? undefined : { opacity: 0, y: 12 }}
              animate={animationsReduced ? undefined : { opacity: 1, y: 0 }}
              transition={animationsReduced ? undefined : { duration: 0.6, delay: 0.08, ease: [0.17, 0.55, 0.55, 1] }}
              className="justify-self-center text-center text-lg font-semibold text-neutral-800 sm:text-xl"
            >
              Available for Freelance Project
            </motion.span>
            <motion.span
              initial={animationsReduced ? undefined : { opacity: 0, y: 12 }}
              animate={animationsReduced ? undefined : { opacity: 1, y: 0 }}
              transition={animationsReduced ? undefined : { duration: 0.6, delay: 0.1, ease: [0.17, 0.55, 0.55, 1] }}
              className="justify-self-end text-right text-lg font-semibold text-neutral-800 sm:text-xl"
            >
              Based in Kerala, India
              <br /> Working Worldwide
            </motion.span>
          </div>
          <motion.div
            className="flex w-full flex-col gap-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.45em] text-neutral-500 sm:hidden"
            variants={fadeInUp}
          >
            <span className="text-base text-neutral-800">Hey there, I&apos;m</span>
            <span className="text-base text-neutral-800">Available for Freelance Project</span>
            <span className="text-base text-neutral-800">Based in Kerala, India — Working Worldwide</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            variants={staggerChildren}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.h1
              className="flex flex-wrap justify-center gap-x-2 text-[clamp(3rem,10vw,10rem)] font-semibold leading-none tracking-tight text-neutral-900"
              variants={staggerChildren}
            >
              {heroName.map((char, index) => (
                <motion.span key={`${char}-${index}`} className="inline-block" variants={textSplit}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p className="text-base font-semibold text-neutral-600 sm:text-lg" variants={fadeInUp}>
              Full-Stack Developer · Python/Django · React/Next.js · GenAI Integrations
            </motion.p>
          </motion.div>
          <div className="relative flex w-full justify-center pb-6 sm:pb-10">
            <motion.div
              style={animationsReduced ? undefined : { y: parallax }}
              variants={imageReveal}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              className="relative flex h-[420px] w-full max-w-5xl items-center justify-center overflow-hidden rounded-[220px] shadow-[0px_40px_120px_-60px_rgba(15,23,42,0.35)]"
            >
               <Image
                src={heroPortrait}
                alt="Amalthoby overlooking the Western Ghats"
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 rounded-[220px] bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent" />
            </motion.div>
          </div>
          <motion.div
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            variants={staggerChildren}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <MagneticAnchor
              href="#projects"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-700 hover:text-white focus-visible:text-white"
              magnetic={enableCursor}
              onCursorChange={setCursorActive}
              onClick={(event) => handleAnchorClick(event, "#projects")}
            >
              View projects
            </MagneticAnchor>
            <MagneticAnchor
              href="#contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-800 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-700 hover:text-white focus-visible:text-white"
              magnetic={enableCursor}
              onCursorChange={setCursorActive}
              onClick={(event) => handleAnchorClick(event, "#contact")}
            >
              Book a call
            </MagneticAnchor>
          </motion.div>
        </section>

        <motion.section
          id="about"
          ref={aboutRef}
          className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6"
          variants={staggerChildren}
          initial="hidden"
          animate={aboutInView ? "visible" : "hidden"}
        >
          <motion.div className="flex flex-col items-center gap-6" variants={fadeInUp}>
            <motion.h2 className="text-base font-semibold uppercase tracking-[0.4em] text-neutral-500" variants={fadeInUp}>
              About Me
            </motion.h2>
            <motion.p
              className="max-w-3xl text-lg text-neutral-700 sm:text-xl"
              variants={fadeInUp}
            >
              A passionate full-stack developer specializing in Python/Django and React with a focus on GenAI-enabled tools. I have proven experience shipping production web apps, crafting REST/GraphQL APIs, and building real-time experiences. With a strong foundation in clean architecture and test-driven development, I thrive in agile teams and enjoy solving complex technical challenges. I bring expertise in both frontend and backend technologies, from React/Next.js to Django/FastAPI, with hands-on experience in cloud platforms and modern DevOps practices.
            </motion.p>
          </motion.div>
        </motion.section>

        <motion.section
          id="projects"
          ref={projectsRef}
          className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6"
          variants={staggerChildren}
          initial="hidden"
          animate={projectsInView ? "visible" : "hidden"}
        >
          <motion.div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" variants={fadeInUp}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.6em] text-neutral-400">Client Work</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[42px]">
                Recent Projects
              </h2>
            </div>
            <MagneticAnchor
              href="#contact"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-neutral-600 link-underline underline-offset-4 transition-colors duration-200 hover:text-neutral-900"
              magnetic={enableCursor}
              onCursorChange={setCursorActive}
              onClick={(event) => handleAnchorClick(event, "#contact")}
            >
              Collaborate with me
              <ArrowIcon className="h-4 w-4" />
            </MagneticAnchor>
          </motion.div>
          <motion.div className="flex flex-col gap-8" variants={staggerChildren}>
            {recentProjects.map((project, index) => (
              <motion.article
                key={project.title}
                variants={fadeInUp}
                whileHover={{ y: -12 }}
                className="group rounded-[36px] border border-neutral-200 bg-white/90 p-6 shadow-[0px_40px_120px_-80px_rgba(15,23,42,0.7)] transition-transform duration-300 md:p-10"
              >
                <div
                  className={`flex flex-col gap-8 lg:items-center lg:gap-12 ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                  }`}
                >
                  <motion.div
                    className="relative w-full overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-900"
                    variants={imageReveal}
                  >
                    <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={640}
                      height={420}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={index === 0}
                    />
                  </motion.div>
                  <div className="flex w-full flex-col gap-6 lg:max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">{project.date}</p>
                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{project.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{project.description}</p>
                    <p className="text-sm font-medium text-neutral-600">Tech stack: {project.stack}</p>
                    <div>
                    <MagneticAnchor
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-neutral-900 px-5 py-2 text-sm font-semibold text-neutral-900 transition-colors duration-200 hover:bg-neutral-900 hover:text-white"
                      magnetic={enableCursor}
                      onCursorChange={setCursorActive}
                    >
                      View on GitHub
                      <ArrowIcon className="h-4 w-4" />
                      </MagneticAnchor>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          id="experience"
          ref={experienceRef}
          className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6"
          variants={staggerChildren}
          initial="hidden"
          animate={experienceInView ? "visible" : "hidden"}
        >
          <motion.div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" variants={fadeInUp}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.6em] text-neutral-400">Experience</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Full Stack Developer</h2>
            </div>
            <div className="text-sm text-neutral-600">
              <p className="font-semibold text-neutral-900">{experience.duration}</p>
              <p>{experience.location}</p>
            </div>
          </motion.div>
          <motion.ul className="mb-8 grid gap-3 text-sm leading-relaxed text-neutral-700" variants={staggerChildren}>
            {experience.highlights.map((item) => (
              <motion.li key={item} className="flex gap-2" variants={fadeInUp}>
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-neutral-900" aria-hidden />
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="grid gap-8 md:grid-cols-2" variants={staggerChildren}>
            <motion.article className="rounded-3xl border border-neutral-200 p-6" variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-neutral-900">Education</h3>
              <p className="mt-2 text-sm font-semibold text-neutral-700">{education.degree}</p>
              <p className="text-sm text-neutral-600">{education.institution}</p>
              <p className="text-sm text-neutral-500">{education.location}</p>
              <p className="mt-2 text-sm text-neutral-500">{education.duration}</p>
            </motion.article>
            <motion.article className="rounded-3xl border border-neutral-200 p-6" variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-neutral-900">Certifications</h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                {certifications.map((cert) => (
                  <li key={cert} className="flex gap-2">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-neutral-900" aria-hidden />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          </motion.div>
        </motion.section>

        <motion.section
          id="contact"
          ref={contactRef}
          className="mx-auto w-full max-w-5xl px-4 pb-28"
          variants={staggerChildren}
          initial="hidden"
          animate={contactInView ? "visible" : "hidden"}
        >
          <motion.div className="rounded-3xl border border-neutral-200 p-8" variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Let&apos;s build something together
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-neutral-600">
              I&apos;m currently partnering with teams on Python/Django and React projects, GenAI-enabled tools, and real-time product experiences. Reach out if you&apos;d like help shipping production-ready software or accelerating your full-stack roadmap.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MagneticAnchor
                href="mailto:amalpthobias@gmail.com"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-700 hover:text-white focus-visible:text-white"
                magnetic={enableCursor}
                onCursorChange={setCursorActive}
              >
                Email me
              </MagneticAnchor>
              <MagneticAnchor
                href="tel:+917994495178"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors duration-200 hover:border-neutral-900"
                magnetic={enableCursor}
                onCursorChange={setCursorActive}
              >
                Call +91 79944 95178
              </MagneticAnchor>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="font-semibold text-neutral-900">Direct</p>
                <a href="mailto:amalpthobias@gmail.com" className="block text-neutral-700 hover:text-neutral-900">
                  amalpthobias@gmail.com
                </a>
                <a href="tel:+917994495178" className="block text-neutral-700 hover:text-neutral-900">
                  +91 79944 95178
                </a>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-neutral-900">Connect</p>
                <a
                  href="https://linkedin.com/in/amal-thobias"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-neutral-700 hover:text-neutral-900"
                >
                  linkedin.com/in/amal-thobias
                </a>
                <a
                  href="https://github.com/amalthobyy"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-neutral-700 hover:text-neutral-900"
                >
                  github.com/amalthobyy
                </a>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-neutral-900">Location</p>
                <span>Kerala, India — Working Worldwide</span>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </motion.main>

      <footer className="border-t border-neutral-200 bg-white" role="contentinfo" aria-label="Footer">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[46px]">
               Let&apos;s Work Together
             </h2>
             <MagneticAnchor
              href="mailto:amalpthobias@gmail.com"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-700 hover:text-white focus-visible:text-white"
              magnetic={enableCursor}
              onCursorChange={setCursorActive}
            >
              Drop me a line
              <ArrowIcon className="h-4 w-4" />
            </MagneticAnchor>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-600">
              <a
                href="https://linkedin.com/in/amal-thobias"
                target="_blank"
                rel="noreferrer"
                className="link-underline transition-colors duration-200 hover:text-neutral-900"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/amalthobyy"
                target="_blank"
                rel="noreferrer"
                className="link-underline transition-colors duration-200 hover:text-neutral-900"
              >
                GitHub
              </a>
              <a href="mailto:amalpthobias@gmail.com" className="link-underline transition-colors duration-200 hover:text-neutral-900">
                amalpthobias@gmail.com
              </a>
            </div>
            <motion.button
              type="button"
              onClick={scrollToTop}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:border-neutral-900 hover:text-neutral-900"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onMouseEnter={() => enableCursor && setCursorActive(true)}
              onMouseLeave={() => enableCursor && setCursorActive(false)}
            >
              Back to Top
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </motion.button>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-200 pt-6 text-xs uppercase tracking-[0.3em] text-neutral-500 sm:flex-row">
            <span>© {new Date().getFullYear()} Amalthoby. All rights reserved.</span>
            <span>Designed &amp; built by Amalthoby</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useState, useRef, type CSSProperties, type FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  MonitorCog,
  Phone,
  Router as RouterIcon,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Wrench,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const queryClient = new QueryClient();
const WHATSAPP_NUMBER = '2348066169249';
const WHATSAPP_DISPLAY = '08066169249';
const BASE = import.meta.env.BASE_URL;

type Category = 'All' | 'Laptops' | 'Phones' | 'Accessories' | 'Security';
type Product = { name: string; category: Exclude<Category, 'All'>; image: string; note: string; tag?: string; adjust?: 'top' | 'bottom'; fit?: 'contain' };

const products: Product[] = [
  { name: 'HP Laptop', category: 'Laptops', image: `${BASE}template/img/hp-laptop.png`, note: 'Reliable everyday computing for home, school or office.', tag: 'Popular' },
  { name: 'Dell Laptop', category: 'Laptops', image: `${BASE}template/img/dell-laptop.png`, note: 'A practical workhorse for documents, browsing and learning.' },
  { name: 'Lenovo Laptop', category: 'Laptops', image: `${BASE}template/img/lenovo-laptop.jpg`, note: 'Solid performance and durability for professionals and students.' },
  { name: 'All-in-one Desktop', category: 'Laptops', image: `${BASE}template/img/all-in-one.jpg`, note: 'A clean, capable setup for the office front desk.' },
  { name: 'Desktop Monitor', category: 'Laptops', image: `${BASE}template/img/desktop-monitor.jpg`, note: 'Sharp display for work, study or entertainment setups.' },
  { name: 'Other Laptop Products', category: 'Laptops', image: `${BASE}template/img/other-laptops.jpg`, note: 'Keyboards, chargers, bags and other laptop essentials.' },
  { name: 'iPhone', category: 'Phones', image: `${BASE}template/img/iphone.jpg`, note: 'Carefully checked devices for everyday confidence.' },
  { name: 'Samsung Galaxy Note', category: 'Phones', image: `${BASE}template/img/samsung-galaxy-note.jpg`, note: 'Large-screen productivity with S Pen for busy professionals.' },
  { name: 'Samsung Galaxy', category: 'Phones', image: `${BASE}template/img/samsung-galaxy-series.jpg`, note: 'Premium Android performance with a bright, capable camera.' },
  { name: 'iPad', category: 'Phones', image: `${BASE}template/img/ipad.jpg`, note: 'Tablets for learning, entertainment and light productivity.' },
  { name: 'Samsung Tablet', category: 'Phones', image: `${BASE}template/img/samsung-tablets.jpg`, note: 'Portable screens for work and media on the go.' },
  { name: 'Other Android Phones', category: 'Phones', image: `${BASE}template/img/other-android-phones.jpg`, note: 'Wide range of Android options to fit every budget.' },
  { name: 'Wireless Headphones', category: 'Accessories', image: `${BASE}template/img/wireless-headphones.jpg`, note: 'Comfortable audio for work, commutes and downtime.', tag: 'New', fit: 'contain' },
  { name: 'Smart Fitness Watch', category: 'Accessories', image: `${BASE}template/img/product-2.png`, note: 'Simple activity tracking with a clean wrist profile.', fit: 'contain' },
  { name: 'Keyboard', category: 'Accessories', image: `${BASE}template/img/keyboard.jpg`, note: 'Wired and wireless keyboards for every workspace.' },
  { name: 'Mouse', category: 'Accessories', image: `${BASE}template/img/mouse.jpg`, note: 'Precision mice for work, design and everyday use.' },
  { name: 'Storage Drives', category: 'Accessories', image: `${BASE}template/img/storage-drives.jpg`, note: 'External hard drives and flash drives for safe file backup.' },
  { name: 'Connectors & Adapters', category: 'Accessories', image: `${BASE}template/img/connectors.jpg`, note: 'HDMI, USB hubs, chargers and essential connectivity gear.' },
  { name: 'Other Accessories', category: 'Accessories', image: `${BASE}template/img/other-accessories.jpg`, note: 'Phone cases, screen guards, stands and other add-ons.' },
  { name: 'Wireless Cameras', category: 'Security', image: `${BASE}template/img/wireless-camera.jpg`, note: 'Wire-free cameras for easy home and office monitoring.', fit: 'contain' },
  { name: 'Wired Cameras', category: 'Security', image: `${BASE}template/img/wired-camera.jpg`, note: 'Reliable wired CCTV for continuous, high-quality surveillance.' },
  { name: 'Network Installation Kit', category: 'Security', image: `${BASE}template/img/network-installation-kits.jpg`, note: 'Better-connected workspaces, homes and school environments.' },
  { name: 'Drones', category: 'Security', image: `${BASE}template/img/drones.jpg`, note: 'Aerial surveillance and imaging for events, farms and sites.' },
  { name: 'Dome Security Camera', category: 'Security', image: `${BASE}template/img/dome-security-camera.jpg`, note: 'Discreet ceiling-mount cameras for shops and offices.' },
  { name: 'PTZ Camera', category: 'Security', image: `${BASE}template/img/ptz-camera.jpg`, note: 'Pan-tilt-zoom cameras for wide-area coverage.', adjust: 'top', fit: 'contain' },
];

const services = [
  { icon: ShoppingBag, number: '01', title: 'Sales of IT, Electrical & Electronics', text: 'Laptops, phones, printers, projectors, generators and complete equipment sourcing for homes, offices and schools.' },
  { icon: MonitorCog, number: '02', title: 'Computer repairs', text: 'Practical diagnosis and careful fixes for laptops, desktops and printers.' },
  { icon: ShieldCheck, number: '03', title: 'CCTV & security installation', text: 'Site assessment, installation and setup for homes, shops, offices and schools.' },
  { icon: RouterIcon, number: '04', title: 'Networking & structured cabling', text: 'Stable Wi-Fi, LAN setup, structured cabling and network troubleshooting across Ibadan.' },
  { icon: Wrench, number: '05', title: 'Tech support & maintenance', text: 'A dependable local hand when devices, software or setups get difficult.' },
  { icon: Truck, number: '06', title: 'Delivery & setup', text: 'We deliver and configure your purchases at your home, office or school in Ibadan.' },
];

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#shop' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function inquireAbout(product?: Product) {
  const message = product
    ? `Hello 13-Eleven Infotech, I would like to inquire about the ${product.name}. Please share availability, current price and delivery or pickup details.`
    : 'Hello 13-Eleven Infotech, I would like to speak with your team about a technology product or service.';
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
}

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-3" aria-label="13-Eleven Infotech home">
      <span className="logo-mark">13</span>
      <span>
        <span className="logo-type block">13-Eleven</span>
        <span className="logo-sub block">Infotech Nigeria Ltd.</span>
      </span>
    </a>
  );
}

function Topbar() {
  return (
    <div className="topline">
      <div className="container-wide flex min-h-[36px] items-center justify-between gap-3 text-[.7rem]">
        <span className="flex items-center gap-2"><Clock3 size={13} /> Mon — Sat · 8:00am — 6:00pm</span>
        <span className="top-extra flex items-center gap-4 text-white/60">
          <span className="flex items-center gap-2"><MapPin size={13} /> Mokola, Ibadan</span>
          <span className="flex items-center gap-2"><Phone size={13} /> {WHATSAPP_DISPLAY}</span>
        </span>
      </div>
    </div>
  );
}

function Navbar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const [location] = useLocation();
  const active = location === '/' ? 'Home' : '';
  return (
    <header className="nav-wrap">
      <div className="nav-frame">
        <a href="#home" className="flex items-center gap-2.5" aria-label="13-Eleven Infotech home">
          <span className="logo-mark">13</span>
          <span>
            <span className="logo-type block">13-Eleven</span>
            <span className="logo-sub block">Infotech Nigeria Ltd.</span>
          </span>
        </a>
        <nav className="desktop-nav nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.label} className={`nav-link ${active === item.label ? 'active' : ''}`} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className="nav-divider hidden sm:block" />
        <button className="nav-cta hidden sm:inline-flex" onClick={() => inquireAbout()}>
          <MessageCircle size={15} /> WhatsApp us
        </button>
        <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-panel" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <button className="button-primary mt-4 w-full" onClick={() => { setMenuOpen(false); inquireAbout(); }}>
            <MessageCircle size={16} /> Start a WhatsApp conversation
          </button>
        </nav>
      )}
    </header>
  );
}

const heroSlides = [
  `${BASE}template/img/carousel-1.jpg`,
  `${BASE}template/img/hero-slide-1.jpg`,
  `${BASE}template/img/hero-slide-2.webp`,
  `${BASE}template/img/hero-slide-3.webp`,
];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero">
      {heroSlides.map((src, i) => (
        <div
          key={src}
          className="hero-slide"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="hero-overlay" />
      <div className="hero-fade" />
      <div className="container-wide hero-content">
        <div className="hero-kicker reveal">Ibadan's practical technology partner</div>
        <h1 className="display reveal reveal-delay">Tech that keeps <em>life moving.</em></h1>
        <p className="hero-lead reveal reveal-delay-2">
          From a laptop dealer in Ibadan you can trust to CCTV installation that gives you peace of mind — we make better technology feel close to home.
        </p>
        <div className="hero-actions reveal reveal-delay-2">
          <a className="button-primary" href="#shop">Explore the shop <ArrowDownRight size={17} /></a>
          <button className="button-secondary" onClick={() => inquireAbout()}><MessageCircle size={17} /> Talk to a specialist</button>
        </div>
      </div>
      <div className="hero-stamp">LOCAL<br />KNOW-HOW<br /><span>EST. IBADAN</span></div>
      <div className="hero-dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <div className="hero-stats">
      <div className="container-wide stat-strip">
        {[
          { strong: '13-Eleven', span: 'One trusted tech desk' },
          { strong: 'RC 1722476', span: 'Registered Nigerian company' },
          { strong: '4 ways', span: 'We help you stay connected' },
          { strong: 'Ibadan', span: 'Local, responsive, available' },
        ].map((stat, i) => (
          <motion.div
            key={stat.strong}
            className="stat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <strong>{stat.strong}</strong>
            <span>{stat.span}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ShopCategories() {
  const categories = [
    { title: 'Laptops & desktops', count: '6 products', image: `${BASE}template/img/laptops-desktops.webp`, href: '#shop' },
    { title: 'Phones', count: '6 products', image: `${BASE}template/img/phones.jpg`, href: '#shop' },
    { title: 'Accessories', count: '7 products', image: `${BASE}template/img/accessories.jpg`, href: '#shop' },
    { title: 'Security', count: '6 products', image: `${BASE}template/img/product-banner-3.jpg`, href: '#shop' },
  ];
  return (
    <ScrollReveal>
      <section className="section" aria-labelledby="shop-categories-heading">
        <div className="container-wide">
          <div className="section-heading">
            <div><span className="eyebrow">Find your fit</span><h2 id="shop-categories-heading" className="display">The right tech, without the runaround.</h2></div>
            <p>Tell us what you need to do, and we will point you toward the right device, accessory or setup for your budget.</p>
          </div>
          <div className="category-rail">
            {categories.map((category) => (
              <a key={category.title} href={category.href} className="category-card" style={{ '--image': `url(${category.image})` } as CSSProperties}>
                <p>{category.count}</p><h3>{category.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      {product.tag && <span className="absolute right-3 top-3 z-10 rounded-full bg-[hsl(var(--accent))] px-3 py-1 text-[.62rem] font-bold uppercase tracking-[.12em]">{product.tag}</span>}
      <div className={`product-image ${product.adjust === 'top' ? 'adjust-top' : product.adjust === 'bottom' ? 'adjust-bottom' : ''} ${product.fit === 'contain' ? 'fit-contain' : ''}`}><img src={product.image} alt={product.name} loading="lazy" /></div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3>{product.name}</h3>
        <p className="product-note">{product.note}</p>
        <button className="product-inquire" onClick={() => inquireAbout(product)}>Inquire on WhatsApp <ArrowRight size={14} className="ml-1 inline" /></button>
      </div>
    </article>
  );
}

function Shop() {
  const [filter, setFilter] = useState<Category>('All');
  const visible = filter === 'All' ? products : products.filter((product) => product.category === filter);
  const categories: Category[] = ['All', 'Laptops', 'Phones', 'Accessories', 'Security'];
  return (
    <ScrollReveal>
      <section id="shop" className="section section-tint grid-paper" aria-labelledby="shop-heading">
        <div className="container-wide">
          <div className="section-heading">
            <div><span className="eyebrow">The shop floor</span><h2 id="shop-heading" className="display">A considered catalogue. A human answer.</h2></div>
            <p>Stock changes quickly, so we keep it simple: browse the kind of tech you need, then ask us for today's availability and price.</p>
          </div>
          <div className="product-toolbar">
            <div className="filter-list" role="tablist" aria-label="Product categories">
              {categories.map((category) => <button key={category} className={`filter-btn ${filter === category ? 'selected' : ''}`} onClick={() => setFilter(category)} role="tab" aria-selected={filter === category}>{category}</button>)}
            </div>
            <span className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"><ShoppingBag size={14} /> {visible.length} options to explore</span>
          </div>
          <div className="product-grid">
            {visible.length ? visible.map((product) => <ProductCard key={product.name} product={product} />) : <div className="empty-state"><Sparkles className="mx-auto mb-3 text-[hsl(var(--secondary))]" size={22} /><strong className="block text-[hsl(var(--foreground))]">We are refreshing this shelf.</strong><span>Message us and we will source the right option for you.</span></div>}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function Services() {
  return (
    <ScrollReveal>
      <section id="services" className="section services-section" aria-labelledby="services-heading">
        <div className="container-wide service-layout">
          <div className="service-intro">
            <span className="eyebrow">Beyond the shelf</span>
            <h2 id="services-heading" className="display">When technology needs a steady hand.</h2>
            <p>Good tech is not only what you buy. It is what gets configured, protected and repaired when the day gets busy. Our service desk brings capable support to homes, offices, schools and small businesses across Ibadan.</p>
            <button className="button-secondary mt-5" onClick={() => inquireAbout()}>Ask about a service <ArrowRight size={16} /></button>
          </div>
          <div className="service-list">
            {services.map((service) => {
              const Icon = service.icon;
              return <article className="service-card" key={service.number}><span className="service-number">{service.number}</span><Icon className="service-icon" size={23} /><h3>{service.title}</h3><p>{service.text}</p></article>;
            })}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function About() {
  return (
    <ScrollReveal>
      <section id="about" className="section section-tint" aria-labelledby="about-heading">
        <div className="container-wide story-grid">
          <figure className="story-image"><img src={`${BASE}template/img/why-13.jpg`} alt="13-Eleven Infotech team and technology solutions" loading="lazy" /></figure>
          <div className="story-copy">
            <span className="eyebrow">Why 13-Eleven</span>
            <h2 id="about-heading" className="display">A local name you can put a face to.</h2>
            <p>13-Eleven Infotech Nigeria Ltd. was built for people who want honest guidance, clear options and technology that works beyond the unboxing. We are a registered company with a simple promise: meet customers where they are and make the next step obvious.</p>
            <ul className="check-list">
              <li><Check size={17} /> <span>Clear recommendations for real budgets and real routines.</span></li>
              <li><Check size={17} /> <span>Careful support for homes, offices, schools and small businesses.</span></li>
              <li><Check size={17} /> <span>Local access in Mokola, with WhatsApp support when you need us.</span></li>
            </ul>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function TrustBand() {
  return (
    <ScrollReveal>
      <section className="trust-band">
        <div className="container-wide trust-content">
          <div><span className="eyebrow !text-[hsl(var(--accent))]">Let's make it work</span><h2 className="display">Your next tech decision can be the easy one.</h2></div>
          <div><p>Need a laptop, phone, smartwatch, or laptop accessories in Oyo State? Looking for computer repair in Mokola or a quote for CCTV installation in Ibadan? We are just one message away</p><button className="button-primary" onClick={() => inquireAbout()}>Start with WhatsApp <MessageCircle size={16} /></button></div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function Proof() {
  return (
    <ScrollReveal>
      <section className="section" aria-label="Customer experience">
        <div className="container-wide testimonial-row">
          <div className="quote-card"><span className="eyebrow !text-[hsl(var(--accent))]">A better kind of service</span><p>"The best technology help is the kind that leaves you feeling capable, not confused."</p><div className="quote-author"><span className="avatar-initials">13</span><span>13-Eleven service promise</span></div></div>
          <div className="proof-card"><Truck size={25} /><strong className="display">one chat</strong><span>from a product question to a clear next step. No pressure, no jargon.</span></div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = `Hello 13-Eleven Infotech, my name is ${form.name}. My phone number is ${form.phone}. ${form.message}`;
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return (
    <ScrollReveal>
      <section id="contact" className="section contact-section" aria-labelledby="contact-heading">
        <div className="container-wide contact-grid">
          <div className="contact-copy">
            <span className="eyebrow">Come say hello</span>
            <h2 id="contact-heading" className="display">Let's talk about what you need.</h2>
            <p>Bring us your question. A product shortlist, a stubborn laptop, a new office network or a CCTV idea — we will help you make sense of it.</p>
            <div className="contact-details">
              <div className="detail"><MapPin size={18} /><div><span>Visit the desk</span><strong>No. 72 Adelaja Street, Mokola,<br />Ibadan, Oyo State, Nigeria</strong></div></div>
              <div className="detail"><Phone size={18} /><div><span>Call or WhatsApp</span><strong>08066169249 · 08089814173</strong></div></div>
              <div className="detail"><Send size={18} /><div><span>Email</span><strong>13eleveninfortech@gmail.com</strong></div></div>
              <div className="detail"><Instagram size={18} /><div><span>Find us online</span><a className="detail-link" href="https://www.instagram.com/13_eleven_infortech_Nig_ltd" target="_blank" rel="noreferrer">@13_eleven_infortech_Nig_ltd</a></div></div>
            </div>
          </div>
          <div className="contact-right">
            <form className="inquiry-form" onSubmit={handleSubmit}>
              <h3>Send an inquiry</h3>
              <div className="field"><label htmlFor="name">Your name</label><input id="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="How should we address you?" /></div>
              <div className="field"><label htmlFor="phone">Phone or WhatsApp number</label><input id="phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="080..." /></div>
              <div className="field"><label htmlFor="message">What can we help with?</label><textarea id="message" required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Tell us about the device, service or setup..." /></div>
              <button className="button-primary w-full" type="submit"><MessageCircle size={16} /> {sent ? 'WhatsApp opened — thank you' : 'Continue on WhatsApp'}</button>
            </form>
            <iframe className="map-frame" title="Map showing 13-Eleven Infotech on Adelaja Street, Mokola, Ibadan" loading="lazy" src="https://www.google.com/maps?q=No.+72+Adelaja+Street,+Mokola,+Ibadan,+Oyo+State,+Nigeria&output=embed" />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide footer-grid">
        <div><Logo /><p className="mt-5">Technology retail and services for the way Ibadan lives, works and learns.</p></div>
        <div><h4>Explore</h4><div className="footer-links">{navItems.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}</div></div>
        <div><h4>Keep in touch</h4><div className="footer-links"><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp · {WHATSAPP_DISPLAY}</a><a href="tel:+2348089814173">08089814173</a><a href="mailto:13eleveninfortech@gmail.com">13eleveninfortech@gmail.com</a><a href="https://www.facebook.com/13-eleven-infortech-Nig-ltd" target="_blank" rel="noreferrer">Facebook · 13-eleven infortech Nig ltd</a><a href="https://www.instagram.com/13_eleven_infortech_Nig_ltd" target="_blank" rel="noreferrer">Instagram · @13_eleven_infortech_Nig_ltd</a></div></div>
      </div>
      <div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} 13-Eleven Infotech Nigeria Ltd.</span><span>RC Number 1722476 · No. 72 Adelaja Street, Mokola, Ibadan</span></div>
    </footer>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.title = '13-Eleven Infotech | Technology Retail & Services in Ibadan';
    const description = '13-Eleven Infotech Nigeria Ltd. is a trusted Ibadan technology partner for laptops, phones, accessories, CCTV installation, networking and computer repairs.';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
    const schema = {
      '@context': 'https://schema.org', '@type': 'LocalBusiness', name: '13-Eleven Infotech Nigeria Ltd.',
      description, url: window.location.href, telephone: '+2348066169249', email: '13eleveninfortech@gmail.com',
      priceRange: '₦₦', image: `${window.location.origin}/template/img/carousel-1.jpg`,
      address: { '@type': 'PostalAddress', streetAddress: 'No. 72 Adelaja Street, Mokola', addressLocality: 'Ibadan', addressRegion: 'Oyo State', addressCountry: 'NG' },
      areaServed: ['Ibadan', 'Oyo State'], sameAs: ['https://www.facebook.com/13-eleven-infortech-Nig-ltd', 'https://www.instagram.com/13_eleven_infortech_Nig_ltd'],
    };
    let script = document.querySelector('script[data-business-schema]') as HTMLScriptElement | null;
    if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.businessSchema = 'true'; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
  }, []);
  return (
    <div className="site-shell noise">
      <Topbar /><Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} /><main><Hero /><Stats /><ShopCategories /><Shop /><Services /><About /><TrustBand /><Proof /><Contact /></main><Footer />
      <a className="whatsapp-float" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello 13-Eleven Infotech, I need help with a technology product or service.')}`} target="_blank" rel="noreferrer" aria-label="Chat with 13-Eleven Infotech on WhatsApp"><MessageCircle size={19} /> Chat with us</a>
    </div>
  );
}

function Router() {
  return (
    <ErrorBoundary>
      <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>
    </ErrorBoundary>
  );
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
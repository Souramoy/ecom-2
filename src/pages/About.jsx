import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback.jsx';

const BRAND_VALUES = [
  {
    title: '01. Anatomical Comfort',
    text: 'Every SOLE STUDIO silhouette begins on a sculpted human-foot last. Dual-density EVA cores and contoured arch beds eliminate break-in fatigue from day one.',
  },
  {
    title: '02. Material Honesty',
    text: 'We partner with audited tanneries and technical mills for full-grain tumbled leather, breathable zoned knits, and natural crepe-textured gum rubber.',
  },
  {
    title: '03. Architectural Restraint',
    text: 'No loud branding or disposable seasonal gimmicks. Our palette—chalk, obsidian, warm stone, and disciplined volt accents—moves seamlessly across every wardrobe.',
  },
];

export default function About() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>About</span>
          </nav>
          <p className="section-kicker">Our Atelier &amp; Story</p>
          <h1 className="section-title" style={{ maxWidth: '24ch' }}>
            Footwear Engineered for Movement and Quiet Luxury.
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split-grid">
            <div className="split-media">
              <ImageWithFallback
                src="/src/assets/images/brand_story_craft_1794984019720.jpg"
                alt="SOLE STUDIO footwear design studio table"
              />
            </div>

            <div className="split-content">
              <div>
                <p className="section-kicker">Brand Introduction</p>
                <h2 className="section-title">MORE THAN JUST SHOES.</h2>
                <p
                  style={{
                    color: '#444444',
                    marginTop: '1rem',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                  }}
                >
                  Founded in 2022, SOLE STUDIO set out to bridge the gap between performance
                  athletic engineering and tailored minimalist style. We noticed wearers forced to
                  choose between ultra-technical running shoes that clashed with daily outfits and
                  flat fashion sneakers that lacked underfoot support.
                </p>
                <p
                  style={{
                    color: '#444444',
                    marginTop: '1rem',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                  }}
                >
                  Today, our Mumbai design atelier prototypes every outsole, knit density, and
                  leather panel in-house—testing across real city pavements before a single pair
                  reaches your doorstep.
                </p>
              </div>

              <div>
                <Link to="/shop" className="btn btn-primary">
                  Explore the Collection <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-surface" aria-label="Design values">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Design Approach</p>
              <h2 className="section-title">What Guides Every Stitch</h2>
            </div>
          </div>
          <div className="values-grid">
            {BRAND_VALUES.map((val) => (
              <article key={val.title} className="value-card">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    marginBottom: '0.65rem',
                  }}
                >
                  {val.title}
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#555555', lineHeight: 1.65 }}>
                  {val.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

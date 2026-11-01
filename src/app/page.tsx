import Link from "next/link";

const categories = [
  {
    number: "01",
    icon: "🍽️",
    title: "خواردنگەکان",
    subtitle: "خواردنی ئامادە و چێشتخانە ناوخۆییەکان",
    accent: "category-card--restaurant",
  },
  {
    number: "02",
    icon: "🛒",
    title: "مارکێتەکان",
    subtitle: "کەلوپەلی ڕۆژانە و پێداویستییەکانی ماڵ",
    accent: "category-card--market",
  },
  {
    number: "03",
    icon: "🥬",
    title: "میوە و سەوزە",
    subtitle: "بەرهەمی تازە و فرۆشیاری باوەڕپێکراو",
    accent: "category-card--produce",
  },
  {
    number: "04",
    icon: "🥩",
    title: "گۆشت و ماسی",
    subtitle: "گۆشت و بەرهەمی دەریایی",
    accent: "category-card--meat",
  },
];

const benefits = [
  {
    number: "01",
    title: "بازاڕێکی یەکگرتوو",
    description: "بەشە جیاوازەکانی بازاڕ لە یەک شوێن بەردەستن.",
  },
  {
    number: "02",
    title: "فرۆشیاری دیاریکراو",
    description: "هەر فرۆشیارێک بە پێی جۆری چالاکی و فرۆشگاکەی کار دەکات.",
  },
  {
    number: "03",
    title: "گەیاندنی ڕێکخراو",
    description: "داواکاری و گەیاندن لە ڕێگەی سیستەمێکی یەکگرتووەوە بەڕێوەدەبرێت.",
  },
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="SHAKH - سەرەکی">
            <span className="brand-mark">ش</span>
            <span className="brand-copy">
              <strong>SHAKH</strong>
              <small>بازاڕی یەکگرتوو</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="ناوبەری سەرەکی">
            <Link href="#categories">بەشەکان</Link>
            <Link href="#how-it-works">چۆنیەتی کارکردن</Link>
            <Link href="#partners">ببە بەشێک لە SHAKH</Link>
          </nav>

          <div className="header-actions">
            <Link className="text-link" href="#partners">
              هاوبەشبوون
            </Link>
            <Link className="button button--dark button--small" href="/login">
              چوونەژوورەوە
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-orb hero-orb--one" aria-hidden="true" />
        <div className="hero-orb hero-orb--two" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>بازاڕێکی نوێ، ئەزموونێکی ئاسانتر</span>
            </div>
            <h1>
              هەموو پێداویستییەکانت،
              <span> لە یەک شوێن.</span>
            </h1>
            <p className="hero-description">
              لە خواردنگە و مارکێتەوە تا میوە و سەوزە و گۆشت و ماسی؛
              بە ئاسانی بگەڕێ، هەڵبژێرە و داواکارییەکانت بەڕێوەببە.
            </p>
            <div className="hero-actions">
              <Link className="button button--primary" href="#categories">
                بینینی بەشەکان
                <span aria-hidden="true">←</span>
              </Link>
              <Link className="button button--quiet" href="#how-it-works">
                چۆن کار دەکات؟
              </Link>
            </div>
            <div className="hero-note">
              <span className="hero-note-icon" aria-hidden="true">✦</span>
              <span>پلاتفۆرمێک بۆ کڕیار، فرۆشیار و کاپتن</span>
            </div>
          </div>

          <div className="hero-art" aria-label="وێنەی هونەری نیشاندەری بازاڕی SHAKH">
            <div className="art-backdrop" />
            <div className="art-ring art-ring--outer" />
            <div className="art-ring art-ring--inner" />
            <div className="art-center">
              <span className="art-center-mark">ش</span>
              <strong>SHAKH</strong>
              <small>All in one place</small>
            </div>
            <div className="art-tile art-tile--top">
              <span>🍃</span>
              <small>تازە و ناوخۆیی</small>
            </div>
            <div className="art-tile art-tile--right">
              <span>🛍️</span>
              <small>بازاڕکردنی ئاسان</small>
            </div>
            <div className="art-tile art-tile--bottom">
              <span>🚴</span>
              <small>گەیاندنی ڕێکخراو</small>
            </div>
            <div className="art-spark art-spark--one">✳</div>
            <div className="art-spark art-spark--two">✦</div>
          </div>
        </div>
      </section>

      <section className="category-section" id="categories">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">بەشەکانی بازاڕ</span>
              <h2>لە کوێوە دەست پێدەکەیت؟</h2>
            </div>
            <p>بەشی دڵخوازت هەڵبژێرە و بە ئاسانی بگەڕێ.</p>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article className={`category-card ${category.accent}`} key={category.number}>
                <div className="category-card-top">
                  <span className="category-number">{category.number}</span>
                  <span className="category-icon" aria-hidden="true">{category.icon}</span>
                </div>
                <div className="category-card-copy">
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                </div>
                <span className="category-arrow" aria-hidden="true">↙</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="container how-layout">
          <div className="how-intro">
            <span className="section-kicker">ئەزموونی SHAKH</span>
            <h2>سادە، ڕوون و یەکگرتوو.</h2>
            <p>
              ئامانجی SHAKH بەستنەوەی کڕیار بە فرۆشیار و کاپتنە، لە ژێر
              سیستەمێکی ڕێکخراو و ئاسان بۆ بەکارهێنان.
            </p>
          </div>
          <div className="benefit-list">
            {benefits.map((benefit) => (
              <article className="benefit-item" key={benefit.number}>
                <span className="benefit-number">{benefit.number}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
                <span className="benefit-arrow" aria-hidden="true">↙</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="partner-section" id="partners">
        <div className="container">
          <div className="partner-panel">
            <div className="partner-copy">
              <span className="section-kicker section-kicker--light">بۆ خاوەن کاروبار</span>
              <h2>فرۆشگاکەت بهێنە ناو SHAKH.</h2>
              <p>
                خواردنگە، مارکێت یان فرۆشیاری بەرهەمی تازەیت؟ SHAKH بۆ
                گەشەپێدانی کاروبار و بەڕێوەبردنی داواکارییەکان دروست دەکرێت.
              </p>
            </div>
            <div className="partner-seal" aria-hidden="true">
              <span>SHAKH</span>
              <strong>STORE</strong>
              <small>LOCAL • CONNECTED</small>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <Link className="brand brand--footer" href="/">
            <span className="brand-mark">ش</span>
            <span className="brand-copy">
              <strong>SHAKH</strong>
              <small>بازاڕی یەکگرتوو</small>
            </span>
          </Link>
          <p>© {new Date().getFullYear()} SHAKH. هەموو مافەکان پارێزراون.</p>
          <span className="footer-tag">لە یەک شوێن، بۆ هەمووان.</span>
        </div>
      </footer>
    </main>
  );
}
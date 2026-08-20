const Icon = ({ name }: { name: "site" | "calendar" | "portfolio" | "reviews" | "contacts" }) => {
  const paths = {
    site: <><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3"/><circle cx="17" cy="7" r=".8" fill="currentColor" stroke="none"/></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4m8-4v4M4 10h16m-11 4 2 2 4-4"/></>,
    portfolio: <><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.5"/><path d="m5 17 4.2-4.2 3 3L15 13l4 4"/></>,
    reviews: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3-.6L4 20l1.6-4.1A7.2 7.2 0 0 1 4 11.5a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7.5Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></>,
    contacts: <><rect x="4" y="5" width="16" height="15" rx="3"/><path d="m5 17 4.2-4.2 3 3L15 13l4 4M8 8h8"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const features = [
  ["site", "Персональный сайт"],
  ["calendar", "Онлайн-запись"],
  ["portfolio", "Портфолио"],
  ["reviews", "Отзывы"],
  ["contacts", "Контакты"],
] as const;

function DeviceMockup({ variant }: { variant: "dark" | "light" }) {
  return (
    <div className={`devices ${variant}`} aria-hidden="true">
      <div className="laptop">
        <div className="laptop-camera" />
        <div className="laptop-screen">
          <div className="mini-nav"><b>TANEM</b><i/><i/><i/></div>
          <div className="mini-copy">
            <span>{variant === "dark" ? "Архитектура" : "Чистота"}</span>
            <span>{variant === "dark" ? "в деталях" : "формы"}</span>
            <small>Персональный сайт мастера</small>
            <button>Записаться</button>
          </div>
          <div className="mini-art"><span/><span/><span/></div>
        </div>
        <div className="laptop-base" />
      </div>
      <div className="phone">
        <div className="phone-island" />
        <div className="phone-screen">
          <b>TANEM</b>
          <strong>{variant === "dark" ? "Архитектура\nв деталях" : "Чистота\nформы"}</strong>
          <div className="phone-art" />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <div className="page-shell">
        <section className="hero" id="top">
          <div className="hero-art" />
          <nav className="nav" aria-label="Основная навигация">
            <a className="logo" href="#top" aria-label="TANEM — на главную">TANEM</a>
            <div className="nav-links">
              <a href="#examples">Примеры</a>
              <a href="#process">Как это работает</a>
              <a href="#masters">Для мастеров</a>
            </div>
            <a className="nav-cta" href="#request">Получить сайт</a>
          </nav>

          <div className="hero-copy">
            <p className="eyebrow">Персональный сайт мастера</p>
            <h1>Цифровой офис<br/>для частного мастера</h1>
            <p className="hero-lead">Сайт, работы, цены, отзывы, контакты<br className="desktop-break"/> и запись — в одном месте.</p>
            <div className="hero-actions">
              <a className="button primary" href="#request">Получить сайт <span>→</span></a>
              <a className="button secondary" href="#examples">Посмотреть примеры</a>
            </div>
          </div>

          <div className="feature-strip">
            {features.map(([name, label]) => (
              <div className="feature" key={name}>
                <Icon name={name}/><span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="examples" id="examples">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Примеры</p>
              <h2>Готовые сайты для мастеров</h2>
              <p>Современные сайты, которые помогают привлекать клиентов<br className="desktop-break"/> и выглядеть профессионально.</p>
            </div>
            <a className="outline-link" href="#example-grid">Смотреть все примеры <span>→</span></a>
          </div>

          <div className="example-grid" id="example-grid">
            <a className="example-card" href="https://nonna.tanem.ru/" target="_blank" rel="noreferrer">
              <div className="card-top"><span>Готовый сайт №1</span><i>Открыть ↗</i></div>
              <DeviceMockup variant="dark" />
            </a>
            <a className="example-card" href="https://anastasia.tanem.ru/" target="_blank" rel="noreferrer">
              <div className="card-top"><span>Готовый сайт №2</span><i>Открыть ↗</i></div>
              <DeviceMockup variant="light" />
            </a>
          </div>
        </section>

        <section className="process" id="process">
          <p className="section-kicker">Как это работает</p>
          <h2>От карточки мастера<br/>до готового сайта</h2>
          <div className="steps">
            <article><span>01</span><h3>Собираем основу</h3><p>Берём услуги, цены, отзывы и контакты из ваших открытых источников.</p></article>
            <article><span>02</span><h3>Создаём сайт</h3><p>Собираем аккуратную персональную страницу под ваш стиль и услуги.</p></article>
            <article><span>03</span><h3>Подключаем запись</h3><p>Добавляем удобный переход в систему записи, мессенджер или по телефону.</p></article>
          </div>
        </section>

        <section className="masters" id="masters">
          <div>
            <p className="section-kicker">Для мастеров</p>
            <h2>Всё важное<br/>в одной ссылке</h2>
          </div>
          <p>Клиент сразу видит ваши работы, понимает стоимость и может записаться. Без поиска информации по разным социальным сетям.</p>
        </section>

        <section className="request" id="request">
          <div className="request-glow" />
          <p className="section-kicker">TANEM</p>
          <h2>Ваш цифровой офис<br/>может быть следующим</h2>
          <p>Посмотрите примеры и расскажите, какой сайт нужен вам.</p>
          <a className="button primary" href="#examples">Посмотреть примеры <span>→</span></a>
        </section>

        <footer><a className="logo" href="#top">TANEM</a><span>Цифровые офисы для частных мастеров</span><span>2026</span></footer>
      </div>
    </main>
  );
}

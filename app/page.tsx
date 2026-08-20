export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav site-width" aria-label="Основная навигация">
          <a className="brand" href="#top" aria-label="TANEM — на главную">
            <img src="/tanem-logo.webp" alt="" />
            <span>tanem.ru</span>
          </a>

          <div className="nav-links" aria-label="Разделы сайта">
            <a href="#about">Что это?</a>
            <a href="#examples">Примеры</a>
            <a href="#process">Как работает?</a>
            <a href="#contact">Контакты</a>
          </div>

          <a className="nav-cta" href="https://t.me/tanem_ru" target="_blank" rel="noreferrer">Получить сайт бесплатно</a>
        </nav>

        <div className="hero-main site-width">
          <div className="hero-copy">
            <p className="eyebrow">TANEM · цифровой офис мастера</p>
            <h1>Цифровой офис<br/>для частного мастера</h1>
            <p className="hero-lead">Персональный сайт, где клиент сразу видит ваши работы, услуги, цены и отзывы — и понимает, как записаться.</p>

            <div className="hero-points" aria-label="Что даёт TANEM">
              <div><span className="point-index">01</span><strong>Одна ссылка</strong><p>Работы, цены, отзывы, контакты и запись — без поиска по разным страницам.</p></div>
              <div><span className="point-index">02</span><strong>Прямая запись</strong><p>YCLIENTS, Dikidi, Telegram или звонок — клиент выбирает привычный способ.</p></div>
              <div><span className="point-index">03</span><strong>Свой сайт</strong><p>Мы сами собираем основу и запускаем сайт. От вас — только проверить информацию.</p></div>
            </div>

            <p className="hero-note">Базовая версия — бесплатно · Без ежемесячной подписки</p>

            <div className="hero-actions">
              <a className="button primary" href="https://t.me/tanem_ru" target="_blank" rel="noreferrer">Получить цифровой офис бесплатно <span>→</span></a>
              <a className="button secondary" href="#examples">Посмотреть примеры</a>
            </div>
          </div>
        </div>

        <div className="hero-explain" id="about">
          <div className="site-width hero-explain-inner">
            <span className="hero-explain-label">Что это?</span>
            <p><strong>TANEM — это готовый цифровой офис мастера.</strong> Мы сами собираем профессиональную информацию, оформляем её в персональный сайт и подключаем нужные способы записи. Вам не нужно разбираться в конструкторах и настройках.</p>
          </div>
        </div>
      </section>

      <section className="examples" id="examples">
        <div className="site-width">
          <div className="section-head">
            <div>
              <p className="section-kicker">Примеры цифровых офисов</p>
              <h2>Ваш сайт выглядит<br/>как самостоятельный бренд</h2>
            </div>
            <p>Не анкета внутри платформы и не ещё одна страница с кнопками. Это отдельный персональный сайт мастера — с мобильной и компьютерной версией.</p>
          </div>

          <div className="example-grid">
            <a className="example-card" href="https://nonna.tanem.ru/" target="_blank" rel="noreferrer">
              <div className="example-top"><div><span>Пример 01</span><strong>Персональный сайт мастера</strong></div><span className="open-label">Открыть ↗</span></div>
              <div className="device-stage"><img className="device-image" src="/tanem-devices.webp" alt="Сайт TANEM на MacBook и iPhone" /></div>
              <div className="example-meta"><span>Услуги и цены</span><i/><span>Работы</span><i/><span>Отзывы</span><i/><span>Запись</span></div>
            </a>

            <a className="example-card" href="https://anastasia.tanem.ru/" target="_blank" rel="noreferrer">
              <div className="example-top"><div><span>Пример 02</span><strong>Сайт в стиле мастера</strong></div><span className="open-label">Открыть ↗</span></div>
              <div className="device-stage stage-alt"><img className="device-image" src="/tanem-devices.webp" alt="Сайт TANEM на MacBook и iPhone" /></div>
              <div className="example-meta"><span>ПК-версия</span><i/><span>Телефон</span><i/><span>Своя ссылка</span><i/><span>Прямая связь</span></div>
            </a>
          </div>

          <div className="inside-block">
            <div className="inside-intro">
              <p className="section-kicker">Что находится внутри</p>
              <h3>Клиент открывает сайт<br/>и сразу понимает, что делать</h3>
              <p>Каждый блок отвечает на конкретный вопрос клиента: кто мастер, сколько стоит услуга, как выглядят работы и как записаться.</p>
            </div>

            <div className="inside-list">
              <article><span>01</span><div><strong>Работы и доверие</strong><p>Портфолио, отзывы, опыт и информация о мастере собраны в одном месте.</p></div></article>
              <article><span>02</span><div><strong>Услуги и цены</strong><p>Клиент заранее понимает стоимость и выбирает подходящую услугу без переписки.</p></div></article>
              <article><span>03</span><div><strong>Запись и связь</strong><p>Подключаем YCLIENTS, Dikidi, Telegram, телефон или другой привычный вам способ.</p></div></article>
              <article><span>04</span><div><strong>Одна постоянная ссылка</strong><p>Её можно поставить в Яндекс Карты, соцсети, мессенджеры и отправлять клиентам.</p></div></article>
            </div>
          </div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="site-width">
          <div className="process-head">
            <div><p className="section-kicker">Как это работает</p><h2>От вашей карточки<br/>до готового сайта</h2></div>
            <p>Мы не заставляем мастера разбираться в конструкторах и настройках. Нужную основу собираем сами, затем показываем готовый результат.</p>
          </div>

          <div className="steps">
            <article><span>01</span><h3>Собираем информацию</h3><p>Берём открытые данные: услуги, цены, отзывы, фотографии, контакты и способы записи.</p></article>
            <article><span>02</span><h3>Создаём цифровой офис</h3><p>Собираем персональный дизайн под мастера и адаптируем сайт для телефона и компьютера.</p></article>
            <article><span>03</span><h3>Вы получаете готовую ссылку</h3><p>Её можно сразу отправлять клиентам, добавить в Яндекс Карты и использовать в соцсетях.</p></article>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="site-width contact-grid">
          <div className="contact-copy">
            <p className="section-kicker">Связаться с TANEM</p>
            <h2>Хотите свой<br/>цифровой офис?</h2>
            <p>Пришлите ссылку на вашу карточку или профиль. Мы посмотрим, как можно собрать сайт именно под вас.</p>
            <div className="contact-actions">
              <a className="button light" href="https://t.me/tanem_ru" target="_blank" rel="noreferrer">Подать заявку <span>→</span></a>
              <a className="contact-link" href="https://t.me/tanem_ru" target="_blank" rel="noreferrer">Telegram · @tanem_ru</a>
            </div>
          </div>

          <div className="contact-side">
            <div><span>01</span><strong>Посмотреть примеры</strong><a href="#examples">Перейти к сайтам ↑</a></div>
            <div><span>02</span><strong>Написать нам</strong><a href="https://t.me/tanem_ru" target="_blank" rel="noreferrer">Открыть Telegram ↗</a></div>
            <div><span>03</span><strong>Наш адрес</strong><a href="#top">tanem.ru</a></div>
          </div>
        </div>

        <div className="site-width footer-line"><span>TANEM</span><span>Цифровые офисы для частных мастеров</span><span>2026</span></div>
      </section>
    </main>
  );
}
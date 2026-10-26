import { AlertTriangle, BookOpen, Download, ExternalLink, Github, HeartHandshake, Info, ShieldCheck } from "lucide-react";
import { Badge, Callout, SectionHeader, SectionSubhead } from "../components/ui";
import { SITE } from "../lib/meta";

const sources = [
  {
    name: "LonaRPG Wiki (Miraheze)",
    url: "https://lonarpg.miraheze.org",
    role: "Основной источник",
    note: "Квесты, предметы, статы, достижения, персонажи, механики. Англоязычная вики сообщества; часть страниц устарела или расходится с текущей сборкой.",
  },
  {
    name: "Pimez Compendium",
    url: "https://docs.google.com/spreadsheets/d/1QZY5F3jOEPXI_Wsaz3NfGvQXgpZS3MNWwupucf9K_WU/edit",
    role: "Таблицы статов",
    note: "HP/STA/ATK/DEF врагов и компаньонов, характеристики снаряжения. Использован для бестиария и таблиц; числовые значения могут меняться между патчами.",
  },
  {
    name: "LonaRPG Fandom (RU)",
    url: "https://lonarpg-ru.fandom.com/ru",
    role: "Русская терминология",
    note: "Помог с устоявшимися русскими названиями. Многие страницы неполные или устаревшие, поэтому использован как вспомогательный источник.",
  },
  {
    name: "Steam Community Guide",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2931086804",
    role: "Практика прохождения",
    note: "Маршруты, советы по боссам, экономика побега. Проверено на соответствие текущей версии.",
  },
  {
    name: "Файлы LonaRPG",
    url: "https://eccma417.itch.io/lonarpg",
    role: "Основа карты",
    note: "Мировая карта из игры (дамп тайлов) использована как основа интерактивного атласа. Тонирование, подписи и метки — наши; исходная графика принадлежит Eccma417.",
  },
  {
    name: "Архивные и китайские вики",
    url: "https://lonarpg.miraheze.org/wiki/Special:AllPages",
    role: "Вырезанный контент",
    note: "Старые ревизии, страницы неиспользуемых предметов и обсуждения разработчика. Помогли отделить удалённое от актуального.",
  },
];

export function SourcesView() {
  return (
    <div>
      <SectionHeader
        eyebrow="Архив"
        title="Источники и версии"
        description="Откуда взяты данные, что проверено и где возможны расхождения. Мы не выдаём вырезанное за игровое и помечаем спорные места."
        meta={
          <>
            <Badge tone="gold">Сборка {SITE.version}</Badge>
            <Badge tone="neutral">DEV {SITE.devDate}</Badge>
            <Badge tone="moss">Проверено вручную</Badge>
          </>
        }
      />

      <section className="mb-8">
        <SectionSubhead title="Где взять игру" aside="без пиратских зеркал" />
        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone="gold">Официально</Badge>
              <Badge tone="neutral">Windows / Linux</Badge>
              <Badge tone="moss">Demo бесплатно</Badge>
            </div>
            <h3 className="font-display text-xl text-parchment">Страница Eccma417</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Начинать стоит с бесплатного демо: оно полностью переведено на английский и показывает,
              нужен ли вам вообще этот жестокий симулятор выживания. Полная версия стоит $29, но на
              itch.io она больше не продаётся: актуальные реквизиты автор публикует на своей странице —
              мы переписали их справа.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href="https://eccma417.itch.io/lonarpg-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-moss/40 bg-moss/10 px-3 py-2.5 text-sm text-parchment transition hover:border-moss/70"
              >
                <span className="inline-flex items-center gap-2">
                  <Download className="h-4 w-4 text-moss" /> Скачать демо
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted/60">Free</span>
              </a>
              <a
                href="https://eccma417.itch.io/lonarpg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-gold/40 bg-gold/10 px-3 py-2.5 text-sm text-parchment transition hover:border-gold/70"
              >
                <span className="inline-flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-gold" /> Официальная страница
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted/60">itch.io</span>
              </a>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted/60">
              Там же лежат три канала сборок: Latest {SITE.version}, PrevStable {SITE.previous} и
              Unstable DEV {SITE.devDate}. Мы описываем Latest, но помечаем места, где DEV уже ушёл
              вперёд.
            </p>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-display text-lg text-parchment">
              <HeartHandshake className="h-4 w-4 text-[#d98a8a]" /> Покупка напрямую
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              Автор вынес продажи за пределы itch.io и принимает оплату напрямую. Ссылки и реквизиты —
              с его официальной страницы:
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed">
              <li>
                <span className="text-muted/55">USDT (TRC20), $29: </span>
                <code className="break-all text-[11px] text-gold/90">TK1ToRWM1iKkPwLEgWRPGn2L6wPtyn4LHz</code>
                <div className="text-[11px] text-muted/55">
                  После перевода отправьте TXN HASH на{" "}
                  <a href="mailto:eccm.a4@gmail.com" className="text-ember/80 hover:text-gold">
                    eccm.a4@gmail.com
                  </a>
                  .
                </div>
              </li>
              <li>
                <span className="text-muted/55">Карточка на Clusters: </span>
                <a
                  href="https://clusters.tw/profile/41217B6F-E6E1-4A29-8E2A-CA73773AB263/works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember/80 hover:text-gold"
                >
                  870 tier
                </a>
                <span className="text-muted/55"> — альтернативный способ поддержать автора.</span>
              </li>
            </ul>
            <p className="mt-3 border-t border-line/60 pt-2 text-[11px] leading-relaxed text-muted/60">
              Это не наша касса: мы просто переписали контакты с официальной страницы. Если что-то
              поменялось — доверяйте странице Eccma417, а не этому сайту.
            </p>
          </div>
        </div>

        <div className="mt-3 border border-line bg-white/[0.015] p-4">
          <div className="flex items-start gap-2 text-[12px] leading-relaxed text-muted">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
            <p>
              <span className="text-parchment/90">Про пиратство, честно.</span> Торренты с LonaRPG
              существуют. Вместе с ними существуют битые сборки, моды-трояны, переводы из 2014 года и
              версия, где половина диалогов — «?????». Мы не советуем ни торренты, ни «проверенные»
              сборки из комментариев. Автор годами пилит игру, а $29 — это примерно неделя кофе. Если
              денег нет — начните с демо, оно бесплатное и официальное.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-parchment">
            <BookOpen className="h-4 w-4 text-ember" /> Источники
          </h2>
          <div className="space-y-3">
            {sources.map((s) => (
              <div key={s.name} className="border-l-2 border-line pl-3">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-ember/90 hover:text-gold"
                  >
                    {s.name}
                  </a>
                  <Badge tone={s.role === "Основной источник" ? "gold" : "neutral"}>{s.role}</Badge>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-3">
          <div className="card p-5">
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg text-parchment">
              <ShieldCheck className="h-4 w-4 text-moss" /> Версии
            </h2>
            <dl className="space-y-2 text-[13px]">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted/50">Актуальная</dt>
                <dd className="font-display text-base text-parchment">{SITE.version}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted/50">Предыдущая стабильная</dt>
                <dd className="text-muted">{SITE.previous}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted/50">Дата DEV</dt>
                <dd className="text-muted">{SITE.devDate}</dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-line/60 pt-2 text-[11px] leading-relaxed text-muted/60">
              Патчи меняют баланс, цены и условия ачивок. Если вы играете на старой сборке, проверяйте
              числа в игре.
            </p>
          </div>

          <div className="card p-5">
            <h2 className="mb-2 font-display text-lg text-parchment">Метод</h2>
            <ul className="space-y-1.5 text-[12px] leading-relaxed text-muted">
              <li>• Переписываем, а не копируем: текст авторский.</li>
              <li>• Спорные данные помечаем, а не выдаём за факт.</li>
              <li>• Вырезанное отделено от актуального.</li>
              <li>• Числа сверены минимум по двум источникам, где возможно.</li>
            </ul>
          </div>

          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover flex items-center justify-between p-4"
          >
            <span>
              <span className="block text-sm text-parchment">Исходники сайта</span>
              <span className="block text-[10px] uppercase tracking-wider text-muted/50">GitHub</span>
            </span>
            <Github className="h-4 w-4 text-muted" />
          </a>
        </aside>
      </div>

      <section className="mt-8 space-y-3">
        <SectionSubhead title="Расхождения и оговорки" />
        <div className="grid gap-2 md:grid-cols-2">
          {[
            [
              "Названия предметов",
              "Miraheze иногда использует внутренние имена (Iron Shield), а в игре предмет называется иначе (Metal Shield). В карточках указаны оба варианта.",
            ],
            [
              "HP и статы врагов",
              "Зависят от сложности и мировой угрозы. Таблицы — базовые значения; на Hell/Doom они выше.",
            ],
            [
              "Цены",
              "Базовые цены указаны в TP. Торговля, WIS и репутация меняют итоговую сумму. Билет Эдварда — 20–30 GC.",
            ],
            [
              "Квестовые ветки",
              "Порядок квестов не всегда жёсткий. Некоторые задания закрываются, если выполнить другие. Пропускаемое отмечено.",
            ],
            [
              "Взрослый контент",
              "Часть механик доступна только при включённых фетишах. Мы описываем системы, а не сцены.",
            ],
            [
              "Моды и переводы",
              "Сайт описывает ванильную игру. Моды могут менять интерфейс, статы и доступность контента.",
            ],
          ].map(([title, text]) => (
            <div key={title} className="card p-4">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-gold/70">
                <Info className="h-3 w-3" /> {title}
              </div>
              <p className="text-[12px] leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="warn" title="Дисклеймер">
        Это неофициальный фанатский архив. LonaRPG создан Eccma417; права на игру и материалы
        принадлежат автору. Сайт не содержит файлов игры, читов или пиратских ссылок. Взрослый контент
        описан в ознакомительных целях для игроков 18+.
      </Callout>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] text-muted/50">
        <span className="inline-flex items-center gap-1">
          <AlertTriangle className="h-3.5 w-3.5 text-blood/60" /> Возможны неточности
        </span>
        <span>·</span>
        <a
          href={SITE.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-ember/70 hover:text-ember"
        >
          Miraheze <ExternalLink className="h-3 w-3" />
        </a>
        <span>·</span>
        <span>Обновлено: {SITE.devDate}</span>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Download,
  FolderTree,
  Github,
  Keyboard,
  Layers,
  MousePointerClick,
  Package,
  Puzzle,
  RotateCcw,
  ShieldAlert,
  Terminal,
  Wrench,
} from "lucide-react";
import { Badge, Callout, Disclosure, SectionHeader, SectionSubhead } from "../components/ui";
import { SITE } from "../lib/meta";
import { href } from "../lib/router";

/* ------------------------------------------------------------------ */
/*  Вспомогательные блоки                                             */
/* ------------------------------------------------------------------ */

function CopyButton({ text, label = "копировать" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 1800);
    } catch {
      setDone(false);
    }
  };

  return (
    <button
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 border border-line/80 bg-void/50 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted/60 transition hover:border-gold/40 hover:text-parchment"
    >
      {done ? <Check className="h-2.5 w-2.5 text-moss" /> : <Copy className="h-2.5 w-2.5" />}
      {done ? "скопировано" : label}
    </button>
  );
}

function CodeBlock({ title, code, lang }: { title?: string; code: string; lang?: string }) {
  return (
    <div className="my-3 min-w-0 overflow-hidden border border-line/80 bg-[#08070b]">
      <div className="flex items-center justify-between gap-3 border-b border-line/60 bg-white/[0.015] px-3 py-1.5">
        <span className="flex min-w-0 items-center gap-2 text-[8.5px] uppercase tracking-[0.18em] text-muted/45">
          <Terminal className="h-3 w-3 text-ember/60" />
          <span className="truncate">{title ?? lang ?? "code"}</span>
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto px-3.5 py-3 text-[11px] leading-[1.7] text-[#d7cdb9]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative border-l border-line/70 pb-5 pl-8 last:pb-0">
      <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center border border-gold/35 bg-abyss text-[10px] font-semibold tabular-nums text-gold/90">
        {n}
      </span>
      <h4 className="text-[13.5px] font-medium text-parchment">{title}</h4>
      <div className="mt-1 text-[12px] leading-relaxed text-muted/70">{children}</div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Контент                                                           */
/* ------------------------------------------------------------------ */

const MODS_DIR = "LonaRPG/ModScripts/_Mods";
const MOD_ID = "lonawiki_beacon";
const MOD_DOWNLOAD = `${import.meta.env.BASE_URL}mods/lonawiki-beacon.zip`;

const INI_SNIPPET = `[${MOD_ID}]
Banned=0
LoadOrder=0`;

const INFO_JSON = `{
  "id": "lonawiki_beacon",
  "version": "1.0.0",
  "name": "LonaWiki Beacon",
  "description": "F9 — открыть русский архив Ноэра в браузере.",
  "entry": "001_lonawiki_beacon.rb",
  "requires": { "LonaRPG": [">=", "0.10.8"] },
  "before": [],
  "thumbnail": ""
}`;

const HOOK_RUBY = `# Простейший хук: не заменяем метод, а оборачиваем его.
class Scene_Map
  alias mymod_update update

  def update
    mymod_update
    return unless Input.trigger?(:F9)
    # ваш код
  end
end`;

const INPUT_RUBY = `# :F5…:F9, :SHIFT, :CTRL, :ALT, :A…:Z — стандартные имена RGSS3.
if Input.trigger?(:F9) && !$game_message.visible
  # действие только в сцене карты и только по нажатию, не по удержанию
end`;

const TREE = `LonaRPG/
├─ Game.exe
├─ ModScripts/
│  ├─ 500_Mod_loader.rb
│  └─ _Mods/
│     └─ lonawiki_beacon/
│        ├─ _ModInfo.json
│        ├─ 001_lonawiki_beacon.rb
│        └─ README.txt
└─ UserData/
   ├─ GameMods.ini      ← Banned и LoadOrder
   └─ Save/             ← сюда не лезем`;

interface Faq {
  q: string;
  a: React.ReactNode;
}

const FAQ: Faq[] = [
  {
    q: "Мод не появился в менеджере. Что проверять?",
    a: (
      <>
        Папка должна лежать ровно в <code className="text-parchment/85">ModScripts/_Mods/</code>, а внутри неё —{" "}
        <code className="text-parchment/85">_ModInfo.json</code>. Частая ошибка — двойная вложенность вида{" "}
        <code className="text-parchment/85">_Mods/lonawiki_beacon/lonawiki_beacon/</code>. Также проверьте, что архив
        распакован, а не открыт прямо внутри проводника.
      </>
    ),
  },
  {
    q: "Игра запускается, но мод не работает",
    a: (
      <>
        Новые моды по умолчанию выключены: в <code className="text-parchment/85">UserData/GameMods.ini</code> у секции
        стоит <code className="text-parchment/85">Banned=1</code>. Поставьте <code className="text-parchment/85">0</code>,
        сохраните файл и полностью перезапустите игру. Если игра уже была открыта, она перезапишет ini при выходе.
      </>
    ),
  },
  {
    q: "Можно ли ставить моды на сохранение?",
    a: (
      <>
        Технически да, но сохранение может хранить ID карт, предметов и переменные, которых в вашей сборке нет. Перед
        установкой сделайте копию папки <code className="text-parchment/85">UserData/Save</code>. Если после удаления
        мода сохранение не грузится, возвращайте мод или откатывайтесь на резервную копию.
      </>
    ),
  },
  {
    q: "Почему мод открывает браузер, а не встроенное окно?",
    a: (
      <>
        RGSS3 не содержит полноценного браузера, а встраивать сторонний движок в игру — плохая идея для безопасности и
        производительности. Мод вызывает системный браузер через <code className="text-parchment/85">cmd /c start</code>.
        Никакие данные игры наружу не отправляются.
      </>
    ),
  },
  {
    q: "Где брать другие моды?",
    a: (
      <>
        Официальные примеры и исходники лежат в репозитории игры на GitGud. Сторонние сборки ищите на профильных
        форумах и в Discord-сообществах; перед установкой проверяйте код, особенно вызовы{" "}
        <code className="text-parchment/85">system</code>, <code className="text-parchment/85">eval</code> и{" "}
        <code className="text-parchment/85">load</code>.
      </>
    ),
  },
  {
    q: "Мод сломал игру. Как удалить?",
    a: (
      <>
        Поставьте <code className="text-parchment/85">Banned=1</code> в его секции или удалите папку из{" "}
        <code className="text-parchment/85">_Mods</code>. Если игра не запускается, удалите секцию мода из{" "}
        <code className="text-parchment/85">GameMods.ini</code> целиком. Перед правкой ini закройте игру.
      </>
    ),
  },
];

const FEATURES = [
  {
    icon: Package,
    title: "Один файл",
    text: "Скрипт не трогает базу данных, карты и сохранения: только перехватывает F9 на карте.",
  },
  {
    icon: Keyboard,
    title: "Горячая клавиша",
    text: "F9 открывает архив в системном браузере. Работает в оконном и полноэкранном режиме.",
  },
  {
    icon: ShieldAlert,
    title: "Без сети из игры",
    text: "Игра не отправляет статистику и не читает ваши файлы. Открывается обычная ссылка.",
  },
];

/* ------------------------------------------------------------------ */
/*  Компонент                                                          */
/* ------------------------------------------------------------------ */

export function ModsView() {
  const faq = useMemo(() => FAQ, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Расширения"
        title="Моды LonaRPG"
        description="Как устроен загрузчик модов, где лежат ModScripts и GameMods.ini, чем отличается старый формат от _ModInfo.json и как поставить безопасный вики-мод с горячей клавишей."
        meta={
          <>
            <Badge tone="gold">UMM · ModScripts</Badge>
            <Badge tone="neutral">RGSS3</Badge>
            <Badge tone="frost">
              <Download className="h-3 w-3" /> вики-мод 4 КБ
            </Badge>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted/45">сборка {SITE.version}</span>
          </>
        }
      />

      <Callout tone="danger" title="Сначала — резервная копия">
        Моды — неофициальные, автор игры их не поддерживает. Сохраните папку{" "}
        <code className="text-parchment/85">UserData/Save</code> и, если правите вручную, файл{" "}
        <code className="text-parchment/85">UserData/GameMods.ini</code>. Конфликт двух модов может испортить прохождение
        без сообщения об ошибке.
      </Callout>

      {/* Быстрый старт */}
      <section id="install" className="mt-8 scroll-mt-24">
        <SectionSubhead title="Установка вики-мода" aside="2 минуты · Windows" />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="border border-line/80 bg-white/[0.012] p-4 sm:p-5">
            <ol className="mt-1">
              <Step n={1} title="Скачайте архив и распакуйте его">
                Внутри — папка <code className="text-parchment/85">lonawiki_beacon</code>. Извлеките её целиком, не
                переименовывая файлы внутри.
              </Step>
              <Step n={2} title="Положите папку в ModScripts/_Mods">
                Итоговый путь:{" "}
                <code className="text-parchment/85">
                  {MODS_DIR}/{MOD_ID}/
                </code>
                . Внутри должны лежать <code className="text-parchment/85">_ModInfo.json</code> и{" "}
                <code className="text-parchment/85">001_lonawiki_beacon.rb</code>.
              </Step>
              <Step n={3} title="Включите мод">
                Откройте встроенный менеджер модов, если он есть в вашей сборке, и переключите{" "}
                <span className="text-parchment/85">LonaWiki Beacon</span> в активное состояние. Либо впишите секцию в{" "}
                <code className="text-parchment/85">UserData/GameMods.ini</code> вручную.
              </Step>
              <Step n={4} title="Перезапустите игру полностью">
                Не «Загрузить игру» из меню, а закрыть процесс и запустить{" "}
                <code className="text-parchment/85">Game.exe</code> заново. На карте нажмите{" "}
                <kbd className="border border-line bg-void px-1.5 py-0.5 text-[10px] text-parchment/85">F9</kbd>.
              </Step>
            </ol>

            <div className="mt-4 border-t border-line/60 pt-4">
              <div className="mb-2 flex items-center gap-2 text-[8.5px] uppercase tracking-[0.2em] text-muted/45">
                <Terminal className="h-3 w-3 text-ember/60" /> ручное включение
              </div>
              <CodeBlock title="UserData/GameMods.ini" code={INI_SNIPPET} />
              <p className="text-[10.5px] leading-relaxed text-muted/45">
                <span className="text-parchment/70">Banned=0</span> — мод включён. <span className="text-parchment/70">LoadOrder</span>{" "}
                задаёт порядок загрузки: меньшее число загружается раньше. Если секции нет, игра создаст её сама при
                следующем запуске с <span className="text-parchment/70">Banned=1</span>.
              </p>
            </div>
          </div>

          <aside className="space-y-3">
            <a
              href={MOD_DOWNLOAD}
              download
              className="group block border border-gold/35 bg-gradient-to-br from-gold/[0.1] via-ember/[0.04] to-transparent p-4 transition hover:border-gold/60"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gold/80">
                  <Package className="h-3.5 w-3.5" /> LonaWiki Beacon
                </span>
                <Download className="h-4 w-4 text-gold/70 transition group-hover:translate-y-0.5" />
              </div>
              <div className="mt-2 font-display text-[1.35rem] leading-tight text-parchment">
                Вики-мод для LonaRPG
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted/65">
                F9 открывает русский архив Ноэра. Один Ruby-файл, без зависимостей и изменения базы игры.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[9px] uppercase tracking-[0.1em]">
                <span className="border border-line/70 px-1.5 py-0.5 text-muted/60">v1.0.0</span>
                <span className="border border-line/70 px-1.5 py-0.5 text-muted/60">zip</span>
                <span className="border border-moss/35 bg-moss/[0.07] px-1.5 py-0.5 text-moss/90">F9</span>
              </div>
            </a>

            <div className="border border-line/80 bg-white/[0.012] p-4">
              <div className="mb-2 flex items-center gap-2 text-[8.5px] uppercase tracking-[0.2em] text-muted/45">
                <FolderTree className="h-3 w-3 text-ember/60" /> структура
              </div>
              <pre className="min-w-0 overflow-x-auto text-[10px] leading-[1.7] text-muted/65">
                <code>{TREE}</code>
              </pre>
            </div>

            <div className="border border-line/70 px-4 py-3">
              <div className="flex items-start gap-2 text-[10.5px] leading-relaxed text-muted/55">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember/60" />
                Ссылка ведёт на статический файл этого сайта. Проверять содержимое архива перед запуском всё равно
                полезно — как и у любого мода.
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Что умеет */}
      <section className="mt-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-line/70 bg-white/[0.012] px-4 py-3.5">
              <div className="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-ember/80">
                <Icon className="h-3.5 w-3.5" />
                {title}
              </div>
              <p className="text-[11.5px] leading-relaxed text-muted/65">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Устройство загрузчика */}
      <section id="loader" className="mt-10 scroll-mt-24">
        <SectionSubhead title="Как устроен загрузчик" aside="ModScripts · GameMods.ini" />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 border border-line/80 bg-white/[0.012] p-4">
            <h3 className="flex items-center gap-2 font-display text-[1.2rem] text-parchment">
              <Layers className="h-4 w-4 text-gold/70" /> Два формата модов
            </h3>
            <div className="mt-3 space-y-3 text-[12px] leading-relaxed text-muted/70">
              <p>
                <span className="text-parchment/90">Старый формат.</span> Папка с любыми{" "}
                <code className="text-parchment/85">.rb</code> и необязательным{" "}
                <code className="text-parchment/85">info.txt</code>. Загрузчик выполняет все скрипты из папки в
                алфавитном порядке. Ни версии, ни зависимостей, ни точки входа.
              </p>
              <p>
                <span className="text-parchment/90">Новый формат.</span> Файл{" "}
                <code className="text-parchment/85">_ModInfo.json</code> с id, версией, точкой входа и зависимостями.
                Если указан <code className="text-parchment/85">entry</code>, загружается только он; иначе — все{" "}
                <code className="text-parchment/85">.rb</code> по порядку. Поле{" "}
                <code className="text-parchment/85">preload</code> выполняется раньше остальных модов.
              </p>
              <p>
                Менеджер хранит состояние в <code className="text-parchment/85">UserData/GameMods.ini</code>. Для каждой
                папки есть <code className="text-parchment/85">Banned</code> (1 — выключен) и{" "}
                <code className="text-parchment/85">LoadOrder</code>. Порядок важен: мод, который патчит чужой метод,
                должен загружаться после мода, который этот метод объявил.
              </p>
            </div>
          </div>

          <div className="min-w-0 border border-line/80 bg-white/[0.012] p-4">
            <h3 className="flex items-center gap-2 font-display text-[1.2rem] text-parchment">
              <Wrench className="h-4 w-4 text-gold/70" /> Схема _ModInfo.json
            </h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[360px] border-collapse text-[10.5px]">
                <thead>
                  <tr className="border-b border-line/70 text-left text-[8px] uppercase tracking-[0.14em] text-muted/40">
                    <th className="py-1.5 pr-3 font-medium">Поле</th>
                    <th className="py-1.5 font-medium">Назначение</th>
                  </tr>
                </thead>
                <tbody className="text-muted/65">
                  {[
                    ["id", "Уникальный идентификатор; совпадение ID блокирует загрузку"],
                    ["version", "Версия для проверок requires"],
                    ["name / description", "Название и описание в менеджере"],
                    ["entry", "Один Ruby-файл вместо загрузки всех .rb"],
                    ["preload", "Скрипт, который выполняется до основных модов"],
                    ["requires", "Зависимости: { \"LonaRPG\": [\">=\", \"0.10.8\"] }"],
                    ["before", "ID модов, которые должны грузиться позже"],
                    ["texts", "Папка с локализацией для $game_text"],
                    ["thumbnail", "Картинка предпросмотра в менеджере"],
                  ].map(([field, desc]) => (
                    <tr key={field} className="border-b border-line/30 last:border-b-0">
                      <td className="py-1.5 pr-3 font-mono text-[10px] text-gold/75">{field}</td>
                      <td className="py-1.5 leading-snug">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock title="Пример _ModInfo.json" code={INFO_JSON} lang="json" />
          </div>
        </div>
      </section>

      {/* Свой мод */}
      <section id="code" className="mt-10 scroll-mt-24">
        <SectionSubhead title="Свой мод за пять минут" aside="RGSS3 · Ruby" />

        <div className="space-y-3">
          <div className="min-w-0 border border-line/80 bg-white/[0.012] p-4">
            <p className="text-[12px] leading-relaxed text-muted/70">
              LonaRPG работает на RPG Maker VX Ace (RGSS3). Мод — это Ruby-скрипт, который загружается после основной
              игры и может переопределять классы и методы. Главное правило: не переписывать метод целиком, а оборачивать
              его через <code className="text-parchment/85">alias</code>. Тогда чужие моды и обновления игры с меньшей
              вероятностью конфликтуют.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="min-w-0">
                <div className="mb-1 text-[8.5px] uppercase tracking-[0.18em] text-ember/75">Хук сцены</div>
                <CodeBlock title="001_my_mod.rb" code={HOOK_RUBY} lang="ruby" />
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-[8.5px] uppercase tracking-[0.18em] text-ember/75">Ввод</div>
                <CodeBlock title="Input" code={INPUT_RUBY} lang="ruby" />
              </div>
            </div>
            <Callout tone="warn" title="Проверяйте сцены">
              <code className="text-parchment/85">Scene_Map#update</code> вызывается каждый кадр. Не запускайте в нём
              тяжёлые операции и не открывайте окна без проверки{" "}
              <code className="text-parchment/85">Input.trigger?</code> — игра начнёт дублировать действия.
            </Callout>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="border border-line/70 px-4 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.18em] text-moss/80">
                <Check className="h-3 w-3" /> безопасно
              </div>
              <p className="text-[11px] leading-relaxed text-muted/60">
                Новые методы, alias, чтение состояния игры, свои окна и звуки.
              </p>
            </div>
            <div className="border border-line/70 px-4 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.18em] text-ember/80">
                <AlertTriangle className="h-3 w-3" /> осторожно
              </div>
              <p className="text-[11px] leading-relaxed text-muted/60">
                Патч базы данных, карт и общих событий, изменение сохранений, порядок загрузки.
              </p>
            </div>
            <div className="border border-line/70 px-4 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.18em] text-blood/80">
                <ShieldAlert className="h-3 w-3" /> опасно
              </div>
              <p className="text-[11px] leading-relaxed text-muted/60">
                <code className="text-parchment/70">eval</code> чужого кода, скачивание файлов,{" "}
                <code className="text-parchment/70">system</code> с непроверенными аргументами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-10 scroll-mt-24">
        <SectionSubhead title="Если что-то пошло не так" aside={`${faq.length} вопросов`} />
        <div className="border border-line/80 bg-white/[0.012] px-4">
          {faq.map((item) => (
            <Disclosure key={item.q} title={item.q}>
              <div className="text-[12px] leading-relaxed text-muted/70">{item.a}</div>
            </Disclosure>
          ))}
        </div>
      </section>

      {/* Ссылки */}
      <section className="mt-9 grid gap-3 sm:grid-cols-3">
        <a
          href="https://gitgud.io/eccma417/lonarpg_code"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 border border-line/80 bg-white/[0.012] px-4 py-3.5 transition hover:border-gold/40"
        >
          <Github className="mt-0.5 h-4 w-4 shrink-0 text-ember/70" />
          <span>
            <span className="block text-[12px] text-parchment/90">Исходники игры</span>
            <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted/50">
              Скрипты, примеры модов и загрузчик на GitGud
            </span>
          </span>
          <ArrowUpRight className="ml-auto mt-0.5 h-3.5 w-3.5 shrink-0 text-muted/30 transition group-hover:text-gold" />
        </a>
        <a
          href={href("mechanics")}
          className="group flex items-start gap-3 border border-line/80 bg-white/[0.012] px-4 py-3.5 transition hover:border-gold/40"
        >
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-ember/70" />
          <span>
            <span className="block text-[12px] text-parchment/90">Механики игры</span>
            <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted/50">
              Статы, бой, крафт и состояние персонажа
            </span>
          </span>
          <ArrowUpRight className="ml-auto mt-0.5 h-3.5 w-3.5 shrink-0 text-muted/30 transition group-hover:text-gold" />
        </a>
        <a
          href={href("sources")}
          className="group flex items-start gap-3 border border-line/80 bg-white/[0.012] px-4 py-3.5 transition hover:border-gold/40"
        >
          <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-ember/70" />
          <span>
            <span className="block text-[12px] text-parchment/90">Источники и версии</span>
            <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted/50">
              Откуда взяты данные и что изменилось
            </span>
          </span>
          <ArrowUpRight className="ml-auto mt-0.5 h-3.5 w-3.5 shrink-0 text-muted/30 transition group-hover:text-gold" />
        </a>
      </section>

      <div className="mt-6 flex items-start gap-2.5 border-l-2 border-line/80 px-3 py-2 text-[10.5px] leading-relaxed text-muted/40">
        <RotateCcw className="mt-0.5 h-3 w-3 shrink-0 text-muted/35" />
        Вики-мод не связан с автором LonaRPG и не меняет баланс. Если после обновления игры скрипт перестал работать,
        удалите его и проверьте актуальность раздела — мы обновляем инструкцию вместе с архивом.
      </div>
    </div>
  );
}

# 🚀 Инструкция по публикации на GitHub

## Шаг 1: Создайте репозиторий

1. Перейдите на https://github.com/new
2. Заполните:
   - **Repository name**: `lonarpg-wiki`
   - **Description**: `LonaRPG Wiki — Полное руководство по игре`
   - **Public**
   - ❌ НЕ ставьте галочки "Add README", "Add .gitignore", "Choose license"
3. Нажмите **Create repository**

## Шаг 2: Опубликуйте код

После создания репозитория выполните в терминале:

```bash
# Инициализация Git
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "LonaRPG Wiki — Полное руководство v2.0"

# Переименование ветки
git branch -M main

# Добавление удалённого репозитория (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/lonarpg-wiki.git

# Публикация
git push -u origin main
```

## Шаг 3: Включите GitHub Pages

1. Перейдите в настройки: `https://github.com/YOUR_USERNAME/lonarpg-wiki/settings/pages`
2. В разделе **Build and deployment**:
   - **Source**: выберите **GitHub Actions**
3. Workflow уже настроен в `.github/workflows/deploy.yml`
4. После push сайт автоматически задеплоится

## Шаг 4: Доступ к сайту

После успешного деплоя Wiki будет доступна по адресу:

```
https://YOUR_USERNAME.github.io/lonarpg-wiki/
```

Первый деплой занимает 2-5 минут.

## 🔧 Решение проблем

### Проблема: Страница не загружается (404)

Добавьте `base` в `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/lonarpg-wiki/', // Имя вашего репозитория
})
```

Затем:
```bash
npm run build
git add .
git commit -m "Fix base path"
git push
```

### Проблема: GitHub Actions не запускается

1. Settings → Actions → General → Workflow permissions
2. Выберите "Read and write permissions"

## 📊 Что включено в Wiki

- ✅ 11 разделов (Главная, Новичкам, Квесты, Билды, Оружие, Персонажи, Лор, Локации, Концовки, Механики, Секреты)
- ✅ 53+ квестов с детальным описанием
- ✅ 40+ видов оружия в таблицах
- ✅ 15+ персонажей с описанием характера и отношения в комьюнити
- ✅ Полный лор мира (расы, фракции, история)
- ✅ 6 локаций с описанием
- ✅ Все концовки с условиями
- ✅ Все механики (бой, заработок, рабство, сложность)
- ✅ Секреты и пасхалки
- ✅ Адаптивный дизайн (мобильные, планшеты, десктоп)
- ✅ Красивый современный интерфейс
- ✅ GitHub Actions для автоматического деплоя

## 📁 Структура проекта

```
lonarpg-wiki/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions
├── src/
│   ├── App.tsx                 # Главный компонент (все разделы)
│   ├── index.css               # Стили
│   └── main.tsx                # Точка входа
├── public/                     # Статические файлы
├── dist/                       # Собранный проект
├── index.html                  # HTML шаблон
├── package.json                # Зависимости
├── vite.config.ts              # Конфигурация Vite
├── tailwind.config.js          # Конфигурация Tailwind
├── tsconfig.json               # Конфигурация TypeScript
├── README.md                   # Документация
├── DEPLOY_INSTRUCTIONS.md      # Эта инструкция
└── .gitignore                  # Игнорируемые файлы
```

## 🔄 Обновление сайта

Для обновления Wiki:

```bash
# Внесите изменения
git add .
git commit -m "Update: описание изменений"
git push
```

GitHub Actions автоматически пересоберёт и задеплоит сайт.

## 📝 Альтернативный способ: через GitHub CLI

Если установлен GitHub CLI:

```bash
# Создайте репозиторий
gh repo create lonarpg-wiki --public --description "LonaRPG Wiki"

# Опубликуйте
git init
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## ✅ Готово!

После выполнения всех шагов ваша Wiki будет доступна онлайн и автоматически обновляться при каждом push.

---

**Удачи с публикацией! 🎉**

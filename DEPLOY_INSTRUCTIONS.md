# 📋 Инструкция по публикации на GitHub

## Шаг 1: Создание репозитория на GitHub

### Вариант А: Через веб-интерфейс (рекомендуется)

1. Перейдите на https://github.com/new
2. Заполните:
   - **Repository name**: `lonarpg-wiki` (или любое другое имя)
   - **Description**: `LonaRPG Wiki — Полное руководство по игре`
   - **Public** (или Private)
   - ❌ НЕ ставьте галочку "Add a README file" (у нас уже есть свой)
   - ❌ НЕ ставьте галочку "Add .gitignore"
   - ❌ НЕ ставьте галочку "Choose a license"
3. Нажмите **Create repository**

### Вариант Б: Через GitHub CLI

```bash
gh repo create lonarpg-wiki --public --description "LonaRPG Wiki — Полное руководство по игре"
```

## Шаг 2: Инициализация Git и публикация

После создания репозитория выполните следующие команды в терминале:

```bash
# Инициализация Git (если ещё не инициализирован)
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: LonaRPG Wiki"

# Переименование ветки в main
git branch -M main

# Добавление удалённого репозитория (замените YOUR_USERNAME на ваш логин GitHub)
git remote add origin https://github.com/YOUR_USERNAME/lonarpg-wiki.git

# Публикация
git push -u origin main
```

## Шаг 3: Включение GitHub Pages

### Автоматический деплой (рекомендуется)

1. Перейдите в настройки репозитория: `https://github.com/YOUR_USERNAME/lonarpg-wiki/settings/pages`
2. В разделе **Build and deployment**:
   - **Source**: выберите **GitHub Actions**
3. Workflow уже настроен в файле `.github/workflows/deploy.yml`
4. После push в ветку `main` сайт автоматически задеплоится

### Ручной деплой (альтернатива)

1. Перейдите в настройки: `Settings → Pages`
2. **Source**: выберите **Deploy from a branch**
3. **Branch**: выберите `main` и папку `/dist`
4. Нажмите **Save**

⚠️ **Важно**: Для ручного деплоя нужно сначала собрать проект (`npm run build`) и запушить папку `dist`.

## Шаг 4: Доступ к сайту

После успешного деплоя Wiki будет доступна по адресу:

```
https://YOUR_USERNAME.github.io/lonarpg-wiki/
```

Первый деплой может занять 2-5 минут.

## 🔧 Решение проблем

### Проблема: Страница не загружается (404)

**Решение**: Добавьте `base` в `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/lonarpg-wiki/', // Замените на имя вашего репозитория
})
```

Затем пересоберите и запушьте:
```bash
npm run build
git add .
git commit -m "Fix base path for GitHub Pages"
git push
```

### Проблема: GitHub Actions не запускается

**Решение**: 
1. Убедитесь, что workflow файл находится в `.github/workflows/deploy.yml`
2. Проверьте, что Settings → Actions → General → Workflow permissions → "Read and write permissions"

### Проблема: Белый экран после деплоя

**Решение**: Проверьте консоль браузера (F12). Скорее всего проблема с путями к ресурсам. Добавьте `base` в `vite.config.ts` как описано выше.

## 📁 Структура проекта

```
lonarpg-wiki/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions для деплоя
├── src/
│   ├── App.tsx                 # Главный компонент
│   ├── index.css               # Стили
│   ├── main.tsx                # Точка входа
│   └── data/                   # Данные (квесты, предметы, персонажи)
│       ├── quests.ts
│       ├── items.ts
│       └── characters.ts
├── public/                     # Статические файлы
├── dist/                       # Собранный проект (генерируется)
├── index.html                  # HTML шаблон
├── package.json                # Зависимости
├── vite.config.ts              # Конфигурация Vite
├── tailwind.config.js          # Конфигурация Tailwind
├── tsconfig.json               # Конфигурация TypeScript
├── README.md                   # Документация
└── .gitignore                  # Игнорируемые файлы
```

## 🔄 Обновление сайта

Для обновления Wiki просто внесите изменения и запушьте:

```bash
# Внесите изменения в код
git add .
git commit -m "Update: описание изменений"
git push
```

GitHub Actions автоматически пересоберёт и задеплоит сайт.

## 📊 Статистика проекта

- **10 разделов** Wiki
- **53+ квестов** с детальным описанием
- **40+ видов оружия** в таблицах
- **15+ персонажей** с описаниями
- **6 локаций** с подробностями
- **Полностью адаптивный дизайн** (мобильные, планшеты, десктоп)

---

**Удачи с публикацией! 🚀**

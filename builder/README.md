# SHRI

# SHRI School CI Server

### Node.js version 12.16.1

## Getting started

```bash
cd $dir && npm ci #dirs = [server, agent]
```

Для разработки используется nodemon

```bash
npm run dev # запуск сервиса в дев режиме
npm run dev:debug # запуск сервиса в дебаг режиме
npm run start # запуск сервиса
```

Также используется eslint на уровне всего билдера для этого нужно в папке builder выполнить

```bash
npm i
npm run lint # запустить линтера для всего проекта билдера
```

## About

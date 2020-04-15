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

Конфигурация билд-сервера

```js
// файл server/server-conf.json
{
    "port": 12345,
    "apiBaseUrl": "https://hw.shri.yandex/api/",
    "apiToken": "asdfgh"
}

// либо передать переменные окружения
PORT=12345
API_BASE_URL="https://hw.shri.yandex/api/"
API_TOKEN="asdfgh"
```

Конфигурация билд-агента

```js
// файл agent/agent-conf.json
{
    "port": 12345,
    "serverHost": "127.0.0.1",
    "serverPort": 8080
}

// либо передать переменные окружения
PORT=12345
SERVER_HOST="127.0.0.1"
SERVER_PORT=8080
```

## About

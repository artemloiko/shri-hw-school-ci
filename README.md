# SHRI School CI

### Node.js version 12.16.1

## Перед началом работы

```bash
npm install
cd client && npm install
cd server && npm install
```

В корне проекта создайте файл .env с полями

```conf
PORT=3001
STORAGE_URL=https://hw.shri.yandex/api/ # URL вашего хранилища
STORAGE_API_KEY=your_api_key # your_api_key - apiKey от вашего хранилища
```

Токен можно получить здесь -> https://hw.shri.yandex/  
Нужно будет войти через гитхаб

### Начало работы в [client](client/README.md)

### Начало работы в [server](server/README.md)

Для запуска в режиме разработки нужно запустить паралельно сервер и клиент.  
Подробности по запуску каждого выше.

Для запуска в режиме прода нужно сбилдить клиент и запустить сервер в режиме прода.

### Комманды для быстрого запуска

```bash
npm run dev # паралельный запуск клиента и сервера в дев режимах
npm run prod # запуск сервера в прод режиме с SSR клиента
```

### Подробности о тестировании в [TESTING.md](TESTING.md)

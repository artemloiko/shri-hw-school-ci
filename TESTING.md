# README по тестированию

### Как запустить тесты

Для запуска юнит тестов клиента

```bash
cd client
npm run test
```

Для запуска юнит тестов сервера

```bash
cd server
npm run test
```

### Из каких логических блоков состоит ваше приложение и какие их сценарии вы проверяете модульными тестами?

#### Юнит тесты на клиенте

Логические блоки:

- Redux.
  Его в свою очередь можно разбить на отдельные блоки по редьюсерам, в моем случае это будут логические блоки редакса

  - builds
  - buildsDetails
  - settings
    Внутри которых я буду тестировать различные сценарии этих блоков.  
    Сценариями в данном случае будут являтся проверки с использованием различных actions.
    Например:
    - action на обновление списка билдов
    - action на отправку запроса за настройками
    - action на успешное получение настроек и т.д.
    - Проверка thunk actions, выполнение асинхронных операция thunk actions и проверка того что в стор пришли все необходимые экшены.

- Компоненты. В данном случае покрытие может быть не полное, т.к. я хочу попробовать покрыть часть компонентов для практики.
  (Было бы круто пару получить несколько комментариев по тестам для компонентов)  
  В моем случае я планирую покрыть юнит тестами компоненты из папки base. И проверять я буду:

  - правильный рендеринг (с помощью snapshots)
  - работу с событиями (в компоненте Input)

- Утилиты. Это просто проверка вспомогательных функций из папки utils.
  Сценариями в данном случае будут зависить от самой функции.  
  Например для функции bem-cn создающий бэм классы будут следующие сценарии
  - работа с дефолтными параметрами
  - добавление модификаторов работает правильно
  - добавление миксов работает правильно
  - работа с неправильными параметрами

#### Юнит тесты на сервере

Логические блоки для юнит тестирования:

- config  
  Сценарии:

  - бросает ошибку когда нет обязательных переменных
  - подставляет определенные переменнеы по дефолту

- Сервисы. Каждый сервис будет представлять из себя отдельный блок.
  Сценариями будут является все публичные методы каждого из сервисов.

- Модель очереди buildQueue. Сценариями будут её публичные методы и проверятся будет её внутреннее состояние.

- Функция обработки очереди.  
  Сценарии:

  - при отсуствии элементов в очереди ничего не делает
  - реагирует на добавление элементов в очередь
  - отправляет в хранилище все запросы (старт, финиш)
  - в хранилище отправляются данные в правильном формате

- Класс крона для синхронизации коммита.  
  Сценарии:

  - метод init() с заданными в хранилище настройками и без
  - метод update() с различными настройками

### Какие сценарии вы проверяете интеграционными тестами?

Интеграционные тесты будут проверять:

- Взаимодействие юзера с клиентом
  - Отображение главной страницы с историей коммитов
  - Сохранение настроек.
  - Создание нового билда. (Кнопка run build)
  - Кнопка ребилд на деталях билда.
- Тестирование node.js api c помощью jest и supertest.  
  Сценария будет проверка всех ручек апи.
# SHRI School CI

## Можно брать в разбор домашки.

## Getting started

```bash
cd client
npm install
```

Проект был развернут с [Create React App](https://github.com/facebook/create-react-app).

Стандартные его комманды для запуска

`npm start`  
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

`npm test`  
Launches the test runner in the interactive watch mode.

`npm run build`  
Builds the app for production to the `build` folder.

## About (Описание моих решений)

### Главная страница

При загрузке SPA отправляется запрос за настройками и показывается прелоадер.
Данные хранятся в оперативке, т.е. при перезагрузке пойдет снова запрос.

### Настройки репозитория

Если в сторе нет данных по настройкам, то так же как на главной странице
отправляется запрос за настройками и показывается прелоадер.  
После этого отрисовываетс форма с исходными настройками если они были получены.  
Для работы с формой был использован Formik. Ошибки валидации полученые в formik вывожу под формой красным текстом.
В дополнение к нему используется валидация инпутов HTML5 (required, pattern), для большей наглядности.

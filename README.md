# SHRI School CI

## Можно брать в разбор домашки.

## Build

Gulp собирает стили и копирует HTML
из SRC в папку dist во время разработки.
В папке build находятся итоговые собранные файлы.

## Вопросы (Верстка)

В проекте использовал следующую БЭМ запись
.block-name\_\_elem-name_mod-value_mod-value

Правильное использование БЭМ-сущностей

- какие части макета являются одним и тем же блоком?  
  Блок это функционально и логически независымй компонент страницы, который может быть переиспользован.
  Пример выделеных мною блоков (скрин - https://yadi.sk/i/4fsmIbXV-DWqqA):

  - Хедер (header)
  - Футер (footer)
  - Блок иконки с текстом (icon-text)
  - Блок поля формы (textfield)
  - Блок инпута (input)
  - Блок кнопки (button)
  - Блок контейнера (container)
  - Блок с некоторыми стилями layout (page)
  - Карточка (card) и на основании её карточка с результатами запуска CI (card-ci-run).
  - Блок типографики, в нем находятся стили по тексту. Я его использую как отдельный блок на странице настроек, так и применяя блок глобально на страницу и где-то походу страницы применяю элементы этого блока. (typography)
    Например: на body повесил typography, а в хедере через typography\_\_headline применил стили элемента.

- какие стили относятся к блокам, а какие к элементам и модификаторам?  
  Блок состоит из стилей задающих его поведение и инкапсулированных внутри него.  
  Т.е. это такая реализацию которая полностью логически определяет его и его можно независимо использовать.
  Элемент (скрин - https://yadi.sk/i/xpEFAN_c_OzMlw) это состовная часть блока
  которая имеет смысл только внутри блока. С помощью элементов мы можем задавать
  стили которые имееют смысл только внутри этого блока.
  Модификатор (скрин - https://yadi.sk/i/xmLYhHTfw_9UlQ) используется для
  изменения определенного поведения блока. Может иметь несколько значений
  или логическое (есть/нет). Модификаторы стоит называть семантически.
  Например разные цвета у кнопки или наличие у нее иконки.

- где нужно использовать каскады и почему?  
  Их можно использовать, например, при изменении стилей элемента в зависимости от модификатора блока
  .block_modificator .block\_\_elem  
  Т.к. у элемента не может быть модификаторов и в тоже время элемент это составная часть блока, которой нет в отрыве от него, таким образом этот созданный каскад нет нужды перебивать где-либо еще.

Консистентность

- какие видите базовые и семантические константы?  
  Базовые константы могут быть: цвета, шрифты, скругления, тени, отступы, анимации.  
  В базовые константы я вытащил значения цветов, размеров шрифтов, отступов.

  Большинство цветов решил использовать в hex вытянув через пипетку,
  кроме нескольких мест где идет двойное наложение прозрачности.
  Например, в карточке в блоке с датой и временем, там 0.65 opacity,
  поверх блока icon-text, у которого уже есть своя прозрачность у элементов.
  Я к блоку icon-text применил цвета создаваемые прозрачностью на первом уровне наложения (т.е. просто color: серый цвет), а там где она на макете накладывается, поверх полученных серых цветов применял прозрачность.

  Размеры шрифтов указаны в константах, но line-height при этом задается почти везде в относительных к шрифту компонента величинах.

  В семантические выделил отступы контейнера, которые переиспользуются в нескольких блоках, кроме контейнера.
  Тени карточки и множество разнообразных цветов для футера, инпута, кнопок, карточки и т.д.

- какие видите закономерности в интерфейсе?  
  Довольно часто встречаются блоки которые на мобайле из flex row меняются в flex column, возможно это стоит сделать отдельным блоком, но это не точно.  
  Я нашел закономерность в одинаковом отступе от хедера и футера,
  на двух последних страницах и решил это применить на все страницы,
  т.к. явно там это не заметно, но в случае когда высота экрана будет уменьшаться они понадобатся.  
  Ввод инпута немного смещен, кажется что, что это сделано специально.

Адаптивность

- где видите вариативность данных и как это обрабатываете?  
  Кнопки с иконкой, они сворачиваются просто до иконки на мобайле.  
  Карточка результата запуска CI. Здесь может быть длинное название коммита,
  на десктопе я обрезаю и ставлю троеточие в обычной карточке,
  а на мобайле и на детализированной карточке, он переносится вниз.
  Также блоки с информацие о коммите, готовы к добавлению дополнительных блоков icon-text

- какие видите особенности, связанные с размером экрана?  
  Добавил брейкпоинты 480px и 768px. На 768 меняется layout и на 480 применяются мобильные стили.  
  Кнопки на странице настроек и истории растягиваются.  
  Кнопки с иконкой сворачиваются до размеров иконки.  
  На мобайл версии лог билда имеет горизонтальный скролл и расстянут на весь экран.

- что еще повлияло на вашу вёрстку?  
  На макетах в фигме вроде бы показывается какая-то сетка,
  но она практически бесполезна, учитывая что почти все блоки шириной на весь контейнер.
  А те что есть, ложатся на неё не очень хорошо. Поэтому решил использовать просто флекс, без гридов.  
  В firefox заметил, что тень сверху карточки сливается с фоном, поэтому увеличил ей размытие до 1.5px,
  чтобы не сильно отойти от стандарта и при этом её было видно.

### Мои вопросы

1. Я не понял в чем фишка отличающегося цвета иконок которые в кнопках с иконками. (Run build, Rebuild). В чате писали что так задумано, но зачем...

2. Подход с написанием стилей для блока card-ci-run, поверх блока card. (Т.е. чтобы все было красиво, мне нужно на карточку применять card card-ci-run). Не уверен насколько удачен такой подход, надеюсь такой вопрос разберут на разборе домашки. Т.е. в моем случае стили card-ci-run не будут работать без класса card, но с другой стороны и дублировать стили не хочется в card-ci-run, чтобы этот блок был полностью независим.

3. В моем случае я для вертикальных паддингов хедера и футера меняю значение переменной через медиа выражение в файле index.css (Пометил это место хэштегом #мойвопрос)  
   Вопрос в том, достаточно ли это очевидно или лучше так не делать, потому что другой человек может запутаться и не понять почему паддинги меняются и где это происходит?  
   Хотя с другой стороны мы не раскидываем медиа выражения по блокам, а меняем в одном месте.

$(document).ready(function () {
  //функция генерации алфавита

  function generate_keyboad() {
    var alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    var block = $(".keyboard_block .keyboard");
    block.html("");

    $.each(alphabet, function (index, value) {
      var letter = $('<button class="key"></button>');
      letter.html(value).prop("draggable", "true").attr("id", letter.html());
      block.append(letter);
    });
  }

  generate_keyboad();

  var wordlist = {}, //объект для хранения данных json
    inputs = $('input[type="radio"]'), //инпуты для выбора темы игры
    keys = $(".key"), // сгенерированная клава, что будет перетаскиваться
    target_area = $(".drop_field"), // цель назначения для перетаскиваемых клавиш
    theme_span = $("#theme"), // для отображения темы
    word_span = $("#word"), // для отображения слова
    choosen_theme = "", // выбранная тема с помощью инпутов
    random_word = "", //рандомное слово по теме
    answer = [], //массив-ответ, который меняеться по ходу игры
    words = []; // массив всех слов темы

  //достаем из файла .json данные

  $.getJSON("wordlist.json", function (data) {
    $.each(data, function (key, val) {
      wordlist[key] = val;
    });
  });

  //при выборе темы пользователем, печатаем ее и выбираем рандомное слово

  $.each(inputs, function () {
    $(this).on("change", function () {
      choosen_theme = $(this).val();
      words = Object.keys(wordlist[choosen_theme]);
      theme_span.html(choosen_theme);
      random_word = words[Math.floor(Math.random() * words.length)];
      answer = [];
      $.each(random_word.split(""), function (index) {
        // запись слова в массив и отображение
        let letter = $("<span></span>");
        if (random_word[index] == "-") letter.html("-");
        else letter.html("_");
        answer[index] = letter;
      });
      word_span.html(answer); // вставка угадываемого слова
      var dragged_elems = target_area.find(".key"); // находим все буквы, что таскались до этого
      if (dragged_elems) {
        // если они есть в поле
        $.each(dragged_elems, function () {
          $(this).removeAttr("disabled").removeClass("disabled"); // возобновление их активности
          $(".keyboard").append($(this)); // вставка обратно в клавиатуру
        });
      }
      target_area.find("h2.message").fadeIn(); // возобновление сообщения
    });
  });

  // делаем таргет целевым элементом

  target_area.on("dragover", function (e) {
    e.originalEvent.preventDefault();
  });

  // когда клавиша попадант на поле

  target_area.on("drop", function (e) {
    e.originalEvent.preventDefault();
    $(this).find("h2.message").fadeOut(); // исчезновение сообщения

    var data = e.originalEvent.dataTransfer.getData("text");
    console.log(data);
    var button = $("#" + data); // находим перетаскиваемую кнопку
    button.prop("disabled", "true").addClass("disabled"); // делаем перетаскиваемую кнопку деактивированой
    $(this).append(button); //вставляем в поле

    // если такая буква есть в слове, показываем

    $.each(random_word.split(""), function (index, value) {
      let letter = data.toLowerCase();
      if (value === letter)
        answer[index].html(letter).addClass("opened_letter");
    });
    word_span.html(answer);
  });

  $.each(keys, function () {
    $(this).on("dragstart", function (e) {
      e.originalEvent.dataTransfer.effectAllowed = "move";
      e.originalEvent.dataTransfer.dropEffect = "move";
      e.originalEvent.dataTransfer.setData("text", $(this).attr("id"));
    });
  });
});

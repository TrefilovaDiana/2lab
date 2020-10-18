var level = 1;
var field = document.getElementById("field");
//место, в которое добавляем номер уровня
var level_HTML = document.getElementById("level");
//индекс неправильной кнопки
var incorrect_button_index;

//максимальное время на уровень (в секундах)
var max_time_per_level = 9;
//оставшееся время (в секундах)
var left_time;
//переменная таймера
var timer;
var left_time_HTML = document.getElementById("timer");

//функция генерирующая случайное число
function randomInteger(min, max)
{
	return Math.round(min + (Math.random() * (max - min)));
}

//функция, которая генерирует случайный цвет в формате HSL
function randomColor()
{
	const h = randomInteger(0, 360);
	const s = randomInteger(0, 100);
	const l = randomInteger(0, 100);
	return [h,s,l];
}

//функция, которая задает цвет неправльной кнопки
function calcIncorrectColor(baseColor, level)
{
	//копия исходного цвета
	var incorrect_color = [baseColor[0], baseColor[1], baseColor[2]];
	var s = incorrect_color[1];
	var v = incorrect_color[2];

	//меняем насыщенность цвета
	if (s < 50)
	{
		s += 50 - 0.5*level;
	}
	else 
	{
		s += -50 + 0.5*level;
	}

	//меняем яркость цвета
	if (v < 50)
	{
		v += 50 - 0.5*level;
	}
	else{
		v += -50 + 0.5*level;
	}

	incorrect_color[1] = s;
	incorrect_color[2] = v;
	return incorrect_color;
}

//Перевод цвета в строку
function colorToString(color)
{
	return "hsl(" + color[0] + ", " + color[1] + "%, " + color[2] + "%)";
}

//функция определяющая закончилось ли время на уровень (вызываем ее каждую секунду)
function OnSecondPassed()
{
	var game_over = false;
	if (left_time <= 0)
	{
		alert('Время вышло! Игра окончена.');
		//игра окончена, сбрасываем таймер
		clearInterval(timer);
		game_over = true;
	}
	else left_time -= 1;
	//выводим оставшееся время
	left_time_HTML.innerText = left_time;
	if (game_over){
		level = 1;
		fillField(level, randomColor());
	}

		
}

//функция определяющая на ту ли кнопку мы нажали
function onSquareClick(button_index)
{
	if (button_index == incorrect_button_index)
	{
		level++;
	}
	else 
	{
		alert('Вы проиграли.');
		level = 1;
	}
	fillField(level, randomColor());
}

//Функция заполнения поля
function fillField(level, baseColor)
{
	const size = level + 1;
	//(очищаем весь HTML код внутри элемента)
	field.innerHTML = "";
	//сохраняем базовый цвет в строку
	var baseColorString = colorToString(baseColor);
	//вычисляем неправильный цвет
	var incorrect_color = calcIncorrectColor(baseColor, level)
	var incorrect_color_string = colorToString(incorrect_color);

	level_HTML.innerText = level;
	//прерываем предыдущий таймер, если он был
	if (timer != null)
		clearInterval(timer);
	//восстанавливаем запас времени
	left_time = max_time_per_level;
	//выводим время на экран
	left_time_HTML.innerText = left_time;
	//запускаем таймер
	timer = setInterval(OnSecondPassed, 1000);

	for(let i = 0; i < size; i++)
	{
		var column = document.createElement("div");
		column.className = "field-column";
		field.appendChild(column);
		for(let j = 0; j < size; j++)
		{
			var square = document.createElement("button");
			square.className = "field-button";
			square.style.backgroundColor = baseColorString;
			square.onclick = () => {
										onSquareClick(i * size + j);
									}
			column.appendChild(square);
		}
		
	}

	incorrect_button_index = randomInteger(0, size * size - 1);
	var column_index = Math.floor(incorrect_button_index / size);
	var button_index_in_column = incorrect_button_index % size;
	var correct_button = field.children[column_index].children[button_index_in_column];
	correct_button.style.backgroundColor = incorrect_color_string;
}


fillField(1, randomColor());
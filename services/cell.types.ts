import { IBaseEntity } from "@/models/IBaseEntity";


export default class CellTypes {
   static list : IBaseEntity[] = [
      {name: 'Выходной',               id: 0},
      {name: 'Сокращенный',            id: 1},
      {name: 'Перенесенный выходной',  id: 2},
      {name: 'Перенесенный рабочий',   id: 3},
      {name: 'Рабочий',                id: 4},
      {name: 'Отпуск',                 id: 5},
      {name: 'Больничный',             id: 6},
      {name: 'Без содержания',         id: 7},
      {name: 'Прогул',                 id: 8},
      {name: 'Вакансия',               id: 9},
      {name: 'Работа в выходной',      id: 10},
   ]
}
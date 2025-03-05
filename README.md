![Logo](https://iimg.su/s/29/OzASj8CZQmOPhMJ4LbGFLlyaEBBHeJ99V0L2zOeS.png)
## Управление проектами разработки
```bash
npm install
```
***Инициализация базы данных:***
Создает базу данных, применяет схему [Prisma](https://www.prisma.io/), выполняет миграцию данных, выполняет наполнение данными базы данных
```bash
npm run init
```
***Если база данных уже создана:***
Удаляет текущую базу данных, создает базу данных заново, применяет схему [Prisma](https://www.prisma.io/), выполняет наполнение данными базы данных
```bash
npx prisma migrate reset
```
Либо
```
npm run reinit
```
***Применить схему Prisma***
```bash
npx prisma migrate dev
```
***Наполнить данными базу данных***
```bash
npx prisma db seed
```
***Обновление версии призмы***
```bash
npm i --save-dev prisma@latest @prisma/client@latest
```
***Запуск локального MinIO***
```
.\minio.exe server D:\MinIO\
```

 Для работы с датами используется библиотека [Luxon](https://moment.github.io/luxon/#/)
 ```bash
 npm install --save luxon
 ```

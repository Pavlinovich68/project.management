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
> Для работы с датами используется библиотека [Luxon](https://moment.github.io/luxon/#/)
 ```bash
 npm install --save luxon
 ```
***Docker MinIO***
* Скачать и установить [Docker Desktop](https://www.docker.com/products/docker-desktop)
* Установить или обновить WSL. Если планируется использовать только Docker, достаточно установить актуальную версию WSL или обновить уже установленную. Для этого нужно запустить от имени администратора консоль «PowerShell» из контекстного меню кнопки «Пуск» и выполнить команду wsl --install. Чтобы проверить наличие обновлений WSL и произвести в случае необходимости их установку, следует выполнить команду wsl --update
* Включить Hyper-V. Для этого нужно открыть нажатием клавиш Win + R диалоговое окошко быстрого запуска, ввести в него команду optionalfeatures и нажать «ОК». В окне апплета «Компоненты Windows» отметить все элементы компонента «Hyper-V» и нажать кнопку «ОК». После этого будет предложено перезагрузить компьютер.
* Загрузить контейнер
```bash
docker pull minio/minio
```
* Запустите контейнер MinIO
Используйте команду docker run для запуска контейнера MinIO:
```bash  
docker run -p 9000:9000 -p 9001:9001 \
  --name minio \
  -v /path/to/local/data:/data \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  quay.io/minio/minio server /data --console-address ":9001"
```
* Создать корзину _**projectman**_
![Logo](https://iimg.su/s/29/OzASj8CZQmOPhMJ4LbGFLlyaEBBHeJ99V0L2zOeS.png)
### **Управление проектами разработки**
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
### **Применить схему Prisma**
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
### **Docker MinIO**
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

### 1. **Резервное копирование MinIO**

#### Шаги:
1. **Скачайте и установите `mc`:**
   - Скачать (https://dl.min.io/client/mc/release/windows-amd64/mc.exe)
   - Поместите `mc.exe` в удобную директорию, например, `C:\mc\`.

2. **Добавьте `mc` в переменную окружения PATH:**
   - Откройте "Переменные среды". Нажать клавиши Win+R на клавиатуре, ввести sysdm.cpl и нажать Enter. На вкладке «Дополнительно» нажать кнопку «Переменные среды»
   - В разделе "Системные переменные" найдите переменную `Path` и добавьте путь к директории с `mc.exe` (например, `C:\mc\`).

3. **Настройте `mc` для подключения к вашему MinIO-серверу:**
   Откройте командную строку (cmd) или PowerShell и выполните:
   ```bash
   mc alias set myminio http://localhost:9000 minioadmin minioadmin
   ```
   Здесь:
   - `myminio` — имя алиаса для вашего сервера.
   - `http://localhost:9000` — адрес вашего MinIO-сервера.
   - `ACCESS_KEY` и `SECRET_KEY` — ключи доступа к MinIO.

4. **Создайте резервную копию данных:**
   Выполните команды для копирования данных из бакета в локальную директорию:
   ```bash
   mc mirror myminio/projectman d:\MinIO\backup
   7z a -tzip -sdel d:\MinIO\backup.zip d:\MinIO\backup
   ```
### **Восстановление MinIO из резервной копии**
1. **Выполнить команды**
```
7z x d:\MinIO\backup.zip -od:\MinIO
mc mirror d:\MinIO\backup myminio/projectman
```
### **WikiJS**
```
docker run -d -p 8080:3000 --name wiki --restart unless-stopped -e "DB_TYPE=postgres" -e "DB_HOST=db" -e "DB_PORT=5432" -e "DB_USER=wikijs" -e "DB_PASS=wikijsrocks" -e "DB_NAME=wiki" ghcr.io/requarks/wiki:2
```
### **В случае если порт 3000 занят**

Выполнить команду:
```bash
netstat -ano | findstr :3000
```
В ответе такого вида:
```bash
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       6616
TCP    [::]:3000              [::]:0                 LISTENING       6616
```
Найти илентификатор процесса удерживающего порт (в указанном случае 6616) и выполнить:
```bash
tskill 6616
```
### Тестирование
```
Playwright Test for VSCode
```
# Дискретные структуры (лабораторные работы)

Для запуска любой лабораторной работы необходимо:

## 1. Установить nvm

1. В командной строке выполнить команды:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
или
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
На MACOS иногда требуется выполнить команду
```
touch ~/.bash_profile
```
если этот файл не создался автоматически

2. Переоткрыть терминал

3. Проверить версию nvm
```
nvm --version
```

## 2. Через nvm установить nodejs
```
nvm install 10.0.0
```
```
node -v
```

#### Ссылка на развёрнутый гайд по установке nvm + node
https://gist.github.com/d2s/372b5943bce17b964a79

## 3. Зайти в папку с лабораторной работой и выполнить команду для запуска
Пример:
```
node laba2
```

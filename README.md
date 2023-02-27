- [1. Założenia](#1-założenia)
  - [1.1. Funkcjonalności](#11-funkcjonalności)
  - [1.2. ``TO DO``](#12-to-do)
- [2. Technikalia](#2-technikalia)
  - [2.1. Struktura plików](#21-struktura-plików)
  - [Użyte narzędzia](#użyte-narzędzia)
  - [2.2. Budowa pytań](#22-budowa-pytań)
  - [2.3. Budowa tali](#23-budowa-tali)
- [3. Do poprawy:](#3-do-poprawy)
  - [3.1. Funkcje](#31-funkcje)
  - [3.2. Wygląd](#32-wygląd)

# 1. Założenia
Strona do stawiania tarota w ramach pomocy kreatywnej do towrzenia fikcji.

Dostępna na: https://kiszu.pl/Tarot/tarot.html

## 1.1. Funkcjonalności
- Wybór jednego z predefiniowanych zbiorów pytań przystosowanych do tworzneia określonych elementów fikcji.
- Zatwierdzenie bądź odrzucenie karty przy pytaniu.
- Podsumowanie ukłądu tarota z opisem.
  
## 1.2. ``TO DO``
- Połączenie z chatGPT (https://chat.openai.com/chat) -- jak na razie zmiarzdżone cenowo
- Stworzenie obrazków dla każdej karty wraz z uwzględnieniem jej pozycji.

# 2. Technikalia

## 2.1. Struktura plików
- jsons/
  - **cards.json** - json z opisem kart
  - **question.json** - json z opisem pytań
- pitures/ - folder z grafiami
- **main.js** - główny kod javascript
- **main.css** - style CSS
- **tarot.html** - strona HTML

## Użyte narzędzia
- Obrazki kart: https://novelai.net/
- Tło: https://app.haikei.app/
- Schemat kolorystyczny: https://mycolor.space/

## 2.2. Budowa pytań
```
{
  Sekcja: {
      "1": ...,
      "2": ...,
      "3": ...,
      "4": ...,
      "5": ...
  }
}
```
## 2.3. Budowa tali
```
{
  name  // nazwa karty
  short // skrót, tylko duże arkana
  type  // typ, małego arkana
  [1]   // opis pozycji normalnej
  [0]   // opis pozycji odwróconej
}
```

# 3. Do poprawy:

## 3.1. Funkcje
- Powrót
- Kopiowanie

## 3.2. Wygląd
- Czytelność opisów kart 🔁
- Pokazywanie mometu stage'a ❔
- Pokazywanie przy wyborze od razu opisu ❔
- Czytelność wyniku 🔁
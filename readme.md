# [Active Recovery]

Aceasta este aplicația [Active Recovery] dezvoltata pentru lucrarea de licenta.

## Adresa Repository-ului

Repository-ul complet al aplicației, inclusiv codul sursă, poate fi găsit la următoarea adresă: [https://github.com/IulianBirladeanu07/active_recovery](https://github.com/IulianBirladeanu07/active_recovery)

## Pașii de Compilare ai Aplicației

1. **Instalare Node.js și npm**:
    - Asigură-te că ai instalat [Node.js](https://nodejs.org/) și [npm](https://www.npmjs.com/).

2. **Clonează repository-ul**:
    ```bash
    git clone https://github.com/IulianBirladeanu07/active_recovery.git
    cd active_recovery
    ```

3. **Instalează dependențele**:
    ```bash
    npm install
    ```

## Pașii de Instalare și Lansare a Aplicației

1. **Instalare Expo CLI**:
    - Dacă nu ai deja instalat Expo CLI, instalează-l folosind npm:
    ```bash
    npm install -g expo-cli
    ```

2. **Lansare server Expo**:
    ```bash
    npx expo start
    ```

3. **Descarcă aplicația Expo Go**:
    - Descarcă și instalează aplicația Expo Go pe dispozitivul tău mobil din App Store (iOS) sau Google Play Store (Android).

4. **Scanează codul QR**:
    - Scanează codul QR afișat în terminal sau în Expo Dev Tools în browser folosind aplicația Expo Go.

5. **Lansare aplicație**:
    - După scanarea codului QR, aplicația va fi lansată pe dispozitivul tău mobil.

## Structura Proiectului

```plaintext
active_recovery/
├── assets/             # Fișiere de resurse, cum ar fi imagini, fonturi, etc.
├── src/
│   ├── mocks/          # Fișiere mock pentru testare
│   ├── tests/          # Fișiere de test
│   ├── assets/         # Fișiere de resurse suplimentare
│   ├── components/     # Componente reutilizabile
│   ├── context/        # Provideri de context
│   ├── exercises/      # Fișiere legate de exerciții
│   ├── handlers/       # Handlere pentru diferite funcționalități
│   ├── helpers/        # Funcții ajutătoare
│   ├── screens/        # Ecranele aplicației
│   ├── services/       # Fișiere de servicii
│   ├── utils/          # Funcții utilitare
│   └── index.js        # Punctul de intrare pentru fișierele sursă
├── App.js              # Punctul de intrare al aplicației
├── app.json            # Configurația Expo
├── babel.config.js     # Configurația Babel
├── eas.json            # Configurația Expo Application Services
├── jest.config.js      # Configurația Jest
├── jest.setup.js       # Fișierul de configurare Jest
├── node_modules/       # Modulele Node.js
├── package.json        # Metadatele proiectului și dependențele
├── package-lock.json   # Fișierul de blocare pentru npm
└── README.md           # Documentația proiectului

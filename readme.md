# ActiveRecovery

ActiveRecovery is a React Native mobile application designed to help users with their recovery routines. This project uses Expo to facilitate development and deployment.

## Table of Contents

- [Installation](#installation)
- [Running the App](#running-the-app)
- [Building the App](#building-the-app)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

1. Clone the repository:
   
git clone https://github.com/yourusername/active_recovery.git
cd active_recovery

Install dependencies:
Using npm:
npm install

Running the App
To start the app, follow these steps:

Start the Expo server:
Using npx:
npx expo start

2.Download the Expo Go app on your mobile device from the App Store (iOS) or Google Play Store (Android).

Scan the QR code displayed in the terminal or the Expo Dev Tools in your browser with the Expo Go app.

Building the App
To build the app for production, you can use the Expo build service:

Make sure you are logged in to Expo:
expo login

Initiate the build process:

For iOS:

expo build:ios

For Android:
expo build:android

Follow the instructions provided by Expo to complete the build process.

Project Structure
Here is a brief overview of the project structure:

perl
Copiază codul
ActiveRecovery/
├── assets/             # Asset files such as images, fonts, etc.
├── src/
│   ├── __mocks__/      # Mock files for testing
│   ├── __tests__/      # Test files
│   ├── assets/         # Additional asset files
│   ├── components/     # Reusable components
│   ├── context/        # Context providers
│   ├── exercises/      # Exercise-related files
│   ├── handlers/       # Handlers for various functionalities
│   ├── helpers/        # Helper functions
│   ├── screens/        # Application screens
│   ├── services/       # Service files
│   ├── utils/          # Utility functions
│   └── index.js        # Entry point for the source files
├── App.js              # Entry point of the application
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration
├── eas.json            # Expo Application Services configuration
├── jest.config.js      # Jest configuration
├── jest.setup.js       # Jest setup file
├── node_modules/       # Node.js modules
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Lockfile for npm
└── README.md           # Project documentation
Contributing
Contributions are welcome! Please fork the repository and use a feature branch. Pull requests are warmly welcome.

Fork the repository.
Create your feature branch (git checkout -b feature/AmazingFeature).
Commit your changes (git commit -m 'Add some AmazingFeature').
Push to the branch (git push origin feature/AmazingFeature).
Open a Pull Request.
License
Distributed under the MIT License. See LICENSE for more information.

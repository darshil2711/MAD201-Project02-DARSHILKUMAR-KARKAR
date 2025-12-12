# MAD201-01 Cross Platform Mobile App Development - Project 2

## Smart Budget Tracker Lite

## Student: Darshilkumar Karkar (A00203357)

### Overview

**Smart Budget Tracker Lite** is a React Native application that allows users to track their daily income and expenses, view their current balance, and visualize their spending habits. The app persists data locally on the device and integrates with a live currency API.

### App Concept

The app lets users track daily income and expenses and view their current balance.

### Features

* **Dashboard**: View total income, expenses, and current balance at a glance.
* **Transaction Tracking**: Add income or expense transactions with categories.
* **History**: View a list of all past transactions with the ability to delete them.
* **Reports**: Visual summary of expenses by category.
* **Settings**:
  * Toggle between **Light** and **Dark** themes.
  * Select currency (USD, EUR, GBP).
  * View live exchange rates fetched from an API.
* **Local Storage**: Data is saved persistently using AsyncStorage.

### Technologies Used

* **Framework**: React Native (Expo)
* **Navigation**: React Navigation (Stack + Bottom Tabs)
* **Styling**: Flexbox, StyleSheet
* **Icons**: Ionicons (@expo/vector-icons)
* **Storage**: AsyncStorage
* **API**: ExchangeRate-API

### Setup and Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/YOUR_USERNAME/MAD201-Project02-YOURNAME.git
    cd MAD201-Project02-YOURNAME
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the application**:

    ```bash
    npx expo start
    ```

4. **Run on Device/Emulator**:
    * Press `a` for Android Emulator.
    * Press `i` for iOS Simulator.
    * Scan the QR code with the Expo Go app on a physical device.

### Project Structure

* `App.js`: Main entry point and Navigation setup.
* `src/screens/`: Contains all application screens (Home, AddTransaction, Reports, Settings, etc.).
* `src/screens/api.js`: Handles AsyncStorage operations and API calls.

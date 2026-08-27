---

# 🚀 Getting Started
# This is the link of the API : 
## https://language-bridge.onrender.com
Follow these steps to set up and run the project locally.

## Prerequisites

Before you begin, make sure you have the following installed:

- Git
- Node.js (v20 or later recommended)
- npm
- PostgreSQL
- React Native development environment
  - Android Studio (Android)
  - Xcode (macOS for iOS development)

---

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Language-Exchange.git

cd Language-Exchange
```

---

## 2. Backend Setup

Navigate to the backend directory.

```bash
cd Server
```

Install dependencies.

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `Server` directory.

Example:

```env
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/language_exchange

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## 4. Database Setup

Generate the Prisma Client.

```bash
npx prisma generate
```

Run database migrations.

```bash
npx prisma migrate dev
```

(Optional) Open Prisma Studio.

```bash
npx prisma studio
```

---

## 5. Start the Backend Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The backend server will be available at:

```
http://localhost:5000
```

---

## 6. Mobile Application Setup

Navigate to the mobile application.

```bash
cd ../Mobile-App
```

Install dependencies.

```bash
npm install
```

---

## 7. Configure Mobile Environment

Create a `.env` file inside the `Mobile-App` directory.

Example:

```env
API_BASE_URL=http://localhost:5000/api/v1
```

If testing on a physical Android device, replace `localhost` with your computer's local IP address.

Example:

```env
API_BASE_URL=http://192.168.1.100:5000/api/v1
```

---

## 8. Run the Mobile Application

Start Metro.

```bash
npm start
```

Run on Android.

```bash
npm run android
```

Run on iOS.

```bash
npm run ios
```

---

# 📁 Project Structure

```
Language-Exchange/

├── Mobile-App/
│
├── Server/
│
├── docs/
│   ├── API.md
│   ├── ERDiagram.md
│   ├── DatabaseDesign.md
│   ├── Architecture.md
│
├── README.md
└── .gitignore
```

---

# 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push your branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

# 📬 Contact

If you have questions, suggestions, or would like to contribute, feel free to open an issue or submit a pull request on GitHub.

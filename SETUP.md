# Vashu Bulks Website

A powerful AI-integrated nutrient tracking application built with Next.js, Appwrite, and Google Gemini AI.

## 🚀 Features

- **User Authentication**: Secure sign-up and login with Appwrite
- **Manual Meal Logging**: Directly input meal nutrients (calories, protein, fats, carbs)
- **AI-Powered Meal Analysis**: Describe your meal in natural language and let Gemini AI calculate the nutrients
- **Daily Nutrient Targets**: Set and track your personalized daily nutrition goals
- **Calendar Visualization**: Interactive calendar showing daily intake with color-coded deficit/surplus indicators
- **Real-time Tracking**: See how your daily intake compares to your targets

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (React)
- **Backend/Database**: Appwrite
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS
- **Calendar**: react-calendar

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- An Appwrite account and project
- A Google Gemini API key

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd f:\Coding\vashu-bulks
pnpm install
```

### 2. Configure Appwrite

1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new project
3. Enable **Email/Password** authentication in the Auth settings
4. Create a new database
5. Create **two collections** with the following schemas:

#### **Meals Collection**

- `userId` (String, required, indexed) - This stores the Appwrite user's `$id`
- `date` (String, required, indexed) - Format: YYYY-MM-DD
- `mealName` (String, required)
- `calories` (Integer, required)
- `protein` (Float, required)
- `fats` (Float, required)
- `carbs` (Float, required)
- `isAIcalculated` (Boolean, required)

**Permissions**: Allow authenticated users to create/read/update/delete their own documents

#### **Requirements Collection**

- `userId` (String, required, indexed) - This stores the Appwrite user's `$id`
- `targetCalories` (Integer, required)
- `targetProtein` (Float, required)
- `targetFats` (Float, required)
- `targetCarbs` (Float, required)

**Permissions**: Allow authenticated users to create/read/update/delete their own documents

6. **Note**: You don't need a separate Users collection - Appwrite's built-in authentication handles user management. The `userId` field in both collections stores the authenticated user's `$id` from Appwrite's user object.

### 3. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for the next step

### 4. Configure Environment Variables

Edit the `.env.local` file and fill in your credentials:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id-here
NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID=your-meals-collection-id
NEXT_PUBLIC_APPWRITE_REQUIREMENTS_COLLECTION_ID=your-requirements-collection-id

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Getting Started

1. **Sign Up**: Create a new account on the auth page
2. **Set Targets**: Navigate to the Settings tab and set your daily nutrient targets
3. **Log Meals**: Use either:
   - **Manual Entry**: Input exact nutrient values
   - **AI Entry**: Describe your meal (e.g., "A bowl of oatmeal with blueberries and a glass of milk")
4. **Track Progress**: View your daily intake on the calendar with color-coded indicators:
   - 🟢 **Green**: Target met (within 10% tolerance)
   - 🔵 **Blue**: Surplus (exceeded target)
   - 🟠 **Orange**: Deficit (below target)

### Calendar Features

- Click any date to see detailed nutrient breakdown
- View all meals logged for that day
- See deficit/surplus for each nutrient
- 🤖 icon indicates AI-calculated meals

## 🏗️ Project Structure

```
vashu-bulks/
├── app/
│   ├── api/
│   │   └── analyze-meal/
│   │       └── route.js          # Gemini AI integration
│   ├── auth/
│   │   └── page.js                # Login/Signup page
│   ├── dashboard/
│   │   └── page.js                # Main dashboard
│   ├── globals.css                # Global styles
│   ├── layout.js                  # Root layout
│   └── page.js                    # Home page
├── components/
│   ├── AIMealForm.js              # AI-powered meal entry
│   ├── LoginForm.js               # Login component
│   ├── ManualMealForm.js          # Manual meal entry
│   ├── NutrientCalendar.js        # Calendar visualization
│   ├── ProtectedRoute.js          # Auth guard
│   ├── RequirementsForm.js        # Daily targets form
│   └── SignupForm.js              # Signup component
├── contexts/
│   └── AuthContext.js             # Authentication context
├── lib/
│   ├── appwrite.js                # Appwrite client setup
│   ├── auth.js                    # Auth utilities
│   └── database.js                # Database operations
└── .env.local                     # Environment variables
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Appwrite handles authentication securely
- Gemini API key is only used server-side
- Database permissions should restrict users to their own data

## 🐛 Troubleshooting

### Appwrite Connection Issues

- Verify your endpoint and project ID in `.env.local`
- Check that your Appwrite project is active
- Ensure collections have correct permissions

### AI Analysis Not Working

- Verify your Gemini API key is correct
- Check API quota limits
- Ensure the meal description is clear and descriptive

### Calendar Not Showing Data

- Verify meals are being saved with correct date format (YYYY-MM-DD)
- Check database permissions
- Ensure daily targets are set

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.

---

Built with ❤️ using Next.js, Appwrite, and Gemini AI

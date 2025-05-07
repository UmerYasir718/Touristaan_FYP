# Touristaan - Tourism Website

## Overview
Touristaan is a modern, full-featured tourism website that allows users to explore, book, and review travel packages to beautiful destinations like Swat Valley and Kashmir. The platform provides a seamless experience from browsing packages to completing bookings and leaving reviews.

## Key Features

### User Features
- **User Authentication**: Secure login, signup, and password reset functionality
- **Package Browsing**: Browse through various tour packages with detailed information
- **Package Details**: View comprehensive details about each package including pricing, itinerary, and reviews
- **Booking System**: Book packages with integrated Stripe payment processing
- **Review System**: Leave reviews for completed tours
- **Profile Management**: Update profile information, change password, and view booking history
- **Contact System**: Submit inquiries and receive responses

### Admin Features
- **Dashboard**: View statistics, recent activities, and key metrics
- **Package Management**: Create, update, delete, enable/disable tour packages
- **Booking Management**: View and manage all bookings with status updates
- **Review Management**: Approve or reject user reviews
- **User Management**: View and manage user accounts
- **Payment Processing**: Track transactions and manage payment statuses
- **Site Settings**: Update website configuration, logo, favicon, business hours, and location

## Technical Stack

### Frontend
- **React**: Core library for building the UI
- **Redux**: State management
- **React Router**: Navigation and routing
- **React Bootstrap**: UI components and responsive design
- **Formik & Yup**: Form handling and validation
- **Axios**: API requests
- **Stripe**: Payment processing
- **Leaflet**: Interactive maps
- **Chart.js**: Data visualization

### Backend (API Integration)
- RESTful API integration with JWT authentication
- File upload functionality for images
- Secure payment processing with Stripe

## Project Structure
- **src/components**: Reusable UI components
- **src/pages**: Main application pages
- **src/redux**: Redux store, actions, and reducers
- **src/utils**: Utility functions and API service
- **src/context**: React context providers
- **src/assets**: Static assets like images
- **src/styles**: CSS and style-related files

## Getting Started

### Prerequisites
- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later) or yarn (v1.22.0 or later)

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with necessary environment variables
4. Start the development server:
   ```
   npm start
   ```

## Deployment
The application can be built for production using:
```
npm run build
```

## License
[Your License Information]

## Acknowledgements
- High-quality images from Unsplash
- [Any other acknowledgements]

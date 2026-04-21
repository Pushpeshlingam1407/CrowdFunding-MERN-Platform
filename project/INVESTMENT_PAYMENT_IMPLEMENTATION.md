# Investment & Payment Flow Implementation Guide

## Overview
This document outlines the complete investment and payment flow for your CrowdFunding platform. Users can now invest in campaigns with multiple payment method options and track their portfolio.

## Features Implemented

### 1. **Investment Modal** (`InvestmentModal.jsx`)
- Allows users to enter investment amount
- Shows equity calculation based on investment
- Validates minimum and maximum investment limits
- Displays project information

**Location:** `/src/components/InvestmentModal.jsx`

### 2. **Payment Modal** (`PaymentModal.jsx`)
- Multiple payment method options:
  - **Credit/Debit Card**: Full card details entry
  - **UPI**: UPI ID input
  - **Net Banking**: Bank name and account number
  - **Digital Wallet**: Wallet selection
- Real-time validation
- Payment status tracking (processing, success, error)
- Simulated payment processing for demo/testing

**Location:** `/src/components/PaymentModal.jsx`

### 3. **Updated Project Details Page**
- Integrated investment flow
- "Invest in Startup" button triggers modals
- Authentication check before allowing investment
- Post-payment investment record creation

**Location:** `/src/pages/ProjectDetails.jsx`

### 4. **Portfolio Component** (`Portfolio.jsx`)
- Dashboard showing all user investments
- Investment statistics:
  - Total invested amount
  - Active investments count
  - Average investment value
- Investment card displays:
  - Project image
  - Project title & description
  - Investment amount
  - Investment status (pending/completed)
  - Quick navigation to project

**Location:** `/src/components/Portfolio.jsx`

### 5. **Backend Payment Controller Updates**
- `createOrder()`: Generates Razorpay payment order
- `verifyPayment()`: Verifies payment signature and creates investment record
- Automatic project funding amount update
- Duplicate investment prevention

**Location:** `/backend/controllers/payment.controller.js`

### 6. **Investment Model Enhancement**
- Added `paymentId` field for payment tracking
- Added `paymentMethod` field (credit-debit, upi, netbanking, wallet)
- Added `completedAt` timestamp for completed payments
- Improved indexes for query performance

**Location:** `/backend/models/Investment.js`

### 7. **Investment API & Routes**
- `/api/investments/` - Create new investment (POST)
- `/api/investments/user` - Get user's investments (GET)
- `/api/investments/project/:projectId` - Get project investments (GET)

**Location:** `/backend/routes/investment.routes.js`

### 8. **Payment Routes**
- `/api/payment/create-order` - Create payment order (POST)
- `/api/payment/verify` - Verify payment and record investment (POST)

**Location:** `/backend/routes/payment.routes.js`

### 9. **Updated App Routes**
- Added `/portfolio` protected route for viewing investment portfolio

**Location:** `/src/App.jsx`

### 10. **Investment Store Update**
- Improved Zustand store for state management
- Methods:
  - `createInvestment()` - Create new investment
  - `fetchUserInvestments()` - Fetch user's investments
  - `fetchProjectInvestments()` - Fetch project's investments
  - `clearError()` & `clearInvestments()` - Utility methods

**Location:** `/src/store/investmentStore.js`

## User Flow

### Step 1: Browse Campaigns
- User navigates to `/campaigns` page
- Views available projects

### Step 2: View Project Details
- Clicks on a campaign to view details at `/projects/:id`
- Sees funding progress, equity offering, and target amount

### Step 3: Click Invest Button
- User clicks "Invest in Startup" button
- If not authenticated, redirected to login
- **InvestmentModal** opens

### Step 4: Enter Investment Amount
- User enters desired investment amount
- System calculates equity stake
- Click "Proceed to Payment"

### Step 5: Select Payment Method
- **PaymentModal** opens with 4 payment options
- User selects preferred payment method
- Enters payment details (card, UPI, bank, or wallet)

### Step 6: Process Payment
- System creates Razorpay payment order
- Payment is processed and verified
- Investment record created with status "completed"
- Project funding amount automatically updated

### Step 7: Confirmation
- Success message displayed
- User redirected to `/dashboard`
- Investment appears in `/portfolio`

## API Endpoints

### Investment Endpoints
```
POST   /api/investments
       Create new investment
       Body: {
         projectId: string,
         amount: number,
         status: "completed" | "pending" | "failed"
       }

GET    /api/investments/user
       Get user's investments
       Response: { success: boolean, investments: Array }

GET    /api/investments/project/:projectId
       Get project's investments
       Response: { success: boolean, investments: Array }
```

### Payment Endpoints
```
POST   /api/payment/create-order
       Create payment order
       Body: {
         amount: number,
         projectId: string,
         paymentMethod: string,
         paymentDetails: object
       }
       Response: { success: boolean, order: object }

POST   /api/payment/verify
       Verify payment and create investment
       Body: {
         razorpayOrderId: string,
         razorpayPaymentId: string,
         razorpaySignature: string,
         projectId: string,
         amount: number
       }
       Response: { success: boolean, investment: object }
```

## Environment Variables Required

```bash
# Backend (.env)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Testing the Payment Flow

### 1. Local Testing (Demo Mode)
The payment modal simulates successful payments:
- Enter any investment amount
- Select a payment method
- System will simulate a 2-second payment processing
- Shows success after verification

### 2. Production Integration (Razorpay)
When ready to go live:
1. Get Razorpay credentials from your dashboard
2. Update `.env` with actual keys
3. PaymentModal will automatically use Razorpay Checkout
4. Real payment processing and verification

## Key Features

✅ **Multiple Payment Methods**: Credit/Debit cards, UPI, Net Banking, Digital Wallets  
✅ **Portfolio Tracking**: View all investments with statistics  
✅ **Equity Calculation**: Automatic equity calculation based on investment  
✅ **Payment Verification**: Secure signature verification  
✅ **Anti-Duplicate**: Prevents multiple investments in same project  
✅ **Real-time Updates**: Project funding amount updates instantly  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  
✅ **Error Handling**: Comprehensive error messages and validation  

## File Changes Summary

### Frontend Files Created
- `/src/components/InvestmentModal.jsx` - Investment input modal
- `/src/components/PaymentModal.jsx` - Payment method selection & processing
- `/src/components/Portfolio.jsx` - Investment portfolio display

### Frontend Files Modified
- `/src/pages/ProjectDetails.jsx` - Added investment flow integration
- `/src/App.jsx` - Added portfolio route
- `/src/store/investmentStore.js` - Updated investment state management
- `/src/services/api.js` - Investment API endpoints (already present)

### Backend Files Modified
- `/backend/controllers/payment.controller.js` - Enhanced payment handling
- `/backend/models/Investment.js` - Added payment tracking fields
- `/backend/routes/investment.routes.js` - Already has all routes
- `/backend/routes/payment.routes.js` - Existing payment routes

## Next Steps (Optional Enhancements)

1. **Real Razorpay Integration**: Replace demo payments with live Razorpay payments
2. **Email Notifications**: Send investment confirmation emails
3. **Investment Management**: Add ability to view, modify, or withdraw investments
4. **Returns Dashboard**: Show expected returns and dividend status
5. **Certificate Generation**: Generate investment certificates
6. **Analytics**: Track investment performance metrics
7. **Notification System**: Real-time alerts for investment milestones

## Troubleshooting

### Payment Order Creation Fails
- Check Razorpay credentials in `.env`
- Verify `projectId` is valid
- Check investment amount is positive

### Payment Verification Fails
- Ensure signatures are being generated correctly
- Check that `RAZORPAY_KEY_SECRET` is correct
- Verify order ID and payment ID match

### Investment Not Appearing in Portfolio
- Check that investment status is "completed"
- Verify user ID is correctly passed
- Check database for investment record

### Modal Not Opening
- Ensure user is authenticated
- Check browser console for errors
- Verify route `/projects/:id` is accessible

## Support
For issues or questions, review the error logs and check the browser console for detailed error messages.

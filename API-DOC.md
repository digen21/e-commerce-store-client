## Login CURL

```bash

curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2MTE3NzgsImV4cCI6MTc3MjY5ODE3OH0.nhcmiZcYehjSEXJLEBhaAOG24MDM4Qk-5N4gB4pl1X8' \
--data-raw '{
    "email": "admin@gmail.com",
    "password": "Admin@1234"
}'


```

## Signup CURL

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Admin User",
    "email": "admin@gmail.com",
    "password": "Admin@1234"
}'
```

## Profile CURL

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/profile' \
--header 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2MTE3NzgsImV4cCI6MTc3MjY5ODE3OH0.nhcmiZcYehjSEXJLEBhaAOG24MDM4Qk-5N4gB4pl1X8'
```

## Logout CURL

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/logout' \
--header 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2MTE3NzgsImV4cCI6MTc3MjY5ODE3OH0.nhcmiZcYehjSEXJLEBhaAOG24MDM4Qk-5N4gB4pl1X8'
```

## Verify Email CURL

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc3MjYxMTc3OCwiZXhwIjoxNzcyNjE1Mzc4fQ.g4x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5'
```

## Forgot Password CURL

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/forgot-password' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "[EMAIL_ADDRESS]"
}'
```

## Reset Password CURL

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/reset-password' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc3MjYxMTc3OCwiZXhwIjoxNzcyNjE1Mzc4fQ.g4x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5",
    "password": "Admin@1234"
}'
```

## Resend Verification Email CURL

```bash
curl --location --request POST 'https://e-commerce-store-backend-hm4n.onrender.com/api/auth/verify-mail?token=%242b%2410%24HNT%2FVZDo4heoV5xrAmZFL.Ag4FMMpAKce%2FCvAC4hdqGRuJvvIwK8.' \
--header 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2MTE3NzgsImV4cCI6MTc3MjY5ODE3OH0.nhcmiZcYehjSEXJLEBhaAOG24MDM4Qk-5N4gB4pl1X8' \
--data ''
```


## Admin Profile

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/admin/profile' \
--header 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2MTE3NzgsImV4cCI6MTc3MjY5ODE3OH0.nhcmiZcYehjSEXJLEBhaAOG24MDM4Qk-5N4gB4pl1X8'

Expectd Response: 

```
{
    "success": true,
    "message": "Admin profile created successfully",
    "data": {
        "user": "69a892e9541e54b7fade9c64",
        "storeName": "Deckow Group",
        "email": "store@example.com",
        "phone": "+91 9876543210",
        "currency": "INR",
        "address": {
            "addressLine1": "123 MG Road",
            "city": "Mumbai",
            "state": "Maharashtra",
            "postalCode": "400001",
            "country": "India"
        },
        "taxRate": 18,
        "lowStockThreshold": 10,
        "_id": "69a89497c28c71ac8830b8d8",
        "createdAt": "2026-03-04T20:22:47.539Z",
        "updatedAt": "2026-03-04T20:22:47.539Z",
        "__v": 0
    },
    "status": 200
}
```

```

## Admin Update Profile

```bash
curl --location --request PUT 'https://e-commerce-store-backend-hm4n.onrender.com/api/admin/profile' \
--header 'Content-Type: application/json' \
--header 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2MTE3NzgsImV4cCI6MTc3MjY5ODE3OH0.nhcmiZcYehjSEXJLEBhaAOG24MDM4Qk-5N4gB4pl1X8' \
--data-raw '{
    "storeName": "Beer Group",
    "email": "store@example.com",
    "phone": "+91 9876543210",
    "taxRate": 18,
    "address": {
        "addressLine1": "123 MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001",
        "country": "India"
    }
}'
```

## Create Product

```bash
curl --location 'https://e-commerce-store-backend-hm4n.onrender.com/api/products' \
--header 'Content-Type: application/json' \
--header 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE2Y2I0Mzg2OTI3Y2FjMmIwOGIyNTAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2MTE3NzgsImV4cCI6MTc3MjY5ODE3OH0.nhcmiZcYehjSEXJLEBhaAOG24MDM4Qk-5N4gB4pl1X8' \
--data-raw '{
    "title": "title",
    "description": "description",
    "price": 100,
    "category": "category",
    "stock": 10,
    "images": [
        "https://cloudinary.com/image1.jpg",
        "https://cloudinary.com/image2.jpg"
    ]
}'
```
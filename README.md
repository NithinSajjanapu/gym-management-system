VEER FITNESS CLUB – Gym Management System
Project Description

The Veer Fitness Club – Gym Management System is a web application developed to simplify the daily management activities of a gym. In many small and medium-sized fitness centers, member details, payments, and membership renewals are still handled manually using notebooks or spreadsheets. This often leads to errors, missed renewals, and difficulty in maintaining records. To solve these problems, I developed this application to provide a simple, secure, and efficient digital solution.

Technologies Used

Frontend

HTML5
CSS3
JavaScript (Vanilla)
Bootstrap 5

Backend

Node.js
Express.js

Database

MongoDB Atlas

Authentication

JWT (JSON Web Token)

Image Storage

Cloudinary

Invoice Generation

PDF Generator

Deployment

Frontend : Vercel
Backend : Render
Database : MongoDB Atlas

The system allows the gym owner to manage the complete member lifecycle, starting from new member registration to membership renewal, payment tracking, invoice generation, and expiry monitoring. It also provides a dashboard that gives an instant overview of the gym's current status, including total members, active memberships, expired memberships, upcoming renewals, and total revenue.

When a new member joins the gym, the administrator enters personal details such as name, phone number, age, weight, gender, workout type, membership plan, and payment mode. The application also provides an integrated camera feature to capture the member's photograph directly from the device. The captured image is securely uploaded to Cloudinary, ensuring that photos remain safely stored without occupying server storage.

One of the important features of the system is automatic fee calculation. The membership amount is calculated based on the selected workout type and membership duration, eliminating manual calculations and reducing the possibility of billing errors. Once the member is successfully registered, the application automatically generates the membership start date, expiry date, payment record, and a professional PDF invoice.

The dashboard serves as the central page of the application. It displays useful statistics such as the total number of registered members, active members, expired members, and total revenue collected. It also highlights members whose memberships are about to expire within the next two days, allowing the administrator to take timely action.

The Members section provides a complete list of all registered members along with their photographs, contact information, workout plans, membership status, and expiry dates. Search and filtering options help the administrator quickly find any member without scrolling through the entire list.

Membership renewal is designed to be simple and efficient. When the administrator selects the Renew option, the existing member information is automatically loaded into the renewal form, including the previously uploaded profile photograph. Only the membership plan, renewal date, and payment method need to be updated. After renewal, the application automatically recalculates the membership validity, records the payment, updates the member's information, creates a renewal history record, and generates a new invoice.

The system also includes an expiry management page that displays members based on their remaining membership days. Members who are close to their expiry date or whose memberships have already expired can be identified immediately. To improve communication, the application generates a ready-to-send WhatsApp message containing the renewal details and invoice link, allowing the administrator to contact members with a single click.

Every payment made by a member is recorded in the payment history. These records are used to calculate the total revenue, monthly revenue, and revenue collected through different payment methods such as Cash and UPI. This helps the gym owner monitor the business performance without maintaining separate financial records.

Security is also an important part of the project. The application uses JWT (JSON Web Token) authentication to protect all administrative pages and APIs. Only authenticated administrators can access or modify member information, ensuring that the data remains secure.

The project was developed using HTML, CSS, Bootstrap, and JavaScript for the frontend, while the backend was built using Node.js and Express.js. MongoDB Atlas is used as the database for storing member and payment information, and Cloudinary is used for image storage. The frontend is deployed on Vercel, while the backend is hosted on Render, making the application accessible online from any device with an internet connection.

Overall, the Veer Fitness Club Gym Management System provides a complete digital solution for managing gym operations. It reduces manual work, improves record accuracy, saves time, and offers a professional experience for both the gym owner and members. The project demonstrates practical implementation of full-stack web development concepts, including authentication, database management, cloud storage, REST APIs, responsive user interface design, and real-time business management.

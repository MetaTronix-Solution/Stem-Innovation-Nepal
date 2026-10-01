# Stem Innovation Nepal

> A full-stack digital platform for STEM education, robotics, IoT, innovation programs, laboratory solutions, and educational resources.

**Stem Innovation Nepal** is a modern web platform developed to support the digital presence and content management needs of an organization working in **STEM education, robotics, IoT, and innovation**.

The platform provides visitors with information about STEM initiatives, educational programs, laboratory solutions, blogs, galleries, and organizational activities, while providing administrators with a centralized system for managing website content and resources.

---

## Overview

STEM education plays an important role in developing practical technical skills, problem-solving abilities, creativity, and innovation among students.

Stem Innovation Nepal provides a digital platform through which schools, colleges, students, educators, and other visitors can explore the organization's activities and educational offerings.

The system combines a public-facing website with a secure administrative management platform.

The administrator can manage dynamic content without modifying the application source code, including:

* Website gallery
* Blog articles
* Contact information and submissions
* Laboratory categories
* Laboratory equipment and items
* Complete laboratory packages
* Images and media
* Administrative access

The application was designed with a modular backend architecture so that additional features can be introduced without significantly affecting existing modules.

---

# Key Objectives

The primary objectives of the platform are to:

* Establish a professional digital presence for Stem Innovation Nepal.
* Present STEM, robotics, and IoT initiatives in an accessible format.
* Provide information about laboratory equipment and laboratory solutions.
* Allow administrators to manage website content from a centralized system.
* Provide secure administrative authentication and authorization.
* Manage images and media efficiently using cloud-based storage.
* Provide a scalable backend architecture for future platform expansion.
* Create a foundation for future e-commerce and laboratory equipment management features.

---

# Core Features

## 1. Public Website

The public-facing platform allows visitors to explore information and resources provided by Stem Innovation Nepal.

Major sections include:

* Organization information
* STEM initiatives
* Gallery
* Blog
* Laboratory solutions
* Laboratory equipment
* Contact information

The frontend is designed to provide a responsive and accessible experience across different screen sizes.

---

## 2. Admin Management System

The platform includes a dedicated administrative system for managing dynamic website content.

Administrators can manage:

* Gallery content
* Blog content
* Contact information
* Laboratory categories
* Laboratory items
* Laboratory packages
* Uploaded images

This reduces the need for developers to manually modify database records whenever website content changes.

---

## 3. Authentication & Authorization

Administrative functionality is protected through an authentication system based on:

* JWT
* Access tokens
* Refresh tokens
* HTTP cookies
* Password hashing
* Protected routes
* Authentication guards

The authentication architecture separates public APIs from protected administrative operations.

### Authentication Flow

```text
             Administrator
                    │
                    ▼
              Login Request
                    │
                    ▼
             Authentication
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
    Access Token        Refresh Token
          │                   │
          ▼                   │
    Protected APIs            │
          │                   │
          └─────────┬─────────┘
                    ▼
             Admin Resources
```

---

# 4. Gallery Management

The gallery module provides a centralized way to manage images displayed on the website.

Administrators can:

* Create gallery entries
* Upload images
* View gallery items
* Update gallery information
* Delete gallery entries

Images are managed through cloud-based media storage rather than relying exclusively on local server storage.

---

# 5. Blog Management

The blog module allows administrators to manage articles and educational content.

Supported operations include:

* Create blog posts
* Read blog posts
* Update blog posts
* Delete blog posts
* Manage blog images
* Publish educational and organizational content

This provides the organization with a structured way to continuously publish new content.

---

# 6. Contact Management

The contact module provides communication functionality between visitors and the organization.

Visitors can submit contact information and messages through the website.

Administrators can then manage the submitted information through the backend system.

---

# 7. Laboratory Management

One of the core parts of the platform is the laboratory management system.

It is designed around three related concepts:

```text
Lab Category
     │
     ▼
Lab Item
     │
     ▼
Lab
```

### Lab Categories

Categories organize laboratory equipment into logical groups.

Examples:

```text
Robotics
Electronics
IoT
Programming
Automation
```

### Lab Items

A lab item represents an individual piece of laboratory equipment.

A typical lab item can contain:

* Title
* Description
* Specification
* Price
* Quantity
* Image
* Category

Example:

```text
Arduino UNO R3

Description:
Microcontroller board for robotics and electronics projects.

Specification:
ATmega328P, 14 digital I/O pins,
6 analog inputs, USB connectivity.

Price:
NPR 2,000

Quantity:
25
```

### Labs

A Lab represents a complete laboratory setup or package.

A lab can contain multiple laboratory items.

Example:

```text
Robotics Starter Lab

Price:
NPR 50,000

Includes:
- Arduino UNO R3
- Sensors
- Motor components
- Robotics components
- Supporting equipment
```

This structure allows individual equipment and complete laboratory solutions to be managed independently.

---

# System Architecture

The application follows a modular full-stack architecture.

```text
┌──────────────────────────────────────────────┐
│                 Client / User                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Frontend Application            │
│                                              │
│   Pages • Components • Forms • Services      │
└──────────────────────┬───────────────────────┘
                       │
                    REST API
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                NestJS Backend                │
│                                              │
│  Controllers → Services → Database Layer    │
│                                              │
│  Auth • Admin • Blog • Gallery • Contact     │
│  Lab Category • Lab Item • Lab               │
└───────────────┬──────────────────┬───────────┘
                │                  │
                ▼                  ▼
        ┌──────────────┐    ┌──────────────┐
        │   MongoDB    │    │   ImageKit   │
        │              │    │              │
        │ Application  │    │ Media /      │
        │ Data         │    │ Images       │
        └──────────────┘    └──────────────┘
```

---

# Backend Architecture

The backend is built using **NestJS** and follows a modular architecture.

Each major feature is organized into its own module.

```text
backend/
│
├── src/
│   │
│   ├── admin/
│   ├── auth/
│   ├── gallery/
│   ├── contact/
│   ├── blog/
│   ├── imagekit-service/
│   ├── lab-category/
│   ├── lab-item/
│   ├── lab/
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
│   └── all-exceptions.filter.ts
│
├── package.json
├── tsconfig.json
└── vercel.json
```

This modular structure improves:

* Maintainability
* Code organization
* Feature isolation
* Scalability
* Testing
* Future development

---

# Technology Stack

## Frontend

* Next.js / React
* TypeScript
* HTML5
* CSS
* Responsive UI
* REST API integration

## Backend

* NestJS
* Node.js
* TypeScript
* Express
* RESTful APIs

## Database

* MongoDB
* Mongoose

## Authentication

* JWT
* Passport.js
* Cookie-based authentication
* Access & refresh tokens
* bcryptjs

## Media Management

* ImageKit
* Multer

## Validation & Data Transformation

* class-validator
* class-transformer

## Communication

* Nodemailer
* Axios

## Development & Deployment

* Git
* GitHub
* Vercel
* MongoDB
* ImageKit

---

# API Modules

The backend is organized into the following major API modules:

| Module       | Responsibility                       |
| ------------ | ------------------------------------ |
| Auth         | Administrator authentication         |
| Admin        | Administrative operations            |
| Gallery      | Gallery and media management         |
| Blog         | Blog content management              |
| Contact      | Contact submissions                  |
| Lab Category | Laboratory category management       |
| Lab Item     | Laboratory equipment management      |
| Lab          | Complete laboratory setup management |
| ImageKit     | Cloud image management               |

---

# Data Relationships

The laboratory system uses relationships between categories, items, and complete laboratory setups.

```text
                 Lab Category
                      │
              categorizes items
                      │
                      ▼
                  Lab Item
                 /        \
                /          \
         Individual       Included in
          Equipment           │
                              ▼
                             Lab
                              │
                              ▼
                   Complete Laboratory
                         Solution
```

This approach allows the same laboratory item to be referenced as part of a larger laboratory setup while maintaining its own information.

---

# Error Handling

The backend includes centralized exception handling through a global exception filter.

This provides a consistent API response structure and prevents individual controllers from having to duplicate error-handling logic.

The application also performs validation for incoming request data using NestJS-compatible validation tools.

---

# Security Considerations

Security is an important part of the administrative system.

The application uses:

* Password hashing
* JWT authentication
* Refresh token mechanism
* Protected routes
* Authentication guards
* HTTP cookies
* CORS configuration
* Environment variables
* Request validation
* Centralized exception handling

Sensitive credentials such as database credentials, JWT secrets, and ImageKit keys are stored through environment variables.

---

# Media Architecture

The application uses ImageKit to handle uploaded media.

```text
Admin
  │
  ▼
Frontend Upload
  │
  ▼
NestJS Backend
  │
  ▼
ImageKit
  │
  ├── Image URL
  └── File ID
        │
        ▼
     MongoDB
```

This separates application data from media storage and makes the system more suitable for cloud deployment.

---

# Development Approach

The project follows a feature-based development approach.

Each major feature is implemented as an independent module containing its own:

* Controller
* Service
* Schema
* DTOs
* Module
* Business logic

This approach makes it easier to add new functionality without creating unnecessary dependencies between unrelated features.

---

# Future Scope

The current architecture provides a foundation for several future improvements.

### E-commerce

The laboratory management system can be extended into a complete equipment purchasing platform.

Possible features include:

* Shopping cart
* Add/remove lab items
* Add/remove complete labs
* Automatic total price calculation
* Checkout
* Orders
* Payment integration
* Order history

### Inventory

Future inventory functionality could include:

* Stock tracking
* Low-stock notifications
* Inventory history
* Item availability
* Stock updates

### User Accounts

The platform can later introduce user accounts for:

* Students
* Schools
* Colleges
* Teachers
* Organizations

### Administrative Dashboard

A more advanced dashboard could provide:

* Website statistics
* Inventory statistics
* Blog statistics
* Contact statistics
* Order statistics
* Activity monitoring

### Mobile Application

The backend API architecture can also support a future mobile application for students, educators, and customers.

---

# Project Workflow

The overall platform can be represented as:

```text
Visitor
   │
   ├── Explore Website
   ├── Read Blogs
   ├── View Gallery
   ├── Explore Labs
   └── Contact Organization
              │
              ▼
          Backend API
              │
              ▼
           MongoDB


Administrator
   │
   ▼
 Admin Authentication
   │
   ▼
 Admin Dashboard
   │
   ├── Manage Gallery
   ├── Manage Blogs
   ├── Manage Contacts
   ├── Manage Lab Categories
   ├── Manage Lab Items
   └── Manage Labs
```

---

# Installation & Development

## Prerequisites

Before running the project locally, make sure the following are installed:

* Node.js
* npm
* MongoDB
* Git

---

## Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Stem-Innovation-Nepal.git
cd Stem-Innovation-Nepal
```

---

## Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:3000

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

Run the development server:

```bash
npm run start:dev
```

Build the project:

```bash
npm run build
```

---

# Environment Variables

The application uses environment variables for configuration and sensitive credentials.

Typical variables include:

```text
MONGO_URI
FRONTEND_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
IMAGEKIT_URL_ENDPOINT
```

Never commit environment files containing credentials to the repository.

---

# Project Status

**Status: Active Development**

The core platform and administrative content-management functionality are implemented.

Current major areas include:

* Admin authentication
* Gallery management
* Blog management
* Contact management
* Lab category management
* Lab item management
* Lab management
* Cloud image management

The architecture is designed to support future commerce, inventory, user, and mobile features.

---

# Developer

### Badal Chand

**BSc (Hons) Computer Science**

Full-Stack Developer

### Areas of Interest

* Frontend Development
* Full-Stack Development
* React.js
* Next.js
* Node.js
* NestJS
* MongoDB
* REST API Development
* System Architecture

---

# Acknowledgements

Developed for **Stem Innovation Nepal** to support its digital presence and STEM-focused educational initiatives.

---

# License

This project is developed for Stem Innovation Nepal.

All rights reserved unless otherwise specified by the project owner.

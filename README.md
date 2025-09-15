# Plant Management System

A comprehensive plant management system with separate workflows for administrators, sellers, and customers. The system includes plant catalog management, inventory control, user management, and order processing capabilities.

## 🚀 Features

- **Multi-Role System**: Admin, Seller, and Customer roles with different permissions
- **Plant Management**: Comprehensive catalog with detailed information and disease management
- **Inventory Control**: Real-time tracking for medicines, fertilizers, and plant care products
- **User Authentication**: JWT-based authentication with role-based access control
- **Order Management**: Complete order processing workflow
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Spring Boot + Spring Security + JWT + MySQL
- **Database**: MySQL with JPA/Hibernate

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Java** (JDK 17 or higher) - [Download here](https://adoptium.net/)
- **Maven** (v3.6 or higher) - [Download here](https://maven.apache.org/download.cgi)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd PlantManagementSystem
```

### 2. Database Setup

1. **Start MySQL Server**
2. **Create Database**:
   ```sql
   CREATE DATABASE plant_management_db;
   ```
3. **Create MySQL User** (optional but recommended):
   ```sql
   CREATE USER 'plantuser'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON plant_management_db.* TO 'plantuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 3. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd PlantManagementSystem-backend/backend
   ```

2. **Configure Database Connection**:
   Edit [`src/main/resources/application.properties`](PlantManagementSystem-backend/backend/src/main/resources/application.properties):
   ```properties
   # Update these values according to your MySQL setup
   spring.datasource.url=jdbc:mysql://localhost:3306/plant_management_db
   spring.datasource.username=root
   spring.datasource.password=12345
   ```

3. **Install Dependencies & Run**:
   ```bash
   # Clean and install dependencies
   mvn clean install
   
   # Run the application
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### 4. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd ../../  # Go back to root directory
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:8081`

## 🚦 Running the Application

### Start Backend (Terminal 1):
```bash
cd PlantManagementSystem-backend/backend
mvn spring-boot:run
```

### Start Frontend (Terminal 2):
```bash
npm run dev
```

### Access the Application:
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api/auth/test (Test endpoint)

## 👥 Default User Roles

The system supports three user roles:

1. **ADMIN**: Full system access, user management, plant/medicine management
2. **SELLER**: Inventory management, order processing, pending approval required
3. **CUSTOMER**: Browse plants/medicines, place orders, view order history

### User Registration:
- Customers are automatically approved
- Sellers require admin approval (status: PENDING → APPROVED)
- Admins need to be created manually in the database

## 📁 Project Structure

```
PlantManagementSystem/
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── components/
│   │   ├── Auth/          # Authentication components
│   │   ├── Forms/         # Form components
│   │   ├── Layout/        # Layout components
│   │   └── ui/           # UI components (shadcn/ui)
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── SellerDashboard.tsx
│   │   ├── CustomerDashboard.tsx
│   │   └── AuthPage.tsx
│   └── lib/              # Utility functions
└── PlantManagementSystem-backend/
    └── backend/
        ├── pom.xml
        └── src/main/java/com/plantmanagement/
            ├── controller/   # REST Controllers
            ├── service/      # Business Logic
            ├── repository/   # Data Access Layer
            ├── entity/       # JPA Entities
            ├── dto/          # Data Transfer Objects
            ├── config/       # Configuration Classes
            └── security/     # Security Configuration
```

## 🔧 Configuration

### Backend Configuration
Key configuration files:
- [`application.properties`](PlantManagementSystem-backend/backend/src/main/resources/application.properties): Database and JWT settings
- [`SecurityConfig.java`](PlantManagementSystem-backend/backend/src/main/java/com/plantmanagement/config/SecurityConfig.java): Security configuration
- [`pom.xml`](PlantManagementSystem-backend/backend/pom.xml): Maven dependencies

### Frontend Configuration
Key configuration files:
- [`vite.config.ts`](vite.config.ts): Vite configuration
- [`tailwind.config.ts`](tailwind.config.ts): Tailwind CSS configuration
- [`package.json`](package.json): Dependencies and scripts

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for each user role
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Properly configured for cross-origin requests
- **Input Validation**: Bean validation on all API endpoints

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/test` - Test endpoint

### Protected Routes
- `/api/admin/**` - Admin-only endpoints
- `/api/seller/**` - Seller and Admin endpoints
- `/api/customer/**` - Customer and Admin endpoints

## 🎨 UI Components

The frontend uses shadcn/ui components with a nature-inspired design system:
- Custom color palette with forest and leaf greens
- Smooth animations and transitions
- Responsive design for all screen sizes
- Accessible components following best practices

## 🔄 Development Workflow

1. **Make changes** to frontend or backend code
2. **Frontend**: Changes auto-reload with Vite dev server
3. **Backend**: Restart with `mvn spring-boot:run` after changes
4. **Database**: Schema updates are handled automatically by Hibernate

## 🐛 Troubleshooting

### Common Issues:

1. **Port conflicts**:
   - Frontend: Change port in [`vite.config.ts`](vite.config.ts)
   - Backend: Change port in [`application.properties`](PlantManagementSystem-backend/backend/src/main/resources/application.properties)

2. **Database connection issues**:
   - Verify MySQL is running
   - Check credentials in [`application.properties`](PlantManagementSystem-backend/backend/src/main/resources/application.properties)
   - Ensure database exists

3. **CORS issues**:
   - Check [`SecurityConfig.java`](PlantManagementSystem-backend/backend/src/main/java/com/plantmanagement/config/SecurityConfig.java) for allowed origins

4. **JWT Token issues**:
   - Clear browser localStorage
   - Check JWT secret in [`application.properties`](PlantManagementSystem-backend/backend/src/main/resources/application.properties)

## 📦 Build for Production

### Frontend:
```bash
npm run build
```

### Backend:
```bash
mvn clean package
java -jar target/plant-management-backend-0.0.1-SNAPSHOT.jar
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team.

---

**Happy coding! 🌱**
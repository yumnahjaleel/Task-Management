# Task Management System - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements & Setup](#system-requirements--setup)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Project Modules](#project-modules)
5. [Database Configuration](#database-configuration)
6. [Entity Design & Implementation](#entity-design--implementation)
7. [Security & Authentication](#security--authentication)
8. [Development Guidelines](#development-guidelines)
9. [FAQ](#faq)

---

## Project Overview

### Core Purpose
A **team collaboration and task tracking system** built on Agile principles, designed for managing software development workflows with role-based access control.

### Key Features
- User-friendly interface for team collaboration
- Kanban board for visual task management
- Scrum Master role integration
- Task prioritization based on client requirements
- Role-based permissions (Developer, Tester, Production Team)
- Real-time collaboration with file attachments
- Comprehensive reporting and analytics

### Technology Stack
- **Backend:** Java (JDK 8/17), Spring Boot, Maven
- **Database:** MySQL or MongoDB (choose one)
- **Security:** Spring Security, JWT (JSON Web Token)
- **ORM:** JPA (Java Persistence API) with Hibernate
- **Development Tools:** Lombok, Spring Boot DevTools
- **API Testing:** Postman, Swagger (optional)
- **Version Control:** GitHub
- **CI/CD:** Jenkins, Docker (mentioned for future integration)

### API Architecture
- RESTful APIs responding with JSON
- Frontend connects to backend APIs for dynamic data
- Coordinated but separate backend and frontend development

---

## System Requirements & Setup

### Mandatory Installations

#### 1. Java Development Kit
- **Required:** JDK 8 or JDK 17
- **Environment Variable Setup:**
  ```
  Variable Name: JAVA_HOME
  Variable Value: [Path to JDK installation directory]
  ```
- **System Path:** Add `%JAVA_HOME%\bin` to system PATH
- **Verification:** `java -version` in command prompt

#### 2. Maven
- **Required:** Latest stable version
- **Environment Variable Setup:**
  ```
  Variable Name: MAVEN_HOME or M2_HOME
  Variable Value: [Path to Maven installation directory]
  ```
- **System Path:** Add `%MAVEN_HOME%\bin` to system PATH
- **Verification:** `mvn -version` in command prompt

#### 3. IDE (Choose One)
- Eclipse
- Spring Tool Suite (STS)
- IntelliJ IDEA (Recommended by modern companies)
- VS Code (Recommended by modern companies)

#### 4. Database
- **MySQL** (with proper port configuration, default 3306)
- **MongoDB** (alternative option)
- **Database Client Tools** for schema management

### Optional But Recommended Tools
- Postman (API testing)
- Swagger (API documentation)
- Git client

### Important Setup Notes
- **Internet Connection:** Stable broadband required for Maven dependency downloads (avoid mobile networks)
- **Project Storage:** Store projects outside system drive (e.g., G: drive) to prevent data loss during system restore
- **System Restart:** Required after environment variable changes
- **Java Version Compatibility:** Ensure IDE, Maven, and installed JDK versions match

---

## Architecture & Design Patterns

### MVC (Model-View-Controller) Architecture

#### Model Layer
**Package Structure:**
- `com.taskmanage.entity` - Database entities
- `com.taskmanage.repository` - JPA repositories for data access
- `com.taskmanage.dto` - Data Transfer Objects for API communication
- `com.taskmanage.service` - Business logic layer

**Responsibilities:**
- Database entity definitions
- ORM mapping with JPA/Hibernate
- Data validation and constraints
- Service layer for business operations

#### View Layer
**Response Types:**
- JSON responses (primary)
- JSP responses (optional, depending on frontend)
- Integration with React, Angular, or HTML frontend

**Characteristics:**
- Dynamic data rendering
- API-driven content delivery

#### Controller Layer
**Package Structure:**
- `com.taskmanage.controller` - REST controllers

**Responsibilities:**
- HTTP request handling
- JSON response generation
- Request validation
- Route management

### Additional Architectural Components

#### Security Layer
**Package:** `com.taskmanage.security`
- Authentication filters
- JWT token generation and validation
- Password encoding
- OAuth 2.0 support (future consideration)

#### Exception Handling
- Global exception handler
- Custom error responses
- Proper HTTP status code management

---

## Project Modules

The system comprises **12 main modules** working together for comprehensive task management:

### 1. Project Module
**Purpose:** Creating and managing projects

**Features:**
- Project creation and initialization
- Client requirement segregation
- Planning phase before coding begins
- Project metadata management

### 2. Issue Module
**Purpose:** Bug and issue tracking

**Features:**
- Issue/bug reporting during development
- Task assignment to team members
- Priority-based categorization
- Issue lifecycle tracking

### 3. Workflow Module
**Purpose:** Daily progress tracking

**Features:**
- Daily task status updates
- Progress monitoring before Pull Requests
- Workflow state management
- Task completion validation

### 4. Board Module (Kanban Board)
**Purpose:** Visual task management

**Features:**
- Kanban board interface (referred to as "conban board")
- Client and team transparency
- Real-time project status visualization
- Drag-and-drop task management

### 5. Backlog Module
**Purpose:** Task queue management

**Features:**
- Task reassignment capabilities
- Handling team member unavailability (sick leave, etc.)
- Sprint backlog management
- Priority-based task queuing

### 6. Reporting Module
**Purpose:** Progress reporting to management

**Features:**
- Pre-deployment progress reports
- Manager notifications before code submission
- Analytics and metrics
- Status summary generation

### 7. Security Module
**Purpose:** Authentication and authorization

**Features:**
- Email verification
- OTP (One Time Password) implementation
- Secure login mechanisms
- Organization credential validation

### 8. Real-time Collaboration Module
**Purpose:** Team communication and documentation

**Features:**
- Screenshot attachments
- PDF document sharing
- Task detail documentation
- Issue resolution communication

### 9-12. Additional Modules
(To be detailed in subsequent sessions)

---

## Database Configuration

### Connection Setup

#### MySQL Configuration
**application.properties example:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanage
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

**Note:** Port number may vary (e.g., 5050, 30706) based on local configuration.

#### MongoDB Configuration (Alternative)
- Select MongoDB driver dependency during project initialization
- Configure connection string similarly in application.properties
- Only use ONE database dependency to avoid conflicts

### DDL (Data Definition Language) Modes

#### `create` Mode
```properties
spring.jpa.hibernate.ddl-auto=create
```
- **Behavior:** Drops and recreates tables on every application restart
- **Data Impact:** ALL previous data is lost
- **Use Case:** Initial development, testing with fresh data
- **Warning:** NEVER use in production

#### `update` Mode (Recommended)
```properties
spring.jpa.hibernate.ddl-auto=update
```
- **Behavior:** Modifies table structure without dropping
- **Data Impact:** Preserves existing data
- **Use Case:** Development and production environments
- **Advantage:** Safe schema evolution

### Schema Creation
```sql
CREATE DATABASE taskmanage;
USE taskmanage;
```

---

## Entity Design & Implementation

### User Authentication Entity

#### Complete Entity Class
```java
package com.taskmanage.entity;

import javax.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_authentication")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthentication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
}
```

#### User Role Enum
```java
package com.taskmanage.entity;

public enum UserRole {
    ADMIN,
    MANAGER,
    DEVELOPER,
    TESTER
}
```

### Key Design Decisions

#### 1. Primary Key Strategy
- **GenerationType.IDENTITY:** Auto-generated unique IDs
- Resembles employee ID system
- Database-managed sequence

#### 2. Access Modifiers
- **Private fields** in entities for encapsulation
- **Public fields** in DTOs (no database storage, API transfer only)

#### 3. Lombok Annotations
**Benefits:**
- Reduces code by 20-25 lines per class
- Auto-generates getters, setters, constructors
- Increases developer productivity

**Key Annotations:**
- `@Getter` - Generates getter methods
- `@Setter` - Generates setter methods
- `@NoArgsConstructor` - No-argument constructor (required by frameworks)
- `@AllArgsConstructor` - Constructor with all fields

#### 4. Data Validation Constraints
- `@Column(nullable = false)` - Prevents null values
- `@Column(unique = true)` - Ensures email uniqueness
- `@Enumerated(EnumType.STRING)` - Stores enum as string in database

#### 5. Annotation Compatibility
- **Java 8:** Use `javax.persistence.*` annotations
- **Java 11+:** Can use `jakarta.persistence.*` annotations
- Version must match Java and Spring Boot version

### Data Transfer Objects (DTOs)

#### Registration DTO
```java
package com.taskmanage.dto;

import com.taskmanage.entity.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDTO {
    public String username;
    public String email;
    public String password;
    public UserRole role;
}
```

#### Login DTO
```java
package com.taskmanage.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    public String email;
    public String password;
}
```

#### Authentication Response DTO
```java
package com.taskmanage.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    public String token;
    public String message;
}
```

### Repository Layer

#### User Repository Interface
```java
package com.taskmanage.repository;

import com.taskmanage.entity.UserAuthentication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserAuthentication, Long> {
    
    Optional<UserAuthentication> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
```

#### Key Repository Features
- **JpaRepository Extension:** Provides CRUD operations automatically
- **Optional<> Return Type:** Prevents NullPointerException during queries
- **Custom Query Methods:** Spring Data JPA generates queries from method names

---

## Security & Authentication

### User Registration Requirements

#### Email Validation
- **Requirement:** Official company email ID only
- **Restriction:** Personal emails not allowed
- **Purpose:** Ensure organizational security
- **Validation:** Email domain verification recommended

#### Password Security
- **Encoder:** Spring Security password encoder
- **Storage:** Never store plain text passwords
- **Algorithm:** BCrypt (default) or configurable

#### Role Assignment
- **Method:** Enum-based fixed values
- **Purpose:** Determine UI access and permissions
- **Roles:**
  - **ADMIN:** Full system access
  - **MANAGER:** Project oversight and reporting
  - **DEVELOPER:** Code editing rights
  - **TESTER:** Web interface and testing access

### Authentication Flow

#### JWT (JSON Web Token) Implementation
**Advantages:**
- Stateless authentication
- Scalable for microservices
- Secure token-based system

**Components:**
- Token generation on successful login
- Token validation on protected endpoints
- Refresh token mechanism (future)

**Alternative:** OAuth 2.0 mentioned but not implemented in current phase

### Role-Based Access Control

#### Developer Permissions
- Full code editing access
- Repository commit rights
- Development environment access

#### Tester Permissions
- Web interface access only
- JSON response validation
- No code editing rights

#### Production Team Permissions
- Limited code viewing rights
- Deployment access
- Read-only repository access

### Security Features

#### Email Verification
- OTP (One Time Password) system
- Verification link via email
- Organization credential validation

#### Authentication Manager
- Spring Security integration
- Custom authentication logic
- Session management

---

## Development Guidelines

### Agile Process & Task Prioritization

#### Priority Levels and Deadlines

**High Priority:**
- **Deadline:** 24 hours
- **Use Case:** Critical bugs, production issues
- **Work Days:** May include weekends in exceptional cases

**Medium Priority:**
- **Deadline:** 15 working days
- **Work Days:** Monday to Friday only
- **Use Case:** Feature enhancements, moderate bugs

**Low Priority:**
- **Deadline:** Up to 1 month
- **Work Days:** Monday to Friday only
- **Use Case:** Nice-to-have features, minor improvements

#### Working Day Rules
- **Standard:** Monday to Friday count as working days
- **Weekends:** Excluded from deadline calculations
- **Exceptions:** Urgent production releases may require weekend work

### Daily Development Practices

#### Status Updates
- **Frequency:** Daily
- **Content:** Task progress, blockers, completion status
- **Purpose:** Track ongoing work before pull requests

#### Reporting Obligations
- **Audience:** Managers and project leads
- **Timing:** Before code submission
- **Content:** Progress reports, deployment readiness

### Spring Boot Project Initialization

#### Using Spring Initializer (Recommended)
**Website:** https://start.spring.io

**Advantages:**
- Pre-configured Maven project
- Automatic dependency injection
- Setup time: Less than 1 hour
- Eliminates manual dependency conflicts

**Configuration:**
- **Project:** Maven
- **Language:** Java
- **Spring Boot:** Latest stable version
- **Packaging:** JAR (for JSON responses)
- **Java Version:** Match your installed JDK

**Naming Convention:**
- **Group:** `com.taskmanage`
- **Artifact:** `task-management-system`
- **Package Name:** `com.taskmanage`
- Avoid generic names like "demo" or "example"

#### Manual Setup (Not Recommended)
- Step-by-step dependency addition
- Setup time: Over 1 hour
- Higher risk of configuration errors

### Essential Dependencies

#### Core Dependencies
```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- MySQL Driver (choose ONE database) -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Spring Boot Starter Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Spring Boot DevTools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

#### Dependency Selection Rules
- **Database:** MySQL OR MongoDB (NEVER both)
- **Configuration:** application.properties OR application.yml (interchangeable)
- **Security:** JWT for this project (OAuth 2.0 as future option)

### IDE Project Import Process

#### Step-by-Step Import
1. **Download:** Generate and download project ZIP from Spring Initializer
2. **Extract:** Unzip to non-system drive (e.g., G:\projects)
3. **Import:**
   - Open IDE
   - File → Import → Existing Maven Project
   - Navigate to extracted folder
   - Select `pom.xml`
4. **Build:** Maven will auto-download dependencies
5. **Configure:** Avoid adding to "working set" to prevent IDE issues

#### Troubleshooting Common Issues

**Java Version Mismatch:**
- Check IDE Java version: Project Properties → Java Build Path
- Verify pom.xml Java version
- Remove and re-add JRE System Library if needed

**Dependency Download Failures:**
- Check internet connection
- Clear Maven cache: `.m2/repository`
- Re-import Maven project

**DevTools Not Working:**
- Verify DevTools dependency in pom.xml
- Enable automatic restart in IDE settings
- Check build configuration

### Configuration Files

#### application.properties vs application.yml
Both serve the same purpose - choose based on preference:

**application.properties (Traditional):**
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanage
spring.jpa.hibernate.ddl-auto=update
```

**application.yml (Modern, Hierarchical):**
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/taskmanage
  jpa:
    hibernate:
      ddl-auto: update
```

### Development Best Practices

#### Code Quality
- Follow MVC architecture strictly
- Use meaningful package and class names
- Implement proper exception handling
- Write clean, readable code

#### Version Control
- Commit frequently with meaningful messages
- Use feature branches for new development
- Submit pull requests for code review
- Keep main/master branch stable

#### Testing
- Test APIs using Postman or Swagger
- Validate JSON responses
- Test role-based access control
- Perform integration testing

#### Team Collaboration
- **Preferred:** Build project as a team
- **Alternative:** Proceed individually if team coordination fails
- Regular status updates mandatory
- Clear communication channels

### Learning Approach

#### Project-Focused Learning
- **Emphasis:** Practical project work over deep theory
- **Theory:** Instructor provides notes for self-study
- **Hands-on:** Learning by building real features

#### Recommended Knowledge Areas
- **Java Fundamentals:** Strong foundation required
- **Data Structures & Algorithms (DSA):** Basic understanding for freshers
- **Spring Framework:** Learn through project implementation
- **Database Concepts:** SQL, JPA, ORM basics

#### Future Topics
- Microservices architecture (after monolithic completion)
- Message brokers (Kafka for notifications)
- Advanced security features (forgot/reset password)
- CI/CD pipeline integration
- Docker containerization

---

## FAQ

### Q1: Can we add multiple database dependencies (MySQL and MongoDB)?
**Answer:** No, only one database dependency should be added because the project connects to a single database type. Adding both causes dependency conflicts and configuration issues.

### Q2: Is it necessary to use the latest Java version?
**Answer:** No, use the Java version installed on your system. Compatibility must be ensured between IDE, Maven, and installed JDK. The project supports Java 8 or later.

### Q3: Can we use any IDE for this project?
**Answer:** Yes, Eclipse, STS, IntelliJ IDEA, and VS Code are all supported. The choice depends on user comfort and project requirements. Modern companies prefer VS Code and IntelliJ IDEA due to advanced features.

### Q4: Why use Spring Boot DevTools?
**Answer:** It auto-reloads the application upon code changes, saving development time by eliminating manual rebuilds and server restarts. This significantly improves developer productivity.

### Q5: Can properties and YAML files be used interchangeably?
**Answer:** Yes, both `application.properties` and `application.yml` serve the same configuration purpose. Choose based on personal preference or project standards.

### Q6: What happens if I use DDL mode `create` in production?
**Answer:** NEVER use `create` mode in production. It drops all tables on every restart, resulting in complete data loss. Always use `update` mode for production and development.

### Q7: Why use private access modifiers in entities but public in DTOs?
**Answer:** Entities represent database tables and require encapsulation for data security. DTOs are temporary data transfer objects for API communication and don't need strict encapsulation.

### Q8: What is the purpose of Optional<> in repository methods?
**Answer:** Optional prevents NullPointerException when database queries return no results. It provides a safe way to handle potentially null values, especially during email uniqueness checks.

### Q9: Can personal email IDs be used for registration?
**Answer:** No, only official company email IDs are allowed to ensure organizational security and proper access control.

### Q10: What is the difference between JWT and OAuth 2.0?
**Answer:** JWT is a token format for stateless authentication, while OAuth 2.0 is a complete authorization framework. This project uses JWT for simplicity; OAuth 2.0 is mentioned as a future alternative for more complex scenarios.

### Q11: How are weekends handled in task deadlines?
**Answer:** Weekends (Saturday and Sunday) are excluded from deadline calculations. Only Monday to Friday count as working days unless urgent production releases require weekend work.

### Q12: Why store projects outside the system drive?
**Answer:** Storing projects on non-system drives (e.g., G: drive) prevents data loss during system restore or formatting. System drives are more vulnerable to OS reinstallation.

### Q13: What is the role of JPA in this project?
**Answer:** JPA (Java Persistence API) serves as a bridge between application logic and the database, handling ORM (Object-Relational Mapping) with Hibernate as the implementation.

### Q14: How does Lombok reduce code length?
**Answer:** Lombok automatically generates getters, setters, constructors, and other boilerplate code through annotations, reducing class length by approximately 20-25 lines per entity.

### Q15: Will microservices be covered in this project?
**Answer:** Yes, microservices architecture will be introduced after completing the monolithic design. Topics include REST templates, service discovery, and inter-service communication.

---

## Contact and Communication

- **Primary Communication:** Email or during class sessions
- **Personal Contact:** Not shared for privacy and professionalism
- **Support:** Questions addressed during scheduled class time

---

## Document Version
**Last Updated:** Based on initial project setup and authentication module sessions  
**Status:** Active Development  
**Next Updates:** Will include additional modules, security implementation details, and advanced features

---

## Quick Reference Checklist

### Before Starting Development
- [ ] Java JDK installed and verified
- [ ] Maven installed and verified
- [ ] Environment variables configured
- [ ] System restarted after environment changes
- [ ] IDE installed (Eclipse/IntelliJ/VS Code)
- [ ] Database (MySQL/MongoDB) installed
- [ ] Project initialized via Spring Initializer
- [ ] Project imported into IDE successfully
- [ ] Database schema created
- [ ] Dependencies downloaded via Maven

### First Module: User Authentication
- [ ] Entity package created
- [ ] UserAuthentication entity created with annotations
- [ ] UserRole enum defined
- [ ] Repository interface created
- [ ] DTOs created (Registration, Login, AuthResponse)
- [ ] Database connection configured
- [ ] Tables auto-generated via JPA
- [ ] Repository methods tested

### Ready for Next Phase
- [ ] All setup verification complete
- [ ] Basic entity structure functional
- [ ] Database connectivity confirmed
- [ ] Team coordination established (or individual plan confirmed)
- [ ] Learning materials reviewed

---

*This documentation will be continuously updated as the project progresses through additional modules and advanced features.*

sequenceDiagram
    participant Citizen
    participant Application
    participant Database
    participant NotificationSystem
    participant GovernmentOfficial

    title End-to-End Appointment Booking Flow

    %% === Part 1: Citizen Books an Appointment ===
    Note over Citizen, Application: 1. Citizen Books an Appointment
    Citizen->>+Application: Login with credentials
    Application->>+Database: VerifyUser(credentials)
    Database-->>-Application: User authenticated
    Application-->>-Citizen: Display Dashboard

    Citizen->>+Application: Request to book an appointment
    Application->>+Database: Get available services and departments
    Database-->>-Application: Return list of services
    Application-->>-Citizen: Display services

    Citizen->>+Application: Selects Service, Department, and Date
    Application->>+Database: Query for available time slots
    Database-->>-Application: Return available slots
    Application-->>-Citizen: Display available time slots

    Citizen->>+Application: Confirms desired time slot
    Application->>Application: Generate QR Code and Reference Number
    Application->>+Database: CreateAppointment(details, status: 'Pending')
    Database-->>-Application: Appointment created successfully
    Application->>+NotificationSystem: Trigger appointment confirmation notification
    NotificationSystem-->>-Citizen: Send Email/SMS confirmation with details
    Application-->>-Citizen: Display booking confirmation page with QR Code

    %% === Part 2: Citizen Uploads Documents ===
    Note over Citizen, Application: 2. Citizen Submits Documents
    Citizen->>+Application: Selects appointment and uploads required documents
    Application->>+Database: SaveDocument(appointment_id, file_path)
    Database-->>-Application: Document saved successfully
    Application-->>-Citizen: Show "Upload Complete" message

    %% === Part 3: Government Official Review ===
    Note over Application, GovernmentOfficial: 3. Government Official Reviews Appointment
    GovernmentOfficial->>+Application: Login to Government Officer Portal
    Application->>+Database: VerifyOfficial(credentials)
    Database-->>-Application: Official authenticated
    Application-->>-GovernmentOfficial: Display Officer Dashboard

    GovernmentOfficial->>+Application: Request to view pending appointments
    Application->>+Database: GetPendingAppointments(department_id)
    Database-->>-Application: Return list of pending appointments
    Application-->>-GovernmentOfficial: Display pending appointments

    GovernmentOfficial->>+Application: Selects an appointment to review
    Application->>+Database: GetAppointmentDetailsAndDocuments(appointment_id)
    Database-->>-Application: Return appointment details and links to documents
    Application-->>-GovernmentOfficial: Display details and pre-submitted documents

    GovernmentOfficial->>+Application: Confirm Appointment
    Application->>+Database: UpdateAppointmentStatus(appointment_id, 'Confirmed')
    Database-->>-Application: Status updated successfully
    Application->>+NotificationSystem: Trigger status update notification
    NotificationSystem-->>-Citizen: Send Email/SMS: "Your appointment is confirmed"
    Application-->>-GovernmentOfficial: Show success message on dashboard

    %% === Part 4: Post-Appointment Feedback ===
    Note over Citizen, Application: 4. Post-Appointment Feedback
    alt Appointment is completed
        Citizen->>+Application: Submits feedback and rating for the appointment
        Application->>+Database: SaveFeedback(appointment_id, rating, comment)
        Database-->>-Application: Feedback saved successfully
        Application-->>-Citizen: Display "Thank you for your feedback"
    end
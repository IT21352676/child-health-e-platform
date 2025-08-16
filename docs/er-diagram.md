erDiagram
    USER {
        int user_id PK
        string first_name
        string last_name
        string email UK
        string password_hash
        string phone_number
        datetime created_at
    }

    DEPARTMENT {
        int department_id PK
        string name
        string description
    }

    GOVERNMENT_OFFICIAL {
        int official_id PK
        int department_id FK
        string first_name
        string last_name
        string email UK
        string password_hash
        string role
    }

    SERVICE {
        int service_id PK
        int department_id FK
        string name
        string description
        int avg_processing_time
    }

    APPOINTMENT {
        int appointment_id PK
        int user_id FK
        int service_id FK
        int confirmed_by_official_id FK
        datetime appointment_datetime
        string status
        string qr_code_data UK
        string reference_number UK
        datetime created_at
    }

    DOCUMENT {
        int document_id PK
        int appointment_id FK
        string file_name
        string file_path
        string document_type
        string status
        datetime upload_timestamp
    }

    NOTIFICATION {
        int notification_id PK
        int user_id FK
        int appointment_id FK
        string type
        string method
        text content
        datetime sent_at
    }

    FEEDBACK {
        int feedback_id PK
        int appointment_id FK
        int user_id FK
        int rating
        text comment
        datetime submitted_at
    }

    USER ||--o{ APPOINTMENT : "books"
    USER ||--o{ FEEDBACK : "provides"
    USER ||--o{ NOTIFICATION : "receives"
    DEPARTMENT ||--o{ SERVICE : "offers"
    DEPARTMENT ||--o{ GOVERNMENT_OFFICIAL : "employs"
    SERVICE ||--o{ APPOINTMENT : "is for"
    GOVERNMENT_OFFICIAL }o--o{ APPOINTMENT : "manages"
    APPOINTMENT ||--o{ DOCUMENT : "requires"
    APPOINTMENT |o--|| FEEDBACK : "has"
    APPOINTMENT ||--o{ NOTIFICATION : "triggers"


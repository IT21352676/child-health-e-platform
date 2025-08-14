**Remove when prod.**


**Base URL**: `/api/v1` <br>
**Authentication**: JWT Bearer Token required for all protected routes. The token will identify the user as a `Parent`.

## **1. Authentication**
Endpoints for parent registration and login.

<details>
<summary><span style="font-size: 18px;">Parent Registration</span></summary>

#### Endpoint
`auth/register`

#### Method
`POST`

#### Required Role
Public

#### Description
Registers a new parent account.

#### Request Body```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "password": "strongpassword123",
  "phoneNumber": "+94771234567"
}
```

#### Success Response (`201 Created`)
```json
{
  "status": "success",
  "message": "Parent account registered successfully.",
  "data": {
    "user": {
      "userId": "usr_12345",
      "firstName": "Jane",
      "email": "jane.doe@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

</details>

<details>
<summary><span style="font-size: 18px;">Parent Login</span></summary>

#### Endpoint
`auth/login`

#### Method
`POST`

#### Required Role
Public

#### Description
Authenticates a parent and returns their JWT.

#### Request Body
```json
{
  "email": "jane.doe@example.com",
  "password": "strongpassword123"
}
```

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "message": "Login successful.",
  "data": {
    "user": {
      "userId": "usr_12345",
      "firstName": "Jane"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

</details>

## **2. Parent & Child Management**
Endpoints for parents to manage their own profile and their children's profiles.

<details>
<summary><span style="font-size: 18px;">Get Parent Profile</span></summary>

#### Endpoint
`profile/parent`

#### Method
`GET`

#### Required Role
Parent

#### Description
Retrieves the profile information for the logged-in parent.

#### Request Body
`{}`

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "data": {
    "userId": "usr_12345",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phoneNumber": "+94771234567"
  }
}
```

</details>

<details>
<summary><span style="font-size: 18px;">Update Parent Profile</span></summary>

#### Endpoint
`profile/parent`

#### Method
`PUT`

#### Required Role
Parent

#### Description
Updates the profile information for the logged-in parent.

#### Request Body
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+94719876543"
}
```

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "message": "Profile updated successfully.",
  "data": {
    "userId": "usr_12345",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.doe@example.com",
    "phoneNumber": "+94719876543"
  }
}
```

</details>

<details>
<summary><span style="font-size: 18px;">Add New Child</span></summary>

#### Endpoint
`children`

#### Method
`POST`

#### Required Role
Parent

#### Description
Adds a new child profile to the parent's account.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2023-05-10",
  "gender": "Male",
  "birthWeight": 3.2
}
```

#### Success Response (`201 Created`)
```json
{
  "status": "success",
  "message": "Child added successfully.",
  "data": {
    "childId": "child_ABCDE",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2023-05-10"
  }
}
```

</details>

<details>
<summary><span style="font-size: 18px;">Get My Children</span></summary>

#### Endpoint
`children`

#### Method
`GET`

#### Required Role
Parent

#### Description
Retrieves a list of all children associated with the logged-in parent.

#### Request Body
`{}`

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "data": [
    {
      "childId": "child_ABCDE",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "2023-05-10"
    },
    {
      "childId": "child_FGHIJ",
      "firstName": "Emily",
      "lastName": "Doe",
      "dateOfBirth": "2025-01-15"
    }
  ]
}
```

</details>

<details>
<summary><span style="font-size: 18px;">Get Child Growth Data</span></summary>

#### Endpoint
`children/{childId}/growth`

#### Method
`GET`

#### Required Role
Parent

#### Description
Retrieves the growth history (weight, height) for a specific child.

#### Request Body
`{}`

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "data": {
    "childId": "child_ABCDE",
    "growthRecords": [
      { "recordId": "gr_01", "weightKg": 3.2, "heightCm": 50, "recordedAt": "2023-05-10" },
      { "recordId": "gr_02", "weightKg": 4.1, "heightCm": 54, "recordedAt": "2023-06-12" }
    ]
  }
}
```
#### Notes
The application will perform an authorization check to ensure the logged-in parent is the owner of the requested `childId`.

</details>

## **3. Appointment & Service Management**
Endpoints for booking and viewing appointments for a child.

<details>
<summary><span style="font-size: 18px;">Book an Appointment for a Child</span></summary>

#### Endpoint
`appointments`

#### Method
`POST`

#### Required Role
Parent

#### Description
Creates a new appointment (e.g., for a vaccine) for a specific child.

#### Request Body
```json
{
  "childId": "child_ABCDE",
  "serviceId": "svc_vax_02",
  "healthCenterId": "hc_15",
  "appointmentDatetime": "2025-10-20T09:30:00Z"
}
```

#### Success Response (`201 Created`)
```json
{
  "status": "success",
  "message": "Appointment booked successfully for John Doe.",
  "data": {
    "appointmentId": "appt_XYZ123",
    "childName": "John Doe",
    "serviceName": "Diphtheria, Tetanus, Pertussis (DTP) Vaccine",
    "appointmentDatetime": "2025-10-20T09:30:00Z",
    "status": "Pending Confirmation",
    "referenceNumber": "REF-XYZ123",
    "qrCodeData": "https://your-app.com/checkin?id=appt_XYZ123"
  }
}
```

</details>

<details>
<summary><span style="font-size: 18px;">Get Appointments for a Child</span></summary>

#### Endpoint
`children/{childId}/appointments`

#### Method
`GET`

#### Required Role
Parent

#### Description
Retrieves all appointments for a specific child.

#### Request Body
`{}`

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "data": [
    {
      "appointmentId": "appt_XYZ123",
      "serviceName": "DTP Vaccine",
      "appointmentDatetime": "2025-10-20T09:30:00Z",
      "status": "Confirmed"
    }
  ]
}
```

</details>

## **4. Government Official Portal**
Endpoints for officials to manage child health appointments.

<details>
<summary><span style="font-size: 18px;">Get Appointment Details (Official View)</span></summary>

#### Endpoint
`officer/appointments/{appointmentId}`

#### Method
`GET`

#### Required Role
GovernmentOfficial, Admin

#### Description
Retrieves full details of a specific appointment, including both parent and child information.

#### Request Body
`{}`

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "data": {
    "appointmentId": "appt_XYZ123",
    "parent": {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phoneNumber": "+94771234567"
    },
    "child": {
      "name": "John Doe",
      "dateOfBirth": "2023-05-10"
    },
    "serviceName": "DTP Vaccine",
    "appointmentDatetime": "2025-10-20T09:30:00Z",
    "status": "Pending Confirmation",
    "documents": []
  }
}
```

</details>
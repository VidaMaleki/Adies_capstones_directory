# Adies Capstones Hub Developer's APIs Endpoints

## Sign Up API Endpoint
In the sign-up file, I utilized `TypeScript`, `Next.js`, and a `Prisma` which constitutes a part of the backend for the Adies Capstones Hub a platform created for the students of Ada Developer Academy. 
This file specifically manages various RESTful API endpoints related to developer accounts within the application.
For Creating these APIs I used the [Udemy. com](https://www.udemy.com/course/full-authentification-with-react-js-next-js-typescript-2023/) course to make sure to create a secure sign-up and sign-in.


## Functionality Overview
The API supports several operations, catering to the needs of authorized Ada students. It includes the ability to:

#### 1- Create an Account: 
Allows authorized Ada students to create an account, ensuring that only students with approved email addresses can register.
#### 2- Fetch Developer Details: 
Get information about a specific developer, used for profile views, that developer can add an app and verifications.
#### 3- List All Developers: 
Returns a list of all registered developers, which can be used for adding the group project app to associate app for all members.
#### 4- Update Developer Information: 
Provides the functionality to update a developer's profile details.
#### 5- Delete Developer Account: 
Enables the removal of a developer's account from the directory, maintaining the integrity and relevance of the listed information.
In this Api, I check if the developer has an app and the developer is the only member to remove the app as well.
#### 6- Authenticate by Email: 
Fetches developer data based on the email, integrating with frontend session management for authenticated operations.

### Security Measures
#### Authorized Emails: 
The system checks against a list of authorized emails stored securely in an environment variable file `env.emails`, ensuring only eligible students can sign up.
#### Password Encryption: 
Passwords are encrypted using `bcryptjs` to safeguard user privacy and enhance security.
#### Input Validation: 
Input data such as the email, cohort number, and LinkedIn URL are also validated for proper format, preventing invalid data from being processed.
#### Role-based Access Control (RBAC): 
The authenticateByToken middleware ensures that only authenticated users can access certain API endpoints. This token-based authentication secures the API against unauthorized access.
#### Secure Environment Variables: 
Sensitive information, like the URL for account activation emails, is stored in environment variables. This prevents hardcoding sensitive details in the source code, which could be exposed in version control systems.
#### Account Activation Process: 
New accounts must go through an activation process, where an activation token is generated and sent via email. Users must visit the provided URL to activate their account, ensuring that the email address is valid and controlled by the user.
#### Error Handling: 
The API provides clear error messages for failure scenarios such as trying to register with an existing email address, but does not expose stack traces or detailed error information that could be used for malicious purposes.

## Purpose and Impact
This API is part of a larger initiative to showcase the capstone projects of Ada Developer Academy students. 
It serves as a platform for students to share their work, gain inspiration, and potentially connect with recruiters and hiring managers.


# Software Requirements
## Vision

CLI-J is a an application that allows the user to create, read, update, and delete categorized journal entries easily from their terminal and mobile or web app. After creating an account, associated with an e-mail address, the user can configure the application to automatically send daily/weekly/monthly e-mails to their e-mail address containing the notes from that time period. The purpose is to allow the user to quickly create and collect notes for meetings and other work events.

Modern forms of journalling or note taking require the use of a resource heavy application with an excessive amount of features that ultimately hinder the users ability to quickly jot down notes. Many digital journals make it difficult to categorize journal entries as well. This journal app will simplify these tasks by allowing you to use the CLI, mobile, or web app to enter an entry as well as a category.

This app will be lightweight, quick, and provided all the desired features of a true journal entry app while being accessible through the CLI. The application can easily be configured to automatically send emails containing these notes as well.

## Scope 
### IN 
- The app will allow a user to sign-up using their github credentials via OAuth
- This CLI app will allow the user to create, read, update, and delete journal entries in a MongoDB
- The user can configure the application to automatically send daily, weekly, monthly e-mails to their e-mail address ocontaining the notes from that time period
- The app will have a CLI, web, and mobile user interface
- Each function is easy to perform and execute through the CLI, mobile, and web interface
- The mobile app will be available on both Apple and Android mobile devices

### OUT - What will your product not do.
- 

### Minimum Viable Product 
- A server with OAuth that allows users to create an account and login to their account.
- Using CLI, mobile app, and web app user can manipulate journal entries using CRUD
- User can store an email address to their account related to their journal
- Every day, if journal entries were created that day, a plain text email will be sent to the user's email (doesn't end up in spam folder) address containing their - journal entries from that day.
- Journal entries will be timestamped
- User can configire an email scheduling profile

### Stretch
- Create additional options to set frequency and time of emails.
- Can have e-mails sent at multiple intervals for specific entry categories
- Create option for emails to be formatted with HTML.
- Allow for addition of attachments to journal entries
- Create multiple themes for HTML formatted emails.
- Add option to send the email immediately, with date/time range and categories of entries to be sent.
- Add option to include additional email addresses (sending to your boss)

### Functional Requirements
- A user can sign-up using OAuth
- A user can create, read, update, and delete journal entries.
- A user can add additional email addresses
- A user can list out journal entries within some paramaters

### Data Flow
![Data Path](./assets/coders-living-instant-journal-dom.jpeg) 


### Non-Functional Requirements 
- Our app will use OAuth to securely log in a client. 

- Our app will be simple to use. This app uses the command prompt to allow the user to create, read, update, and delete journal entries. The user will be able to add additional email addresses from all forms of the app. The commands and flow will be intuitive so as to create a smooth interface with the client and server/database.


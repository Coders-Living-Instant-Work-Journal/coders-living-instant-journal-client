# Software Requirements
## Vision

CLI-J is a an application that allows the user to create, read, update, and delete categorized journal entries easily from their terminal. After creating an account, associated with an e-mail address, the user can configure the application to automatically send daily/weekly/monthly e-mails to their e-mail address containing the notes from that time period. The purpose is to allow the user to quickly create and collect notes for meetings and other work events.

Modern forms of journalling or note taking require the use of a resource heavy application with an excessive amount of features that ultimately hinder the users ability to quickly jot down notes. Many digital journals make it difficult to categorize journal entries as well. This journal app will simplify these tasks by allowing you to use the CLI to enter an entry as well as a category.

This app will be lightweight, quick, and provided all the desired features of a true journal entry app while being accessible through the CLI. The application can easily be configured to automatically send emails containing these notes as well.

## Scope (In/Out)
### IN 
- The app will allows you to create a secure account with a username, email addres, and password
- This CLI app will allow the user to create, read, update, and delete journal entries in a MongoDB
- The user can configure the application to automatically send daily, weekly, monthly e-mails to their e-mail address ocontaining the notes from that time period
- Each function is easy to perform and execute through the CLI

### OUT - What will your product not do.
- Our product will not be a mobile app
- This app will not have a graphical user interface

### Minimum Viable Product 
- A server with authentication that allows users to create an account and login to their account.
- Using CLI, user can manipulate journal entries using CRUD
- User can store an email address to their account related to their journal
- Every day, if journal entries were created that day, a plain text email will be sent to the user's email (doesn't end up in spam folder) address containing their - journal entries from that day.
- Journal entries will be timestamped

### Stretch
- Create additional options to set frequency and time of emails.
- Can have e-mails sent at multiple intervals for specific entry categories
- Create option for emails to be formatted with HTML.
- Allow for addition of attachments to journal entries
- Create multiple themes for HTML formatted emails.
- Add option to send the email immediately, with date/time range and categories of entries to be sent.
- Add option to include additional email addresses (sending to your boss)

### Functional Requirements
- A user can create, read, update, and delete journal entries.
- A user can update their email address, username, and password
- A user can list out journal entries within some paramaters

### Data Flow
![Data Path](./assets/coders-living-instant-journal-dom.jpeg) 


### Non-Functional Requirements 
- Our app will securely store the users email and password by encrypting them on the client side using bcrypt. This ecrypted object will then be sent to the server and assigned a JWT token to authenticate the user so that personal information is never sent back and forth between the client and the server. The server will store the encrypted data in a database.

- Our app will be simple to use. This app uses the command prompt to allow the user to create, read, update, and delete journal entries. The user will be able to update their email and password directly from the CLI. The commands will be intuitive so as to create a smooth interface with the client and server/database.


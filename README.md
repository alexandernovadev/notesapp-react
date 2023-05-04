NotesApp
========

![NotesApp Screenshot](./screenshot.png)

Overview
--------

NotesApp is a web application built with React and Firebase that allows users to create and manage notes. Users can create an account, log in, and then create, edit, and delete notes. The application also has a search feature that allows users to search for notes by title or content.

Installation and Usage
----------------------

To use the application, you will need to have Node.js and npm installed on your machine. You will also need to have a Firebase account and create a Firebase project.

1.  Clone the repository: `git clone https://github.com/your-username/notes-app.git`
2.  Install dependencies: `yarn`
3.  Create a Firebase project and add a web app to it.
4.  Add the Firebase config to a `.env` file in the project root:

makefileCopy code

```
VITE_HOLA=Mundo en Testing!!
VITE_JWT_SEED=asjdkasdkas

VITE_APIKEY=sdfjksahdffirebase
VITE_AUTHDOMAIN=tracsd33333333xxxxxfirebaseapp.com
VITE_DATABASEURL=xxxxx.firebase.com
VITE_PROJECTID=tracker-8xxxxxxxx
VITE_STORAGEBUCKET=tracker-xxxxxxxxx.appspot.comxxx
VITE_MESSAGINGSENDERID=xxx8x8x8x8x88x
VITE_APPID=1.982774949f90x0033

```

5.  Start the development server: `yarn dev`
6.  Open the application in your browser at [http://localhost:3000](http://localhost:3000).

Features
--------

*   User authentication: Users can create an account and log in to access their notes.
*   Create, edit, and delete notes: Users can create new notes, edit existing notes, and delete notes they no longer need.
*   Search notes: Users can search for notes by title or content.
*   Responsive design: The application is designed to work on desktop and mobile devices.

Technologies Used
-----------------

*   React
*   Firebase
*   Sass
*   Jest
*   React Testing Library
*   ESLint
*   Prettier

Contributing
------------

If you would like to contribute to the project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch: `git checkout -b your-branch-name`
3.  Make your changes and commit them: `git commit -m "your commit message"`
4.  Push to the branch: `git push origin your-branch-name`
5.  Submit a pull request.

License
-------

This project is licensed under the MIT License. See the LICENSE file for more information.
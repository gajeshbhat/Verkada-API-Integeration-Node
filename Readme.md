## JD Sports Sales API Integration with Verkada Helix API

### Project Description
This project is designed to integrate the JD Sports Sales API with the Verkada Helix API to track in-store events. The project consists of several Node.js files, including app.js, constants.js, models.js, and utils.js, which all work together to fetch and store data from the Sales API and integrate it with the Verkada Helix API.

### Usage
Once the project is running, you can access the following endpoints provided the cron job is already run and data in the database is populated

1. GET /items/:item_id - fetches details for a specific item
2. GET /cameras/:camera_id - fetches details for a specific camera
3. GET /pos/:pos_id - fetches details for a specific point of service
4. GET /stores/:store_id - fetches details for a specific store
5. GET /footage?camera_id=CAMERA_ID&timestamp=TIMESTAMP - fetches the footage link for a specific camera and timestamp

**The project also includes a scheduled cron job that runs every hour to fetch and store data from the Sales API and integrate it with the Verkada Helix API.**

### Installation
1. Make sure you have already installed the NodeJS on your machine. https://nodejs.org/en/download
2. Move into the project directory and run `npm install -y` to install the project dependencies.
3. run `node app.js` to start the project.

### The project consists of the following components:

1. `app.js`: The main entry point for the application, which sets up the Express server, initializes the database models, and schedules a cron job to periodically fetch and store data from the JD Sports Sales API and integrate it with the Verkada Helix API.
2. `constants.js`: A file that defines constants such as API endpoint URLs and API keys.
3. `models.js`: A file that defines the Sequelize models for the database tables.
4. `utils.js`: A file that contains utility functions for fetching data from APIs, storing data in the database, and posting data to the Verkada Helix API.
5. `package.json`: A file that lists the project's dependencies.
6. `.env` : A file that contains the environment variables for the project.
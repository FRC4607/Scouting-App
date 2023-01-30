# CIS Scouting App


## Overview

This app is a modified version of the [Black Hawks Scouting](https://github.com/FRC2834/blackhawks-scouting) app. The app is able to run in either a docker container or some other NodeJS compatible environment. It has integration with a MySQL database for external management and analysis along with a CSV export.

Powered by [Vue.js](https://vuejs.org) and [The Blue Alliance](https://thebluealliance.com).


## Features
 - Offline app and data storage
 - Works with most web browsers
 - Data transfer between devices via QR codes. (Requires a HTTPS connection)
 - MySQL database integration
 - Configurable without code changes by using pre-made widgets (see [config.md](docs/config.md) in docs)


## Setup
1. Obtain a Blue Alliance read API key from the [account page](https://www.thebluealliance.com/account).
2. Create a file named `.env.local` in the root folder and inside of it put: `VITE_TBA_API_KEY=`***```your_api_key```***
3. Setup a MySQL database named `scouting` and create a user for it with `SELECT`, `INSERT`, `UPDATE`, `CREATE`, `DROP`, and `ALTER` permissions.
4. Create a file named `mysql-config.json` in the `backend/` folder and add the MySQL login information in this format:
```json
{
    "host": "your hostname or IP (eg. host.com)",
    "port": "3306",
    "user": "your username",
    "password": "your password",
    "database": "scouting"
}
```
5. If you plan to use the pictureupload widget, you will need to add a configuration file named `imageServerConfig.ts` in the root folder that contains the code below with your information added. This is used to connect to a file storage server (like Nextcloud or a network share) using a WebDAV connection. If you do not plan to use the pictureupload widget, you can skip this step.
```ts
export const imageServerConfig =  {
    "server": "your hostname or IP (eg. host.com)",
    "username": "your username",
    "password": "your password"
  }
```


## Configuration 

### Frontend
Configuring the interface and data fields is easy and codeless! You just need to add widget configurations to a couple JSON files. Refer to [config.md](docs/config.md) in docs for details.

### Backend
The backend needs to know what data fields your app is using so it can properly handle and save them. The data types and fields can be configured in `backend/src/TableSchemes.ts`. The naming scheme must be consistent with what is configured in the [config files](docs/config.md). The name field must be all lowercase and any spaces should be replaced with underscores (eg. "Hello There" becomes "hello_there"). Make sure there is a table scheme entry for each of the items in the config files or the database will not save all of the data. To help you out in case you miss some, any fields that you forget to add to the table scheme will be logged to the console of the app when you try to upload data to the database. Keep an eye out for these messages while you are testing things out.


## Open Source

#### License
Licensed under the MIT License, see the [license document](/LICENSE.txt) for the full license terms.

#### Contributing
Contributions are welcome and encouraged! Please feel free to open issues for problems you encounter or feature requests you come up with. If you would like to contribute code, please open a pull request and describe your changes and reasoning for them. Thank you in advance for your help!

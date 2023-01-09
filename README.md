# CIS Scouting App


## Overview

This app is a modified version of the [Black Hawks Scouting](https://github.com/FRC2834/blackhawks-scouting) app. The app is run in either a docker container or some other NodeJS compatible environment. It has integration with a MySQL database for external management and analysis along with a CSV export.

Powered by [Vue.js](https://vuejs.org) and [The Blue Alliance](https://thebluealliance.com).


## Features
 - Offline app
 - Works with most web browsers
 - Data transfer between devices: Data can be transferred between devises via QR codes. (Requires a HTTPS connection)
 - MySQL database integration
 - Configurable


## Setup
1. Obtain a Blue Alliance read key from the [account page](https://www.thebluealliance.com/account).
2. Create a file named `.env.local` and inside of it put: `VITE_TBA_API_KEY=`***```your_api_key```***
3. Setup a MySQL database 
4. crate a file named `backend/mysql-config.json` and add the login information in this format:
```json
{
    "host": "host.com",
    "port": "3306",
    "user": "username",
    "password": "password",
    "database": "scouting"
}
```


## Configuration 

### Frontend
Refer to [config.md](docs/config.md) in docs.

### Backend
The data types and fields can be configured in `backend/src/TableSchemes.ts` the naming scheme must be consistent with what in configured in the [config files](docs/config.md). The name field is parsed as all lowercase and underscores replace spaces.


## Open Source

Licensed under the MIT License, see the [license document](/LICENSE.txt) for the full license terms.

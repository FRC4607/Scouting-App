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
    "database": "scouting",
    "charset" : "utf8mb4"
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

### Flexibility

Black Hawks Scouting works in your browser and runs anywhere, no matter if you're scouting on a tablet or testing on a computer.

**No download is required on any of your scouting devices!** Once you visit the app on a device, you can bookmark it or save it to your home screen. It'll continue to work, even offline.

There are no restrictions on what you can use to analyze your data - Black Hawks Scouting exports in a standard format called Comma-Separated Values (CSV). Your team has the option to use anything from custom Python scripts to professional-grade tools like Tableau and Excel.

### Ease of Use

Even with its advanced features, Black Hawks Scouting is designed to be approachable by your team's scouters. You can easily navigate within scouting forms with a navigation menu at the bottom of each form.

Black Hawks Scouting also provides a built-in Data Inspector allowing you to view and manage your scouted data, before you download them.

### Offline Usage

With internet often being unreliable at competitions, Black Hawks Scouting has the capability to work fully offline by making use of special browser features. Once you load it with an internet connection, it remains available on your device with the same URL, even without an internet connection or download.

*Tip: You can use The Blue Alliance data offline too!* Once you load match information online from a form's Team Selection page, Black Hawks Scouting caches it in local storage. On subsequent scouting sessions, you can leave the Event Key field blank and press the Load button to use the cached data. This is faster than an online load and doesn't require internet.

### Security

Black Hawks Scouting uses standard obfuscation techniques to isolate your TBA key from the app's source code. This makes it harder for users to access your key, but because the app runs entirely in the user's browser, it cannot completely hide the key.

The app also supports the security features of your browser, working even with HTTPS, tracking protection, and cookie blocking.

## System Requirements

Black Hawks Scouting can work on Windows, macOS, and Linux. In addition, mobile devices with Android and iOS are also supported. The following browser versions are recommended:

- Google Chrome 100+
- Microsoft Edge 100+
- Mozilla Firefox 100+
- Apple Safari 15.5+

## Open Source

#### License

Licensed under the MIT License, see the [license document](/LICENSE.txt) for the full license terms.

#### Contributing

Contributions are welcome and encouraged! Please feel free to open issues for problems you encounter or feature requests you come up with. If you would like to contribute code, please open a pull request and describe your changes and reasoning for them. Thank you in advance for your help!

## Credits

This program uses modified images from
<https://www.chiefdelphi.com/t/2024-crescendo-top-down-field-renders/447764>.

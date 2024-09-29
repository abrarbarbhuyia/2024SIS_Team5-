# Food for Thought
A unique restaurant recommendation app to help people with dietary requirements find restaurants by analyisng menu data.

Developed by Team 5, Software Innovation Studio (41129), Spring 2024.

# How to Run the App
## Dependencies
Install the latest version of [NodeJS](https://nodejs.org/en/download) and NPM. Check if it has been installed using `node -v`, `npm -v`.

Install [Expo Go](https://docs.expo.dev/get-started/set-up-your-environment/) for your development environment.

## Environment Variables
Add relevant environment variables in `app.json` under `"extra"`.
```json
{
    "expo": {
        "extra": {
            "HOST_IP": "127.0.0.1"
        }
    }
}
```

## Terminal
```bash
cd food-for-thought
npm install
npx expo start
```
Then you're good to go! Scan the QR Code via the Expo Go app on an Android Device or via the Camera on iOS.

Note: You don't need to make an account/log in with the Expo Go mobile app.

## Documentation
Documentation related to the project has been uploaded to the `/documentation` folder. 

## Wireframe
UI Wireframes related to the project has been uploaded to the `/documentation/wireframes` folder. 
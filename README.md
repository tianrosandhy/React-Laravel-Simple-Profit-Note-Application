# Profit Note Simple App

This is my first React SPA exercise application that use React Vite as Frontend and Laravel as Backend. You can easily deploy this app in your local or server with this specification: 
- React 18 (need NodeJS and package manager such as Bun, NPM, or Yarn)
- Laravel 11 (need PHP 8.2 or more)
- [Fonnte free whatsapp unofficial API](https://fonnte.com) for OTP service (optional)

### Installation
1. Clone this repository

2. Setup the laravel apps first
    - Go to `./laravel` directory
    - Run `composer install`
    - Copy `.env.example` to `.env`
    - Setup the .env file. by default we will use SQLite (no database setup required in .env). 
    - Note: make sure you use `APP_ENV=local` if you dont want to use Fonnte whatsapp chatbot service, so the OTP will be automatically set as "123456" when requested.
    - Register your mobile whatsapp device to fonnte (FREE!), and copy the device token that has been connected to .env in `FONNTE_TOKEN=` (Optional)
    - Run `php artisan migrate` to initiate database structure
    - Run `php artisan serve` to enable the API Service

3. Setup the frontend apps
    - Back to `./react` directory 
    - Run `bun install` or `npm install` or `yarn` to install package dependencies
    - Copy the `.env` file to `.env.local`. Make sure the `VITE_BE_URL` pointing to laravel api endpoint, and `VITE_BE_BASIC_KEY` is same as laravel .env `APP_BASIC_KEY`.
    - Run `bun run dev` or `npm run dev` or `yarn run dev` to run the local development server. Application will be served at "http://localhost:5173"

4. You can start using the app now. Feel free to modify or refactor the code.

5. To build the frontend, run `bun run build` or `npm run build` or `yarn run build`
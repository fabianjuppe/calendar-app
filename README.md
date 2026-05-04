# Calendar App

A full-featured calendar built with Next.js, MongoDB and styled-components.

## Features

- Monthly calendar view with mobile swipe navigation
- Create, edit and delete events (authorized users)
- Recurring events (weekly)
- Trash / restore deleted events
- Category filtering with subcategories
- ICS export for Google/Apple Calendar subscription
- Authentication via GitHub OAuth or username/password

## Tech Stack

- Next.js (Pages Router)
- MongoDB + Mongoose
- Styled Components
- NextAuth.js
- SWR
- dayjs
- ical-generator

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in values
3. Install dependencies: `npm install`
4. Run: `npm run dev`

## Use in other projects

This repository can be integrated as a Git submodule:
`git submodule add https://github.com/dein-name/calendar-app.git calendar`

# Agent List Distributor

MERN stack machine-test project with admin login, agent management, CSV/XLS/XLSX upload, sequential list distribution across 5 agents, and a React dashboard.

## Features

- Admin login with JWT authentication
- Add, edit, list and delete agents
- Demo seed script for admin and 5 agents
- Agent mobile validation with country code, for example `+919876543210`
- Upload `.csv`, `.xlsx`, `.xls` and `.axls` files
- Validate required columns: `FirstName`, `Phone`, `Notes`
- Distribute uploaded rows equally across the first 5 agents
- Store each distribution batch in MongoDB
- Display uploaded batches and per-agent assigned items

## Prerequisites

- Node.js
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create the backend env file:

```bash
copy server\.env.example server\.env
```

3. Update `server/.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agent_list_distributor
JWT_SECRET=replace_this_with_a_long_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
```

If MongoDB is not installed locally, use MongoDB Atlas and replace `MONGO_URI` with your Atlas connection string.

The login page will show a fetch error if the backend is not running. The backend will not start until MongoDB is reachable.

4. Start MongoDB.

For a local MongoDB install, make sure the MongoDB service is running. For Atlas, make sure your `MONGO_URI` is correct and your IP address is allowed in Atlas Network Access.

5. Create the admin user:

```bash
npm run seed:admin
```

Or create the admin user plus 5 demo agents:

```bash
npm run seed:demo
```

6. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

You can also start them separately:

```bash
npm run server
npm run client
```

## Login

Default seeded admin credentials:

- Email: `admin@example.com`
- Password: `Admin@12345`

## Demo Agents

`npm run seed:demo` creates these agents automatically:

| Name | Email | Mobile | Password |
| --- | --- | --- | --- |
| Asha Nair | `asha.agent@example.com` | `+919876543210` | `Agent@123` |
| Ravi Kumar | `ravi.agent@example.com` | `+919876543211` | `Agent@123` |
| Meera Shah | `meera.agent@example.com` | `+919876543212` | `Agent@123` |
| Kiran Rao | `kiran.agent@example.com` | `+919876543213` | `Agent@123` |
| Sneha Patel | `sneha.agent@example.com` | `+919876543214` | `Agent@123` |

## Upload Format

The upload file must contain these headers:

```csv
FirstName,Phone,Notes
```

Two sample files are available at `sample-data`.

Before uploading, create at least 5 agents. If the uploaded list has a remainder, the extra rows are distributed sequentially from the first agent onward.

## Demo Video

Record a short demo showing:

- Admin login
- Creating 5 agents
- Uploading `sample-data/leads.csv`
- Viewing distributed lists

Upload the video to Google Drive and paste the share link here:

`Demo link: <add Google Drive link>`

# IronPeak Gym Management and IoT Access

A full-stack gym management prototype with an admin dashboard, member portal, payment and membership tracking, interest-form lead management, and ESP32/MFRC522 NFC access hardware. The web application is composed of a React/Vite frontend and a Spring Boot REST API backed by PostgreSQL. Docker Compose also starts an MQTT broker for UUID delivery to the card-writing ESP32.

> **Live demo:** [Open IronPeak Gym on Railway](https://ironpeak-gym-demo.up.railway.app/). This public demo is for evaluation only; do not submit real member or payment data.
>
> **Prototype / security notice:** This project is not production-ready and must not control a real gym entrance. Complete the security work listed in [Security and prototype limitations](#security-and-prototype-limitations) before production use. Example environment values are not production credentials.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology](#technology)
- [Run with Docker Compose](#run-with-docker-compose)
- [Configuration](#configuration)
- [Run services separately](#run-services-separately)
- [Web pages](#web-pages)
- [REST API overview](#rest-api-overview)
- [ESP32 and NFC hardware](#esp32-and-nfc-hardware)
- [Tests and quality checks](#tests-and-quality-checks)
- [Project layout](#project-layout)
- [Troubleshooting](#troubleshooting)
- [Security and prototype limitations](#security-and-prototype-limitations)
- [Screenshots and hardware diagrams](#screenshots-and-hardware-diagrams)
- [License](#license)

## Features

### Admin

- Dashboard metrics, occupancy activity, recent member activity, and recent registrations.
- Create members and extend memberships.
- Review interest-form submissions, track lead follow-up stages and notes, contact leads, and convert leads into members.
- Record payments and generate receipt numbers.
- View members, export member data as CSV, and review upcoming renewals.
- Manage membership prices and record body measurements.

### Member

- View membership days remaining and recorded body measurements.
- Change the current password.

### NFC / IoT

- Create a member UUID and publish it to MQTT topic `nfc` for an ESP32 card writer.
- Read card data with an ESP32 and MFRC522 reader, then ask the backend to toggle the member's check-in/check-out state.
- Record occupancy events used by the admin dashboard.

## Architecture

```text
Browser (React + Vite)
	| HTTP / JSON, JWT for protected routes
	v
Spring Boot REST API --------------------> PostgreSQL
	|                                       |
	| MQTT publish: topic "nfc"             | members, payments,
	v                                       | measurements, events
Mosquitto broker                               |
	|                                       |
	v                                       |
ESP32 card writer (MFRC522)                    |

ESP32 card reader (MFRC522) -- HTTP UUID check-+
```

The card-writing firmware subscribes to `nfc` and writes the received 36-character UUID to MIFARE blocks 4-6. The card-reading firmware reads those blocks and posts the UUID to the backend access endpoint. The backend stores the member and occupancy data in PostgreSQL.

## Technology

| Area | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, styled-components, Axios |
| Backend | Java 17, Spring Boot 3.2, Spring MVC, Spring Security, Spring Data JPA |
| Authentication | JWT access/refresh tokens |
| Validation | Jakarta Bean Validation |
| Database | PostgreSQL 15 |
| Messaging | Eclipse Mosquitto 2, Eclipse Paho MQTT client |
| Hardware | ESP32, MFRC522 RFID reader/writer |
| API docs | Springdoc OpenAPI / Swagger UI |
| Containers | Docker and Docker Compose V2 |
| Tests | JUnit 5, Spring Boot Test, MockMvc, H2 test database |

## Run with Docker Compose

### Prerequisites

- Docker Desktop with Docker Compose V2, or Docker Engine with the Compose plugin.
- Git, if cloning the repository.

Check that Compose V2 is available:

```powershell
docker compose version
```

### Start the app

From the repository root:

```powershell
Copy-Item .env.example .env
docker compose config --quiet
docker compose up --build -d
docker compose ps
```

`docker compose` (with a space) is the current command. The legacy `docker-compose` executable may not be installed. Compose reads the root `.env` automatically; `.env` is ignored by Git. Edit it before starting if you need local overrides.

Follow startup logs if a service is not ready:

```powershell
docker compose logs -f backend_app
docker compose logs -f frontend_app
```

Stop the stack while preserving database data:

```powershell
docker compose down
```

The PostgreSQL data is kept in the `postgres_data` Docker volume. **Do not use `docker compose down -v` unless you intend to permanently remove that database volume.**

### Local URLs and ports

| Service | Local address / port | Notes |
| --- | --- | --- |
| Frontend | `http://localhost/` | Host port 80 maps to the Vite development server in the container. |
| Backend | `http://localhost:8080/` | Spring Boot REST API. |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` | Interactive API documentation. |
| PostgreSQL | `localhost:5433` | Host port 5433 maps to container port 5432. |
| MQTT | `localhost:1883` | MQTT TCP listener. |
| MQTT WebSocket | Dynamically assigned | Host port is configured as `0:9001`; see `docker compose ps`. |
| Adminer | Dynamically assigned | Host port is configured as `0:8080`; see `docker compose ps`. |

Use `docker compose ps` to find the actual host ports assigned to Adminer and MQTT WebSocket. Within the Compose network, Adminer connects to the database host `postgresql_db`; the backend connects to `postgresql_db:5432`.

### Initial admin account

The backend seeds an admin account only when the configured admin email is not already present in the database. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` **before the first start with an empty/new database**. The seed process does not update an existing account's password; change an existing password through the app or a planned credential-rotation procedure. Admin password changes require a one-time code sent to `PASSWORD_CHANGE_OWNER_EMAIL`.

## Configuration

The committed [.env.example](.env.example) contains local-only sample values. Copy it to `.env` and replace values as needed. Never commit `.env`, share it, or reuse its development values in a deployed environment.

| Variable | Purpose | Local example behavior |
| --- | --- | --- |
| `DATABASE_URL` | JDBC URL used by the backend | Compose default points to `postgresql_db:5432/gym_app`. |
| `DATABASE_USERNAME` | PostgreSQL role name | Local Compose default is `postgres`. |
| `DATABASE_PASSWORD` | PostgreSQL role password | Local Compose default is `postgres`; change for non-local use. |
| `JWT_SECRET` | Base64-encoded HMAC signing key | Example key is for development only. Generate a unique strong key for each deployment. |
| `ADMIN_EMAIL` | Email used when seeding a new admin | Used only if no matching account exists. |
| `ADMIN_PASSWORD` | Password used when seeding a new admin | Development-only fallback; existing users are not reset. |
| `SMTP_USERNAME` | SMTP account username | Example uses an invalid placeholder; email delivery will not work until configured. |
| `SMTP_PASSWORD` | SMTP credential / app password | Example is not a working mail credential. |
| `PASSWORD_CHANGE_OWNER_EMAIL` | Mailbox that receives admin password-change codes | Set to the demo owner's email; requires working SMTP settings. |
| `BROKER_URL` | Backend MQTT broker URL | Compose default is `tcp://mqtt:1883`. |
| `VITE_API_URL` | Frontend API origin for Vite | Defaults in frontend code to `http://localhost:8080`; set when running the frontend separately or accessing it from another device. |

Generate a JWT secret rather than reusing the sample value. PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

Bash:

```bash
openssl rand -base64 64
```

For Gmail SMTP, use an App Password and enable the required account security settings; do not put your normal Gmail password in `.env`. If deploying to a LAN or hosted environment, configure `VITE_API_URL` to the backend address that browsers on those clients can reach, not a container-only hostname.

Changing `DATABASE_PASSWORD` in `.env` does not rotate the password stored in an already-initialized PostgreSQL volume. Update the database role and both application/database configuration together before changing it on an existing installation.

## Run services separately

Docker Compose is the recommended local path. To run the backend and frontend directly on your machine, use Java 17, Node.js 18 or newer, and pnpm. Start PostgreSQL and Mosquitto first; adjust the connection settings for services running on the host.

### Backend

Start the database and broker containers:

```powershell
docker compose up -d postgresql_db mqtt
```

In a second PowerShell window:

```powershell
cd gym-app-backend
$env:DATABASE_URL = "jdbc:postgresql://localhost:5433/gym_app"
$env:DATABASE_USERNAME = "postgres"
$env:DATABASE_PASSWORD = "postgres"
$env:BROKER_URL = "tcp://localhost:1883"
.\mvnw.cmd spring-boot:run
```

Set production-like secrets in the process environment before running outside Docker.

### Frontend

From another terminal:

```powershell
cd gym-app-frontend
pnpm install
$env:VITE_API_URL = "http://localhost:8080"
pnpm dev
```

Vite prints the local URL, normally `http://localhost:5173`. `VITE_API_URL` is read by Vite; when opening the site from another computer, set it to an API origin reachable from that computer.

Create and preview a production frontend bundle:

```powershell
pnpm build
pnpm preview
```

## Web pages

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/plans` | Membership plans |
| `/contact` | Contact form |
| `/join` | Public interest form |
| `/login` | Login |
| `/dashboard` | Member or admin dashboard, based on role |
| `/password` | Change password |
| `/register` | Registration information / join link |
| `/unauthorized` | Access-denied page |

The page component files use English names under `gym-app-frontend/src/components/`. The visible site content remains as authored in the UI.

## REST API overview

All API routes are under `/api/v1`. Protected endpoints expect `Authorization: Bearer <access-token>` unless otherwise noted.

| Method | Path | Purpose / access |
| --- | --- | --- |
| `POST` | `/generateToken` | Authenticate and receive JWT/refresh token; public. |
| `POST` | `/refreshToken` | Refresh an access token; public route. |
| `POST` | `/changePassword` | Change current password; request must include the authenticated user's bearer token. |
| `GET` | `/prices` | Read membership prices; public. |
| `POST` | `/interest` | Submit an interest form; public. |
| `GET` | `/interest` | Retrieve interest forms. **Currently permitted without authentication by the security matcher; restrict this before public deployment.** |
| `PATCH` | `/interest/{id}/approve` | Approve a lead; falls under the authenticated/admin route rules. |
| `POST` | `/sendEmail` | Send a contact/interest email; public route. |
| `POST` | `/isAllowedToPass` | NFC access check and check-in/check-out toggle; currently public. |
| `GET` | `/days` | Authenticated member's remaining membership days. |
| `GET` | `/measurements` | Authenticated member's measurement history. |
| `POST` | `/saveUser` | Create a member; admin. Generates/publishes a card UUID. |
| `POST` | `/updateDate` | Extend a member's expiry; admin. |
| `POST` | `/priceUpdate` | Update membership plan prices; admin. |
| `POST` | `/measurementCreate` | Add a member measurement; admin. |
| `GET` | `/insides` | Get the current occupancy count; admin. |
| `GET` | `/members` | List members and membership status; admin. |
| `GET` | `/members/export` | Download member CSV; admin. |
| `GET` | `/dashboard/stats` | Dashboard summary; admin. |
| `GET` | `/dashboard/occupancy?days=7` | Occupancy activity; admin. `days` is clamped by the service. |
| `GET` | `/activity?limit=15` | Recent activity; admin. |
| `GET` | `/renewals` | Members expiring soon; admin. |
| `POST` | `/renewals/remind` | Send a renewal reminder; admin. |
| `POST` | `/payments` | Record a payment and extend membership; admin. |
| `GET` | `/payments` | List payments; admin. |
| `GET` | `/payments/member/{email}` | List a member's payments; admin. |

Validation annotations are applied to request DTOs and enforced by controller `@Valid` annotations. Payment creation also generates a receipt number and updates the membership end date.

## ESP32 and NFC hardware

Firmware is in `esp32_gym_app_receiver/` and `esp32_gym_app_transmitter/`. The sketches use the ESP32 Arduino core and MFRC522 library. The MQTT-writing sketch also requires the PubSubClient library.

### Card writer (`esp32_gym_app_transmitter`)

1. Install ESP32 board support and the `MFRC522` and `PubSubClient` Arduino libraries.
2. Set the Wi-Fi SSID/password and MQTT broker IP in the sketch. The broker listens on port `1883` and the topic is `nfc`.
3. Upload to the ESP32 connected to an MFRC522. The sketch uses SS/SDA on GPIO 5 and reset on GPIO 22; SPI uses the board's standard ESP32 pins.
4. When the backend creates a member, it publishes the UUID. The writer subscribes and writes the UUID across card data blocks 4, 5, and 6.

### Card reader / access controller (`esp32_gym_app_receiver`)

1. Set the Wi-Fi SSID/password and `serverUrl` in the sketch. `serverUrl` must be the backend's LAN-reachable URL ending in `/api/v1/isAllowedToPass` (for example, `http://<server-lan-ip>:8080/api/v1/isAllowedToPass`). Do not use `localhost` on the ESP32; that would refer to the ESP32 itself.
2. Wire MFRC522 SS/SDA to GPIO 5 and reset to GPIO 22. Green and red status LEDs use GPIO 14 and GPIO 33.
3. The reader reads the UUID from blocks 4-6 and sends it as JSON. A successful HTTP 200 lights the green LED; other responses light the red LED.

Power the MFRC522 from 3.3 V and follow the wiring diagrams in `images/electronics/` and the component datasheets in `datasheet/`. Verify the exact board pinout before wiring hardware.

## Tests and quality checks

Backend integration tests use an in-memory H2 database, MockMvc, the real Spring Security filter chain, JPA repositories, and service logic. They do not require the Compose database or MQTT broker.

```powershell
cd gym-app-backend
.\mvnw.cmd test
```

If Java 17 is installed with a working `JAVA_HOME`, the Maven wrapper runs on the host. Alternatively, build/run the tests in the Java 17 Maven container used by the backend Dockerfile.

Frontend checks:

```powershell
cd gym-app-frontend
pnpm lint
pnpm build
```

The backend Dockerfile currently uses `mvn package -DskipTests` when building its runtime image. Run the test command separately to execute the integration suite.

## Project layout

```text
.
|-- .env.example                 # Local-only Compose variable template
|-- docker-compose.yml           # Frontend, API, PostgreSQL, MQTT, Adminer
|-- db/init.sql                  # Creates the gym_app database
|-- gym-app-backend/
|   |-- Dockerfile
|   |-- pom.xml
|   `-- src/main/java/com/furkankaya/
|       |-- controller/          # REST endpoints
|       |-- dto/                 # API request/response contracts
|       |-- model/               # JPA entities
|       |-- repository/          # Spring Data repositories
|       |-- security/            # JWT/security filters and rules
|       `-- service/              # Business logic, mail, MQTT, JWT
|-- gym-app-frontend/
|   |-- Dockerfile
|   |-- package.json
|   `-- src/
|       |-- App.jsx               # Client routes
|       |-- api.js                # API origin and /api/v1 base path
|       `-- components/           # Pages and dashboard components
|-- esp32_gym_app_receiver/       # NFC reader and HTTP access check
|-- esp32_gym_app_transmitter/    # MQTT subscriber and NFC card writer
|-- mqtt/config/mosquitto.conf    # Local prototype broker configuration
|-- images/                       # Screenshots, diagrams, and wiring
`-- datasheet/                    # Component datasheets
```

## Troubleshooting

### `docker-compose` is not recognized

Use Docker Compose V2 with a space:

```powershell
docker compose up --build -d
```

Update Docker Desktop if `docker compose version` is unavailable.

### Backend cannot connect to PostgreSQL

- Check `docker compose ps` and `docker compose logs postgresql_db backend_app`.
- Inside Compose, the database hostname is `postgresql_db` and port is `5432`.
- From the host, PostgreSQL is published on port `5433`.
- A persisted `postgres_data` volume retains its initialized database credentials and contents. Changing environment variables does not reinitialize that volume.

### Browser cannot reach the API

- Confirm the backend is running at `http://localhost:8080`.
- Check the browser's API origin. The default is `http://localhost:8080`; set `VITE_API_URL` to the host-reachable API origin for LAN access.
- If the UI or API ports are occupied, update the Compose port mapping and use the new address.

### ESP32 cannot connect

- Use the computer/server's LAN IP in firmware, not `localhost`.
- Confirm the ESP32 and host are on reachable networks and firewall rules allow the configured ports.
- The card writer connects to MQTT port `1883`; the card reader calls the backend on port `8080`.
- Check Serial Monitor output and confirm the card contains a valid UUID in blocks 4-6.

### Email does not send

The sample SMTP values are placeholders. Configure a working SMTP account and app password in `.env`, then recreate the backend container with `docker compose up -d --build backend_app`.

## Security and prototype limitations

This is a prototype and requires security work before real-world or internet-facing use:

- The example `.env` values and application fallbacks are development-only. Set unique production secrets and credentials outside source control.
- Credentials that were previously committed or shared must be rotated; moving them to environment variables does not invalidate them.
- The current security configuration permits `/api/v1/isAllowedToPass` without authentication. Add device authentication and request signing before connecting a live door/access controller.
- The current security matcher permits `GET /api/v1/interest` without authentication, despite the controller comment describing it as admin-only. Protect lead data before collecting real submissions or broader deployment.
- Mosquitto is configured with anonymous access and the MQTT port is published. Do not expose this broker to an untrusted network; configure broker authentication and topic restrictions.
- The sketches use the default MIFARE Classic key and send the UUID over HTTP. These are not secure credentials or encrypted transport; use secure card/device protocols and HTTPS for production.
- The frontend Compose image runs Vite's development server, not a production static server. Build and serve a production frontend separately for deployment.
- A full password-reset flow and broader dependency/security review are not included in the prototype.

## Screenshots and hardware diagrams

Existing UI screenshots and system diagrams are kept in `images/`:

- [Home](images/home.png), [About](images/about.png), [Plans](images/prices.png), [Contact](images/contact.png), and [Login](images/login.png).
- [Admin dashboard](images/admin/admin_home.png) and [member dashboard](images/user/user_home.png).
- [MQTT](images/mqtt.png), [database](images/database.png), [OpenAPI](images/openapi.png), and [Docker](images/docker.png) diagrams.
- Hardware wiring and schematic files are under [images/electronics](images/electronics/); datasheets are under [datasheet](datasheet/).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

Original project by [ANIKET SHAW](www.linkedin.com/in/aniket-shaw-384664268).

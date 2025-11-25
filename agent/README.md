# Log Agent
This project implements a lightweight log collection and delivery agent, capable of:

- Reading multiple log files
- Compressing logs into `.tar.gz`
- Sending data to S3 or an HTTP endpoint
- Optionally cleaning log files after upload
- Running continuously (daemon mode) or only once (`--once`)


## Suport

- **Linux x86_64**
- **Linux ARM64**
- **Linux s390x (IBM Z)** via Docker emulation

## Recommended workflow (production)

**Build a standalone binary** (recommended for production) using the provided build script(s). The result will be placed under `dist/` (e.g. `dist/agent-linux-amd64`). Running the compiled binary is safer and avoids virtualenv/packaging issues on target hosts.

Example (from project root):
```sh
# Recommended — produces artifacts in dist/
./scripts/build_all.sh
# or run the specific builder for your platform:
./scripts/build_s390x_in_docker.sh
```

Then run the built binary:
```sh
# run once
./dist/agent-linux-amd64 --once

# run as daemon (uses loop_seconds in config)
./dist/agent-linux-amd64
```

> Why build is recommended: binaries are self-contained (no runtime pip installs on production hosts), easier to deploy, and avoid Python packaging/compatibility problems.

## Development workflow (venv) — not recommended for production
Use a virtual environment only for development, debugging and tests.

```sh
# create and activate venv (project root)
python3 -m venv venv
source venv/bin/activate         # Linux / macOS
# venv\Scripts\Activate          # Windows (PowerShell)

# install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# run once (development)
python3 src/main.py --once

# run continuously (development)
python3 src/main.py
```
>Note: running under a venv on production hosts is discouraged due to operational complexity and possible differences in system libraries. Prefer the compiled binary for production.

## Configuration

All runtime configuration lives in `src/config.py`. Example keys:

```sh
CONFIG = {
    "version": "0.0.1",
    "loop_seconds": 30,
    "logs": {
        "paths": [
            {"path": "/var/log/syslog", "type": "syslog"},
            {"path": "/var/log/auth.log", "type": "auth"},
            {"path": "/var/log/kern.log", "type": "kernel"},
        ],
        "compress": True,
        "clean_after_send": True
    },
    "transport": {
        "type": "s3",           # "s3" or "url"
        "s3": {
            "bucket": "my-bucket",
            "region": "us-east-1",
            "prefix": "agent/"
        },
        "url": {
            "endpoint": "https://example.com/ingest"
        }
    }
}
```

- `compress`: create a `.tar.gz` archive of configured files (recommended).
- `clean_after_send`: when `True`, removes original log files after successful upload — **requires appropriate permissions**.
- `transport.type`: `"s3"` to use AWS S3, `"url"` to POST the archive to an HTTP endpoint.

## AWS / HTTP credentials
**S3 (boto3)** uses the standard credential resolution chain (env vars, shared credentials file, instance profile).

Set environment variables (example):

```sh
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
```

## Running as a service (systemd)
Example `agent.service` (adjust `WorkingDirectory` and path to binary):

```sh
[Unit]
Description=Log Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/log-agent
ExecStart=/opt/log-agent/agent-linux-amd64
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

- Put the compiled binary in `/opt/log-agent/` or another secure location.
- Use a dedicated service account where possible.
- Enable and start:

```sh
sudo cp agent.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now agent.service
```

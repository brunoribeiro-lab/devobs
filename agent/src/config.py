CONFIG = {
    "version": "0.0.1",
    "loop_seconds": 30,
    "logs": {
        "paths": [
            {
                "path": "/var/log/syslog",
                "type": "syslog"
            },
            {
                "path": "/var/log/auth.log",
                "type": "auth"
            },
            {
                "path": "/var/log/kern.log",
                "type": "kernel"
            },

        ],
        "compress": True,                    # compress logs before sending
        "clean_after_send": False            # remove logs after sending
    },
    "transport": {
        "type": "url",
        "s3": {
            "bucket": "meu-bucket",
            "region": "us-east-1",
            "prefix": "agent/"
        },
        "url": {
            "endpoint": "http://localhost:5000/api/ingest",
        }
    },

}

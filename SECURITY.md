# Security Policy

## Supported Versions

Stride is a student project and security fixes are currently applied to the latest version on the `main` branch.

## Reporting a Vulnerability

Please do not post credentials, access tokens, private user data, or a working exploit containing sensitive information in a public GitHub issue.

If you discover a security problem, contact the repository owner privately through GitHub and include:

- A short description of the issue
- The affected feature or file
- Steps to reproduce without exposing secrets or personal data
- The potential impact
- Any suggested fix, if you have one

Please allow time for the issue to be investigated and fixed before public disclosure.

## Secrets

Never commit `.env` files, Supabase service-role keys, OAuth client secrets, passwords, or other private credentials. Frontend `VITE_*` variables are shipped to the browser, so they must never contain secrets.

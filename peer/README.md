# Scripts summary

- start: `npm start` or `npm run start`
    - Run peer server and connect to production environment (remotely).

- dev: `npm run dev`
    - Run peer server locally.
    - Check .env-cmdrc file for configuring PORT else default to 3000.

- test: `npm run test`
    - Run all mocha tests defined in test directory.
    - Skip test-env.js as that is only relevant for testenv.
    - Add SERVER_URL and change it as needed.

# Environment vars
- All env vars are defined in the .env.cmdrc file.
    - They are separated by their environments: development, test and production.
        - Each environment has their own defined env vars.
- If problems arise, create .env file in this directory.

<details><summary>TODO</summary>
<p>
Something something better way of securing env vars....
</p>
</details>

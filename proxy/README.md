# Scripts summary

- start: `npm start` or `npm run start`
    - Run proxy server on production environment (remotely).

- testenv: `npm run testenv`
    - Test only environment variables.
    - Currently also included in other mocha tests as well (WIP).

- dev: `npm run dev`
    - Run proxy server locally.
    - Check .env-cmdrc file for configuring PORT else default to 3000.

- test: `npm run test`
    - Run all mocha tests defined in test directory.
    - Skip test-env.js as that is only relevant for testenv.

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
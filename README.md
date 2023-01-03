# Habitica _x_ Todoist

![logo](./docs/logo.png)

## What?

A simple script that pulls tasks from [Todoist](https://todoist.com/) and pushes them into [Habitica](https://habitica.com/). Any changes on the Habitica side won't be _pushed_ back. Completing a task in Todoist will also mark it as completed in Habitica.

## Prerequisites

To access both services the script requires your authentication tokens to authorize as you. Please do not share them otherwise. They act like a password! 

### Todoist

Write down your `API Token` from your [Todoist user settings](https://todoist.com/app/settings/integrations/developer). \
![habitica](./docs/todoist-secrets.png)\
https://todoist.com/app/settings/integrations/developer

### Habitica

Write down your `User ID` and `API Token` from your [Habitica user settings](https://habitica.com/user/settings/api). \
![habitica](./docs/habitica-secrets.png)\
https://habitica.com/user/settings/api

## Run as CLI (NodeJS)

To run this script locally, you can install it as CLI via npm/yarn/etc.
```bash
npm install -g habitica-todoist-pull
```
_Note: This requires a locally installed version of [NodeJS v18.0+](https://nodejs.org/en/download/)_

### Usage

Can be run from any cmd line tool like this:
```bash
habitica-todoist-pull <todoist_api_token> <habitica_user_id> <habitica_api_token>
```

## Run as CRON Job (GitHub Worker)

_TODO_

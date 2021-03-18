# Reddit Newsletter

## Get stated

- Create `.env` file with the content of `.env.default`
- Populate the environment variables in `.env`
- Run `yarn start`
- Server will be running on port `3000` and scheduler will trigger sending newsletters to users at 8:00 AM daily

## Endpoints

| path  | type | description          | required properties           |
| ----- | ---- | -------------------- | ----------------------------- |
| /user | POST | create new user user | first_name, email, subreddits |
| /user | GET  | get user             | user_id                       |
| /user | PUT  | update user          | user_id                       |

### Example POST request body

```
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@gmail.com",
    "subreddits": ["funny", "OddlySatisfying", "godot"]
}
```

### Example GET request body

```
{
    "user_id": "4xxjsjabJa5sivvEle0TC"
}
```

### Example PUT request body

```
{
    "user_id": "4xxjsjabJa5sivvEle0TC",
    "subreddits": ["askreddit", "godot"],
    "subscribed": false
}
```

Setting `subscribed` to false will disable sending newsletters to this user

---

## Newsletter Email

![Newsletter screenshot](docs/newsletter-screenshot.png)

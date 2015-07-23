# Pentire

https://pentire.herokuapp.com/

## Install & run

```shell
npm install
gulp
```

### Environment variables

1. Copy the template to the global `.env` file.

    ```
    cp .env_template .env
    ```

1. Edit the `.env` file.

1. Execute the environment variables

    ```
    source .env
    ```

## Heroku

### Add Heroku

```
heroku git:remote -a pentire
```

### Push to Heroku

```
git push heroku master
```

# twitchPOD

Create podcast feeds from Twitch VODs. Go to [twitchpod.tv](https://twitchpod.tv) to check it out!

## Features

- Generate RSS feeds that can be added to podcast apps with support for video podcasts (e.g. Pocket Casts)
- Simple web server for serving RSS feed data, video links, and UI

## Self-Hosted Setup Using Docker

Prerequisites:

- Ensure Docker is set up and running on your machine (https://docs.docker.com/get-docker)
- Set up a hostname that can be used to access your machine from the internet (can use a static IP address as well)
- Get a Twitch API client set up with client id and secret (https://dev.twitch.tv/docs/api)

To run this application using Docker:

1. Create the `docker-compose.yml` file as described below
2. Run `docker-compose up -d` in the folder where your `docker-compose.yml` lives
3. Check the logs using `docker-compose logs -f` to see if there are any errors in your configuration
4. Access the UI on port 80, input a streamer's username, and add the podcast feed to your podcast app of choice

### docker-compose.yml

```
services:
  twitchpod:
    image: trevorsharp/twitchpod:latest
    container_name: twitchpod
    restart: unless-stopped
    ports:
      - 80:3000
    environment:
      - "TWITCH_API_CLIENT_ID=XXXXX"
      - "TWITCH_API_SECRET=XXXXX"
```

Create a file named `docker-compose.yml` with the contents above. Add in your Twitch API client id and secret.

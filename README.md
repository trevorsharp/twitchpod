# twitch-podcast-feeds

Create podcast feeds from Twitch VODs

## Features

- Generate RSS feeds that can be added to podcast apps with support for video podcasts (e.g. Pocket Casts)
- Simple web server for serving RSS feed data and video links

## Setup Using Docker

Prerequisites:

- Ensure docker is set up and running on your machine (https://docs.docker.com/get-docker)
- Set up a hostname that can be used to access your machine from the internet (can use a static IP address as well)

To run this application using docker:

1. Create the `docker-compose.yml` file as described below
2. Run `docker-compose up -d` in the folder where your `docker-compose.yml` lives
3. Check the logs using `docker-compose logs -f` to see if there are any errors in your configuration

### docker-compose.yml

```
version: '3'
services:
  twitch-podcast-feeds:
    image: trevorsharp/twitch-podcast-feeds:latest
    container_name: twitch-podcast-feeds
    restart: unless_stopped
    ports:
      - 80:80
    environment:
      - "TWITCH_API_CLIENT_ID="
      - "TWITCH_API_SECRET="
```

Create a file named `docker-compose.yml` with the contents above. Add in yout Twitch API client id and secret.

## Adding Podcast Feeds

Add podcast feeds to your podcast app of choice using the following URL format:

`http://hostname/username`

- `hostname` is the domain name or static IP address that reaches the docker container on port 80
- `username` is the Twitch username of the desired streamer

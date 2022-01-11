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
2. (Optional) - Add cover art photos for streamers in the `data` directory with the name `username.png` where username is the Twitch username of the streamer. Make the file names all lowercase
3. Run `docker-compose up -d` in the folder where your `docker-compose.yml` lives
4. Check the logs using `docker-compose logs -f` to see if there are any errors in your configuration
5. Add podcast feeds to your podcast app of choice with the URL `http://hostname/username?title=Podcast%20Title` where `hostname` is the domain name or IP address specified in the docker-compose file, `username` is the Twitch username the desired streamer, and `Podcast%20Title` is the desired title of the podcast feed. Be sure to URL encode the podcast title (e.g. replace spaces with `%20`)

### docker-compose.yml

```
version: '3'
services:
  twitch-podcast-feeds:
    image: trevorsharp/twitch-podcast-feeds:latest
    container_name: twitch-podcast-feeds
    restart: always
    ports:
      - 80:80
    environment:
      - "HOSTNAME=http://example.com"
    volumes:
      - REPLACE_WITH_DATA_DIRECTORY_PATH/data:/app/data

```

Create a file named `docker-compose.yml` with the contents above, fill in your hostname where you will access the podcasts feeds from, and substitute in the file path to your data folder.

### Data Directory Structure

Files will be stored in the data directory using the following structure:

```
data
 |
 └── feedId1.png
 |
 └── feedId2.png
 |
 └── feedId3.png
 ...
```

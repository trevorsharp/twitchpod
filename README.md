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
    restart: always
    ports:
      - 80:80
```

Create a file named `docker-compose.yml` with the contents above.

## Adding Podcast Feeds

Add podcast feeds to your podcast app of choice using the following URL format `http://hostname/username`

- `hostname` is the domain name or static IP address that reaches the docker container on port 80
- `username` is the Twitch username of the desired streamer

### Optional URL Query Parameters

- `title` - Frmatted title for the podcast feed (e.g. `Username%20VODs`)
- `image` - URL of an image for the podcast feed's cover art (e.g. `https%3A%2F%2Fexample.com%2FpathToImage.jpg`)

**Note** All optional parameters must be URL encoded. You can use a tool such as [this one](https://www.urlencoder.org) to encode your parameters

## Example

`http://yourdomain.com/hasanabi?title=HasanAbi%20VODs&image=https%3A%2F%2Fstatic-cdn.jtvnw.net%2Fjtv_user_pictures%2F0347a9aa-e396-49a5-b0f1-31261704bab8-profile_image-300x300.jpeg`

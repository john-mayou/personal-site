terraform {
  cloud {
    organization = "personal-site"
    workspaces {
      name = "personal-site"
    }
  }

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }
}

provider "digitalocean" {
  token = var.do_api_key
}

provider "cloudflare" {
  api_token = var.cloudflare_api_key
}

resource "digitalocean_ssh_key" "deployer" {
  name       = "deployer"
  public_key = var.do_ssh_public_key
}

resource "digitalocean_droplet" "prod" {
  name   = "prod-server"
  size   = "s-1vcpu-1gb"
  image  = "docker-20-04"
  region = "nyc3"
  ssh_keys = [digitalocean_ssh_key.deployer.fingerprint]
}

resource "digitalocean_droplet" "staging" {
  name   = "staging-server"
  size   = "s-1vcpu-1gb"
  image  = "docker-20-04"
  region = "nyc3"
  ssh_keys = [digitalocean_ssh_key.deployer.fingerprint]
}

resource "cloudflare_dns_record" "prod" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "A"
  content = digitalocean_droplet.prod.ipv4_address
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "prod_www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "CNAME"
  content = "johnmayou.com"
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "staging" {
  zone_id = var.cloudflare_zone_id
  name    = "staging"
  type    = "A"
  content = digitalocean_droplet.staging.ipv4_address
  proxied = true
  ttl     = 1
}
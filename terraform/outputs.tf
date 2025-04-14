output "staging_ip" {
  value = digitalocean_droplet.staging.ipv4_address
}

output "prod_ip" {
  value = digitalocean_droplet.prod.ipv4_address
}
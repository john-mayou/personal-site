variable "do_api_key" {
  description = "DigitalOcean API key"
  type        = string
  sensitive   = true
}

variable "do_ssh_public_key" {
  description = "DigitalOcean SSH Key"
  type        = string
}

variable "cloudflare_api_key" {
  description = "Cloudflare API key"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for Domain"
  type        = string
}

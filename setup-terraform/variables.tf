variable "aws_region" {
  description = "The AWS region to create the Flightchain Instance."
  default     = "ap-southeast-2"
}

# Amazon 2 Linux
variable "aws_amis" {
  default = {
    "ap-southeast-2" = "ami-39f8215b"
    "us-west-2" = "tbd"
  }
}

variable "availability_zones" {
  default     = "ap-southeast-2b"
  description = "List of availability zones, use AWS CLI to find your "
}

variable "key_name" {
  description = "Name of AWS key pair"
  default = "keypair_learning"
}

variable "instance_type" {
  default     = "t2.medium"
  description = "AWS instance type"
}

variable "vpc_security_group_ids" {
  type    = "list"
  default = []
}

variable "subnet_id" {
   description = "VPC Subnet ID the instance is launched in"
   default = "subnet-62b73507"
}

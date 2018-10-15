provider "aws" {
  region = "${var.aws_region}"
}

resource "aws_instance" "flightchain-instance" {
    ami                         = "${lookup(var.aws_amis, var.aws_region)}"
    availability_zone           = "${var.availability_zones}"
    ebs_optimized               = false
    instance_type               = "${var.instance_type}"
    monitoring                  = false
    key_name                    = "${var.key_name}"
    subnet_id                   = "${var.subnet_id}"
    vpc_security_group_ids      = "${var.vpc_security_group_ids}"
    associate_public_ip_address = true
    source_dest_check           = true
    user_data                   = "${file("files/userdata.sh")}"
    root_block_device {
        volume_type             = "gp2"
        volume_size             = 15
        delete_on_termination   = true
    }

    tags {
        "CreatedBy"             = "MK"
        "InstanceType"          = "FlightChain - Single Node"
        "Name"                  = "Flightchain"
    }
}

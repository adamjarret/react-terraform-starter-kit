# This key is used to sign and verify authetication tokens.
resource "aws_kms_key" "kms_auth_key" {
  description = "${var.kms_auth_key_description}"
  deletion_window_in_days = 10
}

# Optionally create an alias for this key
#resource "aws_kms_alias" "kms_auth_key_alias" {
#  name = "alias/${var.kms_auth_key_name}"
#  target_key_id = "${aws_kms_key.kms_auth_key.key_id}"
#}
output "api_id" {
  value = "${aws_api_gateway_rest_api.api.id}"
}

output "api_name" {
  value = "${var.api_name}"
}

output "api_stage" {
  value = "${var.api_stage_name}"
}

output "api_url" {
  value = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${var.region}.amazonaws.com/${var.api_stage_name}"
}

output "bucket_name" {
  value = "${aws_s3_bucket.content_bucket.id}"
}

output "bucket_url" {
  value = "https://${aws_s3_bucket.content_bucket.bucket_domain_name}"
}

output "region" {
  value = "${var.region}"
}

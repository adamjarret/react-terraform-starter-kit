resource "aws_s3_bucket" "content_bucket" {
  acl = "private"
  bucket_prefix = "${var.bucket_prefix}"
  # Use bucket instead of bucket_prefix to specify an exact name
  #bucket = "my-content-bucket"
}

resource "aws_s3_bucket_policy" "content_bucket_policy" {
  bucket = "${aws_s3_bucket.content_bucket.id}"
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[
    {
	  "Sid":"PublicReadGetObject",
      "Effect":"Allow",
	  "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource": "${aws_s3_bucket.content_bucket.arn}/public/*"
    }
  ]
}
POLICY
}
# Create a role for Lamba functions to assume when executing.
resource "aws_iam_role" "lambda_default_role" {
  name = "${var.lambda_default_role_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# Grant access to resources needed by the Lambda functions in the inline policy for the role.
resource "aws_iam_role_policy" "lambda_default_role_policy" {
  role = "${aws_iam_role.lambda_default_role.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
          "kms:Decrypt",
          "kms:Encrypt"
      ],
      "Resource": [
          "${aws_kms_key.kms_auth_key.arn}"
      ]
    }
  ]
}
EOF
}

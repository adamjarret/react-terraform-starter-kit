# Create a payload zip file from the Login function source code file
data "archive_file" "af_login" {
  type = "zip"
  source_file = "build/${var.fn_login_name}.js"
  output_path = "build/${var.fn_login_name}.zip"
}

# Define the Login Lambda function
resource "aws_lambda_function" "fn_login" {
  function_name = "${var.fn_login_name}"
  handler = "${var.fn_login_name}.handler"
  runtime = "nodejs8.10"
  filename = "${data.archive_file.af_login.output_path}"
  source_code_hash = "${base64sha256(file("${data.archive_file.af_login.output_path}"))}"
  role = "${aws_iam_role.lambda_default_role.arn}"

  environment {
    variables = {
      Region = "${var.region}"
      KMSKeyId = "${aws_kms_key.kms_auth_key.id}"
      Password = "${var.password}"
    }
  }
}

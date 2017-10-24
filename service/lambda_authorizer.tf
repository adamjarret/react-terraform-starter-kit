# Create a payload zip file from the Authorizer function source code file
data "archive_file" "af_authorizer" {
  type = "zip"
  source_file = "src/${var.fn_authorizer_name}.js"
  output_path = "build/${var.fn_authorizer_name}.zip"
}

# Define the Authorizer Lambda function
resource "aws_lambda_function" "fn_authorizer" {
  function_name = "${var.fn_authorizer_name}"
  handler = "${var.fn_authorizer_name}.handler"
  runtime = "nodejs6.10"
  filename = "${data.archive_file.af_authorizer.output_path}"
  source_code_hash = "${base64sha256(file("${data.archive_file.af_authorizer.output_path}"))}"
  role = "${aws_iam_role.lambda_default_role.arn}"

  environment {
    variables = {
      Region = "${var.region}"
    }
  }
}
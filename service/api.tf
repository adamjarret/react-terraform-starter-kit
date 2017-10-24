# Define the API
resource "aws_api_gateway_rest_api" "api" {
  name = "${var.api_name}"
  description = "${var.api_description}"
  binary_media_types = [
    "image/x-icon",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
    "audio/ogg",
    "audio/mpeg"
  ]
}

# Define the API Gateway deployment
# See http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html for more information
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name = "${var.api_stage_name}"
  description = "${var.version}"

  # Explicitly define a dependency to avoid race conditions
  #  (see https://www.terraform.io/docs/providers/aws/r/api_gateway_deployment.html)
  depends_on = ["aws_api_gateway_integration_response.private_get_500_integration_response"]

  # When the version changes, a new deployment is created.
  # See README.md for more information.
  variables {
    version  = "${var.version}"
  }
}

# Define the settings for the stage
# Setting method_path = "*/*" causes this to apply to all methods in the stage
resource "aws_api_gateway_method_settings" "api_stage_settings" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name = "${aws_api_gateway_deployment.api_deployment.stage_name}"
  method_path = "*/*"

  settings {
    metrics_enabled = "${var.api_stage_metrics}"
    logging_level   = "${var.api_stage_logging_level}"
  }
}

# Define the API Authorizer
#   This Lambda function will be used to challenge access to certain API resources
resource "aws_api_gateway_authorizer" "api_authorizer" {
  name = "${var.api_authorizer_name}"
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  authorizer_uri = "${aws_lambda_function.fn_authorizer.invoke_arn}"
  authorizer_credentials = "${aws_iam_role.api_default_role.arn}"
  identity_source = "method.request.header.Cookie"
  authorizer_result_ttl_in_seconds = 300
}

# API Resource: /api
# This is a "dummy" resource that serves only as the parent of the lambda proxy resources
resource "aws_api_gateway_resource" "api_dummy" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  path_part = "api"
}

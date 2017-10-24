#
# The /api/login resource will proxy requests to the fn_login Lambda function. This function will check the provided
# password and return status 200 (with an access token in the Set-Cookie header and body) or 401 if the password was
# incorrect.
#

# API Resource: /api/login
resource "aws_api_gateway_resource" "login" {
  path_part = "login"
  parent_id = "${aws_api_gateway_resource.api_dummy.id}"
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
}

# Define the POST method for the /api/login resource
resource "aws_api_gateway_method" "login_post" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.login.id}"
  http_method = "POST"
  authorization = "NONE"
}

# Define the POST method request integration for the /api/login resource
# This is where we specify the type of integration, the Lambda function invocation URL
# and which credentials should be used by the API to invoke the Lambda function.
resource "aws_api_gateway_integration" "login_post_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_method.login_post.resource_id}"
  http_method = "${aws_api_gateway_method.login_post.http_method}"
  integration_http_method = "${aws_api_gateway_method.login_post.http_method}"
  uri = "${aws_lambda_function.fn_login.invoke_arn}"
  credentials = "${aws_iam_role.api_default_role.arn}"
  type = "AWS_PROXY"
}

resource "aws_api_gateway_method_response" "login_post_200" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_method.login_post.resource_id}"
  http_method = "${aws_api_gateway_method.login_post.http_method}"
  status_code = "200"
}

resource "aws_api_gateway_method_response" "login_post_401" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_method.login_post.resource_id}"
  http_method = "${aws_api_gateway_method.login_post.http_method}"
  status_code = "401"
  depends_on = ["aws_api_gateway_method_response.login_post_200"]
}

resource "aws_api_gateway_method_response" "login_post_500" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_method.login_post.resource_id}"
  http_method = "${aws_api_gateway_method.login_post.http_method}"
  status_code = "500"
  depends_on = ["aws_api_gateway_method_response.login_post_401"]
}
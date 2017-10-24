#
# The / resource will proxy requests to index.html.
#
# HTTP_PROXY is used as the integration type because it requires the least boilerplate and works well for text-based
# responses. See README.md for more information.
#

# API Resource: /
resource "aws_api_gateway_method" "home_get" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "home_get_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_method.home_get.resource_id}"
  http_method = "${aws_api_gateway_method.home_get.http_method}"
  integration_http_method = "${aws_api_gateway_method.home_get.http_method}"
  uri = "https://${aws_s3_bucket.content_bucket.bucket_domain_name}/public/index.html"
  type = "HTTP_PROXY"
  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "home_get_200" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_method.home_get.resource_id}"
  http_method = "${aws_api_gateway_method.home_get.http_method}"
  status_code = "200"
}
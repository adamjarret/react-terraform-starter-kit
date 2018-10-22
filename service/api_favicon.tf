#
# The /favicon.ico resource will proxy requests for the favicon to an HTTP URL.
# This is to enable serving the favicon from the "site root" and is really only useful if the API Gateway stage is
# deployed to a custom URL (otherwise the favicon is served from /stage_name/favicon.ico which defeats the purpose).
#
# HTTP is used as the integration type (as opposed to HTTP_PROXY) to allow the definition of an integration response
# that converts the data to binary. See README.md for more information.
#

# API Resource: /favicon.ico
resource "aws_api_gateway_resource" "favicon" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  path_part = "favicon.ico"
}

resource "aws_api_gateway_method" "favicon_get" {
  rest_api_id = "${aws_api_gateway_resource.favicon.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.favicon.id}"
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "favicon_get_integration" {
  rest_api_id = "${aws_api_gateway_method.favicon_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.favicon_get.resource_id}"
  http_method = "${aws_api_gateway_method.favicon_get.http_method}"
  integration_http_method = "${aws_api_gateway_method.favicon_get.http_method}"
  uri = "https://${aws_s3_bucket.content_bucket.bucket_domain_name}/public/favicon.ico"
  type = "HTTP"
  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "favicon_get_200" {
  rest_api_id = "${aws_api_gateway_method.favicon_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.favicon_get.resource_id}"
  http_method = "${aws_api_gateway_method.favicon_get.http_method}"
  status_code = "200"

  response_parameters {
    "method.response.header.Cache-Control" = true
    "method.response.header.Content-Encoding" = true
    "method.response.header.Content-Length" = true
    "method.response.header.Content-Location" = true
    "method.response.header.Content-Type" = true
    "method.response.header.Date" = true
    "method.response.header.ETag" = true
    "method.response.header.Expires" = true
    "method.response.header.Last-Modified" = true
    "method.response.header.Timestamp" = true
    "method.response.header.Vary" = true
  }
}

resource "aws_api_gateway_integration_response" "favicon_get_200_integration_response" {
  rest_api_id = "${aws_api_gateway_integration.favicon_get_integration.rest_api_id}"
  resource_id = "${aws_api_gateway_integration.favicon_get_integration.resource_id}"
  http_method = "${aws_api_gateway_integration.favicon_get_integration.http_method}"
  status_code = "${aws_api_gateway_method_response.favicon_get_200.status_code}"
  selection_pattern = "${aws_api_gateway_method_response.favicon_get_200.status_code}"
  content_handling = "CONVERT_TO_BINARY"

  response_parameters {
    "method.response.header.Cache-Control" = "integration.response.header.Cache-Control"
    "method.response.header.Content-Encoding" = "integration.response.header.Content-Encoding"
    "method.response.header.Content-Length" = "integration.response.header.Content-Length"
    "method.response.header.Content-Location" = "integration.response.header.Content-Location"
    "method.response.header.Content-Type" = "integration.response.header.Content-Type"
    "method.response.header.Date" = "integration.response.header.Date"
    "method.response.header.ETag" = "integration.response.header.ETag"
    "method.response.header.Expires" = "integration.response.header.Expires"
    "method.response.header.Last-Modified" = "integration.response.header.Last-Modified"
    "method.response.header.Timestamp" = "integration.response.header.Timestamp"
    "method.response.header.Vary" = "integration.response.header.Vary"
  }
}
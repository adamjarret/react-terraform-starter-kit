#
# The /{wildcard+} resource will proxy all requests to index.html so the urls can be handled by react-router.
# This is not necessary if using MemoryRouter or HashRouter instead of BrowserRouter (see client/index.jsx)
#
# HTTP_PROXY is used as the integration type because it requires the least boilerplate and works well for text-based
# responses. See README.md for more information.
#

# API Resource: /{wildcard+}
resource "aws_api_gateway_resource" "wildcard" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  path_part = "{wildcard+}"
}

resource "aws_api_gateway_method" "wildcard_get" {
  rest_api_id = "${aws_api_gateway_resource.wildcard.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.wildcard.id}"
  http_method = "GET"
  authorization = "NONE"

  request_parameters {
    "method.request.path.wildcard" = true
  }
}

resource "aws_api_gateway_integration" "wildcard_get_integration" {
  rest_api_id = "${aws_api_gateway_method.wildcard_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.wildcard_get.resource_id}"
  http_method = "${aws_api_gateway_method.wildcard_get.http_method}"
  integration_http_method = "${aws_api_gateway_method.wildcard_get.http_method}"
  uri = "https://${aws_s3_bucket.content_bucket.bucket_domain_name}/public/index.html"
  type = "HTTP_PROXY"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_parameters {
    "integration.request.path.wildcard" = "method.request.path.wildcard"
  }
}

resource "aws_api_gateway_method_response" "wildcard_get_200" {
  rest_api_id = "${aws_api_gateway_method.wildcard_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.wildcard_get.resource_id}"
  http_method = "${aws_api_gateway_method.wildcard_get.http_method}"
  status_code = "200"
}
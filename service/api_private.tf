#
# The /private/{fileName+} resource will proxy requests to S3 (with credentials from api_default_role to allow access)
# and respond with binary data if the user is logged in.
# WARNING: Serving text files via this resource will not work (unless you comment out the CONVERT_TO_BINARY lines below
# at which point serving binary files will no longer work). See README.md for more information.
#

# API Resource: /private
# This is a "dummy" resource that serves only as the parent of /private/{fileName+}
resource "aws_api_gateway_resource" "private_dummy" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  path_part = "private"
}

# API Resource: /private/{fileName+}
# Use {fileName+} as the path_part to match anything after /private
resource "aws_api_gateway_resource" "private" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id = "${aws_api_gateway_resource.private_dummy.id}"
  path_part = "{fileName+}"
}

# Define the GET method for the /private/{fileName+} resource
# This is where we define that the custom authorizer should be called to check if the user has access to this method.
# We also specify any headers or path part values that should be relayed to the request integration.
resource "aws_api_gateway_method" "private_get" {
  rest_api_id = "${aws_api_gateway_resource.private.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.private.id}"
  http_method = "GET"
  authorization = "CUSTOM" # Can be NONE, CUSTOM, AWS_IAM
  authorizer_id = "${aws_api_gateway_authorizer.api_authorizer.id}"

  request_parameters {
    "method.request.path.fileName" = true
    "method.request.header.Content-Type" = true
    "method.request.header.Accept" = true
    "method.request.header.If-Range" = true
    "method.request.header.Range" = true
  }
}

# Define the GET method request integration for the /private/{fileName+} resource
# This is where we specify the type of integration, the URL to which requests are proxied
# and which credentials should be used by the API to access the resource.
# We also pass the content of the relayed headers specified in private_get.
resource "aws_api_gateway_integration" "private_get_integration" {
  rest_api_id = "${aws_api_gateway_method.private_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.private_get.resource_id}"
  http_method = "${aws_api_gateway_method.private_get.http_method}"
  integration_http_method = "${aws_api_gateway_method.private_get.http_method}"
  uri = "arn:aws:apigateway:${var.region}:${aws_s3_bucket.content_bucket.id}.s3:path/private/{fileName}"
  credentials = "${aws_iam_role.api_default_role.arn}"
  type = "AWS"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_parameters {
    "integration.request.path.fileName" = "method.request.path.fileName"
    "integration.request.header.Content-Type" = "method.request.header.Content-Type"
    "integration.request.header.Accept" = "method.request.header.Accept"
    "integration.request.header.If-Range" = "method.request.header.If-Range"
    "integration.request.header.Range" = "method.request.header.Range"
  }
}

# This method response is used when the response from the proxy request has status code: 200
resource "aws_api_gateway_method_response" "private_get_200" {
  rest_api_id = "${aws_api_gateway_method.private_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.private_get.resource_id}"
  http_method = "${aws_api_gateway_method.private_get.http_method}"
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

# The integration response for private_get_200 specifies that the content should be converted to binary data.
# See README.md for more information.
resource "aws_api_gateway_integration_response" "private_get_200_integration_response" {
  rest_api_id = "${aws_api_gateway_integration.private_get_integration.rest_api_id}"
  resource_id = "${aws_api_gateway_integration.private_get_integration.resource_id}"
  http_method = "${aws_api_gateway_integration.private_get_integration.http_method}"
  status_code = "${aws_api_gateway_method_response.private_get_200.status_code}"
  selection_pattern = "${aws_api_gateway_method_response.private_get_200.status_code}"
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

# This method response is used when the response from the proxy request has status code: 206
# The 206 status code indicates partial data was returned and is useful for serving audio/video files.
# S3 supports the Accept-Ranges and Content-Range headers, so we just need to relay them to our response.
resource "aws_api_gateway_method_response" "private_get_206" {
  rest_api_id = "${aws_api_gateway_method.private_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.private_get.resource_id}"
  http_method = "${aws_api_gateway_method.private_get.http_method}"
  status_code = "206"
  depends_on = ["aws_api_gateway_method_response.private_get_200"]

  response_parameters {
    "method.response.header.Accept-Ranges" = true
    "method.response.header.Content-Range" = true
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

# The integration response for private_get_206 specifies that the content should be converted to binary data.
# See README.md for more information.
resource "aws_api_gateway_integration_response" "private_get_206_integration_response" {
  rest_api_id = "${aws_api_gateway_integration.private_get_integration.rest_api_id}"
  resource_id = "${aws_api_gateway_integration.private_get_integration.resource_id}"
  http_method = "${aws_api_gateway_integration.private_get_integration.http_method}"
  status_code = "${aws_api_gateway_method_response.private_get_206.status_code}"
  selection_pattern = "${aws_api_gateway_method_response.private_get_206.status_code}"
  content_handling = "CONVERT_TO_BINARY"

  response_parameters {
    "method.response.header.Accept-Ranges" = "integration.response.header.Accept-Ranges"
    "method.response.header.Content-Range" = "integration.response.header.Content-Range"
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

resource "aws_api_gateway_method_response" "private_get_401" {
  rest_api_id = "${aws_api_gateway_method.private_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.private_get.resource_id}"
  http_method = "${aws_api_gateway_method.private_get.http_method}"
  status_code = "401"
  depends_on = ["aws_api_gateway_method_response.private_get_206"]
}

resource "aws_api_gateway_integration_response" "private_get_401_integration_response" {
  rest_api_id = "${aws_api_gateway_integration.private_get_integration.rest_api_id}"
  resource_id = "${aws_api_gateway_integration.private_get_integration.resource_id}"
  http_method = "${aws_api_gateway_integration.private_get_integration.http_method}"
  status_code = "${aws_api_gateway_method_response.private_get_401.status_code}"
  selection_pattern = "${aws_api_gateway_method_response.private_get_401.status_code}"
}

resource "aws_api_gateway_method_response" "private_get_404" {
  rest_api_id = "${aws_api_gateway_method.private_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.private_get.resource_id}"
  http_method = "${aws_api_gateway_method.private_get.http_method}"
  status_code = "404"
  depends_on = ["aws_api_gateway_method_response.private_get_401"]
}

resource "aws_api_gateway_integration_response" "private_get_404_integration_response" {
  rest_api_id = "${aws_api_gateway_integration.private_get_integration.rest_api_id}"
  resource_id = "${aws_api_gateway_integration.private_get_integration.resource_id}"
  http_method = "${aws_api_gateway_integration.private_get_integration.http_method}"
  status_code = "${aws_api_gateway_method_response.private_get_404.status_code}"
  selection_pattern = "${aws_api_gateway_method_response.private_get_404.status_code}"
}

resource "aws_api_gateway_method_response" "private_get_500" {
  rest_api_id = "${aws_api_gateway_method.private_get.rest_api_id}"
  resource_id = "${aws_api_gateway_method.private_get.resource_id}"
  http_method = "${aws_api_gateway_method.private_get.http_method}"
  status_code = "500"
  depends_on = ["aws_api_gateway_method_response.private_get_404"]
}

resource "aws_api_gateway_integration_response" "private_get_500_integration_response" {
  rest_api_id = "${aws_api_gateway_integration.private_get_integration.rest_api_id}"
  resource_id = "${aws_api_gateway_integration.private_get_integration.resource_id}"
  http_method = "${aws_api_gateway_integration.private_get_integration.http_method}"
  status_code = "${aws_api_gateway_method_response.private_get_500.status_code}"
  selection_pattern = "-" # this is the default integration response
}
# AWS Region
# See http://docs.aws.amazon.com/general/latest/gr/rande.html for more information
variable "region" {
  type = "string"
  default = "us-east-1"
}

# Version number
# Change this to cause API Gateway to be redeployed
variable "version" {
  type = "string"
  default = "1.0.0.0"
}

# Password used to autheticate all users
variable "password" {
  type = "string"
  default = "welcome"
}

# Prefix to use when creating S3 bucket (should be lowercase for URL compatibility)
# See s3.tf file for more options
variable "bucket_prefix" {
  type = "string"
  default = "rtsk-"
}

# Name of the API to be created in API Gateway
variable "api_name" {
  type = "string"
  default = "RTSK"
}

# Description of the API to be created in API Gateway
variable "api_description" {
  type = "string"
  default = "This is an example of how to restrict access to S3 files with an AWS API Gateway custom authorizer."
}

# Name of the stage to be deployed in API Gateway
# See http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html for more information.
variable "api_stage_name" {
  type = "string"
  default = "v1"
}

# Disable stage logs or set log level
# Note: Cloud Watch Logs must be enabled for API Gateway in order to use values other than OFF
# See https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudwatch-logs/ for more information.
variable "api_stage_logging_level" {
  type = "string"
  default = "OFF" # valid: OFF, ERROR, and INFO
}

# Disable/enable detailed CloudWatch metrics for stage
# From the AWS console:
# > Each method will generate these metrics: API calls, Latency, Integration latency, 400 errors, and 500 errors.
# > The metrics are charged at the standard CloudWatch rates.
variable "api_stage_metrics" {
  type = "string"
  default = "0" # valid: 0 for disabled, 1 for enabled
}

# Name of the API Authorizer object to be created in API Gateway
variable "api_authorizer_name" {
  type = "string"
  default = "CookieAuthorizer"
}

# Name of the role that API Gateway resource method integrations will assume when they run
# (permissions granted by this role are bestowed on the integration)
variable "api_default_role_name" {
  type = "string"
  default = "RTSKApiGatewayRole"
}

# Name of the role that Lambda functions will assume when they run
# (permissions granted by this role are bestowed on the Lambda)
variable "lambda_default_role_name" {
  type = "string"
  default = "RTSKLambdaRole"
}

# Name of the Lambda function used as the Authorizer
# Must match name (without .js extension) of corresponding file in the src directory
variable "fn_authorizer_name" {
  type = "string"
  default = "RTSKAuthorizer"
}

# Name of the Lambda function called by the /api/login endpoint
# Must match name (without .js extension) of corresponding file in the src directory
variable "fn_login_name" {
  type = "string"
  default = "RTSKLogin"
}

# Alias of the key that will be used to sign and verify authentication tokens
variable "kms_auth_key_name" {
  type = "string"
  default = "RTSKAuthKey"
}

# Description of the key that will be used to sign and verify authentication tokens
variable "kms_auth_key_description" {
  type = "string"
  default = "Key used by RTSK to sign and verify authentication tokens"
}
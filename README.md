# <img alt="react-terraform-starter-kit" src="http://cdn.atj.me/rtsk/rtsk_logo.png" width="512" />

This project can serve as a simple starting point for AWS microservices that use an API Gateway with a custom Authorizer
to invoke Lambda functions and proxy requests for static files.

The example web app can restrict access to files hosted on S3 so that they may only be downloaded after entering a
password.

The AWS backend is configured with [Terraform](https://www.terraform.io). The UI is built with
[Webpack](https://webpack.github.io), [React](https://reactjs.org), [Redux](http://redux.js.org) and
[Material-UI](http://www.material-ui.com/).

## How It Works

An S3 bucket is configured to allow everyone to have read-only access to it's **public** folder. The static
files that make up the client site are uploaded to the **public** folder and the API Gateway is configured to serve
**public/index.html** as the root resource.

The API Gateway has a resource `/api/login` that invokes a Lambda function which checks the provided password against an
environment variable. If the password is correct, a token is returned (both in the body of the request and in the
Set-Cookie header).

In subsequent requests to the API, the browser will send the token in the Cookie header which is used by the
API Authorizer to verify that a user is logged in.

## Why Cookies?

This app uses cookies to enable the protection of binary files. Since cookie data is sent by the browser automatically,
protected image/audio/video files can be referenced just like a public resource: direct links, an `<img src="">`
attribute, etc.

If this is not a requirement of your app, you may be better off using the default `Authorization` header for the
`identity_source` property of the `aws_api_gateway_authorizer` definition.
This would require your client code to keep track of the token and pass it in the header of authenticated requests.

## Prerequisites 

### Install Node.js and NPM

On macOS, install `node` with [Homebrew](https://brew.sh):

    brew install node

See the [Node.js Documentation](https://nodejs.org/en/download/package-manager/) for alternate installation
instructions.

### Install the AWS CLI

On macOS, install with `pip`:

    sudo easy_install pip
    pip install awscli --upgrade --user

See the [AWS Documentation](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) for alternate installation
instructions.

### Configure AWS CLI Credentials

To configure your default AWS credentials:

    aws configure
    
**The profile you configure as the default needs to have permission to perform all actions used to apply the Terraform
configration. The AWS products used in the example are: IAM, S3, KMS, API Gateway and Lambda.**

There [has been discussion](https://github.com/hashicorp/terraform/issues/2834) of how best to determine the
exact minimal permissions needed for Terraform to apply a given configuration, but the issues involved are complex.
The simplest approach is to run terraform with credentials that have been granted full access to all required AWS 
products. It's up to you to find the appropriate balance of convenience and security. For example, one
approach is to have multiple Terraform configurations (ex. one to create and one to destroy) that can separate
permissions so one role does not have too much power.

### Install Terraform

On macOS, install `terraform` with [Homebrew](https://brew.sh):

    brew install terraform

See the [Terraform documentation](https://www.terraform.io/intro/getting-started/install.html) for alternate
installation instructions.

## Usage

### Get the Source Code

    git clone https://github.com/adamjarret/react-terraform-starter-kit.git my-app
    cd my-app
    npm install

### Configure the variables

Create a **service/terraform.tfvars** file.

Example:

    version = "1.0.0.0"
    
See **service/variables.tf** for all variable names and defaults.

### Create the Service

#### Quick Start

To perform all operations required to create the service on AWS:

    npm run create

#### Quick End

To completely eradicate the service on AWS (delete all created assets):

    npm run destroy 
    
Note: By default, `destroy` will only delete the S3 bucket if it is empty. To change this behavior, set the
[`force_destroy`](https://www.terraform.io/docs/providers/aws/r/s3_bucket.html#force_destroy) option on the 
`aws_s3_bucket` definition in **service/s3.tf**.

Alternately, use the AWS CLI to delete a non-empty bucket:

    aws s3 rb s3://my-bucket-name --force

#### Granular Approach
    
The `create` command is comprised of several sub-commands that can be run individually.

##### Initialize the Terraform Working Directory

    npm run init

The `init` command corresponds to `terraform init`.
From the [Terraform Documentation](https://www.terraform.io/docs/commands/init.html):

> This is the first command that should be run after writing a new Terraform configuration or cloning an existing one
from version control. It is safe to run this command multiple times.

##### Generate the Terraform Execution Plan

    npm run plan

The `plan` command corresponds to `terraform plan`.
From the [Terraform Documentation](https://www.terraform.io/docs/commands/plan.html):

> Terraform performs a refresh, unless explicitly disabled, and then determines what actions are necessary to achieve
the desired state specified in the configuration files. 
  
##### Create AWS Resources

    npm run apply

The `apply` command corresponds to `terraform apply`.
From the [Terraform Documentation](https://www.terraform.io/docs/commands/apply.html):

> The terraform apply command is used to apply the changes required to reach the desired state of the configuration, or
the pre-determined set of actions generated by a terraform plan execution plan. 

##### Build Client Bundle

    npm run build

Build **bundle.js** with Webpack, render **index.html** from **index.mustache** and copy all files from
**client/static** to **bucket/public**.

*`build` will fail if run before `apply` because it depends on **client/data/terraform_output.json**.*

##### Upload Bucket Content

    npm run sync

The `sync` command will upload the public/private files from the local **bucket** folder to the S3 bucket.

*`sync` will fail if run before `apply` because it depends on the terraform output variables.*

##### Browse Site

    npm run open

The `open` command will launch the newly created web app in your default browser.

*`open` will fail if run before `apply` because it depends on the terraform output variables.*

#### Other Commands

##### Get Output Value(s)

Values defined in **service/output.tf** are available to scripts after `apply` is run.

List all output values:

    npm run state

Print specific output value (with no additional text):

    npm run --silent state -- bucket_name

*`state` will fail if run before `apply` because it depends on the terraform output variables.*

##### Build JS bundle without minifying

    npm run build:bundle-dev

### Redeploy the Service

From the [AWS Documentation](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html):

> After creating your API, you must deploy it to make the API callable for your users.

An API deployment will be created the first time `apply` is run but will **not be redeployed unless the value of the
`version` variable changes**.

There are ways of automatically detecting when to redeploy, described in
[this article](https://medium.com/coryodaniel/til-forcing-terraform-to-deploy-a-aws-api-gateway-deployment-ed36a9f60c1a).

For more granular control over stage deployments, remove `aws_api_gateway_deployment`, `aws_api_gateway_stage` and
`aws_api_gateway_method_settings` from **service/api.tf** and use the AWS CLI to deploy the stage.

You can add the following to the scripts section in package.json for convenience:

    "stage:deploy": "aws apigateway create-deployment --rest-api-id $(npm run --silent state -- api_id) --stage-name $(npm run --silent state -- api_stage)",
    
    "stage:log:enable": "aws apigateway update-stage --rest-api-id $(npm run --silent state -- api_id) --patch-operations op=replace,path=/*/*/logging/loglevel,value=ERROR --stage-name $(npm run --silent state -- api_stage)"

Usage:
    
    npm run stage:deploy
    
    npm run stage:log:enable
    
## Next Steps
    
### Host Public Static Content on a CDN

The static site files are hosted in the same bucket as the private files and accessed directly from their S3 URL for
simplicity in this example. You'll see performance benefits from hosting the public static files behind a CDN that has
nodes close to your users. One option is to add a
[`aws_cloudfront_distribution`](https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html) item to the
Terraform configuration to create a CloudFront distribution to serve the public files.

### Compress Static Content

Even this simple React app is around 500K minified. This can cause a noticeable lag when initially rendering the page.
If you are using a CloudFront CDN, you can configure it to
[automatically compress files of certain types](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html#CompressedS3).
Another option is to use something like the
[compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin) to compress your bundle at
build time. You'll need to
[set the Content-Encoding metadata property](http://www.rightbrainnetworks.com/blog/serving-compressed-gzipped-static-files-from-amazon-s3-or-cloudfront/)
when serving compressed files from S3.

### Multi-User Authentication

This example has a single hard-coded password that everyone uses to log in. You can adapt the source code for the login
lambda function to also accept a username and check a password hash in a database or initiate an OAuth handshake.

### Complex Lambdas

Eventually you'll want to utilize code from an npm module inside a Lambda function. It's possible to
[create a payload that includes the **node_modules** folder](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html),
or you can [configure Webpack with multiple entry points](https://webpack.js.org/concepts/#entry)
that can bundle your function code with it's dependencies into a single file.

### Custom Domain Name

To use a custom domain name (ex. example.com instead of umk4e4l4r8.execute-api.us-east-1.amazonaws.com) you can
add definitions for
[`aws_api_gateway_domain_name`](https://www.terraform.io/docs/providers/aws/r/api_gateway_domain_name.html),
[`aws_route53_record`](https://www.terraform.io/docs/providers/aws/r/route53_record.html)
and optionally [`aws_iam_server_certificate`](https://www.terraform.io/docs/providers/aws/d/iam_server_certificate.html)
to the Terraform configuration.

Note: Remember to change the `endpointPrefix` value in **client/constants/Urls.js** to be an empty string (`''`) if 
using a custom domain name.

## More Information

### Multiple Method Response Definitions

If an `aws_api_gateway_method` defines more than one `aws_api_gateway_method_response` (as is the case in
**service/api_private.tf** and **service/api_login.tf**) the `apply` command can
[choke on a race condition](https://github.com/hashicorp/terraform/issues/14550#issuecomment-302465837):

> ConflictException: Unable to complete operation due to concurrent modification 

To fix this, an explicit `depends_on` statement was added to each `aws_api_gateway_method_response` definition to ensure
they are created in sequence not parallel. If this error still comes up, try running `plan` and `apply` again.

### Permission to Invoke Lambda from API Gateway

In order to be able to execute a Lambda function, the API must be granted `lambda:InvokeFunction` permissions. This can
be accomplished in one of two ways:

1. [Using Identity-Based Policies (IAM Policies)](http://docs.aws.amazon.com/lambda/latest/dg/access-control-identity-based.html)

    This is the method employed by this project; a policy that grants access to relevant AWS resources is attached to a
    role which is specified as the credentials for certain API gateway resource method integrations requiring those
    permissions to run (S3 access, execute a lambda, etc). See **service/role_api.tf** for role and policy definition.
    
2. [Using Resource-Based Policies (Lambda Function Policies)](http://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html)

    With this method, an `aws_lambda_permission` object is created for every
    `aws_api_gateway_method`/`aws_lambda_function` mapping.
    
    Example for `/api/login` resource:

        # set the account_id value in service/terraform.tfvars         
        variable "account_id" {
          type = "string"
        }
    
        resource "aws_lambda_permission" "login_lambda_permissions" {
          statement_id  = "AllowExecutionFromAPIGateway"
          action        = "lambda:InvokeFunction"
          function_name = "${aws_lambda_function.fn_login.arn}"
          principal     = "apigateway.amazonaws.com"
        
          # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
          source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.api.id}/*/${aws_api_gateway_method.login_post.http_method}${aws_api_gateway_resource.login.path}"
        }
        
### Proxy Binary Files with API Gateway

#### Limits

From [Amazon API Gateway Limits, Pricing and Known Issues](http://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#api-gateway-limits):

> S3 proxy integration fails with files larger than 10485760 bytes (10 MB).

#### Integration Response Handling

From [Enable Support for Binary Payloads in API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-payload-encodings.html):

> Set the contentHandling property of the IntegrationResponse resource to CONVERT_TO_BINARY to have the response payload
converted from a Base64-encoded string to its binary blob, or set the property to CONVERT_TO_TEXT to have the response
payload converted from a binary blob to a Base64-encoded string. If contentHandling is not defined, and if the
Content-Type header of the response and the Accept header of the original request match an entry of the binaryMediaTypes
list, API Gateway passes through the body. This occurs when the Content-Type header and the Accept header are the same;
otherwise, API Gateway converts the response body to the type specified in the Accept header.

This sounds like it should be possible to define a list of mime types that the API Gateway treats as binary files and
otherwise serves proxied files as text. The "gotcha" is that browsers often send `text/html` as the first item in
the `Accept` header.

From [Content Type Conversions in API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-payload-encodings-workflow.html):

> When a request contains multiple media types in its Accept header, API Gateway only honors the first Accept media
type. In the situation where you cannot control the order of the Accept media types and the media type of your binary
content is not the first in the list, you can add the first Accept media type in the binaryMediaTypes list of your API,
API Gateway will return your content as binary. For example, to send a JPEG file using an <img> element in a browser,
the browser might send Accept:image/webp,image/*,*/*;q=0.8 in a request. By adding image/webp to the binaryMediaTypes
list, the endpoint will receive the JPEG file as binary.

A workaround is to have two API Gateway resources if need be; one to serve binary files and one to serve text (they
can proxy requests to the same S3 bucket).
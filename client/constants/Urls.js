/* global module */
import {api_stage} from '~/data/terraform_output.json';

// If using a standard API Gateway URL, this value should be the deployed stage name prefixed with a slash.
// If using a custom URL, this value should be an empty string ('').
const endpointPrefix = `/${api_stage.value}`;

module.exports = {
    endpointPrefix,

    // react-router URLs
    homeUrl: endpointPrefix.length ? endpointPrefix : '/',
    loginUrl: `${endpointPrefix}/login`,
    logoutUrl: `${endpointPrefix}/logout`,
};

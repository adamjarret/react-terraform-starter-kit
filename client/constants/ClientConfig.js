// Expecting globals is a dirty business.
// The behavior is quarantined here. Outside this file we pretend CLIENT_CONFIG does not exist.
const {CLIENT_CONFIG} = this || window || {};

export const endpointPrefix = CLIENT_CONFIG.endpointPrefix || '';

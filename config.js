var config = {
  "redirectUri": process.env.QB_REDIRECT_URI || "http://localhost:3000/callback",
  "configurationEndpoint": "https://developer.api.intuit.com/.well-known/openid_sandbox_configuration/",
  "api_uri": process.env.QB_API_URI || "https://sandbox-quickbooks.api.intuit.com/v3/company/",
  "scopes": {
    "sign_in_with_intuit": [
      "openid",
      "profile",
      "email",
      "phone",
      "address"
    ],
    "connect_to_quickbooks": [
      "com.intuit.quickbooks.accounting"
    ],
    "connect_handler": [
      "com.intuit.quickbooks.accounting",
      "openid",
      "profile",
      "email",
      "phone",
      "address"
    ]
  },
  "season": 2018,
  "testrun": true
}

module.exports = config
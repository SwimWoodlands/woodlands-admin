var x = {
    "QueryResponse": {
      "Customer": [
        {
          "Taxable": true,
          "BillAddr": {
            "Id": "2",
            "Line1": "4581 Finch St.",
            "City": "Bayshore",
            "CountrySubDivisionCode": "CA",
            "PostalCode": "94326",
            "Lat": "INVALID",
            "Long": "INVALID"
          },
          "ShipAddr": {
            "Id": "2",
            "Line1": "4581 Finch St.",
            "City": "Bayshore",
            "CountrySubDivisionCode": "CA",
            "PostalCode": "94326",
            "Lat": "INVALID",
            "Long": "INVALID"
          },
          "Job": false,
          "BillWithParent": false,
          "Balance": 539.0,
          "BalanceWithJobs": 539.0,
          "CurrencyRef": {
            "value": "USD",
            "name": "United States Dollar"
          },
          "PreferredDeliveryMethod": "Print",
          "domain": "QBO",
          "sparse": false,
          "Id": "1",
          "SyncToken": "0",
          "MetaData": {
            "CreateTime": "2017-12-17T16:48:43-08:00",
            "LastUpdatedTime": "2018-04-01T21:15:30-07:00"
          },
          "GivenName": "Amy",
          "FamilyName": "Lauterbach",
          "FullyQualifiedName": "Amy's Bird Sanctuary",
          "CompanyName": "Amy's Bird Sanctuary",
          "DisplayName": "Amy's Bird Sanctuary",
          "PrintOnCheckName": "Amy's Bird Sanctuary",
          "Active": true,
          "PrimaryPhone": {
            "FreeFormNumber": "(650) 555-3311"
          },
          "PrimaryEmailAddr": {
            "Address": "Birds@Intuit.com"
          }
        }
      ],
      "startPosition": 1,
      "maxResults": 1
    },
    "time": "2018-04-01T21:50:38.592-07:00"
  }

if ('Customer' in x.QueryResponse) {
    console.log('has');
} else {
    console.log('no in')
}

["Mansell, Phyllis & Mike","Martin, Ellen and Will","Ogden, Matt"].forEach(str => {
    console.log('str: ' + str + ' match Mike?: ' + str.includes('Mike'))
})

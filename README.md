apachetest.js
=============

Simple node.js module for testing apache redirect configurations.

I often get a list of URLS on a site that need to be 410 killed or 301 redirected to a new page. I wrote this
little module to help test the apache RewriteRules I would need to create.

Its designed to test one site at a time.

```javascript
var options = {
  domain = "www.mysite.com",
  statusCode = "301"
};

var test = new ApacheTest( options );

//can be full URL, will be rewritten to use the options.domain
test.setFrom("/redirect-from-here"); 
test.setTo("/redirect-to-here");

test.test(function(err, result){
  if( result.success ) {
    console.log(result.url + " success!");
  } else {
    console.log( result.url + " failed!" );
    console.log( "    Reason: " + result.reason ); //could be "status" or "location"
    console.log( "  Expected: " + result.expected );
    console.log( "    Actual: " + result.received );
  }
});
```

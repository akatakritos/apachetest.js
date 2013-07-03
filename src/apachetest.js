(function(){
	var url = require("url");
	var http = require("http");

	/**
	 * Represents a test of an apache configuration : a redirect or a status code.
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	ApacheTest = function( options ) {

		if (typeof options === "undefined" ) {
			options = {};
		}

		this.fromUrl = "";
		this.toUrl = "";
		this.statusCode = options.statusCode || "301";
		this.protocol = options.protocol || "http:";
		this.domain = "";
	};

	ApacheTest.prototype.setFrom = function( urlFrom ) {
		this.fromUrl = this.generateFullUrl( urlFrom );
	};

	ApacheTest.prototype.setTo = function( urlTo ) {
		this.toUrl = this.generateFullUrl( urlTo );
	};

	ApacheTest.prototype.generateFullUrl = function( partialUrl ) {
		var parts = url.parse( partialUrl );

		return (parts.protocol || this.protocol) + "//" +
			(parts.domain || this.domain) +
			parts.path;
	};

	ApacheTest.prototype.test = function( callback ) {

		var self = this;

		http.get( self.fromUrl, function( response ) {

			if ( self.statusCode != response.statusCode ) {
				callback(null, {
					url : self.fromUrl,
					success: false,
					reason: "status",
					expected: self.statusCode,
					received: response.statusCode
				});
			} else {
				if ( self.isRedirectStatus( self.statusCode) ) {
					if ( self.urlsMatch( self.toUrl, response.headers.location) ) {
						callback(null, {
							url : self.fromUrl,
							success : true,
							expected : self.toUrl,
							received : self.generateFullUrl(response.headers.location)
						});
					} else {
						callback( null, {
							url : self.fromUrl,
							success: false,
							reason: "location",
							expected: self.toUrl,
							received: self.generateFullUrl(response.headers.location)
						});
					}
				} else {
					callback(null, {
						url : self.fromUrl,
						success : true,
						expected : self.statusCode,
						received : response.statusCode
					});
				}
			}
		}).on('error', function(e) {
			callback(e, { url: self.fromUrl });
		});
	};

	ApacheTest.prototype.urlsMatch = function( a, b ) {
		var a_full = this.generateFullUrl( a );
		var b_full = this.generateFullUrl( b );
		return a_full == b_full;
	};

	ApacheTest.prototype.isRedirectStatus = function( statusCode ) {
		return statusCode == "301";
	};

	module.exports = ApacheTest;
})();
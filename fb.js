/*
// facebook app settings
module.exports = {
	'appID' : '1009565032492253',
	'appSecret' : 'eba4bc1eb7a02efee45f84884266c594',
	'callbackUrl' : 'http://localhost:8080/login/facebook/callback'
	//'callbackUrl': 'https://almuerzapp-lavellalabs.rhcloud.com/login/facebook/callback'
}
*/
// facebook app settings
module.exports = {
	'appID' : process.env.FACEBOOKappID,
	'appSecret' : process.env.FACEBOOKappSecret,
	'callbackUrl' : process.env.FACEBOOKcallbackUrl
}
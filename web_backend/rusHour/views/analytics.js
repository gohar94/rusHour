(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

var facebook_user_id = "";
if (document.getElementById('facebook_user_id')) {
    facebook_user_id = document.getElementById('facebook_user_id').innerHTML;
	ga('create', 'UA-61316907-1', { 'userId': facebook_user_id });
	console.log("sending user to analytics.");
} else {
	ga('create', 'UA-61316907-1', 'auto');
	console.log("not sending user to analytics.");
}
ga('send', 'pageview');


Twitch.init({clientId: 'ci2tc032wxaprwrcpz7qaqi8u70n7t8'}, function(error, status) {
// the sdk is now loaded
	if (status.authenticated) {
	  	// Already logged in, hide button
		$('.twitch-connect').hide()

		$(".QRCodeImage").attr("src","https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl="+encodeURIComponent(Twitch.getToken())+"&choe=UTF-8");
	}
});

$('.twitch-connect').click(function() {
  Twitch.login({
    scope: ['channel_editor','user_read', 'channel_read', 'chat_login', 'channel_subscriptions']
  });
})

Twitch.events.addListener('auth.login', function() {
  $(".QRCodeImage").attr("src","https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl="+encodeURIComponent(Twitch.getToken())+"&choe=UTF-8");
});


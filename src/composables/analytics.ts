
export function useAnalytics() {
	if(!window.location.host.match(/mkuhlmann\.org/g)) {
		return;
	}
	let _paq = [];
	_paq.push([
		/** @ts-ignore */
		function() { Matomo.getAsyncTracker().setCustomRequestProcessing(function(request) { return btoa(request); }); }
	]);
	_paq.push(['trackPageView']);
	_paq.push(['enableLinkTracking']);
	_paq.push(['enableHeartBeatTimer']);
	(function() {
		var u="https://analytics.mkuhlmann.org/";
		_paq.push(['setTrackerUrl', u+'js/trck.php']);
		_paq.push(['setSiteId', '5']);
		var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
		/** @ts-ignore */
		g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'js/'; s.parentNode.insertBefore(g,s);
	})();
};
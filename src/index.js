const cache = caches.default;

export default {
  async fetch(request, env, ctx) {
	const url = new URL(request.url);
	const { pathname } = url;
	const cacheUrl = new URL(request.url);

	// Construct the cache key from the cache URL
	const cacheKey = new Request(cacheUrl.toString(), request);
	let response = await cache.match(cacheKey);

	if (response) {
	  return response;
	}
	
	const peerReq = await fetch("https://floofy.tech/api/v1/instance/peers", {
      headers: {
        "User-Agent": "floofy.tech FEDI PEER COUNTER",
      },
    });
	const peers = await peerReq.json();

	response = new Response(JSON.stringify({ count: peers.length }),
						{ headers: { "Content-Type": "application/json",
									 "Cache-Control": "s-maxage=3600" } });
	ctx.waitUntil(cache.put(cacheKey, response.clone()));
	return response;
  },
};

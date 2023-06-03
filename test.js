async function lastfmScrapper() {
    let recent = null,
        data = null,
        d = await fetch(
            // eslint-disable-next-line max-len
            'https://953a29d3-dd81-419a-98da-b9660425be7d.id.repl.co/fuckcors?q=https://last.fm/user/natasquare'
        );
    d = await d.text();

    const doc = document.createElement('div');
    doc.innerHTML = d.replace(/<head>[^]+<\/head>/g, '').replace(/<script>[^]+<\/script>/);

    const tracklistDiv = doc.querySelector('.chartlist'),
        topTrackDiv = doc.querySelector('.header-featured-track'),
        statDiv = doc.querySelector('.header-metadata');

    if (tracklistDiv) {
        recent = [];
        const tracks = tracklistDiv.querySelectorAll('.chartlist-row');

        for (const track of tracks) {
            const artist = track.querySelector('.chartlist-artist').textContent.trim(),
                title = track.querySelector('.chartlist-name').textContent.trim(),
                cover = track.querySelector('.cover-art img').src,
                loved =
                    track
                        .querySelector('.chartlist-loved div')
                        .getAttribute('data-toggle-button-current-state') === 'loved';
            let timestamp = track.querySelector('.chartlist-timestamp span');
            timestamp = [timestamp.title, timestamp.textContent.trim()];

            recent.push({title, artist, cover, timestamp, loved});
        }
    }
    if (!topTrackDiv && !statDiv) return {recent, data};
    data = {};
    if (topTrackDiv) {
        const title = topTrackDiv.querySelector('.featured-item-name').textContent.trim(),
            artist = topTrackDiv.querySelector('.featured-item-artist').textContent.trim(),
            cover = topTrackDiv.querySelector('.cover-art img').src;
        data.topTrack = {title, artist, cover};
    }
    if (statDiv) {
        for (const item of statDiv.querySelectorAll('.header-metadata-item')) {
            const key = item
                    .querySelector('.header-metadata-title')
                    .textContent.trim()
                    .toLowerCase(),
                value = item.querySelector('.header-metadata-display').textContent.trim();
            data[key] = value;
        }
    }
    return {recent, data};
}

lastfmScrapper().then((x) => console.log(x));

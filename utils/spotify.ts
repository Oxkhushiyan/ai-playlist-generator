import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Mapping emotions to Spotify genres and search terms
const emotionToMusicMap: { [key: string]: string[] } = {
  Joy: ["happy", "upbeat", "dance", "pop"],
  Excitement: ["energetic", "edm", "dance", "party"],
  Satisfaction: ["chill", "feel-good", "pop"],
  Calm: ["ambient", "relaxing", "chill"],
  Awe: ["epic", "classical", "instrumental"],
  Nostalgia: ["80s", "90s", "oldies", "classic"],
  Relief: ["calm", "acoustic", "relaxing"],
  Surprise: ["experimental", "alternative", "indie"],
  Anxiety: ["lo-fi", "ambient", "calming"],
  Fear: ["dark", "intense", "dramatic"],
  Anger: ["rock", "metal", "intense"],
  Sad: ["sad", "melancholic", "emotional"],
  Horror: ["dark ambient", "suspense", "dramatic"],
  Confusion: ["experimental", "psychedelic", "complex"],
  Disgust: ["punk", "metal", "aggressive"],
  Bored: ["upbeat", "energetic", "dance"]
};

export async function createEmotionBasedPlaylist(accessToken: string, emotions: Record<string, number>) {
  try {
    spotifyApi.setAccessToken(accessToken);

    // Get the top 3 emotions
    const topEmotions = Object.entries(emotions)
      .filter(([_, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Create playlist name based on top emotions
    const playlistName = `Mood: ${topEmotions.map(([emotion]) => emotion).join(" & ")}`;
    const playlistDescription = `Generated playlist based on detected emotions: ${topEmotions
      .map(([emotion, value]) => `${emotion} ${Math.round(value * 100)}%`)
      .join(", ")}`;

    // Create playlist
    const { body: playlist } = await spotifyApi.createPlaylist(playlistName, {
      description: playlistDescription,
      public: true,
    });

    // Get tracks based on emotions
    const tracks = new Set<string>();
    for (const [emotion, weight] of topEmotions) {
      const searchTerms = emotionToMusicMap[emotion];
      if (!searchTerms) continue;

      // Search for tracks for each term
      for (const term of searchTerms) {
        const { body: searchResults } = await spotifyApi.searchTracks(`genre:${term}`, {
          limit: Math.ceil(10 * weight), // More tracks for stronger emotions
        });

        searchResults.tracks.items.forEach(track => {
          if (tracks.size < 30) { // Limit to 30 tracks total
            tracks.add(track.uri);
          }
        });
      }
    }

    // Add tracks to playlist
    if (tracks.size > 0) {
      await spotifyApi.addTracksToPlaylist(playlist.id, Array.from(tracks));
    }

    return {
      playlistId: playlist.id,
      playlistUrl: playlist.external_urls.spotify,
    };
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
}

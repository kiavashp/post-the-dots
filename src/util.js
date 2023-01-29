export const rankPlayers = players => {
    const ranked = players.sort((a, b) => b.score - a.score);

    // calc player position
    if (ranked.length && ranked[0].score > 0) {
        ranked[0].position = 1;

        for (let p = 1; p < ranked.length; p += 1) {
            const player = ranked[p];
            const prevPlayer = ranked[p - 1];

            if (!player.score) {
                continue;
            }

            if (prevPlayer.score === player.score) {
                player.position = prevPlayer.position;
            } else {
                player.position = prevPlayer.position + 1;
            }
        }
    }

    return ranked;
};

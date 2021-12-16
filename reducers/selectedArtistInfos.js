export default function (artistInfos = [], action) {
    if (action.type == 'selectedArtistInfos') {
       // console.log('artistInfos:', action.artistInfos);
        return action.artistInfos;
    } else {
        return artistInfos;
    }
}
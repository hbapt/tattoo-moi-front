export default function (infos = [], action) {
    if (action.type == 'saveTatoueurInfos') {
        return action.infos;
    } else {
        return infos;
    }
}

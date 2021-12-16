export default function(dataUser = null, action){
    if(action.type == 'addDataUser'){
        return action.dataUser
    } else if (action.type == 'disconnectUser') {
        return null
    } else {
        return dataUser
    }
}
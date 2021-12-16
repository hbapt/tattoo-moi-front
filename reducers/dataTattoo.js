export default function(dataTattoo = null, action){
    if(action.type == 'addDataTattoo'){
        return action.dataTattoo
    } else if (action.type == 'disconnectTattoo') {
        return dataTattoo
    } else {
        return dataTattoo
    }
}
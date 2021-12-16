export default function (position = {}, action) {
    if (action.type == 'saveUserPosition') {
        return action.position;
    } else {
        return position;
    }
}
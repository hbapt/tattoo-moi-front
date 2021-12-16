export default function (formId = [], action) {
    if (action.type == 'saveFormId') {
       
        return action.formId;
    } else {
        return formId;
    }
}
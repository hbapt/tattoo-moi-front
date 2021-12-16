export default function (formList = [], action) {

    if (action.type == 'addForm') {
        console.log("ADD FORM ACTIVE", formList)
        var formListCopy = [...formList]
        var filter = formList.filter((element) => element.dataForm == action.dataForm)
        if (filter.length == 0) {
            formListCopy.push(action.dataForm)
        }
        //    console.log(" FORM COPY ACTIVE", formListCopy)

        return formListCopy;
    } else if (action.type == 'saveForm') {
        console.log("SAVE FORM ACTIV2")
        return action.dataSaveForm
    }
    else if (action.type == "deleteForm") {
        var formListCopy = [...formList];

        var index = formListCopy.findIndex(element => element._id == action._id)
        formListCopy.splice(index, 1);
        return formListCopy;

    } else if (action.type == "deconnectForms") {
        return formList
    } else {
        return formList;
    }
}
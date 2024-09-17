
export function rotateModelBy90(direction = 'left', model) {

    var radians = Math.PI / 2 // 90 degrees in radians
    if (direction === 'left') {
        model.rotation.y -= radians
    } else {
        model.rotation.y += radians
    }
    let rotation = model.rotation.y
    updateRotation(model.userData.idString, rotation, model)

},

function updateRotation(id, rotY, model) {


},
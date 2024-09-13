export function dragModelListener(
    raycaster,
    clickMouse,
    moveMouse,
    camera,
    scene,
    controls,
    latestModel,
    updateModel
) {
    let draggableModel;
    let isColliding = false; // Flag to track collision status
    let collidedObject; // Variable to store the collided object
    let cursorGrab;
    let dotPlaced = false;
    let dotcheck = true;
    let savedRotation = {};
    let savedPosition = {};



    let dot = document.querySelector('.center-dot');

    // Add event listener to detect Shift key press/release
    const selectionBar = document.querySelector(".selection-bar-wrapper")
    window.addEventListener('touchstart', function (event) {
        handleClick(event, touchCoordinate);
    });
    window.addEventListener('touchmove', function (event) {
        handleMove(event, touchCoordinate);
    });
    window.addEventListener('touchend', handleClickEnd);

    window.addEventListener('mousedown', function (event) {
        handleClick(event, mouseCoordinate);
    });
    window.addEventListener('mousemove', function (event) {
        handleMove(event, mouseCoordinate);
    });

    window.addEventListener('mouseup', handleClickEnd);
    function touchCoordinate(event){
        let touchPosition = { 
            x: (event.touches[0].clientX / window.innerWidth) * 2 - 1,
            y: -(event.touches[0].clientY / window.innerHeight) * 2 + 1
        }
        return touchPosition
    }
    function mouseCoordinate(event) {
        let mousePosition = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
        }
        return mousePosition
    }  
    function handleClick(event, pointerPosition) {
        let targetElement = event.target;
        while (targetElement !== null) {
            if (targetElement === selectionBar) {
                return; // Do not run code if clicked on draggableDiv or its children
            }
            targetElement = targetElement.parentElement;
        }

        const {x, y} = pointerPosition(event)
        clickMouse.x = x
        clickMouse.y = y
        raycaster.setFromCamera(clickMouse, camera);
        console.log(targetElement)
        console.log(clickMouse.x, clickMouse.y)
        const found = raycaster.intersectObjects(scene.children, true);
        console.log(found)
        if (found.length) {
            let current = found[0].object;
            while (current.parent.parent !== null) {
                document.body.classList.add('cursor-grab');
                current = current.parent;
                console.log("current", current)
                console.log('isdraggable')
            }
            if (current.isDraggable) {
                draggableModel = current;
                console.log(current)
                latestModel[0] = current;
                controls.enabled = false;
                dotPlaced = false;
                document.body.classList.remove('cursor-grab');
                document.body.classList.add('cursor-grabbing');
                console.log("isDraggable")
            }
        }
    }

    function handleMove(event, pointerPosition) {
        let targetElement = event.target;
        while (targetElement !== null) {
            if (targetElement === selectionBar) {
                return; // Do not run code if clicked on draggableDiv or its children
            }
            targetElement = targetElement.parentElement;
        }

        const { x, y } = pointerPosition(event)

        moveMouse.set(
            x,
            y
        );
        // console.log(moveMouse.x, moveMouse.y);

        raycaster.setFromCamera(moveMouse, camera);
        let collisions = raycaster.intersectObjects(scene.children, true);
        if (collisions.length) {
            let target = collisions[0].object;
            while (target.parent.parent !== null) {
                target = target.parent;
            }
            if (target.isDraggable) {
                controls.enabled = false;
                cursorGrab = true;
                dotcheck = true;
                if (cursorGrab) {
                    document.body.classList.add('cursor-grab');
                }
            } else {
                controls.enabled = true;
                cursorGrab = false;
                dotcheck = false;
                document.body.classList.remove('cursor-grab');
            }
        }
        dragModel();
    }

    function handleClickEnd(event) {
        

        if (draggableModel) {
            savedRotation = draggableModel.rotation.clone();
            savedPosition = draggableModel.position.clone();
            updateModel(
                draggableModel.userData.idString,
                savedRotation.y,
                savedPosition.x,
                savedPosition.z
            );
        }
        draggableModel = undefined;
        isColliding = false;
        collidedObject = undefined;
        controls.enabled = true;
        document.body.classList.remove('cursor-grabbing');
    }



    function dragModel() {
        if (draggableModel) {
            const found = raycaster.intersectObjects(scene.children);
            if (found.length > 0) {
                // Check for collisions with other draggable objects
                for (const child of scene.children) {
                    if (child.isDraggable && child !== draggableModel) {
                        if (
                            draggableModel.userData.boundingBox.intersectsBox(
                                child.userData.boundingBox
                            )
                        ) {
                            // Handle collision
                        }
                    }
                }

                if (!isColliding) {
                    // Move the model to the new position

                    const obj3d = found[0];
                    draggableModel.position.x = obj3d.point.x;
                    draggableModel.position.z = obj3d.point.z;
                    draggableModel.userData.boundingBox.setFromObject(
                        draggableModel
                    ); // Reassign bounding box

                    collidedObject = obj3d.object; // Store the collided object
                }
            }
        }
    }
}



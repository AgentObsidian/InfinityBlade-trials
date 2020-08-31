window.onload = main;
var c,
    ctx,
    middleMousedown = false,
    canvasZoomScale = 1,
    middleMouseDragStart,
    canvasOrigin = [20, 20],
    canvasOriginDragStart,
    mapMatrix = [],
    toolDown = false,
    toolDragStart,
    toolPosition,
    activeTool;

function drawBackgroundGridlines(){

    ctx.strokeStyle = "#606060";
    ctx.lineWidth = 1;

    for(var i = 1;i < Math.ceil((c.width - canvasOrigin[0])/(64/canvasZoomScale));i++){
        ctx.beginPath();
        ctx.moveTo(canvasOrigin[0] + i*(64/canvasZoomScale), canvasOrigin[1]);
        ctx.lineTo(canvasOrigin[0] + i*(64/canvasZoomScale), c.height);
        ctx.stroke();
    }

    for(var i = 1;i < Math.ceil((c.height - canvasOrigin[1])/(64/canvasZoomScale));i++){
        ctx.beginPath();
        ctx.moveTo(canvasOrigin[0], canvasOrigin[1] + i*(64/canvasZoomScale));
        ctx.lineTo(c.width, canvasOrigin[1] + i*(64/canvasZoomScale));
        ctx.stroke();
    }

    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(canvasOrigin[0], canvasOrigin[1]);
    ctx.lineTo(canvasOrigin[0], c.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvasOrigin[0], canvasOrigin[1]);
    ctx.lineTo(c.width, canvasOrigin[1]);
    ctx.stroke();

}

function resizeCanvas(){

    c.height = window.innerHeight;
    c.width = window.innerWidth - 300;

}

function showToolPreview(){

    if(toolDown && (toolDragStart[0] >= 0) && (toolDragStart[1] >= 0)){

        if(toolDragStart[0] <= toolPosition[0]){
            var previewX = Math.floor(toolDragStart[0]) * (64/canvasZoomScale) + canvasOrigin[0];
            var previewWidth = Math.ceil(toolPosition[0]) * (64/canvasZoomScale) + canvasOrigin[0] - previewX;
        }else{
            if(toolPosition[0] < 0){
                var previewX = canvasOrigin[0];
            }else{
                var previewX = Math.floor(toolPosition[0]) * (64/canvasZoomScale) + canvasOrigin[0];
            }
            var previewWidth = Math.ceil(toolDragStart[0]) * (64/canvasZoomScale) + canvasOrigin[0] - previewX;
        }
        
        if(toolDragStart[1] <= toolPosition[1]){
            var previewY = Math.floor(toolDragStart[1]) * (64/canvasZoomScale) + canvasOrigin[1];
            var previewHeight = Math.ceil(toolPosition[1]) * (64/canvasZoomScale) + canvasOrigin[1] - previewY;
        }else{
            if(toolPosition[1] < 0){
                var previewY = canvasOrigin[1];
            }else{
                var previewY = Math.floor(toolPosition[1]) * (64/canvasZoomScale) + canvasOrigin[1];
            }
            var previewHeight = Math.ceil(toolDragStart[1]) * (64/canvasZoomScale) + canvasOrigin[1] - previewY;
        }

        ctx.fillStyle = "rgb(255, 255, 255, .3)";
        ctx.fillRect(previewX, previewY, previewWidth, previewHeight);
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(previewX, previewY);
        ctx.lineTo(previewX + previewWidth, previewY);
        ctx.lineTo(previewX + previewWidth, previewY + previewHeight);
        ctx.lineTo(previewX, previewY + previewHeight);
        ctx.lineTo(previewX, previewY);
        ctx.stroke();

    }

}

function renderCanvas(){

    ctx.fillStyle = "#404040";
    ctx.fillRect(0, 0, c.width, c.height);

    drawBackgroundGridlines();
    showToolPreview();

}

function main(){

    c = getEl("c");
    ctx = c.getContext("2d");
    resizeCanvas();
    renderCanvas();

    window.addEventListener("resize", function(e){
        resizeCanvas();
        renderCanvas();
    });

    c.addEventListener("mousedown", function(e){
        if(e.which == 2){
            middleMousedown = true;
            middleMouseDragStart = [e.x, e.y];
            canvasOriginDragStart = [canvasOrigin[0], canvasOrigin[1]];
            c.style.cursor = "move";
        }else if(e.which == 1){
            toolDown = true;
            toolDragStart = [
                ((e.x - 300) - canvasOrigin[0])/(64/canvasZoomScale),
                (e.y - canvasOrigin[1])/(64/canvasZoomScale)
            ];
            toolPosition = [
                ((e.x - 300) - canvasOrigin[0])/(64/canvasZoomScale),
                (e.y - canvasOrigin[1])/(64/canvasZoomScale)
            ];
            c.style.cursor = "pointer";
            renderCanvas();
        }
    });

    window.addEventListener("mouseup", function(e){
        if(e.which == 2){
            middleMousedown = false;
        }else if(e.which == 1){
            toolDown = false;
        }
        c.style.cursor = "default";
        renderCanvas();
    });

    window.addEventListener("mousemove", function(e){
        if(middleMousedown && !toolDown){
            canvasOrigin = [canvasOriginDragStart[0] + e.x - middleMouseDragStart[0], canvasOriginDragStart[1] + e.y - middleMouseDragStart[1]];
            renderCanvas();
        }else if(toolDown && !middleMousedown){
            toolPosition = [
                ((e.x - 300) - canvasOrigin[0])/(64/canvasZoomScale),
                (e.y - canvasOrigin[1])/(64/canvasZoomScale)
            ];
            renderCanvas();
        }
    });

    window.addEventListener('contextmenu', function(e){
        e.preventDefault();
    });

}

function getEl(id){return document.getElementById(String(id));}
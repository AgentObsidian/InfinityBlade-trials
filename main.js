window.onload = main;
var canvas, ctx;

function drawBackgroundGridlines(){

    ctx.strokeStyle = "#606060";
    ctx.lineWidth = 1;

    for(var i = 1;i < Math.ceil((canvas.width - canvas.origin[0])/(64/canvas.zoomScale));i++){
        ctx.beginPath();
        ctx.moveTo(canvas.origin[0] + i*(64/canvas.zoomScale), canvas.origin[1]);
        ctx.lineTo(canvas.origin[0] + i*(64/canvas.zoomScale), canvas.height);
        ctx.stroke();
    }

    for(var i = 1;i < Math.ceil((canvas.height - canvas.origin[1])/(64/canvas.zoomScale));i++){
        ctx.beginPath();
        ctx.moveTo(canvas.origin[0], canvas.origin[1] + i*(64/canvas.zoomScale));
        ctx.lineTo(canvas.width, canvas.origin[1] + i*(64/canvas.zoomScale));
        ctx.stroke();
    }

    ctx.strokeStyle = "#FFFFFF";

    ctx.beginPath();
    ctx.moveTo(canvas.origin[0], canvas.origin[1]);
    ctx.lineTo(canvas.origin[0], canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.origin[0], canvas.origin[1]);
    ctx.lineTo(canvas.width, canvas.origin[1]);
    ctx.stroke();

}

function showToolPreview(){

    if(canvas.tool.toolActive && (canvas.tool.toolStart[0] >= 0) && (canvas.tool.toolStart[1] >= 0)){

        if(canvas.tool.toolStart[0] <= canvas.tool.toolPosition[0]){
            var previewX = Math.floor(canvas.tool.toolStart[0]) * (64/canvas.zoomScale) + canvas.origin[0];
            var previewWidth = Math.ceil(canvas.tool.toolPosition[0]) * (64/canvas.zoomScale) + canvas.origin[0] - previewX;
        }else{
            if(canvas.tool.toolPosition[0] < 0){
                var previewX = canvas.origin[0];
            }else{
                var previewX = Math.floor(canvas.tool.toolPosition[0]) * (64/canvas.zoomScale) + canvas.origin[0];
            }
            var previewWidth = Math.ceil(canvas.tool.toolStart[0]) * (64/canvas.zoomScale) + canvas.origin[0] - previewX;
        }
        
        if(canvas.tool.toolStart[1] <= canvas.tool.toolPosition[1]){
            var previewY = Math.floor(canvas.tool.toolStart[1]) * (64/canvas.zoomScale) + canvas.origin[1];
            var previewHeight = Math.ceil(canvas.tool.toolPosition[1]) * (64/canvas.zoomScale) + canvas.origin[1] - previewY;
        }else{
            if(canvas.tool.toolPosition[1] < 0){
                var previewY = canvas.origin[1];
            }else{
                var previewY = Math.floor(canvas.tool.toolPosition[1]) * (64/canvas.zoomScale) + canvas.origin[1];
            }
            var previewHeight = Math.ceil(canvas.tool.toolStart[1]) * (64/canvas.zoomScale) + canvas.origin[1] - previewY;
        }

        if(canvas.tool.activeTool == "barrierPaint"){

            ctx.fillStyle = "rgb(255, 50, 255, .3)";
            ctx.strokeStyle = "#FF50FF";

        }else{

            ctx.fillStyle = "rgb(255, 255, 255, .3)";
            ctx.strokeStyle = "#FFFFFF";

        }

        ctx.fillRect(previewX, previewY, previewWidth, previewHeight);

        ctx.beginPath();
        ctx.moveTo(previewX, previewY);
        ctx.lineTo(previewX + previewWidth, previewY);
        ctx.lineTo(previewX + previewWidth, previewY + previewHeight);
        ctx.lineTo(previewX, previewY + previewHeight);
        ctx.lineTo(previewX, previewY);
        ctx.stroke();

    }

}

function main(){

    canvas = getEl("canvas");
    canvas.zoomScale = 1;
    canvas.origin = [20, 20];
    canvas.moving = false;
    canvas.moveStart = [0, 0];
    canvas.moveOrigin = [0, 0];
    canvas.mapMatrix = [];
    
    canvas.tool = {
        "toolActive": false,
        "activeTool": "barrierPaint",
        "toolPosition": [0, 0],
        "toolStart": [0, 0]
    };

    canvas.render = function(){

        ctx.fillStyle = "#404040";
        ctx.fillRect(0, 0, this.width, this.height);
    
        drawBackgroundGridlines();
        showToolPreview();
    
    };

    canvas.resize = function(){

        this.height = window.innerHeight;
        this.width = window.innerWidth - 300;

    }

    ctx = canvas.getContext("2d");
    canvas.resize();
    canvas.render();

    window.addEventListener("resize", function(e){

        canvas.resize();
        canvas.render();

    });

    canvas.addEventListener("mousedown", function(e){

        if(e.which == 2){

            this.moving = true;
            this.moveStart = [e.x, e.y];
            this.moveOrigin = [this.origin[0], this.origin[1]];
            this.style.cursor = "move";

        }else if(e.which == 1){

            this.tool.toolActive = true;
            this.tool.toolStart = [
                ((e.x - 300) - this.origin[0]) / (64/this.zoomScale),
                (e.y - this.origin[1]) / (64/this.zoomScale)
            ];
            this.tool.toolPosition = [
                ((e.x - 300) - this.origin[0]) / (64/this.zoomScale),
                (e.y - this.origin[1]) / (64/this.zoomScale)
            ];
            this.style.cursor = "pointer";
            this.render();

        }

    });

    window.addEventListener("mouseup", function(e){

        if(e.which == 2){

            canvas.moving = false;

        }else if(e.which == 1){

            canvas.tool.toolActive = false;

        }

        canvas.style.cursor = "default";
        canvas.render();

    });

    window.addEventListener("mousemove", function(e){

        if(canvas.moving && !canvas.tool.toolActive){

            canvas.origin = [canvas.moveOrigin[0] + e.x - canvas.moveStart[0], canvas.moveOrigin[1] + e.y - canvas.moveStart[1]];
            canvas.render();

        }else if(canvas.tool.toolActive && !canvas.moving){

            canvas.tool.toolPosition = [
                ((e.x - 300) - canvas.origin[0])/(64/canvas.zoomScale),
                (e.y - canvas.origin[1])/(64/canvas.zoomScale)
            ];
            canvas.render();

        }

    });

    window.addEventListener("keyup", function(e){

        if(e.keyCode == 27 && canvas.tool.toolActive){

            canvas.tool.toolActive = false;
            canvas.render();

        }

    });

    window.addEventListener('contextmenu', function(e){e.preventDefault();});

    getEl("scaleSlider").addEventListener("input", function(e){

        canvas.zoomScale = this.value;
        getEl("scaleSliderTitle").innerText = "Scale - " + String(this.value) + "x";
        canvas.render();

    });

    for(var i = 0;i < document.getElementsByClassName("tool").length;i++){

        document.getElementsByClassName("tool")[i].addEventListener("click", function(e){

            console.log(this.toolName);

        });

    }

}

function getEl(id){return document.getElementById(String(id));}
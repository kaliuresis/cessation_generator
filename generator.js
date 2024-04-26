function generate(width, scale, message) {
    let symbols = [];
    let n_symbols = 0;
    let key = [1,1,0,0,1,1,1,1,0,1,0,0,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,1,1,0,1]
    let key_index = 0;
    for(let i = 0; i < message.length; i++) {
        let b = message.charCodeAt(i);
        while(b > 0) {
            for(let j = 0; j < 8; j++) {
                let jump = 0;
                do {
                    key_index++;
                    jump++;
                    if(key_index >= 30) {
                        symbols.push(0);
                        n_symbols++;
                        key_index = 0;
                        jump = 1;
                    }
                    if(jump >= 5) break;
                } while(((b>>(7-j))&1) != key[key_index]);
                symbols.push(jump);
                n_symbols++;
            }
            b >>= 8;
        }
    }

    let widths = [3,1,1,1,3,3];

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = width;
    let x_base = 1;
    let x = x_base;
    let y = 2;
    let height = 5;
    for(let i = 0; i < n_symbols; i++) {
        let symbol = symbols[i];
        if((x+widths[symbol])*scale > width) {
            x = x_base;
            height += 5;
        }
        x += widths[symbol]+1;
    }
    height *= scale;
    canvas.height = height;

    x = x_base;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    for(let i = 0; i < n_symbols; i++) {
        let symbol = symbols[i];
        if((x+widths[symbol])*scale > width) {
            x = x_base;
            y += 5;
        }
        switch(symbol) {
        case 0: {
            context.fillRect(x*scale, (y-1)*scale, 2*scale, scale);
            context.fillRect(x*scale, (y)*scale, scale, 2*scale);
            context.fillRect((x+1)*scale, (y+1)*scale, 2*scale, scale);
            context.fillRect((x+2)*scale, (y-1)*scale, scale, 2*scale);
        } break;
        case 1: {
            context.fillRect(x*scale, y*scale, scale, scale);
        } break;
        case 2: {
            context.fillRect(x*scale, (y-1)*scale, scale, scale);
            context.fillRect(x*scale, (y+1)*scale, scale, scale);
        } break;
        case 3: {
            context.fillRect(x*scale, (y-1)*scale, scale, 3*scale);
        } break;
        case 4: {
            context.fillRect(x*scale, y*scale, scale, scale);
            context.fillRect((x+1)*scale, (y-1)*scale, scale, scale);
            context.fillRect((x+2)*scale, y*scale, scale, scale);
            context.fillRect((x+1)*scale, (y+1)*scale, scale, scale);
        } break;
        case 5: {
            context.fillRect(x*scale, y*scale, 3*scale, scale);
            context.fillRect((x+1)*scale, (y-1)*scale, scale, 3*scale);
        } break;
        }
        x += widths[symbol]+1;
    }

    return [height, canvas.toDataURL('image/png')];
}

function update_message() {
    let image = document.getElementById("generated_image");
    let width = document.getElementById("width").value;
    let scale = document.getElementById("scale").value;
    image.width = width;
    let message = document.getElementById("message").value;
    let [height, src] = generate(width, scale, message)
    image.height = height;
    image.src = src;
    return false;
}

let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    // Usar el modo de color HSB es ideal para cambios de color suaves
    colorMode(HSB, 360, 100, 100, 100); 
}

function draw() {
    // Fondo semitransparente para crear el efecto de estela
    background(0, 0, 0, 25); 

    // Crea nuevas partículas en la posición del ratón
    let p = new Particle(mouseX, mouseY);
    particles.push(p);

    // Recorre todas las partículas
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].isFinished()) {
            // Elimina la partícula si ha cumplido su ciclo
            particles.splice(i, 1);
        }
    }
}

class Particle {
    constructor(x, y) {
        // Nace en la posición del ratón, con una dirección aleatoria
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(2, 5));
        this.lifespan = 255;
    
        // El color cambia con el tiempo usando frameCount
        this.hue = frameCount % 360; 
    }

    isFinished() {
        return this.lifespan < 0;
    }

    update() {
        this.pos.add(this.vel);
        this.lifespan -= 4;
    }

    show() {
        noFill();
        stroke(this.hue, 90, 90, this.lifespan);
        strokeWeight(2);
        // Dibuja varios círculos para el efecto "slinky"
        for(let i=0; i<5; i++){
            circle(this.pos.x, this.pos.y, i * 5);
        }
    }
}
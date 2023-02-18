const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');//to map values
const Tweakpane = require('tweakpane');

const settings = {
	dimensions: [ 1080, 1080 ],
	animate: true
};

//Declare Variables
const item_name = "Cheese";
const co2_value = 0.33;
const water_value = 0.02;
const land_value = 0.08;

//Scale-mapping Data
const co2_scaled = math.mapRange(co2_value, 0, 1, 0, 50) // map range (const to map, origin base, origin top, new base, new top)
const water_scaled = math.mapRange(water_value, 0, 1, 0, 1)
const land_scaled = math.mapRange(land_value, 0, 1, 1, 15)
console.log("land_value:",land_value ,"land_scaled:", land_scaled )


const params = {
  cols: land_scaled,
  rows: land_scaled,
  scaleMin: co2_scaled,
  scaleMax: co2_scaled,
  freq: 0.001,
  amp: water_scaled,
};
console.log("params:",params)

const sketch = () => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = '#F6F3E1';
		context.fillRect(0, 0, width, height);

		const cols = params.cols;
		const rows = params.rows;
		const numCells = cols * rows;
    console.log("cols:",cols)

		const gridw = width  * 0.5;
		const gridh = height * 0.5;
		const cellw = gridw / cols;
		const cellh = gridh / rows;
		const margx = (width  - gridw) * 0.5;
		const margy = (height - gridh) * 0.4;

		for (let i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cellw;
			const y = row * cellh;
			const w = cellw * 0.6;
			const h = cellh * 0.6;

			const f = params.animate ? frame : params.frame;

			const n = random.noise2D(x + frame * 10, y, params.freq);
			// const n = random.noise3D(x, y, f * 10, params.freq);


			const angle = n * Math.PI * params.amp;

			// const scale = (n + 1) / 2 * 30;
			// const scale = (n * 0.5 + 0.5) * 30;
			const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax); // map range (const to map, origin base, origin top, new base, new top)

			context.save();
			context.translate(x, y);
			context.translate(margx, margy);
			context.translate(cellw * 0.5, cellh * 0.5);
			context.rotate(angle);

			context.lineWidth = scale;
			// context.lineCap = params.lineCap;

			context.beginPath();
			// context.moveTo(w * -0.5, 0);
			// context.lineTo(w *  0.5, 0);
      context.arc(30, 25, 35, 0, Math.PI*2, false); // Mouth (clockwise)

			context.stroke();


			context.restore();
		}

 //center the title
 context.font = "120px futura";
 const len_text = context.measureText(item_name).width;
 const x_center = width/2 - (len_text/2);

 context.fillStyle = "#3E3F44";
 context.fillText(item_name, x_center, 1020);
//  const len_text2 = context.measureText("by data-feelings.com").width;
//  const x_center2 = width/2 - (len_text2 /5);
//  context.font = "30px futura";
//  context.fillText("by data-feelings.com", x_center2, 1050);
//  context.shadowBlur = 60;
  };
};



const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Grid '});

  folder.addInput(params, 'cols', { min: 1, max: 15, step: 1 });
  folder.addInput(params, 'rows', { min: 1, max: 15, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 0, max: 100 });
  folder.addInput(params, 'scaleMax', { min: 0, max: 100 });
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01 });
  folder.addInput(params, 'amp', { min: 0, max: 1 });

};


createPane();
canvasSketch(sketch, settings);


//https://frontendmasters.com/courses/webgl-shaders/exporting-animations-in-canvas-sketch/
// # Save animations to GIF file instead
// canvas-sketch sketches/animation.js --output=media/ --stream=gif
//Cmd+ ↑ Shift +S

// # Save animations to GIF but scale it down to 512 px wide
// canvas-sketch sketches/animation.js --output=tmp --stream [ gif --scale=512:-1 ]

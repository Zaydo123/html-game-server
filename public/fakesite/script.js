function update() {
    // var n1 = parseFloat(document.getElementById('input1').value);
    // var n2 = parseFloat(document.getElementById('input2').value);
    
    var calc = document.getElementById('calculators').value;
    if (calc === 'Calculator-Choice') {
        document.getElementById('input1').value = '';
        document.getElementById('input2').value = '';
        document.getElementById('input3').value = '';
        document.getElementById('input4').value = '';
        document.getElementById('input5').value = '';

        document.getElementById('input1header').innerText = '';
        document.getElementById('input2header').innerText = '';
        document.getElementById('input3header').innerText = '';
        document.getElementById('input4header').innerText = '';
        document.getElementById('input5header').innerText = '';

        document.getElementById('input1header').style.display = 'none';
        document.getElementById('input2header').style.display = 'none';
        document.getElementById('input3header').style.display = 'none';
        document.getElementById('input4header').style.display = 'none';
        document.getElementById('input5header').style.display = 'none';

        document.getElementById('input1').type = 'hidden';
        document.getElementById('input2').type = 'hidden';
        document.getElementById('input3').type = 'hidden';
        document.getElementById('input4').type = 'hidden';
        document.getElementById('input5').type = 'hidden';

        document.getElementById('Calculate').hidden = 'hidden';

        document.getElementById('OutputBox').style.display = 'none';
    }
    if(calc === 'Gravitational-Force-Calculator') {
        // document.getElementById('title').innerText = 'Gravitational Force Calculator'
        document.getElementById('input1').value = '';
        document.getElementById('input2').value = '';
        document.getElementById('input3').value = '';
        document.getElementById('input4').value = '';
        document.getElementById('input5').value = '';

        document.getElementById('input1header').innerText = 'Mass 1 (kg)';
        document.getElementById('input2header').innerText = 'Mass 2 (kg)';
        document.getElementById('input3header').innerText = 'Distance (m)';
        document.getElementById('input4header').innerText = '';
        document.getElementById('input5header').innerText = '';

        document.getElementById('input1header').style.display = '';
        document.getElementById('input2header').style.display = '';
        document.getElementById('input3header').style.display = '';
        document.getElementById('input4header').style.display = 'none';
        document.getElementById('input5header').style.display = 'none';

        document.getElementById('input1').type = 'text';
        document.getElementById('input2').type = 'text';
        document.getElementById('input3').type = 'text';
        document.getElementById('input4').type = 'hidden';
        document.getElementById('input5').type = 'hidden';

        document.getElementById('Calculate').hidden = "";

        document.getElementById('OutputBox').style.display = '';
        document.getElementById('result').innerText = ''



    }
    if(calc === 'Force-Calculator') {
        // document.getElementById('title').innerText = 'Force Calculater';
        document.getElementById('input1').value = '';
        document.getElementById('input2').value = '';
        document.getElementById('input3').value = '';
        document.getElementById('input4').value = '';
        document.getElementById('input5').value = '';

        document.getElementById('input1header').innerText = 'Mass (kg)';
        document.getElementById('input2header').innerText = 'Acceleration (m/s^2)';
        document.getElementById('input3header').innerText = '';
        document.getElementById('input4header').innerText = '';
        document.getElementById('input5header').innerText = '';
        
        document.getElementById('input1header').style.display = '';
        document.getElementById('input2header').style.display = '';
        document.getElementById('input3header').style.display = 'none';
        document.getElementById('input4header').style.display = 'none';
        document.getElementById('input5header').style.display = 'none';

        document.getElementById('input1').type = 'text';
        document.getElementById('input2').type = 'text';
        document.getElementById('input3').type = 'hidden';
        document.getElementById('input4').type = 'hidden';
        document.getElementById('input5').type = 'hidden';

        document.getElementById('Calculate').hidden = "";

        document.getElementById('OutputBox').style.display = '';
        document.getElementById('result').innerText = ''
    }
    if(calc === 'Acceleration-Calculator') {
        // document.getElementById('title').innerText = 'Force Calculater';
        document.getElementById('input1').value = '';
        document.getElementById('input2').value = '';
        document.getElementById('input3').value = '';
        document.getElementById('input4').value = '';
        document.getElementById('input5').value = '';

        document.getElementById('input1header').innerText = 'Initial Speed (m/s)';
        document.getElementById('input2header').innerText = 'Final Speed (m/s)';
        document.getElementById('input3header').innerText = 'Time (s)';
        document.getElementById('input4header').innerText = '';
        document.getElementById('input5header').innerText = '';
        
        document.getElementById('input1header').style.display = '';
        document.getElementById('input2header').style.display = '';
        document.getElementById('input3header').style.display = '';
        document.getElementById('input4header').style.display = 'none';
        document.getElementById('input5header').style.display = 'none';

        document.getElementById('input1').type = 'text';
        document.getElementById('input2').type = 'text';
        document.getElementById('input3').type = 'text';
        document.getElementById('input4').type = 'hidden';
        document.getElementById('input5').type = 'hidden';

        document.getElementById('Calculate').hidden = "";

        document.getElementById('OutputBox').style.display = '';
        document.getElementById('result').innerText = ''
    }
    if(calc === 'Friction-Calculator') {
        // document.getElementById('title').innerText = 'Force Calculater';
        document.getElementById('input1').value = '';
        document.getElementById('input2').value = '';
        document.getElementById('input3').value = '';
        document.getElementById('input4').value = '';
        document.getElementById('input5').value = '';

        document.getElementById('input1header').innerText = 'Friction Coefficient (μ)';
        document.getElementById('input2header').innerText = 'Normal Force (N)';
        document.getElementById('input3header').innerText = '';
        document.getElementById('input4header').innerText = '';
        document.getElementById('input5header').innerText = '';
        
        document.getElementById('input1header').style.display = '';
        document.getElementById('input2header').style.display = '';
        document.getElementById('input3header').style.display = 'none';
        document.getElementById('input4header').style.display = 'none';
        document.getElementById('input5header').style.display = 'none';

        document.getElementById('input1').type = 'text';
        document.getElementById('input2').type = 'text';
        document.getElementById('input3').type = 'hidden';
        document.getElementById('input4').type = 'hidden';
        document.getElementById('input5').type = 'hidden';

        document.getElementById('Calculate').hidden = "";

        document.getElementById('OutputBox').style.display = '';
        document.getElementById('result').innerText = ''
    }
}

function calc()
{
    var n1 = parseFloat(document.getElementById('input1').value);
    var n2 = parseFloat(document.getElementById('input2').value);
    var n3 = parseFloat(document.getElementById('input3').value);
    var n4 = parseFloat(document.getElementById('input4').value);
    var n5 = parseFloat(document.getElementById('input5').value);
    
    var calc = document.getElementById('calculators').value;
    
    if(calc === 'Gravitational-Force-Calculator')
    {
        document.getElementById('result').style.display  = '';
        document.getElementById('result').innerText = (n1 * n2 * 6.674 * 10 **(-11)) / (n3 ** 2) + ' N';
    }
    
    if(calc === 'Force-Calculator')
    {
        document.getElementById('result').style.display  = '';
        document.getElementById('result').innerText = n1 * n2 + ' N';
    }
    
    if(calc === 'Acceleration-Calculator')
    {
        document.getElementById('result').style.display  = '';
        document.getElementById('result').innerText = (n2 - n1) / n3 + ' m/s^2';
    }
    
    if(calc === 'Friction-Calculator')
    {
        document.getElementById('result').style.display  = '';
        document.getElementById('result').innerText = n1 * n2 + ' N';
    }
}

// Pixel Dust by @neave

window.requestAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		setTimeout(callback, 1000 / 60);
	};

function FluidField() {
	var iterations = 4,
		dt = 0.05,
		damp = 0.99,
		dens,
		dens_prev,
		u,
		u_prev,
		v,
		v_prev,
		width,
		height,
		rowSize,
		size;

	function Field(dens, u, v) {
		this.getDensity = function(x, y) {
			return dens[(x + 1) + (y + 1) * rowSize];
		};

		this.setDensity = function(x, y, d) {
			dens[(x + 1) + (y + 1) * rowSize] = d;
		};

		this.setVelocity = function(x, y, xv, yv) {
			u[(x + 1) + (y + 1) * rowSize] = xv;
			v[(x + 1) + (y + 1) * rowSize] = yv;
		};
	}

	function addFields(x, s) {
		for (var i = size; i--; ) x[i] += s[i] * dt;
	}

	function setBoundary(b, x) {
		if (b === 1) {
			for (var i = 1; i <= width; i++) {
				x[i] = x[i + rowSize];
				x[i + (height+1) *rowSize] = x[i + height * rowSize];
			}

			for (var j = 1; i <= height; i++) {
				x[j * rowSize] = -x[1 + j * rowSize];
				x[(width + 1) + j * rowSize] = -x[width + j * rowSize];
			}
		} else if (b === 2) {
			for (var i = 1; i <= width; i++) {
				x[i] = -x[i + rowSize];
				x[i + (height + 1) * rowSize] = -x[i + height * rowSize];
			}

			for (var j = 1; j <= height; j++) {
				x[j * rowSize] = x[1 + j * rowSize];
				x[(width + 1) + j * rowSize] = x[width + j * rowSize];
			}
		} else {
			for (var i = 1; i <= width; i++) {
				x[i] = x[i + rowSize];
				x[i + (height + 1) * rowSize] = x[i + height * rowSize];
			}

			for (var j = 1; j <= height; j++) {
				x[j * rowSize] = x[1 + j * rowSize];
				x[(width + 1) + j * rowSize] = x[width + j * rowSize];
			}
		}

		var maxEdge = (height + 1) * rowSize;
		x[0] = 0.5 * (x[1] + x[rowSize]);
		x[maxEdge] = 0.5 * (x[1 + maxEdge] + x[height * rowSize]);
		x[(width + 1)] = 0.5 * (x[width] + x[(width + 1) + rowSize]);
		x[(width + 1) + maxEdge] = 0.5 * (x[width + maxEdge] + x[(width + 1) + height * rowSize]);
	}

	function diffuse(b, x, x0) {
		var a = 0;
		solveLinear(b, x, x0, a, 1 + 4 * a);
	}

	function diffuse2(x, x0, y, y0) {
		var a = 0;
		solveLinear2(x, x0, y, y0, a, 4 * a + 1);
	}

	function solveLinear(b, x, x0, a, c) {
		if (a === 0 && c === 1) {
			for (var j = 1; j <= height; j++) {
				var currentRow = j * rowSize;
				currentRow++;

				for (var i = 0; i < width; i++) {
					x[currentRow] = x0[currentRow];
					currentRow++;
				}
			}

			setBoundary(b, x);
		}
		else {
			var invC = 1 / c;
			for (var k = 0 ; k < iterations; k++) {
				for (var j = 1 ; j <= height; j++) {
					var lastRow = (j - 1) * rowSize;
					var currentRow = j * rowSize;
					var nextRow = (j + 1) * rowSize;
					var lastX = x[currentRow];
					currentRow++;

					for (var i = 1; i <= width; i++) {
						lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) * invC;
					}
				}

				setBoundary(b, x);
			}
		}
	}

	function solveLinear2(x, x0, y, y0, a, c) {
		if (a === 0 && c === 1) {
			for (var j = 1; j <= height; j++) {
				var currentRow = j * rowSize;
				currentRow++;

				for (var i = 0; i < width; i++) {
					x[currentRow] = x0[currentRow];
					y[currentRow] = y0[currentRow];
					currentRow++;
				}
			}

			setBoundary(1, x);
			setBoundary(2, y);
		}
		else {
			var invC = 1 / c;
			for (var k = 0 ; k < iterations; k++) {
				for (var j = 1 ; j <= height; j++) {
					var lastRow = (j - 1) * rowSize;
					var currentRow = j * rowSize;
					var nextRow = (j + 1) * rowSize;
					var lastX = x[currentRow];
					var lastY = y[currentRow];
					currentRow++;

					for (var i = 1; i <= width; i++) {
						lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
						lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
					}
				}

				setBoundary(1, x);
				setBoundary(2, y);
			}
		}
	}

	function advect(b, d, d0, u, v) {
		var wdt0 = width * dt,
			hdt0 = height * dt,
			wp5 = width + 0.5,
			hp5 = height + 0.5;

		for (var j = 1; j<= height; j++) {
			var pos = j * rowSize;
			for (var i = 1; i <= width; i++) {
				var x = i - wdt0 * u[++pos],
					y = j - hdt0 * v[pos];

				if (x < 0.5) x = 0.5;
				else if (x > wp5) x = wp5;

				var i0 = x | 0,
					i1 = i0 + 1;

				if (y < 0.5) y = 0.5;
				else if (y > hp5) y = hp5;

				var j0 = y | 0,
					j1 = j0 + 1,
					s1 = x - i0,
					s0 = 1 - s1,
					t1 = y - j0,
					t0 = 1 - t1,
					row1 = j0 * rowSize,
					row2 = j1 * rowSize;

				d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
			}
		}

		setBoundary(b, d);
	}

	function project(u, v, p, div) {
		var h = -0.5 / Math.sqrt(width * height);
		for (var j = 1 ; j <= height; j++) {
			var row = j * rowSize,
				prevRow = (j - 1) * rowSize,
				prevValue = row - 1,
				currentRow = row,
				nextValue = row + 1,
				nextRow = (j + 1) * rowSize;

			for (var i = 1; i <= width; i++) {
				div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++prevRow]);
				p[currentRow] = 0;
			}
		}

		setBoundary(0, div);
		setBoundary(0, p);
		solveLinear(0, p, div, 1, 4);

		var wScale = 0.5 * width,
			hScale = 0.5 * height;

		for (var j = 1; j<= height; j++) {
			var prevPos = j * rowSize - 1,
				currentPos = j * rowSize,
				nextPos = j * rowSize + 1,
				prevRow = (j - 1) * rowSize,
				currentRow = j * rowSize,
				nextRow = (j + 1) * rowSize;

			for (var i = 1; i<= width; i++) {
				u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
				v[currentPos] -= hScale * (p[++nextRow] - p[++prevRow]);
			}
		}

		setBoundary(1, u);
		setBoundary(2, v);
	}

	function densityStep(x, x0, u, v) {
		addFields(x, x0);
		diffuse(0, x0, x);
		advect(0, x, x0, u, v);
	}

	function velocityStep(u, v, u0, v0) {
		addFields(u, u0);
		addFields(v, v0);

		var temp = u0;
		u0 = u;
		u = temp;

		temp = v0;
		v0 = v;
		v = temp;

		diffuse2(u, u0, v, v0);
		project(u, v, u0, v0);

		temp = u0;
		u0 = u;
		u = temp;

		temp = v0;
		v0 = v;
		v = temp;

		advect(1, u, u0, u0, v0);
		advect(2, v, v0, u0, v0);
		project(u, v, u0, v0);
	}

	this.update = function() {
		for (var i = size; i--; ) {
			u_prev[i] = v_prev[i] = dens_prev[i] = 0;
			dens[i] *= damp;
		}

		updateFrame(new Field(dens_prev, u_prev, v_prev));
		velocityStep(u, v, u_prev, v_prev);
		densityStep(dens, dens_prev, u, v);
		drawFrame(new Field(dens, u, v));
	};

	this.reset = function() {
		rowSize = width + 2;
		size = (width + 2) * (height + 2);

		dens = new Array(size);
		dens_prev = new Array(size);

		u = new Array(size);
		u_prev = new Array(size);

		v = new Array(size);
		v_prev = new Array(size);

		for (var i = size; i--; ) {
			dens_prev[i] = u_prev[i] = v_prev[i] = dens[i] = u[i] = v[i] = 0;
		}
	};

	this.setResolution = function(w, h) {
		width = w;
		height = h;
		this.reset();
	};
}

var get = document.querySelector.bind(document),
	on = document.addEventListener.bind(document),
	canvas,
	context,
	scale,
	displayWidth,
	displayHeight,
	fieldSize = 4,
	fieldWidth,
	fieldHeight,
	omx = 0,
	omy = 0,
	mx = 0,
	my = 0,
	density = 200,
	drawing = false,
	buffer,
	bufferData,
	fluid;

function initBuffer() {

}

function updateFrame(field) {
	if (drawing) {
		var dx = mx - omx,
			dy = my - omy,
			length = (Math.sqrt(dx * dx + dy * dy) + 0.5) | 0;

		if (length < 1) length = 1;

		for (var i = length; i--; ) {
			var x = ((omx + dx * i / length) / displayWidth * fieldWidth) | 0,
				y = ((omy + dy * i / length) / displayHeight * fieldHeight) | 0;

			field.setVelocity(x, y, dx, dy);
			field.setDensity(x, y, density);
		}

		omx = mx;
		omy = my;
	}
}

function drawFrame(field) {
	for (var x = fieldWidth; x--; ) {
		for (var y = fieldHeight; y--; ) {
			bufferData[(y * fieldWidth + x) * 4 + Math.floor(Math.random() * 3)] = field.getDensity(x, y) * 0xff;
		}
	}

	context.putImageData(buffer, 0, 0);
}

function updateFluid() {
	updateID = requestAnimationFrame(updateFluid);
	fluid.update();
}

function getNormHeight() {
	return innerHeight / fieldHeight / fieldSize;
}

function getNormWidth() {
	return innerWidth / fieldWidth / fieldSize;
}

function setSize() {
	displayWidth = Math.round(innerWidth);
	displayHeight = Math.round(innerHeight);

	omx = displayWidth / 2;
	omy = displayHeight / 2;

	mx = omx + (Math.random() - 0.5) * 4;
	my = omy + (Math.random() - 0.5) * 4;

	fieldWidth = Math.round(displayWidth / fieldSize);
	fieldHeight = Math.round(displayHeight / fieldSize);

	canvas.width = fieldWidth;
	canvas.height = fieldHeight;
}

function init() {
	canvas = get('canvas');
	try {
		context = canvas.getContext('2d');
	} catch (e) {
		get('.alt').style.display = 'block';
		return;
	}

	setSize();

	var bufferCanvas = document.createElement('canvas');
	bufferCanvas.width = fieldWidth;
	bufferCanvas.height = fieldHeight;

	try {
		buffer = bufferCanvas.getContext('2d').createImageData(fieldWidth, fieldHeight);
		bufferData = buffer.data;
		var size = fieldWidth * fieldHeight * 4;
		for (var i = 3; i < size; i += 4) {
			bufferData[i] = 0xff;
		}
	} catch (e) {
		get('.alt').style.display = 'block';
		return;
	}

	canvas.style.display = 'block';

	canvas.ontouchstart = function(event) {
		drawing = true;
		omx = mx = event.changedTouches[0].clientX / getNormWidth();
		omy = my = event.changedTouches[0].clientY / getNormHeight();
		event.preventDefault();
	};

	canvas.ontouchmove = function(event) {
		mx = event.changedTouches[0].clientX / getNormWidth();
		my = event.changedTouches[0].clientY / getNormHeight();
	};

	canvas.ontouchend = function() {
		drawing = false;
	};

	canvas.onmousemove = function(event) {
		mx = event.clientX / getNormWidth();
		my = event.clientY / getNormHeight();
	};

	fluid = new FluidField();
	fluid.setResolution(canvas.width, canvas.height);

	drawing = true;
	updateFluid();
}

on('DOMContentLoaded', init);

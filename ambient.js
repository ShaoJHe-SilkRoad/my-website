(() => {
    'use strict';

    if (window.SHAOTING_AMBIENT) return;
    const canvas = document.getElementById('ambient-field');
    if (!canvas) return;

    let context;
    try { context = canvas.getContext('2d', { alpha: true }); } catch (_) { return; }
    if (!context) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 };
    const pulses = [];
    let width = 0;
    let height = 0;
    let viewportHeight = 0;
    let heroTop = 0;
    let heroBottom = 0;
    let observedHero = null;
    let observedAnchor = null;
    let layoutObserver = null;
    const backdrop = canvas.parentElement;
    const clientPointer = { x: 0, y: 0, known: false };
    let ratio = 1;
    let elapsed = 0;
    let frame = 0;
    let lastFrame = null;
    let lastPaint = null;
    let lastMotionPaint = null;
    let visible = true;
    let mobile = false;
    let geometry;
    let grid;
    let strands;
    let mainStrand;
    let styles;
    let gridPath;
    let gridDots = [];
    // Haze and calibration marks never move: they are painted once per layout into this cached bitmap.
    let staticLayer = null;
    let staticReady = false;
    let fade;
    const resultPoint = new Float64Array(2);
    const lookupSize = 4096;
    const atrialTable = new Float64Array(lookupSize + 1);
    const ventricularTable = new Float64Array(lookupSize + 1);
    const gaussianTable = new Float64Array(lookupSize + 1);
    let manuallyPaused = false;
    let light = root.dataset.theme === 'light';
    let vf = false;
    // Colours per palette; Code blue swaps the dark field for an alarm red.
    const tones = {
        dark: {
            field: ['rgba(214,236,228,0)', 'rgba(214,236,228,0.1)', 'rgba(214,236,228,0.3)', 'rgba(214,236,228,0.14)', 'rgba(214,236,228,0)'],
            trace: ['rgba(95,214,160,0)', 'rgba(95,214,160,0.55)', '#dbfbea', '#5fd6a0', 'rgba(95,214,160,0)'],
            haze: ['30,80,110', '40,150,110'], grid: '#4d7686', streak: '#e6fff2', pulse: '95,214,160', dot: '#effff6',
            pointer: '98,194,224', reticle: 'rgba(150,215,235,0.55)', mark: '#5fd6a0', ring: '#62c2e0'
        },
        light: {
            field: ['rgba(15,23,28,0)', 'rgba(15,23,28,0.08)', 'rgba(15,23,28,0.26)', 'rgba(15,23,28,0.12)', 'rgba(15,23,28,0)'],
            trace: ['rgba(29,127,86,0)', 'rgba(29,127,86,0.5)', '#14603f', '#1d7f56', 'rgba(29,127,86,0)'],
            haze: ['31,122,160', '29,127,86'], grid: '#7f9aa3', streak: '#1d7f56', pulse: '29,127,86', dot: '#14603f',
            pointer: '31,122,160', reticle: 'rgba(20,70,95,0.45)', mark: '#1d7f56', ring: '#1f7aa0'
        },
        vf: {
            field: ['rgba(255,40,70,0)', 'rgba(255,70,90,0.42)', 'rgba(255,176,168,0.94)', 'rgba(255,82,92,0.64)', 'rgba(240,40,60,0)'],
            trace: ['rgba(255,170,90,0)', 'rgba(255,178,103,0.55)', '#fff1dc', '#ffb267', 'rgba(255,150,80,0)'],
            haze: ['200,30,50', '255,120,60'], grid: '#d07a7a', streak: '#fff3e2', pulse: '255,178,103', dot: '#fff6ea',
            pointer: '255,90,90', reticle: 'rgba(255,170,160,0.67)', mark: '#ffb267', ring: '#ff8a80'
        }
    };
    const tone = () => tones[vf ? 'vf' : light ? 'light' : 'dark'];
    let rhythm = 'nsr';
    let rhythmBlend = 0;
    let transitionFrom = 0;
    let transitionStarted = 0;
    // Sinus rhythm runs at exactly 67 beats/min, so every R–R interval is identical.
    const rrInterval = 60000 / 67;
    // The R wave sits left of centre so the T wave stays on screen.
    const qrsPhase = 0.4123;
    let sinusOrigin = 0;
    let sinusFlare = 0;
    let atrialGain = 1;
    let beatGain = 1;
    let conduction = 1;
    const blockedBeats = [];
    let shockKick = 0;
    let shockAt = -Infinity;
    const ectopics = [];
    const presses = [];
    const touchStart = { x: 0, y: 0, at: 0, active: false };

    const isPaused = () => manuallyPaused || preference.matches;
    const canAnimate = () => !isPaused() && !document.hidden && visible;

    function syncPalette() {
        // Code blue has a dark canvas even when the saved page preference is light.
        const nextLight = root.dataset.theme === 'light' && rhythm !== 'vf';
        const nextVf = rhythm === 'vf';
        if (nextLight !== light || nextVf !== vf) {
            light = nextLight;
            vf = nextVf;
            styles = null;
        }
    }

    function glow(x, y, radius, color, opacity) {
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color},${opacity})`);
        gradient.addColorStop(0.42, `rgba(${color},${opacity * 0.34})`);
        gradient.addColorStop(1, `rgba(${color},0)`);
        context.fillStyle = gradient;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    // Lead II at 67 beats/min. The window spans one R–R interval (895.5 ms), so position maps to time.
    // Intervals: P ≈ 100 ms, PR ≈ 165 ms, QRS ≈ 90 ms, isoelectric ST, QT ≈ 385 ms (QTc ≈ 407 ms).
    // Stylised for display, never a patient measurement.
    function wave(t, centre, rise, fall, height) {
        return Math.exp(-Math.pow((t - centre) / (t < centre ? rise : fall), 2)) * height;
    }
    function atrial(position) {
        return wave(position * rrInterval, -160, 30, 28, 0.14);
    }
    function ventricular(position) {
        const t = position * rrInterval;
        return wave(t, -36, 10, 9, -0.12) + wave(t, 0, 11, 12, 1.08) + wave(t, 32, 11, 14, -0.3)
            + wave(t, 250, 68, 45, 0.26);
    }

    // Narrow QRS retains subpixel accuracy without recomputing Gaussians per vertex.
    for (let index = 0; index <= lookupSize; index += 1) {
        const position = index / lookupSize * 2 - 1;
        atrialTable[index] = atrial(position);
        ventricularTable[index] = ventricular(position);
        gaussianTable[index] = Math.exp(-index / lookupSize * 18);
    }

    function lookup(table, position) {
        const positionInTable = (position + 1) * (lookupSize / 2);
        if (positionInTable <= 0 || positionInTable >= lookupSize) return 0;
        const index = positionInTable | 0;
        return table[index] + (table[index + 1] - table[index]) * (positionInTable - index);
    }

    // Premature ventricular beat: no P wave, broad QRS (≈ 150 ms) and a discordant, inverted T wave.
    function ectopicShape(position) {
        const t = position * rrInterval;
        return wave(t, -45, 22, 20, -0.16) + wave(t, 0, 32, 34, 1.2) + wave(t, 62, 30, 36, -0.5)
            + wave(t, 300, 80, 60, -0.32);
    }
    const ectopicTable = new Float64Array(lookupSize + 1);
    for (let index = 0; index <= lookupSize; index += 1) ectopicTable[index] = ectopicShape(index / lookupSize * 2 - 1);

    function gaussian(square) {
        if (square >= 18) return 0;
        const positionInTable = square * (lookupSize / 18);
        const index = positionInTable | 0;
        return gaussianTable[index] + (gaussianTable[index + 1] - gaussianTable[index]) * (positionInTable - index);
    }

    function makeGrid(steps) {
        const values = { steps, u: new Float64Array(steps + 1), sine: new Float64Array(steps + 1) };
        for (const frequency of [8.5, 7, 13, 34.6, 45.2, 24.5]) {
            const sin = new Float64Array(steps + 1);
            const cos = new Float64Array(steps + 1);
            for (let index = 0; index <= steps; index += 1) {
                const angle = index / steps * frequency;
                sin[index] = Math.sin(angle);
                cos[index] = Math.cos(angle);
            }
            values[frequency] = { sin, cos };
        }
        for (let index = 0; index <= steps; index += 1) {
            values.u[index] = index / steps;
            values.sine[index] = Math.sin(index / steps * Math.PI);
        }
        return values;
    }

    function makeStrand(band) {
        const offset = band - 0.5;
        return {
            band, offset, center: 0.41 + offset * 0.23,
            fold: Math.sin(offset * Math.PI) * 0.15,
            amplitude: 0.85 + band * 0.26,
            opacity: 0.32 + Math.sin(band * Math.PI) * 0.56,
            phases: new Float64Array(12)
        };
    }

    function prepareStrand(strand, time, drift) {
        strand.currentCenter = strand.center + drift;
        strand.baseline = geometry.y + strand.offset * geometry.spread;
        strand.foldScale = strand.fold * geometry.spread;
        strand.amplitudeScale = strand.amplitude * geometry.amplitude;
        const phases = strand.phases;
        const wobble = time * 0.5 + strand.band * 2.1;
        phases[0] = Math.sin(wobble);
        phases[1] = Math.cos(wobble);
        if (rhythmBlend > 0) {
            const centre = strand.currentCenter, offset = strand.band * 0.35;
            const angles = [-centre * 7 + time * 1.3, -centre * 13 - time * 2.1,
                -centre * 34.6 + time * 38.7 + offset, -centre * 45.2 + time * 50.5 + 1.1 + offset, -centre * 24.5 + time * 27.4 - 0.8];
            for (let index = 0; index < angles.length; index += 1) {
                phases[index * 2 + 2] = Math.sin(angles[index]);
                phases[index * 2 + 3] = Math.cos(angles[index]);
            }
        }
    }

    function phaseSine(frequency, u, index, phases, offset) {
        if (index < 0) return Math.sin(u * frequency) * phases[offset + 1] + Math.cos(u * frequency) * phases[offset];
        const table = grid[frequency];
        return table.sin[index] * phases[offset + 1] + table.cos[index] * phases[offset];
    }

    function point(u, strand, time, index = -1) {
        let px = geometry.x + (u - 0.5) * geometry.span;
        const sine = index < 0 ? Math.sin(u * Math.PI) : grid.sine[index];
        let py = strand.baseline + sine * strand.foldScale;
        let shape = 0;
        if (rhythmBlend < 1) {
            const position = u - strand.currentCenter;
            shape = lookup(atrialTable, position) * atrialGain + lookup(ventricularTable, position) * beatGain * conduction;
            for (let index = 0; index < ectopics.length; index += 1) {
                const ectopic = ectopics[index];
                if (ectopic.level > 0.002) shape += lookup(ectopicTable, u - ectopic.u) * ectopic.level;
            }
            shape *= 1 - rhythmBlend;
        }
        const phases = strand.phases;
        if (rhythmBlend > 0) {
            const envelope = 0.34 + 0.12 * phaseSine(7, u, index, phases, 2)
                + 0.08 * phaseSine(13, u, index, phases, 4);
            shape += envelope * (phaseSine(34.6, u, index, phases, 6)
                + phaseSine(45.2, u, index, phases, 8) * 0.44
                + phaseSine(24.5, u, index, phases, 10) * 0.3) * rhythmBlend;
        }
        py -= shape * strand.amplitudeScale + shockKick * sine;
        py += phaseSine(8.5, u, index, phases, 0) * 3.5 * sine;
        if (pointer.strength > 0.005) {
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const distanceSquared = dx * dx + dy * dy;
            const weight = gaussian(distanceSquared * geometry.inverseReachSquared) * pointer.strength;
            if (weight > 0.00001) {
                const distance = Math.sqrt(distanceSquared);
                const inverseDistance = 1 / Math.max(distance, 24);
                py += dy * inverseDistance * weight * 56;
                px += dx * inverseDistance * weight * 15;
                py += Math.sin(distance * 0.042 - time * 5) * weight * 7;
            }
        }
        for (let index = 0; index < pulses.length; index += 1) {
            const pulse = pulses[index];
            const dx = px - pulse.x;
            const dy = py - pulse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const ringDistance = (distance - pulse.radius) / 34;
            const ring = gaussian(ringDistance * ringDistance);
            if (ring > 0.00001) py += Math.sin(distance * 0.07 - pulse.phase) * ring * pulse.amplitude;
        }
        resultPoint[0] = px;
        resultPoint[1] = py;
        return resultPoint;
    }

    function tracePath(strand, time) {
        context.beginPath();
        for (let index = 0; index <= grid.steps; index += 1) {
            point(grid.u[index], strand, time, index);
            if (index === 0) context.moveTo(resultPoint[0], resultPoint[1]);
            else context.lineTo(resultPoint[0], resultPoint[1]);
        }
    }

    function drawTrace(strand, time, color, weight, opacity) {
        tracePath(strand, time);
        context.strokeStyle = color;
        context.lineWidth = weight;
        context.globalAlpha = opacity;
        context.stroke();
    }

    // The lead trace is built once and stroked three times: a wide bloom, a halo, then the crisp line.
    function drawGlowTrace(strand, time, color, weight, opacity) {
        tracePath(strand, time);
        context.strokeStyle = color;
        context.lineWidth = weight * 6;
        context.globalAlpha = opacity * (light ? 0.07 : 0.13) * (1 + sinusFlare * 1.4);
        context.stroke();
        context.lineWidth = weight * 2.6;
        context.globalAlpha = opacity * (light ? 0.14 : 0.24) * (1 + sinusFlare * 0.8);
        context.stroke();
        context.lineWidth = weight;
        context.globalAlpha = opacity;
        context.stroke();
    }

    function refreshStyles() {
        const { x, y, span } = geometry;
        const blue = context.createLinearGradient(x - span * 0.5, y, x + span * 0.5, y);
        const { field, trace } = tone();
        [0, 0.17, 0.46, 0.7, 1].forEach((stop, index) => blue.addColorStop(stop, field[index]));
        const warm = context.createLinearGradient(x - span * 0.5, y, x + span * 0.5, y);
        [0, 0.16, 0.36, 0.66, 1].forEach((stop, index) => warm.addColorStop(stop, trace[index]));
        styles = { blue, warm };
        gridDots = [];
        gridPath = typeof Path2D === 'function' ? new Path2D() : null;
        const left = mobile ? 20 : Math.max(width * 0.49, x - span * 0.46);
        const top = Math.max(120, y - geometry.amplitude - geometry.spread * 0.53);
        const spacing = mobile ? 44 : 38;
        for (let gx = left; gx < width; gx += spacing) {
            for (let gy = top; gy < Math.min(height - 60, y + geometry.spread * 0.68); gy += spacing) {
                if (gridPath) gridPath.rect(gx, gy, 1, 1);
                else gridDots.push(gx, gy);
            }
        }
        // The lower edge fades out inside the canvas; a CSS mask would be re-applied to the live layer every frame.
        fade = context.createLinearGradient(0, height * 0.78, 0, height);
        fade.addColorStop(0, 'rgba(0,0,0,0)');
        fade.addColorStop(1, '#000');
        paintStaticLayer();
    }

    function paintStatic() {
        const palette = tone();
        const presence = mobile ? 0.88 : 1;
        const { x, y, span } = geometry;
        context.globalCompositeOperation = light ? 'source-over' : 'screen';
        context.globalAlpha = presence;
        glow(x, y - 45, span * 0.65, palette.haze[0], light ? 0.07 : 0.19);
        glow(x + span * 0.13, y - 115, span * 0.37, palette.haze[1], light ? 0.045 : 0.075);
        // Quiet calibration marks give the field an instrument-like structure.
        context.fillStyle = palette.grid;
        context.globalAlpha = (light ? 0.1 : 0.11) * presence;
        if (gridPath) context.fill(gridPath);
        else for (let index = 0; index < gridDots.length; index += 2) context.fillRect(gridDots[index], gridDots[index + 1], 1, 1);
    }

    function paintStaticLayer() {
        if (!staticLayer) {
            try { staticLayer = document.createElement('canvas'); } catch (_) { staticLayer = false; }
        }
        const layerContext = staticLayer && staticLayer.getContext && staticLayer.getContext('2d');
        staticReady = !!layerContext;
        if (!staticReady) return;
        if (staticLayer.width !== canvas.width) staticLayer.width = canvas.width;
        if (staticLayer.height !== canvas.height) staticLayer.height = canvas.height;
        const drawing = context;
        context = layerContext;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        paintStatic();
        context = drawing;
    }

    const scrollLeft = () => window.scrollX || 0;
    const scrollTop = () => window.scrollY || 0;

    function updateVisibility() {
        const top = scrollTop();
        visible = heroBottom > top && heroTop < top + viewportHeight;
    }

    function trackLayout(hero, anchor) {
        if (!layoutObserver || (hero === observedHero && anchor === observedAnchor)) return;
        layoutObserver.disconnect();
        observedHero = hero;
        observedAnchor = anchor;
        if (hero) layoutObserver.observe(hero);
        if (anchor && anchor !== hero) layoutObserver.observe(anchor);
    }

    // Layout coordinates belong to the document. Scrolling only moves the existing canvas.
    function measureLayout() {
        const nextWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        const nextMobile = nextWidth < 760;
        const nextRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        const top = scrollTop();
        const hero = document.querySelector('.hero');
        const heroBounds = hero && hero.getBoundingClientRect();
        heroTop = heroBounds ? heroBounds.top + top : 0;
        heroBottom = heroBounds ? heroBounds.bottom + top : viewportHeight;
        const nextHeight = Math.max(1, Math.ceil(heroBottom));
        const anchor = nextMobile ? document.querySelector('.signal-slot') : null;
        const bounds = anchor && anchor.getBoundingClientRect();
        const nextY = nextMobile
            ? bounds && bounds.height > 0 ? bounds.top + top + bounds.height * 0.61 : Math.min(viewportHeight * 0.79, 650)
            : Math.min(viewportHeight * 0.53, 470);
        // The whole R–R window stays on screen, so the sweep and every beat remain visible.
        const span = nextMobile ? Math.min(nextWidth, 900) : Math.min(nextWidth * 0.5, 820);
        const spread = nextMobile ? 96 : Math.min(viewportHeight * 0.42, 340);
        const amplitude = nextMobile ? 65 : Math.min(viewportHeight * 0.25, 192);
        const changed = !geometry || width !== nextWidth || height !== nextHeight || ratio !== nextRatio
            || geometry.y !== nextY || geometry.spread !== spread || geometry.amplitude !== amplitude;
        const rebuildGrid = !grid || mobile !== nextMobile;
        width = nextWidth;
        height = nextHeight;
        mobile = nextMobile;
        ratio = nextRatio;
        const pixelWidth = Math.round(width * ratio);
        const pixelHeight = Math.round(height * ratio);
        // Mobile browser chrome often changes only viewport height. Keep the bitmap when its document size is unchanged.
        if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
        if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
        if (canvas.style.width !== `${width}px`) canvas.style.width = `${width}px`;
        if (canvas.style.height !== `${height}px`) canvas.style.height = `${height}px`;
        if (backdrop && backdrop.style && backdrop.style.height !== `${height}px`) backdrop.style.height = `${height}px`;
        geometry = {
            x: mobile ? width * 0.5 : width - span / 2 - Math.max(32, width * 0.03), y: nextY, span, spread, amplitude,
            inverseReachSquared: 1 / Math.pow(Math.max(145, span * 0.25), 2)
        };
        if (rebuildGrid) {
            grid = makeGrid(mobile ? 144 : 224);
            const count = mobile ? 16 : 39;
            strands = Array.from({ length: count }, (_, index) => makeStrand(index / (count - 1)));
            mainStrand = makeStrand(0.51);
        }
        if (changed) styles = null;
        trackLayout(hero, anchor);
        updateVisibility();
        if (!styles) refreshStyles();
        return changed;
    }

    function draw() {
        if (!width || !height || document.hidden || !visible) return;
        const { x, y, span } = geometry;
        const presence = mobile ? 0.88 : 1;
        const time = elapsed * 0.001;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        const drift = Math.sin(time * 0.21) * 0.009;
        for (const strand of strands) prepareStrand(strand, time, drift);
        prepareStrand(mainStrand, time, drift);
        const sinceShock = elapsed - shockAt;
        const cycle = (elapsed - sinusOrigin) / rrInterval;
        const phase = cycle - Math.floor(cycle);
        const beatIndex = Math.floor(cycle);
        const recovering = sinceShock < 1500;
        // Full compensatory pause: a PVC leaves the ventricles refractory, so the next sinus QRS is not conducted.
        const target = blockedBeats.includes(beatIndex) ? 0 : 1;
        conduction += (target - conduction) * (target ? 0.2 : 0.45);
        sinusFlare = recovering || !target ? 0 : Math.exp(-Math.pow((phase - qrsPhase) * rrInterval / 55, 2));
        // Defibrillation: a large artifact decaying to baseline, a post-shock pause with no activity, then sinus.
        atrialGain = recovering ? 0 : 1;
        beatGain = recovering ? 0 : 1 + sinusFlare * 0.18;
        shockKick = sinceShock < 30 ? sinceShock / 30 * geometry.amplitude * 0.9
            : sinceShock < 700 ? Math.exp(-(sinceShock - 30) / 110) * geometry.amplitude * 0.9 : 0;
        while (blockedBeats.length && blockedBeats[0] < beatIndex) blockedBeats.shift();
        for (const ectopic of ectopics) {
            const age = elapsed - ectopic.born;
            // A premature complex persists for about one sweep, like phosphor on a monitor.
            ectopic.level = age < 0 ? 0 : Math.min(1, age / 40) * Math.exp(-age / 650);
        }
        for (const pulse of pulses) {
            const age = (elapsed - pulse.born) / 1500;
            pulse.radius = age * 550;
            pulse.phase = age * 17;
            pulse.amplitude = (1 - age) * 32;
        }
        if (staticReady) {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.drawImage(staticLayer, 0, 0);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        } else paintStatic();
        context.globalCompositeOperation = light ? 'source-over' : 'screen';
        context.globalAlpha = presence;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        const palette = tone();
        for (let index = 0; index < strands.length; index += 1) {
            const strand = strands[index];
            // Centre strands sit closer to the viewer: slightly heavier and brighter than the edges.
            drawTrace(strand, time, styles.blue, index % 6 === 0 ? 0.95 : 0.42 + strand.opacity * 0.3, presence * strand.opacity * 0.92);
        }
        drawGlowTrace(mainStrand, time, styles.warm, mobile ? 2 : 1.7, presence * 0.98);

        // The small traveling highlight reads as a pulse moving through the signal.
        const sweepClock = elapsed * 0.5;
        const sweepCycles = rhythm === 'vf'
            ? sweepClock / 250 + 0.12 * Math.sin(sweepClock * 0.010) + 0.045 * Math.sin(sweepClock * 0.027)
            : (elapsed - sinusOrigin) / rrInterval;
        const progress = rhythm === 'vf' ? 0.1 + ((sweepCycles + 0.5) % 1) * 0.8 : sweepCycles - Math.floor(sweepCycles);
        const edge = Math.min(1, progress / 0.06, (1 - progress) / 0.06);
        // A comet tail fades behind the pulse; each layer is shorter, finer and brighter.
        context.strokeStyle = palette.streak;
        for (const [length, weight, alpha] of [[0.08, 4.2, 0.08], [0.04, 2.8, 0.2], [0.014, 2, 0.55]]) {
            context.beginPath();
            for (let index = 0; index <= 10; index += 1) {
                const u = Math.max(0.01, progress - length + index / 10 * length);
                point(u, mainStrand, time);
                if (index === 0) context.moveTo(resultPoint[0], resultPoint[1]);
                else context.lineTo(resultPoint[0], resultPoint[1]);
            }
            context.lineWidth = weight;
            context.globalAlpha = presence * alpha * edge;
            context.stroke();
        }
        const [pulseX, pulseY] = point(progress, mainStrand, time);
        context.globalAlpha = presence * edge;
        glow(pulseX, pulseY, mobile ? 13 : 21, palette.pulse, light ? 0.15 : 0.30);
        context.fillStyle = palette.dot;
        context.beginPath();
        context.arc(pulseX, pulseY, mobile ? 1.8 : 2.5, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = palette.dot;
        context.lineWidth = 0.8;
        context.globalAlpha = presence * edge * (light ? 0.4 : 0.32);
        context.beginPath();
        context.arc(pulseX, pulseY, mobile ? 6 : 8, 0, Math.PI * 2);
        context.stroke();

        if (!mobile && pointer.strength > 0.015) {
            const alpha = pointer.strength;
            context.globalAlpha = alpha;
            glow(pointer.x, pointer.y, 150, palette.pointer, light ? 0.055 : 0.12);
            context.strokeStyle = palette.reticle;
            context.lineWidth = 0.8;
            context.beginPath();
            context.arc(pointer.x, pointer.y, 16, 0, Math.PI * 2);
            context.moveTo(pointer.x - 25, pointer.y);
            context.lineTo(pointer.x - 20, pointer.y);
            context.moveTo(pointer.x + 20, pointer.y);
            context.lineTo(pointer.x + 25, pointer.y);
            context.moveTo(pointer.x, pointer.y - 25);
            context.lineTo(pointer.x, pointer.y - 20);
            context.moveTo(pointer.x, pointer.y + 20);
            context.lineTo(pointer.x, pointer.y + 25);
            context.stroke();
            context.fillStyle = palette.mark;
            context.fillRect(pointer.x - 1.5, pointer.y - 1.5, 3, 3);
        }

        for (const pulse of pulses) {
            const age = (elapsed - pulse.born) / 1500;
            context.globalAlpha = Math.max(0, 1 - age) * 0.6;
            context.strokeStyle = palette.ring;
            context.lineWidth = 1;
            context.beginPath();
            context.arc(pulse.x, pulse.y, age * 550, 0, Math.PI * 2);
            context.stroke();
        }
        context.globalAlpha = 1;
        context.globalCompositeOperation = 'destination-out'; // destination-in would erase everything outside this rectangle
        context.fillStyle = fade;
        context.fillRect(0, height * 0.78, width, height * 0.22);
        context.globalCompositeOperation = 'source-over';
    }

    function tick(timestamp) {
        frame = 0;
        if (!canAnimate()) return;
        const delta = lastFrame === null ? 0 : Math.max(0, timestamp - lastFrame);
        lastFrame = timestamp;
        elapsed += delta;
        const interval = 1000 / 60;
        if (lastPaint === null || timestamp - lastPaint >= interval - 0.1) {
            const paintDelta = lastMotionPaint === null ? interval : timestamp - lastMotionPaint;
            lastMotionPaint = timestamp;
            // Apply the same tolerance when advancing the clock so high-refresh displays do not double-paint.
            lastPaint = lastPaint === null ? timestamp
                : lastPaint + Math.max(1, Math.floor((timestamp - lastPaint + 0.1) / interval)) * interval;
            const progress = Math.min(1, (elapsed - transitionStarted) / 400);
            const eased = progress * progress * (3 - 2 * progress);
            rhythmBlend = transitionFrom + ((rhythm === 'vf' ? 1 : 0) - transitionFrom) * eased;
            const follow = 1 - Math.pow(0.76, paintDelta / (1000 / 30));
            const engage = 1 - Math.pow(0.88, paintDelta / (1000 / 30));
            pointer.x += (pointer.tx - pointer.x) * follow;
            pointer.y += (pointer.ty - pointer.y) * follow;
            pointer.strength += (pointer.target - pointer.strength) * engage;
            while (pulses.length && elapsed - pulses[0].born > 1500) pulses.shift();
            while (ectopics.length && elapsed - ectopics[0].born > 2600) ectopics.shift();
            draw();
        }
        frame = window.requestAnimationFrame(tick);
    }

    function reconcile() {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = null;
        lastPaint = null;
        lastMotionPaint = null;
        updateVisibility();
        if (!styles) refreshStyles();
        if (isPaused()) {
            pointer.target = 0;
            pointer.strength = 0;
            pulses.length = 0;
            rhythmBlend = rhythm === 'vf' ? 1 : 0;
            transitionFrom = rhythmBlend;
            transitionStarted = elapsed;
        }
        draw();
        if (canAnimate()) frame = window.requestAnimationFrame(tick);
    }

    function resize() {
        const wasVisible = visible;
        const changed = measureLayout();
        if (changed || wasVisible !== visible) reconcile();
    }

    function inGraphic(x, y) {
        return !mobile && visible && x > width * 0.46 && y > Math.max(heroTop, 85) && y < heroBottom;
    }

    function updatePointerTarget() {
        if (!clientPointer.known) return;
        pointer.tx = clientPointer.x + scrollLeft();
        pointer.ty = clientPointer.y + scrollTop();
        pointer.target = inGraphic(pointer.tx, pointer.ty) ? 1 : 0;
    }

    window.SHAOTING_AMBIENT = Object.freeze({
        setPaused(value) {
            manuallyPaused = Boolean(value);
            reconcile();
        },
        isPaused,
        setRhythm(value) {
            if (value !== 'nsr' && value !== 'vf') return;
            if (value === rhythm) return;
            rhythm = value;
            syncPalette();
            if (!styles) refreshStyles();
            transitionFrom = rhythmBlend;
            transitionStarted = elapsed;
            if (!canAnimate()) {
                rhythmBlend = rhythm === 'vf' ? 1 : 0;
                transitionFrom = rhythmBlend;
                draw();
            }
        },
        getRhythm() { return rhythm; },
        shock() {
            shockAt = elapsed;
            // Sinus node recovers after a 1.5 s post-shock pause; the first QRS follows its P wave.
            sinusOrigin = elapsed + 1700 - qrsPhase * rrInterval;
            ectopics.length = 0;
            blockedBeats.length = 0;
            presses.length = 0;
            rhythm = 'nsr';
            syncPalette();
            if (!styles) refreshStyles();
            rhythmBlend = 0;
            transitionFrom = 0;
            transitionStarted = elapsed;
            if (!canAnimate()) draw();
        }
    });

    // Each press adds a premature beat; the sinus schedule never resets, so R–R stays constant.
    // Five presses within one second is an R-on-T storm: the field degenerates into VF.
    function press(x, y) {
        if (pulses.length >= 3) pulses.shift();
        pulses.push({ x, y, born: elapsed });
        if (rhythm === 'vf') return;
        if (ectopics.length >= 5) ectopics.shift();
        // The ectopic depolarises now, so it is drawn where the sweep cursor is, not where the pointer is.
        const cycle = (elapsed - sinusOrigin) / rrInterval;
        const u = Math.min(0.9, Math.max(0.1, cycle - Math.floor(cycle) + mainStrand.currentCenter - qrsPhase));
        ectopics.push({ u, born: elapsed, level: 0 });
        // Block the next sinus QRS if it would fall inside this beat's refractory period (≈ 450 ms).
        const next = Math.ceil(cycle - qrsPhase);
        if (sinusOrigin + (next + qrsPhase) * rrInterval - elapsed < 450 && !blockedBeats.includes(next)) blockedBeats.push(next);
        const now = Date.now();
        presses.push(now);
        if (presses.length > 5) presses.shift();
        if (presses.length === 5 && now - presses[0] <= 1000) {
            presses.length = 0;
            if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
                window.dispatchEvent(new CustomEvent('signal:fibrillate'));
            }
        }
    }

    function onControl(target) {
        return target && typeof target.closest === 'function'
            && target.closest('a, button, input, textarea, select, summary, label, [role="button"], [contenteditable="true"]');
    }

    function inTouchGraphic(y) {
        return mobile && visible && Math.abs(y - geometry.y) < 150;
    }

    window.addEventListener('pointermove', (event) => {
        if (!canAnimate() || event.pointerType === 'touch') return;
        clientPointer.x = event.clientX;
        clientPointer.y = event.clientY;
        clientPointer.known = true;
        updatePointerTarget();
        if (pointer.strength < 0.01) {
            pointer.x = pointer.tx;
            pointer.y = pointer.ty;
        }
    }, { passive: true });
    window.addEventListener('pointerdown', (event) => {
        if (!canAnimate() || event.button !== 0 || event.defaultPrevented || onControl(event.target)) return;
        const x = event.clientX + scrollLeft();
        const y = event.clientY + scrollTop();
        // Touches count only as taps (see pointerup), so scrolling never adds beats.
        if (event.pointerType === 'touch') {
            touchStart.x = event.clientX;
            touchStart.y = event.clientY;
            touchStart.at = Date.now();
            touchStart.active = inTouchGraphic(y);
            return;
        }
        if (inGraphic(x, y)) press(x, y);
    }, { passive: true });
    window.addEventListener('pointerup', (event) => {
        if (event.pointerType !== 'touch' || !touchStart.active) return;
        touchStart.active = false;
        if (!canAnimate() || Date.now() - touchStart.at > 350) return;
        if (Math.abs(event.clientX - touchStart.x) > 10 || Math.abs(event.clientY - touchStart.y) > 10) return;
        press(event.clientX + scrollLeft(), event.clientY + scrollTop());
    }, { passive: true });
    window.addEventListener('pointercancel', () => { touchStart.active = false; }, { passive: true });
    document.addEventListener('pointerleave', () => { pointer.target = 0; clientPointer.known = false; });
    window.addEventListener('blur', () => { pointer.target = 0; clientPointer.known = false; });
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', () => {
        const wasVisible = visible;
        updateVisibility();
        updatePointerTarget();
        if (wasVisible !== visible) reconcile();
    }, { passive: true });
    document.addEventListener('visibilitychange', reconcile);
    window.addEventListener('pagehide', () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
    });
    window.addEventListener('pageshow', () => { measureLayout(); reconcile(); });
    window.addEventListener('load', resize, { once: true });
    if (preference.addEventListener) preference.addEventListener('change', reconcile);
    else if (preference.addListener) preference.addListener(reconcile);

    new MutationObserver(() => {
        syncPalette();
        measureLayout();
        reconcile();
    }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'lang'] });

    if (typeof ResizeObserver === 'function') layoutObserver = new ResizeObserver(resize);
    resize();
})();

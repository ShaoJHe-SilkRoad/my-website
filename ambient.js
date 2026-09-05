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
    const resultPoint = new Float64Array(2);
    const lookupSize = 4096;
    const signalTable = new Float64Array(lookupSize + 1);
    const gaussianTable = new Float64Array(lookupSize + 1);
    let manuallyPaused = false;
    let light = root.dataset.theme === 'light';
    let rhythm = 'nsr';
    let rhythmBlend = 0;
    let transitionFrom = 0;
    let transitionStarted = 0;

    const isPaused = () => manuallyPaused || preference.matches;
    const canAnimate = () => !isPaused() && !document.hidden && visible;

    function syncPalette() {
        // Code blue has a dark canvas even when the saved page preference is light.
        const nextLight = root.dataset.theme === 'light' && rhythm !== 'vf';
        if (nextLight !== light) {
            light = nextLight;
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

    // An intentionally stylized P–QRS–T silhouette, never a patient measurement.
    function signal(position) {
        const p = Math.exp(-Math.pow((position + 0.16) / 0.041, 2)) * 0.14;
        const q = -Math.exp(-Math.pow((position + 0.040) / 0.014, 2)) * 0.15;
        const r = Math.exp(-Math.pow(position / 0.017, 2)) * 1.08;
        const s = -Math.exp(-Math.pow((position - 0.039) / 0.018, 2)) * 0.33;
        const t = Math.exp(-Math.pow((position - 0.16) / 0.058, 2)) * 0.23;
        return p + q + r + s + t;
    }

    // The narrow QRS retains subpixel accuracy without recomputing five Gaussians per vertex.
    for (let index = 0; index <= lookupSize; index += 1) {
        signalTable[index] = signal(index / lookupSize * 2 - 1);
        gaussianTable[index] = Math.exp(-index / lookupSize * 18);
    }

    function organizedSignal(position) {
        const positionInTable = (position + 1) * (lookupSize / 2);
        if (positionInTable <= 0 || positionInTable >= lookupSize) return 0;
        const index = positionInTable | 0;
        const fraction = positionInTable - index;
        return signalTable[index] + (signalTable[index + 1] - signalTable[index]) * fraction;
    }

    function gaussian(square) {
        if (square >= 18) return 0;
        const positionInTable = square * (lookupSize / 18);
        const index = positionInTable | 0;
        return gaussianTable[index] + (gaussianTable[index + 1] - gaussianTable[index]) * (positionInTable - index);
    }

    function makeGrid(steps) {
        const values = { steps, u: new Float64Array(steps + 1), sine: new Float64Array(steps + 1) };
        for (const frequency of [8.5, 19, 37, 83, 143.59, 50.63]) {
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
            band, offset, center: 0.51 + offset * 0.23,
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
            const phase = -strand.currentCenter * 83 + time * 2.7 + strand.band * 0.35;
            const angles = [-strand.currentCenter * 19 + time * 0.6,
                -strand.currentCenter * 37 - time * 0.9, phase, phase * 1.73 + 1.1, phase * 0.61 - 0.8];
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
        let shape = rhythmBlend < 1 ? organizedSignal(u - strand.currentCenter) * (1 - rhythmBlend) : 0;
        const phases = strand.phases;
        if (rhythmBlend > 0) {
            const envelope = 0.4 + 0.14 * phaseSine(19, u, index, phases, 2)
                + 0.1 * phaseSine(37, u, index, phases, 4);
            shape += envelope * (phaseSine(83, u, index, phases, 6)
                + phaseSine(143.59, u, index, phases, 8) * 0.44
                + phaseSine(50.63, u, index, phases, 10) * 0.3) * rhythmBlend;
        }
        py -= shape * strand.amplitudeScale;
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

    function drawTrace(strand, time, color, weight, opacity) {
        context.beginPath();
        for (let index = 0; index <= grid.steps; index += 1) {
            point(grid.u[index], strand, time, index);
            if (index === 0) context.moveTo(resultPoint[0], resultPoint[1]);
            else context.lineTo(resultPoint[0], resultPoint[1]);
        }
        context.strokeStyle = color;
        context.lineWidth = weight;
        context.globalAlpha = opacity;
        context.stroke();
    }

    function refreshStyles() {
        const { x, y, span } = geometry;
        const blue = context.createLinearGradient(x - span * 0.5, y, x + span * 0.5, y);
        blue.addColorStop(0, light ? 'rgba(17,93,179,0)' : 'rgba(28,111,233,0)');
        blue.addColorStop(0.17, light ? 'rgba(15,99,178,0.32)' : 'rgba(46,147,255,0.42)');
        blue.addColorStop(0.46, light ? 'rgba(0,103,163,0.65)' : 'rgba(91,209,255,0.94)');
        blue.addColorStop(0.7, light ? 'rgba(16,115,178,0.53)' : 'rgba(53,153,255,0.64)');
        blue.addColorStop(1, light ? 'rgba(20,86,151,0)' : 'rgba(42,125,239,0)');
        const warm = context.createLinearGradient(x - span * 0.5, y, x + span * 0.5, y);
        warm.addColorStop(0, 'rgba(255,167,47,0)');
        warm.addColorStop(0.27, light ? 'rgba(172,105,0,0.49)' : 'rgba(255,190,79,0.53)');
        warm.addColorStop(0.48, light ? '#aa6600' : '#ffec99');
        warm.addColorStop(0.61, light ? '#ca7900' : '#ffc361');
        warm.addColorStop(1, 'rgba(255,155,41,0)');
        styles = { blue, warm };
        gridDots = [];
        gridPath = typeof Path2D === 'function' ? new Path2D() : null;
        const left = mobile ? 20 : Math.max(width * 0.49, x - span * 0.46);
        const top = Math.max(120, y - geometry.amplitude - geometry.spread * 0.53);
        const spacing = mobile ? 42 : 34;
        for (let gx = left; gx < width; gx += spacing) {
            for (let gy = top; gy < Math.min(height - 60, y + geometry.spread * 0.68); gy += spacing) {
                if (gridPath) gridPath.rect(gx, gy, 1, 1);
                else gridDots.push(gx, gy);
            }
        }
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
        const anchor = nextMobile ? document.querySelector('.signal-annotation') : null;
        const bounds = anchor && anchor.getBoundingClientRect();
        const nextY = nextMobile
            ? bounds && bounds.height > 0 ? bounds.top + top + bounds.height * 0.61 : Math.min(viewportHeight * 0.79, 650)
            : Math.min(viewportHeight * 0.53, 470);
        const span = nextMobile ? Math.min(nextWidth * 1.3, 900) : Math.min(nextWidth * 0.66, 1060);
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
            x: width * (mobile ? 0.58 : 0.805), y: nextY, span, spread, amplitude,
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
        for (const pulse of pulses) {
            const age = (elapsed - pulse.born) / 1500;
            pulse.radius = age * 550;
            pulse.phase = age * 17;
            pulse.amplitude = (1 - age) * 32;
        }
        context.globalCompositeOperation = light ? 'source-over' : 'screen';
        context.globalAlpha = presence;

        glow(x, y - 45, span * 0.65, '15,87,221', light ? 0.07 : 0.19);
        glow(x + span * 0.13, y - 115, span * 0.37, '0,162,237', light ? 0.045 : 0.075);

        // Quiet calibration marks give the field an instrument-like structure.
        context.fillStyle = light ? '#487ba0' : '#5498c3';
        context.globalAlpha = (light ? 0.12 : 0.16) * presence;
        if (gridPath) context.fill(gridPath);
        else for (let index = 0; index < gridDots.length; index += 2) context.fillRect(gridDots[index], gridDots[index + 1], 1, 1);
        for (let index = 0; index < strands.length; index += 1) {
            const strand = strands[index];
            drawTrace(strand, time, styles.blue, index % 6 === 0 ? 1.05 : 0.65, presence * strand.opacity);
        }
        drawTrace(mainStrand, time, styles.warm, mobile ? 2.25 : 1.95, presence * 0.98);

        // The small traveling highlight reads as a pulse moving through the signal.
        const sweepClock = elapsed * 0.5;
        const sweepCycles = rhythm === 'vf'
            ? sweepClock / 250 + 0.12 * Math.sin(sweepClock * 0.010) + 0.045 * Math.sin(sweepClock * 0.027)
            : sweepClock / (60000 / 90);
        const progress = 0.1 + ((sweepCycles + 0.5) % 1) * 0.8;
        context.beginPath();
        for (let index = 0; index <= 8; index += 1) {
            const u = Math.max(0.1, progress - 0.018 + index / 8 * 0.018);
            point(u, mainStrand, time);
            if (index === 0) context.moveTo(resultPoint[0], resultPoint[1]);
            else context.lineTo(resultPoint[0], resultPoint[1]);
        }
        context.strokeStyle = light ? '#b8780a' : '#fff0b0';
        context.lineWidth = mobile ? 2.4 : 2.3;
        context.globalAlpha = presence * 0.4;
        context.stroke();
        const [pulseX, pulseY] = point(progress, mainStrand, time);
        context.globalAlpha = presence;
        glow(pulseX, pulseY, mobile ? 13 : 21, '255,200,89', light ? 0.15 : 0.30);
        context.fillStyle = light ? '#a46800' : '#fff2c4';
        context.beginPath();
        context.arc(pulseX, pulseY, mobile ? 1.8 : 2.5, 0, Math.PI * 2);
        context.fill();

        if (!mobile && pointer.strength > 0.015) {
            const alpha = pointer.strength;
            context.globalAlpha = alpha;
            glow(pointer.x, pointer.y, 150, '28,142,255', light ? 0.055 : 0.12);
            context.strokeStyle = light ? 'rgba(13,114,167,0.55)' : 'rgba(132,213,255,0.67)';
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
            context.fillStyle = light ? '#bb7100' : '#ffce62';
            context.fillRect(pointer.x - 1.5, pointer.y - 1.5, 3, 3);
        }

        for (const pulse of pulses) {
            const age = (elapsed - pulse.born) / 1500;
            context.globalAlpha = Math.max(0, 1 - age) * 0.6;
            context.strokeStyle = light ? '#1b87b4' : '#62caff';
            context.lineWidth = 1;
            context.beginPath();
            context.arc(pulse.x, pulse.y, age * 550, 0, Math.PI * 2);
            context.stroke();
        }
        context.globalAlpha = 1;
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
        getRhythm() { return rhythm; }
    });

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
        if (!canAnimate() || event.pointerType === 'touch' || event.button !== 0 || event.defaultPrevented) return;
        const x = event.clientX + scrollLeft();
        const y = event.clientY + scrollTop();
        if (!inGraphic(x, y)) return;
        const target = event.target;
        if (target && typeof target.closest === 'function' && target.closest('a, button, input, textarea, select, summary, label, [role="button"], [contenteditable="true"]')) return;
        if (pulses.length >= 3) pulses.shift();
        pulses.push({ x, y, born: elapsed });
    }, { passive: true });
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

"use client";

import React, { useEffect, useRef, FC } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

interface VoicePoweredOrbProps {
  className?: string;
  hue?: number;
  enableVoiceControl?: boolean;
  voiceSensitivity?: number;
  maxRotationSpeed?: number;
  maxHoverIntensity?: number;
  onVoiceDetected?: (detected: boolean) => void;
}

export const VoicePoweredOrb: FC<VoicePoweredOrbProps> = ({
  className,
  hue = 150,
  enableVoiceControl = false, // CRITICAL FIX: DO NOT AUTO-INITIALIZE MIC ON PAGE LOAD
  voiceSensitivity = 1.5,
  maxRotationSpeed = 1.2,
  maxHoverIntensity = 0.8,
  onVoiceDetected,
}) => {
  const ctnDom = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }

    vec3 yiq2rgb(vec3 c) {
      float r = dot(c, vec3(1.0, 0.956, 0.621));
      float g = dot(c, vec3(1.0, -0.272, -0.647));
      float b = dot(c, vec3(1.0, -1.106, 1.703));
      return vec3(r, g, b);
    }

    vec3 adjustHue(vec3 color, float deg) {
      float rad = radians(deg);
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(rad);
      float sinA = sin(rad);
      yiq.y = yiq.y * cosA - yiq.z * sinA;
      yiq.z = yiq.y * sinA + yiq.z * cosA;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    const vec3 baseColor1 = vec3(0.08, 0.24, 0.20);
    const vec3 baseColor2 = vec3(0.12, 0.45, 0.35);
    const vec3 baseColor3 = vec3(0.75, 0.88, 0.80);

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
      float dist = length(uv);
      
      float angle = atan(uv.y, uv.x) + rot + iTime * 0.4;
      vec3 pos = vec3(cos(angle) * dist, sin(angle) * dist, iTime * 0.2);
      
      float n = snoise3(pos * 2.0);
      float radius = 0.35 + 0.06 * n + hover * 0.08;
      
      float edge = smoothstep(radius, radius - 0.03, dist);
      float glow = exp(-dist * 3.5) * 0.8;
      
      vec3 col = mix(baseColor1, baseColor2, dist * 2.0 + n * 0.5);
      col = mix(col, baseColor3, edge * 0.6);
      col += glow * baseColor2;
      
      float alpha = clamp(edge + glow * 0.6, 0.0, 1.0);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  // Voice analysis
  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return 0;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const value = dataArrayRef.current[i] / 255;
      sum += value * value;
    }
    const rms = Math.sqrt(sum / dataArrayRef.current.length);
    return Math.min(rms * voiceSensitivity * 3.0, 1);
  };

  const stopMicrophone = () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
        microphoneRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      dataArrayRef.current = null;
    } catch (e) {}
  };

  const initMicrophone = async () => {
    try {
      stopMicrophone();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      mediaStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    let rendererInstance: Renderer | null = null;
    let glContext: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let rafId: number;
    let program: Program | null = null;

    try {
      rendererInstance = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
      glContext = rendererInstance.gl;
      glContext.clearColor(0, 0, 0, 0);
      glContext.enable(glContext.BLEND);
      glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(glContext.canvas);

      const geometry = new Triangle(glContext);
      program = new Program(glContext, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Vec3(
              glContext.canvas.width,
              glContext.canvas.height,
              glContext.canvas.width / glContext.canvas.height
            )
          },
          hue: { value: hue },
          hover: { value: 0 },
          rot: { value: 0 },
          hoverIntensity: { value: 0 }
        }
      });

      const mesh = new Mesh(glContext, { geometry, program });

      const resize = () => {
        if (!container || !rendererInstance || !glContext) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = container.clientWidth || 140;
        const height = container.clientHeight || 120;
        rendererInstance.setSize(width * dpr, height * dpr);
        glContext.canvas.style.width = width + "px";
        glContext.canvas.style.height = height + "px";
        if (program) {
          program.uniforms.iResolution.value.set(
            glContext.canvas.width,
            glContext.canvas.height,
            glContext.canvas.width / glContext.canvas.height
          );
        }
      };
      window.addEventListener("resize", resize);
      resize();

      let lastTime = 0;
      let currentRot = 0;
      let isMicrophoneInitialized = false;

      // Only initialize microphone if explicitly requested ON USER ACTION (never automatically on page load)
      if (enableVoiceControl) {
        initMicrophone().then((res) => {
          isMicrophoneInitialized = res;
        });
      } else {
        stopMicrophone();
      }

      const update = (t: number) => {
        rafId = requestAnimationFrame(update);
        if (!program) return;
        const dt = (t - lastTime) * 0.001;
        lastTime = t;
        program.uniforms.iTime.value = t * 0.001;

        if (enableVoiceControl && isMicrophoneInitialized) {
          const lvl = analyzeAudio();
          if (onVoiceDetected) onVoiceDetected(lvl > 0.08);
          currentRot += dt * (0.4 + lvl * maxRotationSpeed);
          program.uniforms.hover.value = lvl;
        } else {
          currentRot += dt * 0.4;
          program.uniforms.hover.value = 0;
        }

        program.uniforms.rot.value = currentRot;

        if (rendererInstance && glContext) {
          glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
          rendererInstance.render({ scene: mesh });
        }
      };

      rafId = requestAnimationFrame(update);

      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(rafId);
        stopMicrophone();
      };
    } catch (e) {
      console.warn("Orb init error:", e);
    }
  }, [enableVoiceControl, hue]);

  return <div ref={ctnDom} className={className || "w-full h-full"} />;
};

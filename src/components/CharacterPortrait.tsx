"use client";

import { motion } from "motion/react";
import { getCharacterAppearance, type CharacterAppearance } from "@/config/portrait.config";

interface CharacterPortraitProps {
  characterId: string;
  isSpeaking?: boolean;
  className?: string;
  viewBox?: string;
}

// Face center coordinates
const CX = 100;
const CY = 118;

export function CharacterPortrait({
  characterId,
  isSpeaking = false,
  className,
  viewBox = "0 0 200 260",
}: CharacterPortraitProps) {
  const a = getCharacterAppearance(characterId);
  const uid = characterId;

  return (
    <svg viewBox={viewBox} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`el-${uid}`}>
          <ellipse cx={CX - 20} cy={CY - 6} rx={12} ry={7} />
        </clipPath>
        <clipPath id={`er-${uid}`}>
          <ellipse cx={CX + 20} cy={CY - 6} rx={12} ry={7} />
        </clipPath>
      </defs>

      <motion.g
        animate={
          isSpeaking
            ? { rotate: [0, -0.7, 0.4, -0.3, 0.6, 0], y: [0, -1, 0.5, 0] }
            : { rotate: [0, 0.2, 0, -0.2, 0], y: [0, 0.3, 0] }
        }
        transition={
          isSpeaking
            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {/* === LAYER 1: Robe / Shoulders === */}
        <path
          d={`M20 260 Q50 225 80 212 L120 212 Q150 225 180 260 Z`}
          fill={a.robeColor}
        />
        {/* Robe neckline */}
        <path
          d="M80 212 Q100 225 120 212"
          stroke={a.robeAccent}
          strokeWidth={2.5}
          fill="none"
        />
        {/* Robe trim lines */}
        <path d="M75 215 L60 245" stroke={a.robeAccent} strokeWidth={1} fill="none" opacity={0.5} />
        <path d="M125 215 L140 245" stroke={a.robeAccent} strokeWidth={1} fill="none" opacity={0.5} />

        {/* === LAYER 2: Neck === */}
        <rect x={88} y={180} width={24} height={34} rx={10} fill={a.skinTone} />
        <ellipse cx={CX} cy={180} rx={18} ry={5} fill={a.skinShadow} opacity={0.25} />

        {/* === LAYER 3: Hair (back layer) === */}
        <HairBack a={a} />

        {/* === LAYER 4: Head / Face shape === */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={a.faceRx}
          ry={a.faceRy}
          fill={a.skinTone}
          stroke="#2a2018"
          strokeWidth={0.8}
          opacity={1}
        />

        {/* Cheek shadows */}
        <ellipse cx={CX - 28} cy={CY + 14} rx={14} ry={9} fill={a.skinShadow} opacity={0.1} />
        <ellipse cx={CX + 28} cy={CY + 14} rx={14} ry={9} fill={a.skinShadow} opacity={0.1} />

        {/* === LAYER 5: Ears === */}
        <ellipse
          cx={CX - a.faceRx + 3}
          cy={CY + 2}
          rx={7}
          ry={11}
          fill={a.skinTone}
          stroke="#2a2018"
          strokeWidth={0.5}
        />
        <ellipse
          cx={CX + a.faceRx - 3}
          cy={CY + 2}
          rx={7}
          ry={11}
          fill={a.skinTone}
          stroke="#2a2018"
          strokeWidth={0.5}
        />

        {/* === LAYER 6: Eyes === */}
        {/* Left eye */}
        <g clipPath={`url(#el-${uid})`}>
          <ellipse cx={CX - 20} cy={CY - 6} rx={12} ry={7} fill="#f0ece6" />
          <g className="portrait-pupils">
            <circle cx={CX - 20} cy={CY - 6} r={5.5} fill={a.eyeColor} />
            <circle cx={CX - 20} cy={CY - 6} r={2.8} fill="#1a1a1a" />
            <circle cx={CX - 21.5} cy={CY - 7.5} r={1.2} fill="rgba(255,255,255,0.45)" />
          </g>
          <ellipse cx={CX - 20} cy={CY - 6} rx={12} ry={7} fill={a.skinTone} className="portrait-eyelid" />
        </g>
        <ellipse cx={CX - 20} cy={CY - 6} rx={12} ry={7} fill="none" stroke="#2a2018" strokeWidth={1.2} />
        {/* Upper eyelid crease */}
        <path
          d={`M${CX - 33} ${CY - 14} Q${CX - 20} ${CY - 19} ${CX - 7} ${CY - 14}`}
          stroke="#2a2018"
          strokeWidth={0.5}
          fill="none"
          opacity={0.3}
        />

        {/* Right eye */}
        <g clipPath={`url(#er-${uid})`}>
          <ellipse cx={CX + 20} cy={CY - 6} rx={12} ry={7} fill="#f0ece6" />
          <g className="portrait-pupils">
            <circle cx={CX + 20} cy={CY - 6} r={5.5} fill={a.eyeColor} />
            <circle cx={CX + 20} cy={CY - 6} r={2.8} fill="#1a1a1a" />
            <circle cx={CX + 18.5} cy={CY - 7.5} r={1.2} fill="rgba(255,255,255,0.45)" />
          </g>
          <ellipse cx={CX + 20} cy={CY - 6} rx={12} ry={7} fill={a.skinTone} className="portrait-eyelid" />
        </g>
        <ellipse cx={CX + 20} cy={CY - 6} rx={12} ry={7} fill="none" stroke="#2a2018" strokeWidth={1.2} />
        <path
          d={`M${CX + 7} ${CY - 14} Q${CX + 20} ${CY - 19} ${CX + 33} ${CY - 14}`}
          stroke="#2a2018"
          strokeWidth={0.5}
          fill="none"
          opacity={0.3}
        />

        {/* === LAYER 7: Eyebrows === */}
        <path
          d={`M${CX - 34} ${CY - 16} Q${CX - 20} ${CY - 24} ${CX - 6} ${CY - 16}`}
          stroke={a.hairColor}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${CX + 6} ${CY - 16} Q${CX + 20} ${CY - 24} ${CX + 34} ${CY - 16}`}
          stroke={a.hairColor}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
        />

        {/* === LAYER 8: Nose === */}
        <path
          d={`M${CX} ${CY - 2} L${CX - 4} ${CY + 14} Q${CX} ${CY + 18} ${CX + 4} ${CY + 14} Z`}
          fill={a.skinShadow}
          opacity={0.25}
        />
        <path
          d={`M${CX - 5} ${CY + 14} Q${CX} ${CY + 18} ${CX + 5} ${CY + 14}`}
          stroke="#2a2018"
          strokeWidth={0.7}
          fill="none"
          opacity={0.35}
        />

        {/* === LAYER 9: Mouth === */}
        {/* Lip line */}
        <path
          d={`M${CX - 14} ${CY + 30} Q${CX - 5} ${CY + 27} ${CX} ${CY + 28} Q${CX + 5} ${CY + 27} ${CX + 14} ${CY + 30}`}
          stroke={a.skinShadow}
          strokeWidth={1.3}
          fill="none"
        />
        {/* Lower lip hint */}
        <path
          d={`M${CX - 10} ${CY + 31} Q${CX} ${CY + 36} ${CX + 10} ${CY + 31}`}
          stroke={a.skinShadow}
          strokeWidth={0.7}
          fill="none"
          opacity={0.4}
        />
        {/* Speaking mouth opening */}
        <motion.ellipse
          cx={CX}
          cy={CY + 31}
          rx={8}
          fill="#3d1515"
          animate={
            isSpeaking
              ? { ry: [0.5, 4, 1.5, 5.5, 2, 4, 0.5], opacity: 1 }
              : { ry: 0, opacity: 0 }
          }
          transition={
            isSpeaking
              ? {
                  ry: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.15 },
                }
              : { ry: { duration: 0.2 }, opacity: { duration: 0.15 } }
          }
        />

        {/* === LAYER 10: Beard === */}
        <Beard a={a} />

        {/* === LAYER 11: Hair (sides / front) === */}
        <HairSides a={a} />

        {/* === LAYER 12: Headwear === */}
        <Headwear a={a} uid={uid} />
      </motion.g>
    </svg>
  );
}

/* -- Hair: back layer -- */
function HairBack({ a }: { a: CharacterAppearance }) {
  switch (a.hairStyle) {
    case "short":
      return (
        <ellipse cx={CX} cy={CY - 14} rx={a.faceRx + 4} ry={a.faceRy - 10} fill={a.hairColor} />
      );
    case "medium":
      return (
        <ellipse cx={CX} cy={CY - 12} rx={a.faceRx + 7} ry={a.faceRy - 2} fill={a.hairColor} />
      );
    case "long":
      return (
        <ellipse cx={CX} cy={CY - 8} rx={a.faceRx + 9} ry={a.faceRy + 6} fill={a.hairColor} />
      );
    case "receding":
      return (
        <ellipse cx={CX} cy={CY - 22} rx={a.faceRx - 2} ry={a.faceRy - 20} fill={a.hairColor} />
      );
  }
}

/* -- Hair: side locks -- */
function HairSides({ a }: { a: CharacterAppearance }) {
  if (a.hairStyle === "short" || a.hairStyle === "receding") return null;

  const sideY = a.hairStyle === "long" ? CY - 22 : CY - 16;
  const sideH = a.hairStyle === "long" ? 100 : 60;
  const sideW = 14;

  return (
    <>
      <rect
        x={CX - a.faceRx - 4}
        y={sideY}
        width={sideW}
        height={sideH}
        rx={6}
        fill={a.hairColor}
      />
      <rect
        x={CX + a.faceRx - sideW + 4}
        y={sideY}
        width={sideW}
        height={sideH}
        rx={6}
        fill={a.hairColor}
      />
    </>
  );
}

/* -- Beard -- */
function Beard({ a }: { a: CharacterAppearance }) {
  if (a.beardStyle === "none") return null;

  switch (a.beardStyle) {
    case "short":
      return (
        <path
          d={`M${CX - 28} ${CY + 24} Q${CX - 38} ${CY + 38} ${CX - 28} ${CY + 52}
              Q${CX} ${CY + 65} ${CX + 28} ${CY + 52}
              Q${CX + 38} ${CY + 38} ${CX + 28} ${CY + 24}`}
          fill={a.beardColor}
          opacity={0.85}
        />
      );
    case "full":
      return (
        <path
          d={`M${CX - 32} ${CY + 20} Q${CX - 46} ${CY + 40} ${CX - 34} ${CY + 65}
              Q${CX} ${CY + 88} ${CX + 34} ${CY + 65}
              Q${CX + 46} ${CY + 40} ${CX + 32} ${CY + 20}`}
          fill={a.beardColor}
          opacity={0.9}
        />
      );
    case "forked":
      return (
        <path
          d={`M${CX - 32} ${CY + 20} Q${CX - 46} ${CY + 40} ${CX - 34} ${CY + 68}
              Q${CX - 24} ${CY + 92} ${CX - 12} ${CY + 88}
              L${CX - 4} ${CY + 72} Q${CX} ${CY + 68} ${CX + 4} ${CY + 72}
              L${CX + 12} ${CY + 88}
              Q${CX + 24} ${CY + 92} ${CX + 34} ${CY + 68}
              Q${CX + 46} ${CY + 40} ${CX + 32} ${CY + 20}`}
          fill={a.beardColor}
          opacity={0.9}
        />
      );
  }
}

/* -- Headwear -- */
function Headwear({ a, uid }: { a: CharacterAppearance; uid: string }) {
  const goldFill = "#daa520";
  const goldDark = "#8b6914";
  const gemRed = "#8b0000";
  const gemBlue = "#1a4fb4";
  const bandTop = 50;
  const bandBot = 63;

  switch (a.headwear) {
    case "none":
      return null;

    case "circlet":
      return (
        <g>
          <path
            d={`M48 ${bandBot} Q${CX} ${bandBot - 8} 152 ${bandBot}
                L152 ${bandTop} Q${CX} ${bandTop - 8} 48 ${bandTop} Z`}
            fill={goldFill}
            stroke={goldDark}
            strokeWidth={0.8}
          />
          <path d="M78 50 L83 36 L88 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          <path d="M95 50 L100 28 L105 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          <path d="M112 50 L117 36 L122 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          <circle cx={CX} cy={28} r={2.5} fill={gemRed} />
        </g>
      );

    case "ornate":
      return (
        <g>
          <path
            d={`M48 ${bandBot} Q${CX} ${bandBot - 8} 152 ${bandBot}
                L152 ${bandTop} Q${CX} ${bandTop - 8} 48 ${bandTop} Z`}
            fill={goldFill}
            stroke={goldDark}
            strokeWidth={0.8}
          />
          <path d="M66 50 L70 35 L74 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          <path d="M82 50 L87 28 L92 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          <path d="M96 50 L100 22 L104 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          <path d="M108 50 L113 28 L118 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          <path d="M126 50 L130 35 L134 50" fill={goldFill} stroke={goldDark} strokeWidth={0.6} />
          {/* Gems */}
          <circle cx={70} cy={35} r={2} fill={gemRed} />
          <circle cx={87} cy={28} r={2} fill={gemBlue} />
          <circle cx={CX} cy={22} r={3} fill={gemRed} />
          <circle cx={113} cy={28} r={2} fill={gemBlue} />
          <circle cx={130} cy={35} r={2} fill={gemRed} />
          {/* Band gems */}
          <circle cx={65} cy={56} r={1.5} fill={gemBlue} />
          <circle cx={CX} cy={52} r={2} fill={gemRed} />
          <circle cx={135} cy={56} r={1.5} fill={gemBlue} />
        </g>
      );

    case "turban":
      return (
        <g>
          {/* Main turban wrap - layered cloth folds */}
          <ellipse cx={CX} cy={CY - 40} rx={a.faceRx + 8} ry={38} fill="#d4c0a0" />
          <ellipse cx={CX} cy={CY - 40} rx={a.faceRx + 4} ry={34} fill="#c8b490" />
          {/* Cloth fold lines */}
          <path
            d={`M${CX - 40} ${CY - 30} Q${CX - 10} ${CY - 55} ${CX + 40} ${CY - 30}`}
            stroke="#b0a080"
            strokeWidth={1.2}
            fill="none"
            opacity={0.6}
          />
          <path
            d={`M${CX - 35} ${CY - 36} Q${CX} ${CY - 60} ${CX + 35} ${CY - 36}`}
            stroke="#b0a080"
            strokeWidth={1}
            fill="none"
            opacity={0.5}
          />
          <path
            d={`M${CX - 44} ${CY - 24} Q${CX} ${CY - 44} ${CX + 44} ${CY - 24}`}
            stroke="#b0a080"
            strokeWidth={1}
            fill="none"
            opacity={0.4}
          />
          {/* Front band */}
          <path
            d={`M${CX - a.faceRx - 2} ${CY - 30} Q${CX} ${CY - 38} ${CX + a.faceRx + 2} ${CY - 30}`}
            stroke="#a09070"
            strokeWidth={3}
            fill="none"
          />
          {/* Tail draping behind (left side) */}
          <path
            d={`M${CX - a.faceRx} ${CY - 25} Q${CX - a.faceRx - 12} ${CY} ${CX - a.faceRx - 6} ${CY + 30}`}
            stroke="#c8b490"
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            opacity={0.7}
          />
        </g>
      );

    case "halo":
      return (
        <g>
          {/* Outer glow */}
          <defs>
            <radialGradient id={`halo-glow-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.3} />
              <stop offset="70%" stopColor="#c9a84c" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* Glow behind */}
          <ellipse cx={CX} cy={CY - 36} rx={52} ry={52} fill={`url(#halo-glow-${uid})`} />
          {/* Golden ring */}
          <ellipse
            cx={CX}
            cy={CY - 46}
            rx={48}
            ry={14}
            fill="none"
            stroke="#daa520"
            strokeWidth={3.5}
            opacity={0.85}
          />
          {/* Inner highlight */}
          <ellipse
            cx={CX}
            cy={CY - 46}
            rx={45}
            ry={12}
            fill="none"
            stroke="#f0d060"
            strokeWidth={1}
            opacity={0.5}
          />
        </g>
      );
  }
}

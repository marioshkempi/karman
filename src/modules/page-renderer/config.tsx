"use client"

import type { Config, Data } from "@puckeditor/core"
import React, { useEffect, useId, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ImageTextComponent } from "./imageText"
import {
  popupSelectField,
  registerPopup,
  unregisterPopup,
  usePopupRuntime,
} from "./PopupSystem"

/**
 * Standalone storefront Puck config — v3.
 *
 * Self-contained — no imports from the admin server.
 * Uses framer-motion for per-element + per-section animations.
 * Background image support on Section, TwoColumns, ThreeColumns, Container.
 * Tabs, Countdown, Newsletter are interactive client components.
 */

function colorField(label: string) {
  return { type: "text" as const, label }
}

function imageField(label: string, _opts?: any) {
  return { type: "text" as const, label }
}

function richTextField(label: string) {
  return { type: "textarea" as const, label }
}

const ParallelogramSvg = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1361.582 635.971"
    preserveAspectRatio="none"
  >
    <path
      d="M94.476,5.486,1223.241,0,997.474,635.971H-138.342Z"
      transform="translate(138.342)"
      fill="#ececec"
      opacity="0.04"
    />
  </svg>
)

function AdditionalProductItemView({
                                     image,
                                     lines,
                                     textBackground,
                                     cardBackground,
                                     accentLetterColor,
                                     popupOnClick,
                                     popupId,
                                     fontFamily,
                                     highlightSizeDesktop,
                                     restSizeDesktop,
                                     highlightSizeMobile,
                                     restSizeMobile,
                                   }: any) {
  const scope = `puck-addprod-${useId().replace(/:/g, "")}`
  const rawBg = textBackground ?? cardBackground
  const bg =
    typeof rawBg === "string" && rawBg.trim() ? rawBg.trim() : "#000000"
  const accent =
    typeof accentLetterColor === "string" && accentLetterColor.trim()
      ? accentLetterColor.trim()
      : "#3b82f6"
  const { openPopup } = usePopupRuntime()

  const canTrigger = Boolean(popupOnClick && popupId)
  const handlePopupClick = (e: any) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (popupId) openPopup(popupId)
  }

  return (
    <div
      className="flex min-w-0 w-full items-center justify-center"
      style={{ containerType: "inline-size" } as any}
    >
      <style>{`
            .${scope}-row{
              display: flex;
              align-items: center;
              height: 180px;
            }
            .${scope}-img{
              width: 300px;
              height: 100%;
              flex-shrink: 0;
            }
            .${scope}-text{
              position: relative;
              height: 97%;
              min-height: 0;
              min-width: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              box-sizing: border-box;
              isolation: isolate;
            }
            .${scope}-text::before{
              content: "";
              position: absolute;
              z-index: 0;
              inset: 0;
              background: var(--ap-text-bg, #000);
              border: 1px solid rgba(39, 39, 42, 0.7);
              transform: skewX(-22deg);
              transform-origin: center center;
              transition: filter 0.3s ease, border-color 0.3s ease;
            }
            .group:hover .${scope}-text::before{
              filter: brightness(1.12);
              border-color: rgba(59, 130, 246, 0.45);
            }
            .${scope}-textInner{
              position: relative;
              z-index: 1;
              transform: none;
            }
            .${scope}-h{
              color: var(--ap-accent, #3b82f6) !important;
              /* Mobile-first */
              font-size: var(--ap-h-m, 18px) !important;
              line-height: 1.05 !important;
            }
            .${scope}-r{
              /* Mobile-first */
              font-size: var(--ap-r-m, 14px) !important;
              line-height: 1.05 !important;
            }
            @container (max-width: 640px){
              .${scope}-row{ height: calc(clamp(140px, 42cqw, 300px) * 180 / 300) !important; }
              .${scope}-img{ width: clamp(140px, 42cqw, 300px) !important; margin-left: 0 !important; }
              .${scope}-h{ font-size: var(--ap-h-m, 18px) !important; }
              .${scope}-r{ font-size: var(--ap-r-m, 14px) !important; }
              .${scope}-text{ padding: 0 10px 0 40px !important; margin-left: -36px !important; }
            }
            @media (max-width: 640px){
              .${scope}-row{ height: calc(clamp(140px, 42vw, 300px) * 180 / 300) !important; }
              .${scope}-img{ width: clamp(140px, 42vw, 300px) !important; margin-left: 0 !important; }
              .${scope}-h{ font-size: var(--ap-h-m, 18px) !important; }
              .${scope}-r{ font-size: var(--ap-r-m, 14px) !important; }
              .${scope}-text{ padding: 0 10px 0 40px !important; margin-left: -36px !important; }
            }
            @media (min-width: 1024px){
              .${scope}-h{ font-size: var(--ap-h-d, 30px) !important; }
              .${scope}-r{ font-size: var(--ap-r-d, 25px) !important; }
            }
          `}</style>

      <div
        className={`${scope}-row group relative w-fit min-w-0 max-w-[min(600px,100%)] ${
          canTrigger ? "cursor-pointer" : ""
        }`}
        onMouseDownCapture={canTrigger ? (e) => e.stopPropagation() : undefined}
        onClickCapture={canTrigger ? handlePopupClick : undefined}
      >
        <div className={`${scope}-img relative z-10`}>
          <img
            src={image}
            alt="Product"
            className="h-full w-full object-contain"
          />
        </div>

        <div
          className={`${scope}-text relative -ml-10 pl-14 pr-6`}
          style={
            {
              "--ap-text-bg": bg,
              "--ap-accent": accent,
              "--ap-h-d": String(highlightSizeDesktop || "30px"),
              "--ap-r-d": String(restSizeDesktop || "25px"),
              "--ap-h-m": String(highlightSizeMobile || "18px"),
              "--ap-r-m": String(restSizeMobile || "14px"),
            } as React.CSSProperties
          }
        >
          <div
            className={`${scope}-textInner min-w-0`}
            style={{ fontFamily: fontFamily || undefined }}
          >
            <div className="flex flex-col leading-[1.05] font-normal uppercase tracking-tighter">
              {Array.isArray(lines) &&
                lines.map((line: any, lIdx: number) => (
                  <div
                    key={lIdx}
                    className="flex flex-wrap items-baseline gap-x-2"
                  >
                    {(Array.isArray(line?.segments) ? line.segments : []).map(
                      (segment: any, sIdx: number) => (
                        <div key={sIdx} className="flex min-w-0 items-baseline">
                          <span className={`${scope}-h`}>{segment?.h}</span>
                          <span
                            className={`${scope}-r break-words whitespace-pre-wrap text-white`}
                          >
                            {segment?.r}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// ANIMATION ENGINE
// ═══════════════════════════════════════════════

const entranceInitial: Record<string, any> = {
  fadeIn: { opacity: 0 },
  fadeInUp: { opacity: 0, y: 30 },
  fadeInDown: { opacity: 0, y: -30 },
  fadeInLeft: { opacity: 0, x: -40 },
  fadeInRight: { opacity: 0, x: 40 },
  slideUp: { y: 50, opacity: 0 },
  slideDown: { y: -50, opacity: 0 },
  slideLeft: { x: -50, opacity: 0 },
  slideRight: { x: 50, opacity: 0 },
  scaleIn: { scale: 0.8, opacity: 0 },
  scaleInUp: { scale: 0.8, opacity: 0, y: 30 },
  scaleBounce: { scale: 0.5, opacity: 0 },
  rotateIn: { rotate: -15, opacity: 0, scale: 0.9 },
  flipIn: { rotateY: 90, opacity: 0 },
  flipInX: { rotateX: 90, opacity: 0 },
  flipInY: { rotateY: 90, opacity: 0 },
  bounceIn: { scale: 0.3, opacity: 0 },
}

const entranceAnimate: Record<string, any> = {
  fadeIn: { opacity: 1 },
  fadeInUp: { opacity: 1, y: 0 },
  fadeInDown: { opacity: 1, y: 0 },
  fadeInLeft: { opacity: 1, x: 0 },
  fadeInRight: { opacity: 1, x: 0 },
  slideUp: { y: 0, opacity: 1 },
  slideDown: { y: 0, opacity: 1 },
  slideLeft: { x: 0, opacity: 1 },
  slideRight: { x: 0, opacity: 1 },
  scaleIn: { scale: 1, opacity: 1 },
  scaleInUp: { scale: 1, opacity: 1, y: 0 },
  scaleBounce: { scale: 1, opacity: 1 },
  rotateIn: { rotate: 0, opacity: 1, scale: 1 },
  flipIn: { rotateY: 0, opacity: 1 },
  flipInX: { rotateX: 0, opacity: 1 },
  flipInY: { rotateY: 0, opacity: 1 },
  bounceIn: { scale: 1, opacity: 1 },
}

const entranceTransitionOverrides: Record<string, any> = {
  bounceIn: { type: "spring", stiffness: 300, damping: 15 },
  scaleBounce: { type: "spring", stiffness: 260, damping: 12 },
}

const loopAnimations: Record<string, { animate: any; transition: any }> = {
  float: {
    animate: { y: [0, -12, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  floatSlow: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  bounce: {
    animate: { y: [0, -15, 0] },
    transition: { duration: 0.8, repeat: Infinity, ease: "easeOut" },
  },
  rotate: {
    animate: { rotate: 360 },
    transition: { duration: 3, repeat: Infinity, ease: "linear" },
  },
  rotateSlow: {
    animate: { rotate: 360 },
    transition: { duration: 8, repeat: Infinity, ease: "linear" },
  },
  swing: {
    animate: { rotate: [0, 8, -8, 0] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  rock: {
    animate: { rotate: [0, 5, -5, 3, -3, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  shake: {
    animate: { x: [0, -5, 5, -5, 5, 0] },
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
  },
  glow: {
    animate: { opacity: [1, 0.6, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  zoomPulse: {
    animate: { scale: [1, 1.08, 1] },
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
}

// Animations that use x/rotateY — need overflow:hidden on parent to prevent mobile horizontal scroll
const overflowAnimations = new Set([
  "fadeInLeft",
  "fadeInRight",
  "slideLeft",
  "slideRight",
  "flipIn",
  "flipInY",
])

// ── Section-level animation wrapper ──
function AnimationWrapper({
                            children,
                            animation,
                            duration = 0.6,
                            delay = 0,
                            loopAnimation: loopName,
                            scrollTrigger = true,
                          }: {
  children: React.ReactNode
  animation?: string
  duration?: number
  delay?: number
  loopAnimation?: string
  scrollTrigger?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const hasEntrance = animation && entranceInitial[animation]
  const hasLoop = loopName && loopAnimations[loopName]
  if (!hasEntrance && !hasLoop) return <>{children}</>
  const mp: any = {}
  if (hasEntrance) {
    const go = scrollTrigger ? isInView : true
    mp.initial = entranceInitial[animation!]
    mp.animate = go ? entranceAnimate[animation!] : entranceInitial[animation!]
    mp.transition = {
      duration,
      delay,
      ease: "easeOut",
      ...entranceTransitionOverrides[animation!],
    }
  }
  if (hasLoop && (!hasEntrance || (scrollTrigger ? isInView : true))) {
    const loop = loopAnimations[loopName!]
    if (!hasEntrance) {
      mp.animate = loop.animate
      mp.transition = loop.transition
    }
  }
  const needsClip = animation && overflowAnimations.has(animation)
  const el = (
    <motion.div ref={ref} {...mp} style={{ perspective: 1000 }}>
      {children}
    </motion.div>
  )
  return needsClip ? <div style={{ overflow: "hidden" }}>{el}</div> : el
}

// ── Per-element animation component ──
function AnimEl({
                  children,
                  name,
                  props,
                  style,
                }: {
  children: React.ReactNode
  name: string
  props: Record<string, any>
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const anim = props[`${name}Animation`] || ""
  const delay = parseFloat(props[`${name}AnimDelay`] || "0")
  const duration = parseFloat(props[`${name}AnimDuration`] || "0.6")
  const loopName = props[`${name}Loop`] || ""
  const hasEntrance = anim && entranceInitial[anim]
  const hasLoop = loopName && loopAnimations[loopName]
  if (!hasEntrance && !hasLoop) return <div style={style}>{children}</div>
  const needsClip = anim && overflowAnimations.has(anim)
  const clipStyle = needsClip ? { overflow: "hidden" as const } : {}
  const mp: any = { style: { ...style, perspective: 1000 } }
  if (hasEntrance) {
    mp.initial = entranceInitial[anim]
    mp.animate = isInView ? entranceAnimate[anim] : entranceInitial[anim]
    mp.transition = {
      duration,
      delay,
      ease: "easeOut",
      ...entranceTransitionOverrides[anim],
    }
  }
  if (hasEntrance && hasLoop && isInView) {
    const loop = loopAnimations[loopName]
    const el = (
      <motion.div ref={ref} {...mp}>
        <motion.div
          animate={loop.animate}
          transition={{ ...loop.transition, delay: delay + duration }}
        >
          {children}
        </motion.div>
      </motion.div>
    )
    return needsClip ? <div style={clipStyle}>{el}</div> : el
  }
  if (hasLoop && !hasEntrance) {
    const loop = loopAnimations[loopName]
    mp.animate = loop.animate
    mp.transition = loop.transition
  }
  const el = (
    <motion.div ref={ref} {...mp}>
      {children}
    </motion.div>
  )
  return needsClip ? <div style={clipStyle}>{el}</div> : el
  // }
}

// ── Stagger animation for array items ──
function StaggerEl({
                     children,
                     index,
                     animation,
                     staggerDelay = 0.15,
                     duration = 0.6,
                   }: {
  children: React.ReactNode
  index: number
  animation: string
  staggerDelay?: number
  duration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  if (!animation || !entranceInitial[animation]) return <>{children}</>
  const needsClip = overflowAnimations.has(animation)
  const el = (
    <motion.div
      ref={ref}
      initial={entranceInitial[animation]}
      animate={
        isInView ? entranceAnimate[animation] : entranceInitial[animation]
      }
      transition={{
        duration,
        delay: index * staggerDelay,
        ease: "easeOut",
        ...entranceTransitionOverrides[animation],
      }}
    >
      {children}
    </motion.div>
  )
  return needsClip ? <div style={{ overflow: "hidden" }}>{el}</div> : el
}

// ── Field helpers (same as admin) ──
const animationSelectOptions = [
  { label: "None", value: "" },
  { label: "Fade In", value: "fadeIn" },
  { label: "Fade In Up", value: "fadeInUp" },
  { label: "Fade In Down", value: "fadeInDown" },
  { label: "Fade In Left", value: "fadeInLeft" },
  { label: "Fade In Right", value: "fadeInRight" },
  { label: "Slide Up", value: "slideUp" },
  { label: "Slide Left", value: "slideLeft" },
  { label: "Slide Right", value: "slideRight" },
  { label: "Scale In", value: "scaleIn" },
  { label: "Scale Bounce", value: "scaleBounce" },
  { label: "Rotate In", value: "rotateIn" },
  { label: "Flip In", value: "flipIn" },
  {
    label: "Bounce In",
    value: "bounceIn",
  },
]
const loopSelectOptions = [
  { label: "None", value: "" },
  { label: "Float", value: "float" },
  { label: "Float Slow", value: "floatSlow" },
  { label: "Pulse", value: "pulse" },
  { label: "Bounce", value: "bounce" },
  { label: "Rotate", value: "rotate" },
  { label: "Swing", value: "swing" },
  { label: "Rock", value: "rock" },
  { label: "Zoom Pulse", value: "zoomPulse" },
]

function elAnimFields(name: string) {
  return {
    [`${name}Animation`]: {
      type: "select" as const,
      label: `${name} — Entrance`,
      options: animationSelectOptions,
    },
    [`${name}AnimDelay`]: {
      type: "text" as const,
      label: `${name} — Delay (s)`,
    },
    [`${name}AnimDuration`]: {
      type: "text" as const,
      label: `${name} — Duration (s)`,
    },
    [`${name}Loop`]: {
      type: "select" as const,
      label: `${name} — Loop`,
      options: loopSelectOptions,
    },
  }
}

function elAnimDefaults(
  name: string,
  entrance = "",
  delay = "0",
  duration = "0.6",
  loop = ""
) {
  return {
    [`${name}Animation`]: entrance,
    [`${name}AnimDelay`]: delay,
    [`${name}AnimDuration`]: duration,
    [`${name}Loop`]: loop,
  }
}

// ── Section-level wrapper ──
function withAnimations(config: Config): Config {
  const stripKeys = new Set([
    "_animation",
    "_animationDuration",
    "_animationDelay",
    "_loopAnimation",
    "_scrollTrigger",
    "_paddingTop",
    "_paddingBottom",
    "_paddingLeft",
    "_paddingRight",
    "_marginTop",
    "_marginBottom",
    "_bgColor",
    "_textColor",
    "_headingColor",
    "_fontSize",
    "_headingFontSize",
    "_fontWeight",
    "_fontFamily",
    "_lineHeight",
    "_letterSpacing",
    "_textTransform",
    "_wordSpacing",
    "_borderWidth",
    "_borderColor",
    "_borderRadius",
    "_maxWidth",
    "_textAlign",
    "_mobileDirection",
    "_tabletDirection",
    "_mobileTextAlign",
    "_mobileColumns",
    "_mobilePadding",
    "_mobileHidden",
    "_tabletHidden",
    "_hideOnMobile",
    "_hideOnDesktop",
    "blockClasses",
    "blockId",
  ])
  return {
    ...config,
    components: Object.fromEntries(
      Object.entries(config.components).map(([key, comp]) => {
        const orig = comp as any,
          origRender = orig.render
        return [
          key,
          {
            ...orig,
            render: (props: any) => {
              const cp: Record<string, any> = {}
              const st: Record<string, any> = {}
              for (const [k, v] of Object.entries(props)) {
                if (!stripKeys.has(k)) cp[k] = v
              }
              if (props._paddingTop) st.paddingTop = props._paddingTop
              if (props._paddingBottom) st.paddingBottom = props._paddingBottom
              if (props._paddingLeft) st.paddingLeft = props._paddingLeft
              if (props._paddingRight) st.paddingRight = props._paddingRight
              if (props._marginTop) st.marginTop = props._marginTop
              if (props._marginBottom) st.marginBottom = props._marginBottom
              if (props._bgColor) st.backgroundColor = props._bgColor
              if (props._textColor) st.color = props._textColor
              if (props._fontSize) st.fontSize = props._fontSize
              if (props._fontWeight) st.fontWeight = props._fontWeight
              if (props._fontFamily) st.fontFamily = props._fontFamily
              if (props._lineHeight) st.lineHeight = props._lineHeight
              if (props._letterSpacing) st.letterSpacing = props._letterSpacing
              if (props._textTransform) st.textTransform = props._textTransform
              if (props._wordSpacing) st.wordSpacing = props._wordSpacing
              if (props._borderWidth) st.borderWidth = props._borderWidth
              if (props._borderColor) st.borderColor = props._borderColor
              if (props._borderWidth || props._borderColor)
                st.borderStyle = "solid"
              if (props._borderRadius) st.borderRadius = props._borderRadius
              if (props._maxWidth) {
                st.maxWidth = props._maxWidth
                st.marginLeft = "auto"
                st.marginRight = "auto"
              }
              if (props._textAlign) st.textAlign = props._textAlign

              const cls = [
                props.blockClasses,
                props._hideOnMobile ? "hidden-mobile" : "",
                props._hideOnDesktop ? "hidden-desktop" : "",
              ]
                .filter(Boolean)
                .join(" ")

              // Responsive CSS + heading color
              const hasResponsive =
                props._mobileDirection ||
                props._tabletDirection ||
                props._mobileTextAlign ||
                props._mobileColumns ||
                props._mobilePadding ||
                props._headingColor ||
                props._headingFontSize ||
                props._mobileHidden ||
                props._tabletHidden
              const scopeClass = `pb-${key}-${(
                props.blockId || Math.random().toString(36).slice(2, 8)
              ).replace(/[^a-zA-Z0-9-]/g, "")}`

              let rCss = ""
              if (props._headingColor || props._headingFontSize) {
                const hR: string[] = []
                if (props._headingColor)
                  hR.push(`color:${props._headingColor} !important`)
                if (props._headingFontSize)
                  hR.push(`font-size:${props._headingFontSize} !important`)
                rCss += `.${scopeClass} h1,.${scopeClass} h2,.${scopeClass} h3,.${scopeClass} h4,.${scopeClass} h5,.${scopeClass} h6{${hR.join(
                  ";"
                )}}`
              }
              const mRules: string[] = []
              if (props._mobileDirection)
                mRules.push(
                  `flex-direction:${props._mobileDirection} !important;display:flex !important`
                )
              if (props._mobileTextAlign)
                mRules.push(`text-align:${props._mobileTextAlign} !important`)
              if (props._mobilePadding)
                mRules.push(`padding:${props._mobilePadding} !important`)
              if (props._mobileColumns)
                mRules.push(
                  `grid-template-columns:repeat(${props._mobileColumns},1fr) !important`
                )
              if (mRules.length > 0)
                rCss += `@media(max-width:767px){.${scopeClass},.${scopeClass} div,.${scopeClass} section{${mRules.join(
                  ";"
                )}}}`
              if (props._mobileHidden)
                rCss += `@media(max-width:767px){.${scopeClass}{display:none !important}}`
              const tRules: string[] = []
              if (props._tabletDirection)
                tRules.push(
                  `flex-direction:${props._tabletDirection} !important;display:flex !important`
                )
              if (tRules.length > 0)
                rCss += `@media(min-width:768px) and (max-width:1024px){.${scopeClass},.${scopeClass} div,.${scopeClass} section{${tRules.join(
                  ";"
                )}}}`
              if (props._tabletHidden)
                rCss += `@media(min-width:768px) and (max-width:1024px){.${scopeClass}{display:none !important}}`

              const rendered = origRender(cp)
              const allCls = [hasResponsive ? scopeClass : "", cls]
                .filter(Boolean)
                .join(" ")
              const hasSt =
                Object.keys(st).length > 0 || allCls || props.blockId || rCss

              const children: React.ReactNode[] = []
              if (rCss)
                children.push(
                  React.createElement("style", { key: "rcss" }, rCss)
                )
              children.push(rendered)

              const styled = hasSt
                ? React.createElement(
                  "div",
                  {
                    ...(props.blockId ? { id: props.blockId } : {}),
                    ...(allCls ? { className: allCls } : {}),
                    ...(Object.keys(st).length > 0 ? { style: st } : {}),
                  },
                  ...children
                )
                : rendered

              if (!props._animation && !props._loopAnimation) return styled
              return React.createElement(AnimationWrapper, {
                children: styled,
                animation: props._animation || undefined,
                duration: parseFloat(props._animationDuration || "0.6"),
                delay: parseFloat(props._animationDelay || "0"),
                loopAnimation: props._loopAnimation || undefined,
                scrollTrigger: props._scrollTrigger !== false,
              })
            },
          },
        ]
      })
    ),
  }
}

const rawConfig: Config = {
  categories: {
    hero: {
      title: "Hero & Headers",
      components: ["Hero", "HeroSplit", "AnnouncementBar", "PageHeader"],
    },
    blog: {
      title: "Blog / Article",
      components: [
        "ArticleHeader",
        "TableOfContents",
        "Pullquote",
        "Blockquote",
        "CodeBlock",
        "ImageCaption",
        "AuthorBio",
        "RelatedPosts",
        "ArticleCTA",
        "Timeline",
      ],
    },
    landing: {
      title: "Landing Page",
      components: [
        "SplitBanner",
        "FeatureCards",
        "MissionStrip",
        "ContentBlock",
        "IconFeatureGrid",
        "FullWidthImage",
        "ParallaxSection",
        "SeriesTabsNav",
        "SeriesTabsSection",
        "LandingSkewSection",
        "ShowcaseSection",
        "ShowcaseItem",
        "AdditionalProductItem",
      ],
    },
    layout: {
      title: "Layout",
      components: [
        "Section",
        "TwoColumns",
        "ThreeColumns",
        "Flex",
        "Grid",
        "Container",
        "Spacer",
        "Divider",
      ],
    },
    content: {
      title: "Content",
      components: [
        "TextBlock",
        "HighlightLinesText",
        "ImageBanner",
        "ImageText",
        "VideoEmbed",
        "Accordion",
        "ListBlock",
        "Tabs",
        "Table",
        "HTMLBlock",
        "PopupDefinition",
      ],
    },
    marketing: {
      title: "Marketing",
      components: [
        "Features",
        "CallToAction",
        "Testimonials",
        "Stats",
        "LogoCloud",
        "PricingTable",
        "Countdown",
        "Newsletter",
      ],
    },
    social: {
      title: "Social Proof",
      components: ["Reviews", "TrustBadges", "TeamMembers"],
    },
    media: {
      title: "Media",
      components: ["Gallery", "BeforeAfter", "MapEmbed", "AnimatedImage"],
    },
  },
  components: {
    // =============================================
    // BLOG / ARTICLE
    // =============================================

    ArticleHeader: {
      label: "Article Header",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle / Excerpt" },
        authorName: { type: "text", label: "Author Name" },
        authorAvatar: imageField("Author Avatar"),
        publishedDate: {
          type: "text",
          label: "Published Date (e.g. 15 Mar 2025)",
        },
        readingTime: { type: "text", label: "Reading Time (e.g. 5 min read)" },
        categoryLabel: { type: "text", label: "Category Label" },
        categoryColor: colorField("Category Badge Color"),
        featuredImage: imageField("Featured Image", {
          recommended: "1200 × 630px",
        }),
        featuredImageCaption: { type: "text", label: "Image Caption" },
        featuredImageHeight: {
          type: "text",
          label: "Image Height (e.g. 480px)",
        },
        layout: {
          type: "select",
          label: "Layout",
          options: [
            { label: "Image Below Title", value: "image-below" },
            { label: "Image Above Title", value: "image-above" },
            { label: "Image as Background", value: "image-bg" },
            { label: "No Image", value: "no-image" },
          ],
        },
        textAlign: {
          type: "select",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
        maxWidth: { type: "text", label: "Max Width" },
        verticalPadding: { type: "text", label: "Vertical Padding" },
      },
      defaultProps: {
        title: "Your Article Title Goes Here",
        subtitle:
          "A brief description or excerpt that gives readers a preview of what this article covers.",
        authorName: "John Doe",
        authorAvatar: "",
        publishedDate: "15 Mar 2025",
        readingTime: "5 min read",
        categoryLabel: "Tutorial",
        categoryColor: "#3b82f6",
        featuredImage: "",
        featuredImageCaption: "",
        featuredImageHeight: "480px",
        layout: "image-below",
        textAlign: "left",
        maxWidth: "800px",
        verticalPadding: "48px",
      },
      render: ({
                 title,
                 subtitle,
                 authorName,
                 authorAvatar,
                 publishedDate,
                 readingTime,
                 categoryLabel,
                 categoryColor,
                 featuredImage,
                 featuredImageCaption,
                 featuredImageHeight,
                 layout,
                 textAlign,
                 maxWidth,
                 verticalPadding,
               }: any) => {
        const metaRow = (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: textAlign === "center" ? "center" : "flex-start",
            }}
          >
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              {authorName && (
                <span
                  style={{
                    fontWeight: 600,
                    color: layout === "image-bg" ? "#e5e7eb" : "#374151",
                  }}
                >
                  {authorName}
                </span>
              )}
              {authorName && publishedDate && (
                <span
                  style={{
                    color:
                      layout === "image-bg"
                        ? "rgba(255,255,255,0.5)"
                        : undefined,
                  }}
                >
                  ·
                </span>
              )}
              {publishedDate && (
                <span
                  style={{
                    color:
                      layout === "image-bg"
                        ? "rgba(255,255,255,0.7)"
                        : undefined,
                  }}
                >
                  {publishedDate}
                </span>
              )}
              {readingTime && (
                <span
                  style={{
                    color:
                      layout === "image-bg"
                        ? "rgba(255,255,255,0.5)"
                        : undefined,
                  }}
                >
                  ·
                </span>
              )}
              {readingTime && (
                <span
                  style={{
                    color:
                      layout === "image-bg"
                        ? "rgba(255,255,255,0.7)"
                        : undefined,
                  }}
                >
                  {readingTime}
                </span>
              )}
            </div>
          </div>
        )

        const categoryBadge = categoryLabel ? (
          <div
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: textAlign === "center" ? "center" : "flex-start",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: categoryColor || "#3b82f6",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {categoryLabel}
            </span>
          </div>
        ) : null

        const titleBlock = (
          <div>
            {categoryBadge}
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                color: layout === "image-bg" ? "#fff" : "#111",
                margin: "0 0 16px",
                lineHeight: 1.2,
                textAlign,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: "1.125rem",
                  color:
                    layout === "image-bg"
                      ? "rgba(255,255,255,0.85)"
                      : "#6b7280",
                  margin: "0 0 20px",
                  lineHeight: 1.6,
                  textAlign,
                }}
              >
                {subtitle}
              </p>
            )}
            {metaRow}
          </div>
        )

        const imageBlock = featuredImage ? (
          <figure style={{ margin: "32px 0 0" }}>
            <img
              src={featuredImage}
              alt={title}
              style={{
                width: "100%",
                height: featuredImageHeight,
                objectFit: "cover",
                borderRadius: "12px",
                display: "block",
              }}
            />
            {featuredImageCaption && (
              <figcaption
                style={{
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                {featuredImageCaption}
              </figcaption>
            )}
          </figure>
        ) : null

        if (layout === "image-bg") {
          return (
            <section
              style={{
                position: "relative",
                minHeight: featuredImageHeight || "480px",
                backgroundImage: featuredImage
                  ? `url(${featuredImage})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
                backgroundColor: featuredImage ? undefined : "#1f2937",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  maxWidth,
                  margin: "0 auto",
                  padding: `${verticalPadding} 24px`,
                  width: "100%",
                }}
              >
                {titleBlock}
              </div>
            </section>
          )
        }

        return (
          <section style={{ padding: `${verticalPadding} 24px` }}>
            <div style={{ maxWidth, margin: "0 auto" }}>
              {layout === "image-above" && imageBlock}
              {titleBlock}
              {layout === "image-below" && imageBlock}
            </div>
          </section>
        )
      },
    },

    TableOfContents: {
      label: "Table of Contents",
      fields: {
        title: { type: "text", label: "Title" },
        items: {
          type: "array",
          label: "Entries",
          arrayFields: {
            text: { type: "text", label: "Link Text" },
            anchor: { type: "text", label: "Anchor ID (e.g. #section-1)" },
            indent: {
              type: "select",
              label: "Indent Level",
              options: [
                { label: "Top Level", value: "0" },
                { label: "Sub Item", value: "1" },
                { label: "Sub-Sub Item", value: "2" },
              ],
            },
          },
          defaultItemProps: {
            text: "Section Title",
            anchor: "#section",
            indent: "0",
          },
        },
        style: {
          type: "select",
          label: "Style",
          options: [
            { label: "Numbered", value: "numbered" },
            { label: "Bulleted", value: "bulleted" },
            { label: "Clean (no markers)", value: "clean" },
          ],
        },
        backgroundColor: colorField("Background Color"),
        borderColor: colorField("Border Color"),
        collapsible: {
          type: "radio",
          label: "Collapsible",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        title: "Table of Contents",
        items: [
          { text: "Introduction", anchor: "#introduction", indent: "0" },
          { text: "Getting Started", anchor: "#getting-started", indent: "0" },
          { text: "Prerequisites", anchor: "#prerequisites", indent: "1" },
          { text: "Installation", anchor: "#installation", indent: "1" },
          { text: "Configuration", anchor: "#configuration", indent: "0" },
          { text: "Conclusion", anchor: "#conclusion", indent: "0" },
        ],
        style: "numbered",
        backgroundColor: "#f8fafc",
        borderColor: "#e2e8f0",
        collapsible: false,
        maxWidth: "800px",
      },
      render: ({
                 title,
                 items,
                 style: tocStyle,
                 backgroundColor,
                 borderColor,
                 collapsible,
                 maxWidth,
               }: any) => {
        let topCounter = 0
        const content = (
          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((item: any, i: number) => {
                const indent = Number(item.indent) || 0
                if (indent === 0) topCounter++
                const prefix =
                  tocStyle === "numbered"
                    ? indent === 0
                      ? `${topCounter}. `
                      : "— "
                    : tocStyle === "bulleted"
                      ? indent === 0
                        ? "• "
                        : "◦ "
                      : ""
                return (
                  <li
                    key={i}
                    style={{ paddingLeft: `${indent * 20}px`, margin: 0 }}
                  >
                    <a
                      href={item.anchor}
                      style={{
                        display: "block",
                        padding: "6px 0",
                        fontSize: indent > 0 ? "0.875rem" : "0.925rem",
                        color: indent > 0 ? "#6b7280" : "#374151",
                        textDecoration: "none",
                        fontWeight: indent === 0 ? 500 : 400,
                        lineHeight: 1.5,
                      }}
                    >
                      {prefix}
                      {item.text}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        )

        return (
          <div
            style={{
              backgroundColor,
              border: `1px solid ${borderColor}`,
              borderRadius: "10px",
              padding: "20px 24px",
              maxWidth,
              margin: "0 auto 32px",
            }}
          >
            {collapsible ? (
              <details>
                <summary
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#111",
                    cursor: "pointer",
                    marginBottom: "8px",
                  }}
                >
                  {title}
                </summary>
                {content}
              </details>
            ) : (
              <>
                {title && (
                  <h3
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#111",
                      margin: "0 0 12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {title}
                  </h3>
                )}
                {content}
              </>
            )}
          </div>
        )
      },
    },

    Pullquote: {
      label: "Pullquote / Callout",
      fields: {
        content: richTextField("Content"),
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Info", value: "info" },
            { label: "Tip", value: "tip" },
            { label: "Warning", value: "warning" },
            { label: "Note", value: "note" },
            { label: "Success", value: "success" },
            { label: "Error / Danger", value: "error" },
            { label: "Quote", value: "quote" },
          ],
        },
        title: { type: "text", label: "Title (optional)" },
        showIcon: {
          type: "radio",
          label: "Show Icon",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        content:
          "This is an important callout that highlights key information for the reader.",
        variant: "info",
        title: "",
        showIcon: true,
        maxWidth: "800px",
      },
      render: ({ content, variant, title, showIcon, maxWidth }: any) => {
        const variants: Record<string, any> = {
          info: {
            bg: "#eff6ff",
            border: "#3b82f6",
            icon: "ℹ️",
            text: "#1e40af",
            titleColor: "#1d4ed8",
          },
          tip: {
            bg: "#f0fdf4",
            border: "#22c55e",
            icon: "💡",
            text: "#166534",
            titleColor: "#16a34a",
          },
          warning: {
            bg: "#fffbeb",
            border: "#f59e0b",
            icon: "⚠️",
            text: "#92400e",
            titleColor: "#d97706",
          },
          note: {
            bg: "#f8fafc",
            border: "#94a3b8",
            icon: "📝",
            text: "#475569",
            titleColor: "#334155",
          },
          success: {
            bg: "#f0fdf4",
            border: "#16a34a",
            icon: "✅",
            text: "#166534",
            titleColor: "#15803d",
          },
          error: {
            bg: "#fef2f2",
            border: "#ef4444",
            icon: "🚫",
            text: "#991b1b",
            titleColor: "#dc2626",
          },
          quote: {
            bg: "#faf5ff",
            border: "#8b5cf6",
            icon: "💬",
            text: "#5b21b6",
            titleColor: "#7c3aed",
          },
        }
        const v = variants[variant] || variants.info
        return (
          <div style={{ padding: "0 24px", margin: "24px auto", maxWidth }}>
            <div
              style={{
                backgroundColor: v.bg,
                borderLeft: `4px solid ${v.border}`,
                borderRadius: "0 8px 8px 0",
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                {showIcon && (
                  <span
                    style={{
                      fontSize: "1.2rem",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  >
                    {v.icon}
                  </span>
                )}
                <div style={{ flex: 1 }}>
                  {title && (
                    <div
                      style={{
                        fontSize: "0.925rem",
                        fontWeight: 700,
                        color: v.titleColor,
                        marginBottom: "4px",
                      }}
                    >
                      {title}
                    </div>
                  )}
                  {typeof content === "string" ? (
                    <div
                      style={{
                        fontSize: "0.925rem",
                        lineHeight: 1.6,
                        color: v.text,
                      }}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: "0.925rem",
                        lineHeight: 1.6,
                        color: v.text,
                      }}
                    >
                      {content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },

    Blockquote: {
      label: "Blockquote",
      fields: {
        quote: { type: "textarea", label: "Quote Text" },
        author: { type: "text", label: "Author / Attribution" },
        source: { type: "text", label: "Source (book, article, etc.)" },
        sourceUrl: { type: "text", label: "Source URL (optional)" },
        style: {
          type: "select",
          label: "Style",
          options: [
            { label: "Classic (left border)", value: "classic" },
            { label: "Large Quote Marks", value: "marks" },
            { label: "Centered", value: "centered" },
            { label: "Card", value: "card" },
          ],
        },
        accentColor: colorField("Accent Color"),
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        source: "",
        sourceUrl: "",
        style: "classic",
        accentColor: "#6366f1",
        maxWidth: "800px",
      },
      render: ({
                 quote,
                 author,
                 source,
                 sourceUrl,
                 style: bqStyle,
                 accentColor,
                 maxWidth,
               }: any) => {
        const attribution = (
          <footer style={{ marginTop: "12px", fontSize: "0.875rem" }}>
            {author && <strong style={{ color: "#374151" }}>— {author}</strong>}
            {source &&
              (sourceUrl ? (
                <span style={{ color: "#6b7280" }}>
                  ,{" "}
                  <a
                    href={sourceUrl}
                    style={{ color: accentColor, textDecoration: "underline" }}
                  >
                    {source}
                  </a>
                </span>
              ) : (
                <span style={{ color: "#6b7280" }}>, {source}</span>
              ))}
          </footer>
        )

        if (bqStyle === "marks") {
          return (
            <div style={{ padding: "0 24px", margin: "32px auto", maxWidth }}>
              <blockquote
                style={{ margin: 0, position: "relative", paddingLeft: "40px" }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "0",
                    fontSize: "4rem",
                    lineHeight: 1,
                    color: accentColor,
                    opacity: 0.3,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  "
                </span>
                <p
                  style={{
                    fontSize: "1.25rem",
                    lineHeight: 1.6,
                    color: "#374151",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  {quote}
                </p>
                {(author || source) && attribution}
              </blockquote>
            </div>
          )
        }

        if (bqStyle === "centered") {
          return (
            <div
              style={{
                padding: "40px 24px",
                margin: "32px auto",
                maxWidth,
                textAlign: "center",
              }}
            >
              <blockquote style={{ margin: 0 }}>
                <span
                  style={{
                    fontSize: "3rem",
                    lineHeight: 1,
                    color: accentColor,
                    opacity: 0.4,
                    display: "block",
                    marginBottom: "8px",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  "
                </span>
                <p
                  style={{
                    fontSize: "1.375rem",
                    lineHeight: 1.5,
                    color: "#374151",
                    fontStyle: "italic",
                    margin: "0 0 12px",
                    fontWeight: 500,
                  }}
                >
                  {quote}
                </p>
                {(author || source) && attribution}
              </blockquote>
            </div>
          )
        }

        if (bqStyle === "card") {
          return (
            <div style={{ padding: "0 24px", margin: "32px auto", maxWidth }}>
              <blockquote
                style={{
                  margin: 0,
                  padding: "24px 28px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    color: "#374151",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  {quote}
                </p>
                {(author || source) && attribution}
              </blockquote>
            </div>
          )
        }

        return (
          <div style={{ padding: "0 24px", margin: "32px auto", maxWidth }}>
            <blockquote
              style={{
                margin: 0,
                paddingLeft: "20px",
                borderLeft: `4px solid ${accentColor}`,
              }}
            >
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#374151",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                {quote}
              </p>
              {(author || source) && attribution}
            </blockquote>
          </div>
        )
      },
    },

    CodeBlock: {
      label: "Code Block",
      fields: {
        code: { type: "textarea", label: "Code" },
        language: {
          type: "select",
          label: "Language",
          options: [
            { label: "JavaScript", value: "javascript" },
            { label: "TypeScript", value: "typescript" },
            { label: "HTML", value: "html" },
            { label: "CSS", value: "css" },
            { label: "JSON", value: "json" },
            { label: "Bash / Shell", value: "bash" },
            { label: "Python", value: "python" },
            { label: "PHP", value: "php" },
            { label: "SQL", value: "sql" },
            { label: "GraphQL", value: "graphql" },
            { label: "YAML", value: "yaml" },
            { label: "Markdown", value: "markdown" },
            { label: "Plain Text", value: "text" },
          ],
        },
        filename: { type: "text", label: "Filename (optional, e.g. index.ts)" },
        showLineNumbers: {
          type: "radio",
          label: "Line Numbers",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        highlightLines: { type: "text", label: "Highlight Lines (e.g. 3,5-7)" },
        caption: { type: "text", label: "Caption (below code)" },
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        code: 'const greeting = "Hello, World!";\nconsole.log(greeting);',
        language: "javascript",
        filename: "",
        showLineNumbers: true,
        highlightLines: "",
        caption: "",
        maxWidth: "800px",
      },
      render: ({
                 code,
                 language,
                 filename,
                 showLineNumbers,
                 highlightLines,
                 caption,
                 maxWidth,
               }: any) => {
        const highlightSet = new Set<number>()
        if (highlightLines) {
          highlightLines.split(",").forEach((part: string) => {
            const p = part.trim()
            if (p.includes("-")) {
              const [start, end] = p.split("-").map(Number)
              for (let n = start; n <= end; n++) highlightSet.add(n)
            } else {
              highlightSet.add(Number(p))
            }
          })
        }
        const lines = code.split("\n")
        return (
          <div style={{ padding: "0 24px", margin: "24px auto", maxWidth }}>
            <div
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #374151",
              }}
            >
              <div
                style={{
                  backgroundColor: "#1e293b",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                      }}
                    />
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#f59e0b",
                      }}
                    />
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                      }}
                    />
                  </div>
                  {filename && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        marginLeft: "8px",
                        fontFamily: "monospace",
                      }}
                    >
                      {filename}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {language}
                </span>
              </div>
              <div
                style={{
                  backgroundColor: "#0f172a",
                  padding: "16px 0",
                  overflowX: "auto",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontFamily:
                      "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                  }}
                >
                  {lines.map((line: string, i: number) => {
                    const lineNum = i + 1
                    const isHighlighted = highlightSet.has(lineNum)
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          paddingRight: "16px",
                          backgroundColor: isHighlighted
                            ? "rgba(59,130,246,0.15)"
                            : "transparent",
                          borderLeft: isHighlighted
                            ? "3px solid #3b82f6"
                            : "3px solid transparent",
                        }}
                      >
                        {showLineNumbers && (
                          <span
                            style={{
                              display: "inline-block",
                              width: "48px",
                              textAlign: "right",
                              paddingRight: "16px",
                              color: isHighlighted ? "#60a5fa" : "#475569",
                              userSelect: "none",
                              flexShrink: 0,
                              fontSize: "0.8rem",
                            }}
                          >
                            {lineNum}
                          </span>
                        )}
                        {!showLineNumbers && (
                          <span style={{ width: "16px", flexShrink: 0 }} />
                        )}
                        <code style={{ color: "#e2e8f0", whiteSpace: "pre" }}>
                          {line || " "}
                        </code>
                      </div>
                    )
                  })}
                </pre>
              </div>
            </div>
            {caption && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                {caption}
              </p>
            )}
          </div>
        )
      },
    },

    ImageCaption: {
      label: "Image with Caption",
      fields: {
        src: imageField("Image"),
        alt: { type: "text", label: "Alt Text" },
        caption: { type: "text", label: "Caption" },
        credit: { type: "text", label: "Photo Credit / Source" },
        creditUrl: { type: "text", label: "Credit URL" },
        size: {
          type: "select",
          label: "Size",
          options: [
            { label: "Full Width (article)", value: "100%" },
            { label: "Large (90%)", value: "90%" },
            { label: "Medium (70%)", value: "70%" },
            { label: "Small (50%)", value: "50%" },
          ],
        },
        alignment: {
          type: "select",
          label: "Alignment",
          options: [
            { label: "Center", value: "center" },
            { label: "Left", value: "flex-start" },
            { label: "Right", value: "flex-end" },
          ],
        },
        borderRadius: { type: "text", label: "Border Radius" },
        shadow: {
          type: "radio",
          label: "Drop Shadow",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        border: {
          type: "radio",
          label: "Border",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        maxWidth: { type: "text", label: "Container Max Width" },
      },
      defaultProps: {
        src: "",
        alt: "Article image",
        caption: "",
        credit: "",
        creditUrl: "",
        size: "100%",
        alignment: "center",
        borderRadius: "8px",
        shadow: false,
        border: false,
        maxWidth: "800px",
      },
      render: ({
                 src,
                 alt,
                 caption,
                 credit,
                 creditUrl,
                 size,
                 alignment,
                 borderRadius,
                 shadow,
                 border,
                 maxWidth,
               }: any) => (
        <div style={{ padding: "0 24px", margin: "32px auto", maxWidth }}>
          <figure
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: alignment,
            }}
          >
            <div style={{ width: size }}>
              {src ? (
                <img
                  src={src}
                  alt={alt}
                  style={{
                    width: "100%",
                    display: "block",
                    borderRadius,
                    boxShadow: shadow ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
                    border: border ? "1px solid #e5e7eb" : "none",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "280px",
                    backgroundColor: "#f3f4f6",
                    borderRadius,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    border: border ? "1px solid #e5e7eb" : "1px dashed #d1d5db",
                  }}
                >
                  Add image URL
                </div>
              )}
              {(caption || credit) && (
                <figcaption
                  style={{
                    marginTop: "8px",
                    fontSize: "0.825rem",
                    color: "#6b7280",
                    lineHeight: 1.5,
                  }}
                >
                  {caption}
                  {caption && credit && " — "}
                  {credit &&
                    (creditUrl ? (
                      <a
                        href={creditUrl}
                        style={{
                          color: "#6b7280",
                          textDecoration: "underline",
                        }}
                      >
                        {credit}
                      </a>
                    ) : (
                      <span style={{ fontStyle: "italic" }}>{credit}</span>
                    ))}
                </figcaption>
              )}
            </div>
          </figure>
        </div>
      ),
    },

    AuthorBio: {
      label: "Author Bio",
      fields: {
        avatar: imageField("Avatar"),
        name: { type: "text", label: "Name" },
        role: { type: "text", label: "Role / Title" },
        bio: { type: "textarea", label: "Bio" },
        websiteUrl: { type: "text", label: "Website URL" },
        websiteLabel: { type: "text", label: "Website Label" },
        socialLinks: {
          type: "array",
          label: "Social Links",
          arrayFields: {
            platform: {
              type: "select",
              label: "Platform",
              options: [
                { label: "Twitter / X", value: "twitter" },
                { label: "LinkedIn", value: "linkedin" },
                { label: "GitHub", value: "github" },
                { label: "Instagram", value: "instagram" },
                { label: "Website", value: "website" },
              ],
            },
            url: { type: "text", label: "URL" },
          },
          defaultItemProps: { platform: "twitter", url: "" },
        },
        layout: {
          type: "select",
          label: "Layout",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical (centered)", value: "vertical" },
          ],
        },
        backgroundColor: colorField("Background Color"),
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        avatar: "",
        name: "John Doe",
        role: "Senior Writer",
        bio: "John is a writer and developer who covers technology, e-commerce, and automotive topics.",
        websiteUrl: "",
        websiteLabel: "",
        socialLinks: [],
        layout: "horizontal",
        backgroundColor: "#f9fafb",
        maxWidth: "800px",
      },
      render: ({
                 avatar,
                 name,
                 role,
                 bio,
                 websiteUrl,
                 websiteLabel,
                 socialLinks,
                 layout,
                 backgroundColor,
                 maxWidth,
               }: any) => {
        const socialIcons: Record<string, string> = {
          twitter: "𝕏",
          linkedin: "in",
          github: "GH",
          instagram: "IG",
          website: "🔗",
        }

        if (layout === "vertical") {
          return (
            <div style={{ padding: "0 24px", margin: "48px auto 0", maxWidth }}>
              <div
                style={{
                  backgroundColor,
                  borderRadius: "12px",
                  padding: "32px 24px",
                  border: "1px solid #e5e7eb",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    overflow: "hidden",
                    backgroundColor: "#e5e7eb",
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        color: "#9ca3af",
                      }}
                    >
                      {name.charAt(0)}
                    </div>
                  )}
                </div>
                <div
                  style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111" }}
                >
                  {name}
                </div>
                {role && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      marginTop: "2px",
                    }}
                  >
                    {role}
                  </div>
                )}
                {bio && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#374151",
                      lineHeight: 1.6,
                      margin: "12px auto 0",
                      maxWidth: "480px",
                    }}
                  >
                    {bio}
                  </p>
                )}
                {socialLinks.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "16px",
                      justifyContent: "center",
                    }}
                  >
                    {socialLinks.map((s: any, i: number) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#374151",
                          textDecoration: "none",
                        }}
                      >
                        {socialIcons[s.platform] || "?"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        }

        return (
          <div style={{ padding: "0 24px", margin: "48px auto 0", maxWidth }}>
            <div
              style={{
                backgroundColor,
                borderRadius: "12px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#e5e7eb",
                  flexShrink: 0,
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    {name.charAt(0)}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{ fontSize: "1rem", fontWeight: 700, color: "#111" }}
                  >
                    {name}
                  </span>
                  {role && (
                    <span style={{ fontSize: "0.825rem", color: "#6b7280" }}>
                      {role}
                    </span>
                  )}
                </div>
                {bio && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#374151",
                      lineHeight: 1.6,
                      margin: "8px 0 0",
                    }}
                  >
                    {bio}
                  </p>
                )}
                {(socialLinks.length > 0 || websiteUrl) && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {socialLinks.map((s: any, i: number) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "#374151",
                          textDecoration: "none",
                        }}
                      >
                        {socialIcons[s.platform] || "?"}
                      </a>
                    ))}
                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        style={{
                          fontSize: "0.825rem",
                          color: "#6366f1",
                          textDecoration: "underline",
                        }}
                      >
                        {websiteLabel || websiteUrl}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      },
    },

    RelatedPosts: {
      label: "Related Posts",
      fields: {
        heading: { type: "text", label: "Heading" },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
          ],
        },
        items: {
          type: "array",
          label: "Posts",
          arrayFields: {
            image: imageField("Image"),
            title: { type: "text", label: "Title" },
            excerpt: { type: "text", label: "Excerpt" },
            url: { type: "text", label: "Post URL" },
            category: { type: "text", label: "Category" },
            date: { type: "text", label: "Date" },
          },
          defaultItemProps: {
            image: "",
            title: "Related Post",
            excerpt: "",
            url: "/",
            category: "",
            date: "",
          },
        },
        showImage: {
          type: "radio",
          label: "Show Images",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        imageHeight: { type: "text", label: "Image Height" },
        backgroundColor: colorField("Background Color"),
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        heading: "Related Articles",
        columns: "3",
        items: [
          {
            image: "",
            title: "How to Choose the Right Brake Pads",
            excerpt:
              "A comprehensive guide to selecting brake pads for your vehicle.",
            url: "/blog/brake-pads",
            category: "Guides",
            date: "12 Mar 2025",
          },
          {
            image: "",
            title: "Top 10 Maintenance Tips for 2025",
            excerpt:
              "Keep your car running smoothly with these essential tips.",
            url: "/blog/maintenance-tips",
            category: "Tips",
            date: "8 Mar 2025",
          },
          {
            image: "",
            title: "Understanding OEM vs Aftermarket Parts",
            excerpt: "What you need to know before making your next purchase.",
            url: "/blog/oem-vs-aftermarket",
            category: "Education",
            date: "1 Mar 2025",
          },
        ],
        showImage: true,
        imageHeight: "180px",
        backgroundColor: "#f9fafb",
        maxWidth: "1000px",
      },
      render: ({
                 heading,
                 columns,
                 items,
                 showImage,
                 imageHeight,
                 backgroundColor,
                 maxWidth,
               }: any) => (
        <section
          style={{ padding: "48px 24px", backgroundColor, marginTop: "48px" }}
        >
          <div style={{ maxWidth, margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 28px",
                }}
              >
                {heading}
              </h2>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: "24px",
              }}
            >
              {items.map((item: any, i: number) => (
                <a
                  key={i}
                  href={item.url}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <article
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {showImage && (
                      <div
                        style={{
                          height: imageHeight,
                          backgroundColor: "#e5e7eb",
                          overflow: "hidden",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#9ca3af",
                              fontSize: "0.8rem",
                            }}
                          >
                            No image
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        padding: "16px 20px",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        {item.category && (
                          <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                            {item.category}
                          </span>
                        )}
                        {item.category && item.date && <span>·</span>}
                        {item.date && <span>{item.date}</span>}
                      </div>
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#111",
                          margin: "0 0 6px",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#6b7280",
                            margin: 0,
                            lineHeight: 1.5,
                            flex: 1,
                          }}
                        >
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    ArticleCTA: {
      label: "Article CTA",
      fields: {
        heading: { type: "text", label: "Heading" },
        description: { type: "textarea", label: "Description" },
        buttonText: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
        secondaryText: { type: "text", label: "Secondary Link Text" },
        secondaryLink: { type: "text", label: "Secondary Link URL" },
        icon: { type: "text", label: "Icon / Emoji (optional)" },
        style: {
          type: "select",
          label: "Style",
          options: [
            { label: "Banner (colored bg)", value: "banner" },
            { label: "Bordered Card", value: "card" },
            { label: "Minimal (inline)", value: "minimal" },
          ],
        },
        backgroundColor: colorField("Background Color"),
        textColor: colorField("Text Color"),
        buttonColor: colorField("Button Color"),
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        heading: "Need help finding the right part?",
        description:
          "Our team of experts is ready to help you find exactly what you need.",
        buttonText: "Contact Us",
        buttonLink: "/contact",
        secondaryText: "Browse Catalog",
        secondaryLink: "/products",
        icon: "🔧",
        style: "banner",
        backgroundColor: "#111827",
        textColor: "#ffffff",
        buttonColor: "#f97316",
        maxWidth: "800px",
      },
      render: ({
                 heading,
                 description,
                 buttonText,
                 buttonLink,
                 secondaryText,
                 secondaryLink,
                 icon,
                 style: ctaStyle,
                 backgroundColor,
                 textColor,
                 buttonColor,
                 maxWidth,
               }: any) => {
        if (ctaStyle === "minimal") {
          return (
            <div style={{ padding: "0 24px", margin: "32px auto", maxWidth }}>
              <div
                style={{
                  padding: "20px 0",
                  borderTop: "1px solid #e5e7eb",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <strong style={{ color: "#111", fontSize: "0.95rem" }}>
                    {icon && `${icon} `}
                    {heading}
                  </strong>
                  {description && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6b7280",
                        margin: "4px 0 0",
                      }}
                    >
                      {description}
                    </p>
                  )}
                </div>
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  {buttonText && (
                    <a
                      href={buttonLink}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: buttonColor,
                        color: "#fff",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                      }}
                    >
                      {buttonText}
                    </a>
                  )}
                  {secondaryText && (
                    <a
                      href={secondaryLink}
                      style={{
                        fontSize: "0.85rem",
                        color: buttonColor,
                        textDecoration: "underline",
                        fontWeight: 500,
                      }}
                    >
                      {secondaryText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        }

        if (ctaStyle === "card") {
          return (
            <div style={{ padding: "0 24px", margin: "32px auto", maxWidth }}>
              <div
                style={{
                  padding: "28px 32px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "#fff",
                  textAlign: "center",
                }}
              >
                {icon && (
                  <div style={{ fontSize: "2rem", marginBottom: "12px" }}>
                    {icon}
                  </div>
                )}
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#111",
                    margin: "0 0 8px",
                  }}
                >
                  {heading}
                </h3>
                {description && (
                  <p
                    style={{
                      fontSize: "0.925rem",
                      color: "#6b7280",
                      margin: "0 0 20px",
                      lineHeight: 1.5,
                    }}
                  >
                    {description}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {buttonText && (
                    <a
                      href={buttonLink}
                      style={{
                        padding: "12px 28px",
                        backgroundColor: buttonColor,
                        color: "#fff",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      {buttonText}
                    </a>
                  )}
                  {secondaryText && (
                    <a
                      href={secondaryLink}
                      style={{
                        padding: "12px 28px",
                        border: "1px solid #d1d5db",
                        color: "#374151",
                        borderRadius: "6px",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      {secondaryText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        }

        return (
          <div style={{ padding: "0 24px", margin: "32px auto", maxWidth }}>
            <div
              style={{
                padding: "32px",
                borderRadius: "12px",
                backgroundColor,
                textAlign: "center",
              }}
            >
              {icon && (
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>
                  {icon}
                </div>
              )}
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: textColor,
                  margin: "0 0 8px",
                }}
              >
                {heading}
              </h3>
              {description && (
                <p
                  style={{
                    fontSize: "0.925rem",
                    color: textColor,
                    opacity: 0.85,
                    margin: "0 0 24px",
                    lineHeight: 1.5,
                    maxWidth: "560px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {description}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {buttonText && (
                  <a
                    href={buttonLink}
                    style={{
                      padding: "12px 28px",
                      backgroundColor: buttonColor,
                      color: "#fff",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      textDecoration: "none",
                    }}
                  >
                    {buttonText}
                  </a>
                )}
                {secondaryText && (
                  <a
                    href={secondaryLink}
                    style={{
                      padding: "12px 28px",
                      backgroundColor: "transparent",
                      color: textColor,
                      borderRadius: "6px",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      border: `1px solid ${textColor}`,
                      opacity: 0.8,
                    }}
                  >
                    {secondaryText}
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      },
    },

    Timeline: {
      label: "Timeline",
      fields: {
        heading: { type: "text", label: "Section Heading" },
        items: {
          type: "array",
          label: "Steps",
          arrayFields: {
            title: { type: "text", label: "Title" },
            description: richTextField("Description"),
            date: { type: "text", label: "Date / Label (optional)" },
            icon: { type: "text", label: "Icon / Emoji" },
          },
          defaultItemProps: {
            title: "Step Title",
            description: "Description of this step.",
            date: "",
            icon: "",
          },
        },
        lineColor: colorField("Line Color"),
        dotColor: colorField("Dot Color"),
        layout: {
          type: "select",
          label: "Layout",
          options: [
            { label: "Left Aligned", value: "left" },
            { label: "Alternating", value: "alternating" },
          ],
        },
        showNumbers: {
          type: "radio",
          label: "Show Step Numbers",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        heading: "",
        items: [
          {
            title: "Choose Your Parts",
            description:
              "Browse our catalog of 100,000+ products and find exactly what you need.",
            date: "Step 1",
            icon: "🔍",
          },
          {
            title: "Place Your Order",
            description:
              "Add items to your cart and complete checkout with secure payment.",
            date: "Step 2",
            icon: "🛒",
          },
          {
            title: "Fast Delivery",
            description: "We ship same-day for orders placed before 2pm.",
            date: "Step 3",
            icon: "🚚",
          },
          {
            title: "Expert Support",
            description:
              "Our technical team is available to help with installation questions.",
            date: "Step 4",
            icon: "🔧",
          },
        ],
        lineColor: "#e5e7eb",
        dotColor: "#3b82f6",
        layout: "left",
        showNumbers: false,
        maxWidth: "800px",
      },
      render: ({
                 heading,
                 items,
                 lineColor,
                 dotColor,
                 layout,
                 showNumbers,
                 maxWidth,
               }: any) => (
        <section style={{ padding: "48px 24px" }}>
          <div style={{ maxWidth, margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 36px",
                  textAlign: layout === "alternating" ? "center" : "left",
                }}
              >
                {heading}
              </h2>
            )}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: layout === "alternating" ? "50%" : "15px",
                  transform:
                    layout === "alternating" ? "translateX(-50%)" : "none",
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  backgroundColor: lineColor,
                }}
              />
              {items.map((item: any, i: number) => {
                const isRight = layout === "alternating" && i % 2 === 1
                const dotEl = (
                  <div
                    style={{
                      position: "absolute",
                      left: layout === "alternating" ? "50%" : "0",
                      transform:
                        layout === "alternating" ? "translateX(-50%)" : "none",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: dotColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      fontSize: item.icon ? "0.9rem" : "0.7rem",
                      color: "#fff",
                      fontWeight: 700,
                      border: "3px solid #fff",
                      boxShadow: `0 0 0 2px ${lineColor}`,
                    }}
                  >
                    {item.icon || (showNumbers ? i + 1 : "")}
                  </div>
                )
                const contentEl = (
                  <div>
                    {item.date && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: dotColor,
                          marginBottom: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.date}
                      </div>
                    )}
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "#111",
                        margin: "0 0 6px",
                      }}
                    >
                      {showNumbers && !item.icon ? `${i + 1}. ` : ""}
                      {item.title}
                    </h3>
                    {typeof item.description === "string" ? (
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#6b7280",
                          lineHeight: 1.6,
                        }}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#6b7280",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                )
                if (layout === "alternating") {
                  return (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        display: "flex",
                        marginBottom: i < items.length - 1 ? "40px" : 0,
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingRight: "32px",
                          textAlign: "right",
                        }}
                      >
                        {!isRight && contentEl}
                      </div>
                      {dotEl}
                      <div style={{ width: "50%", paddingLeft: "32px" }}>
                        {isRight && contentEl}
                      </div>
                    </div>
                  )
                }
                return (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: i < items.length - 1 ? "36px" : 0,
                      paddingLeft: "48px",
                    }}
                  >
                    <div style={{ position: "absolute", left: 0, top: "2px" }}>
                      {dotEl}
                    </div>
                    {contentEl}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ),
    },

    // =============================================
    // HERO & HEADERS
    // =============================================
    Hero: {
      label: "Hero Section",
      fields: {
        title: { type: "text", label: "Headline" },
        subtitle: { type: "textarea", label: "Subtitle" },
        ctaText: { type: "text", label: "Button Text" },
        ctaLink: { type: "text", label: "Button Link" },
        secondaryCtaText: { type: "text", label: "Secondary Button Text" },
        secondaryCtaLink: { type: "text", label: "Secondary Button Link" },
        backgroundImage: { type: "text", label: "Background Image URL" },
        alignment: {
          type: "select",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        overlay: {
          type: "radio",
          label: "Dark Overlay",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        minHeight: { type: "text", label: "Min Height (e.g. 500px, 80vh)" },
      },
      defaultProps: {
        title: "Your Headline Here",
        subtitle: "Add a compelling subtitle to engage your visitors",
        ctaText: "Shop Now",
        ctaLink: "/products",
        secondaryCtaText: "",
        secondaryCtaLink: "",
        backgroundImage: "",
        alignment: "center",
        overlay: true,
        minHeight: "500px",
      },
      render: ({
                 title,
                 subtitle,
                 ctaText,
                 ctaLink,
                 secondaryCtaText,
                 secondaryCtaLink,
                 backgroundImage,
                 alignment,
                 overlay,
                 minHeight,
               }) => {
        const hasImg = !!backgroundImage
        const textColor = hasImg && overlay ? "#fff" : "#111"
        const subColor = hasImg && overlay ? "#e5e7eb" : "#6b7280"
        return (
          <section
            style={{
              padding: "80px 24px",
              textAlign: alignment,
              backgroundImage: hasImg ? `url(${backgroundImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: hasImg ? undefined : "#f3f4f6",
              position: "relative",
              minHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {overlay && hasImg && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              />
            )}
            <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: textColor,
                  margin: "0 0 16px",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h1>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: subColor,
                  margin: "0 0 32px",
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent:
                    alignment === "center"
                      ? "center"
                      : `flex-${alignment === "right" ? "end" : "start"}`,
                  flexWrap: "wrap",
                }}
              >
                {ctaText && (
                  <a
                    href={ctaLink}
                    style={{
                      display: "inline-block",
                      padding: "14px 36px",
                      backgroundColor: "#000",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    {ctaText}
                  </a>
                )}
                {secondaryCtaText && (
                  <a
                    href={secondaryCtaLink}
                    style={{
                      display: "inline-block",
                      padding: "14px 36px",
                      backgroundColor: "transparent",
                      color: textColor,
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "1rem",
                      border: `2px solid ${textColor}`,
                    }}
                  >
                    {secondaryCtaText}
                  </a>
                )}
              </div>
            </div>
          </section>
        )
      },
    },

    /**
     * HeroSplit — a hero with text on one side and image on the other.
     * Like the AboutUs template with a floating car image.
     */
    HeroSplit: {
      label: "Hero Split (Image + Text)",
      fields: {
        title: { type: "text", label: "Headline" },
        subtitle: { type: "text", label: "Subtitle" },
        paragraphs: { type: "textarea", label: "Body Content" },
        ctaText: { type: "text", label: "Button Text" },
        ctaLink: { type: "text", label: "Button Link" },
        imageSrc: { type: "text", label: "Image URL" },
        imageAlt: { type: "text", label: "Image Alt" },
        imagePosition: {
          type: "select",
          label: "Image Position",
          options: [
            { label: "Right", value: "right" },
            { label: "Left", value: "left" },
          ],
        },
        backgroundImage: {
          type: "text",
          label: "Background Image URL (optional)",
        },
        backgroundColor: colorField("Background Color"),
        textColor: colorField("Text Color"),
        minHeight: { type: "text", label: "Min Height (e.g. 600px, 80vh)" },
        imageContain: {
          type: "radio",
          label: "Image Fit",
          options: [
            { label: "Contain", value: true },
            { label: "Cover", value: false },
          ],
        },
        // ── Per-Element Animations ──
        ...elAnimFields("title"),
        ...elAnimFields("subtitle"),
        ...elAnimFields("body"),
        ...elAnimFields("image"),
        ...elAnimFields("cta"),
      },
      defaultProps: {
        title: "Η Δύναμή Μας Είσαστε Εσείς",
        subtitle: "Μην αφήνετε την αναζήτηση να σας καθυστερεί.",
        paragraphs:
          "<p>First paragraph text here.</p><p>Second paragraph text here.</p><p>Third paragraph with more details.</p>",
        ctaText: "",
        ctaLink: "/",
        imageSrc: "",
        imageAlt: "Hero image",
        imagePosition: "right",
        backgroundImage: "",
        backgroundColor: "#0D1B2A",
        textColor: "#ffffff",
        minHeight: "600px",
        imageContain: true,
        ...elAnimDefaults("title", "fadeInUp", "0.15", "0.8"),
        ...elAnimDefaults("subtitle", "fadeInUp", "0.3", "0.8"),
        ...elAnimDefaults("body", "fadeInUp", "0.45", "0.8"),
        ...elAnimDefaults("image", "fadeInRight", "0.3", "1", "float"),
        ...elAnimDefaults("cta", "fadeInUp", "0.6", "0.6"),
      },
      render: ({
                 title,
                 subtitle,
                 paragraphs,
                 ctaText,
                 ctaLink,
                 imageSrc,
                 imageAlt,
                 imagePosition,
                 backgroundImage,
                 backgroundColor,
                 textColor,
                 minHeight,
                 imageContain,
                 ...ap
               }: any) => {
        const subtitleColor =
          textColor === "#ffffff" ||
          textColor === "#fff" ||
          textColor === "white"
            ? "rgba(255,255,255,0.9)"
            : textColor
        const bodyColor =
          textColor === "#ffffff" ||
          textColor === "#fff" ||
          textColor === "white"
            ? "rgba(255,255,255,0.95)"
            : textColor
        const textEl = (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <AnimEl name="title" props={ap}>
              <h1
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  color: textColor,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h1>
            </AnimEl>
            {subtitle && (
              <AnimEl name="subtitle" props={ap}>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    color: subtitleColor,
                    margin: 0,
                  }}
                >
                  {subtitle}
                </p>
              </AnimEl>
            )}
            <AnimEl name="body" props={ap}>
              {typeof paragraphs === "string" ? (
                <div
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: bodyColor,
                  }}
                  dangerouslySetInnerHTML={{ __html: paragraphs }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: bodyColor,
                  }}
                >
                  {paragraphs}
                </div>
              )}
            </AnimEl>
            {ctaText && (
              <AnimEl name="cta" props={ap}>
                <a
                  href={ctaLink}
                  style={{
                    display: "inline-block",
                    padding: "14px 36px",
                    backgroundColor: "#fff",
                    color: "#000",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    alignSelf: "flex-start",
                    marginTop: "8px",
                  }}
                >
                  {ctaText}
                </a>
              </AnimEl>
            )}
          </div>
        )
        const imageEl = (
          <AnimEl name="image" props={ap}>
            <div
              style={{
                position: "relative",
                width: "100%",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: imageContain ? "contain" : "cover",
                    maxHeight: "600px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Add image URL
                </div>
              )}
            </div>
          </AnimEl>
        )
        return (
          <section
            style={{
              backgroundColor,
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
              minHeight,
            }}
          >
            <div
              style={{
                maxWidth: "1600px",
                margin: "0 auto",
                padding: "48px 24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "48px",
                alignItems: "center",
              }}
            >
              {imagePosition === "left" ? (
                <>
                  {imageEl}
                  {textEl}
                </>
              ) : (
                <>
                  {textEl}
                  {imageEl}
                </>
              )}
            </div>
          </section>
        )
      },
    },

    AnnouncementBar: {
      label: "Announcement Bar",
      fields: {
        text: { type: "text", label: "Announcement Text" },
        linkText: { type: "text", label: "Link Text (Optional)" },
        linkUrl: { type: "text", label: "Link URL" },
        backgroundColor: colorField("Background Color"),
        textColor: colorField("Text Color"),
      },
      defaultProps: {
        text: "🎉 Free shipping on orders over €50",
        linkText: "Shop now",
        linkUrl: "/products",
        backgroundColor: "#111827",
        textColor: "#ffffff",
      },
      render: ({ text, linkText, linkUrl, backgroundColor, textColor }) => (
        <div
          style={{
            padding: "10px 24px",
            backgroundColor,
            textAlign: "center",
            fontSize: "0.875rem",
            color: textColor,
          }}
        >
          {text}
          {linkText && (
            <a
              href={linkUrl}
              style={{
                color: textColor,
                marginLeft: "8px",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              {linkText}
            </a>
          )}
        </div>
      ),
    },

    PageHeader: {
      label: "Page Header",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
        breadcrumbs: { type: "text", label: "Breadcrumbs (comma separated)" },
        backgroundColor: colorField("Background Color"),
      },
      defaultProps: {
        title: "Page Title",
        subtitle: "",
        breadcrumbs: "Home, Shop, Category",
        backgroundColor: "#f9fafb",
      },
      render: ({ title, subtitle, breadcrumbs, backgroundColor }) => {
        const crumbs = breadcrumbs
          ? breadcrumbs.split(",").map((c: string) => c.trim())
          : []
        return (
          <section
            style={{
              padding: "40px 24px",
              backgroundColor,
              textAlign: "center",
            }}
          >
            {crumbs.length > 0 && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                  marginBottom: "12px",
                }}
              >
                {crumbs.map((c: string, i: number) => (
                  <span key={i}>
                    {i > 0 && <span style={{ margin: "0 6px" }}>/</span>}
                    <span
                      style={
                        i === crumbs.length - 1
                          ? { color: "#374151", fontWeight: 500 }
                          : {}
                      }
                    >
                      {c}
                    </span>
                  </span>
                ))}
              </div>
            )}
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#111",
                margin: "0 0 8px",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: "1rem", color: "#6b7280", margin: 0 }}>
                {subtitle}
              </p>
            )}
          </section>
        )
      },
    },

    // =============================================
    // LANDING PAGE
    // =============================================

    /**
     * SplitBanner — dark background section with image on one side, text on the other.
     * Like the AboutUs second section.
     */
    SplitBanner: {
      label: "Split Banner",
      fields: {
        imageSrc: { type: "text", label: "Image URL" },
        imageAlt: { type: "text", label: "Image Alt" },
        imagePosition: {
          type: "select",
          label: "Image Position",
          options: [
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
        imageHeight: { type: "text", label: "Image Height (e.g. 422px)" },
        paragraphs: { type: "textarea", label: "Body Content" },
        backgroundColor: colorField("Background Color"),
        textColor: colorField("Text Color"),
        maxWidth: { type: "text", label: "Max Width" },
        verticalPadding: { type: "text", label: "Vertical Padding" },
        // ── Per-Element Animations ──
        ...elAnimFields("image"),
        ...elAnimFields("text"),
      },
      defaultProps: {
        imageSrc: "",
        imageAlt: "Section image",
        imagePosition: "left",
        imageHeight: "422px",
        paragraphs:
          "<p>First paragraph of content.</p><p>Second paragraph continues here.</p><p>Third paragraph wraps it up.</p>",
        backgroundColor: "#0D1B2A",
        textColor: "#ffffff",
        maxWidth: "1600px",
        verticalPadding: "48px",
        ...elAnimDefaults("image", "fadeIn", "0", "0.8"),
        ...elAnimDefaults("text", "fadeInUp", "0.3", "0.8"),
      },
      render: ({
                 imageSrc,
                 imageAlt,
                 imagePosition,
                 imageHeight,
                 paragraphs,
                 backgroundColor,
                 textColor,
                 maxWidth,
                 verticalPadding,
                 ...ap
               }: any) => {
        const imageEl = (
          <AnimEl name="image" props={ap}>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: imageHeight,
                overflow: "hidden",
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Add image URL
                </div>
              )}
            </div>
          </AnimEl>
        )
        const textEl = (
          <AnimEl name="text" props={ap}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                justifyContent: "center",
              }}
            >
              {typeof paragraphs === "string" ? (
                <div
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: textColor,
                  }}
                  dangerouslySetInnerHTML={{ __html: paragraphs }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: textColor,
                  }}
                >
                  {paragraphs}
                </div>
              )}
            </div>
          </AnimEl>
        )
        return (
          <section style={{ backgroundColor }}>
            <div
              style={{
                maxWidth,
                margin: "0 auto",
                padding: `${verticalPadding} 24px`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "48px",
                alignItems: "start",
              }}
            >
              {imagePosition === "left" ? (
                <>
                  {imageEl}
                  {textEl}
                </>
              ) : (
                <>
                  {textEl}
                  {imageEl}
                </>
              )}
            </div>
          </section>
        )
      },
    },

    /**
     * FeatureCards — cards with accent border on the left, title + description.
     * Like the Dream Team section's feature blocks.
     */
    FeatureCards: {
      label: "Feature Cards (Accent Border)",
      fields: {
        heading: { type: "text", label: "Section Heading" },
        subheading: { type: "text", label: "Subheading" },
        headingColor: colorField("Heading Color"),
        imageSrc: { type: "text", label: "Section Image URL (optional)" },
        imageAlt: { type: "text", label: "Image Alt" },
        imagePosition: {
          type: "select",
          label: "Image Position",
          options: [
            { label: "Right", value: "right" },
            { label: "Left", value: "left" },
            {
              label: "None",
              value: "none",
            },
          ],
        },
        columns: {
          type: "select",
          label: "Cards Columns",
          options: [
            { label: "1 Column", value: "1" },
            { label: "2 Columns", value: "2" },
          ],
        },
        accentColor: colorField("Accent Bar Color"),
        backgroundColor: colorField("Background Color"),
        backgroundImage: { type: "text", label: "Background Image URL" },
        textColor: colorField("Text Color"),
        items: {
          type: "array",
          label: "Cards",
          arrayFields: {
            title: { type: "text", label: "Title" },
            body: { type: "textarea", label: "Body" },
          },
          defaultItemProps: {
            title: "Feature Title",
            body: "Feature description goes here.",
          },
        },
        // ── Per-Element Animations ──
        ...elAnimFields("heading"),
        ...elAnimFields("image"),
        cardAnimation: {
          type: "select" as const,
          label: "Card Entrance",
          options: animationSelectOptions,
        },
        cardStaggerDelay: {
          type: "text" as const,
          label: "Card Stagger Delay (s between each)",
        },
      },
      defaultProps: {
        heading: "Πίσω από την Τέλεια Εξυπηρέτηση",
        subheading: "Γνωρίστε την Dream Team",
        headingColor: "#f97316",
        imageSrc: "",
        imageAlt: "Section image",
        imagePosition: "right",
        columns: "2",
        accentColor: "#f97316",
        backgroundColor: "#0D1B2A",
        backgroundImage: "",
        textColor: "#ffffff",
        items: [
          {
            title: "Συνεργασία που εμπνέει",
            body: "Αυτό που κάνει την ομάδα μας ξεχωριστή είναι η εξαιρετική συνεργασία μεταξύ των τμημάτων.",
          },
          {
            title: "Αποστολές με ακρίβεια",
            body: "Κάθε παραγγελία φεύγει σωστά και στην ώρα της.",
          },
          {
            title: "Εξυπηρέτηση με ουσία",
            body: "Είμαστε εκεί για να ακούσουμε, να καταλάβουμε και να προτείνουμε λύσεις.",
          },
          {
            title: "Περήφανοι για την ομάδα",
            body: "Ένα πραγματικό παράδειγμα σύγχρονης επιχείρησης.",
          },
        ],
        ...elAnimDefaults("heading", "fadeInUp", "0", "0.6"),
        ...elAnimDefaults("image", "fadeIn", "0.2", "0.8"),
        cardAnimation: "fadeInUp",
        cardStaggerDelay: "0.15",
      },
      render: ({
                 heading,
                 subheading,
                 headingColor,
                 imageSrc,
                 imageAlt,
                 imagePosition,
                 columns,
                 accentColor,
                 backgroundColor,
                 backgroundImage,
                 textColor,
                 items,
                 ...ap
               }: any) => {
        const headerEl = (
          <div
            style={{
              marginBottom: "32px",
              display: "grid",
              gridTemplateColumns: imagePosition !== "none" ? "1fr 1fr" : "1fr",
              gap: "48px",
              alignItems: "start",
            }}
          >
            <AnimEl name="heading" props={ap}>
              <div>
                {heading && (
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: headingColor,
                      margin: "0 0 8px",
                    }}
                  >
                    {heading}
                  </h2>
                )}
                {subheading && (
                  <h3
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: textColor,
                      margin: 0,
                    }}
                  >
                    {subheading}
                  </h3>
                )}
              </div>
            </AnimEl>
            {imagePosition !== "none" && imageSrc && (
              <AnimEl name="image" props={ap}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "374px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </AnimEl>
            )}
          </div>
        )
        return (
          <section
            style={{
              backgroundColor,
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                maxWidth: "1600px",
                margin: "0 auto",
                padding: "48px 24px",
              }}
            >
              {headerEl}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: "32px",
                }}
              >
                {items.map((item: any, i: number) => (
                  <StaggerEl
                    key={i}
                    index={i}
                    animation={ap.cardAnimation || ""}
                    staggerDelay={parseFloat(ap.cardStaggerDelay || "0.15")}
                  >
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div
                        style={{
                          width: "4px",
                          backgroundColor: accentColor,
                          flexShrink: 0,
                          borderRadius: "2px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: textColor,
                            margin: "0 0 12px",
                          }}
                        >
                          {item.title}
                        </h4>
                        {typeof item.body === "string" ? (
                          <div
                            style={{
                              fontSize: "1rem",
                              lineHeight: 1.7,
                              color: textColor,
                              margin: 0,
                              opacity: 0.95,
                            }}
                            dangerouslySetInnerHTML={{ __html: item.body }}
                          />
                        ) : (
                          <div
                            style={{
                              fontSize: "1rem",
                              lineHeight: 1.7,
                              color: textColor,
                              margin: 0,
                              opacity: 0.95,
                            }}
                          >
                            {item.body}
                          </div>
                        )}
                      </div>
                    </div>
                  </StaggerEl>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    /**
     * MissionStrip — full-width colored band with two columns of text.
     * Like the mission/CTA section.
     */
    MissionStrip: {
      label: "Mission Strip",
      fields: {
        leftTitle: { type: "text", label: "Left Title" },
        leftSubtitle: { type: "text", label: "Left Subtitle" },
        rightText: { type: "textarea", label: "Right Text" },
        backgroundColor: colorField("Background Color"),
        textColor: colorField("Text Color"),
        verticalPadding: { type: "text", label: "Vertical Padding" },
        // ── Per-Element Animations ──
        ...elAnimFields("left"),
        ...elAnimFields("right"),
      },
      defaultProps: {
        leftTitle: "ΑΠΟΣΤΟΛΗ ΤΗΣ AUTONETPARTS",
        leftSubtitle: "Η αποστολή της AutoNetParts;",
        rightText:
          "Να δίνει στον επαγγελματία τη δύναμη της σωστής επιλογής — με προϊόντα, υπηρεσίες και τεχνολογία.",
        backgroundColor: "#f97316",
        textColor: "#ffffff",
        verticalPadding: "80px",
        ...elAnimDefaults("left", "fadeInLeft", "0", "0.6"),
        ...elAnimDefaults("right", "fadeInRight", "0.3", "0.6"),
      },
      render: ({
                 leftTitle,
                 leftSubtitle,
                 rightText,
                 backgroundColor,
                 textColor,
                 verticalPadding,
                 ...ap
               }: any) => (
        <section
          style={{ backgroundColor, padding: `${verticalPadding} 24px` }}
        >
          <div
            style={{
              maxWidth: "1600px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              alignItems: "center",
            }}
          >
            <AnimEl name="left" props={ap}>
              <div>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: textColor,
                    margin: "0 0 8px",
                    textTransform: "uppercase",
                  }}
                >
                  {leftTitle}
                </h2>
                {leftSubtitle && (
                  <p
                    style={{ fontSize: "1.25rem", color: textColor, margin: 0 }}
                  >
                    {leftSubtitle}
                  </p>
                )}
              </div>
            </AnimEl>
            <AnimEl name="right" props={ap}>
              <div
                style={{
                  fontSize: "1.25rem",
                  color: textColor,
                  lineHeight: 1.6,
                }}
              >
                {typeof rightText === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: rightText }} />
                ) : (
                  <div>{rightText}</div>
                )}
              </div>
            </AnimEl>
          </div>
        </section>
      ),
    },

    /**
     * ContentBlock — a rich content section with optional heading, body paragraphs,
     * and configurable background. Great for text-heavy landing page sections.
     */
    ContentBlock: {
      label: "Content Block",
      fields: {
        heading: { type: "text", label: "Heading" },
        headingSize: {
          type: "select",
          label: "Heading Size",
          options: [
            { label: "Small", value: "1.25rem" },
            { label: "Medium", value: "1.75rem" },
            { label: "Large", value: "2.25rem" },
            { label: "XL", value: "3rem" },
          ],
        },
        body: { type: "textarea", label: "Body Content" },
        textAlign: {
          type: "select",
          label: "Text Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
        backgroundColor: colorField("Background Color"),
        textColor: colorField("Text Color"),
        maxWidth: { type: "text", label: "Content Max Width" },
        verticalPadding: { type: "text", label: "Vertical Padding" },
      },
      defaultProps: {
        heading: "",
        headingSize: "1.75rem",
        body: "Your content goes here. Use the editor toolbar to format text.",
        textAlign: "left",
        backgroundColor: "transparent",
        textColor: "#374151",
        maxWidth: "800px",
        verticalPadding: "60px",
      },
      render: ({
                 heading,
                 headingSize,
                 body,
                 textAlign,
                 backgroundColor,
                 textColor,
                 maxWidth,
                 verticalPadding,
               }: any) => (
        <section
          style={{
            backgroundColor,
            padding: `${verticalPadding} 24px`,
            textAlign,
          }}
        >
          <div style={{ maxWidth, margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: headingSize,
                  fontWeight: 700,
                  color: textColor,
                  margin: "0 0 24px",
                  lineHeight: 1.2,
                }}
              >
                {heading}
              </h2>
            )}
            {typeof body === "string" ? (
              <div
                style={{ fontSize: "1rem", lineHeight: 1.7, color: textColor }}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <div
                style={{ fontSize: "1rem", lineHeight: 1.7, color: textColor }}
              >
                {body}
              </div>
            )}
          </div>
        </section>
      ),
    },

    /**
     * IconFeatureGrid — grid of features with large icons/emojis, title, description.
     * More visual than the existing Features block.
     */
    IconFeatureGrid: {
      label: "Icon Feature Grid",
      fields: {
        heading: { type: "text", label: "Section Heading" },
        subtitle: { type: "textarea", label: "Subtitle" },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
          ],
        },
        backgroundColor: colorField("Background Color"),
        textColor: colorField("Text Color"),
        accentColor: colorField("Icon Background"),
        items: {
          type: "array",
          label: "Features",
          arrayFields: {
            icon: { type: "text", label: "Emoji or Icon" },
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
          },
          defaultItemProps: {
            icon: "🚀",
            title: "Feature",
            description: "Description",
          },
        },
      },
      defaultProps: {
        heading: "Γιατί να μας επιλέξετε",
        subtitle: "",
        columns: "3",
        backgroundColor: "#0D1B2A",
        textColor: "#ffffff",
        accentColor: "rgba(249, 115, 22, 0.15)",
        items: [
          {
            icon: "⚡",
            title: "Ταχύτατη Αποστολή",
            description: "Αποστολή αυθημερόν για παραγγελίες μέχρι τις 2μμ.",
          },
          {
            icon: "🔧",
            title: "Τεχνική Υποστήριξη",
            description: "Εξειδικευμένη βοήθεια για κάθε ερώτηση.",
          },
          {
            icon: "✅",
            title: "Εγγύηση Ποιότητας",
            description: "Προϊόντα από τους κορυφαίους κατασκευαστές.",
          },
        ],
      },
      render: ({
                 heading,
                 subtitle,
                 columns,
                 backgroundColor,
                 textColor,
                 accentColor,
                 items,
               }: any) => (
        <section style={{ backgroundColor, padding: "80px 24px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: textColor,
                  textAlign: "center",
                  margin: "0 0 12px",
                }}
              >
                {heading}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: "1.1rem",
                  color: textColor,
                  opacity: 0.7,
                  textAlign: "center",
                  margin: "0 0 48px",
                  maxWidth: "600px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {subtitle}
              </p>
            )}
            {!subtitle && heading && <div style={{ marginBottom: "48px" }} />}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: "32px",
              }}
            >
              {items.map((item: any, i: number) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "16px",
                      backgroundColor: accentColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      margin: "0 auto 16px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: textColor,
                      margin: "0 0 8px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: textColor,
                      opacity: 0.8,
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    /**
     * FullWidthImage — edge-to-edge image with optional overlay text.
     */
    FullWidthImage: {
      label: "Full Width Image",
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        height: { type: "text", label: "Height (e.g. 400px, 50vh)" },
        overlayText: { type: "text", label: "Overlay Text (optional)" },
        overlayPosition: {
          type: "select",
          label: "Text Position",
          options: [
            { label: "Center", value: "center" },
            { label: "Bottom Left", value: "bottom-left" },
            { label: "Bottom Center", value: "bottom-center" },
          ],
        },
        overlayDarkness: {
          type: "select",
          label: "Overlay Darkness",
          options: [
            { label: "None", value: "0" },
            { label: "Light", value: "0.3" },
            { label: "Medium", value: "0.5" },
            { label: "Dark", value: "0.7" },
          ],
        },
      },
      defaultProps: {
        src: "",
        alt: "Full width image",
        height: "400px",
        overlayText: "",
        overlayPosition: "center",
        overlayDarkness: "0.3",
      },
      render: ({
                 src,
                 alt,
                 height,
                 overlayText,
                 overlayPosition,
                 overlayDarkness,
               }: any) => {
        const posStyles: Record<string, any> = {
          center: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          },
          "bottom-left": { bottom: "32px", left: "32px" },
          "bottom-center": {
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          },
        }
        return (
          <div
            style={{
              position: "relative",
              width: "100%",
              height,
              overflow: "hidden",
            }}
          >
            {src ? (
              <img
                src={src}
                alt={alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                }}
              >
                Add image URL
              </div>
            )}
            {Number(overlayDarkness) > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: `rgba(0,0,0,${overlayDarkness})`,
                }}
              />
            )}
            {overlayText && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 1,
                  maxWidth: "600px",
                  ...posStyles[overlayPosition],
                }}
              >
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {overlayText}
                </h2>
              </div>
            )}
          </div>
        )
      },
    },

    /**
     * ParallaxSection — section with a fixed background image and overlay content slot.
     */
    ParallaxSection: {
      label: "Parallax Section",
      fields: {
        content: { type: "slot" as const },
        backgroundImage: { type: "text", label: "Background Image URL" },
        backgroundColor: colorField("Fallback Background Color"),
        overlayDarkness: {
          type: "select",
          label: "Overlay Darkness",
          options: [
            { label: "None", value: "0" },
            { label: "Light", value: "0.3" },
            { label: "Medium", value: "0.5" },
            { label: "Dark", value: "0.7" },
            { label: "Very Dark", value: "0.85" },
          ],
        },
        minHeight: { type: "text", label: "Min Height" },
        verticalPadding: { type: "text", label: "Vertical Padding" },
      },
      defaultProps: {
        content: [],
        backgroundImage: "",
        backgroundColor: "#0D1B2A",
        overlayDarkness: "0.5",
        minHeight: "400px",
        verticalPadding: "80px",
      },
      render: ({
                 content: Content,
                 backgroundImage,
                 backgroundColor,
                 overlayDarkness,
                 minHeight,
                 verticalPadding,
               }: any) => (
        <section
          style={{
            position: "relative",
            minHeight,
            backgroundColor,
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        >
          {Number(overlayDarkness) > 0 && backgroundImage && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(0,0,0,${overlayDarkness})`,
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1200px",
              margin: "0 auto",
              padding: `${verticalPadding} 24px`,
            }}
          >
            <Content />
          </div>
        </section>
      ),
    },

    // =============================================
    // LAYOUT (all use Puck Slots for nesting)
    // =============================================

    /**
     * Section — a full-width wrapper that can contain any blocks.
     * Use for grouping content with a shared background/padding.
     */
    Section: {
      label: "Section",
      fields: {
        content: { type: "slot" as const },
        backgroundColor: colorField("Background Color"),
        backgroundImage: { type: "text", label: "Background Image URL" },
        backgroundSize: {
          type: "select",
          label: "Background Size",
          options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
            {
              label: "Auto",
              value: "auto",
            },
          ],
        },
        backgroundPosition: {
          type: "text",
          label: "Background Position (e.g. center, top left)",
        },
        backgroundOverlay: {
          type: "select",
          label: "Dark Overlay",
          options: [
            { label: "None", value: "0" },
            { label: "Light", value: "0.3" },
            { label: "Medium", value: "0.5" },
            { label: "Dark", value: "0.7" },
          ],
        },
        padding: { type: "text", label: "Padding (e.g. 60px 24px)" },
        maxWidth: {
          type: "text",
          label: "Inner Max Width (e.g. 1200px, none)",
        },
      },
      defaultProps: {
        content: [],
        backgroundColor: "transparent",
        backgroundImage: "",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundOverlay: "0",
        padding: "60px 24px",
        maxWidth: "1200px",
      },
      render: ({
                 content: Content,
                 backgroundColor,
                 backgroundImage,
                 backgroundSize,
                 backgroundPosition,
                 backgroundOverlay,
                 padding,
                 maxWidth,
               }: any) => (
        <section
          style={{
            backgroundColor,
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
            backgroundSize,
            backgroundPosition,
            backgroundRepeat: "no-repeat",
            position: "relative",
            padding,
          }}
        >
          {backgroundImage && Number(backgroundOverlay) > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(0,0,0,${backgroundOverlay})`,
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: maxWidth === "none" ? undefined : maxWidth,
              margin: "0 auto",
            }}
          >
            <Content />
          </div>
        </section>
      ),
    },

    /**
     * Two Columns — each column is a slot that accepts any blocks.
     */
    TwoColumns: {
      label: "Two Columns",
      fields: {
        left: { type: "slot" as const },
        right: { type: "slot" as const },
        split: {
          type: "select",
          label: "Column Split",
          options: [
            { label: "50 / 50", value: "50-50" },
            { label: "60 / 40", value: "60-40" },
            { label: "40 / 60", value: "40-60" },
            { label: "70 / 30", value: "70-30" },
            { label: "30 / 70", value: "30-70" },
          ],
        },
        verticalAlign: {
          type: "select",
          label: "Vertical Align",
          options: [
            { label: "Top", value: "top" },
            { label: "Center", value: "center" },
            {
              label: "Bottom",
              value: "bottom",
            },
          ],
        },
        gap: { type: "text", label: "Gap (e.g. 32px)" },
        maxHeight: { type: "text", label: "Max Height (e.g. 600px, 80vh)" },
        backgroundColor: colorField("Background Color"),
        backgroundImage: imageField("Background Image", {
          recommended: "1920 × 1080px",
        }),
        backgroundOverlay: {
          type: "select",
          label: "Dark Overlay",
          options: [
            { label: "None", value: "0" },
            { label: "Light", value: "0.3" },
            {
              label: "Medium",
              value: "0.5",
            },
            { label: "Dark", value: "0.7" },
          ],
        },
        reverseOnMobile: {
          type: "radio",
          label: "Stack & Reverse on Mobile",
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ],
        },
        itemRotate: {
          type: "number",
          label: "Item Rotate (deg)",
          min: -360,
          max: 360,
          step: 1,
        },
        itemScaleX: {
          type: "number",
          label: "Item Scale X",
          min: 0,
          max: 10,
          step: 0.01,
        },
        itemScaleY: {
          type: "number",
          label: "Item Scale Y",
          min: 0,
          max: 10,
          step: 0.01,
        },
        LeftItemMarginLeft: {
          type: "text",
          label: "Left Item Margin Left (e.g. 32px)",
        },
        LeftItemMarginRight: {
          type: "text",
          label: "Left Item Margin Right (e.g. 32px)",
        },
        LeftItemMarginTop: {
          type: "text",
          label: "Left Item Margin Top (e.g. 32px)",
        },
        LeftItemMarginBottom: {
          type: "text",
          label: "Left Item Margin Bottom (e.g. 32px)",
        },
        RightItemMarginLeft: {
          type: "text",
          label: "Right Item Margin Left (e.g. 32px)",
        },
        RightItemMarginRight: {
          type: "text",
          label: "Right Item Margin Right (e.g. 32px)",
        },
        RightItemMarginTop: {
          type: "text",
          label: "Right Item Margin Top (e.g. 32px)",
        },
        RightItemMarginBottom: {
          type: "text",
          label: "Right Item Margin Bottom (e.g. 32px)",
        },
      },
      defaultProps: {
        left: [],
        right: [],
        split: "50-50",
        verticalAlign: "top",
        gap: "32px",
        maxHeight: "",
        backgroundColor: "transparent",
        backgroundImage: "",
        backgroundOverlay: "0",
        reverseOnMobile: false,
        itemRotate: 0,
        itemScaleX: 1,
        itemScaleY: 1,
        LeftItemMarginLeft: "0",
        LeftItemMarginRight: "0",
        LeftItemMarginTop: "0",
        LeftItemMarginBottom: "0",
        RightItemMarginLeft: "0",
        RightItemMarginRight: "0",
        RightItemMarginTop: "0",
        RightItemMarginBottom: "0",
      },
      render: ({
                 left: Left,
                 right: Right,
                 split,
                 verticalAlign,
                 gap,
                 maxHeight,
                 backgroundColor,
                 backgroundImage,
                 backgroundOverlay,
                 reverseOnMobile,
                 itemRotate,
                 itemScaleX,
                 itemScaleY,
                 LeftItemMarginLeft,
                 LeftItemMarginRight,
                 LeftItemMarginTop,
                 LeftItemMarginBottom,
                 RightItemMarginLeft,
                 RightItemMarginRight,
                 RightItemMarginTop,
                 RightItemMarginBottom,
               }: any) => {
        const splits: Record<string, [string, string]> = {
          "50-50": ["1fr", "1fr"],
          "60-40": ["3fr", "2fr"],
          "40-60": ["2fr", "3fr"],
          "70-30": ["7fr", "3fr"],
          "30-70": ["3fr", "7fr"],
        }
        const [l, r] = splits[split] || splits["50-50"]
        const alignMap: Record<string, string> = {
          top: "flex-start",
          center: "center",
          bottom: "flex-end",
        }

        const ItemTransform = `rotate(${itemRotate}deg) scaleX(${itemScaleX}) scaleY(${itemScaleY})`

        return (
          <div
            style={{
              backgroundColor,
              position: "relative",
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              overflow: "hidden",
            }}
          >
            {backgroundImage && Number(backgroundOverlay) > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: `rgba(0,0,0,${backgroundOverlay})`,
                  zIndex: 0,
                }}
              />
            )}
            <div
              className={reverseOnMobile ? "puck-two-cols" : undefined}
              style={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: `${l} ${r}`,
                gap,
                padding: "80px 40px",
                alignItems: alignMap[verticalAlign],
                maxHeight: maxHeight || undefined,
                overflow: maxHeight ? "hidden" : undefined,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  transform: ItemTransform,
                  height: "100%",
                  marginLeft: LeftItemMarginLeft,
                  marginRight: LeftItemMarginRight,
                  marginTop: LeftItemMarginTop,
                  marginBottom: LeftItemMarginBottom,
                }}
              >
                <Left />
              </div>

              <div
                style={{
                  transform: ItemTransform,
                  height: "100%",
                  marginLeft: RightItemMarginLeft,
                  marginRight: RightItemMarginRight,
                  marginTop: RightItemMarginTop,
                  marginBottom: RightItemMarginBottom,
                }}
              >
                <Right />
              </div>
            </div>

            {reverseOnMobile && (
              <style>{`
                @media(max-width:768px){
                  .puck-two-cols { grid-template-columns: 1fr !important; gap: 40px !important; }
                  .puck-two-cols > div { transform: none !important; }
                  .puck-two-cols > div > div { transform: none !important; }
                  .puck-two-cols > :first-child { order: 2; }
                  .puck-two-cols > :last-child { order: 1; }
                }
              `}</style>
            )}
          </div>
        )
      },
    },

    /**
     * Three Columns — each column is a slot.
     */
    ThreeColumns: {
      label: "Three Columns",
      fields: {
        col1: { type: "slot" as const },
        col2: { type: "slot" as const },
        col3: { type: "slot" as const },
        gap: { type: "text", label: "Gap" },
        backgroundColor: colorField("Background Color"),
        backgroundImage: { type: "text", label: "Background Image URL" },
        backgroundOverlay: {
          type: "select",
          label: "Dark Overlay",
          options: [
            { label: "None", value: "0" },
            { label: "Light", value: "0.3" },
            {
              label: "Medium",
              value: "0.5",
            },
            { label: "Dark", value: "0.7" },
          ],
        },
      },
      defaultProps: {
        col1: [],
        col2: [],
        col3: [],
        gap: "32px",
        backgroundColor: "transparent",
        backgroundImage: "",
        backgroundOverlay: "0",
      },
      render: ({
                 col1: Col1,
                 col2: Col2,
                 col3: Col3,
                 gap,
                 backgroundColor,
                 backgroundImage,
                 backgroundOverlay,
               }: any) => (
        <div
          style={{
            backgroundColor,
            position: "relative",
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {backgroundImage && Number(backgroundOverlay) > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(0,0,0,${backgroundOverlay})`,
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap,
              padding: "40px 24px",
            }}
          >
            <Col1 />
            <Col2 />
            <Col3 />
          </div>
        </div>
      ),
    },

    /**
     * Flex — a flexbox container. Drag any blocks inside.
     * Great for horizontal layouts, centering, and spacing.
     */
    Flex: {
      label: "Flex Row",
      fields: {
        content: { type: "slot" as const },
        direction: {
          type: "select",
          label: "Direction",
          options: [
            { label: "Row", value: "row" },
            { label: "Column", value: "column" },
            { label: "Row Reverse", value: "row-reverse" },
            { label: "Column Reverse", value: "column-reverse" },
          ],
        },
        justifyContent: {
          type: "select",
          label: "Justify",
          options: [
            { label: "Start", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "End", value: "flex-end" },
            { label: "Space Between", value: "space-between" },
            { label: "Space Around", value: "space-around" },
            { label: "Space Evenly", value: "space-evenly" },
          ],
        },
        alignItems: {
          type: "select",
          label: "Align",
          options: [
            { label: "Stretch", value: "stretch" },
            { label: "Start", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "End", value: "flex-end" },
          ],
        },
        wrap: {
          type: "radio",
          label: "Wrap",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        gap: { type: "text", label: "Gap" },
      },
      defaultProps: {
        content: [],
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "stretch",
        wrap: true,
        gap: "16px",
      },
      render: ({
                 content: Content,
                 direction,
                 justifyContent,
                 alignItems,
                 wrap,
                 gap,
               }: any) => (
        <Content
          style={{
            display: "flex",
            flexDirection: direction,
            justifyContent,
            alignItems,
            flexWrap: wrap ? "wrap" : "nowrap",
            gap,
            padding: "20px 24px",
          }}
        />
      ),
    },

    /**
     * Grid — a CSS grid container. Drag any blocks inside.
     * Each child becomes a grid cell.
     */
    Grid: {
      label: "Grid",
      fields: {
        content: { type: "slot" as const },
        columns: {
          type: "text",
          label: "Columns (e.g. 3, repeat(auto-fit, minmax(250px, 1fr)))",
        },
        rows: { type: "text", label: "Rows (optional, e.g. auto, 200px 1fr)" },
        gap: { type: "text", label: "Gap" },
        stackOnSmall: {
          type: "radio",
          label: "Stack on small containers",
          options: [
            { label: "No", value: false },
            { label: "Yes (1 column)", value: true },
          ],
        },
      },
      defaultProps: {
        content: [],
        columns: "3",
        rows: "auto",
        gap: "24px",
        stackOnSmall: false,
      },
      render: ({ content: Content, columns, rows, gap, stackOnSmall }: any) => {
        // If columns is just a number, convert to repeat(n, 1fr)
        const gridCols = /^\d+$/.test(columns)
          ? `repeat(${columns}, 1fr)`
          : columns
        const stack = Boolean(stackOnSmall)
        const bp = "980px"
        const scope = `puck-grid-${Math.random().toString(36).slice(2, 8)}`
        return (
          <div style={{ containerType: "inline-size" } as any}>
            {stack ? (
              <style>{`@container (max-width: ${bp}) { .${scope}{grid-template-columns:1fr !important;} }`}</style>
            ) : null}
            <Content
              className={scope}
              style={{
                display: "grid",
                gridTemplateColumns: gridCols,
                gridTemplateRows: rows,
                gap,
                padding: "20px 24px",
              }}
            />
          </div>
        )
      },
    },

    /**
     * Container — a centered, max-width wrapper with a slot inside.
     */
    Container: {
      label: "Container",
      fields: {
        content: { type: "slot" as const },
        maxWidth: { type: "text", label: "Max Width (e.g. 1200px)" },
        padding: { type: "text", label: "Padding (e.g. 40px 24px)" },
        backgroundColor: colorField("Background Color"),
        gradientFrom: colorField("Gradient Background — FROM"),
        gradientVia: colorField("Gradient Background — VIA (optional)"),
        gradientTo: colorField("Gradient Background — TO"),
        gradientAngle: {
          type: "text",
          label: "Gradient angle (e.g. 180deg, 90deg)",
        },
        backgroundImage: imageField("Background Image", {
          recommended: "1920 × 1080px",
        }),
        backgroundOverlay: {
          type: "select",
          label: "Dark Overlay",
          options: [
            { label: "None", value: "0" },
            { label: "Light", value: "0.3" },
            {
              label: "Medium",
              value: "0.5",
            },
            { label: "Dark", value: "0.7" },
          ],
        },
      },
      defaultProps: {
        content: [],
        maxWidth: "1200px",
        padding: "40px 24px",
        backgroundColor: "transparent",
        gradientFrom: "",
        gradientVia: "",
        gradientTo: "",
        gradientAngle: "180deg",
        backgroundImage: "",
        backgroundOverlay: "0",
      },
      render: ({
                 content: Content,
                 maxWidth,
                 padding,
                 backgroundColor,
                 gradientFrom,
                 gradientVia,
                 gradientTo,
                 gradientAngle,
                 backgroundImage,
                 backgroundOverlay,
               }: any) =>
        (() => {
          const from = String(gradientFrom || "").trim()
          const via = String(gradientVia || "").trim()
          const to = String(gradientTo || "").trim()
          const ang = String(gradientAngle || "").trim() || "180deg"
          const hasGradient = Boolean(from && to)
          const gradientCss = hasGradient
            ? `linear-gradient(${ang}, ${from} 0%, ${
              via ? `${via} 50%, ` : ""
            }${to} 100%)`
            : undefined

          const bgImageCss = backgroundImage
            ? `url(${backgroundImage})`
            : undefined

          // Prefer image if provided; otherwise prefer gradient; otherwise fall back to solid color.
          const effectiveBackgroundImage = bgImageCss ?? gradientCss

          return (
            <div
              style={{
                backgroundColor: effectiveBackgroundImage
                  ? undefined
                  : backgroundColor,
                padding,
                position: "relative",
                backgroundImage: effectiveBackgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {backgroundImage && Number(backgroundOverlay) > 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: `rgba(0,0,0,${backgroundOverlay})`,
                  }}
                />
              )}
              <Content
                style={{
                  maxWidth,
                  margin: "0 auto",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>
          )
        })(),
    },

    Spacer: {
      label: "Spacer",
      fields: { height: { type: "text", label: "Height (e.g. 40px, 2rem)" } },
      defaultProps: { height: "40px" },
      render: ({ height }: any) => <div style={{ height }} />,
    },

    Divider: {
      label: "Divider",
      fields: {
        style: {
          type: "select",
          label: "Style",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
          ],
        },
        color: colorField("Color"),
        width: { type: "text", label: "Width (e.g. 100%, 60%)" },
        spacing: { type: "text", label: "Vertical Spacing" },
      },
      defaultProps: {
        style: "solid",
        color: "#e5e7eb",
        width: "100%",
        spacing: "32px",
      },
      render: ({ style: borderStyle, color, width, spacing }: any) => (
        <div style={{ padding: `${spacing} 24px` }}>
          <hr
            style={{
              border: "none",
              borderTop: `1px ${borderStyle} ${color}`,
              width,
              margin: "0 auto",
            }}
          />
        </div>
      ),
    },

    // =============================================
    // CONTENT
    // =============================================
    TextBlock: {
      label: "Text Block",
      fields: {
        heading: { type: "text", label: "Heading" },
        body: richTextField("Body Text"),
        maxWidth: { type: "text", label: "Max Width (e.g. 800px, 60ch, 100%)" },
        alignment: {
          type: "select",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        headingColor: colorField("Heading Color"),
        textColor: colorField("Text Color"),
      },
      defaultProps: {
        heading: "",
        body: "Enter your text here...",
        maxWidth: "800px",
        alignment: "left",
        headingColor: "#111",
        textColor: "#374151",
      },
      render: ({
                 heading,
                 body,
                 maxWidth,
                 alignment,
                 headingColor,
                 textColor,
               }: any) => (
        <div style={{ textAlign: alignment, color: textColor }}>
          <div style={{ maxWidth: maxWidth || "800px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: headingColor,
                  margin: "0 0 16px",
                }}
              >
                {heading}
              </h2>
            )}
            {typeof body === "string" ? (
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {body}
              </p>
            ) : (
              <div style={{ fontSize: "1rem", lineHeight: 1.7 }}>{body}</div>
            )}
          </div>
        </div>
      ),
    },

    /**
     * HighlightLinesText — multiline title/text where each line is composed of segments:
     * highlight part (h) + rest part (r), like LandingSkewSection Title lines.
     */
    HighlightLinesText: {
      label: "Highlight Lines Text",
      fields: {
        lines: {
          type: "array",
          label: "Lines",
          getItemSummary: (item: any) => {
            const segs = Array.isArray(item?.segments) ? item.segments : []
            return (
              segs
                .map((s: any) => `${s?.h || ""}${s?.r || ""}`)
                .join(" ")
                .trim() || "Line"
            )
          },
          arrayFields: {
            segments: {
              type: "array",
              label: "Segments",
              getItemSummary: (seg: any) => `${seg?.h || ""}${seg?.r || ""}`,
              arrayFields: {
                h: { type: "text", label: "Highlight (e.g. F)" },
                r: { type: "text", label: "Rest (e.g. RONT)" },
              },
            },
          },
        },

        highlightColor: colorField("Highlight color"),
        textColor: colorField("Default text color"),
        backgroundColor: colorField("Background color"),

        fontFamily: {
          type: "select",
          label: "Font family",
          options: [
            { label: "Default (inherit)", value: "" },
            {
              label: "System UI",
              value:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            { label: "Inter", value: "'Inter', sans-serif" },
            { label: "Geologica", value: "'Geologica', sans-serif" },
            { label: "Roboto", value: "'Roboto', sans-serif" },
            { label: "Open Sans", value: "'Open Sans', sans-serif" },
            { label: "Lato", value: "'Lato', sans-serif" },
            { label: "Poppins", value: "'Poppins', sans-serif" },
            { label: "Montserrat", value: "'Montserrat', sans-serif" },
            { label: "Playfair Display", value: "'Playfair Display', serif" },
            { label: "Merriweather", value: "'Merriweather', serif" },
            { label: "Georgia (serif)", value: "Georgia, serif" },
            {
              label: "Monospace",
              value: "'JetBrains Mono', 'Fira Code', monospace",
            },
          ],
        },
        highlightWeight: {
          type: "select",
          label: "Highlight weight",
          options: [
            { label: "300", value: "300" },
            { label: "400", value: "400" },
            { label: "500", value: "500" },
            { label: "600", value: "600" },
            { label: "700", value: "700" },
            { label: "800", value: "800" },
            { label: "900", value: "900" },
          ],
        },
        textWeight: {
          type: "select",
          label: "Text weight",
          options: [
            { label: "300", value: "300" },
            { label: "400", value: "400" },
            { label: "500", value: "500" },
            { label: "600", value: "600" },
            { label: "700", value: "700" },
            { label: "800", value: "800" },
            { label: "900", value: "900" },
          ],
        },
        highlightSize: { type: "text", label: "Highlight size (e.g. 60px)" },
        textSize: { type: "text", label: "Text size (e.g. 48px)" },
        lineHeight: { type: "text", label: "Line height (e.g. 1, 1.05, 1.2)" },
        lineGapX: { type: "text", label: "Gap X between segments (e.g. 8px)" },
        lineGapY: {
          type: "text",
          label: "Gap Y between wrapped segments (e.g. 4px)",
        },

        textTransform: {
          type: "select",
          label: "Text transform",
          options: [
            { label: "Uppercase", value: "uppercase" },
            { label: "None", value: "none" },
          ],
        },

        align: {
          type: "select",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        maxWidth: { type: "text", label: "Max width (e.g. 800px, 60ch, 100%)" },
        padding: { type: "text", label: "Padding (e.g. 40px 24px)" },
        margin: { type: "text", label: "Margin (e.g. 0 auto)" },
        borderRadius: { type: "text", label: "Border radius (e.g. 0, 8px)" },
      },
      defaultProps: {
        lines: [
          {
            segments: [
              { h: "F", r: "RONT" },
              { h: "B", r: "RAKE" },
              { h: "K", r: "ITS" },
            ],
          },
          {
            segments: [
              { h: "C", r: "USTOM" },
              { h: "S", r: "ERIES" },
            ],
          },
        ],
        highlightColor: "#FF5A01",
        textColor: "#111827",
        backgroundColor: "transparent",
        fontFamily: "",
        highlightWeight: "700",
        textWeight: "700",
        highlightSize: "60px",
        textSize: "48px",
        lineHeight: "1",
        lineGapX: "8px",
        lineGapY: "4px",
        textTransform: "uppercase",
        align: "left",
        maxWidth: "1600px",
        padding: "0px",
        margin: "0 auto",
        borderRadius: "0px",
      },
      render: ({
                 lines,
                 highlightColor,
                 textColor,
                 backgroundColor,
                 fontFamily,
                 highlightWeight,
                 textWeight,
                 highlightSize,
                 textSize,
                 lineHeight,
                 lineGapX,
                 lineGapY,
                 textTransform,
                 align,
                 maxWidth,
                 padding,
                 margin,
                 borderRadius,
               }: any) => {
        const scopeId = `hlt-${Math.random().toString(36).slice(2, 8)}`
        const hCol = String(highlightColor || "").trim() || "#FF5A01"
        const tCol = String(textColor || "").trim() || "#111827"
        const bg = String(backgroundColor || "").trim() || "transparent"
        const fam = String(fontFamily || "").trim()

        const hW = String(highlightWeight || "").trim() || "700"
        const tW = String(textWeight || "").trim() || "700"
        const hSz = String(highlightSize || "").trim() || "60px"
        const tSz = String(textSize || "").trim() || "48px"
        const lh = String(lineHeight || "").trim() || "1"
        const gx = String(lineGapX || "").trim() || "8px"
        const gy = String(lineGapY || "").trim() || "4px"
        const tr = String(textTransform || "").trim() || "uppercase"

        const al = String(align || "").trim() || "left"
        const mw = String(maxWidth || "").trim() || "1600px"
        const pad = String(padding || "").trim() || "0px"
        const mar = String(margin || "").trim() || "0 auto"
        const br = String(borderRadius || "").trim() || "0px"

        const justify =
          al === "center"
            ? "center"
            : al === "right"
              ? "flex-end"
              : "flex-start"

        return (
          <div
            style={{
              backgroundColor: bg,
              maxWidth: mw === "none" ? undefined : mw,
              padding: pad,
              margin: mar,
              borderRadius: br,
              textAlign: al as any,
              fontFamily: fam || undefined,
            }}
          >
            <style>{`
.${scopeId}-h{color:${hCol} !important;font-size:${hSz} !important;font-weight:${hW} !important;line-height:${lh} !important;}
.${scopeId}-r{color:${tCol} !important;font-size:${tSz} !important;font-weight:${tW} !important;line-height:${lh} !important;text-transform:${tr} !important;}
            `}</style>
            <div className="flex flex-col">
              {Array.isArray(lines) &&
                lines.map((line: any, lineIdx: number) => (
                  <div
                    key={lineIdx}
                    className="flex flex-wrap items-baseline"
                    style={{
                      justifyContent: justify,
                      columnGap: gx,
                      rowGap: gy,
                    }}
                  >
                    {(Array.isArray(line?.segments) ? line.segments : []).map(
                      (seg: any, segIdx: number) => (
                        <span
                          key={segIdx}
                          className="inline-flex items-baseline"
                        >
                          <span className={`${scopeId}-h`}>{seg?.h}</span>
                          <span className={`${scopeId}-r`}>{seg?.r}</span>
                        </span>
                      )
                    )}
                  </div>
                ))}
            </div>
          </div>
        )
      },
    },

    ImageBanner: {
      label: "Image Banner",
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        caption: { type: "text", label: "Caption (Optional)" },
        fullWidth: {
          type: "radio",
          label: "Full Width",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        maxHeight: { type: "text", label: "Max Height (e.g. 400px)" },
        borderRadius: { type: "text", label: "Border Radius (e.g. 8px)" },
      },
      defaultProps: {
        src: "",
        alt: "",
        caption: "",
        fullWidth: true,
        maxHeight: "400px",
        borderRadius: "0",
      },
      render: ({ src, alt, caption, fullWidth, maxHeight, borderRadius }) => (
        <figure style={{ margin: 0, padding: fullWidth ? 0 : "0 24px" }}>
          {src ? (
            <img
              src={src}
              alt={alt}
              style={{
                width: "100%",
                maxHeight,
                objectFit: "cover",
                display: "block",
                borderRadius,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                borderRadius,
              }}
            >
              Add an image URL
            </div>
          )}
          {caption && (
            <figcaption
              style={{
                textAlign: "center",
                padding: "12px 24px",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      ),
    },

    ImageText: {
      label: "Image + Text",
      fields: {
        imageSrc: imageField("Image"),
        imageAlt: { type: "text", label: "Image Alt" },
        heading: { type: "text", label: "Heading" },
        body: richTextField("Body"),
        ctaText: { type: "text", label: "Button Text" },
        ctaLink: { type: "text", label: "Button Link" },
        textBackgroundColor: colorField("Text Background"),
        textColor: colorField("Text Color"),
        textPadding: { type: "text", label: "Text Padding (e.g. 24px)" },
        textFontSize: {
          type: "text",
          label: "Text font size (e.g. 16px, 1rem)",
        },
        textSkewX: {
          type: "number",
          label: "Text skew X (deg)",
          min: 0,
          max: 180,
          step: 1,
        },
        textSkewY: {
          type: "number",
          label: "Text skew Y (deg)",
          min: 0,
          max: 180,
          step: 1,
        },
        textScale: {
          type: "number",
          label: "Text scale",
          min: 0.1,
          max: 5,
          step: 0.01,
        },
        imageMargin: { type: "text", label: "Image margin (CSS shorthand)" },
        textMargin: { type: "text", label: "Text margin (CSS shorthand)" },
        textResponsive1FontSize: {
          type: "text",
          label: "Text responsive (< 1200px) — font size (optional)",
        },
        textResponsive1Padding: {
          type: "text",
          label: "Text responsive (< 1200px) — padding (optional)",
        },
        textResponsive1Margin: {
          type: "text",
          label: "Text responsive (< 1200px) — margin (optional)",
        },
        textResponsive2FontSize: {
          type: "text",
          label: "Text responsive (< 780px) — font size (optional)",
        },
        textResponsive2Padding: {
          type: "text",
          label: "Text responsive (< 780px) — padding (optional)",
        },
        textResponsive2Margin: {
          type: "text",
          label: "Text responsive (< 780px) — margin (optional)",
        },
        textOuterMinWidth: {
          type: "text",
          label: "Text outer min-width (e.g. 0, 320px, 40ch)",
        },
        textResponsive1OuterMinWidth: {
          type: "text",
          label: "Text outer min-width responsive (< 1200px) (optional)",
        },
        textResponsive2OuterMinWidth: {
          type: "text",
          label: "Text outer min-width responsive (< 780px) (optional)",
        },
        popupOnClick: {
          type: "radio",
          label: "Open popup on click",
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ],
        },
        popupId: popupSelectField("Popup"),
        popupTrigger: {
          type: "select",
          label: "Popup trigger",
          options: [
            { label: "Text & image", value: "both" },
            { label: "Image only", value: "image" },
            { label: "Text only", value: "text" },
            { label: "Button", value: "button" },
          ],
        },
        gap: { type: "text", label: "Gap between image & text (e.g. 16px)" },
        sectionPadding: {
          type: "text",
          label: "Section padding (e.g. 60px 24px)",
        },
        forceSingleLine: {
          type: "radio",
          label: "Force same line (no wrap)",
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ],
        },
        singleLineOverflow: {
          type: "select",
          label: "Single-line overflow",
          options: [
            { label: "Ellipsis (clip)", value: "ellipsis" },
            { label: "Horizontal scroll", value: "scroll" },
            { label: "Visible (may overflow layout)", value: "visible" },
          ],
        },
        imageMinHeight: {
          type: "text",
          label: "Image min height (e.g. 220px)",
        },
        imagePosition: {
          type: "select",
          label: "Image Position",
          options: [
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
        imageRatio: {
          type: "select",
          label: "Image Size",
          options: [
            { label: "Equal", value: "1fr 1fr" },
            { label: "Image Larger", value: "3fr 2fr" },
            { label: "Text Larger", value: "2fr 3fr" },
          ],
        },
      },
      defaultProps: {
        imageSrc: "",
        imageAlt: "",
        heading: "Heading",
        body: "Description text goes here.",
        ctaText: "",
        ctaLink: "",
        imagePosition: "left",
        imageRatio: "1fr 1fr",
        textBackgroundColor: "transparent",
        textColor: "#111111",
        textPadding: "0",
        textFontSize: "",
        textSkewX: 0,
        textSkewY: 0,
        textScale: 1,
        imageMargin: "0",
        textMargin: "0",
        textResponsive1FontSize: "",
        textResponsive1Padding: "",
        textResponsive1Margin: "",
        textResponsive2FontSize: "",
        textResponsive2Padding: "",
        textResponsive2Margin: "",
        textOuterMinWidth: "0",
        textResponsive1OuterMinWidth: "",
        textResponsive2OuterMinWidth: "",
        popupOnClick: false,
        popupId: "",
        popupTrigger: "both",
        forceSingleLine: false,
        singleLineOverflow: "ellipsis",
        imageMinHeight: "220px",
      },
      render: (props: any) => {
        return <ImageTextComponent {...props} />
      },
    },

    PopupDefinition: {
      label: "Popup Definition",
      fields: {
        id: { type: "text", label: "ID (unique)" },
        name: { type: "text", label: "Name" },
        content: { type: "slot" as const },
        overlayColor: { type: "text", label: "Overlay color (rgba...)" },
        overlayBlur: { type: "text", label: "Overlay blur (e.g. 6px)" },
        align: {
          type: "select",
          label: "Align",
          options: [
            { label: "Center", value: "center" },
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
          ],
        },
        maxWidth: { type: "text", label: "Max width (e.g. 860px)" },
        padding: { type: "text", label: "Padding (e.g. 24px)" },
        background: colorField("Background"),
        backgroundImage: imageField("Background Image", {
          recommended: "1600 × 900px",
        }),
        backgroundOverlayOpacity: {
          type: "text",
          label:
            "Background overlay opacity (0-1). Uses Background color as overlay when image is set.",
        },
        color: colorField("Text color"),
        borderRadius: { type: "text", label: "Border radius (e.g. 14px)" },
        boxShadow: { type: "text", label: "Box shadow (CSS)" },
        scrollbarSize: {
          type: "text",
          label: "Scrollbar size (e.g. 10px or thin/auto/none for Firefox)",
        },
        scrollbarThumbColor: colorField("Scrollbar thumb color"),
        scrollbarTrackColor: colorField("Scrollbar track color"),
        scrollbarThumbRadius: {
          type: "text",
          label: "Scrollbar thumb radius (e.g. 999px)",
        },
        closeButtonColor: colorField("Close button color"),
        closeButtonBackground: colorField("Close button background"),
        closeButtonFontSize: {
          type: "text",
          label: "Close button size (e.g. 22px, 1.5rem)",
        },
        closeButtonPadding: {
          type: "text",
          label: "Close button padding (e.g. 6px 8px)",
        },
        closeButtonBorderRadius: {
          type: "text",
          label: "Close button border radius (e.g. 999px)",
        },
      },
      defaultProps: {
        id: "popup-1",
        name: "Popup 1",
        content: [],
        overlayColor: "rgba(0,0,0,0.55)",
        overlayBlur: "",
        align: "center",
        maxWidth: "860px",
        padding: "24px",
        background: "#ffffff",
        backgroundImage: "",
        backgroundOverlayOpacity: "0.35",
        color: "#111111",
        borderRadius: "14px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        scrollbarSize: "",
        scrollbarThumbColor: "",
        scrollbarTrackColor: "",
        scrollbarThumbRadius: "",
        closeButtonColor: "",
        closeButtonBackground: "",
        closeButtonFontSize: "22px",
        closeButtonPadding: "6px 8px",
        closeButtonBorderRadius: "",
      },
      render: ({
                 id,
                 name,
                 content: Content,
                 overlayColor,
                 overlayBlur,
                 align,
                 maxWidth,
                 padding,
                 background,
                 backgroundImage,
                 backgroundOverlayOpacity,
                 color,
                 borderRadius,
                 boxShadow,
                 scrollbarSize,
                 scrollbarThumbColor,
                 scrollbarTrackColor,
                 scrollbarThumbRadius,
                 closeButtonColor,
                 closeButtonBackground,
                 closeButtonFontSize,
                 closeButtonPadding,
                 closeButtonBorderRadius,
               }: any) => {
        const popupId = String(id || "").trim()
        React.useEffect(() => {
          if (!popupId) return
          registerPopup({
            id: popupId,
            name: String(name || popupId),
            Content: typeof Content === "function" ? Content : () => null,
            style: {
              overlayColor,
              overlayBlur,
              align,
              maxWidth,
              padding,
              background,
              backgroundImage,
              backgroundOverlayOpacity,
              color,
              borderRadius,
              boxShadow,
              scrollbarSize,
              scrollbarThumbColor,
              scrollbarTrackColor,
              scrollbarThumbRadius,
              closeButtonColor,
              closeButtonBackground,
              closeButtonFontSize,
              closeButtonPadding,
              closeButtonBorderRadius,
            },
          })
          return () => unregisterPopup(popupId)
        }, [
          popupId,
          name,
          Content,
          overlayColor,
          overlayBlur,
          align,
          maxWidth,
          padding,
          background,
          backgroundImage,
          backgroundOverlayOpacity,
          color,
          borderRadius,
          boxShadow,
          scrollbarSize,
          scrollbarThumbColor,
          scrollbarTrackColor,
          scrollbarThumbRadius,
          closeButtonColor,
          closeButtonBackground,
          closeButtonFontSize,
          closeButtonPadding,
          closeButtonBorderRadius,
        ])

        const isEditor =
          typeof window !== "undefined" &&
          window.location.pathname.includes("/editor")
        const markerRef = React.useRef<HTMLSpanElement>(null)

        React.useEffect(() => {
          if (isEditor) return
          const el = markerRef.current
          if (!el) return

          const hidden: Array<{ el: HTMLElement; prev: string }> = []
          let current: HTMLElement | null = el.parentElement
          // Walk up while this popup is the sole descendant of the ancestor
          while (current && current !== document.body) {
            const onlyChild =
              current.children.length === 1 && current.children[0].contains(el)
            if (!onlyChild) break
            hidden.push({ el: current, prev: current.style.display })
            current = current.parentElement
          }
          hidden.forEach(({ el: h }) => {
            h.style.display = "none"
          })

          return () => {
            hidden.forEach(({ el: h, prev }) => {
              h.style.display = prev
            })
          }
        }, [isEditor, popupId])

        if (!isEditor) {
          return (
            <span
              ref={markerRef}
              data-popup-marker={popupId}
              style={{ display: "none" }}
            />
          )
        }
        // if (!isEditor) {
        //   return <div style={{ display: "none" }}>{typeof Content === "function" ? <Content /> : null}</div>
        // }

        return (
          <div style={{ margin: "12px 0" }}>
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                background: "#ffffff",
                overflow: "hidden",
              }}
            >
              {typeof Content === "function" ? <Content /> : null}
            </div>
          </div>
        )
      },
    },

    VideoEmbed: {
      label: "Video Embed",
      fields: {
        url: { type: "text", label: "YouTube/Vimeo URL" },
        aspectRatio: {
          type: "select",
          label: "Aspect Ratio",
          options: [
            { label: "16:9", value: "56.25%" },
            { label: "4:3", value: "75%" },
            { label: "1:1", value: "100%" },
          ],
        },
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: { url: "", aspectRatio: "56.25%", maxWidth: "800px" },
      render: ({ url, aspectRatio, maxWidth }) => {
        let embedUrl = url
        const ytMatch = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
        )
        if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
        if (vimeoMatch)
          embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
        return (
          <div style={{ padding: "40px 24px" }}>
            <div
              style={{
                maxWidth,
                margin: "0 auto",
                position: "relative",
                paddingBottom: aspectRatio,
                height: 0,
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                  }}
                >
                  Paste a YouTube or Vimeo URL
                </div>
              )}
            </div>
          </div>
        )
      },
    },

    Accordion: {
      label: "FAQ / Accordion",
      fields: {
        heading: { type: "text", label: "Section Heading" },
        items: {
          type: "array",
          label: "Items",
          arrayFields: {
            question: { type: "text", label: "Question" },
            answer: { type: "textarea", label: "Answer" },
          },
          defaultItemProps: {
            question: "Frequently asked question?",
            answer: "Answer goes here.",
          },
        },
      },
      defaultProps: {
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy on all items.",
          },
          {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days.",
          },
          {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to over 50 countries worldwide.",
          },
        ],
      },
      render: ({ heading, items }) => (
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "0 0 32px",
                  color: "#111",
                }}
              >
                {heading}
              </h2>
            )}
            {items.map((item: any, i: number) => (
              <details
                key={i}
                style={{ borderBottom: "1px solid #e5e7eb", padding: "16px 0" }}
              >
                <summary
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#111",
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {item.question}
                  <span style={{ fontSize: "1.25rem", color: "#9ca3af" }}>
                    +
                  </span>
                </summary>
                {typeof item.answer === "string" ? (
                  <div
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "#6b7280",
                      margin: "12px 0 0",
                    }}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "#6b7280",
                      margin: "12px 0 0",
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </details>
            ))}
          </div>
        </section>
      ),
    },

    ListBlock: {
      label: "List",
      fields: {
        items: {
          type: "array",
          label: "Items",
          getItemSummary: (item: any) => String(item?.text || "Item"),
          arrayFields: {
            text: richTextField("Text"),
          },
          defaultItemProps: { text: "List item" },
        },

        // Bullet styling
        bulletStyle: {
          type: "select",
          label: "Bullet style",
          options: [
            { label: "Dot", value: "dot" },
            { label: "Hollow dot", value: "hollow-dot" },
            { label: "Square", value: "square" },
            { label: "Dash", value: "dash" },
            { label: "None", value: "none" },
          ],
        },
        bulletSize: { type: "text", label: "Bullet size (e.g. 8px)" },
        bulletColor: colorField("Bullet color"),
        bulletGap: { type: "text", label: "Gap bullet → text (e.g. 12px)" },

        // Text styling
        fontFamily: {
          type: "select",
          label: "Font family",
          options: [
            { label: "Default (inherit)", value: "" },
            {
              label: "System UI",
              value:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            { label: "Inter", value: "'Inter', sans-serif" },
            { label: "Geologica", value: "'Geologica', sans-serif" },
            { label: "Roboto", value: "'Roboto', sans-serif" },
            { label: "Open Sans", value: "'Open Sans', sans-serif" },
            { label: "Lato", value: "'Lato', sans-serif" },
            { label: "Poppins", value: "'Poppins', sans-serif" },
            { label: "Montserrat", value: "'Montserrat', sans-serif" },
            { label: "Georgia (serif)", value: "Georgia, serif" },
            {
              label: "Monospace",
              value: "'JetBrains Mono', 'Fira Code', monospace",
            },
          ],
        },
        textColor: colorField("Text color"),
        fontSize: { type: "text", label: "Font size (e.g. 16px)" },
        fontWeight: {
          type: "select",
          label: "Font weight",
          options: [
            { label: "300", value: "300" },
            { label: "400", value: "400" },
            { label: "500", value: "500" },
            { label: "600", value: "600" },
            { label: "700", value: "700" },
          ],
        },
        lineHeight: { type: "text", label: "Line height (e.g. 1.6)" },
        itemGap: { type: "text", label: "Gap between items (e.g. 10px)" },

        // Layout
        maxWidth: { type: "text", label: "Max width (e.g. 820px)" },
        paddingY: { type: "text", label: "Padding Y (e.g. 24px)" },
        paddingX: { type: "text", label: "Padding X (e.g. 24px)" },
      },
      defaultProps: {
        items: [
          { text: "First item" },
          { text: "Second item" },
          { text: "Third item" },
        ],
        bulletStyle: "dot",
        bulletSize: "8px",
        bulletColor: "#111111",
        bulletGap: "12px",
        fontFamily: "",
        textColor: "#111111",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "1.7",
        itemGap: "10px",
        maxWidth: "820px",
        paddingY: "24px",
        paddingX: "24px",
      },
      render: ({
                 items,
                 bulletStyle,
                 bulletSize,
                 bulletColor,
                 bulletGap,
                 fontFamily,
                 textColor,
                 fontSize,
                 fontWeight,
                 lineHeight,
                 itemGap,
                 maxWidth,
                 paddingY,
                 paddingX,
               }: any) => {
        const scopeId = `lb-${Math.random().toString(36).slice(2, 8)}`
        const safeItems = Array.isArray(items) ? items : []
        const bs = String(bulletSize || "").trim() || "8px"
        const bg = String(bulletGap || "").trim() || "12px"
        const ig = String(itemGap || "").trim() || "10px"
        const mw = String(maxWidth || "").trim() || "820px"
        const py = String(paddingY || "").trim() || "24px"
        const px = String(paddingX || "").trim() || "24px"

        const fam = String(fontFamily || "").trim()
        const c = String(textColor || "").trim() || "#111111"
        const fz = String(fontSize || "").trim() || "16px"
        const fw = String(fontWeight || "").trim() || "400"
        const lh = String(lineHeight || "").trim() || "1.7"

        const bullet = (style: string) => {
          if (style === "none") return null

          const base: React.CSSProperties = {
            flex: "0 0 auto",
            marginTop: "0.4em",
            color: bulletColor || "#111",
          }

          if (style === "dash") {
            return (
              <span
                aria-hidden="true"
                style={{
                  ...base,
                  width: `calc(${bs} * 1.6)`,
                  height: "2px",
                  backgroundColor: bulletColor || "#111",
                  borderRadius: "999px",
                }}
              />
            )
          }

          const isSquare = style === "square"
          const isHollow = style === "hollow-dot"
          return (
            <span
              aria-hidden="true"
              style={{
                ...base,
                width: bs,
                height: bs,
                borderRadius: isSquare ? "2px" : "999px",
                backgroundColor: isHollow
                  ? "transparent"
                  : bulletColor || "#111",
                border: isHollow
                  ? `2px solid ${bulletColor || "#111"}`
                  : "none",
                boxSizing: "border-box",
              }}
            />
          )
        }

        return (
          <div style={{ padding: `${py} ${px}` }}>
            <div style={{ maxWidth: mw, margin: "0 auto" }}>
              <div
                className={`${scopeId}-list`}
                style={{ display: "flex", flexDirection: "column", gap: ig }}
              >
                {safeItems.length ? (
                  safeItems.map((it: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: bg,
                        color: c,
                        fontSize: fz,
                        fontWeight: Number.isFinite(Number(fw))
                          ? Number(fw)
                          : (fw as any),
                        lineHeight: lh as any,
                        fontFamily: fam || undefined,
                      }}
                    >
                      {bullet(String(bulletStyle || "dot"))}
                      {typeof it?.text === "string" ? (
                        <div dangerouslySetInnerHTML={{ __html: it.text }} />
                      ) : (
                        <div>{it?.text}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#9ca3af" }}>Add list items</div>
                )}
              </div>
            </div>
          </div>
        )
      },
    },

    Tabs: {
      label: "Tabs",
      fields: {
        items: {
          type: "array",
          label: "Tabs",
          arrayFields: {
            label: { type: "text", label: "Tab Label" },
            content: { type: "textarea", label: "Tab Content" },
          },
          defaultItemProps: { label: "Tab", content: "Tab content goes here." },
        },
      },
      defaultProps: {
        items: [
          { label: "Description", content: "Product description text here..." },
          { label: "Specifications", content: "Technical specifications..." },
          { label: "Shipping", content: "Shipping information..." },
        ],
      },
      render: ({ items }: any) => {
        const [active, setActive] = useState(0)
        return (
          <div
            style={{
              padding: "40px 24px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb" }}>
              {items.map((item: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "0.9rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: active === i ? 600 : 400,
                    color: active === i ? "#111" : "#6b7280",
                    borderBottom: active === i ? "2px solid #111" : "none",
                    marginBottom: "-2px",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              style={{
                padding: "20px 0",
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#374151",
              }}
            >
              {typeof items[active]?.content === "string" ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: items[active]?.content || "",
                  }}
                />
              ) : (
                <div>{items[active]?.content}</div>
              )}
            </div>
          </div>
        )
      },
    },

    HTMLBlock: {
      label: "Custom HTML",
      fields: { code: { type: "textarea", label: "HTML Code" } },
      defaultProps: { code: "<div>Custom HTML here</div>" },
      render: ({ code }) => <div dangerouslySetInnerHTML={{ __html: code }} />,
    },

    Table: {
      label: "Data Table",
      fields: {
        heading: { type: "text", label: "Table Heading" },
        caption: { type: "text", label: "Caption (below table)" },
        columns: {
          type: "array",
          label: "Columns",
          arrayFields: {
            header: { type: "text", label: "Column Header" },
            width: { type: "text", label: "Width (e.g. 200px, 30%)" },
            align: {
              type: "select",
              label: "Align",
              options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                {
                  label: "Right",
                  value: "right",
                },
              ],
            },
          },
          defaultItemProps: { header: "Column", width: "", align: "left" },
        },
        rows: {
          type: "array",
          label: "Rows (comma-separated cells)",
          arrayFields: {
            cells: { type: "text", label: "Cell values (comma separated)" },
          },
          defaultItemProps: { cells: "Cell 1, Cell 2, Cell 3" },
        },
        showHeader: {
          type: "radio",
          label: "Show Header Row",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        striped: {
          type: "radio",
          label: "Striped Rows",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        bordered: {
          type: "radio",
          label: "Bordered",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        headerBgColor: colorField("Header Background"),
        headerTextColor: colorField("Header Text Color"),
        stripedColor: colorField("Stripe Color"),
        backgroundColor: colorField("Table Background"),
        textColor: colorField("Text Color"),
        fontSize: { type: "text", label: "Font Size (e.g. 0.9rem)" },
        maxWidth: { type: "text", label: "Max Width" },
      },
      defaultProps: {
        heading: "",
        caption: "",
        columns: [
          { header: "Product", width: "", align: "left" },
          { header: "Price", width: "120px", align: "right" },
          { header: "Stock", width: "100px", align: "center" },
        ],
        rows: [
          { cells: "Brake Pads, €45.00, In Stock" },
          { cells: "Oil Filter, €12.50, In Stock" },
          { cells: "Air Filter, €18.00, Low Stock" },
          { cells: "Spark Plugs, €8.50, In Stock" },
        ],
        showHeader: true,
        striped: true,
        bordered: true,
        headerBgColor: "#111827",
        headerTextColor: "#ffffff",
        stripedColor: "#f9fafb",
        backgroundColor: "#ffffff",
        textColor: "#374151",
        fontSize: "0.9rem",
        maxWidth: "900px",
      },
      render: ({
                 heading,
                 caption,
                 columns,
                 rows,
                 showHeader,
                 striped,
                 bordered,
                 headerBgColor,
                 headerTextColor,
                 stripedColor,
                 backgroundColor,
                 textColor,
                 fontSize,
                 maxWidth,
               }: any) => {
        const borderStyle = bordered ? "1px solid #e5e7eb" : "none"
        return (
          <div style={{ padding: "40px 24px" }}>
            <div style={{ maxWidth, margin: "0 auto" }}>
              {heading && (
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#111",
                    margin: "0 0 16px",
                  }}
                >
                  {heading}
                </h2>
              )}
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: bordered ? "8px" : "0",
                  border: borderStyle,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize,
                    color: textColor,
                    backgroundColor,
                  }}
                >
                  {showHeader && (
                    <thead>
                    <tr>
                      {columns.map((col: any, ci: number) => (
                        <th
                          key={ci}
                          style={{
                            padding: "12px 16px",
                            textAlign: col.align || "left",
                            fontWeight: 600,
                            backgroundColor: headerBgColor,
                            color: headerTextColor,
                            borderBottom: borderStyle,
                            width: col.width || "auto",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                    </thead>
                  )}
                  <tbody>
                  {rows.map((row: any, ri: number) => {
                    const cells = row.cells
                      ? row.cells.split(",").map((c: string) => c.trim())
                      : []
                    return (
                      <tr
                        key={ri}
                        style={{
                          backgroundColor:
                            striped && ri % 2 === 1
                              ? stripedColor
                              : "transparent",
                        }}
                      >
                        {columns.map((_col: any, ci: number) => (
                          <td
                            key={ci}
                            style={{
                              padding: "10px 16px",
                              textAlign: _col.align || "left",
                              borderBottom:
                                ri < rows.length - 1 ? borderStyle : "none",
                            }}
                          >
                            {cells[ci] || ""}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
              {caption && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  {caption}
                </p>
              )}
            </div>
          </div>
        )
      },
    },

    // --- LANDING: SKEW TEXT + IMAGE COMPOSITION ---
    /**
     * LandingSkewSection — 2-column landing section:
     * - Text title on a skewed "bleeding" background panel
     * - Action: link OR popup (mutually exclusive)
     * - Image side: stacked layers (unlimited). If you add one image, it behaves like a single image.
     */
    LandingSkewSection: {
      label: "Skew Section (Text + Images)",
      fields: {
        layout: {
          type: "radio",
          label: "Mirrored",
          options: [
            { label: "Normal", value: "left" },
            { label: "Mirrored", value: "right" },
          ],
        },
        maxWidth: { type: "text", label: "Container max width (e.g. 1600px)" },
        paddingY: { type: "text", label: "Section padding Y (e.g. 64px)" },
        paddingX: { type: "text", label: "Container padding X (e.g. 24px)" },
        gap: { type: "text", label: "Column gap (e.g. 80px)" },

        // Text / panel
        fontFamily: {
          type: "select",
          label: "Font family",
          options: [
            { label: "Default (inherit)", value: "" },
            {
              label: "System UI",
              value:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            { label: "Inter", value: "'Inter', sans-serif" },
            { label: "Geologica", value: "'Geologica', sans-serif" },
            { label: "Roboto", value: "'Roboto', sans-serif" },
            { label: "Open Sans", value: "'Open Sans', sans-serif" },
            { label: "Lato", value: "'Lato', sans-serif" },
            { label: "Poppins", value: "'Poppins', sans-serif" },
            { label: "Montserrat", value: "'Montserrat', sans-serif" },
            { label: "Playfair Display", value: "'Playfair Display', serif" },
            { label: "Merriweather", value: "'Merriweather', serif" },
            { label: "Georgia (serif)", value: "Georgia, serif" },
            {
              label: "Monospace",
              value: "'JetBrains Mono', 'Fira Code', monospace",
            },
          ],
        },
        panelHeight: { type: "text", label: "Text panel height (e.g. 220px)" },
        skewOnDesktop: {
          type: "number",
          label: "Skew degrees on desktop (lg)",
          min: 0,
          max: 45,
          step: 1,
        },
        panelBgMobile: colorField("Panel background (mobile)"),
        gradientFrom: colorField("Panel gradient FROM (desktop)"),
        gradientVia: colorField("Panel gradient VIA (desktop)"),
        gradientTo: colorField("Panel gradient TO (desktop)"),
        hoverBorderColor: colorField("Hover border color"),
        hoverShadowColor: colorField("Hover glow color"),

        accentLetterColor: colorField("Χρώμα τονισμένων γραμμάτων (highlight)"),
        titleTextColor: colorField("Title text color"),
        titleHighlightSize: {
          type: "text",
          label: "Highlight size (e.g. 60px)",
        },
        titleRestSize: { type: "text", label: "Rest size (e.g. 48px)" },
        titleTransform: {
          type: "select",
          label: "Title transform",
          options: [
            { label: "Uppercase", value: "uppercase" },
            { label: "None", value: "none" },
          ],
        },

        titleLines: {
          type: "array",
          label: "Title lines",
          getItemSummary: (item: any) => {
            const segs = Array.isArray(item?.segments) ? item.segments : []
            return (
              segs
                .map((s: any) => `${s?.h || ""}${s?.r || ""}`)
                .join(" ")
                .trim() || "Line"
            )
          },
          arrayFields: {
            segments: {
              type: "array",
              label: "Segments",
              getItemSummary: (seg: any) => `${seg?.h || ""}${seg?.r || ""}`,
              arrayFields: {
                h: { type: "text", label: "Highlight (e.g. F)" },
                r: { type: "text", label: "Rest (e.g. RONT)" },
              },
            },
          },
        },

        actionType: {
          type: "select",
          label: "Action",
          options: [
            { label: "None", value: "none" },
            { label: "Link", value: "link" },
            { label: "Popup", value: "popup" },
          ],
        },
        linkHref: { type: "text", label: "Link href" },
        linkLabel: { type: "text", label: "Link label" },
        linkColor: colorField("Link color"),
        linkHoverColor: colorField("Link hover color"),
        linkUnderlineHeight: {
          type: "text",
          label: "Underline height (e.g. 2px)",
        },
        popupId: popupSelectField("Popup"),

        // Images (stacked only)
        imageAreaHeightDesktop: {
          type: "text",
          label: "Image area height (desktop, e.g. 420px, 60vh)",
        },
        imageAreaHeightMobile: {
          type: "text",
          label: "Image area height (mobile, e.g. 320px, 50vh)",
        },

        mainObjectFit: {
          type: "select",
          label: "Images fit",
          options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
          ],
        },
        mainImageClassName: {
          type: "text",
          label: "Images className (tailwind)",
        },

        collageSlices: {
          type: "array",
          label: "Stack layers (top → bottom). Unlimited images.",
          getItemSummary: (item: any) => String(item?.src || "Slice"),
          arrayFields: {
            src: imageField("Slice image", { recommended: "900 × 900px" }),
            alt: { type: "text", label: "Alt" },
          },
          defaultItemProps: { src: "", alt: "" },
        },
        collageRadius: {
          type: "text",
          label: "Layer border radius (e.g. 12px)",
        },

        overlayImage: imageField("Overlay image (bottom-right, above stack)", {
          recommended: "900 × 900px",
        }),
        overlayImageAlt: { type: "text", label: "Overlay image alt" },
        overlayWidth: {
          type: "text",
          label: "Overlay width (e.g. 40%, 320px)",
        },
        overlayRight: { type: "text", label: "Overlay right (e.g. 0px, 24px)" },
        overlayBottom: {
          type: "text",
          label: "Overlay bottom (e.g. 0px, 24px)",
        },
      },
      defaultProps: {
        layout: "left",
        maxWidth: "1600px",
        paddingY: "64px",
        paddingX: "24px",
        gap: "80px",

        fontFamily: "",
        panelHeight: "220px",
        skewOnDesktop: 12,
        panelBgMobile: "#000000",
        gradientFrom: "#2E2C36",
        gradientVia: "#000000",
        gradientTo: "#000000",
        hoverBorderColor: "#FF5A01",
        hoverShadowColor: "rgba(255,90,1,0.4)",

        accentLetterColor: "#FF5A01",
        titleTextColor: "#FFFFFF",
        titleHighlightSize: "60px",
        titleRestSize: "48px",
        titleTransform: "uppercase",
        titleLines: [
          {
            segments: [
              { h: "F", r: "RONT" },
              { h: "B", r: "RAKE" },
              { h: "K", r: "ITS" },
            ],
          },
        ],

        actionType: "link",
        linkHref: "/",
        linkLabel: "LEARN MORE",
        linkColor: "rgba(255,255,255,0.7)",
        linkHoverColor: "#FF5A01",
        linkUnderlineHeight: "2px",
        popupId: "",

        imageAreaHeightDesktop: "420px",
        imageAreaHeightMobile: "320px",
        mainObjectFit: "contain",
        mainImageClassName: "",

        collageSlices: [
          { src: "", alt: "" },
          { src: "", alt: "" },
          { src: "", alt: "" },
        ],
        collageRadius: "12px",

        overlayImage: "",
        overlayImageAlt: "",
        overlayWidth: "40%",
        overlayRight: "0px",
        overlayBottom: "0px",
      },
      render: (props: any) => {
        const {
          layout,
          maxWidth,
          paddingY,
          paddingX,
          gap,
          fontFamily,
          panelHeight,
          skewOnDesktop,
          panelBgMobile,
          gradientFrom,
          gradientVia,
          gradientTo,
          hoverBorderColor,
          hoverShadowColor,
          titleLines,
          titleTextColor,
          accentLetterColor,
          titleHighlightSize,
          titleRestSize,
          titleTransform,
          actionType,
          linkHref,
          linkLabel,
          linkColor,
          linkHoverColor,
          linkUnderlineHeight,
          popupId,
          imageAreaHeightDesktop,
          imageAreaHeightMobile,
          mainObjectFit,
          mainImageClassName,
          collageSlices,
          collageRadius,
          overlayImage,
          overlayImageAlt,
          overlayWidth,
          overlayRight,
          overlayBottom,
        } = props

        const scopeId = `lss-${Math.random().toString(36).slice(2, 8)}`
        const isReversed = layout === "right"
        const { openPopup } = usePopupRuntime()
        const skewDeg = Math.max(0, Number(skewOnDesktop || 0))
        const safeMaxWidth = String(maxWidth || "").trim() || "1600px"
        const safePaddingY = String(paddingY || "").trim() || "64px"
        const safePaddingX = String(paddingX || "").trim() || "24px"
        const safeGap = String(gap || "").trim() || "80px"
        const safePanelHeight = String(panelHeight || "").trim() || "220px"

        const hoverShadow = String(hoverShadowColor || "").trim()
        const hoverBorder = String(hoverBorderColor || "").trim()
        const fam = String(fontFamily || "").trim()

        const safeImageAreaHeightDesktop =
          String(imageAreaHeightDesktop || "").trim() || "420px"
        const safeImageAreaHeightMobile =
          String(imageAreaHeightMobile || "").trim() || "320px"
        const fit =
          mainObjectFit === "cover" ? "object-cover" : "object-contain"
        const slices = Array.isArray(collageSlices)
          ? collageSlices.filter((s: any) => s?.src)
          : []
        const safeRadius = String(collageRadius || "").trim() || "0px"
        const safeOverlayWidth = String(overlayWidth || "").trim() || "40%"
        const safeOverlayRight = String(overlayRight || "").trim() || "0px"
        const safeOverlayBottom = String(overlayBottom || "").trim() || "0px"

        const getHoverVector = (idx: number, total: number) => {
          const n = Math.max(1, Number(total || 1))
          const i = Math.max(0, Number(idx || 0))
          // Spread directions around a circle so layers "fan out"
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2
          const mag = 10 + Math.min(12, n) * 0.6
          const dx = Math.round(Math.cos(angle) * mag)
          const dy = Math.round(Math.sin(angle) * mag)
          return { dx, dy }
        }

        const accent =
          typeof accentLetterColor === "string" && accentLetterColor.trim()
            ? accentLetterColor.trim()
            : "#FF5A01"
        const text =
          typeof titleTextColor === "string" && titleTextColor.trim()
            ? titleTextColor.trim()
            : "#FFFFFF"

        const Title = (
          <div
            style={
              {
                ["--lssAccent" as string]: accent,
                ["--lssText" as string]: text,
                ["--lssHSize" as string]: String(titleHighlightSize || "60px"),
                ["--lssRSize" as string]: String(titleRestSize || "48px"),
                ["--lssTransform" as string]: String(
                  titleTransform || "uppercase"
                ),
              } as React.CSSProperties
            }
          >
            <style>{`
.${scopeId}-h{color:var(--lssAccent) !important;font-size:var(--lssHSize) !important;line-height:1 !important;font-weight:700 !important;}
.${scopeId}-r{color:var(--lssText) !important;font-size:var(--lssRSize) !important;line-height:1 !important;font-weight:700 !important;text-transform:var(--lssTransform) !important;}
            `}</style>
            <div className="flex flex-col">
              {Array.isArray(titleLines) &&
                titleLines.map((line: any, lineIdx: number) => (
                  <div
                    key={lineIdx}
                    className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                  >
                    {(Array.isArray(line?.segments) ? line.segments : []).map(
                      (seg: any, segIdx: number) => (
                        <span
                          key={segIdx}
                          className="inline-flex items-baseline"
                        >
                          <span className={`${scopeId}-h`}>{seg?.h}</span>
                          <span className={`${scopeId}-r`}>{seg?.r}</span>
                        </span>
                      )
                    )}
                  </div>
                ))}
            </div>
          </div>
        )

        return (
          <div
            className="w-full relative overflow-hidden group/section"
            style={{ padding: `${safePaddingY} 0` }}
          >
            <div
              className="mx-auto relative z-10 w-full"
              style={{ maxWidth: safeMaxWidth, padding: `0 ${safePaddingX}` }}
            >
              <div
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center`}
                style={{ gap: safeGap }}
              >
                {/* TEXT SIDE */}
                <div className="flex-1 w-full lg:w-1/2 min-h-[220px] flex flex-col justify-center relative">
                  <div
                    className="relative group"
                    style={{ height: safePanelHeight }}
                  >
                    {/* mobile background */}
                    <div
                      className="absolute inset-y-0 transform skew-x-0 z-0 border border-transparent"
                      style={{
                        height: safePanelHeight,
                        left: "-20px",
                        right: "-20px",
                        backgroundColor: panelBgMobile || "#000",
                      }}
                    />

                    {/* Desktop bleed + gradient + skew + hover */}
                    <style>{`
@media (min-width: 1024px){
  .${scopeId}-panel{
    transform: skewX(-${skewDeg}deg);
    background: linear-gradient(${
                      isReversed ? "90deg" : "270deg"
                    }, ${gradientFrom} 0%, ${gradientVia} 15%, ${gradientTo} 100%);
    ${isReversed ? "left:-40px; right:-100vw;" : "right:-40px; left:-100vw;"}
    transition: box-shadow 500ms ease, border-color 500ms ease, border-width 500ms ease;
    border-color: transparent;
    border-style: solid;
    border-width: 1px;
  }
  .${scopeId}-panelWrap:hover .${scopeId}-panel{
    box-shadow: 0 0 40px ${hoverShadow || "rgba(255,90,1,0.4)"};
    ${isReversed ? "border-right-width:4px;" : "border-left-width:4px;"}
    border-color:${hoverBorder || "#FF5A01"};
  }
}
                    `}</style>
                    <div
                      className={`${scopeId}-panelWrap absolute inset-y-0 left-0 right-0`}
                      style={{ height: safePanelHeight }}
                    >
                      <div
                        className={`${scopeId}-panel absolute inset-y-0`}
                        style={{ height: safePanelHeight }}
                      />
                    </div>

                    <div className="relative z-10 h-full flex items-center w-full px-4 lg:px-8">
                      <div className="flex flex-col justify-center w-full items-start">
                        <div
                          className={`flex flex-col w-fit ${
                            isReversed
                              ? "items-start text-left lg:items-end lg:text-right"
                              : "items-start text-left"
                          }`}
                          style={{ fontFamily: fam || undefined }}
                        >
                          {Title}
                          {actionType === "link" ? (
                            <>
                              <style>{`
.${scopeId}-cta:hover .${scopeId}-ctaText{color:${
                                linkHoverColor || accent || "#FF5A01"
                              } !important;}
.${scopeId}-cta:hover .${scopeId}-ctaUnderline{width:100% !important;}
                              `}</style>
                              <a
                                href={linkHref || "#"}
                                className={`mt-4 lg:mt-8 w-fit ${scopeId}-cta`}
                                style={{
                                  textDecoration: "none",
                                  pointerEvents: linkHref ? "auto" : "none",
                                  opacity: linkHref ? 1 : 0.6,
                                }}
                                onClick={(e) => {
                                  if (!linkHref) {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }
                                }}
                              >
                                <span
                                  className={`text-[16px] font-extralight uppercase tracking-widest transition-colors ${scopeId}-ctaText`}
                                  style={{
                                    color: linkColor || "rgba(255,255,255,0.7)",
                                  }}
                                >
                                  {linkLabel || "LEARN MORE"}
                                </span>
                                <div
                                  className={`mt-1 ${scopeId}-ctaUnderline`}
                                  style={{
                                    height: String(
                                      linkUnderlineHeight || "2px"
                                    ),
                                    backgroundColor:
                                      linkHoverColor || accent || "#FF5A01",
                                    width: "0%",
                                    transition: "width 300ms ease",
                                  }}
                                />
                              </a>
                            </>
                          ) : actionType === "popup" ? (
                            <>
                              <style>{`
.${scopeId}-ctaBtn:hover .${scopeId}-ctaText{color:${
                                linkHoverColor || accent || "#FF5A01"
                              } !important;}
.${scopeId}-ctaBtn:hover .${scopeId}-ctaUnderline{width:100% !important;}
                              `}</style>
                              <button
                                type="button"
                                className={`mt-4 lg:mt-8 w-fit text-left ${scopeId}-ctaBtn`}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: popupId ? "pointer" : "not-allowed",
                                  opacity: popupId ? 1 : 0.6,
                                }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (popupId) openPopup(popupId)
                                }}
                              >
                                <span
                                  className={`text-[16px] font-extralight uppercase tracking-widest transition-colors ${scopeId}-ctaText`}
                                  style={{
                                    color: linkColor || "rgba(255,255,255,0.7)",
                                  }}
                                >
                                  {linkLabel || "LEARN MORE"}
                                </span>
                                <div
                                  className={`mt-1 ${scopeId}-ctaUnderline`}
                                  style={{
                                    height: String(
                                      linkUnderlineHeight || "2px"
                                    ),
                                    backgroundColor:
                                      linkHoverColor || accent || "#FF5A01",
                                    width: "0%",
                                    transition: "width 300ms ease",
                                  }}
                                />
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IMAGE SIDE */}
                <div className="flex-1 w-full lg:w-1/2 relative">
                  <div
                    className="relative w-full"
                    style={
                      {
                        ["--lssImgHDesktop" as string]:
                        safeImageAreaHeightDesktop,
                        ["--lssImgHMobile" as string]:
                        safeImageAreaHeightMobile,
                      } as React.CSSProperties
                    }
                  >
                    <style>{`
.${scopeId}-imgArea{height:var(--lssImgHMobile);}
@media (min-width: 1024px){ .${scopeId}-imgArea{height:var(--lssImgHDesktop);} }
                    `}</style>
                    <div className={`${scopeId}-imgArea relative w-full`}>
                      <div className="relative w-full h-full overflow-hidden bg-transparent rounded-md group/lssStack">
                        <style>{`
.${scopeId}-stackItem{
  position:absolute;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  transition: transform 520ms cubic-bezier(.2,.8,.2,1), filter 520ms cubic-bezier(.2,.8,.2,1);
  transform: translate(0px,0px) scale(1);
  will-change: transform;
}
.${scopeId}-stackItem img{pointer-events:none;}
.group\\/lssStack:hover .${scopeId}-stackItem{
  transform: translate(var(--lssDx, 0px), var(--lssDy, 0px)) scale(1.02);
  filter: drop-shadow(0 16px 36px rgba(0,0,0,0.32));
}
                        `}</style>
                        {slices.length ? (
                          slices.map((s: any, idx: number) => {
                            const total = slices.length
                            const vec = getHoverVector(idx, total)
                            // "top → bottom": first item is the topmost layer.
                            const z = total - idx
                            return (
                              <div
                                key={idx}
                                className={`${scopeId}-stackItem`}
                                style={
                                  {
                                    zIndex: z,
                                    borderRadius: safeRadius,
                                    ["--lssDx" as string]: `${vec.dx}px`,
                                    ["--lssDy" as string]: `${vec.dy}px`,
                                  } as React.CSSProperties
                                }
                              >
                                <img
                                  src={s.src}
                                  alt={s.alt || `layer-${idx}`}
                                  className={`w-full h-full ${fit} ${
                                    mainImageClassName || ""
                                  }`}
                                  style={{ borderRadius: safeRadius }}
                                />
                              </div>
                            )
                          })
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500">
                            Add image layers
                          </div>
                        )}

                        {/* Optional overlay image */}
                        {overlayImage ? (
                          <div
                            className="absolute z-[9999]"
                            style={{
                              right: safeOverlayRight,
                              bottom: safeOverlayBottom,
                              width: safeOverlayWidth,
                            }}
                          >
                            <img
                              src={overlayImage}
                              alt={overlayImageAlt || "overlay"}
                              className={`w-full h-auto ${fit} ${
                                mainImageClassName || ""
                              }`}
                              style={{ borderRadius: safeRadius }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
    },

    // --- LANDING: SERIES TABS (NAV) + SECTIONS (SCROLL + PAGED GRID) ---
    SeriesTabsNav: {
      label: "Tabs (Nav)",
      fields: {
        tabs: {
          type: "array",
          label: "Tabs",
          getItemSummary: (item: any) =>
            String(item?.label || item?.targetId || "Tab"),
          arrayFields: {
            label: { type: "text", label: "Label (e.g. CS SERIES)" },
            targetId: {
              type: "text",
              label: "Target section id (e.g. cs-series)",
            },
          },
          defaultItemProps: { label: "CS SERIES", targetId: "cs-series" },
        },
        maxWidth: { type: "text", label: "Max width (e.g. 1600px)" },
        paddingTop: { type: "text", label: "Padding top (e.g. 64px)" },
        paddingBottom: { type: "text", label: "Padding bottom (e.g. 32px)" },
        paddingXMobile: {
          type: "text",
          label: "Padding X (mobile, e.g. 16px)",
        },
        paddingXDesktop: {
          type: "text",
          label: "Padding X (desktop, e.g. 0px)",
        },
        gap: { type: "text", label: "Grid gap (e.g. 8px)" },
        colsMobile: {
          type: "number",
          label: "Columns (mobile)",
          min: 1,
          max: 12,
          step: 1,
        },
        colsTablet: {
          type: "number",
          label: "Columns (tablet ≥768px)",
          min: 1,
          max: 12,
          step: 1,
        },
        colsDesktop: {
          type: "number",
          label: "Columns (desktop ≥1024px)",
          min: 1,
          max: 12,
          step: 1,
        },
        tabsAlign: {
          type: "select",
          label: "Tabs alignment",
          options: [
            { label: "Left", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Right", value: "flex-end" },
          ],
        },
        tabTextAlign: {
          type: "select",
          label: "Tab text align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        fontSizeMobile: {
          type: "text",
          label: "Font size (mobile, e.g. 16px)",
        },
        fontSizeDesktop: {
          type: "text",
          label: "Font size (desktop, e.g. 18px)",
        },
        buttonPadding: { type: "text", label: "Button padding (e.g. 16px)" },
        borderColor: colorField("Border color"),
        bgColor: colorField("Background"),
        hoverBgColor: colorField("Hover background"),
        textColor: colorField("Text color"),
        hoverTextColor: colorField("Hover text color"),
        radius: { type: "text", label: "Border radius (e.g. 2px, 6px)" },
      },
      defaultProps: {
        tabs: [
          { label: "CS SERIES", targetId: "cs-series" },
          { label: "FS SERIES", targetId: "fs-series" },
          { label: "HS SERIES", targetId: "hs-series" },
        ],
        maxWidth: "1600px",
        paddingTop: "64px",
        paddingBottom: "0px",
        paddingXMobile: "16px",
        paddingXDesktop: "0px",
        gap: "8px",
        colsMobile: 2,
        colsTablet: 4,
        colsDesktop: 7,
        tabsAlign: "flex-start",
        tabTextAlign: "center",
        fontSizeMobile: "16px",
        fontSizeDesktop: "18px",
        buttonPadding: "16px",
        borderColor: "#000000",
        bgColor: "#ffffff",
        hoverBgColor: "#000000",
        textColor: "#000000",
        hoverTextColor: "#ffffff",
        radius: "2px",
      },
      render: ({
                 tabs,
                 maxWidth,
                 paddingTop,
                 paddingBottom,
                 paddingXMobile,
                 paddingXDesktop,
                 gap,
                 colsMobile,
                 colsTablet,
                 colsDesktop,
                 tabsAlign,
                 tabTextAlign,
                 fontSizeMobile,
                 fontSizeDesktop,
                 buttonPadding,
                 borderColor,
                 bgColor,
                 hoverBgColor,
                 textColor,
                 hoverTextColor,
                 radius,
               }: any) => {
        const scopeId = `stn-${Math.random().toString(36).slice(2, 8)}`
        const safeTabs = Array.isArray(tabs) ? tabs : []
        const safeMaxWidth = String(maxWidth || "").trim() || "1600px"
        const pt = String(paddingTop || "").trim() || "64px"
        const pb = String(paddingBottom || "").trim() || "0px"
        const pxM = String(paddingXMobile || "").trim() || "16px"
        const pxD = String(paddingXDesktop || "").trim() || "0px"
        const g = String(gap || "").trim() || "8px"
        const r = String(radius || "").trim() || "2px"

        const cM = Math.max(1, Number(colsMobile || 2))
        const cT = Math.max(1, Number(colsTablet || 4))
        const cD = Math.max(1, Number(colsDesktop || 7))

        const fsM = String(fontSizeMobile || "").trim() || "16px"
        const fsD = String(fontSizeDesktop || "").trim() || "18px"
        const pad = String(buttonPadding || "").trim() || "16px"
        const safeTabsAlign = String(tabsAlign || "").trim() || "flex-start"
        const safeTabTextAlign = String(tabTextAlign || "").trim() || "center"

        const tabCount = safeTabs.length || 1
        const effCM = Math.min(cM, tabCount)
        const effCT = Math.min(cT, tabCount)
        const effCD = Math.min(cD, tabCount)

        return (
          <div
            className={`${scopeId}-wrap w-full`}
            style={
              {
                paddingTop: pt,
                paddingBottom: pb,
                ["--stn-maxw" as string]: safeMaxWidth,
                ["--stn-pxm" as string]: pxM,
                ["--stn-pxd" as string]: pxD,
                ["--stn-gap" as string]: g,
                ["--stn-cols-m" as string]: String(effCM),
                ["--stn-cols-t" as string]: String(effCT),
                ["--stn-cols-d" as string]: String(effCD),
                ["--stn-fs-m" as string]: fsM,
                ["--stn-fs-d" as string]: fsD,
                ["--stn-pad" as string]: pad,
                ["--stn-tabs-align" as string]: safeTabsAlign,
                ["--stn-tab-text-align" as string]: safeTabTextAlign,
                ["--stn-border" as string]: borderColor,
                ["--stn-bg" as string]: bgColor,
                ["--stn-hover-bg" as string]: hoverBgColor,
                ["--stn-text" as string]: textColor,
                ["--stn-hover-text" as string]: hoverTextColor,
                ["--stn-radius" as string]: r,
              } as React.CSSProperties
            }
          >
            <style>{`
.${scopeId}-container{max-width:var(--stn-maxw);width:100%;margin:0 auto;padding:0 var(--stn-pxm);}
@media (min-width:1024px){ .${scopeId}-container{padding:0 var(--stn-pxd);} }
.${scopeId}-gridWrap{display:flex;justify-content:var(--stn-tabs-align);width:100%;flex:1;min-width:0;}
.${scopeId}-grid{
  display:inline-grid;
  gap:var(--stn-gap);
  grid-template-columns:repeat(var(--stn-cols-m),minmax(0,1fr));
  width:auto;
  max-width:100%;
}
@media (min-width:768px){ .${scopeId}-grid{grid-template-columns:repeat(var(--stn-cols-t),minmax(0,1fr));} }
@media (min-width:1024px){ .${scopeId}-grid{grid-template-columns:repeat(var(--stn-cols-d),minmax(0,1fr));} }
.${scopeId}-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:100%;
  border:1px solid var(--stn-border);
  background:var(--stn-bg);
  color:var(--stn-text);
  padding:var(--stn-pad);
  border-radius:var(--stn-radius);
  font-weight:700;
  font-size:var(--stn-fs-m);
  text-transform:uppercase;
  letter-spacing:0.02em;
  text-align:var(--stn-tab-text-align);
  transition:background-color .2s ease,color .2s ease;
}
@media (min-width:1024px){ .${scopeId}-btn{font-size:var(--stn-fs-d);} }
.${scopeId}-btn:hover{background:var(--stn-hover-bg);color:var(--stn-hover-text);}
            `}</style>

            <div className={`${scopeId}-container`}>
              <div className={`${scopeId}-gridWrap`}>
                <div className={`${scopeId}-grid`}>
                  {safeTabs.map((t: any, idx: number) => {
                    const label =
                      String(t?.label || "").trim() || `TAB ${idx + 1}`
                    const targetId = String(t?.targetId || "").trim()
                    const handleClick = () => {
                      if (!targetId) return
                      const el = document.getElementById(targetId)
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`${scopeId}-btn`}
                        onClick={handleClick}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },

    SeriesTabsSection: {
      label: "Section (Paged Grid)",
      fields: {
        sectionId: {
          type: "text",
          label: "Section id (must match tab targetId)",
        },
        title: { type: "text", label: "Section title" },
        titleAlign: {
          type: "select",
          label: "Title alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        items: {
          type: "array",
          label: "Items (each item is one grid cell)",
          getItemSummary: (_item: any, index?: number) =>
            `Item ${(index ?? 0) + 1}`,
          arrayFields: {
            content: { type: "slot" as const },
          },
          defaultItemProps: { content: [] },
        },

        // Layout
        backgroundColor: colorField("Background color"),
        maxWidth: { type: "text", label: "Max width (e.g. 1600px)" },
        paddingY: { type: "text", label: "Padding Y (e.g. 64px)" },
        paddingXMobile: {
          type: "text",
          label: "Padding X (mobile, e.g. 16px)",
        },
        paddingXDesktop: {
          type: "text",
          label: "Padding X (desktop, e.g. 0px)",
        },

        // Responsive paging rules
        itemsPerRowMobile: {
          type: "number",
          label: "Items per row (mobile)",
          min: 1,
          max: 12,
          step: 1,
        },
        itemsPerRowTablet: {
          type: "number",
          label: "Items per row (tablet ≥768px)",
          min: 1,
          max: 12,
          step: 1,
        },
        itemsPerRowDesktop: {
          type: "number",
          label: "Items per row (desktop ≥1024px)",
          min: 1,
          max: 12,
          step: 1,
        },
        maxItemsPerPageMobile: {
          type: "number",
          label: "Max items per page (mobile)",
          min: 1,
          max: 200,
          step: 1,
        },
        maxItemsPerPageTablet: {
          type: "number",
          label: "Max items per page (tablet ≥768px)",
          min: 1,
          max: 200,
          step: 1,
        },
        maxItemsPerPageDesktop: {
          type: "number",
          label: "Max items per page (desktop ≥1024px)",
          min: 1,
          max: 200,
          step: 1,
        },
        gap: { type: "text", label: "Grid gap (e.g. 24px)" },

        // Arrows styling
        arrowsEnabled: {
          type: "radio",
          label: "Show arrows when multiple pages",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        arrowsPlacement: {
          type: "select",
          label: "Arrows placement",
          options: [
            { label: "Top (next to title)", value: "top" },
            { label: "Sides (left/right of slider)", value: "sides" },
          ],
        },
        arrowBg: colorField("Arrow background"),
        arrowColor: colorField("Arrow text color"),
        arrowBorder: colorField("Arrow border"),
        arrowRadius: { type: "text", label: "Arrow radius (e.g. 6px)" },
        arrowSize: { type: "text", label: "Arrow font size (e.g. 22px)" },
        arrowPadding: { type: "text", label: "Arrow padding (e.g. 10px 14px)" },
      },
      defaultProps: {
        sectionId: "cs-series",
        title: "CUSTOM SERIES",
        titleAlign: "left",
        items: [
          { content: [] },
          { content: [] },
          { content: [] },
          { content: [] },
        ],
        backgroundColor: "#ffffff",
        maxWidth: "1600px",
        paddingY: "64px",
        paddingXMobile: "16px",
        paddingXDesktop: "0px",
        itemsPerRowMobile: 2,
        itemsPerRowTablet: 3,
        itemsPerRowDesktop: 4,
        maxItemsPerPageMobile: 6,
        maxItemsPerPageTablet: 12,
        maxItemsPerPageDesktop: 12,
        gap: "24px",
        arrowsEnabled: true,
        arrowsPlacement: "top",
        arrowBg: "#ffffff",
        arrowColor: "#000000",
        arrowBorder: "rgba(0,0,0,0.2)",
        arrowRadius: "6px",
        arrowSize: "22px",
        arrowPadding: "10px 14px",
      },
      render: ({
                 sectionId,
                 title,
                 titleAlign,
                 items,
                 backgroundColor,
                 maxWidth,
                 paddingY,
                 paddingXMobile,
                 paddingXDesktop,
                 itemsPerRowMobile,
                 itemsPerRowTablet,
                 itemsPerRowDesktop,
                 maxItemsPerPageMobile,
                 maxItemsPerPageTablet,
                 maxItemsPerPageDesktop,
                 gap,
                 arrowsEnabled,
                 arrowsPlacement,
                 arrowBg,
                 arrowColor,
                 arrowBorder,
                 arrowRadius,
                 arrowSize,
                 arrowPadding,
               }: any) => {
        const scopeId = `sts-${Math.random().toString(36).slice(2, 8)}`
        const safeId = String(sectionId || "").trim()
        const safeTitle = String(title || "").trim()
        const safeTitleAlign = String(titleAlign || "").trim() || "left"
        const safeMaxWidth = String(maxWidth || "").trim() || "1600px"
        const py = String(paddingY || "").trim() || "64px"
        const pxM = String(paddingXMobile || "").trim() || "16px"
        const pxD = String(paddingXDesktop || "").trim() || "0px"
        const g = String(gap || "").trim() || "24px"
        const r = String(arrowRadius || "").trim() || "6px"
        const s = String(arrowSize || "").trim() || "22px"
        const pad = String(arrowPadding || "").trim() || "10px 14px"
        const placement = String(arrowsPlacement || "").trim() || "top"

        const perRowM = Math.max(1, Number(itemsPerRowMobile || 2))
        const perRowT = Math.max(1, Number(itemsPerRowTablet || 3))
        const perRowD = Math.max(1, Number(itemsPerRowDesktop || 4))
        const perPageM = Math.max(1, Number(maxItemsPerPageMobile || 6))
        const perPageT = Math.max(1, Number(maxItemsPerPageTablet || 12))
        const perPageD = Math.max(1, Number(maxItemsPerPageDesktop || 12))

        const [page, setPage] = React.useState(0)
        const rootRef = React.useRef<HTMLDivElement | null>(null)
        const [containerWidth, setContainerWidth] = React.useState<number>(1200)
        const arrowLockRef = React.useRef<number>(0)

        React.useEffect(() => {
          const el = rootRef.current
          if (!el) return
          const ro = new ResizeObserver((entries) => {
            const w = entries?.[0]?.contentRect?.width
            if (typeof w === "number" && w > 0) setContainerWidth(w)
          })
          ro.observe(el)
          return () => ro.disconnect()
        }, [])

        const mode =
          containerWidth >= 1024
            ? "desktop"
            : containerWidth >= 768
              ? "tablet"
              : "mobile"
        const perRow =
          mode === "desktop" ? perRowD : mode === "tablet" ? perRowT : perRowM
        const perPage =
          mode === "desktop"
            ? perPageD
            : mode === "tablet"
              ? perPageT
              : perPageM
        const safeItems = Array.isArray(items) ? items : []
        const pages = Math.max(1, Math.ceil(safeItems.length / perPage))

        React.useEffect(() => {
          setPage((p) => Math.min(p, pages - 1))
        }, [pages])

        const pagedItems: any[][] = []
        for (let i = 0; i < safeItems.length; i += perPage) {
          pagedItems.push(safeItems.slice(i, i + perPage))
        }

        const canPrev = page > 0
        const canNext = page < pages - 1
        const showArrows = Boolean(arrowsEnabled && pages > 1)
        const arrowsOnTop = placement !== "sides"

        const bumpPage = (delta: number) => {
          setPage((p) => Math.max(0, Math.min(pages - 1, p + delta)))
        }
        const bumpPageOnce = (delta: number) => {
          const now = Date.now()
          // Prevent duplicate triggers from pointer/mouse/touch in editor overlays
          if (now - arrowLockRef.current < 200) return
          arrowLockRef.current = now
          bumpPage(delta)
        }

        return (
          <section id={safeId || undefined} style={{ backgroundColor }}>
            <div
              ref={rootRef}
              className={`${scopeId}-container`}
              style={
                {
                  maxWidth: safeMaxWidth,
                  margin: "0 auto",
                  padding: `${py} ${pxM}`,
                  ["--sts-pxd" as string]: pxD,
                  ["--sts-gap" as string]: g,
                  ["--sts-cols" as string]: String(perRow),
                  ["--sts-arrow-bg" as string]: arrowBg,
                  ["--sts-arrow-color" as string]: arrowColor,
                  ["--sts-arrow-border" as string]: arrowBorder,
                  ["--sts-arrow-radius" as string]: r,
                  ["--sts-arrow-size" as string]: s,
                  ["--sts-arrow-pad" as string]: pad,
                } as React.CSSProperties
              }
            >
              <style>{`
@media (min-width:1024px){ .${scopeId}-container{padding-left:var(--sts-pxd);padding-right:var(--sts-pxd);} }
.${scopeId}-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 24px;}
.${scopeId}-title{font-size:28px;font-weight:700;margin:0;color:#000;}
.${scopeId}-title[data-align="center"]{text-align:center;width:100%;}
.${scopeId}-title[data-align="right"]{text-align:right;width:100%;}
.${scopeId}-header[data-align="center"]{justify-content:center;}
.${scopeId}-header[data-align="center"] .${scopeId}-arrows{position:absolute;right:0;}
.${scopeId}-header[data-align="right"]{flex-direction:row-reverse;}
.${scopeId}-viewport{position:relative;overflow:hidden;}
.${scopeId}-pages{
  display:flex;
  width:100%;
  transition:transform .35s ease;
  will-change:transform;
}
.${scopeId}-page{
  flex:0 0 100%;
  display:grid;
  gap:var(--sts-gap);
  grid-template-columns:repeat(var(--sts-cols),minmax(0,1fr));
}
.${scopeId}-arrows{display:flex;gap:8px;}
.${scopeId}-arrow{
  background:var(--sts-arrow-bg);
  color:var(--sts-arrow-color);
  border:1px solid var(--sts-arrow-border);
  border-radius:var(--sts-arrow-radius);
  font-size:var(--sts-arrow-size);
  line-height:1;
  padding:var(--sts-arrow-pad);
  min-width:40px;min-height:40px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;
  transition:opacity .2s ease;
  pointer-events:auto;
  position:relative;
  z-index:9999;
}
.${scopeId}-arrow:disabled{opacity:.4;cursor:not-allowed;}
/* No hover transform: avoid overriding sideArrow centering transform */

/* Side arrows */
.${scopeId}-sideArrow{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  z-index:9999;
}
.${scopeId}-sideArrow.left{left:8px;}
.${scopeId}-sideArrow.right{right:8px;}
              `}</style>

              <div
                className={`${scopeId}-header`}
                data-align={safeTitleAlign}
                style={{ position: "relative" }}
              >
                <h3 className={`${scopeId}-title`} data-align={safeTitleAlign}>
                  {safeTitle}
                </h3>
                {showArrows && arrowsOnTop ? (
                  <div className={`${scopeId}-arrows`}>
                    <button
                      type="button"
                      className={`${scopeId}-arrow`}
                      disabled={!canPrev}
                      style={{ pointerEvents: "auto" }}
                      onPointerDownCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!canPrev) return
                        bumpPageOnce(-1)
                      }}
                      onClickCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={`${scopeId}-arrow`}
                      disabled={!canNext}
                      style={{ pointerEvents: "auto" }}
                      onPointerDownCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!canNext) return
                        bumpPageOnce(1)
                      }}
                      onClickCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      ›
                    </button>
                  </div>
                ) : null}
              </div>

              <div className={`${scopeId}-viewport`}>
                {showArrows && !arrowsOnTop ? (
                  <>
                    <button
                      type="button"
                      className={`${scopeId}-arrow ${scopeId}-sideArrow left`}
                      disabled={!canPrev}
                      style={{ pointerEvents: "auto" }}
                      onPointerDownCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!canPrev) return
                        bumpPageOnce(-1)
                      }}
                      onClickCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={`${scopeId}-arrow ${scopeId}-sideArrow right`}
                      disabled={!canNext}
                      style={{ pointerEvents: "auto" }}
                      onPointerDownCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!canNext) return
                        bumpPageOnce(1)
                      }}
                      onClickCapture={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      ›
                    </button>
                  </>
                ) : null}
                <div
                  className={`${scopeId}-pages`}
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {(pagedItems.length ? pagedItems : [[]]).map(
                    (chunk: any[], pIdx: number) => (
                      <div key={pIdx} className={`${scopeId}-page`}>
                        {(chunk.length ? chunk : []).map(
                          (it: any, idx: number) => {
                            const Content = it?.content
                            return (
                              <div key={`${pIdx}-${idx}`} className="min-w-0">
                                {typeof Content === "function" ? (
                                  <Content />
                                ) : (
                                  <div className="min-h-[80px] rounded-md border border-dashed border-black/20 flex items-center justify-center text-black/50">
                                    Add item content
                                  </div>
                                )}
                              </div>
                            )
                          }
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      },
    },

    // =============================================
    // MARKETING
    // =============================================
    Features: {
      label: "Features Grid",
      fields: {
        heading: { type: "text", label: "Section Heading" },
        subtitle: { type: "text", label: "Subtitle" },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
          ],
        },
        items: {
          type: "array",
          label: "Feature Items",
          arrayFields: {
            icon: { type: "text", label: "Emoji / Icon" },
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
          },
          defaultItemProps: {
            icon: "✨",
            title: "Feature",
            description: "Describe this feature",
          },
        },
      },
      defaultProps: {
        heading: "Features",
        subtitle: "",
        columns: "3",
        items: [
          {
            icon: "🚀",
            title: "Fast",
            description: "Lightning-fast performance",
          },
          {
            icon: "🔒",
            title: "Secure",
            description: "Enterprise-grade security",
          },
          {
            icon: "📱",
            title: "Responsive",
            description: "Works on all devices",
          },
        ],
      },
      render: ({ heading, subtitle, columns, items }) => (
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "0 0 8px",
                  color: "#111",
                }}
              >
                {heading}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: "1rem",
                  textAlign: "center",
                  margin: "0 0 40px",
                  color: "#6b7280",
                }}
              >
                {subtitle}
              </p>
            )}
            {!subtitle && heading && <div style={{ marginBottom: "40px" }} />}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: "32px",
              }}
            >
              {items.map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: "24px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "12px" }}>
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      margin: "0 0 8px",
                      color: "#111",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    CallToAction: {
      label: "Call to Action",
      fields: {
        heading: { type: "text", label: "Heading" },
        description: { type: "textarea", label: "Description" },
        buttonText: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
        style: {
          type: "select",
          label: "Button Style",
          options: [
            { label: "Filled", value: "filled" },
            { label: "Outline", value: "outline" },
          ],
        },
        backgroundColor: colorField("Background Color"),
      },
      defaultProps: {
        heading: "Ready to get started?",
        description: "Join thousands of satisfied customers today.",
        buttonText: "Get Started",
        buttonLink: "/",
        style: "filled",
        backgroundColor: "#111827",
      },
      render: ({
                 heading,
                 description,
                 buttonText,
                 buttonLink,
                 style,
                 backgroundColor,
               }) => {
        const isLight = [
          "#fff",
          "#ffffff",
          "white",
          "#f9fafb",
          "#f3f4f6",
        ].includes(backgroundColor)
        return (
          <section
            style={{
              padding: "60px 24px",
              backgroundColor,
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: isLight ? "#111" : "#fff",
                  margin: "0 0 12px",
                }}
              >
                {heading}
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: isLight ? "#6b7280" : "#d1d5db",
                  margin: "0 0 32px",
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
              <a
                href={buttonLink}
                style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textDecoration: "none",
                  cursor: "pointer",
                  ...(style === "filled"
                    ? {
                      backgroundColor: isLight ? "#000" : "#fff",
                      color: isLight ? "#fff" : "#000",
                      border: "none",
                    }
                    : {
                      backgroundColor: "transparent",
                      color: isLight ? "#000" : "#fff",
                      border: `2px solid ${isLight ? "#000" : "#fff"}`,
                    }),
                }}
              >
                {buttonText}
              </a>
            </div>
          </section>
        )
      },
    },

    Testimonials: {
      label: "Testimonials",
      fields: {
        heading: { type: "text", label: "Section Heading" },
        items: {
          type: "array",
          label: "Testimonials",
          arrayFields: {
            quote: { type: "textarea", label: "Quote" },
            author: { type: "text", label: "Author" },
            role: { type: "text", label: "Role / Company" },
            avatar: { type: "text", label: "Avatar URL (Optional)" },
            rating: {
              type: "select",
              label: "Rating",
              options: [
                { label: "5 Stars", value: "5" },
                { label: "4 Stars", value: "4" },
                { label: "3 Stars", value: "3" },
                { label: "No Rating", value: "0" },
              ],
            },
          },
          defaultItemProps: {
            quote: "Great product!",
            author: "John Doe",
            role: "Customer",
            avatar: "",
            rating: "5",
          },
        },
      },
      defaultProps: {
        heading: "What our customers say",
        items: [
          {
            quote: "Absolutely amazing experience from start to finish.",
            author: "Maria K.",
            role: "Customer",
            avatar: "",
            rating: "5",
          },
          {
            quote: "Best purchase I've made this year. Highly recommend!",
            author: "Alex P.",
            role: "Verified Buyer",
            avatar: "",
            rating: "5",
          },
        ],
      },
      render: ({ heading, items }) => (
        <section style={{ padding: "60px 24px", backgroundColor: "#f9fafb" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "0 0 40px",
                  color: "#111",
                }}
              >
                {heading}
              </h2>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  items.length === 1
                    ? "1fr"
                    : `repeat(${Math.min(items.length, 3)}, 1fr)`,
                gap: "24px",
              }}
            >
              {items.map((item: any, i: number) => (
                <blockquote
                  key={i}
                  style={{
                    margin: 0,
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {item.rating !== "0" && (
                    <div style={{ marginBottom: "8px" }}>
                      {"★".repeat(Number(item.rating))}
                      {"☆".repeat(5 - Number(item.rating))}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "#374151",
                      margin: "0 0 16px",
                      fontStyle: "italic",
                    }}
                  >
                    "{item.quote}"
                  </p>
                  <footer
                    style={{
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {item.avatar && (
                      <img
                        src={item.avatar}
                        alt={item.author}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div>
                      <strong style={{ color: "#111" }}>{item.author}</strong>
                      {item.role && (
                        <span style={{ color: "#6b7280" }}> — {item.role}</span>
                      )}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    Stats: {
      label: "Stats / Numbers",
      fields: {
        heading: { type: "text", label: "Heading" },
        backgroundColor: colorField("Background Color"),
        items: {
          type: "array",
          label: "Stats",
          arrayFields: {
            value: { type: "text", label: "Value (e.g. 10K+)" },
            label: { type: "text", label: "Label" },
          },
          defaultItemProps: { value: "100+", label: "Customers" },
        },
      },
      defaultProps: {
        heading: "",
        backgroundColor: "#ffffff",
        items: [
          { value: "10K+", label: "Happy Customers" },
          { value: "50+", label: "Countries" },
          { value: "99%", label: "Satisfaction" },
          { value: "24/7", label: "Support" },
        ],
      },
      render: ({ heading, backgroundColor, items }) => (
        <section style={{ padding: "60px 24px", backgroundColor }}>
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {heading && (
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 40px",
                }}
              >
                {heading}
              </h2>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(
                  items.length,
                  4
                )}, 1fr)`,
                gap: "32px",
              }}
            >
              {items.map((item: any, i: number) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      color: "#111",
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                      marginTop: "8px",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    LogoCloud: {
      label: "Logo Cloud",
      fields: {
        heading: { type: "text", label: "Heading" },
        items: {
          type: "array",
          label: "Logos",
          arrayFields: {
            src: { type: "text", label: "Logo Image URL" },
            alt: { type: "text", label: "Company Name" },
            url: { type: "text", label: "Link (Optional)" },
          },
          defaultItemProps: { src: "", alt: "Company", url: "" },
        },
        grayscale: {
          type: "radio",
          label: "Grayscale Logos",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
      defaultProps: {
        heading: "Trusted by leading brands",
        items: [
          { src: "", alt: "Brand 1", url: "" },
          { src: "", alt: "Brand 2", url: "" },
          { src: "", alt: "Brand 3", url: "" },
          { src: "", alt: "Brand 4", url: "" },
        ],
        grayscale: true,
      },
      render: ({ heading, items, grayscale }) => (
        <section style={{ padding: "48px 24px" }}>
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {heading && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 24px",
                  fontWeight: 500,
                }}
              >
                {heading}
              </p>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "40px",
                flexWrap: "wrap",
              }}
            >
              {items.map((item: any, i: number) => {
                const img = item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{
                      height: "32px",
                      objectFit: "contain",
                      filter: grayscale ? "grayscale(1) opacity(0.5)" : "none",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100px",
                      height: "32px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: "#9ca3af",
                    }}
                  >
                    {item.alt}
                  </div>
                )
                return item.url ? (
                  <a key={i} href={item.url} style={{ textDecoration: "none" }}>
                    {img}
                  </a>
                ) : (
                  <div key={i}>{img}</div>
                )
              })}
            </div>
          </div>
        </section>
      ),
    },

    PricingTable: {
      label: "Pricing Table",
      fields: {
        heading: { type: "text", label: "Heading" },
        items: {
          type: "array",
          label: "Plans",
          arrayFields: {
            name: { type: "text", label: "Plan Name" },
            price: { type: "text", label: "Price" },
            period: { type: "text", label: "Period (e.g. /month)" },
            features: { type: "textarea", label: "Features (one per line)" },
            ctaText: { type: "text", label: "Button Text" },
            ctaLink: { type: "text", label: "Button Link" },
            highlighted: {
              type: "select",
              label: "Highlighted",
              options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ],
            },
          },
          defaultItemProps: {
            name: "Plan",
            price: "€29",
            period: "/month",
            features: "Feature 1\nFeature 2\nFeature 3",
            ctaText: "Get Started",
            ctaLink: "/",
            highlighted: "false",
          },
        },
      },
      defaultProps: {
        heading: "Simple Pricing",
        items: [
          {
            name: "Starter",
            price: "€9",
            period: "/month",
            features: "1 User\n5GB Storage\nEmail Support",
            ctaText: "Start Free",
            ctaLink: "/",
            highlighted: "false",
          },
          {
            name: "Pro",
            price: "€29",
            period: "/month",
            features:
              "5 Users\n50GB Storage\nPriority Support\nAdvanced Analytics",
            ctaText: "Get Pro",
            ctaLink: "/",
            highlighted: "true",
          },
          {
            name: "Enterprise",
            price: "€99",
            period: "/month",
            features:
              "Unlimited Users\n500GB Storage\nDedicated Support\nCustom Integrations\nSLA",
            ctaText: "Contact Us",
            ctaLink: "/",
            highlighted: "false",
          },
        ],
      },
      render: ({ heading, items }) => (
        <section style={{ padding: "60px 24px" }}>
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {heading && (
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 40px",
                }}
              >
                {heading}
              </h2>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(
                  items.length,
                  3
                )}, 1fr)`,
                gap: "24px",
                alignItems: "stretch",
              }}
            >
              {items.map((item: any, i: number) => {
                const hl = item.highlighted === "true"
                return (
                  <div
                    key={i}
                    style={{
                      padding: "32px 24px",
                      borderRadius: "12px",
                      border: hl ? "2px solid #111" : "1px solid #e5e7eb",
                      backgroundColor: hl ? "#fafafa" : "#fff",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        margin: "0 0 8px",
                        color: "#111",
                      }}
                    >
                      {item.name}
                    </h3>
                    <div style={{ margin: "0 0 20px" }}>
                      <span
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: 800,
                          color: "#111",
                        }}
                      >
                        {item.price}
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                        {item.period}
                      </span>
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0 0 24px",
                        textAlign: "left",
                        flex: 1,
                      }}
                    >
                      {item.features
                        .split("\n")
                        .filter(Boolean)
                        .map((f: any, j: number) => (
                          <li
                            key={j}
                            style={{
                              padding: "6px 0",
                              fontSize: "0.9rem",
                              color: "#374151",
                              borderBottom: "1px solid #f3f4f6",
                            }}
                          >
                            ✓ {f}
                          </li>
                        ))}
                    </ul>
                    <a
                      href={item.ctaLink}
                      style={{
                        display: "block",
                        padding: "12px",
                        textAlign: "center",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        backgroundColor: hl ? "#111" : "transparent",
                        color: hl ? "#fff" : "#111",
                        border: hl ? "none" : "1px solid #d1d5db",
                      }}
                    >
                      {item.ctaText}
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ),
    },

    Countdown: {
      label: "Countdown Timer",
      fields: {
        heading: { type: "text", label: "Heading" },
        targetDate: { type: "text", label: "Target Date (YYYY-MM-DD)" },
        ctaText: { type: "text", label: "Button Text" },
        ctaLink: { type: "text", label: "Button Link" },
        backgroundColor: colorField("Background Color"),
      },
      defaultProps: {
        heading: "Sale Ends Soon",
        targetDate: "2025-12-31",
        ctaText: "Shop Sale",
        ctaLink: "/sale",
        backgroundColor: "#111827",
      },
      render: ({
                 heading,
                 targetDate,
                 ctaText,
                 ctaLink,
                 backgroundColor,
               }: any) => {
        const isLight = ["#fff", "#ffffff", "white"].includes(backgroundColor)
        const textColor = isLight ? "#111" : "#fff"
        const calcTimeLeft = () => {
          const diff = new Date(targetDate).getTime() - Date.now()
          if (diff <= 0) return { days: 0, hours: 0, min: 0, sec: 0 }
          return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff / 3600000) % 24),
            min: Math.floor((diff / 60000) % 60),
            sec: Math.floor((diff / 1000) % 60),
          }
        }
        const [tl, setTl] = useState(calcTimeLeft)
        useEffect(() => {
          const t = setInterval(() => setTl(calcTimeLeft()), 1000)
          return () => clearInterval(t)
        }, [targetDate])
        const pad = (n: number) => String(n).padStart(2, "0")
        return (
          <section
            style={{
              padding: "60px 24px",
              backgroundColor,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: textColor,
                margin: "0 0 24px",
              }}
            >
              {heading}
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              {(["days", "hours", "min", "sec"] as const).map((k) => (
                <div key={k} style={{ minWidth: "72px" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: textColor,
                      backgroundColor: isLight
                        ? "#f3f4f6"
                        : "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      padding: "12px 8px",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {pad(tl[k])}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: isLight ? "#6b7280" : "#9ca3af",
                      marginTop: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    {k}
                  </div>
                </div>
              ))}
            </div>
            {ctaText && (
              <a
                href={ctaLink}
                style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  backgroundColor: isLight ? "#000" : "#fff",
                  color: isLight ? "#fff" : "#000",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                {ctaText}
              </a>
            )}
          </section>
        )
      },
    },

    Newsletter: {
      label: "Newsletter Signup",
      fields: {
        heading: { type: "text", label: "Heading" },
        description: { type: "text", label: "Description" },
        placeholder: { type: "text", label: "Input Placeholder" },
        buttonText: { type: "text", label: "Button Text" },
        backgroundColor: colorField("Background Color"),
      },
      defaultProps: {
        heading: "Stay in the loop",
        description: "Subscribe for exclusive offers and updates.",
        placeholder: "Enter your email",
        buttonText: "Subscribe",
        backgroundColor: "#f9fafb",
      },
      render: ({
                 heading,
                 description,
                 placeholder,
                 buttonText,
                 backgroundColor,
               }: any) => {
        const [email, setEmail] = useState("")
        const [done, setDone] = useState(false)
        const submit = (e: React.FormEvent) => {
          e.preventDefault()
          if (email) setDone(true)
        }
        return (
          <section
            style={{
              padding: "60px 24px",
              backgroundColor,
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: "480px", margin: "0 auto" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 8px",
                }}
              >
                {heading}
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#6b7280",
                  margin: "0 0 24px",
                }}
              >
                {description}
              </p>
              {done ? (
                <p style={{ color: "#059669", fontWeight: 500 }}>
                  ✓ Thanks for subscribing!
                </p>
              ) : (
                <form onSubmit={submit} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    required
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#111",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    {buttonText}
                  </button>
                </form>
              )}
            </div>
          </section>
        )
      },
    },

    // =============================================
    // SOCIAL PROOF
    // =============================================
    Reviews: {
      label: "Product Reviews",
      fields: {
        heading: { type: "text", label: "Heading" },
        averageRating: { type: "text", label: "Average Rating (e.g. 4.8)" },
        totalReviews: { type: "text", label: "Total Reviews (e.g. 2,847)" },
        items: {
          type: "array",
          label: "Reviews",
          arrayFields: {
            rating: {
              type: "select",
              label: "Rating",
              options: [
                { label: "5 Stars", value: "5" },
                { label: "4 Stars", value: "4" },
                { label: "3 Stars", value: "3" },
              ],
            },
            title: { type: "text", label: "Review Title" },
            body: { type: "textarea", label: "Review Body" },
            author: { type: "text", label: "Author" },
            date: { type: "text", label: "Date" },
            verified: {
              type: "select",
              label: "Verified",
              options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ],
            },
          },
          defaultItemProps: {
            rating: "5",
            title: "Great product",
            body: "Really happy with this purchase.",
            author: "Customer",
            date: "2025-01-15",
            verified: "true",
          },
        },
      },
      defaultProps: {
        heading: "Customer Reviews",
        averageRating: "4.8",
        totalReviews: "2,847",
        items: [
          {
            rating: "5",
            title: "Exceeded expectations",
            body: "Quality is outstanding. Will definitely order again.",
            author: "Maria K.",
            date: "2025-03-01",
            verified: "true",
          },
          {
            rating: "5",
            title: "Fast shipping",
            body: "Arrived in 2 days and exactly as described.",
            author: "Nikos P.",
            date: "2025-02-28",
            verified: "true",
          },
        ],
      },
      render: ({ heading, averageRating, totalReviews, items }) => (
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 8px",
                }}
              >
                {heading}
              </h2>
              <div style={{ fontSize: "1.25rem" }}>
                {"★".repeat(Math.round(Number(averageRating)))}{" "}
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                  }}
                >
                  {averageRating} out of 5 ({totalReviews} reviews)
                </span>
              </div>
            </div>
            {items.map((item: any, i: number) => (
              <div
                key={i}
                style={{ padding: "20px 0", borderTop: "1px solid #e5e7eb" }}
              >
                <div style={{ marginBottom: "4px" }}>
                  {"★".repeat(Number(item.rating))}
                  {"☆".repeat(5 - Number(item.rating))}
                </div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    margin: "0 0 4px",
                    color: "#111",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#374151",
                    margin: "0 0 8px",
                    lineHeight: 1.5,
                  }}
                >
                  {item.body}
                </p>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  {item.author} — {item.date}{" "}
                  {item.verified === "true" && (
                    <span style={{ color: "#059669" }}>✓ Verified</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    TrustBadges: {
      label: "Trust Badges",
      fields: {
        items: {
          type: "array",
          label: "Badges",
          arrayFields: {
            icon: { type: "text", label: "Emoji / Icon" },
            title: { type: "text", label: "Title" },
            subtitle: { type: "text", label: "Subtitle" },
          },
          defaultItemProps: {
            icon: "🔒",
            title: "Secure Checkout",
            subtitle: "256-bit SSL encryption",
          },
        },
        backgroundColor: colorField("Background Color"),
      },
      defaultProps: {
        items: [
          { icon: "🔒", title: "Secure Checkout", subtitle: "SSL Encrypted" },
          {
            icon: "🚚",
            title: "Free Shipping",
            subtitle: "On orders over €50",
          },
          { icon: "↩️", title: "Easy Returns", subtitle: "30-day policy" },
          { icon: "💬", title: "24/7 Support", subtitle: "Chat & email" },
        ],
        backgroundColor: "#f9fafb",
      },
      render: ({ items, backgroundColor }) => (
        <section style={{ padding: "32px 24px", backgroundColor }}>
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
              gap: "24px",
              textAlign: "center",
            }}
          >
            {items.map((item: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#111",
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {item.subtitle}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    TeamMembers: {
      label: "Team Members",
      fields: {
        heading: { type: "text", label: "Heading" },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
          ],
        },
        items: {
          type: "array",
          label: "Members",
          arrayFields: {
            photo: { type: "text", label: "Photo URL" },
            name: { type: "text", label: "Name" },
            role: { type: "text", label: "Role" },
            bio: { type: "textarea", label: "Short Bio" },
          },
          defaultItemProps: {
            photo: "",
            name: "Team Member",
            role: "Role",
            bio: "",
          },
        },
      },
      defaultProps: {
        heading: "Meet the Team",
        columns: "3",
        items: [
          {
            photo: "",
            name: "Alex",
            role: "Founder & CEO",
            bio: "Leading the vision.",
          },
          {
            photo: "",
            name: "Maria",
            role: "Head of Design",
            bio: "Crafting beautiful experiences.",
          },
          {
            photo: "",
            name: "Nikos",
            role: "Lead Engineer",
            bio: "Building the future.",
          },
        ],
      },
      render: ({ heading, columns, items }) => (
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "0 0 40px",
                  color: "#111",
                }}
              >
                {heading}
              </h2>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: "32px",
              }}
            >
              {items.map((item: any, i: number) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      margin: "0 auto 16px",
                      overflow: "hidden",
                      backgroundColor: "#e5e7eb",
                    }}
                  >
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9ca3af",
                          fontSize: "2rem",
                        }}
                      >
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      margin: "0 0 4px",
                      color: "#111",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      margin: "0 0 8px",
                    }}
                  >
                    {item.role}
                  </p>
                  {item.bio && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#9ca3af",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    // =============================================
    // MEDIA
    // =============================================
    Gallery: {
      label: "Image Gallery",
      fields: {
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
          ],
        },
        gap: { type: "text", label: "Gap" },
        borderRadius: { type: "text", label: "Border Radius" },
        items: {
          type: "array",
          label: "Images",
          arrayFields: {
            src: { type: "text", label: "Image URL" },
            alt: { type: "text", label: "Alt Text" },
          },
          defaultItemProps: { src: "", alt: "Gallery image" },
        },
      },
      defaultProps: {
        columns: "3",
        gap: "8px",
        borderRadius: "4px",
        items: [
          { src: "", alt: "Image 1" },
          { src: "", alt: "Image 2" },
          { src: "", alt: "Image 3" },
          { src: "", alt: "Image 4" },
          { src: "", alt: "Image 5" },
          { src: "", alt: "Image 6" },
        ],
      },
      render: ({ columns, gap, borderRadius, items }) => (
        <div style={{ padding: "40px 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap,
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {items.map((item: any, i: number) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  overflow: "hidden",
                  borderRadius,
                  backgroundColor: "#e5e7eb",
                }}
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9ca3af",
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.alt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    },

    BeforeAfter: {
      label: "Before / After",
      fields: {
        beforeImage: { type: "text", label: "Before Image URL" },
        afterImage: { type: "text", label: "After Image URL" },
        beforeLabel: { type: "text", label: "Before Label" },
        afterLabel: { type: "text", label: "After Label" },
        heading: { type: "text", label: "Heading" },
      },
      defaultProps: {
        beforeImage: "",
        afterImage: "",
        beforeLabel: "Before",
        afterLabel: "After",
        heading: "",
      },
      render: ({
                 beforeImage,
                 afterImage,
                 beforeLabel,
                 afterLabel,
                 heading,
               }) => (
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "0 0 32px",
                  color: "#111",
                }}
              >
                {heading}
              </h2>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {[
                { src: beforeImage, label: beforeLabel },
                { src: afterImage, label: afterLabel },
              ].map((side, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div
                    style={{
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      borderRadius: "8px",
                      backgroundColor: "#e5e7eb",
                    }}
                  >
                    {side.src ? (
                      <img
                        src={side.src}
                        alt={side.label}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9ca3af",
                        }}
                      >
                        Add image URL
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {side.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    MapEmbed: {
      label: "Map Embed",
      fields: {
        embedUrl: { type: "text", label: "Google Maps Embed URL" },
        height: { type: "text", label: "Height" },
        heading: { type: "text", label: "Heading (Optional)" },
        address: { type: "text", label: "Address Text (Optional)" },
      },
      defaultProps: { embedUrl: "", height: "400px", heading: "", address: "" },
      render: ({ embedUrl, height, heading, address }) => (
        <section style={{ padding: "40px 24px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {heading && (
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: "0 0 8px",
                  color: "#111",
                }}
              >
                {heading}
              </h2>
            )}
            {address && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                  margin: "0 0 20px",
                }}
              >
                {address}
              </p>
            )}
            <div style={{ borderRadius: "8px", overflow: "hidden", height }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                  }}
                >
                  Paste a Google Maps embed URL
                </div>
              )}
            </div>
          </div>
        </section>
      ),
    },

    /**
     * AnimatedImage — an image with configurable entrance + loop animations.
     * The editor picks the animation in the sidebar; framer-motion renders it on storefront.
     * In admin preview it shows a static preview with a badge showing the animation name.
     */
    AnimatedImage: {
      label: "Animated Image",
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        width: { type: "text", label: "Width (e.g. 100%, 400px)" },
        height: { type: "text", label: "Height (e.g. auto, 600px)" },
        maxWidth: { type: "text", label: "Max Width" },
        objectFit: {
          type: "select",
          label: "Image Fit",
          options: [
            { label: "Contain", value: "contain" },
            { label: "Cover", value: "cover" },
            { label: "Fill", value: "fill" },
            { label: "None", value: "none" },
          ],
        },
        entranceAnimation: {
          type: "select",
          label: "Entrance Animation",
          options: [
            { label: "None", value: "" },
            { label: "Fade In", value: "fadeIn" },
            { label: "Fade In Up", value: "fadeInUp" },
            { label: "Fade In Down", value: "fadeInDown" },
            { label: "Fade In Left", value: "fadeInLeft" },
            { label: "Fade In Right", value: "fadeInRight" },
            { label: "Scale In", value: "scaleIn" },
            { label: "Scale Bounce", value: "scaleBounce" },
            { label: "Rotate In", value: "rotateIn" },
            { label: "Flip In X", value: "flipInX" },
            { label: "Flip In Y", value: "flipInY" },
          ],
        },
        loopAnimation: {
          type: "select",
          label: "Loop Animation",
          options: [
            { label: "None", value: "" },
            { label: "Float (up/down)", value: "float" },
            { label: "Float Slow", value: "floatSlow" },
            { label: "Pulse", value: "pulse" },
            { label: "Bounce", value: "bounce" },
            { label: "Rotate 360°", value: "rotate" },
            { label: "Rotate Slow", value: "rotateSlow" },
            { label: "Swing", value: "swing" },
            { label: "Rock", value: "rock" },
            { label: "Zoom Pulse", value: "zoomPulse" },
          ],
        },
        entranceDuration: {
          type: "text",
          label: "Entrance Duration (seconds)",
        },
        entranceDelay: { type: "text", label: "Entrance Delay (seconds)" },
        alignment: {
          type: "select",
          label: "Alignment",
          options: [
            { label: "Left", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Right", value: "flex-end" },
          ],
        },
      },
      defaultProps: {
        src: "",
        alt: "Animated image",
        width: "100%",
        height: "auto",
        maxWidth: "100%",
        objectFit: "contain",
        entranceAnimation: "fadeInUp",
        loopAnimation: "float",
        entranceDuration: "0.8",
        entranceDelay: "0.2",
        alignment: "center",
      },
      render: ({
                 src,
                 alt,
                 width,
                 height,
                 maxWidth,
                 objectFit,
                 entranceAnimation,
                 loopAnimation: loopName,
                 entranceDuration,
                 entranceDelay,
                 alignment,
               }: any) => {
        const ref = useRef<HTMLDivElement>(null)
        const isInView = useInView(ref, { once: true, margin: "-50px" })
        const dur = parseFloat(entranceDuration || "0.8")
        const del = parseFloat(entranceDelay || "0.2")
        const hasEntrance =
          entranceAnimation && entranceInitial[entranceAnimation]
        const hasLoop = loopName && loopAnimations[loopName]
        const ep: any = {}
        if (hasEntrance) {
          ep.initial = entranceInitial[entranceAnimation]
          ep.animate = isInView
            ? entranceAnimate[entranceAnimation]
            : entranceInitial[entranceAnimation]
          ep.transition = {
            duration: dur,
            delay: del,
            ease: "easeOut",
            ...entranceTransitionOverrides[entranceAnimation],
          }
        }
        const lp: any = {}
        if (hasLoop) {
          const l = loopAnimations[loopName]
          lp.animate = l.animate
          lp.transition = l.transition
        }
        const imgEl = src ? (
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height,
              objectFit: objectFit as any,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
          >
            Add image URL
          </div>
        )
        const needsClip =
          entranceAnimation && overflowAnimations.has(entranceAnimation)
        return (
          <div
            ref={ref}
            style={{
              display: "flex",
              justifyContent: alignment,
              padding: "20px 0",
              overflow: needsClip ? "hidden" : undefined,
            }}
          >
            <motion.div {...ep} style={{ width, maxWidth, perspective: 1000 }}>
              {hasLoop ? <motion.div {...lp}>{imgEl}</motion.div> : imgEl}
            </motion.div>
          </div>
        )
      },
    },

    // --- 1. SHOWCASE SECTION ---
    ShowcaseSection: {
      label: "Skew Images & Grid",
      fields: {
        stackOnSmall: {
          type: "radio",
          label: "Stack on small containers",
          options: [
            { label: "Yes", value: true },
            { label: "No (always 2-column)", value: false },
          ],
        },
        layout: {
          type: "radio",
          label: "Layout",
          options: [
            { label: "Normal", value: "left" },
            { label: "Mirrored", value: "right" },
          ],
        },
        mainImage: imageField("Main Image", { recommended: "1300 × 1050px" }),
        sideImage: imageField("Side Image", { recommended: "1400 × 1050px" }),
        content: { type: "slot" as const },
        fontFamily: {
          type: "select",
          label: "Font family",
          options: [
            { label: "Default (inherit)", value: "" },
            {
              label: "System UI",
              value:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            { label: "Inter", value: "'Inter', sans-serif" },
            { label: "Geologica", value: "'Geologica', sans-serif" },
            { label: "Roboto", value: "'Roboto', sans-serif" },
            { label: "Open Sans", value: "'Open Sans', sans-serif" },
            { label: "Lato", value: "'Lato', sans-serif" },
            { label: "Poppins", value: "'Poppins', sans-serif" },
            { label: "Montserrat", value: "'Montserrat', sans-serif" },
            { label: "Playfair Display", value: "'Playfair Display', serif" },
            { label: "Merriweather", value: "'Merriweather', serif" },
            { label: "Georgia (serif)", value: "Georgia, serif" },
            {
              label: "Monospace",
              value: "'JetBrains Mono', 'Fira Code', monospace",
            },
          ],
        },
        accentLetterColor: colorField("Χρώμα τονισμένων γραμμάτων (tags)"),
        tagPrimarySizeDesktop: {
          type: "text",
          label: "Tag primary size (desktop, e.g. 48px)",
        },
        tagRestSizeDesktop: {
          type: "text",
          label: "Tag rest size (desktop, e.g. 40px)",
        },
        tagPrimarySizeMobile: {
          type: "text",
          label: "Tag primary size (mobile, e.g. 32px)",
        },
        tagRestSizeMobile: {
          type: "text",
          label: "Tag rest size (mobile, e.g. 28px)",
        },
        tags: {
          type: "array",
          label: "Tag Segments",
          getItemSummary: (item: any) =>
            `${item.primaryLetter || ""}${item.restOfWord || ""}`,
          arrayFields: {
            primaryLetter: { type: "text", label: "Primary Letter (Colored)" },
            restOfWord: { type: "text", label: "Rest of Word" },
          },
        },
      },
      defaultProps: {
        stackOnSmall: true,
        layout: "left",
        mainImage: "/d2-turing-image/landing-pages/front-break-kits/car.png",
        sideImage:
          "/d2-turing-image/landing-pages/front-break-kits/car-side-image.png",
        content: [],
        fontFamily: "",
        accentLetterColor: "#3b82f6",
        tagPrimarySizeDesktop: "48px",
        tagRestSizeDesktop: "40px",
        tagPrimarySizeMobile: "32px",
        tagRestSizeMobile: "28px",
        tags: [{ primaryLetter: "H", restOfWord: "OLLOW" }],
      },
      render: ({
                 stackOnSmall,
                 layout,
                 mainImage,
                 sideImage,
                 content: Content,
                 tags,
                 accentLetterColor,
                 fontFamily,
                 tagPrimarySizeDesktop,
                 tagRestSizeDesktop,
                 tagPrimarySizeMobile,
                 tagRestSizeMobile,
               }: any) => {
        const accent =
          typeof accentLetterColor === "string" && accentLetterColor.trim()
            ? accentLetterColor.trim()
            : "#3b82f6"
        const fam = String(fontFamily || "").trim()
        const primD = String(tagPrimarySizeDesktop || "").trim() || "48px"
        const restD = String(tagRestSizeDesktop || "").trim() || "40px"
        const primM = String(tagPrimarySizeMobile || "").trim() || "32px"
        const restM = String(tagRestSizeMobile || "").trim() || "28px"
        const isRight = layout === "right"
        const responsiveStack = stackOnSmall !== false
        const bp = "1500px"
        const scopeId = `hs-${Math.random().toString(36).slice(2, 8)}`
        const wrapClass = `${scopeId}-wrap`
        const innerClass = `${scopeId}-inner`
        const colClass = `${scopeId}-col`
        const contentGridClass = `${scopeId}-contentGrid`

        // Match `tuning-parts-front/.../brake-kits-content/index.tsx`
        const Images = isRight ? (
          <div className={`${colClass} w-1/2 flex flex-col`}>
            <div className="relative flex items-start justify-end gap-0 overflow-hidden pt-[3.5%] group">
              <div className="relative w-[72%] -mr-[30%] -mt-[1%] z-20">
                <img
                  src={sideImage}
                  alt="Side"
                  width={1400}
                  height={1050}
                  className="object-contain w-full h-auto transition-all duration-700 ease-in-out group-hover:-translate-x-4 group-hover:scale-[1.03]"
                />

                <div className="absolute bottom-[-15px] left-[1%] w-[72%] z-30 bg-black px-6 py-5 transform -skew-x-[20deg]">
                  <h3
                    className="text-white leading-none transform skew-x-[20deg] flex items-baseline tracking-tighter"
                    style={
                      {
                        ["--hsLetter" as string]: accent,
                      } as React.CSSProperties
                    }
                  >
                    {tags?.map((tag: any, idx: number) => (
                      <React.Fragment key={idx}>
                        <span className={`${scopeId}-hsPrim`}>
                          {tag.primaryLetter}
                        </span>
                        <span className={`${scopeId}-hsRest ml-0.5 mr-2`}>
                          {tag.restOfWord}
                        </span>
                      </React.Fragment>
                    ))}
                  </h3>
                </div>
              </div>

              <div className="relative w-[75%] -mr-[20%] z-10">
                <img
                  src={mainImage}
                  alt="Main"
                  width={1300}
                  height={1050}
                  className="object-contain w-full h-auto"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={`${colClass} w-1/2 flex flex-col`}>
            <div className="relative flex items-start justify-start gap-0 overflow-hidden pt-[3.5%] group">
              <div className="relative w-[75%] -ml-[20%]">
                <img
                  src={mainImage}
                  alt="Main"
                  width={1300}
                  height={1050}
                  className="object-contain w-full h-auto"
                />
              </div>

              <div className="relative w-[72%] -ml-[30%] -mt-[1%]">
                <img
                  src={sideImage}
                  alt="Side"
                  width={1400}
                  height={1050}
                  className="object-contain w-full h-auto transition-all duration-700 ease-in-out group-hover:translate-x-4 group-hover:scale-[1.03]"
                />

                <div className="absolute bottom-[-15px] left-[2%] w-[70%] z-30 bg-black px-6 py-5 transform -skew-x-[20deg]">
                  <h3
                    className="text-white leading-none transform skew-x-[20deg] flex items-baseline tracking-tighter"
                    style={
                      {
                        ["--hsLetter" as string]: accent,
                      } as React.CSSProperties
                    }
                  >
                    {tags?.map((tag: any, idx: number) => (
                      <React.Fragment key={idx}>
                        <span className={`${scopeId}-hsPrim`}>
                          {tag.primaryLetter}
                        </span>
                        <span className={`${scopeId}-hsRest ml-0.5`}>
                          {tag.restOfWord}
                        </span>
                      </React.Fragment>
                    ))}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )

        const Grid = isRight ? (
          <div
            className={`${colClass} w-1/2 -mr-[5%] relative py-6 min-h-[550px] flex items-center`}
          >
            <div className="absolute inset-y-0 -left-[10vw] right-0 z-0 pointer-events-none opacity-50 transform scale-[-1]">
              <ParallelogramSvg className="absolute inset-0 w-full h-full" />
            </div>
            <Content
              className={`${contentGridClass} grid grid-cols-2 gap-x-12 gap-y-10 relative z-10 mr-28 ml-auto`}
              style={{ minHeight: "320px", width: "100%" }}
            />
          </div>
        ) : (
          <div
            className={`${colClass} w-1/2 -ml-[5%] relative py-6 min-h-[550px] flex items-center`}
          >
            <div className="absolute inset-y-0 -right-[10vw] left-0 z-0 pointer-events-none opacity-50 transform scale-[-1]">
              <ParallelogramSvg className="absolute inset-0 w-full h-full" />
            </div>
            <Content
              className={`${contentGridClass} grid grid-cols-2 gap-x-12 gap-y-10 relative z-10 ml-28`}
              style={{ minHeight: "320px", width: "100%" }}
            />
          </div>
        )

        return (
          <div
            className={`${wrapClass} w-full py-8 h-full min-h-[550px]`}
            style={{ containerType: "inline-size" } as any}
          >
            <style>{`
.${scopeId}-hsPrim{color:var(--hsLetter) !important;font-size:${primD} !important;line-height:1 !important;font-weight:700 !important;}
.${scopeId}-hsRest{font-size:${restD} !important;line-height:1 !important;font-weight:700 !important;}
@media (max-width: 640px){
  .${scopeId}-hsPrim{font-size:${primM} !important;}
  .${scopeId}-hsRest{font-size:${restM} !important;}
}
@container (max-width: 640px){
  .${scopeId}-hsPrim{font-size:${primM} !important;}
  .${scopeId}-hsRest{font-size:${restM} !important;}
}
            `}</style>
            {responsiveStack ? (
              <style>{`@container (max-width: ${bp}) { .${innerClass}{flex-direction:column !important;} .${colClass}{width:100% !important;} } @container (max-width: 800px){ .${contentGridClass}{grid-template-columns:1fr !important;} } @container (max-width: 450px){ .${contentGridClass}{margin-left:0 !important;margin-right:0 !important;} }`}</style>
            ) : null}
            <div
              className={`${innerClass} flex ${
                isRight ? "flex-row-reverse" : "flex-row"
              } gap-0 items-stretch h-full`}
              style={{ fontFamily: fam || undefined }}
            >
              {Images}
              {Grid}
            </div>
          </div>
        )
      },
    },

    // --- 2. SHOWCASE ITEM (Για το DropZone) ---
    ShowcaseItem: {
      label: "Hollow Item (Card)",
      fields: {
        image: imageField("Item Image", { recommended: "350 × 200px" }),
        title: { type: "textarea", label: "Title (Use Enter for new lines)" },
        minWidth: {
          type: "text",
          label: "Text box min-width (e.g. 140px, 200px)",
        },
        popupOnClick: {
          type: "radio",
          label: "Open popup on click",
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ],
        },
        popupId: popupSelectField("Popup"),
        titleMode: {
          type: "select",
          label: "Title mode",
          options: [
            { label: "Single line (nowrap)", value: "nowrap" },
            { label: "Multiline (pre-line)", value: "pre-line" },
          ],
        },
      },
      defaultProps: {
        image: "/d2-turing-image/landing-pages/front-break-kits/item1.png",
        title: "286 x 26mm",
        minWidth: "140px",
        popupOnClick: false,
        popupId: "",
        titleMode: "nowrap",
      },
      render: ({
                 image,
                 title,
                 minWidth,
                 titleMode,
                 popupOnClick,
                 popupId,
               }: any) => {
        const isPreLine = titleMode === "pre-line"
        const { openPopup } = usePopupRuntime()

        const canTrigger = Boolean(popupOnClick && popupId)
        const handlePopupClick = (e: any) => {
          e?.preventDefault?.()
          e?.stopPropagation?.()
          if (popupId) openPopup(popupId)
        }

        const textMinWidth = String(minWidth || "").trim() || "140px"
        const cardMinWidth = `calc(${textMinWidth} + 120px)`
        return (
          <div
            className={`puck-hollow-item flex items-center group relative ${
              canTrigger ? "cursor-pointer" : ""
            }`}
            style={{ minWidth: cardMinWidth, flex: "0 0 auto" }}
            onMouseDownCapture={
              canTrigger ? (e) => e.stopPropagation() : undefined
            }
            onClickCapture={canTrigger ? handlePopupClick : undefined}
          >
            <style>{`
@media (max-width: 450px) {
  .puck-hollow-item { min-width: 0 !important; width: 100% !important; }
  .puck-hollow-item { display:flex !important; justify-content:center !important; }
  .puck-hollow-item-inner { width: 100% !important; max-width: calc(100vw - 32px) !important; margin: 0 auto !important; display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: center !important; }
  .puck-hollow-item-img { width: min(175px, 70vw) !important; height: auto !important; aspect-ratio: 175 / 100 !important; }
  .puck-hollow-item-img img { width: 100% !important; height: 100% !important; }
  .puck-hollow-item-text { margin-left: -40px !important; width: auto !important; min-width: 0 !important; max-width: calc(100vw - 32px - 120px) !important; }
  .puck-hollow-item-text > span { text-align: left !important; white-space: normal !important; }
}
            `}</style>

            <div className="puck-hollow-item-inner flex items-center">
              <div className="puck-hollow-item-img relative w-[175px] h-[100px] z-10 transition-transform duration-500 group-hover:scale-110 shrink-0">
                <img
                  src={image}
                  alt={title}
                  className="object-contain w-full h-full"
                />
              </div>

              <div
                className="puck-hollow-item-text relative -ml-[60px] bg-[#303030] py-4 pl-16 pr-6 -skew-x-[20deg] transition-all duration-300 group-hover:bg-[#404040]"
                style={{ minWidth: textMinWidth }}
              >
                <span
                  className={`block skew-x-[20deg] text-[18px] text-zinc-400 group-hover:text-white ${
                    isPreLine ? "whitespace-pre-line" : "whitespace-nowrap"
                  } tracking-tight`}
                >
                  {title}
                </span>
              </div>
            </div>
          </div>
        )
      },
    },

    // --- 3. ADDITIONAL PRODUCT ITEM ---
    AdditionalProductItem: {
      label: "Skew Image & Highlight Text",
      fields: {
        image: imageField("Product Image", { recommended: "600 × 360px" }),
        fontFamily: {
          type: "select",
          label: "Font family",
          options: [
            { label: "Default (inherit)", value: "" },
            {
              label: "System UI",
              value:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            { label: "Inter", value: "'Inter', sans-serif" },
            { label: "Geologica", value: "'Geologica', sans-serif" },
            { label: "Roboto", value: "'Roboto', sans-serif" },
            { label: "Open Sans", value: "'Open Sans', sans-serif" },
            { label: "Lato", value: "'Lato', sans-serif" },
            { label: "Poppins", value: "'Poppins', sans-serif" },
            { label: "Montserrat", value: "'Montserrat', sans-serif" },
            { label: "Playfair Display", value: "'Playfair Display', serif" },
            { label: "Merriweather", value: "'Merriweather', serif" },
            { label: "Georgia (serif)", value: "Georgia, serif" },
            {
              label: "Monospace",
              value: "'JetBrains Mono', 'Fira Code', monospace",
            },
          ],
        },
        textBackground: colorField("Φόντο κειμένου (μόνο το panel)"),
        accentLetterColor: colorField("Χρώμα τονισμένων γραμμάτων (highlight)"),
        highlightSizeDesktop: {
          type: "text",
          label: "Highlight size (desktop, e.g. 30px)",
        },
        restSizeDesktop: {
          type: "text",
          label: "Rest size (desktop, e.g. 25px)",
        },
        highlightSizeMobile: {
          type: "text",
          label: "Highlight size (mobile, e.g. 18px)",
        },
        restSizeMobile: {
          type: "text",
          label: "Rest size (mobile, e.g. 14px)",
        },
        popupOnClick: {
          type: "radio",
          label: "Open popup on click",
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ],
        },
        popupId: popupSelectField("Popup"),
        lines: {
          type: "array",
          label: "Lines",
          getItemSummary: (item: any) => {
            const segs = Array.isArray(item?.segments) ? item.segments : []
            return (
              segs
                .map((s: any) => `${s?.h || ""}${s?.r || ""}`)
                .join(" ")
                .trim() || "Line"
            )
          },
          arrayFields: {
            segments: {
              type: "array",
              label: "Segments",
              getItemSummary: (seg: any) => `${seg?.h || ""}${seg?.r || ""}`,
              arrayFields: {
                h: { type: "text", label: "Highlight (e.g. C)" },
                r: { type: "text", label: "Rest (e.g. ARBON)" },
              },
            },
          },
        },
      },
      defaultProps: {
        image: "/d2-turing-image/landing-pages/brake-kit/carbom-disc.png",
        fontFamily: "",
        textBackground: "#000000",
        accentLetterColor: "#3b82f6",
        highlightSizeDesktop: "30px",
        restSizeDesktop: "25px",
        highlightSizeMobile: "18px",
        restSizeMobile: "14px",
        popupOnClick: false,
        popupId: "",
        lines: [
          { segments: [{ h: "C", r: "ARBON" }] },
          { segments: [{ h: "D", r: "ISC" }] },
        ],
      },
      render: ({
                 image,
                 lines,
                 textBackground,
                 cardBackground,
                 accentLetterColor,
                 popupOnClick,
                 popupId,
                 fontFamily,
                 highlightSizeDesktop,
                 restSizeDesktop,
                 highlightSizeMobile,
                 restSizeMobile,
               }: any) => (
        <AdditionalProductItemView
          image={image}
          lines={lines}
          textBackground={textBackground}
          cardBackground={cardBackground}
          accentLetterColor={accentLetterColor}
          popupOnClick={popupOnClick}
          popupId={popupId}
          fontFamily={fontFamily}
          highlightSizeDesktop={highlightSizeDesktop}
          restSizeDesktop={restSizeDesktop}
          highlightSizeMobile={highlightSizeMobile}
          restSizeMobile={restSizeMobile}
        />
      ),
    },
  },
}

export const puckConfig = withAnimations(rawConfig)
export type PageData = Data

"use client"

import React, { useMemo } from "react"
import { usePopupRuntime } from "./PopupSystem"

interface ImageTextProps {
  imageSrc?: string
  imageAlt?: string
  heading?: string
  body?: any
  ctaText?: string
  ctaLink?: string
  textBackgroundColor?: string
  textColor?: string
  textPadding?: string
  textFontSize?: string
  textSkewX?: number
  textSkewY?: number
  textScale?: number
  imageMargin?: string
  textMargin?: string
  textResponsive1FontSize?: string
  textResponsive1Padding?: string
  textResponsive1Margin?: string
  textResponsive2FontSize?: string
  textResponsive2Padding?: string
  textResponsive2Margin?: string
  textOuterMinWidth?: string
  textResponsive1OuterMinWidth?: string
  textResponsive2OuterMinWidth?: string
  popupOnClick?: boolean
  popupId?: string
  popupTrigger?: "both" | "image" | "text" | "button"
  popupButtonLabel?: string
  gap?: string
  sectionPadding?: string
  forceSingleLine?: boolean
  singleLineOverflow?: "ellipsis" | "scroll" | "visible"
  imageMinHeight?: string
  imagePosition?: "left" | "right"
  imageRatio?: string
}

const generateSimpleId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export const ImageTextComponent: React.FC<ImageTextProps> = (props) => {
  const { openPopup } = usePopupRuntime()

  const uniqueId = useMemo(() => generateSimpleId(), [])

  const {
    imageSrc,
    imageAlt,
    heading,
    body,
    ctaText,
    ctaLink,
    textBackgroundColor = "transparent",
    textColor = "inherit",
    textPadding,
    textFontSize,
    textSkewX = 0,
    textSkewY = 0,
    textScale = 1,
    imageMargin,
    textMargin,
    textResponsive1FontSize,
    textResponsive1Padding,
    textResponsive1Margin,
    textResponsive2FontSize,
    textResponsive2Padding,
    textResponsive2Margin,
    textOuterMinWidth,
    textResponsive1OuterMinWidth,
    textResponsive2OuterMinWidth,
    popupOnClick,
    popupId,
    popupTrigger,
    gap = "40px",
    sectionPadding = "60px 24px",
    forceSingleLine,
    singleLineOverflow,
    imageMinHeight = "220px",
    imagePosition = "left",
    imageRatio = "1fr 1fr",
  } = props

  const colsRaw = imagePosition === "left" ? imageRatio : imageRatio.split(" ").reverse().join(" ")
  const gridColumns = colsRaw
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `minmax(0, ${t})`)
    .join(" ")

  const triggerType = String(popupTrigger || "both")
  const canTriggerImage = popupOnClick && popupId && (triggerType === "image" || triggerType === "both")
  const canTriggerText = popupOnClick && popupId && (triggerType === "text" || triggerType === "both")

  const handlePopupClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (popupId) openPopup(popupId)
  }

  const fSize1 = String(textResponsive1FontSize || textFontSize || "").trim()
  const pad1 = String(textResponsive1Padding || textPadding || "").trim()
  const marg1 = String(textResponsive1Margin || textMargin || "").trim()
  const mw1 = String(textResponsive1OuterMinWidth || textOuterMinWidth || "").trim()

  const fSize2 = String(textResponsive2FontSize || fSize1 || "").trim()
  const pad2 = String(textResponsive2Padding || pad1 || "").trim()
  const marg2 = String(textResponsive2Margin || marg1 || "").trim()
  const mw2 = String(textResponsive2OuterMinWidth || mw1 || "").trim()

  const componentCSS = `
    .it-wrapper-${uniqueId} {
      display: grid;
      grid-template-columns: ${gridColumns};
      gap: ${gap};
      padding: ${sectionPadding};
      max-width: 1100px;
      margin: 0 auto;
      align-items: center;
      width: 100%;
    }

    .it-image-box-${uniqueId} {
      overflow: hidden;
      border-radius: 8px;
      margin: ${imageMargin || "0"};
      min-width: 0;
      min-height: ${imageMinHeight};
      cursor: ${canTriggerImage ? "pointer" : "default"};
    }
    .it-image-${uniqueId} {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      min-height: ${imageMinHeight};
    }
    .it-image-placeholder-${uniqueId} {
      width: 100%;
      min-height: 300px;
      background-color: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .it-text-outer-${uniqueId} {
      margin: ${String(textMargin || "").trim() || "0"};
      height: fit-content;
      width: 100%;
      min-width: ${String(textOuterMinWidth || "").trim() || "0"};
      cursor: ${canTriggerText ? "pointer" : "default"};
      ${forceSingleLine && singleLineOverflow === "scroll" ? "overflow-x: auto; overflow-y: hidden;" : ""}
      ${forceSingleLine && singleLineOverflow === "visible" ? "overflow: visible;" : ""}
    }

    .it-text-inner-${uniqueId} {
      display: inline-block;
      min-width: 100%;
      max-width: ${forceSingleLine && singleLineOverflow === "visible" ? "none" : "100%"};
      background-color: ${textBackgroundColor};
      color: ${textColor};
      padding: ${String(textPadding || "").trim() || "0"};
      font-size: ${String(textFontSize || "").trim() || "inherit"};
      transform: skewX(${textSkewX}deg) skewY(${textSkewY}deg) scale(${textScale});
      transform-origin: center;
      width: 100%;
    }

    .it-text-content-${uniqueId} {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      min-width: 0;
      transform: skewX(${-textSkewX}deg) skewY(${-textSkewY}deg);
      transform-origin: center;
    }

    .it-single-line-${uniqueId} {
      ${forceSingleLine ? "white-space: nowrap;" : ""}
      ${forceSingleLine && singleLineOverflow === "ellipsis" ? "overflow: hidden; text-overflow: ellipsis; max-width: 100%;" : ""}
      ${forceSingleLine && singleLineOverflow === "visible" ? "overflow: visible; max-width: none;" : ""}
    }

    .it-heading-${uniqueId} {
      font-size: 1.5em;
      font-weight: 700;
      color: inherit;
      margin: 0;
    }

    .it-body-text-${uniqueId} {
      font-size: 1em;
      line-height: 1.7;
      color: inherit;
      margin: 0;
      ${!forceSingleLine ? "white-space: pre-wrap;" : ""}
    }

    .it-button-${uniqueId} {
      margin-top: 16px;
      display: inline-block;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
    }

    .it-button-cta-${uniqueId} {
      background-color: #000;
      color: #fff;
      border: none;
      font-size: 0.9rem;
      align-self: flex-start;
      padding: 12px 28px;
    }

    .it-button-popup-${uniqueId} {
      background: #000;
      color: inherit;
      border: 1px solid rgba(0,0,0,0.15);
      margin-top: ${ctaText ? "12px" : "16px"};
    }

    @media (max-width: 1200px) {
      .it-text-outer-${uniqueId} { margin: ${marg1 || "0"}; ${mw1 ? `min-width: ${mw1};` : ""} }
      .it-text-inner-${uniqueId} {
        font-size: ${fSize1 || "inherit"};
        padding: ${pad1 || "0"};
      }
    }

    @media (max-width: 780px) {
      .it-wrapper-${uniqueId} {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .it-text-outer-${uniqueId} { margin: ${marg2 || "0"}; ${mw2 ? `min-width: ${mw2};` : ""} }
      .it-text-inner-${uniqueId} {
        font-size: ${fSize2 || "inherit"};
        padding: ${pad2 || "0"};
      }
    }
  `

  const ImageElement = (
    <div
      className={`it-image-box-${uniqueId}`}
      onMouseDownCapture={canTriggerImage ? (e) => e.stopPropagation() : undefined}
      onClickCapture={canTriggerImage ? handlePopupClick : undefined}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={imageAlt} className={`it-image-${uniqueId}`} />
      ) : (
        <div className={`it-image-placeholder-${uniqueId}`}>Add image URL</div>
      )}
    </div>
  )

  const TextElement = (
    <div
      className={`it-text-outer-${uniqueId}`}
      onMouseDownCapture={canTriggerText ? (e) => e.stopPropagation() : undefined}
      onClickCapture={canTriggerText ? handlePopupClick : undefined}
    >
      <div className={`it-text-inner-${uniqueId}`}>
        <div className={`it-text-content-${uniqueId}`}>
          <h2 className={`it-heading-${uniqueId} it-single-line-${uniqueId}`}>{heading}</h2>

          {typeof body === "string" ? (
            <div
              className={`it-body-text-${uniqueId} ${forceSingleLine ? `it-single-line-${uniqueId}` : ""}`}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : (
            <div className={`it-body-text-${uniqueId} ${forceSingleLine ? `it-single-line-${uniqueId}` : ""}`}>
              {body}
            </div>
          )}

          {ctaText && (!popupOnClick || popupTrigger !== "button") && (
            <a href={ctaLink} className={`it-button-${uniqueId} it-button-cta-${uniqueId}`}>
              {ctaText}
            </a>
          )}

          {ctaText && popupOnClick && popupTrigger === "button" && popupId && (
            <button
              type="button"
              onClick={handlePopupClick}
              className={`it-button-${uniqueId} it-button-popup-${uniqueId}`}
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: componentCSS }} />

      <div className={`it-wrapper-${uniqueId}`}>
        {imagePosition === "left" ? (
          <>
            {ImageElement}
            {TextElement}
          </>
        ) : (
          <>
            {TextElement}
            {ImageElement}
          </>
        )}
      </div>
    </>
  )
}


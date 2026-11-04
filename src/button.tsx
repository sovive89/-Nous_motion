import React from "react";import "./style.css";
export type ButtonVariant="pulse"|"ripple"|"glow"|"magnetic"|"scale"|"slide"|"success"|"loading"|"notification"|"alert";
export function NousButton({variant="scale",color="#ff6b00",loading=false,children,style,className="",...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&{variant?:ButtonVariant;color?:string;loading?:boolean}){
return <button {...props} disabled={props.disabled||loading} aria-busy={loading} className={`nous-button nous-btn-${variant} ${className}`} style={{...style,"--nous-color":color} as React.CSSProperties}>{loading?"Aguarde…":children}</button>}

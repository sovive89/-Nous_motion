import React from "react";import "./style.css";
export function NousTransition({children,type="fade",duration=250}:{children:React.ReactNode;type?:"fade"|"slide"|"scale"|"collapse";duration?:number}){return <div className={"nous-transition nous-transition-"+type} style={{animationDuration:duration+"ms"}}>{children}</div>}

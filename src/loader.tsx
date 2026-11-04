import React from "react";
import "./style.css";
export type LoaderTemplate = "orbit"|"pulse"|"dots"|"wave"|"progress"|"logo";
export type LoaderState = "idle"|"loading"|"progress"|"success"|"error";
export interface LoaderProps {template?:LoaderTemplate;state?:LoaderState;primaryColor?:string;size?:number;speed?:number;progress?:number;logo?:string;label?:string}
export function NousLoader({template="orbit",state="loading",primaryColor="#ff6b00",size=48,speed=1,progress=0,logo,label}:LoaderProps){
 const style={"--nous-color":primaryColor,"--nous-size":size+"px","--nous-duration":1/Math.max(speed,.1)+"s"} as React.CSSProperties;
 if(state==="idle")return null;
 const status=state==="success"?"Concluído":state==="error"?"Erro":label||"Carregando";
 return <span role="status" aria-label={status} className={"nous-loader nous-"+template} style={style}>
 {state==="success"?"✓":state==="error"?"!":template==="dots"?<><i/><i/><i/></>:template==="wave"?<><b/><b/><b/><b/></>:template==="progress"?<span className="nous-track"><span style={{width:Math.min(100,Math.max(0,progress))+"%"}}/></span>:template==="logo"&&logo?<img src={logo} alt=""/>:<span className="nous-shape"/>}
 {label&&<span className="nous-label">{label}</span>}</span>;
}

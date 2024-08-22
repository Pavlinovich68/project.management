'use client'
import { WaitingResult } from "@/models/WaitingResult";
import React, {useRef, useState, useEffect} from "react";
import ReactDOMServer from 'react-dom/server';
import SentimentSatisfied from '@mui/icons-material/SentimentSatisfied';
import SentimentDissatisfied from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfied from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import trafficLight from "@/models/enums/traffic_light";

const WaitingResultRow = ({data}: {data: WaitingResult}) => {
   const icon = (state: trafficLight) => {
      switch (state) {
         case trafficLight.green: return  <SentimentSatisfied style={{fontSize: "48px"}} className="text-green-300"/>;
         case trafficLight.yellow: return  <SentimentDissatisfied style={{fontSize: "48px"}} className="text-yellow-300"/>;
         case trafficLight.red: return  <SentimentVeryDissatisfied style={{fontSize: "48px"}} className="text-red-300"/>;
      }
   }
   return (
      <div className="grid">
         <div className="col-1 vertical-align-middle text-center" style={{fontSize: "48px"}}>
            {icon(data.trafficLight)}
         </div>
         <div className="col-11 vertical-align-middle html-text-doted" dangerouslySetInnerHTML={{__html: data.text}}>
         </div>
      </div>
   );
};

export default WaitingResultRow;

import React from "react";
import { Avatar } from 'primereact/avatar';
import { classNames } from "primereact/utils";
import styles from "./calendar/styles.module.scss";

const ItrEventCard = ({item} : any) => {
   return (
      <div className={classNames('card', styles.itrEventCard)}>
         <div className="grid">
            <div className={classNames('col-fixed', styles.divisionLogo)}>
               <Avatar icon="pi pi-user" size="large" shape="circle" className='itr-avatar' image={item.logo}/>
            </div>
            <div className={classNames("col", styles.divisionCell)}>
               <div className={styles.divisionName}>{item.division}</div>
               <div>{item.timeInterval}</div>
            </div>
         </div>
         <div>{item.comment}</div>
         <hr className={styles.cardHr}/>
         <div className={styles.ownerName}>{item.owner}: {item.phone}, E-Mail: {item.email}</div>
      </div>
   );
}

export default ItrEventCard;